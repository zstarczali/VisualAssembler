* = $0801
; LEVEL demo — move around a 2x5 screen level with the joystick
; Data: level.bin (Level Editor project: grid 2x5, multicolor, ROM charset)
;   payload = 14 library screens x 2000 bytes (1000 screen codes + 1000 colors)
;   slot -> screen: 0,1 / 3,4 / 6,7 / 9,10 / 12,13   (row-major, 2 columns)
; The level is 80x125 chars. Joystick (port 2 or 1) moves the camera pixel
; by pixel in all directions: XSCROLL/YSCROLL ($D016/$D011, 38 columns /
; 24 rows) for the fine part, double-buffered screens for the char steps.
;
; Joystick: the .joystick macro moves sprite 0's X/Y registers ($D000/$D001).
; The sprite is off; both registers are reset to $80 every frame, so after
; the macro they hold the joystick direction (-1 / 0 / +1).
;
; Char steps without stalls: the camera is predicted two frames ahead; when
; it will cross into a new char cell, the hidden buffer ($0400 / $0C00) is
; built for that cell in two halves (13 + 12 rows, one per frame). Color RAM
; is copied in two halves too: rows 0..12 during the last old frame, behind
; the beam, then the buffers swap at line $FA and rows 13..24 follow ahead of
; the beam. A direction change rebuilds (1-2 frame stall).

.const LEVEL     = $2000         ; level.bin loaded here
.const ROWL_LO   = $9000         ; per level row: left screen row pointer
.const ROWL_HI   = $9080
.const ROWR_LO   = $9100         ; per level row: right screen row pointer
.const ROWR_HI   = $9180
.const MAX_X     = 320           ; camera X range in pixels: (80 - 40) * 8
.const MAX_Y     = 800           ; camera Y range in pixels: (125 - 25) * 8
.const JOY_X     = $D000         ; sprite 0 X/Y: moved by .joystick
.const JOY_Y     = $D001

; $0400 and $0C00 are the two screen buffers, so the code lives at $9200
    JMP init

* = $9200
.region init
init:
    SEI
    .set_border 0
    .set_bg 6                    ; level bgColor
    LDA #$05                     ; mc1
    STA $D022
    LDA #$0D                     ; mc2
    STA $D023
    LDA #$00                     ; sprites off: sprite 0 X/Y only carry the joystick
    STA $D015
    LDA #$FF                     ; no keyboard column selected -> clean joystick read
    STA $DC00
    JSR build_tables

; camera at 0,0: draw the first view into $0400 + color RAM
    LDA #$00
    STA camx_lo
    STA camx_hi
    STA camy_lo
    STA camy_hi
    STA shx
    STA shy
    STA view_x
    STA next_y
    STA bstate
    LDA #$04
    STA back_hi
    LDA #$00
    STA build_row
    LDA #25
    STA build_end
    JSR build_rows
    LDA #$00
    STA cc_row
    LDA #25
    STA cc_end
    JSR copy_colors
    LDA #$14                     ; screen $0400, charset $1000
    STA $D018
    JSR set_fine
; from now on $0C00 is the hidden buffer
    LDA #$0C
    STA back_hi
    LDA #$34
    STA back_d018
.endregion

.region main_loop
; Each frame: at line $FA apply what the previous frame decided (fine scroll,
; or buffer swap + color copy), then read the joystick and decide the next
; frame. Building the hidden buffer never shares a frame with a color copy.
main_loop:
    LDA do_swap
    BEQ ml_wait
; color RAM of a swap is split: rows 0..12 now, behind the beam (it has
; already drawn them in this last old frame), rows 13..24 after the swap
    .wait_raster $46             ; line 70: the beam is below row 0
    LDA #$00
    STA cc_row
    LDA #13
    STA cc_end
    JSR copy_colors
ml_wait:
    .wait_raster $FA
    LDA do_swap
    STA swapped
    LDA #$00
    STA do_swap
    LDA swapped
    BEQ ml_fine
    LDA back_d018
    STA $D018
    JSR set_fine
    LDA #13                      ; rows 13..24, ahead of the beam
    STA cc_row
    LDA #25
    STA cc_end
    JSR copy_colors
    LDA back_hi
    EOR #$08                     ; $04 <-> $0C
    STA back_hi
    LDA back_d018
    EOR #$20                     ; $14 <-> $34
    STA back_d018
    LDA tx
    STA shx
    LDA ty
    STA shy
    LDA #$00
    STA bstate
    JMP decide
ml_fine:
    JSR set_fine

decide:
    LDA #$80
    STA JOY_X
    STA JOY_Y
    .joystick 2, 0               ; up/down -> DEC/INC $D001, left/right -> $D000
    .joystick 1, 0               ; port 1 too, whichever the emulator uses
    LDA JOY_X
    SEC
    SBC #$80
    STA vx
    LDA JOY_Y
    SEC
    SBC #$80
    STA vy

; new camera = clamp(camera + v)
    JSR load_cam
    JSR step_xy
    LDA ncx
    CMP shx
    BNE crossing
    LDA ncy
    CMP shy
    BNE crossing

; same char cell: move (shown at the next $FA), prepare the next cell if needed
    JSR store_cam
    LDA swapped                  ; no building after a color copy
    LBNE main_loop
    JSR step_xy                  ; one frame ahead
    LDA ncx
    CMP shx
    BNE prepare
    LDA ncy
    CMP shy
    BNE prepare
    JSR step_xy                  ; two frames ahead
    LDA ncx
    CMP shx
    BNE prepare
    LDA ncy
    CMP shy
    LBEQ main_loop
prepare:
    JSR want_cell
    JMP main_loop

; new char cell: swap if the hidden buffer is ready for it, else build it
crossing:
    LDA bstate
    CMP #$02
    BNE cross_build
    LDA tx
    CMP ncx
    BNE cross_build
    LDA ty
    CMP ncy
    BNE cross_build
    JSR store_cam
    LDA #$01                     ; swap at the next $FA
    STA do_swap
    JMP main_loop
cross_build:
    LDA swapped                  ; after a color copy the camera just waits
    LBNE main_loop
    JSR want_cell                ; camera waits until the buffer is ready
    JMP main_loop
.endregion

.region camera
; load_cam: work position (wx, wy) = camera
load_cam:
    LDA camx_lo
    STA wx_lo
    LDA camx_hi
    STA wx_hi
    LDA camy_lo
    STA wy_lo
    LDA camy_hi
    STA wy_hi
    RTS

store_cam:
    LDA wx_lo
    STA camx_lo
    LDA wx_hi
    STA camx_hi
    LDA wy_lo
    STA camy_lo
    LDA wy_hi
    STA camy_hi
    RTS

; step_xy: (wx, wy) += (vx, vy), clamped; ncx/ncy = char cell of the result
step_xy:
    LDA wx_lo
    STA t_lo
    LDA wx_hi
    STA t_hi
    LDA vx
    STA t_v
    LDA #<MAX_X
    STA max_lo
    LDA #>MAX_X
    STA max_hi
    JSR add_clamp
    LDA t_lo
    STA wx_lo
    LDA t_hi
    STA wx_hi
    JSR cell_of_t
    STA ncx
    LDA wy_lo
    STA t_lo
    LDA wy_hi
    STA t_hi
    LDA vy
    STA t_v
    LDA #<MAX_Y
    STA max_lo
    LDA #>MAX_Y
    STA max_hi
    JSR add_clamp
    LDA t_lo
    STA wy_lo
    LDA t_hi
    STA wy_hi
    JSR cell_of_t
    STA ncy
    RTS

; add_clamp: t = clamp(t + t_v, 0, max)   (t_v signed)
add_clamp:
    LDA t_v
    BEQ ac_done
    BPL ac_pos
    CLC
    LDA t_lo
    ADC t_v
    STA t_lo
    LDA t_hi
    ADC #$FF
    STA t_hi
    BPL ac_done
    LDA #$00
    STA t_lo
    STA t_hi
    RTS
ac_pos:
    CLC
    LDA t_lo
    ADC t_v
    STA t_lo
    LDA t_hi
    ADC #$00
    STA t_hi
    CMP max_hi
    BCC ac_done
    BNE ac_set
    LDA t_lo
    CMP max_lo
    BCC ac_done
ac_set:
    LDA max_lo
    STA t_lo
    LDA max_hi
    STA t_hi
ac_done:
    RTS

; cell_of_t: A = t / 8
cell_of_t:
    LDA t_hi
    STA t_v
    LDA t_lo
    LSR t_v
    ROR
    LSR t_v
    ROR
    LSR t_v
    ROR
    RTS

; set_fine: XSCROLL / YSCROLL = 7 - (camera & 7)
set_fine:
    LDA camx_lo
    AND #$07
    EOR #$07
    ORA #$D0                     ; multicolor, 38 columns
    STA $D016
    LDA camy_lo
    AND #$07
    EOR #$07
    ORA #$10                     ; display on, 24 rows
    STA $D011
    RTS

; want_cell: make the hidden buffer show cell (ncx, ncy) — one half per call
want_cell:
    LDA bstate
    BEQ wc_new
    LDA tx
    CMP ncx
    BNE wc_new
    LDA ty
    CMP ncy
    BNE wc_new
    LDA bstate
    CMP #$02
    BEQ wc_done
    LDA #13                      ; second half: rows 13..24
    STA build_row
    LDA #25
    STA build_end
    JSR build_rows
    LDA #$02
    STA bstate
    RTS
wc_new:
    LDA ncx
    STA tx
    STA view_x
    LDA ncy
    STA ty
    STA next_y
    LDA #$00                     ; first half: rows 0..12
    STA build_row
    LDA #13
    STA build_end
    JSR build_rows
    LDA #$01
    STA bstate
wc_done:
    RTS
.endregion

.region drawing
; build_rows: draw hidden-buffer rows build_row .. build_end-1
build_rows:
    LDA build_row
    CMP build_end
    BEQ br_done
    JSR draw_back_row
    JMP build_rows
br_done:
    RTS

draw_back_row:
    LDY build_row
    LDA MUL40_LO,Y
    STA dst_lo
    CLC
    LDA MUL40_HI,Y
    ADC back_hi
    STA dst_hi
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

; copy_colors: color RAM rows cc_row .. cc_end-1 for cell (view_x, next_y)
copy_colors:
    LDA #$E8                     ; colors follow the 1000 screen codes
    STA src_add_lo
    LDA #$03
    STA src_add_hi
cc_loop:
    LDY cc_row
    LDA MUL40_LO,Y
    STA dst_lo
    CLC
    LDA MUL40_HI,Y
    ADC #$D8
    STA dst_hi
    TYA
    CLC
    ADC next_y
    TAX
    JSR copy_row
    INC cc_row
    LDA cc_row
    CMP cc_end
    BNE cc_loop
    RTS

; copy_row: 40 bytes of level row X, from column view_x, to dst
;   left part  = left screen,  columns view_x..39  (n1 = 40 - view_x bytes)
;   right part = right screen, columns 0..view_x-1 (to dst + n1)
; Source/target addresses are patched into the LDA/STA operands.
copy_row:
    LDA #40
    SEC
    SBC view_x
    STA n1
    BEQ cr_right_setup
    CLC
    LDA ROWL_LO,X
    ADC view_x
    STA cr_lsrc+1
    LDA ROWL_HI,X
    ADC #$00
    STA cr_lsrc+2
    CLC
    LDA cr_lsrc+1
    ADC src_add_lo
    STA cr_lsrc+1
    LDA cr_lsrc+2
    ADC src_add_hi
    STA cr_lsrc+2
    LDA dst_lo
    STA cr_ldst+1
    LDA dst_hi
    STA cr_ldst+2
    LDY n1
    DEY
cr_lsrc:
    LDA $FFFF,Y
cr_ldst:
    STA $FFFF,Y
    DEY
    BPL cr_lsrc
cr_right_setup:
    LDA view_x
    BEQ cr_done
    CLC
    LDA ROWR_LO,X
    ADC src_add_lo
    STA cr_rsrc+1
    LDA ROWR_HI,X
    ADC src_add_hi
    STA cr_rsrc+2
    CLC
    LDA dst_lo
    ADC n1
    STA cr_rdst+1
    LDA dst_hi
    ADC #$00
    STA cr_rdst+2
    LDY view_x
    DEY
cr_rsrc:
    LDA $FFFF,Y
cr_rdst:
    STA $FFFF,Y
    DEY
    BPL cr_rsrc
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
camx_lo:    .byte $00
camx_hi:    .byte $00
camy_lo:    .byte $00
camy_hi:    .byte $00
wx_lo:      .byte $00
wx_hi:      .byte $00
wy_lo:      .byte $00
wy_hi:      .byte $00
vx:         .byte $00
vy:         .byte $00
ncx:        .byte $00
ncy:        .byte $00
shx:        .byte $00
shy:        .byte $00
tx:         .byte $00
ty:         .byte $00
bstate:     .byte $00
do_swap:    .byte $00
swapped:    .byte $00
t_lo:       .byte $00
t_hi:       .byte $00
t_v:        .byte $00
max_lo:     .byte $00
max_hi:     .byte $00
next_y:     .byte $00
view_x:     .byte $00
build_row:  .byte $00
build_end:  .byte $00
back_hi:    .byte $00
back_d018:  .byte $00
cc_row:     .byte $00
cc_end:     .byte $00
n1:         .byte $00
dst_lo:     .byte $00
dst_hi:     .byte $00
src_add_lo: .byte $00
src_add_hi: .byte $00
slot_row:   .byte $00
bt_count:   .byte $00
lp_lo:      .byte $00
lp_hi:      .byte $00
rp_lo:      .byte $00
rp_hi:      .byte $00
.endregion

.assert * <= $A000, "code runs into the BASIC ROM area"

.incbin "level.bin", $2000
