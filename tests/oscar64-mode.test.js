// Oscar64 C mode (www/oscar64.js): highlighter, .dbj source map, cycle map, .map sections, listing.
// The real-build case runs only with the bundled compiler (node scripts/build-tools.mjs --only oscar64).
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const vm = require("node:vm");
const { execFileSync } = require("node:child_process");

const www = path.join(__dirname, "..", "www");
const appJs = fs.readFileSync(path.join(www, "app.js"), "utf8").replace(/\r\n/g, "\n");
const oscJs = fs.readFileSync(path.join(www, "oscar64.js"), "utf8");

function load() {
  const opStart = appJs.indexOf("const opcodeMap = {");
  const opEnd = appJs.indexOf("\n};\n", opStart) + 4;
  const revStart = appJs.indexOf("const _REV_OP = (");
  const revEnd = appJs.indexOf("function _disasmBytes(");
  assert.ok(opStart > 0 && revStart > 0 && revEnd > revStart, "cycle helpers not found");
  const context = {
    document: { readyState: "loading", addEventListener() {}, getElementById: () => null, body: { classList: { toggle() {} } } },
    localStorage: { getItem: () => null, setItem() {} },
    window: {},
    t: (k) => k,
    tf: (k) => k,
  };
  vm.createContext(context);
  vm.runInContext(appJs.slice(opStart, opEnd) + appJs.slice(revStart, revEnd) + "\n" + oscJs
    + "\nthis.o = { hl: _oscHighlight, line: _oscHighlightLine, dbj: _oscParseDbj, cycles: _oscCycleMap, map: _oscParseMap, listing: _oscListingHtml };", context);
  return context.o;
}

const plain = (v) => JSON.parse(JSON.stringify(v));
const text = (html) => html.replace(/<[^>]+>/g, "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

test("highlighter keeps the text and marks C tokens", () => {
  const { hl } = load();
  const src = '#include <stdio.h>\nint main(void) { /* a\n b */ char c = \'x\'; return 0x10; } // end';
  const lines = hl(src);
  assert.equal(lines.map(text).join("\n"), src);
  assert.match(lines[0], /osc-pp/);
  assert.match(lines[0], /osc-string">&lt;stdio.h&gt;/);
  assert.match(lines[1], /osc-type">int/);
  assert.match(lines[1], /osc-fn">main/);
  assert.match(lines[2], /^<span class="osc-comment"> b \*\/<\/span>/);
  assert.match(lines[2], /osc-kw">return/);
  assert.match(lines[2], /osc-number">0x10/);
});

test("mnemonics are marked only inside __asm { }", () => {
  const { hl } = load();
  const lines = hl("int lda;\n__asm {\n  lda #$01 ; load\n  sta $d020\n}\nint x = lda;");
  assert.doesNotMatch(lines[0], /osc-mnem/);
  assert.match(lines[2], /osc-mnem">lda/);
  assert.match(lines[2], /osc-number">\$01/);
  assert.match(lines[2], /osc-comment">; load/);
  assert.match(lines[3], /osc-mnem">sta/);
  assert.doesNotMatch(lines[5], /osc-mnem/);
});

test(".dbj lines become inclusive source map entries", () => {
  const { dbj } = load();
  const { entries, symbols } = dbj(JSON.stringify({
    functions: [{ name: "main", start: 0x0880, source: "a.c", lines: [{ start: 0x0880, end: 0x0885, source: "a.c", line: 4 }, { start: 0x0885, end: 0x0885, line: 5 }] }],
    variables: [{ name: "counter", start: 0x18f3 }],
  }));
  assert.equal(entries.length, 1);
  assert.equal(entries[0].start, 0x0880);
  assert.equal(entries[0].end, 0x0884);
  assert.equal(entries[0].file, "a.c");
  assert.deepEqual(plain(symbols.map((s) => s.name)), ["main", "counter"]);
  assert.deepEqual(plain(dbj("not json")), { entries: [], symbols: [] });
});

test("cycle map adds the instructions of a C line", () => {
  const { cycles } = load();
  // $1000: LDA #$01 (2) ; STA $D020 (4) ; RTS (6)
  const prg = Uint8Array.from([0x00, 0x10, 0xA9, 0x01, 0x8D, 0x20, 0xD0, 0x60]);
  const entries = [{ start: 0x1000, end: 0x1004, file: "F:/p/a.c", line: 3 }, { start: 0x1005, end: 0x1005, file: "F:/p/a.c", line: 4 }];
  const map = cycles(prg, entries, "F:\\p\\a.c");
  assert.equal(map.get(2).min, 6);
  assert.equal(map.get(3).max, 6);
  assert.equal(cycles(prg, entries, "other.c").size, 0);
});

test(".map sections", () => {
  const { map } = load();
  const out = map("sections\n0880 - 18f2 : DATA, code\n1920 - 9000 : HEAP, heap\n\nregions\n0801 - 0880 : 0853, 0052, startup\n");
  assert.deepEqual(plain(out.map((s) => [s.start, s.end, s.kind, s.name])), [[0x0880, 0x18f2, "DATA", "code"], [0x1920, 0x9000, "HEAP", "heap"]]);
});

test("listing marks addresses, mnemonics and source lines", () => {
  const { listing } = load();
  const html = listing(';   9, "F:/p/main.c"\n0880 : ad f3 18 LDA $18f3 ; (counter + 0)\nmain:');
  assert.match(html, /osc-l-src" data-file="F:\/p\/main.c" data-line="9">; main.c:9/);
  assert.match(html, /dsm-addr">\$0880/);
  assert.match(html, /asm-tok-mnemonic">LDA/);
  assert.match(html, /asm-tok-label">main:/);
});

const oscar = path.join(__dirname, "..", "tools", "oscar64", "bin", process.platform === "win32" ? "oscar64.exe" : "oscar64");
test("a real Oscar64 build maps back to its C lines", { skip: !fs.existsSync(oscar) && "no bundled oscar64" }, () => {
  const { dbj, cycles } = load();
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "va-osc-"));
  const src = path.join(dir, "main.c");
  fs.mkdirSync(path.join(dir, "out")); // oscar64 writes nothing into a missing folder
  fs.writeFileSync(src, "#include <c64/vic.h>\n\nint main(void)\n{\n    vic.color_border = 0;\n    return 0;\n}\n");
  execFileSync(oscar, ["-n", "-O2", "-g", `-o=${path.join(dir, "out", "main.prg")}`, src], { cwd: dir, stdio: "pipe" });
  const prg = new Uint8Array(fs.readFileSync(path.join(dir, "out", "main.prg")));
  assert.deepEqual([prg[0], prg[1]], [0x01, 0x08]);
  const { entries } = dbj(fs.readFileSync(path.join(dir, "out", "main.dbj"), "utf8"));
  const line5 = cycles(prg, entries, src).get(4);
  assert.ok(line5 && line5.min >= 4, "vic.color_border = 0 has cycles");
  fs.rmSync(dir, { recursive: true, force: true });
});

test("build scripts become targets (sh, bat, makefile, nested)", () => {
  const ctx = loadScriptParser();
  const sh = ctx.parse("#!/bin/sh\n../../bin/oscar64 mbtext.c -n\n../../bin/oscar64 mbfixed.c -n -O3\n", "build.sh");
  assert.deepEqual(plain(sh.targets), [{ dir: ".", source: "mbtext.c", args: ["-n"] }, { dir: ".", source: "mbfixed.c", args: ["-n", "-O3"] }]);
  const bat = ctx.parse("call ..\\..\\bin\\oscar64 tsr.c -n -dNOFLOAT\r\ncd games\r\ncall make.bat\r\ncd ..\r\n", "make.bat");
  assert.deepEqual(plain(bat.targets), [{ dir: ".", source: "tsr.c", args: ["-n", "-dNOFLOAT"] }]);
  assert.deepEqual(plain(bat.calls), [{ dir: "games", script: "make.bat" }]);
  const root = ctx.parse("( cd fractals ; ./build.sh )\n( cd games ; ./build.sh )\n", "build.sh");
  assert.deepEqual(plain(root.calls), [{ dir: "fractals", script: "./build.sh" }, { dir: "games", script: "./build.sh" }]);
  const mk = ctx.parse("%.prg: %.c\n\t@$(OSCAR64_CC) $(OSCAR64_CFLAGS) $<\n\nall: a.prg a.prg b.prg\n\nb.prg: b.c\n\t@$(OSCAR64_CC) $(OSCAR64_CFLAGS) -O3 $<\n", "makefile");
  assert.deepEqual(plain(mk.targets), [{ dir: ".", source: "a.c", args: [] }, { dir: ".", source: "b.c", args: ["-O3"] }]);
  const o = ctx.options({ args: ["-n", "-O3", "-dNOLONG", "-tf=crt", "-i=inc", "-psci"] }, "F:/p");
  assert.deepEqual(plain(o), { optimize: "O3", native: true, defines: ["NOLONG"], includeDirs: ["F:/p/inc"], extra: ["-psci"], skipped: ["-tf=crt"] });
  assert.equal(ctx.options({ args: [] }).optimize, null);
  assert.equal(ctx.resolve("F:/a/b", "../c/./d.c"), "F:/a/c/d.c");
});

const samples = path.join(__dirname, "..", "..", "oscar64", "samples");
test("the Oscar64 sample scripts parse", { skip: !fs.existsSync(path.join(samples, "fractals", "build.sh")) && "no oscar64 checkout next to the repo" }, () => {
  const ctx = loadScriptParser();
  for (const dir of fs.readdirSync(samples)) {
    const file = path.join(samples, dir, "build.sh");
    if (!fs.existsSync(file)) continue;
    const { targets } = ctx.parse(fs.readFileSync(file, "utf8"), "build.sh");
    for (const tg of targets) assert.ok(fs.existsSync(path.join(samples, dir, tg.source)), `${dir}/${tg.source}`);
  }
  const fractals = ctx.parse(fs.readFileSync(path.join(samples, "fractals", "build.sh"), "utf8"), "build.sh");
  assert.equal(fractals.targets.length, 6);
});

function loadScriptParser() {
  const context = {
    document: { readyState: "loading", addEventListener() {}, getElementById: () => null },
    localStorage: { getItem: () => null, setItem() {} },
    window: {}, t: (k) => k, tf: (k) => k,
  };
  vm.createContext(context);
  vm.runInContext(oscJs + "\nthis.c = { parse: _oscParseBuildScript, options: _oscTargetOptions, resolve: _oscResolve };", context);
  return context.c;
}

test("symbols of a C file: functions, types, macros", () => {
  const context = { document: { readyState: "loading", addEventListener() {} }, localStorage: { getItem: () => null }, window: {}, t: (k) => k, tf: (k) => k };
  vm.createContext(context);
  vm.runInContext(oscJs + "\nthis.c = { sym: _oscSymbols, main: _oscHasMain };", context);
  const src = [
    "#define SPEED 4",
    "struct Ball { int x; };",
    "typedef struct {",
    "  char y;",
    "} Paddle;",
    "static void draw(char x, char y);",
    "static void draw(char x, char y)",
    "{",
    "  if (x) { for (;;) {} }",
    "}",
    "int main(void) {",
    "  /* void fake(void) { */",
    "  return 0;",
    "}",
  ].join("\n");
  const s = JSON.parse(JSON.stringify(context.c.sym(src)));
  assert.deepEqual(s.functions, [{ name: "draw", line: 6 }, { name: "main", line: 10 }]);
  assert.deepEqual(s.types.map((x) => x.name), ["Ball", "Paddle"]);
  assert.deepEqual(s.macros, [{ name: "SPEED", line: 0 }]);
  assert.equal(context.c.main(src), true);
  assert.equal(context.c.main("int helper(void) { return 1; }\n// int main(void)\n"), false);
});

test("a file belongs to the deepest open project folder", () => {
  const context = { document: { readyState: "loading", addEventListener() {} }, localStorage: { getItem: () => null }, window: {}, t: (k) => k, tf: (k) => k };
  vm.createContext(context);
  vm.runInContext(oscJs + "\nthis.c = { osc: _osc, of: _oscProjectOf };", context);
  const { osc, of } = context.c;
  osc.projects.set("f:/a", { root: "F:\\a" });
  osc.projects.set("f:/a/games", { root: "F:\\a\\games" });
  osc.projects.set("f:/b", { root: "F:/b" });
  assert.equal(of("F:\\a\\games\\snake.c").root, "F:\\a\\games");
  assert.equal(of("F:/a/fractals/mbtext.c").root, "F:\\a");
  assert.equal(of("F:/b/main.c").root, "F:/b");
  assert.equal(of("F:/bb/main.c"), null);
  assert.equal(of(""), null);
});

test("completion: declarations of a header and the context at the caret", () => {
  const context = { document: { readyState: "loading", addEventListener() {} }, localStorage: { getItem: () => null }, window: {}, t: (k) => k, tf: (k) => k };
  vm.createContext(context);
  vm.runInContext(oscJs + "\nthis.c = { decl: _oscDeclarations, ctx: _oscAcContext };", context);
  const h = [
    "#ifndef C64_JOY_H",
    "#define C64_JOY_H",
    "#define JOY_MAX 2",
    "#define JOY_BIT(n) (1 << (n))",
    "extern sbyte joyx[2], joyy[2];",
    "enum JoyDir { JD_UP, JD_DOWN = 4, JD_LEFT };",
    "typedef struct { char x; } JoyState;",
    "void joy_poll(char n);",
    "inline int joy_get(char n) { int k = n; return k; }",
    "#endif",
  ].join("\n");
  const d = JSON.parse(JSON.stringify(context.c.decl(h)));
  const by = Object.fromEntries(d.map((x) => [x.name, x]));
  assert.equal(by.C64_JOY_H, undefined);
  assert.equal(by.JOY_MAX.kind, "macro");
  assert.equal(by.JOY_BIT.sig, "(n)");
  assert.equal(by.joyx.kind, "variable");
  assert.equal(by.joyy.kind, "variable");
  assert.deepEqual(["JD_UP", "JD_DOWN", "JD_LEFT"].map((n) => by[n]?.kind), ["const", "const", "const"]);
  assert.equal(by.JoyDir.kind, "type");
  assert.equal(by.JoyState.kind, "type");
  assert.equal(by.joy_poll.sig, "void joy_poll(char n)");
  assert.equal(by.joy_get.kind, "function");
  assert.equal(by.k, undefined);
  const ctx = (s) => JSON.parse(JSON.stringify(context.c.ctx(s, s.length)));
  assert.deepEqual(ctx("#include <c64/v"), { kind: "include", sys: true, word: "c64/v" });
  assert.deepEqual(ctx("  x = joy_p"), { kind: "word", word: "joy_p" });
  assert.equal(context.c.ctx('puts("joy_', 10), null);
  assert.equal(context.c.ctx("// joy_p", 8), null);
  assert.equal(context.c.ctx("/* joy_p", 8), null);
  assert.deepEqual(ctx("#inc"), { kind: "directive", word: "inc" });
});

test("C files are tabs of the shared tab bar", async () => {
  const stubs = `
    let ultimateBasicMode = false; let tabs = [{ id: 1, name: "main.asm", editorMode: "expert" }]; let activeTabId = 1; let _n = 1; let _studioLastTabId = 1;
    function _tabCreate(name) { return { id: ++_n, name }; }
    function _tabActivate(id) { activeTabId = id; const tb = tabs.find((x) => x.id === id); if (tb.editorMode === "oscar") _oscShowFile(tb.oscId); else _osc.active = false; }
    function _tabDrop(id) { const i = tabs.findIndex((x) => x.id === id); tabs.splice(i, 1); if (activeTabId === id) _tabActivate(tabs[Math.min(i, tabs.length - 1)].id); }
    function _tabNew() {}
    function renderTabBar() {}
    function renderMemoryMap() {}
    function _updateEditorModeIndicator() {}
    function _showConfirm() { return Promise.resolve(true); }
  `;
  const context = {
    document: { readyState: "loading", addEventListener() {}, getElementById: () => null, querySelectorAll: () => [], body: { classList: { toggle() {} } } },
    localStorage: { getItem: () => null, setItem() {} },
    window: {}, requestAnimationFrame: () => 0, setTimeout: () => 0, clearTimeout() {},
    t: (k) => k, tf: (k) => k,
  };
  vm.createContext(context);
  vm.runInContext(stubs + oscJs + `
    this.s = { get tabs() { return tabs; }, get active() { return activeTabId; }, osc: _osc,
      add: (name) => { _osc.files.push({ id: _oscNextId++, path: "F:/p/" + name, name, text: "", saved: "", dirty: false }); _oscActivate(_osc.files.length - 1); },
      close: (i) => _oscCloseFile(i), leave: _oscLeave };`, context);
  const s = context.s;
  s.add("a.c");
  s.add("b.c");
  assert.deepEqual(plain(s.tabs.map((tb) => tb.name)), ["main.asm", "a.c", "b.c"]);
  assert.equal(s.tabs.find((tb) => tb.id === s.active).name, "b.c");
  assert.equal(s.osc.active, true);
  // the closed file's tab goes, the neighbour C file takes over
  assert.equal(await s.close(1), true);
  assert.deepEqual(plain(s.tabs.map((tb) => tb.name)), ["main.asm", "a.c"]);
  assert.equal(s.tabs.find((tb) => tb.id === s.active).name, "a.c");
  // leaving C returns to the assembler tab
  s.leave();
  assert.equal(s.active, 1);
  assert.equal(s.osc.active, false);
  // closing the last C file while an assembler tab is shown keeps that tab
  assert.equal(await s.close(0), true);
  assert.deepEqual(plain(s.tabs.map((tb) => tb.name)), ["main.asm"]);
  assert.equal(s.active, 1);
});
