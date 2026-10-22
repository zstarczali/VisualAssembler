// LoadPicture: GIF without and with a colour table, single and multicolour bytes
* = $1000
.var p = LoadPicture("2x2char.gif")
.fill 64, p.getSinglecolorByte(i&7, 8+(i>>3))
.fill 64, p.getMulticolorByte(i&7, 8+(i>>3))
.byte p.width, p.height
.var q = LoadPicture("2x2char.gif", List().add($ffffff, $000000))
.fill 32, q.getSinglecolorByte(1+2*(i>>3), i&7)
.byte <q.getPixel(3, 9), >q.getPixel(3, 9)
