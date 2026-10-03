* = $0801
; LEVEL demo — move around a Level Editor level with the joystick
; .level loads level.bin (2x5 screens, multicolor, ROM charset): only the placed
; screens + pointer tables, and defines LEVEL_* labels/constants.
; .level_row copies one 40-char level row (screen codes or colors) to a buffer.
;
; Joystick (port 2 or 1) moves the camera pixel by pixel in all directions:
; XSCROLL/YSCROLL ($D016/$D011, 38 columns / 24 rows) for the fine part,
; double-buffered screens ($0400 / $0C00) for the char steps.
; Char steps without stalls: the camera is predicted two frames ahead; when it
; will cross into a new char cell, the hidden buffer is built in two halves
; (13 + 12 rows, one per frame). Color RAM is copied in two halves too: rows
; 0..12 during the last old frame behind the beam, then the swap at line $FA
; and rows 13..24 ahead of the beam.
;
; Room for the game:
;   - all 8 sprites are free; the joystick is read into vx / vy / fire
;   - $2000-$3FFF (VIC bank 0) is free for a custom charset and sprite data,
;     $C000-$CFFF for game code / music; zero page is not used
;   - game_frame is called once per frame, after the camera moved: keep it
;     under ~7000 cycles (~110 raster lines). vx / vy (-1..1) drive the
;     camera; a game can set them from the player instead of the joystick

; $0400 and $0C00 are the two screen buffers, so the code lives at $9200
    JMP init

.level "level.bin", $4000
.assert LEVEL_END <= $9200, "level data runs into the code"

* = $9200
.region init
init:
    SEI
    .set_border 0
    LDA #LEVEL_BG
    STA $D021
    LDA #LEVEL_MC1
    STA $D022
    LDA #LEVEL_MC2
    STA $D023
    LDA #$FF                     ; no keyboard column selected -> clean joystick read
    STA $DC00

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
; or buffer swap + color copy), then read the input, decide the next frame and
; run the game. Building the hidden buffer never shares a frame with a color copy.
main_loop:
    LDA do_swap
    BEQ ml_wait
; rows 0..12 of the color RAM now, behind the beam (already drawn this frame)
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
    JMP frame_work
ml_fine:
    JSR set_fine
frame_work:
    JSR read_input
    JSR decide
    JSR game_frame
    JMP main_loop

; game_frame: the game's per-frame work (player, enemies, sprites, music ...)
game_frame:
    RTS
.endregion

.region camera
; read_input: vx / vy = joystick direction (-1, 0, +1), fire = 1 while pressed
read_input:
    .joystick 3, vx, vy, fire    ; port 3 = both ports, whichever is used
    RTS

; decide: move the camera by (vx, vy) inside the current char cell, or swap to
; the next cell when its buffer is ready; prepare the cell two frames ahead
decide:
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
    BNE dc_done
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
    BEQ dc_done
prepare:
    JMP want_cell
; new char cell: swap at the next $FA if the hidden buffer is ready, else build
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
    LDA #$01
    STA do_swap
    RTS
cross_build:
    LDA swapped                  ; after a color copy the camera just waits
    BNE dc_done
    JMP want_cell                ; camera waits until the buffer is ready
dc_done:
    RTS

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

; step_xy: (wx, wy) += (vx, vy), clamped to the level; ncx/ncy = its char cell
step_xy:
    LDA wx_lo
    STA t_lo
    LDA wx_hi
    STA t_hi
    LDA vx
    STA t_v
    LDA #<LEVEL_MAX_X
    STA max_lo
    LDA #>LEVEL_MAX_X
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
    LDA #<LEVEL_MAX_Y
    STA max_lo
    LDA #>LEVEL_MAX_Y
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
    ORA #LEVEL_MULTICOLOR*16     ; multicolor bit, 38 columns
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
; build_rows: hidden-buffer rows build_row .. build_end-1 for cell (view_x, next_y)
build_rows:
    LDA build_row
    CMP build_end
    LBEQ br_done                 ; .level_row is 132 bytes: long branch
    TAY
    LDA MUL40_LO,Y
    STA dst_lo
    CLC
    LDA MUL40_HI,Y
    ADC back_hi
    STA dst_hi
    TYA
    CLC
    ADC next_y
    TAX                          ; level row
    .level_row dst_lo, view_x
    INC build_row
    JMP build_rows
br_done:
    RTS

; copy_colors: color RAM rows cc_row .. cc_end-1 for cell (view_x, next_y)
copy_colors:
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
    TAX                          ; level row
    .level_row dst_lo, view_x, color
    INC cc_row
    LDA cc_row
    CMP cc_end
    LBNE copy_colors
    RTS
.endregion

.region data
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
fire:       .byte $00
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
dst_lo:     .byte $00
dst_hi:     .byte $00
.endregion

.assert * <= $A000, "code runs into the BASIC ROM area"
