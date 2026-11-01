; ==========================================
; Ultimate turbo demo: 64 sprites, changing CPU speed
; ==========================================
; Runs on a C64 Ultimate or an Ultimate 64 only, with the turbo registers on:
;   menu (F2) -> U64 Specific Settings -> Turbo Control = C64U Turbo Registers
;   (U64 Turbo Registers on the Ultimate 64 firmware). The Ultimate emulator
;   run mode of VA turns it on by itself. Anywhere else $D031 does not read
;   back, and the demo only says so.
;
; $D031: bits 0-3 = speed index (1, 2, 3, 4, 6, 8, 10, 12, 14, 16, 20, 24,
;   32, 40, 48, 64 MHz), bit 7 = badline timing off. Raster timing, the VIC
;   and the SID stay at 1 MHz; only the CPU runs faster.
;
; The speed changes every 3 seconds: 1, 2, 4, 8, 16, 32, 64 MHz and back.
; The work per frame
;   main loop: 3 software multiplies per sprite for the X positions
;     (192 in all, about 30000 cycles), then the Y sort. The border is red
;     while it runs: at 1 MHz it takes several frames (low FPS).
;   mux IRQs: a whole row of 8 sprites is due on the same raster line and
;     must be set within 2 lines. At 1 MHz that takes about 9 lines, so the
;     last balls of each row are missing; from 4 MHz all 64 are shown.

* = $0801

.const NUM = 64
.const IRQ_TOP = 30
.const IRQ_BOTTOM = 250
.const AMP2 = 112
.const AMP3 = 24
; the ball sprite sits at $3000 (see the end), data page $3000 / 64 = $C0
.const SPR_PAGE = $C0
.const STATUS = $07C0
; frames each speed is kept
.const HOLD = 150

    JMP init

.region Init
init:
    SEI
    LDA #$00
    STA $D020
    STA $D021
    STA $D017
    STA $D01D
    STA $D01C
; sprites behind the text, so the status line stays readable
    LDA #$FF
    STA $D01B
    LDA #$01
    STA $0286
    JSR $E544
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
.text 5, 0, "VA ULTIMATE TURBO MULTIPLEXER"
.text 0, 24, "TURBO    MHZ   FPS      64 SPRITES"
    LDA #$FF
    STA $D015
    LDX #NUM-1
init_order:
    TXA
    STA order,X
    LDA vcol,X
    STA vcol_now,X
    DEX
    BPL init_order
    JSR set_speed
    JSR move
    JSR sort
    LDA #$7F
    STA $DC0D
    LDA $DC0D
    LDA #<irq_top
    STA $0314
    LDA #>irq_top
    STA $0315
    LDA #IRQ_TOP
    STA $D012
    LDA $D011
    AND #$7F
    STA $D011
    LDA #$01
    STA $D01A
    STA $D019
    CLI
.endregion

.region Main loop
main_loop:
    LDA frame_done
    BEQ main_loop
    LDA #$00
    STA frame_done
    LDA #$02
    STA $D020
    JSR move
    JSR sort
    LDA #$00
    STA $D020
    INC loops
    LDA speed_due
    BEQ main_status
    LDA #$00
    STA speed_due
    JSR next_speed
main_status:
    JSR show_status
    JMP main_loop
.endregion

.region Speed
; next speed of the cycle; the list ends with $FF
next_speed:
    INC seq_pos
    LDX seq_pos
    LDA speed_seq,X
    BPL next_speed_set
    LDX #$00
    STX seq_pos
    LDA speed_seq
next_speed_set:
    STA speed

; speed index -> $D031
set_speed:
    LDA speed
    STA $D031
    RTS

; MHz and the frames computed in the last second, on the bottom line
show_status:
    LDA speed
    ASL
    TAX
    LDA mhz_text,X
    STA STATUS+6
    LDA mhz_text+1,X
    STA STATUS+7
    LDA fps
    LDX #$30
fps_tens:
    CMP #10
    BCC fps_units
    SBC #10
    INX
    JMP fps_tens
fps_units:
    ORA #$30
    STA STATUS+19
    STX STATUS+18
    RTS
.endregion

.region Movement
; x = xbase + (sin1 * ampx + sin2 * AMP2 + sin3 * AMP3) / 256, ampx breathing
; y = row base + bob, the same for every row so rows stay 24 lines apart
move:
    INC phase
    LDA phase_x
    CLC
    ADC #$02
    STA phase_x
    DEC phase_x2
    LDA phase3
    CLC
    ADC #$05
    STA phase3
    INC slow
    LDY slow
    LDA xtab,Y
    LSR
    LSR
    CLC
    ADC #96
    STA ampx
    LDA #160
    SEC
    SBC ampx
    LSR
    CLC
    ADC #24
    STA xbase
    LDY phase
    LDA bob,Y
    STA bobv
    LDX #$07
row_loop:
    LDA rowbase,X
    CLC
    ADC bobv
    STA rowy,X
    DEX
    BPL row_loop
    LDA #NUM-1
    STA idx
move_loop:
    LDX idx
    LDA xoff,X
    CLC
    ADC phase_x
    TAY
    LDA xtab,Y
    LDY ampx
    JSR mulhi
    STA sum_lo
    LDA #$00
    STA sum_hi
    LDX idx
    LDA xoff2,X
    CLC
    ADC phase_x2
    TAY
    LDA xtab,Y
    LDY #AMP2
    JSR mulhi
    CLC
    ADC sum_lo
    STA sum_lo
    BCC move_sum2
    INC sum_hi
move_sum2:
    LDX idx
    LDA xoff3,X
    CLC
    ADC phase3
    TAY
    LDA xtab,Y
    LDY #AMP3
    JSR mulhi
    CLC
    ADC sum_lo
    STA sum_lo
    BCC move_sum3
    INC sum_hi
move_sum3:
    LDX idx
    LDA sum_lo
    CLC
    ADC xbase
    STA vxlo,X
    LDA sum_hi
    ADC #$00
    STA vxhi,X
    LDY rowof,X
    LDA rowy,Y
    STA vy,X
    DEC idx
    BPL move_loop
    RTS

; A = (A * Y) / 256, shift and add (X is used)
mulhi:
    STA mul_a
    STY mul_b
    LDA #$00
    LDX #$08
    LSR mul_b
mul_loop:
    BCC mul_skip
    CLC
    ADC mul_a
mul_skip:
    ROR
    ROR mul_b
    DEX
    BNE mul_loop
    RTS
.endregion

.region Sort
; insertion sort of `order` by vy (ascending)
sort:
    LDA #$01
    STA sort_i
sort_outer:
    LDX sort_i
    LDA order,X
    STA sort_key
    TAY
    LDA vy,Y
    STA sort_y
sort_inner:
    CPX #$00
    BEQ sort_place
    LDY order-1,X
    LDA vy,Y
    CMP sort_y
    BCC sort_place
    BEQ sort_place
    TYA
    STA order,X
    DEX
    JMP sort_inner
sort_place:
    LDA sort_key
    STA order,X
    INC sort_i
    LDA sort_i
    CMP #NUM
    BNE sort_outer
    RTS
.endregion

.region Raster IRQs
irq_top:
    LDA #$FF
    STA $D019
    LDX #$00
top_loop:
    JSR show
    INX
    CPX #$08
    BNE top_loop
    STX next
    JMP mux_check

irq_mux:
    LDA #$FF
    STA $D019
mux_show:
    LDX next
    JSR show
    INX
    STX next
; X = next sorted sprite: show it now if its hardware sprite is free, else wait for that line
mux_check:
    CPX #NUM
    BEQ to_bottom
    LDY order-8,X
    LDA vy,Y
    CLC
    ADC #22
    STA irq_line
    LDA $D012
    CLC
    ADC #$03
    CMP irq_line
    BCS mux_show
    LDA irq_line
    STA $D012
    LDA #<irq_mux
    STA $0314
    LDA #>irq_mux
    STA $0315
    JMP $EA81

to_bottom:
    LDA #IRQ_BOTTOM
    STA $D012
    LDA #<irq_bottom
    STA $0314
    LDA #>irq_bottom
    STA $0315
    JMP $EA81

irq_bottom:
    LDA #$FF
    STA $D019
    INC frame_done
    INC ticks
    LDA ticks
    CMP #50
    BNE irq_bottom_next
    LDA #$00
    STA ticks
    LDA loops
    STA fps
    LDA #$00
    STA loops
irq_bottom_next:
    DEC hold
    BNE irq_bottom_hold
    LDA #HOLD
    STA hold
    INC speed_due
irq_bottom_hold:
    LDA #IRQ_TOP
    STA $D012
    LDA #<irq_top
    STA $0314
    LDA #>irq_top
    STA $0315
    JMP $EA81

; sorted sprite X -> hardware sprite X & 7 (X is preserved)
show:
    STX show_pos
    LDY order,X
    TXA
    AND #$07
    TAX
    LDA #SPR_PAGE
    STA $07F8,X
    LDA vcol_now,Y
    STA $D027,X
    LDA vxhi,Y
    BEQ show_msb_off
    LDA $D010
    ORA bitmask,X
    JMP show_msb
show_msb_off:
    LDA bitmask,X
    EOR #$FF
    AND $D010
show_msb:
    STA $D010
    TXA
    ASL
    TAX
    LDA vxlo,Y
    STA $D000,X
    LDA vy,Y
    STA $D001,X
    LDX show_pos
    RTS
.endregion

.region Data
bitmask:
.byte $01, $02, $04, $08, $10, $20, $40, $80
rowbase:
.byte $3A, $52, $6A, $82, $9A, $B2, $CA, $E2
xoff:
.byte $00, $20, $40, $60, $80, $A0, $C0, $E0, $10, $30, $50, $70, $90, $B0, $D0, $F0
.byte $20, $40, $60, $80, $A0, $C0, $E0, $00, $30, $50, $70, $90, $B0, $D0, $F0, $10
.byte $40, $60, $80, $A0, $C0, $E0, $00, $20, $50, $70, $90, $B0, $D0, $F0, $10, $30
.byte $60, $80, $A0, $C0, $E0, $00, $20, $40, $70, $90, $B0, $D0, $F0, $10, $30, $50
xoff2:
.byte $10, $30, $50, $70, $90, $B0, $D0, $F0, $38, $58, $78, $98, $B8, $D8, $F8, $18
.byte $60, $80, $A0, $C0, $E0, $00, $20, $40, $88, $A8, $C8, $E8, $08, $28, $48, $68
.byte $B0, $D0, $F0, $10, $30, $50, $70, $90, $D8, $F8, $18, $38, $58, $78, $98, $B8
.byte $00, $20, $40, $60, $80, $A0, $C0, $E0, $28, $48, $68, $88, $A8, $C8, $E8, $08
xoff3:
.byte $00, $25, $4A, $6F, $94, $B9, $DE, $03, $28, $4D, $72, $97, $BC, $E1, $06, $2B
.byte $50, $75, $9A, $BF, $E4, $09, $2E, $53, $78, $9D, $C2, $E7, $0C, $31, $56, $7B
.byte $A0, $C5, $EA, $0F, $34, $59, $7E, $A3, $C8, $ED, $12, $37, $5C, $81, $A6, $CB
.byte $F0, $15, $3A, $5F, $84, $A9, $CE, $F3, $18, $3D, $62, $87, $AC, $D1, $F6, $1B
rowof:
.byte $00, $00, $00, $00, $00, $00, $00, $00, $01, $01, $01, $01, $01, $01, $01, $01
.byte $02, $02, $02, $02, $02, $02, $02, $02, $03, $03, $03, $03, $03, $03, $03, $03
.byte $04, $04, $04, $04, $04, $04, $04, $04, $05, $05, $05, $05, $05, $05, $05, $05
.byte $06, $06, $06, $06, $06, $06, $06, $06, $07, $07, $07, $07, $07, $07, $07, $07
vcol:
.byte $02, $02, $02, $02, $02, $02, $02, $02, $08, $08, $08, $08, $08, $08, $08, $08
.byte $07, $07, $07, $07, $07, $07, $07, $07, $05, $05, $05, $05, $05, $05, $05, $05
.byte $0E, $0E, $0E, $0E, $0E, $0E, $0E, $0E, $03, $03, $03, $03, $03, $03, $03, $03
.byte $04, $04, $04, $04, $04, $04, $04, $04, $0A, $0A, $0A, $0A, $0A, $0A, $0A, $0A
; MHz of each speed index, as screen codes
mhz_text:
.byte $20, $31, $20, $32, $20, $33, $20, $34, $20, $36, $20, $38, $31, $30, $31, $32
.byte $31, $34, $31, $36, $32, $30, $32, $34, $33, $32, $34, $30, $34, $38, $36, $34
; speed indexes: 1, 2, 4, 8, 16, 32, 64, 32, 16, 8, 4, 2 MHz
speed_seq:
.byte $00, $01, $03, $05, $09, $0C, $0F, $0C, $09, $05, $03, $01, $FF
; signed sine, -4..+4
bob:
.byte $00, $00, $00, $00, $00, $00, $01, $01, $01, $01, $01, $01, $01, $01, $01, $01
.byte $02, $02, $02, $02, $02, $02, $02, $02, $02, $02, $02, $02, $03, $03, $03, $03
.byte $03, $03, $03, $03, $03, $03, $03, $03, $03, $03, $03, $03, $04, $04, $04, $04
.byte $04, $04, $04, $04, $04, $04, $04, $04, $04, $04, $04, $04, $04, $04, $04, $04
.byte $04, $04, $04, $04, $04, $04, $04, $04, $04, $04, $04, $04, $04, $04, $04, $04
.byte $04, $04, $04, $04, $04, $03, $03, $03, $03, $03, $03, $03, $03, $03, $03, $03
.byte $03, $03, $03, $03, $03, $02, $02, $02, $02, $02, $02, $02, $02, $02, $02, $02
.byte $02, $01, $01, $01, $01, $01, $01, $01, $01, $01, $01, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $FF, $FF, $FF, $FF, $FF, $FF, $FF, $FF, $FF, $FF
.byte $FE, $FE, $FE, $FE, $FE, $FE, $FE, $FE, $FE, $FE, $FE, $FE, $FD, $FD, $FD, $FD
.byte $FD, $FD, $FD, $FD, $FD, $FD, $FD, $FD, $FD, $FD, $FD, $FD, $FC, $FC, $FC, $FC
.byte $FC, $FC, $FC, $FC, $FC, $FC, $FC, $FC, $FC, $FC, $FC, $FC, $FC, $FC, $FC, $FC
.byte $FC, $FC, $FC, $FC, $FC, $FC, $FC, $FC, $FC, $FC, $FC, $FC, $FC, $FC, $FC, $FC
.byte $FC, $FC, $FC, $FC, $FC, $FD, $FD, $FD, $FD, $FD, $FD, $FD, $FD, $FD, $FD, $FD
.byte $FD, $FD, $FD, $FD, $FD, $FE, $FE, $FE, $FE, $FE, $FE, $FE, $FE, $FE, $FE, $FE
.byte $FE, $FF, $FF, $FF, $FF, $FF, $FF, $FF, $FF, $FF, $FF, $00, $00, $00, $00, $00
; sine 0..255
xtab:
.byte $80, $83, $86, $89, $8C, $90, $93, $96, $99, $9C, $9F, $A2, $A5, $A8, $AB, $AE
.byte $B1, $B3, $B6, $B9, $BC, $BF, $C1, $C4, $C7, $C9, $CC, $CE, $D1, $D3, $D5, $D8
.byte $DA, $DC, $DE, $E0, $E2, $E4, $E6, $E8, $EA, $EB, $ED, $EF, $F0, $F1, $F3, $F4
.byte $F5, $F6, $F8, $F9, $FA, $FA, $FB, $FC, $FD, $FD, $FE, $FE, $FE, $FF, $FF, $FF
.byte $FF, $FF, $FF, $FF, $FE, $FE, $FE, $FD, $FD, $FC, $FB, $FA, $FA, $F9, $F8, $F6
.byte $F5, $F4, $F3, $F1, $F0, $EF, $ED, $EB, $EA, $E8, $E6, $E4, $E2, $E0, $DE, $DC
.byte $DA, $D8, $D5, $D3, $D1, $CE, $CC, $C9, $C7, $C4, $C1, $BF, $BC, $B9, $B6, $B3
.byte $B1, $AE, $AB, $A8, $A5, $A2, $9F, $9C, $99, $96, $93, $90, $8C, $89, $86, $83
.byte $80, $7D, $7A, $77, $74, $70, $6D, $6A, $67, $64, $61, $5E, $5B, $58, $55, $52
.byte $4F, $4D, $4A, $47, $44, $41, $3F, $3C, $39, $37, $34, $32, $2F, $2D, $2B, $28
.byte $26, $24, $22, $20, $1E, $1C, $1A, $18, $16, $15, $13, $11, $10, $0F, $0D, $0C
.byte $0B, $0A, $08, $07, $06, $06, $05, $04, $03, $03, $02, $02, $02, $01, $01, $01
.byte $01, $01, $01, $01, $02, $02, $02, $03, $03, $04, $05, $06, $06, $07, $08, $0A
.byte $0B, $0C, $0D, $0F, $10, $11, $13, $15, $16, $18, $1A, $1C, $1E, $20, $22, $24
.byte $26, $28, $2B, $2D, $2F, $32, $34, $37, $39, $3C, $3F, $41, $44, $47, $4A, $4D
.byte $4F, $52, $55, $58, $5B, $5E, $61, $64, $67, $6A, $6D, $70, $74, $77, $7A, $7D
.endregion

.region Variables
frame_done:
.byte $00
ticks:
.byte $00
loops:
.byte $00
fps:
.byte $00
speed:
.byte $00
seq_pos:
.byte $00
speed_due:
.byte $00
hold:
.byte HOLD
phase:
.byte $00
phase_x:
.byte $00
phase_x2:
.byte $00
phase3:
.byte $00
slow:
.byte $00
ampx:
.byte $00
xbase:
.byte $00
bobv:
.byte $00
idx:
.byte $00
sum_lo:
.byte $00
sum_hi:
.byte $00
mul_a:
.byte $00
mul_b:
.byte $00
next:
.byte $00
irq_line:
.byte $00
show_pos:
.byte $00
sort_i:
.byte $00
sort_key:
.byte $00
sort_y:
.byte $00
rowy:
.byte $00, $00, $00, $00, $00, $00, $00, $00
order:
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00
vy:
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00
vxlo:
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00
vxhi:
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00
vcol_now:
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00
.endregion

* = $3000
ball:
.byte $00, $7E, $00, $01, $FF, $80, $07, $FF
.byte $E0, $0F, $FF, $F0, $1F, $FF, $F8, $1F
.byte $FF, $F8, $3F, $FF, $FC, $3F, $FF, $FC
.byte $3F, $FF, $FC, $3F, $FF, $FC, $3F, $FF
.byte $FC, $3F, $FF, $FC, $1F, $FF, $F8, $1F
.byte $FF, $F8, $0F, $FF, $F0, $07, $FF, $E0
.byte $01, $FF, $80, $00, $7E, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
