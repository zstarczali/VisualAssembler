//! vma build <input.asm> [options] — the VMA compiler of C64 Visual Assembler on the command line.
//! Exit 0 and the PRG on success, 1 and the error on stderr otherwise, 2 on bad usage.

use std::path::{Path, PathBuf};
use std::process::ExitCode;

const USAGE: &str = "usage: vma build <input.asm> [-o out.prg] [--base-dir DIR] [--search DIR]... [--no-basic-stub] [--raw]
                 [--sym FILE] [--vs FILE] [--dbg FILE] [--debug] [--json FILE]
                 [--source-path NAME] [--line-map FILE]
       vma --help | --version";

const HELP: &str = "vma — the VMA (Visual Macro Assembler) compiler of C64 Visual Assembler

usage:
  vma build <input.asm> [options]
  vma --help | -h
  vma --version

build options:
  -o FILE           the PRG to write (default: the input with a .prg extension)
  --base-dir DIR    where .incbin / .koala / .level / .sid / .include files are looked up first
                    (default: the folder of the input)
  --search DIR      a further folder to look in, after the base dir (repeatable, in order);
                    a path stored on another machine falls back to its bare file name in each
  --no-basic-stub   no `10 SYS…` BASIC line in front of the code (the app's BASIC SYS toggle)
  --raw             the image alone at its first ORG, no stub and no $C000 move (a Kick
                    project's extra output, as assembleProgramToPrg)
  --sym FILE        KickAssembler label file (.label NAME=$xxxx)
  --vs FILE         VICE monitor label file (al C:xxxx .NAME; x64sc -moncommands FILE)
  --dbg FILE        RetroDebugger / C64 Debugger source map (C64debugger XML)
  --debug           all three next to the PRG (out.sym, out.vs, out.dbg)
  --json FILE       the app's build answer (vma_build): PRG, SYS address, the three files,
                    the symbols and the laid-out lines
  --source-path NAME  the main source the .dbg names (default: the input)
  --line-map FILE   JSON array: input line -> the line the .dbg names (-1: none,
                    -2: a further line of the previous line's block)

exit status: 0 = built, 1 = compile error (FILE:LINE: message on stderr), 2 = bad usage";

fn usage_error(msg: &str) -> ExitCode {
    if !msg.is_empty() {
        eprintln!("{msg}");
    }
    eprintln!("{USAGE}");
    ExitCode::from(2)
}

fn write(path: &Path, bytes: &[u8]) -> Result<(), ExitCode> {
    std::fs::write(path, bytes).map_err(|e| {
        eprintln!("{}: {e}", path.display());
        ExitCode::from(1)
    })
}

fn main() -> ExitCode {
    let args: Vec<String> = std::env::args().skip(1).collect();
    match args.first().map(String::as_str) {
        Some("--help" | "-h" | "help") => {
            println!("{HELP}");
            return ExitCode::SUCCESS;
        }
        Some("--version" | "-V") => {
            println!("vma {}", env!("CARGO_PKG_VERSION"));
            return ExitCode::SUCCESS;
        }
        Some("build") if args.len() >= 2 => {}
        _ => return usage_error(""),
    }
    if args[1] == "--help" || args[1] == "-h" {
        println!("{HELP}");
        return ExitCode::SUCCESS;
    }
    let input = PathBuf::from(&args[1]);
    let mut output: Option<PathBuf> = None;
    let mut options = vma::BuildOptions::default();
    let mut base_dir: Option<PathBuf> = None;
    let mut search: Vec<PathBuf> = Vec::new();
    let (mut sym, mut vs, mut dbg, mut debug) = (None::<PathBuf>, None::<PathBuf>, None::<PathBuf>, false);
    let mut raw = false;
    let (mut json, mut source_path, mut line_map) = (None::<PathBuf>, None::<PathBuf>, None::<PathBuf>);
    let mut i = 2;
    while i < args.len() {
        let opt = args[i].as_str();
        let takes_value = matches!(opt, "-o" | "--base-dir" | "--search" | "--sym" | "--vs" | "--dbg" | "--json" | "--source-path" | "--line-map");
        let value = if takes_value {
            i += 1;
            match args.get(i) {
                Some(v) => Some(PathBuf::from(v)),
                None => return usage_error(&format!("{opt} needs a value")),
            }
        } else {
            None
        };
        match opt {
            "-o" => output = value,
            "--base-dir" => base_dir = value,
            "--search" => search.extend(value),
            "--sym" => sym = value,
            "--vs" => vs = value,
            "--dbg" => dbg = value,
            "--debug" => debug = true,
            "--raw" => raw = true,
            "--json" => json = value,
            "--source-path" => source_path = value,
            "--line-map" => line_map = value,
            "--no-basic-stub" => options.basic_stub = false,
            "--help" | "-h" => {
                println!("{HELP}");
                return ExitCode::SUCCESS;
            }
            other => return usage_error(&format!("unknown option {other}")),
        }
        i += 1;
    }
    let source = match std::fs::read(&input) {
        Ok(bytes) => String::from_utf8_lossy(&bytes).into_owned(),
        Err(e) => {
            eprintln!("{}: {e}", input.display());
            return ExitCode::from(1);
        }
    };
    let out = output.unwrap_or_else(|| input.with_extension("prg"));
    if debug {
        sym = sym.or_else(|| Some(out.with_extension("sym")));
        vs = vs.or_else(|| Some(out.with_extension("vs")));
        dbg = dbg.or_else(|| Some(out.with_extension("dbg")));
    }
    // files: the base dir (default: the input's folder), then the search folders in order
    let base = base_dir.or_else(|| input.parent().map(PathBuf::from));
    let files = vma::DirFiles { bases: base.into_iter().chain(search).collect() };
    // every error on its own line; with --json the app's error answer too
    let fail = |e: vma::CompileError| {
        for err in std::iter::once(&e).chain(e.more.iter()) {
            eprintln!("{}:{}: {}", input.display(), err.line + 1, err.message);
        }
        if let Some(p) = &json {
            let _ = write(p, vma::error_json(&e).to_string().as_bytes());
        }
        ExitCode::from(1)
    };
    let line_map: Option<Vec<i64>> = match &line_map {
        None => None,
        Some(p) => match std::fs::read_to_string(p).map_err(|e| e.to_string()).and_then(|t| serde_json::from_str(&t).map_err(|e| e.to_string())) {
            Ok(map) => Some(map),
            Err(e) => {
                eprintln!("{}: {e}", p.display());
                return ExitCode::from(1);
            }
        },
    };
    if raw {
        return match vma::build_raw(&source, &files) {
            Ok(built) => {
                let answer = serde_json::json!({ "ok": true, "prg": built.prg, "segments": built.segments, "entry": built.entry }).to_string();
                let jobs: [(Option<&PathBuf>, &[u8]); 2] = [(Some(&out), &built.prg), (json.as_ref(), answer.as_bytes())];
                for (path, bytes) in jobs {
                    if let Some(p) = path {
                        if let Err(code) = write(p, bytes) {
                            return code;
                        }
                    }
                }
                ExitCode::SUCCESS
            }
            Err(e) => fail(e),
        };
    }
    if sym.is_none() && vs.is_none() && dbg.is_none() && json.is_none() {
        return match vma::build_full(&source, &options, &files) {
            Ok(built) => write(&out, &built.prg).map(|_| ExitCode::SUCCESS).unwrap_or_else(|c| c),
            Err(e) => fail(e),
        };
    }
    let source_path = source_path.unwrap_or_else(|| input.clone()).display().to_string();
    match vma::build_result(&source, &options, &files, &source_path, line_map.as_deref()) {
        Ok(result) => {
            let answer = json.as_ref().map(|_| result.to_json().to_string()).unwrap_or_default();
            let jobs: [(Option<&PathBuf>, &[u8]); 5] = [
                (Some(&out), &result.built.prg),
                (sym.as_ref(), result.debug.sym.as_bytes()),
                (vs.as_ref(), result.debug.vs.as_bytes()),
                (dbg.as_ref(), result.debug.dbg.as_bytes()),
                (json.as_ref(), answer.as_bytes()),
            ];
            for (path, bytes) in jobs {
                if let Some(p) = path {
                    if let Err(code) = write(p, bytes) {
                        return code;
                    }
                }
            }
            ExitCode::SUCCESS
        }
        Err(e) => fail(e),
    }
}
