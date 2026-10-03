const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");

function extractFunctionSource(name) {
  const start = appJs.indexOf(`function ${name}(`);
  assert.notStrictEqual(start, -1, `Missing function ${name}`);
  let depth = 0, seen = false;
  for (let i = start; i < appJs.length; i++) {
    if (appJs[i] === "{") { depth++; seen = true; }
    else if (appJs[i] === "}" && seen && --depth === 0) return appJs.slice(start, i + 1);
  }
  throw new Error(`Could not parse ${name}`);
}

function usageFor(result) {
  const ctx = { result };
  vm.createContext(ctx);
  vm.runInContext(`
    const _UB_FREE_ZERO_RUN = 256;
    const memorySegments = [{ start: 0x0000, end: 0x9FFF, kind: "ram" }, { start: 0xA000, end: 0xBFFF, kind: "rom" }, { start: 0xC000, end: 0xCFFF, kind: "ram" }];
    const t = (key) => key === "memoryOverlapCode" ? "Code" : key;
    const formatAddress = (a) => "$" + a.toString(16).toUpperCase().padStart(4, "0");
    const _getActiveTab = () => null;
    ${extractFunctionSource("mergeMemoryRanges")}
    ${extractFunctionSource("countRangeBytes")}
    ${extractFunctionSource("_ubRegionLabel")}
    ${extractFunctionSource("_ubMemoryUsage")}
    this.out = _ubMemoryUsage(result);
  `, ctx);
  return ctx.out;
}

// PRG: $0801-tól; kód-bázis $080D. A kódot egy incbin-hez vezető padding és egy incbin követi.
function makeResult({ codeLen = 100, padTo = 0x2000, incbinLen = 64, orgGap = 0 } = {}) {
  const loadAddress = 0x080D;
  const stub = new Array(12).fill(0x11);
  const code = [];
  for (let i = 0; i < codeLen; i++) code.push(0xEA);
  const gapStart = code.length;
  for (let i = 0; i < orgGap; i++) code.push(0x00);
  for (let i = 0; i < 20; i++) code.push(0x60); // sub a gap után
  const padStart = code.length;
  while (loadAddress + code.length < padTo) code.push(0x00);
  const padEnd = code.length;
  const incStart = code.length;
  for (let i = 0; i < incbinLen; i++) code.push(0xFF);
  const regions = [
    { start: padStart, end: padEnd, name: "ub_incbin_padding" },
    { start: incStart, end: code.length, name: "incbin_fonts/font01.bin" }
  ];
  return {
    ok: true,
    prg: [0x01, 0x08, ...stub, ...code],
    map: { loadAddress, codeSize: code.length, dataRegions: regions, arrays: [], variables: [], internal: {} },
    _gapStart: gapStart
  };
}

test("UB memory: code and incbin occupied, padding is free", () => {
  const usage = usageFor(makeResult());
  const labels = usage.occupiedRanges.map(r => r.label);
  assert.ok(labels.some(l => l.startsWith("Code $0801")));
  assert.ok(labels.includes("INCBIN fonts/font01.bin $2000–$203F"));
  // $0801 + 12 stub + 100 kód + 20 sub = $0881 a kód vége; a padding szabad
  assert.equal(usage.mergedOccupied.length, 2);
  assert.equal(usage.mergedOccupied[0].end, 0x0801 + 12 + 120 - 1);
  assert.equal(usage.overlaps.length, 0);
});

test("UB memory: long org zero gap is free, short zero runs stay code", () => {
  const usage = usageFor(makeResult({ orgGap: 512 }));
  const code = usage.occupiedRanges.filter(r => r.type === "code");
  assert.equal(code.length, 2);
  const short = usageFor(makeResult({ orgGap: 10 }));
  assert.equal(short.occupiedRanges.filter(r => r.type === "code").length, 1);
});

test("UB memory: arrays and zero page are reported, array overlapping incbin is flagged", () => {
  const result = makeResult();
  result.map.arrays = [{ name: "board", address: 0x2020, size: 64 }];
  result.map.variables = [{ name: "a", address: 0x02, type: "int" }, { name: "b", address: 0x04, type: "word" }];
  const usage = usageFor(result);
  assert.ok(usage.occupiedRanges.some(r => r.type === "zp" && r.start === 0x02 && r.end === 0x05));
  assert.equal(usage.overlaps.length, 1);
  assert.equal(usage.overlaps[0].overlapStart, 0x2020);
  assert.equal(usage.overlaps[0].bytes, 32);
});

test("UB memory: no build result gives an empty map", () => {
  const usage = usageFor(null);
  assert.equal(usage.occupiedRanges.length, 0);
  assert.equal(usage.occupiedRamBytes, 0);
});
