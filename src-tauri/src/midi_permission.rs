//! WebView2 asks the user about Web MIDI on every `requestMIDIAccess()`, in a web
//! dialog of its own. The page is the app itself and connects only when the Connect
//! MIDI button is pressed, so that request is granted here. Every other permission
//! stays with WebView2. macOS and Linux web views have no Web MIDI to ask about.

#[cfg(windows)]
pub fn allow_without_prompt(window: &tauri::WebviewWindow) {
    use webview2_com::Microsoft::Web::WebView2::Win32::{
        COREWEBVIEW2_PERMISSION_KIND, COREWEBVIEW2_PERMISSION_KIND_MIDI_SYSTEM_EXCLUSIVE_MESSAGES,
        COREWEBVIEW2_PERMISSION_KIND_UNKNOWN_PERMISSION, COREWEBVIEW2_PERMISSION_STATE_ALLOW,
    };
    use webview2_com::PermissionRequestedEventHandler;

    let result = window.with_webview(|webview| unsafe {
        let Ok(core) = webview.controller().CoreWebView2() else {
            return;
        };
        let handler = PermissionRequestedEventHandler::create(Box::new(|_, args| {
            let Some(args) = args else {
                return Ok(());
            };
            let mut kind: COREWEBVIEW2_PERMISSION_KIND = COREWEBVIEW2_PERMISSION_KIND_UNKNOWN_PERMISSION;
            args.PermissionKind(&mut kind)?;
            if kind == COREWEBVIEW2_PERMISSION_KIND_MIDI_SYSTEM_EXCLUSIVE_MESSAGES {
                args.SetState(COREWEBVIEW2_PERMISSION_STATE_ALLOW)?;
            }
            Ok(())
        }));
        let mut token = 0i64;
        if let Err(error) = core.add_PermissionRequested(&handler, &mut token) {
            eprintln!("MIDI permission handler: {error}");
        }
    });
    if let Err(error) = result {
        eprintln!("MIDI permission handler: {error}");
    }
}

#[cfg(not(windows))]
pub fn allow_without_prompt(_window: &tauri::WebviewWindow) {}
