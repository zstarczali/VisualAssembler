// The VMA build of the app (_kickOrVaPrg → _vaBuildPrg → _vmaRustBuild → vma_analyze): with the
// command stubbed, or the real CLI (tests/helpers/vma-cli.js). Without the desktop app no build.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const loadApp = require("./helpers/load-app");
const { compileText, useVmaCli, vmaTest } = require("./helpers/vma-cli");

const SOURCE = "* = $1000\n    lda #$01\n    sta $d020\n    rts\n";
const plain = (v) => JSON.parse(JSON.stringify(v));

// The app with `vmaAnalyze` stubbed (null: the real CLI).
function appWith(vmaAnalyze) {
  const app = loadApp();
  if (vmaAnalyze) app.electronAPI = { vmaAnalyze, vmaBuild: async () => assert.fail("vma_build must not run") };
  else useVmaCli(app);
  app.__src = SOURCE;
  app.run("program = parseExpertText(__src)");
  return app;
}

test("without the desktop app there is no build, only the message", async () => {
  const app = loadApp();
  app.electronAPI = {};
  app.run("currentLanguage = 'en'");
  const r = await app.run("_vaBuildPrg()");
  assert.equal(r.ok, false);
  assert.equal(r.error, app.run("translations.en.vmaNeedsDesktop"));
});

test("every language has the desktop-only message", () => {
  const app = loadApp();
  for (const lang of ["hu", "en", "es", "de", "nl", "pl", "it"]) {
    assert.equal(typeof app.run(`translations.${lang}.vmaNeedsDesktop`), "string", lang);
  }
});

test("the command's PRG and SYS address, its error as a compile error", async () => {
  let seen = null;
  const app = appWith(async (source, baseDir, basicStub) => {
    seen = { source, basicStub };
    return { ok: true, prg: [1, 8, 0xEA], sysAddress: 2061, listing: [] };
  });
  const r = await app.run("_vaBuildPrg()");
  assert.deepEqual(Array.from(r.bytes), [1, 8, 0xEA]);
  assert.equal(r.sysAddress, 2061);
  assert.match(seen.source, /sta \$D020/i);

  app.electronAPI.vmaAnalyze = async () => ({ ok: false, error: "LDA: invalid operand", line: 3, listing: [] });
  const bad = await app.run("_vaBuildPrg()");
  assert.equal(bad.ok, false);
  assert.match(bad.errors[0].text, /^\[R003\] .* — LDA: invalid operand$/);
});

// Block mode sends program.map(_blockToExpertSourceLine): the PRG of the same Expert text.
vmaTest("a Block-mode program builds as its Expert text", async () => {
  const app = appWith(null);
  app.document.getElementById("basic-sys-toggle").checked = true;
  const r = await app.run("_vaBuildPrg()");
  assert.equal(r.ok, true, r.error);
  assert.deepEqual(Array.from(r.bytes), Array.from(compileText(SOURCE).bytes));
});

// The debugger view of a build: vma_analyze gets the main source and the line map, the sidecars
// of the answer are the ones the app writes / hands to the debugger.
test("source path, line map and the debugger files of the answer", async () => {
  let seen = null;
  const sidecars = { sym: ".label start=$1000", vs: "al C:1000 .start", dbg: "<C64debugger/>" };
  const app = appWith(async (source, baseDir, basicStub, sourcePath, lineMap) => {
    seen = { source, sourcePath, lineMap };
    // [address, size, skipped, line of the source]: the ORG, LDA, STA, RTS of SOURCE
    return { ok: true, prg: [0, 16, 0xEA], debugOrigin: 0x1000, sidecars, symbols: [["start", 0x1000]], listing: [],
      lines: [[0x1000, 0, 0, 0], [0x1000, 2, 0, 1], [0x1002, 3, 0, 2], [0x1005, 1, 0, 3]] };
  });
  app.run("program.forEach((b, i) => { b._srcLine = i + 10; b.isBreakpoint = i === 2; })");
  app.__r = await app.run("_vaBuildPrg()");
  assert.ok(seen.sourcePath.endsWith(".asm"));
  assert.deepEqual(plain(seen.lineMap), plain(app.run("program.map((b, i) => i + 10)")));
  assert.deepEqual(plain(app.run("_buildDebuggerSidecarPayload(__r, { force: true })")), sidecars);
  const targets = plain(app.run("_vmaDebuggerTargets(__r.vma, [11, 12, 13])"));
  assert.deepEqual(targets.symbols, [{ name: "start", address: 0x1000 }]);
  assert.deepEqual(targets.breakpoints, [0x1002]);              // the block marked isBreakpoint
  assert.deepEqual(targets.expertBreakpoints, [0x1000, 0x1002, 0x1005]);
});

// The VICE Monitor hot reload writes the segments of the build and restarts at the entry.
vmaTest("hot reload segments", async () => {
  const app = appWith(null);
  app.__src = "* = $1000\n    lda #$01\n    .rawbytes $2000, $AA, $BB\n    .text 1, 2, \"HI\"\n* = $1100\n    rts\n";
  app.run("program = parseExpertText(__src)");
  app.document.getElementById("basic-sys-toggle").checked = true;
  const built = plain(await app.run("_vmBuildSegments()"));
  assert.deepEqual(built.segments.map(s => s.address), [0x1000, 0x1100, 0x2000]);
  assert.deepEqual(built.segments[2].bytes, [0xAA, 0xBB]);
  assert.equal(built.sys, 0x1000);
});

// Errors in the app's language: every line that does not compile, tf(key, params) of the key the
// command names, the address and the source line ([Rnnn] in the editor's own text).
vmaTest("every compile error, translated", async () => {
  const app = appWith(null);
  app.__src = "* = $1000\n    .sprite_pos 9, 10, 10\n    nop\n    .sprite_col 9, sprite\n";
  app.run("expertMode = true; currentLanguage = 'hu'");
  app.run("_expertGetSourceText = () => __src; _expertGetStartupSource = () => null; _expertGetStartupProgram = () => null");
  const r = await app.run("_vaBuildPrg()");
  assert.equal(r.ok, false);
  const texts = r.errors.map(e => e.text);
  assert.equal(texts.length, 2);
  const hu = app.run("translations.hu");
  assert.equal(texts[0], `[R002] $1000  .sprite_pos 9, 10, 10 — ${hu.compileSpritePosSpriteRange}`);
  assert.equal(texts[1], `[R004] $1013  .sprite_col 9, sprite — ${hu.spriteColSpriteNumberMustBe07}`);
  assert.deepEqual(r.errors.map(e => e.sourceLine), [1, 3]);
});

// A Kick project: vma_analyze gets the preprocessed text from the startup file's folder, its error
// line goes back to the Kick file:line.
test("a Kick project builds its preprocessed text", async () => {
  let seen = null;
  const app = appWith(async (source, baseDir) => {
    seen = { source, baseDir };
    return { ok: false, error: "LDA: invalid operand", line: 2, listing: [],
      errors: [{ line: 2, message: "LDA: invalid operand", key: "compileInvalidOperand", params: { mnemonic: "LDA" }, address: 0x1000 }] };
  });
  app.run(`_kickPrepare = async () => ({ ok: true, entry: "C:/game/src/main.asm", text: "* = $1000\\nLDA $\\n",
    origins: [{ file: "C:/game/src/main.asm", line: 1 }, { file: "C:/game/src/hero.asm", line: 7 }], errors: [] })`);
  const r = await app.run("_kickOrVaPrg()");
  assert.equal(seen.source, "* = $1000\nLDA $\n");
  assert.equal(seen.baseDir, "C:/game/src");
  assert.equal(r.ok, false);
  assert.equal(r.errors[0].fileLine, 7);
  assert.match(r.errors[0].text, /hero\.asm/);
  assert.match(r.errors[0].text, /LDA/);
});

// The compiling dialog's step line (setWorkStep): the compiler and file while it builds, the PRG after.
test("the work progress step line names the compiler, the file and the PRG", async () => {
  const steps = [];
  const app = appWith(async () => {
    steps.push(app.document.getElementById("work-progress-step").textContent);
    return { ok: true, prg: [0x00, 0x10, 0xEA, 0x60], listing: [] };
  });
  app.document.getElementById("work-progress-dialog").open = true;
  app.run("currentLanguage = 'en'; tabs = [{ id: 't1', name: 'game.asm', filePath: 'C:/src/game.asm' }]; activeTabId = 't1'");
  await app.run("_vaBuildPrg()");
  assert.equal(steps[0], "VMA (Rust): compiling game.asm…");
  assert.equal(app.document.getElementById("work-progress-step").textContent, "PRG ready: 2 bytes from $1000");
  // closed dialog: nothing written
  app.document.getElementById("work-progress-dialog").open = false;
  app.run("setWorkStep('stepDebugFiles')");
  assert.equal(app.document.getElementById("work-progress-step").textContent, "PRG ready: 2 bytes from $1000");
});

test("every setWorkStep key is translated", () => {
  const app = loadApp();
  const src = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");
  const keys = [...new Set([...src.matchAll(/setWorkStep\("([A-Za-z0-9]+)"/g)].map(m => m[1]))];
  assert.ok(keys.length >= 15, keys.join());
  const missing = [];
  for (const lang of ["hu", "en", "es", "de", "nl", "pl", "it"]) {
    for (const key of keys) if (typeof app.run(`translations.${lang}.${key}`) !== "string") missing.push(`${lang}.${key}`);
  }
  assert.deepEqual(missing, []);
});
