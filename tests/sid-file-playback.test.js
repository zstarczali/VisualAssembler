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
  let preloads = 0;
  const ctx = {
    _sidTimer: null,
    _sidWaStop() {},
    _sidExternalCoreStop() {},
    _sidStreamSilence() {},
    _webSidPause() {},
    _sidStreamPreload() { preloads++; },
    _sidUpdatePauseButton() {},
    _sidBuildSongList() {},
    document: { getElementById() { return null; } },
  };
  vm.createContext(ctx);
  vm.runInContext(`${fnSource("_sidStop")}; this.stop = _sidStop;`, ctx);
  ctx.stop(false);
  assert.equal(preloads, 0);
  ctx.stop();
  assert.equal(preloads, 1);
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
  assert.deepEqual(calls.stop, [[false]]);
  assert.equal(calls.resume, 1);
  assert.deepEqual(calls.shown, ["example.sid"]);
  assert.equal(ctx._webSidActive, true);

  const fileHandler = appJs.slice(appJs.indexOf('onId("sid-play-sid"'), appJs.indexOf('onId("websid-play-stop"'));
  assert.ok(fileHandler.includes("_webSidPlayFileBytes"));
  assert.ok(fileHandler.includes("_sidUsesVaCore()"));
  assert.ok(fileHandler.includes("_vaSidPlayFileBytes"));
});

test("VA SID Core renders an external PSID without WebSID", async () => {
  const calls = { render: [], release: [], shown: [], sources: [] };
  const ac = { currentTime: 0, sampleRate: 44100 };
  const ctx = {
    Uint8Array, Float32Array, Promise, Array,
    crypto: { randomUUID() { return "sid-session-1"; } },
    window: { electronAPI: {
      renderSidFile(payload) { calls.render.push(payload); return Promise.resolve("AAAAAA=="); },
      releaseSidFile(id) { calls.release.push(id); return Promise.resolve(); },
    } },
    _sidExternalCore: null,
    _sidPreviewModel: "6581",
    _sidPreviewSources: new Set(),
    _sidStop() {},
    _sidEnsureAudio() { return ac; },
    _sidDecodePcm16() { return new Float32Array(4410); },
    _sidPlayBuffer(pcm, when) { calls.sources.push({ pcm, when }); },
    _webSidShowExternalDialog(name) { calls.shown.push(name); },
    _webSidHideExternalDialog() {},
    showViceToast(message) { throw new Error(message); },
    setInterval() { return 1; },
    clearInterval() {},
  };
  vm.createContext(ctx);
  vm.runInContext(`${fnSource("_sidExternalCoreStop")}; ${fnSource("_vaSidPlayFileBytes")}; this.play = _vaSidPlayFileBytes; this.stop = _sidExternalCoreStop;`, ctx);
  const bytes = new Uint8Array([80, 83, 73, 68]);
  assert.equal(await ctx.play(bytes, "example.sid"), true);
  assert.equal(calls.render.length, 1);
  assert.equal(calls.render[0].model, "6581");
  assert.deepEqual(Array.from(calls.render[0].fileBytes), Array.from(bytes));
  assert.equal(calls.sources.length, 1);
  assert.deepEqual(calls.shown, ["example.sid"]);
  ctx.stop();
  await Promise.resolve();
  await Promise.resolve();
  assert.deepEqual(calls.release, ["sid-session-1"]);
});
