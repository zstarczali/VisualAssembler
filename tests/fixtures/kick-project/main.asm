// Kick project fixture: every construct the VA Kick preprocessor handles
#import "lib/consts.asm"
.const LEVEL = cmdLineVars.containsKey("level") ? cmdLineVars.get("level").asNumber() : 3

.macro SetBorder(col) {
        lda #col
        sta $d020
}

BasicUpstart2(start)

start:  SetBorder(BORDER)
        ldx #0
!:      .for (var p = 0; p < 2; p++) {
            lda SRC + p*256,x
            sta ptr + p,x
        }
        inx
        bne !-
.if (LEVEL == 2) {
        lda #2
} else .if (LEVEL == 3) {
        lda #3
} else {
        lda #4
}
        ldy #<Table
        lda Shifted,y
        lda (ptr),y
        jmp (vec)
!loop:  dex
        bne !loop-
        jsr Moved
        beq !+
        nop
!:      rts

Table:
        .for (var n = 0; n < 4; n++) {
            .var d = 0
            .if ((n & 1) == 0) .eval d = d | 1
            .byte d, n*2
        }
        .fill 4, i*3
        .fill 4, [$aa, $55]
        .byte <Table, >Table, <(Table+1)
        .word Table, Moved
.label Shifted = T($10)
Data:   .import binary "lib/data.bin", 2, 4

* = $c000 "Moved"
.pseudopc $0400 {
Moved:  ldx #3
!:      dex
        bne !-
        lda MovedData
        rts
MovedData: .byte 7
}
.assert "pseudo block", * <= $c100, true
