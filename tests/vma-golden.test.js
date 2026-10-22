// VMA golden corpus (scripts/vma-golden.js): the JS compiler output is pinned in
// tests/vma-golden/manifest.json, and the Rust VMA CLI must build the same PRG bytes.
// Rust CLI: VMA_BIN, or src-tauri/target/{release,debug}/vma[.exe]; without it that test skips.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { buildCorpus, sha256, manifestPath } = require("../scripts/vma-golden");
const { repo } = require("./helpers/vma-reference");

const corpusPromise = buildCorpus();

function findRustCli() {
  const exe = process.platform === "win32" ? "vma.exe" : "vma";
  const candidates = [process.env.VMA_BIN, ...["release", "debug"].map(p => path.join(repo, "src-tauri", "target", p, exe))];
  return candidates.find(p => p && fs.existsSync(p)) || null;
}

const firstDiff = (a, b) => {
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) if (a[i] !== b[i]) return i;
  return a.length === b.length ? -1 : n;
};

test("the JS VMA compiler still matches the golden manifest", async () => {
  const corpus = await corpusPromise;
  const manifest = new Map(JSON.parse(fs.readFileSync(manifestPath, "utf8")).map(e => [e.id, e]));
  assert.equal(corpus.length, manifest.size, "case list changed: node scripts/vma-golden.js --update");
  for (const c of corpus) {
    const m = manifest.get(c.id);
    assert.ok(m, `${c.id} missing from manifest`);
    assert.equal(c.ok, m.ok, `${c.id}: ${c.error || "now builds"}`);
    if (c.ok) assert.equal(c.sha256, m.sha256, `${c.id}: PRG changed (${c.size} vs ${m.size} bytes)`);
  }
});

// Block mode will hand the Rust compiler Expert text, so Block → text must not lose anything.
test("block programs build the same PRG through their Expert text", async () => {
  const { createReference } = require("./helpers/vma-reference");
  const ref = createReference();
  const corpus = (await corpusPromise).filter(c => c.kind === "blocks" && c.ok);
  assert.ok(corpus.length > 40);
  for (const c of corpus) {
    const r = await ref.compile({ text: c.input, baseDir: path.join(repo, c.baseDir), basicStub: c.basicStub });
    assert.equal(r.ok, true, `${c.id}: ${r.error}`);
    assert.equal(sha256(r.bytes), c.sha256, `${c.id}: Expert text differs from blocks at byte ${firstDiff(r.bytes, c.bytes)}`);
  }
});

test("the Rust VMA CLI builds every golden case byte for byte", async (t) => {
  const cli = findRustCli();
  if (!cli) { t.skip("no Rust VMA CLI (set VMA_BIN or build src-tauri --bin vma)"); return; }
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "vma-golden-"));
  const failures = [];
  try {
    for (const c of await corpusPromise) {
      const input = path.join(tmp, c.caseId + ".asm");
      const output = path.join(tmp, c.id.replace("@", "_") + ".prg");
      fs.writeFileSync(input, c.input);
      fs.rmSync(output, { force: true });
      const args = ["build", input, "-o", output, "--base-dir", path.join(repo, c.baseDir),
        "--search", path.join(repo, "samples"), "--search", repo, ...(c.basicStub ? [] : ["--no-basic-stub"])];
      const run = cli.endsWith(".js")
        ? spawnSync(process.execPath, [cli, ...args], { encoding: "utf8" })
        : spawnSync(cli, args, { encoding: "utf8" });
      if (!c.ok) {
        if (run.status === 0) failures.push(`${c.id}: expected an error (${c.error}), built a PRG`);
        continue;
      }
      if (run.status !== 0 || !fs.existsSync(output)) { failures.push(`${c.id}: ${(run.stderr || run.error || "").toString().trim()}`); continue; }
      const got = fs.readFileSync(output);
      const at = firstDiff(got, c.bytes);
      if (at >= 0) failures.push(`${c.id}: ${got.length} vs ${c.size} bytes, first difference at offset ${at} ($${at.toString(16)})`);
    }
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  assert.deepEqual(failures, []);
});
