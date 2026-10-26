// The VMA compiler engine switch (Settings → General, c64va-vma-engine): js / rust / shadow
// through _kickOrVaPrg → _vaBuildPrg, with the vma_build command stubbed (or the real CLI).
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const loadApp = require("./helpers/load-app");
const { findRustCli, runRustCli } = require("./helpers/vma-rust");

const SOURCE = "* = $1000\n    lda #$01\n    sta $d020\n    rts\n";

function appWith(vmaBuild, engine) {
  const app = loadApp();
  app.electronAPI = { vmaBuild };
  if (engine) app.localStorage.setItem("c64va-vma-engine", engine);
  app.__src = SOURCE;
  app.run("program = parseExpertText(__src)");
  return app;
}

const jsBuild = (app) => app.run("buildAutostartPrgForEmulator()");

test("the engine defaults to js and ignores unknown values", () => {
  const app = appWith(async () => assert.fail("vma_build must not run"));
  assert.equal(app.run("_vmaEngine()"), "js");
  app.localStorage.setItem("c64va-vma-engine", "nonsense");
  assert.equal(app.run("_vmaEngine()"), "js");
});

test("js engine: the JS build, no vma_build call", async () => {
  const app = appWith(async () => assert.fail("vma_build must not run"), "js");
  const r = await app.run("_vaBuildPrg()");
  assert.deepEqual(Array.from(r.bytes), Array.from(jsBuild(app).bytes));
});

test("rust engine: the command's PRG and SYS address, its error as a compile error", async () => {
  let seen = null;
  const app = appWith(async (source, baseDir, basicStub) => {
    seen = { source, basicStub };
    return { ok: true, prg: [1, 8, 0xEA], sysAddress: 2061 };
  }, "rust");
  const r = await app.run("_vaBuildPrg()");
  assert.deepEqual(Array.from(r.bytes), [1, 8, 0xEA]);
  assert.equal(r.sysAddress, 2061);
  assert.match(seen.source, /sta \$D020/i);

  app.electronAPI.vmaBuild = async () => ({ ok: false, error: "LDA: invalid operand", line: 3 });
  const bad = await app.run("_vaBuildPrg()");
  assert.equal(bad.ok, false);
  assert.match(bad.errors[0].text, /^\[R003\] .* — LDA: invalid operand$/);
});

test("shadow engine: the JS result is used, a difference is logged", async () => {
  let rust = null;
  const app = appWith(async () => rust, "shadow");
  const js = jsBuild(app);
  rust = { ok: true, prg: Array.from(js.bytes), sysAddress: js.sysAddress };
  let r = await app.run("_vaBuildPrg()");
  assert.deepEqual(Array.from(r.bytes), Array.from(js.bytes));
  assert.equal(app.run("_vaErrorLog.filter(l => l.includes('vma-shadow')).length"), 0);

  const changed = Array.from(js.bytes);
  changed[changed.length - 1] ^= 0xFF;
  rust = { ok: true, prg: changed, sysAddress: js.sysAddress };
  r = await app.run("_vaBuildPrg()");
  assert.deepEqual(Array.from(r.bytes), Array.from(js.bytes));
  const log = app.run("_vaErrorLog.filter(l => l.includes('vma-shadow'))");
  assert.equal(log.length, 1);
  assert.match(log[0], new RegExp(`first difference at offset ${changed.length - 1}`));
});

// Block mode sends program.map(_blockToExpertSourceLine): the real Rust CLI gives the JS bytes.
test("block-mode source text through the Rust CLI", { skip: !findRustCli() && "no Rust VMA CLI" }, async () => {
  const cli = findRustCli();
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "vma-engine-"));
  try {
    const app = appWith(async (source, baseDir, basicStub) => {
      const run = runRustCli(cli, { caseId: "engine", id: "engine", input: source, baseDir: "samples", basicStub }, tmp);
      return run.ok ? { ok: true, prg: Array.from(run.bytes) } : { ok: false, error: run.error };
    }, "rust");
    app.document.getElementById("basic-sys-toggle").checked = true;
    const r = await app.run("_vaBuildPrg()");
    assert.equal(r.ok, true);
    assert.deepEqual(Array.from(r.bytes), Array.from(jsBuild(app).bytes));
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

// The debugger view of a Rust build: vma_build gets the main source and the line map, the
// sidecars of the answer are the ones the app writes / hands to the debugger.
test("rust engine: source path, line map and the debugger files of the answer", async () => {
  let seen = null;
  const sidecars = { sym: ".label start=$1000", vs: "al C:1000 .start", dbg: "<C64debugger/>" };
  const app = appWith(async (source, baseDir, basicStub, sourcePath, lineMap) => {
    seen = { source, sourcePath, lineMap };
    // [address, size, skipped, line of the source]: the ORG, LDA, STA, RTS of SOURCE
    return { ok: true, prg: [0, 16, 0xEA], debugOrigin: 0x1000, sidecars, symbols: [["start", 0x1000]],
      lines: [[0x1000, 0, 0, 0], [0x1000, 2, 0, 1], [0x1002, 3, 0, 2], [0x1005, 1, 0, 3]] };
  }, "rust");
  app.run("program.forEach((b, i) => { b._srcLine = i + 10; b.isBreakpoint = i === 2; })");
  app.__r = await app.run("_vaBuildPrg()");
  assert.ok(seen.sourcePath.endsWith(".asm"));
  const plain = (v) => JSON.parse(JSON.stringify(v));
  assert.deepEqual(plain(seen.lineMap), plain(app.run("program.map((b, i) => i + 10)")));
  assert.deepEqual(plain(app.run("_buildDebuggerSidecarPayload(__r, { force: true })")), sidecars);
  const targets = plain(app.run("_vmaDebuggerTargets(__r.vma, [11, 12, 13])"));
  assert.deepEqual(targets.symbols, [{ name: "start", address: 0x1000 }]);
  assert.deepEqual(targets.breakpoints, [0x1002]);              // the block marked isBreakpoint
  assert.deepEqual(targets.expertBreakpoints, [0x1000, 0x1002, 0x1005]);
});

// What a Rust build writes and the memory panel's view of it (the real CLI's --json answer):
// the VICE Monitor hot reload writes the segments and restarts at the entry, shadow mode compares
// the memory view with the JS layout's.
test("rust build: hot reload segments and the shadow memory check", { skip: !findRustCli() && "no Rust VMA CLI" }, async () => {
  const cli = findRustCli();
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "vma-engine-"));
  const src = "* = $1000\n    lda #$01\n    .rawbytes $2000, $AA, $BB\n    .text 1, 2, \"HI\"\n* = $1100\n    rts\n";
  let tamper = null;
  try {
    const app = appWith(async (source, baseDir, basicStub, sourcePath) => {
      const input = path.join(tmp, "in.asm");
      fs.writeFileSync(input, source);
      const json = path.join(tmp, "out.json");
      const run = require("node:child_process").spawnSync(cli, ["build", input, "-o", path.join(tmp, "out.prg"), "--json", json,
        "--source-path", sourcePath || input, ...(basicStub ? [] : ["--no-basic-stub"])], { encoding: "utf8" });
      if (run.status !== 0) return { ok: false, error: run.stderr };
      const r = JSON.parse(fs.readFileSync(json, "utf8"));
      if (tamper) tamper(r);
      return r;
    }, "rust");
    app.__src = src;
    app.run("program = parseExpertText(__src)");
    app.document.getElementById("basic-sys-toggle").checked = true;
    const plain = (v) => JSON.parse(JSON.stringify(v));
    const built = plain(await app.run("_vmBuildSegments()"));
    assert.deepEqual(built.segments.map(s => s.address), [0x1000, 0x1100, 0x2000]);
    assert.deepEqual(built.segments[2].bytes, [0xAA, 0xBB]);
    assert.equal(built.sys, 0x1000);

    app.__r = await app.run("_vaBuildPrg()");
    const ranges = (expr) => plain(app.run(`${expr}.mergedOccupied.map(r => [r.start, r.end])`));
    assert.deepEqual(ranges("_vmaMemoryUsage(__r.vma.memory)"), ranges("getMemoryUsage()"));

    app.localStorage.setItem("c64va-vma-engine", "shadow");
    await app.run("_vaBuildPrg()");
    assert.equal(app.run("_vaErrorLog.filter(l => l.includes('vma-shadow')).length"), 0);
    tamper = (r) => { r.memory.deferred[0].end += 4; };
    await app.run("_vaBuildPrg()");
    const log = app.run("_vaErrorLog.filter(l => l.includes('vma-shadow'))");
    assert.equal(log.length, 1);
    assert.match(log[0], /memory: JS/);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

// Rust errors in the app's language: every line that does not compile, tf(key, params) of the key
// vma_build names, the address and the source line ([Rnnn] in the editor's own text).
test("rust engine: every compile error, translated", { skip: !findRustCli() && "no Rust VMA CLI" }, async () => {
  const cli = findRustCli();
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "vma-engine-"));
  try {
    const app = appWith(async (source, baseDir, basicStub) => {
      const input = path.join(tmp, "in.asm");
      fs.writeFileSync(input, source);
      const json = path.join(tmp, "out.json");
      require("node:child_process").spawnSync(cli, ["build", input, "-o", path.join(tmp, "out.prg"), "--json", json,
        ...(basicStub ? [] : ["--no-basic-stub"])], { encoding: "utf8" });
      return JSON.parse(fs.readFileSync(json, "utf8"));
    }, "rust");
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
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

// A Kick project through the Rust engine: vma_build gets the preprocessed text from the startup
// file's folder, its error line goes back to the Kick file:line.
test("rust engine: a Kick project builds its preprocessed text", async () => {
  let seen = null;
  const app = appWith(async (source, baseDir) => {
    seen = { source, baseDir };
    return { ok: false, error: "LDA: invalid operand", line: 2,
      errors: [{ line: 2, message: "LDA: invalid operand", key: "compileInvalidOperand", params: { mnemonic: "LDA" }, address: 0x1000 }] };
  }, "rust");
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

// The compiling dialog's step line (setWorkStep): the engine and file while it builds, the PRG after.
test("the work progress step line names the engine, the file and the PRG", async () => {
  const steps = [];
  const app = appWith(async () => {
    steps.push(app.document.getElementById("work-progress-step").textContent);
    return { ok: true, prg: [0x00, 0x10, 0xEA, 0x60] };
  }, "rust");
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
