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

test("_importMakeInstruction keeps explicit 4-digit hex operands absolute in imported ASM", () => {
  const ctx = loadFunctions(
    ["_importMakeInstruction"],
    {
      crypto: { randomUUID: () => "test-id" },
      _importMnemonicCategory: () => "Memoria",
      _importMnemonicDescription: () => ""
    }
  );

  const branchMnems = new Set(["BEQ", "BNE", "BCC", "BCS", "BMI", "BPL", "BVC", "BVS", "BRA"]);
  const blocks = [
    ctx._importMakeInstruction("STA", "$0009", branchMnems),
    ctx._importMakeInstruction("BNE", "$0811", branchMnems),
    ctx._importMakeInstruction("LDY", "$002C", branchMnems),
    ctx._importMakeInstruction("STA", "$0009,X", branchMnems),
    ctx._importMakeInstruction("LDA", "$09", branchMnems)
  ];

  assert.equal(blocks[0].addressingMode, "absolute");
  assert.equal(blocks[0].rawOperand, "0009");

  assert.equal(blocks[1].addressingMode, "relative");
  assert.equal(blocks[1].rawOperand, "0811");

  assert.equal(blocks[2].addressingMode, "absolute");
  assert.equal(blocks[2].rawOperand, "002C");

  assert.equal(blocks[3].addressingMode, "absoluteX");
  assert.equal(blocks[3].rawOperand, "0009");

  assert.equal(blocks[4].addressingMode, "zeroPage");
  assert.equal(blocks[4].rawOperand, "09");
});

test("normalizeProgramOperands re-coerces loaded branch instructions to relative", () => {
  const ctx = loadFunctions(
    ["normalizeProgramOperands"],
    {
      Set,
      opcodeMap: { BNE: { relative: 0xD0 } },
      buildOperandPreview: (addressingMode, rawOperand) => ({
        error: "",
        operand: `${addressingMode}:${rawOperand}`
      })
    }
  );

  const [block] = ctx.normalizeProgramOperands([
    {
      mnemonic: "BNE",
      addressingMode: "absolute",
      rawOperand: "0811",
      base: "hex"
    }
  ]);

  assert.equal(block.addressingMode, "relative");
  assert.equal(block.operand, "relative:0811");
});

test("universal ASM export round-trips explicit absolute operands through expert import", () => {
  const exportAddressToAsm = new Map([
    [0x0801, "    LDA $093B,X"],
    [0x0804, "    STA $0009"],
    [0x0807, "    BNE $0811"],
    [0x0809, "    LDY $002C"],
    [0x080C, "    STA $0009,X"],
    [0x080F, "    LDA $09"]
  ]);

  const ctx = loadFunctions(
    ["_splitAsmLineComment", "_buildUniversalAsmExportText", "parseExpertText", "_importMakeInstruction"],
    {
      Map,
      Set,
      crypto: { randomUUID: () => "test-id" },
      appVersionText: "2.2.0-test",
      t: (key) => key,
      tf: (_key, values) => values?.directive || values?.mnemonic || "?",
      formatAddress: (value) => `$${value.toString(16).toUpperCase().padStart(4, "0")}`,
      program: [
        { mnemonic: "LDA" },
        { mnemonic: "STA" },
        { mnemonic: "BNE" },
        { mnemonic: "LDY" },
        { mnemonic: "STA" },
        { mnemonic: "LDA" }
      ],
      getProgramLayout: () => ({
        origin: { text: "$0801" },
        lines: [
          { address: 0x0801, block: { mnemonic: "LDA", addressingMode: "absoluteX", rawOperand: "093B" } },
          { address: 0x0804, block: { mnemonic: "STA", addressingMode: "absolute", rawOperand: "0009" } },
          { address: 0x0807, block: { mnemonic: "BNE", addressingMode: "relative", rawOperand: "0811" } },
          { address: 0x0809, block: { mnemonic: "LDY", addressingMode: "absolute", rawOperand: "002C" } },
          { address: 0x080C, block: { mnemonic: "STA", addressingMode: "absoluteX", rawOperand: "0009" } },
          { address: 0x080F, block: { mnemonic: "LDA", addressingMode: "zeroPage", rawOperand: "09" } }
        ]
      }),
      addLayoutLabels: () => {},
      _collectAnonLabels: () => [],
      getDeferredMemorySections: () => [],
      _compareLayoutLineRefs: (left, right) => left.index - right.index,
      compileLineBytes: (line) => ({
        ok: true,
        bytes: new Array(line.block.mnemonic === "BNE" ? 2 : (line.block.mnemonic === "LDA" && line.address === 0x080F ? 2 : 3)).fill(0)
      }),
      _formatPlainDisasmLines: (_bytes, address) => [exportAddressToAsm.get(address)],
      parseNumberByBase: () => null,
      parseAddressValue: () => null,
      parseByteMacro: () => [],
      parseFillMacro: () => ({ count: 0, value: 0 }),
      parseWordMacro: () => [],
      encodeTextMacro: () => [],
      encodePetsciiMacro: () => [],
      resolveProgramValueWithConst: () => 0,
      _importMnemonicCategory: () => "Memoria",
      _importMnemonicDescription: () => "",
      _importMakeComment: (commentText) => ({ id: "c", mnemonic: "COMMENT", isComment: true, commentText })
    }
  );

  ctx.parseAsmText = (text) => {
    const trimmed = String(text || "").trim();
    if (!trimmed) return [];
    const match = trimmed.match(/^([A-Za-z]{2,4})\s*(.*)$/);
    if (!match) {
      return [{ id: "d", mnemonic: "COMMENT", isComment: true, commentText: trimmed }];
    }
    const branchMnems = new Set(["BEQ", "BNE", "BCC", "BCS", "BMI", "BPL", "BVC", "BVS", "BRA"]);
    return [ctx._importMakeInstruction(match[1].toUpperCase(), match[2].trim(), branchMnems)];
  };

  const exported = ctx._buildUniversalAsmExportText();
  const relevantAsm = exported
    .split("\n")
    .filter((line) => /^\s*(LDA|STA|BNE|LDY)\b/.test(line))
    .join("\n");
  assert.match(relevantAsm, /STA \$0009/);
  assert.match(relevantAsm, /BNE \$0811/);

  const blocks = ctx.parseExpertText(relevantAsm).filter((block) => !block.isComment && !block.isBlankLine && !block.isOrgMacro);

  const normalized = JSON.parse(JSON.stringify(
    blocks.map((block) => ({ mnemonic: block.mnemonic, mode: block.addressingMode, raw: block.rawOperand }))
  ));

  assert.deepEqual(
    normalized,
    [
      { mnemonic: "LDA", mode: "absoluteX", raw: "093B" },
      { mnemonic: "STA", mode: "absolute", raw: "0009" },
      { mnemonic: "BNE", mode: "relative", raw: "0811" },
      { mnemonic: "LDY", mode: "absolute", raw: "002C" },
      { mnemonic: "STA", mode: "absoluteX", raw: "0009" },
      { mnemonic: "LDA", mode: "zeroPage", raw: "09" }
    ]
  );
});

test("_formatByteMacroAsmLines emits single-dollar hex bytes", () => {
  const ctx = loadFunctions(
    ["toHex", "parseNumberByBase", "_formatByteMacroAsmLines"],
    {
      resolveProgramNumericValue: () => null
    }
  );

  const lines = ctx._formatByteMacroAsmLines("$00, $90, 255", "dec");

  assert.deepEqual(
    JSON.parse(JSON.stringify(lines)),
    ["    .byte $00, $90, $FF"]
  );
});

test("_formatPlainWordLines emits single-dollar hex words", () => {
  const ctx = loadFunctions(
    ["toHex", "_formatPlainWordLines"]
  );

  const lines = ctx._formatPlainWordLines([0x1234, 0xABCD]);

  assert.deepEqual(
    JSON.parse(JSON.stringify(lines)),
    ["    .word $1234, $ABCD"]
  );
});

test("_buildUniversalAsmExportText rewrites internal absolute targets back to labels", () => {
  const ctx = loadFunctions(
    ["_buildUniversalAsmExportText", "_formatPlainDisasmLines", "_replaceAddressesWithLabels"],
    {
      Map,
      appVersionText: "2.2.0-test",
      t: (key) => key,
      formatAddress: (value) => `$${value.toString(16).toUpperCase().padStart(4, "0")}`,
      parseNumberByBase: () => null,
      parseAddressValue: () => null,
      parseByteMacro: () => [],
      parseFillMacro: () => ({ count: 0, value: 0 }),
      parseWordMacro: () => [],
      encodeTextMacro: () => [],
      encodePetsciiMacro: () => [],
      resolveProgramValueWithConst: () => 0,
      getDeferredMemorySections: () => [],
      _collectAnonLabels: () => [],
      _compareLayoutLineRefs: (left, right) => left.index - right.index,
      addLayoutLabels(labelMap, line) {
        if (line.block?.isLabel && line.block.labelName) {
          labelMap.set(line.block.labelName, line.address);
        }
      },
      _disasmBytes: () => [{ mnemonic: "JSR", operand: "$0805" }],
      compileLineBytes: () => ({ ok: true, bytes: [0x20, 0x05, 0x08] }),
      program: [
        { mnemonic: "LABEL" },
        { mnemonic: "JSR" },
        { mnemonic: "LABEL" }
      ],
      getProgramLayout: () => ({
        origin: { text: "$0801" },
        lines: [
          { address: 0x0801, block: { isLabel: true, labelName: "start" } },
          { address: 0x0801, block: { mnemonic: "JSR", addressingMode: "absolute", rawOperand: "0805" } },
          { address: 0x0805, block: { isLabel: true, labelName: "target_label" } }
        ]
      })
    }
  );

  const exported = ctx._buildUniversalAsmExportText();

  assert.match(exported, /JSR target_label/);
  assert.doesNotMatch(exported, /JSR \$0805/);
});

test("parseAsmText emits a single ORG block for one origin line", () => {
  const ctx = loadFunctions(
    ["_splitAsmLineComment", "parseAsmText"],
    {
      crypto: { randomUUID: () => "test-id" },
      _importMakeComment: (commentText) => ({ id: "c", mnemonic: "COMMENT", isComment: true, commentText }),
      _importMakeWord: () => ({ id: "w", mnemonic: "WORD" }),
      _importMakeFill: () => ({ id: "f", mnemonic: "FILL" }),
      _importMakeAlign: () => ({ id: "a", mnemonic: "ALIGN" }),
      _importMakeIncBin: () => ({ id: "i", mnemonic: "INCBIN" }),
      _importMakeConst: () => ({ id: "k", mnemonic: "CONST" }),
      _importMakeLabel: (labelName) => ({ id: "l", mnemonic: "LABEL", isLabel: true, labelName }),
      _importMakeByte: () => ({ id: "b", mnemonic: "BYTE" }),
      _importMakeRegion: () => ({ id: "r", mnemonic: "REGION" }),
      _importMakeEndRegion: () => ({ id: "re", mnemonic: "ENDREGION" }),
      _importMakeDefine: () => ({ id: "d", mnemonic: "DEFINE" }),
      _importMakeIf: () => ({ id: "if", mnemonic: "IF" }),
      _importMakeElse: () => ({ id: "el", mnemonic: "ELSE" }),
      _importMakeEndIf: () => ({ id: "ei", mnemonic: "ENDIF" }),
      _importMakeInstruction: (mnemonic, rawOperand) => ({ id: "ins", mnemonic, rawOperand }),
      t: (key) => key
    }
  );

  const blocks = ctx.parseAsmText("* = $0801");

  assert.equal(blocks.length, 1);
  assert.equal(blocks[0].isOrgMacro, true);
  assert.equal(blocks[0].orgAddress, "0801");
});

test("parseAsmText preserves Kick-style @local labels and branch operands", () => {
  const ctx = loadFunctions(
    ["_splitAsmLineComment", "parseAsmText"],
    {
      crypto: { randomUUID: () => "test-id" },
      _importMakeComment: (commentText) => ({ id: "c", mnemonic: "COMMENT", isComment: true, commentText }),
      _importMakeWord: () => ({ id: "w", mnemonic: "WORD" }),
      _importMakeFill: () => ({ id: "f", mnemonic: "FILL" }),
      _importMakeAlign: () => ({ id: "a", mnemonic: "ALIGN" }),
      _importMakeIncBin: () => ({ id: "i", mnemonic: "INCBIN" }),
      _importMakeConst: () => ({ id: "k", mnemonic: "CONST" }),
      _importMakeLabel: (labelName) => ({ id: `l:${labelName}`, mnemonic: "LABEL", isLabel: true, labelName }),
      _importMakeByte: () => ({ id: "b", mnemonic: "BYTE", isByteMacro: true }),
      _importMakeRegion: () => ({ id: "r", mnemonic: "REGION" }),
      _importMakeEndRegion: () => ({ id: "re", mnemonic: "ENDREGION" }),
      _importMakeDefine: () => ({ id: "d", mnemonic: "DEFINE" }),
      _importMakeIf: () => ({ id: "if", mnemonic: "IF" }),
      _importMakeElse: () => ({ id: "el", mnemonic: "ELSE" }),
      _importMakeEndIf: () => ({ id: "ei", mnemonic: "ENDIF" }),
      _importMakeInstruction: (mnemonic, rawOperand) => ({ id: `ins:${mnemonic}`, mnemonic, rawOperand, addressingMode: mnemonic === "BEQ" ? "relative" : "implied" }),
      t: (key) => key
    }
  );

  const blocks = ctx.parseAsmText([
    "@no_xhi_bmp:",
    "BEQ @no_xhi_bmp",
    "@no_xhi_col: NOP",
    "BEQ @no_xhi_col"
  ].join("\n"));

  assert.equal(blocks[0].isLabel, true);
  assert.equal(blocks[0].labelName, "@no_xhi_bmp");
  assert.equal(blocks[1].mnemonic, "BEQ");
  assert.equal(blocks[1].rawOperand, "@no_xhi_bmp");
  assert.equal(blocks[2].isLabel, true);
  assert.equal(blocks[2].labelName, "@no_xhi_col");
  assert.equal(blocks[3].mnemonic, "NOP");
  assert.equal(blocks[4].mnemonic, "BEQ");
  assert.equal(blocks[4].rawOperand, "@no_xhi_col");
});

test("buildAutostartPrgForEmulator skips BASIC SYS wrapping when the program already has a BASIC autostart stub", () => {
  let assembleOrigin = null;
  const ctx = loadFunctions(
    ["_programHasEmbeddedBasicAutostart", "_buildAutostartPrgCore"],
    {
      program: [
        { isOrgMacro: true, orgAddress: "0801" },
        { isByteMacro: true, rawOperand: "0B,08,0A,00,9E,32,30,36,31,00,00,00" },
        { mnemonic: "LDA", addressingMode: "immediate", rawOperand: "$01" }
      ],
      basicSysToggle: { checked: true },
      parseOriginValue: () => ({ value: 0x0801 }),
      assembleProgramToPrg(origin) {
        assembleOrigin = origin;
        return { ok: true, bytes: new Uint8Array([0x01, 0x08, 0xAA]) };
      }
    }
  );

  assert.equal(ctx._programHasEmbeddedBasicAutostart(ctx.program), true);
  const result = ctx._buildAutostartPrgCore();
  assert.equal(assembleOrigin, 0x0801);
  assert.equal(result.ok, true);
  assert.deepEqual(Array.from(result.bytes), [0x01, 0x08, 0xAA]);
});
