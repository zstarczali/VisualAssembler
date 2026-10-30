// The starred startup file of a project: found at any depth, built whether its tab is open or not;
// only a tab outside the project builds itself.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");
function slice(startMarker, endMarker) {
  const start = appJs.indexOf(startMarker);
  const end = appJs.indexOf(endMarker, start);
  assert.ok(start >= 0 && end > start, `section not found: ${startMarker}`);
  return appJs.slice(start, end);
}

const tree = [
  { type: "file", name: "a.ub", path: "a.ub" },
  { type: "file", name: "b.ub", path: "b.ub" },
  { type: "folder", name: "sub", path: "sub", children: [{ type: "file", name: "n.ub", path: "sub/n.ub" }] },
];

function target({ star, active, open = {}, disk = {}, editor = "editor text" }) {
  const tabs = Object.entries(open).map(([filePath, ubText], i) => ({ id: i + 1, name: filePath, filePath, ubText }));
  const activeTab = tabs.find(tab => tab.filePath === active) || { id: 99, filePath: active };
  if (!tabs.includes(activeTab)) tabs.push(activeTab);
  const ctx = vm.createContext({
    tabs,
    activeTabId: activeTab.id,
    ubEditor: { value: editor },
    _ubFilePath: active || "",
    _ubProjectData: { files: tree, startupFile: star },
    _normFilePath: (p) => String(p || "").toLowerCase(),
    _ubResolveProjectPath: (p) => "c:/p/" + p,
    _findTabByPath: (p) => tabs.find(tab => tab.filePath === p) || null,
    tf: (key, values) => `${key}:${values.file}`,
    window: { electronAPI: { readTextFile: async (p) => (p in disk ? { ok: true, content: disk[p] } : { ok: false }) } },
  });
  vm.runInContext(slice("function _projFindEntry(", "function _projHasFile(") + slice("async function _ubBuildTarget(", "function _ubCompileTarget("), ctx);
  return vm.runInContext("_ubBuildTarget()", ctx);
}

test("the entry of a project tree is found at any depth", () => {
  const ctx = vm.createContext({});
  vm.runInContext(slice("function _projFindEntry(", "function _projHasFile("), ctx);
  ctx.tree = tree;
  assert.equal(vm.runInContext('_projFindEntry(tree, "a.ub")?.name', ctx), "a.ub");
  assert.equal(vm.runInContext('_projFindEntry(tree, "sub/n.ub")?.name', ctx), "n.ub");
  assert.equal(vm.runInContext('_projFindEntry(tree, "nope.ub")', ctx), null);
  assert.equal(vm.runInContext('_projFindEntry(undefined, "a.ub")', ctx), null);
});

test("UB: the starred file builds from its open tab, whichever file is active", async () => {
  const t = await target({ star: "a.ub", active: "c:/p/b.ub", open: { "c:/p/a.ub": "A", "c:/p/b.ub": "B" } });
  assert.equal(t.source, "A");
  assert.equal(t.startup, true);
  assert.equal(t.path, "c:/p/a.ub");
});

test("UB: a starred file or an active file in a folder counts as a project file", async () => {
  assert.equal((await target({ star: "sub/n.ub", active: "c:/p/b.ub", open: { "c:/p/sub/n.ub": "N" } })).source, "N");
  assert.equal((await target({ star: "a.ub", active: "c:/p/sub/n.ub", open: { "c:/p/a.ub": "A" } })).source, "A");
});

test("UB: a starred file without a tab is read from the disk", async () => {
  const t = await target({ star: "a.ub", active: "c:/p/b.ub", disk: { "c:/p/a.ub": "DISK" } });
  assert.equal(t.source, "DISK");
  assert.equal(t.startup, true);
});

test("UB: an unreadable starred file is an error, not the active file", async () => {
  const t = await target({ star: "a.ub", active: "c:/p/b.ub" });
  assert.equal(t.error, "projStartupMissing:a.ub");
});

test("UB: the active editor builds with no star, on the starred file, and outside the project", async () => {
  assert.equal((await target({ star: null, active: "c:/p/b.ub" })).startup, false);
  assert.equal((await target({ star: "a.ub", active: "c:/p/a.ub" })).startup, false);
  const outside = await target({ star: "a.ub", active: "c:/other/x.ub", open: { "c:/p/a.ub": "A" } });
  assert.equal(outside.startup, false);
  assert.equal(outside.source, "editor text");
  const scratch = await target({ star: "a.ub", active: "", open: { "c:/p/a.ub": "A" } });
  assert.equal(scratch.startup, false);
});
