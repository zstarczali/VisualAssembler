const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");

function loadTut() {
  const start = appJs.indexOf("const _TUT_LANG_SUFFIX");
  const end = appJs.indexOf("let _tutUserLessons");
  const ruleStart = appJs.indexOf("const _PALETTE_OPERAND_FLAGS");
  const ruleEnd = appJs.indexOf("const _paletteSyntaxCache");
  assert.ok(start > 0 && end > start && ruleStart > 0 && ruleEnd > ruleStart, "tutorial editor helpers not found");
  const context = {};
  vm.createContext(context);
  vm.runInContext(appJs.slice(ruleStart, ruleEnd) + appJs.slice(start, end) + `
    this.api = { text: _tutText, decoy: _tutDecoyMnemonic, snapshot: _tutBlockSnapshot, fromBlocks: _tutItemsFromBlocks,
      expand: _tutExpandItems, lesson: _tutLessonFromData, isMacro: _tutIsMacro,
      kind: _paletteOperandKind, lineArgs: _macroLineArgs, operandText: _tutOperandText, onlineState: _tutOnlineState };`, context);
  return context.api;
}

const library = {
  Rendszer: [{ mnemonic: "CLC", modes: ["implied"] }, { mnemonic: "SEI", modes: ["implied"] }],
  Adatmozgas: [{ mnemonic: "LDA", modes: ["immediate", "absolute"] }, { mnemonic: "STA", modes: ["absolute"] }],
  Egyedul: [{ mnemonic: "NOP", modes: ["implied"] }],
  Makrok: [{ mnemonic: "TEXT", modes: ["implied"], isTextMacro: true }, { mnemonic: "SET_BORDER", modes: ["implied"], isSetBorderMacro: true }],
  Szerkezet: [{ mnemonic: "LABEL", modes: ["implied"], isLabel: true }, { mnemonic: "REGION", modes: ["implied"], isRegionMacro: true }],
};
const modes = { implied: { needsOperand: false }, immediate: { needsOperand: true }, absolute: { needsOperand: true } };
const h = {
  t: (k) => k,
  tf: (k, v) => k + JSON.stringify(v),
  library,
  modes,
  line: (b) => b.line || (b.mnemonic + " " + (b.rawOperand || "")).trim(),
};
const block = (mnemonic, category, rawOperand = "", addressingMode = "implied", extra = {}) =>
  Object.assign({ id: "x" + mnemonic, category, mnemonic, rawOperand, operand: rawOperand, addressingMode, base: "hex", collapsed: true }, extra);

test("texts fall back from the current language to English, Hungarian, any, then the generated one", () => {
  const api = loadTut();
  assert.equal(api.text({ titleHu: "Cím", titleEn: "Title" }, "title", "hu"), "Cím");
  assert.equal(api.text({ titleHu: "Cím", titleEn: "Title" }, "title", "de"), "Title");
  assert.equal(api.text({ titleHu: "Cím" }, "title", "it"), "Cím");
  assert.equal(api.text({ titleNl: "Titel" }, "title", "en"), "Titel");
  assert.equal(api.text({ titleAuto: "auto" }, "title", "pl"), "auto");
  assert.equal(api.text({ titlePl: "Tytuł", titleAuto: "auto" }, "title", "pl"), "Tytuł");
  assert.equal(api.text(null, "title", "en"), "");
});

test("decoy is another mnemonic of the same category", () => {
  const api = loadTut();
  assert.equal(api.decoy(library, "Rendszer", "SEI"), "CLC");
  assert.equal(api.decoy(library, "Rendszer", "CLC"), "SEI");
  assert.equal(api.decoy(library, "Egyedul", "NOP"), null);
  assert.equal(api.decoy(library, "Nincs", "NOP"), null);
});

test("items from a program: the leading ORG sets the address, blocks lose their ids", () => {
  const api = loadTut();
  const { items, org } = api.fromBlocks([
    { id: "o", isOrgMacro: true, orgAddress: "C000", mnemonic: "ORG" },
    block("SEI", "Rendszer"),
    { id: "b", isBlankLine: true },
    block("LDA", "Adatmozgas", "00", "immediate"),
  ]);
  assert.equal(org, "C000");
  assert.deepEqual(Array.from(items, (i) => i.block.mnemonic), ["SEI", "LDA"]);
  assert.ok(items.every((i) => i.kind === "instr" && !("id" in i.block) && !("collapsed" in i.block)));
});

test("an instruction expands into pick mnemonic, type operand and add", () => {
  const api = loadTut();
  const data = { clearProgram: true, org: "0801", items: [
    { kind: "text", titleEn: "Intro", target: ".program-panel" },
    { kind: "instr", block: api.snapshot(block("LDA", "Adatmozgas", "00", "immediate")), descHu: "Saját magyarázat" },
    { kind: "instr", block: api.snapshot(block("SEI", "Rendszer")) },
    { kind: "instr", block: api.snapshot(block("NOP", "Egyedul")) },
  ] };
  const steps = api.expand(data, h);
  assert.equal(steps.length, 1 + 3 + 2 + 1);
  assert.deepEqual(JSON.parse(JSON.stringify(steps[0].prepEmpty)), { org: "0801" });
  assert.equal(steps[0].target, ".program-panel");
  assert.equal(steps[0].titleEn, "Intro");

  const [pick, type, add] = steps.slice(1, 4);
  assert.equal(pick.target, "#mnemonic-select");
  assert.equal(pick.targetValue, "LDA");
  assert.equal(pick.prepPalette.mnemonic, "STA", "a decoy is preselected");
  assert.equal(pick.prepPalette.addressingMode, "immediate");
  assert.equal(pick.descHu, "Saját magyarázat", "the author's text goes on the first sub-step");
  assert.match(pick.titleAuto, /^1\/3 — tutGenSelectTitle/);
  assert.equal(type.target, "#operand-input");
  assert.equal(type.targetValue, "00");
  assert.equal(type.advanceOnTargetInput, true);
  assert.equal(type.prepMode.addressingMode, "immediate");
  assert.equal(add.target, "#add-selected");
  assert.equal(add.trackAdded, true);
  assert.ok(!steps.some((s) => s.adjust), "plain instructions need no parameter step");
  assert.ok(!("descHu" in add));

  const [seiPick, seiAdd] = steps.slice(4, 6);
  assert.equal(seiPick.targetValue, "SEI");
  assert.equal(seiAdd.target, "#add-selected", "no operand step without an operand");
  assert.equal(seiAdd.prepMode.addressingMode, "implied");

  const nop = steps[6];
  assert.equal(nop.target, "#add-selected", "no other mnemonic in the category: preselected, only Add");
  assert.equal(nop.prepPalette.mnemonic, "NOP");
});

test("Expert line arguments of a macro", () => {
  const api = loadTut();
  assert.deepEqual(JSON.parse(JSON.stringify(api.lineArgs(".set_bg $06"))), { keyword: ".set_bg", args: "$06" });
  assert.deepEqual(JSON.parse(JSON.stringify(api.lineArgs("  .sprite_pos 0, 152, 100 "))), { keyword: ".sprite_pos", args: "0, 152, 100" });
  assert.deepEqual(JSON.parse(JSON.stringify(api.lineArgs("* = $C000"))), { keyword: "* =", args: "$C000" });
  assert.equal(api.lineArgs(".endregion"), null);
  assert.equal(api.lineArgs("LDA #$00"), null);
});

test("one operand rule for every palette item", () => {
  const api = loadTut();
  const syntax = (args) => () => (args ? { keyword: ".x", args } : null);
  assert.equal(api.kind(library.Adatmozgas[0], modes.immediate, syntax()), "field");
  assert.equal(api.kind(library.Rendszer[1], modes.implied, syntax()), null);
  assert.equal(api.kind(library.Makrok[0], modes.implied, syntax()), "field", "TEXT reads the field");
  assert.equal(api.kind(library.Szerkezet[1], modes.implied, syntax("region")), "field", "REGION reads the field");
  assert.equal(api.kind(library.Makrok[1], modes.implied, syntax("$00")), "parse", "SET_BORDER: its Expert arguments");
  assert.equal(api.kind({ mnemonic: "ENDREGION", isEndRegionMacro: true }, modes.implied, syntax()), null, "no parameters");
  assert.equal(api.kind({ mnemonic: "INCBIN", isIncBinMacro: true }, modes.absolute, syntax('"a.bin"')), null, "file macros keep the picker");
  assert.equal(api.kind(undefined, modes.implied, syntax()), null);
  assert.equal(api.isMacro(block("LDA", "Adatmozgas")), false);
  assert.equal(api.isMacro({ isSetBgMacro: true }), true);
});

test("operand text of a block: field, Expert arguments or the instruction operand", () => {
  const api = loadTut();
  const lda = block("LDA", "Adatmozgas", "00", "immediate");
  assert.equal(api.operandText(lda, library.Adatmozgas[0], "immediate", modes, "LDA #$00"), "00");
  assert.equal(api.operandText({ isLabel: true, labelName: "loop" }, library.Szerkezet[0], "implied", modes, "loop:"), "loop");
  assert.equal(api.operandText({ isRegionMacro: true, regionName: "Main" }, library.Szerkezet[1], "implied", modes, ".region Main"), "Main");
  assert.equal(api.operandText({ isSetBorderMacro: true, rawOperand: "06" }, library.Makrok[1], "implied", modes, ".set_border $06"), "$06");
  assert.equal(api.operandText({ mnemonic: "SEI" }, library.Rendszer[1], "implied", modes, "SEI"), null);
});

test("macros get an operand step and a parameter step", () => {
  const api = loadTut();
  const border = { category: "Rossz", mnemonic: "SET_BORDER", isSetBorderMacro: true, rawOperand: "06", addressingMode: "implied", line: ".set_border $06" };
  const region = { category: "Makrok", mnemonic: "REGION", isRegionMacro: true, regionName: "Main", rawOperand: "", addressingMode: "implied", line: ".region Main" };
  const text = { category: "Makrok", mnemonic: "TEXT", isTextMacro: true, rawOperand: "hi", textX: 5, addressingMode: "implied", line: '.text 5, 0, "hi"' };
  const steps = api.expand({ autoParams: true, items: [border, region, text].map((b) => ({ kind: "instr", block: b })) }, h);
  assert.deepEqual(Array.from(steps, (s) => s.target), [
    "#mnemonic-select", "#operand-input", "#add-selected", null,
    "#mnemonic-select", "#operand-input", "#add-selected", null,
    "#mnemonic-select", "#operand-input", "#add-selected", null]);
  assert.equal(steps[0].prepPalette.category, "Makrok", "the category comes from the palette library");
  assert.equal(steps[1].targetValue, "$06");
  assert.equal(steps[3].adjust.auto, true);
  assert.equal(steps[4].prepPalette.category, "Szerkezet");
  assert.equal(steps[5].targetValue, "Main");
  assert.equal(steps[9].targetValue, "hi");
  assert.equal(api.expand({ items: [{ kind: "instr", block: border }] }, h)[3].adjust.auto, false);
});

test("an instruction in a mode its mnemonic lacks uses the palette's first mode", () => {
  const api = loadTut();
  const steps = api.expand({ items: [{ kind: "instr", block: block("STA", "Adatmozgas", "D020", "zeroPage") }] }, h);
  assert.equal(steps[0].prepPalette.addressingMode, "absolute");
  assert.equal(steps[1].targetValue, "D020");
});

test("a lesson without clearing keeps the program; lesson fields are copied", () => {
  const api = loadTut();
  const data = { format: "va-tutorial", id: "user-1", difficulty: 2, clearProgram: false, titleHu: "Lecke", descEn: "About",
    items: [{ kind: "instr", block: block("SEI", "Rendszer") }] };
  const lesson = api.lesson(data, h);
  assert.equal(lesson.id, "user-1");
  assert.equal(lesson.category, "custom");
  assert.equal(api.lesson(Object.assign({}, data, { category: "basics" }), h).category, "basics");
  assert.equal(lesson.interactive, true);
  assert.equal(lesson.user, true);
  assert.equal(lesson.difficulty, 2);
  assert.equal(lesson.titleHu, "Lecke");
  assert.equal(lesson.descEn, "About");
  assert.ok(!("prepEmpty" in lesson.steps[0]));
  assert.equal(api.lesson({ id: "x", difficulty: 9, items: [] }, h).difficulty, 1);
  assert.equal(api.lesson({ id: "x", items: [] }, h).steps.length, 0);
});

test("online lessons: new, update when the site has a higher rev, otherwise installed", () => {
  const api = loadTut();
  const installed = [{ id: "a", rev: 3 }, { id: "b" }];
  assert.equal(api.onlineState({ id: "x", rev: 1 }, installed), "new");
  assert.equal(api.onlineState({ id: "a", rev: 4 }, installed), "update");
  assert.equal(api.onlineState({ id: "a", rev: 3 }, installed), "installed");
  assert.equal(api.onlineState({ id: "a" }, installed), "installed");
  assert.equal(api.onlineState({ id: "b", rev: 1 }, installed), "update");
  assert.equal(api.onlineState({ id: "c" }, undefined), "new");
});

test("the parameter step only when the palette's block differs from the code", () => {
  const api = loadTut();
  const text = (x) => ({ category: "Makrok", mnemonic: "TEXT", isTextMacro: true, rawOperand: "hi", addressingMode: "implied", line: `.text ${x}, 0, "hi"` });
  // the palette always makes TEXT at 0, 0
  const hh = Object.assign({}, h, { paletteLine: (item, mode, base, operand) => `.text 0, 0, "${operand}"`, fullLine: (b) => b.line });
  const at0 = api.expand({ items: [{ kind: "instr", block: text(0) }] }, hh);
  assert.ok(!at0.some((s) => s.adjust), "matches after typing: no parameter step");
  const at5 = api.expand({ items: [{ kind: "instr", block: text(5) }] }, hh);
  assert.equal(at5.filter((s) => s.adjust).length, 1, "the position differs: parameter step");
});
