// `.delay n`: LDX #n + JSR to one shared helper after the program (the VMA CLI).
const assert = require("node:assert/strict");
const { compileText, loadPrg, labelOf, vmaTest: test } = require("./helpers/vma-cli");

function build(src) {
  const r = compileText(src, { basicStub: false });
  assert.equal(r.ok, true, r.error);
  return { r, mem: loadPrg(r.bytes).mem };
}

test("DELAY helper preserves registers and returns with RTS", () => {
  const { r, mem } = build("* = $2000\n.delay 200\n rts\n");
  const at = labelOf(r, "__delay_wait_frames");
  const bytes = Array.from(mem.subarray(at, at + 34));
  const counter = at + 33;
  assert.deepEqual(bytes.slice(0, 10), [0x48, 0x8A, 0x48, 0x98, 0x48, 0x8E, counter & 0xFF, counter >> 8, 0xAD, 0x12]);
  assert.deepEqual(bytes.slice(23, 25), [counter & 0xFF, counter >> 8]);
  assert.deepEqual(bytes.slice(28, 33), [0xA8, 0x68, 0xAA, 0x68, 0x60]);
  assert.equal(bytes[33], 0x00);
  assert.deepEqual(Array.from(mem.subarray(0x2000, 0x2005)), [0xA2, 200, 0x20, at & 0xFF, at >> 8]);
});

test("DELAY instruction size stays fixed because it calls the shared helper", () => {
  for (const frames of ["1", "200", "$FF"]) {
    const { r } = build(`* = $2000\n.delay ${frames}\n__end:\n rts\n`);
    assert.equal(labelOf(r, "__end") - 0x2000, 5, frames);
  }
});

test("two DELAYs share one helper", () => {
  const one = build("* = $2000\n.delay 2\n rts\n").r.bytes.length;
  const two = build("* = $2000\n.delay 2\n.delay 3\n rts\n").r.bytes.length;
  assert.equal(two - one, 5);
});
