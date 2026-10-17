# Ultimate Basic v1.6.5 — Podręcznik językowy

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
var x = 10 # 8-bitowa liczba całkowita (domyślna)
var ptr: word = $0400 # 16-bit — dwa bajty strony zerowej, możliwe do wykorzystania jako adres 16-bitowy
var f: float = 3.5 # Q8.8 stałoprzecinkowy — hi byte = integer, lo byte = fraction
var msg = "HELLO" # zmienna typu string (wskaźnik do wbudowanych danych PETSCII)
var s: string = "TEXT" # ciąg znaków o jawnym typie
var scores = array(10) # tablica bajtów, 10 elementów przechowywanych w $C000+
var moments = array_word(8) # tablica słów, 8 elementów słów przechowywanych w $C000+
const BORDER_ADDR = $D020 # stała w czasie kompilacji (podstawiona wbudowana, bez slotu ZP)
```

Słowa kluczowe i identyfikatory **nie uwzględniają wielkości liter**: `PRINT`,
`Print` i `print` są prawidłowe.

| Typ                       | Szerokość            | Notatki                                                                                             |
| ------------------------- | -------------------- | --------------------------------------------------------------------------------------------------- |
| `int`                     | 8-bit                | domyślne dla literałów liczbowych                                                                   |
| `słowo`                   | 16-bit               | dwa bajty ZP; można ich używać jako adresu w `poke`/`peek`                                          |
| `zmiennoprzecinkowy`      | 16-bitowy Q8.8       | hi byte = część całkowita (0–255), lo byte = część ułamkowa                                         |
| `pojedynczy` / `podwójny` | 5 bajtów, pamięć RAM | zmiennoprzecinkowy (format C64 BASIC, ~9 cyfr) — `wymiar x jako double`; patrz *Zmiennoprzecinkowy* |
| `ciąg`                    | wskaźnik             | Para ZP → PETSCII zakończony zerem w segmencie kodu                                                 |
| `tablica(N)`              | N bajtów             | elementy bajtu; znajdują się pod adresem `$C000+`, a nie w ZP                                       |
| `tablica_słow(N)`         | N×2 bajtów           | elementy słowa (16-bitowe); znajdują się pod adresem `$C000+`, a nie w ZP                           |
| `tablica(R, C, …)`        | ∏przyciemnia bajty   | wielowymiarowy (główny wiersz); indeks `arr[r, c]`                                                  |
| `tablica_słow(R, C, …)`   | ∏dims×2 bajty        | wielowymiarowa tablica słów (wiersz-major)                                                          |

#### Deklaracje w stylu BASIC-a: `dim … as …`

`dim name as type` to alternatywna pisownia `var name: type` — ta sama pamięć,
ten sam kod:

```basic
DIM kor AS INTEGER # 16-bitowa liczba ze znakiem, zaczyna się od 0
DIM nev AS STRING # ciąg znaków, zaczyna się od ""
DIM fizetes AS DOUBLE # liczba zmiennoprzecinkowa, zaczyna się od 0
DIM x, y AS BYTE # kilka nazw, wszystkie mają ten sam typ
DIM pont AS INTEGER = 1000, cim AS STRING = "C64" # inicjatory, typy mieszane
```

| `jak …`                  | Ostateczny podstawowy typ                                                                                |
| ------------------------ | -------------------------------------------------------------------------------------------------------- |
| `bajt`, `int`            | `int` (8-bitowy, 0–255)                                                                                  |
| `liczba całkowita`       | 16-bitowy ze znakiem (−32768 … 32767) — QBasic INTEGER                                                   |
| `słowo`                  | `słowo` (16-bitowe bez znaku, 0–65535)                                                                   |
| `pojedynczy`, `podwójny` | zmiennoprzecinkowa, 5 bajtów w pamięci RAM (±2,9·10⁻³⁹ … 1,7·10³⁸, ~9 cyfr) — patrz *Zmiennoprzecinkowa* |
| `zmiennoprzecinkowy`     | `float` (stały punkt Q8.8 — 0–255,99, szybki)                                                            |
| `ciąg`                   | `ciąg`                                                                                                   |

- Bez `= wartość` liczby zaczynają się od 0, a ciągi znaków od `""`.
- `dim a, b jako integer` nadaje **obie** nazwie typ (styl VB.NET, nie QBasic).
  Tylko jedna nazwa może mieć inicjator.
- `as` i nazwy typów języka BASIC są słowami kontekstowymi, a nie
  zarezerwowanymi — można ich używać jako nazw.
- Nieobsługiwane: `as long`, typy struktur (użyj `var name: TName = array(N)`) —
  błędy kompilacji.
- W przypadku `--explicit`, `dim` bez `as` jest błędem.
- Przypisanie ciągu ma semantykę wartości: `s = "TEKST"` wskazuje na literał, `t
  = s`, a obliczone wartości są kopiowane do bufora `t` (patrz *Ciągi w czasie
  wykonywania*). Przed wersją 1.6.3, `s = "TEKST"` po deklaracji zapisywał bajt
  śmieci we wskaźniku.

#### Tablice z `dim`: `dim name(u1, u2, …) jako type`

```basic
DIM tabla(2, 3) AS INTEGER ' 3 × 4 elementy: tabla(0..2, 0..3)
DIM kocka(1, 2, 3) AS BYTE ' dowolna liczba wymiarów
DIM ar(9) AS DOUBLE ' 10 wartości zmiennoprzecinkowych (po 5 bajtów każda)
DIM nevek(4) AS STRING ' 5 ciągów znaków, wszystkie zaczynają się od ""
DIM v(9) ' bez AS → tablica bajtów

tabla(2, 3) = 999 ' Indeks w stylu QBasic z ( )
tabla[2, 3] = 999 ' … lub zwykłe [ ]
nevek(0) = "ZSOLT"
PRINT tabla(2, 3); " "; nevek(0); " "; ar(1)
```

- Każde ograniczenie jest **najwyższym indeksem** (zasada BASIC): `dim t(2, 3)`
  ma 3 × 4 elementy. (`var t = array(3, 4)` pobiera liczbę elementów — ta sama
  tablica.)
- Typy elementów: `bajt`/`int` → 1 bajt, `liczba całkowita` (ze znakiem) /
  `słowo` → 2 bajty, `liczba zmiennoprzecinkowa` → 2 bajty Q8.8,
  `pojedyncza`/`podwójna` → 5 bajtów zmiennoprzecinkowych, `ciąg` → wskaźnik
  2-bajtowy. Granice muszą być stałymi czasu kompilacji. Tablice znajdują się w
  `$C000-$CFFF` (4 KB); gdy potrzeba więcej, cały obszar tablicy przesuwa się do
  `$A000-$CFFF` (12 KB, w pamięci ROM BASIC — patrz *Pamięć tablicy*).
  Przekroczenie 12288 bajtów powoduje błąd kompilacji.
- Elementy tablicy ciągów zaczynają się jako `""`; `nevek(i) = "TEKST"` / `= s`
  / `= a + b`, `n = nevek(i)`, drukowanie, `+`, przekazywanie do parametru
  `ciągu` i `wejścia nevek(i)` działa (wartości nieliterałowe są kopiowane do
  slotu 31 znaków na element).
- Indeksowanie `name(i)` działa również dla tablic zadeklarowanych za pomocą
  `var a = array(…)`.
- Jedna tablica na grupę `dim`: `dim a(3) jako bajt, n jako liczba całkowita`
  jest w porządku, `dim n, a(3) jako liczba całkowita` jest błędem. Brak
  inicjatora — użyj `nazwy danych: …`.

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

**Muzyka** `tune` (blok słów kluczowych; linie wewnątrz - `speed`, `inst`,
`order`, `pat` - nie są zarezerwowane)

**Typy i pokrewne typy** `int`, `word`, `float`, `string`, `array`, `array_word`

**Drukuj i we/wy** `drukuj`, `spc`, `tab`, `w`, `wejście`, `chr$`, `str$`,
`hex`, `bin`, `otwórz`, `zamknij`, `ładuj`, `zapisz`, `łańcuch`, `data`, `read`,
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

**Sprite** `sprite`, `sprdef`, `sprite_frame`, `sprite_x`, `sprite_y`, `sprhit`,
`sprbghit`, `box_hit`, `chardef`, `charset`, `org`, `expand`, `priority`

**Dźwięk i muzyka** `sid`, `sound`, `sfx`, `volume`, `music`, `play`, `pause`,
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

| Skryty                                                 | Sugerowana zmiana nazwy                          |
| ------------------------------------------------------ | ------------------------------------------------ |
| `koniec`                                               | `stop_w`, `zakończ`, `ostatni`                   |
| `zatrzymaj`                                            | `zatrzymaj się`, `zatrzymaj`                     |
| `razy`                                                 | `liczba`, `n`, `itry`                            |
| `ekran`                                                | `scraddr`, `adres_ekranu`                        |
| `obramowanie`, `tło`, `tekst`                          | `adres_granicy`, `kolumna_tła`, `kolumna_tekstu` |
| `zacisk`                                               | `cap`, `bound`                                   |
| `linia`, `okrąg`, `prostokąt`                          | `ln`, `circ`, `box_r`                            |
| `dane`, `odczyt`                                       | `bajtów`, `następny_bajt`                        |
| `ładowanie`, `zapisywanie`, `otwieranie`, `zamknięcie` | `załaduj_plik`, ...                              |
| `mapa`, `pokaż`, `ukryj`                               | `mapa kafelków`, `ujawnienie`, `ukrycie`         |
| `odtwórz`, `pauza`, `wznów`, `zatrzymaj`, `głośność`   | `odtwórz_piosenkę`, `głośność`                   |
| `int`, `float`, `słowo`, `ciąg`                        | `n_int`, `speed_f`, `adres`, `wiadomość`         |

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
z = x i 15 # bitowe AND
w = a lub b # bitowe LUB
v = a xor b # bitowe XOR
m = x shl 3 # przesunięcie w lewo
n = x shr 2 # przesunięcie w prawo
r = x mod 40 # 8-bitowy modulo (reszta); x mod 0 = x, x / 0 = 255
b = bwęzeł x # bitowe NOT: x XOR 255 (uzupełnienie wszystkich 8 bitów)
```

Porównania: `==` `!=` `<` `>` `<=` `>=` (zwróć 1/0)

Kod arytmetyczny (1.6.0): `*` przez stałą kompiluje się do przesunięć/dodawania
z przesunięciem (`x * 8` → 3× `ASL`), w przeciwnym razie do pętli dodawania z
przesunięciem o maksymalnie 8 rundach. `/` i `mod` przez potęgę dwóch to `LSR` /
`AND #(n-1)`, w przeciwnym razie do 8-rundowej pętli przesunięcia z
odejmowaniem, której czas wykonania nie zależy już od ilorazu. Dzielenie przez
zero jest zdefiniowane: `x / 0 = 255`, `x mod 0 = x` (przed wersją 1.6.0
zawieszało się). `x = x + 1` / `x = x - 1` (i ±2) kompiluje się do `INC` /
`DEC`.

### Zwiększanie/zmniejszanie

```basic
inc x # x = x + 1 (INC zp — pojedyncza instrukcja)
dec x # x = x - 1 (DEC zp — pojedyncza instrukcja)
```

W przypadku zmiennych `słowo` przenoszenie jest obsługiwane: `inc` używa `INC
lo; BNE skip; INC hi`; `dec` używa `LDA lo; BNE skip; DEC hi; DEC lo`.

### Zadania złożone

```basic
x += 5 # x = x + 5
x -= 3 # x = x - 3
x *= 2 # x = x * 2
x /= 4 # x = x / 4
x i = 15 # x = x i 15 (bitowe AND)
x lub = 64 # x = x lub 64 (bitowe OR)
x xor = 255 # x = x xor 255 (bitowe XOR)
x shl = 2 # x = x shl 2
x shr = 1 # x = x shr 1
```

### Wydrukować

```basic
drukuj "CZEŚĆ"
drukuj x
drukuj x, y, "tekst"
drukuj # pusty wiersz

drukuj spc(5) # drukuj 5 znaków spacji
drukuj tab(20), "WARTOŚĆ" # przenieś kursor do kolumny 20, a następnie drukuj
drukuj "A", spc(3), "B" # dowolnie mieszaj

drukuj "A=" + a # ciąg + zmienna numeryczna
drukuj s1 + s2 # dwie zmienne łańcuchowe → sekwencyjny wydruk
drukuj "Witaj " + "Świecie" # dwa literały → składanie w czasie kompilacji
drukuj chr$(13) # drukuj za pomocą kodu PETSCII
```

### chr$

```basic
print chr$(65) # wyjściowa wartość znaku o kodzie PETSCII 65 ('A')
var c = chr$(n) # zapisz wartość bajtu n w zmiennej c
print "&gt;" + chr$(42) # możliwe do użycia w połączeniu ciągu znaków
```

### Rozgałęzienie

```basic
jeśli x == 1 to
wydrukuj "TAK"
w przeciwnym wypadku
wydrukuj "NIE"
koniec
```

### Wybierz / Sprawa

```basic
wybierz x
przypadek 1:
wydrukuj "JEDEN"
przypadek 2:
wydrukuj "DWA"
w przeciwnym razie:
wydrukuj "INNE"
koniec
```

`select expr` oblicza wyrażenie raz i porównuje je z każdą wartością `case` w
kolejności. Wykonywany jest pierwszy pasujący element case, a sterowanie
przechodzi do elementu po `end`. Opcjonalny element `else:` jest uruchamiany,
jeśli żaden element case nie będzie pasował. Wszystkie wartości muszą być
8-bitowe (0–255).

### Pętle

```basic
pętla 5 # pętla zliczana (5 iteracji)
drukuj "HI"
koniec

razy 5 # alias dla pętli N ... koniec
drukuj "HI"
koniec

pętla # pętla nieskończona
x = x + 1
jeśli x == 5, kontynuuj koniec # przejdź do następnej iteracji
jeśli x == 100, przerwij koniec
koniec

zmienna i = 0
dla i = 1 do 10 # dla..następny (preferowane)
jeśli i == 5, kontynuuj koniec # przejdź do zwiększenia kroku
drukuj i
następny

dla i = 0 do 20 krok 2
drukuj i
następny i # nazwa zmiennej po „następny” jest opcjonalna

dla i = 10 do 1 krok -1 # odliczanie w dół — obsługiwany jest ujemny stały krok
drukuj i
następny

dla i = 20 do 0 krok -2 # kończy się poprawnie przy i = 0 (11 iteracji)
drukuj i
następny i

zmienna i = 0
pętla i = 1 do 10 # starsza pętla..koniec składni — identyczny kod
drukuj i
koniec

podczas gdy x &lt; 100
x = x + 1
koniec

powtórz # do-while: ciało działa co najmniej raz
x = x + 1
aż x == 100 # kończy działanie, gdy warunek jest prawdziwy
```

**Zasady kierunkowe dla `for`/`loop`:**

| Sprawa                                                 | Zachowanie                                                                                                           |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| `for i = 1 to 10` (domyślnie `step +1`, `from ≤ to`)   | liczy się, standard                                                                                                  |
| `for i = 0 to 20 step 2` (krok pozytywny, `from ≤ to`) | liczy do 2                                                                                                           |
| `for i = 10 to 1 step -1` (ujemny stały krok)          | odlicza; ciało biegnie dla i = 10, 9, ..., 1                                                                         |
| `for i = 20 to 0 step -2` (do zera)                    | kończy się przy i = 0 po wykryciu zawinięcia poniżej 0 po dekrementacji; brak pętli nieskończonej                    |
| `for i = 10 to 1` (bez kroku, `from > to`)             | **błąd kompilacji**: `for-loop: from (10) > to (1) with default step +1 loops 0 times — use 'step -1' to count down` |

Kształt kodu (1.6.0): pętla jest *obrócona* — `test JMP` (pominięte, gdy stałe
ograniczenia gwarantują pierwsze przejście), ciało, `var += krok`, następnie
test na dole rozgałęziający się z powrotem do ciała, więc nie ma dodatkowego
`JMP` na iterację. Krok wykrywa 8-bitowe zawijanie w obu kierunkach (`INC`/`BEQ`
lub `ADC`/`BCS` zliczanie w górę, `BEQ`/`DEC` lub `SBC`/`BCC` zliczanie w dół),
więc `dla i = 0 do 255` wykonuje się 256 razy i zatrzymuje, a `dla i = N do 0
krok -k` jest zawsze skończony. Stałe limity i kroki są używane jako
natychmiastowe (bez strony zerowej); Limit lub krok, który nie jest stały, jest
oceniany raz i przechowywany na trwałej stronie zerowej.

Wartości `step` inne niż stałe (np. pochodzące ze zmiennej lub wyrażenia) są
traktowane jako dodatnie w czasie kompilacji. Jeśli potrzebujesz odliczania przy
użyciu wartości kroku wykonania, podziel pętlę lub użyj konstrukcji `while`.

### Etykiety i przejdź do

```basic
etykieta pętli_głównej
x = x + 1
jeśli x &lt; 10, przejdź do końca pętli_głównej
```

Przekazywanie `goto` (etykieta zdefiniowana później) jest w pełni obsługiwane.

`gosub label` / `return` przeskakują do etykiety i wracają (JSR / RTS na
poziomie kodu maszynowego). Etykieta musi być instrukcją `label name`, a nie
`sub` — nie ma parametrów i ma ten sam zakres zerowej strony. `gosub` obsługuje
odwołania do przodu (etykieta zdefiniowana po `gosub`).

```basic
gosub narysuj_granicę
...
etykieta narysuj_granicę
# ... narysuj coś ...
return # RTS — wraca do instrukcji po gosub
```

### Podprogramy

```basic
sub greet()
print "HELLO!"
end

sub set_color(col)
color border col
color text col
end

greet() # wywołanie z nawiasami
call greet # wywołanie słowa kluczowego (bez nawiasów)
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
koniec

fn add(a, b)
return a + b
koniec

fn clamp(val, lo, hi)
jeśli val &lt; lo, to zwróć lo koniec
jeśli val &gt; hi, to zwróć hi koniec
return val
koniec

var s = square(9) # s = 81 — wywołanie fn jako wyrażenie
var c = clamp(joy, 0, 39) # c = obcięta wartość
print add(10, 20) # 30 — można używać inline w print
```

Funkcje obsługują opcjonalny typ zwracany `: word` dla wartości 16-bitowych:

```basic
fn get_addr(): word
return $C000
koniec

var ptr: word = get_addr() # ptr = $C000
poke ptr, 42 # STA (ptr),Y — poprawne adresowanie pośrednie
var v = peek(ptr) # LDA (ptr),Y
```

`fn` jest emitowany w przebiegu 2 (tak samo jak `sub`), więc ciała funkcji nigdy
nie są wykonywane podczas uruchamiania. Odwołania do przodu są w pełni
obsługiwane.


#### W stylu QBasic `FUNKCJA` / `PODP`

```basic
FUNKCJA Negyzet (szam AS INTEGER) JAKO LICZBA CAŁKOWITA
    Negyzet = szam * szam ' zwracana wartość = przypisz do nazwy funkcji
FUNKCJA KOŃCOWA

FUNKCJA Nagyobb (a JAKO BYTE, b JAKO BYTE) JAKO BYTE
    Nagyobb = a
    JEŚLI b &gt; a TO
        Nagyobb = ur
        EXIT FUNCTION ' wróć teraz z dotychczas przypisaną wartością
    KONIEC JEŚLI
FUNKCJA KOŃCOWA

SUB Koszont (nev AS STRING)
    DRUKUJ "Üdvözöllek, "; nigdy; „!”
KONIEC POD

n = Negyzet(30)
Koszont "Zsolt"' wywołanie bez nawiasów
Koszont("Zsolt")'...albo z nimi
ZADZWOŃ do Koszonta("Zsolt")
```

- `funkcja` jest synonimem dla `fn`; `p AS type` działa na listach parametrów, a
  `AS type` po `)` zwraca typ (takie same nazwy typów jak `dim`). `: type` nadal
  działa.
- Przypisanie do funkcji nazw przechowujących się w ukrytej zmiennej
  `<name>__result` zwracanej w `END FUNCTION` / `EXIT FUNCTION`; `return expr`
  również nadal działa.
- `END SUB`, `END FUNCTION`, `END IF`, `END SELECT` są akceptowane (drugie słowo
  jest opcjonalne); `EXIT SUB` / `EXIT FUNCTION` zwraca (zwykłe `exit` to nadal
  `bye`).
- Sub/fn można wywołać bez nawiasów: `Koszont "Zsolt"`, `Rajzol x, y`.
- `PRINT a; b; c` — `;` łączy elementy bez spacji; końcowe `;` pomija nową
  linię. `;` po którym następuje polecenie (`print x; y = 1`) nadal oddziela
  polecenia.
- Akcentowane litery w literałach łańcuchowych są drukowane jako ich litera
  podstawowa (`ü` → `u`, `ő` → `o`); zestaw znaków C64 nie zawiera akcentów.
- Parametry typu Word/Float teraz otrzymują oba bajty, a literał ciągu
  przekazany do parametru `string` działa (wcześniej działał tylko bajt niższy
  lub zmienna ciągu).
- Brak rekurencji (parametry znajdują się w statycznych slotach zerowej strony);
  od wersji 1.6.3 wywołanie rekurencyjne jest błędem kompilacji, a nie
  automatycznie błędnymi wynikami.

#### Więcej składni QBasic (1.6.3)

Poniższe formularze QBasic kompilują się obok oryginalnej składni (komentarze
`==`, `end`, `loop`, `#` działają).

```basic
' komentarz (w stylu QBasic, np. #)
JEŻELI x = 3 THEN PRINT "trzy" ' jednowierszowy JEŻELI: nie KONIEC JEŻELI potrzebne
JEŻELI x &lt;&gt; 3 THEN PRINT "nie" W PRZECIWNYM RAZIE PRINT "tak"
JEŻELI n &lt; 0 THEN PRINT "ujemny"
W PRZECIWNYM RAZIE JEŻELI n = 0 THEN PRINT "zero"
W PRZECIWNYM RAZIE
PRINT "dodatni"
KONIEC JEŻELI

WHILE i &lt; 10 : i = i + 1 : LOOP ' również DO UNTIL c … LOOP,
DO : i = i - 1 : LOOP UNTIL i = 0 ' DO … LOOP WHILE c, DO … LOOP (nieskończona)
WHILE k &lt;&gt; 5 : k = k + 1 : WEND
FOR i = 1 TO 100
JEŻELI i = 12 THEN EXIT FOR ' EXIT DO / EXIT FOR / WYJŚCIE, PODCZAS GDY
NASTĘPNY

WYBIERZ PRZYPADEK n
WYBIERZ PRZYPADEK 1, 2, 3: DRUKUJ "mały"
WYBIERZ PRZYPADEK 10 DO 20: DRUKUJ "nastolatek"
WYBIERZ PRZYPADEK IS &gt; 1000: DRUKUJ "duży"
WYBIERZ W INNY SPOSÓB: DRUKUJ "inny"
KONIEC WYBORU

WYBIERZ ' kończy program (ekran zostaje zachowany)
```

- **Warunki:** wewnątrz `JEŻELI` / `W PRZECIWNYM PRZYPADKU` / `WHILE` / `UNTIL`
  / `LOOP WHILE|UNTIL`, pojedyncze `=` porównuje. `&lt;&gt;` oznacza, że nie
  jest wszędzie jednakowe (tak samo jak `!=`).
- **Jednowierszowa instrukcja JEŻELI:** instrukcja występująca zaraz po `THEN`
  tworzy jednowierszową instrukcję JEŻELI, która kończy się wierszem lub `end` w
  tym samym wierszu (`if c then x = 1 end`, jak poprzednio). Wielowierszowa
  instrukcja JEŻELI wymaga podziału wiersza po `THEN`. Tak jak w QBasic,
  wszystko po `THEN` w tym wierszu należy do instrukcji JEŻELI (`… THEN EXIT FOR
  : NEXT` pochłonęłoby `NEXT`).
- Samodzielnie **`END`: ** `END`, które nie zamyka bloku, kończy program,
  podobnie jak QBasic. Nadmiarowe `end` nie wyświetla się już jako błąd.
- Bloki **`DO`: ** wewnątrz bloku `DO`, na końcu linii znajduje się pętla
  `LOOP`, która ją zamyka (oryginalne pętle `loop N … end` / `loop i = … end`
  nadal działają w środku).
- **`SELECT CASE`:** stara forma `select x` / `case n:` pozostaje niezmieniona.
  `SELECT CASE` zostaje obniżone do łańcucha IF nad ukrytą zmienną `select__N`.

#### Ciągi znaków w czasie wykonywania (1.6.3)

```basic
DIM s AS STRING, t AS STRING
s = "Pont: " + pont + "!" ' liczby stają się tekstem (16-bitowym, ze znakiem dla liczb całkowitych)
t = s ' kopia: późniejsza zmiana s nie powoduje zmiany t
s = s + "?"
PRINT LEFT$(s, 4); RIGHT$(s, 2); MID$(s, 7, 3); MID$(s, 7)
PRINT LEN(s + t), VAL("1234") + 1, STR$(pont)
IF s = "ABC" OR t &lt;&gt; "" THEN PRINT "porównaj z = / &lt;&gt;"
```

- **Bufory:** zmienna łańcuchowa, która otrzymuje obliczoną wartość (`+`,
  `left$`, `right$`, `mid$`, numbers, inna zmienna) posiada bufor 80-znakowy;
  dłuższe wyniki są obcinane przy 80. Przypisanie literału nadal na niego
  wskazuje.
- **Tablice ciągów:** elementy, które otrzymują wartość nieliterałową (lub `dane
  wejściowe`) otrzymują własny 32-bajtowy slot (31 znaków), więc `dane wejściowe
  nevek(i)` w pętli zachowuje wszystkie nazwy.
- **`STR$` / `VAL`:** `STR$` wartości 16-bitowej lub ze znakiem nie ma zer
  wiodących (`"-42"`). Dla zachowania zgodności, `STR$` bajtu zachowuje formę
  3-cyfrową (`"007"`). `VAL` odczytuje 16-bitowe liczby ze znakiem (`VAL("1234")
  + 1` = 1235).
- **Porównanie: ** tylko `=` / `&lt;&gt;` (i `==` / `!=`); nie ma `&lt;` /
  `&gt;` kolejności ciągów znaków.

#### LICZBA CAŁKOWITA ze znakiem, WEJŚCIOWA, PODWÓJNA (1.6.3)

- **INTEGER jest ze znakiem:** `DIM x AS INTEGER` jest ze znakiem 16-bitowym
  (−32768 … 32767, jak QBasic): drukowanie, porównania `&lt;` `&gt;`, `/`
  (obcina w kierunku zera), `ABS`, konwersja tekstu, pętle `INPUT` i `FOR` przez
  zero (`FOR i = 3 TO -3 STEP -2`) wszystkie następują po znaku. `WORD`
  pozostaje bez znaku 0 … 65535. Unarny minus działa wszędzie (`a &lt; -10`, `x
  * -2`).
- **`FOR` z 16-bitowym licznikiem** (`INTEGER` / `WORD`) to prawdziwa pętla
  16-bitowa. Wcześniej kończyła się na 256, więc `FOR k = 0 TO 300` wykonała się
  45 razy.
- **`INPUT`:** do typu INTEGER/WORD odczytuje do 6 znaków (z `-` dla typu
  INTEGER), do typu DOUBLE akceptuje `12,5` (dwa miejsca po przecinku). `INPUT
  t(i)` odczytuje do elementu tablicy, a `INPUT "prompt"; x` również działa.
- **DOUBLE ÷ DOUBLE** jest teraz dokładne (`7,5 / 2,5 = 3,00`); wcześniej
  używana była tylko część całkowita dzielnika. DOUBLE × DOUBLE było już
  obsługiwane.
- **Tablice większe niż 256 bajtów** (`DIM t(200) AS INTEGER`, `DIM g(19, 19)`)
  działają z indeksami zmiennych; używany indeks zawija się przy 256 i zapisuje
  do niewłaściwego elementu.
- **Rekursja** (podfunkcja wywołująca samą siebie, bezpośrednio lub za
  pośrednictwem innych) to błąd kompilacji. Zwykle kompilowała i zwracała błędne
  wyniki, ponieważ parametry znajdowały się w stałych slotach zerowej strony.

### Tablice

```basic
var scores = array(8) # 8 bajtów w $C000
# (wszystkie tablice są wypełniane zerami jednorazowo na początku programu — nowość w wersji 1.5.7)

scores[0] = 100 # stały indeks → STA $C000
scores[i] = 99 # indeks zmiennej → STA (ptr),Y
var v = scores[i] # LDA (ptr),Y
print scores[2] # możliwe do użycia w linii podczas drukowania

var moments = array_word(8) # 16 bajtów (8×2) w $C000+

moments[0] = $1234 # stały indeks → STA $C000 (lo), STA $C001 (hi)
moments[i] = $5678 # indeks zmiennej → ASL A dla kroku; (ptr),Y × 2
var t: słowo = momenty[1] # LDA $C002, LDA $C003
```

**Tablice wielowymiarowe** (nowość w wersji 1.5.3)

Tablice mogą być deklarowane z więcej niż jednym wymiarem. Są przechowywane w
kolejności **wiersz-major** i indeksowane za pomocą listy indeksów dolnych
rozdzielonych przecinkami. Całkowity rozmiar jest iloczynem wszystkich wymiarów.

```basic
var grid = array(8, 8) # 8×8 = 64 bajty w $C000
grid[1, 0] = 11 # wiersz 1, kolumna 0 → indeks płaski 1*8+0 = 8 → STA $C008
grid[0, 1] = 22 # wiersz 0, kolumna 1 → indeks płaski 1 → STA $C001
grid[r, c] = 33 # zmienna → oblicza r*8 + c, a następnie STA (ptr),Y
var v = grid[r, c] # LDA (ptr),Y

var wm = array_word(4, 4) # tablica słów 4×4 = 32 bajty
wm[1, 2] = $ABCD # element 1*4+2 = 6 → bajty $C00C/$C00D

const ROWS = 3
const COLS = 5
var m = array(ROWS, COLS) # wymiary mogą być stałymi czasu kompilacji
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
typ TEntity
var x: int # 1 bajt
var y: int # 1 bajt
var hp: słowo # 2 bajty → rozmiar elementu = 4
endtype

const N = 8
var owners: TEntity = array(N) # przydziela N × 4 = 32 bajty w $C000

enemies[0].x = 5
enemies[0].y = 10
enemies[0].hp = $0100
var v = enemy[0].hp # odczyt wstecz — LDA $C002 / LDA $C003

var i: int = 2
enemies[i].x = 42 # indeks zmiennej → idx * elem_size + offset

# Pole zmiennoprzecinkowe (Q8.8 stałoprzecinkowe)
typ TBall
var bx: int # 1 bajt
var by: int # 1 bajt
var vel: float # 2 bajty P8.8 → rozmiar elementu = 4
endtype

var balls: TBall = array(3)
balls[0].vel = 1.5 # zapisuje P8.8: hi=1, lo=128
var f: float = balls[0].vel # odczytuje pole float do zmiennej float
print balls[0].vel # drukuje "1.50"
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
var ptr: słowo = $0400 # dwa bajty ZP: lo=00$ hi=04$
szturchnij ptr, 6 # STA (ptr),Y
var v = peek(ptr) # LDA (ptr),Y
```

**Implikaty 16-bitowe (naprawiono w wersji 1.5.7).** Iloczyn przypisany do
`word` zachowuje wszystkie 16 bitów, także gdy żaden z czynników nie jest
`word`:

```basic
var score: word = 0
var level = 3
score += 300 * poziom nr 900 (przed wersją 1.5.7 było to skrócone do 8 bitów: 44)
score = score + 100 * poziom
var big: word = 100 * level + 900
```

Od wersji 1.6.1 dotyczy to również sum wewnętrznych i dla `shl`, a także dla
mnożników stałych powyżej 255: `py = cy * 8 + fy`, `py = (cy shl 3) + fy` i `w =
cy * 300` – zachowują wszystkie 16 bitów (wcześniej formy sum były obcinane do 8
bitów). Cele bajtowe zachowują wyniki 8-bitowe.

### Grafika bitmapowa

```basic
grafika na # VIC-II włącza tryb bitmapowy (320×200, 1 bpp); bitmapa o wartości $2000
grafika na # VIC-II tryb wielokolorowy bitmapowy (160×200, 2 bpp, 4 kolory/komórkę)
grafika wyłączona # powrót do trybu tekstowego

gcls # wyczyść bitmapę (wypełnia $2000-$3FFF) + ustaw kolory macierzy wideo

wykres x, y # ustaw piksel w punkcie (x, y); x: 0-319, y: 0-199
wykres usuń x, y # wyczyść piksel (AND ~mask)
wykres xor x, y # przełącz piksel (maska EOR) — animacja bez migotania
koło x, y, r # środek okręgu o środku w punkcie (x, y) o promieniu r; Przycina punkty poza ekranem
linia x1, y1, x2, y2 # linia Bresenham od (x1, y1) do (x2, y2); x: 0-319, y: 0-199
wymazywanie linii x1, y1, x2, y2 # wyczyść piksele wzdłuż linii (AND ~mask)
linia xor x1, y1, x2, y2 # przełącz piksele wzdłuż linii (maska EOR)
prostokąt x1, y1, x2, y2 # narysuj kontur prostokąta (4 krawędzie); x: 0-319, y: 0-199
prostokąt wymazywanie x1, y1, x2, y2 # wyczyść kontur prostokąta (AND ~mask)
prostokąt xor x1, y1, x2, y2 # XOR kontur prostokąta (maska EOR)
malowanie x, y # 4-spójne wypełnienie powodziowe od (x, y); wypełnia czyste piksele ograniczone ustawionymi pikselami

kolorowy pisak c # ustaw kolor rysunku hires (0-15); patrz poniżej

# ── Wielokolorowa mapa bitowa (grafika na wielu, 160×200) ──
mplot x, y, kolor # ustaw wielokolorowy piksel (x: 0-159, y: 0-199, kolor: 0-3)
mline x1, y1, x2, y2, kolor # wielokolorowa linia
mrect x1, y1, x2, y2, kolor # wielokolorowy kontur prostokąta
mcircle x, y, r, kolor # wielokolorowe koło
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
grafika włączona
gcls
kolorowy pisak 2 # czerwony
linia 0, 0, 100, 100
kolorowy pisak 6 # niebieski
koło 160, 100, 40
wyświetlacz włączony
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
grafika na wielu
gcls
mcircle 80, 100, 40, 1
mrect 10, 10, 150, 190, 2
mline 0, 0, 159, 199, 3
wyświetlacz włączony
```

`mline`/`mrect`/`mcircle` wykorzystują ponownie te same procedury
Bresenham/punktu środkowego, co ich odpowiedniki hires, kreśląc każdy piksel
przez `mplot`; punkty poza ekranem (x ≥ 160 lub y ≥ 200) są pomijane.

### Podwójnie buforowana mapa bitowa (bez migotania)

```basic
grafika na podwójnym # podwójnie buforowanym hires bitmap (320×200)
gcls # czyści UKRYTY bufor zapasowy
linia 0, 0, 319, 199 # cały rysunek (wykres/linia/koło/prostokąt/malowanie/gcls) trafia do bufora zapasowego
odwróć # pokaż bufor rysowania; przekieruj rysunek do drugiego
wyłącz grafikę # powrót do trybu tekstowego (przywraca bank VIC 0)
```

`graphics on double` przechowuje **dwie** kompletne mapy bitowe i wyświetla
tylko ukończone klatki, eliminując migotanie bez żadnych sztuczek XOR — każdą
klatkę `gcls` rysujesz, a potem `flip`.

| Bufor                                | Mapa bitowa    | Matryca wideo  | Bank VIC | `$DD00` niskie bity |
| ------------------------------------ | -------------- | -------------- | -------- | ------------------- |
| A (przód, pokazany jako pierwszy)    | `2000 dolarów` | `0400 dolarów` | bank 0   | `%11`               |
| B (z tyłu, narysowany jako pierwszy) | `6000 dolarów` | `4400 dolarów` | bank 1   | `%10`               |

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
Grafika na bloku # 80×50 w trybie blok-piksel (tryb tekstowy + niestandardowy zestaw znaków 4-pikselowy za $2800)
Wyłącz grafikę # powrót do trybu tekstowego
gcls # wyczyść pole gry bloku: pamięć RAM ekranu $0400-$07FF + pamięć RAM koloru $D800-$DBFF

plot4 x, y # ustaw piksel bloku w punkcie (x, y); x: 0-79, y: 0-49
plot4 wymaż x, y # wyczyść piksel bloku w punkcie (x, y)
circle4 x, y, r # narysuj okrąg w punkcie środkowym w pikselach bloku; przytnij do 80×50
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
cls # wyczyść ekran (KERNAL $E544)
cls fast # szybkie wypełnienie: RAM ekranu + RAM koloru + HOME

kolor tekstu 14 # rejestr koloru tekstu $0286
kolor obramowania 6 # $D020
kolor tła 0 # $D021
kolor pisaka 2 # wybiera kolor rysowania (0-15) dla wykresu/linii/prostokąta/koła/malowania

screen 0, 0, 65 # zapisz znak 65 ('A') do RAM ekranu w kolumnie 0, wierszu 0 ($0400)
screen 10, 5, ch # kolumna 10, wiersz 5 — kolor/wiersz mogą być zmiennymi
screen 5, 3, 42, 7 # znak 42 w kolumnie 5, wierszu 3, kolorze 7 (zapisuje również RAM koloru $D800)
screen x, y, ch, col # wszystkie cztery argumenty jako zmienne

display on # ponownie włącz Wyświetlanie VIC (bit $D011 DEN)
wyświetlanie wyłączone # pusty wyświetlacz

małe litery # CHR$(14) → przełącz VIC-II na zestaw znaków małych/wielkich
wielkie litery # CHR$(142) → przełącz VIC-II z powrotem na zestaw znaków wielkich/graficznych

kursor 20, 10 # przesuń kursor do kolumny 20, wiersza 10 (KERNAL PLOT $FFF0)
kursor x, y # kolumna ze zmiennej x (0–39), wiersz ze zmiennej y (0–24)

wyświetlanie w 20, 10, "HELLO" # kursor(20,10) + wyświetl w jednym poleceniu (bez nowej linii na końcu)
wyświetlanie w x, y, "Wynik:", wynik # dowolna kombinacja wyrażeń
wyświetlanie w 0, 0 # tylko pozycja (bez tekstu, bez nowej linii)

przewijanie x 3 # ustaw poziome przewijanie precyzyjne: $D016 bitów 0-2 = 3 (0-7)
scroll y 2 # ustaw precyzyjne przewijanie w pionie: $D011 bitów 0-2 = 2 (0-7)
scroll x n # wartość może być zmienną lub wyrażeniem (zamaskowanym do bitów 0-2)
scroll x 7 narrow # ustaw precyzyjne przewijanie i wymuś tryb 38-kolumnowy (ukryj kolumnę krawędzi)
scroll x 0 wide # ustaw precyzyjne przewijanie i przywróć tryb 40-kolumnowy
scroll row 12 left # przesuń wiersz 12 w pamięci RAM ekranu o jeden znak w lewo
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
speed 4 # ustaw CPU na 4 MHz (odczyt $D031, aktualizacja bitów 0-3, zapis zwrotny)
speed 48 # 48 MHz (maksymalna prędkość na U64)
speed max # taka sama jak prędkość 48 (alias)
speed off # powrót do 1 MHz (alias dla prędkości 1)

badlines on # włącz taktowanie badline ($D031 bit 7 = 0, domyślne zachowanie C64)
badlines off # wyłącz taktowanie badline ($D031 bit 7 = 1, więcej cykli procesora)

var t = turbo() # 1, jeśli turbo jest aktywne (bity 0-3 $D031 ≥ 0), 0, jeśli 1 MHz
```

Dostępne wartości MHz: `1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 20, 24, 32, 40,
48`. Wartości stałe są zaokrąglane w dół do najbliższej dostępnej prędkości w
momencie kompilacji. Wartości zmiennych są traktowane jako surowy indeks
prędkości (0–15) i poddawane operacji OR na bitach 0–3 `$D031`.

| Indeks D031 | MHz (U64) | MHz (U64 Elite-II) |
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
var key = getch() # czekaj na $FFE4, aż klawisz zostanie naciśnięty; zwraca kod PETSCII
var k = inkey() # nieblokujący: zwraca kod PETSCII lub 0, jeśli żaden klawisz nie zostanie naciśnięty
waitkey # czekaj, aż dowolny klawisz zostanie naciśnięty (skanowanie macierzy CIA1; działa podczas przerwania IRQ)
var k = waitkey() # to samo, ale zwraca surowe bity kolumny $DC01 (bit 0 = naciśnięty klawisz)
var j = joy(2) # odczyt portu joysticka 2; Zwraca odwrócone bity 0-4
var j = joy(1) # odczyt portu joysticka 1
# bit0=góra(1) bit1=dół(2) bit2=lewo(4) bit3=prawo(8) bit4=wystrzel(16)
var mx = mouse_x() # 1351 mysz: skumulowana pozycja X (pomoc: ładowanie+opóźnienie+delta)
var my = mouse_y() # 1351 mysz: skumulowana pozycja Y (EOR #$FF odwrócona)
var mb = mouse_btn() # przyciski myszy: odczytuje $DC01 — bit0=lewo (wystrzel), bit1=prawo (pin w górę)
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
pa # JSR $E544 (wyczyść ekran), wyczyść flagę STOP, RTS do BASIC
exit # alias na pa
```

### Chronometraż

```basic
wait 50 # czekaj na 50 przejść między liniami rastra (~3,2 ms)
wait raster 100 # spin, aż $D012 == 100 (efekty podziału rastra)
delay 1 # czekaj na 1 klatkę PAL (1/50 s ≈ 20 ms)
delay 20 # czekaj na 20 klatek ≈ 0,4 s; n może być zmienną (0–255)
```

`delay N` zlicza N kompletnych ramek PAL używając linii rastrowej 200 jako
granicy ramki.

### Dźwięk SID

```basic
dźwięk 0, $1CAD, 25 # głos 0, częstotliwość $1CAD (≈ środkowe C PAL), czas trwania 25 klatek
dźwięk 1, częstotliwość_słowo, 50 # głos 1, częstotliwość ze słowa var, 50 klatek (1 s przy 50 Hz)
dźwięk 2, 0, 0 # głos 2, cisza

sid volume 15 # pełna głośność główna ($D418 = $0F); zakres 0-15
sid volume 0 # cisza (głośność główna = 0)
sid stop # wyzeruj wszystkie 25 rejestrów SID ($D400–$D418) — całkowita cisza
```

`sound <channel>, <freq>, <duration>` — czas trwania w klatkach PAL (po 1/50 s).
`sound` **bloki**: program czeka, aż nuta się zakończy (użyj `sfx` poniżej w
pętli gry). Naprawiono ADSR: atak/zanik `$09`, podtrzymanie/zwolnienie `$F0`,
przebieg piłokształtny. Głośność główna `$D418` zawsze ustawiona na `$0F`.

*Naprawiono w wersji 1.5.7:* pętla oczekiwania obserwowała linię rastra 0, która
`$D012` (tylko 8 najniższych bitów) wyświetla się dwa razy na klatkę (linie 0 i
256), więc każda nuta trwała **połowę** czasu, jaki był wymagany — a dwie
gałęzie zostały załatane w oparciu o ich kod operacji, co powodowało awarię
programu na czas inny niż 0. `sound` teraz czeka na linię rastra 200 dokładnie
tak samo jak `delay`.

`sid volume N` zapisuje N do `$D418`. Bity 0-3 = głośność (0-15), bity 4-7 =
tryb filtrowania. `sid stop` emituje 10-bajtową pętlę wypełniania zerami —
szybszą niż 25 pojedynczych poke'ów.

### Efekty dźwiękowe bez blokowania (`sfx`) — nowość w wersji 1.5.7

```basic
dźwięk 0, $2000, 25 # BLOKI: program czeka tutaj 25 klatek
sfx 0, $2000, 25 # powraca natychmiast; nuta wycisza się samoczynnie
sfx 1, $0500, 8, 128 # opcjonalna fala: 16 trójkąt, 32 piła (domyślnie), 64 puls, 128 szum
sfx 0, freq_word, 4, 16 # freq może być stałą, słowem var lub wyrażeniem 8-bitowym
```

`sfx <channel>, <freq>, <frames> [, <wave>]` programuje jeden głos SID i
natychmiast powraca, więc jest bezpieczny w pętli gry. Nie ma timera wyłączania
bramki: obwiednia jest ustawiona na atak 0 / podtrzymanie 0 / zwolnienie 0, a
**zanik** jest wybierany w momencie kompilacji z `frames` (1 klatka = 20 ms,
najbliższy czas zaniku SID: 6, 24, 48, 72, 114, 168, 204, 240, 300, 750, 1500,
2400 ms ...), więc nuta zanika mniej więcej w tym czasie. Ponownie wyzwala głos
przy każdym wywołaniu (wyłączenie bramki, a następnie jej włączenie) i ustawia
głośność główną `$0F`. `channel` (0-2), `frames` (1-255) i `wave` muszą być
stałymi czasu kompilacji.


### Muzyka SID

```basic
Załaduj sid "tune.sid" # osadź muzykę SID pod jej natywnym adresem ładowania
Załaduj sid "tune.sid", $2000 # nadpisanie: osadź pod adresem $2000 niezależnie od nagłówka SID
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
załaduj sid "music.sid"

sub music_irq()
poke $D019, $FF # ACK VIC raster IRQ
sys sid_play # przesuń o jedną klatkę muzyki
irq_exit # JMP $EA81: przywróć A/X/Y + RTI (prawidłowe wyjście IRQ)
end

sys sid_init, 0 # zainicjuj układ SID: A=0 → pierwszy podstrojony
irq music_irq, $C0 # raster IRQ w linii $C0 → 50 Hz w systemie PAL

sid volume 15 # włącz główną głośność
```

**Uwagi:**
- Dane SID są umieszczane **po** każdym wygenerowanym kodzie, uzupełnione zerami
  aż do adresu ładowania. Kompilator ostrzega, jeśli adres ładowania SID będzie
  nachodził na wygenerowany kod.
- Obsługiwane są PSID v1 i v2. Jeśli adres ładowania nagłówka SID wynosi 0, jako
  adres używane są pierwsze dwa bajty danych (w stylu PRG, little-endian).
- Tylko jedno `load sid` na program jest znaczące (ostatnie wygrywa).

### Melodie trackera (`tune`)

```basic
strojenie # opcjonalnie: strojenie na $C800 (domyślnie $8000)
prędkość 6 # klatek na wiersz (50 Hz PAL)
inst 0, $41, $09, $F0, $0800, $0064, $27, $1F
inst 1, $10, $08, $A8, $0400, $0000, $00, $0F
imod 0, 6, 3, 9, 40, $0200, $0E00 # vibrato + modulacja szerokości impulsu (1.6.2)
ifilt 0, $0500, 20, 1 # zakres odcięcia do $500, w obie strony (1.6.2)
igate 1, 2, 1, $09 # timer bramki, twardy restart, pierwsza klatka $09 (1.6.2)
itab 1, 2, 0, ".. +0", ".. +4", ".. +7" # tabela arpeggio (1.6.2)
order 0, 1, 0 # kolejność wzorców (wzorce mogą się powtarzać)
pat 0, 0, "C-4 00", "...", "E-4 00 V24", "...", "G-4 00", "... .. C00"
pat 0, 1, "C-2 01", "...", "...", "...", "G-2 01 F03"
pat 1, 0, "G-4 00", "...", "E-4 00", "...", "C-4 00"
koniec
odtwarzanie muzyki # lub: sys sid_init / obsługa przerwań wywołująca sys sid_play
```

`tune ... end` opisuje 3-głosową melodię śledzącą w zwykłym tekście (ta sama
notacja komórek, jaką pokazuje edytor SID języka Visual Assembler) i buduje
odtwarzacz **w czasie kompilacji**. Definiuje `sid_init` / `sid_play` dokładnie
tak samo, jak `load sid`, więc `music play`, `music stop`, `music pause` i
`music resume` (oraz ręczny `irq` handler wywołujący `sys sid_play`) działają
bez zmian.

| Linia                                                                  | Oznaczający                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `prędkość N`                                                           | Liczba klatek na rząd modułu śledzącego (1–255).                                                                                                                                                                                                                                                                                                                                                                                   |
| `inst id, ctrl, ad, sr, pw, cutoff, resfilt, modevol`                  | Jeden instrument: rejestr sterujący (bity przebiegu plus mod. pierścienia `$04` / synchronizacja `$02`; bit bramki jest dodawany przez gracza), atak/zanik, podtrzymanie/zwolnienie, 12-bitowa szerokość impulsu, 11-bitowe odcięcie filtra, bajt rezonansu/trasowania filtra (w stylu `$D417`: dowolny bit trasowania = trasowanie głosu grającego na tym instrumencie) i bajt trybu/głośności (w stylu `$D418`, bit 7 = 3 WYŁ.). |
| `imod id, vibdelay, vibspeed, vib głębokość, pwmspeed, pwmmin, pwmmax` | (1.6.2) Wibrato instrumentu: po ramkach `vibdelay` trójkątny LFO obraca się co `vibspeed` ramek (1–15, 0 = wyłączony), głębokość 0–15 (skalowana do półtonu nuty). Modulacja szerokości impulsu: `pwmspeed` dodawane na każdą ramkę (0 = wyłączony), zmieniające się między `pwmmin` a `pwmmax`.                                                                                                                                   |
| `ifilt id, cutend, sweep, pingpong`                                    | (1.6.2) Przemiatanie odcięcia filtra: od odcięcia `inst` w kierunku `cutend` o `sweep` (0–127) na klatkę; `pingpong` 1 = w tę i z powrotem.                                                                                                                                                                                                                                                                                        |
| `identyfikator bramki, gatetimer, twardy restart, pierwsza fala`       | (1.6.2) Bramka jest zwalniana `gatetimer` klatek przed następną nutą w głosie (utrzymuj ją poniżej `speed`); `hardrestart` 1 ustawia wtedy ADSR na 0. `firstwave` (np. `$09` = test + gate) jest zapisywane na pierwszej klatce nuty.                                                                                                                                                                                              |
| `itab id, prędkość, pętla, "krok", ...`                                | (1.6.2) Tabela fal/arpeggio, do 32 kroków: `"WW +n"`, `".. -n"` lub `"WW =n"` – przebieg w formacie szesnastkowym (`..` go zachowuje) oraz przesunięcie nuty w półtonach lub nuta absolutna (`=60`). Jeden krok co `szybkość` klatek, a następnie powrót do kroku `pętli` (255 = pozostanie na ostatnim kroku).                                                                                                                    |
| `zamówienie p, p, ...`                                                 | Kolejność wzorów. Linie kumulują się, do 255 kroków.                                                                                                                                                                                                                                                                                                                                                                               |
| `pat p, v, "komórka", ...`                                             | Do 32 wierszy dla głosu `v` (0-2) wzoru `p` (0-7). Brakujące wiersze są puste.                                                                                                                                                                                                                                                                                                                                                     |

Komórka **** to `NOTE INST FX`: `C-4`, `D#3`, `Eb2` lub `...` dla braku nuty,
dwucyfrowy instrument szesnastkowy (`..` dla jego pozostawienia) i opcjonalny
efekt - `Vxy` vibrato (x = przytrzymaj wiersze, y = głębokość), `Uxx` / `Dxx`
przesuwanie w górę / w dół, `C` cięcie nuty, `Fxx` ustawienie prędkości. Komórkę
zawierającą tylko efekt można zapisać jako `"... .. F06"` lub po prostu `"F06"`.

Uwagi dotyczące odtwarzacza:

- Wszystkie stany gracza znajdują się **wewnątrz blobu ** (adresowanie
  bezwzględne) — nie używa on strony zerowej, więc nie może kolidować ze
  zmiennymi ani elementami tymczasowymi UltimateBasic i działa dalej, gdy
  program powraca do języka BASIC.
- W każdej klatce (1.6.2) odtwarzacz uruchamia tabelę wave/arpeggio każdego
  głosu, vibrato, modulację szerokości impulsu i timer bramki/twardy restart, a
  także przebieg odcięcia głosu, który ostatnio uruchomił instrument kierowany
  przez filtr (ma on przypisane odcięcie, rezonans i tryb filtru; `$D417`
  kieruje przebiegiem każdego głosu, którego bieżący instrument jest kierowany
  przez filtr). Jest to ten sam algorytm, który jest używany w eksportowanym
  odtwarzaczu i podglądzie edytora SID Visual Assembler, klatka po klatce.
- Blob jest umieszczany pod stałym adresem (domyślnie `$8000` lub `tune pod
  adresem $addr`), a `.prg` jest do niego dopasowywany, np. `load sid`. Nie
  umieszczaj w nim kodu, tablic (`$C000+`) ani pamięci bitmap/zestawów znaków.
  Dodanie zajmuje około 2,5 KB plus 12 bajtów na wiersz/kolumnę danych.
- Maksymalnie 8 wzorów (po 32 rzędy każdy); lista zamówień może się dowolnie
  powtarzać.
- `music play` używa timera CIA1 o częstotliwości 50 Hz; nie należy go łączyć z
  innym `load sid`/`tune` (ostatni wygrywa).

### Odtwarzanie muzyki

`Odtwarzanie/zatrzymywanie/pauza/wznawianie muzyki` to alternatywa wysokiego
poziomu dla ręcznej konfiguracji `sys sid_init` / `cia_timer`. Wymaga
wcześniejszego wykonania polecenia `load sid` lub bloku `tune ... end` (oba
definiują `sid_init` / `sid_play`).

```basic
załaduj sid "tune.sid" # osadź plik SID (definiuje sid_init / sid_play)

music play # zainicjuj podstrojenie 0 + uruchom przerwanie CIA1 50 Hz
music play 1 # uruchom od podstrojenia 1 (numer utworu 0)
music stop # zatrzymaj odtwarzanie + zeruj wszystkie 25 rejestrów SID ($D400-$D418)
music pause # wyłącz przerwanie IRQ A timera CIA1 (muzyka się zawiesza, SID nie zmienia się)
music resume # ponownie włącz przerwanie IRQ A timera CIA1 (kontynuacja od punktu pauzy)
```

| Oświadczenie             | Efekt                                                                                                          |
| ------------------------ | -------------------------------------------------------------------------------------------------------------- |
| `odtwarzanie muzyki [n]` | zadzwoń pod numer `sid_init(n)`, skonfiguruj timer CIA1 A na 19 656 cykli (~50 Hz PAL), zainstaluj wrapper IRQ |
| `zatrzymanie muzyki`     | wyłącz IRQ CIA1 + wyzeruj wszystkie 25 rejestrów SID                                                           |
| `pauza muzyczna`         | wyłącz CIA1 IRQ (wyjście SID pozostaje zamrożone)                                                              |
| `CV muzyczne`            | ponownie włącz CIA1 IRQ (kontynuuj od punktu wstrzymania)                                                      |

Opakowanie IRQ (wyemitowane jednokrotnie na końcu programu) wykonuje następujące
czynności: ACK CIA1 timer A → `JSR sid_play` → `JMP $EA81`.

### Duszki

```basic
sprite 0, x, y, $2000 # sprite 0: ustaw pozycję X, Y i wskaźnik danych
sprite 0, x, y # bez wskaźnika danych (zachowuje istniejący)
sprite on 0 # włącz sprite 0 ($D015 |= bit0)
sprite off 0 # wyłącz sprite 0 ($D015 &amp;= ~bit0)
sprite color 0, 7 # sprite 0 color = yellow ($D027)
sprite multicolor 0, on # włącz tryb wielokolorowy dla sprite 0 ($D01C |= bit0)
sprite multicolor 0, off # wyłącz tryb wielokolorowy ($D01C &amp;= ~bit0)
sprite expand x 0, on # podwójna szerokość ($D01D |= bit0)
sprite expand x 0, off # normalna szerokość ($D01D &amp;= ~bit0)
sprite expand y 0, on # podwójna wysokość ($D017 |= bit0)
sprite expand y 0, off # normalna wysokość ($D017 &amp;= ~bit0)
sprite priority 0, on # za tłem ($D01B |= bit0)
sprite priority 0, off # przed tłem ($D01B &amp;= ~bit0)
var h = sprite_hit() # kolizja sprite–sprite ($D01E, czyszczone przy odczycie)
var b = sprite_bg_hit() # kolizja sprite–tło ($D01F, czyszczone przy odczycie)
var x = sprite_x(0) # odczyt pozycji sprite 0 w osi X (młody bajt, $D000)
var y = sprite_y(0) # odczyt pozycji sprite 0 w osi Y ($D001)
sprite_frame 0, $2000 # wybierz jeden statyczny obraz sprite'a
sprite_frame 0, $2000, frame # wybierz klatkę animacji z sekwencja klatek
```

X obsługuje pełny zakres 9-bitowy (0–319): użyj zmiennej `word` dla wartości
czasu wykonania > 255. Wskaźnik danych sprite'a: `data_addr` musi być wyrównany
do 64 bajtów; przechowywany jako `addr >> 6` w `$07F8+id`.

#### Animacja sprite'a z `klatką sprite'a `

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
pętla
sprite_frame 0, $2000, frame
frame = frame + 1
jeśli frame == 4 to frame = 0 koniec
opóźnienie 5
koniec
```

Forma dwuargumentowa `sprite_frame id, address` po prostu wybiera jeden
statyczny obraz sprite'a i zachowuje wsteczną kompatybilność. Pozycja sprite'a
jest nadal kontrolowana przez `sprite id,x,y`.

### Kolizja ograniczająca oprogramowania

```basic
var touching = box_hit(lewy1, górny1, prawy1, dolny1,
lewy2, górny2, prawy2, dolny2)
```

`box_hit()` wykonuje test prostokąta ograniczającego wyrównanego z osią (AABB) i
zwraca `1`, gdy dwa prostokąty nachodzą na siebie lub się stykają, w przeciwnym
razie `0`. W przeciwieństwie do `sprite_hit()` i `sprite_bg_hit()`, nie
odczytuje ani nie czyści rejestrów kolizji VIC-II. Osiem argumentów to dowolne
wyrażenia 8-bitowe, więc pola mogą być mniejsze niż widoczna grafika sprite'a
lub opisywać obiekty gry inne niż sprite'y. Współrzędne są inkluzywne; zachowaj
`left <= right` i `top <= bottom`.

### Definicja sprite'a

```basic
sprdef 0
  00 $, 3C, 00 $, 00 $, FF, 00 $, 03 $, FF, $ C0, 07 $, FF, $ E0,
  $0F, $FF, $F0, $0F, $FF, $F0, $1F, $FF, $F8, $1F, $FF, $F8,
  $1F, $FF, $F8, $0F, $FF, $F0, $0F, $FF, $F0, $07, $FF, $E0,
  03 USD, FF, USD C0, 00 USD, FF, 00 USD, 00 USD, 3C, 00 USD, 00 USD, 00 USD, 00 USD,
  00 dolarów, 00 dolarów, 00 dolarów, 00 dolarów, 00 dolarów, 00 dolarów, 00 dolarów, 00 dolarów, 00 dolarów, 00 dolarów, 00 dolarów, 00 dolarów,
00,00,00
koniec
```

`sprdef id ... end` osadza 63 bajty sprite'ów pod kolejnym adresem 64-bajtowym w
segmencie kodu, emituje `JMP` nad nimi i automatycznie ustawia `$07F8+id =
data_addr >> 6`. Aby użyć tego samego kształtu dla wielu sprite'ów, odczytaj
wskaźnik:

```basic
var pg = peek($07F8) # wskaźnik ustawiony przez spredef 0
poke $07F9, pg # kopiuj do sprite'ów 1–7
```

### Mapy kafelków postaci (`.ubmap`)

```basic
Załaduj mapę "levels/world.ubmap"
Załaduj mapę "level.bin", $4000 # Projekt edytora poziomów, dane $4000 (1.6.1)
Map draw map_x, map_y # Narysuj widok 40x25 do pamięci RAM ekranu/koloru
Map view px, py # Wygładzony widok z podwójnym buforowaniem dla piksela px, py (1.6.1)

var tile = map_tile(x, y) # Odczytaj kod znaku z mapy
Map set x, y, 42 # Zmień kod znaku w zapisywalnych danych mapy

var shade = map_color(x, y) # Odczytaj kolor komórki (0, gdy mapa nie zawiera danych o kolorze)
Map color x, y, 7 # Zmień kolor komórki, gdy dane o kolorze są obecne
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

**Projekty Edytora Poziomów (nowość w wersji 1.6.1).** `Wczytywanie mapy`
odczytuje również projekt Edytora Poziomów VisualAssembler (`Zapisywanie poziomu
(.bin)`) i łączy jego ekrany w jedną mapę: poziom ekranów W×H staje się mapą
(W·40)×(H·25) z kolorami, puste pola to spacje. Rozmiar map jest ograniczony do
255×255 komórek, więc poziom może mieć maksymalnie 6 ekranów szerokości i 10
wysokości.

```basic
wczytaj mapę "level.bin" # ekrany 2x5 -&gt; jedna mapa 80x125
```

**Umieszczanie danych mapy (nowość w wersji 1.6.1). ** `mapa wczytuje „plik”,
adres` zapisuje mapę pod stałym adresem, a nie w linii kodu, jak `incbin „plik”,
adres` (adres musi znajdować się nad wygenerowanym kodem lub w przerwie `org`).
Najpierw znaki, potem kolory:

```basic
ładowanie mapy „level.bin”, mapa $4000 # 80x125: znaki $4000-$6713, kolory $6714-$8E1F
```

#### Płynne przewijanie — `widok mapy` (nowość w wersji 1.6.1)

```basic
Ładowanie mapy "level.bin", $4000
var px: word = 0
var py: word = 0
pętla
widok mapy px, py # raz na klatkę, zamiast `czekaj raster`
# odczytaj joystick, zmień px / py, logikę gry...
koniec
```

`widok mapy x, y` pokazuje mapę w pozycji piksela `x, y` (wyrażenia słowne;
`0..(szerokość-40)*8` i `0..(wysokość-25)*8`, wartości poza zakresem są
obcinane). Wywołuje się go raz na klatkę: czeka na granicę klatki (linia
rastrowa 250), pokazuje pozycję podaną w poprzednim wywołaniu, a następnie
przyjmuje nową, więc pozycja pojawia się jedną klatkę później.

Jak to działa: drobna część używa XSCROLL / YSCROLL w `$D016` / `$D011` z 38
kolumnami i 24 wierszami (przewijana krawędź pozostaje ukryta); kroki znaku
zamieniają dwa bufory ekranu, `$0400` i `$3C00`. Pozycja jest przewidywana dwie
klatki wcześniej, a ukryty bufor jest budowany dla następnej komórki znaku w
dwóch połowach, zanim widok tam dotrze, więc zamiana nigdy nie czeka. Pamięć RAM
kolorów nie może być podwójnie buforowana: jej górna połowa jest kopiowana w
ostatniej starej klatce za belką rastra, dolna połowa zaraz po zamianie przed
nią (obie z przerwaniami zamaskowanymi dla kilku linii rastra), więc nic się nie
rozrywa. Zmiana kierunku dokładnie w kroku znaku może utrzymać widok przez jedną
lub dwie klatki, podczas gdy bufor jest przebudowywany.

Zasady:

- Kod programu i dane inline muszą znajdować się poza `$3C00-$3FFF` (drugi
  bufor); załaduj duże mapy z adresem (`map load "file", $4000`), w przeciwnym
  razie kompilacja zakończy się błędem.
- Pierwszy `widok mapy` rysuje cały widok w `$0400`. Następnie ekran należy do
  `widoku mapy`: `drukuj` / `ekran` / `cls` zapisz tylko `$0400` i zostaną
  nadpisane.
- Sprite'y działają normalnie: `widok mapy` kopiuje wskaźniki sprite'ów
  `$07F8-$07FF` do `$3FF8-$3FFF` w każdej klatce, więc `sprdef` / `sprite_frame`
  są wyświetlane w obu buforach. Dane sprite'ów przechowuj w banku VIC 0
  (`$0000-$3FFF`, a nie `$1000-$1FFF`), np. poprzez umieszczenie `sprdef` przed
  dużym, wbudowanym `ładowaniem mapy`.
- Bity zestawu znaków `$D018` są zachowywane (zestaw znaków `na` działa); bit
  wielokolorowy `$D016` jest zachowywany tak, jak ustawiono w `map load`.
- Pozostaw około 6000 cykli (~95 linii rastrowych) logiki gry na klatkę; dłuższa
  klatka sprawia, że widok jest utrzymywany przez jedną klatkę, ale nigdy się
  nie rozrywa.
- Przykład: `examples/level_scroll_demo.ub` (sterowany joystickiem, ze sprite'em
  gracza).

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
koala load "pictures/title.kla" # walidacja i osadzanie w czasie kompilacji
koala show # przejście do trybu wielokolorowego bitmapy
koala hide # powrót do domyślnego wyświetlania tekstu
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

### Układ kodu: `org` — nowość w wersji 1.5.7

```basic
sub a() ... koniec # subskrypcje/funkcje są umieszczane jedna po drugiej od końca głównego bloku
org $4000 # kolejne subskrypcje/funkcje są kontynuowane od $4000; $xxxx-$3FFF pozostaje wypełnione zerami
sub b() ... koniec
incbin "font.bin", $3800 # dane mogą znajdować się w luce ($3800-$3FFF to cały slot zestawu znaków VIC)
```

`org addr` przechodzi **między definicje sub/fn** (jest ignorowany w treści
głównej i działa tylko w drugim przebiegu). Podprogramy nigdy nie przechodzą
jedna w drugą, więc pominięte bajty są po prostu wypełnione zerami i
zarezerwowane: `incbin "f", addr`, który leży całkowicie wewnątrz luki, jest w
nią zapisywany, a `charset on` nie traktuje luki jako kodu. Bajty zerowe są
częścią `.prg`. `org` poniżej bieżącego końca kodu jest błędem kompilacji.
Wszystko wygenerowane po ostatnim podprogramie (programy pomocnicze, tabele
`data`) następuje po ostatnim podprogramie, tj. ląduje nad luką.

### Niestandardowy zestaw znaków (`charset on` / `charset off` nowe w wersji 1.5.7)

```basic
charset $3800 # ustaw adres bazowy dla chardef (domyślnie $3800)

chardef 65 # zdefiniuj ponownie znak 65 („A”)
$18,$3C,$66,$7E,$66,$66,$66,$00
koniec

chardef 66 # mniej niż 8 bajtów uzupełnionych zerami
$7C,$66,$7C,$66,$7C
koniec
```

`charset base` ustawia adres docelowy używany przez wszystkie kolejne instrukcje
`chardef`. `chardef id ... end` osadza 8 bajtów w segmencie kodu (poprzedzonych
przez `JMP`, aby je pominąć), a następnie kopiuje je do `charset_base + id*8` w
czasie wykonywania. Wartości muszą być stałymi czasu kompilacji zapisanymi jako
`$xx` lub w systemie dziesiętnym. Literały binarne **`%` nie są obsługiwane**
przez lekser (w podręczniku do wersji 1.5.7 było to błędne).

`charset addr` ustawia tylko cel `chardef`; nie emituje żadnego kodu. Aby VIC-II
używał tego zestawu, włącz go (i wyłącz ponownie po zakończeniu):
```basic
charset $3800
chardef 1 $FF,$81,$81,$81,$81,$81,$81,$FF end # obramowanie pola
charset on # VIC-II odczytuje znaki z $3800 (matryca ekranu nienaruszona)
...
charset off # powrót do zestawu ROM ($1800 jeśli `małe litery` są aktywne, w przeciwnym razie $1000)
```

`charset on` odczytuje-modyfikuje-zapisuje `$D018` bity 1-3 od ostatniego
`charset addr` (domyślnie `$3800`); bity macierzy ekranu są zachowywane. Adres
musi być wielokrotnością `$800` w banku VIC 0 (`$0000-$3FFF`), w przeciwnym
razie występuje błąd kompilacji. Oba polecenia używają `charset addr`, który
został skompilowany jako ostatni, więc dyrektywa powinna pozostać w treści
programu głównego (treści podprogramów są kompilowane po niej). Równoważny
surowy zapis to `poke $D018, $1A` dla `$2800` lub `poke $D018, $1E` dla `$3800`.

**Sprawdzanie nakładania się. ** `charset on` zajmuje cały zestaw 2 KB, a każdy
`chardef` swoje 8 bajtów. Jeśli wygenerowany kod dotrze do tego obszaru,
kompilacja zostaje zatrzymana. `the program code ($080D-$xxxx) overlaps the
charset area $2800-$2FFF; move the charset ...`. Dlatego duże programy
potrzebują zestawu znaków nad kodem (`charset $3800`) — lub użyj `org`
(powyżej), aby kod mógł być kontynuowany nad zestawem. Dane umieszczone w luce
`org` (`incbin ..., addr`) nie są liczone jako kod.

### Pamięć

```basic
poke $D020, 2 # STA $D020
poke addr_var, 6 # STA (addr_var),Y — jeśli addr_var jest typu słowa
var v = peek($D012) # LDA $D012
var v = peek(addr_var) # LDA (addr_var),Y — jeśli addr_var jest typu słowa

var w: word = peek16($C000) # odczyt 16-bitowego little-endianu: lo=$C000, hi=$C001
poke16 $0314, $EA81 # zapis 16-bitowego little-endianu: lo→$0314, hi→$0315
poke16 ptr, w # słowo var jako adres; słowo var jako wartość

var k = 2
var p = peek($07F8 + k) # LDA $07F8,Y — stała + zmienna bajtowa
poke $07F8 + k, p # STA $07F8,Y
poke ptr + k, 1 # słowo + bajt: pełny adres 16-bitowy
```

`peek16(addr)` odczytuje dwa kolejne bajty (lo, hi) jako `word`. `poke16`
zapisuje lo, a następnie hi.

Adres jest zawsze wartością 16-bitową. Od wersji 1.6.5 wyrażenie adresu, takie
jak `$07F8 + k`, zachowuje wyższy bajt stałej i przeniesienie (wcześniej było
ono obliczane w 8 bitach, a `peek($07F8 + k)` odczytało `$00F8 + k`). Dotyczy to
następujących długości: `peek`, `poke`, `peek16`, `poke16`, `fill`, `memcopy`,
`drawmem`, `save` i `reu`; długości `fill` / `memcopy`, takie jak `40 * rows`,
również są 16-bitowe. `peek(k)` ze zmienną bajtową odczytuje adres `$00kk`
(przed wersją 1.6.5 zwracał wartość samego adresu `k`.

### Wejście/wyjście dysku

```basic
załaduj "PROGRAM" # KERNAL LOAD: ładuje plik z urządzenia 8 pod jego adres natywny
załaduj "DATA", $C000 # ładuje plik pod określony adres
łańcuch "GRA" # załaduj inny program nad tym i URUCHOM go (patrz poniżej)
załaduj "DATA", ptr # adres ze zmiennej word

zapisz "DATA", $C000, 4096 # KERNAL SAVE z $C000, 4096 bajtów → urządzenie 8
zapisz "PROG", start, len # adres i len ze zmiennych word/int
```

`load` wywołuje KERNAL `SETNAM`+`SETLFS`+`LOAD` (`$FFBD`/`$FFBA`/`$FFD5`). Bez
adresu: adres pomocniczy 1 (adresem ładowania jest własny 2-bajtowy nagłówek
pliku). Z adresem: adres pomocniczy 0 (plik jest ładowany pod podany adres, jego
nagłówek jest pomijany). (Naprawiono w wersji 1.5.9 — wcześniej te dwie wartości
były zamienione: `load "F"` loaded to `$0000`.) `save` wywołuje
`SETNAM`+`SETLFS`+`SAVE` (`$FFBD`/`$FFBA`/`$FFD8`). Wymaga zarówno `addr`, jak i
`len`.

#### Łączenie z innym programem — `łańcuch` (nowość w wersji 1.5.9)

```basic
łańcuch "GRA" # załaduj GRĘ z dysku, z którego została uruchomiona i URUCHOM ją
łańcuch "GRA", 9 # z dysku 9 (dowolne wyrażenie)
drukuj "BŁĄD WCZYTANIA" # osiągnięty tylko wtedy, gdy nie można załadować pliku
```

`łańcuch` ładuje inny program pod swój własny adres ładowania — normalnie
`$0801`, tuż nad działającym programem — i uruchamia go dokładnie tak, jakby
wpisano `LOAD"GAME",8,1` i `RUN`. Tego właśnie potrzebuje program
rozruchowy/tytułowy. Zwykły `load` tego nie zrobi: załadowany plik nadpisałby
kod wykonujący `load`.

Jak to działa:

- 46-bajtowy, niezależny od pozycji moduł ładujący wraz z nazwą pliku jest
  kopiowany do bufora kasety (`$033C`), do którego nie ładuje się ani program
  Ultimate Basic, ani plik spakowany przez Exomizer.
- Przedtem maszyna zostaje przywrócona do stanu czystego: przerwania VIC
  wyłączone, wolumin SID 0, `IOINIT` (`$FDA3`: timery CIA, przerwanie
  klawiatury, magistrala szeregowa), `RESTOR` (`$FF8A`: domyślne wektory
  IRQ/BRK/NMI i I/O), `$01 = $37`. Niestandardowe przerwania rastrowe,
  `odtwarzanie muzyki` i `nmi` zostają zatrzymane. Ekran, kolory i rejestry
  banku VIC inne niż `$DD00` pozostają bez zmian, dzięki czemu obraz może
  pozostać na ekranie podczas ładowania następnego programu (`IOINIT` wybiera
  bank VIC 0).
- Program ładujący wywołuje `SETNAM` / `SETLFS` (pomocniczy 1) / `LOAD`. Bez
  argumentu urządzenia używa dysku, z którego załadowano sam program (`$BA`),
  czyli dysku 8.
- Po pomyślnym załadowaniu ustawia wskaźnik końca programu (`$2D/$2E`), ponownie
  inicjuje BASIC (`$E453`, `$E3BF` — samorozpakowujący się program do
  przetwarzania plików, taki jak Exomizer `sfx`, mógł korzystać ze strony
  zerowej BASIC-a) i uruchamia program (`$A659`, `$A7AE`). Działa zarówno z
  programami Ultimate Basic, plikami skompresowanymi (`exomizer sfx sys`), jak i
  zwykłymi programami BASIC.
- Jeżeli pliku nie można załadować (nie znaleziono, brak napędu), `chain` zwraca
  kod i program kontynuuje działanie od następnego polecenia.

Nazwa pliku musi być ciągiem znaków o długości od 1 do 16 znaków.

### Plik wejścia/wyjścia kanału szeregowego

```basic
open 1, 8, 2, "MYFILE" # otwórz plik logiczny 1, urządzenie 8, drugorzędny 2, nazwa "MYFILE"
open 2, 4, 7 # otwórz drukarkę (urządzenie 4), bez nazwy pliku
open ch, dev, sec # kanał, urządzenie, drugorzędny ze zmiennych

print# 1, "HELLO" # wyślij "HELLO"+CR do pliku logicznego 1
print# ch, x, "text" # dowolna kombinacja zmiennych, ciągów znaków — to samo co print, ale do pliku

close 1 # zamknij plik logiczny 1
close ch # kanał ze zmiennej
```

`open` wywołuje `SETNAM` ($FFBD) + `SETLFS` ($FFBA) + `OPEN` ($FFC0). Bez nazwy
pliku wywoływana jest funkcja SETNAM o długości 0. `print#` kieruje wyjście
przez `CHKOUT` ($FFC9), CHROUT według znaku (+ końcowy CR), a następnie `CLRCHN`
($FFCC). `close` umieszcza numer kanału w A i wywołuje `CLOSE` ($FFC3).

### Wejście

```basic
wprowadź wynik # odczytaj do 3 cyfr z klawiatury → 8-bitowa zmienna int
wprowadź „Nazwa: ”, nazwa # opcjonalny ciąg monitu, następnie odczytaj wiersz → ciąg zmienna
wprowadź „Wynik: ”, wynik # monit + int input
```

`input` używa KERNAL BASIN (`$FFCF`) do blokowania i powtarzania sygnału
wejściowego z obsługą DEL.
- **Int var**: akceptuje tylko `0`–`9`, maks. 3 znaki; konwertuje na wartość
  8-bitową w CR.
- **Zmienna łańcuchowa**: akceptuje do 30 znaków; zapisuje jako łańcuch
  zakończony zerem; para ZP zostaje zaktualizowana.
- **FLOAT var** (1.6.3): cyfry i `.`, np. `12,5` → 12,50 (dwie cyfry po
  przecinku).
- **POJEDYNCZA / PODWÓJNA zmienna ** (1.6.4): dowolna liczba, `-12,5 `, `.5 `,
  `3,25E2 `.
- **Element tablicy** (1.6.3): `wejście t(i)` / `wejście nevek(i)`; `wejście
  „prompt”; x` również działa.
- **String var**: akceptuje do 30 znaków; zapisuje jako string zakończony zerem;
  para ZP zostaje zaktualizowana.

### Zmiennoprzecinkowy / stałoprzecinkowy

Zmienne `float` korzystają z formatu stałoprzecinkowego Q8.8: wyższy bajt jest
częścią całkowitą (0–255), a niższy bajt jest częścią ułamkową (0/256 …
255/256).

```basic
var f: float = 3,5 # 3,5 → hi=3, lo=128 (= 0x0380)
var g: float = 0 # liczba całkowita 0 jest automatycznie promowana do 0,0

f = 1,5 # przypisanie literału Q8.8
f = f + 1,5 # 16-bitowa arytmetyka Q8.8 (wynik: 3,0)
f = f + g # float + float

var n = int(f) # wyodrębnienie części całkowitej (bajt hi) → 8-bit int
print f # drukuje jako „N.DD” (np. 3,5 → „3,50”, 1,25 → „1,25”)
```

| Działanie          | Przykład             | Notatki                                           |
| ------------------ | -------------------- | ------------------------------------------------- |
| Dosłowny           | `3,5`, `0,25`, `1,0` | przeanalizowano jako Q8.8 w czasie kompilacji     |
| Promocja całkowita | `f = 5`              | przechowuje 5,0 (hi=5, lo=0)                      |
| Dodaj/subskrybuj   | `f + 1,5`, `f - g`   | 16-bitowa arytmetyka Q8.8                         |
| Wyodrębnij int     | `int(f)`             | zwraca wysoki bajt jako 8-bitową liczbę całkowitą |
| Wydrukować         | `drukuj f`           | format „N.DD”, zawsze 2 cyfry ułamkowe            |

**Uwaga:** Przepełnienie arytmetyczne kończy się na 255,255 (brak nasycenia).
Mnożenie i dzielenie dwóch zmiennych zmiennoprzecinkowych nie jest jeszcze
obsługiwane — w takich przypadkach należy użyć `int()` + arytmetyki
całkowitoliczbowej.

**Drukowanie wyrażeń zmiennoprzecinkowych (naprawiono w wersji 1.5.7).** `print`
wyrażenia arytmetycznego zawierającego `float` (na przykład `print a / 10` z `a:
float = 1`) teraz drukuje wynik Q8.8 jako `N.DD`. Przed wersją 1.5.7 drukowanie
surowej 16-bitowej wartości jako liczby całkowitej (`25` zamiast `0.09`). Ułamek
jest obcięty, a nie zaokrąglony: 1/10 = 25/256 drukuje się jako `0.09`.

### Liczba zmiennoprzecinkowa: `POJEDYNCZA` / `PODWÓJNA` (1.6.4)

`dim x jako single` i `dim x jako double` to rzeczywiste liczby
zmiennoprzecinkowe — 5-bajtowy format języka C64 BASIC: około 9 cyfr znaczących,
zakres ±2,9·10⁻³⁹ … ±1,7·10³⁸. (`single` i `double` to ten sam typ). Szybki
2-bajtowy typ Q8.8 jest nadal dostępny jako `float`.

```basic
DIM r JAKO PODWÓJNA, t JAKO PODWÓJNA
DIM k(9) JAKO POJEDYNCZA ' tablice: 5 bajtów na element
r = 2,5
t = ATN(1) * 4 * r ^ 2 ' 19,6349541
PRINT t; " "; SQR(2); " "; 1E10; " "; 1 / 3
DLA r = 0 DO 1 KROK 0,25 : PRINT r : NEXT
FUNKCJA Atfogo (a JAKO PODWÓJNA, b JAKO PODWÓJNA) JAKO PODWÓJNA
Atfogo = SQR(a * a + b * b)
KONIEC FUNKCJI
```

|                      |                                                                                                                                                                                      |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Operatorzy           | `+ - * /` i `^` (potęga; prawostronna łączna, wiąże mocniej niż unarny minus: `-2^2` = -4)                                                                                           |
| Funkcje              | `SQR`, `SIN`, `COS`, `TAN`, `ATN` (radiany), `EXP`, `LOG` (naturalny), `INT` (podłogowy), `FIX` (obcięty), `CINT` (okrągły), `ABS`, `SGN`, `CSNG` / `CDBL` (bez operacji), `WARTOŚĆ` |
| Literały             | `1,5`, `.5`, `1E6`, `2,5e-3`, `70000`                                                                                                                                                |
| Porównania           | `= &lt;&gt; &lt; &gt; &lt;= &gt;=` w `JEŻELI` / `PRZYCZAS` / `DOPÓKI` / `WYBIERZ PRZYPADEK` i jako wartości                                                                          |
| Druk                 | Styl C64 BASIC: `.5`, `-3,25`, `3,33333333`, `1E+10`, `1,5E-07` (bez początkowej spacji)                                                                                             |
| Smyczki              | `s = "X=" + x`, `STR$(x)`, `VAL(s)` odczytuje `-1,25E3`                                                                                                                              |
| `DLA`                | licznik zmiennoprzecinkowy, limit i krok (`KROK 0,1`, ujemny lub zmienna)                                                                                                            |
| `WEJŚCIE` / `ODCZYT` | `INPUT x` odczytuje dowolną liczbę; `READ x` odczytuje następny `bajt danych`                                                                                                        |
| Podfunkcja           | Parametry `p AS DOUBLE` i wyniki `AS DOUBLE`                                                                                                                                         |

**Mieszanie z liczbami całkowitymi.** Wyrażenie jest obliczane w liczbach
zmiennoprzecinkowych, gdy zawiera wartość POJEDYNCZĄ / PODWÓJNĄ, `^`, jedną z
powyższych funkcji lub literał, który może być przechowywany tylko w liczbach
zmiennoprzecinkowych (`1E6`, `300,5`, `70000`). Gdy program używa liczb
zmiennoprzecinkowych, każdy literał dziesiętny (`0,1`) jest również stałą
zmiennoprzecinkową. Przechowywanie wartości zmiennoprzecinkowej w `bajcie`,
`liczbie całkowitej` lub `słowie` powoduje **zaokrąglenie** jej (w połowie od
zera: 2,5 → 3, -2,5 → -3); w `liczbie zmiennoprzecinkowej` wartość ta przyjmuje
postać Q8,8. Wartość całkowita przypisana do typu DOUBLE jest konwertowana
dokładnie. Wyrażenia całkowite zachowują swoje reguły dotyczące liczb
całkowitych (`var c = a + b` to nadal bajt).

**Notatki**
- Całkowitoliczbowy literał od 32768 do 65535 jest odczytywany jako 16-bitowy
  wzorzec i staje się ujemny w kontekście zmiennoprzecinkowym: zapisz `40000.0`
  lub `4E4`.
- `7 / 2` wynosi 3,5, gdy jest przypisane do typu DOUBLE; w kontekście liczb
  całkowitych wynosi 3, jak poprzednio.
- `x MOD y` i `AND` / `OR` / `XOR` zaokrąglają swoje operandy do liczb
  całkowitych.
- `SIN` / `COS` wartości bajtu zachowują stare znaczenie tablicy 0–255 (pełne
  koło = 256); z argumentem POJEDYNCZYM / PODWÓJNYM działają w radianach.
- Kod zmiennoprzecinkowy nie może być uruchamiany w obsłudze IRQ / NMI
  (środowisko wykonawcze przechowuje swój stan w stałej pamięci RAM).
- Koszt: środowisko wykonawcze dla operacji zmiennoprzecinkowych (około 4,4 KB,
  asemblowane przez kompilator) jest dołączane po programie przy pierwszym
  użyciu funkcji SINGLE/DOUBLE. Zmienne zajmują 5 bajtów w obszarze tablicy plus
  jeden 2-bajtowy wskaźnik strony zerowej na środowisko wykonawcze. Mnożenie
  trwa około 1–2 ms na procesorze C64 1 MHz.

### Zmienne w pamięci RAM, pamięci tablicowej (1.6.4)

- **Strona zerowa zapełniona: ** gdy zmienne programu nie mieszczą się na
  trwałej stronie zerowej (`$02-$4F`), kompilator kompiluje ją ponownie i
  przenosi zmienne, które są najmniej używane w kodzie gorącym, do normalnej
  pamięci RAM (po tablicach). Instrukcja używająca takiej zmiennej kopiuje ją do
  slotu strony zerowej i z powrotem, więc programy zachowują się tak samo, tylko
  te zmienne są nieco wolniejsze. Liczniki pętli, parametry i wszystko, czego
  może dotknąć program obsługi przerwań IRQ, pozostaje na stronie zerowej. Mapa
  pamięci pokazuje je jako `RAM:$xxxx`. Wyczerpanie strony zerowej nie jest już
  błędem, z wyjątkiem skrajnych przypadków (w takich przypadkach pozostaje `brak
  strony zerowej`).
- Pamięć tablicowa **: Tablice ** (i zmienne rozlane/zmiennoprzecinkowe) używają
  `$C000-$CFFF`. Gdy potrzebują więcej niż 4096 bajtów, obszar zaczyna się od
  `$A000`, dając 12 KB (`$A000-$CFFF`): pamięć ROM języka BASIC jest wyłączana
  na początku programu (bit 0 `$01`) i włączana ponownie przy każdym wyjściu do
  języka BASIC (`koniec`, `pa`, koniec programu, `łańcuch`), więc program nadal
  wraca do działającego języka BASIC. Programy, które same wywołują procedury
  ROM BASIC (`sys $Axxx`) nie mogą używać tablic większych niż 4 KB.

### Funkcje matematyczne

```basic
var a = abs(x - 20) # wartość bezwzględna w uzupełnieniu do dwóch
var b = min(x, 39) # minimum 8-bitowe
var c = max(x, 0) # maksimum 8-bitowe
var s = sgn(score) # 0 = zero, 1 = dodatnie (1–127), $FF = ujemne (128–255)
var r = rnd() # pseudolosowy LCG 0–255; ziarno z linii rastrowej
var r = rnd(10) # pseudolosowy LCG 0-9 (rnd() mod n; wynik 0..n-1)
var s = sin(kąt) # sinus: kąt 0-255 (pełne koło), zwraca 0-255 (środek = 128)
var c = cos(kąt) # cosinus = sin(kąt+64)
var v = clamp(x, 0, 39) # 8-bitowy zacisk bez znaku: wynik = max(lo, min(hi, val))

print hex(n) # wydrukuj jako 2-cyfrowy, wielki hex
print bin(n) # wydrukuj jako 8-bitowy ciąg binarny
```

### Funkcje łańcuchowe

```basic
var n = len(msg) # długość ciągu zakończonego zerem var (0–255)
var c = asc(msg) # kod PETSCII pierwszego znaku (0, jeśli pusty)
var c = asc("A") # w czasie kompilacji: stały kod PETSCII
var n = val(s) # w czasie wykonania: parsowanie dziesiętnego ciągu PETSCII → 8-bitowej liczby całkowitej (np. "042" → 42)
var c = msg[i] # znak ciągu o indeksie i: kod PETSCII msg[i]
msg[i] = c # zapisz bajt PETSCII c do ciągu o indeksie i — STA (ptr),Y
msg[0] = 72 # stały indeks → LDY #0; STA (ptr),Y
```

### Formatowanie liczb

```basic
print hex(n) # wydrukuj jako 2-cyfrowy, wielki ciąg szesnastkowy
print bin(n) # wydrukuj jako 8-bitowy ciąg binarny
print dec(n, 4) # liczba dziesiętna wyrównana do prawej w polu 4 znaków (np. 42 → "42")
print dec(n, width) # szerokość może być również zmienną
```

`dec(n, width)` uzupełnia liczbę po lewej stronie spacjami, aby wypełnić `width`
znakami. Jeśli liczba ma więcej cyfr niż `width`, jest drukowana bez dopełnienia
(bez obcinania). W kontekstach innych niż drukowanie `dec(n, w)` jest generowany
jako `n` bez zmian (tak samo jak `hex`/`bin`).

### REU (jednostka rozszerzenia pamięci RAM)

```basic
var ok = reu_present() # 1 jeśli wykryto REU, 0 jeśli nie (test zapisu/odczytu na $DF04)
var ok = reudet() # alias dla reu_present()

reu stash c64addr, bank, reu_addr, len # kopiuj C64 → REU
reu fetch c64addr, bank, reu_addr, len # kopiuj REU → C64
reu swap c64addr, bank, reu_addr, len # zamiana między C64 a REU
```

`reu_present()` wykonuje test zapisu/odczytu rejestru REU `$DF04`. Bez rejestru
REU zapis jest tracony (otwarta magistrala), więc odczyt jest inny — niezawodnie
wykrywa obecność, nie dotykając żadnego rejestru poleceń powodującego efekt
uboczny.

| Parametr    | Szerokość | Notatki                                                          |
| ----------- | --------- | ---------------------------------------------------------------- |
| `adres c64` | 16-bit    | Start pamięci RAM C64 — stała, `word` var lub 8-bitowe wyrażenie |
| `bank`      | 8-bit     | Numer banku REU (0–7 dla jednostki 512 KB)                       |
| `adres_reu` | 16-bit    | Przesunięcie w banku REU                                         |
| `dł.`       | 16-bit    | Bajty do przesłania (`0` = 65 536 w sprzęcie REU)                |

Rejestry REU: polecenie `$DF01` (`$B0` stash / `$B1` fetch / `$B2` swap),
`$DF02–$DF03` adres C64, `$DF04–$DF05` offset REU, `$DF06` bank, `$DF07–$DF08`
długość. Transfer jest synchroniczny (procesor zatrzymany podczas DMA). Wymaga
prawdziwego REU lub VICE: **Ustawienia → Sprzęt → Moduł rozszerzeń pamięci
RAM**.

### Narzędzia pamięci

```basic
Wypełnij ekran 32 # wypełnij pamięć RAM ekranu $0400–$07FF wartością 32 (znak spacji)
Wypełnij kolorem 1 # wypełnij kolorem pamięć RAM $D800–$DBFF wartością 1 (biały)

Wypełnij $0400, 1000, 32 # wypełnij 1000 bajtów, zaczynając od $0400, wartością 32
Wypełnij addr, 256, 0 # addr może być zmienną słowną
Wypełnij ptr, len_word, val # wszystkie operandy mogą być wyrażeniami / zmiennymi słownymi

memcopy $C000, $0400, 256 # skopiuj 256 bajtów z $C000 → $0400
memcopy src_ptr, dst_ptr, 40 # zmienne słowne dla źródła i celu

Drawmem $C000, $0400, 8, 10, 40 # blit 8×10 prostokąt z $C000 → ekran przy $0400, krok 40
drawmem src_ptr, dst_ptr, w, h, 40 # zmienne słów dla src/dst
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
irq my_handler # przerwanie rastrowe w linii 0, handler = nazwa lub adres podrzędny
irq my_handler, 100 # przerwanie rastrowe w linii 100 rastra
irq $C800, 200 # handler pod stałym adresem
irq addr_word # adres handlera ze zmiennej typu word
```

Konfiguruje przerwanie rastrowe IRQ za pomocą wektora programowego BASIC
(`$0314`/`$0315`): wyłącza przerwanie timera CIA1, potwierdza oczekujące
przerwanie VIC, zapisuje wiersz rastrowy do `$D012`, włącza przerwanie rastrowe
VIC (`$D01A=$01`), zapisuje adres obsługi i ponownie włącza przerwania.

Obsługa **musi** kończyć się znakiem `sys $EA81` (koniec IRQ KERNAL) — zwykły
`RTS` lub `RTI` uszkodzi stos. Najpierw potwierdź przerwanie VIC:

```basic
sub my_handler()
poke $D019, $FF # ACK VIC IRQ
# ... działa tutaj ...
sys $EA81 # JMP do KERNAL-a koniec IRQ
koniec
```

Obsługiwane są odwołania do przodu (`irq my_handler` przed zdefiniowaniem
podelementu).

### Obsługa NMI

```basic
nmi my_nmi # ustaw wektor NMI $0318/$0319 na podprogram lub adres obsługi

sub my_nmi()
# ... tutaj działa NMI ...
nmi_exit # JMP $FE47 — poprawne wyjście NMI (przywraca A/X/Y + RTI)
koniec
```

`nmi handler` zapisuje adres handlera do wektora programowego NMI
(`$0318`/`$0319`). Sprzętowy wektor NMI pod adresem `$FFFA` wskazuje na
procedurę NMI KERNAL, która rozgałęzia się do `$0318`. Handler **musi** kończyć
się znakiem `nmi_exit` (emituje `JMP $FE47`) — użycie zwykłego `RTI` spowoduje
uszkodzenie stosu. Obsługiwane są odwołania do przodu.

### Przerwanie timera CIA1

```basic
cia_timer 19656, my_handler # CIA1 timer A: uruchamiany co 19656 cykli (~50 Hz PAL)
cia_timer okres, handler # okres może być zmienną lub wyrażeniem
```

Konfiguruje timer CIA1 A jako okresowe źródło IRQ za pomocą wektora programowego
BASIC (`$0314`/`$0315`):
1. SEI — wyłącz przerwania
2. `$DC0D = $7F` — wyłącz wszystkie przerwania CIA1
3. Załaduj 16-bitowy okres lo→`$DC04`, hi→`$DC05`
4. Adres obsługujący wpisz do `$0314`/`$0315`
5. `$DC0D = $81` — włącz przerwanie IRQ A timera CIA1
6. `$DC0E = $01` — uruchom timer A w trybie ciągłym
7. CLI — ponowne włączenie przerwań

Obsługujący musi kończyć się znakiem `irq_exit` (lub `sys $EA81`) i powinien
potwierdzić przerwanie CIA1:

```basic
sub my_handler()
poke $DC0D, $01 # ACK CIA1 timer A IRQ (odczyt również go czyści)
# ... działa tutaj ...
irq_exit # JMP $EA81: przywróć A/X/Y + RTI
koniec
```

Taktowanie PAL: zegar = 985 248 Hz. Okres dla 50 Hz = 985 248 / 50 = 19 705
cykli ≈ `$4CC9`. Obsługiwane są odniesienia do przodu.

### Obsługa błędów

```basic
onerr goto err_handler # ustaw wektor błędów wejścia/wyjścia jądra ($0300/$0301) na etykietę

...

etykieta err_handler
drukuj "BŁĄD wejścia/wyjścia"
pa
```

`onerr goto label` zapisuje adres etykiety (lo, hi) do lokalizacji KERNAL
`$0300` i `$0301`. W przypadku wystąpienia błędu wejścia/wyjścia KERNAL (np.
nieudanego `load` lub `open`), KERNAL wykonuje `JMP ($0300)`, co powoduje
przejście do etykiety. Obsługiwane są odwołania do przodu (etykieta zdefiniowana
po `onerr goto`).

### Osadzanie plików w czasie kompilacji (`incbin` pominięcie / długość nowe w wersji 1.5.7)

```basic
incbin "sprites.bin" # osadź surowe bajty binarne w bieżącej pozycji kodu
incbin "charset.bin", $2000 # osadź pod adresem bezwzględnym, uzupełniając w razie potrzeby
incbin "font.prg", $3C00, 2 # ...pomiń pierwsze 2 bajty (np. adres ładowania .prg)
incbin "big.bin", $4000, 16, 256 # ...pomiń 16 bajtów, a następnie pobierz maksymalnie 256 bajtów
include "defs.ub" # wstaw inny plik źródłowy .ub (zoptymalizowany pod kątem leksyki i analizy składniowej w miejscu)
```

`incbin "file", addr, skip [, length]` pomija pierwsze `skip` bajtów pliku
(zwykle 2-bajtowy adres ładowania `.prg`) i opcjonalnie przyjmuje maksymalnie
`length` bajtów; `skip` i `length` to stałe, a `skip` poza końcem pliku to błąd.
Forma adresu wymaga, aby cel znajdował się nad wygenerowanym kodem — lub w
przerwie `org`.

### Dane / Odczyt

```basic
dane 1, 2, 3, 255 # stała tabela bajtów
odczyt nazwy_zmiennej # wczytanie kolejnego bajtu do nazwy_zmiennej (deklaracja automatyczna w razie potrzeby)
```

Wszystkie wartości `data` są zbierane w momencie kompilacji. 2-bajtowy wskaźnik
ZP jest automatycznie przydzielany i inicjowany na początku programu. Każde
`read` przesuwa wskaźnik do przodu.

**Zainicjowane tablice — `dane <tablica>: …` (nowość w wersji 1.5.8)**

```basic
var sinus = array(8)
data sinus: 128, 218, 255, 218
data sinus: 128, 37, 0, 37 # kolejne wiersze są kontynuowane w miejscu, w którym zakończył się poprzedni
print sinus[i] # dostęp losowy, jak w przypadku każdej tablicy

var xpos = array_word(2)
data xpos: 24, 300 # tablice słów przyjmują wartości 16-bitowe (zapisane lo, hi)
```

Wiersz `data`, którego pierwszym elementem jest `name:`, wypełnia zadeklarowaną
tablicę `array` / `array_word` zamiast strumienia `read`. Wartości są zapisywane
po kodzie i kopiowane do tablicy jednorazowo na początku programu (zaraz po
wyzerowaniu tablic), dzięki czemu tabela jest w pełni zapisywalna i indeksowana
jak każda inna tablica. Wiersz zawierający więcej wartości niż mieści tablica
lub niezadeklarowana nazwa jest błędem kompilacji. Te wiersze nie wpływają na
`read`.

### Montaż liniowy

```basic
sys $FFD2 # JSR $FFD2
sys $FFD2, 7 # LDA #7 ; JSR $FFD2 (wartość bajtu przekazującego w rejestrze A)
irq_exit # JMP $EA81 — prawidłowe wyjście obsługi przerwań IRQ (przywrócenie A/X/Y + RTI)
asm $EA, $EA # wbudowane surowe bajty (NOP NOP) — starsza forma
asm {
; Pełne mnemoniki i tryby adresowania 6502
LDA #$07 ; natychmiastowe
STA $0286 ; bezwzględne
LDA $50 ; strona zerowa ($50 ≤ $FF → ZP wybierane automatycznie)
STA $0400,X ; bezwzględne, indeksowane X
LDA ($50),Y ; (pośrednio),Y
LDA ($50,X) ; (pośrednio,X)
JSR $FFD2 ; wywołanie podprogramu
JMP $C000 ; skok bezwzględny
JMP ($FFFC) ; skok pośredni

CLC
ADC #1
SEC
SBC #1

TAX ; domyślny / transfer
ASL A ; akumulator (również po prostu: ASL)
LSR A
ROL
ROR

; Rozgałęzienia — operand jest adresem bezwzględnym; przesunięcie jest obliczane automatycznie
Pętla BNE ; rozgałęzienie w przód lub w tył do etykiety lokalnej
BEQ done

loop:
NOP
done:
RTS

; #<etykieta / #>etykieta — lo / hi bajt adresu etykiety
LDA #<handler
STA $0314
LDA #>handler
STA $0315

; * — bieżąca lokalizacja zestawu
JMP *

; Surowe bajty szesnastkowe (wstecznie kompatybilne ze starą składnią asm { $xx ... })
$EA $EA ; dwa bajty NOP
}
```

**Tryby adresowania:**

| Składnia       | Tryb           | Bajty | Przykład                     |
| -------------- | -------------- | ----- | ---------------------------- |
| (bez operandu) | Ukryty         | 1     | `NOP`, `RTS`                 |
| `A`            | Akumulator     | 1     | `ASL A`, `LSR`               |
| `#wartość`     | Natychmiastowy | 2     | `LDA #$07`                   |
| `$zz` (0–255)  | Strona zerowa  | 2     | `LDA 50 dolarów`             |
| `$zz,X`        | ZP,X           | 2     | `LDA 50 USD,X`               |
| `$zz,Y`        | ZP,Y           | 2     | `LDX 50 dolarów,Y`           |
| `$xxxx`        | Absolutny      | 3     | `LDA $0400`                  |
| `$xxxx,X`      | Absolute,X     | 3     | `LDA $0400,X`                |
| `$xxxx,Y`      | Absolute,Y     | 3     | `LDA $0400,Y`                |
| `($xxxx)`      | Pośredni       | 3     | `SKOCZ ($FFFC)`              |
| `($zz,X)`      | (pośrednio, X) | 2     | `LDA (50$,X)`                |
| `($zz),Y`      | (pośrednio), Y | 2     | `LDA (50 USD),Y`             |
| `etykieta`     | Względny       | 2     | `BNE label` (tylko oddziały) |

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
poke $D020, border_col # UltimateBasic rozwiązuje adres ZP
poke $D021, bg_col
asm {
; wartości są już w $D020 / $D021
LDA $D020
}
koniec
```

W przypadku procedur, których całe ciało składa się z kodu asemblera — zwłaszcza
procedur obsługi przerwań IRQ, które muszą się wzajemnie odwoływać — umieść
wszystkie procedury obsługi w **pojedynczym bloku najwyższego poziomu `asm {
}`** w programie głównym. Etykiety w tym samym bloku współdzielą zakres, więc
`irq1` i `irq2` mogą się swobodnie do siebie odwoływać. Zobacz
`examples/raster_irq_demo.ub`.

### Ciąg ↔ liczba całkowita

```basic
numstr score, $0340 # zapisuje "042\0" w $0340 (zawsze 3 cyfry, uzupełnione zerami)
var n = str_to_int("42") # w czasie kompilacji: Expr::Number(42)

print str$(score) # wypisuje 8-bitową liczbę całkowitą jako 3-cyfrowy ciąg dziesiętny ("000"–"255")
print "Score: " + str$(score) # można używać w kontekście łączenia ciągów znaków
var s: string = str$(n) # przypisuje wynik str$() do ciągu znaków var (współdzielony bufor statyczny)
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

| Plik                                | Opis                                                                                                          |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `przykłady/funkcje.ub`              | const, label/goto, poke/peek, rnd, funkcje matematyczne                                                       |
| `przykłady/nowe_funkcje.ub`         | podparametry, tablice, zmienne słowne, zmienne łańcuchowe                                                     |
| `examples/bitmap_demo.ub`           | Mapa bitowa 320×200, wykres, grafika włączona/wyłączona                                                       |
| `examples/block_demo.ub`            | Grafika blokowa 80×50, plot4, circle4, grafika na bloku                                                       |
| `examples/joystick_demo.ub`         | odczyt joysticka, ruch sprite'ów                                                                              |
| `examples/mux_demo.ub`              | multiplekser sprite'ów rastrowych (3 okna × 8 sprite'ów = 24)                                                 |
| `examples/orbit_demo.ub`            | Orbita składająca się z 24 duszków, pulsującego promienia i losowych kolorów                                  |
| `examples/plasma_demo.ub`           | animacja bitmapy z efektem plazmy i obramowaniem paska rastrowego                                             |
| `examples/sprite_data.ub`           | sprdef shape data (zawarte w innych demach)                                                                   |
| `przykłady/sprite_mux_orbit.ub`     | Demo orbity 24-sprite'ów z spredef + wstępnie obliczonymi pozycjami                                           |
| `przykłady/sprite_orbit_demo.ub`    | 8 sprite'ów sprzętowych na orbicie kołowej za pomocą tabeli sin/cos                                           |
| `examples/reu_bitmap_demo.ub`       | Schowek/pobieranie REU z grafiką bitmapową                                                                    |
| `przykłady/sid_music_demo.ub`       | Odtwarzacz muzyczny SID z rastrowym IRQ i wyjściem klawiatury                                                 |
| `przykłady/tenprint.ub`             | 5 implementacji labiryntu TENPRINT z menu; demonstracje trybu zestawów znaków `lowercase`                     |
| `examples/countdown_demo.ub`        | Odliczanie `for..next` z krokiem ujemnym, w tym `for i = 20 to 0 step -2`                                     |
| `examples/countdown_errors_demo.ub` | Błąd kompilacji dla kroku domyślnego `from > to`                                                              |
| `examples/explicit_demo.ub`         | `--explicit` Demo flagi CLI z w pełni wpisanymi `var`, `sub`, `fn`                                            |
| `przykłady/explicit_errors_demo.ub` | Luźny kod, który kompiluje się bez `--explicit`, powodując błędy                                              |
| `examples/dim_demo.ub`              | `DIM … AS …` skalary i tablice każdego typu                                                                   |
| `przykłady/qbasic_demo.ub`          | FUNKCJA / SUB / ELSEIF / DO-LOOP / SELECT CASE / ciągi znaków w stylu QBasic                                  |
| `examples/float_demo.ub`            | Funkcja zmiennoprzecinkowa POJEDYNCZA / PODWÓJNA: `^`, SQR, SIN, ATN, EXP, LOG, `FOR … STEP 0.5`, `AS DOUBLE` |

## Odniesienie do interfejsu wiersza poleceń

```
ub build <input.ub> [OPCJE]

-o, --output <plik> Wyjście pliku .prg lub .crt (domyślnie: <input>.prg)
-v, --verbose Wyświetlanie układu zerowej strony i zrzutu kodu w formacie szesnastkowym
--no-stub Pomijanie szczątkowego kodu BASIC SYS (kod ładowany w $0801)
--debug Wygenerowanie również plików debugera .sym, .dbg i .vs
--asm Wygenerowanie również czytelnego pliku .asm codegen 6502
--d64 [plik] Wygenerowanie również obrazu dysku .d64;
bez nazwy pliku domyślnie <output>.d64
--add <plik> Dodanie dodatkowego pliku do obrazu dysku .d64;
można powtórzyć dla wielu plików
--explicit Wymaganie :type dla każdej zmiennej / podparametru / parametru funkcji
-h, --help Wyświetlanie pomocy
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

| Formularz deklaracji                                              | Bez `--explicit`       | Z `--explicit`    |
| ----------------------------------------------------------------- | ---------------------- | ----------------- |
| `var name = expr` (nie `:type`)                                   | ok — typ wywnioskowany | błąd              |
| `var name: int = expr` (lub słowo/liczba zmiennoprzecinkowa/ciąg) | OK                     | OK                |
| `var arr = array(N)`                                              | ok — typ wywnioskowany | błąd              |
| `var arr = array_word(N)`                                         | OK                     | OK                |
| `const NAME = value`                                              | OK                     | ok — bez zmian    |
| `sub foo(a, b)` (parametry nieokreślone)                          | OK                     | ok — bez zmian    |
| `sub foo(a: int, b: int)`                                         | OK                     | ok — bez zmian    |
| `fn foo(a): int` (parametr nieokreślony)                          | OK                     | błąd w parametrze |
| `fn foo(a: int): int`                                             | OK                     | OK                |
| `fn foo(a): int` (parametr bez typu)                              | OK                     | błąd w parametrze |
| `fn foo(a: int): int`                                             | OK                     | OK                |

Deklaracje stałych i tablic są zawsze akceptowane — ich typ jest ustalony w
formie deklaracji, więc `:type` byłoby zbędne.

**Przykładowy wynik błędu:**

```
$ ub build myprog.ub --explicit
Błędy kompilacji:
linia 14: tryb „explicit”: „var loose” nie ma typu — użyj „var loose: int|word|float|string”
linia 16: tryb „explicit”: parametr „a” nie ma typu — użyj „a: int|word|float|string”
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

W przypadku pliku wyjściowego o nazwie `demo.prg`, tworzony jest plik
`demo.asm`. Listing jest generowany na podstawie metadanych zebranych podczas
generowania kodu maszynowego przez Ultimate Basic; nie jest to jedynie
deasemblacja gotowego pliku PRG. Zawiera on:

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
.label x = $02 ; int

* = $080D

ub_start:
cld ; $080D: D8
; UB: var x
lda #$01 ; $080E: A9 01
sta x ; $0810: 85 02
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
demo.ub → demo.prg (386 bajtów)

Obciążenie: $080D – $0989

Zmienne (strona zerowa):
wynik ZP:$08 bajt
życie ZP:$0A bajt
wiadomość ZP:$0C ciąg
wskaźnik ZP:$0E słowo

Podprogramy:
powitanie $0900
pokazanie $0912

Tablice ($C000+):
sprite'y $C000 8 bajtów
```

W przypadku `-v` na wyjściu dodatkowo pokazywane są wewnętrzne przydziały ZP i
pełny zrzut szesnastkowy.

### Wygenerowany kod (zoptymalizowany w wersji 1.6.0)

Generator kodu emituje ściślejsze 6502 w typowych przypadkach; programy nie
wymagają żadnych zmian:

- Warunki w `if` / `while` / `until` / `select` to `CMP` plus gałąź (nie jest
  budowana i ponownie testowana żadna wartość 0/1). `x &gt; n` jest kompilowane
  jako `x &gt;= n+1`; `and` / `lub` porównań powodują zwarcie, gdy prawa strona
  nie ma efektów ubocznych; `while` jest testowane na dole pętli.
- Stałe i zmienne bajtowe to bezpośrednie operandy (`ADC #n`, `CMP zp`); `poke`
  do stałej lub `słowo` przechowuje adresy bezpośrednio.
- Tablice ze zmiennym indeksem używają adresowania `base,Y` zamiast wskaźnika
  zerowej strony.
- Jeśli polecenie rozpoczyna się od załadowania zmiennej, którą poprzednie
  polecenie właśnie zapisało, zbędny `LDA` jest pomijany.

Użyj `--asm`, aby zobaczyć wygenerowany kod własnego programu.

## Znane ograniczenia

| Funkcja                               | Ograniczenie                                                                                                                                                                                                                                                                                                                             |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Arytmetyka liczb całkowitych          | 8-bitowe bez znaku (0–255); `word` zmienne przechowują wartości 16-bitowe                                                                                                                                                                                                                                                                |
| Budżet zerowy                         | Stała strona zerowa to `$02–$4F` (78 bajtów): każda zmienna i parametr sub/fn zajmuje 2 bajty, a każda pętla `for` zajmuje kolejne 2 bajty. Od wersji 1.6.4 zmienne, które się nie mieszczą, są automatycznie przenoszone do pamięci RAM (patrz *Zmienne w pamięci RAM*); tylko skrajne przypadki nadal zgłaszają `brak strony zerowej`. |
| Literały binarne                      | `%01010101` (od wersji 1.6.4), `$hex` i dziesiętny                                                                                                                                                                                                                                                                                       |
| Podprogramy                           | Brak rekurencji — sloty parametrów ZP są przydzielane statycznie                                                                                                                                                                                                                                                                         |
| Zmienne łańcuchowe                    | `single` / `double` to 5-bajtowe liczby zmiennoprzecinkowe od wersji 1.6.4 (nie można ich używać w obsłudze IRQ; do programu dodano środowisko wykonawcze ~4,4 KB); `float` zachowuje Q8.8 (0–255,99)                                                                                                                                    |
| Jednoargumentowy minus                | Od wersji 1.6.4 wiodący `-` wiąże się ze swoim operandem: `-5 - 3` wynosi -8 (było -(5 - 3) = -2)                                                                                                                                                                                                                                        |
| Czas wykonania łączenia ciągów        | `s1 + s2` drukuje sekwencyjnie — bez przydzielania pamięci na stercie ani śledzenia długości                                                                                                                                                                                                                                             |
| `rnd()` / `rnd(n)`                    | Prosty LCG, niekryptograficzny; okres = 256                                                                                                                                                                                                                                                                                              |
| `abs()` / `sgn()` / `min()` / `max()` | Tylko wartości 8-bitowe; `abs`/`sgn` traktuj wartości jako wartości ze znakiem (bit 7 = ujemny → `abs` uzupełnienia do dwóch, `sgn` zwraca `$FF`); `min`/`max` są wartościami bez znaku (0–255)                                                                                                                                          |
| `wykres`                              | Piksele poza zakresem są bezgłośnie przycinane (Y ≥ 200 lub X ≥ 320 → brak operacji)                                                                                                                                                                                                                                                     |
| `plot`                                | Brak sprawdzania granic — x musi mieścić się w przedziale 0–159, y musi mieścić się w przedziale 0–199                                                                                                                                                                                                                                   |
| `mlinia` / `mrect`                    | Wielokolorowy; x: 0–159, y: 0–199. Zawijanie pikseli poza ekranem (bez przycinania) — utrzymuj współrzędne w zakresie                                                                                                                                                                                                                    |
| `mcircle`                             | Wielokolorowy; przycina punkty poza ekranem (x ≥ 160 lub y ≥ 200 są pomijane)                                                                                                                                                                                                                                                            |
| `kolorowy długopis`                   | Tylko do wynajęcia; ustawia fragment pierwszego planu dotkniętych komórek (tło zachowane). Nie ma efektu w trybie blokowym (`plot4`/`circle4`)                                                                                                                                                                                           |
| `prostokąt`                           | Brak sprawdzania granic — x: 0–319, y: 0–199; x1≤x2 i y1≤y2 nie są wymuszane (prostokąty zdegenerowane/odwrócone generują niezdefiniowane dane wyjściowe)                                                                                                                                                                                |
| `wykres4`                             | Brak sprawdzania granic — x musi być w zakresie 0–79, y musi być w zakresie 0–49 (tryb blokowy)                                                                                                                                                                                                                                          |
| `koło4`                               | Przycina piksele bloków poza ekranem; użyteczny promień wynosi około 0–49 w trybie bloku 80×50                                                                                                                                                                                                                                           |
| `chr$`                                | Brak mapowania PETSCII↔ASCII — n jest przekazywane bez zmian do CHROUT                                                                                                                                                                                                                                                                   |
| `odtwarzanie muzyki`                  | Wymaga bloku `load sid` lub `tune`; emitowany jest tylko jeden wrapper CIA1 (ostatnie `odtworzenie muzyki` wygrywa)                                                                                                                                                                                                                      |
| `grafika na podwójnym`                | Tylko wynajem; używa `$4000–$7FFF` jako bufora tylnego, więc kod programu musi znajdować się poniżej `$4400`; nie można łączyć ze sprite'ami ani obiektami wielokolorowymi                                                                                                                                                               |
| Raportowanie błędów                   | Tylko w czasie kompilacji; `onerr goto` obsługuje błędy wejścia/wyjścia KERNAL w czasie wykonywania                                                                                                                                                                                                                                      |
