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

function load(cols, rows, multi = false) {
  return new Function(`
    const document = { getElementById() { return null; } };
    const _SP_PW = 24, _SP_PH = 21;
    let _SP_W = 24, _SP_H = 21, _spCols = 1, _spRows = 1;
    let _spMulti = ${multi}, _spFrames = null, _spFrame = 0;
    function _spStop() {} function _spPushUndo() {} function _spRender() {}
    ${fn("_spApplyDims")}
    ${fn("_spFrameBytes")}
    ${fn("_spFrameAllBytes")}
    ${fn("_spImportBin")}
    _spApplyDims(${cols}, ${rows});
    return {
      W: _SP_W, H: _SP_H,
      frame() { return new Uint8Array(_SP_W * _SP_H); },
      all: _spFrameAllBytes, part: _spFrameBytes,
      load(bytes) { _spImportBin(bytes); return _spFrames; }
    };
  `)();
}

test("a 2×2 metasprite is a 48×42 picture split into four sprites", () => {
  const m = load(2, 2);
  assert.deepEqual([m.W, m.H], [48, 42]);
  const f = m.frame();
  f[0] = 1;                 // sprite 1, top left pixel → byte 0 bit 7
  f[47] = 1;                // sprite 2, top right pixel → byte 2 bit 0
  f[21 * 48 + 0] = 1;       // sprite 3, its first row
  f[41 * 48 + 47] = 1;      // sprite 4, its last pixel → byte 62 bit 0
  const all = m.all(f);
  assert.equal(all.length, 4 * 64);
  assert.equal(all[0], 0x80);
  assert.equal(all[64 + 2], 0x01);
  assert.equal(all[128 + 0], 0x80);
  assert.equal(all[192 + 62], 0x01);
  // nothing else is set
  assert.equal(all.reduce((s, b) => s + (b ? 1 : 0), 0), 4);
});

test("multicolor parts keep the 2-bit pairs", () => {
  const m = load(2, 1, true);
  const f = m.frame();
  f[24] = 3; f[25] = 3;     // sprite 2, first multicolor pixel = %11
  assert.equal(m.part(f, 1, 0)[0], 0xC0);
  assert.equal(m.part(f, 0, 0)[0], 0x00);
});

test(".bin round trip: frames × sprites, 64 bytes each", () => {
  const m = load(1, 2);
  const a = m.frame(), b = m.frame();
  a[0] = 1; a[20 * 24 + 23] = 1; a[21 * 24 + 5] = 1;   // both sprites of frame 1
  b[41 * 24 + 0] = 1;                                    // the lower sprite of frame 2
  const bin = new Uint8Array(2 * 128);
  bin.set(m.all(a), 0); bin.set(m.all(b), 128);
  const frames = m.load(bin);
  assert.equal(frames.length, 2);
  assert.deepEqual(Array.from(frames[0]), Array.from(a));
  assert.deepEqual(Array.from(frames[1]), Array.from(b));
});

test("a single sprite still exports and loads 64 bytes per frame", () => {
  const m = load(1, 1);
  const f = m.frame();
  f[0] = 1; f[23] = 1;
  const all = m.all(f);
  assert.equal(all.length, 64);
  assert.deepEqual([all[0], all[2]], [0x80, 0x01]);
  assert.deepEqual(Array.from(m.load(all)[0]), Array.from(f));
});
