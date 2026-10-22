// Default + outPrg + startAfter/align + virtual segment
.segmentdef Code [start=$0900]
.segmentdef Data [startAfter="Code", align=$100]
.segmentdef Buffer [startAfter="Data"]
.file [name="seg-a.file.prg", segments="Code,Data", modify="BasicUpstart", _start=$0900]

.segment Code "Main"
        jsr colorSetup
        rts
.segment Code "Color Setup"
colorSetup:
        lda colors
        sta $d020
        lda colors+1
        sta $d021
        ldx #0
!:      lda table,x
        inx
        bne !-
        rts
.segment Data "Colors"
colors: .byte LIGHT_GRAY, DARK_GRAY
.segment Buffer
table:  .fill $100, 0

.segment Other [outPrg="seg-a.other.prg", start=$c000]
        lda colors
        jmp colorSetup
