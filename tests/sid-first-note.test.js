const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const www = path.join(__dirname, "..", "www");
const app = fs.existsSync(path.join(www, "sid-editor.js")) ? null : require("./helpers/load-app")();

// The frames "Play" sends, in the app's own engine (the Visual Assembler's whole app is loadable).
function framesOf(setup, count = 60, engine = "resid") {
  const code = `(function(){
    // instruments that set the chip's volume themselves, on a tune whose volume is 0 (as before the song volume)
    _sidInsts = [Object.assign(_sidNewInst("a"), { songVol: false }), Object.assign(_sidNewInst("b"), { filt: true, lp: true, cut: 700, res: 9, vol: 9, songVol: false })];
    _sidSongVol = 0;
    _sidPatterns = [_sidNewPattern()];
    _sidSong = [0]; _sidSpeed = 6; _sidPat = 0; _sidPlayPat = 0; _sidPlayMode = "all"; _sidSongPlayPos = 0;
    _sidPreviewEngine = "${engine}";
    ${setup}
    const td = _sidWaTune();
    const e = _sidWaEngine(td, true);
    const w = { open: _sidPreviewEngine === "resid" ? _sidWaOpeningMixer(td) : null };
    const out = [];
    for (let k = 0; k < ${count}; k++) {
      _sidEngFrame(e);
      const frame = _sidNativeFrame(e);
      out.push(w.open ? _sidWaOpenFrame(w, frame) : frame);
    }
    return JSON.stringify({ frames: out, chips: e.chips });
  })()`;
  return JSON.parse(app.run(code));
}
const note = (v, row, inst = 0) => `_sidPatterns[0][${v}][${row}] = { note: 48, inst: ${inst}, fx: null, fxval: 0 };`;

test("the frames before the first note already carry its volume", { skip: !app }, () => {
  const { frames } = framesOf(note(0, 4));
  const onset = frames.findIndex((f) => f[25]);
  assert.equal(onset, 24);
  frames.slice(0, onset + 1).forEach((f, k) => assert.equal(f[0x18] & 15, 15, `frame ${k}`));
});

test("they carry its filter as well", { skip: !app }, () => {
  const { frames } = framesOf(note(0, 4, 1));
  const onset = frames.findIndex((f) => f[25]);
  [0, 5, onset - 1].forEach((k) => {
    assert.deepEqual(frames[k].slice(0x15, 0x19), frames[onset].slice(0x15, 0x19), `frame ${k}`);
  });
  assert.equal(frames[0][0x18] & 15, 9);
});

test("the voices stay silent until the note", { skip: !app }, () => {
  const { frames } = framesOf(note(0, 4));
  frames.slice(0, 24).forEach((f) => { assert.equal(f[4] & 1, 0, "no gate"); assert.equal(f[25], 0, "no restart"); });
});

test("a tune starting on row 0 sends what the engine does", { skip: !app }, () => {
  const a = framesOf(note(0, 0)).frames;
  const b = framesOf(note(0, 0), 60, "va-core").frames;
  assert.deepEqual(a, b);
});

test("VA SID Core gets the engine's own frames", { skip: !app }, () => {
  const { frames } = framesOf(note(0, 4), 60, "va-core");
  assert.equal(frames[0][0x18] & 15, 0);
});

test("after the note the volume is the engine's again", { skip: !app }, () => {
  const a = framesOf(note(0, 4)).frames;
  const b = framesOf(note(0, 4), 60, "va-core").frames;
  assert.deepEqual(a.slice(24), b.slice(24));
});

test("two SIDs open separately", { skip: !app }, () => {
  const { frames, chips } = framesOf(`
    _sidPatterns = [_sidNewPattern(6)];
    ${note(0, 2)}
    ${note(3, 8, 1)}`);
  assert.equal(chips, 2);
  assert.equal(frames[0][0x18] & 15, 15);
  assert.equal(frames[0][25 + 0x18] & 15, 9);
});

test("a tune with no notes stays as it is", { skip: !app }, () => {
  const { frames } = framesOf("", 30);
  frames.forEach((f) => assert.equal(f[0x18] & 15, 0));
});

test("with the song volume the chip is on it from the first frame", { skip: !app }, () => {
  const { frames } = framesOf("_sidSongVol = 11; _sidInsts.forEach((i) => { i.songVol = true; });" + note(0, 4), 30, "va-core");
  frames.forEach((f, k) => assert.equal(f[0x18] & 15, 11, `frame ${k}`));
});

test("both apps wire it into the player, for reSID only", () => {
  const source = fs.readFileSync(path.join(www, app ? "app.js" : "sid-editor.js"), "utf8");
  assert.ok(source.includes('open: audio && _sidUsesNativeCore() && _sidPreviewEngine === "resid" ? _sidWaOpeningMixer(td) : null'));
  assert.ok(source.includes("frames.push(w.open ? _sidWaOpenFrame(w, frame) : frame);"));
  // sanity for vm use in this file
  assert.equal(typeof vm.createContext, "function");
});
