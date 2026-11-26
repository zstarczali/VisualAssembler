// Data files clicked in a project tree open in their own editor (_studioOpenAsset): a Koala picture in the Hi-Res editor, a charset in the char editor.
const test = require("node:test");
const assert = require("node:assert/strict");
const loadApp = require("./helpers/load-app");

const app = loadApp();

test("only .koa / .koala files belong to the Hi-Res editor", () => {
  const r = app.run(`["pic.koa", "PIC.KOALA", "a/b/title.koa", "pic.png", "koa.bin", "main.asm"].map((n) => _studioAssetEditor(n))`);
  assert.deepEqual([...r], ["hires", "hires", "hires", "", "", ""]);
});

const open = (bytes, path = "C:/p/pic.koa") => app.run(`(async () => {
  const log = [];
  window.electronAPI = { readBinFile: async (p) => { log.push("read " + p); return { ok: true, bytes: ${JSON.stringify(bytes)} }; } };
  document = { getElementById: (id) => (id === "hires-editor-btn" ? { click() { log.push("editor"); } } : null) };
  _hgImportKoala = (b) => { log.push("koala " + b.length); return b.length === 10003 || b.length === 10001; };
  showViceToast = (msg, err) => log.push("toast " + !!err);
  const handled = await _studioOpenAsset(${JSON.stringify(path)});
  return { handled, log };
})()`);

test("a Koala file is read, the Hi-Res editor opens and imports it", async () => {
  const r = await open(Array(10003).fill(0));
  assert.equal(r.handled, true);
  assert.deepEqual([...r.log], ["read C:/p/pic.koa", "editor", "koala 10003"]);
});

test("a file that is not a Koala picture opens the editor with a warning", async () => {
  const r = await open([1, 2, 3]);
  assert.deepEqual([...r.log], ["read C:/p/pic.koa", "editor", "koala 3", "toast true"]);
});

test("other files are left to the caller", async () => {
  const r = await open([], "C:/p/pic.png");
  assert.equal(r.handled, false);
  assert.deepEqual([...r.log], []);
});

// Charsets: .64c / .chr / .fnt, or a small .bin named or kept as a font, open in the char editor.
test("charset files are told by their extension, or a .bin by its name / folder and size", () => {
  const r = app.run(`[
    _studioAssetEditor("C:/g/font.64c"), _studioAssetEditor("C:/g/x.chr"), _studioAssetEditor("C:/g/x.fnt"),
    _studioAssetEditor("C:/g/fonts/font03.bin", 513), _studioAssetEditor("C:/g/charset/level.bin", 2048),
    _studioAssetEditor("C:/g/font.bin", 9000), _studioAssetEditor("C:/g/sprites.bin", 512), _studioAssetEditor("C:/g/music.bin")
  ]`);
  assert.deepEqual([...r], ["font", "font", "font", "font", "font", "", "", ""]);
});

test("a load address in front of a charset is dropped, a first character is not", () => {
  const r = app.run(`[
    _ceCharsetData(new Uint8Array([0x00, 0x20, ...Array(511).fill(1)])).length,   // $2000 + 64 chars less the last 0
    _ceCharsetData(new Uint8Array([0x00, 0x38, ...Array(2048).fill(1)])).length,  // $3800 + 256 chars
    _ceCharsetData(new Uint8Array([0x00, 0x3c, ...Array(509).fill(1)])).length,   // 511, no address: '@' starts 00 3C
    _ceCharsetData(new Uint8Array(2048)).length                                    // a whole raw charset
  ]`);
  assert.deepEqual([...r], [511, 2048, 511, 2048]);
});
