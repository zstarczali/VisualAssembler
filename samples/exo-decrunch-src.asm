// Exomizer V3 mem-mode backward depacker wrapper for C64 Visual Assembler.
// Entry point at $B000. Calling convention (official exomizer mem mode):
//   ZP $04/$05 = pointer to END of crunched data (one past last byte).
//   JSR $B000.
// The destination address is embedded in the crunched stream by exomizer.
// Compress with: exomizer mem -l <load_addr> file,<target_addr> -o out.exo

* = $B000
// Entry: copy ZP $04/$05 source-end pointer into depacker's self-modifying LDA.
        lda $04
        sta _byte_lo
        lda $05
        sta _byte_hi
        jmp exod_decrunch

// Backward get_crunched_byte: DEC pointer first, then read.
// Bumps the border color ($D020) each call → visible decrunch progress.
exod_get_crunched_byte:
        inc $D020              // border flash for visual decrunch feedback
        lda _byte_lo
        bne _byte_skip_hi
        dec _byte_hi
_byte_skip_hi:
        dec _byte_lo
.label _byte_lo = * + 1
.label _byte_hi = * + 2
        lda $ffff
        rts

#import "D:/Development/exomizer/exodecrs/kick/exodecrunch.asm"
