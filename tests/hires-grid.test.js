const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");
const PALETTES = new Function(appJs.match(/const _C64_PALETTES = \{[^}]+\};/)[0] + "\nreturn _C64_PALETTES;")();
const PALETTE = PALETTES.colodore.map((v) => "#" + v.toString(16).padStart(6, "0"));

// Runs the hires editor core (same slice as hires-koala.test.js) with canvas
// contexts that record what the grid draws:
//   overlay(...) -> the lines stroked on the visible canvas  { axis, pos }
//   pixel(...)   -> the rects one pixel paints into the buffer { x, y, w, h, color }
function loadGrid() {
  const start = appJs.indexOf("let _hgMulti = false;");
  const end = appJs.indexOf("function setupHiresEditor(");
  assert.ok(start > 0 && end > start, "hires editor slice not found");
  const fakeCtx = new Proxy({}, { get: () => () => ({ data: new Uint8ClampedArray(4) }) });
  const fakeEl = { getContext: () => fakeCtx, style: {}, width: 0, height: 0 };
  const context = {
    _CE_COLORS: PALETTE,
    document: { getElementById: () => fakeEl, createElement: () => fakeEl },
  };
  vm.createContext(context);
  vm.runInContext(appJs.slice(start, end) + `
    _hgRenderAll = function() {}; _hgBuildPalette = function() {};
    function setup(multi, zoom, grid) { _hgMulti = multi; _hgZoom = zoom; _hgGrid = grid; _hgRaster = false; }
    this.api = {
      init: _hgInit,
      shade: _hgGridShade, FINE: _HG_GRID_FINE, CELL: _HG_GRID_CELL,
      overlay(multi, zoom, grid) {
        setup(multi, zoom, grid);
        const out = [];
        let from = null;
        _hgCtx = {
          strokeStyle: "", lineWidth: 1,
          beginPath() {}, stroke() {},
          moveTo(x, y) { from = [x, y]; },
          lineTo(x, y) { out.push(x === from[0] ? { axis: "v", pos: x - 0.5 } : { axis: "h", pos: y - 0.5 }); },
        };
        _hgOverlays();
        return out;
      },
      pixel(multi, zoom, grid, x, y, col) {
        setup(multi, zoom, grid);
        _hgSet(x, y, col);
        const out = [];
        _hgBufCtx = { fillStyle: "", fillRect(rx, ry, w, h) { out.push({ x: rx, y: ry, w, h, color: this.fillStyle }); } };
        _hgDrawPixelBuf(x, y);
        return out;
      },
    };`, context);
  context.api.init();
  return context.api;
}

const positions = (lines, axis) => lines.filter((l) => l.axis === axis).map((l) => l.pos);
const step = (a) => [...new Set(a.slice(1).map((v, i) => v - a[i]))];
const luminance = (css) => {
  const [r, g, b] = css.startsWith("#")
    ? [1, 3, 5].map((i) => parseInt(css.slice(i, i + 2), 16))
    : css.match(/\d+/g).map(Number);
  return 0.299 * r + 0.587 * g + 0.114 * b;
};

test("grid off draws nothing extra", () => {
  const hg = loadGrid();
  assert.equal(hg.overlay(false, 8, false).length, 0);
  assert.equal(hg.pixel(false, 8, false, 5, 5, 1).length, 1);
});

test("below 4x zoom: cell grid only, 8 hi-res pixels wide in both modes", () => {
  for (const multi of [false, true]) {
    const hg = loadGrid();
    const lines = hg.overlay(multi, 3, true);
    assert.equal(positions(lines, "v").length, 41, "40 cell columns");
    assert.equal(positions(lines, "h").length, 26, "25 cell rows");
    assert.deepEqual(step(positions(lines, "v")), [24]);
    assert.deepEqual(step(positions(lines, "h")), [24]);
    assert.equal(hg.pixel(multi, 3, true, 5, 5, 1).length, 1, "no pixel grid in the buffer");
  }
});

test("from 4x zoom every hi-res pixel carries its top and left grid line", () => {
  const hg = loadGrid();
  assert.equal(hg.overlay(false, 4, true).length, 0, "grid moved from the overlay into the buffer");
  const [fill, a, b] = hg.pixel(false, 4, true, 5, 3, 1);
  assert.deepEqual({ x: fill.x, y: fill.y, w: fill.w, h: fill.h }, { x: 20, y: 12, w: 4, h: 4 });
  assert.deepEqual({ x: a.x, y: a.y, w: a.w, h: a.h }, { x: 20, y: 12, w: 4, h: 1 });
  assert.deepEqual({ x: b.x, y: b.y, w: b.w, h: b.h }, { x: 20, y: 12, w: 1, h: 4 });
  assert.equal(a.color, hg.shade(1, hg.FINE));
  assert.equal(b.color, hg.shade(1, hg.FINE));
});

test("cell borders use the stronger line and are drawn last", () => {
  const hg = loadGrid();
  // (8, 3): left edge is a cell border, top edge is not.
  let r = hg.pixel(false, 4, true, 8, 3, 1);
  assert.deepEqual([r[1].h, r[2].w], [1, 1], "top first, cell-left last");
  assert.equal(r[1].color, hg.shade(1, hg.FINE));
  assert.equal(r[2].color, hg.shade(1, hg.CELL));
  // (5, 8): top edge is a cell border, left edge is not.
  r = hg.pixel(false, 4, true, 5, 8, 1);
  assert.deepEqual([r[1].w, r[2].h], [1, 1], "left first, cell-top last");
  assert.equal(r[1].color, hg.shade(1, hg.FINE));
  assert.equal(r[2].color, hg.shade(1, hg.CELL));
});

test("multicolor pixel grid uses double-wide pixels and 4-pixel cells", () => {
  const hg = loadGrid();
  // (3, 3): inside a cell. Pixel is 8x4 display pixels at 4x zoom.
  let r = hg.pixel(true, 4, true, 3, 3, 2);
  assert.deepEqual({ x: r[0].x, y: r[0].y, w: r[0].w, h: r[0].h }, { x: 24, y: 12, w: 8, h: 4 });
  assert.equal(r[2].color, hg.shade(2, hg.FINE));
  // (4, 3): first pixel of the second cell.
  r = hg.pixel(true, 4, true, 4, 3, 2);
  assert.equal(r[2].color, hg.shade(2, hg.CELL));
});

test("grid lines stay visible on all 16 C64 colours", () => {
  const hg = loadGrid();
  PALETTE.forEach((hex, col) => {
    const fine = Math.abs(luminance(hg.shade(col, hg.FINE)) - luminance(hex));
    const cell = Math.abs(luminance(hg.shade(col, hg.CELL)) - luminance(hex));
    assert.ok(fine >= 25, `fine line on colour ${col} (${hex}): contrast ${fine.toFixed(1)}`);
    assert.ok(cell > fine + 25, `cell line stands out on colour ${col} (${hex})`);
  });
});
