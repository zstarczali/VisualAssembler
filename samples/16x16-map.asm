; 16x16 charset/map demo - multicolor character mode
; Screen RAM: $0400, Color RAM: $D800, Charset RAM: $2000
; Input files:
;   16x16+ram+color.bin = first 256 bytes screen RAM, next 256 bytes Color RAM
;   16x16+charset.bin   = first 2048 bytes charset data

* = $0801
    SEI

; border / background
    LDA #$00
    STA $D020
    LDA #$00
    STA $D021
    LDA #$05
    STA $D022
    LDA #$0D
    STA $D023

; VIC bank 0: $0000-$3FFF, screen $0400, charset $2000
    LDA $DD00
    AND #$FC
    ORA #$03
    STA $DD00

; multicolor character mode: set $D016 bit 4
    LDA $D016
    ORA #$10
    STA $D016

; screen at $0400, custom charset at $2000
    LDA #$18
    STA $D018

.clear_screen 

; 16x16 map, centered at column 12 / row 4.
; The .bin may contain VA metadata after byte 511, so copy only these rows.
.map_copy16x16 $3000, 12, 4

loop:
    JMP loop

.incbin "16x16+ram+color.bin", $3000
.incbin "16x16+charset.bin", $2000
