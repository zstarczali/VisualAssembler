# VMA — Visual Macro Assembler

**Taalhandleiding · versie 2.1.0**

VMA is de 6502/6510-assembler van [C64 Visual
Assembler](https://github.com/zstarczali/VisualAssembler) — de taal van de
Expert-modus en van de tekst waarin de blokprogramma's zijn geschreven. Deze
handleiding beschrijft de taal; de editor, het blokkenpalet en de andere tools
van de app staan in de handleiding van C64 Visual Assembler.

## Inhoud

1. [Bronformaat](#1-bronformaat)
2. [Getallen en uitdrukkingen](#2-getallen-en-uitdrukkingen)
3. [Uitvoer: PRG, BASIC-stub en
   ingangspunt](#3-uitvoer-prg-basic-stub-en-ingangspunt)
4. [Adresmodi](#4-adresseringsmodi)
5. [6502 instructies](#5-6502-instructies)
6. [Richtlijnen en macro's — referentie](#6-richtlijnen-en-macro-s-referentie)
7. [KickAssembler-achtige syntaxis](#7-syntaxis-in-kickassembler-stijl)
8. [Opdrachtregel](#8-opdrachtregel)
9. [Bekende beperkingen](#9-bekende-beperkingen)

---

## 1. Bronformaat

Een VMA-bron is platte tekst, één instructie per regel. Voor mnemonics en
instructies is het hoofdlettergebruik niet van belang (`lda`, `LDA`, `.BYTE`,
`.byte`); labelnamen zijn wel hoofdlettergevoelig.

```
; a comment — so is // a comment
* = $1000                ; ORG: assemble from $1000
start:                   ; a label (the colon is required)
    lda #$06             ; an instruction: mnemonic and operand
    sta $D020
    .byte $01, $02, $FF  ; a directive starts with a dot
loop: dex                ; a label and an instruction on one line
    bne loop
    rts
```

- **Opmerkingen** beginnen met `;` of `//` en lopen door tot het einde van de
  regel (niet binnen een geciteerde tekenreeks).
- **Labels** worden geschreven als `name:` — letters, cijfers en `_`, die niet
  met een cijfer beginnen. Een label kan op een eigen regel staan of voor een
  instructie. Een naam die met een punt begint (`.loop:`) is een **lokaal
  label** (zie [Lokale (punt)labels](#lokale-gestippelde-labels)); `-` en `+` op
  zichzelf zijn **anonieme labels**, waarnaar wordt verwezen door `bne -` / `beq
  +` (de dichtstbijzijnde ervoor/erna).
- **Instructies** zijn een mnemonic en een operand; inspringen is vrij.
- **Directives** beginnen met een punt (`.byte`, `.macro`, `.if` …); `* = $xxxx`
  (of `.pc = $xxxx`) stelt het adres in.
- **Gebruikersmacro's** worden aangeroepen als `:name(args)`, `.invoke name(args)`
  aan, `.call name(args)` of `name(args)`.

## 2. Getallen en uitdrukkingen

| Formulier    | Voorbeeld      | Waarde                                                                                     |
| ------------ | -------------- | ------------------------------------------------------------------------------------------ |
| Hexadecimaal | `$D020`, `$0F` | `$` prefix                                                                                 |
| Binair       | `%00001111`    | `%` prefix                                                                                 |
| Decimale     | `255`, `40*25` | geen voorvoegsel                                                                           |
| Karakter     | `'A'`          | de code ervan (`$41`)                                                                      |
| Huidig adres | `*`            | het adres van de lijn (zie [De `*` programmateller](#de-programmateller-in-expressies)) |

In instructieoperanden worden hexadecimale getallen geschreven met `$`. In de
adresargumenten van de bibliotheekmacro's (`.rawbytes C000, …`, `.sprite_init 0,
1, 80`) wordt een getal van één tot vier cijfers als hexadecimaal gelezen.

**Operators** (in operanden, `.const`, `.fill`, `.assert`, `.if`): `+ - * / %`,
`& | ^ ~`, `<< >>`, haakjes, `<expr` (lage byte) en `>expr` (hoge byte), en in
voorwaarden `== != < > <= >=` (waar = 1, onwaar = 0). `.fill`, `.const` en
dergelijke staan ook bekend als `lo()`, `hi()`, `sin()`, `cos()`, `round()`,
`min()`, `max()`, `abs()` en `PI`.

```
.const B = 7
    lda #(B+1)*2
    lda #B & 3 | 8
    lda #~B & $FF
    ldx #'A'
    lda #<screen        ; low byte of a label
    lda #>(*+63)        ; high byte of a PC-relative address
```

## 3. Uitvoer: PRG, BASIC-stub en ingangspunt

VMA schrijft een C64 **PRG**: een laadadres van twee bytes, gevolgd door de
geheugenafbeelding. Elke ORG-sectie en elke instructie die gegevens op een eigen
adres plaatst (`.rawbytes`, `.incbin`, `.sid` …) wordt in één afbeelding
opgenomen; de tussenruimtes worden opgevuld met nullen.

- **Zonder een ORG** begint het programma bij `$0801`, waar BASIC begint.
- **BASIC SYS stub** (de standaard): een `10 SYS nnnn`-regel wordt geplaatst op
  `$0801`, zodat het programma begint met `RUN`. Een programma waarvan de eerste
  ORG `$0801` is, begint dan op `$080D`. Schakel de stub uit met
  `--no-basic-stub`; zonder deze wordt een programma op `$0801` geassembleerd
  naar `$C000`, elk ander programma blijft op zijn eerste ORG.
- **Ingangspunt: ** de SYS-regel springt naar het begin van de code, of naar het
  adres genoemd door een commentaar op de eerste regel `; Entry point: $1234`.
- **Code onder de BASIC-lijn** (een ORG lager dan `$0801` samen met de stub):
  een kleine loader start het programma en verplaatst het naar de juiste plaats,
  zodat het nog steeds begint met `RUN`.
- Een bron die begint met zijn eigen BASIC SYS-regel (`.byte $0B, $08, $0A, $00,
  $9E, …` at `$0801`) wordt als zodanig uitgezonden, zonder een tweede stub.

Vanuit de PRG maakt de opdrachtregel ook een **cartridge** en een
**schijfimage** (nieuw in 2.1.0, zie [8. Opdrachtregel](#8-opdrachtregel)):

- `--crt FILE` — een Magic Desk-cartridge (CRT-type 19, 8 × 8K-banken, maximaal
  65.408 bytes programma). Een loader in bank 0 initialiseert de KERNAL, voert
  een kopieerroutine uit vanuit RAM op `$0100–$013B` die het programma naar het
  laadadres verplaatst (waarbij banken worden gewisseld via `$DE00`), schakelt
  de cartridge uit en springt naar het entrypoint. Houd het programma buiten
  `$0100–$013B` en de nulpaginabytes `$02–$04` / `$FB–$FE` die de loader
  gebruikt.
- `--d64 [FILE]` — een 1541-schijfimage (35 sporen) met de PRG die ernaar is
  vernoemd, plus de `--add`-bestanden, ingedeeld zoals de 1541 DOS ze schrijft;
  geen c1541 nodig.

---

## 4. Adresseringsmodi

Elke 6502-instructie ondersteunt een of meer adresseermodi. VMA kiest de modus
op basis van de manier waarop de operand is geschreven.

| Modus            | Label          | Voorbeeld     | Beschrijving                                                                              |
| ---------------- | -------------- | ------------- | ----------------------------------------------------------------------------------------- |
| **impliciet**    | Impliciet      | `NOP`         | Geen operand; de instructie is op zichzelf staand.                                        |
| **onmiddellijk** | Onmiddellijk   | `LDA #$FF`    | Inline constante; de assembler voegt `#` automatisch toe                                  |
| **nulPagina**    | Nul pagina     | `LDA $10`     | Enkelbyte-adres op pagina nul (0–255)                                                     |
| **nulPaginaX**   | Nul pagina, X  | `LDA $10,X`   | Paginaadres nul + X-registeroffset (resultaat loopt door naar pagina 0)                   |
| **nulPaginaY**   | Nulpagina, Y   | `LDX $FB,Y`   | Pagina-adres nul + Y-registeroffset                                                       |
| **absoluut**     | Absoluut       | `LDA $0400`   | Volledig 16-bits geheugenadres                                                            |
| **absoluteX**    | Absoluut, X    | `LDA $0400,X` | 16-bits adres + X-registeroffset                                                          |
| **absoluteY**    | Absoluut, Y    | `LDA $0400,Y` | 16-bits adres + Y-registeroffset                                                          |
| **relatief**     | Relatief/Label | `BNE loop`     | Voor instructies aan een filiaal: voer een labelnaam of doeladres in.                     |
| **indirectX**    | Indirect, X    | `LDA ($FB,X)` | Indirecte zoekopdracht met indexering op nulpagina (operand = adres op nulpagina, 1 byte) |
| **indirectY**    | Indirect, Y    | `LDA ($FB),Y` | Indirecte indexering op nulpagina (operand = adres op nulpagina, 1 byte)                  |
| **indirect**     | Indirect       | `JMP ($0100)` | Indirect; alleen bruikbaar met JMP                                                        |

### Constanten op de nulpagina

Een operand die alleen uit constanten bestaat (`.const`, `name = value`, a
`.var`) die in een byte past, neemt de **zero-page**-modus van de instructie
aan, precies zoals het getal dat zou doen: na `.const zp = $FB`, wordt `lda zp`
geassembleerd tot `A5 FB` (2 bytes, 3 cycli) en `lda zp,x` tot `B5 FB`. Een
modus waarin de instructie geen nulpagina-vorm heeft, blijft absoluut (`lda
zp,y` → `B9 FB 00`). Een label wordt niet versmald — het adres ervan is pas na
de lay-out bekend — en `lda.abs zp` dwingt de absolute modus af. Een getal
behoudt de breedte waarmee het is geschreven: `$FB` is nulpagina, `$00FB`
absoluut. *(Nieuw in 2.1.)*

### Label expressies als operanden

Elke operand die een adres of directe waarde accepteert, accepteert ook
rechtstreeks een **constante naam** (een `.const` of een label). Daarnaast kunt
u **label+offset** of **label−offset** expressies gebruiken om te verwijzen naar
een adres ten opzichte van een benoemde constante:

| Syntaxis         | Voorbeeld                         | Beschrijving                                                                                                                 |
| ---------------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `label`          | `STA screen_ram,X`                | Wordt opgelost naar de label-/constante waarde                                                                               |
| `label+$hex`     | `STA screen_ram+$0100,X`          | Labeladres plus een hexadecimale offset                                                                                      |
| `label+decimal` | `STA screen_ram+256,X`            | Labeladres plus een decimale offset                                                                                          |
| `label-$hex`     | `LDA table-$10`                   | Labeladres min een hexadecimale offset                                                                                       |
| `$hex+expr`      | `LDA $1234+1`, `STA $0400+40*2,X` | Elke uitdrukking van getallen, labels en constanten *(2.1)*                                                                  |
| `(label)`        | `JMP (vector)`, `JMP (table+2)`   | Indirecte sprong via een label of een expressie *(2.1)*                                                                      |
| `#<label`        | `LDA #<screen_ram`                | Laagste byte van het labeladres                                                                                              |
| `#>label`     | `LDA #>screen_ram`             | Hoogste byte van het labeladres                                                                                              |
| `*`              | `BNE *`                           | Huidige programmateller (het eigen adres van de instructie); sprongen met `*` genereren een oneindige zelflus (offset `$FE`) |

**Voorbeeld — wis twee schermpagina's met behulp van een CONST:**
```
; .CONST screen_ram = $0400
    LDX #$00
clear:
    STA screen_ram,X
    STA screen_ram+$0100,X
    DEX
    BNE clear
```

### De `*` programmateller in expressies

`*` is niet langer beperkt tot de volledige operand — het kan ** overal binnen
een operandexpressie voorkomen ** en staat voor het adres van de instructie
waarop het is geschreven. Het wordt tijdens de assembleertijd opgelost ten
opzichte van het werkelijke adres van die instructie, dus er is geen label nodig
voor korte relatieve sprongen of PC-relatieve gegevenslezingen.

| Syntaxis            | Voorbeeld                  | Betekenis                                           |
| ------------------- | -------------------------- | --------------------------------------------------- |
| `*`                 | `BNE *`                    | Spring naar zichzelf (oneindige lus, offset `$FE`)  |
| `*-n` / `*+n`       | `BNE *-5`, `BEQ *+4`       | Spring ten opzichte van de huidige pc met *n* bytes |
| `JMP *+n`           | `JMP *+20`                 | Absolute sprong berekend vanaf de huidige pc        |
| `#<*` / `#>*` | `LDA #<*`, `LDA #>*` | Laagste/hoogste byte van de huidige pc              |
| `#>(*+n)`        | `LDA #>(*+63)`          | Lage/hoge byte van een PC-relatief adres            |

**PC versus vermenigvuldiging.** `*` wordt alleen als programmateller behandeld
wanneer deze zich in *waardepositie* bevindt — aan het begin van de expressie,
of direct na een operator, `(`, `,`, `<`, `>` of witruimte. Een `*` die
volgt op een getal, `)` of een identifier is gewone vermenigvuldiging, dus
`LDA table*2` en `CONST_A*4` blijven ongewijzigd.

**Waar het werkt.** Elke operand die al een expressie accepteert:
vertakkingsdoelen, `JMP` / `JSR`, `LDA`/`STA`/… absolute en geïndexeerde,
directe lage/hoge byte-operatoren, en de `.assert`-expressie. `*` verandert
nooit de grootte van een instructie, dus het is veilig in elke adresseermodus.

### Lokale (gestippelde) labels

Een label waarvan de naam begint met een punt — `.loop`, `.skip`, `.done` — is
een **lokaal label**. Het behoort tot het bereik van het dichtstbijzijnde
voorafgaande **globale** (niet-puntige) label en wordt intern `<global>.<name>`.
Twee lokale labels met dezelfde korte naam onder verschillende globale labels
**botsen niet**.

```
DrawSprite:
    LDX #0
.loop:                 ; == DrawSprite.loop
    LDA SpriteData,X
    STA $2000,X
    INX
    CPX #63
    BNE .loop          ; resolves within DrawSprite
    RTS

ClearScreen:
    LDX #0
.loop:                 ; == ClearScreen.loop — no clash
    STA $0400,X
    INX
    BNE .loop
    RTS
```

- Binnen een bereik kun je naar een lokaal label verwijzen als `.name`.
- Vanuit een andere scope kun je er expliciet naar verwijzen als `Global.name`
  (bijv. `JMP ClearScreen.loop`).
- Een `.name` die vóór een globaal label wordt geschreven, blijft een gewoon
  label op het hoogste niveau, zoals `.name`.

### Operandlabels voor zelfmodificerende code

Voeg `label:` toe aan het voorvoegsel van de operand van een instructie om een
label op de **operandbyte** te plaatsen in plaats van op de opcode. De
instructie wordt samengesteld uit alles wat na de dubbele punt komt.

```
setup:
    LDA value:#$00     ; 'value' -> address of the #$00 operand byte
    ...
patch:
    LDA #new
    STA value          ; writes the operand byte directly — classic SMC
```

`value` wijst naar `<instructieadres> + 1` (de eerste operandbyte), voor elke
adresseermodus. Dit vervangt het oudere `STA-instructie+1` / `instructie: LDA
#$00`-patroon.

---

## 5. 6502 instructies

### Gegevensverplaatsing

| Ezelsbruggetje | Beschrijving          | Modi                                                                          |
| -------------- | --------------------- | ----------------------------------------------------------------------------- |
| `LDA`          | Belastingsaccumulator | onmiddellijk, nulPagina, absoluut, absoluutX, absoluutY, indirectX, indirectY |
| `LDX`          | Laad X-register       | onmiddellijk, nulpagina, nulpaginaY, absoluut, absoluutY                      |
| `LDY`          | Laad Y-register       | onmiddellijk, nulpagina, absoluut, absoluteX                                  |
| `STA`          | Winkelaccumulator     | zeroPage, absolute, absoluteX, absoluteY, indirectX, indirectY                |
| `STX`          | Winkel X kassa        | nulPagina, nulPaginaY, absoluut                                               |
| `STY`          | Winkel Y kassa        | nulPagina, absoluut                                                           |

### Rekenkundig

| Ezelsbruggetje | Beschrijving             | Notities                                                                  |
| -------------- | ------------------------ | ------------------------------------------------------------------------- |
| `ADC`          | Voeg toe met meenemen    | Stel de carry-eigenschap in met `SEC` vóór gebruik in de meeste gevallen. |
| `SBC`          | Aftrekken met overdracht | Stel de overdracht in met `SEC` vóór de aftrekking.                       |
| `INC`          | Geheugen vergroten       | —                                                                         |
| `DEC`          | Verminder het geheugen   | —                                                                         |
| `CMP`          | Vergelijk met A          | Stelt vlaggen in; wijzigt A niet.                                         |
| `CPX`          | Vergelijk met X          | —                                                                         |
| `CPY`          | Vergelijk met Y          | —                                                                         |

### Logica

| Ezelsbruggetje | Beschrijving                                                            |
| -------------- | ----------------------------------------------------------------------- |
| `AND`           | Logische EN met accumulator                                             |
| `ORA`          | Logische OF met accumulator                                             |
| `EOR`          | Exclusieve OF met accumulator                                           |
| `BIT`          | Test de bits in het geheugen tegen A (stelt de N-, V- en Z-vlaggen in). |

### Sprongen en takken

| Ezelsbruggetje | Beschrijving                                                  |
| -------------- | ------------------------------------------------------------- |
| `JMP`          | Onvoorwaardelijke sprong (absoluut of indirect)               |
| `JSR`          | Spring naar subroutine (slaat het retouradres op de stack op) |
| `RTS`          | Terugkeer uit subroutine                                      |
| `RTI`          | Terugkeer van onderbreking                                    |
| `BNE`          | Splitsen indien niet gelijk (Z=0)                             |
| `BEQ`          | Takken indien gelijk (Z=1)                                    |
| `BCC`          | Branch if Carry Clear (C=0)                                   |
| `BCS`          | Branch if Carry Set (C=1)                                     |
| `BMI`          | Branch if Minus (N=1)                                         |
| `BPL`          | Branch if Plus (N=0)                                          |
| `BVC`          | Vertakking indien overloop wissen (V=0)                       |
| `BVS`          | Vertakking als de set overloopt (V=1)                         |

#### LBNE / LBEQ / … (Lange takken)

Acht pseudo-operaties gedragen zich als voorwaardelijke sprongen, maar bereiken
**elk adres**, niet alleen −128…+127. Elk ervan assembleert tot een omgekeerde
sprong die een 3-byte `JMP` overslaat — altijd **5 bytes**:

```
LBEQ done      ; assembles to:   BNE *+3   ($D0 $03)
               ;                 JMP done  ($4C lo hi)
```

| Lange operatie | Voorwaarde            | Uitgestoten als        |
| -------------- | --------------------- | ---------------------- |
| `LBNE`         | niet gelijk aan (Z=0) | `BEQ *+3 / JMP target`   |
| `LBEQ`         | gelijk (Z=1)          | `BNE *+3 / JMP target` |
| `LBCC`         | carry clear (C=0)     | `BCS *+3 / JMP target`   |
| `LBCS`         | draagset (C=1)        | `BCC *+3 / JMP target`   |
| `LBMI`         | min (N=1)             | `BPL *+3 / JMP target`   |
| `LBPL`         | plus (N=0)            | `BMI *+3 / JMP target`   |
| `LBVC`         | overflow clear (V=0)  | `BVS *+3 / JMP target`   |
| `LBVS`         | overloopset (V=1)     | `BVC *+3 / JMP target`   |

- Operand: een label, een `*`-expressie of een letterlijk adres — hetzelfde als
  een normale vertakkingsdoel.
- Kosten: 5 bytes en 1 extra cyclus op het gekozen pad in vergelijking met een
  korte sprong. Er is geen automatische promotie van een korte sprong — je kiest
  expliciet voor `LBxx`.
- Wanneer een gewone sprong (`BNE`, `BEQ`, …) buiten het bereik valt, geeft de
  compilerfout nu de exacte overschrijding aan en suggereert de overeenkomende
  `LBxx`.

### Registratie van bewerkingen

| Ezelsbruggetje | Beschrijving                   |
| -------------- | ------------------------------ |
| `TAX`    | Overdracht A → X               |
| `TAY`          | Overdracht A → Y               |
| `TXA`          | Overdracht X → A               |
| `TYA`          | Overdracht Y → A               |
| `TSX`          | Overdrachtspunt naar stack → X |
| `TXS`          | Overdracht X → Stackpointer    |
| `INX`          | Verhoog X                      |
| `DEX`          | Verminder X                    |
| `INY`          | Verhoog Y                      |
| `DEY`          | Verminder Y                    |

### Shift & Rotate

| Ezelsbruggetje | Beschrijving                           |
| -------------- | -------------------------------------- |
| `ASL`          | Rekenkundige verschuiving naar links   |
| `LSR`          | Logische verschuiving naar rechts      |
| `ROL`          | Draai naar links door de Carry-functie |
| `ROR`          | Draai naar rechts tijdens het dragen.  |

### Stapel

| Ezelsbruggetje | Beschrijving                             |
| -------------- | ---------------------------------------- |
| `PHA`          | Plaats de accumulator op de stapel.      |
| `PHP`          | Plaats de processorstatus op de stack.   |
| `PLA`          | Haal de accumulator uit de stapel.       |
| `PLP`          | Haal de processorstatus op uit de stack. |

### Systeem / Vlaggen

| Ezelsbruggetje | Beschrijving                                     |
| -------------- | ------------------------------------------------ |
| `CLC`          | Vlag voor het dragen van een Clear Carry-vlag    |
| `CLD`          | Decimale modus wissen                            |
| `CLI`          | Wis de onderbrekingsfunctie                      |
| `CLV`          | Wis de overloopvlag                              |
| `SEC`          | Stel de draagvlag in                             |
| `SED`          | Decimale modus instellen                         |
| `SEI`          | Stel de onderbrekingsfunctie in op uitschakelen  |
| `NOP`          | Geen operatie                                    |
| `BRK`          | Geforceerde onderbreking / software-onderbreking |

### Illegale / niet-gedocumenteerde instructies

Deze chips zijn geschikt voor geavanceerd gebruik. Gebruik ze met zorg, want het
gedrag kan per chip verschillen.

`LAX`, `SAX`, `DCP`, `ISC`, `SLO`, `RLA`, `SRE`, `RRA`, `ANC`, `ALR`, `ARR`,
`AXS`, en de `NOP`-vormen die een operand lezen: `NOP #$nn` ($80), `NOP $nn`
($04), `NOP $nn,X` ($14), `NOP $nnnn` ($0C), `NOP $nnnn,X` ($1C)

---

## 6. Richtlijnen en macro's — referentie

Richtlijnen sturen de assemblage aan (labels, data, origin, voorwaarden,
gebruikersmacro's); de bibliotheekmacro's voeren veelvoorkomende C64-taken in
één regel uit — in plaats van 10-20 instructies handmatig te schrijven, schrijf
je één regel en de assembler genereert de code. Zie ze als ingebouwde
subroutines.

---

### LABEL

Net als een **regelnummer in BASIC** — maar dan met een naam in plaats van een
nummer. Springdoelen voor `JMP`, `JSR`, `BNE`, enz.

| Argument  | Beschrijving                                            |
| --------- | ------------------------------------------------------- |
| Labelnaam | Identificatiecode gebruikt in `JMP`, `JSR`, `BNE`, enz. |

**Syntaxis:**
```
loop:
```

**Gegenereerde code:**
```
loop:  ; $0820
```

Het huidige adres wordt als commentaar weergegeven. Labels hebben een grootte
van **0 bytes**.

---

### COMMENT

Net als **REM in BASIC** — een notitie voor jezelf die de assembler volledig
negeert.

**Syntaxis:**
```
; Your comment text here
```

**Gegenereerde code:**
```
; Your comment text here
```

---

### BYTE

Net als **DATA in BASIC** — slaat een lijst met onbewerkte byte-waarden direct
in het programma op.

| Argument | Beschrijving                                                                |
| -------- | --------------------------------------------------------------------------- |
| Operande | Door komma's gescheiden byte-waarden (bijv. `$01, $02, $FF` of `1, 2, 255`) |

**Syntaxis:**
```
.byte $01, $02, $FF
```

**Gegenereerde code:**
```
    .byte $01, $02, $FF
```

** Referenties naar lage/hoge byte-labels: ** BYTE accepteert tokens in
KickAssembler/ca65-stijl `<label` (lage byte) en `>label` (hoge byte) naast
numerieke waarden. De assembler lost het labeladres op tijdens het compileren en
voegt de juiste byte in. Voorbeeld:

```
    .byte <frame_0, >frame_0, <frame_1, >frame_1
```

Hierin wordt de lage byte van het adres van `frame_0` opgeslagen, vervolgens de
hoge byte, en daarna hetzelfde voor `frame_1`. Handig voor het maken van
sprongtabellen en adreslijsten.

**Grootte:** Aantal bytes in de lijst.

---

### WORD

Net als **DATA in BASIC, maar dan voor 16-bits getallen **. Elke waarde wordt
opgeslagen als twee bytes (eerst de lage byte, dan de hoge byte — 6502
little-endian volgorde).

| Argument | Beschrijving                                                   |
| -------- | -------------------------------------------------------------- |
| Operande | Door komma's gescheiden 16-bits waarden (bijv. `$0400, $C000`) |

**Syntaxis:**
```
.word $0400, $C000
```

**Gegenereerde code:**
```
    .word $0400, $C000
```

**Grootte:** 2 bytes per woord.

---

### FILL

Zoals `FOR I=1 TO N : POKE addr+I, val : NEXT` — vult een geheugenblok met
dezelfde byte, in één regel. Ideaal voor het wissen van gebieden of het vooraf
vullen van tabellen.

| Argument | Beschrijving                                            |
| -------- | ------------------------------------------------------- |
| Operande | `count,value` — bijv. `256,0` vult 256 bytes met nullen |

**Syntaxis:**
```
.fill 256, $00
```

**Gegenereerde code:**
```
    .fill 256, $00
```

**Expressiesyntaxis:** Zowel `count` als `value` accepteren rekenkundige
expressies. Je kunt verwijzen naar CONST-namen, hexadecimale/binaire letterlijke
waarden gebruiken en ingebouwde wiskundige functies aanroepen:

| Uitdrukking                 | Betekenis                                              |
| --------------------------- | ------------------------------------------------------ |
| `TILE_COUNT, $00`         | tellen vanaf een CONST, waarde hexadecimaal letterlijk |
| `40*25, 0`                  | inline vermenigvuldiging                               |
| `round(sin(PI/4)*255), $80` | trigonometrie                                          |

**Ingebouwde functies:** `sin()`, `cos()`, `round()`, `max(a,b)`, `min(a,b)`,
`abs()`, constant `PI`

Operatoren: `+  -  *  /` Literalen: `$FF` (hex), `%10110000` (binair)
Laagste/hoogste byte: `lo(expr)`, `hi(expr)`

**Grootte:** De telwaarde in bytes.

---

### ALIGN

Schuift het huidige adres naar voren naar de volgende schone grens door
nulopvullingsbytes in te voegen. De C64 vereist dat spritegegevens beginnen op
een grens van 64 bytes — `ALIGN 64` regelt dat automatisch.

| Argument | Beschrijving                                                                   |
| -------- | ------------------------------------------------------------------------------ |
| Grens    | Uitlijningswaarde — bijv. `64` (spritegrens), `256` (pagina), `$2000` (bitmap) |

**Syntaxis:**
```
.align 64
.align $2000
```

**Gegenereerde code:**
```
    ; ALIGN 64 → $0840 (12 bytes padding)
```

**Grootte:** Dynamisch — afhankelijk van de huidige programmatellerpositie.

> **Tip:** Gebruik `ALIGN 64` vóór spritegegevens, `ALIGN 256` om ervoor te
> zorgen dat tabellen pagina-uitgelijnd zijn.

---

### TEXT

Net als **PRINT AT** — schrijft tekst rechtstreeks naar het C64-scherm op een
bepaalde kolom en rij, zonder de kernel te gebruiken. Het genereert één
LDA/STA-paar per teken, gericht op het scherm-RAM op `$0400`.

| Argument          | Beschrijving                                                    |
| ----------------- | --------------------------------------------------------------- |
| Tekst             | De weer te geven tekenreeks                                     |
| X                 | Kolom (0–39)                                                    |
| Y                 | Rij (0–24)                                                      |
| Label (optioneel) | Kent een label toe dat verwijst naar het berekende schermadres. |
| `lower`           | Optionele vlag — zie hieronder                                  |

**Tekensetmodi:**

De C64 heeft twee tekensets die tijdens het uitvoeren van het spel kunnen worden
geselecteerd:

| Modus                                              | $D018 bit 1 | Hoofdletterinvoer                | Invoer van kleine letters            |
| -------------------------------------------------- | ----------- | -------------------------------- | ------------------------------------ |
| **Hoofdletters/afbeeldingen** (standaard)          | 0           | `A`–`Z` → schermcodes $01–$1A ✓  | ook als hoofdletter behandeld        |
| **Kleine letters/hoofdletters** (na CHARSET lower) | 1           | `A`–`Z` → $01–$1A (hoofdletters) | `a`–`z` → $41–$5A (kleine letters) ✓ |

- **Hoofdlettertekenset (standaard):** Typ wat u in hoofdletters wilt zien.
  `"HELLO"` wordt weergegeven als `HELLO`. Invoer in kleine letters wordt
  toegewezen aan hoofdlettercodes op het scherm.
- **Tekenset voor kleine letters (`lower`):** Typ de exacte
  hoofdlettergevoeligheid die u wilt zien. `"hello"` → weergave in kleine
  letters, `"HELLO"` → weergave in hoofdletters. Vereist een
  runtime-tekensetwissel voordat het scherm wordt beschreven (gebruik de macro
  **CHARSET lower**).

**Gegenereerde code (hoofdlettermodus, `"HELLO"`):**
```
    LDA #$08      ; 'H' screen code $08
    STA $0400
    LDA #$05      ; 'E' screen code $05
    STA $0401
    ...
```

**Syntaxis:**
```
.text 0, 2, "HELLO"           ; uppercase charset (default)
.text 0, 2, "hello", lower    ; lowercase charset
```

Tekens worden gecodeerd als **schermcodes** (niet PETSCII). **Grootte:**
`text.length × 5` bytes (LDA + STA per teken).

---

### STRING

Net zoals **POKE een string** in een willekeurig geheugenadres tijdens runtime.
Genereert LDA/STA-paren die de schermcode van elk teken naar opeenvolgende
adressen kopiëren.

| Argument          | Beschrijving                                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------------------- |
| Tekst             | De te schrijven tekenreeks                                                                              |
| Adres             | Doelgeheugenadres — `$C000` hex of een **labelnaam**                                                    |
| Label (optioneel) | Kent een label toe dat verwijst naar het doeladres.                                                     |
| Verschuiving      | Hexadecimale waarde (00–FF) toegevoegd aan elke byte van de schermcode (bijv. `$80` = omgekeerde video) |
| `lower`           | Optionele vlag — dezelfde betekenis als TEXT (zie het gedeelte TEXT)                                    |

**Syntaxis:**
```
.string $C000, "HELLO"                  ; uppercase charset (default)
.string $C000, "hello", lower           ; lowercase charset
.string $C000, "HELLO", 80             ; with shift (reverse video)
.string $C000, "hello", 80, lower      ; shift + lowercase
.string $C000, "HELLO" :my_string      ; with macroLabel
```

**Gegenereerde code:**
```
    LDA #$08      ; 'H' screen code
    STA $C000
    LDA #$05      ; 'E' screen code
    STA $C001
    ...
```

Tekens worden gecodeerd als **schermcodes** (niet PETSCII). De optionele
**Shift**-waarde wordt aan elke byte toegevoegd, bijvoorbeeld `$80` voor
omgekeerde video. **Grootte:** `text.length × 5` bytes (één LDA + één STA per
teken).

---

### DATA

Net als een **POKE-lus** — schrijft een lijst met ruwe bytes naar een
geheugenadres tijdens de uitvoering, één LDA/STA-paar per byte.

| Argument          | Beschrijving                                         |
| ----------------- | ---------------------------------------------------- |
| Bytes             | Door komma's gescheiden byte-waarden                 |
| Adres             | Doelgeheugenadres — `$C000` hex of een **labelnaam** |
| Label (optioneel) | Kent een label toe dat verwijst naar het doeladres.  |

**Syntaxis:**
```
.data $C000, $01, $02, $03          ; hex address
.data my_buf, $01, $02, $03         ; label address
.data $C000, $01, $02, $03 :mydata  ; with macroLabel
```

**Gegenereerde code:**
```
    LDA #$01
    STA $C000
    LDA #$02
    STA $C001
    ...
```

**Grootte:** `byte_count × 5` bytes (één LDA + één STA per byte).

> **2.1:** de bytes kunnen labels benoemen: `.data $2010, <target, >target`
> schrijft het adres van `target`, ook van een later gedefinieerd label. Het
> `:name` label van de macro kan verwijzen naar een doeladres dat zelf een label
> is.

---

### RAWBYTES

Net als **DATA die direct in het geheugen wordt geladen** — helemaal geen
runtime-code. De bytes zijn aanwezig vanaf het moment dat de PRG wordt geladen,
nog voordat je code begint. Gebruik dit voor sprite-data, level-maps,
opzoektabellen, alles wat gewoon op een specifiek adres moet staan.

| Argument          | Beschrijving                                         |
| ----------------- | ---------------------------------------------------- |
| Bytes             | Door komma's gescheiden byte-waarden                 |
| Adres             | Doelgeheugenadres — `$C000` hex of een **labelnaam** |
| Label (optioneel) | Kent een label toe dat verwijst naar het doeladres.  |

**Syntaxis:**
```
.rawbytes $C000, $00, $00, $00      ; hex address
.rawbytes sprite_data, $00, $00     ; label address
.rawbytes $0C50, $00, $00 :nev      ; with macroLabel — other code can use LDA nev,X
```

**Grootte in code: ** 0 bytes. De gegevens worden op het opgegeven adres in de
uitvoer geplaatst.

> **DATA vs RAWBYTES:** DATA genereert LDA/STA-code die bytes tijdens runtime
> kopieert (langzamer, maar werkt als de data dynamisch moet zijn). RAWBYTES
> plaatst de bytes direct — geen code, direct, geen kosten.

> **2.1:** De bytes kunnen labels benoemen (`.rawbytes $2000, <target, >target`
> — een pointertabel); het label `:name` kan naar een label wijzen als het
> doeladres, ook een label dat later wordt gedefinieerd. Als bufferargument van
> een macro nemen de bytes hun eigen ruimte in de buffers in na het programma.

---

### RAWTEXT

Net als RAWBYTES, maar dan voor tekst: de tekenreeks wordt gecodeerd als
schermcodes en de bytes worden op een vast adres geplaatst met **geen
runtimecode**. De tekst is direct in het geheugen beschikbaar zodra de PRG wordt
geladen.

| Argument          | Beschrijving                                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------------------- |
| Tekst             | Te coderen tekenreeks                                                                                   |
| Adres             | Doelgeheugenadres — `$C000` hex of een **labelnaam**                                                    |
| Label (optioneel) | Kent een label toe dat verwijst naar het doeladres.                                                     |
| Verschuiving      | Hexadecimale waarde (00–FF) toegevoegd aan elke byte van de schermcode (bijv. `$80` = omgekeerde video) |
| `lower`           | Optionele vlag — dezelfde betekenis als TEXT (zie het gedeelte TEXT)                                    |

**Syntaxis:**
```
.rawtext $C000, "HELLO"                 ; uppercase charset (default)
.rawtext $C000, "hello", lower          ; lowercase charset
.rawtext $C000, "HELLO", 80            ; with shift (reverse video)
.rawtext $C000, "hello", 80, lower     ; shift + lowercase
.rawtext $0400, "HELLO" :my_text       ; with macroLabel
```

**Gegenereerde code:**
```
; .rawtext "HELLO" -> $C000
; $C000
    .byte $08, $05, $0C, $0C, $0F   ; H E L L O (uppercase screen codes)

; .rawtext "hello", lower -> $C000
; $C000
    .byte $48, $45, $4C, $4C, $4F   ; h e l l o (lowercase screen codes $41–$5A range)
```

**Grootte in code: ** 0 bytes. De gegevens worden op het opgegeven adres in de
uitvoer geplaatst.

> **STRING vs RAWTEXT:**STRING genereert LDA/STA-code die de tekst tijdens
> runtime kopieert. RAWTEXT bakt de bytes in de PRG tijdens het laden — geen
> code, geen wachttijd.

---

### PETSCII

Net als **RAWBYTES maar voor KERNAL-uitvoer** — codeert de tekenreeks als
PETSCII-bytes (compatibel met CHROUT op `$FFD2`) en plaatst deze op een vast
adres zonder runtime-code. Gebruik dit wanneer u tekens wilt afdrukken via `JSR
$FFD2` in een lus, en merk op dat `.print` dezelfde encoder en `lower`-vlag
gebruikt.

> **PETSCII versus schermcodes:** PETSCII en schermcodes zijn twee verschillende
> coderingen. Schermcode `$01` = letter A; PETSCII `$41` = letter A (via
> CHROUT). Gebruik PETSCII alleen bij het afdrukken via de KERNAL; gebruik
> TEXT/STRING/RAWTEXT om direct naar het scherm-RAM te schrijven.

| Argument          | Beschrijving                                         |
| ----------------- | ---------------------------------------------------- |
| Tekst             | Tekst die als PETSCII-bytes moet worden gecodeerd.   |
| Adres             | Doelgeheugenadres — `$C000` hex of een **labelnaam** |
| Label (optioneel) | Kent een label toe dat verwijst naar het doeladres.  |
| `lower`           | Optionele vlag — zie hieronder                       |

**Tekensetmodi:**

| Modus                                 | Invoer in hoofdletters (`A`–`Z`)                                                                                                              | Invoer in kleine letters (`a`–`z`) |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| **Hoofdletters (standaard)**          | `$41`–`$5A` (PETSCII hoofdletters via CHROUT)                                                                                                 | ook afgebeeld op `$41`–`$5A`       |
| **Kleine letters (`lower`)** | Alfabetische letters worden opnieuw toegewezen zodat de zichtbare hoofdlettergevoeligheid consistent blijft in de kleine/hoofdlettertekenset. | Dezelfde regel                     |

**Syntaxis:**
```
.petscii $C000, "HELLO"              ; uppercase PETSCII (default)
.petscii $C000, "hello", lower       ; lowercase PETSCII ($61–$7A)
.petscii $C000, "HELLO", null        ; with null terminator
.petscii $C000, "hello", lower, null ; lowercase + null terminator
.petscii $C000, "HELLO" :my_msg      ; with macroLabel
```

**Gegenereerde bytes (hoofdletters, `"HELLO"`):**
```
; $C000
    .byte $48, $45, $4C, $4C, $4F   ; H E L L O (PETSCII $41–$5A range)
```

**Grootte in code: ** 0 bytes. De gegevens worden op het doeladres geplaatst als
een uitgestelde gegevenssectie (zoals RAWBYTES).

**Null-terminator:** voeg de `null`-vlag toe om een `$00`-byte na de tekst toe
te voegen. Ideaal voor null-terminated lussen:

```
    LDX #$00
loop:
    LDA msg,X
    BEQ done        ; $00 stops the loop
    JSR $FFD2
    INX
    BNE loop
done:
    RTS
```

**Coderingsregels:**

| Invoer                               | Hoofdlettermodus                     | Kleine lettermodus |
| ------------------------------------ | ------------------------------------ | ------------------ |
| `A`–`Z`                              | `$41`–`$5A`                          | `$61`–`$7A`        |
| `a`–`z`                              | `$41`–`$5A` (gedwongen hoofdletters) | `$41`–`$5A`        |
| Spatie, cijfers, leestekens (32–126) | zoals het is                         | zoals het is       |
| Nieuwe regel                         | `$0D` (RETURN)                       | `$0D`              |
| Ander                                | `$20` (spatie)                       | `$20`              |

> **Tip:** Gebruik PETSCII voor gegevens die via CHROUT worden uitgevoerd
> (`$FFD2`). Gebruik STRING of RAWTEXT in plaats daarvan om rechtstreeks naar
> het scherm-RAM te schrijven.

---

### CHARSET

Schakelt de VIC-II-karakter-ROM tussen hoofdletter-/grafische modus (standaard
C64) en kleine letter-/hoofdlettermodus door bit 1 van `$D018` tijdens runtime
te wijzigen.

| Argument | Beschrijving                                                                                                                                            |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Modus    | **Kleine letters** — schakelt de tekenset voor kleine/hoofdletters in; **Hoofdletters** — herstelt de standaard tekenset voor hoofdletters/afbeeldingen |

**Syntaxis:**
```
.charset lower    ; switch to lowercase charset
.charset upper    ; switch back to uppercase/graphics charset
```

**Gegenereerde code:**

Kleine lettermodus:
```
    LDA $D018
    ORA #$02      ; set bit 1 → lowercase/uppercase ROM at $1800
    STA $D018
```

Hoofdlettermodus:
```
    LDA $D018
    AND #$FD      ; clear bit 1 → uppercase/graphics ROM at $1000
    STA $D018
```

**Grootte:** 8 bytes (LDA abs + ORA/AND imm + STA abs).

**Waarom ORA/AND in plaats van een directe schrijfbewerking?** `$D018` regelt
ook de locatie van het scherm-RAM (bits 7-4). Door alleen bit 1 te schakelen,
blijft de rest van het register behouden.

**Typische workflow:**

```
.charset lower
.text 0, 0, "hello world", lower
.charset upper
```

> **Opmerking:** De CHARSET-macro wijzigt alleen de pointer naar het
> VIC-teken-ROM. Deze roept `$E544` (KERNAL-tekensetinitialisatie) niet aan. In
> de meeste gevallen is dit voldoende; roep `JSR $E544` alleen eerst aan als u
> wilt dat de printroutines van de KERNAL de wijziging respecteren.

---

### CHARDEF

Definieert een enkel 8×8 aangepast teken in een op RAM gebaseerde tekenset.
Genereert inline runtime-code die 8 bytes kopieert naar `base + index * 8`
tijdens de uitvoering — er is geen voorafgaand label of `ORG` nodig.

| Argument      | Beschrijving                                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Tekensetbasis | Basisadres van de RAM-tekenset (standaard `$3800`). Moet uitgelijnd zijn zodat de VIC-II het kan lezen (zie hieronder).  |
| Tekenindex    | Welke tekenpositie moet opnieuw worden gedefinieerd, 0–255. `65` = 'A' in de standaard schermcode-indeling.              |
| 8 bytes       | Door komma's gescheiden bitmaprijen, van boven naar beneden. Bit 7 van elke byte komt overeen met de meest linkse pixel. |

**Syntaxis:**
```
.chardef $3800, 65, $18,$3C,$66,$7E,$66,$66,$66,$00
```

**Gegenereerde code (8 × `LDA #b` / `STA target+n`, 40 bytes totaal):**
```
    LDA #$18
    STA $3A08
    LDA #$3C
    STA $3A09
    LDA #$66
    STA $3A0A
    LDA #$7E
    STA $3A0B
    LDA #$66
    STA $3A0C
    LDA #$66
    STA $3A0D
    LDA #$66
    STA $3A0E
    LDA #$00
    STA $3A0F
```

**Doeladres:** `$3800 + 65 * 8 = $3A08`. Berekend tijdens het compileren en
vastgelegd in de STA-operanden.

**Grootte:** 40 bytes per teken (8 × 5).

**Typische workflow:**
```
    ; Point VIC-II at RAM charset at $3800
    LDA $D018
    AND #$F1
    ORA #$0E       ; bits 3-1 = %111 → charset at bank+$3800
    STA $D018

    .chardef $3800, 65, $18,$3C,$66,$7E,$66,$66,$66,$00   ; redefine 'A'
    .chardef $3800, 66, $7C,$66,$66,$7C,$66,$66,$7C,$00   ; redefine 'B'
    ; ... more .chardef lines for each custom char
```

**Wanneer CHARDEF gebruiken versus alternatieven:**

| Benadering                       | Gebruik wanneer                                                                                                 |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **CHARDEF**                      | Je hebt een paar aangepaste tekens nodig (bijvoorbeeld 1-20). De uitvoeringskosten bedragen 40 bytes per teken. |
| **RAWBYTES @ $3800**             | Je hebt een volledig aangepaste tekenset (256 tekens). In totaal 2 KB aan gegevens, geen runtime-kopie.         |
| **INCBIN "charset.bin" @ $3800** | Extern tekensetbestand (gemaakt door de tekeneditor). De meest overzichtelijke optie.                           |
| **Tekenset Canvas + INCBIN**     | Een volledige bitmap van 256 tekens, weergegeven als één afbeelding van 128×128 pixels.                         |

> **Uitlijningsherinnering: ** VIC-II verwacht de basis van de tekenset op een
> veelvoud van `$0800`. Geldige banken: `$0000`, `$0800`, `$1000`, ... , `$3800`
> (binnen de huidige 16 KB VIC-bank). RAM-tekensets bevinden zich doorgaans op
> `$2000`, `$2800`, `$3000` of `$3800`.

---

### BOX_HIT

Botsingstest met as-uitgelijnde begrenzingskaders (AABB) tussen twee rechthoeken
beschreven door 4-byte zero-page structuren. Retourneert het resultaat in de
accumulator: **A = 1** bij overlapping, **A = 0** anders. Pure inline assembly,
geen subroutine-aanroep.

| Argument           | Beschrijving                                                                    |
| ------------------ | ------------------------------------------------------------------------------- |
| Postbus 1 ZP-adres | Nulpagina-basis van de 4-byte structuur van het eerste vakje (standaard `$FB`). |
| Box2 ZP-adres      | Nulpagina-basis van de 4-byte structuur van het tweede vak (standaard `$F7`).   |

**Structuurindeling** (4 bytes per vakje, niet-ondertekende 8-bits coördinaten):

| Offset | Veld      |
| ------ | --------- |
| `+0`   | Links     |
| `+1`   | Bovenkant |
| `+2`   | Rechts    |
| `+3`   | Onderkant |

**Syntaxis:**
```
.box_hit $FB, $F7
```

**Gegenereerde code (30 bytes, volledig PC-relatief — geen subroutine, geen
absolute sprongen):**
```
    LDA $FD        ; b1 right
    CMP $F7        ; b2 left
    BCC no         ; R1 < L2 → miss
    LDA $F9        ; b2 right
    CMP $FB        ; b1 left
    BCC no
    LDA $FE        ; b1 bottom
    CMP $F8        ; b2 top
    BCC no
    LDA $FA        ; b2 bottom
    CMP $FC        ; b1 top
    BCC no
    LDA #$01       ; hit
    BNE done       ; unconditional (A ≠ 0)
no: LDA #$00
done:
```

**Grootte:** 30 bytes.

**Typische workflow:**

```
    ; Player sprite box at $FB..$FE
    LDA sprite_x            ; L
    STA $FB
    LDA sprite_y            ; T
    STA $FC
    CLC
    ADC #23                 ; +23 → B (24-pixel tall sprite)
    STA $FE
    LDA $FB
    CLC
    ADC #23                 ; R
    STA $FD

    ; Enemy box at $F7..$FA (populated similarly)
    ; ...

    .box_hit $FB, $F7        ; test player vs enemy → A = 0 or 1

    CMP #$01
    BNE no_collision
    JSR handle_hit
no_collision:
```

**Beperkingen:**
- Beide zero-page-adressen moeten `≤ $FC` zijn (elk vakje heeft 4 opeenvolgende
  bytes nodig: `zp`, `zp+1`, `zp+2`, `zp+3`).
- Coördinaten worden behandeld als **unsigned 8-bit** (0–255). Voor getekende
  spritecoördinaten buiten dit bereik moet u normaliseren voordat u ze opslaat.
- De twee vakjes kunnen elkaar in de ZP-ruimte overlappen, indien gewenst, maar
  meestal wilt u 8 afzonderlijke bytes.

**Waarom geen subroutine?** Inline-generatie vermijdt de overhead van JSR/RTS
(14+ cycli) en houdt de test actief in de cache voor strakke game-loops. Als je
veel paren moet testen, plaats dan handmatig je eigen `JSR box_hit_sub` rond een
enkele BOX_HIT-regel.

**Vergelijking met UB's `box_hit()` functie:** Ultimate Basic verpakt dezelfde
6502-logica als een runtimefunctie die een variabele retourneert. In VA plaats
je BOX_HIT inline waar je de test nodig hebt; het resultaat bevindt zich in `A`.

---

### INCBIN

Net als **BLOAD in BASIC** — pakt een extern binair bestand (`.bin`, `.prg`,
`.sid`, `.raw`) en voegt het direct in de geassembleerde PRG in op het adres dat
u opgeeft.

| Argument | Beschrijving                                                          |
| -------- | --------------------------------------------------------------------- |
| Bestand  | Blader om een `.bin`, `.prg`, `.sid` of `.raw` bestand te selecteren. |
| Adres    | Doellaadadres (bijv. `$C000`)                                         |

**Syntaxis:**
```
.incbin "music.bin", $C000
```

**Gegenereerde codecommentaar:**
```
    ; INCBIN "music.bin" @ $C000 (2048 bytes)
    .byte $01, $02, ...
```

**Grootte in code: ** 0 bytes (uitgestelde datasectie). De binaire code is
ingebed op het opgegeven adres.

---

### KOALA

Laadt een **Koala Painter**-afbeelding (`.koa` / `.kla`, 160×200 meerkleurig) en
toont deze. De afbeeldingsgegevens worden ingesloten op een vast adres zoals
`INCBIN` (het 2-byte `$6000` laadadres van het bestand wordt verwijderd), en de
instructie zelf compileert naar een 86-byte weergaveroutine die wordt uitgevoerd
op de plaats waar deze zich bevindt.

| Argument | Beschrijving                                                                                                               |
| -------- | -------------------------------------------------------------------------------------------------------------------------- |
| Bestand  | Blader om een `.koa` / `.kla`-bestand te selecteren (10003 bytes, of 10001 zonder laadadres)                               |
| Adres    | Bitmapadres: `$6000` (standaard, Koala native, VIC bank 1, scherm-RAM `$4400`) of `$2000` (VIC bank 0, scherm-RAM `$0400`) |

De weergaveroutine kopieert het scherm-RAM-gedeelte naar het scherm en het
kleur-RAM-gedeelte naar `$D800`, schrijft de achtergrondbyte naar `$D021`,
selecteert de VIC-bank in `$DD00` (waarbij de andere poortbits behouden blijven)
en schakelt de meerkleurige bitmapmodus in (`$D011 = $3B`, `$D016 = $18`, `$D018
= $18`). Andere adressen worden afgewezen: de resterende 8K-slots bevinden zich
onder het BASIC/KERNAL-ROM (de kopieerlus zou ROM lezen) of overlappen de
karakter-ROM-schaduw.

**Syntaxis:**
```
.koala "picture.koa"
.koala "picture.koa", $2000
```

**Voorbeeld — toon een afbeelding en wacht:**
```
* = $0801
.koala "picture.koa"
wait:
    JMP wait
```

**Grootte in code: ** 86 bytes (weergaveroutine); de 10001 bytes aan
beeldgegevens gaan naar het opgegeven adres. De Hires-editor van C64 Visual
Assembler exporteert een compatibel bestand.

---

### LEVEL / LEVEL_ROW

Hiermee wordt een **Level Editor**-project in je programma geplaatst en worden
levelrijen naar een schermbuffer gekopieerd — de bouwstenen van een scrollend
spel. Het `level-demo.asm`-voorbeeld van C64 Visual Assembler is een compleet
level dat met een joystick wordt gescrolld.

#### LEVEL

Een INCBIN-achtige instructie die **0 bytes code** genereert. Alleen de
**geplaatste** schermen van het Level Editor-project (de `.bin` die de Level
Editor van C64 Visual Assembler opslaat) worden in het geheugen geladen vanaf
het opgegeven adres (standaard `$2000`), in volgorde van de slots, 2000 bytes
per scherm (1000 schermcodes + 1000 kleuren). Identieke schermen worden één keer
opgeslagen en alle lege slots delen één leeg scherm. De pointertabellen volgen
de schermen. Een level kan maximaal 7 × 10 schermen bevatten.

**Syntaxis:**
```
.level "level.bin"
.level "level.bin", $4000
```

| Gedefinieerd                                                                  | Betekenis                                                                                                                                           |
| ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `LEVEL_SLOT_LO` / `LEVEL_SLOT_HI`                                             | Adres van het scherm in elk slot (rij-georiënteerd, `LEVEL_W` slots per rij)                                                                        |
| `LEVEL_ROW_SLOT`                                                             | Niveaukarakterrij → eerste positie van de bijbehorende schermrij                                                                                    |
| `LEVEL_ROW_LO/HI`, `LEVEL_CROW_LO/HI`                            | Niveau tekenrij → offset van de bijbehorende schermcode-rij / kleurenrij binnen een scherm                                                          |
| `LEVEL_COL_SLOT`, `LEVEL_COL_OFS`                                             | Bekijk de beginkolom → schermkolom en de kolom binnen het scherm                                                                                    |
| `LEVEL_W`, `LEVEL_H`                                                        | Niveaugrootte in schermen                                                                                                                           |
| `LEVEL_COLS`, `LEVEL_ROWS`                                             | Grootte van het level in tekens                                                                                                                     |
| `LEVEL_MAX_X`, `LEVEL_MAX_Y`                                                  | Grootste scrollpositie in pixels van een 40×25-weergave                                                                                             |
| `LEVEL_BG`, `LEVEL_MC1`, `LEVEL_MC2`, `LEVEL_MULTICOLOR`                      | Achtergrond / meerkleurige kleuren en modus van het level                                                                                           |
| `LEVEL_DATA`, `LEVEL_SIZE`, `LEVEL_END`                           | Start, grootte en eerste vrije adres na de niveaugegevens                                                                                           |
| `LEVEL_OBJ_X_LO/HI`, `LEVEL_OBJ_Y_LO/HI`, `LEVEL_OBJ_TYPE`, `LEVEL_OBJ_PARAM` | Objecttabel (objectlaag van de level-editor): positie in levelpixels, type en parameterbyte, in scrollvolgorde — `LEVEL_OBJ_COUNT` items (max. 255) |
| `LEVEL_OBJ_T_START` … `LEVEL_OBJ_T_TRIGGER`                                   | Objecttypenummers: START 0, VIJAND 1, ITEM 2, DEUR 3, UITGANG 4, TRIGGER 5                                                                          |
| `LEVEL_START_X`, `LEVEL_START_Y`                                              | Positie van het eerste Start-object (alleen gedefinieerd als het level er een heeft)                                                                |
| `LEVEL_ATTR`, `LEVEL_ATTR_SOLID` … `LEVEL_ATTR_COLLECT`                       | Karakterattributentabel (één vlagbyte per schermcode; alleen wanneer het level attributen heeft) en de bijbehorende bits: 1, 2, 4, 8                |
| `LEVEL_BORDER`, `LEVEL_SCR_COLORS`, `LEVEL_SCR_BG/BORDER/MC1/MC2`             | Niveaugrens; kleurentabellen per slot (rij-georiënteerd zoals `LEVEL_SLOT_*`) wanneer een scherm zijn eigen kleuren heeft (`LEVEL_SCR_COLORS` = 1)  |

Typische beveiliging: `.assert LEVEL_END <= $9200, "niveaugegevens komen in
de code terecht"`.

#### LEVEL_ROW

Kopieert één rij van 40 tekens van het niveau naar een buffer: de niveaurij in
**X**, beginnend bij de niveaukolom die wordt bewaard in de variabele `col`,
naar het adres dat wordt bewaard in de pointer `dst` (`dst` / `dst+1`,
laag/hoog). Met het derde argument `color` worden de kleuren gekopieerd in
plaats van de schermcodes (voor kleuren-RAM). Een venster van 40 tekens dat zich
over twee schermen uitstrekt, wordt verwerkt met een zelfmodificerende
kopieerlus (~14 cycli per byte). X wordt behouden, A en Y worden vernietigd.
Vereist een `.level`-blok in het programma.

**Syntaxis:**
```
.level_row dst_lo, view_x
.level_row dst_lo, view_x, color
```

**Grootte in code:** 132 bytes — gebruik `LBEQ` / `LBNE` wanneer een sprong
eroverheen moet gaan.

---

### SID

Net als **BLOAD voor muziek** — laadt een `.sid`-bestand in je PRG en leest
automatisch de Init- en Play-adressen uit de header. Roep Init eenmaal aan bij
het opstarten en roep vervolgens Play aan vanuit je IRQ-handler in elk frame.

| Argument                    | Beschrijving                                                                                                                    |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Bestand                     | Het `.sid`-bestand (PSID / RSID)                                                                                                |
| Aangepast adres (optioneel) | Overschrijf het standaard laadadres van de SID (bijv. `$1000`). Laat dit veld leeg om het adres uit de SID-header te gebruiken. |

De SID-header geeft het volgende weer:
- **Laadadres** — waar de gegevens in het geheugen worden geplaatst (het
  aangepaste adres indien opgegeven)
- **Init adres** — roep dit aan met JSR om de muziek te initialiseren
  (verplaatst samen met een aangepast adres)
- ** Afspeeladres ** — roep dit aan met JSR op elk frame in een IRQ-handler
  (verplaatst samen met een aangepast adres)

**Syntaxis:**
```
.sid "Ikari_Warriors.sid"
.sid "Ikari_Warriors.sid", $1000
```

**Gegenereerde codecommentaar:**
```
    ; SID "Ikari_Warriors.sid" @ $1000  Init:$1000  Play:$1006  (4096 bytes)
```

**Grootte in code: ** 0 bytes inline. Het SID-binair bestand wordt op het
opgegeven adres geplaatst als een uitgesteld blok in de PRG.

> **Belangrijk:** De meeste SID-bestanden bevatten hardgecodeerde interne
> absolute adressen. Deze kunnen alleen worden verplaatst als het hele binaire
> bestand met dezelfde offset wordt verschoven. Als een SID interne sprongen
> naar `$10xx` bevat, moet deze op `$1000` blijven staan — het verplaatsen naar
> een ander adres zal deze interne verwijzingen verbreken.

> **Typisch gebruik:** Geef de SID een eigen adres (`.sid "tune.sid", $1000`)
> wanneer het native adres conflicteert met uw code. Roep Init eenmaal aan bij
> het opstarten en roep vervolgens Play elke frame aan vanuit een raster
> IRQ-handler — of laat [SID_PLAYER](#sid-player) beide doen.

**Labels:** De SID-richtlijn definieert `SID_LOAD` (waar de data wordt
geplaatst), `SID_INIT` en `SID_PLAY` (de init- en play-adressen, verplaatst
samen met een aangepast adres). `SID_PLAY` ontbreekt wanneer de tune geen
play-adres heeft (een RSID die zijn eigen IRQ installeert). Gebruik ze in je
eigen code, bijvoorbeeld `JSR SID_PLAY` in een IRQ-handler.

---

### SID_PLAYER

Speelt de melodie van de **SID**-richtlijn af met één regel: het initialiseert
de melodie en blijft de afspeelroutine aanroepen vanuit een rasteronderbreking,
zodat uw programma verder kan gaan met zijn eigen werk.

| Argument | Beschrijving                                                            |
| -------- | ----------------------------------------------------------------------- |
| Liedje   | Subtuneringsnummer doorgegeven aan de init-routine in A (standaard `0`) |
| Raster   | Rasterlijn van de interrupt, `$00`–`$FF` (standaard `$FA`)              |

Wat het doet: `SEI`, `LDA #song` / `JSR SID_INIT`, schakelt de CIA1 timer IRQ
uit (`$DC0D`), stelt de IRQ-vector (`$0314/$0315`) in op de ingebouwde handler,
de rasterlijn (`$D012`, bit 8 van `$D011` gewist) en de raster-IRQ (`$D01A`),
`CLI`, en springt vervolgens over de handler heen. De handler bevestigt de
interrupt (`ASL $D019`), roept `JSR SID_PLAY` aan en gaat verder naar de KERNAL
(`JMP $EA31`, die ook het toetsenbord scant).

**Syntaxis:**
```
.sid "Ikari_Warriors.sid"
.sid_player
.sid_player 1, $80
```

**Grootte in code: ** 58 bytes.

> **Opmerking:** er is een `.sid` regel nodig in het programma (`SID_INIT` en
> `SID_PLAY`); anders stopt de build met een fout. Met de CIA1 timer IRQ
> uitgeschakeld, draait de KERNAL één keer per frame vanaf de raster IRQ —
> toetsenbord en `GETIN` blijven werken.

---

### INCLUDE

Net als **MERGE in BASIC** — haalt een ander bestand binnen en breidt het inline
uit op deze positie. Perfect voor herbruikbare subroutinebibliotheken.

Er worden twee bestandstypen ondersteund:
- **Plain assembly source** (`.inc`, `.asm`, `.s`) — het bestand wordt gelezen
  als VMA-broncode. Het wordt bij elke build opnieuw gelezen, dus je kunt het
  met elke editor bewerken.
- **Visual Assembler-project** (`.json`) — de blokken van een C64 Visual
  Assembler-blokprogramma.

| Argument              | Beschrijving                                                                                                                                                                                                                                                                                 |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bestand               | Een `.inc` / `.asm` / `.s` broncode of een `.json` Visual Assembler-project                                                                                                                                                                                                                  |
| Laadadres (optioneel) | Indien ingesteld (hexadecimaal, bijvoorbeeld `C000`), wordt de opgenomen code op dat adres geplaatst — er wordt een `ORG` voor geplaatst en de eigen ORG's van het opgenomen bestand worden genegeerd. Zonder deze instelling bepalen de eigen ORG's van het opgenomen bestand de plaatsing. |

**Syntaxis:**
```
.include "library.json"
.include "macros.inc", $1500
.include "sprites.asm"
```

- Geef de bestandsextensie **** — een kale naam zoals `.include "macros"` wordt
  behandeld als `.include "macros.json"`.
- Padresolutie: eerst naast de bron, vervolgens in elke zoekmap (de CLI's
  `--base-dir` / `--search`); een pad dat op een andere machine is geschreven,
  wordt teruggezet naar de kale bestandsnaam. Een ontbrekende include is geen
  fout — de build gaat gewoon door.

**Gegenereerde code (geen adresoverride):**
```
    ; .include "library.json"
    ... (the included code follows)
```

**Gegenereerde code (met laadadres `C000`):**
```
    ; .include "library.json" @ $C000
    *=$C000
    ... (the included code follows)
```

> **Tip:** Gebruik INCLUDE om herbruikbare subroutinebibliotheken te maken die u
> in verschillende projecten kunt delen. `.inc`/`.asm`/`.s`-bestanden zijn het
> meest geschikt wanneer u de bibliotheek wilt bewerken in een eenvoudige
> teksteditor of deze wilt delen met andere 6502-assemblers; `.json` wanneer de
> bibliotheek een Visual Assembler-blokprogramma is. Stel een laadadres in
> wanneer de bibliotheek geen eigen ORG heeft, of wanneer u de
> standaardplaatsing wilt overschrijven.

> **2.1:** Een include die niet gevonden wordt, is een fout, net als een bestand
> dat zichzelf includeert (direct of verderop). De eigen `.include`, `.incbin`
> en `.sid` regels van een geïncludeerd bestand worden ook geladen, relatief ten
> opzichte van de eigen map, en de macro-aanroepen worden uitgebreid — tot wel
> 16 niveaus diep.

---

### TABLE

Net als **DIM op een specifiek adres** — hiermee wordt een opzoektabel benoemd
en de locatie ervan in het geheugen bepaald. Plaats de regels `.byte`, `.word`
of `.fill` erna om de inhoud van de tabel te definiëren.

| Argument | Beschrijving                                            |
| -------- | ------------------------------------------------------- |
| Naam     | Label-identificatie voor de tabel (bijv. `color_table`) |
| Adres    | Vast adres waar de tabel begint (bijv. `$C000`)         |

**Syntaxis:**
```
.table color_table $C000
.table lookup              ; at the current address
```

**Gegenereerde code:**
```
color_table:
```

Met een adres springt de programmateller daarheen; zonder adres begint de tabel
bij het huidige adres. Voeg de regels `.byte` / `.word` / `.fill` erna toe om de
inhoud te vullen.

**Grootte:** 0 bytes.

---

### ORG

Hiermee wordt bepaald waar in het geheugen het programma (of een gedeelte ervan)
wordt geplaatst — vergelijkbaar met het kiezen van een startadres voordat
machinecode wordt ingevoerd. Elk programma heeft minstens één ORG nodig. De
standaard startlocatie voor C64 BASIC is `$0801`.

| Argument  | Beschrijving                                                                     |
| --------- | -------------------------------------------------------------------------------- |
| Adres     | Het nieuwe oorsprongsadres (bijv. `0801` in hexadecimaal, of `2049` in decimaal) |
| HEX / DEC | Schakel de adresinvoer tussen hexadecimale en decimale weergave.                 |

**Syntaxis:**
```
* = $C000
```

**Gegenereerde code:**
```
* = $C000
```

**Grootte:** 0 bytes. ORG zelf genereert geen machinecode.

Elke ORG begint een nieuwe sectie. De regels die volgen, worden vanaf dat adres
samengesteld. De PRG bevat alle secties in één bestand; de gaten tussen secties
worden opgevuld met nullen.

**Voorbeeld — code op `$0801`, gegevenstabel op `$C000`:**
```
* = $0801
    LDX #$00
loop:
    LDA $C000,X
    STA $D800,X
    INX
    BNE loop
    RTS

* = $C000
    .byte $01, $02, $03, ...
```

> **Tip:** Zonder een ORG begint het programma bij `$0801` (2049 decimaal), het
> begin van BASIC. Met de BASIC SYS-stub (de standaard) plaatst de assembler een
> korte `10 SYS…` regel bij `$0801` en begint uw code bij `$080D`. Zie [Output:
> PRG, BASIC-stub en entry point](#3-uitvoer-prg-basic-stub-en-ingangspunt).

---

### LOOP / NEXT

Net zoals **`FOR X=N TO 1 STEP -1 : ... : NEXT X`** in BASIC — telt af van N
naar 1 met behulp van het X- of Y-register. Plaats je instructies tussen LOOP en
NEXT, en de lus wordt automatisch het juiste aantal keren herhaald.

#### LOOP

| Argument | Beschrijving                                                            |
| -------- | ----------------------------------------------------------------------- |
| Register | `X` of `Y` — het tellerregister                                         |
| Graaf    | Aantal iteraties van de lus (hexadecimaal of decimaal, bijv. `0A` = 10) |
| Label    | Automatisch gegenereerd luslabel (bijv. `loop0`)                        |

**Syntaxis:**
```
.loop X, 10, loop0
```

**Gegenereerde code:**
```
    LDX #$0A
loop0:
```

**Grootte:** 2 bytes (LD_ opcode + directe operand).

#### NEXT

| Argument | Beschrijving                                |
| -------- | ------------------------------------------- |
| Register | Automatisch gekoppeld aan het LOOP-register |
| Label    | Automatisch gekoppeld aan het LOOP-label    |

**Syntaxis:**
```
.next loop0
```

**Gegenereerde code:**
```
    DEX
    BNE loop0
```

**Grootte:** 3 bytes (DEX + BNE + vertakkingsoffset).

**Voorbeeld — wis 10 schermcellen:**
```
    LDX #$0A
loop0:
    LDA #$20        ; space character
    STA $0400,X
    DEX
    BNE loop0
```

---

### FOR / ENDF

Net als **`FOR X=0 TO N-1 : ... : NEXT X`** in BASIC — telt *up* vanaf 0. Ideaal
wanneer je een voorwaartse index nodig hebt, bijvoorbeeld om door een tekenreeks
of een array te stappen.

#### FOR

| Argument | Beschrijving                                                                          |
| -------- | ------------------------------------------------------------------------------------- |
| Register | `X` of `Y` — het tellerregister                                                       |
| Graaf    | Luslimiet (hexadecimaal of decimaal, bijv. `$12` = 18). X/Y loopt van 0 tot limiet-1. |
| Label    | Automatisch gegenereerd luslabel (bijv. `for0`)                                       |

**Syntaxis:**
```
.for X, $12, for0
```

**Gegenereerde code:**
```
    LDX #$00
for0:
```

**Grootte:** 2 bytes (LD_ opcode + `#$00`).

#### ENDF

| Argument | Beschrijving                                 |
| -------- | -------------------------------------------- |
| Register | Automatisch gekoppeld aan het FOR-register   |
| Label    | Automatisch gekoppeld aan het FOR-label      |
| Graaf    | Automatisch gekopieerd van de gekoppelde FOR |

**Syntaxis:**
```
.endf for0
```

**Gegenereerde code:**
```
    INX
    CPX #$12
    BNE for0
```

**Grootte:** 5 bytes (IN_ + CP_ #imm + BNE-offset).

**Voorbeeld — print een null-terminated string:**
```
    LDX #$00
for0:
    LDA msg,X       ; msg = PETSCII string at fixed address
    BEQ done        ; null terminator → exit
    JSR $FFD2       ; CHROUT
    INX
    CPX #$12        ; 18 characters max
    BNE for0
done:
    RTS
```

> **LOOP vs FOR:** LOOP telt af (N→1) — goed voor vertragingen, opvullingen,
> pixellussen. FOR telt op (0→N) — goed voor toegang tot strings/arrays. Beide
> kunnen X of Y gebruiken.

---

### PUSH / PULL

Net als ** waarbij variabelen worden opgeslagen vóór een GOSUB en hersteld na **
— maar dan met gebruik van de 6502 hardwarestack. Als een subroutine A, X of Y
gebruikt, moet deze worden omwikkeld met PUSH en PULL, zodat de registers van de
aanroepende code behouden blijven.

#### PUSH

Plaatst een of meer registers op de stack. De volgorde is altijd A → X → Y
(binnenste eerst).

| Argument  | Beschrijving                                            |
| --------- | ------------------------------------------------------- |
| Registers | Elke combinatie: `A`, `X`, `Y`, `AX`, `AY`, `XY`, `AXY` |

**Syntaxis:**
```
.push AXY
```

**Gegenereerde code (voorbeeld: `AX`):**
```
    PHA
    TXA
    PHA
```

**Grootte:** 1 byte voor A (`PHA`), 2 bytes voor X of Y (overdracht + push).

#### PULL

Herstelt registers van de stack in **omgekeerde volgorde** (Y → X → A).

| Argument  | Beschrijving                                                        |
| --------- | ------------------------------------------------------------------- |
| Registers | Hetzelfde als PUSH — moet overeenkomen met de corresponderende PUSH |

**Syntaxis:**
```
.pull AXY
```

**Gegenereerde code (voorbeeld: `AX`):**
```
    PLA
    TAX
    PLA
```

> **Regel:** PUSH en PULL moeten altijd dezelfde registerset gebruiken****.
> `PUSH AX` → `PULL AX` (intern herstelt in omgekeerde volgorde: eerst X, dan
> A).

---

### END / RTS alias

Net als **RTS met een vriendelijkere macronaam ** — `.end` zendt één enkele
`RTS` byte uit, een korte subroutine-terminator.

**Syntaxis:**
```
.end
```

**Gegenereerde code:**
```
    RTS
```

**Grootte:** 1 byte.

Gebruik dit wanneer u een markering voor het einde van een subroutine wilt die
meer op een macro lijkt dan op een gewone instructie.

---

### MACRO / ENDM / INVOKE

Net als ** een benoemde GOSUB met parameters** — definieer een herbruikbaar stuk
code eenmalig (MACRO…ENDM) en roep het vervolgens overal aan met INVOKE. Geef
elke keer andere argumentwaarden door in plaats van code te kopiëren en te
plakken.

#### MACRO (definition start)

| Argument   | Beschrijving                                                                        |
| ---------- | ----------------------------------------------------------------------------------- |
| Naam       | Identificatiecode voor de macro (bijv. `setColor`)                                  |
| Parameters | Optionele parameternamen, gescheiden door komma's (bijv. `color` of `color, count`) |

Markeer het begin van een macrodefinitie. De regels tussen MACRO en ENDM vormen
de body van de macro. Een macro met parameters ** genereert geen code ** waar de
definitie zich bevindt; een macro zonder parameters wordt daar ook geassembleerd
als een subroutine (`JSR name` roept deze aan). In de body wordt een parameter
geschreven als `{paramName}` of als zijn kale naam; de aanroep vult het
argument in — zowel in instructieoperanden als in de argumenten van de
bibliotheekmacro's (`.set_border c`, `.sprite_pos n, x, y` …). Labels,
LOOP-labels en runtime-labels `.if` / `.while` van de body zijn uniek per
aanroep. Een macro-aanroep binnen de macrobody wordt niet uitgebreid (een fout).

**Gegenereerde code:**
```
; .MACRO setColor (color)
    ... (body)
; .ENDM
```

**Syntaxis:**
```
.macro setColor color
    LDA {color}
    STA $D020
.endm
```

#### ENDM (definition end)

Sluit de huidige macrodefinitie. Geen argumenten.

#### INVOKE

Roept op deze positie een gedefinieerde macro aan en vervangt de opgegeven
argumentwaarden door de placeholders `{paramName}` in de body.

| Argument   | Beschrijving                                                                                               |
| ---------- | ---------------------------------------------------------------------------------------------------------- |
| Macronaam  | Een macro gedefinieerd in het programma of in een meegeleverd bestand.                                     |
| Argumenten | Door komma's gescheiden argumentwaarden die overeenkomen met de parameterlijst van de macro (bijv. `#$07`) |

**Gegenereerde code:**
```
; .invoke setColor(#$07)
    LDA #$07
    STA $D020
```

**Syntaxis:**
```
; single argument:
.invoke setColor(#$07)

; multiple arguments:
.invoke drawPixel($10, $20)

; no arguments:
.invoke clearScreen

; text / string arguments (quoted):
.invoke printText("Hello, World!")

; .call alias (synonym for .invoke):
.call setColor(#$07)
```

De macrobody wordt inline uitgebreid, waarbij `{paramName}` wordt vervangen door
de daadwerkelijke argumenten. De door spaties gescheiden vorm (`.invoke setColor
#$07`) wordt ook geaccepteerd.

**Argumenttypen:**
- **Numeriek**: `#$07`, `$10`, `255` — hexadecimale of decimale waarden
- **Tekstreeksen**: `"Hello, World!"` — geciteerde tekenreeksen (de
  aanhalingstekens worden verwijderd); komma's binnen aanhalingstekens worden
  behandeld als onderdeel van de tekst, niet als argumentscheidingstekens
- **Tekenliteral**: `'A'` — blijft een tekenliteral, dus de body krijgt zijn
  code (`$41`)
- **Gemengd**: `#$07, "hello", $20` — elke combinatie

> **Tip:** Definieer macro's bovenaan (of onderaan) je programma en roep ze
> vervolgens aan waar nodig. Macro's kunnen meerdere keren met verschillende
> argumenten worden aangeroepen.

> **2.1:** Een macro kan een andere macro aanroepen (`both(a, b)` roept
> `setc(a)` aan); de binnenste aanroep krijgt de argumenten van de buitenste
> aanroep en zijn eigen unieke lokale labels. Een macro die zichzelf aanroept,
> stopt na 16 niveaus met een foutmelding in plaats van vast te lopen.

---

### REGION / ENDREGION

Puur een groepering voor editors en lijsten — **nul bytes**, geen effect op de
geassembleerde code.

| Argument  | Beschrijving                                                                |
| --------- | --------------------------------------------------------------------------- |
| Regionaam | Vrije tekstlabel voor de sectie (bijv. `init`, `game_loop`, `sprite_setup`) |

**Syntaxis:**
```
.region init
    ; code...
.endregion
```

**Gegenereerde code:**
```
; region init
    SEI
    LDA #$00
    STA $D020
; endregion init
```

**Grootte:** 0 bytes voor zowel REGION als ENDREGION.

> **Opmerking:** Regio's kunnen **genest** in elkaar zijn. Elke ENDREGION sluit
> de dichtstbijzijnde open REGION. Geen effect op de geassembleerde uitvoer.

---

### DEFINE / IF / ELSE / ENDIF

Net als ** een schakelaar leest de assembler ** — `DEFINE DEBUG` zet een symbool
aan, waarna de regels van elke `IF DEBUG` worden geassembleerd en de `ELSE`-tak
wordt overgeslagen. Verwijder de DEFINE en het IF-gedeelte verdwijnt uit de
uitvoer. Het is niet nodig om code te verwijderen voor release-builds.

#### DEFINE

| Argument | Beschrijving                                                                                        |
| -------- | --------------------------------------------------------------------------------------------------- |
| Symbool  | Een of meer door komma's gescheiden identificatoren om te activeren (bijv. `DEBUG` of `DEBUG, PAL`) |

**Syntaxis:**
```
.define DEBUG, PAL
```

**Gegenereerde code:**
```
; .DEFINE DEBUG
; .DEFINE DEBUG, PAL
```

Een `DEFINE` kan meerdere symbolen tegelijk activeren (gescheiden door komma's).
Plaats DEFINEs bovenaan je programma.

#### IF

| Argument   | Beschrijving                                                                                                                           |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Voorwaarde | Een `.define`d symbool (actief), een `.const` naam (actief wanneer niet nul) of een constante expressie (`LEVEL == 2`, `MODE & 1`) |

**Syntaxis:**
```
.if DEBUG
```

**Gegenereerde code:**
```
; .IF DEBUG
```

De regels tussen `IF` en `ENDIF` (of `ELSE`) worden geassembleerd of
overgeslagen door de voorwaarde. Een kale naam is waar wanneer deze `.define`d
is of een niet-nul `.const`, onwaar wanneer deze geen van beide is; elke andere
voorwaarde moet een constante expressie zijn — een die niet tijdens het
assembleren kan worden geëvalueerd, is een fout. Overgeslagen regels verschijnen
als `; [IF skipped] …` commentaar en genereren **nul bytes**.

#### ELSE

Geen argumenten. Markeer de alternatieve tak — samengesteld wanneer de
`IF`-conditie *not* actief is.

**Syntaxis:**
```
.else
```

**Gegenereerde code:**
```
; .ELSE
```

#### ENDIF

Geen argumenten. Sluit het voorwaardelijke gedeelte af.

**Syntaxis:**
```
.endif
```

**Gegenereerde code:**
```
; .ENDIF
```

**Grootte:** 0 bytes voor alle vier de richtlijnen. Alleen de inhoud *tussen*
hen telt.

**Voorbeeld — debug-randflits, release-build slaat dit over:**
```
; .DEFINE DEBUG

; .IF DEBUG
    LDA #$02        ; red border
    STA $D020
; .ELSE
    LDA #$00        ; black (release)
    STA $D020
; .ENDIF
```

**Voorbeeld — meerdere symbolen in één DEFINE:**
```
; .DEFINE DEBUG, PAL

; .IF PAL
    LDA #$xx        ; PAL timing constant
; .ELSE
    LDA #$xx        ; NTSC timing constant
; .ENDIF
```

Geneste `IF`-structuren worden ondersteund. Als een buitenste deel wordt
overgeslagen, worden de binnenste delen ook overgeslagen.

> **Opmerking:** Dit is een voorwaarde die tijdens het compileren wordt
> afgehandeld. Voor runtime vergelijkings-/vertakkingssyntax, zie **Runtime IF /
> ELSE / ENDIF** hieronder.

### .ASSERT

Een **compile-time sanity check**. `.assert` evalueert een expressie tijdens het
assembleren; als deze onwaar is (`0`), stopt de build met een duidelijke
foutmelding die de werkelijke waarde bevat. Als deze waar is (niet nul), wordt
er niets weergegeven.

| Argument    | Beschrijving                                                                                                                                                 |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Uitdrukking | Elke assembler-expressie: labels, `CONST`s, `*` (programmateller), rekenkundige bewerkingen en vergelijkingen (`<`, `<=`, `>`, `>=`, `==`, `!=`) |
| Bericht     | Optionele tekst die aan de foutmelding kan worden toegevoegd                                                                                                 |

**Syntaxis:**
```
.assert spriteData < $C000
.assert * < $A000
.assert end - start <= 256, "sprite table overflowed one page"
```

**Gedrag:**

- **Grootte:** 0 bytes.
- Een onjuiste bewering zorgt ervoor dat de assemblage wordt afgebroken:
  `` `.assert end - start <= 256` is onjuist (waarde: 0). spritetabel loopt
  over één pagina ``
- Een bewering die niet kan worden geëvalueerd (ongedefinieerd label, enz.)
  mislukt ook, met *"kan niet worden geëvalueerd tijdens de assemblage"*.
- Vergelijkingen leveren `1` / `0` op; plaats `.assert` ergens in de
  programmastroom — het wordt gecontroleerd op het adres waar het zich bevindt,
  dus `.assert * < $D000` test de huidige uitvoerpositie.

**Voorbeeld — bescherm spritegegevens tegen paginaoverschrijding:**
```
* = $3000
sprite_data:
    .byte $00, $00, $00        ; … 63 bytes …
sprite_data_end:
    .assert sprite_data_end - sprite_data == 63, "sprite must be exactly 63 bytes"
    .assert (sprite_data % 64) == 0, "sprite must be 64-byte aligned"
```

---

### CONST

Zoals **een benoemde variabele die nooit verandert** — `SCREEN = $0400`. Gebruik
de naam in plaats van overal ruwe adressen te typen, waardoor de code later
gemakkelijker te lezen en te wijzigen is.

| Argument | Beschrijving                                                                                                                  |
| -------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Naam     | Identificatiecode voor de constante (bijv. `SCREEN`)                                                                          |
| Waarde   | Numerieke waarde in de geselecteerde basis (bijv. `0400` in HEX = adres $0400), of een PC-relatieve expressie (zie hieronder) |
| Formaat  | HEX of DEC — bepaalt hoe de waarde wordt ingevoerd en weergegeven.                                                            |

**Syntaxis:**
```
.const SCREEN = $0400
.const FRAMES_1S = 60
```

**Gegenereerde code:**
```
; .CONST SCREEN = $0400
```

**PC-relatieve expressies (`*+N` / `*-N`):**

De waarde accepteert ook `*+N` of `*-N`, waarbij `*` het adres is van de regel
`.const` zelf. Dit wordt gebruikt om een benoemde alias te creëren voor een byte
binnen een nabijgelegen instructie — het klassieke patroon van zelfmodificerende
code:

```
.const op = *+1      ; op → address of the immediate operand of the next LDA
LDA #$00            ; $00 will be patched at runtime
...
STA op              ; overwrites the #$00 byte → LDA reads the new value next time
```

De CONST zendt 0 bytes uit; het label wordt tijdens het compileren opgelost naar
`current_address + 1`.

** Rekenkundige uitdrukkingen: **

De waarde accepteert algemene rekenkundige bewerkingen, waaronder verwijzingen
naar eerder gedefinieerde CONST-namen, hexadecimale/binaire letterlijke waarden
en ingebouwde wiskundige functies:

```
.const SCREEN      = $0400
.const SCREEN_END  = SCREEN + 40*25   ; 1000 bytes later
.const COLOR_RAM   = $D800
.const MID_X       = 160
.const SIN_TABLE   = round(sin(PI/8) * 127)   ; pre-computed sine value
```

**Ingebouwde functies:** `sin()`, `cos()`, `round()`, `max(a,b)`, `min(a,b)`,
`abs()`, constant `PI`

Operatoren: `+  -  *  /` Literalen: `$FF` (hex), `%10110000` (binair)
Laagste/hoogste byte: `lo(expr)`, `hi(expr)`

**Grootte:** 0 bytes.

---

### VAR

Net als **CONST, maar automatisch toegewezen** — `VAR` reserveert
zero-page-geheugen voor een label zonder dat u het adres hoeft in te typen.
Gebruik het voor tellers, pointers en kortstondige statusinformatie die in ZP
thuishoort.

| Argument         | Beschrijving                                                  |
| ---------------- | ------------------------------------------------------------- |
| Naam             | Variabelenaam / label                                         |
| Maat (optioneel) | Aantal te reserveren bytes. Laat dit getal weg voor één byte. |

**Syntaxis:**
```
.var counter
.var timer, 2
.var lives
```

**Praktisch voorbeeld:**
```
.region Vars
.var counter
.var timer, 2
.endregion

LDA #$00
STA counter
```

**Gegenereerde code:**
```
; .var counter
```

**Grootte:** 1 byte standaard, of `N` bytes wanneer grootte is gespecificeerd.

De allocator doorloopt een configureerbare zero-page cursor (`$02` tot `$FE`) en
wijst de eerstvolgende vrije plek toe. Als het aangevraagde gebied een reeds
gebruikt label overlapt, geeft de compiler een waarschuwing.

---

### Runtime IF / ELSE / ENDIF

Net als **een echte branch template** — werkt deze versie tijdens runtime, niet
tijdens compilatie. Het vergelijkt `A`, `X` of `Y` met een directe waarde en
genereert de juiste `CMP` / `CPX` / `CPY` + branchsequentie voor u.

| Argument | Beschrijving                                 |
| -------- | -------------------------------------------- |
| Register | `A`, `X`, of `Y`                             |
| Operator | `==`, `!=`, `<`, `<=`, `>`, `>=` |
| Waarde   | Directe waarde in HEX- of DEC-formaat        |

**Syntaxis:**
```
.if A == #$10
    LDA #$07
.else
    LDA #$0F
.endif
```

**Grootte:** Afhankelijk van de gekozen takken en vergelijkingsvorm.

De vergelijking is standaard zonder teken. Voor `<=` en `>` wordt de macro
uitgebreid naar de kortste equivalente vertakkingsketen voor het geselecteerde
register.

---

### WHILE / ENDW

Zoals **een runtime-lus met een test bovenaan** — de body wordt uitgevoerd
zolang de voorwaarde waar blijft.

| Argument | Beschrijving                                 |
| -------- | -------------------------------------------- |
| Register | `A`, `X`, of `Y`                             |
| Operator | `==`, `!=`, `<`, `<=`, `>`, `>=` |
| Waarde   | Directe waarde in HEX- of DEC-formaat        |

**Syntaxis:**
```
.while A != #$00
    JSR getchar
.endw
```

**Grootte:** Afhankelijk van de lusbody en de vergelijkingsvorm.

Gebruik `WHILE` wanneer de lus mogelijk eindigt voordat de eerste iteratie is
voltooid. Dit is de runtime-tegenhanger van de op telling gebaseerde `LOOP /
NEXT` helper.

---

### REPEAT / UNTIL

Zoals **een runtime-lus met een test onderaan** — de body wordt altijd minstens
één keer uitgevoerd, waarna de voorwaarde bepaalt of er gestopt moet worden.

| Argument | Beschrijving                                 |
| -------- | -------------------------------------------- |
| Register | `A`, `X`, of `Y`                             |
| Operator | `==`, `!=`, `<`, `<=`, `>`, `>=` |
| Waarde   | Directe waarde in HEX- of DEC-formaat        |

**Syntaxis:**
```
.repeat
    JSR getchar
.until A == #$00
```

**Grootte:** Afhankelijk van de lusbody en de vergelijkingsvorm.

Gebruik `REPEAT / UNTIL` als je wilt dat de body minstens één keer wordt
uitgevoerd voordat de exit-controle plaatsvindt.

---

### MEMCPY / MEMSET

Net als **kleine geheugenroutines waar je constant naar grijpt** — `MEMCPY`
kopieert een aaneengesloten blok, `MEMSET` vult een bereik met één byte.

| Macro    | Argumenten              |
| -------- | ----------------------- |
| `MEMCPY` | `src`, `dst`, `size`    |
| `MEMSET` | `addr`, `value`, `size` |

**Syntaxis:**
```
.memcpy src=$C000, dst=$D000, size=$0100
.memset addr=$0400, value=#$20, size=$03E8
```

**Gegenereerde code:** inline kopieer-/vullussen, gekozen om te voldoen aan de
gevraagde grootte.

Groottes tot 256 bytes gebruiken een korte 8-bits lus. Grotere groottes
schakelen automatisch over naar een 16-bits teller.

> **2.1:** De grootte moet bekend zijn wanneer de code wordt opgemaakt — een
> getal of een constante. Een later gedefinieerd label (waarvan de waarde nog
> niet bekend is bij de lay-out) is een fout in plaats van code die niet op de
> juiste plaats past.

---

### PRINT / PRINT_CHAR / PRINT_HEX / CLEAR_SCREEN / WAIT_KEY / DELAY / SET_BORDER / SET_BG

#### PRINT

Net als **PETSCII-uitvoer zonder de boilerplate** — print een tekenreeks via
`CHROUT` met dezelfde behandeling van hoofdletters/kleine letters (`lower`) als
`.petscii`.

**Syntaxis:**
```
.print "HELLO"
.print "hello", lower
```

#### PRINT_CHAR

Print één PETSCII-byte met behulp van een numerieke code en verzendt deze via
`CHROUT`. De waarde kan ook een benoemde constante of label zijn die tijdens het
assembleren wordt omgezet naar een byte.

**Syntaxis:**
```
.print_char 65
.print_char $41
.print_char color
```

#### PRINT_HEX

Drukt een 8-bits waarde af als hexadecimale tekst via het normale
KERNAL-uitvoerpad.

**Syntaxis:**
```
.print_hex A
```

#### CLEAR_SCREEN

Sneltoets voor de standaard C64-code om het scherm te wissen.

**Syntaxis:**
```
.clear_screen
```

#### WAIT_KEY

Wacht tot er een toets wordt ingedrukt, zodat je de `GETIN`-lus niet elke keer
handmatig hoeft te genereren.

**Syntaxis:**
```
.wait_key
```

#### DELAY

Wacht het gevraagde aantal frames af via een gedeelde hulpfunctie. Gebruik dit
voor korte pauzes en timingproblemen wanneer een volledige, op maat gemaakte lus
overbodig zou zijn. Het aantal frames kan een ruw getal zijn of een benoemde
constante, en `.wait` is gewoon een alias van `.delay`.

**Syntaxis:**
```
.delay 29
.wait 29
.delay frames=FRAMES_1S
```

#### SET_BORDER / SET_BG

Handige wrappers voor de VIC-II-kleurregisters. De kleurwaarde kan een ruw getal
zijn of een benoemde constante die wordt opgelost naar 0–15.

**Syntaxis:**
```
.set_border 6
.set_bg 0
.set_border color
.set_bg color
```

**Grootte:** Elke helper wordt uitgebreid tot een kleine
registerschrijfsequentie of een korte KERNAL-aanroep.

---

### IRQ_SETUP

Hiermee wordt in één stap een raster-IRQ-handler ingesteld. De macro schrijft de
IRQ-vector, schakelt raster-IRQ's in, stelt de lijn in, schakelt de algemene
CIA-IRQ-bronnen uit en keert terug naar de normale uitvoering met `CLI`.

| Argument | Beschrijving                                         |
| -------- | ---------------------------------------------------- |
| Handler  | IRQ-routinelabel (bijv. `my_irq`)                    |
| Raster   | Rasterlijn in hexadecimaal of decimaal (bijv. `$FA`) |

**Syntaxis:**
```
.irq_setup handler=my_irq, raster=$FA
```

**Grootte:** Een korte instelreeks; de exacte lengte is afhankelijk van de
geselecteerde rasterlijn.

Gebruik dit wanneer u de standaard "SEI / install handler / enable IRQ /
CLI"-opdracht wilt uitvoeren zonder deze door het hele programma te verspreiden.

---

### RAND

Net als ** een kleine ingebouwde PRNG** — retourneert een 8-bits
pseudo-willekeurige waarde uit een compacte seed van nul pagina's.

| Argument | Beschrijving                                                     |
| -------- | ---------------------------------------------------------------- |
| Zaad     | Optionele seed-byte of label voor de nulpagina (standaard `$FB`) |

**Syntaxis:**
```
.rand
```

**Grootte:** Een handvol bytes, afhankelijk van het gekozen implementatiepad.

De generator is bedoeld voor gameplay, effectvariatie en snelle testdata. Hij is
bewust klein gehouden in plaats van cryptografisch geavanceerd.

---

<a id="sprite_init"></a>
### SPRITE_INIT

Hiermee wordt een VIC-II-sprite in één regel ingesteld — in plaats van ongeveer
6 POKE-instructies in BASIC te schrijven. De datapointers van de sprite worden
ingesteld, de sprite wordt ingeschakeld, de meerkleurenmodus wordt optioneel
geactiveerd en de kleur wordt ingesteld.

| Argument       | Beschrijving                                                            |
| -------------- | ----------------------------------------------------------------------- |
| Sprite #       | Spritenummer 0–7                                                        |
| Kleur          | Kleurindex 0–15 (C64-palet)                                             |
| Gegevenspagina | Sprite-dataadres / 64 (bijv. `$21` als de data zich bevindt op `$0840`) |
| Veelkleurig    | Schakelt de meerkleurige bit van de sprite in of uit (`$D01C`)          |

**Syntaxis:**
```
.sprite_init 0, 7, $21
.sprite_init 0, 7, $21, multicolor
.sprite_init 0, 7, $21, mono
```

**Gegenereerde code:**
```
    LDA #$21
    STA $07F8       ; sprite pointer register ($07F8 + N)
    LDA $D015
    ORA #$01        ; set enable bit for sprite 0
    STA $D015
    LDA $D01C
    AND #$FE        ; clear multicolor bit for sprite 0
    STA $D01C
    LDA #$07
    STA $D027       ; sprite 0 colour register
```

**Grootte:** 26 bytes.

> **Sprite-gegevenspagina:** `data_address ÷ 64`. Met de standaard BASIC SYS-stub
> plaatst `ALIGN 64` na `JMP main` spritegegevens op `$0840` → pagina = `$21`.

---

<a id="sprite_pos"></a>
### SPRITE_POS

Net als **`POKE 53248, x : POKE 53249, y`** in BASIC, stelt dit de startpositie
van een sprite in. De coördinaten worden tijdens het assembleren ingebouwd en
accepteren constanten; voor animatie kunt u `INC`/`DEC` rechtstreeks op het
sprite-register gebruiken.

| Argument | Beschrijving              |
| -------- | ------------------------- |
| Sprite # | Spritenummer 0–7          |
| X        | Horizontale positie 0–319 |
| Y        | Verticale positie 0–255   |

**Syntaxis:**
```
.sprite_pos 0, 152, 100
```

**Gegenereerde code (voorbeeld: sprite 0, X=152, Y=100):**
```
    LDA #$98        ; X low byte
    STA $D000       ; sprite 0 X register
    LDA $D010
    AND #$FE        ; clear X MSB for sprite 0 (X ≤ 255)
    STA $D010
    LDA #$64        ; Y = 100
    STA $D001       ; sprite 0 Y register
```

Voor X > 255 stelt de macro de overeenkomstige bit in `$D010` in in plaats van
deze te wissen.

**Grootte:** 18 bytes.

> **Opmerking:** `SPRITE_POS` bakt de X/Y in de code (`LDA #$xx`). Om een sprite
> tijdens runtime te animeren, gebruik `INC $D000` / `DEC $D000` — zie het
> `sprite-macro-demo` voorbeeld.

---

<a id="wait_raster"></a>
### WAIT_RASTER

Wacht tot de elektronenbundel van de VIC-II een specifieke scanlijn bereikt —
vergelijkbaar met synchronisatie met een tv-beeld. Plaats dit bovenaan je
gameloop om sprite tearing te voorkomen. Geen JSR, geen label nodig.

| Argument   | Beschrijving                                                   |
| ---------- | -------------------------------------------------------------- |
| Rasterlijn | Doelrasterlijn in hexadecimale notatie (bijv. `FF` = lijn 255) |

**Syntaxis:**
```
.wait_raster $FF
```

**Gegenereerde code:**
```
wait:
    LDA $D012       ; current raster line
    CMP #$FF        ; target line
    BNE wait        ; loop back (-7 bytes)
```

**Grootte:** 7 bytes (de `BNE` offset `$F9` = −7 wijst altijd terug naar de
`LDA`).

> **Tip:** Plaats `WAIT_RASTER` bovenaan je gameloop om te synchroniseren met
> het scherm en sprite tearing te voorkomen.

---

### JOYSTICK

Het is alsof je **`PEEK($DC00)`** leest en vervolgens de spritepositie POKEt —
maar dan in één regel. Leest één CIA-joystickpoort en past de X/Y-registers van
een sprite dienovereenkomstig aan. Volledig inline, geen JSR nodig.

| Argument | Beschrijving                                                      |
| -------- | ----------------------------------------------------------------- |
| Haven    | `1` = poort 1 (`$DC01`) of `2` = poort 2 (`$DC00`)                |
| Sprite # | Spritenummer 0–7 (bepaalt welk X/Y-registerpaar wordt bijgewerkt) |

**Syntaxis:**
```
.joystick 2, 0
```

**Gegenereerde code (poort 2, sprite 0):**
```
    LDA $DC00       ; read CIA port 2
    LSR             ; bit 0 → carry (Up)
    BCS skip_up     ; carry set = NOT pressed
    DEC $D001       ; Y−1 (move up)
skip_up:
    LSR             ; bit 1 → carry (Down)
    BCS skip_down
    INC $D001       ; Y+1 (move down)
skip_down:
    LSR             ; bit 2 → carry (Left)
    BCS skip_left
    DEC $D000       ; X−1 (move left)
skip_left:
    LSR             ; bit 3 → carry (Right)
    BCS skip_right
    INC $D000       ; X+1 (move right)
skip_right:
```

**Joystick bitmap (actief-LAAG — bit = 0 betekent ingedrukt):**

| Beetje | Richting | CIA-register                             |
| ------ | -------- | ---------------------------------------- |
| 0      | Omhoog   | $DC00 (poort 2) / $DC01 (poort 1)        |
| 1      | Omlaag   |                                          |
| 2      | Links    |                                          |
| 3      | Rechts   |                                          |
| 4      | Vuur     | (wordt niet door deze macro afgehandeld) |

**Grootte:** 27 bytes. De `BCS`-offset is altijd `+3` (slaat de volgende 3-byte
`DEC`/`INC abs`-instructie over).

**Variabele modus — `.joystick port, vx, vy[, fire]`:** In plaats van een sprite
te bewegen, wordt de richting in variabelen geschreven: `vx` / `vy` = `-1` / `0`
/ `+1` (`$FF` / `$00` / `$01`), en de optionele `fire` = `1` terwijl de knop
wordt ingedrukt, `0` anders. Gebruik het voor een scrollende camera, een speler
met eigen fysica of menu's. Poort `3` leest beide joystickpoorten tegelijk (`LDA
$DC00` / `AND $DC01`), dus beide poorten werken.

```
.joystick 2, vx, vy          ; 35 bytes
.joystick 3, vx, vy, fire    ; both ports + fire: 45 bytes
```

> **Typisch gebruik:** Plaats binnen een `gameloop` label met `WAIT_RASTER`
> eerst:
> ```
> gameloop:
> 
> WAIT_RASTER ($FF)
> 
> JOYSTICK (poort=2, sprite=0)
> 
> JMP gameloop
> ```

---

<a id="mouse"></a>

> **2.1:** De poort moet bekend zijn wanneer de code wordt opgesteld (een getal
> of een constante), omdat poort 3 de code 3 bytes langer maakt; een later
> gedefinieerd label is een fout.
### MOUSE

Leest een proportionele muis van een Commodore 1351 en beweegt een sprite.
Volledig **inline** — geen JSR of label nodig. De macro selecteert de CIA-poort,
wacht tot de SID-paddle-inputs stabiel zijn, decodeert vervolgens de
delta-beweging met behulp van het standaard 1351-driverpatroon en past deze toe
op de sprite-registers.

| Argument  | Beschrijving                                                                |
| --------- | --------------------------------------------------------------------------- |
| Haven     | `1` = CIA `$DC00` bits `7:6` = `%01`; `2` = `%10`                           |
| Sprite #  | Spritenummer 0–7                                                            |
| ZP-byte X | Nulpagina-adres (hex) om het vorige POTX-sample op te slaan (bijv. `FD`)    |
| ZP-byte Y | Nulpagina-adres (hex) om het vorige POTY-voorbeeld op te slaan (bijv. `FE`) |

**Gegenereerde codevorm (poort 1, sprite 0, ZP `$FD`/`$FE`):**

```
    ; CIA port select + settle
    LDA $DC00
    AND #$3F
    ORA #$40
    STA $DC00
    LDX #$67
wait:
    DEX
    BNE wait

    ; X axis — standard 1351-style 7-bit delta decode
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

    ; Y axis — same decode, then inverted before apply
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

**Grootte:** 142 bytes.

**Syntaxis:**
```
.mouse port, spriteNum, zpX, zpY
; example:
.mouse 2, 0, FD, FE
```

> **Belangrijk:** Initialiseer vóór de eerste aanroep de nulpagina-bytes met de
> huidige POTX/POTY-waarden om een sprong in het eerste frame te voorkomen:
> ```
> ; poort 1: LDA $DC00 : AND #$3F : ORA #$40 : STA $DC00
> 
> ; poort 2: LDA $DC00 : AND #$3F : ORA #$80 : STA $DC00
> 
> LDA $D419 : LSR A : AND #$3F : STA $FD
> 
> LDA $D41A : LSR A : AND #$3F : STA $FE
> ```

> **Tip:** Controleer de muis één keer per frame — plaats `WAIT_RASTER` in de
> gameloop vóór `MOUSE`.

---

<a id="sprite_col"></a>
### SPRITE_COL

Net als **`PEEK($D01E)`** in BASIC — controleert de VIC-II
hardware-botsingsregisters en vertelt je of een sprite een andere sprite of de
achtergrond heeft geraakt. Volledig inline, geen JSR nodig.

| Argument     | Beschrijving                                                                                                                |
| ------------ | --------------------------------------------------------------------------------------------------------------------------- |
| Sprite #     | Spritenummer 0–7 (welke bit van de sprite moet worden gecontroleerd)                                                        |
| Botsingstype | `Sprite-Sprite ($D01E)` — botsing met een andere sprite; `Sprite-Background ($D01F)` — botsing met achtergrondafbeeldingen |

**Syntaxis:**
```
.sprite_col 0, sprite
.sprite_col 0, background
```

**Gegenereerde code (sprite 0, sprite–sprite):**
```
    LDA $D01E       ; read sprite-sprite collision register (clears it!)
    AND #$01        ; isolate bit 0 (sprite 0)
                    ; A ≠ 0 → collision occurred
```

**Grootte:** 5 bytes.

> **Belangrijk:** Het lezen van `$D01E`/`$D01F` ** wist het register**. Lees het
> eenmaal per frame en verwerk het resultaat onmiddellijk met `BEQ`/`BNE`.

**Typisch gebruik:**
```
gameloop:
    .wait_raster $FF
    .joystick 2, 0
    .sprite_col 0, sprite
    BEQ no_hit          ; A = 0 → no collision
    LDA #$02
    STA $D020           ; red border = hit!
    JMP gameloop
no_hit:
    LDA #$0E
    STA $D020           ; light blue border = clear
    JMP gameloop
```

> **Zie ook:** `collision-demo` voorbeeld — groene bal (sprite #0) versus rood
> kruis (sprite #1).

---

### LOADFILE

Net als **`LOAD "file",8`** in BASIC — laadt een bestand van een D64-diskette
tijdens de uitvoering met behulp van de KERNAL LOAD-routine. Gebruik dit om
gegevens, muziek of extra code van de diskette te laden terwijl uw programma
draait.

| Argument                        | Beschrijving                                                                                                                                                                                                                        |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bestandsnaam                    | Bestandsnaam op de schijf (max. 16 tekens, automatisch hoofdletters; tekens zoals `,`, `"`, `/`, `\`, `:`, `*`, `?`, `<`, `>`, `\|` worden gefilterd)                                                                          |
| Apparaat                        | Apparaatnummer 8–30 (standaard `8`)                                                                                                                                                                                                 |
| Adres overschrijven (optioneel) | Hexadecimaal laadadres (bijv. `C000`). Indien ingesteld, wordt het bestand naar dit adres geladen (`sec=0`, waarbij de PRG-header wordt genegeerd). Laat leeg om de eigen 2-byte PRG-header van het bestand te gebruiken (`sec=1`). |
| Foutlabel (optioneel)           | Indien ingesteld, wordt na JSR LOAD een `BCS`-instructie gegenereerd. Als de KERNAL terugkeert met een ingestelde carry (fout), springt de uitvoering naar dit label.                                                               |

**Syntaxis:**
```
.loadfile "DEMO-COLORS", 8
.loadfile "DEMO-COLORS", 8, $C000
.loadfile "DEMO-COLORS", 8, $C000, error_label
```

**Gegenereerde codestructuur:**
```
    JMP skip_filename      ; jump over the inline filename
    .byte "DEMO-COLORS"    ; filename bytes (PETSCII, 11 chars)
skip_filename:
    LDA #11                ; filename length
    LDX #<fname            ; pointer lo
    LDY #>fname            ; pointer hi
    JSR $FFBD              ; SETNAM
    LDA #1                 ; logical file #1
    LDX #8                 ; device 8
    LDY #0                 ; sec=0 (override addr) or #1 (file's own addr)
    JSR $FFBA              ; SETLFS
    LDA #0                 ; LOAD command (not VERIFY)
    JSR $FFD5              ; LOAD
    BCS fail               ; (only if error label set)
```

**Grootte:** `3 + bestandsnaam_lengte + 9 (SETNAM) + 9 (SETLFS) + (4 indien
overschrijven) + 5 (LOAD) + (2 indien foutlabel)` bytes. Minimum 27 bytes.

> **Belangrijk:** De bestandsnaam wordt direct in de machinecode opgeslagen na
> een `JMP skip_filename`. De bestandsnaam op de schijf moet in hoofdletters
> PETSCII zijn — wat overeenkomt met gewone ASCII-hoofdletters (`A`–`Z`). De
> macro zorgt hier automatisch voor.

> **Gebruik altijd een foutlabel** voor productieprogramma's — als het bestand
> niet wordt gevonden, stelt KERNAL de carry-vlag in en gaat de uitvoering
> verder met wat er daarna komt.

> **Zie ook:** `loadfile-demo` voorbeeld — demonstreert het laden van
> `DEMO-COLORS.PRG` vanaf een D64 met een BCS-fouttak en een visueel foutscherm.

---

### EXODECRUNCH

In-programma **Exomizer-decompressie**. Gebruik deze macro direct na een
`LOADFILE` die een Exomizer `mem`-modus gecomprimeerde stream heeft geladen —
EXODECRUNCH pakt deze achterwaarts uit naar het adres dat in de stream is
ingebed.

| Argument               | Beschrijving                                                                                                     |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Adres van de uitpakker | Waar de depacker-code zich in het geheugen bevindt (standaard `B000`). Moet een 16-bits hexadecimaal adres zijn. |

**Syntaxis:**
```
.exodecrunch
.exodecrunch depacker=$B000
```

**Gegenereerde code (19 bytes):**
```
    LDA $AE           ; KERNAL load-end lo (set by previous LOAD)
    STA $04           ; depacker src-end pointer lo
    LDA $AF           ; KERNAL load-end hi
    STA $05           ; depacker src-end pointer hi
    LDA #$36          ; BASIC ROM off ($A000-$BFFF becomes RAM)
    STA $01
    JSR depacker      ; depacker reads back-to-front via $04/$05
    LDA #$37          ; restore default mapping (BASIC + KERNAL + I/O)
    STA $01
```

**Hoe het werkt:**

1. KERNAL `LOAD` ($FFD5) werkt ZP `$AE/$AF` bij zodat deze één byte voorbij de
   laatst geladen byte wijst. EXODECRUNCH kopieert dit naar ZP `$04/$05`, wat de
   officiële Exomizer-conventie voor het achterwaarts laden van de broncode is.
2. De depacker wordt doorgaans geplaatst op `$B000` (binnen het BASIC
   ROM-toegewezen gebied). De macro schakelt `$01 = $36` om, zodat de CPU daar
   RAM ziet tijdens de JSR, en herstelt vervolgens `$01 = $37`.
3. Het decompressiedoeladres is **gecodeerd in de gecomprimeerde stream zelf **
   wanneer je comprimeert met `exomizer mem -l <load> file,<target>` — de
   depacker leest het uit de eerste bytes van de stream.

**Depacker-binair bestand:** De vooraf gecompileerde achterwaartse depacker is
`exo-decrunch.bin` (in de `samples/` map van C64 Visual Assembler) (477 bytes,
ORG $B000). Het is een Kick Assembler-wrapper van de officiële `exodecrunch.asm`
met `INC $D020` toegevoegd aan elke leesbewerking voor een zichtbaar
randflits-effect tijdens de decompressie. Plaats het in uw programma met
`.incbin` op het adres van de depacker.

**Ruwe invoer:** het extra wordt aan Exomizer doorgegeven als een ruw bestand
dat wordt geladen op het Dst-adres (`file@<Dst>`), zodat de depacker elke
byte, beginnend met de eerste, precies op het door u ingevoerde adres schrijft.

> **Zie ook:** het `exo-multicolor-demo` voorbeeld — volledig end-to-end
> voorbeeld: LOADFILE een gecomprimeerde meerkleurige bitmap naar $C000,
> EXODECRUNCH pakt deze uit naar $2000, kopieer vervolgens scherm → $0400 en
> kleur → $D800, en schakel VIC-II over naar meerkleurige bitmapmodus.

---

### REU_CHECK

Detecteert of een Commodore RAM Expansion Unit (REU) is aangesloten — net zoals
bij het controleren van `PEEK($D010)` om te zien of er hardware aanwezig is.
Test door twee patronen naar het REU-register `$DF04` te schrijven en vervolgens
weer uit te lezen.

| Argument | Beschrijving   |
| -------- | -------------- |
| Geen     | Geen operanden |

**Gegenereerde code (34 bytes):**
```
LDA #$55
STA $DF04
LDA $DF04
CMP #$55
BNE fail
LDA #$AA
STA $DF04
LDA $DF04
CMP #$AA
BNE fail
LDA #$00
CMP #$FF   ; Z=0 => REU present
BNE done
fail:
LDA #$FF
CMP #$FF   ; Z=1 => no REU
done:
```
> De macro normaliseert het resultaat zodat de volgende tak eenvoudig blijft:
> `BNE` betekent dat REU aanwezig is, `BEQ` betekent dat REU ontbreekt.

**Syntaxis:**
```
.reu_check
```

**Resultaat in vlaggen:**
- **Z = 0** (resultaat ≠ 0) → REU aanwezig → gebruik `BNE`
- **Z = 1** (resultaat = 0) → geen REU → gebruik `BEQ`

**Geen argumenten** — de macro genereert elke keer dezelfde code.

**Typisch gebruik:**
```assembly
.reu_check
BEQ no_reu        ; skip if REU not present
; ... REU code here ...
no_reu:
```

---

### REU_STASH / REU_FETCH / REU_SWAP

DMA-blokoverdracht tussen C64 RAM en REU-uitbreidingsgeheugen — vergelijkbaar
met een zeer snelle POKE-lus, maar de CPU verricht geen werk (de REU-chip
kopieert de gegevens terwijl de CPU is uitgeschakeld). Een overdracht van 1000
bytes is vrijwel direct.

| Macro       | Richting      | `$DF01` commando |
| ----------- | ------------- | ---------------- |
| `REU_STASH` | C64 RAM → REU | `$90`            |
| `REU_FETCH` | REU → C64 RAM | `$91`            |
| `REU_SWAP`  | C64 RAM ↔ REU | `$92`            |

**Argumenten:**

| Argument  | Beschrijving                              | Voorbeeld |
| --------- | ----------------------------------------- | --------- |
| C64-adres | Bron/bestemming in C64 RAM (hex)          | `C000`    |
| REU-adres | Bron/bestemming in REU (hex, 16-bit)      | `0000`    |
| REU-bank  | REU-geheugenbank (0–7)                    | `0`       |
| Lengte    | Aantal over te dragen bytes (hex, 16-bit) | `1000`    |

**Syntaxis:**
```
.reu_stash $C000, $0000, 0, $1000
.reu_fetch $C000, $0000, 0, $1000
.reu_swap $C000, $0000, 0, $1000
```

**Gegenereerde code (40 bytes):**
```
LDA #c64lo    STA $DF02    ; C64 address LO
LDA #c64hi    STA $DF03    ; C64 address HI
LDA #reuLo    STA $DF04    ; REU address LO
LDA #reuHi    STA $DF05    ; REU address HI
LDA #bank     STA $DF06    ; REU bank
LDA #lenLo    STA $DF07    ; length LO
LDA #lenHi    STA $DF08    ; length HI
LDA #$00      STA $DF09    ; address control (fixed)
LDA #$00      STA $DF0A    ; interrupt mask (fixed)
LDA #cmd      STA $DF01    ; execute DMA ($90/$91/$92 = stash/fetch/swap, immediate)
```

> **Opmerking:** Commando's gebruiken `$90/$91/$92` (bit 4 ingesteld = directe
> DMA-modus). Schrijven naar `$DF01` start de overdracht; de CPU hervat wanneer
> deze is voltooid.

---

### TURBO_SET

Stelt de CPU-snelheid van de **Ultimate-64 (U64) ** in via register `$D031`.
Heeft geen effect op een echte C64 of andere emulators.

**Argumenten:**

| Argument | Beschrijving       | Bereik                                                |
| -------- | ------------------ | ----------------------------------------------------- |
| Snelheid | CPU-snelheidsindex | 0 = 1 MHz … 7 ≈ 10 MHz … 15 ≈ 48 MHz                  |
| Badline  | Badline-emulatie   | Ingeschakeld (C64-compatibel) / Uitgeschakeld (turbo) |

De snelheidsbyte wordt als volgt berekend: `(speedIndex & 0x0F) |
(badline_disabled ? 0x80 : 0x00)`.

**Gegenereerde code (5 bytes):**
```
A9 xx   LDA #speed_byte
8D 31 D0   STA $D031
```

**Syntaxis:**
```
.turbo_set 7,0    ; speed=7 (~10 MHz), badline enabled
.turbo_set 15,1   ; speed=15 (~48 MHz), badline disabled
```

> **Opmerking:** Deze macro is alleen van invloed op U64-hardware. Op een echte
> C64 of andere emulators schrijft dit naar `$D031`, wat de CIA kan beïnvloeden
> of genegeerd kan worden.

---

### SUPERCPU_DETECT

Controleert of een **CMD SuperCPU**-accelerator is geïnstalleerd — zoals
`PEEK($D0B8)` om te zien of deze iets anders dan `$FF` retourneert.

**Gegenereerde code (5 bytes):**
```
AD B8 D0   LDA $D0B8
C9 FF      CMP #$FF
```

**Resultaat in vlaggen:**
- **Z = 0** → SuperCPU aanwezig → gebruik `BNE`
- **Z = 1** → SuperCPU niet gevonden → gebruik `BEQ`

**Geen argumenten.**

**Syntaxis:**
```
.supercpu_detect
```

**Typisch gebruik:**
```assembly
.supercpu_detect
BEQ no_scpu       ; skip if SuperCPU not present
; ... SuperCPU turbo code here ...
no_scpu:
```

---

### TURBO_ENABLE

Schakelt de **CMD SuperCPU-turbomodus** in of uit. Roep eerst `SUPERCPU_DETECT`
aan en sla dit over als de SuperCPU niet aanwezig is.

| Modus       | Register | Effect                                             |
| ----------- | -------- | -------------------------------------------------- |
| Inschakelen | `$D07A`  | Schakel de turbomodus in (tot 20 MHz met SuperCPU) |
| Uitzetten   | `$D07B`  | Terug naar de compatibiliteitsmodus van 1 MHz      |

**Gegenereerde code (5 bytes):**
```
A9 00         LDA #$00
8D 7A D0      STA $D07A    ; (or $D07B for disable)
```

**Syntaxis:**
```
.turbo_enable on
.turbo_enable off
```

> **Opmerking:** Roep eerst `SUPERCPU_DETECT` aan en spring om deze macro heen
> als de SuperCPU niet aanwezig is.

---

<a id="map_copy"></a>
### MAP_COPY

Kopieert een tegelkaart van een bronadres naar het scherm-RAM (en optioneel naar
het kleuren-RAM) met behulp van een reeks `LDA abs,X` / `STA abs,X` lussen. Per
lusiteratie wordt één pagina van 256 bytes gekopieerd; een gedeeltelijke pagina
aan het einde wordt gestopt met `CPX #rem / BNE`. Geen JSR nodig — alle code
wordt inline gegenereerd.

| Argument              | Beschrijving                                                                                                                                                                                                                                                    |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bronadres (scherm)    | Hexadecimaal adres waar de kaartgegevens zich bevinden na het laden (bijv. `C000`)                                                                                                                                                                              |
| Scherm-RAM bestemming | Waar moet ik schermcodes kopiëren (bijv. `0400`)?                                                                                                                                                                                                               |
| Grootte (bytes)       | Totaal aantal bytes om te kopiëren — typisch `$03E8` = 1000 (40×25 tekens)                                                                                                                                                                                      |
| Kleurbron             | `auto`: de kleurgegevens volgen de schermcodes (`source + size`); of een expliciet kleurbronadres. De kleurgegevens worden in een tweede stap naar de kleur-RAM-bestemming gekopieerd. Laat dit (en de kleurbestemming) weg om alleen schermcodes te kopiëren. |
| Kleur RAM bestemming  | Bestemming voor kleurgegevens — standaard `D800` (C64 kleuren-RAM)                                                                                                                                                                                              |

**Gegenereerde code (kaart van 1000 bytes, alleen op het scherm):**
```
    LDX #$00
    LDA $C000,X   ; page 0
    STA $0400,X
    INX
    BNE *-9       ; loops until X wraps to 0 (256 iters)
    LDA $C100,X   ; page 1
    STA $0500,X
    INX
    BNE *-9
    LDA $C200,X   ; page 2
    STA $0600,X
    INX
    BNE *-9
    LDA $C300,X   ; remainder — 232 bytes
    STA $0700,X
    INX
    CPX #$E8
    BNE *-11
```

**Grootte:** `2 (LDX) + fullPages×9 + (rem > 0 ? 11 : 0)` bytes per sectie.
Gecombineerde modus verdubbelt dit (schermsectie + identieke kleursectie).

**Koppelen met de kaarteditor:**

De kaarteditor van C64 Visual Assembler (**Save map + color RAM**) exporteert
één binair bestand waarin de eerste `size` bytes schermcodes zijn en de volgende
`size` bytes kleur-RAM-waarden. Gebruik `.map_copy` met `auto` als kleurbron en
het bronadres waar dit bestand wordt geladen (bijv. met `.incbin` op `$C000`):

```
    .incbin "map-color.bin", $C000   ; screen codes $C000–$C3E7, color $C3E8–$C7CF
    ; ...
    .map_copy $C000, $0400, 1000, auto, $D800
```

**Syntaxis:**
```
.map_copy $C000, $0400, 1000               ; screen only
.map_copy $C000, $0400, 1000, auto, $D800  ; combined (color at src+size)
.map_copy $C000, $0400, 1000, $C3E8, $D800 ; explicit color source address
```

---

<a id="map_copy16x16"></a>
### MAP_COPY16X16

Kopieert een tekengebied van 16x16 tekens uit een compact schermcodeblok van 256
bytes plus een bijbehorend kleur-RAM-blok van 256 bytes. Het is bedoeld voor
export naar Charset Canvas en kleine tegel-/afbeeldingsfragmenten, waarbij het
schrijven van zestien afzonderlijke MAP_COPY-rijen te veel geheugen zou
opleveren.

**Standaardindeling: **

| Gegevens              | Standaardadres           |
| --------------------- | ------------------------ |
| 16×16 schermcodes     | Bronadres (`src`)        |
| 16×16 kleurwaarden    | `src + 256`              |
| Scherm-RAM-bestemming | `$0400 + row×40 + col` |
| Kleur RAM-bestemming  | `$D800 + row×40 + col` |

**Syntaxis:**
```
.map_copy16x16 $3000, 12, 4
.map_copy16x16 $3000, 12, 4, $0400, $3100, $D800
```

De verkorte vorm kopieert schermbytes van `$3000`, kleurbytes van `$3100` en
plaatst het 16×16 blok op kolom 12, rij 4. Geldige posities linksboven zijn `col
= 0..24` en `row = 0..9`, waardoor het volledige 16×16 gebied op het 40×25 C64
tekstscherm blijft.

**Gegenereerd gedrag:**

- Genereert zestien inline kopieën van de rij.
- Elke regel kopieert 16 schermbytes en 16 kleurbytes.
- Er is geen JSR nodig; de code wordt direct op de macropositie gegenereerd.
- Werkt met zowel de normale tekenmodus als de meerkleurige tekenmodus; de
  kleur-RAM-bytes bevatten de bit voor de tekenkleur/meerkleurige inschakeling
  van elke cel.

Typische combinatie met Charset Canvas:

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
loop:
    JMP loop

.incbin "16x16+ram+color.bin", $3000
.incbin "16x16+charset.bin", $2000
```

---

<a id="sprite_anim"></a>
### SPRITE_ANIM

Deze functie verhoogt het animatieframe van een sprite bij elke aanroep en werkt
de VIC-II sprite-datapointers bij. Sla één byte per frame op in een tabel (het
paginanummer van de spritegegevens = `data_address / 64`), wijs SPRITE_ANIM
ernaar en roep deze functie één keer per gameframe aan — geen JSR nodig.

| Argument         | Beschrijving                                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------------------ |
| Sprite #         | Spritenummer 0–7                                                                                       |
| Frame lijstadres | Hexadecimaal adres van de frametabel — één byte per frame, elke byte = spritepagina (`data_addr / 64`) |
| Aantal frames    | Totaal aantal frames (1–255)                                                                           |
| Frame ZP         | De nulpaginabyte wordt gebruikt als frameteller (bijv. `FB`)                                           |

**Gegenereerde code (sprite 0, 4 frames, ZP `$FB`, lijst op `$C100`):**
```
    INC $FB         ; advance frame counter
    LDA $FB
    CMP #$04        ; frame count
    BCC *+6         ; if counter < count, skip reset
    LDA #$00
    STA $FB
    TAX             ; X = current frame index
    LDA $C100,X     ; load sprite data page for this frame
    STA $07F8       ; update sprite 0 pointer ($07F8 + sprite#)
```

**Grootte:** 19 bytes.

**Typisch gebruik:**
```
frameTable:
    .byte $21, $22, $23, $24   ; 4 frames at $0840, $0880, $08C0, $0900

gameloop:
    .wait_raster $FF
    .sprite_anim 0, $C100, 4, $FB
    JMP gameloop
```

**Syntaxis:**
```
.sprite_anim spriteNum, frameListAddr, frameCount, zpByte
; example:
.sprite_anim 0, C100, 4, FB
```

> **Tip:** Plaats de frametabel met `.rawbytes` op een vast adres. De teller
> ZP-byte (`$FB`) moet worden geïnitialiseerd naar `$00` vóór de eerste aanroep.
> Als uw code `$FB` voor iets anders gebruikt, kies dan een vrije ZP-locatie.

---

<a id="score_bcd"></a>
### SCORE_BCD

Voegt een vaste-kommawaarde toe aan een meerbyte BCD-score die in het geheugen
is opgeslagen en zet vervolgens elk cijfer om naar het scherm-RAM als een
schermcodekarakter. Gebruikt de 6502 decimale modus (`SED`/`CLD`) voor
carry-veilige BCD-rekenkunde — handmatig manipuleren van de carry is niet nodig.

| Argument         | Beschrijving                                                                                                             |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Score adres      | Hexadecimaal adres van de BCD-scorebytes (bijv. `C200`). Lage byte eerst.                                                |
| Cijfers          | Aantal BCD-bytes (elke byte bevat twee cijfers: `$99` = "99"). `4` bytes = tot 99999999.                                 |
| Punten toevoegen | Decimale waarde die per oproep moet worden toegevoegd (bijv. `100`).                                                     |
| Schermadres      | Waar moeten de schermcodes voor de cijfers worden geschreven (bijv. `0400`)? Eén byte per cijfer (hoogste nibble eerst). |

**Syntaxis:**
```
.score_bcd $C200, 4, 100, $0400
```

**Gegenereerde code (4 bytes, +100 punten, score op `$C200`, scherm op
`$0400`):**
```
    SED              ; enable BCD / decimal mode
    CLC
    LDA $C200        ; byte 0 (digits 1–2)
    ADC #$00         ; low byte of 100 in BCD = $00
    STA $C200
    LDA $C201        ; byte 1 (digits 3–4)
    ADC #$01         ; mid byte of 100 in BCD = $01 (carry propagates)
    STA $C201
    LDA $C202
    ADC #$00
    STA $C202
    LDA $C203
    ADC #$00
    STA $C203
    CLD              ; back to binary mode

    ; render digits
    LDX #$00
digit_loop:
    LDA $C200,X
    PHA
    LSR : LSR : LSR : LSR  ; high nibble → low nibble
    ORA #$30         ; + '0' screen code
    STA $0406,X      ; right-justified: screen_addr + (digits*2 - 2) - X*2
    PLA
    AND #$0F         ; low nibble
    ORA #$30
    STA $0407,X
    INX
    CPX #$04
    BNE digit_loop
```

**Grootte:** `3 + digits×8` bytes (SED + CLC + CLD overhead + 8 bytes per BCD
byte voor ADC + display loop).

**Syntaxis:**
```
.score_bcd $C200, 4, 100, $0400
```

> **Tip:** Initialiseer de scorebytes bij het opstarten naar `$00`. Het
> scoreadres moet zich in de nulpagina of het absolute RAM-geheugen bevinden —
> niet in het ROM-geheugen. Het schermadres moet naar de meest linkse cijfercel
> wijzen; cijfers worden van links naar rechts geschreven (meest significante
> byte eerst).

> **BCD-bereik:** `digits=4` bytes → 8 decimale cijfers → maximale score
> 99.999.999. Elke byte codeert twee BCD-cijfers: `$00`–`$99`.

---

## 7. Syntaxis in KickAssembler-stijl

VMA leest ook de gangbare KickAssembler-vormen, dus een KickAssembler-broncode
wordt vaak zonder aanpassingen gecompileerd:

- `.pc = $1000` en `*=$1000 "name"` stelt het adres in (de segmentnaam wordt
  genegeerd).
- `.const NAME = value` en `.label NAME = value` definiëren constanten; `.label
  NAME = *`, `.label NAME = * + 1` plaatst een label op (of in de buurt van) het
  huidige adres.
- `.macro name(p1, p2) { … }` — een macrobody tussen accolades, naast `.macro …
  .endm`; `:name(args)` en `name(args)` roepen het aan.
- `naam: { … }` bereiken: de labels binnenin zijn lokaal voor `naam`
  (`naam.label` van buitenaf).
- `@label` labels behouden hun `@`.
- `.text "…"` zonder schermcoördinaten slaat de gecodeerde bytes op zoals
  `.byte`. Verschillende items kunnen worden samengevoegd met `,` of `+`: `"…"`,
  `@"…"` met de escapes `\n` `\r` `\t` `\$NN`, en `$NN` / decimale bytes.
  `.encoding "name"` selecteert de codering van de volgende `.text` regels:
  `screencode_mixed` (standaard), `screencode_upper`, `petscii_mixed`,
  `petscii_upper`, `ascii`; een teken waarvoor de codering geen code heeft, is
  een fout.
- Mnemonische achtervoegsels `.abs` / `.a` en `.zp` / `.z` dwingen absolute of
  zero-page adressering af: `sta.abs $00FC,x`, `ldx.zp ptr,y`.
- `// …` opmerkingen.

De rest van de KickAssembler-taal (`.for`, `.var` / `.eval`, `.function`,
`.pseudocommand`, `#import`, `#if`, `LoadBinary`, segments …) wordt verwerkt
door de Kick-preprocessor van C64 Visual Assembler, die een
KickAssembler-broncodeboom omzet in VMA-tekst.

## 8. Opdrachtregel

Nieuw in 2.1.0: `--crt` / `--crt-name` (cartridge) en `--d64` / `--add` /
`--disk-name` (disk image).

```
vma build <input.asm> [options]
vma --help
vma --version
```

| Optie                 | Betekenis                                                                                                                                                                                                                                       |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-o FILE`          | De PRG die moet worden geschreven (standaard: de invoer met de extensie `.prg`)                                                                                                                                                                 |
| `--base-dir DIR`      | Waar de bestanden `.incbin` / `.koala` / `.level` / `.sid` / `.include` eerst worden doorzocht (standaard: de map van de invoer).                                                                                                               |
| `--search DIR`          | Een extra map om in te zoeken, na de basisdirectory (herhaalbaar, in de juiste volgorde); een pad dat op een andere machine is geschreven, wordt teruggezet naar de kale bestandsnaam.                                                          |
| `--no-basic-stub`   | Geen `10 SYS…` BASIC-regel voor de code                                                                                                                                                                                                         |
| `--raw`               | De afbeelding alleen bij de eerste ORG: geen stub, geen verplaatsing naar `$C000`                                                                                                                                                               |
| `--crt FILE`       | Een Magic Desk-cartridge (CRT-type 19, 8 × 8K-banken, maximaal 65.408 bytes): een loader kopieert het programma naar het laadadres en start het op het SYS-adres — de Build CRT van Visual Assembler. Zonder `-o` wordt er geen PRG geschreven. |
| `--crt-name NAME`     | De cartridgenaam in de CRT-header (standaard: `VA CART`)                                                                                                                                                                                        |
| `--d64 [FILE]`     | Een 1541-schijfkopie met de PRG erop, genoemd naar de PRG (standaard FILE: de PRG met een `.d64`-extensie); geen c1541 nodig. Zonder `-o` wordt er geen PRG geschreven.                                                                         |
| `--add FILE` toe  | Een extra bestand op de schijf zoals het is (een PRG met zijn laadadres), genoemd naar het bestand (herhaalbaar, in volgorde)                                                                                                                   |
| `--disk-name NAME`   | De schijfnaam (standaard: de bestandsnaam van de D64; ID `01`)                                                                                                                                                                                  |
| `--sym FILE`       | KickAssembler labelbestand (`.label NAME=$xxxx`)                                                                                                                                                                                                |
| `--vs FILE`        | VICE monitor labelbestand (`al C:xxxx .NAME`; `x64sc -moncommands FILE`)                                                                                                                                                                        |
| `--dbg FILE`       | RetroDebugger / C64 Debugger broncode (XML)                                                                                                                                                                                                     |
| `--debug`             | Alle drie naast de PRG (`out.sym`, `out.vs`, `out.dbg`)                                                                                                                                                                                         |
| `--json FILE`      | De build als JSON: PRG, SYS-adres, symbolen, opgemaakte regels, geschreven segmenten, geheugenweergave — of elke fout met de bijbehorende regel.                                                                                                |
| `--source-path NAME`      | De belangrijkste bron is `.dbg` (standaard: de invoer)                                                                                                                                                                                          |
| `--line-map FILE` | JSON-array: invoerregel → de regel met de namen `.dbg`                                                                                                                                                                                          |

Exitstatus: `0` gebouwd, `1` compilatie fout (`FILE:LINE: message` op
standaardfout, één regel per fout), `2` onjuist gebruik.

```
vma build game.asm -o game.prg --debug
vma build game.asm --no-basic-stub --search ../assets
vma build game.asm --crt game.crt                    # the cartridge only
vma build game.asm --d64 --add music.prg             # game.d64 with GAME and MUSIC
```

## 9. Bekende beperkingen

VMA reproduceert de C64 Visual Assembler-compiler byte voor byte, inclusief de
ruwe kantjes:

- `lda.zp c` → `LDA $0C`: met `.zp` wordt een symbool bestaande uit hexadecimale
  cijfers gelezen als een getal.
- De inhoud van een macro zonder parameters wordt ook samengesteld op de plaats
  waar deze is gedefinieerd; een definitie vóór de eerste `* =` komt aan het
  begin van het programma terecht.
- `.text X, Y, "s", 80` parseert de tekenoffset maar gebruikt deze niet.
- De bytes van `.chardef` zijn hexadecimaal (`129` = `$129`, een fout).
- De niet-directe operand van een runtime `.if` / `.while` / `.until` wordt
  gelezen als een adres: `%bin` is een fout en `10` is hexadecimaal (`$0010`).
- De DELAY-hulpfunctie wordt uitgevoerd na de laatste regel van de lay-out en
  elk gegevensgedeelte, zelfs bij een overgeslagen (`.if 0`) DELAY.

Opgelost in 2.1 (ze gaven onjuiste code of faalden eerder): een `.const` /
`.var` operand in de nulpagina, `JMP (label)`, `lda $1234+1`, een macro-aanroep
binnen een macro, een onopgeloste TURBO_SET / SPRITE_ANIM-waarde (nu een fout),
labels in de bytes van `.data` / `.rawbytes`, een `:name` label waarvan het doel
een label is, de grootte van JOYSTICK / MEMCPY / MEMSET van een later label (nu
een fout), de automatische buffer van `.data` / `.rawbytes`, en de includes (een
ontbrekende is een fout; de eigen `.include` / `.incbin` / `.sid` van een
opgenomen bestand worden geladen).
