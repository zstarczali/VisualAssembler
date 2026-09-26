const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");

// KOALA helpers are a DOM-free slice: from `function _importMakeKoala(` to the end of `_koalaShowBytes`.
function loadKoala() {
  const start = appJs.indexOf("function _importMakeKoala(");
  const fnStart = appJs.indexOf("function _koalaShowBytes(");
  assert.ok(start > 0 && fnStart > start, "KOALA helpers not found");
  let depth = 0, end = -1;
  for (let i = appJs.indexOf("{", fnStart); i < appJs.length; i++) {
    if (appJs[i] === "{") depth++;
    else if (appJs[i] === "}" && --depth === 0) { end = i + 1; break; }
  }
  const context = {
    t: (k) => k,
    tf: (k, v) => k + JSON.stringify(v),
    parseAddressValue: (raw) => {
      const m = /^\$?([0-9A-Fa-f]{1,4})$/.exec(String(raw || "").trim());
      return m ? parseInt(m[1], 16) : null;
    },
  };
  vm.createContext(context);
  vm.runInContext(appJs.slice(start, end) +
    "\nthis.k = { size: _KOALA_SHOW_SIZE, data: _koalaData, error: _koalaError, show: _koalaShowBytes };", context);
  return context.k;
}

// Just enough 6502 for the display routine.
function run(mem, code, org) {
  mem.set(code, org);
  let pc = org, a = 0, x = 0, z = false;
  const rd16 = () => mem[pc] | (mem[pc + 1] << 8);
  for (let steps = 0; steps < 100000; steps++) {
    if (pc === org + code.length) return;
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
    const k = loadKoala();
    const code = k.show(addr);
    assert.equal(code.length, k.size);
    const data = k.data({ incBinBytes: Array.from(fakeKoala()) });
    assert.equal(data.length, 10001);
    const mem = new Uint8Array(65536);
    mem.set(data, addr);
    mem[0xDD00] = 0xC7;                      // other port bits must survive
    run(mem, code, 0x0900);
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
  const k = loadKoala();
  assert.equal(k.error({ incBinAddress: "$6000", incBinBytes: [] }), "");
  assert.equal(k.error({ incBinAddress: "$2000", incBinBytes: new Array(10001).fill(0) }), "");
  assert.equal(k.error({ incBinAddress: "$4000", incBinBytes: [] }), "koalaAddressInvalid");
  assert.match(k.error({ incBinAddress: "$6000", incBinBytes: new Array(9000).fill(0) }), /^koalaSizeInvalid/);
});
