const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");

function loadSafe() {
  const start = appJs.indexOf("function _evalJsExprSafe(");
  const end = appJs.indexOf("// Shared arithmetic-expression evaluator", start);
  assert.ok(start > 0 && end > start, "_evalJsExprSafe not found");
  const context = { Math };
  vm.createContext(context);
  vm.runInContext(appJs.slice(start, end) + "\nthis.safe = _evalJsExprSafe;", context);
  return context.safe;
}

// The release build's CSP has no 'unsafe-eval': Function()/eval() throw there.
test("app.js does not evaluate code with Function() or eval()", () => {
  const code = appJs.replace(/\/\/.*$/gm, "");
  assert.doesNotMatch(code, /(?<![\w.$])(?:new\s+)?Function\s*\(/);
  assert.doesNotMatch(code, /(?<![\w.$])eval\s*\(/);
});

test("matches JavaScript for the expressions the evaluators produce", () => {
  const safe = loadSafe();
  const lo = (v) => v & 0xFF, hi = (v) => (v >> 8) & 0xFF;
  const js = (e) => Function("lo", "hi", `"use strict"; return (${e});`)(lo, hi);
  for (const e of [
    "1", "0x9200", "0b1010", "1+2*3", "(1+2)*3", "10-2-3", "100/8/2", "17%5", "2**3**2",
    "-5+3", "- -4", "~0x0F & 0xFF", "!0", "1<<4|1", "0xFF00>>8", "-16>>>28",
    "40896 <= 0x9200", "0x9300 <= 0x9200", "1 == 1", "2 != 2", "5 > 3 && 2 < 1", "0 || 7",
    "1 ? 10 : 20", "0 ? 10 : 1 ? 30 : 40", "1*16", "0x4000+2000*3", "lo(0x1234)", "hi(0x1234)",
    "lo((0x4000)+1)", "Math.round(2.5)", "Math.max(1, 7, 3)", "Math.min(4, -2)", "Math.abs(-9)",
    "Math.round(Math.sin(Math.PI/2)*127)", "Math.floor(7/2)", "1.5*2", ".5+1e1", "0x10 ^ 0x01",
    "(((5)))", "3 - -2 * 4"
  ]) {
    assert.equal(safe(e), js(e), e);
  }
});

test("rejects anything that is not an arithmetic expression", () => {
  const safe = loadSafe();
  for (const e of ["", "1+", "(1", "1)", "alert(1)", "constructor", "x", "1;2", "[1]", "'a'", "Math.random()", "a=1"]) {
    assert.throws(() => safe(e), e);
  }
});
