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
  let depth = 0, seen = false;
  for (let i = start; ; i++) {
    if (source[i] === "{") { depth++; seen = true; }
    else if (source[i] === "}" && --depth === 0 && seen) return source.slice(start, i + 1);
  }
}

function setup() {
  const els = {};
  const el = (id) => (els[id] = els[id] || { id, disabled: false, value: "", textContent: "", open: true });
  const ctx = { document: { getElementById: el }, els, setTimeout: () => 1, clearTimeout() {} };
  vm.createContext(ctx);
  vm.runInContext(`
    const _SID_HIST_MAX = 100;
    var _sidHist = { cur: null, undo: [], redo: [], timer: null };
    var _sidInsts = [{ name: "a", a: 2 }, { name: "b", a: 3 }];
    var _sidPatterns = [[[{ note: null }]], [[{ note: null }]], [[{ note: null }]]];
    var _sidSong = [0, 1, 2], _sidSpeed = 6, _sidSid2Addr = 0xD420, _sidInst = 0, _sidPat = 0, _sidSongPos = 0, _sidSelAnchor = null, _sidRecording = null;
    var built = 0;
    function _sidUpdateBpmDisplay() {}
    function _sidParamKnobSync() {}
    function _sidSetTuneTitle(t) { document.getElementById("sid-tune-title").textContent = t; }
    function _sidBuildInstSel() {}
    function _sidLoadInstUI() {}
    function _sidBuildPatSel() {}
    function _sidBuildSongList() {}
    function _sidBuildTracker() { built++; }
    ${["_sidVol", "_sidVol2", "_sidIsNtsc", "_sidSetSongVol", "_sidSetSongVol2", "_sidSetNtsc", "_sidHistSnap", "_sidHistSame", "_sidHistRender", "_sidHistCheck", "_sidHistSchedule", "_sidHistApply", "_sidHistStep", "_sidUndo", "_sidRedo"].map(fn).join("\n")}
    _sidHistCheck();
  `, ctx);
  return ctx;
}
const run = (ctx, code) => JSON.parse(vm.runInContext(`JSON.stringify(${code})`, ctx) ?? "null");
const act = (ctx, code) => vm.runInContext(code, ctx);
const note = (c, p) => run(c, `_sidPatterns[${p}][0][0].note`);

test("the opening state is not a step", () => {
  const c = setup();
  assert.equal(run(c, "_sidHist.undo.length"), 0);
  assert.equal(c.els["sid-undo"].disabled, true);
  assert.equal(c.els["sid-redo"].disabled, true);
});

test("a change is a step, undo takes it back and redo brings it back", () => {
  const c = setup();
  act(c, "_sidPatterns[0][0][0].note = 40; _sidHistCheck();");
  assert.equal(c.els["sid-undo"].disabled, false);
  act(c, "_sidUndo()");
  assert.equal(note(c, 0), null);
  assert.equal(c.els["sid-undo"].disabled, true);
  assert.equal(c.els["sid-redo"].disabled, false);
  act(c, "_sidRedo()");
  assert.equal(note(c, 0), 40);
  assert.equal(c.els["sid-redo"].disabled, true);
});

test("nothing changed: no step", () => {
  const c = setup();
  act(c, "_sidHistCheck(); _sidHistCheck();");
  assert.equal(run(c, "_sidHist.undo.length"), 0);
});

test("undo saves a change still waiting for its check", () => {
  const c = setup();
  act(c, "_sidPatterns[0][0][0].note = 40; _sidUndo();");
  assert.equal(note(c, 0), null);
  act(c, "_sidRedo()");
  assert.equal(note(c, 0), 40);
});

test("a new change clears redo", () => {
  const c = setup();
  act(c, "_sidPatterns[0][0][0].note = 40; _sidHistCheck(); _sidUndo(); _sidPatterns[0][0][0].note = 41; _sidHistCheck();");
  assert.equal(c.els["sid-redo"].disabled, true);
  act(c, "_sidRedo()");
  assert.equal(note(c, 0), 41);
});

test("several steps come back in order", () => {
  const c = setup();
  for (const n of [1, 2, 3]) act(c, `_sidPatterns[0][0][0].note = ${n}; _sidHistCheck();`);
  act(c, "_sidUndo()"); assert.equal(note(c, 0), 2);
  act(c, "_sidUndo()"); assert.equal(note(c, 0), 1);
  act(c, "_sidRedo()"); assert.equal(note(c, 0), 2);
});

test("instruments, song, tempo and title are covered as well", () => {
  const c = setup();
  act(c, `_sidInsts[1].a = 9; _sidSong.push(0); _sidSpeed = 3; document.getElementById("sid-tune-title").textContent = "x"; _sidHistCheck(); _sidUndo();`);
  assert.equal(run(c, "_sidInsts[1].a"), 3);
  assert.deepEqual(run(c, "_sidSong"), [0, 1, 2]);
  assert.equal(run(c, "_sidSpeed"), 6);
  assert.equal(c.els["sid-speed"].value, "6");
  assert.equal(c.els["sid-tune-title"].textContent, "");
});

test("the view jumps to what changed, with the song step that plays it", () => {
  const c = setup();
  act(c, "_sidPatterns[2][0][0].note = 7; _sidHistCheck(); _sidPat = 0; _sidSongPos = 0; _sidUndo();");
  assert.equal(run(c, "_sidPat"), 2);
  assert.equal(run(c, "_sidSongPos"), 2);
  act(c, "_sidInsts[1].a = 9; _sidHistCheck(); _sidInst = 0; _sidUndo();");
  assert.equal(run(c, "_sidInst"), 1);
});

test("a pattern and an instrument that are gone after undo leave a valid view", () => {
  const c = setup();
  act(c, "_sidPatterns.push([[{ note: 5 }]]); _sidSong.push(3); _sidInsts.push({ name: 'c' }); _sidPat = 3; _sidSongPos = 3; _sidInst = 2; _sidHistCheck(); _sidUndo();");
  assert.equal(run(c, "_sidPatterns.length"), 3);
  assert.ok(run(c, "_sidPat") <= 2);
  assert.equal(run(c, "_sidSongPos <= 2 && _sidInst <= 1"), true);
});

test("while recording nothing is saved, and the recording is then one step", () => {
  const c = setup();
  act(c, "_sidRecording = {}; for (let n = 1; n < 6; n++) { _sidPatterns[0][0][0].note = n; _sidHistCheck(); }");
  assert.equal(run(c, "_sidHist.undo.length"), 0);
  act(c, "_sidUndo()");
  assert.equal(note(c, 0), 5, "no undo during a recording");
  act(c, "_sidRecording = null; _sidHistCheck();");
  assert.equal(run(c, "_sidHist.undo.length"), 1);
  act(c, "_sidUndo()");
  assert.equal(note(c, 0), null);
});

test("the depth is limited, and the patterns that did not change share their text", () => {
  const c = setup();
  for (let n = 0; n < 130; n++) act(c, `_sidPatterns[0][0][0].note = ${n}; _sidHistCheck();`);
  assert.equal(run(c, "_sidHist.undo.length"), 100);
  assert.equal(vm.runInContext("_sidHist.undo[5].pats[1] === _sidHist.undo[6].pats[1]", c), true);
});

test("the undo does not stay on the state a rebuild may have touched", () => {
  const c = setup();
  act(c, "_sidPatterns[0][0][0].note = 40; _sidHistCheck(); _sidUndo(); _sidHistCheck();");
  assert.equal(c.els["sid-redo"].disabled, false, "the check after an undo keeps redo");
});

test("buttons, keys and the seven languages are in place", () => {
  const html = fs.readFileSync(path.join(www, "index.html"), "utf8");
  assert.ok(html.includes('id="sid-undo"') && html.includes('id="sid-redo"'));
  assert.ok(html.includes('id="sid-roll-undo"') && html.includes('id="sid-roll-redo"'), "the horizontal tracker has them too");
  assert.ok(source.includes('onId("sid-roll-undo", "click", _sidUndo);') && source.includes('set("sid-roll-redo", _sidHist.redo.length > 0);'));
  const i18n = fs.readFileSync(path.join(www, "i18n.js"), "utf8");
  assert.equal(i18n.split('"sidUndo"').length - 1, 7);
  assert.equal(i18n.split('"sidRedo"').length - 1, 7);
  assert.ok(source.includes('setAttr("#sid-undo", t("sidUndo"))'));
  assert.ok(source.includes('if (k === "y" || e.shiftKey) _sidRedo(); else _sidUndo();'));
  assert.ok(source.includes("if (!_sidHist.cur) _sidHistCheck();"), "the state on opening is saved, so that the first change is a step");
});
