* = $0801
.include "macros-new.asm", $1500

    SEI

    JSR DisplayOff
    JSR HiresBitmapMode
    JSR DoubleBufferSetup

    JSR ClearScreen
    JSR DrawDemoFrame
    JSR DoubleBufferSwap
    JSR DisplayOn
    JSR WaitKey

    JSR TextMode
.clear_screen
    RTS
