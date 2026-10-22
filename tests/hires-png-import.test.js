const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8").replace(/\r\n/g, "\n");

function load() {
  const palettes = appJs.match(/const _C64_PALETTES = \{[^}]+\};/)[0];
  const start = appJs.indexOf("/* ── Hi-Res editor: image import (converter)");
  const end = appJs.indexOf("/* ── Hi-Res editor: image import dialog");
  assert.ok(start > 0 && end > start, "converter source");
  // in this realm: in a vm context the typed-array loops run many times slower
  return new Function(palettes + '\nlet _editorPalette = "pepto";\n' + appJs.slice(start, end) + "\nreturn { convert: _hgPngConvert, dithers: _HG_PNG_DITHERS, lab: _hgOklab };")();
}

function picture(w, h, fn) {
  const a = new Uint8ClampedArray(w * h * 4);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const c = fn(x, y), i = (y * w + x) * 4;
    a[i] = c[0]; a[i + 1] = c[1]; a[i + 2] = c[2]; a[i + 3] = 255;
  }
  return a;
}
const gradient = (w, h) => picture(w, h, (x, y) => [x * 255 / w, y * 255 / h, (x ^ y) & 255]);

function cellColours(r, cw) {
  const cols = r.w / cw, out = [];
  for (let c = 0; c < cols * 25; c++) {
    const set = new Set(), cx = (c % cols) * cw, cy = Math.floor(c / cols) * 8;
    for (let y = 0; y < 8; y++) for (let x = 0; x < cw; x++) set.add(r.pix[(cy + y) * r.w + cx + x]);
    out.push(set);
  }
  return out;
}

test("OKLab: white is L=1, black L=0, greys have no chroma", () => {
  const { lab } = load();
  const w = lab(255, 255, 255), k = lab(0, 0, 0), g = lab(128, 128, 128);
  assert.ok(Math.abs(w[0] - 1) < 1e-3 && Math.abs(k[0]) < 1e-6);
  assert.ok(Math.abs(g[1]) < 1e-3 && Math.abs(g[2]) < 1e-3);
});

test("hires keeps at most 2 colours per 8×8 cell with every dither", () => {
  const { convert, dithers } = load();
  for (const d of dithers) {
    const r = convert(gradient(320, 200), 320, 200, false, { dither: d });
    assert.equal(r.pix.length, 64000);
    cellColours(r, 8).forEach((set, c) => {
      assert.ok(set.size <= 2, `${d}: cell ${c} has ${set.size} colours`);
      set.forEach((v) => assert.ok(r.sets[c].includes(v)));
    });
  }
});

test("multicolor: one shared background + at most 3 colours per 4×8 cell", () => {
  const { convert } = load();
  for (const d of ["none", "checker", "fs", "atkinson"]) {
    const r = convert(gradient(160, 200), 160, 200, true, { dither: d });
    assert.equal(r.pix.length, 32000);
    cellColours(r, 4).forEach((set, c) => {
      assert.ok([...set].filter((v) => v !== r.bg).length <= 3, `${d}: cell ${c}`);
      assert.equal(r.sets[c][0], r.bg);
    });
  }
});

test("a flat palette colour converts to itself; palettes change the match", () => {
  const { convert } = load();
  // Pepto light blue $6C5EB5 → index 14
  const r = convert(picture(320, 200, () => [0x6C, 0x5E, 0xB5]), 320, 200, false, { dither: "none" });
  assert.ok(r.pix.every((v) => v === 14));
  const black = convert(picture(160, 200, () => [0, 0, 0]), 160, 200, true, { dither: "fs" });
  assert.ok(black.pix.every((v) => v === 0));
  // the Colodore light blue is closer to Colodore index 14 than to anything else
  const c = convert(picture(320, 200, () => [0x70, 0x6D, 0xEB]), 320, 200, false, { dither: "none", palette: "colodore" });
  assert.ok(c.pix.every((v) => v === 14));
});

test("adjustments: brightness 0.5 turns a mid grey white, contrast 0 a picture grey", () => {
  const { convert } = load();
  const grey = picture(320, 200, () => [128, 128, 128]);
  const bright = convert(grey, 320, 200, false, { dither: "none", brightness: 0.5 });
  assert.ok(bright.pix.every((v) => v === 1));
  const flat = convert(gradient(320, 200), 320, 200, false, { dither: "none", contrast: 0, saturation: 0 });
  assert.ok(flat.pix.every((v) => [11, 12, 15].includes(v)), "greys only");
});
