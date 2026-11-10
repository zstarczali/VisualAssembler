// `.koala "f.koa"[, $2000]`: the picture at its address, a display routine in the code (the VMA CLI).
const assert = require("node:assert/strict");
const { compileText, loadPrg, labelOf, vmaTest: test } = require("./helpers/vma-cli");

// `.koala` at $0900 with `file`: the memory of the PRG and the display routine's size.
function build(file, addr) {
  const r = compileText(`* = $0900\n.koala "pic.koa", $${addr.toString(16)}\n__end:\n`, { basicStub: false, files: { "pic.koa": file } });
  if (!r.ok) return r;
  const { mem } = loadPrg(r.bytes);
  return { ...r, mem, size: labelOf(r, "__end") - 0x0900 };
}

// Just enough 6502 for the display routine.
function run(mem, org, size) {
  let pc = org, a = 0, x = 0, z = false;
  const rd16 = () => mem[pc] | (mem[pc + 1] << 8);
  for (let steps = 0; steps < 100000; steps++) {
    if (pc === org + size) return;
    const op = mem[pc++];
    switch (op) {
      case 0xA2: x = mem[pc++]; z = x === 0; break;
      case 0xA9: a = mem[pc++]; z = a === 0; break;
      case 0xBD: a = mem[(rd16() + x) & 0xFFFF]; pc += 2; z = a === 0; break;
      case 0x9D: mem[(rd16() + x) & 0xFFFF] = a; pc += 2; break;
      case 0xAD: a = mem[rd16()]; pc += 2; z = a === 0; break;
      case 0x8D: mem[rd16()] = a; pc += 2; break;
      case 0x29: a &= mem[pc++]; z = a === 0; break;
      case 0x09: a |= mem[pc++]; z = a === 0; break;
      case 0xE8: x = (x + 1) & 0xFF; z = x === 0; break;
      case 0xE0: z = x === mem[pc++]; break;
      case 0xD0: { const rel = mem[pc++]; if (!z) pc += rel < 128 ? rel : rel - 256; break; }
      default: throw new Error("unexpected opcode $" + op.toString(16) + " at $" + (pc - 1).toString(16));
    }
  }
  throw new Error("routine did not finish");
}

function fakeKoala() {
  const f = new Uint8Array(10003);
  f[0] = 0x00; f[1] = 0x60;
  for (let i = 0; i < 10000; i++) f[2 + i] = (i * 7 + 3) & 0xFF;
  f[10002] = 0x0B;
  return f;
}

for (const addr of [0x6000, 0x2000]) {
  test(`display routine copies screen/color RAM and sets VIC-II (bitmap at $${addr.toString(16)})`, () => {
    const file = fakeKoala();
    const k = build(file, addr);
    assert.equal(k.ok, true, k.error);
    assert.equal(k.size, 86);
    const data = file.subarray(2);
    const mem = k.mem;
    for (let i = 0; i < 10001; i++) assert.equal(mem[addr + i], data[i], `data ${i}`);
    mem[0xDD00] = 0xC7;                      // other port bits must survive
    run(mem, 0x0900, k.size);
    const screen = (addr === 0x2000 ? 0x0000 : 0x4000) + 0x0400;
    for (let i = 0; i < 1000; i++) {
      assert.equal(mem[screen + i], data[8000 + i], `screen ${i}`);
      assert.equal(mem[0xD800 + i], data[9000 + i], `color ${i}`);
    }
    assert.equal(mem[0xD021], 0x0B);
    assert.equal(mem[0xDD00], (0xC7 & 0xFC) | (addr === 0x2000 ? 3 : 2));
    assert.deepEqual([mem[0xD011], mem[0xD016], mem[0xD018]], [0x3B, 0x18, 0x18]);
  });
}

test("KOALA validation: only $2000/$6000, only 10001/10003-byte files", () => {
  assert.equal(build(new Uint8Array(10001), 0x2000).ok, true);
  assert.match(build(fakeKoala(), 0x4000).error, /\$2000 or \$6000/);
  assert.match(build(new Uint8Array(9000), 0x6000).error, /10001 or 10003 bytes, not 9000/);
});
