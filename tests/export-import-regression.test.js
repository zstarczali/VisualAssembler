const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const { spawnSync } = require("node:child_process");
const vm = require("node:vm");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");

const extractFunction = require("./helpers/extract-function");
const extractFunctionSource = name => extractFunction(appJs, name);

function loadFunctions(names, extraContext = {}) {
  const context = { ...extraContext };
  vm.createContext(context);
  for (const name of names) {
    vm.runInContext(`${extractFunctionSource(name)}; this["${name}"] = ${name};`, context);
  }
  return context;
}

test("ACME Run sends an autostart source through the configured compiler", async () => {
  let submitted;
  const ctx = loadFunctions(["_buildAcmePrg", "_acmeVaSyntaxErrors", "_acmeVaMacroBlockErrors", "buildBasicSysStub", "_acmeFirstOrigin", "_acmeParseErrors"], {
    program: [{ isOrgMacro: true, orgAddress: "0801" }],
    _ACME_BLOCK_FLAGS: new Set(["isOrgMacro", "isByteMacro", "isWordMacro", "isFillMacro", "isAlignMacro"]),
    userMacros: {},
    expertMode: false,
    basicSysToggle: { checked: true },
    _expertGetStartupProgram: () => null,
    parseUserMacros: () => {},
    _getEmbeddedBasicSysAddress: () => null,
    parseOriginValue: () => ({ value: 0x0801 }),
    _buildUniversalAsmExportText: origin => `* = $${origin.toString(16).toUpperCase().padStart(4, "0")}\nstart:\n    LDA #$01\n    STA $D020\n    RTS\n    .byte $11`,
    toHex: (value, width) => `$${value.toString(16).toUpperCase().padStart(width, "0")}`,
    window: { electronAPI: { buildAcmePrg: async (source, name) => {
      submitted = { source, name };
      return { ok: true, bytes: [1, 8, 11, 8] };
    } } }
  });
  const result = await ctx._buildAcmePrg();
  assert.equal(result.ok, true);
  assert.equal(result.sysAddress, 0x080D);
  assert.match(submitted.source, /^\* = \$0801\n    !byte \$0B, \$08, \$0A, \$00, \$9E, \$32, \$30, \$36, \$31, \$00, \$00, \$00/m);
  assert.match(submitted.source, /\* = \$080D\nstart:\n    LDA #\$01/);
  assert.match(submitted.source, /    !byte \$11/);
  assert.match(submitted.name, /\.asm$/);
  // VA macros are not expanded into ACME source.
  submitted = null;
  ctx.tf = (_key, values) => `${values.directive ?? values.count} is VMA-only`;
  ctx.program = [{ isOrgMacro: true, orgAddress: "0801" }, { isSetBorderMacro: true, mnemonic: "SET_BORDER", _srcLine: 1 }];
  const rejected = await ctx._buildAcmePrg();
  assert.equal(rejected.ok, false);
  assert.equal(submitted, null);
  assert.deepEqual(Array.from(rejected.errors, error => error.text), ["SET_BORDER is VMA-only"]);
  if (process.env.ACME_EXE) {
    const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), "c64va-acme-test-"));
    try {
      const sourceFile = path.join(outputDir, "run.a");
      const outputFile = path.join(outputDir, "run.prg");
      fs.writeFileSync(sourceFile, submitted.source);
      const compile = spawnSync(process.env.ACME_EXE, ["-f", "cbm", "-o", outputFile, sourceFile], { encoding: "utf8" });
      assert.equal(compile.status, 0, compile.stderr || compile.stdout || String(compile.error));
      const bytes = fs.readFileSync(outputFile);
      assert.deepEqual(Array.from(bytes.subarray(0, 14)), [1, 8, 11, 8, 10, 0, 158, 50, 48, 54, 49, 0, 0, 0]);
      assert.deepEqual(Array.from(bytes.subarray(14, 20)), [0xA9, 1, 0x8D, 0x20, 0xD0, 0x60]);
    } finally {
      fs.rmSync(outputDir, { recursive: true, force: true });
    }
  }
});

test("ACME bridge sends the payload shape required by the Tauri command", async () => {
  const bridge = fs.readFileSync(path.join(__dirname, "..", "www", "tauri-bridge.js"), "utf8");
  let call;
  const context = { window: { __TAURI__: { core: { invoke: async (name, args) => { call = { name, args }; } } } } };
  vm.runInNewContext(bridge, context);
  await context.window.electronAPI.buildAcmePrg("* = $0801", "test.asm", "F:\\project\\main.a");
  assert.equal(call.name, "build_acme_prg");
  assert.equal(call.args.payload.source, "* = $0801");
  assert.equal(call.args.payload.fileName, "test.asm");
  assert.equal(call.args.payload.sourcePath, "F:\\project\\main.a");
});

test("ACME Expert Run preserves assembler expressions and directives", async () => {
  let submitted;
  const original = "!cpu 6502\n* = $c000\n    lda #$06\n    sta $d020\n    rts\n!16 65535, symbol, -32768\n!wo 14, $4f35\n!word 3000 - 4, a1 AND a2, 2 ^ tz, (3+4)*70, l1 & .j2";
  const ctx = loadFunctions(["_buildAcmePrg", "_acmeVaSyntaxErrors", "_acmeVaDirective", "buildBasicSysStub", "_acmeFirstOrigin", "_acmeParseErrors", "_acmeLowestOrigin", "_acmeEntryHint"], {
    program: [], userMacros: {}, expertMode: true,
    _ACME_VA_CLOSERS: new Set(["endregion", "endif", "else", "endm", "endmacro", "endf", "next", "end"]),
    _DIRECTIVE_TO_MNEM: { loop: "LOOP", end: "END", region: "REGION" },
    basicSysToggle: { checked: true },
    _expertGetStartupProgram: () => null,
    _expertBuildProgram: () => [],
    _expertGetSourceText: () => original,
    parseUserMacros: () => {},
    _getEmbeddedBasicSysAddress: () => null,
    parseOriginValue: () => ({ value: 0x0801 }),
    _buildUniversalAsmExportText: () => { throw Error("Expert source must not be regenerated"); },
    toHex: (value, width) => `$${value.toString(16).toUpperCase().padStart(width, "0")}`,
    window: { electronAPI: { buildAcmePrg: async source => {
      submitted = source;
      return { ok: true, bytes: [1, 8] };
    } } }
  });
  const result = await ctx._buildAcmePrg();
  assert.equal(result.ok, true);
  assert.equal(result.sysAddress, 0xC000);
  assert.ok(submitted.endsWith(original));
  assert.ok(!submitted.includes("$0NAN"));
});

test("ACME Build rejects VMA macros without translating native ACME syntax", async () => {
  let compiled = false;
  const ctx = loadFunctions(["_buildAcmePrg", "_acmeVaSyntaxErrors", "_acmeVaDirective"], {
    program: [], userMacros: {}, expertMode: true,
    _ACME_VA_CLOSERS: new Set(["endregion", "endif", "else", "endm", "endmacro", "endf", "next", "end"]),
    _DIRECTIVE_TO_MNEM: { loop: "LOOP", end: "END", region: "REGION" },
    opcodeMap: { LDA: {}, RTS: {} },
    _expertGetStartupProgram: () => null,
    _expertGetSourceText: () => '* = $0801\n!region init\n!text 14, 8, "hello c64!", lower\n!endregion',
    tf: (_key, values) => `${values.directive} is VMA-only`,
    window: { electronAPI: { buildAcmePrg: async () => { compiled = true; } } }
  });
  const result = await ctx._buildAcmePrg();
  assert.equal(result.ok, false);
  assert.equal(compiled, false);
  assert.deepEqual(Array.from(result.errors, error => error.sourceLine), [1, 2, 3]);
  assert.equal(ctx._acmeVaSyntaxErrors('!cpu 6502\n!text "HELLO"\n!word 12').length, 0);
  // VA source is not translated to ACME: its dot directives are reported.
  const va = ctx._acmeVaSyntaxErrors("* = $0801\n.region Main\n.const BORDER = $D020\n    LDA #$01\n.byte $01, $02\n.endregion");
  assert.deepEqual(Array.from(va, error => error.sourceLine), [1, 2, 4, 5]);
  assert.equal(ctx._acmeVaSyntaxErrors(".loop LDA #$00\n.loop\n.count = 3\n    bne .loop\n    RTS").length, 0);
  // A VA directive name on its own is an error unless used as a label operand.
  assert.deepEqual(Array.from(ctx._acmeVaSyntaxErrors("    RTS\n.end"), error => error.sourceLine), [1]);
  assert.deepEqual(Array.from(ctx._acmeVaSyntaxErrors(".loop\n    RTS"), error => error.sourceLine), [0]);
});

test("ACME preview uses compiled PRG bytes and ACME labels", () => {
  const ctx = loadFunctions(
    ["_acmeParseLabels", "_acmePrgMemory", "_acmeReportKinds", "_acmeDisasmHTML", "_acmeMonitorText", "_acmePreviewSegments", "_acmePreviewByteCount", "_formatMonitorMemory", "_replaceAddressesWithLabels", "_disasmBytes", "_escHtml"],
    {
      _REV_OP: {
        0xA9: { mnem: "LDA", mode: "immediate", size: 2 },
        0x8D: { mnem: "STA", mode: "absolute", size: 3 },
        0x60: { mnem: "RTS", mode: "implied", size: 1 }
      },
      _extractBasicStubSection: () => null,
      t: key => key,
      formatAddress: address => `$${address.toString(16).toUpperCase().padStart(4, "0")}`
    }
  );
  const preview = { bytes: [0x00, 0xC0, 0xA9, 0x06, 0x8D, 0x20, 0xD0, 0x60, 0x00, 0xC0], labels: "start  =$c000\ntable =$c006", report: "     4  c000 a906                   lda #$06\n     5  c002 8d20d0                 sta $d020\n     6  c005 60                     rts\n     8  c006 00c0                   !word start" };
  const html = ctx._acmeDisasmHTML(preview);
  assert.match(html, /start:/);
  assert.match(html, /\$C000[\s\S]*A9 06[\s\S]*LDA[\s\S]*#\$06/);
  assert.match(html, /\$C002[\s\S]*8D 20 D0[\s\S]*STA[\s\S]*\$D020/);
  assert.match(html, /\$C006[\s\S]*00 C0[\s\S]*\.BYTE/);
  assert.match(ctx._acmeMonitorText(preview), />\$C000\s+A9 06 8D 20 D0 60/);


  // VA's SYS stub at $0801 plus code at $C000: the zero filler between them is
  // not shown or counted, the stub only with "Show BASIC stub".
  const stub = [0x0C, 0x08, 0x0A, 0x00, 0x9E, 0x34, 0x39, 0x31, 0x35, 0x32, 0x00, 0x00, 0x00];
  const code = [0xA9, 0x06, 0x8D, 0x20, 0xD0, 0x60];
  const far = { bytes: [0x01, 0x08, ...stub, ...new Array(0xC000 - 0x0801 - stub.length).fill(0), ...code], labels: "", report: "", sysAddress: 0xC000, stubGenerated: true };
  ctx._extractBasicStubSection = () => ({ address: 0x0801, bytes: stub });
  ctx.showBasicStubToggle = { checked: false };
  assert.equal(ctx._acmePreviewByteCount(far), stub.length + code.length);
  assert.doesNotMatch(ctx._acmeDisasmHTML(far), /BRK|\$0801/);
  assert.match(ctx._acmeDisasmHTML(far), /\$C000[\s\S]*LDA/);
  assert.doesNotMatch(ctx._acmeMonitorText(far), />\$0(8|9)/);
  ctx.showBasicStubToggle = { checked: true };
  assert.match(ctx._acmeMonitorText(far), />\$0800[\s\S]*>\$C000/);
  assert.doesNotMatch(ctx._acmeMonitorText(far), />\$0900/);

  // Comment-only source: the PRG is just the generated stub, nothing to show.
  const stubOnly = [0x0B, 0x08, 0x0A, 0x00, 0x9E, 0x32, 0x30, 0x36, 0x31, 0x00, 0x00, 0x00];
  const empty = { bytes: [0x01, 0x08, ...stubOnly], labels: "", report: "", sysAddress: 0x080D, stubGenerated: true };
  ctx._extractBasicStubSection = () => ({ address: 0x0801, bytes: stubOnly });
  ctx.showBasicStubToggle = { checked: false };
  assert.equal(ctx._acmePreviewByteCount(empty), 0);
  assert.doesNotMatch(ctx._acmeDisasmHTML(empty), /\$0801|\.BYTE/);
  assert.equal(ctx._acmeMonitorText(empty), "");
  // No program at all: the stub alone is not shown, even with "show BASIC stub" on.
  ctx.showBasicStubToggle = { checked: true };
  assert.equal(ctx._acmeMonitorText(empty), "");
  assert.doesNotMatch(ctx._acmeDisasmHTML(empty), /\$0801|\.BYTE/);
});

test("ACME preview rejects a changed source instead of showing stale bytes", () => {
  const ctx = loadFunctions(["_acmePreviewCurrent"], {
    _acmePreview: { tabId: "tab-1", sourceText: "lda #1", bytes: [0, 192, 169, 1] },
    assemblerSyntax: "acme", expertMode: true, activeTabId: "tab-1",
    _expertGetSourceText: () => "lda #2"
  });
  assert.equal(ctx._acmePreviewCurrent(), null);
});

test("ACME errors retain every diagnostic and map temporary source lines back to Expert", () => {
  const ctx = loadFunctions(["_acmeParseErrors"]);
  const output = "Error - File C:\\Users\\test\\Temp\\c64-visual-assembler-1-2.a, line 14 (Zone <untitled>): Value not defined (symbol).\nError - File C:\\project\\included.a, line 3 (Zone <untitled>): Unknown operator.";
  const errors = ctx._acmeParseErrors(output, 2);
  assert.equal(errors.length, 2);
  assert.equal(errors[0].sourceLine, 11);
  assert.equal(errors[1].sourceLine, null);
  assert.match(errors[0].text, /symbol/);
});

test("ACME Build opens the normal compiler-error dialog with all diagnostics", async () => {
  const button = { disabled: false };
  let shown;
  const ctx = loadFunctions(["_acmeBuildPreview"], {
    document: { getElementById: () => button },
    _expertGetSourceText: () => "invalid source",
    activeTabId: "tab-1",
    _buildAcmePrg: async () => ({ ok: false, error: "first error", errors: [
      { text: "first error", sourceLine: 2 }, { text: "second error", sourceLine: 3 }
    ] }),
    _expertSetStatus: () => {},
    showCompileErrorDialog: errors => { shown = errors; },
    _expertDisasmVisible: false, _expertMonitorVisible: false,
    _acmeScheduleAutoBuild: () => {}, _acmeUpdateAnalysis: () => {}, _acmeBuildRunning: false, _acmePreviewError: null,
    t: key => key
  });
  await ctx._acmeBuildPreview();
  assert.equal(shown.length, 2);
  assert.equal(shown[0].sourceLine, 2);
  assert.equal(button.disabled, false);
});


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
    ["_splitAsmLineComment", "_buildUniversalAsmExportText", "_kickScopeRewrite", "parseExpertText", "_importMakeInstruction"],
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

test("parseAsmText accepts quoted Kick-style titles after ORG lines", () => {
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

  const blocks = ctx.parseAsmText('*=$0800 "BASIC Start"\n*=$1000 "Main Start"');

  assert.equal(blocks.length, 2);
  assert.equal(blocks[0].isOrgMacro, true);
  assert.equal(blocks[0].orgAddress, "0800");
  assert.equal(blocks[1].isOrgMacro, true);
  assert.equal(blocks[1].orgAddress, "1000");
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
    ["_getEmbeddedBasicSysAddress", "_programHasEmbeddedBasicAutostart", "_buildAutostartPrgCore"],
    {
      program: [
        { isOrgMacro: true, orgAddress: "0801" },
        { isByteMacro: true, rawOperand: "0C,08,0A,00,9E,20,32,30,36,31,00,00,00" },
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
  assert.equal(result.sysAddress, 0x080D);
  assert.deepEqual(Array.from(result.bytes), [0x01, 0x08, 0xAA]);
});

// ── v2.3.9 assembler extensions: parser round-trips ─────────────────────────

function extCtx() {
  return loadFunctions(
    ["_splitAsmLineComment", "parseAsmText", "_importMakeAssert", "_importMakeInstruction"],
    {
      crypto: { randomUUID: () => "test-id" },
      t: (key) => key,
      _importMnemonicCategory: (mn) => (/^LB/.test(mn) ? "HosszuUgrasok" : "Ugrasok"),
      _importMnemonicDescription: () => "",
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
      _importMakeEndIf: () => ({ id: "ei", mnemonic: "ENDIF" })
    }
  );
}

test("parseAsmText keeps the leading dot on local label definitions", () => {
  const ctx = extCtx();
  const bareDot = ctx.parseAsmText(".loop");
  assert.equal(bareDot[0].isLabel, true);
  assert.equal(bareDot[0].labelName, ".loop");

  const withColon = ctx.parseAsmText(".done:");
  assert.equal(withColon[0].isLabel, true);
  assert.equal(withColon[0].labelName, ".done");

  const labelAndInstr = ctx.parseAsmText(".loop: LDA data,X");
  assert.equal(labelAndInstr[0].labelName, ".loop");
  assert.equal(labelAndInstr[1].mnemonic, "LDA");
});

test("parseAsmText recognises .assert with an optional message", () => {
  const ctx = extCtx();
  const a = ctx.parseAsmText('.assert end - start <= 256');
  assert.equal(a[0].isAssertMacro, true);
  assert.equal(a[0].assertExpr, "end - start <= 256");
  assert.equal(a[0].assertMessage, "");

  const b = ctx.parseAsmText('.assert size <= 40, "row too wide"');
  assert.equal(b[0].isAssertMacro, true);
  assert.equal(b[0].assertExpr, "size <= 40");
  assert.equal(b[0].assertMessage, "row too wide");
});

test("parseAsmText builds long-branch and SMC-label blocks from instruction lines", () => {
  const ctx = extCtx();
  const lb = ctx.parseAsmText("LBNE far_target");
  assert.equal(lb[0].isLongBranchMacro, true);
  assert.equal(lb[0].longBranchCond, "NE");
  assert.equal(lb[0].rawOperand, "far_target");

  const smc = ctx.parseAsmText("LDA value:#$00");
  assert.equal(smc[0].mnemonic, "LDA");
  assert.equal(smc[0].smcLabel, "value");
  assert.equal(smc[0].rawOperand, "00");
  assert.equal(smc[0].base, "hex");
  assert.equal(smc[0].addressingMode, "immediate");
});

test("ACME mode rebuilds automatically only while the Disassembly / Monitor panel or the cycle gutter is on", () => {
  let scheduled = 0;
  const base = {
    assemblerSyntax: "acme", expertMode: true, _expertDisasmVisible: false, _expertMonitorVisible: false, _expertCyclesEnabled: false,
    _expertParseTimer: null, activeTabId: "t1", _acmePreview: null, _acmePreviewError: null,
    _expertGetSourceText: () => "lda #1",
    _acmePreviewCurrent: () => null,
    _acmeBuildPreview: () => {},
    window: { electronAPI: { buildAcmePrg: () => {} } },
    clearTimeout: () => {},
    setTimeout: () => { scheduled++; return 1; }
  };
  const ctx = loadFunctions(["_acmeScheduleAutoBuild", "_acmePreviewErrorCurrent"], base);
  ctx._acmeScheduleAutoBuild();
  assert.equal(scheduled, 0);
  ctx._expertCyclesEnabled = true;
  ctx._acmeScheduleAutoBuild();
  assert.equal(scheduled, 1);
  ctx._expertCyclesEnabled = false;
  scheduled = 0;
  ctx._expertDisasmVisible = true;
  ctx._acmeScheduleAutoBuild();
  assert.equal(scheduled, 1);
  // A failed build of the same text is not retried until the text changes.
  ctx._acmePreviewError = { tabId: "t1", sourceText: "lda #1", text: "error" };
  ctx._acmeScheduleAutoBuild();
  assert.equal(scheduled, 1);
  ctx.assemblerSyntax = "kick";
  ctx._acmePreviewError = null;
  ctx._acmeScheduleAutoBuild();
  assert.equal(scheduled, 1);
});

test(".proj names its assembler and old files still open with the right one", () => {
  const ctx = loadFunctions(["_projAssemblerFields", "_projAssemblerSyntax"]);
  assert.deepEqual({ ...ctx._projAssemblerFields("acme") }, { assembler: "acme", assemblerSyntax: "acme" });
  assert.deepEqual({ ...ctx._projAssemblerFields("kick") }, { assembler: "vma", assemblerSyntax: "kick" });
  assert.equal(ctx._projAssemblerSyntax({ assembler: "ACME" }), "acme");
  assert.equal(ctx._projAssemblerSyntax({ assembler: "vma", assemblerSyntax: "acme" }), "kick");
  assert.equal(ctx._projAssemblerSyntax({ assemblerSyntax: "acme" }), "acme");
  assert.equal(ctx._projAssemblerSyntax({}), "kick");
});

test("_importMakeInstruction honours Kick Assembler .abs / .zp mnemonic suffixes", () => {
  const ctx = loadFunctions(
    ["_importMakeInstruction"],
    {
      crypto: { randomUUID: () => "test-id" },
      _importMnemonicCategory: () => "Memoria",
      _importMnemonicDescription: () => ""
    }
  );
  const branchMnems = new Set(["BEQ", "BNE"]);
  const make = (mnemonic, operand) => ctx._importMakeInstruction(mnemonic, operand, branchMnems);

  // sta.abs $fc,x / lda.a 48,x: absolute even for a zero page value.
  const absX = make("STA", ".abs $fc,x");
  assert.equal(absX.addressingMode, "absoluteX");
  assert.equal(absX.rawOperand, "00FC");
  assert.equal(absX.operand, "$00FC,X");
  const absDec = make("LDA", ".a 48,x");
  assert.equal(absDec.addressingMode, "absoluteX");
  assert.equal(absDec.rawOperand, "0030");
  assert.equal(make("STA", ".abs $00fc,x").addressingMode, "absoluteX");

  // stx.zp label,y / lda.z $0040: zero page; a symbol keeps the flag for the Expert line.
  const zpLabel = make("STX", ".zp zpLabel,y");
  assert.equal(zpLabel.addressingMode, "zeroPageY");
  assert.equal(zpLabel.forceZeroPage, true);
  const zpHex = make("LDA", ".z $0040");
  assert.equal(zpHex.addressingMode, "zeroPage");
  assert.equal(zpHex.rawOperand, "40");
  assert.equal(zpHex.forceZeroPage, undefined);

  // A dotted local label is not a suffix.
  assert.equal(make("LDA", ".a").rawOperand, ".a");
});

test("_kickTextBytes encodes Kick Assembler .text with the active .encoding", () => {
  const ctx = loadFunctions(["_kickTextBytes"]);
  const enc = (op, e) => Array.from(ctx._kickTextBytes(op, e));
  // screencode_mixed (Kick default): lower → $01-$1A, upper stays, "@[]" → $00/$1B/$1D.
  assert.deepEqual(enc('"aZ@[]1 "', "screencode_mixed"), [0x01, 0x5A, 0x00, 0x1B, 0x1D, 0x31, 0x20]);
  assert.deepEqual(enc('"aZ@"', "screencode_upper"), [0x01, 0x1A, 0x00]);
  assert.deepEqual(enc('"aZ$"', "petscii_upper"), [0x41, 0x5A, 0x24]);
  assert.deepEqual(enc('"aZ"', "petscii_mixed"), [0x41, 0xDA]);
  // Several items, escapes only in @"..." strings, number items.
  assert.deepEqual(enc('"A\\n", $0d, 7 + @"B\\$ff\\n"', "petscii_upper"), [0x41, 0x5C, 0x4E, 0x0D, 0x07, 0x42, 0xFF, 0x0A]);
  // No code in the encoding → null.
  assert.deepEqual(enc('"{"', "screencode_mixed"), [null]);
  assert.deepEqual(enc('"x"', "nonsense"), [null]);
});

test("_buildRelocatingLoader starts an image that overlaps the BASIC SYS stub", () => {
  const { cpu } = require("./mini6502");
  const ctx = loadFunctions(["buildBasicSysStub", "_buildRelocatingLoader"]);
  const runLoader = (image, loadAddr, entry) => {
    const prg = ctx._buildRelocatingLoader(image, loadAddr, entry);
    assert.ok(prg, "loader built");
    assert.equal(prg[0] | (prg[1] << 8), 0x0801);
    const mem = new Uint8Array(65536).fill(0xAA);
    mem.set(prg.subarray(2), 0x0801);
    // BASIC line "SYS2061"
    assert.equal(mem[0x0805], 0x9E);
    assert.equal(String.fromCharCode(...mem.subarray(0x0806, 0x080A)), "2061");
    const c = cpu(mem);
    c.pc = 0x080D;
    for (let k = 0; k < 2000000 && c.pc !== entry; k++) c.step();
    assert.equal(c.pc, entry);
    assert.equal(c.i, 0);
    for (let i = 0; i < image.length; i++) {
      if (mem[loadAddr + i] !== image[i]) assert.fail(`byte $${(loadAddr + i).toString(16)}`);
    }
    return prg;
  };
  // Small image below $0801 → stored after the mover and copied down.
  const small = Uint8Array.from({ length: 700 }, (_, i) => (i * 7 + 1) & 0xFF);
  runLoader(small, 0x0700, 0x0710);
  // $071c-$d020 like an imported Restore64 dump: shifted it would reach $D000, so it loads
  // in place and the displaced head rides in a zero run.
  const big = Uint8Array.from({ length: 0xD021 - 0x071C }, (_, i) => (i * 13 + 5) & 0xFF);
  big.fill(0, 0x7000, 0x8000);
  const prg = runLoader(big, 0x071C, 0x0C40);
  assert.ok(0x0801 + prg.length - 2 <= 0xD021 + 1, "in-place PRG ends with the image");
  // No room: no zero run.
  assert.equal(ctx._buildRelocatingLoader(big.map(v => v || 1), 0x071C, 0x0C40), null);
});

test("Kick .label NAME = * + N places a label inside an instruction", () => {
  const ctx = loadFunctions(["addLayoutLabels", "_blockToExpertLine"], {});
  const labels = new Map();
  ctx.addLayoutLabels(labels, { address: 0xC473, block: { isLabel: true, labelName: "loc_c474", labelOffset: 1 } });
  ctx.addLayoutLabels(labels, { address: 0xC480, block: { isLabel: true, labelName: "back", labelOffset: -2 } });
  ctx.addLayoutLabels(labels, { address: 0xC490, block: { isLabel: true, labelName: "plain" } });
  assert.equal(labels.get("loc_c474"), 0xC474);
  assert.equal(labels.get("back"), 0xC47E);
  assert.equal(labels.get("plain"), 0xC490);
  assert.equal(ctx._blockToExpertLine({ isLabel: true, labelName: "loc_c474", labelOffset: 1 }), ".label loc_c474 = * + 1");
  assert.equal(ctx._blockToExpertLine({ isLabel: true, labelName: "plain" }), "plain:");
  // The Expert parser takes the same line back (see parseExpertText's pcLabelM).
  assert.ok(appJs.includes("const pcLabelM = line.match(/^\\.label\\s+"));
});

test("ACME memory dump below $0801: no stub shift, start loader around the plain image", async () => {
  let submitted;
  const original = "* = $0801\nstart lda $08e5\n !ct screencode\n !text \"hi\"\n !ct pet\n* = $071c\n !byte 1, 2";
  // Plain image $071c-$0806 (ACME output is not run here: fake bytes of the right size).
  const image = new Uint8Array(2 + 0x0807 - 0x071C);
  image[0] = 0x1C; image[1] = 0x07;
  const base = {
    program: [], userMacros: {}, expertMode: true,
    _ACME_VA_CLOSERS: new Set(["endregion", "endif", "else", "endm", "endmacro", "endf", "next", "end"]),
    _DIRECTIVE_TO_MNEM: { loop: "LOOP", end: "END", region: "REGION" },
    basicSysToggle: { checked: true },
    _expertGetStartupProgram: () => null,
    _expertBuildProgram: () => [],
    _expertGetSourceText: () => original,
    parseUserMacros: () => {},
    _getEmbeddedBasicSysAddress: () => null,
    parseOriginValue: () => ({ value: 0x0801 }),
    formatAddress: a => "$" + a.toString(16),
    tf: k => k,
    toHex: (value, width) => `$${value.toString(16).toUpperCase().padStart(width, "0")}`,
    window: { electronAPI: { buildAcmePrg: async source => { submitted = source; return { ok: true, bytes: Array.from(image) }; } } }
  };
  const ctx = loadFunctions(["_buildAcmePrg", "_acmeVaSyntaxErrors", "_acmeVaDirective", "buildBasicSysStub", "_acmeFirstOrigin",
    "_acmeParseErrors", "_acmeLowestOrigin", "_acmeEntryHint", "_buildRelocatingLoader"], base);
  const run = await ctx._buildAcmePrg();
  assert.equal(run.ok, true);
  // The source goes to ACME unchanged: no stub, "* = $0801" stays (a source error such as
  // "!ct screencode" is ACME's to report).
  assert.equal(submitted, original);
  assert.equal(run.sysAddress, 0x080D);
  assert.equal(run.bytes[0] | (run.bytes[1] << 8), 0x0801);
  assert.equal(run.imageBytes.length, image.length);
  // Panels / VICE hot reload: the plain image, entry = first "* =".
  const preview = await ctx._buildAcmePrg(true, { preview: true });
  assert.equal(preview.bytes.length, image.length);
  assert.equal(preview.sysAddress, 0x0801);
  assert.equal(preview.stubGenerated, false);
});
