// .fillword / .lohifill, mnemonic suffixes, illegal opcodes, .cpu _65c02 / dtv, .break / .watch
* = $1000
        .fillword 3, i*$80
        .fillword 2, [$100, 0]
mul40:  .lohifill 8, 40*i
        lda mul40.lo,x
        lda mul40.hi,x
        lda.im $12
        lda.z $12
        lda.zp $12
        lda.a $12
        lda.abs $12,x
        sta.a $12
        jmp.a $1234
        ldx.z $12,y
        sha $1234,y
        sha ($12),y
        ahx $1234,y
        shx $1234,y
        shy $1234,x
        tas $1234,y
        shs $1234,y
        las $1234,y
        lae $1234,y
        ane #$12
        xaa #$12
        lxa #$12
        lax #$12
        sbc2 #$12
        anc2 #$12
        slo $12
        rla $1234,x
        sre ($12),y
        rra ($12,x)
        sax $12,y
        lax $12,y
        dcp $1234,y
        isc $12
        anc #1
        alr #1
        arr #1
        sbx #1
        axs #1
        nop $12,x
.cpu _65c02
start65:  lda ($12)
        sta ($fe)
        bit #$40
        bit $12,x
        bit $1234,x
        inc
        dec
        jmp ($1234,x)
        phx
        phy
        plx
        ply
        stz $12
        stz $12,x
        stz $1234
        stz $1234,x
        trb $12
        tsb $1234
        rmb3 $12
        smb7 $fe
        bra start65
        bbr0 $12, start65
        bbs7 $12, fwd
        stp
        wai
fwd:    rts
.cpu dtv
        bra fwd2
        sac #$12
        sir #$34
fwd2:   lax $1234,y
.cpu _6502
        anc2 #1
        sbc2 #2
        .break
        inc $d020
        .break "if y<5"
        nop
        .watch $d018
        .watch fwd2+1
        .watch $d000,$d00f
        .watch fwd2,fwd2+10,"store"
