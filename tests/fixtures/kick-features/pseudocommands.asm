* = $1000
.pseudocommand mov src:tar {
 lda src
 sta tar
}
.function next(arg) {
 .if (arg.getType()==AT_IMMEDIATE) .return CmdArgument(arg.getType(),>arg.getValue())
 .return CmdArgument(arg.getType(),arg.getValue()+1)
}
.pseudocommand mov16 src:tar {
 lda src
 sta tar
 lda next(src)
 sta next(tar)
}
.pseudocommand add16 a : b : tar {
 .if (tar.getType()==AT_NONE) .eval tar=a
 clc
 lda a
 adc b
 sta tar
 lda next(a)
 adc next(b)
 sta next(tar)
}
 mov #10 : $1000
 mov $20,x : $30,y
 mov #20 : ($30),y
 mov16 #$1234 : $fb
 add16 $30 : #128
 add16 $30 : #$1000 : $32
 :mov ($40,x) : $41
