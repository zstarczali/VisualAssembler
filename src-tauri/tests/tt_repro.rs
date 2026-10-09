use std::path::Path;
use ultimate_basic::compiler::{compile_with_path, debug_output, CompileOptions};

#[test]
fn repro_trickytetris_compile() {
    // Tauri's sync-command worker threads use a small OS stack (commonly 1MB on
    // Windows), unlike the test harness's main thread. Reproduce on a thread with
    // that same small stack to see if compiling this file overflows it.
    let handle = std::thread::Builder::new()
        .stack_size(2 * 1024 * 1024)
        .spawn(|| {
            let source =
                std::fs::read_to_string(r"F:\Development\UltimateBasic\examples\trickytetris.ub")
                    .unwrap();
            let path = Path::new(r"F:\Development\UltimateBasic\examples\trickytetris.ub");
            eprintln!("starting compile...");
            let result = compile_with_path(
                &source,
                &CompileOptions {
                    basic_stub: true,
                    explicit: false,
                },
                Some(path),
            );
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
        })
        .unwrap();
    handle.join().unwrap();
}
