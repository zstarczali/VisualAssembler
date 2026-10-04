const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");

function loadBookmarks(filePath = "") {
  const start = appJs.indexOf("function _bmPath(");
  const end = appJs.indexOf("function _bmHandleKey(", start);
  assert.ok(start > 0 && end > start, "bookmark helpers not found");
  const store = new Map();
  const tab = { filePath };
  const editor = { value: "", selectionStart: 0 };
  const context = {
    tab, editor,
    _getActiveTab: () => tab,
    _ubFilePath: "",
    ubEditor: editor,
    expertEditor: editor,
    _expertGetSourceText: () => editor.value,
    _expertDisplayPosToSourcePos: (pos) => pos,
    _ubRefreshEditor: () => {}, _expertUpdateLineNumbers: () => {},
    _ubGotoLine: (line) => { context.jumped = line; }, _expertGotoSourceLine: (line) => { context.jumped = line; },
    localStorage: { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) },
  };
  vm.createContext(context);
  vm.runInContext(appJs.slice(start, end), context);
  const edit = (text) => { editor.value = text; context._bmTrackEdit("expert"); };
  return { context, store, edit, lines: () => [...context._bmLines("expert")] };
}

const doc = (n) => Array.from({ length: n }, (_, i) => `line${i}`).join("\n");

test("bookmarks follow inserted and deleted lines", () => {
  const { context, edit, lines } = loadBookmarks();
  edit(doc(10));
  context._bmSet("expert", [2, 5, 8]);
  const rows = doc(10).split("\n");
  edit(["new", ...rows].join("\n"));                    // insert above everything
  assert.deepEqual(lines(), [3, 6, 9]);
  edit(rows.join("\n"));                                // and remove it again
  assert.deepEqual(lines(), [2, 5, 8]);
  edit([...rows.slice(0, 4), "x", "y", ...rows.slice(4)].join("\n")); // two lines between 2 and 5
  assert.deepEqual(lines(), [2, 7, 10]);
});

test("typing on a bookmarked line keeps it, splitting a line keeps the top half", () => {
  const { context, edit, lines } = loadBookmarks();
  const rows = doc(6).split("\n");
  edit(rows.join("\n"));
  context._bmSet("expert", [3]);
  rows[3] = "line3 changed";
  edit(rows.join("\n"));
  assert.deepEqual(lines(), [3]);
  edit([...rows.slice(0, 3), "line3", " changed", ...rows.slice(4)].join("\n"));
  assert.deepEqual(lines(), [3]);
  edit(rows.join("\n"));
  edit([...rows.slice(0, 3), "", ...rows.slice(3)].join("\n")); // blank line pushed above it
  assert.deepEqual(lines(), [4]);
});

test("deleting a block clamps bookmarks inside it", () => {
  const { context, edit, lines } = loadBookmarks();
  const rows = doc(10).split("\n");
  edit(rows.join("\n"));
  context._bmSet("expert", [1, 4, 5, 9]);
  edit([...rows.slice(0, 3), ...rows.slice(7)].join("\n")); // lines 3..6 removed
  assert.deepEqual(lines(), [1, 3, 5]);
});

test("next / previous wrap around and bookmarks persist per file", () => {
  const { context, store, edit } = loadBookmarks("C:/src/game.asm");
  edit(doc(10));
  context._bmSet("expert", [2, 7]);
  assert.deepEqual(JSON.parse(store.get("c64va-bookmarks"))["C:/src/game.asm"], [2, 7]);
  context.editor.selectionStart = context.editor.value.indexOf("line8");
  context._bmJump("expert", 1);
  assert.equal(context.jumped, 2);
  context.editor.selectionStart = 0;
  context._bmJump("expert", -1);
  assert.equal(context.jumped, 7);

  const again = loadBookmarks("C:/src/game.asm");
  again.store.set("c64va-bookmarks", store.get("c64va-bookmarks"));
  assert.deepEqual(again.lines(), [2, 7]);
});
