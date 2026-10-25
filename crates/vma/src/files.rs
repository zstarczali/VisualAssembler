//! The files the VMA directives read (`.incbin`, `.koala`, …): `FileProvider` and the directory
//! resolver of the app (`reload_*_file` in src-tauri/src/lib.rs, `resolveFile` of the golden harness).

use crate::parse::{Block, Kind};
use std::path::{Path, PathBuf};

/// Where the bytes of a named file come from.
pub trait FileProvider {
    /// The file `name` (as the source names it), trying the `exts` appended when it is missing.
    fn load(&self, name: &str, exts: &[&str]) -> Result<Vec<u8>, String>;
}

/// No files at all: every directive that names one fails.
pub struct NoFiles;

impl FileProvider for NoFiles {
    fn load(&self, name: &str, _exts: &[&str]) -> Result<Vec<u8>, String> {
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
    fn load(&self, name: &str, exts: &[&str]) -> Result<Vec<u8>, String> {
        let name = name.trim();
        if !name.is_empty() {
            for path in self.candidates(name) {
                for ext in std::iter::once(&"").chain(exts) {
                    let mut p = path.clone().into_os_string();
                    p.push(ext);
                    let p = PathBuf::from(p);
                    if p.is_file() {
                        return std::fs::read(&p).map_err(|e| format!("{}: {e}", p.display()));
                    }
                }
            }
        }
        Err(format!("File not found: {name}"))
    }
}

/// `reloadIncBinBlocks`: the bytes of every INCBIN / KOALA block, or its load error.
pub fn load_assets(program: &mut [Block], files: &dyn FileProvider) {
    for block in program.iter_mut() {
        if let Kind::IncBin { file, bytes, error, .. } = &mut block.kind {
            if file.trim().is_empty() {
                continue;
            }
            match files.load(file, &[]) {
                Ok(b) => {
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
