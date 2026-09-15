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
  let depth = 0, end = -1, seenBrace = false;
  for (let i = start; i < appJs.length; i++) {
    const ch = appJs[i];
    if (ch === "{") { depth += 1; seenBrace = true; }
    else if (ch === "}") { depth -= 1; if (seenBrace && depth === 0) { end = i + 1; break; } }
  }
  assert.notStrictEqual(end, -1, `Could not parse function ${name}`);
  return appJs.slice(start, end);
}

function extractConstLine(name) {
  const re = new RegExp(`const ${name} = [^;]+;`);
  const m = appJs.match(re);
  assert.notStrictEqual(m, null, `Missing const ${name}`);
  return m[0];
}

function loadFunctions(names, extraContext = {}, extraSource = "") {
  // Preserve accessor (getter/setter) properties instead of flattening them
  // into plain data properties, the way object spread would.
  const context = {};
  Object.defineProperties(context, Object.getOwnPropertyDescriptors(extraContext));
  vm.createContext(context);
  vm.runInContext(`
    ${extraSource}
    ${names.map((n) => `${extractFunctionSource(n)}\nthis["${n}"] = ${n};`).join("\n")}
  `, context);
  return context;
}

// ---- Cell text parsing --------------------------------------------------

function loadParseSandbox() {
  return loadFunctions(
    ["_sidParseCellEntry", "_sidFxText", "_sidCellText", "_sidNoteName"],
    {},
    `${extractConstLine("_SID_FX_CODES")}\n${extractConstLine("_SID_FX_NAMES")}\nconst _SID_NOTE_NAMES = ["C-","C#","D-","D#","E-","F-","F#","G-","G#","A-","A#","B-"];`
  );
}

test("parse: note + instrument, no effect (unchanged legacy shape)", () => {
  const ctx = loadParseSandbox();
  assert.deepEqual({ ...ctx._sidParseCellEntry("C-4 01") }, { note: 48, inst: 1, fx: null, fxval: 0 });
});

test("parse: note + instrument + vibrato", () => {
  const ctx = loadParseSandbox();
  assert.deepEqual({ ...ctx._sidParseCellEntry("C-4 01 V24") }, { note: 48, inst: 1, fx: "V", fxval: 0x24 });
});

test("parse: note + effect with instrument omitted (caller keeps the prior instrument)", () => {
  const ctx = loadParseSandbox();
  const parsed = ctx._sidParseCellEntry("C-4 V24");
  assert.equal(parsed.note, 48);
  assert.equal(parsed.inst, undefined);
  assert.equal(parsed.fx, "V");
  assert.equal(parsed.fxval, 0x24);
});

test("parse: effect only, no note (e.g. a mid-pattern speed change)", () => {
  const ctx = loadParseSandbox();
  const parsed = ctx._sidParseCellEntry("F06");
  assert.equal(parsed.note, null);
  assert.equal(parsed.fx, "F");
  assert.equal(parsed.fxval, 6);
});

test("parse: bare note-cut effect needs no hex value", () => {
  const ctx = loadParseSandbox();
  const parsed = ctx._sidParseCellEntry("C");
  assert.equal(parsed.fx, "C");
  assert.equal(parsed.fxval, 0);
});

test("parse: '...' and empty input both clear the whole cell", () => {
  const ctx = loadParseSandbox();
  assert.deepEqual({ ...ctx._sidParseCellEntry("...") }, { clear: true });
  assert.deepEqual({ ...ctx._sidParseCellEntry("") }, { clear: true });
});

test("parse: garbage input is an error", () => {
  const ctx = loadParseSandbox();
  assert.deepEqual({ ...ctx._sidParseCellEntry("zzz") }, { error: true });
});

test("cell text renders the effect column alongside note+instrument", () => {
  const ctx = loadParseSandbox();
  assert.equal(ctx._sidCellText({ note: 40, inst: 1, fx: "V", fxval: 0x24 }), "E-3 01 V24");
  assert.equal(ctx._sidCellText({ note: null, inst: 0, fx: "F", fxval: 6 }), "... .. F06");
  assert.equal(ctx._sidCellText({ note: null, inst: 0, fx: null, fxval: 0 }), "... .. ...");
});

// ---- Serialize / deserialize round trip, including backward compat -----

function loadSerdeSandbox() {
  return loadFunctions(
    ["_sidInstBytes", "_sidWaveByte", "_sidNewInst", "_sidNewPattern", "_sidSerialize", "_sidDeserialize",
     "_sidSyncPlayModeSel", "_sidBuildInstSel", "_sidLoadInstUI", "_sidBuildPatSel", "_sidBuildSongList",
     "_sidBuildTracker", "_sidStop", "_sidUpdatePauseButton", "_sidCurInst"],
    {
      Uint8Array, Math, String, Array,
      document: { getElementById: (id) => (id === "sid-inst-name" ? {} : null), querySelectorAll: () => [] },
      t: (k) => k,
      tf: () => "",
      _webSidPause: () => {},
      _sidDrawADSR: () => {},
      _sidSong: undefined,
      _sidSongPos: 0,
      _sidSongPlayPos: 0,
      _sidTimer: null,
      _sidPaused: false,
      _sidPlaybackUsingWebSid: false,
    },
    `${extractConstLine("_SID_ROWS")}\n${extractConstLine("_SID_FX_CODES")}\n${extractConstLine("_SID_FX_NAMES")}`
  );
}

test("serialize/deserialize round-trips per-cell effect data", () => {
  const ctx = loadSerdeSandbox();
  ctx._sidInsts = [ctx._sidNewInst("Lead")];
  ctx._sidPatterns = [ctx._sidNewPattern()];
  ctx._sidPatterns[0][0][3] = { note: 40, inst: 0, fx: "V", fxval: 0x24 };
  ctx._sidPatterns[0][1][5] = { note: null, inst: 0, fx: "F", fxval: 4 };
  ctx._sidPatterns[0][2][7] = { note: null, inst: 0, fx: "C", fxval: 0 };
  ctx._sidSong = [0];

  const bytes = ctx._sidSerialize();
  assert.equal(bytes[0], 0xFE, "new saves carry the versioned-format marker");
  ctx._sidPatterns = null; ctx._sidInsts = null; ctx._sidSong = null;
  ctx._sidDeserialize(bytes);

  assert.deepEqual({ ...ctx._sidPatterns[0][0][3] }, { note: 40, inst: 0, fx: "V", fxval: 0x24 });
  assert.deepEqual({ ...ctx._sidPatterns[0][1][5] }, { note: null, inst: 0, fx: "F", fxval: 4 });
  assert.deepEqual({ ...ctx._sidPatterns[0][2][7] }, { note: null, inst: 0, fx: "C", fxval: 0 });
});

test("deserialize reads pre-effect-column saves (no marker, 2 bytes/cell) with no effects", () => {
  const ctx = loadSerdeSandbox();
  ctx._sidInsts = [ctx._sidNewInst("Lead")];
  ctx._sidPatterns = [ctx._sidNewPattern()];
  ctx._sidPatterns[0][0][3] = { note: 40, inst: 0, fx: null, fxval: 0 };

  // Build a legacy byte array by hand: [ni][np] + 9 bytes/inst + 2 bytes/cell,
  // with no leading 0xFE marker and no trailing song-list bytes either.
  const legacy = [1, 1];
  ctx._sidInstBytes(ctx._sidInsts[0]).forEach((b) => legacy.push(b & 0xFF));
  for (let v = 0; v < 3; v++) for (let r = 0; r < 32; r++) {
    const c = ctx._sidPatterns[0][v][r];
    legacy.push(c.note == null ? 0 : (c.note + 1) & 0xFF);
    legacy.push(c.inst & 0xFF);
  }

  ctx._sidPatterns = null; ctx._sidInsts = null; ctx._sidSong = null;
  ctx._sidDeserialize(Uint8Array.from(legacy));

  assert.equal(ctx._sidPatterns[0][0][3].note, 40);
  assert.equal(ctx._sidPatterns[0][0][3].fx, null, "legacy saves have no effect data");
  assert.equal(ctx._sidPatterns[0][1][0].fx, null);
});

// ---- Exported ASM player -------------------------------------------------

function loadExportSandbox() {
  return loadFunctions(
    ["_sidExportAsmPlayable", "_sidWaveByte"],
    { Math, String, Array },
    `${extractConstLine("_SID_ROWS")}\n${extractConstLine("_SID_FX_CODES")}\n${extractConstLine("_SID_FX_NAMES")}`
  );
}

function makePattern(rows) {
  const pat = [[], [], []];
  for (let v = 0; v < 3; v++) for (let r = 0; r < 32; r++) pat[v].push({ note: null, inst: 0, fx: null, fxval: 0 });
  (rows || []).forEach(([v, r, note, fx, fxval]) => { pat[v][r] = { note, inst: 0, fx: fx || null, fxval: fxval || 0 }; });
  return pat;
}

function collectSidLabels(asmText) {
  const defined = new Set();
  const referenced = new Set();
  asmText.split("\n").forEach((raw) => {
    const line = raw.trim();
    if (!line || line.startsWith(";")) return;
    const labelMatch = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*):$/);
    if (labelMatch) { defined.add(labelMatch[1]); return; }
    (line.match(/\bsid_[a-zA-Z0-9_]+\b/g) || []).forEach((id) => referenced.add(id));
  });
  return { defined, referenced };
}

test("exported ASM: every referenced sid_* label is defined (effect routines included)", () => {
  const ctx = loadExportSandbox();
  ctx._sidSpeed = 6;
  ctx._sidInsts = [{ tri:false,saw:false,pul:true,noi:false,pw:2048,a:2,d:8,s:6,r:4,lp:false,bp:false,hp:false,cut:1400,res:0,vol:15 }];
  ctx._sidPatterns = [makePattern([[0, 0, 40, "V", 0x24], [1, 5, 50, "U", 8], [2, 10, null, "C", 0]])];
  ctx._sidSong = [0];

  const asm = ctx._sidExportAsmPlayable();
  const { defined, referenced } = collectSidLabels(asm);
  const missing = [...referenced].filter((id) => id.match(/^sid_[a-z_0-9]+$/) && !defined.has(id) &&
    !id.startsWith("sid_v") && id !== "sid_instruments" && id !== "sid_freq_lo" && id !== "sid_freq_hi" && id !== "sid_order");
  assert.deepEqual(missing, [], "every branch/jump/subroutine label used must be defined somewhere in the output");

  ["sid_vib_v0", "sid_vib_v1", "sid_vib_v2",
   "sid_slideup_v0", "sid_slideup_v1", "sid_slideup_v2",
   "sid_slidedown_v0", "sid_slidedown_v1", "sid_slidedown_v2"]
    .forEach((label) => assert.ok(defined.has(label), `expected effect routine ${label} to be defined`));

  ["sid_v0_fx", "sid_v0_fxval", "sid_v1_fx", "sid_v1_fxval", "sid_v2_fx", "sid_v2_fxval"]
    .forEach((label) => assert.ok(defined.has(label), `expected effect table label ${label} to be defined`));
});

test("exported ASM: fx/fxval tables carry the right effect codes per row", () => {
  const ctx = loadExportSandbox();
  ctx._sidSpeed = 6;
  ctx._sidInsts = [{ tri:false,saw:false,pul:true,noi:false,pw:2048,a:2,d:8,s:6,r:4,lp:false,bp:false,hp:false,cut:1400,res:0,vol:15 }];
  // Row 0 on voice 0: vibrato (code 1, value 0x24). Row 1 on voice 1: note
  // cut (code 4). Everything else on those voices/rows is "no effect" (0).
  ctx._sidPatterns = [makePattern([[0, 0, 40, "V", 0x24], [1, 1, null, "C", 0]])];
  ctx._sidSong = [0];

  const asm = ctx._sidExportAsmPlayable();
  const fxBlockV0 = asm.slice(asm.indexOf("sid_v0_fx:"), asm.indexOf("sid_v0_fxval:"));
  const fxvalBlockV0 = asm.slice(asm.indexOf("sid_v0_fxval:"), asm.indexOf("sid_v1_notes:"));
  const fxBytesV0 = (fxBlockV0.match(/\$[0-9A-F]{2}/g) || []).map((s) => parseInt(s.slice(1), 16));
  const fxvalBytesV0 = (fxvalBlockV0.match(/\$[0-9A-F]{2}/g) || []).map((s) => parseInt(s.slice(1), 16));
  assert.equal(fxBytesV0[0], 1, "row 0 voice 0 carries the vibrato code (1)");
  assert.equal(fxvalBytesV0[0], 0x24);
  assert.equal(fxBytesV0[1], 0, "row 1 voice 0 has no effect");

  const fxBlockV1 = asm.slice(asm.indexOf("sid_v1_fx:"), asm.indexOf("sid_v1_fxval:"));
  const fxBytesV1 = (fxBlockV1.match(/\$[0-9A-F]{2}/g) || []).map((s) => parseInt(s.slice(1), 16));
  assert.equal(fxBytesV1[1], 4, "row 1 voice 1 carries the note-cut code (4)");
});

test("exported ASM: no effects at all still produces valid, complete fx tables of zeros", () => {
  const ctx = loadExportSandbox();
  ctx._sidSpeed = 6;
  ctx._sidInsts = [{ tri:false,saw:false,pul:true,noi:false,pw:2048,a:2,d:8,s:6,r:4,lp:false,bp:false,hp:false,cut:1400,res:0,vol:15 }];
  ctx._sidPatterns = [makePattern([[0, 0, 40]])];
  ctx._sidSong = [0];
  const asm = ctx._sidExportAsmPlayable();
  const fxBlockV0 = asm.slice(asm.indexOf("sid_v0_fx:"), asm.indexOf("sid_v0_fxval:"));
  const fxBytes = (fxBlockV0.match(/\$[0-9A-F]{2}/g) || []).map((s) => parseInt(s.slice(1), 16));
  assert.equal(fxBytes.length, 32);
  assert.ok(fxBytes.every((b) => b === 0));
});
