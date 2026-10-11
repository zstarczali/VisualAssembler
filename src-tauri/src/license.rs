// ── License (full / light version) ──────────────────────────────────────────
//
// A serial is the Ed25519 signature of "c64va-license-v1:<email>" (email
// trimmed, lower case), written as "VA1-" + base64url (no padding). Only the
// public key is in the app; serials are made with scripts/keygen.js and the
// private key kept outside the repository. Without a valid email / serial pair
// the app runs as the light version: the backend refuses the commands that
// write builds or send them to hardware, the frontend locks the editors.

use base64::Engine;
use ed25519_dalek::{Signature, Verifier, VerifyingKey};

const LICENSE_PUBLIC_KEY: [u8; 32] = [
    0xa9, 0x9f, 0xc5, 0x49, 0x29, 0x1c, 0xee, 0x7d, 0xe2, 0xda, 0xb9, 0x21, 0xfb, 0x27, 0x20, 0x33,
    0xf1, 0x69, 0x58, 0x44, 0xde, 0x2f, 0xee, 0xa7, 0x1f, 0x36, 0xc2, 0x12, 0x66, 0x37, 0x5a, 0x15,
];

pub const LIGHT_ERROR: &str = "LICENSE_REQUIRED: this feature is available in the full version.";

pub fn normalize_email(email: &str) -> String {
    email.trim().to_lowercase()
}

fn verify_with(public_key: &[u8; 32], email: &str, serial: &str) -> bool {
    let serial: String = serial.chars().filter(|c| !c.is_whitespace()).collect();
    let Some(sig_b64) = serial.strip_prefix("VA1-") else { return false };
    let Ok(sig_bytes) = base64::engine::general_purpose::URL_SAFE_NO_PAD.decode(sig_b64) else { return false };
    let Ok(sig_arr) = <[u8; 64]>::try_from(sig_bytes.as_slice()) else { return false };
    let Ok(key) = VerifyingKey::from_bytes(public_key) else { return false };
    let email = normalize_email(email);
    if email.is_empty() || !email.contains('@') {
        return false;
    }
    let message = format!("c64va-license-v1:{email}");
    key.verify(message.as_bytes(), &Signature::from_bytes(&sig_arr)).is_ok()
}

pub fn verify(email: &str, serial: &str) -> bool {
    verify_with(&LICENSE_PUBLIC_KEY, email, serial)
}

/// The stored pair from the config ("license": {"email", "serial"}), if it verifies.
pub fn licensed_email(cfg: &serde_json::Value) -> Option<String> {
    let email = cfg["license"]["email"].as_str()?;
    let serial = cfg["license"]["serial"].as_str()?;
    verify(email, serial).then(|| normalize_email(email))
}

#[cfg(test)]
mod tests {
    use super::*;

    // Test key pair only (not the release key): serial signed for test.user@example.com.
    const TEST_PK: [u8; 32] = [
        177, 45, 243, 144, 250, 150, 184, 77, 165, 119, 156, 34, 26, 46, 125, 11, 33, 200, 126, 149,
        68, 94, 68, 222, 19, 108, 61, 86, 38, 169, 190, 202,
    ];
    const TEST_SERIAL: &str =
        "VA1-8JWKRYu1-XA6Z4fbcv_MlXuyyBvWn2UUwTaHEjVP6lTLr7KVJ7sKLlIoQDTUWZT6-ARQEVYCVMZelydZvL7ZDw";

    #[test]
    fn accepts_the_signed_email_case_and_space_insensitive() {
        assert!(verify_with(&TEST_PK, "test.user@example.com", TEST_SERIAL));
        assert!(verify_with(&TEST_PK, "  Test.User@Example.COM ", TEST_SERIAL));
        assert!(verify_with(&TEST_PK, "test.user@example.com", &format!(" {} ", TEST_SERIAL.replace("VA1-", "VA1- "))));
    }

    #[test]
    fn rejects_other_emails_tampered_serials_and_other_keys() {
        assert!(!verify_with(&TEST_PK, "other@example.com", TEST_SERIAL));
        let mut bad = TEST_SERIAL.to_string();
        bad.replace_range(10..11, if &TEST_SERIAL[10..11] == "A" { "B" } else { "A" });
        assert!(!verify_with(&TEST_PK, "test.user@example.com", &bad));
        assert!(!verify_with(&TEST_PK, "test.user@example.com", "VA1-short"));
        assert!(!verify_with(&TEST_PK, "test.user@example.com", &TEST_SERIAL[4..]));
        assert!(!verify(&"test.user@example.com", TEST_SERIAL));
    }

    #[test]
    fn reads_the_stored_pair_from_the_config() {
        assert_eq!(licensed_email(&serde_json::json!({})), None);
        assert_eq!(licensed_email(&serde_json::json!({ "license": { "email": "a@b.c", "serial": "VA1-x" } })), None);
    }
}
