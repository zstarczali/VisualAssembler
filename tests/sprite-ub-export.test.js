const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8").replace(/\r\n/g, "\n");

function load() {
  const start = appJs.indexOf("function _spExportUb(");
  const end = appJs.indexOf("/* Current frame as comma-separated hex bytes");
  const context = {};
  vm.createContext(context);
  vm.runInContext(appJs.slice(start, end) + "\nthis.ub = _spExportUb;", context);
  return context.ub;
}

const opts = { multi: false, col: { sprite: 7, mc1: 2, mc2: 11 }, fps: 10, expX: false, expY: false, bytesOf: (fr) => fr };
const frame = (v) => Array.from({ length: 64 }, (_, i) => (i < 63 ? (v + i) & 0xFF : 0));

test("single frame: sprdef 0 and a static sprite", () => {
  const out = load()([frame(0)], opts);
  assert.match(out, /^sprdef 0\n  0,1,2\n/m);
  assert.match(out, /  60,61,62\nend/);
  assert.ok(!/loop/.test(out));
  assert.match(out, /sprite color 0, 7\nsprite on 0$/);
});

test("animation: one sprdef per frame, pointers saved, raster-synced loop", () => {
  const out = load()([frame(0), frame(1), frame(2)], { ...opts, multi: true, expX: true });
  assert.equal((out.match(/^sprdef \d$/gm) || []).length, 3);
  assert.match(out, /const ANIM_SPEED = 5 /);
  assert.match(out, /var anim = array\(3\)\nanim\[0\] = peek\(\$07F8\)\nanim\[1\] = peek\(\$07F9\)\nanim\[2\] = peek\(\$07FA\)\n/);
  assert.match(out, /poke \$D01C, 1\npoke \$D025, 2\npoke \$D026, 11\npoke \$D01D, 1/);
  assert.match(out, /if frame >= 3 then frame = 0 end\n    poke \$07F8, anim\[frame\]/);
});

test("at most 8 frames", () => {
  const out = load()(Array.from({ length: 10 }, (_, i) => frame(i)), opts);
  assert.equal((out.match(/^sprdef \d$/gm) || []).length, 8);
  assert.match(out, /only the first 8 frames/);
});
