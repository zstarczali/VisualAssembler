; @name Empty game
; @name.hu Üres játék
; @category Game
; @category.hu Játék
; @desc Game skeleton: title / play / game over states, frame-synced main loop, joystick (port 2) and one sprite as the player.
; @desc.hu Játék váz: cím / játék / vége állapotok, képkockához szinkronizált főciklus, joystick (2-es port) és egy sprite játékosnak.
; @order 20

; {{PROJECT}}
; Joystick in port 2 (VICE: numpad or joy2). Fire starts the game,
; fire again ends it, fire on the game over screen returns to the title.

* = $0801

.const STATE_TITLE = 0
.const STATE_PLAY = 1
.const STATE_OVER = 2
.const PLAYER_COLOR = 7
; Sprite data sits at $0840 below, so its data page is $0840 / 64 = $21
.const PLAYER_PAGE = $21

    JMP init

; Sprite data must start on a 64-byte boundary and be exactly 64 bytes long
.align 64
player_sprite:
.byte $00, $7E, $00, $00, $FF, $00, $01, $FF
.byte $80, $03, $FF, $C0, $07, $FF, $E0, $0F
.byte $FF, $F0, $1F, $FF, $F8, $1F, $FF, $F8
.byte $1F, $FF, $F8, $1F, $FF, $F8, $1F, $FF
.byte $F8, $0F, $FF, $F0, $07, $FF, $E0, $03
.byte $FF, $C0, $01, $FF, $80, $00, $FF, $00
.byte $00, $7E, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00

.region Init
init:
    SEI
    LDA #$00
    STA $D020
    STA $D021
    STA fire_prev
    JSR enter_title
.endregion

.region Main loop
; One pass per frame: wait for the bottom of the screen, then run the current state
main_loop:
.wait_raster $FF
    JSR read_fire
    LDA game_state
    CMP #STATE_PLAY
    BEQ do_play
    CMP #STATE_OVER
    BEQ do_over
    JSR update_title
    JMP main_loop
do_play:
    JSR update_play
    JMP main_loop
do_over:
    JSR update_over
    JMP main_loop
.endregion

.region Title
enter_title:
    LDA #STATE_TITLE
    STA game_state
    LDA #$00
    STA $D015
    JSR $E544
.text 16, 9, "new game"
.text 15, 12, "press fire"
    RTS

update_title:
    LDA fire_hit
    BEQ title_done
    JSR enter_play
title_done:
    RTS
.endregion

.region Play
enter_play:
    LDA #STATE_PLAY
    STA game_state
    JSR $E544
.sprite_init 0, PLAYER_COLOR, PLAYER_PAGE
.sprite_pos 0, 172, 140
    RTS

update_play:
; Moves sprite 0 with the joystick in port 2
.joystick 2, 0
; TODO: enemies, collisions, score. For now fire ends the game.
    LDA fire_hit
    BEQ play_done
    JSR enter_over
play_done:
    RTS
.endregion

.region Game over
enter_over:
    LDA #STATE_OVER
    STA game_state
    LDA #$00
    STA $D015
    JSR $E544
.text 15, 10, "game over"
.text 15, 14, "press fire"
    RTS

update_over:
    LDA fire_hit
    BEQ over_done
    JSR enter_title
over_done:
    RTS
.endregion

.region Input
; fire_hit = 1 only on the frame the fire button goes down
read_fire:
    LDA #$00
    STA fire_hit
    LDA $DC00
    AND #$10
    EOR #$10
    TAX
    BEQ fire_store
    LDA fire_prev
    BNE fire_store
    INC fire_hit
fire_store:
    STX fire_prev
    RTS
.endregion

game_state:
.byte $00
fire_hit:
.byte $00
fire_prev:
.byte $00
