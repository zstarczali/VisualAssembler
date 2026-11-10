const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");

const extractFunction = require("./helpers/extract-function");
const { codeOf, compileText, vmaTest } = require("./helpers/vma-cli");

// `.fill raw` built by the VMA compiler: its bytes.
const fill = (raw, before = "") => codeOf(`.fill ${raw}`, { org: 0x1000, before });
const extractFunctionSource = name => extractFunction(appJs, name);

function loadFunctions(names, extraContext = {}) {
  // no project: the program without the Project settings prelude (_projVmaWithPrelude)
  const context = { _projVmaWithPrelude: (blocks) => blocks, ...extraContext };
  vm.createContext(context);
  for (const name of names) {
    vm.runInContext(`${extractFunctionSource(name)}; this["${name}"] = ${name};`, context);
  }
  return context;
}

// Minimal context for evaluateFillExpression and parseFillMacro standalone tests
function makeExprCtx(extraProgram = []) {
  return loadFunctions(
    [
      "parseNumberByBase",
      "parseMacroNumber",
      "resolveProgramConstValue",
      "lookupProgramConstValue",
      "resolveProgramValueWithConst",
      "resolveProgramNumericValue",
      "parseFillMacro",
      "_evalJsExprSafe"
    ],
    { program: extraProgram }
  );
}

// ─────────────────────────────────────────────────────────
// parseFillMacro — parameter parsing
// ─────────────────────────────────────────────────────────

test("parseFillMacro: decimal count, hex value", () => {
  const ctx = makeExprCtx();
  const result = ctx.parseFillMacro("10, $00");
  assert.notEqual(result, null);
  assert.equal(result.count, 10);
  assert.equal(result.value, 0);
});

test("parseFillMacro: hex count and value", () => {
  const ctx = makeExprCtx();
  const result = ctx.parseFillMacro("$10, $FF", "hex");
  assert.notEqual(result, null);
  assert.equal(result.count, 16);
  assert.equal(result.value, 255);
});

test("parseFillMacro: binary value literal %10110000 → 176", () => {
  const ctx = makeExprCtx();
  const result = ctx.parseFillMacro("8, %10110000");
  assert.notEqual(result, null);
  assert.equal(result.count, 8);
  assert.equal(result.value, 0b10110000);
});

test("parseFillMacro: sin(PI/2) expression evaluates in value", () => {
  const ctx = makeExprCtx();
  const result = ctx.parseFillMacro("3, round(127 * sin(PI / 2))");
  assert.notEqual(result, null);
  assert.equal(result.count, 3);
  assert.equal(result.value, 127);
});

test("parseFillMacro: cos(0) expression evaluates in value", () => {
  const ctx = makeExprCtx();
  const result = ctx.parseFillMacro("4, round(128 * cos(0))");
  assert.notEqual(result, null);
  assert.equal(result.count, 4);
  assert.equal(result.value, 128);
});

test("parseFillMacro: countExpr and valueExpr strings preserved", () => {
  const ctx = makeExprCtx();
  const result = ctx.parseFillMacro("10, round(sin(PI * i / 4) * 127)");
  assert.notEqual(result, null);
  assert.equal(result.countExpr, "10");
  assert.equal(result.valueExpr, "round(sin(PI * i / 4) * 127)");
});

test("parseFillMacro: max(a,b) in value expression", () => {
  const ctx = makeExprCtx();
  const result = ctx.parseFillMacro("5, max($40, $80)");
  assert.notEqual(result, null);
  assert.equal(result.value, 0x80);
});

test("parseFillMacro: abs() in value expression", () => {
  const ctx = makeExprCtx();
  const result = ctx.parseFillMacro("2, abs(-100)");
  assert.notEqual(result, null);
  assert.equal(result.value, 100);
});

test("parseFillMacro: lo() and hi() in value expression", () => {
  const ctx = makeExprCtx();
  const lo = ctx.parseFillMacro("2, lo($C080)");
  const hi = ctx.parseFillMacro("2, hi($C080)");
  assert.notEqual(lo, null);
  assert.notEqual(hi, null);
  assert.equal(lo.value, 0x80);
  assert.equal(hi.value, 0xC0);
});

test("parseFillMacro: single parameter → null", () => {
  const ctx = makeExprCtx();
  assert.equal(ctx.parseFillMacro("10"), null);
  assert.equal(ctx.parseFillMacro("$FF"), null);
});

test("parseFillMacro: empty string → null", () => {
  const ctx = makeExprCtx();
  assert.equal(ctx.parseFillMacro(""), null);
  assert.equal(ctx.parseFillMacro(null), null);
});

test("parseFillMacro: three parameters → null", () => {
  const ctx = makeExprCtx();
  assert.equal(ctx.parseFillMacro("10, $00, $FF"), null);
});

// ─────────────────────────────────────────────────────────
// FILL compiled by the VMA compiler (CLI)
// ─────────────────────────────────────────────────────────

vmaTest("FILL: fixed decimal count and hex value", () => {
  const bytes = fill("5, $AA");
  assert.deepEqual(bytes, [0xAA, 0xAA, 0xAA, 0xAA, 0xAA]);
});

vmaTest("FILL: binary literal value %10110000", () => {
  const bytes = fill("3, %10110000");
  assert.deepEqual(bytes, [0b10110000, 0b10110000, 0b10110000]);
});

vmaTest("FILL: hex count and zero value", () => {
  const bytes = fill("$04, $00");
  assert.deepEqual(bytes, [0x00, 0x00, 0x00, 0x00]);
});

vmaTest("FILL: i-variable produces per-index bytes ($FF - i)", () => {
  const bytes = fill("4, $FF - i");
  // i=0→255, i=1→254, i=2→253, i=3→252
  assert.deepEqual(bytes, [255, 254, 253, 252]);
});

vmaTest("FILL: i-variable squared (i*i) produces per-index bytes", () => {
  const bytes = fill("5, i * i");
  // i=0→0, i=1→1, i=2→4, i=3→9, i=4→16
  assert.deepEqual(bytes, [0, 1, 4, 9, 16]);
});

vmaTest("FILL: sin(PI * i / 4) sine table generation", () => {
  const bytes = fill("5, round(127 * sin(PI * i / 4))");
  // i=0: round(127 * sin(0)) = 0
  // i=1: round(127 * sin(PI/4)) = round(127 * 0.7071...) = round(89.8) = 90
  // i=2: round(127 * sin(PI/2)) = round(127 * 1) = 127
  // i=3: round(127 * sin(3*PI/4)) = same as i=1 = 90
  // i=4: round(127 * sin(PI)) = round(127 * ~0) = 0
  assert.deepEqual(bytes, [0, 90, 127, 90, 0]);
});

vmaTest("FILL: exact 256-byte sine table expression compiles", () => {
  const bytes = fill("256, round( 64 * sin( i * 2 * PI / 256 ) )");

  assert.equal(bytes.length, 256);
  assert.deepEqual(
    [0, 1, 2, 63, 64, 127, 128, 191, 192, 255].map((i) => bytes[i]),
    [0, 2, 3, 64, 64, 2, 0, 192, 192, 254]
  );
});

vmaTest("FILL: unsigned 64+64*sin table stays in byte-friendly range", () => {
  const bytes = fill("256, round( 64 + 64 * sin( i * 2 * PI / 256 ) )");

  assert.equal(bytes.length, 256);
  assert.deepEqual(
    [0, 64, 128, 192].map((i) => bytes[i]),
    [64, 128, 64, 0]
  );
  assert.equal(Math.min(...bytes), 0);
  assert.equal(Math.max(...bytes), 128);
});

vmaTest("FILL: centered 128+127*sin table stays unsigned without wrap", () => {
  const bytes = fill("256, round( 128 + 127 * sin( i * 2 * PI / 256 ) )");

  assert.equal(bytes.length, 256);
  assert.deepEqual(
    [0, 64, 128, 192].map((i) => bytes[i]),
    [128, 255, 128, 1]
  );
  assert.equal(Math.min(...bytes), 1);
  assert.equal(Math.max(...bytes), 255);
});

vmaTest("FILL: cos(PI * i / 4) cosine table generation", () => {
  const bytes = fill("3, round(127 * cos(PI * i / 4))");
  // i=0: round(127 * cos(0)) = 127
  // i=1: round(127 * cos(PI/4)) = round(127 * 0.7071) = 90
  // i=2: round(127 * cos(PI/2)) = round(127 * ~0) = 0
  assert.deepEqual(bytes, [127, 90, 0]);
});

vmaTest("FILL: lo() and hi() in value expression", () => {
  const loBytes = fill("3, lo($C080)");
  const hiBytes = fill("3, hi($C080)");
  assert.deepEqual(loBytes, [0x80, 0x80, 0x80]);
  assert.deepEqual(hiBytes, [0xC0, 0xC0, 0xC0]);
});

vmaTest("FILL: round(sin()) result & 0xFF wraps negative values", () => {
  // sin(PI) ≈ 0, cos(PI) = -1 → round(128 * cos(PI)) = -128 → & 0xFF = 128
  const bytes = fill("1, round(128 * cos(PI))");
  assert.deepEqual(bytes, [(-128) & 0xFF]);
});

vmaTest("FILL: label in count expression", () => {
  const bytes = fill("SIZE, $EA", ".const SIZE = 4");
  assert.deepEqual(bytes, [0xEA, 0xEA, 0xEA, 0xEA]);
});

vmaTest("FILL: abs() in value expression", () => {
  const bytes = fill("3, abs(-64)");
  assert.deepEqual(bytes, [64, 64, 64]);
});

vmaTest("FILL: max() and min() in value expression", () => {
  const maxBytes = fill("2, max($10, $80)");
  const minBytes = fill("2, min($10, $80)");
  assert.deepEqual(maxBytes, [0x80, 0x80]);
  assert.deepEqual(minBytes, [0x10, 0x10]);
});

vmaTest("FILL: invalid operand (missing value) → compile error", () => {
  assert.equal(compileText("* = $1000\n.fill 10\n", { basicStub: false }).ok, false);
});

vmaTest("FILL: the size is the count for fixed expressions", () => {
  assert.equal(fill("10, $00").length, 10);
  assert.equal(fill("$08, $FF").length, 8);
});
