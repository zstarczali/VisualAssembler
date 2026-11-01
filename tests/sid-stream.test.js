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

// ---- two SIDs: a second ring at $3000 is copied to $D420 ---------------------

const ctx2 = {};
vm.createContext(ctx2);
vm.runInContext(`${fnSource("_sidStreamPrg")}; this.prg = _sidStreamPrg(2);`, ctx2);
const PRG2 = Array.from(ctx2.prg);

const hex2 = (n) => n.toString(16).padStart(2, "0");
const chipSrc = (at, id) => `
  LDY #28
  LDA ($FB),Y
  STA $FD
  LSR $FD
  BCC t2${id}
  LDY #25
  LDA ($FB),Y
  STA $D4${hex2(at + 4)}
t2${id}:
  LSR $FD
  BCC t3${id}
  LDY #26
  LDA ($FB),Y
  STA $D4${hex2(at + 11)}
t3${id}:
  LSR $FD
  BCC regs${id}
  LDY #27
  LDA ($FB),Y
  STA $D4${hex2(at + 18)}
regs${id}:
  LDY #24
copy${id}:
  LDA ($FB),Y
  STA $D4${hex2(at)},Y
  DEY
  BPL copy${id}
`;

const SRC2 = `
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
  STA $D420,X
  DEX
  BPL iclr
  RTS
play:
  LDX $1F00
  CPX $1F01
  BNE go
  RTS
go:
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
${chipSrc(0, "a")}
  LDA $FC
  CLC
  ADC #$10
  STA $FC
${chipSrc(0x20, "b")}
  INX
  TXA
  AND #63
  STA $1F00
  RTS
`;

test("the two-SID stream player matches its source", () => {
  const code = PRG2.slice(2);
  const { mem } = assemble(SRC2);
  assert.deepEqual(Array.from(mem.slice(0x1000, 0x1000 + code.length)), code);
});

test("the stream player writes the second SID at its own address", () => {
  const c3 = {};
  vm.createContext(c3);
  vm.runInContext(`${fnSource("_sidStreamPrg")}; this.prg = _sidStreamPrg(2, 0xDE20);`, c3);
  const raw = new Uint8Array(0x10000);
  Array.from(c3.prg).slice(2).forEach((b, i) => { raw[0x1000 + i] = b; });
  const c = cpu(raw);
  c.call(0x1000);
  for (let k = 0; k < 25; k++) raw[0x3000 + k] = 0x80 + k;
  raw[0x1F01] = 1;
  c.call(0x1003);
  assert.deepEqual(Array.from(raw.slice(0xDE20, 0xDE39)), Array.from({ length: 25 }, (_, k) => 0x80 + k));
  assert.equal(raw[0xD420], 0);
});

test("the two-SID stream copies each ring to its own chip", () => {
  const raw = new Uint8Array(0x10000);
  PRG2.slice(2).forEach((b, i) => { raw[0x1000 + i] = b; });
  const log = [];
  const mem = new Proxy(raw, {
    set(target, key, value) {
      const ad = Number(key);
      if (ad >= 0xD400 && ad <= 0xD438) log.push([ad - 0xD400, value]);
      target[key] = value;
      return true;
    },
  });
  const c = cpu(mem);
  c.call(0x1000);
  log.length = 0;
  c.call(0x1003);
  assert.equal(log.length, 0, "empty ring writes nothing");
  // the last ring slot, to check the wrap and the high ring address: voice 2 of SID 2 re-triggered
  const a = 0x2000 + 63 * 32, b = 0x3000 + 63 * 32;
  for (let k = 0; k < 25; k++) { raw[a + k] = 0x40 + k; raw[b + k] = 0x80 + k; }
  raw[b + 26] = 0x10; raw[b + 28] = 2;
  raw[0x1F00] = 63; raw[0x1F01] = 0;
  c.call(0x1003);
  assert.equal(raw[0x1F00], 0);
  const first = log.slice(0, 25), second = log.slice(25);
  assert.deepEqual(first.map((w) => w[0]), Array.from({ length: 25 }, (_, i) => 24 - i));
  assert.ok(first.every(([r, v]) => v === 0x40 + r));
  assert.deepEqual(second[0], [0x20 + 11, 0x10], "gate-off first, on the second chip");
  assert.deepEqual(second.slice(1).map((w) => w[0]), Array.from({ length: 25 }, (_, i) => 0x20 + 24 - i));
  assert.ok(second.slice(1).every(([r, v]) => v === 0x80 + r - 0x20));
});
