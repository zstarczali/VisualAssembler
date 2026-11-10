const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const loadApp = require("./helpers/load-app");
const { runCli, useVmaCli, vmaCli } = require("./helpers/vma-cli");

const app = loadApp();
const fixture = path.join(__dirname, "fixtures", "kick-project").split(path.sep).join("/");
const readText = (p) => { try { return fs.readFileSync(p, "utf8"); } catch { return null; } };
const readBin = (p) => { try { return new Uint8Array(fs.readFileSync(p)); } catch { return null; } };

// In-memory Kick tree: { "main.asm": "…", … } under /mem.
function preprocess(files, entry = "main.asm") {
  app.__files = Object.fromEntries(Object.entries(files).map(([k, v]) => ["/mem/" + k, v]));
  return app.run(`_kickPreprocess("/mem/${entry}", p => __files[p] ?? null, () => null)`);
}

// A preprocessed Kick text through the VMA compiler (the CLI's analysis, as _vmaAnalyze gives it
// for a Kick project: its text lines are the origins' indices).
const kickFeatures = path.join(__dirname, "fixtures", "kick-features");
function analyze(text, baseDir = kickFeatures) {
  useVmaCli(app);
  app.__r = runCli({ source: text, baseDir, basicStub: app.run("_vmaBasicStub()"), analyze: true });
  app.__src = text;
  app.__base = baseDir;
  return app.run("__vma = _vmaNormalize(__r, { text: __src, baseDir: __base, editorLines: false, kick: true })");
}

function build(text) {
  analyze(text);
  const r = app.run("_vmaBuildResult(__vma)");
  return { ok: r.ok, error: r.error, errors: r.errors, bytes: r.bytes ? Array.from(r.bytes) : null };
}

// The tests that build need the CLI.
const ktest = (name, fn) => test(name, { skip: vmaCli() ? false : "no Rust VMA CLI" }, fn);

// Bytes of the fixture built by KickAssembler 5.25 (java -jar KickAss.jar main.asm).
const KICK_HEAD = "01080b080a009e3230363200000000a9068d20d0a200bd004095fbbd004195fce8d0f3a903a038b94808b1fb6c1403cad0fd200004f001ea60010000020104000600030609aa55aa55aa55aa553808393808000403040506";
const KICK_TAIL = "a203cad0fdad09046007";

ktest("a KickAssembler project builds byte for byte like KickAssembler", () => {
  app.__readText = readText;
  app.__readBin = readBin;
  const pre = app.run(`_kickPreprocess(${JSON.stringify(fixture + "/main.asm")}, __readText, __readBin)`);
  assert.deepEqual(Array.from(pre.errors), []);
  const prg = build(pre.text);
  assert.equal(prg.ok, true, prg.error);
  const bytes = Buffer.from(prg.bytes);
  assert.equal(bytes.length, 2 + 0xC00A - 0x0801);
  assert.equal(bytes.subarray(0, KICK_HEAD.length / 2).toString("hex"), KICK_HEAD);
  assert.equal(bytes.subarray(bytes.length - KICK_TAIL.length / 2).toString("hex"), KICK_TAIL);
});

test("Kick constants pick zero page or absolute by value, like KickAssembler", () => {
  const { text, errors } = preprocess({
    "main.asm": ".const zp = $fb\n.const abs = $9a00\n* = $1000\n lda zp\n lda abs\n sta zp,x\n sta zp,y\n ldx zp,y\n lda #<abs\n lda.abs zp\n lda (zp),y\n"
  });
  assert.deepEqual(Array.from(errors), []);
  assert.deepEqual(text.split("\n").slice(1), ["LDA $FB", "LDA $9A00", "STA $FB,X", "STA $00FB,Y", "LDX $FB,Y", "LDA #$00", "LDA $00FB", "LDA ($FB),Y"]);
});

test("Kick multi-labels: !:, !name: and !+ / !- / !++ / !name- references", () => {
  const { text, errors } = preprocess({
    "main.asm": "* = $1000\n!: nop\n bne !-\n beq !+\n bcc !++\n!: nop\n!: nop\n!lp: dex\n bne !lp-\n jmp !lp+\n!lp: rts\n"
  });
  assert.deepEqual(Array.from(errors), []);
  assert.deepEqual(text.split("\n"), [
    "* = $1000", "__ml_1:", "NOP", "BNE __ml_1", "BEQ __ml_2", "BCC __ml_3", "__ml_2:", "NOP", "__ml_3:", "NOP",
    "__ml_lp_4:", "DEX", "BNE __ml_lp_4", "JMP __ml_lp_5", "__ml_lp_5:", "RTS"
  ]);
});

test("Kick script: .for, .var / .eval, .if / else .if, macros, functions, cmdLineVars", () => {
  const { text, errors } = preprocess({
    "main.asm": [
      '.const MODE = cmdLineVars.containsKey("mode") ? cmdLineVars.get("mode").asNumber() : 2',
      ".function Twice(x) { .return x * 2 }",
      ".macro Put(v, dst) {",
      "  lda #v",
      "  sta dst",
      "}",
      "* = $1000",
      ".for (var i = 0; i < 3; i++) {",
      "  .var d = i",
      "  .if (i == 1) .eval d = d + 10",
      "  .byte d, Twice(i)",
      "}",
      ".if (MODE == 1) { nop } else .if (MODE == 2) { Put(7, $d020) } else { brk }",
      ".for (var k = 0; k < 2; k++) asl"
    ].join("\n")
  });
  assert.deepEqual(Array.from(errors), []);
  assert.deepEqual(text.split("\n").slice(1), [".byte $00, $00", ".byte $0B, $02", ".byte $02, $04", "LDA #$07", "STA $D020", "ASL", "ASL"]);
});

test("Kick .pseudopc labels take the logical address, the bytes stay in place", () => {
  const { text, errors } = preprocess({
    "main.asm": "* = $4000\n.pseudopc $0400 {\nTab: .byte 1, 2\nCode: ldx #2\n!: dex\n bne !-\n jmp Code\n}\n lda Tab\n"
  });
  assert.deepEqual(Array.from(errors), []);
  assert.deepEqual(text.split("\n"), ["* = $4000", ".byte $01, $02", "LDX #$02", "DEX", "BNE *-1", "JMP $0402", "LDA $0400"]);
});

ktest("Kick .pseudopc forward branches stay relative to the logical PC", () => {
  const { text, errors } = preprocess({
    "main.asm": "* = $0900\n.pseudopc $0334 {\n ldx $ba\n bne !+\n ldx #8\n!: jsr $ffd5\n bcs !err+\n rts\n!err: inc $d020\n jmp !err-\n}\n"
  });
  assert.deepEqual(Array.from(errors), []);
  assert.deepEqual(text.split("\n"), ["* = $0900", "LDX $BA", "BNE *+4", "LDX #$08", "JSR $FFD5", "BCS *+3", "RTS", "INC $D020", "JMP $0340"]);
  assert.equal(build(text).ok, true);
});

test("Kick live check builds the tree of the open file when the startup file does not import it", async (t) => {
  const disk = {
    "/p/boot/boot.asm": "* = $0801\n lda #1\n rts\n",
    "/p/src/main.asm": '* = $0810\n#import "hero.asm"\n jmp *\n',
    "/p/src/hero.asm": "hero: ldx #0\n inx\n rts\n",
    "/p/src/consts.asm": ".const A = 1\n",
  };
  app.__disk = disk;
  app.__saved = app.run("({ p: _expertProjectData, t: tabs, a: activeTabId, e: expertMode, w: window.electronAPI })");
  t.after(() => app.run("_expertProjectData = __saved.p; tabs = __saved.t; activeTabId = __saved.a; expertMode = __saved.e; window.electronAPI = __saved.w; _kickCheckEntryCache.clear()"));
  const run = (file) => app.run(`(async () => {
    window.electronAPI = { readTextFile: async (p) => (p in __disk ? { ok: true, content: __disk[p] } : { ok: false }) };
    _expertProjectData = { kick: true, startupFile: "/p/boot/boot.asm", _projPath: "/p/src/x.proj",
      files: [{ type: "file", path: "/p/boot/boot.asm" }, { type: "file", path: "main.asm" }, { type: "file", path: "hero.asm" }, { type: "file", path: "consts.asm" }] };
    expertMode = false;
    tabs = [{ id: "k1", filePath: ${JSON.stringify(file)} }];
    activeTabId = "k1";
    _kickCheckEntryCache.clear();
    return _kickCheckEntry();
  })()`);
  assert.equal(await run("/p/boot/boot.asm"), "/p/boot/boot.asm");
  assert.equal(await run("/p/src/hero.asm"), "/p/src/main.asm");
  assert.equal(await run("/p/src/main.asm"), "/p/src/main.asm");
  assert.equal(await run("/p/src/consts.asm"), "/p/src/consts.asm");
});

test("Kick char literal equals a one-character string (charAt)", () => {
  const { text, errors } = preprocess({
    "main.asm": '* = $1000\n.var s = "1."\n.byte s.charAt(0) == \'1\' ? 1 : 0, s.charAt(1) != \'.\' ? 1 : 0, \'A\' == "AB" ? 1 : 0\n'
  });
  assert.deepEqual(Array.from(errors), []);
  assert.equal(text.split("\n")[1], ".byte $01, $00, $00");
});

test("Kick errors name the file and line of the imported source", () => {
  const { errors } = preprocess({
    "main.asm": '* = $1000\n#import "lib/mod.asm"\n',
    "lib/mod.asm": "nop\n.if (UNKNOWN > 1) { nop }\n"
  });
  assert.equal(errors.length, 1);
  assert.equal(errors[0].file, "/mem/lib/mod.asm");
  assert.equal(errors[0].line, 2);
  const missing = preprocess({ "main.asm": '#import "nope.asm"\n' }).errors;
  assert.match(missing[0].text, /File not found: \/mem\/nope\.asm/);
});

ktest("VA build errors of a Kick project map back to file:line", () => {
  const pre = preprocess({ "main.asm": '* = $1000\n#import "mod.asm"\n', "mod.asm": "nop\n lda NoSuchLabel\n" });
  const prg = build(pre.text);
  assert.equal(prg.ok, false);
  app.__prg = prg;
  app.__kick = { origins: pre.origins };
  const mapped = app.run("_kickMapResult(__prg, __kick)");
  assert.equal(mapped.errors[0].file, "/mem/mod.asm");
  assert.equal(mapped.errors[0].fileLine, 2);
  assert.match(mapped.errors[0].text, /^mod\.asm:2: /);
});

test("Import Kick project writes a .proj with every imported file", async () => {
  let saved = null;
  app.window.electronAPI = {
    chooseAsmFile: async () => ({ ok: true, filePath: path.join(fixture, "main.asm") }),
    readTextFile: async (p) => { const c = readText(p); return c === null ? { ok: false, error: "missing" } : { ok: true, content: c }; },
    readBinFile: async (p) => { const b = readBin(p); return b ? { ok: true, bytes: Array.from(b) } : { ok: false }; },
    saveTextFile: async (p, c) => { if (/\.proj$/.test(p)) saved = { p, c }; return { ok: true, path: p }; }
  };
  await app.run(`(async () => {
    _closeAllTabsWithConfirm = async () => true;
    _expertProjectOpenFile = async () => {};
    await importKickProject();
  })()`);
  assert.ok(saved, "no .proj written");
  assert.equal(saved.p, fixture + "/kick-project.proj");
  const proj = JSON.parse(saved.c);
  assert.equal(proj.kick, true);
  assert.equal(proj.startupFile, "main.asm");
  assert.deepEqual(proj.files.map(f => f.name), ["main.asm", "lib"]);
  assert.deepEqual(proj.files[1].children.map(f => f.path).sort(), ["lib/consts.asm", "lib/data.bin"]);
  assert.equal(app.run("_expertProjectData.kick"), true);
});

ktest("a Kick-compatible project keeps the VA macros and directives working", () => {
  const va = [
    ".const COL = 6",
    ".define DEBUG",
    "* = $c000",
    ".macro setColor(color)",
    "    LDA {color}",
    "    STA $D020",
    ".endm",
    "start:",
    ".invoke setColor(#COL)",
    ".if DEBUG",
    "    LDA #1",
    ".else",
    "    LDA #2",
    ".endif",
    ".loop X, $03, loop1",
    "    NOP",
    ".next loop1",
    ".for Y, $02, for1",
    "    INY",
    ".endf for1",
    '.text 10, 5, "HI"'
  ];
  const pre = preprocess({ "main.asm": va.concat([".for (var i = 0; i < 2; i++) { lda #i }", "!: dex", " bne !-", " rts"]).join("\n") });
  assert.deepEqual(Array.from(pre.errors), []);
  const mixed = build(pre.text);
  const pure = build(va.concat(["    LDA #0", "    LDA #1", "lp: DEX", "    BNE lp", "    RTS"]).join("\n"));
  assert.equal(mixed.ok, true, mixed.error);
  assert.equal(pure.ok, true, pure.error);
  assert.deepEqual(mixed.bytes, pure.bytes);
});

test("Kick: * as the program counter, ; between statements, VA ; comments", () => {
  const { text, errors } = preprocess({
    "main.asm": "* = $1000\nloop: jmp *\n bne *-1\n lda #1; sta $d020 ; VA comment\n.var a = 2; .var b = a * 3; .byte b\n.pseudopc $0400 {\n jmp *\n}\n"
  });
  assert.deepEqual(Array.from(errors), []);
  assert.deepEqual(text.split("\n"), ["* = $1000", "loop:", "JMP *", "BNE *-1", "LDA #$01", "STA $D020", ".byte $06", "JMP $0400"]);
});

test("Kick: .while with i++, .var without a value, math library, colour and opcode constants", () => {
  const { text, errors } = preprocess({
    "main.asm": [
      "* = $1000",
      ".var i = 0",
      ".var n",
      ".while (i++ < 3) { .eval n = n + i }",
      ".byte n, round(10 * sin(toRadians(90))), toDegrees(PI) / 10",
      ".byte RED, LIGHT_GREY, RTS, LDA_IMM, JMP_IND, BNE_REL, LDX_ZPY",
      ".byte asmCommandSize(RTS), asmCommandSize(LDA_IMM), asmCommandSize(JMP_IND)",
      " lda #WHITE"
    ].join("\n")
  });
  assert.deepEqual(Array.from(errors), []);
  assert.deepEqual(text.split("\n").slice(1), [
    ".byte $06, $0A, $12",
    ".byte $02, $0F, $60, $A9, $6C, $D0, $B6",
    ".byte $01, $02, $03",
    "LDA #$01"
  ]);
});

test("Kick: BasicUpstart2 SYS address from a label after * = (sizes known)", () => {
  const { text, errors } = preprocess({ "main.asm": "BasicUpstart2(start)\n* = $4000\n nop\nstart: rts\n" });
  assert.deepEqual(Array.from(errors), []);
  // SYS 16385: 5 digits, the link to the end marker at $080C
  assert.equal(text.split("\n")[1], ".byte $0C, $08, $0A, $00, $9E, $31, $36, $33, $38, $35, $00, $00, $00");
});

// Optional: the KickAssembler examples next to KickAss.jar, built by KickAssembler and by VA.
test("KickAssembler examples build byte for byte like KickAssembler (needs KICKASS_JAR)", { skip: !process.env.KICKASS_JAR }, () => {
  const { execFileSync } = require("node:child_process");
  const os = require("node:os");
  const examples = path.join(path.dirname(process.env.KICKASS_JAR), "Examples");
  const work = fs.mkdtempSync(path.join(os.tmpdir(), "va-kick-examples-"));
  try {
    fs.cpSync(examples, work, { recursive: true });
    app.__readText = (p) => { try { return fs.readFileSync(p, "latin1"); } catch { return null; } };
    app.__readBin = readBin;
    for (const main of ["01.MusicIrq/MusicIrq.asm", "05.Scoping/Scroll.asm", "06.PseudoCommands/2xSpeedPlayer.asm", "06.PseudoCommands/8xSpeedPlayer.asm", "07.Preprocessor/Preprocessor.asm", "08.Namespace and libraries/SimpleSplits.asm", "03.Functions Multilabels Fill Virtual/SineAndGraphics.asm", "09.PSID Import/SID_Player.asm", "10.Koala Import/KoalaShower.asm", "04.Converting Graphics/Message.asm"]) {
      const file = path.join(work, main);
      execFileSync("java", ["-jar", process.env.KICKASS_JAR, path.basename(file), "-o", "ref.prg"], { cwd: path.dirname(file), stdio: "pipe" });
      const pre = app.run(`_kickPreprocess(${JSON.stringify(file.split(path.sep).join("/"))}, __readText, __readBin)`);
      assert.deepEqual(Array.from(pre.errors), [], main);
      const prg = build(pre.text);
      assert.equal(prg.ok, true, `${main}: ${prg.error}`);
      assert.ok(Buffer.from(prg.bytes).equals(fs.readFileSync(path.join(path.dirname(file), "ref.prg"))), `${main} differs`);
    }
  } finally {
    fs.rmSync(work, { recursive: true, force: true });
  }
});

// Scopes and namespaces: the expected bytes come from KickAssembler 5.25 (code at $1000).
function buildKick(files) {
  const pre = preprocess(files);
  assert.deepEqual(Array.from(pre.errors), []);
  const prg = build(pre.text);
  // the code from $1000 (the VA build puts a BASIC SYS stub in front)
  const load = prg.bytes ? prg.bytes[0] | (prg.bytes[1] << 8) : 0;
  return { ...prg, hex: prg.bytes ? Buffer.from(prg.bytes.slice(2 + 0x1000 - load)).toString("hex") : "" };
}

test("Kick scopes: { } blocks, label scopes, loop / if / macro labels, consts", () => {
  const cases = [
    ["lp: .for (var i=0;i<2;i++) {\ninner: nop\n}\n jmp lp[1].inner", "eaea4c0110"],
    [" jmp myIf.inner\nmyIf: .if (true) {\n nop\ninner: rts\n}", "4c0410ea60"],
    [" inc c1.color\nc1: setColor()\n.macro setColor() {\n .label color = *+1\n lda #0\n}", "ee0410a900"],
    [" jsr outside\n{\n@outside: rts\n}", "20031060"],
    ["start: nop\n{\n jmp start\n}", "ea4c0010"],
    [".const X = 1\n{\n.const X = 2\n lda #X\n}\n lda #X", "a902a901"],
    [".label base = $1000 {\n.label sub = $1234\n}\n lda base.sub", "ad3412"],
    [".if (true) {\na: nop\n}\n.if (true) {\na: nop\n}", "eaea"],
    ["loop: nop\n{\nloop: dex\n bne loop\n}\n jmp loop", "eaca d0fd4c0010".replace(" ", "")],
    [" jsr part.init\n.namespace part {\ninit: rts\n}", "20031060"]
  ];
  for (const [source, hex] of cases) {
    const prg = buildKick({ "main.asm": "* = $1000\n" + source });
    assert.equal(prg.ok, true, `${source}\n${prg.error}`);
    assert.equal(prg.hex, hex, source);
  }
});

test("Kick .filenamespace: labels as namespace.name, @ puts a label in the root", () => {
  const prg = buildKick({
    "main.asm": '* = $1000\n#import "lib.asm"\n jsr part.init\n jsr shared\n lda #part.VALUE\n',
    "lib.asm": ".filenamespace part\n.label VALUE = 7\ninit: lda #VALUE\n rts\n@shared: rts\n"
  });
  assert.equal(prg.ok, true, prg.error);
  assert.equal(prg.hex, "a9076060200010200310a907");
});

test("Kick scopes: inner labels are not visible outside their scope", () => {
  for (const source of [".if (true) {\ninner: nop\n}\n jmp inner", "{\ninner: nop\n}\n jmp inner", ".for (var i=0;i<2;i++) {\ninner: nop\n}\n jmp inner"]) {
    const prg = buildKick({ "main.asm": "* = $1000\n" + source });
    assert.equal(prg.ok, false, source);
  }
});

// Pseudocommands, #define / #if, List / Hashtable / struct / strings / .enum / .define:
// the fixtures and the bytes KickAssembler 5.25 made of them (code at $1000).
test("Kick pseudocommands, preprocessor and data structures build like KickAssembler", () => {
  const dir = path.join(__dirname, "fixtures", "kick-features");
  const expected = {
    "pseudocommands.asm": "a90a8d0010b520993000a9149130a93485fba91285fc18a53069808530a5316900853118a53069008532a53169108533a1408541",
    "preprocessor.asm": "a901a905",
    "data-structures.asm": "01030308000905020505ff48454c4c4f34320001050214"
  };
  for (const [file, hex] of Object.entries(expected)) {
    const prg = buildKick({ "main.asm": fs.readFileSync(path.join(dir, file), "utf8") });
    assert.equal(prg.ok, true, `${file}: ${prg.error}`);
    assert.equal(prg.hex, hex, file);
  }
});

test("Kick .error / .errorif stop the build, .print is collected", () => {
  const bad = preprocess({ "main.asm": '* = $1000\n.errorif 1 > 0, "too big"\n' });
  assert.equal(bad.errors[0].text, "too big");
  const printed = preprocess({ "main.asm": '* = $1000\n.var x = 3\n.print "x=" + x\n nop\n' });
  assert.deepEqual(Array.from(printed.errors), []);
  assert.deepEqual(Array.from(printed.messages), ["x=3"]);
});

test("Kick command-line variables and -define symbols come from the project settings", () => {
  // KickAssembler: java -jar KickAss.jar cl.asm -define DEBUG :level=7 :name=AB
  const source = '* = $1000\n.const L = cmdLineVars.containsKey("level") ? cmdLineVars.get("level").asNumber() : 1\n lda #L\n#if DEBUG\n lda #$dd\n#endif\n.if (cmdLineVars.containsKey("name")) { .text cmdLineVars.get("name") }\n';
  app.__files = { "/mem/main.asm": source };
  const pre = app.run(`_kickPreprocess("/mem/main.asm", p => __files[p] ?? null, () => null, { defines: ["DEBUG"], vars: { level: "7", name: "AB" } })`);
  assert.deepEqual(Array.from(pre.errors), []);
  const prg = build(pre.text);
  const load = prg.bytes[0] | (prg.bytes[1] << 8);
  assert.equal(Buffer.from(prg.bytes.slice(2 + 0x1000 - load)).toString("hex"), "a907a9dd4142");
  // without them: the defaults
  const plain = buildKick({ "main.asm": source });
  assert.equal(plain.hex, "a901");
});

test("Project settings: name, startup file, Kick switch, symbols and variables are saved in the .proj", async () => {
  const saved = [];
  app.window.electronAPI = { saveProjFile: async (p, c) => { saved.push(JSON.parse(c)); return { ok: true, filePath: p }; } };
  app.run(`_expertProjectData = { name: "p", files: [{ type: "file", name: "main.asm", path: "main.asm" }, { type: "folder", name: "lib", path: "lib", children: [{ type: "file", name: "x.asm", path: "lib/x.asm" }] }], _projPath: "/mem/p.proj", startupFile: "main.asm" };`);
  await app.run("openProjectSettings()");
  const el = (id) => app.document.getElementById(id);
  el("ps-name").value = "Renamed";
  el("ps-startup").value = "lib/x.asm";
  el("ps-assembler").value = "kick";
  el("ps-kick").checked = true;
  el("ps-defines").value = "DEBUG, PAL bad-name";
  el("ps-vars").value = "level=3\nautojoy = 2\n# skip\nflag";
  await app.run("_projSettingsSave()");
  const proj = saved.at(-1);
  assert.equal(proj.name, "Renamed");
  assert.equal(proj.startupFile, "lib/x.asm");
  assert.equal(proj.kick, true);
  assert.deepEqual(proj.kickDefines, ["DEBUG", "PAL"]);
  assert.deepEqual({ ...proj.kickVars }, { level: "3", autojoy: "2", flag: "" });
  assert.equal(el("ps-files").textContent.includes("2"), true);
});

ktest("Kick LoadSid, LoadBinary with a template and virtual blocks build like KickAssembler", () => {
  const dir = path.join(__dirname, "fixtures", "kick-features").split(path.sep).join("/");
  app.__readText = readText;
  app.__readBin = readBin;
  const pre = app.run(`_kickPreprocess(${JSON.stringify(dir + "/load.asm")}, __readText, __readBin)`);
  assert.deepEqual(Array.from(pre.errors), []);
  const prg = build(pre.text);
  assert.equal(prg.ok, true, prg.error);
  // KickAssembler 5.25: java -jar KickAss.jar load.asm -o load.kickass.prg (code from $0C00, no BASIC line)
  const ref = fs.readFileSync(path.join(dir, "load.kickass.prg"));
  const load = prg.bytes[0] | (prg.bytes[1] << 8);
  assert.ok(Buffer.from(prg.bytes.slice(2 + 0x0C00 - load)).equals(ref.subarray(2)));
  // the virtual block ($2000) gives its labels, but no bytes
  assert.ok(prg.bytes.length - 2 + load < 0x2000, "the virtual block at $2000 writes no bytes");
});

ktest("Kick cycle gutter: cycles on the lines of the open file, unrolled lines as ×n", () => {
  const pre = preprocess({ "main.asm": '* = $1000\n nop\n#import "mod.asm"\n', "mod.asm": ".for (var i = 0; i < 3; i++) {\n lda $2000+i*256,x\n}\n bne *\n" });
  assert.deepEqual(Array.from(pre.errors), []);
  app.__kick = { origins: pre.origins };
  analyze(pre.text);
  const out = app.run(`({ mod: [..._kickCycleMap(__kick, "/mem/mod.asm", __vma).entries()], main: [..._kickCycleMap(__kick, "/mem/main.asm", __vma).entries()] })`);
  const mod = new Map(out.mod);
  assert.equal(mod.get(1).text, "4×3");
  assert.equal(mod.get(1).min, 12);
  assert.equal(mod.get(3).text, "2/3");
  assert.deepEqual(JSON.parse(JSON.stringify(out.main.map(([line, c]) => [line, c.text]))), [[1, "2"]]);
});

ktest("Kick debugger files: .dbg lines on the original file:line, readable symbols, breakpoints of every project file", () => {
  const pre = preprocess({ "main.asm": '* = $1000\nstart: nop\n#import "mod.asm"\n', "mod.asm": "sub: {\nloop: dex\n bne loop\n!: rts\n}\n" });
  assert.deepEqual(Array.from(pre.errors), []);
  app.__kick = { origins: pre.origins };
  analyze(pre.text);
  const out = app.run(`(() => {
    const savedTabs = tabs;
    try {
      const layout = _vmaLayout(__vma);
      const texts = _buildDebuggerSidecarTexts(layout, null, "/mem/main.asm", __kick);
      tabs = [{ id: "t-mod", filePath: "/mem/mod.asm", expertBreakpointLines: [0, 2] }];
      return { texts, bps: _kickBreakpointAddresses(layout, __kick) };
    } finally { tabs = savedTabs; }
  })()`);
  const dbg = JSON.stringify(out.texts);
  assert.match(dbg, /mod\.asm/);
  assert.match(dbg, /sub\.loop/);
  assert.doesNotMatch(dbg, /__ml_|__sub__/);
  // mod.asm line 1 ("sub: {") → next code line "dex" ($1001); line 3 → bne ($1002)
  assert.deepEqual(Array.from(out.bps), [0x1001, 0x1002]);
});

ktest("Kick peephole hints land on the lines of the open file, once per unrolled line", () => {
  const pre = preprocess({ "main.asm": '* = $1000\n jsr sub\n#import "mod.asm"\n', "mod.asm": "sub: {\n.for (var i = 0; i < 2; i++) {\n cmp #0\n beq !+\n!:\n}\n jsr $ffd2\n rts\n}\n" });
  assert.deepEqual(Array.from(pre.errors), []);
  app.__kick = { origins: pre.origins };
  analyze(pre.text);
  const out = app.run(`({ mod: _kickLintHints(__kick, "/mem/mod.asm", __vma), main: _kickLintHints(__kick, "/mem/main.asm", __vma) })`);
  const mod = JSON.parse(JSON.stringify(out.mod)).map(h => [h.srcLine, h.key]).sort();
  assert.deepEqual(mod, [[3, "lintBranchNext"], [6, "lintTailCall"]].sort());
  assert.deepEqual(Array.from(out.main), []);
});

ktest("Kick LoadPicture: GIF with the default and a given colour table builds like KickAssembler", () => {
  const dir = path.join(__dirname, "fixtures", "kick-features").split(path.sep).join("/");
  app.__readText = readText;
  app.__readBin = readBin;
  const pre = app.run(`_kickPreprocess(${JSON.stringify(dir + "/picture.asm")}, __readText, __readBin)`);
  assert.deepEqual(Array.from(pre.errors), []);
  const prg = build(pre.text);
  assert.equal(prg.ok, true, prg.error);
  // KickAssembler 5.25: java -jar KickAss.jar picture.asm -o picture.kickass.prg (from $1000)
  const ref = fs.readFileSync(path.join(dir, "picture.kickass.prg"));
  const load = prg.bytes[0] | (prg.bytes[1] << 8);
  assert.ok(Buffer.from(prg.bytes.slice(2 + 0x1000 - load)).equals(ref.subarray(2)));
  // a colour that is not in the table names the pixel
  app.__text = (p) => (p.endsWith("bad.asm") ? '* = $1000\n.var q = LoadPicture("2x2char.gif", List().add($ffffff))\n.byte q.getSinglecolorByte(0, 0)\n' : readText(p));
  const bad = app.run(`_kickPreprocess(${JSON.stringify(dir + "/bad.asm")}, __text, __readBin)`);
  assert.match(bad.errors[0]?.text || "", /not in the colour table/);
});

ktest("Kick segments: .file / outPrg / outBin / .segmentout / .disk outputs build like KickAssembler", async () => {
  const dir = path.join(__dirname, "fixtures", "kick-features").split(path.sep).join("/");
  app.__readText = readText;
  app.__readBin = readBin;
  // KickAssembler 5.25: java -jar KickAss.jar seg-x.asm -o seg-x.kickass.prg writes the outputs beside
  const outputs = async (file) => {
    const pre = app.run(`_kickPreprocess(${JSON.stringify(dir + "/" + file)}, __readText, __readBin)`);
    assert.deepEqual(Array.from(pre.errors), [], file);
    app.__pre = pre;
    const built = await app.run(`Promise.all(__pre.outputs.map(async o => o.type === "d64"
      ? { name: o.name, files: await Promise.all(o.files.map(async f => ({ name: f.name, bytes: Array.from((await _kickBuildOutput({ ...f, type: "prg" })).bytes || []) }))) }
      : { name: o.name, bytes: Array.from((await _kickBuildOutput(o)).bytes || []) }))`);
    return { pre, built: JSON.parse(JSON.stringify(built)) };
  };
  const same = (bytes, ref) => assert.ok(Buffer.from(bytes).equals(fs.readFileSync(path.join(dir, ref))), ref);

  // startAfter + align, a virtual segment, the BasicUpstart modifier; the Default segment is empty
  const a = await outputs("seg-a.asm");
  assert.equal(a.pre.mainOutput, "seg-a.file.prg");
  same(a.built.find(o => o.name === "seg-a.file.prg").bytes, "seg-a.file.prg");
  same(a.built.find(o => o.name === "seg-a.other.prg").bytes, "seg-a.other.prg");

  // banks through .segmentout with min / max / fill; zero page code through .segmentout
  const b = await outputs("seg-b.asm");
  same(b.built.find(o => o.name === "seg-b.cart.bin").bytes, "seg-b.cart.bin");
  const main = build(b.pre.text);
  assert.ok(Buffer.from(main.bytes).equals(fs.readFileSync(path.join(dir, "seg-b.kickass.prg"))));

  // prgFiles + allowOverlap (a patch), sidFiles, a .disk with the same files
  const c = await outputs("seg-c.asm");
  same(c.built.find(o => o.name === "seg-c.patched.prg").bytes, "seg-c.patched.prg");
  same(c.built.find(o => o.name === "seg-c.music.prg").bytes, "seg-c.music.prg");
  const disk = c.built.find(o => o.name === "seg-c.d64");
  assert.deepEqual(disk.files.map(f => f.name), ["PATCHED", "MUSIC"]);
  same(disk.files[0].bytes, "seg-c.patched.prg");
  same(disk.files[1].bytes, "seg-c.music.prg");
});

test("Kick segments: a block outside min / max names the segment", () => {
  const pre = preprocess({ "main.asm": ".segment Data [start=$c000, min=$c000, max=$c0ff, outBin=\"d.bin\"]\n.fill $180, 0\n" });
  assert.match(pre.errors[0]?.text || "", /Segment Data: \$C180 is outside \$C000-\$C0FF/);
});

ktest("Kick .cpu (illegal, 65c02, DTV), .fillword / .lohifill, suffixes, .break / .watch build like KickAssembler", () => {
  const dir = path.join(__dirname, "fixtures", "kick-features").split(path.sep).join("/");
  app.__readText = readText;
  app.__readBin = readBin;
  const pre = app.run(`_kickPreprocess(${JSON.stringify(dir + "/cpu.asm")}, __readText, __readBin)`);
  assert.deepEqual(Array.from(pre.errors), []);
  const prg = build(pre.text);
  assert.equal(prg.ok, true, prg.error);
  // KickAssembler 5.25: java -jar KickAss.jar cpu.asm -o cpu.kickass.prg -vicesymbols (from $1000)
  const ref = fs.readFileSync(path.join(dir, "cpu.kickass.prg"));
  const load = prg.bytes[0] | (prg.bytes[1] << 8);
  assert.ok(Buffer.from(prg.bytes.slice(2 + 0x1000 - load)).equals(ref.subarray(2)));
  // the VICE symbol file gets KickAssembler's break / watch lines
  app.__kick = { origins: pre.origins, breaks: pre.breaks, watches: pre.watches };
  analyze(pre.text);
  const vs = app.run(`_buildDebuggerSidecarTexts(_vmaLayout(__vma), null, "/mem/cpu.asm", __kick).vs`);
  assert.deepEqual(vs.split("\n").filter(l => /^(break|watch)/.test(l)),
    ["break 10bb", "break 10be if y<5", "watch d018", "watch 10b5", "watch d000 d00f", "watch store 10b4 10be"]);
  // an illegal opcode outside .cpu _6502
  const bad = preprocess({ "main.asm": ".cpu _6502NoIllegals\n* = $1000\n lax $12\n" });
  assert.match(bad.errors[0]?.text || "", /illegal opcode/);
});

ktest("VA assembles every NMOS illegal opcode mode and its other names", () => {
  const out = build("* = $1000\n DCP ($12,X)\n SLO ($12),Y\n LAX $12,Y\n SHA $1234,Y\n SHX $1234,Y\n SHY $1234,X\n TAS $1234,Y\n LAS $1234,Y\n XAA #$12\n AHX ($12),Y\n ISB $1234,Y\n SBX #1\n");
  assert.equal(out.ok, true, out.error);
  assert.equal(Buffer.from(out.bytes).toString("hex").slice(-50), "c3121312b7129f34129e34129c34129b3412bb34128b129312fb3412cb01".slice(-50));
});

ktest("Kick Vector / Matrix: the rotating cube of the manual builds like KickAssembler", () => {
  const dir = path.join(__dirname, "fixtures", "kick-features").split(path.sep).join("/");
  app.__readText = readText;
  app.__readBin = readBin;
  const pre = app.run(`_kickPreprocess(${JSON.stringify(dir + "/vector.asm")}, __readText, __readBin)`);
  assert.deepEqual(Array.from(pre.errors), []);
  const prg = build(pre.text);
  // KickAssembler 5.25: java -jar KickAss.jar vector.asm -o vector.kickass.prg (from $1000)
  const ref = fs.readFileSync(path.join(dir, "vector.kickass.prg"));
  const load = prg.bytes[0] | (prg.bytes[1] << 8);
  assert.ok(Buffer.from(prg.bytes.slice(2 + 0x1000 - load)).equals(ref.subarray(2)));
  assert.deepEqual(Array.from(pre.messages), ["V (1.0,2.0,3.0) dot 20 x (0.0,0.0,-1.0) M [[1.0,0.0,0.0,0.0],[0.0,1.0,0.0,0.0],[0.0,0.0,1.0,0.0],[0.0,0.0,0.0,1.0]]"]);
});

test("Kick project highlighting: preprocessor, directives, functions, ; in .for, multi-labels, suffixes", () => {
  const out = app.run(`(() => {
    const saved = _expertProjectData;
    try {
      _expertProjectData = { kick: true, startupFile: "m.asm", files: [] };
      _kickHlCache = { tab: null, proj: null, at: 0, value: false };
      return ['#import "lib.asm"', ".for (var i=0; i<8; i++) {", "!loop: dex", "lda.z $12 // zp", ".pseudocommand mov src : dst {", ".fill 4, round(127.5*sin(i))", "lda #1 ; comment"].map(_expertHighlightLine);
    } finally { _expertProjectData = saved; _kickHlCache = { tab: null, proj: null, at: 0, value: false }; }
  })()`);
  const tags = (html) => [...html.matchAll(/<span class="([^"]+)">([^<]*)<\/span>/g)].map(m => `${m[1]}:${m[2]}`);
  assert.deepEqual(tags(out[0]), ["hl-directive:#import", 'hl-string:"lib.asm"']);
  assert.ok(!out[1].includes("hl-comment"), "the ; of .for is no comment");
  assert.deepEqual(tags(out[2]), ["hl-label:!loop", "hl-mnem:dex"]);
  assert.deepEqual(tags(out[3]), ["hl-mnem:lda", "hl-mnem:.z", "hl-number:$12", "hl-comment:// zp"]);
  assert.deepEqual(tags(out[4]), ["hl-directive:.pseudocommand", "hl-macro:mov", "hl-macro-param:src", "hl-macro-param:dst"]);
  assert.ok(tags(out[5]).includes("hl-macro:round") && tags(out[5]).includes("hl-number:127.5"));
  assert.ok(tags(out[6]).includes("hl-comment:; comment"));
});
