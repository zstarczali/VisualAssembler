; ===============================================================
; Curve / Table Forge demo - bouncing ball (Ease Out Bounce)
; Matches the Curve Editor preview: the ball crosses the screen
; left-to-right at constant speed while its Y follows the bounce
; table (8-bit, $D001). X sweeps 0..320 linearly via a 16-bit
; fixed-point accumulator ($D010 MSB handled).
; The index loops 0..113 once per frame (~50 values/sec = tempo 50
; in the Curve Editor preview), so it moves exactly like the preview.
; ===============================================================

* = $0801

.region Init
start:
    SEI

    LDA #$00
    STA $D020
; border black
    STA $D021
; background black

.sprite_init 0, 7, $80
; sprite 0, yellow, data page $80 ($2000)
.sprite_pos 0, 24, 120
; initial pos; X/Y are overwritten each frame

    LDA #$00
    STA idx
    STA xpos
; 16-bit sprite X, integer part
    STA xpos+1
    STA xfrac
; fractional accumulator (8.8 fixed point)
.endregion 

.region Main
main:
.wait_raster $F8

    LDX idx
    LDA bounceTable,X
; Y = bounce curve (8-bit, fits $D001)
    STA $D001
; sprite 0 Y

; X += 320/114 px per frame (8.8 fixed point, step = 725 = $02D5)
    LDA xfrac
    CLC
    ADC #$D5
    STA xfrac
    LDA xpos
    ADC #$02
    STA xpos
    LDA xpos+1
    ADC #$00
    STA xpos+1

    LDA xpos
    STA $D000
; sprite 0 X low byte
    LDA xpos+1
    BEQ clr_msb
    LDA $D010
    ORA #%00000001
; set sprite 0 MSB (X > 255)
    STA $D010
    JMP next
clr_msb:
    LDA $D010
    AND #%11111110
; clear sprite 0 MSB
    STA $D010
next:
    INC idx
    LDA idx
    CMP #$72
; 114 entries -> wrap back to 0
    BCC main
    LDA #$00
    STA idx
    STA xpos
    STA xpos+1
    STA xfrac
    JMP main

idx:
.byte $00
xpos:
.word $0000
xfrac:
.byte $00

.endregion e

.region Move table
; -----------------------------------------------
; Curve Editor - Ease Out Bounce  (8-bit, sprite 0 Y)
; Range: 50..229 (visible sprite Y)   Count: 114 bytes
; Usage:  LDX #index  /  LDA bounceTable,X  ->  STA $D001
; -----------------------------------------------
bounceTable:
.byte $32, $32, $32, $33, $34, $35, $36, $37
.byte $39, $3A, $3C, $3F, $41, $44, $46, $49
.byte $4D, $50, $54, $58, $5C, $60, $64, $69
.byte $6E, $73, $78, $7E, $84, $8A, $90, $96
.byte $9D, $A3, $AA, $B2, $B9, $C1, $C8, $D0
.byte $D9, $E1, $E3, $DF, $DB, $D7, $D4, $D0
.byte $CD, $CA, $C8, $C5, $C3, $C1, $BF, $BE
.byte $BC, $BB, $BA, $B9, $B9, $B8, $B8, $B8
.byte $B9, $B9, $BA, $BB, $BC, $BD, $BF, $C0
.byte $C2, $C4, $C7, $C9, $CC, $CF, $D2, $D6
.byte $D9, $DD, $E1, $E5, $E3, $E1, $DF, $DE
.byte $DD, $DC, $DB, $DA, $DA, $DA, $DA, $DA
.byte $DB, $DB, $DC, $DD, $DF, $E0, $E2, $E4
.byte $E5, $E4, $E3, $E3, $E2, $E2, $E2, $E3
.byte $E3, $E4
.endregion 

.region Sprite
* = $2000

.include "ball.asm"
.endregion 
