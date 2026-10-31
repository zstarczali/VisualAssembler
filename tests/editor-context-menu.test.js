const test = require("node:test");
const assert = require("node:assert/strict");
const loadApp = require("./helpers/load-app");

const app = loadApp();
// no execCommand, as a test double: the setRangeText fallback does the edit
app.document = new Proxy(app.document, { get: (doc, key) => (key === "execCommand" ? () => false : doc[key]) });
app.InputEvent = class { constructor(type, options) { this.type = type; Object.assign(this, options); } };

function fakeEditor(value, start, end) {
  return {
    value, selectionStart: start, selectionEnd: end, inputs: 0, events: [],
    focus() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent(e) { this.events.push(e.type + ":" + e.inputType); if (e.type === "input") this.inputs++; },
    setRangeText(text, a, b) { this.value = this.value.slice(0, a) + text + this.value.slice(b); },
    setSelectionRange(a, b) { this.selectionStart = a; this.selectionEnd = b; },
  };
}
const items = (ed, hide = () => {}) => {
  app.__ed = ed;
  app.__hide = hide;
  return app.run("_editorCtxItems(__ed, __hide)");
};
const item = (list, key) => list.find((i) => i.label === app.run(`t(${JSON.stringify(key)})`));

test("UPPERCASE and lowercase change only the selection and keep it selected", () => {
  const ed = fakeEditor("lda #$ff ; Comment", 0, 8);
  let hidden = 0;
  item(items(ed, () => hidden++), "edCtxUpper").run();
  assert.equal(ed.value, "LDA #$FF ; Comment");
  assert.deepEqual([ed.selectionStart, ed.selectionEnd], [0, 8]);
  assert.equal(ed.inputs, 1);
  assert.equal(hidden, 1, "the completion list stays closed");

  ed.setSelectionRange(11, 18);
  item(items(ed), "edCtxLower").run();
  assert.equal(ed.value, "LDA #$FF ; comment");
  assert.deepEqual([ed.selectionStart, ed.selectionEnd], [11, 18]);
});

test("Paste reads the backend clipboard, without the WebView permission prompt, and normalizes line ends", async () => {
  const ed = fakeEditor("aaa\nbbb", 3, 3);
  app.window.electronAPI = Object.assign(app.window.electronAPI || {}, { readClipboardText: async () => "X\r\nY\rZ" });
  app.navigator.clipboard = { readText: () => { throw new Error("the WebView clipboard asks for a permission"); } };
  item(items(ed), "sidContextPaste").run();
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(ed.value, "aaaX\nY\nZ\nbbb");
  assert.deepEqual([ed.selectionStart, ed.selectionEnd], [8, 8], "the caret is after the pasted text");
  assert.deepEqual(ed.events, ["beforeinput:insertFromPaste", "input:insertFromPaste"], "one edit, as with Ctrl+V");
});

test("without a selection only Paste and Select all are enabled", () => {
  const list = items(fakeEditor("lda", 1, 1));
  for (const key of ["edCtxUpper", "edCtxLower", "sidContextCut", "sidContextCopy"]) assert.equal(item(list, key).disabled, true, key);
  for (const key of ["sidContextPaste", "edCtxSelectAll"]) assert.ok(!item(list, key).disabled, key);
});

test("the labels exist in all seven languages", () => {
  const missing = app.run(`["hu","en","es","de","nl","pl","it"].flatMap((lang) =>
    ["edCtxSelectAll","edCtxUpper","edCtxLower","edCtxPasteFailed"].filter((k) => !translations[lang][k]).map((k) => lang + ":" + k))`);
  assert.deepEqual(Array.from(missing), []);
});
