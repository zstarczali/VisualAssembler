use std::fs;
use std::path::{Path, PathBuf};
use std::process::Command;
use std::time::Duration;
#[cfg(target_os = "windows")]
use std::os::windows::process::CommandExt;
use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Manager};
use tauri_plugin_dialog::DialogExt;
use tauri_plugin_dialog::{MessageDialogButtons, MessageDialogKind};
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
        if let Some(workspace_root) = std::path::Path::new(env!("CARGO_MANIFEST_DIR")).parent() {
            let dev_path = workspace_root.join(relative_path);
            if dev_path.exists() {
                return Ok(dev_path);
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

fn get_working_folder_path(cfg: &serde_json::Value) -> Option<PathBuf> {
    cfg["workingFolder"]
        .as_str()
        .map(str::trim)
        .filter(|s| !s.is_empty())
        .map(PathBuf::from)
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

fn resolve_vice_launch_path(vice_path: &str) -> Result<String, String> {
    if vice_path.is_empty() {
        return Err("VICE binary nem talalhato. Beallitott ut: ".to_string());
    }

    if cfg!(target_os = "macos") && vice_path.ends_with(".app") {
        let app_path = std::path::Path::new(vice_path);
        let stem = app_path.file_stem().unwrap_or_default().to_string_lossy().to_string();

        if let Some(parent) = app_path.parent() {
            let bin_candidate = parent.join("bin").join(&stem);
            if bin_candidate.exists() {
                return Ok(bin_candidate.to_string_lossy().to_string());
            }
        }

        return Err(format!(
            "VICE binary nem talalhato. Valaszd ki a 'bin/x64sc' scriptet a VICE mappajaban (nem az .app bundlet). Beallitott ut: {}",
            vice_path
        ));
    }

    if !std::path::Path::new(vice_path).exists() {
        return Err(format!("VICE binary nem talalhato. Beallitott ut: {}", vice_path));
    }

    Ok(vice_path.to_string())
}

fn spawn_vice_with_file(vice_path: &str, file_path: &std::path::Path) -> Result<(), String> {
    let binary = resolve_vice_launch_path(vice_path)?;

    let result = if cfg!(target_os = "macos") {
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
                binary.replace('\'', "''"),
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
            let mut cmd = Command::new(&binary);
            // Propagate display session variables — Tauri may not inherit them
            // on all desktop configurations (especially Wayland compositors).
            for var in &["DISPLAY", "WAYLAND_DISPLAY", "XDG_RUNTIME_DIR",
                         "DBUS_SESSION_BUS_ADDRESS", "GDK_BACKEND"] {
                if let Ok(val) = std::env::var(var) {
                    cmd.env(var, val);
                }
            }
            // apt-installed VICE lacks drive ROMs; mode 1 injects PRG directly.
            cmd.arg("-autostartprgmode").arg("1")
                .arg(file_path.to_str().unwrap())
                .stdin(std::process::Stdio::null())
                .stdout(std::process::Stdio::null())
                .stderr(std::process::Stdio::null())
                .spawn()
        }
    };

    result.map(|_| ()).map_err(|e| e.to_string())
}

fn get_exomizer_path(cfg: &serde_json::Value) -> String {
    cfg["exomizerPath"].as_str().unwrap_or("").to_string()
}

fn get_exomizer_border_flash(cfg: &serde_json::Value) -> bool {
    // Defaults to true if unset, so existing configs keep the visual feedback.
    cfg["uiSettings"]["exomizerBorderFlash"].as_bool().unwrap_or(true)
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
fn get_ui_settings(app: AppHandle) -> serde_json::Value {
    let cfg = read_config(&app);
    cfg["uiSettings"].clone()
}

#[tauri::command]
fn save_ui_settings(app: AppHandle, settings: serde_json::Value) {
    let mut cfg = read_config(&app);
    cfg["uiSettings"] = settings;
    write_config(&app, &cfg);
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
fn get_exomizer_config(app: AppHandle) -> serde_json::Value {
    let cfg = read_config(&app);
    serde_json::json!({ "exomizerPath": get_exomizer_path(&cfg) })
}

#[tauri::command]
fn get_working_folder(app: AppHandle) -> serde_json::Value {
    let cfg = read_config(&app);
    serde_json::json!({
        "workingFolder": cfg["workingFolder"].as_str().unwrap_or("")
    })
}

#[tauri::command]
async fn choose_working_folder(app: AppHandle) -> serde_json::Value {
    let current_folder = {
        let cfg = read_config(&app);
        get_working_folder_path(&cfg)
    };

    let mut dialog = app.dialog().file().set_title("Choose working folder");
    if let Some(folder) = current_folder {
        dialog = dialog.set_directory(folder);
    }

    match dialog.blocking_pick_folder() {
        Some(path) => {
            let path_str = path.to_string();
            let mut cfg = read_config(&app);
            cfg["workingFolder"] = serde_json::json!(path_str);
            write_config(&app, &cfg);
            serde_json::json!({ "canceled": false, "workingFolder": path_str })
        }
        None => serde_json::json!({ "canceled": true }),
    }
}

#[tauri::command]
async fn choose_vice_executable(app: AppHandle) -> serde_json::Value {
    let working_folder = {
        let cfg = read_config(&app);
        get_working_folder_path(&cfg)
    };
    let dialog = app.dialog().clone();
    let mut file_dialog = dialog.file();

    if let Some(folder) = working_folder.as_ref() {
        file_dialog = file_dialog.set_directory(folder);
    }

    // On Windows: filter .exe files
    #[cfg(target_os = "windows")]
    let file_dialog = file_dialog.add_filter("Executable", &["exe"]);

    // On macOS: .app bundles are directories and cannot be selected with pick_file.
    // Open the dialog directly in the VICE bin/ folder where the real scripts live.
    #[cfg(target_os = "macos")]
    let file_dialog = {
        if working_folder.is_some() {
            file_dialog
        } else {
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
        }
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

#[tauri::command]
async fn choose_exomizer_executable(app: AppHandle) -> serde_json::Value {
    let working_folder = {
        let cfg = read_config(&app);
        get_working_folder_path(&cfg)
    };
    let dialog = app.dialog().clone();
    let mut file_dialog = dialog.file();

    if let Some(folder) = working_folder.as_ref() {
        file_dialog = file_dialog.set_directory(folder);
    }

    #[cfg(target_os = "windows")]
    let file_dialog = file_dialog.add_filter("Executable", &["exe"]);

    match file_dialog.blocking_pick_file() {
        Some(path) => {
            let path_str = path.to_string();
            let mut cfg = read_config(&app);
            cfg["exomizerPath"] = serde_json::json!(path_str);
            write_config(&app, &cfg);
            serde_json::json!({ "canceled": false, "exomizerPath": path_str })
        }
        None => serde_json::json!({ "canceled": true }),
    }
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct LaunchVicePayload {
    bytes: Vec<u8>,
    file_name: Option<String>,
    #[serde(default)]
    sidecars: Option<DebuggerSidecars>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct BuildRawPayload {
    bytes: Vec<u8>,
    file_name: Option<String>,
    target_address: Option<String>,     // load address (hex without $), e.g. "C000"
    decompress_address: Option<String>, // decompress target (hex without $), e.g. "2000"
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct DebuggerSidecars {
    dbg: Option<String>,
    sym: Option<String>,
    vs: Option<String>,
}

fn write_debugger_sidecars(base_path: &Path, sidecars: &DebuggerSidecars) -> Result<(), String> {
    let parent = base_path.parent().unwrap_or_else(|| Path::new("."));
    let stem = base_path
        .file_stem()
        .and_then(|value| value.to_str())
        .filter(|value| !value.is_empty())
        .unwrap_or("program");

    let write_file = |extension: &str, content: &Option<String>| -> Result<(), String> {
        if let Some(text) = content {
            let path = parent.join(format!("{}.{}", stem, extension));
            fs::write(&path, text).map_err(|e| e.to_string())?;
        }
        Ok(())
    };

    write_file("dbg", &sidecars.dbg)?;
    write_file("sym", &sidecars.sym)?;
    write_file("vs", &sidecars.vs)?;
    Ok(())
}

fn crunch_with_exomizer(exomizer_path: &str, input_bytes: &[u8], file_name: &str, raw_mode: bool, raw_load: Option<&str>, raw_decompress: Option<&str>, border_flash: bool) -> Result<(PathBuf, Vec<u8>), String> {
    let temp_dir = std::env::temp_dir().join("c64-visual-assembler");
    fs::create_dir_all(&temp_dir).map_err(|e| format!("mkdir {:?}: {}", temp_dir, e))?;
    let input_path = temp_dir.join(file_name);
    fs::write(&input_path, input_bytes).map_err(|e| format!("write {:?}: {}", input_path, e))?;

    let ext = if raw_mode { "exo" } else { "prg" };
    let prefix = if raw_mode { "exomizer-raw" } else { "exomizer-sfx" };
    let output_path = temp_dir.join(format!(
        "{}-{}.{}",
        prefix,
        std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_millis(),
        ext
    ));

    if !std::path::Path::new(exomizer_path).exists() {
        return Err(format!("Exomizer executable not found: {}", exomizer_path));
    }

    let mut cmd = Command::new(exomizer_path);
    #[cfg(target_os = "windows")]
    {
        cmd.creation_flags(0x08000000); // CREATE_NO_WINDOW
    }
    let load_str;
    let infile_with_target;
    let args: Vec<&str> = if raw_mode {
        // exomizer mem (backward, default): -l <load> sets the PRG load address;
        // appending ",<target>" to the input filename tells exomizer the original
        // address of the file, which gets encoded into the stream.
        // Decoder reads ZP $04/$05 = end-of-crunched-data, JSR decrunch.
        //
        // Exomizer's default safety_offset is 2 bytes — decompressed data lands
        // 2 bytes EARLIER than the address we pass. Compensate by adding 2.
        load_str = format!("${}", raw_load.unwrap_or("C000"));
        let target_user = raw_decompress.unwrap_or("2000");
        let target_adjusted = u32::from_str_radix(target_user.trim_start_matches('$'), 16)
            .map(|v| v.saturating_add(2))
            .unwrap_or(0x2002);
        infile_with_target = format!("{},${:04X}", input_path.to_str().unwrap(), target_adjusted);
        vec!["mem", "-l", load_str.as_str(), "-o", output_path.to_str().unwrap(), infile_with_target.as_str()]
    } else {
        // sfx sys: self-extracting PRG. -x1 = fast accumulator-based border-flash
        // decrunch effect; -n disables any effect. Controlled by UI setting.
        let effect_flag = if border_flash { "-x1" } else { "-n" };
        vec!["sfx", "sys", effect_flag, "-o", output_path.to_str().unwrap(), input_path.to_str().unwrap()]
    };
    let output = cmd
        .args(&args)
        .stdin(std::process::Stdio::null())
        .stdout(std::process::Stdio::piped())
        .stderr(std::process::Stdio::piped())
        .output()
        .map_err(|e| format!("spawn {}: {} (args: {:?})", exomizer_path, e, args))?;

    if !output.status.success() {
        let stdout = String::from_utf8_lossy(&output.stdout).trim().to_string();
        let stderr = String::from_utf8_lossy(&output.stderr).trim().to_string();
        let error = if !stderr.is_empty() { stderr } else if !stdout.is_empty() { stdout } else { format!("Exomizer exit {:?}", output.status.code()) };
        return Err(error);
    }

    let bytes = fs::read(&output_path).map_err(|e| format!("read {:?}: {}", output_path, e))?;
    Ok((output_path, bytes))
}

#[tauri::command]
async fn build_exomizer_prg(app: AppHandle, payload: LaunchVicePayload) -> serde_json::Value {
    let cfg = read_config(&app);
    let exomizer_path = get_exomizer_path(&cfg);

    if exomizer_path.is_empty() {
        return serde_json::json!({
            "ok": false,
            "error": "Exomizer nincs beallitva. Kattints az Edit gombra es add meg az eleresi utjat."
        });
    }

    let file_name = payload.file_name.unwrap_or_else(|| {
        format!("program-{}.prg", std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH).unwrap().as_millis())
    });

    let border_flash = get_exomizer_border_flash(&cfg);
    match crunch_with_exomizer(&exomizer_path, &payload.bytes, &file_name, false, None, None, border_flash) {
        Ok((output_path, bytes)) => serde_json::json!({
            "ok": true,
            "exomizerPath": exomizer_path,
            "sourceFilePath": std::env::temp_dir().join("c64-visual-assembler").join(&file_name).to_string_lossy().to_string(),
            "filePath": output_path.to_string_lossy().to_string(),
            "bytes": bytes
        }),
        Err(error) => serde_json::json!({ "ok": false, "error": error }),
    }
}

#[tauri::command]
async fn build_exomizer_raw(app: AppHandle, payload: BuildRawPayload) -> serde_json::Value {
    let cfg = read_config(&app);
    let exomizer_path = get_exomizer_path(&cfg);

    if exomizer_path.is_empty() {
        return serde_json::json!({
            "ok": false,
            "error": "Exomizer nincs beallitva. Kattints az Edit gombra es add meg az eleresi utjat."
        });
    }

    let file_name = payload.file_name.unwrap_or_else(|| {
        format!("data-{}.bin", std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH).unwrap().as_millis())
    });

    let load_addr = payload.target_address.as_deref();
    let decomp_addr = payload.decompress_address.as_deref();
    // border_flash unused in mem mode (which uses our own depacker, not sfx),
    // but pass current setting for completeness.
    let border_flash = get_exomizer_border_flash(&cfg);
    match crunch_with_exomizer(&exomizer_path, &payload.bytes, &file_name, true, load_addr, decomp_addr, border_flash) {
        Ok((output_path, bytes)) => serde_json::json!({
            "ok": true,
            "exomizerPath": exomizer_path,
            "sourceFilePath": std::env::temp_dir().join("c64-visual-assembler").join(&file_name).to_string_lossy().to_string(),
            "filePath": output_path.to_string_lossy().to_string(),
            "bytes": bytes
        }),
        Err(error) => serde_json::json!({ "ok": false, "error": error }),
    }
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

    if let Some(sidecars) = &payload.sidecars {
        if let Err(e) = write_debugger_sidecars(&file_path, sidecars) {
            return serde_json::json!({ "ok": false, "error": e });
        }
    }

    let result = spawn_vice_with_file(&vice_path, &file_path);

    match result {
        Ok(_) => serde_json::json!({ "ok": true, "vicePath": vice_path, "filePath": file_path.to_str().unwrap() }),
        Err(e) => serde_json::json!({ "ok": false, "error": e.to_string() }),
    }
}

#[tauri::command]
async fn launch_exomizer(app: AppHandle, payload: LaunchVicePayload) -> serde_json::Value {
    let cfg = read_config(&app);
    let exomizer_path = get_exomizer_path(&cfg);
    let vice_path = {
        let p = cfg["vicePath"].as_str().unwrap_or("").to_string();
        if p.is_empty() { detect_vice_executable() } else { p }
    };

    if exomizer_path.is_empty() {
        return serde_json::json!({
            "ok": false,
            "error": "Exomizer nincs beallitva. Kattints az Edit gombra es add meg az eleresi utjat."
        });
    }

    if vice_path.is_empty() {
        return serde_json::json!({
            "ok": false,
            "error": "VICE nincs beallitva. Kattints az Edit gombra es add meg a VICE eleresi utjat."
        });
    }

    let file_name = payload.file_name.unwrap_or_else(|| {
        format!("program-{}.prg", std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH).unwrap().as_millis())
    });

    let border_flash = get_exomizer_border_flash(&cfg);
    let (output_path, _) = match crunch_with_exomizer(&exomizer_path, &payload.bytes, &file_name, false, None, None, border_flash) {
        Ok(result) => result,
        Err(error) => return serde_json::json!({ "ok": false, "error": error }),
    };

    if let Some(sidecars) = &payload.sidecars {
        if let Err(e) = write_debugger_sidecars(&output_path, sidecars) {
            return serde_json::json!({ "ok": false, "error": e });
        }
    }

    if let Err(e) = spawn_vice_with_file(&vice_path, &output_path) {
        return serde_json::json!({ "ok": false, "error": e });
    }

    serde_json::json!({
        "ok": true,
        "exomizerPath": exomizer_path,
        "vicePath": vice_path,
        "sourceFilePath": std::env::temp_dir().join("c64-visual-assembler").join(&file_name).to_string_lossy().to_string(),
        "filePath": output_path.to_string_lossy().to_string()
    })
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
    let working_folder = {
        let cfg = read_config(&app);
        get_working_folder_path(&cfg)
    };
    let dialog = app.dialog().clone();
    let mut file_dialog = dialog.file();

    if let Some(folder) = working_folder.as_ref() {
        file_dialog = file_dialog.set_directory(folder);
    }

    #[cfg(target_os = "windows")]
    let file_dialog = file_dialog.add_filter("Executable", &["exe"]);

    #[cfg(target_os = "macos")]
    let file_dialog = {
        if working_folder.is_some() {
            file_dialog
        } else {
            let candidates = [
                "/Applications",
                "/Applications/RetroDebugger",
            ];
            let start_dir = candidates
                .iter()
                .find(|p| std::path::Path::new(p).exists())
                .unwrap_or(&"/");
            file_dialog.set_directory(start_dir)
        }
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
    #[serde(default)]
    sidecars: Option<DebuggerSidecars>,
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

    if let Some(sidecars) = &payload.sidecars {
        if let Err(e) = write_debugger_sidecars(&file_path, sidecars) {
            return serde_json::json!({ "ok": false, "error": e });
        }
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
    let working_folder = {
        let cfg = read_config(&app);
        get_working_folder_path(&cfg)
    };
    let mut dialog = app.dialog().file()
        .add_filter("Binary files", &["bin", "prg", "sid", "raw"])
        .add_filter("All files", &["*"])
        ;
    if let Some(folder) = working_folder {
        dialog = dialog.set_directory(folder);
    }
    let result = dialog.blocking_pick_file();

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
async fn reload_incbin_file(app: AppHandle, file_path: String, base_dir: Option<String>) -> serde_json::Value {
    let raw_path = file_path.trim();
    let raw_input_path = std::path::Path::new(raw_path);
    let normalized_file_path = if !raw_input_path.is_absolute() && raw_input_path.has_root() {
        raw_path.trim_start_matches(['/', '\\']).to_string()
    } else {
        raw_path.to_string()
    };
    let input_path = std::path::Path::new(&normalized_file_path);
    let mut candidates: Vec<PathBuf> = Vec::new();

    if input_path.is_absolute() {
        candidates.push(input_path.to_path_buf());
    } else {
        if let Some(base) = base_dir.as_deref() {
            let base = base.trim();
            if !base.is_empty() {
                candidates.push(std::path::Path::new(base).join(&normalized_file_path));
            }
        }

        let is_bare_file_name = input_path
            .parent()
            .map(|p| p.as_os_str().is_empty())
            .unwrap_or(true);

        if is_bare_file_name {
            if let Ok(p) = resolve_resource_file(&app, &format!("samples/{}", normalized_file_path)) {
                candidates.push(p);
            }
        }

        if let Ok(p) = resolve_resource_file(&app, &normalized_file_path) {
            candidates.push(p);
        }
    }

    let resolved = candidates.into_iter().find(|p| p.exists());
    let Some(resolved) = resolved else {
        return serde_json::json!({ "error": format!("The system cannot find the file specified. (os error 2): {}", file_path) });
    };

    match fs::read(&resolved) {
        Ok(buf) => {
            let file_name = resolved
                .file_name().and_then(|n| n.to_str()).unwrap_or("").to_string();
            serde_json::json!({
                "fileName": file_name,
                "filePath": resolved.to_string_lossy(),
                "bytes": buf
            })
        }
        Err(e) => serde_json::json!({ "error": e.to_string() }),
    }
}

#[tauri::command]
async fn choose_sid_file(app: AppHandle) -> serde_json::Value {
    let working_folder = {
        let cfg = read_config(&app);
        get_working_folder_path(&cfg)
    };
    let mut dialog = app.dialog().file()
        .add_filter("SID files", &["sid"])
        .add_filter("All files", &["*"])
        ;
    if let Some(folder) = working_folder {
        dialog = dialog.set_directory(folder);
    }
    let result = dialog.blocking_pick_file();

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
async fn reload_sid_file(app: AppHandle, file_path: String, base_dir: Option<String>) -> serde_json::Value {
    let raw_path = file_path.trim();
    let raw_input_path = std::path::Path::new(raw_path);
    let normalized_file_path = if !raw_input_path.is_absolute() && raw_input_path.has_root() {
        raw_path.trim_start_matches(['/', '\\']).to_string()
    } else {
        raw_path.to_string()
    };
    let input_path = std::path::Path::new(&normalized_file_path);
    let mut candidates: Vec<PathBuf> = Vec::new();

    if input_path.is_absolute() {
        candidates.push(input_path.to_path_buf());
    } else {
        if let Some(base) = base_dir.as_deref() {
            let base = base.trim();
            if !base.is_empty() {
                candidates.push(std::path::Path::new(base).join(&normalized_file_path));
            }
        }

        let is_bare_file_name = input_path
            .parent()
            .map(|p| p.as_os_str().is_empty())
            .unwrap_or(true);

        if is_bare_file_name {
            if let Ok(p) = resolve_resource_file(&app, &format!("samples/{}", normalized_file_path)) {
                candidates.push(p);
            }
        }

        if let Ok(p) = resolve_resource_file(&app, &normalized_file_path) {
            candidates.push(p);
        }
    }

    let resolved = candidates.into_iter().find(|p| p.exists());
    let Some(resolved) = resolved else {
        return serde_json::json!({ "error": format!("The system cannot find the file specified. (os error 2): {}", file_path) });
    };

    match fs::read(&resolved) {
        Ok(buf) => match parse_sid_buffer(&buf) {
            Ok(info) => {
                let mut v = serde_json::to_value(info).unwrap();
                v["filePath"] = serde_json::json!(resolved.to_string_lossy().to_string());
                v["fileName"] = serde_json::json!(resolved.file_name().and_then(|n| n.to_str()).unwrap_or(""));
                v
            }
            Err(e) => serde_json::json!({ "error": e }),
        },
        Err(e) => serde_json::json!({ "error": e.to_string() }),
    }
}

#[tauri::command]
async fn choose_include_file(app: AppHandle) -> serde_json::Value {
    let working_folder = {
        let cfg = read_config(&app);
        get_working_folder_path(&cfg)
    };
    let mut dialog = app.dialog().file()
        .add_filter("Include (project or assembly)", &["json", "inc", "asm", "s"])
        .add_filter("C64 Visual Assembler project", &["json"])
        .add_filter("Assembly source", &["inc", "asm", "s"])
        .add_filter("All files", &["*"])
        ;
    if let Some(folder) = working_folder {
        dialog = dialog.set_directory(folder);
    }
    let result = dialog.blocking_pick_file();

    match result {
        Some(path) => {
            let path_str = path.to_string();
            let path_obj = std::path::Path::new(&path_str);
            let is_json = path_obj
                .extension()
                .and_then(|e| e.to_str())
                .map(|e| e.eq_ignore_ascii_case("json"))
                .unwrap_or(false);
            let file_name = path_obj
                .file_stem().and_then(|n| n.to_str()).unwrap_or("").to_string();
            match fs::read_to_string(&path_str) {
                Ok(raw) => {
                    if is_json {
                        match serde_json::from_str::<serde_json::Value>(&raw) {
                            Ok(project) => {
                                if project["app"].as_str() != Some("c64-visual-assembler")
                                    || !project["program"].is_array()
                                {
                                    return serde_json::json!({
                                        "canceled": false,
                                        "error": "Not a valid C64 Visual Assembler project."
                                    });
                                }
                                serde_json::json!({
                                    "canceled": false,
                                    "filePath": path_str,
                                    "fileName": file_name,
                                    "blocks": project["program"]
                                })
                            }
                            Err(e) => serde_json::json!({ "canceled": false, "error": e.to_string() }),
                        }
                    } else {
                        serde_json::json!({
                            "canceled": false,
                            "filePath": path_str,
                            "fileName": file_name,
                            "text": raw
                        })
                    }
                }
                Err(e) => serde_json::json!({ "canceled": false, "error": e.to_string() }),
            }
        }
        None => serde_json::json!({ "canceled": true }),
    }
}

#[tauri::command]
async fn reload_include_file(app: AppHandle, file_path: String, base_dir: Option<String>) -> serde_json::Value {
    let raw_path = file_path.trim();
    let raw_input_path = std::path::Path::new(raw_path);
    let normalized_file_path = if !raw_input_path.is_absolute() && raw_input_path.has_root() {
        raw_path.trim_start_matches(['/', '\\']).to_string()
    } else {
        raw_path.to_string()
    };
    let input_path = std::path::Path::new(&normalized_file_path);
    let mut candidates: Vec<PathBuf> = Vec::new();

    if input_path.is_absolute() {
        candidates.push(input_path.to_path_buf());
        // Cross-platform fallback: if the stored absolute path is from a different OS
        // (e.g. a Windows path opened on macOS), try resolving by filename only.
        if let Some(file_name) = input_path.file_name() {
            let bare = file_name.to_string_lossy();
            let wf = { let cfg = read_config(&app); get_working_folder_path(&cfg) };
            if let Some(folder) = wf.as_ref() {
                candidates.push(folder.join(bare.as_ref()));
            }
            if let Ok(p) = resolve_resource_file(&app, &format!("samples/{}", bare)) {
                candidates.push(p);
            }
        }
    } else {
        if let Some(base) = base_dir.as_deref() {
            let base = base.trim();
            if !base.is_empty() {
                candidates.push(std::path::Path::new(base).join(&normalized_file_path));
            }
        }

        let working_folder = {
            let cfg = read_config(&app);
            get_working_folder_path(&cfg)
        };
        if let Some(folder) = working_folder.as_ref() {
            candidates.push(folder.join(&normalized_file_path));
        }

        let is_bare_file_name = input_path
            .parent()
            .map(|p| p.as_os_str().is_empty())
            .unwrap_or(true);

        if is_bare_file_name {
            if input_path.extension().is_none() {
                let mut guessed: Vec<PathBuf> = Vec::new();
                if let Some(base) = base_dir.as_deref() {
                    let base = base.trim();
                    if !base.is_empty() {
                        let base_path = std::path::Path::new(base);
                        guessed.push(base_path.join(format!("{}.json", normalized_file_path)));
                        guessed.push(base_path.join(format!("{}.asm", normalized_file_path)));
                        guessed.push(base_path.join(format!("{}.inc", normalized_file_path)));
                        guessed.push(base_path.join(format!("{}.s", normalized_file_path)));
                    }
                }
                if let Some(folder) = working_folder.as_ref() {
                    guessed.push(folder.join(format!("{}.json", normalized_file_path)));
                    guessed.push(folder.join(format!("{}.asm", normalized_file_path)));
                    guessed.push(folder.join(format!("{}.inc", normalized_file_path)));
                    guessed.push(folder.join(format!("{}.s", normalized_file_path)));
                }
                candidates.extend(guessed);
            }
            if let Ok(p) = resolve_resource_file(&app, &format!("samples/{}", normalized_file_path)) {
                candidates.push(p);
            }
            if input_path.extension().is_none() {
                if let Ok(p) = resolve_resource_file(&app, &format!("samples/{}.json", normalized_file_path)) {
                    candidates.push(p);
                }
                if let Ok(p) = resolve_resource_file(&app, &format!("samples/{}.asm", normalized_file_path)) {
                    candidates.push(p);
                }
                if let Ok(p) = resolve_resource_file(&app, &format!("samples/{}.inc", normalized_file_path)) {
                    candidates.push(p);
                }
                if let Ok(p) = resolve_resource_file(&app, &format!("samples/{}.s", normalized_file_path)) {
                    candidates.push(p);
                }
            }
        }

        if let Ok(p) = resolve_resource_file(&app, &normalized_file_path) {
            candidates.push(p);
        }
        if input_path.extension().is_none() {
            if let Ok(p) = resolve_resource_file(&app, &format!("{}.json", normalized_file_path)) {
                candidates.push(p);
            }
            if let Ok(p) = resolve_resource_file(&app, &format!("{}.asm", normalized_file_path)) {
                candidates.push(p);
            }
            if let Ok(p) = resolve_resource_file(&app, &format!("{}.inc", normalized_file_path)) {
                candidates.push(p);
            }
            if let Ok(p) = resolve_resource_file(&app, &format!("{}.s", normalized_file_path)) {
                candidates.push(p);
            }
        }
    }

    let resolved = candidates.into_iter().find(|p| p.exists());
    let Some(resolved) = resolved else {
        return serde_json::json!({ "error": format!("The system cannot find the file specified. (os error 2): {}", file_path) });
    };

    let is_json = resolved
        .extension()
        .and_then(|e| e.to_str())
        .map(|e| e.eq_ignore_ascii_case("json"))
        .unwrap_or(false);
    // Return the full basename with extension (e.g. "hello.asm"), matching INCBIN's
    // convention and the value parseExpertText assigns when reading `.include "hello.asm"`.
    // Returning only file_stem broke the fileName match after the first reload.
    let file_name = resolved
        .file_name().and_then(|n| n.to_str()).unwrap_or("").to_string();
    match fs::read_to_string(&resolved) {
        Ok(raw) => {
            if is_json {
                match serde_json::from_str::<serde_json::Value>(&raw) {
                    Ok(project) => {
                        if project["app"].as_str() != Some("c64-visual-assembler")
                            || !project["program"].is_array()
                        {
                            return serde_json::json!({ "error": "Not a valid C64 Visual Assembler project." });
                        }
                        {
                            let expert_text = project["expertText"].as_str().unwrap_or("");
                            let mut resp = serde_json::json!({
                                "fileName": file_name,
                                "filePath": resolved.to_string_lossy().to_string(),
                                "blocks": project["program"]
                            });
                            if !expert_text.is_empty() {
                                resp["text"] = serde_json::Value::String(expert_text.to_string());
                            }
                            resp
                        }
                    }
                    Err(e) => serde_json::json!({ "error": e.to_string() }),
                }
            } else {
                serde_json::json!({
                    "fileName": file_name,
                    "filePath": resolved.to_string_lossy().to_string(),
                    "text": raw
                })
            }
        }
        Err(e) => serde_json::json!({ "error": e.to_string() }),
    }
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct SavePrgPayload {
    bytes: Vec<u8>,
    #[serde(default)]
    sidecars: Option<DebuggerSidecars>,
}

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct SaveBinPayload {
    bytes: Vec<u8>,
    #[serde(default)]
    file_name: Option<String>,
}

#[tauri::command]
fn read_bin_file(path: String) -> serde_json::Value {
    match fs::read(&path) {
        Ok(bytes) => serde_json::json!({ "ok": true, "bytes": bytes }),
        Err(e) => serde_json::json!({ "ok": false, "error": e.to_string() }),
    }
}

#[tauri::command]
async fn save_prg(app: AppHandle, payload: SavePrgPayload) -> serde_json::Value {
    let working_folder = {
        let cfg = read_config(&app);
        get_working_folder_path(&cfg)
    };
    let mut dialog = app.dialog().file()
        .add_filter("Commodore 64 PRG", &["prg"])
        .add_filter("All files", &["*"]);
    if let Some(folder) = working_folder {
        dialog = dialog.set_directory(folder);
    }
    let result = dialog.blocking_save_file();

    match result {
        Some(path) => {
            let path_str = path.to_string();
            match fs::write(&path_str, &payload.bytes) {
                Ok(_) => {
                    if let Some(sidecars) = &payload.sidecars {
                        if let Err(e) = write_debugger_sidecars(Path::new(&path_str), sidecars) {
                            return serde_json::json!({ "ok": false, "error": e });
                        }
                    }
                    serde_json::json!({ "ok": true, "filePath": path_str })
                }
                Err(e) => serde_json::json!({ "ok": false, "error": e.to_string() }),
            }
        }
        None => serde_json::json!({ "canceled": true }),
    }
}

#[tauri::command]
async fn save_bin(app: AppHandle, payload: SaveBinPayload) -> serde_json::Value {
    let working_folder = {
        let cfg = read_config(&app);
        get_working_folder_path(&cfg)
    };
    let mut dialog = app.dialog().file()
        .add_filter("Binary", &["bin"])
        .add_filter("All files", &["*"]);
    if let Some(folder) = working_folder {
        dialog = dialog.set_directory(folder);
    }
    if let Some(name) = payload.file_name.as_deref() {
        if !name.is_empty() {
            dialog = dialog.set_file_name(name);
        }
    }
    let result = dialog.blocking_save_file();

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

// ── D64 export via c1541 (VICE) ──────────────────────────────────────────────
// c1541 lives in the same bin/ directory as x64sc. We resolve it from the
// configured VICE path, then run:
//   c1541 -format "diskname,id" d64 disk.d64 -write program.prg progname

fn resolve_c1541_path(vice_path: &str) -> Option<PathBuf> {
    if vice_path.is_empty() {
        return None;
    }

    let vice = std::path::Path::new(vice_path);

    // If user picked a .app bundle on macOS, use sibling bin/c1541
    #[cfg(target_os = "macos")]
    {
        if vice_path.ends_with(".app") {
            if let Some(parent) = vice.parent() {
                let candidate = parent.join("bin").join("c1541");
                if candidate.exists() { return Some(candidate); }
            }
        }
    }

    // Same directory as the VICE binary
    if let Some(dir) = vice.parent() {
        #[cfg(target_os = "windows")]
        let exe_name = "c1541.exe";
        #[cfg(not(target_os = "windows"))]
        let exe_name = "c1541";

        let candidate = dir.join(exe_name);
        if candidate.exists() {
            return Some(candidate);
        }
    }

    None
}

fn sanitize_disk_name(name: &str, max_len: usize) -> String {
    let lower: String = name
        .chars()
        .filter(|c| c.is_ascii() && !matches!(c, '"' | ',' | '/' | '\\' | ':' | '\0'))
        .take(max_len)
        .collect::<String>()
        .to_lowercase();
    if lower.is_empty() { "disk".to_string() } else { lower }
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct D64FileEntry {
    bytes: Vec<u8>,
    name: String,
    /// Optional 16-bit load address (decimal). If Some, prepended to bytes
    /// before writing (PRG format). If None, bytes are written as-is.
    #[serde(default)]
    load_address: Option<u16>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct SaveD64Payload {
    files: Vec<D64FileEntry>,
    #[serde(default)]
    disk_name: Option<String>,
    #[serde(default)]
    sidecars: Option<DebuggerSidecars>,
}

#[tauri::command]
async fn save_d64(app: AppHandle, payload: SaveD64Payload) -> serde_json::Value {
    if payload.files.is_empty() {
        return serde_json::json!({ "ok": false, "error": "Nincs fajl a D64-re irashoz." });
    }

    // 1. Locate c1541
    let cfg = read_config(&app);
    let vice_path = {
        let p = cfg["vicePath"].as_str().unwrap_or("").to_string();
        if p.is_empty() { detect_vice_executable() } else { p }
    };

    let c1541_path = match resolve_c1541_path(&vice_path) {
        Some(p) => p,
        None => return serde_json::json!({
            "ok": false,
            "error": "c1541 nem talalhato. Allitsd be a VICE eleresi utjat (a c1541 a VICE bin/ mappajaban van)."
        }),
    };

    // 2. Ask user where to save
    let working_folder = get_working_folder_path(&cfg);
    let mut dialog = app.dialog().file()
        .add_filter("Commodore 64 disk image", &["d64"])
        .add_filter("All files", &["*"]);
    if let Some(folder) = working_folder {
        dialog = dialog.set_directory(folder);
    }
    let save_path = match dialog.blocking_save_file() {
        Some(p) => p.to_string(),
        None => return serde_json::json!({ "canceled": true }),
    };

    // 3. Prepare temp dir for staged PRG files
    let temp_dir = std::env::temp_dir().join("c64-visual-assembler");
    let _ = fs::create_dir_all(&temp_dir);

    // 4. Build disk name (PETSCII-safe uppercase)
    let raw_disk = payload.disk_name.unwrap_or_else(|| {
        std::path::Path::new(&save_path)
            .file_stem().unwrap_or_default().to_string_lossy().to_string()
    });
    let disk_name = sanitize_disk_name(&raw_disk, 16);
    let disk_id = "01";

    // 5. Write each file to a temp PRG, collecting (temp_path, c64_name) tuples.
    //    For files with load_address set, prepend the 2-byte little-endian header.
    let now_ms = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH).unwrap().as_millis();

    let mut staged: Vec<(PathBuf, String)> = Vec::new();
    for (idx, entry) in payload.files.iter().enumerate() {
        let prg_path = temp_dir.join(format!("d64-export-{}-{}.prg", now_ms, idx));

        let mut data: Vec<u8> = Vec::with_capacity(entry.bytes.len() + 2);
        if let Some(addr) = entry.load_address {
            data.push((addr & 0xFF) as u8);
            data.push((addr >> 8) as u8);
        }
        data.extend_from_slice(&entry.bytes);

        if let Err(e) = fs::write(&prg_path, &data) {
            // Cleanup what we already wrote
            for (p, _) in &staged { let _ = fs::remove_file(p); }
            return serde_json::json!({
                "ok": false,
                "error": format!("Nem sikerult ideiglenes fajl irasa ({}): {}", entry.name, e)
            });
        }

        let c64_name = sanitize_disk_name(&entry.name, 16);
        if c64_name.is_empty() {
            for (p, _) in &staged { let _ = fs::remove_file(p); }
            let _ = fs::remove_file(&prg_path);
            return serde_json::json!({
                "ok": false,
                "error": format!("A {}. fajl nevet ervenytelen.", idx + 1)
            });
        }
        staged.push((prg_path, c64_name));
    }

    // 6. Run c1541 with -format then -write per file
    let format_arg = format!("{},{}", disk_name, disk_id);

    #[allow(unused_mut)]
    let mut cmd = if cfg!(target_os = "macos") {
        let mut c = Command::new("bash");
        c.arg(c1541_path.to_string_lossy().to_string());
        c
    } else {
        Command::new(&c1541_path)
    };

    cmd.arg("-format").arg(&format_arg).arg("d64").arg(&save_path);
    for (prg_path, c64_name) in &staged {
        cmd.arg("-write").arg(prg_path.to_string_lossy().to_string()).arg(c64_name);
    }

    #[cfg(target_os = "windows")]
    {
        const CREATE_NO_WINDOW: u32 = 0x08000000;
        cmd.creation_flags(CREATE_NO_WINDOW);
    }

    let output = match cmd.output() {
        Ok(out) => out,
        Err(e) => {
            for (p, _) in &staged { let _ = fs::remove_file(p); }
            return serde_json::json!({
                "ok": false,
                "error": format!("c1541 inditasa sikertelen ({}): {}", c1541_path.display(), e)
            });
        }
    };

    // 7. Cleanup temp PRGs
    for (p, _) in &staged { let _ = fs::remove_file(p); }

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr).to_string();
        let stdout = String::from_utf8_lossy(&output.stdout).to_string();
        return serde_json::json!({
            "ok": false,
            "error": format!("c1541 hiba: {}{}", stderr, stdout)
        });
    }

    if let Some(sidecars) = &payload.sidecars {
        if let Err(e) = write_debugger_sidecars(Path::new(&save_path), sidecars) {
            return serde_json::json!({ "ok": false, "error": e });
        }
    }

    serde_json::json!({
        "ok": true,
        "filePath": save_path,
        "diskName": disk_name,
        "fileCount": staged.len(),
        "fileNames": staged.iter().map(|(_, n)| n.clone()).collect::<Vec<_>>(),
    })
}

// ── Run via D64: create temp D64, launch VICE ─────────────────────────────────

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct RunD64Payload {
    files: Vec<D64FileEntry>,
    #[serde(default)]
    disk_name: Option<String>,
    #[serde(default)]
    sidecars: Option<DebuggerSidecars>,
}

#[tauri::command]
async fn run_d64(app: AppHandle, payload: RunD64Payload) -> serde_json::Value {
    if payload.files.is_empty() {
        return serde_json::json!({ "ok": false, "error": "Nincs fajl a D64-re irashoz." });
    }

    let cfg = read_config(&app);
    let vice_path = {
        let p = cfg["vicePath"].as_str().unwrap_or("").to_string();
        if p.is_empty() { detect_vice_executable() } else { p }
    };

    let c1541_path = match resolve_c1541_path(&vice_path) {
        Some(p) => p,
        None => return serde_json::json!({
            "ok": false,
            "error": "c1541 nem talalhato. Allitsd be a VICE eleresi utjat."
        }),
    };

    let temp_dir = std::env::temp_dir().join("c64-visual-assembler");
    let _ = fs::create_dir_all(&temp_dir);
    let now_ms = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH).unwrap().as_millis();

    let raw_disk = payload.disk_name.unwrap_or_else(|| "disk".to_string());
    let disk_name = sanitize_disk_name(&raw_disk, 16);
    let disk_id = "01";
    let d64_path = temp_dir.join(format!("run-d64-{}.d64", now_ms));

    let mut staged: Vec<(PathBuf, String)> = Vec::new();
    for (idx, entry) in payload.files.iter().enumerate() {
        let prg_path = temp_dir.join(format!("run-d64-{}-{}.prg", now_ms, idx));
        let mut data: Vec<u8> = Vec::with_capacity(entry.bytes.len() + 2);
        if let Some(addr) = entry.load_address {
            data.push((addr & 0xFF) as u8);
            data.push((addr >> 8) as u8);
        }
        data.extend_from_slice(&entry.bytes);
        if let Err(e) = fs::write(&prg_path, &data) {
            for (p, _) in &staged { let _ = fs::remove_file(p); }
            return serde_json::json!({ "ok": false, "error": e.to_string() });
        }
        let c64_name = sanitize_disk_name(&entry.name, 16);
        staged.push((prg_path, c64_name));
    }

    let format_arg = format!("{},{}", disk_name, disk_id);
    #[allow(unused_mut)]
    let mut cmd = if cfg!(target_os = "macos") {
        let mut c = Command::new("bash");
        c.arg(c1541_path.to_string_lossy().to_string());
        c
    } else {
        Command::new(&c1541_path)
    };

    cmd.arg("-format").arg(&format_arg).arg("d64").arg(&d64_path);
    for (prg_path, c64_name) in &staged {
        cmd.arg("-write").arg(prg_path.to_string_lossy().to_string()).arg(c64_name);
    }

    #[cfg(target_os = "windows")]
    {
        const CREATE_NO_WINDOW: u32 = 0x08000000;
        cmd.creation_flags(CREATE_NO_WINDOW);
    }

    let c1541_out = match cmd.output() {
        Ok(o) => o,
        Err(e) => {
            for (p, _) in &staged { let _ = fs::remove_file(p); }
            return serde_json::json!({ "ok": false, "error": e.to_string() });
        }
    };
    for (p, _) in &staged { let _ = fs::remove_file(p); }

    if !c1541_out.status.success() {
        let _ = fs::remove_file(&d64_path);
        return serde_json::json!({
            "ok": false,
            "error": format!("c1541 hiba: {}{}", String::from_utf8_lossy(&c1541_out.stderr), String::from_utf8_lossy(&c1541_out.stdout))
        });
    }

    if let Some(sidecars) = &payload.sidecars {
        if let Err(e) = write_debugger_sidecars(&d64_path, sidecars) {
            let _ = fs::remove_file(&d64_path);
            return serde_json::json!({ "ok": false, "error": e });
        }
    }

    // Launch VICE with the temp D64 (same pattern as launch_vice)
    let d64_str = d64_path.to_str().unwrap_or("").to_string();
    let launch_result = if cfg!(target_os = "macos") {
        let binary = if vice_path.ends_with(".app") {
            let app_path = std::path::Path::new(&vice_path);
            let stem = app_path.file_stem().unwrap_or_default().to_string_lossy().to_string();
            if let Some(parent) = app_path.parent() {
                let cand = parent.join("bin").join(&stem);
                if cand.exists() { cand.to_string_lossy().to_string() } else { String::new() }
            } else { String::new() }
        } else { vice_path.clone() };

        if binary.is_empty() || !std::path::Path::new(&binary).exists() {
            return serde_json::json!({ "ok": false, "error": "VICE binary nem talalhato." });
        }
        Command::new("bash").arg(&binary).arg(&d64_str)
            .stdin(std::process::Stdio::null()).stdout(std::process::Stdio::null()).stderr(std::process::Stdio::null())
            .spawn()
    } else {
        #[cfg(target_os = "windows")]
        {
            let ps_cmd = format!(
                "Start-Process -FilePath '{}' -ArgumentList '{}'",
                vice_path.replace('\'', "''"),
                d64_str.replace('\'', "''"),
            );
            Command::new("powershell")
                .args(["-NoProfile", "-NonInteractive", "-WindowStyle", "Hidden", "-Command", &ps_cmd])
                .stdin(std::process::Stdio::null()).stdout(std::process::Stdio::null()).stderr(std::process::Stdio::null())
                .creation_flags(0x08000000)
                .spawn()
        }
        #[cfg(not(target_os = "windows"))]
        {
            let mut cmd = Command::new(&vice_path);
            for var in &["DISPLAY", "WAYLAND_DISPLAY", "XDG_RUNTIME_DIR",
                         "DBUS_SESSION_BUS_ADDRESS", "GDK_BACKEND"] {
                if let Ok(val) = std::env::var(var) { cmd.env(var, val); }
            }
            cmd.arg("-drive8type").arg("1541")
                .arg(&d64_str)
                .stdin(std::process::Stdio::null()).stdout(std::process::Stdio::null()).stderr(std::process::Stdio::null())
                .spawn()
        }
    };

    match launch_result {
        Ok(_) => serde_json::json!({ "ok": true, "filePath": d64_str, "vicePath": vice_path }),
        Err(e) => serde_json::json!({ "ok": false, "error": e.to_string() }),
    }
}

// ── 1541 Ultimate REST API ────────────────────────────────────────────────────

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct RunD64UltimatePayload {
    host: String,
    #[serde(default)]
    password: Option<String>,
    files: Vec<D64FileEntry>,
    #[serde(default)]
    disk_name: Option<String>,
}

#[tauri::command]
async fn run_d64_on_ultimate(app: AppHandle, payload: RunD64UltimatePayload) -> serde_json::Value {
    if payload.files.is_empty() {
        return serde_json::json!({ "ok": false, "error": "Nincs fajl a D64-re irashoz." });
    }

    let host = payload.host.trim().trim_end_matches('/').to_string();
    if host.is_empty() {
        return serde_json::json!({ "ok": false, "error": "C64 Ultimate host nincs megadva." });
    }

    // Build temp D64 with c1541
    let cfg = read_config(&app);
    let vice_path = {
        let p = cfg["vicePath"].as_str().unwrap_or("").to_string();
        if p.is_empty() { detect_vice_executable() } else { p }
    };
    let c1541_path = match resolve_c1541_path(&vice_path) {
        Some(p) => p,
        None => return serde_json::json!({
            "ok": false,
            "error": "c1541 nem talalhato. Allitsd be a VICE eleresi utjat."
        }),
    };

    let temp_dir = std::env::temp_dir().join("c64-visual-assembler");
    let _ = fs::create_dir_all(&temp_dir);
    let now_ms = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH).unwrap().as_millis();

    let raw_disk = payload.disk_name.unwrap_or_else(|| "disk".to_string());
    let disk_name = sanitize_disk_name(&raw_disk, 16);
    let disk_id = "01";
    let d64_path = temp_dir.join(format!("ultimate-d64-{}.d64", now_ms));

    let mut staged: Vec<(PathBuf, String)> = Vec::new();
    for (idx, entry) in payload.files.iter().enumerate() {
        let prg_path = temp_dir.join(format!("ultimate-d64-{}-{}.prg", now_ms, idx));
        let mut data: Vec<u8> = Vec::with_capacity(entry.bytes.len() + 2);
        if let Some(addr) = entry.load_address {
            data.push((addr & 0xFF) as u8);
            data.push((addr >> 8) as u8);
        }
        data.extend_from_slice(&entry.bytes);
        if let Err(e) = fs::write(&prg_path, &data) {
            for (p, _) in &staged { let _ = fs::remove_file(p); }
            return serde_json::json!({ "ok": false, "error": e.to_string() });
        }
        let c64_name = sanitize_disk_name(&entry.name, 16);
        staged.push((prg_path, c64_name));
    }

    let format_arg = format!("{},{}", disk_name, disk_id);
    #[allow(unused_mut)]
    let mut cmd = if cfg!(target_os = "macos") {
        let mut c = Command::new("bash");
        c.arg(c1541_path.to_string_lossy().to_string());
        c
    } else {
        Command::new(&c1541_path)
    };
    cmd.arg("-format").arg(&format_arg).arg("d64").arg(&d64_path);
    for (prg_path, c64_name) in &staged {
        cmd.arg("-write").arg(prg_path.to_string_lossy().to_string()).arg(c64_name);
    }
    #[cfg(target_os = "windows")]
    {
        const CREATE_NO_WINDOW: u32 = 0x08000000;
        cmd.creation_flags(CREATE_NO_WINDOW);
    }

    let c1541_out = match cmd.output() {
        Ok(o) => o,
        Err(e) => {
            for (p, _) in &staged { let _ = fs::remove_file(p); }
            return serde_json::json!({ "ok": false, "error": e.to_string() });
        }
    };
    for (p, _) in &staged { let _ = fs::remove_file(p); }

    if !c1541_out.status.success() {
        let _ = fs::remove_file(&d64_path);
        return serde_json::json!({
            "ok": false,
            "error": format!("c1541 hiba: {}{}", String::from_utf8_lossy(&c1541_out.stderr), String::from_utf8_lossy(&c1541_out.stdout))
        });
    }

    // Read D64 bytes and upload to Ultimate
    let d64_bytes = match fs::read(&d64_path) {
        Ok(b) => b,
        Err(e) => {
            let _ = fs::remove_file(&d64_path);
            return serde_json::json!({ "ok": false, "error": e.to_string() });
        }
    };
    let _ = fs::remove_file(&d64_path);

    let password = payload.password;

    let client = match reqwest::Client::builder()
        .timeout(Duration::from_secs(30))
        .build()
    {
        Ok(c) => c,
        Err(e) => return serde_json::json!({ "ok": false, "error": e.to_string() }),
    };

    // Step 1: Mount D64 on drive A (device 8)
    let mount_url = format!("http://{}/v1/drives/a:mount", host);
    let mut mount_req = client
        .post(&mount_url)
        .header("Content-Type", "application/octet-stream")
        .body(d64_bytes);
    if let Some(ref pwd) = password {
        if !pwd.is_empty() {
            mount_req = mount_req.header("X-Password", pwd.clone());
        }
    }
    match mount_req.send().await {
        Ok(resp) => {
            if !resp.status().is_success() {
                let status = resp.status().as_u16();
                let text = resp.text().await.unwrap_or_default();
                return serde_json::json!({ "ok": false, "error": format!("D64 mount HTTP {}: {}", status, text.trim()) });
            }
        }
        Err(e) => return serde_json::json!({ "ok": false, "error": format!("D64 mount: {}", e) }),
    }

    // Step 2: Run the main PRG (first file) via DMA
    let main_entry = &payload.files[0];
    let mut prg_bytes: Vec<u8> = Vec::with_capacity(main_entry.bytes.len() + 2);
    if let Some(addr) = main_entry.load_address {
        prg_bytes.push((addr & 0xFF) as u8);
        prg_bytes.push((addr >> 8) as u8);
    }
    prg_bytes.extend_from_slice(&main_entry.bytes);

    let run_url = format!("http://{}/v1/runners:run_prg", host);
    let mut run_req = client
        .post(&run_url)
        .header("Content-Type", "application/octet-stream")
        .body(prg_bytes);
    if let Some(pwd) = password {
        if !pwd.is_empty() {
            run_req = run_req.header("X-Password", pwd);
        }
    }
    match run_req.send().await {
        Ok(resp) => {
            let status = resp.status().as_u16();
            if resp.status().is_success() {
                serde_json::json!({ "ok": true })
            } else {
                let text = resp.text().await.unwrap_or_default();
                serde_json::json!({ "ok": false, "error": format!("HTTP {}: {}", status, text.trim()) })
            }
        }
        Err(e) => serde_json::json!({ "ok": false, "error": e.to_string() }),
    }
}

#[tauri::command]
async fn run_on_ultimate(host: String, password: Option<String>, prg_bytes: Vec<u8>) -> serde_json::Value {
    let host = host.trim().trim_end_matches('/').to_string();
    let url = format!("http://{}/v1/runners:run_prg", host);
    let client = match reqwest::Client::builder()
        .timeout(Duration::from_secs(15))
        .build()
    {
        Ok(c) => c,
        Err(e) => return serde_json::json!({ "ok": false, "error": e.to_string() }),
    };
    let mut req = client
        .post(&url)
        .header("Content-Type", "application/octet-stream")
        .body(prg_bytes);
    if let Some(pwd) = password {
        if !pwd.is_empty() {
            req = req.header("X-Password", pwd);
        }
    }
    match req.send().await {
        Ok(resp) => {
            let status = resp.status().as_u16();
            if resp.status().is_success() {
                serde_json::json!({ "ok": true })
            } else {
                let text = resp.text().await.unwrap_or_default();
                serde_json::json!({ "ok": false, "error": format!("HTTP {}: {}", status, text.trim()) })
            }
        }
        Err(e) => serde_json::json!({ "ok": false, "error": e.to_string() }),
    }
}

#[tauri::command]
async fn test_ultimate_connection(host: String, password: Option<String>) -> serde_json::Value {
    let host = host.trim().trim_end_matches('/').to_string();
    let url = format!("http://{}/v1/info", host);
    let client = match reqwest::Client::builder()
        .timeout(Duration::from_secs(5))
        .build()
    {
        Ok(c) => c,
        Err(e) => return serde_json::json!({ "ok": false, "error": e.to_string() }),
    };
    let mut req = client.get(&url);
    if let Some(pwd) = password {
        if !pwd.is_empty() {
            req = req.header("X-Password", pwd);
        }
    }
    match req.send().await {
        Ok(resp) => {
            let status = resp.status().as_u16();
            if status == 403 {
                return serde_json::json!({ "ok": false, "error": "Authentication failed (wrong password?)" });
            }
            if resp.status().is_success() {
                let text = resp.text().await.unwrap_or_default();
                let info: serde_json::Value = serde_json::from_str(&text)
                    .unwrap_or(serde_json::json!({ "product": text.trim() }));
                serde_json::json!({ "ok": true, "info": info })
            } else {
                serde_json::json!({ "ok": false, "error": format!("HTTP {}", status) })
            }
        }
        Err(e) => serde_json::json!({ "ok": false, "error": e.to_string() }),
    }
}

#[tauri::command]
async fn save_project(app: AppHandle, payload: serde_json::Value) -> serde_json::Value {
    // If the caller passes a _filePath, save silently to that path
    let existing_path = payload.get("_filePath").and_then(|v| v.as_str()).unwrap_or("").to_string();
    let default_name  = payload.get("_defaultName").and_then(|v| v.as_str()).unwrap_or("program.json").to_string();

    let save_path: String = if !existing_path.is_empty() {
        existing_path
    } else {
        let working_folder = {
            let cfg = read_config(&app);
            get_working_folder_path(&cfg)
        };
        let mut dialog = app.dialog().file()
            .add_filter("C64 Visual Assembler Project", &["json", "c64va"])
            .set_file_name(&default_name);
        if let Some(folder) = working_folder {
            dialog = dialog.set_directory(folder);
        }
        let result = dialog.blocking_save_file();
        match result {
            Some(path) => path.to_string(),
            None => return serde_json::json!({ "canceled": true }),
        }
    };

    // Strip internal helper fields before serialising
    let mut clean = payload.clone();
    if let Some(obj) = clean.as_object_mut() {
        obj.remove("_filePath");
        obj.remove("_defaultName");
    }
    let content = serde_json::to_string_pretty(&clean).unwrap();
    match fs::write(&save_path, content.as_bytes()) {
        Ok(_)  => serde_json::json!({ "ok": true, "filePath": save_path }),
        Err(e) => serde_json::json!({ "ok": false, "error": e.to_string() }),
    }
}

#[tauri::command]
async fn open_proj_file(app: AppHandle) -> serde_json::Value {
    let working_folder = {
        let cfg = read_config(&app);
        get_working_folder_path(&cfg)
    };
    let mut dialog = app.dialog().file()
        .add_filter("Visual Assembler Project", &["proj"])
        .add_filter("All files", &["*"])
        ;
    if let Some(folder) = working_folder {
        dialog = dialog.set_directory(folder);
    }
    let result = dialog.blocking_pick_file();

    match result {
        Some(path) => {
            let path_str = path.to_string();
            match fs::read_to_string(&path_str) {
                Ok(raw) => match serde_json::from_str::<serde_json::Value>(&raw) {
                    Ok(proj) => serde_json::json!({ "ok": true, "filePath": path_str, "project": proj }),
                    Err(e)   => serde_json::json!({ "ok": false, "error": e.to_string() }),
                },
                Err(e) => serde_json::json!({ "ok": false, "error": e.to_string() }),
            }
        }
        None => serde_json::json!({ "canceled": true }),
    }
}

#[tauri::command]
async fn save_proj_file(app: AppHandle, path: String, content: String) -> serde_json::Value {
    let save_path = if path.is_empty() {
        let working_folder = {
            let cfg = read_config(&app);
            get_working_folder_path(&cfg)
        };
        let mut dialog = app.dialog().file()
            .add_filter("Visual Assembler Project", &["proj"])
            .set_file_name("project.proj");
        if let Some(folder) = working_folder {
            dialog = dialog.set_directory(folder);
        }
        let result = dialog.blocking_save_file();
        match result {
            Some(p) => p.to_string(),
            None    => return serde_json::json!({ "canceled": true }),
        }
    } else {
        path
    };

    match fs::write(&save_path, content.as_bytes()) {
        Ok(_)  => serde_json::json!({ "ok": true, "filePath": save_path }),
        Err(e) => serde_json::json!({ "ok": false, "error": e.to_string() }),
    }
}

#[tauri::command]
fn read_text_file(path: String) -> serde_json::Value {
    match fs::read_to_string(&path) {
        Ok(content) => serde_json::json!({ "ok": true, "content": content }),
        Err(e)      => serde_json::json!({ "ok": false, "error": e.to_string() }),
    }
}

#[tauri::command]
async fn save_text_file(path: String, content: String) -> serde_json::Value {
    if path.is_empty() {
        return serde_json::json!({ "ok": false, "error": "Empty path" });
    }
    let path_buf = PathBuf::from(&path);
    if let Some(parent) = path_buf.parent() {
        let _ = fs::create_dir_all(parent);
    }
    match fs::write(&path_buf, content.as_bytes()) {
        Ok(_) => serde_json::json!({ "ok": true, "path": path }),
        Err(e) => serde_json::json!({ "ok": false, "error": e.to_string() }),
    }
}

#[tauri::command]
fn get_project_snapshot_path(app: AppHandle, project_path: String, snapshot_id: String) -> serde_json::Value {
    let path = if project_path.is_empty() {
        let dir = app.path().app_config_dir().unwrap();
        let name = if snapshot_id.is_empty() {
            "untitled".to_string()
        } else {
            format!("tab-{}", snapshot_id)
        };
        dir.join(format!("{}.snapshots.json", name))
    } else {
        let source = PathBuf::from(&project_path);
        let stem = source.file_stem().and_then(|s| s.to_str()).unwrap_or("project");
        let snapshot_name = format!("{}.snapshots.json", stem);
        if let Some(parent) = source.parent() {
            parent.join(snapshot_name)
        } else {
            app.path().app_config_dir().unwrap().join(snapshot_name)
        }
    };
    serde_json::json!({ "ok": true, "path": path.to_string_lossy().to_string() })
}

#[tauri::command]
async fn save_asm_file(app: AppHandle, path: String, content: String) -> serde_json::Value {
    let save_path = if path.is_empty() {
        let working_folder = {
            let cfg = read_config(&app);
            get_working_folder_path(&cfg)
        };
        let mut dialog = app.dialog().file()
            .add_filter("Assembly Source", &["asm", "s", "a65"])
            .add_filter("All files", &["*"])
            .set_file_name("program.asm");
        if let Some(folder) = working_folder {
            dialog = dialog.set_directory(folder);
        }
        let result = dialog.blocking_save_file();
        match result {
            Some(p) => p.to_string(),
            None    => return serde_json::json!({ "canceled": true }),
        }
    } else {
        path
    };

    if Path::new(&save_path).exists() {
        let overwrite = app
            .dialog()
            .message(format!("The file already exists:\n\n{}\n\nOverwrite it?", save_path))
            .title("Overwrite existing file?")
            .kind(MessageDialogKind::Warning)
            .buttons(MessageDialogButtons::YesNo)
            .blocking_show();
        if !overwrite {
            return serde_json::json!({ "canceled": true });
        }
    }

    match fs::write(&save_path, content.as_bytes()) {
        Ok(_)  => serde_json::json!({ "ok": true, "filePath": save_path }),
        Err(e) => serde_json::json!({ "ok": false, "error": e.to_string() }),
    }
}

#[tauri::command]
async fn choose_asm_file(app: AppHandle) -> serde_json::Value {
    let working_folder = {
        let cfg = read_config(&app);
        get_working_folder_path(&cfg)
    };
    let mut dialog = app.dialog().file()
        .add_filter("Assembly Source", &["asm", "s", "a65"])
        .add_filter("All files", &["*"])
        ;
    if let Some(folder) = working_folder {
        dialog = dialog.set_directory(folder);
    }
    let result = dialog.blocking_pick_file();

    match result {
        Some(path) => {
            let path_str = path.to_string();
            match fs::read_to_string(&path_str) {
                Ok(content) => serde_json::json!({ "ok": true, "filePath": path_str, "content": content }),
                Err(e)      => serde_json::json!({ "ok": false, "error": e.to_string() }),
            }
        }
        None => serde_json::json!({ "canceled": true }),
    }
}

#[tauri::command]
async fn choose_proj_member(app: AppHandle) -> serde_json::Value {
    let working_folder = {
        let cfg = read_config(&app);
        get_working_folder_path(&cfg)
    };
    let mut dialog = app.dialog().file()
        .add_filter("C64 Visual Assembler Project", &["json", "c64va"])
        .add_filter("Assembly Source", &["asm", "s", "a65", "inc"])
        ;
    if let Some(folder) = working_folder {
        dialog = dialog.set_directory(folder);
    }
    let result = dialog.blocking_pick_file();

    match result {
        Some(path) => {
            let path_str = path.to_string();
            let file_name = std::path::Path::new(&path_str)
                .file_name()
                .and_then(|n| n.to_str())
                .unwrap_or("")
                .to_string();
            serde_json::json!({ "canceled": false, "filePath": path_str, "fileName": file_name })
        }
        None => serde_json::json!({ "canceled": true }),
    }
}

#[tauri::command]
async fn load_project(app: AppHandle) -> serde_json::Value {
    let working_folder = {
        let cfg = read_config(&app);
        get_working_folder_path(&cfg)
    };
    let mut dialog = app.dialog().file()
        .add_filter("C64 Visual Assembler Project", &["json", "c64va"])
        ;
    if let Some(folder) = working_folder {
        dialog = dialog.set_directory(folder);
    }
    let result = dialog.blocking_pick_file();

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
                                "ok": false,
                                "error": "Not a valid C64 Visual Assembler project."
                            });
                        }
                        serde_json::json!({ "ok": true, "filePath": path_str, "project": project })
                    },
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
            Ok(sample) => {
                // Pre-load any d64 extras binary files so the frontend doesn't need a
                // separate readBinFile round-trip with fragile JS path resolution.
                let mut extras_loaded: Vec<serde_json::Value> = Vec::new();
                if let Some(extras) = sample.get("d64").and_then(|d| d.get("extras")).and_then(|e| e.as_array()) {
                    let base_dir = file_path.parent().unwrap_or(&file_path);
                    for entry in extras {
                        if let Some(src) = entry.get("sourcePath").and_then(|v| v.as_str()) {
                            if !src.is_empty() {
                                let bin_path = base_dir.join(src);
                                if let Ok(bytes) = fs::read(&bin_path) {
                                    extras_loaded.push(serde_json::json!({
                                        "name": entry.get("name").and_then(|v| v.as_str()).unwrap_or(""),
                                        "sourcePath": src,
                                        "loadAddress": entry.get("loadAddress").and_then(|v| v.as_str()).unwrap_or(""),
                                        "decompressAddress": entry.get("decompressAddress").and_then(|v| v.as_str()).unwrap_or(""),
                                        "crunch": entry.get("crunch").and_then(|v| v.as_bool()).unwrap_or(false),
                                        "bytes": bytes
                                    }));
                                }
                            }
                        }
                    }
                }
                serde_json::json!({
                    "ok": true,
                    "sample": sample,
                    "filePath": file_path.to_string_lossy().to_string(),
                    "extrasLoaded": extras_loaded
                })
            },
            Err(e) => serde_json::json!({ "ok": false, "error": e.to_string() }),
        },
        Err(e) => serde_json::json!({ "ok": false, "error": e.to_string() }),
    }
}


#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;
    use std::path::PathBuf;
    use std::time::{SystemTime, UNIX_EPOCH};

    fn unique_temp_dir(prefix: &str) -> PathBuf {
        let stamp = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_nanos();
        std::env::temp_dir().join(format!("{}-{}-{}", prefix, std::process::id(), stamp))
    }

    #[test]
    fn sanitize_disk_name_strips_forbidden_chars_and_lowercases() {
        assert_eq!(sanitize_disk_name("Disk: Name/One,Two", 16), "disk nameonetwo");
        assert_eq!(sanitize_disk_name("\"/:\\\0", 16), "disk");
        assert_eq!(sanitize_disk_name("ABCDEFGHIJKLMN", 4), "abcd");
    }

    #[test]
    fn resolve_c1541_path_finds_sibling_binary_next_to_vice() {
        let root = unique_temp_dir("c64va-c1541");
        fs::create_dir_all(&root).unwrap();

        #[cfg(target_os = "windows")]
        let vice_name = "x64sc.exe";
        #[cfg(not(target_os = "windows"))]
        let vice_name = "x64sc";

        #[cfg(target_os = "windows")]
        let c1541_name = "c1541.exe";
        #[cfg(not(target_os = "windows"))]
        let c1541_name = "c1541";

        let vice_path = root.join(vice_name);
        let c1541_path = root.join(c1541_name);
        fs::write(&vice_path, b"vice").unwrap();
        fs::write(&c1541_path, b"c1541").unwrap();

        let resolved = resolve_c1541_path(vice_path.to_str().unwrap()).unwrap();
        assert_eq!(resolved, c1541_path);

        let _ = fs::remove_dir_all(&root);
    }
}

// ── App setup ────────────────────────────────────────────────────────────────

pub fn run() {
    tauri::Builder::default()
        .plugin({
            // On Linux/Wayland: position is always 0,0 (compositor doesn't expose it)
            // and MAXIMIZED state causes GTK CSD buttons to malfunction when restored.
            // Save only SIZE so the user's window size is remembered, nothing else.
            // On macOS/Windows: save everything as before.
            #[cfg(not(any(target_os = "macos", target_os = "windows")))]
            let flags = tauri_plugin_window_state::StateFlags::SIZE
                | tauri_plugin_window_state::StateFlags::VISIBLE;
            #[cfg(any(target_os = "macos", target_os = "windows"))]
            let flags = tauri_plugin_window_state::StateFlags::all();
            tauri_plugin_window_state::Builder::default()
                .with_state_flags(flags)
                .skip_initial_state("about")
                .build()
        })
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .setup(|_| Ok(()))
        .invoke_handler(tauri::generate_handler![
            get_app_version,
            set_title,
            open_external,
            quit_app,
            get_ui_settings,
            save_ui_settings,
            get_vice_config,
            get_exomizer_config,
            get_working_folder,
            choose_vice_executable,
            choose_exomizer_executable,
            choose_working_folder,
            build_exomizer_prg,
            build_exomizer_raw,
            launch_vice,
            launch_exomizer,
            get_debugger_config,
            choose_debugger_executable,
            launch_debugger,
            choose_incbin_file,
            load_incbin_sample,
            reload_incbin_file,
            choose_sid_file,
            load_sid_sample,
            reload_sid_file,
            choose_include_file,
            reload_include_file,
            save_prg,
            save_bin,
            save_d64,
            run_d64,
            run_d64_on_ultimate,
            read_bin_file,
            save_project,
            load_project,
            open_proj_file,
            save_proj_file,
            read_text_file,
            save_text_file,
            get_project_snapshot_path,
            save_asm_file,
            choose_asm_file,
            choose_proj_member,
            load_sample,
            open_manual,
            run_on_ultimate,
            test_ultimate_connection,
        ])
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { .. } = event {
                window.app_handle().exit(0);
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
