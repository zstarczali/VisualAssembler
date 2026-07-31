const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");

// The Curve/Table Forge core is a contiguous DOM-free slice: everything from
// `const _CG_STATE = {` through the end of `_cgFormatBytes`. Functions after
// that point (_cgUpdateOutput, _cgDrawGraph, ...) touch `document`, so we stop
// before them. Extract the slice and eval it in a sandbox.
function loadCgCore() {
  const start = appJs.indexOf("const _CG_STATE = {");
  assert.notStrictEqual(start, -1, "Missing _CG_STATE");
  const fnMarker = "function _cgFormatBytes(";
  const fnStart = appJs.indexOf(fnMarker);
  assert.notStrictEqual(fnStart, -1, "Missing _cgFormatBytes");
  let depth = 0, end = -1, seenBrace = false;
  for (let i = fnStart; i < appJs.length; i++) {
    const ch = appJs[i];
    if (ch === "{") { depth += 1; seenBrace = true; }
    else if (ch === "}") { depth -= 1; if (seenBrace && depth === 0) { end = i + 1; break; } }
  }
  assert.notStrictEqual(end, -1, "Could not parse _cgFormatBytes");
  const src = appJs.slice(start, end);
  const context = {};
  vm.createContext(context);
  vm.runInContext(
    src + "\n; this._CG_STATE = _CG_STATE;" +
    " this._cgRefMax = _cgRefMax;" +
    " this._cgGenerateSamples = _cgGenerateSamples;" +
    " this._cgFormatBytes = _cgFormatBytes;",
    context
  );
  return context;
}

// Apply a partial state, regenerate samples, return { ctx, state, output }.
function run(overrides) {
  const ctx = loadCgCore();
  Object.assign(ctx._CG_STATE, overrides);
  ctx._cgGenerateSamples();
  return { ctx, state: ctx._CG_STATE, output: ctx._cgFormatBytes() };
}

const DEFAULTS = {
  curve: "linear", start: 0, end: 255, count: 8, cycles: 1, phase: 0,
  combine: false, curve2: "cosine", curve2Cycles: 1, curve2Phase: 0,
  mix: 50, combineMode: "mix", label: "tbl", base: "hex", perLine: 16,
  bits: 8, emitReader: false, spriteNum: 0,
};

test("refMax is 255 for 8-bit, 320 for 16-bit", () => {
  const a = run({ ...DEFAULTS, bits: 8 });
  assert.equal(a.ctx._cgRefMax(), 255);
  const b = run({ ...DEFAULTS, bits: 16 });
  assert.equal(b.ctx._cgRefMax(), 320);
});

test("8-bit linear samples stay within 0..255 and rise monotonically", () => {
  const { state } = run({ ...DEFAULTS, bits: 8, curve: "linear", start: 0, end: 255, count: 256 });
  assert.equal(state.samples.length, 256);
  assert.equal(state.samples[0], 0);
  for (let i = 1; i < state.samples.length; i++) {
    assert.ok(state.samples[i] >= state.samples[i - 1], `sample ${i} not monotonic`);
    assert.ok(state.samples[i] <= 255, `sample ${i} exceeds 255`);
  }
});

test("8-bit output is a single .byte table with header, no lo/hi split", () => {
  const { output } = run({ ...DEFAULTS, bits: 8, label: "myTbl" });
  assert.match(output, /^myTbl:$/m);
  assert.match(output, /\.byte /);
  assert.doesNotMatch(output, /myTbl_lo:/);
  assert.doesNotMatch(output, /myTbl_hi:/);
  assert.match(output, /; Table Forge - Linear/);
  assert.match(output, /LDA myTbl,X/);
});

test("16-bit splits into parallel _lo / _hi byte tables", () => {
  // linear 0..320, count 8 -> values 0,40,80,120,160,200,240,280
  const { state, output } = run({ ...DEFAULTS, bits: 16, curve: "linear", start: 0, end: 320, count: 8, label: "xt" });
  assert.deepEqual(Array.from(state.samples), [0, 40, 80, 120, 160, 200, 240, 280]);
  assert.match(output, /^xt_lo:$/m);
  assert.match(output, /^xt_hi:$/m);
  // 280 = $118 -> lo $18, hi $01 ; 240 = $F0 -> lo $F0, hi $00
  const loLine = output.split("\n").find((l) => l.trim().startsWith(".byte") && output.indexOf(l) > output.indexOf("xt_lo:") && output.indexOf(l) < output.indexOf("xt_hi:"));
  assert.match(loLine, /\$18/);   // low byte of 280
  const hiIdx = output.indexOf("xt_hi:");
  const hiLine = output.slice(hiIdx).split("\n").find((l) => l.trim().startsWith(".byte"));
  assert.match(hiLine, /\$01/);   // 9th bit set for 280
  assert.match(hiLine, /\$00/);   // and clear for the low values
});

test("16-bit value 320 becomes lo=$40 hi=$01", () => {
  const { state, output } = run({ ...DEFAULTS, bits: 16, curve: "linear", start: 320, end: 320, count: 4, label: "xt" });
  assert.ok(Array.from(state.samples).every((v) => v === 320));
  const hiIdx = output.indexOf("xt_hi:");
  const loLine = output.slice(output.indexOf("xt_lo:")).split("\n").find((l) => l.trim().startsWith(".byte"));
  const hiLine = output.slice(hiIdx).split("\n").find((l) => l.trim().startsWith(".byte"));
  assert.match(loLine, /\$40/);
  assert.match(hiLine, /\$01/);
});

test("reader routine off by default, present when emitReader is set", () => {
  const off = run({ ...DEFAULTS, bits: 16, emitReader: false, label: "xt" });
  assert.doesNotMatch(off.output, /xt_set_x:/);

  const on = run({ ...DEFAULTS, bits: 16, emitReader: true, spriteNum: 0, label: "xt" });
  assert.match(on.output, /xt_set_x:/);
  assert.match(on.output, /lda xt_lo,x/);
  assert.match(on.output, /sta \$D000/);          // sprite 0 X lo register
  assert.match(on.output, /ora #%00000001/);      // set sprite 0 MSB
  assert.match(on.output, /and #%11111110/);      // clear sprite 0 MSB
});

test("reader routine masks/address track the selected sprite number", () => {
  const { output } = run({ ...DEFAULTS, bits: 16, emitReader: true, spriteNum: 2, label: "xt" });
  assert.match(output, /sta \$D004/);             // sprite 2 X lo = $D000 + 2*2
  assert.match(output, /ora #%00000100/);         // set sprite 2 MSB (bit 2)
  assert.match(output, /and #%11111011/);         // clear sprite 2 MSB
  assert.match(output, /\$D010 bit 2/);           // header documents the bit
});

test("decimal base emits plain numbers, hex base emits $ prefix", () => {
  const hex = run({ ...DEFAULTS, bits: 8, base: "hex", curve: "linear", start: 0, end: 16, count: 4, label: "t" });
  assert.match(hex.output, /\$00/);
  const dec = run({ ...DEFAULTS, bits: 8, base: "dec", curve: "linear", start: 0, end: 16, count: 4, label: "t" });
  const decByteLine = dec.output.split("\n").find((l) => l.trim().startsWith(".byte"));
  assert.doesNotMatch(decByteLine, /\$/);
});

test("combine mix averages the two curves", () => {
  // curve1 linear 0..100, curve2 linear (same) -> mix 50% is identity here;
  // instead use square (0 or 100) mixed 50% with linear to get a clear blend.
  const solo = run({ ...DEFAULTS, bits: 8, curve: "linear", start: 0, end: 200, count: 4, combine: false });
  const mixed = run({ ...DEFAULTS, bits: 8, curve: "linear", start: 0, end: 200, count: 4, combine: true, curve2: "linear", combineMode: "mix", mix: 50 });
  // linear mixed 50% with identical linear = same values
  assert.deepEqual(Array.from(mixed.state.samples), Array.from(solo.state.samples));
  assert.match(mixed.output, /; Combine: mix/);
});

test("header reports actual min/max and entry count", () => {
  const { output } = run({ ...DEFAULTS, bits: 8, curve: "linear", start: 10, end: 250, count: 32, label: "t" });
  assert.match(output, /Range: \d+\.\.\d+/);
  assert.match(output, /Count: 32 bytes/);
});
