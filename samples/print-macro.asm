* = $0801




.macro PrintText2(txt)
.petscii txt, "{txt}", null
    LDX #$00
print_1:
    LDA txt,X
    BEQ done_1
    JSR $FFD2
    INX
    BNE print_1
done_1:
.endm

.call PrintText2("HELLO WORLD!")
    LDA #13
    JSR $FFD2
.call PrintText2("KUKKMAL HELLO!")

    RTS

