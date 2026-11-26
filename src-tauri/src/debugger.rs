//! The debugger of a C64 behind a VICE binary monitor: the Ultimate emulator or VICE. The
//! connection stays open for the session, so a stop arrives on it as an event.

use std::collections::{HashMap, HashSet};
use std::io::{Read as _, Write as _};
use std::net::{SocketAddr, TcpStream};
use std::sync::Mutex;
use std::time::{Duration, Instant};

use crate::vice_monitor::Monitor;

/// The machine takes a changed checkpoint list between its run slices: time for that before the
/// CPU goes, or the next instructions run on the old list.
const CHECKPOINT_SETTLE: Duration = Duration::from_millis(20);

/// Where nothing runs: gives the machine a list to rebuild from when there is no breakpoint.
const PLACEHOLDER_CHECKPOINT: u16 = 0xFFFF;


/// How a running CPU is stopped.
pub enum Halt {
    /// Monitor commands do not stop ue2emu's CPU, unlike VICE's: `c64 halt` on its control port
    /// does, and the steps and EXIT of the monitor then work on that stop as on a checkpoint's.
    ControlPort(u16),
    /// VICE stops on any monitor command.
    Monitor,
}

/// The debugger's connection. It stays open: a stop arrives on it as an event.
pub struct DebugSession {
    pub monitor: Monitor,
    /// Address -> checkpoint number.
    pub checkpoints: HashMap<u16, u32>,
    halt: Halt,
    /// Stopped by `c64 halt`: EXIT alone does not always let go of that.
    halted: bool,
    /// `until_return` leaves its target in the machine's exec table: see `sync_checkpoints`.
    rearm: bool,
}

static DEBUG: Mutex<Option<DebugSession>> = Mutex::new(None);

impl DebugSession {
    pub fn new(monitor: Monitor, halt: Halt) -> Self {
        DebugSession { monitor, checkpoints: HashMap::new(), halt, halted: false, rearm: false }
    }
}

/// The session the commands work on; one replaces another.
pub fn install(session: DebugSession) {
    end_debug();
    *DEBUG.lock().unwrap() = Some(session);
}


pub fn end_debug() {
    // Dropping the monitor lets the CPU go.
    let Some(mut session) = DEBUG.lock().unwrap().take() else { return };
    // What stays when the connection goes, the machine clears itself.
    let _ = sync_checkpoints(&mut session, &[]);
    let _ = release_cpu(&mut session);
}

/// The monitor window must not resume a CPU the debugger has stopped.
pub fn debug_active() -> bool {
    DEBUG.lock().unwrap().is_some()
}


/// Only right before the CPU is let go, all changes in one write. ue2emu 0.6.0 knows its compiled
/// exec table by the address of the list it came from (`dbg_exec_table`), and refreshes it only in
/// a free run, not in a step: two lists built with no free run between them can share an address,
/// and the CPU then runs on the old table, passing breakpoints without a stop.
///
/// After `until_return` the list is rebuilt whatever it holds, with a placeholder if empty. This is
/// a precaution: the C64 clock was seen frozen at the target after a step out of code that never
/// returns, and this rebuild does NOT cure that; the cause is still open.
pub fn sync_checkpoints(session: &mut DebugSession, wanted: &[u16]) -> Result<(), String> {
    let mut wanted: HashSet<u16> = wanted.iter().copied().collect();
    let rebuild = std::mem::take(&mut session.rearm);
    if rebuild && wanted.is_empty() {
        wanted.insert(PLACEHOLDER_CHECKPOINT);
    }
    let gone: Vec<u16> =
        session.checkpoints.keys().filter(|a| rebuild || !wanted.contains(a)).copied().collect();
    let new: Vec<u16> =
        wanted.iter().filter(|a| rebuild || !session.checkpoints.contains_key(a)).copied().collect();
    if gone.is_empty() && new.is_empty() {
        return Ok(());
    }
    let delete: Vec<u32> = gone.iter().filter_map(|a| session.checkpoints.remove(a)).collect();
    let numbers = session.monitor.update_checkpoints(&delete, &new)?;
    session.checkpoints.extend(new.into_iter().zip(numbers));
    std::thread::sleep(CHECKPOINT_SETTLE);
    Ok(())
}


/// One line on the control port, with its reply.
pub fn control_line(port: u16, line: &str) -> Result<String, String> {
    let address = SocketAddr::from(([127, 0, 0, 1], port));
    let mut stream = TcpStream::connect_timeout(&address, Duration::from_secs(1)).map_err(|e| e.to_string())?;
    // `expect-c64` answers when the text is there, up to the time it was given
    stream.set_read_timeout(Some(Duration::from_secs(10))).map_err(|e| e.to_string())?;
    stream.write_all(format!("{line}\n").as_bytes()).map_err(|e| e.to_string())?;
    let mut reply = String::new();
    let mut chunk = [0u8; 1024];
    while !reply.lines().any(|l| l.trim() == "ok" || l.starts_with("error line")) {
        let n = stream.read(&mut chunk).map_err(|e| e.to_string())?;
        if n == 0 {
            break;
        }
        reply.push_str(&String::from_utf8_lossy(&chunk[..n]));
    }
    if let Some(error) = reply.lines().find(|l| l.starts_with("error line")) {
        return Err(error.to_string());
    }
    Ok(reply)
}

/// Stops a running CPU; gives the PC.
pub fn break_cpu(session: &mut DebugSession) -> Result<Option<u16>, String> {
    match session.halt {
        Halt::ControlPort(port) => {
            control_line(port, "monitor c64 halt")?;
            session.halted = true;
        }
        Halt::Monitor => session.monitor.stop()?,
    }
    session.monitor.note_stop()
}

pub fn release_cpu(session: &mut DebugSession) -> Result<(), String> {
    session.monitor.resume()?;
    if std::mem::take(&mut session.halted) {
        if let Halt::ControlPort(port) = session.halt {
            control_line(port, "monitor c64 go")?;
        }
    }
    Ok(())
}

/// The control port of a ue2emu session, for diagnostics.
#[cfg(test)]
pub fn control_port(session: &DebugSession) -> Option<u16> {
    match session.halt {
        Halt::ControlPort(port) => Some(port),
        Halt::Monitor => None,
    }
}

pub fn with_debug<T>(job: impl FnOnce(&mut DebugSession) -> Result<T, String>) -> Result<T, String> {
    let mut guard = DEBUG.lock().unwrap();
    let session = guard.as_mut().ok_or("no debug session")?;
    job(session)
}

async fn debug_job<T: Send + 'static>(
    job: impl FnOnce(&mut DebugSession) -> Result<T, String> + Send + 'static,
) -> Result<T, String> {
    tauri::async_runtime::spawn_blocking(move || with_debug(job))
        .await
        .map_err(|e| e.to_string())?
}

fn debug_reply<T: serde::Serialize>(result: Result<T, String>) -> serde_json::Value {
    match result {
        Ok(value) => serde_json::json!({ "ok": true, "value": value }),
        Err(error) => serde_json::json!({ "ok": false, "error": error }),
    }
}

fn stack_pointer(session: &mut DebugSession) -> Result<u16, String> {
    let monitor = &mut session.monitor;
    let sp = monitor.register_id("SP")?;
    Ok(monitor.registers()?.iter().find(|(id, _)| *id == sp).map(|(_, v)| *v).unwrap_or(0xFF) & 0xFF)
}

pub fn wait_stop(session: &mut DebugSession, patience: Duration) -> Result<Option<u16>, String> {
    let deadline = Instant::now() + patience;
    while session.monitor.stop_pc().is_none() && Instant::now() < deadline {
        session.monitor.poll_events(Duration::from_millis(5))?;
    }
    Ok(session.monitor.stop_pc())
}

/// One instruction, with the PC read back. Right after another run the machine can answer a step
/// without doing it; a JMP to itself does not move either, and is simply asked again.
fn advance_checked(session: &mut DebugSession, from: u16) -> Result<(), String> {
    for _ in 0..3 {
        session.monitor.advance(false)?;
        wait_stop(session, Duration::from_millis(300))?;
        if session.monitor.note_stop()? != Some(from) {
            break;
        }
        std::thread::sleep(Duration::from_millis(20));
    }
    Ok(())
}

/// While the CPU stands the CIAs and the VIC go on, so an IRQ is nearly always due on the next
/// step, and stepping would land in the KERNAL each time: the step runs with the I flag set. An
/// NMI can still take it.
fn step_instruction(session: &mut DebugSession) -> Result<(), String> {
    const FLAG_I: u16 = 0x04;
    let pc = session.monitor.stop_pc().unwrap_or(0);
    let cpu = session.monitor.bank_id("cpu")?;
    let opcode = session.monitor.read_memory(pc, pc, cpu)?.first().copied().unwrap_or(0);
    let status = session.monitor.register_id("FL")?;
    let flags = session.monitor.registers()?.iter().find(|(id, _)| *id == status).map(|(_, v)| *v).unwrap_or(0);
    let masked = flags & FLAG_I == 0;
    if masked {
        session.monitor.set_register(status, flags | FLAG_I)?;
    }
    advance_checked(session, pc)?;
    if !masked {
        return Ok(());
    }
    // These set the flag themselves.
    const SEI: u8 = 0x78;
    const CLI: u8 = 0x58;
    const PLP: u8 = 0x28;
    const RTI: u8 = 0x40;
    const PHP: u8 = 0x08;
    if [SEI, CLI, PLP, RTI].contains(&opcode) {
        return Ok(());
    }
    let now = session.monitor.registers()?.iter().find(|(id, _)| *id == status).map(|(_, v)| *v).unwrap_or(flags);
    session.monitor.set_register(status, now & !FLAG_I)?;
    if opcode == PHP {
        let sp = stack_pointer(session)?;
        let ram = session.monitor.bank_id("ram")?;
        let at = 0x0100 | (sp.wrapping_add(1) & 0xFF);
        let pushed = session.monitor.read_memory(at, at, cpu)?.first().copied().unwrap_or(0);
        session.monitor.write_memory(at, &[pushed & !(FLAG_I as u8)], ram)?;
    }
    Ok(())
}

/// Over a JSR the step goes into the routine with the I flag set, then the routine runs back
/// with its IRQs live: one that waits for a raster interrupt would hang otherwise.
fn step_over(session: &mut DebugSession, breakpoints: &[u16]) -> Result<(), String> {
    const JSR: u8 = 0x20;
    let pc = session.monitor.stop_pc().unwrap_or(0);
    let cpu = session.monitor.bank_id("cpu")?;
    let is_jsr = session.monitor.read_memory(pc, pc, cpu)?.first().copied() == Some(JSR);
    step_instruction(session)?;
    let stopped_on_breakpoint = session.monitor.stop_pc().is_some_and(|at| breakpoints.contains(&at));
    if is_jsr && !stopped_on_breakpoint {
        session.rearm = true;
        session.monitor.until_return()?;
    }
    Ok(())
}

/// Breakpoints changed since the last run apply from the next Continue (`sync_checkpoints`).
pub fn step(session: &mut DebugSession, mode: u8, breakpoints: &[u16]) -> Result<(), String> {
    if matches!(session.halt, Halt::Monitor) && mode != 0 {
        return step_to_return(session, mode, breakpoints);
    }
    match mode {
        2 => {
            session.rearm = true;
            session.monitor.until_return()
        }
        1 => step_over(session, breakpoints),
        _ => step_instruction(session),
    }
}

/// VICE: a run to a checkpoint at the return address (over: behind the JSR; out: on the stack).
/// VICE's EXECUTE_UNTIL_RETURN stays armed when no return comes, and stops at the next RTS,
/// in a later session too; the checkpoint goes with the next Continue.
fn step_to_return(session: &mut DebugSession, mode: u8, breakpoints: &[u16]) -> Result<(), String> {
    const JSR: u8 = 0x20;
    let pc = session.monitor.stop_pc().unwrap_or(0);
    let target = if mode == 1 {
        let cpu = session.monitor.bank_id("cpu")?;
        if session.monitor.read_memory(pc, pc, cpu)?.first().copied() != Some(JSR) {
            return step_instruction(session);
        }
        pc.wrapping_add(3)
    } else {
        let sp = stack_pointer(session)?;
        let cpu = session.monitor.bank_id("cpu")?;
        let at = |delta: u16| 0x0100 | (sp.wrapping_add(delta) & 0xFF);
        let low = session.monitor.read_memory(at(1), at(1), cpu)?.first().copied().unwrap_or(0);
        let high = session.monitor.read_memory(at(2), at(2), cpu)?.first().copied().unwrap_or(0);
        u16::from_le_bytes([low, high]).wrapping_add(1)
    };
    let mut with_target = breakpoints.to_vec();
    with_target.push(target);
    continue_cpu(session, &with_target)
}

/// A checkpoint at the PC would stop the run on the spot, so from a breakpoint the first
/// instruction is a step. If it lands on another breakpoint, the CPU stays stopped there.
pub fn continue_cpu(session: &mut DebugSession, breakpoints: &[u16]) -> Result<(), String> {
    if session.monitor.stop_pc().is_some_and(|pc| breakpoints.contains(&pc)) {
        step_instruction(session)?;
        if session.monitor.stop_pc().is_some_and(|pc| breakpoints.contains(&pc)) {
            return Ok(());
        }
    }
    sync_checkpoints(session, breakpoints)?;
    release_cpu(session)
}


/// `value`: the PC when the CPU is stopped, else null. An error ends the session.
#[tauri::command]
pub async fn dbg_poll() -> serde_json::Value {
    let result = debug_job(|session| {
        session.monitor.poll_events(Duration::from_millis(1))?;
        Ok(session.monitor.stop_pc())
    })
    .await;
    if result.is_err() {
        let _ = tauri::async_runtime::spawn_blocking(end_debug).await;
    }
    debug_reply(result)
}

/// The registers by name, the code around the PC and the memory view of a stopped CPU; `ranges`
/// (start, length) are read too (the debugger's variables), at most 64 of at most 256 bytes.
#[tauri::command]
pub async fn dbg_snapshot(mem_address: u16, ranges: Option<Vec<(u16, u16)>>) -> serde_json::Value {
    debug_reply(debug_job(move |session| {
        let monitor = &mut session.monitor;
        let cpu = monitor.bank_id("cpu")?;
        let names = monitor.register_names()?;
        let values = monitor.registers()?;
        let mut registers = serde_json::Map::new();
        for (id, value) in values {
            if let Some((_, name)) = names.iter().find(|(known, _)| *known == id) {
                registers.insert(name.clone(), serde_json::json!(value));
            }
        }
        let pc = registers.get("PC").and_then(|v| v.as_u64()).unwrap_or(0) as u16;
        let code_start = pc.saturating_sub(40);
        let code = monitor.read_memory(code_start, code_start.saturating_add(175), cpu)?;
        let memory_base = mem_address & 0xFFF8;
        let memory = monitor.read_memory(memory_base, memory_base.saturating_add(127), cpu)?;
        let mut extra = Vec::new();
        for (start, length) in ranges.unwrap_or_default().into_iter().take(64) {
            if length == 0 {
                continue;
            }
            let end = start.saturating_add(length.min(256) - 1);
            extra.push(serde_json::json!([start, monitor.read_memory(start, end, cpu)?]));
        }
        Ok(serde_json::json!({
            "ranges": extra,
            "registers": registers,
            "codeStart": code_start,
            "code": code,
            "memoryBase": memory_base,
            "memory": memory,
        }))
    })
    .await)
}

#[tauri::command]
pub async fn dbg_continue(breakpoints: Vec<u16>) -> serde_json::Value {
    debug_reply(debug_job(move |session| continue_cpu(session, &breakpoints)).await)
}

/// `mode`: 0 into, 1 over, 2 out.
#[tauri::command]
pub async fn dbg_step(mode: u8, breakpoints: Vec<u16>) -> serde_json::Value {
    debug_reply(debug_job(move |session| step(session, mode, &breakpoints)).await)
}

#[tauri::command]
pub async fn dbg_break() -> serde_json::Value {
    debug_reply(debug_job(break_cpu).await)
}

#[tauri::command]
pub async fn dbg_set_register(name: String, value: u16) -> serde_json::Value {
    debug_reply(debug_job(move |session| {
        let id = session.monitor.register_id(&name)?;
        session.monitor.set_register(id, value)
    })
    .await)
}

#[tauri::command]
pub async fn dbg_end() {
    let _ = tauri::async_runtime::spawn_blocking(end_debug).await;
}

