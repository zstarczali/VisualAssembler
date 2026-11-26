; @name Hello World (ACME)
; @name.hu Hello World (ACME)
; @category General
; @category.hu Általános
; @desc Prints HELLO WORLD with the KERNAL CHROUT routine and returns to BASIC. Visual Assembler puts the BASIC start line in front of "* = $0801" when it builds.
; @desc.hu Kiírja, hogy HELLO WORLD a KERNAL CHROUT rutinjával, és visszatér a BASIC-be. A Visual Assembler fordításkor BASIC indítósort tesz a „* = $0801” elé.
; @order 15
; @assembler acme

; {{PROJECT}}

!cpu 6510

CHROUT = $ffd2

* = $0801

!zone main
start:
        ldx #0
.loop:  lda message,x
        beq .done
        jsr CHROUT
        inx
        bne .loop
.done:  rts

; PETSCII: !pet turns the lower case letters into the upper case ones of the start-up character set
message:
        !pet 13, "hello world", 13, 0
