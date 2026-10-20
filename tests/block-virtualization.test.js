const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const source = fs.readFileSync(path.join(__dirname, '../www/app.js'), 'utf8');
const helper = source.slice(source.indexOf('function _blockVirtualSchedule()'), source.indexOf('function renderProgram(virtualScroll'));

function setup() {
  let callback;
  let renders = 0;
  const program = [];
  const state = { tabId: 'a', program, scroll: { scrollTop: 2000, clientHeight: 600 }, safeTop: 0, safeBottom: 1000 };
  const context = {
    _blockVirtualState: state, _blockVirtualRaf: 0, expertMode: false, ultimateBasicMode: false,
    activeTabId: 'a', program, _dndActive: false,
    requestAnimationFrame(fn) { callback = fn; return 1; },
    renderProgram(scrollOnly) { assert.equal(scrollOnly, true); renders++; },
  };
  vm.createContext(context);
  vm.runInContext(helper, context);
  return { context, state, flush: () => callback(), renders: () => renders };
}

test('block scrolling refreshes a window after leaving its safe range', () => {
  const run = setup();
  run.context._blockVirtualSchedule();
  run.flush();
  assert.equal(run.renders(), 1);
});

for (const change of ['tab', 'program', 'state']) {
  test(`queued block scrolling ignores a replaced ${change}`, () => {
    const run = setup();
    run.context._blockVirtualSchedule();
    if (change === 'tab') run.context.activeTabId = 'b';
    if (change === 'program') run.context.program = [];
    if (change === 'state') run.context._blockVirtualState = { ...run.state };
    run.flush();
    assert.equal(run.renders(), 0);
  });
}

test('scrolling inside the rendered window does not rebuild cards', () => {
  const run = setup();
  run.state.scroll.scrollTop = 100;
  run.context._blockVirtualSchedule();
  run.flush();
  assert.equal(run.renders(), 0);
});
