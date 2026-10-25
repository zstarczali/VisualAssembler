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
  assert.match(bad.errors[0].text, /^\[R003\] LDA: invalid operand/);
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
