//! vma build <input.asm> -o <out.prg> [--base-dir DIR] [--search DIR]... [--no-basic-stub]
//! Exit 0 and the PRG on success, 1 and the error on stderr otherwise, 2 on bad usage.

use std::path::PathBuf;
use std::process::ExitCode;

const USAGE: &str = "usage: vma build <input.asm> -o <out.prg> [--base-dir DIR] [--search DIR]... [--no-basic-stub]";

fn main() -> ExitCode {
    let args: Vec<String> = std::env::args().skip(1).collect();
    if args.first().map(String::as_str) != Some("build") || args.len() < 2 {
        eprintln!("{USAGE}");
        return ExitCode::from(2);
    }
    let input = PathBuf::from(&args[1]);
    let mut output: Option<PathBuf> = None;
    let mut options = vma::BuildOptions::default();
    let mut base_dir: Option<PathBuf> = None;
    let mut search: Vec<PathBuf> = Vec::new();
    let mut i = 2;
    while i < args.len() {
        match args[i].as_str() {
            "-o" => {
                i += 1;
                output = args.get(i).map(PathBuf::from);
            }
            "--base-dir" => {
                i += 1;
                base_dir = args.get(i).map(PathBuf::from);
            }
            "--search" => {
                i += 1;
                search.extend(args.get(i).map(PathBuf::from));
            }
            "--no-basic-stub" => options.basic_stub = false,
            other => {
                eprintln!("unknown option {other}\n{USAGE}");
                return ExitCode::from(2);
            }
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
    // files: the base dir (default: the input's folder), then the search folders in order
    let base = base_dir.or_else(|| input.parent().map(PathBuf::from));
    let files = vma::DirFiles { bases: base.into_iter().chain(search).collect() };
    match vma::build_with_files(&source, &options, &files) {
        Ok(prg) => {
            let out = output.unwrap_or_else(|| input.with_extension("prg"));
            if let Err(e) = std::fs::write(&out, prg) {
                eprintln!("{}: {e}", out.display());
                return ExitCode::from(1);
            }
            ExitCode::SUCCESS
        }
        Err(e) => {
            eprintln!("{}:{}: {}", input.display(), e.line + 1, e.message);
            ExitCode::from(1)
        }
    }
}
