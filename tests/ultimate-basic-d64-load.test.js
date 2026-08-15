const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");
const start = appJs.indexOf("function _ubApplyD64LoadAddresses");
const end = appJs.indexOf("function _ubShowCompileErrors", start);

function apply(source, extras) {
  const context = { d64ExportState: { extras } };
  vm.createContext(context);
  vm.runInContext(`${appJs.slice(start, end)}; _ubApplyD64LoadAddresses(${JSON.stringify(source)});`, context);
  return context.d64ExportState.extras;
}

test("UltimateBasic LOAD address fills the matching D64 extra PRG header", () => {
  const extras = apply('load "MAPCHAR", $2000\n', [{ name: "MAPCHAR", loadAddress: "" }]);
  assert.equal(extras[0].loadAddress, "2000");
});

test("UltimateBasic LOAD matching is case-insensitive and leaves unrelated extras unchanged", () => {
  const extras = apply('load "mapchar", 8192\n', [
    { name: "MAPCHAR", loadAddress: "C000" },
    { name: "MUSIC", loadAddress: "1000" }
  ]);
  assert.equal(extras[0].loadAddress, "2000");
  assert.equal(extras[1].loadAddress, "1000");
});
