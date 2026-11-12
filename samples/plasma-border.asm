;  PlasmaBorder - moving plasma in the border, alongside BASIC
;  Ultimate 64 Elite-II / Commodore 64 Ultimate, 64 MHz turbo, PAL and NTSC
;
;  Usage:
;    LOAD“PLASMABORDER”,8,1
;    SYS 49152        turn on (64 MHz + plasma in the border)
;    SYS 49155        turn off (IRQ is restored, turbo remains active)
; assembled by R65 and written as VMA; each Kick source line is the comment of its code
; You can run only on Commodore 64 Ultimate or Ultimate emulator

.const LEFT_WAIT = $0C
.const ZA = $FB
.const DISP_FIRST = $33
.const NTSC_FIRST = $1C

.macro WaitCycles(n)
    LDX #{n}
lp:
    BIT $DC02
    DEX
    BNE lp ; lapatlepes itt nem baj: az olvasas ujraigazit
.endm

.macro PlPreset(unused)
    LDA P,Y
    TAX
    LDA CT_2,X
    STA $D020
    LDA tmpX
.endm

.macro SyncLine(unused)
w:
    CMP $D012
    BNE w
    BIT $DC02
.endm

* = $B000
plFull:
.invoke WaitCycles(LEFT_WAIT) ; :WaitCycles(LEFT_WAIT)
    LDA P,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+1,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+2,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+3,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+4,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+5,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+6,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+7,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+8,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+9,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+10,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+11,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+12,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+13,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+14,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+15,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    BIT $DC02
    LDA P+16,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+17,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+18,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+19,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+20,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+21,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+22,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+23,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+24,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+25,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+26,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+27,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+28,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+29,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+30,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+31,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    BIT $DC02
    LDA P+32,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+33,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+34,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+35,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+36,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+37,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+38,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+39,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+40,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+41,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+42,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+43,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+44,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+45,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+46,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+47,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    BIT $DC02
    LDA P+48,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+49,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+50,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+51,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+52,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+53,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+54,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+55,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+56,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+57,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+58,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+59,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+60,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+61,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+62,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+63,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    BIT $DC02
    LDA P+64,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+65,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+66,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+67,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+68,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+69,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+70,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+71,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+72,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+73,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+74,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+75,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+76,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+77,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+78,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+79,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    BIT $DC02
    LDA P+80,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+81,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+82,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+83,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+84,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+85,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+86,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+87,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+88,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+89,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+90,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+91,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+92,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+93,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+94,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+95,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    BIT $DC02
    LDA P+96,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+97,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+98,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+99,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+100,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+101,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+102,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+103,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+104,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+105,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+106,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+107,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+108,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+109,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+110,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+111,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    BIT $DC02
    LDA P+112,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+113,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+114,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+115,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+116,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+117,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+118,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+119,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+120,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+121,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+122,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+123,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+124,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+125,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+126,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+127,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    BIT $DC02
    LDA P+128,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+129,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+130,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+131,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+132,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+133,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+134,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+135,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+136,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+137,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+138,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+139,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+140,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+141,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+142,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+143,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    BIT $DC02
    LDA P+144,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+145,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+146,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+147,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+148,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+149,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+150,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+151,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+152,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+153,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+154,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+155,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+156,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+157,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+158,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+159,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    BIT $DC02
    LDA P+160,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+161,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+162,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+163,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+164,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+165,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+166,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+167,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+168,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+169,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+170,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+171,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+172,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+173,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+174,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+175,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    BIT $DC02
    LDA P+176,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+177,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+178,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+179,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+180,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+181,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+182,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+183,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+184,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+185,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+186,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+187,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+188,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+189,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+190,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+191,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    BIT $DC02
    RTS

* = $C000
    JMP install ; jmp install // SYS 49152
    JMP remove ; jmp remove // SYS 49155
fcnt:
.byte $00 ; .byte 0
tmpX:
.byte $00 ; .byte 0
t1:
.byte $00 ; .byte 0
t2:
.byte $00 ; .byte 0
t3:
.byte $00 ; .byte 0
t4:
.byte $00 ; .byte 0
t5:
.byte $00 ; .byte 0
a1:
.byte $00 ; .byte 0
a2:
.byte $00 ; .byte 0
midK:
.byte $2C ; .byte 44 // kozepso ugras (merve)
midKb:
.byte $2C ; .byte 44 // ugyanez badline-on
kBadNow:
.byte $2C ; .byte 44 // az aktualis kepkockara (DEN=0: nincs badline)
ys:
.byte $03 ; .byte 3 // $d011 & 7: badline, ha (sor & 7) == ys
mlLine:
.byte $00 ; .byte 0
kLo:
.byte $00 ; .byte 0
kHi:
.byte $00 ; .byte 0
kNorm:
.byte $00 ; .byte 0
firstLine:
.byte $10 ; .byte VIS_FIRST // elso rajzolt sor
lastHi:
.byte $20 ; .byte VIS_LAST - 255 // a 256. sor utani rajzolt sorok szama
irqLine:
.byte $06 ; .byte IRQ_LINE
maxLow:
.byte $00 ; .byte 0
cpl:
.byte $3F ; .byte 63 // VIC-ciklus / sor
installed:
.byte $00 ; .byte 0
install:
    JSR fixBasic
    SEI
    LDA #<irq
    STA $0314
    LDA #>irq
    STA $0315
    LDA installed ; lda installed // ujrahivasnal nem kell ujra merni
    BNE irqOn
    JSR plasmaUpdate
    LDA $D031 ; lda $d031 // 64 MHz, badline szunet nelkul
    ORA #$8F
    STA $D031
waitTurbo:
    LDA $D012
L_C03E:
    CMP $D012
    BEQ L_C03E ; beq !-
    LDA $D012
    LDX #$C7 ; ldx #k
lp:
    DEX
    BNE lp
    NOP
    NOP
    CMP $D012
    BNE waitTurbo
    JSR detect
    JSR calibrate
    JSR measStall
    INC installed
irqOn:
    LDA $D031 ; lda $d031 // (ha kozben valaki visszaallitotta)
    ORA #$8F
    STA $D031
    LDA irqLine
    STA $D012
    LDA $D011
    AND #$7F
    STA $D011
    LDA #$01 ; lda #1
    STA $D01A
    LDA #$FF
    STA $D019
    CLI
    RTS
remove:
    SEI
    LDA #$00 ; lda #0
    STA $D01A
    LDA #$FF
    STA $D019
    LDA #$31
    STA $0314
    LDA #$EA
    STA $0315
    LDA #$0E ; lda #14
    STA $D020
    CLI
    RTS
fixBasic:
    LDA $2E
    CMP #$A0
    BCC L_C0D8 ; bcc !done+
    LDA $2B
    STA ZA
    LDA $2C
    STA ZA+1
L_C0AA:
    LDY #$01 ; ldy #1 // a sorlancon vegig
    LDA (ZA),Y
    BEQ L_C0BB ; beq !+
    TAX
    DEY
    LDA (ZA),Y
    STA ZA
    STX ZA+1
    JMP L_C0AA ; jmp !-
L_C0BB:
    LDA ZA ; lda ZA // vege = a 0-s lanc cime + 2
    CLC
    ADC #$02 ; adc #2
    STA $2D
    STA $2F
    STA $31
    LDA ZA+1
    ADC #$00 ; adc #0
    STA $2E
    STA $30
    STA $32
    LDA $37 ; lda $37 // stringek a memoria tetejetol
    STA $33
    LDA $38
    STA $34
L_C0D8:
    RTS
irq:
    LDA $D019
    AND #$01 ; and #1
    BNE L_C0EB ; bne !++
    LDA $DC0D
    BMI L_C0E8 ; bmi !+
    JMP $EA81
L_C0E8:
    JMP $EA31 ; jmp $ea31 // CIA1: billentyuzet, ora
L_C0EB:
    LDA $01 ; lda $01 // BASIC ROM ki ($B000 lathato), KERNAL marad
    PHA
    AND #$FE
    STA $01
    LDA $D011 ; lda $d011 // badline-ok ebben a kepkockaban
    AND #$07 ; and #7
    STA ys
    LDA $D011
    AND #$10
    BEQ L_C106 ; beq !+ // DEN=0 -> nincs badline
    LDA midKb
    BNE L_C109 ; bne !++ // midKb >= 1
L_C106:
    LDA midK
L_C109:
    STA kBadNow
    LDX firstLine
plTop:
    LDY shLo,X
    STX tmpX
.invoke PlPreset(0) ; :PlPreset()
.invoke SyncLine(0) ; :SyncLine()
    JSR plFull
    LDX tmpX
    INX
    CPX #DISP_FIRST
    BNE plTop
plMid:
    LDY shLo,X
    STX tmpX
    LDA P+176,Y ; lda P + 176,y // a jobb keret elso szine a plSide-ba
    TAX
    LDA CT_2,X ; lda CT,x
    STA plRC+1 ; sta plRC + 1
    LDX tmpX
    TXA
    EOR ys
    AND #$07 ; and #7
    BEQ bad
    LDA midK
    BNE set ; bne set // midK >= 1
bad:
    LDA kBadNow
set:
    STA plMJ+1 ; sta dst
.invoke PlPreset(0) ; :PlPreset()
.invoke SyncLine(0) ; :SyncLine()
    JSR plSide
    LDX tmpX
    INX
    CPX #$FB ; cpx #DISP_LAST + 1
    BNE plMid
plBot:
    LDY shLo,X
    STX tmpX
.invoke PlPreset(0) ; :PlPreset()
.invoke SyncLine(0) ; :SyncLine()
    JSR plFull
    LDX tmpX
    INX
    BNE plBot
plBot2:
    LDY shHi,X
    STX tmpX
.invoke PlPreset(0) ; :PlPreset()
.invoke SyncLine(0) ; :SyncLine()
    JSR plFull
    LDX tmpX
    INX
    CPX lastHi
    BNE plBot2
    LDA #$00 ; lda #0
    STA $D020
    LDA #$01 ; lda #1
    STA $D019
    INC fcnt
    JSR plasmaUpdate
    PLA
    STA $01
    JMP $EA81 ; jmp $ea81 // regiszterek vissza, RTI
plSide:
.invoke WaitCycles(LEFT_WAIT - 1) ; :WaitCycles(LEFT_WAIT - 1)
    LDX #$0C ; ldx #k
lp_2:
    DEX
    BNE lp_2 ; bne lp
    NOP
    LDA P,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+1,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+2,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+3,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+4,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+5,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+6,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+7,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+8,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+9,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+10,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+11,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+12,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+13,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+14,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+15,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
plRC:
    LDA #$00 ; lda #0 // a jobb keret elso szine elore (a kepernyo takarja)
    STA $D020
plMJ:
op:
    LDX #$2C ; ldx #44
lp_3:
    DEX
    BNE lp_3 ; bne lp
    LDX #$FF ; ldx #k
lp_4:
    DEX
    BNE lp_4 ; bne lp
    LDX #$CC ; ldx #k
lp_5:
    DEX
    BNE lp_5 ; bne lp
    NOP
    NOP
    NOP
    LDA P+176,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+177,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+178,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+179,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+180,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+181,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+182,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+183,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+184,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+185,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+186,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+187,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+188,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+189,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    LDA P+190,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    LDA P+191,Y ; lda P + i,y
    TAX
    LDA CT_2,X ; lda CT,x
    STA $D020
    NOP
    BIT $DC02
    RTS
detect:
    BIT $D011 ; bit $d011 // var a 256. sor utanra
    BPL detect ; bpl !-
    LDA #$00 ; lda #0
    STA maxLow
L_C35F:
    LDA $D012
    CMP maxLow
    BCC L_C36A ; bcc !+
    STA maxLow
L_C36A:
    BIT $D011
    BMI L_C35F ; bmi !--
    LDA maxLow
    CMP #$20 ; cmp #32
    BCC ntsc
    RTS ; rts // PAL: az alapertekek maradnak
ntsc:
    ADC #$01 ; adc #1 // C=0: lastHi = maxLow+1 (262-ig)
    STA lastHi
    LDA #NTSC_FIRST
    STA firstLine
    LDA #$12 ; lda #NTSC_IRQ
    STA irqLine
    LDA maxLow
    CMP #$06 ; cmp #6
    LDA #$40 ; lda #64 // 6567R56A: 64 ciklus, 262 sor
    BCC L_C391 ; bcc !+
    LDA #$41 ; lda #65 // 6567R8: 65 ciklus, 263 sor
L_C391:
    STA cpl
    RTS
calibrate:
    LDA #$00 ; lda #0
    STA cT
    STA cT+1
    STA cT+2
L_C3A0:
    LDA $D011 ; lda $d011 // var a 24. sorra (bit 8 = 0)
    BMI L_C3A0 ; bmi !-
    LDA $D012
    CMP #$18 ; cmp #24
    BNE L_C3A0 ; bne !-
L_C3AC:
    LDA $D012 ; lda $d012 // a 25. sor eleje
    CMP #$19 ; cmp #25
    BNE L_C3AC ; bne !-
    JMP calLoop
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00 ; .align $40
calLoop:
    LDX #$C8 ; ldx #k
lp_6:
    DEX
    BNE lp_6 ; bne lp
    BIT $00
    NOP
    INC cT ; inc cT // 6
    BNE L_C3D0 ; bne !+ // 3 (256-onkent 2 + 6)
    INC cT+1
L_C3D0:
    LDA $D012 ; lda $d012 // 4
    CMP #$F5 ; cmp #25 + 220 // 2
    BNE calLoop ; bne calLoop // 3
    LDX #$0A ; ldx #10 // T = C << 10
L_C3D9:
    ASL cT
    ROL cT+1
    ROL cT+2
    DEX
    BNE L_C3D9 ; bne !-
    LDA cT+1 ; lda cT+1 // + 512 (fel iteracio)
    CLC
    ADC #$02 ; adc #2
    STA cT+1
    BCC L_C3F3 ; bcc !+
    INC cT+2
L_C3F3:
    LDA cpl
    JSR div24
    LDA #$05 ; lda #5
    JSR div24
    SEC
    LDA cT
    SBC #$F6 ; sbc #<(44 * MID_MIN - 2)
    STA cT
    LDA cT+1
    SBC #$09 ; sbc #>(44 * MID_MIN - 2)
    STA cT+1
    BCC calMin
    LDA #$05 ; lda #5
    JSR div24
    LDA cT+1
    ORA cT+2
    BNE calMax
    LDA cT
    BNE L_C429 ; bne !+
calMin:
    LDA #$01 ; lda #1
    BNE L_C429 ; bne !+
calMax:
    LDA #$FF ; lda #255
L_C429:
    STA midK
    RTS
div24:
    STA cDiv
    LDA #$00 ; lda #0
    LDX #$18 ; ldx #24
L_C434:
    ASL cT
    ROL cT+1
    ROL cT+2
    ROL
    CMP cDiv
    BCC L_C449 ; bcc !+
    SBC cDiv
    INC cT
L_C449:
    DEX
    BNE L_C434 ; bne !--
    RTS
cDiv:
.byte $00 ; .byte 0
cT:
.byte $00, $00, $00 ; .byte 0, 0, 0
measStall:
    LDA $D011
    AND #$07 ; and #7
    ORA #$38 ; ora #$38 // 56..63 kozti badline
    STA mlLine
    JSR searchK
    PHA
    LDA mlLine
    CLC
    ADC #$04 ; adc #4 // normal sor
    STA mlLine
    JSR searchK
    STA kNorm
    PLA
    STA kLo ; sta kLo // kLo = kBad
    LDA kNorm
    SEC
    SBC kLo ; sbc kLo // d = kNorm - kBad (a megallas 5 ciklusban)
    BCS L_C47D ; bcs !+
    LDA #$00 ; lda #0 // (zaj ellen: negativ nincs)
L_C47D:
    STA kHi
    LDA midK
    SEC
    SBC kHi
    BEQ L_C48B ; beq !+
    BCS L_C48D ; bcs !++
L_C48B:
    LDA #$01 ; lda #1
L_C48D:
    STA midKb
    RTS
searchK:
    LDA #$01 ; lda #1
    STA kLo
    LDA #$FF ; lda #255
    STA kHi
skLoop:
    LDA kLo
    CMP kHi
    BCS skDone
    CLC
    ADC kHi
    ROR ; ror // mid = (lo + hi) / 2
    PHA
    TAY
    JSR crossed
    PLA
    BCC L_C4B6 ; bcc !+
    STA kHi ; sta kHi // atert: hi = mid
    JMP skLoop
L_C4B6:
    CLC
    ADC #$01 ; adc #1
    STA kLo ; sta kLo // nem ert at: lo = mid + 1
    JMP skLoop
skDone:
    LDA kLo
    RTS
crossed:
    LDX mlLine
    DEX
    TXA
L_C4C8:
    CMP $D012 ; cmp $d012 // elotte a megelozo sor
    BNE L_C4C8 ; bne !-
    LDA mlLine
L_C4D0:
    CMP $D012
    BNE L_C4D0 ; bne !-
    BIT $DC02 ; bit $dc02 // ciklushatar
    LDX #$FF ; ldx #k
lp_7:
    DEX
    BNE lp_7 ; bne lp
    LDX #$FF ; ldx #k
lp_8:
    DEX
    BNE lp_8 ; bne lp
    LDX #$59 ; ldx #k
lp_9:
    DEX
    BNE lp_9 ; bne lp
    NOP
L_C4E8:
    DEY
    BNE L_C4E8 ; bne !-
    LDA $D012
    CMP mlLine
    CLC
    BEQ L_C4F5 ; beq !+
    SEC
L_C4F5:
    RTS
plasmaUpdate:
    INC t1
    LDA t2
    SEC
    SBC #$02 ; sbc #2
    STA t2
    INC t3
    INC t3
    LDA t4
    CLC
    ADC #$03 ; adc #3
    STA t4
    LDA fcnt
    AND #$01 ; and #1
    BNE L_C51B ; bne !+
    INC t5
L_C51B:
    LDA t1
    STA a1
    LDA t2
    STA a2
    LDX #$00 ; ldx #0
pLoop:
    LDY a1
    LDA sinA,Y
    LDY a2
    CLC
    ADC sinA,Y
    STA P,X
    INC a1
    LDA a2
    SEC
    SBC #$02 ; sbc #2
    STA a2
    INX
    BNE pLoop
    LDA t3
    STA a1
    LDA t4
    STA a2
    LDX #$00 ; ldx #0
sLoop:
    JSR shiftValue
    STA shLo,X
    INX
    BNE sLoop
sLoop2:
    JSR shiftValue
    STA shHi,X
    INX
    CPX #$20 ; cpx #32
    BNE sLoop2
    LDX #$00 ; ldx #0
cLoop:
    TXA
    LSR
    LSR
    CLC
    ADC t5
    AND #$1F ; and #31
    TAY
    LDA grad,Y
    STA CT_2,X ; sta CT,x
    INX
    BNE cLoop
    RTS
shiftValue:
    LDY a1
    LDA sinA,Y
    LDY a2
    CLC
    ADC sinA,Y
    LSR
    INC a1
    INC a1
    DEC a2
    RTS
grad:
.byte $06, $06, $04, $04, $0E, $0E, $03, $03
.byte $0D, $0D, $01, $01, $07, $07, $0F, $0F ; .byte 6,6,4,4,14,14,3,3,13,13,1,1,7,7,15,15
.byte $0A, $0A, $08, $08, $02, $02, $09, $09
.byte $0B, $0B, $0C, $0C, $0E, $0E, $04, $04 ; .byte 10,10,8,8,2,2,9,9,11,11,12,12,14,14,4,4
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00 ; .align $100
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
sinA:
.byte $20, $20, $21, $22, $23, $23, $24, $25
.byte $26, $26, $27, $28, $29, $29, $2A, $2B ; .fill 256, round(31.5 + 31.5 * sin(toRadians(i * 360 / 256)))
.byte $2C, $2C, $2D, $2E, $2E, $2F, $30, $30
.byte $31, $32, $32, $33, $33, $34, $35, $35
.byte $36, $36, $37, $37, $38, $38, $39, $39
.byte $3A, $3A, $3B, $3B, $3B, $3C, $3C, $3C
.byte $3D, $3D, $3D, $3D, $3E, $3E, $3E, $3E
.byte $3E, $3F, $3F, $3F, $3F, $3F, $3F, $3F
.byte $3F, $3F, $3F, $3F, $3F, $3F, $3F, $3F
.byte $3E, $3E, $3E, $3E, $3E, $3D, $3D, $3D
.byte $3D, $3C, $3C, $3C, $3B, $3B, $3B, $3A
.byte $3A, $39, $39, $38, $38, $37, $37, $36
.byte $36, $35, $35, $34, $33, $33, $32, $32
.byte $31, $30, $30, $2F, $2E, $2E, $2D, $2C
.byte $2C, $2B, $2A, $29, $29, $28, $27, $26
.byte $26, $25, $24, $23, $23, $22, $21, $20
.byte $20, $1F, $1E, $1D, $1C, $1C, $1B, $1A
.byte $19, $19, $18, $17, $16, $16, $15, $14
.byte $13, $13, $12, $11, $11, $10, $0F, $0F
.byte $0E, $0D, $0D, $0C, $0C, $0B, $0A, $0A
.byte $09, $09, $08, $08, $07, $07, $06, $06
.byte $05, $05, $04, $04, $04, $03, $03, $03
.byte $02, $02, $02, $02, $01, $01, $01, $01
.byte $01, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $01, $01, $01, $01, $01, $02, $02, $02
.byte $02, $03, $03, $03, $04, $04, $04, $05
.byte $05, $06, $06, $07, $07, $08, $08, $09
.byte $09, $0A, $0A, $0B, $0C, $0C, $0D, $0D
.byte $0E, $0F, $0F, $10, $11, $11, $12, $13
.byte $13, $14, $15, $16, $16, $17, $18, $19
.byte $19, $1A, $1B, $1C, $1C, $1D, $1E, $1F
P:
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00 ; .fill 256, 0
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
CT_2:
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00 ; .fill 256, 0
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
shLo:
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00 ; .fill 256, 0
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
shHi:
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00 ; .fill 32, 0
.byte $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00
