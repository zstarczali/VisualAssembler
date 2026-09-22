use ultimate_basic::compiler::{compile_with_path, debug_output, CompileOptions};
use std::path::Path;

#[test]
fn repro_trickytetris_compile() {
    let source = std::fs::read_to_string(r"F:\Development\UltimateBasic\examples\trickytetris.ub").unwrap();
    let path = Path::new(r"F:\Development\UltimateBasic\examples\trickytetris.ub");
    eprintln!("starting compile...");
    let result = compile_with_path(&source, &CompileOptions { basic_stub: true, explicit: false }, Some(path));
    eprintln!("done, errors: {:?}", result.errors);
    eprintln!("prg bytes: {}", result.prg.len());
    let map = &result.map;
    eprintln!("building sym...");
    let sym = debug_output::sym(map);
    eprintln!("sym bytes: {}", sym.len());
    eprintln!("building dbg...");
    let dbg = debug_output::dbg(map, path);
    eprintln!("dbg bytes: {}", dbg.len());
    eprintln!("building vs...");
    let vs = debug_output::vice(map);
    eprintln!("vs bytes: {}", vs.len());
    eprintln!("all done");
}
