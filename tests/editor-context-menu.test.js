const test = require("node:test");
const assert = require("node:assert/strict");
const loadApp = require("./helpers/load-app");

const app = loadApp();
// no execCommand, as a test double: the setRangeText fallback does the edit
app.document = new Proxy(app.document, { get: (doc, key) => (key === "execCommand" ? () => false : doc[key]) });

function fakeEditor(value, start, end) {
  return {
    value, selectionStart: start, selectionEnd: end, inputs: 0,
    focus() {},
    dispatchEvent() { this.inputs++; },
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
