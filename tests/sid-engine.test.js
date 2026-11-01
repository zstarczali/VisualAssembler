const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const loadApp = require("./helpers/load-app");

const www = path.join(__dirname, "..", "www");
const read = (file) => fs.readFileSync(path.join(www, file), "utf8");

test("the WebSID player is gone from the app", () => {
  assert.ok(!fs.existsSync(path.join(www, "lib", "websid")));
  const html = read("index.html");
  assert.ok(!html.includes("lib/websid"), "script tags");
  assert.ok(!html.includes('value="websid"'), "engine option");
  assert.ok(!html.includes("wothke"), "About credit");
  assert.ok(!/ScriptNodePlayer|SIDBackendAdapter|_webSid|_sidStream/.test(read("app.js")));
});

test("the SID engine: reSID by default, VA SID Core by choice, a saved WebSID falls back", () => {
  const engineAfterLoad = (saved) => {
    const app = loadApp();
    if (saved) app.localStorage.setItem("c64va-sid-preview-engine", saved);
    else app.localStorage.removeItem("c64va-sid-preview-engine");
    return app.run(`_sidPreviewEngine = "resid"; _sidLoadPreviewSettings(); _sidPreviewEngine`);
  };
  assert.equal(engineAfterLoad(null), "resid");
  assert.equal(engineAfterLoad("websid"), "resid");
  assert.equal(engineAfterLoad("va-core"), "va-core");
  assert.equal(engineAfterLoad("resid"), "resid");
});

test("the engine's name follows the setting, and the backend gets it", async () => {
  const app = loadApp();
  app.run(`
    globalThis.__payloads = [];
    window.electronAPI = { renderSidPreview: async (payload) => { __payloads.push(payload); return "AAAA"; } };
    _sidPreviewModel = "6581";
  `);
  const render = (engine) => app.run(`_sidPreviewEngine = ${JSON.stringify(engine)}; _sidRenderNativeFrames([new Array(26).fill(0)], 44100)`);
  await render("resid");
  assert.equal(app.run(`__payloads[0].engine`), "resid");
  assert.equal(app.run(`_sidEngineLabel()`), "reSID (MOS 6581)");
  await render("va-core");
  assert.equal(app.run(`__payloads[1].engine`), "va-core");
  assert.match(app.run(`_sidEngineLabel()`), /^VA SID Core v[\d.]+ \(MOS 6581\)$/);
});

test("the backend's engine names match the setting's values", () => {
  const rust = fs.readFileSync(path.join(__dirname, "..", "src-tauri", "src", "sid_chip.rs"), "utf8");
  assert.ok(rust.includes('name.eq_ignore_ascii_case("resid")'));
  const html = read("index.html");
  assert.ok(html.includes('<option value="resid">') && html.includes('<option value="va-core">'));
});

test("the new SID texts exist in all seven languages", () => {
  const i18n = read("i18n.js");
  for (const key of ["sidPreviewEngineResid", "sidPlayerNeedsDesktop"]) {
    assert.equal(i18n.split(`"${key}":`).length - 1, 7, key);
  }
  assert.ok(!i18n.includes("sidPreviewEngineWebSid"));
});
