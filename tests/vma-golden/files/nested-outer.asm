nested_lib:
    .incbin "nested-data.bin"
    .include "nested-inner.asm"
    rts
