const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");

function extractFunctionSource(name) {
  const marker = `function ${name}(`;
  const start = appJs.indexOf(marker);
  assert.notStrictEqual(start, -1, `Missing function ${name}`);
  let depth = 0, end = -1, seenBrace = false;
  for (let i = start; i < appJs.length; i++) {
    const ch = appJs[i];
    if (ch === "{") { depth += 1; seenBrace = true; }
    else if (ch === "}") { depth -= 1; if (seenBrace && depth === 0) { end = i + 1; break; } }
  }
  assert.notStrictEqual(end, -1, `Could not parse function ${name}`);
  return appJs.slice(start, end);
}

function extractConstBlock(name) {
  const marker = `const ${name} = `;
  const start = appJs.indexOf(marker);
  assert.notStrictEqual(start, -1, `Missing const ${name}`);
  const end = appJs.indexOf("})();", start);
  assert.notStrictEqual(end, -1, `Could not parse const ${name}`);
  return appJs.slice(start, end + "})();".length);
}

function loadD64Sandbox() {
  const context = { Set, Array, Math, String, parseInt };
  vm.createContext(context);
  vm.runInContext(`
    ${extractConstBlock("D64_TRACK_SECTORS")}
    ${extractFunctionSource("_d64BlockTrackCount")}
    ${extractFunctionSource("_d64BlockOffset")}
    ${extractFunctionSource("_d64ParseBam")}
    ${extractFunctionSource("_d64WalkDirectoryChain")}
    ${extractFunctionSource("_d64FormatHexBlock")}
    ${extractFunctionSource("_d64ParseHexBlock")}
    this.D64_TRACK_SECTORS = D64_TRACK_SECTORS;
    this._d64BlockTrackCount = _d64BlockTrackCount;
    this._d64BlockOffset = _d64BlockOffset;
    this._d64ParseBam = _d64ParseBam;
    this._d64WalkDirectoryChain = _d64WalkDirectoryChain;
    this._d64FormatHexBlock = _d64FormatHexBlock;
    this._d64ParseHexBlock = _d64ParseHexBlock;
  `, context);
  return context;
}

test("D64 block editor: track/sector geometry sums to 683 blocks for a 35-track disk", () => {
  const { D64_TRACK_SECTORS } = loadD64Sandbox();
  let total = 0;
  for (let t = 1; t <= 35; t++) total += D64_TRACK_SECTORS[t];
  assert.strictEqual(total, 683);
});

test("D64 block editor: track count detection by image size", () => {
  const { _d64BlockTrackCount } = loadD64Sandbox();
  assert.strictEqual(_d64BlockTrackCount(683 * 256), 35);
  assert.strictEqual(_d64BlockTrackCount(768 * 256), 40);
});

test("D64 block editor: block offsets are sequential and non-overlapping", () => {
  const { _d64BlockOffset, D64_TRACK_SECTORS } = loadD64Sandbox();
  assert.strictEqual(_d64BlockOffset(1, 0), 0);
  // Track 18 sector 0 (the BAM) starts right after 17 full tracks of 21 sectors.
  assert.strictEqual(_d64BlockOffset(18, 0), 17 * 21 * 256);
  let expected = 0;
  for (let t = 1; t <= 35; t++) {
    for (let s = 0; s < D64_TRACK_SECTORS[t]; s++) {
      assert.strictEqual(_d64BlockOffset(t, s), expected);
      expected += 256;
    }
  }
  assert.strictEqual(expected, 683 * 256);
});

test("D64 block editor: BAM parsing reports exactly the free sectors set in the bitmap", () => {
  const { _d64ParseBam, _d64BlockOffset } = loadD64Sandbox();
  const bytes = new Array(683 * 256).fill(0);
  const bamOffset = _d64BlockOffset(18, 0);
  // Track 1 entry: free-count byte (unused by the parser) + 3-byte bitmap.
  // Mark sectors 0 and 4 free (bits 0 and 4), everything else in track 1 used.
  bytes[bamOffset + 4] = 2;                 // free count (not checked)
  bytes[bamOffset + 4 + 1] = 0b00010001;    // bits 0 and 4 set
  bytes[bamOffset + 4 + 2] = 0;
  bytes[bamOffset + 4 + 3] = 0;
  const free = _d64ParseBam(bytes);
  assert.ok(free.has("1:0"));
  assert.ok(free.has("1:4"));
  assert.ok(!free.has("1:1"));
  assert.ok(!free.has("1:2"));
  assert.ok(!free.has("2:0")); // track 2 entry left all-zero -> nothing free
});

test("D64 block editor: directory chain walk follows the track/sector links to the end", () => {
  const { _d64WalkDirectoryChain, _d64BlockOffset } = loadD64Sandbox();
  const bytes = new Array(683 * 256).fill(0);
  // 18:1 -> 18:2 -> end (next track byte 0).
  const off1 = _d64BlockOffset(18, 1);
  bytes[off1] = 18; bytes[off1 + 1] = 2;
  const off2 = _d64BlockOffset(18, 2);
  bytes[off2] = 0; bytes[off2 + 1] = 0xFF; // next-track 0 ends the chain
  const chain = _d64WalkDirectoryChain(bytes);
  assert.ok(chain.has("18:1"));
  assert.ok(chain.has("18:2"));
  assert.strictEqual(chain.size, 2);
});

test("D64 block editor: hex format/parse round-trips a 256-byte block", () => {
  const { _d64FormatHexBlock, _d64ParseHexBlock } = loadD64Sandbox();
  const original = Array.from({ length: 256 }, (_, i) => (i * 37 + 5) & 0xFF);
  const text = _d64FormatHexBlock(original);
  assert.strictEqual(text.split("\n").length, 16); // 16 rows of 16 bytes
  const parsed = _d64ParseHexBlock(text);
  // parsed was built inside the vm sandbox's own realm, so it has a distinct
  // Array.prototype identity from `original` here — deepStrictEqual would
  // (correctly) call that out as "same structure but not reference-equal".
  // Array.from() re-materializes it against this realm's Array before compare.
  assert.deepStrictEqual(Array.from(parsed), original);
});

test("D64 block editor: hex parser rejects anything other than exactly 256 bytes", () => {
  const { _d64ParseHexBlock } = loadD64Sandbox();
  assert.strictEqual(_d64ParseHexBlock("00 11 22"), null);
  assert.strictEqual(_d64ParseHexBlock(""), null);
});
