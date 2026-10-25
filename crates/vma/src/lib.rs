//! VMA — the Visual Macro Assembler of C64 Visual Assembler, in Rust.
//!
//! A port of the JS compiler in www/app.js (`parseExpertText` → `getProgramLayout` →
//! `compileLineBytes` → `_buildAutostartPrgCore`). The contract is byte-for-byte equal
//! output: tests/vma-golden.test.js runs the `vma` CLI over the golden corpus.

pub mod asm;
pub mod debug;
pub mod expr;
pub mod files;
pub mod level;
pub mod num;
pub mod opcodes;
pub mod parse;
pub mod prg;

pub use asm::CompileError;
pub use files::{DirFiles, FileProvider, NoFiles};
pub use prg::Built;

#[derive(Clone, Debug)]
pub struct BuildOptions {
    /// `10 SYS…` BASIC line in front of the code (the app's BASIC SYS toggle).
    pub basic_stub: bool,
}

impl Default for BuildOptions {
    fn default() -> Self {
        BuildOptions { basic_stub: true }
    }
}

/// VMA source → PRG (load address + image); the directives that name a file find none.
pub fn build(source: &str, options: &BuildOptions) -> Result<Vec<u8>, CompileError> {
    build_with_files(source, options, &NoFiles)
}

/// VMA source → PRG, the files of `.incbin` / `.koala` … read through `files`.
pub fn build_with_files(source: &str, options: &BuildOptions, files: &dyn FileProvider) -> Result<Vec<u8>, CompileError> {
    build_full(source, options, files).map(|b| b.prg)
}

/// VMA source → PRG with the debugger files (`.sym`, `.vs`, `.dbg`); `source_path` names the main
/// source in the `.dbg`.
pub fn build_with_debug(source: &str, options: &BuildOptions, files: &dyn FileProvider, source_path: &str) -> Result<(Built, debug::DebugFiles), CompileError> {
    build_result(source, options, files, source_path, None).map(|r| (r.built, r.debug))
}

/// A build with what the app reads besides the PRG: the debugger view of the layout
/// (`getProgramLayout(_getDebuggerCodeOrigin)`) and the three debugger files made of it.
pub struct BuildResult {
    pub built: Built,
    /// the origin of the debugger layout (lines below it are the "BASIC Stub" block)
    pub origin: i64,
    /// `src_line` = the line of `source` (not mapped)
    pub info: asm::DebugInfo,
    /// the symbols in the files' order
    pub symbols: Vec<(String, i64)>,
    pub debug: debug::DebugFiles,
}

impl BuildResult {
    /// The app's answer (`vma_build` with a source path): `prg`, `sysAddress`, `debugOrigin`,
    /// `sidecars` {sym, vs, dbg}, `symbols` [[name, address]] and `lines` [[address, size,
    /// skipped 0/1, line of the source or -1 for an included block]].
    pub fn to_json(&self) -> serde_json::Value {
        let lines: Vec<[i64; 4]> = self.info.lines.iter().map(|l| [l.address, l.size, l.skipped as i64, l.src_line.map_or(-1, |s| s as i64)]).collect();
        serde_json::json!({
            "ok": true,
            "prg": self.built.prg,
            "sysAddress": self.built.sys_address,
            "debugOrigin": self.origin,
            "sidecars": { "sym": self.debug.sym, "vs": self.debug.vs, "dbg": self.debug.dbg },
            "symbols": self.symbols,
            "lines": lines,
        })
    }
}

/// `build_with_debug` with the layout. `line_map`: line of `source` → the line the `.dbg` names
/// (-1: none, the file's index as the app writes it; -2: a further line of the previous line's
/// block) — for a source the app generated from blocks (`_blockToExpertSourceLine`), whose own
/// lines are the blocks' `_srcLine`.
pub fn build_result(source: &str, options: &BuildOptions, files: &dyn FileProvider, source_path: &str, line_map: Option<&[i64]>) -> Result<BuildResult, CompileError> {
    let mut program = parse::parse_expert_text(source);
    files::load_assets(&mut program, files);
    let (built, info, origin) = prg::build_prg_debug(&program, options.basic_stub)?;
    let debug = match line_map {
        None => debug::debug_files(&info, origin, source_path),
        Some(map) => {
            // -2: the line continues the previous line's block (a block the app writes on more than
            // one line, e.g. a long .byte): its bytes join that block's range, as the app has one line
            let mut mapped = info.clone();
            let mut lines: Vec<asm::LineInfo> = Vec::new();
            let mut last_code: Option<usize> = None;
            for mut line in mapped.lines.drain(..) {
                let target = line.src_line.and_then(|l| map.get(l).copied());
                line.src_line = target.filter(|l| *l >= 0).map(|l| l as usize);
                let code = !line.skipped && line.size > 0;
                if code && target == Some(-2) {
                    if let Some(prev) = last_code.map(|i| &mut lines[i]) {
                        if prev.address + prev.size == line.address {
                            prev.size += line.size;
                            continue;
                        }
                    }
                }
                if code {
                    last_code = Some(lines.len());
                }
                lines.push(line);
            }
            mapped.lines = lines;
            debug::debug_files(&mapped, origin, source_path)
        }
    };
    let symbols = debug::sorted_symbols(&info);
    Ok(BuildResult { built, origin, info, symbols, debug })
}

/// VMA source → PRG and its start address (what the app's Run / Build use).
pub fn build_full(source: &str, options: &BuildOptions, files: &dyn FileProvider) -> Result<Built, CompileError> {
    let mut program = parse::parse_expert_text(source);
    files::load_assets(&mut program, files);
    prg::build_prg_full(&program, options.basic_stub)
}

#[cfg(test)]
mod tests {
    use super::*;

    const SRC: &str = "* = $1000\n    lda #$01\n    rts\n";

    #[test]
    fn build_result_lines_and_symbols() {
        let r = build_result("* = $1000\nstart:\n    lda #$01\n    rts\n", &BuildOptions { basic_stub: false }, &NoFiles, "a.asm", None).unwrap();
        assert_eq!(r.origin, 0x1000);
        assert_eq!(r.symbols, vec![("start".to_string(), 0x1000)]);
        let code: Vec<(i64, i64, Option<usize>)> = r.info.lines.iter().filter(|l| l.size > 0).map(|l| (l.address, l.size, l.src_line)).collect();
        assert_eq!(code, vec![(0x1000, 2, Some(2)), (0x1002, 1, Some(3))]);
    }

    #[test]
    fn line_map_names_the_mapped_lines_in_the_dbg() {
        let opts = BuildOptions { basic_stub: false };
        let plain = build_result(SRC, &opts, &NoFiles, "a.asm", None).unwrap();
        assert!(plain.debug.dbg.contains("$1000,$1001,0,2,1,2,1"));
        let mapped = build_result(SRC, &opts, &NoFiles, "a.asm", Some(&[-1, 10, 20])).unwrap();
        assert!(mapped.debug.dbg.contains("$1000,$1001,0,11,1,11,1"));
        assert!(mapped.debug.dbg.contains("$1002,$1002,0,21,1,21,1"));
        // no line: the file's index + 1, as the app writes a block without _srcLine
        let none = build_result(SRC, &opts, &NoFiles, "a.asm", Some(&[-1, -1])).unwrap();
        assert!(none.debug.dbg.contains("$1000,$1001,0,1,1,1,1"));
        assert!(none.debug.dbg.contains("$1002,$1002,0,1,1,1,1"));
        // the layout's own lines stay the source's
        assert_eq!(mapped.info.lines.iter().find(|l| l.size == 2).unwrap().src_line, Some(1));
    }
}
