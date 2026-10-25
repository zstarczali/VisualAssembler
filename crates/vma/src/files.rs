//! The files the VMA directives read (`.incbin`, `.koala`, …): `FileProvider` and the directory
//! resolver of the app (`reload_*_file` in src-tauri/src/lib.rs, `resolveFile` of the golden harness).

use crate::parse::{Base, Block, Kind, Mode};
use serde_json::Value;
use std::path::{Path, PathBuf};

/// Where the bytes of a named file come from.
pub trait FileProvider {
    /// The file `name` (as the source names it), trying the `exts` appended when it is missing:
    /// the path it was found at and its bytes.
    fn load(&self, name: &str, exts: &[&str]) -> Result<(PathBuf, Vec<u8>), String>;
}

/// No files at all: every directive that names one fails.
pub struct NoFiles;

impl FileProvider for NoFiles {
    fn load(&self, name: &str, _exts: &[&str]) -> Result<(PathBuf, Vec<u8>), String> {
        Err(format!("File not found: {name}"))
    }
}

/// The path under each base folder in order (the project folder first), then its bare file name
/// there: a path saved on another machine (`/Users/…`, `C:\…`) falls back to the name alone.
pub struct DirFiles {
    pub bases: Vec<PathBuf>,
}

impl DirFiles {
    pub fn candidates(&self, name: &str) -> Vec<PathBuf> {
        let mut tries = Vec::new();
        let path = Path::new(name);
        if path.is_absolute() {
            tries.push(path.to_path_buf());
        } else {
            tries.extend(self.bases.iter().map(|b| b.join(name)));
        }
        let bare = name.rsplit(['/', '\\']).next().unwrap_or(name);
        if !bare.is_empty() && bare != name {
            tries.extend(self.bases.iter().map(|b| b.join(bare)));
        }
        tries
    }
}

impl FileProvider for DirFiles {
    fn load(&self, name: &str, exts: &[&str]) -> Result<(PathBuf, Vec<u8>), String> {
        let name = name.trim();
        if !name.is_empty() {
            for path in self.candidates(name) {
                for ext in std::iter::once(&"").chain(exts) {
                    let mut p = path.clone().into_os_string();
                    p.push(ext);
                    let p = PathBuf::from(p);
                    if p.is_file() {
                        return std::fs::read(&p).map(|b| (p.clone(), b)).map_err(|e| format!("{}: {e}", p.display()));
                    }
                }
            }
        }
        Err(format!("File not found: {name}"))
    }
}

/// The PSID / RSID header (`parse_sid_buffer` of lib.rs): (load, init, play, data)
pub fn parse_sid(buf: &[u8]) -> Result<(u16, u16, u16, Vec<u8>), String> {
    if buf.len() < 128 {
        return Err("File too short to be a SID file.".into());
    }
    if &buf[0..4] != b"PSID" && &buf[0..4] != b"RSID" {
        return Err("Not a valid SID file (missing PSID/RSID header).".into());
    }
    let be = |o: usize| ((buf[o] as u16) << 8) | buf[o + 1] as u16;
    let mut data = buf.get(be(6) as usize..).unwrap_or(&[]).to_vec();
    let mut load = be(8);
    if load == 0 && data.len() >= 2 {
        load = data[0] as u16 | ((data[1] as u16) << 8);
        data.drain(..2);
    }
    Ok((load, be(10), be(12), data))
}

/// The blocks of an included file: a `.json` block program, or VMA source (`.asm`, `.inc`, `.s`).
fn include_blocks(path: &Path, bytes: &[u8], line: usize) -> Result<Vec<Block>, String> {
    let json = path.extension().is_some_and(|e| e.eq_ignore_ascii_case("json"));
    let mut blocks = if json {
        let v: Value = serde_json::from_slice(bytes).map_err(|e| format!("{}: {e}", path.display()))?;
        v["program"].as_array().map(|p| p.iter().map(json_block).collect()).unwrap_or_default()
    } else {
        let text = String::from_utf8_lossy(bytes);
        if text.trim().is_empty() { Vec::new() } else { crate::parse::parse_expert_text(&text) }
    };
    // errors in an included file point at the `.include` line
    for b in blocks.iter_mut() {
        b.line = line;
        b.included = true;
    }
    Ok(blocks)
}

fn json_base(v: &Value) -> Base {
    match v.as_str() {
        Some("dec") => Base::Dec,
        Some("bin") => Base::Bin,
        _ => Base::Hex,
    }
}

fn json_mode(v: &Value) -> Option<Mode> {
    Some(match v.as_str().unwrap_or("implied") {
        "implied" => Mode::Implied,
        "immediate" => Mode::Immediate,
        "zeroPage" => Mode::ZeroPage,
        "zeroPageX" => Mode::ZeroPageX,
        "zeroPageY" => Mode::ZeroPageY,
        "absolute" => Mode::Absolute,
        "absoluteX" => Mode::AbsoluteX,
        "absoluteY" => Mode::AbsoluteY,
        "indirect" => Mode::Indirect,
        "indirectX" => Mode::IndirectX,
        "indirectY" => Mode::IndirectY,
        "relative" => Mode::Relative,
        _ => return None,
    })
}

/// One block of a `.json` include as the JS uses it (the raw block, not re-parsed). Only the
/// kinds a library holds are read; any other is reported as not supported.
fn json_block(b: &Value) -> Block {
    let s = |k: &str| b[k].as_str().unwrap_or("").to_string();
    let flag = |k: &str| b[k].as_bool().unwrap_or(false);
    let kind = if flag("isBlankLine") {
        Kind::Blank
    } else if flag("isOrgMacro") {
        Kind::Org { address: s("orgAddress") }
    } else if flag("isLabel") && !flag("kickScope") {
        Kind::Label { name: s("labelName"), offset: b["labelOffset"].as_i64().unwrap_or(0), kick_scope: false }
    } else if flag("isComment") && !flag("kickScopeEnd") {
        Kind::Comment { text: s("rawOperand"), error: None }
    } else if flag("isByteMacro") {
        Kind::Byte { raw: s("rawOperand"), base: json_base(&b["base"]), error: None }
    } else if flag("isConstMacro") {
        Kind::Const { name: s("constName"), raw: s("rawOperand"), base: json_base(&b["base"]), value: b["constValue"].as_f64() }
    } else if flag("isMacroDefStart") {
        Kind::MacroDefStart { name: s("macroName"), params: s("macroParams") }
    } else if flag("isMacroDefEnd") {
        Kind::MacroDefEnd
    } else {
        let flagged = b.as_object().is_some_and(|o| o.iter().any(|(k, v)| k.starts_with("is") && k.len() > 2 && k.as_bytes()[2].is_ascii_uppercase() && v.as_bool() == Some(true)));
        let mnem = s("mnemonic");
        match json_mode(&b["addressingMode"]) {
            Some(mode) if !flagged && crate::opcodes::OPCODES.iter().any(|(m, _, _)| *m == mnem) => Kind::Instr {
                mnem,
                mode,
                raw: s("rawOperand"),
                base: json_base(&b["base"]),
                display: s("operand"),
                smc: b["smcLabel"].as_str().filter(|l| !l.is_empty()).map(String::from),
            },
            _ => Kind::Unsupported { what: "JSON_INCLUDE_BLOCK".into() },
        }
    };
    Block { kind, line: 0, included: true }
}

/// `reloadIncludeBlocks` / `reloadIncBinBlocks` / `reloadSidBlocks` over the top-level program (as in
/// the app, the files of an included file's own directives are not read).
pub fn load_assets(program: &mut [Block], files: &dyn FileProvider) {
    for block in program.iter_mut() {
        let line = block.line;
        if let Kind::Include { file, blocks, path: found, .. } = &mut block.kind {
            if file.trim().is_empty() {
                continue;
            }
            // a failed include keeps no blocks (the app keeps the last loaded ones)
            if let Ok((path, bytes)) = files.load(file, &[".json", ".asm", ".inc", ".s"]) {
                if let Ok(b) = include_blocks(&path, &bytes, line) {
                    *blocks = b;
                    // `a/./b` → `a\b` as path.join gives it
                    *found = path.components().collect::<PathBuf>().display().to_string();
                }
            }
            continue;
        }
        if let Kind::Sid { file, load, init, play, bytes, error, .. } = &mut block.kind {
            if file.trim().is_empty() {
                continue;
            }
            match files.load(file, &[]).and_then(|(_, b)| parse_sid(&b)) {
                Ok((l, i, p, data)) => {
                    (*load, *init, *play, *bytes, *error) = (l, i, p, data, None);
                }
                Err(e) => {
                    bytes.clear();
                    *error = Some(e);
                }
            }
            continue;
        }
        if let Kind::IncBin { file, bytes, error, .. } = &mut block.kind {
            if file.trim().is_empty() {
                continue;
            }
            match files.load(file, &[]) {
                Ok((_, b)) => {
                    *bytes = b;
                    *error = None;
                }
                Err(e) => {
                    bytes.clear();
                    *error = Some(e);
                }
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn bare_name_fallback() {
        let files = DirFiles { bases: vec![PathBuf::from("base"), PathBuf::from("samples")] };
        let c = files.candidates("/Users/someone/project/data.bin");
        assert!(c.ends_with(&[PathBuf::from("base").join("data.bin"), PathBuf::from("samples").join("data.bin")]));
        assert_eq!(files.candidates("data.bin"), vec![PathBuf::from("base").join("data.bin"), PathBuf::from("samples").join("data.bin")]);
    }
}
