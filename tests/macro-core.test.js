const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");

const extractFunction = require("./helpers/extract-function");
const extractFunctionSource = name => extractFunction(appJs, name);
const { codeOf, compileText, loadPrg, labelOf, vmaTest } = require("./helpers/vma-cli");

function loadFunctions(names, extraContext = {}) {
  // no project: the program without the Project settings prelude (_projVmaWithPrelude)
  const context = { _projVmaWithPrelude: (blocks) => blocks, ...extraContext };
  vm.createContext(context);
  for (const name of names) {
    // the compiler's own functions are gone (the VMA compiler is Rust): only the parser / editor ones
    if (!new RegExp(`(^|\\n)(async )?function ${name.replace(/\$/g, "\\$")}\\(`).test(appJs)) continue;
    vm.runInContext(`${extractFunctionSource(name)}; this["${name}"] = ${name};`, context);
  }
  return context;
}

function createMacroContext(extraContext = {}) {
  const ctx = loadFunctions(
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
      "_evalJsExprSafe",
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
      "_expertDirRe",
      "_expertVisibleLineToSourceLine",
      "_expertEditLineComments",
      "_layoutLineSortAddress",
      "_disasmLineSortAddress",
      "_compareLayoutLineRefs",
      "_compareDisasmLayoutLineRefs",
      "_buildDisasmHTML",
      "_splitAsmLineComment",
      "_kickScopeRewrite", "parseExpertText",
      "_blockToExpertLine", "chunkBytes",
      "_blockToExpertSourceLine",
      "validateSpriteInitMacro",
      "validateSpritePosMacro",
      "compileAbsoluteStore",
      "compilePrintHexA",
      "getDeferredMacroAddressField",
      "_scopeLocalLabels", "_narrowConstZeroPage", "getProgramLayout", "addAllLayoutLabels",
      "_substituteStarPc",
      "_hasStarPcRef",
      "_evalJsExprSafe",
      "_evalAsmExpr",
      "_branchOffsetFromTarget",
      "_incBinPayload",
      "_joyIsVarMode",
      "_joyPortValue",
      "_joyReadBytes",
      "_joyVarBytes",
      "_joystickSize",
      "compileLineBytes",
      "resolveNumericOperand",
      "resolveRelativeOperand",
      "parseWordMacro",
      "getInstructionSize", "_charLiteralToHex", "_ifConditionActive"
    ],
    {
      INCLUDE_MAX_DEPTH: 16,
      _ZP_NARROW: { absolute: "zeroPage", absoluteX: "zeroPageX", absoluteY: "zeroPageY" },
      crypto: { randomUUID: () => "00000000-0000-4000-8000-000000000000" },
      _escHtml: (value) => String(value).replace(/[&<>]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[ch])),
      getLiveValidationError: () => "",
      opcodeMap: {
        LDA: { absolute: 0xAD, absoluteX: 0xBD, absoluteY: 0xB9, immediate: 0xA9, zeroPage: 0xA5 },
        STA: { absolute: 0x8D, absoluteX: 0x9D, zeroPage: 0x85 },
        JMP: { absolute: 0x4C, indirect: 0x6C },
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
      resolveProgramConstValue: function(name) {
        const target = String(name || "").trim().toLowerCase();
        const blocks = Array.isArray(this.program) ? this.program : [];
        const match = blocks.find((block) => block.isConstMacro && block.constName && block.constName.toLowerCase() === target);
        return match ? match.constValue : null;
      },
      formatAddress: (value) => `$${value.toString(16).toUpperCase().padStart(4, "0")}`,
      showMacroSource: false,
      defaultOrigin: 0x0801,
      program: [],
      userMacros: {},
      ...extraContext
    }
  );
  // the compiler's answers for one block, from the VMA compiler (CLI)
  ctx.compileLineBytes = (line, labels = new Map()) => compileLine(ctx, line.block, labels, line.address);
  ctx.getInstructionSize = (block) => {
    const r = compileLine(ctx, block);
    return r.ok ? r.bytes.length : 0;
  };
  return ctx;
}

// A whole program through the VMA compiler (no BASIC stub): the answer, its memory, the bytes
// from `from` to `to` and a symbol's value (label, const, var, local label as Global.name).
function prog(src, files = null) {
  const r = compileText(src, { basicStub: false, files });
  assert.equal(r.ok, true, r.error);
  const mem = loadPrg(r.bytes).mem;
  const value = (name) => {
    const row = (r.listing || []).find(l => l[7] === name && l[10] != null);
    return row ? row[10] : labelOf(r, name);
  };
  return { r, mem, value, bytes: (from, to) => Array.from(mem.subarray(from, to)) };
}

// A block's bytes from the VMA compiler: its Expert line at `address`, the labels as equates
// in front, the program's .const blocks too.
function blockSource(ctx, block, labels = new Map()) {
  const equates = [...labels].map(([name, value]) => `${name} = $${value.toString(16)}`);
  const consts = (ctx.program || []).filter(b => b.isConstMacro).map(b => ctx._blockToExpertLine(b));
  return { line: ctx._blockToExpertLine(block), before: [...consts, ...equates].join("\n") };
}

function compileBlock(ctx, block, labels = new Map(), address = 0x1000) {
  const { line, before } = blockSource(ctx, block, labels);
  return codeOf(line, { org: address, before });
}

// compileLineBytes' answer for a block: { ok, bytes, error }.
function compileLine(ctx, block, labels = new Map(), address = 0x1000) {
  const { line, before } = blockSource(ctx, block, labels);
  try {
    return { ok: true, bytes: codeOf(line, { org: address, before }) };
  } catch (e) {
    return { ok: false, error: String(e.message) };
  }
}

test("_blockToExpertLine emits Kick `:NAME(args)` for INVOKE with `:` syntax (not `.: NAME`)", () => {
  const ctx = createMacroContext();
  const line = ctx._blockToExpertLine({
    isMacroInvoke: true,
    invokeMacroName: "DrawCircle",
    invokeArgs: "110, 70, 35, $02",
    invokeSyntax: ":"
  });
  assert.equal(line, ":DrawCircle(110, 70, 35, $02)");

  const dotLine = ctx._blockToExpertLine({
    isMacroInvoke: true,
    invokeMacroName: "DrawCircle",
    invokeArgs: "110",
    invokeSyntax: "invoke"
  });
  assert.equal(dotLine, ".invoke DrawCircle(110)");
});

test("parseExpertText round-trips `:NAME(args)` and legacy `.: NAME(args)` back to INVOKE", () => {
  const ctx = loadFunctions(
    ["_splitAsmLineComment", "_kickScopeRewrite", "parseExpertText", "_importMakeComment"],
    {
      crypto: { randomUUID: () => "00000000-0000-4000-8000-000000000000" },
      t: (k) => k, tf: (k) => k,
      _importMnemonicCategory: () => "Test",
      _importMnemonicDescription: () => "",
      parseAsmText: () => []
    }
  );
  const kick = ctx.parseExpertText(":DrawCircle(110, 70, 35, $02)");
  assert.equal(kick[0].isMacroInvoke, true);
  assert.equal(kick[0].invokeMacroName, "DrawCircle");
  assert.equal(kick[0].invokeArgs, "110, 70, 35, $02");

  const legacy = ctx.parseExpertText(".: DrawCircle(110, 70, 35, $02)");
  assert.equal(legacy[0].isMacroInvoke, true);
  assert.equal(legacy[0].invokeMacroName, "DrawCircle");
  assert.equal(legacy[0].invokeArgs, "110, 70, 35, $02");
});

vmaTest("resolveNumericOperand handles #<N and #>N with bare decimal N (macro expansion)", () => {
  const ctx = createMacroContext();
  // After a Kick macro `.macro Foo(x) { lda #<x }` is invoked as `Foo(110)`,
  // the reparsed block ends up as: rawOperand="<110", base="hex" (fallback).
  // Without the auto-detect, parseNumberByBase("110","hex") would return 272
  // and the low byte would be $10 (=16) instead of the intended 110 ($6E).
  const lowBytes = compileBlock(ctx, {
    mnemonic: "LDA", addressingMode: "immediate",
    rawOperand: "<110", operand: "#<110", base: "hex"
  }, new Map(), 0x1000);
  assert.deepEqual(lowBytes, [0xA9, 0x6E]);

  const highBytes = compileBlock(ctx, {
    mnemonic: "LDA", addressingMode: "immediate",
    rawOperand: ">110", operand: "#>110", base: "hex"
  }, new Map(), 0x1000);
  assert.deepEqual(highBytes, [0xA9, 0x00]);

  // A `<$XXXX` still parses as hex.
  const hexLow = compileBlock(ctx, {
    mnemonic: "LDA", addressingMode: "immediate",
    rawOperand: "<$0110", operand: "#<$0110", base: "hex"
  }, new Map(), 0x1000);
  assert.deepEqual(hexLow, [0xA9, 0x10]);
});

vmaTest("runtime IF emits CMP+BNE skip with the right relative offset", () => {
  const p = prog("* = $1000\n.if A == #$10\n nop\n nop\n nop\n nop\n.endif\nafter:\n");
  assert.deepEqual(p.bytes(0x1000, 0x1004), [0xC9, 0x10, 0xD0, 0x04]);
  assert.equal(p.value("after"), 0x1008);
});

vmaTest("runtime IF supports X and Y registers too", () => {
  for (const [reg, op] of [["X", 0xE0], ["Y", 0xC0]]) {
    const p = prog(`* = $1000\n.if ${reg} == #$10\n nop\n nop\n nop\n nop\n.endif\n`);
    assert.deepEqual(p.bytes(0x1000, 0x1004), [op, 0x10, 0xD0, 0x04]);
  }
});

vmaTest("runtime WHILE and ENDW compile to loop skip plus jump-back", () => {
  // WHILE $2000-$2003, body $2004-$2005, ENDW = JMP $2000 at $2006, end $2009
  const p = prog("* = $2000\n.while A != #$00\n nop\n nop\n.endw\nafter:\n");
  assert.deepEqual(p.bytes(0x2000, 0x2004), [0xC9, 0x00, 0xF0, 0x05]);
  assert.deepEqual(p.bytes(0x2006, 0x2009), [0x4C, 0x00, 0x20]);
  assert.equal(p.value("after"), 0x2009);
});

vmaTest("runtime WHILE and UNTIL also support X/Y register variants", () => {
  for (const [reg, op] of [["X", 0xE0], ["Y", 0xC0]]) {
    const w = prog(`* = $2000\n.while ${reg} != #$00\n nop\n.endw\n`);
    assert.deepEqual(w.bytes(0x2000, 0x2003), [op, 0x00, 0xF0]);
    const u = prog(`* = $3000\n.repeat\n nop\n.until ${reg} != #$00\nafter:\n`);
    assert.deepEqual(u.bytes(0x3001, 0x3004), [op, 0x00, 0xF0]);
    assert.equal(u.value("after") - 0x3001, 4);
  }
});

vmaTest("MEMCPY partial copy emits counted indexed loop and correct size", () => {
  const ctx = createMacroContext();
  const bytes = compileBlock(ctx, {
    mnemonic: "MEMCPY",
    isMemCpyMacro: true,
    memcpySrc: "$C000",
    memcpyDst: "$0400",
    memcpySize: "$0003"
  }, new Map(), 0x3000);

  assert.deepEqual(bytes, [
    0xA2, 0x00,
    0xBD, 0x00, 0xC0,
    0x9D, 0x00, 0x04,
    0xE8,
    0xE0, 0x03,
    0xD0, 0xF5
  ]);
  assert.equal(ctx.getInstructionSize({
    isMemCpyMacro: true,
    memcpySize: "$0003"
  }), 13);
});

vmaTest("MEMSET partial fill emits shared-LDA loop and correct size", () => {
  const ctx = createMacroContext();
  const bytes = compileBlock(ctx, {
    mnemonic: "MEMSET",
    isMemSetMacro: true,
    memsetDst: "$0400",
    memsetValue: "$20",
    memsetSize: "$0003"
  }, new Map(), 0x3100);

  assert.deepEqual(bytes, [
    0xA9, 0x20,
    0xA2, 0x00,
    0x9D, 0x00, 0x04,
    0xE8,
    0xE0, 0x03,
    0xD0, 0xF8
  ]);
  assert.equal(ctx.getInstructionSize({
    isMemSetMacro: true,
    memsetSize: "$0003"
  }), 12);
});

vmaTest("PRINT lower emits inline PETSCII data and print loop", () => {
  const ctx = createMacroContext();
  const bytes = compileBlock(ctx, {
    mnemonic: "PRINT",
    isPrintMacro: true,
    rawOperand: "HI",
    printCharset: "lower"
  }, new Map(), 0x0800);

  assert.deepEqual(bytes, [
    0x4C, 0x06, 0x08,
    0x68, 0x69, 0x00,
    0xA2, 0x00,
    0xBD, 0x03, 0x08,
    0xF0, 0x06,
    0x20, 0xD2, 0xFF,
    0xE8,
    0xD0, 0xF5
  ]);
  assert.equal(ctx.getInstructionSize({
    isPrintMacro: true,
    rawOperand: "HI",
    printCharset: "lower"
  }), 19);
});

vmaTest("PRINT_CHAR resolves const labels case-insensitively", () => {
  const ctx = createMacroContext();
  const labels = new Map([["newline", 0x0D]]);
  const bytes = compileBlock(ctx, {
    mnemonic: "PRINT_CHAR",
    isPrintCharMacro: true,
    rawOperand: "NEWLINE"
  }, labels, 0x3200);

  assert.deepEqual(bytes, [0xA9, 0x0D, 0x20, 0xD2, 0xFF]);
});

test("expert region fold state carries over by region signature", () => {
  const ctx = createMacroContext();
  const oldBlocks = [
    { isRegionMacro: true, regionName: "Print", regionCollapsed: true },
    { isEndRegionMacro: true },
    { isRegionMacro: true, regionName: "Loop", regionCollapsed: false },
    { isEndRegionMacro: true }
  ];
  const newBlocks = [
    { isRegionMacro: true, regionName: "Print", regionCollapsed: false, collapsed: false },
    { isEndRegionMacro: true },
    { isRegionMacro: true, regionName: "Loop", regionCollapsed: false, collapsed: false },
    { isEndRegionMacro: true }
  ];

  ctx._expertCopyRegionFoldState(oldBlocks, newBlocks);

  assert.equal(newBlocks[0].regionCollapsed, true);
  assert.equal(newBlocks[0].collapsed, true);
  assert.equal(newBlocks[2].regionCollapsed, false);
  assert.equal(newBlocks[2].collapsed, false);
});

test("_expertStampRegionFoldSignatures distinguishes nested and repeated regions", () => {
  const ctx = createMacroContext();
  const blocks = [
    { isRegionMacro: true, regionName: "Print" },
    { isRegionMacro: true, regionName: "Inner" },
    { isEndRegionMacro: true },
    { isEndRegionMacro: true },
    { isRegionMacro: true, regionName: "print" },
    { isEndRegionMacro: true }
  ];

  ctx._expertStampRegionFoldSignatures(blocks);

  assert.equal(blocks[0]._regionFoldSig, "/print#1");
  assert.equal(blocks[1]._regionFoldSig, "/print#1/inner#1");
  assert.equal(blocks[4]._regionFoldSig, "/print#2");
});

test("_expertGetHiddenRegionLines hides nested content inside collapsed regions", () => {
  const ctx = createMacroContext();
  const blocks = [
    { isRegionMacro: true, regionName: "Outer", regionCollapsed: true, _srcLine: 0 },
    { isRegionMacro: true, regionName: "Inner", regionCollapsed: false, _srcLine: 1 },
    { isPrintMacro: true, _srcLine: 2 },
    { isEndRegionMacro: true, _srcLine: 3 },
    { isEndRegionMacro: true, _srcLine: 4 },
    { isEndMacro: true, _srcLine: 5 }
  ];

  const hidden = ctx._expertGetHiddenRegionLines(blocks);

  assert.deepEqual(Array.from(hidden).sort((a, b) => a - b), [1, 2, 3, 4]);
});

test("_expertResetRegionHighlight clears stale region highlight state", () => {
  let applied = 0;
  const ctx = createMacroContext({
    expertMode: true,
    expertEditor: {},
    _expertRegionHighlight: { start: 2, end: 4 },
    _expertApplyHighlight: () => { applied += 1; }
  });

  ctx._expertResetRegionHighlight();

  assert.equal(ctx._expertRegionHighlight, null);
  assert.equal(applied, 1);
});

test("folded inner regions do not confuse current region detection", () => {
  const ctx = createMacroContext();
  const sourceLines = [
    ".region Outer",
    ".region Inner",
    ".print \"hello\"",
    ".endregion",
    "LDA #$00",
    ".endregion",
    ".end"
  ];

  const region = ctx._expertFindCurrentRegionBounds(sourceLines, 4);
  const outside = ctx._expertFindCurrentRegionBounds(sourceLines, 6);

  assert.deepEqual(JSON.parse(JSON.stringify(region)), { start: 0, end: 5, name: "Outer" });
  assert.equal(outside, null);
});

test("_expertVisibleLineToSourceLine uses the projected line map when regions are collapsed", () => {
  const ctx = createMacroContext({
    _expertProjectionActive: true,
    _expertDisplayToSourceLines: [0, 1, 4, 5]
  });

  assert.equal(ctx._expertVisibleLineToSourceLine(0, { lines: ["a", "b", "c", "d"] }), 0);
  assert.equal(ctx._expertVisibleLineToSourceLine(2, { lines: ["a", "b", "c", "d"] }), 4);
  assert.equal(ctx._expertVisibleLineToSourceLine(99, { lines: ["a", "b", "c", "d"] }), 5);
});

test("expert line comment shortcuts preserve indentation and cover selected lines", () => {
  const ctx = createMacroContext();
  const source = "label:\n    lda #1\n    sta $d020\nrts";
  const commented = ctx._expertEditLineComments(source, 7, 28, false);

  assert.equal(commented.text, "label:\n    // lda #1\n    // sta $d020\nrts");
  assert.equal(commented.text.slice(commented.selectionStart, commented.selectionEnd), "    // lda #1\n    // sta $d020");

  const uncommented = ctx._expertEditLineComments(
    commented.text,
    commented.selectionStart,
    commented.selectionEnd,
    true
  );
  assert.equal(uncommented.text, source);
});

test("expert text parsing treats // as a comment delimiter", () => {
  const ctx = loadFunctions(["_splitAsmLineComment"], {
    crypto: { randomUUID: () => "00000000-0000-4000-8000-000000000000" }
  });

  const parsed = ctx._splitAsmLineComment('.text 1, 2, "A" // note');
  assert.equal(parsed.code.trim(), '.text 1, 2, "A"');
  assert.equal(parsed.commentPrefix, "//");
  assert.equal(parsed.commentText, "note");
});

test("expert uncomment leaves non-commented lines unchanged and excludes a trailing line", () => {
  const ctx = createMacroContext();
  const source = "; one\n  lda #1\n; three";
  const result = ctx._expertEditLineComments(source, 0, 15, true);

  assert.equal(result.text, "one\n  lda #1\n; three");
});

test("expert source rendering keeps an attached inline comment on its line", () => {
  const ctx = createMacroContext();
  assert.equal(ctx._blockToExpertSourceLine({ isLabel: true, labelName: "start", inlineComment: "hehe" }), "start: ; hehe");
});

vmaTest("PUSH expands registers in stack order", () => {
  const ctx = createMacroContext();
  const bytes = compileBlock(ctx, {
    mnemonic: "PUSH",
    isPushMacro: true,
    pushRegs: "AXY"
  }, new Map(), 0x3200);

  assert.deepEqual(bytes, [0x48, 0x8A, 0x48, 0x98, 0x48]);
  assert.equal(ctx.getInstructionSize({ isPushMacro: true, pushRegs: "AXY" }), 5);
});

vmaTest("PULL restores registers in reverse stack order", () => {
  const ctx = createMacroContext();
  const bytes = compileBlock(ctx, {
    mnemonic: "PULL",
    isPullMacro: true,
    pullRegs: "AXY"
  }, new Map(), 0x3200);

  assert.deepEqual(bytes, [0x68, 0xA8, 0x68, 0xAA, 0x68]);
  assert.equal(ctx.getInstructionSize({ isPullMacro: true, pullRegs: "AXY" }), 5);
});

vmaTest("SPRITE_INIT writes sprite pointer, enable bit, multicolor bit, and color", () => {
  const ctx = createMacroContext();
  const bytes = compileBlock(ctx, {
    mnemonic: "SPRITE_INIT",
    isSpriteInitMacro: true,
    spriteNum: "2",
    spriteColor: "5",
    spriteDataPage: "40",
    spriteMulticolor: false
  }, new Map(), 0x3300);

  assert.deepEqual(bytes, [
    0xA9, 0x40,
    0x8D, 0xFA, 0x07,
    0xAD, 0x15, 0xD0,
    0x09, 0x04,
    0x8D, 0x15, 0xD0,
    0xAD, 0x1C, 0xD0,
    0x29, 0xFB,
    0x8D, 0x1C, 0xD0,
    0xA9, 0x05,
    0x8D, 0x29, 0xD0
  ]);
  assert.equal(ctx.getInstructionSize({ isSpriteInitMacro: true }), 26);
});

vmaTest("SPRITE_INIT accepts consts and multicolor in compile", () => {
  const ctx = createMacroContext();
  const labels = new Map([
    ["SPRITE_NUM", 2],
    ["SPRITE_COLOR", 5],
    ["SPRITE_PAGE", 0x40]
  ]);
  const bytes = compileBlock(ctx, {
    mnemonic: "SPRITE_INIT",
    isSpriteInitMacro: true,
    spriteNum: "SPRITE_NUM",
    spriteColor: "SPRITE_COLOR",
    spriteDataPage: "SPRITE_PAGE",
    spriteMulticolor: true
  }, labels, 0x3380);

  assert.deepEqual(bytes, [
    0xA9, 0x40,
    0x8D, 0xFA, 0x07,
    0xAD, 0x15, 0xD0,
    0x09, 0x04,
    0x8D, 0x15, 0xD0,
    0xAD, 0x1C, 0xD0,
    0x09, 0x04,
    0x8D, 0x1C, 0xD0,
    0xA9, 0x05,
    0x8D, 0x29, 0xD0
  ]);
});

test("SPRITE_INIT validation accepts consts for byte-sized fields", () => {
  const ctx = createMacroContext({
    program: [
      { isConstMacro: true, constName: "SPRITE_NUM", constValue: 2 },
      { isConstMacro: true, constName: "SPRITE_COLOR", constValue: 5 },
      { isConstMacro: true, constName: "SPRITE_PAGE", constValue: 0x40 }
    ]
  });
  assert.equal(ctx.validateSpriteInitMacro("SPRITE_NUM", "SPRITE_COLOR", "SPRITE_PAGE"), "");
});

vmaTest("SPRITE_POS updates X low byte, D010 bit, and Y position", () => {
  const ctx = createMacroContext();
  const bytes = compileBlock(ctx, {
    mnemonic: "SPRITE_POS",
    isSpritePosMacro: true,
    spriteNum: "2",
    spriteX: "300",
    spriteY: "99"
  }, new Map(), 0x3400);

  assert.deepEqual(bytes, [
    0xA9, 0x2C,
    0x8D, 0x04, 0xD0,
    0xAD, 0x10, 0xD0,
    0x09, 0x04,
    0x8D, 0x10, 0xD0,
    0xA9, 0x63,
    0x8D, 0x05, 0xD0
  ]);
  assert.equal(ctx.getInstructionSize({ isSpritePosMacro: true }), 18);
});

vmaTest("SPRITE_POS accepts consts for sprite number and coordinates", () => {
  const ctx = createMacroContext({
    program: [
      { isConstMacro: true, constName: "SPRITE_NUM", constValue: 2 },
      { isConstMacro: true, constName: "SPRITE_X", constValue: 300 },
      { isConstMacro: true, constName: "SPRITE_Y", constValue: 99 }
    ]
  });
  assert.equal(ctx.validateSpritePosMacro("SPRITE_NUM", "SPRITE_X", "SPRITE_Y"), "");
  const labels = new Map([["SPRITE_NUM", 2], ["SPRITE_X", 300], ["SPRITE_Y", 99]]);
  const bytes = compileBlock(ctx, {
    mnemonic: "SPRITE_POS",
    isSpritePosMacro: true,
    spriteNum: "SPRITE_NUM",
    spriteX: "SPRITE_X",
    spriteY: "SPRITE_Y"
  }, labels, 0x3400);

  assert.deepEqual(bytes, [
    0xA9, 0x2C,
    0x8D, 0x04, 0xD0,
    0xAD, 0x10, 0xD0,
    0x09, 0x04,
    0x8D, 0x10, 0xD0,
    0xA9, 0x63,
    0x8D, 0x05, 0xD0
  ]);
});

test("expert SPRITE_INIT roundtrips multicolor and const operands", () => {
  const ctx = createMacroContext();
  const blocks = ctx.parseExpertText(".sprite_init SPRITE_NUM, SPRITE_COLOR, $40, multicolor");

  assert.equal(blocks.length, 1);
  assert.equal(blocks[0].isSpriteInitMacro, true);
  assert.equal(blocks[0].spriteNum, "SPRITE_NUM");
  assert.equal(blocks[0].spriteColor, "SPRITE_COLOR");
  assert.equal(blocks[0].spriteDataPage, "40");
  assert.equal(blocks[0].spriteMulticolor, true);
  assert.equal(ctx._blockToExpertLine(blocks[0]), ".sprite_init SPRITE_NUM, SPRITE_COLOR, $40, multicolor");
});

test("expert SPRITE_POS roundtrips const operands", () => {
  const ctx = createMacroContext();
  const blocks = ctx.parseExpertText(".sprite_pos SPRITE_NUM, SPRITE_X, SPRITE_Y");

  assert.equal(blocks.length, 1);
  assert.equal(blocks[0].isSpritePosMacro, true);
  assert.equal(blocks[0].spriteNum, "SPRITE_NUM");
  assert.equal(blocks[0].spriteX, "SPRITE_X");
  assert.equal(blocks[0].spriteY, "SPRITE_Y");
  assert.equal(ctx._blockToExpertLine(blocks[0]), ".sprite_pos SPRITE_NUM, SPRITE_X, SPRITE_Y");
});

vmaTest("LOADFILE emits KERNAL setup, override address, and error branch", () => {
  const ctx = createMacroContext();
  const labels = new Map([["fail", 0x4228]]);
  const bytes = compileBlock(ctx, {
    mnemonic: "LOADFILE",
    isLoadFileMacro: true,
    loadFileName: "demo",
    loadFileDevice: "8",
    loadFileAddress: "$C000",
    loadFileErrorLabel: "fail"
  }, labels, 0x4200);

  assert.deepEqual(bytes, [
    0x4C, 0x07, 0x42,
    0x44, 0x45, 0x4D, 0x4F,
    0xA9, 0x04, 0xA2, 0x03, 0xA0, 0x42, 0x20, 0xBD, 0xFF,
    0xA9, 0x01, 0xA2, 0x08, 0xA0, 0x00, 0x20, 0xBA, 0xFF,
    0xA2, 0x00, 0xA0, 0xC0,
    0xA9, 0x00, 0x20, 0xD5, 0xFF,
    0xB0, 0x04
  ]);
  assert.equal(bytes.length, 36);
});

vmaTest("PRINT_HEX renders X with the register prefix", () => {
  const ctx = createMacroContext();
  const bytes = compileBlock(ctx, {
    mnemonic: "PRINT_HEX",
    isPrintHexMacro: true,
    printReg: "X"
  }, new Map(), 0x3500);

  assert.deepEqual(bytes, [
    0x8A,
    0x48, 0x4A, 0x4A, 0x4A, 0x4A,
    0xC9, 0x0A, 0x90, 0x02, 0x69, 0x06, 0x69, 0x30, 0x20, 0xD2, 0xFF,
    0x68, 0x29, 0x0F,
    0xC9, 0x0A, 0x90, 0x02, 0x69, 0x06, 0x69, 0x30, 0x20, 0xD2, 0xFF
  ]);
  assert.equal(ctx.getInstructionSize({ isPrintHexMacro: true, printReg: "X" }), 31);
});

test("buildBasicSysStub emits a valid BASIC SYS line (classic no-space format)", () => {
  const ctx = loadFunctions(["buildBasicSysStub"], {});
  // 0x1234 = 4660 decimal → "4660" digits → nextLine = $080B, no space after SYS token
  const bytes = Array.from(ctx.buildBasicSysStub(0x1234));

  // [load=$0801][nextLine=$080B][line10][SYS]['4']['6']['6']['0'][EOL][end $00 $00]
  assert.deepEqual(bytes.slice(0, 9), [0x01, 0x08, 0x0B, 0x08, 0x0A, 0x00, 0x9E, 0x34, 0x36]);
  assert.equal(bytes[9],  0x36);   // '6' third digit
  assert.equal(bytes[10], 0x30);   // '0' fourth digit
  assert.equal(bytes[11], 0x00);   // EOL
  assert.deepEqual(bytes.slice(-2), [0x00, 0x00]);  // BASIC end marker
});

vmaTest("the default origin is $C000 when BASIC SYS is off", () => {
  const r = compileText(" nop\n rts\n", { basicStub: false });
  assert.equal(r.ok, true, r.error);
  assert.deepEqual(Array.from(r.bytes), [0x00, 0xC0, 0xEA, 0x60]);
});

test("parseExpertText recognizes .region, .endregion, and .end", () => {
  const ctx = loadFunctions(
    ["_splitAsmLineComment", "_importMakeRegion", "_importMakeEndRegion", "_importMakeEndMacro", "_kickScopeRewrite", "parseExpertText"],
    {
      crypto: { randomUUID: () => "00000000-0000-4000-8000-000000000000" }
    }
  );

  const blocks = ctx.parseExpertText(".region Print\n.endregion\n.end");

  assert.equal(blocks[0].isRegionMacro, true);
  assert.equal(blocks[0].regionName, "Print");
  assert.equal(blocks[1].isEndRegionMacro, true);
  assert.equal(blocks[2].isEndMacro, true);
});

test("parseExpertText imports core Kick Assembler syntax used by macro-heavy sources", () => {
  const ctx = loadFunctions(
    [
      "_splitAsmLineComment",
      "_importMakeComment",
      "_importParseScalar",
      "_importDetectListBase",
      "parseNumberByBase",
      "_importMakeConst",
      "_importMakeMacroDefStart",
      "_importMakeMacroDefEnd",
      "_importMakeInstruction",
      "_importMakeLabel",
      "_importMakeByte",
      "parseAsmText",
      "_kickScopeRewrite", "parseExpertText", "_charLiteralToHex"
    ],
    {
      crypto: { randomUUID: () => "00000000-0000-4000-8000-000000000000" },
      t: (key) => key,
      tf: (key) => key,
      _importMnemonicCategory: () => "Teszt",
      _importMnemonicDescription: () => "",
      _EXPERT_MNEM_SET: new Set(["JMP"])
    }
  );

  const blocks = ctx.parseExpertText([
    ".pc = $0801",
    "// BASIC autostart",
    ".const BMPSCREEN = $6000 // screen base",
    ".macro DrawCircle(px, py, pr, pc) {",
    "    lda #pc // set color",
    "}",
    "start:",
    "    DrawCircle(110, 70, 35, $02)",
    "    .byte $01,$02 // payload",
    "    jmp ($0408)",
    "    lsr a"
  ].join("\n"));

  assert.equal(blocks[0].isOrgMacro, true);
  assert.equal(blocks[0].orgAddress, "0801");

  assert.equal(blocks[1].isComment, true);
  assert.equal(blocks[1].commentText, "BASIC autostart");

  assert.equal(blocks[2].isConstMacro, true);
  assert.equal(blocks[2].constName, "BMPSCREEN");
  assert.equal(blocks[2].inlineComment, "screen base");

  assert.equal(blocks[3].isMacroDefStart, true);
  assert.equal(blocks[3].macroName, "DrawCircle");
  assert.equal(blocks[3].macroParams, "px, py, pr, pc");

  assert.equal(blocks[4].mnemonic, "LDA");
  assert.equal(blocks[4].addressingMode, "immediate");
  assert.equal(blocks[4].rawOperand, "pc");
  assert.equal(blocks[4].inlineComment, "set color");

  assert.equal(blocks[5].isMacroDefEnd, true);
  assert.equal(blocks[6].isLabel, true);
  assert.equal(blocks[6].labelName, "start");
  assert.equal(blocks[7].isMacroInvoke, true);
  assert.equal(blocks[7].invokeMacroName, "DrawCircle");
  assert.equal(blocks[7].invokeArgs, "110, 70, 35, $02");
  assert.equal(blocks[8].isByteMacro, true);
  assert.equal(blocks[8].inlineComment, "payload");
  // Same shape as a bare macro call, but JMP is an instruction.
  assert.equal(blocks[9].mnemonic, "JMP");
  assert.equal(blocks[9].addressingMode, "indirect");
  // The accumulator form, not address $0A.
  assert.equal(blocks[10].mnemonic, "LSR");
  assert.equal(blocks[10].addressingMode, "implied");
});

test("parseExpertText keeps decimal indexed operands as decimal absolute modes", () => {
  const ctx = loadFunctions(
    [
      "_splitAsmLineComment",
      "_importMakeComment",
      "_importParseScalar",
      "_importDetectListBase",
      "parseNumberByBase",
      "_importMakeConst",
      "_importMakeMacroDefStart",
      "_importMakeMacroDefEnd",
      "_importMakeInstruction",
      "_importMakeLabel",
      "_importMakeByte",
      "parseAsmText",
      "_kickScopeRewrite", "parseExpertText", "_charLiteralToHex"
    ],
    {
      crypto: { randomUUID: () => "00000000-0000-4000-8000-000000000000" },
      t: (key) => key,
      tf: (key) => key,
      _importMnemonicCategory: () => "Teszt",
      _importMnemonicDescription: () => ""
    }
  );

  const blocks = ctx.parseExpertText([
    "STA 1024,Y",
    "LDA 49152,X"
  ].join("\n"));

  assert.equal(blocks[0].mnemonic, "STA");
  assert.equal(blocks[0].addressingMode, "absoluteY");
  assert.equal(blocks[0].base, "dec");
  assert.equal(blocks[0].rawOperand, "1024");

  assert.equal(blocks[1].mnemonic, "LDA");
  assert.equal(blocks[1].addressingMode, "absoluteX");
  assert.equal(blocks[1].base, "dec");
  assert.equal(blocks[1].rawOperand, "49152");
});

test("DELAY keeps const names in expert mode", () => {
  const ctx = createMacroContext({
    program: [
      { id: "c1", mnemonic: "CONST", isConstMacro: true, constName: "_delay", rawOperand: "30", base: "dec", constValue: 30 },
      { id: "d1", mnemonic: "DELAY", isDelayMacro: true, delayFrames: "_delay" }
    ]
  });

  assert.equal(ctx._blockToExpertLine(ctx.program[1]), ".delay _delay");
});

vmaTest("DELAY accepts numeric frame counts in expert mode", () => {
  const ctx = createMacroContext({
    program: [
      { id: "c1", mnemonic: "CONST", isConstMacro: true, constName: "_delay", rawOperand: "30", base: "dec", constValue: 30 },
      { id: "d1", mnemonic: "DELAY", isDelayMacro: true, delayFrames: "30" }
    ]
  });
  const bytes = compileBlock(ctx, ctx.program[1], new Map(), 0x1000);

  // LDX #30, JSR the shared helper (right after the code: $1005)
  assert.deepEqual(bytes, [0xA2, 0x1E, 0x20, 0x05, 0x10]);
});

vmaTest("DELAY resolves const names when the helper label is present", () => {
  const ctx = createMacroContext({
    program: [
      { id: "c1", mnemonic: "CONST", isConstMacro: true, constName: "_delay", rawOperand: "30", base: "dec", constValue: 30 },
      { id: "d1", mnemonic: "DELAY", isDelayMacro: true, delayFrames: "_delay" }
    ]
  });
  const bytes = compileBlock(ctx, ctx.program[1], new Map(), 0x1000);

  // LDX #30, JSR the shared helper (right after the code: $1005)
  assert.deepEqual(bytes, [0xA2, 0x1E, 0x20, 0x05, 0x10]);
});

test("loaded instruction operands are normalized from raw labels", () => {
  const ctx = createMacroContext();
  const blocks = ctx.normalizeProgramOperands([
    {
      id: "b1",
      mnemonic: "LDA",
      addressingMode: "absoluteX",
      rawOperand: "row320lo",
      operand: "$row320lo,X",
      base: "hex"
    },
    {
      id: "b2",
      mnemonic: "LDA",
      addressingMode: "absoluteX",
      rawOperand: "bitmask",
      operand: "$bitmask,X",
      base: "hex"
    }
  ]);

  assert.equal(blocks[0].operand, "row320lo,X");
  assert.equal(blocks[1].operand, "bitmask,X");
});

test("expert display prefers the raw label form over stale serialized operands", () => {
  const ctx = createMacroContext();
  const block = {
    mnemonic: "LDA",
    addressingMode: "absoluteX",
    rawOperand: "row320lo",
    operand: "$row320lo,X",
    base: "hex"
  };

  assert.equal(ctx.getAsmDisplayOperand(block), "row320lo,X");
});

vmaTest("STRING and DATA emit inline store sequences", () => {
  const ctx = createMacroContext();

  const stringBytes = compileBlock(ctx, {
    mnemonic: "STRING",
    isStringMacro: true,
    rawOperand: "AB",
    stringAddress: "$C010"
  }, new Map(), 0x3600);

  const dataBytes = compileBlock(ctx, {
    mnemonic: "DATA",
    isDataMacro: true,
    rawOperand: "1,2",
    dataAddress: "$C020"
  }, new Map(), 0x3700);

  assert.deepEqual(stringBytes, [
    0xA9, 0x01, 0x8D, 0x10, 0xC0,
    0xA9, 0x02, 0x8D, 0x11, 0xC0
  ]);
  assert.deepEqual(dataBytes, [
    0xA9, 0x01, 0x8D, 0x20, 0xC0,
    0xA9, 0x02, 0x8D, 0x21, 0xC0
  ]);

});

vmaTest("RAWBYTES and RAWTEXT produce deferred sections at their target addresses", () => {
  const ctx = createMacroContext();
  const lines = [
    { id: "r1", mnemonic: "RAWBYTES", isRawBytesMacro: true, rawOperand: "1, $02, %00000011", rawBytesAddress: "$C120", base: "hex" },
    { id: "r2", mnemonic: "RAWTEXT", isRawTextMacro: true, rawOperand: "AB", rawTextAddress: "$C100", textCharset: "upper", base: "hex" }
  ].map(b => ctx._blockToExpertLine(b));
  const p = prog(`* = $1000\n${lines.join("\n")}\nafter:\n rts\n`);
  assert.deepEqual(p.bytes(0xC100, 0xC102), [0x01, 0x02]);
  assert.deepEqual(p.bytes(0xC120, 0xC123), [0x01, 0x02, 0x03]);
  assert.equal(p.value("after"), 0x1000, "no bytes in the code");
  const deferred = JSON.parse(JSON.stringify(p.r.memory.deferred.map(d => [d.type, d.address, d.end])));
  assert.deepEqual(deferred.sort((a, b) => a[1] - b[1]), [["rawtext", 0xC100, 0xC101], ["rawbytes", 0xC120, 0xC122]]);
});

vmaTest("FILL expands repeated bytes and ALIGN pads to the next boundary", () => {
  const ctx = createMacroContext();
  const fillBytes = compileBlock(ctx, {
    mnemonic: "FILL",
    isFillMacro: true,
    rawOperand: "4, $7E",
    base: "hex"
  }, new Map(), 0x3800);
  const alignBytes = compileBlock(ctx, {
    mnemonic: "ALIGN",
    isAlignMacro: true,
    rawOperand: "4",
    base: "hex"
  }, new Map(), 0x1003);

  const aligned = prog("* = $1000\n.byte 1,2,3\nalign_at:\n.align 4\nafter:\n");

  assert.deepEqual(fillBytes, [0x7E, 0x7E, 0x7E, 0x7E]);
  assert.deepEqual(alignBytes, [0x00]);
  assert.equal(aligned.value("align_at"), 0x1003);
  assert.equal(aligned.value("after"), 0x1004);
});

vmaTest("FILL supports expressions with consts, math functions, and byte masks", () => {
  const ctx = createMacroContext({
    program: [
      {
        id: "c1",
        mnemonic: "CONST",
        isConstMacro: true,
        constName: "PROJECTION_FOCAL",
        constValue: 40,
        rawOperand: "40",
        base: "dec"
      }
    ]
  });
  ctx.resolveProgramConstValue = (name) => {
    const target = String(name || "").trim().toLowerCase();
    const match = ctx.program.find((block) => block.isConstMacro && block.constName && block.constName.toLowerCase() === target);
    return match ? match.constValue : null;
  };

  const bytes = compileBlock(ctx, {
    mnemonic: "FILL",
    isFillMacro: true,
    rawOperand: "256, round( 128 * PROJECTION_FOCAL / max( 1, i ) ) & $FF",
    base: "dec"
  }, new Map(), 0x1150);

  assert.equal(bytes.length, 256);
  assert.equal(bytes[0], 0x00);
  assert.equal(bytes[255], 0x14);
});

vmaTest("SET_BORDER resolves const labels and writes VIC border color", () => {
  const ctx = createMacroContext();
  const labels = new Map([["color", 0x0A]]);
  const bytes = compileBlock(ctx, {
    mnemonic: "SET_BORDER",
    isSetBorderMacro: true,
    colorValue: "COLOR"
  }, labels, 0x3300);

  assert.deepEqual(bytes, [0xA9, 0x0A, 0x8D, 0x20, 0xD0]);
});

vmaTest("SET_BG resolves const labels and writes VIC background color", () => {
  const ctx = createMacroContext();
  const labels = new Map([["bg", 0x06]]);
  const bytes = compileBlock(ctx, {
    mnemonic: "SET_BG",
    isSetBgMacro: true,
    colorValue: "BG"
  }, labels, 0x3300);

  assert.deepEqual(bytes, [0xA9, 0x06, 0x8D, 0x21, 0xD0]);
});

vmaTest("CLEAR_SCREEN and WAIT_KEY emit the expected KERNAL calls", () => {
  const ctx = createMacroContext();
  assert.deepEqual(compileBlock(ctx, { mnemonic: "CLEAR_SCREEN", isClearScreenMacro: true }, new Map(), 0x3800), [0xA9, 0x93, 0x20, 0xD2, 0xFF]);
  assert.deepEqual(compileBlock(ctx, { mnemonic: "WAIT_KEY", isWaitKeyMacro: true }, new Map(), 0x3805), [0x20, 0xE4, 0xFF, 0xC9, 0x00, 0xF0, 0xF9]);
  assert.equal(ctx.getInstructionSize({ isClearScreenMacro: true }), 5);
  assert.equal(ctx.getInstructionSize({ isWaitKeyMacro: true }), 7);
});

vmaTest("CHARSET toggles VIC charset bit and WAIT_RASTER waits for a scanline", () => {
  const ctx = createMacroContext();
  assert.deepEqual(compileBlock(ctx, { mnemonic: "CHARSET", isCharsetMacro: true, charsetMode: "lower" }, new Map(), 0x3900), [0xAD, 0x18, 0xD0, 0x09, 0x02, 0x8D, 0x18, 0xD0]);
  assert.deepEqual(compileBlock(ctx, { mnemonic: "CHARSET", isCharsetMacro: true, charsetMode: "upper" }, new Map(), 0x3908), [0xAD, 0x18, 0xD0, 0x29, 0xFD, 0x8D, 0x18, 0xD0]);
  assert.deepEqual(compileBlock(ctx, { mnemonic: "WAIT_RASTER", isWaitRasterMacro: true, rasterLine: "FA" }, new Map(), 0x3910), [0xAD, 0x12, 0xD0, 0xC9, 0xFA, 0xD0, 0xF9]);
  assert.equal(ctx.getInstructionSize({ isCharsetMacro: true }), 8);
  assert.equal(ctx.getInstructionSize({ isWaitRasterMacro: true }), 7);
});

vmaTest("VAR blocks receive auto zero-page addresses in layout order", () => {
  const ctx = createMacroContext();
  const lines = [
    { id: "1", mnemonic: "VAR", isVarMacro: true, varName: "counter", varSize: 1, rawOperand: "", base: "hex" },
    { id: "2", mnemonic: "VAR", isVarMacro: true, varName: "timer", varSize: 2, rawOperand: "", base: "hex" }
  ].map(b => ctx._blockToExpertLine(b));
  const p = prog(`* = $1000\n${lines.join("\n")}\nafter:\n rts\n`);
  assert.equal(p.value("counter"), 0x02);
  assert.equal(p.value("timer"), 0x03);
  assert.equal(p.value("after"), 0x1000, "a VAR takes no bytes");
});

vmaTest("assembly IF/ELSE/ENDIF keeps the active branch and skips the other", () => {
  // CLEAR_SCREEN = 5 bytes, WAIT_KEY = 7 bytes
  const p = prog("* = $1000\n.define DEBUG\n.if DEBUG\n.clear_screen\n.else\n.wait_key\n.endif\nafter:\n");
  assert.equal(p.value("after") - 0x1000, 5);
});

vmaTest("assembly IF skips the then-branch when the symbol is not defined", () => {
  const p = prog("* = $1000\n.if RELEASE\n.clear_screen\n.else\n.wait_key\n.endif\nafter:\n");
  assert.equal(p.value("after") - 0x1000, 7);
});

vmaTest("LOOP/NEXT compiles a counted decrementing loop", () => {
  const ctx = createMacroContext();
  const lines = [
    { mnemonic: "LOOP", isLoopMacro: true, loopReg: "X", loopCount: "05", loopLabel: "loop1", base: "hex" },
    { mnemonic: "NEXT", isNextMacro: true, nextReg: "X", nextLabel: "loop1", base: "hex" }
  ].map(b => ctx._blockToExpertLine(b));
  const p = prog(`* = $4000\n${lines.join("\n")}\nafter:\n`);
  assert.deepEqual(p.bytes(0x4000, p.value("after")), [0xA2, 0x05, 0xCA, 0xD0, 0xFD]);
});

vmaTest("FOR/ENDF compiles a counted incrementing loop", () => {
  const ctx = createMacroContext();
  const lines = [
    { mnemonic: "FOR", isForMacro: true, loopReg: "Y", loopCount: "0A", loopLabel: "for1", base: "hex" },
    { mnemonic: "ENDF", isEndfMacro: true, nextReg: "Y", nextLabel: "for1", nextCount: "0A", base: "hex" }
  ].map(b => ctx._blockToExpertLine(b));
  const p = prog(`* = $4100\n${lines.join("\n")}\nafter:\n`);
  assert.deepEqual(p.bytes(0x4100, p.value("after")), [0xA0, 0x00, 0xC8, 0xC0, 0x0A, 0xD0, 0xFB]);
});

vmaTest("REPEAT/UNTIL compiles a runtime loop-back branch", () => {
  // REPEAT makes no bytes: UNTIL at $5000 branches back to itself
  const p = prog("* = $5000\n.repeat\n.until A != #$00\nafter:\n");
  assert.deepEqual(p.bytes(0x5000, p.value("after")), [0xC9, 0x00, 0xF0, 0xFC]);
});

vmaTest("IRQ_SETUP emits vector, raster and CIA setup bytes", () => {
  const ctx = createMacroContext();
  const labels = new Map([["my_irq", 0x1234]]);
  const bytes = compileBlock(ctx, {
    mnemonic: "IRQ_SETUP",
    isIrqSetupMacro: true,
    irqHandler: "my_irq",
    irqRaster: "FA"
  }, labels, 0x3400);

  assert.equal(bytes.length, 46);
  assert.deepEqual(bytes.slice(0, 15), [
    0x78,
    0xA9, 0x34, 0x8D, 0x14, 0x03,
    0xA9, 0x12, 0x8D, 0x15, 0x03,
    0xA9, 0xFA, 0x8D, 0x12
  ]);
  assert.deepEqual(bytes.slice(-9), [0xA9, 0x7F, 0x8D, 0x0D, 0xDC, 0xAD, 0x0D, 0xDC, 0x58]);

});

vmaTest("RAND emits the expected LFSR sequence at the chosen seed address", () => {
  const ctx = createMacroContext();
  const bytes = compileBlock(ctx, {
    mnemonic: "RAND",
    isRandMacro: true,
    randSeed: "$00FB"
  }, new Map(), 0x3500);

  assert.deepEqual(bytes, [
    0xAD, 0xFB, 0x00,
    0xD0, 0x02,
    0xA9, 0xA5,
    0x0A,
    0x90, 0x02,
    0x49, 0x1D,
    0x8D, 0xFB, 0x00
  ]);
  assert.equal(ctx.getInstructionSize({ isRandMacro: true }), 15);
});

vmaTest("EXODECRUNCH emits the depacker setup, ROM toggle and JSR", () => {
  const ctx = createMacroContext();
  const bytes = compileBlock(ctx, {
    mnemonic: "EXODECRUNCH",
    isExoDecrunchMacro: true,
    exoDepackerAddr: "B000"
  }, new Map(), 0x3600);

  assert.deepEqual(bytes, [
    0xA5, 0xAE,
    0x85, 0x04,
    0xA5, 0xAF,
    0x85, 0x05,
    0xA9, 0x36,
    0x85, 0x01,
    0x20, 0x00, 0xB0,
    0xA9, 0x37,
    0x85, 0x01
  ]);
  assert.equal(ctx.getInstructionSize({ isExoDecrunchMacro: true }), 19);
});

vmaTest("runtime ELSE and ENDIF compile to jump and anchor bytes", () => {
  // IF $2000-$2003, then-body $2004, ELSE = JMP end at $2005, else-body $2008-$2009, end $200A
  const p = prog("* = $2000\n.if A == #$01\n nop\n.else\n nop\n nop\n.endif\nafter:\n");
  assert.deepEqual(p.bytes(0x2000, 0x2004), [0xC9, 0x01, 0xD0, 0x04]);
  assert.deepEqual(p.bytes(0x2005, 0x2008), [0x4C, 0x0A, 0x20]);
  assert.equal(p.value("after"), 0x200A, "ENDIF makes no bytes");
});

vmaTest("core helper macros emit stable bytes and sizes", () => {
  const ctx = createMacroContext();
  const cases = [
    {
      block: {
        mnemonic: "TURBO_SET",
        isTurboSetMacro: true,
        turboSpeed: "3",
        turboBadline: "1"
      },
      bytes: [0xA9, 0x83, 0x8D, 0x31, 0xD0],
      size: 5
    },
    {
      block: { mnemonic: "SUPERCPU_DETECT", isSuperCpuDetectMacro: true },
      bytes: [0xAD, 0xB8, 0xD0, 0xC9, 0xFF],
      size: 5
    },
    {
      block: {
        mnemonic: "TURBO_ENABLE",
        isTurboEnableMacro: true,
        turboEnableMode: "on"
      },
      bytes: [0xA9, 0x00, 0x8D, 0x7A, 0xD0],
      size: 5
    },
    {
      block: {
        mnemonic: "TURBO_ENABLE",
        isTurboEnableMacro: true,
        turboEnableMode: "off"
      },
      bytes: [0xA9, 0x00, 0x8D, 0x7B, 0xD0],
      size: 5
    },
    {
      block: {
        mnemonic: "JOYSTICK",
        isJoystickMacro: true,
        joyPort: "2",
        joySpriteNum: "1"
      },
      bytes: [
        0xAD, 0x00, 0xDC,
        0x4A, 0xB0, 0x03, 0xCE, 0x03, 0xD0,
        0x4A, 0xB0, 0x03, 0xEE, 0x03, 0xD0,
        0x4A, 0xB0, 0x03, 0xCE, 0x02, 0xD0,
        0x4A, 0xB0, 0x03, 0xEE, 0x02, 0xD0
      ],
      size: 27
    },
    {
      block: {
        mnemonic: "SPRITE_COL",
        isSpriteColMacro: true,
        spriteNum: "3",
        colType: "background"
      },
      bytes: [0xAD, 0x1F, 0xD0, 0x29, 0x08],
      size: 5
    },
    {
      block: {
        mnemonic: "MAP_COPY",
        isMapCopyMacro: true,
        mapCopySrc: "C000",
        mapCopyDst: "0400",
        mapCopySize: "3",
        mapCopyCombined: false
      },
      bytes: [0xA2, 0x00, 0xBD, 0x00, 0xC0, 0x9D, 0x00, 0x04, 0xE8, 0xE0, 0x03, 0xD0, 0xF5],
      size: 13
    },
    {
      block: {
        mnemonic: "SPRITE_ANIM",
        isSpriteAnimMacro: true,
        animSpriteNum: "0",
        animFrameListAddr: "C100",
        animFrameCount: "4",
        animFrameZP: "FB"
      },
      bytes: [0xE6, 0xFB, 0xA5, 0xFB, 0xC9, 0x04, 0x90, 0x04, 0xA9, 0x00, 0x85, 0xFB, 0xAA, 0xBD, 0x00, 0xC1, 0x8D, 0xF8, 0x07],
      size: 19
    },
    {
      block: {
        mnemonic: "REU_CHECK",
        isReuCheckMacro: true
      },
      bytes: [
        0xA9, 0x55, 0x8D, 0x04, 0xDF, 0xAD, 0x04, 0xDF, 0xC9, 0x55, 0xD0, 0x12,
        0xA9, 0xAA, 0x8D, 0x04, 0xDF, 0xAD, 0x04, 0xDF, 0xC9, 0xAA, 0xD0, 0x06,
        0xA9, 0x00, 0xC9, 0xFF, 0xD0, 0x04, 0xA9, 0xFF, 0xC9, 0xFF
      ],
      size: 34
    },
    {
      block: {
        mnemonic: "REU_STASH",
        isReuTransferMacro: true,
        reuC64Addr: "C000",
        reuExpAddr: "0000",
        reuBank: "0",
        reuLength: "0100"
      },
      bytes: [
        0xA9, 0x00, 0x8D, 0x02, 0xDF, 0xA9, 0xC0, 0x8D, 0x03, 0xDF,
        0xA9, 0x00, 0x8D, 0x04, 0xDF, 0xA9, 0x00, 0x8D, 0x05, 0xDF,
        0xA9, 0x00, 0x8D, 0x06, 0xDF, 0xA9, 0x00, 0x8D, 0x07, 0xDF,
        0xA9, 0x01, 0x8D, 0x08, 0xDF, 0xA9, 0x90, 0x8D, 0x01, 0xDF
      ],
      size: 40
    },
    {
      block: {
        mnemonic: "REU_FETCH",
        isReuTransferMacro: true,
        reuC64Addr: "C000",
        reuExpAddr: "0000",
        reuBank: "0",
        reuLength: "0100"
      },
      bytes: [
        0xA9, 0x00, 0x8D, 0x02, 0xDF, 0xA9, 0xC0, 0x8D, 0x03, 0xDF,
        0xA9, 0x00, 0x8D, 0x04, 0xDF, 0xA9, 0x00, 0x8D, 0x05, 0xDF,
        0xA9, 0x00, 0x8D, 0x06, 0xDF, 0xA9, 0x00, 0x8D, 0x07, 0xDF,
        0xA9, 0x01, 0x8D, 0x08, 0xDF, 0xA9, 0x91, 0x8D, 0x01, 0xDF
      ],
      size: 40
    },
    {
      block: {
        mnemonic: "REU_SWAP",
        isReuTransferMacro: true,
        reuC64Addr: "C000",
        reuExpAddr: "0000",
        reuBank: "0",
        reuLength: "0100"
      },
      bytes: [
        0xA9, 0x00, 0x8D, 0x02, 0xDF, 0xA9, 0xC0, 0x8D, 0x03, 0xDF,
        0xA9, 0x00, 0x8D, 0x04, 0xDF, 0xA9, 0x00, 0x8D, 0x05, 0xDF,
        0xA9, 0x00, 0x8D, 0x06, 0xDF, 0xA9, 0x00, 0x8D, 0x07, 0xDF,
        0xA9, 0x01, 0x8D, 0x08, 0xDF, 0xA9, 0x92, 0x8D, 0x01, 0xDF
      ],
      size: 40
    },
    {
      block: {
        mnemonic: "MOUSE",
        isMouseMacro: true,
        mousePort: "2",
        mouseSpriteNum: "1",
        mousePotXZP: "FD",
        mousePotYZP: "FE"
      },
      prefix: [0xAD, 0x00, 0xDC, 0x29, 0x3F, 0x09, 0x80, 0x8D, 0x00, 0xDC, 0xA2, 0x67, 0xCA, 0xD0, 0xFD],
      size: 142
    },
    {
      block: {
        mnemonic: "SCORE_BCD",
        isScoreBcdMacro: true,
        scoreBcdAddr: "C200",
        scoreDigits: 2,
        scoreAddPoints: "5",
        scoreScreenAddr: "0400"
      },
      bytes: [
        0xF8, 0x18, 0xAD, 0x00, 0xC2, 0x69, 0x05, 0x8D, 0x00, 0xC2, 0xD8,
        0xAD, 0x00, 0xC2, 0x48, 0x4A, 0x4A, 0x4A, 0x4A, 0x09, 0x30, 0x8D, 0x00, 0x04,
        0x68, 0x29, 0x0F, 0x09, 0x30, 0x8D, 0x01, 0x04
      ],
      size: 32
    }
  ];

  for (const entry of cases) {
    const bytes = compileBlock(ctx, entry.block, new Map(), 0x4400);
    assert.equal(bytes.length, entry.size, entry.block.mnemonic);
    assert.equal(ctx.getInstructionSize(entry.block), entry.size, entry.block.mnemonic);
    if (entry.bytes) {
      assert.deepEqual(bytes, entry.bytes, entry.block.mnemonic);
    }
    if (entry.prefix) {
      assert.deepEqual(bytes.slice(0, entry.prefix.length), entry.prefix, entry.block.mnemonic);
    }
  }
});

vmaTest("WORD emits little-endian pairs and reports the right size", () => {
  const ctx = createMacroContext();
  const bytes = compileBlock(ctx, {
    mnemonic: "WORD",
    isWordMacro: true,
    rawOperand: "$1234, $ABCD",
    base: "hex"
  }, new Map(), 0x4500);

  assert.deepEqual(bytes, [0x34, 0x12, 0xCD, 0xAB]);

});

vmaTest("INCBIN becomes a deferred section at its target address", () => {
  const p = prog('* = $1000\n.incbin "demo.bin", $C300\nafter:\n rts\n', { "demo.bin": Uint8Array.from([0x11, 0x22, 0x33]) });
  assert.deepEqual(p.bytes(0xC300, 0xC303), [0x11, 0x22, 0x33]);
  assert.equal(p.value("after"), 0x1000);
  assert.deepEqual(JSON.parse(JSON.stringify(p.r.memory.deferred.map(d => [d.type, d.address, d.end]))), [["incbin", 0xC300, 0xC302]]);
});

test("ORG, TABLE, SID, INCBIN, and INCLUDE round-trip in expert text", () => {
  const ctx = loadFunctions(
    ["_splitAsmLineComment", "_importMakeIncBin", "_kickScopeRewrite", "parseExpertText", "_blockToExpertLine"],
    {
      crypto: { randomUUID: () => "00000000-0000-4000-8000-000000000000" },
      formatAddress: (value) => `$${value.toString(16).toUpperCase().padStart(4, "0")}`,
      t: (key) => key
    }
  );

  const blocks = ctx.parseExpertText([
    "* = $0801",
    ".table lookup $C200",
    ".incbin \"demo.bin\", $C300",
    ".sid \"music.sid\", $C400",
    ".include \"lib.json\", $C500"
  ].join("\n"));

  assert.equal(blocks[0].isOrgMacro, true);
  assert.equal(blocks[1].isTableMacro, true);
  assert.equal(blocks[2].isIncBinMacro, true);
  assert.equal(blocks[3].isSidMacro, true);
  assert.equal(blocks[4].isIncludeMacro, true);
  assert.equal(blocks[2].validationError, "");
  assert.equal(blocks[3].validationError, "");
  assert.equal(blocks[4].validationError, "");
  assert.equal(ctx._blockToExpertLine(blocks[0]), "* = $0801");
  assert.equal(ctx._blockToExpertLine(blocks[1]), ".table lookup $C200");
  assert.equal(ctx._blockToExpertLine(blocks[2]), ".incbin \"demo.bin\", $C300");
  assert.equal(ctx._blockToExpertLine(blocks[3]), ".sid \"music.sid\", $C400");
  assert.equal(ctx._blockToExpertLine(blocks[4]), ".include \"lib.json\", $C500");
});

test("INCLUDE / INCBIN / SID with empty filename flag validationError", () => {
  const ctx = loadFunctions(
    ["_splitAsmLineComment", "_importMakeIncBin", "_kickScopeRewrite", "parseExpertText"],
    {
      crypto: { randomUUID: () => "00000000-0000-4000-8000-000000000000" },
      t: (key) => key
    }
  );

  const blocks = ctx.parseExpertText([
    ".incbin \"\"",
    ".sid \"\"",
    ".include \"\""
  ].join("\n"));

  assert.equal(blocks[0].isIncBinMacro, true);
  assert.equal(blocks[0].validationError, "incbinMacroNeedsFile");
  assert.equal(blocks[1].isSidMacro, true);
  assert.equal(blocks[1].validationError, "sidMacroNeedsFile");
  assert.equal(blocks[2].isIncludeMacro, true);
  assert.equal(blocks[2].validationError, "includeMacroNeedsFile");
});

test("bare .include / .incbin / .sid without a quoted filename produce error blocks", () => {
  const ctx = loadFunctions(
    ["_splitAsmLineComment", "_importMakeIncBin", "_kickScopeRewrite", "parseExpertText"],
    {
      crypto: { randomUUID: () => "00000000-0000-4000-8000-000000000000" },
      t: (key) => key,
      tf: (key, values) => `${key}:${values?.directive ?? ""}`
    }
  );

  const blocks = ctx.parseExpertText([
    ".include",
    ".incbin",
    ".sid"
  ].join("\n"));

  assert.equal(blocks[0].isIncludeMacro, true);
  assert.equal(blocks[0].validationError, "includeMacroNeedsFile");
  assert.equal(blocks[1].isIncBinMacro, true);
  assert.equal(blocks[1].validationError, "incbinMacroNeedsFile");
  assert.equal(blocks[2].isSidMacro, true);
  assert.equal(blocks[2].validationError, "sidMacroNeedsFile");
});

test("unknown directive tokens surface as errors instead of silent comments", () => {
  // Mock parseAsmText: known directives (.word/.byte/etc.) return a structural
  // block; unknown ones return a fall-through comment. parseExpertText's new
  // guard must only tag the comment path with an unknownDirective error.
  const knownDirectives = new Set([".word", ".byte", ".fill", ".align"]);
  const ctx = loadFunctions(
    ["_splitAsmLineComment", "_importMakeIncBin", "_importMakeComment", "_kickScopeRewrite", "parseExpertText"],
    {
      crypto: { randomUUID: () => "00000000-0000-4000-8000-000000000000" },
      t: (key) => key,
      tf: (key, values) => `${key}:${values?.directive ?? ""}`,
      parseAsmText(text) {
        const line = String(text).split(";")[0].trim();
        const dir = line.split(/\s+/)[0].toLowerCase();
        if (knownDirectives.has(dir)) {
          return [{ id: "mock", mnemonic: dir.slice(1).toUpperCase(), isWordMacro: dir === ".word" }];
        }
        return [{ id: "mock-c", mnemonic: "COMMENT", isComment: true, commentText: line, validationError: "" }];
      }
    }
  );

  const blocks = ctx.parseExpertText([
    ".text",
    ".notarealthing foo bar",
    ".nope",
    ".word $1234",
    ".byte 1, 2, 3"
  ].join("\n"));

  // Unknown directives get flagged.
  assert.equal(blocks[0].isComment, true);
  assert.equal(blocks[0].validationError, "unknownDirective:.text");
  assert.equal(blocks[1].isComment, true);
  assert.equal(blocks[1].validationError, "unknownDirective:.notarealthing");
  assert.equal(blocks[2].isComment, true);
  assert.equal(blocks[2].validationError, "unknownDirective:.nope");

  // Known directives keep working through parseAsmText — not comments, no error.
  assert.notEqual(blocks[3].isComment, true);
  assert.equal(blocks[3].validationError || "", "");
  assert.notEqual(blocks[4].isComment, true);
  assert.equal(blocks[4].validationError || "", "");
});

test("validateAssetMacroHasFile catches empty INCLUDE / INCBIN / SID blocks", () => {
  const ctx = loadFunctions(
    ["validateAssetMacroHasFile"],
    { t: (key) => key }
  );

  assert.equal(
    ctx.validateAssetMacroHasFile({ isIncBinMacro: true, incBinFile: "", incBinFileName: "" }),
    "incbinMacroNeedsFile"
  );
  assert.equal(
    ctx.validateAssetMacroHasFile({ isSidMacro: true, sidFile: "", sidFileName: "" }),
    "sidMacroNeedsFile"
  );
  assert.equal(
    ctx.validateAssetMacroHasFile({ isIncludeMacro: true, includeFile: "", includeFileName: "" }),
    "includeMacroNeedsFile"
  );
  // Once either the file path or the file name is populated, no error.
  assert.equal(
    ctx.validateAssetMacroHasFile({ isIncBinMacro: true, incBinFile: "sprite.bin", incBinFileName: "" }),
    ""
  );
  assert.equal(
    ctx.validateAssetMacroHasFile({ isSidMacro: true, sidFile: "", sidFileName: "music.sid" }),
    ""
  );
  assert.equal(
    ctx.validateAssetMacroHasFile({ isIncludeMacro: true, includeFile: "lib.json", includeFileName: "" }),
    ""
  );
  // Non-asset blocks return "".
  assert.equal(ctx.validateAssetMacroHasFile({ isOrgMacro: true }), "");
  assert.equal(ctx.validateAssetMacroHasFile(null), "");
});

// ── Assembler expression & label extensions (v2.3.9) ─────────────────────────

vmaTest("LBxx long-branch emits inverted Bxx +3 / JMP target and is 5 bytes", () => {
  const ctx = createMacroContext();
  const labels = new Map([["far", 0xD000]]);
  const bytes = compileBlock(
    ctx,
    { mnemonic: "LBNE", isLongBranchMacro: true, longBranchCond: "NE", rawOperand: "far", base: "hex" },
    labels,
    0xC000
  );
  assert.deepEqual(bytes, [0xF0, 0x03, 0x4C, 0x00, 0xD0]);

  // Inverted opcodes for the other conditions
  const inv = { EQ: 0xD0, CC: 0xB0, CS: 0x90, MI: 0x10, PL: 0x30, VC: 0x70, VS: 0x50 };
  for (const [cond, opc] of Object.entries(inv)) {
    const b = compileBlock(
      ctx,
      { mnemonic: "LB" + cond, isLongBranchMacro: true, longBranchCond: cond, rawOperand: "far", base: "hex" },
      labels,
      0xC000
    );
    assert.equal(b[0], opc, `LB${cond} inverted opcode`);
    assert.deepEqual(b.slice(1), [0x03, 0x4C, 0x00, 0xD0]);
  }
});

vmaTest("LBxx target accepts a *-expression", () => {
  const ctx = createMacroContext();
  const bytes = compileBlock(
    ctx,
    { mnemonic: "LBEQ", isLongBranchMacro: true, longBranchCond: "EQ", rawOperand: "*+300", base: "hex" },
    new Map(),
    0xC000
  );
  // 0xC000 + 300 = 0xC12C
  assert.deepEqual(bytes, [0xD0, 0x03, 0x4C, 0x2C, 0xC1]);
});

test("LBxx round-trips through _blockToExpertLine", () => {
  const ctx = createMacroContext();
  assert.equal(
    ctx._blockToExpertLine({ mnemonic: "LBNE", isLongBranchMacro: true, longBranchCond: "NE", rawOperand: "done" }).trim(),
    "LBNE done"
  );
});

vmaTest(".assert passes a truthy expression and fails a falsy one", () => {
  const ctx = createMacroContext();
  const ok = ctx.compileLineBytes({ address: 0xC000, block: { isAssertMacro: true, assertExpr: "1 + 1" } }, new Map());
  assert.equal(ok.ok, true);
  assert.deepEqual(Array.from(ok.bytes), []);

  const bad = ctx.compileLineBytes({ address: 0xC000, block: { isAssertMacro: true, assertExpr: "2 > 5" } }, new Map());
  assert.equal(bad.ok, false);

  // `*` is available inside the assertion expression
  const pcOk = ctx.compileLineBytes({ address: 0x9FFF, block: { isAssertMacro: true, assertExpr: "* < $A000" } }, new Map());
  assert.equal(pcOk.ok, true);
  const pcBad = ctx.compileLineBytes({ address: 0xA000, block: { isAssertMacro: true, assertExpr: "* < $A000" } }, new Map());
  assert.equal(pcBad.ok, false);
});

test(".assert round-trips through _blockToExpertLine with an optional message", () => {
  const ctx = createMacroContext();
  assert.equal(
    ctx._blockToExpertLine({ isAssertMacro: true, assertExpr: "end - start <= 256" }),
    ".assert end - start <= 256"
  );
  assert.equal(
    ctx._blockToExpertLine({ isAssertMacro: true, assertExpr: "size <= 40", assertMessage: "too wide" }),
    '.assert size <= 40, "too wide"'
  );
});

vmaTest("SMC label on an operand maps to the operand byte and round-trips", () => {
  const ctx = createMacroContext();
  const p = prog("* = $1000\n lda value:#$00\n rts\n");
  assert.equal(p.value("value"), 0x1001); // code at $1000, operand byte at $1001

  assert.equal(
    ctx._blockToExpertLine({ mnemonic: "LDA", addressingMode: "immediate", rawOperand: "", operand: "#$00", smcLabel: "value" }).trim(),
    "LDA value:#$00"
  );
});

vmaTest("local (dotted) labels are scoped to the nearest preceding global label", () => {
  const p = prog("* = $1000\nFirst:\n.loop:\n nop\n bne .loop\nSecond:\n.loop:\n nop\n bne .loop\n");
  const names = p.r.labels.map(l => l[0]);
  assert.ok(names.includes("First.loop"));
  assert.ok(names.includes("Second.loop"));
  assert.ok(!names.includes(".loop"), "raw .loop must not leak as a global label");
  assert.notEqual(p.value("First.loop"), p.value("Second.loop"));
  // each BNE .loop is a backward branch in its own scope
  assert.deepEqual(p.bytes(0x1001, 0x1003), [0xD0, 0xFD]);
  assert.deepEqual(p.bytes(0x1004, 0x1006), [0xD0, 0xFD]);
});

vmaTest("local labels support explicit cross-scope references (Global.name)", () => {
  const p = prog("* = $1000\nFirst:\n nop\nSecond:\n.skip:\n nop\n jmp Second.skip\n");
  assert.equal(p.value("Second.skip"), 0x1001);
  assert.deepEqual(p.bytes(0x1002, 0x1005), [0x4C, 0x01, 0x10]);
});

vmaTest(".assert evaluates label arithmetic and reports the value on failure", () => {
  const ctx = createMacroContext();
  const labels = new Map([["start", 0x1000], ["end", 0x1120]]); // 0x120 = 288 bytes
  const pass = ctx.compileLineBytes({ address: 0x1120, block: { isAssertMacro: true, assertExpr: "end - start <= 512" } }, labels);
  assert.equal(pass.ok, true);
  const fail = ctx.compileLineBytes({ address: 0x1120, block: { isAssertMacro: true, assertExpr: "end - start <= 256", assertMessage: "too big" } }, labels);
  assert.equal(fail.ok, false);
});

vmaTest("LBxx rejects an unresolved target with a branch-operand error", () => {
  const ctx = createMacroContext();
  const r = ctx.compileLineBytes(
    { address: 0xC000, block: { mnemonic: "LBNE", isLongBranchMacro: true, longBranchCond: "NE", rawOperand: "nowhere", base: "hex" } },
    new Map()
  );
  assert.equal(r.ok, false);
});

test("ACME mode reads !region and coordinate !text as the VA macros", () => {
  const ctx = loadFunctions(["_splitAsmLineComment", "_importMakeRegion", "_importMakeComment", "_kickScopeRewrite", "parseExpertText"], {
    assemblerSyntax: "acme",
    crypto: { randomUUID: () => "test-id" },
    parseAsmText: line => line.trim().toUpperCase() === "RTS" ? [{ mnemonic: "RTS" }] : []
  });
  const blocks = ctx.parseExpertText('* = $0801\n!region init\n; TEXT auto: lowercase input\n!text 14, 8, "hello c64!", lower\n!text 10, 12, "Visual Assembler", lower\n!text 10, 18, "HELLO WORLD", lower\n    RTS');
  assert.ok(blocks.some(block => block.isRegionMacro));
  const textBlocks = blocks.filter(block => block.isTextMacro);
  assert.equal(textBlocks.length, 3);
  assert.equal(textBlocks[0].textCharset, "lower");
  assert.equal(textBlocks[0].textX, "14");
  assert.equal(textBlocks[0].textY, "8");
  assert.ok(blocks.some(block => block.mnemonic === "RTS"));

  // VMA (VA) mode never takes the ! forms.
  ctx.assemblerSyntax = "kick";
  ctx.tf = (key, values) => `${key} ${values.directive}`;
  const vaBlocks = ctx.parseExpertText('!region init\n!text 14, 8, "hi"\n    RTS');
  assert.ok(!vaBlocks.some(block => block.isRegionMacro || block.isTextMacro));
  assert.deepEqual(Array.from(vaBlocks.filter(block => block.validationError), block => block.validationError), ["vmaAcmeDirective !region", "vmaAcmeDirective !text"]);
});
