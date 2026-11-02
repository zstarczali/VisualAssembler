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

// One 3-voice pattern of 32 rows in the song; 14 px a row, 36 px of keys.
function setup(song = [0], count = 1) {
  const ctx = { document: { getElementById: () => null } };
  vm.createContext(ctx);
  vm.runInContext(`
    const _SID_ROWS = 32;
    const empty = () => ({ note: null, inst: 0, fx: null, fxval: 0 });
    var _sidPatterns = Array.from({ length: ${count} }, () => Array.from({ length: 3 }, () => Array.from({ length: 32 }, empty)));
    var _sidSong = ${JSON.stringify(song)}, _sidPat = 0;
    var _sidRollView = { row0: 0, colW: 14, lo: 0, span: 96, voice: 0 };
    function _sidSetCellText() {}
    function _sidVoiceCount() { return 3; }
    ${["_sidRollTotalRows", "_sidRollCell", "_sidRollWrite", "_sidRollNotes", "_sidRollNoteAt", "_sidRollGrab", "_sidRollNoteLimit", "_sidRollDragEnd", "_sidRollSetEnd", "_sidRollMoveStart", "_sidRollMoveTo"].map(fn).join("\n")}
    function on(v, r, note) { _sidPatterns[0][v][r] = { note, inst: 0, fx: null, fxval: 0 }; }
    function off(v, r) { _sidPatterns[0][v][r] = { note: null, inst: 0, fx: "C", fxval: 0 }; }
    function cell(v, r) { const c = _sidPatterns[0][v][r]; return c.note != null ? c.note : c.fx === "C" ? "off" : null; }
    function hitAt(x, pitch) {
      const g = { keyW: 36, colW: _sidRollView.colW };
      const rowX = _sidRollView.row0 + (x - g.keyW) / g.colW;
      return { row: Math.floor(rowX), rowX, pitch, x, g };
    }
    function grab(x, pitch) { const r = _sidRollGrab(_sidRollNotes(), hitAt(x, pitch)); return r && { kind: r.kind, start: r.note.start, end: r.note.end, v: r.note.v }; }
    // moves the note starting on a row by whole rows, as the drag does, step by step
    function move(from, pitch, rows) {
      const notes = _sidRollNotes();
      const n = notes.find((x) => x.start === from && x.note === pitch);
      const d = _sidRollMoveStart(notes, n, { row: from });
      const step = rows < 0 ? -1 : 1;
      for (let k = 1; k <= Math.abs(rows); k++) {
        const start = Math.max(d.min, Math.min(d.max, d.origStart + step * k));
        if (start !== d.note.start) _sidRollMoveTo(d, start);
      }
      return _sidRollNotes().filter((x) => x.v === n.v).map((x) => [x.start, x.end]);
    }
    function drag(pressX, pitch, toX) {
      const notes = _sidRollNotes();
      const g = _sidRollGrab(notes, hitAt(pressX, pitch));
      const d = { kind: g.kind, note: g.note, limit: _sidRollNoteLimit(notes, g.note) };
      const end = _sidRollDragEnd(d, hitAt(toX, pitch));
      if (end !== d.note.end) _sidRollSetEnd(d.note, end);
      return _sidRollNotes().filter((n) => n.v === g.note.v).map((n) => [n.start, n.end]);
    }
  `, ctx);
  return ctx;
}
const run = (ctx, code) => JSON.parse(vm.runInContext(`JSON.stringify(${code})`, ctx) ?? "null");
const act = (ctx, code) => vm.runInContext(code, ctx);
// the x of a row's left edge
const X = (row) => 36 + row * 14;

test("a one-row note: the right half stretches, the left half moves the note", () => {
  const c = setup();
  act(c, "on(0, 2, 40); off(0, 3);");
  assert.equal(run(c, `grab(${X(3) - 2}, 40)`).kind, "len");
  assert.equal(run(c, `grab(${X(2) + 3}, 40)`).kind, "move");
});

test("the end can be caught just past the note", () => {
  const c = setup();
  act(c, "on(0, 2, 40); off(0, 3);");
  assert.equal(run(c, `grab(${X(3) + 3}, 40)`).kind, "len");
  assert.equal(run(c, `grab(${X(3) + 8}, 40)`), null, "further on is empty ground for a new note");
  assert.equal(run(c, `grab(${X(3) - 2}, 41)`), null, "another pitch");
});

test("a note starting right at the end keeps its own body", () => {
  const c = setup();
  act(c, "on(0, 2, 40); on(0, 3, 40); off(0, 8);");
  const g = run(c, `grab(${X(3) + 2}, 40)`);
  assert.equal(g.kind, "move");
  assert.equal(g.start, 3);
});

test("stretching: the note grows and the note-off moves", () => {
  const c = setup();
  act(c, "on(0, 2, 40); off(0, 3);");
  assert.deepEqual(run(c, `drag(${X(3) - 2}, 40, ${X(9)})`), [[2, 9]]);
  assert.equal(run(c, "cell(0, 3)"), null, "the old note-off is gone");
  assert.equal(run(c, "cell(0, 9)"), "off");
});

test("shortening: the note shrinks, and no note-off is left behind", () => {
  const c = setup();
  act(c, "on(0, 2, 40); off(0, 10);");
  assert.deepEqual(run(c, `drag(${X(10) - 2}, 40, ${X(5)})`), [[2, 5]]);
  assert.equal(run(c, "cell(0, 5)"), "off");
  assert.equal(run(c, "cell(0, 10)"), null);
});

test("it never gets shorter than a row", () => {
  const c = setup();
  act(c, "on(0, 2, 40); off(0, 10);");
  assert.deepEqual(run(c, `drag(${X(10) - 2}, 40, ${X(0)})`), [[2, 3]]);
});

test("it stops at the voice's next note, and keeps it", () => {
  const c = setup();
  act(c, "on(0, 2, 40); off(0, 3); on(0, 6, 44); off(0, 7);");
  assert.deepEqual(run(c, `drag(${X(3) - 2}, 40, ${X(20)})`), [[2, 6], [6, 7]]);
  assert.equal(run(c, "cell(0, 6)"), 44);
});

test("another voice's note is no limit", () => {
  const c = setup();
  act(c, "on(0, 2, 40); off(0, 3); on(1, 6, 44);");
  assert.deepEqual(run(c, `drag(${X(3) - 2}, 40, ${X(20)})`), [[2, 20]]);
  assert.equal(run(c, "cell(1, 6)"), 44);
});

test("it can grow over a pattern boundary, up to the end of the song", () => {
  const c = setup([0, 1], 2);
  act(c, "on(0, 30, 40); off(0, 31);");
  assert.deepEqual(run(c, `drag(${X(31) - 2}, 40, ${X(40)})`), [[30, 40]]);
  assert.equal(run(c, "_sidPatterns[1][0][8].fx"), "C");
  assert.deepEqual(run(c, `drag(${X(40) - 2}, 40, ${X(500)})`), [[30, 64]]);
});

test("where two voices share the pitch, the active voice's end comes first", () => {
  const c = setup();
  act(c, "on(0, 2, 40); off(0, 3); on(1, 2, 40); off(1, 3); _sidRollView.voice = 1;");
  assert.equal(run(c, `grab(${X(3) - 2}, 40)`).v, 1);
});

test("a tiny zoom leaves room for a new note next to the end", () => {
  const c = setup();
  act(c, "_sidRollView.colW = 4; on(0, 2, 40); off(0, 3);");
  const x = 36 + 3 * 4;
  assert.equal(run(c, `grab(${x + 1}, 40)`).kind, "len");
  assert.equal(run(c, `grab(${x + 3}, 40)`), null);
});

test("moving keeps the length and takes the note-off with it", () => {
  const c = setup();
  act(c, "on(0, 2, 40); off(0, 5);");
  assert.deepEqual(run(c, "move(2, 40, 6)"), [[8, 11]]);
  assert.equal(run(c, "cell(0, 2)"), null);
  assert.equal(run(c, "cell(0, 5)"), null);
  assert.equal(run(c, "cell(0, 8)"), 40);
  assert.equal(run(c, "cell(0, 11)"), "off");
});

test("moving to the left, down to the first row", () => {
  const c = setup();
  act(c, "on(0, 6, 40); off(0, 8);");
  assert.deepEqual(run(c, "move(6, 40, -20)"), [[0, 2]]);
});

test("it stops a row short of the next note, shortened, and its length comes back", () => {
  const c = setup();
  act(c, "on(0, 2, 40); off(0, 6); on(0, 10, 44); off(0, 11);");
  const reached = run(c, "(() => { const notes = _sidRollNotes(); const d = _sidRollMoveStart(notes, notes[0], { row: 2 }); _sidRollMoveTo(d, 9); const there = _sidRollNotes().map((x) => [x.start, x.end]); const off = cell(0, 10); _sidRollMoveTo(d, 3); return [there, off, _sidRollNotes().map((x) => [x.start, x.end])]; })()");
  assert.deepEqual(reached[0], [[9, 10], [10, 11]]);
  assert.equal(reached[1], 44, "the next note stays");
  assert.deepEqual(reached[2], [[3, 7], [10, 11]]);
});

test("the previous note keeps its end when the note that ended it moves away", () => {
  const c = setup();
  act(c, "on(0, 2, 40); on(0, 6, 44); off(0, 8);");
  assert.deepEqual(run(c, "move(6, 44, 4)"), [[2, 6], [10, 12]]);
  assert.equal(run(c, "cell(0, 6)"), "off");
});

test("moving into the previous note cuts it, and it comes back on the way out", () => {
  const c = setup();
  act(c, "on(0, 2, 40); off(0, 6); on(0, 10, 44); off(0, 12);");
  const r = run(c, "(() => { const notes = _sidRollNotes(); const d = _sidRollMoveStart(notes, notes[1], { row: 10 }); _sidRollMoveTo(d, 4); const inside = _sidRollNotes().map((x) => [x.start, x.end]); const off = cell(0, 6); _sidRollMoveTo(d, 9); return [inside, off, _sidRollNotes().map((x) => [x.start, x.end]), cell(0, 6)]; })()");
  assert.deepEqual(r[0], [[2, 4], [4, 6]]);
  assert.deepEqual(r[2], [[2, 6], [9, 11]]);
  assert.equal(r[3], "off", "its own note-off is back");
});

test("an effect the note passes over stays in its row", () => {
  const c = setup();
  act(c, "on(0, 2, 40); off(0, 3); _sidPatterns[0][0][5] = { note: null, inst: 0, fx: 'V', fxval: 7 };");
  run(c, "move(2, 40, 8)");
  const fx = run(c, "_sidPatterns[0][0][5]");
  assert.equal(fx.fx, "V");
  assert.equal(fx.fxval, 7);
  assert.equal(run(c, "cell(0, 10)"), 40);
});

test("the note takes its instrument and its own effect along", () => {
  const c = setup();
  act(c, "_sidPatterns[0][0][2] = { note: 40, inst: 3, fx: 'U', fxval: 9 }; off(0, 3);");
  run(c, "move(2, 40, 4)");
  const moved = run(c, "_sidPatterns[0][0][6]");
  assert.deepEqual([moved.note, moved.inst, moved.fx, moved.fxval], [40, 3, "U", 9]);
  assert.equal(run(c, "_sidPatterns[0][0][2].fx"), null);
});

test("moving over a pattern boundary", () => {
  const c = setup([0, 1], 2);
  act(c, "on(0, 30, 40); off(0, 31);");
  assert.deepEqual(run(c, "move(30, 40, 5)"), [[35, 36]]);
  assert.equal(run(c, "_sidPatterns[1][0][3].note"), 40);
  assert.equal(run(c, "_sidPatterns[0][0][30].note"), null);
});

test("the hint names moving, in all seven languages", () => {
  const i18n = fs.readFileSync(path.join(www, "i18n.js"), "utf8");
  const lines = i18n.split("\n").filter((l) => l.includes('"sidRollHelp"'));
  assert.equal(lines.length, 7);
  ["mozgatás", "move in time", "mover en", "verschieben", "verplaatsen", "przesuń", "sposta"].forEach((word) => {
    assert.ok(lines.some((l) => l.includes(word)), word);
  });
});
