const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");

function fnSource(name) {
  const start = appJs.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `Missing ${name}`);
  const sourceStart = appJs.slice(start - 6, start) === "async " ? start - 6 : start;
  let depth = 0;
  for (let i = start; i < appJs.length; i++) {
    if (appJs[i] === "{") depth++;
    else if (appJs[i] === "}" && --depth === 0) return appJs.slice(sourceStart, i + 1);
  }
  throw new Error(`Could not parse ${name}`);
}

test("stopping for an external SID does not preload the editor stream", () => {
  let preloads = 0, externalStops = 0, webSidPauses = 0;
  const ctx = {
    _sidTimer: null,
    _sidPlaybackUsingWebSid: false,
    _sidExternalCore: {},
    _sidWaStop() {},
    _sidExternalCoreStop() { externalStops++; },
    _sidStreamSilence() {},
    _webSidPause() { webSidPauses++; },
    _sidStreamPreload() { preloads++; },
    _sidUpdatePauseButton() {},
    _sidBuildSongList() {},
    document: { getElementById() { return null; } },
  };
  vm.createContext(ctx);
  vm.runInContext(`${fnSource("_sidStop")}; this.stop = _sidStop;`, ctx);
  ctx.stop(false);
  assert.equal(preloads, 0);
  assert.equal(externalStops, 0);
  assert.equal(webSidPauses, 0);
  ctx.stop(false, true);
  assert.equal(externalStops, 1);
  assert.equal(webSidPauses, 1);
  ctx.stop();
  assert.equal(preloads, 1);
});

test("Stop silences the editor's WebSID playback, without closing the SID Player", () => {
  let enginePauses = 0, windowPauses = 0;
  const ctx = {
    _sidTimer: null,
    _sidPlaybackUsingWebSid: true,
    _webSidActive: true,
    _sidExternalCore: null,
    ScriptNodePlayer: { getInstance() { return { pause() { enginePauses++; } }; } },
    _sidWaStop() {},
    _sidStreamSilence() {},
    _webSidPause() { windowPauses++; },
    _sidStreamPreload() {},
    _sidUpdatePauseButton() {},
    _sidBuildSongList() {},
    document: { getElementById() { return null; } },
  };
  vm.createContext(ctx);
  vm.runInContext(`${fnSource("_sidStop")}; this.stop = _sidStop;`, ctx);
  ctx.stop();
  assert.equal(enginePauses, 1);
  assert.equal(windowPauses, 0);
  assert.equal(ctx._webSidActive, false);
  assert.equal(ctx._sidPlaybackUsingWebSid, false);
  ctx.stop();
  assert.equal(enginePauses, 1, "nothing of the editor is playing any more");
});

test("WebSID file playback remains available", async () => {
  const calls = { stop: [], resume: 0, shown: [] };
  const ctx = {
    Blob,
    Uint8Array,
    URL: { createObjectURL() { return "blob:external-sid"; }, revokeObjectURL() {} },
    _sidPreviewEngine: "websid",
    _sidStream: null,
    _webSidBlobUrl: null,
    _webSidLoadSeq: 0,
    _webSidActive: false,
    _sidStop(...args) { calls.stop.push(args); },
    _webSidInit: async () => true,
    _sidApplyMasterVolume() {},
    _webSidShowExternalDialog(name) { calls.shown.push(name); },
    showViceToast(message) { throw new Error(message); },
    ScriptNodePlayer: {
      loadMusicFromURL() { return Promise.resolve(); },
      getInstance() { return { resume() { calls.resume++; } }; },
    },
  };
  vm.createContext(ctx);
  vm.runInContext(`${fnSource("_webSidPlayFileBytes")}; this.play = _webSidPlayFileBytes;`, ctx);
  const bytes = new Uint8Array(0x7c);
  bytes.set([0x50, 0x53, 0x49, 0x44]);
  assert.equal(await ctx.play(bytes, "example.sid"), true);
  assert.deepEqual(calls.stop, [[false, true]]);
  assert.equal(calls.resume, 1);
  assert.deepEqual(calls.shown, ["example.sid"]);
  assert.equal(ctx._webSidActive, true);

  // .sid files are played only from the toolbar SID player, not the SID Editor menu
  const html = fs.readFileSync(path.join(__dirname, "..", "www", "index.html"), "utf8");
  assert.ok(!html.includes('id="sid-play-sid"'));
  assert.ok(html.includes('id="sid-player-btn"'));
  assert.ok(fnSource("_sidPlayerPlayIndex").includes("_sidExtStartFile"));
  const start = fnSource("_sidExtStartFile");
  assert.ok(start.includes("_webSidPlayFileBytes"));
  assert.ok(start.includes("_sidUsesVaCore()"));
  assert.ok(start.includes("_vaSidPlayFileBytes"));
});

test("VA SID Core renders an external PSID without WebSID", async () => {
  const calls = { render: [], release: [], shown: [], sources: [] };
  const ac = { currentTime: 0, sampleRate: 44100 };
  const ctx = {
    Uint8Array, Float32Array, Promise, Array,
    crypto: { randomUUID() { return "sid-session-1"; } },
    window: { electronAPI: {
      renderSidFile(payload) { calls.render.push(payload); return Promise.resolve({ channels: 1, pcm: "AAAAAA==" }); },
      releaseSidFile(id) { calls.release.push(id); return Promise.resolve(); },
    } },
    _sidExternalCore: null,
    _VA_SID_CORE_VERSION: "1.0",
    _sidPreviewModel: "6581",
    _sidPreviewSources: new Set(),
    _sidExtSources: new Set(),
    _sidStop() {},
    _sidEnsureAudio() { return ac; },
    _sidDecodePcm16() { return new Float32Array(4410); },
    _sidPlayBuffer(pcm, when) { calls.sources.push({ pcm, when }); },
    _webSidShowExternalDialog(name, engine) { calls.shown.push(name); calls.engine = engine; },
    _webSidHideExternalDialog() {},
    showViceToast(message) { throw new Error(message); },
    setInterval(callback) { calls.tick = callback; return 1; },
    clearInterval() {},
  };
  vm.createContext(ctx);
  vm.runInContext(`${fnSource("_sidExternalCoreStop")}; ${fnSource("_sidVaCoreLabel")}; ${fnSource("_sidPlayerAheadSeconds")}; ${fnSource("_sidPlayerBufferSize")}; ${fnSource("_vaSidPlayFileBytes")}; this.play = _vaSidPlayFileBytes; this.stop = _sidExternalCoreStop;`, ctx);
  const bytes = new Uint8Array([80, 83, 73, 68]);
  assert.equal(await ctx.play(bytes, "example.sid"), true);
  assert.ok(calls.render.length > 1);
  assert.equal(calls.render[0].model, "6581");
  assert.equal(calls.render[0].frames, 20);
  assert.deepEqual(Array.from(calls.render[0].fileBytes), Array.from(bytes));
  assert.equal(calls.render[1].fileBytes, undefined);
  assert.equal(calls.sources.length, calls.render.length);
  assert.ok(ctx._sidExternalCore.nextTime - ac.currentTime >= 10);
  for (let i = 1; i < calls.sources.length; i++) {
    assert.ok(Math.abs(calls.sources[i].when - calls.sources[i - 1].when - 0.1) < 1e-9);
  }
  assert.deepEqual(calls.shown, ["example.sid"]);
  assert.equal(calls.engine, "VA SID Core v1.0 (MOS 6581)");
  ac.currentTime = 4;
  await ctx._sidExternalCore.pump();
  assert.ok(ctx._sidExternalCore.nextTime - ac.currentTime >= 10);
  ctx.stop();
  await Promise.resolve();
  await Promise.resolve();
  assert.deepEqual(calls.release, ["sid-session-1"]);
});

test("a stereo .sid render is timed by its samples per channel", async () => {
  const buffers = [];
  const ac = { currentTime: 0, sampleRate: 44100 };
  const ctx = {
    Uint8Array, Float32Array, Promise, Array,
    crypto: { randomUUID() { return "sid-session-2"; } },
    window: { electronAPI: {
      renderSidFile() { return Promise.resolve({ channels: 2, pcm: "" }); },
      releaseSidFile() { return Promise.resolve(); },
    } },
    _sidExternalCore: null,
    _VA_SID_CORE_VERSION: "1.0",
    _sidPreviewModel: "8580",
    _sidExtSources: new Set(),
    _sidPlaylist: [],
    _sidStop() {},
    _sidEnsureAudio() { return ac; },
    _sidDecodePcm16() { return new Float32Array(8820); },
    _sidPlayBuffer(pcm, when, sources, channels) { buffers.push({ when, channels }); },
    _webSidShowExternalDialog() {},
    _webSidHideExternalDialog() {},
    showViceToast(message) { throw new Error(message); },
    setInterval() { return 1; },
    clearInterval() {},
  };
  vm.createContext(ctx);
  vm.runInContext(`${fnSource("_sidExternalCoreStop")}; ${fnSource("_sidVaCoreLabel")}; ${fnSource("_sidPlayerAheadSeconds")}; ${fnSource("_sidPlayerBufferSize")}; ${fnSource("_vaSidPlayFileBytes")}; this.play = _vaSidPlayFileBytes; this.stop = _sidExternalCoreStop;`, ctx);
  assert.equal(await ctx.play(new Uint8Array([80, 83, 73, 68]), "stereo.sid"), true);
  assert.ok(buffers.length > 1);
  assert.equal(buffers[0].channels, 2);
  // 8820 interleaved values = 4410 samples = 0.1 s
  assert.ok(Math.abs(buffers[1].when - buffers[0].when - 0.1) < 1e-9);
  assert.equal(ctx._sidExternalCore.renderedMs, buffers.length * 100);
  ctx.stop();
});

test("the audio buffer splits interleaved stereo into its channels", () => {
  const made = [];
  const ac = {
    currentTime: 0, sampleRate: 44100, destination: {},
    createBuffer(channels, samples) {
      const buf = { channels, samples, data: [], copyToChannel(data, c) { buf.data[c] = Array.from(data); } };
      made.push(buf);
      return buf;
    },
    createBufferSource() { return { connect() {}, start() {} }; },
  };
  const ctx = { Float32Array, Math, _sidMasterGain: null, _sidPreviewSources: new Set(), _sidEnsureAudio() { return ac; } };
  vm.createContext(ctx);
  vm.runInContext(`${fnSource("_sidPlayBuffer")}; this.play = _sidPlayBuffer;`, ctx);
  ctx.play(new Float32Array([0.5, -0.5, 0.25, -0.25]), 0, new Set(), 2);
  assert.deepEqual([made[0].channels, made[0].samples], [2, 2]);
  assert.deepEqual(made[0].data, [[0.5, 0.25], [-0.5, -0.25]]);
  ctx.play(new Float32Array([0.5, 0.25]), 0);
  assert.deepEqual([made[1].channels, made[1].samples], [1, 2]);
  assert.deepEqual(made[1].data, [[0.5, 0.25]]);
});

test("the PSID header of a two-SID tune is v3 with the second SID's address", () => {
  const ctx = { Uint8Array, TextEncoder };
  vm.createContext(ctx);
  vm.runInContext(`${fnSource("_buildPsidBytes")}; this.build = _buildPsidBytes;`, ctx);
  const one = ctx.build(new Uint8Array([0, 0x10, 0x60]), 0x1000, 0, "x");
  assert.deepEqual([one[5], one[0x7A]], [2, 0]);
  const two = ctx.build(new Uint8Array([0, 0x10, 0x60]), 0x1000, 0, "x", "2026", 0xD420);
  assert.deepEqual([two[5], two[0x7A], two[0x7B]], [3, 0x42, 0]);
  assert.equal(ctx.build(new Uint8Array([0, 0x10, 0x60]), 0x1000, 0, "x", "2026", 0xDE00)[0x7A], 0xE0);
  assert.equal(two.length, 0x7C + 3);
});

test("a two-SID VA Core preview is stereo, with one restart mask for six voices", async () => {
  const ctx = {
    Math, Array, Promise, _sidPreviewModel: "8580",
    window: { electronAPI: { renderSidPreview(p) { ctx.payload = p; return Promise.resolve("x"); } } },
    _sidDecodePcm16() { return new Float32Array(4); },
  };
  vm.createContext(ctx);
  vm.runInContext(`${fnSource("_sidVaCoreFrame")}; ${fnSource("_sidRenderVaCoreFrames")};
    this.frame = _sidVaCoreFrame; this.render = _sidRenderVaCoreFrames;`, ctx);
  const frame = ctx.frame({ regs: new Uint8Array(50), trig: [true, false, false, false, false, true] });
  assert.equal(frame.length, 51);
  assert.equal(frame[50], 0x21);
  assert.equal((await ctx.render([frame], 44100)).channels, 2);
  assert.equal(ctx.payload.frames[0].length, 51);
  const mono = ctx.frame({ regs: new Uint8Array(25), trig: [false, true, false] });
  assert.equal(mono.length, 26);
  assert.equal((await ctx.render([mono], 44100)).channels, undefined);
});

test("the Web Audio synth renders two SIDs to interleaved stereo", () => {
  const ctx = { Math, Float32Array, Uint8Array, Array };
  vm.createContext(ctx);
  vm.runInContext(`${fnSource("_sidRenderEngine")};
    function _sidSynthNew() { return {}; }
    function _sidEngFrame() {}
    function _sidSynthRender(sy, regs, trig, out, off, count) { for (let i = 0; i < count; i++) out[off + i] = regs[0]; }
    this.render = _sidRenderEngine;`, ctx);
  const regs = new Uint8Array(50);
  regs[0] = 1; regs[25] = 2;
  const out = ctx.render({ chips: 2, regs, trig: new Array(6).fill(false) }, 1, 100);
  assert.equal(out.channels, 2);
  assert.deepEqual(Array.from(out), [1, 2, 1, 2]);
  const mono = ctx.render({ chips: 1, regs: regs.slice(0, 25), trig: [false, false, false] }, 1, 100);
  assert.equal(mono.channels, undefined);
  assert.deepEqual(Array.from(mono), [1, 1]);
});

test("the audio buffer takes its channel count from the rendered data", () => {
  const made = [];
  const ac = { currentTime: 0, sampleRate: 44100, destination: {},
    createBuffer(channels, samples) { const b = { channels, samples, copyToChannel() {} }; made.push(b); return b; },
    createBufferSource() { return { connect() {}, start() {} }; } };
  const ctx = { Float32Array, Math, _sidMasterGain: null, _sidPreviewSources: new Set(), _sidEnsureAudio() { return ac; } };
  vm.createContext(ctx);
  vm.runInContext(`${fnSource("_sidPlayBuffer")}; this.play = _sidPlayBuffer;`, ctx);
  const data = new Float32Array(4);
  data.channels = 2;
  ctx.play(data, 0);
  assert.deepEqual([made[0].channels, made[0].samples], [2, 2]);
});

test("VA arpeggio renders one voice once and schedules notes after a delayed render", async () => {
  let finish;
  const calls = { notes: [], buffers: [], timers: [] };
  const ac = { currentTime: 0, sampleRate: 44100 };
  const ctx = {
    document: { getElementById: () => null },
    _sidGetChordNotes: () => [48, 52, 55], _sidEnsureAudio() {}, _sidAudio: ac,
    _sidUsesVaCore: () => true, _sidCurInst: () => ({}),
    _sidTuneData: () => ({ insts: [{ r: 0 }] }), _SID_DCR: [20],
    _sidEngineNew: () => ({ v: [{ gate: 0 }] }),
    _sidEngNoteOn(eng, voice, note) { calls.notes.push({ voice, note }); eng.v[0].gate = 1; },
    _sidRenderVaCore(eng, count, rate, hook) {
      for (let frame = 0; frame < count; frame++) hook(eng, frame);
      return new Promise(resolve => { finish = resolve; });
    },
    _sidPlayBuffer(data, when) { calls.buffers.push(when); },
    _sidFlashVirtualKeyboardNotes() {},
    setTimeout(fn, delay) { calls.timers.push(delay); }, console,
  };
  vm.createContext(ctx);
  vm.runInContext(fnSource("_sidPreviewArpeggio") + "; _sidPreviewArpeggio();", ctx);
  assert.deepEqual(calls.notes.map(n => n.note), [48, 52, 55, 48, 52, 55, 48, 52]);
  assert.ok(calls.notes.every(n => n.voice === 0));
  assert.equal(calls.buffers.length, 0);
  ac.currentTime = 5;
  finish(new Float32Array(100));
  await Promise.resolve();
  assert.deepEqual(calls.buffers, [5.02]);
  assert.deepEqual(calls.timers, [20, 140, 260, 380, 500, 620, 740, 860]);
});

test("external SID dialog: pause freezes the counter, play resumes, stop resets and keeps the dialog", () => {
  let now = 0;
  const els = {};
  const el = () => ({ textContent: "", disabled: false, classList: { set: new Set(), toggle(c, on) { on ? this.set.add(c) : this.set.delete(c); } } });
  ["websid-play-time", "websid-play-dialog", "websid-play-play", "websid-play-pause", "websid-play-stop"].forEach((id) => { els[id] = el(); });
  const calls = { suspend: 0, resume: 0, coreStop: [] };
  const ctx = {
    performance: { now: () => now },
    setInterval() { return 1; }, clearInterval() {},
    document: { getElementById: (id) => els[id] || null },
    _sidAudio: { suspend() { calls.suspend++; } },
    _sidEnsureAudio() { calls.resume++; },
    _sidExternalCore: { paused: false },
    _sidExternalCoreStop(keep) { calls.coreStop.push(keep); ctx._sidExternalCore = null; },
  };
  vm.createContext(ctx);
  vm.runInContext(`let _sidExtFile = null, _sidExtStatus = "stopped", _sidExtElapsed = 0, _sidExtRunSince = null, _sidExtTick = null, _sidExtStarting = false, _sidSeekDragging = false;
    function _sidPlayerTickUi() {}
    ${["_sidExtFormatTime", "_sidExtElapsedMs", "_sidExtRender", "_sidExtSetStatus", "_sidExtPlay", "_sidExtPause", "_sidExtStop"].map(fnSource).join("\n")}
    this.api = { set: _sidExtSetStatus, play: _sidExtPlay, pause: _sidExtPause, stop: _sidExtStop, status: () => _sidExtStatus };`, ctx);
  const { api } = ctx;
  api.set("playing");
  now = 65400;
  api.pause();
  assert.equal(api.status(), "paused");
  assert.equal(ctx._sidExternalCore.paused, true);
  assert.equal(calls.suspend, 1);
  assert.equal(els["websid-play-time"].textContent, "01:05");
  now = 200000;
  api.play();
  assert.equal(api.status(), "playing");
  assert.equal(calls.resume, 1);
  now = 210000;
  api.pause();
  assert.equal(els["websid-play-time"].textContent, "01:15");
  api.stop();
  assert.deepEqual(calls.coreStop, [true]);
  assert.equal(api.status(), "stopped");
  assert.equal(els["websid-play-time"].textContent, "00:00");
  assert.equal(els["websid-play-pause"].disabled, true);
  assert.equal(els["websid-play-stop"].disabled, true);
});

test("SID player playlist: PSID metadata, prev restarts then steps back, remove keeps the index", () => {
  const started = [];
  const toasts = [];
  const ctx = {
    crypto: { randomUUID: (() => { let n = 0; return () => "id" + (++n); })() },
    performance: { now: () => 0 },
    document: { getElementById() { return null; } },
    t: (k) => k,
    tf: (k, v) => k + ":" + v.name,
    showViceToast(msg) { toasts.push(msg); },
    _sidExtStatus: "stopped",
    _sidExtStarting: false,
    _sidExtFile: null,
    elapsed: 0,
    _sidExtElapsedMs() { return ctx.elapsed; },
    _sidExtStartFile(bytes, name) { started.push(name); },
    _sidExtStop() { ctx._sidExtStatus = "stopped"; },
    _sidExtFormatTime: () => "",
    _sidPlayerShow() {},
    _sidPlayerPersist() {},
  };
  vm.createContext(ctx);
  vm.runInContext(`const _SID_TUNE_LENGTH_MS = 180000; var _sidPlaylist = [], _sidPlaylistIndex = -1, _sidSeekDragging = false, _sidShuffle = false, _sidShuffleHistory = [];
    ${["_sidPsidInfo", "_sidValidSong", "_sidPlayerItem", "_sidPlayerTuneMs", "_sidPlayerAdd", "_sidPlayerPlayIndex", "_sidPlayerPrev", "_sidPlayerNext", "_sidPlayerRemove",
      "_sidPlayerLengthMs", "_sidPlayerTickUi", "_sidPlayerRenderList"].map(fnSource).join("\n")}
    this.api = { add: _sidPlayerAdd, prev: _sidPlayerPrev, next: _sidPlayerNext, remove: _sidPlayerRemove,
      list: () => _sidPlaylist, index: () => _sidPlaylistIndex };`, ctx);
  const psid = (title) => {
    const bytes = new Uint8Array(0x80);
    bytes.set([0x50, 0x53, 0x49, 0x44]);
    [...title].forEach((ch, i) => { bytes[0x16 + i] = ch.charCodeAt(0); });
    [..."Composer"].forEach((ch, i) => { bytes[0x36 + i] = ch.charCodeAt(0); });
    return bytes;
  };
  const { api } = ctx;
  api.add([{ name: "a.sid", bytes: psid("Alpha") }, { name: "x.prg", bytes: new Uint8Array(0x80) }, { name: "b.sid", bytes: psid("Beta") }], false);
  assert.deepEqual(toasts, ["sidPlayerNotSid:x.prg"]);
  assert.equal(api.list().length, 2);
  assert.equal(api.list()[0].info.title, "Alpha");
  assert.equal(api.list()[0].info.author, "Composer");
  assert.deepEqual(started, ["a.sid"]);
  api.next();
  assert.deepEqual(started, ["a.sid", "b.sid"]);
  ctx.elapsed = 5000;
  api.prev();
  assert.equal(api.index(), 1, "after 3 s Previous restarts the current tune");
  ctx.elapsed = 1000;
  api.prev();
  assert.equal(api.index(), 0);
  api.remove(api.list()[1].id);
  assert.equal(api.index(), 0);
  assert.equal(api.list().length, 1);
});

test("switching tunes stops the current one through the player, keeping the window open", async () => {
  const order = [];
  const ctx = {
    _sidExtStatus: "playing",
    _sidExtFile: null,
    _sidExtStarting: false,
    _sidExtStartSeq: 0,
    _vaFullAllowed() { return true; },
    _sidExtStop() { order.push("player-stop"); ctx._sidExtStatus = "stopped"; },
    _sidUsesVaCore: () => true,
    _vaSidPlayFileBytes: async () => { order.push("start"); return true; },
    _webSidPlayFileBytes: async () => true,
  };
  vm.createContext(ctx);
  vm.runInContext(`${fnSource("_sidExtStartFile")}; this.start = _sidExtStartFile;`, ctx);
  assert.equal(await ctx.start(new Uint8Array(4), "b.sid"), true);
  assert.deepEqual(order, ["player-stop", "start"]);
  assert.ok(appJs.includes("// the event is queued: the window may have been reopened since\n    if (dialog.open) return;")
    || appJs.includes("// the event is queued: the window may have been reopened since\r\n    if (dialog.open) return;"));
});

test("SID playlist file (.sidpl) round-trips names, tune bytes and the current entry", () => {
  const ctx = { btoa, atob, Uint8Array, _sidPlaylistIndex: 1 };
  vm.createContext(ctx);
  vm.runInContext(`const _SID_PLAYLIST_FORMAT = "va-sid-playlist";
    ${["_sidBytesToBase64", "_sidBase64ToBytes", "_sidPlaylistToJson", "_sidPlaylistFromJson"].map(fnSource).join("\n")}
    this.api = { toJson: _sidPlaylistToJson, fromJson: _sidPlaylistFromJson };`, ctx);
  const big = new Uint8Array(70000).map((_, i) => (i * 7) & 0xff);
  ctx._sidPlaylist = [{ name: "a.sid", bytes: new Uint8Array([0x50, 0x53, 0x49, 0x44, 0xff]) }, { name: "b.sid", bytes: big }];
  const json = JSON.parse(JSON.stringify(ctx.api.toJson()));
  assert.equal(json.format, "va-sid-playlist");
  const back = ctx.api.fromJson(json);
  assert.equal(back.current, 1);
  assert.deepEqual(Array.from(back.entries, (e) => e.name), ["a.sid", "b.sid"]);
  assert.deepEqual(Array.from(back.entries[0].bytes), [0x50, 0x53, 0x49, 0x44, 0xff]);
  assert.deepEqual(Array.from(back.entries[1].bytes), Array.from(big));
  assert.equal(ctx.api.fromJson({ format: "other", items: [] }), null);
});

test("VA SID Core seek sends whole milliseconds (the command takes u32)", () => {
  assert.ok(fnSource("_vaSidPlayFileBytes").includes("skipMs: Math.max(0, Math.round(state.skipMs))"));
  assert.ok(fnSource("_vaSidSeek").includes("state.skipMs = Math.round(targetMs - state.renderedMs);"));
});

test("SID player auto-advance moves one tune on, the UI refresh never advances", () => {
  const started = [];
  const ctx = {
    crypto: { randomUUID: (() => { let n = 0; return () => "id" + (++n); })() },
    document: { getElementById() { return null; } },
    t: (k) => k,
    tf: (k) => k,
    showViceToast() {},
    _sidExtStatus: "playing",
    _sidExtStarting: false,
    _sidExtFile: null,
    _sidExtElapsedMs: () => 200000,
    _sidExtStartFile(bytes, name) { started.push(name); },
    _sidExtFormatTime: () => "",
    _sidPlayerShow() {},
    _sidPlayerPersist() {},
  };
  vm.createContext(ctx);
  vm.runInContext(`const _SID_TUNE_LENGTH_MS = 180000; var _sidPlaylist = [], _sidPlaylistIndex = 0, _sidSeekDragging = false, _sidShuffle = false, _sidShuffleHistory = [];
    ${["_sidPsidInfo", "_sidValidSong", "_sidPlayerTuneMs", "_sidPlayerPlayIndex", "_sidPlayerNext", "_sidPlayerLengthMs", "_sidPlayerTickUi",
      "_sidPlayerRenderList", "_sidPlayerAutoAdvance"].map(fnSource).join("\n")}
    this.api = { tick: _sidPlayerTickUi, render: _sidPlayerRenderList, advance: _sidPlayerAutoAdvance,
      set(list) { _sidPlaylist = list; }, index: () => _sidPlaylistIndex };`, ctx);
  const info = { title: "", author: "", released: "", songs: 1, startSong: 1 };
  ctx.api.set(["a", "b", "c", "d"].map((name) => ({ id: name, name, bytes: new Uint8Array(1), info, song: 1 })));
  ctx.api.tick();
  ctx.api.render();
  assert.deepEqual(started, [], "the UI refresh must not start tunes");
  ctx.api.advance();
  assert.deepEqual(started, ["b"], "one timer tick advances exactly one tune");
  assert.equal(ctx.api.index(), 1);
});

test("SID player uses the HVSC subtune length for the seek bar and auto-advance", () => {
  const started = [];
  let elapsed = 20000;
  const ctx = {
    document: { getElementById() { return null; } },
    _sidExtStatus: "playing",
    _sidExtStarting: false,
    _sidExtElapsedMs: () => elapsed,
    _sidExtStartFile(bytes, name) { started.push(name); },
    _sidPlayerRenderList() {},
    _sidPlayerPersist() {},
  };
  vm.createContext(ctx);
  vm.runInContext(`const _SID_TUNE_LENGTH_MS = 180000; var _sidPlaylist = [], _sidPlaylistIndex = 0, _sidShuffle = false, _sidShuffleHistory = [];
    ${["_sidPlayerTuneMs", "_sidPlayerPlayIndex", "_sidPlayerNext", "_sidPlayerLengthMs", "_sidPlayerAutoAdvance"].map(fnSource).join("\n")}
    this.api = { length: _sidPlayerLengthMs, advance: _sidPlayerAutoAdvance, set(list) { _sidPlaylist = list; } };`, ctx);
  ctx.api.set([
    { id: "a", name: "a", song: 2, lengths: [90000, 30000] },
    { id: "b", name: "b", song: 1, lengths: null },
  ]);
  assert.equal(ctx.api.length(), 30000, "subtune 2 of the HVSC lengths");
  ctx.api.advance();
  assert.deepEqual(started, [], "not before the subtune ends");
  elapsed = 30000;
  ctx.api.advance();
  assert.deepEqual(started, ["b"]);
  elapsed = 20000;
  assert.equal(ctx.api.length(), 180000, "no HVSC length: the default");
});

test("SID player volume knob maps 0-100 onto a 270 degree sweep", () => {
  const attrs = {};
  const el = (name) => ({ setAttribute(k, v) { attrs[name + "." + k] = v; } });
  const knob = {
    querySelector(sel) { return el(sel); },
    setAttribute(k, v) { attrs["knob." + k] = v; },
  };
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(`const _SID_KNOB_SWEEP = 270; ${["_sidKnobPoint", "_sidKnobArc", "_sidKnobRender"].map(fnSource).join("\n")}
    this.render = _sidKnobRender; this.arc = _sidKnobArc;`, ctx);
  ctx.render(knob, 0);
  assert.equal(attrs[".websid-play-knob-pointer.transform"], "rotate(-135.0 20 20)");
  assert.equal(attrs[".websid-play-knob-value.d"], "", "no value arc at zero");
  assert.equal(attrs["knob.aria-valuenow"], "0");
  ctx.render(knob, 100);
  assert.equal(attrs[".websid-play-knob-pointer.transform"], "rotate(135.0 20 20)");
  assert.match(attrs[".websid-play-knob-value.d"], / 0 1 1 /, "a full sweep uses the large arc");
  ctx.render(knob, 50);
  assert.equal(attrs[".websid-play-knob-pointer.transform"], "rotate(0.0 20 20)");
  assert.match(attrs[".websid-play-knob-value.d"], / 0 0 1 /);
});

test("SID player seek jumps the counter at once and coalesces quick clicks", async () => {
  const seeks = [];
  let release;
  const ctx = {
    performance: { now: () => 1000 },
    _sidExtStarting: false,
    _sidExtStatus: "playing",
    _sidExtElapsed: 0,
    _sidExtRunSince: 0,
    _sidExternalCore: {},
    _vaSidSeek: (state, ms) => { seeks.push(ms); return new Promise((r) => { release = r; }); },
    _sidExtRender() {},
    document: { getElementById() { return { classList: { add() {}, remove() {} } }; } },
  };
  vm.createContext(ctx);
  vm.runInContext(`var _sidExtSeekTarget = null, _sidExtSeeking = false; ${fnSource("_sidPlayerCanSeek")}; ${fnSource("_sidExtSeek")}; this.seek = _sidExtSeek;`, ctx);
  const first = ctx.seek(60000);
  assert.equal(ctx._sidExtElapsed, 60000, "the counter jumps before the seek finishes");
  ctx.seek(90000);
  ctx.seek(120000);
  assert.equal(ctx._sidExtElapsed, 120000);
  release();
  await new Promise((r) => setImmediate(r));
  release();
  await first;
  assert.deepEqual(seeks, [60000, 120000], "only the newest pending target runs");
});

test("SID player: WebSID cannot seek, the request is ignored", async () => {
  const ctx = {
    performance: { now: () => 0 },
    _sidExtStarting: false,
    _sidExtStatus: "playing",
    _sidExtElapsed: 5000,
    _sidExtRunSince: 0,
    _sidExternalCore: null,
    _vaSidSeek() { throw new Error("must not seek"); },
    _sidExtRender() {},
    document: { getElementById() { return null; } },
  };
  vm.createContext(ctx);
  vm.runInContext(`var _sidExtSeekTarget = null, _sidExtSeeking = false; ${fnSource("_sidPlayerCanSeek")}; ${fnSource("_sidExtSeek")}; this.seek = _sidExtSeek; this.can = _sidPlayerCanSeek;`, ctx);
  assert.equal(ctx.can(), false);
  await ctx.seek(60000);
  assert.equal(ctx._sidExtElapsed, 5000, "the counter stays where it was");
  ctx._sidExternalCore = {};
  assert.equal(ctx.can(), true, "VA SID Core can seek");
});

test("SID player shuffle: every tune once per round, Previous steps back along the random order", () => {
  const started = [];
  const ctx = {
    crypto: { randomUUID: (() => { let n = 0; return () => "id" + (++n); })() },
    document: { getElementById() { return null; } },
    t: (k) => k,
    tf: (k) => k,
    showViceToast() {},
    _sidExtStatus: "playing",
    _sidExtStarting: false,
    _sidExtFile: null,
    _sidExtElapsedMs: () => 0,
    _sidExtStartFile(bytes, name) { started.push(name); },
    _sidExtFormatTime: () => "",
    _sidPlayerShow() {},
    _sidPlayerPersist() {},
    Math,
  };
  vm.createContext(ctx);
  vm.runInContext(`const _SID_TUNE_LENGTH_MS = 180000; var _sidPlaylist = [], _sidPlaylistIndex = -1, _sidSeekDragging = false, _sidShuffle = false, _sidShuffleHistory = [];
    ${["_sidPsidInfo", "_sidValidSong", "_sidPlayerItem", "_sidPlayerTuneMs", "_sidPlayerAdd", "_sidPlayerPlayIndex", "_sidPlayerPrev", "_sidPlayerNext", "_sidPlayerSetShuffle",
      "_sidPlayerLengthMs", "_sidPlayerTickUi", "_sidPlayerRenderList"].map(fnSource).join("\n")}
    this.api = { add: _sidPlayerAdd, next: _sidPlayerNext, prev: _sidPlayerPrev, shuffle: _sidPlayerSetShuffle };`, ctx);
  const psid = () => { const b = new Uint8Array(0x80); b.set([0x50, 0x53, 0x49, 0x44]); return b; };
  const names = ["a.sid", "b.sid", "c.sid", "d.sid"];
  ctx.api.add(names.map((name) => ({ name, bytes: psid() })), true);
  ctx.api.shuffle(true);
  for (let i = 0; i < 3; i++) ctx.api.next();
  assert.deepEqual([...started].sort(), names, "one round plays every tune once");
  const order = started.slice();
  ctx.api.prev();
  assert.equal(started[started.length - 1], order[order.length - 2], "Previous goes back in the random order");
  ctx.api.next();
  assert.equal(started.length, 6, "a new round starts after every tune has played");
});

