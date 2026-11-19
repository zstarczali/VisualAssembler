const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");

test("VA SID Core version matches the Settings label", (t) => {
  const rust = require("./helpers/va-sid-source.js").vaSidSource("sid_core.rs");
  if (rust === null) return t.skip("va-sid source not found");
  const app = fs.readFileSync(path.join(root, "www", "app.js"), "utf8");
  const html = fs.readFileSync(path.join(root, "www", "index.html"), "utf8");
  const version = rust.match(/pub(?:\(crate\))? const VERSION: &str = "([^"]+)";/)?.[1];
  assert.equal(version, "1.3");
  assert.ok(app.includes(`var _VA_SID_CORE_VERSION = "${version}";`));
  assert.ok(app.includes('t("sidPreviewEngineVaCore") + " v" + _VA_SID_CORE_VERSION'));
  assert.ok(html.includes(`VA SID Core (Rust) v${version}`));
});
