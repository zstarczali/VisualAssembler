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

const FNS = ["_ceEnsureCharColors", "_ceDefaultColor", "_ceSetDefaultColor", "_ceGetPixel", "_ceSetPixel",
  "_ceCharW", "_cePxW", "_cePxH", "_ceTileChars", "_ceClampSel", "_ceGetT", "_ceSetT", "_ceTileRead", "_ceTileWrite",
  "_ceSelect", "_ceSnapshot", "_ceRestore", "_cePushUndo", "_ceUndoOp", "_ceRedoOp", "_ceTransform", "_ceClear",
  "_ceInvert", "_ceFlipH", "_ceFlipV", "_ceShift", "_ceRotate", "_ceLinePoints", "_ceShapePoints", "_ceFloodFill",
  "_ceCopy", "_cePasteAt", "_ceMoveTile", "_ceTextToCodes", "_ceRangeAsm"];

// Character editor state + the editing functions, DOM-free.
function load({ multi = false, tw = 1, th = 1 } = {}) {
  return new Function(`
    let _ceData = new Uint8Array(2048), _ceCharColors = null, _ceSel = 0, _ceFg = 14, _ceBg = 6, _ceMc1 = 5, _ceMc2 = 13;
    let _ceMulticolor = ${multi}, _ceInk = 3, _ceTileW = ${tw}, _ceTileH = ${th};
    let _ceUndo = [], _ceRedo = [], _ceClip = null;
    const _ceUpdateInfo = () => {}, _ceBuildColorRows = () => {}, _ceRefresh = () => {};
    const _ceRange = () => ({ from: 1, to: 2 });
    ${FNS.map(fn).join("\n")}
    return {
      data: () => _ceData, sel: () => _ceSel, select: _ceSelect, w: _cePxW, h: _cePxH,
      get: _ceGetT, set: _ceSetT, rotate: _ceRotate, shift: _ceShift, flipH: _ceFlipH, invert: _ceInvert,
      fill: _ceFloodFill, shape: _ceShapePoints, undo: _ceUndoOp, redo: _ceRedoOp, push: _cePushUndo,
      copy: _ceCopy, paste: _cePasteAt, move: _ceMoveTile, codes: _ceTextToCodes, rangeAsm: _ceRangeAsm,
      colors: () => _ceCharColors
    };
  `)();
}

test("a 2×2 tile maps its pixels to four neighbouring characters", () => {
  const m = load({ tw: 2, th: 2 });
  m.select(17);
  assert.equal(m.w(), 16);
  assert.equal(m.h(), 16);
  m.set(15, 15, 1);
  assert.equal(m.data()[(17 + 1 + 16) * 8 + 7], 1, "bottom-right pixel of char 34");
  m.set(0, 0, 1);
  assert.equal(m.data()[17 * 8], 0x80);
});

test("the selection keeps the whole tile inside the map", () => {
  const m = load({ tw: 2, th: 2 });
  m.select(255);
  assert.equal(m.sel(), 238);
});

test("rotating clockwise moves the top row to the right column", () => {
  const m = load();
  m.data()[0] = 0xff;
  m.rotate(true);
  for (let r = 0; r < 8; r++) assert.equal(m.data()[r], 0x01);
  m.rotate(false);
  assert.equal(m.data()[0], 0xff);
  assert.equal(m.data()[1], 0);
});

test("multicolor rotation keeps double-wide pixels", () => {
  const m = load({ multi: true });
  m.set(0, 0, 2);
  m.rotate(true);
  // top-left 2×1 hi-res block → right edge, rows 0–1
  assert.equal(m.get(3, 0), 2);
  assert.equal(m.get(3, 1), 2);
  assert.equal(m.get(0, 0), 0);
});

test("shift wraps across the whole tile", () => {
  const m = load({ tw: 2 });
  m.set(15, 0, 1);
  m.shift("right");
  assert.equal(m.get(0, 0), 1);
  assert.equal(m.get(15, 0), 0);
  m.shift("left");
  assert.equal(m.data()[8], 0x01);
});

test("flip spans the tile, not each character", () => {
  const m = load({ tw: 2 });
  m.set(0, 3, 1);
  m.flipH();
  assert.equal(m.data()[8 + 3], 0x01);
  assert.equal(m.data()[3], 0);
});

test("undo / redo restore the character data", () => {
  const m = load();
  m.invert();
  assert.equal(m.data()[0], 0xff);
  m.undo();
  assert.equal(m.data()[0], 0);
  m.redo();
  assert.equal(m.data()[0], 0xff);
});

test("rectangle, line and flood fill", () => {
  const m = load();
  assert.equal(m.shape("rect", { x: 1, y: 1 }, { x: 4, y: 3 }).length, 10);
  assert.equal(m.shape("fillrect", { x: 1, y: 1 }, { x: 4, y: 3 }).length, 12);
  assert.deepEqual(m.shape("line", { x: 0, y: 0 }, { x: 3, y: 3 }), [[0, 0], [1, 1], [2, 2], [3, 3]]);
  m.shape("rect", { x: 1, y: 1 }, { x: 6, y: 6 }).forEach((p) => m.set(p[0], p[1], 1));
  m.fill(3, 3, 1);
  assert.equal(m.data()[3], 0x7e);
  assert.equal(m.data()[0], 0, "outside the outline stays empty");
});

test("copy / paste and drag swap / copy on the map", () => {
  const m = load();
  m.data()[8] = 0xaa;
  m.select(1);
  m.copy();
  m.paste(5);
  assert.equal(m.data()[5 * 8], 0xaa);
  assert.equal(m.sel(), 5);
  m.data()[16 * 8] = 0x11;
  m.move(1, 16, false);
  assert.equal(m.data()[16 * 8], 0xaa);
  assert.equal(m.data()[8], 0x11);
  m.move(16, 20, true);
  assert.equal(m.data()[20 * 8], 0xaa);
  assert.equal(m.data()[16 * 8], 0xaa, "copy keeps the source");
  m.undo();
  assert.equal(m.data()[20 * 8], 0);
});

test("preview text → screen codes", () => {
  const m = load();
  assert.deepEqual(m.codes("Ab@1", false), [1, 2, 0, 49]);
  assert.deepEqual(m.codes("Ab", true), [65, 2]);
  assert.deepEqual(m.codes("{81}{$a0}\nx", false), [81, 160, -1, 24]);
});

test("range asm lists eight bytes per character", () => {
  const m = load();
  m.data()[8] = 0x3c;
  const asm = m.rangeAsm();
  assert.match(asm, /charset_01:/);
  assert.match(asm, /\.byte \$3C, \$00, \$00, \$00, \$00, \$00, \$00, \$00  ; \$01/);
  assert.equal(asm.split("\n").filter((l) => l.includes(".byte")).length, 2);
});
