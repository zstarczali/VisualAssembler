const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

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
const constLine = (name) => appJs.match(new RegExp(`const ${name} = [^;]+;`))[0];

function load() {
  const ctx = { Math, Array };
  vm.createContext(ctx);
  vm.runInContext(`${constLine("_SID_ATK")} ${constLine("_SID_DCR")} ${constLine("_SID_ANA_DB")}
    var _sidWaPlay = null, _sidAna = { env: [], rowFrame: -1, rowAt: 0, last: null };
    ${["_sidVizBandEdges", "_sidAnaEnvStep", "_sidAnaFilterGain", "_sidAnaVoiceLevels", "_sidClockHz", "_sidIsNtsc", "_sidAnaAdvance", "_sidAnaRow"].map(fnSource).join("\n")}
    this.api = { step: _sidAnaEnvStep, levels: _sidAnaVoiceLevels, edges: _sidVizBandEdges, advance: _sidAnaAdvance, row: _sidAnaRow,
      setPlay(w) { _sidWaPlay = w; }, state() { return _sidAna; } };`, ctx);
  ctx.api.now = 0;
  return ctx.api;
}

// voice `bit` of the chip at `at`: 440 Hz with control value ctl, volume 15
function regsFor(at, bit, ctl, extra = {}) {
  const regs = new Uint8Array(50);
  const fr = Math.round(440 * 16777216 / 985248), b = at + bit * 7;
  regs[b] = fr & 0xFF; regs[b + 1] = fr >> 8;
  regs[b + 2] = 0; regs[b + 3] = 8;
  regs[b + 4] = ctl;
  regs[at + 0x18] = 0x0F;
  Object.keys(extra).forEach((k) => { regs[at + Number(k)] = extra[k]; });
  return regs;
}

const band = (api, hz) => {
  const e = api.edges(16, 44100);
  let k = 0;
  while (k < 15 && hz >= e[k + 1]) k++;
  return k;
};

test("a sawtooth lights its fundamental most and falls with the harmonics", () => {
  const api = load();
  const lv = Array.from(api.levels(regsFor(0, 0, 0x21), 0, 0, 1, 16));
  const k = band(api, 440);
  assert.equal(lv[k], 1);
  assert.ok(lv.slice(0, k).every((x) => x === 0), "nothing below the fundamental");
  assert.ok(lv[band(api, 3520)] > 0 && lv[band(api, 3520)] < lv[k]);
});

test("a triangle has far weaker harmonics than a sawtooth, noise spreads wide", () => {
  const api = load();
  const hi = band(api, 3960);
  const tri = api.levels(regsFor(0, 0, 0x11), 0, 0, 1, 16);
  const saw = api.levels(regsFor(0, 0, 0x21), 0, 0, 1, 16);
  assert.ok(tri[hi] < saw[hi]);
  const noise = Array.from(api.levels(regsFor(0, 0, 0x81), 0, 0, 1, 16));
  assert.ok(noise.filter((x) => x > 0).length >= 10);
});

test("the pulse width shapes the harmonics", () => {
  const api = load();
  const square = api.levels(regsFor(0, 0, 0x41), 0, 0, 1, 16);
  assert.equal(square[band(api, 440)], 1);
  const thin = regsFor(0, 0, 0x41);
  thin[2] = 0x00; thin[3] = 0x00; // 0 % duty: no sine component
  assert.ok(Array.from(api.levels(thin, 0, 0, 1, 16)).every((x) => x === 0));
});

test("silent cases light nothing", () => {
  const api = load();
  const none = (l) => assert.ok(Array.from(l).every((x) => x === 0));
  none(api.levels(regsFor(0, 0, 0x00), 0, 0, 1, 16)); // no waveform
  none(api.levels(regsFor(0, 0, 0x29), 0, 0, 1, 16)); // test bit
  none(api.levels(regsFor(0, 0, 0x21), 0, 0, 0, 16)); // envelope at zero
  none(api.levels(regsFor(0, 0, 0x21, { 0x18: 0 }), 0, 0, 1, 16)); // volume 0
  none(api.levels(regsFor(0, 2, 0x21, { 0x18: 0x8F }), 0, 2, 1, 16)); // 3 OFF
  none(api.levels(regsFor(0, 0, 0x21, { 0x17: 1 }), 0, 0, 1, 16)); // routed with no filter mode
});

test("a low-pass filter cuts the harmonics of a routed voice only", () => {
  const api = load();
  const filt = { 0x16: 40, 0x17: 1, 0x18: 0x1F }; // cutoff about 1.9 kHz
  const hi = band(api, 11000);
  const routed = api.levels(regsFor(0, 0, 0x21, filt), 0, 0, 1, 16);
  const plain = api.levels(regsFor(0, 0, 0x21, { ...filt, 0x17: 0 }), 0, 0, 1, 16);
  assert.ok(routed[hi] < plain[hi]);
});

test("voices read their own registers, on the second SID too", () => {
  const api = load();
  const regs = regsFor(25, 1, 0x21);
  regs[0x18] = 0x0F;
  assert.equal(api.levels(regs, 25, 1, 1, 16)[band(api, 440)], 1);
  assert.ok(Array.from(api.levels(regs, 0, 1, 1, 16)).every((x) => x === 0));
  assert.ok(Array.from(api.levels(regs, 25, 0, 1, 16)).every((x) => x === 0));
});

test("the envelope attacks, settles on the sustain and releases", () => {
  const api = load();
  const s = { env: 0, st: 0, gate: 0 };
  const regs = new Uint8Array(25);
  regs[4] = 0x21; regs[5] = 0x00; regs[6] = 0x80; // attack 2 ms, decay 6 ms, sustain 8
  assert.equal(api.step(s, regs, 0, true), 1);
  for (let k = 0; k < 10; k++) api.step(s, regs, 0, false);
  assert.ok(Math.abs(s.env - 8 / 15) < 0.01);
  regs[4] = 0x20;
  for (let k = 0; k < 10; k++) api.step(s, regs, 0, false);
  assert.ok(s.env < 0.01);
  regs[4] = 0x21; regs[5] = 0xA0; // slow attack
  s.env = 0;
  api.step(s, regs, 0, false);
  assert.ok(s.env > 0 && s.env < 0.1);
});

test("frames count only once they have sounded", () => {
  const api = load();
  const realNow = 1000;
  const fr = (frame, ctl) => { const regs = new Uint8Array(25); regs[4] = ctl; regs[6] = 0xF0; return { frame, regs, trig: [frame === 0, false, false] }; };
  const snap = [fr(0, 0x21), fr(1, 0x21), fr(2, 0x21), fr(3, 0x21)];
  api.setPlay({ e: { snap } });
  api.advance(realNow);
  assert.equal(snap.length, 4, "nothing before the first row event");
  const st = api.state();
  st.rowFrame = 0; st.rowAt = realNow;
  api.advance(realNow);
  assert.equal(snap.length, 3, "frame 0 at the row event");
  assert.ok(st.env[0].env > 0);
  api.advance(realNow + 45);
  assert.equal(snap.length, 1, "20 ms a frame");
  assert.equal(st.last[4], 0x21);
});

test("the engine records frames only while asked to", () => {
  const ctx = { Math, Array, Uint8Array, t: (k) => k };
  vm.createContext(ctx);
  vm.runInContext(`const _SID_ROWS = 32;
    ${["_sidNewInst", "_sidInstNorm", "_sidInstCtrl", "_sidFreqTables", "_sidClockHz", "_sidIsNtsc", "_sidVol", "_sidFps", "_sidTuneData", "_sidCellBytes", "_sidEngineNew", "_sidEngTab", "_sidEngNoteOn", "_sidEngRow", "_sidEngHr", "_sidEngUpdate", "_sidEngFrame"].map(fnSource).join("\n")}
    this.make = () => _sidEngineNew(_sidTuneData({ insts: [{}], patterns: [[0,1,2].map(() => Array.from({ length: 32 }, (_, r) => ({ note: r ? null : 48, inst: 0, fx: null, fxval: 0 })))], song: [0], speed: 1 }));
    this.frame = _sidEngFrame;`, ctx);
  const e = ctx.make();
  ctx.frame(e);
  assert.equal(e.snap, undefined);
  e.snap = [];
  ctx.frame(e); ctx.frame(e);
  assert.deepEqual(Array.from(e.snap, (s) => s.frame), [1, 2]);
  assert.notEqual(e.snap[0].regs, e.regs, "a copy of the registers");
  assert.equal(e.snap[0].trig.length, 3);
});
