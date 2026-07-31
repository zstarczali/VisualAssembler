
; ===============================================================
; Curve Editor demo - Ease In (Circ) (sprite 0, embedded table)
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
    JSR table_set_y
; sprite Y = table[idx]

; X += 320/148 px per frame (8.8 fixed point, step = $022A)
    LDA xfrac
    CLC
    ADC #$2A
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
    LDA idx
    CMP #$94
; 148 entries -> wrap back to 0
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

; -----------------------------------------------
; Curve Editor - Ease In (Circ) + Linear
; Range: 48..231   Count: 148 bytes
; X (index): 0..147  ->  Y (value): table[X]
; Usage:  LDX #index  /  LDA table,X  -> value in A
; Combine: sub - Amount 0%
; -----------------------------------------------
table:
.byte $30, $30, $30, $30, $30, $30, $30, $30
.byte $30, $30, $30, $31, $31, $31, $31, $31
.byte $31, $31, $32, $32, $32, $32, $32, $33
.byte $33, $33, $33, $33, $34, $34, $34, $35
.byte $35, $35, $36, $36, $36, $37, $37, $37
.byte $38, $38, $39, $39, $39, $3A, $3A, $3B
.byte $3B, $3C, $3C, $3D, $3D, $3E, $3E, $3F
.byte $3F, $40, $41, $41, $42, $42, $43, $44
.byte $44, $45, $46, $46, $47, $48, $49, $49
.byte $4A, $4B, $4C, $4D, $4D, $4E, $4F, $50
.byte $51, $52, $53, $54, $55, $56, $57, $58
.byte $59, $5A, $5B, $5C, $5D, $5E, $5F, $60
.byte $61, $63, $64, $65, $66, $68, $69, $6A
.byte $6C, $6D, $6F, $70, $71, $73, $75, $76
.byte $78, $79, $7B, $7D, $7E, $80, $82, $84
.byte $86, $88, $8A, $8C, $8E, $90, $92, $95
.byte $97, $9A, $9C, $9F, $A1, $A4, $A7, $AA
.byte $AD, $B1, $B4, $B8, $BC, $C0, $C5, $CA
.byte $CF, $D6, $DD, $E7

; --- Set sprite 0 Y from the table (index in X) ---
; Usage:  LDX #index  /  JSR table_set_y
table_set_y:
    LDA table,X
    STA $D001
; sprite 0 Y
    RTS

* = $2000

; sprite 0 data: ball (64 bytes, 64-aligned)
sprite_ball:
.byte $00, $00, $00
.byte $00, $3C, $00
.byte $01, $FF, $80
.byte $07, $FF, $E0
.byte $0F, $FF, $F0
.byte $1F, $FF, $F8
.byte $3F, $FF, $FC
.byte $3F, $FF, $FC
.byte $7F, $FF, $FE
.byte $7F, $FF, $FE
.byte $7F, $FF, $FE
.byte $7F, $FF, $FE
.byte $7F, $FF, $FE
.byte $3F, $FF, $FC
.byte $3F, $FF, $FC
.byte $1F, $FF, $F8
.byte $0F, $FF, $F0
.byte $07, $FF, $E0
.byte $01, $FF, $80
.byte $00, $3C, $00
.byte $00, $00, $00
.byte $00