const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");

function sliceBalanced(startMarker, openChar, closeChar) {
  const start = appJs.indexOf(startMarker);
  assert.notStrictEqual(start, -1, `missing ${startMarker}`);
  const open = appJs.indexOf(openChar, start);
  let depth = 0;
  for (let i = open; i < appJs.length; i++) {
    if (appJs[i] === openChar) depth++;
    else if (appJs[i] === closeChar) {
      depth--;
      if (depth === 0) return appJs.slice(start, i + 1);
    }
  }
  throw new Error(`unbalanced ${startMarker}`);
}

function extractFn(name) {
  const marker = `function ${name}(`;
  const start = appJs.indexOf(marker);
  assert.notStrictEqual(start, -1, `missing ${name}`);
  let depth = 0, seen = false;
  for (let i = start; i < appJs.length; i++) {
    if (appJs[i] === "{") { depth++; seen = true; }
    else if (appJs[i] === "}") { depth--; if (seen && depth === 0) return appJs.slice(start, i + 1); }
  }
  throw new Error(`unbalanced ${name}`);
}

const arrLit = sliceBalanced("const _EXPERT_MNEM_SET = new Set(", "[", "]");
const arr = eval(arrLit.slice(arrLit.indexOf("[")));

const ctx = { _EXPERT_MNEM_SET: new Set(arr) };
vm.createContext(ctx);
vm.runInContext(`${extractFn("_expertHighlightLine")}; this._expertHighlightLine = _expertHighlightLine;`, ctx);

const hl = (s) => ctx._expertHighlightLine(s);

test("long-branch pseudo-ops are highlighted as mnemonics in the Expert editor", () => {
  for (const mn of ["LBNE", "LBEQ", "LBCC", "LBCS", "LBMI", "LBPL", "LBVC", "LBVS"]) {
    assert.ok(
      hl(`    ${mn} target`).includes(`<span class="hl-mnem">${mn}</span>`),
      `${mn} should be hl-mnem`
    );
  }
});

test(".assert is highlighted as a directive", () => {
  assert.ok(hl("    .assert * < $A000").includes(`<span class="hl-directive">.assert</span>`));
});

test("local label definition `.name:` is highlighted as a label, not a directive", () => {
  const out = hl(".loop:");
  assert.ok(out.includes(`<span class="hl-label">.loop</span>`), out);
});

test("SMC operand label keeps mnemonic + label highlighting", () => {
  const out = hl("    LDA value:#$00");
  assert.ok(out.includes(`<span class="hl-mnem">LDA</span>`));
  assert.ok(out.includes(`<span class="hl-label">value:</span>`));
});
