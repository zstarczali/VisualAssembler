# Ultimate Basic v1.5.6 — Nyelvi kézikönyv

Teljes nyelvi és parancssori felület (CLI) referencia az Ultimate Basichez, egy
BASIC-szerű nyelvhez, amely közvetlenül 6502-es gépi kóddá fordul Commodore
64-hez. Kimenet: `.prg` fájlok (VICE vagy valódi hardver), `.crt` kazettaképek
és `.d64` lemezképek.

A projekt rövid áttekintését és az építési utasításokat lásd a README.md
fájlban.

© 2026 Tarczali Zsolt

> A `ub` fordítóprogram fordítását és a parancssori opciókat a [README.md]{1]
> fájl tárgyalja. Ez a kézikönyv magát az Ultimate Basic nyelvet dokumentálja.

## Nyelvi referencia

### Változók és állandók

**Használat előtt minden változót deklarálni kell a `var` paranccsal.** Nem
deklarált változó használata kifejezésben, értékadásban, `for`/`loop`
számlálóban, `inc`/`dec`, `input` vagy `read` utasításban fordítási idejű hibát
eredményez.

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

A kulcsszavak és azonosítók **nem megkülönböztetik a kis- és nagybetűket**: a
`PRINT`, `Print` és `print` mind érvényes.

| Típus                 | Szélesség     | Megjegyzések                                                  |
| --------------------- | ------------- | ------------------------------------------------------------- |
| `int`                 | 8 bites       | alapértelmezett numerikus literálok esetén                    |
| `word`                | 16 bites      | két ZP bájt; címként használható `poke`/`peek`-ban            |
| `float`               | 16 bites Q8.8 | hi byte = egész rész (0–255), lo byte = tört rész             |
| `string`              | mutató        | ZP pár → null-terminált PETSCII a kódszegmensben              |
| `array(N)`            | N bájt        | bájt elemek; a `$C000+` címen található, nem a ZP-ben         |
| `array_word(N)`       | N×2 bájt      | szóelemek (16 bitesek); `$C000+` címen találhatók, nem ZP-ben |
| `array(R, C, …)`      | ∏dims bájtok  | többdimenziós (sor-szak); index `arr[r, c]`                   |
| `array_word(R, C, …)` | ∏dims×2 bájt  | többdimenziós szótömb (sor-fő)                                |

### Foglalt szavak

A következő azonosítók **kulcsszavak** – nem használhatók változó, konstans,
alprogram, függvény, paraméter vagy címkenévként. Minden egyezés kis- és
nagybetűérzékeny (`END`, `end`, `End` mind ütköznek). Foglalt szó névként való
használata általában zavaró hibát okoz (egy `var` sor csendben nem deklarálódik,
vagy egy olyan kifejezés, mint a `for i = 1 to times`, `Number(0)`-ra hajtódik)
– ezért válasszon másik nevet.

**Deklarációs és vezérlési folyamat** `var`, `const`, `sub`, `fn`, `type`,
`endtype`, `return`, `call`, `label`, `goto`, `gosub`, `if`, `then`, `else`,
`end`, `select`, `case`, `for`, `next`, `loop`, `times`, `to`, `step`, `while`,
`repeat`, `until`, `break`, `continue`, `inc`, `dec`, `bye`, `exit`, `rem`

**Típusok és típussal kapcsolatos** `int`, `word`, `float`, `string`, `array`,
`array_word`

**Nyomtatás és I/O** `print`, `spc`, `tab`, `at`, `input`, `chr$`, `str$`,
`hex`, `bin`, `open`, `close`, `load`, `save`, `data`, `read`, `include`,
`incbin` (szintén `dec` — fentebb csökkentési utasításként szerepel; ugyanazt a
tokent használjuk a `dec(n, width)` nyomtatási formátumhoz)

**Beépített matematikai és karakterlánc-funkciók** `abs`, `min`, `max`, `clamp`,
`sgn`, `mod`, `rnd`, `sin`, `cos`, `and`, `or`, `xor`, `not`, `bnot`, `shl`,
`shr`, `len`, `asc`, `val`, `str_to_int`, `numstr`

**Memória és időzítés** `poke`, `peek`, `poke16`, `peek16`, `fill`, `memcopy`,
`drawmem`, `wait`, `raster`, `delay`, `sys`, `asm`

**Képernyő és szöveg** `cls`, `fast`, `color`, `text`, `border`, `bg`, `screen`,
`cursor`, `lowercase`, `uppercase`, `display`, `on`, `off`, `scroll`, `speed`,
`badlines`, `turbo`

**Bitképes és blokkos grafika** `graphics`, `gcls`, `flip`, `plot`, `plot4`,
`mplot`, `mline`, `mrect`, `mcircle`, `line`, `circle`, `circle4`, `rect`,
`paint`, `erase`, `pen`, `multi`, `block`

**Spritek** `sprite`, `sprdef`, `sprite_frame`, `sprite_x`, `sprite_y`,
`sprhit`, `sprbghit`, `box_hit`, `chardef`, `charset`, `expand`, `priority`

**Hang és zene** `sid`, `sound`, `volume`, `music`, `play`, `pause`, `resume`,
`stop`

**Beviteli eszközök** `getch`, `inkey`, `waitkey`, `joy`, `mouse_x`,
`mouse_x_hi`, `mouse_y`, `mouse_btn`

**Megszakítások és vektorok** `irq`, `irq_exit`, `nmi`, `nmi_exit`, `cia_timer`,
`onerr`

**Karaktertérképek és képek** `map`, `map_tile`, `map_color`, `koala`, `show`,
`hide`

**REU (RAM bővítés)** `reu`, `reudet`, `stash`, `fetch`

**Stílusbeli buktatók – olyan nevek, amelyek *szabadnak* tűnnek, de mégis
visszafogottak**

Ezek az angol szavak ártatlan azonosítóknak tűnnek, de a lexer már lekéri őket.
Nevezd át őket a csendes megszakítás elkerülése érdekében:

| Fenntartott                                 | Javasolt átnevezés                  |
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

A szimbolikus tokenek (`+ - * / = == != < > <= >= : , ; ( ) [ ] # $ % @`)
természetesen nem használhatók azonosítókban.

### Hozzászólások

```basic
# hash comment
rem this is also a comment
var x = 5  # inline comment
var x = 5 : var y = 6  # colon separates statements on one line
```

### Operátorok

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

Összehasonlítások: `==` `!=` `<` `>` `<=` `>=` (visszaadás 1/0)

### Növelés / Csökkentés

```basic
inc x                    # x = x + 1  (INC zp — single instruction)
dec x                    # x = x - 1  (DEC zp — single instruction)
```

For `word` variables carry is handled: `inc` uses `INC lo; BNE skip; INC hi`;
`dec` uses `LDA lo; BNE skip; DEC hi; DEC lo`.

### Összetett hozzárendelések

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

### Nyomtatás

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

### Elágazó

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

A `select expr` egyszer kiértékeli a kifejezést, és sorban összehasonlítja az
egyes `case` értékekkel. Az első egyező esettörzs végrehajtásra kerül, és a
vezérlés a `end` utáni értékre ugrik. Az opcionális `else:` törzs akkor fut le,
ha nincs egyező esettörzs. Minden értéknek 8 bitesnek (0–255) kell lennie.

### Hurokok

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

**Útvonalszabályok `for`/`loop` számára:**

| Case                                                       | Viselkedés                                                                                                                |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `for i = 1 to 10` (alapértelmezett `step +1`, `from ≤ to`) | számol felfelé, standard                                                                                                  |
| `for i = 0 to 20 step 2` (pozitív lépés, `from ≤ to`)      | 2-vel felszámol                                                                                                           |
| `for i = 10 to 1 step -1` (negatív állandó lépésköz)       | visszaszámol; a test i = 10, 9, ..., 1-ig fut                                                                             |
| `for i = 20 to 0 step -2` (nulláig)                        | i = 0-nál ér véget az ADC alulcsordulás (C=0) észlelésével a csökkentés után; nincs végtelen ciklus                       |
| `for i = 10 to 1` (nincs lépés, `from > to`)               | **fordítási idejű hiba**: `for-loop: from (10) > to (1) with default step +1 loops 0 times — use 'step -1' to count down` |

A fordító a kilépési ág kódolását fordítási időben választja ki a `step`
konstans előjele alapján:

- Pozitív lépés (vagy alapértelmezett `+1`) → kilépés, amikor `var > to` (előjel
  nélküli `CMP` + `BCC`/`BEQ` átmenet `JMP exit`-ra).
- Negatív konstans lépés → kilépés, amikor `var < to` (előjel nélküli `CMP` +
  `BCS` a törzshöz), **plusz** egy utólagos inkrementáció `BCS loop_top ; JMP
  exit`, amely elkapja a csomagolást, amikor a `var` 0 alá csökken. Ez a plusz
  utasításpár az, ami miatt a `for i = N to 0 step -k` véges marad.

A nem konstans `step` értékeket (például egy változóból vagy kifejezésből)
fordítási időben pozitívként kezeli a rendszer; ha futásidejű lépésértékkel
rendelkező visszaszámlálásra van szükséged, oszd szét a ciklust, vagy használj
`while` konstrukciót.

### Címkék és ugrás

```basic
label main_loop
  x = x + 1
  if x < 10 then goto main_loop end
```

A `goto` továbbítási mód (a címke később definiálva) teljes mértékben
támogatott.

`gosub label` / `return` ugrás egy címkére és visszalépés (JSR / RTS gépi kód
szinten). A címkének `label name` utasításnak kell lennie, nem `sub` – nincsenek
paraméterei, és ugyanazt a nulla oldalas hatókört használja. A `gosub` támogatja
az előre mutató hivatkozásokat (a címke a `gosub` után van definiálva).

```basic
gosub draw_border
...
label draw_border
  # ... draw something ...
  return               # RTS — returns to the instruction after gosub
```

### Alprogramok

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

A paraméterek átadása dedikált nulla oldalas tárolóhelyeken keresztül történik.
Nincs rekurzió (a tárolóhelyek statikusak). A típusos paraméterek támogatottak:
`sub draw(x, y:int)` vagy `sub copy(src:string)` — a karakterlánc paraméterek
egy 2 bájtos mutatót kapnak, így a hívott fél a `src[i]` segítségével
indexelheti a forrás karakterláncot.

### Függvények (visszatérési értékek)

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

A függvények támogatják az opcionális `: word` visszatérési típust 16 bites
értékek esetén:

```basic
fn get_addr(): word
  return $C000
end

var ptr: word = get_addr()  # ptr = $C000
poke ptr, 42                 # STA (ptr),Y — valid indirect addressing
var v = peek(ptr)            # LDA (ptr),Y
```

A `fn` a 2. lépésben kerül kibocsátásra (ugyanaz, mint a `sub`), így a
függvénytörzsek soha nem futnak le indításkor. Az előre mutató hivatkozások
teljes mértékben támogatottak.

### Tömbök

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

**Többdimenziós tömbök** (újdonság az 1.5.3-as verzióban)

A tömbök több dimenzióval is deklarálhatók. Tárolásuk **sor-fő**, és vesszővel
elválasztott alsó indexű listával vannak indexelve. A teljes méret az összes
dimenzió szorzata.

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

A sor-fő elrendezés azt jelenti, hogy az utolsó alsó index összefüggő: a
`grid[r, c]` a `base + r*COLS + c` címen található. Tetszőleges számú dimenzió
támogatott (`array(a, b, c)`). Ha minden alsó index konstans, a cím fordítási
időben egyetlen abszolút tárolási/betöltési címre hajtódik össze; egy változó
alsó index adja ki a `row*stride + col` számítást és az indexelt `(ptr),Y`
hozzáférést. Egyetlen alsó index hozzáadása egy többdimenziós tömbhöz továbbra
is megengedett, és flat/lineáris indexként kezelendő (`grid[10]`). A
dimenzióknak fordítási idejű állandóknak (literáloknak vagy `const`s-nek) kell
lenniük, és a tömböt indexelés előtt deklarálni kell.

**Struktúratípusok (`type ... endtype`, új az 1.5.4-es verzióban)**

Definiáljon egy fix elrendezésű elnevezett mezőket a `type` értékkel, majd
foglaljon le egy tömböt a példányok közül ugyanúgy, mint egy hagyományos tömböt.
A mezőhozzáférés a `arr[idx].field` értéket használja, és mind konstans, mind
változó indexek esetén működik.

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

Szabályok és korlátozások:

- Mezőtípusok: `int` (1 bájt), `word` (2 bájt LE), `float` (2 bájt Q8.8). A
  `string` és a beágyazott `type` mezők még nem támogatottak.
- Elemméret = a mezőszélességek összege (deklarációs sorrend, kitöltés nélkül).
- A tárhely a `$C000+` címen található a hagyományos tömbök mellett, és a
  memóriatérképen a teljes bájtméretű hagyományos tömbként jelenik meg.
- Konstans index → `LDA/STA absolute` fordítási időben.
- Változó index → eltolással és összeadással szorzás a `idx * elem_size`
  értékhez, majd indexelve a `(ptr),Y` hozzáféréssel. A kettő hatványai (1, 2,
  4, 8, 16) elemméretek csupasz `ASL A` láncokat használnak; más méretek egy
  rövid eltolással és összeadással végrehajtott szekvenciát bocsátanak ki két
  üres nulla oldalas bájton keresztül.
- A struktúratípusok sub / fn paraméterei még nem támogatottak — ehelyett a
  tömböt és egy indexet kell átadni, pl. `sub move(idx: int) ... enemies[idx].x
  = ...`.
- Az alapértelmezett mezőértékeket (`var fire: int = 2` a típuson belül) a
  rendszer elemzi a javaslattal való kompatibilitás érdekében, de az elosztáskor
  még nem inicializálja.
- Csak egy alsó index engedélyezett egy struktúra típusú tömbön; a többdimenziós
  struktúra tömbök nem támogatottak (használjon számított lapos indexet).

Lásd: `examples/type_demo.ub`.

### 16 bites (szó) változók

```basic
var ptr: word = $0400    # two ZP bytes: lo=$00 hi=$04
poke ptr, 6              # STA (ptr),Y
var v = peek(ptr)        # LDA (ptr),Y
```

### Bittérképes grafika

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

Mindkét `graphics on` változat elsötétíti a kijelzőt (`LDA $D011 / AND #$EF /
STA $D011`) a VIC regiszterek váltása közben, majd újra engedélyezi azt a cél
módban – ezzel megelőzve a módváltási hibákat.

Az `x` lehet a teljes `0–319` tartomány. A 255 feletti koordinátákat a rendszer
automatikusan kezeli (a segítő hozzáadja a 9. X bitet), így a `plot`, `line`,
`circle` és `rect` mind eléri a képernyő jobb szélét. Használjon `word`
változót, ha az X koordináta meghaladhatja a 255-öt.

#### Felbérel rajzszínt — `color pen`

Hires módban (320×200) a szín **8×8-as cellánként** van megadva, a
videómátrixban tárolva (magas nibble = előtér, alacsony nibble = háttér), nem
pixelenként. A `color pen c` egy állandó előtérszínt (0-15) állít be, amelyet a
`plot`, `line`, `rect`, `circle` és `paint` minden kirajzolt pixel cellájába
rányom; a cella háttér-nibble színe megmarad. A következő `color pen`-ig marad
érvényben. Az alapértelmezett érték a fehér (1), így azok a programok, amelyek
soha nem hívják meg a `color pen` függvényt, pontosan úgy néznek ki, mint
korábban.

```basic
graphics on
gcls
color pen 2              # red
line 0, 0, 100, 100
color pen 6              # blue
circle 160, 100, 40
display on
```

#### Többszínű alakzatok — `mline` / `mrect` / `mcircle`

Többszínű módban (`graphics on multi`, 160×200) minden pixel négy színforrás
egyikét választja ki egy 2 bites értékkel (`%00` background `$D021`, `%01`
screen hi nibble, `%10` screen lo nibble, `%11` color RAM). A `mplot` egyetlen
ilyen pixelt állít be; a `mline`, `mrect` és `mcircle` ugyanúgy rajzolják az
alakzatokat – a záró `color` argumentum a 2 bites forrás (0-3), a tényleges
színek pedig a cellapalettából (képernyő / szín RAM) származnak, pontosan úgy,
mint a `mplot` esetében.

```basic
graphics on multi
gcls
mcircle 80, 100, 40, 1
mrect 10, 10, 150, 190, 2
mline 0, 0, 159, 199, 3
display on
```

A `mline`/`mrect`/`mcircle` ugyanazokat a Bresenham/középpont rutinokat
használják újra, mint a megfelelőik, minden pixelt `mplot`-on keresztül
ábrázolva; a képernyőn kívüli pontokat (x ≥ 160 vagy y ≥ 200) kihagyják.

### Duplán pufferelt bitkép (villódzásmentes)

```basic
graphics on double       # double-buffered hires bitmap (320×200)
gcls                     # clears the HIDDEN back buffer
line 0, 0, 319, 199      # all drawing (plot/line/circle/rect/paint/gcls) goes to the back buffer
flip                     # show the drawn buffer; redirect drawing to the other one
graphics off             # back to text mode (restores VIC bank 0)
```

A `graphics on double` **két** teljes képkockát tart meg, és csak a kész
képkockákat mutatja, kiküszöbölve a villódzást XOR trükkök nélkül – minden
képkockát `gcls` megrajzolsz, majd `flip`.

| Puffer                    | Bitkép  | Videómátrix | VIC bank | `$DD00` alacsony bitek |
| ------------------------- | ------- | ----------- | -------- | ---------------------- |
| A (elöl, először látható) | `$2000` | `$0400`     | 0. bank  | `%11`                  |
| B (hátul, először húzva)  | `$6000` | `$4400`     | 1. bank  | `%10`                  |

* Minden pixelparancs egy futásidejű **draw base**-en (egy nulla oldalas bájton)
  keresztül ír, így automatikusan azt a puffert célozzák meg, amelyik éppen
  rejtve van.
* A `flip` megvárja az alsó határt (raszter ≥ 251), mielőtt átváltaná a VIC
  bankot, így a csere **szakadásmentes**, majd a rajzolási alapot a most rejtett
  pufferre állítja.
* Tipikus ciklus: `gcls` → keret megrajzolása → `flip`. A `display on` függvényt
  az első `flip` függvény után egyszer hívjuk meg, így az elsőként megjelenített
  puffer már teljes.

**Követelmények / korlátozások:**
* Csak felbérelhetők (nem `multi`). A sprite-ok nem a hátsó puffer VIC bankjából
  kerülnek lekérésre.
* A hátsó puffer `$4000–$7FFF`-t használ (mátrix `$4400`, bitkép `$6000–$7FFF`),
  így a program gépi kódjának `$4400` méret alatt kell maradnia. A legtöbb demó
  csak néhány KB-os, így ez automatikus; a nagyon nagy programok nem
  használhatnak dupla pufferelést.
* Egy gyári 1 MHz-es C64-en a képkockánkénti teljes `gcls` (8 KB) korlátozza a
  képkockasebességet; a Commodore 64 Ultimate-on ez `speed` értékre emelhető a
  gördülékeny, nagy képkockasebességű animáció érdekében.

Lásd: `examples/cube_demo.ub` — egy vibrálásmentesen renderelt, zuhanó 3D-s
drótvázas kocka.

### Blokkgrafikák (80×50)

```basic
graphics on block        # 80×50 block-pixel mode (text mode + custom 4-pixel charset @ $2800)
graphics off             # return to text mode
gcls                     # clear block playfield: screen RAM $0400-$07FF + color RAM $D800-$DBFF

plot4 x, y               # set block pixel at (x, y);  x: 0-79, y: 0-49
plot4 erase x, y         # clear block pixel at (x, y)
circle4 x, y, r          # draw midpoint circle in block pixels; clips to 80×50
```

Egy vaskos, alacsony felbontású mód rétegezve a szabványos 40×25-ös szövegre.
Egy 16 karakteres egyéni karakterkészlet, amelyet a `$2800` mappába másoltak,
karakterenként egy 2×2-es kvadráns rácsot kódol (3. bit=TL, 2. bit=TR, 1.
bit=BL, 0. bit=BR), így minden szövegcella 2×2 blokkpixelt tartalmaz → egy
effektív 80×50-es rácsot. Nem használ bitképes RAM-ot (`$2000-$3FFF` szabadon
marad), így gyorsabb, mint a bitképek bérlése. `plot4` VAGY beilleszti a
kvadráns bitet a cellába, így az átfedő pixelek felhalmozódnak; a `plot4 erase`
törli azt. A `circle4` ugyanazt a blokkpixel segítőt használja egy körvonal
rajzolásához a 80×50-es koordinátatérben. A `gcls` törli a képernyő- és a színes
RAM-ot is. Lásd: `examples/block_demo.ub`.

### Képernyő és szín

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

A `lowercase` futásidőben `LDA #$0E; JSR $FFD2` értéket bocsát ki. A `lowercase`
után fordított karakterlánc literálok kis- és nagybetűiket automatikusan
felcseréli a rendszer — a nagybetűs forráskarakterek a PETSCII kisbetűs
tárolóhelyen (`$61+`), a kisbetűs forráskarakterek pedig a nagybetűs
tárolóhelyen (`$41+`) tárolódnak —, így a `"Hello World"` forrás **Hello World**
formában jelenik meg a képernyőn. A `uppercase` `LDA #$8E; JSR $FFD2` értéket
bocsát ki, és visszatér közvetlen leképezésre. A `cls` **nem** állítja vissza a
karakterkészlet módot.

`scroll x n` `(n AND 7)` karaktereket a `$D016` karakterek 0-2. bitjeibe írja (a
3-7. bitek megőrzése mellett). `scroll x n narrow` a finom görgetési biteket
írja, és törli a `$D016` 3. bitet (38 oszlopos mód). `scroll x n wide` a finom
görgetési biteket írja, és beállítja a `$D016` 3. bitet (40 oszlopos mód).
`scroll y n` a `(n AND 7)` karaktereket a `$D011` karakterek 0-2. bitjeibe írja
(a 3-7. bitek megőrzése mellett). `scroll row R left` egy állandó képernyősort
balra tol el; az új jobb szélső karaktert a `screen 39, R, ch` karakterekkel
írja ki. Hasznos a sima hardveres görgetéshez: minden képkocka csökkentése 7-ről
0-ra, képernyő RAM eltolása, visszaállítás 7-re.

Az `screen col, row, char [, color]` közvetlenül a képernyő RAM-ba (`$0400 +
row*40 + col`) és opcionálisan a szín RAM-ba (`$D800 + row*40 + col`) ír.
Konstans oszlop/sor: a fordítási időben kiszámított cím.

### Ultimate 64 — CPU-sebesség

```basic
speed 4              # set CPU to 4 MHz  (reads $D031, updates bits 0-3, writes back)
speed 48             # 48 MHz  (maximum speed on U64)
speed max            # same as speed 48  (alias)
speed off            # back to 1 MHz  (alias for speed 1)

badlines on          # enable badline timing  ($D031 bit 7 = 0, default C64 behaviour)
badlines off         # disable badline timing ($D031 bit 7 = 1, more CPU cycles)

var t = turbo()      # 1 if turbo is active (bits 0-3 of $D031 != 0), 0 if at 1 MHz
```

Elérhető MHz értékek: `1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 20, 24, 32, 40, 48`.
Az állandó értékeket lefelé kerekíti a rendszer a legközelebbi elérhető
sebességre fordítási időben. A változó értékeket nyers sebességindexként (0–15)
kezeli, és VAGY művelettel a `$D031` 0-3. bitjeire köti.

| $D031 index | MHz (U64) | MHz (U64 Elite-II) |
| ----------- | --------- | ------------------ |
| 0           | 1         | 1                  |
| 3           | 4         | 4                  |
| 6           | 8         | 10                 |
| 11          | 20        | 24                 |
| 15          | 48        | 64                 |

A funkcióhoz az **U64 Turbo Control** beállítást `U64 Turbo Registers` vagy
`Turbo Enable Bit` értékre kell állítani az U64 konfigurációs menüjében. Egy
hagyományos C64-en vagy emulátoron, amely nem tartalmazza a regisztert, a `poke`
és `$D031` közötti értékeket a rendszer csendben figyelmen kívül hagyja.

### Billentyűzet

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

A `mouse_x()` / `mouse_y()` belsőleg futtat egy segítő szubrutint, amely a
következőket kezeli: CIA1 `$DC00` kondenzátor töltése, ~516 ciklusos
késleltetés, SID POT X/Y regiszter olvasása (`$D419`/`$D41A`), előjeles 7 bites
delta számítás, Y tengely `EOR #$FF` inverzió és kumulált pozíciókövetés
(állandó ZP állapot, 8 bájt). A segítő képkockánként kétszer vesz mintát a
POT-ból. A `mouse_y()` **nem** hívja meg a segítőt (csak `mouse_x()` hívja meg)
— csak a gyorsítótárban tárolt `accum_y` adatokat olvassa be a dupla frissítés
elkerülése érdekében.

A segítő egy 9 bites X akkumulátort tart fenn (`accum_x` + `accum_x_hi`
carry/borrow használatával). Használj `var sx: word = mouse_x()` paramétert — a
fordító mind a lo, mind a hi bájtokat tárolja, így a `sprite` parancs helyesen
kezeli a `$D010` értékeket a 255-ön túli X pozíciók esetén.

A segítő a ZP-ben tárolja az állapotát (`$02`–`$09`). Az init jelzőnek nullának
kell lennie az első hívás előtt – nullázd a területet `fill $02, 7, 0` jelzéssel
a programod elején. A CIA1 megszakításokat (`poke $DC0D, $7F`) is tiltsd le,
hogy megakadályozd a KERNAL IRQ hozzáérését a `$DC00` jelzéshez a billentyűzet
letapogatása során – ami zavarná a POT leolvasását.

Lásd a `examples/mouse_demo.ub` oldalon egy működő 1351-es egér demót sprite
követéssel és gomb visszajelzéssel.

### Kijárat

```basic
bye                      # JSR $E544 (clear screen), clear STOP flag, RTS to BASIC
exit                     # alias for bye
```

### Időzítés

```basic
wait 50                  # wait 50 raster-line transitions (~3.2 ms)
wait raster 100          # spin until $D012 == 100 (raster-split effects)
delay 1                  # wait 1 PAL frame (1/50 s ≈ 20 ms)
delay 20                 # wait 20 frames ≈ 0.4 s; n can be a variable (0–255)
```

A `delay N` N teljes PAL képkockát számol meg, a 200-as rasztervonalat használva
képkockahatárként.

### SID hang

```basic
sound 0, $1CAD, 25       # voice 0, freq $1CAD (≈ middle C PAL), 25 frames duration
sound 1, freq_word, 50   # voice 1, freq from word var, 50 frames (1 s at 50 Hz)
sound 2, 0, 0            # voice 2, silence

sid volume 15            # master volume full ($D418 = $0F); range 0-15
sid volume 0             # silence (master volume = 0)
sid stop                 # zero all 25 SID registers ($D400–$D418) — complete silence
```

`sound <channel>, <freq>, <duration>` — időtartam PAL képkockákban (egyenként
1/50 s). Javított ADSR: attack/decay `$09`, sustain/release `$F0`, fűrészfog
hullámforma. A fő hangerő `$D418` mindig `$0F`-ra van állítva.

Az `sid volume N` N-t ír az `$D418`-ba. A 0-3. bitek = hangerő (0-15), a 4-7.
bitek = szűrő mód. Az `sid stop` egy 10 bájtos nulla-kitöltő ciklust bocsát ki –
gyorsabban, mint 25 egyedi piszkálás.

### Zenelejátszás

Az `music play/stop/pause/resume` egy magas szintű alternatívája a manuális `sys
sid_init` / `cia_timer` beállításnak. Előzetes `load sid` utasítást igényel (a
`sid_init` / `sid_play` definiálja).

```basic
load sid "tune.sid"         # embed SID file (defines sid_init / sid_play)

music play                  # initialise sub-tune 0 + start CIA1 50 Hz IRQ
music play 1                # start from sub-tune 1 (song number 0-based)
music stop                  # stop playback + zero all 25 SID registers ($D400-$D418)
music pause                 # disable CIA1 timer A IRQ (music freezes, SID unchanged)
music resume                # re-enable CIA1 timer A IRQ (continues from pause point)
```

| Nyilatkozat      | Hatás                                                                                                             |
| ---------------- | ----------------------------------------------------------------------------------------------------------------- |
| `music play [n]` | hívja a `sid_init(n)` kódot, állítsa be a CIA1 időzítőt A 19 656 ciklusra (~50 Hz PAL), telepítse az IRQ burkolót |
| `music stop`     | CIA1 IRQ letiltása + mind a 25 SID regiszter nullázása                                                            |
| `music pause`    | CIA1 IRQ letiltása (a SID kimenet lefagyva marad)                                                                 |
| `music resume`   | CIA1 IRQ újraengedélyezése (a szüneteltetési ponttól folytatva)                                                   |

Az IRQ burkoló (a program végén egyszer kibocsátott) a következőket teszi: ACK
CIA1 időzítő A → `JSR sid_play` → `JMP $EA81`.

### Sprite-ok

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

Az X a teljes 9 bites tartományt támogatja (0–319): a 255-nél nagyobb futásidejű
értékekhez `word` változót kell használni. Sprite adatmutató: a `data_addr`-nak
64 bájtos igazítottnak kell lennie; `addr >> 6` néven tárolva a `$07F8+id`
címen.

#### Sprite animation with `sprite_frame`

A `sprite_frame` parancs segítségével módosíthatjuk egy sprite megjelenített
képét animáció közben. Ez csak a sprite adatmutatóját változtatja meg; **nem**
mozgatja a sprite-ot, nem engedélyezi azt, és nem lépteti automatikusan a
képkockákat.

Tárold az animációs képeket egymás után, minden 63 bájtos sprite kép egy 64
bájtosra igazított helyet foglaljon el. Add át a nulla alapú animációs képkockát
harmadik argumentumként:

```basic
sprite_frame sprite_azonosító, első_képkocka_címe, képkocka_száma
```

Például, ha az alapcím `$2000`, akkor a 0. képkocka `$2000`, az 1. képkocka
`$2040`, a 2. képkocka `$2080` címet használ, és így tovább. A program vezérli
az animáció időzítését és tördelését:

```basic
var frame = 0
loop
  sprite_frame 0, $2000, frame
  frame = frame + 1
  if frame == 4 then frame = 0 end
  delay 5
end
```

A kétargumentumos űrlap, `sprite_frame id, address`, egyszerűen kiválaszt egy
statikus sprite képet, és visszafelé kompatibilis marad. A sprite pozícióját
továbbra is a `sprite id,x,y` vezérli.

### Szoftveres határolókeret-ütközés

```basic
var touching = box_hit(left1, top1, right1, bottom1,
                       left2, top2, right2, bottom2)
```

A `box_hit()` tengelyhez igazított határolókeret (AABB) tesztet hajt végre, és
`1` értéket ad vissza, ha a két téglalap átfedésben van vagy érinti egymást,
egyébként `0`. A `sprite_hit()` és `sprite_bg_hit()` értékekkel ellentétben ez
nem olvassa vagy törli a VIC-II ütközési regisztereket. A nyolc argumentum
tetszőleges 8 bites kifejezés, így a dobozok kisebbek lehetnek, mint a látható
sprite grafika, vagy nem sprite játékobjektumokat írhatnak le. A koordináták
inkluzívak; a `left <= right` és a `top <= bottom` értékeket tartsa meg.

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

A `sprdef id ... end` 63 sprite bájtot ágyaz be a kódszegmens következő 64
bájtos igazított címére, egy `JMP` címkét helyez föléjük, és automatikusan
beállítja a `$07F8+id = data_addr >> 6` értéket. Ha ugyanazt az alakzatot több
sprite-hoz szeretné használni, olvassa vissza a mutatót:

```basic
var pg = peek($07F8)   # pointer set by sprdef 0
poke $07F9, pg         # copy to sprites 1–7
```

### Karakterlap-térképek (`.ubmap`)

```basic
map load "levels/world.ubmap"
map draw map_x, map_y       # draw a 40x25 viewport to screen/color RAM

var tile = map_tile(x, y)   # read character code from the map
map set x, y, 42            # change character code in writable map data

var shade = map_color(x, y) # read cell color (0 when map has no color data)
map color x, y, 7           # change cell color when color data is present
```

A `map load` függvény a fájlnevet a `.ub` forrásfájlhoz képest oldja fel,
fordítási időben érvényesíti, majd beágyazza a karakter- és opcionális
színtömböket az írható program RAM-ba. Egy későbbi `map load` függvény lecseréli
az aktív map-et a későbbi map parancsokhoz.

A `map load` közvetlenül is elfogad VisualAssembler `me-map` `.bin` exportot:

```basic
térkép betöltése "map-multicolor.bin"
```

Az első 1000 bájtból lesz a 40×25-ös karaktertérkép, a következő 1000 bájt pedig
a cellaszínek. A többszínű mód és a `$D021-$D023` a VisualAssembler
metaadat-előzeteséből olvasható ki, így nincs szükség `.ubmap` konverzióra.

A `map draw map_x, map_y` egy 40×25-ös nézetablakot másol a megadott
térképcellától kezdve a képernyő RAM-ba `$0400`, és ha van ilyen, a színes
RAM-ba `$D800`. A térképnek tartalmaznia kell a teljes kért nézetablakot: tartsa
meg a `map_x <= width-40` és a `map_y <= height-25` értékeket. A koordináták és
a méretek jelenleg 8 bitesek (0–255).

A normál karaktertérképek törlik a szöveg többszínű bitjét a `$D016` zónában. A
többszínű térképek beállítják ezt, és betöltik a három globális színüket a
`$D021`, `$D022` és `$D023` zónákba. A karaktertérképek karakterkódokat
tartalmaznak, nem karakterkészlet pixeleket; kombinálhatók `charset`/`chardef`
vagy más karakterkészlet-betöltési módszerrel. Többszínű szöveg módban a 8–15.
cellaszínek a VIC-II szabályok szerint választják ki a többszínű karaktereket.

#### UBMP 1. verziójú bináris formátum

Minden többbájtos egész szám kis-endiánus:

|   Eltolás |                Méret | Jelentés                                                        |
| --------: | -------------------: | --------------------------------------------------------------- |
|         0 |                    4 | ASCII varázslat `UBMP`                                          |
|         4 |                    1 | Verzió, jelenleg `1`                                            |
|         5 |                    1 | Jelzők: 0. bit = színmező jelen, 1. bit = többszínű szövegmód   |
|         6 |                    2 | Térkép szélessége, 1–255 cella                                  |
|         8 |                    2 | Térkép magassága, 1–255 cella                                   |
|        10 |                    1 | 0. háttér (`$D021`), alacsony rágcsálnivalót használtak         |
|        11 |                    1 | Többszínű 1 (`$D022`), kevés rágcsálnivalót használt            |
|        12 |                    1 | Többszínű 2 (`$D023`), alacsony rágcsálnivalóval                |
|        13 | szélesség × magasság | Sor-fő karakterkódok                                            |
| következő | szélesség × magasság | Opcionális sor-fő szín nibbles, ha a 0. jelzőbit be van állítva |

Egy UBMP fájlnak pontosan a fejlécében megadott hosszúsággal kell rendelkeznie.
Az érvénytelen mágikus érték, verzió, dimenzió vagy hossz fordítási idejű hibát
okoz.

### Koala Painter képimportálás

```basic
koala load "pictures/title.kla"  # validate and embed at compile time
koala show                       # enter bitmap multicolor mode
koala hide                       # return to the default text display
```

A `koala load` elfogad egy szabványos 10003 bájtos Koala fájlt (`$6000`
betöltési cím plusz 10001 adatbájt), vagy egy nyers 10001 bájtos hasznos adatot.
Az elérési utak a `.ub` fájlhoz képest relatívak. A hasznos adat 8000 bitkép
bájtot, 1000 képernyőbájtot, 1000 színrészletet és egy háttérszín bájtot
tartalmaz.

A fordító a `$6000-$8710` címen tárolja. A `koala show` a bitképet a `$2000`
címre, a képernyőmátrixot a `$0400` címre, a színeket a `$D800` címre másolja,
és engedélyezi a bitkép többszínű módot. A `koala hide` törli a bitkép/többszínű
módot, és visszaállítja az alapértelmezett szövegelrendezést.

A generált kódnak és a segítőknek `$2000` alatt kell befejeződniük, mert a
megjelenített bitkép felülírja a `$2000-$3F3F` értéket; ellenkező esetben a
fordító hibát jelez. A Koala importálás jelenleg nem kombinálható a `load sid`
értékkel ugyanabban a programban.

### Egyéni karakterkészlet

```basic
charset $3800            # set base address for chardef (default $3800)

chardef 65               # redefine character 65 ('A')
  $18,$3C,$66,$7E,$66,$66,$66,$00
end

chardef 66               # fewer than 8 bytes are zero-padded
  $7C,$66,$7C,$66,$7C
end
```

A `charset base` beállítás az összes további `chardef` utasítás által használt
célcímet állítja be. A `chardef id ... end` beágyaz 8 bájtot a kódszegmensbe
(ezt egy `JMP` előzi meg a kihagyásukhoz), majd futásidőben átmásolja őket a
`charset_base + id*8` címre. Az értékeknek fordítási idejű állandóknak kell
lenniük; bináris literálokhoz (`%00011000`) `%` használható.

Egyéni karakterkészlet aktiválásához a VIC-II-ben, állítsd be a
karaktergenerátor címét a `$D018` címen keresztül:
```basic
charset $3800
chardef 1  $FF,$81,$81,$81,$81,$81,$81,$FF  end  # box border
poke $D018, $1A     # screen at $0400, charset at $3800 (bank 0)
```

### Memória

```basic
poke $D020, 2            # STA $D020
poke addr_var, 6         # STA (addr_var),Y  — if addr_var is word type
var v = peek($D012)      # LDA $D012
var v = peek(addr_var)   # LDA (addr_var),Y  — if addr_var is word type

var w: word = peek16($C000)   # read 16-bit little-endian: lo=$C000, hi=$C001
poke16 $0314, $EA81           # write 16-bit little-endian: lo→$0314, hi→$0315
poke16 ptr, w                 # word var as address; word var as value
```

A `peek16(addr)` két egymást követő bájtot (lo, hi) `word`-ként olvas be. A
`poke16` először a "lo", majd a "hi" karaktereket írja.

### Lemez I/O

```basic
load "PROGRAM"           # KERNAL LOAD: loads file from device 8 to its native address
load "DATA", $C000       # loads file to a specific address
load "DATA", ptr         # addr from word variable

save "DATA", $C000, 4096 # KERNAL SAVE from $C000, 4096 bytes → device 8
save "PROG", start, len  # addr and len from word/int variables
```

Az `load` meghívja a KERNAL-t: `SETNAM`+`SETLFS`+`LOAD`
(`$FFBD`/`$FFBA`/`$FFD5`). Cím nélkül: másodlagos cím: 0 (a fájl saját 2 bájtos
fejléce betöltési címként használatos). Címmel: másodlagos cím: 1 (a fájl a
megadott helyre töltődik be). Az `save` meghívja a `SETNAM`+`SETLFS`+`SAVE`
(`$FFBD`/`$FFBA`/`$FFD8`). Mind a `addr`, mind a `len` címet megköveteli.

### SID Zene

```basic
load sid "tune.sid"            # embed SID music at its native load address
load sid "tune.sid", $2000     # override: embed at $2000 regardless of SID header
```

A `load sid` **fordítási időben** beolvassa a PSID vagy RSID fájlt, eltávolítja
a fejlécet, és hozzáfűzi a nyers zenei bájtokat a kimenethez. `.prg`. A `load
sid` után két fordítási idejű állandó válik elérhetővé:

| Állandó    | Leírás                                                                     |
| ---------- | -------------------------------------------------------------------------- |
| `sid_init` | Init rutin cím — egyszeri hívás A = dalszámmal (0-alapú)                   |
| `sid_play` | Rutincím lejátszása — minden keret meghívása (50 Hz PAL) egy IRQ kezelőből |

Mindkét konstans bárhol működik, ahol konstans címet fogadnak el: `sys`, `irq`,
`poke`, kifejezések.

**Tipikus használat:**

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

**Megjegyzések:**
- A SID adatok a generált kód **után** kerülnek elhelyezésre, nullákkal
  kiegészítve a betöltési címig. A fordító figyelmeztet, ha a SID betöltési címe
  átfedésben lenne a generált kóddal.
- A PSID v1 és v2 támogatott. Ha a SID fejléc betöltési címe 0, akkor az első
  két adatbájtot használja címként (PRG stílusú, little-endian).
- Programonként csak egy `load sid` értelmes (az utolsó nyer).

### Soros csatorna fájl I/O

```basic
open 1, 8, 2, "MYFILE"  # open logical file 1, device 8, secondary 2, name "MYFILE"
open 2, 4, 7             # open printer (device 4), no filename
open ch, dev, sec        # channel, device, secondary from variables

print# 1, "HELLO"        # send "HELLO"+CR to logical file 1
print# ch, x, "text"     # any mix of vars, strings — same as print but to file

close 1                  # close logical file 1
close ch                 # channel from variable
```

A `open` meghívja a `SETNAM` ($FFBD) + `SETLFS` ($FFBA) + `OPEN` ($FFC0)
függvényt. Fájlnév nélkül a SETNAM 0 hosszúsággal kerül meghívásra. A `print#`
kimenete a `CHKOUT` ($FFC9), karakterenként CHROUT (+ záró CR), majd a `CLRCHN`
($FFCC) parancson keresztül kerül továbbításra. A `close` beilleszti a
csatornaszámot az A-ba és meghívja a `CLOSE` ($FFC3) függvényt.

### Input

```basic
input score              # read up to 3 digits from keyboard → 8-bit int var
input "Name: ", name     # optional prompt string, then read line → string var
input "Score: ", score   # prompt + int input
```

Az `input` KERNAL BASIN-t (`$FFCF`) használja a blokkoláshoz, visszhangos
vonalbemenetet biztosít DEL támogatással.
- **Int var**: csak `0`–`9` értékeket fogad el, maximum 3 karaktert; CR esetén 8
  bites értékké konvertál.
- **Karakterlánc-változó**: maximum 30 karaktert fogad el; nullával lezárt
  karakterláncként tárolódik; a ZP pár frissül.

### Úszópont / Fixpont

Az `float` változók Q8.8 fixpontos formátumot használnak: a felső bájt az egész
rész (0–255), az alsó bájt pedig a tört rész (0/256 … 255/256).

```basic
var f: float = 3.5       # 3.5 → hi=3, lo=128 (= 0x0380)
var g: float = 0         # integer 0 is promoted to 0.0 automatically

f = 1.5                  # Q8.8 literal assignment
f = f + 1.5              # 16-bit Q8.8 arithmetic (result: 3.0)
f = f + g                # float + float

var n = int(f)           # extract integer part (hi byte) → 8-bit int
print f                  # prints as "N.DD" (e.g. 3.5 → "3.50", 1.25 → "1.25")
```

| Művelet                | Példa                | Megjegyzések                                    |
| ---------------------- | -------------------- | ----------------------------------------------- |
| Szó szerinti           | `3.5`, `0.25`, `1.0` | fordítási időben Q8.8-ként értelmezve           |
| Egész szám előléptetés | `f = 5`              | 5.0-ás üzletek (magas=5, alacsony=0)            |
| Hozzáadás/felirat      | `f + 1.5`, `f - g`   | 16 bites Q8.8 aritmetikai                       |
| Int kinyerése          | `int(f)`             | a hi byte-ot 8 bites egész számként adja vissza |
| Nyomtatás              | `print f`            | "N.DD" formátum, mindig 2 tört számjegy         |

**Figyelmeztetés:** A számtani túlcsordulás 255,255-nél tördelődik (nincs
telítés). Két lebegőpontos változó szorzása és osztása még nem támogatott –
ezekben az esetekben a `int()` + egész aritmetikai műveletet kell használni.

### Matematikai függvények

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

### Sztringfüggvények

```basic
var n = len(msg)         # length of null-terminated string var (0–255)
var c = asc(msg)         # PETSCII code of first character (0 if empty)
var c = asc("A")         # compile-time: constant PETSCII code
var n = val(s)           # runtime: parse decimal PETSCII string → 8-bit int (e.g. "042" → 42)
var c = msg[i]           # string character at index i: PETSCII code of msg[i]
msg[i] = c               # write PETSCII byte c to string at index i — STA (ptr),Y
msg[0] = 72              # constant index → LDY #0; STA (ptr),Y
```

### Számformázás

```basic
print hex(n)             # print as 2-digit uppercase hex
print bin(n)             # print as 8-bit binary string
print dec(n, 4)          # right-justified decimal in a field of 4 chars (e.g. 42 → "  42")
print dec(n, width)      # width can also be a variable
```

A `dec(n, width)` a bal oldali számot szóközökkel tölti ki a `width` karakterek
kitöltéséhez. Ha a szám több számjegyből áll, mint a `width`, akkor kitöltés
nélkül (csonkolás nélkül) kerül kinyomtatásra. Nem nyomtatási környezetben a
`dec(n, w)` a `n` értéket változatlanul adja (ugyanaz, mint a `hex`/`bin`).

### REU (RAM bővítőegység)

```basic
var ok = reu_present()   # 1 if REU detected, 0 if not (write/read test on $DF04)
var ok = reudet()        # alias for reu_present()

reu stash c64addr, bank, reu_addr, len  # copy C64 → REU
reu fetch c64addr, bank, reu_addr, len  # copy REU → C64
reu swap  c64addr, bank, reu_addr, len  # swap between C64 and REU
```

Az `reu_present()` írási/visszaolvasási tesztet hajt végre a `$DF04` REU
regiszteren. REU nélkül az írás elvész (nyitott busz), így a visszaolvasás
eltérő – megbízhatóan érzékeli a jelenlétet anélkül, hogy bármilyen mellékhatást
okozó parancsregisztert érintene.

| Paraméter  | Szélesség | Megjegyzések                                                       |
| ---------- | --------- | ------------------------------------------------------------------ |
| `c64addr`  | 16 bites  | C64 RAM indítása — konstans, `word` változó vagy 8 bites kifejezés |
| `bank`     | 8 bites   | REU bankszám (0–7 egy 512 KB-os egységhez)                         |
| `reu_addr` | 16 bites  | REU bankon belüli elszámolás                                       |
| `len`      | 16 bites  | Átvinni kívánt bájtok (`0` = 65 536 REU hardverben)                |

REU regiszterek: `$DF01` parancs (`$B0` stash / `$B1` fetch / `$B2` swap),
`$DF02–$DF03` C64 cím, `$DF04–$DF05` REU eltolás, `$DF06` bank, `$DF07–$DF08`
hossz. Az átvitel szinkron (a CPU leáll DMA közben). Valódi REU vagy VICE
szükséges: **Beállítások → Hardver → RAM bővítőmodul**.

### Memória segédprogramok

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

A `fill` és a `memcopy` is támogatja a 16 bites hosszúságokat (0–65535). 255-nél
nagyobb hosszúságok esetén `word` változókat használjon.

A `drawmem src, dst, width, height, stride` egy kétdimenziós téglalap alakú
blokkot másol. A `src` lineárisan olvasható (csomagolt sorok); a `dst` `stride`
bájttal lép előre a sorok között — a C64 képernyőhöz vagy színes RAM-hoz (40
oszlop) a `40` (28 dollár) használható. A szélesség, magasság és lépésszám mind
8 bites értékek. A `src` és a `dst` lehetnek konstansok, `word` változók vagy 8
bites kifejezések.

### Raszteres IRQ

```basic
irq my_handler           # raster IRQ at line 0, handler = sub name or address
irq my_handler, 100      # raster IRQ at raster line 100
irq $C800, 200           # handler at fixed address
irq addr_word            # handler address from a word variable
```

Beállít egy raszteres IRQ-t a BASIC szoftveres vektoron (`$0314`/`$0315`)
keresztül: letiltja a CIA1 időzítő IRQ-ját, nyugtázza a VIC IRQ-t függőben,
raszteres sort ír a `$D012` címre, engedélyezi a VIC raszteres IRQ-t
(`$D01A=$01`), kiírja a kezelő címét, és újra engedélyezi a megszakításokat.

A kezelőnek **kell** `sys $EA81`-ra végződnie (KERNAL IRQ vége) — a sima `RTS`
vagy `RTI` sérti a verem tartalmát. Először nyugtázd a VIC IRQ-t:

```basic
sub my_handler()
  poke $D019, $FF      # ACK VIC IRQ
  # ... work here ...
  sys $EA81            # JMP to KERNAL end-of-IRQ
end
```

Az előrehivatkozások támogatottak (`irq my_handler` az aldefiniálás előtt).

### NMI-kezelő

```basic
nmi my_nmi               # set NMI vector $0318/$0319 to handler sub or address

sub my_nmi()
  # ... NMI work here ...
  nmi_exit               # JMP $FE47 — proper NMI exit (restores A/X/Y + RTI)
end
```

A `nmi handler` a kezelő címét az NMI soft vektorba írja (`$0318`/`$0319`). A
`$FFFA` helyen található hardveres NMI vektor a KERNAL NMI rutinra mutat, amely
a `$0318` címen keresztül ágazik el. A kezelőnek **kell** végződnie
`nmi_exit`-ra (`JMP $FE47` címet bocsát ki) — a sima `RTI` használata a verem
sérüléséhez vezet. Előrehivatkozások támogatottak.

### CIA1 időzítő megszakítás

```basic
cia_timer 19656, my_handler   # CIA1 timer A: fires every 19656 cycles (~50 Hz PAL)
cia_timer period, handler      # period can be a variable or expression
```

Beállítja a CIA1 időzítőt A periodikus IRQ forrásként a BASIC szoftveres
vektoron (`$0314`/`$0315`) keresztül:
1. SEI – megszakítások letiltása
2. `$DC0D = $7F` — minden CIA1 IRQ letiltása
3. Load 16-bit period lo→`$DC04`, hi→`$DC05`
4. Írd be a kezelő címét `$0314`/`$0315` ide
5. `$DC0D = $81` — CIA1 időzítő A IRQ engedélyezése
6. `$DC0E = $01` — Az A időzítő indítása folyamatos üzemmódban
7. CLI – megszakítások újraengedélyezése

A kezelőnek `irq_exit` (vagy `sys $EA81`) végződésűnek kell lennie, és
nyugtáznia kell a CIA1 IRQ-t:

```basic
sub my_handler()
  poke $DC0D, $01      # ACK CIA1 timer A IRQ (read also clears it)
  # ... work here ...
  irq_exit             # JMP $EA81: restore A/X/Y + RTI
end
```

PAL időzítés: órajel = 985 248 Hz. Periódusidő 50 Hz-nél = 985 248 / 50 = 19 705
ciklus ≈ `$4CC9`. Előremeneti referenciák támogatottak.

### Hibakezelés

```basic
onerr goto err_handler   # set KERNAL I/O error vector ($0300/$0301) to a label

...

label err_handler
  print "I/O ERROR"
  bye
```

A `onerr goto label` a címkét (lo, hi) a KERNAL `$0300` és `$0301` helyekre
írja. Amikor KERNAL I/O hiba történik (pl. sikertelen `load` vagy `open`), a
KERNAL végrehajtja a `JMP ($0300)` parancsot, amely a címkére ágazik. Az előre
mutató hivatkozások (a `onerr goto` után definiált címke) támogatottak.

### Fordítási idejű fájlbeágyazás

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

Az összes `data` értéket fordítási időben gyűjti össze a rendszer. A program
indításakor automatikusan lefoglal és inicializál egy 2 bájtos ZP mutatót.
Minden `read` lépéssel előrébb viszi a mutatót.

### Soros összeszerelés

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

**Címzési módok:**

| Szintaxis         | Mód            | Bájtok | Példa                     |
| ----------------- | -------------- | ------ | ------------------------- |
| (nincs operandus) | Hallgatólagos  | 1      | `NOP`, `RTS`              |
| `A`               | Akkumulátor    | 1      | `ASL A`, `LSR`            |
| `#value`          | Azonnali       | 2      | `LDA #$07`                |
| `$zz` (0–255)     | Nulla oldal    | 2      | `LDA $50`                 |
| `$zz,X`           | ZP,X           | 2      | `LDA $50,X`               |
| `$zz,Y`           | ZP,Y           | 2      | `LDX $50,Y`               |
| `$xxxx`           | Abszolút       | 3      | `LDA $0400`               |
| `$xxxx,X`         | Abszolút,X     | 3      | `LDA $0400,X`             |
| `$xxxx,Y`         | Abszolút,Y     | 3      | `LDA $0400,Y`             |
| `($xxxx)`         | Közvetett      | 3      | `JMP ($FFFC)`             |
| `($zz,X)`         | (Közvetett, X) | 2      | `LDA ($50,X)`             |
| `($zz),Y`         | (Közvetett),Y  | 2      | `LDA ($50),Y`             |
| `label`           | Relatív        | 2      | `BNE label` (csak fiókok) |

- Az `$zz` (1–2 hexadecimális számjegy, érték ≤ 255) a nulladik oldalas
  formátumot választja, ha az utasítás támogatja; egyébként automatikusan
  abszolútra frissül. Az `$00xx` (4 számjegy) használatával kényszerítheti ki az
  abszolút formátumot.
- Az elágazási operandusok abszolút címek; a relatív bájt eltolást a rendszer
  automatikusan számítja ki.
- A lokális címkék (`name:`) hatóköre a `asm { }` blokkra korlátozódik. Az előre
  irányuló ágak a 2. menetben oldódtak fel.
- A `#<label` / `#>label` értékek a címke címének lo / hi bájtját adják.
- A `*` visszaadja az aktuális utasításcímet, így a `JMP *` önálló ciklusként
  állítódik össze.
- A `$`, `%` karakterekkel vagy számjeggyel kezdődő sorok nyers bájtként
  kerülnek kibocsátásra (visszafelé kompatibilis).
- A `asm { }` karaktereken belül a megjegyzések `;` vagy `//` karakterekkel
  végződnek a sor végéig. Az (`#` a közvetlen előtag, nem megjegyzés.)

**A `asm { }` keverése alprogramparaméterekkel**

A paraméternevek **nem érhetők el** a `asm { }` blokkokon belül. Az
UltimateBasic utasításokkal az értékeket a `asm { }` blokk előtti ismert
helyekre helyezheti át:

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

Az olyan rutinok esetében, amelyeknek teljes törzse assembly – különösen az IRQ
kezelők esetében, amelyeknek kereszthivatkozásokat kell tartalmazniuk egymásra
–, az összes kezelőt helyezd el **egyetlen legfelső szintű `asm { }` blokkba** a
főprogramban. Az azonos blokkban lévő címkék megosztják a hatókört, így a `irq1`
és a `irq2` szabadon hivatkozhatnak egymásra. Lásd:
`examples/raster_irq_demo.ub`.

### Karakterlánc ↔ egész szám

```basic
numstr score, $0340      # writes "042\0" at $0340 (always 3 digits, zero-padded)
var n = str_to_int("42") # compile-time: Expr::Number(42)

print str$(score)                # print 8-bit int as 3-digit decimal string ("000"–"255")
print "Score: " + str$(score)   # usable in string concat print context
var s: string = str$(n)          # assign str$() result to a string var (shared static buffer)
```

A `str$(n)` egy 8 bites értéket 3 karakteres decimális karakterlánccá alakít
(mindig 3 számjegy vezető nullákkal, pl. `5` → `"005"`, `42` → `"042"`, `255` →
`"255"`), amelyet egy null terminátor követ. Az eredménymutatót egy állandó ZP
párban tárolja a rendszer, amelyet fordítási időben foglalnak le.

> **Megjegyzés:** A `str$(n)` egyetlen megosztott 4 bájtos statikus puffert
> használ. A `str$(n)` ismételt meghívása felülírja az előző eredményt. Több
> érték egyidejű megjelenítéséhez a `numstr` használatával külön abszolút
> címekre kell írni.

## Példák

| Fájl                                | Leírás                                                                                     |
| ----------------------------------- | ------------------------------------------------------------------------------------------ |
| `examples/features.ub`              | konstans, címke/goto, piszkálás/bukás, rnd, matematikai függvények                         |
| `examples/new_features.ub`          | alparaméterek, tömbök, szóváltozók, karakterláncváltozók                                   |
| `examples/bitmap_demo.ub`           | 320×200 bitkép, plot, grafika be/ki                                                        |
| `examples/block_demo.ub`            | 80×50 blokkgrafika, plot4, circle4, grafika blokkon                                        |
| `examples/joystick_demo.ub`         | joystick olvasás, sprite mozgás                                                            |
| `examples/mux_demo.ub`              | raszteres sprite multiplexer (3 ablak × 8 sprite = 24)                                     |
| `examples/orbit_demo.ub`            | 24 sprite pálya pulzáló sugárral és véletlenszerű színekkel                                |
| `examples/plasma_demo.ub`           | plazmahatású bitkép raszteres sávszegély animációval                                       |
| `examples/sprite_data.ub`           | sprdef alakzatadatok (más demókban is megtalálhatók)                                       |
| `examples/sprite_mux_orbit.ub`      | 24 sprite-os pálya demó sprdef-fel + előre kiszámított pozíciókkal                         |
| `examples/sprite_orbit_demo.ub`     | 8 hardveres sprite körpályán sin/cos táblázat segítségével                                 |
| `examples/reu_bitmap_demo.ub`       | REU stash/fetch bitmap grafikával                                                          |
| `examples/sid_music_demo.ub`        | SID zenelejátszó raszteres IRQ-val és billentyűzetkilépéssel                               |
| `examples/tenprint.ub`              | 5 TENPRINT labirintus implementáció menüvel; demók `lowercase` karakterkészlet módban      |
| `examples/countdown_demo.ub`        | Visszaszámlálás `for..next` negatív lépésekkel, beleértve a `for i = 20 to 0 step -2`-t is |
| `examples/countdown_errors_demo.ub` | Fordítási idejű hiba az alapértelmezett lépéshez `from > to`                               |
| `examples/explicit_demo.ub`         | `--explicit` CLI-flag bemutató teljesen begépelt `var`, `sub`, `fn` szövegekkel            |
| `examples/explicit_errors_demo.ub`  | Laza kód, ami `--explicit` nélkül épül fel, hibákat okoz                                   |

## CLI-referencia

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

### CRT export

Az Ultimate Basic képes Magic Desk 19-es típusú kazettaképet is írni, ha a
kimeneti fájlnév `.crt`-ra végződik:

```bash
ub build demo.ub -o demo.crt
```

A fordítóprogram a generált PRG-t egy tárolt CRT konténerbe csomagolja, ugyanazt
az elrendezést használva, mint a VisualAssembler CRT exportja: egy 64 bájtos
kazettafejléc, egy 8×8K-s Magic Desk kép és egy boot betöltő a 0. bankban, amely
a PRG hasznos adatát a C64 RAM-ba másolja, mielőtt a program belépési pontjára
ugrik. A `.prg` és `.d64` elérési utak továbbra is a korábbiakhoz hasonlóan
működnek.

### Explicit típusú mód

Adja meg a `--explicit` parancsot, hogy minden deklarációs webhelyen `:type`
annotáció szerepeljen:

```bash
ub build game.ub --explicit
```

A jelző nélkül az Ultimate Basic elfogadja mind a `var x = 5` típust (az
inicializálóból kikövetkeztetett vagy alapértelmezés szerint `int` típusút),
mind a `var x: int = 5` típust. A jelzővel csak az annotált forma fordul le – a
laza forma fordítási idejű hibává válik.

**Amit érvényesít:**

| Nyilatkozati űrlap                                   | `--explicit` nélkül               | `--explicit`-val                   |
| ---------------------------------------------------- | --------------------------------- | ---------------------------------- |
| `var name = expr` (nem `:type`)                      | ok — típus kikövetkeztetett       | hiba                               |
| `var name: int = expr` (vagy szó/float/karakterlánc) | Rendben                           | Rendben                            |
| `var arr = array(N)`                                 | oké — implicit módon `array`      | rendben – változatlan              |
| `var arr = array_word(N)`                            | oké — implicit módon `array_word` | rendben – változatlan              |
| `const NAME = value`                                 | Rendben                           | rendben – változatlan              |
| `sub foo(a, b)` (beíratlan paraméterek)              | Rendben                           | hiba típus nélküli paraméterenként |
| `sub foo(a: int, b: int)`                            | Rendben                           | Rendben                            |
| `fn foo(a): int` (beíratlan paraméter)               | Rendben                           | hiba a paraméterben                |
| `fn foo(a: int): int`                                | Rendben                           | Rendben                            |

A konstansok és a tömbdeklarációk mindig elfogadottak – típusukat a deklarációs
űrlap rögzíti, így a `:type` redundáns lenne.

**Példa hibaüzenetre:**

```
$ ub build myprog.ub --explicit
Compilation errors:
  line 14: 'explicit' mode: 'var loose' has no type — use 'var loose: int|word|float|string'
  line 16: 'explicit' mode: parameter 'a' has no type — use 'a: int|word|float|string'
```

A jelző egy építési időben változó kapcsoló – a forrásban semminek sem kell
megváltoznia a be- vagy kikapcsoláshoz. Add hozzá a Makefile / build
szkriptedhez, hogy a típusos stílust a projekt egészére érvényesítsd, vagy hagyd
el a felfedező szkripteknél. Lásd: `examples/explicit_demo.ub` és
`examples/explicit_errors_demo.ub`.

### Hibakeresési fájlok

A `--debug` használatával hibakereső szimbólumokat generálhat a programmal
együtt:

```bash
ub build demo.ub --debug
```

A fordítóprogram a fájlokat a `.prg` mellé írja, a kimeneti fájl törzsét
használva:

| Fájl       | Formátum és cél                                                                                              |
| ---------- | ------------------------------------------------------------------------------------------------------------ |
| `demo.sym` | KickAssembler-kompatibilis szimbólumforrás, amely alkalmas assembler forráskódba importálásra                |
| `demo.dbg` | C64Debugger/RetroDebugger KickAssembler hibakeresési dump, amely tartalmazza a program szegmensét és címkéit |
| `demo.vs`  | VICE monitor parancsfájl, amely `al` parancsokat tartalmaz a címcímkékhez                                    |

Mindhárom exportálás tartalmazza a `program_start`, `program_end` értékeket,
változókat, tömböket, alprogramokat és a kódgenerálás után ismert BASIC
címkéket. Például a VICE szimbólumokat a `-moncommands demo.vs` parancssori
opcióval vagy a monitor `ll "demo.vs"` parancsával töltheti be.

A jelenlegi `.dbg` export szegmens- és címszimbólum-információkat biztosít. Még
nem tartalmazza az utasítás-forrásvonal leképezéseket a forrásszintű lépésekhez.

### Assembly kódgeneráló lista (újdonság az 1.5.2-es verzióban)

A `--asm` karakterlánccal írjon olvasható 6502-es forráslistát a PRG mellé:

```bash
ub build demo.ub --asm
```

For an output named `demo.prg`, this creates `demo.asm`. The listing is produced
from metadata collected while Ultimate Basic generates the machine code; it is
not merely a disassembly of the completed PRG. It contains:

- `; UB:` megjegyzések, amelyek az egyes kibocsátó UB utasítások generált
  bájttartományát jelölik;
- névvel ellátott konstansok a nulladik oldalas változókhoz és a `$C000+`
  tömbökhöz, beleértve azok típusát/méretét is;
- az alprogramok és a BASIC címkék végső nevei és címei;
- `loc_xxxx` címkéket generált a relatív ágakhoz és a programon belüli
  `JMP`/`JSR` célpontokhoz;
- normál 6502 mnemonikok és operandusok, ahol ismertek, fordítói szimbólumokkal
  helyettesítve;
- a pontos C64 cím és a kibocsátott bájtok száma minden utasítás mellett;
- a fordító által generált segítők és a beágyazott kód végső
  memóriasorrendjükben;
- `.byte` kimenet azokhoz a bájtokhoz, amelyeket nem a támogatott 6502-es
  utasítások szerint dekódolnak.

A fordítási segédprogramok leíró neveket kapnak, például `ub_helper_plot`,
`ub_helper_line_erase`, `ub_helper_print_hex` és `ub_helper_music_irq`. Az
ismert beágyazott adatok – beleértve a `data` utasításokat, a leképezési
karakter/szín tömböket, a sprite- és karakterdefiníciókat, a szinusztáblázatot,
a betöltési fájlneveket, a `incbin` fájlokat, a SID zenét és a Koala hasznos
adatokat – elnevezett `.byte` régiókként kerülnek kibocsátásra. A hosszú,
nullákkal kiegészített címhézagok a KickAssembler `.fill` direktíváját
használják.

Példa részlet:

```asm
.label x                 = $02 ; int

* = $080D

ub_start:
    cld                         ; $080D: D8
    ; UB: var x
    lda  #$01                   ; $080E: A9 01
    sta  x                      ; $0810: 85 02
```

A cím/bájt megjegyzések megkönnyítik a lista összehasonlítását a `.prg`
listával. A kimenet a KickAssembler szintaxist használja (`.label`, `.byte`,
`.fill` és `* = origin`), így újra összeállítható; a gépi kódú megjegyzések nem
befolyásolják az eredményt.

A `--add` használatához `--d64` szükséges. A lefordított `.ub` program mindig az
első fájl a lemezen; minden `--add` fájl utána fűződik hozzá. A lemezen lévő
fájlnevek a forrásfájl nevéből származnak, nagybetűvel írva (pl. `music.prg` →
`MUSIC`).

Sikeres fordítás után a fordító mindig kinyomtat egy memóriatérképet:

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

A `-v` beállítással a kimenet ezen felül mutatja a belső ZP-foglalásokat és egy
teljes hexadecimális kiírást.

## Ismert korlátozások

| Jellemző                              | Korlátozás                                                                                                                                                                             |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Egész számtani                        | 8 bites előjel nélküli (0–255); a `word` változók 16 bites értékeket tárolnak                                                                                                          |
| Alprogramok                           | Nincs rekurzió — A ZP paraméterhelyek statikusan vannak lefoglalva                                                                                                                     |
| Karakterlánc-változók                 | Read-only after init; assignment replaces the pointer, not the data                                                                                                                    |
| Karakterlánc-összefűzés futásideje    | `s1 + s2` szekvenciálisan nyomtat — nincs halomfoglalás vagy hosszkövetés                                                                                                              |
| `rnd()` / `rnd(n)`                    | Egyszerű LCG, nem kriptográfiai; periódus = 256                                                                                                                                        |
| `abs()` / `sgn()` / `min()` / `max()` | csak 8 bites értékek; `abs`/`sgn` az értékeket előjelesként kezeli (7. bit = negatív → `abs` kettes komplementer, `sgn` `$FF` értéket ad vissza); `min`/`max` előjel nélküliek (0–255) |
| `plot`                                | A tartományon kívüli pixeleket hangtalanul levágja a rendszer (Y ≥ 200 vagy X ≥ 320 → nincs művelet)                                                                                   |
| `mplot`                               | Nincs határérték-ellenőrzés — x-nek 0–159, y-nak 0–199 között kell lennie                                                                                                              |
| `mline` / `mrect`                     | Többszínű; x: 0–159, y: 0–199. Képernyőn kívüli pixelek tördelése (nincs vágás) – a koordináták a tartományon belül maradnak                                                           |
| `mcircle`                             | Többszínű; képernyőn kívüli pontokat vág (x ≥ 160 vagy y ≥ 200 kihagyva)                                                                                                               |
| `color pen`                           | Csak felvételek; beállítja az érintett cellák előtérbeli részét (a háttér megmarad). Blokk módban nincs hatása (`plot4`/`circle4`)                                                     |
| `rect`                                | Nincs határérték-ellenőrzés — x: 0–319, y: 0–199; x1≤x2 és y1≤y2 nincsenek kikényszerítve (a degenerált/invertált egyenesek nem definiált kimenetet eredményeznek)                     |
| `plot4`                               | Nincs határérték-ellenőrzés — x értékének 0–79, y értékének 0–49 között kell lennie (blokk mód)                                                                                        |
| `circle4`                             | Kivágja a képernyőn kívüli blokkképpontokat; a hasznos sugár nagyjából 0–49 80×50-es blokk módban.                                                                                     |
| `chr$`                                | Nincs PETSCII↔ASCII leképezés — az n értékét változatlanul adja át a CHROUT-nak                                                                                                        |
| `music play`                          | `load sid` szükséges; csak egy CIA1 wrapper kerül kibocsátásra (az utolsó `music play` nyer)                                                                                           |
| `graphics on double`                  | Csak bérelt példányok; `$4000–$7FFF` karaktereket használ a hátsó pufferhez, így a programkódnak `$4400` alatt kell maradnia; nem kombinálható sprite-okkal vagy többszínűvel          |
| Hibajelentés                          | Csak fordítási időben; a `onerr goto` futási időben kezeli a KERNAL I/O hibákat                                                                                                        |
