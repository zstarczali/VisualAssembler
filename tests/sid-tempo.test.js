const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const www = path.join(__dirname, "..", "www");
const source = fs.readFileSync(path.join(www, fs.existsSync(path.join(www, "sid-editor.js")) ? "sid-editor.js" : "app.js"), "utf8");

function fn(name) {
  const start = source.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, name);
  let depth = 0;
  for (let i = start; ; i++) {
    if (source[i] === "{") depth++;
    else if (source[i] === "}" && --depth === 0) return source.slice(start, i + 1);
  }
}

test("BPM follows frames per row, and is only shown", () => {
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(`const _SID_ROWS_PER_BEAT = 4; var _sidSpeed = 6; ${fn("_sidIsNtsc")} ${fn("_sidFps")} ${fn("_sidComputeBpm")}`, ctx);
  const bpm = (speed) => vm.runInContext(`_sidSpeed = ${speed}; _sidComputeBpm()`, ctx);
  assert.deepEqual([4, 5, 6, 7, 8].map(bpm), [188, 150, 125, 107, 94]);
  const html = fs.readFileSync(path.join(www, "index.html"), "utf8");
  assert.match(html, /<span id="sid-bpm"/);
  assert.doesNotMatch(html, /<input id="sid-bpm"/);
  assert.ok(fn("_sidUpdateBpmDisplay").includes("el.textContent"));
});

test("the label says what the number is, in all seven languages", () => {
  const i18n = fs.readFileSync(path.join(www, "i18n.js"), "utf8");
  const labels = [...i18n.matchAll(/"sidSpeed": "([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(labels, ["Frame/sor:", "Frames/row:", "Frames/fila:", "Frames/Zeile:", "Frames/rij:", "Klatki/wiersz:", "Frame/riga:"]);
});
