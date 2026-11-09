const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");

// Same hires editor slice as hires-mc-limit.test.js.
function loadHg() {
  const start = appJs.indexOf("let _hgMulti = false;");
  const end = appJs.indexOf("function setupHiresEditor(");
  assert.ok(start > 0 && end > start, "hires editor slice not found");
  const fakeCtx = new Proxy({}, { get: () => () => ({ data: new Uint8ClampedArray(4) }) });
  const fakeEl = { getContext: () => fakeCtx, style: {}, width: 0, height: 0, textContent: "" };
  const context = {
    _CE_COLORS: Array.from({ length: 16 }, (_, i) => "#" + (i * 0x111111).toString(16).padStart(6, "0")),
    document: { getElementById: () => fakeEl, createElement: () => fakeEl },
    t: (key) => key,
    setTimeout: () => 1,
    clearTimeout() {},
  };
  vm.createContext(context);
  vm.runInContext(appJs.slice(start, end) +
    "\n_hgRenderAll = function() {}; _hgBuildPalette = function() {};" +
    "\nthis.api = { init: _hgInit, get: _hgGet, fill: _hgFloodFill, rect: _hgRect, paint: _hgMcPaint, over: _hgMcOverCells," +
    " index: _hgMixIndex, colorAt: _hgMixColorAt, ink: _hgInk, inkAt: _hgInkAt, normalize: _hgMixNormalize," +
    " patterns: _HG_MIX_PATTERNS, slots: _HG_MIX_SLOTS," +
    " setMix: (on, slot, mix) => { _hgMixOn = on; _hgMixSlot = slot; if (mix) _hgMixes[slot] = mix; }," +
    " setMulti: (m) => { _hgMulti = m; }, setTool: (t) => { _hgTool = t; }, setColor: (c) => { _hgColor = c; } };", context);
  context.api.init();
  context.api.setMulti(true);
  return context.api;
}

function fillRect(hg, x0, y0, x1, y1) {
  const ink = hg.ink(), batch = new Map();
  hg.rect(x0, y0, x1, y1, (x, y) => batch.set(y * 160 + x, hg.inkAt(ink, x, y)), true);
  hg.paint(batch);
}

test("every pattern uses all three colours and only those", () => {
  const hg = loadHg();
  assert.equal(hg.patterns.length, 8);
  for (const p of hg.patterns) {
    const seen = new Set();
    for (let y = 0; y < 8; y++) for (let x = 0; x < 12; x++) seen.add(hg.index(p, x, y));
    assert.deepEqual([...seen].sort(), [0, 1, 2], p);
  }
});

test("patterns repeat, so neighbouring shapes join without a seam", () => {
  const hg = loadHg();
  for (const p of hg.patterns)
    for (let y = 0; y < 12; y++) for (let x = 0; x < 12; x++)
      assert.equal(hg.index(p, x, y), hg.index(p, x + 24, y + 24), p);
});

test("a filled rectangle with a mix paints the pattern locked to the picture", () => {
  const hg = loadHg();
  hg.setMix(true, 0, { c: [2, 5, 7], p: "columns" });
  hg.setTool("fillrect");
  fillRect(hg, 4, 0, 7, 7);
  fillRect(hg, 8, 0, 11, 7);
  for (let x = 4; x < 12; x++) assert.equal(hg.get(x, 3), [2, 5, 7][x % 3], "x=" + x);
  assert.equal(hg.over().length, 0);
});

test("flood fill with a mix fills the region with the pattern", () => {
  const hg = loadHg();
  hg.setMix(true, 1, { c: [1, 3, 6], p: "lines" });
  hg.setTool("fill");
  hg.fill(10, 10, hg.ink());
  for (let y = 0; y < 6; y++) assert.equal(hg.get(10, y), [1, 3, 6][y % 3]);
  assert.equal(hg.over().length, 0);
});

test("a mix containing the paper leaves room in the cell", () => {
  const hg = loadHg();
  hg.setMix(true, 2, { c: [0, 4, 9], p: "checker" });
  fillRect(hg, 0, 0, 3, 7);
  const cols = new Set();
  for (let y = 0; y < 8; y++) for (let x = 0; x < 4; x++) cols.add(hg.get(x, y));
  assert.deepEqual([...cols].sort((a, b) => a - b), [0, 4, 9]);
});

test("the mix is off in hi-res and for the eraser", () => {
  const hg = loadHg();
  hg.setColor(5);
  hg.setMix(true, 0, null);
  hg.setTool("eraser");
  assert.equal(hg.ink(), 5);
  hg.setTool("pencil");
  assert.equal(typeof hg.ink(), "function");
  hg.setMulti(false);
  assert.equal(hg.ink(), 5);
});

test("stored mixes are validated", () => {
  const hg = loadHg();
  const s = hg.normalize({ on: true, slot: 3, mixes: [{ c: [1, 2, 3], p: "soft" }, { c: [1, 99, 3], p: "nope" }] });
  assert.equal(s.on, true);
  assert.equal(s.slot, 3);
  assert.equal(s.mixes.length, hg.slots);
  assert.deepEqual([...s.mixes[0].c], [1, 2, 3]);
  assert.equal(s.mixes[0].p, "soft");
  assert.notDeepEqual([...s.mixes[1].c], [1, 99, 3]);
  assert.ok(hg.patterns.includes(s.mixes[1].p));
  assert.equal(hg.normalize({ slot: 42 }).slot, 0);
  assert.equal(hg.normalize(null).on, false);
});
