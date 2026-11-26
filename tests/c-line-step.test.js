// C (Oscar64) and UltimateBasic debugger: Step into / over moves by a source line, made of 6502 steps (_w64SrcStepNext).
const test = require("node:test");
const assert = require("node:assert/strict");
const loadApp = require("./helpers/load-app");

const app = loadApp();

// main.c line 10 = $0900-$0905, line 11 = $0906-$0908; $2000 = runtime library (no source line)
const run = (stops, mode = 1, kind = "oscar") => app.run(`(() => {
  const steps = [];
  let sp = 0xF0;
  const s = {
    stopped: true, stopPc: 0x0900, applied: new Set(), manual: new Set(),
    session: { kind: "${kind}", entries: [
      { key: "main.c", file: "main.c", line: 10, start: 0x0900, end: 0x0905 },
      { key: "main.c", file: "main.c", line: 11, start: 0x0906, end: 0x0908 },
    ] },
    mod: { _vice_web_monitor_breakpoint_hit_clear() {}, _vice_web_monitor_step(m) { steps.push(m); } },
  };
  _w64S = () => s;
  _w64ApplyBreakpoints = () => {};
  _w64Reg = (id) => id === 4 ? sp : s.stopPc;
  _w64Step(${mode});
  const shown = [];
  for (const [pc, depth] of ${JSON.stringify(stops)}) {
    sp = 0xF0 - depth;
    if (!_w64SrcStepNext(s, pc)) { shown.push(pc); break; }
  }
  return { steps, shown };
})()`);

test("a step runs to the next C line, the stops inside the line are not shown", () => {
  const r = run([[0x0902, 0], [0x0904, 0], [0x0906, 0]]);
  assert.deepEqual([...r.shown], [0x0906]);
  assert.deepEqual([...r.steps], [1, 1, 1]);
});

test("step into a library routine without source steps out of it", () => {
  const r = run([[0x2000, 2], [0x0903, 0], [0x0906, 0]], 0);
  assert.deepEqual([...r.steps], [0, 2, 0]);
  assert.deepEqual([...r.shown], [0x0906]);
});

test("a breakpoint inside the line stops the step there", () => {
  const r = app.run(`(() => { const s = _w64S(); s.applied = new Set([0x0903]); s.srcStep = { mode: 1, key: "main.c:10", n: 0, sp: 0xF0 }; const out = _w64SrcStepNext(s, 0x0903); return out || s.srcStep !== null; })()`);
  assert.equal(r, false);
});

test("UltimateBasic steps by a source line too", () => {
  const r = run([[0x0902, 0], [0x0904, 0], [0x0906, 0]], 1, "ub");
  assert.deepEqual([...r.shown], [0x0906]);
});

test("assembly still steps one instruction", () => {
  const r = run([[0x0902, 0], [0x0904, 0]], 1, "va");
  assert.deepEqual([...r.shown], [0x0902]);
});
