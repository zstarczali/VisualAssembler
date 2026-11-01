// UE2-C64U-Emulator (github.com/Jondalar/UE2-C64U-Emulator): the unmodified Ultimate
// firmware on the host. It serves the same REST API as a real C64 Ultimate, so a run is
// the same `runners:run_prg` upload, to a machine VA starts on demand and keeps running.

use std::collections::{HashMap, HashSet};
use std::fs::File;
use std::io::{Read as _, Write as _};
use std::net::{SocketAddr, TcpStream};
use std::path::{Path, PathBuf};
use std::process::{Child, Command, Stdio};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Mutex;
use std::time::{Duration, Instant};

use tauri::{AppHandle, Manager};
use tauri_plugin_dialog::DialogExt;

use crate::vice_monitor::Monitor;

const DEFAULT_WEB_PORT: u16 = 8064;
/// DHCP in the firmware comes after the boot, and the first boot also seeds the flash.
const BOOT_TIMEOUT: Duration = Duration::from_secs(90);
/// `quit` writes the flash image back: killing earlier would lose the guest's changes.
const QUIT_TIMEOUT: Duration = Duration::from_secs(8);

/// The Commodore firmware boots on its own C64 ROMs, so of the roms folder only the window's
/// overlay font is a must; `--c64-roms` takes KERNAL, BASIC and CHAR when they are there.
const OVERLAY_FONT: &str = "chars.bin";
const OVERLAY_FONT_SIZE: u64 = 2048;

/// The Commodore firmware ships with its web server off (upstream has it on); `--settings`
/// is written into the flash at every start.
/// The machine takes a changed checkpoint list between its run slices: time for that before the
/// CPU goes, or the next instructions run on the old list.
const CHECKPOINT_SETTLE: Duration = Duration::from_millis(20);

/// Where nothing runs: gives the machine a list to rebuild from when there is no breakpoint.
const PLACEHOLDER_CHECKPOINT: u16 = 0xFFFF;

const NETWORK_SETTINGS: &str = "[Network Settings]\nWeb Remote Control Service=Enabled\n";

/// `ue2emu settings` lists every setting as `; choice | choice` above `Name=default`, under its
/// `[Store]`. The turbo registers ($D031) are a choice of "Turbo Control" named per firmware
/// ("C64U Turbo Registers", "U64 Turbo Registers"), and a choice the firmware lacks stops the start.
fn turbo_registers_line(listing: &str) -> Option<String> {
    let mut store = "";
    let mut choices = "";
    for line in listing.lines().map(str::trim) {
        if line.starts_with('[') && line.ends_with(']') {
            store = line;
        } else if let Some(list) = line.strip_prefix(';') {
            choices = list;
        } else if line.starts_with("Turbo Control=") {
            let choice = choices.split('|').map(str::trim).find(|c| c.ends_with("Turbo Registers"))?;
            return Some(format!("{store}\nTurbo Control={choice}\n"));
        }
    }
    None
}

static TURBO_LINES: Mutex<Option<HashMap<String, Option<String>>>> = Mutex::new(None);

/// Asked once per emulator and firmware.
fn turbo_settings(settings: &Settings) -> Option<String> {
    let key = format!("{}|{}", settings.exe, settings.firmware);
    if let Some(known) = TURBO_LINES.lock().unwrap().get_or_insert_with(HashMap::new).get(&key) {
        return known.clone();
    }
    let line = no_console(&mut Command::new(&settings.exe))
        .args(["settings", "--firmware", &settings.firmware])
        .stdin(Stdio::null())
        .output()
        .ok()
        .filter(|output| output.status.success())
        .and_then(|output| turbo_registers_line(&String::from_utf8_lossy(&output.stdout)));
    TURBO_LINES.lock().unwrap().get_or_insert_with(HashMap::new).insert(key, line.clone());
    line
}

struct Instance {
    child: Child,
    control_port: u16,
    /// Changed settings restart the machine.
    signature: String,
}

static INSTANCE: Mutex<Option<Instance>> = Mutex::new(None);
static STARTING: AtomicBool = AtomicBool::new(false);
/// The monitor window follows the run mode: VICE and the emulator may both be open.
static MONITOR_ON_UE2: AtomicBool = AtomicBool::new(false);

/// The debugger's connection. It stays open: a stop arrives on it as an event.
struct DebugSession {
    monitor: Monitor,
    /// Address -> checkpoint number.
    checkpoints: HashMap<u16, u32>,
    control_port: u16,
    /// Stopped by `c64 halt`: EXIT alone does not always let go of that.
    halted: bool,
    /// `until_return` leaves its target in the machine's exec table: see `sync_checkpoints`.
    rearm: bool,
}

static DEBUG: Mutex<Option<DebugSession>> = Mutex::new(None);

struct StartingGuard;
impl Drop for StartingGuard {
    fn drop(&mut self) {
        STARTING.store(false, Ordering::SeqCst);
    }
}

#[derive(Debug, PartialEq)]
struct Ue2Error {
    code: &'static str,
    detail: String,
}

fn err(code: &'static str, detail: impl Into<String>) -> Ue2Error {
    Ue2Error { code, detail: detail.into() }
}

#[derive(Clone)]
struct Settings {
    exe: String,
    firmware: String,
    roms: String,
    web_port: u16,
}

fn detect_exe() -> String {
    let exe = if cfg!(target_os = "windows") { "ue2emu.exe" } else { "ue2emu" };
    if let Some(paths) = std::env::var_os("PATH") {
        for dir in std::env::split_paths(&paths) {
            let candidate = dir.join(exe);
            if candidate.is_file() {
                return candidate.to_string_lossy().to_string();
            }
        }
    }
    if cfg!(target_os = "windows") {
        return String::new();
    }
    ["/opt/homebrew/bin/ue2emu", "/usr/local/bin/ue2emu"]
        .iter()
        .find(|c| Path::new(c).is_file())
        .map(|c| c.to_string())
        .unwrap_or_default()
}

fn settings_from(cfg: &serde_json::Value) -> Settings {
    let section = &cfg["ue2emu"];
    let text = |key: &str| section[key].as_str().unwrap_or("").to_string();
    let exe = text("exe");
    Settings {
        exe: if !exe.is_empty() && Path::new(&exe).is_file() { exe } else { detect_exe() },
        firmware: text("firmware"),
        roms: text("roms"),
        web_port: section["webPort"]
            .as_u64()
            .and_then(|p| u16::try_from(p).ok())
            .filter(|p| valid_web_port(*p))
            .unwrap_or(DEFAULT_WEB_PORT),
    }
}

/// The control and VICE monitor ports are the next two.
fn valid_web_port(port: u16) -> bool {
    (1024..=65533).contains(&port)
}

fn overlay_font_present(dir: &Path) -> bool {
    std::fs::metadata(dir.join(OVERLAY_FONT))
        .map(|m| m.is_file() && m.len() == OVERLAY_FONT_SIZE)
        .unwrap_or(false)
}

fn validate(settings: &Settings) -> Result<(), Ue2Error> {
    if settings.exe.is_empty() || !Path::new(&settings.exe).is_file() {
        return Err(err("notConfigured", "ue2emu"));
    }
    if settings.firmware.is_empty() || !Path::new(&settings.firmware).is_file() {
        return Err(err("notConfigured", "firmware"));
    }
    if settings.roms.is_empty() || !Path::new(&settings.roms).is_dir() {
        return Err(err("notConfigured", "roms"));
    }
    if !overlay_font_present(Path::new(&settings.roms)) {
        return Err(err("romsInvalid", format!("{OVERLAY_FONT} ({OVERLAY_FONT_SIZE})")));
    }
    Ok(())
}

/// One flash image per firmware: `install` fills it from that firmware's updater, and the
/// firmwares keep `/flash` in different places.
fn flash_path(dir: &Path, firmware: &str) -> PathBuf {
    let stem = Path::new(firmware).file_stem().and_then(|s| s.to_str()).unwrap_or("firmware");
    dir.join(format!("{stem}.flash.bin"))
}

fn is_updater(firmware: &str) -> bool {
    Path::new(firmware)
        .extension()
        .and_then(|e| e.to_str())
        .map(|e| e.eq_ignore_ascii_case("ue2"))
        .unwrap_or(false)
}

fn install_args(settings: &Settings, flash: &Path) -> Vec<String> {
    vec![
        "install".into(),
        "--update".into(),
        settings.firmware.clone(),
        "--flash".into(),
        flash.to_string_lossy().to_string(),
        "--roms".into(),
        settings.roms.clone(),
        "--yes".into(),
        "--c64-roms".into(),
    ]
}

fn run_args(settings: &Settings, flash: &Path, network_cfg: &Path) -> Vec<String> {
    vec![
        "run".into(),
        "--settings".into(),
        network_cfg.to_string_lossy().to_string(),
        "--firmware".into(),
        settings.firmware.clone(),
        "--roms".into(),
        settings.roms.clone(),
        "--flash".into(),
        flash.to_string_lossy().to_string(),
        "--c64-roms".into(),
        "--net".into(),
        "user".into(),
        "--web-port".into(),
        settings.web_port.to_string(),
        "--control".into(),
        format!("127.0.0.1:{}", settings.web_port + 1),
        format!("--vice-monitor=127.0.0.1:{}", settings.web_port + 2),
    ]
}

fn no_console(command: &mut Command) -> &mut Command {
    #[cfg(target_os = "windows")]
    {
        use std::os::windows::process::CommandExt;
        const CREATE_NO_WINDOW: u32 = 0x08000000;
        command.creation_flags(CREATE_NO_WINDOW);
    }
    command
}

fn tail(text: &str, lines: usize) -> String {
    let all: Vec<&str> = text.lines().filter(|l| !l.trim().is_empty()).collect();
    all[all.len().saturating_sub(lines)..].join("\n")
}

/// Into a temporary name, so a failed install does not count as a filled flash next time.
fn install_flash(settings: &Settings, flash: &Path) -> Result<(), Ue2Error> {
    let temp = flash.with_extension("installing");
    let _ = std::fs::remove_file(&temp);
    let output = no_console(&mut Command::new(&settings.exe))
        .args(install_args(settings, &temp))
        .current_dir(flash.parent().unwrap_or(Path::new(".")))
        .stdin(Stdio::null())
        .output()
        .map_err(|e| err("startFailed", e.to_string()))?;
    if !output.status.success() {
        let _ = std::fs::remove_file(&temp);
        return Err(err("installFailed", tail(&String::from_utf8_lossy(&output.stderr), 8)));
    }
    std::fs::rename(&temp, flash).map_err(|e| err("installFailed", e.to_string()))
}

fn http_client(timeout: Duration) -> Result<reqwest::Client, Ue2Error> {
    // A system proxy must not get the loopback requests.
    reqwest::Client::builder()
        .no_proxy()
        .timeout(timeout)
        .build()
        .map_err(|e| err("runFailed", e.to_string()))
}

/// The web server is up only well after the process: until then the proxy closes the
/// connection without an answer.
async fn rest_ready(web_port: u16) -> bool {
    let Ok(client) = http_client(Duration::from_secs(2)) else { return false };
    match client.get(format!("http://127.0.0.1:{web_port}/v1/info")).send().await {
        Ok(response) => response.status().is_success(),
        Err(_) => false,
    }
}

async fn upload_prg(web_port: u16, prg: Vec<u8>) -> Result<(), Ue2Error> {
    post_prg(web_port, "run_prg", prg).await
}

async fn post_prg(web_port: u16, runner: &str, prg: Vec<u8>) -> Result<(), Ue2Error> {
    let response = http_client(Duration::from_secs(30))?
        .post(format!("http://127.0.0.1:{web_port}/v1/runners:{runner}"))
        .header("Content-Type", "application/octet-stream")
        .body(prg)
        .send()
        .await
        .map_err(|e| err("runFailed", e.to_string()))?;
    let status = response.status();
    if status.is_success() {
        return Ok(());
    }
    let text = response.text().await.unwrap_or_default();
    Err(err("runFailed", format!("HTTP {}: {}", status.as_u16(), text.trim())))
}

async fn pause(duration: Duration) {
    let _ = tauri::async_runtime::spawn_blocking(move || std::thread::sleep(duration)).await;
}

fn signature(settings: &Settings) -> String {
    format!("{}|{}|{}|{}", settings.exe, settings.firmware, settings.roms, settings.web_port)
}

/// `Some(true)`: ours, same settings; `Some(false)`: ours, other settings; `None`: none alive.
fn instance_state(wanted: &str) -> Option<bool> {
    let mut guard = INSTANCE.lock().unwrap();
    let alive = match guard.as_mut() {
        Some(instance) => matches!(instance.child.try_wait(), Ok(None)),
        None => false,
    };
    if !alive {
        *guard = None;
        return None;
    }
    guard.as_ref().map(|instance| instance.signature == wanted)
}

fn end_debug() {
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

fn stop_instance() -> bool {
    end_debug();
    let Some(mut instance) = INSTANCE.lock().unwrap().take() else { return false };
    if matches!(instance.child.try_wait(), Ok(Some(_))) {
        return false;
    }
    let address = SocketAddr::from(([127, 0, 0, 1], instance.control_port));
    if let Ok(mut stream) = TcpStream::connect_timeout(&address, Duration::from_secs(1)) {
        let _ = stream.write_all(b"quit\n");
    }
    let deadline = Instant::now() + QUIT_TIMEOUT;
    while Instant::now() < deadline {
        if matches!(instance.child.try_wait(), Ok(Some(_))) {
            return true;
        }
        std::thread::sleep(Duration::from_millis(100));
    }
    let _ = instance.child.kill();
    let _ = instance.child.wait();
    true
}

/// The VICE binary monitor to use instead of VICE's own, when the run mode is the emulator.
pub fn monitor_port() -> Option<u16> {
    if !MONITOR_ON_UE2.load(Ordering::SeqCst) {
        return None;
    }
    instance_monitor_port()
}

fn instance_monitor_port() -> Option<u16> {
    let mut guard = INSTANCE.lock().unwrap();
    let instance = guard.as_mut()?;
    matches!(instance.child.try_wait(), Ok(None)).then_some(instance.control_port + 1)
}

/// Called when the app closes: the flash image is written back on `quit`.
pub fn shutdown() {
    stop_instance();
}

fn work_dir(app: &AppHandle) -> Result<PathBuf, Ue2Error> {
    let dir = app
        .path()
        .app_config_dir()
        .map_err(|e| err("startFailed", e.to_string()))?
        .join("ue2emu");
    std::fs::create_dir_all(&dir).map_err(|e| err("startFailed", e.to_string()))?;
    Ok(dir)
}

fn spawn_machine(settings: &Settings, dir: &Path, flash: &Path) -> Result<PathBuf, Ue2Error> {
    let log_path = dir.join("run.log");
    let log = File::create(&log_path).map_err(|e| err("startFailed", e.to_string()))?;
    let network_cfg = dir.join("va-network.cfg");
    // Turbo registers on: $D031 reads $00 after a reset, so a program that does not touch it runs at 1 MHz.
    let cfg = format!("{NETWORK_SETTINGS}{}", turbo_settings(settings).unwrap_or_default());
    std::fs::write(&network_cfg, cfg).map_err(|e| err("startFailed", e.to_string()))?;
    // stdout is the firmware console: long sessions would grow the log without limit.
    let child = no_console(&mut Command::new(&settings.exe))
        .args(run_args(settings, flash, &network_cfg))
        .current_dir(dir)
        .stdin(Stdio::null())
        .stdout(Stdio::null())
        .stderr(Stdio::from(log))
        .spawn()
        .map_err(|e| err("startFailed", e.to_string()))?;
    *INSTANCE.lock().unwrap() = Some(Instance {
        child,
        control_port: settings.web_port + 1,
        signature: signature(settings),
    });
    Ok(log_path)
}

async fn wait_for_boot(settings: &Settings, log_path: &Path) -> Result<(), Ue2Error> {
    let deadline = Instant::now() + BOOT_TIMEOUT;
    loop {
        if rest_ready(settings.web_port).await {
            return Ok(());
        }
        if instance_state(&signature(settings)).is_none() {
            let log = std::fs::read(log_path).unwrap_or_default();
            return Err(err("exited", tail(&String::from_utf8_lossy(&log), 8)));
        }
        if Instant::now() >= deadline {
            return Err(err("timeout", settings.web_port.to_string()));
        }
        pause(Duration::from_millis(500)).await;
    }
}

async fn ensure_running(dir: &Path, settings: Settings) -> Result<(), Ue2Error> {
    let wanted = signature(&settings);
    match instance_state(&wanted) {
        Some(true) => {
            return wait_for_boot(&settings, &dir.join("run.log")).await;
        }
        Some(false) => {
            let _ = tauri::async_runtime::spawn_blocking(stop_instance).await;
        }
        None => {
            // Started by hand, or left over from a run that could not stop it.
            if rest_ready(settings.web_port).await {
                return Ok(());
            }
        }
    }
    validate(&settings)?;
    let flash = flash_path(dir, &settings.firmware);
    if is_updater(&settings.firmware) && !flash.is_file() {
        let (for_install, target) = (settings.clone(), flash.clone());
        tauri::async_runtime::spawn_blocking(move || install_flash(&for_install, &target))
            .await
            .map_err(|e| err("installFailed", e.to_string()))??;
    }
    let log_path = spawn_machine(&settings, dir, &flash)?;
    wait_for_boot(&settings, &log_path).await
}

fn config_json(app: &AppHandle) -> serde_json::Value {
    let settings = settings_from(&crate::read_config(app));
    let running = instance_state(&signature(&settings)).is_some();
    serde_json::json!({
        "exe": settings.exe,
        "firmware": settings.firmware,
        "roms": settings.roms,
        "webPort": settings.web_port,
        "running": running,
    })
}

fn store(app: &AppHandle, key: &str, value: serde_json::Value) {
    let mut cfg = crate::read_config(app);
    if !cfg["ue2emu"].is_object() {
        cfg["ue2emu"] = serde_json::json!({});
    }
    cfg["ue2emu"][key] = value;
    crate::write_config(app, &cfg);
}

#[tauri::command]
pub fn ue2_get_config(app: AppHandle) -> serde_json::Value {
    config_json(&app)
}

#[tauri::command]
pub fn ue2_set_web_port(app: AppHandle, port: u16) -> serde_json::Value {
    if valid_web_port(port) {
        store(&app, "webPort", serde_json::json!(port));
    }
    config_json(&app)
}

/// `kind`: `exe`, `firmware` or `roms`.
#[tauri::command]
pub async fn ue2_choose(app: AppHandle, kind: String) -> serde_json::Value {
    let dialog = app.dialog().clone();
    let picked = match kind.as_str() {
        "roms" => dialog.file().blocking_pick_folder(),
        "firmware" => dialog
            .file()
            .add_filter("Ultimate firmware", &["ue2", "elf", "app"])
            .blocking_pick_file(),
        "exe" => {
            let file_dialog = dialog.file();
            #[cfg(target_os = "windows")]
            let file_dialog = file_dialog.add_filter("Executable", &["exe"]);
            file_dialog.blocking_pick_file()
        }
        _ => None,
    };
    if let Some(path) = picked {
        store(&app, &kind, serde_json::json!(path.to_string()));
    }
    config_json(&app)
}

#[tauri::command]
pub async fn ue2_stop(app: AppHandle) -> serde_json::Value {
    let _ = tauri::async_runtime::spawn_blocking(stop_instance).await;
    config_json(&app)
}

#[tauri::command]
pub fn ue2_set_monitor_target(active: bool) {
    MONITOR_ON_UE2.store(active, Ordering::SeqCst);
}

fn failure(error: Ue2Error) -> serde_json::Value {
    serde_json::json!({ "ok": false, "code": error.code, "error": error.detail })
}

/// The machine is up when this returns; gives the REST port.
async fn start(app: &AppHandle) -> Result<u16, Ue2Error> {
    if STARTING.swap(true, Ordering::SeqCst) {
        return Err(err("busy", ""));
    }
    let _guard = StartingGuard;
    // A CPU stopped in the debugger would never finish the firmware's load.
    let _ = tauri::async_runtime::spawn_blocking(end_debug).await;
    let settings = settings_from(&crate::read_config(app));
    let web_port = settings.web_port;
    ensure_running(&work_dir(app)?, settings).await?;
    Ok(web_port)
}

/// For the callers with their own REST upload (D64).
#[tauri::command]
pub async fn ue2_ensure(app: AppHandle) -> serde_json::Value {
    match start(&app).await {
        Ok(web_port) => serde_json::json!({ "ok": true, "host": format!("127.0.0.1:{web_port}") }),
        Err(error) => failure(error),
    }
}

#[tauri::command]
pub async fn ue2_run_prg(app: AppHandle, prg_bytes: Vec<u8>) -> serde_json::Value {
    let result = match start(&app).await {
        Ok(web_port) => upload_prg(web_port, prg_bytes).await,
        Err(error) => Err(error),
    };
    match result {
        Ok(()) => serde_json::json!({ "ok": true }),
        Err(error) => failure(error),
    }
}

/// Only right before the CPU is let go, all changes in one write. ue2emu 0.6.0 knows its compiled
/// exec table by the address of the list it came from (`dbg_exec_table`), and refreshes it only in
/// a free run, not in a step: two lists built with no free run between them can share an address,
/// and the CPU then runs on the old table, passing breakpoints without a stop.
///
/// After `until_return` the list is rebuilt whatever it holds, with a placeholder if empty. This is
/// a precaution: the C64 clock was seen frozen at the target after a step out of code that never
/// returns, and this rebuild does NOT cure that; the cause is still open.
fn sync_checkpoints(session: &mut DebugSession, wanted: &[u16]) -> Result<(), String> {
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

/// What starts a loaded program, typed at READY.: a load at $0801 has its BASIC line.
fn start_command(prg: &[u8]) -> Vec<u8> {
    let load = prg.get(..2).map(|b| u16::from_le_bytes([b[0], b[1]])).unwrap_or(0x0801);
    if load == 0x0801 {
        b"RUN\r".to_vec()
    } else {
        format!("SYS {load}\r").into_bytes()
    }
}

/// The checkpoints go in after the load: the reset of `run_prg` can take them away. Only then
/// is the program started, so nothing of it runs before they are armed, and an old program,
/// gone with the load's reset, cannot fire them.
async fn begin_debug(web_port: u16, port: u16, prg: Vec<u8>, breakpoints: Vec<u16>) -> Result<(), Ue2Error> {
    let start = start_command(&prg);
    post_prg(web_port, "load_prg", prg).await?;
    let opened = tauri::async_runtime::spawn_blocking(move || -> Result<(), String> {
        control_line(port - 1, "expect-c64 READY. 8000")?;
        let monitor = Monitor::connect_ready(port, Duration::from_secs(3))?;
        let mut session = DebugSession { monitor, checkpoints: HashMap::new(), control_port: port - 1, halted: false, rearm: false };
        sync_checkpoints(&mut session, &breakpoints)?;
        session.monitor.keyboard_feed(&start)?;
        *DEBUG.lock().unwrap() = Some(session);
        Ok(())
    })
    .await;
    match opened {
        Ok(Ok(())) => Ok(()),
        Ok(Err(error)) => Err(err("runFailed", error)),
        Err(error) => Err(err("runFailed", error.to_string())),
    }
}

/// One line on the control port, with its reply.
fn control_line(port: u16, line: &str) -> Result<String, String> {
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

/// Monitor commands do not stop this machine's CPU, unlike VICE's: `c64 halt` does, and the
/// steps and EXIT of the monitor then work on that stop as on a checkpoint's.
fn break_cpu(session: &mut DebugSession) -> Result<Option<u16>, String> {
    control_line(session.control_port, "monitor c64 halt")?;
    session.halted = true;
    session.monitor.note_stop()
}

fn release_cpu(session: &mut DebugSession) -> Result<(), String> {
    session.monitor.resume()?;
    if std::mem::take(&mut session.halted) {
        control_line(session.control_port, "monitor c64 go")?;
    }
    Ok(())
}

fn with_debug<T>(job: impl FnOnce(&mut DebugSession) -> Result<T, String>) -> Result<T, String> {
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

fn wait_stop(session: &mut DebugSession, patience: Duration) -> Result<Option<u16>, String> {
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
fn step(session: &mut DebugSession, mode: u8, breakpoints: &[u16]) -> Result<(), String> {
    match mode {
        2 => {
            session.rearm = true;
            session.monitor.until_return()
        }
        1 => step_over(session, breakpoints),
        _ => step_instruction(session),
    }
}

/// A checkpoint at the PC would stop the run on the spot, so from a breakpoint the first
/// instruction is a step. If it lands on another breakpoint, the CPU stays stopped there.
fn continue_cpu(session: &mut DebugSession, breakpoints: &[u16]) -> Result<(), String> {
    if session.monitor.stop_pc().is_some_and(|pc| breakpoints.contains(&pc)) {
        step_instruction(session)?;
        if session.monitor.stop_pc().is_some_and(|pc| breakpoints.contains(&pc)) {
            return Ok(());
        }
    }
    sync_checkpoints(session, breakpoints)?;
    release_cpu(session)
}

/// Starts the machine, arms the checkpoints and runs the PRG.
#[tauri::command]
pub async fn ue2_dbg_start(app: AppHandle, prg_bytes: Vec<u8>, breakpoints: Vec<u16>) -> serde_json::Value {
    let web_port = match start(&app).await {
        Ok(port) => port,
        Err(error) => return failure(error),
    };
    let Some(port) = instance_monitor_port() else {
        return failure(err("runFailed", "the emulator was not started by VA"));
    };
    match begin_debug(web_port, port, prg_bytes, breakpoints).await {
        Ok(()) => serde_json::json!({ "ok": true }),
        Err(error) => failure(error),
    }
}

/// `value`: the PC when the CPU is stopped, else null. An error ends the session.
#[tauri::command]
pub async fn ue2_dbg_poll() -> serde_json::Value {
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

/// The registers by name, the code around the PC and the memory view of a stopped CPU.
#[tauri::command]
pub async fn ue2_dbg_snapshot(mem_address: u16) -> serde_json::Value {
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
        Ok(serde_json::json!({
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
pub async fn ue2_dbg_continue(breakpoints: Vec<u16>) -> serde_json::Value {
    debug_reply(debug_job(move |session| continue_cpu(session, &breakpoints)).await)
}

/// `mode`: 0 into, 1 over, 2 out.
#[tauri::command]
pub async fn ue2_dbg_step(mode: u8, breakpoints: Vec<u16>) -> serde_json::Value {
    debug_reply(debug_job(move |session| step(session, mode, &breakpoints)).await)
}

#[tauri::command]
pub async fn ue2_dbg_break() -> serde_json::Value {
    debug_reply(debug_job(break_cpu).await)
}

#[tauri::command]
pub async fn ue2_dbg_set_register(name: String, value: u16) -> serde_json::Value {
    debug_reply(debug_job(move |session| {
        let id = session.monitor.register_id(&name)?;
        session.monitor.set_register(id, value)
    })
    .await)
}

#[tauri::command]
pub async fn ue2_dbg_end() {
    let _ = tauri::async_runtime::spawn_blocking(end_debug).await;
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::net::TcpListener;

    fn settings() -> Settings {
        Settings {
            exe: "ue2emu".into(),
            firmware: r"C:\fw\c64u_v1.1.0.ue2".into(),
            roms: "roms".into(),
            web_port: 8064,
        }
    }

    fn temp_dir(name: &str) -> PathBuf {
        let dir = std::env::temp_dir().join(format!("va-ue2-{name}-{}", std::process::id()));
        let _ = std::fs::remove_dir_all(&dir);
        std::fs::create_dir_all(&dir).unwrap();
        dir
    }

    #[test]
    fn install_matches_the_documented_command_line() {
        let args = install_args(&settings(), Path::new("f.bin"));
        assert_eq!(
            args,
            ["install", "--update", r"C:\fw\c64u_v1.1.0.ue2", "--flash", "f.bin", "--roms", "roms", "--yes", "--c64-roms"]
        );
    }

    #[test]
    fn run_serves_rest_and_control_on_adjacent_ports() {
        let args = run_args(&settings(), Path::new("f.bin"), Path::new("n.cfg"));
        let value_of = |flag: &str| {
            let at = args.iter().position(|a| a == flag).unwrap();
            args[at + 1].clone()
        };
        assert_eq!(value_of("--net"), "user");
        assert_eq!(value_of("--web-port"), "8064");
        assert_eq!(value_of("--control"), "127.0.0.1:8065");
        assert_eq!(value_of("--flash"), "f.bin");
        assert_eq!(value_of("--settings"), "n.cfg");
        assert!(args.contains(&"--vice-monitor=127.0.0.1:8066".to_string()));
        assert!(args.contains(&"--c64-roms".to_string()));
    }

    #[test]
    fn flash_image_is_per_firmware_and_only_updaters_install() {
        let dir = Path::new("cfg");
        assert_eq!(flash_path(dir, "/fw/c64u_v1.1.0.ue2"), dir.join("c64u_v1.1.0.flash.bin"));
        assert_ne!(flash_path(dir, "/fw/update.ue2"), flash_path(dir, "/fw/c64u_v1.1.0.ue2"));
        assert!(is_updater("/fw/UPDATE.UE2"));
        assert!(!is_updater("/fw/ultimate.elf"));
    }

    #[test]
    fn the_overlay_font_is_checked_by_size() {
        let dir = temp_dir("roms");
        assert!(!overlay_font_present(&dir));
        std::fs::write(dir.join("chars.bin"), vec![0u8; 4096]).unwrap();
        assert!(!overlay_font_present(&dir), "a 4096 byte chars.bin is a CHAR ROM");
        std::fs::write(dir.join("chars.bin"), vec![0u8; 2048]).unwrap();
        assert!(overlay_font_present(&dir));
        let _ = std::fs::remove_dir_all(&dir);
    }

    #[track_caller]
    fn wait_for_stop() -> u16 {
        let deadline = Instant::now() + Duration::from_secs(20);
        loop {
            let stop = with_debug(|session| {
                session.monitor.poll_events(Duration::from_millis(20))?;
                Ok(session.monitor.stop_pc())
            })
            .unwrap();
            if let Some(pc) = stop {
                return pc;
            }
            if Instant::now() >= deadline {
                let state = with_debug(|session| {
                    let status = control_line(session.control_port, "monitor status")?;
                    let cpu = session.monitor.bank_id("cpu")?;
                    let first = session.monitor.read_memory(0x0400, 0x0402, cpu)?;
                    std::thread::sleep(Duration::from_millis(300));
                    let second = session.monitor.read_memory(0x0400, 0x0402, cpu)?;
                    let list = session.checkpoints.clone();
                    Ok(format!("{status} screen {first:?} -> {second:?} checkpoints {list:?}"))
                });
                panic!("the CPU did not stop: {state:?}");
            }
            std::thread::sleep(Duration::from_millis(50));
        }
    }

    #[track_caller]
    fn pc_after_step(mode: u8) -> u16 {
        with_debug(|session| step(session, mode, &[])).unwrap();
        wait_for_stop()
    }

    fn debug_session_against_the_real_machine(settings: &Settings, port: u16) {
        const ENTRY: u16 = 0x080D;
        let prg = vec![
            0x01, 0x08, 0x0B, 0x08, 0x0A, 0x00, 0x9E, 0x32, 0x30, 0x36, 0x31, 0x00, 0x00, 0x00, // 10 SYS 2061
            0xEA, // $080D NOP; interrupts stay on, as in most programs
            0x20, 0x1D, 0x08, // $080E JSR $081D
            0xEE, 0x00, 0x04, // $0811 INC $0400
            0xEE, 0x02, 0x04, // $0814 INC $0402
            0x20, 0x1D, 0x08, // $0817 JSR $081D
            0x4C, 0x14, 0x08, // $081A JMP $0814
            0xA9, 0x07, // $081D LDA #$07
            0x8D, 0x01, 0x04, // $081F STA $0401
            0x60, // $0822 RTS
        ];
        tauri::async_runtime::block_on(begin_debug(settings.web_port, port, prg, vec![ENTRY])).unwrap();
        assert!(debug_active());
        assert_eq!(wait_for_stop(), ENTRY, "stops on the first instruction, after the load");

        assert_eq!(pc_after_step(0), 0x080E, "step into, plain instruction");
        assert_eq!(pc_after_step(1), 0x0811, "step over the JSR");
        with_debug(|session| {
            let cpu = session.monitor.bank_id("cpu")?;
            assert_eq!(session.monitor.read_memory(0x0401, 0x0401, cpu)?, [0x07], "the routine ran");
            let pc = session.monitor.register_id("PC")?;
            session.monitor.set_register(pc, 0x080E)
        })
        .unwrap();
        assert_eq!(pc_after_step(0), 0x081D, "step into the JSR");
        assert_eq!(pc_after_step(0), 0x081F, "next instruction");
        assert_eq!(pc_after_step(2), 0x0811, "step out");

        with_debug(|session| {
            let monitor = &mut session.monitor;
            let a = monitor.register_id("A")?;
            assert_eq!(monitor.registers()?.iter().find(|(id, _)| *id == a).map(|(_, v)| *v), Some(0x07));
            monitor.set_register(a, 0x42)?;
            assert_eq!(monitor.registers()?.iter().find(|(id, _)| *id == a).map(|(_, v)| *v), Some(0x42));
            let names = monitor.register_names()?;
            for name in ["PC", "A", "X", "Y", "SP", "FL"] {
                assert!(names.iter().any(|(_, known)| known == name), "{name} in {names:?}");
            }
            Ok(())
        })
        .unwrap();

        // A breakpoint is reached by Continue, and a removed one no longer stops.
        let counter = || {
            with_debug(|session| {
                let cpu = session.monitor.bank_id("cpu")?;
                session.monitor.read_memory(0x0402, 0x0402, cpu)
            })
            .unwrap()[0]
        };
        with_debug(|session| continue_cpu(session, &[0x0814])).unwrap();
        assert_eq!(wait_for_stop(), 0x0814, "breakpoint in the loop");
        // Continue from a breakpoint goes once round the loop, and stops there again.
        let round = counter();
        with_debug(|session| continue_cpu(session, &[0x0814])).unwrap();
        assert_eq!(wait_for_stop(), 0x0814, "the same breakpoint again");
        assert_eq!(counter(), round.wrapping_add(1), "one round, not a stop on the spot");

        // Step out, and a breakpoint armed before it still works.
        with_debug(|session| continue_cpu(session, &[0x081F, 0x0814])).unwrap();
        assert_eq!(wait_for_stop(), 0x081F, "breakpoint in the routine");
        with_debug(|session| step(session, 2, &[0x0814])).unwrap();
        assert_eq!(wait_for_stop(), 0x081A, "step out to the loop");
        with_debug(|session| continue_cpu(session, &[0x0814])).unwrap();
        assert_eq!(wait_for_stop(), 0x0814, "the breakpoint after a step out");

        // Stepping leaves an armed breakpoint alone.
        with_debug(|session| step(session, 0, &[0x0814])).unwrap();
        assert_eq!(wait_for_stop(), 0x0817, "a step");
        with_debug(|session| continue_cpu(session, &[0x0814])).unwrap();
        assert_eq!(wait_for_stop(), 0x0814, "the breakpoint after a step");
        with_debug(|session| {
            continue_cpu(session, &[])

        })
        .unwrap();
        std::thread::sleep(Duration::from_millis(500));
        let stop = with_debug(|session| {
            session.monitor.poll_events(Duration::from_millis(20))?;
            Ok(session.monitor.stop_pc())
        })
        .unwrap();
        assert_eq!(stop, None, "runs on with no checkpoint");

        // Break stops a running CPU where it is.
        let pc = with_debug(break_cpu).unwrap();
        assert!(pc.is_some(), "a PC to show after Break");
        let before = counter();
        std::thread::sleep(Duration::from_millis(300));
        assert_eq!(counter(), before, "the loop stands after Break");
        with_debug(|session| continue_cpu(session, &[])).unwrap();
        std::thread::sleep(Duration::from_millis(300));
        let cpu_runs = with_debug(|session| {
            let pc = break_cpu(session)?;
            let cpu = session.monitor.bank_id("cpu")?;
            Ok((pc, session.monitor.read_memory(0x0402, 0x0402, cpu)?))
        })
        .unwrap();
        assert_ne!(cpu_runs.1[0], before, "the loop ran again after Continue");

        end_debug();
        assert!(!debug_active());
    }

    /// The whole path against the real emulator, in a window as VA starts it:
    /// `UE2_EXE`, `UE2_FW` (a `.ue2`) and `UE2_ROMS`, with `--ignored`.
    #[test]
    #[ignore]
    fn real_ue2emu_installs_boots_and_runs_a_prg() {
        let var = |name: &str| std::env::var(name).unwrap_or_else(|_| panic!("{name} is not set"));
        let settings = Settings {
            exe: var("UE2_EXE"),
            firmware: var("UE2_FW"),
            roms: var("UE2_ROMS"),
            web_port: 18064,
        };
        let dir = temp_dir("real");
        // A failed assertion must not leave an emulator behind.
        struct StopOnDrop;
        impl Drop for StopOnDrop {
            fn drop(&mut self) {
                stop_instance();
            }
        }
        let _stop = StopOnDrop;
        tauri::async_runtime::block_on(ensure_running(&dir, settings.clone())).unwrap();
        assert!(flash_path(&dir, &settings.firmware).is_file(), "install filled the flash");
        let cfg = std::fs::read_to_string(dir.join("va-network.cfg")).unwrap();
        assert!(cfg.contains("Turbo Control=") && cfg.contains("Turbo Registers"), "{cfg}");
        assert!(matches!(instance_state(&signature(&settings)), Some(true)));

        // 10 SYS 2061: writes "HI" to the top left of the screen and stays there.
        let prg = vec![
            0x01, 0x08, 0x0B, 0x08, 0x0A, 0x00, 0x9E, 0x32, 0x30, 0x36, 0x31, 0x00, 0x00, 0x00, 0xA9, 0x08, 0x8D,
            0x00, 0x04, 0xA9, 0x09, 0x8D, 0x01, 0x04, 0x4C, 0x17, 0x08,
        ];
        tauri::async_runtime::block_on(upload_prg(settings.web_port, prg)).unwrap();
        std::thread::sleep(Duration::from_secs(4));

        let mut control = TcpStream::connect(("127.0.0.1", settings.web_port + 1)).unwrap();
        control.set_read_timeout(Some(Duration::from_secs(15))).unwrap();
        control.write_all(b"c64screen\n").unwrap();
        let mut screen = String::new();
        let mut chunk = [0u8; 4096];
        while !screen.lines().any(|l| l.trim() == "ok") {
            let n = control.read(&mut chunk).unwrap();
            assert!(n > 0, "control closed: {screen}");
            screen.push_str(&String::from_utf8_lossy(&chunk[..n]));
        }
        drop(control);
        assert!(screen.lines().any(|l| l.starts_with("HI")), "{screen}");

        // VA's VICE monitor client against the emulator: what hot reload, live watch and the
        // profiler do. A loop at $0900 writes 'Z' to $0403; PC and SP go there as on a restart.
        ue2_set_monitor_target(false);
        assert_eq!(monitor_port(), None, "the run mode is not the emulator");
        ue2_set_monitor_target(true);
        let port = monitor_port().expect("the emulator's monitor");
        assert_eq!(port, settings.web_port + 2);
        {
            let mut mon = crate::vice_monitor::Monitor::connect(port).unwrap();
            let cpu = mon.bank_id("cpu").unwrap();
            let ram = mon.bank_id("ram").unwrap();
            assert_eq!(mon.read_memory(0x0400, 0x0401, cpu).unwrap(), [0x08, 0x09]);
            let code = [0xA9, 0x1A, 0x8D, 0x03, 0x04, 0x4C, 0x05, 0x09];
            mon.write_memory(0x0900, &code, ram).unwrap();
            assert_eq!(mon.read_memory(0x0900, 0x0907, cpu).unwrap(), code);
            mon.write_memory(0x01FE, &[0x73, 0xA4], ram).unwrap();
            let sp = mon.register_id("SP").unwrap();
            mon.set_register(sp, 0xFD).unwrap();
            let pc = mon.register_id("PC").unwrap();
            mon.set_register(pc, 0x0900).unwrap();
            mon.resume().unwrap();
        }
        std::thread::sleep(Duration::from_secs(1));
        {
            let mut mon = crate::vice_monitor::Monitor::connect(port).unwrap();
            let cpu = mon.bank_id("cpu").unwrap();
            assert_eq!(mon.read_memory(0x0403, 0x0403, cpu).unwrap(), [0x1A]);
            let pc = mon.register_id("PC").unwrap();
            let regs = mon.registers().unwrap();
            let at = regs.iter().find(|(id, _)| *id == pc).map(|(_, v)| *v).unwrap();
            assert!((0x0900..=0x0907).contains(&at), "PC = {at:#06x}");
            mon.resume().unwrap();
        }
        ue2_set_monitor_target(false);

        debug_session_against_the_real_machine(&settings, port);

        assert!(stop_instance());
        assert!(instance_state(&signature(&settings)).is_none());
        let _ = std::fs::remove_dir_all(&dir);
    }

    #[test]
    fn settings_fall_back_on_a_bad_port() {
        let cfg = serde_json::json!({ "ue2emu": { "firmware": "f.ue2", "webPort": 80 } });
        let parsed = settings_from(&cfg);
        assert_eq!(parsed.firmware, "f.ue2");
        assert_eq!(parsed.web_port, DEFAULT_WEB_PORT);
        assert_eq!(settings_from(&serde_json::json!({ "ue2emu": { "webPort": 9000 } })).web_port, 9000);
        assert_eq!(settings_from(&serde_json::json!({})).web_port, DEFAULT_WEB_PORT);
    }

    #[test]
    fn a_loaded_program_starts_by_run_or_sys() {
        assert_eq!(start_command(&[0x01, 0x08, 0x0B]), b"RUN\r");
        assert_eq!(start_command(&[0x00, 0xC0, 0x60]), b"SYS 49152\r");
    }

    #[test]
    fn turbo_registers_are_found_under_their_store() {
        let c64u = "[Network Settings]\n; Disabled | Enabled\nFTP File Service=Disabled\n\n[U64 Specific Settings]\n\
                    ; Off | Manual | C64U Turbo Registers | TurboEnable Bit\nTurbo Control=Off\n; 1 | 2\nCPU Speed=1\n";
        assert_eq!(
            turbo_registers_line(c64u).as_deref(),
            Some("[U64 Specific Settings]\nTurbo Control=C64U Turbo Registers\n")
        );
        let u64 = "[U64 Specific Settings]\n; Off | Manual | U64 Turbo Registers\nTurbo Control=Off\n";
        assert_eq!(turbo_registers_line(u64).as_deref(), Some("[U64 Specific Settings]\nTurbo Control=U64 Turbo Registers\n"));
        assert_eq!(turbo_registers_line("[U64 Specific Settings]\n; Off | Manual\nTurbo Control=Off\n"), None);
        assert_eq!(turbo_registers_line("[Network Settings]\n; Disabled | Enabled\nFTP=Disabled\n"), None);
    }

    #[test]
    fn missing_settings_are_named() {
        let mut s = settings();
        s.exe = String::new();
        assert_eq!(validate(&s), Err(err("notConfigured", "ue2emu")));
    }

    /// One HTTP exchange; returns the request head and body.
    fn serve_once(listener: TcpListener, answer: &'static str) -> std::thread::JoinHandle<(String, Vec<u8>)> {
        std::thread::spawn(move || {
            let (mut stream, _) = listener.accept().unwrap();
            let mut data = Vec::new();
            let mut chunk = [0u8; 4096];
            let (head_end, length) = loop {
                let n = stream.read(&mut chunk).unwrap();
                data.extend_from_slice(&chunk[..n]);
                if let Some(at) = data.windows(4).position(|w| w == b"\r\n\r\n") {
                    let head = String::from_utf8_lossy(&data[..at]).to_lowercase();
                    let length = head
                        .lines()
                        .find_map(|l| l.strip_prefix("content-length: ").map(|v| v.trim().parse::<usize>().unwrap()))
                        .unwrap_or(0);
                    break (at + 4, length);
                }
            };
            while data.len() < head_end + length {
                let n = stream.read(&mut chunk).unwrap();
                data.extend_from_slice(&chunk[..n]);
            }
            stream.write_all(answer.as_bytes()).unwrap();
            (String::from_utf8_lossy(&data[..head_end]).to_string(), data[head_end..].to_vec())
        })
    }

    #[test]
    fn upload_posts_the_prg_to_run_prg() {
        let listener = TcpListener::bind("127.0.0.1:0").unwrap();
        let port = listener.local_addr().unwrap().port();
        let server = serve_once(listener, "HTTP/1.1 200 OK\r\nContent-Length: 0\r\nConnection: close\r\n\r\n");
        let prg = vec![0x01, 0x08, 0x60];
        tauri::async_runtime::block_on(upload_prg(port, prg.clone())).unwrap();
        let (head, body) = server.join().unwrap();
        assert!(head.starts_with("POST /v1/runners:run_prg "), "{head}");
        assert!(head.to_lowercase().contains("content-type: application/octet-stream"));
        assert_eq!(body, prg);
    }

    #[test]
    fn upload_reports_the_http_error() {
        let listener = TcpListener::bind("127.0.0.1:0").unwrap();
        let port = listener.local_addr().unwrap().port();
        let server = serve_once(listener, "HTTP/1.1 500 Oops\r\nContent-Length: 4\r\nConnection: close\r\n\r\nnope");
        let error = tauri::async_runtime::block_on(upload_prg(port, vec![1, 8, 0])).unwrap_err();
        server.join().unwrap();
        assert_eq!(error, err("runFailed", "HTTP 500: nope"));
    }

    #[test]
    fn readiness_needs_an_answer() {
        let listener = TcpListener::bind("127.0.0.1:0").unwrap();
        let port = listener.local_addr().unwrap().port();
        let server = serve_once(listener, "HTTP/1.1 200 OK\r\nContent-Length: 0\r\nConnection: close\r\n\r\n");
        assert!(tauri::async_runtime::block_on(rest_ready(port)));
        let (head, _) = server.join().unwrap();
        assert!(head.starts_with("GET /v1/info "), "{head}");
        assert!(!tauri::async_runtime::block_on(rest_ready(port)));
    }
}
