const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const extract = require('./helpers/extract-function');
const source = fs.readFileSync(path.join(__dirname, '../www/app.js'), 'utf8');

test('ASM output shows every block of a large source and refreshes both byte views', () => {
  const program = Array.from({ length: 13227 }, (_, i) => ({ id: String(i), isComment: true, rawOperand: `source-line-${i}` }));
  let monitor = 0;
  let disasm = 0;
  const context = {
    program, _vmaLiveFor: () => ({ lines: [], memory: { deferred: [] } }), _vmaEditorInput: () => ({}),
    _vmaMemoryMap: () => new Map(), _vmaLayout: () => ({}), _blockToExpertLine: () => '',
    asmOutput: {}, asmPlainText: '', asmDisplayText: '', asmBlockRanges: {}, selectedBlockIds: new Set(),
    withAsmLineNumbers: text => text, highlightAsmHtml: text => text, t: k => k,
    renderMonitorOutput() { monitor++; }, renderDisasmOutput() { disasm++; },
    renderMemoryMap() {}, getMemoryUsage: () => ({}),
  };
  vm.createContext(context);
  vm.runInContext(extract(source, 'renderAsmOutput'), context);
  context.renderAsmOutput();
  assert.equal(context.asmPlainText.split('\n').length, program.length);
  assert.ok(context.asmOutput.innerHTML.endsWith('; source-line-13226'));
  assert.deepEqual({ ...context.asmBlockRanges['13226'] }, { firstLine: 13226, lastLine: 13226 });
  assert.equal(monitor, 1);
  assert.equal(disasm, 1);
});

test('switching a block output view regenerates its current source', () => {
  let renders = 0;
  const context = { outputModeTabs: [], outputStack: { dataset: {} }, expertMode: false, ultimateBasicMode: false,
    renderAsmOutput() { renders++; }, saveUiSettings() {} };
  vm.createContext(context);
  vm.runInContext(extract(source, 'setOutputMode'), context);
  for (const mode of ['asm', 'disasm', 'monitor']) context.setOutputMode(mode);
  assert.equal(renders, 3);
});
