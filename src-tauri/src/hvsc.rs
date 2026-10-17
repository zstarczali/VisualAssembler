// High Voltage SID Collection (https://www.hvsc.c64.org/) for the SID Player.
//
// The catalog is DOCUMENTS/Songlengths.md5: every tune's path plus the length of
// each subtune (~5 MB). Tunes are fetched one by one from an HTTP mirror of the
// unpacked C64Music folder and cached under the app cache dir, so a tune played
// once also plays offline. A local, already unpacked HVSC folder (hvscPath in
// the config) takes precedence over both; hvsc_download_all fetches the whole
// collection (the official .7z) and unpacks it into such a folder.

use std::fs;
use std::io::{self, Write};
use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicBool, Ordering};

use tauri::{AppHandle, Emitter, Manager};
use tauri_plugin_dialog::DialogExt;

use super::{read_config, update_http_client, write_config};

const HVSC_MIRRORS: &[&str] = &[
    "https://hvsc.brona.dk/HVSC/C64Music",
    "https://www.prg.dtu.dk/HVSC/C64Music",
];
const HVSC_VERSION_API: &str = "https://www.hvsc.c64.org/api/v1/version/7z";
const SONGLENGTHS: &str = "DOCUMENTS/Songlengths.md5";
const MAX_SID_BYTES: usize = 256 * 1024;
const ARCHIVE_HOST: &str = "https://hvsc.brona.dk/HVSC/";

static DOWNLOAD_CANCEL: AtomicBool = AtomicBool::new(false);
static DOWNLOAD_RUNNING: AtomicBool = AtomicBool::new(false);

fn cache_dir(app: &AppHandle) -> Result<PathBuf, String> {
    app.path().app_cache_dir().map(|d| d.join("hvsc")).map_err(|e| e.to_string())
}

fn local_root(app: &AppHandle) -> Option<PathBuf> {
    let cfg = read_config(app);
    let path = PathBuf::from(cfg["hvscPath"].as_str()?.trim());
    path.join(SONGLENGTHS).is_file().then_some(path)
}

/// An HVSC path like "/MUSICIANS/H/Hubbard_Rob/Commando.sid" split into its
/// segments; anything that could leave the collection folder is refused.
fn sid_segments(path: &str) -> Option<Vec<&str>> {
    let rest = path.strip_prefix('/')?;
    if !rest.to_ascii_lowercase().ends_with(".sid") {
        return None;
    }
    let segments: Vec<&str> = rest.split('/').collect();
    let ok = segments.iter().all(|s| {
        !s.is_empty() && *s != "." && *s != ".."
            && !s.chars().any(|c| c.is_control() || matches!(c, '\\' | ':' | '?' | '#' | '%' | '*' | '"' | '<' | '>' | '|'))
    });
    ok.then_some(segments)
}

fn join_segments(root: &Path, segments: &[&str]) -> PathBuf {
    segments.iter().fold(root.to_path_buf(), |p, s| p.join(s))
}

/// The newest HVSC version in a local folder: the highest DOCUMENTS/UpdateNN.hvs.
fn local_version(root: &Path) -> Option<u32> {
    fs::read_dir(root.join("DOCUMENTS")).ok()?
        .filter_map(|e| e.ok()?.file_name().into_string().ok())
        .filter_map(|n| n.strip_prefix("Update")?.strip_suffix(".hvs")?.parse::<u32>().ok())
        .max()
}

async fn download(client: &reqwest::Client, rel: &str, limit: usize) -> Result<Vec<u8>, String> {
    let mut last = String::from("no mirror");
    for base in HVSC_MIRRORS {
        let url = format!("{base}/{rel}");
        match client.get(&url).send().await {
            Ok(resp) if resp.status().is_success() => match resp.bytes().await {
                Ok(bytes) if bytes.len() <= limit => return Ok(bytes.to_vec()),
                Ok(_) => last = format!("{url}: too large"),
                Err(e) => last = format!("{url}: {e}"),
            },
            Ok(resp) => last = format!("{url}: HTTP {}", resp.status().as_u16()),
            Err(e) => last = format!("{url}: {e}"),
        }
    }
    Err(last)
}

async fn version_info(client: &reqwest::Client) -> Option<serde_json::Value> {
    let bytes = client.get(HVSC_VERSION_API).send().await.ok()?.bytes().await.ok()?;
    serde_json::from_slice(&bytes).ok()
}

async fn online_version(client: &reqwest::Client) -> Option<u32> {
    version_info(client).await?["version"].as_u64().map(|v| v as u32)
}

/// Where the collection comes from: the local folder, if one is set.
#[tauri::command]
pub fn hvsc_status(app: AppHandle) -> serde_json::Value {
    let cfg = read_config(&app);
    let cache = cache_dir(&app).ok();
    serde_json::json!({
        "localPath": cfg["hvscPath"].as_str().unwrap_or(""),
        "localOk": local_root(&app).is_some(),
        "cached": cache.map(|d| d.join("Songlengths.md5").is_file()).unwrap_or(false),
    })
}

/// The Songlengths.md5 text and the HVSC version. Order: local folder, then the
/// cached copy (unless `refresh`), then the mirrors.
#[tauri::command]
pub async fn hvsc_catalog(app: AppHandle, refresh: bool) -> Result<serde_json::Value, String> {
    if let Some(root) = local_root(&app) {
        let text = fs::read_to_string(root.join(SONGLENGTHS)).map_err(|e| e.to_string())?;
        return Ok(serde_json::json!({ "source": "local", "version": local_version(&root), "text": text }));
    }
    let dir = cache_dir(&app)?;
    let file = dir.join("Songlengths.md5");
    let meta = dir.join("catalog.json");
    if !refresh && file.is_file() {
        if let Ok(text) = fs::read_to_string(&file) {
            let version = fs::read_to_string(&meta).ok()
                .and_then(|s| serde_json::from_str::<serde_json::Value>(&s).ok())
                .and_then(|v| v["version"].as_u64());
            return Ok(serde_json::json!({ "source": "cache", "version": version, "text": text }));
        }
    }
    let client = update_http_client(&app, 120)?;
    let bytes = download(&client, SONGLENGTHS, 32 * 1024 * 1024).await?;
    let text = String::from_utf8_lossy(&bytes).into_owned();
    if !text.contains("[Database]") {
        return Err("Songlengths.md5: unexpected content".into());
    }
    let version = online_version(&client).await;
    let _ = fs::create_dir_all(&dir);
    let _ = fs::write(&file, &text);
    let _ = fs::write(&meta, serde_json::json!({ "version": version }).to_string());
    Ok(serde_json::json!({ "source": "online", "version": version, "text": text }))
}

/// One tune's bytes: local folder, cache, or a mirror (then cached).
#[tauri::command]
pub async fn hvsc_fetch(app: AppHandle, path: String) -> Result<Vec<u8>, String> {
    let segments = sid_segments(&path).ok_or_else(|| format!("invalid HVSC path: {path}"))?;
    if let Some(root) = local_root(&app) {
        if let Ok(bytes) = fs::read(join_segments(&root, &segments)) {
            return Ok(bytes);
        }
    }
    let cached = join_segments(&cache_dir(&app)?.join("C64Music"), &segments);
    if let Ok(bytes) = fs::read(&cached) {
        return Ok(bytes);
    }
    let rel = segments.iter().map(|s| urlencoding::encode(s).into_owned()).collect::<Vec<_>>().join("/");
    let client = update_http_client(&app, 30)?;
    let bytes = download(&client, &rel, MAX_SID_BYTES).await?;
    if !(bytes.starts_with(b"PSID") || bytes.starts_with(b"RSID")) {
        return Err(format!("{path}: not a SID file"));
    }
    if let Some(parent) = cached.parent() {
        let _ = fs::create_dir_all(parent);
    }
    let _ = fs::write(&cached, &bytes);
    Ok(bytes)
}

/// Picks an unpacked HVSC folder (C64Music, or the folder that contains it).
#[tauri::command]
pub async fn hvsc_choose_folder(app: AppHandle) -> serde_json::Value {
    let Some(picked) = app.dialog().file().blocking_pick_folder() else {
        return serde_json::json!({ "canceled": true });
    };
    let Some(picked) = picked.into_path().ok() else {
        return serde_json::json!({ "ok": false, "error": "invalid folder" });
    };
    let root = [picked.clone(), picked.join("C64Music")].into_iter().find(|p| p.join(SONGLENGTHS).is_file());
    match root {
        Some(root) => {
            let mut cfg = read_config(&app);
            cfg["hvscPath"] = serde_json::json!(root.to_string_lossy());
            write_config(&app, &cfg);
            serde_json::json!({ "ok": true, "path": root.to_string_lossy() })
        }
        None => serde_json::json!({ "ok": false, "notHvsc": true }),
    }
}

#[tauri::command]
pub fn hvsc_clear_folder(app: AppHandle) {
    let mut cfg = read_config(&app);
    if let Some(obj) = cfg.as_object_mut() {
        obj.remove("hvscPath");
    }
    write_config(&app, &cfg);
}

/// An archive entry name ("C64Music\GAMES\x.sid") as a path below `dest`;
/// None for anything that would leave it.
fn archive_target(dest: &Path, name: &str) -> Option<PathBuf> {
    let name = name.replace('\\', "/");
    let mut path = dest.to_path_buf();
    for part in name.split('/') {
        if part.is_empty() || part == "." {
            continue;
        }
        if part == ".." || part.contains(':') || part.chars().any(|c| c.is_control()) {
            return None;
        }
        path.push(part);
    }
    (path != dest).then_some(path)
}

fn progress(app: &AppHandle, phase: &str, done: u64, total: u64) {
    let _ = app.emit("hvsc-download-progress", serde_json::json!({ "phase": phase, "done": done, "total": total }));
}

/// Unpacks the HVSC .7z into `dest` (the archive holds C64Music/…); the
/// Windows updater in C64Music/update is left out. `step(done, total)` reports progress.
fn extract_archive(archive: &Path, dest: &Path, mut step: impl FnMut(u64, u64)) -> Result<(), String> {
    let mut reader = sevenz_rust2::ArchiveReader::open(archive, sevenz_rust2::Password::empty()).map_err(|e| e.to_string())?;
    let total = reader.archive().files.len() as u64;
    let mut done = 0u64;
    let mut failure: Option<String> = None;
    reader.for_each_entries(|entry, data| {
        done += 1;
        if done % 500 == 0 || done == total {
            step(done, total);
        }
        if DOWNLOAD_CANCEL.load(Ordering::Relaxed) {
            return Ok(false);
        }
        let name = entry.name().replace('\\', "/");
        let skip = name.to_ascii_lowercase().starts_with("c64music/update/");
        match archive_target(dest, &name) {
            Some(path) if !skip && entry.is_directory() => {
                let _ = fs::create_dir_all(&path);
                Ok(true)
            }
            Some(path) if !skip => {
                if let Some(parent) = path.parent() {
                    let _ = fs::create_dir_all(parent);
                }
                let written = fs::File::create(&path).and_then(|mut f| io::copy(data, &mut f).and_then(|_| f.flush()));
                match written {
                    Ok(()) => Ok(true),
                    Err(e) => {
                        failure = Some(format!("{}: {e}", path.display()));
                        Ok(false)
                    }
                }
            }
            // a solid archive is one stream: a skipped entry still has to be read through
            _ => io::copy(data, &mut io::sink()).map(|_| true).map_err(Into::into),
        }
    }).map_err(|e| e.to_string())?;
    if let Some(err) = failure {
        return Err(err);
    }
    if DOWNLOAD_CANCEL.load(Ordering::Relaxed) {
        return Err("canceled".into());
    }
    Ok(())
}

/// Downloads the complete HVSC (.7z, ~85 MB) into a folder the user picks,
/// unpacks it there (~380 MB) and switches the player to that local folder.
#[tauri::command]
pub async fn hvsc_download_all(app: AppHandle) -> Result<serde_json::Value, String> {
    let mut dialog = app.dialog().file();
    if let Ok(dir) = app.path().app_data_dir() {
        let _ = fs::create_dir_all(&dir);
        dialog = dialog.set_directory(dir);
    }
    let Some(picked) = dialog.blocking_pick_folder() else {
        return Ok(serde_json::json!({ "canceled": true }));
    };
    let dest = picked.into_path().map_err(|e| e.to_string())?;
    if DOWNLOAD_RUNNING.swap(true, Ordering::SeqCst) {
        return Err("a download is already running".into());
    }
    DOWNLOAD_CANCEL.store(false, Ordering::SeqCst);
    let result = download_all_into(&app, &dest).await;
    DOWNLOAD_RUNNING.store(false, Ordering::SeqCst);
    result
}

async fn download_all_into(app: &AppHandle, dest: &Path) -> Result<serde_json::Value, String> {
    let client = update_http_client(app, 3600)?;
    let info = version_info(&client).await;
    let version = info.as_ref().and_then(|v| v["version"].as_u64());
    // only the official archive host, whatever the API answers
    let url = info.as_ref()
        .and_then(|v| v["complete"]["url"].as_str().map(str::to_string))
        .filter(|u| u.starts_with(ARCHIVE_HOST) && u.ends_with(".7z"))
        .or_else(|| version.map(|v| format!("{ARCHIVE_HOST}HVSC_{v}-all-of-them.7z")))
        .ok_or("the HVSC version is unknown")?;
    let archive = dest.join(url.rsplit('/').next().unwrap_or("HVSC.7z"));
    let partial = archive.with_extension("7z.part");

    let mut resp = client.get(&url).send().await.and_then(|r| r.error_for_status()).map_err(|e| e.to_string())?;
    let total = resp.content_length().unwrap_or(0);
    let mut out = fs::File::create(&partial).map_err(|e| e.to_string())?;
    let mut received = 0u64;
    let mut last_step = u64::MAX;
    while let Some(chunk) = resp.chunk().await.map_err(|e| e.to_string())? {
        if DOWNLOAD_CANCEL.load(Ordering::Relaxed) {
            drop(out);
            let _ = fs::remove_file(&partial);
            return Ok(serde_json::json!({ "canceled": true }));
        }
        out.write_all(&chunk).map_err(|e| e.to_string())?;
        received += chunk.len() as u64;
        if received / (512 * 1024) != last_step {
            last_step = received / (512 * 1024);
            progress(app, "download", received, total);
        }
    }
    out.flush().map_err(|e| e.to_string())?;
    drop(out);
    if total > 0 && received != total {
        let _ = fs::remove_file(&partial);
        return Err(format!("incomplete download ({received} / {total} bytes)"));
    }
    let _ = fs::remove_file(&archive);
    fs::rename(&partial, &archive).map_err(|e| e.to_string())?;

    let (handle, src, target) = (app.clone(), archive.clone(), dest.to_path_buf());
    let extracted = tauri::async_runtime::spawn_blocking(move || {
        extract_archive(&src, &target, |done, total| progress(&handle, "extract", done, total))
    })
    .await
    .map_err(|e| e.to_string())?;
    let _ = fs::remove_file(&archive);
    if let Err(e) = extracted {
        return if DOWNLOAD_CANCEL.load(Ordering::Relaxed) { Ok(serde_json::json!({ "canceled": true })) } else { Err(e) };
    }
    let root = dest.join("C64Music");
    if !root.join(SONGLENGTHS).is_file() {
        return Err("the archive has no C64Music/DOCUMENTS/Songlengths.md5".into());
    }
    let mut cfg = read_config(app);
    cfg["hvscPath"] = serde_json::json!(root.to_string_lossy());
    write_config(app, &cfg);
    Ok(serde_json::json!({ "ok": true, "path": root.to_string_lossy(), "version": version }))
}

#[tauri::command]
pub fn hvsc_cancel_download() {
    DOWNLOAD_CANCEL.store(true, Ordering::SeqCst);
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn sid_paths_stay_inside_the_collection() {
        assert_eq!(sid_segments("/MUSICIANS/H/Hubbard_Rob/Commando.sid"), Some(vec!["MUSICIANS", "H", "Hubbard_Rob", "Commando.sid"]));
        assert!(sid_segments("/GAMES/0-9/1942.sid").is_some());
        assert!(sid_segments("MUSICIANS/x.sid").is_none());
        assert!(sid_segments("/MUSICIANS/../../etc/x.sid").is_none());
        assert!(sid_segments("/MUSICIANS//x.sid").is_none());
        assert!(sid_segments("/C:/x.sid").is_none());
        assert!(sid_segments("/DOCUMENTS/STIL.txt").is_none());
        assert!(sid_segments("/a\\b.sid").is_none());
    }

    #[test]
    fn archive_entries_stay_inside_the_target() {
        let dest = Path::new("hvsc");
        assert_eq!(archive_target(dest, "C64Music\\GAMES\\x.sid"), Some(dest.join("C64Music").join("GAMES").join("x.sid")));
        assert_eq!(archive_target(dest, "C64Music/DOCUMENTS"), Some(dest.join("C64Music").join("DOCUMENTS")));
        assert!(archive_target(dest, "../evil.sid").is_none());
        assert!(archive_target(dest, "C64Music/../../evil").is_none());
        assert!(archive_target(dest, "C:/Windows/evil").is_none());
        assert!(archive_target(dest, "").is_none());
    }

    // Unpacks an already downloaded archive:
    // HVSC_ARCHIVE=…/HVSC_85-all-of-them.7z cargo test --lib real_hvsc -- --ignored
    #[test]
    #[ignore]
    fn real_hvsc_archive_unpacks() {
        let Ok(archive) = std::env::var("HVSC_ARCHIVE") else { return };
        let dest = std::env::temp_dir().join("va-hvsc-unpack-test");
        let _ = fs::remove_dir_all(&dest);
        let mut last = (0, 0);
        extract_archive(Path::new(&archive), &dest, |done, total| last = (done, total)).unwrap();
        assert_eq!(last.0, last.1);
        assert!(dest.join("C64Music").join(SONGLENGTHS).is_file());
        assert!(dest.join("C64Music/MUSICIANS/H/Hubbard_Rob/Commando.sid").is_file());
        assert!(!dest.join("C64Music/update").exists());
        let _ = fs::remove_dir_all(&dest);
    }
}
