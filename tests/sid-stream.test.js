const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { assemble, cpu } = require("./mini6502");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");

function fnSource(name) {
  const start = appJs.indexOf(`function ${name}(`);
  assert.notStrictEqual(start, -1, `Missing function ${name}`);
  let depth = 0, seen = false;
  for (let i = start; i < appJs.length; i++) {
    if (appJs[i] === "{") { depth++; seen = true; }
    else if (appJs[i] === "}" && seen && --depth === 0) return appJs.slice(start, i + 1);
  }
  throw new Error(`Could not parse ${name}`);
}

const ctx = {};
vm.createContext(ctx);
vm.runInContext(`${fnSource("_sidStreamPrg")}; this.prg = _sidStreamPrg();`, ctx);
const PRG = Array.from(ctx.prg);

const SRC = `
* = $1000
  JMP init
  JMP play
init:
  LDA #0
  STA $1F00
  STA $1F01
  LDX #$18
iclr:
  STA $D400,X
  DEX
  BPL iclr
  RTS
play:
  LDX $1F00
  CPX $1F01
  BEQ out
  TXA
  ASL
  ASL
  ASL
  ASL
  ASL
  STA $FB
  TXA
  LSR
  LSR
  LSR
  CLC
  ADC #$20
  STA $FC
  LDY #28
  LDA ($FB),Y
  STA $FD
  LSR $FD
  BCC t2
  LDY #25
  LDA ($FB),Y
  STA $D404
t2:
  LSR $FD
  BCC t3
  LDY #26
  LDA ($FB),Y
  STA $D40B
t3:
  LSR $FD
  BCC regs
  LDY #27
  LDA ($FB),Y
  STA $D412
regs:
  LDY #24
copy:
  LDA ($FB),Y
  STA $D400,Y
  DEY
  BPL copy
  INX
  TXA
  AND #63
  STA $1F00
out:
  RTS
`;

test("the hand-assembled stream player matches its source", () => {
  assert.deepEqual(PRG.slice(0, 2), [0x00, 0x10]);
  const { mem } = assemble(SRC);
  const code = PRG.slice(2);
  assert.deepEqual(Array.from(mem.slice(0x1000, 0x1000 + code.length)), code);
});

function machine() {
  const raw = new Uint8Array(0x10000);
  PRG.slice(2).forEach((b, i) => { raw[0x1000 + i] = b; });
  const log = [];
  const mem = new Proxy(raw, {
    set(target, key, value) {
      const ad = Number(key);
      if (ad >= 0xD400 && ad <= 0xD418) log.push([ad - 0xD400, value]);
      target[key] = value;
      return true;
    },
  });
  return { raw, log, c: cpu(mem) };
}

test("play copies one ring frame per call, trigger gate-off first", () => {
  const { raw, log, c } = machine();
  c.call(0x1000);
  assert.equal(raw[0x1F00], 0);
  assert.equal(raw[0x1F01], 0);
  log.length = 0;
  c.call(0x1003);
  assert.equal(log.length, 0, "empty ring writes nothing");

  // frame 0: voice 1 and 3 re-triggered; frame 1: plain update
  for (let k = 0; k < 25; k++) { raw[0x2000 + k] = 0x40 + k; raw[0x2020 + k] = 0x80 + k; }
  raw[0x2000 + 25] = 0x40; raw[0x2000 + 26] = 0x10; raw[0x2000 + 27] = 0x20; raw[0x2000 + 28] = 5;
  raw[0x1F01] = 2;
  c.call(0x1003);
  assert.deepEqual(log.slice(0, 2), [[4, 0x40], [0x12, 0x20]]);
  assert.deepEqual(log.slice(2).map((w) => w[0]), Array.from({ length: 25 }, (_, i) => 24 - i));
  assert.ok(log.slice(2).every(([r, v]) => v === 0x40 + r));
  assert.equal(raw[0x1F00], 1);

  log.length = 0;
  c.call(0x1003);
  assert.equal(log.length, 25);
  assert.ok(log.every(([r, v]) => v === 0x80 + r));
  assert.equal(raw[0x1F00], 2);
  log.length = 0;
  c.call(0x1003);
  assert.equal(log.length, 0);
});

test("the ring index wraps after 64 frames", () => {
  const { raw, c } = machine();
  c.call(0x1000);
  raw[0x1F00] = 63; raw[0x1F01] = 0;
  for (let k = 0; k < 25; k++) raw[0x2000 + 63 * 32 + k] = k;
  c.call(0x1003);
  assert.equal(raw[0x1F00], 0);
});
