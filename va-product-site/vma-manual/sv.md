# VMA — Visuell makroassembler

**Språkmanual · version 2.1.0**

VMA är assemblern 6502/6510 för [C64 Visual
Assembler](https://github.com/zstarczali/VisualAssembler) — språket för dess
expertläge och för den text som dess blockprogram är skrivna i. Den här manualen
beskriver språket; editorn, blockpaletten och appens andra verktyg finns i
manualen för C64 Visual Assembler.

## Innehåll

1. [Källformat](#1-source-format)
2. [Siffror och uttryck](#2-numbers-and-expressions)
3. [Utdata: PRG, BASIC-stub och
   startpunkt](#3-output-prg-basic-stub-and-entry-point)
4. [Adresseringslägen](#4-addressing-modes)
5. [6502 instruktioner](#5-6502-instructions)
6. [Direktiv och makron — referens](#6-directives-and-macros--reference)
7. [Syntax i KickAssembler-stil](#7-kickassembler-style-syntax)
8. [Kommandoraden](#8-command-line)
9. [Kända begränsningar](#9-known-limitations)

---

## 1. Källformat

En VMA-källa är vanlig text, en sats per rad. Versaler och gemener spelar ingen
roll för mnemonik och direktiv (`lda`, `LDA`, `.BYTE`, `.byte`); etikettnamn är
skiftlägeskänsliga.

```
; en kommentar — så är // en kommentar
* = $1000 ; ORG: assemble from $1000
start: ; en etikett (kolon krävs)
lda #$06 ; en instruktion: mnemonisk och operand
sta $D020
.byte $01, $02, $FF ; ett direktiv börjar med en punkt
loop: dex ; en etikett och en instruktion på en rad
bne loop
rts
```

- **Kommentarer** börjar med `;` eller `//` och fortsätter till slutet av raden
  (inte inom en citationsteckensträng).
- **Etiketter** skrivs som `namn:` — bokstäver, siffror och `_`, som inte börjar
  med en siffra. En etikett kan stå på en egen rad eller framför en instruktion.
  Ett namn som börjar med en punkt (`.loop:`) är en **lokal etikett** (se
  [Lokala (punktade) etiketter](#local-dotted-labels)); `-` och `+` är i sig
  själva **anonyma etiketter**, refererade av `bne -` / `beq +` (närmaste före /
  efter).
- **Instruktioner** är en mnemonisk metod och en operand; indenteringen är fri.
- **Direktiv** börjar med en punkt (`.byte`, `.macro`, `.if` …); `* = $xxxx`
  (eller `.pc = $xxxx`) anger adressen.
- **Användarmakron** anropas som `:namn(args)`, `.anropnamn(args)`,
  `.anropnamn(args)` eller `namn(args)`.

## 2. Tal och uttryck

| Form             | Exempel        | Värde                                                                          |
| ---------------- | -------------- | ------------------------------------------------------------------------------ |
| Hexadecimal      | `$D020`, `$0F` | `$`-prefix                                                                     |
| Binär            | `%00001111`    | `%` prefix                                                                     |
| Decimal          | `255`, `40*25` | inget prefix                                                                   |
| Karaktär         | `'A'`          | dess kod (`$41`)                                                               |
| Nuvarande adress | `*`            | radens adress (se [Programräknaren `*`](#the--program-counter-in-expressions)) |

I instruktionsoperander skrivs hexadecimala tal med `$`. I adressargumenten för
biblioteksmakron (`.rawbytes C000, …`, `.sprite_init 0, 1, 80`) läses ett enkelt
tal på en till fyra siffror som hexadecimal.

**Operatorer** (i operander, `.const`, `.fill`, `.assert`, `.if`): `+ - * / %`,
`& | ^ ~`, `<< >>`, parenteser, `<expr` (låg byte) och `>expr` (hög byte), och
under villkor `== != < > <= >=` (sant = 1, falskt = 0). `.fill`, `.const` och
liknande känner också till `lo()`, `hi()`, `sin()`, `cos()`, `round()`, `min()`,
`max()`, `abs()` och `PI`.

```
.const B = 7 lda #(B+1)*2 lda #B & 3 | 8 lda #~B & $FF ldx #'A' lda #<skärm; låg byte för en etikett
lda #>(*+63); hög byte för en PC-relativ adress
```

## 3. Utdata: PRG, BASIC-stub och ingångspunkt

VMA skriver en C64 **PRG**: en tvåbyte lång laddningsadress följt av
minnesavbildningen. Varje ORG-sektion och varje direktiv som placerar data på en
egen adress (`.rawbytes`, `.incbin`, `.sid` …) hamnar i en avbildning;
mellanrummen mellan dem är nollor.

- Utan en ORG** börjar programmet vid `$0801`, där BASIC börjar.
- **BASIC SYS stub** (standard): en `10 SYS nnnn`-rad placeras vid `$0801`, så
  programmet startar med `RUN`. Ett program vars första ORG är `$0801` startar
  sedan vid `$080D`. Stäng av stubben med `--no-basic-stub`; utan den monteras
  ett program vid `$0801` till `$C000`, alla andra stannar vid sin första ORG.
- **Ingångspunkt:** SYS-raden hoppar till början av koden, eller till adressen
  som anges i en kommentar på första raden `; Ingångspunkt: $1234`.
- **Kod under BASIC-raden** (en ORG lägre än `$0801` tillsammans med stubben):
  en liten laddare startar programmet och flyttar det på plats, så det startar
  fortfarande med `RUN`.
- En källa som börjar med sin egen BASIC SYS-rad (`.byte $0B, $08, $0A, $00,
  $9E, …` vid `$0801`) genereras som den är, utan en andra stub.

Från PRG skapar kommandoraden även en **kassett** och en **diskavbildning**
(nytt i 2.1.0, se [8. Kommandorad](#8-command-line)):

- `--crt FIL` — en Magic Desk-kassett (CRT-typ 19, 8 × 8K banker, högst 65 408
  byte program). En laddare i bank 0 initierar KERNAL, kör en kopieringsrutin
  från RAM vid `$0100–$013B` som flyttar programmet till dess laddningsadress
  (växlar banker via `$DE00`), stänger av kassetten och hoppar till
  startpunkten. Håll programmet borta från `$0100–$013B` och de noll sidbyte
  `$02–$04` / `$FB–$FE` som laddaren använder.
- `--d64 [FIL]` — en 1541-diskavbildning (35 spår) med PRG uppkallad efter sig,
  plus `--add`-filerna, utformade som 1541 DOS skriver dem; ingen c1541 behövs.

---

## 4. Adresseringslägen

Varje 6502-instruktion stöder ett eller flera adresseringslägen. VMA väljer
läget utifrån hur operanden är skriven.

| Läge              | Märka           | Exempel         | Beskrivning                                                             |
| ----------------- | --------------- | --------------- | ----------------------------------------------------------------------- |
| **underförstått** | Underförstådd   | `NOP`           | Ingen operand; instruktionen är fristående                              |
| **omedelbart**    | Omedelbar       | `LDA #$FF`      | Inline-konstant; assemblern lägger till `#` automatiskt                 |
| **nollSida**      | Noll sida       | `LDA 10 dollar` | Enkelbyteadress på sidan noll (0–255)                                   |
| **nollSidaX**     | Noll sida, X    | `LDA $10,X`     | Noll sidadress + X-registerförskjutning (resultatet omsluter sidan 0)   |
| **nollSidaY**     | Noll sida, Y    | `LDX $FB,Y`     | Noll sidadress + Y-registerförskjutning                                 |
| **absolut**       | Absolut         | `LDA $0400`     | Fullständig 16-bitars minnesadress                                      |
| **absolutX**      | Absolut, X      | `LDA $0400,X`   | 16-bitars adress + X-registerförskjutning                               |
| **absolutY**      | Absolut, Y      | `LDA $0400,Y`   | 16-bitars adress + Y-registerförskjutning                               |
| **släkting**      | Relativ/Etikett | `BNE-slinga`    | För instruktioner för filialen; ange ett etikettnamn eller en måladress |
| **indirektX**     | Indirekt, X     | `LDA ($FB,X)`   | Noll sidindexerad indirekt (operand = noll sidadress, 1 byte)           |
| **indirektY**     | Indirekt, Y     | `LDA ($FB),Y`   | Noll sid indirekt indexerad (operand = noll sidadress, 1 byte)          |
| **indirekt**      | Indirekt        | `JMP ($0100)`   | Indirekt; endast användbar med JMP                                      |

### Konstanter på nollsidan

En operand som endast består av konstanter (`.const`, `name = value`, a `.var`)
som får plats i en byte tar instruktionens **zero-page**-läge, precis som talet
skulle göra: efter `.const zp = $FB`, assembleras `lda zp` till `A5 FB` (2 byte,
3 cykler) och `lda zp,x` till `B5 FB`. Ett läge där instruktionen inte har någon
sidnollfönster förblir absolut (`lda zp,y` → `B9 FB 00`). En etikett är inte
begränsad — dess adress är känd endast efter layouten — och `lda.abs zp` tvingar
fram det absoluta läget. Ett tal behåller den bredd det skrivs med: `$FB` är
sidnollfönster, `$00FB` absolut. *(Nytt i 2.1.)*

### Märk uttryck som operander

Alla operander som accepterar en adress eller ett omedelbart värde accepterar
också en **konstant name** (en `.const` eller en label) direkt. Dessutom kan du
använda uttrycken **label+offset** eller **label−offset** för att referera till
en adress relativt till en namngiven konstant:

| Syntax            | Exempel                           | Beskrivning                                                                                                       |
| ----------------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `etikett`         | `STA screen_ram,X`                | Löser upp till etikett-/konstantvärdet                                                                            |
| `etikett+$hex`    | `STA skärmram + 100 USD, X `      | Etikettadress plus en hexagonal offset                                                                            |
| `etikett+decimal` | `STA skärmram+256,X`              | Etikettadress plus en decimalförskjutning                                                                         |
| `etikett-$hex`    | `LDA-bord - 10 dollar `           | Etikettadress minus hexagonal offset                                                                              |
| `$hex+uttryck`    | `LDA $1234+1`, `STA $0400+40*2,X` | Alla uttryck av tal, etiketter och konstanter *(2.1)*                                                             |
| `(etikett)`       | `JMP (vektor)`, `JMP (tabell+2)`  | Indirekt hopp genom en etikett eller ett uttryck *(2.1)*                                                          |
| `#<etikett`       | `LDA #<screen_ram`                | Låg byte för etikettadressen                                                                                      |
| `#>etikett`       | `LDA #>screen_ram`                | Hög byte för etikettadressen                                                                                      |
| `*`               | `BNE *`                           | Aktuell programräknare (instruktionens egen adress); grenar med `*` genererar en oändlig självloop (offset `$FE`) |

**Exempel — rensa två skärmsidor med hjälp av en CONST:**
```
; .CONST screen_ram = $0400 LDX #$00
clear: STA screen_ram,X STA screen_ram+$0100,X DEX BNE clear
```

### Programräknaren `*` i uttryck

`*` är inte längre begränsat till att vara hela operanden — den kan förekomma
**var som helst i ett operanduttryck **, och står för adressen till
instruktionen den är skriven på. Den löses vid monteringstillfället mot
instruktionens verkliga adress, så ingen etikett behövs för korta relativa hopp
eller PC-relativa dataläsningar.

| Syntax        | Exempel                            | Menande                                                |
| ------------- | ---------------------------------- | ------------------------------------------------------ |
| `*`           | `BNE *`                            | Förgrening till sig själv (oändlig loop, offset `$FE`) |
| `*-n` / `*+n` | `BNE *-5`, `BEQ *+4`               | Gren relativt till den aktuella datorn med *n* byte    |
| `JMP *+n`     | `JMP *+20`                         | Absolut hopp beräknat från den aktuella datorn         |
| `#<*` / `#>*` | `LDA-nummer <* `, `LDA-nummer >* ` | Låg/hög byte för den aktuella datorn                   |
| `#>(*+n)`     | `LDA-nummer>(*+63)`                | Låg/hög byte för en PC-relativ adress                  |

**PC vs. multiplikation.** `*` behandlas som programräknaren endast när den
sitter i *värdepositionen* — i början av uttrycket, eller direkt efter en
operator, `(`, `,`, `<`, `>` eller blanksteg. En `*` som följer ett tal, `)`
eller en identifierare är vanlig multiplikation, så `LDA-tabellen*2` och
`CONST_A*4` är oförändrade.

**Där det fungerar.** Alla operander som redan accepterar ett uttryck: branch
targets, `JMP` / `JSR`, `LDA`/`STA`/… absoluta och indexerade, omedelbara
operatorer för låg/hög byte och uttrycket `.assert`. `*` ändrar aldrig en
instruktions storlek, så den är säker i alla adresseringslägen.

### Lokala (prickade) etiketter

En etikett vars namn börjar med en punkt — `.loop`, `.skip`, `.done` — är en
**lokal etikett**. Den tillhör omfånget för den närmaste föregående **globala**
(icke-punktade) etiketten och blir internt `<global>.<namn>`. Två lokala
etiketter med samma korta namn under olika globala etiketter kolliderar
**inte**.

```
DrawSprite:
LDX #0
.loop: ; == DrawSprite.loop
LDA SpriteData,X
STA $2000,X
INX
CPX #63
BNE .loop ; löses inom DrawSprite RTS

ClearScreen:
LDX #0
.loop: ; == ClearScreen.loop — ingen kollision
STA $0400,X
INX
BNE .loop
RTS
```

- Inom ett omfång, referera till en lokal etikett som `.namn`.
- Från ett annat scope, referera det explicit som `Global.name` (t.ex. `JMP
  ClearScreen.loop`).
- Ett `.namn` som skrivs före en global etikett förblir ett vanligt `.namn` på
  toppnivå.

### Operandetiketter för självmodifierande kod

Lägg prefixet `label:` till en instruktions operand för att placera en etikett
på **operandbyte** snarare än opkoden. Instruktionen assembleras från det som
följer efter kolon.

```
setup:
LDA-värde:#$00; 'värde' -> adress för operandbyten #$00
...
patch:
LDA #new STA-värde; skriver operandbyten direkt — klassisk SMC
```

`värde` pekar på `<instruktionsadress> + 1` (den första operandbyten), för varje
adresseringsläge. Detta ersätter den äldre `STA-instruktionen+1` /
`instruktionen: LDA #$00`-mönstret.

---

## 5. 6502 instruktioner

### Dataförflyttning

| Mnemonisk | Beskrivning       | Lägen                                                                  |
| --------- | ----------------- | ---------------------------------------------------------------------- |
| `LDA`     | Lastackumulator   | omedelbar, nollSida, absolut, absolutX, absolutY, indirektX, indirektY |
| `LDX`     | Ladda X-register  | omedelbar, nollSida, nollSidaY, absolut, absolutY                      |
| `LDY`     | Ladda Y-register  | omedelbar, nollSida, absolut, absolutX                                 |
| `STA`     | Butiksackumulator | nollSida, absolut, absolutX, absolutY, indirektX, indirektY            |
| `STX`     | Lagra X-register  | nollSida, nollSidaY, absolut                                           |
| `STY`     | Lagra Y-register  | nollSida, absolut                                                      |

### Aritmetisk

| Mnemonisk | Beskrivning           | Anteckningar                                                      |
| --------- | --------------------- | ----------------------------------------------------------------- |
| `ADC`     | Lägg till med bär     | Ställ in bärfunktionen med `SEC` före användning i de flesta fall |
| `SBC`     | Subtrahera med bäring | Sätt carry med `SEC` före subtraktion                             |
| `INC`     | Öka minnet            | —                                                                 |
| `DEC`     | Minska minnet         | —                                                                 |
| `CMP`     | Jämför med A          | Sätter flaggor; ändrar inte A                                     |
| `CPX`     | Jämför med X          | —                                                                 |
| `CPY`     | Jämför med Y          | —                                                                 |

### Logik

| Mnemonisk | Beskrivning                                         |
| --------- | --------------------------------------------------- |
| `OCH`     | Logiskt OCH med ackumulator                         |
| `ORA`     | Logiskt ELLER med ackumulator                       |
| `EOR`     | Exklusiv ELLER med ackumulator                      |
| `BIT`     | Testbitar i minnet mot A (sätter N-, V-, Z-flaggor) |

### Hopp och grenar

| Mnemonisk | Beskrivning                                         |
| --------- | --------------------------------------------------- |
| `JMP`     | Ovillkorligt hopp (absolut eller indirekt)          |
| `JSR`     | Hoppa till subrutin (sparar returadress på stacken) |
| `RTS`     | Återgå från subrutin                                |
| `RTI`     | Återgång från avbrott                               |
| `BNE`     | Gren om inte lika (Z=0)                             |
| `BEQ`     | Gren om lika (Z=1)                                  |
| `BCC`     | Förgrena sig om överföringen är klar (C=0)          |
| `BCS`     | Förgrening om bäruppsättning (C=1)                  |
| `BMI`     | Gren om Minus (N=1)                                 |
| `BPL`     | Gren om Plus (N=0)                                  |
| `BVC`     | Gren vid överflöde Rensa (V=0)                      |
| `BVS`     | Gren om överflöde inställt (V=1)                    |

#### LBNE / LBEQ / … (Långa grenar)

Åtta pseudo-operationer beter sig som villkorliga grenar men når **valfri
adress**, inte bara −128…+127. Var och en samlas till en inverterad gren som
hoppar över en 3-byte `JMP` — alltid **5 byte**:

```
LBEQ klar; monteras till: BNE *+3 ($D0 $03)
; JMP klar ($4C lågt värde)
```

| Lång operation | Skick                       | Utsänd som           |
| -------------- | --------------------------- | -------------------- |
| `LBNE`         | inte lika med (Z=0)         | `BEQ *+3 / JMP-mål`  |
| `LBEQ`         | lika med (Z=1)              | `BNE *+3 / JMP-mål`  |
| `LBCC`         | klar bärning (C=0)          | `BCS *+3 / JMP-mål ` |
| `LBCS`         | bäruppsättning (C=1)        | `BCC *+3 / JMP-mål`  |
| `LBMI`         | minus (N=1)                 | `BPL *+3 / JMP-mål ` |
| `LBPL`         | plus (N=0)                  | `BMI *+3 / JMP-mål ` |
| `LBVC`         | överflödesrensning (V=0)    | `BVS *+3 / JMP-mål`  |
| `LBVS`         | överflödesuppsättning (V=1) | `BVC *+3 / JMP-mål ` |

- Operand: en etikett, ett `*`-uttryck eller en litteral adress — samma som ett
  normalt grenmål.
- Kostnad: 5 byte och 1 extra cykel på den tagna vägen jämfört med en kort gren.
  Det sker ingen automatisk befordran av en kort gren — du väljer `LBxx`
  explicit.
- När en vanlig gren (`BNE`, `BEQ`, …) är utanför intervallet, namnger
  kompileringsfelet nu den exakta överskridningen och föreslår matchande `LBxx`.

### Registrera operationer

| Mnemonisk | Beskrivning             |
| --------- | ----------------------- |
| `SKATT`   | Överför A → X           |
| `TAY`     | Överför A → Y           |
| `TXA`     | Överför X → A           |
| `TYA`     | Överför Y → A           |
| `TSX`     | Överför stackpekare → X |
| `TXS`     | Överför X → Stackpekare |
| `INX`     | Steg X                  |
| `DEX`     | Minska X                |
| `INY`     | Ökning Y                |
| `DEY`     | Minska Y                |

### Flytta och rotera

| Mnemonisk | Beskrivning                     |
| --------- | ------------------------------- |
| ` ASL `   | Aritmetisk förskjutning vänster |
| `LSR`     | Logisk skiftning åt höger       |
| `ROL`     | Rotera vänster genom bärning    |
| `ROR`     | Rotera höger genom bärning      |

### Stack

| Mnemonisk | Beskrivning                        |
| --------- | ---------------------------------- |
| `PHA`     | Tryck ackumulatorn på stapeln      |
| `PHP`     | Skjut processorstatus till stacken |
| `PLA`     | Dra ackumulatorn från stacken      |
| `PLP`     | Hämta processorstatus från stacken |

### System / Flaggor

| Mnemonisk | Beskrivning                          |
| --------- | ------------------------------------ |
| `CLC`     | Clear Carry-flaggan                  |
| `CLD`     | Rensa decimalläge                    |
| `CLI`     | Rensa avbrottsavaktivering           |
| `CLV`     | Rensa överfyllnadsflaggan            |
| `SEK`     | Ställ in bärflaggan                  |
| `SED`     | Ställ in decimalläge                 |
| `SEI`     | Ställ in avbrottsavstängning         |
| `NOP`     | Ingen operation                      |
| `BRK`     | Tvingat avbrott / programvaruavbrott |

### Olagliga/Odokumenterade instruktioner

Dessa stöds för avancerad användning. Använd med försiktighet – beteendet kan
variera mellan kretsar.

`LAX`, `SAX`, `DCP`, `ISC`, `SLO`, `RLA`, `SRE`, `RRA`, `ANC`, `ALR`, `ARR`,
`AXS`, och `NOP`-formerna som läser en operand: `NOP #$nn` ($80), `NOP $nn`
($04), `NOP $nn,X` ($14), `NOP $nnnn` ($0C), `NOP $nnnn,X` ($1C)

---

## 6. Direktiv och makron – referens

Direktiv styr assemblern (etiketter, data, ursprung, villkor, användarmakron);
biblioteksmakron utför vanliga C64-uppgifter på en rad – istället för att skriva
10–20 instruktioner för hand skriver du en rad och assemblern genererar koden.
Tänk på dem som inbyggda subrutiner.

---

### MÄRKA

Som ett **radnummer i BASIC** — men med ett namn istället för ett nummer.
Hoppmål för `JMP`, `JSR`, `BNE`, etc.

| Argument    | Beskrivning                                          |
| ----------- | ---------------------------------------------------- |
| Etikettnamn | Identifierare som används i `JMP`, `JSR`, `BNE` etc. |

**Syntax:**
```
slinga:
```

**Genererad kod:**
```
slinga: ; $0820
```

Den aktuella adressen visas som en kommentar. Etiketter har en storlek på **0
byte**.

---

### KOMMENTAR

Liksom **REM i BASIC** — en anmärkning till dig själv som assemblern ignorerar
helt.

**Syntax:**
```
Din kommentartext här
```

**Genererad kod:**
```
Din kommentartext här
```

---

### BYTE

Liksom **DATA i BASIC** — lagrar en lista med råa bytevärden inbäddade i
programmet.

| Argument | Beskrivning                                                          |
| -------- | -------------------------------------------------------------------- |
| Operand  | Kommaavgränsade bytevärden (t.ex. `$01, $02, $FF` eller `1, 2, 255`) |

**Syntax:**
```
.byte $01, $02, $FF
```

**Genererad kod:**
```
.byte $01, $02, $FF
```

**Referenser för låg/hög byte-etiketter:** BYTE accepterar tokens av
KickAssembler / ca65-stilen `<label` (låg byte) och `>label` (hög byte)
tillsammans med numeriska värden. Assemblern löser etikettadressen vid
kompileringstillfället och infogar lämplig byte. Exempel:

```
.byte <bildruta_0, >bildruta_0, <bildruta_1, >bildruta_1
```

Detta lagrar den låga byten för `frame_0`s adress, sedan den höga byten, och
sedan samma sak för `frame_1`. Användbart för att bygga hopptabeller och
adresslistor.

**Storlek:** Antal byte i listan.

---

### ORD

Liksom **DATA i BASIC men för 16-bitars tal **. Varje värde lagras som två byte
(låg byte först, sedan hög byte — 6502 little-endian-ordning).

| Argument | Beskrivning                                            |
| -------- | ------------------------------------------------------ |
| Operand  | Kommaavgränsade 16-bitarsvärden (t.ex. `$0400, $C000`) |

**Syntax:**
```
.ord 400 USD, 000 USD
```

**Genererad kod:**
```
.ord 400 USD, 000 USD
```

**Storlek:** 2 byte per ord.

---

### FYLLA

Liksom `FOR I=1 TO N : POKE addr+I, val : NEXT` — fyller ett minnesblock med
samma byte, på en rad. Utmärkt för att rensa områden eller förfylla tabeller.

| Argument | Beskrivning                                            |
| -------- | ------------------------------------------------------ |
| Operand  | `antal,värde` — t.ex. `256,0` fyller 256 byte med noll |

**Syntax:**
```
.fyll 256, 00 kr
```

**Genererad kod:**
```
.fyll 256, 00 kr
```

**Uttryckssyntax:** Både `count` och `value` accepterar aritmetiska uttryck. Du
kan referera till CONST-namn, använda hexadecimala/binära litteraler och anropa
inbyggda matematiska funktioner:

| Uttryck                       | Menande                                   |
| ----------------------------- | ----------------------------------------- |
| `TILE_COUNT, 00 kr `          | räkna från en KONSTANT, värde hex-literal |
| `40*25, 0`                    | inline-multiplikation                     |
| `runda(sin(PI/4)*255), 80 kr` | trigonometri                              |

**Inbyggda funktioner: ** `sin()`, `cos()`, `round()`, `max(a,b)`, `min(a,b)`,
`abs()`, konstant `PI`

Operatorer: `+ - * /` Literaler: `$FF` (hex), `%10110000` (binär) Låg/hög byte:
`lo(expr)`, `hi(expr)`

**Storlek:** Antalet värde i byte.

---

### JUSTERA

Skjuter den aktuella adressen framåt till nästa rena gräns genom att infoga
noll-utfyllnadsbyte. C64 kräver att sprite-data börjar på en 64-byte-gräns —
`ALIGN 64` hanterar det automatiskt.

| Argument | Beskrivning                                                                 |
| -------- | --------------------------------------------------------------------------- |
| Gräns    | Justeringsvärde — t.ex. `64` (spritegräns), `256` (sida), `$2000` (bitmapp) |

**Syntax:**
```
.align 64
.align 2000 dollar
```

**Genererad kod:**
```
; ALIGN 64 → $0840 (12 byte utfyllnad)
```

**Storlek:** Dynamisk — beror på den aktuella programräknarpositionen.

> **Tips:** Använd `ALIGN 64` före spritedata, `ALIGN 256` för att säkerställa
> sidjusterade tabeller.

---

### TEXT

Liksom **PRINT AT** — skriver text direkt till C64-skärmen vid en given kolumn
och rad, utan att använda KERNAL. Den genererar ett LDA/STA-par per tecken, med
skärm-RAM som mål på `$0400`.

| Argument           | Beskrivning                                                   |
| ------------------ | ------------------------------------------------------------- |
| Text               | Strängen som ska visas                                        |
| X                  | Kolumn (0–39)                                                 |
| Y                  | Rad (0–24)                                                    |
| Etikett (valfritt) | Tilldelar en etikett som pekar på den beräknade skärmadressen |
| ` lägre `          | Valfri flagga — se nedan                                      |

**Teckenuppsättningslägen: **

C64 har två teckenuppsättningar som kan väljas vid körning:

| Läge                                         | $D018 bit 1 | Stora bokstäver                | Gemener inmatning             |
| -------------------------------------------- | ----------- | ------------------------------ | ----------------------------- |
| **Versala bokstäver/grafik** (standard)      | 0           | `A`–`Z` → skärmkoder $01–$1A ✓ | behandlas också som versaler  |
| **Gemener/versaler** (efter CHARSET gemener) | 1           | `A`–`Z` → $01–$1A (versaler)   | `a`–`z` → $41–$5A (gemener) ✓ |

- **Versala tecken (standard):** Skriv det du vill se med versaler. `"HEJ"`
  visas som `HEJ`. Gemener mappas till skärmkoder med versaler.
- **Gemener teckenuppsättning (`gemener`):** Skriv exakt det gemener/versaler du
  vill se. `"hej"` → gemener, `"HEJ"` → versaler. Kräver en
  teckenuppsättningsväxel för körning innan skärmen skrivs (använd makrot
  **CHARSET gemener**).

**Genererad kod (versaler, `"HEJ"`):**
```
LDA #$08 ; 'H' skärmkod $08 STA $0400 LDA #$05 ; 'E' skärmkod $05 STA $0401 ...
```

**Syntax:**
```
.text 0, 2, "HELLO"; teckenuppsättning för versaler (standard)
.text 0, 2, "hello", teckenuppsättning för gemener; teckenuppsättning för gemener
```

Tecken kodas som **skärmkoder** (inte PETSCII). **Storlek:** `text.length × 5`
byte (LDA + STA per tecken).

---

### STRÄNG

Som att **POKEa en sträng** till valfri minnesadress vid körning. Genererar
LDA/STA-par som kopierar varje teckens skärmkod till efterföljande adresser.

| Argument           | Beskrivning                                                                 |
| ------------------ | --------------------------------------------------------------------------- |
| Text               | Strängen att skriva                                                         |
| Adress             | Målminnesadress — `$C000` hexagon eller ett **etikettnamn**                 |
| Etikett (valfritt) | Tilldelar en etikett som pekar mot måladressen                              |
| Flytta             | Hexvärde (00–FF) läggs till varje skärmkodbyte (t.ex. `$80` = omvänd video) |
| ` lägre `          | Valfri flagga — samma semantik som TEXT (se avsnittet TEXT)                 |

**Syntax:**
```
.string $C000, "HELLO" ; teckenuppsättning för versaler (standard)
.string $C000, "hello", gemener ; teckenuppsättning för gemener
.string $C000, "HELLO", 80 ; med shift (omvänd video)
.string $C000, "hello", 80, gemener ; shift + gemener
.string $C000, "HELLO" :my_string ; med macroLabel
```

**Genererad kod:**
```
LDA #$08 ; 'H'-skärmkod STA $C000 LDA #$05 ; 'E'-skärmkod STA $C001 ...
```

Tecken kodas som **skärmkoder** (inte PETSCII). Det valfria värdet **Shift**
läggs till varje byte, t.ex. `$80` för omvänd video. **Storlek:** `text.length ×
5` byte (en LDA + en STA per tecken).

---

### DATA

Som en **POKE-loop** — skriver en lista med råa byte till en minnesadress vid
körning, ett LDA/STA-par per byte.

| Argument           | Beskrivning                                                 |
| ------------------ | ----------------------------------------------------------- |
| Byte               | Kommaavgränsade bytevärden                                  |
| Adress             | Målminnesadress — `$C000` hexagon eller ett **etikettnamn** |
| Etikett (valfritt) | Tilldelar en etikett som pekar mot måladressen              |

**Syntax:**
```
.data $C000, $01, $02, $03 ; hex-adress
.data my_buf, $01, $02, $03 ; etikett adress
.data $C000, $01, $02, $03 :mydata ; med macroLabel
```

**Genererad kod:**
```
LDA #$01
    STA $C000
    LDA #$02
    STA $C001
    ...
```

**Storlek:** `antal_byte × 5` byte (en LDA + en STA per byte).

> **2.1:** byten kan namnge etiketter: `.data $2010, <mål, >mål` skriver
> adressen till `mål`, också till en etikett som definieras senare. Makrots
> etikett `:namn` kan peka på en måladress som i sig är en etikett.

---

### RAWBYTES

Liksom **DATA som laddas direkt i minnet** — ingen runtime-kod alls. Bytena
finns från det ögonblick då PRG laddas, innan din kod ens startar. Använd detta
för sprite-data, nivåkartor, uppslagstabeller, allt som bara behöver vara på en
specifik adress.

| Argument           | Beskrivning                                                 |
| ------------------ | ----------------------------------------------------------- |
| Byte               | Kommaavgränsade bytevärden                                  |
| Adress             | Målminnesadress — `$C000` hexagon eller ett **etikettnamn** |
| Etikett (valfritt) | Tilldelar en etikett som pekar mot måladressen              |

**Syntax:**
```
.rawbytes $C000, $00, $00, $00; hex-adress
.rawbytes sprite_data, $00, $00; label-adress
.rawbytes $0C50, $00, $00: nev; med macroLabel — annan kod kan använda LDA nev,X
```

**Storlek i kod:** 0 byte. Data placeras på den angivna adressen i utdata.

> **DATA vs RAWBYTES:** DATA genererar LDA/STA-kod som kopierar byte vid körning
> (långsammare, men fungerar om data behöver vara dynamiska). RAWBYTES placerar
> bara bytena direkt — ingen kod, omedelbart, ingen kostnad.

> **2.1:** bytarna kan namnge etiketter (`.rawbytes $2000, <mål, >mål` — en
> pektabel); etiketten `:namn` kan peka på en etikett som måladress, även en som
> definieras senare. Som ett makros buffertargument tar bytarna sitt eget
> utrymme i buffertarna efter programmet.

---

### RÅTEXT

Som RAWBYTES men för text — kodar strängen som skärmkoder och placerar bytena på
en fast adress utan **körningskod**. Texten är klar i minnet så fort PRG laddas.

| Argument           | Beskrivning                                                                 |
| ------------------ | --------------------------------------------------------------------------- |
| Text               | Sträng att koda                                                             |
| Adress             | Målminnesadress — `$C000` hexagon eller ett **etikettnamn**                 |
| Etikett (valfritt) | Tilldelar en etikett som pekar mot måladressen                              |
| Flytta             | Hexvärde (00–FF) läggs till varje skärmkodbyte (t.ex. `$80` = omvänd video) |
| ` lägre `          | Valfri flagga — samma semantik som TEXT (se avsnittet TEXT)                 |

**Syntax:**
```
.rawtext $C000, "HELLO" ; teckenuppsättning för versaler (standard)
.rawtext $C000, "hello", gemener ; teckenuppsättning för gemener
.rawtext $C000, "HELLO", 80 ; med shift (omvänd video)
.rawtext $C000, "hello", 80, gemener ; shift + gemener
.rawtext $0400, "HELLO" :min_text ; med macroLabel
```

**Genererad kod:**
```
; .rawtext "HELLO" -> $C000
; $C000
.byte $08, $05, $0C, $0C, $0F ; H E L L O (versaler)

; .rawtext "hej", gemener -> $C000
; $C000
.byte $48, $45, $4C, $4C, $4F ; h e l l o (gemener)
```

**Storlek i kod:** 0 byte. Data placeras på den angivna adressen i utdata.

> **STRING vs RAWTEXT:** STRING genererar LDA/STA-kod som kopierar texten vid
> körning. RAWTEXT bakar in byten i PRG vid laddningstid — ingen kod, ingen
> väntetid.

---

### PETSCII

Liksom **RAWBYTES men för KERNAL-utdata ** — kodar strängen som PETSCII-byte
(kompatibel med CHROUT vid `$FFD2`) och placerar dem på en fast adress utan
runtime-kod. Använd detta när du vill skriva ut tecken via `JSR $FFD2` i en
loop, och observera att `.print` använder samma kodare och `lower`-flagga.

> **PETSCII vs skärmkoder:** PETSCII och skärmkoder är två olika kodningar.
> Skärmkod `$01` = bokstav A; PETSCII `$41` = bokstav A (via CHROUT). Använd
> endast PETSCII vid utskrift via KERNAL; använd TEXT/STRING/RAWTEXT för att
> skriva direkt till skärm-RAM.

| Argument           | Beskrivning                                                 |
| ------------------ | ----------------------------------------------------------- |
| Text               | Sträng att koda som PETSCII-byte                            |
| Adress             | Målminnesadress — `$C000` hexagon eller ett **etikettnamn** |
| Etikett (valfritt) | Tilldelar en etikett som pekar mot måladressen              |
| ` lägre `          | Valfri flagga — se nedan                                    |

**Teckenuppsättningslägen: **

| Läge                    | Stora bokstäver (`A`–`Z`)                                                                                                    | Gemener (`a`–`z`)            |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| **Versaler (standard)** | `$41`–`$5A` (PETSCII versaler via CHROUT)                                                                                    | även mappad till `$41`–`$5A` |
| **Gemener (`gemener`)** | Alfabetiska bokstäver mappas om så att det synliga skiftläget förblir konsekvent på teckenuppsättningen för gemener/versaler | Samma regel                  |

**Syntax:**
```
.petscii $C000, "HALLÅ" ; versaler PETSCII (standard)
.petscii $C000, "hallå", gemener ; gemener PETSCII ($61–$7A)
.petscii $C000, "HALLÅ", null ; med null-terminator
.petscii $C000, "hallå", gemener, null ; gemener + null-terminator
.petscii $C000, "HALLÅ" :my_msg ; med macroLabel
```

**Genererade byte (versaler, `"HEJ"`):**
```
; $C000 .byte $48, $45, $4C, $4C, $4F ; H E L L O (PETSCII $41–$5A-intervall)
```

**Storlek i kod:** 0 byte. Data placeras på måladressen som en uppskjuten
datasektion (som RAWBYTES).

**Nullterminator:** lägg till flaggan `null` för att lägga till en `$00` byte
efter texten. Idealiskt för loopar med nollterminering:

```
LDX #$00
loop: LDA-meddelande,X BEQ klar; $00 stoppar loopen JSR $FFD2 INX BNE-loop
klar: RTS
```

**Kodningsregler:**

| Input                                       | Versalläge                         | Gemenerläge             |
| ------------------------------------------- | ---------------------------------- | ----------------------- |
| `A`–`Z`                                     | `41 dollar`–`5 dollarA`            | `61 dollar`–`7 dollar`  |
| `a`–`z`                                     | `$41`–`$5A` (tvångsskriven versal) | `41 dollar`–`5 dollarA` |
| Mellanslag, siffror, interpunktion (32–126) | som det är                         | som det är              |
| Ny rad                                      | `$0D` (RETUR)                      | `$0D`                   |
| Andra                                       | `20 dollar ` (mellanslag)          | `20 dollar`             |

> **Tips:** Använd PETSCII för data som ska matas ut via CHROUT (`$FFD2`). För
> att skriva direkt till skärmens RAM, använd STRING eller RAWTEXT istället.

---

### TECKENUPPSÄTTNING

Växlar VIC-II-tecken-ROM:et mellan versaler/grafikläge (C64-standard) och
gemener/versaler-läge genom att modifiera bit 1 av `$D018` vid körning.

| Argument | Beskrivning                                                                                                                                  |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Läge     | **Gemener** — aktiverar teckenuppsättningen för gemener/versaler; **Versaler** — återställer standardteckenuppsättningen för versaler/grafik |

**Syntax:**
```
.charset lower; växla till gemener teckenuppsättning
.charset upper; växla tillbaka till versaler/grafik teckenuppsättning
```

**Genererad kod:**

Gemenerläge:
```
LDA $D018 ORA #$02; sätt bit 1 → gemener/versaler ROM till $1800 STA $D018
```

Versalläge:
```
LDA $D018 OCH #$FD ; rensa bit 1 → versaler/grafik-ROM vid $1000 STA $D018
```

**Storlek:** 8 byte (LDA abs + ORA/AND imm + STA abs).

**Varför ORA/AND istället för direktskrivning?** `$D018` styr även skärmens
RAM-plats (bitar 7–4). Om endast bit 1 aktiveras bevaras resten av registret.

**Typiskt arbetsflöde:**

```
.charset nedre
.text 0, 0, "hej världen", nedre
.charset övre
```

> **Obs:** Makrot CHARSET ändrar bara VIC-tecken-ROM-pekaren. Det anropar inte
> `$E544` (KERNAL-teckenuppsättningsinit). I de flesta fall är detta
> tillräckligt; anropa först `JSR $E544` endast om du behöver att KERNAL:s egna
> utskriftsrutiner respekterar ändringen.

---

### CHARDEF

Definierar ett enda 8×8 anpassat tecken i en RAM-baserad teckenuppsättning.
Genererar inline-körningskod som kopierar 8 byte till `base + index * 8` vid
körningstillfället — inget behov av en föregående etikett eller `ORG`.

| Argument    | Beskrivning                                                                                                     |
| ----------- | --------------------------------------------------------------------------------------------------------------- |
| Teckenbas   | Basadressen för RAM-teckenuppsättningen (standard `$3800`). Måste justeras så att VIC-II kan se den (se nedan). |
| Teckenindex | Vilken teckenplats som ska omdefinieras, 0–255. `65` = 'A' i standardskärmkodlayouten.                          |
| 8 byte      | Kommaavgränsade bitmappader, uppifrån och ned. Varje bytes bit 7 = pixel längst till vänster.                   |

**Syntax:**
```
.chardef $3800, 65, $18, $3C, $66, $7E, $66, $66, $66, $00
```

**Genererad kod (8 × `LDA #b` / `STA-mål+n`, totalt 40 byte):**
```
LDA #$18
    STA $3A08
    LDA #$3C
    STA $3A09
    LDA #66 USD
    STA $3A0A
    LDA #$7E
    STA $3A0B
    LDA #66 USD
    STA $3A0C
    LDA #66 USD
    STA $3A0D
    LDA #66 USD
    STA $3A0E
    LDA #$00
    STA $3A0F
```

**Måladress:** `$3800 + 65 * 8 = $3A08`. Beräknad vid kompileringstillfället och
hårdkodad i STA-operanderna.

**Storlek:** 40 byte per tecken (8 × 5).

**Typiskt arbetsflöde:**
```
; Punkt VIC-II vid RAM-teckenuppsättningen vid $3800
LDA $D018
OCH #$F1
ORA #$0E ; bitar 3-1 = %111 → teckenuppsättning vid bank+$3800
STA $D018

.chardef $3800, 65, $18, $3C, $66, $7E, $66, $66, $66, $00 ; omdefiniera 'A'
.chardef $3800, 66, $7C, $66, $66, $7C, $66, $66, $7C, $00 ; omdefiniera 'B'
; ... fler .chardef-rader för varje anpassat tecken
```

**När ska man använda CHARDEF jämfört med alternativ:**

| Närma sig                             | Använd när                                                                                         |
| ------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **CHARDEF**                           | Du behöver några anpassade tecken (säg 1–20). Körtidskostnaden är 40 byte per tecken.              |
| **RAWBYTES @ 3800 dollar **           | Du har en komplett anpassad teckenuppsättning (256 tecken). Totalt 2 KB data, ingen runtime-kopia. |
| **INCBIN "charset.bin" @ 3800 USD**   | Extern teckenuppsättningsfil (byggd av teckenredigeraren). Renaste alternativet.                   |
| **Teckenuppsättning Canvas + INCBIN** | Fullständig bitmapp med 256 tecken målad som en 128×128-bild.                                      |

> **Påminnelse om justering:** VIC-II förväntar sig att teckenuppsättningsbasen
> är en multipel av `$0800`. Giltiga banker: `$0000`, `$0800`, `$1000`, ... ,
> `$3800` (inom den nuvarande 16 KB VIC-banken). RAM-teckenuppsättningar ligger
> vanligtvis på `$2000`, `$2800`, `$3000` eller `$3800`.

---

### BOX_HIT

Axis-aligned bounding-box (AABB) kollisionstest mellan två rektanglar beskrivna
av 4-byte nollsidiga strukturer. Returnerar resultatet i ackumulatorn: **A = 1**
vid överlappning, **A = 0** annars. Ren inline-assembling, inget subrutinanrop.

| Argument                 | Beskrivning                                                          |
| ------------------------ | -------------------------------------------------------------------- |
| Postnummeradress i Box 1 | Nollsidig bas för den första rutans 4-bytestruktur (standard `$FB`). |
| Postnummeradress i Box 2 | Nollsidig bas för den andra rutans 4-bytestruktur (standard `$F7`).  |

**Strukturlayout** (4 byte per ruta, osignerade 8-bitars koordinater):

| Offset | Fält    |
| ------ | ------- |
| `+0`   | Vänster |
| `+1`   | Bästa   |
| `+2`   | Rätt    |
| `+3`   | Botten  |

**Syntax:**
```
.box_hit $FB, $F7
```

**Genererad kod (30 byte, helt PC-relativ — ingen subrutin, inga absoluta
hopp):**
```
LDA $FD; b1 höger CMP $F7; b2 vänster BCC nej; R1 < L2 → missa LDA $F9; b2 höger CMP $FB; b1 vänster BCC nej LDA $FE; b1 botten CMP $F8; b2 topp BCC nej LDA $FA; b2 botten CMP $FC; b1 topp BCC nej LDA #$01; träffad BNE klar; ovillkorlig (A ≠ 0)
nej: LDA #$00
klar:
```

**Storlek:** 30 byte.

**Typiskt arbetsflöde:**

```
; Spelarens sprite-ruta vid $FB..$FE
LDA sprite_x ; L
STA $FB
LDA sprite_y ; T
STA $FC
CLC
ADC #23 ; +23 → B (24 pixlar hög sprite)
STA $FE
LDA $FB
CLC
ADC #23 ; R
STA $FD

; Fiende-ruta vid $F7..$FA (ifylld på liknande sätt)
; ...

.box_hit $FB, $F7 ; testspelare mot fiende → A = 0 eller 1

CMP #$01
BNE ingen_kollision
JSR handle_hit
ingen_kollision:
```

**Begränsningar:**
- Båda nollsidiga adresserna måste vara `≤ $FC` (varje ruta behöver 4 på
  varandra följande byte: `zp`, `zp+1`, `zp+2`, `zp+3`).
- Koordinater behandlas som **unsigned 8-bit** (0–255). För signerade
  sprite-koordinater utanför detta intervall, normalisera innan lagring.
- De två rutorna kan överlappa varandra i ZP-utrymmet om så önskas, men
  vanligtvis vill man ha 8 distinkta byte.

**Varför inte en subrutin?** Inline-generering undviker JSR/RTS-overhead (14+
cykler) och håller testet aktivt i cachen för snäva spelloopar. Om du behöver
testa många par, placera din egen `JSR box_hit_sub` runt en enda BOX_HIT-rad
manuellt.

**Jämförelse med UB:s `box_hit()`-funktion:** Ultimate Basic använder samma
6502-logik som en runtime-funktion som returnerar till en variabel. I VA
placerar du BOX_HIT inline där du behöver testet; resultatet är i `A`.

---

### INCBIN

Liksom **BLOAD i BASIC** — hämtar en extern binärfil (`.bin`, `.prg`, `.sid`,
`.raw`) och bäddar in den direkt i den sammansatta PRG:n på den adress du anger.

| Argument | Beskrivning                                                      |
| -------- | ---------------------------------------------------------------- |
| Fil      | Bläddra för att välja en `.bin`, `.prg`, `.sid` eller `.raw`-fil |
| Adress   | Målinläsningsadress (t.ex. `$C000`)                              |

**Syntax:**
```
.incbin "musik.bin", $C000
```

**Genererad kodkommentar:**
```
; INCBIN "music.bin" @ $C000 (2048 byte)
.byte $01, $02, ...
```

**Storlek i kod:** 0 byte (uppskjuten datasektion). Binärfilen är inbäddad på
den angivna adressen.

---

### KOALA

Laddar en **Koala Painter**-bild (`.koa` / `.kla`, 160×200 flerfärgad) och visar
den. Bilddatan är inbäddad på en fast adress som `INCBIN` (filens 2-byte `$6000`
laddningsadress tas bort), och själva direktivet kompileras till en 86-byte
visningsrutin som körs där den befinner sig.

| Argument | Beskrivning                                                                                                                   |
| -------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Fil      | Bläddra för att välja en `.koa` / `.kla`-fil (10003 byte, eller 10001 utan laddningsadress)                                   |
| Adress   | Bitmap-adress: `$6000` (standard, Koala-inbyggt, VIC-bank 1, skärm-RAM `$4400`) eller `$2000` (VIC-bank 0, skärm-RAM `$0400`) |

Visningsrutinen kopierar skärmens RAM-del till skärmen och färg-RAM-delen till
`$D800`, skriver bakgrundsbyten till `$D021`, väljer VIC-banken i `$DD00` (med
behållna andra portbitar) och växlar till flerfärgsbitmappsläge (`$D011 = $3B`,
`$D016 = $18`, `$D018 = $18`). Andra adresser avvisas: de återstående
8K-platserna ligger under BASIC/KERNAL ROM (kopieringsslingan skulle läsa ROM)
eller överlappar tecken-ROM-skuggan.

**Syntax:**
```
.koala "picture.koa"
.koala "picture.koa", $2000
```

**Exempel — visa en bild och vänta:**
```
* = $0801
.koala "bild.koa"
vänta:
JMP vänta
```

**Storlek i kod:** 86 byte (visningsrutin); de 10001 byte av bilddata går till
den angivna adressen. Hires-redigeraren i C64 Visual Assembler exporterar en
kompatibel fil.

---

### NIVÅ / NIVÅRAD

Lägger in ett **Level Editor**-projekt i ditt program och kopierar nivårader
till en skärmbuffert — byggstenarna i ett rullande spel.
`level-demo.asm`-exemplet av C64 Visual Assembler är en komplett joystick-rullad
nivå.

#### NIVÅ

Ett INCBIN-liknande direktiv som avger **0 byte kod**. Endast de
**placerade**-skärmarna i Level Editor-projektet (`.bin` som Level Editor i C64
Visual Assembler sparar) hamnar i minnet från den angivna adressen (standard
`$2000`), i slotordning, 2000 byte per skärm (1000 skärmkoder + 1000 färger).
Identiska skärmar lagras en gång, och alla tomma slots delar en tom skärm.
Pektabellarna följer skärmarna. En nivå kan vara upp till 7 × 10 skärmar.

**Syntax:**
```
.nivå "nivå.bin"
.nivå "nivå.bin", 4000 dollar
```

| Definierad                                                                     | Menande                                                                                                                                        |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `NIVÅ_PLACERING_LÅG` / `NIVÅ_PLACERING_HÖG`                                    | Skärmens adress i varje plats (huvudrad, `NIVÅ_W` platser per rad)                                                                             |
| `NIVÅ_RAD_PLATS`                                                               | Nivå teckenrad → första platsen på dess skärmrad                                                                                               |
| `NIVÅ_ROD_LÅG/HÖG`, `NIVÅ_KRÅ_LÅG/HÖG`                                         | Nivå teckenrad → förskjutning av dess skärmkodsrad / färgrad inuti en skärm                                                                    |
| `NIVÅKOLUMNPLATS`, `NIVÅKOLUMNOFS`                                             | Visa startkolumn → skärmkolumn och kolumn inuti skärmen                                                                                        |
| `NIVÅ_W`, `NIVÅ_H`                                                             | Nivåstorlek på skärmar                                                                                                                         |
| `NIVÅKOLMER`, `NIVÅRADER`                                                      | Nivåstorlek i tecken                                                                                                                           |
| `NIVÅ_MAX_X`, `NIVÅ_MAX_Y`                                                     | Största pixelrullningsposition i en 40×25-vy                                                                                                   |
| `NIVÅ_BG`, `NIVÅ_MC1`, `NIVÅ_MC2`, `NIVÅ_FLERFÄRG`                             | Bakgrunds-/flerfärgade färger och nivåläge                                                                                                     |
| `NIVÅDATA`, `NIVÅSTORLEK`, `NIVÅSLUT`                                          | Start, storlek och första fria adress efter nivådata                                                                                           |
| `NIVÅ_OBJ_X_LO/HÖG`, `NIVÅ_OBJ_Y_LO/HÖG`, `NIVÅ_OBJ_TYP`, `NIVÅ_OBJ_PARAMETER` | Objekttabell (Level Editor-objektlager): position i nivåpixlar, typ och parameterbyte, i rullningsordning — `LEVEL_OBJ_COUNT` poster (max 255) |
| `NIVÅ_OBJ_T_START` … `NIVÅ_OBJ_T_TRIGGER`                                      | Objekttypnummer: START 0, FIENDE 1, FÖREMÅL 2, DÖRR 3, UTGÅNG 4, AVLÖSARE 5                                                                    |
| `NIVÅ_START_X`, `NIVÅ_START_Y`                                                 | Position för det första startobjektet (definieras endast när nivån har ett)                                                                    |
| `NIVÅ_ATTR`, `NIVÅ_ATTR_FAST` … `NIVÅ_ATTR_INSAMLING`                          | Teckenattributtabell (en flaggbyte per skärmkod; endast när nivån har attribut) och dess bitar: 1, 2, 4, 8                                     |
| `NIVÅKANT`, `NIVÅ_SKÄRM_FÄRGER`, `NIVÅ_SKÄRM_BG/KANT/MC1/MC2`                  | Nivågräns; färgtabeller per plats (rad-huvud som `LEVEL_SLOT_*`) när en skärm har sina egna färger (`LEVEL_SCR_COLORS` = 1)                    |

Typisk skydd: `.assert LEVEL_END <= $9200, "nivådata körs in i koden"`.

#### NIVÅ_RAD

Kopierar en 40-teckensrad av nivån till en buffert: nivåraden i **X**, med
början vid nivåkolumnen som finns i variabeln `col`, till adressen som finns i
pekaren `dst` (`dst` / `dst+1`, låg/hög). Med det tredje argumentet `color`
kopieras färgerna istället för skärmkoderna (för färg-RAM). Ett
40-teckensfönster som sträcker sig över två skärmar hanteras med en
självmodifierande kopieringsslinga (~14 cykler per byte). X behålls, A och Y
förstörs. Behöver ett `.level`-block i programmet.

**Syntax:**
```
.nivårad dst_lo, vy_x
.nivårad dst_lo, vy_x, färg
```

**Storlek i kod:** 132 byte — använd `LBEQ` / `LBNE` när en gren måste hoppa
över den.

---

### SID

Liksom **BLOAD för musik** — laddar en `.sid`-fil i din PRG och läser
automatiskt dess Init- och Play-adresser från headern. Anropa Init en gång vid
uppstart, anropa sedan Play från din IRQ-hanterare varje bildruta.

| Argument                   | Beskrivning                                                                                                             |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Fil                        | `.sid`-filen (PSID / RSID)                                                                                              |
| Anpassad adress (valfritt) | Åsidosätt SID:s ursprungliga laddningsadress (t.ex. `$1000`). Lämna tomt om du vill använda adressen från SID-rubriken. |

SID-rubriken ger:
- **Ladda adress** — där data placeras i minnet (den anpassade adressen när en
  sådan anges)
- **Init-adress** — anropa detta med JSR för att initiera musiken (flyttas
  tillsammans med en anpassad adress)
- **Spela upp adress** — anropa detta med JSR på varje ram i en IRQ-hanterare
  (flyttas tillsammans med en anpassad adress)

**Syntax:**
```
.sid "Ikari_Warriors.sid"
.sid "Ikari_Warriors.sid", $1000
```

**Genererad kodkommentar:**
```
; SID "Ikari_Warriors.sid" @ $1000 Init:$1000 Play:$1006 (4096 byte)
```

**Storlek i kod:** 0 byte inline. SID-binärfilen placeras på den angivna
adressen som en uppskjuten del i PRG.

> **Viktigt:** De flesta SID-filer innehåller hårdkodade interna absoluta
> adresser. De kan bara flyttas om hela binärfilen förskjuts med samma offset.
> Om ett SID har interna hopp till `$10xx` måste det stå kvar på `$1000` — att
> flytta det till en annan adress kommer att bryta dessa interna referenser.

> **Typisk användning:** Ge SID:t en egen adress (`.sid "tune.sid", $1000`) när
> dess ursprungliga adress kolliderar med din kod. Anropa Init en gång vid
> start, anropa sedan Play every frame från en raster IRQ-hanterare — eller låt
> [SID_PLAYER](#sid_player) göra båda.

**Etiketter:** SID-direktivet definierar `SID_LOAD` (där data placeras),
`SID_INIT` och `SID_PLAY` (init- och play-adresserna, flyttade tillsammans med
en anpassad adress). `SID_PLAY` saknas när låten inte har någon play-adress (ett
RSID som installerar sin egen IRQ). Använd dem i din egen kod, t.ex. `JSR
SID_PLAY` i en IRQ-hanterare.

---

### SID_PLAYER

Spelar melodin från **SID**-direktivet med en rad: den initierar melodin och
fortsätter att anropa sin uppspelningsrutin från ett rasteravbrott, så att ditt
program kan fortsätta med sitt eget arbete.

| Argument | Beskrivning                                                     |
| -------- | --------------------------------------------------------------- |
| Låt      | Subtune-nummer som skickas till init-rutinen i A (standard `0`) |
| Raster   | Avbrottets rasterlinje, `$00`–`$FF` (standard `$FA`)            |

Vad den gör: `SEI`, `LDA #song` / `JSR SID_INIT`, stänger av CIA1-timerns IRQ
(`$DC0D`), ställer in IRQ-vektorn (`$0314/$0315`) till dess inbyggda hanterare,
rasterlinjen (`$D012`, bit 8 av `$D011` rensad) och raster-IRQ (`$D01A`), `CLI`,
och hoppar sedan över hanteraren. Hanteraren bekräftar avbrottet (`ASL $D019`),
anropar `JSR SID_PLAY` och går vidare till KERNAL (`JMP $EA31`, som också
skannar tangentbordet).

**Syntax:**
```
.sid "Ikari_Warriors.sid"
.sid_player
.sid_player 1, 80 dollar
```

**Storlek i kod: ** 58 byte.

> **Obs:** den behöver en `.sid`-rad i programmet (`SID_INIT` och `SID_PLAY`);
> annars stoppas bygget med ett fel. Med CIA1-timerns IRQ avstängd körs KERNAL
> en gång per bildruta från raster-IRQ:n — tangentbordet och `GETIN` fortsätter
> att fungera.

---

### OMFATTA

Liksom **MERGE i BASIC** — hämtar en annan fil och expanderar den inline på
denna position. Perfekt för återanvändbara subrutinbibliotek.

Två filtyper stöds:
- **Källkod för enkel assembler** (`.inc`, `.asm`, `.s`) — filen läses som
  VMA-källa. Den läses igen vid varje build, så du kan redigera den med valfri
  editor.
- **Visual Assembler-projekt** (`.json`) — blocken i ett C64 Visual
  Assembler-blockprogram.

| Argument                | Beskrivning                                                                                                                                                                                                                              |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fil                     | En `.inc` / `.asm` / `.s`-källa eller ett `.json` Visual Assembler-projekt                                                                                                                                                               |
| Ladda adress (valfritt) | Om den är satt till (hex, t.ex. `C000`), placeras den inkluderade koden på den adressen — en `ORG` placeras framför den, och den inkluderade filens egna ORG:er ignoreras. Utan den styr den inkluderade filens egna ORG:er placeringen. |

**Syntax:**
```
.include "library.json"
.include "macros.inc", 1500 USD
.include "sprites.asm"
```

- Ge filändelsen ** ** ett rent namn som `.include "macros" ` behandlas som
  `.include "macros.json" `.
- Sökvägsupplösning: först bredvid källkoden, sedan i varje sökmapp (CLI:erna
  `--base-dir` / `--search`); en sökväg som skrivits på en annan maskin återgår
  till sitt enkla filnamn. En saknad include är inte ett fel — bygget fortsätter
  utan den.

**Genererad kod (ingen adressöverstyrning):**
```
; .include "library.json"
... (den inkluderade koden följer)
```

**Genererad kod (med laddningsadress `C000`):**
```
; .include "library.json" @ $C000
*=$C000
... (den inkluderade koden följer)
```

> **Tips:** Använd INCLUDE för att bygga återanvändbara subrutinbibliotek som du
> kan dela mellan projekt. `.inc`/`.asm`/`.s`-filer är bäst när du vill redigera
> biblioteket i en vanlig textredigerare eller dela det med andra
> 6502-assemblerare; `.json` när biblioteket är ett Visual
> Assembler-blockprogram. Ange en laddningsadress när biblioteket inte har någon
> egen ORG, eller när du vill åsidosätta dess standardplacering.

> **2.1:** En include som inte hittas är ett fel, och detsamma gäller en fil som
> inkluderar sig själv (direkt eller längre ner). En inkluderad fils egna rader
> `.include`, `.incbin` och `.sid` laddas också, relativt till dess egen mapp,
> och dess makroanrop expanderas – upp till 16 nivåer djupt.

---

### TABELL

Liksom **DIM vid en specifik adress** — namnger en uppslagstabell och anger var
den finns i minnet. Skriv in rader som `.byte`, `.word` eller `.fill` efter den
för att definiera tabellens innehåll.

| Argument | Beskrivning                                     |
| -------- | ----------------------------------------------- |
| Namn     | Etikett-ID för tabellen (t.ex. `color_table`)   |
| Adress   | Fast adress där tabellen börjar (t.ex. `$C000`) |

**Syntax:**
```
.table color_table $C000
.table lookup; vid den aktuella adressen
```

**Genererad kod:**
```
färg_tabell:
```

Med en adress hoppar programräknaren dit; utan en börjar tabellen vid den
aktuella adressen. Sätt i raderna `.byte` / `.word` / `.fill` efter den för att
fylla innehållet.

**Storlek:** 0 byte.

---

### ORG

Anger var i minnet programmet (eller en del av det) placeras — som att välja en
startadress innan man skriver in maskinkod. Varje program behöver minst en ORG.
Standard C64 BASIC-laddningsbar start är `$0801`.

| Argument  | Beskrivning                                                        |
| --------- | ------------------------------------------------------------------ |
| Adress    | Den nya ursprungsadressen (t.ex. `0801` i HEX, eller `2049` i DEC) |
| HEX / DEC | Växla adressinmatningen mellan hexadecimal och decimal visning     |

**Syntax:**
```
* = 000 kr
```

**Genererad kod:**
```
* = 000 kr
```

**Storlek:** 0 byte. ORG genererar ingen maskinkod i sig.

Varje ORG startar en ny sektion. Raderna som följer sätts ihop med början på den
adressen. PRG:n lagrar alla sektioner i en fil – mellanrummen mellan sektionerna
fylls med nollor.

**Exempel — kod vid `$0801`, datatabell vid `$C000`:**
```
* = $0801 LDX #$00
loop: LDA $C000,X STA $D800,X INX BNE-loop RTS

* = $C000 .byte $01, $02, $03, ...
```

> **Tips:** Utan en ORG börjar programmet vid `$0801` (2049 decimaler), början
> av BASIC. Med BASIC SYS-stubben (standard) lägger assemblern in en kort `10
> SYS…`-rad vid `$0801` och din kod börjar vid `$080D`. Se [Utdata: PRG,
> BASIC-stub och startpunkt](#3-output-prg-basic-stub-and-entry-point).

---

### LOPP / NÄSTA

Liksom **`FOR X=N TO 1 STEP -1 : ... : NEXT X`** i BASIC — räknar ner från N
till 1 med hjälp av X- eller Y-registret. Placera dina instruktioner mellan LOOP
och NEXT, så loopas rätt antal gånger automatiskt.

#### SLINGA

| Argument | Beskrivning                                                     |
| -------- | --------------------------------------------------------------- |
| Register | `X` eller `Y` — räknarregistret                                 |
| Räkna    | Antal iterationer per loop (hex eller decimal, t.ex. `0A` = 10) |
| Märka    | Automatiskt genererad loopetikett (t.ex. `loop0`)               |

**Syntax:**
```
.loop X, 10, loop0
```

**Genererad kod:**
```
LDX #$0A
loop0:
```

**Storlek:** 2 byte (LD_ opcode + omedelbar operand).

#### NÄSTA

| Argument | Beskrivning                            |
| -------- | -------------------------------------- |
| Register | Automatiskt matchad med LOOP-registret |
| Märka    | Automatiskt länkad till LOOP-etiketten |

**Syntax:**
```
.nästa loop0
```

**Genererad kod:**
```
DEX BNE-slinga 0
```

**Storlek:** 3 byte (DEX + BNE + förgreningsförskjutning).

**Exempel — rensa 10 skärmceller:**
```
LDX #$0A
loop0: LDA #$20; mellanslag STA $0400,X DEX BNE loop0
```

---

### FÖR / SLUT

Liksom **`FOR X=0 TO N-1 : ... : NEXT X`** i BASIC — räknar *upp* från 0.
Perfekt när du behöver ett framåtriktat index, t.ex. stega igenom en sträng
eller en array.

#### FÖR

| Argument | Beskrivning                                                                       |
| -------- | --------------------------------------------------------------------------------- |
| Register | `X` eller `Y` — räknarregistret                                                   |
| Räkna    | Loopgräns (hex eller decimal, t.ex. `$12` = 18). X/Y går från 0 upp till gräns-1. |
| Märka    | Automatiskt genererad loopetikett (t.ex. `för0`)                                  |

**Syntax:**
```
för X, 12 dollar, för 0
```

**Genererad kod:**
```
LDX #00 kr för 0:
```

**Storlek:** 2 byte (LD_ opcode + `#$00`).

#### SLUT

| Argument | Beskrivning                              |
| -------- | ---------------------------------------- |
| Register | Automatiskt matchad med FOR-registret    |
| Märka    | Automatiskt länkad till FOR-etiketten    |
| Räkna    | Kopieras automatiskt från den parade FOR |

**Syntax:**
```
.endf för0
```

**Genererad kod:**
```
INX CPX #12 USD BNE för 0
```

**Storlek:** 5 byte (IN_ + CP_ #imm + BNE-offset).

**Exempel — skriv ut en null-avslutad sträng:**
```
LDX #$00
för0:
LDA-meddelande,X; meddelande = PETSCII-sträng vid fast adress BEQ klar; nullterminator → avsluta JSR $FFD2; CHROUT INX CPX #$12; max 18 tecken BNE för0
klar: RTS
```

> **LOOP vs FOR:** LOOP räknar ner (N→1) — bra för fördröjningar, fyllningar,
> pixelloopar. FOR räknar upp (0→N) — bra för sträng-/arrayåtkomst. Båda kan
> använda X eller Y.

---

### TRYCK / DRA

Som att ** spara variabler före en GOSUB och återställa dem efter ** — men
använder 6502-hårdvarustacken. Om en subrutin använder A, X eller Y, omslut den
med PUSH och PULL så att den anropande kodens register bevaras.

#### TRYCK

Skjuter ett eller flera register till stacken. Ordningen är alltid A → X → Y
(innerst först).

| Argument | Beskrivning                                                          |
| -------- | -------------------------------------------------------------------- |
| Register | Vilken kombination som helst: `A`, `X`, `Y`, `AX`, `AY`, `XY`, `AXY` |

**Syntax:**
```
.tryck AXY
```

**Genererad kod (exempel: `AX`):**
```
PHA TXA PHA
```

**Storlek:** 1 byte för A (`PHA`), 2 byte för X eller Y (överföring + push).

#### DRA

Återställer register från stacken i **omvänd ordning** (Y → X → A).

| Argument | Beskrivning                                    |
| -------- | ---------------------------------------------- |
| Register | Samma som PUSH — måste matcha motsvarande PUSH |

**Syntax:**
```
.dra AXY
```

**Genererad kod (exempel: `AX`):**
```
PLA MOMS PLA
```

> **Regel:** PUSH och PULL måste alltid använda **samma registeruppsättning**.
> `PUSH AX` → `PULL AX` (återställer internt i omvänd ordning: X först, sedan
> A).

---

### END / RTS-alias

Liksom **RTS med ett vänligare makronamn ** — `.end` avger en enda `RTS` byte,
en kort subrutinterminator.

**Syntax:**
```
.avsluta
```

**Genererad kod:**
```
RTS
```

**Storlek:** 1 byte.

Använd detta när du vill ha en markör för slutet av en subrutin som liknar ett
makro mer än en rå instruktion.

---

### MAKRO / ENDM / ANROPA

Liksom **en namngiven GOSUB med parametrarna ** — definiera en återanvändbar
kodbit en gång (MACRO…ENDM), och anropa den sedan var som helst med INVOKE.
Skicka olika argumentvärden varje gång istället för att kopiera och klistra in
kod.

#### MAKRO (definitionsstart)

| Argument   | Beskrivning                                                              |
| ---------- | ------------------------------------------------------------------------ |
| Namn       | Identifierare för makrot (t.ex. `setColor`)                              |
| Parametrar | Valfria kommaseparerade parameternamn (t.ex. `färg` eller `färg, antal`) |

Markerar början på en makrodefinition. Linjerna mellan MAKRO och ENDM är makrots
brödtext. Ett makro med parametrar **genererar ingen kod** där definitionen
finns; ett makro utan parametrar sätts också ihop där som en subrutin
(`JSR-namn` kallar det): programflödet hoppar över det, och en `RTS` läggs till
i slutet. I ett bibliotek som ingår på en fast adress får ett sådant makro också
`RTS`. I brödtexten skrivs en parameter som `{paramName}` eller som dess bara
namn; Anropet fyller i argumentet — både i instruktionsoperander och i
argumenten för biblioteksmakron (`.set_border c`, `.sprite_pos n, x, y` …).
Etiketter, LOOP-etiketter och runtime `.if` / `.while` etiketter för brödtexten
är unika per anrop. Ett makroanrop inuti en makrobrödtext expanderas inte (ett
fel).

**Genererad kod:**
```
; .MACRO setColor (färg)
... (kropp)
; .ENDM
```

**Syntax:**
```
.macro setColor färg LDA {färg} STA $D020
.endm
```

#### ENDM (definitionsslut)

Stänger den aktuella makrodefinitionen. Inga argument.

#### ÅBEROPA

Anropar ett definierat makro på denna position och ersätter de angivna
argumentvärdena med platshållarna `{paramName}` i brödtexten.

| Argument  | Beskrivning                                                                      |
| --------- | -------------------------------------------------------------------------------- |
| Makronamn | Ett makro som definierats i programmet eller i en inkluderad fil                 |
| Argument  | Kommaavgränsade argumentvärden som matchar makrots parameterlista (t.ex. `#$07`) |

**Genererad kod:**
```
; .invoke setColor(#$07)
    LDA #$07
    STA $D020
```

**Syntax:**
```
; enkelt argument:
.invoke setColor(#$07)

; flera argument:
.invoke drawPixel($10, $20)

; inga argument:
.invoke clearScreen

; text / strängargument (citat):
.invoke printText("Hej världen!")

; .call alias (synonym för .invoke):
.call setColor(#$07)
```

Makrots innehåll expanderas inline med `{paramName}` ersatt av de faktiska
argumenten. Den mellanslagsavgränsade formen (`.invoke setColor #$07`)
accepteras också.

**Argumenttyper:**
- **Numerisk**: `#$07`, `$10`, `255` — hex- eller decimalvärden
- **Textsträngar**: `"Hej världen!"` — citatsträngar (citaten tas bort);
  kommatecken inom citattecken behandlas som en del av texten, inte som
  argumentavgränsare
- **Teckenliteral**: `'A'` — förblir en teckenliteral, så brödtexten får sin kod
  (`$41`)
- **Blandat**: `#$07, "hej", $20` — valfri kombination

> **Tips:** Definiera makron högst upp (eller längst ner) i ditt program och
> ANROPA dem sedan där det behövs. Makron kan anropas flera gånger med olika
> argument.

> **2.1:** ett makro kan anropa ett annat makro (`both(a, b)` anropa `etc(a)`);
> det inre anropet får det yttre anropets argument och sina egna unika lokala
> etiketter. Ett makro som anropar sig självt stoppar med ett fel efter 16
> nivåer istället för att hänga sig.

---

### REGION / ENDREGION

Enbart en gruppering för redaktörer och listningar — **noll byte**, noll effekt
på den sammansatta koden.

| Argument       | Beskrivning                                                              |
| -------------- | ------------------------------------------------------------------------ |
| Regionens namn | Fritextetikett för sektionen (t.ex. `init`, `game_loop`, `sprite_setup`) |

**Syntax:**
```
.region init
; kod...
.endregion
```

**Genererad kod:**
```
; region init
    SEI
    LDA #$00
    STA $D020
; endregion init
```

**Storlek:** 0 byte för både REGION och ENDREGION.

> **Obs: ** Regioner kan **kapslas** inuti varandra. Varje ENDREGION stänger
> närmaste öppna REGION. Ingen effekt på den sammanställda utdata.

---

### DEFINERA / OM / ANNARS / ENDIF

Precis som med en **-brytare läser assemblern ** — `DEFINE DEBUG` aktiverar en
symbol, varefter raderna i valfri `IF DEBUG` assembleras och dess `ELSE`-gren
hoppas över. Ta bort DEFINE så försvinner IF-delen från utdata. Du behöver inte
ta bort kod för versionsversioner.

#### DEFINIERA

| Argument | Beskrivning                                                                                  |
| -------- | -------------------------------------------------------------------------------------------- |
| Symbol   | En eller flera kommaseparerade identifierare att aktivera (t.ex. `DEBUG` eller `DEBUG, PAL`) |

**Syntax:**
```
.define DEBUG, PAL
```

**Genererad kod:**
```
; .DEFINE DEBUG
; .DEFINE DEBUG, PAL
```

En `DEFINE` kan aktivera flera symboler samtidigt (kommaseparerade). Placera
DEFINEs högst upp i ditt program.

#### OM

| Argument | Beskrivning                                                                                                                          |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Skick    | Ett `.define`d-symbol (aktiv), ett `.const`-namn (aktivt när det inte är noll) eller ett konstant uttryck (`LEVEL == 2`, `MODE & 1`) |

**Syntax:**
```
.if DEBUG
```

**Genererad kod:**
```
; .IF DEBUG
```

Raderna mellan `IF` och `ENDIF` (eller `ELSE`) är assemblerade eller hoppade
över av villkoret. Ett rent namn är sant när det är `.define`d eller ett
nollskilt `.const`, falskt när det är vardera; alla andra villkor måste vara ett
konstant uttryck — ett som inte kan utvärderas vid assemblern är ett fel.
Överhoppade rader visas som `; [IF skipped] …` kommentarer och genererar **noll
byte**.

#### ANNAN

Inga argument. Markerar den alternativa grenen — monteras när villkoret `OM` är
*inte* aktivt.

**Syntax:**
```
.annan
```

**Genererad kod:**
```
; .ANNARS
```

#### ENDIF

Inga argument. Stänger villkorsdelen.

**Syntax:**
```
.endif
```

**Genererad kod:**
```
; .ENDIF
```

**Storlek:** 0 byte för alla fyra direktiven. Endast innehållet *mellan* dem
räknas.

**Exempel — felsöka kantlinjeflash, versionsversion hoppar över det:**
```
; .DEFINE DEBUG

; .IF DEBUG
LDA #$02 ; röd ram
STA $D020
; .ELSE
LDA #$00 ; svart (utgåva)
STA $D020
; .ENDIF
```

**Exempel — flera symboler i en DEFINE:**
```
; .DEFINE DEBUG, PAL

; .IF PAL
LDA #$xx ; PAL-tidskonstant

; .ELSE
LDA #$xx ; NTSC-tidskonstant

; .ENDIF
```

Kapslade `IF` stöds. Om en yttre del hoppas över, hoppas även de inre över.

> **Obs:** Detta är hantering av villkor vid kompilering. För
> jämförelse/förgreningssockrar vid körning, se **Runtime IF / ELSE / ENDIF**
> nedan.

### .HÄVDA

En **sanity check vid kompileringstid**. `.assert` utvärderar ett uttryck under
assemblering; om det är falskt (`0`) stoppas bygget med ett tydligt fel som
inkluderar det faktiska värdet. Om det är sant (inte noll) genererar det
ingenting.

| Argument   | Beskrivning                                                                                                                        |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Uttryck    | Valfritt assembleruttryck: etiketter, `CONST`s, `*` (programräknare), aritmetik och jämförelser (`<`, `<=`, `>`, `>=`, `==`, `!=`) |
| Meddelande | Valfri text tillagd till felmeddelandet                                                                                            |

**Syntax:**
```
.assert spriteData < $C000
.assert * < $A000
.assert slut - början <= 256, "sprite-tabellen överflödig en sida"
```

**Beteende:**

- **Storlek:** 0 byte.
- En falsk påstående avbryter sammansättningen: `` `.assert end - start <= 256`
  är falskt (värde: 0). sprite-tabellen översvämmades en sida``
- En påstående som inte kan utvärderas (odefinierad etikett, etc.) misslyckas
  också, med * "kan inte utvärderas vid monteringstillfället"*.
- Jämförelser ger `1` / `0`; placera `.assert` var som helst i programflödet —
  den kontrolleras vid adressen den finns på, så `.assert * < $D000` testar den
  aktuella utgångspositionen.

**Exempel — skydda sprite-data mot sidövergångar:**
```
* = $3000
sprite_data:
.byte $00, $00, $00 ; … 63 byte …
sprite_data_end:
.assert sprite_data_end - sprite_data == 63, "sprite måste vara exakt 63 byte"
.assert (sprite_data % 64) == 0, "sprite måste vara 64-byte-justerad"
```

---

### KONSTANT

Liksom **en namngiven variabel som aldrig ändras** — `SCREEN = $0400`. Använd
namnet istället för att skriva råa adresser överallt, vilket gör koden lättare
att läsa och ändra senare.

| Argument  | Beskrivning                                                                                                     |
| --------- | --------------------------------------------------------------------------------------------------------------- |
| Namn      | Identifierare för konstanten (t.ex. `SCREEN`)                                                                   |
| Värde     | Numeriskt värde i den valda basen (t.ex. `0400` i HEX = adress $0400), eller ett PC-relativt uttryck (se nedan) |
| Formatera | HEX eller DEC — styr hur värdet anges och visas                                                                 |

**Syntax:**
```
.konst SKÄRM = $0400
.konst BILDAR_1S = 60
```

**Genererad kod:**
```
; .KONSTANT SKÄRM = $0400
```

**PC-relativa uttryck (`*+N` / `*-N`):**

Värdet accepterar även `*+N` eller `*-N`, där `*` är adressen för själva raden
`.const`. Detta används för att skapa ett namngivet alias för en byte inuti en
närliggande instruktion — det klassiska självmodifierande kodmönstret:

```
.const op = *+1 ; op → adress för den omedelbara operanden för nästa LDA
LDA #$00 ; $00 kommer att patchas vid körning
...
STA op ; skriver över #$00 byte → LDA läser det nya värdet nästa gång
```

CONST avger 0 byte; etiketten omvandlas vid kompilering till `current_address +
1`.

**Aritmetiska uttryck:**

Värdet accepterar allmän aritmetik, inklusive referenser till tidigare
definierade CONST-namn, hexadecimala/binära litteraler och inbyggda matematiska
funktioner:

```
.const SCREEN = $0400
.const SCREEN_END = SCREEN + 40*25 ; 1000 byte senare
.const COLOR_RAM = $D800
.const MID_X = 160
.const SIN_TABLE = round(sin(PI/8) * 127); förberäknat sinusvärde
```

**Inbyggda funktioner: ** `sin()`, `cos()`, `round()`, `max(a,b)`, `min(a,b)`,
`abs()`, konstant `PI`

Operatorer: `+ - * /` Literaler: `$FF` (hex), `%10110000` (binär) Låg/hög byte:
`lo(expr)`, `hi(expr)`

**Storlek:** 0 byte.

---

### VAR

Liksom **CONST, men automatiskt allokerad** — `VAR` reserverar nollsidig lagring
för en etikett utan att du behöver skriva in adressen. Använd den för räknare,
pekare och kortlivade tillstånd som hör hemma i ZP.

| Argument           | Beskrivning                                              |
| ------------------ | -------------------------------------------------------- |
| Namn               | Variabelnamn / etikett                                   |
| Storlek (valfritt) | Antal byte att reservera. Utelämnas för en enskild byte. |

**Syntax:**
```
.var räknare
.var timer, 2
.var lever
```

**Praktiskt exempel: **
```
.region Vars
.var räknare
.var timer, 2
.endregion

LDA #$00
STA-räknare
```

**Genererad kod:**
```
.var-räknare
```

**Storlek: ** 1 byte som standard, eller `N` byte när storlek anges.

Allokatorn går med en konfigurerbar nollsidig markör (`$02` till `$FE`) och
tilldelar nästa lediga plats. Om den begärda regionen överlappar en redan använd
etikett, avger kompilatorn en varning.

---

### Körtid IF / ELSE / ENDIF

Precis som **en riktig grenmall** — den här versionen fungerar vid körning, inte
kompileringstid. Den jämför `A`, `X` eller `Y` mot ett omedelbart värde och
genererar den korrekta `CMP` / `CPX` / `CPY` + grensekvensen åt dig.

| Argument | Beskrivning                              |
| -------- | ---------------------------------------- |
| Register | `A`, `X` eller `Y`                       |
| Operatör | `==`, `!=`, `<`, `<=`, `>`, `>=`         |
| Värde    | Omedelbart värde i HEX- eller DEC-format |

**Syntax:**
```
.om A == #$10 LDA #$07
.annars LDA #$0F
.endif
```

**Storlek:** Beror på de valda grenarna och jämförelseformuläret.

Jämförelsen är som standard osignerad. För `<=` och `>` expanderas makrot till
den kortaste ekvivalenta grenkedjan för det valda registret.

---

### MEDAN / SLUT

Liksom **en runtime-loop med ett test högst upp** — kroppen körs medan villkoret
förblir sant.

| Argument | Beskrivning                              |
| -------- | ---------------------------------------- |
| Register | `A`, `X` eller `Y`                       |
| Operatör | `==`, `!=`, `<`, `<=`, `>`, `>=`         |
| Värde    | Omedelbart värde i HEX- eller DEC-format |

**Syntax:**
```
.medan A != #$00
JSR getchar
.endw
```

**Storlek:** Beror på loopens kropp och jämförelseform.

Använd `WHILE` när loopen kan sluta innan den första iterationen är klar. Det är
motsvarigheten vid körning till den räknarbaserade `LOOP / NEXT`-hjälpen.

---

### UPPREPA / TILLS

Liksom **en runtime-loop med ett test längst ner** — kroppen körs alltid minst
en gång, sedan avgör villkoret om den ska stoppas.

| Argument | Beskrivning                              |
| -------- | ---------------------------------------- |
| Register | `A`, `X` eller `Y`                       |
| Operatör | `==`, `!=`, `<`, `<=`, `>`, `>=`         |
| Värde    | Omedelbart värde i HEX- eller DEC-format |

**Syntax:**
```
.repeat
JSR getchar
.until A == #$00
```

**Storlek:** Beror på loopens kropp och jämförelseform.

Använd `REPEAT / UNTIL` när du vill att kroppen ska utföras minst en gång före
utgångskontrollen.

---

### MEMCPY / MEMSET

Precis som **små minnesrutiner du ständigt söker efter ** — `MEMCPY` kopierar
ett sammanhängande block, `MEMSET` fyller ett område med en byte.

| Makro    | Argument                     |
| -------- | ---------------------------- |
| `MEMCPY` | `källa`, `dst`, `storlek`    |
| `MEMSET` | `adress`, `värde`, `storlek` |

**Syntax:**
```
.memcpy src=$C000, dst=$D000, storlek=$0100
.memset adr=$0400, värde=#$20, storlek=$03E8
```

**Genererad kod:** inline kopiera/fyll loopar, valda för att matcha den begärda
storleken.

Storlekar upp till 256 byte använder en kort 8-bitarsloop. Större storlekar
växlar automatiskt till en 16-bitarsräknare.

> **2.1:** Storleken måste vara känd när koden läggs ut — ett tal eller en
> konstant. En etikett som definieras senare (vars värde layouten ännu inte
> känner till) är ett fel istället för kod som inte passar på sin plats.

---

### SKRIV UT / SKRIV_UT_CHAR / SKRIV_UT_HEX / CLEAR_SCREEN / VÄNTA_KEY / FÖRDRÖJNING / SET_BORDER / SET_BG

#### SKRIVA UT

Liksom **PETSCII-utdata utan standardtexten ** — skriver ut en sträng genom
`CHROUT` med samma hantering av versaler/gemener (`lower`) som `.petscii`.

**Syntax:**
```
.print "HEJ"
.print "hej", sänk
```

#### PRINT_CHAR

Skriver ut en PETSCII-byte med numerisk kod och skickar den via `CHROUT`. Värdet
kan också vara en namngiven konstant eller etikett som omvandlas till en byte
vid monteringstillfället.

**Syntax:**
```
.print_char 65
.print_char $41
.print_char färg
```

#### PRINT_HEX

Skriver ut ett 8-bitarsvärde som hexadecimal text via den vanliga
KERNAL-utdatavägen.

**Syntax:**
```
.print_hex A
```

#### CLEAR_SCREEN

Genväg för standard C64-kontrollkoden för tydlig skärm.

**Syntax:**
```
.clear_screen
```

#### VÄNTA_NYCKEL

Väntar tills en tangent trycks ned, så att du inte behöver rulla `GETIN`-slingan
för hand varje gång.

**Syntax:**
```
.vänta_nyckel
```

#### DRÖJSMÅL

Väntar det begärda antalet bildrutiner genom en delad hjälprutin. Använd detta
för korta pauser och tidsintervall när en fullständig anpassad loop skulle vara
överdriven. Bildruteantalet kan vara ett rått tal eller en namngiven konstant,
och `.wait` är bara ett alias för `.delay`.

**Syntax:**
```
.delay 29
.wait 29
.delay bildrutor=BILDRUTOR_1S
```

#### SET_BORDER / SET_BG

Bekvämlighetsomslag för VIC-II-färgregistren. Färgvärdet kan vara ett rått tal
eller en namngiven konstant som upplöses till 0–15.

**Syntax:**
```
.set_border 6
.set_bg 0
.set_border färg
.set_bg färg
```

**Storlek:** Varje hjälpare expanderar till en liten registerskrivningssekvens
eller ett kort KERNAL-anrop.

---

### IRQ_SETUP

Ställer in en raster-IRQ-hanterare i ett steg. Makrot skriver IRQ-vektorn,
aktiverar raster-IRQ:er, ställer in linjen, inaktiverar de vanliga CIA
IRQ-källorna och återgår till normal körning med `CLI`.

| Argument  | Beskrivning                                           |
| --------- | ----------------------------------------------------- |
| Hanterare | IRQ-rutinens etikett (t.ex. `my_irq`)                 |
| Raster    | Rasterlinje i hexadecimal eller decimal (t.ex. `$FA`) |

**Syntax:**
```
.irq_setup handler=my_irq, raster=$FA
```

**Storlek:** En liten installationssekvens; den exakta längden beror på den
valda rasterlinjen.

Använd detta när du vill ha den vanliga standardbeskrivningen "SEI / install
handler / enable IRQ / CLI" utan att sprida den i programmet.

---

### RAND

Liksom ** returnerar en liten inbyggd PRNG** ett 8-bitars pseudoslumpmässigt
värde från ett kompakt nollsidigt seed-värde.

| Argument | Beskrivning                                              |
| -------- | -------------------------------------------------------- |
| Utsäde   | Valfri nollsidig seedbyte eller etikett (standard `$FB`) |

**Syntax:**
```
.rand
```

**Storlek:** Ett antal byte, beroende på vald implementeringsväg.

Generatorn är avsedd för spelupplägg, effektvariationer och snabb testdata. Den
är avsiktligt liten snarare än kryptografiskt avancerad.

---

<a id="sprite_init"></a>
### SPRITE_INIT

Ställer in en VIC-II-sprite på en rad — istället för att skriva ~6 POKE-satser i
BASIC. Ställer in spritens datapekare, slår på den, aktiverar valfritt
flerfärgsläge och ställer in dess färg.

| Argument   | Beskrivning                                                   |
| ---------- | ------------------------------------------------------------- |
| Sprite #   | Spritenummer 0–7                                              |
| Färg       | Färgindex 0–15 (C64-palett)                                   |
| Datasida   | Sprite-dataadress / 64 (t.ex. `$21` om data finns på `$0840`) |
| Flerfärgad | Växlar spritens flerfärgade bit (`$D01C`)                     |

**Syntax:**
```
.sprite_init 0, 7, 21 USD
.sprite_init 0, 7, 21 USD, flerfärgad
.sprite_init 0, 7, 21 USD, mono
```

**Genererad kod:**
```
LDA #$21 STA $07F8; spritepekarregister ($07F8 + N) LDA $D015 ORA #$01; sätt aktiveringsbit för sprite 0 STA $D015 LDA $D01C OCH #$FE; rensa flerfärgsbit för sprite 0 STA $D01C LDA #$07 STA $D027; sprite 0 färgregister
```

**Storlek:** 26 byte.

> **Sprite-datasida:** `dataadress ÷ 64`. Med standard BASIC SYS-stub placerar
> `ALIGN 64` efter `JMP main` sprite-data vid `$0840` → sida = `$21`.

---

<a id="sprite_pos"></a>
### SPRITE_POS

Liksom **`POKE 53248, x : POKE 53249, y`** i BASIC — anger en sprites
startposition. Koordinaterna bakas in vid monteringstillfället och accepterar
konstanter; för animering använd `INC`/`DEC` direkt på spritregistret.

| Argument | Beskrivning             |
| -------- | ----------------------- |
| Sprite # | Spritenummer 0–7        |
| X        | Horisontellt läge 0–319 |
| Y        | Vertikal position 0–255 |

**Syntax:**
```
.sprite_pos 0, 152, 100
```

**Genererad kod (exempel: sprite 0, X=152, Y=100):**
```
LDA #$98; X låg byte
STA $D000; sprite 0; X-register
LDA $D010
OCH #$FE; rensa X MSB för sprite 0 (X ≤ 255)
STA $D010
LDA #$64; Y = 100
STA $D001; sprite 0; Y-register
```

För X > 255 sätter makrot motsvarande bit i `$D010` istället för att nollställa
den.

**Storlek:** 18 byte.

> **Obs:** `SPRITE_POS` bakar in X/Y i koden (`LDA #$xx`). För att animera en
> sprite vid körning, använd `INC $D000` / `DEC $D000` — se exemplet
> `sprite-macro-demo`.

---

<a id="wait_raster"></a>
### VÄNTA_RASTER

Väntar på att VIC-II-elektronstrålen ska nå en specifik skanningslinje – som att
synkronisera med en TV-bildruta. Placera detta högst upp i din spelloop för att
förhindra sprite-tearing. Ingen JSR, ingen etikett behövs.

| Argument    | Beskrivning                                       |
| ----------- | ------------------------------------------------- |
| Rasterlinje | Målrasterlinje i hexagonal (t.ex. `FF` = rad 255) |

**Syntax:**
```
.wait_raster $FF
```

**Genererad kod:**
```
vänta:
LDA $D012; aktuell rasterlinje
CMP #$FF; mållinje
BNE vänta; loopa tillbaka (-7 byte)
```

**Storlek:** 7 byte (`BNE`-offsetet `$F9` = −7 pekar alltid tillbaka till
`LDA`).

> **Tips:** Placera `WAIT_RASTER` högst upp i din spelloop för att synkronisera
> med skärmen och förhindra sprite-tearing.

---

### JOYSTICK

Som att läsa **`PEEK($DC00)`** och sedan POKE:a spritens position — men på en
rad. Läser en CIA-joystickport och justerar en sprites X/Y-register därefter.
Helt inline, ingen JSR behövs.

| Argument | Beskrivning                                                   |
| -------- | ------------------------------------------------------------- |
| Hamn     | `1` = port 1 (`$DC01`) eller `2` = port 2 (`$DC00`)           |
| Sprite # | Spritenummer 0–7 (styr vilket X/Y-registerpar som uppdateras) |

**Syntax:**
```
.joystick 2, 0
```

**Genererad kod (port 2, sprite 0):**
```
LDA $DC00; läs CIA port 2 LSR; bit 0 → bär (Upp)
BCS hoppa_upp; bär set = EJ nedtryckt DEC $D001; Y−1 (flytta upp)
hoppa_upp:
LSR; bit 1 → bär (Ned)
BCS hoppa_ner INC $D001; Y+1 (flytta ned)
hoppa_ner:
LSR; bit 2 → bär (Vänster)
BCS hoppa_vänster DEC $D000; X−1 (flytta vänster)
hoppa_vänster:
LSR; bit 3 → bär (Höger)
BCS hoppa_höger INC $D000; X+1 (flytta höger)
hoppa_höger:
```

**Joystickbitmapp (aktiv-LOW — bit = 0 betyder nedtryckt):**

| Bit | Riktning | CIA-register                    |
| --- | -------- | ------------------------------- |
| 0   | Upp      | $DC00 (port 2) / $DC01 (port 1) |
| 1   | Ner      |                                 |
| 2   | Vänster  |                                 |
| 3   | Rätt     |                                 |
| 4   | Brand    | (hanteras inte av detta makro)  |

**Storlek:** 27 byte. `BCS`-offsetet är alltid `+3` (hoppar över följande 3-byte
`DEC`/`INC abs`-instruktion).

**Variabelläge — `.joystickport, vx, vy[, fire]`:** istället för att flytta en
sprite skrivs riktningen in i variabler: `vx` / `vy` = `-1` / `0` / `+1` (`$FF`
/ `$00` / `$01`), och det valfria `fire` = `1` medan knappen hålls nedtryckt,
`0` annars. Använd den för en rullande kamera, en spelare med egen fysik eller
menyer. Port `3` läser båda joystickportarna samtidigt (`LDA $DC00` / `OCH
$DC01`), så båda portarna fungerar.

```
.joystick 2, vx, vy; 35 byte
.joystick 3, vx, vy, fire; båda portarna + fire: 45 byte
```

> **Typisk användning:** Placera inuti en `gameloop`-etikett med `WAIT_RASTER`
> först:
> ```
> spelloop: WAIT_RASTER ($FF) JOYSTICK (port=2, sprite=0) JMP spelloop
> ```

---

<a id="mouse"></a>

> **2.1:** Porten måste vara känd när koden läggs ut (ett tal eller en
> konstant), eftersom port 3 gör koden 3 byte längre; en etikett som definieras
> senare är ett fel.
### MUS

Läser en Commodore 1351 proportionell mus och flyttar en sprite. Helt **inline**
— ingen JSR eller etikett behövs. Makrot väljer CIA-porten, väntar på att
SID-paddelns ingångar ska stabiliseras, avkodar sedan deltarörelsen med hjälp av
standard 1351-drivrutinsmönstret och tillämpar det på spriteregistren.

| Argument  | Beskrivning                                                               |
| --------- | ------------------------------------------------------------------------- |
| Hamn      | `1` = CIA `$DC00` bitar `7:6` = `%01`; `2` = `%10`                        |
| Sprite #  | Spritenummer 0–7                                                          |
| ZP-byte X | Nollsidig adress (hex) för att lagra föregående POTX-prov (t.ex. `FD`)    |
| ZP-byte Y | Nollsidig adress (hex) för att lagra föregående POTY-exempel (t.ex. `FE`) |

**Genererad kodform (port 1, sprite 0, ZP `$FD`/`$FE`):**

```
; CIA portval + betalning LDA $DC00 OCH #$3F ORA #$40 STA $DC00 LDX #$67
vänta: DEX BNE vänta

; X-axel — standard 7-bitars deltaavkodning i 1351-stil LDA $D419 TAY SEC SBC $FD OCH #$7F LDX #$00 CMP #$40 BCS xneg LSR A BEQ xdone STY $FD CLC ADC $D000 STA $D000 TXA ADC #$00 OCH #$01 BEQ xdone LDA $D010 EOR #$01 STA $D010 JMP xdone
xneg: ORA #$C0 CMP #$FF BEQ xdone SEC ROR DEX STY $FD CLC ADC $D000 STA $D000 TXA ADC #$00 OCH #$01 BEQ xdone LDA $D010 EOR #$01 STA $D010
xdone:

; Y-axel — samma avkodning, sedan inverterad före tillämpning
LDA $D41A TAX SEC SBC $FE AND #$7F CMP #$40 BCS yneg LSR A BEQ ydone STX $FE EOR #$FF SEC ADC $D001 STA $D001 JMP ydone
yneg:
ORA #$C0 CMP #$FF BEQ ydone SEC ROR STX $FE EOR #$FF SEC ADC $D001 STA $D001
ydone:
```

**Storlek:** 142 byte.

**Syntax:**
```
.mouse port, spriteNum, zpX, zpY
; exempel:
.mouse 2, 0, FD, FE
```

> **Viktigt:** Innan det första anropet, initiera noll-sidesbyten med de
> aktuella POTX/POTY-värdena för att undvika ett hopp på den första ramen:
> ```
> ; port 1: LDA $DC00 : OCH #$3F : ORA #$40 : STA $DC00
> ; port 2: LDA $DC00 : OCH #$3F : ORA #$80 : STA $DC00
> LDA $D419 : LSR A : OCH #$3F : STA $FD
> LDA $D41A : LSR A : OCH #$3F : STA $FE
> ```

> **Tips:** Polla musen en gång per bildruta — placera `WAIT_RASTER` i
> spelloopen före `MOUSE`.

---

<a id="sprite_col"></a>
### SPRITE_COL

Liksom **`PEEK($D01E)`** i BASIC — kontrollerar VIC-II
hårdvarukollisionsregister och talar om för dig om en sprite träffar en annan
sprite eller bakgrunden. Helt inline, ingen JSR behövs.

| Argument      | Beskrivning                                                                                                        |
| ------------- | ------------------------------------------------------------------------------------------------------------------ |
| Sprite #      | Sprite nummer 0–7 (vilken spritebit ska kontrolleras)                                                              |
| Kollisionstyp | `Sprite-Sprite ($D01E)` — kollision med en annan sprite; `Sprite-Bakgrund ($D01F)` — kollision med bakgrundsgrafik |

**Syntax:**
```
.sprite_col 0, sprite
.sprite_col 0, bakgrund
```

**Genererad kod (sprite 0, sprite–sprite):**
```
LDA $D01E; läs sprite-sprite kollisionsregister (rensar det!)
OCH #$01; isolera bit 0 (sprite 0)
; A ≠ 0 → kollision inträffade
```

**Storlek:** 5 byte.

> **Viktigt:** Avläsning av `$D01E`/`$D01F` **rensar registret**. Läs det en
> gång per bildruta och agera omedelbart på resultatet med `BEQ`/`BNE`.

**Typisk användning:**
```
gameloop:
.wait_raster $FF
.joystick 2, 0
.sprite_col 0, sprite
BEQ ingen_träff; A = 0 → ingen kollision
LDA #$02
STA $D020; röd kant = träff!
JMP gameloop
ingen_träff:
LDA #$0E
STA $D020; ljusblå kant = klar JMP gameloop
```

> **Se även:** `kollisionsdemo` exempel — grön boll (sprite #0) vs. rött kors
> (sprite #1).

---

### LADDA IN FIL

Liksom **`LOAD "fil",8`** i BASIC — laddar en fil från en D64-disk vid körning
med hjälp av KERNAL LOAD-rutinen. Använd detta för att ladda data, musik eller
extra kod från disken medan ditt program körs.

| Argument                    | Beskrivning                                                                                                                                                                                         |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Filnamn                     | Filnamn på disken (max 16 tecken, automatisk versaler; tecknen `,`, `"`, `/`, `\`, `:`, `*`, `?`, `<`, `>`, `|` filtreras)                                                                          |
| Anordning                   | Enhetsnummer 8–30 (standard `8`)                                                                                                                                                                    |
| Åsidosätt adress (valfritt) | Hexadecimal laddningsadress (t.ex. `C000`). Om angiven laddas filen till denna adress (`sec=0`, utan att PRG-rubriken används). Lämna tomt för att använda filens egen 2-byte PRG-rubrik (`sec=1`). |
| Feletikett (valfritt)       | Om den är satt genereras en `BCS`-instruktion efter JSR LOAD. Om KERNAL returnerar med carry satt (fel), hoppar exekveringen till denna etikett.                                                    |

**Syntax:**
```
.loadfile "DEMO-FÄRGER", 8
.loadfile "DEMO-FÄRGER", 8, $C000
.loadfile "DEMO-FÄRGER", 8, $C000, error_label
```

**Genererad kodstruktur:**
```
JMP skip_filename ; hoppa över det inline-filnamnet
.byte "DEMO-COLORS" ; filnamn bytes (PETSCII, 11 tecken)
skip_filename:
LDA #11 ; filnamnslängd
LDX #<filnamn ; pekare låg
LDY #>filnamn ; pekare hög
JSR $FFBD ; SETNAM
LDA #1 ; logisk fil #1
LDX #8 ; enhet 8
LDY #0 ; sek=0 (åsidosätt adress) eller #1 (filens egen adress)
JSR $FFBA ; SETLFS
LDA #0 ; LOAD-kommando (inte VERIFY)
JSR $FFD5 ; LOAD
BCS misslyckande ; (endast om feletiketten är angiven)
```

**Storlek:** `3 + filnamnslängd + 9 (SETNAM) + 9 (SETLFS) + (4 om åsidosättning)
+ 5 (LADDA) + (2 om feletikett)` byte. Minst 27 byte.

> **Viktigt:** Filnamnet lagras inbäddat i maskinkoden direkt efter en `JMP
> skip_filename`. Filnamnet på disken måste vara PETSCII i versaler — vilket
> matchar vanliga ASCII-versaler (`A`–`Z`). Makrot framtvingar detta
> automatiskt.

> **Använd alltid en feletikett** för produktionsprogram — om filen inte hittas
> sätter KERNAL flaggan "carry" och körningen går vidare till nästa steg.

> **Se även:** `loadfile-demo` exempel — demonstrerar laddning av
> `DEMO-COLORS.PRG` från en D64 med en BCS-felgren och en visuell felskärm.

---

### EXODECRUNSH

Inbyggd **Exomizer-dekomprimering**. Använd detta makro direkt efter en
`LOADFILE` som laddade en komprimerad ström i Exomizer-läge `mem` — EXODECRUNCH
packar upp den bakåt till adressen som är inbäddad i strömmen.

| Argument          | Beskrivning                                                                                     |
| ----------------- | ----------------------------------------------------------------------------------------------- |
| Avpackningsadress | Där depacker-koden finns i minnet (standard `B000`). Måste vara en 16-bitars hexadecimaladress. |

**Syntax:**
```
.exodecrunch
.exodecrunch avpackare=$B000
```

**Genererad kod (19 byte):**
```
LDA $AE ; KERNAL load-end lo (inställd av föregående LOAD)
STA $04 ; depacker src-end pekare lo
LDA $AF ; KERNAL load-end hi
STA $05 ; depacker src-end pekare hi
LDA #$36 ; BASIC ROM av ($A000-$BFFF blir RAM)
STA $01
JSR depacker ; depacker läser bakåt-till-framsidan via $04/$05
LDA #$37 ; återställ standardmappning (BASIC + KERNAL + I/O)
STA $01
```

**Hur det fungerar:**

1. KERNAL `LOAD` ($FFD5) uppdaterar ZP `$AE/$AF` för att peka ett efter den
   senast laddade byten. EXODECRUNCH kopierar detta till ZP `$04/$05`, vilket är
   den officiella Exomizer-konventionen för bakåtriktad source-end.
2. Avpackaren placeras vanligtvis vid `$B000` (inom den mappade regionen för
   BASIC ROM). Makrot växlar mellan `$01 och $36` så att processorn ser
   RAM-minnet där under JSR och sedan återställer `$01 och $37` efteråt.
3. Dekomprimeringsmåladressen **kodas in i själva den komprimerade strömmen**
   när du komprimerar med `exomizer mem -l <load> file,<target>` — depackern
   läser den från strömmens första byte.

**Depacker binärfil:** Den förbyggda bakåtriktade depackaren är
`exo-decrunch.bin` (i mappen `samples/` i C64 Visual Assembler) (477 byte, ORG
$B000). Det är en Kick Assembler-wrap av den officiella `exodecrunch.asm` med
`INC $D020` tillagd till varje läsning för en synlig kantblixteffekt under
dekomprimering. Placera den i ditt program med `.incbin` på depackaradressen.

**Rå indata:** extravärdet skickas till Exomizer som en råfil som laddas på
Dst-adressen (`fil@<Dst>`), så avpackaren skriver varje byte, med början från
den första, exakt på den adress du skrev in.

> **Se även:** `exo-multicolor-demo`-exemplet — ett fullständigt exempel från
> början till slut: LOADFILE en komprimerad flerfärgad bitmapp till $C000,
> EXODECRUNCH packar upp den till $2000, kopierar sedan skärm → $0400 och färg →
> $D800, och växlar VIC-II till flerfärgad bitmappsläge.

---

### REU_CHECK

Detekterar om en Commodore RAM-expansionsenhet (REU) är inkopplad — som att
kontrollera `PEEK($D010)` för att se om hårdvara finns. Testar genom att skriva
och läsa tillbaka två mönster till REU-registret `$DF04`.

| Argument | Beskrivning    |
| -------- | -------------- |
| Ingen    | Inga operander |

**Genererad kod (34 byte):**
```
LDA #55 USD
STA $DF04
LDA $DF04
CMP #$55
BNE misslyckas
LDA #$AA
STA $DF04
LDA $DF04
CMP #$AA
BNE misslyckas
LDA #$00
CMP #$FF ; Z=0 => REU närvarande
BNE gjort
misslyckas:
LDA #$FF
CMP #$FF ; Z=1 => ingen REU
gjort:
```
> Makrot normaliserar resultatet så att följande gren förblir enkel: `BNE`
> betyder att REU finns, `BEQ` betyder att REU saknas.

**Syntax:**
```
.reu_check
```

**Resultat i flaggor:**
- **Z = 0** (resultat ≠ 0) → REU finns → använd `BNE`
- **Z = 1** (resultat = 0) → ingen REU → använd `BEQ`

**Inga argument** — makrot genererar samma kod varje gång.

**Typisk användning:**
```assembly
.reu_check
BEQ no_reu ; hoppa över om REU inte finns
; ... REU-kod här ...
no_reu:
```

---

### REU_STASH / REU_FETCH / REU_SWAP

DMA-blocköverföring mellan C64 RAM och REU-expansionsminne — som en mycket snabb
POKE-slinga, men processorn utför inget arbete (REU-chippet kopierar data medan
processorn är stoppad). En överföring på `$1000`-byte är i praktiken omedelbar.

| Makro       | Riktning      | `$DF01`-kommando |
| ----------- | ------------- | ---------------- |
| `REU_STASH` | C64 RAM → REU | `90 dollar`      |
| `REU_FETCH` | REU → C64 RAM | `91 dollar`      |
| `REU_SWAP`  | C64 RAM ↔ REU | `92 dollar`      |

**Argument:**

| Argument   | Beskrivning                           | Exempel |
| ---------- | ------------------------------------- | ------- |
| C64-adress | Källa/destination i C64 RAM (hex)     | `C000`  |
| REU-adress | Källa/destination i REU (hex, 16-bit) | `0000`  |
| REU-banken | REU-minnesbank (0–7)                  | `0`     |
| Längd      | Antal byte att överföra (hex, 16-bit) | `1000`  |

**Syntax:**
```
.reu_stash 000 kr, 0000 kr, 0, 1000 kr
.reu_fetch 000 kr, 0000 kr, 0, 1000 kr
.reu_swap 000 kr, 0000 kr, 0, 1000 kr
```

**Genererad kod (40 byte):**
```
LDA #c64lo STA $DF02; C64-adress LO
LDA #c64hi STA $DF03; C64-adress HIGH
LDA #reuLo STA $DF04; REU-adress LO
LDA #reuHi STA $DF05; REU-adress HI
LDA #bank STA $DF06; REU bank
LDA #lenLo STA $DF07; längd LO
LDA #lenHi STA $DF08; längd HI
LDA #$00 STA $DF09; adresskontroll (fast)
LDA #$00 STA $DF0A; avbrottsmask (fast)
LDA #cmd STA $DF01; kör DMA ($90/$91/$92 = stash/fetch/swap, omedelbart)
```

> **Obs:**-kommandon använder `$90/$91/$92` (bit 4 satt = omedelbart DMA-läge).
> Skrivning till `$DF01` startar överföringen; processorn återupptar när den är
> klar.

---

### TURBO_SET

Ställer in CPU-hastigheten **Ultimate-64 (U64)** via register `$D031`. Ingen
effekt på en riktig C64 eller andra emulatorer.

**Argument:**

| Argument    | Beskrivning              | Räckvidd                                         |
| ----------- | ------------------------ | ------------------------------------------------ |
| Hastighet   | CPU-hastighetsindex      | 0 = 1 MHz … 7 ≈ 10 MHz … 15 ≈ 48 MHz             |
| Dålig linje | Emulering av dålig linje | Aktiverad (C64-kompatibel) / Inaktiverad (turbo) |

Hastighetsbyten beräknas som: `(speedIndex & 0x0F) | (badline_disabled ? 0x80 :
0x00)`.

**Genererad kod (5 byte):**
```
A9 xx LDA #speed_byte
8D 31 D0 STA $D031
```

**Syntax:**
```
.turbo_set 7,0; hastighet=7 (~10 MHz), dålig linje aktiverad. .turbo_set 15,1; hastighet=15 (~48 MHz), dålig linje inaktiverad.
```

> **Obs:** Detta makro påverkar endast U64-hårdvara. På en riktig C64 eller
> andra emulatorer skriver detta till `$D031` vilket kan påverka CIA eller
> ignoreras.

---

### SUPERCPU_DETECT

Kontrollerar om en **CMD SuperCPU**-accelerator är installerad — som
`PEEK($D0B8)` för att se om den returnerar något annat än `$FF`.

**Genererad kod (5 byte):**
```
AD B8 D0 LDA $D0B8
C9 FF CMP #$FF
```

**Resultat i flaggor:**
- **Z = 0** → SuperCPU finns → använd `BNE`
- **Z = 1** → SuperCPU hittades inte → använd `BEQ`

**Inga argument.**

**Syntax:**
```
.supercpu_detect
```

**Typisk användning:**
```assembly
.supercpu_detect
BEQ no_scpu ; hoppa över om SuperCPU inte finns
; ... SuperCPU turbokod här ...
no_scpu:
```

---

### TURBO_AKTIVERA

Slår på eller av **CMD SuperCPU turboläge**. Anropa `SUPERCPU_DETECT` först och
hoppa över detta om SuperCPU inte finns.

| Läge       | Register | Effekt                                        |
| ---------- | -------- | --------------------------------------------- |
| Aktivera   | `$D07A`  | Aktivera turbo (upp till 20 MHz med SuperCPU) |
| Inaktivera | `$D07B`  | Återgå till 1 MHz-kompatibilitetsläge         |

**Genererad kod (5 byte):**
```
A9 00 LDA #$00
8D 7A D0 STA $D07A ; (eller $D07B för inaktivering)
```

**Syntax:**
```
.turbo_enable på
.turbo_enable av
```

> **Obs:** Anropa `SUPERCPU_DETECT` först och förgrena dig runt detta makro om
> SuperCPU:n inte finns.

---

<a id="map_copy"></a>
### MAP_COPY

Kopierar en tilemapp från en källadress till skärmens RAM (och eventuellt
färg-RAM) med hjälp av en serie `LDA abs,X` / `STA abs,X`-loopar. En sida på 256
byte kopieras per loopiteration; en ofullständig sida i slutet använder `CPX
#rem / BNE` för att stoppa. Ingen JSR behövs — all kod genereras inline.

| Argument              | Beskrivning                                                                                                                                                                                                                        |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Källadress (skärm)    | Hexadress där kartdata finns efter inläsning (t.ex. `C000`)                                                                                                                                                                        |
| Skärm-RAM-destination | Vart skärmkoder ska kopieras (t.ex. `0400`)                                                                                                                                                                                        |
| Storlek (byte)        | Totalt antal byte att kopiera — vanligtvis `$03E8` = 1000 (40×25 tecken)                                                                                                                                                           |
| Färgkälla             | `auto`: färgdata följer skärmkoderna (`källa + storlek`); eller en explicit färgkälladress. Färgdata kopieras till färg-RAM-destinationen i ett andra steg. Utelämna den (och färgdestinationen) för att endast kopiera skärmkoder |
| Färg-RAM-destination  | Mål för färgdata — standard `D800` (C64 färg-RAM)                                                                                                                                                                                  |

**Genererad kod (1000-byte-karta, endast skärm):**
```
LDX #$00 LDA $C000,X; sida 0 STA $0400,X INX BNE *-9; loopar tills X blir 0 (256 iterationer) LDA $C100,X; sida 1 STA $0500,X INX BNE *-9 LDA $C200,X; sida 2 STA $0600,X INX BNE *-9 LDA $C300,X; resterande — 232 byte STA $0700,X INX CPX #$E8 BNE *-11
```

**Storlek:** `2 (LDX) + hela sidor×9 + (rest > 0 ? 11 : 0)` byte per sektion.
Kombinerat läge fördubblar det (skärmsektion + identisk färgsektion).

**Parning med kartredigeraren: **

Kartredigeraren i C64 Visual Assembler (**Spara karta + färg-RAM**) exporterar
en enda binärfil där de första `size` bytarna är skärmkoder och nästa `size`
bytarna är färg-RAM-värden. Använd `.map_copy` med `auto` som färgkälla och
källadressen där filen laddas (t.ex. med `.incbin` vid `$C000`):

```
.incbin "map-color.bin", $C000; skärmkoder $C000–$C3E7, färg $C3E8–$C7CF
; ...
.map_copy $C000, $0400, 1000, auto, $D800
```

**Syntax:**
```
.map_copy $C000, $0400, 1000; endast skärm
.map_copy $C000, $0400, 1000, auto, $D800; kombinerad (färg vid källa + storlek)
.map_copy $C000, $0400, 1000, $C3E8, $D800; explicit färgkälladress
```

---

<a id="map_copy16x16"></a>
### MAP_COPY16X16

Kopierar ett 16×16 teckenområde från ett kompakt 256-byte skärmkodblock plus ett
matchande 256-byte färg-RAM-block. Det är avsett för export av teckenuppsättning
Canvas och små kakel-/bildblock, där det skulle vara bullrigt att skriva sexton
separata MAP_COPY-rader.

**Standardlayout:**

| Data                  | Standardadress            |
| --------------------- | ------------------------- |
| 16×16 skärmkoder      | Källadress (`källa`)      |
| 16×16 färgvärden      | `källa + 256`             |
| Skärm-RAM-destination | `$0400 + rad×40 + kolumn` |
| Färg-RAM-destination  | `$D800 + rad×40 + kolumn` |

**Syntax:**
```
.map_copy16x16 3000 kr, 12, 4
.map_copy16x16 3000 kr, 12, 4, 400 kr, 3100 kr, D800 kr
```

Den korta formen kopierar skärmbyte från `$3000`, färgbyte från `$3100` och
placerar 16×16-blocket i kolumn 12, rad 4. Giltiga positioner längst upp till
vänster är `col = 0..24` och `row = 0..9`, så hela 16×16-området finns kvar på
40×25 C64-textskärmen.

**Genererat beteende:**

- Genererar sexton inline-radkopior.
- Varje rad kopierar 16 skärmbyte och 16 färgbyte.
- Ingen JSR behövs; koden genereras direkt vid makropositionen.
- Fungerar med normalt teckenläge och flerfärgsteckenläge; färg-RAM-bytena bär
  varje cells teckenfärgs-/flerfärgsaktiveringsbit.

Typisk parning med Charset Canvas:

```
* = $0801
    SEI
    LDA #$00
    STA $D021
    LDA #$05
    STA $D022
    LDA #$0D
    STA $D023
    .map_copy16x16 $3000, 12, 4
slinga:
    JMP loop

.incbin "16x16+ram+color.bin", $3000
.incbin "16x16+charset.bin", $2000
```

---

<a id="sprite_anim"></a>
### SPRITE_ANIM

Flyttar fram en sprites animationsbildruta vid varje anrop och uppdaterar
VIC-II-spritedatapekaren. Lagra en byte per bildruta i en tabell
(spritedatasidnumret = `data_address / 64`), peka SPRITE_ANIM mot den och anropa
den en gång per spelbildruta — ingen JSR behövs.

| Argument             | Beskrivning                                                                              |
| -------------------- | ---------------------------------------------------------------------------------------- |
| Sprite #             | Spritenummer 0–7                                                                         |
| Adress till ramlista | Hexadress för ramtabellen — en byte per ram, varje byte = sprite-sida (`data_addr / 64`) |
| Antal bildrutor      | Totalt antal bildrutor (1–255)                                                           |
| Ram ZP               | Noll-sidbyte som används som bildräknare (t.ex. `FB`)                                    |

**Genererad kod (sprite 0, 4 bildrutor, ZP `$FB`, lista vid `$C100`):**
```
INC $FB ; öka bildräknaren
LDA $FB
CMP #$04 ; bildräknare
BCC *+6 ; om räknare < antal, hoppa över återställning
LDA #$00
STA $FB
TAX ; X = aktuellt bildindex
LDA $C100,X ; ladda sprite-datasida för denna bildruta
STA $07F8 ; uppdatera sprite 0-pekaren ($07F8 + sprite#)
```

**Storlek:** 19 byte.

**Typisk användning:**
```
frameTable:
.byte $21, $22, $23, $24 ; 4 bildrutor vid $0840, $0880, $08C0, $0900

gameloop:
.wait_raster $FF
.sprite_anim 0, $C100, 4, $FB
JMP gameloop
```

**Syntax:**
```
.sprite_anim spriteNum, frameListAddr, frameCount, zpByte
; exempel:
.sprite_anim 0, C100, 4, FB
```

> **Tips:** Placera ramtabellen med `.rawbytes` på en fast adress. Räknarens
> ZP-byte (`$FB`) måste initieras till `$00` före det första anropet. Om din kod
> använder `$FB` till något annat, välj en ledig ZP-plats.

---

<a id="score_bcd"></a>
### SCORE_BCD

Lägger till ett fast punktvärde till en BCD-poäng på flera byte som lagras i
minnet och återger sedan varje siffra till skärmens RAM-minne som ett
skärmkodstecken. Använder decimalläget 6502 (`SED`/`CLD`) för bärsäker
BCD-aritmetik — ingen manuell bärjonglering behövs.

| Argument        | Beskrivning                                                                                     |
| --------------- | ----------------------------------------------------------------------------------------------- |
| Poängadress     | Hex-adress för BCD-poängbyten (t.ex. `C200`). Låg byte först.                                   |
| Siffror         | Antal BCD-byte (varje byte innehåller två siffror: `$99` = "99"). `4` byte = upp till 99999999. |
| Lägg till poäng | Decimalvärde att lägga till per anrop (t.ex. `100`).                                            |
| Skärmadress     | Var sifferkoderna ska skrivas (t.ex. `0400`). En byte per siffra (hög nibble först).            |

**Syntax:**
```
.score_bcd $C200, 4, 100, $0400
```

**Genererad kod (4 byte, +100 poäng, poäng vid `$C200`, skärm vid `$0400`):**
```
SED; aktivera BCD/decimalläge
CLC
LDA $C200; byte 0 (siffror 1–2)
ADC #$00; låg byte på 100 i BCD = $00
STA $C200
LDA $C201; byte 1 (siffror 3–4)
ADC #$01; mittenbyte på 100 i BCD = $01 (överföringen fortplantar sig)
STA $C201
LDA $C202
ADC #$00
STA $C202
LDA $C203
ADC #$00
STA $C203
CLD; tillbaka till binärläge

; rendera siffror
LDX #$00
siffrloop:
LDA $C200,X
PHA
LSR: LSR: LSR: LSR; hög nibble → låg nibble
ORA #$30 ; + '0' skärmkod STA $0406,X ; högerjusterad: skärmadress + (siffror*2 - 2) - X*2 PLA OCH #$0F ; låg nibble ORA #$30 STA $0407,X INX CPX #$04 BNE sifferloop
```

**Storlek:** `3 + siffror×8` byte (SED + CLC + CLD-overhead + 8 byte per
BCD-byte för ADC + displayloop).

**Syntax:**
```
.score_bcd $C200, 4, 100, $0400
```

> **Tips:** Initiera poängbyten till `$00` vid start. Poängadressen ska vara i
> noll-sid- eller absolut-RAM — inte ROM. Skärmadressen ska peka på siffercellen
> längst till vänster; siffror skrivs från vänster till höger (mest signifikanta
> byte först).

> **BCD-intervall: ** `siffror=4` byte → 8 decimalsiffror → maxpoäng 99 999 999.
> Varje byte kodar två BCD-siffror: `$00`–`$99`.

---

## 7. Syntax i KickAssembler-stil

VMA läser även de vanliga KickAssembler-formulären, så en KickAssembler-källkod
bygger ofta som den är:

- `.pc = $1000` och `*=$1000 "namn"` anger adressen (segmentnamnet ignoreras).
- `.const NAME = value` och `.label NAME = value` definierar konstanter; `.label
  NAME = *`, `.label NAME = * + 1` placerar en etikett vid (eller nära) den
  aktuella adressen.
- `.macro name(p1, p2) { … }` — en makrokropp inom klammerparenteser, förutom
  att `.macro … .endm`; `:name(args)` och `name(args)` kallar den.
- `namn: { … }`-omfång: etiketterna inuti är lokala för `namn` (`namn.etikett`
  utifrån).
- `@label`-etiketter behåller sina `@`.
- `.text "…"` utan skärmkoordinater lagrar de kodade bytena som `.byte`. Flera
  objekt kan kopplas samman med `,` eller `+`: `"…"`, `@"…"` med escape-tecknen
  `\n` `\r` `\t` `\$NN`, och `$NN` / decimalbyte. `.encoding "name"` väljer
  kodningen för följande `.text` rader: `screencode_mixed` (standard),
  `screencode_upper`, `petscii_mixed`, `petscii_upper`, `ascii`; ett tecken som
  kodningen saknar kod för är ett fel.
- Mnemoniska suffix `.abs` / `.a` och `.zp` / `.z` tvingar fram absolut eller
  sidnolladressering: `sta.abs $00FC,x`, `ldx.zp ptr,y`.
- `// …` kommentarer.

Resten av KickAssembler-språket (`.for`, `.var` / `.eval`, `.function`,
`.pseudocommand`, `#import`, `#if`, `LoadBinary`, segments …) hanteras av
Kick-förprocessorn i C64 Visual Assembler, som omvandlar ett
KickAssembler-källträd till VMA-text.

## 8. Kommandorad

Nytt i 2.1.0: `--crt` / `--crt-name` (kassett) och `--d64` / `--add` /
`--disk-name` (diskavbildning).

```
vma build <input.asm> [alternativ]
vma --help
vma --version
```

| Alternativ                   | Menande                                                                                                                                                                                                                   |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-o FIL`                     | PRG:n att skriva (standard: inmatningen med filändelsen `.prg`)                                                                                                                                                           |
| `--baskatalog katalog`       | Där `.incbin` / `.koala` / `.level` / `.sid` / `.include`-filerna slås upp först (standard: mappen för inmatningen)                                                                                                       |
| `--sök DIR`                  | En ytterligare mapp att titta i, efter baskatalogen (upprepningsbar, i ordning); en sökväg skriven på en annan maskin återgår till sitt enkla filnamn.                                                                    |
| `--ingen-grundläggande-stub` | Ingen `10 SYS…` BASIC-rad framför koden                                                                                                                                                                                   |
| `--rå`                       | Bilden ensam vid sin första ORG: ingen stub, ingen flytt till `$C000`                                                                                                                                                     |
| `--crt-FIL`                  | En Magic Desk-kassett (CRT-typ 19, 8 × 8K-banker, högst 65 408 byte): en laddare kopierar programmet till dess laddningsadress och startar det på SYS-adressen — Visual Assemblers Build CRT. Utan `-o` skrivs ingen PRG. |
| `--crt-namn NAMN`            | Patronnamnet i CRT-rubriken (standard: `VA CART`)                                                                                                                                                                         |
| `--d64 [FIL]`                | En 1541-diskavbildning med PRG på, uppkallad efter PRG (standard FIL: PRG med filändelsen `.d64`); ingen c1541 behövs. Utan `-o` skrivs ingen PRG.                                                                        |
| `--lägg till FIL`            | En ytterligare fil på disken som den är (en PRG med dess laddningsadress), namngiven efter filen (upprepningsbar, i ordning)                                                                                              |
| `--disknamn NAMN`            | Disknamnet (standard: D64:ans filnamn; ID `01`)                                                                                                                                                                           |
| `--sym FIL`                  | KickAssembler-etikettfil (`.etikettnamn=$xxxx`)                                                                                                                                                                           |
| `--jämfört med FIL`          | VICE-monitoretikettfil (`al C:xxxx .NAME`; `x64sc -moncommands FILE`)                                                                                                                                                     |
| `--dbg-FIL`                  | RetroDebugger / C64 Debugger källkarta (XML)                                                                                                                                                                              |
| `--felsöka`                  | Alla tre bredvid PRG (`out.sym`, `out.vs`, `out.dbg`)                                                                                                                                                                     |
| `--json-FIL`                 | Byggnaden som JSON: PRG, SYS-adress, symboler, upplagda rader, skrivna segment, minnesvy — eller varje fel med dess rad                                                                                                   |
| `--källsökväg NAMN`          | Huvudkällan `.dbg` namnen (standard: indata)                                                                                                                                                                              |
| `--linjekarta FIL`           | JSON-array: inmatningsrad → raden `.dbg`-namnen                                                                                                                                                                           |

Avslutningsstatus: `0` byggd, `1` kompileringsfel (`FIL:RAD: meddelande` om
standardfel, en rad per fel), `2` felaktig användning.

```
vma build game.asm -o game.prg --debug
vma build game.asm --no-basic-stub --search ../assets
vma build game.asm --crt game.crt # endast kassetten
vma build game.asm --d64 --add music.prg # game.d64 med GAME och MUSIC
```

## 9. Kända begränsningar

VMA reproducerar C64 Visual Assembler-kompilatorn byte för byte, inklusive dess
grova kanter:

- `lda.zp c` → `LDA $0C`: med `.zp` läses en symbol bestående av hexagonala
  siffror som ett tal.
- Även brödtexten i ett parameterlöst makro sätts ihop där det definieras; en
  definition före den första `* =` hamnar i början av programmet.
- `.text X, Y, "s", 80` tolkar teckenförskjutningen men använder den inte.
- Bytetalet för `.chardef` är hexadecimala (`129` = `$129`, ett fel).
- Den icke-omedelbara operanden för en runtime `.if` / `.while` / `.until` läses
  som en adress: `%bin` är ett fel och `10` är hex (`$0010`).
- DELAY-hjälperrutinen går efter den sista raden i layouten och varje
  dataavsnitt — även för en överhoppad (`.if 0`) DELAY.

Åtgärdat i 2.1 (de gav fel kod eller misslyckades tidigare): en `.const` /
`.var`-operand på nollsidan, `JMP (etikett)`, `lda $1234+1`, ett makroanrop
inuti ett makro, ett olöst TURBO_SET / SPRITE_ANIM-värde (nu ett fel), etiketter
i byten för `.data` / `.rawbytes`, en `:name`-etikett vars mål är en etikett,
storleken på JOYSTICK / MEMCPY / MEMSET från en senare etikett (nu ett fel), den
automatiska bufferten för `.data` / `.rawbytes`, och includes (om en sådan
saknas är ett fel, en inkluderad fils egna `.include` / `.incbin` / `.sid` är
laddade).
