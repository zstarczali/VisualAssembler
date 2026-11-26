// Bundled command line tools (tools/<name>/bin/<name>[.exe], scripts/build-tools.mjs) and the
// Oscar64 C compiler: build, diagnostics, and the file operations of the Oscar64 project tree.
use serde::Deserialize;
use std::fs;
use std::path::{Path, PathBuf};
use std::process::Command;
#[cfg(target_os = "windows")]
use std::os::windows::process::CommandExt;
use tauri::AppHandle;
use tauri_plugin_dialog::DialogExt;

use crate::{read_config, resolve_resource_file, write_config};

const EXE: &str = if cfg!(target_os = "windows") { ".exe" } else { "" };

fn config_key(tool: &str) -> &'static str {
    match tool {
        "acme" => "acmePath",
        _ => "oscar64Path",
    }
}

pub(crate) fn bundled_tool(app: &AppHandle, tool: &str) -> Option<PathBuf> {
    let path = resolve_resource_file(app, &format!("tools/{tool}/bin/{tool}{EXE}")).ok()?;
    path.is_file().then_some(path)
}

/// The path set in Settings, or the bundled tool when none is set (or it is gone).
pub(crate) fn tool_path(app: &AppHandle, cfg: &serde_json::Value, tool: &str) -> Option<PathBuf> {
    let custom = cfg[config_key(tool)].as_str().unwrap_or("").trim();
    if !custom.is_empty() && Path::new(custom).is_file() {
        return Some(PathBuf::from(custom));
    }
    bundled_tool(app, tool)
}

/// The bundled tool: the first line of tools/<tool>/VERSION; a tool of the user's: what it prints.
fn tool_version(path: &Path, bundled: bool, tool: &str) -> String {
    if bundled {
        let version_file = path.parent().and_then(|bin| bin.parent()).map(|dir| dir.join("VERSION"));
        if let Some(text) = version_file.and_then(|f| fs::read_to_string(f).ok()) {
            return text.lines().next().unwrap_or("").trim().to_string();
        }
    }
    let mut command = Command::new(path);
    #[cfg(target_os = "windows")]
    command.creation_flags(0x08000000);
    // oscar64 prints "Starting oscar64 <version>" with -v (and an error without a source)
    command.arg(if tool == "acme" { "--version" } else { "-v" });
    let Ok(out) = command.output() else { return String::new() };
    let text = format!("{}{}", String::from_utf8_lossy(&out.stdout), String::from_utf8_lossy(&out.stderr));
    first_version(&text).unwrap_or_default()
}

/// The first `1.2` / `1.2.3` in the text.
pub(crate) fn first_version(text: &str) -> Option<String> {
    let bytes = text.as_bytes();
    let mut i = 0;
    while i < bytes.len() {
        if bytes[i].is_ascii_digit() && (i == 0 || !bytes[i - 1].is_ascii_alphanumeric()) {
            let start = i;
            let mut dots = 0;
            while i < bytes.len() && (bytes[i].is_ascii_digit() || (bytes[i] == b'.' && i + 1 < bytes.len() && bytes[i + 1].is_ascii_digit())) {
                if bytes[i] == b'.' {
                    dots += 1;
                }
                i += 1;
            }
            if dots >= 1 {
                return Some(text[start..i].to_string());
            }
        }
        i += 1;
    }
    None
}

fn tool_info(app: &AppHandle, cfg: &serde_json::Value, tool: &str) -> serde_json::Value {
    let custom = cfg[config_key(tool)].as_str().unwrap_or("").trim().to_string();
    let bundled = bundled_tool(app, tool).map(|p| p.to_string_lossy().to_string()).unwrap_or_default();
    let path = tool_path(app, cfg, tool).map(|p| p.to_string_lossy().to_string()).unwrap_or_default();
    serde_json::json!({
        "path": path,
        "custom": custom,
        "customMissing": !custom.is_empty() && !Path::new(&custom).is_file(),
        "bundled": bundled,
        "usesBundled": !path.is_empty() && path == bundled,
        "version": if path.is_empty() { String::new() } else { tool_version(Path::new(&path), path == bundled, tool) },
    })
}

#[tauri::command]
pub fn get_tools_info(app: AppHandle) -> serde_json::Value {
    let cfg = read_config(&app);
    serde_json::json!({ "acme": tool_info(&app, &cfg, "acme"), "oscar64": tool_info(&app, &cfg, "oscar64") })
}

#[tauri::command]
pub async fn choose_oscar64_executable(app: AppHandle) -> serde_json::Value {
    let file_dialog = app.dialog().file();
    #[cfg(target_os = "windows")]
    let file_dialog = file_dialog.add_filter("Executable", &["exe"]);
    match file_dialog.blocking_pick_file() {
        Some(path) => {
            let p = path.to_string();
            let mut cfg = read_config(&app);
            cfg["oscar64Path"] = serde_json::json!(p);
            write_config(&app, &cfg);
            serde_json::json!({ "canceled": false, "oscar64Path": p })
        }
        None => serde_json::json!({ "canceled": true }),
    }
}

/// Back to the bundled tool.
#[tauri::command]
pub fn clear_tool_path(app: AppHandle, tool: String) -> serde_json::Value {
    let mut cfg = read_config(&app);
    if let Some(obj) = cfg.as_object_mut() {
        obj.remove(config_key(&tool));
    }
    write_config(&app, &cfg);
    tool_info(&app, &cfg, &tool)
}

// ── Oscar64 build ───────────────────────────────────────────────────────────

#[derive(Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct Oscar64BuildPayload {
    /// The file on disk to compile (its #includes are read from disk).
    pub source_path: Option<String>,
    /// Source text for an unsaved buffer (compiled from a temp file).
    pub source: Option<String>,
    pub include_dirs: Option<Vec<String>>,
    pub defines: Option<Vec<String>>,
    /// "O0" | "O1" | "O2" | "O3" | "Os"
    pub optimize: Option<String>,
    pub debug: Option<bool>,
    /// -n: native code (default); false = Oscar64's byte code, as a build script without -n has it.
    pub native: Option<bool>,
    pub extra_args: Option<Vec<String>>,
}

/// `file(line, col) : error 3001: message 'info'` → diagnostic; `oscar64: error …` has no place.
pub(crate) fn parse_oscar64_diagnostic(line: &str) -> Option<serde_json::Value> {
    let line = line.trim_end();
    for level in ["error", "warning"] {
        let marker = format!(") : {level} ");
        if let Some(at) = line.find(&marker) {
            let head = &line[..at];
            let open = head.rfind('(')?;
            let mut nums = head[open + 1..].split(',').map(|n| n.trim().parse::<u32>());
            let (Some(Ok(row)), Some(Ok(col))) = (nums.next(), nums.next()) else { continue };
            let rest = &line[at + marker.len()..];
            let (code, message) = rest.split_once(": ").unwrap_or(("", rest));
            return Some(serde_json::json!({
                "file": &head[..open], "line": row, "column": col, "level": level,
                "code": code.trim().parse::<u32>().unwrap_or(0), "message": message.trim(),
            }));
        }
        let prefix = format!("oscar64: {level} ");
        if let Some(rest) = line.strip_prefix(&prefix) {
            let (code, message) = rest.split_once(": ").unwrap_or(("", rest));
            return Some(serde_json::json!({
                "file": "", "line": 0, "column": 0, "level": level,
                "code": code.trim().parse::<u32>().unwrap_or(0), "message": message.trim(),
            }));
        }
    }
    None
}

#[tauri::command]
pub async fn build_oscar64_prg(app: AppHandle, payload: Oscar64BuildPayload) -> serde_json::Value {
    let cfg = read_config(&app);
    let Some(compiler) = tool_path(&app, &cfg, "oscar64") else {
        return serde_json::json!({ "ok": false, "error": "oscar64NotConfigured" });
    };
    let stamp = std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_millis();
    let out_dir = std::env::temp_dir().join("c64-visual-assembler").join(format!("oscar64-{stamp}"));
    if let Err(e) = fs::create_dir_all(&out_dir) {
        return serde_json::json!({ "ok": false, "error": e.to_string() });
    }
    let disk_source = payload.source_path.as_deref().map(PathBuf::from).filter(|p| p.is_file());
    let source_file = match (&disk_source, &payload.source) {
        (Some(path), _) => path.clone(),
        (None, Some(text)) => {
            let file = out_dir.join("main.c");
            if let Err(e) = fs::write(&file, text) {
                return serde_json::json!({ "ok": false, "error": e.to_string() });
            }
            file
        }
        (None, None) => return serde_json::json!({ "ok": false, "error": "oscar64NoSource" }),
    };
    let stem = source_file.file_stem().and_then(|s| s.to_str()).unwrap_or("main").to_string();
    let output = out_dir.join(format!("{stem}.prg"));

    let mut command = Command::new(&compiler);
    #[cfg(target_os = "windows")]
    command.creation_flags(0x08000000);
    if let Some(dir) = source_file.parent() {
        command.current_dir(dir);
    }
    let optimize = payload.optimize.as_deref().unwrap_or("O2");
    if matches!(optimize, "O0" | "O1" | "O2" | "O3" | "Os") {
        command.arg(format!("-{optimize}"));
    }
    if payload.native.unwrap_or(true) {
        command.arg("-n");
    }
    command.arg(format!("-o={}", output.to_string_lossy()));
    if payload.debug.unwrap_or(true) {
        command.arg("-g");
    }
    for dir in payload.include_dirs.unwrap_or_default().iter().filter(|d| !d.trim().is_empty()) {
        command.arg(format!("-i={}", dir.trim()));
    }
    for define in payload.defines.unwrap_or_default().iter().filter(|d| !d.trim().is_empty()) {
        command.arg(format!("-d{}", define.trim()));
    }
    for arg in payload.extra_args.unwrap_or_default().iter().filter(|a| !a.trim().is_empty()) {
        command.arg(arg.trim());
    }
    command.arg(&source_file);

    let result = match command.output() {
        Ok(result) => result,
        Err(e) => return serde_json::json!({ "ok": false, "error": format!("oscar64: {e}"), "compiler": compiler }),
    };
    let stdout = String::from_utf8_lossy(&result.stdout).to_string();
    let stderr = String::from_utf8_lossy(&result.stderr).to_string();
    let diagnostics: Vec<serde_json::Value> = stderr.lines().chain(stdout.lines()).filter_map(parse_oscar64_diagnostic).collect();
    let side = |ext: &str| fs::read_to_string(output.with_extension(ext)).unwrap_or_default();
    let bytes = if result.status.success() { fs::read(&output).ok() } else { None };
    let ok = bytes.as_ref().is_some_and(|b| b.len() > 2);
    serde_json::json!({
        "ok": ok,
        "bytes": bytes.unwrap_or_default(),
        "filePath": output,
        "sourceFile": source_file,
        "compiler": compiler,
        "exitCode": result.status.code(),
        "stdout": stdout,
        "stderr": stderr,
        "diagnostics": diagnostics,
        "asm": side("asm"),
        "map": side("map"),
        "labels": side("lbl"),
        "dbj": side("dbj"),
    })
}

// ── Project tree ────────────────────────────────────────────────────────────

const TREE_MAX_ENTRIES: usize = 4000;
const TREE_MAX_DEPTH: usize = 10;

fn list_tree(dir: &Path, depth: usize, count: &mut usize) -> Vec<serde_json::Value> {
    let Ok(read) = fs::read_dir(dir) else { return Vec::new() };
    let mut entries: Vec<(bool, String, PathBuf)> = read
        .filter_map(|e| e.ok())
        .filter_map(|e| {
            let name = e.file_name().to_string_lossy().to_string();
            if name.starts_with('.') || name == "node_modules" {
                return None;
            }
            let is_dir = e.file_type().ok()?.is_dir();
            Some((is_dir, name, e.path()))
        })
        .collect();
    entries.sort_by(|a, b| b.0.cmp(&a.0).then_with(|| a.1.to_lowercase().cmp(&b.1.to_lowercase())));
    let mut out = Vec::new();
    for (is_dir, name, path) in entries {
        if *count >= TREE_MAX_ENTRIES {
            break;
        }
        *count += 1;
        let children = if is_dir && depth < TREE_MAX_DEPTH { list_tree(&path, depth + 1, count) } else { Vec::new() };
        out.push(serde_json::json!({ "name": name, "path": path, "dir": is_dir, "children": children }));
    }
    out
}

#[tauri::command]
pub fn oscar_list_dir(root: String) -> serde_json::Value {
    let root = PathBuf::from(root);
    if !root.is_dir() {
        return serde_json::json!({ "ok": false, "error": "not a folder" });
    }
    let mut count = 0;
    let entries = list_tree(&root, 0, &mut count);
    serde_json::json!({ "ok": true, "entries": entries, "truncated": count >= TREE_MAX_ENTRIES })
}

/// Only inside the project folder.
fn inside(root: &str, path: &str) -> Result<PathBuf, String> {
    let root = fs::canonicalize(root).map_err(|e| e.to_string())?;
    let path = PathBuf::from(path);
    let parent = path.parent().ok_or("invalid path")?;
    let parent = fs::canonicalize(parent).map_err(|e| e.to_string())?;
    if !parent.starts_with(&root) {
        return Err("outside the project folder".into());
    }
    Ok(parent.join(path.file_name().ok_or("invalid path")?))
}

#[tauri::command]
pub fn oscar_create_dir(root: String, path: String) -> serde_json::Value {
    match inside(&root, &path).and_then(|p| fs::create_dir(&p).map_err(|e| e.to_string())) {
        Ok(()) => serde_json::json!({ "ok": true }),
        Err(e) => serde_json::json!({ "ok": false, "error": e }),
    }
}

#[tauri::command]
pub fn oscar_rename_path(root: String, from: String, to: String) -> serde_json::Value {
    let result = inside(&root, &from).and_then(|from| {
        let to = inside(&root, &to)?;
        if to.exists() {
            return Err("already exists".into());
        }
        fs::rename(&from, &to).map_err(|e| e.to_string())
    });
    match result {
        Ok(()) => serde_json::json!({ "ok": true }),
        Err(e) => serde_json::json!({ "ok": false, "error": e }),
    }
}

#[tauri::command]
pub fn oscar_delete_path(root: String, path: String) -> serde_json::Value {
    let result = inside(&root, &path).and_then(|p| {
        if fs::canonicalize(&p).ok() == fs::canonicalize(&root).ok() {
            return Err("the project folder itself".into());
        }
        if p.is_dir() { fs::remove_dir_all(&p) } else { fs::remove_file(&p) }.map_err(|e| e.to_string())
    });
    match result {
        Ok(()) => serde_json::json!({ "ok": true }),
        Err(e) => serde_json::json!({ "ok": false, "error": e }),
    }
}

#[tauri::command]
pub async fn oscar_choose_folder(app: AppHandle, initial_dir: Option<String>) -> serde_json::Value {
    let mut dialog = app.dialog().file();
    if let Some(dir) = initial_dir.filter(|d| Path::new(d).is_dir()) {
        dialog = dialog.set_directory(dir);
    }
    match dialog.blocking_pick_folder() {
        Some(path) => serde_json::json!({ "canceled": false, "path": path.to_string() }),
        None => serde_json::json!({ "canceled": true }),
    }
}

#[tauri::command]
pub async fn oscar_choose_file(app: AppHandle, initial_dir: Option<String>, save: Option<bool>, default_name: Option<String>, kind: Option<String>) -> serde_json::Value {
    let mut dialog = app.dialog().file();
    dialog = if kind.as_deref() == Some("script") {
        // build.sh / make.bat / makefile (the last has no extension)
        dialog.add_filter("Build script", &["sh", "bat", "cmd", "mk"]).add_filter("All files", &["*"])
    } else {
        dialog.add_filter("C", &["c", "h", "cpp", "hpp", "s", "asm", "inc"])
    };
    if let Some(dir) = initial_dir.filter(|d| Path::new(d).is_dir()) {
        dialog = dialog.set_directory(dir);
    }
    if let Some(name) = default_name.filter(|n| !n.is_empty()) {
        dialog = dialog.set_file_name(name);
    }
    let picked = if save.unwrap_or(false) { dialog.blocking_save_file() } else { dialog.blocking_pick_file() };
    match picked {
        Some(path) => serde_json::json!({ "canceled": false, "path": path.to_string() }),
        None => serde_json::json!({ "canceled": true }),
    }
}

#[cfg(test)]
mod tests {
    use super::{first_version, parse_oscar64_diagnostic};

    #[test]
    fn finds_the_version_in_tool_output() {
        assert_eq!(first_version("This is ACME, release 0.97 (\"Zem\"), 3 Jan 2024").as_deref(), Some("0.97"));
        assert_eq!(first_version("Starting oscar64 1.32.273.0\n").as_deref(), Some("1.32.273.0"));
        assert_eq!(first_version("x64 build 7").as_deref(), None);
    }

    #[test]
    fn parses_oscar64_diagnostics() {
        let d = parse_oscar64_diagnostic("F:/p/main.c(12, 5) : error 3001: Could not open source file 'foo.h'").unwrap();
        assert_eq!(d["file"], "F:/p/main.c");
        assert_eq!(d["line"], 12);
        assert_eq!(d["column"], 5);
        assert_eq!(d["level"], "error");
        assert_eq!(d["code"], 3001);
        assert_eq!(d["message"], "Could not open source file 'foo.h'");
        let w = parse_oscar64_diagnostic("C:\\a (b)\\x.c(3, 1) : warning 1000: Unused").unwrap();
        assert_eq!(w["file"], "C:\\a (b)\\x.c");
        assert_eq!(w["level"], "warning");
        let g = parse_oscar64_diagnostic("oscar64: error 4001: Linker failed").unwrap();
        assert_eq!(g["line"], 0);
        assert!(parse_oscar64_diagnostic("Starting oscar64 1.32").is_none());
    }
}
