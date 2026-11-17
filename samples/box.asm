* = $0801

.include "macros.vas", $1500
; --------------------------------------------------
; RAM variables
; --------------------------------------------------
.const frame_idx = $C100
.const points = $C110

.const src_lo = $09
.const src_hi = $0A

.const draw_bmp_hi = $10
.const dbuf_bank = $11

.const x0v = $20
.const y0v = $21
.const x1v = $22
.const y1v = $23
.const dxv = $24
.const dyv = $25
.const sxv = $26
.const syv = $27
.const errv = $28
.const cntv = $29
.const dx2v = $2A
.const dy2v = $2B
.const edge_idx = $2C

start:
    SEI
.invoke DisplayOff

    JSR Hires


; screen color nybbles: white fg / black bg (bank0)
    LDA #$10
    LDX #$00
fill_scr1:
    STA $0400,X
    STA $0500,X
    STA $0600,X
    INX
    BNE fill_scr1

    LDX #$00
fill_scr2:
    STA $0700,X
    INX
    CPX #$E8
    BNE fill_scr2

; init double buffering (fills bank1 screen at $4400, sets ZP)
.invoke DbufSetup

    LDA #$00
    STA frame_idx

; draw frame 0 while display is off, then enable
    JSR clear_bitmap
    JSR load_frame
    JSR draw_cube
.invoke DbufSwap
.invoke DisplayOn

main_loop:
    JSR clear_bitmap
    JSR load_frame
    JSR draw_cube
.invoke DbufSwap

    INC frame_idx
    LDA frame_idx
    AND #$0F
    STA frame_idx

    JMP main_loop

; --------------------------------------------------
; load current frame -> points
; --------------------------------------------------
load_frame:
    LDA frame_idx
    ASL
    TAX
    LDA frame_table,X
    STA src_lo
    INX
    LDA frame_table,X
    STA src_hi

    LDY #$00
lf_loop:
    LDA (src_lo),Y
    STA points,Y
    INY
    CPY #$10
    BNE lf_loop
    RTS

; --------------------------------------------------
; draw all 12 edges
; --------------------------------------------------
draw_cube:
    LDA #$00
    STA edge_idx

dc_loop:
    LDY edge_idx

    LDA cube_edges,Y
    ASL
    TAX
    LDA points,X
    STA x0v
    LDA points+1,X
    STA y0v

    INY
    LDA cube_edges,Y
    ASL
    TAX
    LDA points,X
    STA x1v
    LDA points+1,X
    STA y1v

    JSR draw_line

    LDA edge_idx
    CLC
    ADC #$02
    STA edge_idx
    CMP #24
    BNE dc_loop
    RTS

.include "data.asm"
