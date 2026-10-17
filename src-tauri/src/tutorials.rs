// User lessons made with the Tutorial Editor: one JSON file per lesson in the
// app config dir's tutorials/ folder (format "va-tutorial"). The frontend turns
// them into guided tours; here they are only listed, saved and deleted.
// Published lessons live on the product site (lessons/index.php lists them).

use std::fs;
use std::path::PathBuf;

use tauri::{AppHandle, Manager};
use tauri_plugin_opener::OpenerExt;

use super::update_http_client;

const ONLINE_LESSONS: &str = "https://www.c64va.pro/lessons/";

fn tutorials_dir(app: &AppHandle) -> Result<PathBuf, String> {
    app.path().app_config_dir().map(|d| d.join("tutorials")).map_err(|e| e.to_string())
}

/// Lesson ids become file names: letters, digits, '-' and '_' only.
fn valid_id(id: &str) -> bool {
    !id.is_empty() && id.len() <= 64 && id.bytes().all(|b| b.is_ascii_alphanumeric() || b == b'-' || b == b'_')
}

#[tauri::command]
pub fn list_user_tutorials(app: AppHandle) -> serde_json::Value {
    let Ok(dir) = tutorials_dir(&app) else {
        return serde_json::json!({ "ok": false, "lessons": [] });
    };
    let mut paths: Vec<PathBuf> = fs::read_dir(&dir)
        .map(|entries| entries.filter_map(|e| e.ok().map(|e| e.path())).collect())
        .unwrap_or_default();
    paths.retain(|p| p.extension().and_then(|e| e.to_str()).is_some_and(|e| e.eq_ignore_ascii_case("json")));
    paths.sort();
    let lessons: Vec<serde_json::Value> = paths
        .iter()
        .filter_map(|p| serde_json::from_str::<serde_json::Value>(&fs::read_to_string(p).ok()?).ok())
        .filter(|v| v["format"] == "va-tutorial" && v["id"].as_str().is_some_and(valid_id))
        .collect();
    serde_json::json!({ "ok": true, "dir": dir.to_string_lossy(), "lessons": lessons })
}

#[tauri::command]
pub fn save_user_tutorial(app: AppHandle, lesson: serde_json::Value) -> Result<(), String> {
    let id = lesson["id"].as_str().filter(|id| valid_id(id)).ok_or("invalid lesson id")?;
    if lesson["format"] != "va-tutorial" {
        return Err("not a va-tutorial lesson".into());
    }
    let dir = tutorials_dir(&app)?;
    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    let text = serde_json::to_string_pretty(&lesson).map_err(|e| e.to_string())?;
    fs::write(dir.join(format!("{id}.json")), text).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delete_user_tutorial(app: AppHandle, id: String) -> Result<(), String> {
    if !valid_id(&id) {
        return Err("invalid lesson id".into());
    }
    let path = tutorials_dir(&app)?.join(format!("{id}.json"));
    if path.exists() {
        fs::remove_file(path).map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
pub async fn open_tutorials_folder(app: AppHandle) -> Result<(), String> {
    let dir = tutorials_dir(&app)?;
    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    app.opener().open_path(dir.to_string_lossy().as_ref(), None::<String>).map_err(|e| e.to_string())
}

/// A published lesson's file name: "name.vatut", nothing that leaves the folder.
fn valid_lesson_file(file: &str) -> bool {
    file.strip_suffix(".vatut").is_some_and(|stem| {
        !stem.is_empty() && stem.len() <= 80 && stem.bytes().all(|b| b.is_ascii_alphanumeric() || b == b'-' || b == b'_')
    })
}

async fn fetch_json(app: &AppHandle, url: &str, limit: usize) -> Result<serde_json::Value, String> {
    let client = update_http_client(app, 30)?;
    let resp = client.get(url).send().await.and_then(|r| r.error_for_status()).map_err(|e| e.to_string())?;
    let bytes = resp.bytes().await.map_err(|e| e.to_string())?;
    if bytes.len() > limit {
        return Err("response too large".into());
    }
    serde_json::from_slice(&bytes).map_err(|e| e.to_string())
}

/// The lessons published on the product site.
#[tauri::command]
pub async fn list_online_tutorials(app: AppHandle) -> Result<serde_json::Value, String> {
    let index = fetch_json(&app, ONLINE_LESSONS, 2 * 1024 * 1024).await?;
    if index["format"] != "va-lesson-index" {
        return Err("unexpected lesson list".into());
    }
    Ok(index)
}

/// One published lesson (not saved: the frontend stores it like its own).
#[tauri::command]
pub async fn download_online_tutorial(app: AppHandle, file: String) -> Result<serde_json::Value, String> {
    if !valid_lesson_file(&file) {
        return Err("invalid lesson file".into());
    }
    let lesson = fetch_json(&app, &format!("{ONLINE_LESSONS}{file}"), 1024 * 1024).await?;
    if lesson["format"] != "va-tutorial" || !lesson["id"].as_str().is_some_and(valid_id) || !lesson["items"].is_array() {
        return Err("not a Visual Assembler lesson".into());
    }
    Ok(lesson)
}

#[cfg(test)]
mod tests {
    use super::{valid_id, valid_lesson_file};

    #[test]
    fn published_lesson_files_stay_in_the_folder() {
        assert!(valid_lesson_file("first-border.vatut"));
        assert!(valid_lesson_file("Lesson_01.vatut"));
        assert!(!valid_lesson_file(".vatut"));
        assert!(!valid_lesson_file("../x.vatut"));
        assert!(!valid_lesson_file("a/b.vatut"));
        assert!(!valid_lesson_file("index.php"));
        assert!(!valid_lesson_file("x.vatut?y=1"));
    }

    #[test]
    fn lesson_ids_are_safe_file_names() {
        assert!(valid_id("user-1a2b"));
        assert!(valid_id("my_lesson_01"));
        assert!(!valid_id(""));
        assert!(!valid_id("../x"));
        assert!(!valid_id("a/b"));
        assert!(!valid_id("a.json"));
        assert!(!valid_id(&"x".repeat(65)));
    }
}
