const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");

function extractFunctionSource(name) {
  const marker = `function ${name}(`;
  const start = appJs.indexOf(marker);
  assert.notStrictEqual(start, -1, `Missing function ${name}`);
  let depth = 0;
  let end = -1;
  let seenBrace = false;
  for (let i = start; i < appJs.length; i++) {
    const ch = appJs[i];
    if (ch === "{") { depth += 1; seenBrace = true; }
    else if (ch === "}") {
      depth -= 1;
      if (seenBrace && depth === 0) { end = i + 1; break; }
    }
  }
  assert.notStrictEqual(end, -1, `Could not parse function ${name}`);
  return appJs.slice(start, end);
}

function loadFunctions(names, extraContext = {}) {
  const context = { ...extraContext };
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
      "evaluateFillExpression"
    ],
    { program: extraProgram }
  );
}

// Full context for compileLineBytes FILL tests (mirrors createMacroContext from macro-core.test.js)
function createFillCtx(extraContext = {}) {
  return loadFunctions(
    [
      "parseAddressValue",
      "encodeTextMacro",
      "encodePetsciiMacro",
      "parsePetsciiCharValue",
      "parseByteMacro",
      "parseFillMacro",
      "parseNumberByBase",
      "parseMacroNumber",
      "resolveProgramValueWithConst",
      "resolveProgramNumericValue",
      "parseDelayFrameCount",
      "parseMacroAddress",
      "parseMacroCountOrSize",
      "resolveProgramConstValue",
      "lookupProgramConstValue",
      "evaluateFillExpression",
      "addLayoutLabels",
      "buildOperandPreview",
      "validateRange",
      "normalizeProgramOperands",
      "getAsmDisplayOperand",
      "getDeferredMemorySections",
      "_expertNormalizeRegionName",
      "_expertResetRegionHighlight",
      "_expertStampRegionFoldSignatures",
      "_expertCopyRegionFoldState",
      "_expertGetHiddenRegionLines",
      "_expertFindCurrentRegionBounds",
      "_expertVisibleLineToSourceLine",
      "_layoutLineSortAddress",
      "_disasmLineSortAddress",
      "_compareLayoutLineRefs",
      "_compareDisasmLayoutLineRefs",
      "_buildDisasmHTML",
      "_splitAsmLineComment",
      "parseExpertText",
      "_blockToExpertLine",
      "validateSpriteInitMacro",
      "validateSpritePosMacro",
      "compileAbsoluteStore",
      "compilePrintHexA",
      "getDeferredMacroAddressField",
      "getProgramLayout",
      "compileLineBytes",
      "resolveNumericOperand",
      "resolveRelativeOperand",
      "parseWordMacro",
      "getInstructionSize"
    ],
    {
      crypto: { randomUUID: () => "00000000-0000-4000-8000-000000000000" },
      _escHtml: (v) => String(v).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c])),
      getLiveValidationError: () => "",
      opcodeMap: {
        LDA: { absolute: 0xAD, absoluteX: 0xBD, absoluteY: 0xB9, immediate: 0xA9, zeroPage: 0xA5 },
        CMP: { immediate: 0xC9, absolute: 0xCD },
        CPX: { immediate: 0xE0, absolute: 0xEC },
        CPY: { immediate: 0xC0, absolute: 0xCC },
        BNE: { relative: 0xD0 },
        BEQ: { relative: 0xF0 },
        BCS: { relative: 0xB0 },
        BCC: { relative: 0x90 }
      },
      t: (key) => key,
      tf: (_key, values) => values?.mnemonic || "?",
      addressingModes: {
        implied: { needsOperand: false },
        immediate: { needsOperand: true },
        zeroPage: { needsOperand: true },
        zeroPageX: { needsOperand: true },
        zeroPageY: { needsOperand: true },
        absolute: { needsOperand: true },
        absoluteX: { needsOperand: true },
        absoluteY: { needsOperand: true },
        indirect: { needsOperand: true },
        indirectX: { needsOperand: true },
        indirectY: { needsOperand: true },
        relative: { needsOperand: true }
      },
      DELAY_HELPER_LABEL: "__delay_wait_frames",
      parseOriginValue: () => ({ value: 0x0801, text: "$0801", error: "" }),
      resolveProgramConstValue: function (name) {
        const target = String(name || "").trim().toLowerCase();
        const blocks = Array.isArray(this.program) ? this.program : [];
        const match = blocks.find(
          (b) => b.isConstMacro && b.constName && b.constName.toLowerCase() === target
        );
        return match ? match.constValue : null;
      },
      formatAddress: (v) => `$${v.toString(16).toUpperCase().padStart(4, "0")}`,
      showMacroSource: false,
      defaultOrigin: 0x0801,
      program: [],
      userMacros: {},
      ...extraContext
    }
  );
}

function compileBlock(ctx, block, labels = new Map(), address = 0x1000) {
  const result = ctx.compileLineBytes({ address, block }, labels);
  if (!result.ok) assert.fail(result.error || "compileLineBytes failed");
  return Array.from(result.bytes);
}

// ─────────────────────────────────────────────────────────
// evaluateFillExpression — expression evaluation
// ─────────────────────────────────────────────────────────

test("evaluateFillExpression: hex literal $FF → 255", () => {
  const ctx = makeExprCtx();
  assert.equal(ctx.evaluateFillExpression("$FF"), 255);
  assert.equal(ctx.evaluateFillExpression("$00"), 0);
  assert.equal(ctx.evaluateFillExpression("$10"), 16);
  assert.equal(ctx.evaluateFillExpression("$C000"), 0xC000);
});

test("evaluateFillExpression: binary literal %10110000 → 176", () => {
  const ctx = makeExprCtx();
  assert.equal(ctx.evaluateFillExpression("%10110000"), 0b10110000);
  assert.equal(ctx.evaluateFillExpression("%00000001"), 1);
  assert.equal(ctx.evaluateFillExpression("%11111111"), 255);
  assert.equal(ctx.evaluateFillExpression("%00000000"), 0);
});

test("evaluateFillExpression: arithmetic operators + - * /", () => {
  const ctx = makeExprCtx();
  assert.equal(ctx.evaluateFillExpression("2 + 3"), 5);
  assert.equal(ctx.evaluateFillExpression("10 - 3"), 7);
  assert.equal(ctx.evaluateFillExpression("4 * 5"), 20);
  assert.equal(ctx.evaluateFillExpression("8 / 2"), 4);
  assert.equal(ctx.evaluateFillExpression("$10 + 1"), 17);
  assert.equal(ctx.evaluateFillExpression("100 - $64"), 0);
});

test("evaluateFillExpression: combined hex and binary literals", () => {
  const ctx = makeExprCtx();
  // $10 = 16, %00001111 = 15 → 16 + 15 = 31
  assert.equal(ctx.evaluateFillExpression("$10 + %00001111"), 31);
  // $FF & %10110000 - bitwise AND is not listed but operator precedence
  // test arithmetic: $80 + %01000000 = 128 + 64 = 192
  assert.equal(ctx.evaluateFillExpression("$80 + %01000000"), 192);
});

test("evaluateFillExpression: round() function", () => {
  const ctx = makeExprCtx();
  assert.equal(ctx.evaluateFillExpression("round(3.7)"), 4);
  assert.equal(ctx.evaluateFillExpression("round(3.2)"), 3);
  assert.equal(ctx.evaluateFillExpression("round(0.5)"), 1);
  assert.equal(ctx.evaluateFillExpression("round(-1.6)"), -2);
});

test("evaluateFillExpression: abs() function", () => {
  const ctx = makeExprCtx();
  assert.equal(ctx.evaluateFillExpression("abs(-42)"), 42);
  assert.equal(ctx.evaluateFillExpression("abs(42)"), 42);
  assert.equal(ctx.evaluateFillExpression("abs(0)"), 0);
  assert.equal(ctx.evaluateFillExpression("abs(-128)"), 128);
});

test("evaluateFillExpression: max(a,b) and min(a,b)", () => {
  const ctx = makeExprCtx();
  assert.equal(ctx.evaluateFillExpression("max(3, 7)"), 7);
  assert.equal(ctx.evaluateFillExpression("max(7, 3)"), 7);
  assert.equal(ctx.evaluateFillExpression("min(3, 7)"), 3);
  assert.equal(ctx.evaluateFillExpression("min(7, 3)"), 3);
  assert.equal(ctx.evaluateFillExpression("max($00, $FF)"), 255);
  assert.equal(ctx.evaluateFillExpression("min($00, $FF)"), 0);
});

test("evaluateFillExpression: PI constant", () => {
  const ctx = makeExprCtx();
  assert.equal(ctx.evaluateFillExpression("round(PI)"), 3);
  // 2*PI ≈ 6.28, round → 6
  assert.equal(ctx.evaluateFillExpression("round(2 * PI)"), 6);
});

test("evaluateFillExpression: sin() trigonometry with PI", () => {
  const ctx = makeExprCtx();
  // sin(0) = 0
  assert.equal(ctx.evaluateFillExpression("round(sin(0))"), 0);
  // sin(PI/2) = 1 → round(127 * 1) = 127
  assert.equal(ctx.evaluateFillExpression("round(127 * sin(PI / 2))"), 127);
  // sin(PI) ≈ 0 → round(127 * sin(PI)) = 0
  assert.equal(ctx.evaluateFillExpression("round(127 * sin(PI))"), 0);
});

test("evaluateFillExpression: cos() trigonometry with PI", () => {
  const ctx = makeExprCtx();
  // cos(0) = 1 → round(128 * 1) = 128
  assert.equal(ctx.evaluateFillExpression("round(128 * cos(0))"), 128);
  // cos(PI) = -1 → round(128 * -1) = -128
  assert.equal(ctx.evaluateFillExpression("round(128 * cos(PI))"), -128);
  // cos(PI/2) ≈ 0 → round(128 * cos(PI/2)) = 0
  assert.equal(ctx.evaluateFillExpression("round(128 * cos(PI / 2))"), 0);
});

test("evaluateFillExpression: lo(expr) extracts low byte", () => {
  const ctx = makeExprCtx();
  assert.equal(ctx.evaluateFillExpression("lo($1234)"), 0x34);
  assert.equal(ctx.evaluateFillExpression("lo($C000)"), 0x00);
  assert.equal(ctx.evaluateFillExpression("lo($FF)"), 0xFF);
  assert.equal(ctx.evaluateFillExpression("lo($0401)"), 0x01);
});

test("evaluateFillExpression: hi(expr) extracts high byte", () => {
  const ctx = makeExprCtx();
  assert.equal(ctx.evaluateFillExpression("hi($1234)"), 0x12);
  assert.equal(ctx.evaluateFillExpression("hi($C000)"), 0xC0);
  assert.equal(ctx.evaluateFillExpression("hi($00FF)"), 0x00);
  assert.equal(ctx.evaluateFillExpression("hi($0401)"), 0x04);
});

test("evaluateFillExpression: lo/hi with arithmetic", () => {
  const ctx = makeExprCtx();
  // lo($C000 + $100) = lo($C100) = 0x00
  assert.equal(ctx.evaluateFillExpression("lo($C000 + $100)"), 0x00);
  // hi($C000 + $100) = hi($C100) = 0xC1
  assert.equal(ctx.evaluateFillExpression("hi($C000 + $100)"), 0xC1);
});

test("evaluateFillExpression: <label and >label low/high syntax", () => {
  const ctx = makeExprCtx();
  const labels = new Map([["SCREEN", 0xD400]]);
  // <SCREEN = lo($D400) = 0x00
  assert.equal(ctx.evaluateFillExpression("<SCREEN", labels), 0x00);
  // >SCREEN = hi($D400) = 0xD4
  assert.equal(ctx.evaluateFillExpression(">SCREEN", labels), 0xD4);
});

test("evaluateFillExpression: i variable from vars", () => {
  const ctx = makeExprCtx();
  assert.equal(ctx.evaluateFillExpression("i * 2", null, { i: 3 }), 6);
  assert.equal(ctx.evaluateFillExpression("$FF - i", null, { i: 5 }), 250);
  assert.equal(ctx.evaluateFillExpression("i * i", null, { i: 4 }), 16);
  assert.equal(ctx.evaluateFillExpression("i + $10", null, { i: 0 }), 16);
});

test("evaluateFillExpression: label references", () => {
  const ctx = makeExprCtx();
  const labels = new Map([["COUNT", 10], ["BASE", 0xC000]]);
  assert.equal(ctx.evaluateFillExpression("COUNT", labels), 10);
  assert.equal(ctx.evaluateFillExpression("COUNT * 2", labels), 20);
  assert.equal(ctx.evaluateFillExpression("hi(BASE)", labels), 0xC0);
});

test("evaluateFillExpression: unknown identifier → null", () => {
  const ctx = makeExprCtx();
  assert.equal(ctx.evaluateFillExpression("UNKNOWN_VAR"), null);
});

test("evaluateFillExpression: empty string → null", () => {
  const ctx = makeExprCtx();
  assert.equal(ctx.evaluateFillExpression(""), null);
  assert.equal(ctx.evaluateFillExpression(null), null);
  assert.equal(ctx.evaluateFillExpression(undefined), null);
});

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
// FILL block compilation via compileLineBytes
// ─────────────────────────────────────────────────────────

test("FILL: fixed decimal count and hex value", () => {
  const ctx = createFillCtx();
  const bytes = compileBlock(ctx, { mnemonic: "FILL", isFillMacro: true, rawOperand: "5, $AA", base: "hex" });
  assert.deepEqual(bytes, [0xAA, 0xAA, 0xAA, 0xAA, 0xAA]);
});

test("FILL: binary literal value %10110000", () => {
  const ctx = createFillCtx();
  const bytes = compileBlock(ctx, { mnemonic: "FILL", isFillMacro: true, rawOperand: "3, %10110000", base: "dec" });
  assert.deepEqual(bytes, [0b10110000, 0b10110000, 0b10110000]);
});

test("FILL: hex count and zero value", () => {
  const ctx = createFillCtx();
  const bytes = compileBlock(ctx, { mnemonic: "FILL", isFillMacro: true, rawOperand: "$04, $00", base: "hex" });
  assert.deepEqual(bytes, [0x00, 0x00, 0x00, 0x00]);
});

test("FILL: i-variable produces per-index bytes ($FF - i)", () => {
  const ctx = createFillCtx();
  const bytes = compileBlock(
    ctx,
    { mnemonic: "FILL", isFillMacro: true, rawOperand: "4, $FF - i", base: "hex" },
    new Map(),
    0x1000
  );
  // i=0→255, i=1→254, i=2→253, i=3→252
  assert.deepEqual(bytes, [255, 254, 253, 252]);
});

test("FILL: i-variable squared (i*i) produces per-index bytes", () => {
  const ctx = createFillCtx();
  const bytes = compileBlock(
    ctx,
    { mnemonic: "FILL", isFillMacro: true, rawOperand: "5, i * i", base: "dec" },
    new Map(),
    0x1000
  );
  // i=0→0, i=1→1, i=2→4, i=3→9, i=4→16
  assert.deepEqual(bytes, [0, 1, 4, 9, 16]);
});

test("FILL: sin(PI * i / 4) sine table generation", () => {
  const ctx = createFillCtx();
  const bytes = compileBlock(
    ctx,
    { mnemonic: "FILL", isFillMacro: true, rawOperand: "5, round(127 * sin(PI * i / 4))", base: "dec" },
    new Map(),
    0x1000
  );
  // i=0: round(127 * sin(0)) = 0
  // i=1: round(127 * sin(PI/4)) = round(127 * 0.7071...) = round(89.8) = 90
  // i=2: round(127 * sin(PI/2)) = round(127 * 1) = 127
  // i=3: round(127 * sin(3*PI/4)) = same as i=1 = 90
  // i=4: round(127 * sin(PI)) = round(127 * ~0) = 0
  assert.deepEqual(bytes, [0, 90, 127, 90, 0]);
});

test("FILL: cos(PI * i / 4) cosine table generation", () => {
  const ctx = createFillCtx();
  const bytes = compileBlock(
    ctx,
    { mnemonic: "FILL", isFillMacro: true, rawOperand: "3, round(127 * cos(PI * i / 4))", base: "dec" },
    new Map(),
    0x1000
  );
  // i=0: round(127 * cos(0)) = 127
  // i=1: round(127 * cos(PI/4)) = round(127 * 0.7071) = 90
  // i=2: round(127 * cos(PI/2)) = round(127 * ~0) = 0
  assert.deepEqual(bytes, [127, 90, 0]);
});

test("FILL: lo() and hi() in value expression", () => {
  const ctx = createFillCtx();
  const loBytes = compileBlock(ctx, { mnemonic: "FILL", isFillMacro: true, rawOperand: "3, lo($C080)", base: "hex" });
  const hiBytes = compileBlock(ctx, { mnemonic: "FILL", isFillMacro: true, rawOperand: "3, hi($C080)", base: "hex" });
  assert.deepEqual(loBytes, [0x80, 0x80, 0x80]);
  assert.deepEqual(hiBytes, [0xC0, 0xC0, 0xC0]);
});

test("FILL: round(sin()) result & 0xFF wraps negative values", () => {
  const ctx = createFillCtx();
  // sin(PI) ≈ 0, cos(PI) = -1 → round(128 * cos(PI)) = -128 → & 0xFF = 128
  const bytes = compileBlock(
    ctx,
    { mnemonic: "FILL", isFillMacro: true, rawOperand: "1, round(128 * cos(PI))", base: "dec" },
    new Map(),
    0x1000
  );
  assert.deepEqual(bytes, [(-128) & 0xFF]);
});

test("FILL: label in count expression", () => {
  const ctx = createFillCtx();
  const labels = new Map([["SIZE", 4]]);
  const bytes = compileBlock(
    ctx,
    { mnemonic: "FILL", isFillMacro: true, rawOperand: "SIZE, $EA", base: "hex" },
    labels,
    0x1000
  );
  assert.deepEqual(bytes, [0xEA, 0xEA, 0xEA, 0xEA]);
});

test("FILL: abs() in value expression", () => {
  const ctx = createFillCtx();
  const bytes = compileBlock(ctx, { mnemonic: "FILL", isFillMacro: true, rawOperand: "3, abs(-64)", base: "dec" });
  assert.deepEqual(bytes, [64, 64, 64]);
});

test("FILL: max() and min() in value expression", () => {
  const ctx = createFillCtx();
  const maxBytes = compileBlock(ctx, { mnemonic: "FILL", isFillMacro: true, rawOperand: "2, max($10, $80)", base: "hex" });
  const minBytes = compileBlock(ctx, { mnemonic: "FILL", isFillMacro: true, rawOperand: "2, min($10, $80)", base: "hex" });
  assert.deepEqual(maxBytes, [0x80, 0x80]);
  assert.deepEqual(minBytes, [0x10, 0x10]);
});

test("FILL: invalid operand (missing value) → compile error", () => {
  const ctx = createFillCtx();
  const result = ctx.compileLineBytes(
    { address: 0x1000, block: { mnemonic: "FILL", isFillMacro: true, rawOperand: "10", base: "dec" } },
    new Map()
  );
  assert.equal(result.ok, false);
});

test("FILL: getInstructionSize returns count for fixed expressions", () => {
  const ctx = createFillCtx();
  assert.equal(ctx.getInstructionSize({ isFillMacro: true, rawOperand: "10, $00", base: "dec" }), 10);
  assert.equal(ctx.getInstructionSize({ isFillMacro: true, rawOperand: "$08, $FF", base: "hex" }), 8);
});
