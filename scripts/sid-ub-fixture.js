#!/usr/bin/env node
// Writes the UltimateBasic `tune` cross-check fixture: a tune exported by the
// SID editor's UB exporter and the SID registers the JS engine (= the VA
// player) writes every frame. The UltimateBasic test suite runs its own
// player on the same tune and compares the registers frame by frame.
//   node scripts/sid-ub-fixture.js F:\Development\UltimateBasic\tests\fixtures
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const outDir = process.argv[2];
if (!outDir) { console.error("usage: node scripts/sid-ub-fixture.js <UltimateBasic tests/fixtures dir>"); process.exit(1); }
const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");
const fnSource = (name) => {
  const start = appJs.indexOf(`function ${name}(`);
  let depth = 0, seen = false;
  for (let i = start; i < appJs.length; i++) {
    if (appJs[i] === "{") { depth++; seen = true; }
    else if (appJs[i] === "}" && seen && --depth === 0) return appJs.slice(start, i + 1);
  }
  throw new Error(name);
};
const FNS = ["_sidNewInst", "_sidInstNorm", "_sidInstCtrl", "_sidWaveByte", "_sidFreqTables", "_sidTuneData", "_sidCellBytes",
  "_sidEngineNew", "_sidEngTab", "_sidEngNoteOn", "_sidEngRow", "_sidEngHr", "_sidEngUpdate", "_sidEngFrame",
  "_sidExportUbBlock", "_sidCellText", "_sidFxText", "_sidNoteName"];
const ctx = { Math, t: (k) => k };
vm.createContext(ctx);
vm.runInContext(`const _SID_ROWS = 32;
  const _SID_NOTE_NAMES = ["C-","C#","D-","D#","E-","F-","F#","G-","G#","A-","A#","B-"];
  var _sidInsts, _sidPatterns, _sidSong, _sidSpeed;
  ${FNS.map(fnSource).join("\n")}
  this.api = { set(s) { _sidInsts = s.insts; _sidPatterns = s.patterns; _sidSong = s.song; _sidSpeed = s.speed; }, ${FNS.join(", ")} };`, ctx);
const api = ctx.api;

const pat = () => [0, 1, 2].map(() => Array.from({ length: 32 }, () => ({ note: null, inst: 0, fx: null, fxval: 0 })));
const put = (p, v, r, note, inst, fx, fxval) => { p[v][r] = { note, inst, fx: fx || null, fxval: fxval || 0 }; };
const insts = [
  { name: "Lead", saw: true, a: 1, d: 9, s: 10, r: 6, vol: 15, vibDelay: 6, vibSpeed: 3, vibDepth: 9, gateTimer: 2, hr: true, firstWave: 0x09 },
  { name: "Pad", pul: true, pw: 600, pwmSpeed: 40, pwmMin: 300, pwmMax: 3700, a: 4, d: 4, s: 12, r: 9, vol: 14,
    lp: true, res: 13, filt: true, cut: 200, cutEnd: 1500, cutSpeed: 23, cutPing: true },
  { name: "Arp", pul: true, pw: 2048, a: 0, d: 6, s: 8, r: 3, vol: 15, tableSpeed: 2, tableLoop: 0,
    table: [{ w: 0, n: 0 }, { w: 0, n: 4 }, { w: 0, n: 7 }, { w: 0x21, n: 12 }] },
  { name: "Drum", noi: true, a: 0, d: 8, s: 0, r: 8, vol: 15, hp: true, filt: true, off3: true, cut: 1800, cutEnd: 300, cutSpeed: 90, res: 5,
    table: [{ w: 0x81, n: 60, abs: true }, { w: 0x41, n: 30, abs: true }, { w: 0x41, n: -12 }, { w: 0x80, n: 0 }], tableLoop: -1 },
  { name: "Ring", tri: true, ring: true, sync: true, a: 2, d: 5, s: 9, r: 5, vol: 13 }
];
const p0 = pat(), p1 = pat();
put(p0, 0, 0, 48, 0); put(p0, 0, 4, 50, 0, "V", 0x23); put(p0, 0, 5, null, 0, "V", 0x23); put(p0, 0, 8, 52, 0);
put(p0, 0, 12, null, 0, "U", 0x40); put(p0, 0, 13, null, 0, "U", 0x40); put(p0, 0, 16, 47, 4); put(p0, 0, 20, null, 0, "C");
put(p0, 0, 24, 55, 0, "D", 0x30); put(p0, 0, 28, 57, 3);
put(p0, 1, 0, 36, 1); put(p0, 1, 10, 31, 1); put(p0, 1, 20, 43, 2); put(p0, 1, 26, null, 0, "F", 4);
put(p0, 2, 2, 24, 3); put(p0, 2, 6, 60, 2); put(p0, 2, 14, 24, 3); put(p0, 2, 22, 70, 2); put(p0, 2, 30, 24, 3);
put(p1, 0, 0, 60, 2); put(p1, 0, 3, 62, 0); put(p1, 0, 31, 64, 0);
put(p1, 1, 1, 40, 1); put(p1, 1, 2, null, 0, "F", 7); put(p1, 1, 16, 45, 4);
put(p1, 2, 0, 20, 3); put(p1, 2, 8, 22, 1);
api.set({ insts, patterns: [p0, p1], song: [0, 1, 0, 1], speed: 5 });

const frames = 900;
const e = api._sidEngineNew(api._sidTuneData());
const trace = [];
for (let k = 0; k < frames; k++) trace.push(Array.from(api._sidEngFrame(e)).map((b) => b.toString(16).toUpperCase().padStart(2, "0")).join(" "));
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "sid_tune.ub"), api._sidExportUbBlock() + "\n");
fs.writeFileSync(path.join(outDir, "sid_tune_trace.txt"), trace.join("\n") + "\n");
console.log(`wrote sid_tune.ub and ${frames} frames of sid_tune_trace.txt to ${outDir}`);
