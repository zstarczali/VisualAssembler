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
    ${["_sidNewInst", "_sidInstNorm", "_sidInstCtrl", "_sidFreqTables", "_sidClockHz", "_sidIsNtsc", "_sidVol", "_sidVol2", "_sidFps", "_sidDumpImport", "_sidHeaderInfo"].map(extractFunctionSource).join("\n")}
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
    ${["_sidNewInst", "_sidInstNorm", "_sidInstCtrl", "_sidFreqTables", "_sidClockHz", "_sidIsNtsc", "_sidVol", "_sidVol2", "_sidFps", "_sidTuneData", "_sidCellBytes",
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

test("a pitch change under a held gate becomes a legato note (L effect)", () => {
  const { imp } = load();
  const d = dump(48, [{ v: 0, frame: 0, note: 50, len: 48 }]);
  const { freq } = load();
  for (let f = 12; f < 48; f++) { const fr = freq(f < 24 ? 45 : f < 36 ? 40 : 52); d[f * FB] = fr & 0xFF; d[f * FB + 1] = fr >> 8; }
  const r = imp(d, {});
  const cells = r.patterns[r.song[0]][0].filter((c) => c.note != null);
  assert.deepEqual(cells.map((c) => c.note), [50, 45, 40, 52]);
  // L effect: the engine does not retrigger the envelope on the pitch changes
  assert.deepEqual(cells.map((c) => c.fx), [null, "L", "L", "L"]);
  assert.equal(gateOns(engineFrames(r, 48), 0).length, 1);
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
  // the last note has no next one: its table releases the gate on the second frame, the ADSR stays
  const last = r.insts[p[0][2].inst];
  assert.deepEqual([last.d, last.s], [9, 10]);
  assert.equal(last.table[1].off, true);
  assert.equal(last.table.filter((st) => st.off).length, 1);
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
    ${["_sidNewInst", "_sidInstNorm", "_sidInstCtrl", "_sidVol", "_sidVol2", "_sidTuneData"].map(extractFunctionSource).join("\n")}
    this.td = _sidTuneData;`, ctx);
  const table = [{ w: 0x81, n: 70, abs: true }, { w: 0x41, n: 0 }];
  const td = ctx.td({ insts: [{ table }, { a: 9, table }, { table: [table[1]] }], patterns: [], song: [0], speed: 6 });
  assert.deepEqual(Array.from(td.a.itst), [0, 0, 1]);
  assert.equal(td.a.tw.length, 2);
});

// ---- two SIDs: 26 bytes per chip in a frame, six voices in the tune -----------

function twoSidDump(frames, notes) {
  const { freq } = load();
  const d = new Uint8Array(frames * FB * 2);
  for (let f = 0; f < frames; f++) { d[f * FB * 2 + 0x18] = 0x0F; d[f * FB * 2 + 26 + 0x18] = 0x0F; }
  notes.forEach((n) => {
    const at = 26 * (n.v / 3 | 0), bit = n.v % 3, b = at + bit * 7;
    for (let f = n.frame; f < Math.min(frames, n.frame + n.len); f++) {
      const o = f * FB * 2 + b, fr = freq(n.note);
      d[o] = fr & 0xFF; d[o + 1] = fr >> 8;
      d[o + 2] = 0; d[o + 3] = 8;
      d[o + 4] = (n.wave || 0x40) | 1;
      d[o + 5] = 0x09; d[o + 6] = 0xA0;
    }
    d[n.frame * FB * 2 + at + 25] |= 1 << bit;
  });
  return d;
}

test("a two-SID dump becomes six voices, each note on its own voice", () => {
  const { imp } = load();
  const notes = [
    { v: 0, frame: 0, note: 48, len: 10 }, { v: 3, frame: 0, note: 60, len: 10, wave: 0x20 },
    { v: 1, frame: 12, note: 50, len: 10 }, { v: 4, frame: 12, note: 62, len: 10, wave: 0x10 },
    { v: 2, frame: 24, note: 52, len: 10 }, { v: 5, frame: 24, note: 64, len: 10, wave: 0x80 },
  ];
  const r = imp(twoSidDump(80, notes), { frameBytes: 52, sid2Addr: 0xD500 });
  assert.equal(r.sid2, 0xD500);
  const p = r.patterns[r.song[0]];
  assert.equal(p.length, 6);
  notes.forEach((n) => {
    const row = p[n.v].findIndex((c) => c.note != null);
    assert.equal(p[n.v][row].note, n.note, `voice ${n.v}`);
    assert.equal(row, Math.round(n.frame / r.speed), `voice ${n.v} row`);
  });
  assert.equal(r.insts[p[3][0].inst].saw, true);
  assert.equal(r.insts[p[5][p[5].findIndex((c) => c.note != null)].inst].noi, true);
});

test("a two-SID import takes filter and volume from the chip of the voice", () => {
  const { imp } = load();
  const d = twoSidDump(40, [{ v: 0, frame: 0, note: 48, len: 20 }, { v: 4, frame: 0, note: 60, len: 20 }]);
  for (let f = 0; f < 40; f++) {
    const o = f * 52;
    d[o + 0x16] = 0x10; d[o + 0x17] = 0x30; d[o + 0x18] = 0x07;              // SID 1: no routing, volume 7
    d[o + 26 + 0x16] = 0x80; d[o + 26 + 0x17] = 0x52; d[o + 26 + 0x18] = 0x4C; // SID 2: voice 2 routed, HP, volume 12
  }
  const r = imp(d, { frameBytes: 52, sid2Addr: 0xD420 });
  const p = r.patterns[r.song[0]];
  const first = r.insts[p[0][0].inst], second = r.insts[p[4][0].inst];
  assert.deepEqual([first.vol, first.filt], [7, false]);
  assert.deepEqual([second.vol, second.filt, second.hp, second.res, second.cut], [12, true, true, 5, 0x80 << 3]);
});

test("a one-SID dump still gives three voices and no second SID address", () => {
  const { imp } = load();
  const r = imp(dump(40, [{ v: 0, frame: 0, note: 48, len: 10 }]), { frameBytes: 26 });
  assert.equal(r.patterns[0].length, 3);
  assert.equal(r.sid2, 0);
});

// ── regressions from comparing real tunes with their replay ──
const cutOf = (d, f) => (d[f * FB + 0x15] & 7) | (d[f * FB + 0x16] << 3);
const setCut = (d, f, cut) => { d[f * FB + 0x15] = cut & 7; d[f * FB + 0x16] = cut >> 3; };

test("a drum's filter sweep runs on after its waveform went silent", () => {
  const { imp } = load();
  const notes = [0, 12, 24].map((frame) => ({ v: 0, frame, note: 40, len: 1, hold: 1, wave: 0x80 }));
  const d = dump(40, notes, { filter: { cut: 0x200, route: 0xF1, modeVol: 0x4F } });
  for (let f = 0; f < 40; f++) setCut(d, f, 0x200 + (f % 12) * 8);
  const ins = imp(d, {}).insts[0];
  assert.equal(ins.cut, 0x200);
  assert.equal(ins.cutEnd, 0x200 + 11 * 8);
  assert.equal(ins.cutSpeed, 8);
  assert.equal(ins.cutPing, false);
});

test("a filter table that falls fast and creeps counts by when it gets there, within the player's speed", () => {
  const { imp } = load();
  const notes = [0, 12, 24].map((frame) => ({ v: 0, frame, note: 40, len: 12 }));
  const d = dump(40, notes, { filter: { cut: 0x100, route: 0xF1, modeVol: 0x4F } });
  const curve = [0x500, 0x200, 0x140, 0x130, 0x120, 0x110, 0x100, 0x100, 0x100, 0x100, 0x100, 0x100];
  for (let f = 0; f < 40; f++) setCut(d, f, curve[f % 12]);
  const r = imp(d, {});
  const ins = r.insts[r.patterns[r.song[0]][0][0].inst];
  assert.equal(ins.cutEnd, 0x100);
  assert.ok(ins.cutSpeed <= 127);
  // the end comes on time, not 8 frames late as a capped sweep from the top would
  const frames = Math.abs(ins.cut - ins.cutEnd) / ins.cutSpeed;
  assert.ok(frames <= 7, "reaches the end in " + frames + " frames");
});

test("another voice restarting the filter ends this note's sweep: it is no ping-pong", () => {
  const { imp } = load();
  const notes = [{ v: 0, frame: 0, note: 40, len: 60 }];
  const d = dump(70, notes, { filter: { cut: 0x020, route: 0xF1, modeVol: 0x4F } });
  setCut(d, 20, 0x3C0); setCut(d, 21, 0x200); setCut(d, 22, 0x100); setCut(d, 23, 0x080);
  const ins = imp(d, {}).insts[0];
  assert.equal(ins.cut, 0x020);
  assert.equal(ins.cutEnd, 0x020);
  assert.equal(ins.cutSpeed, 0);
  assert.equal(ins.cutPing, false);
});

test("a filter LFO bounces between its extremes", () => {
  const { imp } = load();
  const notes = [{ v: 0, frame: 0, note: 40, len: 100 }];
  const d = dump(110, notes, { filter: { cut: 0x400, route: 0xF1, modeVol: 0x4F } });
  for (let f = 0; f < 110; f++) { const p = f % 80; setCut(d, f, 0x300 + (p < 40 ? p : 80 - p) * 8); }
  const ins = imp(d, {}).insts[0];
  assert.equal(ins.cutPing, true);
  assert.deepEqual([ins.cut, ins.cutEnd], [0x300, 0x300 + 40 * 8]);
  assert.equal(ins.cutSpeed, 8);
});

test("pulse speed is per frame also when written every few frames", () => {
  const { imp } = load();
  const d = dump(44, [0, 22].map((frame) => ({ v: 0, frame, note: 40, len: 22, pw: 0x400 })));
  for (let f = 0; f < 44; f++) { const pw = 0x400 + ((f % 22) >> 2) * 0x10; d[f * FB + 2] = pw & 0xFF; d[f * FB + 3] = pw >> 8; }
  const ins = imp(d, {}).insts[0];
  assert.ok(ins.pwmSpeed >= 3 && ins.pwmSpeed <= 4, "0x10 every 4 frames is about 4 per frame, not " + ins.pwmSpeed);
});

test("one instrument holds the pulse range of all its notes", () => {
  const { imp } = load();
  const d = dump(64, [{ v: 0, frame: 0, note: 40, len: 20, pw: 0x400 }, { v: 0, frame: 20, note: 40, len: 40, pw: 0x400 }]);
  for (let f = 0; f < 60; f++) { const pw = 0x400 + (f < 20 ? f : f - 20) * 4; d[f * FB + 2] = pw & 0xFF; d[f * FB + 3] = pw >> 8; }
  const r = imp(d, {});
  assert.equal(r.insts.length, 1);
  assert.deepEqual([r.insts[0].pwmMin, r.insts[0].pwmMax], [0x400, 0x400 + 39 * 4], "not the first note's top, where the pulse would jump");
});

test("the frames preparing the next note do not break a wave table's period", () => {
  const { imp } = load();
  const arp = [0, 4, 7, 12];
  const notes = [0, 60, 120].map((frame) => ({ v: 0, frame, note: 40, len: 60, arp }));
  const d = dump(180, notes);
  // the two frames before each next note: a different waveform and pitch, as a hard restart prepares it
  [58, 59, 118, 119].forEach((f) => { d[f * FB + 4] = 0x81; d[f * FB + 0] = 0x34; d[f * FB + 1] = 0x7F; });
  const r = imp(d, {});
  assert.equal(r.skipped["long wave tables (cut)"], undefined);
  const ins = r.insts[r.patterns[r.song[0]][0][0].inst];
  assert.equal(ins.table.length, 4);
  assert.equal(ins.tableLoop, 0);
});

test("wave table steps lasting several frames use the table speed", () => {
  const { imp } = load();
  const notes = [0, 90].map((frame) => ({ v: 0, frame, note: 40, len: 90 }));
  const d = dump(180, notes);
  // no repeating period: 45 different steps of 2 frames each, too long for 32 at speed 1 and fine at speed 2
  const fr = load().freq;
  for (const start of [0, 90]) for (let i = 0; i < 90; i++) {
    const n = 40 + (i < 40 ? (i >> 1) % 30 : 0);
    const v = fr(n); d[(start + i) * FB] = v & 0xFF; d[(start + i) * FB + 1] = v >> 8;
  }
  const r = imp(d, {});
  const ins = r.insts[r.patterns[r.song[0]][0][0].inst];
  assert.equal(ins.tableSpeed, 2);
  assert.ok(ins.table.length <= 32);
});

test("hard restart only when the ADSR is zeroed with the gate: otherwise the release keeps sounding", () => {
  const { imp } = load();
  const make = (zeroAt) => {
    const notes = [0, 6, 12].map((frame) => ({ v: 0, frame, note: 40, len: 2, hold: 6, ad: 0x00, sr: 0xC7 }));
    const d = dump(24, notes);
    for (const start of [0, 6, 12]) for (let f = start + zeroAt; f < start + 6; f++) { d[f * FB + 5] = 0; d[f * FB + 6] = 0; }
    return imp(d, {}).insts[0];
  };
  const late = make(5), early = make(2);
  assert.deepEqual([late.gateTimer, late.hr], [4, false]);
  assert.deepEqual([early.gateTimer, early.hr], [4, true]);
});

// Speech: voice 3 takes the filter for itself and steps waveform, pulse width and filter.
function speechDump() {
  const d = dump(80, [{ v: 2, frame: 0, note: 43, len: 20, hold: 30, wave: 0x40, ad: 0, sr: 0xF4 }, { v: 2, frame: 40, note: 55, len: 20, hold: 30, wave: 0x40, ad: 0, sr: 0xF4 }]);
  const { freq } = load();
  [[0, 43], [40, 55]].forEach(([f0, note]) => {
    for (let i = 0; i < 40; i++) {
      const o = (f0 + i) * FB, gate = i < 20 ? 1 : 0;
      const seg = i === 0 ? { w: 0, pw: 0 } : i < 5 ? { w: 0x80, n: 87, flt: [0x34, 0x44, 0x2F], pw: 0x800 } : i < 9 ? { w: 0x20, flt: [0x0D, 0xF4, 0x1F], pw: 0x800 }
        : i < 12 ? { w: 0 , flt: [0x68, 0x24, 0x4F], pw: 0x140 } : { w: 0x40, flt: i < 25 ? [0x0E, 0xF4, 0x2F] : null, pw: 0x140 };
      const fr = freq(seg.n || note);
      d[o + 14] = fr & 0xFF; d[o + 15] = fr >> 8; d[o + 16] = seg.pw & 0xFF; d[o + 17] = seg.pw >> 8;
      d[o + 18] = seg.w | gate; d[o + 19] = 0; d[o + 20] = 0xF4;
      const x = seg.flt || [0x0C, 0x91, 0x1F];
      d[o + 22] = x[0]; d[o + 23] = x[1]; d[o + 24] = x[2];
    }
  });
  return d;
}

test("a speech note becomes a detailed table: waveform, pulse width and filter of every frame", () => {
  const { imp } = load();
  const d = speechDump(), r = imp(d, {});
  const notes = r.patterns[r.song[0]][2].filter((c) => c.note != null);
  assert.deepEqual(notes.map((c) => c.note), [43, 55]);
  assert.equal(notes[0].inst, notes[1].inst, "the octave higher repeat shares the instrument");
  const ins = r.insts[notes[0].inst];
  assert.ok(ins.table.some((s) => s.flt && s.flt.mode === 4 && s.flt.res === 2 && s.flt.route === 4));
  // the engine plays its first row at the end of the first row's length
  const out = engineFrames(r, 80 + r.speed).slice(r.speed - 1);
  for (let f = 1; f < 78; f++) {
    const o = f * FB, x = out[f];
    if (f === 40 || f === 0) continue;
    assert.equal(x[18], d[o + 18], `control, frame ${f}`);
    if (d[o + 18] & 0x40) assert.equal(x[16] | (x[17] << 8), 0x140, `pulse, frame ${f}`);
    if (d[o + 18] & 0xF0) assert.equal(x[14] | (x[15] << 8), d[o + 14] | (d[o + 15] << 8), `pitch, frame ${f}`);
    assert.deepEqual(x.slice(22, 25), Array.from(d.slice(o + 22, o + 25)), `filter, frame ${f}`);
  }
});

test("GoatTracker's hard restart (ADSR 0F 00) is recognized", () => {
  const { imp } = load();
  const d = dump(30, [0, 1, 2, 3].map((k) => ({ v: 0, frame: k * 6, note: 40 + k, len: 4, hold: 6 })));
  [4, 5, 10, 11, 16, 17].forEach((f) => { d[f * FB + 5] = 0x0F; d[f * FB + 6] = 0; });
  const r = imp(d, {});
  const ins = r.insts[r.patterns[r.song[0]][0][0].inst];
  assert.deepEqual([ins.gateTimer, ins.hr], [2, true]);
});
