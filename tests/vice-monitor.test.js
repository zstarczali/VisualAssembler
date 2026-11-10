const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8").replace(/\r\n/g, "\n");

function load() {
  const start = appJs.indexOf("function _vmParseWatch(");
  const end = appJs.indexOf("function _vmSetStatus(");
  assert.ok(start > 0 && end > start, "VICE monitor helpers not found");
  const context = {};
  vm.createContext(context);
  vm.runInContext(appJs.slice(start, end) +
    "\nthis.parse = (t, l) => JSON.stringify(_vmParseWatch(t, l)); this.agg = (s, m) => JSON.stringify(_vmAggregate(s, m)); this.amap = _vmAddressMap;", context);
  return {
    parse: (text, labels) => JSON.parse(context.parse(text, labels)),
    agg: (samples, map) => JSON.parse(context.agg(samples, map)),
    amap: context.amap,
  };
}

test("watch expressions: labels, hex, decimal, byte count", () => {
  const { parse } = load();
  const labels = new Map([["score", 0x0F00], ["Table", 0xC100]]);
  assert.deepEqual(parse("score", labels), { name: "score", addr: 0x0F00, size: 1 });
  assert.deepEqual(parse("$D020", labels), { name: "$D020", addr: 0xD020, size: 1 });
  assert.deepEqual(parse("53281", labels), { name: "53281", addr: 0xD021, size: 1 });
  assert.deepEqual(parse("Table, 8", labels), { name: "Table", addr: 0xC100, size: 8 });
  assert.deepEqual(parse("$FFFE, 16", labels), { name: "$FFFE", addr: 0xFFFE, size: 2 });
  assert.equal(parse("nope", labels), null);
  assert.equal(parse("score +", labels), null);
});

test("profile aggregation by routine and line, with raster ranges and ROM areas", () => {
  const { agg, amap } = load();
  const layout = { lines: [
    { address: 0x1000, size: 0, block: { isLabel: true, labelName: "main" } },
    { address: 0x1000, size: 3, block: { _srcLine: 1, id: "a" } },
    { address: 0x1003, size: 2, block: { _srcLine: 2, id: "b" } },
    { address: 0x1005, size: 0, block: { isLabel: true, labelName: "irq" } },
    { address: 0x1005, size: 3, block: { _srcLine: 4, id: "c" } },
  ] };
  const map = amap(layout);
  assert.equal(map.get(0x1004).routine, "main");
  assert.equal(map.get(0x1006).routine, "irq");
  const r = agg([[0x1000, 10], [0x1003, 12], [0x1005, 250], [0x1005, 251], [0x1006, 252], [0xEA31, 0xFFFF]], map);
  assert.equal(r.total, 6);
  assert.deepEqual(r.routines.map((x) => [x.key, x.count]), [["irq", 3], ["main", 2], ["@kernal", 1]]);
  assert.equal(r.routines[0].minLine, 250);
  assert.equal(r.routines[0].maxLine, 252);
  assert.deepEqual(r.lines.map((x) => [x.srcLine, x.count]), [[4, 3], [1, 1], [2, 1]]);
});

test("UB profile map: dbg spans with the nearest sub as routine", () => {
  const start = appJs.indexOf("function _vmUbAddressMap(");
  const end = appJs.indexOf("function _vmSetStatus(");
  const context = {};
  vm.createContext(context);
  vm.runInContext(appJs.slice(start, end) + "\nthis.m = (r) => JSON.stringify([..._vmUbAddressMap(r)]);", context);
  const map = new Map(JSON.parse(context.m({
    map: { subroutines: [{ name: "tick", address: 0x0900 }] },
    debug: { dbg: "    0810,0812,0,3,1,3,1\n    0900,0901,0,8,1,8,1\n" },
  })));
  assert.deepEqual(map.get(0x0811), { routine: "main", srcLine: 2, index: 2 });
  assert.deepEqual(map.get(0x0901), { routine: "tick", srcLine: 7, index: 7 });
  assert.equal(map.size, 5);
});
