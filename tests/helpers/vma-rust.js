// Runs the Rust VMA CLI over golden cases (tests/vma-golden.test.js, scripts/vma-rust-report.js).
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { repo } = require("./vma-reference");

// The VMA compiler's repository (github.com/zstarczali/VMA): VMA_DIR, or ../VMA next to this one.
function vmaDir() {
  return process.env.VMA_DIR || path.join(repo, "..", "VMA");
}

// VMA_BIN, or <VMA_DIR>/target/{release,debug}/vma[.exe]
function findRustCli() {
  const exe = process.platform === "win32" ? "vma.exe" : "vma";
  const candidates = [process.env.VMA_BIN, ...["release", "debug"].map(p => path.join(vmaDir(), "target", p, exe))];
  return candidates.find(p => p && fs.existsSync(p)) || null;
}

// One case through the CLI: { ok, bytes } or { ok: false, error }.
function runRustCli(cli, c, tmp) {
  const input = path.join(tmp, c.caseId + ".asm");
  const output = path.join(tmp, c.id.replace("@", "_") + ".prg");
  fs.writeFileSync(input, c.input);
  fs.rmSync(output, { force: true });
  const args = ["build", input, "-o", output, "--base-dir", path.join(repo, c.baseDir),
    "--search", path.join(repo, "samples"), "--search", repo, ...(c.raw ? ["--raw"] : c.basicStub ? [] : ["--no-basic-stub"])];
  const run = cli.endsWith(".js")
    ? spawnSync(process.execPath, [cli, ...args], { encoding: "utf8" })
    : spawnSync(cli, args, { encoding: "utf8" });
  if (run.status !== 0 || !fs.existsSync(output)) return { ok: false, error: (run.stderr || run.error || "").toString().trim() };
  return { ok: true, bytes: fs.readFileSync(output) };
}

const firstDiff = (a, b) => {
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) if (a[i] !== b[i]) return i;
  return a.length === b.length ? -1 : n;
};

// "match" | "diff" | "unsupported" | "error" | "expected-error" | "missed-error"
function compareCase(c, run) {
  if (!c.ok) return run.ok ? { status: "missed-error" } : { status: "expected-error" };
  if (!run.ok) return { status: /not supported by the Rust VMA compiler yet/.test(run.error) ? "unsupported" : "error", detail: run.error };
  const at = firstDiff(run.bytes, c.bytes);
  return at < 0
    ? { status: "match" }
    : { status: "diff", detail: `${run.bytes.length} vs ${c.size} bytes, first difference at offset ${at} ($${at.toString(16)})` };
}

module.exports = { vmaDir, findRustCli, runRustCli, firstDiff, compareCase };
