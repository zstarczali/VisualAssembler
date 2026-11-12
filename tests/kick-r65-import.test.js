// Kick import through R65 (_kickR65ToVma): R65's build (r65_build: prg, Default blocks, placed
// labels, the source of each byte) written as VMA — labels for Kick's !+ / !- targets, the Kick
// constants the operands name, label + offset operands, .word data — that builds the same bytes.
const assert = require("node:assert/strict");
const test = require("node:test");
const loadApp = require("./helpers/load-app");
const { compileText, vmaTest } = require("./helpers/vma-cli");

const SOURCE = `.const ptr = $fb
* = $c000
start:  lda #<data
        ldx #0
!:      sta ptr,x
        sta ptr+1,x
        inx
        bne !-
        lda table.hi,x
        rts
data:   .word start
table:  .lohifill 2, $1234 + i
`;
const code = [0xA9, 0x0F, 0xA2, 0x00, 0x95, 0xFB, 0x95, 0xFC, 0xE8, 0xD0, 0xF9, 0xBD, 0x13, 0xC0, 0x60,
  0x00, 0xC0, 0x34, 0x35, 0x12, 0x12];
const R65 = {
  ok: true,
  prg: [0x00, 0xC0, ...code],
  files: ["/kick/main.asm"],
  blocks: [{ segment: "Default", name: "", start: 0xC000, len: code.length, virtual: false }],
  labels: [["start", 0xC000, 0, 3, "Default"], ["data", 0xC00F, 0, 12, "Default"], ["table", 0xC011, 0, 13, "Default"]],
  spans: [
    [0xC000, 2, 0, 3, 9, "lda #<data"], [0xC002, 2, 0, 4, 9, "ldx #0"], [0xC004, 2, 0, 5, 9, "sta ptr,x"],
    [0xC006, 2, 0, 6, 9, "sta ptr+1,x"], [0xC008, 1, 0, 7, 9, "inx"], [0xC009, 2, 0, 8, 9, "bne !-"],
    [0xC00B, 3, 0, 9, 9, "lda table.hi,x"], [0xC00E, 1, 0, 10, 9, "rts"], [0xC00F, 2, 0, 11, 9, ".word start"],
    [0xC011, 4, 0, 12, 9, ".lohifill 2, $1234 + i"]
  ]
};

test("_kickR65ToVma names labels, constants and Kick's anonymous targets", () => {
  const app = loadApp();
  const text = app._kickR65ToVma(R65, "main.asm", { "/kick/main.asm": SOURCE });
  assert.match(text, /^\.const ptr = \$FB$/m);
  assert.match(text, /^\* = \$C000$/m);
  assert.match(text, /^start:$/m);
  assert.match(text, /^ {4}LDA #<data\b/m);
  assert.match(text, /^L_C004:$/m);
  assert.match(text, /^ {4}STA ptr,X\b/m);
  assert.match(text, /^ {4}STA ptr\+1,X\b/m);
  assert.match(text, /^ {4}BNE L_C004 +; bne !-$/m);
  assert.match(text, /^ {4}LDA table\+2,X +; lda table\.hi,x$/m);
  assert.match(text, /^ {4}\.word start$/m);
  assert.match(text, /^ {4}\.byte \$34, \$35, \$12, \$12 +; \.lohifill/m);
});

test("_kickSimpleDefs keeps the plain number constants, not the ambiguous ones", () => {
  const app = loadApp();
  const defs = app._kickSimpleDefs({ a: ".const A = $10\n.label B = 20 // c\n.const C = 1\n.var D = 3\n.const E = F + 1", b: ".const C = 2" });
  assert.equal(JSON.stringify([...defs.entries()]), JSON.stringify([["A", 16], ["B", 20]]));
});

// A real R65 answer (tests/fixtures/kick-r65-import: main.asm + r65.json): Kick macros → VMA macros
// (a call from a .for stays expanded), !: / !- in a body, a macro without parameters, .pseudopc.
const fs = require("node:fs");
const path = require("node:path");
const FIX = path.join(__dirname, "fixtures", "kick-r65-import");
const fixture = () => ({
  r: JSON.parse(fs.readFileSync(path.join(FIX, "r65.json"), "utf8")),
  sources: { "main.asm": fs.readFileSync(path.join(FIX, "main.asm"), "utf8") }
});

test("Kick macros become VMA macros, their calls .invoke", () => {
  const app = loadApp();
  const { r, sources } = fixture();
  const info = {};
  const text = app._kickR65ToVma(r, "main.asm", sources, { info });
  assert.equal(info.macroCount, 3);
  assert.match(text, /^\.macro Poke\(addr, value\)\n {4}LDA #\{value\}\n {4}STA \{addr\}\n\.endm$/m);
  assert.match(text, /^\.macro Wait\(n\)\n {4}LDX #\{n\}\nanon_1:\n {4}DEX\n {4}BNE anon_1\n\.endm$/m);
  // VMA assembles a macro without parameters as a subroutine: a dummy one
  assert.match(text, /^\.macro Flash\(unused\)$/m);
  assert.match(text, /^ {4}\.invoke Flash\(0\)/m);
  assert.match(text, /^ {4}\.invoke Poke\(\$d020, 0\)/m);
  assert.match(text, /^ {4}\.invoke Poke\(SCREEN, 1\)/m);
  assert.match(text, /^ {4}\.invoke Wait\(10\)/m);
  // the calls of the .for loop (SCREEN + 1 + i) stay expanded
  assert.match(text, /^ {4}STA \$0401 +; sta addr$/m);
  assert.equal((text.match(/\.invoke Poke/g) || []).length, 2);
});

test(".pseudopc code: run-address constants, branches as *±n", () => {
  const app = loadApp();
  const { r, sources } = fixture();
  const text = app._kickR65ToVma(r, "main.asm", sources);
  assert.match(text, /^\.const run = \$C000$/m);
  assert.match(text, /^ {4}JMP run$/m);
  assert.match(text, /^ {4}BEQ \*-3 +; beq run$/m);
  assert.match(text, /^ {4}BNE \*\+2 +; bne !\+$/m);
  assert.match(text, /^ {4}STA \$C000,X$/m);
  assert.equal(app._kickR65ToVma(r, "main.asm", sources, { flat: new Set(["Poke", "Wait", "Flash"]) }).includes(".invoke"), false);
});

vmaTest("the macros and .pseudopc of the fixture build R65's bytes", () => {
  const app = loadApp();
  const { r, sources } = fixture();
  const out = compileText(app._kickR65ToVma(r, "main.asm", sources), { basicStub: false });
  assert.ok(out.ok, out.error);
  assert.deepEqual(Array.from(out.bytes), r.prg);
});

vmaTest("the VMA of _kickR65ToVma builds R65's bytes", () => {
  const app = loadApp();
  const r = compileText(app._kickR65ToVma(R65, "main.asm", { "/kick/main.asm": SOURCE }), { basicStub: false });
  assert.ok(r.ok, r.error);
  assert.deepEqual(Array.from(r.bytes), R65.prg);
});

// plasmaborder.asm: `beq bad` came back from the blocks as `BEQ $BAD` (a "hex" block reads a name
// of hex letters as a number)
test("a label of hex letters stays a name through the blocks", () => {
  const app = loadApp();
  const blocks = app.parseExpertText("* = $c000\n    BEQ bad\n    LDA ab\n    JMP fade\n    STX.zp ab\n    LDA #$AB\n    LDA $0BAD\nbad:\n    RTS\nfade:\n    RTS\n.const ab = $10");
  const text = app._vmaBlocksSource(blocks).text;
  assert.match(text, /^ {4}BEQ bad$/m);
  assert.match(text, /^ {4}LDA ab$/m);
  assert.match(text, /^ {4}JMP fade$/m);
  assert.match(text, /^ {4}STX\.zp ab$/m);
  assert.match(text, /^ {4}LDA #\$AB$/m);
  assert.match(text, /^ {4}LDA \$0BAD$/m);
});

// Import Kick project: R65 builds it, the result is <name>_vma.asm + a VMA .proj next to the Kick
// sources (they stay as they are)
vmaTest("Import Kick project converts the project to VMA through R65", async () => {
  const { useVmaCli } = require("./helpers/vma-cli");
  const app = loadApp();
  const { r, sources } = fixture();
  const dir = FIX.split(path.sep).join("/");
  const saved = {};
  app.window.electronAPI = {
    chooseAsmFile: async () => ({ ok: true, filePath: dir + "/main.asm" }),
    r65Build: async () => r,
    readTextFile: async (p) => {
      const name = String(p).split(/[\/]/).pop();
      return name === "main.asm" ? { ok: true, content: sources["main.asm"] } : { ok: false, error: "missing" };
    },
    saveTextFile: async (p, c) => { saved[p] = c; return { ok: true, path: p }; }
  };
  useVmaCli(app);
  await app.run(`(async () => {
    _closeAllTabsWithConfirm = async () => true;
    _expertProjectOpenFile = async () => {};
    await importKickProject();
  })()`);
  const proj = JSON.parse(saved[dir + "/kick-r65-import.proj"]);
  assert.equal(proj.startupFile, "kick-r65-import_vma.asm");
  assert.equal(proj.assembler, "vma");
  assert.equal(proj.kick, undefined);
  const text = saved[dir + "/kick-r65-import_vma.asm"];
  assert.match(text, /^\.macro Poke\(addr, value\)$/m);
  const out = compileText(text, { basicStub: false });
  assert.ok(out.ok, out.error);
  assert.deepEqual(Array.from(out.bytes), r.prg);
});
