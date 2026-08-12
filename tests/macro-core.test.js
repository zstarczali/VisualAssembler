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
    if (ch === "{") {
      depth += 1;
      seenBrace = true;
    } else if (ch === "}") {
      depth -= 1;
      if (seenBrace && depth === 0) {
        end = i + 1;
        break;
      }
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

function createMacroContext(extraContext = {}) {
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
      "_expertEditLineComments",
      "_layoutLineSortAddress",
      "_disasmLineSortAddress",
      "_compareLayoutLineRefs",
      "_compareDisasmLayoutLineRefs",
      "_buildDisasmHTML",
      "_splitAsmLineComment",
      "parseExpertText",
      "_blockToExpertLine",
      "_blockToExpertSourceLine",
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
      _escHtml: (value) => String(value).replace(/[&<>]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[ch])),
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
}

function compileBlock(ctx, block, labels = new Map(), address = 0x1000) {
  const result = ctx.compileLineBytes({ address, block }, labels);
  if (!result.ok) {
    assert.fail(result.error || "compileLineBytes failed");
  }
  return Array.from(result.bytes);
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
    ["_splitAsmLineComment", "parseExpertText", "_importMakeComment"],
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

test("resolveNumericOperand handles #<N and #>N with bare decimal N (macro expansion)", () => {
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

test("runtime IF emits CMP+BNE skip with the right relative offset", () => {
  const ctx = createMacroContext();
  const labels = new Map([["else1", 0x1008]]);
  const bytes = compileBlock(ctx, {
    mnemonic: "IF_A",
    isRuntimeIfMacro: true,
    runtimeIfReg: "A",
    runtimeIfOp: "==",
    rawOperand: "#$10",
    base: "hex",
    runtimeIfElseLabel: "else1"
  }, labels, 0x1000);

  assert.deepEqual(bytes, [0xC9, 0x10, 0xD0, 0x04]);
  assert.equal(ctx.getInstructionSize({
    isRuntimeIfMacro: true,
    runtimeIfOp: "==",
    rawOperand: "#$10"
  }), 4);
});

test("runtime IF supports X and Y registers too", () => {
  const ctx = createMacroContext();
  const xBytes = compileBlock(ctx, {
    mnemonic: "IF_X",
    isRuntimeIfMacro: true,
    runtimeIfReg: "X",
    runtimeIfOp: "==",
    rawOperand: "#$10",
    base: "hex",
    runtimeIfElseLabel: "else_x"
  }, new Map([["else_x", 0x1008]]), 0x1000);
  const yBytes = compileBlock(ctx, {
    mnemonic: "IF_Y",
    isRuntimeIfMacro: true,
    runtimeIfReg: "Y",
    runtimeIfOp: "==",
    rawOperand: "#$10",
    base: "hex",
    runtimeIfElseLabel: "else_y"
  }, new Map([["else_y", 0x1008]]), 0x1000);

  assert.deepEqual(xBytes, [0xE0, 0x10, 0xD0, 0x04]);
  assert.deepEqual(yBytes, [0xC0, 0x10, 0xD0, 0x04]);
});

test("runtime WHILE and ENDW compile to loop skip plus jump-back", () => {
  const ctx = createMacroContext();
  const whileLabels = new Map([["while_end_1", 0x200A]]);
  const whileBytes = compileBlock(ctx, {
    mnemonic: "WHILE_A",
    isRuntimeWhileMacro: true,
    runtimeIfReg: "A",
    runtimeIfOp: "!=",
    rawOperand: "#$00",
    base: "hex",
    whileEndLabel: "while_end_1"
  }, whileLabels, 0x2000);
  const endwLabels = new Map([["while_start_1", 0x2000]]);
  const endwBytes = compileBlock(ctx, {
    mnemonic: "ENDW",
    isRuntimeEndwMacro: true,
    whileStartLabel: "while_start_1"
  }, endwLabels, 0x2006);

  assert.deepEqual(whileBytes, [0xC9, 0x00, 0xF0, 0x06]);
  assert.deepEqual(endwBytes, [0x4C, 0x00, 0x20]);
});

test("runtime WHILE and UNTIL also support X/Y register variants", () => {
  const ctx = createMacroContext();
  const whileX = compileBlock(ctx, {
    mnemonic: "WHILE_X",
    isRuntimeWhileMacro: true,
    runtimeIfReg: "X",
    runtimeIfOp: "!=",
    rawOperand: "#$00",
    base: "hex",
    whileEndLabel: "while_end_x"
  }, new Map([["while_end_x", 0x2008]]), 0x2000);
  const whileY = compileBlock(ctx, {
    mnemonic: "WHILE_Y",
    isRuntimeWhileMacro: true,
    runtimeIfReg: "Y",
    runtimeIfOp: "!=",
    rawOperand: "#$00",
    base: "hex",
    whileEndLabel: "while_end_y"
  }, new Map([["while_end_y", 0x2008]]), 0x2000);
  const untilX = compileBlock(ctx, {
    mnemonic: "UNTIL_X",
    isRuntimeUntilMacro: true,
    runtimeIfReg: "X",
    runtimeIfOp: "!=",
    rawOperand: "#$00",
    base: "hex",
    repeatStartLabel: "repeat_x"
  }, new Map([["repeat_x", 0x3000]]), 0x3004);
  const untilY = compileBlock(ctx, {
    mnemonic: "UNTIL_Y",
    isRuntimeUntilMacro: true,
    runtimeIfReg: "Y",
    runtimeIfOp: "!=",
    rawOperand: "#$00",
    base: "hex",
    repeatStartLabel: "repeat_y"
  }, new Map([["repeat_y", 0x3000]]), 0x3004);

  assert.equal(whileX.length, 4);
  assert.equal(whileY.length, 4);
  assert.equal(untilX.length, 4);
  assert.equal(untilY.length, 4);
  assert.deepEqual(whileX.slice(0, 3), [0xE0, 0x00, 0xF0]);
  assert.deepEqual(whileY.slice(0, 3), [0xC0, 0x00, 0xF0]);
  assert.deepEqual(untilX.slice(0, 3), [0xE0, 0x00, 0xF0]);
  assert.deepEqual(untilY.slice(0, 3), [0xC0, 0x00, 0xF0]);
});

test("MEMCPY partial copy emits counted indexed loop and correct size", () => {
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

test("MEMSET partial fill emits shared-LDA loop and correct size", () => {
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

test("PRINT lower emits inline PETSCII data and print loop", () => {
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

test("PRINT_CHAR resolves const labels case-insensitively", () => {
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

  assert.equal(commented.text, "label:\n    ; lda #1\n    ; sta $d020\nrts");
  assert.equal(commented.text.slice(commented.selectionStart, commented.selectionEnd), "    ; lda #1\n    ; sta $d020");

  const uncommented = ctx._expertEditLineComments(
    commented.text,
    commented.selectionStart,
    commented.selectionEnd,
    true
  );
  assert.equal(uncommented.text, source);
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

test("PUSH expands registers in stack order", () => {
  const ctx = createMacroContext();
  const bytes = compileBlock(ctx, {
    mnemonic: "PUSH",
    isPushMacro: true,
    pushRegs: "AXY"
  }, new Map(), 0x3200);

  assert.deepEqual(bytes, [0x48, 0x8A, 0x48, 0x98, 0x48]);
  assert.equal(ctx.getInstructionSize({ isPushMacro: true, pushRegs: "AXY" }), 5);
});

test("PULL restores registers in reverse stack order", () => {
  const ctx = createMacroContext();
  const bytes = compileBlock(ctx, {
    mnemonic: "PULL",
    isPullMacro: true,
    pullRegs: "AXY"
  }, new Map(), 0x3200);

  assert.deepEqual(bytes, [0x68, 0xA8, 0x68, 0xAA, 0x68]);
  assert.equal(ctx.getInstructionSize({ isPullMacro: true, pullRegs: "AXY" }), 5);
});

test("SPRITE_INIT writes sprite pointer, enable bit, multicolor bit, and color", () => {
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

test("SPRITE_INIT accepts consts and multicolor in compile", () => {
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

test("SPRITE_POS updates X low byte, D010 bit, and Y position", () => {
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

test("SPRITE_POS accepts consts for sprite number and coordinates", () => {
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

test("LOADFILE emits KERNAL setup, override address, and error branch", () => {
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
  assert.equal(ctx.getInstructionSize({
    isLoadFileMacro: true,
    loadFileName: "demo",
    loadFileAddress: "$C000",
    loadFileErrorLabel: "fail"
  }), 36);
});

test("PRINT_HEX renders X with the register prefix", () => {
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

test("_buildAutostartPrgCore routes default origin to $C000 when BASIC SYS is off", () => {
  const seenOrigins = [];
  const ctx = loadFunctions(["_buildAutostartPrgCore"], {
    basicSysToggle: { checked: false },
    parseOriginValue: () => ({ value: 0x0801 }),
    assembleProgramToPrg: (origin) => {
      seenOrigins.push(origin);
      return { ok: true, bytes: new Uint8Array([0x10, 0x20]) };
    },
    parseUserMacros: () => {},
    _programHasEmbeddedBasicAutostart: () => false,
    program: [],
    userMacros: {}
  });

  const result = ctx._buildAutostartPrgCore();

  assert.deepEqual(seenOrigins, [0xC000]);
  assert.equal(result.ok, true);
  assert.deepEqual(Array.from(result.bytes), [0x10, 0x20]);
});

test("parseExpertText recognizes .region, .endregion, and .end", () => {
  const ctx = loadFunctions(
    ["_splitAsmLineComment", "_importMakeRegion", "_importMakeEndRegion", "_importMakeEndMacro", "parseExpertText"],
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
      "parseExpertText"
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
    ".pc = $0801",
    "// BASIC autostart",
    ".const BMPSCREEN = $6000 // screen base",
    ".macro DrawCircle(px, py, pr, pc) {",
    "    lda #pc // set color",
    "}",
    "start:",
    "    DrawCircle(110, 70, 35, $02)",
    "    .byte $01,$02 // payload"
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
      "parseExpertText"
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

test("DELAY accepts numeric frame counts in expert mode", () => {
  const ctx = createMacroContext({
    program: [
      { id: "c1", mnemonic: "CONST", isConstMacro: true, constName: "_delay", rawOperand: "30", base: "dec", constValue: 30 },
      { id: "d1", mnemonic: "DELAY", isDelayMacro: true, delayFrames: "30" }
    ]
  });
  const labels = new Map([["__delay_wait_frames", 0x2000], ["_delay", 30]]);
  const bytes = compileBlock(ctx, ctx.program[1], labels, 0x1000);

  assert.deepEqual(bytes, [0xA2, 0x1E, 0x20, 0x00, 0x20]);
});

test("DELAY resolves const names when the helper label is present", () => {
  const ctx = createMacroContext({
    program: [
      { id: "c1", mnemonic: "CONST", isConstMacro: true, constName: "_delay", rawOperand: "30", base: "dec", constValue: 30 },
      { id: "d1", mnemonic: "DELAY", isDelayMacro: true, delayFrames: "_delay" }
    ]
  });
  const labels = new Map([["__delay_wait_frames", 0x2000], ["_delay", 30]]);
  const bytes = compileBlock(ctx, ctx.program[1], labels, 0x1000);

  assert.deepEqual(bytes, [0xA2, 0x1E, 0x20, 0x00, 0x20]);
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

test("STRING and DATA emit inline store sequences", () => {
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
  assert.equal(ctx.getInstructionSize({ isStringMacro: true, rawOperand: "AB" }), 10);
  assert.equal(ctx.getInstructionSize({ isDataMacro: true, rawOperand: "1,2" }), 10);
});

test("RAWBYTES and RAWTEXT produce deferred sections at their target addresses", () => {
  const ctx = createMacroContext({
    program: [
      { id: "r1", mnemonic: "RAWBYTES", isRawBytesMacro: true, rawOperand: "1, $02, %00000011", rawBytesAddress: "$C120", base: "hex" },
      { id: "r2", mnemonic: "RAWTEXT", isRawTextMacro: true, rawOperand: "AB", rawTextAddress: "$C100", textCharset: "upper", base: "hex" }
    ]
  });

  const layout = ctx.getProgramLayout(0x0801);
  const sections = ctx.getDeferredMemorySections(layout);
  const plainSections = JSON.parse(JSON.stringify(sections.map((section) => ({
    type: section.type,
    address: section.address,
    bytes: Array.from(section.bytes)
  }))));

  assert.deepEqual(plainSections, [
    { type: "rawtext", address: 0xC100, bytes: [0x01, 0x02] },
    { type: "rawbytes", address: 0xC120, bytes: [0x01, 0x02, 0x03] }
  ]);
  assert.equal(ctx.getInstructionSize({ isRawTextMacro: true }), 0);
  assert.equal(ctx.getInstructionSize({ isRawBytesMacro: true }), 0);
});

test("FILL expands repeated bytes and ALIGN pads to the next boundary", () => {
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

  const alignLayoutCtx = createMacroContext({
    program: [
      { id: "b1", mnemonic: "BYTE", isByteMacro: true, rawOperand: "1,2,3", base: "hex" },
      { id: "a1", mnemonic: "ALIGN", isAlignMacro: true, rawOperand: "4", base: "hex" }
    ]
  });
  const alignLayout = alignLayoutCtx.getProgramLayout(0x1000);
  const alignLine = alignLayout.lines.find((line) => line.block.mnemonic === "ALIGN");

  assert.deepEqual(fillBytes, [0x7E, 0x7E, 0x7E, 0x7E]);
  assert.deepEqual(alignBytes, [0x00]);
  assert.equal(ctx.getInstructionSize({ isFillMacro: true, rawOperand: "4, $7E", base: "hex" }), 4);
  assert.equal(alignLine.address, 0x1003);
  assert.equal(alignLine.size, 1);
});

test("FILL supports expressions with consts, math functions, and byte masks", () => {
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

test("SET_BORDER resolves const labels and writes VIC border color", () => {
  const ctx = createMacroContext();
  const labels = new Map([["color", 0x0A]]);
  const bytes = compileBlock(ctx, {
    mnemonic: "SET_BORDER",
    isSetBorderMacro: true,
    colorValue: "COLOR"
  }, labels, 0x3300);

  assert.deepEqual(bytes, [0xA9, 0x0A, 0x8D, 0x20, 0xD0]);
});

test("SET_BG resolves const labels and writes VIC background color", () => {
  const ctx = createMacroContext();
  const labels = new Map([["bg", 0x06]]);
  const bytes = compileBlock(ctx, {
    mnemonic: "SET_BG",
    isSetBgMacro: true,
    colorValue: "BG"
  }, labels, 0x3300);

  assert.deepEqual(bytes, [0xA9, 0x06, 0x8D, 0x21, 0xD0]);
});

test("CLEAR_SCREEN and WAIT_KEY emit the expected KERNAL calls", () => {
  const ctx = createMacroContext();
  assert.deepEqual(compileBlock(ctx, { mnemonic: "CLEAR_SCREEN", isClearScreenMacro: true }, new Map(), 0x3800), [0xA9, 0x93, 0x20, 0xD2, 0xFF]);
  assert.deepEqual(compileBlock(ctx, { mnemonic: "WAIT_KEY", isWaitKeyMacro: true }, new Map(), 0x3805), [0x20, 0xE4, 0xFF, 0xC9, 0x00, 0xF0, 0xF9]);
  assert.equal(ctx.getInstructionSize({ isClearScreenMacro: true }), 5);
  assert.equal(ctx.getInstructionSize({ isWaitKeyMacro: true }), 7);
});

test("CHARSET toggles VIC charset bit and WAIT_RASTER waits for a scanline", () => {
  const ctx = createMacroContext();
  assert.deepEqual(compileBlock(ctx, { mnemonic: "CHARSET", isCharsetMacro: true, charsetMode: "lower" }, new Map(), 0x3900), [0xAD, 0x18, 0xD0, 0x09, 0x02, 0x8D, 0x18, 0xD0]);
  assert.deepEqual(compileBlock(ctx, { mnemonic: "CHARSET", isCharsetMacro: true, charsetMode: "upper" }, new Map(), 0x3908), [0xAD, 0x18, 0xD0, 0x29, 0xFD, 0x8D, 0x18, 0xD0]);
  assert.deepEqual(compileBlock(ctx, { mnemonic: "WAIT_RASTER", isWaitRasterMacro: true, rasterLine: "FA" }, new Map(), 0x3910), [0xAD, 0x12, 0xD0, 0xC9, 0xFA, 0xD0, 0xF9]);
  assert.equal(ctx.getInstructionSize({ isCharsetMacro: true }), 8);
  assert.equal(ctx.getInstructionSize({ isWaitRasterMacro: true }), 7);
});

test("VAR blocks receive auto zero-page addresses in layout order", () => {
  const ctx = createMacroContext({
    program: [
      { id: "1", mnemonic: "VAR", isVarMacro: true, varName: "counter", varSize: 1, rawOperand: "", base: "hex" },
      { id: "2", mnemonic: "VAR", isVarMacro: true, varName: "timer", varSize: 2, rawOperand: "", base: "hex" },
      { id: "3", mnemonic: "WAIT_KEY", isWaitKeyMacro: true, rawOperand: "", base: "hex" }
    ]
  });
  const layout = ctx.getProgramLayout(0x0801);
  assert.equal(layout.lines[0].block._varAddress, 0x02);
  assert.equal(layout.lines[1].block._varAddress, 0x03);
  assert.equal(layout.lines[0].size, 0);
  assert.equal(layout.lines[1].size, 0);
});

test("assembly IF/ELSE/ENDIF keeps the active branch and skips the other", () => {
  const ctx = createMacroContext({
    program: [
      { id: "d1", mnemonic: "DEFINE", isDefineMacro: true, defineSymbol: "DEBUG", rawOperand: "DEBUG", base: "hex" },
      { id: "i1", mnemonic: "IF", isIfMacro: true, ifCondition: "DEBUG", rawOperand: "DEBUG", base: "hex" },
      { id: "c1", mnemonic: "CLEAR_SCREEN", isClearScreenMacro: true, rawOperand: "", base: "hex" },
      { id: "e1", mnemonic: "ELSE", isElseMacro: true, rawOperand: "", base: "hex" },
      { id: "w1", mnemonic: "WAIT_KEY", isWaitKeyMacro: true, rawOperand: "", base: "hex" },
      { id: "n1", mnemonic: "ENDIF", isEndIfMacro: true, rawOperand: "", base: "hex" }
    ]
  });
  const layout = ctx.getProgramLayout(0x0801);
  const clearLine = layout.lines.find((line) => line.block.mnemonic === "CLEAR_SCREEN");
  const waitLine = layout.lines.find((line) => line.block.mnemonic === "WAIT_KEY");
  assert.equal(clearLine.size, 5);
  assert.equal(waitLine.size, 0);
});

test("assembly IF skips the then-branch when the symbol is not defined", () => {
  const ctx = createMacroContext({
    program: [
      { id: "i1", mnemonic: "IF", isIfMacro: true, ifCondition: "RELEASE", rawOperand: "RELEASE", base: "hex" },
      { id: "c1", mnemonic: "CLEAR_SCREEN", isClearScreenMacro: true, rawOperand: "", base: "hex" },
      { id: "e1", mnemonic: "ELSE", isElseMacro: true, rawOperand: "", base: "hex" },
      { id: "w1", mnemonic: "WAIT_KEY", isWaitKeyMacro: true, rawOperand: "", base: "hex" },
      { id: "n1", mnemonic: "ENDIF", isEndIfMacro: true, rawOperand: "", base: "hex" }
    ]
  });
  const layout = ctx.getProgramLayout(0x0801);
  const clearLine = layout.lines.find((line) => line.block.mnemonic === "CLEAR_SCREEN");
  const waitLine = layout.lines.find((line) => line.block.mnemonic === "WAIT_KEY");
  assert.equal(clearLine.size, 0);
  assert.equal(waitLine.size, 7);
});

test("LOOP/NEXT compiles a counted decrementing loop", () => {
  const ctx = createMacroContext();
  const labels = new Map([["loop1", 0x4002]]);
  const loopBytes = compileBlock(ctx, {
    mnemonic: "LOOP",
    isLoopMacro: true,
    loopReg: "X",
    loopCount: "05",
    loopLabel: "loop1",
    base: "hex"
  }, labels, 0x4000);
  const nextBytes = compileBlock(ctx, {
    mnemonic: "NEXT",
    isNextMacro: true,
    nextReg: "X",
    nextLabel: "loop1",
    base: "hex"
  }, labels, 0x4002);

  assert.deepEqual(loopBytes, [0xA2, 0x05]);
  assert.deepEqual(nextBytes, [0xCA, 0xD0, 0xFD]);
  assert.equal(ctx.getInstructionSize({ isLoopMacro: true, loopCount: "05", base: "hex" }), 2);
  assert.equal(ctx.getInstructionSize({ isNextMacro: true }), 3);
});

test("FOR/ENDF compiles a counted incrementing loop", () => {
  const ctx = createMacroContext();
  const labels = new Map([["for1", 0x4102]]);
  const forBytes = compileBlock(ctx, {
    mnemonic: "FOR",
    isForMacro: true,
    loopReg: "Y",
    loopCount: "0A",
    loopLabel: "for1",
    base: "hex"
  }, labels, 0x4100);
  const endfBytes = compileBlock(ctx, {
    mnemonic: "ENDF",
    isEndfMacro: true,
    nextReg: "Y",
    nextLabel: "for1",
    nextCount: "0A",
    base: "hex"
  }, labels, 0x4102);

  assert.deepEqual(forBytes, [0xA0, 0x00]);
  assert.deepEqual(endfBytes, [0xC8, 0xC0, 0x0A, 0xD0, 0xFB]);
  assert.equal(ctx.getInstructionSize({ isForMacro: true }), 2);
  assert.equal(ctx.getInstructionSize({ isEndfMacro: true }), 5);
});

test("REPEAT/UNTIL compiles a runtime loop-back branch", () => {
  const ctx = createMacroContext();
  const labels = new Map([["repeat1", 0x5000]]);
  const repeatBytes = compileBlock(ctx, {
    mnemonic: "REPEAT",
    isRuntimeRepeatMacro: true,
    repeatStartLabel: "repeat1"
  }, labels, 0x5000);
  const untilBytes = compileBlock(ctx, {
    mnemonic: "UNTIL_A",
    isRuntimeUntilMacro: true,
    runtimeIfReg: "A",
    runtimeIfOp: "!=",
    rawOperand: "#$00",
    base: "hex",
    repeatStartLabel: "repeat1"
  }, labels, 0x5000);

  assert.deepEqual(repeatBytes, []);
  assert.deepEqual(untilBytes, [0xC9, 0x00, 0xF0, 0xFC]);
});

test("IRQ_SETUP emits vector, raster and CIA setup bytes", () => {
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
  assert.equal(ctx.getInstructionSize({ isIrqSetupMacro: true }), 46);
});

test("RAND emits the expected LFSR sequence at the chosen seed address", () => {
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

test("EXODECRUNCH emits the depacker setup, ROM toggle and JSR", () => {
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

test("runtime ELSE and ENDIF compile to jump and anchor bytes", () => {
  const ctx = createMacroContext();
  const labels = new Map([["if_end_1", 0x2015]]);
  const elseBytes = compileBlock(ctx, {
    mnemonic: "ELSE",
    isRuntimeElseMacro: true,
    runtimeIfEndLabel: "if_end_1"
  }, labels, 0x2000);
  const endBytes = compileBlock(ctx, {
    mnemonic: "ENDIF",
    isRuntimeEndIfMacro: true,
    runtimeIfEndLabel: "if_end_1"
  }, labels, 0x2010);

  assert.deepEqual(elseBytes, [0x4C, 0x15, 0x20]);
  assert.deepEqual(endBytes, []);
  assert.equal(ctx.getInstructionSize({ isRuntimeElseMacro: true }), 3);
  assert.equal(ctx.getInstructionSize({ isRuntimeEndIfMacro: true }), 0);
});

test("core helper macros emit stable bytes and sizes", () => {
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

test("WORD emits little-endian pairs and reports the right size", () => {
  const ctx = createMacroContext();
  const bytes = compileBlock(ctx, {
    mnemonic: "WORD",
    isWordMacro: true,
    rawOperand: "$1234, $ABCD",
    base: "hex"
  }, new Map(), 0x4500);

  assert.deepEqual(bytes, [0x34, 0x12, 0xCD, 0xAB]);
  assert.equal(ctx.getInstructionSize({ isWordMacro: true, rawOperand: "$1234, $ABCD", base: "hex" }), 4);
});

test("INCBIN becomes a deferred section at its target address", () => {
  const ctx = createMacroContext({
    program: [
      {
        id: "inc1",
        mnemonic: "INCBIN",
        isIncBinMacro: true,
        incBinFileName: "demo.bin",
        incBinAddress: "$C300",
        incBinBytes: [0x11, 0x22, 0x33]
      }
    ]
  });

  const layout = ctx.getProgramLayout(0x0801);
  const sections = ctx.getDeferredMemorySections(layout);
  const plainSections = JSON.parse(JSON.stringify(sections.map((section) => ({
    type: section.type,
    address: section.address,
    bytes: Array.from(section.bytes)
  }))));

  assert.deepEqual(plainSections, [
    { type: "incbin", address: 0xC300, bytes: [0x11, 0x22, 0x33] }
  ]);
});

test("disassembler sorts deferred data by rendered address, not source order", () => {
  const ctx = createMacroContext();
  const codeLine = {
    address: 0x1000,
    block: {
      mnemonic: "SEI",
      addressingMode: "implied"
    }
  };
  const deferredLine = {
    address: 0x1001,
    block: {
      isRawBytesMacro: true,
      rawBytesAddress: "$1100"
    }
  };

  assert.equal(ctx._disasmLineSortAddress(codeLine, new Map()), 0x1000);
  assert.equal(ctx._disasmLineSortAddress(deferredLine, new Map()), 0x1100);
  assert.equal(ctx._compareDisasmLayoutLineRefs({ line: deferredLine, index: 1 }, { line: codeLine, index: 0 }, new Map()) > 0, true);
});

test("ORG, TABLE, SID, INCBIN, and INCLUDE round-trip in expert text", () => {
  const ctx = loadFunctions(
    ["_splitAsmLineComment", "_importMakeIncBin", "parseExpertText", "_blockToExpertLine"],
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
    ["_splitAsmLineComment", "_importMakeIncBin", "parseExpertText"],
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
    ["_splitAsmLineComment", "_importMakeIncBin", "parseExpertText"],
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
    ["_splitAsmLineComment", "_importMakeIncBin", "_importMakeComment", "parseExpertText"],
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
