const test = require("node:test");
const assert = require("node:assert/strict");
const loadApp = require("./helpers/load-app");
const { cpu } = require("./mini6502");

const app = loadApp();

// A tiny "tune" at $1000: init stores A at $0400 and $01 at $0402, play counts frames at
// $0401 and stores $01 at $0403.
const TUNE = [
  0x8D, 0x00, 0x04, 0xA5, 0x01, 0x8D, 0x02, 0x04, 0x60,
  0xEE, 0x01, 0x04, 0xA5, 0x01, 0x8D, 0x03, 0x04, 0x60
];
const sidBlock = (custom = "") => ({
  id: "sid", category: "Makrok", mnemonic: "SID", operand: "", rawOperand: "", description: "",
  addressingMode: "implied", base: "hex", validationError: "", collapsed: true, isSidMacro: true,
  sidFile: "tune.sid", sidFileName: "tune.sid", sidTitle: "", sidAuthor: "",
  sidLoadAddress: 0x1000, sidInitAddress: 0x1000, sidPlayAddress: 0x1009, sidBytes: TUNE, sidCustomAddress: custom
});

// Builds the source with an optional .sid block; returns the labels and the bytes per address.
function build(src, sid) {
  app.__src = src;
  app.__sid = sid || null;
  return app.run(`(() => {
    const saved = program;
    try {
      program = parseExpertText(__src);
      if (__sid) program.unshift(__sid);
      parseUserMacros();
      const layout = getProgramLayout();
      const labels = new Map();
      layout.lines.forEach((line) => addLayoutLabels(labels, line));
      const out = [];
      for (const line of layout.lines) {
        if (!line.block.isSidPlayerMacro && line.block.mnemonic !== "RTS") continue;
        const r = compileLineBytes(line, labels);
        out.push({ address: line.address, ok: r.ok, error: r.error, bytes: r.ok ? Array.from(r.bytes) : [] });
      }
      return { labels: Object.fromEntries(["SID_LOAD", "SID_INIT", "SID_PLAY"].map(k => [k, labels.get(k)])), out };
    } finally { program = saved; }
  })()`);
}

test(".sid_player parses, defaults and goes back to the same Expert line", () => {
  const blocks = app.run(`parseExpertText(".sid_player 2, $80\\n.sid_player").map(b => ({ m: b.mnemonic, s: b.sidPlayerSong, r: b.sidPlayerRaster, line: _blockToExpertLine(b) }))`);
  assert.deepEqual(JSON.parse(JSON.stringify(blocks)), [
    { m: "SID_PLAYER", s: "2", r: "80", line: ".sid_player 2, $80" },
    { m: "SID_PLAYER", s: "0", r: "FA", line: ".sid_player 0, $FA" }
  ]);
  assert.equal(app.run(`getInstructionSize(parseExpertText(".sid_player")[0])`), 78);
});

test(".sid labels follow a custom load address", () => {
  assert.deepEqual({ ...build("* = $C000\n rts\n", sidBlock()).labels }, { SID_LOAD: 0x1000, SID_INIT: 0x1000, SID_PLAY: 0x1009 });
  assert.deepEqual({ ...build("* = $C000\n rts\n", sidBlock("$2000")).labels }, { SID_LOAD: 0x2000, SID_INIT: 0x2000, SID_PLAY: 0x2009 });
});

test(".sid_player inits the sub-tune, hooks a raster IRQ and its handler plays a frame", () => {
  const { out } = build("* = $C000\n.sid_player 2, $80\n rts\n", sidBlock());
  const [player, rts] = out;
  assert.equal(player.ok, true, player.error);
  assert.equal(player.bytes.length, 78);
  const mem = new Uint8Array(0x10000);
  mem.set(TUNE, 0x1000);
  mem.set(player.bytes, player.address);
  mem.set(rts.bytes, rts.address);
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

test(".sid_player without a .sid block is a compile error", () => {
  const { out } = build("* = $C000\n.sid_player\n rts\n");
  assert.equal(out[0].ok, false);
  assert.match(out[0].error, /SID_PLAYER/);
});
