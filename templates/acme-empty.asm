; @name Empty ACME project
; @name.hu Üres ACME projekt
; @category General
; @category.hu Általános
; @desc A bare ACME source with a short ACME syntax cheat sheet. Visual Assembler puts the BASIC start line in front of "* = $0801" when it builds.
; @desc.hu Csupasz ACME forrás rövid ACME szintaxis-puskával. A Visual Assembler fordításkor BASIC indítósort tesz a „* = $0801” elé.
; @order 10
; @assembler acme

; {{PROJECT}}
; ACME cheat sheet
;   NAME = $d020              symbol (constant)
;   !byte 1, 2 / !word $c000  data;   !fill 16, 0  reserve
;   !scr "text" / !pet "text" screen codes / PETSCII
;   !align 63, 0              next 64-byte boundary (sprite)
;   !zone name  + .local      labels local to the zone
;   - / +  and  bne -         anonymous backward / forward labels
;   !macro name .arg { ... }  define, +name $06  call
;   !for i, 0, 7 { !byte 1 << i }   generated tables
;   !if EXPR { !error "..." } assemble-time checks
;   !source "file.asm" / !binary "file.bin"   include files

!cpu 6510

* = $0801

!zone main
start:
; TODO: your code starts here
    rts
