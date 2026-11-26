; @name Hello World
; @name.hu Hello World
; @category General
; @category.hu Általános
; @desc Prints HELLO WORLD twice and returns to BASIC: once with the .print macro, once with a hand-written CHROUT loop over a .petscii table.
; @desc.hu Kétszer kiírja, hogy HELLO WORLD, és visszatér a BASIC-be: egyszer a .print makróval, egyszer kézzel írt CHROUT ciklussal egy .petscii táblán.
; @order 15

; {{PROJECT}}

.const CHROUT = $FFD2

* = $0801

start:
; the VMA way: one macro, the string goes out through CHROUT
    .print_char 13
    .print "HELLO WORLD"
    .print_char 13

; the same by hand: a zero-terminated PETSCII table, printed byte by byte
    LDX #$00
print:
    LDA message,X
    BEQ done
    JSR CHROUT
    INX
    BNE print
done:
    RTS

message:
.petscii message, "HELLO WORLD", null
