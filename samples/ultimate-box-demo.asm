* = $0801
; ==========================================
; Ultimate turbo demo: rotating cube, changing CPU speed
; ==========================================
; The cube of the box sample: every frame clears the 8000-byte bitmap and
; draws the 12 edges pixel by pixel, double buffered. At 1 MHz a frame takes
; several screen refreshes, so the cube turns slowly; each frame is one step
; of the rotation, so the faster the CPU, the faster it turns, up to 50
; frames a second (the buffer swap waits for the raster).
;
; Runs on a C64 Ultimate or an Ultimate 64 only, with the turbo registers on:
;   menu (F2) -> U64 Specific Settings -> Turbo Control = C64U Turbo Registers
;   (U64 Turbo Registers on the Ultimate 64 firmware). The Ultimate emulator
;   run mode of VA turns it on by itself. Anywhere else $D031 does not read
;   back, and the demo only says so.
;
; $D031: bits 0-3 = speed index (1, 2, 3, 4, 6, 8, 10, 12, 14, 16, 20, 24,
;   32, 40, 48, 64 MHz). The speed changes every 3 seconds (CIA1 time of day
;   clock): 1, 2, 4, 8, 16, 32, 64 MHz and back. The bottom line shows the
;   speed and the frames drawn in the last second.

.include "macros.json", $1500
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

; the upper case character set, copied out of the character ROM
.const font = $C400
.const STATUS_LEN = 23

start:
    SEI
; the turbo register reads back only on an Ultimate with the turbo registers on
    LDA #$01
    STA $D031
    LDA $D031
    CMP #$01
    BNE not_ultimate
    LDA #$00
    STA $D031
    LDA $D031
    LBEQ is_ultimate
not_ultimate:
    LDA #$01
    STA $0286
    JSR $E544
    LDA #$02
    STA $D020
.text 5, 9, "THIS DEMO NEEDS A C64 ULTIMATE"
.text 9, 10, "OR AN ULTIMATE 64."
.text 2, 13, "TURN ON THE TURBO REGISTERS: F2 MENU,"
.text 2, 14, "U64 SPECIFIC SETTINGS, TURBO CONTROL"
.text 2, 15, "= C64U / U64 TURBO REGISTERS."
not_ultimate_wait:
    JMP not_ultimate_wait
is_ultimate:
    JSR copy_font
    JSR start_clock
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
    JSR draw_status
.invoke DbufSwap
.invoke DisplayOn

main_loop:
    JSR clear_bitmap
    JSR load_frame
    JSR draw_cube
    JSR draw_status
.invoke DbufSwap
    INC frames
    JSR tick

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

; --------------------------------------------------
; speed: every 3 seconds the next one of speed_seq
; --------------------------------------------------
; CIA1 time of day clock at 50 Hz, started from 0
start_clock:
    LDA $DC0E
    ORA #$80
    STA $DC0E
    LDA $DC0F
    AND #$7F
    STA $DC0F
    LDA #$00
    STA $DC0B
    STA $DC0A
    STA $DC09
    STA $DC08
    LDA $DC09
    STA last_sec
    RTS

; once a second: the frame count, and every 3 seconds the next speed
tick:
    LDA $DC09
    CMP last_sec
    BEQ tick_done
    STA last_sec
    LDA frames
    STA fps
    LDA #$00
    STA frames
    DEC hold
    BNE tick_done
    LDA #$03
    STA hold
    INC seq_pos
    LDX seq_pos
    LDA speed_seq,X
    BPL tick_speed
    LDX #$00
    STX seq_pos
    LDA speed_seq
tick_speed:
    STA speed
    STA $D031
tick_done:
    RTS

; --------------------------------------------------
; status line: bitmap row 24 of the buffer being drawn
; --------------------------------------------------
copy_font:
    LDA #$33
    STA $01
    LDX #$00
cf_loop:
    LDA $D000,X
    STA font,X
    LDA $D100,X
    STA font+256,X
    INX
    BNE cf_loop
    LDA #$37
    STA $01
    RTS

draw_status:
    LDA speed
    ASL
    TAX
    LDA mhz_text,X
    STA status_text+7
    LDA mhz_text+1,X
    STA status_text+8
    LDA fps
    LDX #$30
ds_tens:
    CMP #10
    BCC ds_units
    SBC #10
    INX
    JMP ds_tens
ds_units:
    ORA #$30
    STA status_text+22
    STX status_text+21
; every character: 8 bytes of the font into its bitmap cell
    LDX #$00
ds_char:
    LDA #$00
    STA $FC
    LDA status_text,X
    ASL
    ROL $FC
    ASL
    ROL $FC
    ASL
    ROL $FC
    CLC
    ADC #<font
    STA $FB
    LDA $FC
    ADC #>font
    STA $FC
    TXA
    ASL
    ASL
    ASL
    STA $FD
    LDA draw_bmp_hi
    CLC
    ADC #$1E
    STA $FE
    LDY #$07
ds_copy:
    LDA ($FB),Y
    STA ($FD),Y
    DEY
    BPL ds_copy
    INX
    CPX #STATUS_LEN
    BNE ds_char
    RTS

; MHz of each speed index, as screen codes
mhz_text:
.byte $20, $31, $20, $32, $20, $33, $20, $34, $20, $36, $20, $38, $31, $30, $31, $32
.byte $31, $34, $31, $36, $32, $30, $32, $34, $33, $32, $34, $30, $34, $38, $36, $34
; speed indexes: 1, 2, 4, 8, 16, 32, 64, 32, 16, 8, 4, 2 MHz
speed_seq:
.byte $00, $01, $03, $05, $09, $0C, $0F, $0C, $09, $05, $03, $01, $FF
status_text:
.byte $20, $14, $15, $12, $02, $0F, $20, $20, $20, $20, $0D, $08, $1A, $20, $20, $20
.byte $20, $06, $10, $13, $20, $20, $20
speed:
.byte $00
seq_pos:
.byte $00
hold:
.byte $03
last_sec:
.byte $00
frames:
.byte $00
fps:
.byte $00

.include "data.asm"
