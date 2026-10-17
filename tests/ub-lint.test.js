const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8").replace(/\r\n/g, "\n");

function load() {
  const start = appJs.indexOf("const _UB_LINT_IRQ_EXITS");
  const end = appJs.indexOf("let _ubLintHints = [];");
  assert.ok(start > 0 && end > start);
  const context = {};
  vm.createContext(context);
  vm.runInContext(appJs.slice(start, end) + "\nthis.lint = (t, r) => JSON.stringify(_ubLint(t, r));", context);
  return (text, result) => JSON.parse(context.lint(text, result)).map((h) => h.key + "@" + h.srcLine + (h.values.name ? ":" + h.values.name : ""));
}

test("sys to the KERNAL IRQ exit and wait key", () => {
  const lint = load();
  assert.deepEqual(lint("sub tick\n  inc border\n  sys $EA31\nend sub\nwait key"), ["ubLintSysIrqExit@2", "ubLintWaitKey@4"]);
  assert.deepEqual(lint("sys 60033 # decimal $EA81"), ["ubLintSysIrqExit@0"]);
  assert.deepEqual(lint("# sys $EA31 in a comment\nprint \"sys $EA31\""), []);
});

test("unused declarations", () => {
  const lint = load();
  assert.deepEqual(lint("var score = 0\nvar lives = 3\nprint score"), ["ubLintUnused@1:lives"]);
  assert.deepEqual(lint("dim t as byte\nasm {\n  LDA t\n}"), []);
});

test("asm zero page conflicts need a build result", () => {
  const lint = load();
  const src = "var x = 1\nprint x\nasm {\n  LDA #$FB\n  STA $FB ; ok?\n  LDA ($02),Y\n}\nasm { STA $D020 }";
  assert.deepEqual(lint(src), []);
  const result = { map: { variables: [{ name: "x", address: 0xFB, type: "byte" }], internal: { plotZp: 0x02, sinTableAddress: 0xC000 } } };
  assert.deepEqual(lint(src, result), ["ubLintZpConflict@4:x", "ubLintZpConflict@5:UB plotZp"]);
});
