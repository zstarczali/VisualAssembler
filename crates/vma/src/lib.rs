//! VMA — the Visual Macro Assembler of C64 Visual Assembler, in Rust.
//!
//! A port of the JS compiler in www/app.js (`parseExpertText` → `getProgramLayout` →
//! `compileLineBytes` → `_buildAutostartPrgCore`). The contract is byte-for-byte equal
//! output: tests/vma-golden.test.js runs the `vma` CLI over the golden corpus.

pub mod asm;
pub mod expr;
pub mod files;
pub mod level;
pub mod num;
pub mod opcodes;
pub mod parse;
pub mod prg;

pub use asm::CompileError;
pub use files::{DirFiles, FileProvider, NoFiles};

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
    let mut program = parse::parse_expert_text(source);
    files::load_assets(&mut program, files);
    prg::build_prg(&program, options.basic_stub)
}
