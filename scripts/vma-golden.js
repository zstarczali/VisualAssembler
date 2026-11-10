#!/usr/bin/env node
// VMA golden corpus: tests/vma-golden/cases.js built by the VMA compiler (the Rust CLI) and pinned
// in tests/vma-golden/manifest.json: the size + sha256 of every PRG and of its debugger files
// (.sym / .vs / .dbg), or that the case fails.
//   node scripts/vma-golden.js [filter]       check the corpus against the manifest (filter: part of the id)
//   node scripts/vma-golden.js --update       rewrite the manifest (after a deliberate change)
//   node scripts/vma-golden.js --inputs D     write each case's VMA source to D/<id>.asm
// The CLI: VMA_BIN, or <VMA_DIR, default ../VMA>/target/{release,debug}/vma[.exe].
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const crypto = require("node:crypto");
const { spawnSync } = require("node:child_process");
const loadApp = require("../tests/helpers/load-app");
const { repo, vmaCli } = require("../tests/helpers/vma-cli");
const { allCases } = require("../tests/vma-golden/cases");

const manifestPath = path.join(repo, "tests", "vma-golden", "manifest.json");
const sha256 = (bytes) => crypto.createHash("sha256").update(Buffer.from(bytes)).digest("hex");

// Every case in both PRG forms the app makes: with the BASIC SYS stub (Run) and without; a `raw`
// case (a Kick project's extra output) once, as the image alone ("@raw"). Block programs as the
// Expert text the app hands the compiler.
function buildCorpus() {
  const app = loadApp();
  app.run("var __goldenText = (blocks) => collapseLoadedProgram(structuredClone(blocks)).map(_blockToExpertSourceLine).join('\\n')");
  const out = [];
  for (const c of allCases(app)) {
    app.__blocks = c.blocks;
    const input = c.kind === "blocks" ? app.run("__goldenText(__blocks)") : c.text;
    for (const basicStub of c.raw ? [false] : [true, false]) {
      out.push({
        id: c.id + (c.raw ? "@raw" : basicStub ? "" : "@nostub"), caseId: c.id, kind: c.kind, file: c.file || null,
        baseDir: path.relative(repo, c.baseDir).split(path.sep).join("/"), basicStub, ...(c.raw ? { raw: true } : {}), input
      });
    }
  }
  return out;
}

// The debugger files name the source (`--source-path`) and the files it includes: machine
// independent with the repository as "<repo>".
function stableText(text) {
  const forward = repo.split(path.sep).join("/");
  return text.split(repo).join("<repo>").split(forward).join("<repo>").replace(/\r\n/g, "\n");
}

// One case through the CLI: { ok, error, bytes, size, sha256, debug: { sym, vs, dbg } (sha256) }.
function runCase(cli, c, tmp) {
  const input = path.join(tmp, c.caseId + ".asm");
  const out = path.join(tmp, "out");
  fs.writeFileSync(input, c.input);
  for (const ext of ["prg", "sym", "vs", "dbg"]) fs.rmSync(`${out}.${ext}`, { force: true });
  const args = ["build", input, "-o", out + ".prg", "--base-dir", path.join(repo, c.baseDir),
    "--search", path.join(repo, "samples"), "--search", repo];
  if (c.raw) args.push("--raw");
  else {
    if (!c.basicStub) args.push("--no-basic-stub");
    args.push("--debug", "--source-path", c.caseId + ".asm");
  }
  const run = spawnSync(cli, args, { encoding: "utf8" });
  if (run.status !== 0 || !fs.existsSync(out + ".prg")) {
    return { ok: false, error: (run.stderr || String(run.error || "")).replace(/^.*?\.asm:/gm, "").replace(/\s+/g, " ").trim() };
  }
  const bytes = fs.readFileSync(out + ".prg");
  const debug = c.raw ? null : Object.fromEntries(["sym", "vs", "dbg"].map(ext => [ext, sha256(stableText(fs.readFileSync(`${out}.${ext}`, "utf8")))]));
  return { ok: true, bytes, size: bytes.length, sha256: sha256(bytes), ...(debug ? { debug } : {}) };
}

const entryOf = (c, r) => {
  const { input, ...meta } = c;
  return { ...meta, ok: r.ok, size: r.ok ? r.size : 0, sha256: r.ok ? r.sha256 : null, ...(r.debug ? { debug: r.debug } : {}), error: r.ok ? null : r.error };
};

// The corpus against the manifest: { entries, diffs: [{ id, what }] }.
function checkCorpus(cli, corpus, manifest) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "vma-golden-"));
  const entries = [];
  const diffs = [];
  try {
    for (const c of corpus) {
      const r = runCase(cli, c, tmp);
      const e = entryOf(c, r);
      entries.push(e);
      const m = manifest?.get(c.id);
      if (!manifest) continue;
      if (!m) diffs.push({ id: c.id, what: "not in the manifest" });
      else if (m.ok !== e.ok) diffs.push({ id: c.id, what: e.ok ? "builds now" : `fails now: ${e.error}` });
      else if (e.ok && m.sha256 !== e.sha256) diffs.push({ id: c.id, what: `PRG changed (${e.size} vs ${m.size} bytes)` });
      else if (e.ok && m.debug) {
        for (const ext of ["sym", "vs", "dbg"]) if (m.debug[ext] !== e.debug?.[ext]) diffs.push({ id: c.id, what: `.${ext} changed` });
      }
    }
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  return { entries, diffs };
}

const readManifest = () => new Map(JSON.parse(fs.readFileSync(manifestPath, "utf8")).map(e => [e.id, e]));

// Windows: an editor or indexer can hold the manifest for a moment (UNKNOWN / EBUSY) — try again.
function writeRetrying(file, text) {
  for (let attempt = 0; ; attempt++) {
    try {
      fs.writeFileSync(file, text);
      return;
    } catch (e) {
      if (attempt >= 40 || !["UNKNOWN", "EBUSY", "EPERM"].includes(e.code)) throw e;
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 250);
    }
  }
}

function main() {
  const args = process.argv.slice(2);
  let corpus = buildCorpus();
  const inputsAt = args.indexOf("--inputs");
  if (inputsAt >= 0) {
    const dir = path.resolve(args[inputsAt + 1] || "vma-golden-inputs");
    fs.mkdirSync(dir, { recursive: true });
    const inputs = corpus.filter(e => e.basicStub || e.raw);
    for (const c of inputs) fs.writeFileSync(path.join(dir, c.caseId + ".asm"), c.input);
    console.log(`${inputs.length} inputs → ${dir}`);
    return;
  }
  const cli = vmaCli();
  if (!cli) {
    console.error("no VMA CLI: cargo build in the VMA repository (VMA_DIR, default ../VMA), or set VMA_BIN");
    process.exitCode = 2;
    return;
  }
  if (args.includes("--update")) {
    const { entries } = checkCorpus(cli, corpus, null);
    writeRetrying(manifestPath, JSON.stringify(entries, null, 1) + "\n");
    console.log(`manifest: ${entries.length} entries, ${entries.filter(e => e.ok).length} PRG`);
    return;
  }
  const filter = args.find(a => !a.startsWith("--")) || "";
  corpus = corpus.filter(c => c.id.includes(filter));
  const manifest = readManifest();
  const { diffs } = checkCorpus(cli, corpus, manifest);
  if (!filter) for (const id of manifest.keys()) if (!corpus.some(c => c.id === id)) diffs.push({ id, what: "no longer a case" });
  for (const d of diffs) console.log(`${d.id}: ${d.what}`);
  console.log(diffs.length ? `${diffs.length} changed (run with --update if intended)` : `${corpus.length} cases match the manifest`);
  process.exitCode = diffs.length ? 1 : 0;
}

module.exports = { buildCorpus, checkCorpus, readManifest, sha256, manifestPath };
if (require.main === module) main();
