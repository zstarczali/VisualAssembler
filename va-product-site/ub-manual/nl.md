# Ultimate Basic v1.5.6 — Taalhandleiding

Complete taal- en CLI-referentie voor Ultimate Basic, een BASIC-achtige taal die
direct compileert naar 6502-machinecode voor de Commodore 64. Uitvoer: `.prg`
bestanden (VICE of echte hardware), `.crt` cartridge-images en `.d64`
disk-images.

Voor een kort projectoverzicht en installatie-instructies, zie README.md.

© 2026 Zsolt Tarczali

> Het bouwen van de `ub` compiler en de commandoregelopties worden beschreven in
> [README.md](README.md). Deze handleiding documenteert de Ultimate Basic-taal
> zelf.

## Taalreferentie

### Variabelen en constanten

**Alle variabelen moeten vóór gebruik worden gedeclareerd met `var`.** Het
gebruik van een niet-gedeclareerde variabele in een expressie, toewijzing,
`for`/`loop` teller, `inc`/`dec`, `input` of `read` instructie leidt tot een
compileerfout.

```basic
var x = 10               # 8-bit integer (default)
var ptr: word = $0400    # 16-bit — two zero-page bytes, usable as 16-bit address
var f: float = 3.5       # Q8.8 fixed-point — hi byte = integer, lo byte = fraction
var msg = "HELLO"        # string variable (pointer to inline PETSCII data)
var s: string = "TEXT"   # string with explicit type
var scores = array(10)   # byte array, 10 elements stored at $C000+
var moments  = array_word(8) # word array, 8 word elements stored at $C000+
const BORDER_ADDR = $D020 # compile-time constant (substituted inline, no ZP slot)
```

Trefwoorden en identificatoren zijn **niet hoofdlettergevoelig**: `PRINT`,
`Print` en `print` zijn allemaal geldig.

| Type                  | Breedte       | Notities                                                         |
| --------------------- | ------------- | ---------------------------------------------------------------- |
| `int`                 | 8-bit         | standaardwaarde voor numerieke letterlijke waarden               |
| `word`                | 16-bit        | twee ZP-bytes; kunnen worden gebruikt als adres in `poke`/`peek` |
| `float`               | 16-bits Q8.8  | hi byte = geheel getal (0–255), lo byte = fractioneel getal      |
| `string`              | wijzer        | ZP-paar → null-terminated PETSCII in codesegment                 |
| `array(N)`            | N bytes       | byte-elementen; bevindt zich op `$C000+`, niet in ZP.            |
| `array_word(N)`       | N×2 bytes     | woord (16-bits) elementen; bevindt zich op `$C000+`, niet in ZP  |
| `array(R, C, …)`      | ∏dims bytes   | multidimensionaal (rij-hoofdrichting); index `arr[r, c]`         |
| `array_word(R, C, …)` | ∏dims×2 bytes | multidimensionale woordmatrix (rij-georiënteerd)                 |

### Gereserveerde woorden

De volgende identificatoren zijn **trefwoorden** — ze mogen niet worden gebruikt
als namen voor variabelen, constanten, subroutines, functies, parameters of
labels. Alle overeenkomsten zijn niet hoofdlettergevoelig (`END`, `end`, `End`
botsen allemaal). Het gebruik van een gereserveerd woord als naam leidt meestal
tot een verwarrende fout (een regel zoals `var` wordt stilzwijgend niet
gedeclareerd, of een expressie zoals `for i = 1 to times` wordt `Number(0)`) —
kies daarom een andere naam.

**Declaratie & controlestroom** `var`, `const`, `sub`, `fn`, `type`, `endtype`,
`return`, `call`, `label`, `goto`, `gosub`, `if`, `then`, `else`, `end`,
`select`, `case`, `for`, `next`, `loop`, `times`, `to`, `step`, `while`,
`repeat`, `until`, `break`, `continue`, `inc`, `dec`, `bye`, `exit`, `rem`

**Typen en typegerelateerd** `int`, `word`, `float`, `string`, `array`,
`array_word`

**Afdrukken & I/O** `print`, `spc`, `tab`, `at`, `input`, `chr$`, `str$`, `hex`,
`bin`, `open`, `close`, `load`, `save`, `data`, `read`, `include`, `incbin` (ook
`dec` — hierboven vermeld als de decrement-instructie; hetzelfde token wordt
gebruikt voor de `dec(n, width)` afdrukindeling)

**Ingebouwde wiskundige en tekenreeksfuncties** `abs`, `min`, `max`, `clamp`,
`sgn`, `mod`, `rnd`, `sin`, `cos`, `and`, `or`, `xor`, `not`, `bnot`, `shl`,
`shr`, `len`, `asc`, `val`, `str_to_int`, `numstr`

**Geheugen en timing** `poke`, `peek`, `poke16`, `peek16`, `fill`, `memcopy`,
`drawmem`, `wait`, `raster`, `delay`, `sys`, `asm`

**Scherm & tekst** `cls`, `fast`, `color`, `text`, `border`, `bg`, `screen`,
`cursor`, `lowercase`, `uppercase`, `display`, `on`, `off`, `scroll`, `speed`,
`badlines`, `turbo`

**Bitmap- en blokafbeeldingen** `graphics`, `gcls`, `flip`, `plot`, `plot4`,
`mplot`, `mline`, `mrect`, `mcircle`, `line`, `circle`, `circle4`, `rect`,
`paint`, `erase`, `pen`, `multi`, `block`

**Sprites** `sprite`, `sprdef`, `sprite_frame`, `sprite_x`, `sprite_y`,
`sprhit`, `sprbghit`, `box_hit`, `chardef`, `charset`, `expand`, `priority`

**Geluid & muziek** `sid`, `sound`, `volume`, `music`, `play`, `pause`,
`resume`, `stop`

**Invoerapparaten** `getch`, `inkey`, `waitkey`, `joy`, `mouse_x`, `mouse_x_hi`,
`mouse_y`, `mouse_btn`

**Onderbrekingen & vectoren** `irq`, `irq_exit`, `nmi`, `nmi_exit`, `cia_timer`,
`onerr`

**Tekenkaarten en afbeeldingen** `map`, `map_tile`, `map_color`, `koala`,
`show`, `hide`

**REU (RAM-uitbreiding)** `reu`, `reudet`, `stash`, `fetch`

**Stijlvalkuilen — namen die er vrij uitzien, maar toch gereserveerd zijn**

Deze veelvoorkomende Engelse woorden lijken onschuldige identificatoren, maar
worden al door de lexer herkend. Hernoem ze om stille woordafbreking te
voorkomen:

| Gereserveerd                                | Voorgestelde naamswijziging         |
| ------------------------------------------- | ----------------------------------- |
| `end`                                       | `stop_at`, `finish`, `last`         |
| `stop`                                      | `stop_at`, `halt`                   |
| `times`                                     | `count`, `n`, `iters`               |
| `screen`                                    | `scraddr`, `screen_addr`            |
| `border`, `bg`, `text`                      | `border_addr`, `bg_col`, `text_col` |
| `clamp`                                     | `cap`, `bound`                      |
| `line`, `circle`, `rect`                    | `ln`, `circ`, `box_r`               |
| `data`, `read`                              | `bytes`, `next_byte`                |
| `load`, `save`, `open`, `close`             | `load_file`, ...                    |
| `map`, `show`, `hide`                       | `tilemap`, `reveal`, `conceal`      |
| `play`, `pause`, `resume`, `stop`, `volume` | `play_song`, `vol`                  |
| `int`, `float`, `word`, `string`            | `n_int`, `speed_f`, `addr`, `msg`   |

Symbolische tokens (`+ - * / = == != < > <= >= : , ; ( ) [ ] # $ % @`) zijn
vanzelfsprekend niet bruikbaar in identificatoren.

### Opmerkingen

```basic
# hash comment
rem this is also a comment
var x = 5  # inline comment
var x = 5 : var y = 6  # colon separates statements on one line
```

### Operators

```basic
x = x + 1
y = a * b - c / 2
z = x and 15             # bitwise AND
w = a or b               # bitwise OR
v = a xor b              # bitwise XOR
m = x shl 3              # shift left
n = x shr 2              # shift right
r = x mod 40             # 8-bit modulo (remainder); SEC/SBC/BCS loop
b = bnot x               # bitwise NOT: x XOR 255 (complement all 8 bits)
```

Vergelijkingen: `==` `!=` `<` `>` `<=` `>=` (retourneer 1/0)

### Verhogen / Verlagen

```basic
inc x                    # x = x + 1  (INC zp — single instruction)
dec x                    # x = x - 1  (DEC zp — single instruction)
```

For `word` variables carry is handled: `inc` uses `INC lo; BNE skip; INC hi`;
`dec` uses `LDA lo; BNE skip; DEC hi; DEC lo`.

### Samengestelde opdrachten

```basic
x += 5                   # x = x + 5
x -= 3                   # x = x - 3
x *= 2                   # x = x * 2
x /= 4                   # x = x / 4
x and= 15                # x = x and 15   (bitwise AND)
x or= 64                 # x = x or 64    (bitwise OR)
x xor= 255               # x = x xor 255  (bitwise XOR)
x shl= 2                 # x = x shl 2
x shr= 1                 # x = x shr 1
```

### Afdrukken

```basic
print "HELLO"
print x
print x, y, "text"
print                     # blank line

print spc(5)             # print 5 space characters
print tab(20), "VALUE"  # move cursor to column 20, then print
print "A", spc(3), "B" # mix freely

print "A=" + a           # string + numeric var
print s1 + s2            # two string vars → sequential print
print "Hello " + "World" # two literals → compile-time fold
print chr$(13)           # print by PETSCII code
```

### chr$

```basic
print chr$(65)           # output character with PETSCII code 65 ('A')
var c = chr$(n)          # store byte value n in variable c
print ">" + chr$(42)     # usable in string concat
```

### Vertakking

```basic
if x == 1 then
  print "YES"
else
  print "NO"
end
```

### Select / Case

```basic
select x
  case 1:
    print "ONE"
  case 2:
    print "TWO"
  else:
    print "OTHER"
end
```

`select expr` evalueert de expressie eenmaal en vergelijkt deze met elke `case`
waarde in volgorde. De eerste overeenkomende case body wordt uitgevoerd en de
controle springt naar na `end`. De optionele `else:` body wordt uitgevoerd als
er geen overeenkomende case is. Alle waarden moeten 8-bits zijn (0–255).

### Lussen

```basic
loop 5               # counted loop (5 iterations)
  print "HI"
end

times 5              # alias for loop N ... end
  print "HI"
end

loop                 # infinite loop
  x = x + 1
  if x == 5 then continue end  # skip to next iteration
  if x == 100 then break end
end

var i = 0
for i = 1 to 10      # for..next (preferred)
  if i == 5 then continue end  # skip to increment step
  print i
next

for i = 0 to 20 step 2
  print i
next i               # variable name after 'next' is optional

for i = 10 to 1 step -1     # counting down — negative constant step is supported
  print i
next

for i = 20 to 0 step -2     # terminates correctly at i = 0 (11 iterations)
  print i
next i

var i = 0
loop i = 1 to 10     # legacy loop..end syntax — identical code
  print i
end

while x < 100
  x = x + 1
end

repeat               # do-while: body runs at least once
  x = x + 1
until x == 100       # exits when condition is true
```

**Richtingsregels voor `for`/`loop`:**

| Case                                                   | Gedrag                                                                                                                 |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| `for i = 1 to 10` (standaard `step +1`, `from ≤ to`)   | telt omhoog, standaard                                                                                                 |
| `for i = 0 to 20 step 2` (positieve stap, `from ≤ to`) | telt met 2 omhoog                                                                                                      |
| `for i = 10 to 1 step -1` (negatieve constante stap)   | telt af; het lichaam loopt voor i = 10, 9, ..., 1                                                                      |
| `for i = 20 to 0 step -2` (naar nul)                   | Het programma stopt bij i = 0 door de ADC-onderloop (C=0) na de decrementatie te detecteren; er is geen oneindige lus. |
| `for i = 10 to 1` (geen stap, `from > to`)             | **compilatiefout**: `for-loop: from (10) > to (1) with default step +1 loops 0 times — use 'step -1' to count down`    |

De compiler kiest de exit-branch-codering tijdens het compileren op basis van
het teken van een constante `step`:

- Positieve stap (of standaard `+1`) → afsluiten wanneer `var > to`
  (niet-ondertekende `CMP` + `BCC`/`BEQ` vallen door naar `JMP exit`).
- Negatieve constante stap → afsluiten wanneer `var < to` (ongetekende `CMP` +
  `BCS` naar de body), **plus** een post-increment `BCS loop_top ; JMP exit` die
  de wrap opvangt wanneer `var` onder 0 komt. Dat extra paar instructies zorgt
  ervoor dat `for i = N to 0 step -k` eindig blijft.

Niet-constante `step`-waarden (bijvoorbeeld van een variabele of expressie)
worden tijdens het compileren als positief behandeld; als u een aftelling met
een runtime-stapwaarde nodig hebt, splits dan de lus of gebruik een
`while`-constructie.

### Labels en ga naar

```basic
label main_loop
  x = x + 1
  if x < 10 then goto main_loop end
```

Forward `goto` (label wordt later gedefinieerd) wordt volledig ondersteund.

`gosub label` / `return` springt naar een label en keert terug (JSR / RTS op
machinecodeniveau). Het label moet een `label name` statement zijn, geen `sub` —
het heeft geen parameters en deelt dezelfde zero-page scope. `gosub` ondersteunt
forward references (label gedefinieerd na `gosub`).

```basic
gosub draw_border
...
label draw_border
  # ... draw something ...
  return               # RTS — returns to the instruction after gosub
```

### Subroutines

```basic
sub greet()
  print "HELLO!"
end

sub set_color(col)
  color border col
  color text   col
end

greet()              # call with parens
call greet           # call keyword (no parens)
set_color(6)
```

Parameters worden doorgegeven via speciale zero-page slots. Geen recursie (slots
zijn statisch). Getypte parameters worden ondersteund: `sub draw(x, y:int)` of
`sub copy(src:string)` — tekenreeksparameters ontvangen een pointer van 2 bytes,
zodat de aangeroepen functie de brontekenreeks kan indexeren via `src[i]`.

### Functies (retourwaarden)

```basic
fn square(x)
  return x * x
end

fn add(a, b)
  return a + b
end

fn clamp(val, lo, hi)
  if val < lo then return lo end
  if val > hi then return hi end
  return val
end

var s = square(9)         # s = 81  — fn call as expression
var c = clamp(joy, 0, 39) # c = clamped value
print add(10, 20)         # 30  — usable inline in print
```

Functies ondersteunen een optioneel retourtype `: word` voor 16-bits waarden:

```basic
fn get_addr(): word
  return $C000
end

var ptr: word = get_addr()  # ptr = $C000
poke ptr, 42                 # STA (ptr),Y — valid indirect addressing
var v = peek(ptr)            # LDA (ptr),Y
```

`fn` wordt in fase 2 uitgezonden (net als `sub`), waardoor de functiebody's
nooit bij het opstarten worden uitgevoerd. Forward references worden volledig
ondersteund.

### Arrays

```basic
var scores = array(8)    # 8 bytes at $C000

scores[0] = 100          # constant index → STA $C000
scores[i] = 99           # variable index → STA (ptr),Y
var v = scores[i]        # LDA (ptr),Y
print scores[2]          # usable inline in print

var moments = array_word(8)  # 16 bytes (8×2) at $C000+

moments[0] = $1234         # constant index → STA $C000 (lo), STA $C001 (hi)
moments[i] = $5678         # variable index → ASL A for stride; (ptr),Y × 2
var t: word = moments[1]   # LDA $C002, LDA $C003
```

**Multidimensionale arrays** (nieuw in 1.5.3)

Arrays kunnen met meer dan één dimensie worden gedeclareerd. Ze worden
**rij-georiënteerd** opgeslagen en geïndexeerd met een door komma's gescheiden
subscriptlijst. De totale grootte is het product van alle dimensies.

```basic
var grid = array(8, 8)     # 8×8 = 64 bytes at $C000
grid[1, 0] = 11            # row 1, col 0 → flat index 1*8+0 = 8 → STA $C008
grid[0, 1] = 22            # row 0, col 1 → flat index 1       → STA $C001
grid[r, c] = 33            # variable → computes r*8 + c, then STA (ptr),Y
var v = grid[r, c]         # LDA (ptr),Y

var wm = array_word(4, 4)  # 4×4 word array = 32 bytes
wm[1, 2] = $ABCD           # element 1*4+2 = 6 → bytes $C00C/$C00D

const ROWS = 3
const COLS = 5
var m = array(ROWS, COLS)  # dimensions may be compile-time constants
```

Bij een rijgeoriënteerde lay-out is de laatste index aaneengesloten: `grid[r,
c]` bevindt zich op `base + r*COLS + c`. Elk aantal dimensies wordt ondersteund
(`array(a, b, c)`). Wanneer elke index een constante is, wordt het adres tijdens
het compileren samengevoegd tot één absolute opslag/laadbewerking; een variabele
index genereert de `row*stride + col` berekening en een geïndexeerde `(ptr),Y`
toegang. Een enkele index in een multidimensionale array is nog steeds
toegestaan en wordt behandeld als een vlakke/lineaire index (`grid[10]`).
Dimensies moeten tijdens het compileren constanten zijn (literalen of `const`s),
en de array moet worden gedeclareerd voordat deze wordt geïndexeerd.

**Structuurtypen (`type ... endtype`, nieuw in 1.5.4)**

Definieer een vaste lay-out van benoemde velden met `type` en wijs vervolgens
een array van instanties toe op dezelfde manier als een reguliere array. Toegang
tot velden gebeurt via `arr[idx].field` en werkt voor zowel constante als
variabele indexen.

```basic
type TEntity
  var x:  int      # 1 byte
  var y:  int      # 1 byte
  var hp: word     # 2 bytes  → element size = 4
endtype

const N = 8
var enemies: TEntity = array(N)   # allocates N × 4 = 32 bytes at $C000

enemies[0].x  = 5
enemies[0].y  = 10
enemies[0].hp = $0100
var v = enemies[0].hp             # read back — LDA $C002 / LDA $C003

var i: int = 2
enemies[i].x = 42                 # variable index → idx * elem_size + offset

# Float field (Q8.8 fixed-point)
type TBall
  var bx:  int     # 1 byte
  var by:  int     # 1 byte
  var vel: float   # 2 bytes Q8.8  → element size = 4
endtype

var balls: TBall = array(3)
balls[0].vel = 1.5                # stores Q8.8: hi=1, lo=128
var f: float = balls[0].vel       # read float field into float variable
print balls[0].vel                # prints "1.50"
```

Regels en beperkingen:

- Veldtypen: `int` (1 byte), `word` (2 bytes LE), `float` (2 bytes Q8.8).
  `string` en geneste `type` velden worden nog niet ondersteund.
- Elementgrootte = som van de veldbreedtes (volgorde van declaratie, geen
  opvulling).
- Opslag bevindt zich op `$C000+` naast reguliere arrays en verschijnt in de
  geheugenkaart als een gewone array van de totale bytegrootte.
- Constante index → `LDA/STA absolute` tijdens compilatie.
- Variabele index → shift-and-add vermenigvuldiging voor `idx * elem_size`,
  vervolgens geïndexeerde `(ptr),Y` toegang. Elementgroottes die machten van
  twee zijn (1, 2, 4, 8, 16) gebruiken kale `ASL A` ketens; andere groottes
  genereren een korte shift-add sequentie via twee tijdelijke nul-pagina bytes.
- Sub-/fn-parameters van een struct-type worden nog niet ondersteund — geef in
  plaats daarvan de array en een index door, bijvoorbeeld `sub move(idx: int)
  ... enemies[idx].x = ...`.
- Standaard veldwaarden (`var fire: int = 2` binnen het type) worden geparseerd
  voor compatibiliteit met het voorstel, maar zijn nog niet geïnitialiseerd op
  het moment van toewijzing.
- Bij een array van het type struct is slechts één index toegestaan;
  multidimensionale struct-arrays worden niet ondersteund (gebruik een berekende
  platte index).

Zie `examples/type_demo.ub`.

### 16-bits (woord) variabelen

```basic
var ptr: word = $0400    # two ZP bytes: lo=$00 hi=$04
poke ptr, 6              # STA (ptr),Y
var v = peek(ptr)        # LDA (ptr),Y
```

### Bitmapafbeeldingen

```basic
graphics on              # VIC-II hires bitmap mode (320×200, 1bpp); bitmap at $2000
graphics on multi        # VIC-II multicolor bitmap mode (160×200, 2bpp, 4 colours/cell)
graphics off             # return to text mode

gcls                     # clear bitmap (fills $2000-$3FFF) + set video matrix colors

plot x, y                # set pixel at (x, y);  x: 0-319,  y: 0-199
plot erase x, y          # clear pixel (AND ~mask)
plot xor x, y            # toggle pixel (EOR mask) — flicker-free animation
circle x, y, r           # midpoint circle centered at (x, y) with radius r; clips off-screen points
line x1, y1, x2, y2      # Bresenham line from (x1,y1) to (x2,y2); x: 0-319, y: 0-199
line erase x1, y1, x2, y2  # clear pixels along the line (AND ~mask)
line xor x1, y1, x2, y2    # toggle pixels along the line (EOR mask)
rect x1, y1, x2, y2      # draw rectangle outline (4 edges); x: 0-319, y: 0-199
rect erase x1, y1, x2, y2  # clear rectangle outline (AND ~mask)
rect xor x1, y1, x2, y2    # XOR rectangle outline (EOR mask)
paint x, y               # 4-connected flood fill from (x, y); fills clear pixels bounded by set ones

color pen c              # set the hires drawing color (0-15); see below

# ── Multicolor bitmap (graphics on multi, 160×200) ──
mplot x, y, color        # set multicolor pixel (x: 0-159, y: 0-199, color: 0-3)
mline x1, y1, x2, y2, color   # multicolor line
mrect x1, y1, x2, y2, color   # multicolor rectangle outline
mcircle x, y, r, color        # multicolor circle
```

Beide `graphics on` varianten schakelen het display uit (`LDA $D011 / AND #$EF /
STA $D011`) tijdens het schakelen van VIC-registers en schakelen het vervolgens
weer in in de doelmodus — dit voorkomt storingen bij het schakelen tussen modi.

`x` kan het volledige bereik van `0–319` zijn. Coördinaten boven 255 worden
automatisch verwerkt (de helper voegt de 9e X-bit toe), dus `plot`, `line`,
`circle` en `rect` bereiken allemaal de rechterrand van het scherm. Gebruik een
`word` variabele wanneer een X-coördinaat groter kan zijn dan 255.

#### Huurlingen tekenen kleur — `color pen`

In de hoge resolutiemodus (320×200) is de kleur **per 8×8 cel**, opgeslagen in
de videomatrix (hoge nibble = voorgrond, lage nibble = achtergrond), niet per
pixel. `color pen c` stelt een permanente voorgrondkleur in (0-15) die `plot`,
`line`, `rect`, `circle` en `paint` in de cel van elke getekende pixel stempelt;
de achtergrondnibble van de cel blijft behouden. Deze kleur blijft van kracht
tot de volgende `color pen`. De standaardwaarde is wit (1), dus programma's die
nooit `color pen` aanroepen, zien er precies hetzelfde uit als voorheen.

```basic
graphics on
gcls
color pen 2              # red
line 0, 0, 100, 100
color pen 6              # blue
circle 160, 100, 40
display on
```

#### Meerkleurige vormen — `mline` / `mrect` / `mcircle`

In de meerkleurenmodus (`graphics on multi`, 160×200) kiest elke pixel een van
de vier kleurbronnen via een 2-bits waarde (`%00` achtergrond `$D021`, `%01`
scherm hi nibble, `%10` scherm lo nibble, `%11` kleur-RAM). `mplot` stelt een
enkele dergelijke pixel in; `mline`, `mrect` en `mcircle` tekenen vormen op
dezelfde manier — het achterliggende `color` argument is de 2-bits bron (0-3),
en de werkelijke kleuren komen uit het celpalet (scherm / kleur-RAM) precies
zoals bij `mplot`.

```basic
graphics on multi
gcls
mcircle 80, 100, 40, 1
mrect 10, 10, 150, 190, 2
mline 0, 0, 159, 199, 3
display on
```

`mline`/`mrect`/`mcircle` hergebruiken dezelfde Bresenham-/middelpuntroutines
als hun tegenhangers met hoge resolutie, waarbij elke pixel wordt uitgezet via
`mplot`; punten buiten het scherm (x ≥ 160 of y ≥ 200) worden overgeslagen.

### Dubbel gebufferde bitmap (flikkervrij)

```basic
graphics on double       # double-buffered hires bitmap (320×200)
gcls                     # clears the HIDDEN back buffer
line 0, 0, 319, 199      # all drawing (plot/line/circle/rect/paint/gcls) goes to the back buffer
flip                     # show the drawn buffer; redirect drawing to the other one
graphics off             # back to text mode (restores VIC bank 0)
```

`graphics on double` bewaart **twee** complete bitmaps met hoge resolutie en
toont alleen voltooide frames, waardoor flikkering wordt geëlimineerd zonder
XOR-trucs — elk frame dat je `gcls` tekent, en vervolgens `flip`.

| Buffer                         | Bitmap  | Videomatrix | VIC bank | `$DD00` lage bits |
| ------------------------------ | ------- | ----------- | -------- | ----------------- |
| A (voorkant, eerst getoond)    | `$2000` | `$0400`     | bank 0   | `%11`             |
| B (achterkant, eerst getekend) | `$6000` | `$4400`     | bank 1   | `%10`             |

* Alle pixelcommando's schrijven via een runtime **tekenbasis** (een byte van
  nul pagina's), waardoor ze automatisch gericht zijn op de buffer die momenteel
  verborgen is.
* `flip` wacht op de ondergrens (raster ≥ 251) voordat de VIC-bank wordt
  omgeschakeld, zodat de omschakeling **zonder scheurvorming** verloopt, en
  richt vervolgens de tekenbasis op de nu verborgen buffer.
* Typische lus: `gcls` → teken het frame → `flip`. Roep `display on` één keer
  aan na de eerste `flip`, zodat de eerste weergegeven buffer al compleet is.

**Vereisten / beperkingen:**
* Alleen voor huur (niet `multi`). Sprites worden niet opgehaald uit de VIC-bank
  van de backbuffer.
* De backbuffer gebruikt `$4000–$7FFF` (matrix `$4400`, bitmap `$6000–$7FFF`),
  dus de machinecode van het programma moet onder `$4400` blijven. De meeste
  demo's zijn slechts een paar KB groot, dus dit gebeurt automatisch; zeer grote
  programma's kunnen geen gebruik maken van dubbele buffering.
* Op een standaard 1 MHz C64 beperkt de per-frame volledige `gcls` (8 KB) de
  framesnelheid; op de Commodore 64 Ultimate verhoog je `speed` voor vloeiende
  animaties met een hoge framesnelheid.

Zie `examples/cube_demo.ub` — een tuimelende 3D-draadmodelkubus die flikkervrij
is weergegeven.

### Blokgrafiek (80×50)

```basic
graphics on block        # 80×50 block-pixel mode (text mode + custom 4-pixel charset @ $2800)
graphics off             # return to text mode
gcls                     # clear block playfield: screen RAM $0400-$07FF + color RAM $D800-$DBFF

plot4 x, y               # set block pixel at (x, y);  x: 0-79, y: 0-49
plot4 erase x, y         # clear block pixel at (x, y)
circle4 x, y, r          # draw midpoint circle in block pixels; clips to 80×50
```

Een grove, lage-resolutiemodus over standaard 40×25 tekst heen gelegd. Een
aangepaste tekenset van 16 tekens, gekopieerd naar `$2800`, codeert een 2×2
kwadrantraster per teken (bit3=TL, bit2=TR, bit1=BL, bit0=BR), waardoor elke
tekstcel 2×2 blokpixels bevat → een effectief raster van 80×50. Er wordt geen
bitmap-RAM gebruikt (`$2000-$3FFF` blijft vrij), waardoor het sneller is dan een
hoge-resolutie bitmap. `plot4` voert een OR-bewerking uit op de kwadrantbit in
de cel, waardoor overlappende pixels zich ophopen; `plot4 erase` wist deze.
`circle4` gebruikt dezelfde blokpixel-helper om een omtrekcirkel te tekenen in
de 80×50 coördinatenruimte. `gcls` wist zowel het scherm- als het kleur-RAM. Zie
`examples/block_demo.ub`.

### Scherm en kleur

```basic
cls                      # clear screen (KERNAL $E544)
cls fast                 # fast fill: screen RAM + color RAM + HOME

color text 14            # text color register $0286
color border 6           # $D020
color bg 0               # $D021
color pen 2              # hires drawing color (0-15) for plot/line/rect/circle/paint

screen 0, 0, 65          # write char 65 ('A') to screen RAM at col 0, row 0 ($0400)
screen 10, 5, ch         # col 10, row 5 — col/row can be variables
screen 5, 3, 42, 7       # char 42 at col 5, row 3, color 7 (writes color RAM $D800 too)
screen x, y, ch, col     # all four arguments as variables

display on               # re-enable VIC display ($D011 DEN bit)
display off              # blank display

lowercase                # CHR$(14) → switch VIC-II to lowercase/uppercase charset
uppercase                # CHR$(142) → switch VIC-II back to uppercase/graphics charset

cursor 20, 10            # move cursor to col 20, row 10 (KERNAL PLOT $FFF0)
cursor x, y              # column from variable x (0–39), row from y (0–24)

print at 20, 10, "HELLO" # cursor(20,10) + print in one statement (no trailing newline)
print at x, y, "Score:", score  # any mix of exprs
print at 0, 0            # position only (no text, no newline)

scroll x 3               # set horizontal fine scroll: $D016 bits 0-2 = 3 (0-7)
scroll y 2               # set vertical fine scroll:   $D011 bits 0-2 = 2 (0-7)
scroll x n               # value can be a variable or expression (masked to bits 0-2)
scroll x 7 narrow        # set fine scroll and force 38-column mode (hide edge column)
scroll x 0 wide          # set fine scroll and restore 40-column mode
scroll row 12 left       # shift screen RAM row 12 left by one character
```

`lowercase` genereert `LDA #$0E; JSR $FFD2` tijdens runtime. Stringliteralen die
na `lowercase` worden gecompileerd, krijgen automatisch een andere
hoofdlettergevoeligheid — hoofdletters in de broncode worden opgeslagen in de
PETSCII-sleuf voor kleine letters (`$61+`) en kleine letters in de broncode in
de sleuf voor hoofdletters (`$41+`) — dus `"Hello World"` wordt weergegeven als
**Hello World** op het scherm. `uppercase` genereert `LDA #$8E; JSR $FFD2` en
keert terug naar directe mapping. `cls` reset de tekensetmodus **niet**.

`scroll x n` schrijft `(n AND 7)` naar bits 0-2 van `$D016` (bits 3-7 blijven
behouden). `scroll x n narrow` schrijft de fijnscrollbits en wist bit 3 van
`$D016` (38-kolomsmodus). `scroll x n wide` schrijft de fijnscrollbits en stelt
bit 3 van `$D016` in (40-kolomsmodus). `scroll y n` schrijft `(n AND 7)` naar
bits 0-2 van `$D011` (bits 3-7 blijven behouden). `scroll row R left` verschuift
één constante schermrij naar links; schrijf het nieuwe meest rechtse teken met
`screen 39, R, ch`. Handig voor soepel scrollen met hardware: verlaag elke frame
van 7 naar 0, verschuif het scherm-RAM, reset naar 7.

`screen col, row, char [, color]` schrijft rechtstreeks naar het scherm-RAM
(`$0400 + row*40 + col`) en optioneel naar het kleur-RAM (`$D800 + row*40 +
col`). Constante col/row: adres berekend tijdens compilatie.

### Ultimate 64 — CPU-snelheid

```basic
speed 4              # set CPU to 4 MHz  (reads $D031, updates bits 0-3, writes back)
speed 48             # 48 MHz  (maximum speed on U64)
speed max            # same as speed 48  (alias)
speed off            # back to 1 MHz  (alias for speed 1)

badlines on          # enable badline timing  ($D031 bit 7 = 0, default C64 behaviour)
badlines off         # disable badline timing ($D031 bit 7 = 1, more CPU cycles)

var t = turbo()      # 1 if turbo is active (bits 0-3 of $D031 != 0), 0 if at 1 MHz
```

Beschikbare MHz-waarden: `1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 20, 24, 32, 40,
48`. Constante waarden worden tijdens het compileren naar beneden afgerond naar
de dichtstbijzijnde beschikbare snelheid. Variabele waarden worden behandeld als
een ruwe snelheidsindex (0-15) en gecombineerd met bits 0-3 van `$D031`.

| $D031 index | MHz (U64) | MHz (U64 Elite-II) |
| ----------- | --------- | ------------------ |
| 0           | 1         | 1                  |
| 3           | 4         | 4                  |
| 6           | 8         | 10                 |
| 11          | 20        | 24                 |
| 15          | 48        | 64                 |

Vereist dat **U64 Turbo Control** is ingesteld op `U64 Turbo Registers` of
`Turbo Enable Bit` in het U64-configuratiemenu. Op een gewone C64 of emulator
zonder dit register worden de waarden `poke` tot en met `$D031` stilzwijgend
genegeerd.

### Toetsenbord

```basic
var key = getch()        # busy-wait on $FFE4 until key; returns PETSCII code
var k   = inkey()        # non-blocking: returns PETSCII code, or 0 if no key pressed
waitkey                  # wait until any key is pressed (CIA1 matrix scan; works during IRQ)
var k   = waitkey()      # same but returns raw $DC01 column bits (0 bit = key pressed)
var j = joy(2)           # read joystick port 2; returns inverted bits 0-4
var j = joy(1)           # read joystick port 1
                         # bit0=up(1) bit1=down(2) bit2=left(4) bit3=right(8) bit4=fire(16)
var mx = mouse_x()       # 1351 mouse: accumulated X position (helper: charge+delay+delta)
var my = mouse_y()       # 1351 mouse: accumulated Y position (EOR #$FF inverted)
var mb = mouse_btn()     # mouse buttons: reads $DC01 — bit0=left (fire), bit1=right (up pin)
```

`mouse_x()` / `mouse_y()` voeren intern een hulpsubroutine uit die het volgende
afhandelt: het opladen van de CIA1 `$DC00` condensator, een vertraging van
ongeveer 516 cycli, het uitlezen van het SID POT X/Y-register (`$D419`/`$D41A`),
de berekening van de getekende 7-bits delta, de inversie van de Y-as `EOR #$FF`
en het bijhouden van de geaccumuleerde positie (permanente ZP-status, 8 bytes).
De hulpsubroutine bemonstert de POT twee keer per frame. `mouse_y()` roept de
hulpsubroutine **niet** aan (alleen `mouse_x()` doet dat) — deze leest alleen de
in de cache opgeslagen `accum_y` om dubbele updates te voorkomen.

De helper onderhoudt een 9-bits X-accumulator (`accum_x` + `accum_x_hi` met
carry/borrow). Gebruik `var sx: word = mouse_x()` — de compiler slaat zowel de
lage als de hoge bytes op, zodat de opdracht `sprite` `$D010` correct verwerkt
voor X-posities voorbij 255.

De helper slaat zijn status op in ZP (`$02`–`$09`). De init-vlag moet nul zijn
vóór de eerste aanroep — zet het gebied met `fill $02, 7, 0` vroeg in je
programma op nul. Schakel ook CIA1-interrupts uit (`poke $DC0D, $7F`) om te
voorkomen dat de KERNAL IRQ `$DC00` aanraakt tijdens het scannen van het
toetsenbord — dat verstoort de POT-uitlezing.

Zie `examples/mouse_demo.ub` voor een werkende demo van de 1351-muis met
sprite-tracking en knopfeedback.

### Uitgang

```basic
bye                      # JSR $E544 (clear screen), clear STOP flag, RTS to BASIC
exit                     # alias for bye
```

### Timing

```basic
wait 50                  # wait 50 raster-line transitions (~3.2 ms)
wait raster 100          # spin until $D012 == 100 (raster-split effects)
delay 1                  # wait 1 PAL frame (1/50 s ≈ 20 ms)
delay 20                 # wait 20 frames ≈ 0.4 s; n can be a variable (0–255)
```

`delay N` telt N complete PAL-frames met rasterlijn 200 als framegrens.

### SID-geluid

```basic
sound 0, $1CAD, 25       # voice 0, freq $1CAD (≈ middle C PAL), 25 frames duration
sound 1, freq_word, 50   # voice 1, freq from word var, 50 frames (1 s at 50 Hz)
sound 2, 0, 0            # voice 2, silence

sid volume 15            # master volume full ($D418 = $0F); range 0-15
sid volume 0             # silence (master volume = 0)
sid stop                 # zero all 25 SID registers ($D400–$D418) — complete silence
```

`sound <channel>, <freq>, <duration>` — duur in PAL-frames (1/50 s per frame).
Vaste ADSR: attack/decay `$09`, sustain/release `$F0`, zaagtandgolfvorm.
Hoofdvolume `$D418` altijd ingesteld op `$0F`.

`sid volume N` schrijft N naar `$D418`. Bits 0-3 = volume (0-15), bits 4-7 =
filtermodus. `sid stop` genereert een 10-byte nulopvullingslus — sneller dan 25
afzonderlijke prikbewegingen.

### Muziek afspelen

`music play/stop/pause/resume` is een alternatief op hoog niveau voor de
handmatige configuratie van `sys sid_init` / `cia_timer`. Vereist een
voorafgaande `load sid`-instructie (definieert `sid_init` / `sid_play`).

```basic
load sid "tune.sid"         # embed SID file (defines sid_init / sid_play)

music play                  # initialise sub-tune 0 + start CIA1 50 Hz IRQ
music play 1                # start from sub-tune 1 (song number 0-based)
music stop                  # stop playback + zero all 25 SID registers ($D400-$D418)
music pause                 # disable CIA1 timer A IRQ (music freezes, SID unchanged)
music resume                # re-enable CIA1 timer A IRQ (continues from pause point)
```

| Stelling         | Effect                                                                                                |
| ---------------- | ----------------------------------------------------------------------------------------------------- |
| `music play [n]` | roep `sid_init(n)` aan, configureer CIA1 timer A op 19.656 cycli (~50 Hz PAL), installeer IRQ wrapper |
| `music stop`     | CIA1 IRQ uitschakelen + alle 25 SID-registers op nul zetten                                           |
| `music pause`    | CIA1 IRQ uitschakelen (SID-uitvoer blijft bevroren)                                                   |
| `music resume`   | CIA1 IRQ opnieuw inschakelen (vervolg vanaf pauzepunt)                                                |

De IRQ-wrapper (die eenmalig aan het einde van het programma wordt uitgezonden)
doet het volgende: ACK CIA1 timer A → `JSR sid_play` → `JMP $EA81`.

### Elfjes

```basic
sprite 0, x, y, $2000    # sprite 0: set X, Y position and data pointer
sprite 0, x, y           # without data pointer (keeps existing)
sprite on  0             # enable sprite 0 ($D015 |= bit0)
sprite off 0             # disable sprite 0 ($D015 &= ~bit0)
sprite color 0, 7        # sprite 0 color = yellow ($D027)
sprite multicolor 0, on  # enable multicolor mode for sprite 0 ($D01C |= bit0)
sprite multicolor 0, off # disable multicolor mode ($D01C &= ~bit0)
sprite expand x 0, on    # double width ($D01D |= bit0)
sprite expand x 0, off   # normal width ($D01D &= ~bit0)
sprite expand y 0, on    # double height ($D017 |= bit0)
sprite expand y 0, off   # normal height ($D017 &= ~bit0)
sprite priority 0, on    # behind background ($D01B |= bit0)
sprite priority 0, off   # in front of background ($D01B &= ~bit0)
var h = sprite_hit()     # sprite–sprite collision ($D01E, cleared on read)
var b = sprite_bg_hit()  # sprite–background collision ($D01F, cleared on read)
var x = sprite_x(0)      # read sprite 0 X position (lo byte, $D000)
var y = sprite_y(0)      # read sprite 0 Y position ($D001)
sprite_frame 0, $2000          # select one static sprite image
sprite_frame 0, $2000, frame   # select an animation frame from a frame sequence
```

X ondersteunt het volledige 9-bits bereik (0–319): gebruik een `word` variabele
voor runtime-waarden > 255. Sprite-datapointer: `data_addr` moet 64-byte
uitgelijnd zijn; opgeslagen als `addr >> 6` op `$07F8+id`.

#### Sprite animation with `sprite_frame`

`sprite_frame` is het commando dat wordt gebruikt om de weergegeven afbeelding
van een sprite tijdens een animatie te wijzigen. Het wijzigt alleen de
datapointers van de sprite; het verplaatst de sprite **niet**, activeert hem
niet en zorgt er ook niet voor dat frames automatisch worden doorgeschoven.

Sla de animatiebeelden achter elkaar op, waarbij elk spritebeeld van 63 bytes
één 64-byte-uitgelijnde sleuf inneemt. Geef het nulgebaseerde animatieframe door
als derde argument:

```basic
sprite_frame sprite_id, first_frame_address, frame_number
```

Bijvoorbeeld, met een basisadres van `$2000`, gebruikt frame 0 `$2000`, frame 1
`$2040`, frame 2 `$2080`, enzovoort. Het programma regelt de timing en de
overgang van de animatie:

```basic
var frame = 0
loop
  sprite_frame 0, $2000, frame
  frame = frame + 1
  if frame == 4 then frame = 0 end
  delay 5
end
```

De vorm met twee argumenten, `sprite_frame id, address`, selecteert eenvoudigweg
één statische sprite-afbeelding en blijft achterwaarts compatibel. De positie
van de sprite wordt nog steeds bepaald door `sprite id,x,y`.

### Botsing tussen begrenzingskaders in software

```basic
var touching = box_hit(left1, top1, right1, bottom1,
                       left2, top2, right2, bottom2)
```

`box_hit()` voert een as-uitgelijnde begrenzingsbox-test (AABB) uit en
retourneert `1` wanneer de twee rechthoeken elkaar overlappen of raken, anders
`0`. In tegenstelling tot `sprite_hit()` en `sprite_bg_hit()` leest of wist deze
functie geen VIC-II-botsingsregisters. De acht argumenten zijn willekeurige
8-bits expressies, dus de begrenzingsboxen kunnen kleiner zijn dan de zichtbare
sprite-afbeelding of kunnen niet-sprite-gameobjecten beschrijven. Coördinaten
zijn inclusief; behoud `left <= right` en `top <= bottom`.

### Sprite definition

```basic
sprdef 0
  $00,$3C,$00,  $00,$FF,$00,  $03,$FF,$C0,  $07,$FF,$E0,
  $0F,$FF,$F0,  $0F,$FF,$F0,  $1F,$FF,$F8,  $1F,$FF,$F8,
  $1F,$FF,$F8,  $0F,$FF,$F0,  $0F,$FF,$F0,  $07,$FF,$E0,
  $03,$FF,$C0,  $00,$FF,$00,  $00,$3C,$00,  $00,$00,$00,
  $00,$00,$00,  $00,$00,$00,  $00,$00,$00,  $00,$00,$00,
  $00,$00,$00
end
```

`sprdef id ... end` voegt 63 spritebytes in op het eerstvolgende adres in het
codesegment dat is uitgelijnd met 64 bytes, genereert een `JMP` eroverheen en
stelt automatisch `$07F8+id = data_addr >> 6` in. Om dezelfde vorm voor meerdere
sprites te gebruiken, lees je de pointer terug:

```basic
var pg = peek($07F8)   # pointer set by sprdef 0
poke $07F9, pg         # copy to sprites 1–7
```

### Tekentegelkaarten (`.ubmap`)

```basic
map load "levels/world.ubmap"
map draw map_x, map_y       # draw a 40x25 viewport to screen/color RAM

var tile = map_tile(x, y)   # read character code from the map
map set x, y, 42            # change character code in writable map data

var shade = map_color(x, y) # read cell color (0 when map has no color data)
map color x, y, 7           # change cell color when color data is present
```

`map load` lost de bestandsnaam op ten opzichte van het `.ub` bronbestand,
valideert deze tijdens het compileren en slaat de teken- en optionele
kleurarrays ervan op in het beschrijfbare programmageheugen. Een latere `map
load` vervangt de actieve kaart voor volgende kaartopdrachten.

`map load` accepteert ook een VisualAssembler `me-map` `.bin` export direct:

```basic
kaart laden "map-multicolor.bin"
```

De eerste 1000 bytes vormen de 40×25 tekenkaart en de volgende 1000 bytes worden
celkleuren. De meerkleurenmodus en `$D021-$D023` worden gelezen uit de
VisualAssembler-metadatatrailer, dus er is geen `.ubmap`-conversie nodig.

`map draw map_x, map_y` kopieert een 40×25 viewport, beginnend bij de opgegeven
kaartcel, naar scherm-RAM `$0400` en, indien aanwezig, kleur-RAM `$D800`. De
kaart moet de volledige gevraagde viewport bevatten: behoud `map_x <= width-40`
en `map_y <= height-25`. Coördinaten en afmetingen zijn momenteel 8-bits
(0–255).

Normale kaarten wissen de meerkleurige bit van de tekst in `$D016`. Meerkleurige
kaarten stellen deze in en laden hun drie globale kleuren in `$D021`, `$D022` en
`$D023`. Tekenkaarten bevatten tekencodes, geen charsetpixels; combineer ze met
`charset`/`chardef` of een andere methode voor het laden van de charset. In de
meerkleurige tekstmodus selecteren celkleuren 8-15 meerkleurige tekens volgens
de VIC-II-regels.

#### UBMP versie 1 binair formaat

Alle multibyte-gehele getallen zijn little-endian:

|  Offset |           Maat | Betekenis                                                               |
| ------: | -------------: | ----------------------------------------------------------------------- |
|       0 |              4 | ASCII magie `UBMP`                                                      |
|       4 |              1 | Versie, momenteel `1`                                                   |
|       5 |              1 | Vlaggen: bit 0 = kleurenarray aanwezig, bit 1 = meerkleurige tekstmodus |
|       6 |              2 | Kaartbreedte, 1–255 cellen                                              |
|       8 |              2 | Kaarthoogte, 1–255 cellen                                               |
|      10 |              1 | Achtergrond 0 (`$D021`), lage nibble gebruikt                           |
|      11 |              1 | Meerkleurig 1 (`$D022`), lage nippel gebruikt                           |
|      12 |              1 | Multicolor 2 (`$D023`), lage nibble gebruikt                            |
|      13 | breedte×hoogte | Rijhoofdtekencodes                                                      |
| volgend | breedte×hoogte | Optionele rij-georiënteerde kleurnibbles wanneer vlagbit 0 is ingesteld |

Een UBMP-bestand moet exact de lengte hebben die in de header wordt aangegeven.
Ongeldige magic-, versie-, dimension- of lengtewaarden leiden tot een
compileerfout.

### Koala Painter afbeelding importeren

```basic
koala load "pictures/title.kla"  # validate and embed at compile time
koala show                       # enter bitmap multicolor mode
koala hide                       # return to the default text display
```

`koala load` accepteert een standaard Koala-bestand van 10003 bytes (`$6000`
laadadres plus 10001 databytes) of een onbewerkte payload van 10001 bytes. Paden
zijn relatief ten opzichte van het `.ub` bestand. De payload bevat 8000
bitmapbytes, 1000 schermbytes, 1000 kleurnibbles en één achtergrondkleurbyte.

De compiler slaat het op bij `$6000-$8710`. `koala show` kopieert de bitmap naar
`$2000`, de schermmatrix naar `$0400`, de kleuren naar `$D800` en schakelt de
bitmap-meerkleurenmodus in. `koala hide` schakelt de bitmap-/meerkleurenmodus
uit en herstelt de standaard tekstindeling.

De gegenereerde code en helpers moeten onder `$2000` eindigen, omdat de
weergegeven bitmap `$2000-$3F3F` overschrijft; anders geeft de compiler een
foutmelding. De Koala-import kan momenteel niet in hetzelfde programma worden
gecombineerd met `load sid`.

### Aangepaste tekenset

```basic
charset $3800            # set base address for chardef (default $3800)

chardef 65               # redefine character 65 ('A')
  $18,$3C,$66,$7E,$66,$66,$66,$00
end

chardef 66               # fewer than 8 bytes are zero-padded
  $7C,$66,$7C,$66,$7C
end
```

`charset base` stelt het bestemmingsadres in dat wordt gebruikt door alle
volgende `chardef`-instructies. `chardef id ... end` voegt 8 bytes inline in het
codesegment in (voorafgegaan door een `JMP` om ze over te slaan) en kopieert ze
vervolgens tijdens runtime naar `charset_base + id*8`. Waarden moeten
compileertijdconstanten zijn; gebruik `%` voor binaire literals (`%00011000`).

Om een aangepaste tekenset in VIC-II te activeren, stelt u het adres van de
tekengenerator in via `$D018`:
```basic
charset $3800
chardef 1  $FF,$81,$81,$81,$81,$81,$81,$FF  end  # box border
poke $D018, $1A     # screen at $0400, charset at $3800 (bank 0)
```

### Geheugen

```basic
poke $D020, 2            # STA $D020
poke addr_var, 6         # STA (addr_var),Y  — if addr_var is word type
var v = peek($D012)      # LDA $D012
var v = peek(addr_var)   # LDA (addr_var),Y  — if addr_var is word type

var w: word = peek16($C000)   # read 16-bit little-endian: lo=$C000, hi=$C001
poke16 $0314, $EA81           # write 16-bit little-endian: lo→$0314, hi→$0315
poke16 ptr, w                 # word var as address; word var as value
```

`peek16(addr)` leest twee opeenvolgende bytes (lo, hi) als een `word`. `poke16`
schrijft eerst lo en daarna hi.

### Schijf-I/O

```basic
load "PROGRAM"           # KERNAL LOAD: loads file from device 8 to its native address
load "DATA", $C000       # loads file to a specific address
load "DATA", ptr         # addr from word variable

save "DATA", $C000, 4096 # KERNAL SAVE from $C000, 4096 bytes → device 8
save "PROG", start, len  # addr and len from word/int variables
```

`load` roept KERNAL `SETNAM`+`SETLFS`+`LOAD` aan (`$FFBD`/`$FFBA`/`$FFD5`).
Zonder adres: secundair adres 0 (de eigen 2-byte header van het bestand wordt
gebruikt als laadadres). Met adres: secundair adres 1 (bestand geladen op de
opgegeven locatie). `save` roept `SETNAM`+`SETLFS`+`SAVE` aan
(`$FFBD`/`$FFBA`/`$FFD8`). Vereist zowel `addr` als `len`.

### SID Muziek

```basic
load sid "tune.sid"            # embed SID music at its native load address
load sid "tune.sid", $2000     # override: embed at $2000 regardless of SID header
```

`load sid` leest een PSID- of RSID-bestand tijdens **het compileren**,
verwijdert de header en voegt de onbewerkte muziekbytes toe aan de uitvoer
`.prg`. Na `load sid` worden twee compileertijdconstanten beschikbaar:

| Constante  | Beschrijving                                                                           |
| ---------- | -------------------------------------------------------------------------------------- |
| `sid_init` | Adres van de initialisatieroutine — eenmaal aanroepen met A = songnummer (0-gebaseerd) |
| `sid_play` | Speel routineadres af — roep elke frame (50 Hz PAL) aan vanuit een IRQ-handler         |

Beide constanten werken overal waar een constant adres wordt geaccepteerd:
`sys`, `irq`, `poke`, expressies.

**Typisch gebruik:**

```basic
load sid "music.sid"

sub music_irq()
  poke $D019, $FF       # ACK VIC raster IRQ
  sys sid_play          # advance one frame of music
  irq_exit              # JMP $EA81: restore A/X/Y + RTI (proper IRQ exit)
end

sys sid_init, 0         # initialise SID chip: A=0 → first sub-tune
irq music_irq, $C0      # raster IRQ at line $C0 → 50 Hz on PAL

sid volume 15           # master volume on
```

**Opmerkingen:**
- De SID-gegevens worden **na** alle gegenereerde code geplaatst en aangevuld
  met nullen tot aan het laadadres. De compiler waarschuwt als het laadadres van
  de SID de gegenereerde code zou overlappen.
- PSID v1 en v2 worden ondersteund. Als het laadadres van de SID-header 0 is,
  worden de eerste twee databytes als adres gebruikt (PRG-stijl, little-endian).
- Slechts één `load sid` per programma is relevant (de laatste wint).

### Seriële kanaal bestands-I/O

```basic
open 1, 8, 2, "MYFILE"  # open logical file 1, device 8, secondary 2, name "MYFILE"
open 2, 4, 7             # open printer (device 4), no filename
open ch, dev, sec        # channel, device, secondary from variables

print# 1, "HELLO"        # send "HELLO"+CR to logical file 1
print# ch, x, "text"     # any mix of vars, strings — same as print but to file

close 1                  # close logical file 1
close ch                 # channel from variable
```

`open` roept `SETNAM` ($FFBD) + `SETLFS` ($FFBA) + `OPEN` ($FFC0) aan. Zonder
bestandsnaam wordt SETNAM aangeroepen met lengte 0. `print#` routeert de uitvoer
via `CHKOUT` ($FFC9), CHROUT per teken (+ afsluitende CR), en vervolgens
`CLRCHN` ($FFCC). `close` plaatst het kanaalnummer in A en roept `CLOSE` ($FFC3)
aan.

### Input

```basic
input score              # read up to 3 digits from keyboard → 8-bit int var
input "Name: ", name     # optional prompt string, then read line → string var
input "Score: ", score   # prompt + int input
```

`input` gebruikt KERNAL BASIN (`$FFCF`) voor blokkerende, herhaalde regelinvoer
met DEL-ondersteuning.
- **Int var**: accepteert alleen `0`–`9`, maximaal 3 tekens; wordt geconverteerd
  naar een 8-bits waarde bij CR.
- **Stringvariabele**: accepteert maximaal 30 tekens; wordt opgeslagen als een
  null-terminated string; ZP-paar bijgewerkt.

### Zwevende-komma / Vaste-komma

`float` variabelen gebruiken het Q8.8 fixed-point formaat: de hoge byte is het
gehele deel (0–255) en de lage byte is het fractionele deel (0/256 … 255/256).

```basic
var f: float = 3.5       # 3.5 → hi=3, lo=128 (= 0x0380)
var g: float = 0         # integer 0 is promoted to 0.0 automatically

f = 1.5                  # Q8.8 literal assignment
f = f + 1.5              # 16-bit Q8.8 arithmetic (result: 3.0)
f = f + g                # float + float

var n = int(f)           # extract integer part (hi byte) → 8-bit int
print f                  # prints as "N.DD" (e.g. 3.5 → "3.50", 1.25 → "1.25")
```

| Operatie            | Voorbeeld            | Notities                                                  |
| ------------------- | -------------------- | --------------------------------------------------------- |
| Letterlijk          | `3.5`, `0.25`, `1.0` | Tijdens het compileren werd het als Q8.8 geïnterpreteerd. |
| Integerpromotie     | `f = 5`              | opslag 5.0 (hoog=5, laag=0)                               |
| Toevoegen/vervangen | `f + 1.5`, `f - g`   | 16-bits Q8.8 rekenkunde                                   |
| Extract int         | `int(f)`             | retourneert de hoogste byte als een 8-bits integer.       |
| Afdrukken           | `print f`            | formaat "N.DD", altijd 2 decimalen                        |

**Let op:** Rekenkundige overloop treedt op bij 255.255 (geen verzadiging).
Vermenigvuldiging en deling van twee drijvende-komma-variabelen worden nog niet
ondersteund — gebruik `int()` + integer-rekenkunde voor die gevallen.

### Wiskundige functies

```basic
var a = abs(x - 20)      # two's-complement absolute value
var b = min(x, 39)       # 8-bit minimum
var c = max(x, 0)        # 8-bit maximum
var s = sgn(score)       # 0 = zero, 1 = positive (1–127), $FF = negative (128–255)
var r = rnd()            # LCG pseudo-random 0-255; seed from raster line
var r = rnd(10)          # LCG pseudo-random 0-9 (rnd() mod n; result 0..n-1)
var s = sin(angle)       # sine: angle 0-255 (full circle), returns 0-255 (center=128)
var c = cos(angle)       # cosine = sin(angle+64)
var v = clamp(x, 0, 39)  # 8-bit unsigned clamp: result = max(lo, min(hi, val))

print hex(n)             # print as 2-digit uppercase hex
print bin(n)             # print as 8-bit binary string
```

### Stringfuncties

```basic
var n = len(msg)         # length of null-terminated string var (0–255)
var c = asc(msg)         # PETSCII code of first character (0 if empty)
var c = asc("A")         # compile-time: constant PETSCII code
var n = val(s)           # runtime: parse decimal PETSCII string → 8-bit int (e.g. "042" → 42)
var c = msg[i]           # string character at index i: PETSCII code of msg[i]
msg[i] = c               # write PETSCII byte c to string at index i — STA (ptr),Y
msg[0] = 72              # constant index → LDY #0; STA (ptr),Y
```

### Nummeropmaak

```basic
print hex(n)             # print as 2-digit uppercase hex
print bin(n)             # print as 8-bit binary string
print dec(n, 4)          # right-justified decimal in a field of 4 chars (e.g. 42 → "  42")
print dec(n, width)      # width can also be a variable
```

`dec(n, width)` vult het getal aan de linkerkant aan met spaties om de tekens
`width` te vullen. Als het getal meer cijfers heeft dan `width`, wordt het
afgedrukt zonder opvulling (geen afkapping). In niet-afdrukcontexten wordt
`dec(n, w)` onveranderd geëvalueerd tot `n` (hetzelfde als `hex`/`bin`).

### REU (RAM-uitbreidingseenheid)

```basic
var ok = reu_present()   # 1 if REU detected, 0 if not (write/read test on $DF04)
var ok = reudet()        # alias for reu_present()

reu stash c64addr, bank, reu_addr, len  # copy C64 → REU
reu fetch c64addr, bank, reu_addr, len  # copy REU → C64
reu swap  c64addr, bank, reu_addr, len  # swap between C64 and REU
```

`reu_present()` voert een schrijf-/leestest uit op REU-register `$DF04`. Zonder
een REU gaat de schrijfbewerking verloren (open bus), waardoor de leestest
anders verloopt — hiermee wordt de aanwezigheid betrouwbaar gedetecteerd zonder
dat er een ander commando-register wordt aangeraakt dat neveneffecten kan
veroorzaken.

| Parameter  | Breedte | Notities                                                                 |
| ---------- | ------- | ------------------------------------------------------------------------ |
| `c64addr`  | 16-bit  | C64 RAM-start — constante, `word` variabele of 8-bits expressie          |
| `bank`     | 8-bit   | REU-banknummer (0–7 voor een eenheid van 512 KB)                         |
| `reu_addr` | 16-bit  | Compensatie binnen de REU-bank                                           |
| `len`      | 16-bit  | Aantal bytes dat moet worden overgedragen (`0` = 65 536 in REU-hardware) |

REU-registers: `$DF01` commando (`$B0` stash / `$B1` fetch / `$B2` swap),
`$DF02–$DF03` C64-adres, `$DF04–$DF05` REU-offset, `$DF06` bank, `$DF07–$DF08`
lengte. De overdracht is synchroon (CPU wordt gepauzeerd tijdens DMA). Vereist
een echte REU of VICE: **Instellingen → Hardware → RAM-uitbreidingsmodule**.

### Geheugenhulpprogramma's

```basic
fill screen 32           # fill screen RAM $0400–$07FF with value 32 (space char)
fill color 1             # fill color RAM $D800–$DBFF with value 1 (white)

fill $0400, 1000, 32     # fill 1000 bytes starting at $0400 with value 32
fill addr, 256, 0        # addr can be word var
fill ptr, len_word, val  # all operands can be expressions / word vars

memcopy $C000, $0400, 256   # copy 256 bytes from $C000 → $0400
memcopy src_ptr, dst_ptr, 40 # word vars for source and destination

drawmem $C000, $0400, 8, 10, 40 # blit 8×10 rect from $C000 → screen at $0400, stride 40
drawmem src_ptr, dst_ptr, w, h, 40 # word vars for src/dst
```

Zowel `fill` als `memcopy` ondersteunen lengtes van 16 bits (0–65535). Gebruik
`word` variabelen voor lengtes groter dan 255.

`drawmem src, dst, width, height, stride` kopieert een rechthoekig 2D-blok.
`src` wordt lineair gelezen (gepakte rijen); `dst` gaat met `stride` bytes
vooruit tussen rijen — gebruik `40` ($28) voor het C64-scherm of kleuren-RAM (40
kolommen). Breedte, hoogte en stapgrootte zijn allemaal 8-bits waarden. `src` en
`dst` kunnen constanten, `word` variabelen of 8-bits expressies zijn.

### Raster IRQ

```basic
irq my_handler           # raster IRQ at line 0, handler = sub name or address
irq my_handler, 100      # raster IRQ at raster line 100
irq $C800, 200           # handler at fixed address
irq addr_word            # handler address from a word variable
```

Stelt een raster-IRQ in via de BASIC soft vector (`$0314`/`$0315`): schakelt de
CIA1 timer-IRQ uit, bevestigt de wachtende VIC-IRQ, schrijft de rasterlijn naar
`$D012`, schakelt de VIC raster-IRQ in (`$D01A=$01`), schrijft het handleradres
en schakelt de interrupts opnieuw in.

De handler **moet** eindigen met `sys $EA81` (KERNAL einde-van-IRQ) — een
simpele `RTS` of `RTI` zal de stack beschadigen. Bevestig eerst de VIC IRQ:

```basic
sub my_handler()
  poke $D019, $FF      # ACK VIC IRQ
  # ... work here ...
  sys $EA81            # JMP to KERNAL end-of-IRQ
end
```

Voorwaartse verwijzingen worden ondersteund (`irq my_handler` vóórdat de sub is
gedefinieerd).

### NMI-handler

```basic
nmi my_nmi               # set NMI vector $0318/$0319 to handler sub or address

sub my_nmi()
  # ... NMI work here ...
  nmi_exit               # JMP $FE47 — proper NMI exit (restores A/X/Y + RTI)
end
```

`nmi handler` schrijft het handleradres naar de NMI-softvector
(`$0318`/`$0319`). De hardware-NMI-vector op `$FFFA` wijst naar de KERNAL
NMI-routine die via `$0318` vertakt. De handler **moet** eindigen met `nmi_exit`
(zendt `JMP $FE47` uit) — het gebruik van een gewone `RTI` zal de stack
beschadigen. Forward references worden ondersteund.

### CIA1 timer IRQ

```basic
cia_timer 19656, my_handler   # CIA1 timer A: fires every 19656 cycles (~50 Hz PAL)
cia_timer period, handler      # period can be a variable or expression
```

Stelt CIA1 timer A in als een periodieke IRQ-bron via de BASIC soft vector
(`$0314`/`$0315`):
1. SEI — interrupties uitschakelen
2. `$DC0D = $7F` — schakel alle CIA1 IRQ's uit
3. Load 16-bit period lo→`$DC04`, hi→`$DC05`
4. Schrijf het handleradres naar `$0314`/`$0315`
5. `$DC0D = $81` — CIA1 timer A IRQ inschakelen
6. `$DC0E = $01` — start timer A in continue modus
7. CLI — interrupts opnieuw inschakelen

De handler moet eindigen met `irq_exit` (of `sys $EA81`) en moet de CIA1 IRQ
bevestigen:

```basic
sub my_handler()
  poke $DC0D, $01      # ACK CIA1 timer A IRQ (read also clears it)
  # ... work here ...
  irq_exit             # JMP $EA81: restore A/X/Y + RTI
end
```

PAL-timing: klokfrequentie = 985 248 Hz. Periode voor 50 Hz = 985 248 / 50 = 19
705 cycli ≈ `$4CC9`. Voorwaartse referenties worden ondersteund.

### Foutafhandeling

```basic
onerr goto err_handler   # set KERNAL I/O error vector ($0300/$0301) to a label

...

label err_handler
  print "I/O ERROR"
  bye
```

`onerr goto label` schrijft het labeladres (lo, hi) naar de KERNAL-locaties
`$0300` en `$0301`. Wanneer er een KERNAL I/O-fout optreedt (bijv. een mislukte
`load` of `open`), voert de KERNAL `JMP ($0300)` uit, die naar het label
springt. Voorwaartse verwijzingen (label gedefinieerd na `onerr goto`) worden
ondersteund.

### Bestandsinbedding tijdens compilatie

```basic
incbin "sprites.bin"            # embed raw binary bytes at current code position
incbin "charset.bin", $2000     # embed at an absolute address, padding as needed
include "defs.ub"        # inline another .ub source file (lexed+parsed in place)
```

### Data / Read

```basic
data 1, 2, 3, 255        # constant byte table
read varname             # load next byte into varname (auto-declares if needed)
```

Alle `data`-waarden worden tijdens het compileren verzameld. Een 2-byte
ZP-pointer wordt automatisch toegewezen en geïnitialiseerd bij de start van het
programma. Elke `read` verhoogt de pointer.

### Inline-assemblage

```basic
sys $FFD2                # JSR $FFD2
sys $FFD2, 7             # LDA #7 ; JSR $FFD2  (pass byte value in A register)
irq_exit                 # JMP $EA81 — proper IRQ handler exit (restore A/X/Y + RTI)
asm $EA, $EA             # inline raw bytes (NOP NOP) — legacy form
asm {
  ; Full 6502 mnemonics and addressing modes
  LDA #$07               ; immediate
  STA $0286              ; absolute
  LDA $50                ; zero-page  ($50 ≤ $FF → ZP auto-selected)
  STA $0400,X            ; absolute,X indexed
  LDA ($50),Y            ; (indirect),Y
  LDA ($50,X)            ; (indirect,X)
  JSR $FFD2              ; subroutine call
  JMP $C000              ; absolute jump
  JMP ($FFFC)            ; indirect jump

  CLC
  ADC #1
  SEC
  SBC #1

  TAX                    ; implied / transfer
  ASL A                  ; accumulator (also just: ASL)
  LSR A
  ROL
  ROR

  ; Branches — operand is an absolute address; offset is computed automatically
  BNE loop               ; forward or backward branch to local label
  BEQ done

loop:
  NOP
done:
  RTS

  ; #<label / #>label — lo / hi byte of a label address
  LDA #<handler
  STA $0314
  LDA #>handler
  STA $0315

  ; * — current assembly location
  JMP *

  ; Raw hex bytes (backward-compatible with old asm { $xx ... } syntax)
  $EA $EA                ; two NOP bytes
}
```

**Adresmodi:**

| Syntaxis       | Modus         | Bytes | Voorbeeld                     |
| -------------- | ------------- | ----- | ----------------------------- |
| (geen operand) | Impliciet     | 1     | `NOP`, `RTS`                  |
| `A`            | Accumulator   | 1     | `ASL A`, `LSR`                |
| `#value`       | Onmiddellijk  | 2     | `LDA #$07`                    |
| `$zz` (0–255)  | Nulpagina     | 2     | `LDA $50`                     |
| `$zz,X`        | ZP,X          | 2     | `LDA $50,X`                   |
| `$zz,Y`        | ZP,Y          | 2     | `LDX $50,Y`                   |
| `$xxxx`        | Absoluut      | 3     | `LDA $0400`                   |
| `$xxxx,X`      | Absoluut, X   | 3     | `LDA $0400,X`                 |
| `$xxxx,Y`      | Absoluut, Y   | 3     | `LDA $0400,Y`                 |
| `($xxxx)`      | Indirect      | 3     | `JMP ($FFFC)`                 |
| `($zz,X)`      | (Indirect, X) | 2     | `LDA ($50,X)`                 |
| `($zz),Y`      | (Indirect), Y | 2     | `LDA ($50),Y`                 |
| `label`        | Relatief      | 2     | `BNE label` (alleen filialen) |

- `$zz` (1–2 hexadecimale cijfers, waarde ≤ 255) selecteert zero-page als de
  instructie dit ondersteunt; anders wordt automatisch geüpgraded naar absolute.
  Gebruik `$00xx` (4 cijfers) om absolute af te dwingen.
- Branch-operanden zijn absolute adressen; de relatieve byte-offset wordt
  automatisch berekend.
- Lokale labels (`name:`) zijn beperkt tot het `asm { }` blok. Forward branches
  worden in stap 2 opgelost.
- `#<label` / `#>label` geven de lage/hoge byte van het adres van een label
  weer.
- `*` geeft het huidige instructieadres weer, dus `JMP *` wordt geassembleerd
  als een zelflus.
- Regels die beginnen met `$`, `%` of een cijfer worden als onbewerkte bytes
  verzonden (achterwaarts compatibel).
- Binnen `asm { }` zijn commentaren `;` of `//` tot het einde van de regel. (`#`
  is het directe voorvoegsel, geen commentaar.)

**Het combineren van `asm { }` met subroutineparameters**

Parameternamen zijn **niet toegankelijk** binnen `asm { }`-blokken. Gebruik
UltimateBasic-instructies om waarden naar bekende locaties te verplaatsen vóór
het `asm { }`-blok:

```basic
sub set_colors(border_col, bg_col)
  poke $D020, border_col   # UltimateBasic resolves the ZP address
  poke $D021, bg_col
  asm {
    ; values are already in $D020 / $D021
    LDA $D020
  }
end
```

Voor routines waarvan de volledige body uit assemblycode bestaat — met name
IRQ-handlers die naar elkaar moeten verwijzen — plaatst u alle handlers in één
**enkel blok op het hoogste niveau `asm { }`** in het hoofdprogramma. Labels in
hetzelfde blok delen een bereik, dus `irq1` en `irq2` kunnen vrijelijk naar
elkaar verwijzen. Zie `examples/raster_irq_demo.ub`.

### String ↔ integer

```basic
numstr score, $0340      # writes "042\0" at $0340 (always 3 digits, zero-padded)
var n = str_to_int("42") # compile-time: Expr::Number(42)

print str$(score)                # print 8-bit int as 3-digit decimal string ("000"–"255")
print "Score: " + str$(score)   # usable in string concat print context
var s: string = str$(n)          # assign str$() result to a string var (shared static buffer)
```

`str$(n)` converteert een 8-bits waarde naar een decimale tekenreeks van 3
tekens (altijd 3 cijfers met voorloopnullen, bijv. `5` → `"005"`, `42` →
`"042"`, `255` → `"255"`), gevolgd door een null-terminator. De resultaatpointer
wordt opgeslagen in een permanent ZP-paar dat tijdens de compilatie wordt
toegewezen.

> **Opmerking:** `str$(n)` gebruikt één gedeelde statische buffer van 4 bytes.
> Als u `str$(n)` opnieuw aanroept, wordt het vorige resultaat overschreven.
> Voor gelijktijdige weergave van meerdere waarden gebruikt u `numstr` om naar
> afzonderlijke absolute adressen te schrijven.

## Voorbeelden

| Bestand                             | Beschrijving                                                                         |
| ----------------------------------- | ------------------------------------------------------------------------------------ |
| `examples/features.ub`              | const, label/goto, poke/peek, rnd, wiskundige functies                               |
| `examples/new_features.ub`          | subparameters, arrays, woordvariabelen, tekenreeksvariabelen                         |
| `examples/bitmap_demo.ub`           | 320×200 bitmap, plotten, grafische weergave aan/uit                                  |
| `examples/block_demo.ub`            | 80×50 blokgrafieken, plot4, circle4, grafieken op blok                               |
| `examples/joystick_demo.ub`         | joystickuitlezing, spritebeweging                                                    |
| `examples/mux_demo.ub`              | raster sprite multiplexer (3 vensters × 8 sprites = 24)                              |
| `examples/orbit_demo.ub`            | 24-sprite baan met pulserende straal en willekeurige kleuren                         |
| `examples/plasma_demo.ub`           | Plasma-effect bitmap met rasterbalkrandanimatie                                      |
| `examples/sprite_data.ub`           | sprdef-vormgegevens (meegeleverd door andere demo's)                                 |
| `examples/sprite_mux_orbit.ub`      | Demo van een baan met 24 sprites, sprdef en vooraf berekende posities.               |
| `examples/sprite_orbit_demo.ub`     | 8 hardware-sprites in een cirkelvormige baan via de sinus/cosinus-tabel              |
| `examples/reu_bitmap_demo.ub`       | REU-opslag/ophaling met bitmapafbeeldingen                                           |
| `examples/sid_music_demo.ub`        | SID-muziekspeler met raster-IRQ en toetsenborduitgang                                |
| `examples/tenprint.ub`              | 5 TENPRINT doolhofimplementaties met menu; demo's `lowercase` tekensetmodus          |
| `examples/countdown_demo.ub`        | Aftellen `for..next` met negatieve stap, incl. `for i = 20 to 0 step -2`             |
| `examples/countdown_errors_demo.ub` | Compileerfout voor default-step `from > to`                                          |
| `examples/explicit_demo.ub`         | `--explicit` CLI-vlagdemo met volledig getypte `var`, `sub`, `fn`                    |
| `examples/explicit_errors_demo.ub`  | Losse code die compileert zonder --explicit, geeft een foutmelding mét `--explicit`. |

## CLI-referentie

```
ub build <input.ub> [OPTIONS]

  -o, --output <file>   Output .prg or .crt file (default: <input>.prg)
  -v, --verbose         Show zero-page layout and code hex dump
  --no-stub             Skip the BASIC SYS stub (code loads at $0801)
  --debug               Also produce .sym, .dbg and .vs debugger files
  --asm                 Also produce a readable 6502 codegen .asm listing
  --d64 [file]          Also produce a .d64 disk image;
                          without a filename defaults to <output>.d64
  --add <file>          Add an extra file to the .d64 disk image;
                          may be repeated for multiple files
  --explicit            Require :type on every var / sub-param / fn-param
  -h, --help            Show help
```

### CRT-export

Ultimate Basic kan ook een Magic Desk type-19 cartridge-image schrijven als de
uitvoerbestandsnaam eindigt op `.crt`:

```bash
ub build demo.ub -o demo.crt
```

De compiler verpakt de gegenereerde PRG in een CRT-container met bankstructuur,
met dezelfde lay-out als de CRT-export van VisualAssembler: een cartridgeheader
van 64 bytes, een Magic Desk-image van 8×8K en een bootloader in bank 0 die de
PRG-payload naar het C64-RAM kopieert voordat er naar het programma-ingangspunt
wordt gesprongen. De paden `.prg` en `.d64` blijven gewoon werken zoals
voorheen.

### Expliciete typemodus

Geef `--explicit` door om elke declaratielocatie te dwingen een
`:type`-annotatie te bevatten:

```bash
ub build game.ub --explicit
```

Zonder de vlag accepteert Ultimate Basic zowel `var x = 5` (type afgeleid van de
initialisatie of standaard ingesteld op `int`) als `var x: int = 5`. Met de vlag
compileert alleen de geannoteerde vorm; de losse vorm leidt tot een
compileerfout.

**Wat het afdwingt:**

| Verklaringformulier                                             | Zonder `--explicit`         | Met `--explicit`                |
| --------------------------------------------------------------- | --------------------------- | ------------------------------- |
| `var name = expr` (geen `:type`)                                | ok — type afgeleid          | fout                            |
| `var name: int = expr` (of woord/zwevendekommagetal/tekenreeks) | OK                          | OK                              |
| `var arr = array(N)`                                            | ok — impliciet `array`      | ok — ongewijzigd                |
| `var arr = array_word(N)`                                       | ok — impliciet `array_word` | ok — ongewijzigd                |
| `const NAME = value`                                            | OK                          | ok — ongewijzigd                |
| `sub foo(a, b)` (ongetypte parameters)                          | OK                          | fout per niet-getypte parameter |
| `sub foo(a: int, b: int)`                                       | OK                          | OK                              |
| `fn foo(a): int` (parameter zonder typeaanduiding)              | OK                          | fout bij de parameter           |
| `fn foo(a: int): int`                                           | OK                          | OK                              |

Constanten en arraydeclaraties worden altijd geaccepteerd — hun type wordt
bepaald door de declaratievorm, dus `:type` zou overbodig zijn.

**Voorbeeld van een foutmelding:**

```
$ ub build myprog.ub --explicit
Compilation errors:
  line 14: 'explicit' mode: 'var loose' has no type — use 'var loose: int|word|float|string'
  line 16: 'explicit' mode: parameter 'a' has no type — use 'a: int|word|float|string'
```

Deze vlag is een schakelaar die tijdens het compileren wordt ingeschakeld; er
hoeft niets in de broncode te worden gewijzigd om deze in of uit te schakelen.
Voeg de vlag toe aan je Makefile/compilatiescript om de getypte stijl
projectbreed af te dwingen, of laat hem weg voor verkennende scripts. Zie
`examples/explicit_demo.ub` en `examples/explicit_errors_demo.ub`.

### Foutopsporingsbestanden

Gebruik `--debug` om samen met het programma debugsymbolen te genereren:

```bash
ub build demo.ub --debug
```

De compiler schrijft de bestanden naast de `.prg`, waarbij de stam van het
uitvoerbestand wordt gebruikt:

| Bestand    | Vorm en doel                                                                                               |
| ---------- | ---------------------------------------------------------------------------------------------------------- |
| `demo.sym` | Een symboolbron die compatibel is met KickAssembler en geschikt is om te importeren in assembler-broncode. |
| `demo.dbg` | C64Debugger/RetroDebugger KickAssembler debug-dump met het programmasegment en labels                      |
| `demo.vs`  | VICE monitor-opdrachtbestand met `al`-opdrachten voor adreslabels                                          |

Alle drie de exportopties bevatten `program_start`, `program_end`, variabelen,
arrays, subroutines en BASIC-labels die bekend zijn na het genereren van de
code. Laad bijvoorbeeld de VICE-symbolen met de opdrachtregeloptie `-moncommands
demo.vs` of met de monitoropdracht `ll "demo.vs"`.

De huidige `.dbg` export biedt segment- en adressymboolinformatie. Deze bevat
nog geen instructie-naar-bronregel-mapping voor stapsgewijze uitvoering op
broncodeniveau.

### Lijst met assembly-codegeneratie (nieuw in 1.5.2)

Gebruik `--asm` om een leesbare 6502-broncodelijst naast de PRG te schrijven:

```bash
ub build demo.ub --asm
```

For an output named `demo.prg`, this creates `demo.asm`. The listing is produced
from metadata collected while Ultimate Basic generates the machine code; it is
not merely a disassembly of the completed PRG. It contains:

- `; UB:` opmerkingen die het gegenereerde bytebereik van elke emitterende
  UB-instructie markeren;
- benoemde constanten voor variabelen op nul pagina's en arrays, inclusief hun
  typen/groottes; `$C000+`
- definitieve namen en adressen voor subroutines en BASIC-labels;
- genereerde `loc_xxxx` labels voor relatieve takken en in-programma `JMP`/`JSR`
  doelen;
- Normale 6502-mnemoniccodes en -operanden, waarbij compilersymbolen waar
  mogelijk zijn vervangen;
- Het exacte C64-adres en de uitgezonden bytes worden naast elke instructie
  weergegeven;
- Door de compiler gegenereerde hulpfuncties en ingebedde code in hun
  uiteindelijke geheugenvolgorde;
- `.byte` uitvoer voor bytes die niet kunnen worden gedecodeerd als ondersteunde
  6502-instructies.

Compilerhulpfuncties krijgen beschrijvende namen zoals `ub_helper_plot`,
`ub_helper_line_erase`, `ub_helper_print_hex` en `ub_helper_music_irq`. Bekende
ingebedde gegevens – waaronder `data`-instructies, kaartteken-/kleurarrays,
sprite- en tekendefinities, de sinustabel, laadbestandsnamen,
`incbin`-bestanden, SID-muziek en Koala-payloads – worden uitgezonden als
benoemde `.byte`-regio's. Lange, met nullen gevulde adresgaten gebruiken de
`.fill`-richtlijn van KickAssembler.

Voorbeeldfragment:

```asm
.label x                 = $02 ; int

* = $080D

ub_start:
    cld                         ; $080D: D8
    ; UB: var x
    lda  #$01                   ; $080E: A9 01
    sta  x                      ; $0810: 85 02
```

De opmerkingen bij de adressen/bytes maken de lijst gemakkelijk te vergelijken
met `.prg`. De uitvoer gebruikt de KickAssembler-syntaxis (`.label`, `.byte`,
`.fill` en `* = origin`), zodat deze opnieuw geassembleerd kan worden;
machinecode-opmerkingen hebben geen invloed op het resultaat.

`--add` vereist `--d64`. Het gecompileerde `.ub` programma is altijd het eerste
bestand op de schijf; elk `--add` bestand wordt erachter geplaatst.
Bestandsnamen op de schijf zijn afgeleid van de stam van het bronbestand, in
hoofdletters (bijv. `music.prg` → `MUSIC`).

Na een succesvolle compilatie print de compiler altijd een geheugenkaart af:

```
demo.ub → demo.prg  (386 bytes)

  Load:    $080D – $0989

  Variables (zero page):
    score    ZP:$08   byte
    lives    ZP:$0A   byte
    msg      ZP:$0C   string
    ptr      ZP:$0E   word

  Subroutines:
    greet    $0900
    show     $0912

  Arrays ($C000+):
    sprites  $C000   8 bytes
```

Met `-v` toont de uitvoer bovendien de interne ZP-toewijzingen en een volledige
hex-dump.

## Bekende beperkingen

| Functie                               | Beperking                                                                                                                                                                  |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Rekenen met gehele getallen           | 8-bits niet-ondertekend (0–255); `word` variabelen bevatten 16-bits waarden                                                                                                |
| Subroutines                           | Geen recursie — ZP-parameterposities worden statisch toegewezen                                                                                                            |
| Stringvariabelen                      | Read-only after init; assignment replaces the pointer, not the data                                                                                                        |
| String concat runtime                 | `s1 + s2` print sequentieel — geen geheugenallocatie of lengtecontrole                                                                                                     |
| `rnd()` / `rnd(n)`                    | Eenvoudige LCG, niet cryptografisch; periode = 256                                                                                                                         |
| `abs()` / `sgn()` / `min()` / `max()` | Alleen 8-bits waarden; `abs`/`sgn` behandelen waarden als getekend (bit 7 = negatief → `abs` tweecomplement, `sgn` retourneert `$FF`); `min`/`max` zijn ongetekend (0–255) |
| `plot`                                | Pixels buiten het bereik worden stilzwijgend afgesneden (Y ≥ 200 of X ≥ 320 → geen actie)                                                                                  |
| `mplot`                               | Geen grenscontrole — x moet tussen 0 en 159 liggen, y moet tussen 0 en 199 liggen.                                                                                         |
| `mline` / `mrect`                     | Meerkleurig; x: 0–159, y: 0–199. Pixels buiten het scherm worden automatisch overschreven (geen uitsnijding) — coördinaten blijven binnen het bereik.                      |
| `mcircle`                             | Meerkleurig; punten buiten beeld (x ≥ 160 of y ≥ 200 worden overgeslagen) worden uitgeknipt.                                                                               |
| `color pen`                           | Alleen voor huurcellen; stelt de voorgrond-nibble van aangeraakte cellen in (achtergrond blijft behouden). Heeft geen effect in blokmodus (`plot4`/`circle4`)              |
| `rect`                                | Geen grenscontrole — x: 0–319, y: 0–199; x1≤x2 en y1≤y2 worden niet afgedwongen (gedegenereerde/omgekeerde rechthoeken produceren ongedefinieerde uitvoer)                 |
| `plot4`                               | Geen grenscontrole — x moet tussen 0 en 79 liggen, y moet tussen 0 en 49 liggen (blokmodus)                                                                                |
| `circle4`                             | Snijdt pixels buiten het scherm af; de bruikbare straal is ongeveer 0–49 in de 80×50 blokmodus.                                                                            |
| `chr$`                                | Geen PETSCII↔ASCII-mapping — n wordt ongewijzigd doorgegeven aan CHROUT                                                                                                    |
| `music play`                          | Vereist `load sid`; er wordt slechts één CIA1-wrapper gegenereerd (de laatste `music play` wint)                                                                           |
| `graphics on double`                  | Alleen voor huurlingen; gebruikt `$4000–$7FFF` voor de backbuffer, dus programmacode moet onder `$4400` blijven; niet combineerbaar met sprites of meerkleurig             |
| Foutrapportage                        | Alleen tijdens het compileren; `onerr goto` behandelt kernel-I/O-fouten tijdens de uitvoering.                                                                             |
