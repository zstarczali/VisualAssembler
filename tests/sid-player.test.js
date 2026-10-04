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

const FNS = ["_sidNewInst", "_sidInstNorm", "_sidInstCtrl", "_sidWaveByte", "_sidFreqTables", "_sidTuneData", "_sidCellBytes",
  "_sidEngineNew", "_sidEngTab", "_sidEngNoteOn", "_sidEngRow", "_sidEngHr", "_sidEngUpdate", "_sidEngFrame",
  "_sidExportAsmPlayable", "_sidInstExtBytes", "_sidReadInstExt"];

function sandbox(state) {
  const ctx = { Math, TextEncoder, TextDecoder, Uint8Array, t: (k) => k };
  vm.createContext(ctx);
  vm.runInContext(`${constLine("_SID_ROWS")}
    var _sidInsts = null, _sidPatterns = null, _sidSong = null, _sidSpeed = 6;
    ${FNS.map(fnSource).join("\n")}
    this.api = { set(s) { _sidInsts = s.insts; _sidPatterns = s.patterns; _sidSong = s.song; _sidSpeed = s.speed; },
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
