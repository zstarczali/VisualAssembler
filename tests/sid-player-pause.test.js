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

function fakeContext(all) {
  const ac = {
    state: "running", currentTime: 0, sampleRate: 1000, destination: {}, resumes: 0, played: [],
    resume() { ac.state = "running"; ac.resumes++; return Promise.resolve(); },
    suspend() { ac.state = "suspended"; return Promise.resolve(); },
    createGain() {
      return { context: ac, gain: { value: 0, setTargetAtTime(v) { this.value = v; }, setValueAtTime(v) { this.value = v; }, cancelScheduledValues() {} },
        connect(node) { this.to = node; } };
    },
    createAnalyser() { return { context: ac }; },
    createBuffer() { return { copyToChannel() {} }; },
    createBufferSource() { return { connect(node) { ac.played.push(node); }, start() {}, stop() {} }; },
  };
  all.push(ac);
  return ac;
}

// The real player path over fake Web Audio; each render stays pending until the test releases it.
function setup() {
  const contexts = [];
  const renders = [];
  const ctx = {
    _channelMonitorQueue() {},
    contexts, renders,
    window: {
      AudioContext: function() { return fakeContext(contexts); },
      electronAPI: {
        renderSidFile: () => new Promise((resolve) => renders.push(() => resolve({ pcm: Buffer.alloc(800).toString("base64"), channels: 1 }))),
        releaseSidFile: () => Promise.resolve(),
      },
    },
    crypto: { randomUUID: () => "id" },
    atob: (b64) => Buffer.from(b64, "base64").toString("latin1"),
    setInterval: () => 1, clearInterval() {},
    Float32Array, Math, Array, Promise,
  };
  vm.createContext(ctx);
  vm.runInContext(`
    const _SID_EXT_STOP_FADE_S = 0.04;
    var _sidAudio = null, _sidMasterGain = null, _sidMasterVol = 0.6, _sidExtAudio = null, _sidExtGain = null, _sidVizVa = null, _sidVizExt = null;
    const _PLAYER_NORM_TARGET_DB = -18, _PLAYER_NORM_MAX_DB = 12;
    var _playerNormalize = false, _playerNormNode = null, _sidExtFadeNode = null;
    var _sidExternalCore = null, _sidExtSources = new Set(), _sidPreviewSources = new Set(), _sidPreviewModel = "8580", _sidPreviewEngine = "resid", _sidDigiBoost = false;
    var _sidExtStatus = "playing", _sidExtStarting = false, _sidExtFile = null, _sidPlaylist = [], _sidPlaylistIndex = -1;
    function _sidStop() {}
    function _sidPlayerAheadSeconds() { return 1; }
    function _sidPlayerBufferSize() { return 0; }
    function _sidPlayerShowTune() {}
    function _sidEngineLabel() { return ""; }
    function _sidEngineName() { return ""; }
    function _sidPlayerHideWindow() {}
    function showViceToast() {}
    function _sidExtStop() {}
    function _sidExtSetStatus(s) { _sidExtStatus = s; }
    ${["_sidEnsureAudio", "_sidPlayerAudio", "_sidPlayBuffer", "_sidDecodePcm16", "_sidExternalCoreStop", "_sidExtFadeOutSources", "_sidExtSwitchAt", "_sidExtTuneOut", "_sidExtPlay", "_sidExtPause", "_sidApplyMasterVolume", "_sidVizTap", "_sidVizAnalysers",
      "_normMeterNew", "_normMeterAdd", "_normLoudness", "_playerNormGain", "_playerNormOutput", "_sidExtFadeOutput", "_playerNormApply"].map(fn).join("\n")}
    async ${fn("_vaSidPlayFileBytes")}
    this.api = {
      start: () => _vaSidPlayFileBytes([1, 2, 3], "t.sid"),
      pause: _sidExtPause,
      play: _sidExtPlay,
      stop: _sidExternalCoreStop,
      editorNote: () => { _sidEnsureAudio(); _sidPlayBuffer(new Float32Array(8), 0); },
      player: () => _sidExtAudio,
      shared: () => _sidAudio,
      gain: () => _sidExtGain,
      status: () => _sidExtStatus,
      volume: (v) => { _sidMasterVol = v; _sidApplyMasterVolume(); },
      analysers: () => _sidVizAnalysers(),
    };
  `, ctx);
  return ctx;
}
const tick = () => new Promise((resolve) => setImmediate(resolve));

test("a chunk rendered during the pause does not switch the sound back on", async () => {
  const { api, renders } = setup();
  api.start();
  await tick();
  assert.equal(renders.length, 1, "a render is running");
  api.pause();
  assert.equal(api.player().state, "suspended");
  renders[0]();
  await tick();
  assert.equal(api.player().played.length, 1, "the chunk is scheduled for later");
  assert.equal(api.player().state, "suspended", "and the player stays paused");
  assert.equal(api.player().resumes, 0);
  assert.equal(api.status(), "paused");
});

test("a note from the SID Editor sounds, and the paused player stays paused", async () => {
  const { api, renders } = setup();
  api.start();
  await tick();
  api.pause();
  api.editorNote();
  assert.equal(api.shared().played.length, 1);
  assert.equal(api.shared().state, "running");
  assert.equal(api.player().state, "suspended");
  renders[0]();
});

test("the player's chunks go to the player's own gain, and a tune is on its own context", async () => {
  const { api, renders, contexts } = setup();
  api.start();
  await tick();
  renders[0]();
  await tick();
  assert.equal(contexts.length, 1, "no shared context is needed for a tune");
  // through the tune's own gain, the normalization and the end-of-tune fade stage, which feed the player's gain
  assert.equal(api.player().played[0].to.to.to, api.gain());
});

test("Pause pressed again continues, as does Play", async () => {
  const { api } = setup();
  api.start();
  await tick();
  api.pause();
  api.pause();
  assert.equal(api.status(), "playing");
  assert.equal(api.player().state, "running");
  api.pause();
  api.play();
  assert.equal(api.status(), "playing");
  assert.equal(api.player().state, "running");
});

test("stopping a paused tune leaves the context ready for the next", async () => {
  const { api } = setup();
  api.start();
  await tick();
  api.pause();
  api.stop(true);
  assert.equal(api.player().state, "running");
});

test("a new tune wakes a context left suspended", async () => {
  const { api } = setup();
  api.start();
  await tick();
  api.player().state = "suspended";
  api.start();
  await tick();
  assert.equal(api.player().state, "running");
});

test("the volume reaches the player, also while paused", async () => {
  const { api } = setup();
  api.start();
  await tick();
  api.volume(0.25);
  assert.equal(api.gain().gain.value, 0.25);
  api.pause();
  api.volume(0.5);
  assert.equal(api.gain().gain.value, 0.5);
});

test("the spectrum hears the player and the editor", async () => {
  const { api } = setup();
  api.start();
  await tick();
  assert.equal(api.analysers().length, 1);
  api.editorNote();
  assert.equal(api.analysers().length, 2);
});

test("switching tunes fades the old one out instead of cutting it mid-wave", () => {
  const src = fs.readFileSync(path.join(__dirname, "..", "www", fs.existsSync(path.join(__dirname, "..", "www", "sid-editor.js")) ? "sid-editor.js" : "app.js"), "utf8");
  const fnText = (name) => {
    const start = src.indexOf(`function ${name}(`);
    let depth = 0, i = src.indexOf("{", start);
    for (; i < src.length; i++) { if (src[i] === "{") depth++; else if (src[i] === "}" && --depth === 0) break; }
    return src.slice(start, i + 1);
  };
  const ramps = [];
  const ac = { state: "running", currentTime: 10 };
  ac.createGain = () => ({ context: ac, to: null, connect(n) { this.to = n; }, disconnect() { this.to = null; },
    gain: { cancelScheduledValues(t) { ramps.push(["cancel", t]); }, setValueAtTime(v, t) { ramps.push(["set", v, t]); }, linearRampToValueAtTime(v, t) { ramps.push(["ramp", v, t]); } } });
  const source = () => ({ stopped: null, reconnected: false, disconnect() { this.reconnected = true; }, connect() { this.reconnected = true; }, stop(t = "now") { this.stopped = t; } });
  const norm = { context: ac };
  const ctx = { setTimeout() {}, Array, _sidExtAudio: ac, _sidExtSources: new Set() };
  vm.createContext(ctx);
  vm.runInContext(`const _SID_EXT_STOP_FADE_S = 0.04;\n${fnText("_sidExtSwitchAt")}\n${fnText("_sidExtTuneOut")}\n${fnText("_sidExtFadeOutSources")}\nthis.out = _sidExtTuneOut; this.fade = _sidExtFadeOutSources;`, ctx);
  // a tune plays through a gain of its own, in front of the Normalize stage
  const state = {};
  const out = ctx.out(state, norm);
  assert.equal(out.to, norm);
  assert.equal(ctx.out(state, norm), out, "one gain for the whole tune");
  const a = source(), b = source();
  ctx._sidExtSources.add(a); ctx._sidExtSources.add(b);
  ctx.fade(state);
  assert.equal(ctx._sidExtSources.size, 0);
  assert.equal(state.out, null, "the next buffers get a new gain");
  // only the tune's gain ramps, the buffers stay where they are (no gap on WebKit)
  for (const s of [a, b]) { assert.equal(s.reconnected, false); assert.ok(Math.abs(s.stopped - 10.04) < 1e-9); }
  assert.deepEqual(ramps, [["cancel", 10], ["set", 1, 10], ["ramp", 0, 10.04]]);
  // paused: the context is suspended and silent, the buffers just stop
  const c = source();
  ac.state = "suspended";
  ctx._sidExtSources.add(c);
  const paused = {}; ctx.out(paused, norm);
  ctx.fade(paused);
  assert.equal(c.stopped, "now");
});

test("the shared gains change only after the old tune's fade-out", () => {
  const src = fs.readFileSync(path.join(__dirname, "..", "www", fs.existsSync(path.join(__dirname, "..", "www", "sid-editor.js")) ? "sid-editor.js" : "app.js"), "utf8");
  const fnText = (name) => {
    const start = src.indexOf(`function ${name}(`);
    let depth = 0, i = src.indexOf("{", start);
    for (; i < src.length; i++) { if (src[i] === "{") depth++; else if (src[i] === "}" && --depth === 0) break; }
    return src.slice(start, i + 1);
  };
  const events = [];
  const param = { value: 1, cancelScheduledValues(t) { events.push(["cancel", t]); }, setValueAtTime(v, t) { events.push(["set", v, t]); }, setTargetAtTime() {}, linearRampToValueAtTime() {} };
  const ctx = { _sidExternalCore: { normGain: 3 }, _playerNormalize: true, _playerNormNode: { gain: param, context: { currentTime: 5 } } };
  vm.createContext(ctx);
  vm.runInContext(`const _SID_EXT_STOP_FADE_S = 0.04;\n${fnText("_sidExtSwitchAt")}\n${fnText("_playerNormApply")}\nthis.apply = _playerNormApply;`, ctx);
  ctx.apply(false, 5.04);
  // nothing before 5.04 is touched: the old tune keeps its level while it fades
  assert.deepEqual(events, [["cancel", 5.04], ["set", 3, 5.04]]);
  assert.ok(src.includes("_playerNormApply(false, _sidExtSwitchAt(ac));"));
  assert.ok(/if \(reset\) \{[\s\S]{0,160}const at = _sidExtSwitchAt\(node\.context\);/.test(src));
});
