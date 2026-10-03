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

function run(code) {
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(`
    let _expertProjectData = null, _expertProjectDirty = false;
    let _ubProjectData = null, _ubProjectDirty = false, _ubStartupTabId = 99;
    const tabs = [{ id: 7, filePath: "C:/proj/boot.ub" }];
    const _normFilePath = (p) => (p || "").replace(/\\\\/g, "/").toLowerCase();
    const _findTabByPath = (p) => tabs.find(t => _normFilePath(t.filePath) === _normFilePath(p)) || null;
    const _ubResolveProjectPath = (p) => "C:/proj/" + p;
    let renders = 0;
    const _expertRenderProjectTree = () => { renders++; };
    const _ubRenderProjectFiles = () => { renders++; };
    ${extractFunctionSource("_workspaceProjectSnapshot")}
    ${extractFunctionSource("_workspaceRestoreProjects")}
    ${code}
  `, ctx);
  return ctx.out;
}

test("workspace project snapshot strips runtime fields and keeps the save target", () => {
  const out = run(`
    this.out = _workspaceProjectSnapshot({
      name: "demo", _projPath: "C:/proj/demo.proj", startupFile: "boot.ub",
      files: [
        { type: "file", name: "boot.ub", path: "boot.ub", _id: "x" },
        { type: "folder", name: "fonts", path: "fonts", _collapsed: true, _id: "y", children: [{ type: "file", name: "a.bin", path: "fonts/a.bin", _id: "z" }] },
        { type: "symbol", name: "junk" }
      ]
    }, true);
  `);
  assert.equal(out.projPath, "C:/proj/demo.proj");
  assert.equal(out.dirty, true);
  assert.equal(out.files.length, 2);
  assert.equal(out.files[0]._id, undefined);
  assert.equal(out.files[1]._collapsed, true);
  assert.equal(out.files[1].children[0].path, "fonts/a.bin");
  assert.equal(run(`this.out = _workspaceProjectSnapshot(null, false);`), null);
});

test("workspace restore brings back both projects and rebinds the UB startup tab", () => {
  const out = run(`
    _workspaceRestoreProjects({
      expert: { name: "asm", files: [], startupFile: null, projPath: "C:/a/asm.proj", dirty: false },
      ub: { name: "ub", files: [{ type: "file", name: "boot.ub", path: "boot.ub" }], startupFile: "boot.ub", projPath: "C:/proj/ub.proj", dirty: true }
    });
    this.out = { expert: _expertProjectData, ub: _ubProjectData, ubDirty: _ubProjectDirty, startup: _ubStartupTabId, renders };
  `);
  assert.equal(out.expert._projPath, "C:/a/asm.proj");
  assert.equal(out.ub._projPath, "C:/proj/ub.proj");
  assert.equal(out.ubDirty, true);
  assert.equal(out.startup, 7);
  assert.equal(out.renders, 2);
});
