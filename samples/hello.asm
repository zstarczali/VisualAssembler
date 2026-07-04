* = $0801
.region Consts
.const _color = $0
.const _delay = 30
.const _newline = $0D
.endregion

.region Init
.charset lower
.set_border _color
.set_bg _color
.clear_screen
.endregion

.region Print
.print "hello world!", lower
.print_char _newline
.delay _delay
.print "HELLO WORLD!", lower
.print_char _newline
.delay _delay
.print "hello WORLD!", lower
.print_char _newline
.delay _delay
.print "HELLO world!", lower
.print_char _newline
.endregion

.end