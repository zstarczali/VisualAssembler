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
    let _ccMulticolor = ${multi}, _ccColor = 7, _ccBg = 6, _ccMc1 = 2, _ccMc2 = 13;
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
