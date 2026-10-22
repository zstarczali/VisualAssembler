// VMA golden corpus: every case is VMA source text (block programs through _blockToExpertSourceLine),
// compiled by the JS reference into expected/<id>.prg. The Rust VMA compiler must give the same bytes.
const fs = require("node:fs");
const path = require("node:path");
const { repo } = require("../helpers/vma-reference");

const OPERAND = {
  implied: "", immediate: "#$12", zeroPage: "$12", zeroPageX: "$12,X", zeroPageY: "$12,Y",
  absolute: "$1234", absoluteX: "$1234,X", absoluteY: "$1234,Y", indirect: "($1234)",
  indirectX: "($12,X)", indirectY: "($12),Y", relative: "*"
};

// One line per mnemonic × addressing mode of the app's opcodeMap (legal + supported illegal opcodes).
function opcodeMatrix(app) {
  const map = app.run("opcodeMap");
  const lines = ["* = $1000"];
  for (const [mnem, modes] of Object.entries(map)) {
    for (const mode of Object.keys(modes)) lines.push(`    ${mnem}${OPERAND[mode] ? " " + OPERAND[mode] : ""}`);
  }
  return lines.join("\n") + "\n";
}

// Small sources for the language features; each one should stay focused on one area.
const SNIPPETS = {
  "expr-star-pc": `* = $1000
start:
    bne *-2
    jmp *+20
    lda #<*
    lda #>(*+63)
    lda #STRIDE*2
    .const STRIDE = 3
`,
  "expr-operators": `.const A = $1234
.const B = 7
* = $1000
    lda #<A
    lda #>A
    lda #(B+1)*2
    lda #B % 4
    lda #B & 3 | 8
    lda #B << 2
    lda #A >> 8
`,
  "labels-local-anon": `* = $1000
first:
.loop:
    dex
    bne .loop
second:
.loop:
    dey
    bne .loop
    rts
`,
  "long-branch": `* = $1000
top:
    lbne far
    lbeq far
    lbcc far
    lbcs top
    lbmi top
    lbpl far
    lbvc far
    lbvs far
    .fill 300, $EA
far:
    rts
`,
  "assert-smc": `* = $1000
    .assert * == $1000, "origin"
patch:
    lda value:#$00
    sta value
    inc patch+1
    rts
`,
  "data-directives": `* = $2000
    .byte $01, 2, 3
    .word $1234, label, label+1
    .text "HELLO"
    .fill 8, $AA
    .align 64
label:
    .byte <label, >label
`,
  // VMA .if is a .define test (ifdef), not an expression.
  "conditional-asm": `.define DEBUG
* = $1000
.if DEBUG
    inc $D020
.else
    inc $D021
.endif
.if RELEASE
    nop
.endif
    rts
`,
  "macro-invoke": `.macro setColor(color)
    lda #{color}
    sta $D020
.endm
* = $1000
    :setColor($02)
    :setColor(6)
    rts
`,
  "multi-org-segments": `* = $1000
    jsr sub
    rts
* = $1100
sub:
    lda #$01
    rts
* = $1200
    .byte $FF
`,
  "zp-vs-abs-selection": `.const zp = $FB
.const abs = $9A00
* = $1000
    lda zp
    lda abs
    sta zp,x
    ldx zp,y
    lda (zp),y
    lda $00FB
    rts
`
};

// Lines around a palette macro's default Expert line, so it builds on its own.
const MACRO_CONTEXT = {
  NEXT: [".loop X, $0A, loop1", ""], ENDF: [".for X, $0A, loop1", ""],
  ELSE: [".define DEBUG\n.if DEBUG", ".endif"], ENDIF: [".if DEBUG", ""],
  IF_A: ["", ".endif"], IF_X: ["", ".endif"], IF_Y: ["", ".endif"],
  WHILE_A: ["", ".endw"], WHILE_X: ["", ".endw"], WHILE_Y: ["", ".endw"], ENDW: [".while A == #$00", ""],
  REPEAT: ["", ".until A == #$00"], UNTIL_A: [".repeat", ""], UNTIL_X: [".repeat", ""], UNTIL_Y: [".repeat", ""],
  ENDREGION: [".region group", ""],
  ASSERT: ["start:\n    nop\nend:", ""],
  IRQ_SETUP: ["", "my_irq:\n    jmp $EA31"],
  LEVEL_ROW: ['.level "level.bin"\n.const dst_ptr = $FB\n.const view_col = $FD', ""]
};
// Palette lines that name a file the corpus does not have.
const MACRO_LINE = {
  INCBIN: '.incbin "demo-colors.bin"', SID: '.sid "Mad_Ikari.sid"', INCLUDE: '.include "include-library-old.json"'
};

// Every palette macro with its default Expert line (the block the palette adds).
function macroCases(app) {
  const items = app.run(`Object.values(mnemonicLibrary).flat()
    .filter(i => Object.keys(i).some(k => /^is[A-Z][A-Za-z]*Macro$/.test(k) && i[k]))
    .map(i => [i.mnemonic, _blockToExpertLine(_createBlockFromPalette(i))])`);
  return items.map(([mnem, line]) => {
    const [before, after] = MACRO_CONTEXT[mnem] || ["", ""];
    const target = /^LB/.test(mnem) ? "target:" : "";
    const text = ["* = $1000", before, MACRO_LINE[mnem] || line, target, after, "    rts", ""].filter(l => l !== "").join("\n") + "\n";
    return { id: "macro-" + mnem, kind: "text", text, baseDir: path.join(__dirname, "files") };
  });
}

function fileCases() {
  const out = [];
  const add = (dir, filter) => {
    for (const f of fs.readdirSync(path.join(repo, dir)).sort()) {
      if (!filter(f)) continue;
      const file = path.join(repo, dir, f);
      if (f.endsWith(".json")) {
        const json = JSON.parse(fs.readFileSync(file, "utf8"));
        if (!Array.isArray(json.program)) continue;
        out.push({ id: `${dir}-${f.replace(/\.json$/, "")}-blocks`, kind: "blocks", file: `${dir}/${f}`, blocks: json.program });
      } else {
        out.push({ id: `${dir}-${f.replace(/\.asm$/, "")}`, kind: "text", file: `${dir}/${f}`, text: fs.readFileSync(file, "utf8") });
      }
    }
  };
  add("samples", f => /\.(asm|json)$/.test(f) && !f.endsWith(".snapshots.json"));
  add("templates", f => f.endsWith(".asm") && !f.startsWith("acme-"));
  return out.map(c => ({ ...c, id: c.id.replace(/[^A-Za-z0-9_.-]+/g, "_"), baseDir: path.dirname(path.join(repo, c.file)) }));
}

function allCases(app) {
  return [
    ...fileCases(),
    { id: "gen-opcode-matrix", kind: "text", text: opcodeMatrix(app), baseDir: repo },
    ...macroCases(app),
    ...Object.entries(SNIPPETS).map(([id, text]) => ({ id: "snip-" + id, kind: "text", text, baseDir: repo }))
  ];
}

module.exports = { allCases };
