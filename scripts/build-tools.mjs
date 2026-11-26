#!/usr/bin/env node
// Builds the command line tools bundled with the app into tools/<name>/:
//   tools/oscar64/bin/oscar64[.exe] + tools/oscar64/include/   (Oscar64 looks for include/ next to bin/)
//   tools/acme/bin/acme[.exe]
// Usage: node scripts/build-tools.mjs [--target <rust triple>] [--only oscar64|acme]
// Oscar64 on Windows: the official release build; elsewhere built from the same tag (c++).
// ACME is built from source everywhere; Windows needs the MSVC environment (cl, for arm64 amd64_arm64).
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const OSCAR64_TAG = "v1.32.273";
const OSCAR64_REPO = "https://github.com/drmortalwombat/oscar64.git";
const OSCAR64_RELEASE = `https://github.com/drmortalwombat/oscar64/releases/download/${OSCAR64_TAG}`;
const OSCAR64_RAW = `https://raw.githubusercontent.com/drmortalwombat/oscar64/${OSCAR64_TAG}`;
const ACME_SVN = "https://svn.code.sf.net/p/acme-crossass/code-0/!svn/bc/517/trunk";
const ACME_SOURCES = ["acme", "alu", "cliargs", "cpu", "dynabuf", "encoding", "flow", "global", "input", "macro",
  "mnemo", "output", "platform", "pseudoopcodes", "section", "symbol", "tree", "typesystem"];
const ACME_HEADERS = ["_amiga.h", "_dos.c", "_dos.h", "_riscos.c", "_riscos.h", "_std.c", "_std.h", "config.h", "version.h"];

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const argValue = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : ""; };
const target = argValue("--target") || "";
const only = argValue("--only");
const win = target ? target.includes("windows") : process.platform === "win32";
const mac = target ? target.includes("apple") : process.platform === "darwin";
const exe = win ? ".exe" : "";
const macArch = target.startsWith("x86_64") ? "x86_64" : target.startsWith("aarch64") ? "arm64" : "";
const native = !target || (target.startsWith("aarch64") ? os.arch() === "arm64" : os.arch() === "x64");
const toolsDir = path.join(root, "tools");
const work = fs.mkdtempSync(path.join(os.tmpdir(), "va-tools-"));

const run = (cmd, cmdArgs, cwd) => {
  console.log(`> ${cmd} ${cmdArgs.join(" ")}`);
  execFileSync(cmd, cmdArgs, { cwd, stdio: "inherit" });
};

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const src = path.join(from, entry.name);
    const dst = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(src, dst);
    else fs.copyFileSync(src, dst);
  }
}

function finishBinary(file) {
  if (!win) fs.chmodSync(file, 0o755);
  // Apple silicon only runs signed code; an ad-hoc signature seals it inside the app.
  if (mac) run("codesign", ["-s", "-", "-f", file]);
}

function cc(lang, sources, out, cwd) {
  if (win) {
    const flags = ["/nologo", "/O2", "/DNDEBUG", "/D_CONSOLE", "/D_CRT_SECURE_NO_WARNINGS"];
    if (lang === "c++") flags.push("/EHsc", "/std:c++17");
    run("cl", [...flags, ...sources, `/Fe:${out}`], cwd);
    return;
  }
  const flags = ["-O2", ...(mac && macArch ? ["-arch", macArch] : [])];
  if (lang === "c++") {
    run("c++", [...flags, "-std=c++17", "-Wno-switch", ...sources, "-o", out, "-lpthread", ...(mac ? [] : ["-lrt"])], cwd);
  } else {
    run("cc", [...flags, ...sources, "-o", out, "-lm"], cwd);
  }
}

async function buildOscar64() {
  const dest = path.join(toolsDir, "oscar64");
  fs.rmSync(dest, { recursive: true, force: true });
  fs.mkdirSync(path.join(dest, "bin"), { recursive: true });
  const out = path.join(dest, "bin", "oscar64" + exe);
  let src;
  if (win) {
    // the official Windows build of the release (x64; Windows on Arm runs it emulated)
    const zip = path.join(work, "oscar64.zip");
    fs.writeFileSync(zip, await fetchText(`${OSCAR64_RELEASE}/oscar64.zip`));
    // the system bsdtar reads zip (a Git for Windows tar on the PATH does not)
    run(path.join(process.env.SystemRoot || "C:\\Windows", "System32", "tar.exe"), ["-xf", zip, "-C", work], work);
    src = path.join(work, "oscar64");
    fs.copyFileSync(path.join(src, "bin", "oscar64.exe"), out);
    fs.writeFileSync(path.join(dest, "LICENSE"), await fetchText(`${OSCAR64_RAW}/LICENSE`));
  } else {
    src = path.join(work, "oscar64");
    fs.mkdirSync(src);
    run("git", ["init", "-q"], src);
    run("git", ["fetch", "-q", "--depth", "1", OSCAR64_REPO, `refs/tags/${OSCAR64_TAG}`], src);
    run("git", ["checkout", "-q", "FETCH_HEAD"], src);
    const sources = fs.readdirSync(path.join(src, "oscar64")).filter((f) => f.endsWith(".cpp")).map((f) => path.join("oscar64", f));
    cc("c++", sources, out, src);
    fs.copyFileSync(path.join(src, "LICENSE"), path.join(dest, "LICENSE"));
  }
  finishBinary(out);
  copyDir(path.join(src, "include"), path.join(dest, "include"));
  // first line = the version the About box shows
  fs.writeFileSync(path.join(dest, "VERSION"), `${OSCAR64_TAG.replace(/^v/, "")}\n${OSCAR64_REPO} ${OSCAR64_TAG}\n`);
  if (native) {
    fs.writeFileSync(path.join(work, "hello.c"), "#include <stdio.h>\nint main(void) { printf(\"HELLO\\n\"); return 0; }\n");
    run(out, ["-n", `-o=${path.join(work, "hello.prg")}`, path.join(work, "hello.c")], work);
    const prg = fs.readFileSync(path.join(work, "hello.prg"));
    if (prg[0] !== 0x01 || prg[1] !== 0x08) throw new Error("oscar64 smoke test: not a $0801 PRG");
  }
}

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function buildAcme() {
  const src = path.join(work, "acme");
  fs.mkdirSync(src);
  const files = [...ACME_SOURCES.flatMap((n) => [`${n}.c`, `${n}.h`]), ...ACME_HEADERS];
  for (const file of files) fs.writeFileSync(path.join(src, file), await fetchText(`${ACME_SVN}/src/${file}`));
  const dest = path.join(toolsDir, "acme");
  fs.rmSync(dest, { recursive: true, force: true });
  fs.mkdirSync(path.join(dest, "bin"), { recursive: true });
  const out = path.join(dest, "bin", "acme" + exe);
  cc("c", ACME_SOURCES.map((n) => `${n}.c`), out, src);
  finishBinary(out);
  fs.writeFileSync(path.join(dest, "COPYING"), await fetchText(`${ACME_SVN}/docs/COPYING`));
  const release = /#define RELEASE\s+"([^"]+)"/.exec(fs.readFileSync(path.join(src, "version.h"), "utf8"))?.[1] || "?";
  fs.writeFileSync(path.join(dest, "VERSION"), `${release}\n${ACME_SVN}\n`);
  if (native) {
    fs.writeFileSync(path.join(work, "t.a"), "* = $c000\n!byte $a5, $5a\n");
    run(out, ["-f", "cbm", "-o", path.join(work, "t.prg"), path.join(work, "t.a")], work);
    const prg = fs.readFileSync(path.join(work, "t.prg"));
    if (prg.length !== 4 || prg[1] !== 0xC0 || prg[2] !== 0xA5) throw new Error("acme smoke test failed");
  }
}

try {
  if (!only || only === "oscar64") await buildOscar64();
  if (!only || only === "acme") await buildAcme();
  console.log(`tools built into ${toolsDir}`);
} finally {
  fs.rmSync(work, { recursive: true, force: true });
}
