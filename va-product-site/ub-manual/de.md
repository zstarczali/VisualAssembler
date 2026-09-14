# Ultimate Basic v1.5.6 — Sprachhandbuch

Vollständige Sprach- und CLI-Referenz für Ultimate Basic, eine BASIC-ähnliche
Sprache, die direkt in 6502-Maschinencode für den Commodore 64 kompiliert wird.
Ausgabe: `.prg` Dateien (VICE oder reale Hardware), `.crt` Cartridge-Images und
`.d64` Disk-Images.

Eine kurze Projektübersicht und Bauanleitung finden Sie in der Datei README.md.

© 2026 Zsolt Tarczali

> Die Erstellung des `ub`-Compilers und die Kommandozeilenoptionen werden in
> [README.md](README.md) beschrieben. Dieses Handbuch dokumentiert die
> Programmiersprache Ultimate Basic selbst.

## Sprachreferenz

### Variablen und Konstanten

**Alle Variablen müssen vor ihrer Verwendung mit `var` deklariert werden.** Die
Verwendung einer nicht deklarierten Variable in einem Ausdruck, einer Zuweisung,
einem Zähler (`for`/`loop`), einer Anweisung (`inc`/`dec`), einer Anweisung
(`input`) oder einer Anweisung (`read`) führt zu einem Kompilierfehler.

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

Bei Schlüsselwörtern und Kennungen wird **nicht zwischen Groß- und
Kleinschreibung unterschieden**: `PRINT`, `Print` und `print` sind alle gültig.

| Typ                   | Breite        | Anmerkungen                                                       |
| --------------------- | ------------- | ----------------------------------------------------------------- |
| `int`                 | 8-Bit         | Standardwert für numerische Literale                              |
| `word`                | 16-Bit        | zwei ZP-Bytes; kann als Adresse in `poke`/`peek` verwendet werden |
| `float`               | 16-Bit Q8.8   | hi-Byte = ganzzahliger Anteil (0–255), lo-Byte = Bruchteil        |
| `string`              | Zeiger        | ZP-Paar → nullterminiertes PETSCII im Codesegment                 |
| `array(N)`            | N Bytes       | Byte-Elemente; befindet sich unter `$C000+`, nicht in ZP          |
| `array_word(N)`       | N×2 Bytes     | Wortelemente (16 Bit); befindet sich unter `$C000+`, nicht in ZP  |
| `array(R, C, …)`      | ∏dims Bytes   | mehrdimensional (zeilenweise); Index `arr[r, c]`                  |
| `array_word(R, C, …)` | ∏dims×2 Bytes | mehrdimensionales Wortarray (zeilenweise)                         |

### Reservierte Wörter

Die folgenden Bezeichner sind **Schlüsselwörter** – sie dürfen nicht als
Variablen-, Konstanten-, Unterprogramm-, Funktions-, Parameter- oder Labelnamen
verwendet werden. Bei der Suche wird nicht zwischen Groß- und Kleinschreibung
unterschieden (`END`, `end`, `End` führen zu einem Konflikt). Die Verwendung
eines reservierten Wortes als Name führt in der Regel zu einem irreführenden
Fehler (eine Zeile mit `var` kann beispielsweise nicht deklariert werden, oder
ein Ausdruck wie `for i = 1 to times` wird zu `Number(0)` zusammengefasst) –
wählen Sie daher einen anderen Namen.

**Deklaration & Kontrollfluss** `var`, `const`, `sub`, `fn`, `type`, `endtype`,
`return`, `call`, `label`, `goto`, `gosub`, `if`, `then`, `else`, `end`,
`select`, `case`, `for`, `next`, `loop`, `times`, `to`, `step`, `while`,
`repeat`, `until`, `break`, `continue`, `inc`, `dec`, `bye`, `exit`, `rem`

**Typen & typbezogene Daten** `int`, `word`, `float`, `string`, `array`,
`array_word`

**Drucken & Ein-/Ausgabe** `print`, `spc`, `tab`, `at`, `input`, `chr$`, `str$`,
`hex`, `bin`, `open`, `close`, `load`, `save`, `data`, `read`, `include`,
`incbin` (auch `dec` — oben als Dekrementierungsanweisung aufgeführt; dasselbe
Token wird für das Druckformat `dec(n, width)` verwendet)

**Mathematik- und String-Funktionen** `abs`, `min`, `max`, `clamp`, `sgn`,
`mod`, `rnd`, `sin`, `cos`, `and`, `or`, `xor`, `not`, `bnot`, `shl`, `shr`,
`len`, `asc`, `val`, `str_to_int`, `numstr`

**Speicher & Zeitmessung** `poke`, `peek`, `poke16`, `peek16`, `fill`,
`memcopy`, `drawmem`, `wait`, `raster`, `delay`, `sys`, `asm`

**Bildschirm & Text** `cls`, `fast`, `color`, `text`, `border`, `bg`, `screen`,
`cursor`, `lowercase`, `uppercase`, `display`, `on`, `off`, `scroll`, `speed`,
`badlines`, `turbo`

**Bitmap- und Blockgrafiken** `graphics`, `gcls`, `flip`, `plot`, `plot4`,
`mplot`, `mline`, `mrect`, `mcircle`, `line`, `circle`, `circle4`, `rect`,
`paint`, `erase`, `pen`, `multi`, `block`

**Sprites** `sprite`, `sprdef`, `sprite_frame`, `sprite_x`, `sprite_y`,
`sprhit`, `sprbghit`, `box_hit`, `chardef`, `charset`, `expand`, `priority`

**Ton & Musik** `sid`, `sound`, `volume`, `music`, `play`, `pause`, `resume`,
`stop`

**Eingabegeräte** `getch`, `inkey`, `waitkey`, `joy`, `mouse_x`, `mouse_x_hi`,
`mouse_y`, `mouse_btn`

**Interrupts & Vektoren** `irq`, `irq_exit`, `nmi`, `nmi_exit`, `cia_timer`,
`onerr`

**Zeichentabellen & Bilder** `map`, `map_tile`, `map_color`, `koala`, `show`,
`hide`

**REU (RAM-Erweiterung)** `reu`, `reudet`, `stash`, `fetch`

**Stilfallen – Namen, die *frei* aussehen, aber reserviert sind**

Diese gebräuchlichen englischen Wörter sehen aus wie harmlose Bezeichner, werden
aber bereits vom Lexer erfasst. Benennen Sie sie um, um stillschweigende
Datentrennungen zu vermeiden:

| Reserviert                                  | Vorschlag zur Umbenennung           |
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

Symbolische Token (`+ - * / = == != < > <= >= : , ; ( ) [ ] # $ % @`) sind
naturgemäß nicht in Bezeichnern verwendbar.

### Kommentare

```basic
# hash comment
rem this is also a comment
var x = 5  # inline comment
var x = 5 : var y = 6  # colon separates statements on one line
```

### Betreiber

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

Vergleiche: `==` `!=` `<` `>` `<=` `>=` (Rückgabewert 1/0)

### Inkrementieren / Verringern

```basic
inc x                    # x = x + 1  (INC zp — single instruction)
dec x                    # x = x - 1  (DEC zp — single instruction)
```

For `word` variables carry is handled: `inc` uses `INC lo; BNE skip; INC hi`;
`dec` uses `LDA lo; BNE skip; DEC hi; DEC lo`.

### Verbindungszuordnungen

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

### Drucken

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

### Verzweigung

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

`select expr` wertet den Ausdruck einmal aus und vergleicht ihn der Reihe nach
mit jedem `case`-Wert. Der erste passende Fallblock wird ausgeführt, und die
Programmausführung springt zu `end`. Der optionale `else:`-Block wird
ausgeführt, falls kein passender Fall gefunden wird. Alle Werte müssen 8-Bit
(0–255) sein.

### Schleifen

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

**Richtungsregeln für `for`/`loop`:**

| Case                                                      | Verhalten                                                                                                                      |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `for i = 1 to 10` (Standardwert `step +1`, `from ≤ to`)   | zählt hoch, Standard                                                                                                           |
| `for i = 0 to 20 step 2` (positiver Schritt, `from ≤ to`) | Zählt um 2 erhöht                                                                                                              |
| `for i = 10 to 1 step -1` (negativer konstanter Schritt)  | zählt herunter; Körper läuft für i = 10, 9, ..., 1                                                                             |
| `for i = 20 to 0 step -2` (bis auf Null herunter)         | Die Schleife wird bei i = 0 beendet, indem nach der Dekrementierung ein ADC-Unterlauf (C=0) erkannt wird; keine Endlosschleife |
| `for i = 10 to 1` (kein Schritt, `from > to`)             | **Kompilierfehler**: `for-loop: from (10) > to (1) with default step +1 loops 0 times — use 'step -1' to count down`           |

Der Compiler wählt die Exit-Branch-Codierung zur Kompilierzeit anhand des
Vorzeichens einer Konstanten `step`:

- Positiver Schritt (oder Standardwert `+1`) → Abbruch bei `var > to` (unsigned
  `CMP` + `BCC`/`BEQ` Fall-Through zu `JMP exit`).
- Negativer konstanter Schritt → Abbruch bei `var < to` (unsigned `CMP` + `BCS`
  zum Rumpf), **plus** ein Postinkrement `BCS loop_top ; JMP exit`, das den
  Überlauf abfängt, wenn `var` unter 0 fällt. Dieses zusätzliche Befehlspaar
  sorgt dafür, dass `for i = N to 0 step -k` endlich bleibt.

Nicht-konstante `step` Werte (z. B. aus einer Variablen oder einem Ausdruck)
werden zur Kompilierzeit als positiv behandelt; wenn Sie einen Countdown mit
einem Laufzeitschrittwert benötigen, teilen Sie die Schleife auf oder verwenden
Sie eine `while` Konstruktion.

### Labels und gehe zu

```basic
label main_loop
  x = x + 1
  if x < 10 then goto main_loop end
```

Forward `goto` (Label wird später definiert) wird vollständig unterstützt.

`gosub label` / `return` springen zu einer Marke und kehren zurück (JSR/RTS auf
Maschinencode-Ebene). Die Marke muss eine `label name` Anweisung sein, keine
`sub` – sie hat keine Parameter und teilt denselben Gültigkeitsbereich (Seite
null). `gosub` unterstützt Vorwärtsreferenzen (Marke definiert nach `gosub`).

```basic
gosub draw_border
...
label draw_border
  # ... draw something ...
  return               # RTS — returns to the instruction after gosub
```

### Unterprogramme

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

Parameter werden über dedizierte Nullseiten-Slots übergeben. Keine Rekursion
(Slots sind statisch). Typisierte Parameter werden unterstützt: `sub draw(x,
y:int)` oder `sub copy(src:string)` – Zeichenkettenparameter erhalten einen
2-Byte-Zeiger, sodass der Aufgerufene die Quellzeichenkette über `src[i]`
indizieren kann.

### Funktionen (Rückgabewerte)

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

Funktionen unterstützen optional den Rückgabetyp `: word` für 16-Bit-Werte:

```basic
fn get_addr(): word
  return $C000
end

var ptr: word = get_addr()  # ptr = $C000
poke ptr, 42                 # STA (ptr),Y — valid indirect addressing
var v = peek(ptr)            # LDA (ptr),Y
```

`fn` wird im zweiten Durchlauf ausgegeben (genau wie `sub`), daher werden
Funktionsrümpfe beim Start nie ausgeführt. Vorwärtsreferenzen werden vollständig
unterstützt.

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

**Mehrdimensionale Arrays** (neu in Version 1.5.3)

**Arrays können mehrdimensional sein. Sie werden zeilenweise gespeichert und mit
einer durch Kommas getrennten Indexliste indiziert. Die Gesamtgröße entspricht
dem Produkt aller Dimensionen.**

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

Zeilenweise Speicherung bedeutet, dass der letzte Index zusammenhängend ist:
`grid[r, c]` befindet sich an der Position `base + r*COLS + c`. Beliebig viele
Dimensionen werden unterstützt (`array(a, b, c)`). Wenn alle Indizes konstant
sind, wird die Adresse zur Kompilierzeit auf einen einzigen absoluten
Speicher-/Ladevorgang reduziert; ein variabler Index führt zur Berechnung
`row*stride + col` und einem indizierten Zugriff `(ptr),Y`. Ein einzelner Index
in einem mehrdimensionalen Array ist weiterhin zulässig und wird als
flacher/linearer Index behandelt (`grid[10]`). Die Dimensionen müssen
Kompilierzeitkonstanten (Literale oder `const`s) sein, und das Array muss vor
dem Zugriff deklariert werden.

**Strukturtypen (`type ... endtype`, neu in Version 1.5.4)**

Definieren Sie ein festes Layout benannter Felder mit `type` und allokieren Sie
anschließend ein Array von Instanzen analog zu einem regulären Array. Der
Feldzugriff erfolgt über `arr[idx].field` und funktioniert sowohl für konstante
als auch für variable Indizes.

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

Regeln und Einschränkungen:

- Feldtypen: `int` (1 Byte), `word` (2 Byte LE), `float` (2 Byte Q8.8). `string`
  und verschachtelte `type` Felder werden noch nicht unterstützt.
- Elementgröße = Summe der Feldbreiten (Deklarationsreihenfolge, ohne
  Auffüllung).
- Der Speicher befindet sich unter `$C000+` zusammen mit regulären Arrays und
  wird in der Speicherabbildung als gewöhnliches Array mit der Gesamtbytegröße
  angezeigt.
- Konstanter Index → `LDA/STA absolute` zur Kompilierzeit.
- Variabler Index → Shift-and-Add-Multiplikation für `idx * elem_size`, dann
  indizierter Zugriff auf `(ptr),Y`. Elementgrößen, die Zweierpotenzen sind (1,
  2, 4, 8, 16), verwenden einfache `ASL A`-Ketten; andere Größen erzeugen eine
  kurze Shift-Add-Sequenz über zwei temporäre Null-Bytes.
- Sub-/fn-Parameter vom Typ struct werden noch nicht unterstützt – übergeben Sie
  stattdessen das Array und einen Index, z. B. `sub move(idx: int) ...
  enemies[idx].x = ...`.
- Standardfeldwerte (`var fire: int = 2` innerhalb des Typs) werden zur
  Kompatibilität mit dem Vorschlag analysiert, sind aber zum Zeitpunkt der
  Zuweisung noch nicht initialisiert.
- Bei einem Array vom Typ struct ist nur ein Index zulässig; mehrdimensionale
  struct-Arrays werden nicht unterstützt (verwenden Sie einen berechneten
  flachen Index).

Siehe `examples/type_demo.ub`.

### 16-Bit-(Wort-)Variablen

```basic
var ptr: word = $0400    # two ZP bytes: lo=$00 hi=$04
poke ptr, 6              # STA (ptr),Y
var v = peek(ptr)        # LDA (ptr),Y
```

### Bitmap-Grafiken

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

Beide `graphics on` Varianten schalten das Display (`LDA $D011 / AND #$EF / STA
$D011`) beim Umschalten der VIC-Register aus und aktivieren es dann im Zielmodus
wieder – dies verhindert Störungen beim Moduswechsel.

`x` kann den gesamten Bereich `0–319` umfassen. Koordinaten über 255 werden
automatisch verarbeitet (die Hilfsfunktion fügt das 9. Bit der X-Koordinate
hinzu), sodass `plot`, `line`, `circle` und `rect` alle den rechten
Bildschirmrand erreichen. Verwenden Sie eine Variable `word`, wenn eine
X-Koordinate 255 überschreiten kann.

#### Hochauflösende Farbzeichnung — `color pen`

Im hochauflösenden Modus (320×200) wird die Farbe **pro 8×8-Zelle** in der
Videomatrix gespeichert (hohes Nibble = Vordergrund, niedriges Nibble =
Hintergrund), nicht pro Pixel. `color pen c` legt eine dauerhafte
Vordergrundfarbe (0–15) fest, die von `plot`, `line`, `rect`, `circle` und
`paint` in die Zelle jedes gezeichneten Pixels eingeprägt wird; das
Hintergrund-Nibble der Zelle bleibt erhalten. Die Änderung bleibt bis zum
nächsten Aufruf von `color pen` wirksam. Der Standardwert ist Weiß (1), sodass
Programme, die `color pen` nie aufrufen, unverändert aussehen.

```basic
graphics on
gcls
color pen 2              # red
line 0, 0, 100, 100
color pen 6              # blue
circle 160, 100, 40
display on
```

#### Mehrfarbige Formen — `mline` / `mrect` / `mcircle`

Im Mehrfarbenmodus (`graphics on multi`, 160×200) wählt jedes Pixel eine von
vier Farbquellen über einen 2-Bit-Wert aus (`%00` Hintergrund, `$D021`, `%01`
Bildschirm-Hi-Nibble, `%10` Bildschirm-Lo-Nibble, `%11` Farb-RAM). `mplot` legt
ein einzelnes solches Pixel fest; `mline`, `mrect` und `mcircle` zeichnen Formen
auf die gleiche Weise – das nachfolgende `color` ist die 2-Bit-Quelle (0-3), und
die tatsächlichen Farben stammen genau wie bei `mplot` aus der Zellpalette
(Bildschirm/Farb-RAM).

```basic
graphics on multi
gcls
mcircle 80, 100, 40, 1
mrect 10, 10, 150, 190, 2
mline 0, 0, 159, 199, 3
display on
```

`mline`/`mrect`/`mcircle` verwenden die gleichen Bresenham-/Mittelpunkt-Routinen
wie ihre hochauflösenden Gegenstücke und zeichnen jedes Pixel bis `mplot`;
Punkte außerhalb des Bildschirms (x ≥ 160 oder y ≥ 200) werden übersprungen.

### Doppelt gepufferte Bitmap (flimmerfrei)

```basic
graphics on double       # double-buffered hires bitmap (320×200)
gcls                     # clears the HIDDEN back buffer
line 0, 0, 319, 199      # all drawing (plot/line/circle/rect/paint/gcls) goes to the back buffer
flip                     # show the drawn buffer; redirect drawing to the other one
graphics off             # back to text mode (restores VIC bank 0)
```

`graphics on double` speichert **zwei** vollständige hochauflösende Bitmaps und
zeigt nur fertige Frames an, wodurch Flimmern ohne XOR-Tricks vermieden wird –
jedes Frame wird gezeichnet, dann `gcls`, und anschließend `flip`.

| Puffer                          | Bitmap  | Videomatrix | VIC Bank | `$DD00` niedrige Bits |
| ------------------------------- | ------- | ----------- | -------- | --------------------- |
| A (Vorderseite, zuerst gezeigt) | `$2000` | `$0400`     | Bank 0   | `%11`                 |
| B (hinten, zuerst gezeichnet)   | `$6000` | `$4400`     | Bank 1   | `%10`                 |

* **Alle Pixelbefehle schreiben über eine Laufzeit-Zeichenbasis (ein
  Nullseitenbyte), sodass sie automatisch auf den jeweils aktuell ausgeblendeten
  Puffer abzielen.**
* `flip` wartet auf die untere Grenze (Raster ≥ 251), bevor die VIC-Bank
  umgeschaltet wird, damit der Tausch **unterbrechungsfrei** erfolgt, und
  richtet dann die Zeichenbasis auf den nun ausgeblendeten Puffer.
* Typischer Ablauf: `gcls` → Frame zeichnen → `flip`. Rufe `display on` einmal
  nach dem ersten `flip` auf, damit der erste angezeigte Puffer bereits
  vollständig ist.

**Anforderungen / Grenzen:**
* Nur hochauflösende Grafiken (nicht `multi`). Sprites werden nicht aus dem
  VIC-Speicher des Backbuffers geladen.
* Der Backbuffer verwendet `$4000–$7FFF` (Matrix `$4400`, Bitmap `$6000–$7FFF`),
  daher muss der Maschinencode des Programms unterhalb von `$4400` bleiben. Die
  meisten Demos sind nur wenige KB groß, daher geschieht dies automatisch; sehr
  große Programme können keine doppelte Pufferung verwenden.
* Auf einem Standard-1-MHz-C64 begrenzt die volle `gcls`-Zahl pro Frame (8 KB)
  die Bildrate; auf dem Commodore 64 Ultimate erhöht man die `speed`-Zahl für
  flüssige Animationen mit hoher Bildrate.

Siehe `examples/cube_demo.ub` — ein taumelnder 3D-Drahtgitterwürfel, der
flimmerfrei gerendert wurde.

### Blockgrafik (80×50)

```basic
graphics on block        # 80×50 block-pixel mode (text mode + custom 4-pixel charset @ $2800)
graphics off             # return to text mode
gcls                     # clear block playfield: screen RAM $0400-$07FF + color RAM $D800-$DBFF

plot4 x, y               # set block pixel at (x, y);  x: 0-79, y: 0-49
plot4 erase x, y         # clear block pixel at (x, y)
circle4 x, y, r          # draw midpoint circle in block pixels; clips to 80×50
```

Ein grober, niedrigauflösender Modus, der auf Standardtext (40×25) gelegt wird.
Ein benutzerdefinierter Zeichensatz mit 16 Zeichen, der in `$2800` kopiert
wurde, kodiert ein 2×2-Quadrantenraster pro Zeichen (Bit 3 = TL, Bit 2 = TR, Bit
1 = BL, Bit 0 = BR), sodass jede Textzelle 2×2 Blockpixel enthält – ein
effektives 80×50-Raster. Es wird kein Bitmap-RAM verwendet (`$2000-$3FFF` bleibt
frei), wodurch die Darstellung schneller als bei hochauflösenden Bitmaps ist.
`plot4` verknüpft das Quadrantenbit per ODER mit der Zelle, sodass sich
überlappende Pixel ansammeln; `plot4 erase` löscht es. `circle4` verwendet
denselben Blockpixel-Helfer, um einen Umrisskreis im 80×50-Koordinatenraum zu
zeichnen. `gcls` löscht sowohl den Bildschirm- als auch den Farb-RAM. Siehe
`examples/block_demo.ub`.

### Bildschirm und Farbe

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

`lowercase` erzeugt zur Laufzeit `LDA #$0E; JSR $FFD2`. Bei
Zeichenkettenliteralen, die nach `lowercase` kompiliert werden, wird die
Groß-/Kleinschreibung automatisch vertauscht: Großbuchstaben werden im
PETSCII-Kleinbuchstaben-Slot (`$61+`) und Kleinbuchstaben im Großbuchstaben-Slot
(`$41+`) gespeichert. Daher wird `"Hello World"` als **Hello World** angezeigt.
`uppercase` erzeugt `LDA #$8E; JSR $FFD2` und stellt die direkte Zuordnung
wieder her. `cls` setzt den Zeichensatzmodus **nicht** zurück.

`scroll x n` schreibt `(n AND 7)` in die Bits 0-2 von `$D016` (Bits 3-7 bleiben
erhalten). `scroll x n narrow` schreibt die Feinscroll-Bits und löscht Bit 3 von
`$D016` (38-Spalten-Modus). `scroll x n wide` schreibt die Feinscroll-Bits und
setzt Bit 3 von `$D016` (40-Spalten-Modus). `scroll y n` schreibt `(n AND 7)` in
die Bits 0-2 von `$D011` (Bits 3-7 bleiben erhalten). `scroll row R left`
verschiebt eine konstante Bildschirmzeile nach links; das neue rechteste Zeichen
wird mit `screen 39, R, ch` geschrieben. Nützlich für flüssiges
Hardware-Scrollen: In jedem Frame von 7 auf 0 dekrementieren, Bildschirm-RAM
verschieben, auf 7 zurücksetzen.

`screen col, row, char [, color]` schreibt direkt in den Bildschirmspeicher
(`$0400 + row*40 + col`) und optional in den Farbspeicher (`$D800 + row*40 +
col`). Konstante Spalte/Zeile: Adresse wird zur Kompilierzeit berechnet.

### Ultimate 64 — CPU-Geschwindigkeit

```basic
speed 4              # set CPU to 4 MHz  (reads $D031, updates bits 0-3, writes back)
speed 48             # 48 MHz  (maximum speed on U64)
speed max            # same as speed 48  (alias)
speed off            # back to 1 MHz  (alias for speed 1)

badlines on          # enable badline timing  ($D031 bit 7 = 0, default C64 behaviour)
badlines off         # disable badline timing ($D031 bit 7 = 1, more CPU cycles)

var t = turbo()      # 1 if turbo is active (bits 0-3 of $D031 != 0), 0 if at 1 MHz
```

Verfügbare MHz-Werte: `1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 20, 24, 32, 40, 48`.
Konstante Werte werden zur Kompilierzeit auf die nächstniedrigere verfügbare
Geschwindigkeit abgerundet. Variable Werte werden als Rohgeschwindigkeitsindex
(0–15) behandelt und mit den Bits 0–3 von `$D031` verknüpft.

| $D031 index | MHz (U64) | MHz (U64 Elite-II) |
| ----------- | --------- | ------------------ |
| 0           | 1         | 1                  |
| 3           | 4         | 4                  |
| 6           | 8         | 10                 |
| 11          | 20        | 24                 |
| 15          | 48        | 64                 |

Erfordert, dass **U64 Turbo Control** im U64-Konfigurationsmenü auf `U64 Turbo
Registers` oder `Turbo Enable Bit` eingestellt ist. Auf einem regulären C64 oder
Emulator ohne dieses Register werden die Werte `poke` bis `$D031`
stillschweigend ignoriert.

### Tastatur

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

`mouse_x()` / `mouse_y()` führen intern eine Hilfsroutine aus, die Folgendes
übernimmt: Laden des CIA1-Kondensators `$DC00`, Verzögerung von ca. 516 Zyklen,
Lesen des SID-POT-X/Y-Registers (`$D419`/`$D41A`), Berechnung des 7-Bit-Deltas
mit Vorzeichen, Invertierung der Y-Achse `EOR #$FF` und Positionsverfolgung
(permanenter ZP-Zustand, 8 Bytes). Die Hilfsroutine tastet POT zweimal pro Frame
ab. `mouse_y()` ruft die Hilfsroutine **nicht** auf (nur `mouse_x()` tut dies) –
sie liest lediglich den zwischengespeicherten Wert von `accum_y`, um doppelte
Aktualisierungen zu vermeiden.

Der Helfer verwaltet einen 9-Bit-X-Akkumulator (`accum_x` + `accum_x_hi` mit
Übertrag/Borrow). Verwenden Sie `var sx: word = mouse_x()` – der Compiler
speichert sowohl das niedrigste als auch das höchste Byte, sodass der Befehl
`sprite` `$D010` für X-Positionen jenseits von 255 korrekt verarbeitet.

Der Helfer speichert seinen Zustand in ZP (`$02`–`$09`). Das
Initialisierungsflag muss vor dem ersten Aufruf auf Null gesetzt werden – setzen
Sie den Bereich mit `fill $02, 7, 0` frühzeitig in Ihrem Programm auf Null.
Deaktivieren Sie außerdem die CIA1-Interrupts (`poke $DC0D, $7F`), um zu
verhindern, dass der Kernel-IRQ während des Tastaturscans auf `$DC00` zugreift –
dies stört das Auslesen des Potentiometers.

Unter `examples/mouse_demo.ub` finden Sie eine funktionierende Demo der
1351-Maus mit Sprite-Tracking und Tastenrückmeldung.

### Ausfahrt

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

`delay N` zählt N vollständige PAL-Frames, wobei die Rasterzeile 200 als
Framegrenze dient.

### SID Sound

```basic
sound 0, $1CAD, 25       # voice 0, freq $1CAD (≈ middle C PAL), 25 frames duration
sound 1, freq_word, 50   # voice 1, freq from word var, 50 frames (1 s at 50 Hz)
sound 2, 0, 0            # voice 2, silence

sid volume 15            # master volume full ($D418 = $0F); range 0-15
sid volume 0             # silence (master volume = 0)
sid stop                 # zero all 25 SID registers ($D400–$D418) — complete silence
```

`sound <channel>, <freq>, <duration>` – Dauer in PAL-Frames (je 1/50 s). Feste
ADSR-Kurve: Attack/Decay `$09`, Sustain/Release `$F0`, Sägezahnwellenform.
Master-Lautstärke `$D418` immer auf `$0F` eingestellt.

`sid volume N` schreibt N nach `$D418`. Bits 0-3 = Lautstärke (0-15), Bits 4-7 =
Filtermodus. `sid stop` sendet eine 10-Byte-Nullfüllschleife – schneller als 25
einzelne Eingaben.

### Musikwiedergabe

`music play/stop/pause/resume` ist eine alternative, höherwertige Lösung zur
manuellen Einrichtung von `sys sid_init` / `cia_timer`. Sie erfordert eine
vorherige Anweisung `load sid` (definiert `sid_init` / `sid_play`).

```basic
load sid "tune.sid"         # embed SID file (defines sid_init / sid_play)

music play                  # initialise sub-tune 0 + start CIA1 50 Hz IRQ
music play 1                # start from sub-tune 1 (song number 0-based)
music stop                  # stop playback + zero all 25 SID registers ($D400-$D418)
music pause                 # disable CIA1 timer A IRQ (music freezes, SID unchanged)
music resume                # re-enable CIA1 timer A IRQ (continues from pause point)
```

| Stellungnahme    | Wirkung                                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------------------------------ |
| `music play [n]` | Rufe `sid_init(n)` auf, konfiguriere den CIA1-Timer A auf 19 656 Zyklen (~50 Hz PAL), installiere den IRQ-Wrapper. |
| `music stop`     | CIA1-IRQ deaktivieren + alle 25 SID-Register auf Null setzen                                                       |
| `music pause`    | CIA1-IRQ deaktivieren (SID-Ausgabe bleibt eingefroren)                                                             |
| `music resume`   | CIA1 IRQ wieder aktivieren (Fortsetzung vom Pausenpunkt)                                                           |

Der IRQ-Wrapper (wird einmalig am Ende des Programms ausgegeben) macht: ACK CIA1
Timer A → `JSR sid_play` → `JMP $EA81`.

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

X unterstützt den vollen 9-Bit-Bereich (0–319): Verwenden Sie eine
`word`-Variable für Laufzeitwerte > 255. Sprite-Datenzeiger: `data_addr` muss
64-Byte-ausgerichtet sein; gespeichert als `addr >> 6` an der Adresse
`$07F8+id`.

#### Sprite animation with `sprite_frame`

Der Befehl `sprite_frame` dient dazu, das angezeigte Bild eines Sprites während
einer Animation zu ändern. Er ändert lediglich den Datenzeiger des Sprites; er
bewegt den Sprite **nicht**, aktiviert ihn nicht und führt auch nicht
automatisch zu neuen Frames.

Speichern Sie die Animationsbilder nacheinander, wobei jedes 63 Byte große
Sprite-Bild einen 64 Byte großen, ausgerichteten Speicherplatz belegt. Übergeben
Sie den nullbasierten Animationsframe als drittes Argument:

```basic
sprite_frame sprite_id, first_frame_address, frame_number
```

Bei einer Basisadresse von beispielsweise `$2000` verwendet Frame 0 die Adresse
`$2000`, Frame 1 die Adresse `$2040`, Frame 2 die Adresse `$2080` usw. Das
Programm steuert das Timing und den Zeilenumbruch der Animation.

```basic
var frame = 0
loop
  sprite_frame 0, $2000, frame
  frame = frame + 1
  if frame == 4 then frame = 0 end
  delay 5
end
```

Die Form mit zwei Argumenten, `sprite_frame id, address`, wählt einfach ein
statisches Sprite-Bild aus und bleibt abwärtskompatibel. Die Sprite-Position
wird weiterhin über `sprite id,x,y` gesteuert.

### Software-Begrenzungsbox-Kollision

```basic
var touching = box_hit(left1, top1, right1, bottom1,
                       left2, top2, right2, bottom2)
```

`box_hit()` führt einen Test mit achsenparallelen Begrenzungsrahmen (AABB) durch
und gibt `1` zurück, wenn sich die beiden Rechtecke überlappen oder berühren,
andernfalls `0`. Im Gegensatz zu `sprite_hit()` und `sprite_bg_hit()` liest oder
löscht diese Funktion keine Kollisionsregister des VIC-II. Die acht Argumente
sind beliebige 8-Bit-Ausdrücke, daher können die Rahmen kleiner als die
sichtbare Sprite-Grafik sein oder Nicht-Sprite-Spielobjekte beschreiben. Die
Koordinaten sind inklusive; `left <= right` und `top <= bottom` bleiben
erhalten.

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

`sprdef id ... end` bettet 63 Sprite-Bytes an der nächsten
64-Byte-ausgerichteten Adresse im Codesegment ein, gibt ein `JMP` darüber aus
und setzt automatisch `$07F8+id = data_addr >> 6`. Um dieselbe Form für mehrere
Sprites zu verwenden, lesen Sie den Zeiger zurück:

```basic
var pg = peek($07F8)   # pointer set by sprdef 0
poke $07F9, pg         # copy to sprites 1–7
```

### Charakter-Kachelkarten (`.ubmap`)

```basic
map load "levels/world.ubmap"
map draw map_x, map_y       # draw a 40x25 viewport to screen/color RAM

var tile = map_tile(x, y)   # read character code from the map
map set x, y, 42            # change character code in writable map data

var shade = map_color(x, y) # read cell color (0 when map has no color data)
map color x, y, 7           # change cell color when color data is present
```

`map load` löst den Dateinamen relativ zur Quelldatei `.ub` auf, validiert ihn
zur Kompilierzeit und bettet seine Zeichen- und optionalen Farbarrays in den
beschreibbaren Programmspeicher ein. Ein späteres `map load` ersetzt die aktive
Map für nachfolgende Map-Befehle.

`map load` akzeptiert auch einen direkten VisualAssembler `me-map` `.bin`
Export:

```basic
map load "map-multicolor.bin"
```

Die ersten 1000 Bytes bilden die 40×25-Zeichentabelle, die nächsten 1000 Bytes
die Zellfarben. Mehrfarbenmodus und `$D021-$D023` werden aus dem
Metadaten-Trailer von VisualAssembler gelesen, daher ist keine
`.ubmap`-Konvertierung erforderlich.

`map draw map_x, map_y` kopiert einen 40×25-Ansichtsausschnitt, beginnend mit
der angegebenen Kartenzelle, in den Bildschirmspeicher `$0400` und, falls
vorhanden, in den Farbspeicher `$D800`. Die Karte muss den gesamten
angeforderten Ansichtsausschnitt enthalten: `map_x <= width-40` und `map_y <=
height-25` bleiben erhalten. Koordinaten und Abmessungen sind aktuell 8-Bit
(0–255).

Normal-Maps löschen das Text-Multicolor-Bit in `$D016`. Multicolor-Maps setzen
es und laden ihre drei globalen Farben in `$D021`, `$D022` und `$D023`.
Zeichen-Maps enthalten Zeichencodes, keine Zeichensatzpixel; kombinieren Sie sie
mit `charset`/`chardef` oder einer anderen Methode zum Laden des Zeichensatzes.
Im Multicolor-Textmodus wählen die Zellenfarben 8–15 Multicolor-Zeichen gemäß
den VIC-II-Regeln aus.

#### UBMP Version 1 Binärformat

Alle Multibyte-Ganzzahlen sind Little-Endian:

|   Offset |         Größe | Bedeutung                                                        |
| -------: | ------------: | ---------------------------------------------------------------- |
|        0 |             4 | ASCII-Magie `UBMP`                                               |
|        4 |             1 | Version, aktuell `1`                                             |
|        5 |             1 | Flags: Bit 0 = Farbarray vorhanden, Bit 1 = Mehrfarben-Textmodus |
|        6 |             2 | Kartenbreite, 1–255 Zellen                                       |
|        8 |             2 | Kartenhöhe, 1–255 Zellen                                         |
|       10 |             1 | Hintergrund 0 (`$D021`), niedriges Nibble verwendet              |
|       11 |             1 | Mehrfarbig 1 (`$D022`), geringes Nibble verwendet                |
|       12 |             1 | Mehrfarbig 2 (`$D023`), niedriges Nibble verwendet               |
|       13 | Breite × Höhe | Zeilenweise Zeichencodes                                         |
| folgende | Breite × Höhe | Optionale zeilenweise Farb-Nibbles, wenn Flag-Bit 0 gesetzt ist  |

Eine UBMP-Datei muss die exakte Länge aufweisen, die im Header angegeben ist.
Ungültige Angaben zu Version, Abmessungen oder Länge führen zu einem
Kompilierfehler.

### Koala Painter Bildimport

```basic
koala load "pictures/title.kla"  # validate and embed at compile time
koala show                       # enter bitmap multicolor mode
koala hide                       # return to the default text display
```

`koala load` akzeptiert eine standardmäßige 10003 Byte große Koala-Datei
(`$6000` Ladeadresse plus 10001 Datenbytes) oder eine rohe 10001 Byte große
Nutzlast. Pfade sind relativ zur Datei `.ub`. Die Nutzlast enthält 8000
Bitmap-Bytes, 1000 Bildschirm-Bytes, 1000 Farb-Nibbles und ein
Hintergrundfarben-Byte.

Der Compiler speichert die Daten unter `$6000-$8710`. `koala show` kopiert die
Bitmap nach `$2000`, die Bildschirmmatrix nach `$0400`, die Farben nach `$D800`
und aktiviert den Bitmap-Mehrfarbenmodus. `koala hide` deaktiviert den
Bitmap-/Mehrfarbenmodus und stellt das Standard-Textlayout wieder her.

Der generierte Code und die Hilfsfunktionen müssen unterhalb von `$2000` enden,
da die angezeigte Bitmap `$2000-$3F3F` überschreibt; andernfalls meldet der
Compiler einen Fehler. Der Koala-Import kann derzeit nicht mit `load sid` im
selben Programm kombiniert werden.

### Benutzerdefinierter Zeichensatz

```basic
charset $3800            # set base address for chardef (default $3800)

chardef 65               # redefine character 65 ('A')
  $18,$3C,$66,$7E,$66,$66,$66,$00
end

chardef 66               # fewer than 8 bytes are zero-padded
  $7C,$66,$7C,$66,$7C
end
```

`charset base` legt die Zieladresse für alle nachfolgenden `chardef`-Anweisungen
fest. `chardef id ... end` bettet 8 Bytes direkt in den Codeabschnitt ein
(vorangestellt durch `JMP`, um sie zu überspringen) und kopiert sie dann zur
Laufzeit nach `charset_base + id*8`. Die Werte müssen Kompilierzeitkonstanten
sein; verwenden Sie `%` für Binärliterale (`%00011000`).

Um einen benutzerdefinierten Zeichensatz in VIC-II zu aktivieren, legen Sie die
Adresse des Zeichengenerators über `$D018` fest:
```basic
charset $3800
chardef 1  $FF,$81,$81,$81,$81,$81,$81,$FF  end  # box border
poke $D018, $1A     # screen at $0400, charset at $3800 (bank 0)
```

### Erinnerung

```basic
poke $D020, 2            # STA $D020
poke addr_var, 6         # STA (addr_var),Y  — if addr_var is word type
var v = peek($D012)      # LDA $D012
var v = peek(addr_var)   # LDA (addr_var),Y  — if addr_var is word type

var w: word = peek16($C000)   # read 16-bit little-endian: lo=$C000, hi=$C001
poke16 $0314, $EA81           # write 16-bit little-endian: lo→$0314, hi→$0315
poke16 ptr, w                 # word var as address; word var as value
```

`peek16(addr)` liest zwei aufeinanderfolgende Bytes (lo, hi) als `word`.
`poke16` schreibt lo und dann hi.

### Festplatten-E/A

```basic
load "PROGRAM"           # KERNAL LOAD: loads file from device 8 to its native address
load "DATA", $C000       # loads file to a specific address
load "DATA", ptr         # addr from word variable

save "DATA", $C000, 4096 # KERNAL SAVE from $C000, 4096 bytes → device 8
save "PROG", start, len  # addr and len from word/int variables
```

`load` ruft KERNAL `SETNAM`+`SETLFS`+`LOAD` (`$FFBD`/`$FFBA`/`$FFD5`) auf. Ohne
Adresse: Sekundäre Adresse 0 (eigener 2-Byte-Header der Datei wird als
Ladeadresse verwendet). Mit Adresse: Sekundäre Adresse 1 (Datei wird an den
angegebenen Speicherort geladen). `save` ruft `SETNAM`+`SETLFS`+`SAVE`
(`$FFBD`/`$FFBA`/`$FFD8`) auf. Erfordert sowohl `addr` als auch `len`.

### SID Music

```basic
load sid "tune.sid"            # embed SID music at its native load address
load sid "tune.sid", $2000     # override: embed at $2000 regardless of SID header
```

`load sid` liest eine PSID- oder RSID-Datei zur **Kompilierzeit**, entfernt den
Header und hängt die rohen Musikbytes an die Ausgabe `.prg` an. Nach `load sid`
stehen zwei Kompilierzeitkonstanten zur Verfügung:

| Konstante  | Beschreibung                                                                          |
| ---------- | ------------------------------------------------------------------------------------- |
| `sid_init` | Initialisierungsroutineadresse — einmal aufrufen mit A = Liednummer (beginnend bei 0) |
| `sid_play` | Routineadresse abspielen – Aufruf in jedem Frame (50 Hz PAL) von einem IRQ-Handler    |

Beide Konstanten funktionieren überall dort, wo eine konstante Adresse
akzeptiert wird: `sys`, `irq`, `poke`, Ausdrücke.

**Typische Verwendung:**

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

**Anmerkungen:**
- Die SID-Daten werden **nach** dem gesamten generierten Code eingefügt und bis
  zur Ladeadresse mit Nullen aufgefüllt. Der Compiler gibt eine Warnung aus,
  falls die SID-Ladeadresse mit generiertem Code in Konflikt gerät.
- PSID v1 und v2 werden unterstützt. Wenn die Ladeadresse des SID-Headers 0 ist,
  werden die ersten beiden Datenbytes als Adresse verwendet (PRG-Stil,
  Little-Endian).
- Nur ein `load sid` pro Programm ist aussagekräftig (das letzte gewinnt).

### Serielle Kanaldatei-E/A

```basic
open 1, 8, 2, "MYFILE"  # open logical file 1, device 8, secondary 2, name "MYFILE"
open 2, 4, 7             # open printer (device 4), no filename
open ch, dev, sec        # channel, device, secondary from variables

print# 1, "HELLO"        # send "HELLO"+CR to logical file 1
print# ch, x, "text"     # any mix of vars, strings — same as print but to file

close 1                  # close logical file 1
close ch                 # channel from variable
```

`open` ruft `SETNAM` ($FFBD) + `SETLFS` ($FFBA) + `OPEN` ($FFC0) auf. Ohne
Dateinamen wird SETNAM mit der Länge 0 aufgerufen. `print#` leitet die Ausgabe
über `CHKOUT` ($FFC9), CHROUT pro Zeichen (+ abschließendes CR), und
anschließend über `CLRCHN` ($FFCC) weiter. `close` speichert die Kanalnummer in
A und ruft `CLOSE` ($FFC3) auf.

### Input

```basic
input score              # read up to 3 digits from keyboard → 8-bit int var
input "Name: ", name     # optional prompt string, then read line → string var
input "Score: ", score   # prompt + int input
```

`input` verwendet KERNAL BASIN (`$FFCF`) für blockierende, echoed line input mit
DEL-Unterstützung.
- **Int var**: akzeptiert nur `0`–`9`, maximal 3 Zeichen; wird beim
  Zeilenumbruch in einen 8-Bit-Wert umgewandelt.
- **String-Variable**: Akzeptiert bis zu 30 Zeichen; speichert als
  nullterminierte Zeichenkette; ZP-Paar wird aktualisiert.

### Gleitkommazahl / Festkommazahl

`float` Variablen verwenden das Q8.8 Festkommaformat: Das höherwertige Byte ist
der ganzzahlige Teil (0–255) und das niederwertige Byte ist der Bruchteil (0/256
… 255/256).

```basic
var f: float = 3.5       # 3.5 → hi=3, lo=128 (= 0x0380)
var g: float = 0         # integer 0 is promoted to 0.0 automatically

f = 1.5                  # Q8.8 literal assignment
f = f + 1.5              # 16-bit Q8.8 arithmetic (result: 3.0)
f = f + g                # float + float

var n = int(f)           # extract integer part (hi byte) → 8-bit int
print f                  # prints as "N.DD" (e.g. 3.5 → "3.50", 1.25 → "1.25")
```

| Betrieb                 | Beispiel             | Anmerkungen                                     |
| ----------------------- | -------------------- | ----------------------------------------------- |
| Wörtlich                | `3.5`, `0.25`, `1.0` | Wurde zur Kompilierzeit als Q8.8 interpretiert. |
| Ganzzahlige Beförderung | `f = 5`              | Speichert 5.0 (hi=5, lo=0)                      |
| Hinzufügen/Ersetzen     | `f + 1.5`, `f - g`   | 16-Bit-Q8.8-Arithmetik                          |
| Extrakt int             | `int(f)`             | Gibt das hi-Byte als 8-Bit-Integer zurück.      |
| Drucken                 | `print f`            | Format "N.DD", immer 2 Nachkommastellen         |

**Achtung:** Arithmetische Operationen führen bei 255,255 zu einem Überlauf
(keine Sättigung). Multiplikation und Division zweier Gleitkommazahlen werden
noch nicht unterstützt – verwenden Sie in diesen Fällen `int()` +
Ganzzahlarithmetik.

### Mathematische Funktionen

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

### Zeichenkettenfunktionen

```basic
var n = len(msg)         # length of null-terminated string var (0–255)
var c = asc(msg)         # PETSCII code of first character (0 if empty)
var c = asc("A")         # compile-time: constant PETSCII code
var n = val(s)           # runtime: parse decimal PETSCII string → 8-bit int (e.g. "042" → 42)
var c = msg[i]           # string character at index i: PETSCII code of msg[i]
msg[i] = c               # write PETSCII byte c to string at index i — STA (ptr),Y
msg[0] = 72              # constant index → LDY #0; STA (ptr),Y
```

### Zahlenformatierung

```basic
print hex(n)             # print as 2-digit uppercase hex
print bin(n)             # print as 8-bit binary string
print dec(n, 4)          # right-justified decimal in a field of 4 chars (e.g. 42 → "  42")
print dec(n, width)      # width can also be a variable
```

`dec(n, width)` füllt die Zahl links mit Leerzeichen auf, um `width` Zeichen
aufzufüllen. Hat die Zahl mehr Ziffern als `width`, wird sie ohne Auffüllung
ausgegeben (keine Kürzung). Außerhalb des Druckkontexts wird `dec(n, w)`
unverändert zu `n` ausgewertet (genau wie `hex`/`bin`).

### REU (RAM-Erweiterungseinheit)

```basic
var ok = reu_present()   # 1 if REU detected, 0 if not (write/read test on $DF04)
var ok = reudet()        # alias for reu_present()

reu stash c64addr, bank, reu_addr, len  # copy C64 → REU
reu fetch c64addr, bank, reu_addr, len  # copy REU → C64
reu swap  c64addr, bank, reu_addr, len  # swap between C64 and REU
```

`reu_present()` führt einen Schreib-/Lesetest am REU-Register `$DF04` durch.
Ohne ein REU geht der Schreibvorgang verloren (offener Bus), daher unterscheidet
sich der Lesevorgang – er erkennt zuverlässig die Anwesenheit, ohne auf
irgendwelche Befehlsregister mit Nebenwirkungen zuzugreifen.

| Parameter  | Breite | Anmerkungen                                                    |
| ---------- | ------ | -------------------------------------------------------------- |
| `c64addr`  | 16-Bit | C64 RAM-Start — Konstante, `word` Variable oder 8-Bit-Ausdruck |
| `bank`     | 8-Bit  | REU-Banknummer (0–7 für eine 512 KB große Einheit)             |
| `reu_addr` | 16-Bit | Offset innerhalb der REU-Bank                                  |
| `len`      | 16-Bit | Zu übertragende Bytes (`0` = 65 536 in REU-Hardware)           |

REU-Register: `$DF01` Befehl (`$B0` Zwischenspeicher / `$B1` Abruf / `$B2`
Swap), `$DF02–$DF03` C64-Adresse, `$DF04–$DF05` REU-Offset, `$DF06` Bank,
`$DF07–$DF08` Länge. Die Übertragung erfolgt synchron (CPU wird während des DMA
angehalten). Erfordert ein echtes REU oder VICE: **Einstellungen → Hardware →
RAM-Erweiterungsmodul**.

### Speicher-Dienstprogramme

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

Sowohl `fill` als auch `memcopy` unterstützen 16-Bit-Längen (0–65535). Verwenden
Sie `word`-Variablen für Längen > 255.

`drawmem src, dst, width, height, stride` kopiert einen zweidimensionalen
rechteckigen Block. `src` wird linear gelesen (zeilenweise gepackt); `dst`
verschiebt den Zeilenabstand um `stride` Bytes – verwenden Sie `40` ($28) für
den C64-Bildschirm oder Farb-RAM (40 Spalten). Breite, Höhe und Schrittweite
sind 8-Bit-Werte. `src` und `dst` können Konstanten, `word` Variablen oder
8-Bit-Ausdrücke sein.

### Raster IRQ

```basic
irq my_handler           # raster IRQ at line 0, handler = sub name or address
irq my_handler, 100      # raster IRQ at raster line 100
irq $C800, 200           # handler at fixed address
irq addr_word            # handler address from a word variable
```

Richtet einen Raster-IRQ über den BASIC-Softvektor (`$0314`/`$0315`) ein:
deaktiviert den CIA1-Timer-IRQ, bestätigt den ausstehenden VIC-IRQ, schreibt die
Rasterzeile nach `$D012`, aktiviert den VIC-Raster-IRQ (`$D01A=$01`), schreibt
die Handler-Adresse und aktiviert die Interrupts wieder.

Der Handler **muss** mit `sys $EA81` (KERNAL-Ende der IRQ) enden – einfache
`RTS` oder `RTI` beschädigen den Stack. Bestätigen Sie zuerst die VIC-IRQ.

```basic
sub my_handler()
  poke $D019, $FF      # ACK VIC IRQ
  # ... work here ...
  sys $EA81            # JMP to KERNAL end-of-IRQ
end
```

Vorwärtsreferenzen werden unterstützt (`irq my_handler` vor der Definition der
Unterfunktion).

### NMI-Handler

```basic
nmi my_nmi               # set NMI vector $0318/$0319 to handler sub or address

sub my_nmi()
  # ... NMI work here ...
  nmi_exit               # JMP $FE47 — proper NMI exit (restores A/X/Y + RTI)
end
```

`nmi handler` schreibt die Handler-Adresse in den NMI-Softvektor
(`$0318`/`$0319`). Der Hardware-NMI-Vektor bei `$FFFA` verweist auf die
KERNAL-NMI-Routine, die über `$0318` verzweigt. Der Handler **muss** mit
`nmi_exit` enden (gibt `JMP $FE47` aus) – die Verwendung von `RTI` führt zu
einer Beschädigung des Stacks. Vorwärtsreferenzen werden unterstützt.

### CIA1 Timer IRQ

```basic
cia_timer 19656, my_handler   # CIA1 timer A: fires every 19656 cycles (~50 Hz PAL)
cia_timer period, handler      # period can be a variable or expression
```

Richtet den CIA1-Timer A als periodische IRQ-Quelle über den BASIC-Softvektor
(`$0314`/`$0315`) ein:
1. SEI – Interrupts deaktivieren
2. `$DC0D = $7F` — Deaktiviert alle CIA1-IRQs
3. Load 16-bit period lo→`$DC04`, hi→`$DC05`
4. Handleradresse in `$0314`/`$0315` schreiben
5. `$DC0D = $81` — CIA1-Timer A IRQ aktivieren
6. `$DC0E = $01` — Timer A im Dauerbetrieb starten
7. CLI – Interrupts wieder aktivieren

Der Handler muss mit `irq_exit` (oder `sys $EA81`) enden und die CIA1-IRQ
bestätigen:

```basic
sub my_handler()
  poke $DC0D, $01      # ACK CIA1 timer A IRQ (read also clears it)
  # ... work here ...
  irq_exit             # JMP $EA81: restore A/X/Y + RTI
end
```

PAL-Timing: Takt = 985.248 Hz. Periode für 50 Hz = 985.248 / 50 = 19.705 Zyklen
≈ `$4CC9`. Vorwärtsreferenzen werden unterstützt.

### Fehlerbehandlung

```basic
onerr goto err_handler   # set KERNAL I/O error vector ($0300/$0301) to a label

...

label err_handler
  print "I/O ERROR"
  bye
```

`onerr goto label` schreibt die Labeladresse (lo, hi) an die KERNAL-Speicherorte
`$0300` und `$0301`. Tritt ein KERNAL-E/A-Fehler auf (z. B. ein fehlgeschlagener
Aufruf von `load` oder `open`), führt der KERNAL `JMP ($0300)` aus, wodurch zum
entsprechenden Label verzweigt wird. Vorwärtsreferenzen (Labeldefinition nach
`onerr goto`) werden unterstützt.

### Einbettung von Dateien zur Kompilierzeit

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

Alle `data`-Werte werden zur Kompilierzeit erfasst. Ein 2-Byte-ZP-Zeiger wird
beim Programmstart automatisch allokiert und initialisiert. Jedes `read` erhöht
die Position des Zeigers.

### Inline-Montage

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

**Adressierungsmodi:**

| Syntax         | Modus        | Bytes | Beispiel                       |
| -------------- | ------------ | ----- | ------------------------------ |
| (kein Operand) | Impliziert   | 1     | `NOP`, `RTS`                   |
| `A`            | Akkumulator  | 1     | `ASL A`, `LSR`                 |
| `#value`       | Sofort       | 2     | `LDA #$07`                     |
| `$zz` (0–255)  | Nullseite    | 2     | `LDA $50`                      |
| `$zz,X`        | ZP,X         | 2     | `LDA $50,X`                    |
| `$zz,Y`        | ZP,Y         | 2     | `LDX $50,Y`                    |
| `$xxxx`        | Absolute     | 3     | `LDA $0400`                    |
| `$xxxx,X`      | Absolut,X    | 3     | `LDA $0400,X`                  |
| `$xxxx,Y`      | Absolut,Y    | 3     | `LDA $0400,Y`                  |
| `($xxxx)`      | Indirekt     | 3     | `JMP ($FFFC)`                  |
| `($zz,X)`      | (Indirekt,X) | 2     | `LDA ($50,X)`                  |
| `($zz),Y`      | (Indirekt),Y | 2     | `LDA ($50),Y`                  |
| `label`        | Relativ      | 2     | `BNE label` (nur Zweigstellen) |

- `$zz` (1–2 Hexadezimalstellen, Wert ≤ 255) wählt die Nullseite aus, sofern die
  Anweisung dies unterstützt; andernfalls erfolgt ein automatisches Upgrade auf
  absolute Seiten. Verwenden Sie `$00xx` (4 Stellen), um die absolute
  Seitenauswahl zu erzwingen.
- Die Branch-Operanden sind absolute Adressen; der relative Byte-Offset wird
  automatisch berechnet.
- Lokale Labels (`name:`) sind auf den Block `asm { }` beschränkt.
  Vorwärtszweige wurden in Durchlauf 2 aufgelöst.
- `#<label` / `#>label` liefert das lo / hi Byte der Adresse eines Labels.
- `*` liefert die Adresse der aktuellen Anweisung, daher wird `JMP *` als
  Selbstschleife assembliert.
- Zeilen, die mit `$`, `%` oder einer Ziffer beginnen, werden als Rohbytes
  ausgegeben (abwärtskompatibel).
- Innerhalb von `asm { }` stehen Kommentare unter `;` oder `//` bis zum
  Zeilenende. (`#` ist das unmittelbare Präfix, kein Kommentar.)

**Vermischung von `asm { }` mit Unterprogrammparametern**

Parameternamen sind innerhalb von `asm { }` Blöcken **nicht zugänglich**.
Verwenden Sie UltimateBasic-Anweisungen, um Werte vor dem `asm { }` Block an
bekannte Speicherorte zu verschieben:

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

Für Routinen, deren gesamter Code in Assembler geschrieben ist – insbesondere
IRQ-Handler, die sich gegenseitig referenzieren müssen – sollten alle Handler in
einem **einzelnen `asm { }`-Block auf oberster Ebene** im Hauptprogramm
platziert werden. Labels im selben Block teilen sich den Gültigkeitsbereich,
sodass `irq1` und `irq2` sich frei referenzieren können. Siehe
`examples/raster_irq_demo.ub`.

### Zeichenkette ↔ Ganzzahl

```basic
numstr score, $0340      # writes "042\0" at $0340 (always 3 digits, zero-padded)
var n = str_to_int("42") # compile-time: Expr::Number(42)

print str$(score)                # print 8-bit int as 3-digit decimal string ("000"–"255")
print "Score: " + str$(score)   # usable in string concat print context
var s: string = str$(n)          # assign str$() result to a string var (shared static buffer)
```

`str$(n)` wandelt einen 8-Bit-Wert in eine 3-stellige Dezimalzahl um (immer 3
Ziffern mit führenden Nullen, z. B. `5` → `"005"`, `42` → `"042"`, `255` →
`"255"`), gefolgt von einem Nullbyte. Der Ergebniszeiger wird in einem
permanenten ZP-Paar gespeichert, das zur Kompilierzeit allokiert wird.

> **Hinweis:** `str$(n)` verwendet einen gemeinsamen 4-Byte-Puffer. Ein erneuter
> Aufruf von `str$(n)` überschreibt das vorherige Ergebnis. Um mehrere Werte
> gleichzeitig anzuzeigen, verwenden Sie `numstr`, um in separate absolute
> Adressen zu schreiben.

## Beispiele

| Datei                               | Beschreibung                                                                                |
| ----------------------------------- | ------------------------------------------------------------------------------------------- |
| `examples/features.ub`              | const, label/goto, poke/peek, rnd, mathematische Funktionen                                 |
| `examples/new_features.ub`          | Unterparameter, Arrays, Wortvariablen, Zeichenkettenvariablen                               |
| `examples/bitmap_demo.ub`           | 320×200 Bitmap, Diagramm, Grafik ein/aus                                                    |
| `examples/block_demo.ub`            | 80×50 Blockgrafiken, plot4, circle4, Grafiken auf Block                                     |
| `examples/joystick_demo.ub`         | Joystick-Eingabe, Sprite-Bewegung                                                           |
| `examples/mux_demo.ub`              | Raster-Sprite-Multiplexer (3 Fenster × 8 Sprites = 24)                                      |
| `examples/orbit_demo.ub`            | 24-Sprite-Orbit mit pulsierendem Radius und zufälligen Farben                               |
| `examples/plasma_demo.ub`           | Bitmap mit Plasmaeffekt und Rasterbalken-Rahmenanimation                                    |
| `examples/sprite_data.ub`           | sprdef-Formdaten (in anderen Demos enthalten)                                               |
| `examples/sprite_mux_orbit.ub`      | 24-Sprite-Orbit-Demo mit sprdef + vorab berechneten Positionen                              |
| `examples/sprite_orbit_demo.ub`     | 8 Hardware-Sprites in kreisförmiger Umlaufbahn mittels Sinus-/Kosinustabelle                |
| `examples/reu_bitmap_demo.ub`       | REU-Speicherung/Abruf mit Bitmap-Grafiken                                                   |
| `examples/sid_music_demo.ub`        | SID-Musikplayer mit Raster-IRQ und Tastaturausgang                                          |
| `examples/tenprint.ub`              | 5 TENPRINT-Labyrinth-Implementierungen mit Menü; Demos `lowercase` Zeichensatzmodus         |
| `examples/countdown_demo.ub`        | Countdown `for..next` mit negativem Schritt, inkl. `for i = 20 to 0 step -2`                |
| `examples/countdown_errors_demo.ub` | Kompilierfehler für Standardschritt `from > to`                                             |
| `examples/explicit_demo.ub`         | `--explicit` CLI-Flag-Demo mit vollständig typisierten `var`, `sub`, `fn`                   |
| `examples/explicit_errors_demo.ub`  | Ungeordneter Code, der ohne --explicit kompiliert, aber mit `--explicit` Fehler verursacht. |

## CLI-Referenz

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

### CRT-Export

Ultimate Basic kann auch ein Magic Desk Typ-19 Cartridge-Image schreiben, wenn
der Ausgabedateiname mit `.crt` endet:

```bash
ub build demo.ub -o demo.crt
```

Der Compiler verpackt das generierte PRG in einen CRT-Container mit
Bankstruktur, der dasselbe Layout wie der CRT-Export von VisualAssembler
aufweist: einen 64 Byte großen Cartridge-Header, ein 8×8 KB großes Magic
Desk-Image und einen Bootloader in Bank 0, der die PRG-Nutzdaten in den C64-RAM
kopiert, bevor er zum Programmeinstiegspunkt springt. Die Pfade `.prg` und
`.d64` funktionieren weiterhin wie bisher.

### Modus für expliziten Typ

Übergeben Sie `--explicit`, um zu erzwingen, dass jede Deklarationsstelle eine
`:type`-Annotation trägt:

```bash
ub build game.ub --explicit
```

Ohne das Flag akzeptiert Ultimate Basic sowohl `var x = 5` (Typ abgeleitet vom
Initialisierer oder standardmäßig `int`) als auch `var x: int = 5`. Mit dem Flag
lässt sich nur die annotierte Form kompilieren – die nicht annotierte Form führt
zu einem Kompilierfehler.

**Was es durchsetzt:**

| Erklärungsformular                                             | Ohne `--explicit`          | Mit `--explicit`                       |
| -------------------------------------------------------------- | -------------------------- | -------------------------------------- |
| `var name = expr` (kein `:type`)                               | OK – Typ abgeleitet        | Fehler                                 |
| `var name: int = expr` (oder Wort/Gleitkommazahl/Zeichenkette) | OK                         | OK                                     |
| `var arr = array(N)`                                           | ok — implizit `array`      | Okay – unverändert                     |
| `var arr = array_word(N)`                                      | ok — implizit `array_word` | Okay – unverändert                     |
| `const NAME = value`                                           | OK                         | Okay – unverändert                     |
| `sub foo(a, b)` (untypisierte Parameter)                       | OK                         | Fehler pro nicht typisiertem Parameter |
| `sub foo(a: int, b: int)`                                      | OK                         | OK                                     |
| `fn foo(a): int` (untypisierter Parameter)                     | OK                         | Fehler beim Parameter                  |
| `fn foo(a: int): int`                                          | OK                         | OK                                     |

Konstanten und Array-Deklarationen werden immer akzeptiert – ihr Typ ist durch
die Deklarationsform festgelegt, daher wäre `:type` überflüssig.

**Beispielhafte Fehlermeldung:**

```
$ ub build myprog.ub --explicit
Compilation errors:
  line 14: 'explicit' mode: 'var loose' has no type — use 'var loose: int|word|float|string'
  line 16: 'explicit' mode: parameter 'a' has no type — use 'a: int|word|float|string'
```

Das Flag ist ein Schalter, der zur Build-Zeit aktiviert wird – im Quellcode muss
nichts geändert werden, um ihn zu aktivieren oder zu deaktivieren. Fügen Sie ihn
Ihrer Makefile/Ihrem Build-Skript hinzu, um typisierten Code im gesamten Projekt
zu erzwingen, oder lassen Sie ihn für explorative Skripte weg. Siehe
`examples/explicit_demo.ub` und `examples/explicit_errors_demo.ub`.

### Debug-Dateien

Verwenden Sie `--debug`, um Debugger-Symbole zusammen mit dem Programm zu
generieren:

```bash
ub build demo.ub --debug
```

Der Compiler schreibt die Dateien neben `.prg`, wobei er den Stamm der
Ausgabedatei verwendet:

| Datei      | Format und Zweck                                                                          |
| ---------- | ----------------------------------------------------------------------------------------- |
| `demo.sym` | KickAssembler-kompatibler Symbolquellcode, geeignet zum Import in Assembler-Quellcode     |
| `demo.dbg` | C64Debugger/RetroDebugger KickAssembler Debug-Dump mit dem Programmsegment und den Labels |
| `demo.vs`  | VICE-Monitor-Befehlsdatei mit `al`-Befehlen für Adressbezeichnungen                       |

Alle drei Exporte umfassen `program_start`, `program_end`, Variablen, Arrays,
Unterprogramme und BASIC-Labels, die nach der Codegenerierung bekannt sind.
Beispielsweise können die VICE-Symbole mit der Befehlszeilenoption `-moncommands
demo.vs` oder dem Monitorbefehl `ll "demo.vs"` geladen werden.

Der aktuelle `.dbg`-Export liefert Segment- und Adresssymbolinformationen. Er
beinhaltet noch keine Zuordnungen von Anweisungen zu Quellcodezeilen für das
schrittweise Durchlaufen des Quellcodes.

### Liste der Assembly-Codegenerierung (neu in Version 1.5.2)

Verwenden Sie `--asm`, um eine lesbare 6502-Quelltextauflistung neben dem PRG zu
schreiben:

```bash
ub build demo.ub --asm
```

For an output named `demo.prg`, this creates `demo.asm`. The listing is produced
from metadata collected while Ultimate Basic generates the machine code; it is
not merely a disassembly of the completed PRG. It contains:

- `; UB:` Kommentare, die den generierten Bytebereich jeder ausgebenden
  UB-Anweisung markieren;
- Benannte Konstanten für Nullseitenvariablen und `$C000+`-Arrays,
  einschließlich ihrer Typen/Größen;
- endgültige Namen und Adressen für Unterprogramme und BASIC-Labels;
- generierte `loc_xxxx` Labels für relative Zweige und In-Program-Ziele
  `JMP`/`JSR`;
- normale 6502-Mnemonics und Operanden, wobei, wo bekannt, Compiler-Symbole
  verwendet werden;
- die genaue C64-Adresse und die ausgegebenen Bytes neben jeder Anweisung;
- Compilergenerierte Hilfsfunktionen und eingebetteter Code in ihrer endgültigen
  Speicherreihenfolge;
- `.byte` Ausgabe für Bytes, die nicht als unterstützte 6502-Befehle dekodiert
  werden können.

Compiler-Hilfsfunktionen erhalten beschreibende Namen wie `ub_helper_plot`,
`ub_helper_line_erase`, `ub_helper_print_hex` und `ub_helper_music_irq`.
Bekannte eingebettete Daten – darunter `data`-Anweisungen,
Map-Zeichen-/Farbarrays, Sprite- und Zeichendefinitionen, die Sinustabelle,
Dateinamen zum Laden, `incbin`-Dateien, SID-Musik und Koala-Payloads – werden
als benannte `.byte`-Regionen ausgegeben. Lange, mit Nullen aufgefüllte
Adresslücken werden mithilfe der KickAssembler-Direktive `.fill` überbrückt.

Beispielauszug:

```asm
.label x                 = $02 ; int

* = $080D

ub_start:
    cld                         ; $080D: D8
    ; UB: var x
    lda  #$01                   ; $080E: A9 01
    sta  x                      ; $0810: 85 02
```

Die Adress-/Byte-Kommentare erleichtern den Vergleich des Listings mit `.prg`.
Die Ausgabe verwendet KickAssembler-Syntax (`.label`, `.byte`, `.fill` und `* =
origin`), sodass sie erneut assembliert werden kann; Maschinencode-Kommentare
haben keinen Einfluss auf das Ergebnis.

`--add` benötigt `--d64`. Das kompilierte Programm `.ub` ist immer die erste
Datei auf der Festplatte; jede weitere Datei `--add` wird daran angehängt. Die
Dateinamen auf der Festplatte werden aus dem Stamm der Quelldatei abgeleitet und
in Großbuchstaben geschrieben (z. B. `music.prg` → `MUSIC`).

Nach einem erfolgreichen Build gibt der Compiler immer eine Speicherabbildung
aus:

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

Mit `-v` werden zusätzlich die internen ZP-Zuweisungen und ein vollständiger
Hex-Dump angezeigt.

## Bekannte Einschränkungen

| Besonderheit                          | Einschränkung                                                                                                                                                                            |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ganzzahlarithmetik                    | 8-Bit-Werte ohne Vorzeichen (0–255); `word`-Variablen speichern 16-Bit-Werte                                                                                                             |
| Unterprogramme                        | Keine Rekursion – ZP-Parameterplätze werden statisch zugewiesen                                                                                                                          |
| Zeichenkettenvariablen                | Read-only after init; assignment replaces the pointer, not the data                                                                                                                      |
| Laufzeit von Stringverkettung         | `s1 + s2` wird sequenziell ausgegeben – keine Heap-Allokation oder Längenverfolgung                                                                                                      |
| `rnd()` / `rnd(n)`                    | Einfacher LCG, nicht kryptographisch; Periode = 256                                                                                                                                      |
| `abs()` / `sgn()` / `min()` / `max()` | Nur 8-Bit-Werte; `abs`/`sgn` behandeln Werte als vorzeichenbehaftet (Bit 7 = negativ → `abs` Zweierkomplement, `sgn` gibt `$FF` zurück); `min`/`max` sind vorzeichenlos (0–255)          |
| `plot`                                | Pixel außerhalb des Messbereichs werden stillschweigend abgeschnitten (Y ≥ 200 oder X ≥ 320 → keine Operation)                                                                           |
| `mplot`                               | Keine Bereichsprüfung — x muss zwischen 0 und 159 liegen, y muss zwischen 0 und 199 liegen                                                                                               |
| `mline` / `mrect`                     | Mehrfarbig; x: 0–159, y: 0–199. Pixel außerhalb des Bildschirms werden umgebrochen (kein Abschneiden) – Koordinaten bleiben im Bereich                                                   |
| `mcircle`                             | Mehrfarbig; Punkte außerhalb des Bildschirms werden abgeschnitten (x ≥ 160 oder y ≥ 200 werden übersprungen)                                                                             |
| `color pen`                           | Nur für hochauflösende Zellen; setzt den Vordergrund-Nibble der berührten Zellen (Hintergrund bleibt erhalten). Hat im Blockmodus keine Auswirkung (`plot4`/`circle4`).                  |
| `rect`                                | Keine Bereichsprüfung — x: 0–319, y: 0–199; x1≤x2 und y1≤y2 werden nicht erzwungen (degenerierte/invertierte Rechtecke erzeugen undefinierte Ausgabe)                                    |
| `plot4`                               | Keine Bereichsprüfung — x muss zwischen 0 und 79 liegen, y muss zwischen 0 und 49 liegen (Blockmodus)                                                                                    |
| `circle4`                             | Schneidet Pixel außerhalb des Bildschirms ab; der nutzbare Radius beträgt im 80×50-Blockmodus ungefähr 0–49.                                                                             |
| `chr$`                                | Keine PETSCII↔ASCII-Zuordnung — n wird unverändert an CHROUT übergeben                                                                                                                   |
| `music play`                          | Erfordert `load sid`; es wird nur ein CIA1-Wrapper ausgegeben (der letzte `music play` gewinnt)                                                                                          |
| `graphics on double`                  | Nur für hochauflösende Darstellungen; verwendet `$4000–$7FFF` als Backbuffer, daher muss der Programmcode unterhalb von `$4400` bleiben; nicht kombinierbar mit Sprites oder Mehrfarben. |
| Fehlerberichterstattung               | Nur zur Kompilierzeit; `onerr goto` behandelt KERNAL-E/A-Fehler zur Laufzeit.                                                                                                            |
