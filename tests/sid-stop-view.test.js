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

// Three patterns in the song; the tracker's rebuilds are counted.
function setup(mode = "all") {
  const ctx = { document: { getElementById: () => null } };
  vm.createContext(ctx);
  vm.runInContext(`
    var _sidPlayReturn = null, _sidTimer = null, _sidPaused = false, _sidExternalCore = null;
    var _sidPlayMode = "${mode}", _sidPatterns = [[], [], [], []], _sidSong = [0, 1, 2], _sidSongPos = 0, _sidSongPlayPos = 0;
    var _sidPat = 0, _sidPlayPat = 0, _sidRow = 0, _sidSel = { row: 0 }, _ROWS = 4, rebuilds = 0;
    function _sidBuildTracker() { rebuilds++; }
    function _sidBuildSongList() {}
    function _sidUpdatePauseButton() {}
    function _sidLcdIdle() {}
    function _sidRecordStop() {}
    function _sidVkbdClearPlay() {}
    function _sidWaStop() {}
    function _sidWaStart() { _sidTimer = 1; }
    function clearInterval() {}
    ${["_sidSetPattern", "_sidStop", "_sidPlay"].map(fn).join("\n")}
    function reach(pat) { _sidSetPattern(pat, true); }
  `, ctx);
  return ctx;
}
const run = (ctx, code) => vm.runInContext(code, ctx);

test("Stop at the third pattern: back on the selected first one", () => {
  const c = setup();
  run(c, "_sidPlay(true); reach(2); _sidStop();");
  assert.equal(run(c, "_sidPat"), 0);
  assert.equal(run(c, "_sidSongPos"), 0);
});

test("a pattern open outside the song comes back as well", () => {
  const c = setup();
  run(c, "_sidPat = 3; _sidPlay(true); reach(1); _sidStop();");
  assert.equal(run(c, "_sidPat"), 3);
});

test("a song step picked during playback wins", () => {
  const c = setup();
  run(c, "_sidPlay(true); reach(2); _sidSongPos = 1; _sidStop();");
  assert.equal(run(c, "_sidPat"), 1);
});

test("a pause does not lose the way back", () => {
  const c = setup();
  run(c, "_sidPlay(true); reach(2); _sidPlay(false); reach(1); _sidStop();");
  assert.equal(run(c, "_sidPat"), 0);
});

test("restarting during playback keeps the first way back", () => {
  const c = setup();
  run(c, "_sidPat = 3; _sidPlay(true); reach(2); _sidPlay(true); _sidStop();");
  assert.equal(run(c, "_sidPat"), 3);
});

test("playing one pattern moves nothing", () => {
  const c = setup("current");
  run(c, "_sidPat = 2; _sidPlay(true); _sidStop();");
  assert.equal(run(c, "_sidPat"), 2);
  assert.equal(run(c, "rebuilds"), 0);
});

test("switching to one pattern during playback stays on the pattern shown", () => {
  const c = setup();
  run(c, "_sidPlay(true); reach(2); _sidPlayMode = 'current'; _sidPlay(true); _sidStop();");
  assert.equal(run(c, "_sidPat"), 2);
});

test("a second Stop does nothing", () => {
  const c = setup();
  run(c, "_sidPlay(true); reach(2); _sidStop(); reach(1); _sidStop();");
  assert.equal(run(c, "_sidPat"), 1);
});
