// Opening an UltimateBasic .proj from Expert / Block mode switches to UB mode and opens its tab.
const test = require("node:test");
const assert = require("node:assert/strict");
const loadApp = require("./helpers/load-app");

const app = loadApp();

const setup = (project) => app.run(`(() => {
  globalThis.__calls = { ub: 0, opened: [] };
  ultimateBasicMode = false;
  setUltimateBasicMode = () => { __calls.ub++; ultimateBasicMode = true; };
  _ubRenderProjectFiles = () => {};
  _ubApplyLeftViews = () => {};
  _ubSetStatus = () => {};
  renderTabBar = () => {};
  _ubProjectVisible = false;
  tabs.length = 0;
  tabs.push({ id: "blank", filePath: "" });
  activeTabId = "blank";
  _ubOpenProjectFile = async (file) => {
    __calls.opened.push(file.path);
    const tab = { id: "t" + __calls.opened.length, filePath: "F:/p/" + file.path };
    tabs.push(tab);
    activeTabId = tab.id;
    return tab;
  };
  return _ubApplyOpenedProject(${JSON.stringify(project)}, "F:/p/game.proj", { dropBlank: true });
})()`);

test("a UB project is recognized by its app field", () => {
  assert.equal(app.run('_projIsUb({ app: "ultimate-basic" })'), true);
  assert.equal(app.run('_projIsUb({ assembler: "kick" })'), false);
  assert.equal(app.run("_projIsUb(null)"), false);
});

test("the startup file opens in UB mode, the blank tab goes", async () => {
  await setup({ app: "ultimate-basic", name: "Game", files: [{ type: "file", name: "main.ub", path: "main.ub" }, { type: "file", name: "lib.ub", path: "lib.ub" }], startupFile: "lib.ub" });
  const calls = app.run("__calls");
  assert.equal(calls.ub, 1);
  assert.deepEqual([...calls.opened], ["lib.ub"]);
  assert.deepEqual([...app.run("tabs.map(tab => tab.id)")], ["t1"]);
  assert.equal(app.run("_ubProjectData.name"), "Game");
  assert.equal(app.run("_ubProjectData._projPath"), "F:/p/game.proj");
  assert.equal(app.run("_ubProjectVisible"), true);
});

test("without a startup file the first .ub (also in a folder) opens", async () => {
  await setup({ app: "ultimate-basic", name: "G", files: [{ type: "file", name: "a.bin", path: "a.bin" }, { type: "folder", name: "src", path: "src", children: [{ type: "file", name: "main.ub", path: "src/main.ub" }] }] });
  assert.deepEqual([...app.run("__calls").opened], ["src/main.ub"]);
});
