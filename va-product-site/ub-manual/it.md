# Ultimate Basic v1.5.6 — Manuale della lingua

Manuale completo del linguaggio e della riga di comando per Ultimate Basic, un
linguaggio simile al BASIC che compila direttamente in codice macchina 6502 per
il Commodore 64. Output: file `.prg` (VICE o hardware reale), immagini di
cartucce `.crt` e immagini disco `.d64`.

Per una breve panoramica del progetto e le istruzioni di compilazione,
consultare il file README.md.

© 2026 Zsolt Tarczali

> La compilazione del compilatore `ub` e le opzioni della riga di comando sono
> trattate in [README.md](README.md). Questo manuale documenta il linguaggio
> Ultimate Basic stesso.

## Riferimento linguistico

### Variabili e costanti

**Tutte le variabili devono essere dichiarate con `var` prima dell'uso.**
L'utilizzo di una variabile non dichiarata in un'espressione, un'assegnazione,
un contatore `for`/`loop`, un'istruzione `inc`/`dec`, `input` o `read` produce
un errore in fase di compilazione.

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

**Le parole chiave e gli identificatori non fanno distinzione tra maiuscole e
minuscole: `PRINT`, `Print` e `print` sono tutti validi.**

| Tipo                  | Larghezza          | Note                                                              |
| --------------------- | ------------------ | ----------------------------------------------------------------- |
| `int`                 | 8 bit              | valore predefinito per i letterali numerici                       |
| `word`                | 16 bit             | due byte ZP; possono essere usati come indirizzo in `poke`/`peek` |
| `float`               | Q8.8 a 16 bit      | byte alto = parte intera (0–255), byte basso = parte frazionaria  |
| `string`              | puntatore          | coppia ZP → PETSCII terminato da null nel segmento di codice      |
| `array(N)`            | N byte             | elementi byte; risiede in `$C000+`, non in ZP                     |
| `array_word(N)`       | N×2 byte           | elementi di parola (16 bit); risiede in `$C000+`, non in ZP       |
| `array(R, C, …)`      | ∏dimensioni byte   | multidimensionale (per righe); indice `arr[r, c]`                 |
| `array_word(R, C, …)` | ∏dimensioni×2 byte | matrice di parole multidimensionale (per righe)                   |

### Parole riservate

I seguenti identificatori sono **parole chiave**: non possono essere utilizzati
come nomi di variabili, costanti, subroutine, funzioni, parametri o etichette.
Tutte le corrispondenze non fanno distinzione tra maiuscole e minuscole (`END`,
`end`, `End` sono tutti in conflitto). L'utilizzo di una parola riservata come
nome di solito produce un errore fuorviante (una riga `var` non viene dichiarata
silenziosamente, oppure un'espressione come `for i = 1 to times` viene compressa
in `Number(0)`), quindi scegli un nome diverso.

**Dichiarazione e flusso di controllo** `var`, `const`, `sub`, `fn`, `type`,
`endtype`, `return`, `call`, `label`, `goto`, `gosub`, `if`, `then`, `else`,
`end`, `select`, `case`, `for`, `next`, `loop`, `times`, `to`, `step`, `while`,
`repeat`, `until`, `break`, `continue`, `inc`, `dec`, `bye`, `exit`, `rem`

**Tipi e relativi ai tipi** `int`, `word`, `float`, `string`, `array`,
`array_word`

**Stampa e I/O** `print`, `spc`, `tab`, `at`, `input`, `chr$`, `str$`, `hex`,
`bin`, `open`, `close`, `load`, `save`, `data`, `read`, `include`, `incbin`
(anche `dec` — elencato sopra come istruzione di decremento; lo stesso token
viene utilizzato per il formato di stampa `dec(n, width)`)

**Funzioni matematiche e stringhe integrate** `abs`, `min`, `max`, `clamp`,
`sgn`, `mod`, `rnd`, `sin`, `cos`, `and`, `or`, `xor`, `not`, `bnot`, `shl`,
`shr`, `len`, `asc`, `val`, `str_to_int`, `numstr`

**Memoria e temporizzazione** `poke`, `peek`, `poke16`, `peek16`, `fill`,
`memcopy`, `drawmem`, `wait`, `raster`, `delay`, `sys`, `asm`

**Schermo e testo** `cls`, `fast`, `color`, `text`, `border`, `bg`, `screen`,
`cursor`, `lowercase`, `uppercase`, `display`, `on`, `off`, `scroll`, `speed`,
`badlines`, `turbo`

**Grafica bitmap e a blocchi** `graphics`, `gcls`, `flip`, `plot`, `plot4`,
`mplot`, `mline`, `mrect`, `mcircle`, `line`, `circle`, `circle4`, `rect`,
`paint`, `erase`, `pen`, `multi`, `block`

**Sprite** `sprite`, `sprdef`, `sprite_frame`, `sprite_x`, `sprite_y`, `sprhit`,
`sprbghit`, `box_hit`, `chardef`, `charset`, `expand`, `priority`

**Suoni e musica** `sid`, `sound`, `volume`, `music`, `play`, `pause`, `resume`,
`stop`

**Dispositivi di input** `getch`, `inkey`, `waitkey`, `joy`, `mouse_x`,
`mouse_x_hi`, `mouse_y`, `mouse_btn`

**Interruzioni e vettori** `irq`, `irq_exit`, `nmi`, `nmi_exit`, `cia_timer`,
`onerr`

**Mappe dei personaggi e immagini** `map`, `map_tile`, `map_color`, `koala`,
`show`, `hide`

**REU (espansione RAM)** `reu`, `reudet`, `stash`, `fetch`

**Insidie di stile: nomi che *sembrano* liberi ma sono riservati**

Queste comuni parole inglesi sembrano identificatori innocui ma sono già state
catturate dal lessicografo. Rinominatele per evitare errori silenziosi:

| Prenotato                                   | Rinominare suggerito                |
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

I token simbolici (`+ - * / = == != < > <= >= : , ; ( ) [ ] # $ % @`) non sono
ovviamente utilizzabili negli identificatori.

### Commenti

```basic
# hash comment
rem this is also a comment
var x = 5  # inline comment
var x = 5 : var y = 6  # colon separates statements on one line
```

### Operatori

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

Confronti: `==` `!=` `<` `>` `<=` `>=` (ritorno 1/0)

### Incremento / Decremento

```basic
inc x                    # x = x + 1  (INC zp — single instruction)
dec x                    # x = x - 1  (DEC zp — single instruction)
```

For `word` variables carry is handled: `inc` uses `INC lo; BNE skip; INC hi`;
`dec` uses `LDA lo; BNE skip; DEC hi; DEC lo`.

### Assegnazioni composte

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

### Stampa

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

### Ramificazione

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

`select expr` valuta l'espressione una volta e la confronta con ogni valore
`case` in ordine. Il primo corpo del caso corrispondente viene eseguito e il
controllo salta a dopo `end`. Il corpo opzionale `else:` viene eseguito se
nessun caso corrisponde. Tutti i valori devono essere a 8 bit (0–255).

### Cicli

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

**Regole di direzione per `for`/`loop`:**

| Case                                                   | Comportamento                                                                                                                       |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| `for i = 1 to 10` (predefinito `step +1`, `from ≤ to`) | conta in avanti, standard                                                                                                           |
| `for i = 0 to 20 step 2` (passo positivo, `from ≤ to`) | conta in avanti di 2                                                                                                                |
| `for i = 10 to 1 step -1` (passo costante negativo)    | conto alla rovescia; il corpo corre per i = 10, 9, ..., 1                                                                           |
| `for i = 20 to 0 step -2` (fino a zero)                | termina a i = 0 rilevando il sottoflusso ADC (C=0) dopo il decremento; nessun ciclo infinito                                        |
| `for i = 10 to 1` (nessun passo, `from > to`)          | **errore in fase di compilazione**: `for-loop: from (10) > to (1) with default step +1 loops 0 times — use 'step -1' to count down` |

Il compilatore sceglie la codifica del ramo di uscita in fase di compilazione in
base al segno di una costante `step`:

- Passo positivo (o predefinito `+1`) → esci quando `var > to` (unsigned `CMP` +
  `BCC`/`BEQ` fall-through a `JMP exit`).
- Passo costante negativo → esci quando `var < to` (unsigned `CMP` + `BCS` al
  corpo), **più** un post-incremento `BCS loop_top ; JMP exit` che cattura il
  wrap quando `var` è in underflow sotto 0. Quella coppia extra di istruzioni è
  ciò che mantiene `for i = N to 0 step -k` finito.

I valori non costanti `step` (ad esempio da una variabile o un'espressione)
vengono trattati come positivi in fase di compilazione; se è necessario un conto
alla rovescia con un valore di passo in fase di esecuzione, suddividere il ciclo
o utilizzare una struttura `while`.

### Etichette e vai a

```basic
label main_loop
  x = x + 1
  if x < 10 then goto main_loop end
```

Il forward `goto` (etichetta definita in seguito) è completamente supportato.

`gosub label` / `return` salta a un'etichetta e ritorna indietro (JSR / RTS a
livello di codice macchina). L'etichetta deve essere un'istruzione `label name`,
non una `sub`: non ha parametri e condivide lo stesso ambito di pagina zero.
`gosub` supporta i riferimenti in avanti (etichetta definita dopo `gosub`).

```basic
gosub draw_border
...
label draw_border
  # ... draw something ...
  return               # RTS — returns to the instruction after gosub
```

### Sottoprogrammi

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

I parametri vengono passati tramite slot dedicati a pagina zero. Nessuna
ricorsione (gli slot sono statici). Sono supportati parametri tipizzati: `sub
draw(x, y:int)` o `sub copy(src:string)` — i parametri stringa ricevono un
puntatore di 2 byte in modo che il chiamato possa indicizzare la stringa
sorgente tramite `src[i]`.

### Funzioni (valori di ritorno)

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

Le funzioni supportano un tipo di ritorno opzionale `: word` per valori a 16
bit:

```basic
fn get_addr(): word
  return $C000
end

var ptr: word = get_addr()  # ptr = $C000
poke ptr, 42                 # STA (ptr),Y — valid indirect addressing
var v = peek(ptr)            # LDA (ptr),Y
```

`fn` viene emesso nel passaggio 2 (come `sub`), quindi i corpi delle funzioni
non vengono mai eseguiti all'avvio. I riferimenti in avanti sono completamente
supportati.

### Array

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

**Array multidimensionali** (novità della versione 1.5.3)

Gli array possono essere dichiarati con più di una dimensione. Vengono
memorizzati **per riga** e indicizzati con un elenco di indici separati da
virgole. La dimensione totale è il prodotto di tutte le dimensioni.

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

Il layout row-major significa che l'ultimo indice è contiguo: `grid[r, c]` si
trova in `base + r*COLS + c`. È supportato qualsiasi numero di dimensioni
(`array(a, b, c)`). Quando ogni indice è una costante, l'indirizzo viene ridotto
in fase di compilazione a un singolo salvataggio/caricamento assoluto; un indice
variabile emette il calcolo `row*stride + col` e un accesso indicizzato
`(ptr),Y`. Un singolo indice in un array multidimensionale è ancora consentito e
trattato come un indice piatto/lineare (`grid[10]`). Le dimensioni devono essere
costanti in fase di compilazione (letterali o `const`) e l'array deve essere
dichiarato prima di essere indicizzato.

**Tipi di struttura (`type ... endtype`, novità nella versione 1.5.4)**

Definisci un layout fisso di campi denominati con `type`, quindi alloca un array
di istanze nello stesso modo di un array normale. L'accesso ai campi utilizza
`arr[idx].field` e funziona sia per indici costanti che variabili.

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

Regole e vincoli:

- Tipi di campo: `int` (1 byte), `word` (2 byte LE), `float` (2 byte Q8.8). I
  campi `string` e `type` annidati non sono ancora supportati.
- La dimensione dell'elemento è pari alla somma delle larghezze dei campi
  (ordine di dichiarazione, senza spaziatura).
- Lo spazio di archiviazione si trova all'indirizzo `$C000+` insieme agli array
  regolari e appare nella mappa di memoria come un normale array della
  dimensione totale in byte.
- Indice costante → `LDA/STA absolute` in fase di compilazione.
- Indice variabile → moltiplicazione shift-and-add per `idx * elem_size`, quindi
  accesso indicizzato `(ptr),Y`. Le dimensioni degli elementi che sono potenze
  di due (1, 2, 4, 8, 16) utilizzano catene `ASL A` semplici; le altre
  dimensioni emettono una breve sequenza shift-add tramite due byte di pagina
  zero temporanei.
- I parametri sub/fn di un tipo struct non sono ancora supportati: passa invece
  l'array e un indice, ad esempio `sub move(idx: int) ... enemies[idx].x = ...`.
- I valori predefiniti dei campi (`var fire: int = 2` all'interno del tipo)
  vengono analizzati per verificarne la compatibilità con la proposta, ma non
  sono ancora inizializzati al momento dell'allocazione.
- Su un array di tipo struct è consentito un solo indice; gli array di struct
  multidimensionali non sono supportati (utilizzare un indice piatto calcolato).

Vedi `examples/type_demo.ub`.

### Variabili a 16 bit (parola)

```basic
var ptr: word = $0400    # two ZP bytes: lo=$00 hi=$04
poke ptr, 6              # STA (ptr),Y
var v = peek(ptr)        # LDA (ptr),Y
```

### Grafica bitmap

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

Entrambe le varianti `graphics on` spengono il display (`LDA $D011 / AND #$EF /
STA $D011`) durante la commutazione dei registri VIC, quindi lo riattivano nella
modalità di destinazione, prevenendo così glitch di commutazione di modalità.

`x` potrebbe essere l'intero intervallo `0–319`. Le coordinate superiori a 255
vengono gestite automaticamente (l'helper aggiunge il nono bit X), quindi
`plot`, `line`, `circle` e `rect` raggiungono tutti il bordo destro dello
schermo. Utilizzare una variabile `word` quando una coordinata X può superare
255.

#### Disegno ad alta risoluzione a colori — `color pen`

In modalità ad alta risoluzione (320×200) il colore è **per cella 8×8**,
memorizzato nella matrice video (nibble alto = primo piano, nibble basso =
sfondo), non per pixel. `color pen c` imposta un colore di primo piano
persistente (0-15) che `plot`, `line`, `rect`, `circle` e `paint` imprimono
nella cella di ogni pixel che disegnano; il nibble di sfondo della cella viene
conservato. Rimane attivo fino al successivo `color pen`. Il valore predefinito
è bianco (1), quindi i programmi che non chiamano mai `color pen` appaiono
esattamente come prima.

```basic
graphics on
gcls
color pen 2              # red
line 0, 0, 100, 100
color pen 6              # blue
circle 160, 100, 40
display on
```

#### Forme multicolori — `mline` / `mrect` / `mcircle`

In modalità multicolore (`graphics on multi`, 160×200) ogni pixel seleziona una
delle quattro sorgenti di colore tramite un valore a 2 bit (`%00` sfondo
`$D021`, `%01` nibble schermo alto, `%10` nibble schermo basso, `%11` RAM
colore). `mplot` imposta un singolo pixel di questo tipo; `mline`, `mrect` e
`mcircle` disegnano le forme allo stesso modo: l'argomento `color` finale è la
sorgente a 2 bit (0-3) e i colori effettivi provengono dalla tavolozza delle
celle (schermo / RAM colore) esattamente come per `mplot`.

```basic
graphics on multi
gcls
mcircle 80, 100, 40, 1
mrect 10, 10, 150, 190, 2
mline 0, 0, 159, 199, 3
display on
```

`mline`/`mrect`/`mcircle` riutilizzano le stesse routine di Bresenham / punto
medio delle loro controparti ad alta risoluzione, tracciando ogni pixel
attraverso `mplot`; i punti fuori schermo (x ≥ 160 o y ≥ 200) vengono saltati.

### Immagine bitmap a doppio buffer (senza sfarfallio)

```basic
graphics on double       # double-buffered hires bitmap (320×200)
gcls                     # clears the HIDDEN back buffer
line 0, 0, 319, 199      # all drawing (plot/line/circle/rect/paint/gcls) goes to the back buffer
flip                     # show the drawn buffer; redirect drawing to the other one
graphics off             # back to text mode (restores VIC bank 0)
```

`graphics on double` mantiene **due** bitmap ad alta risoluzione complete e
mostra solo i fotogrammi finiti, eliminando lo sfarfallio senza alcun trucco
XOR: ogni fotogramma che `gcls`, disegni, poi `flip`.

| Respingente                       | Mappa vettoriale | Matrice video | banca VIC | `$DD00` bit bassi |
| --------------------------------- | ---------------- | ------------- | --------- | ----------------- |
| A (fronte, mostrato per primo)    | `$2000`          | `$0400`       | banca 0   | `%11`             |
| B (indietro, disegnato per primo) | `$6000`          | `$4400`       | banca 1   | `%10`             |

* Tutti i comandi pixel scrivono attraverso una **base di disegno** in fase di
  esecuzione (un byte di pagina zero), quindi si rivolgono automaticamente al
  buffer attualmente nascosto.
* `flip` attende il bordo inferiore (raster ≥ 251) prima di cambiare il banco
  VIC, in modo che lo scambio sia **senza interruzioni**, quindi punta la base
  di disegno al buffer ora nascosto.
* Ciclo tipico: `gcls` → disegna il frame → `flip`. Chiama `display on` una
  volta dopo il primo `flip` in modo che il primo buffer mostrato sia già
  completo.

**Requisiti/limiti:**
* Solo assegni (non `multi`). Gli sprite non vengono prelevati dal banco VIC del
  back buffer.
* Il back buffer utilizza `$4000–$7FFF` (matrice `$4400`, bitmap `$6000–$7FFF`),
  quindi il codice macchina del programma deve rimanere al di sotto di `$4400`.
  La maggior parte delle demo occupa solo pochi KB, quindi questo avviene
  automaticamente; i programmi molto grandi non possono utilizzare il double
  buffering.
* Su un C64 standard da 1 MHz, il valore di `gcls` per fotogramma (8 KB) limita
  la frequenza dei fotogrammi; sul Commodore 64 Ultimate, aumentare `speed` per
  un'animazione fluida ad alta frequenza.

Guarda `examples/cube_demo.ub` — un cubo wireframe 3D rotante renderizzato senza
sfarfallio.

### Grafica a blocchi (80×50)

```basic
graphics on block        # 80×50 block-pixel mode (text mode + custom 4-pixel charset @ $2800)
graphics off             # return to text mode
gcls                     # clear block playfield: screen RAM $0400-$07FF + color RAM $D800-$DBFF

plot4 x, y               # set block pixel at (x, y);  x: 0-79, y: 0-49
plot4 erase x, y         # clear block pixel at (x, y)
circle4 x, y, r          # draw midpoint circle in block pixels; clips to 80×50
```

Una modalità a bassa risoluzione sovrapposta al testo standard 40×25. Un set di
caratteri personalizzato di 16 caratteri copiato in `$2800` codifica una griglia
di quadranti 2×2 per carattere (bit3=TL, bit2=TR, bit1=BL, bit0=BR), quindi ogni
cella di testo contiene 2×2 pixel di blocco → una griglia effettiva 80×50. Non
viene utilizzata la RAM bitmap (`$2000-$3FFF` rimane libera), rendendola più
veloce della bitmap ad alta risoluzione. `plot4` esegue un'operazione OR tra il
bit del quadrante e la cella, in modo che i pixel sovrapposti si accumulino;
`plot4 erase` lo cancella. `circle4` utilizza lo stesso helper di pixel di
blocco per disegnare un cerchio di contorno nello spazio di coordinate 80×50.
`gcls` cancella sia la RAM dello schermo che quella dei colori. Vedi
`examples/block_demo.ub`.

### Schermo e colore

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

`lowercase` emette `LDA #$0E; JSR $FFD2` in fase di esecuzione. I letterali
stringa compilati dopo `lowercase` hanno il caso invertito automaticamente: i
caratteri sorgente maiuscoli vengono memorizzati nello slot PETSCII minuscolo
(`$61+`) e i caratteri sorgente minuscoli nello slot maiuscolo (`$41+`), quindi
il codice sorgente di `"Hello World"` viene visualizzato come **Hello World**
sullo schermo. `uppercase` emette `LDA #$8E; JSR $FFD2` e torna alla mappatura
diretta. `cls` **non** reimposta la modalità del set di caratteri.

`scroll x n` scrive `(n AND 7)` nei bit 0-2 di `$D016` (preservando i bit 3-7).
`scroll x n narrow` scrive i bit di scorrimento fine e azzera il bit 3 di
`$D016` (modalità a 38 colonne). `scroll x n wide` scrive i bit di scorrimento
fine e imposta il bit 3 di `$D016` (modalità a 40 colonne). `scroll y n` scrive
`(n AND 7)` nei bit 0-2 di `$D011` (preservando i bit 3-7). `scroll row R left`
sposta una riga costante dello schermo a sinistra; scrive il nuovo carattere più
a destra con `screen 39, R, ch`. Utile per uno scorrimento hardware fluido:
decrementa ogni frame da 7 a 0, sposta la RAM dello schermo, reimposta a 7.

`screen col, row, char [, color]` scrive direttamente nella RAM dello schermo
(`$0400 + row*40 + col`) e, facoltativamente, nella RAM dei colori (`$D800 +
row*40 + col`). Costante col/row: indirizzo calcolato in fase di compilazione.

### Ultimate 64 — Velocità della CPU

```basic
speed 4              # set CPU to 4 MHz  (reads $D031, updates bits 0-3, writes back)
speed 48             # 48 MHz  (maximum speed on U64)
speed max            # same as speed 48  (alias)
speed off            # back to 1 MHz  (alias for speed 1)

badlines on          # enable badline timing  ($D031 bit 7 = 0, default C64 behaviour)
badlines off         # disable badline timing ($D031 bit 7 = 1, more CPU cycles)

var t = turbo()      # 1 if turbo is active (bits 0-3 of $D031 != 0), 0 if at 1 MHz
```

Valori MHz disponibili: `1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 20, 24, 32, 40,
48`. I valori costanti vengono arrotondati per difetto alla velocità disponibile
più vicina in fase di compilazione. I valori variabili vengono trattati come un
indice di velocità grezzo (0–15) e sottoposti a OR con i bit 0-3 di `$D031`.

| $D031 index | MHz (U64) | MHz (U64 Elite-II) |
| ----------- | --------- | ------------------ |
| 0           | 1         | 1                  |
| 3           | 4         | 4                  |
| 6           | 8         | 10                 |
| 11          | 20        | 24                 |
| 15          | 48        | 64                 |

Richiede che **U64 Turbo Control** sia impostato su `U64 Turbo Registers` o
`Turbo Enable Bit` nel menu di configurazione U64. Su un normale C64 o emulatore
senza il registro, i valori da `poke` a `$D031` vengono silenziosamente
ignorati.

### Tastiera

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

`mouse_x()` / `mouse_y()` eseguono internamente una subroutine di supporto che
gestisce: la carica del condensatore CIA1 `$DC00`, un ritardo di ~516 cicli, la
lettura del registro SID POT X/Y (`$D419`/`$D41A`), il calcolo delta a 7 bit con
segno, l'inversione dell'asse Y `EOR #$FF` e il tracciamento della posizione
accumulata (stato ZP permanente, 8 byte). Il supporto campiona POT due volte per
frame. `mouse_y()` **non** chiama il supporto (solo `mouse_x()` lo fa) — legge
semplicemente il valore memorizzato nella cache `accum_y` per evitare un doppio
aggiornamento.

La funzione di supporto mantiene un accumulatore X a 9 bit (`accum_x` +
`accum_x_hi` con riporto/prestito). Utilizzare `var sx: word = mouse_x()`: il
compilatore memorizza sia i byte lo che hi, quindi il comando `sprite` gestisce
correttamente `$D010` per le posizioni X oltre 255.

La funzione di supporto memorizza il suo stato in ZP (`$02`–`$09`). Il flag di
inizializzazione deve essere zero prima della prima chiamata: azzera l'area con
`fill $02, 7, 0` all'inizio del programma. Disabilita anche gli interrupt CIA1
(`poke $DC0D, $7F`) per evitare che l'IRQ KERNAL tocchi `$DC00` durante la
scansione della tastiera, poiché ciò disturba la lettura del POT.

Vedi `examples/mouse_demo.ub` per una demo funzionante del mouse 1351 con
tracciamento degli sprite e feedback dei pulsanti.

### Uscita

```basic
bye                      # JSR $E544 (clear screen), clear STOP flag, RTS to BASIC
exit                     # alias for bye
```

### Tempistica

```basic
wait 50                  # wait 50 raster-line transitions (~3.2 ms)
wait raster 100          # spin until $D012 == 100 (raster-split effects)
delay 1                  # wait 1 PAL frame (1/50 s ≈ 20 ms)
delay 20                 # wait 20 frames ≈ 0.4 s; n can be a variable (0–255)
```

`delay N` conta N frame PAL completi utilizzando la linea raster 200 come
confine del frame.

### SID Sound

```basic
sound 0, $1CAD, 25       # voice 0, freq $1CAD (≈ middle C PAL), 25 frames duration
sound 1, freq_word, 50   # voice 1, freq from word var, 50 frames (1 s at 50 Hz)
sound 2, 0, 0            # voice 2, silence

sid volume 15            # master volume full ($D418 = $0F); range 0-15
sid volume 0             # silence (master volume = 0)
sid stop                 # zero all 25 SID registers ($D400–$D418) — complete silence
```

`sound <channel>, <freq>, <duration>` — durata in frame PAL (1/50 s ciascuno).
ADSR fisso: attacco/decadimento `$09`, sustain/rilascio `$F0`, forma d'onda a
dente di sega. Volume master `$D418` sempre impostato su `$0F`.

`sid volume N` scrive N in `$D418`. Bit 0-3 = volume (0-15), bit 4-7 = modalità
filtro. `sid stop` emette un ciclo di riempimento di zeri di 10 byte, più veloce
di 25 singoli input.

### Riproduzione musicale

`music play/stop/pause/resume` è un'alternativa di alto livello alla
configurazione manuale `sys sid_init` / `cia_timer`. Richiede una precedente
istruzione `load sid` (definisce `sid_init` / `sid_play`).

```basic
load sid "tune.sid"         # embed SID file (defines sid_init / sid_play)

music play                  # initialise sub-tune 0 + start CIA1 50 Hz IRQ
music play 1                # start from sub-tune 1 (song number 0-based)
music stop                  # stop playback + zero all 25 SID registers ($D400-$D418)
music pause                 # disable CIA1 timer A IRQ (music freezes, SID unchanged)
music resume                # re-enable CIA1 timer A IRQ (continues from pause point)
```

| Dichiarazione    | Effetto                                                                                              |
| ---------------- | ---------------------------------------------------------------------------------------------------- |
| `music play [n]` | chiama `sid_init(n)`, configura il timer CIA1 A a 19 656 cicli (~50 Hz PAL), installa il wrapper IRQ |
| `music stop`     | disabilitare CIA1 IRQ + azzerare tutti i 25 registri SID                                             |
| `music pause`    | Disabilitare l'IRQ CIA1 (l'uscita SID rimane bloccata)                                               |
| `music resume`   | riattiva CIA1 IRQ (riprende dal punto di pausa)                                                      |

Il wrapper IRQ (emesso una sola volta alla fine del programma) esegue: ACK CIA1
timer A → `JSR sid_play` → `JMP $EA81`.

### Sprite

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

X supporta l'intera gamma a 9 bit (0–319): utilizzare una variabile `word` per
valori di runtime > 255. Puntatore dati sprite: `data_addr` deve essere
allineato a 64 byte; memorizzato come `addr >> 6` in `$07F8+id`.

#### Sprite animation with `sprite_frame`

`sprite_frame` è il comando utilizzato per cambiare l'immagine visualizzata di
uno sprite durante un'animazione. Modifica solo il puntatore dati dello sprite;
**non** sposta lo sprite, non lo abilita e non fa avanzare automaticamente i
fotogrammi.

Memorizza le immagini dell'animazione in sequenza, con ogni immagine sprite da
63 byte che occupa uno slot allineato a 64 byte. Passa il frame dell'animazione
a base zero come terzo argomento:

```basic
sprite_frame sprite_id, first_frame_address, frame_number
```

Ad esempio, con un indirizzo base di `$2000`, il fotogramma 0 utilizza `$2000`,
il fotogramma 1 utilizza `$2040`, il fotogramma 2 utilizza `$2080` e così via.
Il programma controlla la temporizzazione e l'avvolgimento dell'animazione:

```basic
var frame = 0
loop
  sprite_frame 0, $2000, frame
  frame = frame + 1
  if frame == 4 then frame = 0 end
  delay 5
end
```

La forma a due argomenti, `sprite_frame id, address`, seleziona semplicemente
un'immagine sprite statica e rimane retrocompatibile. La posizione dello sprite
è ancora controllata da `sprite id,x,y`.

### collisione del riquadro di delimitazione del software

```basic
var touching = box_hit(left1, top1, right1, bottom1,
                       left2, top2, right2, bottom2)
```

`box_hit()` esegue un test di bounding box allineato agli assi (AABB) e
restituisce `1` quando i due rettangoli si sovrappongono o si toccano,
altrimenti `0`. A differenza di `sprite_hit()` e `sprite_bg_hit()`, non legge né
cancella i registri di collisione VIC-II. Gli otto argomenti sono espressioni
arbitrarie a 8 bit, quindi i box possono essere più piccoli dell'artwork sprite
visibile o possono descrivere oggetti di gioco non sprite. Le coordinate sono
inclusive; mantenere `left <= right` e `top <= bottom`.

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

`sprdef id ... end` incorpora 63 byte di sprite all'indirizzo successivo
allineato a 64 byte nel segmento di codice, emette un `JMP` su di essi e imposta
automaticamente `$07F8+id = data_addr >> 6`. Per utilizzare la stessa forma per
più sprite, rileggi il puntatore:

```basic
var pg = peek($07F8)   # pointer set by sprdef 0
poke $07F9, pg         # copy to sprites 1–7
```

### Mappe delle tessere dei personaggi (`.ubmap`)

```basic
map load "levels/world.ubmap"
map draw map_x, map_y       # draw a 40x25 viewport to screen/color RAM

var tile = map_tile(x, y)   # read character code from the map
map set x, y, 42            # change character code in writable map data

var shade = map_color(x, y) # read cell color (0 when map has no color data)
map color x, y, 7           # change cell color when color data is present
```

`map load` risolve il nome del file relativo al file sorgente `.ub`, lo
convalida in fase di compilazione e incorpora i suoi array di caratteri e,
facoltativamente, di colori nella RAM del programma scrivibile. Un successivo
`map load` sostituisce la mappa attiva per i successivi comandi di mappa.

`map load` accetta anche un'esportazione VisualAssembler `me-map` `.bin`
direttamente:

```basic
caricamento della mappa "map-multicolor.bin"
```

I primi 1000 byte diventano la mappa dei caratteri 40×25 e i successivi 1000
byte diventano i colori delle celle. La modalità multicolore e `$D021-$D023`
vengono letti dal trailer dei metadati di VisualAssembler, quindi non è
necessaria alcuna conversione `.ubmap`.

`map draw map_x, map_y` copia una viewport 40×25 a partire dalla cella di mappa
specificata nella RAM dello schermo `$0400` e, se presente, nella RAM dei colori
`$D800`. La mappa deve contenere l'intera viewport richiesta: mantenere `map_x
<= width-40` e `map_y <= height-25`. Le coordinate e le dimensioni sono
attualmente a 8 bit (0–255).

Le mappe normali cancellano il bit multicolore del testo in `$D016`. Le mappe
multicolore lo impostano e caricano i loro tre colori globali in `$D021`,
`$D022` e `$D023`. Le mappe dei caratteri contengono codici di carattere, non
pixel di charset; combinale con `charset`/`chardef` o un altro metodo di
caricamento del charset. In modalità testo multicolore, i colori delle celle da
8 a 15 selezionano i caratteri multicolore secondo le regole VIC-II.

#### Formato binario UBMP versione 1

Tutti gli interi multibyte sono little-endian:

|   Offset |          Misurare | Senso                                                                           |
| -------: | ----------------: | ------------------------------------------------------------------------------- |
|        0 |                 4 | Magia ASCII `UBMP`                                                              |
|        4 |                 1 | Versione, attualmente `1`                                                       |
|        5 |                 1 | Flag: bit 0 = presenza dell'array di colori, bit 1 = modalità testo multicolore |
|        6 |                 2 | Larghezza della mappa: 1–255 celle                                              |
|        8 |                 2 | Altezza della mappa, 1–255 celle                                                |
|       10 |                 1 | Sfondo 0 (`$D021`), nibble basso utilizzato                                     |
|       11 |                 1 | Multicolore 1 (`$D022`), basso numero di morsi utilizzati                       |
|       12 |                 1 | Multicolore 2 (`$D023`), basso numero di nibble utilizzati                      |
|       13 | larghezza×altezza | Codici dei caratteri principali di riga                                         |
| seguente | larghezza×altezza | Nibble di colore riga-principale opzionali quando il bit di flag 0 è impostato  |

Un file UBMP deve avere la lunghezza esatta indicata nell'intestazione. Magic,
versione, dimensioni o lunghezza non validi generano un errore in fase di
compilazione.

### Importazione immagini Koala Painter

```basic
koala load "pictures/title.kla"  # validate and embed at compile time
koala show                       # enter bitmap multicolor mode
koala hide                       # return to the default text display
```

`koala load` accetta un file Koala standard da 10003 byte (indirizzo di
caricamento `$6000` più 10001 byte di dati) o un payload grezzo da 10001 byte. I
percorsi sono relativi al file `.ub`. Il payload contiene 8000 byte bitmap, 1000
byte schermo, 1000 nibble di colore e un byte di colore di sfondo.

Il compilatore lo memorizza all'indirizzo `$6000-$8710`. `koala show` copia la
bitmap in `$2000`, la matrice dello schermo in `$0400`, i colori in `$D800` e
abilita la modalità bitmap multicolore. `koala hide` cancella la modalità
bitmap/multicolore e ripristina il layout di testo predefinito.

Il codice generato e le funzioni di supporto devono terminare sotto `$2000`,
perché la bitmap visualizzata sovrascrive `$2000-$3F3F`; altrimenti il
compilatore segnala un errore. L'importazione di Koala non può essere combinata
con `load sid` nello stesso programma.

### Set di caratteri personalizzato

```basic
charset $3800            # set base address for chardef (default $3800)

chardef 65               # redefine character 65 ('A')
  $18,$3C,$66,$7E,$66,$66,$66,$00
end

chardef 66               # fewer than 8 bytes are zero-padded
  $7C,$66,$7C,$66,$7C
end
```

`charset base` imposta l'indirizzo di destinazione utilizzato da tutte le
successive istruzioni `chardef`. `chardef id ... end` incorpora 8 byte in linea
nel segmento di codice (preceduti da un `JMP` per saltarli), quindi li copia in
`charset_base + id*8` in fase di esecuzione. I valori devono essere costanti in
fase di compilazione; utilizzare `%` per i letterali binari (`%00011000`).

Per attivare un set di caratteri personalizzato in VIC-II, impostare l'indirizzo
del generatore di caratteri tramite `$D018`:
```basic
charset $3800
chardef 1  $FF,$81,$81,$81,$81,$81,$81,$FF  end  # box border
poke $D018, $1A     # screen at $0400, charset at $3800 (bank 0)
```

### Memoria

```basic
poke $D020, 2            # STA $D020
poke addr_var, 6         # STA (addr_var),Y  — if addr_var is word type
var v = peek($D012)      # LDA $D012
var v = peek(addr_var)   # LDA (addr_var),Y  — if addr_var is word type

var w: word = peek16($C000)   # read 16-bit little-endian: lo=$C000, hi=$C001
poke16 $0314, $EA81           # write 16-bit little-endian: lo→$0314, hi→$0315
poke16 ptr, w                 # word var as address; word var as value
```

`peek16(addr)` legge due byte consecutivi (lo, hi) come `word`. `poke16` scrive
lo e poi hi.

### I/O del disco

```basic
load "PROGRAM"           # KERNAL LOAD: loads file from device 8 to its native address
load "DATA", $C000       # loads file to a specific address
load "DATA", ptr         # addr from word variable

save "DATA", $C000, 4096 # KERNAL SAVE from $C000, 4096 bytes → device 8
save "PROG", start, len  # addr and len from word/int variables
```

`load` chiama KERNAL `SETNAM`+`SETLFS`+`LOAD` (`$FFBD`/`$FFBA`/`$FFD5`). Senza
indirizzo: indirizzo secondario 0 (intestazione di 2 byte del file stesso
utilizzata come indirizzo di caricamento). Con indirizzo: indirizzo secondario 1
(file caricato nella posizione specificata). `save` chiama
`SETNAM`+`SETLFS`+`SAVE` (`$FFBD`/`$FFBA`/`$FFD8`). Richiede sia `addr` che
`len`.

### SID Music

```basic
load sid "tune.sid"            # embed SID music at its native load address
load sid "tune.sid", $2000     # override: embed at $2000 regardless of SID header
```

`load sid` legge un file PSID o RSID in **tempo di compilazione**, rimuove
l'intestazione e aggiunge i byte musicali grezzi all'output `.prg`. Dopo `load
sid`, diventano disponibili due costanti in tempo di compilazione:

| Costante   | Descrizione                                                                                     |
| ---------- | ----------------------------------------------------------------------------------------------- |
| `sid_init` | Indirizzo della routine di inizializzazione: chiama una volta con A = numero del brano (base 0) |
| `sid_play` | Riproduci l'indirizzo della routine: chiama ogni frame (50 Hz PAL) da un gestore IRQ            |

Entrambe le costanti funzionano ovunque sia accettato un indirizzo costante:
`sys`, `irq`, `poke`, espressioni.

**Uso tipico:**

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

**Note:**
- I dati SID vengono posizionati **dopo** tutto il codice generato, riempiti con
  zeri fino all'indirizzo di caricamento. Il compilatore avvisa se l'indirizzo
  di caricamento SID si sovrappone al codice generato.
- Sono supportati PSID v1 e v2. Se l'indirizzo di caricamento dell'intestazione
  SID è 0, i primi due byte di dati vengono utilizzati come indirizzo (stile
  PRG, little-endian).
- Solo un `load sid` per programma è significativo (l'ultimo vince).

### I/O di file del canale seriale

```basic
open 1, 8, 2, "MYFILE"  # open logical file 1, device 8, secondary 2, name "MYFILE"
open 2, 4, 7             # open printer (device 4), no filename
open ch, dev, sec        # channel, device, secondary from variables

print# 1, "HELLO"        # send "HELLO"+CR to logical file 1
print# ch, x, "text"     # any mix of vars, strings — same as print but to file

close 1                  # close logical file 1
close ch                 # channel from variable
```

`open` chiama `SETNAM` ($FFBD) + `SETLFS` ($FFBA) + `OPEN` ($FFC0). Senza un
nome file, SETNAM viene chiamato con lunghezza 0. `print#` instrada l'output
tramite `CHKOUT` ($FFC9), CHROUT per carattere (+ CR finale), quindi `CLRCHN`
($FFCC). `close` inserisce il numero del canale in A e chiama `CLOSE` ($FFC3).

### Input

```basic
input score              # read up to 3 digits from keyboard → 8-bit int var
input "Name: ", name     # optional prompt string, then read line → string var
input "Score: ", score   # prompt + int input
```

`input` utilizza KERNAL BASIN (`$FFCF`) per l'input di riga bloccante ed echo
con supporto DEL.
- **Variabile intera**: accetta solo `0`–`9`, massimo 3 caratteri; converte in
  valore a 8 bit in caso di CR.
- **Variabile stringa**: accetta fino a 30 caratteri; memorizza come stringa
  terminata da null; coppia ZP aggiornata.

### Galleggiante / Punto fisso

Le variabili `float` utilizzano il formato a virgola fissa Q8.8: il byte più
significativo rappresenta la parte intera (0–255) e il byte meno significativo
rappresenta la parte frazionaria (0/256 … 255/256).

```basic
var f: float = 3.5       # 3.5 → hi=3, lo=128 (= 0x0380)
var g: float = 0         # integer 0 is promoted to 0.0 automatically

f = 1.5                  # Q8.8 literal assignment
f = f + 1.5              # 16-bit Q8.8 arithmetic (result: 3.0)
f = f + g                # float + float

var n = int(f)           # extract integer part (hi byte) → 8-bit int
print f                  # prints as "N.DD" (e.g. 3.5 → "3.50", 1.25 → "1.25")
```

| Operazione           | Esempio              | Note                                                      |
| -------------------- | -------------------- | --------------------------------------------------------- |
| Letterale            | `3.5`, `0.25`, `1.0` | analizzato come Q8.8 in fase di compilazione              |
| Promozione intera    | `f = 5`              | memorizza 5.0 (alto=5, basso=0)                           |
| Aggiungi/sostituisci | `f + 1.5`, `f - g`   | Aritmetica a 16 bit Q8.8                                  |
| Estratto int         | `int(f)`             | restituisce il byte più significativo come intero a 8 bit |
| Stampa               | `print f`            | formato "N.DD", sempre 2 cifre decimali                   |

**Attenzione:** L'overflow aritmetico si interrompe a 255.255 (nessuna
saturazione). La moltiplicazione e la divisione di due variabili float non sono
ancora supportate: utilizzare `int()` + aritmetica intera per questi casi.

### Funzioni matematiche

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

### Funzioni di stringa

```basic
var n = len(msg)         # length of null-terminated string var (0–255)
var c = asc(msg)         # PETSCII code of first character (0 if empty)
var c = asc("A")         # compile-time: constant PETSCII code
var n = val(s)           # runtime: parse decimal PETSCII string → 8-bit int (e.g. "042" → 42)
var c = msg[i]           # string character at index i: PETSCII code of msg[i]
msg[i] = c               # write PETSCII byte c to string at index i — STA (ptr),Y
msg[0] = 72              # constant index → LDY #0; STA (ptr),Y
```

### Formattazione dei numeri

```basic
print hex(n)             # print as 2-digit uppercase hex
print bin(n)             # print as 8-bit binary string
print dec(n, 4)          # right-justified decimal in a field of 4 chars (e.g. 42 → "  42")
print dec(n, width)      # width can also be a variable
```

`dec(n, width)` riempie il numero a sinistra con spazi per riempire i caratteri
`width`. Se il numero ha più cifre di `width`, viene stampato senza riempimento
(nessun troncamento). In contesti non di stampa, `dec(n, w)` viene valutato come
`n` senza modifiche (uguale a `hex`/`bin`).

### REU (Unità di espansione RAM)

```basic
var ok = reu_present()   # 1 if REU detected, 0 if not (write/read test on $DF04)
var ok = reudet()        # alias for reu_present()

reu stash c64addr, bank, reu_addr, len  # copy C64 → REU
reu fetch c64addr, bank, reu_addr, len  # copy REU → C64
reu swap  c64addr, bank, reu_addr, len  # swap between C64 and REU
```

`reu_present()` esegue un test di scrittura/lettura sul registro REU `$DF04`.
Senza un REU la scrittura viene persa (bus aperto), quindi la lettura è diversa:
rileva in modo affidabile la presenza senza toccare alcun registro di comando
con effetti collaterali.

| Parametro  | Larghezza | Note                                                                 |
| ---------- | --------- | -------------------------------------------------------------------- |
| `c64addr`  | 16 bit    | Avvio della RAM del C64 — costante, `word` var o espressione a 8 bit |
| `bank`     | 8 bit     | Numero di banca REU (0–7 per un'unità da 512 KB)                     |
| `reu_addr` | 16 bit    | Compensazione all'interno della banca REU                            |
| `len`      | 16 bit    | Byte da trasferire (`0` = 65 536 nell'hardware REU)                  |

Registri REU: `$DF01` comando (`$B0` stash / `$B1` fetch / `$B2` swap),
`$DF02–$DF03` indirizzo C64, `$DF04–$DF05` offset REU, `$DF06` banco,
`$DF07–$DF08` lunghezza. Il trasferimento è sincrono (CPU arrestata durante il
DMA). Richiede un REU o VICE reale: **Impostazioni → Hardware → Modulo di
espansione RAM**.

### Utilità di memoria

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

Sia `fill` che `memcopy` supportano lunghezze a 16 bit (0–65535). Utilizzare le
variabili `word` per lunghezze > 255.

`drawmem src, dst, width, height, stride` copia un blocco rettangolare 2D. `src`
viene letto linearmente (righe impacchettate); `dst` avanza di `stride` byte tra
le righe — utilizzare `40` ($28) per lo schermo C64 o la RAM a colori (40
colonne). Larghezza, altezza e passo sono tutti valori a 8 bit. `src` e `dst`
possono essere costanti, `word` variabili o espressioni a 8 bit.

### IRQ raster

```basic
irq my_handler           # raster IRQ at line 0, handler = sub name or address
irq my_handler, 100      # raster IRQ at raster line 100
irq $C800, 200           # handler at fixed address
irq addr_word            # handler address from a word variable
```

Imposta un IRQ raster tramite il vettore software BASIC (`$0314`/`$0315`):
disabilita l'IRQ del timer CIA1, conferma l'IRQ VIC in sospeso, scrive la riga
raster in `$D012`, abilita l'IRQ raster VIC (`$D01A=$01`), scrive l'indirizzo
del gestore e riabilita gli interrupt.

Il gestore **deve** terminare con `sys $EA81` (fine IRQ del KERNAL) — `RTS` o
`RTI` corromperanno lo stack. Confermare prima l'IRQ del VIC:

```basic
sub my_handler()
  poke $D019, $FF      # ACK VIC IRQ
  # ... work here ...
  sys $EA81            # JMP to KERNAL end-of-IRQ
end
```

Sono supportati i riferimenti in avanti (`irq my_handler` prima che la
subroutine sia definita).

### Gestore NMI

```basic
nmi my_nmi               # set NMI vector $0318/$0319 to handler sub or address

sub my_nmi()
  # ... NMI work here ...
  nmi_exit               # JMP $FE47 — proper NMI exit (restores A/X/Y + RTI)
end
```

`nmi handler` scrive l'indirizzo del gestore nel vettore software NMI
(`$0318`/`$0319`). Il vettore hardware NMI a `$FFFA` punta alla routine KERNAL
NMI che si dirama attraverso `$0318`. Il gestore **deve** terminare con
`nmi_exit` (emette `JMP $FE47`) — l'utilizzo di `RTI` corromperà lo stack.
Riferimenti in avanti supportati.

### CIA1 timer IRQ

```basic
cia_timer 19656, my_handler   # CIA1 timer A: fires every 19656 cycles (~50 Hz PAL)
cia_timer period, handler      # period can be a variable or expression
```

Imposta il timer CIA1 A come sorgente IRQ periodica tramite il vettore software
BASIC (`$0314`/`$0315`):
1. SEI — disabilita gli interrupt
2. `$DC0D = $7F` — disabilita tutti gli IRQ CIA1
3. Load 16-bit period lo→`$DC04`, hi→`$DC05`
4. Scrivi l'indirizzo del gestore a `$0314`/`$0315`
5. `$DC0D = $81` — abilita l'IRQ del timer CIA1 A
6. `$DC0E = $01` — avvia il timer A in modalità continua
7. CLI — riattiva gli interrupt

Il gestore deve terminare con `irq_exit` (o `sys $EA81`) e deve inviare un ACK
all'IRQ CIA1:

```basic
sub my_handler()
  poke $DC0D, $01      # ACK CIA1 timer A IRQ (read also clears it)
  # ... work here ...
  irq_exit             # JMP $EA81: restore A/X/Y + RTI
end
```

Temporizzazione PAL: clock = 985 248 Hz. Periodo per 50 Hz = 985 248 / 50 = 19
705 cicli ≈ `$4CC9`. Riferimenti in avanti supportati.

### Gestione degli errori

```basic
onerr goto err_handler   # set KERNAL I/O error vector ($0300/$0301) to a label

...

label err_handler
  print "I/O ERROR"
  bye
```

`onerr goto label` scrive l'indirizzo dell'etichetta (lo, hi) nelle posizioni
KERNAL `$0300` e `$0301`. Quando si verifica un errore di I/O KERNAL (ad
esempio, un errore `load` o `open`), il KERNAL esegue `JMP ($0300)`, che salta
all'etichetta. Sono supportati i riferimenti in avanti (etichetta definita dopo
`onerr goto`).

### Incorporamento di file in fase di compilazione

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

Tutti i valori `data` vengono raccolti in fase di compilazione. Un puntatore ZP
di 2 byte viene allocato e inizializzato automaticamente all'avvio del
programma. Ogni `read` fa avanzare il puntatore.

### Assemblaggio in linea

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

**Modalità di indirizzamento:**

| Sintassi          | Modalità      | Byte | Esempio                    |
| ----------------- | ------------- | ---- | -------------------------- |
| (nessun operando) | Implicito     | 1    | `NOP`, `RTS`               |
| `A`               | Accumulatore  | 1    | `ASL A`, `LSR`             |
| `#value`          | Immediato     | 2    | `LDA #$07`                 |
| `$zz` (0–255)     | Pagina zero   | 2    | `LDA $50`                  |
| `$zz,X`           | ZP,X          | 2    | `LDA $50,X`                |
| `$zz,Y`           | ZP,Y          | 2    | `LDX $50,Y`                |
| `$xxxx`           | Assoluto      | 3    | `LDA $0400`                |
| `$xxxx,X`         | Assoluto,X    | 3    | `LDA $0400,X`              |
| `$xxxx,Y`         | Assoluto,Y    | 3    | `LDA $0400,Y`              |
| `($xxxx)`         | Indiretto     | 3    | `JMP ($FFFC)`              |
| `($zz,X)`         | (Indiretto,X) | 2    | `LDA ($50,X)`              |
| `($zz),Y`         | (Indiretto),Y | 2    | `LDA ($50),Y`              |
| `label`           | Parente       | 2    | `BNE label` (solo filiali) |

- `$zz` (1–2 cifre esadecimali, valore ≤ 255) seleziona la pagina zero se
  l'istruzione la supporta; altrimenti esegue l'aggiornamento automatico alla
  pagina assoluta. Utilizzare `$00xx` (4 cifre) per forzare la pagina assoluta.
- Gli operandi di salto sono indirizzi assoluti; l'offset relativo in byte viene
  calcolato automaticamente.
- Le etichette locali (`name:`) sono limitate al blocco `asm { }`. I salti in
  avanti vengono risolti nel passaggio 2.
- `#<label` / `#>label` restituiscono il byte lo/hi dell'indirizzo di
  un'etichetta.
- `*` restituisce l'indirizzo dell'istruzione corrente, quindi `JMP *` si
  assembla come un ciclo su se stesso.
- Le righe che iniziano con `$`, `%` o una cifra vengono emesse come byte grezzi
  (compatibili con le versioni precedenti).
- All'interno di `asm { }`, i commenti vanno da `;` o `//` fino alla fine della
  riga. (`#` è il prefisso immediato, non un commento.)

**Combinazione di `asm { }` con parametri di subroutine**

I nomi dei parametri **non sono accessibili** all'interno dei blocchi `asm { }`.
Utilizzare le istruzioni UltimateBasic per spostare i valori in posizioni note
prima del blocco `asm { }`:

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

Per le routine il cui intero corpo è in linguaggio assembly, in particolare i
gestori di interrupt che devono fare riferimento l'uno all'altro, è
consigliabile inserire tutti i gestori in un **singolo blocco `asm { }` di
livello superiore** nel programma principale. Le etichette nello stesso blocco
condividono l'ambito, quindi `irq1` e `irq2` possono fare riferimento l'una
all'altra liberamente. Vedere `examples/raster_irq_demo.ub`.

### Stringa ↔ intero

```basic
numstr score, $0340      # writes "042\0" at $0340 (always 3 digits, zero-padded)
var n = str_to_int("42") # compile-time: Expr::Number(42)

print str$(score)                # print 8-bit int as 3-digit decimal string ("000"–"255")
print "Score: " + str$(score)   # usable in string concat print context
var s: string = str$(n)          # assign str$() result to a string var (shared static buffer)
```

`str$(n)` converte un valore a 8 bit in una stringa decimale di 3 caratteri
(sempre 3 cifre con zeri iniziali, ad esempio `5` → `"005"`, `42` → `"042"`,
`255` → `"255"`) seguita da un terminatore nullo. Il puntatore al risultato
viene memorizzato in una coppia ZP permanente allocata in fase di compilazione.

> **Nota:** `str$(n)` utilizza un singolo buffer statico condiviso di 4 byte.
> Richiamando `str$(n)` si sovrascrive il risultato precedente. Per visualizzare
> contemporaneamente più valori, utilizzare `numstr` per scrivere a indirizzi
> assoluti separati.

## Esempi

| File                                | Descrizione                                                                         |
| ----------------------------------- | ----------------------------------------------------------------------------------- |
| `examples/features.ub`              | const, label/goto, poke/peek, rnd, funzioni matematiche                             |
| `examples/new_features.ub`          | parametri secondari, array, variabili di tipo parola, variabili di tipo stringa     |
| `examples/bitmap_demo.ub`           | Immagine bitmap 320×200, grafico, grafica attivabile/disattivabile                  |
| `examples/block_demo.ub`            | grafica a blocchi 80×50, plot4, circle4, grafica su blocco                          |
| `examples/joystick_demo.ub`         | lettura del joystick, movimento dello sprite                                        |
| `examples/mux_demo.ub`              | Multiplexer di sprite raster (3 finestre × 8 sprite = 24)                           |
| `examples/orbit_demo.ub`            | Orbita a 24 sprite con raggio pulsante e colori casuali                             |
| `examples/plasma_demo.ub`           | bitmap con effetto plasma e animazione del bordo a barre raster                     |
| `examples/sprite_data.ub`           | Dati di forma sprdef (inclusi da altre demo)                                        |
| `examples/sprite_mux_orbit.ub`      | Dimostrazione di orbita a 24 sprite con sprdef + posizioni precalcolate             |
| `examples/sprite_orbit_demo.ub`     | 8 sprite hardware in orbita circolare tramite la tabella seno/coseno                |
| `examples/reu_bitmap_demo.ub`       | Recupero/stosh REU con grafica bitmap                                               |
| `examples/sid_music_demo.ub`        | Lettore musicale SID con IRQ raster e uscita da tastiera                            |
| `examples/tenprint.ub`              | 5 implementazioni del labirinto TENPRINT con menu; demo `lowercase` charset mode    |
| `examples/countdown_demo.ub`        | Conto alla rovescia `for..next` con passo negativo, incl. `for i = 20 to 0 step -2` |
| `examples/countdown_errors_demo.ub` | Errore in fase di compilazione per default-step `from > to`                         |
| `examples/explicit_demo.ub`         | `--explicit` Demo del flag CLI con `var`, `sub`, `fn` completamente tipizzati.      |
| `examples/explicit_errors_demo.ub`  | Codice discontinuo che si compila senza `--explicit`, genera errori con esso        |

## Riferimento CLI

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

### Esportazione CRT

Ultimate Basic è in grado di scrivere un'immagine di cartuccia Magic Desk di
tipo 19 anche quando il nome del file di output termina con `.crt`:

```bash
ub build demo.ub -o demo.crt
```

Il compilatore incapsula il PRG generato in un contenitore CRT a banchi
utilizzando lo stesso layout dell'esportazione CRT di VisualAssembler:
un'intestazione di cartuccia da 64 byte, un'immagine Magic Desk 8×8K e un boot
loader nel banco 0 che copia il payload PRG nella RAM del C64 prima di saltare
al punto di ingresso del programma. I percorsi `.prg` e `.d64` continuano a
funzionare come prima.

### Modalità di tipo esplicito

Passa `--explicit` per forzare ogni sito di dichiarazione ad avere
un'annotazione `:type`:

```bash
ub build game.ub --explicit
```

Senza il flag, Ultimate Basic accetta sia `var x = 5` (tipo dedotto
dall'inizializzatore o impostato di default su `int`) che `var x: int = 5`. Con
il flag, viene compilata solo la forma annotata, mentre la forma non annotata
genera un errore in fase di compilazione.

**Cosa impone:**

| Modulo di dichiarazione                                  | Senza `--explicit`               | Con `--explicit`                   |
| -------------------------------------------------------- | -------------------------------- | ---------------------------------- |
| `var name = expr` (no `:type`)                           | ok — tipo dedotto                | errore                             |
| `var name: int = expr` (o parola/virgola mobile/stringa) | OK                               | OK                                 |
| `var arr = array(N)`                                     | ok — implicitamente `array`      | ok — invariato                     |
| `var arr = array_word(N)`                                | ok — implicitamente `array_word` | ok — invariato                     |
| `const NAME = value`                                     | OK                               | ok — invariato                     |
| `sub foo(a, b)` (parametri non tipizzati)                | OK                               | errore per parametro non tipizzato |
| `sub foo(a: int, b: int)`                                | OK                               | OK                                 |
| `fn foo(a): int` (parametro non tipizzato)               | OK                               | errore sul parametro               |
| `fn foo(a: int): int`                                    | OK                               | OK                                 |

Le dichiarazioni di costanti e array sono sempre accettate: il loro tipo è
definito dalla forma di dichiarazione, quindi `:type` sarebbe ridondante.

**Esempio di output di errore:**

```
$ ub build myprog.ub --explicit
Compilation errors:
  line 14: 'explicit' mode: 'var loose' has no type — use 'var loose: int|word|float|string'
  line 16: 'explicit' mode: parameter 'a' has no type — use 'a: int|word|float|string'
```

Il flag è un interruttore in fase di compilazione: non è necessario modificare
nulla nel codice sorgente per attivarlo o disattivarlo. Aggiungilo al tuo
Makefile/script di compilazione per imporre lo stile tipizzato a livello di
progetto, oppure rimuovilo per gli script di esplorazione. Vedi
`examples/explicit_demo.ub` e `examples/explicit_errors_demo.ub`.

### File di debug

Utilizzare `--debug` per generare i simboli di debug insieme al programma:

```bash
ub build demo.ub --debug
```

Il compilatore scrive i file accanto a `.prg`, utilizzando lo stem del file di
output:

| File       | Formato e scopo                                                                                                        |
| ---------- | ---------------------------------------------------------------------------------------------------------------------- |
| `demo.sym` | Codice sorgente di simboli compatibile con KickAssembly, adatto per l'importazione nel codice sorgente dell'assembler. |
| `demo.dbg` | C64Debugger/RetroDebugger KickAssembler debug-dump contenente il segmento del programma e le etichette                 |
| `demo.vs`  | File di comandi del monitor VICE contenente i comandi `al` per le etichette degli indirizzi                            |

Tutte e tre le esportazioni includono `program_start`, `program_end`, variabili,
array, subroutine ed etichette BASIC note dopo la generazione del codice. Ad
esempio, carica i simboli VICE con la sua opzione da riga di comando
`-moncommands demo.vs` o il comando del monitor `ll "demo.vs"`.

L'esportazione `.dbg` attuale fornisce informazioni sui segmenti e sui simboli
di indirizzo. Non include ancora le mappature istruzione-linea sorgente per
l'esecuzione passo passo a livello di sorgente.

### Elenco del codice assembly generato (novità nella versione 1.5.2)

Utilizzare `--asm` per scrivere un elenco di sorgenti 6502 leggibile accanto al
PRG:

```bash
ub build demo.ub --asm
```

For an output named `demo.prg`, this creates `demo.asm`. The listing is produced
from metadata collected while Ultimate Basic generates the machine code; it is
not merely a disassembly of the completed PRG. It contains:

- `; UB:` commenti che indicano l'intervallo di byte generato da ciascuna
  istruzione UB emittente;
- costanti denominate per variabili di pagina zero e array `$C000+`, inclusi i
  loro tipi/dimensioni;
- Nomi e indirizzi finali per le subroutine e le etichette BASIC;
- ha generato etichette `loc_xxxx` per i rami relativi e gli obiettivi
  `JMP`/`JSR` all'interno del programma;
- Mnemonici e operandi standard del 6502, con simboli del compilatore sostituiti
  laddove noti;
- l'indirizzo C64 esatto e i byte emessi accanto a ogni istruzione;
- Funzioni di supporto generate dal compilatore e codice incorporato nel loro
  ordine finale di memoria;
- `.byte` output per i byte che non vengono decodificati come istruzioni 6502
  supportate.

Le funzioni di supporto del compilatore ricevono nomi descrittivi come
`ub_helper_plot`, `ub_helper_line_erase`, `ub_helper_print_hex` e
`ub_helper_music_irq`. I dati incorporati noti, tra cui le istruzioni `data`,
gli array di caratteri/colori delle mappe, le definizioni di sprite e caratteri,
la tabella dei seni, i nomi dei file di caricamento, i file `incbin`, la musica
SID e i payload di Koala, vengono emessi come regioni `.byte` denominate. I
lunghi intervalli di indirizzo riempiti di zeri utilizzano la direttiva `.fill`
di KickAssembler.

Estratto di esempio:

```asm
.label x                 = $02 ; int

* = $080D

ub_start:
    cld                         ; $080D: D8
    ; UB: var x
    lda  #$01                   ; $080E: A9 01
    sta  x                      ; $0810: 85 02
```

I commenti indirizzo/byte rendono l'elenco facilmente confrontabile con `.prg`.
L'output utilizza la sintassi di KickAssembler (`.label`, `.byte`, `.fill` e `*
= origin`) in modo che possa essere riassemblato; i commenti in codice macchina
non influenzano il risultato.

`--add` richiede `--d64`. Il programma `.ub` compilato è sempre il primo file
sul disco; ogni file `--add` viene aggiunto successivamente. I nomi dei file sul
disco derivano dal nome del file sorgente, in maiuscolo (ad esempio `music.prg`
→ `MUSIC`).

Dopo una compilazione riuscita, il compilatore stampa sempre una mappa della
memoria:

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

Con `-v` l'output mostra inoltre le allocazioni interne ZP e un dump esadecimale
completo.

## Limitazioni note

| Caratteristica                        | Limitazione                                                                                                                                                                   |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Aritmetica intera                     | 8 bit senza segno (0–255); le variabili `word` contengono valori a 16 bit                                                                                                     |
| Sottoprogrammi                        | Nessuna ricorsione: gli slot dei parametri ZP vengono allocati staticamente.                                                                                                  |
| Variabili stringa                     | Read-only after init; assignment replaces the pointer, not the data                                                                                                           |
| Runtime di concatenazione di stringhe | `s1 + s2` stampa in sequenza — nessuna allocazione di heap o tracciamento della lunghezza                                                                                     |
| `rnd()` / `rnd(n)`                    | LCG semplice, non crittografico; periodo = 256                                                                                                                                |
| `abs()` / `sgn()` / `min()` / `max()` | Solo valori a 8 bit; `abs`/`sgn` trattano i valori come con segno (bit 7 = negativo → `abs` complemento a due, `sgn` restituisce `$FF`); `min`/`max` sono senza segno (0–255) |
| `plot`                                | I pixel fuori intervallo vengono eliminati silenziosamente (Y ≥ 200 o X ≥ 320 → nessuna operazione)                                                                           |
| `mplot`                               | Nessun controllo dei limiti: x deve essere compreso tra 0 e 159, y deve essere compreso tra 0 e 199.                                                                          |
| `mline` / `mrect`                     | Multicolore; x: 0–159, y: 0–199. I pixel fuori schermo si adattano (senza ritaglio) — mantieni le coordinate nell'intervallo                                                  |
| `mcircle`                             | Multicolore; ritaglia i punti fuori dallo schermo (x ≥ 160 o y ≥ 200 vengono saltati)                                                                                         |
| `color pen`                           | Solo Hires; imposta il nibble di primo piano delle celle toccate (sfondo mantenuto). Non ha effetto in modalità blocco (`plot4`/`circle4`)                                    |
| `rect`                                | Nessun controllo dei limiti — x: 0–319, y: 0–199; x1≤x2 e y1≤y2 non sono imposti (i rettangoli degeneri/invertiti producono un output indefinito)                             |
| `plot4`                               | Nessun controllo dei limiti: x deve essere compreso tra 0 e 79, y deve essere compreso tra 0 e 49 (modalità a blocchi)                                                        |
| `circle4`                             | Ritaglia i pixel del blocco fuori dallo schermo; il raggio utile è approssimativamente compreso tra 0 e 49 nella modalità blocco 80×50.                                       |
| `chr$`                                | Nessuna mappatura PETSCII↔ASCII: n viene passato così com'è a CHROUT                                                                                                          |
| `music play`                          | Richiede `load sid`; viene emesso un solo wrapper CIA1 (l'ultimo `music play` vince)                                                                                          |
| `graphics on double`                  | Solo Hires; utilizza `$4000–$7FFF` per il back buffer, quindi il codice del programma deve rimanere sotto `$4400`; non combinabile con sprite o multicolore                   |
| Segnalazione degli errori             | Solo in fase di compilazione; `onerr goto` gestisce gli errori di I/O del KERNAL in fase di esecuzione                                                                        |
