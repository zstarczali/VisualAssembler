* = $0c00
.var music = LoadSid("t.sid")
.var pic = LoadBinary("pic.bin", "C64FILE, Bitmap=0, Screen=8, Extra=11")
 lda #music.startSong-1
 jsr music.init
 jsr music.play
 lda #<music.location
 lda #music.size
 lda #music.songs
.byte pic.getBitmapSize(), pic.getScreenSize(), pic.getExtraSize(), pic.getSize()
.fill pic.getScreenSize(), pic.getScreen(i)
.byte pic.uget(11), pic.get(12) & $ff
.text music.name
* = $2000 "Virtual" virtual
vbuf: .fill 16, 0
vend:
* = $1100 "After"
 lda #<vend
 lda #>vbuf
* = music.location "Music"
.fill music.size, music.getData(i)
