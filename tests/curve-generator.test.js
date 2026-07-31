const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");

// The Curve/Table Forge core is a contiguous DOM-free slice: everything from
// `const _CG_STATE = {` through the end of `_cgExportDemoAsm`. Functions after
// that point (_cgUpdateOutput, _cgDrawGraph, ...) touch `document`, so we stop
// before them. Extract the slice and eval it in a sandbox.
function loadCgCore() {
  const start = appJs.indexOf("const _CG_STATE = {");
  assert.notStrictEqual(start, -1, "Missing _CG_STATE");
  const fnMarker = "function _cgExportDemoAsm(";
  const fnStart = appJs.indexOf(fnMarker);
  assert.notStrictEqual(fnStart, -1, "Missing _cgExportDemoAsm");
  let depth = 0, end = -1, seenBrace = false;
  for (let i = fnStart; i < appJs.length; i++) {
    const ch = appJs[i];
    if (ch === "{") { depth += 1; seenBrace = true; }
    else if (ch === "}") { depth -= 1; if (seenBrace && depth === 0) { end = i + 1; break; } }
  }
  assert.notStrictEqual(end, -1, "Could not parse _cgExportDemoAsm");
  const src = appJs.slice(start, end);
  const context = {};
  vm.createContext(context);
  vm.runInContext(
    src + "\n; this._CG_STATE = _CG_STATE;" +
    " this._cgRefMax = _cgRefMax;" +
    " this._cgGenerateSamples = _cgGenerateSamples;" +
    " this._cgFormatBytes = _cgFormatBytes;" +
    " this._cgExportDemoAsm = _cgExportDemoAsm;",
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
  assert.match(output, /; Curve Editor - Linear/);
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

test("8-bit mode emits a sprite-Y reader when emitReader is set", () => {
  const off = run({ ...DEFAULTS, bits: 8, emitReader: false, label: "bt" });
  assert.doesNotMatch(off.output, /bt_set_y:/);

  const on = run({ ...DEFAULTS, bits: 8, emitReader: true, spriteNum: 0, label: "bt" });
  assert.match(on.output, /bt_set_y:/);
  assert.match(on.output, /lda bt,x/);
  assert.match(on.output, /sta \$D001/);          // sprite 0 Y register

  const sp2 = run({ ...DEFAULTS, bits: 8, emitReader: true, spriteNum: 2, label: "bt" });
  assert.match(sp2.output, /sta \$D005/);         // sprite 2 Y = $D001 + 2*2
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

test("demo export (8-bit) is a runnable program with Y reader and X sweep", () => {
  const { ctx } = run({ ...DEFAULTS, bits: 8, curve: "easeOutBounce", start: 50, end: 229, count: 114, label: "bounceTable" });
  const demo = ctx._cgExportDemoAsm();
  assert.match(demo, /\* = \$0801/);
  assert.match(demo, /jsr bounceTable_set_y/);        // Y from table
  assert.match(demo, /sta \$D001/);                  // sprite 0 Y register
  assert.match(demo, /adc #\$D5/);                   // sweep step lo: round(320*256/114) = $02D5
  assert.match(demo, /sta \$d000/);                  // sprite 0 X low byte
  assert.match(demo, /ora #%00000001/);              // $D010 MSB set
  assert.match(demo, /cmp #\$72/);                   // 114 entries -> explicit wrap
  assert.match(demo, /bounceTable:/);                // embedded table
  assert.match(demo, /\* = \$2000/);                 // sprite data segment
  assert.match(demo, /sprite_ball:/);
  // 64 sprite bytes: 21 rows * 3 + trailing byte
  const spriteSection = demo.slice(demo.indexOf("sprite_ball:"));
  assert.equal((spriteSection.match(/\.byte/g) || []).length, 22);
});

test("demo export (8-bit, 256 entries) uses automatic index wrap", () => {
  const { ctx } = run({ ...DEFAULTS, bits: 8, curve: "cosine", start: 0, end: 255, count: 256, label: "cosineTable" });
  const demo = ctx._cgExportDemoAsm();
  assert.match(demo, /inc idx\s+; 256 entries -> wraps automatically/);
  assert.doesNotMatch(demo, /cmp #/);
  assert.match(demo, /adc #\$40/);                   // step lo of $0140 = 1.25 px/frame
});

test("demo export (16-bit) sweeps X and drives Y via the scaled demo reader", () => {
  const { ctx } = run({ ...DEFAULTS, bits: 16, curve: "easeOutBounce", start: 0, end: 320, count: 114, label: "table" });
  const demo = ctx._cgExportDemoAsm();
  assert.match(demo, /jsr table_demo_y/);            // Y = table[idx] scaled to 0..200
  assert.match(demo, /table_demo_y:/);
  assert.match(demo, /asl vtmp/);                    // 16-bit v*4
  assert.match(demo, /adc table_lo,x/);              // +v -> v*5
  assert.match(demo, /lsr vtmp\+1/);                 // (v*5) >> 3 scaling
  assert.match(demo, /sta \$d001/i);                 // sprite 0 Y register
  assert.match(demo, /table_lo:/);
  assert.match(demo, /table_hi:/);
  assert.match(demo, /table_set_x:/);                // native sprite-X reader still included
  assert.match(demo, /xpos:/);                       // X sweep vars, like the 8-bit demo
  assert.match(demo, /xfrac:/);
  assert.doesNotMatch(demo, /ypos|yfrac/);           // no Y sweep anymore
  assert.match(demo, /adc #\$D5/);                   // X sweep step lo: round(320*256/113) = $02D5
  assert.match(demo, /ora #%00000001/);              // $D010 MSB set
  assert.match(demo, /cmp #\$72/);
});

test("demo export (16-bit, 256 entries) resets the X sweep on automatic wrap", () => {
  const { ctx } = run({ ...DEFAULTS, bits: 16, curve: "linear", start: 0, end: 320, count: 256, label: "table" });
  const demo = ctx._cgExportDemoAsm();
  assert.match(demo, /inc idx\s+; 256 entries -> wraps automatically/);
  assert.match(demo, /bne main/);
  assert.match(demo, /sta xpos/);
  assert.match(demo, /sta xfrac/);
  assert.match(demo, /adc #\$40/);                   // X step lo of $0140 = 1.25 px/frame
});
