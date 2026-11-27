// SID editor MIDI: the connected device is remembered and the editor connects by itself next time.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");

function fn(name) {
  const start = source.search(new RegExp(`(?:async )?function ${name}\\(`));
  assert.notEqual(start, -1, name);
  let depth = 0;
  // the body's brace (a destructured parameter has braces of its own)
  for (let i = source.indexOf(") {", start) + 2; ; i++) {
    if (source[i] === "{") depth++;
    else if (source[i] === "}" && --depth === 0) return source.slice(start, i + 1);
  }
}

const inputs = (...list) => new Map(list.map(([id, name]) => [id, { id, name, onmidimessage: null }]));

// The MIDI functions with a fake Web MIDI (`devices`, changed by the test) and localStorage.
function setup(stored = {}, devices = inputs()) {
  const store = new Map(Object.entries(stored));
  const ctx = {
    toasts: [],
    access: { inputs: devices, onstatechange: null },
    localStorage: {
      getItem: k => (store.has(k) ? store.get(k) : null),
      setItem: (k, v) => store.set(k, String(v)),
      removeItem: k => store.delete(k),
    },
    select: { innerHTML: "", value: "", options: [], appendChild(o) { this.options.push(o); } },
    t: k => k,
  };
  ctx.navigator = { requestMIDIAccess: async () => ctx.access };
  ctx.document = {
    getElementById: id => (id === "sid-midi-input" ? ctx.select : null),
    createElement: () => ({}),
  };
  ctx.showViceToast = (text) => ctx.toasts.push(text);
  vm.createContext(ctx);
  vm.runInContext(`
    var _sidMidiAccess = null, _sidMidiInputId = "", _sidMidiAuto = false;
    function _sidMidiMessage() {}
    ${["_sidMidiRefreshInputs", "_sidMidiPickInput", "_sidMidiSetInput", "_sidMidiConnect", "_sidMidiAutoConnect", "_sidMidiSettingsPersist"].map(fn).join("\n")}
    this.state = () => ({ id: _sidMidiInputId, auto: _sidMidiAuto, access: _sidMidiAccess });
  `, ctx);
  ctx.store = store;
  return ctx;
}

test("MIDI input: by id, else by name, else the first one only as a fallback", () => {
  const ctx = setup();
  const list = inputs(["a", "Keys"], ["b", "Pads"]);
  assert.equal(ctx._sidMidiPickInput(list, "b", "", false), "b");
  assert.equal(ctx._sidMidiPickInput(list, "gone", "Pads", false), "b");
  assert.equal(ctx._sidMidiPickInput(list, "gone", "Other", false), "");
  assert.equal(ctx._sidMidiPickInput(list, "gone", "Other", true), "a");
});

test("Connect remembers the device and switches the automatic connect on", async () => {
  const ctx = setup({}, inputs(["x1", "Keystation"]));
  await ctx._sidMidiConnect();
  assert.equal(ctx.state().id, "x1");
  assert.equal(ctx.store.get("c64va-sid-midi-auto"), "1");
  assert.equal(ctx.store.get("c64va-sid-midi-input"), "x1");
  assert.equal(ctx.store.get("c64va-sid-midi-input-name"), "Keystation");
  assert.ok(ctx.access.inputs.get("x1").onmidimessage);
});

test("Next start: connects quietly to the remembered device, also under a new id", async () => {
  const ctx = setup({ "c64va-sid-midi-auto": "1", "c64va-sid-midi-input": "old", "c64va-sid-midi-input-name": "Keystation" },
    inputs(["other", "Pads"], ["new", "Keystation"]));
  ctx._sidMidiAutoConnect();
  await new Promise(r => setImmediate(r));
  assert.equal(ctx.state().id, "new");
  assert.deepEqual(ctx.toasts, []);
});

test("Next start without the device: no toast, no other device; it connects when it appears", async () => {
  const ctx = setup({ "c64va-sid-midi-auto": "1", "c64va-sid-midi-input": "x1", "c64va-sid-midi-input-name": "Keystation" },
    inputs(["other", "Pads"]));
  ctx._sidMidiAutoConnect();
  await new Promise(r => setImmediate(r));
  assert.equal(ctx.state().id, "");
  assert.deepEqual(ctx.toasts, []);
  assert.equal(ctx.store.get("c64va-sid-midi-input"), "x1", "the remembered device is kept");
  // plugged in later
  ctx.access.inputs.set("x1", { id: "x1", name: "Keystation", onmidimessage: null });
  ctx.access.onstatechange();
  assert.equal(ctx.state().id, "x1");
  assert.ok(ctx.access.inputs.get("x1").onmidimessage);
});

test("No automatic connect before the first Connect", async () => {
  const ctx = setup({}, inputs(["x1", "Keystation"]));
  ctx._sidMidiAutoConnect();
  await new Promise(r => setImmediate(r));
  assert.equal(ctx.state().access, null);
});

// The knob mapping functions with fake knobs (a <dialog> that is open or closed) and localStorage.
function knobSetup(stored = {}) {
  const store = new Map(Object.entries(stored));
  const ctx = {
    toasts: [], menus: [], connects: 0,
    localStorage: {
      getItem: k => (store.has(k) ? store.get(k) : null),
      setItem: (k, v) => store.set(k, String(v)),
      removeItem: k => store.delete(k),
    },
    t: k => k,
    tf: (k, p) => `${k}${JSON.stringify(p)}`,
  };
  ctx.showViceToast = text => ctx.toasts.push(text);
  ctx._edShowCtxMenu = (e, host, items) => ctx.menus.push(items);
  ctx._sidMidiConnect = () => { ctx.connects++; };
  vm.createContext(ctx);
  vm.runInContext(`
    var _sidMidiAccess = null;
    ${["_sidMidiKnobsMap", "_sidMidiCcMapGet", "_sidMidiCcSave", "_sidMidiCcOf", "_sidMidiCcText", "_sidMidiKnobMark", "_sidMidiKnobRegister",
       "_sidMidiKnobMenu", "_sidMidiLearnStart", "_sidMidiLearnStop", "_sidMidiControl",
       "_sidMidiButtonRegister", "_sidMidiNote", "_sidMidiMapped", "_sidMidiSettingsPersist"].map(fn).join("\n")}
  `, ctx);
  vm.runInContext(`var _sidMidiKnobs, _sidMidiCcMap, _sidMidiLearnId;
    this.learnId = () => _sidMidiLearnId;`, ctx);
  ctx.store = store;
  ctx.knob = (id, dialogOpen = true) => {
    const classes = new Set();
    const listeners = {};
    const knob = {
      id, isConnected: true, dataset: {}, values: [],
      classList: { toggle: (c, on) => (on ? classes.add(c) : classes.delete(c)), has: c => classes.has(c) },
      addEventListener: (type, f) => { listeners[type] = f; },
      closest: sel => (sel === "dialog" ? { open: dialogOpen } : null),
      fire: (type, e) => listeners[type](e),
    };
    ctx._sidMidiKnobRegister(knob, pct => knob.values.push(pct));
    return knob;
  };
  ctx.button = (id, dialogOpen = true) => {
    const classes = new Set();
    const listeners = {};
    const button = {
      id, isConnected: true, dataset: {}, disabled: false, clicks: 0,
      parentElement: { addEventListener() {} },
      classList: { toggle: (c, on) => (on ? classes.add(c) : classes.delete(c)), has: c => classes.has(c) },
      addEventListener: (type, f) => { listeners[type] = f; },
      closest: sel => (sel === "dialog" ? { open: dialogOpen } : null),
      click() { this.clicks++; },
      fire: (type, e) => listeners[type](e),
    };
    ctx._sidMidiButtonRegister(button);
    return button;
  };
  return ctx;
}

test("MIDI Learn: right click → Learn, the next CC drives the knob", () => {
  const ctx = knobSetup();
  const pw = ctx.knob("sid-pw-knob");
  pw.fire("contextmenu", { stopPropagation() {} });
  const [learn, unmap, unmapAll] = ctx.menus[0];
  assert.equal(learn.label, "sidMidiLearn");
  assert.equal(unmap.disabled, true);
  assert.equal(unmapAll.disabled, true);
  learn.run();
  assert.equal(ctx.connects, 1, "MIDI connects for the learn");
  assert.ok(pw.classList.has("sid-knob--learning"));
  ctx._sidMidiControl(0, 21, 64);           // the learn CC moves nothing
  assert.deepEqual(pw.values, []);
  assert.equal(pw.dataset.midiCc, "21");
  assert.ok(pw.classList.has("sid-knob--midi"));
  assert.ok(!pw.classList.has("sid-knob--learning"));
  assert.deepEqual(JSON.parse(ctx.store.get("c64va-sid-midi-cc")), { "0:21": "sid-pw-knob" });
  ctx._sidMidiControl(0, 21, 127);
  ctx._sidMidiControl(0, 21, 0);
  ctx._sidMidiControl(1, 21, 127);          // another channel: not mapped
  assert.deepEqual(pw.values, [100, 0]);
});

test("MIDI Learn: one controller per knob and one knob per controller", () => {
  const ctx = knobSetup();
  const a = ctx.knob("a-knob");
  const b = ctx.knob("b-knob");
  ctx._sidMidiLearnStart(a); ctx._sidMidiControl(0, 21, 0);
  ctx._sidMidiLearnStart(a); ctx._sidMidiControl(0, 22, 0);   // a moves to CC 22
  ctx._sidMidiLearnStart(b); ctx._sidMidiControl(0, 22, 0);   // b takes CC 22 from a
  assert.deepEqual(JSON.parse(ctx.store.get("c64va-sid-midi-cc")), { "0:22": "b-knob" });
  assert.equal(a.dataset.midiCc, undefined);
  assert.equal(b.dataset.midiCc, "22");
});

test("MIDI mapping: loaded from storage (bad entries dropped), closed dialog ignored, remove", () => {
  const ctx = knobSetup({ "c64va-sid-midi-cc": JSON.stringify({ "2:7": "vol-knob", "x:1": "bad", "0:5": 3 }) });
  const vol = ctx.knob("vol-knob");
  const hidden = ctx.knob("hidden-knob", false);
  assert.equal(vol.dataset.midiCc, "7");
  ctx._sidMidiControl(2, 7, 127);
  assert.deepEqual(vol.values, [100]);
  ctx._sidMidiLearnStart(hidden); ctx._sidMidiControl(0, 9, 0);
  ctx._sidMidiControl(0, 9, 127);
  assert.deepEqual(hidden.values, [], "its dialog is closed");
  vol.fire("contextmenu", { stopPropagation() {} });
  ctx.menus.at(-1)[1].run();                 // Remove mapping
  assert.deepEqual(JSON.parse(ctx.store.get("c64va-sid-midi-cc")), { "0:9": "hidden-knob" });
  vol.fire("contextmenu", { stopPropagation() {} });
  ctx.menus.at(-1)[2].run();                 // Remove all
  assert.deepEqual(JSON.parse(ctx.store.get("c64va-sid-midi-cc")), {});
});

test("MIDI Learn on a button: a CC button presses it once per press", () => {
  const ctx = knobSetup();
  const play = ctx.button("sid-play");
  play.fire("contextmenu", { preventDefault() {}, stopPropagation() {} });
  assert.equal(ctx.menus[0][0].label, "sidMidiLearnButton");
  ctx.menus[0][0].run();
  assert.equal(ctx.toasts[0], "sidMidiLearnButtonHint");
  ctx._sidMidiControl(0, 41, 127);           // learned: does not press
  ctx._sidMidiControl(0, 41, 0);
  assert.equal(play.clicks, 0);
  assert.equal(play.dataset.midiCc, "41");
  ctx._sidMidiControl(0, 41, 127);
  ctx._sidMidiControl(0, 41, 127);           // held: still one press
  ctx._sidMidiControl(0, 41, 0);
  ctx._sidMidiControl(0, 41, 127);
  assert.equal(play.clicks, 2);
  play.disabled = true;                      // a disabled button (Undo with no history) is not pressed
  ctx._sidMidiControl(0, 41, 0); ctx._sidMidiControl(0, 41, 127);
  assert.equal(play.clicks, 2);
});

test("MIDI Learn on a button: a pad (note) presses it and no longer plays", () => {
  const ctx = knobSetup();
  const rec = ctx.button("sid-record");
  assert.equal(ctx._sidMidiNote(9, 36, true), false, "unmapped notes play");
  ctx._sidMidiLearnStart(rec);
  assert.equal(ctx._sidMidiNote(9, 36, true), true);
  assert.equal(ctx._sidMidiNote(9, 36, false), true);
  assert.equal(rec.clicks, 0);
  assert.equal(rec.dataset.midiCc, "n36");
  assert.deepEqual(JSON.parse(ctx.store.get("c64va-sid-midi-cc")), { "n:9:36": "sid-record" });
  assert.equal(ctx._sidMidiNote(9, 36, true), true);
  assert.equal(ctx._sidMidiNote(9, 36, false), true);
  assert.equal(rec.clicks, 1);
  // a knob learns only from CCs: a note while a knob learns still plays
  const pw = ctx.knob("pw-knob");
  ctx._sidMidiLearnStart(pw);
  assert.equal(ctx._sidMidiNote(0, 60, true), false);
});

test("Saved button mappings (notes) are loaded back", () => {
  const ctx = knobSetup({ "c64va-sid-midi-cc": JSON.stringify({ "n:9:36": "sid-stop", "n:x:1": "bad" }) });
  const stop = ctx.button("sid-stop");
  assert.equal(stop.dataset.midiCc, "n36");
  ctx._sidMidiNote(9, 36, true);
  assert.equal(stop.clicks, 1);
});

test("SID editor: the transport and undo buttons are MIDI-learnable", () => {
  const setup = fn("setupSidEditor");
  for (const id of ["sid-play", "sid-stop", "sid-record", "sid-undo", "sid-roll-play", "sid-vkbd-record"]) assert.match(setup, new RegExp(`"${id}"`));
  assert.match(setup, /_sidMidiButtonRegister\(/);
  assert.match(fn("_sidMidiMessage"), /_sidMidiNote\(/);
});

test("MIDI settings go into the UI settings file and come back from it (the file wins)", () => {
  const ctx = knobSetup({ "c64va-sid-midi-cc": JSON.stringify({ "0:21": "pw-knob" }), "c64va-sid-midi-input": "x1",
    "c64va-sid-midi-input-name": "Keystation", "c64va-sid-midi-auto": "1" });
  vm.runInContext(`${["_sidMidiSettingsGet", "_sidMidiSettingsApply"].map(fn).join("\n")}
    var saves = 0; function saveUiSettings() { saves++; }`, ctx);
  const pw = ctx.knob("pw-knob");
  assert.deepEqual(JSON.parse(JSON.stringify(ctx._sidMidiSettingsGet())), { cc: { "0:21": "pw-knob" }, input: "x1", inputName: "Keystation", auto: true });
  ctx._sidMidiLearnStart(pw); ctx._sidMidiControl(0, 22, 0);
  assert.equal(vm.runInContext("saves", ctx), 1, "a new mapping saves the settings");
  // a settings file from another machine / profile replaces the local copy
  ctx._sidMidiSettingsApply({ cc: { "3:7": "pw-knob" }, input: "", inputName: "Pads", auto: false });
  assert.equal(pw.dataset.midiCc, "7");
  assert.equal(ctx.store.get("c64va-sid-midi-input-name"), "Pads");
  assert.equal(ctx.store.has("c64va-sid-midi-input"), false);
  assert.equal(ctx.store.has("c64va-sid-midi-auto"), false);
  ctx._sidMidiControl(3, 7, 127);
  assert.deepEqual(pw.values, [100]);
  ctx._sidMidiSettingsApply("junk");          // ignored
  assert.equal(pw.dataset.midiCc, "7");
});

test("saveUiSettings stores the MIDI settings; _applyUiSettingsToDOM restores them", () => {
  assert.match(fn("saveUiSettings"), /sidMidi: _sidMidiSettingsGet\(\)/);
  assert.match(fn("_applyUiSettingsToDOM"), /if \(s\.sidMidi\) _sidMidiSettingsApply\(s\.sidMidi\)/);
  for (const name of ["_sidMidiCcSave", "_sidMidiSetInput", "_sidMidiConnect"]) assert.match(fn(name), /_sidMidiSettingsPersist\(\)/, name);
});
