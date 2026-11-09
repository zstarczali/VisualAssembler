* = $0801
; ==========================================
; Ultimate 64 palette demo
; ==========================================
; Runs on an Ultimate 64 / C64 Ultimate or in the Ultimate emulator run mode.
; The palette goes through the Ultimate Command Interface ($DF1C-$DF1F):
;   firmware 3.15 or newer, and the menu (F2) -> C64 and Cartridge Settings ->
;   Command Interface = Enabled. Without it (VICE, older firmware) the macros
;   do nothing; the bottom line says whether the interface answers.
;
;   .u64_palette "file.vpl"           all 16 colours from a palette file
;                                     (VICE .vpl, GIMP .gpl, hex list, .act)
;   .u64_palette_color index, $RRGGBB one colour
;   .u64_palette_reset                back to the palette of the menu
;
; Keys: 1 = sunset palette, 2 = green monitor, 3 = two colours changed,
;       0 = palette of the menu. The bars show the 16 colours 0..F.
; ==========================================

.region Init
.set_border $00
.set_bg $00
    LDA #$0E
    STA $0286
    JSR $E544
.text 4, 1, "ultimate 64 palette demo"
.text 4, 3, "1 = sunset palette (file)"
.text 4, 4, "2 = green monitor (file)"
.text 4, 5, "3 = blue and light blue changed"
.text 4, 6, "0 = palette of the menu"
.text 4, 8, "0 1 2 3 4 5 6 7 8 9 a b c d e f"
.text 4, 23, "command interface:"
.endregion

.region Interface check
; $DF1D reads $C9 when the Command Interface is on
    LDA $DF1D
    CMP #$C9
    BNE uci_off
.text 23, 23, "on"
    JMP bars
uci_off:
.text 23, 23, "off"
.endregion

.region Colour bars
; 12 rows from row 9, column 4: 16 bars, two characters each
bars:
    LDA #$6C
    STA $FB
    STA $FD
    LDA #$05
    STA $FC
    LDA #$D9
    STA $FE
    LDX #$0C
bar_row:
    LDY #$00
bar_col:
    LDA #$A0
    STA ($FB),Y
    TYA
    LSR
    STA ($FD),Y
    INY
    CPY #$20
    BNE bar_col
    CLC
    LDA $FB
    ADC #$28
    STA $FB
    STA $FD
    BCC bar_next
    INC $FC
    INC $FE
bar_next:
    DEX
    BNE bar_row
.endregion

.region Key loop
; every case jumps back: the macros destroy A and X
wait_key:
    JSR $FFE4
    BEQ wait_key
    CMP #$31
    LBNE not_1
.u64_palette "u64-palette-sunset.vpl"
    JMP wait_key
not_1:
    CMP #$32
    LBNE not_2
.u64_palette "u64-palette-green.vpl"
    JMP wait_key
not_2:
    CMP #$33
    LBNE not_3
.u64_palette_color 6, $5000A0
.u64_palette_color 14, $FF70C0
    JMP wait_key
not_3:
    CMP #$30
    LBNE wait_key
.u64_palette_reset
    JMP wait_key
.endregion
