const test = require("node:test");
const assert = require("node:assert/strict");
const loadApp = require("./helpers/load-app");
const { compileText, loadPrg, labelOf, vmaTest } = require("./helpers/vma-cli");
const { cpu } = require("./mini6502");

const app = loadApp();

// A tiny "tune" at $1000: init stores A at $0400 and $01 at $0402, play counts frames at
// $0401 and stores $01 at $0403.
const TUNE = [
  0x8D, 0x00, 0x04, 0xA5, 0x01, 0x8D, 0x02, 0x04, 0x60,
  0xEE, 0x01, 0x04, 0xA5, 0x01, 0x8D, 0x03, 0x04, 0x60
];
// TUNE as a PSID v2 file: load $1000, init $1000, play $1009, one song.
function psid() {
  const h = new Uint8Array(0x7C);
  h.set([0x50, 0x53, 0x49, 0x44, 0x00, 0x02, 0x00, 0x7C, 0x10, 0x00, 0x10, 0x00, 0x10, 0x09, 0x00, 0x01, 0x00, 0x01]);
  return Uint8Array.from([...h, ...TUNE]);
}

// Builds `src` (no BASIC stub; a `.sid "tune.sid"[, $addr]` line in front when `sid` is given) with
// the VMA CLI: the answer, its memory and the labels.
function build(src, sid = null) {
  const full = (sid != null ? `.sid "tune.sid"${sid ? ", " + sid : ""}\n` : "") + src;
  const r = compileText(full, { basicStub: false, files: { "tune.sid": psid() } });
  return { r, mem: r.ok ? loadPrg(r.bytes).mem : null };
}

test(".sid_player parses, defaults and goes back to the same Expert line", () => {
  const blocks = app.run(`parseExpertText(".sid_player 2, $80\\n.sid_player").map(b => ({ m: b.mnemonic, s: b.sidPlayerSong, r: b.sidPlayerRaster, line: _blockToExpertLine(b) }))`);
  assert.deepEqual(JSON.parse(JSON.stringify(blocks)), [
    { m: "SID_PLAYER", s: "2", r: "80", line: ".sid_player 2, $80" },
    { m: "SID_PLAYER", s: "0", r: "FA", line: ".sid_player 0, $FA" }
  ]);
});

vmaTest(".sid labels follow a custom load address", () => {
  const labels = ({ r }) => (assert.equal(r.ok, true, r.error), ["SID_LOAD", "SID_INIT", "SID_PLAY"].map(k => labelOf(r, k)));
  assert.deepEqual(labels(build("* = $C000\n rts\n", "")), [0x1000, 0x1000, 0x1009]);
  assert.deepEqual(labels(build("* = $C000\n rts\n", "$2000")), [0x2000, 0x2000, 0x2009]);
});

vmaTest(".sid_player inits the sub-tune, hooks a raster IRQ and its handler plays a frame", () => {
  const { r, mem } = build("* = $C000\n.sid_player 2, $80\n__end:\n rts\n", "");
  assert.equal(r.ok, true, r.error);
  const player = { address: 0xC000 };
  assert.equal(labelOf(r, "__end") - player.address, 78);
  mem[0xEA31] = 0x60;                       // KERNAL IRQ tail stub
  mem[0x01] = 0x37;
  const c = cpu(mem);
  c.call(player.address);
  assert.equal(mem[0x0402], 0x35, "init runs with the ROMs banked out");
  assert.equal(mem[0x01], 0x37, "$01 restored after init");
  assert.equal(mem[0x0400], 2, "init got the sub-tune in A");
  assert.equal(c.i, 0, "CLI at the end");
  assert.equal(mem[0xDC0D], 0x7F, "CIA1 IRQ off");
  assert.equal(mem[0xD012], 0x80);
  assert.equal(mem[0xD01A], 0x01);
  const handler = mem[0x0314] | (mem[0x0315] << 8);
  assert.equal(handler, player.address + 59);
  c.call(handler);
  c.call(handler);
  assert.equal(mem[0x0401], 2, "the handler calls play once per IRQ");
  assert.equal(mem[0x0403], 0x35, "play runs with the ROMs banked out");
  assert.equal(mem[0x01], 0x37, "$01 restored before JMP $EA31");
});

vmaTest(".sid_player without a .sid block is a compile error", () => {
  const { r } = build("* = $C000\n.sid_player\n rts\n");
  assert.equal(r.ok, false);
  assert.equal(r.errors[0].key, "compileSidPlayerNoSid");
});
