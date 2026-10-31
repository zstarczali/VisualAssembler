* = $0801
; ==========================================
; Runtime IF / ELSE / ENDIF demo
; ==========================================
; .if A|X|Y <op> value  is decided WHILE THE PROGRAM RUNS: it compiles to
; CMP / CPX / CPY plus the branches. Operators: == != < <= > >= (unsigned).
; .if NAME without a register is different: conditional assembly, decided
; when you build.
;
; Top:    colour bar, one nested .if on X for every column
; Bottom: press a key, .if on A picks the border colour and the text
; ==========================================

.region Init
.set_border $00
.set_bg $00
    JSR $E544
.text 1, 1, "runtime if / else demo"
.text 1, 6, "1 = red   2 = green   other = white"
.text 1, 7, "q = quit"
.text 1, 10, "key type:"
.endregion

.region Colour bar
; X is the column: the same code gives a different colour in each part of the row
    LDX #$00
bar_loop:
    LDA #$A0
    STA $04A0,X
.if X < #$0D
    LDA #$02
.else
    .if X < #$1B
        LDA #$07
    .else
        LDA #$05
    .endif
.endif
    STA $D8A0,X
    INX
    CPX #$28
    BNE bar_loop
.endregion

.region Key loop
wait_key:
    JSR $FFE4
    BEQ wait_key
    STA last_key

; if / else if / else chain on A: CMP leaves A unchanged, so it can be tested again
.if A == #$31
    LDX #$02
.else
    .if A == #$32
        LDX #$05
    .else
        LDX #$01
    .endif
.endif
    STX $D020

; two conditions: both must be true for the digit branch
    LDA last_key
.if A >= #$30
    .if A <= #$39
        JSR show_digit
    .else
        JSR show_other
    .endif
.else
    JSR show_other
.endif

    LDA last_key
.if A != #$51
    JMP wait_key
.endif
    LDA #$0E
    STA $D020
    LDA #$06
    STA $D021
    JSR $E544
    RTS
.endregion

.region Texts
show_digit:
.text 11, 10, "digit"
    RTS

show_other:
.text 11, 10, "other"
    RTS

last_key:
.byte 0
.endregion
