* = $0801
; ==========================================
; INCLUDE demo — double-buffered hires drawing
; ==========================================
; Uses macros-new.vas library:
; BitmapOn / BitmapOff / DbufSetup / DbufSwap
; ClearBitmap / SetColor / DrawLine / PlotPixel
; ==========================================
.include "macros-new.vas", $1500

.region Main
    SEI
    JSR $E544
.invoke StartScreen
.invoke WaitForKey
; Enter hires mode (bank 0, bitmap $2000)
.invoke BitmapOn
; Setup double buffer: VIC shows bank0 ($2000), draws to bank1 ($6000)
.invoke DbufSetup

; Fill bank0 screen matrix with white-on-black. DbufSetup already filled bank1.
.invoke SetColor(1,0)
; Clear bank1 bitmap (current draw target = $6000)
.invoke ClearBitmap
; Draw first frame into bank1 (still hidden)
.invoke DrawLine(0,0,200,199)
.invoke DrawLine(200,0,0,199)
.invoke PlotPixel(100,100)
; Swap: bank1 becomes visible, draw target = bank0 ($2000)
.invoke DbufSwap
; User sees frame 1
.invoke WaitForKey
; Clear bank0 bitmap (new draw target)
.invoke ClearBitmap
; Draw a different pattern into bank0
.invoke DrawLine(0,0,319,0)
.invoke DrawLine(0,199,319,199)
.invoke DrawLine(0,0,0,199)
.invoke DrawLine(319,0,319,199)
.invoke DrawLine(0,50,319,150)
.invoke DrawLine(0,150,319,50)
; Swap: bank0 becomes visible with frame 2
.invoke DbufSwap
; User sees frame 2
.invoke WaitForKey
.invoke BitmapOff
    RTS

.endregion

.region Macros
.macro StartScreen
.set_border $00
.set_bg $00
    JSR $E544
.text 1, 1, "double-buffered hires demo"
.text 1, 3, "press key: frame 1 (diagonals + pixel)"
.text 1, 4, "press key: frame 2 (border + cross)"
.text 1, 5, "press key: exit to text mode"
.endm
.endregion