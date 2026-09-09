* = $0801

.const black=0

.macro setColor color
    LDA #{color}
    STA $D020
    STA $D021
.endm

    JSR $E544
.text 16,10,"hello"

.invoke setColor(0)  ; custom macro!

    RTS