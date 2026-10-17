const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");

function loadViz() {
  const start = appJs.indexOf("function _sidVizBandEdges(");
  const end = appJs.indexOf("function _sidVizAnalysers(");
  assert.ok(start > 0 && end > start, "visualizer helpers not found");
  const context = {};
  vm.createContext(context);
  vm.runInContext(appJs.slice(start, end) + "\nthis.v = { edges: _sidVizBandEdges, levels: _sidVizBandLevels, hue: _sidVizRowHue };", context);
  return context.v;
}

test("bands are log-spaced from 30 Hz up to 14 kHz or Nyquist", () => {
  const v = loadViz();
  const e = v.edges(16, 48000);
  assert.equal(e.length, 17);
  assert.equal(Math.round(e[0]), 30);
  assert.equal(Math.round(e[16]), 14000);
  for (let i = 1; i < e.length; i++) assert.ok(e[i] > e[i - 1]);
  assert.ok(Math.abs(e[2] / e[1] - e[1] / e[0]) < 1e-9, "constant ratio");
  assert.equal(Math.round(v.edges(8, 22050)[8]), 11025);
});

test("a band takes its loudest bin; empty spectrum gives zero", () => {
  const v = loadViz();
  const data = new Uint8Array(1024);
  const hz = 48000 / 2048;
  data[Math.round(1000 / hz)] = 255;
  const levels = Array.from(v.levels(data, 48000, 2048, 16));
  assert.equal(levels.length, 16);
  assert.equal(levels.filter((x) => x === 1).length, 1, "1 kHz lights exactly one band");
  const band = levels.indexOf(1);
  const edges = v.edges(16, 48000);
  assert.ok(edges[band] <= 1000 + hz && edges[band + 1] >= 1000 - hz);
  assert.ok(Array.from(v.levels(new Uint8Array(1024), 48000, 2048, 8)).every((x) => x === 0));
});

test("rows run from green at the bottom to orange at the top", () => {
  const v = loadViz();
  assert.equal(v.hue(0, 10), 125);
  assert.equal(v.hue(9, 10), 25);
  assert.ok(v.hue(4, 10) < 125 && v.hue(4, 10) > 25);
});
