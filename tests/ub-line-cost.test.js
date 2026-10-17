const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8").replace(/\r\n/g, "\n");

function fn(name) {
  const start = appJs.indexOf("function " + name + "(");
  let depth = 0;
  for (let i = appJs.indexOf("{", start); i < appJs.length; i++) {
    if (appJs[i] === "{") depth++;
    else if (appJs[i] === "}" && --depth === 0) return appJs.slice(start, i + 1);
  }
  throw new Error(name);
}

function load() {
  const opStart = appJs.indexOf("const opcodeMap = {");
  const opEnd = appJs.indexOf("\n};\n", opStart) + 4;
  const context = {};
  vm.createContext(context);
  vm.runInContext(appJs.slice(opStart, opEnd) + appJs.slice(appJs.indexOf("const _REV_OP = ("), appJs.indexOf("function _disasmBytes(")) +
    fn("_ubLineCost") + "\nthis.cost = (r) => JSON.stringify([..._ubLineCost(r)]);", context);
  return (r) => new Map(JSON.parse(context.cost(r)));
}

test("bytes and straight-line cycles per UB source line", () => {
  const cost = load();
  // line 3: LDA #$00 / STA $D020 (2+3 bytes, 2+4 cycles); line 5: JSR $1000 + RTS; line 7: data
  const code = [0xA9, 0x00, 0x8D, 0x20, 0xD0, 0x20, 0x00, 0x10, 0x60, 0x01, 0x02, 0x03];
  const r = cost({
    map: { loadAddress: 0x0801, codeBytes: code, dataRegions: [{ start: 9, end: 12, name: "ub_sprite" }] },
    debug: { dbg: "<Segment>\n    0801,0805,0,3,1,3,1\n    0806,0809,0,5,1,5,1\n    080a,080c,0,7,1,7,1\n    0806,0806,0,9,1,9,1\n" },
  });
  assert.deepEqual(r.get(2), { bytes: 5, cycles: 6 });
  assert.deepEqual(r.get(4), { bytes: 4, cycles: 12 });
  assert.deepEqual(r.get(6), { bytes: 3, cycles: 0 });
  assert.equal(cost({}).size, 0);
});
