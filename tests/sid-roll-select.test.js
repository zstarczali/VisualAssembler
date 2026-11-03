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

// A song of 32-row patterns, three voices.
function setup(song = [0], count = 1) {
  const ctx = { document: { getElementById: () => null } };
  vm.createContext(ctx);
  vm.runInContext(`
    const _SID_ROWS = 32;
    const empty = () => ({ note: null, inst: 0, fx: null, fxval: 0 });
    var _sidPatterns = Array.from({ length: ${count} }, () => Array.from({ length: 3 }, () => Array.from({ length: 32 }, empty)));
    var _sidSong = ${JSON.stringify(song)}, _sidPat = 0, _sidSongPos = 0, _sidSel = { row: 0, voice: 0 };
    var _sidRollView = { voice: 0, sel: new Set(), hover: null }, _sidRollClip = null, _sidQuant = 4;
    function _sidSetCellText() {}
    function _sidVoiceCount() { return 3; }
    ${["_sidRollTotalRows", "_sidRollCell", "_sidRollWrite", "_sidRollNotes", "_sidRollDelete", "_sidRollKey", "_sidRollSelected", "_sidRollPlace", "_sidRollItem",
      "_sidRollCopySelected", "_sidRollDeleteSelected", "_sidRollCutSelected", "_sidRollPasteAt", "_sidRollQuantizeNotes", "_sidRollQuantizeSelected",
      "_sidRecordQuantize", "_sidRollPasteRow"].map(fn).join("\n")}
    function on(v, r, note, p = 0) { _sidPatterns[p][v][r] = { note, inst: 1, fx: null, fxval: 0 }; }
    function off(v, r, p = 0) { _sidPatterns[p][v][r] = { note: null, inst: 0, fx: "C", fxval: 0 }; }
    function notes(v) { return _sidRollNotes().filter((n) => v == null || n.v === v).map((n) => [n.v, n.note, n.start, n.end]); }
    function select(...keys) { _sidRollView.sel = new Set(keys); }
  `, ctx);
  return ctx;
}
const run = (ctx, code) => JSON.parse(vm.runInContext(`JSON.stringify(${code})`, ctx) ?? "null");
const act = (ctx, code) => vm.runInContext(code, ctx);

test("deleting a note keeps the end of the note that rang into it", () => {
  const c = setup();
  act(c, "on(0, 0, 40); on(0, 4, 42); off(0, 8); select('0:4'); _sidRollDeleteSelected();");
  assert.deepEqual(run(c, "notes(0)"), [[0, 40, 0, 4]]);
  assert.equal(run(c, "_sidPatterns[0][0][8].fx"), null, "the deleted note's own note-off goes too");
  assert.equal(run(c, "_sidRollView.sel.size"), 0);
});

test("a note that ended on its own needs nothing in the gap", () => {
  const c = setup();
  act(c, "on(0, 0, 40); off(0, 2); on(0, 4, 42); off(0, 8); select('0:4'); _sidRollDeleteSelected();");
  assert.deepEqual(run(c, "notes(0)"), [[0, 40, 0, 2]]);
  assert.equal(run(c, "_sidPatterns[0][0][4].fx"), null);
});

test("two neighbours deleted together leave the earlier note its end", () => {
  const c = setup();
  act(c, "on(0, 0, 40); on(0, 4, 42); on(0, 6, 44); off(0, 8); select('0:4', '0:6'); _sidRollDeleteSelected();");
  assert.deepEqual(run(c, "notes(0)"), [[0, 40, 0, 4]]);
});

test("copy and paste: the notes keep their spacing, voices, lengths and instruments", () => {
  const c = setup();
  act(c, "on(0, 0, 40); off(0, 2); on(1, 1, 50); off(1, 4); select('0:0', '1:1'); _sidRollCopySelected(); _sidRollPasteAt(10);");
  assert.deepEqual(run(c, "notes()"), [[0, 40, 0, 2], [0, 40, 10, 12], [1, 50, 1, 4], [1, 50, 11, 14]]);
  assert.equal(run(c, "_sidPatterns[0][1][11].inst"), 1);
  assert.deepEqual(run(c, "[..._sidRollView.sel].sort()"), ["0:10", "1:11"], "the pasted notes are the new selection");
});

test("a paste writes over the notes under it, without leaving their tails", () => {
  const c = setup();
  act(c, "on(0, 0, 40); off(0, 2); select('0:0'); _sidRollCopySelected(); on(0, 9, 60); off(0, 20); _sidRollPasteAt(10);");
  assert.deepEqual(run(c, "notes(0)"), [[0, 40, 0, 2], [0, 60, 9, 10], [0, 40, 10, 12]]);
  assert.equal(run(c, "_sidPatterns[0][0][20].fx"), null, "the old note-off inside the pasted note's tail would be stray");
});

test("a note that rang to the end of the song pastes without a note-off", () => {
  const c = setup();
  act(c, "on(0, 30, 40); select('0:30'); _sidRollCopySelected(); _sidRollPasteAt(5);");
  assert.deepEqual(run(c, "notes(0)"), [[0, 40, 5, 30], [0, 40, 30, 32]]);
});

test("cut takes the notes away and keeps them for a paste", () => {
  const c = setup();
  act(c, "on(0, 4, 42); off(0, 6); select('0:4'); _sidRollCutSelected();");
  assert.deepEqual(run(c, "notes(0)"), []);
  act(c, "_sidRollPasteAt(12);");
  assert.deepEqual(run(c, "notes(0)"), [[0, 42, 12, 14]]);
});

test("a paste past the end of the song is cut off", () => {
  const c = setup();
  act(c, "on(0, 0, 40); off(0, 3); on(0, 6, 41); off(0, 8); select('0:0', '0:6'); _sidRollCopySelected(); _sidRollPasteAt(28);");
  assert.deepEqual(run(c, "notes(0).filter((n) => n[2] >= 28)"), [[0, 40, 28, 31]]);
});

test("quantize: every start to the nearest grid row, the length kept", () => {
  const c = setup();
  act(c, "on(0, 1, 40); off(0, 3); on(1, 3, 41); off(1, 5); on(2, 6, 42); off(2, 7); select('0:1', '1:3', '2:6'); _sidRollQuantizeSelected();");
  assert.deepEqual(run(c, "notes()"), [[0, 40, 0, 2], [1, 41, 4, 6], [2, 42, 8, 9]]);
  assert.deepEqual(run(c, "[..._sidRollView.sel].sort()"), ["0:0", "1:4", "2:8"]);
  assert.equal(run(c, "_sidPatterns[0][0][3].fx"), null, "no note-off left at the old end");
});

test("quantize leaves the notes on the grid alone, and works with no grid saved yet", () => {
  const c = setup();
  act(c, "on(0, 4, 40); off(0, 6); select('0:4'); _sidRollQuantizeSelected();");
  assert.deepEqual(run(c, "notes(0)"), [[0, 40, 4, 6]]);
  act(c, "on(1, 5, 41); off(1, 6); select('1:5'); _sidQuant = undefined; _sidRollQuantizeSelected();");
  assert.deepEqual(run(c, "notes(1)"), [[1, 41, 4, 5]], "the default grid of 4 rows");
});

test("quantize over a pattern boundary", () => {
  const c = setup([0, 1], 2);
  act(c, "on(0, 31, 40); off(0, 2, 1); select('0:31'); _sidRollQuantizeSelected();");
  assert.deepEqual(run(c, "notes(0)"), [[0, 40, 32, 35]]);
});

test("a recording is quantized when it stops, in the patterns of the song", () => {
  const c = setup([0, 1], 2);
  act(c, "on(0, 1, 40); off(0, 2); on(0, 33 - 32, 41, 1); off(0, 3, 1);");
  const n = run(c, `_sidRecordQuantize({ songPos0: 0, taken: [{ pattern: _sidPatterns[0], row: 1, voice: 0 }, { pattern: _sidPatterns[1], row: 1, voice: 0 }] }, 4)`);
  assert.equal(n, 2);
  assert.deepEqual(run(c, "notes(0)"), [[0, 40, 0, 1], [0, 41, 32, 34]]);
});

test("a take with no grid set stays as played", () => {
  const c = setup();
  act(c, "on(0, 1, 40);");
  assert.equal(run(c, `_sidRecordQuantize({ taken: [{ pattern: _sidPatterns[0], row: 1, voice: 0 }] }, 0)`), 0);
  assert.deepEqual(run(c, "notes(0)"), [[0, 40, 1, 32]]);
});

test("paste goes to the marked row, or else to the tracker cursor", () => {
  const c = setup([0, 1], 2);
  act(c, "_sidSongPos = 1; _sidSel.row = 3;");
  assert.equal(run(c, "_sidRollPasteRow()"), 35);
  act(c, "_sidRollView.hover = { row: 7 };");
  assert.equal(run(c, "_sidRollPasteRow()"), 35);
  act(c, "_sidRollView.mark = 9;");
  assert.equal(run(c, "_sidRollPasteRow()"), 9);
});

test("after a paste the mark moves past the pasted notes", () => {
  const c = setup([0, 1], 2);
  act(c, "_sidRollClip = [{ v: 0, start: 0, len: 2, cell: { note: 40, inst: 0 } }, { v: 0, start: 4, len: 3, cell: { note: 42, inst: 0 } }];");
  act(c, "_sidRollPasteAt(10);");
  assert.equal(run(c, "_sidRollView.mark"), 17);
  assert.deepEqual(run(c, "notes(0).map(function(n) { return n.slice(0, 3); })"), [[0, 40, 10], [0, 42, 14]]);
});

test("the controls, keys and the seven languages are in place", () => {
  const html = fs.readFileSync(path.join(www, "index.html"), "utf8");
  ["sid-quantize", "sid-quantize-rec", "sid-roll-cut", "sid-roll-copy", "sid-roll-paste", "sid-roll-delete", "sid-roll-quantize"].forEach((id) => assert.ok(html.includes(`id="${id}"`), id));
  const i18n = fs.readFileSync(path.join(www, "i18n.js"), "utf8");
  ["sidQuantize", "sidQuantizeRec", "sidQuantizeRows", "sidQuantizeTip", "sidRollCut", "sidRollCopy", "sidRollPaste", "sidRollDelete", "sidRollQuantize"]
    .forEach((k) => assert.equal(i18n.split(`"${k}"`).length - 1, 7, k));
  assert.ok(source.includes('else if (!mod && k === "q") what = "quantize";'));
  assert.ok(source.includes("if (_sidRecordQuantize(rec, _sidQuantRec ? (_sidQuant || 4) : 0)) _sidBuildTracker();"), "a recording is quantized only when asked for");
  assert.ok(source.includes('["sid-roll-quantize", has]'), "the button needs only a selection");
  assert.match(source, /var _sidQuant;\r?\nvar _sidQuantRec;/, "set by the setup before these lines run: no initializer");
});
