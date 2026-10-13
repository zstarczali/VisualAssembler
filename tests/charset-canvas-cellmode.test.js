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

const FNS = ["_ccW", "_ccH", "_ccCellCols", "_ccCharMc", "_ccSetCellMode", "_ccCellFromPixel", "_ccGetPixel",
  "_ccSetPixel", "_ccPixelColor", "_ccFill", "_ccExportColorRam", "_ccValueUsed"];

// Charset Canvas pixel model, DOM-free.
function load(multi) {
  return new Function(`
    let _ccData = new Uint8Array(2048), _ccColorRam = new Uint8Array(256).fill(${multi ? "8 | 5" : 14});
    let _ccMulticolor = ${multi}, _ccColor = 7, _ccBg = 6, _ccMc1 = 2, _ccMc2 = 13, _ccDirty = new Set(), _ccEcm = false;
    ${FNS.map(fn).join("\n")}
    return {
      data: () => _ccData, ram: () => _ccColorRam, setColor: (c) => { _ccColor = c; },
      get: _ccGetPixel, set: _ccSetPixel, color: _ccPixelColor, fill: _ccFill, mode: _ccSetCellMode,
      isMc: _ccCharMc, exportRam: _ccExportColorRam, used: _ccValueUsed
    };
  `)();
}

test("a multicolor character pixel covers two hi-res columns", () => {
  const m = load(true);
  m.set(1, 0, 2);
  assert.equal(m.data()[0], 0x80);
  assert.equal(m.get(0, 0), 2);
  assert.equal(m.get(1, 0), 2);
  assert.equal(m.color(2, 0), 13, "MC2");
  m.set(2, 0, 3);
  assert.equal(m.ram()[0], 8 | 7, "own colour 0-7, bit 3 kept");
});

test("a hi-res character in multicolor mode has 2 colours and 8 pixels", () => {
  const m = load(true);
  m.mode(1, false);
  assert.equal(m.isMc(1), false);
  assert.equal(m.ram()[1] & 8, 0, "Color RAM bit 3 cleared");
  m.set(8, 0, 3);
  assert.equal(m.data()[8], 0x80, "one narrow pixel");
  assert.equal(m.color(m.get(8, 0), 1), 7);
  m.set(9, 0, 1);
  assert.equal(m.data()[8], 0x80, "MC1 does not exist in a hi-res character");
  assert.equal(m.color(0, 1), 6, "background");
});

test("switching the cell mode keeps the shape", () => {
  const m = load(true);
  m.set(0, 0, 1);
  m.set(4, 0, 3);
  m.mode(0, false);
  assert.equal(m.data()[0], 0xcc);
  m.mode(0, true);
  assert.equal(m.data()[0], 0xcc);
  assert.equal(m.get(0, 0), 3);
});

test("the Color RAM export keeps the per-character mode", () => {
  const m = load(true);
  m.mode(3, false);
  const ram = m.exportRam();
  assert.equal(ram[0] & 8, 8);
  assert.equal(ram[3] & 8, 0);
});

test("flood fill crosses a multicolor / hi-res border by colour", () => {
  const m = load(true);
  m.mode(1, false);
  m.setColor(4);
  m.fill(0, 0, 3);
  assert.equal(m.data()[0], 0xff, "multicolor char filled");
  assert.equal(m.data()[8], 0xff, "hi-res neighbour filled");
  assert.equal(m.color(m.get(8, 0), 1), 4);
});

test("shared-register use ignores hi-res characters", () => {
  const m = load(true);
  m.mode(0, false);
  m.set(1, 0, 3);           // bit pattern 01 in a hi-res char is not MC1
  assert.equal(m.used(1), false);
  m.set(8, 0, 1);
  assert.equal(m.used(1), true);
});

// ECM: hi-res cells with one of four backgrounds, at most 64 different glyphs.
function loadEcm() {
  return new Function(`
    let _ccData = new Uint8Array(2048), _ccColorRam = new Uint8Array(256).fill(1);
    let _ccMulticolor = false, _ccColor = 1, _ccBg = 0, _ccMc1 = 2, _ccMc2 = 5, _ccBg3 = 6, _ccDirty = new Set();
    let _ccEcm = true, _ccEcmBg = new Uint8Array(256);
    ${["_ccCharMc", "_ccEcmBgOf", "_ccBgColors", "_ccEcmGlyphs", "_ccPixelColor"].map(fn).join("\n")}
    return { data: () => _ccData, bg: () => _ccEcmBg, color: _ccPixelColor, glyphs: _ccEcmGlyphs };
  `)();
}

test("ECM: each cell shows its own background register", () => {
  const m = loadEcm();
  m.bg()[5] = 3;
  m.bg()[6] = 1;
  assert.equal(m.color(0, 5), 6, "BG3 = $D024");
  assert.equal(m.color(0, 6), 2, "BG1 = $D022");
  assert.equal(m.color(1, 6), 1, "foreground from Color RAM");
});

test("ECM: equal characters are merged and the code carries the background", () => {
  const m = loadEcm();
  m.data()[8 * 10] = 0xff;   // char 10 differs from the empty ones
  m.data()[8 * 20] = 0xff;   // char 20 equals char 10
  m.bg()[20] = 2;
  const g = m.glyphs();
  assert.equal(g.count, 2);
  assert.equal(g.codes[0], 0);
  assert.equal(g.codes[10], 1);
  assert.equal(g.codes[20], 1 | (2 << 6));
  assert.equal(g.charset[8], 0xff, "glyph 1 in the 64-character set");
  assert.equal(g.charset.length, 512);
});

test("ECM: more than 64 different characters are reported", () => {
  const m = loadEcm();
  for (let n = 0; n < 100; n++) m.data()[n * 8] = n;
  assert.equal(m.glyphs().count, 100);
});
