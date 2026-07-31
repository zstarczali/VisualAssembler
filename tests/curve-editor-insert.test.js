const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");

function extractFunctionSource(name) {
  const marker = `function ${name}(`;
  const start = appJs.indexOf(marker);
  assert.notStrictEqual(start, -1, `Missing function ${name}`);
  let depth = 0;
  let end = -1;
  let seenBrace = false;
  for (let i = start; i < appJs.length; i++) {
    const ch = appJs[i];
    if (ch === "{") {
      depth += 1;
      seenBrace = true;
    } else if (ch === "}") {
      depth -= 1;
      if (seenBrace && depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  assert.notStrictEqual(end, -1, `Could not parse function ${name}`);
  return appJs.slice(start, end);
}

function loadFunctions(names, extraContext = {}) {
  const context = { ...extraContext };
  vm.createContext(context);
  for (const name of names) {
    vm.runInContext(`${extractFunctionSource(name)}; this["${name}"] = ${name};`, context);
  }
  return context;
}

test("_cgInsertTagged with the shared key replaces the previous Curve Editor batch", () => {
  const program = [{ text: "user-code" }];
  const ctx = loadFunctions(["_cgInsertTagged"], {
    program,
    exportAsmToBlocks(txt, insertTag) {
      const lines = String(txt).split("\n").filter(Boolean);
      lines.forEach(line => program.push({ text: line, ...(insertTag ? { _cgSource: insertTag } : {}) }));
      return lines.length;
    },
    showViceToast: () => {},
    _cgCloseDialog: () => {},
    t: (key) => key,
    tf: (key, values = {}) => Object.entries(values).reduce(
      (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)), key)
  });

  // First insert: table (2 lines) appended after the user's own block.
  ctx._cgInsertTagged("table_a1\ntable_a2", "curve-editor", "Inserted");
  assert.equal(ctx.program.length, 3);
  assert.deepEqual(ctx.program.map(b => b.text), ["user-code", "table_a1", "table_a2"]);

  // Demo export with the SAME key must remove the standalone table first,
  // otherwise the demo's embedded table copy duplicates the labels.
  ctx._cgInsertTagged("demo_start\ndemo_table\ndemo_main", "curve-editor", "Demo inserted");
  assert.deepEqual(ctx.program.map(b => b.text), ["user-code", "demo_start", "demo_table", "demo_main"]);

  // Inserting the table again replaces the demo — only the latest batch remains.
  ctx._cgInsertTagged("table_b1", "curve-editor", "Inserted");
  assert.deepEqual(ctx.program.map(b => b.text), ["user-code", "table_b1"]);

  // Every inserted block is tagged; the user's own block is untouched.
  assert.equal(ctx.program[0]._cgSource, undefined);
  assert.equal(ctx.program[1]._cgSource, "curve-editor");
});

test("_expertBuildProgramFromText carries _cgSource tags across expert rebuilds", () => {
  // stateSource: a tagged block that renders as TWO text lines (like a 16-byte
  // BYTE block chunking to 8 per line) + an untagged block. The text is exactly
  // their render — the expert-sync path — so the spans verify and both blocks
  // re-parsed from the split lines must receive the tag.
  const stateSource = [
    { rendered: ".byte $01, $02\n.byte $03, $04", _cgSource: "curve-editor" },
    { rendered: "    RTS" }
  ];
  const parsed = [{}, {}, {}];   // one block per text line (the BYTE block split)
  const ctx = loadFunctions(["_expertBuildProgramFromText"], {
    program: [],
    parseExpertText: () => parsed,
    _addSrcLineToBlocks: (text, blocks) => blocks.forEach((b, i) => { b._srcLine = i; }),
    _expertCopyRegionFoldState: () => {},
    _blockToExpertLine: (b) => b.rendered
  });

  const blocks = ctx._expertBuildProgramFromText(".byte $01, $02\n.byte $03, $04\n    RTS", stateSource);

  assert.equal(blocks[0]._cgSource, "curve-editor");   // first half of the split block
  assert.equal(blocks[1]._cgSource, "curve-editor");   // second half of the split block
  assert.equal(blocks[2]._cgSource, undefined);
});

test("_expertBuildProgramFromText does not carry tags when the text was hand-edited", () => {
  const stateSource = [
    { rendered: ".byte $01", _cgSource: "curve-editor" }
  ];
  const parsed = [{}];
  const ctx = loadFunctions(["_expertBuildProgramFromText"], {
    program: [],
    parseExpertText: () => parsed,
    _addSrcLineToBlocks: (text, blocks) => blocks.forEach((b, i) => { b._srcLine = i; }),
    _expertCopyRegionFoldState: () => {},
    _blockToExpertLine: (b) => b.rendered
  });

  // The text no longer matches the tagged block's render → safe fallback, no tag.
  const blocks = ctx._expertBuildProgramFromText(".byte $99", stateSource);
  assert.equal(blocks[0]._cgSource, undefined);
});

test("Insert and Export demo handlers share the same replace key", () => {
  // The old per-label "table:<label>" keying let a standalone table and a demo
  // (which embeds the same table) coexist → duplicate labels. Both handlers
  // must now use the shared _CG_INSERT_KEY constant.
  assert.ok(!appJs.includes('"table:" +'), "per-label table keying must be gone");
  const occurrences = appJs.split("_CG_INSERT_KEY").length - 1;
  assert.ok(occurrences >= 3, "_CG_INSERT_KEY must be declared and used by both handlers");
});
