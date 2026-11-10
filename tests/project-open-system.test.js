// Project trees: which files VA opens itself and which go to the system's program.
const test = require("node:test");
const assert = require("node:assert/strict");
const loadApp = require("./helpers/load-app");

const app = loadApp();
const system = (name, ub = false) => app.run(`_projOpensInSystem(${JSON.stringify(name)}, ${ub})`);

test("the Expert tree opens sources and projects itself, the rest with the system", () => {
  for (const name of ["main.asm", "lib.inc", "x.s", "demo.json", "game.proj"]) assert.equal(system(name), false, name);
  for (const name of ["logo.png", "manual.pdf", "game.prg", "tune.sid", "disk.d64", "notes.txt"]) assert.equal(system(name), true, name);
});

test("the UltimateBasic tree opens only .ub itself", () => {
  assert.equal(system("main.ub", true), false);
  assert.equal(system("MAIN.UB", true), false);
  assert.equal(system("level.bin", true), true);
  assert.equal(system("readme.md", true), true);
});
