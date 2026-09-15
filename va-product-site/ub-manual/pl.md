# Ultimate Basic v1.5.6 — Podręcznik językowy

Kompletny podręcznik języka i interfejsu wiersza poleceń dla Ultimate Basic,
języka podobnego do BASIC-a, który kompiluje się bezpośrednio do kodu
maszynowego 6502 dla Commodore 64. Dane wyjściowe: pliki `.prg` (VICE lub
rzeczywisty sprzęt), obrazy kaset `.crt` i obrazy dysków `.d64`.

Krótki opis projektu i instrukcje kompilacji znajdziesz w pliku README.md.

© 2026 Zsolt Tarczali

> Budowanie kompilatora `ub` i opcje wiersza poleceń opisano w pliku
> [README.md](README.md). Niniejszy podręcznik dokumentuje sam język Ultimate
> Basic.

## Odniesienie językowe

### Zmienne i stałe

**Wszystkie zmienne muszą zostać zadeklarowane za pomocą `var` przed użyciem.**
Użycie niezadeklarowanej zmiennej w wyrażeniu, przypisaniu, liczniku
`for`/`loop`, instrukcji `inc`/`dec`, `input` lub `read` powoduje błąd
kompilacji.

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

Słowa kluczowe i identyfikatory **nie uwzględniają wielkości liter**: `PRINT`,
`Print` i `print` są prawidłowe.

| Typ                   | Szerokość          | Notatki                                                                   |
| --------------------- | ------------------ | ------------------------------------------------------------------------- |
| `int`                 | 8-bit              | domyślne dla literałów liczbowych                                         |
| `word`                | 16-bit             | dwa bajty ZP; można ich używać jako adresu w `poke`/`peek`                |
| `float`               | 16-bitowy Q8.8     | hi byte = część całkowita (0–255), lo byte = część ułamkowa               |
| `string`              | wskaźnik           | Para ZP → PETSCII zakończony zerem w segmencie kodu                       |
| `array(N)`            | N bajtów           | elementy bajtu; znajdują się pod adresem `$C000+`, a nie w ZP             |
| `array_word(N)`       | N×2 bajtów         | elementy słowa (16-bitowe); znajdują się pod adresem `$C000+`, a nie w ZP |
| `array(R, C, …)`      | ∏przyciemnia bajty | wielowymiarowy (główny wiersz); indeks `arr[r, c]`                        |
| `array_word(R, C, …)` | ∏dims×2 bajty      | wielowymiarowa tablica słów (wiersz-major)                                |

### Słowa zastrzeżone

Poniższe identyfikatory to **słowa kluczowe** — nie można ich używać jako nazw
zmiennych, stałych, podprogramów, funkcji, parametrów ani etykiet. Wszystkie
dopasowania nie uwzględniają wielkości liter (`END`, `end`, `End` wszystkie
kolidują). Użycie słowa zarezerwowanego jako nazwy zazwyczaj powoduje mylący
błąd (wiersz `var` nie deklaruje się automatycznie lub wyrażenie takie jak `for
i = 1 to times` jest składane do `Number(0)`) — wybierz więc inną nazwę.

**Deklaracja i przepływ sterowania** `var`, `const`, `sub`, `fn`, `type`,
`endtype`, `return`, `call`, `label`, `goto`, `gosub`, `if`, `then`, `else`,
`end`, `select`, `case`, `for`, `next`, `loop`, `times`, `to`, `step`, `while`,
`repeat`, `until`, `break`, `continue`, `inc`, `dec`, `bye`, `exit`, `rem`

**Typy i pokrewne typy** `int`, `word`, `float`, `string`, `array`, `array_word`

**Drukowanie i wejście/wyjście** `print`, `spc`, `tab`, `at`, `input`, `chr$`,
`str$`, `hex`, `bin`, `open`, `close`, `load`, `save`, `data`, `read`,
`include`, `incbin` (również `dec` — wymienione powyżej jako polecenie
dekrementacji; ten sam token jest używany dla formatu wydruku `dec(n, width)`)

**Wbudowane funkcje matematyczne i ciągi znaków** `abs`, `min`, `max`, `clamp`,
`sgn`, `mod`, `rnd`, `sin`, `cos`, `and`, `or`, `xor`, `not`, `bnot`, `shl`,
`shr`, `len`, `asc`, `val`, `str_to_int`, `numstr`

**Pamięć i synchronizacja** `poke`, `peek`, `poke16`, `peek16`, `fill`,
`memcopy`, `drawmem`, `wait`, `raster`, `delay`, `sys`, `asm`

**Ekran i tekst** `cls`, `fast`, `color`, `text`, `border`, `bg`, `screen`,
`cursor`, `lowercase`, `uppercase`, `display`, `on`, `off`, `scroll`, `speed`,
`badlines`, `turbo`

**Grafika bitmapowa i blokowa** `graphics`, `gcls`, `flip`, `plot`, `plot4`,
`mplot`, `mline`, `mrect`, `mcircle`, `line`, `circle`, `circle4`, `rect`,
`paint`, `erase`, `pen`, `multi`, `block`

**Duchy** `sprite`, `sprdef`, `sprite_frame`, `sprite_x`, `sprite_y`, `sprhit`,
`sprbghit`, `box_hit`, `chardef`, `charset`, `expand`, `priority`

**Dźwięk i muzyka** `sid`, `sound`, `volume`, `music`, `play`, `pause`,
`resume`, `stop`

**Urządzenia wejściowe** `getch`, `inkey`, `waitkey`, `joy`, `mouse_x`,
`mouse_x_hi`, `mouse_y`, `mouse_btn`

**Przerwania i wektory** `irq`, `irq_exit`, `nmi`, `nmi_exit`, `cia_timer`,
`onerr`

**Mapy postaci i obrazy** `map`, `map_tile`, `map_color`, `koala`, `show`,
`hide`

**REU (rozszerzenie pamięci RAM)** `reu`, `reudet`, `stash`, `fetch`

**Pułapki stylistyczne – nazwy, które *wyglądają* na wolne, ale są zastrzeżone**

Te popularne angielskie słowa wyglądają jak niewinne identyfikatory, ale zostały
już wyłapane przez lekser. Zmień nazwę, aby uniknąć ukrytego uszkodzenia:

| Skryty                                      | Sugerowana zmiana nazwy             |
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

Tokenów symbolicznych (`+ - * / = == != < > <= >= : , ; ( ) [ ] # $ % @`)
oczywiście nie można używać w identyfikatorach.

### Uwagi

```basic
# hash comment
rem this is also a comment
var x = 5  # inline comment
var x = 5 : var y = 6  # colon separates statements on one line
```

### Operatorzy

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

Porównania: `==` `!=` `<` `>` `<=` `>=` (zwróć 1/0)

### Zwiększanie/zmniejszanie

```basic
inc x                    # x = x + 1  (INC zp — single instruction)
dec x                    # x = x - 1  (DEC zp — single instruction)
```

For `word` variables carry is handled: `inc` uses `INC lo; BNE skip; INC hi`;
`dec` uses `LDA lo; BNE skip; DEC hi; DEC lo`.

### Zadania złożone

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

### Wydrukować

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

### Rozgałęzienie

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

`select expr` oblicza wyrażenie raz i porównuje je z każdą wartością `case` w
kolejności. Wykonywany jest pierwszy pasujący element case, a sterowanie
przechodzi do elementu po `end`. Opcjonalny element `else:` jest uruchamiany,
jeśli żaden element case nie będzie pasował. Wszystkie wartości muszą być
8-bitowe (0–255).

### Pętle

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

**Zasady kierunkowe dla `for`/`loop`:**

| Case                                                   | Zachowanie                                                                                                           |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| `for i = 1 to 10` (domyślnie `step +1`, `from ≤ to`)   | liczy się, standard                                                                                                  |
| `for i = 0 to 20 step 2` (krok pozytywny, `from ≤ to`) | liczy do 2                                                                                                           |
| `for i = 10 to 1 step -1` (ujemny stały krok)          | odlicza; ciało biegnie dla i = 10, 9, ..., 1                                                                         |
| `for i = 20 to 0 step -2` (do zera)                    | kończy się przy i = 0 po wykryciu niedomiaru ADC (C=0) po dekrementacji; brak pętli nieskończonej                    |
| `for i = 10 to 1` (bez kroku, `from > to`)             | **błąd kompilacji**: `for-loop: from (10) > to (1) with default step +1 loops 0 times — use 'step -1' to count down` |

Kompilator wybiera kodowanie gałęzi wyjściowej w czasie kompilacji na podstawie
znaku stałej `step`:

- Krok pozytywny (lub domyślny `+1`) → wyjście, gdy `var > to` (niepodpisany
  `CMP` + `BCC`/`BEQ` przejście do `JMP exit`).
- Ujemny stały krok → wyjście, gdy `var < to` (niepodpisany `CMP` + `BCS` do
  treści), **plus** post-inkrementacja `BCS loop_top ; JMP exit`, która
  wychwytuje zawijanie, gdy `var` spadnie poniżej 0. Ta dodatkowa para
  instrukcji sprawia, że `for i = N to 0 step -k` jest skończony.

Wartości `step` inne niż stałe (np. pochodzące ze zmiennej lub wyrażenia) są
traktowane jako dodatnie w czasie kompilacji. Jeśli potrzebujesz odliczania przy
użyciu wartości kroku wykonania, podziel pętlę lub użyj konstrukcji `while`.

### Etykiety i przejdź do

```basic
label main_loop
  x = x + 1
  if x < 10 then goto main_loop end
```

Przekazywanie `goto` (etykieta zdefiniowana później) jest w pełni obsługiwane.

`gosub label` / `return` przeskakują do etykiety i wracają (JSR / RTS na
poziomie kodu maszynowego). Etykieta musi być instrukcją `label name`, a nie
`sub` — nie ma parametrów i ma ten sam zakres zerowej strony. `gosub` obsługuje
odwołania do przodu (etykieta zdefiniowana po `gosub`).

```basic
gosub draw_border
...
label draw_border
  # ... draw something ...
  return               # RTS — returns to the instruction after gosub
```

### Podprogramy

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

Parametry są przekazywane przez dedykowane sloty zerowej strony. Brak rekurencji
(sloty są statyczne). Obsługiwane są parametry typizowane: `sub draw(x, y:int)`
lub `sub copy(src:string)` — parametry łańcuchowe otrzymują 2-bajtowy wskaźnik,
dzięki czemu obiekt wywoływany może indeksować łańcuch źródłowy za pomocą
`src[i]`.

### Funkcje (wartości zwracane)

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

Funkcje obsługują opcjonalny typ zwracany `: word` dla wartości 16-bitowych:

```basic
fn get_addr(): word
  return $C000
end

var ptr: word = get_addr()  # ptr = $C000
poke ptr, 42                 # STA (ptr),Y — valid indirect addressing
var v = peek(ptr)            # LDA (ptr),Y
```

`fn` jest emitowany w przebiegu 2 (tak samo jak `sub`), więc ciała funkcji nigdy
nie są wykonywane podczas uruchamiania. Odwołania do przodu są w pełni
obsługiwane.

### Tablice

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

**Tablice wielowymiarowe** (nowość w wersji 1.5.3)

Tablice mogą być deklarowane z więcej niż jednym wymiarem. Są przechowywane w
kolejności **wiersz-major** i indeksowane za pomocą listy indeksów dolnych
rozdzielonych przecinkami. Całkowity rozmiar jest iloczynem wszystkich wymiarów.

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

Układ wierszowo-główny oznacza, że ostatni indeks dolny jest ciągły: `grid[r,
c]` znajduje się na `base + r*COLS + c`. Obsługiwana jest dowolna liczba
wymiarów (`array(a, b, c)`). Gdy każdy indeks dolny jest stałą, adres jest
składany w czasie kompilacji do pojedynczego, absolutnego zapisu/ładowania;
indeks dolny zmiennej generuje obliczenia `row*stride + col` i indeksowany
dostęp `(ptr),Y`. Pojedynczy indeks dolny w tablicy wielowymiarowej jest nadal
dozwolony i traktowany jako indeks płaski/liniowy (`grid[10]`). Wymiary muszą
być stałymi czasu kompilacji (literałami lub `const`s), a tablica musi być
zadeklarowana przed indeksowaniem.

**Typy struktur (`type ... endtype`, nowość w wersji 1.5.4)**

Zdefiniuj stały układ nazwanych pól za pomocą `type`, a następnie przydziel
tablicę instancji w taki sam sposób, jak zwykłą tablicę. Dostęp do pola
wykorzystuje `arr[idx].field` i działa zarówno dla indeksów stałych, jak i
zmiennych.

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

Zasady i ograniczenia:

- Typy pól: `int` (1 bajt), `word` (2 bajty LE), `float` (2 bajty Q8.8). Pola
  `string` i zagnieżdżone `type` nie są jeszcze obsługiwane.
- Rozmiar elementu = suma szerokości pól (kolejność deklaracji, bez
  wypełnienia).
- Pamięć masowa znajduje się pod adresem `$C000+` obok zwykłych tablic i jest
  wyświetlana na mapie pamięci jako zwykła tablica o całkowitym rozmiarze w
  bajtach.
- Stały indeks → `LDA/STA absolute` w czasie kompilacji.
- Indeks zmiennej → mnożenie metodą przesunięcia i dodania dla `idx *
  elem_size`, a następnie dostęp indeksowany `(ptr),Y`. Rozmiary elementów
  będące potęgami dwójki (1, 2, 4, 8, 16) używają pustych łańcuchów `ASL A`;
  inne rozmiary emitują krótką sekwencję przesunięcia i dodania za pomocą dwóch
  zerowych bajtów strony.
- Parametry sub/fn typu struktury nie są jeszcze obsługiwane — zamiast tego
  należy przekazać tablicę i indeks, np. `sub move(idx: int) ... enemies[idx].x
  = ...`.
- Domyślne wartości pól (`var fire: int = 2` wewnątrz typu) są analizowane pod
  kątem zgodności z propozycją, ale nie są jeszcze inicjowane w momencie
  alokacji.
- W przypadku tablicy typu strukturalnego dozwolony jest tylko jeden indeks
  dolny. Tablice struktur wielowymiarowych nie są obsługiwane (należy użyć
  obliczonego indeksu płaskiego).

Zobacz `examples/type_demo.ub`.

### Zmienne 16-bitowe (słowne)

```basic
var ptr: word = $0400    # two ZP bytes: lo=$00 hi=$04
poke ptr, 6              # STA (ptr),Y
var v = peek(ptr)        # LDA (ptr),Y
```

### Grafika bitmapowa

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

Oba warianty `graphics on` wyłączają wyświetlacz (`LDA $D011 / AND #$EF / STA
$D011`) podczas przełączania rejestrów VIC, a następnie włączają go ponownie w
trybie docelowym — zapobiega to błędom przy przełączaniu trybu.

`x` może oznaczać pełny zakres `0–319`. Współrzędne powyżej 255 są obsługiwane
automatycznie (pomocnik dodaje dziewiąty bit X), więc `plot`, `line`, `circle` i
`rect` docierają do prawej krawędzi ekranu. Użyj zmiennej `word`, gdy
współrzędna X może przekroczyć 255.

#### Zatrudnia kolorowanie — `color pen`

W trybie hires (320×200) kolor jest **na komórkę 8×8**, przechowywany w macierzy
wideo (wysoki nibble = pierwszy plan, niski nibble = tło), a nie na piksel.
`color pen c` ustawia trwały kolor pierwszego planu (0–15), który `plot`,
`line`, `rect`, `circle` i `paint` wbijają w komórkę każdego narysowanego
piksela; nibble tła komórki jest zachowywany. Pozostaje on aktywny do następnego
`color pen`. Domyślnie jest to kolor biały (1), więc programy, które nigdy nie
wywołują `color pen`, wyglądają dokładnie tak samo jak wcześniej.

```basic
graphics on
gcls
color pen 2              # red
line 0, 0, 100, 100
color pen 6              # blue
circle 160, 100, 40
display on
```

#### Wielokolorowe kształty — `mline` / `mrect` / `mcircle`

W trybie wielokolorowym (`graphics on multi`, 160×200) każdy piksel wybiera
jedno z czterech źródeł kolorów za pośrednictwem wartości 2-bitowej (`%00` tło
`$D021`, `%01` ekran hi nibble, `%10` ekran lo nibble, `%11` pamięć kolorów).
`mplot` ustawia pojedynczy taki piksel; `mline`, `mrect` i `mcircle` rysują
kształty w ten sam sposób — końcowy argument `color` jest źródłem 2-bitowym
(0-3), a rzeczywiste kolory pochodzą z palety komórek (ekran/pamięć kolorów),
dokładnie tak samo jak w przypadku `mplot`.

```basic
graphics on multi
gcls
mcircle 80, 100, 40, 1
mrect 10, 10, 150, 190, 2
mline 0, 0, 159, 199, 3
display on
```

`mline`/`mrect`/`mcircle` wykorzystują ponownie te same procedury
Bresenham/punktu środkowego, co ich odpowiedniki hires, kreśląc każdy piksel
przez `mplot`; punkty poza ekranem (x ≥ 160 lub y ≥ 200) są pomijane.

### Podwójnie buforowana mapa bitowa (bez migotania)

```basic
graphics on double       # double-buffered hires bitmap (320×200)
gcls                     # clears the HIDDEN back buffer
line 0, 0, 319, 199      # all drawing (plot/line/circle/rect/paint/gcls) goes to the back buffer
flip                     # show the drawn buffer; redirect drawing to the other one
graphics off             # back to text mode (restores VIC bank 0)
```

`graphics on double` przechowuje **dwie** kompletne mapy bitowe i wyświetla
tylko ukończone klatki, eliminując migotanie bez żadnych sztuczek XOR — każdą
klatkę `gcls` rysujesz, a potem `flip`.

| Bufor                                | Mapa bitowa | Matryca wideo | Bank VIC | `$DD00` niskie bity |
| ------------------------------------ | ----------- | ------------- | -------- | ------------------- |
| A (przód, pokazany jako pierwszy)    | `$2000`     | `$0400`       | bank 0   | `%11`               |
| B (z tyłu, narysowany jako pierwszy) | `$6000`     | `$4400`       | bank 1   | `%10`               |

* Wszystkie polecenia pikseli zapisują dane za pomocą **bazy rysowania** (bazy
  zerowej strony) w czasie wykonywania, więc automatycznie trafiają do bufora,
  który jest aktualnie ukryty.
* `flip` czeka na dolną granicę (raster ≥ 251) przed przełączeniem banku VIC,
  dzięki czemu zamiana jest **bezstratna**, a następnie kieruje bazę rysowania
  do teraz ukrytego bufora.
* Typowa pętla: `gcls` → narysuj ramkę → `flip`. Wywołaj `display on` jeden raz
  po pierwszym `flip`, tak aby pierwszy wyświetlany bufor był już kompletny.

**Wymagania/ograniczenia:**
* Tylko zatrudnienie (nie `multi`). Obiekty sprite nie są pobierane z banku VIC
  bufora tylnego.
* Bufor tylny używa `$4000–$7FFF` (macierz `$4400`, mapa bitowa `$6000–$7FFF`),
  więc kod maszynowy programu musi znajdować się poniżej `$4400`. Większość
  wersji demonstracyjnych ma rozmiar zaledwie kilku KB, więc jest to
  automatyczne; bardzo duże programy nie mogą korzystać z podwójnego
  buforowania.
* W przypadku standardowego procesora C64 1 MHz wartość `gcls` (8 KB) na klatkę
  ogranicza liczbę klatek na sekundę; w przypadku Commodore 64 Ultimate wartość
  `speed` zapewnia płynną animację o dużej częstotliwości.

Zobacz `examples/cube_demo.ub` — obracającą się, trójwymiarową kostkę
szkieletową pozbawioną migotania.

### Grafika blokowa (80×50)

```basic
graphics on block        # 80×50 block-pixel mode (text mode + custom 4-pixel charset @ $2800)
graphics off             # return to text mode
gcls                     # clear block playfield: screen RAM $0400-$07FF + color RAM $D800-$DBFF

plot4 x, y               # set block pixel at (x, y);  x: 0-79, y: 0-49
plot4 erase x, y         # clear block pixel at (x, y)
circle4 x, y, r          # draw midpoint circle in block pixels; clips to 80×50
```

Gruby tryb niskiej rozdzielczości nałożony na standardowy tekst 40×25.
16-znakowy niestandardowy zestaw znaków skopiowany do `$2800` koduje siatkę
kwadrantową 2×2 na znak (bit3=TL, bit2=TR, bit1=BL, bit0=BR), więc każda komórka
tekstu mieści 2×2 piksele blokowe → efektywna siatka 80×50. Nie jest używana
pamięć RAM mapy bitowej (`$2000-$3FFF` pozostaje wolna), co czyni ją szybszą niż
użycie mapy bitowej hires. `plot4` OR umieszcza bit kwadrantu w komórce, tak aby
nakładające się piksele się kumulowały; `plot4 erase` go czyści. `circle4` używa
tego samego pomocniczego bloku pikseli do narysowania konturu okręgu w
przestrzeni współrzędnych 80×50. `gcls` czyści zarówno pamięć RAM ekranu, jak i
kolorów. Zobacz `examples/block_demo.ub`.

### Ekran i kolor

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

`lowercase` emituje `LDA #$0E; JSR $FFD2` w czasie wykonywania. Literały ciągu
skompilowane po `lowercase` mają automatycznie zamienioną wielkość liter —
wielkie znaki źródłowe są przechowywane w slocie małych liter PETSCII (`$61+`),
a małe znaki źródłowe w slocie wielkich liter (`$41+`) — więc `"Hello World"`
źródło wyświetla się na ekranie jako **Hello World**. `uppercase` emituje `LDA
#$8E; JSR $FFD2` i powraca do mapowania bezpośredniego. `cls` **nie** resetuje
trybu zestawu znaków.

`scroll x n` zapisuje `(n AND 7)` w bitach 0-2 `$D016` (zachowując bity 3-7).
`scroll x n narrow` zapisuje bity przewijania precyzyjnego i czyści `$D016` bit
3 (tryb 38-kolumnowy). `scroll x n wide` zapisuje bity przewijania precyzyjnego
i ustawia `$D016` bit 3 (tryb 40-kolumnowy). `scroll y n` zapisuje `(n AND 7)` w
bitach 0-2 `$D011` (zachowując bity 3-7). `scroll row R left` przesuwa ekran o
jeden stały wiersz w lewo; zapisuje nowy, skrajnie prawy znak za pomocą `screen
39, R, ch`. Przydatne do płynnego przewijania sprzętowego: zmniejsza każdą
klatkę od 7 w dół do 0, przesuwa pamięć RAM ekranu, resetuje do 7.

`screen col, row, char [, color]` zapisuje bezpośrednio do pamięci RAM ekranu
(`$0400 + row*40 + col`) i opcjonalnie do pamięci RAM kolorów (`$D800 + row*40 +
col`). Stała kolumna/wiersz: adres obliczany w momencie kompilacji.

### Ultimate 64 — prędkość procesora

```basic
speed 4              # set CPU to 4 MHz  (reads $D031, updates bits 0-3, writes back)
speed 48             # 48 MHz  (maximum speed on U64)
speed max            # same as speed 48  (alias)
speed off            # back to 1 MHz  (alias for speed 1)

badlines on          # enable badline timing  ($D031 bit 7 = 0, default C64 behaviour)
badlines off         # disable badline timing ($D031 bit 7 = 1, more CPU cycles)

var t = turbo()      # 1 if turbo is active (bits 0-3 of $D031 != 0), 0 if at 1 MHz
```

Dostępne wartości MHz: `1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 20, 24, 32, 40,
48`. Wartości stałe są zaokrąglane w dół do najbliższej dostępnej prędkości w
momencie kompilacji. Wartości zmiennych są traktowane jako surowy indeks
prędkości (0–15) i poddawane operacji OR na bitach 0–3 `$D031`.

| $D031 index | MHz (U64) | MHz (U64 Elite-II) |
| ----------- | --------- | ------------------ |
| 0           | 1         | 1                  |
| 3           | 4         | 4                  |
| 6           | 8         | 10                 |
| 11          | 20        | 24                 |
| 15          | 48        | 64                 |

Wymaga ustawienia **U64 Turbo Control** na `U64 Turbo Registers` lub `Turbo
Enable Bit` w menu konfiguracji U64. Na standardowym C64 lub emulatorze bez
rejestru, wartości `poke` do `$D031` są automatycznie ignorowane.

### Klawiatura

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

`mouse_x()` / `mouse_y()` wewnętrznie uruchamiają podprogram pomocniczy, który
obsługuje: ładowanie kondensatora CIA1 `$DC00`, opóźnienie ~516 cykli, odczyt
rejestru X/Y SID POT (`$D419`/`$D41A`), obliczenia delty 7-bitowej ze znakiem,
inwersję osi Y `EOR #$FF` oraz śledzenie skumulowanej pozycji (stały stan ZP, 8
bajtów). Program pomocniczy pobiera próbki z POT dwa razy na klatkę. `mouse_y()`
**NIE** wywołuje programu pomocniczego (tylko `mouse_x()`) — odczytuje on
jedynie z pamięci podręcznej `accum_y`, aby uniknąć podwójnej aktualizacji.

Pomocnik utrzymuje 9-bitowy akumulator X (`accum_x` + `accum_x_hi` z funkcją
carry/borrow). Użyj `var sx: word = mouse_x()` — kompilator przechowuje zarówno
bajty niskie, jak i wysokie, więc polecenie `sprite` poprawnie obsługuje `$D010`
dla pozycji X powyżej 255.

Program pomocniczy przechowuje swój stan w ZP (`$02`–`$09`). Flaga init musi być
zerowa przed pierwszym wywołaniem — wyzeruj obszar za pomocą `fill $02, 7, 0` na
początku programu. Wyłącz również przerwania CIA1 (`poke $DC0D, $7F`), aby
zapobiec kontaktowi przerwania IRQ KERNAL z `$DC00` podczas skanowania
klawiatury — zaburza to odczyt POT.

Zobacz `examples/mouse_demo.ub`, aby zobaczyć działającą demonstrację myszy 1351
ze śledzeniem sprite'ów i sprzężeniem zwrotnym przycisków.

### Wyjście

```basic
bye                      # JSR $E544 (clear screen), clear STOP flag, RTS to BASIC
exit                     # alias for bye
```

### Chronometraż

```basic
wait 50                  # wait 50 raster-line transitions (~3.2 ms)
wait raster 100          # spin until $D012 == 100 (raster-split effects)
delay 1                  # wait 1 PAL frame (1/50 s ≈ 20 ms)
delay 20                 # wait 20 frames ≈ 0.4 s; n can be a variable (0–255)
```

`delay N` zlicza N kompletnych ramek PAL używając linii rastrowej 200 jako
granicy ramki.

### Dźwięk SID

```basic
sound 0, $1CAD, 25       # voice 0, freq $1CAD (≈ middle C PAL), 25 frames duration
sound 1, freq_word, 50   # voice 1, freq from word var, 50 frames (1 s at 50 Hz)
sound 2, 0, 0            # voice 2, silence

sid volume 15            # master volume full ($D418 = $0F); range 0-15
sid volume 0             # silence (master volume = 0)
sid stop                 # zero all 25 SID registers ($D400–$D418) — complete silence
```

`sound <channel>, <freq>, <duration>` — czas trwania w ramkach PAL (po 1/50 s).
Naprawiono ADSR: atak/zanik `$09`, podtrzymanie/zwolnienie `$F0`, przebieg
piłokształtny. Głośność główna `$D418` zawsze ustawiona na `$0F`.

`sid volume N` zapisuje N do `$D418`. Bity 0-3 = głośność (0-15), bity 4-7 =
tryb filtrowania. `sid stop` emituje 10-bajtową pętlę wypełniania zerami —
szybszą niż 25 pojedynczych poke'ów.

### Odtwarzanie muzyki

`music play/stop/pause/resume` to zaawansowana alternatywa dla ręcznej
konfiguracji `sys sid_init` / `cia_timer`. Wymaga wcześniejszego użycia
instrukcji `load sid` (definiującej `sid_init` / `sid_play`).

```basic
load sid "tune.sid"         # embed SID file (defines sid_init / sid_play)

music play                  # initialise sub-tune 0 + start CIA1 50 Hz IRQ
music play 1                # start from sub-tune 1 (song number 0-based)
music stop                  # stop playback + zero all 25 SID registers ($D400-$D418)
music pause                 # disable CIA1 timer A IRQ (music freezes, SID unchanged)
music resume                # re-enable CIA1 timer A IRQ (continues from pause point)
```

| Oświadczenie     | Efekt                                                                                                          |
| ---------------- | -------------------------------------------------------------------------------------------------------------- |
| `music play [n]` | zadzwoń pod numer `sid_init(n)`, skonfiguruj timer CIA1 A na 19 656 cykli (~50 Hz PAL), zainstaluj wrapper IRQ |
| `music stop`     | wyłącz IRQ CIA1 + wyzeruj wszystkie 25 rejestrów SID                                                           |
| `music pause`    | wyłącz CIA1 IRQ (wyjście SID pozostaje zamrożone)                                                              |
| `music resume`   | ponownie włącz CIA1 IRQ (kontynuuj od punktu wstrzymania)                                                      |

Opakowanie IRQ (wyemitowane jednokrotnie na końcu programu) wykonuje następujące
czynności: ACK CIA1 timer A → `JSR sid_play` → `JMP $EA81`.

### Duszki

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

X obsługuje pełny zakres 9-bitowy (0–319): użyj zmiennej `word` dla wartości
czasu wykonania > 255. Wskaźnik danych sprite'a: `data_addr` musi być wyrównany
do 64 bajtów; przechowywany jako `addr >> 6` w `$07F8+id`.

#### Sprite animation with `sprite_frame`

`sprite_frame` to polecenie służące do zmiany wyświetlanego obrazu sprite'a
podczas animacji. Zmienia ono jedynie wskaźnik danych sprite'a; **nie** przesuwa
sprite'a, nie włącza go ani nie zmienia automatycznie klatek.

Przechowuj obrazy animacji kolejno, tak aby każdy 63-bajtowy obraz sprite'a
zajmował jeden 64-bajtowy slot. Przekaż klatkę animacji od zera jako trzeci
argument:

```basic
sprite_frame sprite_id, adres_pierwszej_klatki, numer_klatki
```

Na przykład, przy adresie bazowym `$2000`, klatka 0 używa `$2000`, klatka 1
używa `$2040`, klatka 2 używa `$2080` itd. Program kontroluje czas trwania i
zawijanie animacji:

```basic
var frame = 0
loop
  sprite_frame 0, $2000, frame
  frame = frame + 1
  if frame == 4 then frame = 0 end
  delay 5
end
```

Forma dwuargumentowa `sprite_frame id, address` po prostu wybiera jeden
statyczny obraz sprite'a i zachowuje wsteczną kompatybilność. Pozycja sprite'a
jest nadal kontrolowana przez `sprite id,x,y`.

### Kolizja ograniczająca oprogramowania

```basic
var touching = box_hit(left1, top1, right1, bottom1,
                       left2, top2, right2, bottom2)
```

`box_hit()` wykonuje test prostokąta ograniczającego wyrównanego z osią (AABB) i
zwraca `1`, gdy dwa prostokąty nachodzą na siebie lub się stykają, w przeciwnym
razie `0`. W przeciwieństwie do `sprite_hit()` i `sprite_bg_hit()`, nie
odczytuje ani nie czyści rejestrów kolizji VIC-II. Osiem argumentów to dowolne
wyrażenia 8-bitowe, więc pola mogą być mniejsze niż widoczna grafika sprite'a
lub opisywać obiekty gry inne niż sprite'y. Współrzędne są inkluzywne; zachowaj
`left <= right` i `top <= bottom`.

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

`sprdef id ... end` osadza 63 bajty sprite'ów pod kolejnym adresem 64-bajtowym w
segmencie kodu, emituje `JMP` nad nimi i automatycznie ustawia `$07F8+id =
data_addr >> 6`. Aby użyć tego samego kształtu dla wielu sprite'ów, odczytaj
wskaźnik:

```basic
var pg = peek($07F8)   # pointer set by sprdef 0
poke $07F9, pg         # copy to sprites 1–7
```

### Mapy kafelków postaci (`.ubmap`)

```basic
map load "levels/world.ubmap"
map draw map_x, map_y       # draw a 40x25 viewport to screen/color RAM

var tile = map_tile(x, y)   # read character code from the map
map set x, y, 42            # change character code in writable map data

var shade = map_color(x, y) # read cell color (0 when map has no color data)
map color x, y, 7           # change cell color when color data is present
```

`map load` rozwiązuje nazwę pliku względem pliku źródłowego `.ub`, weryfikuje ją
w czasie kompilacji i osadza tablice znaków i opcjonalne tablice kolorów w
zapisywalnej pamięci RAM programu. Późniejszy `map load` zastępuje aktywną mapę
dla kolejnych poleceń map.

`map load` akceptuje również bezpośredni eksport VisualAssembler `me-map`
`.bin`:

```basic
załadowanie mapy "map-multicolor.bin"
```

Pierwsze 1000 bajtów staje się mapą znaków 40×25, a kolejne 1000 bajtów kolorami
komórek. Tryb wielokolorowy i `$D021-$D023` są odczytywane z metadanych
VisualAssembler, więc konwersja `.ubmap` nie jest wymagana.

`map draw map_x, map_y` kopiuje obszar widoku 40×25, zaczynając od wskazanej
komórki mapy, do pamięci RAM ekranu `$0400` i, jeśli jest dostępna, do pamięci
RAM kolorów `$D800`. Mapa musi zawierać cały żądany obszar widoku: zachowaj
`map_x <= width-40` i `map_y <= height-25`. Współrzędne i wymiary są obecnie
8-bitowe (0–255).

Mapy normalne czyszczą bit wielokolorowy tekstu w `$D016`. Mapy wielokolorowe
ustawiają go i ładują trzy globalne kolory do `$D021`, `$D022` i `$D023`. Mapy
znaków zawierają kody znaków, a nie piksele zestawów znaków; połącz je z
`charset`/`chardef` lub inną metodą ładowania zestawów znaków. W trybie tekstu
wielokolorowego kolory komórek 8–15 wybierają znaki wielokolorowe zgodnie z
zasadami VIC-II.

#### Format binarny UBMP wersja 1

Wszystkie liczby całkowite wielobajtowe są w zapisie little-endian:

| Zrównoważyć |            Rozmiar | Oznaczający                                                                |
| ----------: | -----------------: | -------------------------------------------------------------------------- |
|           0 |                  4 | Magia ASCII `UBMP`                                                         |
|           4 |                  1 | Wersja, obecnie `1`                                                        |
|           5 |                  1 | Flagi: bit 0 = obecna tablica kolorów, bit 1 = tryb tekstu wielokolorowego |
|           6 |                  2 | Szerokość mapy: 1–255 komórek                                              |
|           8 |                  2 | Wysokość mapy, 1–255 komórek                                               |
|          10 |                  1 | Tło 0 (`$D021`), użyto niskiego skubania                                   |
|          11 |                  1 | Wielokolorowy 1 (`$D022`), użyto niskiego skubania                         |
|          12 |                  1 | Multicolor 2 (`$D023`), użyto niskiego skubania                            |
|          13 | szerokość×wysokość | Kody znaków głównych wierszy                                               |
|    następny | szerokość×wysokość | Opcjonalne zmiany koloru głównego wiersza, gdy ustawiony jest bit flagi 0  |

Plik UBMP musi mieć dokładną długość sugerowaną przez nagłówek. Nieprawidłowa
magia, wersja, wymiary lub długość powodują błąd kompilacji.

### Importowanie obrazu Koala Painter

```basic
koala load "pictures/title.kla"  # validate and embed at compile time
koala show                       # enter bitmap multicolor mode
koala hide                       # return to the default text display
```

`koala load` akceptuje standardowy plik Koala o rozmiarze 10003 bajtów (`$6000`
adres ładowania plus 10001 bajtów danych) lub surowy ładunek o rozmiarze 10001
bajtów. Ścieżki są względne do pliku `.ub`. Ładunek zawiera 8000 bajtów mapy
bitowej, 1000 bajtów ekranu, 1000 nibble'ów kolorów i jeden bajt koloru tła.

Kompilator zapisuje go pod adresem `$6000-$8710`. `koala show` kopiuje mapę
bitową do `$2000`, macierz ekranu do `$0400`, kolory do `$D800` i włącza
wielokolorowy tryb bitmapowy. `koala hide` czyści tryb bitmapowy/wielokolorowy i
przywraca domyślny układ tekstu.

Wygenerowany kod i funkcje pomocnicze muszą kończyć się poniżej `$2000`,
ponieważ wyświetlana mapa bitowa nadpisuje `$2000-$3F3F`; w przeciwnym razie
kompilator zgłasza błąd. Importu Koala nie można obecnie łączyć z `load sid` w
tym samym programie.

### Niestandardowy zestaw znaków

```basic
charset $3800            # set base address for chardef (default $3800)

chardef 65               # redefine character 65 ('A')
  $18,$3C,$66,$7E,$66,$66,$66,$00
end

chardef 66               # fewer than 8 bytes are zero-padded
  $7C,$66,$7C,$66,$7C
end
```

`charset base` ustawia adres docelowy używany przez wszystkie kolejne instrukcje
`chardef`. `chardef id ... end` osadza 8 bajtów w segmencie kodu (poprzedzonych
`JMP`, aby je pominąć), a następnie kopiuje je do `charset_base + id*8` w czasie
wykonywania. Wartości muszą być stałymi w czasie kompilacji; użyj `%` dla
literałów binarnych (`%00011000`).

Aby aktywować niestandardowy zestaw znaków w VIC-II, należy ustawić adres
generatora znaków za pomocą `$D018`:
```basic
charset $3800
chardef 1  $FF,$81,$81,$81,$81,$81,$81,$FF  end  # box border
poke $D018, $1A     # screen at $0400, charset at $3800 (bank 0)
```

### Pamięć

```basic
poke $D020, 2            # STA $D020
poke addr_var, 6         # STA (addr_var),Y  — if addr_var is word type
var v = peek($D012)      # LDA $D012
var v = peek(addr_var)   # LDA (addr_var),Y  — if addr_var is word type

var w: word = peek16($C000)   # read 16-bit little-endian: lo=$C000, hi=$C001
poke16 $0314, $EA81           # write 16-bit little-endian: lo→$0314, hi→$0315
poke16 ptr, w                 # word var as address; word var as value
```

`peek16(addr)` odczytuje dwa kolejne bajty (lo, hi) jako `word`. `poke16`
zapisuje lo, a następnie hi.

### Wejście/wyjście dysku

```basic
load "PROGRAM"           # KERNAL LOAD: loads file from device 8 to its native address
load "DATA", $C000       # loads file to a specific address
load "DATA", ptr         # addr from word variable

save "DATA", $C000, 4096 # KERNAL SAVE from $C000, 4096 bytes → device 8
save "PROG", start, len  # addr and len from word/int variables
```

`load` wywołuje KERNAL `SETNAM`+`SETLFS`+`LOAD` (`$FFBD`/`$FFBA`/`$FFD5`). Bez
adresu: adres pomocniczy 0 (własny 2-bajtowy nagłówek pliku używany jako adres
ładowania). Z adresem: adres pomocniczy 1 (plik ładowany do określonej
lokalizacji). `save` wywołuje `SETNAM`+`SETLFS`+`SAVE`
(`$FFBD`/`$FFBA`/`$FFD8`). Wymaga zarówno `addr`, jak i `len`.

### Muzyka SID

```basic
load sid "tune.sid"            # embed SID music at its native load address
load sid "tune.sid", $2000     # override: embed at $2000 regardless of SID header
```

`load sid` odczytuje plik PSID lub RSID w **czasie kompilacji**, usuwa nagłówek
i dołącza surowe bajty muzyczne do wyniku `.prg`. Po `load sid` dostępne stają
się dwie stałe kompilacji:

| Stały      | Opis                                                                                   |
| ---------- | -------------------------------------------------------------------------------------- |
| `sid_init` | Adres procedury inicjalizacji — wywołaj raz z A = numerem utworu (od 0)                |
| `sid_play` | Odtwórz adres rutyny — wywołaj każdą ramkę (50 Hz PAL) z programu obsługi przerwań IRQ |

Obie stałe działają wszędzie tam, gdzie akceptowany jest stały adres: `sys`,
`irq`, `poke`, wyrażenia.

**Typowe zastosowanie:**

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

**Uwagi:**
- Dane SID są umieszczane **po** każdym wygenerowanym kodzie, uzupełnione zerami
  aż do adresu ładowania. Kompilator ostrzega, jeśli adres ładowania SID będzie
  nachodził na wygenerowany kod.
- Obsługiwane są PSID v1 i v2. Jeśli adres ładowania nagłówka SID wynosi 0, jako
  adres używane są pierwsze dwa bajty danych (w stylu PRG, little-endian).
- Tylko jedno `load sid` na program jest znaczące (ostatnie wygrywa).

### Plik wejścia/wyjścia kanału szeregowego

```basic
open 1, 8, 2, "MYFILE"  # open logical file 1, device 8, secondary 2, name "MYFILE"
open 2, 4, 7             # open printer (device 4), no filename
open ch, dev, sec        # channel, device, secondary from variables

print# 1, "HELLO"        # send "HELLO"+CR to logical file 1
print# ch, x, "text"     # any mix of vars, strings — same as print but to file

close 1                  # close logical file 1
close ch                 # channel from variable
```

`open` wywołuje `SETNAM` ($FFBD) + `SETLFS` ($FFBA) + `OPEN` ($FFC0). Bez nazwy
pliku wywoływana jest funkcja SETNAM o długości 0. `print#` kieruje wyjście
przez `CHKOUT` ($FFC9), CHROUT według znaku (+ końcowy CR), a następnie `CLRCHN`
($FFCC). `close` umieszcza numer kanału w A i wywołuje `CLOSE` ($FFC3).

### Input

```basic
input score              # read up to 3 digits from keyboard → 8-bit int var
input "Name: ", name     # optional prompt string, then read line → string var
input "Score: ", score   # prompt + int input
```

`input` używa KERNAL BASIN (`$FFCF`) do blokowania i powtarzania sygnału
wejściowego z obsługą DEL.
- **Int var**: akceptuje tylko `0`–`9`, maks. 3 znaki; konwertuje na wartość
  8-bitową w CR.
- **Zmienna łańcuchowa**: akceptuje do 30 znaków; zapisuje jako łańcuch
  zakończony zerem; para ZP zostaje zaktualizowana.

### Zmiennoprzecinkowy / stałoprzecinkowy

Zmienne `float` korzystają z formatu stałoprzecinkowego Q8.8: wyższy bajt jest
częścią całkowitą (0–255), a niższy bajt jest częścią ułamkową (0/256 …
255/256).

```basic
var f: float = 3.5       # 3.5 → hi=3, lo=128 (= 0x0380)
var g: float = 0         # integer 0 is promoted to 0.0 automatically

f = 1.5                  # Q8.8 literal assignment
f = f + 1.5              # 16-bit Q8.8 arithmetic (result: 3.0)
f = f + g                # float + float

var n = int(f)           # extract integer part (hi byte) → 8-bit int
print f                  # prints as "N.DD" (e.g. 3.5 → "3.50", 1.25 → "1.25")
```

| Działanie          | Przykład             | Notatki                                           |
| ------------------ | -------------------- | ------------------------------------------------- |
| Dosłowny           | `3.5`, `0.25`, `1.0` | przeanalizowano jako Q8.8 w czasie kompilacji     |
| Promocja całkowita | `f = 5`              | przechowuje 5,0 (hi=5, lo=0)                      |
| Dodaj/subskrybuj   | `f + 1.5`, `f - g`   | 16-bitowa arytmetyka Q8.8                         |
| Wyodrębnij int     | `int(f)`             | zwraca wysoki bajt jako 8-bitową liczbę całkowitą |
| Wydrukować         | `print f`            | format „N.DD”, zawsze 2 cyfry ułamkowe            |

**Uwaga:** Przepełnienie arytmetyczne kończy się na 255,255 (brak nasycenia).
Mnożenie i dzielenie dwóch zmiennych zmiennoprzecinkowych nie jest jeszcze
obsługiwane — w takich przypadkach należy użyć `int()` + arytmetyki
całkowitoliczbowej.

### Funkcje matematyczne

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

### Funkcje łańcuchowe

```basic
var n = len(msg)         # length of null-terminated string var (0–255)
var c = asc(msg)         # PETSCII code of first character (0 if empty)
var c = asc("A")         # compile-time: constant PETSCII code
var n = val(s)           # runtime: parse decimal PETSCII string → 8-bit int (e.g. "042" → 42)
var c = msg[i]           # string character at index i: PETSCII code of msg[i]
msg[i] = c               # write PETSCII byte c to string at index i — STA (ptr),Y
msg[0] = 72              # constant index → LDY #0; STA (ptr),Y
```

### Formatowanie liczb

```basic
print hex(n)             # print as 2-digit uppercase hex
print bin(n)             # print as 8-bit binary string
print dec(n, 4)          # right-justified decimal in a field of 4 chars (e.g. 42 → "  42")
print dec(n, width)      # width can also be a variable
```

`dec(n, width)` uzupełnia liczbę po lewej stronie spacjami, aby wypełnić `width`
znakami. Jeśli liczba ma więcej cyfr niż `width`, jest drukowana bez dopełnienia
(bez obcinania). W kontekstach innych niż drukowanie `dec(n, w)` jest generowany
jako `n` bez zmian (tak samo jak `hex`/`bin`).

### REU (jednostka rozszerzenia pamięci RAM)

```basic
var ok = reu_present()   # 1 if REU detected, 0 if not (write/read test on $DF04)
var ok = reudet()        # alias for reu_present()

reu stash c64addr, bank, reu_addr, len  # copy C64 → REU
reu fetch c64addr, bank, reu_addr, len  # copy REU → C64
reu swap  c64addr, bank, reu_addr, len  # swap between C64 and REU
```

`reu_present()` wykonuje test zapisu/odczytu rejestru REU `$DF04`. Bez rejestru
REU zapis jest tracony (otwarta magistrala), więc odczyt jest inny — niezawodnie
wykrywa obecność, nie dotykając żadnego rejestru poleceń powodującego efekt
uboczny.

| Parametr   | Szerokość | Notatki                                                          |
| ---------- | --------- | ---------------------------------------------------------------- |
| `c64addr`  | 16-bit    | Start pamięci RAM C64 — stała, `word` var lub 8-bitowe wyrażenie |
| `bank`     | 8-bit     | Numer banku REU (0–7 dla jednostki 512 KB)                       |
| `reu_addr` | 16-bit    | Przesunięcie w banku REU                                         |
| `len`      | 16-bit    | Bajty do przesłania (`0` = 65 536 w sprzęcie REU)                |

Rejestry REU: polecenie `$DF01` (`$B0` stash / `$B1` fetch / `$B2` swap),
`$DF02–$DF03` adres C64, `$DF04–$DF05` offset REU, `$DF06` bank, `$DF07–$DF08`
długość. Transfer jest synchroniczny (procesor zatrzymany podczas DMA). Wymaga
prawdziwego REU lub VICE: **Ustawienia → Sprzęt → Moduł rozszerzeń pamięci
RAM**.

### Narzędzia pamięci

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

Zarówno `fill`, jak i `memcopy` obsługują długości 16-bitowe (0–65535). Użyj
zmiennych `word` dla długości > 255.

`drawmem src, dst, width, height, stride` kopiuje dwuwymiarowy blok prostokątny.
`src` jest odczytywany liniowo (wiersze spakowane); `dst` przesuwa się o
`stride` bajty między wierszami — użyj `40` ($28) dla ekranu C64 lub pamięci RAM
w kolorze (40 kolumn). Szerokość, wysokość i krok to wartości 8-bitowe. `src` i
`dst` mogą być stałymi, `word` zmiennymi lub wyrażeniami 8-bitowymi.

### Raster IRQ

```basic
irq my_handler           # raster IRQ at line 0, handler = sub name or address
irq my_handler, 100      # raster IRQ at raster line 100
irq $C800, 200           # handler at fixed address
irq addr_word            # handler address from a word variable
```

Konfiguruje przerwanie rastrowe IRQ za pomocą wektora programowego BASIC
(`$0314`/`$0315`): wyłącza przerwanie timera CIA1, potwierdza oczekujące
przerwanie VIC, zapisuje wiersz rastrowy do `$D012`, włącza przerwanie rastrowe
VIC (`$D01A=$01`), zapisuje adres obsługi i ponownie włącza przerwania.

Obsługa **musi** kończyć się znakiem `sys $EA81` (koniec IRQ KERNAL) — zwykły
`RTS` lub `RTI` uszkodzi stos. Najpierw potwierdź przerwanie VIC:

```basic
sub my_handler()
  poke $D019, $FF      # ACK VIC IRQ
  # ... work here ...
  sys $EA81            # JMP to KERNAL end-of-IRQ
end
```

Obsługiwane są odwołania do przodu (`irq my_handler` przed zdefiniowaniem
podelementu).

### Obsługa NMI

```basic
nmi my_nmi               # set NMI vector $0318/$0319 to handler sub or address

sub my_nmi()
  # ... NMI work here ...
  nmi_exit               # JMP $FE47 — proper NMI exit (restores A/X/Y + RTI)
end
```

`nmi handler` zapisuje adres handlera do wektora programowego NMI
(`$0318`/`$0319`). Sprzętowy wektor NMI pod adresem `$FFFA` wskazuje na
procedurę NMI KERNAL, która rozgałęzia się do `$0318`. Handler **musi** kończyć
się znakiem `nmi_exit` (emituje `JMP $FE47`) — użycie zwykłego `RTI` spowoduje
uszkodzenie stosu. Obsługiwane są odwołania do przodu.

### Przerwanie timera CIA1

```basic
cia_timer 19656, my_handler   # CIA1 timer A: fires every 19656 cycles (~50 Hz PAL)
cia_timer period, handler      # period can be a variable or expression
```

Konfiguruje timer CIA1 A jako okresowe źródło IRQ za pomocą wektora programowego
BASIC (`$0314`/`$0315`):
1. SEI — wyłącz przerwania
2. `$DC0D = $7F` — wyłącz wszystkie przerwania CIA1
3. Load 16-bit period lo→`$DC04`, hi→`$DC05`
4. Adres obsługujący wpisz do `$0314`/`$0315`
5. `$DC0D = $81` — włącz przerwanie IRQ A timera CIA1
6. `$DC0E = $01` — uruchom timer A w trybie ciągłym
7. CLI — ponowne włączenie przerwań

Obsługujący musi kończyć się znakiem `irq_exit` (lub `sys $EA81`) i powinien
potwierdzić przerwanie CIA1:

```basic
sub my_handler()
  poke $DC0D, $01      # ACK CIA1 timer A IRQ (read also clears it)
  # ... work here ...
  irq_exit             # JMP $EA81: restore A/X/Y + RTI
end
```

Taktowanie PAL: zegar = 985 248 Hz. Okres dla 50 Hz = 985 248 / 50 = 19 705
cykli ≈ `$4CC9`. Obsługiwane są odniesienia do przodu.

### Obsługa błędów

```basic
onerr goto err_handler   # set KERNAL I/O error vector ($0300/$0301) to a label

...

label err_handler
  print "I/O ERROR"
  bye
```

`onerr goto label` zapisuje adres etykiety (lo, hi) do lokalizacji KERNAL
`$0300` i `$0301`. W przypadku wystąpienia błędu wejścia/wyjścia KERNAL (np.
nieudanego `load` lub `open`), KERNAL wykonuje `JMP ($0300)`, co powoduje
przejście do etykiety. Obsługiwane są odwołania do przodu (etykieta zdefiniowana
po `onerr goto`).

### Osadzanie plików w czasie kompilacji

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

Wszystkie wartości `data` są zbierane w momencie kompilacji. 2-bajtowy wskaźnik
ZP jest automatycznie przydzielany i inicjowany na początku programu. Każde
`read` przesuwa wskaźnik do przodu.

### Montaż liniowy

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

**Tryby adresowania:**

| Składnia       | Tryb           | Bajty | Przykład                     |
| -------------- | -------------- | ----- | ---------------------------- |
| (bez operandu) | Ukryty         | 1     | `NOP`, `RTS`                 |
| `A`            | Akumulator     | 1     | `ASL A`, `LSR`               |
| `#value`       | Natychmiastowy | 2     | `LDA #$07`                   |
| `$zz` (0–255)  | Strona zerowa  | 2     | `LDA $50`                    |
| `$zz,X`        | ZP,X           | 2     | `LDA $50,X`                  |
| `$zz,Y`        | ZP,Y           | 2     | `LDX $50,Y`                  |
| `$xxxx`        | Absolutny      | 3     | `LDA $0400`                  |
| `$xxxx,X`      | Absolute,X     | 3     | `LDA $0400,X`                |
| `$xxxx,Y`      | Absolute,Y     | 3     | `LDA $0400,Y`                |
| `($xxxx)`      | Pośredni       | 3     | `JMP ($FFFC)`                |
| `($zz,X)`      | (pośrednio, X) | 2     | `LDA ($50,X)`                |
| `($zz),Y`      | (pośrednio), Y | 2     | `LDA ($50),Y`                |
| `label`        | Względny       | 2     | `BNE label` (tylko oddziały) |

- `$zz` (1–2 cyfry szesnastkowe, wartość ≤ 255) wybiera stronę zerową, jeśli
  instrukcja ją obsługuje; w przeciwnym razie następuje automatyczna
  aktualizacja do wartości bezwzględnej. Użyj `$00xx` (4 cyfry), aby wymusić
  wartość bezwzględną.
- Operandy rozgałęzienia są adresami bezwzględnymi; względne przesunięcie bajtu
  jest obliczane automatycznie.
- Etykiety lokalne (`name:`) są ograniczone do bloku `asm { }`. Rozgałęzienia do
  przodu są rozwiązywane w drugim przebiegu.
- `#<label` / `#>label` zwracają najniższy / najwyższy bajt adresu etykiety.
- `*` zwraca aktualny adres instrukcji, więc `JMP *` tworzy pętlę własną.
- Linie zaczynające się od `$`, `%` lub cyfry są emitowane jako surowe bajty
  (zachowując wsteczną kompatybilność).
- Komentarze wewnątrz `asm { }` zaczynają się od `;` lub `//` i kończą się na
  końcu wiersza. (`#` jest bezpośrednim prefiksem, a nie komentarzem.)

**Mieszanie `asm { }` z parametrami podprogramu**

Nazwy parametrów **nie są dostępne** w blokach `asm { }`. Użyj poleceń
UltimateBasic, aby przenieść wartości do znanych lokalizacji przed blokiem `asm
{ }`:

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

W przypadku procedur, których całe ciało składa się z kodu asemblera — zwłaszcza
procedur obsługi przerwań IRQ, które muszą się wzajemnie odwoływać — umieść
wszystkie procedury obsługi w **pojedynczym bloku najwyższego poziomu `asm {
}`** w programie głównym. Etykiety w tym samym bloku współdzielą zakres, więc
`irq1` i `irq2` mogą się swobodnie do siebie odwoływać. Zobacz
`examples/raster_irq_demo.ub`.

### Ciąg ↔ liczba całkowita

```basic
numstr score, $0340      # writes "042\0" at $0340 (always 3 digits, zero-padded)
var n = str_to_int("42") # compile-time: Expr::Number(42)

print str$(score)                # print 8-bit int as 3-digit decimal string ("000"–"255")
print "Score: " + str$(score)   # usable in string concat print context
var s: string = str$(n)          # assign str$() result to a string var (shared static buffer)
```

`str$(n)` konwertuje 8-bitową wartość na 3-znakowy ciąg dziesiętny (zawsze 3
cyfry z zerami na początku, np. `5` → `"005"`, `42` → `"042"`, `255` → `"255"`),
po którym następuje terminator null. Wskaźnik wyniku jest przechowywany w
trwałej parze ZP przydzielanej w momencie kompilacji.

> **Uwaga:** `str$(n)` używa pojedynczego, współdzielonego, 4-bajtowego bufora
> statycznego. Ponowne wywołanie `str$(n)` nadpisuje poprzedni wynik. Aby
> wyświetlić wiele wartości jednocześnie, użyj `numstr`, aby zapisać dane do
> oddzielnych adresów bezwzględnych.

## Przykłady

| Plik                                | Opis                                                                                      |
| ----------------------------------- | ----------------------------------------------------------------------------------------- |
| `examples/features.ub`              | const, label/goto, poke/peek, rnd, funkcje matematyczne                                   |
| `examples/new_features.ub`          | podparametry, tablice, zmienne słowne, zmienne łańcuchowe                                 |
| `examples/bitmap_demo.ub`           | Mapa bitowa 320×200, wykres, grafika włączona/wyłączona                                   |
| `examples/block_demo.ub`            | Grafika blokowa 80×50, plot4, circle4, grafika na bloku                                   |
| `examples/joystick_demo.ub`         | odczyt joysticka, ruch sprite'ów                                                          |
| `examples/mux_demo.ub`              | multiplekser sprite'ów rastrowych (3 okna × 8 sprite'ów = 24)                             |
| `examples/orbit_demo.ub`            | Orbita składająca się z 24 duszków, pulsującego promienia i losowych kolorów              |
| `examples/plasma_demo.ub`           | animacja bitmapy z efektem plazmy i obramowaniem paska rastrowego                         |
| `examples/sprite_data.ub`           | sprdef shape data (zawarte w innych demach)                                               |
| `examples/sprite_mux_orbit.ub`      | Demo orbity 24-sprite'ów z spredef + wstępnie obliczonymi pozycjami                       |
| `examples/sprite_orbit_demo.ub`     | 8 sprite'ów sprzętowych na orbicie kołowej za pomocą tabeli sin/cos                       |
| `examples/reu_bitmap_demo.ub`       | Schowek/pobieranie REU z grafiką bitmapową                                                |
| `examples/sid_music_demo.ub`        | Odtwarzacz muzyczny SID z rastrowym IRQ i wyjściem klawiatury                             |
| `examples/tenprint.ub`              | 5 implementacji labiryntu TENPRINT z menu; demonstracje trybu zestawów znaków `lowercase` |
| `examples/countdown_demo.ub`        | Odliczanie `for..next` z krokiem ujemnym, w tym `for i = 20 to 0 step -2`                 |
| `examples/countdown_errors_demo.ub` | Błąd kompilacji dla kroku domyślnego `from > to`                                          |
| `examples/explicit_demo.ub`         | `--explicit` Demo flagi CLI z w pełni wpisanymi `var`, `sub`, `fn`                        |
| `examples/explicit_errors_demo.ub`  | Luźny kod, który kompiluje się bez `--explicit`, powodując błędy                          |

## Odniesienie do interfejsu wiersza poleceń

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

### Eksport CRT

Ultimate Basic potrafi również zapisać obraz kartridża Magic Desk typu 19, gdy
nazwa pliku wyjściowego kończy się na `.crt`:

```bash
ub build demo.ub -o demo.crt
```

Kompilator opakowuje wygenerowany PRG w kontener CRT z bankiem, używając tego
samego układu, co eksport CRT w VisualAssemblerze: 64-bajtowy nagłówek
kartridża, obraz Magic Desk o rozmiarze 8×8 KB oraz bootloader w banku 0, który
kopiuje ładunek PRG do pamięci RAM C64 przed przejściem do punktu wejścia
programu. Ścieżki `.prg` i `.d64` nadal działają jak poprzednio.

### Tryb jawny

Przekaż `--explicit`, aby wymusić, aby każda strona deklaracji zawierała
adnotację `:type`:

```bash
ub build game.ub --explicit
```

Bez tej flagi Ultimate Basic akceptuje zarówno `var x = 5` (typ wywnioskowany z
inicjatora lub domyślnie `int`), jak i `var x: int = 5`. Z tą flagą kompiluje
się tylko forma z adnotacjami — forma luźna staje się błędem kompilacji.

**Co wymusza:**

| Formularz deklaracji                                              | Bez `--explicit`            | Z `--explicit`                     |
| ----------------------------------------------------------------- | --------------------------- | ---------------------------------- |
| `var name = expr` (nie `:type`)                                   | ok — typ wywnioskowany      | błąd                               |
| `var name: int = expr` (lub słowo/liczba zmiennoprzecinkowa/ciąg) | OK                          | OK                                 |
| `var arr = array(N)`                                              | ok — domyślnie `array`      | ok — bez zmian                     |
| `var arr = array_word(N)`                                         | ok — domyślnie `array_word` | ok — bez zmian                     |
| `const NAME = value`                                              | OK                          | ok — bez zmian                     |
| `sub foo(a, b)` (parametry nieokreślone)                          | OK                          | błąd na każdy nietypowany parametr |
| `sub foo(a: int, b: int)`                                         | OK                          | OK                                 |
| `fn foo(a): int` (parametr nieokreślony)                          | OK                          | błąd w parametrze                  |
| `fn foo(a: int): int`                                             | OK                          | OK                                 |

Deklaracje stałych i tablic są zawsze akceptowane — ich typ jest ustalony w
formie deklaracji, więc `:type` byłoby zbędne.

**Przykładowy wynik błędu:**

```
$ ub build myprog.ub --explicit
Compilation errors:
  line 14: 'explicit' mode: 'var loose' has no type — use 'var loose: int|word|float|string'
  line 16: 'explicit' mode: parameter 'a' has no type — use 'a: int|word|float|string'
```

Flaga to przełącznik w czasie kompilacji — nic w kodzie źródłowym nie musi być
zmieniane, aby włączyć lub wyłączyć tę opcję. Dodaj ją do pliku Makefile/skryptu
kompilacji, aby wymusić styl typizowany w całym projekcie, lub usuń ją w
skryptach eksploracyjnych. Zobacz `examples/explicit_demo.ub` i
`examples/explicit_errors_demo.ub`.

### Pliki debugowania

Użyj `--debug`, aby wygenerować symbole debugera razem z programem:

```bash
ub build demo.ub --debug
```

Kompilator zapisuje pliki obok `.prg`, korzystając z kodu źródłowego pliku
wyjściowego:

| Plik       | Format i cel                                                                                      |
| ---------- | ------------------------------------------------------------------------------------------------- |
| `demo.sym` | Źródło symboli zgodne z KickAssemblerem, nadające się do importowania do źródła asemblera         |
| `demo.dbg` | Zrzut debugowania C64Debugger/RetroDebugger KickAssembler zawierający segment programu i etykiety |
| `demo.vs`  | Plik poleceń monitora VICE zawierający polecenia `al` dla etykiet adresowych                      |

Wszystkie trzy eksporty obejmują `program_start`, `program_end`, zmienne,
tablice, podprogramy i etykiety BASIC-a znane po wygenerowaniu kodu. Na
przykład, załaduj symbole VICE za pomocą opcji wiersza poleceń `-moncommands
demo.vs` lub polecenia monitora `ll "demo.vs"`.

Obecny eksport `.dbg` zawiera informacje o segmentach i symbolach adresowych.
Nie zawiera on jeszcze mapowań instrukcji na wiersze źródłowe dla kroków na
poziomie źródła.

### Lista kodu generatora zestawu (nowość w wersji 1.5.2)

Użyj `--asm`, aby zapisać czytelną listę źródłową 6502 obok PRG:

```bash
ub build demo.ub --asm
```

For an output named `demo.prg`, this creates `demo.asm`. The listing is produced
from metadata collected while Ultimate Basic generates the machine code; it is
not merely a disassembly of the completed PRG. It contains:

- `; UB:` komentarze oznaczające generowany zakres bajtów każdego emitującego
  polecenia UB;
- nazwane stałe dla zmiennych zerowej strony i tablic `$C000+`, łącznie z ich
  typami/rozmiarami;
- ostateczne nazwy i adresy podprogramów i etykiet BASIC;
- wygenerowano etykiety `loc_xxxx` dla gałęzi względnych i celów w programie
  `JMP`/`JSR`;
- normalne mnemoniki i operandy 6502, z podstawionymi symbolami kompilatora, tam
  gdzie są znane;
- dokładny adres C64 i emitowane bajty obok każdej instrukcji;
- wygenerowane przez kompilator funkcje pomocnicze i osadzony kod w ich
  ostatecznej kolejności w pamięci;
- Wyjście `.byte` dla bajtów, które nie są dekodowane jako obsługiwane
  instrukcje 6502.

Funkcje pomocnicze kompilatora otrzymują nazwy opisowe, takie jak
`ub_helper_plot`, `ub_helper_line_erase`, `ub_helper_print_hex` i
`ub_helper_music_irq`. Znane dane osadzone – w tym polecenia `data`, tablice
znaków/kolorów map, definicje sprite'ów i znaków, tabela sinusów, nazwy plików
ładowania, pliki `incbin`, muzyka SID i ładunki Koala – są emitowane jako
nazwane regiony `.byte`. Długie, wypełnione zerami przerwy adresowe korzystają z
dyrektywy `.fill` programu KickAssembler.

Przykładowy fragment:

```asm
.label x                 = $02 ; int

* = $080D

ub_start:
    cld                         ; $080D: D8
    ; UB: var x
    lda  #$01                   ; $080E: A9 01
    sta  x                      ; $0810: 85 02
```

Komentarze dotyczące adresów/bajtów ułatwiają porównanie listingu z `.prg`.
Wyjście wykorzystuje składnię KickAssembler (`.label`, `.byte`, `.fill` i `* =
origin`), dzięki czemu można je ponownie złożyć; komentarze w kodzie maszynowym
nie mają wpływu na wynik.

`--add` wymaga `--d64`. Skompilowany program `.ub` jest zawsze pierwszym plikiem
na dysku; każdy plik `--add` jest dopisywany po nim. Nazwy plików na dysku
pochodzą z rdzenia pliku źródłowego i są pisane wielkimi literami (np.
`music.prg` → `MUSIC`).

Po pomyślnym skompilowaniu kompilator zawsze drukuje mapę pamięci:

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

W przypadku `-v` na wyjściu dodatkowo pokazywane są wewnętrzne przydziały ZP i
pełny zrzut szesnastkowy.

## Znane ograniczenia

| Funkcja                               | Ograniczenie                                                                                                                                                                                    |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Arytmetyka liczb całkowitych          | 8-bitowe bez znaku (0–255); `word` zmienne przechowują wartości 16-bitowe                                                                                                                       |
| Podprogramy                           | Brak rekurencji — sloty parametrów ZP są przydzielane statycznie                                                                                                                                |
| Zmienne łańcuchowe                    | Read-only after init; assignment replaces the pointer, not the data                                                                                                                             |
| Czas wykonania łączenia ciągów        | `s1 + s2` drukuje sekwencyjnie — bez przydzielania pamięci na stercie ani śledzenia długości                                                                                                    |
| `rnd()` / `rnd(n)`                    | Prosty LCG, niekryptograficzny; okres = 256                                                                                                                                                     |
| `abs()` / `sgn()` / `min()` / `max()` | Tylko wartości 8-bitowe; `abs`/`sgn` traktuj wartości jako wartości ze znakiem (bit 7 = ujemny → `abs` uzupełnienia do dwóch, `sgn` zwraca `$FF`); `min`/`max` są wartościami bez znaku (0–255) |
| `plot`                                | Piksele poza zakresem są bezgłośnie przycinane (Y ≥ 200 lub X ≥ 320 → brak operacji)                                                                                                            |
| `mplot`                               | Brak sprawdzania granic — x musi mieścić się w przedziale 0–159, y musi mieścić się w przedziale 0–199                                                                                          |
| `mline` / `mrect`                     | Wielokolorowy; x: 0–159, y: 0–199. Zawijanie pikseli poza ekranem (bez przycinania) — utrzymuj współrzędne w zakresie                                                                           |
| `mcircle`                             | Wielokolorowy; przycina punkty poza ekranem (x ≥ 160 lub y ≥ 200 są pomijane)                                                                                                                   |
| `color pen`                           | Tylko do wynajęcia; ustawia fragment pierwszego planu dotkniętych komórek (tło zachowane). Nie ma efektu w trybie blokowym (`plot4`/`circle4`)                                                  |
| `rect`                                | Brak sprawdzania granic — x: 0–319, y: 0–199; x1≤x2 i y1≤y2 nie są wymuszane (prostokąty zdegenerowane/odwrócone generują niezdefiniowane dane wyjściowe)                                       |
| `plot4`                               | Brak sprawdzania granic — x musi być w zakresie 0–79, y musi być w zakresie 0–49 (tryb blokowy)                                                                                                 |
| `circle4`                             | Przycina piksele bloków poza ekranem; użyteczny promień wynosi około 0–49 w trybie bloku 80×50                                                                                                  |
| `chr$`                                | Brak mapowania PETSCII↔ASCII — n jest przekazywane bez zmian do CHROUT                                                                                                                          |
| `music play`                          | Wymaga `load sid`; emitowany jest tylko jeden wrapper CIA1 (ostatni `music play` wygrywa)                                                                                                       |
| `graphics on double`                  | Tylko wynajem; używa `$4000–$7FFF` jako bufora tylnego, więc kod programu musi znajdować się poniżej `$4400`; nie można łączyć ze sprite'ami ani obiektami wielokolorowymi                      |
| Raportowanie błędów                   | Tylko w czasie kompilacji; `onerr goto` obsługuje błędy wejścia/wyjścia KERNAL w czasie wykonywania                                                                                             |
