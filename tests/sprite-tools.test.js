const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8").replace(/\r\n/g, "\n");

function fn(name) {
  const start = appJs.indexOf(`function ${name}(`);
  assert.ok(start > 0, `Missing function ${name}`);
  let depth = 0, seen = false;
  for (let i = start; i < appJs.length; i++) {
    if (appJs[i] === "{") { depth++; seen = true; }
    else if (appJs[i] === "}" && seen && --depth === 0) return appJs.slice(start, i + 1);
  }
  throw new Error(name);
}

const FNS = ["_spOnOv", "_spLM", "_spCur", "_spNewFrame", "_spGet", "_spSet", "_spFloodFill", "_spLayers",
  "_spSelActive", "_spSelNorm", "_spLift", "_spStamp", "_spMoveSel", "_spClearSel", "_spRotate", "_spHitSync",
  "_spBounds", "_spHitboxAsm", "_spMirrorAnim", "_spFlipArrH", "_spSheetCells"];

// Sprite editor state + the tool functions, DOM-free.
function load({ multi = false, overlay = false } = {}) {
  return new Function(`
    const _SP_PW = 24, _SP_PH = 21;
    let _SP_W = 24, _SP_H = 21, _spMulti = ${multi}, _spOverlay = ${overlay}, _spLayer = "base", _spFrame = 0;
    let _spFrames = [], _spOv = [], _spHit = [], _spSel = null, _spFloat = null;
    ${FNS.map(fn).join("\n")}
    _spFrames = [_spNewFrame()]; _spOv = [_spNewFrame()];
    return {
      W: _SP_W, H: _SP_H,
      body: () => _spFrames[_spFrame], ov: () => _spOv[_spFrame],
      frames: () => _spFrames, hits: () => _spHit,
      setLayer: (l) => { _spLayer = l; },
      set: _spSet, fill: _spFloodFill, rotate: _spRotate, bounds: _spBounds, mirror: _spMirrorAnim,
      hitAsm: _spHitboxAsm, cells: _spSheetCells,
      select: (a, b) => { _spSel = _spSelNorm(a, b); return _spSel; },
      move: _spMoveSel, clear: _spClearSel, sel: () => _spSel,
      setHit: (i, h) => { _spHitSync(); _spHit[i] = h; }
    };
  `)();
}
const px = (m, f, x, y) => f[y * m.W + x];

test("flood fill stops at a closed outline", () => {
  const m = load();
  for (let i = 2; i <= 8; i++) { m.set(i, 2, 1); m.set(i, 8, 1); m.set(2, i, 1); m.set(8, i, 1); }
  m.fill(5, 5, 1);
  assert.equal(px(m, m.body(), 5, 5), 1);
  assert.equal(px(m, m.body(), 3, 7), 1);
  assert.equal(px(m, m.body(), 9, 5), 0, "outside stays empty");
  assert.equal(px(m, m.body(), 0, 0), 0);
});

test("multicolor flood fill keeps the pixel pairs", () => {
  const m = load({ multi: true });
  m.fill(3, 0, 2);
  const f = m.body();
  assert.ok(f.every((v) => v === 2));
});

test("the overlay layer is edited on its own and in hi-res", () => {
  const m = load({ multi: true, overlay: true });
  m.setLayer("ov");
  m.set(3, 1, 1);
  assert.equal(px(m, m.ov(), 3, 1), 1);
  assert.equal(px(m, m.ov(), 2, 1), 0, "no pixel pair on the hi-res overlay");
  assert.equal(px(m, m.body(), 3, 1), 0);
});

test("a selection moves body and overlay together, transparent and clipped", () => {
  const m = load({ overlay: true });
  m.body()[2 * 24 + 2] = 1;
  m.ov()[3 * 24 + 3] = 1;
  m.body()[10 * 24 + 10] = 1;               // outside the selection, must stay
  m.select({ x: 2, y: 2 }, { x: 4, y: 4 });
  m.move(5, 1);
  assert.equal(px(m, m.body(), 2, 2), 0);
  assert.equal(px(m, m.body(), 7, 3), 1);
  assert.equal(px(m, m.ov(), 8, 4), 1);
  assert.equal(px(m, m.body(), 10, 10), 1);
  assert.deepEqual([m.sel().x, m.sel().y, m.sel().w, m.sel().h], [7, 3, 3, 3]);
  m.move(15, 0);                            // partly off the right edge
  assert.deepEqual([m.sel().x, m.sel().w], [22, 2]);
  m.clear();
  assert.equal(m.body().reduce((s, v) => s + v, 0), 1, "only the pixel outside the selection is left");
});

test("rotating a square selection 90° clockwise and back is lossless", () => {
  const m = load();
  m.body()[1 * 24 + 1] = 1;                 // top left of a 4×4 square at (1,1)
  m.body()[1 * 24 + 2] = 1;
  m.select({ x: 1, y: 1 }, { x: 4, y: 4 });
  m.rotate(true);
  assert.equal(px(m, m.body(), 4, 1), 1);   // top row → right column
  assert.equal(px(m, m.body(), 4, 2), 1);
  assert.equal(px(m, m.body(), 1, 1), 0);
  m.rotate(false);
  assert.equal(px(m, m.body(), 1, 1), 1);
  assert.equal(px(m, m.body(), 2, 1), 1);
  assert.equal(m.body().reduce((s, v) => s + v, 0), 2);
});

test("hitbox table: set boxes, pixel bounds for the rest, mirrored by Mirror all", () => {
  const m = load();
  m.body()[5 * 24 + 4] = 1; m.body()[9 * 24 + 10] = 1;
  m.setHit(0, { x: 2, y: 3, w: 10, h: 12 });
  m.mirror();
  assert.equal(m.frames().length, 2);
  assert.equal(px(m, m.frames()[1], 19, 5), 1, "frame 2 is frame 1 mirrored");
  assert.deepEqual({ ...m.hits()[1] }, { x: 12, y: 3, w: 10, h: 12 });
  m.setHit(1, null);
  const asm = m.hitAsm();
  assert.match(asm, /\.const SPRITE_FRAMES = 2/);
  assert.match(asm, /^sprite_hit_x:\n {4}\.byte 2, 13$/m);   // frame 2: bounds of (13..19, 5..9)
  assert.match(asm, /^sprite_hit_w:\n {4}\.byte 10, 7$/m);
  assert.match(asm, /^sprite_hit_h:\n {4}\.byte 12, 5$/m);
});

test("sprite sheet cells follow offset, gap and the frame limit", () => {
  const m = load();
  const cells = m.cells({ cellW: 24, cellH: 21, offX: 1, offY: 2, gapX: 2, gapY: 3, count: 0 }, 80, 70);
  assert.deepEqual(cells.map((c) => c.x + "," + c.y), ["1,2", "27,2", "53,2", "1,26", "27,26", "53,26"]);
  assert.equal(m.cells({ cellW: 24, cellH: 21, offX: 0, offY: 0, gapX: 0, gapY: 0, count: 4 }, 200, 200).length, 4);
});
