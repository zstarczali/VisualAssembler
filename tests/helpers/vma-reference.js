// The JS VMA compiler as a reference: source (Expert text or block JSON) → PRG bytes, the way
// the app builds it (file reloads included). The Rust VMA port is checked against its output.
const fs = require("node:fs");
const path = require("node:path");
const loadApp = require("./load-app");

const repo = path.join(__dirname, "..", "..");

// Mirrors the reload_* commands of lib.rs: the path itself (absolute) or under base dir / samples/ /
// the repo root, then its bare file name there (push_bare_name_fallbacks): a path stored on another
// machine (/Users/…, C:\…, \\?\F:\…) must not depend on the OS the test runs on.
function resolveFile(file, baseDir, exts = []) {
  const name = String(file || "").trim();
  if (!name) return null;
  const bases = [baseDir, path.join(repo, "samples"), repo].filter(Boolean);
  // an absolute path outside the repo (a build folder, another machine) is not part of the corpus
  const inRepo = path.isAbsolute(name) && !path.relative(repo, name).startsWith("..") && !path.isAbsolute(path.relative(repo, name));
  const tries = path.isAbsolute(name) ? (inRepo ? [["", name]] : []) : bases.map(base => [base, name]);
  const bare = name.split(/[\\/]/).pop();
  if (bare && bare !== name) for (const base of bases) tries.push([base, bare]);
  for (const [base, n] of tries) {
    for (const ext of ["", ...exts]) {
      const p = base ? path.join(base, n + ext) : n + ext;
      if (fs.existsSync(p) && fs.statSync(p).isFile()) return p;
    }
  }
  return null;
}

function parseSid(buf) {
  if (buf.length < 128) return { error: "File too short to be a SID file." };
  const magic = buf.subarray(0, 4).toString("latin1");
  if (magic !== "PSID" && magic !== "RSID") return { error: "Not a valid SID file (missing PSID/RSID header)." };
  const be = (o) => (buf[o] << 8) | buf[o + 1];
  const str = (a, b) => { let s = ""; for (let i = a; i < b && buf[i]; i++) s += String.fromCharCode(buf[i]); return s; };
  let data = buf.subarray(be(6));
  let loadAddress = be(8);
  if (loadAddress === 0 && data.length >= 2) { loadAddress = data[0] | (data[1] << 8); data = data.subarray(2); }
  return {
    loadAddress, initAddress: be(10), playAddress: be(12), numSongs: be(14), startSong: be(16),
    title: str(22, 54), author: str(54, 86), copyright: str(86, 118), bytes: Array.from(data)
  };
}

function createReference() {
  const app = loadApp();
  const found = (p) => ({ filePath: p, fileName: path.basename(p) });
  app.electronAPI = {
    reloadIncBinFile: async (file, baseDir) => {
      const p = resolveFile(file, baseDir);
      return p ? { ...found(p), bytes: Array.from(fs.readFileSync(p)) } : { error: `File not found: ${file}` };
    },
    reloadSidFile: async (file, baseDir) => {
      const p = resolveFile(file, baseDir);
      return p ? { ...parseSid(fs.readFileSync(p)), ...found(p) } : { error: `File not found: ${file}` };
    },
    reloadIncludeFile: async (file, baseDir) => {
      const p = resolveFile(file, baseDir, [".json", ".asm", ".inc", ".s"]);
      if (!p) return { error: `File not found: ${file}` };
      const raw = fs.readFileSync(p, "utf8");
      if (p.toLowerCase().endsWith(".json")) return { ...found(p), blocks: JSON.parse(raw).program || [] };
      return { ...found(p), text: raw };
    }
  };

  // opts: { text } (Expert source) or { blocks } (block program), baseDir, basicStub (default true).
  async function compile(opts) {
    app.__opts = opts;
    app.document.getElementById("basic-sys-toggle").checked = opts.basicStub !== false;
    app.run(`(() => {
      const o = __opts;
      program = o.text != null ? parseExpertText(o.text) : collapseLoadedProgram(structuredClone(o.blocks));
      if (o.text != null) _addSrcLineToBlocks(o.text, program);
    })()`);
    const base = opts.baseDir ? opts.baseDir + path.sep : "";
    await app.run(`(async () => {
      await reloadIncludeBlocks(${JSON.stringify(base)});
      await reloadIncBinBlocks(${JSON.stringify(base)});
      await reloadSidBlocks(${JSON.stringify(base)});
    })()`);
    return app.run(`(() => {
      parseUserMacros();
      const r = _buildAutostartPrgCore();
      // opts.debugSource: the debugger files too, the main source named so in the .dbg
      const debug = r.ok && __opts.debugSource ? _buildDebuggerSidecarPayload(r, { force: true, sourcePath: __opts.debugSource }) : null;
      // opts.memory: what the memory panel reads (getMemoryUsage), as vma_build's \`memory\`
      let memory = null;
      if (r.ok && __opts.memory) {
        const layout = getProgramLayout();
        memory = {
          code: program.length && layout.start <= layout.end ? [layout.start, layout.end] : null,
          regions: _memoryCodeRegions(layout).map(g => [g.address, g.end]),
          deferred: getDeferredMemorySections(layout).map(s => ({ type: s.type, address: s.address, end: s.end, sourceAddress: s.sourceAddress, label: s.label }))
        };
      }
      return {
        ok: !!r.ok,
        error: r.ok ? "" : String(r.error || (r.errors || []).map(e => e.message || e).join("; ") || "error"),
        bytes: r.ok && r.bytes ? Array.from(r.bytes) : null,
        debug,
        memory
      };
    })()`);
  }

  // Block program → Expert text (the Rust compiler's input in Block mode).
  function blocksToText(blocks) {
    app.__blocks = blocks;
    return app.run(`collapseLoadedProgram(structuredClone(__blocks)).map(_blockToExpertSourceLine).join("\\n")`);
  }

  return { app, compile, blocksToText };
}

module.exports = { createReference, resolveFile, parseSid, repo };
