const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");
const indexHtml = fs.readFileSync(path.join(__dirname, "..", "www", "index.html"), "utf8");
const i18n = fs.readFileSync(path.join(__dirname, "..", "www", "i18n.js"), "utf8");

function fnSource(name) {
  const start = appJs.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `Missing ${name}`);
  let depth = 0;
  for (let i = appJs.indexOf(") {", start); i < appJs.length; i++) {
    if (appJs[i] === "{") depth++;
    else if (appJs[i] === "}" && --depth === 0) return appJs.slice(start, i + 1);
  }
  throw new Error(`Could not parse ${name}`);
}

function load(names, globals = {}) {
  const ctx = { ...globals };
  vm.createContext(ctx);
  vm.runInContext(`const _CHANNEL_MONITOR_NOTES = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];
    ${names.map(fnSource).join("\n")}
    ${names.map((name) => `this.${name} = ${name};`).join("\n")}`, ctx);
  return ctx;
}

test("frames are queued against the audio clock and only the buffered ones are kept", () => {
  const ctx = load(["_channelMonitorQueue"], { _sidExtAudio: { currentTime: 10 } });
  const state = {};
  ctx._channelMonitorQueue(state, 10, [[1], [2], [3]], 50);
  assert.equal(state.monitor[1].time, 10.02);
  assert.equal(state.monitor[1].regs[0], 2);
  assert.equal(state.monitorClock, 985248);
  ctx._sidExtAudio.currentTime = 11;
  ctx._channelMonitorQueue(state, 11, [[4]], 59.83);
  assert.equal(state.monitor.length, 1);
  assert.equal(state.monitor[0].regs[0], 4);
  assert.equal(state.monitorClock, 1022730);
});

test("both SIDs keep separate envelopes and a frame advances them only once", () => {
  const ctx = load(["_channelMonitorFrame"], {
    _sidExtAudio: { currentTime: 2 },
    _sidAnaEnvStep(env, regs, b) { env.env += (regs[b + 4] & 1) ? 0.1 : 0; },
  });
  const regs = new Array(50).fill(0);
  regs[4] = 1;
  regs[25 + 7 + 4] = 1;
  const state = { monitor: [{ time: 1, regs }] };
  assert.equal(ctx._channelMonitorFrame(state).regs.length, 50);
  assert.equal(state.monitorEnv.length, 6);
  assert.equal(state.monitorEnv[0].env, 0.1);
  assert.equal(state.monitorEnv[4].env, 0.1);
  assert.equal(state.monitorEnv[3].env, 0);
  ctx._channelMonitorFrame(state);
  assert.equal(state.monitorEnv[0].env, 0.1);
});

test("a frame not sounding yet gives nothing", () => {
  const ctx = load(["_channelMonitorFrame"], { _sidExtAudio: { currentTime: 1 }, _sidAnaEnvStep() {} });
  assert.equal(ctx._channelMonitorFrame({ monitor: [{ time: 2, regs: [] }] }), null);
  assert.equal(ctx._channelMonitorFrame({}), null);
});

test("note name and level come from the voice's registers and envelope", () => {
  const { _channelMonitorVoices: voices } = load(["_channelMonitorVoices"]);
  const regs = new Array(25).fill(0);
  regs[24] = 15;
  // A-4: 440 Hz on PAL
  const freq = Math.round(440 * 16777216 / 985248);
  regs[0] = freq & 255;
  regs[1] = freq >> 8;
  regs[4] = 0x21;
  const on = voices(regs, [{ env: 0.5 }, { env: 1 }, { env: 1 }], 985248);
  assert.equal(on.length, 3);
  assert.equal(on[0].note, "A4");
  assert.equal(on[0].level, 0.5);
  assert.equal(on[1].note, "—", "no waveform is silent");
  assert.equal(on[1].level, 0);

  regs[4] = 0x29;
  assert.equal(voices(regs, [{ env: 1 }], 985248)[0].level, 0, "the test bit silences a voice");

  regs[4] = 0x21;
  regs[24] = 0;
  assert.equal(voices(regs, [{ env: 1 }], 985248)[0].note, "—", "volume 0 is silent");
});

test("voice 3 off silences only an unfiltered third voice", () => {
  const { _channelMonitorVoices: voices } = load(["_channelMonitorVoices"]);
  const regs = new Array(25).fill(0);
  regs[24] = 0x8f;
  regs[14] = 0;
  regs[15] = 0x20;
  regs[18] = 0x21;
  const envs = [{ env: 1 }, { env: 1 }, { env: 1 }];
  assert.equal(voices(regs, envs, 985248)[2].level, 0);
  regs[23] = 4;
  assert.equal(voices(regs, envs, 985248)[2].level, 1);
});

test("two SIDs give six voices labelled by chip", () => {
  const { _channelMonitorVoices: voices, _channelMonitorLabel: label } = load(["_channelMonitorVoices", "_channelMonitorLabel"]);
  const regs = new Array(50).fill(0);
  regs[24] = regs[49] = 15;
  regs[25] = 0;
  regs[26] = 0x20;
  regs[29] = 0x41;
  const list = voices(regs, [0, 1, 2, { env: 1 }].map((_, i) => i === 3 ? { env: 1 } : { env: 0 }), 985248);
  assert.equal(list.length, 6);
  assert.equal(list[3].level, 1);
  assert.equal(list[0].level, 0);
  assert.equal(label(4, 6), "S2 V2");
  assert.equal(label(2, 3), "V3");
});

test("the window lives inside a modal owner, otherwise it would be inert", () => {
  const els = { "websid-play-dialog": { open: false }, "sid-editor-dialog": { open: false } };
  const modal = new Set();
  const body = {};
  const ctx = load(["_channelMonitorOwner"], {
    document: { body, getElementById: (id) => els[id] },
    _dlgIsModal: (d) => modal.has(d),
  });
  assert.equal(ctx._channelMonitorOwner(), null);
  els["websid-play-dialog"].open = true;
  assert.equal(ctx._channelMonitorOwner(), body);
  els["sid-editor-dialog"].open = true;
  assert.equal(ctx._channelMonitorOwner(), els["sid-editor-dialog"], "a player left behind a modal editor is inert");
  modal.add(els["websid-play-dialog"]);
  assert.equal(ctx._channelMonitorOwner(), els["websid-play-dialog"]);
});

function syncFixture(wanted = "true") {
  const dlg = {
    open: false, parentElement: null, positioned: 0,
    show() { this.open = true; },
    close() { this.open = false; },
    _applyPosition() { this.positioned++; },
  };
  const body = { appendChild(el) { el.parentElement = this; } };
  const editor = { id: "sid-editor-dialog", open: false, style: {}, getBoundingClientRect: () => ({ left: 100, top: 20 }), appendChild(el) { el.parentElement = this; } };
  const player = { id: "websid-play-dialog", open: false };
  const focused = { calls: 0, focus() { this.calls++; } };
  const stored = new Map([["c64va-channel-monitor-open", wanted]]);
  const positions = {};
  const ctx = load(["_channelMonitorOwner", "_channelMonitorFreezeOwner", "_channelMonitorWanted", "_channelMonitorSetWanted", "_channelMonitorSync", "_channelMonitorToggle"], {
    document: { body, activeElement: focused, getElementById: (id) => ({ "channel-monitor": dlg, "sid-editor-dialog": editor, "websid-play-dialog": player })[id] },
    localStorage: { getItem: (k) => stored.get(k) ?? null, setItem: (k, v) => stored.set(k, v) },
    _dlgIsModal: () => false,
    _editorDialogPositions: positions,
    _channelMonitorSyncButtons() {},
    _sidAnaAttach() {},
    _channelMonitorDraw() {},
    requestAnimationFrame: () => 1,
  });
  vm.runInContext("var _channelMonitorRaf = 0;", ctx);
  return { ctx, dlg, body, editor, player, focused, stored, positions };
}

test("it follows the editor and the player, and reopens with them when it was left open", () => {
  const { ctx, dlg, body, editor, player, focused, positions } = syncFixture();
  ctx._channelMonitorSync();
  assert.equal(dlg.open, false, "nothing to belong to at startup");

  editor.open = true;
  ctx._channelMonitorSync();
  assert.equal(dlg.open, true);
  assert.equal(dlg.parentElement, editor);
  assert.equal(focused.calls, 1, "the tracker keeps the focus");
  assert.equal(editor.style.transform, "none", "no containing block for the fixed window");
  assert.equal(editor.style.left, "100px");
  assert.deepEqual({ ...positions["sid-editor-dialog"] }, { left: 100, top: 20 });

  player.open = true;
  editor.open = false;
  ctx._channelMonitorSync();
  assert.equal(dlg.parentElement, body, "out of the closed editor, which would hide it");
  assert.equal(dlg.open, true);

  player.open = false;
  ctx._channelMonitorSync();
  assert.equal(dlg.open, false);
  assert.equal(ctx._channelMonitorWanted(), true, "closed with its owner: reopens with it");
});

test("the buttons' choice is remembered, and a closed window stays closed", () => {
  const { ctx, dlg, editor, stored } = syncFixture("false");
  editor.open = true;
  ctx._channelMonitorSync();
  assert.equal(dlg.open, false);
  ctx._channelMonitorToggle();
  assert.equal(dlg.open, true);
  assert.equal(stored.get("c64va-channel-monitor-open"), "true");
  ctx._channelMonitorToggle();
  assert.equal(dlg.open, false);
  assert.equal(stored.get("c64va-channel-monitor-open"), "false");
  editor.open = false;
  editor.open = true;
  ctx._channelMonitorSync();
  assert.equal(dlg.open, false);
});

test("the resize grip captures the pointer and stops on release", () => {
  const handlers = {};
  const grip = { setAttribute() {}, addEventListener(name, fn) { handlers[name] = fn; }, setPointerCapture(id) { this.capture = id; } };
  const element = { style: {}, appendChild() {}, closest: () => null, getBoundingClientRect: () => ({ left: 20, top: 30, width: 500, height: 300 }) };
  let saved = 0;
  const ctx = load(["_sidSetupResizeHandle"], { document: { createElement: () => grip }, window: { innerWidth: 1200, innerHeight: 800 } });
  ctx._sidSetupResizeHandle(element, () => { saved++; });
  handlers.pointerdown({ button: 0, clientX: 520, clientY: 330, pointerId: 7, preventDefault() {}, stopPropagation() {} });
  handlers.pointermove({ clientX: 620, clientY: 380 });
  assert.equal(grip.capture, 7);
  assert.equal(element.style.width, "600px");
  assert.equal(element.style.height, "350px");
  handlers.pointerup();
  assert.equal(saved, 1);
  handlers.pointermove({ clientX: 900, clientY: 600 });
  assert.equal(element.style.width, "600px");
});

test("the file player hands the registers to the monitor, also from the held opening", () => {
  const play = fnSource("_vaSidPlayFileBytes");
  assert.ok(play.includes("_channelMonitorQueue(state, state.nextTime, monitor, frameRate)"));
  assert.ok(play.includes("monitor: rendered.monitor, frameRate: rendered.frameRate"));
  assert.ok(play.includes("schedule(h.pcm, h.channels, h.monitor, h.frameRate)"));
  assert.ok(play.includes("schedule(pcm, rendered.channels, rendered.monitor, rendered.frameRate)"));
  const seek = fnSource("_vaSidSeek");
  assert.ok(seek.includes("state.monitorEnv = []"));
});

test("the tracker records its frames for the open window", () => {
  const e = { snap: null };
  const els = { "channel-monitor": { open: true } };
  const ctx = load(["_sidAnaAttach"], { document: { getElementById: (id) => els[id] }, _sidWaPlay: { e } });
  ctx._sidAnaAttach();
  assert.deepEqual(Array.from(e.snap), []);
  els["channel-monitor"].open = false;
  ctx._sidAnaAttach();
  assert.equal(e.snap, null);
});

function vizFixture(globals) {
  const filled = [], texts = [];
  const canvas = {
    clientWidth: 600, clientHeight: 300, width: 0, height: 0,
    getContext: () => ({
      fillRect(...args) { filled.push(args); },
      fillText(text) { texts.push(text); },
      set fillStyle(_) {}, set font(_) {}, set textBaseline(_) {},
    }),
  };
  const ctx = load(["_sidVizDrawChannels", "_channelMonitorLabel"], {
    window: { devicePixelRatio: 1 }, performance: { now: () => 0 }, t: (k) => k,
    _SID_ROLL_VOICE: [], _sidVizBands: 8, _sidVizRowHue: () => 100, _sidAnaAttach() {},
    _sidAnaVoiceLevels: () => new Array(8).fill(0.5),
    _sidWaPlay: null, _sidExternalCore: null, _sidAna: { env: [], last: null }, _sidAnaAdvance() {},
    _channelMonitorFrame: () => null,
    ...globals,
  });
  return { canvas, ctx, filled, texts };
}

test("the Channels view draws an analyzer per voice of the file being played", () => {
  const regs = new Array(50).fill(0);
  const { canvas, ctx, filled, texts } = vizFixture({
    _sidExternalCore: { active: true, monitorEnv: [] }, _channelMonitorFrame: () => ({ regs }),
  });
  ctx._sidVizDrawChannels(canvas);
  assert.deepEqual(texts, ["S1 V1", "S1 V2", "S1 V3", "S2 V1", "S2 V2", "S2 V3"]);
  assert.equal(filled.length, 1 + 6 * 8 * 10, "the background, then 10 cells per band per voice");
});

test("the Channels view follows the tracker, and says so when nothing plays", () => {
  const tracker = vizFixture({ _sidWaPlay: { e: {} }, _sidAna: { env: [], last: new Array(25).fill(0) } });
  tracker.ctx._sidVizDrawChannels(tracker.canvas);
  assert.deepEqual(tracker.texts, ["V1", "V2", "V3"]);
  const idle = vizFixture({});
  idle.ctx._sidVizDrawChannels(idle.canvas);
  assert.deepEqual(idle.texts, ["channelMonitorIdle"]);
});

test("the tracker records its frames for the Channels view only", () => {
  const e = { snap: null };
  const els = { "sid-viz-dialog": { open: true }, "sid-viz-mode": { value: "mix" } };
  const ctx = load(["_sidAnaAttach"], { document: { getElementById: (id) => els[id] }, _sidWaPlay: { e } });
  ctx._sidAnaAttach();
  assert.equal(e.snap, null);
  els["sid-viz-mode"].value = "channels";
  ctx._sidAnaAttach();
  assert.deepEqual(Array.from(e.snap), []);
  els["sid-viz-dialog"].open = false;
  ctx._sidAnaAttach();
  assert.equal(e.snap, null);
});

test("markup and translations are in place", () => {
  for (const id of ["channel-monitor", "channel-monitor-title", "channel-monitor-close", "websid-play-curves", "sid-curves-btn", "websid-play-subtunes", "sid-viz-mode"]) {
    assert.ok(indexHtml.includes(`id="${id}"`), id);
  }
  for (const key of ["sidPlayerSubtunes", "channelMonitorTitle", "channelMonitorIdle", "sidVizView", "sidVizMix", "sidVizChannels"]) {
    assert.equal(i18n.split(`"${key}":`).length - 1, 7, key);
  }
});
