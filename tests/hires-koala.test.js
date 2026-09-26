const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");

// The hires editor core runs from `let _hgMulti` up to `function setupHiresEditor(`.
// DOM access only happens inside functions, so stub `document` and the renderers.
function loadHg() {
  const start = appJs.indexOf("let _hgMulti = false;");
  const end = appJs.indexOf("function setupHiresEditor(");
  assert.ok(start > 0 && end > start, "hires editor slice not found");
  const fakeCtx = new Proxy({}, { get: () => () => ({ data: new Uint8ClampedArray(4) }) });
  const fakeEl = { getContext: () => fakeCtx, style: {}, width: 0, height: 0 };
  const context = {
    _CE_COLORS: Array.from({ length: 16 }, (_, i) => "#" + (i * 0x111111).toString(16).padStart(6, "0")),
    document: { getElementById: () => fakeEl, createElement: () => fakeEl },
  };
  vm.createContext(context);
  vm.runInContext(appJs.slice(start, end) +
    "\n_hgRenderAll = function() {}; _hgBuildPalette = function() {};" +
    "\nthis.api = { init: _hgInit, exportKoala: _hgExportKoala, importKoala: _hgImportKoala," +
    " get: _hgGet, set: _hgSet, setMulti: (m) => { _hgMulti = m; }, isMulti: () => _hgMulti," +
    " paper: () => _hgPaper, setPaper: (p) => { _hgPaper = p; } };", context);
  context.api.init();
  return context.api;
}

test("Koala export has the $6000 header, 10003 bytes and the background byte", () => {
  const hg = loadHg();
  hg.setMulti(true);
  hg.setPaper(6);
  const koa = hg.exportKoala();
  assert.equal(koa.length, 10003);
  assert.deepEqual([koa[0], koa[1]], [0x00, 0x60]);
  assert.equal(koa[10002], 6);
});

test("multicolor picture round-trips through Koala", () => {
  const a = loadHg();
  a.setMulti(true);
  a.setPaper(0);
  // 3 colours + background per 4x8 cell stays within the VIC-II limit
  for (let y = 0; y < 200; y++)
    for (let x = 0; x < 160; x++) a.set(x, y, [0, 2, 5, 7][(x + y) & 3]);
  const koa = a.exportKoala();

  const b = loadHg();
  assert.equal(b.importKoala(koa), true);
  assert.equal(b.isMulti(), true);
  for (let y = 0; y < 200; y += 7)
    for (let x = 0; x < 160; x += 3) assert.equal(b.get(x, y), a.get(x, y), `pixel ${x},${y}`);
});

test("Koala without load address (10001 bytes) imports; other sizes are rejected", () => {
  const a = loadHg();
  a.setMulti(true);
  a.setPaper(11);
  const koa = a.exportKoala();
  const b = loadHg();
  assert.equal(b.importKoala(koa.subarray(2)), true);
  assert.equal(b.paper(), 11);
  assert.equal(loadHg().importKoala(new Uint8Array(9000)), false);
});

test("hi-res picture is reduced to multicolor on Koala export (thin lines survive)", () => {
  const a = loadHg();
  a.setMulti(false);
  a.setPaper(0);
  for (let y = 0; y < 200; y++) a.set(101, y, 1);   // 1-px vertical line on an odd column
  const b = loadHg();
  b.importKoala(a.exportKoala());
  assert.equal(b.get(50, 10), 1);   // 101 >> 1
  assert.equal(b.get(49, 10), 0);
});
