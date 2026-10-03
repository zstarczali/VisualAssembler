const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");

function slice(startMarker, endMarker) {
  const start = appJs.indexOf(startMarker);
  const end = appJs.indexOf(endMarker, start);
  assert.ok(start > 0 && end > start, "slice not found: " + startMarker);
  return appJs.slice(start, end);
}

// The level editor core runs from `const _LV_SW` up to `function setupLevelEditor(`;
// it needs the VA bin-meta helpers and a few Map Editor constants.
function loadLv() {
  const context = {
    _ME_COLS: 40, _ME_ROWS: 25, _ME_EMPTY: 0x20,
    _CE_COLORS: Array.from({ length: 16 }, (_, i) => "#" + (i * 0x111111).toString(16).padStart(6, "0")),
    t: (k) => k,
    tf: (k, v) => k + JSON.stringify(v),
    crypto: { randomUUID: (() => { let n = 0; return () => "id" + (++n); })() },
    TextEncoder, TextDecoder,
    document: { getElementById: () => null, querySelector: () => null },
  };
  vm.createContext(context);
  vm.runInContext(
    slice("const _VA_BIN_META_MAGIC", "/* Save raw bytes") +
    slice("const _LV_SW = 320", "function setupLevelEditor(") +
    "\n_lvSetSettings(_lvDefaultSettings());" +
    "\nthis.api = {" +
    " make: (fill, color) => { const s = _lvNewScreen('s', new Uint8Array(1000).fill(fill), new Uint8Array(1000).fill(color ?? 1), null); _lvScreens.push(s); return s.id; }," +
    " add: function(fill, color) { const id = this.make(fill, color); _lvPlace(id); return id; }," +
    " place: _lvPlace, setLayout: _lvSetLayout, swap: _lvSwapSlots, remove: _lvRemoveSlot, grid: _lvGridResize," +
    " exportData: _lvExportData, exportAsm: _lvExportAsm, save: _lvBuildLevelFile, load: _lvLoadLevelFile," +
    " setDir: (d) => { _lvDir = d; }, setSel: (i) => { _lvSel = i; }," +
    " state: () => ({ w: _lvW, h: _lvH, cells: JSON.parse(JSON.stringify(_lvCells)), layout: _lvLayout, dir: _lvDir, screens: _lvScreens.length }) };",
    context);
  return context.api;
}

test("vertical layout stacks screens and inserts after the selected slot", () => {
  const lv = loadLv();
  const a = lv.add(1), b = lv.add(2);
  lv.setSel(0);
  const c = lv.add(3);
  const st = JSON.parse(JSON.stringify(lv.state()));
  assert.equal(st.w, 1);
  assert.equal(st.h, 3);
  assert.deepEqual(st.cells, [a, c, b]);
});

test("vertical export scrolling up streams rows bottom-first", () => {
  const lv = loadLv();
  lv.add(1); lv.add(2);                     // screen 1 on top, screen 2 below
  lv.setDir("up");
  const d = lv.exportData();
  assert.equal(d.cols, 40);
  assert.equal(d.rows, 50);
  assert.equal(d.unit, "row");
  assert.equal(d.screen[0], 2);             // first row = bottom of the level
  assert.equal(d.screen[d.screen.length - 1], 1);
  lv.setDir("down");
  assert.equal(lv.exportData().screen[0], 1);
});

test("horizontal export is column-major in scroll order", () => {
  const lv = loadLv();
  lv.setLayout("horizontal");
  lv.add(1); lv.add(2);
  const st = lv.state();
  assert.deepEqual([st.w, st.h], [2, 1]);
  lv.setDir("right");
  let d = lv.exportData();
  assert.equal(d.unit, "col");
  assert.equal(d.chunk, 25);
  assert.equal(d.screen.length, 80 * 25);
  assert.equal(d.screen[0], 1);
  assert.equal(d.screen[40 * 25], 2);       // column 40 starts the second screen
  lv.setDir("left");
  d = lv.exportData();
  assert.equal(d.screen[0], 2);
});

test("grid keeps empty slots and exports a row-major map", () => {
  const lv = loadLv();
  lv.setLayout("grid");                     // empty grid starts as 2×1
  lv.grid(0, 1);                            // 2 rows
  lv.place(lv.make(5), 3);
  const st = lv.state();
  assert.deepEqual([st.w, st.h], [2, 2]);
  assert.equal(st.cells.filter(Boolean).length, 1);
  const d = lv.exportData();
  assert.equal(d.cols, 80);
  assert.equal(d.rows, 50);
  assert.equal(d.screen[25 * 80 + 40], 5);  // bottom-right slot
});

test("switching grid → vertical drops empty slots", () => {
  const lv = loadLv();
  lv.setLayout("grid");
  lv.grid(2, 1);
  const id = lv.add(7);
  lv.setLayout("vertical");
  const st = JSON.parse(JSON.stringify(lv.state()));
  assert.deepEqual(st.cells, [id]);
  assert.equal(st.h, 1);
  assert.ok(["up", "down"].includes(st.dir));
});

test("level file round-trips layout, cells and screen data", () => {
  const a = loadLv();
  a.setLayout("grid");

  a.place(a.make(9, 3), 1);
  a.setDir("left");
  const bytes = a.save();

  const b = loadLv();
  assert.equal(b.load(bytes), true);
  const st = b.state();
  assert.equal(st.layout, "grid");
  assert.equal(st.dir, "left");
  assert.deepEqual([st.w, st.h], [2, 1]);
  assert.equal(st.cells[0], null);
  const d = b.exportData();
  assert.equal(d.screen[40], 9);
  assert.equal(d.color[40], 3);
  assert.equal(b.load(new Uint8Array(10)), false);
});

test("asm export emits labels, constants and one .byte line per row", () => {
  const lv = loadLv();
  lv.add(0x41);
  const asm = lv.exportAsm();
  assert.match(asm, /\.const LEVEL_COLS = 40/);
  assert.match(asm, /\.const LEVEL_ROWS = 25/);
  assert.match(asm, /^level_screen:$/m);
  assert.match(asm, /^level_color:$/m);
  assert.equal((asm.match(/\.byte /g) || []).length, 50);
});

test("switching vertical → grid makes a near-square grid that fills sideways", () => {
  const lv = loadLv();
  lv.add(1); lv.add(2); lv.add(3); lv.add(4); lv.add(5);
  lv.setLayout("grid");
  let st = JSON.parse(JSON.stringify(lv.state()));
  assert.deepEqual([st.w, st.h], [3, 2]);
  lv.add(6);                                // fills the free slot in row 2
  st = JSON.parse(JSON.stringify(lv.state()));
  assert.deepEqual([st.w, st.h], [3, 2]);
  assert.equal(st.cells.filter(Boolean).length, 6);
});
