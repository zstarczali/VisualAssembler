const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8").replace(/\r\n/g, "\n");

function load() {
  const opStart = appJs.indexOf("const opcodeMap = {");
  const opEnd = appJs.indexOf("\n};\n", opStart) + 4;
  const revStart = appJs.indexOf("const _REV_OP = (");
  const revEnd = appJs.indexOf("function _disasmBytes(");
  const context = {};
  vm.createContext(context);
  vm.runInContext(appJs.slice(opStart, opEnd) + appJs.slice(revStart, revEnd) +
    "\nthis.zp = { area: _zpArea, acc: _zpAccesses, analyze: _zpAnalyze, sid: _ZP_SID_PLAYER };", context);
  return context.zp;
}

test("areas", () => {
  const { area } = load();
  assert.equal(area(0x01), "cpu");
  assert.equal(area(0x02), "free");
  assert.equal(area(0xFB), "free");
  assert.equal(area(0x2B), "basic");
  assert.equal(area(0xFF), "basic");
  assert.equal(area(0xC5), "kernal");
});

test("accesses per addressing mode", () => {
  const { acc } = load();
  const plain = (b) => JSON.parse(JSON.stringify(acc(b)));
  assert.deepEqual(plain([0x85, 0xFB]), [{ addr: 0xFB, write: true, ptr: false }]);        // STA zp
  assert.deepEqual(plain([0xA5, 0x02]), [{ addr: 0x02, write: false, ptr: false }]);       // LDA zp
  assert.deepEqual(plain([0xB1, 0xFE]), [{ addr: 0xFE, write: false, ptr: true }, { addr: 0xFF, write: false, ptr: true }]);
  assert.deepEqual(plain([0xE6, 0x10]), [{ addr: 0x10, write: true, ptr: false }]);       // INC zp
  assert.deepEqual(plain([0x8D, 0x20, 0xD0]), []);                                       // STA $D020
  assert.deepEqual(plain([0xAD, 0x05, 0x00]), [{ addr: 0x05, write: false, ptr: false }]); // LDA $0005 (abs)
  assert.deepEqual(plain([0xA9, 0x05]), []);                                             // LDA #
});

test("conflicts only with the SID player present", () => {
  const { analyze } = load();
  const main = { bytes: [0x85, 0xFB], srcLine: 3, blockId: "a", index: 3, owner: "start" };
  const sidUse = { bytes: [0xA5, 0xFB], srcLine: 40, blockId: "b", index: 40, owner: "sid" };
  const free = { bytes: [0x85, 0xFE], srcLine: 4, blockId: "c", index: 4, owner: "start" };
  assert.deepEqual([...analyze([main, free]).conflicts], []);
  const r = analyze([main, sidUse, free]);
  assert.deepEqual([...r.conflicts], [0xFB]);
  assert.equal(r.map.get(0xFB).write, true);
  assert.equal(r.map.get(0xFB).read, true);
  assert.equal(r.map.get(0xFB).refs.length, 2);
});
