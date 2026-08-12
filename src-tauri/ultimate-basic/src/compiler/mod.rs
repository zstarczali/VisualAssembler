pub mod ast;
pub mod codegen;
pub mod debug_output;
pub mod lexer;
pub mod parser;

use codegen::Codegen;
use lexer::Lexer;
use parser::Parser;

pub struct CompileOptions {
    pub basic_stub: bool,
}

/// Single variable in zero-page.
pub struct VarEntry {
    pub name: String,
    pub zp_addr: u8,
    pub type_str: String,
}

/// Named subroutine with its absolute address.
pub struct SubEntry {
    pub name: String,
    pub addr: u16,
}

/// Named BASIC label with its absolute machine-code address.
pub struct LabelEntry {
    pub name: String,
    pub addr: u16,
}

/// Byte array in heap RAM ($C000+).
pub struct ArrayEntry {
    pub name: String,
    pub base_addr: u16,
    pub size: u16,
}

/// Memory layout produced after a successful compilation.
pub struct MemoryMap {
    pub load_addr: u16,
    pub code_size: usize,
    pub variables: Vec<VarEntry>,    // sorted by ZP address
    pub subroutines: Vec<SubEntry>,  // sorted by address
    pub labels: Vec<LabelEntry>,      // sorted by address
    pub arrays: Vec<ArrayEntry>,     // sorted by base address
    pub plot_zp: Option<u8>,         // 6-byte ZP block for plot helper
    pub line_zp: Option<u8>,         // 15-byte ZP block for Bresenham line helper (16-bit x)
    pub rect_zp: Option<u8>,         // 9-byte ZP block for rect helper
    pub sin_table_addr: Option<u16>, // absolute address of 256-byte sin/cos table
    pub data_zp: Option<u8>,         // 2-byte ZP pair for data/read pointer
    pub code_bytes: Vec<u8>,         // raw machine code (for verbose hex dump)
    pub unused_vars: Vec<String>,    // variables declared but never read
}

pub struct CompileResult {
    pub prg: Vec<u8>,
    pub errors: Vec<String>,
    pub map: MemoryMap,
}

/// BASIC stub: 10 SYS 2061
/// Code must start at $080D (= 2061 decimal) for this to work.
const BASIC_STUB: &[u8] = &[
    0x01, 0x08, // PRG load address $0801
    0x0B, 0x08, // next line pointer -> $080B
    0x0A, 0x00, // line number 10
    0x9E, // SYS token
    0x32, 0x30, 0x36, 0x31, // "2061"
    0x00, // end of line
    0x00, 0x00, // end of BASIC program
]; // 14 bytes total, code starts at $080F

// $0801 + 14 = $080F = 2063 ... actually let me recalculate
// $0801 + 12 data bytes after header = $080D? Let me be precise.
// BASIC_STUB = [01 08] [0B 08] [0A 00] [9E] [32 30 36 31] [00] [00 00]
//               header  next   line#   SYS   "2061"       eol  end
// = 2 + 2 + 2 + 1 + 4 + 1 + 2 = 14 bytes
// Code starts at $0801 + 12 (excluding 2-byte header) = $080D = 2061 ✓

pub fn compile(source: &str, opts: &CompileOptions) -> CompileResult {
    compile_with_path(source, opts, None)
}

pub fn compile_with_path(
    source: &str,
    opts: &CompileOptions,
    source_path: Option<&std::path::Path>,
) -> CompileResult {
    let load_addr: u16 = if opts.basic_stub { 0x080D } else { 0x0801 };

    let mut lexer = Lexer::new(source);
    let tokens = lexer.tokenize();
    let lex_errors = lexer.errors().to_vec();
    let base_dir = source_path
        .and_then(|p| p.parent())
        .map(|p| p.to_path_buf());
    let mut parser = if let Some(dir) = base_dir {
        Parser::new_with_base(tokens, dir)
    } else {
        Parser::new(tokens)
    };
    let ast = parser.parse();
    let mut errors = lex_errors;
    errors.extend(parser.errors().iter().cloned());
    let mut cg = Codegen::new(load_addr);
    let raw = cg.compile(&ast);
    errors.extend(cg.errors());
    let map = cg.memory_map();

    let prg = if opts.basic_stub {
        let mut p = BASIC_STUB.to_vec();
        p.extend_from_slice(&raw);
        p
    } else {
        let mut p = vec![0x01, 0x08]; // PRG header
        p.extend_from_slice(&raw);
        p
    };

    CompileResult { prg, errors, map }
}
