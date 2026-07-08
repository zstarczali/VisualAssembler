* = $0801

; --------------------------------------------------
; edge list
; --------------------------------------------------
cube_edges:
.byte $00, $01, $01, $02, $02, $03, $03, $00
.byte $04, $05, $05, $06, $06, $07, $07, $04
.byte $00, $04, $01, $05, $02, $06, $03, $07

; --------------------------------------------------
; 16 precomputed perspective frames
; --------------------------------------------------
frame_table:
.byte <frame_0, >frame_0
.byte <frame_1, >frame_1
.byte <frame_2, >frame_2
.byte <frame_3, >frame_3
.byte <frame_4, >frame_4
.byte <frame_5, >frame_5
.byte <frame_6, >frame_6
.byte <frame_7, >frame_7
.byte <frame_8, >frame_8
.byte <frame_9, >frame_9
.byte <frame_10, >frame_10
.byte <frame_11, >frame_11
.byte <frame_12, >frame_12
.byte <frame_13, >frame_13
.byte <frame_14, >frame_14
.byte <frame_15, >frame_15

frame_0:
.byte $90, $6C, $B0, $6C, $B3, $4A, $8D, $4A
.byte $88, $84, $B8, $84, $BE, $55, $82, $55
frame_1:
.byte $97, $6A, $B7, $70, $BB, $4C, $96, $49
.byte $84, $7D, $AE, $89, $B2, $58, $7D, $52
frame_2:
.byte $A0, $69, $BC, $76, $C1, $4F, $A0, $49
.byte $84, $76, $A0, $8C, $A0, $59, $7F, $4F
frame_3:
.byte $A9, $6A, $BC, $7D, $C3, $52, $AA, $49
.byte $89, $70, $92, $89, $8E, $58, $85, $4C
frame_4:
.byte $B0, $6C, $B8, $84, $BE, $55, $B3, $4A
.byte $90, $6C, $88, $84, $82, $55, $8D, $4A
frame_5:
.byte $B7, $70, $AE, $89, $B2, $58, $BB, $4C
.byte $97, $6A, $84, $7D, $7D, $52, $96, $49
frame_6:
.byte $BC, $76, $A0, $8C, $A0, $59, $C1, $4F
.byte $A0, $69, $84, $76, $7F, $4F, $A0, $49
frame_7:
.byte $BC, $7D, $92, $89, $8E, $58, $C3, $52
.byte $A9, $6A, $89, $70, $85, $4C, $AA, $49
frame_8:
.byte $B8, $84, $88, $84, $82, $55, $BE, $55
.byte $B0, $6C, $90, $6C, $8D, $4A, $B3, $4A
frame_9:
.byte $AE, $89, $84, $7D, $7D, $52, $B2, $58
.byte $B7, $70, $97, $6A, $96, $49, $BB, $4C
frame_10:
.byte $A0, $8C, $84, $76, $7F, $4F, $A0, $59
.byte $BC, $76, $A0, $69, $A0, $49, $C1, $4F
frame_11:
.byte $92, $89, $89, $70, $85, $4C, $8E, $58
.byte $BC, $7D, $A9, $6A, $AA, $49, $C3, $52
frame_12:
.byte $88, $84, $90, $6C, $8D, $4A, $82, $55
.byte $B8, $84, $B0, $6C, $B3, $4A, $BE, $55
frame_13:
.byte $84, $7D, $97, $6A, $96, $49, $7D, $52
.byte $AE, $89, $B7, $70, $BB, $4C, $B2, $58
frame_14:
.byte $84, $76, $A0, $69, $A0, $49, $7F, $4F
.byte $A0, $8C, $BC, $76, $C1, $4F, $A0, $59
frame_15:
.byte $89, $70, $A9, $6A, $AA, $49, $85, $4C
.byte $92, $89, $BC, $7D, $C3, $52, $8E, $58