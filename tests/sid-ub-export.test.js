const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");

function extractFunctionSource(name) {
  const start = appJs.indexOf(`function ${name}(`);
  assert.notStrictEqual(start, -1, `Missing function ${name}`);
  let depth = 0, seen = false;
  for (let i = start; i < appJs.length; i++) {
    if (appJs[i] === "{") { depth++; seen = true; }
    else if (appJs[i] === "}" && seen && --depth === 0) return appJs.slice(start, i + 1);
  }
  throw new Error(`Could not parse ${name}`);
}

function buildBlock(patternCount = 1, song = [0]) {
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(`
    const _SID_ROWS = 32; let _sidSpeed = 6;
    const _SID_NOTE_NAMES = ["C-","C#","D-","D#","E-","F-","F#","G-","G#","A-","A#","B-"];
    ${extractFunctionSource("_sidNoteName")}
    ${extractFunctionSource("_sidFxText")}
    ${extractFunctionSource("_sidCellText")}
    function _sidWaveByte(i) { return (i.tri?0x10:0) | (i.saw?0x20:0) | (i.pul?0x40:0) | (i.noi?0x80:0) | 0x01; }
    let _sidInsts = [{ name: "Lead", a: 0, d: 9, s: 8, r: 4, pw: 2048, cut: 100, res: 2, lp: true, bp: false, hp: false, vol: 15, saw: true }];
    const mk = () => [0, 1, 2].map((v) => Array.from({ length: 32 }, (_, r) =>
      v === 0 && r === 0 ? { note: 48, inst: 0, fx: "V", fxval: 0x24 } : { note: null, inst: 0, fx: null, fxval: 0 }));
    let _sidPatterns = Array.from({ length: ${patternCount} }, mk);
    let _sidSong = ${JSON.stringify(song)};
    ${extractFunctionSource("_sidExportUbBlock")}
    this.out = _sidExportUbBlock();
  `, ctx);
  return ctx.out;
}

test("UB export: a tune block plus music play, no machine code", () => {
  const out = buildBlock();
  const lines = out.split("\n");
  assert.ok(lines.includes("tune"));
  assert.ok(lines.includes("end"));
  assert.equal(lines[lines.length - 1], "music play");
  assert.ok(!/\basm\b|\.byte|\bJSR\b|\bLDA\b/.test(out));
});

test("UB export: instrument, order and pattern lines follow the tune syntax", () => {
  const out = buildBlock(2, [0, 1, 0]);
  assert.match(out, /^  speed 6$/m);
  assert.match(out, /^  inst 0, \$21, \$09, \$84, \$0800, \$0064, \$27, \$1F {3}# Lead$/m);
  assert.match(out, /^  order 0, 1, 0$/m);
  assert.match(out, /^  pat 0, 0, "C-4 00 V24"$/m);
  assert.match(out, /^  pat 1, 0, "C-4 00 V24"$/m);
  assert.ok(!/^  pat \d, [12],/m.test(out), "empty voices are skipped");
});

test("UB export: more than 8 patterns are truncated with a note", () => {
  const out = buildBlock(10, [9, 0]);
  assert.match(out, /only the first 8 patterns/);
  assert.match(out, /^  order 7, 0$/m);
  assert.ok(!/^  pat 8,/m.test(out));
});
