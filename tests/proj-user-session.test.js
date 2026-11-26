// Project session (<name>.proj.user, STUDIO-PROJECT-PLAN.md 2.3): the open tabs, their views, the active one.
const test = require("node:test");
const assert = require("node:assert/strict");
const loadApp = require("./helpers/load-app");

const app = loadApp();

test("the session holds the project's tabs with relative paths, the views and the active tab, no content", () => {
  const state = app.run(`(() => {
    ultimateBasicMode = false; expertMode = false;
    _expertProjectData = { name: "cube", files: [], _projPath: "F:/games/cube/cube.proj" };
    _ubProjectData = null;
    tabs.length = 0;
    tabs.push(
      { id: 1, editorMode: "block", filePath: "F:/games/cube/box.vas", program: [{ mnemonic: "NOP" }] },
      { id: 2, editorMode: "expert", filePath: "F:/games/cube/src/data.asm", expertText: "x: .byte 1", expertBreakpointLines: [4, 2] },
      { id: 3, editorMode: "block", filePath: null },
    );
    activeTabId = 1;
    return _projUserState();
  })()`);
  assert.equal(state.app, "va-proj-user");
  assert.equal(state.active, 0);
  assert.equal(JSON.stringify(state.tabs), JSON.stringify([
    { path: "box.vas", view: "blocks" },
    { path: "src/data.asm", view: "source", bps: [2, 4] },
  ]));
});

test("without an open project there is no session", () => {
  assert.equal(app.run(`(() => { _expertProjectData = null; _ubProjectData = null; return _projUserState(); })()`), null);
});
