// VMA language rules (VMA-RUST-PLAN.md, section 3), through the VMA CLI: the error paths the
// golden corpus does not show (it only records that a case fails) and the Block mode checks.
const assert = require("node:assert/strict");
const loadApp = require("./helpers/load-app");
const { compileText, vmaTest: test } = require("./helpers/vma-cli");

const ref = { app: loadApp(), compile: async ({ text, basicStub }) => compileText(text, { basicStub }) };
const build = async (body) => ref.compile({ text: "* = $1000\n" + body + "\n    rts\n", basicStub: false });
const hex = (r) => Buffer.from(r.bytes.slice(2)).toString("hex");

test("character literals are their ASCII / PETSCII code in operands, .byte and .print_char", async () => {
  assert.equal(hex(await build("    lda #'A'\n    ldx #' '+1\n    cmp #'z'")), "a941a221c97a60");
  assert.equal(hex(await build("    .byte 'A', $42, 'c'")), "41426360");
  assert.equal(hex(await build("    .print_char 'A'")), "a94120d2ff60");
  assert.equal(ref.app.run(`_charLiteralToHex("'A'+1")`), "$41+1");
});

test("mixed .byte / .word lists keep the value of every element", async () => {
  assert.equal(hex(await build("    .byte 3, %11, 16, $10")), "0303101060");
  assert.equal(hex(await build("    .byte %101, $FF")), "05ff60");
  assert.equal(hex(await build("    .word $1234, 16, %1")), "341210000100" + "60");
});

test("~ works in immediate operands", async () => {
  assert.equal(hex(await build("    lda #~7 & $FF")), "a9f860");
});

test(".if: .define symbol, non-zero .const or a constant expression", async () => {
  const branch = async (pre, cond) => hex(await ref.compile({
    text: `${pre}\n* = $1000\n.if ${cond}\n    inc $D020\n.else\n    inc $D021\n.endif\n`, basicStub: false
  }));
  assert.equal(await branch(".define DEBUG", "DEBUG"), "ee20d0");
  assert.equal(await branch("", "DEBUG"), "ee21d0");
  assert.equal(await branch(".const DEBUG = 1", "DEBUG"), "ee20d0");
  assert.equal(await branch(".const DEBUG = 0", "DEBUG"), "ee21d0");
  assert.equal(await branch(".const DEBUG = 1", "DEBUG == 1"), "ee20d0");
  assert.equal(await branch(".const V = 3", "V >= 2 && V < 5"), "ee20d0");
});

test(".if with an expression that cannot be evaluated is an error, not a silent false", async () => {
  const r = await build(".if FOO + 1\n    nop\n.endif");
  assert.equal(r.ok, false);
  assert.match(r.error, /IF condition cannot be evaluated: FOO \+ 1/);
  // Block mode field check: identifiers and expressions pass, an unknown expression does not
  assert.equal(ref.app.run(`validateIfMacro("DEBUG")`), "");
  assert.equal(ref.app.run(`validateIfMacro("1 == 1")`), "");
  assert.match(ref.app.run(`validateIfMacro("FOO + 1")`), /cannot be evaluated/);
});

test(".push / .pull take A X Y with or without separators", async () => {
  const joined = hex(await build("    .push AXY\n    .pull AXY"));
  assert.equal(hex(await build("    .push A, X, Y\n    .pull A X Y")), joined);
});

test("a macro called inside a macro body is expanded with the outer call's arguments", async () => {
  const r = await build(".macro border(c)\n    lda #{c}\n.endm\n.macro both(c)\n    :border({c})\n    sta $d020\n.endm\n    :both(3)");
  assert.equal(r.ok, true, r.error);
  assert.match(hex(r), /a9038d20d0/);
});

test("a macro calling itself stops with an error instead of hanging", async () => {
  const r = await build(".macro loop(c)\n    :loop({c})\n.endm\n    :loop(1)");
  assert.equal(r.ok, false);
  assert.match(r.error, /nest too deep/);
});
