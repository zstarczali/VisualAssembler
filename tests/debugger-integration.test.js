const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");
const indexHtml = fs.readFileSync(path.join(__dirname, "..", "www", "index.html"), "utf8");
const styleCss = fs.readFileSync(path.join(__dirname, "..", "www", "style.css"), "utf8");

function extractFunctionSource(name) {
  const marker = `function ${name}(`;
  const start = appJs.indexOf(marker);
  assert.notStrictEqual(start, -1, `Missing function ${name}`);
  let depth = 0;
  let end = -1;
  let seenBrace = false;
  for (let index = start; index < appJs.length; index++) {
    const char = appJs[index];
    if (char === "{") { depth += 1; seenBrace = true; }
    else if (char === "}") {
      depth -= 1;
      if (seenBrace && depth === 0) { end = index + 1; break; }
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

test("debugger start uses SYS auto-detection for stub PRGs and direct jump for plain PRGs", () => {
  const { _debuggerStartOptions } = loadFunctions(["_debuggerStartOptions"], { debuggerJmp: true });

  assert.deepStrictEqual(
    { ..._debuggerStartOptions(true, 0x080d, true) },
    { autoJmp: true, jmpAddress: undefined }
  );
  assert.deepStrictEqual(
    { ..._debuggerStartOptions(false, 0xc000, true) },
    { autoJmp: false, jmpAddress: 0xc000 }
  );
  assert.deepStrictEqual(
    { ..._debuggerStartOptions(true, 0x080d, false) },
    { autoJmp: false, jmpAddress: undefined }
  );
});

test("plain PRG debugger layout uses the PRG load address instead of the origin field", () => {
  const { _getDebuggerCodeOrigin } = loadFunctions(["_getDebuggerCodeOrigin"], {
    parseOriginValue: () => ({ value: 0x0801 })
  });

  assert.equal(_getDebuggerCodeOrigin({ bytes: new Uint8Array([0x00, 0x10, 0x78]) }), 0x1000);
  assert.equal(_getDebuggerCodeOrigin({ bytes: new Uint8Array([0x01, 0x08]), sysAddress: 0x080d }), 0x080d);
});

test("UltimateBasic disassembly starts at the compiler code address, not the BASIC stub", () => {
  const output = { textContent: "", innerHTML: "" };
  let disassembledAt = null;
  const context = loadFunctions(["_getUbBasicStubSection", "_buildBasicStubDisasmLines", "_ubRenderDisassembly"], {
    document: { getElementById: (id) => id === "ub-disasm-output" ? output : null },
    showBasicStubToggle: { checked: false },
    _disasmBytes: (bytes, baseAddress) => {
      disassembledAt = { bytes: [...bytes], baseAddress };
      return [];
    },
    _ubEsc: (value) => String(value)
  });

  context._ubRenderDisassembly({
    map: { codeBytes: [0xd8, 0x60], loadAddress: 0x080d, labels: [], subroutines: [] },
    debug: { sym: "" }
  });

  assert.deepStrictEqual(disassembledAt, { bytes: [0xd8, 0x60], baseAddress: 0x080d });
});

test("Block and Expert disassembly use the build origin for BASIC SYS modes", () => {
  const loadOrigin = (basicSys) => loadFunctions(["_getDisassemblyCodeOrigin"], {
    program: [],
    basicSysToggle: { checked: basicSys },
    parseOriginValue: () => ({ value: 0x0801 }),
    _programHasEmbeddedBasicAutostart: () => false
  })._getDisassemblyCodeOrigin();

  assert.equal(loadOrigin(true), 0x080d);
  assert.equal(loadOrigin(false), 0xc000);
});

test("BASIC stub is extracted for disassembly and monitor views", () => {
  const context = loadFunctions(["_extractBasicStubSection", "_buildBasicStubDisasmLines", "_formatMonitorMemory"], {
    formatAddress: (value) => `$${value.toString(16).toUpperCase().padStart(4, "0")}`
  });
  const section = context._extractBasicStubSection(new Uint8Array([
    0x01, 0x08,
    0x0b, 0x08, 0x0a, 0x00, 0x9e, 0x32, 0x30, 0x36, 0x31, 0x00, 0x00, 0x00,
    0x78
  ]));

  assert.deepStrictEqual({ ...section, bytes: [...section.bytes] }, {
    address: 0x0801,
    bytes: [0x0b, 0x08, 0x0a, 0x00, 0x9e, 0x32, 0x30, 0x36, 0x31, 0x00, 0x00, 0x00]
  });
  const disassembly = context._buildBasicStubDisasmLines(section).join("\n");
  assert.match(disassembly, /basic_stub:/);
  assert.match(disassembly, /\$0801/);
  assert.match(disassembly, />\.BYTE</);

  const memory = new Map(section.bytes.map((byte, index) => [section.address + index, byte]));
  assert.match(context._formatMonitorMemory(memory), />\$0800  \.\. 0B 08 0A 00 9E 32 30/);
});

test("BASIC stub visibility uses the VA settings checkbox and applies to UB builds", () => {
  assert.match(
    indexHtml,
    /<label class="menu-checkbox-label">\s*<input type="checkbox" id="show-basic-stub-toggle">\s*<span id="show-basic-stub-label">/
  );

  const toggle = { checked: true };
  const context = loadFunctions(["_extractBasicStubSection", "_getUbBasicStubSection"], {
    showBasicStubToggle: toggle
  });
  const build = {
    prg: [0x01, 0x08, 0x0b, 0x08, 0x0a, 0x00, 0x9e, 0x32, 0x30, 0x36, 0x31, 0x00, 0x00, 0x00, 0x60]
  };

  assert.equal(context._getUbBasicStubSection(build).address, 0x0801);
  toggle.checked = false;
  assert.equal(context._getUbBasicStubSection(build), null);
});

test("UltimateBasic caret stays inside the editor when the minimap is visible", () => {
  assert.match(
    styleCss,
    /\.ub-panel\.ub-show-minimap \.ub-editor, \.ub-panel\.ub-show-minimap \.ub-highlight \{ right: 88px; width: auto; padding-right: 16px; \}/
  );
  assert.match(appJs, /const maxLeft = editorRect\.right - wrapRect\.left - caretWidth;/);
  assert.match(appJs, /Math\.min\(markerRect\.left - wrapRect\.left, maxLeft\)/);
});

test("Expert and UltimateBasic breakpoint lines resolve to executable addresses", () => {
  const context = loadFunctions(["_breakpointAddressForSourceLines", "_ubBreakpointAddresses"]);
  const layout = {
    lines: [
      { address: 0xc000, size: 2, block: { _srcLine: 1 } },
      { address: 0xc002, size: 3, block: { _srcLine: 3 } }
    ]
  };
  assert.deepStrictEqual([...context._breakpointAddressForSourceLines(layout, [1, 2])], [0xc000, 0xc002]);

  const build = {
    debug: {
      dbg: "  $080d,$080f,0,2,1,2,1\n  $0810,$0812,0,4,1,4,1"
    }
  };
  assert.deepStrictEqual([...context._ubBreakpointAddresses(build, [1, 2])], [0x080d, 0x0810]);
});

test("Block and Expert debugger sidecars include labels in dbg, sym and VICE formats", () => {
  const context = loadFunctions(
    [
      "_formatDebuggerAddress",
      "_formatDebuggerSymbolAddress",
      "_escapeXmlText",
      "_collectDebuggerSymbols",
      "_buildDebuggerSidecarTexts"
    ],
    {
      program: [],
      _getDebuggerPrimarySourcePath: () => "program.asm",
      _normalizeIncludeBlockSource: () => "",
      parseAddressValue: () => NaN
    }
  );
  const layout = {
    lines: [
      {
        address: 0xc000,
        end: 0xc000,
        size: 1,
        block: { isLabel: true, labelName: "start", _srcLine: 0 }
      },
      {
        address: 0xc001,
        end: 0xc002,
        size: 2,
        block: { mnemonic: "LDA", _srcLine: 1 }
      }
    ]
  };

  const sidecars = context._buildDebuggerSidecarTexts(layout, 0xc000, "/project/startup.asm");
  assert.match(sidecars.dbg, /0,\/project\/startup\.asm/);
  assert.match(sidecars.dbg, /<Labels values="SEGMENT,ADDRESS,NAME">/);
  assert.match(sidecars.dbg, /Default,\$c000,start/);
  assert.match(sidecars.sym, /\.label start=\$c000/);
  assert.match(sidecars.vs, /al C:c000 \.start/);
});
