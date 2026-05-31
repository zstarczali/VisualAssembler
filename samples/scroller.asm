* = $0801
; Smooth 1px/frame left scroll
;
; Key timing fact: D016 and screen RAM written at raster $FC are AFTER
; row 12 is scanned (~line 146), so changes appear ONE FRAME LATER.
;
; Correct sequence (what VIC actually displays):
;   frame+1: fine=7, old chars  -> X = C*8+7
;   frame+2: fine=6             -> C*8+6
;   ...
;   frame+9: fine=0, old chars  -> C*8+0   (1px left of previous)
;   frame+10: fine=7, NEW chars -> (C-1)*8+7 = C*8-1  (still 1px left)
;
; So: hard shift must happen on the SAME frame we write fine=7, NOT fine=0.
; We use scroll_count=$FF as a sentinel: "next frame: write fine=7 + shift".

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

    ; Normal frame: write fine=scroll_count, then decrement
    ; When scroll_count was 0, DEC makes it $FF (sentinel for next frame)
    ORA #$C8
    STA $D016
    DEC scroll_count
    JMP done_frame

do_shift_now:
    ; Fine=0 was displayed last frame; now write fine=7 AND shift chars
    ; Both appear together next frame: (C-1)*8+7 = C*8-1 (smooth 1px left)
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
    STA $0607
    INX
    CPX #$4E
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
char_idx:
.byte $28
scroll_count:
.byte $00
scrolltext:
.byte $20, $20, $13, $0D, $0F, $0F, $14, $08, $20, $13, $03, $12, $0F, $0C, $0C, $09, $0E, $07, $20, $14, $05, $18, $14, $20, $04, $05, $0D, $0F, $20, $0F, $0E, $20, $14, $08, $05, $20, $03, $0F, $0D, $0D, $0F, $04, $0F, $12, $05, $20, $36, $34, $21, $20, $20, $2D, $2D, $2D, $20, $20, $16, $09, $13, $15, $01, $0C, $20, $01, $13, $13, $05, $0D, $02, $0C, $05, $12, $20, $2D, $2D, $2D, $20, $20
scrolltext_end:
    RTS
