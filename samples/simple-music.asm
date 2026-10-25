*=$1000
.sid "Mad_Ikari.sid"

    SEI
    LDA #$35  ; KERNAL + BASIC ki, I/O be
    STA $01
    LDA #$7F
    STA $DC0D  ; CIA1 IRQ ki
    STA $DD0D  ; CIA2 NMI ki
    LDA $DC0D
    LDA $DD0D
    LDA #<irq
    STA $FFFE
    LDA #>irq
    STA $FFFF
    LDA #<nmi
    STA $FFFA
    LDA #>nmi
    STA $FFFB
    LDA #0
    JSR SID_INIT
    LDA #$80
    STA $D012
    LDA $D011
    AND #$7F
    STA $D011
    LDA #$01
    STA $D01A
    STA $D019
    CLI
    JMP *

irq:
    PHA
    TXA
    PHA
    TYA
    PHA
    ASL $D019
    JSR SID_PLAY
    PLA
    TAY
    PLA
    TAX
    PLA
nmi:
    RTI