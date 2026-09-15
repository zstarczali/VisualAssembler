# Ultimate Basic v1.5.6 — Språkmanual

Komplett språk- och CLI-referens för Ultimate Basic, ett BASIC-liknande språk
som kompilerar direkt till 6502-maskinkod för Commodore 64. Utdata: `.prg` filer
(VICE eller riktig hårdvara), `.crt` kassettavbildningar och `.d64`
diskavbildningar.

För en kort projektöversikt och bygginstruktioner, se README.md.

© 2026 Zsolt Tarczali

> Att bygga `ub`-kompilatorn och kommandoradsalternativen beskrivs i
> [README.md](README.md). Denna manual dokumenterar själva Ultimate
> Basic-språket.

## Språkreferens

### Variabler och konstanter

**Alla variabler måste deklareras med `var` innan de används.** Att använda en
odeklarerad variabel i ett uttryck, en tilldelning, en `for`/`loop`-räknare, en
`inc`/`dec`, `input` eller `read`-sats producerar ett kompileringsfel.

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

Nyckelord och identifierare är **skiftlägesokänsliga**: `PRINT`, `Print` och
`print` är alla giltiga.

| Typ                   | Bredd          | Anteckningar                                         |
| --------------------- | -------------- | ---------------------------------------------------- |
| `int`                 | 8-bitars       | standard för numeriska literaler                     |
| `word`                | 16-bitars      | två ZP-byte; kan användas som adress i `poke`/`peek` |
| `float`               | 16-bitars Q8.8 | hi byte = heltalsdel (0–255), lo byte = bråkdel      |
| `string`              | pekare         | ZP-par → nollterminerad PETSCII i kodsegment         |
| `array(N)`            | N byte         | byte-element; finns på `$C000+`, inte i ZP           |
| `array_word(N)`       | N×2 byte       | ordelement (16-bitars); finns på `$C000+`, inte i ZP |
| `array(R, C, …)`      | ∏dims byte     | flerdimensionell (rad-stor); index `arr[r, c]`       |
| `array_word(R, C, …)` | ∏dims×2 byte   | flerdimensionell ordmatris (rad-stor)                |

### Reserverade ord

Följande identifierare är **nyckelord** — de kan inte användas som variabel-,
konstant-, subrutin-, funktions-, parameter- eller etikettnamn. All matchning är
skiftlägesokänslig (`END`, `end`, `End` kolliderar alla). Att använda ett
reserverat ord som namn ger vanligtvis ett förvirrande fel (en `var`-rad
misslyckas tyst med att deklarera, eller ett uttryck som `for i = 1 to times`
viks till `Number(0)`) — så välj ett annat namn.

**Deklarations- och kontrollflöde** `var`, `const`, `sub`, `fn`, `type`,
`endtype`, `return`, `call`, `label`, `goto`, `gosub`, `if`, `then`, `else`,
`end`, `select`, `case`, `for`, `next`, `loop`, `times`, `to`, `step`, `while`,
`repeat`, `until`, `break`, `continue`, `inc`, `dec`, `bye`, `exit`, `rem`

**Typer och typrelaterade** `int`, `word`, `float`, `string`, `array`,
`array_word`

**Utskrift och I/O** `print`, `spc`, `tab`, `at`, `input`, `chr$`, `str$`,
`hex`, `bin`, `open`, `close`, `load`, `save`, `data`, `read`, `include`,
`incbin` (även `dec` — listad ovan som minskningssats; samma token används för
utskriftsformatet `dec(n, width)`)

**Inbyggda matematik- och strängfunktioner** `abs`, `min`, `max`, `clamp`,
`sgn`, `mod`, `rnd`, `sin`, `cos`, `and`, `or`, `xor`, `not`, `bnot`, `shl`,
`shr`, `len`, `asc`, `val`, `str_to_int`, `numstr`

**Minne och timing** `poke`, `peek`, `poke16`, `peek16`, `fill`, `memcopy`,
`drawmem`, `wait`, `raster`, `delay`, `sys`, `asm`

**Skärm och text** `cls`, `fast`, `color`, `text`, `border`, `bg`, `screen`,
`cursor`, `lowercase`, `uppercase`, `display`, `on`, `off`, `scroll`, `speed`,
`badlines`, `turbo`

**Bitmapp- och blockgrafik** `graphics`, `gcls`, `flip`, `plot`, `plot4`,
`mplot`, `mline`, `mrect`, `mcircle`, `line`, `circle`, `circle4`, `rect`,
`paint`, `erase`, `pen`, `multi`, `block`

**Sprites** `sprite`, `sprdef`, `sprite_frame`, `sprite_x`, `sprite_y`,
`sprhit`, `sprbghit`, `box_hit`, `chardef`, `charset`, `expand`, `priority`

**Ljud och musik** `sid`, `sound`, `volume`, `music`, `play`, `pause`, `resume`,
`stop`

**Inmatningsenheter** `getch`, `inkey`, `waitkey`, `joy`, `mouse_x`,
`mouse_x_hi`, `mouse_y`, `mouse_btn`

**Avbrott och vektorer** `irq`, `irq_exit`, `nmi`, `nmi_exit`, `cia_timer`,
`onerr`

**Karaktärskartor och bilder** `map`, `map_tile`, `map_color`, `koala`, `show`,
`hide`

**REU (RAM-expansion)** `reu`, `reudet`, `stash`, `fetch`

**Stilfallgropar — namn som *ser* fria ut men är reserverade**

Dessa vanliga engelska ord ser ut som oskyldiga identifierare men är redan
uppfattade av den som skriver texten. Byt namn för att undvika tysta brytningar:

| Reserverad                                  | Föreslagen namnbyte                 |
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

Symboliska tokens (`+ - * / = == != < > <= >= : , ; ( ) [ ] # $ % @`) kan
naturligtvis inte användas i identifierare.

### Kommentarer

```basic
# hash comment
rem this is also a comment
var x = 5  # inline comment
var x = 5 : var y = 6  # colon separates statements on one line
```

### Operatörer

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

Jämförelser: `==` `!=` `<` `>` `<=` `>=` (retur 1/0)

### Ökning / Minskning

```basic
inc x                    # x = x + 1  (INC zp — single instruction)
dec x                    # x = x - 1  (DEC zp — single instruction)
```

For `word` variables carry is handled: `inc` uses `INC lo; BNE skip; INC hi`;
`dec` uses `LDA lo; BNE skip; DEC hi; DEC lo`.

### Sammansatta uppgifter

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

### Skriva ut

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

### Förgrening

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

`select expr` utvärderar uttrycket en gång och jämför det med varje `case`-värde
i ordning. Den första matchande ärendetexten körs och kontrollen hoppar till
efter `end`. Den valfria `else:`-texten körs om inget ärendetext matchar. Alla
värden måste vara 8-bitars (0–255).

### Loopar

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

**Riktningsregler för `for`/`loop`:**

| Case                                                  | Beteende                                                                                                             |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `for i = 1 to 10` (standard `step +1`, `from ≤ to`)   | räknar uppåt, standard                                                                                               |
| `for i = 0 to 20 step 2` (positivt steg, `from ≤ to`) | räknar upp med 2                                                                                                     |
| `for i = 10 to 1 step -1` (negativt konstant steg)    | räknar ner; kroppen körs för i = 10, 9, ..., 1                                                                       |
| `for i = 20 to 0 step -2` (ner till noll)             | avslutas vid i = 0 genom att detektera ADC-underflödet (C=0) efter minskningen; ingen oändlig loop                   |
| `for i = 10 to 1` (inget steg, `from > to`)           | **kompileringsfel**: `for-loop: from (10) > to (1) with default step +1 loops 0 times — use 'step -1' to count down` |

Kompilatorn väljer exit-branch-kodningen vid kompileringstid baserat på tecknet
för en konstant `step`:

- Positivt steg (eller standard `+1`) → avsluta när `var > to` (osignerad `CMP`
  + `BCC`/`BEQ` faller igenom till `JMP exit`).
- Negativt konstant steg → avsluta när `var < to` (osignerad `CMP` + `BCS` till
  brödtext), **plus** en efterökning `BCS loop_top ; JMP exit` som fångar
  detaljerna när `var` flödar under 0. Det extra instruktionerparet är det som
  håller `for i = N to 0 step -k` ändlig.

Icke-konstanta `step`-värden (t.ex. från en variabel eller ett uttryck)
behandlas som positiva vid kompileringstillfället; om du behöver nedräkning med
ett körtidsstegvärde, dela loopen eller använd en `while`-konstruktion.

### Etiketter och gå till

```basic
label main_loop
  x = x + 1
  if x < 10 then goto main_loop end
```

Vidarebefordra `goto` (etikett definieras senare) stöds fullt ut.

`gosub label` / `return` hoppar till en etikett och går tillbaka (JSR / RTS på
maskinkodsnivå). Etiketten måste vara en `label name`-sats, inte en `sub` — den
har inga parametrar och delar samma nollsidiga omfattning. `gosub` stöder
framåtriktade referenser (etikett definierad efter `gosub`).

```basic
gosub draw_border
...
label draw_border
  # ... draw something ...
  return               # RTS — returns to the instruction after gosub
```

### Subrutiner

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

Parametrar skickas via dedikerade nollsidiga platser. Ingen rekursion (platserna
är statiska). Typade parametrar stöds: `sub draw(x, y:int)` eller `sub
copy(src:string)` — strängparametrar får en 2-byte-pekare så att den anropade
kan indexera källsträngen via `src[i]`.

### Funktioner (returvärden)

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

Funktioner stöder en valfri `: word` returtyp för 16-bitarsvärden:

```basic
fn get_addr(): word
  return $C000
end

var ptr: word = get_addr()  # ptr = $C000
poke ptr, 42                 # STA (ptr),Y — valid indirect addressing
var v = peek(ptr)            # LDA (ptr),Y
```

`fn` genereras i pass 2 (samma som `sub`), så funktionskroppar körs aldrig vid
start. Framåtriktade referenser stöds fullt ut.

### Matriser

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

**Flerdimensionella arrayer** (nytt i 1.5.3)

Matriser kan deklareras med mer än en dimension. De lagras **rad-stor** och
indexeras med en kommaseparerad nedsänkt lista. Den totala storleken är
produkten av alla dimensioner.

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

Row-major-layout innebär att det sista indexet är sammanhängande: `grid[r, c]`
sitter vid `base + r*COLS + c`. Valfritt antal dimensioner stöds (`array(a, b,
c)`). När varje index är en konstant viks adressen vid kompileringstid till en
enda absolut lagring/laddning; ett variabelt index genererar `row*stride +
col`-beräkningen och en indexerad `(ptr),Y`-åtkomst. Ett enda index i en
flerdimensionell array är fortfarande tillåtet och behandlas som ett
platt/linjärt index (`grid[10]`). Dimensioner måste vara
kompileringstidskonstanter (litteraler eller `const`s), och arrayen måste
deklareras innan den indexeras.

**Strukturtyper (`type ... endtype`, nytt i 1.5.4)**

Definiera en fast layout för namngivna fält med `type`, allokera sedan en array
av instanser på samma sätt som en vanlig array. Fältåtkomst använder
`arr[idx].field` och fungerar för både konstanta och variabla index.

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

Regler och begränsningar:

- Fälttyper: `int` (1 byte), `word` (2 byte LE), `float` (2 byte Q8.8). `string`
  och kapslade `type`-fält stöds ännu inte.
- Elementstorlek = summan av fältbredderna (deklarationsordning, ingen
  utfyllnad).
- Lagring finns på `$C000+` tillsammans med vanliga arrayer och visas i
  minneskartan som en vanlig array med den totala bytestorleken.
- Konstant index → `LDA/STA absolute` vid kompileringstid.
- Variabelindex → shift-and-adder-multiplikation för `idx * elem_size`, sedan
  indexerad `(ptr),Y`-åtkomst. Elementstorlekar som är potenser av två (1, 2, 4,
  8, 16) använder bara `ASL A`-kedjor; andra storlekar avger en kort
  shift-adder-sekvens via två nollsidiga byte.
- Sub-/fn-parametrar av en struct-typ stöds ännu inte — skicka istället arrayen
  och ett index, t.ex. `sub move(idx: int) ... enemies[idx].x = ...`.
- Standardfältvärden (`var fire: int = 2` inuti typen) analyseras för
  kompatibilitet med förslaget men har ännu inte initierats vid
  allokeringstillfället.
- Endast ett nedsänkt tecken är tillåtet på en struct-typad array;
  flerdimensionella struct-arrayer stöds inte (använd ett beräknat platt index).

Se `examples/type_demo.ub`.

### 16-bitars (ord)variabler

```basic
var ptr: word = $0400    # two ZP bytes: lo=$00 hi=$04
poke ptr, 6              # STA (ptr),Y
var v = peek(ptr)        # LDA (ptr),Y
```

### Bitmappsgrafik

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

Båda `graphics on`-varianterna tömmer displayen (`LDA $D011 / AND #$EF / STA
$D011`) när de växlar VIC-register, och återaktiverar den sedan i målläget —
förhindrar problem med lägesbytet.

`x` kan vara hela `0–319`-intervallet. Koordinater över 255 hanteras automatiskt
(hjälparen lägger till den nionde X-biten), så `plot`, `line`, `circle` och
`rect` når alla skärmens högra kant. Använd en `word`-variabel när en
X-koordinat kan överstiga 255.

#### Anställer ritfärg — `color pen`

I anställningsläge (320×200) är färgen **per 8×8 cell**, hålls i videomatrisen
(hög nibble = förgrund, låg nibble = bakgrund), inte per pixel. `color pen c`
anger en beständig förgrundsfärg (0-15) som `plot`, `line`, `rect`, `circle` och
`paint` stämplar in i cellen för varje pixel de ritar; cellens bakgrundsnibble
bevaras. Den förblir aktiv till nästa `color pen`. Standardinställningen är vit
(1), så program som aldrig anropar `color pen` ser exakt ut som tidigare.

```basic
graphics on
gcls
color pen 2              # red
line 0, 0, 100, 100
color pen 6              # blue
circle 160, 100, 40
display on
```

#### Flerfärgade former — `mline` / `mrect` / `mcircle`

I flerfärgsläge (`graphics on multi`, 160×200) väljer varje pixel en av fyra
färgkällor via ett 2-bitarsvärde (`%00` bakgrund `$D021`, `%01` skärm hög
nibble, `%10` skärm låg nibble, `%11` färg-RAM). `mplot` anger en enda sådan
pixel; `mline`, `mrect` och `mcircle` ritar former på samma sätt — det
efterföljande `color`-argumentet är 2-bitarskällan (0-3), och de faktiska
färgerna kommer från cellpaletten (skärm / färg-RAM) exakt som för `mplot`.

```basic
graphics on multi
gcls
mcircle 80, 100, 40, 1
mrect 10, 10, 150, 190, 2
mline 0, 0, 159, 199, 3
display on
```

`mline`/`mrect`/`mcircle` återanvänder samma Bresenham-/mittpunktsrutiner som
deras motsvarigheter i anställningsprogrammet, och plottar varje pixel genom
`mplot`; punkter utanför skärmen (x ≥ 160 eller y ≥ 200) hoppas över.

### Dubbelbuffrad bitmapp (flimmerfri)

```basic
graphics on double       # double-buffered hires bitmap (320×200)
gcls                     # clears the HIDDEN back buffer
line 0, 0, 319, 199      # all drawing (plot/line/circle/rect/paint/gcls) goes to the back buffer
flip                     # show the drawn buffer; redirect drawing to the other one
graphics off             # back to text mode (restores VIC bank 0)
```

`graphics on double` behåller **två** kompletta anlitade bitmappar och visar
endast färdiga bildrutor, vilket eliminerar flimmer utan några XOR-trick — varje
bildruta `gcls`, ritar du och sedan `flip`.

| Buffert                   | Bitmapp | Videomatris | VIC-banken | `$DD00` låga bitar |
| ------------------------- | ------- | ----------- | ---------- | ------------------ |
| A (framsida, visas först) | `$2000` | `$0400`     | bank 0     | `%11`              |
| B (baksida, ritad först)  | `$6000` | `$4400`     | bank 1     | `%10`              |

* Alla pixelkommandon skriver genom en runtime **draw base** (en nollsidig
  byte), så de riktar sig automatiskt mot den buffert som för närvarande är
  dold.
* `flip` väntar på den nedre gränsen (raster ≥ 251) innan VIC-banken byts, så
  att växlingen är **fri från tearing**, och pekar sedan ritbasen mot den nu
  dolda bufferten.
* Typisk loop: `gcls` → rita ramen → `flip`. Anropa `display on` en gång efter
  den första `flip` så att den första visade bufferten redan är komplett.

**Krav / begränsningar:**
* Endast anställningar (inte `multi`). Sprites hämtas inte från den bakre
  buffertens VIC-bank.
* Bakbufferten använder `$4000–$7FFF` (matris `$4400`, bitmapp `$6000–$7FFF`),
  så programmets maskinkod måste hålla sig under `$4400`. De flesta demos är
  bara några få kB stora, så detta sker automatiskt; mycket stora program kan
  inte använda dubbel buffring.
* På en standard 1 MHz C64 begränsar den fullständiga `gcls` (8 KB) per bildruta
  bildhastigheten; på Commodore 64 Ultimate höjs `speed` för jämn
  höghastighetsanimation.

Se `examples/cube_demo.ub` — en tumlande 3D-trådmodellkub renderad flimmerfri.

### Blockgrafik (80×50)

```basic
graphics on block        # 80×50 block-pixel mode (text mode + custom 4-pixel charset @ $2800)
graphics off             # return to text mode
gcls                     # clear block playfield: screen RAM $0400-$07FF + color RAM $D800-$DBFF

plot4 x, y               # set block pixel at (x, y);  x: 0-79, y: 0-49
plot4 erase x, y         # clear block pixel at (x, y)
circle4 x, y, r          # draw midpoint circle in block pixels; clips to 80×50
```

Ett tjockt lågupplöst läge ovanpå standard 40×25-text. En anpassad
teckenuppsättning med 16 tecken kopierad till `$2800` kodar ett 2×2
kvadrantrutnät per tecken (bit3=TL, bit2=TR, bit1=BL, bit0=BR), så varje
textcell innehåller 2×2 blockpixlar → ett effektivt 80×50-rutnät. Inget
bitmapps-RAM används (`$2000-$3FFF` förblir ledigt), vilket gör det snabbare än
att hyra bitmapp. `plot4` ELLER om kvadrantbiten är in i cellen så att
överlappande pixlar ackumuleras; `plot4 erase` rensar den. `circle4` använder
samma blockpixelhjälpare för att rita en konturcirkel i 80×50-koordinatutrymmet.
`gcls` rensar både skärm- och färg-RAM. Se `examples/block_demo.ub`.

### Skärm och färg

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

`lowercase` genererar `LDA #$0E; JSR $FFD2` vid körning. Strängliteraler som
kompileras efter `lowercase` får sina gemener och versaler automatiskt
omväxlande — källtecken i versaler lagras i PETSCII-platsen för gemener (`$61+`)
och källtecken i gemener i platsen (`$41+`) — så `"Hello World"`-källkoden visas
som **Hej världen** på skärmen. `uppercase` genererar `LDA #$8E; JSR $FFD2` och
återgår till direkt mappning. `cls` återställer **inte**
teckenuppsättningsläget.

`scroll x n` skriver `(n AND 7)` till bit 0-2 av `$D016` (bit 3-7 bevaras).
`scroll x n narrow` skriver finskrollningsbitarna och rensar `$D016` bit 3
(38-kolumnsläge). `scroll x n wide` skriver finskrollningsbitarna och sätter
`$D016` bit 3 (40-kolumnsläge). `scroll y n` skriver `(n AND 7)` till bit 0-2 av
`$D011` (bit 3-7 bevaras). `scroll row R left` flyttar en konstant skärmrad åt
vänster; skriv det nya tecknet längst till höger med `screen 39, R, ch`.
Användbart för smidig hårdvaruskrollning: minska varje bildruta från 7 ner till
0, flytta skärm-RAM, återställ till 7.

`screen col, row, char [, color]` skriver direkt till skärmens RAM (`$0400 +
row*40 + col`) och eventuellt till färgat RAM (`$D800 + row*40 + col`). Konstant
col/row: adress beräknad vid kompileringstid.

### Ultimate 64 — CPU-hastighet

```basic
speed 4              # set CPU to 4 MHz  (reads $D031, updates bits 0-3, writes back)
speed 48             # 48 MHz  (maximum speed on U64)
speed max            # same as speed 48  (alias)
speed off            # back to 1 MHz  (alias for speed 1)

badlines on          # enable badline timing  ($D031 bit 7 = 0, default C64 behaviour)
badlines off         # disable badline timing ($D031 bit 7 = 1, more CPU cycles)

var t = turbo()      # 1 if turbo is active (bits 0-3 of $D031 != 0), 0 if at 1 MHz
```

Tillgängliga MHz-värden: `1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 20, 24, 32, 40,
48`. Konstanta värden avrundas nedåt till närmaste tillgängliga hastighet vid
kompileringstillfället. Variabla värden behandlas som ett rått hastighetsindex
(0–15) och ELLER-omvandlas till bitar 0-3 av `$D031`.

| $D031 index | MHz (U64) | MHz (U64 Elite-II) |
| ----------- | --------- | ------------------ |
| 0           | 1         | 1                  |
| 3           | 4         | 4                  |
| 6           | 8         | 10                 |
| 11          | 20        | 24                 |
| 15          | 48        | 64                 |

Kräver **U64 Turbo Control** inställd på `U64 Turbo Registers` eller `Turbo
Enable Bit` i U64-konfigurationsmenyn. På en vanlig C64 eller emulator utan
register ignoreras `poke` till `$D031` tyst.

### Tangentbord

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

`mouse_x()` / `mouse_y()` kör internt en hjälprutin som hanterar: CIA1 `$DC00`
kondensatorladdning, ~516-cyklers fördröjning, SID POT X/Y-registerläsning
(`$D419`/`$D41A`), signerad 7-bitars delta-beräkning, Y-axel `EOR #$FF`
inversion och ackumulerad positionsspårning (permanent ZP-tillstånd, 8 byte).
Hjälparen samplar POT två gånger per ram. `mouse_y()` anropar **inte** hjälparen
(endast `mouse_x()` gör det) — den läser bara den cachade `accum_y` för att
undvika dubbeluppdatering.

Hjälparen underhåller en 9-bitars X-ackumulator (`accum_x` + `accum_x_hi` med
carry/borrow). Använd `var sx: word = mouse_x()` — kompilatorn lagrar både lo-
och hi-byte, så `sprite`-kommandot hanterar `$D010` korrekt för X-positioner
bortom 255.

Hjälparen lagrar sitt tillstånd i ZP (`$02`–`$09`). Init-flaggan måste vara noll
före det första anropet — nollställ området med `fill $02, 7, 0` tidigt i ditt
program. Inaktivera även CIA1-avbrott (`poke $DC0D, $7F`) för att förhindra att
KERNAL IRQ vidrör `$DC00` under tangentbordsskanning — vilket stör
POT-avläsningen.

Se `examples/mouse_demo.ub` för en fungerande 1351-musdemo med sprite-spårning
och knappfeedback.

### Utgång

```basic
bye                      # JSR $E544 (clear screen), clear STOP flag, RTS to BASIC
exit                     # alias for bye
```

### Tidpunkt

```basic
wait 50                  # wait 50 raster-line transitions (~3.2 ms)
wait raster 100          # spin until $D012 == 100 (raster-split effects)
delay 1                  # wait 1 PAL frame (1/50 s ≈ 20 ms)
delay 20                 # wait 20 frames ≈ 0.4 s; n can be a variable (0–255)
```

`delay N` räknar N kompletta PAL-bildrutor med rasterlinje 200 som
bildrutegräns.

### SID-ljud

```basic
sound 0, $1CAD, 25       # voice 0, freq $1CAD (≈ middle C PAL), 25 frames duration
sound 1, freq_word, 50   # voice 1, freq from word var, 50 frames (1 s at 50 Hz)
sound 2, 0, 0            # voice 2, silence

sid volume 15            # master volume full ($D418 = $0F); range 0-15
sid volume 0             # silence (master volume = 0)
sid stop                 # zero all 25 SID registers ($D400–$D418) — complete silence
```

`sound <channel>, <freq>, <duration>` — längd i PAL-bildrutor (1/50 s vardera).
Fast ADSR: attack/decay `$09`, sustain/release `$F0`, sågtandsvågform.
Mastervolym `$D418` alltid inställd på `$0F`.

`sid volume N` skriver N till `$D418`. Bitarna 0-3 = volym (0-15), bitarna 4-7 =
filterläge. `sid stop` avger en 10-byte nollfyllningsslinga — snabbare än 25
individuella pokes.

### Musikuppspelning

`music play/stop/pause/resume` är ett övergripande alternativ till den manuella
`sys sid_init` / `cia_timer`-inställningen. Kräver en föregående `load sid`-sats
(definierar `sid_init` / `sid_play`).

```basic
load sid "tune.sid"         # embed SID file (defines sid_init / sid_play)

music play                  # initialise sub-tune 0 + start CIA1 50 Hz IRQ
music play 1                # start from sub-tune 1 (song number 0-based)
music stop                  # stop playback + zero all 25 SID registers ($D400-$D418)
music pause                 # disable CIA1 timer A IRQ (music freezes, SID unchanged)
music resume                # re-enable CIA1 timer A IRQ (continues from pause point)
```

| Påstående        | Effekt                                                                                                |
| ---------------- | ----------------------------------------------------------------------------------------------------- |
| `music play [n]` | anropa `sid_init(n)`, konfigurera CIA1-timer A till 19 656 cykler (~50 Hz PAL), installera IRQ-omslag |
| `music stop`     | inaktivera CIA1 IRQ + nollställ alla 25 SID-register                                                  |
| `music pause`    | inaktivera CIA1 IRQ (SID-utmatningen förblir fryst)                                                   |
| `music resume`   | återaktivera CIA1 IRQ (fortsätter från pauspunkten)                                                   |

IRQ-omslaget (som skickas ut en gång i slutet av programmet) gör: ACK CIA1 timer
A → `JSR sid_play` → `JMP $EA81`.

### Sprites

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

X stöder hela 9-bitarsintervallet (0–319): använd en `word`-variabel för
runtime-värden > 255. Sprite-datapekare: `data_addr` måste vara
64-byte-justerad; lagras som `addr >> 6` vid `$07F8+id`.

#### Sprite animation with `sprite_frame`

`sprite_frame` är kommandot som används för att ändra den visade bilden av en
sprite under animering. Det ändrar bara spritens datapekare; det flyttar
**inte** spriten, aktiverar den eller flyttar bildrutor automatiskt.

Lagra animationsbilderna i följd, där varje 63-byte sprite-bild upptar en
64-byte-justerad plats. Skicka den nollbaserade animationsbildrutan som det
tredje argumentet:

```basic
sprite_frame sprite_id, första_bildruteadress, bildrutenummer
```

Till exempel, med basadressen `$2000`, använder bildruta 0 `$2000`, bildruta 1
använder `$2040`, bildruta 2 använder `$2080`, och så vidare. Programmet styr
animeringens timing och radbrytning:

```basic
var frame = 0
loop
  sprite_frame 0, $2000, frame
  frame = frame + 1
  if frame == 4 then frame = 0 end
  delay 5
end
```

Tvåargumentformen, `sprite_frame id, address`, väljer helt enkelt en statisk
sprite-bild och förblir bakåtkompatibel. Sprite-positionen styrs fortfarande av
`sprite id,x,y`.

### Kollision i programvarans gränsruta

```basic
var touching = box_hit(left1, top1, right1, bottom1,
                       left2, top2, right2, bottom2)
```

`box_hit()` utför ett axeljusterat avgränsningsboxtest (AABB) och returnerar `1`
när de två rektanglarna överlappar eller nuddar varandra, annars `0`. Till
skillnad från `sprite_hit()` och `sprite_bg_hit()` läser eller rensar den inte
VIC-II-kollisionsregister. De åtta argumenten är godtyckliga 8-bitarsuttryck, så
rutor kan vara mindre än den synliga sprite-bilden eller kan beskriva spelobjekt
som inte är sprite. Koordinaterna är inkluderande; behåll `left <= right` och
`top <= bottom`.

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

`sprdef id ... end` bäddar in 63 spritebyte vid nästa 64-byte-justerade adress i
kodsegmentet, skickar en `JMP` över dem och ställer automatiskt in `$07F8+id =
data_addr >> 6`. För att använda samma form för flera sprites, läs tillbaka
pekaren:

```basic
var pg = peek($07F8)   # pointer set by sprdef 0
poke $07F9, pg         # copy to sprites 1–7
```

### Karaktärsrutekartor (`.ubmap`)

```basic
map load "levels/world.ubmap"
map draw map_x, map_y       # draw a 40x25 viewport to screen/color RAM

var tile = map_tile(x, y)   # read character code from the map
map set x, y, 42            # change character code in writable map data

var shade = map_color(x, y) # read cell color (0 when map has no color data)
map color x, y, 7           # change cell color when color data is present
```

`map load` löser filnamnet relativt till `.ub` källfilen, validerar den vid
kompileringstid och bäddar in dess tecken- och valfria färgmatriser i skrivbart
program-RAM. En senare `map load` ersätter den aktiva mappningen för
efterföljande mappningskommandon.

`map load` accepterar även en VisualAssembler `me-map` `.bin`-export direkt:

```basic
kartläsning "map-multicolor.bin"
```

De första 1000 byten blir 40×25-teckenmappningen och de kommande 1000 byten blir
cellfärger. Flerfärgsläge och `$D021-$D023` läses från
VisualAssembler-metadatatrailern, så ingen `.ubmap`-konvertering krävs.

`map draw map_x, map_y` kopierar en 40×25-vyport med början vid den angivna
kartcellen till skärm-RAM `$0400` och, om sådan finns, färg-RAM `$D800`. Kartan
måste innehålla hela den begärda vyporten: behåll `map_x <= width-40` och `map_y
<= height-25`. Koordinater och dimensioner är för närvarande 8-bitars (0–255).

Vanliga kartor rensar textens flerfärgsbit i `$D016`. Flerfärgskartor ställer in
den och laddar deras tre globala färger i `$D021`, `$D022` och `$D023`.
Teckenkartor innehåller teckenkoder, inte teckenuppsättningspixlar; kombinera
dem med `charset`/`chardef` eller någon annan teckenuppsättningsladdningsmetod.
I flerfärgstextläge väljer cellfärgerna 8–15 flerfärgade tecken enligt
VIC-II-reglerna.

#### UBMP version 1 binärt format

Alla multibyte-heltal är little-endian:

|   Offset |    Storlek | Menande                                                        |
| -------: | ---------: | -------------------------------------------------------------- |
|        0 |          4 | ASCII-magi `UBMP`                                              |
|        4 |          1 | Version, för närvarande `1`                                    |
|        5 |          1 | Flaggor: bit 0 = färgmatris finns, bit 1 = flerfärgat textläge |
|        6 |          2 | Kartbredd, 1–255 celler                                        |
|        8 |          2 | Karthöjd, 1–255 celler                                         |
|       10 |          1 | Bakgrund 0 (`$D021`), låg nibble-användning                    |
|       11 |          1 | Flerfärgad 1 (`$D022`), används med låg nibblekvalitet         |
|       12 |          1 | Multicolor 2 (`$D023`), används med låg nibble-effekt          |
|       13 | bredd×höjd | Koder för större radtecken                                     |
| följande | bredd×höjd | Valfria rad-huvudfärgsnibbles när flaggbit 0 är satt           |

En UBMP-fil måste ha exakt den längd som anges i dess rubrik. Ogiltig magi,
version, dimensioner eller längd producerar ett kompileringsfel.

### Import av bild från Koala Painter

```basic
koala load "pictures/title.kla"  # validate and embed at compile time
koala show                       # enter bitmap multicolor mode
koala hide                       # return to the default text display
```

`koala load` accepterar en standard 10003-byte Koala-fil (`$6000`
laddningsadress plus 10001 databyte) eller en rå nyttolast på 10001 byte.
Sökvägarna är relativa till `.ub`-filen. Nyttelasten innehåller 8000
bitmappsbyte, 1000 skärmbyte, 1000 färgbitar och en bakgrundsfärgsbyte.

Kompilatorn lagrar den på `$6000-$8710`. `koala show` kopierar bitmappen till
`$2000`, skärmmatrisen till `$0400`, färgerna till `$D800` och aktiverar
bitmap-flerfärgsläge. `koala hide` rensar bitmap-/flerfärgsläge och återställer
standardtextlayouten.

Genererad kod och hjälpfiler måste sluta nedanför `$2000`, eftersom den visade
bitmappen skriver över `$2000-$3F3F`; kompilatorn rapporterar ett fel annars.
Koala-import kan för närvarande inte kombineras med `load sid` i samma program.

### Anpassad teckenuppsättning

```basic
charset $3800            # set base address for chardef (default $3800)

chardef 65               # redefine character 65 ('A')
  $18,$3C,$66,$7E,$66,$66,$66,$00
end

chardef 66               # fewer than 8 bytes are zero-padded
  $7C,$66,$7C,$66,$7C
end
```

`charset base` anger destinationsadressen som används av alla efterföljande
`chardef`-satser. `chardef id ... end` bäddar in 8 byte inline i kodsegmentet
(föregånget av en `JMP` för att hoppa över dem), och kopierar dem sedan till
`charset_base + id*8` vid körning. Värden måste vara kompileringstidskonstanter;
använd `%` för binära litteraler (`%00011000`).

För att aktivera en anpassad teckenuppsättning i VIC-II, ange teckengeneratorns
adress via `$D018`:
```basic
charset $3800
chardef 1  $FF,$81,$81,$81,$81,$81,$81,$FF  end  # box border
poke $D018, $1A     # screen at $0400, charset at $3800 (bank 0)
```

### Minne

```basic
poke $D020, 2            # STA $D020
poke addr_var, 6         # STA (addr_var),Y  — if addr_var is word type
var v = peek($D012)      # LDA $D012
var v = peek(addr_var)   # LDA (addr_var),Y  — if addr_var is word type

var w: word = peek16($C000)   # read 16-bit little-endian: lo=$C000, hi=$C001
poke16 $0314, $EA81           # write 16-bit little-endian: lo→$0314, hi→$0315
poke16 ptr, w                 # word var as address; word var as value
```

`peek16(addr)` läser två på varandra följande byte (lo, hi) som en `word`.
`poke16` skriver lo och sedan hi.

### Disk-I/O

```basic
load "PROGRAM"           # KERNAL LOAD: loads file from device 8 to its native address
load "DATA", $C000       # loads file to a specific address
load "DATA", ptr         # addr from word variable

save "DATA", $C000, 4096 # KERNAL SAVE from $C000, 4096 bytes → device 8
save "PROG", start, len  # addr and len from word/int variables
```

`load` anropar KERNAL `SETNAM`+`SETLFS`+`LOAD` (`$FFBD`/`$FFBA`/`$FFD5`). Utan
adress: sekundär adress 0 (filens egen 2-byte-rubrik används som
laddningsadress). Med adress: sekundär adress 1 (filen laddad till angiven
plats). `save` anropar `SETNAM`+`SETLFS`+`SAVE` (`$FFBD`/`$FFBA`/`$FFD8`).
Kräver både `addr` och `len`.

### SID Music

```basic
load sid "tune.sid"            # embed SID music at its native load address
load sid "tune.sid", $2000     # override: embed at $2000 regardless of SID header
```

`load sid` läser en PSID- eller RSID-fil vid **kompileringstid**, raderar
rubriken och lägger till de råa musikbytena i utdata `.prg`. Efter `load sid`
blir två kompileringstidskonstanter tillgängliga:

| Konstant   | Beskrivning                                                                     |
| ---------- | ------------------------------------------------------------------------------- |
| `sid_init` | Init-rutinadress — anropa en gång med A = låtnummer (0-baserat)                 |
| `sid_play` | Spela upp rutinadress — anropa varje bildruta (50 Hz PAL) från en IRQ-hanterare |

Båda konstanterna fungerar överallt där en konstant adress accepteras: `sys`,
`irq`, `poke`, uttryck.

**Typisk användning:**

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

**Anteckningar:**
- SID-data placeras **efter** all genererad kod, utfylld med nollor upp till
  laddningsadressen. Kompilatorn varnar om SID-laddningsadressen skulle
  överlappa genererad kod.
- PSID v1 och v2 stöds. Om SID-headerns laddningsadress är 0 används de två
  första databytena som adress (PRG-stil, little-endian).
- Endast en `load sid` per program är meningsfull (den sista vinner).

### Seriell kanalfil I/O

```basic
open 1, 8, 2, "MYFILE"  # open logical file 1, device 8, secondary 2, name "MYFILE"
open 2, 4, 7             # open printer (device 4), no filename
open ch, dev, sec        # channel, device, secondary from variables

print# 1, "HELLO"        # send "HELLO"+CR to logical file 1
print# ch, x, "text"     # any mix of vars, strings — same as print but to file

close 1                  # close logical file 1
close ch                 # channel from variable
```

`open` anropar `SETNAM` ($FFBD) + `SETLFS` ($FFBA) + `OPEN` ($FFC0). Utan ett
filnamn anropas SETNAM med längden 0. `print#` skickar utdata via `CHKOUT`
($FFC9), CHROUT per tecken (+ efterföljande CR), sedan `CLRCHN` ($FFCC). `close`
placerar kanalnumret i A och anropar `CLOSE` ($FFC3).

### Input

```basic
input score              # read up to 3 digits from keyboard → 8-bit int var
input "Name: ", name     # optional prompt string, then read line → string var
input "Score: ", score   # prompt + int input
```

`input` använder KERNAL BASIN (`$FFCF`) för blockerande, ekoad linjeinmatning
med DEL-stöd.
- **Int var**: accepterar endast `0`–`9`, max 3 tecken; konverterar till
  8-bitarsvärde vid CR.
- **Strängvariabel**: accepterar upp till 30 tecken; lagrar som null-avslutad
  sträng; ZP-par uppdaterat.

### Flytpunkt / Fixpunkt

`float`-variabler använder Q8.8-formatet med fast punkt: den höga byten är
heltalsdelen (0–255) och den låga byten är bråkdelen (0/256 … 255/256).

```basic
var f: float = 3.5       # 3.5 → hi=3, lo=128 (= 0x0380)
var g: float = 0         # integer 0 is promoted to 0.0 automatically

f = 1.5                  # Q8.8 literal assignment
f = f + 1.5              # 16-bit Q8.8 arithmetic (result: 3.0)
f = f + g                # float + float

var n = int(f)           # extract integer part (hi byte) → 8-bit int
print f                  # prints as "N.DD" (e.g. 3.5 → "3.50", 1.25 → "1.25")
```

| Drift          | Exempel              | Anteckningar                           |
| -------------- | -------------------- | -------------------------------------- |
| Bokstavlig     | `3.5`, `0.25`, `1.0` | parsad som Q8.8 vid kompileringstid    |
| Heltalskampanj | `f = 5`              | lagrar 5,0 (hög=5, låg=0)              |
| Lägg till/dela | `f + 1.5`, `f - g`   | 16-bitars Q8.8-aritmetik               |
| Extrahera int  | `int(f)`             | returnerar hi byte som 8-bitars heltal |
| Skriva ut      | `print f`            | formatera "N.DD", alltid 2 bråksiffror |

**Varning:** Aritmetiskt överflöde avslutas vid 255,255 (ingen mättnad).
Multiplikation och division av två flyttalvariabler stöds ännu inte — använd
`int()` + heltalsaritmetik för dessa fall.

### Matematiska funktioner

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

### Strängfunktioner

```basic
var n = len(msg)         # length of null-terminated string var (0–255)
var c = asc(msg)         # PETSCII code of first character (0 if empty)
var c = asc("A")         # compile-time: constant PETSCII code
var n = val(s)           # runtime: parse decimal PETSCII string → 8-bit int (e.g. "042" → 42)
var c = msg[i]           # string character at index i: PETSCII code of msg[i]
msg[i] = c               # write PETSCII byte c to string at index i — STA (ptr),Y
msg[0] = 72              # constant index → LDY #0; STA (ptr),Y
```

### Nummerformatering

```basic
print hex(n)             # print as 2-digit uppercase hex
print bin(n)             # print as 8-bit binary string
print dec(n, 4)          # right-justified decimal in a field of 4 chars (e.g. 42 → "  42")
print dec(n, width)      # width can also be a variable
```

`dec(n, width)` fyller ut talet till vänster med mellanslag för att fylla
`width` tecken. Om talet har fler siffror än `width` skrivs det ut utan
utfyllnad (ingen trunkering). I icke-utskriftssammanhang utvärderas `dec(n, w)`
till `n` oförändrad (samma som `hex`/`bin`).

### REU (RAM-expansionsenhet)

```basic
var ok = reu_present()   # 1 if REU detected, 0 if not (write/read test on $DF04)
var ok = reudet()        # alias for reu_present()

reu stash c64addr, bank, reu_addr, len  # copy C64 → REU
reu fetch c64addr, bank, reu_addr, len  # copy REU → C64
reu swap  c64addr, bank, reu_addr, len  # swap between C64 and REU
```

`reu_present()` utför ett skriv-/återläsningstest på REU-registret `$DF04`. Utan
en REU går skrivningen förlorad (öppen buss), så återläsningen skiljer sig åt —
detekterar tillförlitligt närvaro utan att vidröra något sidoverkande
kommandoregister.

| Parameter  | Bredd     | Anteckningar                                                     |
| ---------- | --------- | ---------------------------------------------------------------- |
| `c64addr`  | 16-bitars | C64 RAM-start — konstant, `word` variabel eller 8-bitars uttryck |
| `bank`     | 8-bitars  | REU-banknummer (0–7 för en 512 KB-enhet)                         |
| `reu_addr` | 16-bitars | Kvittning inom REU-banken                                        |
| `len`      | 16-bitars | Byte att överföra (`0` = 65 536 i REU-hårdvara)                  |

REU-register: `$DF01` kommando (`$B0` stash / `$B1` fetch / `$B2` swap),
`$DF02–$DF03` C64 addr, `$DF04–$DF05` REU offset, `$DF06` bank, `$DF07–$DF08`
längd. Överföringen är synkron (CPU stoppad under DMA). Kräver en riktig REU
eller VICE: **Inställningar → Hårdvara → RAM-expansionsmodul**.

### Minnesverktyg

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

Både `fill` och `memcopy` stöder 16-bitarslängder (0–65535). Använd
`word`-variabler för längder > 255.

`drawmem src, dst, width, height, stride` kopierar ett 2D rektangulärt block.
`src` läses linjärt (packade rader); `dst` går framåt med `stride` byte mellan
raderna — använd `40` ($28) för C64-skärmen eller färg-RAM (40 kolumner). Bredd,
höjd och steglängd är alla 8-bitarsvärden. `src` och `dst` kan vara konstanter,
`word` variabler eller 8-bitarsuttryck.

### Raster-IRQ

```basic
irq my_handler           # raster IRQ at line 0, handler = sub name or address
irq my_handler, 100      # raster IRQ at raster line 100
irq $C800, 200           # handler at fixed address
irq addr_word            # handler address from a word variable
```

Ställer in en raster-IRQ via BASIC-mjukvektorn (`$0314`/`$0315`): inaktiverar
CIA1-timer-IRQ, ACK:er väntar på VIC IRQ, skriver rasterlinje till `$D012`,
aktiverar VIC-raster-IRQ (`$D01A=$01`), skriver hanteraradress och återaktiverar
avbrott.

Hanteraren **måste** sluta med `sys $EA81` (KERNAL-slutet av IRQ) — vanliga
`RTS` eller `RTI` kommer att korrumpera stacken. Bekräfta VIC IRQ först:

```basic
sub my_handler()
  poke $D019, $FF      # ACK VIC IRQ
  # ... work here ...
  sys $EA81            # JMP to KERNAL end-of-IRQ
end
```

Framåtriktade referenser stöds (`irq my_handler` innan suben är definierad).

### NMI-hanterare

```basic
nmi my_nmi               # set NMI vector $0318/$0319 to handler sub or address

sub my_nmi()
  # ... NMI work here ...
  nmi_exit               # JMP $FE47 — proper NMI exit (restores A/X/Y + RTI)
end
```

`nmi handler` skriver hanteraradressen till NMI-mjukvektorn (`$0318`/`$0319`).
Hårdvaru-NMI-vektorn vid `$FFFA` pekar på KERNAL NMI-rutinen som förgrenar sig
till `$0318`. Hanteraren **måste** sluta med `nmi_exit` (skriver ut `JMP $FE47`)
— användning av vanlig `RTI` kommer att korrumpera stacken. Framåtriktade
referenser stöds.

### CIA1-timer-IRQ

```basic
cia_timer 19656, my_handler   # CIA1 timer A: fires every 19656 cycles (~50 Hz PAL)
cia_timer period, handler      # period can be a variable or expression
```

Ställer in CIA1-timer A som en periodisk IRQ-källa via BASIC-mjukvektorn
(`$0314`/`$0315`):
1. SEI — inaktivera avbrott
2. `$DC0D = $7F` — inaktivera alla CIA1 IRQ:er
3. Load 16-bit period lo→`$DC04`, hi→`$DC05`
4. Skriv hanteraradressen till `$0314`/`$0315`
5. `$DC0D = $81` — aktivera CIA1-timer A IRQ
6. `$DC0E = $01` — starta timer A i kontinuerligt läge
7. CLI — återaktivera avbrott

Hanteraren måste sluta med `irq_exit` (eller `sys $EA81`) och ska bekräfta CIA1
IRQ:n:

```basic
sub my_handler()
  poke $DC0D, $01      # ACK CIA1 timer A IRQ (read also clears it)
  # ... work here ...
  irq_exit             # JMP $EA81: restore A/X/Y + RTI
end
```

PAL-timing: klocka = 985 248 Hz. Period för 50 Hz = 985 248 / 50 = 19 705 cykler
≈ `$4CC9`. Framåtriktade referenser stöds.

### Felhantering

```basic
onerr goto err_handler   # set KERNAL I/O error vector ($0300/$0301) to a label

...

label err_handler
  print "I/O ERROR"
  bye
```

`onerr goto label` skriver etikettadressen (lo, hi) till KERNAL-platserna
`$0300` och `$0301`. När ett KERNAL I/O-fel uppstår (t.ex. ett misslyckat `load`
eller `open`) kör KERNAL `JMP ($0300)`, vilket förgrenar sig till etiketten.
Framåtriktade referenser (etikett definierad efter `onerr goto`) stöds.

### Inbäddning av filer vid kompilering

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

Alla `data`-värden samlas in vid kompileringstillfället. En 2-byte ZP-pekare
allokeras och initieras automatiskt vid programstart. Varje `read` flyttar
pekaren framåt.

### Inline-montering

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

**Adresseringslägen:**

| Syntax          | Läge          | Byte | Exempel                       |
| --------------- | ------------- | ---- | ----------------------------- |
| (ingen operand) | Underförstådd | 1    | `NOP`, `RTS`                  |
| `A`             | Ackumulator   | 1    | `ASL A`, `LSR`                |
| `#value`        | Omedelbar     | 2    | `LDA #$07`                    |
| `$zz` (0–255)   | Noll-sida     | 2    | `LDA $50`                     |
| `$zz,X`         | ZP,X          | 2    | `LDA $50,X`                   |
| `$zz,Y`         | ZP,Y          | 2    | `LDX $50,Y`                   |
| `$xxxx`         | Absolut       | 3    | `LDA $0400`                   |
| `$xxxx,X`       | Absolut, X    | 3    | `LDA $0400,X`                 |
| `$xxxx,Y`       | Absolut, Y    | 3    | `LDA $0400,Y`                 |
| `($xxxx)`       | Indirekt      | 3    | `JMP ($FFFC)`                 |
| `($zz,X)`       | (Indirekt, X) | 2    | `LDA ($50,X)`                 |
| `($zz),Y`       | (Indirekt), Y | 2    | `LDA ($50),Y`                 |
| `label`         | Relativ       | 2    | `BNE label` (endast filialer) |

- `$zz` (1–2 hexagonsiffror, värde ≤ 255) väljer noll-sida om instruktionen
  stöder det; annars uppgraderas automatiskt till absolut. Använd `$00xx` (4
  siffror) för att tvinga fram absolutvärde.
- Grenoperander är absoluta adresser; den relativa byteoffseten beräknas
  automatiskt.
- Lokala etiketter (`name:`) är begränsade till `asm { }`-blocket. Framåtriktade
  grenar löstes i steg 2.
- `#<label` / `#>label` ger lo / hi-byten för en etiketts adress.
- `*` ger den aktuella instruktionsadressen, så `JMP *` monteras som en
  självloop.
- Rader som börjar med `$`, `%` eller en siffra genereras som råa byte
  (bakåtkompatibla).
- Inuti `asm { }` är kommentarer `;` eller `//` till slutet av raden. (`#` är
  det omedelbara prefixet, inte en kommentar.)

**Blandar `asm { }` med subrutinparametrar**

Parameternamn är **inte tillgängliga** inuti `asm { }`-block. Använd
UltimateBasic-satser för att flytta värden till kända platser före `asm {
}`-blocket:

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

För rutiner vars hela kropp är assembler — särskilt IRQ-hanterare som måste
korsreferera varandra — placera alla hanterare i ett **enda toppnivå `asm {
}`-block** i huvudprogrammet. Etiketter i samma block delar scope, så att `irq1`
och `irq2` kan referera till varandra fritt. Se `examples/raster_irq_demo.ub`.

### Sträng ↔ heltal

```basic
numstr score, $0340      # writes "042\0" at $0340 (always 3 digits, zero-padded)
var n = str_to_int("42") # compile-time: Expr::Number(42)

print str$(score)                # print 8-bit int as 3-digit decimal string ("000"–"255")
print "Score: " + str$(score)   # usable in string concat print context
var s: string = str$(n)          # assign str$() result to a string var (shared static buffer)
```

`str$(n)` konverterar ett 8-bitarsvärde till en decimalsträng med 3 tecken
(alltid 3 siffror med inledande nollor, t.ex. `5` → `"005"`, `42` → `"042"`,
`255` → `"255"`) följt av en nullterminator. Resultatpekaren lagras i ett
permanent ZP-par som allokeras vid kompileringstillfället.

> **Obs!** `str$(n)` använder en enda delad statisk buffert på 4 byte. Om du
> anropar `str$(n)` igen skrivs det föregående resultatet över. För samtidig
> visning av flera värden, använd `numstr` för att skriva till separata absoluta
> adresser.

## Exempel

| Fil                                 | Beskrivning                                                                            |
| ----------------------------------- | -------------------------------------------------------------------------------------- |
| `examples/features.ub`              | const, label/goto, poke/peek, rnd, matematiska funktioner                              |
| `examples/new_features.ub`          | underparametrar, arrayer, ordvariabler, strängvariabler                                |
| `examples/bitmap_demo.ub`           | 320×200 bitmapp, plott, grafik på/av                                                   |
| `examples/block_demo.ub`            | 80×50 blockgrafik, plot4, cirkel4, grafik på block                                     |
| `examples/joystick_demo.ub`         | joystickläsning, sprite-rörelse                                                        |
| `examples/mux_demo.ub`              | raster sprite multiplexer (3 fönster × 8 sprites = 24)                                 |
| `examples/orbit_demo.ub`            | 24-sprite-bana med pulserande radie och slumpmässiga färger                            |
| `examples/plasma_demo.ub`           | plasmaeffektbitmapp med rasterkantanimering                                            |
| `examples/sprite_data.ub`           | sprdef-formdata (inkluderad av andra demos)                                            |
| `examples/sprite_mux_orbit.ub`      | Demo av en 24-sprite-bana med sprdef + förberäknade positioner                         |
| `examples/sprite_orbit_demo.ub`     | 8 hårdvaruspriter i cirkulär bana via sin/cos-tabellen                                 |
| `examples/reu_bitmap_demo.ub`       | REU-lagring/hämtning med bitmappsgrafik                                                |
| `examples/sid_music_demo.ub`        | SID-musikspelare med raster-IRQ och tangentbordsutgång                                 |
| `examples/tenprint.ub`              | 5 TENPRINT-labyrintimplementeringar med meny; demos `lowercase` teckenuppsättningsläge |
| `examples/countdown_demo.ub`        | Nedräkning `for..next` med negativa steg, inkl. `for i = 20 to 0 step -2`              |
| `examples/countdown_errors_demo.ub` | Kompileringsfel för standardsteget `from > to`                                         |
| `examples/explicit_demo.ub`         | `--explicit` CLI-flag-demo med fullständigt typade `var`, `sub`, `fn`                  |
| `examples/explicit_errors_demo.ub`  | Lös kod som bygger utan `--explicit`, fel med den                                      |

## CLI-referens

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

Ultimate Basic kan också skriva en Magic Desk typ-19-patronavbildning när
utdatafilnamnet slutar på `.crt`:

```bash
ub build demo.ub -o demo.crt
```

Kompilatorn slår in den genererade PRG:n i en bankad CRT-container med samma
layout som VisualAssemblers CRT-export: en 64-byte patronhuvud, en 8×8K Magic
Desk-avbildning och en starthanterare i bank 0 som kopierar PRG-nyttolasten till
C64 RAM innan den hoppar till programmets startpunkt. Sökvägarna `.prg` och
`.d64` fortsätter att fungera som tidigare.

### Explicit-typläge

Skicka `--explicit` för att tvinga varje deklarationsplats att bära en
`:type`-annotering:

```bash
ub bygg spel.ub --explicit
```

Utan flaggan accepterar Ultimate Basic både `var x = 5` (typ härledd från
initialiseraren eller standardinställd till `int`) och `var x: int = 5`. Med
flaggan kompileras endast den annoterade formen — den lösa formen blir ett
kompileringsfel.

**Vad den tillämpar:**

| Deklarationsblankett                              | Utan `--explicit`            | Med `--explicit`         |
| ------------------------------------------------- | ---------------------------- | ------------------------ |
| `var name = expr` (nej `:type`)                   | ok — typ antydd              | fel                      |
| `var name: int = expr` (eller ord/flyttal/sträng) | ok                           | ok                       |
| `var arr = array(N)`                              | okej — implicit `array`      | okej — oförändrad        |
| `var arr = array_word(N)`                         | okej — implicit `array_word` | okej — oförändrad        |
| `const NAME = value`                              | ok                           | okej — oförändrad        |
| `sub foo(a, b)` (otypade parametrar)              | ok                           | fel per otypad parameter |
| `sub foo(a: int, b: int)`                         | ok                           | ok                       |
| `fn foo(a): int` (otypad parameter)               | ok                           | fel på parametern        |
| `fn foo(a: int): int`                             | ok                           | ok                       |

Konstanter och arraydeklarationer accepteras alltid — deras typ fastställs av
deklarationsformuläret, så `:type` skulle vara redundant.

**Exempel på felutdata:**

```
$ ub build myprog.ub --explicit
Compilation errors:
  line 14: 'explicit' mode: 'var loose' has no type — use 'var loose: int|word|float|string'
  line 16: 'explicit' mode: parameter 'a' has no type — use 'a: int|word|float|string'
```

Flaggan är en växling vid byggtid — ingenting i källkoden behöver ändras för att
välja att delta eller inte delta. Lägg till den i ditt Makefile-/byggskript för
att tillämpa typsnittsstil i hela projektet, eller ta bort den för utforskande
skript. Se `examples/explicit_demo.ub` och `examples/explicit_errors_demo.ub`.

### Felsök filer

Använd `--debug` för att generera felsökarsymboler tillsammans med programmet:

```bash
ub build demo.ub --debug
```

Kompilatorn skriver filerna bredvid `.prg` med hjälp av utdatafilens stam:

| Fil        | Format och syfte                                                                                   |
| ---------- | -------------------------------------------------------------------------------------------------- |
| `demo.sym` | KickAssembler-kompatibel symbolkälla, lämplig för import till assemblerkällkod                     |
| `demo.dbg` | C64Debugger/RetroDebugger KickAssembler debug-dump som innehåller programsegmentet och etiketterna |
| `demo.vs`  | VICE monitor-kommandofil som innehåller `al`-kommandon för adressetiketter                         |

Alla tre exporterna inkluderar `program_start`, `program_end`, variabler,
arrayer, subrutiner och BASIC-etiketter som är kända efter kodgenerering. Ladda
till exempel VICE-symbolerna med dess `-moncommands demo.vs`
kommandoradsalternativ eller bildskärmens `ll "demo.vs"`-kommando.

Den nuvarande `.dbg`-exporten tillhandahåller information om segment och
adresssymboler. Den inkluderar ännu inte mappningar av instruktions-till-källrad
för stegning på källnivå.

### Listning av assemblerkodgenerering (nytt i 1.5.2)

Använd `--asm` för att skriva en läsbar 6502-källförteckning bredvid PRG:n:

```bash
ub build demo.ub --asm
```

For an output named `demo.prg`, this creates `demo.asm`. The listing is produced
from metadata collected while Ultimate Basic generates the machine code; it is
not merely a disassembly of the completed PRG. It contains:

- `; UB:` kommentarer som markerar det genererade byteintervallet för varje
  emitterande UB-sats;
- namngivna konstanter för nollsidiga variabler och `$C000+`-arrayer, inklusive
  deras typer/storlekar;
- slutgiltiga namn och adresser för subrutiner och BASIC-etiketter;
- genererade `loc_xxxx`-etiketter för relativa grenar och `JMP`/`JSR`-mål i
  programmet;
- normal 6502 mnemonik och operander, med kompilatorsymboler ersatta där de är
  kända;
- den exakta C64-adressen och emitterade byte bredvid varje instruktion;
- kompilatorgenererade hjälpprogram och inbäddad kod i deras slutliga
  minnesordning;
- `.byte` utdata för byte som inte avkodas enligt stödda 6502-instruktioner.

Kompilatorhjälpare får beskrivande namn som `ub_helper_plot`,
`ub_helper_line_erase`, `ub_helper_print_hex` och `ub_helper_music_irq`. Kända
inbäddade data – inklusive `data`-satser, mapptecken-/färgmatriser, sprite- och
teckendefinitioner, sinus-tabellen, laddningsfilnamn, `incbin`-filer, SID-musik
och Koala-nyttolaster – genereras som namngivna `.byte`-regioner. Långa
nolfyllda adressgap använder KickAssemblers `.fill`-direktiv.

Exempelutdrag:

```asm
.label x                 = $02 ; int

* = $080D

ub_start:
    cld                         ; $080D: D8
    ; UB: var x
    lda  #$01                   ; $080E: A9 01
    sta  x                      ; $0810: 85 02
```

Adress-/bytekommentarerna gör det enkelt att jämföra listan med `.prg`. Utdata
använder KickAssembler-syntax (`.label`, `.byte`, `.fill` och `* = origin`) så
att den kan assembleras igen; maskinkodskommentarer påverkar inte resultatet.

`--add` kräver `--d64`. Det kompilerade `.ub`-programmet är alltid den första
filen på disken; varje `--add`-fil läggs till efter den. Filnamn på disken
härleds från källfilens stam, med versaler (t.ex. `music.prg` → `MUSIC`).

Efter en lyckad byggprocess skriver kompilatorn alltid ut en minneskarta:

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

Med `-v` visar utdata dessutom de interna ZP-allokeringarna och en fullständig
hex-dump.

## Kända begränsningar

| Särdrag                               | Begränsning                                                                                                                                                          |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Heltalsaritmetik                      | 8-bitars osignerad (0–255); `word`-variabler innehåller 16-bitarsvärden                                                                                              |
| Subrutiner                            | Ingen rekursion — ZP-parameterplatser allokeras statiskt                                                                                                             |
| Strängvariabler                       | Read-only after init; assignment replaces the pointer, not the data                                                                                                  |
| String concat-körning                 | `s1 + s2` skrivs ut sekventiellt — ingen heapallokering eller längdspårning                                                                                          |
| `rnd()` / `rnd(n)`                    | Enkel LCG, inte kryptografisk; punkt = 256                                                                                                                           |
| `abs()` / `sgn()` / `min()` / `max()` | Endast 8-bitarsvärden; `abs`/`sgn` behandlar värden som signerade (bit 7 = negativ → `abs` tvåkomplement, `sgn` returnerar `$FF`); `min`/`max` är osignerade (0–255) |
| `plot`                                | Pixlar utanför räckvidden klipps tyst bort (Y ≥ 200 eller X ≥ 320 → no-op)                                                                                           |
| `mplot`                               | Ingen gränskontroll — x måste vara 0–159, y måste vara 0–199                                                                                                         |
| `mline` / `mrect`                     | Flerfärgad; x: 0–159, y: 0–199. Pixlar utanför skärmen radbryts (ingen klippning) — håll koordinaterna inom intervallet                                              |
| `mcircle`                             | Flerfärgad; klipp av punkter utanför skärmen (x ≥ 160 eller y ≥ 200 hoppas över)                                                                                     |
| `color pen`                           | Anställer endast; ställer in förgrundsbiten för berörda celler (bakgrunden bevaras). Har ingen effekt i blockläge (`plot4`/`circle4`)                                |
| `rect`                                | Ingen gränskontroll — x: 0–319, y: 0–199; x1≤x2 och y1≤y2 tillämpas inte (degenererade/inverterade rektangulära element producerar odefinierad utdata)               |
| `plot4`                               | Ingen gränskontroll — x måste vara 0–79, y måste vara 0–49 (blockläge)                                                                                               |
| `circle4`                             | Klipp ut blockpixlar utanför skärmen; användbar radie är ungefär 0–49 i 80×50 blockläge                                                                              |
| `chr$`                                | Ingen PETSCII↔ASCII-mappning — n skickas som det är till CHROUT                                                                                                      |
| `music play`                          | Kräver `load sid`; endast en CIA1-omslagsfil genereras (den sista `music play` vinner)                                                                               |
| `graphics on double`                  | Anställer endast; använder `$4000–$7FFF` för backbufferten, så programkoden måste hålla sig under `$4400`; kan inte kombineras med sprites eller multicolor          |
| Felrapportering                       | Endast vid kompilering; `onerr goto` hanterar KERNAL I/O-fel vid körning                                                                                             |
