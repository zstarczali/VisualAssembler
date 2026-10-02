; NewProject
; Bitmap at $2000. Each pixel is 2 bits, its value picks the colour:
;   0 = background ($D021)
;   1 = screen RAM high nibble
;   2 = screen RAM low nibble
;   3 = colour RAM ($D800)

* = $0801

.const BORDER = 0
.const BACKGROUND = 0
; Colours 1 and 2 share one byte: high nibble = colour 1, low nibble = colour 2
.const COLOR_12 = $2E
.const COLOR_3 = 7
; Zero page
.const ptr = $FB
.const plot_x = $FD
.const plot_y = $FE
.const plot_color = $02
.const tmp = $03

.region Init
start:
    SEI
    LDA #BORDER
    STA $D020
    LDA #BACKGROUND
    STA $D021
    JSR ClearBitmap
    JSR FillColors
    LDA #$3B
    STA $D011
    LDA #$18
    STA $D016
    LDA #$18
    STA $D018
.endregion

.region Draw
; TODO: your drawing goes here. Example: three diagonal lines, one in each colour.
    LDA #$00
    STA plot_y
draw_loop:
    LDA #1
    STA plot_color
    LDA plot_y
    LSR
    CLC
    ADC #10
    STA plot_x
    JSR PlotXY
    INC plot_color
    LDA plot_x
    CLC
    ADC #20
    STA plot_x
    JSR PlotXY
    INC plot_color
    LDA plot_x
    CLC
    ADC #20
    STA plot_x
    JSR PlotXY
    INC plot_y
    LDA plot_y
    CMP #200
    BNE draw_loop
.endregion

forever:
    JMP forever

.region PlotXY
; Sets one pixel. In: plot_x (0..159), plot_y (0..199), plot_color (0..3). Uses A, X, Y.
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
; byte column = (plot_x / 4) * 8 = (plot_x AND $FC) * 2
    LDA #$00
    STA tmp
    LDA plot_x
    AND #$FC
    ASL
    ROL tmp
    CLC
    ADC ptr
    STA ptr
    LDA tmp
    ADC ptr+1
    STA ptr+1
    LDA plot_x
    AND #$03
    STA tmp
    TAX
    LDY #$00
    LDA (ptr),Y
    AND clear_mask,X
    STA (ptr),Y
    LDA plot_color
    ASL
    ASL
    ORA tmp
    TAX
    LDA color_bits,X
    ORA (ptr),Y
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

; Fills screen RAM with COLOR_12 and colour RAM with COLOR_3
FillColors:
    LDX #$00
fill_loop:
    LDA #COLOR_12
    STA $0400,X
    STA $0500,X
    STA $0600,X
    STA $06E8,X
    LDA #COLOR_3
    STA $D800,X
    STA $D900,X
    STA $DA00,X
    STA $DAE8,X
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
; Clears the 2 bits of pixel 0..3 inside a byte
clear_mask:
.byte $3F, $CF, $F3, $FC
; Bit pattern of colour 0..3 at pixel 0..3
color_bits:
.byte $00, $00, $00, $00
.byte $40, $10, $04, $01
.byte $80, $20, $08, $02
.byte $C0, $30, $0C, $03
.endregion
