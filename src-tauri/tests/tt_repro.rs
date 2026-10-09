use std::path::Path;
use ultimate_basic::compiler::{compile_with_path, debug_output, CompileOptions};

// The Tricky Tetris source lives in its own repository on the developer machine.
const TRICKYTETRIS_UB: &str = r"F:\Development\Tricky Tetris\trickytetris.ub";

#[test]
fn repro_trickytetris_compile() {
    if !Path::new(TRICKYTETRIS_UB).exists() {
        eprintln!("skipped: {TRICKYTETRIS_UB} not found");
        return;
    }
    // Tauri's sync-command worker threads use a small OS stack (commonly 1MB on
    // Windows), unlike the test harness's main thread. Reproduce on a thread with
    // that same small stack to see if compiling this file overflows it.
    let handle = std::thread::Builder::new()
        .stack_size(2 * 1024 * 1024)
        .spawn(|| {
            let source = std::fs::read_to_string(TRICKYTETRIS_UB).unwrap();
            let path = Path::new(TRICKYTETRIS_UB);
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
