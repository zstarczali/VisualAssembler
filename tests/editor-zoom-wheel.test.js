const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const extract = require("./helpers/extract-function");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");

function load() {
  const context = { Event: class { constructor(type) { this.type = type; } } };
  vm.createContext(context);
  for (const name of ["_bindCtrlWheelZoom", "_bindCtrlWheelRange"]) {
    vm.runInContext(`${extract(appJs, name)}; this.${name} = ${name};`, context);
  }
  return context;
}

// A scrollable wrap whose content grows with the zoom value.
function makeWrap(range) {
  const listeners = [];
  const wrap = {
    scrollLeft: 0, scrollTop: 0, clientWidth: 200, clientHeight: 100,
    get scrollWidth() { return 100 * Number(range.value); },
    get scrollHeight() { return 50 * Number(range.value); },
    getBoundingClientRect: () => ({ left: 10, top: 20 }),
    addEventListener: (type, fn, opts) => listeners.push({ type, fn, capture: !!opts?.capture })
  };
  wrap.wheel = (e) => {
    const event = { preventDefault() { event.prevented = true; }, deltaMode: 0, ...e };
    listeners.filter(l => l.capture).forEach(l => l.fn(event));
    listeners.filter(l => !l.capture).forEach(l => l.fn(event));
    return event;
  };
  return wrap;
}

function makeRange(value, min, max, step) {
  const inputs = [];
  return { value: String(value), min: String(min), max: String(max), step: String(step), inputs,
    dispatchEvent: (ev) => inputs.push(ev.type) };
}

test("Ctrl + wheel steps an editor zoom slider and fires its input event", () => {
  const ctx = load();
  const range = makeRange(3, 1, 16, 1);
  const wrap = makeWrap(range);
  ctx._bindCtrlWheelRange(wrap, range);
  assert.equal(wrap.wheel({ deltaY: -100, ctrlKey: true, clientX: 60, clientY: 70 }).prevented, true);
  assert.equal(range.value, "5");
  assert.deepEqual(range.inputs, ["input", "input"]);
  wrap.wheel({ deltaY: 50, ctrlKey: true, clientX: 60, clientY: 70 });
  assert.equal(range.value, "4");
  // A plain wheel scrolls the view: no zoom, no preventDefault.
  assert.equal(wrap.wheel({ deltaY: -100, clientX: 60, clientY: 70 }).prevented, undefined);
  assert.equal(range.value, "4");
});

test("Ctrl + wheel zoom stops at the slider limits and keeps the point under the cursor", () => {
  const ctx = load();
  const range = makeRange(24, 8, 32, 2);
  const wrap = makeWrap(range);
  ctx._bindCtrlWheelRange(wrap, range);
  wrap.scrollLeft = 400; wrap.scrollTop = 100;
  // cursor 50 px right / 50 px down inside the wrap
  const fx = (400 + 50) / wrap.scrollWidth, fy = (100 + 50) / wrap.scrollHeight;
  wrap.wheel({ deltaY: -50, ctrlKey: true, clientX: 60, clientY: 70 });
  assert.equal(range.value, "26");
  assert.equal(Math.round((wrap.scrollLeft + 50) / wrap.scrollWidth * 1e6), Math.round(fx * 1e6));
  assert.equal(Math.round((wrap.scrollTop + 50) / wrap.scrollHeight * 1e6), Math.round(fy * 1e6));
  wrap.wheel({ deltaY: -1000, ctrlKey: true, clientX: 60, clientY: 70 });
  assert.equal(range.value, "32");
  const fired = range.inputs.length;
  wrap.wheel({ deltaY: -50, metaKey: true, clientX: 60, clientY: 70 });
  assert.equal(range.value, "32");
  assert.equal(range.inputs.length, fired);
});
