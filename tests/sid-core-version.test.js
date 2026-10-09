const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");

test("VA SID Core version matches the Settings label", () => {
  const rust = fs.readFileSync(path.join(root, "src-tauri", "src", "sid_core.rs"), "utf8");
  const app = fs.readFileSync(path.join(root, "www", "app.js"), "utf8");
  const html = fs.readFileSync(path.join(root, "www", "index.html"), "utf8");
  const version = rust.match(/pub\(crate\) const VERSION: &str = "([^"]+)";/)?.[1];
  assert.equal(version, "1.1");
  assert.ok(app.includes(`var _VA_SID_CORE_VERSION = "${version}";`));
  assert.ok(app.includes('t("sidPreviewEngineVaCore") + " v" + _VA_SID_CORE_VERSION'));
  assert.ok(html.includes(`VA SID Core (Rust) v${version}`));
});
