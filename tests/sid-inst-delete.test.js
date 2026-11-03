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

function setup(instCount) {
  const ctx = { Set, Math, Promise };
  vm.createContext(ctx);
  vm.runInContext(`
    const empty = () => ({ note: null, inst: 0, fx: null, fxval: 0 });
    var _sidInsts = Array.from({ length: ${instCount} }, (_, i) => ({ name: "I" + i }));
    var _sidPatterns = [Array.from({ length: 3 }, () => Array.from({ length: 32 }, empty))];
    var _sidInst = 0, asked = [];
    function _sidBuildInstSel() {} function _sidLoadInstUI() {} function _sidBuildTracker() {} function _sidHistSchedule() {}
    function tf(k, v) { return k + ":" + v.n + ":" + v.name; }
    var answer = true;
    function _showConfirm(text) { asked.push(text); return Promise.resolve(answer); }
    ${["_sidInstRemove", "_sidInstUse", "_sidInstRemoveUnused"].map(fn).join("\n")}
    async ${fn("_sidInstDeleteCurrent")}
    function on(v, r, inst) { _sidPatterns[0][v][r] = { note: 40, inst, fx: null, fxval: 0 }; }
    function insts() { return _sidInsts.map((i) => i.name); }
    function cells() { return _sidPatterns[0].map((col) => col.filter((c) => c.note != null).map((c) => c.inst)); }
  `, ctx);
  return ctx;
}
const run = (ctx, code) => JSON.parse(vm.runInContext(`JSON.stringify(${code})`, ctx));

test("deleting an instrument renumbers the notes of the later ones", async () => {
  const c = setup(4);
  vm.runInContext("on(0, 0, 0); on(0, 4, 3); on(1, 2, 2); _sidInst = 1;", c);
  await vm.runInContext("_sidInstDeleteCurrent()", c);
  assert.deepEqual(run(c, "insts()"), ["I0", "I2", "I3"]);
  assert.deepEqual(run(c, "cells()"), [[0, 2], [1], []]);
  assert.deepEqual(run(c, "asked"), [], "an unused instrument goes without a question");
  assert.equal(run(c, "_sidInst"), 0);
});

test("the notes of a used instrument play the one before it, after a question", async () => {
  const c = setup(3);
  vm.runInContext("on(0, 0, 1); on(1, 0, 1); on(2, 0, 2); _sidInst = 1;", c);
  vm.runInContext("answer = false;", c);
  await vm.runInContext("_sidInstDeleteCurrent()", c);
  assert.equal(run(c, "_sidInsts.length"), 3, "No keeps it");
  vm.runInContext("answer = true;", c);
  await vm.runInContext("_sidInstDeleteCurrent()", c);
  assert.deepEqual(run(c, "asked"), ["sidDeleteInstrumentUsed:2:I0", "sidDeleteInstrumentUsed:2:I0"]);
  assert.deepEqual(run(c, "cells()"), [[0], [0], [1]]);
});

test("the first instrument's notes go to the next one, and the last instrument stays", async () => {
  const c = setup(2);
  vm.runInContext("on(0, 0, 0); on(0, 1, 1);", c);
  await vm.runInContext("_sidInstDeleteCurrent()", c);
  assert.deepEqual(run(c, "insts()"), ["I1"]);
  assert.deepEqual(run(c, "cells()"), [[0, 0], [], []]);
  await vm.runInContext("_sidInstDeleteCurrent()", c);
  assert.deepEqual(run(c, "insts()"), ["I1"]);
});

test("delete unused: only instruments no note plays, one always stays", () => {
  const c = setup(5);
  vm.runInContext("on(0, 0, 1); on(2, 3, 4);", c);
  assert.equal(run(c, "_sidInstRemoveUnused()"), 3);
  assert.deepEqual(run(c, "insts()"), ["I1", "I4"]);
  assert.deepEqual(run(c, "cells()"), [[0], [], [1]]);
  const e = setup(3);
  assert.equal(run(e, "_sidInstRemoveUnused()"), 2);
  assert.deepEqual(run(e, "insts()"), ["I0"]);
  assert.equal(run(e, "_sidInstRemoveUnused()"), 0);
});

test("the buttons, the menu item and the seven languages are in place", () => {
  const html = fs.readFileSync(path.join(www, "index.html"), "utf8");
  ["sid-inst-del", "sid-inst-unused", "sid-song-vol", "sid-song-vol2", "sid-video"].forEach((id) => assert.ok(html.includes(`id="${id}"`), id));
  const i18n = fs.readFileSync(path.join(www, "i18n.js"), "utf8");
  ["sidDeleteInstrument", "sidDeleteInstrumentUsed", "sidRemoveUnused", "sidRemoveUnusedDone", "sidRemoveUnusedNone", "sidSongVol", "sidSongVolTip", "sidSongVol1", "sidSongVol2", "sidSongVol2Tip", "sidVideoTip"]
    .forEach((k) => assert.equal(i18n.split(`"${k}"`).length - 1, 7, k));
  assert.ok(!html.includes('id="sid-vol"') && !html.includes('id="sid-vol-song"'), "an instrument has no volume of its own to set");
  assert.match(source, /var _sidSongVol;\r?\nvar _sidSongVol2;\r?\nvar _sidNtsc;/, "set before these lines run: no initializer");
});
