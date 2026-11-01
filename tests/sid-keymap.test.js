const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function keymap() {
  const src = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");
  const m = /const _SID_KEYMAP = (\{[^}]*\});/.exec(src);
  assert.ok(m, "_SID_KEYMAP not found");
  return vm.runInNewContext("(" + m[1] + ")");
}

const notes = (keys, map) => Array.from(keys, (k) => map[k]);
const chromatic = (from, count) => Array.from({ length: count }, (_, i) => from + i);

test("tracker keys: the lower row is one chromatic octave", () => {
  assert.deepEqual(notes("zsxdcvgbhnjm", keymap()), chromatic(0, 12));
});

test("tracker keys: the upper row is the same, one octave up, and has every note", () => {
  assert.deepEqual(notes("q2w3er5t6y7u", keymap()), chromatic(12, 12));
  assert.equal(keymap().i, 24, "I is the C after the octave");
});
