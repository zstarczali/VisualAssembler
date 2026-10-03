* = $0801
; LEVEL demo — smooth vertical scroll through a 2x5 screen level
; Data: level.bin (Level Editor project: grid 2x5, multicolor, ROM charset)
;   payload = 14 library screens x 2000 bytes (1000 screen codes + 1000 colors)
;   slot -> screen: 0,1 / 3,4 / 6,7 / 9,10 / 12,13   (row-major, 2 columns)
; The level is 80x125 chars; the 40x25 view scrolls down 1 px/frame and loops.
; Joystick port 2: left/right = pan by one char, fire = pause.
;
; Double buffer: screen $0400 / $0C00, ROM charset $1000 (VIC bank 0).
; While YSCROLL counts 7 -> 0 the hidden buffer is built 4 rows per frame;
; at the coarse step the buffers swap and color RAM is copied from line $FA,
; staying ahead of the beam.

.const LEVEL     = $2000         ; level.bin loaded here
.const ROWL_LO   = $9000         ; per level row: left screen row pointer
.const ROWL_HI   = $9080
.const ROWR_LO   = $9100         ; per level row: right screen row pointer
.const ROWR_HI   = $9180
.const LAST_Y    = 100           ; 125 level rows - 25 visible
.const SRC       = $FB           ; zp pointer: source row
.const DST       = $FD           ; zp pointer: destination row

.region init
    SEI
    LDA #$00
    STA $D020
    LDA #$06                     ; level bgColor
    STA $D021
    LDA #$05                     ; mc1
    STA $D022
    LDA #$0D                     ; mc2
    STA $D023
    LDA #$D8                     ; multicolor text, 40 columns
    STA $D016
    JSR build_tables

; first view: level row 0 into $0400 + color RAM
    LDA #$00
    STA next_y
    STA build_x
    STA build_row
    LDA #$04
    STA back_hi
    JSR build_finish
    JSR copy_colors
    LDA #$14                     ; screen $0400, charset $1000
    STA $D018
    LDA #$17                     ; 24 rows, display on, YSCROLL 7
    STA $D011
    LDA #$07
    STA fine

; start building level row 1 into $0C00
    LDA #$0C
    STA back_hi
    LDA #$34
    STA back_d018
    LDA #$01
    STA next_y
    LDA #$00
    STA build_row
.endregion

.region main_loop
main_loop:
-   LDA $D012
    CMP #$FA
    BNE -
    JSR read_joy
    LDA paused
    BNE frame_end
    LDA fine
    BEQ coarse
    DEC fine
    LDA fine
    ORA #$10
    STA $D011
    JSR build_step
    JMP frame_end

coarse:
    JSR build_finish             ; make sure the hidden buffer is complete
    LDA back_d018
    STA $D018
    LDA #$17
    STA $D011
    LDA #$07
    STA fine
    JSR copy_colors              ; races the beam from line $FA
; swap buffers: the old front becomes the new back buffer
    LDA back_hi
    EOR #$08                     ; $04 <-> $0C
    STA back_hi
    LDA back_d018
    EOR #$20                     ; $14 <-> $34
    STA back_d018
; next level row (loop at the end), latch the joystick column
    INC next_y
    LDA next_y
    CMP #LAST_Y+1
    BNE +
    LDA #$00
    STA next_y
+   LDA map_x
    STA build_x
    LDA #$00
    STA build_row

frame_end:
-   LDA $D012
    CMP #$FA
    BEQ -
    JMP main_loop
.endregion

.region joystick
; port 2: bit 2 left, bit 3 right, bit 4 fire (active low)
read_joy:
    LDA $DC00
    STA joy
    AND #$10
    CMP fire_prev
    BEQ rj_move
    STA fire_prev
    CMP #$00
    BNE rj_move
    LDA paused
    EOR #$01
    STA paused
rj_move:
    DEC joy_delay
    BPL rj_done
    LDA #$03
    STA joy_delay
    LDA joy
    AND #$04
    BNE rj_right
    LDA map_x
    BEQ rj_right
    DEC map_x
rj_right:
    LDA joy
    AND #$08
    BNE rj_done
    LDA map_x
    CMP #40
    BEQ rj_done
    INC map_x
rj_done:
    RTS
.endregion

.region drawing
; build_step: draw up to 4 rows of the hidden buffer (level row next_y + r)
build_step:
    LDA #$04
    STA rows_left
bs_loop:
    LDA build_row
    CMP #25
    BEQ bs_done
    JSR draw_back_row
    DEC rows_left
    BNE bs_loop
bs_done:
    RTS

; build_finish: draw every remaining row of the hidden buffer
build_finish:
    LDA build_row
    CMP #25
    BEQ bf_done
    JSR draw_back_row
    JMP build_finish
bf_done:
    RTS

draw_back_row:
    LDY build_row
    LDA MUL40_LO,Y
    STA DST
    CLC
    LDA MUL40_HI,Y
    ADC back_hi
    STA DST+1
    TYA
    CLC
    ADC next_y
    TAX
    LDA #$00
    STA src_add_lo
    STA src_add_hi
    JSR copy_row
    INC build_row
    RTS

; copy_colors: color RAM for level row next_y, column build_x
copy_colors:
    LDA #$E8                     ; colors follow the 1000 screen codes
    STA src_add_lo
    LDA #$03
    STA src_add_hi
    LDA #$00
    STA cc_row
cc_loop:
    LDY cc_row
    LDA MUL40_LO,Y
    STA DST
    CLC
    LDA MUL40_HI,Y
    ADC #$D8
    STA DST+1
    TYA
    CLC
    ADC next_y
    TAX
    JSR copy_row
    INC cc_row
    LDA cc_row
    CMP #25
    BNE cc_loop
    RTS

; copy_row: 40 bytes of level row X from column build_x to (DST)
;   left part  = left screen,  columns build_x..39  -> Y = 0..n1-1
;   right part = right screen, columns 0..build_x-1 -> Y = n1..39
copy_row:
    LDA #40
    SEC
    SBC build_x
    STA n1
    TAY                          ; Y = 0 when n1 = 0 -> no left part
    BEQ cr_right_setup
    CLC
    LDA ROWL_LO,X
    ADC build_x
    STA SRC
    LDA ROWL_HI,X
    ADC #$00
    STA SRC+1
    CLC
    LDA SRC
    ADC src_add_lo
    STA SRC
    LDA SRC+1
    ADC src_add_hi
    STA SRC+1
    LDY #$00
cr_left:
    LDA (SRC),Y
    STA (DST),Y
    INY
    CPY n1
    BNE cr_left
    CPY #40
    BEQ cr_done
cr_right_setup:
    SEC                          ; SRC = right row - n1, Y continues from n1
    LDA ROWR_LO,X
    SBC n1
    STA SRC
    LDA ROWR_HI,X
    SBC #$00
    STA SRC+1
    CLC
    LDA SRC
    ADC src_add_lo
    STA SRC
    LDA SRC+1
    ADC src_add_hi
    STA SRC+1
cr_right:
    LDA (SRC),Y
    STA (DST),Y
    INY
    CPY #40
    BNE cr_right
cr_done:
    RTS

; build_tables: row pointers for all 125 level rows (5 slot rows x 25)
build_tables:
    LDX #$00
    LDA #$00
    STA slot_row
bt_slot:
    LDY slot_row
    LDA SLOTL_LO,Y
    STA lp_lo
    LDA SLOTL_HI,Y
    STA lp_hi
    LDA SLOTR_LO,Y
    STA rp_lo
    LDA SLOTR_HI,Y
    STA rp_hi
    LDA #25
    STA bt_count
bt_row:
    LDA lp_lo
    STA ROWL_LO,X
    LDA lp_hi
    STA ROWL_HI,X
    LDA rp_lo
    STA ROWR_LO,X
    LDA rp_hi
    STA ROWR_HI,X
    CLC
    LDA lp_lo
    ADC #40
    STA lp_lo
    LDA lp_hi
    ADC #$00
    STA lp_hi
    CLC
    LDA rp_lo
    ADC #40
    STA rp_lo
    LDA rp_hi
    ADC #$00
    STA rp_hi
    INX
    DEC bt_count
    BNE bt_row
    INC slot_row
    LDA slot_row
    CMP #5
    BNE bt_slot
    RTS
.endregion

.region data
; screen base = LEVEL + index * 2000 (left column: 0,3,6,9,12 / right: 1,4,7,10,13)
SLOTL_LO:
    .byte $00, $70, $E0, $50, $C0
SLOTL_HI:
    .byte $20, $37, $4E, $66, $7D
SLOTR_LO:
    .byte $D0, $40, $B0, $20, $90
SLOTR_HI:
    .byte $27, $3F, $56, $6E, $85
; r * 40, r = 0..24
MUL40_LO:
    .byte $00, $28, $50, $78, $A0, $C8, $F0, $18, $40, $68, $90, $B8, $E0
    .byte $08, $30, $58, $80, $A8, $D0, $F8, $20, $48, $70, $98, $C0
MUL40_HI:
    .byte $00, $00, $00, $00, $00, $00, $00, $01, $01, $01, $01, $01, $01
    .byte $02, $02, $02, $02, $02, $02, $02, $03, $03, $03, $03, $03

; variables
next_y:     .byte $00
map_x:      .byte $00
build_x:    .byte $00
build_row:  .byte $00
back_hi:    .byte $00
back_d018:  .byte $00
fine:       .byte $00
paused:     .byte $00
joy:        .byte $00
fire_prev:  .byte $10
joy_delay:  .byte $00
rows_left:  .byte $00
cc_row:     .byte $00
n1:         .byte $00
src_add_lo: .byte $00
src_add_hi: .byte $00
slot_row:   .byte $00
bt_count:   .byte $00
lp_lo:      .byte $00
lp_hi:      .byte $00
rp_lo:      .byte $00
rp_hi:      .byte $00
.endregion

.assert * <= $0C00, "code overlaps the second screen buffer at $0C00"

.incbin "level.bin", $2000
