* = $0801
; MAP_COPY demo - map-color-mc++.bin + custom charset1.bin
; Screen RAM: $0400, Color RAM: $D800, Charset RAM: $2000
    SEI

; border / shared multicolor registers
    LDA #$00
    STA $D020
    STA $D021
    LDA #$03
    STA $D022
    LDA #$0E
    STA $D023

; VIC bank 0: screen $0400, charset $2000
    LDA $DD00
    AND #$FC
    ORA #$03
    STA $DD00

; multicolor text mode on
    LDA $D016
    ORA #$10
    STA $D016

; screen at $0400, custom charset at $2000
    LDA #$18
    STA $D018

; map-color-mc++.bin layout: screen $0900, color $0CE8
.map_copy $0900, $0400, 1000, $0CE8, $D800

loop:
    JMP loop

.incbin "map-color-mc++.bin", $0900
.incbin "charset1.bin", $2000
