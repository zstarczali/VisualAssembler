const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");
const { assemble, cpu } = require("./mini6502");

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
    " addObj: (type, x, y, p) => { const o = _lvObjNew(type, x, y, p); _lvObjects.push(o); return o; }," +
    " objects: () => JSON.parse(JSON.stringify(_lvObjects)), ordered: () => _lvObjOrdered().map((o) => o.type + ':' + o.x + ',' + o.y)," +
    " snapshot: _lvSnapshot, restore: _lvRestore," +
    " setAttr: (code, flags) => { _lvAttr[code] = flags; }, attr: () => Array.from(_lvAttr), edges: _lvEdgeIssues," +
    " rle: _lvRle, unrleAsm: _lvRleUnpackAsm, testAsm: _lvTestProgramAsm, camera: _lvTestCamera," +
    " screenAt: (i) => _lvScreenById(_lvCells[i]), screens: () => _lvScreens, setBorder: (c) => { _lvBorder = c; }," +
    " border: () => _lvBorder, colorsAsm: _lvScrColorsAsm," +
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

test("objects are ordered the way the scroller meets them", () => {
  const lv = loadLv();
  lv.add(1); lv.add(2);                     // vertical, 320×400 px
  lv.addObj(1, 16, 40); lv.addObj(2, 100, 360); lv.addObj(0, 8, 360);
  lv.addObj(3, 500, 10);                    // outside the level
  lv.setDir("up");
  assert.deepEqual(Array.from(lv.ordered()), ["0:8,360", "2:100,360", "1:16,40"]);
  lv.setDir("down");
  assert.deepEqual(Array.from(lv.ordered()), ["1:16,40", "0:8,360", "2:100,360"]);
  lv.setLayout("horizontal");               // 640×200 px
  lv.setDir("left");
  assert.deepEqual(Array.from(lv.ordered()), ["3:500,10", "1:16,40"]);   // y = 360 is outside the 200 px tall level
});

test("objects round-trip through the level file and undo", () => {
  const a = loadLv();
  a.add(1); a.add(2);
  a.addObj(1, 16, 40, 7); a.addObj(0, 8, 360, 0);
  const bytes = a.save();
  const b = loadLv();
  assert.equal(b.load(bytes), true);
  const objs = JSON.parse(JSON.stringify(b.objects().map((o) => [o.type, o.x, o.y, o.param])));
  assert.deepEqual(objs, [[0, 8, 360, 0], [1, 16, 40, 7]]);   // saved in scroll order (up)
  const snap = b.snapshot();
  b.addObj(2, 0, 0);
  b.restore(snap);
  assert.equal(b.objects().length, 2);
});

test("asm export adds the LEVEL_OBJ_* tables", () => {
  const lv = loadLv();
  lv.add(1); lv.add(2);
  lv.addObj(1, 300, 264, 5); lv.addObj(0, 8, 16);
  lv.setDir("down");
  const asm = lv.exportAsm();
  assert.match(asm, /\.const LEVEL_OBJ_COUNT = 2/);
  assert.match(asm, /\.const LEVEL_OBJ_T_ENEMY = 1/);
  assert.match(asm, /\.const LEVEL_START_X = 8/);
  assert.match(asm, /^LEVEL_OBJ_X_LO:\n {4}\.byte \$08, \$2C$/m);
  assert.match(asm, /^LEVEL_OBJ_X_HI:\n {4}\.byte \$00, \$01$/m);
  assert.match(asm, /^LEVEL_OBJ_Y_HI:\n {4}\.byte \$00, \$01$/m);
  assert.match(asm, /^LEVEL_OBJ_PARAM:\n {4}\.byte \$00, \$05$/m);
  const empty = loadLv();
  empty.add(1);
  assert.doesNotMatch(empty.exportAsm(), /LEVEL_OBJ/);
});

test("character attributes: asm table, save / load and undo", () => {
  const a = loadLv();
  a.add(0x20);
  assert.doesNotMatch(a.exportAsm(), /LEVEL_ATTR/);
  a.setAttr(0xA0, 1); a.setAttr(0x41, 4 | 8);
  const asm = a.exportAsm();
  assert.match(asm, /\.const LEVEL_ATTR_HAZARD = 4/);
  assert.match(asm, /^LEVEL_ATTR:$/m);
  const rows = asm.split("LEVEL_ATTR:\n")[1].split("\n").slice(0, 16);
  assert.equal(rows[4].split(", ")[1], "$0C");          // $41 = row 4, column 1
  assert.equal(rows[10].split(", ")[0], "    .byte $01");  // $A0
  const b = loadLv();
  assert.equal(b.load(a.save()), true);
  assert.equal(b.attr()[0xA0], 1);
  assert.equal(b.attr()[0x41], 12);
  const snap = b.snapshot();
  b.setAttr(0xA0, 0);
  b.restore(snap);
  assert.equal(b.attr()[0xA0], 1);
});

test("edge check finds cells that do not continue across screen borders", () => {
  const lv = loadLv();
  lv.add(0x20); lv.add(0x20);
  const top = lv.screenAt(0), bottom = lv.screenAt(1);
  const t2 = top.screen.slice(0), b2 = bottom.screen.slice(0);
  for (let c = 0; c < 40; c++) { t2[24 * 40 + c] = 0xA0; b2[c] = c < 3 ? 0x20 : 0xA0; }
  top.screen = t2; bottom.screen = b2;
  let issues = lv.edges();
  assert.equal(issues.length, 1);
  assert.deepEqual(Array.from(issues[0].cells), [0, 1, 2]);
  assert.equal(issues[0].dir, "v");
  // solid on one side only also breaks the edge
  const b3 = b2.slice(0); b3[0] = 0x41; b3[1] = 0xA0; b3[2] = 0xA0; bottom.screen = b3;
  lv.setAttr(0xA0, 1);
  issues = lv.edges();
  assert.deepEqual(Array.from(issues[0].cells), [0]);
});

test("RLE stream unpacks with the 6502 routine to the original bytes", () => {
  const lv = loadLv();
  const src = new Uint8Array(3000);
  for (let i = 0; i < src.length; i++) src[i] = i < 900 ? 0x20 : i < 1500 ? (i * 7) & 0xFF : i < 2600 ? 14 : (i & 3);
  src[10] = 0; src[11] = 0;                        // a short run of the probable marker value
  const packed = lv.rle(src);
  assert.ok(packed.length < src.length / 2);
  const code = Array.from(lv.unrleAsm()).join("\n");
  const { mem, labels } = assemble("* = $C000\n" + code);
  mem.set(packed, 0x2000);
  mem[0xFB] = 0x00; mem[0xFC] = 0x20; mem[0xFD] = 0x00; mem[0xFE] = 0x40;
  cpu(mem).call(labels.level_unrle, 2000000);
  assert.deepEqual(Array.from(mem.subarray(0x4000, 0x4000 + src.length)), Array.from(src));
  assert.equal(mem[0x4000 + src.length], 0, "nothing written past the end");
});

test("screen colours: saved per screen, exported per slot", () => {
  const a = loadLv();
  a.add(1); a.add(2);
  a.setBorder(11);
  a.screenAt(1).colors = { bg: 2, border: 7, mc1: 5, mc2: 13 };
  const asm = Array.from(a.colorsAsm()).join("\n");
  assert.match(asm, /\.const LEVEL_BORDER = 11/);
  assert.match(asm, /^LEVEL_SCR_BG:\n {4}\.byte 6, 2$/m);
  assert.match(asm, /^LEVEL_SCR_BORDER:\n {4}\.byte 11, 7$/m);
  const b = loadLv();
  b.load(a.save());
  assert.equal(b.border(), 11);
  assert.deepEqual({ ...b.screens()[1].colors }, { bg: 2, border: 7, mc1: 5, mc2: 13 });
  assert.equal(b.screens()[0].colors, null);
});

test("Run in VICE test program: charset, screen colours and the start camera", () => {
  const lv = loadLv();
  lv.add(1); lv.add(2); lv.add(3);                  // vertical, 320×600
  lv.setDir("up");
  assert.deepEqual({ ...lv.camera() }, { x: 0, y: 400 });
  lv.addObj(0, 100, 260);
  assert.deepEqual({ ...lv.camera() }, { x: 0, y: 164 });
  const asm = lv.testAsm({ charset: true, scrColors: true, camX: 8, camY: 164 });
  assert.match(asm, /^\.level "level\.bin", \$2800$/m);
  assert.match(asm, /^\.incbin "charset\.bin", \$2000$/m);
  assert.match(asm, /LDA LEVEL_SCR_BG,X/);
  assert.match(asm, /LDA #\$18\n {4}STA \$D018/);
  assert.match(asm, /LDA #\$14\n {4}STA shy/);      // 164 / 8
  const plain = lv.testAsm({ charset: false, scrColors: false, camX: 0, camY: 0 });
  assert.match(plain, /^\.level "level\.bin", \$2000$/m);
  assert.doesNotMatch(plain, /\.incbin|LEVEL_SCR_BG/);
});
