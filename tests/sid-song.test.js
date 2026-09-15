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
  // Object spread would read each accessor once via [[Get]] and redefine it
  // as a plain data property, silently dropping the setter — copy property
  // descriptors instead so getter/setter pairs in extraContext keep working
  // as live accessors inside the vm context.
  const context = {};
  Object.defineProperties(context, Object.getOwnPropertyDescriptors(extraContext));
  vm.createContext(context);
  vm.runInContext(`
    ${extraSource}
    ${names.map((n) => `${extractFunctionSource(n)}\nthis["${n}"] = ${n};`).join("\n")}
  `, context);
  return context;
}

// ---- Song/order list editing (pure-ish; DOM is stubbed to a no-op) ------

function loadSongSandbox(initial) {
  const state = {
    _sidSong: initial.song ? initial.song.slice() : [0],
    _sidSongPos: initial.pos || 0,
    _sidPat: initial.pat || 0,
    _sidTimer: null,
    _sidPaused: false,
    _sidPlaybackUsingWebSid: false,
    _sidSongPlayPos: 0,
  };
  const ctx = loadFunctions(
    ["_sidSongInsert", "_sidSongRemove", "_sidSongMove", "_sidBuildSongList"],
    {
      document: { getElementById: () => null }, // makes _sidBuildSongList a no-op
      tf: () => "",
      get _sidSong() { return state._sidSong; }, set _sidSong(v) { state._sidSong = v; },
      get _sidSongPos() { return state._sidSongPos; }, set _sidSongPos(v) { state._sidSongPos = v; },
      get _sidPat() { return state._sidPat; }, set _sidPat(v) { state._sidPat = v; },
      _sidTimer: null, _sidPaused: false, _sidPlaybackUsingWebSid: false,
    }
  );
  return { ctx, state };
}

test("Song list: inserting adds the currently-edited pattern right after the selected slot", () => {
  const { ctx, state } = loadSongSandbox({ song: [0], pos: 0, pat: 2 });
  ctx._sidSongInsert();
  assert.deepEqual(state._sidSong, [0, 2]);
  assert.equal(state._sidSongPos, 1);
});

test("Song list: a pattern can appear more than once (repeats are allowed)", () => {
  const { ctx, state } = loadSongSandbox({ song: [0, 1], pos: 1, pat: 0 });
  ctx._sidSongInsert(); // insert pattern 0 again after position 1
  assert.deepEqual(state._sidSong, [0, 1, 0]);
});

test("Song list: removing a slot never empties the list entirely", () => {
  const { ctx, state } = loadSongSandbox({ song: [3], pos: 0, pat: 0 });
  ctx._sidSongRemove();
  assert.deepEqual(state._sidSong, [3], "the last remaining slot must survive");
});

test("Song list: removing a slot clamps the selected position", () => {
  const { ctx, state } = loadSongSandbox({ song: [0, 1, 2], pos: 2, pat: 0 });
  ctx._sidSongRemove();
  assert.deepEqual(state._sidSong, [0, 1]);
  assert.equal(state._sidSongPos, 1);
});

test("Song list: moving a slot swaps it with its neighbor and follows the selection", () => {
  const { ctx, state } = loadSongSandbox({ song: [5, 6, 7], pos: 0, pat: 0 });
  ctx._sidSongMove(1);
  assert.deepEqual(state._sidSong, [6, 5, 7]);
  assert.equal(state._sidSongPos, 1);
});

test("Song list: moving past either end is a no-op", () => {
  const { ctx, state } = loadSongSandbox({ song: [1, 2], pos: 0, pat: 0 });
  ctx._sidSongMove(-1);
  assert.deepEqual(state._sidSong, [1, 2]);
  assert.equal(state._sidSongPos, 0);
});

// ---- Serialize / deserialize round trip, including backward compat -----

function loadSerdeSandbox() {
  return loadFunctions(
    ["_sidInstBytes", "_sidWaveByte", "_sidNewInst", "_sidNewPattern", "_sidSerialize", "_sidDeserialize", "_sidSyncPlayModeSel", "_sidBuildInstSel", "_sidLoadInstUI", "_sidBuildPatSel", "_sidBuildSongList", "_sidBuildTracker", "_sidStop", "_sidUpdatePauseButton", "_sidCurInst"],
    {
      Uint8Array, Math, String, Array,
      // _sidLoadInstUI assigns document.getElementById("sid-inst-name").value
      // directly with no null-guard (unlike its other fields, which all go
      // through a guarded helper) — give that one id a real object so the
      // assignment lands instead of throwing on null; every other id stays
      // null so the guarded call sites take their existing no-op path.
      document: { getElementById: (id) => (id === "sid-inst-name" ? {} : null), querySelectorAll: () => [] },
      t: (k) => k,
      tf: () => "",
      _webSidPause: () => {},
      // Canvas drawing is out of scope for a serialize/deserialize test;
      // _sidLoadInstUI calls it unconditionally, so stub it out rather than
      // extracting the real (canvas-dependent) implementation.
      _sidDrawADSR: () => {},
      // _sidSerialize/_sidDeserialize/_sidStop all touch playback state
      // directly (bare global reads, e.g. "if (_sidTimer)") — these must
      // exist as real properties on the sandbox or referencing them throws
      // ReferenceError, even where the app only reads them defensively.
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

test("SID serialize/deserialize round-trips instruments, patterns and the song/order list", () => {
  const ctx = loadSerdeSandbox();
  ctx._sidInsts = [ctx._sidNewInst("Lead")];
  ctx._sidInsts[0].cut = 1234; ctx._sidInsts[0].vol = 9; ctx._sidInsts[0].lp = true;
  ctx._sidPatterns = [ctx._sidNewPattern(), ctx._sidNewPattern()];
  ctx._sidPatterns[0][0][3] = { note: 40, inst: 0 };
  ctx._sidPatterns[1][2][10] = { note: 55, inst: 0 };
  ctx._sidSong = [0, 1, 0, 1]; // a repeated 2-pattern arrangement

  const bytes = ctx._sidSerialize();
  ctx._sidPatterns = null; ctx._sidInsts = null; ctx._sidSong = null; // wipe before reload
  ctx._sidDeserialize(bytes);

  assert.equal(ctx._sidPatterns.length, 2);
  assert.equal(ctx._sidPatterns[0][0][3].note, 40);
  assert.equal(ctx._sidPatterns[1][2][10].note, 55);
  assert.deepEqual(Array.from(ctx._sidSong), [0, 1, 0, 1]);
  assert.equal(ctx._sidInsts[0].cut, 1234);
});

test("SID deserialize falls back to a 0..N-1 song for saves made before the order list existed", () => {
  const ctx = loadSerdeSandbox();
  ctx._sidInsts = [ctx._sidNewInst("Lead")];
  ctx._sidPatterns = [ctx._sidNewPattern(), ctx._sidNewPattern(), ctx._sidNewPattern()];
  // Build a legacy-shaped byte array by calling the real serializer, then
  // truncating off the song-list tail this version appends.
  const full = ctx._sidSerialize();
  let legacyLen = 2; // ni, np headers
  legacyLen += ctx._sidInsts.length * 9;
  // ctx._SID_ROWS is not a real property: it's a top-level `const` inside
  // the vm script, which never becomes a property of the sandbox object, so
  // referencing it from out here would silently read undefined -> NaN. Use
  // the same literal the rest of this file already hardcodes (_SID_ROWS = 32).
  legacyLen += ctx._sidPatterns.length * 3 * 32 * 2;
  const legacyBytes = full.slice(0, legacyLen);

  ctx._sidPatterns = null; ctx._sidInsts = null; ctx._sidSong = null;
  ctx._sidDeserialize(legacyBytes);
  assert.deepEqual(Array.from(ctx._sidSong), [0, 1, 2], "old saves should just play every pattern once, in order");
});

// ---- Exported ASM player: every referenced sid_ label must be defined --

function loadExportSandbox() {
  return loadFunctions(
    ["_sidExportAsmPlayable", "_sidWaveByte"],
    { Math, String, Array },
    `${extractConstLine("_SID_ROWS")}\n${extractConstLine("_SID_FX_CODES")}\n${extractConstLine("_SID_FX_NAMES")}`
  );
}

function makePattern(rows) {
  const pat = [[], [], []];
  for (let v = 0; v < 3; v++) for (let r = 0; r < 32; r++) pat[v].push({ note: null, inst: 0 });
  (rows || []).forEach(([v, r, note]) => { pat[v][r] = { note, inst: 0 }; });
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

test("Exported ASM player: every referenced sid_* label is defined exactly where expected", () => {
  const ctx = loadExportSandbox();
  ctx._sidSpeed = 6;
  ctx._sidInsts = [ctx._sidNewInst ? ctx._sidNewInst() : { tri:false,saw:false,pul:true,noi:false,pw:2048,a:2,d:8,s:6,r:4,lp:false,bp:false,hp:false,cut:1400,res:0,vol:15 }];
  ctx._sidPatterns = [makePattern([[0, 0, 40]]), makePattern([[1, 5, 50]])];
  ctx._sidSong = [0, 1, 0];

  const asm = ctx._sidExportAsmPlayable();
  const { defined, referenced } = collectSidLabels(asm);
  const missing = [...referenced].filter((id) => id.match(/^sid_[a-z_]+$/) && !defined.has(id) &&
    !id.startsWith("sid_v") && id !== "sid_instruments" && id !== "sid_freq_lo" && id !== "sid_freq_hi" && id !== "sid_order");
  assert.deepEqual(missing, [], "every branch/jump/subroutine label used must be defined somewhere in the output");
  // table labels (sid_v0_notes etc, sid_instruments, sid_freq_lo/hi, sid_order) are asserted directly:
  ["sid_order", "sid_instruments", "sid_freq_lo", "sid_freq_hi",
   "sid_v0_notes", "sid_v0_insts", "sid_v1_notes", "sid_v1_insts", "sid_v2_notes", "sid_v2_insts"]
    .forEach((label) => assert.ok(defined.has(label), `expected table label ${label} to be defined`));
});

test("Exported ASM player: more than 7 patterns no longer triggers the old 8-bit-counter cap", () => {
  const ctx = loadExportSandbox();
  ctx._sidSpeed = 6;
  ctx._sidInsts = [{ tri:false,saw:false,pul:true,noi:false,pw:2048,a:2,d:8,s:6,r:4,lp:false,bp:false,hp:false,cut:1400,res:0,vol:15 }];
  ctx._sidPatterns = [];
  for (let i = 0; i < 12; i++) ctx._sidPatterns.push(makePattern());
  ctx._sidSong = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1]; // 14 steps, patterns repeat

  const asm = ctx._sidExportAsmPlayable();
  assert.ok(!/only the first \d+ patterns are exported/.test(asm), "12 patterns must not hit the old 7-pattern cap");
  assert.ok(asm.includes("sid_order:"));
  // sid_v0_notes table must hold all 12 patterns worth of rows (12*32 bytes)
  const notesBlock = asm.slice(asm.indexOf("sid_v0_notes:"), asm.indexOf("sid_v0_insts:"));
  const byteCount = (notesBlock.match(/\$[0-9A-F]{2}/g) || []).length;
  assert.equal(byteCount, 12 * 32);
});

test("Exported ASM player: the song/order table encodes the given step sequence, repeats included", () => {
  const ctx = loadExportSandbox();
  ctx._sidSpeed = 6;
  ctx._sidInsts = [{ tri:false,saw:false,pul:true,noi:false,pw:2048,a:2,d:8,s:6,r:4,lp:false,bp:false,hp:false,cut:1400,res:0,vol:15 }];
  ctx._sidPatterns = [makePattern(), makePattern(), makePattern()];
  ctx._sidSong = [0, 2, 1, 2];

  const asm = ctx._sidExportAsmPlayable();
  const orderBlock = asm.slice(asm.indexOf("sid_order:"), asm.indexOf("; Instruments:"));
  const bytes = (orderBlock.match(/\$([0-9A-F]{2})/g) || []).map((h) => parseInt(h.slice(1), 16));
  assert.deepEqual(bytes, [0, 2, 1, 2]);
});
