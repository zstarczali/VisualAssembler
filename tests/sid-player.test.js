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
function constLine(name) {
  const m = appJs.match(new RegExp(`const ${name} = [^;]+;`));
  assert.ok(m, `Missing const ${name}`);
  return m[0];
}

const FNS = ["_sidNewInst", "_sidInstNorm", "_sidInstCtrl", "_sidWaveByte", "_sidFreqTables", "_sidClockHz", "_sidIsNtsc", "_sidVol", "_sidFps", "_sidTuneData", "_sidCellBytes",
  "_sidEngineNew", "_sidEngTab", "_sidEngNoteOn", "_sidEngRow", "_sidEngHr", "_sidEngUpdate", "_sidEngFrame",
  "_sidExportAsmPlayable", "_sidInstExtBytes", "_sidReadInstExt"];

function sandbox(state) {
  const ctx = { Math, TextEncoder, TextDecoder, Uint8Array, t: (k) => k };
  vm.createContext(ctx);
  vm.runInContext(`${constLine("_SID_ROWS")} ${constLine("_SID_PLAYER_CODE_MAX")} ${constLine("_SID_PLAYER_2SID_EXTRA")}
    var _sidInsts = null, _sidPatterns = null, _sidSong = null, _sidSpeed = 6, _sidSid2Addr = 0xD420, _sidSongVol, _sidNtsc;
    ${FNS.map(fnSource).join("\n")}
    this.api = { set(s) { _sidInsts = s.insts; _sidPatterns = s.patterns; _sidSong = s.song; _sidSpeed = s.speed; _sidSid2Addr = s.sid2 || 0xD420; _sidSongVol = s.vol; _sidNtsc = !!s.ntsc; },
      ${FNS.join(", ")} };`, ctx);
  ctx.api.set(state);
  return ctx.api;
}

function emptyPattern() {
  return [0, 1, 2].map(() => Array.from({ length: 32 }, () => ({ note: null, inst: 0, fx: null, fxval: 0 })));
}

function richTune() {
  const lead = { name: "Lead", saw: true, pul: false, a: 1, d: 9, s: 10, r: 6, vol: 15,
    vibDelay: 6, vibSpeed: 3, vibDepth: 9, gateTimer: 2, hr: true, firstWave: 0x09 };
  const pad = { name: "Pad", pul: true, pw: 600, pwmSpeed: 40, pwmMin: 300, pwmMax: 3700, a: 4, d: 4, s: 12, r: 9, vol: 14,
    lp: true, res: 13, filt: true, cut: 200, cutEnd: 1500, cutSpeed: 23, cutPing: true };
  const arp = { name: "Arp", pul: true, pw: 2048, a: 0, d: 6, s: 8, r: 3, vol: 15, tableSpeed: 2, tableLoop: 0,
    table: [{ w: 0, n: 0 }, { w: 0, n: 4 }, { w: 0, n: 7 }, { w: 0x21, n: 12 }] };
  const drum = { name: "Drum", noi: true, pul: false, a: 0, d: 8, s: 0, r: 8, vol: 15, hp: true, filt: true, off3: true,
    cut: 1800, cutEnd: 300, cutSpeed: 90, res: 5,
    table: [{ w: 0x81, n: 60, abs: true }, { w: 0x41, n: 30, abs: true }, { w: 0x41, n: -12 }, { w: 0x80, n: 0 }], tableLoop: -1 };
  const ring = { name: "Ring", tri: true, pul: false, ring: true, sync: true, a: 2, d: 5, s: 9, r: 5, vol: 13 };
  const p0 = emptyPattern(), p1 = emptyPattern();
  const put = (p, v, r, note, inst, fx, fxval) => { p[v][r] = { note, inst, fx: fx || null, fxval: fxval || 0 }; };
  put(p0, 0, 0, 48, 0); put(p0, 0, 4, 50, 0, "V", 0x23); put(p0, 0, 5, null, 0, "V", 0x23); put(p0, 0, 8, 52, 0);
  put(p0, 0, 12, null, 0, "U", 0x40); put(p0, 0, 13, null, 0, "U", 0x40); put(p0, 0, 16, 47, 4); put(p0, 0, 20, null, 0, "C");
  put(p0, 0, 24, 55, 0, "D", 0x30); put(p0, 0, 28, 57, 3);
  put(p0, 1, 0, 36, 1); put(p0, 1, 10, 31, 1); put(p0, 1, 20, 43, 2); put(p0, 1, 26, null, 0, "F", 4);
  put(p0, 2, 2, 24, 3); put(p0, 2, 6, 60, 2); put(p0, 2, 14, 24, 3); put(p0, 2, 22, 70, 2); put(p0, 2, 30, 24, 3);
  put(p1, 0, 0, 60, 2); put(p1, 0, 3, 62, 0); put(p1, 0, 31, 64, 0);
  put(p1, 1, 1, 40, 1); put(p1, 1, 2, null, 0, "F", 7); put(p1, 1, 16, 45, 4);
  put(p1, 2, 0, 20, 3); put(p1, 2, 8, 22, 9);   // instrument 9 does not exist → 0
  return { insts: [lead, pad, arp, drum, ring], patterns: [p0, p1], song: [0, 1, 0, 1], speed: 5 };
}

function runPlayer(api, frames) {
  const asm = api._sidExportAsmPlayable();
  const { mem, labels } = assemble(asm);
  const c = cpu(mem);
  c.call(labels.sid_init);
  const out = [];
  for (let k = 0; k < frames; k++) {
    c.call(labels.sid_frame);
    out.push(Array.from(mem.slice(0xD400, 0xD419)));
  }
  return { out, labels, mem };
}

function runEngine(api, frames) {
  const e = api._sidEngineNew(api._sidTuneData());
  const out = [];
  for (let k = 0; k < frames; k++) out.push(Array.from(api._sidEngFrame(e)));
  return out;
}

test("the exported 6502 player and the JS engine write identical SID registers every frame", () => {
  const api = sandbox(richTune());
  const frames = 32 * 4 * 6 + 50;
  const cpuOut = runPlayer(api, frames).out;
  const engOut = runEngine(api, frames);
  for (let k = 0; k < frames; k++) {
    assert.deepEqual(cpuOut[k], engOut[k], `SID registers differ at frame ${k}`);
  }
});

test("a plain tune from older saves (no new instrument fields) still matches", () => {
  const p = emptyPattern();
  p[0][0] = { note: 48, inst: 0, fx: "V", fxval: 0x24 };
  p[1][5] = { note: 50, inst: 0, fx: "U", fxval: 8 };
  p[2][10] = { note: null, inst: 0, fx: "C", fxval: 0 };
  const api = sandbox({ insts: [{ tri: false, saw: false, pul: true, noi: false, pw: 2048, a: 2, d: 8, s: 6, r: 4,
    lp: true, bp: false, hp: false, cut: 1400, res: 4, vol: 15 }], patterns: [p], song: [0], speed: 6 });
  const frames = 32 * 6 * 2;
  assert.deepEqual(runPlayer(api, frames).out, runEngine(api, frames));
});

test("instrument modulations really move the registers", () => {
  const api = sandbox(richTune());
  const regs = runEngine(api, 32 * 5);
  const series = (fn) => regs.map(fn);
  const pw1 = series((r) => r[9] | (r[10] << 8));
  assert.ok(new Set(pw1.slice(10, 60)).size > 20, "PWM sweeps the pulse width of voice 2");
  const cut = series((r) => (r[0x15] & 7) | (r[0x16] << 3));
  assert.ok(new Set(cut.slice(5, 120)).size > 20, "the filter cutoff sweeps");
  const f0 = series((r) => r[0] | (r[1] << 8));
  assert.ok(new Set(f0.slice(8, 20)).size > 3, "instrument vibrato moves the lead's frequency");
  assert.ok(regs.some((r) => r[4] === 0x09), "first-frame waveform $09 is written on note on");
  assert.ok(regs.some((r) => (r[0x18] & 0x80) && (r[0x18] & 0x40)), "3 OFF and high-pass reach $D418");
});

test("gate timer + hard restart clear the gate and ADSR before the next note", () => {
  const api = sandbox(richTune());
  const regs = runEngine(api, 60);
  // lead (voice 1) has gate timer 2 + hard restart; row 4 starts a new note
  const before = regs.filter((r, k) => k > 5 && k < 30 && (r[4] & 1) === 0 && r[5] === 0 && r[6] === 0);
  assert.ok(before.length > 0, "a frame with gate off and AD/SR = 0 precedes the next note");
});

test("save / load keeps every new instrument parameter and the name", () => {
  const tune = richTune();
  const api = sandbox(tune);
  const norm = tune.insts.map(api._sidInstNorm);
  norm.forEach((ins) => {
    const bytes = api._sidInstExtBytes(ins);
    const back = { name: "x" };
    const end = api._sidReadInstExt(back, Uint8Array.from(bytes), 0);
    assert.equal(end, bytes.length);
    const keys = ["filt", "off3", "hr", "cutPing", "cutEnd", "cutSpeed", "vibDelay", "vibSpeed", "vibDepth", "pwmSpeed",
      "pwmMin", "pwmMax", "gateTimer", "firstWave", "tableSpeed", "tableLoop", "name"];
    keys.forEach((k) => assert.deepEqual(back[k], ins[k], `${ins.name}.${k}`));
    assert.deepEqual(JSON.parse(JSON.stringify(back.table)), JSON.parse(JSON.stringify(ins.table)));
  });
});

test("a long tune keeps its data out of I/O and ROM, and still plays like the engine", () => {
  const p = (k) => [0, 1, 2].map((v) => Array.from({ length: 32 }, (_, r) =>
    ({ note: r % 4 ? null : 24 + ((k + v + r) % 40), inst: v & 1, fx: r === 31 && v === 0 ? "F" : null, fxval: r === 31 && v === 0 ? 5 + (k & 1) : 0 })));
  const patterns = Array.from({ length: 24 }, (_, k) => p(k));
  const api = sandbox({ insts: [{ pul: true }, { saw: true, pul: false, table: [{ w: 0x81, n: 70, abs: true }, { w: 0, n: 0 }] }],
    patterns, song: patterns.map((_, k) => k), speed: 5 });
  const frames = 32 * 6 * 24 + 40;
  const { out, labels } = runPlayer(api, frames);
  const addrs = Object.entries(labels).filter(([k]) => k.startsWith("sid_")).map(([, a]) => a);
  assert.ok(addrs.every((a) => a < 0xA000 || (a >= 0xC000 && a < 0xD000)), "no label in BASIC ROM, I/O or KERNAL");
  assert.ok(labels.sid_v0_notes < 0xA000, "the pattern data moved below $A000");
  assert.deepEqual(out, runEngine(api, frames));
});

test("the player code fits in the reserved size", () => {
  const api = sandbox(richTune());
  const { labels } = runPlayer(api, 1);
  const vm2 = labels.sid_vbase - 0xC000;
  const max = Number(/const _SID_PLAYER_CODE_MAX = (0x[0-9A-Fa-f]+);/.exec(appJs)[1]);
  assert.ok(vm2 <= max, `player code ${vm2} > ${max}`);
});

// ---- two SIDs: six voices, the second chip at $D420 --------------------------

function twoSidTune() {
  const tune = richTune();
  // the second SID plays the same material shifted, so both filters sweep independently
  tune.patterns = tune.patterns.map((p, k) => {
    const second = emptyPattern();
    p.forEach((col, v) => col.forEach((c, r) => {
      if (r + 3 < 32) second[v][r + 3] = c.note != null ? { ...c, note: c.note + 5, inst: (c.inst + k + 1) % 5 } : { ...c };
    }));
    return p.concat(second);
  });
  return tune;
}

function runTwoSidPlayer(api, frames, sid2 = 0xD420) {
  const { mem, labels } = assemble(api._sidExportAsmPlayable());
  const c = cpu(mem);
  c.call(labels.sid_init);
  const out = [];
  for (let k = 0; k < frames; k++) {
    c.call(labels.sid_frame);
    out.push(Array.from(mem.slice(0xD400, 0xD419)).concat(Array.from(mem.slice(sid2, sid2 + 25))));
  }
  return { out, labels, mem };
}

test("two SIDs: the exported player and the JS engine write identical registers on both chips", () => {
  const api = sandbox(twoSidTune());
  const frames = 32 * 4 * 6 + 50;
  const cpuOut = runTwoSidPlayer(api, frames).out;
  const engOut = runEngine(api, frames);
  assert.equal(engOut[0].length, 50);
  for (let k = 0; k < frames; k++) assert.deepEqual(cpuOut[k], engOut[k], `SID registers differ at frame ${k}`);
  assert.ok(engOut.some((r) => r[25 + 4] & 1), "the second SID's voice 1 sounds");
  assert.ok(engOut.some((r) => r[25 + 0x18] & 15), "the second SID's volume is set");
  const cut = (at) => new Set(engOut.map((r) => (r[at + 0x15] & 7) | (r[at + 0x16] << 3))).size;
  assert.ok(cut(0) > 20 && cut(25) > 20, "both cutoffs sweep");
});

test("two SIDs: the second chip plays at any address a PSID header can state", () => {
  const frames = 32 * 2 * 6 + 20;
  for (const sid2 of [0xD440, 0xD4E0, 0xD500, 0xD7E0, 0xDE00, 0xDFE0]) {
    const api = sandbox({ ...twoSidTune(), sid2 });
    const { out, mem } = runTwoSidPlayer(api, frames, sid2);
    assert.deepEqual(out, runEngine(api, frames), `$${sid2.toString(16)}`);
    assert.ok(out.some((r) => r[25 + 0x18] & 15), `$${sid2.toString(16)} gets the second SID's volume`);
    assert.equal(mem[0xD438], 0, `$${sid2.toString(16)}: nothing is left at the default address`);
    assert.match(api._sidExportAsmPlayable(), new RegExp("second SID at \\$" + sid2.toString(16).toUpperCase()));
  }
});

test("two SIDs: filter, volume and routing belong to the chip of the voice", () => {
  const p = emptyPattern().concat(emptyPattern());
  p[1][0] = { note: 48, inst: 0, fx: null, fxval: 0 };
  p[5][0] = { note: 50, inst: 1, fx: null, fxval: 0 };
  const insts = [
    { pul: true, filt: true, lp: true, cut: 300, cutEnd: 300, res: 3, vol: 9 },
    { saw: true, pul: false, filt: true, hp: true, cut: 1200, cutEnd: 1200, res: 7, vol: 12 },
  ];
  const api = sandbox({ insts, patterns: [p], song: [0], speed: 6 });
  const r = runEngine(api, 8)[7];
  assert.deepEqual(runTwoSidPlayer(api, 8).out[7], r);
  const chip = (at) => ({ route: r[at + 0x17] & 7, res: r[at + 0x17] >> 4, mode: r[at + 0x18] & 0x70, vol: r[at + 0x18] & 15 });
  assert.deepEqual(chip(0), { route: 2, res: 3, mode: 0x10, vol: 9 });
  assert.deepEqual(chip(25), { route: 4, res: 7, mode: 0x40, vol: 12 });
  assert.ok((r[11] & 0x40) && (r[25 + 18] & 0x20), "voice 2 pulse on SID 1, voice 6 saw on SID 2");
});

test("two SIDs: every voice triggers, each on its own register base", () => {
  const api = sandbox(twoSidTune());
  const e = api._sidEngineNew(api._sidTuneData());
  assert.equal(e.trig.length, 6);
  assert.deepEqual(Array.from(e.base), [0, 7, 14, 25, 32, 39]);
  const seen = new Set();
  for (let k = 0; k < 200; k++) { api._sidEngFrame(e); e.trig.forEach((on, v) => { if (on) seen.add(v); }); }
  [0, 1, 2, 3, 4, 5].forEach((v) => assert.ok(seen.has(v), `voice ${v} triggered`));
});

test("two SIDs: the player code fits the reserved size and sid_init clears all the state", () => {
  const api = sandbox(twoSidTune());
  const { labels, mem } = runTwoSidPlayer(api, 1);
  const max = Number(/const _SID_PLAYER_CODE_MAX = (0x[0-9A-Fa-f]+);/.exec(appJs)[1]) +
    Number(/const _SID_PLAYER_2SID_EXTRA = (0x[0-9A-Fa-f]+);/.exec(appJs)[1]);
  // the code ends where the data starts, or at the state when the data moved below $A000
  const end = labels.sid_vbase >= 0xC000 ? labels.sid_vbase : labels.sid_state;
  assert.ok(end - 0xC000 <= max, `player code ${end - 0xC000} > ${max}`);
  const size = labels.sid_m1 + 1 - labels.sid_state;
  assert.ok(size > 128, "more state than a BPL loop can clear");
  mem.fill(0x55, labels.sid_state, labels.sid_m1 + 1);
  cpu(mem).call(labels.sid_init);
  const expected = new Array(size).fill(0);
  expected[labels.sid_fown - labels.sid_state] = 0xFF;
  expected[labels.sid_fown2 - labels.sid_state] = 0xFF;
  // both chips start on the tune's volume
  expected[labels.sid_vol - labels.sid_state] = 15;
  expected[labels.sid_vol2 - labels.sid_state] = 15;
  assert.deepEqual(Array.from(mem.slice(labels.sid_state, labels.sid_m1 + 1)), expected);
});

test("two SIDs: a long tune stays out of I/O and ROM and keeps playing like the engine", () => {
  const p = (k) => [0, 1, 2, 3, 4, 5].map((v) => Array.from({ length: 32 }, (_, r) =>
    ({ note: r % 4 ? null : 24 + ((k + v + r) % 40), inst: v & 1, fx: null, fxval: 0 })));
  const patterns = Array.from({ length: 60 }, (_, k) => p(k));
  const api = sandbox({ insts: [{ pul: true }, { saw: true, pul: false }], patterns: patterns.slice(0, 46), song: patterns.slice(0, 46).map((_, k) => k), speed: 2 });
  const frames = 32 * 2 * 47;
  const { out, labels } = runTwoSidPlayer(api, frames);
  const addrs = Object.entries(labels).filter(([k]) => k.startsWith("sid_")).map(([, a]) => a);
  assert.ok(addrs.every((a) => a < 0xA000 || (a >= 0xC000 && a < 0xD000)), "no label in BASIC ROM, I/O or KERNAL");
  assert.ok(labels.sid_v0_notes >= 0x0900, "the data does not run into the start stub");
  assert.deepEqual(out, runEngine(api, frames));

  const over = sandbox({ insts: [{ pul: true }], patterns, song: [0], speed: 2 });
  assert.match(over._sidExportAsmPlayable(), /only the first 46 patterns are exported \(60 present\)/);
});

test("a one-SID tune exports without any second-SID code", () => {
  const asm = sandbox(richTune())._sidExportAsmPlayable();
  assert.doesNotMatch(asm, /\$D42|\$D43|sid_filter2|sid_v3_|\(\$50\)/);
});

test("the song volume: the chip starts on it, and only instruments with their own Vol change it", () => {
  const p = emptyPattern();
  p[0][0] = { note: 48, inst: 0, fx: null, fxval: 0 };   // song volume
  p[1][8] = { note: 52, inst: 1, fx: null, fxval: 0 };   // its own Vol 9
  p[2][16] = { note: 55, inst: 0, fx: null, fxval: 0 };  // the chip keeps 9
  const insts = [{ pul: true, songVol: true, vol: 3 }, { saw: true, pul: false, vol: 9 }];
  for (const ntsc of [false, true]) {
    const api = sandbox({ insts, patterns: [p], song: [0], speed: 2, vol: 6, ntsc });
    const frames = 32 * 2 + 4;
    const cpuOut = runPlayer(api, frames).out;
    assert.deepEqual(cpuOut, runEngine(api, frames), ntsc ? "NTSC" : "PAL");
    assert.deepEqual([0, 15, 17, 40].map((k) => cpuOut[k][0x18] & 15), [6, 6, 9, 9]);
  }
});

test("NTSC: the note table is for the NTSC clock, and the player says so", () => {
  const p = emptyPattern();
  p[0][0] = { note: 57, inst: 0, fx: null, fxval: 0 };
  const pal = sandbox({ insts: [{ pul: true }], patterns: [p], song: [0], speed: 6 });
  const ntsc = sandbox({ insts: [{ pul: true }], patterns: [p], song: [0], speed: 6, ntsc: true });
  const freq = (api) => { const o = runPlayer(api, 12).out[11]; return o[0] | (o[1] << 8); };
  assert.equal(freq(pal), Math.round(440 * 16777216 / 985248));
  assert.equal(freq(ntsc), Math.round(440 * 16777216 / 1022730));
  assert.match(ntsc._sidExportAsmPlayable(), /NTSC 60 Hz IRQ-driven/);
  assert.match(pal._sidExportAsmPlayable(), /PAL 50 Hz IRQ-driven/);
});
