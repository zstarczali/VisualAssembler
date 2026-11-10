// The VMA compiler (Rust, github.com/zstarczali/VMA) for the tests, through its CLI: the app's
// vma_build / vma_analyze commands (useVmaCli(app) puts them on app.electronAPI) and a direct
// compile. The CLI: VMA_BIN, or <VMA_DIR, default ../VMA>/target/{release,debug}/vma[.exe]; without
// it the tests that need it skip (vmaCli() === null).
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const repo = path.join(__dirname, "..", "..");

function vmaDir() {
  return process.env.VMA_DIR || path.join(repo, "..", "VMA");
}

function vmaCli() {
  const exe = process.platform === "win32" ? "vma.exe" : "vma";
  const candidates = [process.env.VMA_BIN, ...["release", "debug"].map(p => path.join(vmaDir(), "target", p, exe))];
  return candidates.find(p => p && fs.existsSync(p)) || null;
}

// One CLI run: the source into a temp folder, the answer back. `analyze`: vma::analyze (the
// listing too), otherwise vma_build. Files resolve as in the app: the in-memory assets first,
// then the base dir, samples/ and the repo root.
function runCli({ source, baseDir = "", basicStub = true, sourcePath = null, lineMap = null, raw = false, assets = null, analyze = false }) {
  const cli = vmaCli();
  if (!cli) throw new Error("no Rust VMA CLI (VMA_BIN, or cargo build in ../VMA)");
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "vma-test-"));
  try {
    const input = path.join(tmp, "program.asm");
    const json = path.join(tmp, "answer.json");
    fs.writeFileSync(input, String(source ?? ""));
    const bases = [];
    if (assets && Object.keys(assets).length) {
      const dir = path.join(tmp, "assets");
      fs.mkdirSync(dir);
      for (const [name, bytes] of Object.entries(assets)) fs.writeFileSync(path.join(dir, name), Buffer.from(bytes));
      bases.push(dir);
    }
    bases.push(baseDir || tmp, path.join(repo, "samples"), repo);
    const args = ["build", input, "-o", path.join(tmp, "out.prg"), "--base-dir", bases[0]];
    for (const b of bases.slice(1)) args.push("--search", b);
    if (!basicStub) args.push("--no-basic-stub");
    if (raw) args.push("--raw");
    args.push(analyze ? "--analyze" : "--json", json);
    if (sourcePath && !raw) args.push("--source-path", sourcePath);
    if (lineMap && !raw) {
      fs.writeFileSync(path.join(tmp, "map.json"), JSON.stringify(lineMap));
      args.push("--line-map", path.join(tmp, "map.json"));
    }
    const run = spawnSync(cli, args, { encoding: "utf8" });
    if (!fs.existsSync(json)) return { ok: false, error: (run.stderr || String(run.error || "")).trim(), errors: [] };
    return JSON.parse(fs.readFileSync(json, "utf8"));
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

// A VMA source straight through the CLI: { ok, bytes (the PRG), sysAddress, error, errors, … }.
// `files`: name → text / bytes, found before the base dir (an included library, a test asset).
function compileText(source, { basicStub = true, baseDir = "", raw = false, files = null, sourcePath = null, lineMap = null } = {}) {
  const assets = files && Object.fromEntries(Object.entries(files).map(([n, v]) => [n, typeof v === "string" ? Buffer.from(v, "utf8") : v]));
  const r = runCli({ source, baseDir, basicStub, raw, assets, sourcePath, lineMap, analyze: !raw });
  if (r.ok) r.bytes = Uint8Array.from(r.prg);
  else r.error = r.error || (r.errors || []).map(e => e.message).join("; ");
  return r;
}

// A built PRG in a 64K memory: { mem, load, end }.
function loadPrg(bytes) {
  const mem = new Uint8Array(0x10000);
  const load = bytes[0] | (bytes[1] << 8);
  mem.set(Array.from(bytes).slice(2), load);
  return { mem, load, end: load + bytes.length - 2 };
}

// The bytes one source `line` makes at `org` (no BASIC stub): from `org` to the `__end` label after
// it; `before` / `after`: further source around it (constants, the labels it names).
function codeOf(line, { org = 0xC000, before = "", after = "", files = null } = {}) {
  const src = `${before}\n* = $${org.toString(16)}\n${line}\n__end:\n${after}\n`;
  const r = compileText(src, { basicStub: false, files });
  if (!r.ok) throw new Error(r.error);
  const end = labelOf(r, "__end");
  const { mem, load } = loadPrg(r.bytes);
  if (load !== org) throw new Error(`load address $${load.toString(16)}`);
  return Array.from(mem.subarray(org, end));
}

// A label's address in a compileText answer.
function labelOf(r, name) {
  const labels = r.labels || {};
  const v = Array.isArray(labels) ? labels.find(l => l[0] === name || l.name === name) : labels[name];
  if (v == null) throw new Error(`no label ${name}`);
  return typeof v === "number" ? v : Array.isArray(v) ? v[1] : v.address;
}

// The app's Tauri commands, as tauri-bridge.js calls them.
function useVmaCli(app) {
  const api = app.electronAPI || {};
  api.vmaBuild = async (source, baseDir, basicStub, sourcePath = null, lineMap = null, raw = false) =>
    runCli({ source, baseDir, basicStub: basicStub !== false, sourcePath, lineMap, raw: !!raw });
  api.vmaAnalyze = async (source, baseDir, basicStub, sourcePath = null, lineMap = null, assets = null) =>
    runCli({ source, baseDir, basicStub: basicStub !== false, sourcePath, lineMap, assets, analyze: true });
  app.electronAPI = api;
  if (app.window) app.window.electronAPI = api;
  return app;
}

// The app's own build (_vmaRustBuild: the Block program, or the Expert / project source) through the CLI.
async function buildApp(app, kick = null) {
  useVmaCli(app);
  app.__vmaKick = kick;
  const r = await app.run("_vmaRustBuild(__vmaKick)");
  if (r.ok) r.bytes = Uint8Array.from(r.bytes);
  return r;
}

// The app's analysis (_vmaAnalyze) of a VMA text, or of the editor's program (`input` omitted).
async function analyzeApp(app, text = null, { basicStub = true, baseDir = "" } = {}) {
  useVmaCli(app);
  app.__vmaText = text;
  app.__vmaOpts = { basicStub, baseDir };
  return app.run("__vmaText == null ? _vmaAnalyze(_vmaEditorInput(), __vmaOpts.basicStub) : _vmaAnalyze(_vmaTextInput(__vmaText, __vmaOpts.baseDir), __vmaOpts.basicStub)");
}

// A test that needs the CLI: skipped without it.
function vmaTest(name, fn) {
  const test = require("node:test");
  return test(name, { skip: vmaCli() ? false : "no Rust VMA CLI (VMA_BIN, or cargo build in ../VMA)" }, fn);
}

module.exports = { repo, vmaDir, vmaCli, runCli, compileText, loadPrg, codeOf, labelOf, useVmaCli, buildApp, analyzeApp, vmaTest };
