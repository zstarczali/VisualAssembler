// Exomizer raw depacker wrapper for C64 Visual Assembler EXODECRUNCH macro.
// Entry point at $B000. Caller convention:
//   ZP $FB/$FC = pointer to start of crunched stream (low/high).
//   JSR $B000.
// Uses forward decrunching (matches `exomizer raw` output).
// Target address is embedded in the crunched stream by exomizer -t flag.

#define DECRUNCH_FORWARDS

* = $B000
// Entry: copy ZP $FB/$FC source pointer into depacker's self-modifying LDA.
        lda $FB
        sta _byte_lo
        lda $FC
        sta _byte_hi
        jmp exod_decrunch

exod_get_crunched_byte:
.label _byte_lo = * + 1
.label _byte_hi = * + 2
        lda $ffff
        inc _byte_lo
        bne _byte_skip_hi
        inc _byte_hi
_byte_skip_hi:
        rts

#import "D:/Development/exomizer/exodecrs/kick/exodecrunch.asm"
