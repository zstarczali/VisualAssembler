# VMA – Visual Macro Assembler

**Sprachhandbuch · Version 2.1.0**

VMA ist der 6502/6510-Assembler von [C64 Visual
Assembler](https://github.com/zstarczali/VisualAssembler) – die Sprache des
Expertenmodus und des Textes, in dem die Blockprogramme geschrieben sind. Dieses
Handbuch beschreibt die Sprache; der Editor, die Blockpalette und die anderen
Werkzeuge der Anwendung sind im Handbuch zu C64 Visual Assembler beschrieben.

## Inhalt

1. [Quellformat](#1-quellformat)
2. [Zahlen und Ausdrücke](#2-zahlen-und-ausdrucke)
3. [Ausgabe: PRG, BASIC-Stub und
   Einstiegspunkt](#3-ausgabe-prg-basic-stub-und-einstiegspunkt)
4. [Adressierungsmodi](#4-adressierungsmodi)
5. [6502 Anweisungen](#5-6502-anweisungen)
6. [Direktiven und Makros – Referenz](#6-directives-and-macros--reference)
7. [KickAssembler-ähnliche Syntax](#7-kickassembler-ahnliche-syntax)
8. [Befehlszeile](#8-befehlszeile)
9. [Bekannte Einschränkungen](#9-bekannte-einschrankungen)

---

## 1. Quellformat

Eine VMA-Quelle ist Klartext, eine Anweisung pro Zeile. Bei Mnemonics und
Direktiven (`lda`, `LDA`, `.BYTE`, `.byte`) ist die Groß-/Kleinschreibung
irrelevant; bei Labelnamen wird hingegen zwischen Groß- und Kleinschreibung
unterschieden.

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

- **Kommentare** beginnen mit `;` oder `//` und laufen bis zum Ende der Zeile
  (nicht innerhalb einer Zeichenkette in Anführungszeichen).
- **Labels** werden als `Name:` geschrieben – Buchstaben, Ziffern und `_`, wobei
  der Name nicht mit einer Ziffer beginnt. Ein Label kann in einer eigenen Zeile
  oder vor einer Anweisung stehen. Ein Name, der mit einem Punkt beginnt
  (`.loop:`), ist ein **lokales Label** (siehe [Lokale (gepunktete)
  Labels](#lokale-gepunktete-bezeichnungen)); `-` und `+` sind für sich genommen **anonyme
  Labels**, auf die durch `bne -` / `beq +` (das jeweils nächstgelegene Label
  davor / danach) verwiesen wird.
- **Anweisungen** sind eine Mnemonik und ein Operand; Einrückung ist frei.
- **Direktiven** beginnen mit einem Punkt (`.byte`, `.macro`, `.if` …); `* =
  $xxxx` (oder `.pc = $xxxx`) setzt die Adresse.
- **Benutzermakros** werden aufgerufen als `:name(args)`, `.invoke name(args)`,
  `.call name(args)` oder `name(args)`.

## 2. Zahlen und Ausdrücke

| Bilden           | Beispiel       | Wert                                                                                           |
| ---------------- | -------------- | ---------------------------------------------------------------------------------------------- |
| Hexadezimal      | `$D020`, `$0F` | `$` Präfix                                                                                     |
| Binär            | `%00001111`    | `%` Präfix                                                                                     |
| Dezimal          | `255`, `40*25` | kein Präfix                                                                                    |
| Charakter        | `'A'`          | sein Code (`$41`)                                                                              |
| Aktuelle Adresse | `*`            | die Adresse der Leitung (siehe [Der `*` Programmzähler](#the--program-counter-in-expressions)) |

In den Befehlsoperanden werden Hexadezimalzahlen mit `$` geschrieben. In den
Adressargumenten der Bibliotheksmakros (`.rawbytes C000, …`, `.sprite_init 0, 1,
80`) wird eine ein- bis vierstellige Zahl als Hexadezimalzahl gelesen.

**Operatoren** (in Operanden, `.const`, `.fill`, `.assert`, `.if`): `+ - * / %`,
`& | ^ ~`, `<< >>`, Klammern, `<expr` (niedriges Byte) und `>expr` (hohes Byte),
und in Bedingungen `== != < > <= >=` (wahr = 1, falsch = 0). `.fill`, `.const`
und ähnliche kennen auch `lo()`, `hi()`, `sin()`, `cos()`, `round()`, `min()`,
`max()`, `abs()` und `PI`.

```
.const B = 7
    lda #(B+1)*2
    lda #B & 3 | 8
    lda #~B & $FF
    ldx #'A'
    lda #<screen        ; low byte of a label
    lda #>(*+63)        ; high byte of a PC-relative address
```

## 3. Ausgabe: PRG, BASIC-Stub und Einstiegspunkt

VMA schreibt ein C64 **PRG**: eine zweibyte große Ladeadresse, gefolgt vom
Speicherabbild. Jeder ORG-Abschnitt und jede Direktive, die Daten an einer
eigenen Adresse platziert (`.rawbytes`, `.incbin`, `.sid` …), wird in ein
einziges Abbild geschrieben; die Lücken dazwischen sind Nullen.

- **Ohne ORG** beginnt das Programm bei `$0801`, wo BASIC beginnt.
- **BASIC SYS stub** (Standardeinstellung): Eine `10 SYS nnnn`-Zeile wird an
  `$0801` eingefügt, sodass das Programm mit `RUN` beginnt. Ein Programm, dessen
  erste ORG-Zeile `$0801` ist, beginnt dann an `$080D`. Deaktivieren Sie den
  Stub mit `--no-basic-stub`. Ohne diese Option wird ein Programm an `$0801` zu
  `$C000` assembliert, alle anderen bleiben an ihrer ersten ORG-Zeile.
- **Einstiegspunkt:** Die SYS-Zeile springt zum Anfang des Codes oder zu der
  Adresse, die durch einen Kommentar in der ersten Zeile angegeben wird `;
  Einstiegspunkt: $1234`.
- **Code unterhalb der BASIC-Zeile** (eine ORG niedriger als `$0801` zusammen
  mit dem Stub): Ein kleiner Loader startet das Programm und verschiebt es an
  die richtige Stelle, sodass es immer noch mit `RUN` beginnt.
- Eine Quelle, die mit ihrer eigenen BASIC SYS-Zeile beginnt (`.byte $0B, $08,
  $0A, $00, $9E, …` at `$0801`), wird unverändert ausgegeben, ohne einen zweiten
  Stub.

Aus dem PRG erstellt die Befehlszeile außerdem eine **Cartridge**und ein**Disk-Image** (neu in 2.1.0, siehe [8. Befehlszeile](#8-befehlszeile)):

- `--crt FILE` — eine Magic Desk-Cartridge (CRT Typ 19, 8 × 8K Bänke, maximal
  65.408 Byte Programm). Ein Loader in Bank 0 initialisiert den KERNAL, führt
  eine Kopierroutine aus dem RAM unter `$0100–$013B` aus, die das Programm an
  seine Ladeadresse verschiebt (Bankwechsel über `$DE00`), schaltet die
  Cartridge aus und springt zum Einstiegspunkt. Das Programm darf nicht in den
  Speicherbereich `$0100–$013B` und die Nullseitenbytes `$02–$04` / `$FB–$FE`
  gelangen, die der Loader verwendet.
- `--d64 [FILE]` — ein 1541 Disk-Image (35 Spuren) mit dem danach benannten PRG
  sowie den `--add`-Dateien, angeordnet so, wie sie vom 1541 DOS geschrieben
  werden; kein c1541 erforderlich.

---

## 4. Adressierungsmodi

Jeder 6502-Befehl unterstützt einen oder mehrere Adressierungsmodi. VMA wählt
den Modus anhand der Art und Weise aus, wie der Operand geschrieben ist.

| Modus          | Etikett             | Beispiel       | Beschreibung                                                                    |
| -------------- | ------------------- | -------------- | ------------------------------------------------------------------------------- |
| **implied** | Impliziert          | `NOP`          | Kein Operand; die Anweisung ist in sich abgeschlossen.                          |
| **immediate** | Sofort              | `LDA #$FF`     | Inline-Konstante; der Assembler fügt `#` automatisch hinzu.                     |
| **zeroPage** | Seite Null          | `LDA $10`      | Einzelbyte-Adresse auf Seite Null (0–255)                                       |
| **zeroPageX** | Seite Null,X        | `LDA $10,X`    | Nullseitenadresse + X-Register-Offset (Ergebnis wird auf Seite 0 umgebrochen)   |
| **zeroPageY** | Seite Null,Y        | `LDX $FB,Y`    | Nullseitenadresse + Y-Register-Offset                                           |
| **absolute** | Absolute            | `LDA $0400`    | Vollständige 16-Bit-Speicheradresse                                             |
| **absoluteX** | Absolut,X           | `LDA $0400,X`  | 16-Bit-Adresse + X-Register-Offset                                              |
| **absoluteY** | Absolut,Y           | `LDA $0400,Y`  | 16-Bit-Adresse + Y-Register-Offset                                              |
| **relative** | Relativ/Bezeichnung | `BNE-Schleife` | Für Filialanweisungen: Geben Sie einen Labelnamen oder eine Zieladresse ein.    |
| **indirectX** | Indirekt,X          | `LDA ($FB,X)`  | Indirekter Index bei Nullseiten (Operand = Nullseitenadresse, 1 Byte)           |
| **indirectY** | Indirekt,Y          | `LDA ($FB),Y`  | Indirekte Indexierung auf Seite Null (Operand = Adresse der Seite Null, 1 Byte) |
| **indirect** | Indirekt            | `JMP ($0100)`  | Indirekt; nur mit JMP nutzbar.                                                  |

### Konstanten auf der Nullseite

Ein Operand, der nur aus Konstanten besteht (`.const`, `name = value`, a
`.var`), der in ein Byte passt, nimmt den **Zero-Page**-Modus der Anweisung an,
genau wie die Zahl: nach `.const zp = $FB` wird `lda zp` zu `A5 FB` (2 Bytes, 3
Zyklen) und `lda zp,x` zu `B5 FB` assembliert. Ein Modus, für den der Befehl
keine Nullseitenform besitzt, bleibt absolut (`lda zp,y` → `B9 FB 00`). Ein
Label wird nicht verengt – seine Adresse ist erst nach dem Layout bekannt – und
`lda.abs zp` erzwingt den absoluten Modus. Eine Zahl behält die Breite, mit der
sie geschrieben wurde: `$FB` ist Nullseitenform, `$00FB` absolut. *(Neu in
2.1.)*

### Labelausdrücke als Operanden

Jeder Operand, der eine Adresse oder einen unmittelbaren Wert akzeptiert,
akzeptiert auch direkt einen **Konstantennamen** (eine `.const` oder eine
Bezeichnung). Zusätzlich können Sie die Ausdrücke **Bezeichnung+Offset**oder**Bezeichnung−Offset** verwenden, um auf eine Adresse relativ zu einer benannten
Konstante zu verweisen:

| Syntax          | Beispiel                          | Beschreibung                                                                                                                   |
| --------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `label`         | `STA screen_ram,X`                | Wird auf den Label-/Konstantenwert aufgelöst                                                                                   |
| `label+$hex`    | `STA screen_ram+$0100,X`          | Labeladresse plus Hex-Offset                                                                                                   |
| `label+decimal` | `STA screen_ram+256,X`            | Labeladresse plus Dezimaloffset                                                                                                |
| `label-$hex`    | `LDA table-$10`                   | Labeladresse minus einem Hex-Offset                                                                                            |
| `$hex+expr`     | `LDA $1234+1`, `STA $0400+40*2,X` | Beliebiger Ausdruck von Zahlen, Bezeichnungen und Konstanten *(2.1)*                                                           |
| `(label)`       | `JMP (Vektor)`, `JMP (Tabelle+2)` | Indirekter Sprung über eine Marke oder einen Ausdruck *(2.1)*                                                                  |
| `#<label`       | `LDA #<screen_ram`                | Niedrigstes Byte der Labeladresse                                                                                              |
| `#>label`       | `LDA #>screen_ram`                | Höchstwertiges Byte der Labeladresse                                                                                           |
| `*`             | `BNE *`                           | Aktueller Programmzähler (die Adresse der Anweisung selbst); Verzweigungen mit `*` erzeugen eine Endlosschleife (Offset `$FE`) |

**Beispiel — Zwei Bildschirmseiten mit einer CONST löschen:**
```
; .CONST screen_ram = $0400
    LDX #$00
clear:
    STA screen_ram,X
    STA screen_ram+$0100,X
    DEX
    BNE clear
```

### Der `*`-Programmzähler in Ausdrücken

`*` ist nicht mehr auf den gesamten Operanden beschränkt – es kann ** an
beliebiger Stelle innerhalb eines Operandenausdrucks** vorkommen und steht für
die Adresse des Befehls, in dem es steht. Es wird zur Assemblierungszeit anhand
der tatsächlichen Adresse dieses Befehls aufgelöst, sodass für kurze relative
Sprünge oder PC-relative Datenlesevorgänge keine Marke benötigt wird.

| Syntax        | Beispiel             | Bedeutung                                                     |
| ------------- | -------------------- | ------------------------------------------------------------- |
| `*`           | `BNE *`              | Verzweigung zu sich selbst (Endlosschleife, Offset `$FE`)     |
| `*-n` / `*+n` | `BNE *-5`, `BEQ *+4` | Verzweigung relativ zum aktuellen Programmzähler um *n* Bytes |
| `JMP *+n`     | `JMP *+20`           | Absoluter Sprung, berechnet vom aktuellen PC                  |
| `#<*` / `#>*` | `LDA #<*`, `LDA #>*` | Niedriges/hohes Byte des aktuellen PCs                        |
| `#>(*+n)`     | `LDA #>(*+63)`       | Niedriges/hohes Byte einer PC-relativen Adresse               |

**PC vs. Multiplikation.** `*` wird nur dann als Programmzähler behandelt, wenn
es sich an der *Wertposition* befindet – am Anfang des Ausdrucks oder direkt
nach einem Operator, `(`, `,`, `<`, `>` oder einem Leerzeichen. Ein `*`, das auf
eine Zahl, `)` oder einen Bezeichner folgt, ist eine gewöhnliche Multiplikation,
daher bleiben `LDA table*2` und `CONST_A*4` unverändert.

**Wo es funktioniert.** Jeder Operand, der bereits einen Ausdruck akzeptiert:
Sprungziele, `JMP` / `JSR`, `LDA`/`STA`/… absolute und indizierte, unmittelbare
Low-/High-Byte-Operatoren und der Ausdruck `.assert`. `*` ändert niemals die
Größe einer Anweisung, daher ist es in jedem Adressierungsmodus sicher.

### Lokale (gepunktete) Bezeichnungen

Eine Bezeichnung, deren Name mit einem Punkt beginnt – `.loop`, `.skip`, `.done`
– ist eine **lokale Bezeichnung**. Sie gehört zum Gültigkeitsbereich der
nächstgelegenen vorhergehenden **globalen** (nicht gepunkteten) Bezeichnung und
wird intern zu `<global>.<name>`. Zwei lokale Bezeichnungen mit demselben
Kurznamen unter verschiedenen globalen Bezeichnungen kollidieren nicht.

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

- Innerhalb eines Gültigkeitsbereichs kann auf eine lokale Bezeichnung mit der
  Form `.name` verwiesen werden.
- Aus einem anderen Gültigkeitsbereich kann explizit darauf verwiesen werden als
  `Global.name` (z. B. `JMP ClearScreen.loop`).
- Ein `.name`, das vor einer globalen Marke geschrieben wird, bleibt ein
  einfacher Top-Level-`.name`.

### Selbstmodifizierende Code-Operandenbezeichnungen

Um dem Operanden einer Anweisung ein Label auf dem Operandenbyte `label:`
anstelle des Opcodes zu platzieren, wird diesem ein Präfix vorangestellt. Die
Anweisung wird aus dem nach dem Doppelpunkt folgenden Teil assembliert.

```
setup:
    LDA value:#$00     ; 'value' -> address of the #$00 operand byte
    ...
patch:
    LDA #new
    STA value          ; writes the operand byte directly — classic SMC
```

`value` zeigt in jedem Adressierungsmodus auf `<Befehlsadresse> + 1` (das erste
Operandenbyte). Dies ersetzt das ältere Muster `STA-Befehl+1` / `Befehl: LDA
#$00`.

---

## 5. 6502 Anweisungen

### Datenbewegung

| Mnemotechnik | Beschreibung        | Modi                                                                      |
| ------------ | ------------------- | ------------------------------------------------------------------------- |
| `LDA`        | Lastspeicher        | unmittelbar, Nullseite, absolut, absolutX, absolutY, indirektX, indirektY |
| `LDX`        | X-Register laden    | sofort, Nullseite, NullseiteY, absolut, absolutY                          |
| `LDY`        | Lade Y-Register     | sofort, Nullseite, absolut, absolutX                                      |
| `STA`        | Speicherakkumulator | zeroPage, absolute, absoluteX, absoluteY, indirectX, indirectY            |
| `STX`        | Kasse Filiale X     | zeroPage, zeroPageY, absolute                                             |
| `STY`        | Kasse im Geschäft Y | zeroPage, absolute                                                        |

### Arithmetik

| Mnemotechnik | Beschreibung              | Anmerkungen                                                                     |
| ------------ | ------------------------- | ------------------------------------------------------------------------------- |
| `ADC`        | Addieren mit Übertrag     | Stellen Sie die Trageoption `SEC` vor der Verwendung in den meisten Fällen ein. |
| `SBC`        | Subtrahieren mit Übertrag | Setze den Übertrag vor der Subtraktion mit `SEC`.                               |
| `INC`        | Speicher inkrementieren   | —                                                                               |
| `DEC`        | Speicher dekrementieren   | —                                                                               |
| `CMP`        | Vergleiche mit A          | Setzt Flags; ändert A nicht.                                                    |
| `CPX`        | Vergleiche mit X          | —                                                                               |
| `CPY`        | Vergleiche mit Y          | —                                                                               |

### Logik

| Mnemotechnik | Beschreibung                                                     |
| ------------ | ---------------------------------------------------------------- |
| `UND`        | Logisches UND mit Akkumulator                                    |
| `ORA`        | Logisches ODER mit Akkumulator                                   |
| `EOR`        | Exklusives ODER mit Akkumulator                                  |
| `BIT`        | Testet die Bits im Speicher gegen A (setzt die Flags N, V und Z) |

### Sprünge & Äste

| Mnemotechnik | Beschreibung                                                          |
| ------------ | --------------------------------------------------------------------- |
| `JMP`        | Unbedingter Sprung (absolut oder indirekt)                            |
| `JSR`        | Zu Unterprogramm springen (speichert Rücksprungadresse auf dem Stack) |
| `RTS`        | Rückkehr aus der Unterroutine                                         |
| `RTI`        | Rückkehr von der Unterbrechung                                        |
| `BNE`        | Verzweige, falls ungleich (Z=0)                                       |
| `BEQ`        | Verzweige, falls gleich (Z=1)                                         |
| `BCC`        | Verzweige, falls Übertrag gelöscht (C=0)                              |
| `BCS`        | Verzweige, falls Übertragsmenge (C=1)                                 |
| `BMI`        | Verzweige, falls Minus (N=1)                                          |
| `BPL`        | Verzweige, falls Plus (N=0)                                           |
| `BVC`        | Verzweige, falls Überlauf löschen (V=0)                               |
| `BVS`        | Verzweige, falls Überlauf gesetzt (V=1)                               |

#### LBNE / LBEQ / … (Lange Zweige)

Acht Pseudo-Operationen verhalten sich wie bedingte Verzweigungen, erreichen
aber **beliebige Adresse**, nicht nur −128…+127. Jede wird zu einer invertierten
Verzweigung assembliert, die einen 3-Byte-JMP` überspringt – immer `5 Bytes**:

```
LBEQ done      ; assembles to:   BNE *+3   ($D0 $03)
               ;                 JMP done  ($4C lo hi)
```

| Lange Operation | Zustand                | Ausgegeben als         |
| --------------- | ---------------------- | ---------------------- |
| `LBNE`          | ungleich (Z=0)         | `BEQ *+3 / JMP-Ziel`   |
| `LBEQ`          | gleich (Z=1)           | `BNE *+3 / JMP target` |
| `LBCC`          | Übertrag löschen (C=0) | `BCS *+3 / JMP target` |
| `LBCS`          | Übertragsmenge (C=1)   | `BCC *+3 / JMP target` |
| `LBMI`          | minus (N=1)            | `BPL *+3 / JMP target` |
| `LBPL`          | plus (N=0)             | `BMI *+3 / JMP Ziel`   |
| `LBVC`          | Überlauf löschen (V=0) | `BVS *+3 / JMP target` |
| `LBVS`          | Überlaufmenge (V=1)    | `BVC *+3 / JMP target` |

- Operand: eine Marke, ein `*`-Ausdruck oder eine Literaladresse – genau wie bei
  einem normalen Verzweigungsziel.
- Kosten: 5 Bytes und 1 zusätzlicher Zyklus auf dem eingeschlagenen Pfad im
  Vergleich zu einer kurzen Verzweigung. Eine automatische Erweiterung einer
  kurzen Verzweigung findet nicht statt – Sie wählen `LBxx` explizit.
- Wenn ein einfacher Zweig (`BNE`, `BEQ`, …) außerhalb des gültigen Bereichs
  liegt, gibt der Compilerfehler nun den genauen Überschuss an und schlägt den
  passenden Zweig `LBxx` vor.

### Registervorgänge

| Mnemotechnik | Beschreibung                    |
| ------------ | ------------------------------- |
| `TAX`        | Transfer A → X                  |
| `TAY`        | Transfer A → Y                  |
| `TXA`        | Transfer X → A                  |
| `TYA`        | Transfer Y → A                  |
| `TSX`        | Übertrage den Stack-Pointer → X |
| `TXS`        | Übertrage X → Stapelzeiger      |
| `INX`        | Inkrement X                     |
| `DEX`        | X verringern                    |
| `INY`        | Y-Schritt                       |
| `DEY`        | Y verringern                    |

### Verschieben & Drehen

| Mnemotechnik | Beschreibung                       |
| ------------ | ---------------------------------- |
| `ASL`        | Arithmetische Linksverschiebung    |
| `LSR`        | Logische Rechtsverschiebung        |
| `ROL`        | Nach links drehen durch Übertragen |
| `ROR`        | Rechts drehen durch Übertragen     |

### Stapel

| Mnemotechnik | Beschreibung                          |
| ------------ | ------------------------------------- |
| `PHA`        | Akkumulator auf den Stapel legen      |
| `PHP`        | Prozessorstatus auf den Stack legen   |
| `PLA`        | Akkumulator aus dem Stapel ziehen     |
| `PLP`        | Prozessorstatus aus dem Stack abrufen |

### System / Flags

| Mnemotechnik | Beschreibung                                   |
| ------------ | ---------------------------------------------- |
| `CLC`        | Clear Carry Flagge                             |
| `CLD`        | Dezimalmodus löschen                           |
| `CLI`        | Clear Interrupt deaktivieren                   |
| `CLV`        | Überlauf-Flag löschen                          |
| `SEC`        | Flagge tragen                                  |
| `SED`        | Dezimalmodus einstellen                        |
| `SEI`        | Interrupt deaktivieren                         |
| `NOP`        | Keine Operation                                |
| `BRK`        | Erzwingen des Abbruchs / Softwareunterbrechung |

### Illegale / nicht dokumentierte Anweisungen

Diese Chips sind für fortgeschrittene Anwendungen geeignet. Vorsicht ist geboten
– das Verhalten kann je nach Chip variieren.

`LAX`, `SAX`, `DCP`, `ISC`, `SLO`, `RLA`, `SRE`, `RRA`, `ANC`, `ALR`, `ARR`,
`AXS` und die Formen `NOP`, die einen Operanden lesen: `NOP #$nn` ($80), `NOP
$nn` ($04), `NOP $nn,X` ($14), `NOP $nnnn` ($0C), `NOP $nnnn,X` ($1C)

---

## 6. Direktiven und Makros – Referenz

Direktiven steuern die Assemblierung (Markierungen, Daten, Ursprung,
Bedingungen, Benutzermakros); die Bibliotheksmakros erledigen gängige
C64-Aufgaben in einer Zeile – anstatt 10–20 Anweisungen manuell zu schreiben,
schreibt man nur eine Zeile, und der Assembler generiert den Code. Man kann sie
sich wie integrierte Unterprogramme vorstellen.

---

### LABEL

Ähnlich einer Zeilennummer in BASIC – jedoch mit einem Namen anstelle einer
Nummer. Sprungziele für JMP, JSR, BNE usw.

| Argument  | Beschreibung                                             |
| --------- | -------------------------------------------------------- |
| Labelname | Kennung, die in `JMP`, `JSR`, `BNE` usw. verwendet wird. |

**Syntax:**
```
loop:
```

**Generierter Code:**
```
loop:  ; $0820
```

Die aktuelle Adresse wird als Kommentar angezeigt. Labels haben eine Größe von
**0 Byte**.

---

### COMMENT

Wie **REM in BASIC** — eine Notiz für Sie selbst, die der Assembler vollständig
ignoriert.

**Syntax:**
```
; Your comment text here
```

**Generierter Code:**
```
; Your comment text here
```

---

### BYTE

Wie **DATA in BASIC** — speichert eine Liste von Rohbytewerten direkt im
Programm.

| Argument | Beschreibung                                                      |
| -------- | ----------------------------------------------------------------- |
| Operand  | Kommagetrennte Bytewerte (z. B. `$01, $02, $FF` oder `1, 2, 255`) |

**Syntax:**
```
.byte $01, $02, $FF
```

**Generierter Code:**
```
    .byte $01, $02, $FF
```

**Lo/Hi-Byte-Label-Referenzen: ** BYTE akzeptiert KickAssembler-/ca65-artige
Token `<label` (niederwertiges Byte) und `>label` (hochwertiges Byte) neben
numerischen Werten. Der Assembler löst die Labeladresse zur Kompilierzeit auf
und fügt das entsprechende Byte ein. Beispiel:

```
    .byte <frame_0, >frame_0, <frame_1, >frame_1
```

Hier wird das niederwertige Byte der Adresse von `frame_0` gespeichert, dann das
höherwertige Byte und anschließend das gleiche für `frame_1`. Nützlich zum
Erstellen von Sprungtabellen und Adresslisten.

**Größe:** Anzahl der Bytes in der Liste.

---

### WORD

Wie **DATA in BASIC, aber für 16-Bit-Zahlen**. Jeder Wert wird als zwei Bytes
gespeichert (zuerst das niederwertige Byte, dann das höherwertige Byte – 6502
Little-Endian-Reihenfolge).

| Argument | Beschreibung                                               |
| -------- | ---------------------------------------------------------- |
| Operand  | Durch Kommas getrennte 16-Bit-Werte (z. B. `$0400, $C000`) |

**Syntax:**
```
.word $0400, $C000
```

**Generierter Code:**
```
    .word $0400, $C000
```

**Größe:** 2 Bytes pro Wort.

---

### FILL

Wie `FOR I=1 TO N : POKE addr+I, val : NEXT` — füllt einen Speicherblock mit
demselben Byte in einer Zeile. Ideal zum Löschen von Bereichen oder Vorbefüllen
von Tabellen.

| Argument | Beschreibung                                             |
| -------- | -------------------------------------------------------- |
| Operand  | `count,value` — z. B. füllt `256,0` 256 Bytes mit Nullen |

**Syntax:**
```
.fill 256, $00
```

**Generierter Code:**
```
    .fill 256, $00
```

**Ausdruckssyntax:** Sowohl `count` als auch `value` akzeptieren arithmetische
Ausdrücke. Sie können auf CONST-Namen verweisen, Hexadezimal-/Binärliterale
verwenden und integrierte mathematische Funktionen aufrufen:

| Ausdruck                    | Bedeutung                                    |
| --------------------------- | -------------------------------------------- |
| `TILE_COUNT, $00`           | Zählen Sie von einer CONST, Wert hexadezimal |
| `40*25, 0`                  | Inline-Multiplikation                        |
| `round(sin(PI/4)*255), $80` | Trigonometrie                                |

**Eingebaute Funktionen:** `sin()`, `cos()`, `round()`, `max(a,b)`, `min(a,b)`,
`abs()`, constant `PI`

Operatoren: `+ - * /` Literale: `$FF` (hex), `%10110000` (binär)
Niedrigstes/höchstes Byte: `lo(expr)`, `hi(expr)`

**Größe:** Der Zählerwert in Bytes.

---

### ALIGN

Verschiebt die aktuelle Adresse durch Einfügen von Null-Auffüllungsbytes zur
nächsten freien Grenze. Der C64 benötigt Sprite-Daten, die an einer
64-Byte-Grenze beginnen – `ALIGN 64` erledigt dies automatisch.

| Argument | Beschreibung                                                                   |
| -------- | ------------------------------------------------------------------------------ |
| Grenze   | Ausrichtungswert – z. B. `64` (Sprite-Grenze), `256` (Seite), `$2000` (Bitmap) |

**Syntax:**
```
.align 64
.align $2000
```

**Generierter Code:**
```
    ; ALIGN 64 → $0840 (12 bytes padding)
```

**Größe:** Dynamisch — abhängig von der aktuellen Programmzählerposition.

> **Tipp:** Verwenden Sie `ALIGN 64` vor Sprite-Daten, `ALIGN 256` um
> seitenbündige Tabellen zu gewährleisten.

---

### TEXT

Wie **PRINT AT** schreibt es Text direkt auf den C64-Bildschirm in einer
bestimmten Spalte und Zeile, ohne den KERNAL zu verwenden. Es erzeugt ein
LDA/STA-Paar pro Zeichen und zielt auf den Bildschirm-RAM an `$0400` ab.

| Argument           | Beschreibung                                                                  |
| ------------------ | ----------------------------------------------------------------------------- |
| Text               | Die anzuzeigende Zeichenkette                                                 |
| X                  | Spalte (0–39)                                                                 |
| Y                  | Reihe (0–24)                                                                  |
| Etikett (optional) | Weist eine Bezeichnung zu, die auf die berechnete Bildschirmadresse verweist. |
| `lower`            | Optionale Kennzeichnung – siehe unten                                         |

**Zeichensatzmodi:**

Der C64 verfügt über zwei zur Laufzeit auswählbare Zeichensätze:

| Modus                                                   | $D018 Bit 1 | Eingabe in Großbuchstaben           | Eingabe in Kleinbuchstaben            |
| ------------------------------------------------------- | ----------- | ----------------------------------- | ------------------------------------- |
| **Großbuchstaben/Grafiken** (Standard)                  | 0           | `A`–`Z` → Bildschirmcodes $01–$1A ✓ | wird auch als Großbuchstabe behandelt |
| **Kleinbuchstaben/Großbuchstaben** (nach CHARSET lower) | 1           | `A`–`Z` → $01–$1A (Großbuchstaben)  | `a`–`z` → $41–$5A (Kleinbuchstaben) ✓ |

- **Großbuchstaben-Zeichensatz (Standard):** Geben Sie ein, was in
  Großbuchstaben angezeigt werden soll. `"HELLO"` wird als `HELLO` angezeigt.
  Kleinbuchstaben werden Großbuchstaben-Bildschirmcodes zugeordnet.
- **Kleinbuchstaben-Zeichensatz (`lower`):** Geben Sie die gewünschte
  Schreibweise ein. `"hello"` → Anzeige in Kleinbuchstaben, `"HELLO"` → Anzeige
  in Großbuchstaben. Erfordert einen Laufzeit-Zeichensatzwechsel, bevor der
  Bildschirm beschrieben wird (verwenden Sie das Makro **CHARSET lower**).

**Generierter Code (Großbuchstabenmodus, `"HELLO"`):**
```
    LDA #$08      ; 'H' screen code $08
    STA $0400
    LDA #$05      ; 'E' screen code $05
    STA $0401
    ...
```

**Syntax:**
```
.text 0, 2, "HELLO"           ; uppercase charset (default)
.text 0, 2, "hello", lower    ; lowercase charset
```

Die Zeichen werden als **Bildschirmcodes**(nicht PETSCII) kodiert.**Größe:**
`Textlänge × 5` Bytes (LDA + STA pro Zeichen).

---

### STRING

Wie **POKE, das zur Laufzeit eine Zeichenkette ** in eine beliebige
Speicheradresse schreibt. Erzeugt LDA/STA-Paare, die den Bildschirmcode jedes
Zeichens in aufeinanderfolgende Adressen kopieren.

| Argument           | Beschreibung                                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| Text               | Die zu schreibende Zeichenkette                                                                         |
| Adresse            | Zielspeicheradresse — `$C000` hex oder ein **Labelname**                                                |
| Etikett (optional) | Weist eine Bezeichnung zu, die auf die Zieladresse verweist.                                            |
| Schicht            | Hexadezimalwert (00–FF), der zu jedem Bildschirmcodebyte addiert wird (z. B. `$80` = umgekehrtes Video) |
| `lower`            | Optionales Flag – gleiche Semantik wie TEXT (siehe Abschnitt TEXT)                                      |

**Syntax:**
```
.string $C000, "HELLO"                  ; uppercase charset (default)
.string $C000, "hello", lower           ; lowercase charset
.string $C000, "HELLO", 80             ; with shift (reverse video)
.string $C000, "hello", 80, lower      ; shift + lowercase
.string $C000, "HELLO" :my_string      ; with macroLabel
```

**Generierter Code:**
```
    LDA #$08      ; 'H' screen code
    STA $C000
    LDA #$05      ; 'E' screen code
    STA $C001
    ...
```

Zeichen werden als **Bildschirmcodes** (nicht PETSCII) kodiert. Der optionale
Wert **Shift**wird zu jedem Byte addiert, z. B. `$80` für umgekehrtes Video.**Größe:** `Textlänge × 5` Bytes (ein LDA + ein STA pro Zeichen).

---

### DATA

Wie eine **POKE-Schleife** — schreibt eine Liste von Rohbytes zur Laufzeit an
eine Speicheradresse, ein LDA/STA-Paar pro Byte.

| Argument           | Beschreibung                                                 |
| ------------------ | ------------------------------------------------------------ |
| Bytes              | Kommagetrennte Byte-Werte                                    |
| Adresse            | Zielspeicheradresse — `$C000` hex oder ein **Labelname**     |
| Etikett (optional) | Weist eine Bezeichnung zu, die auf die Zieladresse verweist. |

**Syntax:**
```
.data $C000, $01, $02, $03          ; hex address
.data my_buf, $01, $02, $03         ; label address
.data $C000, $01, $02, $03 :mydata  ; with macroLabel
```

**Generierter Code:**
```
    LDA #$01
    STA $C000
    LDA #$02
    STA $C001
    ...
```

**Größe:** `byte_count × 5` Bytes (ein LDA + ein STA pro Byte).

> **2.1:** Die Bytes können Labels benennen: `.data $2010, <target, >target`
> schreibt die Adresse von `target`, die ebenfalls ein später definiertes Label
> ist. Das Label `:name` des Makros kann auf eine Zieladresse verweisen, die
> selbst ein Label ist.

---

### RAWBYTES

Wie **DATA, das direkt in den Speicher geladen wird** – ganz ohne Laufzeitcode.
Die Bytes sind ab dem Zeitpunkt des Ladens des PRG vorhanden, noch bevor Ihr
Code startet. Verwenden Sie dies für Sprite-Daten, Level-Maps, Lookup-Tabellen
und alles, was sich an einer bestimmten Adresse befinden muss.

| Argument           | Beschreibung                                                 |
| ------------------ | ------------------------------------------------------------ |
| Bytes              | Kommagetrennte Byte-Werte                                    |
| Adresse            | Zielspeicheradresse — `$C000` hex oder ein **Labelname**     |
| Etikett (optional) | Weist eine Bezeichnung zu, die auf die Zieladresse verweist. |

**Syntax:**
```
.rawbytes $C000, $00, $00, $00      ; hex address
.rawbytes sprite_data, $00, $00     ; label address
.rawbytes $0C50, $00, $00 :nev      ; with macroLabel — other code can use LDA nev,X
```

**Größe im Code:** 0 Bytes. Die Daten werden an der angegebenen Adresse in der
Ausgabe platziert.

> **DATA vs. RAWBYTES:** DATA generiert LDA/STA-Code, der Bytes zur Laufzeit
> kopiert (langsamer, aber geeignet, wenn die Daten dynamisch sein müssen).
> RAWBYTES platziert die Bytes direkt – ohne Code, sofort, ohne Kosten.

> **2.1:** Die Bytes können Labels benennen (`.rawbytes $2000, <target, >target`
> – eine Zeigertabelle); das Label `:name` kann auf ein Label als Zieladresse
> verweisen, das ebenfalls später definiert wird. Als Pufferargument eines
> Makros belegen die Bytes nach dem Programm einen eigenen Speicherplatz in den
> Puffern.

---

### RAWTEXT

Ähnlich wie RAWBYTES, jedoch für Text – die Zeichenkette wird als Bildschirmcode
kodiert und die Bytes werden an einer festen Adresse ohne Laufzeitcode **
abgelegt. Der Text ist im Speicher verfügbar, sobald die PRG geladen ist.

| Argument           | Beschreibung                                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| Text               | Zu kodierende Zeichenkette                                                                              |
| Adresse            | Zielspeicheradresse — `$C000` hex oder ein **Labelname**                                                |
| Etikett (optional) | Weist eine Bezeichnung zu, die auf die Zieladresse verweist.                                            |
| Schicht            | Hexadezimalwert (00–FF), der zu jedem Bildschirmcodebyte addiert wird (z. B. `$80` = umgekehrtes Video) |
| `lower`            | Optionales Flag – gleiche Semantik wie TEXT (siehe Abschnitt TEXT)                                      |

**Syntax:**
```
.rawtext $C000, "HELLO"                 ; uppercase charset (default)
.rawtext $C000, "hello", lower          ; lowercase charset
.rawtext $C000, "HELLO", 80            ; with shift (reverse video)
.rawtext $C000, "hello", 80, lower     ; shift + lowercase
.rawtext $0400, "HELLO" :my_text       ; with macroLabel
```

**Generierter Code:**
```
; .rawtext "HELLO" -> $C000
; $C000
    .byte $08, $05, $0C, $0C, $0F   ; H E L L O (uppercase screen codes)

; .rawtext "hello", lower -> $C000
; $C000
    .byte $48, $45, $4C, $4C, $4F   ; h e l l o (lowercase screen codes $41–$5A range)
```

**Größe im Code:** 0 Bytes. Die Daten werden an der angegebenen Adresse in der
Ausgabe platziert.

> **STRING vs RAWTEXT:** STRING generiert LDA/STA-Code, der den Text zur
> Laufzeit kopiert. RAWTEXT bettet die Bytes beim Laden in die PRG ein – kein
> Code, keine Wartezeit.

---

### PETSCII

Wie **RAWBYTES, jedoch für KERNAL-Ausgabe** – kodiert die Zeichenkette als
PETSCII-Bytes (kompatibel mit CHROUT unter `$FFD2`) und speichert sie an einer
festen Adresse ohne Laufzeitcode. Verwenden Sie dies, wenn Sie Zeichen über `JSR
$FFD2` in einer Schleife ausgeben möchten. Beachten Sie, dass `.print` denselben
Encoder und das Flag `lower` verwendet.

> **PETSCII vs. Bildschirmcodes:** PETSCII und Bildschirmcodes sind zwei
> unterschiedliche Kodierungen. Bildschirmcode `$01` = Buchstabe A; PETSCII
> `$41` = Buchstabe A (über CHROUT). Verwenden Sie PETSCII nur beim Drucken über
> den Kernel; verwenden Sie TEXT/STRING/RAWTEXT zum direkten Schreiben in den
> Bildschirmspeicher.

| Argument           | Beschreibung                                                 |
| ------------------ | ------------------------------------------------------------ |
| Text               | Zeichenkette, die als PETSCII-Bytes kodiert werden soll      |
| Adresse            | Zielspeicheradresse — `$C000` hex oder ein **Labelname**     |
| Etikett (optional) | Weist eine Bezeichnung zu, die auf die Zieladresse verweist. |
| `lower`            | Optionale Kennzeichnung – siehe unten                        |

**Zeichensatzmodi:**

| Modus                         | Eingabe in Großbuchstaben (`A`–`Z`)                                                                                                | Eingabe in Kleinbuchstaben (`a`–`z`) |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **Großbuchstaben (Standard)** | `$41`–`$5A` (PETSCII Großbuchstaben via CHROUT)                                                                                    | ebenfalls abgebildet auf `$41`–`$5A` |
| **Kleinbuchstaben (`klein`)**| Die alphabetischen Buchstaben werden neu zugeordnet, sodass die sichtbare Groß-/Kleinschreibung im Zeichensatz einheitlich bleibt. | Gleiche Regel                        |**Syntax:**
```
.petscii $C000, "HELLO"              ; uppercase PETSCII (default)
.petscii $C000, "hello", lower       ; lowercase PETSCII ($61–$7A)
.petscii $C000, "HELLO", null        ; with null terminator
.petscii $C000, "hello", lower, null ; lowercase + null terminator
.petscii $C000, "HELLO" :my_msg      ; with macroLabel
```

**Generierte Bytes (Großbuchstaben, `"HELLO"`):**
```
; $C000
    .byte $48, $45, $4C, $4C, $4F   ; H E L L O (PETSCII $41–$5A range)
```

**Größe im Code:** 0 Bytes. Die Daten werden als verzögerter Datenabschnitt (wie
RAWBYTES) an der Zieladresse abgelegt.

**Nullterminator:** Fügen Sie das Flag `null` hinzu, um ein Byte `$00` nach dem
Text anzuhängen. Ideal für nullterminierte Schleifen:

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

**Kodierungsregeln:**

| Eingang                                    | Großbuchstabenmodus                     | Kleinbuchstabenmodus |
| ------------------------------------------ | --------------------------------------- | -------------------- |
| `A`–`Z`                                    | `$41`–`$5A`                             | `$61`–`$7A`          |
| `a`–`z`                                    | `$41`–`$5A` (erzwungene Großschreibung) | `$41`–`$5A`          |
| Leerzeichen, Ziffern, Satzzeichen (32–126) | im Istzustand                           | im Istzustand        |
| Neue Zeile                                 | `$0D` (RETURN)                          | `$0D`                |
| Andere                                     | `$20` (Leerzeichen)                     | `$20`                |

> **Tipp:** Verwenden Sie PETSCII für Daten, die über CHROUT (`$FFD2`)
> ausgegeben werden. Um direkt in den Bildschirmspeicher zu schreiben, verwenden
> Sie stattdessen STRING oder RAWTEXT.

---

### CHARSET

Schaltet den VIC-II-Zeichen-ROM zwischen Großbuchstaben-/Grafikmodus
(C64-Standard) und Kleinbuchstaben-/Großbuchstabenmodus um, indem Bit 1 von
`$D018` zur Laufzeit geändert wird.

| Argument | Beschreibung                                                                                                                                                           |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Modus    | **Kleinbuchstaben**– Aktiviert den Kleinbuchstaben-/Großbuchstaben-Zeichensatz;**Großbuchstaben**– Stellt den Standard-Großbuchstaben-/Grafikzeichensatz wieder her |**Syntax:**
```
.charset lower    ; switch to lowercase charset
.charset upper    ; switch back to uppercase/graphics charset
```

**Generierter Code:**

Kleinbuchstabenmodus:
```
    LDA $D018
    ORA #$02      ; set bit 1 → lowercase/uppercase ROM at $1800
    STA $D018
```

Großbuchstabenmodus:
```
    LDA $D018
    AND #$FD      ; clear bit 1 → uppercase/graphics ROM at $1000
    STA $D018
```

**Größe:**8 Bytes (LDA abs + ORA/AND imm + STA abs).**Warum ORA/AND anstelle eines direkten Schreibvorgangs?** `$D018` steuert auch
die Speicheradresse im Bildschirm-RAM (Bits 7–4). Durch das Umschalten von Bit 1
bleiben die restlichen Registerwerte erhalten.

**Typischer Arbeitsablauf:**

```
.charset lower
.text 0, 0, "hello world", lower
.charset upper
```

> **Hinweis:** Das Makro CHARSET ändert lediglich den Zeiger auf das
> VIC-Zeichen-ROM. Es ruft nicht `$E544` (KERNAL-Zeichensatzinitialisierung)
> auf. In den meisten Fällen ist dies ausreichend; rufen Sie `JSR $E544` nur
> dann auf, wenn die Ausgaberoutinen des KERNAL die Änderung berücksichtigen
> müssen.

---

### CHARDEF

Definiert ein einzelnes 8×8-Zeichen in einem RAM-basierten Zeichensatz. Erzeugt
Inline-Laufzeitcode, der zur Laufzeit 8 Bytes in `base + index * 8` kopiert –
eine vorhergehende Marke oder `ORG` ist nicht erforderlich.

| Argument         | Beschreibung                                                                                                                  |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Zeichensatzbasis | Basisadresse des RAM-Zeichensatzes (Standard: `$3800`). Muss so ausgerichtet sein, dass der VIC-II sie erkennt (siehe unten). |
| Zeichenindex     | Welcher Zeichenslot (0–255) neu definiert werden soll. `65` = 'A' im Standard-Bildschirmcode-Layout.                          |
| 8 Bytes          | Durch Kommas getrennte Bitmap-Zeilen, von oben nach unten. Bit 7 jedes Bytes = Pixel ganz links.                              |

**Syntax:**
```
.chardef $3800, 65, $18,$3C,$66,$7E,$66,$66,$66,$00
```

**Generierter Code (8 × `LDA #b` / `STA target+n`, insgesamt 40 Bytes):**
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

**Zieladresse:** `$3800 + 65 * 8 = $3A08`. Zur Kompilierzeit berechnet und in
den STA-Operanden fest codiert.

**Größe:**40 Bytes pro Zeichen (8 × 5).**Typischer Arbeitsablauf:**
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

**Wann CHARDEF gegenüber Alternativen verwenden?**

| Ansatz                           | Verwenden Sie es, wenn                                                                                                    |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **CHARDEF** | Sie benötigen einige benutzerdefinierte Zeichen (z. B. 1–20). Der Speicherbedarf beträgt jeweils 40 Byte.                 |
| **RAWBYTES @ $3800**             | Sie verwenden einen vollständig benutzerdefinierten Zeichensatz (256 Zeichen). Insgesamt 2 KB Daten, keine Laufzeitkopie. |
| **INCBIN "charset.bin" @ $3800** | Externe Zeichensatzdatei (vom Zeicheneditor erstellt). Die sauberste Option.                                              |
| **Charset Canvas + INCBIN**      | Die vollständige 256-Zeichen-Bitmap wird als ein 128×128-Bild dargestellt.                                                |

> **Hinweis zur Ausrichtung:** VIC-II erwartet die Zeichensatzbasis als
> Vielfaches von `$0800`. Gültige Speicherbereiche: `$0000`, `$0800`, `$1000`,
> ... , `$3800` (innerhalb des aktuellen 16-KB-VIC-Speicherbereichs).
> RAM-Zeichensätze befinden sich typischerweise an den Speicheradressen `$2000`,
> `$2800`, `$3000` oder `$3800`.

---

### BOX_HIT

Achsenparalleler Begrenzungsrahmen-Kollisionstest (AABB) zwischen zwei
Rechtecken, die durch 4-Byte-Nullseitenstrukturen beschrieben werden. Gibt das
Ergebnis im Akkumulator zurück: **A = 1**bei Überlappung,**A = 0**
andernfalls. Reiner Inline-Assembler-Code, kein Unterprogrammaufruf.

| Argument        | Beschreibung                                                              |
| --------------- | ------------------------------------------------------------------------- |
| Box1 ZP Adresse | Nullseitenbasis der 4-Byte-Struktur der ersten Box (Standardwert `$FB`).  |
| Box2 ZP Adresse | Nullseitenbasis der 4-Byte-Struktur der zweiten Box (Standardwert `$F7`). |

**Strukturlayout** (4 Bytes pro Box, vorzeichenlose 8-Bit-Koordinaten):

| Offset | Feld   |
| ------ | ------ |
| `+0`   | Links  |
| `+1`   | Spitze |
| `+2`   | Rechts |
| `+3`   | Unten  |

**Syntax:**
```
.box_hit $FB, $F7
```

**Generierter Code (30 Bytes, vollständig PC-relativ — keine Unterprogramme,
keine absoluten Sprünge):**
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

**Größe:**30 Bytes.**Typischer Arbeitsablauf:**

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

**Einschränkungen:**
- Beide Nullseitenadressen müssen `≤ $FC` sein (jede Box benötigt 4
  aufeinanderfolgende Bytes: `zp`, `zp+1`, `zp+2`, `zp+3`).
- Koordinaten werden als **unsigned 8-Bit** (0–255) behandelt. Für
  vorzeichenbehaftete Sprite-Koordinaten außerhalb dieses Bereichs werden diese
  vor dem Speichern normalisiert.
- Die beiden Felder können sich im ZP-Bereich überlappen, wenn gewünscht,
  normalerweise benötigt man jedoch 8 unterschiedliche Bytes.

Warum nicht eine Unterroutine? Die Inline-Generierung vermeidet den
JSR/RTS-Overhead (14+ Zyklen) und hält den Test bei kurzen Spielschleifen im
Cache. Wenn Sie viele Paare testen müssen, fügen Sie Ihre eigene JSR box_hit_sub
um eine einzelne BOX_HIT-Zeile manuell ein.

**Vergleich mit der Funktion `box_hit()` von UB:** Ultimate Basic kapselt
dieselbe 6502-Logik als Laufzeitfunktion, die einen Wert an eine Variable
zurückgibt. In VA platzieren Sie BOX_HIT direkt an der Stelle im Code, an der
Sie den Test benötigen; das Ergebnis befindet sich in `A`.

---

### INCBIN

Wie **BLOAD in BASIC** — nimmt eine externe Binärdatei (`.bin`, `.prg`, `.sid`,
`.raw`) und bettet sie direkt in den assemblierten PRG an der von Ihnen
angegebenen Adresse ein.

| Argument | Beschreibung                                                                     |
| -------- | -------------------------------------------------------------------------------- |
| Datei    | Navigieren Sie, um eine `.bin`-, `.prg`-, `.sid`- oder `.raw`-Datei auszuwählen. |
| Adresse  | Zielladeadresse (z. B. `$C000`)                                                  |

**Syntax:**
```
.incbin "music.bin", $C000
```

**Kommentar zum generierten Code:**
```
    ; INCBIN "music.bin" @ $C000 (2048 bytes)
    .byte $01, $02, ...
```

**Größe im Code:** 0 Bytes (aufgeschobener Datenbereich). Die Binärdatei ist an
der angegebenen Adresse eingebettet.

---

### KOALA

Lädt ein **Koala Painter**-Bild (`.koa` / `.kla`, 160×200, mehrfarbig) und zeigt
es an. Die Bilddaten sind an einer festen Adresse wie `INCBIN` eingebettet (die
2-Byte-Ladeadresse `$6000` der Datei wird entfernt), und die Direktive selbst
wird zu einer 86-Byte-Anzeigeroutine kompiliert, die an ihrer Position
ausgeführt wird.

| Argument | Beschreibung                                                                                                                          |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Datei    | Navigieren Sie zur Auswahl einer `.koa` / `.kla`-Datei (10003 Bytes bzw. 10001 Bytes ohne Ladeadresse)                                |
| Adresse  | Bitmap-Adresse: `$6000` (Standard, Koala nativ, VIC-Bank 1, Bildschirm-RAM `$4400`) oder `$2000` (VIC-Bank 0, Bildschirm-RAM `$0400`) |

Die Anzeigeroutine kopiert den Bildschirm-RAM-Bereich auf den Bildschirm und den
Farb-RAM-Bereich nach `$D800`, schreibt das Hintergrundbyte nach `$D021`, wählt
den VIC-Bank-Bereich in `$DD00` aus (die anderen Port-Bits bleiben erhalten) und
aktiviert den Mehrfarben-Bitmap-Modus (`$D011 = $3B`, `$D016 = $18`, `$D018 =
$18`). Andere Adressen werden verworfen: Die verbleibenden 8-KB-Slots liegen
unter dem BASIC/KERNAL-ROM (die Kopierschleife würde ROM lesen) oder überlappen
den Zeichen-ROM-Schatten.

**Syntax:**
```
.koala "picture.koa"
.koala "picture.koa", $2000
```

**Beispiel — ein Bild anzeigen und warten:**
```
* = $0801
.koala "picture.koa"
wait:
    JMP wait
```

**Größe im Code:** 86 Bytes (Anzeigeroutine); die 10001 Bytes Bilddaten werden
an die angegebene Adresse gesendet. Der Hires-Editor des C64 Visual Assembler
exportiert eine kompatible Datei.

---

### LEVEL / LEVEL_ROW

Fügt ein **Level-Editor**-Projekt in Ihr Programm ein und kopiert Levelzeilen in
einen Bildschirmpuffer – die Bausteine eines Scrolling-Spiels. Das
`level-demo.asm`-Beispiel des C64 Visual Assembler ist ein vollständiges, per
Joystick scrollbares Level.

#### LEVEL

Eine INCBIN-ähnliche Direktive erzeugt **0 Bytes Code**. Nur die **platzierten**
Bildschirme des Level-Editor-Projekts (die `.bin`, die der Level-Editor des C64
Visual Assembler speichert) werden ab der angegebenen Adresse (Standardadresse
`$2000`) in Slot-Reihenfolge in den Speicher geladen, 2000 Bytes pro Bildschirm
(1000 Bildschirmcodes + 1000 Farben). Identische Bildschirme werden nur einmal
gespeichert, und alle leeren Slots teilen sich einen leeren Bildschirm. Die
Zeigertabellen folgen den Bildschirmen. Ein Level kann bis zu 7 × 10 Bildschirme
umfassen.

**Syntax:**
```
.level "level.bin"
.level "level.bin", $4000
```

| Definition                                                                    | Bedeutung                                                                                                                                                   |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `LEVEL_SLOT_LO` / `LEVEL_SLOT_HI`                                             | Adresse des Bildschirms in jedem Slot (zeilenweise, `LEVEL_W` Slots pro Zeile)                                                                              |
| `LEVEL_ROW_SLOT`                                                              | Level-Charakterzeile → erster Platz der zugehörigen Bildschirmzeile                                                                                         |
| `LEVEL_ROW_LO/HI`, `LEVEL_CROW_LO/HI`                                         | Level-Zeichenzeile → Versatz der zugehörigen Bildschirmcode-Zeile / Farbzeile innerhalb eines Bildschirms                                                   |
| `LEVEL_COL_SLOT`, `LEVEL_COL_OFS`                                             | Ansicht Startspalte → Bildschirmspalte und Spalte innerhalb des Bildschirms                                                                                 |
| `LEVEL_W`, `LEVEL_H`                                                          | Levelgröße in Bildschirmen                                                                                                                                  |
| `LEVEL_COLS`, `LEVEL_ROWS`                                                    | Levelgröße in Zeichen                                                                                                                                       |
| `LEVEL_MAX_X`, `LEVEL_MAX_Y`                                                  | Größte Scrollposition in Pixeln einer 40×25-Ansicht                                                                                                         |
| `LEVEL_BG`, `LEVEL_MC1`, `LEVEL_MC2`, `LEVEL_MULTICOLOR`                      | Hintergrund / Mehrfarbigkeit und Modus des Levels                                                                                                           |
| `LEVEL_DATA`, `LEVEL_SIZE`, `LEVEL_END`                                       | Start-, Größen- und erste freie Adresse nach den Leveldaten                                                                                                 |
| `LEVEL_OBJ_X_LO/HI`, `LEVEL_OBJ_Y_LO/HI`, `LEVEL_OBJ_TYPE`, `LEVEL_OBJ_PARAM` | Objekttabelle (Objektebene des Level-Editors): Position in Levelpixeln, Typ und Parameterbyte, in Scrollreihenfolge — `LEVEL_OBJ_COUNT` Einträge (max. 255) |
| `LEVEL_OBJ_T_START` … `LEVEL_OBJ_T_TRIGGER`                                   | Objekttypnummern: START 0, FEIND 1, GEGENSTAND 2, TÜR 3, AUSGANG 4, AUSLÖSER 5                                                                              |
| `LEVEL_START_X`, `LEVEL_START_Y`                                              | Position des ersten Startobjekts (nur definiert, wenn das Level eines hat)                                                                                  |
| `LEVEL_ATTR`, `LEVEL_ATTR_SOLID` … `LEVEL_ATTR_COLLECT`                       | Charakterattributtabelle (ein Flag-Byte pro Bildschirmcode; nur wenn das Level Attribute besitzt) und ihre Bits: 1, 2, 4, 8                                 |
| `LEVEL_BORDER`, `LEVEL_SCR_COLORS`, `LEVEL_SCR_BG/BORDER/MC1/MC2`             | Level-Rahmen; Farbtabellen pro Slot (zeilenweise wie `LEVEL_SLOT_*`), wenn ein Bildschirm eigene Farben hat (`LEVEL_SCR_COLORS` = 1)                        |

Typischer Schutz: `.assert LEVEL_END <= $9200, "Level-Daten laufen in den
Code"`.

#### LEVEL_ROW

Kopiert eine 40 Zeichen lange Zeile des Levels in einen Puffer: die Level-Zeile
in **X**, beginnend an der in der Variable `col` gespeicherten Level-Spalte, bis
zur Adresse im Zeiger `dst` (`dst` / `dst+1`, lo/hi). Mit dem dritten Argument
`color` werden die Farben anstelle der Bildschirmcodes kopiert (für Farb-RAM).
Ein 40 Zeichen langes Fenster, das sich über zwei Bildschirme erstreckt, wird
mit einer selbstmodifizierenden Kopierschleife verarbeitet (~14 Zyklen pro
Byte). X bleibt erhalten, A und Y werden zerstört. Benötigt einen `.level`-Block
im Programm.

**Syntax:**
```
.level_row dst_lo, view_x
.level_row dst_lo, view_x, color
```

**Größe im Code:** 132 Bytes — Verwenden Sie `LBEQ` / `LBNE`, wenn ein Zweig
darüber springen muss.

---

### SID

Wie **BLOAD für Musik** – lädt eine `.sid`-Datei in Ihren PRG und liest
automatisch deren Init- und Play-Adressen aus dem Header. Rufen Sie Init einmal
beim Start auf und anschließend Play in jedem Frame über Ihren IRQ-Handler.

| Argument                              | Beschreibung                                                                                                                                |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Datei                                 | Die `.sid`-Datei (PSID / RSID)                                                                                                              |
| Benutzerdefinierte Adresse (optional) | Überschreiben Sie die native Ladeadresse der SID (z. B. `$1000`). Lassen Sie das Feld leer, um die Adresse aus dem SID-Header zu verwenden. |

Der SID-Header gibt Folgendes an:
- **Ladeadresse** — wo die Daten im Speicher abgelegt werden (die
  benutzerdefinierte Adresse, falls eine angegeben ist)
- **Initial address** — call this with JSR to initial the music (moved together
  with a custom address)
- **Wiedergabeadresse** — Rufen Sie dies mit JSR in jedem Frame in einem
  IRQ-Handler auf (zusammen mit einer benutzerdefinierten Adresse verschoben)

**Syntax:**
```
.sid "Ikari_Warriors.sid"
.sid "Ikari_Warriors.sid", $1000
```

**Kommentar zum generierten Code:**
```
    ; SID "Ikari_Warriors.sid" @ $1000  Init:$1000  Play:$1006  (4096 bytes)
```

**Größe im Code:** 0 Bytes inline. Die SID-Binärdatei wird als verzögerter Chunk
an der angegebenen Adresse im PRG abgelegt.

> Wichtig: Die meisten SID-Dateien enthalten fest codierte interne absolute
> Adressen. Diese können nur verschoben werden, wenn die gesamte Binärdatei um
> denselben Offset verschoben wird. Enthält eine SID interne Sprünge zu `$10xx`,
> muss sie an der Adresse `$1000` verbleiben – eine Verschiebung an eine andere
> Adresse würde diese internen Referenzen ungültig machen.

> **Typische Verwendung:** Weisen Sie der SID eine eigene Adresse zu (`.sid
> "tune.sid", $1000`), wenn ihre native Adresse mit Ihrem Code kollidiert. Rufen
> Sie Init einmal beim Start auf und anschließend Play für jedes Frame über
> einen Raster-IRQ-Handler – oder lassen Sie [SID_PLAYER](#sid_player) beides
> erledigen.

**Labels:** Die SID-Direktive definiert `SID_LOAD` (wo die Daten abgelegt
werden), `SID_INIT` und `SID_PLAY` (die Initialisierungs- und
Wiedergabeadressen, die zusammen mit einer benutzerdefinierten Adresse
verschoben werden). `SID_PLAY` fehlt, wenn der Titel keine Wiedergabeadresse hat
(eine RSID, die ihren eigenen IRQ installiert). Verwenden Sie diese in Ihrem
eigenen Code, z. B. `JSR SID_PLAY` in einem IRQ-Handler.

---

### SID_PLAYER

Spielt die Melodie der **SID**-Direktive mit einer einzigen Zeile ab: Sie
initialisiert die Melodie und ruft ihre Wiedergaberoutine immer wieder von einem
Raster-Interrupt aus auf, sodass Ihr Programm mit seiner eigenen Arbeit
fortfahren kann.

| Argument | Beschreibung                                                                              |
| -------- | ----------------------------------------------------------------------------------------- |
| Lied     | Subtune-Nummer, die an die Initialisierungsroutine in A übergeben wird (Standardwert `0`) |
| Raster   | Rasterzeile des Interrupts, `$00`–`$FF` (Standard `$FA`)                                  |

Was es tut: `SEI`, `LDA #song` / `JSR SID_INIT`, schaltet den CIA1-Timer-IRQ aus
(`$DC0D`), setzt den IRQ-Vektor (`$0314/$0315`) auf seinen eingebauten Handler,
die Rasterzeile (`$D012`, Bit 8 von `$D011` gelöscht) und den Raster-IRQ
(`$D01A`), `CLI`, und springt dann über den Handler. Der Handler bestätigt die
Unterbrechung (`ASL $D019`), ruft `JSR SID_PLAY` auf und geht dann zum KERNAL
über (`JMP $EA31`, der auch die Tastatur scannt).

**Syntax:**
```
.sid "Ikari_Warriors.sid"
.sid_player
.sid_player 1, $80
```

**Größe im Code:** 58 Bytes.

> Hinweis: Es wird eine Zeile mit der ID .sid benötigt (SID_INIT und SID_PLAY);
> andernfalls bricht der Build mit einem Fehler ab. Bei deaktiviertem
> CIA1-Timer-IRQ wird der Kernel einmal pro Frame vom Raster-IRQ ausgeführt –
> Tastatur und GETIN funktionieren weiterhin.

---

### INCLUDE

Wie **MERGE in BASIC** – lädt eine weitere Datei und erweitert sie an dieser
Position direkt im Code. Ideal für wiederverwendbare Unterprogrammbibliotheken.

Es werden zwei Dateitypen unterstützt:
- **Plain Assembler-Quellcode** (`.inc`, `.asm`, `.s`) – die Datei wird als
  VMA-Quellcode gelesen. Sie wird bei jedem Build erneut eingelesen, sodass Sie
  sie mit jedem Editor bearbeiten können.
- **Visual Assembler project** (`.json`) — die Blöcke eines C64 Visual Assembler
  Blockprogramms.

| Argument               | Beschreibung                                                                                                                                                                                                                                                                                                |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Datei                  | Ein `.inc` / `.asm` / `.s` Quellcode oder ein `.json` Visual Assembler-Projekt                                                                                                                                                                                                                              |
| Ladeadresse (optional) | Wenn der Parameter gesetzt ist (hexadezimal, z. B. `C000`), wird der eingebundene Code an dieser Adresse platziert – ein `ORG` wird davor gesetzt, und die ORG-Variablen der eingebundenen Datei werden ignoriert. Ohne diesen Parameter steuern die ORG-Variablen der eingebundenen Datei die Platzierung. |

**Syntax:**
```
.include "library.json"
.include "macros.inc", $1500
.include "sprites.asm"
```

- Geben Sie die Dateierweiterung **** an – ein einfacher Name wie `.include
  "macros"` wird als `.include "macros.json"` interpretiert.
- Pfadauflösung: Zuerst wird im Quellverzeichnis gesucht, dann in jedem
  Suchordner (CLI-Befehle: `--base-dir` / `--search`). Pfade, die auf einem
  anderen Rechner gespeichert sind, werden auf ihren reinen Dateinamen
  zurückgeführt. Fehlende Include-Dateien sind kein Fehler – der Build-Prozess
  wird fortgesetzt.

**Generierter Code (keine Adressüberschreibung):**
```
    ; .include "library.json"
    ... (the included code follows)
```

**Generierter Code (mit Ladeadresse `C000`):**
```
    ; .include "library.json" @ $C000
    *=$C000
    ... (the included code follows)
```

> Tipp: Verwenden Sie INCLUDE, um wiederverwendbare Unterprogrammbibliotheken zu
> erstellen, die Sie projektübergreifend nutzen können.
> `.inc`/`.asm`/`.s`-Dateien eignen sich am besten, wenn Sie die Bibliothek in
> einem einfachen Texteditor bearbeiten oder mit anderen 6502-Assemblern teilen
> möchten; `.json`-Dateien, wenn es sich bei der Bibliothek um ein Visual
> Assembler-Blockprogramm handelt. Legen Sie eine Ladeadresse fest, wenn die
> Bibliothek keine eigene ORG-Adresse hat oder wenn Sie deren
> Standardplatzierung überschreiben möchten.

> **2.1:** Eine nicht gefundene Include-Datei führt zu einem Fehler, ebenso wie
> eine Datei, die sich selbst einbindet (direkt oder in einer Unterdatei). Die
> eigenen Zeilen `.include`, `.incbin` und `.sid` einer eingebundenen Datei
> werden ebenfalls relativ zu ihrem Ordner geladen, und ihre Makroaufrufe werden
> bis zu 16 Ebenen tief expandiert.

---

### TABLE

Wie **DIM an einer bestimmten Adresse** – benennt eine Nachschlagetabelle und
legt deren Speicherort fest. Fügen Sie im Anschluss die Zeilen `.byte`, `.word`
oder `.fill` ein, um den Inhalt der Tabelle zu definieren.

| Argument | Beschreibung                                              |
| -------- | --------------------------------------------------------- |
| Name     | Bezeichnung für die Tabelle (z. B. `color_table`)         |
| Adresse  | Feste Adresse, an der die Tabelle beginnt (z. B. `$C000`) |

**Syntax:**
```
.table color_table $C000
.table lookup              ; at the current address
```

**Generierter Code:**
```
color_table:
```

Mit einer Adresse springt der Programmzähler dorthin; ohne Adresse beginnt die
Tabelle an der aktuellen Adresse. Fügen Sie im Anschluss die Zeilen `.byte` /
`.word` / `.fill` ein, um den Inhalt zu füllen.

**Größe:** 0 Bytes.

---

### ORG

Legt fest, wo im Speicher das Programm (oder ein Teil davon) abgelegt wird –
vergleichbar mit der Wahl einer Startadresse vor der Eingabe von Maschinencode.
Jedes Programm benötigt mindestens eine ORG-Adresse. Die standardmäßige, in C64
BASIC ladbare Startadresse ist `$0801`.

| Argument  | Beschreibung                                                              |
| --------- | ------------------------------------------------------------------------- |
| Adresse   | Die neue Ursprungsadresse (z. B. `0801` in HEX oder `2049` in DEC)        |
| HEX / DEC | Umschaltt die Adresseingabe zwischen hexadezimaler und dezimaler Anzeige. |

**Syntax:**
```
* = $C000
```

**Generierter Code:**
```
* = $C000
```

**Größe:** 0 Bytes. ORG selbst generiert keinen Maschinencode.

Jede ORG-Adresse leitet einen neuen Abschnitt ein. Die folgenden Zeilen werden
ab dieser Adresse zusammengesetzt. Die PRG-Adresse enthält alle Abschnitte in
einer einzigen Datei – Lücken zwischen den Abschnitten werden mit Nullen
aufgefüllt.

**Beispiel — Code unter `$0801`, Datentabelle unter `$C000`:**
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

> **Tipp:** Ohne ORG beginnt das Programm bei `$0801` (2049 dezimal), dem Beginn
> von BASIC. Mit dem BASIC-SYS-Stub (Standardeinstellung) fügt der Assembler
> eine kurze `10 SYS…` Zeile bei `$0801` ein, und Ihr Code beginnt bei `$080D`.
> Siehe [Ausgabe: PRG, BASIC-Stub und
> Einstiegspunkt](#3-ausgabe-prg-basic-stub-und-einstiegspunkt).

---

### LOOP / NEXT

Wie **`FOR X=N TO 1 STEP -1 : ... : NEXT X`** in BASIC – zählt von N bis 1
herunter und verwendet dabei das X- oder Y-Register. Platzieren Sie Ihre
Anweisungen zwischen LOOP und NEXT, und die Schleife wird automatisch die
richtige Anzahl Male ausgeführt.

#### LOOP

| Argument     | Beschreibung                                                               |
| ------------ | -------------------------------------------------------------------------- |
| Registrieren | `X` oder `Y` — das Zählerregister                                          |
| Zählen       | Anzahl der Schleifendurchläufe (hexadezimal oder dezimal, z. B. `0A` = 10) |
| Etikett      | Automatisch generierte Schleifenbezeichnung (z. B. `loop0`)                |

**Syntax:**
```
.loop X, 10, loop0
```

**Generierter Code:**
```
    LDX #$0A
loop0:
```

**Größe:** 2 Bytes (LD_ Opcode + unmittelbarer Operand).

#### NEXT

| Argument     | Beschreibung                             |
| ------------ | ---------------------------------------- |
| Registrieren | Automatisch dem LOOP-Register zugeordnet |
| Etikett      | Automatisch mit dem LOOP-Label verknüpft |

**Syntax:**
```
.next loop0
```

**Generierter Code:**
```
    DEX
    BNE loop0
```

**Größe:**3 Bytes (DEX + BNE + Verzweigungsoffset).**Beispiel – 10 Bildschirmzellen löschen:**
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

Wie **`FOR X=0 TO N-1 : ... : NEXT X`** in BASIC — zählt *up* von 0. Ideal, wenn
Sie einen Vorwärtsindex benötigen, z. B. zum Durchlaufen einer Zeichenkette oder
eines Arrays.

#### FOR

| Argument     | Beschreibung                                                                                             |
| ------------ | -------------------------------------------------------------------------------------------------------- |
| Registrieren | `X` oder `Y` — das Zählerregister                                                                        |
| Zählen       | Schleifengrenze (hexadezimal oder dezimal, z. B. `$12` = 18). X/Y läuft von 0 bis zur Schleifengrenze-1. |
| Etikett      | Automatisch generierte Schleifenbezeichnung (z. B. `for0`)                                               |

**Syntax:**
```
.for X, $12, for0
```

**Generierter Code:**
```
    LDX #$00
for0:
```

**Größe:** 2 Bytes (LD_ Opcode + `#$00`).

#### ENDF

| Argument     | Beschreibung                                 |
| ------------ | -------------------------------------------- |
| Registrieren | Automatisch mit dem FOR-Register abgeglichen |
| Etikett      | Automatisch mit dem FOR-Label verknüpft      |
| Zählen       | Automatisch aus dem gepaarten FOR kopiert    |

**Syntax:**
```
.endf for0
```

**Generierter Code:**
```
    INX
    CPX #$12
    BNE for0
```

**Größe:**5 Bytes (IN_ + CP_ #imm + BNE Offset).**Beispiel — Ausgabe einer nullterminierten Zeichenkette:**
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

> **LOOP vs FOR:** LOOP zählt abwärts (N→1) – gut für Verzögerungen,
> Füllschleifen und Pixelschleifen. FOR zählt aufwärts (0→N) – gut für den
> Zugriff auf Zeichenketten/Arrays. Beide können X oder Y verwenden.

---

### PUSH / PULL

Ähnlich wie ** das Speichern von Variablen vor einem GOSUB und deren
Wiederherstellung danach ** – jedoch unter Verwendung des 6502-Hardware-Stacks.
Wenn eine Subroutine A, X oder Y verwendet, muss sie mit PUSH und PULL
umschlossen werden, damit die Register des aufrufenden Codes erhalten bleiben.

#### PUSH

Legt ein oder mehrere Register auf den Stack. Die Reihenfolge ist immer A → X →
Y (das innerste zuerst).

| Argument | Beschreibung                                                  |
| -------- | ------------------------------------------------------------- |
| Register | Beliebige Kombination: `A`, `X`, `Y`, `AX`, `AY`, `XY`, `AXY` |

**Syntax:**
```
.push AXY
```

**Generierter Code (Beispiel: `AX`):**
```
    PHA
    TXA
    PHA
```

**Größe:** 1 Byte für A (`PHA`), 2 Bytes für X oder Y (Transfer + Push).

#### PULL

Stellt Register vom Stack in umgekehrter Reihenfolge wieder her **** (Y → X →
A).

| Argument | Beschreibung                                                             |
| -------- | ------------------------------------------------------------------------ |
| Register | Gleiches gilt für PUSH – muss mit dem entsprechenden PUSH übereinstimmen |

**Syntax:**
```
.pull AXY
```

**Generierter Code (Beispiel: `AX`):**
```
    PLA
    TAX
    PLA
```

> **Regel:**PUSH und PULL müssen immer den** gleichen Registersatz**
> verwenden. `PUSH AX` → `PULL AX` (intern wird die Wiederherstellung in
> umgekehrter Reihenfolge durchgeführt: zuerst X, dann A).

---

### END / RTS alias

Wie **RTS mit einem benutzerfreundlicheren Makronamen** — `.end` gibt ein
einzelnes `RTS` Byte aus, einen kurzen Unterprogrammterminator.

**Syntax:**
```
.end
```

**Generierter Code:**
```
    RTS
```

**Größe:** 1 Byte.

Verwenden Sie diese Option, wenn Sie eine Unterprogramm-Endmarkierung benötigen,
die eher einem Makro als einer einfachen Anweisung ähnelt.

---

### MACRO / ENDM / INVOKE

Wie **a named GOSUB with parameters** – definieren Sie einen wiederverwendbaren
Codeabschnitt einmal (MACRO…ENDM) und rufen Sie ihn dann überall mit INVOKE auf.
Übergeben Sie jedes Mal unterschiedliche Argumentwerte, anstatt Code zu kopieren
und einzufügen.

#### MACRO (definition start)

| Argument  | Beschreibung                                                                         |
| --------- | ------------------------------------------------------------------------------------ |
| Name      | Kennung für das Makro (z. B. `setColor`)                                             |
| Parameter | Optionale, durch Kommas getrennte Parameternamen (z. B. `color` oder `color, count`) |

Markiert den Beginn einer Makrodefinition. Die Zeilen zwischen MACRO und ENDM
bilden den Makrokörper. Ein Makro mit Parametern ** erzeugt an der
Definitionsstelle keinen Code**. Ein Makro ohne Parameter wird dort ebenfalls
als Unterprogramm assembliert (`JSR-Name` ruft es auf): Der Programmablauf
überspringt es, und ein `RTS` wird am Ende hinzugefügt. In einer Bibliothek, die
an einer festen Adresse eingebunden ist, erhält ein solches Makro ebenfalls das
`RTS`. Im Makrokörper wird ein Parameter als `{paramName}` oder als sein reiner
Name geschrieben. Der Aufruf füllt das Argument auf – sowohl in den
Befehlsoperanden als auch in den Argumenten der Bibliotheksmakros (`.set_border
c`, `.sprite_pos n, x, y` …). Labels, LOOP-Labels und Laufzeit-Labels `.if` /
`.while` des Makrokörpers sind pro Aufruf eindeutig. Ein Makroaufruf innerhalb
eines Makrokörpers wird nicht expandiert (ein Fehler).

**Generierter Code:**
```
; .MACRO setColor (color)
    ... (body)
; .ENDM
```

**Syntax:**
```
.macro setColor color
    LDA {color}
    STA $D020
.endm
```

#### ENDM (definition end)

Schließt die aktuelle Makrodefinition. Keine Argumente.

#### INVOKE

Ruft an dieser Position ein definiertes Makro auf und ersetzt die Platzhalter
`{paramName}` im Makrokörper durch die angegebenen Argumentwerte.

| Argument  | Beschreibung                                                                                        |
| --------- | --------------------------------------------------------------------------------------------------- |
| Makroname | Ein im Programm oder in einer eingebundenen Datei definiertes Makro.                                |
| Argumente | Durch Kommas getrennte Argumentwerte, die der Parameterliste des Makros entsprechen (z. B. `#$07`). |

**Generierter Code:**
```
; .invoke setColor(#$07)
    LDA #$07
    STA $D020
```

**Syntax:**
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

Der Makrokörper wird inline expandiert, wobei `{paramName}` durch die
tatsächlichen Argumente ersetzt wird. Die durch Leerzeichen getrennte Form
(`.invoke setColor #$07`) wird ebenfalls akzeptiert.

**Argumenttypen:**-**Numerisch**: `#$07`, `$10`, `255` — Hexadezimal- oder Dezimalwerte
- **Textzeichenfolgen**: `"Hallo Welt!"` — Zeichenketten in Anführungszeichen
  (die Anführungszeichen werden entfernt); Kommas innerhalb von
  Anführungszeichen werden als Teil des Textes und nicht als
  Argumenttrennzeichen behandelt.
- **Zeichenliteral**: `'A'` — bleibt ein Zeichenliteral, daher erhält der Rumpf
  seinen Code (`$41`)
- **Gemischt**: `#$07, "Hallo", $20` — beliebige Kombination

> **Tipp:** Definieren Sie Makros am Anfang (oder Ende) Ihres Programms und
> rufen Sie sie dann bei Bedarf auf. Makros können mehrfach mit
> unterschiedlichen Argumenten aufgerufen werden.

> **2.1:** Ein Makro kann ein anderes Makro aufrufen (`both(a, b)` Aufruf von
> `setc(a)`); der innere Aufruf erhält die Argumente des äußeren Aufrufs und
> seine eigenen eindeutigen lokalen Labels. Ein Makro, das sich selbst aufruft,
> beendet sich nach 16 Ebenen mit einem Fehler, anstatt sich aufzuhängen.

---

### REGION / ENDREGION

Reine Gruppierung für Editoren und Listings — **null Bytes**, keine Auswirkung
auf den assemblierten Code.

| Argument    | Beschreibung                                                                      |
| ----------- | --------------------------------------------------------------------------------- |
| Regionsname | Freitextbezeichnung für den Abschnitt (z. B. `init`, `game_loop`, `sprite_setup`) |

**Syntax:**
```
.region init
    ; code...
.endregion
```

**Generierter Code:**
```
; region init
    SEI
    LDA #$00
    STA $D020
; endregion init
```

**Größe:** 0 Bytes für REGION und ENDREGION.

> **Hinweis:**Regionen können**ineinander verschachtelt werden.** Jede
> ENDREGION schließt die nächstgelegene offene REGION. Dies hat keine Auswirkung
> auf die Ausgabe.

---

### DEFINE / IF / ELSE / ENDIF

Wie ein Schalter, den der Assembler liest, wird durch die Anweisung **DEFINE
DEBUG** ein Symbol aktiviert. Anschließend werden die Zeilen von `IF DEBUG`
assembliert und der zugehörige Zweig `ELSE` übersprungen. Entfernt man DEFINE,
verschwindet der IF-Teil aus der Ausgabe. Für Release-Builds ist kein
Code-Löschen erforderlich.

#### DEFINE

| Argument | Beschreibung                                                                                         |
| -------- | ---------------------------------------------------------------------------------------------------- |
| Symbol   | Ein oder mehrere durch Kommas getrennte Bezeichner zur Aktivierung (z. B. `DEBUG` oder `DEBUG, PAL`) |

**Syntax:**
```
.define DEBUG, PAL
```

**Generierter Code:**
```
; .DEFINE DEBUG
; .DEFINE DEBUG, PAL
```

Ein `DEFINE` kann mehrere Symbole gleichzeitig aktivieren (durch Kommas
getrennt). Platzieren Sie DEFINEs am Anfang Ihres Programms.

#### IF

| Argument | Beschreibung                                                                                                                      |
| -------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Zustand  | Ein `.define`d-Symbol (aktiv), ein `.const`-Name (aktiv, wenn nicht null) oder ein konstanter Ausdruck (`LEVEL == 2`, `MODE & 1`) |

**Syntax:**
```
.if DEBUG
```

**Generierter Code:**
```
; .IF DEBUG
```

Die Zeilen zwischen `IF` und `ENDIF` (oder `ELSE`) werden durch die Bedingung
entweder kompiliert oder übersprungen. Ein einfacher Name ist wahr, wenn er
`.define`d oder ein Wert ungleich Null `.const` ist, und falsch, wenn er keines
von beidem ist. Jede andere Bedingung muss ein konstanter Ausdruck sein – ein
Ausdruck, der zur Kompilierzeit nicht ausgewertet werden kann, führt zu einem
Fehler. Übersprungene Zeilen erscheinen als `; [IF übersprungen] …`-Kommentare
und erzeugen **Nullbytes**.

#### ELSE

Keine Argumente. Markiert den alternativen Zweig – wird zusammengesetzt, wenn
die Bedingung `IF` nicht *aktiv ist.

**Syntax:**
```
.else
```

**Generierter Code:**
```
; .ELSE
```

#### ENDIF

Keine Argumente. Schließt den bedingten Teil ab.

**Syntax:**
```
.endif
```

**Generierter Code:**
```
; .ENDIF
```

**Größe:** 0 Bytes für alle vier Direktiven. Nur der Inhalt *zwischen* zählt.

**Beispiel – Debug-Randblitz, Release-Build überspringt ihn:**
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

**Beispiel — mehrere Symbole in einer DEFINE:**
```
; .DEFINE DEBUG, PAL

; .IF PAL
    LDA #$xx        ; PAL timing constant
; .ELSE
    LDA #$xx        ; NTSC timing constant
; .ENDIF
```

Verschachtelte `IF`-Anweisungen werden unterstützt. Wird ein äußerer Teil
übersprungen, werden auch die inneren Teile übersprungen.

> **Hinweis:** Dies ist die Behandlung von Bedingungen zur Kompilierzeit.
> Informationen zu Vergleichs- und Verzweigungsfunktionen zur Laufzeit finden
> Sie unter **Laufzeit-IF / ELSE / ENDIF** weiter unten.

### .ASSERT

Eine Kompilierzeit-Integritätsprüfung **.assert` wertet einen Ausdruck während
der Assemblierung aus; ist das Ergebnis falsch (0), wird der Build mit einer
eindeutigen Fehlermeldung, die den tatsächlichen Wert enthält, abgebrochen. Ist
das Ergebnis wahr (ungleich null), wird keine Ausgabe erzeugt.

| Argument  | Beschreibung                                                                                                                        |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Ausdruck  | Beliebige Assembler-Ausdrücke: Labels, `CONST`s, `*` (Programmzähler), Arithmetik und Vergleiche (`<`, `<=`, `>`, `>=`, `==`, `!=`) |
| Nachricht | Optionaler Text, der an die Fehlermeldung angehängt wird                                                                            |

**Syntax:**
```
.assert spriteData < $C000
.assert * < $A000
.assert end - start <= 256, "sprite table overflowed one page"
```

**Verhalten:**-**Größe:** 0 Bytes.
- Eine falsche Assertion führt zum Abbruch der Assemblierung: `` `.assert end -
  start <= 256` ist falsch (Wert: 0). Die Sprite-Tabelle hat einen
  Seitenüberlauf. ``
- Eine Assertion, die nicht ausgewertet werden kann (undefinierte Bezeichnung
  usw.), schlägt ebenfalls fehl, mit *"kann zur Assemblierungszeit nicht
  ausgewertet werden"*.
- Vergleiche ergeben `1` / `0`; platzieren Sie `.assert` an beliebiger Stelle im
  Programmablauf – es wird an der Adresse geprüft, an der es sich befindet, so
  dass `.assert * < $D000` die aktuelle Ausgabeposition prüft.

**Beispiel — Schützen von Sprite-Daten vor Seitenüberschreitungen:**
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

Wie **eine benannte Variable, die sich nie ändert** — `SCREEN = $0400`.
Verwenden Sie den Namen, anstatt überall Rohadressen einzugeben. Dadurch wird
der Code lesbarer und lässt sich später leichter ändern.

| Argument | Beschreibung                                                                                                                  |
| -------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Name     | Kennung für die Konstante (z. B. `SCREEN`)                                                                                    |
| Wert     | Numerischer Wert in der ausgewählten Basis (z. B. `0400` in HEX = Adresse $0400) oder ein PC-relativer Ausdruck (siehe unten) |
| Format   | HEX oder DEC – steuert, wie der Wert eingegeben und angezeigt wird                                                            |

**Syntax:**
```
.const SCREEN = $0400
.const FRAMES_1S = 60
```

**Generierter Code:**
```
; .CONST SCREEN = $0400
```

**PC-relative Ausdrücke (`*+N` / `*-N`):**

Der Wert akzeptiert auch `*+N` oder `*-N`, wobei `*` die Adresse der Zeile
`.const` selbst ist. Dies wird verwendet, um einen benannten Alias für ein Byte
innerhalb einer benachbarten Anweisung zu erstellen – das klassische
selbstmodifizierende Code-Muster:

```
.const op = *+1      ; op → address of the immediate operand of the next LDA
LDA #$00            ; $00 will be patched at runtime
...
STA op              ; overwrites the #$00 byte → LDA reads the new value next time
```

Die CONST-Anweisung gibt 0 Bytes aus; die Marke wird zur Kompilierzeit zu
`current_address + 1` aufgelöst.

**Arithmetische Ausdrücke:**

Der Wert akzeptiert allgemeine Arithmetik, einschließlich Verweise auf zuvor
definierte CONST-Namen, Hex-/Binärliterale und eingebaute mathematische
Funktionen:

```
.const SCREEN      = $0400
.const SCREEN_END  = SCREEN + 40*25   ; 1000 bytes later
.const COLOR_RAM   = $D800
.const MID_X       = 160
.const SIN_TABLE   = round(sin(PI/8) * 127)   ; pre-computed sine value
```

**Eingebaute Funktionen:** `sin()`, `cos()`, `round()`, `max(a,b)`, `min(a,b)`,
`abs()`, constant `PI`

Operatoren: `+ - * /` Literale: `$FF` (hex), `%10110000` (binär)
Niedrigstes/höchstes Byte: `lo(expr)`, `hi(expr)`

**Größe:** 0 Bytes.

---

### VAR

Wie **CONST, aber automatisch allokiert** – `VAR` reserviert Nullseitenspeicher
für eine Bezeichnung, ohne dass Sie die Adresse eingeben müssen. Verwenden Sie
es für Zähler, Zeiger und kurzlebige Zustände, die in die Nullseiten gehören.

| Argument         | Beschreibung                                                          |
| ---------------- | --------------------------------------------------------------------- |
| Name             | Variablenname / Bezeichnung                                           |
| Größe (optional) | Anzahl der zu reservierenden Bytes. Für ein einzelnes Byte weglassen. |

**Syntax:**
```
.var counter
.var timer, 2
.var lives
```

**Praktisches Beispiel:**
```
.region Vars
.var counter
.var timer, 2
.endregion

LDA #$00
STA counter
```

**Generierter Code:**
```
; .var counter
```

**Größe:** Standardmäßig 1 Byte, oder `N` Bytes, wenn die Größe angegeben wird.

Der Speicherallokator durchläuft einen konfigurierbaren Nullseiten-Cursor (`$02`
bis `$FE`) und weist den nächsten freien Speicherplatz zu. Falls der
angeforderte Bereich eine bereits verwendete Marke überschneidet, gibt der
Compiler eine Warnung aus.

---

### Runtime IF / ELSE / ENDIF

Wie **eine echte Verzweigungsvorlage** – diese Version arbeitet zur Laufzeit,
nicht zur Kompilierzeit. Sie vergleicht `A`, `X` oder `Y` mit einem
unmittelbaren Wert und gibt die korrekte Verzweigungssequenz `CMP` / `CPX` /
`CPY` aus.

| Argument     | Beschreibung                            |
| ------------ | --------------------------------------- |
| Registrieren | `A`, `X` oder `Y`                       |
| Operator     | `==`, `!=`, `<`, `<=`, `>`, `>=`        |
| Wert         | Sofortiger Wert im HEX- oder DEC-Format |

**Syntax:**
```
.if A == #$10
    LDA #$07
.else
    LDA #$0F
.endif
```

**Größe:** Abhängig von den gewählten Zweigen und dem Vergleichsformular.

Der Vergleich erfolgt standardmäßig vorzeichenlos. Für `<=` und `>` wird das
Makro zur kürzesten äquivalenten Verzweigungskette für das ausgewählte Register
erweitert.

---

### WHILE / ENDW

Wie **eine Laufzeitschleife mit einer Bedingung am Anfang** – der
Schleifenkörper wird so lange ausgeführt, wie die Bedingung wahr bleibt.

| Argument     | Beschreibung                            |
| ------------ | --------------------------------------- |
| Registrieren | `A`, `X` oder `Y`                       |
| Operator     | `==`, `!=`, `<`, `<=`, `>`, `>=`        |
| Wert         | Sofortiger Wert im HEX- oder DEC-Format |

**Syntax:**
```
.while A != #$00
    JSR getchar
.endw
```

**Größe:** Abhängig vom Schleifenkörper und der Vergleichsform.

Verwenden Sie `WHILE`, wenn die Schleife vor Abschluss der ersten Iteration
beendet werden kann. Es ist das Laufzeit-Pendant zum zählerbasierten
Hilfsprogramm `LOOP / NEXT`.

---

### REPEAT / UNTIL

Wie **eine Laufzeitschleife mit einem Test am Ende** – der Schleifenkörper wird
immer mindestens einmal ausgeführt, dann entscheidet die Bedingung, ob
angehalten wird.

| Argument     | Beschreibung                            |
| ------------ | --------------------------------------- |
| Registrieren | `A`, `X` oder `Y`                       |
| Operator     | `==`, `!=`, `<`, `<=`, `>`, `>=`        |
| Wert         | Sofortiger Wert im HEX- oder DEC-Format |

**Syntax:**
```
.repeat
    JSR getchar
.until A == #$00
```

**Größe:** Abhängig vom Schleifenkörper und der Vergleichsform.

Verwenden Sie `REPEAT / UNTIL`, wenn der Funktionskörper mindestens einmal vor
der Exit-Prüfung ausgeführt werden soll.

---

### MEMCPY / MEMSET

Wie **kleine Speicherroutinen, auf die Sie ständig zurückgreifen** — `MEMCPY`
kopiert einen zusammenhängenden Block, `MEMSET` füllt einen Bereich mit einem
Byte.

| Makro    | Argumente               |
| -------- | ----------------------- |
| `MEMCPY` | `src`, `dst`, `size`    |
| `MEMSET` | `addr`, `value`, `size` |

**Syntax:**
```
.memcpy src=$C000, dst=$D000, size=$0100
.memset addr=$0400, value=#$20, size=$03E8
```

**Generierter Code:** Inline-Kopier-/Füllschleifen, ausgewählt, um der
angeforderten Größe zu entsprechen.

Bei Größen bis zu 256 Byte wird eine kurze 8-Bit-Schleife verwendet. Größere
Größen schalten automatisch auf einen 16-Bit-Zähler um.

> **2.1:** Die Größe muss beim Layout des Codes bekannt sein – eine Zahl oder
> eine Konstante. Ein später definiertes Label (dessen Wert dem Layout noch
> nicht bekannt ist) ist ein Fehler und kein Code, der nicht an seinen Platz
> passt.

---

### PRINT / PRINT_CHAR / PRINT_HEX / CLEAR_SCREEN / WAIT_KEY / DELAY / SET_BORDER / SET_BG

#### PRINT

Wie **PETSCII Ausgabe ohne den Boilerplate** — gibt eine Zeichenkette durch
`CHROUT` mit der gleichen Groß-/Kleinschreibungsbehandlung (`lower`) wie
`.petscii` aus.

**Syntax:**
```
.print "HELLO"
.print "hello", lower
```

#### PRINT_CHAR

Gibt ein PETSCII-Byte anhand seines numerischen Codes aus und sendet es über
`CHROUT`. Der Wert kann auch eine benannte Konstante oder ein Label sein, das
zur Assemblierungszeit in ein Byte aufgelöst wird.

**Syntax:**
```
.print_char 65
.print_char $41
.print_char color
```

#### PRINT_HEX

Gibt einen 8-Bit-Wert als Hexadezimaltext über den normalen KERNAL-Ausgabepfad
aus.

**Syntax:**
```
.print_hex A
```

#### CLEAR_SCREEN

Abkürzung für den Standard-C64-Clear-Screen-Steuerungscode.

**Syntax:**
```
.clear_screen
```

#### WAIT_KEY

Wartet, bis eine Taste gedrückt wird, damit Sie die `GETIN`-Schleife nicht jedes
Mal manuell ausführen müssen.

**Syntax:**
```
.wait_key
```

#### DELAY

Wartet die angeforderte Anzahl an Frames mithilfe einer gemeinsamen Hilfsroutine
ab. Verwenden Sie dies für kurze Pausen und Zeitlücken, wenn eine vollständige
benutzerdefinierte Schleife übertrieben wäre. Die Frame-Anzahl kann eine Rohzahl
oder eine benannte Konstante sein, und `.wait` ist lediglich ein Alias für
`.delay`.

**Syntax:**
```
.delay 29
.wait 29
.delay frames=FRAMES_1S
```

#### SET_BORDER / SET_BG

Komfortable Wrapper für die Farbregister des VIC-II. Der Farbwert kann eine
Rohzahl oder eine benannte Konstante sein, die einen Wert zwischen 0 und 15
annimmt.

**Syntax:**
```
.set_border 6
.set_bg 0
.set_border color
.set_bg color
```

**Größe:** Jeder Helfer wird zu einer winzigen Registerschreibsequenz oder einem
kurzen KERNAL-Aufruf erweitert.

---

### IRQ_SETUP

Richtet einen Raster-IRQ-Handler in einem Schritt ein. Das Makro schreibt den
IRQ-Vektor, aktiviert Raster-IRQs, setzt die Leitung, deaktiviert die
gemeinsamen CIA-IRQ-Quellen und kehrt mit `CLI` zur normalen Ausführung zurück.

| Argument | Beschreibung                                                      |
| -------- | ----------------------------------------------------------------- |
| Handler  | IRQ-Routinebezeichnung (z. B. `my_irq`)                           |
| Raster   | Rasterzeile in Hexadezimal- oder Dezimaldarstellung (z. B. `$FA`) |

**Syntax:**
```
.irq_setup handler=my_irq, raster=$FA
```

**Größe:** Eine kleine Setup-Sequenz; die genaue Länge hängt von der
ausgewählten Rasterzeile ab.

Verwenden Sie dies, wenn Sie den üblichen "SEI / Install Handler / Enable IRQ /
CLI"-Code benötigen, ohne ihn über das gesamte Programm zu verteilen.

---

### RAND

Wie **ein winziger eingebauter PRNG** — gibt einen 8-Bit-Pseudozufallswert aus
einem kompakten Nullseiten-Seed zurück.

| Argument | Beschreibung                                                           |
| -------- | ---------------------------------------------------------------------- |
| Samen    | Optionales Startbyte oder Label für die Nullseite (Standardwert `$FB`) |

**Syntax:**
```
.rand
```

**Größe:** Eine Handvoll Bytes, abhängig vom gewählten Implementierungspfad.

Der Generator ist für Gameplay, Effektvariationen und schnelle Testdaten
gedacht. Er ist bewusst klein gehalten und verzichtet auf kryptografisch
ausgefeilte Sicherheitsvorkehrungen.

---

<a id="sprite_init"></a>
### SPRITE_INIT

Erstellt einen VIC-II-Sprite in einer einzigen Zeile – anstatt etwa sechs
POKE-Anweisungen in BASIC zu schreiben. Setzt den Datenzeiger des Sprites,
schaltet ihn ein, aktiviert optional den Mehrfarbenmodus und legt seine Farbe
fest.

| Argument   | Beschreibung                                                                       |
| ---------- | ---------------------------------------------------------------------------------- |
| Sprite #   | Sprite-Nummer 0–7                                                                  |
| Farbe      | Farbindex 0–15 (C64-Palette)                                                       |
| Datenseite | Sprite-Datenadresse / 64 (z. B. `$21`, wenn sich die Daten unter `$0840` befinden) |
| Mehrfarbig | Schaltet das Mehrfarbenbit des Sprites um (`$D01C`)                                |

**Syntax:**
```
.sprite_init 0, 7, $21
.sprite_init 0, 7, $21, multicolor
.sprite_init 0, 7, $21, mono
```

**Generierter Code:**
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

**Größe:** 26 Bytes.

> **Sprite-Datenseite:** `Datenadresse ÷ 64`. Mit dem standardmäßigen BASIC
> SYS-Stub platziert `ALIGN 64` nach `JMP main` Sprite-Daten an `$0840` → Seite
> = `$21`.

---

<a id="sprite_pos"></a>
### SPRITE_POS

Wie **`POKE 53248, x : POKE 53249, y`** in BASIC – setzt dies die Startposition
eines Sprites. Die Koordinaten werden zur Assemblierungszeit festgelegt und
akzeptieren Konstanten; für Animationen verwenden Sie `INC`/`DEC` direkt auf dem
Sprite-Register.

| Argument | Beschreibung               |
| -------- | -------------------------- |
| Sprite # | Sprite-Nummer 0–7          |
| X        | Horizontale Position 0–319 |
| Y        | Vertikale Position 0–255   |

**Syntax:**
```
.sprite_pos 0, 152, 100
```

**Generierter Code (Beispiel: Sprite 0, X=152, Y=100):**
```
    LDA #$98        ; X low byte
    STA $D000       ; sprite 0 X register
    LDA $D010
    AND #$FE        ; clear X MSB for sprite 0 (X ≤ 255)
    STA $D010
    LDA #$64        ; Y = 100
    STA $D001       ; sprite 0 Y register
```

Für X > 255 setzt das Makro das entsprechende Bit in `$D010`, anstatt es zu
löschen.

**Größe:** 18 Bytes.

> **Hinweis:** `SPRITE_POS` bettet die X/Y-Koordinaten in den Code ein (`LDA
> #$xx`). Um einen Sprite zur Laufzeit zu animieren, verwenden Sie `INC $D000` /
> `DEC $D000` – siehe das Beispiel `sprite-macro-demo`.

---

<a id="wait_raster"></a>
### WAIT_RASTER

Wartet, bis der Elektronenstrahl des VIC-II eine bestimmte Scanzeile erreicht –
ähnlich der Synchronisierung mit einem Fernsehbild. Platzieren Sie dies am
Anfang Ihrer Spielschleife, um Sprite-Tearing zu verhindern. Kein JSR, keine
Beschriftung erforderlich.

| Argument    | Beschreibung                                                        |
| ----------- | ------------------------------------------------------------------- |
| Rasterlinie | Ziel-Rasterzeile in Hexadezimaldarstellung (z. B. `FF` = Zeile 255) |

**Syntax:**
```
.wait_raster $FF
```

**Generierter Code:**
```
wait:
    LDA $D012       ; current raster line
    CMP #$FF        ; target line
    BNE wait        ; loop back (-7 bytes)
```

**Größe:** 7 Bytes (der `BNE` Offset `$F9` = −7 verweist immer zurück auf den
`LDA`).

> **Tipp:** Platzieren Sie `WAIT_RASTER` am Anfang Ihrer Spielschleife, um die
> Synchronisierung mit der Anzeige zu gewährleisten und Sprite-Tearing zu
> verhindern.

---

### JOYSTICK

Wie das Auslesen von **`PEEK($DC00)`** und anschließendes Anpassen der
Sprite-Position – nur in einer Zeile. Liest einen CIA-Joystick-Port und passt
die X/Y-Register eines Sprites entsprechend an. Komplett inline, kein JSR
erforderlich.

| Argument | Beschreibung                                                            |
| -------- | ----------------------------------------------------------------------- |
| Hafen    | `1` = Port 1 (`$DC01`) oder `2` = Port 2 (`$DC00`)                      |
| Sprite # | Sprite-Nummer 0–7 (steuert, welches X/Y-Registerpaar aktualisiert wird) |

**Syntax:**
```
.joystick 2, 0
```

**Generierter Code (Port 2, Sprite 0):**
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

**Joystick-Bitbelegung (aktiv-LOW — Bit = 0 bedeutet gedrückt):**

| Bisschen | Richtung | CIA-Register                              |
| -------- | -------- | ----------------------------------------- |
| 0        | Hoch     | $DC00 (Port 2) / $DC01 (Port 1)           |
| 1        | Runter   |                                           |
| 2        | Links    |                                           |
| 3        | Rechts   |                                           |
| 4        | Feuer    | (wird von diesem Makro nicht verarbeitet) |

**Größe:** 27 Bytes. Der Offset `BCS` ist immer `+3` (überspringt die folgende
3-Byte-Anweisung `DEC`/`INC abs`).

**Variabler Modus — `.Joystick-Port, vx, vy[, fire]`:** Anstatt einen Sprite zu
bewegen, wird die Richtung in Variablen geschrieben: `vx` / `vy` = `-1` / `0` /
`+1` (`$FF` / `$00` / `$01`), und das optionale `fire` = `1`, solange die Taste
gedrückt ist. Andernfalls `0`. Verwenden Sie es für eine scrollende Kamera,
einen Spieler mit eigener Physik oder Menüs. Port `3` liest beide Joystick-Ports
gleichzeitig (`LDA $DC00` / `AND $DC01`), daher funktioniert jeder Port.

```
.joystick 2, vx, vy          ; 35 bytes
.joystick 3, vx, vy, fire    ; both ports + fire: 45 bytes
```

> **Typische Verwendung:** Platzieren Sie es innerhalb eines `gameloop` Labels
> mit `WAIT_RASTER` zuerst:
> ```
> Spielschleife:
> WAIT_RASTER ($FF)
> JOYSTICK (Port=2, Sprite=0)
> JMP Spielschleife
> ```

---

<a id="mouse"></a>

> **2.1:** Der Port muss bei der Codeerstellung bekannt sein (eine Zahl oder
> eine Konstante), da Port 3 den Code um 3 Bytes verlängert; eine später
> definierte Bezeichnung ist ein Fehler.
### MOUSE

Liest die proportionale Maus eines Commodore 1351 und bewegt einen Sprite.
Vollständig inline ** – kein JSR oder Label erforderlich. Das Makro wählt den
CIA-Port aus, wartet, bis sich die SID-Paddle-Eingaben stabilisiert haben,
dekodiert dann die Delta-Bewegung mit dem Standard-1351-Treibermuster und wendet
sie auf die Sprite-Register an.

| Argument  | Beschreibung                                                                             |
| --------- | ---------------------------------------------------------------------------------------- |
| Hafen     | `1` = CIA `$DC00` Bits `7:6` = `%01`; `2` = `%10`                                        |
| Sprite #  | Sprite-Nummer 0–7                                                                        |
| ZP-Byte X | Nullseitenadresse (hexadezimal) zur Speicherung des vorherigen POTX-Samples (z. B. `FD`) |
| ZP-Byte Y | Nullseitenadresse (hexadezimal) zur Speicherung des vorherigen POTY-Samples (z. B. `FE`) |

**Generierte Codeform (Port 1, Sprite 0, ZP `$FD`/`$FE`):**

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

**Größe:**142 Bytes.**Syntax:**
```
.mouse port, spriteNum, zpX, zpY
; example:
.mouse 2, 0, FD, FE
```

> **Wichtig:** Initialisieren Sie vor dem ersten Aufruf die Nullseitenbytes mit
> den aktuellen POTX/POTY-Werten, um einen Sprung im ersten Frame zu vermeiden:
> ```
> Port 1: LDA $DC00 : AND #$3F : ORA #$40 : STA $DC00
> 
> Port 2: LDA $DC00 : AND #$3F : ORA #$80 : STA $DC00
> 
> LDA $D419 : LSR A : AND #$3F : STA $FD
> 
> LDA $D41A : LSR A : AND #$3F : STA $FE
> ```

> **Tipp:** Fragen Sie die Maus einmal pro Frame ab — platzieren Sie
> `WAIT_RASTER` in der Spielschleife vor `MOUSE`.

---

<a id="sprite_col"></a>
### SPRITE_COL

Wie **`PEEK($D01E)`** in BASIC – prüft die Hardware-Kollisionsregister des
VIC-II und gibt an, ob ein Sprite einen anderen Sprite oder den Hintergrund
berührt hat. Vollständig inline, kein JSR erforderlich.

| Argument      | Beschreibung                                                                                                                  |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Sprite #      | Sprite-Nummer 0–7 (welches Sprite-Bit zu überprüfen ist)                                                                      |
| Kollisionstyp | `Sprite-Sprite ($D01E)` – Kollision mit einem anderen Sprite; `Sprite-Background ($D01F)` – Kollision mit Hintergrundgrafiken |

**Syntax:**
```
.sprite_col 0, sprite
.sprite_col 0, background
```

**Generierter Code (Sprite 0, Sprite–Sprite):**
```
    LDA $D01E       ; read sprite-sprite collision register (clears it!)
    AND #$01        ; isolate bit 0 (sprite 0)
                    ; A ≠ 0 → collision occurred
```

**Größe:** 5 Bytes.

> **Wichtig:**Das Lesen von `$D01E`/`$D01F`** löscht das Register**. Lesen Sie
> es einmal pro Frame und reagieren Sie sofort mit `BEQ`/`BNE`.

**Typische Verwendung:**
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

> **Siehe auch:** `collision-demo` Beispiel — grüner Ball (Sprite #0) vs. rotes
> Kreuz (Sprite #1).

---

### LOADFILE

Wie **`LOAD "Datei",8`** in BASIC – lädt eine Datei zur Laufzeit von einer
D64-Disk mithilfe der KERNAL LOAD-Routine. Verwenden Sie dies, um Daten, Musik
oder zusätzlichen Code von der Diskette zu laden, während Ihr Programm läuft.

| Argument                         | Beschreibung                                                                                                                                                                                                                                   |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dateiname                        | Dateiname auf der Festplatte (max. 16 Zeichen, automatische Großschreibung; die Zeichen `,`, `"`, `/`, `\`, `:`, `*`, `?`, `<`, `>`, `|` werden herausgefiltert)                                                                               |
| Gerät                            | Gerätenummer 8–30 (Standard `8`)                                                                                                                                                                                                               |
| Überschreiben-Adresse (optional) | Hexadezimale Ladeadresse (z. B. `C000`). Ist diese Adresse angegeben, wird die Datei unter dieser Adresse geladen (`sec=0`, PRG-Header wird ignoriert). Wird das Feld leer gelassen, wird der 2-Byte-PRG-Header der Datei verwendet (`sec=1`). |
| Fehlerbezeichnung (optional)     | Falls gesetzt, wird nach JSR LOAD eine `BCS`-Anweisung generiert. Falls KERNAL mit gesetztem Übertrag (Fehler) zurückkehrt, springt die Ausführung zu dieser Marke.                                                                            |

**Syntax:**
```
.loadfile "DEMO-COLORS", 8
.loadfile "DEMO-COLORS", 8, $C000
.loadfile "DEMO-COLORS", 8, $C000, error_label
```

**Generierte Codestruktur:**
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

**Größe:** `3 + Dateinamenlänge + 9 (SETNAM) + 9 (SETLFS) + (4 bei
Überschreibung) + 5 (LOAD) + (2 bei Fehlerbezeichnung)` Bytes. Mindestens 27
Bytes.

> Wichtig: Der Dateiname wird direkt nach einem JMP skip_filename im
> Maschinencode gespeichert. Der Dateiname auf der Festplatte muss in
> Großbuchstaben (PETSCII) vorliegen – entsprechend den ASCII-Großbuchstaben
> (A–Z). Das Makro erzwingt dies automatisch.

> **Verwenden Sie für Produktionsprogramme immer eine Fehlerbezeichnung** – wenn
> die Datei nicht gefunden wird, setzt KERNAL das Übertragsflag und die
> Ausführung springt zum nächsten Programm.

> **Siehe auch:** `loadfile-demo` Beispiel — demonstriert das Laden von
> `DEMO-COLORS.PRG` von einem D64 mit einem BCS-Fehlerzweig und einem visuellen
> Fehlerbildschirm.

---

### EXODECRUNCH

In-Program **Exomizer-Dekomprimierung**. Verwenden Sie dieses Makro direkt nach
einem `LOADFILE`, das einen im Exomizer-Modus `mem` komprimierten Datenstrom
geladen hat – EXODECRUNCH entpackt ihn rückwärts in die im Datenstrom
eingebettete Adresse.

| Argument               | Beschreibung                                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------------------------ |
| Adresse des Entpackers | Speicherort des Entpackungscodes (Standard: `B000`). Es muss sich um eine 16-Bit-Hexadezimaladresse handeln. |

**Syntax:**
```
.exodecrunch
.exodecrunch depacker=$B000
```

**Generierter Code (19 Bytes):**
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

**So funktioniert es:**

1. KERNAL `LOAD` ($FFD5) aktualisiert ZP `$AE/$AF`, sodass der Zeiger eins nach
   dem zuletzt geladenen Byte liegt. EXODECRUNCH kopiert dies nach ZP `$04/$05`,
   was der offiziellen Exomizer-Konvention für das Backward-Source-End
   entspricht.
2. Der Depacker befindet sich üblicherweise an Adresse `$B000` (innerhalb des
   BASIC-ROM-Bereichs). Das Makro schaltet `$01 auf $36` um, sodass die CPU
   während des JSR dort RAM erkennt, und stellt anschließend `$01 auf $37`
   wieder her.
3. Die Dekomprimierungszieladresse wird **in den komprimierten Datenstrom selbst
   kodiert**, wenn Sie mit `exomizer mem -l <load> file,<target> komprimieren` —
   der Depacker liest sie aus den ersten Bytes des Datenstroms.

**Depacker-Binärdatei:** Der vorkompilierte Backward-Depacker ist
`exo-decrunch.bin` (im Ordner `samples/` des C64 Visual Assembler) (477 Bytes,
ORG $B000). Es handelt sich um einen Kick-Assembler-Wrapper der offiziellen
`exodecrunch.asm`, bei dem `INC $D020` bei jedem Lesevorgang hinzugefügt wird,
um einen sichtbaren Randblitz-Effekt während der Dekomprimierung zu erzeugen.
Platzieren Sie die Datei mit `.incbin` an der Depacker-Adresse in Ihrem
Programm.

**Roheingabe:** Die zusätzlichen Daten werden an Exomizer als Rohdatei
übergeben, die an der Zieladresse (`Datei@<Ziel>`) geladen wird, sodass der
Depacker jedes Byte, beginnend mit dem ersten, genau an der von Ihnen
eingegebenen Adresse schreibt.

> **Siehe auch:** das `exo-multicolor-demo` Beispiel – vollständiges
> End-to-End-Beispiel: LOADFILE eine komprimierte Multicolor-Bitmap nach $C000,
> EXODECRUNCH entpackt sie nach $2000, dann kopiert screen → $0400 und color →
> $D800 und schaltet VIC-II in den Multicolor-Bitmap-Modus.

---

### REU_CHECK

Erkennt, ob eine Commodore RAM-Erweiterungseinheit (REU) angeschlossen ist –
ähnlich wie die Überprüfung von `PEEK($D010)`, um festzustellen, ob Hardware
vorhanden ist. Der Test erfolgt durch Schreiben und Auslesen zweier Muster in
das REU-Register `$DF04`.

| Argument | Beschreibung    |
| -------- | --------------- |
| Keiner   | Keine Operanden |

**Generierter Code (34 Bytes):**
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
> Das Makro normalisiert das Ergebnis, sodass der folgende Zweig einfach bleibt:
> `BNE` bedeutet REU vorhanden, `BEQ` bedeutet REU nicht vorhanden.

**Syntax:**
```
.reu_check
```

**Ergebnis in Flags:**-**Z = 0** (Ergebnis ≠ 0) → REU vorhanden → verwende `BNE`
- **Z = 1**(Ergebnis = 0) → kein REU → `BEQ` verwenden**Keine Argumente**— das Makro generiert jedes Mal denselben Code.**Typische Verwendung:**
```assembly
.reu_check
BEQ no_reu        ; skip if REU not present
; ... REU code here ...
no_reu:
```

---

### REU_STASH / REU_FETCH / REU_SWAP

Der DMA-Blocktransfer zwischen C64-RAM und REU-Erweiterungsspeicher funktioniert
ähnlich wie eine extrem schnelle POKE-Schleife, jedoch ohne dass die CPU
arbeiten muss (der REU-Chip kopiert die Daten, während die CPU pausiert). Ein
Transfer von `$1000` Bytes erfolgt praktisch instantan.

| Makro       | Richtung      | `$DF01` Befehl |
| ----------- | ------------- | -------------- |
| `REU_STASH` | C64 RAM → REU | `$90`          |
| `REU_FETCH` | REU → C64 RAM | `$91`          |
| `REU_SWAP`  | C64 RAM ↔ REU | `$92`          |

**Argumente:**

| Argument    | Beschreibung                                            | Beispiel |
| ----------- | ------------------------------------------------------- | -------- |
| C64-Adresse | Quelle/Ziel im C64-RAM (hex)                            | `C000`   |
| REU-Adresse | Quelle/Ziel in REU (hex, 16-Bit)                        | `0000`   |
| REU-Bank    | REU-Speicherbank (0–7)                                  | `0`      |
| Länge       | Anzahl der zu übertragenden Bytes (hexadezimal, 16 Bit) | `1000`   |

**Syntax:**
```
.reu_stash $C000, $0000, 0, $1000
.reu_fetch $C000, $0000, 0, $1000
.reu_swap $C000, $0000, 0, $1000
```

**Generierter Code (40 Bytes):**
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

> **Hinweis:** Befehle verwenden `$90/$91/$92` (Bit 4 gesetzt = sofortiger
> DMA-Modus). Das Schreiben in `$DF01` startet die Übertragung; die CPU setzt
> die Arbeit fort, sobald sie abgeschlossen ist.

---

### TURBO_SET

Legt die CPU-Geschwindigkeit des Ultimate-64 (U64) über das Register $D031 fest.
Hat keine Auswirkung auf einen echten C64 oder andere Emulatoren.

**Argumente:**

| Argument        | Beschreibung              | Reichweite                                       |
| --------------- | ------------------------- | ------------------------------------------------ |
| Geschwindigkeit | CPU-Geschwindigkeitsindex | 0 = 1 MHz … 7 ≈ 10 MHz … 15 ≈ 48 MHz             |
| Badline         | Badline-Emulation         | Aktiviert (C64-kompatibel) / Deaktiviert (Turbo) |

Das Geschwindigkeitsbyte wird wie folgt berechnet: `(speedIndex & 0x0F) |
(badline_disabled ? 0x80 : 0x00)`.

**Generierter Code (5 Bytes):**
```
A9 xx   LDA #speed_byte
8D 31 D0   STA $D031
```

**Syntax:**
```
.turbo_set 7,0    ; speed=7 (~10 MHz), badline enabled
.turbo_set 15,1   ; speed=15 (~48 MHz), badline disabled
```

> **Hinweis:** Dieses Makro wirkt sich nur auf U64-Hardware aus. Auf einem
> echten C64 oder anderen Emulatoren schreibt es in `$D031`, was Auswirkungen
> auf die CIA haben oder ignoriert werden kann.

---

### SUPERCPU_DETECT

Prüft, ob ein **CMD SuperCPU**-Beschleuniger installiert ist – wie
`PEEK($D0B8)`, um zu sehen, ob er etwas anderes als `$FF` zurückgibt.

**Generierter Code (5 Bytes):**
```
AD B8 D0   LDA $D0B8
C9 FF      CMP #$FF
```

**Ergebnis in Flags:**-**Z = 0** → SuperCPU vorhanden → verwende `BNE`
- **Z = 1**→ SuperCPU nicht gefunden → verwende `BEQ`**Keine Argumente.**

**Syntax:**
```
.supercpu_detect
```

**Typische Verwendung:**
```assembly
.supercpu_detect
BEQ no_scpu       ; skip if SuperCPU not present
; ... SuperCPU turbo code here ...
no_scpu:
```

---

### TURBO_ENABLE

Aktiviert oder deaktiviert den SuperCPU-Turbomodus **. Rufen Sie zuerst
`SUPERCPU_DETECT` auf und überspringen Sie diesen Schritt, falls keine SuperCPU
vorhanden ist.

| Modus        | Registrieren | Wirkung                                             |
| ------------ | ------------ | --------------------------------------------------- |
| Aktivieren   | `$D07A`      | Turbo-Modus aktivieren (bis zu 20 MHz mit SuperCPU) |
| Deaktivieren | `$D07B`      | Rückkehr zum 1-MHz-Kompatibilitätsmodus             |

**Generierter Code (5 Bytes):**
```
A9 00         LDA #$00
8D 7A D0      STA $D07A    ; (or $D07B for disable)
```

**Syntax:**
```
.turbo_enable on
.turbo_enable off
```

> **Hinweis:** Rufen Sie zuerst `SUPERCPU_DETECT` auf und verzweigen Sie um
> dieses Makro herum, wenn die SuperCPU nicht vorhanden ist.

---

<a id="map_copy"></a>
### MAP_COPY

Kopiert eine Tilemap von einer Quelladresse in den Bildschirmspeicher (und
optional in den Farbspeicher) mithilfe einer Reihe von `LDA abs,X` / `STA
abs,X`-Schleifen. Pro Schleifendurchlauf wird eine 256 Byte große Seite kopiert;
eine Teilseite am Ende wird mit `CPX #rem / BNE` abgebrochen. Es wird kein JSR
benötigt – der gesamte Code wird inline generiert.

| Argument                  | Beschreibung                                                                                                                                                                                                                                                                    |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Quelladresse (Bildschirm) | Hexadezimaladresse, unter der die Kartendaten nach dem Laden gespeichert werden (z. B. `C000`)                                                                                                                                                                                  |
| Bildschirm RAM Ziel       | Wohin die Bildschirmcodes kopiert werden sollen (z. B. `0400`)                                                                                                                                                                                                                  |
| Größe (Bytes)             | Gesamtzahl der zu kopierenden Bytes — typischerweise `$03E8` = 1000 (40×25 Zeichen)                                                                                                                                                                                             |
| Farbquelle                | `auto`: Die Farbdaten folgen den Bildschirmcodes (`source + size`) oder einer expliziten Farbquelladresse. Die Farbdaten werden in einem zweiten Durchlauf in den Farbspeicher kopiert. Lassen Sie diese Angabe (und das Farbziel) weg, um nur die Bildschirmcodes zu kopieren. |
| Farb-RAM-Ziel             | Ziel für Farbdaten — Standard `D800` (C64 Farb-RAM)                                                                                                                                                                                                                             |

**Generierter Code (1000-Byte-Map, nur Bildschirm):**
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

**Größe:** `2 (LDX) + volleSeiten×9 + (rem > 0 ? 11 : 0)` Bytes pro Abschnitt.
Im kombinierten Modus verdoppelt sich die Größe (Bildschirmabschnitt +
identischer Farbabschnitt).

**Kopplung mit dem Karteneditor:**

Der Karteneditor des C64 Visual Assemblers (**Karte + Farb-RAM speichern**)
exportiert eine einzelne Binärdatei, in der die ersten `size` Bytes
Bildschirmcodes und die folgenden `size` Bytes Farb-RAM-Werte enthalten.
Verwenden Sie `.map_copy` mit `auto` als Farbquelle und der Quelladresse, an der
diese Datei geladen wird (z. B. mit `.incbin` unter `$C000`):

```
    .incbin "map-color.bin", $C000   ; screen codes $C000–$C3E7, color $C3E8–$C7CF
    ; ...
    .map_copy $C000, $0400, 1000, auto, $D800
```

**Syntax:**
```
.map_copy $C000, $0400, 1000               ; screen only
.map_copy $C000, $0400, 1000, auto, $D800  ; combined (color at src+size)
.map_copy $C000, $0400, 1000, $C3E8, $D800 ; explicit color source address
```

---

<a id="map_copy16x16"></a>
### MAP_COPY16X16

Kopiert einen 16×16-Zeichenbereich aus einem kompakten
256-Byte-Bildschirmcodeblock und einem zugehörigen 256-Byte-Farb-RAM-Block. Es
ist für Charset-Canvas-Exporte und kleine Kachel-/Bildabschnitte vorgesehen, bei
denen das Schreiben von sechzehn separaten MAP_COPY-Zeilen zu unübersichtlich
wäre.

**Standardlayout:**

| Daten                 | Standardadresse        |
| --------------------- | ---------------------- |
| 16×16 Bildschirmcodes | Quelladresse (`src`)   |
| 16×16 Farbwerte       | `src + 256`            |
| Bildschirm-RAM-Ziel   | `$0400 + row×40 + col` |
| Farb-RAM-Ziel         | `$D800 + row×40 + col` |

**Syntax:**
```
.map_copy16x16 $3000, 12, 4
.map_copy16x16 $3000, 12, 4, $0400, $3100, $D800
```

Die Kurzform kopiert Bildschirmbytes von `$3000`, Farbbytes von `$3100` und
platziert den 16×16-Block in Spalte 12, Zeile 4. Gültige Positionen oben links
sind `col = 0..24` und `row = 0..9`, sodass der gesamte 16×16-Bereich auf dem
40×25 C64-Textbildschirm erhalten bleibt.

**Generiertes Verhalten:**

- Erzeugt sechzehn Inline-Zeilenkopien.
- Jede Zeile kopiert 16 Bildschirmbytes und 16 Farbbytes.
- Es wird kein JSR benötigt; der Code wird direkt an der Makroposition
  ausgegeben.
- Funktioniert sowohl im normalen Zeichenmodus als auch im
  Mehrfarben-Zeichenmodus; die Farb-RAM-Bytes enthalten das
  Zeichenfarb-/Mehrfarben-Aktivierungsbit jeder Zelle.

Typische Kombination mit Charset Canvas:

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

Bei jedem Aufruf wird der Animationsframe eines Sprites erhöht und der
Datenzeiger des VIC-II-Sprites aktualisiert. Pro Frame wird ein Byte in einer
Tabelle gespeichert (Sprite-Datenseitennummer = `Datenadresse / 64`),
SPRITE_ANIM wird darauf verwiesen und die Funktion einmal pro Spielframe
aufgerufen – JSR ist nicht erforderlich.

| Argument            | Beschreibung                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------------ |
| Sprite #            | Sprite-Nummer 0–7                                                                                |
| Frame-Listenadresse | Hex-Adresse der Frame-Tabelle — ein Byte pro Frame, jedes Byte = Sprite-Seite (`data_addr / 64`) |
| Frame-Anzahl        | Gesamtzahl der Einzelbilder (1–255)                                                              |
| Rahmen ZP           | Null-Seitenbyte, das als Frame-Zähler verwendet wird (z. B. `FB`).                               |

**Generierter Code (Sprite 0, 4 Frames, ZP `$FB`, Liste bei `$C100`):**
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

**Größe:**19 Bytes.**Typische Verwendung:**
```
frameTable:
    .byte $21, $22, $23, $24   ; 4 frames at $0840, $0880, $08C0, $0900

gameloop:
    .wait_raster $FF
    .sprite_anim 0, $C100, 4, $FB
    JMP gameloop
```

**Syntax:**
```
.sprite_anim spriteNum, frameListAddr, frameCount, zpByte
; example:
.sprite_anim 0, C100, 4, FB
```

> **Tipp:** Platzieren Sie die Frametabelle mit `.rawbytes` an einer festen
> Adresse. Das Zähler-ZP-Byte (`$FB`) muss vor dem ersten Aufruf auf `$00`
> initialisiert werden. Wenn Ihr Code `$FB` anderweitig verwendet, wählen Sie
> eine freie ZP-Adresse.

---

<a id="score_bcd"></a>
### SCORE_BCD

Addiert einen Festkommawert zu einem im Speicher abgelegten Mehrbyte-BCD-Wert
und gibt anschließend jede Ziffer als Bildschirmcodezeichen im RAM aus.
Verwendet den Dezimalmodus des 6502 (`SED`/`CLD`) für übertragssichere
BCD-Arithmetik – manuelle Übertragsberechnungen sind nicht erforderlich.

| Argument          | Beschreibung                                                                                                                  |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Score-Adresse     | Hexadezimale Adresse der BCD-Score-Bytes (z. B. `C200`). Niedrigstwertiges Byte zuerst.                                       |
| Ziffern           | Anzahl der BCD-Bytes (jedes Byte enthält zwei Ziffern: `$99` = "99"). `4` Bytes = bis zu 99999999.                            |
| Punkte hinzufügen | Dezimalwert, der pro Aufruf addiert werden soll (z. B. `100`).                                                                |
| Bildschirmadresse | Hier sollen die Ziffernbildschirmcodes eingetragen werden (z. B. `0400`). Ein Byte pro Ziffer (höchstwertiges Nibble zuerst). |

**Syntax:**
```
.score_bcd $C200, 4, 100, $0400
```

**Generierter Code (4 Bytes, +100 Punkte, Punktzahl bei `$C200`, Bildschirm bei
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

**Größe:** `3 + Ziffern×8` Bytes (SED + CLC + CLD Overhead + 8 Bytes pro
BCD-Byte für ADC + Anzeigeschleife).

**Syntax:**
```
.score_bcd $C200, 4, 100, $0400
```

> **Tipp:** Initialisieren Sie die Punktebytes beim Start auf `$00`. Die
> Punkteadresse sollte sich im Nullseitenbereich oder im absoluten RAM befinden
> – nicht im ROM. Die Bildschirmadresse sollte auf die erste Ziffernzelle
> zeigen; die Ziffern werden von links nach rechts geschrieben (das
> höchstwertige Byte zuerst).

> **BCD-Bereich:** `Ziffern=4` Bytes → 8 Dezimalstellen → Maximalwert
> 99.999.999. Jedes Byte kodiert zwei BCD-Ziffern: `$00`–`$99`.

---

## 7. KickAssembler-ähnliche Syntax

VMA liest auch die gängigen KickAssembler-Formate, sodass ein
KickAssembler-Quellcode oft unverändert kompiliert werden kann:

- `.pc = $1000` und `*=$1000 "name"` setzt die Adresse (der Segmentname wird
  ignoriert).
- `.const NAME = value` und `.label NAME = value` definieren Konstanten; `.label
  NAME = *`, `.label NAME = * + 1` platziert eine Marke an (oder in der Nähe
  von) der aktuellen Adresse.
- `.macro name(p1, p2) { … }` — ein Makrokörper in geschweiften Klammern,
  außerdem rufen `.macro … .endm`; `:name(args)` und `name(args)` es auf.
- `name: { … }` Bereiche: Die Labels darin sind lokal für `name` (`name.label`
  von außen).
- `@label`-Labels behalten ihre `@`.
- `.text "…"` ohne Bildschirmkoordinaten speichert die kodierten Bytes wie
  `.byte`. Mehrere Elemente können mit `,` oder `+` verknüpft werden: `"…"`,
  `@"…"` mit den Escape-Sequenzen `\n` `\r` `\t` `\$NN` und `$NN` /
  Dezimalbytes. `.encoding "name"` wählt die Kodierung der folgenden
  `.text`-Zeilen aus: `screencode_mixed` (Standard), `screencode_upper`,
  `petscii_mixed`, `petscii_upper`, `ascii`; ein Zeichen, für das die Kodierung
  keinen Code hat, ist ein Fehler.
- Mnemonische Suffixe `.abs` / `.a` und `.zp` / `.z` erzwingen absolute oder
  Nullseitenadressierung: `sta.abs $00FC,x`, `ldx.zp ptr,y`.
- `// …` Kommentare.

Der Rest der KickAssembler-Sprache (`.for`, `.var` / `.eval`, `.function`,
`.pseudocommand`, `#import`, `#if`, `LoadBinary`, Segmente …) wird vom
Kick-Präprozessor des C64 Visual Assembler verarbeitet, der einen
KickAssembler-Quellcodebaum in VMA-Text umwandelt.

## 8. Befehlszeile

Neu in Version 2.1.0: `--crt` / `--crt-name` (Cartridge) und `--d64` / `--add` /
`--disk-name` (Disk-Image).

```
vma build <input.asm> [options]
vma --help
vma --version
```

| Option               | Bedeutung                                                                                                                                                                                                                                      |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-o DATEI`           | Die zu schreibende PRG-Datei (Standard: die Eingabedatei mit der Erweiterung `.prg`)                                                                                                                                                           |
| `--base-dir DIR`     | Zuerst werden die Dateien `.incbin` / `.koala` / `.level` / `.sid` / `.include` durchsucht (Standard: der Ordner der Eingabedatei).                                                                                                            |
| `--Suche DIR`        | Ein weiterer Ordner, in dem nach dem Basisverzeichnis gesucht werden muss (wiederholbar in dieser Reihenfolge); ein auf einem anderen Rechner geschriebener Pfad wird auf seinen reinen Dateinamen zurückgeführt.                              |
| `--no-basic-stub`    | Keine `10 SYS…` BASIC-Zeile vor dem Code                                                                                                                                                                                                       |
| `--raw`              | Das Image allein bei seiner ersten ORG-Operation: kein Stub, keine Verschiebung nach `$C000`                                                                                                                                                   |
| `--crt FILE`         | Eine Magic Desk-Cartridge (CRT Typ 19, 8 × 8K Bänke, maximal 65.408 Bytes): Ein Loader kopiert das Programm an seine Ladeadresse und startet es an der SYS-Adresse – der Build-CRT des Visual Assemblers. Ohne `-o` wird kein PRG geschrieben. |
| `--crt-name NAME`    | Der Name der Kassette im CRT-Header (Standard: `VA CART`)                                                                                                                                                                                      |
| `--d64 [FILE]`       | Ein 1541-Disk-Image mit dem PRG, benannt nach dem PRG (Standarddatei: das PRG mit der Erweiterung `.d64`); kein c1541 erforderlich. Ohne `-o` wird kein PRG geschrieben.                                                                       |
| `--Datei hinzufügen` | Eine weitere Datei auf der Festplatte (eine PRG-Datei mit ihrer Ladeadresse), benannt nach der Datei (wiederholbar, der Reihe nach)                                                                                                            |
| `--disk-name NAME`   | Der Datenträgername (Standard: der Dateiname der D64; ID `01`)                                                                                                                                                                                 |
| `--sym FILE`         | KickAssembler-Labeldatei (`.label NAME=$xxxx`)                                                                                                                                                                                                 |
| `--vs FILE`          | VICE-Monitor-Labeldatei (`al C:xxxx .NAME`; `x64sc -moncommands FILE`)                                                                                                                                                                         |
| `--dbg FILE`         | RetroDebugger / C64 Debugger Quellcode-Map (XML)                                                                                                                                                                                               |
| `--debug`            | Alle drei neben dem PRG (`out.sym`, `out.vs`, `out.dbg`)                                                                                                                                                                                       |
| `--json DATEI`       | Der Build als JSON: PRG-, SYS-Adresse, Symbole, angeordnete Zeilen, geschriebene Segmente, Speicheransicht – oder jeder Fehler mit seiner Zeile                                                                                                |
| `--source-path NAME` | Die Hauptquelle sind die `.dbg`-Namen (Standard: die Eingabe)                                                                                                                                                                                  |
| `--line-map FILE`    | JSON-Array: Eingabezeile → die Zeile mit den `.dbg`-Namen                                                                                                                                                                                      |

Exit-Status: `0` erstellt, `1` Kompilierungsfehler (`FILE:LINE: Nachricht` auf
Standardfehler, eine Zeile pro Fehler), `2` Ungültige Verwendung.

```
vma build game.asm -o game.prg --debug
vma build game.asm --no-basic-stub --search ../assets
vma build game.asm --crt game.crt                    # the cartridge only
vma build game.asm --d64 --add music.prg             # game.d64 with GAME and MUSIC
```

## 9. Bekannte Einschränkungen

VMA bildet den C64 Visual Assembler-Compiler Byte für Byte nach, inklusive
seiner Unvollkommenheiten:

- `lda.zp c` → `LDA $0C`: bei `.zp` wird ein aus Hexadezimalziffern bestehendes
  Symbol als Zahl gelesen.
- Der Rumpf eines parameterlosen Makros wird ebenfalls dort assembliert, wo er
  definiert ist; eine Definition vor dem ersten `* =` landet am Anfang des
  Programms.
- `.text X, Y, "s", 80` analysiert den Zeichenoffset, verwendet ihn aber nicht.
- Die Bytes von `.chardef` sind hexadezimal (`129` = `$129`, ein Fehler).
- Der nicht unmittelbare Operand einer Laufzeitfunktion `.if` / `.while` /
  `.until` wird als Adresse gelesen: `%bin` ist ein Fehler und `10` ist
  hexadezimal (`$0010`).
- Die DELAY-Hilfsroutine wird nach der letzten Zeile des Layouts und jedem
  Datenabschnitt ausgeführt – sogar bei einem übersprungenen (`.if 0`) DELAY.

Behoben in Version 2.1 (vorherige Fehler führten zu falschem Code oder schlugen
fehl): ein `.const` / `.var`-Operand auf der Nullseite, `JMP (label)`, `lda
$1234+1`, ein Makroaufruf innerhalb eines Makros, ein nicht aufgelöster
TURBO_SET / SPRITE_ANIM-Wert (jetzt ein Fehler), Labels in den Bytes von `.data`
/ `.rawbytes`, ein `:name`-Label, dessen Ziel ein Label ist, die Größe von
JOYSTICK / MEMCPY / MEMSET von einem späteren Label (jetzt ein Fehler), der
automatische Puffer von `.data` / `.rawbytes` und die Includes (ein fehlendes
Include ist ein Fehler, die eigenen `.include` / `.incbin` / `.sid` einer
eingebundenen Datei werden geladen).
