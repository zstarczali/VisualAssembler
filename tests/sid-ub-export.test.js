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

function buildBlock() {
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(`
    const _SID_ROWS = 32; let _sidSpeed = 6;
    const _SID_FX_CODES = { V: 1, U: 2, D: 3, C: 4, F: 5 };
    function _sidWaveByte() { return 0x41; }
    let _sidInsts = [{ name: "Lead", a: 0, d: 9, s: 8, r: 4, pw: 2048, cut: 100, res: 2, lp: true, bp: false, hp: false, vol: 15 }];
    let _sidPatterns = [[0, 1, 2].map(() => Array.from({ length: 32 }, (_, r) => ({ note: r % 4 ? null : r, inst: 0, fx: null, fxval: 0 })))];
    let _sidSong = [0];
    ${extractFunctionSource("_sidExportAsmPlayable")}
    ${appJs.match(/const _SID_UB_ZP_SHIFT = [^;]+;/)[0]}
    ${extractFunctionSource("_sidExportUbBlock")}
    this.out = _sidExportUbBlock();
  `, ctx);
  return ctx.out;
}

test("UB export: single asm block that starts the player and jumps over the body", () => {
  const out = buildBlock();
  const lines = out.split("\n");
  assert.equal(lines[3], "asm {");
  assert.equal(lines[4].trim(), "JSR sid_init");
  assert.equal(lines[5].trim(), "JMP sid_end");
  assert.equal(lines[lines.length - 2], "sid_end:");
  assert.equal(lines[lines.length - 1], "}");
  assert.equal(out.split("}").length - 1, 1, "stray } would end the UB asm block early");
});

test("UB export: nothing the UB inline assembler cannot parse", () => {
  const out = buildBlock();
  assert.ok(!/\.byte|\* *=|\.word/.test(out));
  assert.ok(!/[A-Za-z_]\+\d/.test(out.replace(/;.*$/gm, "")), "label+N is unsupported in UB asm");
  assert.ok(/^sid_instruments_p8:$/m.test(out));
});

test("UB export: player zero page moved out of UB's $02+ variable area, data untouched", () => {
  const out = buildBlock();
  const code = out.split("\n").filter((l) => !l.trim().startsWith("#")).join("\n");
  assert.ok(!/[ (]\$(0[2-9A-F]|1[0-9A-F]|2[0-9A-F])[,)\s]/i.test(code.replace(/^\s+\$[0-9A-F, $]+$/gim, "").replace(/#\$[0-9A-F]+/gi, "")));
  assert.match(out, /LDA \(\$50\),Y/);
  assert.match(out, /STA \$FB/);
});
