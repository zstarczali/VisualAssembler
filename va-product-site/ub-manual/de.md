# Ultimate Basic v1.6.6 — Sprachhandbuch

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
var x = 10 # 8-Bit-Integer (Standard)
var ptr: word = $0400 # 16-Bit – zwei Nullseitenbytes, verwendbar als 16-Bit-Adresse
var f: float = 3.5 # Q8.8 Festkomma – hohes Byte = Integer, niedriges Byte = Bruchteil
var msg = "HELLO" # Stringvariable (Zeiger auf inline PETSCII-Daten)
var s: string = "TEXT" # String mit explizitem Typ
var scores = array(10) # Byte-Array, 10 Elemente gespeichert ab $C000+
var moments = array_word(8) # Wort-Array, 8 Wortelemente gespeichert ab $C000+
const BORDER_ADDR = $D020 # Kompilierzeitkonstante (inline ersetzt, kein ZP-Slot)
```

Bei Schlüsselwörtern und Kennungen wird **nicht zwischen Groß- und
Kleinschreibung unterschieden**: `PRINT`, `Print` und `print` sind alle gültig.

| Typ                   | Breite        | Anmerkungen                                                                               |
| --------------------- | ------------- | ----------------------------------------------------------------------------------------- |
| `int`                 | 8-Bit         | Standardwert für numerische Literale                                                      |
| `word`                | 16-Bit        | zwei ZP-Bytes; kann als Adresse in `poke`/`peek` verwendet werden                         |
| `float`               | 16-Bit Q8.8   | hi-Byte = ganzzahliger Anteil (0–255), lo-Byte = Bruchteil                                |
| `Single` / `Double`   | 5 Bytes, RAM  | Gleitkommazahl (C64 BASIC-Format, ~9 Stellen) — `dim x as double`; siehe *Gleitkommazahl* |
| `string`              | Zeiger        | ZP-Paar → nullterminiertes PETSCII im Codesegment                                         |
| `array(N)`            | N Bytes       | Byte-Elemente; befindet sich unter `$C000+`, nicht in ZP                                  |
| `array_word(N)`       | N×2 Bytes     | Wortelemente (16 Bit); befindet sich unter `$C000+`, nicht in ZP                          |
| `array(R, C, …)`      | ∏dims Bytes   | mehrdimensional (zeilenweise); Index `arr[r, c]`                                          |
| `array_word(R, C, …)` | ∏dims×2 Bytes | mehrdimensionales Wortarray (zeilenweise)                                                 |

#### Deklarationen im BASIC-Stil: `dim … as …`

`dim name as type` ist eine alternative Schreibweise von `var name: type` —
gleicher Speicher, gleicher Code:

```basic
DIM kor AS INTEGER # vorzeichenbehaftete 16-Bit-Gleitkommazahl, beginnt bei 0
DIM nev AS STRING # Zeichenkette, beginnt mit ""
DIM fizetes AS DOUBLE # Gleitkommazahl, beginnt bei 0
DIM x, y AS BYTE # mehrere Namen, alle erhalten den Typ
DIM pont AS INTEGER = 1000, cim AS STRING = "C64" # Initialisierer, gemischte Datentypen
```

| `as …`             | Ultimativer Basistyp                                                                |
| ------------------ | ----------------------------------------------------------------------------------- |
| `byte`, `int`      | `int` (8-Bit, 0–255)                                                                |
| `integer`          | Vorzeichenbehafteter 16-Bit-Wert (−32768 … 32767) — QBasic INTEGER                  |
| `word`             | `word` (unsigned 16-bit, 0–65535)                                                   |
| `Single`, `Double` | Gleitkomma, 5 Bytes im RAM (±2,9·10⁻³⁹ … 1,7·10³⁸, ~9 Stellen) — siehe *Gleitkomma* |
| `float`            | `float` (Q8.8 Festkomma — 0–255.99, schnell)                                        |
| `string`           | `string`                                                                            |

- Ohne `= Wert` beginnen die Zahlen bei 0 und die Zeichenketten bei `""`.
- `dim a, b as integer` gibt **both** den Typ an (VB.NET-Stil, nicht QBasic).
  Nur ein einziger Name darf einen Initialisierer haben.
- `as` und die BASIC-Typnamen sind Kontextwörter, nicht reserviert – sie können
  weiterhin als Namen verwendet werden.
- Nicht unterstützt: `as long`, struct types (use `var name: TName = array(N)`)
  — Kompilierfehler.
- Bei `--explicit` ist ein `dim` ohne `as` ein Fehler.
- Die Zuweisung von Zeichenketten hat Wertsemantik: `s = "TEXT"` zeigt auf das
  Literal, `t = s` und berechnete Werte werden in den eigenen Puffer von `t`
  kopiert (siehe `Strings at runtime`). Vor Version 1.6.3 speicherte `s =
  "TEXT"` nach der Deklaration ein undefiniertes Byte im Zeiger.

#### Arrays mit `dim`: `dim name(u1, u2, …) as type`

```basic
DIM tabla(2, 3) AS INTEGER ' 3 × 4 Elemente: tabla(0..2, 0..3)
DIM kocka(1, 2, 3) AS BYTE ' Beliebige Anzahl an Dimensionen
DIM ar(9) AS DOUBLE ' 10 Gleitkommawerte (je 5 Bytes)
DIM nevek(4) AS STRING ' 5 Zeichenketten, alle beginnen mit ""
DIM v(9) ' kein AS → Byte-Array

tabla(2, 3) = 999 ' QBasic-Index mit ( )
tabla[2, 3] = 999 ' … oder die üblichen [ ]
nevek(0) = "ZSOLT"
PRINT tabla(2, 3); " "; nevek(0); " "; ar(1)
```

- Jede Grenze ist der **höchste Index** (Grundregel): `dim t(2, 3)` hat 3 × 4
  Elemente. (`var t = array(3, 4)` nimmt Elementanzahlen entgegen – dasselbe
  Array.)
- Elementtypen: `byte`/`int` → 1 Byte, `integer` (signed) / `word` → 2 Byte,
  `float` → 2-Byte-Gleitkommazahl (Q8.8), `single`/`double` →
  5-Byte-Gleitkommazahl, `string` → 2-Byte-Zeiger. Die Grenzen müssen
  Kompilierzeitkonstanten sein. Arrays befinden sich in `$C000-$CFFF` (4 KB);
  Wenn mehr Speicher benötigt wird, wird der gesamte Array-Bereich nach
  `$A000-$CFFF` (12 KB, unterhalb des BASIC-ROMs – siehe *Array-Speicher*)
  verschoben. Mehr als 12288 Bytes führen zu einem Kompilierfehler.
- String-Array-Elemente beginnen als `""`; `nevek(i) = "TEXT"` / `= s` / `= a +
  b`, `n = nevek(i)`, Ausgabe, `+`, Übergabe an einen `string` Parameter und
  `input nevek(i)` funktionieren alle (nicht-literale Werte werden in einen
  31-Zeichen-Slot pro Element kopiert).
- Die Indizierung mit `name(i)` funktioniert auch für Arrays, die mit `var a =
  array(…)` deklariert wurden.
- Ein Array pro `dim`-Gruppe: `dim a(3) as byte, n as integer` ist korrekt, `dim
  n, a(3) as integer` ist ein Fehler. Kein Initialisierer – verwenden Sie `data
  name: …`.

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

**Musik** `tune` (Schlüsselwortblock; die Zeilen darin - `speed`, `inst`,
`order`, `pat` - sind nicht reserviert)

**Typen & typbezogene Daten** `int`, `word`, `float`, `string`, `array`,
`array_word`

**Print & I/O** `print`, `spc`, `tab`, `at`, `input`, `chr$`, `str$`, `hex`,
`bin`, `open`, `close`, `load`, `save`, `chain`, `data`, `read`, `include`,
`incbin` (auch `dec` — oben als Dekrement-Anweisung aufgeführt; dasselbe Token
wird für das Druckformat `dec(n, width)` verwendet)

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
`sprhit`, `sprbghit`, `box_hit`, `chardef`, `charset`, `org`, `expand`,
`priority`

**Ton & Musik** `sid`, `sound`, `sfx`, `volume`, `music`, `play`, `pause`,
`resume`, `stop`

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

| Reserviert                                                 | Vorschlag zur Umbenennung           |
| ---------------------------------------------------------- | ----------------------------------- |
| `end`                                                      | `stop_at`, `finish`, `last`         |
| `stop`                                                     | `stop_at`, `halt`                   |
| `mal`                                                      | `Anzahl`, `n`, `Iter`               |
| `Bildschirm`                                               | `scraddr`, `screen_addr`            |
| `border`, `bg`, `text`                                     | `border_addr`, `bg_col`, `text_col` |
| `Klemme`                                                   | `cap`, `bound`                      |
| `Linie`, `Kreis`, `Rechteck`                               | `ln`, `circ`, `box_r`               |
| `data`, `read`                                             | `bytes`, `next_byte`                |
| `laden`, `speichern`, `öffnen`, `schließen`                | `load_file`, ...                    |
| `map`, `show`, `hide`                                      | `tilemap`, `reveal`, `conceal`      |
| `Wiedergabe`, `Pause`, `Fortsetzen`, `Stopp`, `Lautstärke` | `play_song`, `vol`                  |
| `int`, `float`, `word`, `string`                           | `n_int`, `speed_f`, `addr`, `msg`   |

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
z = x und 15 # bitweises UND
w = a oder b # bitweises ODER
v = a xor b # bitweises XOR
m = x shl 3 # Linksverschiebung
n = x shr 2 # Rechtsverschiebung (Arithmetik für eine ganze Zahl: -8 shr 1 = -4)
r = x mod 40 # Rest; x mod 0 = x, x / 0 = 255
b = bnot x # bitweises NICHT: x XOR 255 (Komplement aller 8 Bits)
```

Vergleiche: `==` `!=` `<` `>` `<=` `>=` (Rückgabewert 1/0)

Arithmetischer Code (1.6.0): `*` multipliziert mit einer Konstanten wird zu
Schiebeoperationen/Schiebe-Addition kompiliert (`x * 8` → 3× `ASL`), andernfalls
zu einer Schiebe-Additionsschleife mit maximal 8 Durchläufen. `/` und `mod`
multipliziert mit einer Zweierpotenz ergeben `LSR` / `AND #(n-1)`, andernfalls
zu einer Schiebe-Subtraktionsschleife mit 8 Durchläufen, deren Laufzeit nicht
mehr vom Quotienten abhängt. Die Division durch Null ist definiert: `x / 0 =
255`, `x mod 0 = x` (vor Version 1.6.0 gab es einen Fehler).

Der Operator `mod` mit einem Operanden vom Typ `word` oder `integer` (oder einer
negativen Konstante) liefert einen 16-Bit-Rest mit dem Vorzeichen des
Dividenden, wie in QBasic: `-7 mod 3` = -1, `7 mod -3` = 1, `(w + 5) mod 7`
behält 16 Bit bei. Mit einem SINGLE- oder DOUBLE-Operanden funktioniert dies im
Gleitkommamodus (siehe *Gleitkomma*). Die Division `/` mit einem `word` /
`integer` oder einem negativen Divisor ist eine 16-Bit-Division, die auf Null
abgeschnitten wird (`-700 / 300` = -2, `-700 / -7` = 100). Die arithmetische
Verschiebung `shr` eines `integer` ist eine arithmetische Verschiebung (das
Vorzeichen bleibt erhalten: `-8 shr 1` = -4); `word` und Byte-Werte werden
logisch verschoben. `x = x + 1` / `x = x - 1` (und ±2) kompilieren zu `INC` /
`DEC`.

### Inkrementieren / Verringern

```basic
inc x # x = x + 1 (INC zp — Einzelbefehl)
dec x # x = x - 1 (DEC zp — Einzelbefehl)
```

Für `word`-Variablen wird der Übertrag wie folgt behandelt: `inc` verwendet `INC
lo; BNE skip; INC hi`; `dec` verwendet `LDA lo; BNE skip; DEC hi; DEC lo`.

### Verbindungszuordnungen

```basic
x += 5 # x = x + 5
x -= 3 # x = x - 3
x *= 2 # x = x * 2
x /= 4 # x = x / 4
x and= 15 # x = x and 15 (bitweises UND)
x or= 64 # x = x or 64 (bitweises ODER)
x xor= 255 # x = x xor 255 (bitweises XOR)
x shl= 2 # x = x shl 2
x shr= 1 # x = x shr 1
```

### Drucken

```basic
print "HELLO"
print x
print x, y, "text"
print # Leerzeile

print spc(5) # 5 Leerzeichen ausgeben
print tab(20), "VALUE" # Cursor in Spalte 20 setzen, dann ausgeben
print "A", spc(3), "B" # frei mischen

print "A=" + a # Zeichenkette + numerische Variable
print s1 + s2 # zwei Zeichenketten → sequentielle Ausgabe
print "Hello " + "World" # zwei Literale → Kompilierzeitfaltung
print chr$(13) # Ausgabe mit PETSCII-Code
```

Standardmäßig werden Zahlen ohne zusätzliche Leerzeichen ausgegeben, und `,`
trennt lediglich die Elemente (`print 1, 2` ergibt `12`). Für C64 BASIC-Abstände
kompilieren Sie mit `--basic-print` oder fügen Sie eine Zeile `option basic
print` in das Programm ein: Eine Zahl wird dann mit einem führenden Leerzeichen
(oder seinem `-`) und einem nachfolgenden Leerzeichen ausgegeben (`print 5` →
` 5 `), ein `,` springt in die nächste 10-spaltige Druckzone, und ein
nachfolgendes `,` hält den Cursor in der Zeile wie ein nachfolgendes `;`. `STR$`
gibt dann ebenfalls den C64-Text aus (`STR$(7)` = `" 7"`, `STR$(-42)` =
`"-42"`). Die Zeichenketten `spc`, `tab`, `hex`, `bin`, `dec` und `chr$` werden
wie zuvor ausgegeben.

#### `DRUCKEN MIT `

```basic
DIM ar AS DOUBLE = 1234.5
DIM s AS STRING = "ALMA"
PRINT USING "###.##"; 3.14159 ' 3.14
PRINT USING "Ar: #,###.## Ft"; ar ' Ar: 1,234.50 Ft
PRINT USING "+##"; 7 ' +7
PRINT USING "##.##-"; -2.25 ' 2.25-
PRINT USING "##"; 123 ' %123
PRINT USING "[&amp;] [!] [\ \]"; s; s; s ' [ALMA] [A] [ALMA]
PRINT USING "##"; 1, 2, 3 ' 1 2 3
```

| Feld                  | Bedeutung                                                                                                                              |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `#`                   | eine Ziffernposition; die Zahlen sind rechtsbündig und auf die Dezimalstellen gerundet.                                                |
| `.`                   | Dezimalpunkt; die nachfolgenden `#`s sind die Dezimalstellen (maximal 9).                                                              |
| `,`                   | vor dem Punkt: Tausendertrennzeichen (jeweils `,` ist eine Position)                                                                   |
| `+` am Anfang         | immer das Zeichen ausgeben (`+` / `-`)                                                                                                 |
| `-` am Ende           | Setzen Sie das Minuszeichen nach der Zahl (bei positiven Zahlen ein Leerzeichen).                                                      |
| `&amp;` / `!` / `\ \` | Zeichenkette: die gesamte Zeichenkette / ihr erstes Zeichen / genau so viele Zeichen, wie das Feld breit ist (`\` + Leerzeichen + `\`) |
| `_`                   | Gib das nächste Zeichen unverändert aus (`_#`)                                                                                         |

Eine Zahl, die nicht ins Feld passt, wird mit vorangestelltem `%` ausgegeben
(`%123`); eine führende Null wird entfernt (`#.##` mit -0.5 → `-.50`). Alle
anderen Zeichen werden unverändert ausgegeben. Die Werte durchlaufen die Felder
(das Format beginnt von neuem, sobald die Werte erschöpft sind); nach dem
letzten Wert wird der Text bis zum nächsten Feld ausgegeben. Ein nachfolgendes
`;` oder `,` hält den Cursor in der Zeile. Das Format muss ein Stringliteral
sein; die Felder `**`, `$$` und `^^^^` werden nicht unterstützt. Ein Programm
mit `PRINT USING` bindet die Gleitkomma-Laufzeitumgebung ein (nur die Teile, die
sie benötigt).

### chr$

```basic
print chr$(65) # Zeichen mit PETSCII-Code 65 ('A') ausgeben
var c = chr$(n) # Byte-Wert n in Variable c speichern
print "&gt;" + chr$(42) # für Stringverkettung verwendbar
```

### Verzweigung

```basic
Wenn x == 1, dann
gib "JA" aus
sonst
gib "NEIN" aus
end
```

### Auswählen / Groß-/Kleinschreibung

```basic
Wähle x
Fall 1:
Gib "EINS" aus
Fall 2:
Gib "ZWEI" aus
Sonst:
Gib "ANDERES" aus
Ende
```

`select expr` wertet den Ausdruck einmal aus und vergleicht ihn der Reihe nach
mit jedem `case`-Wert. Der erste passende Fallblock wird ausgeführt, und die
Programmausführung springt zu `end`. Der optionale `else:`-Block wird
ausgeführt, falls kein passender Fall gefunden wird. Alle Werte müssen 8-Bit
(0–255) sein.

### Schleifen

```basic
Schleife 5 # Zählschleife (5 Iterationen)
print "HI"
end

times 5 # Alias für Schleife N ... end
print "HI"
end

Schleife # Endlosschleife
x = x + 1
if x == 5 then continue end # zur nächsten Iteration springen
if x == 100 then break end
end

var i = 0
for i = 1 to 10 # for..next (bevorzugt)
if i == 5 then continue end # zum nächsten Inkrement springen
print i
next

for i = 0 to 20 step 2
print i
next i # Variablenname nach 'next' ist optional

for i = 10 to 1 step -1 # Herunterzählen – negative konstante Schrittweite wird unterstützt
print i
next

for i = 20 to 0 step -2 # Beendet korrekt bei i = 0 (11 Iterationen)
print i
next i

var i = 0
loop i = 1 bis 10 # Legacy-Schleifensyntax – identischer Code
print i
end

while x &lt; 100
x = x + 1
end

repeat # do-while: Der Schleifenkörper wird mindestens einmal ausgeführt
x = x + 1
until x == 100 # Beendet, wenn die Bedingung wahr ist
```

**Richtungsregeln für `for`/`loop`:**

| Fall                                                      | Verhalten                                                                                                            |
| --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `for i = 1 to 10` (Standardwert `step +1`, `from ≤ to`)   | zählt hoch, Standard                                                                                                 |
| `for i = 0 to 20 step 2` (positiver Schritt, `from ≤ to`) | Zählt um 2 erhöht                                                                                                    |
| `for i = 10 to 1 step -1` (negativer konstanter Schritt)  | zählt herunter; Körper läuft für i = 10, 9, ..., 1                                                                   |
| `for i = 20 to 0 step -2` (bis auf Null herunter)         | Die Schleife endet bei i = 0, indem der Überlauf unter 0 nach der Dekrementierung erkannt wird; keine Endlosschleife |
| `for i = 10 to 1` (kein Schritt, `from > to`)             | **Kompilierfehler**: `for-loop: from (10) > to (1) with default step +1 loops 0 times — use 'step -1' to count down` |

Codestruktur (1.6.0): Die Schleife ist *rotated* — `JMP test` (wird weggelassen,
wenn konstante Grenzen einen ersten Durchlauf garantieren), der Rumpf, `var +=
step`, dann der Test am Ende, der zurück zum Rumpf verzweigt, sodass kein
zusätzliches `JMP` pro Iteration erfolgt. Der Schritt erkennt einen
8-Bit-Überlauf in beide Richtungen (`INC`/`BEQ` oder `ADC`/`BCS` beim
Aufwärtszählen, `BEQ`/`DEC` oder `SBC`/`BCC` beim Abwärtszählen), sodass `for i
= 0 to 255` 256 Mal ausgeführt wird und stoppt, und `for i = N to 0 step -k`
immer endlich ist. Konstante Grenzwerte und Schritte werden als unmittelbare
Werte verwendet (keine Nullseite); Ein nicht konstanter Grenzwert oder Schritt
wird einmal ausgewertet und auf der permanenten Nullseite gespeichert.

Nicht-konstante `step` Werte (z. B. aus einer Variablen oder einem Ausdruck)
werden zur Kompilierzeit als positiv behandelt; wenn Sie einen Countdown mit
einem Laufzeitschrittwert benötigen, teilen Sie die Schleife auf oder verwenden
Sie eine `while` Konstruktion.

### Labels und gehe zu

```basic
Label Hauptschleife

x = x + 1

Wenn x &lt; 10, dann gehe zu Hauptschleife Ende
```

Forward `goto` (Label wird später definiert) wird vollständig unterstützt.

`gosub label` / `return` springen zu einer Marke und kehren zurück (JSR/RTS auf
Maschinencode-Ebene). Die Marke muss eine `label name` Anweisung sein, keine
`sub` – sie hat keine Parameter und teilt denselben Gültigkeitsbereich (Seite
null). `gosub` unterstützt Vorwärtsreferenzen (Marke definiert nach `gosub`).

```basic
gosub draw_border

... label draw_border
# ... etwas zeichnen ...
return # RTS — kehrt zur Anweisung nach gosub zurück
```

### Unterprogramme

```basic
sub greet()
print "HALLO!"
end

sub set_color(col)
color border col
color text col
end

greet() # Aufruf mit Klammern
call greet # Aufruf des Schlüsselworts (ohne Klammern)
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
if val &lt; lo then return lo end
if val &gt; hi then return hi end
return val
end

var s = square(9) # s = 81 — Funktionsaufruf als Ausdruck
var c = clamp(joy, 0, 39) # c = geklemmter Wert
print add(10, 20) # 30 — inline verwendbar in print
```

Funktionen unterstützen optional den Rückgabetyp `: word` für 16-Bit-Werte:

```basic
fn get_addr(): Wort
return $C000
end

var ptr: Wort = get_addr() # ptr = $C000
poke ptr, 42 # STA (ptr),Y — gültige indirekte Adressierung
var v = peek(ptr) # LDA (ptr),Y
```

`fn` wird im zweiten Durchlauf ausgegeben (genau wie `sub`), daher werden
Funktionsrümpfe beim Start nie ausgeführt. Vorwärtsreferenzen werden vollständig
unterstützt.


#### QBasic-Stil `FUNCTION` / `SUB`

```basic
FUNCTION Negyzet (szam AS INTEGER) AS INTEGER
    Negyzet = szam * szam ' Rückgabewert = dem Funktionsnamen zuweisen
ENDFUNKTION

FUNKTION Nagyobb (a ALS BYTE, b ALS BYTE) ALS BYTE
    Nagyobb = a
    WENN b &gt; a DANN
        Nagyobb = b
        EXIT FUNCTION ' kehrt jetzt mit dem bisher zugewiesenen Wert zurück
    ENDE WENN
ENDFUNKTION

SUB Koszont (nev AS STRING)
    DRUCK „Üdvözöllek,“; nev; „!“
ENDE SUB

n = Negyzet(30)
Koszont „Zsolt“‘-Aufruf ohne Klammern
Koszont("Zsolt") ' ... oder mit ihnen
RUFEN Sie Koszont("Zsolt") an
```

- `function` ist ein Synonym für `fn`; `p AS type` funktioniert in
  Parameterlisten und `AS type` nach `)` gibt den Rückgabetyp an (gleiche
  Typnamen wie `dim`). `: type` funktioniert weiterhin.
- Die Zuweisung an den Funktionsnamen speichert in einer versteckten Variable
  `<name>__result`, die bei `END FUNCTION` / `EXIT FUNCTION` zurückgegeben wird;
  `return expr` funktioniert auch weiterhin.
- `END SUB`, `END FUNCTION`, `END IF`, `END SELECT` werden akzeptiert (das
  zweite Wort ist optional); `EXIT SUB` / `EXIT FUNCTION` gibt zurück (ein
  einfaches `exit` ist immer noch `bye`).
- In einer mit `END SUB` / `END FUNCTION` abgeschlossenen
  SUB-/FUNCTION-Anweisung beendet ein einzelnes `END` in seiner Zeile das
  Programm, wie in QBasic – auch innerhalb einer `IF … END IF`. Die Blöcke einer
  solchen Routine werden im QBasic-Stil geschlossen (`END IF`, `END SELECT`,
  `WEND`, `LOOP`, `NEXT`). Eine mit einem einfachen `end` abgeschlossene Routine
  behält die alten Blockregeln bei. `END` und `bye` verlassen innerhalb einer
  beliebigen Routine das Programm (zuvor kehrten sie zum Aufrufer der Routine
  zurück).
- Ein sub/fn kann ohne Klammern aufgerufen werden: `Koszont „Zsolt“`, `Rajzol x,
  y`.
- `PRINT a; b; c` — `;` verbindet Elemente ohne Leerzeichen; ein nachfolgendes
  `;` unterdrückt den Zeilenumbruch. Ein `;` gefolgt von einer Anweisung (`print
  x; y = 1`) trennt weiterhin Anweisungen.
- Akzentuierte Buchstaben in Zeichenkettenliteralen werden als ihr
  Basisbuchstabe ausgegeben (`ü` → `u`, `ő` → `o`); der C64-Zeichensatz kennt
  keine Akzente.
- Word/float-Parameter empfangen jetzt beide Bytes, und ein Stringliteral, das
  an einen `string`-Parameter übergeben wird, funktioniert (vorher funktionierte
  nur das lo-Byte / eine Stringvariable).
- Keine Rekursion (Parameter befinden sich in statischen Nullseiten-Slots); seit
  Version 1.6.3 führt ein rekursiver Aufruf zu einem Kompilierfehler anstatt zu
  stillschweigend falschen Ergebnissen.

#### Weitere QBasic-Syntax (1.6.3)

Die unten stehenden QBasic-Formen lassen sich neben der ursprünglichen Syntax
kompilieren (die Kommentare `==`, `end`, `loop`, `#` funktionieren alle
weiterhin).

```basic
' Kommentar (QBasic-Stil, wie #)
WENN x = 3 DANN AUSGABE "drei" ' Einzeilige WENN-Anweisung: kein ENDE WENN erforderlich
WENN x &lt;&gt; 3 DANN AUSGABE "nein" SONST AUSGABE "ja"
WENN n &lt; 0 DANN
AUSGABE "negativ"
SONSTWENN n = 0 DANN
AUSGABE "null"
SONST
AUSGABE "positiv"
ENDE WENN

WÄHLEN SIE, SOLANGE i &lt; 10 : i = i + 1 : SCHLEIFE ' auch AUSGABE BIS c … SCHLEIFE,
WÄHLEN SIE : i = i - 1 : SCHLEIFE BIS i = 0 ' AUSGABE … SCHLEIFE SOLANGE c, AUSGABE … SCHLEIFE (endlos)
WÄHLEN SIE, SOLANGE k &lt;&gt; 5 : k = k + 1 : ENDE
FÜR i = 1 BIS 100
WENN i = 12 DANN BEENDEN SIE FÜR ' BEENDEN SIE AUSGABE / BEENDEN SIE FÜR / BEENDEN SIE SOLANGE
NÄCHSTES

AUSWÄHLEN FALL n
FALL 1, 2, 3: AUSGABE "klein"
FALL 10 BIS 20: AUSGABE "Teenager"
FALL IST &gt; 1000: AUSGABE "groß"
SONSTIGER FALL: AUSGABE "andere"
ENDE AUSWAHL

ENDE ' Programm beendet (Bildschirm bleibt geöffnet)
```

- **Bedingungen: ** innerhalb von `IF` / `ELSEIF` / `WHILE` / `UNTIL` / `LOOP
  WHILE|UNTIL`, ein einzelner Vergleich `=`. `&lt;&gt;` bedeutet, dass nicht
  überall gleich (dasselbe wie `!=`).
- **Einzeilige IF-Anweisung:** Eine Anweisung direkt nach `THEN` erzeugt eine
  einzeilige IF-Anweisung, die mit der Zeile oder mit einem `end` in derselben
  Zeile endet (`if c then x = 1 end`, wie zuvor). Eine mehrzeilige IF-Anweisung
  benötigt einen Zeilenumbruch nach `THEN`. Wie in QBasic gehört alles nach
  `THEN` in dieser Zeile zur IF-Anweisung (`… THEN EXIT FOR : NEXT` würde `NEXT`
  überschreiben).
- **`END` allein:** Ein `END`, das keinen Block schließt, beendet das Programm
  wie QBasic. Ein überflüssiges `end` wird daher nicht mehr als Fehler
  angezeigt.
- **`DO` Blöcke:** innerhalb eines `DO`, ein `LOOP` am Ende einer Zeile schließt
  diese (die ursprünglichen `loop N … end` / `loop i = … end` Schleifen
  funktionieren darin weiterhin).
- Die alte Form `select x` / `case n:` bleibt unverändert. `SELECT CASE` wird zu
  einer IF-Kette über eine versteckte Variable `select__N` herabgestuft.

#### Strings zur Laufzeit (1.6.3)

```basic
DIM s AS STRING, t AS STRING

s = "Punkt: " + pont + "!" ' Zahlen werden zu Text (16-Bit, vorzeichenbehaftet für INTEGER)
t = s ' eine Kopie: Eine spätere Änderung von s ändert t nicht
s = s + "?"

PRINT LEFT$(s, 4); RIGHT$(s, 2); MID$(s, 7, 3); MID$(s, 7)
PRINT LEN(s + t), VAL("1234") + 1, STR$(pont)
IF s = "ABC" OR t &lt;&gt; "" THEN PRINT "Vergleiche mit = / &lt;&gt;"
```

- **Buffers:** Eine Stringvariable, die einen berechneten Wert erhält (`+`,
  `left$`, `right$`, `mid$`, Zahlen, eine weitere Variable), besitzt einen 80
  Zeichen langen Puffer; längere Ergebnisse werden auf 80 Zeichen gekürzt. Die
  Zuweisung eines Literals verweist weiterhin lediglich auf diesen Puffer.
- **String-Arrays:** Elemente, die einen nicht-literalen Wert erhalten (oder
  `input`), erhalten ihren eigenen 32-Byte-Slot (31 Zeichen), sodass `input
  nevek(i)` in einer Schleife jeden Namen beibehält.
- Längere Zeichenketten: ** Eine Zeile ** Option strings 255 ` ermöglicht es
  jeder berechneten Zeichenkettenvariable, bis zu 255 Zeichen zu speichern (das
  Limit von C64 BASIC); ` Option strings 200, 63 ` gibt außerdem
  Zeichenketten-Array-Elementen 63 Zeichen (der Speicherplatz wird auf 32, 64,
  128 oder 256 Byte aufgerundet). Jede Variable verwendet einen eigenen Puffer,
  daher benötigen längere Zeichenketten RAM: n + 1 Byte pro
  Zeichenkettenvariable und Speicherplatzgröße × Elemente pro
  Zeichenketten-Array.
- **`STR$` / `VAL`:** `STR$` eines 16-Bit- oder vorzeichenbehafteten Werts hat
  keine führenden Nullen (`"-42"`). Aus Kompatibilitätsgründen behält `STR$`
  eines Bytes die dreistellige Form (`"007"`), es sei denn, die
  C64-BASIC-Abstände sind aktiviert (`--basic-print`: `" 7"`). `VAL` liest
  16-Bit-Zahlen mit Vorzeichen (`VAL("1234") + 1` = 1235).
- **Vergleich:** `=` / `&lt;&gt;` (und `==` / `!=`), und `&lt;` `&gt;` `&lt;=`
  `&gt;=` in PETSCII-Reihenfolge wie C64 BASIC; eine Zeichenkette kommt vor
  jeder längeren Zeichenkette, die sie beginnt (`"AB" &lt; "ABC"`, `"" &lt;
  "A"`).

#### Signed INTEGER, INPUT, DOUBLE (1.6.3)

- **INTEGER ist vorzeichenbehaftet:** `DIM x AS INTEGER` ist vorzeichenbehaftet
  16-Bit (−32768 … 32767, wie QBasic): Drucken, `&lt;` `&gt;` Vergleiche, `/`
  (abschneiden in Richtung Null), `ABS`, Textkonvertierung, `INPUT` und `FOR`
  Schleifen durch Null (`FOR i = 3 TO -3 STEP -2`) folgen alle dem Vorzeichen.
  `WORD` bleibt vorzeichenlos 0 … 65535. Unäres Minus funktioniert überall (`a
  &lt; -10`, `x * -2`).
- Die Schleife **`FOR` mit einem 16-Bit-Zähler** (`INTEGER` / `WORD`) ist eine
  echte 16-Bit-Schleife. Früher wurde sie bei 256 durchlaufen, daher wurde `FOR
  k = 0 TO 300` 45 Mal ausgeführt.
- **`INPUT`:** liest bis zu 6 Zeichen in ein INTEGER-/WORD-Array ein (mit `-`
  für INTEGER), in ein DOUBLE-Array akzeptiert es `12.5` (zwei Dezimalstellen).
  `INPUT t(i)` liest in ein Array-Element ein, und `INPUT "prompt"; x`
  funktioniert ebenfalls.
- **DOUBLE ÷ DOUBLE** ist jetzt exakt (`7,5 / 2,5 = 3,00`); vorher wurde nur der
  ganzzahlige Anteil des Divisors verwendet. DOUBLE × DOUBLE wurde bereits
  unterstützt.
- **Arrays over 256 bytes** (`DIM t(200) AS INTEGER`, `DIM g(19, 19)`) work with
  variable indices; the index used to wrap at 256 and write into the wrong
  element.
- **Rekursion** (eine Unterfunktion, die sich selbst aufruft, direkt oder
  indirekt) ist ein Kompilierfehler. Früher führte dies zu falschen Ergebnissen,
  da die Parameter in festen Nullseiten-Speicherplätzen abgelegt wurden.

### Arrays

```basic
var scores = array(8) # 8 Bytes ab $C000

# (Alle Arrays werden beim Programmstart einmalig mit Nullen aufgefüllt – neu in Version 1.5.7)

scores[0] = 100 # Konstanter Index → STA $C000
scores[i] = 99 # Variabler Index → STA (ptr),Y
var v = scores[i] # LDA (ptr),Y
print scores[2] # Inline-Ausgabe möglich

var moments = array_word(8) # 16 Bytes (8×2) ab $C000+

moments[0] = $1234 # Konstanter Index → STA $C000 (lo), STA $C001 (hi)
moments[i] = $5678 # Variabler Index → ASL A für Schrittweite; (ptr),Y × 2
var t: word = moments[1] # LDA $C002, LDA $C003
```

**Mehrdimensionale Arrays** (neu in Version 1.5.3)

**Arrays können mehrdimensional sein. Sie werden zeilenweise gespeichert und mit
einer durch Kommas getrennten Indexliste indiziert. Die Gesamtgröße entspricht
dem Produkt aller Dimensionen.**

```basic
var grid = array(8, 8) # 8×8 = 64 Bytes an Adresse $C000
grid[1, 0] = 11 # Zeile 1, Spalte 0 → flacher Index 1*8+0 = 8 → STA $C008
grid[0, 1] = 22 # Zeile 0, Spalte 1 → flacher Index 1 → STA $C001
grid[r, c] = 33 # Variable → berechnet r*8 + c, dann STA (ptr),Y
var v = grid[r, c] # LDA (ptr),Y

var wm = array_word(4, 4) # 4×4 Wortarray = 32 Bytes
wm[1, 2] = $ABCD # Element 1*4+2 = 6 → Bytes $C00C/$C00D

const ROWS = 3
const COLS = 5
var m = array(ROWS, COLS) # Dimensionen können Kompilierzeitkonstanten sein
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
Typ TEntity
var x: int # 1 Byte
var y: int # 1 Byte
var hp: word # 2 Bytes → Elementgröße = 4
endtype

const N = 8
var enemies: TEntity = array(N) # allokiert N × 4 = 32 Bytes an $C000

enemies[0].x = 5
enemies[0].y = 10
enemies[0].hp = $0100
var v = enemies[0].hp # zurückgelesen — LDA $C002 / LDA $C003

var i: int = 2
enemies[i].x = 42 # Variablenindex → idx * elem_size + Offset

# Gleitkommafeld (Q8.8 Festkomma)
type TBall
var bx: int # 1 Byte
var by: int # 1 byte
var vel: float # 2 Bytes Q8.8 → Elementgröße = 4
endtype

var balls: TBall = array(3)
balls[0].vel = 1.5 # speichert Q8.8: hi=1, lo=128
var f: float = balls[0].vel # liest float-Feld in float-Variable ein
print balls[0].vel # gibt "1.50" aus
```

**Standardwerte, Zeichenketten, verschachtelte Typen, Parameter** (nach 1.6.6):

```basic
TYPE TPoint ' QBasic-Form: TYPE … END TYPE, "name AS type"
x AS BYTE = 3 ' Standardwert
y AS WORD = 1000
END TYPE

type TEntity

var pos: TPoint # Verschachtelte Struktur: Felder pos.x, pos.y

var hp: word = 100

var name: string * 6 = "NOBODY" # Zeichenkette fester Länge innerhalb des Elements (7 Bytes)
endtype

var e: TEntity = array(100) # Jedes Element beginnt mit den Standardwerten
e[5].pos.x = 7
e[5].name = "ZS" + "OLT" # Berechneter Text wird kopiert und auf 6 Zeichen gekürzt
print e[5].name; " "; e[5].hp

sub heal(p AS TEntity, amount AS WORD) # oder p: TEntity
p.hp = p.hp + amount # Das übergebene Element wird geändert
p.pos.x = p.pos.x + 1
end sub
heal(e[5], 25) # Element übergeben
```

Regeln und Einschränkungen:

- Feldtypen: `int` / `byte` (1 Byte), `word` / `integer` (2 Bytes LE,
  vorzeichenlos), `float` (2 Bytes Q8.8), `string * n` (eine Zeichenkette fester
  Länge von bis zu n Zeichen, 1–254, n + 1 Bytes im Element; `string` allein ist
  `string * 15`) und ein weiterer Strukturtyp (verschachtelt: `arr[i].pos.x`).
  Felder werden geschrieben `var name: type` oder, im QBasic-Stil, `name AS
  type`; `END TYPE` schließt den Block wie `endtype`.
- **Standardwerte:** `= Konstante` nach einem Feld (eine Zahl, eine Dezimalzahl
  für `float`, ein Stringliteral für `string`). Sie entsprechen dem Inhalt des
  Arrays beim Programmstart (z. B. `Datenname: …`); ein verschachteltes Feld
  übernimmt die Standardwerte seines Typs. Die Elementanzahl muss dann eine
  Konstante sein.
- **String-Felder** funktionieren wie String-Werte: weisen Sie Literale oder
  berechnete Strings zu (auf die Feldlänge gekürzt), geben Sie sie aus,
  verwenden Sie sie in `+`, `=` / `&lt;&gt;` / `&lt;` und String-Funktionen.
- **Strukturparameter:** `sub f(p AS TName)` / `p: TName` empfängt die Adresse
  des übergebenen Elements (`f(enemies[i])`), sodass `p.field` dieses Element
  liest und schreibt; ein Strukturparameter kann an eine andere Routine
  übergeben werden (`g(p)`). Auch eine Funktion kann sie entgegennehmen.
  `arr[i]` eines Strukturarrays ohne Feld ist diese Adresse.
- Elementgröße = Summe der Feldbreiten (Deklarationsreihenfolge, ohne
  Auffüllung).
- Der Speicher befindet sich unter `$C000+` zusammen mit regulären Arrays und
  wird in der Speicherabbildung als gewöhnliches Array mit der Gesamtbytegröße
  angezeigt.
- Konstanter Index → `LDA/STA absolute` zur Kompilierzeit.
- Variable index → 16-Bit `idx * elem_size` (vorher wurde er in 8 Bit berechnet
  und Elemente jenseits des Offsets 255 waren falsch), dann indizierter Zugriff
  `(ptr),Y`.
- Bei einem Array vom Typ struct ist nur ein Index zulässig; mehrdimensionale
  struct-Arrays werden nicht unterstützt (verwenden Sie einen berechneten
  flachen Index).

Siehe `examples/type_demo.ub`.

### 16-Bit-(Wort-)Variablen

```basic
var ptr: word = $0400 # zwei ZP-Bytes: lo=$00 hi=$04
Poke ptr, 6 # STA (ptr),Y
var v = peek(ptr) # LDA (ptr),Y
```

**16-Bit-Produkte (behoben in 1.5.7).** Ein Produkt, das einem `word` zugewiesen
ist, behält alle 16 Bits, auch wenn keiner der Faktoren ein `word` ist:

```basic
var score: word = 0
var level = 3
score += 300 * level # 900 (vor Version 1.5.7 wurde dies auf 8 Bit gekürzt: 44)
score = score + 100 * level
var big: word = 100 * level + 900
```

Seit Version 1.6.1 gilt dies auch innerhalb von Summen und für `shl` sowie für
konstante Multiplikatoren über 255: `py = cy * 8 + fy`, `py = (cy shl 3) + fy`
und `w = cy * 300` behalten alle 16 Bit bei (zuvor wurden die Summenformen auf 8
Bit gekürzt). Byte-Ziele behalten 8-Bit-Ergebnisse.

### Bitmap-Grafiken

```basic
Grafikmodus # VIC-II hochauflösender Bitmap-Modus (320×200, 1 Bit pro Pixel); Bitmap bei $2000
Grafikmodus # VIC-II Mehrfarben-Bitmap-Modus (160×200, 2 Bit pro Pixel, 4 Farben/Zelle)
Grafikmodus aus # Rückkehr zum Textmodus

gcls # Bitmap löschen (füllt $2000-$3FFF) + Videomatrixfarben festlegen

plot x, y # Pixel bei (x, y) setzen; x: 0-319, y: 0-199
plot erase x, y # Pixel löschen (UND-Maske)
plot xor x, y # Pixel umschalten (EOR-Maske) – flimmerfreie Animation
circle x, y, r # Kreis mit Mittelpunkt bei (x, y) und Radius r; Punkte außerhalb des Bildschirms abschneiden
Linie x1, y1, x2, y2 # Bresenham-Linie von (x1,y1) nach (x2,y2); x: 0-319, y: 0-199
Linie löschen x1, y1, x2, y2 # Pixel entlang der Linie löschen (UND-Maske)
Linie xor x1, y1, x2, y2 # Pixel entlang der Linie umschalten (EOR-Maske)
Rechteck x1, y1, x2, y2 # Rechteckkontur zeichnen (4 Kanten); x: 0-319, y: 0-199
Rechteck löschen x1, y1, x2, y2 # Rechteckkontur löschen (UND-Maske)
Rechteck xor x1, y1, x2, y2 # XOR-Rechteckkontur (EOR-Maske)
Malen x, y # 4-verbundene Flächenfüllung von (x, y); Füllt leere Pixel innerhalb der festgelegten Pixel

Farbstift c # Legt die hochauflösende Zeichenfarbe fest (0–15); siehe unten

# ── Mehrfarbige Bitmap (Grafiken auf Multi, 160×200) ──
mplot x, y, Farbe # Legt mehrfarbige Pixel fest (x: 0–159, y: 0–199, Farbe: 0–3)
mline x1, y1, x2, y2, Farbe # Mehrfarbige Linie
mrect x1, y1, x2, y2, Farbe # Mehrfarbiger Rechteckumriss
mcircle x, y, r, Farbe # Mehrfarbiger Kreis
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
Grafik auf
gcls
Farbstift 2 # rot
Linie 0, 0, 100, 100
Farbstift 6 # blau
Kreis 160, 100, 40
Anzeige auf
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
Grafiken auf mehreren
gcls
mcircle 80, 100, 40, 1
mrect 10, 10, 150, 190, 2
mline 0, 0, 159, 199, 3
Anzeige auf
```

`mline`/`mrect`/`mcircle` verwenden die gleichen Bresenham-/Mittelpunkt-Routinen
wie ihre hochauflösenden Gegenstücke und zeichnen jedes Pixel bis `mplot`;
Punkte außerhalb des Bildschirms (x ≥ 160 oder y ≥ 200) werden übersprungen.

### Doppelt gepufferte Bitmap (flimmerfrei)

```basic
Grafik auf doppelt gepufferter hochauflösender Bitmap (320×200)
gcls # Löscht den versteckten Backbuffer
Zeile 0, 0, 319, 199 # Alle Zeichnungen (Plot/Linie/Kreis/Rechteck/Malen/gcls) werden in den Backbuffer geschrieben
flip # Zeigt den gezeichneten Puffer an; Zeichnungen werden in den anderen Puffer umgeleitet
graphics off # Zurück in den Textmodus (stellt VIC-Bank 0 wieder her)
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
Grafik auf Block # 80×50 Blockpixel-Modus (Textmodus + benutzerdefinierter 4-Pixel-Zeichensatz @ $2800)
Grafik aus # Zurück zum Textmodus
gcls # Blockspielfeld löschen: Bildschirm-RAM $0400-$07FF + Farb-RAM $D800-$DBFF

plot4 x, y # Blockpixel bei (x, y) setzen; x: 0-79, y: 0-49
plot4 erase x, y # Blockpixel bei (x, y) löschen
circle4 x, y, r # Kreis mit Mittelpunkt in Blockpixeln zeichnen; auf 80×50 beschneiden
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
cls # Bildschirm löschen (KERNAL $E544)
cls fast # Schnelles Füllen: Bildschirm-RAM + Farb-RAM + Home

color text 14 # Textfarbregister $0286
color border 6 # $D020
color bg 0 # $D021
color pen 2 # Hohe Zeichenfarbe (0-15) für Plot/Linie/Rechteck/Kreis/Malen

screen 0, 0, 65 # Zeichen 65 ('A') in den Bildschirm-RAM an Spalte 0, Zeile 0 ($0400) schreiben
screen 10, 5, ch # Spalte 10, Zeile 5 — Spalte/Zeile können Variablen sein
screen 5, 3, 42, 7 # Zeichen 42 an Spalte 5, Zeile 3, Farbe 7 (schreibt auch in den Farb-RAM $D800)
screen x, y, ch, col # Alle vier Argumente als Variablen

display on # VIC-Anzeige wieder aktivieren ($D011 DEN bit)
display off # Anzeige leer

lowercase # CHR$(14) → VIC-II auf Klein-/Großbuchstaben-Zeichensatz umschalten
uppercase # CHR$(142) → VIC-II zurück auf Großbuchstaben/Grafik-Zeichensatz umschalten

cursor 20, 10 # Cursor zu Spalte 20, Zeile 10 bewegen (KERNAL PLOT $FFF0)
cursor x, y # Spalte aus Variable x (0–39), Zeile aus Variable y (0–24)

print at 20, 10, "HELLO" # cursor(20,10) + print in einer Anweisung (ohne abschließenden Zeilenumbruch)
print at x, y, "Score:", score # beliebige Kombination von Ausdrücken
print at 0, 0 # nur Position (kein Text, kein Zeilenumbruch)

scroll x 3 # Horizontales Feinscrollen einstellen: $D016 bits 0-2 = 3 (0-7)
scroll y 2 # Vertikales Feinscrollen einstellen: $D011 Bits 0-2 = 2 (0-7)
scroll x n # Wert kann eine Variable oder ein Ausdruck sein (maskiert auf Bits 0-2)
scroll x 7 narrow # Feinscrollen einstellen und 38-Spalten-Modus erzwingen (Randspalte ausblenden)
scroll x 0 wide # Feinscrollen einstellen und 40-Spalten-Modus wiederherstellen
scroll row 12 left # Bildschirm-RAM-Zeile 12 um ein Zeichen nach links verschieben
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
Geschwindigkeit 4 # CPU auf 4 MHz einstellen (liest $D031, aktualisiert Bits 0-3, schreibt zurück)
Geschwindigkeit 48 # 48 MHz (maximale Geschwindigkeit auf U64)
Geschwindigkeit max # entspricht Geschwindigkeit 48 (Alias)
Geschwindigkeit aus # zurück auf 1 MHz (Alias für Geschwindigkeit 1)

Badlines an # Badline-Timing aktivieren (Bit 7 von $D031 = 0, Standardverhalten C64)
Badlines aus # Badline-Timing deaktivieren (Bit 7 von $D031 = 1, mehr CPU-Zyklen)

var t = turbo() # 1, wenn Turbo aktiv ist (Bits 0-3 von $D031 != 0), 0, wenn 1 MHz
```

Verfügbare MHz-Werte: `1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 20, 24, 32, 40, 48`.
Konstante Werte werden zur Kompilierzeit auf die nächstniedrigere verfügbare
Geschwindigkeit abgerundet. Variable Werte werden als Rohgeschwindigkeitsindex
(0–15) behandelt und mit den Bits 0–3 von `$D031` verknüpft.

| $D031 Index | MHz (U64) | MHz (U64 Elite-II) |
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
var key = getch() # Wartet auf $FFE4 bis zum Tastendruck; gibt den PETSCII-Code zurück
var k = inkey() # Nicht blockierend: Gibt den PETSCII-Code zurück oder 0, falls keine Taste gedrückt wird
waitkey # Wartet, bis eine beliebige Taste gedrückt wird (CIA1-Matrix-Scan; funktioniert während IRQ)
var k = waitkey() # Gleiches gilt, gibt aber die rohen Bits der $DC01-Spalte zurück (Bit 0 = Taste gedrückt)
var j = joy(2) # Joystick-Port 2 lesen; Gibt die invertierten Bits 0-4 zurück.
var j = joy(1) # Joystick-Port 1 lesen

# Bit 0 = oben (1), Bit 1 = unten (2), Bit 2 = links (4), Bit 3 = rechts (8), Bit 4 = Feuern (16)
var mx = mouse_x() # Maus: akkumulierte X-Position (Hilfsfunktion: Charge + Delay + Delta)
var my = mouse_y() # Maus: akkumulierte Y-Position (EOR #$FF invertiert)
var mb = mouse_btn() # Maustasten: liest $DC01 — Bit 0 = links (Feuern), Bit 1 = rechts (Pin nach oben)
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
bye # JSR $E544 (Bildschirm löschen), STOP-Flag löschen, RTS zu BASIC
exit # Alias für bye
```

### Timing

```basic
wait 50 # Warte 50 Rasterzeilenübergänge (~3,2 ms)
wait raster 100 # Warte, bis $D012 == 100 (Rasterteilungseffekte)
delay 1 # Warte 1 PAL-Frame (1/50 s ≈ 20 ms)
delay 20 # Warte 20 Frames ≈ 0,4 s; n kann eine Variable sein (0–255)
```

`delay N` zählt N vollständige PAL-Frames, wobei die Rasterzeile 200 als
Framegrenze dient.

### SID Sound

```basic
Ton 0, $1CAD, 25 # Stimme 0, Frequenz $1CAD (≈ mittleres C PAL), 25 Frames Dauer
Ton 1, Frequenz_Wort, 50 # Stimme 1, Frequenz aus Wortvariable, 50 Frames (1 s bei 50 Hz)
Ton 2, 0, 0 # Stimme 2, Stille

SID-Lautstärke 15 # Master-Lautstärke voll ($D418 = $0F); Bereich 0–15
SID-Lautstärke 0 # Stille (Master-Lautstärke = 0)
SID-Stopp # Alle 25 SID-Register ($D400–$D418) auf Null setzen — vollständige Stille
```

`sound <channel>, <freq>, <duration>` – Dauer in PAL-Frames (je 1/50 s). `sound`
**Blöcke**: Das Programm wartet, bis die Note verklungen ist (verwenden Sie
`sfx` unten innerhalb einer Spielschleife). Festes ADSR: Attack/Decay `$09`,
Sustain/Release `$F0`, Sägezahnwellenform. Master-Lautstärke `$D418` immer auf
`$0F` eingestellt.

*Behoben in 1.5.7:* Die Warteschleife überwachte Rasterzeile 0, die `$D012` (nur
die unteren 8 Bits) zweimal pro Frame angezeigt wird (Zeilen 0 und 256), sodass
jede Note **halb** so lange dauerte wie angefordert – und zwei Zweige wurden
über ihren Opcode gepatcht, was das Programm bei jeder Dauer außer 0 zum Absturz
brachte. `sound` wartet nun genau wie `delay` auf Rasterzeile 200.

`sid volume N` schreibt N nach `$D418`. Bits 0-3 = Lautstärke (0-15), Bits 4-7 =
Filtermodus. `sid stop` sendet eine 10-Byte-Nullfüllschleife – schneller als 25
einzelne Eingaben.

### Nicht blockierende Soundeffekte (`sfx`) – neu in Version 1.5.7

```basic
sound 0, $2000, 25 # BLOCKS: Das Programm wartet hier 25 Frames.
sfx 0, $2000, 25 # Gibt sofort den Wert zurück; der Ton klingt automatisch aus.
sfx 1, $0500, 8, 128 # Optionale Wellenform: 16 Dreieck, 32 Sägezahn (Standard), 64 Puls, 128 Rauschen.
sfx 0, freq_word, 4, 16 # freq kann eine Konstante, eine Wortvariable oder ein 8-Bit-Ausdruck sein.
```

`sfx <channel>, <freq>, <frames> [, <wave>]` programmiert eine SID-Stimme und
kehrt sofort zurück, sodass es innerhalb einer Spielschleife sicher ist. Es gibt
keinen Gate-Off-Timer: Die Hüllkurve ist auf Attack 0 / Sustain 0 / Release 0
eingestellt, und die **decay** wird zur Kompilierzeit aus `frames` gewählt (1
Frame = 20 ms, nächstgelegene SID-Decay-Zeit: 6, 24, 48, 72, 114, 168, 204, 240,
300, 750, 1500, 2400 ms ...), sodass der Ton in etwa dieser Zeit ausklingt. Es
triggert die Stimme bei jedem Aufruf erneut (Gate aus, dann an) und setzt die
Master-Lautstärke `$0F`. `channel` (0-2), `frames` (1-255) und `wave` müssen
Kompilierzeitkonstanten sein.


### SID Music

```basic
load sid "tune.sid" # SID-Musik an ihrer nativen Ladeadresse einbetten
load sid "tune.sid", $2000 # Überschreiben: Einbetten an Adresse $2000 unabhängig vom SID-Header
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
Lade SID "music.sid"

Sub music_irq()
Poke $D019, $FF # VIC-Raster-IRQ bestätigen
sys sid_play # Musik um einen Frame vorwärts
irq_exit # JMP $EA81: A/X/Y + RTI wiederherstellen (korrekter IRQ-Ausgang)
end

sys sid_init, 0 # SID-Chip initialisieren: A=0 → erste Subtune
irq music_irq, $C0 # Raster-IRQ in Zeile $C0 → 50 Hz auf PAL

sid volume 15 # Master-Lautstärke ein
```

**Anmerkungen:**
- Die SID-Daten werden **nach** dem gesamten generierten Code eingefügt und bis
  zur Ladeadresse mit Nullen aufgefüllt. Der Compiler gibt eine Warnung aus,
  falls die SID-Ladeadresse mit generiertem Code in Konflikt gerät.
- PSID v1 und v2 werden unterstützt. Wenn die Ladeadresse des SID-Headers 0 ist,
  werden die ersten beiden Datenbytes als Adresse verwendet (PRG-Stil,
  Little-Endian).
- Nur ein `load sid` pro Programm ist aussagekräftig (das letzte gewinnt).

### Tracker-Melodien (`tune`)

```basic
tune # optional: Tune bei $C800 (Standard $8000)
speed 6 # Frames pro Zeile (50 Hz PAL)
inst 0, $41, $09, $F0, $0800, $0064, $27, $1F
inst 1, $10, $08, $A8, $0400, $0000, $00, $0F
imod 0, 6, 3, 9, 40, $0200, $0E00 # Vibrato + Pulsweitenmodulation (1.6.2)
ifilt 0, $0500, 20, 1 # Cutoff-Sweep bis $500, hin und her (1.6.2)
igate 1, 2, 1, $09 # Gate-Timer, Hard-Restart, erster Frame $09 (1.6.2)
itab 1, 2, 0, ".. +0", ".. +4", ".. +7" # Arpeggio-Tabelle (1.6.2)
Reihenfolge 0, 1, 0 # Musterreihenfolge (Muster können sich wiederholen)
pat 0, 0, "C-4 00", "...", "E-4 00 V24", "...", "G-4 00", "... .. C00"
pat 0, 1, "C-2 01", "...", "...", "...", "G-2 01 F03"
pat 1, 0, "G-4 00", "...", "E-4 00", "...", "C-4 00"
Ende
Musikwiedergabe # oder: sys sid_init / IRQ-Handler ruft sys sid_play auf
```

`tune ... end` beschreibt eine 3-stimmige Tracker-Melodie im Klartext (die
gleiche Zellennotation, die der Visual Assembler SID-Editor anzeigt) und
erstellt den Player **zur Kompilierzeit**. Es definiert `sid_init` / `sid_play`
genau wie `load sid`, sodass `music play`, `music stop`, `music pause` und
`music resume` (und ein manueller `irq`-Handler, der `sys sid_play` aufruft)
unverändert funktionieren.

| Linie                                                              | Bedeutung                                                                                                                                                                                                                                                                                                                                                                                        |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Geschwindigkeit N`                                                | Frames pro Tracker-Zeile (1-255).                                                                                                                                                                                                                                                                                                                                                                |
| `inst id, ctrl, ad, sr, pw, cutoff, resfilt, modevol`              | Ein Instrument: Steuerregister (Wellenformbits plus Ringmodulator `$04` / Synchronisation `$02`; das Gate-Bit wird vom Spieler hinzugefügt), Attack/Decay, Sustain/Release, 12-Bit-Pulsbreite, 11-Bit-Filter-Cutoff, Resonanz-/Filter-Routing-Byte (`$D417`-Stil: jedes Routing-Bit = routet die Stimme, die dieses Instrument spielt) und Modus-/Lautstärke-Byte (`$D418`-Stil, Bit 7 = 3 AUS). |
| `imod id, vibdelay, vibspeed, vib Depth, pwmspeed, pwmmin, pwmmax` | (1.6.2) Instrumenten-Vibrato: Nach `vibdelay` Frames wird ein Dreieck-LFO aktiviert, der alle `vibspeed` Frames (1–15, 0 = aus) aktiv ist. Die Tiefe beträgt 0–15 (skaliert auf den Halbton der Note). Pulsweitenmodulation: `pwmspeed` wird pro Frame addiert (0 = aus) und wechselt zwischen `pwmmin` und `pwmmax`.                                                                            |
| `ifilt id, cutend, sweep, pingpong`                                | (1.6.2) Filter-Cutoff-Sweep: vom `inst`-Cutoff in Richtung `cutend` durch `sweep` (0-127) pro Frame; `pingpong` 1 = hin und her.                                                                                                                                                                                                                                                                 |
| `igate id, gatetimer, hardrestart, firstwave`                      | (1.6.2) Das Gate wird `gatetimer` Frames vor der nächsten Note der Stimme freigegeben (unterhalb von `speed` halten); `hardrestart` 1 setzt ADSR dann auf 0. `firstwave` (z. B. `$09` = test + gate) wird im ersten Frame der Note geschrieben.                                                                                                                                                  |
| `itab id, speed, loop, "step", ...`                                | (1.6.2) Wellenform-/Arpeggio-Tabelle, bis zu 32 Schritte: `"WW +n"`, `".. -n"` oder `"WW =n"` - Wellenform in Hexadezimaldarstellung (`..` behält sie bei) und ein Notenversatz in Halbtonschritten oder eine absolute Note (`=60`). Ein Schritt alle `speed` Frames, dann zurück zu Schritt `loop` (255 = auf dem letzten Schritt bleiben).                                                     |
| `order p, p, ...`                                                  | Musterreihenfolge. Die Linien akkumulieren sich, bis zu 255 Schritte.                                                                                                                                                                                                                                                                                                                            |
| `pat p, v, "cell", ...`                                            | Bis zu 32 Zeilen für Stimme `v` (0-2) des Musters `p` (0-7). Fehlende Zeilen sind leer.                                                                                                                                                                                                                                                                                                          |

Eine **Zelle** ist `NOTE INST FX`: `C-4`, `D#3`, `Eb2` oder `...` für keine
Note, ein zweistelliges Hex-Instrument (`..`, um es beizubehalten) und ein
optionaler Effekt - `Vxy` Vibrato (x = Haltereihen, y = Tiefe), `Uxx` / `Dxx`
Slide nach oben / unten, `C` Notenabbruch, `Fxx` Geschwindigkeit einstellen.
Eine Zelle, die nur einen Effekt enthält, kann wie folgt geschrieben werden:
`"... .. F06"` oder einfach `"F06"`.

Hinweise zum Player:

- Der gesamte Spielerstatus befindet sich ** innerhalb des Blobs** (absolute
  Adressierung) - er verwendet keine Nullseite, sodass er nicht mit
  UltimateBasic-Variablen oder temporären Objekten kollidieren kann und auch
  dann noch funktioniert, wenn das Programm zu BASIC zurückkehrt.
- In jedem Frame (1.6.2) führt der Player die Wellenform-/Arpeggio-Tabelle, das
  Vibrato, die Pulsweitenmodulation und den Gate-Timer/Hard-Restart jeder Stimme
  sowie den Cutoff-Sweep der Stimme aus, die zuletzt ein filtergeroutetes
  Instrument gestartet hat (sie besitzt Cutoff, Resonanz und Modus des Filters;
  `$D417` routet jede Stimme, deren aktuelles Instrument filtergeroutet ist). Es
  handelt sich um denselben Algorithmus wie im exportierten Player und der
  Vorschau des Visual Assembler SID-Editors, Frame für Frame.
- Der Blob wird an einer festen Adresse abgelegt (standardmäßig `$8000` oder
  `tune at $addr`), und `.prg` wird entsprechend aufgefüllt, z. B. `load sid`.
  Halten Sie ihn von Ihrem Code, Arrays (`$C000+`) und jeglichem
  Bitmap-/Zeichensatzspeicher fern. Ein Tune benötigt etwa 2,5 KB plus 12 Byte
  pro Datenzeile und -spalte.
- Höchstens 8 Muster (jeweils 32 Zeilen); die Reihenfolgeliste kann diese
  beliebig wiederholen.
- `music play` verwendet den CIA1-Timer mit 50 Hz; kombinieren Sie ihn nicht mit
  einem anderen `load sid`/`tune` (der letzte gewinnt).

### Musikwiedergabe

`music play/stop/pause/resume` ist eine Alternative auf höherer Ebene zur
manuellen Einrichtung von `sys sid_init` / `cia_timer`. Erfordert eine vorherige
Anweisung `load sid` oder einen Block `tune ... end` (beide definieren
`sid_init` / `sid_play`).

```basic
SID laden "tune.sid" # SID-Datei einbetten (definiert sid_init / sid_play)

Musik abspielen # Subton 0 initialisieren + CIA1 50 Hz IRQ starten
Musik abspielen 1 # Ab Subton 1 starten (Songnummer 0-basiert)
Musik stoppen # Wiedergabe stoppen + alle 25 SID-Register ($D400-$D418) auf Null setzen
Musik pausieren # CIA1 Timer A IRQ deaktivieren (Musik friert ein, SID unverändert)
Musik fortsetzen # CIA1 Timer A IRQ wieder aktivieren (Fortsetzung an der Pausenposition)
```

| Stellungnahme         | Wirkung                                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `Musik abspielen [n]` | Rufe `sid_init(n)` auf, konfiguriere den CIA1-Timer A auf 19 656 Zyklen (~50 Hz PAL), installiere den IRQ-Wrapper. |
| `Musik stoppen`       | CIA1-IRQ deaktivieren + alle 25 SID-Register auf Null setzen                                                       |
| `Musikpause`          | CIA1-IRQ deaktivieren (SID-Ausgabe bleibt eingefroren)                                                             |
| `Musik fortsetzen`    | CIA1 IRQ wieder aktivieren (Fortsetzung vom Pausenpunkt)                                                           |

Der IRQ-Wrapper (wird einmalig am Ende des Programms ausgegeben) macht: ACK CIA1
Timer A → `JSR sid_play` → `JMP $EA81`.

### Sprites

```basic
Sprite 0, x, y, $2000 # Sprite 0: X- und Y-Position sowie Datenzeiger setzen
Sprite 0, x, y # ohne Datenzeiger (behält die bestehende Position bei)
Sprite on 0 # Sprite 0 aktivieren ($D015 |= bit0)
Sprite off 0 # Sprite 0 deaktivieren ($D015 &amp;= ~bit0)
Sprite color 0, 7 # Sprite 0 Farbe = Gelb ($D027)
Sprite multicolor 0, on # Mehrfarbenmodus für Sprite 0 aktivieren ($D01C |= bit0)
Sprite multicolor 0, off # Mehrfarbenmodus deaktivieren ($D01C &amp;= ~bit0)
Sprite expand x 0, on # doppelte Breite ($D01D |= bit0)
Sprite expand x 0, off # normale Breite ($D01D &amp;= ~bit0)
Sprite expand y 0, on # doppelte Höhe ($D017 |= bit0)
sprite expand y 0, off # normale Höhe ($D017 &amp;= ~bit0)
sprite priority 0, on # hinter dem Hintergrund ($D01B |= bit0)
sprite priority 0, off # vor dem Hintergrund ($D01B &amp;= ~bit0)
var h = sprite_hit() # Sprite-Sprite-Kollision ($D01E, wird beim Lesen gelöscht)
var b = sprite_bg_hit() # Sprite-Hintergrund-Kollision ($D01F, wird beim Lesen gelöscht)
var x = sprite_x(0) # Sprite 0 X-Position lesen (niedrigstes Byte, $D000)
var y = sprite_y(0) # Sprite 0 Y-Position lesen ($D001)
sprite_frame 0, $2000 # ein statisches Sprite-Bild auswählen
sprite_frame 0, $2000, frame # einen Animationsframe auswählen Sequenz
```

X unterstützt den vollen 9-Bit-Bereich (0–319): Verwenden Sie eine
`word`-Variable für Laufzeitwerte > 255. Sprite-Datenzeiger: `data_addr` muss
64-Byte-ausgerichtet sein; gespeichert als `addr >> 6` an der Adresse
`$07F8+id`.

#### Sprite-Animation mit `sprite_frame`

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

### Sprite-Definition

```basic
Sprdef 0
  $00,$3C,$00, $00,$FF,$00, $03,$FF,$C0, $07,$FF,$E0,
  $0F,$FF,$F0, $0F,$FF,$F0, $1F,$FF,$F8, $1F,$FF,$F8,
  $1F,$FF,$F8, $0F,$FF,$F0, $0F,$FF,$F0, $07,$FF,$E0,
  $03,$FF,$C0, $00,$FF,$00, $00,$3C,$00, $00,$00,$00,
  $00,$00,$00, $00,$00,$00, $00,$00,$00, $00,$00,$00,
00, 00, 00 $
Ende
```

`sprdef id ... end` bettet 63 Sprite-Bytes an der nächsten
64-Byte-ausgerichteten Adresse im Codesegment ein, gibt ein `JMP` darüber aus
und setzt automatisch `$07F8+id = data_addr >> 6`. Um dieselbe Form für mehrere
Sprites zu verwenden, lesen Sie den Zeiger zurück:

```basic
var pg = peek($07F8) # Zeiger gesetzt durch sprdef 0
poke $07F9, pg # Kopiere zu den Sprites 1–7
```

### Charakter-Kachelkarten (`.ubmap`)

```basic
map load "levels/world.ubmap"
map load "level.bin", $4000 # Level-Editor-Projekt, Daten bei $4000 (1.6.1)
map draw map_x, map_y # Zeichnet einen 40x25-Viewport auf den Bildschirm/Farbspeicher
map view px, py # Glatte, doppelt gepufferte Ansicht bei Pixel px, py (1.6.1)

var tile = map_tile(x, y) # Zeichencode aus der Karte lesen
map set x, y, 42 # Zeichencode in beschreibbaren Kartendaten ändern

var shade = map_color(x, y) # Zellenfarbe lesen (0, wenn die Karte keine Farbdaten hat)
map color x, y, 7 # Zellenfarbe ändern, wenn Farbdaten vorhanden sind
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

**Level-Editor-Projekte (neu in 1.6.1).** `Map laden` liest auch ein
VisualAssembler-Level-Editor-Projekt (`Level speichern (.bin)`) und setzt dessen
Bildschirme zu einer Karte zusammen: Ein Level mit W×H Bildschirmen wird zu
einer (W·40)×(H·25) Karte mit Farben, leere Felder werden als Leerzeichen
dargestellt. Karten sind auf 255×255 Zellen begrenzt, sodass ein Level maximal 6
Bildschirme breit und 10 hoch sein kann.

```basic
map load "level.bin" # 2x5 screens -&gt; one 80x125 map
```

**Platzieren der Kartendaten (neu in 1.6.1).** `map load "file", addr` speichert
die Karte an einer festen Adresse anstatt direkt im Code, wie `incbin "file",
addr` (die Adresse muss oberhalb des generierten Codes oder innerhalb einer
`org` Lücke liegen). Zeichen werden zuerst angezeigt, Farben folgen:

```basic
map load "level.bin", $4000 # 80x125 map: characters $4000-$6713, colors $6714-$8E1F
```

#### Sanftes Scrollen — `Kartenansicht` (neu in 1.6.1)

```basic
map load "level.bin", $4000
var px: word = 0
var py: word = 0
loop
map view px, py # einmal pro Frame, anstatt `wait raster`

# Joystick auslesen, px/py ändern, Spiellogik ...
end
```

Die Funktion ``map view x, y`` zeigt die Karte an der Pixelposition ``x, y`` an
(Wortausdrücke: ``0..(width-40)*8`` und ``0..(height-25)*8``, Werte außerhalb
des gültigen Bereichs werden begrenzt). Sie wird einmal pro Frame aufgerufen:
Die Funktion wartet auf die Framegrenze (Rasterzeile 250), zeigt die Position
des vorherigen Aufrufs an und übernimmt dann die neue Position, sodass eine
Position einen Frame später angezeigt wird.

Funktionsweise: Der Feinteil verwendet XSCROLL / YSCROLL in `$D016` / `$D011`
mit 38 Spalten und 24 Zeilen (der eingescrollte Rand bleibt verborgen). Die
Zeichenschritte tauschen zwei Bildschirmpuffer, `$0400` und `$3C00`. Die
Position wird zwei Frames im Voraus berechnet, und der verborgene Puffer für die
nächste Zeichenzelle wird in zwei Hälften aufgebaut, bevor die Ansicht diese
erreicht. Dadurch wird der Tauschvorgang nicht unterbrochen. Farb-RAM kann nicht
doppelt gepuffert werden: Seine obere Hälfte wird im letzten alten Frame hinter
dem Rasterstrahl kopiert, die untere Hälfte direkt nach dem Tausch davor
(jeweils mit für einige Rasterzeilen maskierten Interrupts), sodass keine
Bildfehler auftreten. Ein Richtungswechsel direkt bei einem Zeichenschritt kann
die Ansicht für ein oder zwei Frames anhalten, während der Puffer neu aufgebaut
wird.

Regeln:

- Der Programmcode und die Inline-Daten dürfen nicht in `$3C00-$3FFF` (zweiter
  Puffer) gelangen; große Maps müssen mit einer Adresse geladen werden (`map
  load "file", $4000`), andernfalls wird die Kompilierung mit einem Fehler
  abgebrochen.
- Die erste `map view` zeichnet die gesamte Ansicht in `$0400`. Danach gehört
  der Bildschirm zur `map view`: `print` / `screen` / `cls` schreiben nur in
  `$0400` und werden überschrieben.
- Sprites funktionieren wie gewohnt: `map view` kopiert die Sprite-Pointer
  `$07F8-$07FF` nach `$3FF8-$3FFF` in jedem Frame, sodass `sprdef` /
  `sprite_frame` in beiden Puffern angezeigt werden. Die Sprite-Daten werden in
  VIC-Bank 0 (`$0000-$3FFF`, nicht `$1000-$1FFF`) gespeichert, z. B. durch
  Einfügen von `sprdef` vor einem großen Inline-Befehl `map load`.
- Die Zeichensatzbits von `$D018` bleiben erhalten (`charset on` funktioniert);
  das Mehrfarbenbit von `$D016` bleibt erhalten, da es von `map load` gesetzt
  wurde.
- Pro Frame sollten etwa 6000 Zyklen (~95 Rasterzeilen) Spiellogik verbleiben;
  ein längerer Frame sorgt dafür, dass die Ansicht für einen Frame gehalten
  wird, aber niemals reißt.
- Beispiel: `examples/level_scroll_demo.ub` (Joystick-gesteuert, mit einem
  Spieler-Sprite).

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
koala load "pictures/title.kla" # Validierung und Einbettung zur Kompilierzeit
koala show # Bitmap-Mehrfarbenmodus aktivieren
koala hide # Rückkehr zur Standard-Textanzeige
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

### Code-Layout: `org` — neu in 1.5.7

```basic
sub a() ... end # Unterprogramme/Funktionen werden nacheinander vom Ende des Hauptteils aus eingefügt.
org $4000 # Die nächsten Unterprogramme/Funktionen werden bei $4000 fortgesetzt; $xxxx-$3FFF bleibt mit Nullen aufgefüllt.
sub b() ... end
incbin "font.bin", $3800 # Daten können in der Lücke gespeichert werden ($3800-$3FFF ist ein vollständiger VIC-Zeichensatz-Slot).
```

Die Adresse `org addr` wird **zwischen Subroutinen-/Funktionsdefinitionen**
platziert (sie wird im Hauptteil ignoriert und erst im zweiten Durchlauf
ausgeführt). Subroutinen fallen nie ineinander, daher werden die übersprungenen
Bytes einfach mit Nullen aufgefüllt und reserviert: ein `incbin "f", addr`, das
vollständig innerhalb der Lücke liegt, wird hineingeschrieben, und `charset on`
zählt die Lücke nicht als Code. Die Nullbytes sind Teil von `.prg`. `org`
unterhalb des aktuellen Codeendes ist ein Kompilierfehler. Alles, was nach der
letzten Subroutine generiert wird (Hilfsroutinen, `data`-Tabellen), folgt der
letzten Subroutine, d. h. landet oberhalb der Lücke.

### Benutzerdefinierter Zeichensatz (`charset on` / `charset off` neu in 1.5.7)

```basic
charset $3800 # Basisadresse für chardef festlegen (Standard: $3800)

chardef 65 # Zeichen 65 ('A') neu definieren
$18,$3C,$66,$7E,$66,$66,$66,$00
end

chardef 66 # Weniger als 8 Bytes werden mit Nullen aufgefüllt
$7C,$66,$7C,$66,$7C
end
```

`charset base` legt die Zieladresse für alle nachfolgenden `chardef`-Anweisungen
fest. `chardef id ... end` bettet 8 Bytes inline in den Codeabschnitt ein
(vorangestellt durch ein `JMP`, um sie zu überspringen) und kopiert sie dann zur
Laufzeit nach `charset_base + id*8`. Werte müssen Kompilierzeitkonstanten im
Format `$xx` oder als Dezimalzahlen geschrieben sein. Binäre Literale **`%`
werden vom Lexer nicht unterstützt** (das Handbuch gab dies vor Version 1.5.7
fälschlicherweise an).

`charset addr` setzt lediglich das Ziel `chardef`; es erzeugt keinen Code. Damit
der VIC-II den Satz verwendet, schalten Sie ihn ein (und nach Gebrauch wieder
aus):
```basic
Zeichensatz $3800
chardef 1 $FF,$81,$81,$81,$81,$81,$81,$FF end # Rahmen
Zeichensatz ein # VIC-II liest Zeichen von $3800 (Bildschirmmatrix unverändert)
...
Zeichensatz aus # zurück zum ROM-Satz ($1800, falls `lowercase` aktiv ist, sonst $1000)
```

`charset on` read-modify-writes `$D018` bits 1-3 from the last `charset addr`
(default `$3800`); the screen-matrix bits are received. The address must be a
much of `$800` inside VIC bank 0 (`$0000-$3FFF`), otherwise is the compilier
time error. Both instructions use the `charset addr` that been last kompiled, so
keep the directive on the main program body (subroutine bodys will be after it
kompiled ). Der entsprechende Rohschreibvorgang ist `poke $D018, $1A` für
`$2800` oder `poke $D018, $1E` für `$3800`.

**Überlappungsprüfung.** `charset on` beansprucht den gesamten 2-KB-Satz und
jedes `chardef` seine 8 Bytes. Wenn der generierte Code in diesen Bereich
hineinreicht, stoppt der Build mit `the program code ($080D-$xxxx) overlaps the
charset area $2800-$2FFF; move the charset ...`. Große Programme benötigen daher
den Zeichensatz oberhalb des Codes (`charset $3800`) – oder verwenden Sie `org`
(oben), damit der Code oberhalb des Zeichensatzes fortgesetzt werden kann.
Daten, die in einer `org` Lücke platziert werden (`incbin ..., addr`), werden
nicht als Code gezählt.

### Erinnerung

```basic
poke $D020, 2 # STA $D020
poke addr_var, 6 # STA (addr_var),Y — falls addr_var vom Typ Wort ist
var v = peek($D012) # LDA $D012
var v = peek(addr_var) # LDA (addr_var),Y — falls addr_var vom Typ Wort ist

var w: word = peek16($C000) # 16-Bit Little-Endian lesen: lo=$C000, hi=$C001
poke16 $0314, $EA81 # 16-Bit Little-Endian schreiben: lo→$0314, hi→$0315
poke16 ptr, w # Wortvariable als Adresse; Wortvariable als Wert

Variable k = 2
Variable p = peek($07F8 + k) # LDA $07F8,Y — Konstante + Byte-Variable
poke $07F8 + k, p # STA $07F8,Y
poke ptr + k, 1 # Wort + Byte: vollständige 16-Bit-Adresse
```

`peek16(addr)` liest zwei aufeinanderfolgende Bytes (lo, hi) als `word`.
`poke16` schreibt lo und dann hi.

Eine Adresse ist immer ein 16-Bit-Wert. Seit Version 1.6.5 behält ein
Adressausdruck wie `$07F8 + k` das höherwertige Byte der Konstanten und den
Übertrag bei (zuvor wurde er in 8 Bit berechnet und `peek($07F8 + k)` read
`$00F8 + k`). Dies gilt für `peek`, `poke`, `peek16`, `poke16`, `fill`,
`memcopy`, `drawmem`, `save` und `reu`; `fill` / `memcopy` Längen wie `40 *
rows` sind ebenfalls 16-Bit. `peek(k)` liest mit einer Byte-Variablen die
Adresse `$00kk` (vor Version 1.6.5 gab es den Wert von `k` selbst zurück).

### Festplatten-E/A

```basic
load "PROGRAM" # KERNAL LOAD: Lädt Datei von Gerät 8 an ihre native Adresse
load "DATA", $C000 # Lädt Datei an eine bestimmte Adresse
chain "GAME" # Lädt ein anderes Programm über dieses und führt es aus (siehe unten)
load "DATA", ptr # Adresse aus einer Wortvariablen

save "DATA", $C000, 4096 # KERNAL SAVE von $C000, 4096 Bytes → Gerät 8
save "PROG", start, len # Adresse und Länge aus Wort-/Integer-Variablen
```

`load` ruft KERNAL `SETNAM`+`SETLFS`+`LOAD` (`$FFBD`/`$FFBA`/`$FFD5`) auf. Ohne
Adresse: Sekundäre Adresse 1 (der 2-Byte-Header der Datei dient als
Ladeadresse). Mit Adresse: Sekundäre Adresse 0 (die Datei wird an die angegebene
Adresse geladen, ihr Header wird übersprungen). (Behoben in Version 1.5.9 –
zuvor waren die beiden Befehle vertauscht: `load "F"` wurde nach `$0000`
geladen.) `save` ruft `SETNAM`+`SETLFS`+`SAVE` (`$FFBD`/`$FFBA`/`$FFD8`) auf.
Benötigt sowohl `addr` als auch `len`.

#### Verkettung mit einem anderen Programm — `chain` (neu in 1.5.9)

```basic
chain "GAME" # Lädt das Spiel vom Startlaufwerk und führt es aus
chain "GAME", 9 # von Laufwerk 9 (beliebiger Ausdruck)
print "LOAD ERROR" # Wird nur erreicht, wenn die Datei nicht geladen werden konnte
```

`chain` lädt ein anderes Programm an seine eigene Ladeadresse – normalerweise
`$0801`, direkt über das laufende Programm – und startet es genau so, als ob
`LOAD"GAME",8,1` und `RUN` eingegeben worden wären. Genau das benötigt ein
Boot-/Titelprogramm. Ein einfaches `load` kann das nicht leisten: Die geladene
Datei würde den Code überschreiben, der gerade `load` ausführt.

So funktioniert es:

- Ein 46 Byte großer, positionsunabhängiger Loader plus der Dateiname wird in
  den Kassettenpuffer (`$033C`) kopiert, über den weder ein Ultimate
  Basic-Programm noch eine Exomizer-gepackte Datei geladen wird.
- Zuvor wird die Maschine in einen sauberen Zustand zurückgesetzt: VIC-IRQs
  deaktiviert, SID-Lautstärke 0, `IOINIT` (`$FDA3`: CIA-Timer, Tastatur-IRQ,
  serieller Bus), `RESTOR` (`$FF8A`: Standard-IRQ/BRK/NMI- und I/O-Vektoren),
  `$01 = $37`. Benutzerdefinierte Raster-IRQs, `Musikwiedergabe` und
  `NMI`-Handler werden beendet. Bildschirm, Farben und VIC-Bankregister außer
  `$DD00` bleiben unverändert, sodass ein Bild auf dem Bildschirm bleiben kann,
  während das nächste Programm geladen wird (`IOINIT` wählt VIC-Bank 0 aus).
- Der Loader ruft `SETNAM` / `SETLFS` (sekundär 1) / `LOAD` auf. Ohne
  Geräteargument verwendet er das Laufwerk, von dem das Programm selbst geladen
  wurde (`$BA`), oder Laufwerk 8.
- Nach erfolgreichem Laden wird der Programmendezeiger gesetzt (`$2D/$2E`),
  BASIC neu initialisiert (`$E453`, `$E3BF` – ein selbstextrahierender
  Programmzerkleinerer wie Exomizer `sfx` hat möglicherweise die Nullseite von
  BASIC verwendet) und das Programm ausgeführt (`$A659`, `$A7AE`). Es
  funktioniert gleichermaßen für Ultimate Basic-Programme, komprimierte Dateien
  (`exomizer sfx sys`) und normale BASIC-Programme.
- Wenn die Datei nicht geladen werden kann (nicht gefunden, kein Laufwerk
  vorhanden), gibt `chain` zurück und das Programm fährt mit der nächsten
  Anweisung fort.

Der Dateiname muss eine Zeichenkette mit 1 bis 16 Zeichen sein.

### Serielle Kanaldatei-E/A

```basic
open 1, 8, 2, "MYFILE" # Logische Datei 1, Gerät 8, Sekundärgerät 2, Name "MYFILE" öffnen
open 2, 4, 7 # Drucker (Gerät 4) öffnen, kein Dateiname
open ch, dev, sec # Kanal, Gerät, Sekundärgerät aus Variablen

print# 1, "HELLO" # "HELLO"+CR an logische Datei 1 senden
print# ch, x, "text" # Beliebige Kombination aus Variablen und Zeichenketten – wie print, aber in eine Datei

close 1 # Logische Datei 1 schließen
close ch # Kanal aus Variable
```

`open` ruft `SETNAM` ($FFBD) + `SETLFS` ($FFBA) + `OPEN` ($FFC0) auf. Ohne
Dateinamen wird SETNAM mit der Länge 0 aufgerufen. `print#` leitet die Ausgabe
über `CHKOUT` ($FFC9), CHROUT pro Zeichen (+ abschließendes CR), und
anschließend über `CLRCHN` ($FFCC) weiter. `close` speichert die Kanalnummer in
A und ruft `CLOSE` ($FFC3) auf.

### Eingang

```basic
Eingabe Punktzahl # bis zu 3 Ziffern von der Tastatur lesen → 8-Bit-Integer-Variable
Eingabe "Name: ", Name # optionale Eingabeaufforderung, dann Zeile lesen → String-Variable
Eingabe "Punktzahl: ", Punktzahl # Eingabeaufforderung + Integer-Eingabe
```

`input` verwendet KERNAL BASIN (`$FFCF`) für blockierende, echoed line input mit
DEL-Unterstützung.
- **Int var**: akzeptiert nur `0`–`9`, maximal 3 Zeichen; wird beim
  Zeilenumbruch in einen 8-Bit-Wert umgewandelt.
- **String-Variable**: Akzeptiert bis zu 30 Zeichen; speichert als
  nullterminierte Zeichenkette; ZP-Paar wird aktualisiert.
- **FLOAT var** (1.6.3): Ziffern und `.`, z.B. `12.5` → 12.50 (zwei
  Dezimalstellen).
- **SINGLE / DOUBLE var** (1.6.4): any number, `-12.5`, `.5`, `3.25E2`.
- **Array element** (1.6.3): `input t(i)` / `input nevek(i)`; `input "prompt";
  x` funktioniert auch.
- **String var**: akzeptiert bis zu 30 Zeichen; speichert als nullterminierte
  Zeichenkette; ZP-Paar aktualisiert.

### Gleitkommazahl / Festkommazahl

`float` Variablen verwenden das Q8.8 Festkommaformat: Das höherwertige Byte ist
der ganzzahlige Teil (0–255) und das niederwertige Byte ist der Bruchteil (0/256
… 255/256).

```basic
var f: float = 3.5 # 3.5 → hi=3, lo=128 (= 0x0380)
var g: float = 0 # Integer 0 wird automatisch zu 0.0 erweitert

f = 1.5 # Zuweisung eines Literals nach Q8.8
f = f + 1.5 # 16-Bit-Arithmetik nach Q8.8 (Ergebnis: 3.0)
f = f + g # float + float

var n = int(f) # Ganzzahlanteil extrahieren (hi-Byte) → 8-Bit-Integer
print f # Ausgabe als "N.DD" (z. B. 3.5 → "3.50", 1.25 → "1.25")
```

| Betrieb                 | Beispiel             | Anmerkungen                                     |
| ----------------------- | -------------------- | ----------------------------------------------- |
| Wörtlich                | `3,5`, `0,25`, `1,0` | Wurde zur Kompilierzeit als Q8.8 interpretiert. |
| Ganzzahlige Beförderung | `f = 5`              | Speichert 5.0 (hi=5, lo=0)                      |
| Hinzufügen/Ersetzen     | `f + 1,5`, `f - g`   | 16-Bit-Q8.8-Arithmetik                          |
| Extrakt int             | `int(f)`             | Gibt das hi-Byte als 8-Bit-Integer zurück.      |
| Drucken                 | `print f`            | Format "N.DD", immer 2 Nachkommastellen         |

**Achtung:** Arithmetische Operationen führen bei 255,255 zu einem Überlauf
(keine Sättigung). Multiplikation und Division zweier Gleitkommazahlen werden
noch nicht unterstützt – verwenden Sie in diesen Fällen `int()` +
Ganzzahlarithmetik.

**Ausgabe von Gleitkommaausdrücken (behoben in 1.5.7).** `print` eines
arithmetischen Ausdrucks, der einen `float` enthält (zum Beispiel `print a / 10`
mit `a: float = 1`), gibt nun das Q8.8-Ergebnis als `N.DD` aus. Vor 1.5.7 wurde
der rohe 16-Bit-Wert als Integer ausgegeben (`25` statt `0.09`). Der Bruch wird
abgeschnitten, nicht gerundet: 1/10 = 25/256 wird als `0.09` ausgegeben.

### Gleitkommazahlen: `SINGLE` / `DOUBLE` (1.6.4)

`dim x as single` und `dim x as double` sind Gleitkommazahlen – das
5-Byte-Format von C64 BASIC: etwa 9 signifikante Stellen, Bereich ±2,9·10⁻³⁹ …
±1,7·10³⁸. (`single` und `double` sind vom gleichen Typ.) Der schnelle
2-Byte-Typ Q8.8 ist weiterhin als `float` verfügbar.

```basic
DIM r AS DOUBLE, t AS DOUBLE
DIM k(9) AS SINGLE ' Arrays: 5 Bytes pro Element
r = 2.5
t = ATN(1) * 4 * r ^ 2 ' 19.6349541
PRINT t; " "; SQR(2); " "; 1E10; " "; 1 / 3
FOR r = 0 TO 1 STEP 0.25 : PRINT r : NEXT
FUNCTION Atfogo (a AS DOUBLE, b AS DOUBLE) AS DOUBLE
Atfogo = SQR(a * a + b * b)
END FUNCTION
```

|                     |                                                                                                                                                                                              |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Betreiber           | `+ - * /` und `^` (Potenz; rechtsassoziativ, bindet stärker als unäres Minus: `-2^2` = -4)                                                                                                   |
| Funktionen          | `SQR`, `SIN`, `COS`, `TAN`, `ATN` (Radiant), `EXP`, `LOG` (natürlich), `INT` (abrunden), `FIX` (abschneiden), `CINT` (runden), `ABS`, `SGN`, `CSNG` / `CDBL` (keine Operation), `VAL`, `RND` |
| `MOD`               | `a MOD b` = `a - b * FIX(a / b)` (Vorzeichen von `a`, wie in VB/C `fmod`): `7.5 MOD 2` = 1.5; `x MOD 0` = x                                                                                  |
| `RND`               | In einer Gleitkomma-Anweisung ist `RND` / `RND()` eine Zufallszahl 0 ≤ x < 1 (`d = RND`, `x = RND * 6`); `rnd(n)` bleibt die ganze Zahl 0 … n-1                                              |
| Wörtliche           | `1,5`, `.5`, `1E6`, `2,5e-3`, `70000`                                                                                                                                                        |
| Vergleiche          | `= &lt;&gt; &lt; &gt; &lt;= &gt;=` in `IF` / `WHILE` / `UNTIL` / `SELECT CASE` and as values                                                                                                 |
| Drucken             | C64 BASIC-Stil: `.5`, `-3.25`, `3.33333333`, `1E+10`, `1.5E-07` (kein führendes Leerzeichen außer `--basic-print`); feste Dezimalstellen mit `PRINT USING`                                   |
| Saiten              | `s = "X=" + x`, `STR$(x)`, `VAL(s)` liest `-1.25E3`                                                                                                                                          |
| `FOR`               | Gleitkommazähler, Grenzwert und Schrittweite (`SCHRITT 0.1`, negativ oder eine Variable)                                                                                                     |
| `EINGABE` / `LESEN` | `INPUT x` liest eine beliebige Zahl; `READ x` liest das nächste `data` Byte.                                                                                                                 |
| Unterfunktion       | `p AS DOUBLE` Parameter und `AS DOUBLE` Ergebnisse                                                                                                                                           |

**Mischen mit Ganzzahlen.** Ein Ausdruck wird als Gleitkommazahl berechnet, wenn
er einen SINGLE-/DOUBLE-Wert, `^`, eine der oben genannten Funktionen oder ein
Literal enthält, das nur Gleitkommazahlen darstellen können (`1E6`, `300.5`,
`70000`). Sobald ein Programm Gleitkommazahlen verwendet, ist auch jedes
Dezimalliteral (`0.1`) eine Gleitkommakonstante. Speichert man einen
Gleitkommawert in einem Byte, Integer oder Word (rundet ihn auf die Hälfte von
Null: 2,5 → 3, -2,5 → -3), so wird er in einem Float zu Q8.8. Einem DOUBLE
zugewiesener Integerwert wird die Umwandlung exakt vorgenommen.
Integer-Ausdrücke behalten ihre Regeln (var c = a + b ist weiterhin ein Byte).

**Notizen**
- Ein ganzzahliges Zahlenliteral von 32768 bis 65535 behält seinen Wert in einer
  Anweisung, die mit Gleitkommazahlen rechnet (`d = 40000`, `d + 50000`). Eine
  Anweisung gilt als Gleitkommazahl, wenn sie eine SINGLE-/DOUBLE-Variable, ein
  Array, einen Parameter oder eine Funktion benennt oder `^`, ein reines
  Gleitkomma-Literal oder eine der oben genannten Funktionen verwendet;
  andernfalls ist ein solches Literal wie zuvor ein 16-Bit-Muster (`poke 53280,
  1`, `w = 40000` into a WORD). Eine Variable, die erst durch `var x = 2.5` zu
  einer Gleitkommazahl wurde, zählt nicht – schreiben Sie stattdessen `40000.0`.
- `7 / 2` ist 3,5, wenn es einem DOUBLE zugewiesen wird; im Integer-Kontext ist
  es wie zuvor 3.
- `AND` / `OR` / `XOR` runden ihre Operanden auf ganze Zahlen.
- `SIN` / `COS` eines Byte-Wertes behalten die alte Bedeutung der 0–255-Tabelle
  (Vollkreis = 256); mit einem SINGLE / DOUBLE-Argument arbeiten sie im
  Bogenmaß.
- IRQ-/NMI-Handler können Gleitkommazahlen verwenden: Eine Subroutine namens
  `irq`, `nmi` oder `cia_timer`, die (direkt oder über die aufgerufenen
  Subroutinen) SINGLE/DOUBLE verwendet, speichert den Laufzeitzustand beim Start
  und stellt ihn vor `irq_exit` / `nmi_exit` wieder her (ca. 4.000–5.000 Zyklen
  pro Interrupt). Handler ohne Gleitkommazahlen werden nicht verlangsamt. Nicht
  abgedeckt sind Handler, die über eine Adress- oder Wortvariable gesetzt werden
  oder die mit einem einfachen `RTS` / `RTI` beenden.
- Kosten: Die Gleitkomma-Laufzeitumgebung wird vom Compiler kompiliert und dem
  Programm nachgehängt. Es werden nur die vom Programm verwendeten Routinen
  eingebunden (ca. 2 KB für `+ - * /` und `PRINT` bis ca. 5 KB mit allen
  Funktionen und `PRINT USING`). Variablen belegen 5 Byte im Array-Bereich,
  zuzüglich eines 2 Byte großen Nullseitenzeigers für die Laufzeitumgebung. Eine
  Multiplikation dauert auf einem 1-MHz-C64 etwa 1–2 ms.

### Variablen im RAM, Array-Speicher (1.6.4)

- **Nullseite voll:** Wenn die Variablen des Programms nicht in den permanenten
  Nullseitenbereich (`$02-$4F`) passen, kompiliert der Compiler das Programm neu
  und verschiebt die am seltensten im häufig verwendeten Code verwendeten
  Variablen in den normalen Arbeitsspeicher (nach den Arrays). Eine Anweisung,
  die eine solche Variable verwendet, kopiert sie in einen Nullseitenbereich und
  wieder zurück, sodass sich Programme weiterhin gleich verhalten, nur dass
  diese Variablen etwas langsamer sind. Schleifenzähler, Parameter und alles,
  was von einem IRQ-Handler berührt werden kann, bleibt im Nullseitenbereich.
  Die Speicherbelegung zeigt sie als `RAM:$xxxx` an. Das Erreichen des
  Nullseitenbereichs ist nur noch in extremen Fällen ein Fehler
  (`Nullseitenbereich` bleibt für diese Fälle bestehen).
- **Array-Speicher:** Arrays (und ausgelagerte/Gleitkomma-Variablen) verwenden
  `$C000-$CFFF`. Benötigen sie mehr als 4096 Bytes, beginnt der Speicherbereich
  stattdessen bei `$A000` und umfasst 12 KB (`$A000-$CFFF`). Der BASIC-ROM wird
  beim Programmstart deaktiviert (`$01` Bit 0) und bei jedem Verlassen des
  BASIC-Speichers wieder aktiviert (`end`, `bye`, Programmende, `chain`), sodass
  das Programm weiterhin in einen funktionierenden BASIC-Speicher zurückkehrt.
  Programme, die selbst BASIC-ROM-Routinen aufrufen (`sys $Axxx`), dürfen nicht
  mehr als 4 KB an Arrays verwenden.

### Mathematische Funktionen

```basic
var a = abs(x - 20) # Zweierkomplement-Absolutwert
var b = min(x, 39) # 8-Bit-Minimum
var c = max(x, 0) # 8-Bit-Maximum
var s = sgn(score) # 0 = Null, 1 = positiv (1–127), $FF = negativ (128–255)
var r = rnd() # LCG-Pseudozufallszahl 0–255; Startwert aus Rasterzeile

# (0 &lt;= x &lt; 1 in einer SINGLE/DOUBLE-Anweisung: d = rnd)
var r = rnd(10) # LCG-Pseudozufallszahl 0-9 (rnd() mod n; Ergebnis 0..n-1)
var s = sin(angle) # Sinus: Winkel 0-255 (Vollkreis), Ergebnis 0-255 (Mittelpunkt=128)
var c = cos(angle) # Kosinus = sin(angle+64)
var v = clamp(x, 0, 39) # 8-Bit-Clamp ohne Vorzeichen: Ergebnis = max(lo, min(hi, val))

print hex(n) # Ausgabe als 2-stellige Hexadezimalzahl in Großbuchstaben
print bin(n) # Ausgabe als 8-Bit-Binärstring
```

### Zeichenkettenfunktionen

```basic
var n = len(msg) # Länge der nullterminierten Zeichenkette (0–255)
var c = asc(msg) # PETSCII-Code des ersten Zeichens (0, falls leer)
var c = asc("A") # Kompilierzeit: konstanter PETSCII-Code
var n = val(s) # Laufzeit: Dezimal-PETSCII-Zeichenkette parsen → 8-Bit-Integer (z. B. "042" → 42)
var c = msg[i] # Zeichen an Index i: PETSCII-Code von msg[i]
msg[i] = c # PETSCII-Byte c an Index i schreiben — STA (ptr),Y
msg[0] = 72 # konstanter Index → LDY #0; STA (ptr),Y
```

### Zahlenformatierung

```basic
print hex(n) # Ausgabe als zweistellige Hexadezimalzahl in Großbuchstaben
print bin(n) # Ausgabe als 8-Bit-Binärstring
print dec(n, 4) # Rechtsbündige Dezimalzahl in einem 4-Zeichen-Feld (z. B. 42 → " 42")
print dec(n, width) # Breite kann auch eine Variable sein
```

`dec(n, width)` füllt die Zahl links mit Leerzeichen auf, um `width` Zeichen
aufzufüllen. Hat die Zahl mehr Ziffern als `width`, wird sie ohne Auffüllung
ausgegeben (keine Kürzung). Außerhalb des Druckkontexts wird `dec(n, w)`
unverändert zu `n` ausgewertet (genau wie `hex`/`bin`).

### REU (RAM-Erweiterungseinheit)

```basic
var ok = reu_present() # 1, wenn REU erkannt, 0, wenn nicht (Schreib-/Lesetest auf $DF04)
var ok = reudet() # Alias für reu_present()

reu stash c64addr, bank, reu_addr, len # Kopiere C64 → REU
reu fetch c64addr, bank, reu_addr, len # Kopiere REU → C64
reu swap c64addr, bank, reu_addr, len # Tausche zwischen C64 und REU
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
Bildschirm 32 füllen # RAM $0400–$07FF mit dem Wert 32 (Leerzeichen) füllen
Farbe 1 füllen # RAM $D800–$DBFF mit dem Wert 1 (Weiß) füllen

$0400, 1000, 32 füllen # 1000 Bytes ab $0400 mit dem Wert 32 füllen
Adresse füllen, 256, 0 füllen # Adresse kann eine Wortvariable sein
Zeiger füllen, Wortlänge, Wert füllen # Alle Operanden können Ausdrücke/Wortvariablen sein

Speicher kopieren $C000, $0400, 256 # 256 Bytes von $C000 nach $0400 kopieren
Quellzeiger kopieren, Zielzeiger, 40 # Wortvariablen für Quelle und Ziel

Speicher zeichnen $C000, $0400, 8, 10, 40 # kopieren 8×10 Rechteck von $C000 → Bildschirm bei $0400, Schrittweite 40
drawmem src_ptr, dst_ptr, w, h, 40 # Wortvariablen für src/dst
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
irq my_handler # Raster-IRQ in Zeile 0, Handler = Subname oder Adresse
irq my_handler, 100 # Raster-IRQ in Rasterzeile 100
irq $C800, 200 # Handler an fester Adresse
irq addr_word # Handleradresse aus einer Wortvariablen
```

Richtet einen Raster-IRQ über den BASIC-Softvektor (`$0314`/`$0315`) ein:
deaktiviert den CIA1-Timer-IRQ, bestätigt den ausstehenden VIC-IRQ, schreibt die
Rasterzeile nach `$D012`, aktiviert den VIC-Raster-IRQ (`$D01A=$01`), schreibt
die Handler-Adresse und aktiviert die Interrupts wieder.

Der Handler **muss** mit `sys $EA81` (KERNAL-Ende der IRQ) enden – einfache
`RTS` oder `RTI` beschädigen den Stack. Bestätigen Sie zuerst die VIC-IRQ.

```basic
sub my_handler()
poke $D019, $FF # ACK VIC IRQ
# ... hier arbeiten ...
sys $EA81 # JMP zum Kernel-Ende der IRQ
end
```

Vorwärtsreferenzen werden unterstützt (`irq my_handler` vor der Definition der
Unterfunktion).

Eine Handler-Subroutine kann SINGLE / DOUBLE Gleitkommazahlen verwenden: Sie
speichert und stellt den Laufzeitzustand um ihren Rumpf herum wieder her (siehe
*Gleitkomma*).

### NMI-Handler

```basic
nmi my_nmi # NMI-Vektor $0318/$0319 auf Handler-Sub oder Adresse setzen

sub my_nmi()

# ... NMI-Verarbeitung hier ...

nmi_exit # JMP $FE47 — Korrekter NMI-Ausstieg (stellt A/X/Y + RTI wieder her)
end
```

`nmi handler` schreibt die Handler-Adresse in den NMI-Softvektor
(`$0318`/`$0319`). Der Hardware-NMI-Vektor bei `$FFFA` verweist auf die
KERNAL-NMI-Routine, die über `$0318` verzweigt. Der Handler **muss** mit
`nmi_exit` enden (gibt `JMP $FE47` aus) – die Verwendung von `RTI` führt zu
einer Beschädigung des Stacks. Vorwärtsreferenzen werden unterstützt.

### CIA1 Timer IRQ

```basic
cia_timer 19656, my_handler # CIA1-Timer A: feuert alle 19656 Zyklen (~50 Hz PAL)
cia_timer period, handler # period kann eine Variable oder ein Ausdruck sein
```

Richtet den CIA1-Timer A als periodische IRQ-Quelle über den BASIC-Softvektor
(`$0314`/`$0315`) ein:
1. SEI – Interrupts deaktivieren
2. `$DC0D = $7F` — Deaktiviert alle CIA1-IRQs
3. Lade 16-Bit-Periode lo→`$DC04`, hi→`$DC05`
4. Handleradresse in `$0314`/`$0315` schreiben
5. `$DC0D = $81` — CIA1-Timer A IRQ aktivieren
6. `$DC0E = $01` — Timer A im Dauerbetrieb starten
7. CLI – Interrupts wieder aktivieren

Der Handler muss mit `irq_exit` (oder `sys $EA81`) enden und die CIA1-IRQ
bestätigen:

```basic
sub my_handler()
poke $DC0D, $01 # ACK CIA1 Timer A IRQ (Lesen löscht ihn auch)

# ... hier arbeiten ...
irq_exit # JMP $EA81: A/X/Y + RTI wiederherstellen
end
```

PAL-Timing: Takt = 985.248 Hz. Periode für 50 Hz = 985.248 / 50 = 19.705 Zyklen
≈ `$4CC9`. Vorwärtsreferenzen werden unterstützt.

### Fehlerbehandlung

```basic
onerr goto err_handler # Setze den Kernel-I/O-Fehlervektor ($0300/$0301) auf eine Marke

...

label err_handler
print "I/O-FEHLER"
bye
```

`onerr goto label` schreibt die Labeladresse (lo, hi) an die KERNAL-Speicherorte
`$0300` und `$0301`. Tritt ein KERNAL-E/A-Fehler auf (z. B. ein fehlgeschlagener
Aufruf von `load` oder `open`), führt der KERNAL `JMP ($0300)` aus, wodurch zum
entsprechenden Label verzweigt wird. Vorwärtsreferenzen (Labeldefinition nach
`onerr goto`) werden unterstützt.

### Einbettung von Dateien zur Kompilierzeit (`incbin` skip / length neu in 1.5.7)

```basic
incbin "sprites.bin" # Binärdaten an der aktuellen Codeposition einbetten
incbin "charset.bin", $2000 # An einer absoluten Adresse einbetten, ggf. auffüllen
incbin "font.prg", $3C00, 2 # ...die ersten 2 Bytes überspringen (z. B. Ladeadresse einer .prg-Datei)
incbin "big.bin", $4000, 16, 256 # ...16 Bytes überspringen, dann maximal 256 Bytes einbinden
include "defs.ub" # Eine weitere .ub-Quelldatei einbinden (Lex- und Parsing-Vorgang)
```

`incbin "file", addr, skip [, length]` verwirft die ersten `skip` Bytes der
Datei (typischerweise die 2-Byte-Ladeadresse einer `.prg`) und kann optional
maximal `length` Bytes einlesen; `skip` und `length` sind Konstanten, und ein
`skip` über das Dateiende hinaus führt zu einem Fehler. Die Adressform
erfordert, dass sich das Ziel oberhalb des generierten Codes oder innerhalb
einer `org` Lücke befindet.

### Daten / Lesen

```basic
Daten 1, 2, 3, 255 # Konstante Byte-Tabelle
read varname # Nächstes Byte in varname laden (automatische Deklaration bei Bedarf)
```

Alle `data`-Werte werden zur Kompilierzeit erfasst. Ein 2-Byte-ZP-Zeiger wird
beim Programmstart automatisch allokiert und initialisiert. Jedes `read` erhöht
die Position des Zeigers.

**Initialisierte Arrays — `data <array>: …` (neu in 1.5.8)**

```basic
var sinus = array(8)
data sinus: 128, 218, 255, 218
data sinus: 128, 37, 0, 37 # Die folgenden Zeilen werden dort fortgesetzt, wo die vorherige aufgehört hat.
print sinus[i] # Direkter Zugriff, wie bei jedem Array.

var xpos = array_word(2)
data xpos: 24, 300 # Wort-Arrays verwenden 16-Bit-Werte (gespeichert zwischen lo und hi).
```

Eine `data`-Zeile, deren erstes Element `name:` ist, füllt ein deklariertes
`array` / `array_word` anstelle des `read`-Streams. Die Werte werden nach dem
Code gespeichert und einmalig beim Programmstart (direkt nach dem Nullsetzen der
Arrays) in das Array kopiert, sodass die Tabelle vollständig beschreibbar und
wie jedes andere Array indiziert ist. Mehr Werte als das Array aufnehmen kann
oder ein nicht deklarierter Name führt zu einem Kompilierfehler. Diese Zeilen
haben keinen Einfluss auf `read`.

### Inline-Montage

```basic
sys $FFD2 # JSR $FFD2
sys $FFD2, 7 # LDA #7 ; JSR $FFD2 (Bytewert im A-Register übergeben)
irq_exit # JMP $EA81 — Korrekter IRQ-Handler-Beendigung (A/X/Y + RTI wiederherstellen)
asm $EA, $EA # Inline-Rohbytes (NOP NOP) — Legacy-Form
asm {
; Vollständige 6502-Mnemonics und Adressierungsmodi
LDA #$07 ; unmittelbar
STA $0286 ; absolut
LDA $50 ; Nullseite ($50 ≤ $FF → ZP automatisch ausgewählt)
STA $0400,X ; absolut, X-indexiert
LDA ($50),Y ; (indirekt),Y
LDA ($50,X) ; (indirekt,X)
JSR $FFD2 ; Unterprogrammaufruf
JMP $C000 ; Absoluter Sprung
JMP ($FFFC) ; indirekter Sprung

CLC
ADC #1
SEC
SBC #1

TAX ; impliziter Transfer
ASL A ; Akkumulator (auch: ASL)
LSR A
ROL
ROR

; Verzweigungen – Operand ist eine absolute Adresse; Offset wird automatisch berechnet
BNE loop ; Vorwärts- oder Rückwärtssprung zu lokaler Marke
BEQ done

loop:
NOP
done:
RTS

; #<label / #>label – niedrigstes/höchstes Byte einer Markenadresse
LDA #<handler
STA $0314
LDA #>handler
STA $0315

; * – aktuelle Assembler-Adresse
JMP *

; Rohe Hex-Bytes (abwärtskompatibel mit der alten asm { $xx ... } Syntax)
$EA $EA ; zwei NOP-Bytes
}
```

**Adressierungsmodi:**

| Syntax         | Modus        | Bytes | Beispiel                       |
| -------------- | ------------ | ----- | ------------------------------ |
| (kein Operand) | Impliziert   | 1     | `NOP`, `RTS`                   |
| `A`            | Akkumulator  | 1     | `ASL A`, `LSR`                 |
| `#Wert`        | Sofort       | 2     | `LDA #$07`                     |
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
poke $D020, border_col # UltimateBasic löst die ZP-Adresse auf
poke $D021, bg_col
asm {
; Werte sind bereits in $D020 / $D021 vorhanden
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
numstr score, $0340 # schreibt "042\0" an Position $0340 (immer 3-stellig, mit Nullen aufgefüllt)
var n = str_to_int("42") # Kompilierzeit: Expr::Number(42)

print str$(score) # gibt 8-Bit-Integer als 3-stellige Dezimalzahl aus ("000"–"255")
print "Score: " + str$(score) # verwendbar im Kontext von Stringverkettung
var s: string = str$(n) # weist das Ergebnis von str$() einer String-Variablen zu (gemeinsamer statischer Puffer)
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

| Datei                               | Beschreibung                                                                                        |
| ----------------------------------- | --------------------------------------------------------------------------------------------------- |
| `examples/features.ub`              | const, label/goto, poke/peek, rnd, mathematische Funktionen                                         |
| `examples/new_features.ub`          | Unterparameter, Arrays, Wortvariablen, Zeichenkettenvariablen                                       |
| `examples/bitmap_demo.ub`           | 320×200 Bitmap, Diagramm, Grafik ein/aus                                                            |
| `examples/block_demo.ub`            | 80×50 Blockgrafiken, plot4, circle4, Grafiken auf Block                                             |
| `examples/joystick_demo.ub`         | Joystick-Eingabe, Sprite-Bewegung                                                                   |
| `examples/mux_demo.ub`              | Raster-Sprite-Multiplexer (3 Fenster × 8 Sprites = 24)                                              |
| `examples/orbit_demo.ub`            | 24-Sprite-Orbit mit pulsierendem Radius und zufälligen Farben                                       |
| `examples/plasma_demo.ub`           | Bitmap mit Plasmaeffekt und Rasterbalken-Rahmenanimation                                            |
| `examples/sprite_data.ub`           | sprdef-Formdaten (in anderen Demos enthalten)                                                       |
| `examples/sprite_mux_orbit.ub`      | 24-Sprite-Orbit-Demo mit sprdef + vorab berechneten Positionen                                      |
| `examples/sprite_orbit_demo.ub`     | 8 Hardware-Sprites in kreisförmiger Umlaufbahn mittels Sinus-/Kosinustabelle                        |
| `examples/reu_bitmap_demo.ub`       | REU-Speicherung/Abruf mit Bitmap-Grafiken                                                           |
| `examples/sid_music_demo.ub`        | SID-Musikplayer mit Raster-IRQ und Tastaturausgang                                                  |
| `examples/tenprint.ub`              | 5 TENPRINT-Labyrinth-Implementierungen mit Menü; Demos `lowercase` Zeichensatzmodus                 |
| `examples/countdown_demo.ub`        | Countdown `for..next` mit negativem Schritt, inkl. `for i = 20 to 0 step -2`                        |
| `examples/countdown_errors_demo.ub` | Kompilierfehler für Standardschritt `from > to`                                                     |
| `examples/explicit_demo.ub`         | `--explicit` CLI-Flag-Demo mit vollständig typisierten `var`, `sub`, `fn`                           |
| `examples/explicit_errors_demo.ub`  | Ungeordneter Code, der ohne --explicit kompiliert, aber mit `--explicit` Fehler verursacht.         |
| `examples/dim_demo.ub`              | `DIM … AS …` Skalare und Arrays jedes Typs                                                          |
| `examples/qbasic_demo.ub`           | QBasic-ähnliche FUNKTION / SUB / ELSEIF / DO-SCHLEIFE / SELECT CASE / Zeichenketten                 |
| `examples/float_demo.ub`            | EINFACHE / DOPPELTE Gleitkommafunktion: `^`, SQR, SIN, ATN, EXP, LOG, `FOR … STEP 0.5`, `AS DOUBLE` |

## CLI-Referenz

```
ub build <input.ub> [OPTIONEN]

-o, --output <Datei> Ausgabedatei im .prg- oder .crt-Format (Standard: <input>.prg)

-v, --verbose Nullseitenlayout und Hex-Dump des Codes anzeigen

--no-stub BASIC SYS-Stub überspringen (Code wird ab $0801 geladen)

--debug Zusätzlich Debugger-Dateien im .sym-, .dbg- und .vs-Format erstellen

--asm Zusätzlich eine lesbare .asm-Code-Liste für 6502-Code erstellen

--d64 [Datei] Zusätzlich ein .d64-Disk-Image erstellen;
ohne Dateinamen wird standardmäßig <output>.d64 verwendet

--add <Datei> Dem .d64-Disk-Image eine zusätzliche Datei hinzufügen;

Kann für mehrere Dateien wiederholt werden

--explicit Erfordert :type für jede Variable / jeden Unterparameter / jeden Funktionsparameter

--basic-print C64 BASIC PRINT Abstand: Leerzeichen um Zahlen, ',' = 10-spaltige Bereiche

-h, --help Hilfe anzeigen
```

### Warnungen

Der Compiler gibt Warnungen aus (diese stoppen den Build-Prozess nicht), wenn
eine Byte-Variable einen Wert erhält, den sie nicht speichern kann:

```
Zeile 5: Warnung: 'b' ist ein Byte (0-255) und 1000 passt nicht hinein – es kommt zu einem Überlauf; deklarieren Sie es als 'Integer' / 'als Wort', falls dies nicht beabsichtigt ist.
```

Ein Ergebnis, das mit `and`, `mod`, `/` oder `shr` maskiert ist, wird nicht
gemeldet, ebenso wenig wie byte + byte.

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

| Erklärungsformular                                             | Ohne `--explicit`   | Mit `--explicit`      |
| -------------------------------------------------------------- | ------------------- | --------------------- |
| `var name = expr` (kein `:type`)                               | OK – Typ abgeleitet | Fehler                |
| `var name: int = expr` (oder Wort/Gleitkommazahl/Zeichenkette) | OK                  | OK                    |
| `var arr = array(N)`                                           | OK – Typ abgeleitet | Fehler                |
| `var arr = array_word(N)`                                      | OK                  | OK                    |
| `const NAME = value`                                           | OK                  | Okay – unverändert    |
| `sub foo(a, b)` (untypisierte Parameter)                       | OK                  | Okay – unverändert    |
| `sub foo(a: int, b: int)`                                      | OK                  | Okay – unverändert    |
| `fn foo(a): int` (untypisierter Parameter)                     | OK                  | Fehler beim Parameter |
| `fn foo(a: int): int`                                          | OK                  | OK                    |
| `fn foo(a): int` (untypisierter Parameter)                     | OK                  | Fehler beim Parameter |
| `fn foo(a: int): int`                                          | OK                  | OK                    |

Konstanten und Array-Deklarationen werden immer akzeptiert – ihr Typ ist durch
die Deklarationsform festgelegt, daher wäre `:type` überflüssig.

**Beispielhafte Fehlermeldung:**

```
$ ub build myprog.ub --explicit
Kompilierungsfehler:

Zeile 14: 'explicit'-Modus: 'var loose' hat keinen Typ – verwenden Sie 'var loose: int|word|float|string'

Zeile 16: 'explicit'-Modus: Parameter 'a' hat keinen Typ – verwenden Sie 'a: int|word|float|string'
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

Für eine Ausgabedatei mit dem Namen `demo.prg` wird die Datei `demo.asm`
erzeugt. Das Listing wird aus Metadaten generiert, die während der
Maschinencode-Erstellung durch Ultimate Basic erfasst wurden; es handelt sich
nicht lediglich um eine Disassemblierung der fertigen PRG-Datei. Es enthält:

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
.label x = $02 ; int

* = $080D

ub_start:
cld ; $080D: D8
; UB: var x
lda #$01 ; $080E: A9 01
sta x ; $0810: 85 02
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
demo.ub → demo.prg (386 Bytes)

Laden: $080D – $0989

Variablen (Nullseite):
score ZP:$08 Byte
lives ZP:$0A Byte
msg ZP:$0C Zeichenkette
ptr ZP:$0E Wort

Unterprogramme:
greet $0900
show $0912

Arrays ($C000+):
sprites $C000 8 Bytes
```

Mit `-v` werden zusätzlich die internen ZP-Zuweisungen und ein vollständiger
Hex-Dump angezeigt.

### Generierter Code (optimiert in 1.6.0)

Der Codegenerator erzeugt für die häufigsten Fälle einen engeren 6502-Code; die
Programme müssen nicht geändert werden:

- Die Bedingungen in `if` / `while` / `until` / `select` sind ein `CMP` plus
  eine Verzweigung (es wird kein 0/1-Wert gebildet und erneut geprüft). `x &gt;
  n` wird als `x &gt;= n+1` kompiliert; `and` / `or` von Vergleichen werden
  abgebrochen, wenn die rechte Seite keine Seiteneffekte hat; `while` prüft am
  Ende der Schleife.
- Konstanten und Byte-Variablen sind direkte Operanden (`ADC #n`, `CMP zp`);
  `poke` speichert direkt eine konstante oder `word` Adresse.
- Arrays mit variablem Index verwenden die Adressierung `base,Y` anstelle eines
  Nullseitenzeigers.
- Wenn eine Anweisung mit dem Laden der Variable beginnt, die die vorherige
  Anweisung gerade gespeichert hat, wird das redundante `LDA` übersprungen.

Verwenden Sie `--asm`, um den generierten Code für Ihr eigenes Programm
anzuzeigen.

## Bekannte Einschränkungen

| Besonderheit                          | Einschränkung                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ganzzahlarithmetik                    | Die Werte `var`/`byte` sind 8-Bit-Werte ohne Vorzeichen (0–255) und werden umgebrochen (`200 + 100` → 44 in einem Byte); eine Konstante, die nicht in ein Byte passt (`b = 300`, `b = a + 1000`), führt zu einer Kompilierzeitwarnung; `integer` ist ein vorzeichenbehafteter 16-Bit-Wert, `word` ist ein vorzeichenloser 16-Bit-Wert.                                              |
| Budget für null Seiten                | Die permanente Nullseite ist `$02–$4F` (78 Bytes): Jede Variable und jeder Parameter von Unter-/Funktionsfunktionen belegt 2 Bytes, jede laufende `for`-Schleife weitere 2 Bytes. Seit Version 1.6.4 werden Variablen, die nicht in die Nullseite passen, automatisch in den RAM verschoben (siehe *Variablen im RAM*); nur in extremen Fällen wird noch `über Nullseite` gemeldet. |
| Binärliterale                         | `%01010101` (seit 1.6.4), `$hex` und Dezimalzahlen                                                                                                                                                                                                                                                                                                                                  |
| Unterprogramme                        | Keine Rekursion – ZP-Parameterplätze werden statisch zugewiesen                                                                                                                                                                                                                                                                                                                     |
| `END` in QBasic-Routinen              | In einer SUB-/FUNCTION-Anweisung, die mit `END SUB` / `END FUNCTION` abgeschlossen wird, beendet ein einzelnes `END` in seiner Zeile das Programm. Blöcke in einer solchen Routine müssen im QBasic-Stil geschlossen werden (`END IF`, `WEND`, …), ein UB-Stil `if … ⏎ end` wird dort als Programmende gelesen.                                                                     |
| Strukturtypen                         | Ein Index pro Strukturarray (kein `array(8, 8)` einer Struktur); ein Element ist maximal 256 Byte groß; `word`- / `integer`-Felder sind vorzeichenlose 16-Bit-Felder; Zeichenkettenfelder haben eine feste Länge (bis zu 254 Zeichen); ein Strukturparameter übergibt das Element als Referenz.                                                                                     |
| Zeichenkettenvariablen                | `single` / `double` sind seit Version 1.6.4 5-Byte-Gleitkommazahlen (die vom Programm verwendeten Routinen, ~2–5 KB, werden hinzugefügt); `float` bleibt Q8.8 (0–255.99)                                                                                                                                                                                                            |
| Unär minus                            | Seit 1.6.4 bindet ein führendes `-` an seinen Operanden: `-5 - 3` ist -8 (es war -(5 - 3) = -2)                                                                                                                                                                                                                                                                                     |
| Laufzeit von Stringverkettung         | Berechnete Werte werden in einem 80-Zeichen-Puffer pro Variable gespeichert (längere Ergebnisse werden abgeschnitten), String-Array-Elementwerte in 31-Zeichen-Slots – `option strings n, m` löst beide aus (bis zu 255); kein gemeinsamer Heap; `&lt;` / `&gt;` Reihenfolge ist PETSCII-Byte-Reihenfolge                                                                           |
| `rnd()` / `rnd(n)`                    | Einfacher LCG, nicht kryptographisch; Periode = 256 (die Gleitkomma-`rnd` ist eine 32-Bit-XOR-Verschiebung)                                                                                                                                                                                                                                                                         |
| `abs()` / `sgn()` / `min()` / `max()` | Nur 8-Bit-Werte; `abs`/`sgn` behandeln Werte als vorzeichenbehaftet (Bit 7 = negativ → `abs` Zweierkomplement, `sgn` gibt `$FF` zurück); `min`/`max` sind vorzeichenlos (0–255)                                                                                                                                                                                                     |
| `plot`                                | Pixel außerhalb des Messbereichs werden stillschweigend abgeschnitten (Y ≥ 200 oder X ≥ 320 → keine Operation)                                                                                                                                                                                                                                                                      |
| `mplot`                               | Keine Bereichsprüfung — x muss zwischen 0 und 159 liegen, y muss zwischen 0 und 199 liegen                                                                                                                                                                                                                                                                                          |
| `mline` / `mrect`                     | Mehrfarbig; x: 0–159, y: 0–199. Pixel außerhalb des Bildschirms werden umgebrochen (kein Abschneiden) – Koordinaten bleiben im Bereich                                                                                                                                                                                                                                              |
| `mcircle`                             | Mehrfarbig; Punkte außerhalb des Bildschirms werden abgeschnitten (x ≥ 160 oder y ≥ 200 werden übersprungen)                                                                                                                                                                                                                                                                        |
| `Farbstift`                           | Nur für hochauflösende Zellen; setzt den Vordergrund-Nibble der berührten Zellen (Hintergrund bleibt erhalten). Hat im Blockmodus keine Auswirkung (`plot4`/`circle4`).                                                                                                                                                                                                             |
| `rect`                                | Keine Bereichsprüfung — x: 0–319, y: 0–199; x1≤x2 und y1≤y2 werden nicht erzwungen (degenerierte/invertierte Rechtecke erzeugen undefinierte Ausgabe)                                                                                                                                                                                                                               |
| `plot4`                               | Keine Bereichsprüfung — x muss zwischen 0 und 79 liegen, y muss zwischen 0 und 49 liegen (Blockmodus)                                                                                                                                                                                                                                                                               |
| `circle4`                             | Schneidet Pixel außerhalb des Bildschirms ab; der nutzbare Radius beträgt im 80×50-Blockmodus ungefähr 0–49.                                                                                                                                                                                                                                                                        |
| `chr$`                                | Keine PETSCII↔ASCII-Zuordnung — n wird unverändert an CHROUT übergeben                                                                                                                                                                                                                                                                                                              |
| `Musikwiedergabe`                     | Erfordert `load sid` oder einen `tune`-Block; es wird nur ein CIA1-Wrapper ausgegeben (der letzte `music play` gewinnt)                                                                                                                                                                                                                                                             |
| `Grafiken auf Doppel`                 | Nur für hochauflösende Darstellungen; verwendet `$4000–$7FFF` als Backbuffer, daher muss der Programmcode unterhalb von `$4400` bleiben; nicht kombinierbar mit Sprites oder Mehrfarben.                                                                                                                                                                                            |
| Fehlerberichterstattung               | Nur zur Kompilierzeit; `onerr goto` behandelt KERNAL-E/A-Fehler zur Laufzeit.                                                                                                                                                                                                                                                                                                       |
