const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");
const levelBin = new Uint8Array(fs.readFileSync(path.join(__dirname, "..", "samples", "level.bin")));

function slice(startMarker, endMarker) {
  const start = appJs.indexOf(startMarker);
  const end = appJs.indexOf(endMarker, start);
  assert.ok(start > 0 && end > start, "slice not found: " + startMarker);
  return appJs.slice(start, end);
}

// LEVEL helpers: DOM-free slice from the LEVEL comment to _LEVEL_ROW_SIZE, plus the
// VA bin-meta reader/writer they use.
function loadLevel() {
  const context = {
    t: (k) => k,
    tf: (k, v) => k + JSON.stringify(v),
    TextEncoder, TextDecoder,
    _importMakeIncBin: (name, addr) => ({ isIncBinMacro: true, incBinFileName: name, incBinBytes: [], incBinAddress: "$" + addr }),
    _koalaData: (b) => b.incBinBytes,
    parseAddressValue: (raw) => {
      const m = /^\$?([0-9A-Fa-f]{1,4})$/.exec(String(raw || "").trim());
      return m ? parseInt(m[1], 16) : null;
    },
  };
  vm.createContext(context);
  vm.runInContext(
    slice("const _VA_BIN_META_MAGIC", "/* Save raw bytes") +
    slice("/* LEVEL = INCBIN variant", "const _LEVEL_ROW_SIZE") +
    "\nconst _LEVEL_ROW_SIZE = _levelRowBytes(0, 0, 0, false, new Proxy({}, { get: () => 0 })).length;" +
    "\nthis.api = { build: _levelBuild, info: _levelInfo, payload: _incBinPayload, parse: _levelRowParse," +
    " row: _levelRowBytes, size: _LEVEL_ROW_SIZE, meta: _vaBuildBinWithMeta, read: _vaReadBinWithMeta };",
    context);
  return context.api;
}

function levelFile(api, w, h, cells, screens) {
  const payload = new Uint8Array(screens * 2000);
  for (let s = 0; s < screens; s++)
    for (let i = 0; i < 2000; i++) payload[s * 2000 + i] = (s * 31 + i * 7) & 0xFF;
  return api.meta(payload, { kind: "lv-level", settings: { layout: "grid", w, h, cells, bgColor: 6 }, extras: {} });
}

// Just enough 6502 for the .level_row routine.
function runRow(mem, code, org, x) {
  mem.set(code, org);
  let pc = org, a = 0, y = 0, c = 0, z = 0, n = 0;
  const rd16 = () => mem[pc] | (mem[pc + 1] << 8);
  const nz = (v) => { z = v === 0 ? 1 : 0; n = v & 0x80 ? 1 : 0; return v; };
  const adc = (v) => { const r = a + v + c; c = r > 0xFF ? 1 : 0; a = nz(r & 0xFF); };
  const branch = (cond) => { const rel = mem[pc++]; if (cond) pc += rel < 128 ? rel : rel - 256; };
  for (let steps = 0; steps < 200000; steps++) {
    if (pc === org + code.length) return;
    const op = mem[pc++];
    switch (op) {
      case 0xAC: y = nz(mem[rd16()]); pc += 2; break;
      case 0xAD: a = nz(mem[rd16()]); pc += 2; break;
      case 0xB9: a = nz(mem[(rd16() + y) & 0xFFFF]); pc += 2; break;
      case 0xBD: a = nz(mem[(rd16() + x) & 0xFFFF]); pc += 2; break;
      case 0x8D: mem[rd16()] = a; pc += 2; break;
      case 0x99: mem[(rd16() + y) & 0xFFFF] = a; pc += 2; break;
      case 0x49: a = nz(a ^ mem[pc++]); break;
      case 0x69: adc(mem[pc++]); break;
      case 0x79: adc(mem[(rd16() + y) & 0xFFFF]); pc += 2; break;
      case 0x7D: adc(mem[(rd16() + x) & 0xFFFF]); pc += 2; break;
      case 0x18: c = 0; break;
      case 0xA8: y = nz(a); break;
      case 0xA0: y = nz(mem[pc++]); break;
      case 0x88: y = nz((y - 1) & 0xFF); break;
      case 0xEE: { const ad = rd16(); mem[ad] = nz((mem[ad] + 1) & 0xFF); pc += 2; break; }
      case 0x90: branch(!c); break;
      case 0x10: branch(!n); break;
      case 0xF0: branch(z); break;
      default: throw new Error("unexpected opcode $" + op.toString(16) + " at $" + (pc - 1).toString(16));
    }
  }
  throw new Error("routine did not finish");
}

test("samples/level.bin builds 10 placed screens + tables and the LEVEL constants", () => {
  const api = loadLevel();
  const info = api.build(levelBin, 0x4000);
  assert.equal(info.ok, true, info.error);
  assert.equal(info.screens, 10);
  const L = info.labels;
  assert.equal(L.LEVEL_W, 2);
  assert.equal(L.LEVEL_H, 5);
  assert.equal(L.LEVEL_COLS, 80);
  assert.equal(L.LEVEL_ROWS, 125);
  assert.equal(L.LEVEL_MAX_X, 320);
  assert.equal(L.LEVEL_MAX_Y, 800);
  assert.equal(L.LEVEL_MULTICOLOR, 1);
  assert.equal(L.LEVEL_BG, 6);
  assert.equal(L.LEVEL_DATA, 0x4000);
  assert.equal(L.LEVEL_END, 0x4000 + info.data.length);
  // slot 3 (row 1, right) = library screen 4 = 4th emitted screen
  const parsed = api.read(levelBin);
  const slot3 = (info.data[L.LEVEL_SLOT_LO - 0x4000 + 3] | (info.data[L.LEVEL_SLOT_HI - 0x4000 + 3] << 8)) - 0x4000;
  assert.deepEqual(Array.from(info.data.slice(slot3, slot3 + 2000)), Array.from(parsed.payload.subarray(4 * 2000, 5 * 2000)));
});

test("a screen used twice is stored once, empty slots share one blank screen", () => {
  const api = loadLevel();
  const info = api.build(levelFile(api, 2, 2, [0, 0, -1, -1], 1), 0x2000);
  assert.equal(info.ok, true, info.error);
  assert.equal(info.screens, 2);
  const L = info.labels;
  const slot = (s) => info.data[L.LEVEL_SLOT_LO - 0x2000 + s] | (info.data[L.LEVEL_SLOT_HI - 0x2000 + s] << 8);
  assert.equal(slot(0), slot(1));
  assert.equal(slot(2), slot(3));
  assert.equal(info.data[slot(2) - 0x2000], 0x20);
});

test("non-level files, empty and oversized levels are rejected", () => {
  const api = loadLevel();
  assert.equal(api.build(new Uint8Array(3000), 0x2000).error, "levelMacroNotLevel");
  assert.equal(api.build(levelFile(api, 1, 1, [-1], 1), 0x2000).error, "levelMacroEmpty");
  assert.match(api.build(levelFile(api, 8, 1, [0], 1), 0x2000).error, /^levelMacroTooLarge/);
  assert.match(api.build(levelFile(api, 1, 1, [0], 1), 0xFC00).error, /^levelMacroTooBig/);
  assert.deepEqual(JSON.parse(JSON.stringify(api.build([], 0x2000))), { ok: false, error: "", data: [], labels: {} });
});

test(".level_row operand parsing", () => {
  const api = loadLevel();
  assert.deepEqual({ ...api.parse("ptr, view_x") }, { dst: "ptr", col: "view_x", color: false });
  assert.deepEqual({ ...api.parse("ptr, view_x, color") }, { dst: "ptr", col: "view_x", color: true });
  assert.equal(api.parse("ptr"), null);
  assert.equal(api.parse("ptr, x, blue"), null);
});

test(".level_row copies every row and window column (screen and color) like the level map", () => {
  const api = loadLevel();
  const base = 0x4000;
  const info = api.build(levelBin, base);
  const L = info.labels;
  const parsed = api.read(levelBin);
  const cells = JSON.parse(JSON.stringify(parsed.manifest.settings.cells));
  const expected = (row, col, color) => {
    const out = [];
    for (let c = col; c < col + 40; c++) {
      const s = cells[Math.floor(row / 25) * 2 + Math.floor(c / 40)];
      out.push(parsed.payload[s * 2000 + (color ? 1000 : 0) + (row % 25) * 40 + (c % 40)]);
    }
    return out;
  };
  const COL = 0x00F0, DST = 0x00F2, TARGET = 0x0400, ORG = 0xC000;
  for (const color of [false, true]) {
    const code = api.row(ORG, DST, COL, color, L);
    assert.equal(code.length, api.size);
    for (const row of [0, 1, 24, 25, 60, 124]) {
      for (const col of [0, 1, 7, 20, 39, 40]) {
        const mem = new Uint8Array(0x10000);
        mem.set(info.data, base);
        mem[COL] = col;
        mem[DST] = TARGET & 0xFF; mem[DST + 1] = TARGET >> 8;
        runRow(mem, code, ORG, row);
        assert.deepEqual(Array.from(mem.subarray(TARGET, TARGET + 40)), expected(row, col, color), `row ${row} col ${col} color ${color}`);
        assert.equal(mem[TARGET + 40], 0, "nothing written past the 40 bytes");
      }
    }
  }
});

test("_incBinPayload returns the processed level data for a LEVEL block", () => {
  const api = loadLevel();
  const block = { isIncBinMacro: true, incBinLevel: true, incBinAddress: "$4000", incBinBytes: Array.from(levelBin) };
  assert.equal(api.payload(block).length, api.info(block).data.length);
  assert.ok(api.payload(block).length < levelBin.length);
});
