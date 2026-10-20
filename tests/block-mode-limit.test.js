const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const extract = require('./helpers/extract-function');
const source = fs.readFileSync(path.join(__dirname, '../www/app.js'), 'utf8');
const context = vm.createContext({});
vm.runInContext(extract(source, '_blockModeLimitExceeded'), context);
const exceeds = context._blockModeLimitExceeded;

test('1000 blocks are allowed; 1001 require Expert mode', () => {
  assert.equal(exceeds(Array.from({ length: 1000 }, () => ({}))), false);
  assert.equal(exceeds(Array.from({ length: 1001 }, () => ({}))), true);
});

test('blank lines do not count, collapsed region children still count', () => {
  assert.equal(exceeds(Array.from({ length: 1500 }, () => ({ isBlankLine: true }))), false);
  assert.equal(exceeds([{ isRegionMacro: true, regionCollapsed: true }, ...Array.from({ length: 1000 }, () => ({}))]), true);
});

test('UB mode is available for new tabs and UB files, not bound ASM sources', () => {
  vm.runInContext(extract(source, '_canUseUltimateBasicMode'), context);
  const allowed = context._canUseUltimateBasicMode;
  assert.equal(allowed({ filePath: 'F:/source/demo.asm' }), false);
  assert.equal(allowed({ filePath: 'F:/source/demo.s' }), false);
  assert.equal(allowed({ filePath: 'F:/source/demo.ub' }), true);
  assert.equal(allowed({ filePath: 'F:/source/demo.UB' }), true);
  assert.equal(allowed({ filePath: '' }), true);
  assert.equal(allowed({ filePath: null, name: 'imported.asm' }), false);
  assert.equal(allowed({ filePath: null, name: 'imported.a65' }), false);
  assert.equal(allowed({ filePath: null, name: 'hello-loop-demo.c64va' }), false);
  assert.equal(allowed({ filePath: null, name: 'hello-loop-demo.json' }), false);
  assert.equal(allowed({ filePath: 'hello-loop-demo.json' }), false);
  assert.equal(allowed({ filePath: null, name: 'Untitled 3' }), true);
});

test('bound UB files lock assembler modes, Untitled tabs remain free', () => {
  vm.runInContext(extract(source, '_isBoundUbTab'), context);
  assert.equal(context._isBoundUbTab({ filePath: 'demo.ub' }), true);
  assert.equal(context._isBoundUbTab({ filePath: 'demo.UB' }), true);
  assert.equal(context._isBoundUbTab({ filePath: 'demo.asm' }), false);
  assert.equal(context._isBoundUbTab({ filePath: '' }), false);
});
