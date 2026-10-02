; @name Hires bitmap (320x200)
; @name.hu Hires bitmap (320x200)
; @category Graphics
; @category.hu Grafika
; @desc Hires bitmap mode with a cleared screen and a PlotXY routine. 320x200 pixels, two colours per 8x8 cell.
; @desc.hu Hires bitmap mód törölt képernyővel és PlotXY rutinnal. 320x200 pixel, 8x8-as cellánként két szín.
; @order 30

; {{PROJECT}}
; Bitmap at $2000, colours in screen RAM at $0400
; (high nibble = pixel colour, low nibble = background colour).

* = $0801

.const INK = $10
.const BORDER = 0
; Zero page
.const ptr = $FB
.const plot_x = $FD
.const plot_y = $02

.region Init
start:
    SEI
    LDA #BORDER
    STA $D020
    JSR ClearBitmap
    LDA #INK
    JSR FillColors
    LDA #$3B
    STA $D011
    LDA #$08
    STA $D016
    LDA #$18
    STA $D018
.endregion

.region Draw
; TODO: your drawing goes here. Example: a diagonal line from 60,0 to 259,199.
    LDA #60
    STA plot_x
    LDA #$00
    STA plot_x+1
    STA plot_y
draw_loop:
    JSR PlotXY
    INC plot_x
    BNE draw_next
    INC plot_x+1
draw_next:
    INC plot_y
    LDA plot_y
    CMP #200
    BNE draw_loop
.endregion

forever:
    JMP forever

.region PlotXY
; Sets one pixel. In: plot_x (16 bit, 0..319), plot_y (0..199). Uses A, X, Y.
PlotXY:
    LDA plot_y
    LSR
    LSR
    LSR
    TAX
    LDA plot_y
    AND #$07
    ORA row_lo,X
    STA ptr
    LDA row_hi,X
    STA ptr+1
    LDA plot_x
    AND #$F8
    CLC
    ADC ptr
    STA ptr
    LDA plot_x+1
    ADC ptr+1
    STA ptr+1
    LDA plot_x
    AND #$07
    TAX
    LDY #$00
    LDA (ptr),Y
    ORA bit_mask,X
    STA (ptr),Y
    RTS
.endregion

.region Clear
; Clears the bitmap memory at $2000-$3FFF
ClearBitmap:
    LDA #$00
    STA ptr
    LDA #$20
    STA ptr+1
    LDX #$20
    LDY #$00
    TYA
clear_page:
    STA (ptr),Y
    INY
    BNE clear_page
    INC ptr+1
    DEX
    BNE clear_page
    RTS

; Fills screen RAM with the colour byte in A
FillColors:
    LDX #$00
fill_loop:
    STA $0400,X
    STA $0500,X
    STA $0600,X
    STA $06E8,X
    INX
    BNE fill_loop
    RTS
.endregion

.region Tables
; Address of every 8th pixel row (bitmap at $2000, 320 bytes per character row)
row_lo:
.byte $00, $40, $80, $C0, $00, $40, $80, $C0
.byte $00, $40, $80, $C0, $00, $40, $80, $C0
.byte $00, $40, $80, $C0, $00, $40, $80, $C0
.byte $00
row_hi:
.byte $20, $21, $22, $23, $25, $26, $27, $28
.byte $2A, $2B, $2C, $2D, $2F, $30, $31, $32
.byte $34, $35, $36, $37, $39, $3A, $3B, $3C
.byte $3E
bit_mask:
.byte $80, $40, $20, $10, $08, $04, $02, $01
.endregion
