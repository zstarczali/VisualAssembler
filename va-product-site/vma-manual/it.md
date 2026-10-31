# VMA — Assembler di macro visuali

**Manuale della lingua · versione 2.1.0**

VMA è l'assembler 6502/6510 di [C64 Visual
Assembler](https://github.com/zstarczali/VisualAssembler) — il linguaggio della
sua modalità Expert e del testo con cui sono scritti i suoi programmi a blocchi.
Questo manuale descrive il linguaggio; l'editor, la tavolozza dei blocchi e gli
altri strumenti dell'applicazione sono nel manuale di C64 Visual Assembler.

## Contenuto

1. [Formato sorgente](#1-source-format)
2. [Numeri ed espressioni](#2-numbers-and-expressions)
3. [Output: PRG, stub BASIC e punto di
   ingresso](#3-output-prg-basic-stub-and-entry-point)
4. [Modalità di indirizzamento](#4-addressing-modes)
5. [6502 istruzioni](#5-6502-instructions)
6. [Direttive e macro — riferimento](#6-directives-and-macros--reference)
7. [Sintassi in stile KickAssembly](#7-kickassembler-style-syntax)
8. [Riga di comando](#8-command-line)
9. [Limitazioni note](#9-known-limitations)

---

## 1. Formato sorgente

Un file sorgente VMA è in testo semplice, con un'istruzione per riga. La
distinzione tra maiuscole e minuscole non è rilevante per i mnemonici e le
direttive (`lda`, `LDA`, `.BYTE`, `.byte`); i nomi delle etichette, invece,
distinguono tra maiuscole e minuscole.

```
; un commento — così è // un commento
* = $1000 ; ORG: assembla da $1000
start: ; un'etichetta (i due punti sono obbligatori)
lda #$06 ; un'istruzione: mnemonico e operando
sta $D020
.byte $01, $02, $FF ; una direttiva inizia con un punto
loop: dex ; un'etichetta e un'istruzione su una riga
bne loop
rts
```

- **I commenti** iniziano con `;` o `//` e vanno fino alla fine della riga (non
  all'interno di una stringa tra virgolette).
- **Le etichette** sono scritte come `nome:` — lettere, cifre e `_`, che non
  iniziano con una cifra. Un'etichetta può trovarsi su una riga a sé stante o
  prima di un'istruzione. Un nome che inizia con un punto (`.loop:`) è
  un'etichetta **locale** (vedere [Etichette locali (con
  punti)](#local-dotted-labels)); `-` e `+` da sole sono etichette **anonime**,
  referenziate da `bne -` / `beq +` (quella più vicina prima / dopo).
- **Le istruzioni** sono un mnemonico e un operando; l'indentazione è libera.
- **Le direttive** iniziano con un punto (`.byte`, `.macro`, `.if` …); `* =
  $xxxx` (o `.pc = $xxxx`) imposta l'indirizzo.
- **Le macro utente** vengono chiamate come `:nome(argomenti)`, `.invoca
  nome(argomenti)`, `.chiama nome(argomenti)` o `nome(argomenti)`.

## 2. Numeri ed espressioni

| Modulo            | Esempio        | Valore                                                                                                 |
| ----------------- | -------------- | ------------------------------------------------------------------------------------------------------ |
| Esadecimale       | `$D020`, `$0F` | `$` prefisso                                                                                           |
| Binario           | `%00001111`    | prefisso `%`                                                                                           |
| Decimale          | `255`, `40*25` | nessun prefisso                                                                                        |
| Carattere         | `'A'`          | il suo codice (`$41`)                                                                                  |
| Indirizzo attuale | `*`            | l'indirizzo della linea (vedere [Il contatore di programma `*`](#the--program-counter-in-expressions)) |

Negli operandi delle istruzioni, scrivere i numeri esadecimali con `$`. Negli
argomenti di indirizzo delle macro di libreria (`.rawbytes C000, …`,
`.sprite_init 0, 1, 80`) viene letto come esadecimale un numero da una a quattro
cifre.

**Operatori** (negli operandi, `.const`, `.fill`, `.assert`, `.if`): `+ - * /
%`, `& | ^ ~`, `<< >>`, parentesi, `<expr` (byte basso) e `>expr` (byte alto), e
nelle condizioni `== != < > <= >=` (vero = 1, falso = 0). `.fill`, `.const` e
simili conoscono anche `lo()`, `hi()`, `sin()`, `cos()`, `round()`, `min()`,
`max()`, `abs()` e `PI`.

```
.const B = 7
lda #(B+1)*2
lda #B & 3 | 8
lda #~B & $FF
ldx #'A'
lda #<screen ; byte basso di un'etichetta
lda #>(*+63) ; byte alto di un indirizzo relativo al PC
```

## 3. Output: PRG, stub BASIC e punto di ingresso

VMA scrive un C64 **PRG**: un indirizzo di caricamento di due byte seguito
dall'immagine di memoria. Ogni sezione ORG e ogni direttiva che posiziona dati a
un proprio indirizzo (`.rawbytes`, `.incbin`, `.sid` …) vanno in un'unica
immagine; gli spazi tra di esse sono zeri.

- **Senza un ORG** il programma inizia a `$0801`, dove inizia BASIC.
- **Stub BASIC SYS** (impostazione predefinita): una `10 SYS nnnn` riga viene
  inserita in `$0801`, quindi il programma inizia con `RUN`. Un programma il cui
  primo ORG è `$0801` inizia quindi in `$080D`. Disattiva lo stub con
  `--no-basic-stub`; senza di esso un programma in `$0801` viene assemblato in
  `$C000`, qualsiasi altro rimane al suo primo ORG.
- **Punto di ingresso:** la riga SYS salta all'inizio del codice, o
  all'indirizzo specificato da un commento di prima riga `; Punto di ingresso:
  $1234`.
- **Codice sotto la riga BASIC** (un ORG inferiore a `$0801` insieme allo stub):
  un piccolo caricatore avvia il programma e lo sposta al suo posto, quindi
  inizia ancora con `RUN`.
- Una sorgente che inizia con la propria riga BASIC SYS (`.byte $0B, $08, $0A,
  $00, $9E, …` a `$0801`) viene emessa così com'è, senza un secondo stub.

Dal PRG la riga di comando crea anche una **cartridge** e un'immagine **disk**
(novità nella versione 2.1.0, vedi [8. Riga di comando](#8-command-line)):

- `--crt FILE` — una cartuccia Magic Desk (tipo CRT 19, 8 banchi da 8K, al
  massimo 65.408 byte di programma). Un caricatore nel banco 0 inizializza il
  KERNAL, esegue una routine di copia dalla RAM in `$0100–$013B` che sposta il
  programma al suo indirizzo di caricamento (cambiando banco tramite `$DE00`),
  spegne la cartuccia e salta al punto di ingresso. Tenere il programma fuori da
  `$0100–$013B` e dai byte di pagina zero `$02–$04` / `$FB–$FE` utilizzati dal
  caricatore.
- `--d64 [FILE]` — un'immagine disco 1541 (35 tracce) con il PRG denominato come
  esso, più i file `--add`, disposti come li scrive il DOS 1541; non è
  necessario c1541.

---

## 4. Modalità di indirizzamento

Ogni istruzione del 6502 supporta una o più modalità di indirizzamento. Il VMA
seleziona la modalità in base a come è scritto l'operando.

| Modalità       | Etichetta          | Esempio       | Descrizione                                                                                             |
| -------------- | ------------------ | ------------- | ------------------------------------------------------------------------------------------------------- |
| **implicito**  | Implicito          | `NOP`         | Nessun operando; l'istruzione è autonoma.                                                               |
| **immediato**  | Immediato          | `LDA #$FF`    | Costante in linea; l'assemblatore aggiunge automaticamente `#`.                                         |
| **zeroPage**   | Pagina zero        | `LDA $10`     | Indirizzo di un singolo byte nella pagina zero (0–255)                                                  |
| **zeroPageX**  | Pagina zero,X      | `LDA $10,X`   | Indirizzo di pagina zero + offset del registro X (il risultato va a capo nella pagina 0)                |
| **zeroPageY**  | Pagina zero,Y      | `LDX $FB,Y`   | Indirizzo di pagina zero + offset del registro Y                                                        |
| **assoluto**   | Assoluto           | `LDA $0400`   | Indirizzo di memoria completo a 16 bit                                                                  |
| **X assoluto** | Assoluto,X         | `LDA $0400,X` | Indirizzo a 16 bit + offset del registro X                                                              |
| **assolutoY**  | Assoluto,Y         | `LDA $0400,Y` | Indirizzo a 16 bit + offset del registro Y                                                              |
| **relativo**   | Relativo/Etichetta | `Ciclo BNE`   | Per le istruzioni relative alla filiale, inserire il nome dell'etichetta o l'indirizzo di destinazione. |
| **indirectX**  | Indiretto,X        | `LDA ($FB,X)` | Indicizzazione indiretta a pagina zero (operando = indirizzo di pagina zero, 1 byte)                    |
| **indirectY**  | Indiretto,Y        | `LDA ($FB),Y` | Indicizzazione indiretta della pagina zero (operando = indirizzo della pagina zero, 1 byte)             |
| **indiretto**  | Indiretto          | `JMP ($0100)` | Indiretto; utilizzabile solo con JMP                                                                    |

### Costanti nella pagina zero

Un operando composto solo da costanti (`.const`, `name = value`, un `.var`) che
rientra in un byte assume la modalità **zero-page** dell'istruzione, esattamente
come farebbe il numero: dopo `.const zp = $FB`, `lda zp` viene assemblato in `A5
FB` (2 byte, 3 cicli) e `lda zp,x` in `B5 FB`. Una modalità per cui l'istruzione
non ha una forma a pagina zero rimane assoluta (`lda zp,y` → `B9 FB 00`).
Un'etichetta non viene ristretta: il suo indirizzo è noto solo dopo il layout e
`lda.abs zp` forza la modalità assoluta. Un numero mantiene la larghezza con cui
è scritto: `$FB` è pagina zero, `$00FB` è assoluta. *(Novità nella versione
2.1.)*

### Etichetta le espressioni come operandi

Qualsiasi operando che accetta un indirizzo o un valore immediato accetta anche
direttamente un **nome costante** (una `.const` o un'etichetta). Inoltre, è
possibile utilizzare le espressioni **etichetta+offset** o **etichetta−offset**
per fare riferimento a un indirizzo relativo a una costante denominata:

| Sintassi             | Esempio                            | Descrizione                                                                                                                   |
| -------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `etichetta`          | `STA screen_ram,X`                 | Si risolve nell'etichetta/valore costante                                                                                     |
| `etichetta+$hex`     | `STA screen_ram+$0100,X`           | Indirizzo dell'etichetta più un offset esadecimale                                                                            |
| `etichetta+decimale` | `STA screen_ram+256,X`             | Indirizzo dell'etichetta più un offset decimale                                                                               |
| `etichetta-$hex`     | `Tabella LDA-$10`                  | Indirizzo dell'etichetta meno un offset esadecimale                                                                           |
| `$hex+expr`          | `LDA $1234+1`, `STA $0400+40*2,X`  | Qualsiasi espressione di numeri, etichette e costanti *(2.1)*                                                                 |
| `(etichetta)`        | `JMP (vettore)`, `JMP (tabella+2)` | Salto indiretto attraverso un'etichetta o un'espressione *(2.1)*                                                              |
| `#<etichetta`        | `LDA #<screen_ram`                 | Byte meno significativo dell'indirizzo dell'etichetta                                                                         |
| `#>etichetta`        | `LDA #>screen_ram`                 | Byte più significativo dell'indirizzo dell'etichetta                                                                          |
| `*`                  | `BNE *`                            | Contatore di programma corrente (indirizzo dell'istruzione stessa); i salti con `*` generano un ciclo infinito (offset `$FE`) |

**Esempio: cancellare due pagine dello schermo usando una COSTANTE:**
```
; .CONST screen_ram = $0400

LDX #$00
clear:

STA screen_ram,X

STA screen_ram+$0100,X

DEX
BNE clear
```

### Il contatore di programma `*` nelle espressioni

`*` non è più limitato a essere l'intero operando: può apparire **ovunque
all'interno di un'espressione operando** e rappresenta l'indirizzo
dell'istruzione su cui è scritto. Viene risolto in fase di assemblaggio rispetto
all'indirizzo reale di tale istruzione, quindi non è necessaria alcuna etichetta
per brevi salti relativi o letture di dati relative al PC.

| Sintassi      | Esempio              | Senso                                            |
| ------------- | -------------------- | ------------------------------------------------ |
| `*`           | `BNE *`              | Salto a se stesso (ciclo infinito, offset `$FE`) |
| `*-n` / `*+n` | `BNE *-5`, `BEQ *+4` | Salto relativo al PC corrente di *n* byte        |
| `JMP *+n`     | `JMP *+20`           | Salto assoluto calcolato dal PC attuale          |
| `#<*` / `#>*` | `LDA #<*`, `LDA #>*` | Byte basso/alto del PC corrente                  |
| `#>(*+n)`     | `LDA #>(*+63)`       | Byte basso/alto di un indirizzo relativo al PC   |

**PC vs. moltiplicazione.** `*` viene trattato come contatore di programma solo
quando si trova in *posizione valore* — all'inizio dell'espressione, o subito
dopo un operatore, `(`, `,`, `<`, `>` o uno spazio bianco. Un `*` che segue un
numero, `)` o un identificatore è una moltiplicazione ordinaria, quindi `tabella
LDA*2` e `CONST_A*4` rimangono invariati.

**Dove funziona.** Qualsiasi operando che accetti già un'espressione:
destinazioni di salto, `JMP` / `JSR`, `LDA`/`STA`/… assoluti e indicizzati,
operatori immediati di byte bassi/alti e l'espressione `.assert`. `*` non
modifica mai la dimensione di un'istruzione, quindi è sicuro in ogni modalità di
indirizzamento.

### Etichette locali (tratteggiate)

Un'etichetta il cui nome inizia con un punto — `.loop`, `.skip`, `.done` — è
un'etichetta **locale**. Appartiene all'ambito dell'etichetta **globale** (non
puntata) più vicina precedente e internamente diventa `<globale>.<nome>`. Due
etichette locali con lo stesso nome breve sotto etichette globali diverse non
**entrano in conflitto.

```
DrawSprite:

LDX #0
.loop: ; == DrawSprite.loop
LDA SpriteData,X

STA $2000,X

INX
CPX #63
BNE .loop ; si risolve all'interno di DrawSprite
RTS

ClearScreen:

LDX #0
.loop: ; == ClearScreen.loop — nessun conflitto

STA $0400,X

INX
BNE .loop
RTS
```

- All'interno di un ambito, si fa riferimento a un'etichetta locale come
  `.nome`.
- Da un altro ambito, fai riferimento ad esso esplicitamente come `Global.name`
  (ad esempio `JMP ClearScreen.loop`).
- Un `.name` scritto prima di qualsiasi etichetta globale rimane un semplice
  `.name` di livello superiore.

### etichette degli operandi del codice automodificante

Anteponi `label:` all'operando di un'istruzione per posizionare un'etichetta sul
byte **operando** anziché sull'opcode. L'istruzione viene assemblata a partire
da ciò che segue i due punti.

```
Configurazione:
Valore LDA: #$00; 'valore' -> indirizzo del byte operando #$00

... Patch:
LDA #new
Valore STA; scrive direttamente il byte operando — SMC classico
```

`Il valore` punta a `<indirizzo dell'istruzione> + 1` (il primo byte
dell'operando), per ogni modalità di indirizzamento. Questo sostituisce il
vecchio schema `STA istruzione+1` / `istruzione: LDA #$00`.

---

## 5. Istruzioni 6502

### Movimento dei dati

| Mnemonico | Descrizione                         | Modalità                                                                    |
| --------- | ----------------------------------- | --------------------------------------------------------------------------- |
| `LDA`     | Accumulatore di carico              | immediato, zeroPage, assoluto, assolutoX, assolutoY, indirettoX, indirettoY |
| `LDX`     | Carica il registro X                | immediato, zeroPage, zeroPageY, assoluto, assolutoY                         |
| `LDY`     | Caricare il registro Y              | immediato, zeroPage, assoluto, assolutoX                                    |
| `STA`     | Accumulatore di magazzino           | zeroPage, assoluto, assolutoX, assolutoY, indirettoX, indirettoY            |
| `STX`     | Registrati al negozio X             | zeroPage, zeroPageY, assoluto                                               |
| `STY`     | Registratore di cassa del negozio Y | zeroPage, assoluto                                                          |

### Aritmetica

| Mnemonico  | Descrizione            | Note                                                                         |
| ---------- | ---------------------- | ---------------------------------------------------------------------------- |
| `ADC`      | Aggiungi con trasporto | Impostare il trasporto con `SEC` prima dell'uso nella maggior parte dei casi |
| `SBC`      | Sottrarre con riporto  | Imposta il riporto con `SEC` prima della sottrazione                         |
| `INC`      | Memoria incrementale   | —                                                                            |
| `DICEMBRE` | Decrementa la memoria  | —                                                                            |
| `CMP`      | Confronta con A        | Imposta i flag; non modifica A                                               |
| `CPX`      | Confronta con X        | —                                                                            |
| `CPY`      | Confronta con Y        | —                                                                            |

### Logica

| Mnemonico | Descrizione                                                      |
| --------- | ---------------------------------------------------------------- |
| `E`       | AND logico con accumulatore                                      |
| `ORA`     | OR logico con accumulatore                                       |
| `EOR`     | OR esclusivo con accumulatore                                    |
| `BIT`     | Verifica i bit in memoria rispetto ad A (imposta i flag N, V, Z) |

### Salti e rami

| Mnemonico | Descrizione                                                      |
| --------- | ---------------------------------------------------------------- |
| `JMP`     | Salto incondizionato (assoluto o indiretto)                      |
| `JSR`     | Salta alla subroutine (salva l'indirizzo di ritorno sullo stack) |
| `RTS`     | Ritorno dalla subroutine                                         |
| `RTI`     | Ritorno dall'interruzione                                        |
| `BNE`     | Salta se diverso da (Z=0)                                        |
| `BEQ`     | Salta se uguale (Z=1)                                            |
| `BCC`     | Salta se il riporto è azzerato (C=0)                             |
| `BCS`     | Salta se il set di riporto (C=1)                                 |
| `BMI`     | Salta se meno (N=1)                                              |
| `BPL`     | Salta se più (N=0)                                               |
| `BVC`     | Salta se l'overflow è a zero (V=0)                               |
| `BVS`     | Salta se è impostato l'overflow (V=1)                            |

#### LBNE / LBEQ / … (Rami lunghi)

Otto pseudo-operazioni si comportano come salti condizionali ma raggiungono
**qualsiasi indirizzo**, non solo −128…+127. Ognuna di esse si assembla in un
salto invertito che salta un `JMP` di 3 byte — sempre **5 byte**:

```
LBEQ completato; assembla in: BNE *+3 ($D0 $03)

; JMP completato ($4C lo hi)
```

| Long op | Condizione                         | Emesso come               |
| ------- | ---------------------------------- | ------------------------- |
| `LBNE`  | diverso da (Z=0)                   | `BEQ *+3 / Obiettivo JMP` |
| `LBEQ`  | uguale (Z=1)                       | `BNE *+3 / JMP target`    |
| `LBCC`  | portare via (C=0)                  | `BCS *+3 / JMP target`    |
| `LBCS`  | set di riporto (C=1)               | `BCC *+3 / JMP target`    |
| `LBMI`  | meno (N=1)                         | `BPL *+3 / JMP target`    |
| `LBPL`  | più (N=0)                          | `BMI *+3 / Obiettivo JMP` |
| `LBVC`  | svuotamento del sovraccarico (V=0) | `BVS *+3 / JMP target`    |
| `LBVS`  | set di overflow (V=1)              | `BVC *+3 / JMP target`    |

- Operando: un'etichetta, un'espressione `*` o un indirizzo letterale, come per
  un normale obiettivo di salto.
- Costo: 5 byte e 1 ciclo aggiuntivo sul percorso scelto rispetto a un salto
  breve. Non c'è promozione automatica di un salto breve: si sceglie `LBxx`
  esplicitamente.
- Quando un salto semplice (`BNE`, `BEQ`, …) è fuori intervallo, l'errore del
  compilatore ora specifica l'esatto overshoot e suggerisce il corrispondente
  `LBxx`.

### Operazioni di cassa

| Mnemonico | Descrizione                                |
| --------- | ------------------------------------------ |
| `TASSA`   | Trasferimento A → X                        |
| `TAY`     | Trasferimento A → Y                        |
| `TXA`     | Trasferimento X → A                        |
| `TYA`     | Trasferimento Y → A                        |
| `TSX`     | Puntatore dello stack di trasferimento → X |
| `TXS`     | Trasferimento X → Puntatore dello stack    |
| `INX`     | Incremento X                               |
| `DEX`     | Decrementare X                             |
| `INY`     | Incremento Y                               |
| `DEY`     | Decrementare Y                             |

### Traslazione e rotazione

| Mnemonico | Descrizione                                |
| --------- | ------------------------------------------ |
| `ASL`     | Spostamento aritmetico a sinistra          |
| `LSR`     | Spostamento logico a destra                |
| `ROL`     | Ruotare a sinistra attraverso il trasporto |
| `ROR`     | Ruotare a destra attraverso il trasporto   |

### Pila

| Mnemonico | Descrizione                                   |
| --------- | --------------------------------------------- |
| `PHA`     | Spingere l'accumulatore sulla pila            |
| `PHP`     | Inserisci lo stato del processore nello stack |
| `PLA`     | Rimuovi l'accumulatore dalla pila             |
| `PLP`     | Recupera lo stato del processore dallo stack  |

### Sistema / Bandiere

| Mnemonico | Descrizione                                  |
| --------- | -------------------------------------------- |
| `CLC`     | Bandiera Clear Carry                         |
| `CLD`     | Cancella la modalità decimale                |
| `CLI`     | Disabilitare l'interruzione di cancellazione |
| `CLV`     | Cancella il flag di overflow                 |
| `SEC`     | Imposta la bandiera di trasporto             |
| `SED`     | Imposta la modalità decimale                 |
| `SEI`     | Imposta Interruzione disabilitata            |
| `NOP`     | Nessuna operazione                           |
| `BRK`     | Interruzione forzata / interruzione software |

### Istruzioni illegali/non documentate

Questi chip sono supportati per un utilizzo avanzato. Usare con cautela: il
comportamento può variare da un chip all'altro.

`LAX`, `SAX`, `DCP`, `ISC`, `SLO`, `RLA`, `SRE`, `RRA`, `ANC`, `ALR`, `ARR`,
`AXS` e le forme `NOP` che leggono un operando: `NOP #$nn` ($80), `NOP $nn`
($04), `NOP $nn,X` ($14), `NOP $nnnn` ($0C), `NOP $nnnn,X` ($1C)

---

## 6. Direttive e macro — riferimento

Le direttive controllano l'assemblaggio (etichette, dati, origine, condizioni,
macro utente); le macro di libreria svolgono le operazioni comuni del C64 in una
sola riga: invece di scrivere 10-20 istruzioni a mano, si scrive una riga e
l'assembler genera il codice. Pensatele come subroutine integrate.

---

### ETICHETTA

Come un numero di riga ** in BASIC** — ma con un nome invece di un numero.
Destinazioni di salto per `JMP`, `JSR`, `BNE`, ecc.

| Discussione         | Descrizione                                            |
| ------------------- | ------------------------------------------------------ |
| Nome dell'etichetta | Identificatore utilizzato in `JMP`, `JSR`, `BNE`, ecc. |

**Sintassi:**
```
ciclo continuo:
```

**Codice generato:**
```
ciclo: ; $0820
```

L'indirizzo corrente viene mostrato come commento. Le etichette hanno una
dimensione di **0 byte**.

---

### COMMENTO

Come **REM in BASIC** — una nota per te stesso che l'assembler ignora
completamente.

**Sintassi:**
```
Il tuo commento qui
```

**Codice generato:**
```
Il tuo commento qui
```

---

### BYTE

Come **DATA in BASIC** — memorizza un elenco di valori di byte grezzi in linea
nel programma.

| Discussione | Descrizione                                                                   |
| ----------- | ----------------------------------------------------------------------------- |
| Operando    | Valori di byte separati da virgole (ad esempio `$01, $02, $FF` o `1, 2, 255`) |

**Sintassi:**
```
.byte $01, $02, $FF
```

**Codice generato:**
```
.byte $01, $02, $FF
```

** Riferimenti all'etichetta del byte basso/alto: ** BYTE accetta token
`<etichetta` (byte basso) e `>etichetta` (byte alto) in stile KickAssembler /
ca65 insieme a valori numerici. L'assembler risolve l'indirizzo dell'etichetta
in fase di compilazione e inserisce il byte appropriato. Esempio:

```
.byte <frame_0, >frame_0, <frame_1, >frame_1
```

Questo memorizza il byte basso dell'indirizzo di `frame_0`, poi il byte alto, e
poi lo stesso per `frame_1`. Utile per costruire tabelle di salto ed elenchi di
indirizzi.

**Dimensione:** Numero di byte nell'elenco.

---

### PAROLA

Come **DATA in BASIC ma per numeri a 16 bit **. Ogni valore è memorizzato come
due byte (prima il byte meno significativo, poi il byte più significativo -
ordine little-endian 6502).

| Discussione | Descrizione                                                     |
| ----------- | --------------------------------------------------------------- |
| Operando    | Valori a 16 bit separati da virgole (ad esempio `$0400, $C000`) |

**Sintassi:**
```
.word $0400, $C000
```

**Codice generato:**
```
.word $0400, $C000
```

**Dimensione:** 2 byte per parola.

---

### RIEMPIRE

Come `FOR I=1 TO N : POKE addr+I, val : NEXT` — riempie un blocco di memoria con
lo stesso byte, in una riga. Ottimo per liberare aree o pre-riempire tabelle.

| Discussione | Descrizione                                                  |
| ----------- | ------------------------------------------------------------ |
| Operando    | `count,value` — ad esempio `256,0` riempie 256 byte con zero |

**Sintassi:**
```
.riempi 256, $00
```

**Codice generato:**
```
.riempi 256, $00
```

Sintassi dell'espressione: **Sia **count` che `value` accettano espressioni
aritmetiche. È possibile fare riferimento a nomi CONST, utilizzare letterali
esadecimali/binari e chiamare funzioni matematiche integrate:

| Espressione                       | Senso                                                   |
| --------------------------------- | ------------------------------------------------------- |
| `NUMERO_TESSERE, $00`             | conteggio da una COSTANTE, valore letterale esadecimale |
| `40*25, 0`                        | moltiplicazione in linea                                |
| `arrotondato(sin(PI/4)*255), $80` | trigonometria                                           |

**Funzioni integrate:** `sin()`, `cos()`, `round()`, `max(a,b)`, `min(a,b)`,
`abs()`, costante `PI`

Operatori: `+ - * /` Letterali: `$FF` (esadecimale), `%10110000` (binario) Byte
basso/alto: `lo(expr)`, `hi(expr)`

**Dimensione:** Il valore del conteggio in byte.

---

### ALLINEARE

Sposta l'indirizzo corrente in avanti fino al successivo limite pulito inserendo
byte di riempimento con zeri. Il C64 richiede che i dati degli sprite inizino su
un limite di 64 byte: `ALIGN 64` lo gestisce automaticamente.

| Discussione | Descrizione                                                                                  |
| ----------- | -------------------------------------------------------------------------------------------- |
| Confine     | Valore di allineamento — ad esempio `64` (contorno sprite), `256` (pagina), `$2000` (bitmap) |

**Sintassi:**
```
.align 64
.align $2000
```

**Codice generato:**
```
; ALLINEA 64 → $0840 (12 byte di riempimento)
```

**Dimensione:** Dinamica — dipende dalla posizione corrente del contatore di
programma.

> **Suggerimento:** Utilizzare `ALIGN 64` prima dei dati degli sprite, `ALIGN
> 256` per garantire tabelle allineate alla pagina.

---

### TESTO

Come **PRINT AT** — scrive il testo direttamente sullo schermo del C64 in una
data colonna e riga, senza usare il KERNAL. Genera una coppia LDA/STA per
carattere, indirizzando la RAM dello schermo a `$0400`.

| Discussione             | Descrizione                                                          |
| ----------------------- | -------------------------------------------------------------------- |
| Testo                   | La stringa da visualizzare                                           |
| X                       | Colonna (0–39)                                                       |
| Y                       | Riga (0–24)                                                          |
| Etichetta (facoltativa) | Assegna un'etichetta che punta all'indirizzo dello schermo calcolato |
| `inferiore`             | Bandiera facoltativa — vedi sotto                                    |

**Modalità di set di caratteri:**

Il C64 offre due set di caratteri selezionabili in fase di esecuzione:

| Modalità                                         | $D018 bit 1 | Input in maiuscolo                 | Input in minuscolo              |
| ------------------------------------------------ | ----------- | ---------------------------------- | ------------------------------- |
| **Maiuscole/grafica** (predefinito)              | 0           | `A`–`Z` → codici schermo $01–$1A ✓ | trattato anche come maiuscolo   |
| **Minuscolo/maiuscolo** (dopo CHARSET minuscolo) | 1           | `A`–`Z` → $01–$1A (maiuscolo)      | `a`–`z` → $41–$5A (minuscolo) ✓ |

- **Set di caratteri maiuscoli (predefinito):** Digita ciò che vuoi vedere in
  maiuscolo. `"CIAO"` viene visualizzato come `CIAO`. L'input minuscolo viene
  mappato ai codici schermo maiuscoli.
- **Set di caratteri minuscoli (`minuscolo`):** Digita esattamente il formato
  che desideri visualizzare. `"ciao"` → visualizzazione in minuscolo, `"CIAO"` →
  visualizzazione in maiuscolo. Richiede un cambio di set di caratteri in fase
  di esecuzione prima che lo schermo venga scritto (utilizza la macro **CHARSET
  minuscolo**.

**Codice generato (modalità maiuscolo, `"CIAO"`):**
```
LDA #$08; codice schermo 'H' $08

STA $0400

LDA #$05; codice schermo 'E' $05

STA $0401

...
```

**Sintassi:**
```
.text 0, 2, "HELLO" ; set di caratteri maiuscoli (predefinito)
.text 0, 2, "hello", lower ; set di caratteri minuscoli
```

I caratteri sono codificati come **codici schermo** (non PETSCII).
**Dimensione:** `lunghezza testo × 5` byte (LDA + STA per carattere).

---

### CORDA

Come **inserire una stringa ** in qualsiasi indirizzo di memoria durante
l'esecuzione. Genera coppie LDA/STA che copiano il codice schermo di ciascun
carattere in indirizzi consecutivi.

| Discussione             | Descrizione                                                                                                |
| ----------------------- | ---------------------------------------------------------------------------------------------------------- |
| Testo                   | La stringa da scrivere                                                                                     |
| Indirizzo               | Indirizzo di memoria di destinazione — `$C000` esadecimale o un **nome dell'etichetta**                    |
| Etichetta (facoltativa) | Assegna un'etichetta che punta all'indirizzo di destinazione                                               |
| Spostare                | Valore esadecimale (00–FF) aggiunto a ciascun byte del codice schermo (ad esempio `$80` = video invertito) |
| `inferiore`             | Flag opzionale: stessa semantica di TESTO (vedi sezione TESTO)                                             |

**Sintassi:**
```
.string $C000, "HELLO" ; set di caratteri maiuscoli (predefinito)
.string $C000, "hello", lower ; set di caratteri minuscoli
.string $C000, "HELLO", 80 ; con shift (video inverso)
.string $C000, "hello", 80, lower ; shift + minuscolo
.string $C000, "HELLO" :my_string ; con macroLabel
```

**Codice generato:**
```
LDA #$08; codice schermo 'H'

STA $C000

LDA #$05; codice schermo 'E'

STA $C001

...
```

I caratteri sono codificati come **codici schermo** (non PETSCII). Il valore
opzionale **Shift** viene aggiunto a ogni byte, ad esempio `$80` per il video
inverso. **Dimensione:** `lunghezza testo × 5` byte (un LDA + un STA per
carattere).

---

### DATI

Come un ciclo **POKE** — scrive un elenco di byte grezzi in un indirizzo di
memoria in fase di esecuzione, una coppia LDA/STA per byte.

| Discussione             | Descrizione                                                                             |
| ----------------------- | --------------------------------------------------------------------------------------- |
| Byte                    | Valori di byte separati da virgole                                                      |
| Indirizzo               | Indirizzo di memoria di destinazione — `$C000` esadecimale o un **nome dell'etichetta** |
| Etichetta (facoltativa) | Assegna un'etichetta che punta all'indirizzo di destinazione                            |

**Sintassi:**
```
.data $C000, $01, $02, $03 ; indirizzo esadecimale
.data my_buf, $01, $02, $03 ; indirizzo dell'etichetta
.data $C000, $01, $02, $03 :mydata ; con macroLabel
```

**Codice generato:**
```
LDA #$01
    STA$C000
    LDA #$02
    STA$C001
    ...
```

**Dimensione:** `numero_byte × 5` byte (un LDA + un STA per byte).

> **2.1:** i byte possono denominare etichette: `.data $2010, <target, >target`
> scrive l'indirizzo di `target`, anche di un'etichetta definita in seguito.
> L'etichetta `:name` della macro può puntare a un indirizzo di destinazione che
> è a sua volta un'etichetta.

---

### RAWBYTES

Come **DATI che vengono caricati direttamente in memoria** — nessun codice in
fase di esecuzione. I byte sono presenti dal momento in cui il PRG viene
caricato, prima ancora che il tuo codice inizi. Usalo per i dati degli sprite,
le mappe dei livelli, le tabelle di ricerca, qualsiasi cosa che debba
semplicemente trovarsi a un indirizzo specifico.

| Discussione             | Descrizione                                                                             |
| ----------------------- | --------------------------------------------------------------------------------------- |
| Byte                    | Valori di byte separati da virgole                                                      |
| Indirizzo               | Indirizzo di memoria di destinazione — `$C000` esadecimale o un **nome dell'etichetta** |
| Etichetta (facoltativa) | Assegna un'etichetta che punta all'indirizzo di destinazione                            |

**Sintassi:**
```
.rawbytes $C000, $00, $00, $00 ; indirizzo esadecimale
.rawbytes sprite_data, $00, $00 ; indirizzo dell'etichetta
.rawbytes $0C50, $00, $00 :nev ; con macroLabel — altro codice può usare LDA nev,X
```

**Dimensione in codice:** 0 byte. I dati vengono posizionati all'indirizzo
specificato nell'output.

> **DATA vs RAWBYTES:** DATA genera codice LDA/STA che copia i byte in fase di
> esecuzione (più lento, ma funziona se i dati devono essere dinamici). RAWBYTES
> inserisce semplicemente i byte direttamente: nessun codice, istantaneo, costo
> zero.

> **2.1:** i byte possono denominare etichette (`.rawbytes $2000, <target,
> >target` — una tabella di puntatori); l'etichetta `:name` può puntare a
> un'etichetta come indirizzo di destinazione, anche definita in seguito. Come
> argomento del buffer di una macro, i byte occupano il proprio spazio nei
> buffer dopo il programma.

---

### TESTO NON RAW

Come RAWBYTES ma per il testo: codifica la stringa come codici schermo e
posiziona i byte a un indirizzo fisso senza **codice runtime**. Il testo è
pronto in memoria nell'istante in cui il PRG viene caricato.

| Discussione             | Descrizione                                                                                                |
| ----------------------- | ---------------------------------------------------------------------------------------------------------- |
| Testo                   | Stringa da codificare                                                                                      |
| Indirizzo               | Indirizzo di memoria di destinazione — `$C000` esadecimale o un **nome dell'etichetta**                    |
| Etichetta (facoltativa) | Assegna un'etichetta che punta all'indirizzo di destinazione                                               |
| Spostare                | Valore esadecimale (00–FF) aggiunto a ciascun byte del codice schermo (ad esempio `$80` = video invertito) |
| `inferiore`             | Flag opzionale: stessa semantica di TESTO (vedi sezione TESTO)                                             |

**Sintassi:**
```
.rawtext $C000, "HELLO" ; set di caratteri maiuscoli (predefinito)
.rawtext $C000, "hello", lower ; set di caratteri minuscoli
.rawtext $C000, "HELLO", 80 ; con shift (video inverso)
.rawtext $C000, "hello", 80, lower ; shift + minuscolo
.rawtext $0400, "HELLO" :my_text ; con macroLabel
```

**Codice generato:**
```
; .rawtext "HELLO" -> $C000
; $C000

.byte $08, $05, $0C, $0C, $0F ; H E L L O (codici di visualizzazione maiuscoli)

; .rawtext "hello", minuscolo -> $C000
; $C000

.byte $48, $45, $4C, $4C, $4F ; h e l l o (codici di visualizzazione minuscoli nell'intervallo $41–$5A)
```

**Dimensione in codice:** 0 byte. I dati vengono posizionati all'indirizzo
specificato nell'output.

> **STRING vs RAWTEXT:** STRING genera codice LDA/STA che copia il testo in fase
> di esecuzione. RAWTEXT inserisce i byte nel PRG al momento del caricamento:
> nessun codice, nessuna attesa.

---

### PETSCII

Come **RAWBYTES ma per l'output KERNAL** — codifica la stringa come byte PETSCII
(compatibile con CHROUT a `$FFD2`) e li posiziona a un indirizzo fisso senza
codice runtime. Usalo quando vuoi stampare caratteri tramite `JSR $FFD2` in un
ciclo e nota che `.print` usa lo stesso codificatore e il flag `lower`.

> **Codici PETSCII vs codici schermo:** PETSCII e codici schermo sono due
> codifiche diverse. Codice schermo `$01` = lettera A; PETSCII `$41` = lettera A
> (tramite CHROUT). Utilizzare PETSCII solo quando si stampa tramite il KERNAL;
> utilizzare TEXT/STRING/RAWTEXT per scrivere direttamente nella RAM dello
> schermo.

| Discussione             | Descrizione                                                                             |
| ----------------------- | --------------------------------------------------------------------------------------- |
| Testo                   | Stringa da codificare come byte PETSCII                                                 |
| Indirizzo               | Indirizzo di memoria di destinazione — `$C000` esadecimale o un **nome dell'etichetta** |
| Etichetta (facoltativa) | Assegna un'etichetta che punta all'indirizzo di destinazione                            |
| `inferiore`             | Bandiera facoltativa — vedi sotto                                                       |

**Modalità di set di caratteri:**

| Modalità                    | Input in maiuscolo (`A`–`Z`)                                                                                                         | Input in minuscolo (`a`–`z`) |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------- |
| **Maiuscolo (predefinito)** | `$41`–`$5A` (PETSCII maiuscolo tramite CHROUT)                                                                                       | mappato anche a `$41`–`$5A`  |
| **Minuscolo (`minuscolo`)** | Le lettere dell'alfabeto vengono rimappate in modo che la visualizzazione rimanga coerente nel set di caratteri minuscolo/maiuscolo. | Stessa regola                |

**Sintassi:**
```
.petscii $C000, "HELLO" ; PETSCII maiuscolo (predefinito)
.petscii $C000, "hello", lower ; PETSCII minuscolo ($61–$7A)
.petscii $C000, "HELLO", null ; con terminatore nullo
.petscii $C000, "hello", lower, null ; minuscolo + terminatore nullo
.petscii $C000, "HELLO" :my_msg ; con macroLabel
```

**Byte generati (maiuscolo, `"CIAO"`):**
```
; $C000

.byte $48, $45, $4C, $4C, $4F ; H E L L O (intervallo PETSCII $41–$5A)
```

**Dimensione in codice:** 0 byte. I dati vengono posizionati all'indirizzo di
destinazione come sezione dati differita (come RAWBYTES).

** Terminatore nullo:** aggiunge il flag `null` per aggiungere un byte `$00`
dopo il testo. Ideale per cicli terminati da null:

```
LDX #$00
ciclo:
LDA msg,X
BEQ completato; $00 interrompe il ciclo
JSR $FFD2
INX
BNE ciclo
completato:
RTS
```

**Regole di codifica:**

| Ingresso                              | Modalità maiuscolo              | Modalità minuscolo |
| ------------------------------------- | ------------------------------- | ------------------ |
| `A`–`Z`                               | `$41`–`$5A`                     | `$61`–`$7A`        |
| `a`–`z`                               | `$41`–`$5A` (maiuscolo forzato) | `$41`–`$5A`        |
| Spazio, cifre, punteggiatura (32–126) | così com'è                      | così com'è         |
| Nuova linea                           | `$0D` (INVIO)                   | `$0D`              |
| Altro                                 | `$20` (spazio)                  | `$20`              |

> **Suggerimento:** Utilizzare PETSCII per i dati che verranno visualizzati
> tramite CHROUT (`$FFD2`). Per scrivere direttamente nella RAM dello schermo,
> utilizzare invece STRING o RAWTEXT.

---

### SET DI CARATTERI

Commuta la ROM dei caratteri del VIC-II tra la modalità maiuscolo/grafica
(impostazione predefinita del C64) e la modalità minuscolo/maiuscolo,
modificando il bit 1 di `$D018` in fase di esecuzione.

| Discussione | Descrizione                                                                                                                                   |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Modalità    | **Minuscolo** — abilita il set di caratteri minuscolo/maiuscolo; **Maiuscolo** — ripristina il set di caratteri predefinito maiuscolo/grafico |

**Sintassi:**
```
.charset lower ; passa al set di caratteri minuscolo
.charset upper ; torna al set di caratteri maiuscolo/grafico
```

**Codice generato:**

Modalità minuscolo:
```
LDA $D018

ORA #$02; imposta il bit 1 → ROM minuscolo/maiuscolo a $1800

STA $D018
```

Modalità maiuscole:
```
LDA $D018

E #$FD ; azzera il bit 1 → ROM maiuscole/grafiche a $1000

STA $D018
```

**Dimensione:** 8 byte (LDA abs + ORA/AND imm + STA abs).

**Perché ORA/AND invece di una scrittura diretta?** `$D018` controlla anche la
posizione della RAM dello schermo (bit 7–4). L'inversione del solo bit 1
preserva il resto del registro.

**Flusso di lavoro tipico:**

```
.charset minuscolo
.testo 0, 0, "ciao mondo", minuscolo
.charset maiuscolo
```

> **Nota:** La macro CHARSET modifica solo il puntatore alla ROM dei caratteri
> VIC. Non chiama `$E544` (inizializzazione del charset del KERNAL). Nella
> maggior parte dei casi questo è sufficiente; chiama `JSR $E544` prima solo se
> hai bisogno che le routine di stampa del KERNAL rispettino la modifica.

---

### CHARDEF

Definisce un singolo carattere personalizzato 8×8 in un set di caratteri basato
su RAM. Emette codice runtime inline che copia 8 byte in `base + indice * 8` in
fase di esecuzione, senza bisogno di un'etichetta precedente o di `ORG`.

| Discussione          | Descrizione                                                                                                                            |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Charset base         | Indirizzo base del set di caratteri RAM (predefinito `$3800`). Deve essere allineato in modo che il VIC-II possa vederlo (vedi sotto). |
| Indice dei caratteri | Quale slot carattere ridefinire, 0–255. `65` = 'A' nel layout predefinito del codice schermo.                                          |
| 8 byte               | Righe di bitmap separate da virgole, dall'alto verso il basso. Il bit 7 di ciascun byte corrisponde al pixel più a sinistra.           |

**Sintassi:**
```
.chardef $3800, 65, $18,$3C,$66,$7E,$66,$66,$66,$00
```

**Codice generato (8 × `LDA #b` / `STA target+n`, 40 byte totali):**
```
LDA #$18
    ST$3A08
    LDA #$3C
    ST$3A09
    LDA #$66
    STA $ 3A0A
    LDA #$7E
    STA $ 3A0B
    LDA #$66
    STA$3A0C
    LDA #$66
    STA $ 3A0D
    LDA #$66
    STA$3A0E
    LDA #$00
    STA $ 3A0F
```

**Indirizzo di destinazione:** `$3800 + 65 * 8 = $3A08`. Calcolato in fase di
compilazione e codificato direttamente negli operandi STA.

**Dimensione:** 40 byte per carattere (8 × 5).

**Flusso di lavoro tipico:**
```
; Punto VIC-II nel charset RAM a $3800

LDA $D018

AND #$F1

ORA #$0E ; bit 3-1 = %111 → charset a bank+$3800

STA $D018


.chardef $3800, 65, $18,$3C,$66,$7E,$66,$66,$66,$00 ; ridefinisci 'A'

.chardef $3800, 66, $7C,$66,$66,$7C,$66,$66,$7C,$00 ; ridefinisci 'B'

; ... altre righe .chardef per ogni char personalizzato
```

**Quando utilizzare CHARDEF rispetto alle alternative:**

| Approccio                        | Utilizzare quando                                                                                                                |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **CHARDEF**                      | Sono necessari alcuni caratteri personalizzati (ad esempio da 1 a 20). Ciascuno ha un costo di 40 byte in fase di esecuzione.    |
| **RAWBYTES a $3800**             | Hai a disposizione un set di caratteri personalizzato completo (256 caratteri). Totale di 2 KB di dati, nessuna copia a runtime. |
| **INCBIN "charset.bin" a $3800** | File di set di caratteri esterno (creato dall'Editor di caratteri). L'opzione più pulita.                                        |
| **Tela Charset + INCBIN**        | Bitmap completa di 256 caratteri visualizzata come un'unica immagine 128×128.                                                    |

> **Promemoria di allineamento:** VIC-II prevede che la base del charset sia un
> multiplo di `$0800`. Banchi validi: `$0000`, `$0800`, `$1000`, ... , `$3800`
> (all'interno dell'attuale banco VIC da 16 KB). I charset RAM risiedono
> tipicamente a `$2000`, `$2800`, `$3000` o `$3800`.

---

### BOX_HIT

Test di collisione Axis-aligned bounding box (AABB) tra due rettangoli descritti
da strutture a pagina zero di 4 byte. Restituisce il risultato
nell'accumulatore: **A = 1** in caso di sovrapposizione, **A = 0** altrimenti.
Assemblaggio inline puro, nessuna chiamata a subroutine.

| Discussione                     | Descrizione                                                                                |
| ------------------------------- | ------------------------------------------------------------------------------------------ |
| Casella postale 1, indirizzo ZP | Base della pagina zero della struttura a 4 byte della prima casella (predefinita `$FB`).   |
| Casella postale 2, indirizzo ZP | Base della pagina zero della struttura a 4 byte della seconda casella (predefinita `$F7`). |

** Layout della struttura** (4 byte per riquadro, coordinate a 8 bit senza
segno):

| Offset | Campo             |
| ------ | ----------------- |
| `+0`   | Sinistra          |
| `+1`   | Superiore         |
| `+2`   | Giusto            |
| `+3`   | Metter il fondo a |

**Sintassi:**
```
.box_hit $FB, $F7
```

**Codice generato (30 byte, completamente relativo al PC - nessuna subroutine,
nessun salto assoluto):**
```
LDA $FD ; b1 destra
CMP $F7 ; b2 sinistra
BCC no ; R1 < L2 → mancata corrispondenza
LDA $F9 ; b2 destra
CMP $FB ; b1 sinistra
BCC no
LDA $FE ; b1 in basso
CMP $F8 ; b2 in alto
BCC no
LDA $FA ; b2 in basso
CMP $FC ; b1 in alto
BCC no
LDA #$01 ; successo
BNE completato ; incondizionato (A ≠ 0)
no: LDA #$00
completato:
```

**Dimensione:** 30 byte.

**Flusso di lavoro tipico:**

```
; Box dello sprite del giocatore in $FB..$FE
LDA sprite_x ; L
STA $FB
LDA sprite_y ; T
STA $FC
CLC
ADC #23 ; +23 → B (sprite alto 24 pixel)

STA $FE
LDA $FB
CLC
ADC #23 ; R
STA $FD

; Box del nemico in $F7..$FA (popolato in modo simile)
; ...

.box_hit $FB, $F7 ; test giocatore contro nemico → A = 0 o 1

CMP #$01
BNE no_collision
JSR handle_hit
no_collision:
```

**Vincoli:**
- Entrambi gli indirizzi di pagina zero devono essere `≤ $FC` (ogni box
  necessita di 4 byte consecutivi: `zp`, `zp+1`, `zp+2`, `zp+3`).
- Le coordinate vengono trattate come **8 bit senza segno ** (0–255). Per le
  coordinate sprite con segno al di fuori di questo intervallo, normalizzare
  prima di memorizzare.
- I due riquadri possono sovrapporsi nello spazio ZP, se lo si desidera, ma in
  genere si preferiscono 8 byte distinti.

**Perché non una subroutine?** La generazione inline evita l'overhead JSR/RTS
(14+ cicli) e mantiene il test attivo nella cache per cicli di gioco stretti. Se
devi testare molte coppie, inserisci manualmente la tua `sub box_hit_jSR`
attorno a una singola riga BOX_HIT.

**Confronto con la funzione `box_hit()` di UB:** Ultimate Basic incapsula la
stessa logica del 6502 come una funzione runtime che restituisce una variabile.
In VA, si posiziona BOX_HIT in linea dove è necessario il test; il risultato è
in `A`.

---

### INCBIN

Come **BLOAD in BASIC** — preleva un file binario esterno (`.bin`, `.prg`,
`.sid`, `.raw`) e lo incorpora direttamente nel PRG assemblato all'indirizzo
specificato.

| Discussione | Descrizione                                                     |
| ----------- | --------------------------------------------------------------- |
| File        | Sfoglia per selezionare un file `.bin`, `.prg`, `.sid` o `.raw` |
| Indirizzo   | Indirizzo di caricamento di destinazione (ad esempio `$C000`)   |

**Sintassi:**
```
.incbin "music.bin", $C000
```

**Commento del codice generato:**
```
; INCBIN "music.bin" @ $C000 (2048 byte)

.byte $01, $02, ...
```

**Dimensione nel codice:** 0 byte (sezione dati differiti). Il binario è
incorporato all'indirizzo specificato.

---

### KOALA

Carica un'immagine **Koala Painter** (`.koa` / `.kla`, 160×200 multicolore) e la
visualizza. I dati dell'immagine sono incorporati in un indirizzo fisso come
`INCBIN` (l'indirizzo di caricamento del file di 2 byte `$6000` viene rimosso) e
la direttiva stessa viene compilata in una routine di visualizzazione di 86 byte
che viene eseguita nella posizione in cui si trova.

| Discussione | Descrizione                                                                                                                          |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| File        | Sfoglia per selezionare un file `.koa` / `.kla` (10003 byte, o 10001 senza indirizzo di caricamento)                                 |
| Indirizzo   | Indirizzo bitmap: `$6000` (predefinito, nativo Koala, VIC banco 1, RAM schermo `$4400`) o `$2000` (VIC banco 0, RAM schermo `$0400`) |

La routine di visualizzazione copia la parte RAM dello schermo sullo schermo e
la parte RAM del colore in `$D800`, scrive il byte di sfondo in `$D021`,
seleziona il banco VIC in `$DD00` (mantenendo gli altri bit della porta) e
attiva la modalità bitmap multicolore (`$D011 = $3B`, `$D016 = $18`, `$D018 =
$18`). Altri indirizzi vengono rifiutati: gli slot 8K rimanenti si trovano sotto
la ROM BASIC/KERNAL (il ciclo di copia leggerebbe la ROM) o si sovrappongono
all'ombra della ROM dei caratteri.

**Sintassi:**
```
.koala "immagine.koa"
.koala "picture.koa", $ 2000
```

**Esempio: mostra un'immagine e attendi:**
```
* = $0801
.koala "immagine.koa"
attendi:
Attendi JMP
```

**Dimensione nel codice:** 86 byte (routine di visualizzazione); i 10001 byte di
dati dell'immagine vanno all'indirizzo specificato. L'editor Hires di C64 Visual
Assembler esporta un file compatibile.

---

### LIVELLO / LIVELLO_RIGA

Inserisce un progetto **Level Editor** nel tuo programma e copia le righe del
livello in un buffer dello schermo: i blocchi di costruzione di un gioco a
scorrimento. L'esempio `level-demo.asm` di C64 Visual Assembler è un livello
completo a scorrimento tramite joystick.

#### LIVELLO

Una direttiva in stile INCBIN che emette **0 byte di codice**. Solo le schermate
**posizionate** del progetto dell'Editor di Livello (il `.bin` salvato
dall'Editor di Livello di C64 Visual Assembler) vanno in memoria dall'indirizzo
specificato (predefinito `$2000`), in ordine di slot, 2000 byte per schermata
(1000 codici schermata + 1000 colori). Le schermate identiche vengono
memorizzate una sola volta e tutti gli slot vuoti condividono una schermata
vuota. Le tabelle dei puntatori seguono le schermate. Un livello può avere fino
a 7 × 10 schermate.

**Sintassi:**
```
.level "level.bin"
.level "level.bin", $4000
```

| Definizione                                                                   | Senso                                                                                                                                                                                  |
| ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `LIVELLO_SLOT_BASSO` / `LIVELLO_SLOT ALTO`                                    | Indirizzo dello schermo in ogni slot (per riga, `LEVEL_W` slot per riga)                                                                                                               |
| `LIVEL_ROW_SLOT`                                                              | Riga del personaggio di livello → primo slot della sua riga dello schermo                                                                                                              |
| `LIVELLO_RIGA_BASSO/ALTO`, `LIVELLO_RIGA_BASSO/ALTO`                          | Riga del carattere di livello → offset della sua riga di codice schermo / riga di colore all'interno di uno schermo                                                                    |
| `LEVEL_COL_SLOT`, `LEVEL_COL_OFS`                                             | Visualizza la colonna iniziale → colonna dello schermo e colonna all'interno dello schermo                                                                                             |
| `LIVELLO_O`, `LIVELLO_ALTO`                                                   | Livello di dimensione negli schermi                                                                                                                                                    |
| `LEVEL_COLS`, `LEVEL_ROWS`                                                    | Dimensione del livello in caratteri                                                                                                                                                    |
| `LIVELLO_MAX_X`, `LIVELLO_MAX_Y`                                              | Posizione di scorrimento massima in pixel di una vista 40×25                                                                                                                           |
| `LIVEL_BG`, `LIVEL_MC1`, `LIVEL_MC2`, `LIVEL_MULTICOLOR`                      | Sfondo / colori multicolore e modalità del livello                                                                                                                                     |
| `DATI_LIVELLO`, `DIMENSIONE_LIVELLO`, `FINE_LIVELLO`                          | Inizio, dimensione e primo indirizzo libero dopo i dati di livello                                                                                                                     |
| `LIVEL_OBJ_X_LO/HI`, `LIVEL_OBJ_Y_LO/HI`, `LIVEL_OBJ_TYPE`, `LIVEL_OBJ_PARAM` | Tabella degli oggetti (livello oggetti dell'editor di livello): posizione in pixel del livello, tipo e byte del parametro, in ordine di scorrimento — `LEVEL_OBJ_COUNT` voci (max 255) |
| `LEVEL_OBJ_T_START` … `LEVEL_OBJ_T_TRIGGER`                                   | Numeri dei tipi di oggetto: INIZIO 0, NEMICO 1, OGGETTO 2, PORTA 3, USCITA 4, GRILLETTO 5                                                                                              |
| `LIVELLO_INIZIO_X`, `LIVELLO_INIZIO_Y`                                        | Posizione del primo oggetto Start (definita solo se il livello ne possiede uno)                                                                                                        |
| `LEVEL_ATTR`, `LEVEL_ATTR_SOLID` … `LEVEL_ATTR_COLLECT`                       | Tabella degli attributi del personaggio (un byte flag per codice schermo; solo quando il livello ha attributi) e i suoi bit: 1, 2, 4, 8                                                |
| `LIVEL_BORDER`, `LIVEL_SCR_COLORS`, `LIVEL_SCR_BG/BORDER/MC1/MC2`             | Bordo del livello; tabelle dei colori per slot (per riga come `LEVEL_SLOT_*`) quando uno schermo ha i propri colori (`LEVEL_SCR_COLORS` = 1)                                           |

Guardia tipica: `.assert LEVEL_END <= $9200, "i dati di livello vengono eseguiti
nel codice"`.

#### LIVELLO_RIGA

Copia una riga di 40 caratteri del livello in un buffer: la riga del livello in
**X**, a partire dalla colonna del livello contenuta nella variabile `col`, fino
all'indirizzo contenuto nel puntatore `dst` (`dst` / `dst+1`, basso/alto). Con
il terzo argomento `color` copia i colori invece dei codici schermo (per la RAM
dei colori). Una finestra di 40 caratteri che si estende su due schermi viene
gestita con un ciclo di copia auto-modificante (~14 cicli per byte). X viene
mantenuto, A e Y vengono distrutti. Richiede un blocco `.level` nel programma.

**Sintassi:**
```
.level_row dst_lo, view_x
.level_row dst_lo, view_x, color
```

**Dimensione nel codice:** 132 byte — utilizzare `LBEQ` / `LBNE` quando un ramo
deve saltarlo.

---

### SID

Come **BLOAD per la musica** — carica un file `.sid` nel tuo PRG e legge
automaticamente i suoi indirizzi Init e Play dall'intestazione. Chiama Init una
volta all'avvio, quindi chiama Play dal tuo gestore IRQ a ogni frame.

| Discussione                            | Descrizione                                                                                                                                    |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| File                                   | Il file `.sid` (PSID / RSID)                                                                                                                   |
| Indirizzo personalizzato (facoltativo) | Sovrascrivi l'indirizzo di caricamento nativo del SID (ad esempio `$1000`). Lascia vuoto per utilizzare l'indirizzo dall'intestazione del SID. |

L'intestazione SID fornisce:
- **Indirizzo di caricamento** — dove i dati vengono posizionati nella memoria
  (l'indirizzo personalizzato quando ne viene specificato uno)
- **Indirizzo di inizializzazione** — chiama questo con JSR per inizializzare la
  musica (spostato insieme a un indirizzo personalizzato)
- **Riproduci indirizzo** — chiama questo con JSR su ogni frame in un gestore
  IRQ (spostato insieme a un indirizzo personalizzato)

**Sintassi:**
```
.sid "Ikari_Warriors.sid"
.sid "Ikari_Warriors.sid", $1000
```

**Commento del codice generato:**
```
; SID "Ikari_Warriors.sid" @ $1000 Init:$1000 Riproduzione:$1006 (4096 byte)
```

**Dimensione nel codice:** 0 byte in linea. Il binario SID viene posizionato
all'indirizzo specificato come blocco differito nel PRG.

> **Importante:** La maggior parte dei file SID contiene indirizzi assoluti
> interni hardcoded. Possono essere riposizionati solo se l'intero binario viene
> spostato dello stesso offset. Se un SID ha salti interni a `$10xx`, deve
> rimanere a `$1000`: spostarlo a un indirizzo diverso interromperà tali
> riferimenti interni.

> **Uso tipico:** Assegna al SID un indirizzo proprio (`.sid "tune.sid", $1000`)
> quando quello nativo è in conflitto con il tuo codice. Chiama Init una volta
> all'avvio, quindi chiama Play ogni frame da un gestore IRQ raster — oppure
> lascia che [SID_PLAYER](#sid_player) faccia entrambe le cose.

**Etichette:** la direttiva SID definisce `SID_LOAD` (dove vengono posizionati i
dati), `SID_INIT` e `SID_PLAY` (gli indirizzi di inizializzazione e
riproduzione, spostati insieme con un indirizzo personalizzato). `SID_PLAY` è
mancante quando la melodia non ha un indirizzo di riproduzione (un RSID che
installa il proprio IRQ). Usali nel tuo codice, ad esempio `JSR SID_PLAY` in un
gestore IRQ.

---

### SID_PLAYER

Riproduce la melodia della direttiva **SID** con una sola riga: inizializza la
melodia e continua a chiamare la sua routine di riproduzione da un interrupt
raster, in modo che il tuo programma possa proseguire con il proprio lavoro.

| Discussione | Descrizione                                                                              |
| ----------- | ---------------------------------------------------------------------------------------- |
| Canzone     | Numero di sotto-tonalità passato alla routine di inizializzazione in A (predefinito `0`) |
| Raster      | Linea raster dell'interruzione, `$00`–`$FF` (predefinito `$FA`)                          |

Cosa fa: `SEI`, `LDA #song` / `JSR SID_INIT`, disattiva l'IRQ del timer CIA1
(`$DC0D`), imposta il vettore IRQ (`$0314/$0315`) sul suo gestore integrato, la
linea raster (`$D012`, bit 8 di `$D011` azzerato) e l'IRQ raster (`$D01A`),
`CLI`, quindi salta il gestore. Il gestore riconosce l'interruzione (`ASL
$D019`), chiama `JSR SID_PLAY` e passa al KERNAL (`JMP $EA31`, che esegue anche
una scansione della tastiera).

**Sintassi:**
```
.sid "Ikari_Warriors.sid"
.sid_player
.sid_player 1, $80
```

**Dimensione in codice:** 58 byte.

> **Nota:** è necessaria una riga `.sid` nel programma (`SID_INIT` e
> `SID_PLAY`); altrimenti la compilazione si interrompe con un errore. Con l'IRQ
> del timer CIA1 disattivato, il KERNAL viene eseguito una volta per frame
> dall'IRQ raster: la tastiera e `GETIN` continuano a funzionare.

---

### INCLUDERE

Come **MERGE in BASIC** — importa un altro file e lo espande in linea in questa
posizione. Perfetto per librerie di subroutine riutilizzabili.

Sono supportati due tipi di file:
- **Codice sorgente assembly semplice** (`.inc`, `.asm`, `.s`) — il file viene
  letto come codice sorgente VMA. Viene letto nuovamente ad ogni compilazione,
  quindi è possibile modificarlo con qualsiasi editor.
- **Progetto Visual Assembler** (`.json`) — i blocchi di un programma a blocchi
  Visual Assembler per C64.

| Discussione                            | Descrizione                                                                                                                                                                                                                                            |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| File                                   | Un codice sorgente `.inc` / `.asm` / `.s` o un progetto Visual Assembler `.json`                                                                                                                                                                       |
| Indirizzo di caricamento (facoltativo) | Se impostato (esadecimale, ad esempio `C000`), il codice incluso viene posizionato a quell'indirizzo: un `ORG` viene anteposto e gli ORG del file incluso vengono ignorati. Senza di esso, il posizionamento è controllato dagli ORG del file incluso. |

**Sintassi:**
```
.include "library.json"
.include "macros.inc", $1500
.include "sprites.asm"
```

- Assegna all'estensione del file **** un nome semplice come `.include "macros"`
  viene trattato come `.include "macros.json"`.
- Risoluzione del percorso: prima accanto al codice sorgente, poi in ogni
  cartella di ricerca (`--base-dir` / `--search` della CLI); un percorso scritto
  su un'altra macchina viene utilizzato come nome del file. Un file di
  inclusione mancante non è un errore: la compilazione continua anche senza di
  esso.

**Codice generato (nessuna sovrascrittura dell'indirizzo):**
```
; .include "library.json"

... (il codice incluso segue)
```

**Codice generato (con indirizzo di caricamento `C000`):**
```
; .include "library.json" @ $C000

*=$C000

... (segue il codice incluso)
```

> **Suggerimento:** Utilizzare INCLUDE per creare librerie di subroutine
> riutilizzabili che è possibile condividere tra progetti. I file
> `.inc`/`.asm`/`.s` sono ideali quando si desidera modificare la libreria in un
> editor di testo semplice o condividerla con altri assembler 6502; `.json`
> quando la libreria è un programma a blocchi di Visual Assembler. Impostare un
> indirizzo di caricamento quando la libreria non ha un proprio ORG o quando si
> desidera sovrascrivere il suo posizionamento predefinito.

> **2.1:** un'inclusione non trovata è un errore, così come un file che include
> se stesso (direttamente o più in basso). Anche le righe `.include`, `.incbin`
> e `.sid` di un file incluso vengono caricate, rispetto alla sua cartella, e le
> sue chiamate alle macro vengono espanse, fino a 16 livelli di profondità.

---

### TAVOLO

Come **DIM a un indirizzo specifico** — specifica il nome di una tabella di
ricerca e ne definisce la posizione in memoria. Aggiungi le righe `.byte`,
`.word` o `.fill` dopo di essa per definire il contenuto della tabella.

| Discussione | Descrizione                                                             |
| ----------- | ----------------------------------------------------------------------- |
| Nome        | Identificatore dell'etichetta per la tabella (ad esempio `color_table`) |
| Indirizzo   | Indirizzo fisso in cui inizia la tabella (ad esempio `$C000`)           |

**Sintassi:**
```
.tabella color_table $C000
.tabella lookup ; all'indirizzo corrente
```

**Codice generato:**
```
tabella_colori:
```

Con un indirizzo il contatore di programma salta lì; senza un indirizzo la
tabella inizia dall'indirizzo corrente. Aggiungi le righe `.byte` / `.word` /
`.fill` dopo per riempire il contenuto.

**Dimensione:** 0 byte.

---

### ORG

Imposta la posizione in memoria in cui viene inserito il programma (o una sua
sezione), come scegliere un indirizzo di inizio prima di digitare il codice
macchina. Ogni programma necessita di almeno un ORG. L'indirizzo di inizio
standard caricabile in BASIC per C64 è `$0801`.

| Discussione            | Descrizione                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| Indirizzo              | Il nuovo indirizzo di origine (ad esempio `0801` in esadecimale o `2049` in decimale)       |
| ESADECIMALE / DECIMALE | Consente di alternare la visualizzazione dell'indirizzo tra formato esadecimale e decimale. |

**Sintassi:**
```
* = $C000
```

**Codice generato:**
```
* = $C000
```

**Dimensione:** 0 byte. ORG stesso non genera codice macchina.

Ogni ORG inizia una nuova sezione. Le righe successive vengono assemblate a
partire da quell'indirizzo. Il PRG contiene tutte le sezioni in un unico file:
gli spazi tra le sezioni vengono riempiti con zeri.

**Esempio — codice in `$0801`, tabella dati in `$C000`:**
```
* = $0801
LDX #$00
ciclo:

LDA $C000,X

STA $D800,X

INX
Ciclo BNE
RTS

* = $C000
.byte $01, $02, $03, ...
```

> **Suggerimento:** Senza un ORG il programma inizia a `$0801` (2049 decimale),
> l'inizio del BASIC. Con lo stub BASIC SYS (quello predefinito) l'assembler
> inserisce una breve riga `10 SYS…` a `$0801` e il tuo codice inizia a `$080D`.
> Vedi [Output: PRG, stub BASIC e punto di
> ingresso](#3-output-prg-basic-stub-and-entry-point).

---

### CICLO / SUCCESSIVO

Come **`FOR X=N TO 1 STEP -1 : ... : NEXT X`** in BASIC — conta alla rovescia da
N a 1 usando il registro X o Y. Inserisci le tue istruzioni tra LOOP e NEXT e il
ciclo verrà eseguito automaticamente per il numero corretto di volte.

#### CICLO CONTINUO

| Discussione | Descrizione                                                                   |
| ----------- | ----------------------------------------------------------------------------- |
| Registro    | `X` o `Y` — il registro del contatore                                         |
| Contare     | Numero di iterazioni del ciclo (esadecimale o decimale, ad esempio `0A` = 10) |
| Etichetta   | Etichetta del ciclo generata automaticamente (ad esempio `loop0`)             |

**Sintassi:**
```
.ciclo X, 10, ciclo0
```

**Codice generato:**
```
LDX #$0A
loop0:
```

**Dimensione:** 2 byte (codice operativo LD_ + operando immediato).

#### PROSSIMO

| Discussione | Descrizione                                |
| ----------- | ------------------------------------------ |
| Registro    | Abbinamento automatico al registro LOOP    |
| Etichetta   | Collegamento automatico all'etichetta LOOP |

**Sintassi:**
```
.next loop0
```

**Codice generato:**
```
DEX
BNE loop0
```

**Dimensione:** 3 byte (DEX + BNE + offset di diramazione).

**Esempio: cancellare 10 celle dello schermo:**
```
LDX #$0A
loop0:

LDA #$20 ; carattere spazio

STA $0400,X

DEX
BNE loop0
```

---

### PER / FINE

Come **`FOR X=0 TO N-1 : ... : NEXT X`** in BASIC — conta *up* da 0. Ideale
quando è necessario un indice in avanti, ad esempio per scorrere una stringa o
un array.

#### PER

| Discussione | Descrizione                                                                              |
| ----------- | ---------------------------------------------------------------------------------------- |
| Registro    | `X` o `Y` — il registro del contatore                                                    |
| Contare     | Limite del ciclo (esadecimale o decimale, ad esempio `$12` = 18). X/Y va da 0 a limit-1. |
| Etichetta   | Etichetta del ciclo generata automaticamente (ad esempio `for0`)                         |

**Sintassi:**
```
.per X, $12, per0
```

**Codice generato:**
```
LDX #$00
per0:
```

**Dimensione:** 2 byte (LD_ opcode + `#$00`).

#### ENDF

| Discussione | Descrizione                                |
| ----------- | ------------------------------------------ |
| Registro    | Abbinamento automatico al registro FOR     |
| Etichetta   | Collegamento automatico all'etichetta FOR  |
| Contare     | Copiato automaticamente dal FOR accoppiato |

**Sintassi:**
```
.endf per0
```

**Codice generato:**
```
INX
CPX #$12
BNE for0
```

**Dimensione:** 5 byte (IN_ + CP_ #imm + offset BNE).

**Esempio: stampare una stringa terminata da un carattere nullo:**
```
LDX #$00
for0:
LDA msg,X ; msg = stringa PETSCII a indirizzo fisso
BEQ done ; terminatore nullo → esci
JSR $FFD2 ; CHROUT
INX
CPX #$12 ; massimo 18 caratteri
BNE for0
done:

RTS
```

> **LOOP vs FOR:** LOOP conta all'indietro (N→1) — utile per ritardi,
> riempimenti, cicli di pixel. FOR conta in avanti (0→N) — utile per l'accesso a
> stringhe/array. Entrambi possono usare X o Y.

---

### SPINGERE / TIRARE

Come **salvare le variabili prima di un GOSUB e ripristinarle dopo** — ma usa lo
stack hardware del 6502. Se una subroutine usa A, X o Y, racchiuderla in PUSH e
PULL in modo che i registri del codice chiamante vengano preservati.

#### SPINGERE

Inserisce uno o più registri nello stack. L'ordine è sempre A → X → Y (dal più
interno al più esterno).

| Discussione | Descrizione                                                    |
| ----------- | -------------------------------------------------------------- |
| Registri    | Qualsiasi combinazione: `A`, `X`, `Y`, `AX`, `AY`, `XY`, `AXY` |

**Sintassi:**
```
.push AXY
```

**Codice generato (esempio: `AX`):**
```
PHA

TXA

PHA
```

**Dimensione:** 1 byte per A (`PHA`), 2 byte per X o Y (trasferimento + push).

#### TIRO

Ripristina i registri dallo stack in ordine inverso** (Y → X → A).

| Discussione | Descrizione                                               |
| ----------- | --------------------------------------------------------- |
| Registri    | Uguale a PUSH — deve corrispondere al PUSH corrispondente |

**Sintassi:**
```
.tira AXY
```

**Codice generato (esempio: `AX`):**
```
PLA
TASSA
PLA
```

> **Regola:** PUSH e PULL devono sempre utilizzare lo stesso set di registri**.
> `PUSH AX` → `PULL AX` (ripristina internamente in ordine inverso: prima X, poi
> A).

---

### FINE / Alias RTS

Come **RTS con un nome di macro più amichevole** — `.end` emette un singolo byte
`RTS`, un breve terminatore di subroutine.

**Sintassi:**
```
.FINE
```

**Codice generato:**
```
RTS
```

**Dimensione:** 1 byte.

Utilizzate questa opzione quando desiderate un marcatore di fine subroutine che
assomigli più a una macro che a una semplice istruzione.

---

### MACRO / ENDM / INVOKE

Come **un GOSUB denominato con parametri** — definisci un blocco di codice
riutilizzabile una volta (MACRO…ENDM), quindi richiamalo ovunque con INVOKE.
Passa valori di argomento diversi ogni volta invece di copiare e incollare il
codice.

#### MACRO (inizio definizione)

| Discussione | Descrizione                                                                                 |
| ----------- | ------------------------------------------------------------------------------------------- |
| Nome        | Identificatore per la macro (ad esempio `setColor`)                                         |
| Parametri   | Nomi di parametri opzionali separati da virgole (ad esempio `colore` o `colore, conteggio`) |

Segna l'inizio della definizione di una macro. Le righe tra MACRO e ENDM
costituiscono il corpo della macro. Una macro con parametri **non genera
codice** nella posizione della definizione; anche una macro senza parametri
viene assemblata lì come una subroutine (`la chiama il nome JSR`): il flusso del
programma la salta e alla sua fine viene aggiunto un `RTS`. In una libreria
inclusa a un indirizzo fisso, tale macro ottiene anche l'`RTS`. Nel corpo un
parametro è scritto come `{paramName}` o come il suo nome semplice; La chiamata
riempie l'argomento, sia negli operandi delle istruzioni che negli argomenti
delle macro di libreria (`.set_border c`, `.sprite_pos n, x, y` …). Le
etichette, le etichette LOOP e le etichette runtime `.if` / `.while` del corpo
sono univoche per ogni chiamata. Una chiamata di macro all'interno del corpo di
una macro non viene espansa (viene generato un errore).

**Codice generato:**
```
; .MACRO setColor (colore)

... (corpo)
; .ENDM
```

**Sintassi:**
```
.macro setColor color

LDA {color}

STA $D020
.endm
```

#### ENDM (fine della definizione)

Chiude la definizione della macro corrente. Nessun argomento.

#### INVOCARE

Richiama una macro definita in questa posizione e sostituisce i valori degli
argomenti forniti ai segnaposto `{paramName}` nel corpo.

| Discussione    | Descrizione                                                                                                           |
| -------------- | --------------------------------------------------------------------------------------------------------------------- |
| Nome Macro     | Una macro definita nel programma o in un file incluso                                                                 |
| Argomentazioni | Valori degli argomenti separati da virgole che corrispondono all'elenco dei parametri della macro (ad esempio `#$07`) |

**Codice generato:**
```
; .invoca setColor(#$07)
    LDA #$07
    STA$D020
```

**Sintassi:**
```
; argomento singolo:
.invoke setColor(#$07)

; argomenti multipli:
.invoke drawPixel($10, $20)

; nessun argomento:
.invoke clearScreen

; argomenti di testo/stringa (tra virgolette):
.invoke printText("Hello, World!")

; alias .call (sinonimo di .invoke):
.call setColor(#$07)
```

Il corpo della macro viene espanso in linea con `{paramName}` sostituito dagli
argomenti effettivi. È accettata anche la forma separata da spazi (`.invoke
setColor #$07`).

**Tipi di argomenti:**
- **Numerico**: `#$07`, `$10`, `255` — valori esadecimali o decimali
- **Stringhe di testo**: `"Ciao, mondo!"` — stringhe tra virgolette (le
  virgolette vengono rimosse); le virgole all'interno delle virgolette vengono
  trattate come parte del testo, non come separatori di argomenti
- **Letterale di carattere**: `'A'` — rimane un letterale di carattere, quindi
  il corpo ottiene il suo codice (`$41`)
- **Misto**: `#$07, "ciao", $20` — qualsiasi combinazione

> **Suggerimento:** Definisci le macro all'inizio (o alla fine) del tuo
> programma, quindi INVOCALE ovunque sia necessario. Le macro possono essere
> invocate più volte con argomenti diversi.

> **2.1:** una macro può chiamare un'altra macro (`both(a, b)` chiamando
> `setc(a)`); la chiamata interna ottiene gli argomenti della chiamata esterna e
> le proprie etichette locali univoche. Una macro che chiama se stessa si
> arresta con un errore dopo 16 livelli invece di bloccarsi.

---

### REGIONE / ENDREGIONE

Semplicemente un raggruppamento per editor e liste — **zero byte**, nessun
effetto sul codice assemblato.

| Discussione        | Descrizione                                                                               |
| ------------------ | ----------------------------------------------------------------------------------------- |
| Nome della regione | Etichetta di testo libero per la sezione (ad esempio `init`, `game_loop`, `sprite_setup`) |

**Sintassi:**
```
.region init

; codice...
endregion
```

**Codice generato:**
```
; regione init
    SEI
    LDA #$00
    STA$D020
; regione finale init
```

**Dimensione:** 0 byte sia per REGION che per ENDREGION.

> **Nota:** Le regioni possono essere **annidate** l'una dentro l'altra. Ogni
> ENDREGION chiude la REGION aperta più vicina. Nessun effetto sull'output
> assemblato.

---

### DEFINISCI / SE / ALTRIMENTI / FINE SE

Come **un interruttore, l'assembler legge ** — `DEFINE DEBUG` attiva un simbolo,
quindi le righe di qualsiasi `IF DEBUG` vengono assemblate e il suo ramo `ELSE`
viene saltato. Rimuovi DEFINE e la parte IF scompare dall'output. Non è
necessario eliminare il codice per le build di rilascio.

#### DEFINIRE

| Discussione | Descrizione                                                                                  |
| ----------- | -------------------------------------------------------------------------------------------- |
| Simbolo     | Uno o più identificatori separati da virgole da attivare (ad esempio `DEBUG` o `DEBUG, PAL`) |

**Sintassi:**
```
.define DEBUG, PAL
```

**Codice generato:**
```
; .DEFINE DEBUG
; .DEFINE DEBUG, PAL
```

Un `DEFINE` può attivare più simboli contemporaneamente (separati da virgole).
Posiziona le direttive DEFINE all'inizio del programma.

#### SE

| Discussione | Descrizione                                                                                                                           |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Condizione  | Un simbolo `.define`d (attivo), un nome `.const` (attivo quando diverso da zero) o un'espressione costante (`LEVEL == 2`, `MODE & 1`) |

**Sintassi:**
```
.if DEBUG
```

**Codice generato:**
```
; .SE DEBUG
```

Le righe tra `IF` e `ENDIF` (o `ELSE`) vengono assemblate o saltate dalla
condizione. Un nome semplice è vero quando è `.define`d o un `.const` diverso da
zero, falso quando non è nessuno dei due; qualsiasi altra condizione deve essere
un'espressione costante: una che non può essere valutata in fase di assemblaggio
è un errore. Le righe saltate appaiono come commenti `; [IF saltato] …` e
generano **zero byte**.

#### ALTRO

Nessun argomento. Contrassegna il ramo alternativo — assemblato quando la
condizione `IF` non è *attiva.

**Sintassi:**
```
.altro
```

**Codice generato:**
```
; .ALTRO
```

#### ENDIF

Nessun argomento. Chiude la parte condizionale.

**Sintassi:**
```
.endif
```

**Codice generato:**
```
; .ENDIF
```

**Dimensione:** 0 byte per tutte e quattro le direttive. Solo il contenuto *tra*
esse conta.

**Esempio: il bordo di debug lampeggia, la build di rilascio lo salta:**
```
; .DEFINE DEBUG

; .IF DEBUG
LDA #$02 ; bordo rosso
STA $D020
; .ELSE
LDA #$00 ; nero (rilascio)
STA $D020
; .ENDIF
```

**Esempio: simboli multipli in uno DEFINIZIONE:**
```
; .DEFINE DEBUG, PAL

; .IF PAL
LDA #$xx ; Costante di temporizzazione PAL
; .ELSE
LDA #$xx ; Costante di temporizzazione NTSC
; .ENDIF
```

Sono supportati gli IF` annidati. Se una parte esterna viene saltata, anche
quelle interne vengono saltate.

> **Nota:** Questa è la gestione delle condizioni in fase di compilazione. Per
> la gestione delle diramazioni/confronti in fase di esecuzione, vedere **IF /
> ELSE / ENDIF in fase di esecuzione** di seguito.

### .ASSERT

Un controllo di integrità in fase di compilazione ****.`.assert` valuta
un'espressione durante l'assemblaggio; se è falsa (`0`), la compilazione si
interrompe con un errore chiaro che include il valore effettivo. Se è vera
(diversa da zero), non emette nulla.

| Discussione | Descrizione                                                                                                                                  |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Espressione | Qualsiasi espressione assembler: etichette, `CONST`, `*` (contatore di programma), aritmetica e confronti (`<`, `<=`, `>`, `>=`, `==`, `!=`) |
| Messaggio   | Testo facoltativo aggiunto all'errore di errore                                                                                              |

**Sintassi:**
```
.assert spriteData < $C000
.assert * < $A000
.assert end - start <= 256, "la tabella degli sprite ha superato una pagina"
```

**Comportamento:**

- **Dimensione:** 0 byte.
- Un'asserzione errata interrompe l'assemblaggio: `` `.assert end - start <=
  256` è falso (valore: 0). La tabella degli sprite ha superato una pagina ``
- Anche un'asserzione che non può essere valutata (etichetta non definita, ecc.)
  fallisce, con *"non può essere valutata in fase di assemblaggio"*.
- I confronti restituiscono `1` / `0`; posiziona `.assert` ovunque nel flusso
  del programma: viene controllato all'indirizzo in cui si trova, quindi
  `.assert * < $D000` verifica la posizione di output corrente.

**Esempio: proteggere i dati dello sprite dal passaggio di pagina:**
```
* = $3000
sprite_data:

.byte $00, $00, $00 ; … 63 byte …
sprite_data_end:

.assert sprite_data_end - sprite_data == 63, "lo sprite deve essere esattamente di 63 byte"

.assert (sprite_data % 64) == 0, "lo sprite deve essere allineato a 64 byte"
```

---

### COST

Come **una variabile denominata che non cambia mai** — `SCREEN = $0400`. Usa il
nome invece di digitare indirizzi grezzi ovunque, rendendo il codice più facile
da leggere e modificare in seguito.

| Discussione | Descrizione                                                                                                                              |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Nome        | Identificatore per la costante (ad esempio `SCREEN`)                                                                                     |
| Valore      | Valore numerico nella base selezionata (ad esempio `0400` in esadecimale = indirizzo $0400) o un'espressione relativa al PC (vedi sotto) |
| Formato     | ESA o DEC — controlla come viene inserito e visualizzato il valore                                                                       |

**Sintassi:**
```
.const SCREEN = $0400
.const FRAMES_1S = 60
```

**Codice generato:**
```
; .CONST SCREEN = $0400
```

**Espressioni relative al PC (`*+N` / `*-N`):**

Il valore accetta anche `*+N` o `*-N`, dove `*` è l'indirizzo della riga
`.const` stessa. Questo viene utilizzato per creare un alias denominato per un
byte all'interno di un'istruzione vicina: il classico schema di codice
automodificante:

```
.const op = *+1 ; op → indirizzo dell'operando immediato del successivo LDA
LDA #$00 ; $00 verrà modificato in fase di esecuzione
...
STA op ; sovrascrive il byte #$00 → LDA leggerà il nuovo valore la prossima volta
```

La costante emette 0 byte; l'etichetta si risolve in fase di compilazione in
`indirizzo_corrente + 1`.

**Espressioni aritmetiche:**

Il valore accetta operazioni aritmetiche generiche, inclusi riferimenti a nomi
CONST definiti in precedenza, letterali esadecimali/binari e funzioni
matematiche integrate:

```
.const SCREEN = $0400
.const SCREEN_END = SCREEN + 40*25 ; 1000 byte dopo
.const COLOR_RAM = $D800
.const MID_X = 160
.const SIN_TABLE = round(sin(PI/8) * 127) ; valore del seno precalcolato
```

**Funzioni integrate:** `sin()`, `cos()`, `round()`, `max(a,b)`, `min(a,b)`,
`abs()`, costante `PI`

Operatori: `+ - * /` Letterali: `$FF` (esadecimale), `%10110000` (binario) Byte
basso/alto: `lo(expr)`, `hi(expr)`

**Dimensione:** 0 byte.

---

### VAR

Come **CONST, ma allocato automaticamente ** — `VAR` riserva spazio di memoria a
pagina zero per un'etichetta senza che tu debba digitare l'indirizzo. Usalo per
contatori, puntatori e stati di breve durata che appartengono a ZP.

| Discussione          | Descrizione                                                |
| -------------------- | ---------------------------------------------------------- |
| Nome                 | Nome/etichetta della variabile                             |
| Taglia (facoltativa) | Numero di byte da riservare. Omettere per un singolo byte. |

**Sintassi:**
```
contatore .var
.var timer, 2
.var vive
```

**Esempio pratico:**
```
.regione Vars
contatore .var
.var timer, 2
.endregion

LDA #$00
Contatore STA
```

**Codice generato:**
```
; .var contatore
```

**Dimensione:** 1 byte per impostazione predefinita, oppure `N` byte quando la
dimensione è specificata.

L'allocatore percorre un cursore di pagina zero configurabile (`$02` a `$FE`) e
assegna il primo slot libero. Se la regione richiesta si sovrappone a
un'etichetta già utilizzata, il compilatore emette un avviso.

---

### Runtime IF / ELSE / ENDIF

Come un vero modello di diramazione, questa versione funziona in fase di
esecuzione, non in fase di compilazione. Confronta A, X o Y con un valore
immediato ed emette la corretta sequenza di diramazione CMP / CPX / CPY + per
te.

| Discussione | Descrizione                           |
| ----------- | ------------------------------------- |
| Registro    | `A`, `X` o `Y`                        |
| Operatore   | `==`, `!=`, `<`, `<=`, `>`, `>=`      |
| Valore      | Valore immediato in formato HEX o DEC |

**Sintassi:**
```
.if A == #$10

LDA #$07
.else

LDA #$0F
endif
```

**Dimensioni:** Dipende dai rami scelti e dal modulo di confronto.

Il confronto è senza segno per impostazione predefinita. Per `<=` e `>` la macro
si espande nella catena di diramazioni equivalente più breve per il registro
selezionato.

---

### MENTRE / FINE

Come **un ciclo di runtime con un test in cima** — il corpo viene eseguito
finché la condizione rimane vera.

| Discussione | Descrizione                           |
| ----------- | ------------------------------------- |
| Registro    | `A`, `X` o `Y`                        |
| Operatore   | `==`, `!=`, `<`, `<=`, `>`, `>=`      |
| Valore      | Valore immediato in formato HEX o DEC |

**Sintassi:**
```
.mentre A != #$00

JSR getchar
.endw
```

**Dimensioni:** Dipende dal corpo del ciclo e dalla forma di confronto.

Utilizzare `WHILE` quando il ciclo potrebbe terminare prima della fine della
prima iterazione. È la controparte in fase di esecuzione dell'helper `LOOP /
NEXT` basato sul conteggio.

---

### RIPETI / FINO A

Come **un ciclo di runtime con un test in fondo** — il corpo viene sempre
eseguito almeno una volta, poi la condizione decide se fermarsi.

| Discussione | Descrizione                           |
| ----------- | ------------------------------------- |
| Registro    | `A`, `X` o `Y`                        |
| Operatore   | `==`, `!=`, `<`, `<=`, `>`, `>=`      |
| Valore      | Valore immediato in formato HEX o DEC |

**Sintassi:**
```
.repeat
JSR getchar
.until A == #$00
```

**Dimensioni:** Dipende dal corpo del ciclo e dalla forma di confronto.

Utilizza `REPEAT / UNTIL` quando desideri che il corpo venga eseguito almeno una
volta prima del controllo di uscita.

---

### MEMCPY / MEMSET

Come le **piccole routine di memoria a cui fai ricorso costantemente** —
`MEMCPY` copia un blocco contiguo, `MEMSET` riempie un intervallo con un byte.

| Macro    | Argomentazioni                      |
| -------- | ----------------------------------- |
| `MEMCPY` | `src`, `dst`, `size`                |
| `MEMSET` | `indirizzo`, `valore`, `dimensione` |

**Sintassi:**
```
.memcpy src=$C000, dst=$D000, size=$0100
.memset addr=$0400, value=#$20, size=$03E8
```

**Codice generato:** cicli di copia/riempimento in linea, scelti per
corrispondere alla dimensione richiesta.

Per dimensioni fino a 256 byte viene utilizzato un breve ciclo a 8 bit. Per
dimensioni maggiori, il passaggio a un contatore a 16 bit avviene
automaticamente.

> **2.1:** La dimensione deve essere nota quando il codice viene impaginato: un
> numero o una costante. Un'etichetta definita successivamente (il cui valore
> non è ancora noto al layout) è un errore anziché un codice che non si adatta
> al suo posto.

---

### STAMPA / STAMPA_CARATTERE / STAMPA_ESAGENICO / CANCELLA_SCHERMO / ATTENDI_TASTO / RITARDO / IMPOSTA_BORDO / IMPOSTA_SFONDO

#### STAMPA

Come l'output **PETSCII senza il boilerplate** — stampa una stringa tramite
`CHROUT` con la stessa gestione delle maiuscole/minuscole (`lower`) di
`.petscii`.

**Sintassi:**
```
.print "CIAO"
.print "ciao", minuscolo
```

#### PRINT_CHAR

Stampa un byte PETSCII tramite codice numerico e lo invia tramite `CHROUT`. Il
valore può anche essere una costante denominata o un'etichetta che si risolve in
un byte in fase di assemblaggio.

**Sintassi:**
```
.print_char 65
.print_char $41
.print_char colore
```

#### STAMPA_ESATTEZZA

Stampa un valore a 8 bit come testo esadecimale attraverso il normale percorso
di output del KERNAL.

**Sintassi:**
```
.print_hex A
```

#### SCHERMO CHIARO

Scorciatoia per il codice di controllo standard per cancellare lo schermo del
C64.

**Sintassi:**
```
.clear_screen
```

#### WAIT_KEY

Attende che venga premuto un tasto, così non è necessario eseguire manualmente
il ciclo `GETIN` ogni volta.

**Sintassi:**
```
.wait_key
```

#### RITARDO

Attende il numero di fotogrammi richiesto tramite una routine di supporto
condivisa. Utilizzare questa opzione per brevi pause e intervalli di
temporizzazione quando un ciclo personalizzato completo sarebbe eccessivo. Il
conteggio dei fotogrammi può essere un numero grezzo o una costante denominata,
e `.wait` è semplicemente un alias di `.delay`.

**Sintassi:**
```
.ritardo 29
.attesa 29
.ritardo frame=FRAMES_1S
```

#### IMPOSTA_BORDO / IMPOSTA_BORDO

Funzioni di convenienza per i registri colore del VIC-II. Il valore del colore
può essere un numero grezzo o una costante denominata che restituisce un valore
compreso tra 0 e 15.

**Sintassi:**
```
.set_border 6
.set_bg 0
.set_border color
.set_bg color
```

**Dimensione:** Ogni helper si espande in una piccola sequenza di scrittura di
registro o in una breve chiamata KERNAL.

---

### IRQ_SETUP

Configura un gestore IRQ raster in un solo passaggio. La macro scrive il vettore
IRQ, abilita gli IRQ raster, imposta la riga, disabilita le sorgenti IRQ CIA
comuni e ritorna all'esecuzione normale con `CLI`.

| Discussione | Descrizione                                                       |
| ----------- | ----------------------------------------------------------------- |
| Manutentore | Etichetta della routine IRQ (ad esempio `my_irq`)                 |
| Raster      | Linea raster in formato esadecimale o decimale (ad esempio `$FA`) |

**Sintassi:**
```
.irq_setup handler=my_irq, raster=$FA
```

**Dimensioni:** Una piccola sequenza di configurazione; la lunghezza esatta
dipende dalla linea raster selezionata.

Utilizza questa opzione quando desideri il codice standard "SEI / installa
gestore / abilita IRQ / CLI" senza doverlo disperdere nel programma.

---

### RAND

Come **un piccolo PRNG integrato** — restituisce un valore pseudo-casuale a 8
bit da un seme compatto a pagina zero.

| Discussione | Descrizione                                                           |
| ----------- | --------------------------------------------------------------------- |
| Seme        | Byte o etichetta di seed di pagina zero opzionale (predefinito `$FB`) |

**Sintassi:**
```
.random
```

**Dimensione:** Una manciata di byte, a seconda del percorso di implementazione
scelto.

Il generatore è pensato per il gameplay, la variazione degli effetti e la
raccolta rapida di dati di test. È volutamente di dimensioni ridotte, piuttosto
che dotato di sofisticate funzionalità crittografiche.

---

<a id="sprite_init"></a>
### SPRITE_INIT

Configura uno sprite VIC-II in una sola riga, invece di scrivere circa 6
istruzioni POKE in BASIC. Imposta il puntatore dati dello sprite, lo attiva,
abilita facoltativamente la modalità multicolore e ne imposta il colore.

| Discussione | Descrizione                                                                   |
| ----------- | ----------------------------------------------------------------------------- |
| Sprite #    | Numero dello sprite 0–7                                                       |
| Colore      | Indice di colore 0–15 (tavolozza C64)                                         |
| Pagina dati | Indirizzo dati sprite / 64 (ad esempio `$21` se i dati si trovano in `$0840`) |
| Multicolore | Attiva/disattiva il bit multicolore dello sprite (`$D01C`)                    |

**Sintassi:**
```
.sprite_init 0, 7, $21
.sprite_init 0, 7, $21, multicolore
.sprite_init 0, 7, $21, monocromatico
```

**Codice generato:**
```
LDA #$21

STA $07F8 ; registro puntatore sprite ($07F8 + N)

LDA $D015

ORA #$01 ; imposta il bit di abilitazione per lo sprite 0

STA $D015

LDA $D01C

AND #$FE ; azzera il bit multicolore per lo sprite 0

STA $D01C

LDA #$07

STA $D027 ; registro colore sprite 0
```

**Dimensione:** 26 byte.

> **Pagina dati sprite:** `indirizzo_dati ÷ 64`. Con lo stub BASIC SYS
> predefinito, `ALIGN 64` dopo `JMP main` posiziona i dati sprite a `$0840` →
> pagina = `$21`.

---

<a id="sprite_pos"></a>
### SPRITE_POS

Come **`POKE 53248, x : POKE 53249, y`** in BASIC — imposta la posizione
iniziale di uno sprite. Le coordinate vengono incorporate in fase di
assemblaggio e accettano costanti; per l'animazione utilizzare `INC`/`DEC`
direttamente sul registro dello sprite.

| Discussione | Descrizione                 |
| ----------- | --------------------------- |
| Sprite #    | Numero dello sprite 0–7     |
| X           | Posizione orizzontale 0–319 |
| Y           | Posizione verticale 0–255   |

**Sintassi:**
```
.sprite_pos 0, 152, 100
```

**Codice generato (esempio: sprite 0, X=152, Y=100):**
```
LDA #$98 ; byte basso di X

STA $D000 ; registro X dello sprite 0

LDA $D010

AND #$FE ; azzera il bit più significativo di X per lo sprite 0 (X ≤ 255)

STA $D010

LDA #$64 ; Y = 100

STA $D001 ; registro Y dello sprite 0
```

Per X > 255 la macro imposta il bit corrispondente in `$D010` invece di
azzerarlo.

**Dimensione:** 18 byte.

> **Nota:** `SPRITE_POS` inserisce le coordinate X/Y nel codice (`LDA #$xx`).
> Per animare uno sprite in fase di esecuzione, utilizzare `INC $D000` / `DEC
> $D000` — vedere l'esempio `sprite-macro-demo`.

---

<a id="wait_raster"></a>
### WAIT_RASTER

Attende che il fascio di elettroni del VIC-II raggiunga una specifica linea di
scansione, come per sincronizzarsi con un fotogramma televisivo. Posizionalo
all'inizio del ciclo di gioco per evitare il tearing degli sprite. Nessun JSR,
nessuna etichetta necessaria.

| Discussione  | Descrizione                                                             |
| ------------ | ----------------------------------------------------------------------- |
| Linea raster | Riga raster di destinazione in esadecimale (ad esempio `FF` = riga 255) |

**Sintassi:**
```
.wait_raster $FF
```

**Codice generato:**
```
Attendi:

LDA $D012 ; riga raster corrente

CMP #$FF ; riga di destinazione

BNE attendi ; ciclo di ritorno (-7 byte)
```

**Dimensione:** 7 byte (l'offset `BNE` `$F9` = −7 punta sempre all'`LDA`).

> **Suggerimento:** Posiziona `WAIT_RASTER` all'inizio del ciclo di gioco per
> sincronizzarlo con il display e prevenire lo strappo degli sprite.

---

### JOYSTICK

Come leggere **`PEEK($DC00)`** e poi POKE la posizione dello sprite, ma in una
sola riga. Legge una porta joystick CIA e regola di conseguenza i registri X/Y
di uno sprite. Interamente in linea, non è necessario JSR.

| Discussione | Descrizione                                                                            |
| ----------- | -------------------------------------------------------------------------------------- |
| Porta       | `1` = porta 1 (`$DC01`) oppure `2` = porta 2 (`$DC00`)                                 |
| Sprite #    | Numero dello sprite da 0 a 7 (controlla quale coppia di registri X/Y viene aggiornata) |

**Sintassi:**
```
joystick 2, 0
```

**Codice generato (porta 2, sprite 0):**
```
LDA $DC00 ; lettura porta CIA 2

LSR ; bit 0 → riporto (su)

BCS skip_up ; riporto impostato = NON premuto

DEC $D001 ; Y−1 (spostamento verso l'alto)
skip_up:

LSR ; bit 1 → riporto (giù)

BCS skip_down

INC $D001 ; Y+1 (spostamento verso il basso)
skip_down:

LSR ; bit 2 → riporto (sinistra)

BCS skip_left

DEC $D000 ; X−1 (spostamento verso sinistra)
skip_left:

LSR ; bit 3 → riporto (destra)

BCS skip_right

INC $D000 ; X+1 (spostamento verso destra)
skip_right:
```

**Mappa dei bit del joystick (attivo-BASSO - bit = 0 significa premuto):**

| Morso | Direzione | registro della CIA                |
| ----- | --------- | --------------------------------- |
| 0     | Su        | $DC00 (porta 2) / $DC01 (porta 1) |
| 1     | Giù       |                                   |
| 2     | Sinistra  |                                   |
| 3     | Giusto    |                                   |
| 4     | Fuoco     | (non gestito da questa macro)     |

**Dimensione:** 27 byte. L'offset `BCS` è sempre `+3` (salta la successiva
istruzione abs`DEC`/`INC da 3 byte).

**Modalità variabile — `.porta joystick, vx, vy[, fuoco]`:** invece di muovere
uno sprite, la direzione viene scritta nelle variabili: `vx` / `vy` = `-1` / `0`
/ `+1` (`$FF` / `$00` / `$01`), e l'opzionale `fuoco` = `1` mentre il pulsante è
premuto, `0` altrimenti. Usalo per una telecamera scorrevole, un giocatore con
la propria fisica o menu. La porta `3` legge entrambe le porte joystick
contemporaneamente (`LDA $DC00` / `AND $DC01`), quindi entrambe le porte
funzionano.

```
.joystick 2, vx, vy; 35 byte
.joystick 3, vx, vy, fire; entrambe le porte + fire: 45 byte
```

> **Uso tipico:** Inserire all'interno di un'etichetta `gameloop` con
> `WAIT_RASTER` per primo:
> ```
> ciclo di gioco:
> 
> WAIT_RASTER ($FF)
> 
> JOYSTICK (porta=2, sprite=0)
> Ciclo di gioco JMP
> ```

---

<a id="mouse"></a>

> **2.1:** la porta deve essere nota quando il codice viene impostato (un numero
> o una costante), perché la porta 3 rende il codice più lungo di 3 byte;
> un'etichetta definita successivamente è un errore.
### TOPO

Legge un mouse proporzionale Commodore 1351 e muove uno sprite. Interamente
**inline** — non sono necessari JSR o etichette. La macro seleziona la porta
CIA, attende che gli input del paddle SID si stabilizzino, quindi decodifica il
movimento delta utilizzando lo schema standard del driver 1351 e lo applica ai
registri dello sprite.

| Discussione | Descrizione                                                                                        |
| ----------- | -------------------------------------------------------------------------------------------------- |
| Porta       | `1` = CIA `$DC00` bit `7:6` = `%01`; `2` = `%10`                                                   |
| Sprite #    | Numero dello sprite 0–7                                                                            |
| ZP byte X   | Indirizzo di pagina zero (esadecimale) per contenere il precedente campione POTX (ad esempio `FD`) |
| ZP byte Y   | Indirizzo di pagina zero (esadecimale) per contenere il precedente campione POTY (ad esempio `FE`) |

**Forma del codice generato (porta 1, sprite 0, ZP `$FD`/`$FE`):**

```
; CIA port select + settlement
LDA $DC00
AND #$3F

ORA #$40
STA $DC00
LDX #$67
wait:

DEX
BNE wait

; Asse X — decodifica delta standard a 7 bit in stile 1351
LDA $D419
TAY
SEC
SBC $FD
AND #$7F
LDX #$00
CMP #$40
BCS xneg
LSR A
BEQ xdone
STY $FD
CLC
ADC $D000
STA $D000
TXA
ADC #$00
AND #$01
BEQ xdone
LDA $D010
EOR #$01
STA $D010
JMP xdone
xneg:

ORA #$C0
CMP #$FF
BEQ xdone
SEC
ROR
DEX
STY $FD
CLC
ADC $D000
STA $D000
TXA
ADC #$00
AND #$01
BEQ xdone
LDA $D010
EOR #$01
STA $D010
xdone:

; Asse Y — stessa decodifica, poi invertito prima dell'applicazione
LDA $D41A
TAX
SEC
SBC $FE
AND #$7F
CMP #$40
BCS yneg
LSR A
BEQ ydone
STX $FE
EOR #$FF
SEC
ADC $D001
STA $D001
JMP ydone
yneg:

ORA #$C0
CMP #$FF
BEQ ydone
SEC
ROR
STX $FE
EOR #$FF
SEC
ADC $D001
STA $D001
ydone:
```

**Dimensione:** 142 byte.

**Sintassi:**
```
.mouse porta, spriteNum, zpX, zpY
; esempio:
.mouse 2, 0, FD, FE
```

> **Importante:** Prima della prima chiamata, inizializzare i byte della pagina
> zero con i valori POTX/POTY correnti per evitare un salto nel primo frame:
> ```
> Porta 1: LDA $DC00 : AND #$3F : ORA #$40 : STA $DC00
> 
> Porta 2: LDA $DC00 : AND #$3F : ORA #$80 : STA $DC00
> 
> LDA $D419 : LSR A : AND #$3F : STA $FD
> 
> LDA $D41A : LSR A : AND #$3F : STA $FE
> ```

> **Suggerimento:** Esegui il polling del mouse una volta per frame: posiziona
> `WAIT_RASTER` nel ciclo di gioco prima di `MOUSE`.

---

<a id="sprite_col"></a>
### SPRITE_COL

Come **`PEEK($D01E)`** in BASIC: controlla i registri di collisione hardware del
VIC-II e ti dice se uno sprite ha colpito un altro sprite o lo sfondo.
Interamente inline, non è necessario JSR.

| Discussione        | Descrizione                                                                                                             |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| Sprite #           | Numero dello sprite 0–7 (quale bit dello sprite controllare)                                                            |
| Tipo di collisione | `Sprite-Sprite ($D01E)` — collisione con un altro sprite; `Sprite-Sfondo ($D01F)` — collisione con la grafica di sfondo |

**Sintassi:**
```
.sprite_col 0, sprite
.sprite_col 0, sfondo
```

**Codice generato (sprite 0, sprite–sprite):**
```
LDA $D01E ; legge il registro delle collisioni sprite-sprite (lo azzera!)

AND #$01 ; isola il bit 0 (sprite 0)

; A ≠ 0 → si è verificata una collisione
```

**Dimensione:** 5 byte.

> **Importante:** La lettura di `$D01E`/`$D01F` **azzera il registro**. Leggilo
> una volta per frame e agisci immediatamente sul risultato con `BEQ`/`BNE`.

**Uso tipico:**
```
ciclo di gioco:

.wait_raster $FF

.joystick 2, 0

.sprite_col 0, sprite
BEQ no_hit ; A = 0 → nessuna collisione

LDA #$02

STA $D020 ; bordo rosso = colpo!
JMP ciclo di gioco
no_hit:

LDA #$0E

STA $D020 ; bordo azzurro = trasparente
JMP ciclo di gioco
```

> **Vedi anche:** `esempio di dimostrazione di collisione` — palla verde (sprite
> n. 0) contro croce rossa (sprite n. 1).

---

### CARICAMENTO DEL FILE

Come **`LOAD "file",8`** in BASIC — carica un file da un disco D64 in fase di
esecuzione utilizzando la routine KERNAL LOAD. Usalo per caricare dati, musica o
codice aggiuntivo dal disco mentre il tuo programma è in esecuzione.

| Discussione                         | Descrizione                                                                                                                                                                                                                                     |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nome file                           | Nome del file sul disco (max 16 caratteri, maiuscolo automatico; i caratteri `,`, `"`, `/`, `\`, `:`, `*`, `?`, `<`, `>`, `|` vengono filtrati)                                                                                                 |
| Dispositivo                         | Numero del dispositivo 8–30 (predefinito `8`)                                                                                                                                                                                                   |
| Indirizzo di override (facoltativo) | Indirizzo di caricamento esadecimale (ad esempio `C000`). Se impostato, il file viene caricato a questo indirizzo (`sec=0`, ignorando l'intestazione PRG). Lasciare vuoto per utilizzare l'intestazione PRG a 2 byte del file stesso (`sec=1`). |
| Etichetta di errore (facoltativa)   | Se impostato, dopo JSR LOAD viene generata un'istruzione `BCS`. Se il KERNAL restituisce con carry impostato (errore), l'esecuzione salta a questa etichetta.                                                                                   |

**Sintassi:**
```
.loadfile "DEMO-COLORS", 8
.loadfile "DEMO-COLORS", 8, $C000
.loadfile "DEMO-COLORS", 8, $C000, error_label
```

**Struttura del codice generato:**
```
JMP skip_filename; salta il nome del file inline
.byte "DEMO-COLORS"; byte del nome del file (PETSCII, 11 caratteri)
skip_filename:

LDA #11; lunghezza del nome del file

LDX #<fname; puntatore lo

LDY #>fname; puntatore hi

JSR $FFBD; SETNAM

LDA #1; file logico #1

LDX #8; dispositivo 8

LDY #0; sec=0 (indirizzo di override) o #1 (indirizzo del file stesso)

JSR $FFBA; SETLFS

LDA #0; comando LOAD (non VERIFY)

JSR $FFD5; LOAD
BCS fail; (solo se è impostata l'etichetta di errore)
```

**Dimensione:** `3 + lunghezza_nome_file + 9 (SETNAM) + 9 (SETLFS) + (4 se
sovrascrivi) + 5 (LOAD) + (2 se etichetta di errore)` byte. Minimo 27 byte.

> **Importante:** Il nome del file viene memorizzato in linea nel codice
> macchina subito dopo un `JMP skip_filename`. Il nome del file sul disco deve
> essere PETSCII in maiuscolo, che corrisponde alle normali lettere maiuscole
> ASCII (`A`–`Z`). La macro impone automaticamente questa condizione.

> **Utilizzare sempre un'etichetta di errore** per i programmi di produzione: se
> il file non viene trovato, KERNAL imposta il flag di riporto e l'esecuzione
> passa a ciò che è successivo.

> **Vedi anche:** `esempio loadfile-demo` — dimostra il caricamento di
> `DEMO-COLORS.PRG` da un D64 con un ramo di errore BCS e una schermata di
> errore visiva.

---

### ESODECRO

Decompressione Exomizer in-program ** **. Utilizzare questa macro subito dopo un
`LOADFILE ` che ha caricato un flusso compresso in modalità `mem ` di Exomizer:
EXODECRUNCH lo decomprime all'indietro nell'indirizzo incorporato nel flusso.

| Discussione                  | Descrizione                                                                                                                          |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Indirizzo del disimballatore | Indirizzo in cui risiede il codice del decompressore in memoria (predefinito `B000`). Deve essere un indirizzo esadecimale a 16 bit. |

**Sintassi:**
```
.exodecrunch
.exodecrunch depacker=$B000
```

**Codice generato (19 byte):**
```
LDA $AE ; fine caricamento KERNAL lo (impostato dal precedente LOAD)

STA $04 ; puntatore src-end del depacker lo

LDA $AF ; fine caricamento KERNAL hi

STA $05 ; puntatore src-end del depacker hi

LDA #$36 ; ROM BASIC disattivata ($A000-$BFFF diventa RAM)

STA $01
Depacker JSR ; il depacker legge da dietro a davanti tramite $04/$05

LDA #$37 ; ripristina la mappatura predefinita (BASIC + KERNAL + I/O)

STA $01
```

**Come funziona:**

1. KERNAL `LOAD` ($FFD5) aggiorna ZP `$AE/$AF` al punto successivo all'ultimo
   byte caricato. EXODECRUNCH copia questo in ZP `$04/$05`, che è la convenzione
   ufficiale Exomizer per la fine del codice sorgente all'indietro.
2. Il depacker è tipicamente posizionato in `$B000` (all'interno della regione
   mappata della ROM BASIC). La macro commuta `$01 = $36` in modo che la CPU
   veda la RAM lì durante il JSR, quindi ripristina `$01 = $37` in seguito.
3. L'indirizzo di destinazione della decompressione è **codificato nel flusso
   compresso stesso** quando si comprime con `exomizer mem -l <carica>
   file,<destinazione>` — il depacker lo legge dai primi byte del flusso.

**Depacker binario:** il depacker precompilato all'indietro è `exo-decrunch.bin`
(nella cartella `samples/` di C64 Visual Assembler) (477 byte, ORG $B000). È un
wrap di Kick Assembler dell'ufficiale `exodecrunch.asm` con `INC $D020` aggiunto
ad ogni lettura per un effetto di lampeggio del bordo visibile durante la
decompressione. Inseriscilo nel tuo programma con `.incbin` all'indirizzo del
depacker.

**Input raw:** l'extra viene passato a Exomizer come file raw caricato
all'indirizzo Dst (`file@<Dst>`), quindi il decompressore scrive ogni byte, a
partire dal primo, esattamente all'indirizzo che hai digitato.

> **Vedi anche:** l'esempio `exo-multicolor-demo` — esempio completo end-to-end:
> LOADFILE una bitmap multicolore compressa in $C000, EXODECRUNCH la decomprime
> in $2000, quindi copia lo schermo → $0400 e il colore → $D800 e passa VIC-II
> alla modalità bitmap multicolore.

---

### REU_CHECK

Rileva se è collegata un'unità di espansione RAM Commodore (REU), come
controllare `PEEK($D010)` per verificare la presenza dell'hardware. Esegue i
test scrivendo e leggendo due pattern nel registro REU `$DF04`.

| Discussione | Descrizione     |
| ----------- | --------------- |
| Nessuno     | Nessun operando |

**Codice generato (34 byte):**
```
LDA #$55
STA$DF04
LDA$DF04
CMP #$55
BNE fallisce
LDA #$AA
STA$DF04
LDA$DF04
CMP #$AA
BNE fallisce
LDA #$00
CMP #$FF ; Z=0 => REU presente
BNE fatto
fallire:
LDA #$FF
CMP #$FF ; Z=1 => nessuna REU
Fatto:
```
> La macro normalizza il risultato in modo che il ramo seguente rimanga
> semplice: `BNE` significa REU presente, `BEQ` significa REU mancante.

**Sintassi:**
```
.reu_check
```

**Risultato in flag:**
- **Z = 0** (risultato ≠ 0) → REU presente → usa `BNE`
- **Z = 1** (risultato = 0) → nessuna REU → utilizza `BEQ`

**Nessun argomento** — la macro genera sempre lo stesso codice.

**Uso tipico:**
```assembly
.reu_check
BEQ no_reu ; saltare se REU non è presente
; ...Codice REU qui...
no_reu:
```

---

### REU_STASH / REU_FETCH / REU_SWAP

Trasferimento di blocchi DMA tra la RAM del C64 e la memoria di espansione REU:
è come un ciclo POKE molto veloce, ma la CPU non esegue alcuna operazione (il
chip REU copia i dati mentre la CPU è ferma). Un trasferimento di 1000 byte è
praticamente istantaneo.

| Macro       | Direzione     | `$DF01` comando |
| ----------- | ------------- | --------------- |
| `REU_STASH` | RAM C64 → REU | `$90`           |
| `REU_FETCH` | REU → RAM C64 | `$91`           |
| `REU_SWAP`  | RAM C64 ↔ REU | `$92`           |

**Argomenti:**

| Discussione   | Descrizione                                          | Esempio |
| ------------- | ---------------------------------------------------- | ------- |
| Indirizzo C64 | Origine/destinazione nella RAM del C64 (esadecimale) | `C000`  |
| indirizzo REU | Origine/destinazione in REU (esadecimale, 16 bit)    | `0000`  |
| banca REU     | Banca di memoria REU (0–7)                           | `0`     |
| Lunghezza     | Numero di byte da trasferire (esadecimale, 16 bit)   | `1000`  |

**Sintassi:**
```
.reu_stash $C000, $0000, 0, $1000
.reu_fetch $C000, $0000, 0, $1000
.reu_swap $C000, $0000, 0, $1000
```

**Codice generato (40 byte):**
```
LDA #c64lo STA $DF02 ; indirizzo C64 LO
LDA #c64hi STA $DF03 ; indirizzo C64 HI
LDA #reuLo STA $DF04 ; indirizzo REU LO
LDA #reuHi STA $DF05 ; indirizzo REU HI
LDA #bank STA $DF06 ; banco REU
LDA #lenLo STA $DF07 ; lunghezza LO
LDA #lenHi STA $DF08 ; lunghezza HI
LDA #$00 STA $DF09 ; controllo indirizzo (fisso)
LDA #$00 STA $DF0A ; maschera di interruzione (fissa)
LDA #cmd STA $DF01 ; esegui DMA ($90/$91/$92 = stash/fetch/swap, immediato)
```

> **Nota:** I comandi utilizzano `$90/$91/$92` (bit 4 impostato = modalità DMA
> immediata). La scrittura su `$DF01` avvia il trasferimento; la CPU riprende
> quando è terminato.

---

### TURBO_SET

Imposta la velocità della CPU **Ultimate-64 (U64)** tramite il registro `$D031`.
Nessun effetto su un vero C64 o altri emulatori.

**Argomenti:**

| Discussione      | Descrizione                  | Allineare                                            |
| ---------------- | ---------------------------- | ---------------------------------------------------- |
| Velocità         | Indice di velocità della CPU | 0 = 1 MHz … 7 ≈ 10 MHz … 15 ≈ 48 MHz                 |
| Linea del sedere | Emulazione Badline           | Attivato (compatibile con C64) / Disattivato (turbo) |

Il byte della velocità viene calcolato come: `(speedIndex & 0x0F) |
(badline_disabled ? 0x80 : 0x00)`.

**Codice generato (5 byte):**
```
A9 xx LDA #speed_byte
8D31D0STA$D031
```

**Sintassi:**
```
.turbo_set 7,0 ; velocità=7 (~10 MHz), badline abilitato
.turbo_set 15,1 ; velocità=15 (~48 MHz), badline disabilitato
```

> **Nota:** Questa macro influisce solo sull'hardware U64. Su un vero C64 o su
> altri emulatori, scrive in `$D031`, il che potrebbe influire sul CIA o essere
> ignorato.

---

### SUPERCPU_DETECT

Controlla se è installato un acceleratore **CMD SuperCPU** — come `PEEK($D0B8)`
per vedere se restituisce qualcosa di diverso da `$FF`.

**Codice generato (5 byte):**
```
AD B8 D0 LDA $D0B8
C9 FF CMP #$FF
```

**Risultato in flag:**
- **Z = 0** → SuperCPU presente → usa `BNE`
- **Z = 1** → SuperCPU non trovato → usa `BEQ`

**Nessun argomento.**

**Sintassi:**
```
.supercpu_detect
```

**Uso tipico:**
```assembly
.supercpu_detect
BEQ no_scpu ; salta se SuperCPU non è presente
; ... Codice turbo di SuperCPU qui ...
no_scpu:
```

---

### TURBO_ABILITA

Attiva o disattiva la modalità turbo **CMD SuperCPU**. Chiama prima
`SUPERCPU_DETECT` e salta questo passaggio se la SuperCPU non è presente.

| Modalità   | Registro | Effetto                                               |
| ---------- | -------- | ----------------------------------------------------- |
| Abilitare  | `$D07A`  | Attiva la modalità turbo (fino a 20 MHz con SuperCPU) |
| Disabilita | `$D07B`  | Ritorno alla modalità di compatibilità a 1 MHz        |

**Codice generato (5 byte):**
```
A9 00 LDA #$00
8D 7A D0 STA $D07A ; (o $D07B per disabilitare)
```

**Sintassi:**
```
.turbo_enable attivo
.turbo_enable disattivato
```

> **Nota:** Chiamare prima `SUPERCPU_DETECT` e saltare questa macro se la
> SuperCPU non è presente.

---

<a id="map_copy"></a>
### COPIA_MAPPA

Copia una tilemap da un indirizzo sorgente alla RAM dello schermo (e
opzionalmente alla RAM dei colori) utilizzando una serie di cicli `LDA abs,X` /
`STA abs,X`. Una pagina da 256 byte viene copiata per ogni iterazione del ciclo;
una pagina parziale alla fine utilizza `CPX #rem / BNE` per interrompere. Non è
necessario JSR: tutto il codice viene generato inline.

| Discussione                  | Descrizione                                                                                                                                                                                                                                                                                           |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Indirizzo sorgente (schermo) | Indirizzo esadecimale in cui risiedono i dati della mappa dopo il caricamento (ad esempio `C000`)                                                                                                                                                                                                     |
| Schermo RAM dest             | Dove copiare i codici dello schermo (ad esempio `0400`)                                                                                                                                                                                                                                               |
| Dimensione (byte)            | Numero totale di byte da copiare — in genere `$03E8` = 1000 (40×25 caratteri)                                                                                                                                                                                                                         |
| Fonte di colore              | `auto`: i dati del colore seguono i codici schermo (`sorgente + dimensione`); oppure un indirizzo sorgente colore esplicito. I dati del colore vengono copiati nella destinazione RAM del colore in un secondo passaggio. Ometterlo (e la destinazione del colore) per copiare solo i codici schermo. |
| Colore RAM dest              | Destinazione per i dati colore — predefinita `D800` (RAM colore C64)                                                                                                                                                                                                                                  |

**Codice generato (mappa da 1000 byte, solo schermo):**
```
LDX #$00

LDA $C000,X ; pagina 0

STA $0400,X

INX

BNE *-9 ; ciclo fino a quando X non torna a 0 (256 iterazioni)

LDA $C100,X ; pagina 1

STA $0500,X

INX

BNE *-9

LDA $C200,X ; pagina 2

STA $0600,X

INX

BNE *-9

LDA $C300,X ; resto — 232 byte

STA $0700,X

INX

CPX #$E8

BNE *-11
```

**Dimensioni:** `2 (LDX) + fullPages×9 + (rem > 0 ? 11 : 0)` byte per sezione.
La modalità combinata lo raddoppia (sezione schermo + sezione colore identica).

**Associazione con l'editor di mappe:**

L'editor di mappe dell'assembler visuale C64 (**Salva mappa + RAM colore**)
esporta un singolo binario in cui i primi `size` byte sono codici schermo e i
successivi `size` byte sono valori RAM colore. Utilizzare `.map_copy` con `auto`
come sorgente colore e l'indirizzo sorgente in cui viene caricato questo file
(ad esempio con `.incbin` a `$C000`):

```
.incbin "map-color.bin", $C000 ; codici schermo $C000–$C3E7, colore $C3E8–$C7CF

...

.map_copy $C000, $0400, 1000, auto, $D800
```

**Sintassi:**
```
.map_copy $C000, $0400, 1000 ; solo schermo
.map_copy $C000, $0400, 1000, auto, $D800 ; combinato (colore a src+dimensione)
.map_copy $C000, $0400, 1000, $C3E8, $D800 ; indirizzo sorgente colore esplicito
```

---

<a id="map_copy16x16"></a>
### MAP_COPY16X16

Copia un'area di caratteri 16×16 da un blocco di codice schermo compatto da 256
byte, più un blocco RAM Colore corrispondente da 256 byte. È pensato per le
esportazioni Charset Canvas e per piccoli blocchi di tile/immagini, dove la
scrittura di sedici righe separate di MAP_COPY risulterebbe eccessiva.

**Layout predefinito:**

| Dati                           | Indirizzo predefinito       |
| ------------------------------ | --------------------------- |
| Codici schermo 16×16           | Indirizzo sorgente (`src`)  |
| Valori di colore 16×16         | `src + 256`                 |
| Destinazione RAM dello schermo | `$0400 + riga×40 + colonna` |
| Destinazione RAM a colori      | `$D800 + riga×40 + colonna` |

**Sintassi:**
```
.map_copy16x16 $3000, 12, 4
.map_copy16x16 $3000, 12, 4, $0400, $3100, $D800
```

La forma abbreviata copia i byte dello schermo da `$3000`, i byte del colore da
`$3100` e posiziona il blocco 16×16 nella colonna 12, riga 4. Le posizioni
valide in alto a sinistra sono `col = 0..24` e `row = 0..9`, quindi l'intera
area 16×16 rimane sullo schermo di testo 40×25 del C64.

**Comportamento generato:**

- Genera sedici copie di righe in linea.
- Ogni riga copia 16 byte dello schermo e 16 byte del colore.
- Non è necessario alcun JSR; il codice viene emesso direttamente nella
  posizione della macro.
- Funziona sia con la modalità caratteri normale che con la modalità caratteri
  multicolore; i byte della RAM Colore contengono il bit di abilitazione del
  colore del carattere/multicolore di ciascuna cella.

Abbinamento tipico con Charset Canvas:

```
* = $ 0801
    SEI
    LDA #$00
    STA$D021
    LDA #$05
    STA$D022
    LDA #$0D
    STA$D023
    .map_copy16x16 $ 3000, 12, 4
ciclo continuo:
    Ciclo JMP

.incbin "16x16+ram+color.bin", $ 3000
.incbin "16x16+charset.bin", $2000
```

---

<a id="sprite_anim"></a>
### SPRITE_ANIM

Avanza il frame di animazione di uno sprite a ogni chiamata e aggiorna il
puntatore ai dati dello sprite VIC-II. Memorizza un byte per frame in una
tabella (il numero della pagina dei dati dello sprite = `indirizzo_dati / 64`),
punta SPRITE_ANIM a tale tabella e chiamala una volta per frame di gioco, senza
bisogno di JSR.

| Discussione                     | Descrizione                                                                                                    |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Sprite #                        | Numero dello sprite 0–7                                                                                        |
| Indirizzo dell'elenco dei frame | Indirizzo esadecimale della tabella dei frame: un byte per frame, ogni byte = pagina sprite (`data_addr / 64`) |
| Conteggio dei fotogrammi        | Numero totale di fotogrammi (1–255)                                                                            |
| Telaio ZP                       | Byte di pagina zero utilizzato come contatore di frame (ad esempio `FB`)                                       |

**Codice generato (sprite 0, 4 fotogrammi, ZP `$FB`, elenco a `$C100`):**
```
INC $FB ; incrementa il contatore dei frame

LDA $FB

CMP #$04 ; conteggio dei frame

BCC *+6 ; se il contatore è inferiore al conteggio, salta il reset

LDA #$00

STA $FB

TAX ; X = indice del frame corrente

LDA $C100,X ; carica la pagina dati dello sprite per questo frame

STA $07F8 ; aggiorna il puntatore dello sprite 0 ($07F8 + sprite#)
```

**Dimensione:** 19 byte.

**Uso tipico:**
```
Tabella dei frame:

.byte $21, $22, $23, $24; 4 frame a $0840, $0880, $08C0, $0900

Ciclo di gioco:

.wait_raster $FF

.sprite_anim 0, $C100, 4, $FB
Ciclo di gioco JMP
```

**Sintassi:**
```
.sprite_anim spriteNum, frameListAddr, frameCount, zpByte
; esempio:
.sprite_anim 0, C100, 4, FB
```

> **Suggerimento:** Posiziona la tabella dei frame con `.rawbytes` a un
> indirizzo fisso. Il byte ZP del contatore (`$FB`) deve essere inizializzato a
> `$00` prima della prima chiamata. Se il tuo codice utilizza `$FB` per
> qualcos'altro, scegli una posizione ZP libera.

---

<a id="score_bcd"></a>
### PUNTEGGIO_BCD

Aggiunge un valore a virgola fissa a un punteggio BCD multibyte memorizzato in
memoria, quindi visualizza ogni cifra nella RAM dello schermo come carattere di
codice schermo. Utilizza la modalità decimale 6502 (`SED`/`CLD`) per
l'aritmetica BCD sicura al riporto: non è necessario alcun riporto manuale.

| Discussione             | Descrizione                                                                                                                |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Indirizzo del punteggio | Indirizzo esadecimale dei byte del punteggio BCD (ad esempio `C200`). Il byte meno significativo inizia per primo.         |
| Cifre                   | Numero di byte BCD (ogni byte contiene due cifre: `$99` = "99"). `4` byte = fino a 99999999.                               |
| Aggiungi punti          | Valore decimale da aggiungere per ogni chiamata (ad esempio `100`).                                                        |
| Indirizzo dello schermo | Dove scrivere i codici numerici dello schermo (ad esempio `0400`). Un byte per cifra (nibble più significativo per primo). |

**Sintassi:**
```
.score_bcd $C200, 4, 100, $0400
```

**Codice generato (4 byte, +100 punti, punteggio a `$C200`, schermo a
`$0400`):**
```
SED ; abilita la modalità BCD/decimale

CLC

LDA $C200 ; byte 0 (cifre 1-2)

ADC #$00 ; byte basso di 100 in BCD = $00

STA $C200

LDA $C201 ; byte 1 (cifre 3-4)

ADC #$01 ; byte centrale di 100 in BCD = $01 (il riporto si propaga)

STA $C201

LDA $C202

ADC #$00

STA $C202

LDA $C203

ADC #$00

STA $C203

CLD ; torna alla modalità binaria

; visualizza le cifre

LDX #$00
ciclo cifre:

LDA $C200,X

PHA

LSR : LSR : LSR : LSR ; nibble alto → nibble basso

ORA #$30 ; + codice schermo '0'

STA $0406,X ; allineato a destra: screen_addr + (digits*2 - 2) - X*2


E #$0F ; nibble basso

ORA #$30

STA $0407,X

INX

CPX #$04

BNE digit_loop
```

**Dimensione:** `3 + cifre×8` byte (overhead SED + CLC + CLD + 8 byte per byte
BCD per ADC + ciclo di visualizzazione).

**Sintassi:**
```
.score_bcd $C200, 4, 100, $0400
```

> **Suggerimento:** Inizializza i byte del punteggio a `$00` all'avvio.
> L'indirizzo del punteggio dovrebbe trovarsi nella pagina zero o nella RAM
> assoluta, non nella ROM. L'indirizzo dello schermo dovrebbe puntare alla cella
> della cifra più a sinistra; le cifre vengono scritte da sinistra a destra (il
> byte più significativo per primo).

> **Intervallo BCD:** `cifre=4` byte → 8 cifre decimali → punteggio massimo
> 99.999.999. Ogni byte codifica due cifre BCD: `$00`–`$99`.

---

## 7. Sintassi in stile KickAssembly

VMA legge anche i formati comuni di KickAssembler, quindi un codice sorgente
KickAssembler spesso viene compilato così com'è:

- `.pc = $1000` e `*=$1000 "nome"` imposta l'indirizzo (il nome del segmento
  viene ignorato).
- `.const NOME = valore` e `.etichetta NOME = valore` definiscono costanti;
  `.etichetta NOME = *`, `.etichetta NOME = * + 1` posiziona un'etichetta
  all'indirizzo corrente (o nelle sue vicinanze).
- `.macro name(p1, p2) { … }` — un corpo di macro tra parentesi graffe, oltre a
  `.macro … .endm`; `:name(args)` e `name(args)` lo chiamano.
- `nome: { … }` ambiti: le etichette all'interno sono locali a `nome`
  (`nome.etichetta` dall'esterno).
- Le etichette `@label` mantengono le loro `@`.
- `.text "…"` senza coordinate dello schermo memorizza i byte codificati come
  `.byte`. Diversi elementi possono essere uniti con `,` o `+`: `"…"`, `@"…"`
  con le sequenze di escape `\n` `\r` `\t` `\$NN` e `$NN` / byte decimali.
  `.encoding "name"` seleziona la codifica delle seguenti righe `.text`:
  `screencode_mixed` (predefinito), `screencode_upper`, `petscii_mixed`,
  `petscii_upper`, `ascii`; un carattere per cui la codifica non ha un codice è
  un errore.
- I suffissi mnemonici `.abs` / `.a` e `.zp` / `.z` forzano l'indirizzamento
  assoluto o a pagina zero: `sta.abs $00FC,x`, `ldx.zp ptr,y`.
- `// …` commenti.

Il resto del linguaggio KickAssembler (`.for`, `.var` / `.eval`, `.function`,
`.pseudocommand`, `#import`, `#if`, `LoadBinary`, segmenti …) è gestito dal
preprocessore Kick di C64 Visual Assembler, che trasforma un albero sorgente
KickAssembler in testo VMA.

## 8. Riga di comando

Novità nella versione 2.1.0: `--crt` / `--crt-name` (cartuccia) e `--d64` /
`--add` / `--disk-name` (immagine disco).

```
vma build <input.asm> [opzioni]
vma --help
vma --version
```

| Opzione                       | Senso                                                                                                                                                                                                                                                                |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-o FILE`                     | Il file PRG da scrivere (predefinito: l'input con estensione `.prg`)                                                                                                                                                                                                 |
| `--directory-base DIR`        | Dove vengono cercati per primi i file `.incbin` / `.koala` / `.level` / `.sid` / `.include` (impostazione predefinita: la cartella di input)                                                                                                                         |
| `--ricerca DIR`               | Dopo la directory principale, c'è un'ulteriore cartella da controllare (ripetibile, in ordine); un percorso scritto su un'altra macchina viene automaticamente riportato al nome del file.                                                                           |
| `--no-basic-stub`             | Nessuna riga `10 SYS…` BASIC davanti al codice                                                                                                                                                                                                                       |
| `--raw`                       | L'immagine da sola al suo primo ORG: nessun stub, nessun spostamento a `$C000`                                                                                                                                                                                       |
| `--crt FILE`                  | Una cartuccia Magic Desk (tipo CRT 19, 8 banchi da 8K, al massimo 65.408 byte): un caricatore copia il programma al suo indirizzo di caricamento e lo avvia all'indirizzo SYS — il CRT di compilazione del Visual Assembler. Senza `-o` non viene scritto alcun PRG. |
| `--crt-name NOME`             | Il nome della cartuccia nell'intestazione CRT (predefinito: `VA CART`)                                                                                                                                                                                               |
| `--d64 [FILE]`                | Un'immagine disco 1541 con il PRG al suo interno, denominata come il PRG (FILE predefinito: il PRG con estensione `.d64`); non è necessario c1541. Senza `-o` non viene scritto alcun PRG.                                                                           |
| `--aggiungi FILE`             | Un ulteriore file sul disco così com'è (un PRG con il suo indirizzo di caricamento), denominato come il file (ripetibile, in ordine)                                                                                                                                 |
| `--nome-disco NOME`           | Nome del disco (predefinito: nome del file del D64; ID `01`)                                                                                                                                                                                                         |
| `--sym FILE`                  | File di etichette KickAssembler (`.label NAME=$xxxx`)                                                                                                                                                                                                                |
| `--vs FILE`                   | File di etichette del monitor VICE (`al C:xxxx .NAME`; `x64sc -moncommands FILE`)                                                                                                                                                                                    |
| `--dbg FILE`                  | Mappa sorgente (XML) di RetroDebugger / C64 Debugger                                                                                                                                                                                                                 |
| `--debug`                     | Tutti e tre accanto al PRG (`out.sym`, `out.vs`, `out.dbg`)                                                                                                                                                                                                          |
| `--file json`                 | La costruzione come JSON: PRG, indirizzo SYS, simboli, linee disposte, segmenti scritti, vista della memoria — o ogni errore con la sua riga                                                                                                                         |
| `--nome percorso sorgente`    | La fonte principale dei nomi `.dbg` (predefinito: l'input)                                                                                                                                                                                                           |
| `--file della mappa di linea` | Array JSON: riga di input → la riga i nomi `.dbg`                                                                                                                                                                                                                    |

Stato di uscita: `0` compilato, `1` errore di compilazione (`FILE:LINE:
messaggio` sull'errore standard, una riga per errore), `2` utilizzo errato.

```
vma build game.asm -o game.prg --debug
vma build game.asm --no-basic-stub --search ../assets
vma build game.asm --crt game.crt # solo la cartuccia
vma build game.asm --d64 --add music.prg # game.d64 con GAME e MUSIC
```

## 9. Limitazioni note

VMA riproduce il compilatore Visual Assembler del C64 byte per byte, comprese le
sue imperfezioni:

- `lda.zp c` → `LDA $0C`: con `.zp` un simbolo composto da cifre esadecimali
  viene letto come un numero.
- Il corpo di una macro senza parametri viene assemblato anche nel punto in cui
  è definita; una definizione prima del primo `* =` si trova all'inizio del
  programma.
- `.text X, Y, "s", 80` analizza l'offset del carattere ma non lo utilizza.
- I byte di `.chardef` sono esadecimali (`129` = `$129`, un errore).
- L'operando non immediato di un runtime `.if` / `.while` / `.until` viene letto
  come un indirizzo: `%bin` è un errore e `10` è esadecimale (`$0010`).
- La routine di supporto DELAY va dopo l'ultima riga del layout e ogni sezione
  dati, anche per un DELAY saltato (`.if 0`).

Corretto nella versione 2.1 (prima davano un codice errato o fallivano): un
operando `.const` / `.var` nella pagina zero, `JMP (etichetta)`, `lda $1234+1`,
una chiamata macro all'interno di una macro, un valore TURBO_SET / SPRITE_ANIM
non risolto (ora un errore), etichette nei byte di `.data` / `.rawbytes`,
un'etichetta `:name` il cui target è un'etichetta, la dimensione di JOYSTICK /
MEMCPY / MEMSET da un'etichetta successiva (ora un errore), il buffer automatico
di `.data` / `.rawbytes` e gli include (un elemento mancante è un errore,
vengono caricati gli stessi `.include` / `.incbin` / `.sid` del file incluso).
