; @name Raster IRQ (ACME)
; @name.hu Raszter IRQ (ACME)
; @category Hardware
; @category.hu Hardver
; @desc Two chained raster interrupts draw a colour bar in the border, written the ACME way: !macro for the IRQ chain, !zone locals, anonymous labels, !if range check.
; @desc.hu Két láncolt raszter megszakítás színsávot rajzol a keretbe, ACME módra: !macro az IRQ-lánchoz, !zone lokális címkék, névtelen címkék, !if tartomány-ellenőrzés.
; @order 20
; @assembler acme

; {{PROJECT}}

!cpu 6510

BAR_TOP    = $80
BAR_BOTTOM = $90
BAR_COLOR  = 2
BORDER     = 14

!if BAR_TOP >= BAR_BOTTOM | BAR_BOTTOM > $ff {
    !error "BAR_TOP < BAR_BOTTOM <= $ff expected"
}

; Next raster IRQ: .handler at raster line .line (< 256), acknowledges the current one.
!macro next_irq .handler, .line {
    lda #.line
    sta $d012
    lda #<.handler
    sta $0314
    lda #>.handler
    sta $0315
    lda #$01
    sta $d019
}

* = $0801

!zone init
start:
    sei
    lda #$7f
    sta $dc0d           ; CIA1 IRQs off
    lda $dc0d           ; ack pending CIA1 IRQ
    lda #$1b
    sta $d011           ; raster bit 8 = 0
    lda #$01
    sta $d01a           ; raster IRQ on
    +next_irq irq_top, BAR_TOP
    cli
-   jmp -

!zone irqs
irq_top:
    lda #BAR_COLOR
    sta $d020
    +next_irq irq_bottom, BAR_BOTTOM
    jmp $ea81           ; restore registers, RTI

irq_bottom:
    lda #BORDER
    sta $d020
    +next_irq irq_top, BAR_TOP
    jmp $ea31           ; once per frame: KERNAL keyboard scan + RTI
