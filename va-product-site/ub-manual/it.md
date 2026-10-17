# Ultimate Basic v1.6.6 — Manuale della lingua

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
var x = 10 # intero a 8 bit (predefinito)
var ptr: word = $0400 # 16 bit — due byte di pagina zero, utilizzabili come indirizzo a 16 bit
var f: float = 3.5 # virgola fissa Q8.8 — byte alto = intero, byte basso = frazione
var msg = "HELLO" # variabile stringa (puntatore a dati PETSCII inline)
var s: string = "TEXT" # stringa con tipo esplicito
var scores = array(10) # array di byte, 10 elementi memorizzati in $C000+
var moments = array_word(8) # array di parole, 8 elementi di parola memorizzati in $C000+
const BORDER_ADDR = $D020 # costante in fase di compilazione (sostituita inline, senza slot ZP)
```

**Le parole chiave e gli identificatori non fanno distinzione tra maiuscole e
minuscole: `PRINT`, `Print` e `print` sono tutti validi.**

| Tipo                    | Larghezza          | Note                                                                                  |
| ----------------------- | ------------------ | ------------------------------------------------------------------------------------- |
| `int`                   | 8 bit              | valore predefinito per i letterali numerici                                           |
| `parola`                | 16 bit             | due byte ZP; possono essere usati come indirizzo in `poke`/`peek`                     |
| `float`                 | Q8.8 a 16 bit      | byte alto = parte intera (0–255), byte basso = parte frazionaria                      |
| `singolo` / `doppio`    | 5 byte, RAM        | punto mobile (formato C64 BASIC, ~9 cifre) — `dim x as double`; vedere *Punto mobile* |
| `stringa`               | puntatore          | coppia ZP → PETSCII terminato da null nel segmento di codice                          |
| `array(N)`              | N byte             | elementi byte; risiede in `$C000+`, non in ZP                                         |
| `Parola_array(N)`       | N×2 byte           | elementi di parola (16 bit); risiede in `$C000+`, non in ZP                           |
| `array(R, C, …)`        | ∏dimensioni byte   | multidimensionale (per righe); indice `arr[r, c]`                                     |
| `Parola_array(R, C, …)` | ∏dimensioni×2 byte | matrice di parole multidimensionale (per righe)                                       |

#### Dichiarazioni in stile BASIC: `dim … as …`

`dim name as type` è una grafia alternativa di `var name: type` — stessa
memoria, stesso codice:

```basic
DIM kor AS INTEGER # 16 bit con segno, inizia da 0
DIM nev AS STRING # stringa, inizia da ""
DIM fizetes AS DOUBLE # virgola mobile, inizia da 0
DIM x, y AS BYTE # diversi nomi, tutti con lo stesso tipo
DIM pont AS INTEGER = 1000, cim AS STRING = "C64" # inizializzatori, tipi misti
```

| `come …`            | Tipo base definitivo                                                               |
| ------------------- | ---------------------------------------------------------------------------------- |
| `byte`, `int`       | `int` (8 bit, 0–255)                                                               |
| `intero`            | intero con segno a 16 bit (−32768 … 32767) — QBasic                                |
| `parola`            | `parola` (16 bit senza segno, 0–65535)                                             |
| `singolo`, `doppio` | virgola mobile, 5 byte in RAM (±2,9·10⁻³⁹ … 1,7·10³⁸, ~9 cifre) — vedi *Variabile* |
| `float`             | `float` (Q8.8 punto fisso — 0–255.99, veloce)                                      |
| `stringa`           | `stringa`                                                                          |

- Senza `= valore`, i numeri iniziano da 0 e le stringhe da `""`.
- `dim a, b as integer` restituisce **entrambi** i nomi del tipo (stile VB.NET,
  non QBasic). Solo un singolo nome può avere un inizializzatore.
- `as` e i nomi dei tipi BASIC sono parole di contesto, non riservate: restano
  utilizzabili come nomi.
- Non supportato: `come lungo`, tipi struct (usa `var name: TName = array(N)`) —
  errori in fase di compilazione.
- Con `--explicit`, un `dim` senza `as` è un errore.
- L'assegnazione di stringhe ha una semantica di valore: `s = "TEXT"` punta al
  letterale, `t = s` e i valori calcolati vengono copiati nel buffer di `t`
  (vedere *Stringhe in fase di esecuzione*). Prima della versione 1.6.3, `s =
  "TEXT"` dopo la dichiarazione memorizzava un byte spazzatura nel puntatore.

#### Matrici con `dim`: `dim name(u1, u2, …) come tipo`

```basic
DIM tabla(2, 3) AS INTEGER ' 3 × 4 elementi: tabla(0..2, 0..3)
DIM kocka(1, 2, 3) AS BYTE ' qualsiasi numero di dimensioni
DIM ar(9) AS DOUBLE ' 10 valori in virgola mobile (5 byte ciascuno)
DIM nevek(4) AS STRING ' 5 stringhe, tutte iniziano con ""
DIM v(9) ' nessun AS → array di byte

tabla(2, 3) = 999 ' Indice in stile QBasic con ( )
tabla[2, 3] = 999 ' … o il solito [ ]
nevek(0) = "ZSOLT"
PRINT tabla(2, 3); " "; nevek(0); " "; ar(1)
```

- Ogni limite è l'indice più alto (regola BASIC): la dimensione t(2, 3) ha 3 × 4
  elementi. La variabile t = array(3, 4) prende il conteggio degli elementi —
  stesso array.
- Tipi di elementi: `byte`/`int` → 1 byte, `integer` (con segno) / `word` → 2
  byte, `float` → Q8.8 a 2 byte, `single`/`double` → virgola mobile a 5 byte,
  `string` → puntatore a 2 byte. I limiti devono essere costanti in fase di
  compilazione. Gli array risiedono in `$C000-$CFFF` (4 KB); quando ne serve di
  più, l'intera area dell'array si sposta in `$A000-$CFFF` (12 KB, sotto la ROM
  BASIC — vedi *Memoria array*). Più di 12288 byte è un errore in fase di
  compilazione.
- Gli elementi dell'array di stringhe iniziano come `""`; `nevek(i) = "TEXT"` /
  `= s` / `= a + b`, `n = nevek(i)`, stampa, `+`, passaggio a un parametro
  `string` e `input nevek(i)` funzionano tutti (i valori non letterali vengono
  copiati in uno slot di 31 caratteri per elemento).
- `name(i)` L'indicizzazione funziona anche per gli array dichiarati con `var a
  = array(…)`.
- Un array per gruppo `dim`: `dim a(3) come byte, n come intero` va bene, `dim
  n, a(3) come intero` è un errore. Nessun inizializzatore: usa `nome dati: …`.

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

**Musica** `tune` (parola chiave del blocco; le righe all'interno - `speed`,
`inst`, `order`, `pat` - non sono riservate)

**Tipi e relativi ai tipi** `int`, `word`, `float`, `string`, `array`,
`array_word`

**Stampa e I/O** `stampa`, `spc`, `tab`, `at`, `input`, `chr$`, `str$`, `hex`,
`bin`, `apri`, `chiudi`, `carica`, `salva`, `chain`, `dati`, `read`, `include`,
`incbin` (anche `dec` — elencato sopra come istruzione di decremento; lo stesso
token viene utilizzato per il formato di stampa `dec(n, larghezza)`)

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
`sprbghit`, `box_hit`, `chardef`, `charset`, `org`, `expand`, `priority`

**Suono e musica** `sid`, `sound`, `sfx`, `volume`, `music`, `play`, `pause`,
`resume`, `stop`

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

| Prenotato                                          | Rinominare suggerito                |
| -------------------------------------------------- | ----------------------------------- |
| `fine`                                             | `stop_at`, `finish`, `last`         |
| `stop`                                             | `stop_a`, `halt`                    |
| `volte`                                            | `conteggio`, `n`, `iteri`           |
| `schermo`                                          | `scraddr`, `screen_addr`            |
| `bordo`, `sfondo`, `testo`                         | `border_addr`, `bg_col`, `text_col` |
| `morsetto`                                         | `cappuccio`, `legato`               |
| `linea`, `cerchio`, `rettangolo`                   | `ln`, `circ`, `box_r`               |
| `dati`, `lettura`                                  | `byte`, `byte_successivo`           |
| `carica`, `salva`, `apri`, `chiudi`                | `carica_file`, ...                  |
| `mappa`, `mostra`, `nascondi`                      | `tilemap`, `reveal`, `conceal`      |
| `riproduci`, `pausa`, `riprendi`, `stop`, `volume` | `play_song`, `vol`                  |
| `int`, `float`, `word`, `string`                   | `n_int`, `speed_f`, `addr`, `msg`   |

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
z = x e 15 # AND bit a bit
w = a o b # OR bit a bit
v = a x o b # XOR bit a bit
m = x shl 3 # shift a sinistra
n = x shr 2 # shift a destra (aritmetica per un INTERO: -8 shr 1 = -4)
r = x mod 40 # resto; x mod 0 = x, x / 0 = 255
b = bnot x # NOT bit a bit: x XOR 255 (complementa tutti gli 8 bit)
```

Confronti: `==` `!=` `<` `>` `<=` `>=` (ritorno 1/0)

Codice aritmetico (1.6.0): `*` per una costante si compila in shift / shift-add
(`x * 8` → 3× `ASL`), altrimenti in un ciclo shift-add di al massimo 8 round.
`/` e `mod` per una potenza di due sono `LSR` / `AND #(n-1)`, altrimenti un
ciclo shift-sottrazione di 8 round il cui tempo di esecuzione non dipende più
dal quoziente. La divisione per zero è definita come: `x / 0 = 255`, `x mod 0 =
x` (prima della versione 1.6.0 si bloccava).

`mod` con un operando `word` o `integer` (o una costante negativa) è un resto a
16 bit con il segno del dividendo, come in QBasic: `-7 mod 3` = -1, `7 mod -3` =
1, `(w + 5) mod 7` mantiene 16 bit. Con un operando SINGOLO / DOPPIO funziona in
virgola mobile (vedi *Virgola mobile*). `shr` di un `intero` è uno spostamento
aritmetico (il segno viene mantenuto: `-8 shr 1` = -4); i valori di `word` e
byte vengono spostati logicamente. `x = x + 1` / `x = x - 1` (e ±2) vengono
compilati in `INC` / `DEC`.

### Incremento / Decremento

```basic
inc x # x = x + 1 (INC zp — istruzione singola)
dec x # x = x - 1 (DEC zp — istruzione singola)
```

Per le variabili `word` viene gestito il riporto: `inc` utilizza `INC lo; BNE
skip; INC hi`; `dec` utilizza `LDA lo; BNE skip; DEC hi; DEC lo`.

### Assegnazioni composte

```basic
x += 5 # x = x + 5
x -= 3 # x = x - 3
x * = 2 # x = x * 2
x /= 4 # x = x / 4
x e = 15 # x = x e 15 (AND bit a bit)
x o = 64 # x = x o 64 (OR bit a bit)
x x o = 255 # x = x x o 255 (XOR bit a bit)
x shl = 2 # x = x shl 2
x shr = 1 # x = x shr 1
```

### Stampa

```basic
stampa "CIAO"
stampa x
stampa x, y, "testo"
stampa # riga vuota

stampa spc(5) # stampa 5 spazi
stampa tab(20), "VALORE" # sposta il cursore alla colonna 20, quindi stampa
stampa "A", spc(3), "B" # combina liberamente

stampa "A=" + a # stringa + variabile numerica
stampa s1 + s2 # due variabili stringa → stampa sequenziale
stampa "Ciao " + "Mondo" # due letterali → riduzione in fase di compilazione
stampa chr$(13) # stampa tramite codice PETSCII
```

Per impostazione predefinita i numeri vengono stampati senza spazi aggiuntivi e
`,` separano semplicemente gli elementi (`stampa 1, 2` restituisce `12`). Per la
spaziatura BASIC del C64, compilare con `--basic-print`, oppure inserire una
riga `option basic print` nel programma: un numero viene quindi stampato con uno
spazio iniziale (o il suo `-`) e uno spazio finale (`print 5` → ` 5 `), un `,`
sposta alla successiva zona di stampa a 10 colonne e uno spazio finale `,`
mantiene il cursore sulla riga come uno spazio finale `;`. Le stringhe, `spc`,
`tab`, `hex`, `bin`, `dec`, `chr$` e `str$` vengono stampate come prima.

#### `STAMPA USANDO`

```basic
DIM ar AS DOUBLE = 1234.5
DIM s AS STRING = "ALMA"
PRINT USING "###.##"; 3.14159 ' 3.14
PRINT USING "Ar: #,###.## Ft"; ar ' Ar: 1,234.50 Ft
PRINT USING "+##"; 7 ' +7
PRINT USING "##.##-"; -2.25 ' 2.25-
PRINT USING "##"; 123 ' %123
PRINT USING "[&amp;] [!] [\ \]"; s; s; s ' [ALMA] [A] [ALMA]
PRINT USING "## "; 1, 2, 3 ' 1 2 3
```

| Campo                 | Senso                                                                                                                                  |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `#`                   | posizione della cifra; i numeri sono allineati a destra e arrotondati ai decimali                                                      |
| `.`                   | punto decimale; i `#` che lo seguono sono le cifre decimali (al massimo 9)                                                             |
| `,`                   | prima del punto: separatori delle migliaia (ciascuno `,` è una posizione)                                                              |
| `+` all'inizio        | stampare sempre il segno (`+` / `-`)                                                                                                   |
| `-` alla fine         | stampare il segno meno dopo il numero (uno spazio se positivo)                                                                         |
| `&amp;` / `!` / `\ \` | stringa: l'intera stringa / il suo primo carattere / esattamente tanti caratteri quanti sono i caratteri del campo (`\` + spazi + `\`) |
| `_`                   | stampa il carattere successivo così com'è (`_#`)                                                                                       |

Un numero che non rientra viene stampato con `%` davanti (`%123`); uno zero
iniziale isolato viene eliminato per primo (`#.##` con -0.5 → `-.50`). Gli altri
caratteri vengono stampati così come sono. I valori scorrono attraverso i campi
(il formato ricomincia quando termina); dopo l'ultimo valore viene stampato il
testo fino al campo successivo. Un `;` o `,` finale mantiene il cursore sulla
riga. Il formato deve essere una stringa letterale; i campi `**`, `$$` e `^^^^`
non sono supportati. Un programma con `PRINT USING` include il runtime in
virgola mobile (solo le parti necessarie).

### chr$

```basic
print chr$(65) # stampa il carattere con codice PETSCII 65 ('A')
var c = chr$(n) # memorizza il valore del byte n nella variabile c
print "&gt;" + chr$(42) # utilizzabile nella concatenazione di stringhe
```

### Ramificazione

```basic
se x == 1 allora
stampa "SÌ"
altrimenti
stampa "NO"
fine
```

### Seleziona / Caso

```basic
Seleziona x

Caso 1:

stampa "UNO"

Caso 2:

stampa "DUE"

Altro:

stampa "ALTRO"
Fine
```

`select expr` valuta l'espressione una volta e la confronta con ogni valore
`case` in ordine. Il primo corpo del caso corrispondente viene eseguito e il
controllo salta a dopo `end`. Il corpo opzionale `else:` viene eseguito se
nessun caso corrisponde. Tutti i valori devono essere a 8 bit (0–255).

### Cicli

```basic
ciclo 5 # ciclo contato (5 iterazioni)
stampa "CIAO"
fine

times 5 # alias per ciclo N ... fine
stampa "CIAO"
fine

ciclo # ciclo infinito
x = x + 1
se x == 5 allora continua fine # salta all'iterazione successiva
se x == 100 allora interrompi fine
fine

variabile i = 0
per i = 1 a 10 # per...prossimo (preferito)

se i == 5 allora continua fine # salta al passo di incremento
stampa i
prossimo

per i = 0 a 20 passo 2
stampa i
prossimo i # il nome della variabile dopo 'prossimo' è opzionale

per i = 10 a 1 passo -1 # conto alla rovescia — è supportato un passo costante negativo
stampa i
prossimo

per i = 20 a 0 passo -2 # termina correttamente a i = 0 (11 iterazioni)
stampa i
prossimo i

variabile i = 0
ciclo i = 1 a 10 # sintassi legacy loop..end — codice identico
stampa i
fine

mentre x &lt; 100

x = x + 1
fine

ripeti # do-while: il corpo viene eseguito almeno una volta

x = x + 1
finché x == 100 # esce quando la condizione è vera
```

**Regole di direzione per `for`/`loop`:**

| Caso                                                   | Comportamento                                                                                                                       |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| `for i = 1 to 10` (predefinito `step +1`, `from ≤ to`) | conta in avanti, standard                                                                                                           |
| `for i = 0 to 20 step 2` (passo positivo, `from ≤ to`) | conta in avanti di 2                                                                                                                |
| `for i = 10 to 1 step -1` (passo costante negativo)    | conto alla rovescia; il corpo corre per i = 10, 9, ..., 1                                                                           |
| `for i = 20 to 0 step -2` (fino a zero)                | termina in i = 0 rilevando il wrap-around al di sotto di 0 dopo il decremento; nessun ciclo infinito                                |
| `for i = 10 to 1` (nessun passo, `from > to`)          | **errore in fase di compilazione**: `for-loop: from (10) > to (1) with default step +1 loops 0 times — use 'step -1' to count down` |

Forma del codice (1.6.0): il ciclo è *ruotato* — `test JMP` (omesso quando i
limiti costanti garantiscono un primo passaggio), il corpo, `var += step`,
quindi il test in basso che si dirama di nuovo verso il corpo, quindi non c'è
`JMP` extra per iterazione. Il passo rileva il wrap-around a 8 bit in entrambe
le direzioni (`INC`/`BEQ` o `ADC`/`BCS` contando in avanti, `BEQ`/`DEC` o
`SBC`/`BCC` contando all'indietro), quindi `per i = 0 a 255` viene eseguito 256
volte e si ferma, e `per i = N a 0 passo -k` è sempre finito. I limiti e i passi
costanti vengono utilizzati come immediati (nessuna pagina zero); Un limite o un
passo non costante viene valutato una sola volta e memorizzato nella pagina zero
permanente.

I valori non costanti `step` (ad esempio da una variabile o un'espressione)
vengono trattati come positivi in fase di compilazione; se è necessario un conto
alla rovescia con un valore di passo in fase di esecuzione, suddividere il ciclo
o utilizzare una struttura `while`.

### Etichette e vai a

```basic
etichetta main_loop

x = x + 1
se x &lt; 10 allora vai a main_loop fine
```

Il forward `goto` (etichetta definita in seguito) è completamente supportato.

`gosub label` / `return` salta a un'etichetta e ritorna indietro (JSR / RTS a
livello di codice macchina). L'etichetta deve essere un'istruzione `label name`,
non una `sub`: non ha parametri e condivide lo stesso ambito di pagina zero.
`gosub` supporta i riferimenti in avanti (etichetta definita dopo `gosub`).

```basic
gosub disegna_bordo
... etichetta disegna_bordo

# ... disegna qualcosa ...
return # RTS — ritorna all'istruzione successiva a gosub
```

### Sottoprogrammi

```basic
sub greet()
print "CIAO!"

end

sub set_color(col)
color bordo col
color testo col
end

greet() # chiamata con parentesi
call greet # chiamata con parola chiave (senza parentesi)
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

restituisci x * x
fine

fn add(a, b)

restituisci a + b
fine

fn clamp(val, lo, hi)
se val &lt; lo allora restituisci lo fine
se val &gt; hi allora restituisci hi fine
restituisci val
fine

var s = square(9) # s = 81 — chiamata di funzione come espressione
var c = clamp(joy, 0, 39) # c = valore bloccato
print add(10, 20) # 30 — utilizzabile in linea in print
```

Le funzioni supportano un tipo di ritorno opzionale `: word` per valori a 16
bit:

```basic
fn get_addr(): word

return $C000
end

var ptr: word = get_addr() # ptr = $C000
poke ptr, 42 # STA (ptr),Y — indirizzamento indiretto valido
var v = peek(ptr) # LDA (ptr),Y
```

`fn` viene emesso nel passaggio 2 (come `sub`), quindi i corpi delle funzioni
non vengono mai eseguiti all'avvio. I riferimenti in avanti sono completamente
supportati.


#### Stile QBasic `FUNZIONE` / `SOTTOSTANTE`

```basic
FUNZIONE Negyzet (szam COME INTERO) COME INTERO
    Negyzet = szam * szam ' valore restituito = assegna al nome della funzione
FINE FUNZIONE

FUNZIONE Nagyobb (a AS BYTE, b AS BYTE) AS BYTE
    Nagyobb = a
    SE b &gt; a ALLORA
        Nagyobb = b
        FUNZIONE USCITA 'torna adesso, con il valore finora assegnato
    FINE SE
FINE FUNZIONE

SUB Koszont (nev AS STRING)
    STAMPA "Üdvözöllek, "; nev; "!"
FINE SOTTO

n = Negyzet(30)
Koszont "Zsolt" 'chiamata senza parentesi
Koszont("Zsolt") ' ... o con loro
CHIAMA Koszont("Zsolt")
```

- `function` è sinonimo di `fn`; `p AS type` funziona negli elenchi di parametri
  e `AS type` dopo `)` fornisce il tipo di ritorno (stessi nomi di tipo di
  `dim`). `: type` funziona ancora.
- L'assegnazione al nome della funzione memorizza in una variabile nascosta
  `<name>__result` che viene restituita a `END FUNCTION` / `EXIT FUNCTION`;
  `return expr` funziona ancora.
- `END SUB`, `END FUNCTION`, `END IF`, `END SELECT` sono accettati (la seconda
  parola è opzionale); `EXIT SUB` / `EXIT FUNCTION` restituisce (il semplice
  `exit` è ancora `bye`).
- Un sub/fn può essere chiamato senza parentesi: `Koszont "Zsolt"`, `Rajzol x,
  y`.
- `PRINT a; b; c` — `;` unisce gli elementi senza spazi; un `;` finale sopprime
  il carattere di nuova riga. Un `;` seguito da un'istruzione (`print x; y = 1`)
  separa comunque le istruzioni.
- Le lettere accentate nelle stringhe letterali vengono stampate come la loro
  lettera base (`ü` → `u`, `ő` → `o`); il set di caratteri C64 non ha accenti.
- I parametri word/float ora ricevono entrambi i byte e una stringa letterale
  passata a un parametro `string` funziona (prima funzionava solo il byte lo /
  una variabile stringa).
- Nessuna ricorsione (i parametri risiedono in slot statici a pagina zero);
  dalla versione 1.6.3 una chiamata ricorsiva genera un errore di compilazione
  anziché risultati errati senza generare alcun messaggio di errore.

#### Ulteriori informazioni sulla sintassi di QBasic (1.6.3)

I moduli QBasic riportati di seguito vengono compilati accanto alla sintassi
originale (i commenti `==`, `end`, `loop`, `#` continuano a funzionare).

```basic
' commento (stile QBasic, come #)
SE x = 3 ALLORA STAMPA "tre" ' SE su una sola riga: non è necessario END IF
SE x &lt;&gt; 3 ALLORA STAMPA "no" ALTRIMENTI STAMPA "sì"
SE n &lt; 0 ALLORA

STAMPA "negativo"
ALTRIMENTI SE n = 0 ALLORA

STAMPA "zero"
ALTRIMENTI

STAMPA "positivo"
END IF

ESEGUI FINCHÉ i &lt; 10 : i = i + 1 : CICLO ' anche ESEGUI FINCHÉ c … CICLO,
ESEGUI : i = i - 1 : CICLO FINCHÉ i = 0 ' ESEGUI … CICLO FINCHÉ c, ESEGUI … CICLO (infinito)
FINCHÉ k &lt;&gt; 5 : k = k + 1 : FINE
PER i = 1 A 100

SE i = 12 ALLORA ESCI PER ' ESCI ESEGUI / ESCI PER / ESCI WHILE
NEXT

SELECT CASE n
CASE 1, 2, 3: STAMPA "piccolo"
CASE DA 10 A 20: STAMPA "adolescente"
CASE &gt; 1000: STAMPA "grande"
CASE ALTRIMENTI: STAMPA "altro"
END SELECT

END ' termina il programma (lo schermo viene mantenuto)
```

- **Condizioni:** all'interno di `SE` / `ALTRIMENTISE` / `FINCHÉ` / `FINO A` /
  `CICLO FINCHÉ|FINO A`, viene confrontato un singolo `=`. `&lt;&gt;` significa
  non uguale ovunque (come `!=`).
- **IF su una singola riga:** un'istruzione subito dopo `THEN` crea un IF su una
  singola riga che termina con la riga, oppure con un `end` sulla stessa riga
  (`if c then x = 1 end`, come prima). Un IF su più righe richiede
  un'interruzione di riga dopo `THEN`. Come in QBasic, tutto ciò che segue
  `THEN` su quella riga appartiene all'IF (`… THEN EXIT FOR : NEXT`
  inghiottirebbe `NEXT`).
- **`END` da solo:** un `END` che non chiude un blocco termina il programma,
  come QBasic. Un `end` in eccesso quindi non viene più visualizzato come
  errore.
- **`blocchi DO`:** all'interno di un `DO`, un `LOOP` alla fine di una riga lo
  chiude (i cicli originali `loop N … end` / `loop i = … end` funzionano ancora
  all'interno).
- **`SELECT CASE`:** la vecchia forma `select x` / `case n:` rimane invariata.
  `SELECT CASE` viene ridotto a una catena IF su una variabile nascosta
  `select__N`.

#### Stringhe in fase di esecuzione (1.6.3)

```basic
DIM s AS STRING, t AS STRING
s = "Ponte: " + ponte + "!" ' i numeri diventano testo (16 bit, intero con segno)
t = s ' una copia: la modifica di s in seguito non modifica t
s = s + "?"
PRINT LEFT$(s, 4); RIGHT$(s, 2); MID$(s, 7, 3); MID$(s, 7)
PRINT LEN(s + t), VAL("1234") + 1, STR$(ponte)
IF s = "ABC" OR t &lt;&gt; "" THEN PRINT "confronta con = / &lt;&gt;"
```

- **Buffer:** una variabile stringa che ottiene un valore calcolato (`+`,
  `sinistra$`, `destra$`, `centro$`, numeri, un'altra variabile) possiede un
  buffer di 80 caratteri; i risultati più lunghi vengono troncati a 80.
  L'assegnazione di un letterale punta comunque solo ad esso.
- **Array di stringhe:** gli elementi che ottengono un valore non letterale (o
  `input`) ottengono il proprio slot da 32 byte (31 caratteri), quindi `input
  nevek(i)` in un ciclo mantiene ogni nome.
- **`STR$` / `VAL`:** `STR$` di un valore a 16 bit o con segno non ha zeri
  iniziali (`"-42"`). Per compatibilità, `STR$` di un byte mantiene la forma a 3
  cifre (`"007"`). `VAL` legge numeri con segno a 16 bit (`VAL("1234") + 1` =
  1235).
- **Confronto:** `=` / `&lt;&gt;` (e `==` / `!=`), e `&lt;` `&gt;` `&lt;=`
  `&gt;=` in ordine PETSCII come C64 BASIC; una stringa viene prima di ogni
  stringa più lunga che inizia (`"AB" &lt; "ABC"`, `"" &lt; "A"`).

#### Numero intero con segno, INPUT, DOUBLE (1.6.3)

- **INTEGER è con segno:** `DIM x AS INTEGER` è con segno a 16 bit (−32768 …
  32767, come QBasic): la stampa, i confronti `&lt;` `&gt;`, `/` (tronca verso
  zero), `ABS`, la conversione del testo, i cicli `INPUT` e `FOR` che passano
  per zero (`FOR i = 3 TO -3 STEP -2`) seguono tutti il segno. `WORD` rimane
  senza segno 0 … 65535. Il segno meno unario funziona ovunque (`a &lt; -10`, `x
  * -2`).
- **`FOR` con un contatore a 16 bit** (`INTEGER` / `WORD`) è un vero ciclo a 16
  bit. Prima si riavviava a 256, quindi `FOR k = 0 TO 300` veniva eseguito 45
  volte.
- **`INPUT`:** in un INTEGER / WORD legge fino a 6 caratteri (con `-` per
  INTEGER), in un DOUBLE accetta `12.5` (due decimali). `INPUT t(i)` legge in un
  elemento dell'array e `INPUT "prompt"; x` funziona anche.
- **DOUBLE ÷ DOUBLE** ora è esatto (`7,5 / 2,5 = 3,00`); prima, veniva
  utilizzata solo la parte intera del divisore. DOUBLE × DOUBLE era già
  supportato.
- **Gli array di oltre 256 byte** (`DIM t(200) AS INTEGER`, `DIM g(19, 19)`)
  funzionano con indici variabili; l'indice utilizzato per tornare a 256 e
  scrivere nell'elemento sbagliato.
- **La ricorsione** (una sotto-funzione/funzione che chiama se stessa,
  direttamente o tramite altre) è un errore di compilazione. In passato veniva
  compilata e restituiva risultati errati, perché i parametri risiedono in slot
  fissi di pagina zero.

### Array

```basic
var scores = array(8) # 8 byte all'indirizzo $C000

# (tutti gli array vengono riempiti con zeri una volta all'avvio del programma - novità della versione 1.5.7)

scores[0] = 100 # indice costante → STA $C000
scores[i] = 99 # indice variabile → STA (ptr),Y
var v = scores[i] # LDA (ptr),Y
print scores[2] # utilizzabile in linea nella stampa

var moments = array_word(8) # 16 byte (8×2) all'indirizzo $C000+

moments[0] = $1234 # indice costante → STA $C000 (basso), STA $C001 (alto)
moments[i] = $5678 # indice variabile → ASL A per stride; (ptr),Y × 2
var t: word = moments[1] # LDA $C002, LDA $C003
```

**Array multidimensionali** (novità della versione 1.5.3)

Gli array possono essere dichiarati con più di una dimensione. Vengono
memorizzati **per riga** e indicizzati con un elenco di indici separati da
virgole. La dimensione totale è il prodotto di tutte le dimensioni.

```basic
var grid = array(8, 8) # 8×8 = 64 byte in $C000
grid[1, 0] = 11 # riga 1, colonna 0 → indice flat 1*8+0 = 8 → STA $C008
grid[0, 1] = 22 # riga 0, colonna 1 → indice flat 1 → STA $C001
grid[r, c] = 33 # variabile → calcola r*8 + c, quindi STA (ptr),Y
var v = grid[r, c] # LDA (ptr),Y

var wm = array_word(4, 4) # array di parole 4×4 = 32 byte
wm[1, 2] = $ABCD # elemento 1*4+2 = 6 → byte $C00C/$C00D

const RIGHE = 3
const COLONNE = 5
var m = array(RIGHE, COLONNE) # le dimensioni possono essere costanti in fase di compilazione
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
tipo TEntity

var x: int # 1 byte
var y: int # 1 byte
var hp: word # 2 byte → dimensione elemento = 4
endtype

const N = 8
var enemies: TEntity = array(N) # alloca N × 4 = 32 byte a $C000

enemies[0].x = 5
enemies[0].y = 10
enemies[0].hp = $0100
var v = enemies[0].hp # lettura inversa — LDA $C002 / LDA $C003

var i: int = 2
enemies[i].x = 42 # indice variabile → idx * dimensione_elemento + offset

# Campo float (virgola fissa Q8.8)
type TBall
var bx: int # 1 byte
var by: int # 1 byte
var vel: float # 2 byte Q8.8 → dimensione elemento = 4
endtype

var balls: TBall = array(3)
balls[0].vel = 1.5 # memorizza Q8.8: hi=1, lo=128
var f: float = balls[0].vel # legge il campo float nella variabile float
print balls[0].vel # stampa "1.50"
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
var ptr: parola = $0400 # due byte ZP: lo=$00 hi=$04
poke ptr, 6 # STA (ptr),Y
var v = peek(ptr) # LDA (ptr),Y
```

**Prodotti a 16 bit (corretti nella versione 1.5.7).** Un prodotto assegnato a
una `word` mantiene tutti i 16 bit, anche quando nessuno dei due fattori è una
`word`:

```basic
var score: word = 0
var level = 3
score += 300 * level # 900 (prima della 1.5.7 questo veniva troncato a 8 bit: 44)
score = score + 100 * level
var big: word = 100 * level + 900
```

Dalla versione 1.6.1 questo vale anche all'interno delle somme e per `shl`, e
per i moltiplicatori costanti superiori a 255: `py = cy * 8 + fy`, `py = (cy shl
3) + fy` e `w = cy * 300` mantengono tutti i 16 bit (prima, le forme di somma
venivano troncate a 8 bit). I target di byte mantengono i risultati a 8 bit.

### Grafica bitmap

```basic
grafica attiva # Modalità bitmap ad alta risoluzione VIC-II (320×200, 1 bpp); bitmap a $2000
grafica attiva multi # Modalità bitmap multicolore VIC-II (160×200, 2 bpp, 4 colori/cella)
grafica disattiva # ritorno alla modalità testo

gcls # cancella la bitmap (riempie da $2000 a $3FFF) + imposta i colori della matrice video

plot x, y # imposta il pixel in (x, y); x: 0-319, y: 0-199
plot erase x, y # cancella il pixel (maschera AND)
plot xor x, y # attiva/disattiva il pixel (maschera EOR) — animazione senza sfarfallio
circle x, y, r # cerchio con punto medio centrato in (x, y) con raggio r; ritaglia i punti fuori schermo
linea x1, y1, x2, y2 # linea di Bresenham da (x1,y1) a (x2,y2); x: 0-319, y: 0-199
cancella linea x1, y1, x2, y2 # cancella i pixel lungo la linea (maschera AND)
xor linea x1, y1, x2, y2 # inverte i pixel lungo la linea (maschera EOR)
rettangolo x1, y1, x2, y2 # disegna il contorno del rettangolo (4 lati); x: 0-319, y: 0-199
cancella rettangolo x1, y1, x2, y2 # cancella il contorno del rettangolo (maschera AND)
xor rettangolo x1, y1, x2, y2 # XOR del contorno del rettangolo (maschera EOR)
dipingi x, y # riempimento a inondazione a 4 connessioni da (x, y); Riempie i pixel vuoti delimitati da un valore predefinito

color pen c # imposta il colore del disegno ad alta risoluzione (0-15); vedi sotto

# ── Bitmap multicolore (grafica su multi, 160×200) ──
mplot x, y, color # imposta il pixel multicolore (x: 0-159, y: 0-199, color: 0-3)
mline x1, y1, x2, y2, color # linea multicolore
mrect x1, y1, x2, y2, color # contorno di un rettangolo multicolore
mcircle x, y, r, color # cerchio multicolore
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
grafica su
gcls
penna colorata 2 # rossa
linea 0, 0, 100, 100
penna colorata 6 # blu
cerchio 160, 100, 40
visualizzazione su
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
grafica su multi
gcls
mcircle 80, 100, 40, 1
mrect 10, 10, 150, 190, 2
mline 0, 0, 159, 199, 3
visualizza su
```

`mline`/`mrect`/`mcircle` riutilizzano le stesse routine di Bresenham / punto
medio delle loro controparti ad alta risoluzione, tracciando ogni pixel
attraverso `mplot`; i punti fuori schermo (x ≥ 160 o y ≥ 200) vengono saltati.

### Immagine bitmap a doppio buffer (senza sfarfallio)

```basic
grafica attiva doppia # bitmap ad alta risoluzione con doppio buffer (320×200)
gcls # cancella il back buffer NASCOSTO
line 0, 0, 319, 199 # tutto il disegno (grafico/linea/cerchio/rettangolo/pittura/gcls) va al back buffer
flip # mostra il buffer disegnato; reindirizza il disegno all'altro
grafica disattivata # torna alla modalità testo (ripristina il banco VIC 0)
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
grafica attiva blocco # modalità pixel blocco 80×50 (modalità testo + set di caratteri personalizzato a 4 pixel a $2800)
grafica disattivata # torna alla modalità testo
gcls # cancella l'area di gioco del blocco: RAM schermo $0400-$07FF + RAM colore $D800-$DBFF

plot4 x, y # imposta il pixel del blocco in (x, y); x: 0-79, y: 0-49
plot4 erase x, y # cancella il pixel del blocco in (x, y)
circle4 x, y, r # disegna il punto medio del cerchio nei pixel del blocco; ritaglia a 80×50
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
cls # cancella lo schermo (KERNAL $E544)
cls fast # riempimento rapido: RAM schermo + RAM colori + HOME

color text 14 # registro colore testo $0286
color border 6 # $D020
color bg 0 # $D021
color pen 2 # colore di disegno ad alta risoluzione (0-15) per grafico/linea/rettangolo/cerchio/pittura

screen 0, 0, 65 # scrive il carattere 65 ('A') nella RAM schermo alla colonna 0, riga 0 ($0400)
screen 10, 5, ch # colonna 10, riga 5 — colonna/riga possono essere variabili
screen 5, 3, 42, 7 # carattere 42 alla colonna 5, riga 3, colore 7 (scrive anche nella RAM colori $D800)
screen x, y, ch, col # tutti e quattro gli argomenti come variabili

display on # riattiva il display VIC ($D011) (bit DEN)
schermo spento # schermo vuoto

minuscolo # CHR$(14) → commuta VIC-II al set di caratteri minuscolo/maiuscolo
maiuscolo # CHR$(142) → riporta VIC-II al set di caratteri maiuscolo/grafico

cursore 20, 10 # sposta il cursore alla colonna 20, riga 10 (TRAMA KERNAL $FFF0)
cursore x, y # colonna dalla variabile x (0–39), riga da y (0–24)

stampa a 20, 10, "HELLO" # cursore(20,10) + stampa in un'unica istruzione (senza a capo finale)
stampa a x, y, "Punteggio:", punteggio # qualsiasi combinazione di espressioni
stampa a 0, 0 # solo posizione (nessun testo, nessun a capo)

scorrimento x 3 # imposta lo scorrimento orizzontale fine: $D016 bit 0-2 = 3 (0-7)
scroll y 2 # imposta lo scorrimento verticale fine: $D011 bit 0-2 = 2 (0-7)
scroll x n # il valore può essere una variabile o un'espressione (mascherata ai bit 0-2)
scroll x 7 narrow # imposta lo scorrimento fine e forza la modalità a 38 colonne (nascondi la colonna del bordo)
scroll x 0 wide # imposta lo scorrimento fine e ripristina la modalità a 40 colonne
scroll row 12 left # sposta la riga 12 della RAM dello schermo a sinistra di un carattere
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
velocità 4 # imposta la CPU a 4 MHz (legge $D031, aggiorna i bit 0-3, riscrive)
velocità 48 # 48 MHz (velocità massima su U64)
velocità massima # uguale a velocità 48 (alias)
velocità disattivata # torna a 1 MHz (alias per velocità 1)

badlines attiva # abilita la temporizzazione badline (bit 7 di $D031 = 0, comportamento predefinito C64)
badlines disattiva # disabilita la temporizzazione badline (bit 7 di $D031 = 1, più cicli CPU)

var t = turbo() # 1 se turbo è attivo (bit 0-3 di $D031 != 0), 0 se a 1 MHz
```

Valori MHz disponibili: `1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 20, 24, 32, 40,
48`. I valori costanti vengono arrotondati per difetto alla velocità disponibile
più vicina in fase di compilazione. I valori variabili vengono trattati come un
indice di velocità grezzo (0–15) e sottoposti a OR con i bit 0-3 di `$D031`.

| Indice $D031 | MHz (U64) | MHz (U64 Elite-II) |
| ------------ | --------- | ------------------ |
| 0            | 1         | 1                  |
| 3            | 4         | 4                  |
| 6            | 8         | 10                 |
| 11           | 20        | 24                 |
| 15           | 48        | 64                 |

Richiede che **U64 Turbo Control** sia impostato su `U64 Turbo Registers` o
`Turbo Enable Bit` nel menu di configurazione U64. Su un normale C64 o emulatore
senza il registro, i valori da `poke` a `$D031` vengono silenziosamente
ignorati.

### Tastiera

```basic
var key = getch() # attesa attiva su $FFE4 fino alla pressione del tasto; restituisce il codice PETSCII
var k = inkey() # non bloccante: restituisce il codice PETSCII, o 0 se nessun tasto è premuto
waitkey # attende fino alla pressione di un tasto (scansione della matrice CIA1; funziona durante l'IRQ)
var k = waitkey() # uguale ma restituisce i bit grezzi della colonna $DC01 (bit 0 = tasto premuto)
var j = joy(2) # legge la porta joystick 2; restituisce i bit invertiti 0-4
var j = joy(1) # legge la porta joystick 1

# bit0=su(1) bit1=giù(2) bit2=sinistra(4) bit3=destra(8) bit4=fuoco(16)
var mx = mouse_x() # mouse 1351: posizione X accumulata (helper: carica+ritardo+delta)
var my = mouse_y() # mouse 1351: posizione Y accumulata (EOR #$FF invertito)
var mb = mouse_btn() # pulsanti del mouse: legge $DC01 — bit0=sinistra (fuoco), bit1=destra (pin su)
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
arrivederci # JSR $E544 (cancella schermo), cancella flag STOP, RTS in BASIC
exit # alias per arrivederci
```

### Tempistica

```basic
attendi 50 # attendi 50 transizioni tra linee raster (~3,2 ms)
attendi raster 100 # ruota fino a quando $D012 == 100 (effetti di suddivisione raster)
ritardo 1 # attendi 1 frame PAL (1/50 s ≈ 20 ms)
ritardo 20 # attendi 20 frame ≈ 0,4 s; n può essere una variabile (0–255)
```

`delay N` conta N frame PAL completi utilizzando la linea raster 200 come
confine del frame.

### SID Sound

```basic
suono 0, $1CAD, 25 # voce 0, frequenza $1CAD (≈ C centrale PAL), durata 25 frame
suono 1, freq_word, 50 # voce 1, frequenza dalla variabile word, 50 frame (1 s a 50 Hz)
suono 2, 0, 0 # voce 2, silenzio

volume SID 15 # volume master al massimo ($D418 = $0F); intervallo 0-15
volume SID 0 # silenzio (volume master = 0)
stop SID # azzera tutti i 25 registri SID ($D400–$D418) — silenzio totale
```

`sound <channel>, <freq>, <duration>` — durata in frame PAL (1/50 s ciascuno).
`sound` **blocchi**: il programma attende che la nota sia terminata (utilizzare
`sfx` di seguito all'interno di un ciclo di gioco). ADSR fisso:
attacco/decadimento `$09`, sustain/rilascio `$F0`, forma d'onda a dente di sega.
Volume principale `$D418` sempre impostato su `$0F`.

*Risolto nella versione 1.5.7:* il ciclo di attesa osservava la riga raster 0,
che `$D012` (solo gli 8 bit inferiori) mostra due volte per frame (righe 0 e
256), quindi ogni nota durava **metà** del tempo richiesto — e due rami sono
stati modificati sul loro opcode, il che ha mandato in crash il programma per
qualsiasi durata diversa da 0. `sound` ora attende sulla riga raster 200
esattamente come `delay`.

`sid volume N` scrive N in `$D418`. Bit 0-3 = volume (0-15), bit 4-7 = modalità
filtro. `sid stop` emette un ciclo di riempimento di zeri di 10 byte, più veloce
di 25 singoli input.

### Effetti sonori non bloccanti (`sfx`) — novità nella versione 1.5.7

```basic
suono 0, $2000, 25 # BLOCCHI: il programma attende 25 frame qui
sfx 0, $2000, 25 # ritorna immediatamente; la nota svanisce da sola
sfx 1, $0500, 8, 128 # forma d'onda opzionale: 16 triangolare, 32 dente di sega (predefinita), 64 impulso, 128 rumore
sfx 0, freq_word, 4, 16 # freq può essere una costante, una word var o un'espressione a 8 bit
```

`sfx <channel>, <freq>, <frames> [, <wave>]` programma una voce SID e ritorna
immediatamente, quindi è sicuro all'interno di un ciclo di gioco. Non c'è un
timer gate-off: l'inviluppo è impostato su attacco 0 / sustain 0 / rilascio 0 e
il **decadimento** viene scelto in fase di compilazione da `frames` (1 frame =
20 ms, tempo di decadimento SID più vicino: 6, 24, 48, 72, 114, 168, 204, 240,
300, 750, 1500, 2400 ms ...), quindi la nota si spegne in circa quel tempo.
Riattiva la voce ad ogni chiamata (gate off, poi on) e imposta il volume master
`$0F`. `channel` (0-2), `frames` (1-255) e `wave` devono essere costanti in fase
di compilazione.


### SID Music

```basic
carica sid "tune.sid" # incorpora la musica SID al suo indirizzo di caricamento nativo
carica sid "tune.sid", $2000 # override: incorpora a $2000 indipendentemente dall'intestazione SID
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
carica il file SID "music.sid"

sub music_irq()
poke $D019, $FF # ACK VIC raster IRQ
sys sid_play # avanza di un frame musicale
irq_exit # JMP $EA81: ripristina A/X/Y + RTI (uscita IRQ corretta)
end

sys sid_init, 0 # inizializza il chip SID: A=0 → prima sub-tune
irq music_irq, $C0 # IRQ raster alla riga $C0 → 50 Hz su PAL

sid volume 15 # volume master attivo
```

**Note:**
- I dati SID vengono posizionati **dopo** tutto il codice generato, riempiti con
  zeri fino all'indirizzo di caricamento. Il compilatore avvisa se l'indirizzo
  di caricamento SID si sovrappone al codice generato.
- Sono supportati PSID v1 e v2. Se l'indirizzo di caricamento dell'intestazione
  SID è 0, i primi due byte di dati vengono utilizzati come indirizzo (stile
  PRG, little-endian).
- Solo un `load sid` per programma è significativo (l'ultimo vince).

### Melodie del tracker (`tune`)

```basic
tune # opzionale: sintonizza a $C800 (predefinito $8000)
velocità 6 # fotogrammi per riga (50 Hz PAL)
inst 0, $41, $09, $F0, $0800, $0064, $27, $1F
inst 1, $10, $08, $A8, $0400, $0000, $00, $0F
imod 0, 6, 3, 9, 40, $0200, $0E00 # vibrato + modulazione di larghezza di impulso (1.6.2)
ifilt 0, $0500, 20, 1 # sweep di cutoff fino a $500, avanti e indietro (1.6.2)
igate 1, 2, 1, $09 # timer gate, riavvio forzato, primo fotogramma $09 (1.6.2)
itab 1, 2, 0, ".. +0", ".. +4", ".. +7" # tabella degli arpeggi (1.6.2)
order 0, 1, 0 # ordine dei pattern (i pattern possono ripetersi)
pat 0, 0, "C-4 00", "...", "E-4 00 V24", "...", "G-4 00", "... .. C00"
pat 0, 1, "C-2 01", "...", "...", "...", "G-2 01 F03"
pat 1, 0, "G-4 00", "...", "E-4 00", "...", "C-4 00"
end
music play # oppure: sys sid_init / gestore irq chiama sys sid_play
```

`tune ... end` descrive una melodia tracker a 3 voci in testo semplice (la
stessa notazione di cella mostrata dall'editor SID di Visual Assembler) e
costruisce il lettore **in fase di compilazione**. Definisce `sid_init` /
`sid_play` esattamente come `load sid`, quindi `music play`, `music stop`,
`music pause` e `music resume` (e un gestore manuale `irq` che chiama `sys
sid_play`) funzionano senza modifiche.

| Linea                                                              | Senso                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `velocità N`                                                       | Fotogrammi per riga del tracker (1-255).                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `inst id, ctrl, ad, sr, pw, cutoff, resfilt, modevol`              | Uno strumento: registro di controllo (bit della forma d'onda più modulazione ad anello `$04` / sincronizzazione `$02`; il bit di gate viene aggiunto dal giocatore), attacco/decadimento, sustain/rilascio, larghezza dell'impulso a 12 bit, cutoff del filtro a 11 bit, byte di risonanza/instradamento del filtro (`$D417` stile: qualsiasi bit di instradamento = instrada la voce che suona questo strumento) e byte di modalità/volume (`$D418` stile, bit 7 = 3 OFF). |
| `imod id, vibdelay, vibspeed, vib Depth, pwmspeed, pwmmin, pwmmax` | (1.6.2) Vibrato dello strumento: dopo `vibdelay` frame un LFO triangolare che gira ogni `vibspeed` frame (1-15, 0 = spento), profondità 0-15 (scalata al semitono della nota). Modulazione della larghezza dell'impulso: `pwmspeed` aggiunto per frame (0 = spento), rimbalzando tra `pwmmin` e `pwmmax`.                                                                                                                                                                   |
| `ifilt id, cutend, sweep, pingpong`                                | (1.6.2) Scansione del cutoff del filtro: dal cutoff `inst` verso il cutoff `cutend` tramite `sweep` (0-127) per fotogramma; `pingpong` 1 = avanti e indietro.                                                                                                                                                                                                                                                                                                               |
| `ID gate, timer gate, hardrestart, firstwave`                      | (1.6.2) Il gate viene rilasciato `gatetimer` frame prima della nota successiva sulla voce (mantienilo al di sotto di `speed`); `hardrestart` 1 imposta anche ADSR a 0. `firstwave` (ad esempio `$09` = test + gate) viene scritto sul primo frame della nota.                                                                                                                                                                                                               |
| `itab id, velocità, ciclo, "passo", ...`                           | (1.6.2) Tabella delle onde/arpeggi, fino a 32 passi: `"WW +n"`, `".. -n"` o `"WW =n"` - forma d'onda in esadecimale (`..` la mantiene) e un offset di nota in semitoni o una nota assoluta (`=60`). Un passo ogni `speed` fotogrammi, poi si torna al passo `loop` (255 = resta sull'ultimo passo).                                                                                                                                                                         |
| `ordina p, p, ...`                                                 | Ordine del modello. Le linee si accumulano, fino a 255 passaggi.                                                                                                                                                                                                                                                                                                                                                                                                            |
| `pat p, v, "cell", ...`                                            | Fino a 32 righe per la voce `v` (0-2) del modello `p` (0-7). Le righe mancanti sono vuote.                                                                                                                                                                                                                                                                                                                                                                                  |

Una **cella** è `NOTE INST FX`: `C-4`, `D#3`, `Eb2` o `...` per nessuna nota,
uno strumento esadecimale a due cifre (`..` per lasciarlo), e un effetto
opzionale - `Vxy` vibrato (x = righe di tenuta, y = profondità), `Uxx` / `Dxx`
slide su / giù, `C` nota tagliata, `Fxx` velocità impostata. Una cella con solo
effetto può essere scritta come `"... .. F06"` o semplicemente `"F06"`.

Note sul lettore:

- Tutto lo stato del giocatore risiede **all'interno del blob** (indirizzamento
  assoluto) - non utilizza pagine zero, quindi non può entrare in conflitto con
  le variabili o i temporanei di UltimateBasic e continua a funzionare quando il
  programma ritorna a BASIC.
- Ad ogni frame (1.6.2) il player esegue la tabella delle onde/arpeggi, il
  vibrato, la modulazione di larghezza d'impulso e il timer gate/hard restart di
  ogni voce, e lo sweep di cutoff della voce che ha avviato per ultima uno
  strumento instradato dal filtro (possiede il cutoff, la risonanza e la
  modalità del filtro; `$D417` instrada ogni voce il cui strumento corrente è
  instradato dal filtro). È lo stesso algoritmo del player e dell'anteprima
  esportati dall'editor SID di Visual Assembler, frame per frame.
- Il blob viene posizionato a un indirizzo fisso (predefinito `$8000` o `tune a
  $addr`) e il `.prg` viene riempito fino ad esso, come `load sid`. Mantienilo
  libero dal tuo codice, dagli array (`$C000+`) e da qualsiasi memoria
  bitmap/charset. Una tune richiede circa 2,5 KB più 12 byte per riga-colonna di
  dati.
- Massimo 8 modelli (32 righe ciascuno); l'elenco degli ordini può ripeterli
  liberamente.
- `music play` utilizza il timer CIA1 a 50 Hz; non combinarla con un altro `load
  sid`/`tune` (l'ultimo ha la precedenza).

### Riproduzione musicale

`music play/stop/pause/resume` è un'alternativa di alto livello alla
configurazione manuale `sys sid_init` / `cia_timer`. Richiede un'istruzione
`load sid` precedente o un blocco `tune ... end` (entrambi definiscono
`sid_init` / `sid_play`).

```basic
Carica il file SID "tune.sid" # incorpora il file SID (definisce sid_init / sid_play)

Riproduci musica # inizializza la sub-melodia 0 + avvia l'IRQ CIA1 a 50 Hz
Riproduci musica 1 # inizia dalla sub-melodia 1 (numero di brano basato su 0)
Interrompi musica # interrompe la riproduzione + azzera tutti i 25 registri SID ($D400-$D418)
Pausa musica # disabilita l'IRQ del timer A CIA1 (la musica si blocca, il SID rimane invariato)
Riprendi musica # riabilita l'IRQ del timer A CIA1 (riprende dal punto di pausa)
```

| Dichiarazione          | Effetto                                                                                              |
| ---------------------- | ---------------------------------------------------------------------------------------------------- |
| `riproduci musica [n]` | chiama `sid_init(n)`, configura il timer CIA1 A a 19 656 cicli (~50 Hz PAL), installa il wrapper IRQ |
| `musica interrotta`    | disabilitare CIA1 IRQ + azzerare tutti i 25 registri SID                                             |
| `pausa musicale`       | Disabilitare l'IRQ CIA1 (l'uscita SID rimane bloccata)                                               |
| `ripresa musicale`     | riattiva CIA1 IRQ (riprende dal punto di pausa)                                                      |

Il wrapper IRQ (emesso una sola volta alla fine del programma) esegue: ACK CIA1
timer A → `JSR sid_play` → `JMP $EA81`.

### Sprite

```basic
sprite 0, x, y, $2000 # sprite 0: imposta la posizione X, Y e il puntatore dati
sprite 0, x, y # senza puntatore dati (mantiene lo sprite esistente)
sprite on 0 # abilita lo sprite 0 ($D015 |= bit0)
sprite off 0 # disabilita lo sprite 0 ($D015 &amp;= ~bit0)
sprite color 0, 7 # colore dello sprite 0 = giallo ($D027)
sprite multicolor 0, on # abilita la modalità multicolore per lo sprite 0 ($D01C |= bit0)
sprite multicolor 0, off # disabilita la modalità multicolore ($D01C &amp;= ~bit0)
sprite expand x 0, on # larghezza doppia ($D01D |= bit0)
sprite expand x 0, off # larghezza normale ($D01D &amp;= ~bit0)
sprite expand y 0, on # altezza doppia ($D017 |= bit0)
espansione sprite y 0, disattivato # altezza normale ($D017 &amp;= ~bit0)
priorità sprite 0, attivato # dietro lo sfondo ($D01B |= bit0)
priorità sprite 0, disattivato # davanti allo sfondo ($D01B &amp;= ~bit0)
var h = sprite_hit() # collisione sprite-sprite ($D01E, azzerato alla lettura)
var b = sprite_bg_hit() # collisione sprite-sfondo ($D01F, azzerato alla lettura)
var x = sprite_x(0) # legge la posizione X dello sprite 0 (byte lo, $D000)
var y = sprite_y(0) # legge la posizione Y dello sprite 0 ($D001)
sprite_frame 0, $2000 # seleziona un'immagine sprite statica
sprite_frame 0, $2000, frame # seleziona un'animazione fotogramma da una sequenza di fotogrammi
```

X supporta l'intera gamma a 9 bit (0–319): utilizzare una variabile `word` per
valori di runtime > 255. Puntatore dati sprite: `data_addr` deve essere
allineato a 64 byte; memorizzato come `addr >> 6` in `$07F8+id`.

#### Animazione sprite con `sprite_frame`

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
ciclo
sprite_frame 0, $2000, frame
frame = frame + 1
se frame == 4 allora frame = 0 fine
ritardo 5
fine
```

La forma a due argomenti, `sprite_frame id, address`, seleziona semplicemente
un'immagine sprite statica e rimane retrocompatibile. La posizione dello sprite
è ancora controllata da `sprite id,x,y`.

### collisione del riquadro di delimitazione del software

```basic
var touching = box_hit(sinistra1, alto1, destra1, basso1,
sinistra2, alto2, destra2, basso2)
```

`box_hit()` esegue un test di bounding box allineato agli assi (AABB) e
restituisce `1` quando i due rettangoli si sovrappongono o si toccano,
altrimenti `0`. A differenza di `sprite_hit()` e `sprite_bg_hit()`, non legge né
cancella i registri di collisione VIC-II. Gli otto argomenti sono espressioni
arbitrarie a 8 bit, quindi i box possono essere più piccoli dell'artwork sprite
visibile o possono descrivere oggetti di gioco non sprite. Le coordinate sono
inclusive; mantenere `left <= right` e `top <= bottom`.

### Definizione di sprite

```basic
sprdef 0
  $00,$3C,$00, $00,$FF,$00, $03,$FF,$C0, $07,$FF,$E0,
  $0F,$FF,$F0, $0F,$FF,$F0, $1F,$FF,$F8, $1F,$FF,$F8,
  $1F,$FF,$F8, $0F,$FF,$F0, $0F,$FF,$F0, $07,$FF,$E0,
  $03,$FF,$C0, $00,$FF,$00, $00,$3C,$00, $00,$00,$00,
  $00,$00,$00, $00,$00,$00, $00,$00,$00, $00,$00,$00,
$00,$00,$00
fine
```

`sprdef id ... end` incorpora 63 byte di sprite all'indirizzo successivo
allineato a 64 byte nel segmento di codice, emette un `JMP` su di essi e imposta
automaticamente `$07F8+id = data_addr >> 6`. Per utilizzare la stessa forma per
più sprite, rileggi il puntatore:

```basic
var pg = peek($07F8) # puntatore impostato da sprdef 0
poke $07F9, pg # copia negli sprite 1–7
```

### Mappe delle tessere dei personaggi (`.ubmap`)

```basic
map load "levels/world.ubmap"
map load "level.bin", $4000 # Progetto Editor di livelli, dati in $4000 (1.6.1)
map draw map_x, map_y # disegna una viewport 40x25 su schermo/RAM colore
map view px, py # visualizzazione fluida con doppio buffer a livello di pixel px, py (1.6.1)

var tile = map_tile(x, y) # legge il codice del carattere dalla mappa
map set x, y, 42 # cambia il codice del carattere nei dati della mappa scrivibili

var shade = map_color(x, y) # legge il colore della cella (0 quando la mappa non ha dati di colore)
map color x, y, 7 # cambia il colore della cella quando sono presenti dati di colore
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

**Progetti dell'editor di livelli (novità nella versione 1.6.1).** `Caricamento
mappa` legge anche un progetto dell'editor di livelli VisualAssembler (`Salva
livello (.bin)`) e compone le sue schermate in una mappa: un livello di
schermate W×H diventa una mappa (W·40)×(H·25) con colori, gli slot vuoti sono
spazi. Le mappe sono limitate a 255×255 celle, quindi un livello può essere al
massimo largo 6 schermate e alto 10.

```basic
caricamento mappa "level.bin" # 2x5 schermate -&gt; una mappa 80x125
```

**Posizionamento dei dati della mappa (novità nella 1.6.1).** `map load "file",
addr` memorizza la mappa a un indirizzo fisso invece che in linea nel codice,
come `incbin "file", addr` (l'indirizzo deve essere sopra il codice generato o
all'interno di uno spazio `org`). I caratteri vengono prima, i colori seguono:

```basic
caricamento mappa "level.bin", $4000 # mappa 80x125: caratteri $4000-$6713, colori $6714-$8E1F
```

#### Scorrimento fluido — `Visualizzazione mappa` (novità nella versione 1.6.1)

```basic
Carica la mappa "level.bin", $4000
var px: word = 0
var py: word = 0
ciclo
Visualizza la mappa px, py # una volta per frame, invece di `attendi raster`

Leggi il joystick, cambia px / py, logica di gioco ...
fine
```

`vista mappa x, y` mostra la mappa nella posizione pixel `x, y` (espressioni di
parole; `0..(larghezza-40)*8` e `0..(altezza-25)*8`, i valori fuori intervallo
vengono limitati). Chiamala una volta per frame: attende il limite del frame
(linea raster 250), mostra la posizione fornita dalla chiamata precedente,
quindi prende quella nuova, in modo che una posizione appaia un frame dopo.

Come funziona: la parte fine utilizza XSCROLL / YSCROLL in `$D016` / `$D011` con
38 colonne e 24 righe (il bordo scorrevole rimane nascosto); i passi dei
caratteri scambiano due buffer dello schermo, `$0400` e `$3C00`. La posizione
viene prevista due fotogrammi in anticipo e il buffer nascosto viene costruito
per la cella del carattere successiva in due metà prima che la vista la
raggiunga, quindi lo scambio non attende mai. La RAM del colore non può essere a
doppio buffer: la sua metà superiore viene copiata nell'ultimo vecchio
fotogramma dietro il raggio raster, la metà inferiore subito dopo lo scambio
davanti ad esso (entrambe con interruzioni mascherate per alcune linee raster),
quindi non si verificano tearing. Un cambio di direzione proprio in
corrispondenza di un passo del carattere può bloccare la vista per uno o due
fotogrammi mentre il buffer viene ricostruito.

Regole:

- Il codice del programma e i dati inline devono rimanere fuori da `$3C00-$3FFF`
  (secondo buffer); caricare mappe di grandi dimensioni con un indirizzo (`map
  load "file", $4000`), altrimenti la compilazione si interrompe con un errore.
- La prima `vista mappa` disegna l'intera vista in `$0400`. Dopodiché lo schermo
  appartiene alla `vista mappa`: `stampa` / `schermo` / `cls` scrivono solo
  `$0400` e vengono sovrascritti.
- Gli sprite funzionano come al solito: `map view` copia i puntatori sprite
  `$07F8-$07FF` in `$3FF8-$3FFF` ad ogni frame, quindi `sprdef` / `sprite_frame`
  vengono visualizzati in entrambi i buffer. Mantieni i dati sprite nel banco
  VIC 0 (`$0000-$3FFF`, non `$1000-$1FFF`), ad esempio inserendo `sprdef` prima
  di un grande `map load` inline.
- I bit del set di caratteri di `$D018` vengono mantenuti (`charset su`
  funziona); il bit multicolore di `$D016` viene mantenuto come impostato da
  `map load`.
- Lascia circa 6000 cicli (~95 linee raster) di logica di gioco per fotogramma;
  un fotogramma più lungo fa sì che la visuale rimanga stabile per un fotogramma
  senza mai presentare tearing.
- Esempio: `examples/level_scroll_demo.ub` (controllato tramite joystick, con
  uno sprite del giocatore).

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
koala load "pictures/title.kla" # convalida e incorpora in fase di compilazione
koala show # attiva la modalità bitmap multicolore
koala hide # torna alla visualizzazione predefinita del testo
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

### Layout del codice: `org` — novità nella versione 1.5.7

```basic
sub a() ... end # le sub/fn vengono posizionate una dopo l'altra dalla fine del corpo principale
org $4000 # le sub/fn successive continuano a $4000; $xxxx-$3FFF rimane riempito con zeri
sub b() ... end
incbin "font.bin", $3800 # i dati possono risiedere nello spazio vuoto ($3800-$3FFF è un intero slot del set di caratteri VIC)
```

`org addr` va **tra le definizioni sub/fn** (viene ignorato nel corpo principale
e agisce solo nel secondo passaggio). Le subroutine non si sovrappongono mai,
quindi i byte saltati vengono semplicemente riempiti con zeri e riservati: un
`incbin "f", addr` che si trova interamente all'interno dello spazio vuoto viene
scritto in esso e `charset on` non conta lo spazio vuoto come codice. I byte
zero fanno parte di `.prg`. `org` sotto la fine del codice corrente è un errore
in fase di compilazione. Tutto ciò che viene generato dopo l'ultima sub (helper,
`data`) segue l'ultima sub, cioè si trova sopra lo spazio vuoto.

### Caratteri personalizzati (`charset on` / `charset off` novità nella versione 1.5.7)

```basic
charset $3800 # imposta l'indirizzo base per chardef (predefinito $3800)

chardef 65 # ridefinisce il carattere 65 ('A')

$18,$3C,$66,$7E,$66,$66,$66,$00
end

chardef 66 # meno di 8 byte vengono riempiti con zeri
$7C,$66,$7C,$66,$7C
end
```

`charset base` imposta l'indirizzo di destinazione utilizzato da tutte le
successive istruzioni `chardef`. `chardef id ... end` incorpora 8 byte in linea
nel segmento di codice (preceduti da un `JMP` per saltarli), quindi li copia in
`charset_base + id*8` in fase di esecuzione. I valori devono essere costanti in
fase di compilazione scritte come `$xx` o decimali. **`%` letterali binari non
sono supportati** dal lexer (il manuale lo diceva prima della 1.5.7 - era
sbagliato).

`charset addr` imposta solo la destinazione `chardef`; non emette alcun codice.
Per far sì che il VIC-II utilizzi il set, accenderlo (e spegnerlo di nuovo
quando si è finito):
```basic
charset $3800
chardef 1 $FF,$81,$81,$81,$81,$81,$81,$FF end # box border
charset on # VIC-II legge i caratteri da $3800 (matrice dello schermo invariata)
...
charset off # torna al set ROM ($1800 se `lowercase` è attivo, altrimenti $1000)
```

`charset on` read-modify-writes `$D018` bit 1-3 dall'ultimo `charset addr`
(predefinito `$3800`); i bit della matrice schermo vengono preservati.
L'indirizzo deve essere un multiplo di `$800` all'interno del banco VIC 0
(`$0000-$3FFF`), altrimenti si verifica un errore in fase di compilazione.
Entrambe le istruzioni utilizzano l'indirizzo `charset addr` compilato per
ultimo, quindi mantenere la direttiva nel corpo principale del programma (i
corpi delle subroutine vengono compilati successivamente). La scrittura raw
equivalente è `poke $D018, $1A` per `$2800` oppure `poke $D018, $1E` per
`$3800`.

**Controllo di sovrapposizione.** `charset on` occupa l'intero set di 2 KB e
ogni `chardef` i suoi 8 byte. Se il codice generato raggiunge quell'area, la
compilazione si interrompe con `the program code ($080D-$xxxx) overlaps the
charset area $2800-$2FFF; move the charset ...`. I programmi di grandi
dimensioni necessitano quindi del set sopra il codice (`charset $3800`) — oppure
utilizzare `org` (sopra) per consentire al codice di continuare sopra il set. I
dati inseriti in un gap `org` (`incbin ..., addr`) non vengono conteggiati come
codice.

### Memoria

```basic
poke $D020, 2 # STA $D020
poke addr_var, 6 # STA (addr_var),Y — se addr_var è di tipo word
var v = peek($D012) # LDA $D012
var v = peek(addr_var) # LDA (addr_var),Y — se addr_var è di tipo word

var w: word = peek16($C000) # lettura a 16 bit little-endian: lo=$C000, hi=$C001
poke16 $0314, $EA81 # scrittura a 16 bit little-endian: lo→$0314, hi→$0315
poke16 ptr, w # variabile word come indirizzo; parola variabile come valore

var k = 2
var p = peek($07F8 + k) # LDA $07F8,Y — costante + variabile byte
poke $07F8 + k, p # STA $07F8,Y
poke ptr + k, 1 # parola + byte: indirizzo completo a 16 bit
```

`peek16(addr)` legge due byte consecutivi (lo, hi) come `word`. `poke16` scrive
lo e poi hi.

Un indirizzo è sempre un valore a 16 bit. Dalla versione 1.6.5, un'espressione
di indirizzo come `$07F8 + k` mantiene il byte alto della costante e il riporto
(prima veniva calcolato a 8 bit e `peek($07F8 + k)` leggeva `$00F8 + k`). Questo
vale per `peek`, `poke`, `peek16`, `poke16`, `fill`, `memcopy`, `drawmem`,
`save` e `reu`; anche le lunghezze di `fill` / `memcopy` come `40 * rows` sono a
16 bit. `peek(k)` con una variabile di byte legge l'indirizzo `$00kk` (prima
della versione 1.6.5 restituiva il valore di `k` stesso).

### I/O del disco

```basic
carica "PROGRAM" # CARICAMENTO KERNAL: carica il file dal dispositivo 8 al suo indirizzo nativo
carica "DATA", $C000 # carica il file a un indirizzo specifico
concatena "GAME" # carica un altro programma sopra questo ed eseguilo (vedi sotto)
carica "DATA", ptr # indirizzo dalla variabile word

salva "DATA", $C000, 4096 # SALVATAGGIO KERNAL da $C000, 4096 byte → dispositivo 8
salva "PROG", start, len # indirizzo e lunghezza dalle variabili word/int
```

`load` chiama KERNAL `SETNAM`+`SETLFS`+`LOAD` (`$FFBD`/`$FFBA`/`$FFD5`). Senza
indirizzo: indirizzo secondario 1 (l'intestazione di 2 byte del file è
l'indirizzo di caricamento). Con indirizzo: indirizzo secondario 0 (il file
viene caricato all'indirizzo specificato, la sua intestazione viene saltata).
(Corretto nella versione 1.5.9 — prima, i due erano invertiti: `load "F"`
caricato in `$0000`.) `save` chiama `SETNAM`+`SETLFS`+`SAVE`
(`$FFBD`/`$FFBA`/`$FFD8`). Richiede sia `addr` che `len`.

#### Collegamento a un altro programma — `chain` (novità nella versione 1.5.9)

```basic
catena "GIOCO" # carica GIOCO dall'unità da cui è stato avviato ed eseguilo
catena "GIOCO", 9 # dall'unità 9 (qualsiasi espressione)
stampa "ERRORE DI CARICAMENTO" # viene raggiunto solo se il file non può essere caricato
```

`chain` carica un altro programma al proprio indirizzo di caricamento —
normalmente `$0801`, direttamente sopra il programma in esecuzione — e lo avvia
esattamente come se fossero stati digitati `LOAD"GAME",8,1` e `RUN`. Questo è
ciò di cui ha bisogno un programma di avvio/titolo. Un semplice `load` non può
farlo: il file caricato sovrascriverebbe il codice che sta eseguendo `load`.

Come funziona:

- Un caricatore indipendente dalla posizione di 46 byte, insieme al nome del
  file, viene copiato nel buffer della cassetta (`$033C`), che non viene
  caricato né da un programma Ultimate Basic né da un file compresso con
  Exomizer.
- Prima di ciò la macchina viene riportata a uno stato pulito: VIC IRQs
  disattivati, volume SID 0, `IOINIT` (`$FDA3`: timer CIA, IRQ tastiera, bus
  seriale), `RESTOR` (`$FF8A`: vettori I/O e IRQ/BRK/NMI predefiniti), `$01 =
  $37`. Interrompi gli IRQ raster personalizzati, i gestori di riproduzione
  musicale` e nmi` e `nmi`. Lo schermo, i colori e i registri del banco VIC
  diversi da `$DD00` vengono lasciati invariati, in modo che un'immagine possa
  rimanere sullo schermo mentre il programma successivo si carica (`IOINIT`
  seleziona il banco VIC 0).
- Il caricatore chiama `SETNAM` / `SETLFS` (secondario 1) / `LOAD`. Senza un
  argomento dispositivo, utilizza l'unità da cui è stato caricato il programma
  stesso (`$BA`), ovvero l'unità 8.
- Dopo un caricamento riuscito, imposta il puntatore di fine programma
  (`$2D/$2E`), reinizializza BASIC (`$E453`, `$E3BF` - un programma di
  estrazione automatica come Exomizer `sfx` potrebbe aver utilizzato la pagina
  zero di BASIC) ed esegue il programma (`$A659`, `$A7AE`). Funziona sia per i
  programmi Ultimate Basic, sia per i file elaborati (`exomizer sfx sys`) e per
  i normali programmi BASIC.
- Se il file non può essere caricato (non trovato, nessuna unità), `chain`
  restituisce e il programma continua con l'istruzione successiva.

Il nome del file deve essere una stringa letterale di 1-16 caratteri.

### I/O di file del canale seriale

```basic
open 1, 8, 2, "MYFILE" # apre il file logico 1, dispositivo 8, secondario 2, nome "MYFILE"
open 2, 4, 7 # apre la stampante (dispositivo 4), nessun nome file
open ch, dev, sec # canale, dispositivo, secondario da variabili

print# 1, "HELLO" # invia "HELLO"+CR al file logico 1
print# ch, x, "text" # qualsiasi combinazione di variabili e stringhe — equivalente a print ma su file

close 1 # chiude il file logico 1
close ch # canale da variabile
```

`open` chiama `SETNAM` ($FFBD) + `SETLFS` ($FFBA) + `OPEN` ($FFC0). Senza un
nome file, SETNAM viene chiamato con lunghezza 0. `print#` instrada l'output
tramite `CHKOUT` ($FFC9), CHROUT per carattere (+ CR finale), quindi `CLRCHN`
($FFCC). `close` inserisce il numero del canale in A e chiama `CLOSE` ($FFC3).

### Ingresso

```basic
input score # leggi fino a 3 cifre dalla tastiera → variabile intera a 8 bit
input "Nome: ", name # stringa di richiesta facoltativa, quindi leggi la riga → variabile stringa
input "Punteggio: ", score # richiesta + input intero
```

`input` utilizza KERNAL BASIN (`$FFCF`) per l'input di riga bloccante ed echo
con supporto DEL.
- **Variabile intera**: accetta solo `0`–`9`, massimo 3 caratteri; converte in
  valore a 8 bit in caso di CR.
- **Variabile stringa**: accetta fino a 30 caratteri; memorizza come stringa
  terminata da null; coppia ZP aggiornata.
- **Variabile FLOAT** (1.6.3): cifre e `.`, ad esempio `12.5` → 12.50 (due cifre
  decimali).
- **SINGOLO / DOPPIO var** (1.6.4): qualsiasi numero, `-12.5`, `.5`, `3.25E2`.
- **Elemento array** (1.6.3): `input t(i)` / `input nevek(i)`; `input "prompt";
  x` funziona anche.
- **Variabile stringa**: accetta fino a 30 caratteri; memorizza come stringa
  terminata da null; coppia ZP aggiornata.

### Galleggiante / Punto fisso

Le variabili `float` utilizzano il formato a virgola fissa Q8.8: il byte più
significativo rappresenta la parte intera (0–255) e il byte meno significativo
rappresenta la parte frazionaria (0/256 … 255/256).

```basic
var f: float = 3.5 # 3.5 → hi=3, lo=128 (= 0x0380)
var g: float = 0 # l'intero 0 viene automaticamente promosso a 0.0

f = 1.5 # Assegnazione letterale Q8.8
f = f + 1.5 # Aritmetica Q8.8 a 16 bit (risultato: 3.0)
f = f + g # float + float

var n = int(f) # estrae la parte intera (byte hi) → intero a 8 bit
print f # stampa come "N.DD" (es. 3.5 → "3.50", 1.25 → "1.25")
```

| Operazione           | Esempio              | Note                                                      |
| -------------------- | -------------------- | --------------------------------------------------------- |
| Letterale            | `3,5`, `0,25`, `1,0` | analizzato come Q8.8 in fase di compilazione              |
| Promozione intera    | `f = 5`              | memorizza 5.0 (alto=5, basso=0)                           |
| Aggiungi/sostituisci | `f + 1.5`, `f - g`   | Aritmetica a 16 bit Q8.8                                  |
| Estratto int         | `int(f)`             | restituisce il byte più significativo come intero a 8 bit |
| Stampa               | `stampa f`           | formato "N.DD", sempre 2 cifre decimali                   |

**Attenzione:** L'overflow aritmetico si interrompe a 255.255 (nessuna
saturazione). La moltiplicazione e la divisione di due variabili float non sono
ancora supportate: utilizzare `int()` + aritmetica intera per questi casi.

**Stampa di espressioni float (corretto nella versione 1.5.7).** `print` di
un'espressione aritmetica che coinvolge un `float` (ad esempio `print a / 10`
con `a: float = 1`) ora stampa il risultato Q8.8 come `N.DD`. Prima della
versione 1.5.7 stampava il valore grezzo a 16 bit come un intero (`25` invece di
`0.09`). La frazione viene troncata, non arrotondata: 1/10 = 25/256 viene
stampato come `0.09`.

### Virgola mobile: `SINGOLO` / `DOPPIO` (1.6.4)

`dim x as single` e `dim x as double` sono numeri a virgola mobile reali: il
formato a 5 byte del BASIC C64: circa 9 cifre significative, intervallo
±2,9·10⁻³⁹ … ±1,7·10³⁸. (`single` e `double` sono dello stesso tipo.) Il veloce
tipo Q8.8 a 2 byte è ancora disponibile come `float`.

```basic
DIM r AS DOUBLE, t AS DOUBLE
DIM k(9) AS SINGLE ' array: 5 byte per elemento
r = 2.5
t = ATN(1) * 4 * r ^ 2 ' 19.6349541
PRINT t; " "; SQR(2); " "; 1E10; " "; 1 / 3
FOR r = 0 TO 1 STEP 0.25 : PRINT r : NEXT
FUNCTION Atfogo (a AS DOUBLE, b AS DOUBLE) AS DOUBLE

Atfogo = SQR(a * a + b * b)
END FUNCTION
```

|                  |                                                                                                                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Operatori        | `+ - * /` e `^` (potenza; associativo destro, lega più strettamente del meno unario: `-2^2` = -4)                                                                               |
| Funzioni         | `SQR`, `SIN`, `COS`, `TAN`, `ATN` (radianti), `EXP`, `LOG` (naturale), `INT` (pavimento), `FIX` (tronca), `CINT` (rotondo), `ABS`, `SGN`, `CSNG` / `CDBL` (no-op), `VAL`, `RND` |
| `MOD`            | `a MOD b` = `a - b * FIX(a / b)` (segno di `a`, come VB / C `fmod`): `7.5 MOD 2` = 1.5; `x MOD 0` = x                                                                           |
| `RND`            | in un'istruzione in virgola mobile `RND` / `RND()` è un numero casuale 0 ≤ x < 1 (`d = RND`, `x = RND * 6`); `rnd(n)` rimane l'intero 0 … n-1                                   |
| Letterali        | `1,5`, `.5`, `1E6`, `2,5e-3`, `70000`                                                                                                                                           |
| Confronti        | `= &lt;&gt; &lt; &gt; &lt;= &gt;=` in `SE` / `FINCHÉ` / `FINCHÉ` / `SELEZIONARE CASO` e come valori                                                                             |
| Stampa           | Stile C64 BASIC: `.5`, `-3.25`, `3.33333333`, `1E+10`, `1.5E-07` (nessuno spazio iniziale a meno che `--basic-print`); decimali fissi con `PRINT USING`                         |
| Corde            | `s = "X=" + x`, `STR$(x)`, `VAL(s)` legge `-1.25E3`                                                                                                                             |
| `PER`            | contatore a virgola mobile, limite e passo (`STEP 0.1`, negativo o una variabile)                                                                                               |
| `INPUT` / `READ` | `INPUT x` legge un numero qualsiasi; `READ x` legge il byte successivo `data`                                                                                                   |
| Sottofunzione    | `p COME DOUBLE` parametri e ` COME DOUBLE` risultati                                                                                                                            |

**Mescolamento con numeri interi.** Un'espressione viene calcolata in virgola
mobile quando contiene un valore SINGOLO / DOPPIO, `^`, una delle funzioni sopra
indicate o un letterale che solo la virgola mobile può contenere (`1E6`,
`300.5`, `70000`). Una volta che un programma utilizza la virgola mobile, ogni
letterale decimale (`0.1`) è anche una costante in virgola mobile. Memorizzare
un valore in virgola mobile in un `byte`, `intero` o `parola` lo **arrotonda**
(a metà distanza da zero: 2,5 → 3, -2,5 → -3); in un `float` diventa Q8.8. Un
valore intero assegnato a un DOUBLE viene convertito esattamente. Le espressioni
intere mantengono le loro regole intere (`var c = a + b` è ancora un byte).

**Note**
- Un letterale intero da 32768 a 65535 mantiene il suo valore in un'istruzione
  che esegue calcoli in virgola mobile (`d = 40000`, `d + 50000`). Un'istruzione
  è considerata in virgola mobile quando specifica una variabile SINGOLA/DOPPIO,
  un array, un parametro o una funzione, oppure utilizza `^`, un letterale solo
  in virgola mobile o una delle funzioni sopra menzionate; altrove, tale
  letterale è un pattern a 16 bit come prima (`poke 53280, 1`, `w = 40000` in
  una WORD). Una variabile che è diventata a virgola mobile solo tramite `var x
  = 2.5` non conta: scrivi `40000.0` lì.
- `7 / 2` è 3,5 quando assegnato a un DOUBLE; nel contesto intero è 3 come
  prima.
- `AND` / `OR` / `XOR` arrotondano i loro operandi a numeri interi.
- `SIN` / `COS` di un valore di byte mantengono il vecchio significato della
  tabella 0–255 (cerchio completo = 256); con un argomento SINGOLO / DOPPIO
  funzionano in radianti.
- I gestori IRQ/NMI possono utilizzare la virgola mobile: una subroutine
  denominata in `irq`, `nmi` o `cia_timer` che (direttamente o tramite le
  subroutine che chiama) utilizza SINGLE/DOUBLE per salvare lo stato di runtime
  all'avvio e ripristinarlo prima di `irq_exit`/`nmi_exit` (circa 4-5 mila cicli
  per interrupt). I gestori senza virgola mobile non vengono rallentati. Non
  coperto: un gestore impostato tramite indirizzo o variabile di parola, o uno
  che termina con un semplice `RTS`/`RTI`.
- Costo: il runtime in virgola mobile viene assemblato dal compilatore e
  aggiunto dopo il programma; sono incluse solo le routine utilizzate dal
  programma (circa 2 KB per `+ - * /` e `PRINT` fino a circa 5 KB con tutte le
  funzioni e `PRINT USING`). Le variabili occupano 5 byte nell'area degli array,
  più un puntatore di pagina zero di 2 byte per il runtime. Una moltiplicazione
  richiede circa 1-2 ms su un C64 a 1 MHz.

### Variabili nella RAM, memoria array (1.6.4)

- **Pagina zero piena:** quando le variabili del programma non rientrano nella
  pagina zero permanente (`$02-$4F`), il compilatore la ricostruisce e sposta le
  variabili meno utilizzate nel codice critico nella RAM normale (dopo gli
  array). Un'istruzione che utilizza una di queste variabili la copia in uno
  slot della pagina zero e poi di nuovo nella pagina zero, quindi i programmi si
  comportano allo stesso modo, solo che queste variabili sono un po' più lente.
  I contatori di ciclo, i parametri e qualsiasi cosa possa essere toccata da un
  gestore IRQ rimangono nella pagina zero. La mappa della memoria li mostra come
  `RAM:$xxxx`. L'esaurimento della pagina zero non è più un errore, tranne in
  casi estremi (`pagina zero esaurita` rimane per questi).
- **Memoria array:**gli array (e le variabili spillate/a virgola mobile)
  utilizzano `$C000-$CFFF`. Quando necessitano di più di 4096 byte, l'area
  inizia invece da `$A000`, fornendo 12 KB (`$A000-$CFFF`): la ROM BASIC viene
  disattivata all'avvio del programma (`$01` bit 0) e riattivata ad ogni uscita
  al BASIC (`end`, `bye`, fine del programma, `chain`), quindi il programma
  ritorna comunque a un BASIC funzionante. I programmi che richiamano
  direttamente routine ROM BASIC (`sys $Axxx`) non devono utilizzare più di 4 KB
  di array.

### Funzioni matematiche

```basic
var a = abs(x - 20) # valore assoluto in complemento a due
var b = min(x, 39) # minimo a 8 bit
var c = max(x, 0) # massimo a 8 bit
var s = sgn(score) # 0 = zero, 1 = positivo (1–127), $FF = negativo (128–255)
var r = rnd() # pseudo-casuale LCG 0-255; Seed da linea raster

# (0 &lt;= x &lt; 1 in un'istruzione SINGOLA/DOPPIO: d = rnd)
var r = rnd(10) # Pseudo-casuale LCG 0-9 (rnd() mod n; risultato 0..n-1)
var s = sin(angolo) # seno: angolo 0-255 (cerchio completo), restituisce 0-255 (centro=128)
var c = cos(angolo) # coseno = sin(angolo+64)
var v = clamp(x, 0, 39) # Clamp senza segno a 8 bit: risultato = max(lo, min(hi, val))

print hex(n) # stampa come esadecimale maiuscolo a 2 cifre
print bin(n) # stampa come stringa binaria a 8 bit
```

### Funzioni di stringa

```basic
var n = len(msg) # lunghezza della stringa terminata da null var (0–255)
var c = asc(msg) # codice PETSCII del primo carattere (0 se vuoto)
var c = asc("A") # in fase di compilazione: codice PETSCII costante
var n = val(s) # in fase di esecuzione: analizza la stringa PETSCII decimale → intero a 8 bit (ad es. "042" → 42)
var c = msg[i] # carattere della stringa all'indice i: codice PETSCII di msg[i]
msg[i] = c # scrive il byte PETSCII c nella stringa all'indice i — STA (ptr),Y
msg[0] = 72 # indice costante → LDY #0; STA (ptr),Y
```

### Formattazione dei numeri

```basic
print hex(n) # stampa come esadecimale maiuscolo a 2 cifre
print bin(n) # stampa come stringa binaria a 8 bit
print dec(n, 4) # decimale allineato a destra in un campo di 4 caratteri (es. 42 → " 42")
print dec(n, width) # width può anche essere una variabile
```

`dec(n, width)` riempie il numero a sinistra con spazi per riempire i caratteri
`width`. Se il numero ha più cifre di `width`, viene stampato senza riempimento
(nessun troncamento). In contesti non di stampa, `dec(n, w)` viene valutato come
`n` senza modifiche (uguale a `hex`/`bin`).

### REU (Unità di espansione RAM)

```basic
var ok = reu_present() # 1 se REU rilevato, 0 altrimenti (test di scrittura/lettura su $DF04)
var ok = reudet() # alias per reu_present()

reu stash c64addr, bank, reu_addr, len # copia C64 → REU
reu fetch c64addr, bank, reu_addr, len # copia REU → C64
reu swap c64addr, bank, reu_addr, len # scambia tra C64 e REU
```

`reu_present()` esegue un test di scrittura/lettura sul registro REU `$DF04`.
Senza un REU la scrittura viene persa (bus aperto), quindi la lettura è diversa:
rileva in modo affidabile la presenza senza toccare alcun registro di comando
con effetti collaterali.

| Parametro  | Larghezza | Note                                                                 |
| ---------- | --------- | -------------------------------------------------------------------- |
| `c64addr`  | 16 bit    | Avvio della RAM del C64 — costante, `word` var o espressione a 8 bit |
| `banca`    | 8 bit     | Numero di banca REU (0–7 per un'unità da 512 KB)                     |
| `reu_addr` | 16 bit    | Compensazione all'interno della banca REU                            |
| `len`      | 16 bit    | Byte da trasferire (`0` = 65 536 nell'hardware REU)                  |

Registri REU: `$DF01` comando (`$B0` stash / `$B1` fetch / `$B2` swap),
`$DF02–$DF03` indirizzo C64, `$DF04–$DF05` offset REU, `$DF06` banco,
`$DF07–$DF08` lunghezza. Il trasferimento è sincrono (CPU arrestata durante il
DMA). Richiede un REU o VICE reale: **Impostazioni → Hardware → Modulo di
espansione RAM**.

### Utilità di memoria

```basic
riempi schermo 32 # riempi la RAM dello schermo da $0400 a $07FF con il valore 32 (spazio)
riempi colore 1 # riempi la RAM da $D800 a $DBFF con il colore 1 (bianco)

riempi $0400, 1000, 32 # riempi 1000 byte a partire da $0400 con il valore 32
riempi indirizzo, 256, 0 # indirizzo può essere una variabile di parola
riempi ptr, len_word, val # tutti gli operandi possono essere espressioni / variabili di parola

copia in memoria $C000, $0400, 256 # copia 256 byte da $C000 a $0400
copia in memoria src_ptr, dst_ptr, 40 # variabili di parola per sorgente e destinazione

disegna in memoria $C000, $0400, 8, 10, 40 # copia Rettangolo 8×10 da $C000 → schermo a $0400, passo 40
drawmem src_ptr, dst_ptr, w, h, 40 # variabili di parola per src/dst
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
irq my_handler # IRQ raster alla riga 0, handler = nome o indirizzo della sottosezione
irq my_handler, 100 # IRQ raster alla riga 100 del raster
irq $C800, 200 # handler a indirizzo fisso
irq addr_word # indirizzo dell'handler da una variabile di tipo parola
```

Imposta un IRQ raster tramite il vettore software BASIC (`$0314`/`$0315`):
disabilita l'IRQ del timer CIA1, conferma l'IRQ VIC in sospeso, scrive la riga
raster in `$D012`, abilita l'IRQ raster VIC (`$D01A=$01`), scrive l'indirizzo
del gestore e riabilita gli interrupt.

Il gestore **deve** terminare con `sys $EA81` (fine IRQ del KERNAL) — `RTS` o
`RTI` corromperanno lo stack. Confermare prima l'IRQ del VIC:

```basic
sub my_handler()
poke $D019, $FF # ACK VIC IRQ
# ... lavora qui ...
sys $EA81 # Salta a fine IRQ del KERNAL
end
```

Sono supportati i riferimenti in avanti (`irq my_handler` prima che la
subroutine sia definita).

Una subroutine gestore può utilizzare numeri in virgola mobile SINGOLI/DOPPIO:
salva e ripristina lo stato di runtime attorno al suo corpo (vedere *Variante in
virgola mobile*).

### Gestore NMI

```basic
nmi my_nmi # Imposta il vettore NMI $0318/$0319 sulla subroutine o sull'indirizzo del gestore

sub my_nmi()

# ... qui si esegue l'operazione NMI ...

nmi_exit # Salta a $FE47 — uscita NMI corretta (ripristina A/X/Y + RTI)
end
```

`nmi handler` scrive l'indirizzo del gestore nel vettore software NMI
(`$0318`/`$0319`). Il vettore hardware NMI a `$FFFA` punta alla routine KERNAL
NMI che si dirama attraverso `$0318`. Il gestore **deve** terminare con
`nmi_exit` (emette `JMP $FE47`) — l'utilizzo di `RTI` corromperà lo stack.
Riferimenti in avanti supportati.

### CIA1 timer IRQ

```basic
cia_timer 19656, my_handler # Timer CIA1 A: si attiva ogni 19656 cicli (~50 Hz PAL)
cia_timer periodo, handler # il periodo può essere una variabile o un'espressione
```

Imposta il timer CIA1 A come sorgente IRQ periodica tramite il vettore software
BASIC (`$0314`/`$0315`):
1. SEI — disabilita gli interrupt
2. `$DC0D = $7F` — disabilita tutti gli IRQ CIA1
3. Carica periodo a 16 bit lo→`$DC04`, hi→`$DC05`
4. Scrivi l'indirizzo del gestore a `$0314`/`$0315`
5. `$DC0D = $81` — abilita l'IRQ del timer CIA1 A
6. `$DC0E = $01` — avvia il timer A in modalità continua
7. CLI — riattiva gli interrupt

Il gestore deve terminare con `irq_exit` (o `sys $EA81`) e deve inviare un ACK
all'IRQ CIA1:

```basic
sub my_handler()
poke $DC0D, $01 # ACK CIA1 timer A IRQ (la lettura lo cancella anche)

# ... lavora qui ...
irq_exit # JMP $EA81: ripristina A/X/Y + RTI
end
```

Temporizzazione PAL: clock = 985 248 Hz. Periodo per 50 Hz = 985 248 / 50 = 19
705 cicli ≈ `$4CC9`. Riferimenti in avanti supportati.

### Gestione degli errori

```basic
onerr goto err_handler # Imposta il vettore di errore I/O KERNAL ($0300/$0301) su un'etichetta

...

etichetta err_handler
stampa "ERRORE I/O"
bye
```

`onerr goto label` scrive l'indirizzo dell'etichetta (lo, hi) nelle posizioni
KERNAL `$0300` e `$0301`. Quando si verifica un errore di I/O KERNAL (ad
esempio, un errore `load` o `open`), il KERNAL esegue `JMP ($0300)`, che salta
all'etichetta. Sono supportati i riferimenti in avanti (etichetta definita dopo
`onerr goto`).

### Incorporamento di file in fase di compilazione (`incbin` skip / length nuovo nella versione 1.5.7)

```basic
incbin "sprites.bin" # incorpora byte binari grezzi nella posizione corrente del codice
incbin "charset.bin", $2000 # incorpora a un indirizzo assoluto, riempiendo se necessario
incbin "font.prg", $3C00, 2 # ...saltando i primi 2 byte (ad esempio, un indirizzo di caricamento di un file .prg)
incbin "big.bin", $4000, 16, 256 # ...salta 16 byte, quindi prendi al massimo 256 byte
include "defs.ub" # incorpora un altro file sorgente .ub (analizzato lessicalmente e in loco)
```

`incbin "file", addr, skip [, length]` elimina i primi `skip` byte del file (in
genere l'indirizzo di caricamento di 2 byte di un `.prg`) e facoltativamente
prende al massimo `length` byte; `skip` e `length` sono costanti e un `skip`
oltre la fine del file è un errore. La forma dell'indirizzo richiede che la
destinazione sia sopra il codice generato o all'interno di uno spazio `org`.

### Dati / Leggi

```basic
dati 1, 2, 3, 255 # tabella di byte costante
leggi varname # carica il byte successivo in varname (dichiarazione automatica se necessario)
```

Tutti i valori `data` vengono raccolti in fase di compilazione. Un puntatore ZP
di 2 byte viene allocato e inizializzato automaticamente all'avvio del
programma. Ogni `read` fa avanzare il puntatore.

**Array inizializzati — `dati <array>: …` (novità nella 1.5.8)**

```basic
var sinus = array(8)
data sinus: 128, 218, 255, 218
data sinus: 128, 37, 0, 37 # le righe successive continuano da dove si è interrotta la precedente
print sinus[i] # accesso casuale, come in qualsiasi array

var xpos = array_word(2)
data xpos: 24, 300 # gli array di parole prendono valori a 16 bit (memorizzati come lo, hi)
```

Una riga `data` il cui primo elemento è `name:` riempie un `array` /
`array_word` dichiarato invece del flusso `read`. I valori vengono memorizzati
dopo il codice e copiati nell'array una sola volta all'avvio del programma
(subito dopo che gli array sono stati azzerati), quindi la tabella è
completamente scrivibile e indicizzata come qualsiasi altro array. Un numero di
valori superiore a quello che l'array può contenere, o un nome non dichiarato, è
un errore di compilazione. Queste righe non influiscono su `read`.

### Assemblaggio in linea

```basic
sys $FFD2 # JSR $FFD2
sys $FFD2, 7 # LDA #7 ; JSR $FFD2 (passa il valore del byte nel registro A)
irq_exit # JMP $EA81 — uscita corretta del gestore IRQ (ripristino A/X/Y + RTI)
asm $EA, $EA # byte raw inline (NOP NOP) — formato legacy
asm {

; Mnemonici e modalità di indirizzamento complete del 6502

LDA #$07 ; immediato

STA $0286 ; assoluto

LDA $50 ; pagina zero ($50 ≤ $FF → ZP selezionato automaticamente)

STA $0400,X ; assoluto, indicizzato X

LDA ($50),Y ; (indiretto),Y

LDA ($50,X) ; (indiretto,X)

JSR $FFD2 ; Chiamata di subroutine

JMP $C000 ; salto assoluto

JMP ($FFFC) ; salto indiretto

CLC
ADC #1
SEC
SBC #1

TAX ; implicito / trasferimento
ASL A ; accumulatore (anche semplicemente: ASL)
LSR A
ROL
ROR

; Salti condizionali: l'operando è un indirizzo assoluto; l'offset viene calcolato automaticamente
BNE loop ; salto in avanti o indietro all'etichetta locale
BEQ done

loop:

NOP
done:
RTS

; #<etichetta / #>etichetta — byte basso / alto di un indirizzo di etichetta
LDA #<gestore
STA $0314
LDA #>gestore
STA $0315

; * — posizione di assembly corrente
JMP *

; Byte esadecimali grezzi (compatibili con la vecchia sintassi assembly { $xx ... })

$EA $EA; due byte NOP
}
```

**Modalità di indirizzamento:**

| Sintassi          | Modalità      | Byte | Esempio                    |
| ----------------- | ------------- | ---- | -------------------------- |
| (nessun operando) | Implicito     | 1    | `NOP`, `RTS`               |
| `A`               | Accumulatore  | 1    | `ASL A`, `LSR`             |
| `#valore`         | Immediato     | 2    | `LDA #$07`                 |
| `$zz` (0–255)     | Pagina zero   | 2    | `LDA $50`                  |
| `$zz,X`           | ZP,X          | 2    | `LDA $50,X`                |
| `$zz,Y`           | ZP,Y          | 2    | `LDX $50,Y`                |
| `$xxxx`           | Assoluto      | 3    | `LDA $0400`                |
| `$xxxx,X`         | Assoluto,X    | 3    | `LDA $0400,X`              |
| `$xxxx,Y`         | Assoluto,Y    | 3    | `LDA $0400,Y`              |
| `($xxxx)`         | Indiretto     | 3    | `JMP ($FFFC)`              |
| `($zz,X)`         | (Indiretto,X) | 2    | `LDA ($50,X)`              |
| `($zz),Y`         | (Indiretto),Y | 2    | `LDA ($50),Y`              |
| `etichetta`       | Parente       | 2    | `BNE label` (solo filiali) |

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
poke $D020, border_col # UltimateBasic risolve l'indirizzo ZP
poke $D021, bg_col
asm {

; i valori sono già in $D020 / $D021
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
numstr score, $0340 # scrive "042\0" a $0340 (sempre 3 cifre, con zero di riempimento)
var n = str_to_int("42") # in fase di compilazione: Expr::Number(42)

print str$(score) # stampa l'intero a 8 bit come stringa decimale a 3 cifre ("000"–"255")
print "Punteggio: " + str$(score) # utilizzabile nel contesto di stampa con concatenazione di stringhe
var s: string = str$(n) # assegna il risultato di str$() a una variabile stringa (buffer statico condiviso)
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

| File                                       | Descrizione                                                                                             |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| `esempi/caratteristiche.ub`                | const, label/goto, poke/peek, rnd, funzioni matematiche                                                 |
| `esempi/nuove_funzionalità.ub`             | parametri secondari, array, variabili di tipo parola, variabili di tipo stringa                         |
| `examples/bitmap_demo.ub`                  | Immagine bitmap 320×200, grafico, grafica attivabile/disattivabile                                      |
| `esempi/block_demo.ub`                     | grafica a blocchi 80×50, plot4, circle4, grafica su blocco                                              |
| `esempi/joystick_demo.ub`                  | lettura del joystick, movimento dello sprite                                                            |
| `esempi/mux_demo.ub`                       | Multiplexer di sprite raster (3 finestre × 8 sprite = 24)                                               |
| `esempi/orbit_demo.ub`                     | Orbita a 24 sprite con raggio pulsante e colori casuali                                                 |
| `esempi/plasma_demo.ub`                    | bitmap con effetto plasma e animazione del bordo a barre raster                                         |
| `esempi/sprite_data.ub`                    | Dati di forma sprdef (inclusi da altre demo)                                                            |
| `esempi/sprite_mux_orbit.ub`               | Dimostrazione di orbita a 24 sprite con sprdef + posizioni precalcolate                                 |
| `esempi/sprite_orbit_demo.ub`              | 8 sprite hardware in orbita circolare tramite la tabella seno/coseno                                    |
| `esempi/reu_bitmap_demo.ub`                | Recupero/stosh REU con grafica bitmap                                                                   |
| `esempi/sid_music_demo.ub`                 | Lettore musicale SID con IRQ raster e uscita da tastiera                                                |
| `esempi/tenprint.ub`                       | 5 implementazioni del labirinto TENPRINT con menu; demo `lowercase` charset mode                        |
| `esempi/countdown_demo.ub`                 | Conto alla rovescia `for..next` con passo negativo, incl. `for i = 20 to 0 step -2`                     |
| `esempi/countdown_errors_demo.ub`          | Errore in fase di compilazione per default-step `from > to`                                             |
| `esempi/demo_esplicito.ub`                 | `--explicit` Demo del flag CLI con `var`, `sub`, `fn` completamente tipizzati.                          |
| `esempi/dimostrazione_errori_espliciti.ub` | Codice discontinuo che si compila senza `--explicit`, genera errori con esso                            |
| `esempi/dim_demo.ub`                       | `DIM … AS …` scalari e array di ogni tipo                                                               |
| `esempi/qbasic_demo.ub`                    | FUNZIONE / SUB / ELSEIF / CICLO DO / SELECT CASE / stringhe in stile QBasic                             |
| `esempi/float_demo.ub`                     | Funzione a virgola mobile SINGOLO/DOPPO: `^`, SQR, SIN, ATN, EXP, LOG, `PER … PASSO 0.5`, `COME DOPPIO` |

## Riferimento CLI

```
ub build <input.ub> [OPZIONI]

-o, --output <file> Genera un file .prg o .crt (predefinito: <input>.prg)

-v, --verbose Mostra il layout a pagina zero e il dump esadecimale del codice

--no-stub Salta lo stub BASIC SYS (il codice viene caricato a $0801)

--debug Genera anche i file di debug .sym, .dbg e .vs

--asm Genera anche un listato .asm leggibile del codegen 6502

--d64 [file] Genera anche un'immagine disco .d64;
senza un nome file, il valore predefinito è <output>.d64

--add <file> Aggiunge un file extra all'immagine disco .d64;

Può essere ripetuto per più file

--explicit Richiede :type per ogni variabile / sottoparametro / parametro funzione

--basic-print Spaziatura di stampa BASIC C64: spazi attorno ai numeri, ',' = zone a 10 colonne

-h, --help Mostra la guida
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

| Modulo di dichiarazione                                  | Senza `--explicit` | Con `--explicit`     |
| -------------------------------------------------------- | ------------------ | -------------------- |
| `var name = expr` (no `:type`)                           | ok — tipo dedotto  | errore               |
| `var name: int = expr` (o parola/virgola mobile/stringa) | OK                 | OK                   |
| `var arr = array(N)`                                     | ok — tipo dedotto  | errore               |
| `var arr = array_word(N)`                                | OK                 | OK                   |
| `const NAME = value`                                     | OK                 | ok — invariato       |
| `sub foo(a, b)` (parametri non tipizzati)                | OK                 | ok — invariato       |
| `sub foo(a: int, b: int)`                                | OK                 | ok — invariato       |
| `fn foo(a): int` (parametro non tipizzato)               | OK                 | errore sul parametro |
| `fn foo(a: int): int`                                    | OK                 | OK                   |
| `fn foo(a): int` (parametro non tipizzato)               | OK                 | errore sul parametro |
| `fn foo(a: int): int`                                    | OK                 | OK                   |

Le dichiarazioni di costanti e array sono sempre accettate: il loro tipo è
definito dalla forma di dichiarazione, quindi `:type` sarebbe ridondante.

**Esempio di output di errore:**

```
$ ub build myprog.ub --explicit
Errori di compilazione:

riga 14: modalità 'explicit': 'var loose' non ha un tipo — utilizzare 'var loose: int|word|float|string'

riga 16: modalità 'explicit': il parametro 'a' non ha un tipo — utilizzare 'a: int|word|float|string'
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

Per un output denominato `demo.prg`, questo crea `demo.asm`. L'elenco viene
prodotto dai metadati raccolti mentre Ultimate Basic genera il codice macchina;
non è semplicemente un disassemblaggio del PRG completato. Contiene:

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
.label x = $02 ; int

* = $080D

ub_start:
cld ; $080D: D8

UB: var x
lda #$01 ; $080E: A9 01
sta x ; $0810: 85 02
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
demo.ub → demo.prg (386 byte)

Caricamento: $080D – $0989

Variabili (pagina zero):
score ZP:$08 byte
lives ZP:$0A byte
msg ZP:$0C stringa
ptr ZP:$0E parola

Sottoprogrammi:
greet $0900
show $0912

Array ($C000+):
sprites $C000 8 byte
```

Con `-v` l'output mostra inoltre le allocazioni interne ZP e un dump esadecimale
completo.

### Codice generato (ottimizzato nella versione 1.6.0)

Il generatore di codice emette un codice 6502 più restrittivo per i casi comuni;
i programmi non necessitano di modifiche:

- Le condizioni in `if` / `while` / `until` / `select` sono un `CMP` più un
  salto (nessun valore 0/1 viene costruito e ricontrollato). `x &gt; n` viene
  compilato come `x &gt;= n+1`; `and` / `or` dei confronti vanno in
  cortocircuito quando il lato destro non ha effetti collaterali; `while` esegue
  i test in fondo al ciclo.
- Le costanti e le variabili byte sono operandi diretti (`ADC #n`, `CMP zp`);
  `poke` a una costante o `word` memorizza direttamente l'indirizzo.
- Gli array con indice variabile utilizzano l'indirizzamento `base,Y` invece di
  un puntatore a pagina zero.
- Quando un'istruzione inizia caricando la variabile che l'istruzione precedente
  ha appena memorizzato, l'LDA ` ridondante ` viene saltato.

Utilizza `--asm` per visualizzare il codice generato per il tuo programma.

## Limitazioni note

| Caratteristica                        | Limitazione                                                                                                                                                                                                                                                                                                                                    |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Aritmetica intera                     | 8 bit senza segno (0–255); le variabili `word` contengono valori a 16 bit                                                                                                                                                                                                                                                                      |
| Budget di pagina zero                 | La pagina zero permanente è `$02–$4F` (78 byte): ogni variabile e parametro sub/fn occupa 2 byte, ogni ciclo `for` in esecuzione ne occupa altri 2. Dalla versione 1.6.4 le variabili che non rientrano vengono spostate automaticamente nella RAM (vedere *Variabili nella RAM*); solo i casi estremi segnalano ancora `pagina zero esaurita` |
| Letterali binari                      | `%01010101` (dalla versione 1.6.4), `$hex` e decimale                                                                                                                                                                                                                                                                                          |
| Sottoprogrammi                        | Nessuna ricorsione: gli slot dei parametri ZP vengono allocati staticamente.                                                                                                                                                                                                                                                                   |
| Variabili stringa                     | `single` / `double` sono numeri in virgola mobile a 5 byte dalla versione 1.6.4 (le routine utilizzate da un programma, ~2–5 KB, vengono aggiunte ad essi); `float` rimane Q8.8 (0–255.99)                                                                                                                                                     |
| Unario meno                           | Dal 1.6.4 un `-` iniziale si lega al suo operando: `-5 - 3` è -8 (era -(5 - 3) = -2)                                                                                                                                                                                                                                                           |
| Runtime di concatenazione di stringhe | I valori calcolati risiedono in un buffer di 80 caratteri per variabile (i risultati più lunghi vengono troncati); i valori degli elementi dell'array di stringhe sono in slot da 31 caratteri; l'ordine `&lt;` / `&gt;` è l'ordine dei byte PETSCII.                                                                                          |
| `rnd()` / `rnd(n)`                    | LCG semplice, non crittografico; periodo = 256 (il valore in virgola mobile `rnd` è un'operazione xorshift a 32 bit)                                                                                                                                                                                                                           |
| `abs()` / `sgn()` / `min()` / `max()` | Solo valori a 8 bit; `abs`/`sgn` trattano i valori come con segno (bit 7 = negativo → `abs` complemento a due, `sgn` restituisce `$FF`); `min`/`max` sono senza segno (0–255)                                                                                                                                                                  |
| `grafico`                             | I pixel fuori intervallo vengono eliminati silenziosamente (Y ≥ 200 o X ≥ 320 → nessuna operazione)                                                                                                                                                                                                                                            |
| `particella`                          | Nessun controllo dei limiti: x deve essere compreso tra 0 e 159, y deve essere compreso tra 0 e 199.                                                                                                                                                                                                                                           |
| `mlinea` / `mretto`                   | Multicolore; x: 0–159, y: 0–199. I pixel fuori schermo si adattano (senza ritaglio) — mantieni le coordinate nell'intervallo                                                                                                                                                                                                                   |
| `cerchio`                             | Multicolore; ritaglia i punti fuori dallo schermo (x ≥ 160 o y ≥ 200 vengono saltati)                                                                                                                                                                                                                                                          |
| `penna colorata`                      | Solo Hires; imposta il nibble di primo piano delle celle toccate (sfondo mantenuto). Non ha effetto in modalità blocco (`plot4`/`circle4`)                                                                                                                                                                                                     |
| `retto`                               | Nessun controllo dei limiti — x: 0–319, y: 0–199; x1≤x2 e y1≤y2 non sono imposti (i rettangoli degeneri/invertiti producono un output indefinito)                                                                                                                                                                                              |
| `grafico4`                            | Nessun controllo dei limiti: x deve essere compreso tra 0 e 79, y deve essere compreso tra 0 e 49 (modalità a blocchi)                                                                                                                                                                                                                         |
| `cerchio4`                            | Ritaglia i pixel del blocco fuori dallo schermo; il raggio utile è approssimativamente compreso tra 0 e 49 nella modalità blocco 80×50.                                                                                                                                                                                                        |
| `chr$`                                | Nessuna mappatura PETSCII↔ASCII: n viene passato così com'è a CHROUT                                                                                                                                                                                                                                                                           |
| `riproduci musica`                    | Richiede `load sid` o un blocco `tune`; viene emesso un solo wrapper CIA1 (l'ultimo `music play` ha la precedenza)                                                                                                                                                                                                                             |
| `grafica su doppio`                   | Solo Hires; utilizza `$4000–$7FFF` per il back buffer, quindi il codice del programma deve rimanere sotto `$4400`; non combinabile con sprite o multicolore                                                                                                                                                                                    |
| Segnalazione degli errori             | Solo in fase di compilazione; `onerr goto` gestisce gli errori di I/O del KERNAL in fase di esecuzione                                                                                                                                                                                                                                         |
