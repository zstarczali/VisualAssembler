use serde::{Deserialize, Serialize};
use base64::Engine as _;
use std::fs;
use std::io::{ErrorKind, Write};
use std::collections::HashMap;
use std::sync::{Mutex, OnceLock};
#[cfg(target_os = "windows")]
use std::os::windows::process::CommandExt;
use std::path::{Path, PathBuf};
use std::process::Command;
use std::thread;
use std::time::{Duration, Instant};
use tauri::{AppHandle, Manager};
use tauri_plugin_dialog::DialogExt;
use tauri_plugin_dialog::{MessageDialogButtons, MessageDialogKind};
use tauri_plugin_opener::OpenerExt;

mod sid_core;
mod sid_file;

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

fn get_ub_working_folder_path(cfg: &serde_json::Value) -> Option<PathBuf> {
    cfg["ubWorkingFolder"]
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
        let stem = app_path
            .file_stem()
            .unwrap_or_default()
            .to_string_lossy()
            .to_string();

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
        return Err(format!(
            "VICE binary nem talalhato. Beallitott ut: {}",
            vice_path
        ));
    }

    Ok(vice_path.to_string())
}

/// Full path of Windows PowerShell. Spawning plain "powershell" relies on PATH;
/// on machines where an installer rewrote PATH it fails with "program not found"
/// although VICE itself starts fine by hand.
#[cfg(target_os = "windows")]
fn windows_powershell_path() -> String {
    let root = std::env::var("SystemRoot").unwrap_or_else(|_| r"C:\Windows".to_string());
    let full = std::path::Path::new(&root).join(r"System32\WindowsPowerShell\v1.0\powershell.exe");
    if full.exists() {
        full.to_string_lossy().to_string()
    } else {
        "powershell".to_string()
    }
}

/// One Start-Process argument: Start-Process joins -ArgumentList with spaces
/// without quoting, so a path with a space must carry its own double quotes.
#[cfg(target_os = "windows")]
fn windows_ps_arg(arg: &str) -> String {
    let a = if arg.contains(' ') && !arg.starts_with('"') {
        format!("\"{}\"", arg)
    } else {
        arg.to_string()
    };
    format!("'{}'", a.replace('\'', "''"))
}

/// Starts a GUI program detached from this process on Windows.
/// First via PowerShell Start-Process (ShellExecuteEx → outside the `tauri dev`
/// Job Object, see spawn_vice_with_file); if PowerShell cannot be started or the
/// Start-Process fails, the program is spawned directly.
#[cfg(target_os = "windows")]
fn windows_spawn_detached(program: &str, args: &[String]) -> std::io::Result<()> {
    // A symlinked exe (e.g. winget's %LOCALAPPDATA%\Microsoft\WinGet\Links\x64sc.exe)
    // searches its DLLs (libcairo-2.dll …) next to the link, not next to the real
    // binary: launch the resolved target, from its own folder, with that folder on PATH.
    let resolved = std::fs::canonicalize(program)
        .map(|p| {
            let s = p.to_string_lossy().to_string();
            if let Some(rest) = s.strip_prefix(r"\\?\UNC\") {
                format!(r"\\{}", rest)
            } else if let Some(rest) = s.strip_prefix(r"\\?\") {
                rest.to_string()
            } else {
                s
            }
        })
        .unwrap_or_else(|_| program.to_string());
    let program = resolved.as_str();
    let exe_dir = std::path::Path::new(program)
        .parent()
        .map(|d| d.to_path_buf());
    let arg_list = if args.is_empty() {
        String::new()
    } else {
        format!(
            " -ArgumentList {}",
            args.iter()
                .map(|a| windows_ps_arg(a))
                .collect::<Vec<_>>()
                .join(",")
        )
    };
    let work_dir = exe_dir
        .as_ref()
        .map(|d| {
            format!(
                " -WorkingDirectory '{}'",
                d.to_string_lossy().replace('\'', "''")
            )
        })
        .unwrap_or_default();
    let ps_cmd = format!(
        "Start-Process -FilePath '{}'{}{}",
        program.replace('\'', "''"),
        arg_list,
        work_dir
    );
    let via_ps = Command::new(windows_powershell_path())
        .args([
            "-NoProfile",
            "-NonInteractive",
            "-WindowStyle",
            "Hidden",
            "-Command",
            &ps_cmd,
        ])
        .stdin(std::process::Stdio::null())
        .creation_flags(0x08000000) // CREATE_NO_WINDOW
        .output();
    if let Ok(out) = &via_ps {
        if out.status.success() {
            return Ok(());
        }
    }
    let mut cmd = Command::new(program);
    if let Some(dir) = &exe_dir {
        cmd.current_dir(dir);
        let path = std::env::var_os("PATH").unwrap_or_default();
        let mut dirs = vec![dir.clone()];
        dirs.extend(std::env::split_paths(&path));
        if let Ok(joined) = std::env::join_paths(dirs) {
            cmd.env("PATH", joined);
        }
    }
    // DETACHED_PROCESS | CREATE_NEW_PROCESS_GROUP
    cmd.args(args)
        .stdin(std::process::Stdio::null())
        .stdout(std::process::Stdio::null())
        .stderr(std::process::Stdio::null())
        .creation_flags(0x00000008 | 0x00000200)
        .spawn()
        .map(|_| ())
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
            .map(|_| ())
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
            windows_spawn_detached(&binary, &[file_path.to_string_lossy().to_string()])
        }
        #[cfg(not(target_os = "windows"))]
        {
            let mut cmd = Command::new(&binary);
            // Propagate display session variables — Tauri may not inherit them
            // on all desktop configurations (especially Wayland compositors).
            for var in &[
                "DISPLAY",
                "WAYLAND_DISPLAY",
                "XDG_RUNTIME_DIR",
                "DBUS_SESSION_BUS_ADDRESS",
                "GDK_BACKEND",
            ] {
                if let Ok(val) = std::env::var(var) {
                    cmd.env(var, val);
                }
            }
            // apt-installed VICE lacks drive ROMs; mode 1 injects PRG directly.
            cmd.arg("-autostartprgmode")
                .arg("1")
                .arg(file_path.to_str().unwrap())
                .stdin(std::process::Stdio::null())
                .stdout(std::process::Stdio::null())
                .stderr(std::process::Stdio::null())
                .spawn()
                .map(|_| ())
        }
    };

    result.map(|_| ()).map_err(|e| e.to_string())
}

fn get_exomizer_path(cfg: &serde_json::Value) -> String {
    cfg["exomizerPath"].as_str().unwrap_or("").to_string()
}

fn get_exomizer_border_flash(cfg: &serde_json::Value) -> bool {
    // Defaults to true if unset, so existing configs keep the visual feedback.
    cfg["uiSettings"]["exomizerBorderFlash"]
        .as_bool()
        .unwrap_or(true)
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
    let init_address = ((buf[10] as u16) << 8) | buf[11] as u16;
    let play_address = ((buf[12] as u16) << 8) | buf[13] as u16;
    let num_songs = ((buf[14] as u16) << 8) | buf[15] as u16;
    let start_song = ((buf[16] as u16) << 8) | buf[17] as u16;

    let read_str = |from: usize, to: usize| -> String {
        buf[from..to]
            .iter()
            .take_while(|&&b| b != 0)
            .map(|&b| b as char)
            .collect()
    };
    let title = read_str(22, 54);
    let author = read_str(54, 86);
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
fn get_ultimate_basic_version() -> &'static str {
    env!("ULTIMATE_BASIC_VERSION")
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct SidPreviewPayload {
    sample_rate: u32,
    model: String,
    #[serde(default)]
    session_id: Option<String>,
    frames: Vec<Vec<u8>>,
}

static SID_PREVIEW_SESSIONS: OnceLock<Mutex<HashMap<String, (sid_core::SidCore, Instant)>>> = OnceLock::new();

/// Offline renderer for the SID Editor's original Rust core.  Audio is
/// rendered in short frame batches on the backend, then scheduled by Web Audio
/// in the frontend; keeping the audio device in the WebView avoids native
/// device/driver differences across Windows, macOS and Linux.
#[tauri::command]
fn render_sid_preview(payload: SidPreviewPayload) -> Result<String, String> {
    const MAX_FRAMES: usize = 3_000; // one minute at PAL 50 Hz
    if payload.frames.is_empty() || payload.frames.len() > MAX_FRAMES {
        return Err("Invalid SID preview length.".to_string());
    }
    // The SID Editor sends the 25 implemented registers ($D400-$D418).
    // The core keeps a 32-byte address space internally, but the unused
    // register tail is not part of a SID register frame.
    if payload.frames.iter().any(|frame| frame.len() != 0x19) {
        return Err("Invalid SID register frame: expected 25 registers ($D400-$D418).".to_string());
    }

    let sample_rate = payload.sample_rate.clamp(8_000, 96_000);
    let model = if payload.model.eq_ignore_ascii_case("6581") {
        sid_core::SidModel::Mos6581
    } else {
        sid_core::SidModel::Mos8580
    };
    let render_frames = |sid: &mut sid_core::SidCore| {
        let mut pcm = Vec::<i16>::with_capacity((payload.frames.len() * sample_rate as usize) / 50 + 2);
        let mut rendered = 0usize;
        for (frame_index, registers) in payload.frames.iter().enumerate() {
            for (address, value) in registers.iter().enumerate() {
                sid.write(address as u8, *value);
            }
            let target = ((frame_index + 1) * sample_rate as usize) / 50;
            let mut chunk = vec![0i16; target.saturating_sub(rendered)];
            sid.render(&mut chunk);
            rendered += chunk.len();
            pcm.extend_from_slice(&chunk);
        }
        pcm
    };
    let pcm = if let Some(session_id) = payload.session_id.as_deref() {
        if session_id.is_empty() || session_id.len() > 80 {
            return Err("Invalid SID preview session.".to_string());
        }
        let sessions = SID_PREVIEW_SESSIONS.get_or_init(|| Mutex::new(HashMap::new()));
        let mut sessions = sessions.lock().map_err(|_| "SID preview state is unavailable.")?;
        sessions.retain(|_, (_, last_used)| last_used.elapsed() < Duration::from_secs(180));
        if !sessions.contains_key(session_id) && sessions.len() >= 16 {
            return Err("Too many active SID previews.".to_string());
        }
        let (sid, last_used) = sessions.entry(session_id.to_string()).or_insert_with(|| {
            (sid_core::SidCore::new(sample_rate, model), Instant::now())
        });
        *last_used = Instant::now();
        render_frames(sid)
    } else {
        render_frames(&mut sid_core::SidCore::new(sample_rate, model))
    };

    let bytes: Vec<u8> = pcm.iter().flat_map(|sample| sample.to_le_bytes()).collect();
    Ok(base64::engine::general_purpose::STANDARD.encode(bytes))
}

#[tauri::command]
fn release_sid_preview(session_id: String) {
    if let Some(sessions) = SID_PREVIEW_SESSIONS.get() {
        if let Ok(mut sessions) = sessions.lock() {
            sessions.remove(&session_id);
        }
    }
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct SidFilePayload {
    session_id: String,
    sample_rate: u32,
    model: String,
    frames: usize,
    file_bytes: Option<Vec<u8>>,
}

static SID_FILE_SESSIONS: OnceLock<Mutex<HashMap<String, (sid_file::SidFilePlayer, Instant)>>> =
    OnceLock::new();

#[tauri::command]
fn render_sid_file(payload: SidFilePayload) -> Result<String, String> {
    if payload.session_id.is_empty()
        || payload.session_id.len() > 80
        || !(1..=20).contains(&payload.frames)
    {
        return Err("Invalid SID file playback request.".into());
    }
    if payload.file_bytes.as_ref().is_some_and(|bytes| bytes.len() > 1_048_576) {
        return Err("SID file is too large.".into());
    }
    let sample_rate = payload.sample_rate.clamp(8_000, 96_000);
    let model = if payload.model.eq_ignore_ascii_case("6581") {
        sid_core::SidModel::Mos6581
    } else {
        sid_core::SidModel::Mos8580
    };
    let sessions = SID_FILE_SESSIONS.get_or_init(|| Mutex::new(HashMap::new()));
    let mut sessions = sessions
        .lock()
        .map_err(|_| "SID file playback state is unavailable.")?;
    sessions.retain(|_, (_, last_used)| last_used.elapsed() < Duration::from_secs(180));
    if let Some(bytes) = payload.file_bytes.as_deref() {
        if !sessions.contains_key(&payload.session_id) && sessions.len() >= 8 {
            return Err("Too many active SID files.".into());
        }
        let player = sid_file::SidFilePlayer::new(bytes, sample_rate, model)?;
        sessions.insert(payload.session_id.clone(), (player, Instant::now()));
    }
    let (player, last_used) = sessions
        .get_mut(&payload.session_id)
        .ok_or("SID file playback session has expired.")?;
    *last_used = Instant::now();
    let pcm = player.render_frames(payload.frames)?;
    let bytes: Vec<u8> = pcm.iter().flat_map(|sample| sample.to_le_bytes()).collect();
    Ok(base64::engine::general_purpose::STANDARD.encode(bytes))
}

#[tauri::command]
fn release_sid_file(session_id: String) {
    if let Some(sessions) = SID_FILE_SESSIONS.get() {
        if let Ok(mut sessions) = sessions.lock() {
            sessions.remove(&session_id);
        }
    }
}

#[tauri::command]
fn set_title(app: AppHandle, title: String) {
    if let Some(win) = app.get_webview_window("main") {
        let _ = win.set_title(&title);
    }
}

#[tauri::command]
async fn open_external(url: String, app: AppHandle) -> Result<(), String> {
    app.opener()
        .open_url(url, None::<String>)
        .map_err(|e| e.to_string())
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
    let vice_path = cfg["vicePath"].as_str().unwrap_or("").to_string();
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
        "workingFolder": cfg["workingFolder"].as_str().unwrap_or(""),
        "ubWorkingFolder": cfg["ubWorkingFolder"].as_str().unwrap_or("")
    })
}

#[tauri::command]
async fn choose_working_folder(app: AppHandle) -> serde_json::Value {
    let current_folder = get_working_folder_path(&read_config(&app));
    let mut dialog = app.dialog().file().set_title("Choose VA working folder");
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
async fn choose_ub_working_folder(app: AppHandle) -> serde_json::Value {
    let current_folder = get_ub_working_folder_path(&read_config(&app));
    let mut dialog = app
        .dialog()
        .file()
        .set_title("Choose UltimateBasic working folder");
    if let Some(folder) = current_folder {
        dialog = dialog.set_directory(folder);
    }
    match dialog.blocking_pick_folder() {
        Some(path) => {
            let path_str = path.to_string();
            let mut cfg = read_config(&app);
            cfg["ubWorkingFolder"] = serde_json::json!(path_str);
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
    target_address: Option<String>, // load address (hex without $), e.g. "C000"
    decompress_address: Option<String>, // decompress target (hex without $), e.g. "2000"
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct DebuggerSidecars {
    dbg: Option<String>,
    sym: Option<String>,
    vs: Option<String>,
    asm: Option<String>,
}

fn debugger_sidecar_path(base_path: &Path, extension: &str) -> PathBuf {
    let parent = base_path.parent().unwrap_or_else(|| Path::new("."));
    let stem = base_path
        .file_stem()
        .and_then(|value| value.to_str())
        .filter(|value| !value.is_empty())
        .unwrap_or("program");
    parent.join(format!("{}.{}", stem, extension))
}

fn write_debugger_sidecars(base_path: &Path, sidecars: &DebuggerSidecars) -> Result<(), String> {
    let write_file = |extension: &str, content: &Option<String>| -> Result<(), String> {
        if let Some(text) = content {
            let path = debugger_sidecar_path(base_path, extension);
            fs::write(&path, text).map_err(|e| e.to_string())?;
        }
        Ok(())
    };

    write_file("dbg", &sidecars.dbg)?;
    write_file("sym", &sidecars.sym)?;
    write_file("vs", &sidecars.vs)?;
    write_file("asm", &sidecars.asm)?;
    Ok(())
}

fn crunch_with_exomizer(
    exomizer_path: &str,
    input_bytes: &[u8],
    file_name: &str,
    raw_mode: bool,
    raw_load: Option<&str>,
    raw_decompress: Option<&str>,
    border_flash: bool,
) -> Result<(PathBuf, Vec<u8>), String> {
    let temp_dir = std::env::temp_dir().join("c64-visual-assembler");
    fs::create_dir_all(&temp_dir).map_err(|e| format!("mkdir {:?}: {}", temp_dir, e))?;
    let input_path = temp_dir.join(file_name);
    fs::write(&input_path, input_bytes).map_err(|e| format!("write {:?}: {}", input_path, e))?;

    let ext = if raw_mode { "exo" } else { "prg" };
    let prefix = if raw_mode {
        "exomizer-raw"
    } else {
        "exomizer-sfx"
    };
    let output_path = temp_dir.join(format!(
        "{}-{}.{}",
        prefix,
        std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_millis(),
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
        vec![
            "mem",
            "-l",
            load_str.as_str(),
            "-o",
            output_path.to_str().unwrap(),
            infile_with_target.as_str(),
        ]
    } else {
        // sfx sys: self-extracting PRG. -x1 = fast accumulator-based border-flash
        // decrunch effect; -n disables any effect. Controlled by UI setting.
        let effect_flag = if border_flash { "-x1" } else { "-n" };
        vec![
            "sfx",
            "sys",
            effect_flag,
            "-o",
            output_path.to_str().unwrap(),
            input_path.to_str().unwrap(),
        ]
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
        let error = if !stderr.is_empty() {
            stderr
        } else if !stdout.is_empty() {
            stdout
        } else {
            format!("Exomizer exit {:?}", output.status.code())
        };
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
        format!(
            "program-{}.prg",
            std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_millis()
        )
    });

    let border_flash = get_exomizer_border_flash(&cfg);
    match crunch_with_exomizer(
        &exomizer_path,
        &payload.bytes,
        &file_name,
        false,
        None,
        None,
        border_flash,
    ) {
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
        format!(
            "data-{}.bin",
            std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_millis()
        )
    });

    let load_addr = payload.target_address.as_deref();
    let decomp_addr = payload.decompress_address.as_deref();
    // border_flash unused in mem mode (which uses our own depacker, not sfx),
    // but pass current setting for completeness.
    let border_flash = get_exomizer_border_flash(&cfg);
    match crunch_with_exomizer(
        &exomizer_path,
        &payload.bytes,
        &file_name,
        true,
        load_addr,
        decomp_addr,
        border_flash,
    ) {
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
        if p.is_empty() {
            detect_vice_executable()
        } else {
            p
        }
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
        format!(
            "program-{}.prg",
            std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_millis()
        )
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
        Ok(_) => {
            serde_json::json!({ "ok": true, "vicePath": vice_path, "filePath": file_path.to_str().unwrap() })
        }
        Err(e) => serde_json::json!({ "ok": false, "error": e.to_string() }),
    }
}

#[tauri::command]
async fn launch_exomizer(app: AppHandle, payload: LaunchVicePayload) -> serde_json::Value {
    let cfg = read_config(&app);
    let exomizer_path = get_exomizer_path(&cfg);
    let vice_path = {
        let p = cfg["vicePath"].as_str().unwrap_or("").to_string();
        if p.is_empty() {
            detect_vice_executable()
        } else {
            p
        }
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
        format!(
            "program-{}.prg",
            std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_millis()
        )
    });

    let border_flash = get_exomizer_border_flash(&cfg);
    let (output_path, _) = match crunch_with_exomizer(
        &exomizer_path,
        &payload.bytes,
        &file_name,
        false,
        None,
        None,
        border_flash,
    ) {
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
            let candidates = ["/Applications", "/Applications/RetroDebugger"];
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

fn format_debugger_breakpoints(breakpoints: &[u32]) -> String {
    breakpoints
        .iter()
        .map(|address| format!("break {:04X}", address & 0xFFFF))
        .collect::<Vec<_>>()
        .join("\n")
}

fn debugger_launch_args(prg_arg: &str, extra_args: &[String], auto_jmp: bool) -> Vec<String> {
    let mut args = vec!["-pass".to_string(), "-prg".to_string(), prg_arg.to_string()];
    args.extend(extra_args.iter().cloned());
    if auto_jmp {
        args.push("-autojmp".to_string());
    }
    args
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
        format!(
            "program-{}.prg",
            std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_millis()
        )
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

    if let Some(sidecars) = &payload.sidecars {
        if sidecars.dbg.is_some() {
            extra_args.push("-debuginfo".to_string());
            extra_args.push(
                debugger_sidecar_path(&file_path, "dbg")
                    .to_string_lossy()
                    .to_string(),
            );
        }
        if sidecars.vs.is_some() {
            extra_args.push("-symbols".to_string());
            extra_args.push(
                debugger_sidecar_path(&file_path, "vs")
                    .to_string_lossy()
                    .to_string(),
            );
        }
    }

    if let Some(bps) = &payload.breakpoints {
        if !bps.is_empty() {
            let content = format_debugger_breakpoints(bps);
            let bp_path = temp_dir.join("debug-breakpoints.txt");
            if fs::write(&bp_path, content).is_ok() {
                extra_args.push("-breakpoints".to_string());
                extra_args.push(bp_path.to_str().unwrap().to_string());
            }
        }
    }

    if payload
        .sidecars
        .as_ref()
        .and_then(|sidecars| sidecars.vs.as_ref())
        .is_none()
    {
        if let Some(symbols) = &payload.symbols {
            if !symbols.is_empty() {
                let content: String = symbols
                    .iter()
                    .map(|s| {
                        let safe = s
                            .name
                            .to_lowercase()
                            .replace(|c: char| !c.is_alphanumeric() && c != '_', "_");
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
    let all_args = debugger_launch_args(&prg_arg, &extra_args, use_auto_jmp);

    let result = if cfg!(target_os = "macos") {
        // On macOS resolve .app bundle → Contents/MacOS/<stem>
        let binary = if debugger_path.ends_with(".app") {
            let app_path = std::path::Path::new(&debugger_path);
            let stem = app_path
                .file_stem()
                .unwrap_or_default()
                .to_string_lossy()
                .to_string();
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
        cmd.args(&all_args);
        cmd.stdin(std::process::Stdio::null())
            .stdout(std::process::Stdio::null())
            .stderr(std::process::Stdio::null())
            .spawn()
            .map(|_| ())
    } else {
        #[cfg(target_os = "windows")]
        {
            let _ = fs::write(
                temp_dir.join("debug.launch.log"),
                format!(
                    "PROGRAM: {}\nARGS: {:?}\nBREAKPOINTS: {:?}\nAUTO_JMP: {:?}\n",
                    debugger_path, all_args, payload.breakpoints, payload.auto_jmp
                ),
            );
            windows_spawn_detached(&debugger_path, &all_args)
        }
        #[cfg(not(target_os = "windows"))]
        {
            let mut cmd = Command::new(&debugger_path);
            cmd.args(&all_args);
            cmd.stdin(std::process::Stdio::null())
                .stdout(std::process::Stdio::null())
                .stderr(std::process::Stdio::null())
                .spawn()
                .map(|_| ())
        }
    };

    match result {
        Ok(_) => serde_json::json!({ "ok": true }),
        Err(e) => serde_json::json!({ "ok": false, "error": e.to_string() }),
    }
}

#[tauri::command]
async fn choose_incbin_file(app: AppHandle, directory: Option<String>) -> serde_json::Value {
    // Explicit directory (e.g. the UB working folder while in UB mode) wins over the VA working folder.
    let working_folder = directory
        .map(|d| d.trim().to_string())
        .filter(|d| !d.is_empty())
        .map(PathBuf::from)
        .or_else(|| get_working_folder_path(&read_config(&app)));
    let mut dialog = app
        .dialog()
        .file()
        .add_filter("Binary files", &["bin", "prg", "sid", "raw"])
        .add_filter("All files", &["*"]);
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
async fn reload_incbin_file(
    app: AppHandle,
    file_path: String,
    base_dir: Option<String>,
) -> serde_json::Value {
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
            if let Ok(p) = resolve_resource_file(&app, &format!("samples/{}", normalized_file_path))
            {
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
                .file_name()
                .and_then(|n| n.to_str())
                .unwrap_or("")
                .to_string();
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
    let mut dialog = app
        .dialog()
        .file()
        .add_filter("SID files", &["sid"])
        .add_filter("All files", &["*"]);
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
                            .file_name()
                            .and_then(|n| n.to_str())
                            .unwrap_or("")
                            .to_string();
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
async fn reload_sid_file(
    app: AppHandle,
    file_path: String,
    base_dir: Option<String>,
) -> serde_json::Value {
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
            if let Ok(p) = resolve_resource_file(&app, &format!("samples/{}", normalized_file_path))
            {
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
                v["fileName"] =
                    serde_json::json!(resolved.file_name().and_then(|n| n.to_str()).unwrap_or(""));
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
    let mut dialog = app
        .dialog()
        .file()
        .add_filter(
            "Include (project or assembly)",
            &["json", "inc", "asm", "s"],
        )
        .add_filter("C64 Visual Assembler project", &["json"])
        .add_filter("Assembly source", &["inc", "asm", "s"])
        .add_filter("All files", &["*"]);
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
                .file_stem()
                .and_then(|n| n.to_str())
                .unwrap_or("")
                .to_string();
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
                            Err(e) => {
                                serde_json::json!({ "canceled": false, "error": e.to_string() })
                            }
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
async fn reload_include_file(
    app: AppHandle,
    file_path: String,
    base_dir: Option<String>,
) -> serde_json::Value {
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
            let wf = {
                let cfg = read_config(&app);
                get_working_folder_path(&cfg)
            };
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
            if let Ok(p) = resolve_resource_file(&app, &format!("samples/{}", normalized_file_path))
            {
                candidates.push(p);
            }
            if input_path.extension().is_none() {
                if let Ok(p) =
                    resolve_resource_file(&app, &format!("samples/{}.json", normalized_file_path))
                {
                    candidates.push(p);
                }
                if let Ok(p) =
                    resolve_resource_file(&app, &format!("samples/{}.asm", normalized_file_path))
                {
                    candidates.push(p);
                }
                if let Ok(p) =
                    resolve_resource_file(&app, &format!("samples/{}.inc", normalized_file_path))
                {
                    candidates.push(p);
                }
                if let Ok(p) =
                    resolve_resource_file(&app, &format!("samples/{}.s", normalized_file_path))
                {
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
        .file_name()
        .and_then(|n| n.to_str())
        .unwrap_or("")
        .to_string();
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

// Raw byte-range write at an explicit path, no save dialog — the D64 block
// editor's write-back path (see d64BlockRead/Write in app.js): the whole
// disk image is read via read_bin_file, a single 256-byte sector is patched
// in JS, and the full image is written back here. No D64-specific logic on
// the Rust side at all; track/sector offset math and the BAM parse both
// live in JS, same as the block editor's read path.
#[tauri::command]
fn write_bin_file(
    path: String,
    bytes: Vec<u8>,
    sidecars: Option<DebuggerSidecars>,
) -> serde_json::Value {
    if path.is_empty() {
        return serde_json::json!({ "ok": false, "error": "Empty path" });
    }
    if let Err(e) = fs::write(&path, &bytes) {
        return serde_json::json!({ "ok": false, "error": e.to_string() });
    }
    // Build project: .dbg/.sym/.vs/.asm a PRG mellé, ha a "Generate debug files" be van kapcsolva.
    if let Some(sidecars) = &sidecars {
        if let Err(e) = write_debugger_sidecars(Path::new(&path), sidecars) {
            return serde_json::json!({ "ok": false, "error": e });
        }
    }
    serde_json::json!({ "ok": true })
}

// Deletes a plain file at an explicit path, no confirmation/trash — used
// by the D64 Editor to clean up its scratch "<name>.d64.editing.tmp"
// working copy right before switching to a different disk (see
// _d64EdCleanupTemp in app.js, called from Open/New). Missing-file is
// treated as success (nothing left to clean up), matching typical
// "best effort cleanup" semantics.
#[tauri::command]
fn delete_bin_file(path: String) -> serde_json::Value {
    if path.is_empty() {
        return serde_json::json!({ "ok": false, "error": "Empty path" });
    }
    match fs::remove_file(&path) {
        Ok(_) => serde_json::json!({ "ok": true }),
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => serde_json::json!({ "ok": true }),
        Err(e) => serde_json::json!({ "ok": false, "error": e.to_string() }),
    }
}

#[tauri::command]
async fn save_prg(app: AppHandle, payload: SavePrgPayload) -> serde_json::Value {
    let working_folder = {
        let cfg = read_config(&app);
        get_working_folder_path(&cfg)
    };
    let mut dialog = app
        .dialog()
        .file()
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

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct SaveCrtPayload {
    bytes: Vec<u8>,
    #[serde(default)]
    file_name: Option<String>,
}

#[tauri::command]
async fn save_crt(app: AppHandle, payload: SaveCrtPayload) -> serde_json::Value {
    let working_folder = {
        let cfg = read_config(&app);
        get_working_folder_path(&cfg)
    };
    let mut dialog = app
        .dialog()
        .file()
        .add_filter("Commodore 64 cartridge", &["crt"])
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

#[tauri::command]
async fn save_bin(app: AppHandle, payload: SaveBinPayload) -> serde_json::Value {
    let working_folder = {
        let cfg = read_config(&app);
        get_working_folder_path(&cfg)
    };
    // A javasolt fájlnév kiterjesztése legyen az első szűrő (pl. Koala .koa),
    // különben a dialógus a "Binary (*.bin)" szűrőt kínálja fel.
    let ext = payload
        .file_name
        .as_deref()
        .and_then(|n| Path::new(n).extension())
        .map(|e| e.to_string_lossy().to_lowercase())
        .filter(|e| e != "bin");
    let mut dialog = app.dialog().file();
    if let Some(ext) = ext.as_deref() {
        dialog = dialog.add_filter(ext.to_uppercase(), &[ext]);
    }
    dialog = dialog
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
                if candidate.exists() {
                    return Some(candidate);
                }
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
    if lower.is_empty() {
        "disk".to_string()
    } else {
        lower
    }
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
    /// Start folder of the save dialog — the working folder of the active editor mode (VA or UB).
    #[serde(default)]
    directory: Option<String>,
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
        if p.is_empty() {
            detect_vice_executable()
        } else {
            p
        }
    };

    let c1541_path = match resolve_c1541_path(&vice_path) {
        Some(p) => p,
        None => {
            return serde_json::json!({
                "ok": false,
                "error": "c1541 nem talalhato. Allitsd be a VICE eleresi utjat (a c1541 a VICE bin/ mappajaban van)."
            })
        }
    };

    // 2. Ask user where to save
    let working_folder = payload
        .directory
        .as_deref()
        .map(str::trim)
        .filter(|d| !d.is_empty())
        .map(PathBuf::from)
        .or_else(|| get_working_folder_path(&cfg));
    let mut dialog = app
        .dialog()
        .file()
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
            .file_stem()
            .unwrap_or_default()
            .to_string_lossy()
            .to_string()
    });
    let disk_name = sanitize_disk_name(&raw_disk, 16);
    let disk_id = "01";

    // 5. Write each file to a temp PRG, collecting (temp_path, c64_name) tuples.
    //    For files with load_address set, prepend the 2-byte little-endian header.
    let now_ms = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_millis();

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
            for (p, _) in &staged {
                let _ = fs::remove_file(p);
            }
            return serde_json::json!({
                "ok": false,
                "error": format!("Nem sikerult ideiglenes fajl irasa ({}): {}", entry.name, e)
            });
        }

        let c64_name = sanitize_disk_name(&entry.name, 16);
        if c64_name.is_empty() {
            for (p, _) in &staged {
                let _ = fs::remove_file(p);
            }
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

    cmd.arg("-format")
        .arg(&format_arg)
        .arg("d64")
        .arg(&save_path);
    for (prg_path, c64_name) in &staged {
        cmd.arg("-write")
            .arg(prg_path.to_string_lossy().to_string())
            .arg(c64_name);
    }

    #[cfg(target_os = "windows")]
    {
        const CREATE_NO_WINDOW: u32 = 0x08000000;
        cmd.creation_flags(CREATE_NO_WINDOW);
    }

    let output = match cmd.output() {
        Ok(out) => out,
        Err(e) => {
            for (p, _) in &staged {
                let _ = fs::remove_file(p);
            }
            return serde_json::json!({
                "ok": false,
                "error": format!("c1541 inditasa sikertelen ({}): {}", c1541_path.display(), e)
            });
        }
    };

    // 7. Cleanup temp PRGs
    for (p, _) in &staged {
        let _ = fs::remove_file(p);
    }

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
        if p.is_empty() {
            detect_vice_executable()
        } else {
            p
        }
    };

    let c1541_path = match resolve_c1541_path(&vice_path) {
        Some(p) => p,
        None => {
            return serde_json::json!({
                "ok": false,
                "error": "c1541 nem talalhato. Allitsd be a VICE eleresi utjat."
            })
        }
    };

    let temp_dir = std::env::temp_dir().join("c64-visual-assembler");
    let _ = fs::create_dir_all(&temp_dir);
    let now_ms = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_millis();

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
            for (p, _) in &staged {
                let _ = fs::remove_file(p);
            }
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

    cmd.arg("-format")
        .arg(&format_arg)
        .arg("d64")
        .arg(&d64_path);
    for (prg_path, c64_name) in &staged {
        cmd.arg("-write")
            .arg(prg_path.to_string_lossy().to_string())
            .arg(c64_name);
    }

    #[cfg(target_os = "windows")]
    {
        const CREATE_NO_WINDOW: u32 = 0x08000000;
        cmd.creation_flags(CREATE_NO_WINDOW);
    }

    let c1541_out = match cmd.output() {
        Ok(o) => o,
        Err(e) => {
            for (p, _) in &staged {
                let _ = fs::remove_file(p);
            }
            return serde_json::json!({ "ok": false, "error": e.to_string() });
        }
    };
    for (p, _) in &staged {
        let _ = fs::remove_file(p);
    }

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
            let stem = app_path
                .file_stem()
                .unwrap_or_default()
                .to_string_lossy()
                .to_string();
            if let Some(parent) = app_path.parent() {
                let cand = parent.join("bin").join(&stem);
                if cand.exists() {
                    cand.to_string_lossy().to_string()
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
            return serde_json::json!({ "ok": false, "error": "VICE binary nem talalhato." });
        }
        Command::new("bash")
            .arg(&binary)
            .arg(&d64_str)
            .stdin(std::process::Stdio::null())
            .stdout(std::process::Stdio::null())
            .stderr(std::process::Stdio::null())
            .spawn()
            .map(|_| ())
    } else {
        #[cfg(target_os = "windows")]
        {
            windows_spawn_detached(&vice_path, &[d64_str.clone()])
        }
        #[cfg(not(target_os = "windows"))]
        {
            let mut cmd = Command::new(&vice_path);
            for var in &[
                "DISPLAY",
                "WAYLAND_DISPLAY",
                "XDG_RUNTIME_DIR",
                "DBUS_SESSION_BUS_ADDRESS",
                "GDK_BACKEND",
            ] {
                if let Ok(val) = std::env::var(var) {
                    cmd.env(var, val);
                }
            }
            cmd.arg("-drive8type")
                .arg("1541")
                .arg(&d64_str)
                .stdin(std::process::Stdio::null())
                .stdout(std::process::Stdio::null())
                .stderr(std::process::Stdio::null())
                .spawn()
                .map(|_| ())
        }
    };

    match launch_result {
        Ok(_) => serde_json::json!({ "ok": true, "filePath": d64_str, "vicePath": vice_path }),
        Err(e) => serde_json::json!({ "ok": false, "error": e.to_string() }),
    }
}

// ── D64 Editor: open/list/add/delete/rename/extract entries in an existing image ──

fn get_c1541_path(app: &AppHandle) -> Result<PathBuf, String> {
    let cfg = read_config(app);
    let vice_path = {
        let p = cfg["vicePath"].as_str().unwrap_or("").to_string();
        if p.is_empty() {
            detect_vice_executable()
        } else {
            p
        }
    };
    resolve_c1541_path(&vice_path).ok_or_else(|| {
        "c1541 nem talalhato. Allitsd be a VICE eleresi utjat (a c1541 a VICE bin/ mappajaban van).".to_string()
    })
}

fn run_c1541_cmd(c1541_path: &Path, args: &[String]) -> Result<std::process::Output, String> {
    #[allow(unused_mut)]
    let mut cmd = if cfg!(target_os = "macos") {
        let mut c = Command::new("bash");
        c.arg(c1541_path.to_string_lossy().to_string());
        c
    } else {
        Command::new(c1541_path)
    };
    cmd.args(args);
    #[cfg(target_os = "windows")]
    {
        const CREATE_NO_WINDOW: u32 = 0x08000000;
        cmd.creation_flags(CREATE_NO_WINDOW);
    }
    cmd.output().map_err(|e| e.to_string())
}

fn c1541_err(out: &std::process::Output) -> serde_json::Value {
    serde_json::json!({
        "ok": false,
        "error": format!("c1541 hiba: {}{}",
            String::from_utf8_lossy(&out.stderr),
            String::from_utf8_lossy(&out.stdout)),
    })
}

/// Parses the plain-text output of `c1541 -attach <img> -list` into a disk
/// name, a list of directory entries and the trailing "blocks free" count.
/// c1541's listing mimics the classic C64 `LOAD"$",8` directory format:
///   0 "diskname        " id dostype
///      3   "hello world"      prg
///      1   "data"             seq*
///   664 blocks free.
fn parse_c1541_listing(text: &str) -> (String, Vec<serde_json::Value>, Option<u32>) {
    let mut disk_name = String::new();
    let mut entries = Vec::new();
    let mut blocks_free = None;

    for line in text.lines() {
        let trimmed = line.trim();
        if trimmed.is_empty() {
            continue;
        }
        if let Some(free_pos) = trimmed.find("blocks free") {
            blocks_free = trimmed[..free_pos].trim().parse::<u32>().ok();
            continue;
        }
        let quote_start = match trimmed.find('"') {
            Some(p) => p,
            None => continue,
        };
        let after_quote = &trimmed[quote_start + 1..];
        let quote_end = match after_quote.find('"') {
            Some(p) => p,
            None => continue,
        };
        let name = after_quote[..quote_end].trim_end().to_string();
        let before_quote = trimmed[..quote_start].trim();

        if disk_name.is_empty() && before_quote == "0" {
            // Header line: `0 "diskname        " id dostype`
            disk_name = name;
            continue;
        }

        if let Ok(blocks) = before_quote.parse::<u32>() {
            let rest = after_quote[quote_end + 1..].trim();
            let locked = rest.starts_with('<');
            let file_type = rest
                .trim_start_matches('<')
                .trim_end_matches('*')
                .trim()
                .to_lowercase();
            entries.push(serde_json::json!({
                "name": name,
                "type": file_type,
                "blocks": blocks,
                "locked": locked,
            }));
        }
    }

    (disk_name, entries, blocks_free)
}

// Explicit directory (the active mode's working folder) wins over the VA working folder.
fn d64_dialog_folder(app: &AppHandle, directory: Option<String>) -> Option<PathBuf> {
    directory
        .map(|d| d.trim().to_string())
        .filter(|d| !d.is_empty())
        .map(PathBuf::from)
        .or_else(|| get_working_folder_path(&read_config(app)))
}

#[tauri::command]
async fn choose_d64_open(app: AppHandle, directory: Option<String>) -> serde_json::Value {
    let working_folder = d64_dialog_folder(&app, directory);
    let mut dialog = app
        .dialog()
        .file()
        .add_filter("Commodore 64 disk image", &["d64"])
        .add_filter("All files", &["*"]);
    if let Some(folder) = working_folder {
        dialog = dialog.set_directory(folder);
    }
    match dialog.blocking_pick_file() {
        Some(path) => serde_json::json!({ "canceled": false, "filePath": path.to_string() }),
        None => serde_json::json!({ "canceled": true }),
    }
}

#[tauri::command]
async fn choose_d64_new(app: AppHandle, directory: Option<String>) -> serde_json::Value {
    let working_folder = d64_dialog_folder(&app, directory);
    let mut dialog = app
        .dialog()
        .file()
        .add_filter("Commodore 64 disk image", &["d64"])
        .add_filter("All files", &["*"]);
    if let Some(folder) = working_folder {
        dialog = dialog.set_directory(folder);
    }
    match dialog.blocking_save_file() {
        Some(path) => serde_json::json!({ "canceled": false, "filePath": path.to_string() }),
        None => serde_json::json!({ "canceled": true }),
    }
}

#[tauri::command]
async fn d64_format(app: AppHandle, path: String, disk_name: String) -> serde_json::Value {
    let c1541_path = match get_c1541_path(&app) {
        Ok(p) => p,
        Err(e) => return serde_json::json!({ "ok": false, "error": e }),
    };
    let name = sanitize_disk_name(&disk_name, 16);
    let format_arg = format!("{},01", name);
    match run_c1541_cmd(
        &c1541_path,
        &["-format".into(), format_arg, "d64".into(), path.clone()],
    ) {
        Ok(out) if out.status.success() => {
            serde_json::json!({ "ok": true, "filePath": path, "diskName": name })
        }
        Ok(out) => c1541_err(&out),
        Err(e) => serde_json::json!({ "ok": false, "error": e }),
    }
}

#[tauri::command]
async fn d64_list(app: AppHandle, path: String) -> serde_json::Value {
    let c1541_path = match get_c1541_path(&app) {
        Ok(p) => p,
        Err(e) => return serde_json::json!({ "ok": false, "error": e }),
    };
    let out = match run_c1541_cmd(&c1541_path, &["-attach".into(), path, "-list".into()]) {
        Ok(o) => o,
        Err(e) => return serde_json::json!({ "ok": false, "error": e }),
    };
    if !out.status.success() {
        return c1541_err(&out);
    }
    let stdout = String::from_utf8_lossy(&out.stdout).to_string();
    let (disk_name, entries, blocks_free) = parse_c1541_listing(&stdout);
    serde_json::json!({
        "ok": true,
        "diskName": disk_name,
        "entries": entries,
        "blocksFree": blocks_free,
    })
}

#[tauri::command]
async fn d64_add_file(
    app: AppHandle,
    path: String,
    bytes: Vec<u8>,
    name: String,
    load_address: Option<u16>,
    file_type: Option<String>,
) -> serde_json::Value {
    let c1541_path = match get_c1541_path(&app) {
        Ok(p) => p,
        Err(e) => return serde_json::json!({ "ok": false, "error": e }),
    };
    let c64_name = sanitize_disk_name(&name, 16);
    if c64_name.is_empty() {
        return serde_json::json!({ "ok": false, "error": "Ervenytelen fajlnev." });
    }
    // C64 directory entry type, appended to the c1541 -write destination as
    // "name,p" / "name,s" / "name,u" / "name,r" (defaults to PRG).
    let type_code = match file_type
        .as_deref()
        .unwrap_or("prg")
        .to_lowercase()
        .as_str()
    {
        "seq" | "s" => "s",
        "usr" | "u" => "u",
        "rel" | "r" => "r",
        _ => "p",
    };

    let temp_dir = std::env::temp_dir().join("c64-visual-assembler");
    let _ = fs::create_dir_all(&temp_dir);
    let now_ms = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_millis();
    let prg_path = temp_dir.join(format!("d64-add-{}.prg", now_ms));

    let mut data: Vec<u8> = Vec::with_capacity(bytes.len() + 2);
    if let Some(addr) = load_address {
        data.push((addr & 0xFF) as u8);
        data.push((addr >> 8) as u8);
    }
    data.extend_from_slice(&bytes);
    if let Err(e) = fs::write(&prg_path, &data) {
        return serde_json::json!({ "ok": false, "error": e.to_string() });
    }

    let dest_name = format!("{},{}", c64_name, type_code);
    let out = run_c1541_cmd(
        &c1541_path,
        &[
            "-attach".into(),
            path,
            "-write".into(),
            prg_path.to_string_lossy().to_string(),
            dest_name,
        ],
    );
    let _ = fs::remove_file(&prg_path);

    match out {
        Ok(o) if o.status.success() => {
            serde_json::json!({ "ok": true, "name": c64_name, "type": type_code })
        }
        Ok(o) => c1541_err(&o),
        Err(e) => serde_json::json!({ "ok": false, "error": e }),
    }
}

#[tauri::command]
async fn d64_delete_file(app: AppHandle, path: String, name: String) -> serde_json::Value {
    let c1541_path = match get_c1541_path(&app) {
        Ok(p) => p,
        Err(e) => return serde_json::json!({ "ok": false, "error": e }),
    };
    match run_c1541_cmd(
        &c1541_path,
        &["-attach".into(), path, "-delete".into(), name],
    ) {
        Ok(o) if o.status.success() => serde_json::json!({ "ok": true }),
        Ok(o) => c1541_err(&o),
        Err(e) => serde_json::json!({ "ok": false, "error": e }),
    }
}

#[tauri::command]
async fn d64_rename_file(
    app: AppHandle,
    path: String,
    old_name: String,
    new_name: String,
) -> serde_json::Value {
    let c1541_path = match get_c1541_path(&app) {
        Ok(p) => p,
        Err(e) => return serde_json::json!({ "ok": false, "error": e }),
    };
    let sanitized_new = sanitize_disk_name(&new_name, 16);
    if sanitized_new.is_empty() {
        return serde_json::json!({ "ok": false, "error": "Ervenytelen uj nev." });
    }
    match run_c1541_cmd(
        &c1541_path,
        &[
            "-attach".into(),
            path,
            "-rename".into(),
            old_name,
            sanitized_new.clone(),
        ],
    ) {
        Ok(o) if o.status.success() => serde_json::json!({ "ok": true, "name": sanitized_new }),
        Ok(o) => c1541_err(&o),
        Err(e) => serde_json::json!({ "ok": false, "error": e }),
    }
}

#[tauri::command]
async fn d64_extract_file(app: AppHandle, path: String, name: String) -> serde_json::Value {
    let c1541_path = match get_c1541_path(&app) {
        Ok(p) => p,
        Err(e) => return serde_json::json!({ "ok": false, "error": e }),
    };

    let temp_dir = std::env::temp_dir().join("c64-visual-assembler");
    let _ = fs::create_dir_all(&temp_dir);
    let now_ms = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_millis();
    let out_path = temp_dir.join(format!("d64-extract-{}.prg", now_ms));

    let out = run_c1541_cmd(
        &c1541_path,
        &[
            "-attach".into(),
            path,
            "-read".into(),
            name.clone(),
            out_path.to_string_lossy().to_string(),
        ],
    );

    match out {
        Ok(o) if o.status.success() => match fs::read(&out_path) {
            Ok(bytes) => {
                let _ = fs::remove_file(&out_path);
                serde_json::json!({ "ok": true, "bytes": bytes, "name": name })
            }
            Err(e) => serde_json::json!({ "ok": false, "error": e.to_string() }),
        },
        Ok(o) => c1541_err(&o),
        Err(e) => serde_json::json!({ "ok": false, "error": e }),
    }
}

#[tauri::command]
async fn d64_copy_as(source: String, dest: String) -> serde_json::Value {
    match fs::copy(&source, &dest) {
        Ok(_) => serde_json::json!({ "ok": true, "filePath": dest }),
        Err(e) => serde_json::json!({ "ok": false, "error": e.to_string() }),
    }
}

#[tauri::command]
async fn d64_run(app: AppHandle, path: String) -> serde_json::Value {
    let cfg = read_config(&app);
    let vice_path = {
        let p = cfg["vicePath"].as_str().unwrap_or("").to_string();
        if p.is_empty() {
            detect_vice_executable()
        } else {
            p
        }
    };
    if vice_path.is_empty() {
        return serde_json::json!({ "ok": false, "error": "VICE eleresi utja nincs beallitva." });
    }

    let launch_result = if cfg!(target_os = "macos") {
        let binary = if vice_path.ends_with(".app") {
            let app_path = std::path::Path::new(&vice_path);
            let stem = app_path
                .file_stem()
                .unwrap_or_default()
                .to_string_lossy()
                .to_string();
            if let Some(parent) = app_path.parent() {
                let cand = parent.join("bin").join(&stem);
                if cand.exists() {
                    cand.to_string_lossy().to_string()
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
            return serde_json::json!({ "ok": false, "error": "VICE binary nem talalhato." });
        }
        Command::new("bash")
            .arg(&binary)
            .arg(&path)
            .stdin(std::process::Stdio::null())
            .stdout(std::process::Stdio::null())
            .stderr(std::process::Stdio::null())
            .spawn()
            .map(|_| ())
    } else {
        #[cfg(target_os = "windows")]
        {
            windows_spawn_detached(&vice_path, &[path.clone()])
        }
        #[cfg(not(target_os = "windows"))]
        {
            let mut cmd = Command::new(&vice_path);
            for var in &[
                "DISPLAY",
                "WAYLAND_DISPLAY",
                "XDG_RUNTIME_DIR",
                "DBUS_SESSION_BUS_ADDRESS",
                "GDK_BACKEND",
            ] {
                if let Ok(val) = std::env::var(var) {
                    cmd.env(var, val);
                }
            }
            cmd.arg("-drive8type")
                .arg("1541")
                .arg(&path)
                .stdin(std::process::Stdio::null())
                .stdout(std::process::Stdio::null())
                .stderr(std::process::Stdio::null())
                .spawn()
                .map(|_| ())
        }
    };

    match launch_result {
        Ok(_) => serde_json::json!({ "ok": true }),
        Err(e) => serde_json::json!({ "ok": false, "error": e.to_string() }),
    }
}

// ── 1541 Ultimate REST API ────────────────────────────────────────────────────

// reqwest's Display only says "error sending request for url (...)"; the real
// reason (connection refused, no route to host, timeout...) lives in the source
// chain, so append it. On macOS a connect error to a LAN address that fails
// instantly is almost always the Local Network privacy permission being denied
// for this app (System Settings > Privacy & Security > Local Network).
fn describe_ultimate_error(error: &reqwest::Error) -> String {
    let mut message = error.to_string();
    let mut source = std::error::Error::source(error);
    while let Some(inner) = source {
        let text = inner.to_string();
        if !text.is_empty() && !message.contains(&text) {
            message.push_str(": ");
            message.push_str(&text);
        }
        source = std::error::Error::source(inner);
    }
    if cfg!(target_os = "macos") && error.is_connect() {
        message.push_str(
            " — macOS may be blocking local network access for this app: enable it under System Settings > Privacy & Security > Local Network, then restart the app.",
        );
    }
    message
}

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
        if p.is_empty() {
            detect_vice_executable()
        } else {
            p
        }
    };
    let c1541_path = match resolve_c1541_path(&vice_path) {
        Some(p) => p,
        None => {
            return serde_json::json!({
                "ok": false,
                "error": "c1541 nem talalhato. Allitsd be a VICE eleresi utjat."
            })
        }
    };

    let temp_dir = std::env::temp_dir().join("c64-visual-assembler");
    let _ = fs::create_dir_all(&temp_dir);
    let now_ms = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_millis();

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
            for (p, _) in &staged {
                let _ = fs::remove_file(p);
            }
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
    cmd.arg("-format")
        .arg(&format_arg)
        .arg("d64")
        .arg(&d64_path);
    for (prg_path, c64_name) in &staged {
        cmd.arg("-write")
            .arg(prg_path.to_string_lossy().to_string())
            .arg(c64_name);
    }
    #[cfg(target_os = "windows")]
    {
        const CREATE_NO_WINDOW: u32 = 0x08000000;
        cmd.creation_flags(CREATE_NO_WINDOW);
    }

    let c1541_out = match cmd.output() {
        Ok(o) => o,
        Err(e) => {
            for (p, _) in &staged {
                let _ = fs::remove_file(p);
            }
            return serde_json::json!({ "ok": false, "error": e.to_string() });
        }
    };
    for (p, _) in &staged {
        let _ = fs::remove_file(p);
    }

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
        Err(e) => {
            return serde_json::json!({ "ok": false, "error": format!("D64 mount: {}", describe_ultimate_error(&e)) })
        }
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
        Err(e) => serde_json::json!({ "ok": false, "error": describe_ultimate_error(&e) }),
    }
}

#[tauri::command]
async fn run_on_ultimate(
    host: String,
    password: Option<String>,
    prg_bytes: Vec<u8>,
) -> serde_json::Value {
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
        Err(e) => serde_json::json!({ "ok": false, "error": describe_ultimate_error(&e) }),
    }
}

fn kff2_validate_prg(prg_bytes: &[u8]) -> Result<(), String> {
    if !(3..=65535).contains(&prg_bytes.len()) {
        return Err("A KFF2-höz a PRG-nek kétbájtos betöltési címet és legalább egy adatbájtot kell tartalmaznia.".to_string());
    }
    let load_address = u16::from_le_bytes([prg_bytes[0], prg_bytes[1]]) as usize;
    if load_address + prg_bytes.len() - 2 > 0x10000 {
        return Err("A PRG túlfut a C64 64 KiB-os címtartományán.".to_string());
    }
    Ok(())
}

fn detect_kff2_port_name() -> Result<Option<String>, String> {
    let ports = serialport::available_ports()
        .map_err(|error| format!("A soros portok nem kérdezhetők le: {error}"))?;
    Ok(ports.into_iter().find_map(|port| match port.port_type {
        serialport::SerialPortType::UsbPort(info) if info.vid == 0x0483 && info.pid == 0x5740 => {
            Some(port.port_name)
        }
        _ => None,
    }))
}

fn kff2_read_exact(
    port: &mut dyn serialport::SerialPort,
    size: usize,
    message: &str,
) -> Result<Vec<u8>, String> {
    let deadline = std::time::Instant::now() + Duration::from_secs(15);
    let mut data = vec![0u8; size];
    let mut offset = 0;
    while offset < size {
        match port.read(&mut data[offset..]) {
            Ok(0) => {}
            Ok(read) => offset += read,
            Err(error)
                if error.kind() == ErrorKind::TimedOut && std::time::Instant::now() < deadline => {}
            Err(error) if error.kind() == ErrorKind::TimedOut => return Err(message.to_string()),
            Err(error) => return Err(format!("KFF2 soros olvasási hiba: {error}")),
        }
    }
    Ok(data)
}

fn run_on_kff2_port(port_name: &str, prg_bytes: &[u8]) -> Result<(), String> {
    kff2_validate_prg(prg_bytes)?;
    if port_name.trim().is_empty() {
        return Err("A Kung Fu Flash 2 soros portja nincs beállítva.".to_string());
    }

    let mut reset_port = serialport::new(port_name, 115_200)
        .timeout(Duration::from_millis(100))
        .open()
        .map_err(|error| format!("Nem nyitható meg a KFF2 port ({port_name}): {error}"))?;
    reset_port
        .set_baud_rate(1_200)
        .map_err(|error| format!("Nem küldhető MENU kérés a KFF2-re: {error}"))?;
    drop(reset_port);

    thread::sleep(Duration::from_millis(500));
    let reconnect_deadline = std::time::Instant::now() + Duration::from_secs(15);
    let mut port = loop {
        match serialport::new(port_name, 115_200)
            .timeout(Duration::from_millis(100))
            .open()
        {
            Ok(port) => break port,
            Err(_) if std::time::Instant::now() < reconnect_deadline => {
                thread::sleep(Duration::from_millis(100))
            }
            Err(error) => {
                return Err(format!(
                    "A KFF2 nem tért vissza a MENU után ({port_name}): {error}"
                ))
            }
        }
    };

    let transfer_deadline = std::time::Instant::now() + Duration::from_secs(15);
    loop {
        port.write_all(b"EFSTART:PRG\0")
            .map_err(|error| format!("KFF2 handshake írási hiba: {error}"))?;
        port.flush()
            .map_err(|error| format!("KFF2 handshake flush hiba: {error}"))?;
        let response =
            kff2_read_exact(&mut *port, 5, "A KFF2 loader nem válaszolt a PRG-kérésre.")?;
        if response == b"LOAD\0" {
            break;
        }
        if response != b"WAIT\0" {
            return Err(format!(
                "A KFF2 loader váratlan választ adott: {:?}",
                response
            ));
        }
        if std::time::Instant::now() >= transfer_deadline {
            return Err("A KFF2 MENU loader nem lett fogadókész időben.".to_string());
        }
    }

    let requested = kff2_read_exact(&mut *port, 2, "A KFF2 loader nem kérte a PRG adatokat.")?;
    let requested = u16::from_le_bytes([requested[0], requested[1]]) as usize;
    if prg_bytes.len() > requested {
        return Err(format!(
            "A PRG {} bájt, a KFF2 loader legfeljebb {} bájtot kér.",
            prg_bytes.len(),
            requested
        ));
    }
    port.write_all(&(prg_bytes.len() as u16).to_le_bytes())
        .and_then(|_| port.write_all(prg_bytes))
        .and_then(|_| port.flush())
        .map_err(|error| format!("KFF2 PRG-küldési hiba: {error}"))?;
    let close = kff2_read_exact(&mut *port, 2, "A KFF2 nem zárta le a PRG-átvitelt.")?;
    if close != [0, 0] {
        return Err(format!("A KFF2 hibás átviteli lezárást adott: {:?}", close));
    }
    Ok(())
}

#[tauri::command]
async fn detect_kff2_port() -> serde_json::Value {
    match tauri::async_runtime::spawn_blocking(detect_kff2_port_name).await {
        Ok(Ok(Some(port))) => serde_json::json!({ "ok": true, "port": port }),
        Ok(Ok(None)) => serde_json::json!({ "ok": true, "port": null }),
        Ok(Err(error)) => serde_json::json!({ "ok": false, "error": error }),
        Err(error) => serde_json::json!({ "ok": false, "error": error.to_string() }),
    }
}

#[tauri::command]
async fn run_on_kff2(port: String, prg_bytes: Vec<u8>) -> serde_json::Value {
    match tauri::async_runtime::spawn_blocking(move || run_on_kff2_port(&port, &prg_bytes)).await {
        Ok(Ok(())) => serde_json::json!({ "ok": true }),
        Ok(Err(error)) => serde_json::json!({ "ok": false, "error": error }),
        Err(error) => serde_json::json!({ "ok": false, "error": error.to_string() }),
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
        Err(e) => serde_json::json!({ "ok": false, "error": describe_ultimate_error(&e) }),
    }
}

#[tauri::command]
async fn save_project(app: AppHandle, payload: serde_json::Value) -> serde_json::Value {
    // If the caller passes a _filePath, save silently to that path
    let existing_path = payload
        .get("_filePath")
        .and_then(|v| v.as_str())
        .unwrap_or("")
        .to_string();
    let default_name = payload
        .get("_defaultName")
        .and_then(|v| v.as_str())
        .unwrap_or("program.json")
        .to_string();

    let save_path: String = if !existing_path.is_empty() {
        existing_path
    } else {
        let working_folder = {
            let cfg = read_config(&app);
            get_working_folder_path(&cfg)
        };
        let mut dialog = app
            .dialog()
            .file()
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
        Ok(_) => serde_json::json!({ "ok": true, "filePath": save_path }),
        Err(e) => serde_json::json!({ "ok": false, "error": e.to_string() }),
    }
}

// Workspace = a small named file remembering which real, on-disk files were
// open across every tab (and in which editor mode, and which one was active),
// so the app can reopen that same set later. Mirrors save_project/open_proj_file.
#[tauri::command]
async fn save_workspace_file(app: AppHandle, payload: serde_json::Value) -> serde_json::Value {
    let existing_path = payload
        .get("_filePath")
        .and_then(|v| v.as_str())
        .unwrap_or("")
        .to_string();
    let default_name = payload
        .get("_defaultName")
        .and_then(|v| v.as_str())
        .unwrap_or("workspace.vaws")
        .to_string();

    let save_path: String = if !existing_path.is_empty() {
        existing_path
    } else {
        let working_folder = {
            let cfg = read_config(&app);
            get_working_folder_path(&cfg)
        };
        let mut dialog = app
            .dialog()
            .file()
            .add_filter("C64 Visual Assembler Workspace", &["vaws", "json"])
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

    let mut clean = payload.clone();
    if let Some(obj) = clean.as_object_mut() {
        obj.remove("_filePath");
        obj.remove("_defaultName");
    }
    let content = serde_json::to_string_pretty(&clean).unwrap();
    match fs::write(&save_path, content.as_bytes()) {
        Ok(_) => serde_json::json!({ "ok": true, "filePath": save_path }),
        Err(e) => serde_json::json!({ "ok": false, "error": e.to_string() }),
    }
}

#[tauri::command]
async fn open_workspace_file(app: AppHandle) -> serde_json::Value {
    let working_folder = get_working_folder_path(&read_config(&app));
    let mut dialog = app
        .dialog()
        .file()
        .add_filter("C64 Visual Assembler Workspace", &["vaws", "json"])
        .add_filter("All files", &["*"]);
    if let Some(folder) = working_folder {
        dialog = dialog.set_directory(folder);
    }
    let result = dialog.blocking_pick_file();

    match result {
        Some(path) => {
            let path_str = path.to_string();
            match fs::read_to_string(&path_str) {
                Ok(raw) => match serde_json::from_str::<serde_json::Value>(&raw) {
                    Ok(ws) => {
                        serde_json::json!({ "ok": true, "filePath": path_str, "workspace": ws })
                    }
                    Err(e) => serde_json::json!({ "ok": false, "error": e.to_string() }),
                },
                Err(e) => serde_json::json!({ "ok": false, "error": e.to_string() }),
            }
        }
        None => serde_json::json!({ "canceled": true }),
    }
}

#[tauri::command]
async fn open_proj_file(app: AppHandle, initial_dir: Option<String>) -> serde_json::Value {
    let working_folder = initial_dir
        .as_deref()
        .map(str::trim)
        .filter(|path| !path.is_empty())
        .map(PathBuf::from)
        .filter(|path| path.is_dir())
        .or_else(|| get_working_folder_path(&read_config(&app)));
    let mut dialog = app
        .dialog()
        .file()
        .add_filter("Visual Assembler Project", &["proj"])
        .add_filter("All files", &["*"]);
    if let Some(folder) = working_folder {
        dialog = dialog.set_directory(folder);
    }
    let result = dialog.blocking_pick_file();

    match result {
        Some(path) => {
            let path_str = path.to_string();
            match fs::read_to_string(&path_str) {
                Ok(raw) => match serde_json::from_str::<serde_json::Value>(&raw) {
                    Ok(proj) => {
                        serde_json::json!({ "ok": true, "filePath": path_str, "project": proj })
                    }
                    Err(e) => serde_json::json!({ "ok": false, "error": e.to_string() }),
                },
                Err(e) => serde_json::json!({ "ok": false, "error": e.to_string() }),
            }
        }
        None => serde_json::json!({ "canceled": true }),
    }
}

#[tauri::command]
async fn save_proj_file(
    app: AppHandle,
    path: String,
    content: String,
    initial_dir: Option<String>,
) -> serde_json::Value {
    let save_path = if path.is_empty() {
        let working_folder = initial_dir
            .as_deref()
            .map(str::trim)
            .filter(|path| !path.is_empty())
            .map(PathBuf::from)
            .filter(|path| path.is_dir())
            .or_else(|| get_working_folder_path(&read_config(&app)));
        let mut dialog = app
            .dialog()
            .file()
            .add_filter("Visual Assembler Project", &["proj"])
            .set_file_name("project.proj");
        if let Some(folder) = working_folder {
            dialog = dialog.set_directory(folder);
        }
        let result = dialog.blocking_save_file();
        match result {
            Some(p) => p.to_string(),
            None => return serde_json::json!({ "canceled": true }),
        }
    } else {
        path
    };

    match fs::write(&save_path, content.as_bytes()) {
        Ok(_) => serde_json::json!({ "ok": true, "filePath": save_path }),
        Err(e) => serde_json::json!({ "ok": false, "error": e.to_string() }),
    }
}

#[tauri::command]
fn read_text_file(path: String) -> serde_json::Value {
    match fs::read_to_string(&path) {
        Ok(content) => serde_json::json!({ "ok": true, "content": content }),
        Err(e) => serde_json::json!({ "ok": false, "error": e.to_string() }),
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
fn get_project_snapshot_path(
    app: AppHandle,
    project_path: String,
    snapshot_id: String,
) -> serde_json::Value {
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
        let stem = source
            .file_stem()
            .and_then(|s| s.to_str())
            .unwrap_or("project");
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
        let mut dialog = app
            .dialog()
            .file()
            .add_filter("Assembly Source", &["asm", "s", "a65"])
            .add_filter("All files", &["*"])
            .set_file_name("program.asm");
        if let Some(folder) = working_folder {
            dialog = dialog.set_directory(folder);
        }
        let result = dialog.blocking_save_file();
        match result {
            Some(p) => p.to_string(),
            None => return serde_json::json!({ "canceled": true }),
        }
    } else {
        path
    };

    if Path::new(&save_path).exists() {
        let overwrite = app
            .dialog()
            .message(format!(
                "The file already exists:\n\n{}\n\nOverwrite it?",
                save_path
            ))
            .title("Overwrite existing file?")
            .kind(MessageDialogKind::Warning)
            .buttons(MessageDialogButtons::YesNo)
            .blocking_show();
        if !overwrite {
            return serde_json::json!({ "canceled": true });
        }
    }

    match fs::write(&save_path, content.as_bytes()) {
        Ok(_) => serde_json::json!({ "ok": true, "filePath": save_path }),
        Err(e) => serde_json::json!({ "ok": false, "error": e.to_string() }),
    }
}

#[tauri::command]
async fn choose_asm_file(app: AppHandle) -> serde_json::Value {
    let working_folder = {
        let cfg = read_config(&app);
        get_working_folder_path(&cfg)
    };
    let mut dialog = app
        .dialog()
        .file()
        .add_filter("Assembly Source", &["asm", "s", "a65"])
        .add_filter("All files", &["*"]);
    if let Some(folder) = working_folder {
        dialog = dialog.set_directory(folder);
    }
    let result = dialog.blocking_pick_file();

    match result {
        Some(path) => {
            let path_str = path.to_string();
            match fs::read_to_string(&path_str) {
                Ok(content) => {
                    serde_json::json!({ "ok": true, "filePath": path_str, "content": content })
                }
                Err(e) => serde_json::json!({ "ok": false, "error": e.to_string() }),
            }
        }
        None => serde_json::json!({ "canceled": true }),
    }
}

#[tauri::command]
async fn choose_ub_file(app: AppHandle, initial_dir: Option<String>) -> serde_json::Value {
    let mut dialog = app
        .dialog()
        .file()
        .add_filter("UltimateBasic Source", &["ub"])
        .add_filter("All files", &["*"]);
    let requested_folder = initial_dir
        .as_deref()
        .map(str::trim)
        .filter(|path| !path.is_empty())
        .map(PathBuf::from)
        .filter(|path| path.is_dir())
        .or_else(|| get_ub_working_folder_path(&read_config(&app)));
    if let Some(folder) = requested_folder {
        dialog = dialog.set_directory(folder);
    }
    match dialog.blocking_pick_file() {
        Some(path) => {
            let path_str = path.to_string();
            match fs::read_to_string(&path_str) {
                Ok(content) => {
                    serde_json::json!({ "ok": true, "filePath": path_str, "content": content })
                }
                Err(e) => serde_json::json!({ "ok": false, "error": e.to_string() }),
            }
        }
        None => serde_json::json!({ "canceled": true }),
    }
}

#[tauri::command]
async fn save_ub_file(app: AppHandle, path: String, content: String) -> serde_json::Value {
    let save_path = if path.is_empty() {
        let mut dialog = app
            .dialog()
            .file()
            .add_filter("UltimateBasic Source", &["ub"])
            .set_file_name("program.ub");
        if let Some(folder) = get_ub_working_folder_path(&read_config(&app)) {
            dialog = dialog.set_directory(folder);
        }
        match dialog.blocking_save_file() {
            Some(path) => path.to_string(),
            None => return serde_json::json!({ "canceled": true }),
        }
    } else {
        path
    };
    match fs::write(&save_path, content.as_bytes()) {
        Ok(_) => serde_json::json!({ "ok": true, "filePath": save_path }),
        Err(e) => serde_json::json!({ "ok": false, "error": e.to_string() }),
    }
}

#[tauri::command]
fn compile_ultimate_basic(
    source: String,
    source_path: Option<String>,
    explicit: Option<bool>,
) -> serde_json::Value {
    // The UB parser/codegen can use several MB of stack for large programs (deep
    // recursive-descent parsing, mainly in unoptimized debug builds). The caller's
    // thread (Tauri's command worker pool, or even the main thread during startup
    // auto-restore) may only have a ~1MB OS stack on Windows, which that can
    // overflow and crash the whole process. Run the compile on a dedicated thread
    // with a generous stack instead, so callers can't overflow it regardless of
    // their own stack size.
    std::thread::Builder::new()
        .stack_size(64 * 1024 * 1024)
        .spawn(move || {
            use ultimate_basic::compiler::{compile_with_path, debug_output, CompileOptions};
            let path = source_path.as_deref().filter(|p| !p.is_empty()).map(Path::new);
            let result = compile_with_path(&source, &CompileOptions { basic_stub: true, explicit: explicit.unwrap_or(false) }, path);
            let map = &result.map;
            let debug_source_path = path.unwrap_or_else(|| Path::new("program.ub"));
            serde_json::json!({
                "ok": result.errors.is_empty(),
                "errors": result.errors,
                "prg": result.prg,
                "asm": result.asm,
                "debug": {
                    "sym": debug_output::sym(map),
                    "dbg": debug_output::dbg(map, debug_source_path),
                    "vs": debug_output::vice(map)
                },
                "map": {
                    "loadAddress": map.load_addr,
                    "codeSize": map.code_size,
                    "variables": map.variables.iter().map(|v| serde_json::json!({"name": v.name, "address": v.zp_addr, "type": v.type_str})).collect::<Vec<_>>(),
                    "subroutines": map.subroutines.iter().map(|s| serde_json::json!({"name": s.name, "address": s.addr})).collect::<Vec<_>>(),
                    "labels": map.labels.iter().map(|label| serde_json::json!({"name": label.name, "address": label.addr})).collect::<Vec<_>>(),
                    "arrays": map.arrays.iter().map(|a| serde_json::json!({"name": a.name, "address": a.base_addr, "size": a.size})).collect::<Vec<_>>(),
                    // Kód-relatív [start, end) byte-tartományok: `ub_*padding*` = üres kitöltés, a többi beágyazott adat (incbin/koala/sid/sprite).
                    "dataRegions": map.data_regions.iter().map(|r| serde_json::json!({"start": r.start, "end": r.end, "name": r.name})).collect::<Vec<_>>()
                    ,"internal": {
                        "plotZp": map.plot_zp,
                        "lineZp": map.line_zp,
                        "rectZp": map.rect_zp,
                        "dataZp": map.data_zp,
                        "sinTableAddress": map.sin_table_addr
                    },
                    "codeBytes": map.code_bytes
                }
            })
        })
        .expect("failed to spawn ultimate-basic compile thread")
        .join()
        .unwrap_or_else(|_| serde_json::json!({
            "ok": false,
            "errors": ["Internal compiler error (compile thread panicked)"]
        }))
}

#[tauri::command]
async fn choose_proj_member(app: AppHandle, ub: Option<bool>) -> serde_json::Value {
    let working_folder = {
        let cfg = read_config(&app);
        if ub.unwrap_or(false) {
            get_ub_working_folder_path(&cfg)
        } else {
            get_working_folder_path(&cfg)
        }
    };
    let mut dialog = app
        .dialog()
        .file()
        .add_filter("C64 Visual Assembler Project", &["json", "c64va"])
        .add_filter("Assembly Source", &["asm", "s", "a65", "inc"])
        .add_filter("UltimateBasic Source", &["ub"])
        .add_filter("Binary files", &["bin", "prg", "sid", "raw"])
        .add_filter("All files", &["*"]);
    if let Some(folder) = working_folder {
        dialog = dialog.set_directory(folder);
    }
    let result = dialog.blocking_pick_files();

    match result {
        Some(paths) if !paths.is_empty() => {
            let files: Vec<serde_json::Value> = paths
                .iter()
                .map(|path| {
                    let path_str = path.to_string();
                    let file_name = std::path::Path::new(&path_str)
                        .file_name()
                        .and_then(|n| n.to_str())
                        .unwrap_or("")
                        .to_string();
                    serde_json::json!({ "filePath": path_str, "fileName": file_name })
                })
                .collect();
            serde_json::json!({ "canceled": false, "files": files })
        }
        _ => serde_json::json!({ "canceled": true, "files": [] }),
    }
}

#[tauri::command]
async fn choose_proj_folder(app: AppHandle, ub: Option<bool>) -> serde_json::Value {
    let working_folder = {
        let cfg = read_config(&app);
        if ub.unwrap_or(false) {
            get_ub_working_folder_path(&cfg)
        } else {
            get_working_folder_path(&cfg)
        }
    };
    let mut dialog = app.dialog().file();
    if let Some(folder) = working_folder {
        dialog = dialog.set_directory(folder);
    }
    let result = dialog.blocking_pick_folder();

    match result {
        Some(path) => {
            let path_str = path.to_string();
            let folder_name = std::path::Path::new(&path_str)
                .file_name()
                .and_then(|n| n.to_str())
                .unwrap_or(&path_str)
                .to_string();
            serde_json::json!({ "canceled": false, "folderPath": path_str, "folderName": folder_name })
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
    let mut dialog = app
        .dialog()
        .file()
        .add_filter("C64 Visual Assembler Project", &["json", "c64va"]);
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
                    }
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
    app.opener()
        .open_path(manual_path.to_string_lossy().as_ref(), None::<String>)
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn open_ultimate_basic_manual(app: AppHandle) -> Result<(), String> {
    let manual_path = app
        .path()
        .app_cache_dir()
        .map_err(|e| e.to_string())?
        .join("UltimateBasic-MANUAL.pdf");
    if let Some(parent) = manual_path.parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }
    let bytes = include_bytes!(env!("ULTIMATE_BASIC_MANUAL"));
    let needs_write = fs::metadata(&manual_path)
        .map(|meta| meta.len() != bytes.len() as u64)
        .unwrap_or(true);
    if needs_write {
        fs::write(&manual_path, bytes).map_err(|e| e.to_string())?;
    }
    app.opener()
        .open_path(manual_path.to_string_lossy().as_ref(), None::<String>)
        .map_err(|e| e.to_string())
}

// ── Project templates ────────────────────────────────────────────────────────
// Every *.asm (assembler) and *.ub (UltimateBasic) file in the bundled templates/
// folder and in the user's own templates folder is a template; the frontend reads
// the "; @name ..." / "# @name ..." header.

fn user_templates_dir(app: &AppHandle) -> Option<PathBuf> {
    app.path()
        .app_config_dir()
        .ok()
        .map(|dir| dir.join("templates"))
}

fn collect_templates(dir: &Path, source: &str, out: &mut Vec<serde_json::Value>) {
    let entries = match fs::read_dir(dir) {
        Ok(entries) => entries,
        Err(_) => return,
    };
    let mut paths: Vec<PathBuf> = entries
        .filter_map(|entry| entry.ok())
        .map(|entry| entry.path())
        .filter(|path| {
            path.is_file()
                && path
                    .extension()
                    .and_then(|ext| ext.to_str())
                    .map(|ext| ext.eq_ignore_ascii_case("asm") || ext.eq_ignore_ascii_case("ub"))
                    .unwrap_or(false)
        })
        .collect();
    paths.sort();
    for path in paths {
        let file_name = match path.file_name().and_then(|name| name.to_str()) {
            Some(name) => name.to_string(),
            None => continue,
        };
        if let Ok(content) = fs::read_to_string(&path) {
            out.push(
                serde_json::json!({ "fileName": file_name, "source": source, "content": content }),
            );
        }
    }
}

#[tauri::command]
fn list_templates(app: AppHandle) -> serde_json::Value {
    let mut templates: Vec<serde_json::Value> = Vec::new();
    if let Ok(dir) = resolve_resource_file(&app, "templates") {
        collect_templates(&dir, "builtin", &mut templates);
    }
    let user_dir = user_templates_dir(&app);
    if let Some(dir) = &user_dir {
        collect_templates(dir, "user", &mut templates);
    }
    serde_json::json!({
        "ok": true,
        "templates": templates,
        "userDir": user_dir.map(|dir| dir.to_string_lossy().to_string()).unwrap_or_default()
    })
}

fn create_new_file(path: &Path, content: &str) -> std::io::Result<()> {
    let mut file = fs::OpenOptions::new()
        .write(true)
        .create_new(true)
        .open(path)?;
    file.write_all(content.as_bytes())?;
    file.sync_all()
}

// Writes a new project's main source and .proj together: both are created with
// create-new semantics (an existing file is never touched), and if the second
// write fails the first file is removed again, so no orphaned half project stays.
#[tauri::command]
fn create_template_project(
    proj_path: String,
    proj_content: String,
    main_path: String,
    main_content: String,
) -> serde_json::Value {
    let proj = PathBuf::from(&proj_path);
    let main = PathBuf::from(&main_path);
    if proj_path.is_empty() || main_path.is_empty() {
        return serde_json::json!({ "ok": false, "error": "Empty path" });
    }
    if proj.exists() || main.exists() {
        return serde_json::json!({ "ok": false, "exists": true, "error": "Project already exists" });
    }
    let dir = match proj.parent() {
        Some(dir) => dir.to_path_buf(),
        None => return serde_json::json!({ "ok": false, "error": "Invalid project path" }),
    };
    let created_dir = !dir.exists();
    if let Err(e) = fs::create_dir_all(&dir) {
        return serde_json::json!({ "ok": false, "error": e.to_string() });
    }
    // A file that already existed (AlreadyExists) is someone else's and is never removed.
    let fail = |e: std::io::Error, written: &[&Path]| {
        let exists = e.kind() == ErrorKind::AlreadyExists;
        for path in written {
            let _ = fs::remove_file(path);
        }
        if created_dir {
            let _ = fs::remove_dir(&dir);
        }
        serde_json::json!({ "ok": false, "exists": exists, "error": e.to_string() })
    };
    if let Err(e) = create_new_file(&main, &main_content) {
        let partial: &[&Path] = if e.kind() == ErrorKind::AlreadyExists {
            &[]
        } else {
            &[main.as_path()]
        };
        return fail(e, partial);
    }
    if let Err(e) = create_new_file(&proj, &proj_content) {
        let written: Vec<&Path> = if e.kind() == ErrorKind::AlreadyExists {
            vec![main.as_path()]
        } else {
            vec![main.as_path(), proj.as_path()]
        };
        return fail(e, &written);
    }
    serde_json::json!({ "ok": true, "projPath": proj_path, "mainPath": main_path })
}

#[tauri::command]
async fn open_templates_folder(app: AppHandle) -> Result<(), String> {
    let dir = user_templates_dir(&app).ok_or_else(|| "No config folder".to_string())?;
    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    app.opener()
        .open_path(dir.to_string_lossy().as_ref(), None::<String>)
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
                if let Some(extras) = sample
                    .get("d64")
                    .and_then(|d| d.get("extras"))
                    .and_then(|e| e.as_array())
                {
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
            }
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

    fn create_project(dir: &Path, proj_name: &str) -> serde_json::Value {
        create_template_project(
            dir.join(proj_name).to_string_lossy().to_string(),
            "{}".to_string(),
            dir.join("main.asm").to_string_lossy().to_string(),
            "RTS".to_string(),
        )
    }

    #[test]
    fn template_project_writes_both_files_and_never_overwrites() {
        let dir = unique_temp_dir("va-template-ok").join("Demo");
        let res = create_project(&dir, "Demo.proj");
        assert_eq!(res["ok"], true);
        assert_eq!(fs::read_to_string(dir.join("main.asm")).unwrap(), "RTS");
        assert_eq!(fs::read_to_string(dir.join("Demo.proj")).unwrap(), "{}");

        fs::write(dir.join("main.asm"), "KEEP").unwrap();
        let again = create_project(&dir, "Demo.proj");
        assert_eq!(again["ok"], false);
        assert_eq!(again["exists"], true);
        assert_eq!(fs::read_to_string(dir.join("main.asm")).unwrap(), "KEEP");
        let _ = fs::remove_dir_all(dir.parent().unwrap());
    }

    #[test]
    fn template_project_rolls_back_main_file_when_proj_write_fails() {
        let root = unique_temp_dir("va-template-rollback");
        let dir = root.join("Demo");
        // A NUL byte makes the .proj open fail after main.asm was written.
        let res = create_project(&dir, "De\0mo.proj");
        assert_eq!(res["ok"], false);
        assert_eq!(res["exists"], false);
        assert!(!dir.join("main.asm").exists());
        assert!(!dir.exists());
        let _ = fs::remove_dir_all(&root);
    }

    #[test]
    fn sanitize_disk_name_strips_forbidden_chars_and_lowercases() {
        assert_eq!(
            sanitize_disk_name("Disk: Name/One,Two", 16),
            "disk nameonetwo"
        );
        assert_eq!(sanitize_disk_name("\"/:\\\0", 16), "disk");
        assert_eq!(sanitize_disk_name("ABCDEFGHIJKLMN", 4), "abcd");
    }

    #[test]
    fn debugger_breakpoints_use_retro_debugger_hex_syntax() {
        assert_eq!(
            format_debugger_breakpoints(&[0x080d, 0xc000, 0x1ffff]),
            "break 080D\nbreak C000\nbreak FFFF"
        );
    }

    #[test]
    fn debugger_launch_passes_tasks_to_running_instance() {
        let extra = vec!["-symbols".to_string(), "program.vs".to_string()];
        assert_eq!(
            debugger_launch_args("program.prg", &extra, true),
            vec![
                "-pass",
                "-prg",
                "program.prg",
                "-symbols",
                "program.vs",
                "-autojmp"
            ]
        );
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

// ── Self-update ──────────────────────────────────────────────────────────────
// A legfrissebb verziót a termékoldal letöltési linkjeiből (downloads/VA/...)
// olvassuk ki — nincs külön manifest. Ha a főoldalon nem található platformhoz
// illő link, a downloads/VA/ könyvtárlistázást is megpróbáljuk.

const UPDATE_PAGE_URLS: [&str; 2] = [
    "https://www.c64va.tech/",
    "https://www.c64va.tech/downloads/VA/",
];
const UPDATE_DOWNLOAD_BASE: &str = "https://www.c64va.tech/downloads/VA/";

fn parse_version_triplet(s: &str) -> Option<(u32, u32, u32)> {
    let mut parts = s.trim().trim_start_matches('v').split('.');
    let major = parts.next()?.parse().ok()?;
    let minor = parts.next()?.parse().ok()?;
    let patch = parts.next().unwrap_or("0").parse().ok()?;
    if parts.next().is_some() {
        return None;
    }
    Some((major, minor, patch))
}

/// A futó platformhoz illő telepítőfájl neve: prefix + verzió + suffix.
fn update_asset_pattern() -> Option<(&'static str, &'static str)> {
    #[cfg(all(target_os = "windows", target_arch = "aarch64"))]
    return Some(("C64 Visual Assembler_", "_arm64-setup.exe"));
    #[cfg(all(target_os = "windows", not(target_arch = "aarch64")))]
    return Some(("C64 Visual Assembler_", "_x64-setup.exe"));
    #[cfg(all(target_os = "macos", target_arch = "aarch64"))]
    return Some(("C64 Visual Assembler_", "_aarch64.dmg"));
    #[cfg(all(target_os = "macos", not(target_arch = "aarch64")))]
    return Some(("C64 Visual Assembler_", "_x64.dmg"));
    #[cfg(all(target_os = "linux", target_arch = "x86_64"))]
    {
        if std::env::var_os("APPIMAGE").is_some() {
            return Some(("C64 Visual Assembler_", "_amd64.AppImage"));
        }
        let rpm_based = Path::new("/etc/redhat-release").exists()
            || Path::new("/etc/fedora-release").exists()
            || (!Path::new("/usr/bin/dpkg").exists() && Path::new("/usr/bin/rpm").exists());
        return if rpm_based {
            Some(("C64 Visual Assembler-", "-1.x86_64.rpm"))
        } else {
            Some(("C64 Visual Assembler_", "_amd64.deb"))
        };
    }
    #[allow(unreachable_code)]
    None
}

fn update_asset_name(version: &str) -> Option<String> {
    let (prefix, suffix) = update_asset_pattern()?;
    Some(format!("{}{}{}", prefix, version, suffix))
}

/// A HTML-ben (vagy könyvtárlistában) előforduló legnagyobb `prefix<ver>suffix` verzió.
fn find_latest_asset_version(html: &str, prefix: &str, suffix: &str) -> Option<(u32, u32, u32)> {
    let text = html.replace("%20", " ");
    let mut best: Option<(u32, u32, u32)> = None;
    let mut rest = text.as_str();
    while let Some(pos) = rest.find(prefix) {
        rest = &rest[pos + prefix.len()..];
        let ver_len = rest
            .find(|c: char| !(c.is_ascii_digit() || c == '.'))
            .unwrap_or(rest.len());
        let (ver, tail) = rest.split_at(ver_len);
        if !tail.starts_with(suffix) {
            continue;
        }
        if let Some(v) = parse_version_triplet(ver) {
            if best.map_or(true, |b| v > b) {
                best = Some(v);
            }
        }
    }
    best
}

fn update_http_client(app: &AppHandle, timeout_secs: u64) -> Result<reqwest::Client, String> {
    reqwest::Client::builder()
        .timeout(Duration::from_secs(timeout_secs))
        .user_agent(format!("C64VisualAssembler/{}", app.package_info().version))
        .build()
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn check_for_update(app: AppHandle) -> Result<serde_json::Value, String> {
    let current = app.package_info().version.to_string();
    let Some((prefix, suffix)) = update_asset_pattern() else {
        return Ok(serde_json::json!({ "supported": false, "currentVersion": current }));
    };
    let client = update_http_client(&app, 15)?;

    let mut latest: Option<(u32, u32, u32)> = None;
    let mut last_err = String::new();
    for url in UPDATE_PAGE_URLS {
        match client
            .get(url)
            .send()
            .await
            .and_then(|r| r.error_for_status())
        {
            Ok(resp) => match resp.text().await {
                Ok(html) => latest = find_latest_asset_version(&html, prefix, suffix),
                Err(e) => last_err = e.to_string(),
            },
            Err(e) => last_err = e.to_string(),
        }
        if latest.is_some() {
            break;
        }
    }

    let Some((ma, mi, pa)) = latest else {
        return Err(if last_err.is_empty() {
            "No download found for this platform.".into()
        } else {
            last_err
        });
    };
    let latest_str = format!("{}.{}.{}", ma, mi, pa);
    let current_v = parse_version_triplet(&current).unwrap_or((0, 0, 0));
    let file_name = update_asset_name(&latest_str).unwrap_or_default();
    Ok(serde_json::json!({
        "supported": true,
        "currentVersion": current,
        "latestVersion": latest_str,
        "updateAvailable": (ma, mi, pa) > current_v,
        "fileName": file_name,
        "url": format!("{}{}", UPDATE_DOWNLOAD_BASE, urlencoding::encode(&file_name)),
    }))
}

#[cfg(not(target_os = "windows"))]
fn spawn_update_script(script: &str, args: &[&str]) -> Result<(), String> {
    let dir = std::env::temp_dir()
        .join("c64-visual-assembler")
        .join("update");
    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    let script_path = dir.join("apply-update.sh");
    fs::write(&script_path, script).map_err(|e| e.to_string())?;
    // AppImage alatt ezek a kilépéskor eltűnő mountba mutathatnak — a helper,
    // a pkexec/apt-get és az újraindított app ne örökölje őket.
    Command::new("/bin/sh")
        .env_remove("LD_LIBRARY_PATH")
        .env_remove("LD_PRELOAD")
        .arg(&script_path)
        .args(args)
        .stdin(std::process::Stdio::null())
        .stdout(std::process::Stdio::null())
        .stderr(std::process::Stdio::null())
        .spawn()
        .map(|_| ())
        .map_err(|e| e.to_string())
}

#[cfg(not(target_os = "windows"))]
fn dir_writable(dir: &Path) -> bool {
    let probe = dir.join(".c64va-write-test");
    let ok = fs::write(&probe, b"").is_ok();
    let _ = fs::remove_file(&probe);
    ok
}

/// Elindítja a letöltött telepítőt. `Ok(true)` = az app kilép és a helper újraindítja,
/// `Ok(false)` = csak megnyitottuk a telepítőt, a felhasználó fejezi be kézzel.
fn launch_update_installer(app: &AppHandle, file: &Path) -> Result<bool, String> {
    let file_str = file.to_string_lossy().to_string();

    #[cfg(target_os = "windows")]
    {
        let _ = app;
        // Start-Process → ShellExecuteEx: kezeli az UAC elevationt (per-machine
        // telepítésnél a CreateProcess ERROR_ELEVATION_REQUIRED-del elhasalna).
        // Tauri NSIS: /P = passive (csak progress), /R = telepítés után újraindítja az appot.
        let ps_cmd = format!(
            "Start-Process -FilePath '{}' -ArgumentList '/P','/R'",
            file_str.replace('\'', "''")
        );
        let out = Command::new(windows_powershell_path())
            .args([
                "-NoProfile",
                "-NonInteractive",
                "-WindowStyle",
                "Hidden",
                "-Command",
                &ps_cmd,
            ])
            .stdin(std::process::Stdio::null())
            .creation_flags(0x08000000) // CREATE_NO_WINDOW
            .output()
            .map_err(|e| e.to_string())?;
        if !out.status.success() {
            return Err(String::from_utf8_lossy(&out.stderr).trim().to_string());
        }
        return Ok(true);
    }

    #[cfg(target_os = "macos")]
    {
        let _ = app;
        let pid = std::process::id().to_string();
        let bundle = std::env::current_exe().ok().and_then(|exe| {
            exe.ancestors()
                .find(|p| p.extension().map_or(false, |e| e == "app"))
                .map(Path::to_path_buf)
        });
        let Some(bundle) = bundle.filter(|b| b.parent().map_or(false, dir_writable)) else {
            Command::new("open")
                .arg(&file_str)
                .spawn()
                .map_err(|e| e.to_string())?;
            return Ok(false);
        };
        let script = r#"PID="$1"; DMG="$2"; TARGET="$3"
while kill -0 "$PID" 2>/dev/null; do sleep 0.5; done
MNT=$(mktemp -d /tmp/c64va-update.XXXXXX)
if ! hdiutil attach -nobrowse -quiet -mountpoint "$MNT" "$DMG"; then open "$DMG"; exit 1; fi
SRC=$(ls -d "$MNT"/*.app 2>/dev/null | head -n 1)
if [ -n "$SRC" ] && rm -rf "$TARGET.new" && ditto "$SRC" "$TARGET.new"; then
  rm -rf "$TARGET.old"; mv "$TARGET" "$TARGET.old" && mv "$TARGET.new" "$TARGET" && rm -rf "$TARGET.old"
  hdiutil detach -quiet "$MNT"
  xattr -dr com.apple.quarantine "$TARGET" 2>/dev/null
  open "$TARGET"
else
  hdiutil detach -quiet "$MNT"; open "$DMG"
fi
"#;
        spawn_update_script(script, &[&pid, &file_str, &bundle.to_string_lossy()])?;
        return Ok(true);
    }

    #[cfg(target_os = "linux")]
    {
        let _ = app;
        let pid = std::process::id().to_string();
        if let Some(appimage) = std::env::var_os("APPIMAGE").map(PathBuf::from) {
            if !appimage.parent().map_or(false, dir_writable) {
                return Err(format!("Not writable: {}", appimage.display()));
            }
            let script = r#"PID="$1"; NEW="$2"; TARGET="$3"
while kill -0 "$PID" 2>/dev/null; do sleep 0.5; done
chmod +x "$NEW" && cp -f "$NEW" "$TARGET.new" && mv -f "$TARGET.new" "$TARGET" && rm -f "$NEW"
exec "$TARGET"
"#;
            spawn_update_script(script, &[&pid, &file_str, &appimage.to_string_lossy()])?;
            return Ok(true);
        }
        if !Path::new("/usr/bin/pkexec").exists() {
            Command::new("xdg-open")
                .arg(&file_str)
                .spawn()
                .map_err(|e| e.to_string())?;
            return Ok(false);
        }
        let exe = std::env::current_exe().map_err(|e| e.to_string())?;
        let script = r#"PID="$1"; PKG="$2"; EXE="$3"
while kill -0 "$PID" 2>/dev/null; do sleep 0.5; done
case "$PKG" in
  *.deb) if command -v apt-get >/dev/null; then pkexec apt-get install -y "$PKG"; else pkexec dpkg -i "$PKG"; fi ;;
  *.rpm) if command -v dnf >/dev/null; then pkexec dnf install -y "$PKG"; else pkexec rpm -U "$PKG"; fi ;;
esac
if [ $? -ne 0 ]; then xdg-open "$PKG"; fi
exec "$EXE"
"#;
        spawn_update_script(script, &[&pid, &file_str, &exe.to_string_lossy()])?;
        return Ok(true);
    }

    #[allow(unreachable_code)]
    Err("Self-update is not supported on this platform.".into())
}

#[tauri::command]
async fn download_and_install_update(
    app: AppHandle,
    version: String,
) -> Result<serde_json::Value, String> {
    use tauri::Emitter;

    // Csak verziót fogadunk a JS-től, az URL-t mi rakjuk össze → nem lehet
    // tetszőleges fájlt letöltetni és futtatni.
    if parse_version_triplet(&version).is_none() {
        return Err(format!("Invalid version: {}", version));
    }
    let file_name =
        update_asset_name(&version).ok_or("Self-update is not supported on this platform.")?;
    let url = format!(
        "{}{}",
        UPDATE_DOWNLOAD_BASE,
        urlencoding::encode(&file_name)
    );

    let dir = std::env::temp_dir()
        .join("c64-visual-assembler")
        .join("update");
    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    let target = dir.join(&file_name);
    let partial = dir.join(format!("{}.part", file_name));

    let client = update_http_client(&app, 600)?;
    let mut resp = client
        .get(&url)
        .send()
        .await
        .and_then(|r| r.error_for_status())
        .map_err(|e| e.to_string())?;
    let total = resp.content_length().unwrap_or(0);
    let mut out = fs::File::create(&partial).map_err(|e| e.to_string())?;
    let mut received: u64 = 0;
    let mut last_pct: i64 = -1;
    while let Some(chunk) = resp.chunk().await.map_err(|e| e.to_string())? {
        out.write_all(&chunk).map_err(|e| e.to_string())?;
        received += chunk.len() as u64;
        let pct = if total > 0 {
            (received * 100 / total) as i64
        } else {
            -1
        };
        if pct != last_pct {
            last_pct = pct;
            let _ = app.emit(
                "update-download-progress",
                serde_json::json!({ "received": received, "total": total }),
            );
        }
    }
    out.flush().map_err(|e| e.to_string())?;
    drop(out);

    if (total > 0 && received != total) || received < 1024 * 1024 {
        let _ = fs::remove_file(&partial);
        return Err(format!(
            "Incomplete download ({} / {} bytes).",
            received, total
        ));
    }
    let _ = fs::remove_file(&target);
    fs::rename(&partial, &target).map_err(|e| e.to_string())?;

    let restarting = launch_update_installer(&app, &target)?;
    if restarting {
        let handle = app.clone();
        thread::spawn(move || {
            thread::sleep(Duration::from_millis(800));
            handle.exit(0);
        });
    }
    Ok(serde_json::json!({ "restarting": restarting, "path": target.to_string_lossy() }))
}

#[cfg(test)]
mod update_tests {
    use super::*;

    #[test]
    fn finds_highest_matching_version() {
        let html = r#"<a href="downloads/VA/C64%20Visual%20Assembler_2.4.6_x64-setup.exe">
            <a href="downloads/VA/C64%20Visual%20Assembler_2.10.0_arm64-setup.exe">
            <a href="downloads/VA/C64 Visual Assembler_2.5.1_x64-setup.exe">
            <a href="downloads/VA/C64%20Visual%20Assembler-2.9.0-1.x86_64.rpm">"#;
        assert_eq!(
            find_latest_asset_version(html, "C64 Visual Assembler_", "_x64-setup.exe"),
            Some((2, 5, 1))
        );
        assert_eq!(
            find_latest_asset_version(html, "C64 Visual Assembler-", "-1.x86_64.rpm"),
            Some((2, 9, 0))
        );
        assert_eq!(
            find_latest_asset_version(html, "C64 Visual Assembler_", "_x64.dmg"),
            None
        );
    }

    #[test]
    fn compares_versions_numerically() {
        assert!(parse_version_triplet("2.10.0") > parse_version_triplet("2.9.9"));
        assert_eq!(parse_version_triplet("v2.4"), Some((2, 4, 0)));
        assert_eq!(parse_version_triplet("2.4.6.1"), None);
        assert_eq!(parse_version_triplet("../x"), None);
    }
}

// ── App setup ────────────────────────────────────────────────────────────────

pub fn run() {
    tauri::Builder::default()
        .plugin({
            // On Linux/Wayland: position is always 0,0 (compositor doesn't expose it)
            // and MAXIMIZED state causes GTK CSD buttons to malfunction when restored.
            // Save only SIZE so the user's window size is remembered, nothing else.
            // VISIBLE is never persisted: a window minimized / on another Space at quit
            // was saved as visible=false and then never shown again (macOS). The main
            // window is shown by the frontend (applySavedTheme) after the first paint.
            #[cfg(not(any(target_os = "macos", target_os = "windows")))]
            let flags = tauri_plugin_window_state::StateFlags::SIZE;
            #[cfg(any(target_os = "macos", target_os = "windows"))]
            let flags = tauri_plugin_window_state::StateFlags::all()
                - tauri_plugin_window_state::StateFlags::VISIBLE;
            tauri_plugin_window_state::Builder::default()
                .with_state_flags(flags)
                .skip_initial_state("about")
                .build()
        })
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            // Fallback: if the frontend never shows the main window, show it after 3 s.
            let handle = app.handle().clone();
            std::thread::spawn(move || {
                std::thread::sleep(std::time::Duration::from_secs(3));
                if let Some(w) = handle.get_webview_window("main") {
                    if !w.is_visible().unwrap_or(true) {
                        let _ = w.show();
                        let _ = w.set_focus();
                    }
                }
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_app_version,
            get_ultimate_basic_version,
            render_sid_preview,
            release_sid_preview,
            render_sid_file,
            release_sid_file,
            check_for_update,
            download_and_install_update,
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
            choose_ub_working_folder,
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
            save_crt,
            save_bin,
            save_d64,
            run_d64,
            run_d64_on_ultimate,
            choose_d64_open,
            choose_d64_new,
            d64_format,
            d64_list,
            d64_add_file,
            d64_delete_file,
            d64_rename_file,
            d64_extract_file,
            d64_copy_as,
            d64_run,
            read_bin_file,
            write_bin_file,
            delete_bin_file,
            save_project,
            load_project,
            save_workspace_file,
            open_workspace_file,
            open_proj_file,
            save_proj_file,
            read_text_file,
            save_text_file,
            get_project_snapshot_path,
            save_asm_file,
            choose_asm_file,
            choose_ub_file,
            save_ub_file,
            compile_ultimate_basic,
            choose_proj_member,
            choose_proj_folder,
            load_sample,
            list_templates,
            open_templates_folder,
            create_template_project,
            open_manual,
            open_ultimate_basic_manual,
            run_on_ultimate,
            detect_kff2_port,
            run_on_kff2,
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
