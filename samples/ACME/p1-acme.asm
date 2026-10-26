
!cpu 6502

* = $C000
main:
    LDA #$06
    STA $D020
    JSR end


end:
    RTS 

