// Normalize volume in the SID Player: the gain, the meter and the playback.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.join(__dirname, "..");
const read = (f) => fs.readFileSync(path.join(root, f), "utf8");
const source = read("www/app.js");

function fnSource(name) {
  const start = source.search(new RegExp(`(async )?function ${name}\\(`));
  assert.notEqual(start, -1, name);
  const body = source.indexOf(") {", start) + 2;
  let depth = 0;
  for (let i = body; ; i++) {
    if (source[i] === "{") depth++;
    else if (source[i] === "}" && --depth === 0) return source.slice(start, i + 1);
  }
}

const NORM = ["_normMeterNew", "_normMeterAdd", "_normLoudness", "_playerNormGain", "_playerNormOutput", "_playerNormApply"];
const CONSTS = "const _PLAYER_NORM_TARGET_DB = -18, _PLAYER_NORM_MAX_DB = 12;";

test("the gain: to the target loudness, at most 12 dB, no clipping peaks", () => {
  const context = { Math, Number };
  vm.createContext(context);
  vm.runInContext(`${CONSTS} ${fnSource("_playerNormGain")}; this.gain = _playerNormGain;`, context);
  const db = (g) => Math.round(20 * Math.log10(g) * 10) / 10;
  assert.equal(db(context.gain({ loudness: -26, peak: 0.3 })), 8, "a quiet tune is raised to -18 dB");
  assert.equal(db(context.gain({ loudness: -12, peak: 0.9 })), -6, "a loud one is lowered");
  assert.equal(db(context.gain({ loudness: -40, peak: 0.05 })), 12, "at most +12 dB");
  assert.equal(db(context.gain({ loudness: 0, peak: 1 })), -12, "at most -12 dB");
  assert.equal(db(context.gain({ loudness: -26, peak: 0.6 })), 3.5, "the peak limits the boost (0.9 / 0.6)");
  assert.equal(context.gain({ loudness: null, peak: 0 }), 1, "silence keeps its level");
  assert.equal(context.gain(null), 1);
});

test("the meter: blocks of the mono mix, a long silence changes nothing", () => {
  const context = { Math, Number };
  vm.createContext(context);
  vm.runInContext(`${["_normMeterNew", "_normMeterAdd", "_normLoudness"].map(fnSource).join("\n")}
    this.m = { create: _normMeterNew, add: _normMeterAdd, loudness: _normLoudness };`, context);
  const m = context.m;
  const rate = 1000; // 400-frame blocks
  const sine = (frames, amp, channels) => {
    const pcm = new Float32Array(frames * channels);
    for (let i = 0; i < frames; i++) for (let c = 0; c < channels; c++) pcm[i * channels + c] = amp * Math.sin(i * 0.3);
    return pcm;
  };
  const meter = m.create();
  m.add(meter, sine(1000, 0.5, 2), 2, rate);
  m.add(meter, sine(600, 0.5, 2), 2, rate);
  assert.equal(meter.blocks.length, 4);
  assert.equal(meter.frames, 1600);
  const db = m.loudness(meter.blocks);
  assert.ok(Math.abs(db - 20 * Math.log10(0.5 / Math.SQRT2)) < 0.3, String(db));
  m.add(meter, new Float32Array(8000), 2, rate);
  assert.equal(m.loudness(meter.blocks), db);
});

// A tune of constant level, 0.5 s a render.
function player(normalize) {
  const ac = { currentTime: 0, sampleRate: 1000, state: "running", createGain() {
    return { context: ac, connect(n) { this.to = n; },
      gain: { value: 1, setValueAtTime(v) { this.value = v; }, cancelScheduledValues() {}, setTargetAtTime(v) { this.value = v; } } };
  } };
  const played = [];
  const master = { name: "master" };
  const context = {
    Math, Promise, Array, Number, crypto: { randomUUID: () => "id" }, console,
    setInterval: () => 1, clearInterval() {},
    window: { electronAPI: { renderSidFile: async () => ({ pcm: new Float32Array(500).fill(0.1), channels: 1 }), releaseSidFile: async () => {} } },
    _sidDecodePcm16: (p) => p,
    _sidPlayBuffer: (pcm, at, sources, channels, output) => played.push({ at, output }),
    _sidPlayerAudio: () => ac, _sidExtGain: master, _sidExtSources: new Set(),
    _sidStop() {}, _sidPlayerAheadSeconds: () => 3, _sidPlayerBufferSize: () => 0, showViceToast() {},
    _sidPlayerShowTune() {}, _sidEngineLabel: () => "", _sidEngineName: () => "", _sidExtStop() {},
    _sidPlaylist: [], _sidPlaylistIndex: -1, _sidPreviewModel: "8580", _sidPreviewEngine: "resid", _sidExternalCore: null,
  };
  vm.createContext(context);
  vm.runInContext(`${CONSTS} var _playerNormalize = ${normalize}, _playerNormNode = null;
    ${NORM.map(fnSource).join("\n")}
    function _channelMonitorQueue() {}
    ${fnSource("_vaSidPlayFileBytes")}
    this.play = _vaSidPlayFileBytes; this.node = () => _playerNormNode;`, context);
  return { context, played, master };
}

test("on: the tune starts at its measured level, through the stage in front of the master gain", async () => {
  const { context, played, master } = player(true);
  assert.equal(await context.play([1], "t.sid"), true);
  const node = context.node();
  assert.equal(node.to, master);
  assert.ok(played.length >= 4, "the held 2 seconds are played too");
  assert.ok(played.every((p) => p.output === node));
  // constant 0.1 = -20 dB: raised by 2 dB
  assert.ok(Math.abs(node.gain.value - Math.pow(10, 2 / 20)) < 0.01, String(node.gain.value));
  assert.ok(played[0].at < 0.2, "from the beginning of the tune, not 2 s late");
});

test("off: the level is left alone, and nothing is held back", async () => {
  const { context, played } = player(false);
  assert.equal(await context.play([1], "t.sid"), true);
  assert.equal(context.node().gain.value, 1);
  assert.equal(played.length, 6, "3 s ahead");
});

test("the button, its setting and its label in the seven languages, without modules", () => {
  assert.match(read("www/index.html"), /id="websid-play-normalize"/);
  assert.match(source, /_playerSetNormalize\(localStorage\.getItem\(_PLAYER_NORM_STORE\) === "1"\)/);
  const context = {};
  vm.createContext(context);
  vm.runInContext(read("www/i18n.js") + "\n;this.__t = translations;", context);
  for (const lang of ["hu", "en", "es", "de", "nl", "pl", "it"]) {
    const text = context.__t[lang].sidPlayerNormalize;
    assert.equal(typeof text, "string", lang);
    assert.doesNotMatch(text, /mod/i, lang);
  }
});

test("a boost the new peak no longer allows drops at once, other changes glide", () => {
  const context = { Math, Infinity };
  vm.createContext(context);
  vm.runInContext(`${fnSource("_playerNormGlide")}; this.glide = _playerNormGlide;`, context);
  const calls = [];
  const param = { setTargetAtTime: (value, time, tau) => calls.push({ value, time, tau }) };

  // quiet intro raised 4x (peak 0.2), then a loud part: the peak 0.6 allows only 1.5x
  context.glide(param, 4, 1.5, 0.6, 10, 2);
  assert.equal(calls[0].value, 1.5);
  assert.ok(calls[0].tau < 0.01, "fast: " + calls[0].tau);
  assert.ok(calls[0].time <= 10 && calls[0].time >= 9.9, "just before the loud audio: " + calls[0].time);
  // within what the peak allows: a slow glide from the audio's start
  context.glide(param, 1.5, 1.2, 0.6, 12, 2);
  assert.deepEqual({ ...calls[1] }, { value: 1.2, time: 12, tau: 2 });
  // raising the gain is always slow
  context.glide(param, 1.2, 2, 0.3, 14, 2);
  assert.equal(calls[2].tau, 2);
  // a loud tune not boosted is lowered slowly
  context.glide(param, 1, 0.7, 0.95, 16, 2);
  assert.equal(calls[3].tau, 2);
  // audio already due starts from now, not in the past
  context.glide(param, 1, 0.8, 0.5, 1, 2);
  assert.equal(calls[4].time, 2);
});
