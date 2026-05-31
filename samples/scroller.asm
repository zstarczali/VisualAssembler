* = $0801
.const scrolltext = $0900
.const scrolltext_len = $4F
.region init
    SEI
    LDA #$00
    STA $D020
    STA $D021
    JSR $E544
    LDA #$C8
    STA $D016
    LDA #$07
    STA scroll_count
    LDX #$00
fill:
    LDA scrolltext,X
    JSR p2s
    STA $05E0,X
    INX
    CPX #$28
    BNE fill
.endregion
.region scroll_loop
main:
-   LDA $D012
    CMP #$FC
    BNE -
    LDA scroll_count
    CMP #$FF
    BEQ do_shift_now
    ORA #$C8
    STA $D016
    DEC scroll_count
    JMP done_frame
do_shift_now:
    LDA #$CF
    STA $D016
    LDA #$07
    STA scroll_count
    LDX #$00
shift:
    LDA $05E1,X
    STA $05E0,X
    INX
    CPX #$27
    BNE shift
    LDX char_idx
    LDA scrolltext,X
    JSR p2s
    STA $0607
    INX
    CPX #scrolltext_len
    BNE no_wrap
    LDX #$00
no_wrap:
    STX char_idx
done_frame:
-   LDA $D012
    CMP #$FC
    BEQ -
    JMP main
.endregion
; PETSCII uppercase ($41-$5A) -> screen code ($01-$1A), others unchanged
p2s:
    CMP #$41
    BCC p2s_done
    CMP #$5B
    BCS p2s_done
    SEC
    SBC #$40
p2s_done:
    RTS
char_idx:
.byte $28
scroll_count:
.byte $00
.petscii $0900, "  SMOOTH SCROLLING TEXT DEMO ON THE COMMODORE 64!  ---   VISUAL ASSEMBLER ---  "