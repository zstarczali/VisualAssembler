const test = require("node:test");
const assert = require("node:assert/strict");
const loadApp = require("./helpers/load-app");
const { cpu } = require("./mini6502");

const app = loadApp();

// Builds the source (the included text comes from `library`), without the BASIC stub's RUN: runs from `start`.
function run(source, library, start = 0x1000) {
  app.__src = source;
  app.__lib = library || "";
  const bytes = app.run(`(() => {
    const saved = program;
    try {
      program = parseExpertText(__src);
      for (const b of program) if (b.isIncludeMacro) b.includedBlocks = parseExpertText(__lib);
      parseUserMacros();
      const r = _buildAutostartPrgCore();
      if (!r.ok) throw new Error(r.error);
      return Array.from(r.bytes);
    } finally { program = saved; }
  })()`);
  const mem = new Uint8Array(0x10000);
  const load = bytes[0] | (bytes[1] << 8);
  mem.set(bytes.slice(2), load);
  const c = cpu(mem);
  c.call(start);
  return mem;
}

test("the program flow does not run into a parameter-less macro", () => {
  const mem = run(`* = $1000
.macro Count
    INC $C000
.endm
    INC $C001
    RTS
`);
  assert.equal(mem[0xC001], 1);
  assert.equal(mem[0xC000], 0, "the body stays out of the flow");
});

test("INVOKE puts the body inline, JSR calls the stored copy and returns", () => {
  const mem = run(`* = $1000
.macro Count
    INC $C000
.endm
.invoke Count
    JSR Count
    JSR Count
    INC $C001
    RTS
`);
  assert.equal(mem[0xC000], 3);
  assert.equal(mem[0xC001], 1, "the code after the JSR runs");
});

test("a JSR to a macro of a library at a fixed address returns, and does not run the next macro", () => {
  const mem = run(`* = $1000
.include "lib.asm", $2000
    JSR First
    INC $C002
    RTS
`, `.macro First
    INC $C000
.endm
.macro Second
    INC $C001
.endm
`);
  assert.equal(mem[0xC000], 1);
  assert.equal(mem[0xC001], 0, "no fall-through into the next macro");
  assert.equal(mem[0xC002], 1);
});

test("a macro with parameters still generates no code at its definition", () => {
  app.__src = `* = $1000
.macro Set value
    LDA #{value}
.endm
    RTS
`;
  const size = app.run(`(() => {
    const saved = program;
    try {
      program = parseExpertText(__src);
      parseUserMacros();
      return _buildAutostartPrgCore().bytes.length;
    } finally { program = saved; }
  })()`);
  const noMacro = (() => {
    app.__src = "* = $1000\n    RTS\n";
    return app.run(`(() => { const saved = program; try { program = parseExpertText(__src); parseUserMacros(); return _buildAutostartPrgCore().bytes.length; } finally { program = saved; } })()`);
  })();
  assert.equal(size, noMacro);
});
