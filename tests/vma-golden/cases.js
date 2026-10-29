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
    lda #~B & $FF
    ldx #'A'
    ldy #' '+1
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
    .byte $01, 2, %00000011, 'A'
    .byte 3, %11, 16
    .byte %101, $FF
    .word $1234, label, label+1
    .word $1234, 16, %1
    .text "HELLO"
    .fill 8, $AA
    .align 64
label:
    .byte <label, >label
`,
  // .if NAME: .define-d or non-zero .const; otherwise a constant expression.
  "conditional-expr": `.const LEVEL = 3
.const OFF = 0
* = $1000
.if LEVEL >= 2 && LEVEL < 5
    inc $D020
.endif
.if LEVEL == 1
    inc $D021
.endif
.if OFF
    nop
.else
    dex
.endif
    rts
`,
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
  // the expansion re-parses an instruction from its operand: a zero page argument narrows it
  "macro-reparse-modes": `.macro store(addr, v)
    lda #{v}
    sta {addr}
    sta addr,x
    lda #v+1
.endm
* = $1000
    :store($d020, 2)
    :store($fb, $10)
    .invoke store(1024, %11)
    .call store $c000, $41
    rts
`,
  "macro-locals": `.macro wait(n)
    ldx #{n}
loop:
    dex
    bne loop
    .loop Y, $03, inner
    nop
    .next inner
.endm
* = $1000
start:
    :wait(5)
    :wait($20)
.local:
    bne .local
    rts
`,
  "macro-subroutine-and-bare": `.macro blink
    inc $d020
    rts
.endm
.macro DLY
    nop
    nop
.endm
* = $1000
    jsr blink
    :blink()
    DLY
    rts
`,
  "macro-kick-braces": `.macro border(c) {
    lda #{c}
    sta $d020
}
* = $1000
    :border(6)
    rts
`,
  "var-allocation": `.const BIG = 3
.var a
.var b, 2
.var c, BIG
.var d, $04
* = $1000
    lda a
    sta b+1
    lda.zp c
    stx d
    rts
`,
  "push-pull-orders": `* = $1000
    .push A
    .push XY
    .push Y, A, X
    .pull Y, A, X
    .pull XY
    .pull A
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
`,
  "org-in-macro-body": `.macro relocated
* = $3000
    nop
.endm
* = $1000
    lda #$01
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
  SID_PLAYER: ['.sid "Mad_Ikari.sid"', ""],
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

// Parameter variants of the macros (the forms the macro tests and the manual use).
const VARIANTS = {
  "joystick-var": ".const vx = $FB\n.const vy = $FC\n.const fire = $FD\n* = $1000\n    .joystick 2, vx, vy, fire\n    rts\n",
  "joystick-var-nofire": "* = $1000\n    .joystick 1, $FB, $FC\n    rts\n",
  "joystick-both-ports": "* = $1000\n    .joystick 3, $FB, $FC, $FD\n    rts\n",
  "joystick-sprite": "* = $1000\n    .joystick 2, 0\n    .joystick 1, 3\n    rts\n",
  "koala-6000": '* = $1000\n    .koala "picture.koa", $6000\n    rts\n',
  "level-2000": '* = $1000\n    .level "level.bin", $2000\n    rts\n',
  "level-row-color": '.const dst_ptr = $FB\n.const view_col = $FD\n* = $1000\n    .level "level.bin", $2000\n    .level_row dst_ptr, view_col, color\n    rts\n',
  "fill-expr": "* = $1000\n    .fill 8, i*2\n    .fill 4, round(127.5*sin(i))\n    rts\n",
  "sprite-init-mc": ".const SPRITE_NUM = 2\n.const SPRITE_COLOR = 5\n* = $1000\n    .sprite_init SPRITE_NUM, SPRITE_COLOR, $40, multicolor\n    .sprite_pos SPRITE_NUM, 200, 120\n    rts\n",
  "loop-for-y": "* = $1000\n    .loop Y, $03, loop1\n    nop\n    .next loop1\n    .for Y, $02, for1\n    nop\n    .endf for1\n    rts\n",
  "push-pull-all": "* = $1000\n    .push A, X, Y\n    .pull AXY\n    rts\n",
  "delay-frames": "* = $1000\n    .delay 1\n    .delay 50\n    rts\n",
  "table-align": "* = $1000\n    .align 256\nmul40:\n    .word 0, 320, 640, 960\n    rts\n",
  "print-multi": "* = $1000\n    .print \"HELLO\"\n    .print_hex A\n    .print_char 'A'\n    rts\n",
  "runtime-control": "* = $1000\n    .if A == #$00\n    inc $D020\n    .else\n    inc $D021\n    .endif\n    .while X != #$05\n    inx\n    .endw\n    .repeat\n    dey\n    .until Y == #$00\n    rts\n",
  "irq-wait-raster": "* = $1000\n    .irq_setup handler=irq, raster=$30\n    rts\nirq:\n    .wait_raster $80\n    jmp $EA31\n",
  // Kick import forms (.pc, .encoding + .text)
  "kick-pc": '.pc = $1000 "Main"\n    lda #$01\n.pc = 8192\n    rts\n',
  "kick-encoding-text": '* = $1000\n    .text "HELLO, world! @[]", $0D, 0\n.encoding "screencode_upper"\n    .text "ABC xyz 123"\n.encoding "petscii_mixed"\n    .text @"Mixed \\"q\\"", 255\n.encoding "petscii_upper"\n    .text "abc"\n.encoding "ascii"\n    .text "a~"\n    rts\n',
  "kick-encoding-bad-char-error": '* = $1000\n.encoding "screencode_upper"\n    .text "{"\n    rts\n',
  "incbin-addr": '* = $1000\n    .incbin "demo-colors.bin", $3000\n    rts\n',
  "fixed-code-macros": ".const BORDER = 6\n.const SEED = $02\nseed2 = $0340\n* = $1000\n    .set_border BORDER\n    .set_bg $0E\n    .set_border a\n    .charset upper\n    .charset lower\n    .turbo_set 15, 1\n    .turbo_set 3, 0\n    .turbo_enable off\n    .supercpu_detect\n    .reu_check\n    .exodecrunch\n    .exodecrunch depacker=$C800\n    .rand\n    .rand SEED\n    .rand seed2\n    .rand C000\n    .wait_raster 7F\n    .wait_raster #$FA\n    .clear_screen\n    .wait_key\n    .print_hex X\n    .print_hex Y\n    .print_char 65\n    .print_char $0D\n    .print_char %1000001\n    .print_char BORDER\n    rts\n",
  "fixed-code-in-macro": ".macro pr(ch)\n    .print_char ch\n    .print_char {ch}\n.endm\n* = $1000\n    :pr(5)\n    rts\n",
  "set-color-in-macro": ".macro col(c)\n    .set_border c\n.endm\n* = $1000\n    :col(5)\n    rts\n",
  "macro-field-params": ".macro actor(n, px, py, col, port, zp, line, wait)\n    .set_bg col\n    .sprite_init n, col, $80\n    .sprite_pos n, px, py\n    .sprite_col n, background\n    .sprite_anim n, frames, 2, zp\n    .joystick port, n\n    .mouse port, n, zp, $FE\n    .wait_raster line\n    .delay wait\n    .memcpy src=frames, dst=$0400, size=2\n    .memset dst=$0400, value=col, size=40\n    .irq_setup handler=irq, raster=line\n    .rand zp\n    .turbo_set col, 1\n    .text px, 2, \"HI\"\n.endm\n* = $1000\n    :actor(1, 100, 50, 7, 2, $FB, $80, 3)\n    :actor(2, 200, 60, 5, 1, $FC, $90, 4)\n    rts\nirq:\n    jmp $EA31\nframes:\n    .byte $80, $81\n",
  "macro-char-literal-arg": ".macro pr(ch)\n    .print_char ch\n    lda #ch\n.endm\n* = $1000\n    :pr('A')\n    :pr('0')\n    rts\n",
  "macro-runtime-control-twice": ".macro clamp(limit)\n    .if A >= #limit\n    lda #limit\n    .else\n    nop\n    .endif\n    .while X != #limit\n    inx\n    .endw\n    .repeat\n    dey\n    .until Y == #0\n.endm\n* = $1000\n    :clamp(5)\n    :clamp(9)\n    rts\n",
  "set-color-range-error": "* = $1000\n    .set_bg $10\n    rts\n",
  "print-char-unknown-error": "* = $1000\n    .print_char nothing\n    rts\n",
  "wait-raster-unknown": "* = $1000\n    .wait_raster nothing\n    .turbo_set nothing, x\n    rts\n",
  "text-data-macros": ".const COL = 5\n.const SHIFT = $80\n* = $1000\n    .text COL, 2, \"Hello World\"\n    .text 0, 24, \"lower Case\", lower\n    .text 1, 1, \"\"\n    .string $C100, \"ABC\", 80\n    .string buf, \"xyz\", lower :strlbl\n    .data $C200, $01, 2, %11 :datlbl\n    .data buf, 1, 2, 3\n    .rawbytes $C300, $AA, $BB, 255 :rawlbl\n    .rawtext $C310, \"Raw Text\", 40, lower\n    .petscii $C320, \"Hi there\", lower, null :petlbl\n    .petscii C330, \"UP\"\n    .print \"HELLO, WORLD!\"\n    .print \"mixed Case\", lower\n    .chardef $3800, 1, $FF, $81, 81, %10000001, COL, $81, $81, $FF\n    lda #<strlbl\n    lda #>petlbl\n    ldx datlbl\n    ldy rawlbl\n    rts\nbuf:\n    .fill 8, 0\n",
  "table-macro": "* = $1000\n    lda tab1\n    lda tab2\n    rts\n    .table tab1 $2000\n    .byte 1, 2, 3\n    .table tab2\n    .byte 4, 5\n",
  "text-in-macro": ".macro say(x, msg)\n    .text x, 0, \"{msg}\"\n    .rawbytes $C400, {x}, $FF\n.endm\n* = $1000\n    :say(3, HI)\n    rts\n",
  "chardef-count-error": "* = $1000\n    .chardef $3800, 0, 1, 2, 3\n    rts\n",
  "print-too-long-error": "* = $1000\n    .print \"" + "A".repeat(256) + "\"\n    rts\n",
  "sprite-input-macros": ".const N = 3\n.const PORT = 1\n.const ZPX = $FB\n* = $1000\n    .sprite_init N, 14, $80\n    .sprite_init 7, 1, FF, mono\n    .sprite_init 0, 2, 21, mc\n    .sprite_pos N, 300, 50\n    .sprite_pos 0, 255, 0\n    .sprite_col N, background\n    .sprite_col 7, sprite\n    .sprite_anim N, $C100, 8, $FB\n    .sprite_anim 0, frames, 2, FC\n    .joystick PORT, N\n    .joystick 3, 7\n    .joystick 2, vx+1, vy, fire\n    .mouse 1, N, ZPX, FC\n    .mouse 2, 0, $FD, $FE\n    .box_hit $F0, $F4\n    .score_bcd $C200, 2, 5, $0400\n    .score_bcd C300, 6, 123456, 0428\n    .score_bcd $C310, 4, 9999, $0450\n    rts\nframes:\n    .byte $80, $81\nvx: .byte 0, 0\nvy: .byte 0\nfire: .byte 0\n",
  "sprite-init-page-error": "* = $1000\n    .sprite_init 0, 1, nothing\n    rts\n",
  "sprite-pos-range-error": "* = $1000\n    .sprite_pos 0, 320, 10\n    rts\n",
  "sprite-anim-count-error": "* = $1000\n    .sprite_anim 0, $C100, nothing, $FB\n    rts\n",
  "mouse-port-error": ".const P = 3\n* = $1000\n    .mouse P, 0, $FB, $FC\n    rts\n",
  "joystick-var-unresolved-error": "* = $1000\n    .joystick 2, nothing, $FC\n    rts\n",
  "box-hit-range-error": "* = $1000\n    .box_hit $FD, $10\n    rts\n",
  "runtime-ops": "* = $1000\n    .if X <= #5\n    nop\n    .endif\n    .if_y > counter\n    nop\n    .else\n    dex\n    .endif\n    .if A != #%1010\n    nop\n    .endif\n    .if A >= 10\n    nop\n    .endif\n    .while Y < #$20\n    iny\n    .endw\n    .while A > #3\n    sec\n    sbc #1\n    .endw\n    .repeat\n    inx\n    .until X <= counter\n    .repeat\n    dey\n    .until_y = #0\n    rts\ncounter: .byte 7\n",
  "runtime-if-compile-else": ".define DEBUG\n* = $1000\n    .if DEBUG\n    .if A == #1\n    inc $D020\n    .else\n    inc $D021\n    .endif\n    .endif\n    .endw\n    rts\n",
  "memory-macros": ".const N = 300\nbuf = $C000\n* = $1000\n    .memcpy src=$C000, dst=$0400, size=$0100\n    .memcpy src=buf, dst=0800, size=1000\n    .memcpy src=$2000, dst=$3000, size=N+20\n    .memcpy src=2000, dst=3000, size=FF\n    .memset addr=$0400, value=#$20, size=1000\n    .memset dst=buf, value=N/2-100, size=$80\n    .map_copy $C000, $0400, 1000\n    .map_copy $C000, $0400, 1000, auto, $D800\n    .map_copy 3000, 0400, 300, $3400, D800\n    .map_copy16x16 $3000, 24, 9\n    .map_copy16x16 $3000, 0, 0, $0400, $3800, $D800\n    .reu_stash $C000, $0000, 0, $0100\n    .reu_fetch C000, 1234, 7, FFFF\n    .reu_swap $0400, $8000, 3, $03E8\n    .irq_setup handler=irq, raster=$30\n    .loadfile \"intro\", 8\n    .loadfile \"DATA\", dev, $2000, failed\n    rts\nfailed:\n    rts\nirq:\n    jmp $EA31\ndev = 9\n",
  "delay-helper-after-data": ".const WAIT = 25\n* = $1000\n    .delay WAIT\n    wait 3\n    .wait frames=$10\n    .rawbytes $C000, 1, 2, 3\n    .text 0, 24, \"BOTTOM LINE\"\n    rts\n",
  "delay-helper-in-skipped-if": ".if 0\n    .delay 2\n.endif\n* = $1000\n    rts\n",
  "runtime-if-missing-endif-error": "* = $1000\n    .if A == #1\n    nop\n    rts\n",
  "memset-value-error": "* = $1000\n    .memset addr=$0400, value=300, size=10\n    rts\n",
  "loadfile-device-error": "* = $1000\n    .loadfile \"X\", nothing\n    rts\n",
  "irq-handler-error": "* = $1000\n    .irq_setup handler=nothing, raster=$30\n    rts\n",
  "delay-range-error": "* = $1000\n    .delay 300\n    rts\n",
  "macro-buffers": ".macro show(buf, msg)\n    .petscii buf, \"{msg}\", null\n    lda #<buf\n    ldx #>buf\n.endm\n.macro fill(tmp)\n    .string tmp, \"AB\", 80\n    .rawtext tmp, \"xyz\", lower\n    .data tmp, 1, 2, 3\n    lda tmp\n.endm\n* = $1000\n    :show(name1, HELLO)\n    :show(name2, HI)\n    :fill(t1)\n    rts\n",
  "macro-buffer-delay": ".macro note(b)\n    .petscii b, \"WAIT\"\n.endm\n* = $1000\n    :note(x1)\n    .delay 2\n    rts\n",
  "incbin-delay-overlap": '* = $1000\n    .incbin "picture.koa", $1004\n    .delay 1\n    .koala "picture.koa", $2000\n    rts\n',
  "incbin-missing-file-error": '* = $1000\n    .incbin "no-such-file.bin"\n    rts\n',
  "incbin-empty-name-error": '* = $1000\n    .incbin ""\n    rts\n',
  "koala-address-error": '* = $1000\n    .koala "picture.koa", $4000\n    rts\n',
  "koala-size-error": '* = $1000\n    .koala "level.bin"\n    rts\n',
  "sid-custom-address": '.const SONG = 1\n* = $0900\n    .sid "Ikari_Intro.sid", $2000\n    .sid_player SONG, $30\n    lda #<SID_LOAD\n    ldx #>SID_INIT\n    ldy #<SID_PLAY\n    rts\n',
  "sid-player-default": '* = $0900\n    .sid "Mad_Ikari.sid"\n    .sid_player\n    rts\n',
  "sid-player-no-sid-error": "* = $1000\n    .sid_player 0\n    rts\n",
  "sid-not-psid-error": '* = $1000\n    .sid "picture.koa"\n    rts\n',
  "level-not-level-error": '* = $1000\n    .level "picture.koa"\n    rts\n',
  "level-row-no-level-error": "* = $1000\n    .level_row $FB, $FD\n    rts\n",
  "level-row-syntax-error": '* = $1000\n    .level "level.bin"\n    .level_row $FB\n    rts\n',
  "level-labels": '* = $1000\n    .level "level.bin", $4000\n    lda #<LEVEL_END\n    ldx #LEVEL_W\n    ldy #LEVEL_OBJ_COUNT\n    .word LEVEL_SLOT_LO, LEVEL_COL_OFS, LEVEL_SIZE, LEVEL_MAX_X\n    .delay 1\n    rts\n',
  "include-json-library": '* = $1000\n    .include "macros-new.json", $5000\n    jsr BitmapOn\n    :SetColor(1, 0)\n    :PlotPixel(10, 20)\n    jsr DisplayOn\n    rts\n',
  "include-json-inline": '* = $1000\n    .include "macros-new"\n    :SetColor(5, 6)\n    rts\n',
  "include-asm-data": '* = $1000\n    lda cube_edges\n    rts\n    .include "data.asm"\nend:\n    ldx frame_table\n',
  "include-missing-ignored": '* = $1000\n    .include "no-such-library.asm"\n    rts\n',
  "include-empty-name-error": '* = $1000\n    .include ""\n    rts\n',
  "macro-nested-error":".macro border(c)\n    lda #{c}\n    sta $D020\n.endm\n.macro both(c)\n    :border({c})\n.endm\n* = $1000\n    :both(3)\n    rts\n"
};

// Kick sources reach the VMA through _kickPreprocess: its output is a VMA case of its own, and so is
// every extra output (.file / .segmentout / .disk files: `raw`, the image alone as _kickBuildOutput).
function kickCases(app) {
  const dir = path.join(repo, "tests", "fixtures");
  const files = ["kick-project/main.asm", ...fs.readdirSync(path.join(dir, "kick-features")).filter(f => f.endsWith(".asm")).sort().map(f => "kick-features/" + f)];
  app.__readText = (p) => { try { return fs.readFileSync(p, "utf8"); } catch { return null; } };
  app.__readBin = (p) => { try { return new Uint8Array(fs.readFileSync(p)); } catch { return null; } };
  return files.flatMap(f => {
    const full = path.join(dir, f).split(path.sep).join("/");
    const pre = app.run(`_kickPreprocess(${JSON.stringify(full)}, __readText, __readBin)`);
    if (pre.errors.length) throw new Error(`${f}: ${JSON.stringify(pre.errors)}`);
    const id = "kick-" + f.replace(/\.asm$/, "").replace(/[^A-Za-z0-9_.-]+/g, "_");
    const base = { kind: "text", file: "tests/fixtures/" + f, baseDir: path.dirname(full) };
    const outputs = (pre.outputs || []).flatMap(o => (o.type === "d64" ? o.files || [] : [o])).filter(o => typeof o.text === "string")
      .map(o => ({ ...base, id: `${id}-out-${String(o.name).replace(/[^A-Za-z0-9_.-]+/g, "_")}`, text: o.text, raw: true }));
    return [{ ...base, id, text: pre.text }, ...outputs];
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
    ...Object.entries(SNIPPETS).map(([id, text]) => ({ id: "snip-" + id, kind: "text", text, baseDir: repo })),
    ...Object.entries(VARIANTS).map(([id, text]) => ({ id: "var-" + id, kind: "text", text, baseDir: path.join(__dirname, "files") })),
    ...kickCases(app)
  ];
}

module.exports = { allCases };
