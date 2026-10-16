const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8").replace(/\r\n/g, "\n");

function slice(startMarker, endMarker) {
  const start = appJs.indexOf(startMarker);
  const end = appJs.indexOf(endMarker, start);
  assert.ok(start > 0 && end > start, "source slice not found: " + startMarker);
  return appJs.slice(start, end);
}

function load() {
  const context = {};
  vm.createContext(context);
  vm.runInContext(
    slice("function _evalJsExprSafe(", "\n}\n") + "\n}\n" +
    slice("const _TG_PARAMS = {", "const _TG_STATE = {") +
    "\nthis.tg = { gen: _tgGenerate, asm: _tgFormatAsm, ub: _tgFormatUb, bin: _tgToBin, types: _TG_TYPES };",
    context);
  return context.tg;
}

const base = { label: "", base: "hex", perLine: 8, wordMode: "split", align: false, params: {} };

test("screen row addresses: $0400 + 40·i, lo/hi split", () => {
  const tg = load();
  const state = { ...base, type: "screenRows" };
  const g = tg.gen(state);
  assert.equal(g.values.length, 25);
  assert.equal(g.word, true);
  assert.equal(g.values[0], 0x0400);
  assert.equal(g.values[24], 0x0400 + 24 * 40);
  const asm = tg.asm(state, g);
  assert.match(asm, /^screen_row_lo:\n    \.byte \$00, \$28, \$50/m);
  assert.match(asm, /^screen_row_hi:\n    \.byte \$04, \$04, \$04, \$04, \$04, \$04, \$04, \$05/m);
});

test("bitmap rows follow the 8x8 cell layout", () => {
  const { gen } = load();
  const g = gen({ ...base, type: "bitmapRows" });
  assert.equal(g.values[0], 0x2000);
  assert.equal(g.values[7], 0x2007);
  assert.equal(g.values[8], 0x2000 + 320);
  assert.equal(g.values[199], 0x2000 + 24 * 320 + 7);
});

test("pixel masks: hires, multicolor, inverted", () => {
  const { gen } = load();
  assert.deepEqual([...gen({ ...base, type: "pixelMask" }).values], [0x80, 0x40, 0x20, 0x10, 8, 4, 2, 1]);
  assert.deepEqual([...gen({ ...base, type: "pixelMask", params: { count: 4, mc: 1 } }).values], [0xC0, 0x30, 0x0C, 0x03]);
  assert.equal(gen({ ...base, type: "pixelMask", params: { invert: 1 } }).values[0], 0x7F);
});

test("quarter squares give fast multiplication", () => {
  const { gen } = load();
  const sqr = gen({ ...base, type: "quarterSquare" }).values;
  const sqr2 = gen({ ...base, type: "quarterSquare", params: { offset: 255 } }).values;
  assert.equal(sqr.length, 512);
  for (const [a, b] of [[0, 0], [7, 9], [200, 13], [255, 255], [17, 250]]) {
    // the classic pair: sqr[a+b] - sqr2[a-b+255]
    assert.equal(sqr[a + b] - sqr2[a - b + 255], a * b, `${a}*${b}`);
  }
});

test("reciprocal, div, mod, bit reverse", () => {
  const { gen } = load();
  const r = gen({ ...base, type: "reciprocal" }).values;
  assert.equal(r[0], 0xFFFF);
  assert.equal(r[1], 0xFFFF);
  assert.equal(r[2], 0x8000);
  assert.equal(gen({ ...base, type: "divConst" }).values[10], 3);
  assert.equal(gen({ ...base, type: "modConst" }).values[10], 1);
  const flip = gen({ ...base, type: "bitReverse" });
  assert.equal(flip.word, false);
  assert.equal(flip.values[0x01], 0x80);
  assert.equal(flip.values[0xF0], 0x0F);
  assert.equal(gen({ ...base, type: "bitReverse", params: { mc: 1 } }).values[0b11100100], 0b00011011);
});

test("custom expression: sine, negative values, errors", () => {
  const { gen } = load();
  const sine = gen({ ...base, type: "custom", expr: "128 + 127 * sin(i * 2 * PI / n)" });
  assert.equal(sine.word, false);
  assert.equal(sine.values[0], 128);
  assert.equal(sine.values[64], 255);
  const neg = gen({ ...base, type: "custom", expr: "i - 4", params: { count: 8 } });
  assert.equal(neg.word, false);
  assert.equal(neg.values[0], 0xFC);
  assert.equal(neg.values[7], 3);
  assert.equal(gen({ ...base, type: "custom", expr: "$10 + %11 + i", params: { count: 1 } }).values[0], 19);
  assert.equal(gen({ ...base, type: "custom", expr: "i +* 2" }).error, true);
});

test("word output: .word table, dec format, align, UB and bin", () => {
  const tg = load();
  const state = { ...base, type: "mulConst", wordMode: "word", base: "dec", align: true, params: { factor: 320, count: 4 } };
  const g = tg.gen(state);
  assert.equal(tg.asm(state, g).split("\n").slice(1).join("\n"), ".align 256\nmul40:\n    .word 0, 320, 640, 960");
  assert.equal(tg.ub({ ...state, label: "x320" }, g).split("\n").slice(1).join("\n"), "var x320 = array_word(4)\ndata x320: 0, 320, 640, 960");
  assert.deepEqual([...tg.bin(g)], [0, 64, 128, 192, 0, 1, 2, 3]);
});

const { assemble, cpu } = require("./mini6502");

function runCode(asm, setup) {
  const { mem, labels } = assemble("* = $C000\n" + asm);
  if (setup) setup(mem);
  const c = cpu(mem);
  c.call(0xC000);
  return { mem, labels };
}

test("speedcode fill: loop and full unroll fill exactly the range", () => {
  const tg = load();
  for (const perIter of [0, 1, 4, 7]) {
    const state = { ...base, type: "fillCode", params: { base: 0x0400, count: 1000, value: 0x20, perIter } };
    const g = tg.gen(state);
    assert.ok(g.code.size > 0 && g.code.cycles > 0);
    const { mem } = runCode(tg.asm(state, g), (m) => m.fill(0xAA, 0x0300, 0x0900));
    assert.equal(mem[0x03FF], 0xAA, `perIter ${perIter}: before`);
    for (let a = 0x0400; a < 0x07E8; a++) assert.equal(mem[a], 0x20, `perIter ${perIter}: $${a.toString(16)}`);
    assert.equal(mem[0x07E8], 0xAA, `perIter ${perIter}: after`);
  }
});

test("speedcode copy: 256-byte chunks skip the CPX", () => {
  const tg = load();
  const state = { ...base, type: "copyCode", params: { src: 0x2000, dst: 0x3000, count: 512, perIter: 2 } };
  const asm = tg.asm(state, tg.gen(state));
  assert.ok(!/CPX/.test(asm));
  const { mem } = runCode(asm, (m) => { for (let i = 0; i < 512; i++) m[0x2000 + i] = (i * 7) & 0xFF; });
  for (let i = 0; i < 512; i++) assert.equal(mem[0x3000 + i], (i * 7) & 0xFF);
  assert.equal(mem[0x3200], 0);
});
