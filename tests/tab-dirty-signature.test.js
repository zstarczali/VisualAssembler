// Unsaved state by comparison (STUDIO-PROJECT-PLAN.md 2.5): the saved signature decides, not the edit events.
const test = require("node:test");
const assert = require("node:assert/strict");
const loadApp = require("./helpers/load-app");

const app = loadApp();

const setup = (text) => app.run(`(() => {
  ultimateBasicMode = false;
  renderTabBar = () => {};
  tabs.length = 0;
  const tab = { id: "u1", editorMode: "ub", filePath: "F:/p/a.ub", ubFilePath: "F:/p/a.ub", ubText: ${JSON.stringify(text)}, dirty: false };
  tabs.push(tab, { id: "other", editorMode: "block", program: [] });
  activeTabId = "other";
  _tabMarkSaved(tab);
  return tab.savedSig;
})()`);

test("the signature ignores line-end and trailing-space differences only", () => {
  const sig = setup("print 1\nprint 2\n");
  assert.equal(app.run(`_tabSig({ id: "x", editorMode: "ub", ubText: "print 1  \\r\\nprint 2\\n\\n" })`), sig);
  assert.notEqual(app.run(`_tabSig({ id: "x", editorMode: "ub", ubText: "print 1\\nprint 3\\n" })`), sig);
});

test("an edit and its undo: unsaved, then clean again", () => {
  setup("print 1\n");
  assert.equal(app.run(`(() => { const t = tabs[0]; t.ubText = "print 2\\n"; _tabDirtyCheck("u1"); return t.dirty; })()`), true);
  assert.equal(app.run(`(() => { const t = tabs[0]; t.ubText = "print 1\\n"; _tabDirtyCheck("u1"); return t.dirty; })()`), false);
});

test("closing asks only when the content differs from the saved one", () => {
  setup("print 1\n");
  assert.equal(app.run(`_tabNeedsSaveAsk(tabs[0])`), false);
  assert.equal(app.run(`(() => { tabs[0].dirty = true; return _tabNeedsSaveAsk(tabs[0]); })()`), false, "a stale flag alone does not ask");
  assert.equal(app.run(`(() => { tabs[0].ubText = "changed"; return _tabNeedsSaveAsk(tabs[0]); })()`), true);
});
