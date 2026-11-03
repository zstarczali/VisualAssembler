const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");

function extractFunctionSource(name) {
  const start = appJs.indexOf(`function ${name}(`);
  assert.notStrictEqual(start, -1, `Missing function ${name}`);
  let depth = 0, seen = false;
  for (let i = start; i < appJs.length; i++) {
    if (appJs[i] === "{") { depth++; seen = true; }
    else if (appJs[i] === "}" && seen && --depth === 0) return appJs.slice(start, i + 1);
  }
  throw new Error(`Could not parse ${name}`);
}

function load() {
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(`
    const _SID_ROWS = 32;
    function t(k) { return k; }
    ${extractFunctionSource("_sidNewInst")}
    ${extractFunctionSource("_sidInstNorm")}
    ${["_sidFreqTables", "_sidClockHz", "_sidIsNtsc"].map(extractFunctionSource).join(";")}
    ${extractFunctionSource("_sidGoatImport")}
    this.imp = _sidGoatImport;
  `, ctx);
  return (bytes) => { const r = ctx.imp(bytes); return r && JSON.parse(JSON.stringify(r)); };
}

// Builds a minimal GTS5 song: one subtune, given order lists, instruments, tables, patterns.
function gts5({ orders, insts = [], tables = [[], [], [], []], patterns }) {
  const out = [..."GTS5"].map((c) => c.charCodeAt(0));
  const pad = (s, n) => { const a = new Array(n).fill(0); [...s].forEach((c, i) => { if (i < n) a[i] = c.charCodeAt(0); }); return a; };
  out.push(...pad("Test", 32), ...pad("Me", 32), ...pad("", 32));
  out.push(1);
  orders.forEach((ol) => { out.push(ol.length - 1, ...ol); });
  out.push(insts.length);
  insts.forEach((i) => out.push(i.ad, i.sr, i.wp || 0, i.pp || 0, i.fp || 0, i.sp || 0, i.vd || 0, i.gt || 0, i.fw || 0, ...pad(i.name || "", 16)));
  tables.forEach((tb) => { out.push(tb.length, ...tb.map((e) => e[0]), ...tb.map((e) => e[1])); });
  out.push(patterns.length);
  patterns.forEach((rows) => { out.push(rows.length + 1); rows.forEach((r) => out.push(...r)); out.push(0xFF, 0, 0, 0); });
  return Uint8Array.from(out);
}

const REST = [0xBD, 0, 0, 0];

test("rejects non-GoatTracker data", () => {
  const imp = load();
  assert.equal(imp(Uint8Array.from([0xFD, 1, 1, 6])), null);
  assert.equal(imp(Uint8Array.from([..."GTS5"].map((c) => c.charCodeAt(0)))), null);
});

test("flattens order lists with repeat and transpose into shared 32-row patterns", () => {
  const imp = load();
  const pat0 = [[0x60 + 24, 1, 0, 0], ...Array(31).fill(REST)];
  const song = imp(gts5({
    orders: [[0xD1, 0x00, 0xF2, 0x00, 0xFF, 0x00], [0x01, 0x01, 0x01, 0xFF, 0x00], [0x01, 0x01, 0x01, 0xFF, 0x00]],
    insts: [{ ad: 0x09, sr: 0x00, wp: 1, gt: 2, fw: 0x09 }],
    tables: [[[0x41, 0x00], [0xFF, 0x00]], [], [], []],
    patterns: [pat0, Array(32).fill(REST)]
  }));
  assert.ok(song);
  assert.equal(song.insts.length, 1);
  assert.equal(song.insts[0].pul, true);
  assert.equal(song.insts[0].firstWave, 0x09);
  assert.equal(song.insts[0].gateTimer, 2);
  assert.equal(song.insts[0].hr, true);
  assert.equal(song.song.length, 3);
  // pattern 0 twice (repeat), then transposed +2: two distinct editor patterns
  assert.equal(song.patterns.length, 2);
  assert.deepEqual(song.song, [0, 0, 1]);
  assert.equal(song.patterns[0][0][0].note, 24);
  assert.equal(song.patterns[1][0][0].note, 26);
});

test("maps key off, portamento and tempo; counts dropped commands", () => {
  const imp = load();
  const rows = [[0x60 + 36, 1, 0x0F, 0x04], [0xBD, 0, 1, 1], [0xBE, 0, 0, 0], [0xBD, 0, 4, 1], ...Array(28).fill(REST)];
  const song = imp(gts5({
    orders: [[0x00, 0xFF, 0x00], [0x00, 0xFF, 0x00], [0x00, 0xFF, 0x00]],
    insts: [{ ad: 0x00, sr: 0xF0, wp: 1 }],
    tables: [[[0x21, 0x00], [0xFF, 0x00]], [], [], [[0x00, 0x20]]],
    patterns: [rows]
  }));
  const v = song.patterns[0][0];
  assert.deepEqual([v[0].note, v[0].fx, v[0].fxval], [36, "F", 4]);
  assert.deepEqual([v[1].fx, v[1].fxval], ["U", 0x20 * 4]);
  assert.equal(v[2].fx, "C");
  assert.equal(song.skipped["4xx vibrato"], 3);
});

test("wavetable arpeggio, gate release, pulse and filter tables", () => {
  const imp = load();
  const song = imp(gts5({
    orders: [[0x00, 0xFF, 0x00], [0x00, 0xFF, 0x00], [0x00, 0xFF, 0x00]],
    insts: [
      { ad: 0x0A, sr: 0x00, wp: 1, pp: 1, fp: 1 },
      { ad: 0x6D, sr: 0x0D, wp: 4 }
    ],
    tables: [
      [[0x41, 0x00], [0x41, 0x0C], [0xFF, 0x01], [0x41, 0x00], [0x40, 0x00], [0xFF, 0x00]],
      [[0x88, 0x00], [0x10, 0x20], [0x10, 0xE0], [0xFF, 0x02]],
      [[0x90, 0x71], [0x00, 0x40], [0x20, 0x02], [0xFF, 0x00]],
      []
    ],
    patterns: [[[0x60 + 30, 1, 0, 0], REST, [0x60 + 30, 2, 0, 0], ...Array(29).fill(REST)]]
  }));
  const [arp, pluck] = song.insts;
  assert.deepEqual(arp.table.map((s) => s.n), [0, 0, 12]);
  assert.equal(arp.tableLoop, 1);
  assert.equal(arp.pw, 0x800);
  assert.ok(arp.pwmSpeed > 0 && arp.pwmMin >= 0x80 && arp.pwmMax > arp.pwmMin);
  assert.equal(arp.filt, true);
  assert.equal(arp.lp, true);
  assert.equal(arp.res, 7);
  assert.equal(arp.cut, 0x40 << 3);
  assert.equal(arp.cutEnd, (0x40 + 0x40) << 3);
  assert.ok(arp.cutSpeed > 0);
  assert.deepEqual(pluck.table, []);
  // the gate released by the wavetable → C on the following row
  assert.equal(song.patterns[0][0][3].fx, "C");
});

test("imports the bundled GoatTracker example songs", (t) => {
  const dir = "D:/Development/goat/GT_TUNES";
  if (!fs.existsSync(dir)) { t.skip("GoatTracker examples not present"); return; }
  const imp = load();
  for (const f of fs.readdirSync(dir).filter((n) => n.endsWith(".sng"))) {
    const song = imp(fs.readFileSync(path.join(dir, f)));
    assert.ok(song, f);
    assert.ok(song.patterns.length >= 1 && song.song.length >= 1, f);
    assert.ok(song.song.every((i) => i < song.patterns.length), f);
  }
});
