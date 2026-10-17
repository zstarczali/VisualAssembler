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

function constLine(name) {
  const m = appJs.match(new RegExp(`const ${name} = [^;]+;`));
  assert.ok(m, `Missing const ${name}`);
  return m[0];
}

function load() {
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(`
    const _SID_ROWS = 32;
    ${constLine("_SID_DUMP_MAX_INSTS")}
    ${constLine("_SID_DUMP_TABLE_STEPS")}
    ${constLine("_SID_DUMP_WINDOW")}
    function t(k) { return k; }
    ${["_sidNewInst", "_sidInstNorm", "_sidInstCtrl", "_sidFreqTables", "_sidDumpImport", "_sidHeaderInfo"].map(extractFunctionSource).join("\n")}
    this.imp = _sidDumpImport;
    this.header = _sidHeaderInfo;
    this.freq = _sidFreqTables;
  `, ctx);
  return {
    imp: (regs, meta) => { const r = ctx.imp(regs, meta); return r && JSON.parse(JSON.stringify(r)); },
    header: (b) => JSON.parse(JSON.stringify(ctx.header(b))),
    freq: (n) => ctx.freq().f[n],
  };
}

const FB = 26;

// Builds a register dump: notes = [{v, frame, note, len, wave, ad, sr, pw, attack: [{wave, note}]}]
function dump(frames, notes, { filter } = {}) {
  const { freq } = load();
  const d = new Uint8Array(frames * FB);
  for (let f = 0; f < frames; f++) d[f * FB + 0x18] = 0x0F;
  if (filter) for (let f = 0; f < frames; f++) {
    d[f * FB + 0x16] = filter.cut >> 3; d[f * FB + 0x17] = filter.route; d[f * FB + 0x18] = filter.modeVol;
  }
  notes.forEach((n) => {
    const b = n.v * 7, wave = n.wave || 0x40;
    for (let f = n.frame; f < Math.min(frames, n.frame + (n.hold || n.len)); f++) {
      const i = f - n.frame, atk = n.attack && n.attack[i];
      const fr = freq(atk ? atk.note : n.note + (n.arp ? n.arp[i % n.arp.length] : 0));
      const o = f * FB + b;
      d[o] = fr & 0xFF; d[o + 1] = fr >> 8;
      d[o + 2] = (n.pw || 0x800) & 0xFF; d[o + 3] = (n.pw || 0x800) >> 8;
      d[o + 4] = (atk ? atk.wave : wave) | (i < n.len ? 1 : 0);
      d[o + 5] = n.ad === undefined ? 0x09 : n.ad; d[o + 6] = n.sr === undefined ? 0xA0 : n.sr;
    }
    d[n.frame * FB + 25] |= 1 << n.v;
  });
  return d;
}

test("reads PSID header strings and subtune count", () => {
  const { header } = load();
  const b = new Uint8Array(0x7c);
  b.set([..."PSID"].map((c) => c.charCodeAt(0)));
  b[0x0f] = 3; b[0x11] = 2;
  [..."Tune"].forEach((c, i) => { b[0x16 + i] = c.charCodeAt(0); });
  [..."Me"].forEach((c, i) => { b[0x36 + i] = c.charCodeAt(0); });
  assert.deepEqual(header(b), { songs: 3, start: 2, name: "Tune", author: "Me" });
  assert.equal(load().header.call(null, new Uint8Array(4)), null);
});

test("returns null without note ons", () => {
  const { imp } = load();
  assert.equal(imp(new Uint8Array(10 * FB), {}), null);
  assert.equal(imp(new Uint8Array(0), {}), null);
});

test("finds the row length, pitches and note-offs", () => {
  const { imp } = load();
  // 6 frames per row, phase 2; voice 1 plays C-4, E-4, G-4 on rows 0, 2, 3, released on row 5
  const notes = [
    { v: 0, frame: 2, note: 48, len: 10, hold: 12 },
    { v: 0, frame: 14, note: 52, len: 5, hold: 6 },
    { v: 0, frame: 20, note: 55, len: 4, hold: 40 },
    { v: 1, frame: 2, note: 36, len: 30, wave: 0x20 },
  ];
  const r = imp(dump(80, notes), { frameRate: 50.12 });
  assert.equal(r.speed, 6);
  const p = r.patterns[r.song[0]];
  assert.deepEqual([p[0][0].note, p[0][2].note, p[0][3].note], [48, 52, 55]);
  assert.equal(p[0][1].note, null);
  // gate off on frame 24 → row 4 is the release, far from the next note
  assert.equal(p[0][4].fx, "C");
  assert.equal(p[1][0].note, 36);
  assert.equal(r.insts[p[1][0].inst].saw, true);
  assert.equal(r.insts[p[0][0].inst].pul, true);
  assert.equal(r.song.length, 1);
});

test("rebuilds ADSR, pulse width, filter and shares identical instruments", () => {
  const { imp } = load();
  const notes = [0, 1, 2, 3].map((k) => ({ v: 0, frame: k * 4, note: 40 + k, len: 4, ad: 0x2A, sr: 0x6B, pw: 0x400 }));
  const r = imp(dump(20, notes, { filter: { cut: 0x400, route: 0x51, modeVol: 0x1C } }), {});
  assert.equal(r.insts.length, 1);
  const ins = r.insts[0];
  assert.deepEqual([ins.a, ins.d, ins.s, ins.r, ins.pw], [2, 10, 6, 11, 0x400]);
  assert.deepEqual([ins.filt, ins.lp, ins.bp, ins.hp, ins.res, ins.vol, ins.cut], [true, true, false, false, 5, 12, 0x400]);
  assert.equal(r.speed, 4);
});

test("drum attacks become wave table steps, fixed pitches as absolute notes", () => {
  const { imp } = load();
  const attack = [{ wave: 0x80, note: 83 }, { wave: 0x80, note: 80 }];
  const notes = [36, 41, 43].map((note, k) => ({ v: 0, frame: k * 6, note, len: 6, attack }));
  const r = imp(dump(24, notes), {});
  assert.equal(r.insts.length, 1);
  const ins = r.insts[0];
  assert.equal(ins.pul, true);
  assert.deepEqual(ins.table.map((s) => [s.w, s.n, s.abs]), [[0x80, 83, true], [0x80, 80, true], [0x40, 0, false]]);
  assert.equal(ins.tableLoop, -1);
});

test("arpeggios loop in the wave table; retriggers merge into one note", () => {
  const { imp } = load();
  const notes = [
    { v: 2, frame: 0, note: 48, len: 24, arp: [0, 4, 7] },
    { v: 0, frame: 0, note: 30, len: 5, hold: 6 },
    { v: 0, frame: 6, note: 30, len: 5, hold: 6 },
    { v: 0, frame: 12, note: 30, len: 1, hold: 1 },
    { v: 0, frame: 13, note: 30, len: 5, hold: 5 },
    { v: 0, frame: 18, note: 30, len: 5, hold: 6 },
  ];
  const r = imp(dump(30, notes), {});
  assert.equal(r.speed, 6);
  assert.equal(r.skipped["retriggers merged"], 1);
  const p = r.patterns[r.song[0]];
  assert.deepEqual([0, 1, 2, 3].map((row) => p[0][row].note), [30, 30, 30, 30]);
  const arp = r.insts[p[2][0].inst];
  assert.deepEqual(arp.table.slice(0, 3).map((s) => s.n), [0, 4, 7]);
  assert.ok(arp.tableLoop >= 0);
  const loop = arp.table.slice(arp.tableLoop).map((s) => s.n);
  assert.deepEqual([...loop].sort(), [0, 4, 7]);
});

test("NTSC tunes are retuned to the PAL note table", () => {
  const { imp, freq } = load();
  const d = dump(8, [{ v: 0, frame: 0, note: 48, len: 8 }]);
  // the same note on NTSC needs a lower register value
  const ntsc = Math.round(freq(48) * 985248 / 1022727);
  d.forEach((_, i) => { if (i % FB === 0 && d[i + 4] & 1) { d[i] = ntsc & 0xFF; d[i + 1] = ntsc >> 8; } });
  assert.equal(imp(d, { frameRate: 59.83 }).patterns[0][0][0].note, 48);
});

// Plays an imported tune with the editor's frame engine (the model of the 6502 player).
function engineFrames(res, frames) {
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(`
    const _SID_ROWS = 32;
    function t(k) { return k; }
    ${["_sidNewInst", "_sidInstNorm", "_sidInstCtrl", "_sidFreqTables", "_sidTuneData", "_sidCellBytes",
      "_sidEngineNew", "_sidEngTab", "_sidEngNoteOn", "_sidEngRow", "_sidEngHr", "_sidEngUpdate", "_sidEngFrame"].map(extractFunctionSource).join("\n")}
    this.run = function(res, n) {
      const e = _sidEngineNew(_sidTuneData({ insts: res.insts, patterns: res.patterns, song: res.song, speed: res.speed }));
      const out = [];
      for (let k = 0; k < n; k++) out.push(Array.from(_sidEngFrame(e)));
      return out;
    };
  `, ctx);
  return JSON.parse(JSON.stringify(ctx.run(res, frames)));
}
const gateOns = (frames, v) => frames.map((r, i) => i && (r[v * 7 + 4] & 1) && !(frames[i - 1][v * 7 + 4] & 1) ? i : -1).filter((i) => i >= 0);

test("funktempo rows (alternating 8 / 9 frames) keep every note on its frame via F effects", () => {
  const { imp } = load();
  const notes = [];
  for (let k = 0, f = 0; k < 12; k++) { notes.push({ v: 0, frame: f, note: 40 + (k % 5), len: 6, hold: 7 }); f += k & 1 ? 9 : 8; }
  const r = imp(dump(120, notes), {});
  assert.ok([8, 9].includes(r.speed), String(r.speed));
  const p = r.patterns[r.song[0]];
  assert.deepEqual(p[0].slice(0, 12).map((c) => c.note), notes.map((n) => n.note));
  assert.ok(p.some((col) => col.some((c) => c.fx === "F")));
  // the engine retriggers at the same distances as the original
  const on = gateOns(engineFrames(r, 120), 0);
  const want = notes.map((n) => n.frame);
  assert.deepEqual(on.slice(1, 11).map((f, i) => f - on[0]), want.slice(1, 11).map((f) => f - want[0]));
});

test("a pitch change under a held gate becomes a (legato) note", () => {
  const { imp } = load();
  const d = dump(48, [{ v: 0, frame: 0, note: 50, len: 48 }]);
  const { freq } = load();
  for (let f = 12; f < 48; f++) { const fr = freq(f < 24 ? 45 : f < 36 ? 40 : 52); d[f * FB] = fr & 0xFF; d[f * FB + 1] = fr >> 8; }
  const r = imp(d, {});
  const notes = r.patterns[r.song[0]][0].filter((c) => c.note != null).map((c) => c.note);
  assert.deepEqual(notes, [50, 45, 40, 52]);
  assert.ok(r.skipped["legato notes (retriggered)"]);
});

test("the release after a short gate keeps sounding: bass under a 1-frame drum hit", () => {
  const { imp } = load();
  // noise hit with the gate on for one frame, then the bass note on pulse in the release
  const notes = [0, 12, 24].map((frame, k) => ({ v: 0, frame, note: 28 + k * 5, len: 1, hold: 11, attack: [{ wave: 0x80, note: 67 }] }));
  const r = imp(dump(40, notes), {});
  const p = r.patterns[r.song[0]];
  assert.deepEqual(p[0].filter((c) => c.note != null).map((c) => c.note), [28, 33, 38]);
  const ins = r.insts[p[0][0].inst];
  assert.equal(ins.pul, true);
  assert.deepEqual([ins.table[0].w, ins.table[0].n, ins.table[0].abs], [0x80, 67, true]);
  // the gate drops 11 frames before the next note: the gate timer does exactly that
  assert.equal(ins.gateTimer, 11);
  // the last note has no next one: the envelope falls at the release rate instead
  const last = r.insts[p[0][2].inst];
  assert.deepEqual([last.s, last.d], [0, last.r]);
});

test("gate off a few frames before the next note becomes the gate timer (hard restart)", () => {
  const { imp } = load();
  const notes = [0, 1, 2, 3].map((k) => ({ v: 0, frame: k * 6, note: 40 + k, len: 4, hold: 6 }));
  const d = dump(30, notes);
  // ADSR zeroed in the frames before each new note
  [4, 5, 10, 11, 16, 17].forEach((f) => { d[f * FB + 5] = 0; d[f * FB + 6] = 0; });
  const r = imp(d, {});
  const ins = r.insts[r.patterns[r.song[0]][0][0].inst];
  assert.equal(ins.gateTimer, 2);
  assert.equal(ins.hr, true);
});

test("a silent hard-restart frame does not end up in the wave table", () => {
  const { imp } = load();
  const notes = [0, 6, 12].map((frame) => ({ v: 0, frame, note: 40, len: 5, hold: 6 }));
  const d = dump(20, notes);
  [5, 11].forEach((f) => { d[f * FB + 4] = 0; });
  const r = imp(d, {});
  r.insts.forEach((ins) => assert.ok(ins.table.every((s) => s.w !== 0), JSON.stringify(ins.table)));
});

test("a regular sub-semitone wobble becomes instrument vibrato, not wave table steps", () => {
  const { imp, freq } = load();
  const d = dump(80, [{ v: 0, frame: 0, note: 48, len: 80 }]);
  // after 10 frames: triangle ±0.4 semitone, 12 frames from peak to trough
  for (let f = 10; f < 80; f++) {
    const t = (f - 10) % 24, tri = t < 6 ? t / 6 : t < 18 ? 1 - (t - 6) / 6 : -1 + (t - 18) / 6;
    const fr = Math.round(freq(48) * Math.pow(2, 0.4 * tri / 12));
    d[f * FB] = fr & 0xFF; d[f * FB + 1] = fr >> 8;
  }
  const r = imp(d, {});
  const ins = r.insts[r.patterns[r.song[0]][0][0].inst];
  assert.equal(ins.vibSpeed, 12);
  assert.equal(ins.vibDepth, 2);
  assert.equal(ins.vibDelay, 10);
  assert.deepEqual(ins.table, []);
});

test("a fixed-pitch attack on different notes votes for absolute steps and shares one instrument", () => {
  const { imp, freq } = load();
  // pulse at +16 / +4 above notes 40, 41, 43... i.e. the same absolute pitches 56 and 44 (a fixed drop)
  const notes = [40, 41, 43, 45].map((note, k) => ({ v: 0, frame: k * 8, note, len: 8,
    attack: [{ wave: 0x40, note: 56 }, { wave: 0x40, note: 44 }] }));
  const r = imp(dump(40, notes), {});
  const p = r.patterns[r.song[0]][0];
  const used = new Set(p.filter((c) => c.note != null).map((c) => c.inst));
  assert.equal(used.size, 1);
  const t = r.insts[[...used][0]].table;
  assert.deepEqual(t.slice(0, 2).map((s) => [s.n, s.abs]), [[56, true], [44, true]]);
});

test("a test-bit first frame is a silent step: no pitch, so notes share the instrument", () => {
  const { imp } = load();
  const notes = [40, 47, 52].map((note, k) => ({ v: 0, frame: k * 6, note, len: 6, attack: [{ wave: 0x08, note: 20 + k * 9 }] }));
  const r = imp(dump(24, notes), {});
  const p = r.patterns[r.song[0]][0];
  const ins = r.insts[p[0].inst];
  assert.equal(new Set(p.filter((c) => c.note != null).map((c) => c.inst)).size, 1);
  assert.deepEqual([ins.table[0].w, ins.table[0].n, ins.table[0].abs], [0x08, 0, false]);
});

test("instruments with the same wave table store it once in the player data", () => {
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(`const _SID_ROWS = 32; function t(k) { return k; }
    ${["_sidNewInst", "_sidInstNorm", "_sidInstCtrl", "_sidTuneData"].map(extractFunctionSource).join("\n")}
    this.td = _sidTuneData;`, ctx);
  const table = [{ w: 0x81, n: 70, abs: true }, { w: 0x41, n: 0 }];
  const td = ctx.td({ insts: [{ table }, { a: 9, table }, { table: [table[1]] }], patterns: [], song: [0], speed: 6 });
  assert.deepEqual(Array.from(td.a.itst), [0, 0, 1]);
  assert.equal(td.a.tw.length, 2);
});
