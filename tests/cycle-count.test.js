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
  assert.ok(opStart > 0 && revStart > 0 && revEnd > revStart, "cycle helpers not found");
  const context = {};
  vm.createContext(context);
  vm.runInContext(appJs.slice(opStart, opEnd) + appJs.slice(revStart, revEnd) +
    "\nthis.c = { info: _cycleInfo, collect: _cycleCollect, sum: _cycleSum, table: _OP_CYCLES };", context);
  return context.c;
}

test("cycle table has 256 entries", () => {
  assert.equal(load().table.length, 256);
});

test("plain instructions", () => {
  const { info } = load();
  assert.equal(info([0xA9, 0x00], 0x1000).text, "2");      // LDA #
  assert.equal(info([0x8D, 0x20, 0xD0], 0x1000).text, "4"); // STA abs
  assert.equal(info([0x20, 0x00, 0x10], 0x1000).text, "6"); // JSR
  assert.equal(info([0xEE, 0x20, 0xD0], 0x1000).text, "6"); // INC abs
  assert.equal(info([0x9D, 0x00, 0x04], 0x1000).text, "5"); // STA abs,X: no penalty
  assert.equal(info([0xFE, 0x00, 0x04], 0x1000).text, "7"); // INC abs,X
});

test("indexed reads: + unless the base is page aligned", () => {
  const { info } = load();
  assert.deepEqual({ ...info([0xBD, 0x01, 0x04], 0x1000) }, { min: 4, max: 5, text: "4+", warn: false });
  assert.equal(info([0xBD, 0x00, 0x04], 0x1000).text, "4");
  assert.equal(info([0xB1, 0xFB], 0x1000).text, "5+");
});

test("branches: taken costs +1, +2 across a page", () => {
  const { info } = load();
  assert.deepEqual({ ...info([0xD0, 0xFE], 0x1000) }, { min: 2, max: 3, text: "2/3", warn: false });
  // $10FE: next = $1100, -4 → $10FC (previous page)
  assert.deepEqual({ ...info([0xD0, 0xFC], 0x10FE) }, { min: 2, max: 4, text: "2/4", warn: true });
});

test("only real instruction lines are collected and summed", () => {
  const { collect, sum } = load();
  const map = new Map();
  collect(map, { address: 0x1000, block: { _srcLine: 0, mnemonic: "LDA" } }, [0xA9, 0x01]);
  collect(map, { address: 0x1002, block: { _srcLine: 1, mnemonic: "STA" } }, [0x8D, 0x20, 0xD0]);
  collect(map, { address: 0x1005, block: { _srcLine: 2, mnemonic: "BYTE" } }, [0x01, 0x02]);
  collect(map, { address: 0x1007, block: { _srcLine: 3, mnemonic: "LOOP" } }, [0xA2, 0x05]);
  collect(map, { address: 0x1009, block: { _srcLine: 4, mnemonic: "BNE" } }, [0xD0, 0xF5]);
  assert.deepEqual([...map.keys()], [0, 1, 4]);
  const s = sum(map, 0, 4);
  assert.equal(s.count, 3);
  assert.equal(s.min, 8);
  assert.equal(s.max, 9);
  assert.ok(Math.abs(s.rasterLines - 9 / 63) < 1e-9);
});
