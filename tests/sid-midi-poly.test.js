const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const www = path.join(__dirname, "..", "www");
const source = fs.readFileSync(path.join(www, fs.existsSync(path.join(www, "sid-editor.js")) ? "sid-editor.js" : "app.js"), "utf8");

function fn(name) {
  const start = source.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, name);
  let depth = 0;
  for (let i = start; ; i++) {
    if (source[i] === "{") depth++;
    else if (source[i] === "}" && --depth === 0) return source.slice(start, i + 1);
  }
}

// A recording of `voices` voices, with a clock and the row under the test's control.
function setup(poly = true, voices = 3) {
  const played = [];
  const ctx = {
    now: 1000,
    played,
    performance: { now: () => ctx.now },
    document: { getElementById: () => ({ open: true, classList: { add() {}, remove() {} } }) },
    setTimeout() {},
    clearTimeout() {},
  };
  vm.createContext(ctx);
  vm.runInContext(`
    const _SID_POLY_CHORD_MS = 40;
    var _sidMidiHeld = new Set(), _sidMidiPoly = ${poly}, _sidInited = true, _sidVkbdInsertMode = false;
    var _sidInsts = [{}], _sidAudio = { currentTime: 0 };
    var pattern = Array.from({ length: ${voices} }, () => Array.from({ length: 64 }, () => ({ note: null, inst: 0, fx: null, fxval: 0 })));
    var _sidRecording = { pattern, voice: 0, inst: 0, row: 0, rowMs: 120, held: new Map(), pendingOff: new Set(), chord: null };
    var monoNotes = [];
    function _sidMidiFlash() {}
    function _sidSetCellText() {}
    function _sidEnsureAudio() {}
    function _sidPlayInst() { played.push(1); }
    function _sidNoteFreq() { return 440; }
    function _sidCurInst() { return {}; }
    function _sidFlashVirtualKeyboardNotes() {}
    function _sidInsertNoteAtSelection(note) { monoNotes.push(note); }
    ${["_sidMidiMessage", "_sidRecordPolyVoice", "_sidRecordPolyNote", "_sidRecordPolyOff", "_sidRecordPolyRelease"].map(fn).join("\n")}
    function press(m) { _sidMidiMessage({ data: [0x90, m, 100] }); }
    function release(m) { _sidMidiMessage({ data: [0x80, m, 0] }); }
    function goto(row) { _sidRecording.row = row; _sidRecording.pendingOff.forEach((v) => _sidRecordPolyOff(_sidRecording, v)); _sidRecording.pendingOff.clear(); }
    function cell(v, r) { const c = pattern[v][r]; return c.note != null ? c.note : c.fx === "C" ? "off" : null; }
  `, ctx);
  return ctx;
}
const run = (ctx, code) => JSON.parse(vm.runInContext(`JSON.stringify(${code})`, ctx) ?? "null");
const act = (ctx, code) => vm.runInContext(code, ctx);

test("a chord of three lands on three voices of one row", () => {
  const c = setup();
  act(c, "press(60); press(64); press(67);");
  assert.deepEqual(run(c, "[cell(0,0), cell(1,0), cell(2,0)]"), [48, 52, 55]);
  assert.equal(c.played.length, 3);
});

test("it starts from the selected voice and wraps", () => {
  const c = setup();
  act(c, "_sidRecording.voice = 2; press(60); press(64);");
  assert.deepEqual(run(c, "[cell(2,0), cell(0,0), cell(1,0)]"), [48, 52, null]);
});

test("a chord straddling a row boundary stays on its first row", () => {
  const c = setup();
  act(c, "press(60); goto(1);");
  c.now += 20;
  act(c, "press(64);");
  assert.equal(run(c, "cell(1,0)"), 52);
  assert.equal(run(c, "cell(1,1)"), null);
  c.now += 100;
  act(c, "goto(2); press(67);");
  assert.equal(run(c, "cell(2,2)"), 55, "later keys are not part of the chord");
});

test("a release writes a note-off on the current row", () => {
  const c = setup();
  act(c, "press(60); press(64); goto(4); release(64);");
  assert.equal(run(c, "cell(1,4)"), "off");
  assert.equal(run(c, "cell(0,4)"), null, "the held key rings on");
});

test("a release on the note's own row waits for the next row", () => {
  const c = setup();
  act(c, "press(60); release(60);");
  assert.equal(run(c, "cell(0,0)"), 48);
  act(c, "goto(1);");
  assert.equal(run(c, "cell(0,1)"), "off");
});

test("a melody stays on the first voice", () => {
  const c = setup();
  act(c, "press(60); goto(2);");
  c.now += 100;
  act(c, "release(60); press(62); goto(4);");
  c.now += 100;
  act(c, "release(62); press(64);");
  assert.deepEqual(run(c, "[cell(0,0), cell(0,2), cell(0,4)]"), [48, 50, 52]);
  assert.deepEqual(run(c, "[cell(1,2), cell(1,4), cell(2,4)]"), [null, null, null]);
});

test("a quick note does not overwrite the one released on its row", () => {
  const c = setup();
  act(c, "press(60); release(60);");
  c.now += 100;
  act(c, "press(62);");
  assert.deepEqual(run(c, "[cell(0,0), cell(1,0)]"), [48, 50]);
});

test("the new note takes over a voice's due note-off", () => {
  const c = setup(true, 1);
  act(c, "press(60); release(60);");
  c.now += 100;
  act(c, "press(62); goto(1);");
  assert.equal(run(c, "cell(0,0)"), 50);
  assert.equal(run(c, "cell(0,1)"), null);
});

test("with every voice held, the oldest key gives up its voice", () => {
  const c = setup();
  act(c, "press(60); press(64); press(67); goto(2);");
  c.now += 100;
  act(c, "press(72);");
  assert.equal(run(c, "cell(0,2)"), 60);
  act(c, "goto(3); release(60);");
  assert.equal(run(c, "cell(0,3)"), null, "that key has no voice any more");
});

test("six voices with two SIDs", () => {
  const c = setup(true, 6);
  act(c, "for (let k = 0; k < 6; k++) press(60 + k);");
  assert.deepEqual(run(c, "[0,1,2,3,4,5].map((v) => cell(v,0))"), [48, 49, 50, 51, 52, 53]);
});

test("switched off, recording goes the old way", () => {
  const c = setup(false);
  act(c, "press(60); press(64); release(60);");
  assert.deepEqual(run(c, "monoNotes"), [48, 52]);
  assert.equal(run(c, "_sidRecording.held.size"), 0);
  assert.equal(run(c, "cell(1,0)"), null);
});

test("a release with no recording does nothing", () => {
  const c = setup();
  act(c, "_sidRecording = null; release(60);");
});

test("the recording's tick writes the note-off that was due", () => {
  const tick = fn("_sidRecordTick");
  assert.ok(tick.includes("rec.pendingOff.forEach"));
  assert.ok(tick.indexOf("rec.row = rec.startRow + step") < tick.indexOf("rec.pendingOff.forEach"), "on the new row");
  assert.ok(fn("_sidRecordStart").includes("held: new Map(), pendingOff: new Set()"));
});

test("the switch is on the page, and in all seven languages", () => {
  const html = fs.readFileSync(path.join(www, "index.html"), "utf8");
  assert.ok(html.includes('id="sid-midi-poly"') && html.includes('id="sid-midi-poly-label"'));
  assert.match(html, /<div class="sid-midi-wrap">\s*<button id="sid-virtual-keyboard"/, "the keyboard button wraps with the MIDI controls");
  const i18n = fs.readFileSync(path.join(www, "i18n.js"), "utf8");
  assert.equal(i18n.split('"sidMidiPoly"').length - 1, 7);
  assert.ok(source.includes('setText("#sid-midi-poly-label", t("sidMidiPoly"))'));
  assert.ok(source.includes('"c64va-sid-midi-poly"'));
  assert.match(source, /var _sidMidiPoly;/, "the setup loads it before the declaration runs: no let, and no initializer to overwrite it");
});

test("WebView2's MIDI question is answered by the backend, and only that one", () => {
  const tauri = path.join(__dirname, "..", "src-tauri");
  const rust = fs.readFileSync(path.join(tauri, "src", "midi_permission.rs"), "utf8");
  assert.ok(rust.includes("if kind == COREWEBVIEW2_PERMISSION_KIND_MIDI_SYSTEM_EXCLUSIVE_MESSAGES {"));
  assert.equal(rust.split("SetState(").length - 1, 1, "every other permission stays with WebView2");
  const lib = fs.readFileSync(path.join(tauri, "src", "lib.rs"), "utf8");
  assert.ok(lib.includes("mod midi_permission;") && lib.includes("midi_permission::allow_without_prompt(&window)"));
});
