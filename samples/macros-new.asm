* = $0801



DoubleBufferSetup:
    ; Double-buffer init. Call once before main loop.
    ; ZP $10 (draw_bmp_hi): $20=bank0 bitmap, $60=bank1 bitmap
    ; ZP $11 (dbuf_bank):   $03=bank0, $02=bank1 for DD00 bits 0-1
    ; On return: VIC shows bank0, draw target = bank1.
    LDA #$02
    STA $11
    LDA $DD00
    AND #%11111100
    ORA #%00000011
    STA $DD00

    LDA #$20
    STA $10
    LDA #$00
    JSR clear_bitmap
    LDA #$10
    JSR fill_draw_screen

    LDA #$60
    STA $10
    LDA #$00
    JSR clear_bitmap
    LDA #$10
    JSR fill_draw_screen

    LDA #$60
    STA $10
    JSR ClearDrawBuffer
    RTS

DoubleBufferSwap:
    ; Wait for vblank then swap display/draw buffers.
    ; Call after a complete frame is drawn.
DbufW1:
    LDA $D012
    CMP #$F8
    BCC DbufW1
DbufW2:
    LDA $D012
    CMP #$F8
    BCS DbufW2
    LDA $DD00
    AND #%11111100
    ORA $11
    STA $DD00
    LDA $11
    EOR #$01
    STA $11
    LDA $10
    EOR #$40
    STA $10
    RTS

; ---- Hires graphics library (double-buffer aware) ----
clear_bitmap:
    LDA $10
    STA $FE
    LDA #$00
    STA $FD
    LDA #$00
    LDX #$1F
    LDY #$00
cb_page:
    STA ($FD),Y
    INY
    BNE cb_page
    INC $FE
    DEX
    BNE cb_page
    LDY #$00
cb_tail:
    STA ($FD),Y
    INY
    CPY #$40
    BNE cb_tail
    RTS

fill_draw_screen:
    STA $FB
    LDA $10
    SEC
    SBC #$1C
    STA $FE
    LDA #$00
    STA $FD
    LDX #$03
    LDY #$00
fds_page:
    LDA $FB
    STA ($FD),Y
    INY
    BNE fds_page
    INC $FE
    DEX
    BNE fds_page
fds_tail:
    LDA $FB
    STA ($FD),Y
    INY
    CPY #$E8
    BNE fds_tail
    RTS





WaitKey:
    CLI
WaitKeyLoop:
    JSR $FFE4
    BEQ WaitKeyLoop
    RTS

DisplayOff:
    LDA $D011
    AND #%11101111
    STA $D011
    RTS

DisplayOn:
    LDA $D011
    ORA #%00010000
    STA $D011
    RTS

FastClear:
    LDA #$00
    STA $58  ; POKE 88,0
    LDA #$3F
    STA $59  ; POKE 89,63
    LDA #$40
    STA $71  ; POKE 113,64
    LDA #$1F
    STA $72  ; POKE 114,31
    LDA #$01
    STA $0C  ; POKE 12,1
    JSR $B2C0  ; SYS 45760
    RTS


ClearScreen:
    JSR ClearDrawBuffer
    RTS

.const bitmap = $2000
.const screen = $0400
.const ptr    = $fb

ClearHires:
    LDA #<bitmap
    STA ptr
    LDA #>bitmap
    STA ptr+1
    LDA #$00
    LDX #$20  ; 8 KB bitmap = 32 oldal
    JSR FillPages

    LDA #<screen
    STA ptr
    LDA #>screen
    STA ptr+1
    LDA #$10  ; screen byte = $10, blank hires cell
    LDX #$04  ; 1 KB screen = 4 oldal
    JSR FillPages
    RTS

ClearDrawBuffer:
    LDA #$00
    JSR clear_bitmap
    LDA #$10
    JSR fill_draw_screen
    RTS

DrawDemoFrame:
    ; Egyszeru kitoltott teglalap a draw bufferbe.
    ; Hires bitmap layout:
    ; - kovetkezo scanline ugyanabban a 8x8 cellasorban: +1
    ; - kovetkezo karakter-sor (8 pixel le): +$140
    LDA #$E0
    STA $07
    LDA $10
    CLC
    ADC #$01
    STA $08
    LDA #$08
    STA $09
DrawCharRow:
    LDA $07
    STA $0B
    LDA $08
    STA $0C
    LDA #$08
    STA $0A
DrawScanline:
    LDA $0B
    STA $FD
    LDA $0C
    STA $FE
    LDA #$0A
    STA $0D
DrawByte:
    LDY #$00
    LDA #$FF
    STA ($FD),Y
    CLC
    LDA $FD
    ADC #$08
    STA $FD
    BCC DrawByteNext
    INC $FE
DrawByteNext:
    DEC $0D
    BNE DrawByte
    INC $0B
    BNE DrawScanlineNext
    INC $0C
DrawScanlineNext:
    DEC $0A
    BNE DrawScanline
    CLC
    LDA $07
    ADC #$40
    STA $07
    LDA $08
    ADC #$01
    STA $08
    DEC $09
    BNE DrawCharRow
    RTS

FillPages:
pageLoop:
    LDY #$00
byteLoop:
    STA (ptr),y
    INY
    BNE byteLoop
    INC ptr+1
    DEX
    BNE pageLoop
    RTS

TextMode:
    LDA $DD00
    AND #%11111100
    ORA #%00000011
    STA $DD00  ; text mode: VIC bank0, screen=$0400 valóban a $0400-ra mutat

    LDA #$1b
    STA $d011  ; bitmap OFF, screen ON

    LDA #$08
    STA $d016  ; 40 oszlop, multicolor OFF

    LDA #$14
    STA $d018  ; Screen=$0400, Charset=$1000 (alapértelmezett ROM karakterkészlet)

    CLI
    RTS
MultiColorBitmapMode:
; Multicolor Bitmap
; VIC bank: $0000-$3FFF
; Bitmap:   $2000-$3FFF
; Screen:   $0400-$07E7

    SEI

; VIC bank = $0000-$3FFF
    LDA $dd00
    AND #%11111100
    ORA #%00000011
    STA $dd00

; Bitmap mód
; #$3B = bitmap ON + screen ON
; #$2B = bitmap ON + screen OFF
    LDA #$3b
    STA $d011

; Multicolor ON, 40 oszlop
    LDA #$18
    STA $d016

; Screen=$0400 Bitmap=$2000
    LDA #$18
    STA $d018

; Háttérszín
    LDA #$00
    STA $d020
    STA $d021

    CLI
    RTS

HiresBitmapMode:
; C64 Hi-Res Bitmap Mode
; VIC bank: $0000-$3FFF
; Bitmap:   $2000-$3FFF
; Screen:   $0400-$07E7
    SEI

    LDA $dd00
    AND #%11111100
    ORA #%00000011
    STA $dd00  ; VIC bank = $0000-$3FFF

    LDA #$2b
    STA $d011  ; bitmap ON, screen ON, 25 sor

    LDA #$08
    STA $d016  ; hi-res, multicolor OFF, 40 oszlop

    LDA #$18
    STA $d018  ; screen=$0400, bitmap=$2000

    LDA #$00
    STA $d020  ; border
    STA $d021  ; background, itt nem fő bitmap szín

    CLI
    RTS
