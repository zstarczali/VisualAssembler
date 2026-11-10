// `*` in an operand: the PC of the instruction, or multiplication after a value (the VMA CLI).
const assert = require("node:assert/strict");
const { codeOf, compileText, vmaTest: test } = require("./helpers/vma-cli");

const at = (line, org = 0xC000, before = "") => codeOf(line, { org, before });

test("BNE * → infinite self-loop offset $FE", () => {
  assert.deepEqual(at("bne *"), [0xD0, 0xFE]);
});

test("BNE *-2 and BNE *+4 resolve against the instruction address", () => {
  // target = $C00E; offset = $C00E - ($C010 + 2) = -4
  assert.deepEqual(at("bne *-2", 0xC010), [0xD0, 0xFC]);
  // target = $C014; offset = $C014 - $C012 = 2
  assert.deepEqual(at("bne *+4", 0xC010), [0xD0, 0x02]);
});

test("JMP *+20 produces an absolute address relative to the current PC", () => {
  assert.deepEqual(at("jmp *+20"), [0x4C, 0x14, 0xC0]);
});

test("STA $95,X stays a 2-byte zero page,X instruction", () => {
  assert.deepEqual(at("sta $95,x", 0x0B90), [0x95, 0x95]);
});

test("LDA #<* and LDA #>(*+256) take low/high byte of the PC expression", () => {
  assert.deepEqual(at("lda #<*", 0xC012), [0xA9, 0x12]);
  assert.deepEqual(at("lda #>(*+256)", 0xC012), [0xA9, 0xC1]);
});

test("`*` after an identifier stays multiplication, not the PC", () => {
  // STRIDE*2 = 80 = $50 — not a PC reference
  assert.equal(at("lda STRIDE*2", 0xC000, ".const STRIDE = 40")[1], 0x50);
  assert.deepEqual(at("lda #STRIDE*2", 0xC000, ".const STRIDE = 40"), [0xA9, 0x50]);
});

test("out-of-range branch reports overshoot and suggests LBxx", () => {
  const r = compileText("* = $C000\n bne far\n* = $C0F0\nfar:\n rts\n", { basicStub: false });
  assert.equal(r.ok, false);
  const e = r.errors[0];
  assert.equal(e.key, "branchOutOfRangeSuggest");
  // offset = $C0F0 - ($C000 + 2) = 238; overshoot = 238 - 127 = 111
  assert.match(JSON.stringify(e.params), /LBNE/);
  assert.match(JSON.stringify(e.params), /111/);
});
