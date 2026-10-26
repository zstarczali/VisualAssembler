#!/usr/bin/env node
// Shadow check outside the app: the JS VMA compiler and the Rust CLI over real projects.
//   node scripts/vma-shadow-scan.js <path>…   (.proj / .asm / .json files or folders, searched for .proj)
// A VMA project builds its startup file (without one: every .asm / .json of it), a Kick project
// (`kick: true`) the _kickPreprocess text of its startup file; UltimateBasic / ACME projects are
// skipped. Each source is built with and without the BASIC stub; the first byte difference is reported.
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { createReference, repo } = require("../tests/helpers/vma-reference");
const { findRustCli, runRustCli, firstDiff } = require("../tests/helpers/vma-rust");

const args = process.argv.slice(2);
if (!args.length) {
  console.error("usage: node scripts/vma-shadow-scan.js <.proj | .asm | .json | folder>…");
  process.exit(2);
}
const cli = findRustCli();
if (!cli) {
  console.error("no Rust VMA CLI (cargo build in crates/vma, or VMA_BIN)");
  process.exit(2);
}

const SKIP_DIRS = new Set(["node_modules", ".git", "target", "out", "build", "dist"]);
function findProjects(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) findProjects(path.join(dir, entry.name), out);
    } else if (entry.name.endsWith(".proj")) out.push(path.join(dir, entry.name));
  }
  return out;
}

const projFiles = (nodes) => (nodes || []).flatMap(n => (n.type === "folder" ? projFiles(n.children) : [n]));
// a source the app saved as a VA payload ({"expertText": …}) reads as its text, like an open tab
const readText = (p) => {
  let text;
  try { text = fs.readFileSync(p, "utf8"); } catch { return null; }
  if (text.trimStart().startsWith("{")) {
    try {
      const payload = JSON.parse(text);
      if (typeof payload.expertText === "string") return payload.expertText;
    } catch { /* a plain source */ }
  }
  return text;
};
const readBin = (p) => { try { return new Uint8Array(fs.readFileSync(p)); } catch { return null; } };

// The sources to build: { name, text | blocks, baseDir }
function sourcesOf(file, ref) {
  const ext = path.extname(file).toLowerCase();
  const dir = path.dirname(file);
  if (ext === ".asm" || ext === ".s" || ext === ".inc") return [{ name: file, text: readText(file), baseDir: dir }];
  if (ext === ".json") {
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    return Array.isArray(data.program) ? [{ name: file, blocks: data.program, baseDir: dir }] : [];
  }
  if (ext !== ".proj") return [];
  const proj = JSON.parse(fs.readFileSync(file, "utf8"));
  if (proj.app === "ultimate-basic" || proj.assemblerSyntax === "acme") return [];
  const abs = (p) => (path.isAbsolute(p) ? p : path.join(dir, p));
  if (proj.kick) {
    const entry = abs(proj.startupFile || "main.asm").split(path.sep).join("/");
    ref.app.__kick = { entry, defines: proj.kickDefines || [], vars: proj.kickVars || {} };
    ref.app.__readText = readText;
    ref.app.__readBin = readBin;
    const pre = ref.app.run("_kickPreprocess(__kick.entry, __readText, __readBin, { defines: __kick.defines, vars: __kick.vars })");
    if (!pre.ok) return [{ name: `${file} (Kick)`, error: pre.errors.map(e => `${e.file}:${e.line} ${e.text}`).join("; ") }];
    // the extra outputs (.file / .disk segments) are images without a stub (_kickBuildOutput)
    const outputs = (pre.outputs || []).filter(o => o.text != null)
      .map(o => ({ name: `${file} (Kick output ${o.name})`, text: o.text, baseDir: path.dirname(entry), raw: true }));
    return [{ name: `${file} (Kick)`, text: pre.text, baseDir: path.dirname(entry) }, ...outputs];
  }
  const files = proj.startupFile
    ? [abs(proj.startupFile)]
    : projFiles(proj.files).map(f => abs(f.path)).filter(p => /\.(asm|json)$/i.test(p));
  return files.filter(p => fs.existsSync(p)).flatMap(p => sourcesOf(p, ref).map(s => ({ ...s, name: `${file} → ${path.basename(p)}` })));
}

(async () => {
  const ref = createReference();
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "vma-shadow-"));
  const targets = args.flatMap(a => (fs.statSync(a).isDirectory() ? findProjects(path.resolve(a)) : [path.resolve(a)]));
  const counts = { match: 0, diff: 0, "both-error": 0, "js-only-error": 0, "rust-only-error": 0, skipped: 0 };
  try {
    for (const target of targets) {
      let sources;
      try {
        sources = sourcesOf(target, ref);
      } catch (e) {
        console.log(`skip  ${target}: ${e.message}`);
        counts.skipped++;
        continue;
      }
      if (!sources.length) {
        console.log(`skip  ${target}`);
        counts.skipped++;
        continue;
      }
      for (const src of sources) {
        if (src.error) {
          console.log(`skip  ${src.name}: ${src.error}`);
          counts.skipped++;
          continue;
        }
        const text = src.text ?? ref.blocksToText(src.blocks);
        for (const basicStub of src.raw ? [false] : [true, false]) {
          const id = `${src.name}${basicStub || src.raw ? "" : " @nostub"}`;
          const js = await ref.compile({ ...(src.text != null ? { text: src.text } : { blocks: src.blocks }), baseDir: src.baseDir, basicStub, raw: !!src.raw });
          const rust = runRustCli(cli, { caseId: "shadow", id: "shadow", input: text, baseDir: path.relative(repo, src.baseDir) || ".", basicStub }, tmp);
          if (!js.ok || !rust.ok) {
            const kind = !js.ok && !rust.ok ? "both-error" : !js.ok ? "js-only-error" : "rust-only-error";
            counts[kind]++;
            console.log(`${kind.padEnd(15)} ${id}\n    js:   ${js.ok ? "ok" : js.error}\n    rust: ${rust.ok ? "ok" : rust.error.split("\n")[0]}`);
            continue;
          }
          const at = firstDiff(rust.bytes, js.bytes);
          if (at < 0) {
            counts.match++;
            console.log(`match           ${id} (${js.bytes.length} bytes)`);
          } else {
            counts.diff++;
            console.log(`DIFF            ${id}: ${rust.bytes.length} vs ${js.bytes.length} bytes, first difference at offset ${at} ($${at.toString(16)})`);
          }
        }
      }
    }
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  console.log("\n" + Object.entries(counts).filter(([, n]) => n).map(([k, n]) => `${k} ${n}`).join(", "));
  process.exit(counts.diff || counts["rust-only-error"] || counts["js-only-error"] ? 1 : 0);
})();
