; ACME 0.97 test program for Visual Assembler (Settings → General → Assembler mode: ACME).
; Run, Build PRG / D64 / CRT: VA puts the BASIC SYS line in front, so "* = $0801"
; becomes "* = $080D". No KERNAL calls: it also runs from a Build CRT cartridge.
; Shows a message in the middle of the screen and raster colour bands in the border.
!cpu 6502

SCREEN  = $0400 + 12 * 40 + 13      ; row 12, column 13
COLRAM  = $d800 + 12 * 40 + 13

* = $0801
start   sei
        lda #$00
        sta $d021                   ; black background
        ldx #0
-       lda msg,x
        beq +
        sta SCREEN,x
        lda #$01                    ; white
        sta COLRAM,x
        inx
        bne -
+
; Border colour = raster line / 8: horizontal bands that stay put.
bars    lda $d012
        lsr
        lsr
        lsr
        sta $d020
        jmp bars

msg     !scr "acme crt ok!", 0      ; screen codes (lower case = upper case on screen)
