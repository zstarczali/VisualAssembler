use std::path::{Path, PathBuf};

fn find_manual(root: &Path, revision: &str) -> Option<PathBuf> {
    let entries = std::fs::read_dir(root).ok()?;
    for entry in entries.flatten() {
        let path = entry.path();
        if !path.is_dir() { continue; }
        let manual = path.join("MANUAL.pdf");
        if manual.is_file() {
            if path.file_name().and_then(|name| name.to_str()).is_some_and(|name| revision.starts_with(name) || name.starts_with(&revision[..revision.len().min(7)])) {
                return Some(manual);
            }
        }
        if let Some(found) = find_manual(&path, revision) { return Some(found); }
    }
    None
}

fn main() {
    println!("cargo:rerun-if-changed=Cargo.lock");
    let lock = std::fs::read_to_string("Cargo.lock").unwrap_or_default();
    let mut in_ub = false;
    let mut ub_version = "unknown".to_string();
    let mut ub_revision = String::new();
    for line in lock.lines() {
        let trimmed = line.trim();
        if trimmed == "[[package]]" { in_ub = false; }
        if trimmed == "name = \"ultimate-basic\"" { in_ub = true; continue; }
        if in_ub && trimmed.starts_with("version = \"") {
            ub_version = trimmed.trim_start_matches("version = \"").trim_end_matches('"').to_string();
        }
        if in_ub && trimmed.starts_with("source = \"git+") {
            ub_revision = trimmed.rsplit('#').next().unwrap_or_default().trim_end_matches('"').to_string();
        }
    }
    println!("cargo:rustc-env=ULTIMATE_BASIC_VERSION={ub_version}");

    let cargo_home = std::env::var_os("CARGO_HOME").map(PathBuf::from).or_else(|| {
        std::env::var_os(if cfg!(windows) { "USERPROFILE" } else { "HOME" }).map(|home| PathBuf::from(home).join(".cargo"))
    });
    let checkout_manual = cargo_home
        .as_deref()
        .and_then(|home| find_manual(&home.join("git").join("checkouts"), &ub_revision));
    let sibling_manual = Path::new(env!("CARGO_MANIFEST_DIR")).join("..").join("..").join("UltimateBasic").join("MANUAL.pdf");
    let manual = checkout_manual.or_else(|| sibling_manual.is_file().then_some(sibling_manual))
        .expect("UltimateBasic MANUAL.pdf was not found in the Cargo Git checkout");
    println!("cargo:rerun-if-changed={}", manual.display());
    println!("cargo:rustc-env=ULTIMATE_BASIC_MANUAL={}", manual.display());
    tauri_build::build()
}
