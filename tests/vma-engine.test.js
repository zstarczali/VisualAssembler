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
