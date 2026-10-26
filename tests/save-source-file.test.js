// Save (Ctrl+S, Menu → Save, the commit before a git commit) on a source-file tab writes text, never
// the VA JSON payload: a .asm saved as {"expertText": …} only the app could read back.
const test = require("node:test");
const assert = require("node:assert/strict");
const loadApp = require("./helpers/load-app");

function appWith(filePath, expert) {
  const app = loadApp();
  const calls = { asm: [], project: [] };
  app.electronAPI = {
    saveAsmFile: async (path, content) => { calls.asm.push({ path, content }); return { ok: true, filePath: path || "C:/new.asm" }; },
    saveProject: async (payload) => { calls.project.push(payload); return { ok: true, filePath: payload._filePath || "C:/new.json" }; }
  };
  app.__src = "* = $1000\n    lda #$01\n    rts\n";
  app.__path = filePath;
  app.run(`(() => {
    tabs = [{ id: "t1", name: "x", filePath: __path, dirty: true }];
    activeTabId = "t1";
    program = parseExpertText(__src);
    _expertSourceText = __src;
    _expertGetSourceText = () => __src;
    _expertSyncSourceTextFromEditor = () => {};
    _getProjectSnapshotStoragePath = async () => null;
    expertMode = ${expert};
  })()`);
  return { app, calls };
}

test("an .asm tab saves its Expert text", async () => {
  const { app, calls } = appWith("C:/game/main.asm", true);
  await app.run("saveProjectToFile()");
  assert.equal(calls.project.length, 0);
  assert.deepEqual(calls.asm.map(c => c.path), ["C:/game/main.asm"]);
  assert.equal(calls.asm[0].content, "* = $1000\n    lda #$01\n    rts\n");
});

test("an .asm tab in block mode saves the blocks as Expert lines", async () => {
  const { app, calls } = appWith("C:/game/hero.inc", false);
  await app.run("saveProjectToFile()");
  assert.equal(calls.project.length, 0);
  assert.equal(calls.asm[0].path, "C:/game/hero.inc");
  assert.doesNotMatch(calls.asm[0].content, /expertText|"program"/);
  assert.match(calls.asm[0].content, /LDA #\$01/i);
});

test("a .json tab still saves the project payload", async () => {
  const { app, calls } = appWith("C:/game/demo.json", false);
  await app.run("saveProjectToFile()");
  assert.equal(calls.asm.length, 0);
  assert.equal(calls.project.length, 1);
  assert.equal(calls.project[0]._filePath, "C:/game/demo.json");
});
