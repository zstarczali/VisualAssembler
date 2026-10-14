const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");

function slice(startMarker, endMarker) {
  const start = appJs.indexOf(startMarker);
  const end = appJs.indexOf(endMarker, start);
  assert.ok(start > 0 && end > start, `section not found: ${startMarker}`);
  return appJs.slice(start, end);
}

const helpers = slice("function _vcProgramText(", "let _vcRawDiff");
const project = slice("let _vcScope = ", "function _vcSetScopeButtons(");
const normalize = slice("function _normalizeProjectSnapshotEntries(", "async function _readProjectSnapshotEntries(");

function loadHelpers(extra = {}) {
  const context = {
    _blockToExpertLine: (block) => String(block?.text || ""),
    parseExpertText: () => [],
    t: (key) => key,
    tf: (key, values) => key + JSON.stringify(values),
    ...extra,
  };
  vm.createContext(context);
  vm.runInContext(helpers, context);
  return context;
}

// Projekt-szintű rész: memóriabeli fájlrendszer + fülek
function loadProject({ disk, tabs, projPath, files, activeTabId = null, bins = null }) {
  const store = new Map(Object.entries(disk));
  const binStore = new Map(Object.entries(bins || {}));
  const context = loadHelpers({
    tabs, activeTabId,
    ultimateBasicMode: false, expertMode: false, expertEditor: null, ubEditor: null, _ubDirty: false,
    _expertProjectData: { name: "demo", files, _projPath: projPath },
    _ubProjectData: null,
    _normFilePath: (p) => (p || "").replace(/\\/g, "/").toLowerCase(),
    _vcIsUbTab: (tab) => tab?.editorMode === "ub",
    _vcUbFilePath: (tab) => tab?.ubFilePath || "",
    _getActiveTab: () => tabs.find(tab => tab.id === context.activeTabId) || null,
    _getCurrentProjectSnapshotPayload: (tab) => ({ expertText: tab.expertText || "", program: [] }),
    _PROJECT_SNAPSHOT_MAX_ENTRIES: 100,
    _PROJECT_SNAPSHOT_MAX_AUTO: 20,
    _PROJECT_SNAPSHOT_HISTORY_CACHE: new Map(),
    _vcHash: async (_payload, createdAt) => createdAt.replace(/\D/g, "").slice(-7),
    btoa, atob,
    crypto: { randomUUID: () => Math.random().toString(16).slice(2) },
    window: {
      electronAPI: {
        readTextFile: async (p) => (store.has(p) ? { ok: true, content: store.get(p) } : { ok: false, error: "not found" }),
        saveTextFile: async (p, content) => { store.set(p, content); return { ok: true }; },
        ...(bins ? {
          readBinFile: async (p) => (binStore.has(p) ? { ok: true, bytes: binStore.get(p) } : { ok: false, error: "not found" }),
          writeBinFile: async (p, bytes) => { binStore.set(p, bytes); return { ok: true }; },
        } : {}),
      },
    },
  });
  vm.runInContext(normalize + project, context);
  return { context, store, binStore };
}

test("project helpers: paths, includes, flatten", () => {
  const c = loadHelpers();
  assert.equal(c._vcJoinPath("F:/proj", "src/../inc/a.inc"), "F:/proj/inc/a.inc");
  assert.equal(c._vcJoinPath("/home/u/proj", "./b.asm"), "/home/u/proj/b.asm");
  assert.equal(c._vcJoinPath("F:/proj", "C:\\other\\x.asm"), "C:/other/x.asm");
  assert.equal(c._vcRelPath("F:\\Proj", "f:/proj/sub/a.asm"), "sub/a.asm");
  assert.equal(c._vcRelPath("F:/proj", "G:/x/a.asm"), "G:/x/a.asm");
  assert.deepEqual([...c._vcIncludeRefs('  .include "macros.inc"\ninclude "lib.ub"\n#import "k.asm"\n; .include "no.inc"\n{"includeFile": "blk.json"}')],
    ["macros.inc", "lib.ub", "k.asm", "blk.json"]);
  assert.deepEqual([...c._vcFlattenProjFiles([{ type: "file", path: "main.asm" }, { type: "folder", children: [{ type: "file", path: "gfx/a.inc" }] }])],
    ["main.asm", "gfx/a.inc"]);
});

test("project changes and per-file diff", () => {
  const c = loadHelpers();
  const before = { "main.asm": "lda #1\nsta $d020\nrts", "old.inc": "x = 1" };
  const after = { "main.asm": "lda #2\nsta $d020\nrts", "new.inc": "y = 2" };
  assert.deepEqual(JSON.parse(JSON.stringify(c._vcProjectChanges(before, after))), [
    { path: "main.asm", status: "M" },
    { path: "new.inc", status: "A" },
    { path: "old.inc", status: "D" },
  ]);
  const diff = c._vcProjectDiff(before, after);
  assert.match(diff, /^diff main\.asm\n--- a\/main\.asm\n\+\+\+ b\/main\.asm\n-lda #1\n\+lda #2/);
  assert.match(diff, /diff new\.inc\nnew file\n--- \/dev\/null\n\+\+\+ b\/new\.inc\n\+y = 2/);
  assert.match(diff, /diff old\.inc\ndeleted file\n--- a\/old\.inc\n\+\+\+ \/dev\/null\n-x = 1/);
  assert.equal(c._vcProjectDiff(before, before), "");
  assert.ok(c._vcSamePayload({ kind: "project", files: { b: "1", a: "2" } }, { kind: "project", project: "x", files: { a: "2", b: "1" } }));
  assert.ok(!c._vcSamePayload({ kind: "project", files: { a: "2" } }, { kind: "project", files: { a: "3" } }));
});

test("git log with --name-status is parsed per commit", () => {
  const c = loadHelpers();
  const out = "\x1eabc1234\x1fZs\x1f2026-10-14 10:00:00 +0200\x1fsecond\x1fHEAD -> main\n\nM\tsrc/main.asm\nA\tsrc/new.inc\nR100\told.inc\trenamed.inc\n"
    + "\x1edef5678\x1fZs\x1f2026-10-13 09:00:00 +0200\x1ffirst\x1f\n\nA\tsrc/main.asm";
  const rows = JSON.parse(JSON.stringify(c._vcParseGitLog(out)));
  assert.equal(rows.length, 2);
  assert.equal(rows[0].hash, "abc1234");
  assert.equal(rows[0].subject, "second");
  assert.deepEqual(rows[0].files, [
    { status: "M", path: "src/main.asm" },
    { status: "A", path: "src/new.inc" },
    { status: "R", path: "renamed.inc" },
  ]);
  assert.deepEqual(rows[1].files, [{ status: "A", path: "src/main.asm" }]);
  // fájlonkénti napló (name-status nélkül) is ugyanezzel a parserrel megy
  assert.equal(c._vcParseGitLog("\x1eaaa\x1fA\x1fd\x1fs\x1f\n\x1ebbb\x1fB\x1fd\x1ft\x1f").length, 2);
});

test("project snapshot collects members, includes and dirty tabs; entries record changed files", async () => {
  const disk = {
    "F:/proj/main.asm": '.include "lib/macros.inc"\nlda #1\n',
    "F:/proj/lib/macros.inc": '.include "../data.inc"\n.macro m\n.endm\n',
    "F:/proj/data.inc": "val = 1\n",
    "F:/proj/sprite.bin": "binary",
  };
  const tabs = [
    { id: "t1", filePath: "F:/proj/main.asm", expertText: '.include "lib/macros.inc"\nlda #1\n', dirty: false },
  ];
  const { context, store } = loadProject({
    disk, tabs, activeTabId: "t1", projPath: "F:/proj/demo.proj",
    files: [{ type: "file", name: "main.asm", path: "main.asm" }, { type: "file", name: "sprite.bin", path: "sprite.bin" }],
  });
  const ctx = context._vcProjectContext(tabs[0]);
  assert.equal(ctx.name, "demo");
  assert.equal(ctx.storePath, "F:/proj/demo.proj.history.json");

  const payload = await context._vcProjectPayload(ctx);
  assert.equal(payload.kind, "project");
  assert.deepEqual([...Object.keys(payload.files)], ["data.inc", "lib/macros.inc", "main.asm"]);

  const first = await context._vcAddEntry(tabs[0], "manual", "init");
  assert.deepEqual([...first.changed.map(c => c.status + " " + c.path)], ["A data.inc", "A lib/macros.inc", "A main.asm"]);
  assert.equal(await context._vcAddEntry(tabs[0], "manual", "again"), null, "unchanged project is not committed twice");

  // mentetlen fül tartalma számít, a lemezen lévő include változása is
  tabs[0].dirty = true;
  tabs[0].expertText = '.include "lib/macros.inc"\nlda #2\n';
  store.set("F:/proj/data.inc", "val = 2\n");
  await context._vcProjectAutosave(tabs[0]);
  const second = await context._vcAddEntry(tabs[0], "manual", "change");
  assert.deepEqual([...second.changed.map(c => c.status + " " + c.path)], ["M data.inc", "M main.asm"]);

  const saved = JSON.parse(store.get("F:/proj/demo.proj.history.json"));
  assert.deepEqual(saved.map(e => e.kind), ["manual", "auto", "manual"]);
  assert.equal(saved[1].changed.length, 2);
  assert.match(context._vcProjectDiff(saved[2].payload.files, saved[0].payload.files), /-lda #1\n\+lda #2/);

  // a fájl-hatókör kapcsolóval a régi, fülenkénti tár marad érvényben
  vm.runInContext("_vcScope = \"file\"", context);
  assert.equal(context._vcProjectScope(tabs[0]), null);
  vm.runInContext("_vcScope = \"\"", context);
  assert.ok(context._vcProjectScope(tabs[0]));
});

test("tab outside the project folder keeps the per-file mode", () => {
  const tabs = [{ id: "t1", filePath: "G:/elsewhere/test.asm", expertText: "", dirty: false }];
  const { context } = loadProject({ disk: {}, tabs, activeTabId: "t1", projPath: "F:/proj/demo.proj", files: [{ type: "file", path: "main.asm" }] });
  assert.equal(context._vcProjectContext(tabs[0]), null);
});

test("binary project files (fonts, .koa) are committed, diffed by size and restored to disk", async () => {
  const font = Array.from({ length: 2048 }, (_, i) => i & 255);
  const koa = Array.from({ length: 10003 }, (_, i) => (i * 7) & 255);
  const tabs = [{ id: "t1", filePath: "F:/proj/main.asm", expertText: "rts\n", dirty: false }];
  const { context, binStore } = loadProject({
    disk: { "F:/proj/main.asm": "rts\n" }, tabs, activeTabId: "t1", projPath: "F:/proj/demo.proj",
    bins: { "F:/proj/fonts/font01.bin": font, "F:/proj/tetris.koa": koa },
    files: [
      { type: "file", path: "main.asm" },
      { type: "folder", path: "fonts", children: [{ type: "file", path: "fonts/font01.bin" }] },
      { type: "file", path: "tetris.koa" },
    ],
  });
  const first = await context._vcAddEntry(tabs[0], "manual", "init");
  assert.deepEqual([...first.changed.map(c => c.status + " " + c.path)], ["A fonts/font01.bin", "A main.asm", "A tetris.koa"]);
  assert.ok(context._vcIsBin(first.payload.files["tetris.koa"]));
  assert.deepEqual([...context._vcBinDecode(first.payload.files["fonts/font01.bin"])], font);
  assert.equal(context._vcBinSize(first.payload.files["tetris.koa"]), 10003);

  binStore.set("F:/proj/fonts/font01.bin", font.map(b => b ^ 0xff));
  const second = await context._vcAddEntry(tabs[0], "manual", "font");
  assert.deepEqual([...second.changed.map(c => c.status + " " + c.path)], ["M fonts/font01.bin"]);
  assert.equal(context._vcProjectDiff(first.payload.files, second.payload.files),
    "diff fonts/font01.bin\nBinary file: 2048 bytes -> 2048 bytes");

  // checkout: a bináris fájl a lemezre kerül vissza
  context._showConfirm = async () => true;
  context._vcSetOutput = () => {};
  context._expertRenderProjectTree = () => {};
  context.markTabDirty = () => {};
  const ctx = context._vcProjectContext(tabs[0]);
  assert.ok(await context._vcProjectApply(ctx, first.payload.files, "init"));
  assert.deepEqual([...binStore.get("F:/proj/fonts/font01.bin")], font);
});
