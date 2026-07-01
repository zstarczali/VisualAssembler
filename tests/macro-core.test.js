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
      "parseDelayFrameCount",
      "parseMacroAddress",
      "addLayoutLabels",
      "getDeferredMemorySections",
      "compileAbsoluteStore",
      "compilePrintHexA",
      "getDeferredMacroAddressField",
      "getProgramLayout",
      "compileLineBytes",
      "getInstructionSize"
    ],
    {
      crypto: { randomUUID: () => "00000000-0000-4000-8000-000000000000" },
      getLiveValidationError: () => "",
      opcodeMap: {
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
      DELAY_HELPER_LABEL: "__delay_wait_frames",
      parseOriginValue: () => ({ value: 0x0801, text: "$0801", error: "" }),
      resolveProgramConstValue: () => null,
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

test("SPRITE_INIT writes sprite pointer, enable bit, and color", () => {
  const ctx = createMacroContext();
  const bytes = compileBlock(ctx, {
    mnemonic: "SPRITE_INIT",
    isSpriteInitMacro: true,
    spriteNum: "2",
    spriteColor: "5",
    spriteDataPage: "40"
  }, new Map(), 0x3300);

  assert.deepEqual(bytes, [
    0xA9, 0x40,
    0x8D, 0xFA, 0x07,
    0xAD, 0x15, 0xD0,
    0x09, 0x04,
    0x8D, 0x15, 0xD0,
    0xA9, 0x05,
    0x8D, 0x29, 0xD0
  ]);
  assert.equal(ctx.getInstructionSize({ isSpriteInitMacro: true }), 18);
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
