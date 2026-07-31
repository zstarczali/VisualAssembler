; ===============================================================
; Curve Editor demo - Sine (sprite 0, embedded table)
; X sweeps the screen linearly, the table drives sprite Y -
; matches the Curve Editor preview. One table step per frame.
; ===============================================================

* = $0801

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

    LDA #$00
    STA idx
    STA xpos
; 16-bit sprite X, integer part
    STA xpos+1
    STA xfrac
; fractional accumulator (8.8 fixed point)

main:
.wait_raster $F8

    LDX idx
    JSR sinusTable_set_y
; sprite Y = table[idx]

; X += 320/256 px per frame (8.8 fixed point, step = 320 = $0140)
    LDA xfrac
    CLC
    ADC #$40
    STA xfrac
    LDA xpos
    ADC #$01
    STA xpos
    LDA xpos+1
    ADC #$00
    STA xpos+1

    LDA xpos
    STA $D000
; sprite 0 X low byte
    LDA xpos+1
    BEQ demo_clr_msb
    LDA $D010
    ORA #%00000001
; set sprite 0 MSB (X > 255)
    STA $D010
    JMP demo_next
demo_clr_msb:
    LDA $D010
    AND #%11111110
; clear sprite 0 MSB
    STA $D010
demo_next:
    INC idx
; 256 entries -> wraps automatically
    BNE main
    LDA #$00
; X back to the left edge
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

; -----------------------------------------------
; Curve Editor - Sine + Cosine
; Range: 49..222   Count: 256 bytes
; X (index): 0..255  ->  Y (value): sinusTable[X]
; Usage:  LDX #index  /  LDA sinusTable,X  -> value in A
; Combine: mix - Amount 35%
; -----------------------------------------------
sinusTable:
.byte $A6, $A4, $A2, $9E, $9A, $95, $8F, $89
.byte $82, $7C, $75, $6F, $69, $63, $5E, $59
.byte $55, $53, $51, $50, $4F, $50, $52, $54
.byte $57, $5A, $5E, $62, $66, $6B, $6E, $72
.byte $75, $77, $79, $7A, $7A, $79, $78, $75
.byte $72, $6E, $69, $64, $5E, $58, $53, $4D
.byte $47, $42, $3D, $39, $36, $34, $32, $31
.byte $32, $33, $35, $38, $3B, $40, $44, $49
.byte $4F, $54, $59, $5E, $62, $66, $6A, $6C
.byte $6E, $6F, $6F, $6E, $6C, $6A, $67, $63
.byte $5F, $5A, $56, $51, $4C, $48, $44, $41
.byte $3F, $3D, $3C, $3C, $3D, $3F, $42, $45
.byte $4A, $4F, $54, $5A, $60, $67, $6D, $73
.byte $79, $7E, $83, $87, $8A, $8C, $8E, $8E
.byte $8E, $8D, $8B, $89, $85, $82, $7E, $7A
.byte $76, $73, $6F, $6D, $6A, $69, $68, $68
.byte $69, $6B, $6D, $71, $75, $7A, $80, $86
.byte $8D, $93, $9A, $A0, $A6, $AC, $B1, $B6
.byte $BA, $BC, $BE, $BF, $C0, $BF, $BD, $BB
.byte $B8, $B5, $B1, $AD, $A9, $A4, $A1, $9D
.byte $9A, $98, $96, $95, $95, $96, $97, $9A
.byte $9D, $A1, $A6, $AB, $B1, $B7, $BC, $C2
.byte $C8, $CD, $D2, $D6, $D9, $DB, $DD, $DE
.byte $DD, $DC, $DA, $D7, $D4, $CF, $CB, $C6
.byte $C0, $BB, $B6, $B1, $AD, $A9, $A5, $A3
.byte $A1, $A0, $A0, $A1, $A3, $A5, $A8, $AC
.byte $B0, $B5, $B9, $BE, $C3, $C7, $CB, $CE
.byte $D0, $D2, $D3, $D3, $D2, $D0, $CD, $CA
.byte $C5, $C0, $BB, $B5, $AF, $A8, $A2, $9C
.byte $96, $91, $8C, $88, $85, $83, $81, $81
.byte $81, $82, $84, $86, $8A, $8D, $91, $95
.byte $99, $9C, $A0, $A2, $A5, $A6, $A7, $A7

; --- Set sprite 0 Y from the table (index in X) ---
; Usage:  LDX #index  /  JSR sinusTable_set_y
sinusTable_set_y:
    LDA sinusTable,X
    STA $D001
; sprite 0 Y
    RTS

* = $2000

; sprite 0 data: ball (64 bytes, 64-aligned)
.include "ball.asm"