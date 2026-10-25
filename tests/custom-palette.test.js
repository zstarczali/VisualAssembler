const test = require("node:test");
const assert = require("node:assert/strict");
const loadApp = require("./helpers/load-app");

const app = loadApp();
const COLORS = Array.from({ length: 16 }, (_, i) => (i * 0x101010 + 0x030201) & 0xFFFFFF);
const run = (code) => JSON.parse(JSON.stringify(app.run(code)));

test("palette text files: GIMP .gpl, VICE .vpl and hex lists give 16 RGB values", () => {
  app.__colors = COLORS;
  const gpl = "GIMP Palette\nName: C64\nColumns: 4\n#\n" + COLORS.map((v, i) => `${v >> 16} ${(v >> 8) & 255} ${v & 255}\tc${i}`).join("\n");
  app.__gpl = gpl;
  assert.deepEqual(run("_palParseText(__gpl)"), COLORS);
  assert.deepEqual(run("_palParseText(_palToVpl(__colors))"), COLORS, "the VICE export reads back");
  app.__hex = COLORS.map((v) => "$" + v.toString(16).padStart(6, "0")).join(", ");
  assert.deepEqual(run("_palParseText(__hex)"), COLORS);
  assert.equal(run("_palParseText('#000000 #ffffff')"), null, "fewer than 16 colours");
});

test("Photoshop .act round-trips and keeps the first 16 entries", () => {
  app.__colors = COLORS;
  const act = run("Array.from(_palToAct(__colors))");
  assert.equal(act.length, 772);
  assert.equal(act[769], 16);
  app.__act = act;
  assert.deepEqual(run("_palParseAct(Uint8Array.from(__act))"), COLORS);
  assert.equal(run("_palParseAct(new Uint8Array(30))"), null);
});

test("the custom palette is what the editors draw with", () => {
  app.__colors = COLORS;
  const out = run(`(() => {
    _C64_PALETTES.custom = __colors.slice();
    _setEditorPalette("custom");
    const now = { name: _editorPalette, ce: _CE_COLORS.slice(), png: _hgPngPalette("custom") };
    _setEditorPalette("colodore");
    return now;
  })()`);
  assert.equal(out.name, "custom");
  assert.deepEqual(out.ce, COLORS.map((v) => "#" + v.toString(16).padStart(6, "0")));
  assert.deepEqual(out.png, COLORS);
  assert.equal(run("_palIsValid([1, 2, 3])"), false);
  assert.equal(run("_palIsValid(_C64_PALETTES.colodore)"), true);
});
