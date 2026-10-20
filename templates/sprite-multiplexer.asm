; @name Sprite multiplexer (16 sprites)
; @name.hu Sprite multiplexer (16 sprite)
; @category Graphics
; @category.hu Grafika
; @desc 16 virtual sprites on the 8 hardware sprites: sorted by Y every frame, a raster IRQ chain reuses each hardware sprite once its previous use has been drawn.
; @desc.hu 16 virtuális sprite a 8 hardveres sprite-on: képkockánként Y szerint rendezve, a raszter IRQ-lánc minden hardveres sprite-ot újrahasznosít, amint az előző használata kirajzolódott.
; @order 50

; {{PROJECT}}
; How it works
;   bottom IRQ (line IRQ_BOTTOM): signals the main loop, which moves the
;     virtual sprites and insertion-sorts `order` by Y (nearly sorted -> cheap)
;   top IRQ (line IRQ_TOP): hardware sprites 0-7 get sorted sprites 0-7
;   mux IRQ: sorted sprite N goes to hardware sprite N & 7 once the sprite
;     N-8 that used it is fully drawn (its Y + 22); every sprite that is
;     already due is set in the same IRQ, then the next IRQ is scheduled.
; A sprite that comes closer than 22 lines to the one 8 places above it
; in the sort order cannot be shown in that frame (it would flicker).

* = $0801

.const NUM = 16
.const IRQ_TOP = 30
.const IRQ_BOTTOM = 250
; the ball sprite sits at $2000 (see the end), data page $2000 / 64 = $80
.const SPR_PAGE = $80

    JMP init

.region Init
init:
    SEI
    LDA #$00
    STA $D020
    STA $D021
    STA $D017
    STA $D01D
    STA $D01C
    LDA #$01
    STA $0286
    JSR $E544
.text 9, 12, "VA SPRITE MULTIPLEXER"
    LDA #$FF
    STA $D015
    LDX #NUM-1
init_order:
    TXA
    STA order,X
    DEX
    BPL init_order
    JSR move
    JSR sort
    LDA #$7F
    STA $DC0D
    LDA $DC0D
    LDA #<irq_top
    STA $0314
    LDA #>irq_top
    STA $0315
    LDA #IRQ_TOP
    STA $D012
    LDA $D011
    AND #$7F
    STA $D011
    LDA #$01
    STA $D01A
    STA $D019
    CLI
.endregion

.region Main loop
main_loop:
    LDA frame_done
    BEQ main_loop
    LDA #$00
    STA frame_done
    JSR move
    JSR sort
    JMP main_loop
.endregion

.region Movement
; y = ybase + wobble(phase + yoff), x = 24 + xtab(phase_x + xoff)
move:
    INC phase
    INC phase
    INC phase_x
    LDX #NUM-1
move_loop:
    LDA yoff,X
    CLC
    ADC phase
    TAY
    LDA ybase,X
    CLC
    ADC wobble,Y
    STA vy,X
    LDA xoff,X
    CLC
    ADC phase_x
    TAY
    LDA xtab,Y
    CLC
    ADC #24
    STA vxlo,X
    LDA #$00
    ADC #$00
    STA vxhi,X
    DEX
    BPL move_loop
    RTS
.endregion

.region Sort
; insertion sort of `order` by vy (ascending)
sort:
    LDA #$01
    STA sort_i
sort_outer:
    LDX sort_i
    LDA order,X
    STA sort_key
    TAY
    LDA vy,Y
    STA sort_y
sort_inner:
    CPX #$00
    BEQ sort_place
    LDY order-1,X
    LDA vy,Y
    CMP sort_y
    BCC sort_place
    BEQ sort_place
    TYA
    STA order,X
    DEX
    JMP sort_inner
sort_place:
    LDA sort_key
    STA order,X
    INC sort_i
    LDA sort_i
    CMP #NUM
    BNE sort_outer
    RTS
.endregion

.region Raster IRQs
irq_top:
    LDA #$FF
    STA $D019
    LDX #$00
top_loop:
    JSR show
    INX
    CPX #$08
    BNE top_loop
    STX next
    JMP mux_check

irq_mux:
    LDA #$FF
    STA $D019
mux_show:
    LDX next
    JSR show
    INX
    STX next
; X = next sorted sprite: show it now if its hardware sprite is free, else wait for that line
mux_check:
    CPX #NUM
    BEQ to_bottom
    LDY order-8,X
    LDA vy,Y
    CLC
    ADC #22
    STA irq_line
    LDA $D012
    CLC
    ADC #$03
    CMP irq_line
    BCS mux_show
    LDA irq_line
    STA $D012
    LDA #<irq_mux
    STA $0314
    LDA #>irq_mux
    STA $0315
    JMP $EA81

to_bottom:
    LDA #IRQ_BOTTOM
    STA $D012
    LDA #<irq_bottom
    STA $0314
    LDA #>irq_bottom
    STA $0315
    JMP $EA81

irq_bottom:
    LDA #$FF
    STA $D019
    INC frame_done
    LDA #IRQ_TOP
    STA $D012
    LDA #<irq_top
    STA $0314
    LDA #>irq_top
    STA $0315
    JMP $EA81

; sorted sprite X -> hardware sprite X & 7 (X is preserved)
show:
    STX show_pos
    LDY order,X
    TXA
    AND #$07
    TAX
    LDA #SPR_PAGE
    STA $07F8,X
    LDA vcol,Y
    STA $D027,X
    LDA vxhi,Y
    BEQ show_msb_off
    LDA $D010
    ORA bitmask,X
    JMP show_msb
show_msb_off:
    LDA bitmask,X
    EOR #$FF
    AND $D010
show_msb:
    STA $D010
    TXA
    ASL
    TAX
    LDA vxlo,Y
    STA $D000,X
    LDA vy,Y
    STA $D001,X
    LDX show_pos
    RTS
.endregion

.region Data
bitmask:
.byte $01, $02, $04, $08, $10, $20, $40, $80
ybase:
.byte $3C, $45, $4E, $57, $60, $69, $72, $7B, $84, $8D, $96, $9F, $A8, $B1, $BA, $C3
yoff:
.byte $00, $47, $8E, $D5, $1C, $63, $AA, $F1, $38, $7F, $C6, $0D, $54, $9B, $E2, $29
xoff:
.byte $00, $10, $20, $30, $40, $50, $60, $70, $80, $90, $A0, $B0, $C0, $D0, $E0, $F0
vcol:
.byte $01, $02, $03, $04, $05, $07, $08, $0A, $0D, $0E, $0F, $01, $03, $07, $0A, $0D
; signed sine, -14..+14
wobble:
.byte $00, $00, $01, $01, $01, $02, $02, $02, $03, $03, $03, $04, $04, $04, $05, $05
.byte $05, $06, $06, $06, $07, $07, $07, $07, $08, $08, $08, $09, $09, $09, $09, $0A
.byte $0A, $0A, $0A, $0B, $0B, $0B, $0B, $0B, $0C, $0C, $0C, $0C, $0C, $0D, $0D, $0D
.byte $0D, $0D, $0D, $0D, $0D, $0D, $0E, $0E, $0E, $0E, $0E, $0E, $0E, $0E, $0E, $0E
.byte $0E, $0E, $0E, $0E, $0E, $0E, $0E, $0E, $0E, $0E, $0E, $0D, $0D, $0D, $0D, $0D
.byte $0D, $0D, $0D, $0D, $0C, $0C, $0C, $0C, $0C, $0B, $0B, $0B, $0B, $0B, $0A, $0A
.byte $0A, $0A, $09, $09, $09, $09, $08, $08, $08, $07, $07, $07, $07, $06, $06, $06
.byte $05, $05, $05, $04, $04, $04, $03, $03, $03, $02, $02, $02, $01, $01, $01, $00
.byte $00, $00, $FF, $FF, $FF, $FE, $FE, $FE, $FD, $FD, $FD, $FC, $FC, $FC, $FB, $FB
.byte $FB, $FA, $FA, $FA, $F9, $F9, $F9, $F9, $F8, $F8, $F8, $F7, $F7, $F7, $F7, $F6
.byte $F6, $F6, $F6, $F5, $F5, $F5, $F5, $F5, $F4, $F4, $F4, $F4, $F4, $F3, $F3, $F3
.byte $F3, $F3, $F3, $F3, $F3, $F3, $F2, $F2, $F2, $F2, $F2, $F2, $F2, $F2, $F2, $F2
.byte $F2, $F2, $F2, $F2, $F2, $F2, $F2, $F2, $F2, $F2, $F2, $F3, $F3, $F3, $F3, $F3
.byte $F3, $F3, $F3, $F3, $F4, $F4, $F4, $F4, $F4, $F5, $F5, $F5, $F5, $F5, $F6, $F6
.byte $F6, $F6, $F7, $F7, $F7, $F7, $F8, $F8, $F8, $F9, $F9, $F9, $F9, $FA, $FA, $FA
.byte $FB, $FB, $FB, $FC, $FC, $FC, $FD, $FD, $FD, $FE, $FE, $FE, $FF, $FF, $FF, $00
; sine 0..255
xtab:
.byte $80, $83, $86, $89, $8C, $90, $93, $96, $99, $9C, $9F, $A2, $A5, $A8, $AB, $AE
.byte $B1, $B3, $B6, $B9, $BC, $BF, $C1, $C4, $C7, $C9, $CC, $CE, $D1, $D3, $D5, $D8
.byte $DA, $DC, $DE, $E0, $E2, $E4, $E6, $E8, $EA, $EB, $ED, $EF, $F0, $F1, $F3, $F4
.byte $F5, $F6, $F8, $F9, $FA, $FA, $FB, $FC, $FD, $FD, $FE, $FE, $FE, $FF, $FF, $FF
.byte $FF, $FF, $FF, $FF, $FE, $FE, $FE, $FD, $FD, $FC, $FB, $FA, $FA, $F9, $F8, $F6
.byte $F5, $F4, $F3, $F1, $F0, $EF, $ED, $EB, $EA, $E8, $E6, $E4, $E2, $E0, $DE, $DC
.byte $DA, $D8, $D5, $D3, $D1, $CE, $CC, $C9, $C7, $C4, $C1, $BF, $BC, $B9, $B6, $B3
.byte $B1, $AE, $AB, $A8, $A5, $A2, $9F, $9C, $99, $96, $93, $90, $8C, $89, $86, $83
.byte $80, $7D, $7A, $77, $74, $70, $6D, $6A, $67, $64, $61, $5E, $5B, $58, $55, $52
.byte $4F, $4D, $4A, $47, $44, $41, $3F, $3C, $39, $37, $34, $32, $2F, $2D, $2B, $28
.byte $26, $24, $22, $20, $1E, $1C, $1A, $18, $16, $15, $13, $11, $10, $0F, $0D, $0C
.byte $0B, $0A, $08, $07, $06, $06, $05, $04, $03, $03, $02, $02, $02, $01, $01, $01
.byte $01, $01, $01, $01, $02, $02, $02, $03, $03, $04, $05, $06, $06, $07, $08, $0A
.byte $0B, $0C, $0D, $0F, $10, $11, $13, $15, $16, $18, $1A, $1C, $1E, $20, $22, $24
.byte $26, $28, $2B, $2D, $2F, $32, $34, $37, $39, $3C, $3F, $41, $44, $47, $4A, $4D
.byte $4F, $52, $55, $58, $5B, $5E, $61, $64, $67, $6A, $6D, $70, $74, $77, $7A, $7D
.endregion

.region Variables
frame_done:
.byte $00
phase:
.byte $00
phase_x:
.byte $00
next:
.byte $00
irq_line:
.byte $00
show_pos:
.byte $00
sort_i:
.byte $00
sort_key:
.byte $00
sort_y:
.byte $00
order:
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00
vy:
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00
vxlo:
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00
vxhi:
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00
.endregion

* = $2000
ball:
.byte $00, $7E, $00, $01, $FF, $80, $07, $FF
.byte $E0, $0F, $FF, $F0, $1F, $FF, $F8, $1F
.byte $FF, $F8, $3F, $FF, $FC, $3F, $FF, $FC
.byte $3F, $FF, $FC, $3F, $FF, $FC, $3F, $FF
.byte $FC, $3F, $FF, $FC, $1F, $FF, $F8, $1F
.byte $FF, $F8, $0F, $FF, $F0, $07, $FF, $E0
.byte $01, $FF, $80, $00, $7E, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
