use std::fs;
use std::path::PathBuf;
use std::process::Command;
#[cfg(target_os = "windows")]
use std::os::windows::process::CommandExt;
use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Manager};
use tauri_plugin_dialog::DialogExt;
use tauri_plugin_opener::OpenerExt;

// ── Resource path resolution ─────────────────────────────────────────────────
// In dev builds (cargo tauri dev) resource_dir() points to target/debug/ where
// the bundler does NOT copy resources.  Fall back to the workspace root so that
// samples and docs are reachable during development as well.

fn resolve_resource_file(app: &AppHandle, relative_path: &str) -> std::io::Result<PathBuf> {
    let resource_path = app
        .path()
        .resource_dir()
        .map_err(|e| std::io::Error::new(std::io::ErrorKind::NotFound, e.to_string()))?
        .join(relative_path);

    #[cfg(debug_assertions)]
    {
        if !resource_path.exists() {
            if let Some(workspace_root) = std::path::Path::new(env!("CARGO_MANIFEST_DIR")).parent() {
                let dev_path = workspace_root.join(relative_path);
                if dev_path.exists() {
                    return Ok(dev_path);
                }
            }
        }
    }

    Ok(resource_path)
}

// ── Config ──────────────────────────────────────────────────────────────────

fn config_path(app: &AppHandle) -> PathBuf {
    app.path().app_config_dir().unwrap().join("config.json")
}

fn read_config(app: &AppHandle) -> serde_json::Value {
    let path = config_path(app);
    fs::read_to_string(&path)
        .ok()
        .and_then(|s| serde_json::from_str(&s).ok())
        .unwrap_or(serde_json::json!({}))
}

fn write_config(app: &AppHandle, cfg: &serde_json::Value) {
    let path = config_path(app);
    if let Some(parent) = path.parent() {
        let _ = fs::create_dir_all(parent);
    }
    let _ = fs::write(&path, serde_json::to_string_pretty(cfg).unwrap());
}

fn detect_vice_executable() -> String {
    #[cfg(target_os = "macos")]
    let candidates = [
        "/Applications/vice-arm64-gtk3-3.10/bin/x64sc",
        "/Applications/vice-arm64-gtk3-3.9/bin/x64sc",
        "/Applications/vice-arm64-gtk3-3.8/bin/x64sc",
        "/Applications/GTK3VICE-3.10/bin/x64sc",
        "/Applications/GTK3VICE-3.9/bin/x64sc",
        "/Applications/GTK3VICE-3.8/bin/x64sc",
        "/opt/homebrew/bin/x64sc",
        "/usr/local/bin/x64sc",
    ];
    #[cfg(target_os = "windows")]
    let candidates = [
        r"C:\Program Files\GTK3VICE-3.9\bin\x64sc.exe",
        r"C:\Program Files\GTK3VICE-3.8\bin\x64sc.exe",
        r"C:\Program Files\WinVICE\x64sc.exe",
        r"C:\Program Files (x86)\WinVICE\x64sc.exe",
    ];
    #[cfg(not(any(target_os = "macos", target_os = "windows")))]
    let candidates: [&str; 0] = [];
    candidates
        .iter()
        .find(|p| std::path::Path::new(p).exists())
        .map(|s| s.to_string())
        .unwrap_or_default()
}

// ── SID parsing ─────────────────────────────────────────────────────────────

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct SidInfo {
    load_address: u16,
    init_address: u16,
    play_address: u16,
    num_songs: u16,
    start_song: u16,
    title: String,
    author: String,
    copyright: String,
    bytes: Vec<u8>,
}

fn parse_sid_buffer(buf: &[u8]) -> Result<SidInfo, String> {
    if buf.len() < 128 {
        return Err("File too short to be a SID file.".into());
    }
    let magic = std::str::from_utf8(&buf[0..4]).unwrap_or("");
    if magic != "PSID" && magic != "RSID" {
        return Err("Not a valid SID file (missing PSID/RSID header).".into());
    }

    let data_offset = ((buf[6] as usize) << 8) | buf[7] as usize;
    let mut load_address = ((buf[8] as u16) << 8) | buf[9] as u16;
    let init_address    = ((buf[10] as u16) << 8) | buf[11] as u16;
    let play_address    = ((buf[12] as u16) << 8) | buf[13] as u16;
    let num_songs       = ((buf[14] as u16) << 8) | buf[15] as u16;
    let start_song      = ((buf[16] as u16) << 8) | buf[17] as u16;

    let read_str = |from: usize, to: usize| -> String {
        buf[from..to].iter().take_while(|&&b| b != 0).map(|&b| b as char).collect()
    };
    let title     = read_str(22, 54);
    let author    = read_str(54, 86);
    let copyright = read_str(86, 118);

    let mut data_bytes = buf[data_offset..].to_vec();
    if load_address == 0 && data_bytes.len() >= 2 {
        load_address = (data_bytes[0] as u16) | ((data_bytes[1] as u16) << 8);
        data_bytes = data_bytes[2..].to_vec();
    }

    Ok(SidInfo {
        load_address,
        init_address,
        play_address,
        num_songs,
        start_song,
        title,
        author,
        copyright,
        bytes: data_bytes,
    })
}

// ── Commands ─────────────────────────────────────────────────────────────────

#[tauri::command]
fn get_app_version(app: AppHandle) -> String {
    app.package_info().version.to_string()
}


#[tauri::command]
fn set_title(app: AppHandle, title: String) {
    if let Some(win) = app.get_webview_window("main") {
        let _ = win.set_title(&title);
    }
}

#[tauri::command]
async fn open_external(url: String, app: AppHandle) -> Result<(), String> {
    app.opener().open_url(url, None::<String>).map_err(|e| e.to_string())
}

#[tauri::command]
fn quit_app(app: AppHandle) {
    app.exit(0);
}

#[tauri::command]
fn get_vice_config(app: AppHandle) -> serde_json::Value {
    let cfg = read_config(&app);
    let vice_path = cfg["vicePath"]
        .as_str()
        .unwrap_or("")
        .to_string();
    let vice_path = if vice_path.is_empty() {
        detect_vice_executable()
    } else {
        vice_path
    };
    serde_json::json!({ "vicePath": vice_path })
}

#[tauri::command]
async fn choose_vice_executable(app: AppHandle) -> serde_json::Value {
    let dialog = app.dialog().clone();
    let file_dialog = dialog.file();

    // On Windows: filter .exe files
    #[cfg(target_os = "windows")]
    let file_dialog = file_dialog.add_filter("Executable", &["exe"]);

    // On macOS: .app bundles are directories and cannot be selected with pick_file.
    // Open the dialog directly in the VICE bin/ folder where the real scripts live.
    #[cfg(target_os = "macos")]
    let file_dialog = {
        let vice_bin_candidates = [
            "/Applications/vice-arm64-gtk3-3.10/bin",
            "/Applications/vice-arm64-gtk3-3.9/bin",
            "/Applications/vice-arm64-gtk3-3.8/bin",
            "/Applications/GTK3VICE-3.10/bin",
            "/Applications/GTK3VICE-3.9/bin",
            "/Applications",
        ];
        let start_dir = vice_bin_candidates
            .iter()
            .find(|p| std::path::Path::new(p).exists())
            .unwrap_or(&"/");
        file_dialog.set_directory(start_dir)
    };

    let result = file_dialog.blocking_pick_file();

    match result {
        Some(path) => {
            let path_str = path.to_string();
            let mut cfg = read_config(&app);
            cfg["vicePath"] = serde_json::json!(path_str);
            write_config(&app, &cfg);
            serde_json::json!({ "canceled": false, "vicePath": path_str })
        }
        None => serde_json::json!({ "canceled": true }),
    }
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct LaunchVicePayload {
    bytes: Vec<u8>,
    file_name: Option<String>,
}

#[tauri::command]
async fn launch_vice(app: AppHandle, payload: LaunchVicePayload) -> serde_json::Value {
    let cfg = read_config(&app);
    let vice_path = {
        let p = cfg["vicePath"].as_str().unwrap_or("").to_string();
        if p.is_empty() { detect_vice_executable() } else { p }
    };

    if vice_path.is_empty() {
        return serde_json::json!({
            "ok": false,
            "error": "VICE nincs beallitva. Kattints az Edit gombra es add meg a VICE eleresi utjat."
        });
    }

    let temp_dir = std::env::temp_dir().join("c64-visual-assembler");
    let _ = fs::create_dir_all(&temp_dir);
    let file_name = payload.file_name.unwrap_or_else(|| {
        format!("program-{}.prg", std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH).unwrap().as_millis())
    });
    let file_path = temp_dir.join(&file_name);
    if let Err(e) = fs::write(&file_path, &payload.bytes) {
        return serde_json::json!({ "ok": false, "error": e.to_string() });
    }

    let result = if cfg!(target_os = "macos") {
        // GTK3VICE on macOS ships as:
        //   /Applications/vice-arm64-gtk3-3.x/x64sc.app  ← .app bundle (droplet, no CLI args)
        //   /Applications/vice-arm64-gtk3-3.x/bin/x64sc  ← bash wrapper (accepts CLI args) ✓
        //   /Applications/vice-arm64-gtk3-3.x/VICE.app/Contents/MacOS/VICE  ← actual binary
        // If user picks the .app bundle, resolve to the sibling bin/ script automatically.
        let binary = if vice_path.ends_with(".app") {
            let app_path = std::path::Path::new(&vice_path);
            let stem = app_path.file_stem().unwrap_or_default().to_string_lossy().to_string();
            // Try sibling bin/ directory first (GTK3VICE layout)
            if let Some(parent) = app_path.parent() {
                let bin_candidate = parent.join("bin").join(&stem);
                if bin_candidate.exists() {
                    bin_candidate.to_string_lossy().to_string()
                } else {
                    String::new()
                }
            } else {
                String::new()
            }
        } else {
            vice_path.clone()
        };

        if binary.is_empty() || !std::path::Path::new(&binary).exists() {
            return serde_json::json!({
                "ok": false,
                "error": format!("VICE binary nem talalhato. Valaszd ki a 'bin/x64sc' scriptet a VICE mappajaban (nem az .app bundlet). Beallitott ut: {}", vice_path)
            });
        }

        Command::new("bash")
            .arg(&binary)
            .arg(file_path.to_str().unwrap())
            .stdin(std::process::Stdio::null())
            .stdout(std::process::Stdio::null())
            .stderr(std::process::Stdio::null())
            .spawn()
    } else {
        #[cfg(target_os = "windows")]
        {
            // WHY NOT cmd /c start: cmd.exe is spawned as a child of this process and
            // is placed into Tauri's Job Object before it runs. When it calls CreateProcess
            // for VICE, Windows inherits the same job. The indirection does nothing.
            //
            // WHY NOT CREATE_BREAKAWAY_FROM_JOB: only works if the owning job explicitly
            // sets JOB_OBJECT_LIMIT_BREAKAWAY_OK. Tauri CLI does not set that flag.
            //
            // WHY THIS WORKS: PowerShell's Start-Process calls ShellExecuteEx, which
            // delegates actual process creation to explorer.exe (the shell host). That
            // process is outside Tauri's Job Object entirely, so VICE is never assigned
            // to it and survives hot-reload independently. This is only an issue in
            // `tauri dev` mode; production builds do not use a KILL_ON_JOB_CLOSE job.
            let ps_cmd = format!(
                "Start-Process -FilePath '{}' -ArgumentList '{}'",
                vice_path.replace('\'', "''"),
                file_path.to_str().unwrap().replace('\'', "''"),
            );
            Command::new("powershell")
                .args([
                    "-NoProfile",
                    "-NonInteractive",
                    "-WindowStyle", "Hidden",
                    "-Command", &ps_cmd,
                ])
                .stdin(std::process::Stdio::null())
                .stdout(std::process::Stdio::null())
                .stderr(std::process::Stdio::null())
                .creation_flags(0x08000000) // CREATE_NO_WINDOW
                .spawn()
        }
        #[cfg(not(target_os = "windows"))]
        {
            Command::new(&vice_path)
                .arg(file_path.to_str().unwrap())
                .stdin(std::process::Stdio::null())
                .stdout(std::process::Stdio::null())
                .stderr(std::process::Stdio::null())
                .spawn()
        }
    };

    match result {
        Ok(_) => serde_json::json!({ "ok": true, "vicePath": vice_path, "filePath": file_path.to_str().unwrap() }),
        Err(e) => serde_json::json!({ "ok": false, "error": e.to_string() }),
    }
}

// ── Debugger (RetroDebugger) ────────────────────────────────────────────────

#[tauri::command]
fn get_debugger_config(app: AppHandle) -> serde_json::Value {
    let cfg = read_config(&app);
    let path = cfg["debuggerPath"].as_str().unwrap_or("").to_string();
    serde_json::json!({ "debuggerPath": path })
}

#[tauri::command]
async fn choose_debugger_executable(app: AppHandle) -> serde_json::Value {
    let dialog = app.dialog().clone();
    let file_dialog = dialog.file();

    #[cfg(target_os = "windows")]
    let file_dialog = file_dialog.add_filter("Executable", &["exe"]);

    #[cfg(target_os = "macos")]
    let file_dialog = {
        let candidates = [
            "/Applications",
            "/Applications/RetroDebugger",
        ];
        let start_dir = candidates
            .iter()
            .find(|p| std::path::Path::new(p).exists())
            .unwrap_or(&"/");
        file_dialog.set_directory(start_dir)
    };

    match file_dialog.blocking_pick_file() {
        Some(path) => {
            let path_str = path.to_string();
            let mut cfg = read_config(&app);
            cfg["debuggerPath"] = serde_json::json!(path_str);
            write_config(&app, &cfg);
            serde_json::json!({ "canceled": false, "debuggerPath": path_str })
        }
        None => serde_json::json!({ "canceled": true }),
    }
}

#[derive(Deserialize)]
struct DebugSymbol {
    name: String,
    address: u32,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct LaunchDebuggerPayload {
    bytes: Vec<u8>,
    file_name: Option<String>,
    symbols: Option<Vec<DebugSymbol>>,
    breakpoints: Option<Vec<u32>>,
    auto_jmp: Option<bool>,
    jmp_address: Option<u32>,
    wait_ms: Option<u32>,
    unpause: Option<bool>,
}

#[tauri::command]
async fn launch_debugger(app: AppHandle, payload: LaunchDebuggerPayload) -> serde_json::Value {
    let cfg = read_config(&app);
    let debugger_path = cfg["debuggerPath"].as_str().unwrap_or("").to_string();

    if debugger_path.is_empty() {
        return serde_json::json!({
            "ok": false,
            "error": "RetroDebugger nincs beallitva. Kattints az Edit gombra."
        });
    }

    let temp_dir = std::env::temp_dir().join("c64-visual-assembler");
    let _ = fs::create_dir_all(&temp_dir);
    let file_name = payload.file_name.unwrap_or_else(|| {
        format!("program-{}.prg", std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH).unwrap().as_millis())
    });
    let file_path = temp_dir.join(&file_name);
    if let Err(e) = fs::write(&file_path, &payload.bytes) {
        return serde_json::json!({ "ok": false, "error": e.to_string() });
    }

    let prg_arg = file_path.to_str().unwrap().to_string();

    // Build extra args: breakpoints, symbols, jmp
    // Order matches confirmed working: -breakpoints -jmp -unpause
    let mut extra_args: Vec<String> = Vec::new();

    if let Some(bps) = &payload.breakpoints {
        if !bps.is_empty() {
            let content: String = bps.iter()
                .map(|addr| format!("break ${:04X}", addr))
                .collect::<Vec<_>>()
                .join("\n");
            let bp_path = temp_dir.join("debug-breakpoints.txt");
            if fs::write(&bp_path, content).is_ok() {
                extra_args.push("-breakpoints".to_string());
                extra_args.push(bp_path.to_str().unwrap().to_string());
            }
        }
    }

    if let Some(symbols) = &payload.symbols {
        if !symbols.is_empty() {
            let content: String = symbols.iter()
                .map(|s| {
                    let safe = s.name.to_lowercase().replace(|c: char| !c.is_alphanumeric() && c != '_', "_");
                    format!("al C:{:04x} .{}", s.address, safe)
                })
                .collect::<Vec<_>>()
                .join("\n");
            let sym_path = temp_dir.join("debug-symbols.txt");
            if fs::write(&sym_path, content).is_ok() {
                extra_args.push("-symbols".to_string());
                extra_args.push(sym_path.to_str().unwrap().to_string());
            }
        }
    }

    let use_auto_jmp = payload.auto_jmp.unwrap_or(false);
    if let Some(addr) = payload.jmp_address {
        extra_args.push("-jmp".to_string());
        extra_args.push(format!("${:04X}", addr));
    }
    if let Some(ms) = payload.wait_ms {
        if ms > 0 {
            extra_args.push("-wait".to_string());
            extra_args.push(ms.to_string());
        }
    }
    if payload.unpause.unwrap_or(false) {
        extra_args.push("-unpause".to_string());
    }

    let result = if cfg!(target_os = "macos") {
        // On macOS resolve .app bundle → Contents/MacOS/<stem>
        let binary = if debugger_path.ends_with(".app") {
            let app_path = std::path::Path::new(&debugger_path);
            let stem = app_path.file_stem().unwrap_or_default().to_string_lossy().to_string();
            let candidate = app_path.join("Contents/MacOS").join(&stem);
            if candidate.exists() {
                candidate.to_string_lossy().to_string()
            } else {
                // Try without spaces (RetroDebugger.app → C64Debugger)
                let stem_nospace = stem.replace(' ', "");
                let candidate2 = app_path.join("Contents/MacOS").join(&stem_nospace);
                if candidate2.exists() {
                    candidate2.to_string_lossy().to_string()
                } else {
                    String::new()
                }
            }
        } else {
            debugger_path.clone()
        };

        if binary.is_empty() {
            return serde_json::json!({
                "ok": false,
                "error": format!("RetroDebugger binary nem talalhato. Beallitott ut: {}", debugger_path)
            });
        }

        let mut cmd = Command::new(&binary);
        cmd.arg("-prg").arg(&prg_arg);
        for a in &extra_args { cmd.arg(a); }
        if use_auto_jmp { cmd.arg("-autojmp"); }
        cmd.stdin(std::process::Stdio::null())
            .stdout(std::process::Stdio::null())
            .stderr(std::process::Stdio::null())
            .spawn()
    } else {
        #[cfg(target_os = "windows")]
        {
            let mut all_args = vec![
                format!("-prg"),
                prg_arg.clone(),
            ];
            all_args.extend(extra_args.iter().cloned());
            if use_auto_jmp { all_args.push(format!("-autojmp")); }
            let args_ps = all_args.iter()
                .map(|a| format!("'{}'", a.replace('\'', "''")))
                .collect::<Vec<_>>()
                .join(",");
            let ps_cmd = format!(
                "Start-Process -FilePath '{}' -ArgumentList {}",
                debugger_path.replace('\'', "''"),
                args_ps,
            );
            let _ = fs::write(
                temp_dir.join("debug.launch.log"),
                format!("CMD: {}\nARGS: {:?}\nBREAKPOINTS: {:?}\nAUTO_JMP: {:?}\n",
                    ps_cmd, all_args, payload.breakpoints, payload.auto_jmp),
            );
            Command::new("powershell")
                .args([
                    "-NoProfile",
                    "-NonInteractive",
                    "-WindowStyle", "Hidden",
                    "-Command", &ps_cmd,
                ])
                .stdin(std::process::Stdio::null())
                .stdout(std::process::Stdio::null())
                .stderr(std::process::Stdio::null())
                .creation_flags(0x08000000)
                .spawn()
        }
        #[cfg(not(target_os = "windows"))]
        {
            let mut cmd = Command::new(&debugger_path);
            cmd.arg("-prg").arg(&prg_arg);
            for a in &extra_args { cmd.arg(a); }
            if use_auto_jmp { cmd.arg("-autojmp"); }
            cmd.stdin(std::process::Stdio::null())
                .stdout(std::process::Stdio::null())
                .stderr(std::process::Stdio::null())
                .spawn()
        }
    };

    match result {
        Ok(_) => serde_json::json!({ "ok": true }),
        Err(e) => serde_json::json!({ "ok": false, "error": e.to_string() }),
    }
}

#[tauri::command]
async fn choose_incbin_file(app: AppHandle) -> serde_json::Value {
    let result = app.dialog().file()
        .add_filter("Binary files", &["bin", "prg", "sid", "raw"])
        .add_filter("All files", &["*"])
        .blocking_pick_file();

    match result {
        Some(path) => {
            let path_str = path.to_string();
            match fs::read(&path_str) {
                Ok(buf) => serde_json::json!({
                    "canceled": false,
                    "filePath": path_str,
                    "fileName": std::path::Path::new(&path_str).file_name().and_then(|n| n.to_str()).unwrap_or(""),
                    "bytes": buf
                }),
                Err(e) => serde_json::json!({ "canceled": false, "error": e.to_string() }),
            }
        }
        None => serde_json::json!({ "canceled": true }),
    }
}

#[tauri::command]
async fn load_incbin_sample(app: AppHandle, file_name: String) -> serde_json::Value {
    let file_path = match resolve_resource_file(&app, &format!("samples/{}", file_name)) {
        Ok(p) => p,
        Err(e) => return serde_json::json!({ "error": e.to_string() }),
    };
    match fs::read(&file_path) {
        Ok(buf) => serde_json::json!({
            "fileName": file_name,
            "filePath": file_path.to_str().unwrap_or(""),
            "bytes": buf
        }),
        Err(e) => serde_json::json!({ "error": e.to_string() }),
    }
}

#[tauri::command]
async fn choose_sid_file(app: AppHandle) -> serde_json::Value {
    let result = app.dialog().file()
        .add_filter("SID files", &["sid"])
        .add_filter("All files", &["*"])
        .blocking_pick_file();

    match result {
        Some(path) => {
            let path_str = path.to_string();
            match fs::read(&path_str) {
                Ok(buf) => match parse_sid_buffer(&buf) {
                    Ok(info) => {
                        let file_name = std::path::Path::new(&path_str)
                            .file_name().and_then(|n| n.to_str()).unwrap_or("").to_string();
                        let mut v = serde_json::to_value(info).unwrap();
                        v["canceled"] = serde_json::json!(false);
                        v["filePath"] = serde_json::json!(path_str);
                        v["fileName"] = serde_json::json!(file_name);
                        v
                    }
                    Err(e) => serde_json::json!({ "canceled": false, "error": e }),
                },
                Err(e) => serde_json::json!({ "canceled": false, "error": e.to_string() }),
            }
        }
        None => serde_json::json!({ "canceled": true }),
    }
}

#[tauri::command]
async fn load_sid_sample(app: AppHandle, file_name: String) -> serde_json::Value {
    let file_path = match resolve_resource_file(&app, &format!("samples/{}", file_name)) {
        Ok(p) => p,
        Err(e) => return serde_json::json!({ "error": e.to_string() }),
    };
    match fs::read(&file_path) {
        Ok(buf) => match parse_sid_buffer(&buf) {
            Ok(info) => {
                let mut v = serde_json::to_value(info).unwrap();
                v["filePath"] = serde_json::json!(file_path.to_str().unwrap_or(""));
                v["fileName"] = serde_json::json!(file_name);
                v
            }
            Err(e) => serde_json::json!({ "error": e }),
        },
        Err(e) => serde_json::json!({ "error": e.to_string() }),
    }
}

#[tauri::command]
async fn choose_include_file(app: AppHandle) -> serde_json::Value {
    let result = app.dialog().file()
        .add_filter("C64 Visual Assembler project", &["json"])
        .add_filter("All files", &["*"])
        .blocking_pick_file();

    match result {
        Some(path) => {
            let path_str = path.to_string();
            match fs::read_to_string(&path_str) {
                Ok(raw) => match serde_json::from_str::<serde_json::Value>(&raw) {
                    Ok(project) => {
                        if project["app"].as_str() != Some("c64-visual-assembler")
                            || !project["program"].is_array()
                        {
                            return serde_json::json!({
                                "canceled": false,
                                "error": "Not a valid C64 Visual Assembler project."
                            });
                        }
                        let file_name = std::path::Path::new(&path_str)
                            .file_stem().and_then(|n| n.to_str()).unwrap_or("").to_string();
                        serde_json::json!({
                            "canceled": false,
                            "filePath": path_str,
                            "fileName": file_name,
                            "blocks": project["program"]
                        })
                    }
                    Err(e) => serde_json::json!({ "canceled": false, "error": e.to_string() }),
                },
                Err(e) => serde_json::json!({ "canceled": false, "error": e.to_string() }),
            }
        }
        None => serde_json::json!({ "canceled": true }),
    }
}

#[tauri::command]
fn reload_include_file(file_path: String) -> serde_json::Value {
    match fs::read_to_string(&file_path) {
        Ok(raw) => match serde_json::from_str::<serde_json::Value>(&raw) {
            Ok(project) => {
                if project["app"].as_str() != Some("c64-visual-assembler")
                    || !project["program"].is_array()
                {
                    return serde_json::json!({ "error": "Not a valid C64 Visual Assembler project." });
                }
                let file_name = std::path::Path::new(&file_path)
                    .file_stem().and_then(|n| n.to_str()).unwrap_or("").to_string();
                serde_json::json!({ "fileName": file_name, "blocks": project["program"] })
            }
            Err(e) => serde_json::json!({ "error": e.to_string() }),
        },
        Err(e) => serde_json::json!({ "error": e.to_string() }),
    }
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct SavePrgPayload {
    bytes: Vec<u8>,
}

#[tauri::command]
async fn save_prg(app: AppHandle, payload: SavePrgPayload) -> serde_json::Value {
    let result = app.dialog().file()
        .add_filter("Commodore 64 PRG", &["prg"])
        .add_filter("All files", &["*"])
        .blocking_save_file();

    match result {
        Some(path) => {
            let path_str = path.to_string();
            match fs::write(&path_str, &payload.bytes) {
                Ok(_) => serde_json::json!({ "ok": true, "filePath": path_str }),
                Err(e) => serde_json::json!({ "ok": false, "error": e.to_string() }),
            }
        }
        None => serde_json::json!({ "canceled": true }),
    }
}

#[tauri::command]
async fn save_project(app: AppHandle, payload: serde_json::Value) -> serde_json::Value {
    let result = app.dialog().file()
        .add_filter("C64 Visual Assembler Project", &["json", "c64va"])
        .blocking_save_file();

    match result {
        Some(path) => {
            let path_str = path.to_string();
            let content = serde_json::to_string_pretty(&payload).unwrap();
            match fs::write(&path_str, content.as_bytes()) {
                Ok(_) => serde_json::json!({ "ok": true, "filePath": path_str }),
                Err(e) => serde_json::json!({ "ok": false, "error": e.to_string() }),
            }
        }
        None => serde_json::json!({ "canceled": true }),
    }
}

#[tauri::command]
async fn load_project(app: AppHandle) -> serde_json::Value {
    let result = app.dialog().file()
        .add_filter("C64 Visual Assembler Project", &["json", "c64va"])
        .blocking_pick_file();

    match result {
        Some(path) => {
            let path_str = path.to_string();
            match fs::read_to_string(&path_str) {
                Ok(raw) => match serde_json::from_str::<serde_json::Value>(&raw) {
                    Ok(project) => serde_json::json!({ "ok": true, "filePath": path_str, "project": project }),
                    Err(e) => serde_json::json!({ "ok": false, "error": e.to_string() }),
                },
                Err(e) => serde_json::json!({ "ok": false, "error": e.to_string() }),
            }
        }
        None => serde_json::json!({ "canceled": true }),
    }
}

#[tauri::command]
async fn open_manual(app: AppHandle) -> Result<(), String> {
    let manual_path = resolve_resource_file(&app, "docs/Visual Assembler Manual.pdf")
        .map_err(|e| e.to_string())?;
    app.opener().open_path(manual_path.to_string_lossy().as_ref(), None::<String>)
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn load_sample(app: AppHandle, sample_name: String) -> serde_json::Value {
    let file_path = match resolve_resource_file(&app, &format!("samples/{}.json", sample_name)) {
        Ok(p) => p,
        Err(e) => return serde_json::json!({ "ok": false, "error": e.to_string() }),
    };
    match fs::read_to_string(&file_path) {
        Ok(raw) => match serde_json::from_str::<serde_json::Value>(&raw) {
            Ok(sample) => serde_json::json!({ "ok": true, "sample": sample }),
            Err(e) => serde_json::json!({ "ok": false, "error": e.to_string() }),
        },
        Err(e) => serde_json::json!({ "ok": false, "error": e.to_string() }),
    }
}

// ── App setup ────────────────────────────────────────────────────────────────

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_window_state::Builder::default().skip_initial_state("about").build())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            get_app_version,
            set_title,
            open_external,
            quit_app,
            get_vice_config,
            choose_vice_executable,
            launch_vice,
            get_debugger_config,
            choose_debugger_executable,
            launch_debugger,
            choose_incbin_file,
            load_incbin_sample,
            choose_sid_file,
            load_sid_sample,
            choose_include_file,
            reload_include_file,
            save_prg,
            save_project,
            load_project,
            load_sample,
            open_manual,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
