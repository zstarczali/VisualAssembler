const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");

function extractFunctionSource(name) {
  const marker = `function ${name}(`;
  const start = appJs.indexOf(marker);
  assert.notStrictEqual(start, -1, `Missing function ${name}`);
  let depth = 0;
  let end = -1;
  let seenBrace = false;
  for (let i = start; i < appJs.length; i++) {
    const ch = appJs[i];
    if (ch === "{") { depth += 1; seenBrace = true; }
    else if (ch === "}") {
      depth -= 1;
      if (seenBrace && depth === 0) { end = i + 1; break; }
    }
  }
  assert.notStrictEqual(end, -1, `Could not parse function ${name}`);
  return appJs.slice(start, end);
}

function loadCrtSandbox() {
  const context = { Uint8Array, TextEncoder, Math, Error };
  vm.createContext(context);
  // Inject Magic Desk constants (declared at module scope in app.js).
  vm.runInContext(`
    const MAGIC_DESK_BANK_SIZE = 0x2000;
    const MAGIC_DESK_BANK_COUNT = 8;
    const MAGIC_DESK_LOADER_SIZE = 0x80;
    const MAGIC_DESK_MAX_PAYLOAD =
      MAGIC_DESK_BANK_SIZE * MAGIC_DESK_BANK_COUNT - MAGIC_DESK_LOADER_SIZE;
    this.MAGIC_DESK_BANK_SIZE = MAGIC_DESK_BANK_SIZE;
    this.MAGIC_DESK_BANK_COUNT = MAGIC_DESK_BANK_COUNT;
    this.MAGIC_DESK_LOADER_SIZE = MAGIC_DESK_LOADER_SIZE;
    this.MAGIC_DESK_MAX_PAYLOAD = MAGIC_DESK_MAX_PAYLOAD;
    ${extractFunctionSource("buildMagicDeskLoaderBank0")};
    ${extractFunctionSource("buildMagicDeskCrt")};
    this.buildMagicDeskCrt = buildMagicDeskCrt;
    this.buildMagicDeskLoaderBank0 = buildMagicDeskLoaderBank0;
  `, context);
  return context;
}

const CRT_SIG = "C64 CARTRIDGE   ";
const CHIP_SIG = "CHIP";

function bytesAt(buf, off, len) {
  return String.fromCharCode(...buf.slice(off, off + len));
}

test("Magic Desk CRT header has correct signature, type 19, EXROM/GAME", () => {
  const { buildMagicDeskCrt } = loadCrtSandbox();
  const payload = Uint8Array.from([0xEA, 0x60]); // NOP, RTS
  const crt = buildMagicDeskCrt(payload, 0x0801, 0x0801, "TEST");

  assert.strictEqual(bytesAt(crt, 0, 16), CRT_SIG);
  // Header length ($40) BE at $10..$13
  assert.deepStrictEqual([crt[0x10], crt[0x11], crt[0x12], crt[0x13]], [0, 0, 0, 0x40]);
  // Version 1.00
  assert.deepStrictEqual([crt[0x14], crt[0x15]], [1, 0]);
  // Type 19 (Magic Desk) at $16..$17
  assert.deepStrictEqual([crt[0x16], crt[0x17]], [0, 19]);
  // EXROM=0, GAME=1
  assert.strictEqual(crt[0x18], 0);
  assert.strictEqual(crt[0x19], 1);
  // Name starts with "TEST" (uppercase, space-padded)
  assert.strictEqual(bytesAt(crt, 0x20, 4), "TEST");
  assert.strictEqual(crt[0x20 + 4], 0x20);
});

test("Magic Desk CRT has exactly 8 CHIP banks of 8K each", () => {
  const { buildMagicDeskCrt } = loadCrtSandbox();
  const payload = Uint8Array.from([0xEA]);
  const crt = buildMagicDeskCrt(payload, 0xC000, 0xC000);

  const expectedTotal = 0x40 + 8 * (0x10 + 0x2000);
  assert.strictEqual(crt.length, expectedTotal);

  for (let b = 0; b < 8; b++) {
    const off = 0x40 + b * (0x10 + 0x2000);
    assert.strictEqual(bytesAt(crt, off, 4), CHIP_SIG, `bank ${b} signature`);
    // Packet length $00002010 BE
    assert.deepStrictEqual(
      [crt[off + 4], crt[off + 5], crt[off + 6], crt[off + 7]],
      [0, 0, 0x20, 0x10],
      `bank ${b} packet length`
    );
    // Chip type ROM = 0
    assert.deepStrictEqual([crt[off + 8], crt[off + 9]], [0, 0], `bank ${b} chip type`);
    // Bank number BE
    assert.deepStrictEqual([crt[off + 10], crt[off + 11]], [0, b], `bank ${b} bank #`);
    // Load addr $8000 BE
    assert.deepStrictEqual([crt[off + 12], crt[off + 13]], [0x80, 0], `bank ${b} load addr`);
    // ROM size $2000 BE
    assert.deepStrictEqual([crt[off + 14], crt[off + 15]], [0x20, 0], `bank ${b} rom size`);
  }
});

test("Bank 0 boots via CBM80 vectors pointing at $8009 loader", () => {
  const { buildMagicDeskCrt } = loadCrtSandbox();
  const payload = Uint8Array.from([0xEA]);
  const crt = buildMagicDeskCrt(payload, 0x0801, 0x080D);
  const bank0Off = 0x40 + 0x10;

  // Cold + warm vectors -> $8009 (LE)
  assert.deepStrictEqual([crt[bank0Off + 0x00], crt[bank0Off + 0x01]], [0x09, 0x80]);
  assert.deepStrictEqual([crt[bank0Off + 0x02], crt[bank0Off + 0x03]], [0x09, 0x80]);
  // "CBM80" signature: $C3 $C2 $CD $38 $30
  assert.deepStrictEqual(
    [crt[bank0Off + 0x04], crt[bank0Off + 0x05], crt[bank0Off + 0x06],
     crt[bank0Off + 0x07], crt[bank0Off + 0x08]],
    [0xC3, 0xC2, 0xCD, 0x38, 0x30]
  );
  // Loader first byte at $8009 = SEI (0x78)
  assert.strictEqual(crt[bank0Off + 0x09], 0x78);
});

test("Loader embeds load addr, length, entry addr as immediates", () => {
  const { buildMagicDeskCrt } = loadCrtSandbox();
  const payload = new Uint8Array(0x1234);
  payload.fill(0x55);
  const loadAddr = 0xC000;
  const entryAddr = 0xC020;

  const crt = buildMagicDeskCrt(payload, loadAddr, entryAddr);
  const bank0Off = 0x40 + 0x10;

  // LDA #LL / STA $FD at $8022..$8025 (per loader layout)
  // The absolute cart addresses for the LDA# immediates: LL@$8023, LH@$8027, NL@$802B, NH@$802F, EL@$807E, EH@$807F.
  const rel = (addr) => bank0Off + (addr - 0x8000);
  assert.strictEqual(crt[rel(0x8023)], loadAddr & 0xFF, "LDA #LOAD_LO");
  assert.strictEqual(crt[rel(0x8027)], (loadAddr >> 8) & 0xFF, "LDA #LOAD_HI");
  assert.strictEqual(crt[rel(0x802B)], payload.length & 0xFF, "LDA #LEN_LO");
  assert.strictEqual(crt[rel(0x802F)], (payload.length >> 8) & 0xFF, "LDA #LEN_HI");
  // Exit stub JMP entry at $807D..$807F
  assert.strictEqual(crt[rel(0x807D)], 0x4C, "exit stub JMP opcode");
  assert.strictEqual(crt[rel(0x807E)], entryAddr & 0xFF, "exit stub entry lo");
  assert.strictEqual(crt[rel(0x807F)], (entryAddr >> 8) & 0xFF, "exit stub entry hi");
});

test("Payload starts at bank 0 offset $80 and spills into subsequent banks", () => {
  const { buildMagicDeskCrt, MAGIC_DESK_BANK_SIZE, MAGIC_DESK_LOADER_SIZE } = loadCrtSandbox();
  // Payload spans bank 0 remainder + bank 1 head.
  const firstChunk = MAGIC_DESK_BANK_SIZE - MAGIC_DESK_LOADER_SIZE; // 0x1F80
  const totalLen = firstChunk + 0x100;
  const payload = new Uint8Array(totalLen);
  for (let i = 0; i < totalLen; i++) payload[i] = i & 0xFF;

  const crt = buildMagicDeskCrt(payload, 0x0801, 0x080D);
  const bank0Data = 0x40 + 0x10;
  const bank1Data = 0x40 + (0x10 + 0x2000) + 0x10;

  // Bank 0 payload region: [$80..$2000) matches payload[0..firstChunk]
  for (let i = 0; i < firstChunk; i++) {
    assert.strictEqual(crt[bank0Data + MAGIC_DESK_LOADER_SIZE + i], payload[i]);
  }
  // Bank 1 head: matches payload[firstChunk..]
  for (let i = 0; i < 0x100; i++) {
    assert.strictEqual(crt[bank1Data + i], payload[firstChunk + i]);
  }
  // Bank 1 tail after payload is zero
  assert.strictEqual(crt[bank1Data + 0x100], 0);
  // Banks 2..7 fully zero
  for (let b = 2; b < 8; b++) {
    const off = 0x40 + b * (0x10 + 0x2000) + 0x10;
    for (let i = 0; i < 0x2000; i++) {
      assert.strictEqual(crt[off + i], 0, `bank ${b} byte ${i} should be zero`);
    }
  }
});

test("buildMagicDeskCrt rejects oversized payload", () => {
  const { buildMagicDeskCrt, MAGIC_DESK_MAX_PAYLOAD } = loadCrtSandbox();
  const tooBig = new Uint8Array(MAGIC_DESK_MAX_PAYLOAD + 1);
  assert.throws(() => buildMagicDeskCrt(tooBig, 0x0801, 0x080D), /too large/);
});

test("buildMagicDeskCrt rejects empty payload", () => {
  const { buildMagicDeskCrt } = loadCrtSandbox();
  assert.throws(() => buildMagicDeskCrt(new Uint8Array(0), 0x0801, 0x080D), /empty/);
});
