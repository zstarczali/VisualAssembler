; @name Sprite multiplexer (ACME, 16 sprites)
; @name.hu Sprite multiplexer (ACME, 16 sprite)
; @category Graphics
; @category.hu Grafika
; @desc 16 virtual sprites on the 8 hardware sprites, written the ACME way: !macro IRQ setup, !zone locals, anonymous labels, sine tables generated with !for + sin(), a colour list, sprite art in %..##.. binary, !if / !error checks.
; @desc.hu 16 virtuális sprite a 8 hardveres sprite-on, ACME módra: !macro IRQ beállítás, !zone lokális címkék, névtelen címkék, !for + sin() generált szinusztáblák, színlista, %..##.. bináris sprite-rajz, !if / !error ellenőrzések.
; @order 50
; @assembler acme

; {{PROJECT}}
; How it works
;   bottom IRQ (line IRQ_BOTTOM): signals the main loop, which moves the
;     virtual sprites and insertion-sorts `order` by Y (nearly sorted -> cheap)
;   top IRQ (line IRQ_TOP): hardware sprites 0-7 get sorted sprites 0-7
;   mux IRQ: sorted sprite N goes to hardware sprite N & 7 once the sprite
;     N-8 that used it is fully drawn (its Y + 22); every sprite that is
;     already due is set in the same IRQ, then the next IRQ is scheduled.
; A sprite that comes closer than 22 lines to the one 8 places above it
; in the sort order cannot be shown in that frame (it would flicker).
; Change NUM (9-32) and the tables below follow it.

!cpu 6510

NUM        = 16
IRQ_TOP    = 30
IRQ_BOTTOM = 250
WOBBLE     = 14             ; vertical swing in lines
COLORS     = [1, 2, 3, 4, 5, 7, 8, 10, 13, 14, 15]

!if NUM < 9 | NUM > 32 {
    !error "NUM must be 9..32, it is ", NUM
}

; Points the KERNAL IRQ vector at .handler.
!macro set_vector .handler {
    lda #<.handler
    sta $0314
    lda #>.handler
    sta $0315
}

; Next raster IRQ: .handler at raster line .line (< 256).
!macro next_irq .handler, .line {
    lda #.line
    sta $d012
    +set_vector .handler
}

!macro ack_irq {
    lda #$ff
    sta $d019
}

* = $0801

;------------------------------------------------------------------------------
!zone init
init:
    sei
    lda #0
    sta $d020
    sta $d021
    sta $d017
    sta $d01d
    sta $d01c
    jsr $e544               ; clear screen
    ldx #title_len - 1
-   lda title,x
    sta $0400 + 40 * 12 + (40 - title_len) / 2,x
    lda #1
    sta $d800 + 40 * 12 + (40 - title_len) / 2,x
    dex
    bpl -
    lda #$ff
    sta $d015
    ldx #NUM - 1
-   txa
    sta order,x
    dex
    bpl -
    jsr move
    jsr sort
    lda #$7f
    sta $dc0d               ; CIA1 IRQs off
    lda $dc0d
    +next_irq irq_top, IRQ_TOP
    lda $d011
    and #$7f
    sta $d011
    lda #$01
    sta $d01a
    sta $d019
    cli

;------------------------------------------------------------------------------
!zone main
main:
-   lda frame_done
    beq -
    lda #0
    sta frame_done
    jsr move
    jsr sort
    jmp main

;------------------------------------------------------------------------------
; y = ybase + wobble(phase + yoff), x = 24 + xtab(phase_x + xoff)
!zone move
move:
    inc phase
    inc phase
    inc phase_x
    ldx #NUM - 1
.each:
    lda yoff,x
    clc
    adc phase
    tay
    lda ybase,x
    clc
    adc wobble,y
    sta vy,x
    lda xoff,x
    clc
    adc phase_x
    tay
    lda xtab,y
    clc
    adc #24
    sta vxlo,x
    lda #0
    adc #0
    sta vxhi,x
    dex
    bpl .each
    rts

;------------------------------------------------------------------------------
; insertion sort of `order` by vy (ascending)
!zone sort
sort:
    lda #1
    sta .i
.outer:
    ldx .i
    lda order,x
    sta .key
    tay
    lda vy,y
    sta .y
.inner:
    cpx #0
    beq .place
    ldy order - 1,x
    lda vy,y
    cmp .y
    bcc .place
    beq .place
    tya
    sta order,x
    dex
    jmp .inner
.place:
    lda .key
    sta order,x
    inc .i
    lda .i
    cmp #NUM
    bne .outer
    rts
.i:     !byte 0
.key:   !byte 0
.y:     !byte 0

;------------------------------------------------------------------------------
!zone irqs
irq_top:
    +ack_irq
    ldx #0
-   jsr show
    inx
    cpx #8
    bne -
    stx next
    jmp mux_check

irq_mux:
    +ack_irq
mux_show:
    ldx next
    jsr show
    inx
    stx next
; X = next sorted sprite: show it now if its hardware sprite is free, else wait for that line
mux_check:
    cpx #NUM
    beq .to_bottom
    ldy order - 8,x
    lda vy,y
    clc
    adc #22
    sta .line
    lda $d012
    clc
    adc #3
    cmp .line
    bcs mux_show
    lda .line
    sta $d012
    +set_vector irq_mux
    jmp $ea81

.to_bottom:
    +next_irq irq_bottom, IRQ_BOTTOM
    jmp $ea81

irq_bottom:
    +ack_irq
    inc frame_done
    +next_irq irq_top, IRQ_TOP
    jmp $ea81
.line:  !byte 0

;------------------------------------------------------------------------------
; sorted sprite X -> hardware sprite X & 7 (X is preserved)
!zone show
show:
    stx .pos
    ldy order,x
    txa
    and #7
    tax
    lda #ball / 64
    sta $07f8,x
    lda vcol,y
    sta $d027,x
    lda vxhi,y
    beq +
    lda $d010
    ora bitmask,x
    bne ++                  ; always: the bit just set is non-zero
+   lda bitmask,x
    eor #$ff
    and $d010
++  sta $d010
    txa
    asl
    tax
    lda vxlo,y
    sta $d000,x
    lda vy,y
    sta $d001,x
    ldx .pos
    rts
.pos:   !byte 0

;------------------------------------------------------------------------------
!zone data
bitmask:
    !for i, 0, 7 { !byte 1 << i }
ybase:
    !for i, 0, NUM - 1 { !byte $3c + i * 136 / NUM }
yoff:
    !for i, 0, NUM - 1 { !byte (i * $47) & $ff }
xoff:
    !for i, 0, NUM - 1 { !byte i * 256 / NUM }
vcol:
    !for i, 0, NUM - 1 { !byte COLORS[i % len(COLORS)] }
; signed sine, -WOBBLE..+WOBBLE
wobble:
    !for i, 0, 255 { !byte int(WOBBLE * sin(i * 3.14159265 / 128)) & $ff }
; sine 0..255
xtab:
    !for i, 0, 255 { !byte int(127.5 + 127.5 * sin(i * 3.14159265 / 128)) }
title:
    !scr "acme sprite multiplexer"
title_len = * - title

; variables
frame_done: !byte 0
phase:      !byte 0
phase_x:    !byte 0
next:       !byte 0
order:      !fill NUM, 0
vy:         !fill NUM, 0
vxlo:       !fill NUM, 0
vxhi:       !fill NUM, 0

; Sprite data: 64-byte aligned, 21 rows of 3 bytes + 1 padding byte.
    !align 63, 0
ball:
    !byte %........, %.######., %........
    !byte %.......#, %########, %#.......
    !byte %.....###, %########, %###.....
    !byte %....####, %########, %####....
    !byte %...#####, %########, %#####...
    !byte %...#####, %########, %#####...
    !byte %..######, %########, %######..
    !byte %..######, %########, %######..
    !byte %..######, %########, %######..
    !byte %..######, %########, %######..
    !byte %..######, %########, %######..
    !byte %..######, %########, %######..
    !byte %...#####, %########, %#####...
    !byte %...#####, %########, %#####...
    !byte %....####, %########, %####....
    !byte %.....###, %########, %###.....
    !byte %.......#, %########, %#.......
    !byte %........, %.######., %........
    !byte %........, %........, %........
    !byte %........, %........, %........
    !byte %........, %........, %........
    !byte 0

!if * - ball != 64 {
    !error "the sprite must be exactly 64 bytes"
}
!if ball >= $1000 & ball < $2000 {
    !error "sprite data in the character ROM shadow ($1000-$1fff), VIC-II cannot see it"
}
