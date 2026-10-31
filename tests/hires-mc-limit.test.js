const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");

// Same hires editor slice as hires-koala.test.js.
function loadHg() {
  const start = appJs.indexOf("let _hgMulti = false;");
  const end = appJs.indexOf("function setupHiresEditor(");
  assert.ok(start > 0 && end > start, "hires editor slice not found");
  const fakeCtx = new Proxy({}, { get: () => () => ({ data: new Uint8ClampedArray(4) }) });
  const fakeEl = { getContext: () => fakeCtx, style: {}, width: 0, height: 0, textContent: "" };
  const fakeModeBox = { checked: true };
  const context = {
    _CE_COLORS: Array.from({ length: 16 }, (_, i) => "#" + (i * 0x111111).toString(16).padStart(6, "0")),
    document: { getElementById: (id) => (id === "hg-multicolor" ? fakeModeBox : fakeEl), createElement: () => fakeEl },
    t: (key) => key,
    setTimeout: () => 1,
    clearTimeout() {},
    fakeModeBox,
  };
  vm.createContext(context);
  vm.runInContext(appJs.slice(start, end) +
    "\n_hgRenderAll = function() {}; _hgBuildPalette = function() {};" +
    "\nthis.api = { init: _hgInit, get: _hgGet, set: _hgSet, fill: _hgFloodFill, setPaper: _hgSetPaper, undo: _hgUndoOp," +
    " over: _hgMcOverCells, native: _hgExportMultiNative, redraw: _hgRedrawCellBuf," +
    " stamp: _hgStampClipboard, setClip: (c) => { _hgClipboard = c; }," +
    " setRaw: (x, y, c) => { _hgPixMC[y * 160 + x] = c; }," +
    " setMulti: (m) => { _hgMulti = m; }, setZoom: (z) => { _hgZoom = z; }, setGrid: (g) => { _hgGrid = g; }," +
    " setBuf: (c) => { _hgBufCtx = c; }, paper: () => _hgPaper, push: _hgPushUndo, redo: _hgRedoOp, isMulti: () => _hgMulti, modeBox: fakeModeBox };", context);
  context.api.init();
  context.api.setMulti(true);
  return context.api;
}

test("a cell takes the background plus 3 colours, the 4th is refused", () => {
  const hg = loadHg();
  hg.set(0, 0, 1); hg.set(1, 0, 2); hg.set(2, 0, 3);
  hg.set(3, 0, 4);
  assert.equal(hg.get(3, 0), 0, "4th colour refused");
  hg.set(3, 0, 2);
  assert.equal(hg.get(3, 0), 2, "a colour of the cell is fine");
  hg.set(4, 0, 4);
  assert.equal(hg.get(4, 0), 4, "the next cell has its own colours");
  assert.equal(hg.over().length, 0);
});

test("replacing the only pixel of a colour frees its slot; painting the paper always works", () => {
  const hg = loadHg();
  hg.set(0, 0, 1); hg.set(1, 0, 2); hg.set(2, 0, 3);
  hg.set(2, 0, 4);
  assert.equal(hg.get(2, 0), 4);
  hg.set(0, 0, 0);
  assert.equal(hg.get(0, 0), 0);
});

test("fill recolours a whole region in a full cell", () => {
  const hg = loadHg();
  for (let y = 0; y < 8; y++) { hg.set(0, y, 1); hg.set(1, y, 2); hg.set(2, y, 3); }
  hg.fill(0, 0, 5);
  for (let y = 0; y < 8; y++) assert.equal(hg.get(0, y), 5);
  assert.equal(hg.get(1, 0), 2);
  assert.equal(hg.over().length, 0);
});

test("paste over a full cell replaces it and never exceeds the limit", () => {
  const hg = loadHg();
  for (let x = 0; x < 3; x++) hg.set(x, 0, x + 1);
  hg.setClip({ w: 4, h: 1, multi: true, transparentColor: 0, pixels: Uint8Array.from([5, 6, 7, 8]) });
  hg.stamp(0, 0);
  assert.deepEqual([hg.get(0, 0), hg.get(1, 0), hg.get(2, 0)], [5, 6, 7]);
  assert.equal(hg.get(3, 0), 0, "the 4th pasted colour does not fit");
  assert.equal(hg.over().length, 0);
});

test("a paper change recolours the background pixels, so no slot is lost; undo restores it", () => {
  const hg = loadHg();
  hg.set(0, 0, 1); hg.set(1, 0, 2); hg.set(2, 0, 3);
  hg.setPaper(6);
  assert.equal(hg.get(3, 0), 6);
  assert.equal(hg.get(0, 0), 1);
  assert.equal(hg.over().length, 0);
  hg.undo();
  assert.equal(hg.paper(), 0);
  assert.equal(hg.get(3, 0), 0);
});

test("undo and redo also bring back the mode a picture was switched from", () => {
  const hg = loadHg();
  hg.set(0, 0, 5);
  // what the Multi-Color checkbox does: snapshot, then change the mode
  hg.push();
  hg.setMulti(false);
  hg.modeBox.checked = false;
  hg.set(0, 0, 7);
  hg.undo();
  assert.equal(hg.isMulti(), true);
  assert.equal(hg.modeBox.checked, true);
  assert.equal(hg.get(0, 0), 5);
  hg.redo();
  assert.equal(hg.isMulti(), false);
  assert.equal(hg.modeBox.checked, false);
  assert.equal(hg.get(0, 0), 7);
});

test("cells over the limit from raw data are found", () => {
  const hg = loadHg();
  [1, 2, 3, 4].forEach((c, x) => hg.setRaw(x + 8, 16, c));
  assert.deepEqual(Array.from(hg.over()), [2 * 40 + 2]);
});

test("the 3 colours of a cell reach screen RAM and colour RAM", () => {
  const hg = loadHg();
  hg.set(0, 0, 1); hg.set(1, 0, 2); hg.set(2, 0, 3);
  const native = hg.native();
  assert.equal(native[8000], 0x12);
  assert.equal(native[9000], 3);
  assert.equal(native[0], 0b01101100);
});

test("redrawing outside the picture with the pixel grid on does not throw (drag off the canvas)", () => {
  for (const multi of [true, false]) {
    const hg = loadHg();
    hg.setMulti(multi);
    hg.setZoom(4);
    hg.setGrid(true);
    hg.setBuf({ fillStyle: "", fillRect() {} });
    assert.doesNotThrow(() => { hg.redraw(-1, 5); hg.redraw(5, -1); hg.redraw(400, 5); hg.redraw(5, 250); });
  }
});
