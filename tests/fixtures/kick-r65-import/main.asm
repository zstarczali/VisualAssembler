// Kick import through R65: macros, anonymous labels, .pseudopc
.const SCREEN = $0400

.macro Poke(addr, value) {
        lda #value
        sta addr
}

.macro Wait(n) {
        ldx #n
!:      dex
        bne !-
}

.macro Flash() {
        inc $d020
}

* = $0810
start:  :Poke($d020, 0)
        Poke(SCREEN, 1)
        .for (var i = 0; i < 2; i++) {
            :Poke(SCREEN + 1 + i, i)
        }
        :Wait(10)
        :Flash()
        ldx #0
copy:   lda payload,x
        sta $c000,x
        inx
        bne copy
        jmp run
payload:
.pseudopc $c000 {
run:    lda $d012
        beq run
        bne !+
!:      jmp run
}
