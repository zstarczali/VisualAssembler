// One language per project (STUDIO-PROJECT-PLAN.md 2.1): source / data / foreign files of each project kind.
const test = require("node:test");
const assert = require("node:assert/strict");
const loadApp = require("./helpers/load-app");

const app = loadApp();
const role = (kind, path) => app.run(`_projFileRole(${JSON.stringify(kind)}, ${JSON.stringify(path)})`);

test("an assembly project holds assembly and block programs, not UB or C", () => {
  for (const f of ["main.asm", "lib.s", "x.a65", "macros.inc", "box.vas"]) assert.equal(role("asm", f), "source", f);
  for (const f of ["game.ub", "main.c", "lib.h"]) assert.equal(role("asm", f), "foreign", f);
});

test("a UB project holds .ub only", () => {
  assert.equal(role("ub", "main.ub"), "source");
  for (const f of ["main.asm", "main.c", "box.vas"]) assert.equal(role("ub", f), "foreign", f);
});

test("a C project holds C and assembly, not UB", () => {
  for (const f of ["main.c", "vic.h", "fast.asm", "tab.s", "def.inc"]) assert.equal(role("c", f), "source", f);
  assert.equal(role("c", "game.ub"), "foreign");
  assert.equal(role("c", "old.vas"), "foreign");
});

test("data files go into any project", () => {
  for (const kind of ["asm", "ub", "c"]) {
    for (const f of ["music.sid", "pic.koa", "level.bin", "notes.txt", "font.png"]) assert.equal(role(kind, f), "asset", `${kind} ${f}`);
  }
});

test("adding keeps the allowed files and names the refused ones", () => {
  const kept = app.run(`(() => {
    let said = "";
    showViceToast = () => {};
    const ok = _projFilterAddable("ub", [{ fileName: "a.ub" }, { fileName: "b.c" }, { fileName: "m.sid" }], (m) => { said = m; });
    return { names: ok.map(f => f.fileName), said };
  })()`);
  assert.deepEqual([...kept.names], ["a.ub", "m.sid"]);
  assert.match(kept.said, /b\.c/);
});
