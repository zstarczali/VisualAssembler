//! PRG files: `_buildAutostartPrgCore`, `buildBasicSysStub`, `_buildRelocatingLoader`.

use crate::asm::{Assembler, CompileError, Image};
use crate::num::{js_parse_int, parse_address_value};
use crate::parse::{Block, Kind};
use regex::Regex;
use std::sync::OnceLock;

const DEFAULT_ORIGIN: i64 = 0x0801;

/// `parseOriginValue`: the first ORG (outside macro definitions), else $0801.
pub(crate) fn origin_of(program: &[Block]) -> i64 {
    let mut in_macro = false;
    for b in program {
        match &b.kind {
            Kind::MacroDefStart { .. } => in_macro = true,
            Kind::MacroDefEnd => in_macro = false,
            _ => {}
        }
        if in_macro {
            continue;
        }
        if let Kind::Org { address } = &b.kind {
            if let Some(a) = parse_address_value(address) {
                if (0.0..=65535.0).contains(&a) {
                    return a as i64;
                }
            }
        }
    }
    DEFAULT_ORIGIN
}

/// `buildBasicSysStub`: `10 SYS<address>` at $0801, with the load address.
pub fn basic_sys_stub(sys: i64) -> Vec<u8> {
    let digits = sys.to_string().into_bytes();
    let next = 0x0801 + 2 + 2 + 1 + digits.len() as i64 + 1;
    let mut out = vec![0x01, 0x08, (next & 0xFF) as u8, (next >> 8) as u8, 0x0A, 0x00, 0x9E];
    out.extend(digits);
    out.extend([0x00, 0x00, 0x00]);
    out
}

/// `_getEmbeddedBasicSysAddress`: a source that writes its own `SYS` line at $0801.
fn embedded_sys_address(program: &[Block]) -> Option<i64> {
    if program.len() < 2 {
        return None;
    }
    let org = program.iter().position(|b| matches!(&b.kind, Kind::Org { address } if address.to_uppercase() == "0801"))?;
    let mut bytes: Vec<f64> = Vec::new();
    for b in &program[org + 1..] {
        match &b.kind {
            Kind::Comment { .. } | Kind::Blank | Kind::Region | Kind::EndRegion | Kind::KickScopeEnd => continue,
            Kind::Byte { raw, .. } => {
                let parsed: Vec<f64> = raw.split(',').map(|t| js_parse_int(t.trim().trim_start_matches('$'), 16)).collect();
                if parsed.iter().any(|v| !v.is_finite() || *v < 0.0 || *v > 255.0) {
                    return None;
                }
                bytes.extend(parsed);
                if bytes.iter().skip(5).any(|v| *v == 0.0) || bytes.len() >= 16 {
                    break;
                }
            }
            _ => return None,
        }
    }
    let at = |i: usize| bytes.get(i).copied();
    let stub = (at(0) == Some(11.0) || at(0) == Some(12.0)) && at(1) == Some(8.0) && at(2) == Some(10.0) && at(3) == Some(0.0) && at(4) == Some(0x9E as f64);
    if !stub {
        return None;
    }
    let mut i = if at(5) == Some(32.0) { 6 } else { 5 };
    let mut digits = String::new();
    while let Some(v) = at(i) {
        if !(48.0..=57.0).contains(&v) {
            break;
        }
        digits.push(v as u8 as char);
        i += 1;
    }
    let sys = js_parse_int(&digits, 10);
    if !digits.is_empty() && at(i) == Some(0.0) && sys <= 65535.0 {
        Some(sys as i64)
    } else {
        None
    }
}

/// `_sourceEntryHint`: "Entry point: $XXXX" in the comment header of a disassembly.
fn source_entry_hint(program: &[Block]) -> Option<i64> {
    static RE: OnceLock<Regex> = OnceLock::new();
    let re = RE.get_or_init(|| Regex::new(r"(?i)\bEntry point:\s*\$([0-9A-Fa-f]{4})\b").unwrap());
    for b in program {
        match &b.kind {
            Kind::Blank => continue,
            Kind::Comment { text, .. } => {
                if let Some(c) = re.captures(text) {
                    return Some(js_parse_int(&c[1], 16) as i64);
                }
            }
            _ => return None,
        }
    }
    None
}

fn prg_of(image: &Image) -> Vec<u8> {
    let mut out = vec![(image.load & 0xFF) as u8, ((image.load >> 8) & 0xFF) as u8];
    out.extend(&image.bytes);
    out
}

/// `_buildRelocatingLoader`
fn relocating_loader(image: &[u8], load: i64, entry: i64) -> Option<Vec<u8>> {
    let size = image.len() as i64;
    let end = load + size;
    let lo = |v: i64| (v & 0xFF) as u8;
    let hi = |v: i64| ((v >> 8) & 0xFF) as u8;
    let copy = |src: i64, dst: i64, n: i64| {
        let mut code = vec![0xA9, lo(src), 0x85, 0xFB, 0xA9, hi(src), 0x85, 0xFC, 0xA9, lo(dst), 0x85, 0xFD, 0xA9, hi(dst), 0x85, 0xFE, 0xA0, 0x00];
        if n >> 8 != 0 {
            code.extend([0xA2, (n >> 8) as u8, 0xB1, 0xFB, 0x91, 0xFD, 0xC8, 0xD0, 0xF9, 0xE6, 0xFC, 0xE6, 0xFE, 0xCA, 0xD0, 0xF2]);
        }
        if n & 0xFF != 0 {
            code.extend([0xB1, 0xFB, 0x91, 0xFD, 0xC8, 0xC0, (n & 0xFF) as u8, 0xD0, 0xF7]);
        }
        code
    };
    let clear = |dst: i64, n: i64| {
        let mut code = vec![0xA9, lo(dst), 0x85, 0xFB, 0xA9, hi(dst), 0x85, 0xFC, 0xA9, 0x00, 0xA8];
        if n >> 8 != 0 {
            code.extend([0xA2, (n >> 8) as u8, 0x91, 0xFB, 0xC8, 0xD0, 0xFB, 0xE6, 0xFC, 0xCA, 0xD0, 0xF6]);
        }
        if n & 0xFF != 0 {
            code.extend([0x91, 0xFB, 0xC8, 0xC0, (n & 0xFF) as u8, 0xD0, 0xF9]);
        }
        code
    };
    let build = |mover_body: Vec<u8>, tail: &[u8]| -> Option<Vec<u8>> {
        let mut mover = vec![0x78];
        mover.extend(mover_body);
        mover.extend([0x58, 0x4C, lo(entry), hi(entry)]);
        let len = mover.len() as i64;
        let mover_addr = [0x033C_i64, 0x0120].into_iter().find(|a| end <= *a || load >= a + len)?;
        let src = 0x080D + 14;
        let starter = [0xA2, (len - 1) as u8, 0xBD, lo(src), hi(src), 0x9D, lo(mover_addr), hi(mover_addr), 0xCA, 0x10, 0xF7, 0x4C, lo(mover_addr), hi(mover_addr)];
        let mut out = basic_sys_stub(0x080D);
        out.extend(starter);
        out.extend(mover);
        out.extend(tail);
        Some(out)
    };
    if size == 0 {
        return None;
    }
    let shift_len = 5 + copy(0, 0, size).len() as i64;
    let shift_src = 0x080D + 14 + shift_len;
    if shift_src + size <= 0xD000 {
        return build(copy(shift_src, load, size), image);
    }
    let in_place_len = 5 + copy(0, 0, 0x101).len() as i64 + clear(0, 0x101).len() as i64;
    let first_in_place = 0x080D + 14 + in_place_len;
    let moved = first_in_place - load;
    if moved >= size {
        return None;
    }
    let mut run = -1i64;
    let mut n = 0i64;
    for i in moved..size {
        let addr = load + i;
        if image[i as usize] != 0 || (0xD000..0xE000).contains(&addr) {
            n = 0;
            continue;
        }
        n += 1;
        if n == moved {
            run = i - moved + 1;
            break;
        }
    }
    if run < 0 {
        return None;
    }
    let mut tail = image[moved as usize..].to_vec();
    let at = (run - moved) as usize;
    tail[at..at + moved as usize].copy_from_slice(&image[..moved as usize]);
    let run_addr = load + run;
    let mut body = copy(run_addr, load, moved);
    body.extend(clear(run_addr, moved));
    while (body.len() as i64) < in_place_len - 5 {
        body.push(0xEA);
    }
    build(body, &tail)
}

/// A built program: the PRG and the address the app starts it at (`sysAddress`; None without a
/// BASIC SYS line).
pub struct Built {
    pub prg: Vec<u8>,
    pub sys_address: Option<i64>,
    /// the ranges the program writes (its own addresses, without the BASIC SYS line) and their bytes
    pub segments: Vec<(i64, Vec<u8>)>,
    /// where the program itself starts (the SYS address, behind a relocating loader too; without a
    /// SYS line the first written address)
    pub entry: i64,
}

/// `_buildAutostartPrgCore` (`basic_stub` = the BASIC SYS toggle of the app).
pub fn build_prg(program: &[Block], basic_stub: bool) -> Result<Vec<u8>, CompileError> {
    build_prg_full(program, basic_stub).map(|b| b.prg)
}

/// The PRG and the debugger view of it: `_buildDebuggerSidecarPayload` lays the program out again at
/// `_getDebuggerCodeOrigin` (the SYS address, else the PRG's load address); that origin is returned too.
pub fn build_prg_debug(program: &[Block], basic_stub: bool) -> Result<(Built, crate::asm::DebugInfo, i64), CompileError> {
    let built = build_prg_full(program, basic_stub)?;
    let origin = match built.sys_address {
        Some(sys) => sys,
        None if built.prg.len() >= 2 => built.prg[0] as i64 | ((built.prg[1] as i64) << 8),
        None => {
            let o = origin_of(program);
            if o == 0x0801 { 0xC000 } else { o }
        }
    };
    let info = Assembler::new(program).debug_info(program, origin)?;
    Ok((built, info, origin))
}

/// `_buildAutostartPrgCore` with its `sysAddress`.
pub fn build_prg_full(program: &[Block], basic_stub: bool) -> Result<Built, CompileError> {
    let origin = origin_of(program);
    let prg = |origin: i64, overridden: bool| -> Result<Image, CompileError> { Assembler::new(program).assemble(program, origin, overridden) };
    if let Some(sys) = embedded_sys_address(program) {
        return prg(origin, true).map(|i| Built { prg: prg_of(&i), sys_address: Some(sys), segments: i.segments(), entry: sys });
    }
    if !basic_stub {
        let target = if origin == 0x0801 { 0xC000 } else { origin };
        return prg(target, true).map(|i| Built { prg: prg_of(&i), sys_address: None, segments: i.segments(), entry: i.load });
    }
    let has_lower_org = program.iter().any(|b| matches!(&b.kind, Kind::Org { address } if parse_address_value(address).unwrap_or(65535.0) < 2049.0));
    let raw_origin = if origin == 0x0801 && !has_lower_org { 0x080D } else { origin };
    let stub_size = 2 + 2 + 1 + raw_origin.to_string().len() as i64 + 1 + 2;
    let code_origin = raw_origin.max(0x0801 + stub_size);
    let sys = source_entry_hint(program).unwrap_or(code_origin);
    let image = prg(code_origin, true)?;
    let load = if image.bytes.is_empty() { code_origin } else { image.load };
    let stub = basic_sys_stub(sys);
    let stub_data = &stub[2..];
    if load < 0x0801 + stub_data.len() as i64 {
        return relocating_loader(&image.bytes, load, sys).map(|prg| Built { prg, sys_address: Some(0x080D), segments: image.segments(), entry: sys }).ok_or_else(|| {
            let msg = crate::Msg::keyed("autostartImageOverlapsStub", format!("the image at ${:04X} overlaps the BASIC SYS line", load));
            CompileError::new(0, msg.p("address", crate::asm::format_address(load)))
        });
    }
    let gap = (load - 0x0801 - stub_data.len() as i64) as usize;
    let mut out = vec![0x01, 0x08];
    out.extend(stub_data);
    out.extend(std::iter::repeat(0).take(gap));
    out.extend(&image.bytes);
    Ok(Built { prg: out, sys_address: Some(sys), segments: image.segments(), entry: sys })
}
