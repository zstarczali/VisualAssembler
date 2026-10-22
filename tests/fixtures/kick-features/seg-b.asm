// cartridge banks: .segmentout with min/max/fill, outBin; Default with BasicUpstart2 + zp segmentout
.segment CARTRIDGE_FILE [outBin="seg-b.cart.bin"]
        .segmentout [segments="BANK1"]
        .segmentout [segments="BANK2"]
.segmentdef BANK1 [start=$8000, min=$8000, max=$80ff, fill, fillByte=$ea]
.segmentdef BANK2 [start=$8000, min=$8000, max=$80ff, fill]
.segment BANK1
        lda #1
        jmp bank1end
        *=$8080
bank1end: rts
.segment BANK2
        lda #2
        rts

.segment Default
        BasicUpstart2(start)
start:  sei
        ldx #0
loop:   lda zpCode,x
        sta zpStart,x
        inx
        cpx #zpCodeSize
        bne loop
        jmp zpStart
zpCode: .segmentout [segments="ZeroPage_Code"]
        .label zpCodeSize = *-zpCode
        .segment ZeroPage_Code [start=$10]
zpStart:
        inc $d020
        jmp zpStart
