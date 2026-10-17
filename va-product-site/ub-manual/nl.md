# Ultimate Basic v1.6.5 — Taalhandleiding

Complete taal- en CLI-referentie voor Ultimate Basic, een BASIC-achtige taal die
direct compileert naar 6502-machinecode voor de Commodore 64. Uitvoer: `.prg`
bestanden (VICE of echte hardware), `.crt` cartridge-images en `.d64`
disk-images.

Voor een kort projectoverzicht en installatie-instructies, zie README.md.

© 2026 Zsolt Tarczali

> Het bouwen van de `ub` compiler en de commandoregelopties worden beschreven in
> [README.md](README.md). Deze handleiding documenteert de Ultimate Basic-taal
> zelf.

## Taalreferentie

### Variabelen en constanten

**Alle variabelen moeten vóór gebruik worden gedeclareerd met `var`.** Het
gebruik van een niet-gedeclareerde variabele in een expressie, toewijzing,
`for`/`loop` teller, `inc`/`dec`, `input` of `read` instructie leidt tot een
compileerfout.

```basic
var x = 10 # 8-bits integer (standaard)
var ptr: word = $0400 # 16-bits — twee zero-page bytes, bruikbaar als 16-bits adres
var f: float = 3.5 # Q8.8 fixed-point — hi byte = integer, lo byte = fraction
var msg = "HELLO" # stringvariabele (pointer naar inline PETSCII-gegevens)
var s: string = "TEXT" # string met expliciet type
var scores = array(10) # byte-array, 10 elementen opgeslagen op $C000+
var moments = array_word(8) # word-array, 8 word-elementen opgeslagen op $C000+
const BORDER_ADDR = $D020 # compile-time constante (inline vervangen, geen ZP-slot)
```

Trefwoorden en identificatoren zijn **niet hoofdlettergevoelig**: `PRINT`,
`Print` en `print` zijn allemaal geldig.

| Type                   | Breedte       | Notities                                                                                    |
| ---------------------- | ------------- | ------------------------------------------------------------------------------------------- |
| `int`                  | 8-bit         | standaardwaarde voor numerieke letterlijke waarden                                          |
| `woord`                | 16-bit        | twee ZP-bytes; kunnen worden gebruikt als adres in `poke`/`peek`                            |
| `float`                | 16-bits Q8.8  | hi byte = geheel getal (0–255), lo byte = fractioneel getal                                 |
| ` enkel ` / ` dubbel ` | 5 bytes, RAM  | drijvende-komma (C64 BASIC-formaat, ~9 cijfers) — `dim x als double`; zie *Drijvende-komma* |
| `string`               | wijzer        | ZP-paar → null-terminated PETSCII in codesegment                                            |
| `array(N)`             | N bytes       | byte-elementen; bevindt zich op `$C000+`, niet in ZP.                                       |
| `array_word(N)`        | N×2 bytes     | woord (16-bits) elementen; bevindt zich op `$C000+`, niet in ZP                             |
| `array(R, C, …)`       | ∏dims bytes   | multidimensionaal (rij-hoofdrichting); index `arr[r, c]`                                    |
| `array_word(R, C, …)`  | ∏dims×2 bytes | multidimensionale woordmatrix (rij-georiënteerd)                                            |

#### BASIC-stijl declaraties: `dim … als …`

`dim name as type` is een alternatieve spelling van `var name: type` — dezelfde
opslag, dezelfde code:

```basic
DIM kor AS INTEGER # getekend 16-bits, begint bij 0
DIM nev AS STRING # tekenreeks, begint als ""
DIM fizetes AS DOUBLE # drijvende-kommawaarde, begint bij 0
DIM x, y AS BYTE # meerdere namen, krijgen allemaal hetzelfde type
DIM pont AS INTEGER = 1000, cim AS STRING = "C64" # initialisaties, gemengde typen
```

| `als …`               | Ultiem basistype                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------- |
| `byte`, `int`         | `int` (8-bit, 0–255)                                                                        |
| `integer`             | ondertekend 16-bits (−32768 … 32767) — QBasic INTEGER                                       |
| `woord`               | `woord` (ongesigneerd 16-bit, 0–65535)                                                      |
| ` enkel `, ` dubbel ` | drijvende-komma, 5 bytes in RAM (±2,9·10⁻³⁹ … 1,7·10³⁸, ~9 cijfers) — zie *Drijvende-komma* |
| `float`               | `float` (Q8.8 vaste-kommaweergave — 0–255,99, snel)                                         |
| `string`              | `string`                                                                                    |

- Zonder `= waarde` beginnen getallen bij 0 en tekenreeksen bij `""`.
- `dim a, b as integer` geeft **beide** geeft het type aan (VB.NET-stijl, niet
  QBasic). Slechts één naam mag een initialisator hebben.
- `as` en de BASIC-typenamen zijn contextwoorden, niet gereserveerd — ze blijven
  bruikbaar als namen.
- Niet ondersteund: `als long`, struct-typen (gebruik `var name: TName =
  array(N)`) — compileerfouten.
- Met `--explicit` is een `dim` zonder `as` een fout.
- Stringtoewijzing heeft waardesemantiek: `s = "TEXT"` wijst naar de letterlijke
  waarde, `t = s` en berekende waarden worden gekopieerd naar de eigen buffer
  van `t` (zie *Strings tijdens runtime*). Vóór versie 1.6.3 sloeg `s = "TEXT"`
  na de declaratie een willekeurige byte op in de pointer.

#### Arrays met `dim`: `dim name(u1, u2, …) als type`

```basic
DIM tabla(2, 3) AS INTEGER ' 3 × 4 elementen: tabla(0..2, 0..3)
DIM kocka(1, 2, 3) AS BYTE ' willekeurig aantal dimensies
DIM ar(9) AS DOUBLE ' 10 drijvende-kommawaarden (5 bytes elk)
DIM nevek(4) AS STRING ' 5 strings, die allemaal beginnen met ""
DIM v(9) ' geen AS → byte-array

tabla(2, 3) = 999 ' QBasic-stijl index met ( )
tabla[2, 3] = 999 ' … of de gebruikelijke [ ]
nevek(0) = "ZSOLT"
PRINT tabla(2, 3); " "; nevek(0); " "; ar(1)
```

- Elke grens is de **hoogste index** (BASIC-regel): `dim t(2, 3)` heeft 3 × 4
  elementen. (`var t = array(3, 4)` telt het aantal elementen — dezelfde array.)
- Elementtypen: `byte`/`int` → 1 byte, `integer` (signed) / `word` → 2 bytes,
  `float` → 2-byte Q8.8, `single`/`double` → 5-byte floating point, `string` →
  2-byte pointer. Grenzen moeten compileertijdconstanten zijn. Arrays bevinden
  zich in `$C000-$CFFF` (4 KB); Als ze meer nodig hebben, verplaatst het hele
  arraygebied zich naar `$A000-$CFFF` (12 KB, onder de BASIC ROM — zie
  *Arraygeheugen*). Meer dan 12288 bytes is een compileerfout.
- String-array-elementen beginnen als `""`; `nevek(i) = "TEXT"` / `= s` / `= a +
  b`, `n = nevek(i)`, printing, `+`, passing to a `string` parameter and `input
  nevek(i)` all work (niet-letterlijke waarden worden per element gekopieerd
  naar een slot van 31 tekens).
- `name(i)` indexering werkt ook voor arrays die zijn gedeclareerd met `var a =
  array(…)`.
- Eén array per `dim` groep: `dim a(3) as byte, n as integer` is goed, `dim n,
  a(3) as integer` is een fout. Geen initialisator — gebruik `data name: …`.

### Gereserveerde woorden

De volgende identificatoren zijn **trefwoorden** — ze mogen niet worden gebruikt
als namen voor variabelen, constanten, subroutines, functies, parameters of
labels. Alle overeenkomsten zijn niet hoofdlettergevoelig (`END`, `end`, `End`
botsen allemaal). Het gebruik van een gereserveerd woord als naam leidt meestal
tot een verwarrende fout (een regel zoals `var` wordt stilzwijgend niet
gedeclareerd, of een expressie zoals `for i = 1 to times` wordt `Number(0)`) —
kies daarom een andere naam.

**Declaratie & controlestroom** `var`, `const`, `sub`, `fn`, `type`, `endtype`,
`return`, `call`, `label`, `goto`, `gosub`, `if`, `then`, `else`, `end`,
`select`, `case`, `for`, `next`, `loop`, `times`, `to`, `step`, `while`,
`repeat`, `until`, `break`, `continue`, `inc`, `dec`, `bye`, `exit`, `rem`

**Muziek** `tune` (bloktrefwoord; de regels binnenin - `speed`, `inst`, `order`,
`pat` - zijn niet gereserveerd)

**Typen en typegerelateerd** `int`, `word`, `float`, `string`, `array`,
`array_word`

**Print & I/O** `print`, `spc`, `tab`, `at`, `input`, `chr$`, `str$`, `hex`,
`bin`, `open`, `close`, `load`, `save`, `chain`, `data`, `read`, `include`,
`incbin` (ook `dec` — hierboven vermeld als de decrement-instructie; hetzelfde
token wordt gebruikt voor de `dec(n, width)` print-indeling)

**Ingebouwde wiskundige en tekenreeksfuncties** `abs`, `min`, `max`, `clamp`,
`sgn`, `mod`, `rnd`, `sin`, `cos`, `and`, `or`, `xor`, `not`, `bnot`, `shl`,
`shr`, `len`, `asc`, `val`, `str_to_int`, `numstr`

**Geheugen en timing** `poke`, `peek`, `poke16`, `peek16`, `fill`, `memcopy`,
`drawmem`, `wait`, `raster`, `delay`, `sys`, `asm`

**Scherm & tekst** `cls`, `fast`, `color`, `text`, `border`, `bg`, `screen`,
`cursor`, `lowercase`, `uppercase`, `display`, `on`, `off`, `scroll`, `speed`,
`badlines`, `turbo`

**Bitmap- en blokafbeeldingen** `graphics`, `gcls`, `flip`, `plot`, `plot4`,
`mplot`, `mline`, `mrect`, `mcircle`, `line`, `circle`, `circle4`, `rect`,
`paint`, `erase`, `pen`, `multi`, `block`

**Sprites** `sprite`, `sprdef`, `sprite_frame`, `sprite_x`, `sprite_y`,
`sprhit`, `sprbghit`, `box_hit`, `chardef`, `charset`, `org`, `expand`,
`priority`

**Geluid & muziek** `sid`, `sound`, `sfx`, `volume`, `music`, `play`, `pause`,
`resume`, `stop`

**Invoerapparaten** `getch`, `inkey`, `waitkey`, `joy`, `mouse_x`, `mouse_x_hi`,
`mouse_y`, `mouse_btn`

**Onderbrekingen & vectoren** `irq`, `irq_exit`, `nmi`, `nmi_exit`, `cia_timer`,
`onerr`

**Tekenkaarten en afbeeldingen** `map`, `map_tile`, `map_color`, `koala`,
`show`, `hide`

**REU (RAM-uitbreiding)** `reu`, `reudet`, `stash`, `fetch`

**Stijlvalkuilen — namen die er vrij uitzien, maar toch gereserveerd zijn**

Deze veelvoorkomende Engelse woorden lijken onschuldige identificatoren, maar
worden al door de lexer herkend. Hernoem ze om stille woordafbreking te
voorkomen:

| Gereserveerd                                          | Voorgestelde naamswijziging            |
| ----------------------------------------------------- | -------------------------------------- |
| `end`                                                 | `stop_at`, `finish`, `last`            |
| `stop`                                                | `stop_at`, `halt`                      |
| ` keer `                                              | `telling`, `n`, `iters`                |
| `scherm`                                              | `scraddr`, `screen_addr`               |
| `rand`, `bg`, `text`                                  | `border_addr`, `bg_col`, `text_col`    |
| `klem`                                                | `cap`, `bound`                         |
| `lijn`, `cirkel`, `rechthoek`                         | `ln`, `circ`, `box_r`                  |
| `data`, `read`                                        | `bytes`, `next_byte`                   |
| `laden`, `opslaan`, `openen`, `sluiten`               | `load_file`, ...                       |
| `kaart`, `toon`, `verberg`                            | `tegelkaart`, `onthullen`, `verbergen` |
| `afspelen`, `pauze`, `hervatten`, `stoppen`, `volume` | `speel_liedje`, `vol`                  |
| `int`, `float`, `word`, `string`                      | `n_int`, `speed_f`, `addr`, `msg`      |

Symbolische tokens (`+ - * / = == != < > <= >= : , ; ( ) [ ] # $ % @`) zijn
vanzelfsprekend niet bruikbaar in identificatoren.

### Opmerkingen

```basic
# hash comment
rem this is also a comment
var x = 5  # inline comment
var x = 5 : var y = 6  # colon separates statements on one line
```

### Operators

```basic
x = x + 1
y = a * b - c / 2
z = x en 15 # bitwise AND
w = a of b # bitwise OR
v = a xor b # bitwise XOR
m = x shl 3 # naar links verschuiven
n = x shr 2 # naar rechts verschuiven
r = x modulo 40 # 8-bits modulo (rest); x mod 0 = x, x / 0 = 255
b = bnot x # bitwise NOT: x XOR 255 (complementeer alle 8 bits)
```

Vergelijkingen: `==` `!=` `<` `>` `<=` `>=` (retourneer 1/0)

Rekenkundige code (1.6.0): `*` gedeeld door een constante compileert naar shifts
/ shift-add (`x * 8` → 3× `ASL`), anders naar een shift-add lus van maximaal 8
rondes. `/` en `mod` gedeeld door een macht van twee zijn `LSR` / `AND #(n-1)`,
anders een shift-subtract lus van 8 rondes waarvan de looptijd niet langer
afhangt van het quotiënt. Delen door nul is gedefinieerd: `x / 0 = 255`, `x mod
0 = x` (vóór 1.6.0 liep het vast). `x = x + 1` / `x = x - 1` (en ±2) compileren
naar `INC` / `DEC`.

### Verhogen / Verlagen

```basic
inc x # x = x + 1 (INC zp — enkele instructie)
dec x # x = x - 1 (DEC zp — enkele instructie)
```

Voor `word`-variabelen wordt carry afgehandeld: `inc` gebruikt `INC lo; BNE
skip; INC hi`; `dec` gebruikt `LDA lo; BNE skip; DEC hi; DEC lo`.

### Samengestelde opdrachten

```basic
x += 5 # x = x + 5
x -= 3 # x = x - 3
x *= 2 # x = x * 2
x /= 4 # x = x / 4
x en= 15 # x = x en 15 (bitwise AND)
x of= 64 # x = x of 64 (bitwise OR)
x xor= 255 # x = x xor 255 (bitwise XOR)
x shl= 2 # x = x shl 2
x shr= 1 # x = x shr 1
```

### Afdrukken

```basic
print "HALLO"
print x
print x, y, "tekst"
print # lege regel

print spc(5) # print 5 spaties
print tab(20), "WAARDE" # verplaats cursor naar kolom 20, print dan
print "A", spc(3), "B" # mix vrij

print "A=" + a # tekenreeks + numerieke variabele
print s1 + s2 # twee tekenreeksvariabelen → sequentieel printen
print "Hallo " + "Wereld" # twee letterlijke waarden → compile-time fold
print chr$(13) # print met PETSCII-code
```

### chr$

```basic
print chr$(65) # uitvoer teken met PETSCII-code 65 ('A')
var c = chr$(n) # sla byte-waarde n op in variabele c
print "&gt;" + chr$(42) # bruikbaar in string concat
```

### Vertakking

```basic
als x == 1 dan

print "JA"
anders

print "NEE"
einde
```

### Selecteer / Case

```basic
selecteer x

geval 1:

print "ÉÉN"

geval 2:

print "TWEE"

anders:

print "ANDERE"
einde
```

`select expr` evalueert de expressie eenmaal en vergelijkt deze met elke `case`
waarde in volgorde. De eerste overeenkomende case body wordt uitgevoerd en de
controle springt naar na `end`. De optionele `else:` body wordt uitgevoerd als
er geen overeenkomende case is. Alle waarden moeten 8-bits zijn (0–255).

### Lussen

```basic
lus 5 # getelde lus (5 iteraties)

print "HI"
einde
keer 5 # alias voor lus N ... einde

print "HI"
einde

lus # oneindige lus

x = x + 1

als x == 5 dan doorgaan einde # ga naar de volgende iteratie

als x == 100 dan afbreken einde
einde

var i = 0
voor i = 1 tot 10 # voor..volgende (voorkeur)

als i == 5 dan doorgaan einde # ga naar de volgende stap

print i
volgende

voor i = 0 tot 20 stap 2

print i
volgende i # variabelenaam na 'volgende' is optioneel

voor i = 10 tot 1 stap -1 # aftellen — negatieve constante stap wordt ondersteund

print i
volgende

voor i = 20 tot 0 stap -2 # eindigt correct bij i = 0 (11 iteraties)

print i
volgende i

var i = 0
lus i = 1 tot 10 # oude lus-syntaxis — identieke code

print i
einde
terwijl x &lt; 100

x = x + 1
einde

herhaal # do-while: de body wordt minstens één keer uitgevoerd

x = x + 1
totdat x == 100 # stopt wanneer de voorwaarde waar is
```

**Richtingsregels voor `for`/`loop`:**

| Geval                                                  | Gedrag                                                                                                              |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| `for i = 1 to 10` (standaard `step +1`, `from ≤ to`)   | telt omhoog, standaard                                                                                              |
| `for i = 0 to 20 step 2` (positieve stap, `from ≤ to`) | telt met 2 omhoog                                                                                                   |
| `for i = 10 to 1 step -1` (negatieve constante stap)   | telt af; het lichaam loopt voor i = 10, 9, ..., 1                                                                   |
| `for i = 20 to 0 step -2` (naar nul)                   | Het programma stopt bij i = 0 door de terugloop onder 0 na de verlaging te detecteren; er is geen oneindige lus.    |
| `for i = 10 to 1` (geen stap, `from > to`)             | **compilatiefout**: `for-loop: from (10) > to (1) with default step +1 loops 0 times — use 'step -1' to count down` |

Codestructuur (1.6.0): de lus is *rotated* — `JMP test` (weggelaten wanneer
constante grenzen een eerste doorgang garanderen), de body, `var += step`, dan
de test onderaan die terugspringt naar de body, zodat er geen extra `JMP` per
iteratie is. De stap detecteert 8-bits wrap-around in beide richtingen
(`INC`/`BEQ` of `ADC`/`BCS` bij optellen, `BEQ`/`DEC` of `SBC`/`BCC` bij
aftellen), dus `for i = 0 to 255` wordt 256 keer uitgevoerd en stopt, en `for i
= N to 0 step -k` is altijd eindig. Constante limieten en stappen worden
gebruikt als directe waarden (geen nulpagina); Een niet-constante limiet of stap
wordt eenmaal geëvalueerd en opgeslagen in de permanente nulpagina.

Niet-constante `step`-waarden (bijvoorbeeld van een variabele of expressie)
worden tijdens het compileren als positief behandeld; als u een aftelling met
een runtime-stapwaarde nodig hebt, splits dan de lus of gebruik een
`while`-constructie.

### Labels en ga naar

```basic
label main_loop

x = x + 1

als x &lt; 10 dan ga naar main_loop einde
```

Forward `goto` (label wordt later gedefinieerd) wordt volledig ondersteund.

`gosub label` / `return` springt naar een label en keert terug (JSR / RTS op
machinecodeniveau). Het label moet een `label name` statement zijn, geen `sub` —
het heeft geen parameters en deelt dezelfde zero-page scope. `gosub` ondersteunt
forward references (label gedefinieerd na `gosub`).

```basic
gosub draw_border

...
label draw_border

# ... teken iets ...

return # RTS — keert terug naar de instructie na gosub
```

### Subroutines

```basic
sub greet()

print "HALLO!"

end

sub set_color(col)

color border col
color text col
end

greet() # aanroepen met haakjes
call greet # aanroepen met trefwoord (zonder haakjes)
set_color(6)
```

Parameters worden doorgegeven via speciale zero-page slots. Geen recursie (slots
zijn statisch). Getypte parameters worden ondersteund: `sub draw(x, y:int)` of
`sub copy(src:string)` — tekenreeksparameters ontvangen een pointer van 2 bytes,
zodat de aangeroepen functie de brontekenreeks kan indexeren via `src[i]`.

### Functies (retourwaarden)

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

var s = square(9) # s = 81 — fn call as expression
var c = clamp(joy, 0, 39) # c = clamped value
print add(10, 20) # 30 — usable inline in print
```

Functies ondersteunen een optioneel retourtype `: word` voor 16-bits waarden:

```basic
fn get_addr(): word

return $C000
end

var ptr: word = get_addr() # ptr = $C000
poke ptr, 42 # STA (ptr),Y — geldige indirecte adressering
var v = peek(ptr) # LDA (ptr),Y
```

`fn` wordt in fase 2 uitgezonden (net als `sub`), waardoor de functiebody's
nooit bij het opstarten worden uitgevoerd. Forward references worden volledig
ondersteund.


#### QBasic-stijl `FUNCTION` / `SUB`

```basic
FUNCTIE Negyzet (szam ALS INTEGER) ALS INTEGER
    Negyzet = szam * szam ' retourwaarde = toewijzen aan de functienaam
EINDE FUNCTIE

FUNCTIE Nagyobb (a ALS BYTE, b ALS BYTE) ALS BYTE
    Nagyob = een
    ALS b &gt; a DAN
        Nagyobb = geb
        EXIT FUNCTION ' keer nu terug, met de tot nu toe toegewezen waarde
    EINDE ALS
EINDE FUNCTIE

SUB Koszont (nev AS STRING)
    AFDRUKKEN "Üdvözöllek, "; nooit; "!"
EINDE ONDER

n = Negyzet(30)
Koszont "Zsolt" 'roep zonder haakjes
Koszont("Zsolt") '... of met hen
BEL Koszont("Zsolt")
```

- `function` is een synoniem voor `fn`; `p AS type` werkt in parameterlijsten en
  `AS type` na `)` geeft het retourtype (dezelfde typenamen als `dim`). `: type`
  werkt nog steeds.
- Toewijzen aan de functienaam slaat de waarde op in een verborgen
  `<naam>__result`-variabele die wordt geretourneerd bij `END FUNCTION` / `EXIT
  FUNCTION`; `return expr` werkt ook nog steeds.
- `END SUB`, `END FUNCTION`, `END IF`, `END SELECT` worden geaccepteerd (het
  tweede woord is optioneel); `EXIT SUB` / `EXIT FUNCTION` retourneert (plain
  `exit` is nog steeds `bye`).
- Een sub/fn kan zonder haakjes worden aangeroepen: `Koszont "Zsolt"`, `Rajzol
  x, y`.
- `PRINT a; b; c` — `;` voegt items samen zonder spaties; een afsluitende `;`
  onderdrukt de nieuwe regel. Een `;` gevolgd door een statement (`print x; y =
  1`) scheidt statements nog steeds.
- Geaccentueerde letters in tekenreeksliteralen worden afgedrukt als hun
  basisletter (`ü` → `u`, `ő` → `o`); de C64-tekenset heeft geen accenten.
- Word/float-parameters ontvangen nu beide bytes, en een tekenreeksconstante die
  wordt doorgegeven aan een `string`-parameter werkt (voorheen werkte alleen de
  lo-byte / een tekenreeksvariabele).
- Geen recursie (parameters bevinden zich in statische geheugenruimtes); sinds
  versie 1.6.3 is een recursieve aanroep een compilatiefout in plaats van een
  stilzwijgend onjuist resultaat.

#### Meer QBasic-syntaxis (1.6.3)

De onderstaande QBasic-formulieren compileren naast de originele syntax (`==`,
`end`, `loop`, `#`-commentaren blijven allemaal werken).

```basic
' commentaar (QBasic-stijl, zoals #)
ALS x = 3 DAN PRINT "drie" ' eenregelige IF: geen END IF nodig
ALS x &lt;&gt; 3 DAN PRINT "nee" ANDERS PRINT "ja"
ALS n &lt; 0 DAN

PRINT "negatief"
ANDERS ALS n = 0 DAN

PRINT "nul"
ANDERS

PRINT "positief"
EINDE IF

DO WHILE i &lt; 10 : i = i + 1 : LOOP ' ook DO UNTIL c … LOOP,
DO : i = i - 1 : LOOP UNTIL i = 0 ' DO … LOOP WHILE c, DO … LOOP (eindeloos)
WHILE k &lt;&gt; 5 : k = k + 1 : WEND
VOOR i = 1 TOT 100

ALS i = 12 DAN EXIT VOOR ' EXIT DO / EXIT VOOR / EXIT TERWIJL

VOLGENDE

SELECTEER GEVAL n

GEVAL 1, 2, 3: PRINT "klein"

GEVAL 10 TOT 20: PRINT "tiener"

GEVAL IS &gt; 1000: PRINT "groot"

GEVAL ANDERS: PRINT "anders"
EINDE SELECTEER

EINDE ' beëindigt het programma (het scherm blijft behouden)
```

- **Voorwaarden:** binnen `ALS` / `ANDERSALS` / `TERWIJL` / `TOT` / `LOOP
  TERWIJL|TOT`, een enkele `=` vergelijking. `&lt;&gt;` betekent overal niet
  gelijk (hetzelfde als `!=`).
- **Eénregelige IF:** Een instructie direct na `THEN` maakt een éénregelige IF
  die eindigt met de regel, of met een `end` op dezelfde regel (`if c then x = 1
  end`, zoals eerder). Een meerregelige IF heeft een regelovergang nodig na
  `THEN`. Net als in QBasic behoort alles na `THEN` op die regel tot de IF (`…
  THEN EXIT FOR : NEXT` zou de `NEXT` negeren).
- **`END` op zichzelf:** een `END` die geen blok sluit, beëindigt het programma,
  net als in QBasic. Een overtollige `end` wordt daarom niet langer als fout
  weergegeven.
- **`DO` blokken:** binnen een `DO`, een `LOOP` aan het einde van een regel
  sluit deze af (de originele `loop N … end` / `loop i = … end` lussen werken
  nog steeds binnenin).
- **`SELECT CASE`:** De oude `select x` / `case n:` vorm blijft ongewijzigd.
  `SELECT CASE` wordt verlaagd naar een IF-keten over een verborgen `select__N`
  variabele.

#### Strings tijdens runtime (1.6.3)

```basic
DIM s AS STRING, t AS STRING
s = "Pont: " + pont + "!" ' getallen worden tekst (16-bits, getekend voor INTEGER)
t = s ' een kopie: het later wijzigen van s verandert t niet
s = s + "?"

PRINT LEFT$(s, 4); RIGHT$(s, 2); MID$(s, 7, 3); MID$(s, 7)
PRINT LEN(s + t), VAL("1234") + 1, STR$(pont)
IF s = "ABC" OR t &lt;&gt; "" THEN PRINT "vergelijk met = / &lt;&gt;"
```

- **Buffers:** een tekenreeksvariabele die een berekende waarde krijgt (`+`,
  `links$`, `rechts$`, `midden$`, getallen, een andere variabele) heeft een
  buffer van 80 tekens; langere resultaten worden afgekapt na 80 tekens. Het
  toewijzen van een letterlijke waarde verwijst er nog steeds alleen naar.
- **String arrays:** elementen die een niet-letterlijke waarde krijgen (of
  `input`) krijgen hun eigen 32-byte slot (31 tekens), dus `input nevek(i)` in
  een lus bewaart elke naam.
- **`STR$` / `VAL`:** `STR$` van een 16-bits of getekende waarde heeft geen
  voorloopnullen (`"-42"`). Voor compatibiliteit behoudt `STR$` van een byte de
  3-cijferige vorm (`"007"`). `VAL` leest 16-bits getekende getallen
  (`VAL("1234") + 1` = 1235).
- **Vergelijking:** alleen `=` / `&lt;&gt;` (en `==` / `!=`); er is geen `&lt;`
  / `&gt;` volgorde van strings.

#### Getekend INTEGER, INPUT, DOUBLE (1.6.3)

- **INTEGER is signed:** `DIM x AS INTEGER` is signed 16-bit (−32768 … 32767,
  zoals QBasic): printing, `&lt;` `&gt;` comparisons, `/` (truncats toward
  zero), `ABS`, text conversion, `INPUT` and `FOR` loops through zero (`FOR i =
  3 TO -3 STEP -2`) all follow the sign. `WORD` blijft unsigned 0 … 65535.
  Unaire min werkt overal (`a &lt; -10`, `x * -2`).
- **`FOR` met een 16-bits teller** (`INTEGER` / `WORD`) is een echte 16-bits
  lus. Deze liep vroeger over bij 256, dus `FOR k = 0 TO 300` werd 45 keer
  uitgevoerd.
- **`INPUT`:** in een INTEGER/WORD leest maximaal 6 tekens (met `-` voor
  INTEGER), in een DOUBLE accepteert `12.5` (twee decimalen). `INPUT t(i)` leest
  in een array-element, en `INPUT "prompt"; x` werkt ook.
- **DOUBLE ÷ DOUBLE** is nu exact (`7.5 / 2.5 = 3.00`); voorheen werd alleen het
  gehele deel van de deler gebruikt. DOUBLE × DOUBLE werd al ondersteund.
- **Arrays van meer dan 256 bytes** (`DIM t(200) AS INTEGER`, `DIM g(19, 19)`)
  werken met variabele indexen; de index werd gebruikt om terug te keren naar
  256 en naar het verkeerde element te schrijven.
- **Recursie** (een sub/functie die zichzelf aanroept, direct of via anderen) is
  een compilatiefout. Het compileerde vroeger en gaf onjuiste resultaten terug,
  omdat parameters zich in vaste nulpagina-slots bevinden.

### Arrays

```basic
var scores = array(8) # 8 bytes op $C000

# (alle arrays worden eenmaal bij de start van het programma met nullen gevuld — nieuw in 1.5.7)

scores[0] = 100 # constante index → STA $C000
scores[i] = 99 # variabele index → STA (ptr),Y
var v = scores[i] # LDA (ptr),Y
print scores[2] # inline bruikbaar in print

var moments = array_word(8) # 16 bytes (8×2) op $C000+

moments[0] = $1234 # constante index → STA $C000 (lo), STA $C001 (hi)
moments[i] = $5678 # variabele index → ASL A voor stride; (ptr),Y × 2
var t: word = moments[1] # LDA $C002, LDA $C003
```

**Multidimensionale arrays** (nieuw in 1.5.3)

Arrays kunnen met meer dan één dimensie worden gedeclareerd. Ze worden
**rij-georiënteerd** opgeslagen en geïndexeerd met een door komma's gescheiden
subscriptlijst. De totale grootte is het product van alle dimensies.

```basic
var grid = array(8, 8) # 8×8 = 64 bytes op $C000
grid[1, 0] = 11 # rij 1, kolom 0 → platte index 1*8+0 = 8 → STA $C008
grid[0, 1] = 22 # rij 0, kolom 1 → platte index 1 → STA $C001
grid[r, c] = 33 # variabele → berekent r*8 + c, dan STA (ptr),Y
var v = grid[r, c] # LDA (ptr),Y

var wm = array_word(4, 4) # 4×4 woordarray = 32 bytes
wm[1, 2] = $ABCD # element 1*4+2 = 6 → bytes $C00C/$C00D

const ROWS = 3
const COLS = 5
var m = array(ROWS, COLS) # dimensies kunnen compile-time constanten zijn
```

Bij een rijgeoriënteerde lay-out is de laatste index aaneengesloten: `grid[r,
c]` bevindt zich op `base + r*COLS + c`. Elk aantal dimensies wordt ondersteund
(`array(a, b, c)`). Wanneer elke index een constante is, wordt het adres tijdens
het compileren samengevoegd tot één absolute opslag/laadbewerking; een variabele
index genereert de `row*stride + col` berekening en een geïndexeerde `(ptr),Y`
toegang. Een enkele index in een multidimensionale array is nog steeds
toegestaan en wordt behandeld als een vlakke/lineaire index (`grid[10]`).
Dimensies moeten tijdens het compileren constanten zijn (literalen of `const`s),
en de array moet worden gedeclareerd voordat deze wordt geïndexeerd.

**Structuurtypen (`type ... endtype`, nieuw in 1.5.4)**

Definieer een vaste lay-out van benoemde velden met `type` en wijs vervolgens
een array van instanties toe op dezelfde manier als een reguliere array. Toegang
tot velden gebeurt via `arr[idx].field` en werkt voor zowel constante als
variabele indexen.

```basic
type TEntity

var x: int # 1 byte

var y: int # 1 byte

var hp: word # 2 bytes → elementgrootte = 4
endtype

const N = 8
var enemies: TEntity = array(N) # allocateert N × 4 = 32 bytes op $C000

enemies[0].x = 5
enemies[0].y = 10
enemies[0].hp = $0100
var v = enemies[0].hp # lees terug — LDA $C002 / LDA $C003

var i: int = 2
enemies[i].x = 42 # variabele index → idx * elem_size + offset

# Float-veld (Q8.8 fixed-point)
type TBall

var bx: int # 1 byte

var by: int # 1 byte

var vel: float # 2 bytes Q8.8 → elementgrootte = 4
endtype

var balls: TBall = array(3)
balls[0].vel = 1.5 # slaat Q8.8 op: hi=1, lo=128
var f: float = balls[0].vel # lees float-veld in float-variabele
print balls[0].vel # print "1.50"
```

Regels en beperkingen:

- Veldtypen: `int` (1 byte), `word` (2 bytes LE), `float` (2 bytes Q8.8).
  `string` en geneste `type` velden worden nog niet ondersteund.
- Elementgrootte = som van de veldbreedtes (volgorde van declaratie, geen
  opvulling).
- Opslag bevindt zich op `$C000+` naast reguliere arrays en verschijnt in de
  geheugenkaart als een gewone array van de totale bytegrootte.
- Constante index → `LDA/STA absolute` tijdens compilatie.
- Variabele index → shift-and-add vermenigvuldiging voor `idx * elem_size`,
  vervolgens geïndexeerde `(ptr),Y` toegang. Elementgroottes die machten van
  twee zijn (1, 2, 4, 8, 16) gebruiken kale `ASL A` ketens; andere groottes
  genereren een korte shift-add sequentie via twee tijdelijke nul-pagina bytes.
- Sub-/fn-parameters van een struct-type worden nog niet ondersteund — geef in
  plaats daarvan de array en een index door, bijvoorbeeld `sub move(idx: int)
  ... enemies[idx].x = ...`.
- Standaard veldwaarden (`var fire: int = 2` binnen het type) worden geparseerd
  voor compatibiliteit met het voorstel, maar zijn nog niet geïnitialiseerd op
  het moment van toewijzing.
- Bij een array van het type struct is slechts één index toegestaan;
  multidimensionale struct-arrays worden niet ondersteund (gebruik een berekende
  platte index).

Zie `examples/type_demo.ub`.

### 16-bits (woord) variabelen

```basic
var ptr: woord = $0400 # twee ZP-bytes: lo=$00 hi=$04
poke ptr, 6 # STA (ptr),Y
var v = peek(ptr) # LDA (ptr),Y
```

**16-bits producten (opgelost in 1.5.7).** Een product toegewezen aan een `word`
behoudt alle 16 bits, ook wanneer geen van beide factoren een `word` is:

```basic
var score: word = 0
var level = 3
score += 300 * level # 900 (vóór 1.5.7 werd dit afgekapt tot 8 bits: 44)
score = score + 100 * level
var big: word = 100 * level + 900
```

Sinds versie 1.6.1 geldt dit ook voor sommen binnenin en voor `shl`, en voor
constante vermenigvuldigers boven 255: `py = cy * 8 + fy`, `py = (cy shl 3) +
fy` en `w = cy * 300` behouden alle 16 bits (voorheen werden de somvormen
afgekapt tot 8 bits). Byte-targets behouden 8-bits resultaten.

### Bitmapafbeeldingen

```basic
Graphics on # VIC-II hoge bitmapmodus (320×200, 1bpp); bitmap op $2000
Graphics on multi # VIC-II meerkleurige bitmapmodus (160×200, 2bpp, 4 kleuren/cel)
Graphics off # Terug naar tekstmodus

gcls # Bitmap wissen (vult $2000-$3FFF) + videomatrixkleuren instellen

Plot x, y # Pixel instellen op (x, y); x: 0-319, y: 0-199
Plot erase x, y # Pixel wissen (EN ~masker)
Plot xor x, y # Pixel wisselen (EOR masker) — flikkervrije animatie
Circle x, y, r # Cirkel met middelpunt (x, y) en straal r; knipt punten buiten beeld
lijn x1, y1, x2, y2 # Bresenham-lijn van (x1,y1) naar (x2,y2); x: 0-319, y: 0-199
lijn wissen x1, y1, x2, y2 # pixels langs de lijn wissen (EN ~masker)
lijn xor x1, y1, x2, y2 # pixels langs de lijn wisselen (EOR masker)
rechthoek x1, y1, x2, y2 # rechthoekomtrek tekenen (4 randen); x: 0-319, y: 0-199
rechthoek wissen x1, y1, x2, y2 # rechthoekomtrek wissen (EN ~masker)
rechthoek xor x1, y1, x2, y2 # XOR rechthoekomtrek (EOR masker)
verf x, y # 4-verbonden vulling van (x, y); Vult lege pixels binnen de ingestelde grenzen

kleurpen c # stel de kleur voor de tekening in (0-15); zie hieronder

# ── Meerkleurige bitmap (afbeeldingen op multi, 160×200) ──
mplot x, y, kleur # stel meerkleurige pixel in (x: 0-159, y: 0-199, kleur: 0-3)
mline x1, y1, x2, y2, kleur # meerkleurige lijn
mrect x1, y1, x2, y2, kleur # meerkleurige rechthoekomtrek
mcircle x, y, r, kleur # meerkleurige cirkel
```

Beide `graphics on` varianten schakelen het display uit (`LDA $D011 / AND #$EF /
STA $D011`) tijdens het schakelen van VIC-registers en schakelen het vervolgens
weer in in de doelmodus — dit voorkomt storingen bij het schakelen tussen modi.

`x` kan het volledige bereik van `0–319` zijn. Coördinaten boven 255 worden
automatisch verwerkt (de helper voegt de 9e X-bit toe), dus `plot`, `line`,
`circle` en `rect` bereiken allemaal de rechterrand van het scherm. Gebruik een
`word` variabele wanneer een X-coördinaat groter kan zijn dan 255.

#### Huurlingen tekenen kleur — `color pen`

In de hoge resolutiemodus (320×200) is de kleur **per 8×8 cel**, opgeslagen in
de videomatrix (hoge nibble = voorgrond, lage nibble = achtergrond), niet per
pixel. `color pen c` stelt een permanente voorgrondkleur in (0-15) die `plot`,
`line`, `rect`, `circle` en `paint` in de cel van elke getekende pixel stempelt;
de achtergrondnibble van de cel blijft behouden. Deze kleur blijft van kracht
tot de volgende `color pen`. De standaardwaarde is wit (1), dus programma's die
nooit `color pen` aanroepen, zien er precies hetzelfde uit als voorheen.

```basic
grafische elementen op
gcls
kleurpen 2 # rood
lijn 0, 0, 100, 100
kleurpen 6 # blauw
cirkel 160, 100, 40
weergeven op
```

#### Meerkleurige vormen — `mline` / `mrect` / `mcircle`

In de meerkleurenmodus (`graphics on multi`, 160×200) kiest elke pixel een van
de vier kleurbronnen via een 2-bits waarde (`%00` achtergrond `$D021`, `%01`
scherm hi nibble, `%10` scherm lo nibble, `%11` kleur-RAM). `mplot` stelt een
enkele dergelijke pixel in; `mline`, `mrect` en `mcircle` tekenen vormen op
dezelfde manier — het achterliggende `color` argument is de 2-bits bron (0-3),
en de werkelijke kleuren komen uit het celpalet (scherm / kleur-RAM) precies
zoals bij `mplot`.

```basic
grafische weergave op meerdere
gcls
mcircle 80, 100, 40, 1
mrect 10, 10, 150, 190, 2
mline 0, 0, 159, 199, 3
weergave op
```

`mline`/`mrect`/`mcircle` hergebruiken dezelfde Bresenham-/middelpuntroutines
als hun tegenhangers met hoge resolutie, waarbij elke pixel wordt uitgezet via
`mplot`; punten buiten het scherm (x ≥ 160 of y ≥ 200) worden overgeslagen.

### Dubbel gebufferde bitmap (flikkervrij)

```basic
graphics on double # dubbel gebufferde hoge resolutie bitmap (320×200)
gcls # wist de VERBORGEN achterbuffer
line 0, 0, 319, 199 # alle tekenbewerkingen (plot/lijn/cirkel/rechthoek/schilderen/gcls) gaan naar de achterbuffer
flip # toon de getekende buffer; leid het tekenen om naar de andere buffer
graphics off # terug naar tekstmodus (herstelt VIC bank 0)
```

`graphics on double` bewaart **twee** complete bitmaps met hoge resolutie en
toont alleen voltooide frames, waardoor flikkering wordt geëlimineerd zonder
XOR-trucs — elk frame dat je `gcls` tekent, en vervolgens `flip`.

| Buffer                         | Bitmap  | Videomatrix | VIC bank | `$DD00` lage bits |
| ------------------------------ | ------- | ----------- | -------- | ----------------- |
| A (voorkant, eerst getoond)    | `$2000` | `$0400`     | bank 0   | `%11`             |
| B (achterkant, eerst getekend) | `$6000` | `$4400`     | bank 1   | `%10`             |

* Alle pixelcommando's schrijven via een runtime **tekenbasis** (een byte van
  nul pagina's), waardoor ze automatisch gericht zijn op de buffer die momenteel
  verborgen is.
* `flip` wacht op de ondergrens (raster ≥ 251) voordat de VIC-bank wordt
  omgeschakeld, zodat de omschakeling **zonder scheurvorming** verloopt, en
  richt vervolgens de tekenbasis op de nu verborgen buffer.
* Typische lus: `gcls` → teken het frame → `flip`. Roep `display on` één keer
  aan na de eerste `flip`, zodat de eerste weergegeven buffer al compleet is.

**Vereisten / beperkingen:**
* Alleen voor huur (niet `multi`). Sprites worden niet opgehaald uit de VIC-bank
  van de backbuffer.
* De backbuffer gebruikt `$4000–$7FFF` (matrix `$4400`, bitmap `$6000–$7FFF`),
  dus de machinecode van het programma moet onder `$4400` blijven. De meeste
  demo's zijn slechts een paar KB groot, dus dit gebeurt automatisch; zeer grote
  programma's kunnen geen gebruik maken van dubbele buffering.
* Op een standaard 1 MHz C64 beperkt de per-frame volledige `gcls` (8 KB) de
  framesnelheid; op de Commodore 64 Ultimate verhoog je `speed` voor vloeiende
  animaties met een hoge framesnelheid.

Zie `examples/cube_demo.ub` — een tuimelende 3D-draadmodelkubus die flikkervrij
is weergegeven.

### Blokgrafiek (80×50)

```basic
Graphics on block # 80×50 block-pixelmodus (tekstmodus + aangepaste 4-pixel tekenset @ $2800)
Graphics off # Terug naar tekstmodus
gcls # Blok speelveld wissen: scherm-RAM $0400-$07FF + kleur-RAM $D800-$DBFF

plot4 x, y # Blokpixel instellen op (x, y); x: 0-79, y: 0-49
plot4 erase x, y # Blokpixel wissen op (x, y)
circle4 x, y, r # Cirkel met middelpunt tekenen in blokpixels; beperkt tot 80×50
```

Een grove, lage-resolutiemodus over standaard 40×25 tekst heen gelegd. Een
aangepaste tekenset van 16 tekens, gekopieerd naar `$2800`, codeert een 2×2
kwadrantraster per teken (bit3=TL, bit2=TR, bit1=BL, bit0=BR), waardoor elke
tekstcel 2×2 blokpixels bevat → een effectief raster van 80×50. Er wordt geen
bitmap-RAM gebruikt (`$2000-$3FFF` blijft vrij), waardoor het sneller is dan een
hoge-resolutie bitmap. `plot4` voert een OR-bewerking uit op de kwadrantbit in
de cel, waardoor overlappende pixels zich ophopen; `plot4 erase` wist deze.
`circle4` gebruikt dezelfde blokpixel-helper om een omtrekcirkel te tekenen in
de 80×50 coördinatenruimte. `gcls` wist zowel het scherm- als het kleur-RAM. Zie
`examples/block_demo.ub`.

### Scherm en kleur

```basic
cls # scherm wissen (KERNAL $E544)
cls fast # snel vullen: scherm-RAM + kleur-RAM + HOME

kleur tekst 14 # tekstkleurregister $0286
kleur rand 6 # $D020
kleur achtergrond 0 # $D021
kleur pen 2 # tekenkleur (0-15) voor plot/lijn/rechthoek/cirkel/schilderen

scherm 0, 0, 65 # schrijf teken 65 ('A') naar scherm-RAM op kolom 0, rij 0 ($0400)
scherm 10, 5, ch # kolom 10, rij 5 — kolom/rij kunnen variabelen zijn
scherm 5, 3, 42, 7 # teken 42 op kolom 5, rij 3, kleur 7 (schrijft ook naar kleur-RAM $D800)
scherm x, y, ch, col # alle vier argumenten als variabelen

display on # VIC-display opnieuw inschakelen ($D011) DEN-bit)
display uit # leeg scherm

kleine letters # CHR$(14) → schakel VIC-II over naar kleine letters/hoofdletters
hoofdletters # CHR$(142) → schakel VIC-II terug naar hoofdletters/grafische tekens

cursor 20, 10 # verplaats cursor naar kolom 20, rij 10 (KERNAL PLOT $FFF0)
cursor x, y # kolom van variabele x (0–39), rij van y (0–24)

print op 20, 10, "HALLO" # cursor(20,10) + print in één statement (geen nieuwe regel aan het einde)
print op x, y, "Score:", score # elke combinatie van expressies
print op 0, 0 # alleen positie (geen tekst, geen nieuwe regel)

scroll x 3 # stel horizontale fijne scroll in: $D016 bits 0-2 = 3 (0-7)
scroll y 2 # stel verticale fijne scroll in: $D011 bits 0-2 = 2 (0-7)
scroll x n # waarde kan een variabele of expressie zijn (gemaskeerd tot bits 0-2)
scroll x 7 narrow # stel fijne scroll in en forceer de 38-kolommenmodus (verberg de randkolom)
scroll x 0 wide # stel fijne scroll in en herstel de 40-kolommenmodus
scroll row 12 left # verschuif scherm-RAM rij 12 naar links met één teken
```

`lowercase` genereert `LDA #$0E; JSR $FFD2` tijdens runtime. Stringliteralen die
na `lowercase` worden gecompileerd, krijgen automatisch een andere
hoofdlettergevoeligheid — hoofdletters in de broncode worden opgeslagen in de
PETSCII-sleuf voor kleine letters (`$61+`) en kleine letters in de broncode in
de sleuf voor hoofdletters (`$41+`) — dus `"Hello World"` wordt weergegeven als
**Hello World** op het scherm. `uppercase` genereert `LDA #$8E; JSR $FFD2` en
keert terug naar directe mapping. `cls` reset de tekensetmodus **niet**.

`scroll x n` schrijft `(n AND 7)` naar bits 0-2 van `$D016` (bits 3-7 blijven
behouden). `scroll x n narrow` schrijft de fijnscrollbits en wist bit 3 van
`$D016` (38-kolomsmodus). `scroll x n wide` schrijft de fijnscrollbits en stelt
bit 3 van `$D016` in (40-kolomsmodus). `scroll y n` schrijft `(n AND 7)` naar
bits 0-2 van `$D011` (bits 3-7 blijven behouden). `scroll row R left` verschuift
één constante schermrij naar links; schrijf het nieuwe meest rechtse teken met
`screen 39, R, ch`. Handig voor soepel scrollen met hardware: verlaag elke frame
van 7 naar 0, verschuif het scherm-RAM, reset naar 7.

`screen col, row, char [, color]` schrijft rechtstreeks naar het scherm-RAM
(`$0400 + row*40 + col`) en optioneel naar het kleur-RAM (`$D800 + row*40 +
col`). Constante col/row: adres berekend tijdens compilatie.

### Ultimate 64 — CPU-snelheid

```basic
snelheid 4 # CPU instellen op 4 MHz (leest $D031, werkt bits 0-3 bij, schrijft terug)
snelheid 48 # 48 MHz (maximale snelheid op U64)
snelheid max # hetzelfde als snelheid 48 (alias)
snelheid uit # terug naar 1 MHz (alias voor snelheid 1)

badlines aan # badline timing inschakelen ($D031 bit 7 = 0, standaard C64-gedrag)
badlines uit # badline timing uitschakelen ($D031 bit 7 = 1, meer CPU-cycli)

var t = turbo() # 1 als turbo actief is (bits 0-3 van $D031 != 0), 0 als op 1 MHz
```

Beschikbare MHz-waarden: `1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 20, 24, 32, 40,
48`. Constante waarden worden tijdens het compileren naar beneden afgerond naar
de dichtstbijzijnde beschikbare snelheid. Variabele waarden worden behandeld als
een ruwe snelheidsindex (0-15) en gecombineerd met bits 0-3 van `$D031`.

| $D031 index | MHz (U64) | MHz (U64 Elite-II) |
| ----------- | --------- | ------------------ |
| 0           | 1         | 1                  |
| 3           | 4         | 4                  |
| 6           | 8         | 10                 |
| 11          | 20        | 24                 |
| 15          | 48        | 64                 |

Vereist dat **U64 Turbo Control** is ingesteld op `U64 Turbo Registers` of
`Turbo Enable Bit` in het U64-configuratiemenu. Op een gewone C64 of emulator
zonder dit register worden de waarden `poke` tot en met `$D031` stilzwijgend
genegeerd.

### Toetsenbord

```basic
var key = getch() # wacht op $FFE4 totdat er een toets wordt ingedrukt; retourneert de PETSCII-code
var k = inkey() # niet-blokkerend: retourneert de PETSCII-code, of 0 als er geen toets is ingedrukt
waitkey # wacht totdat er een toets wordt ingedrukt (CIA1 matrixscan; werkt tijdens IRQ)
var k = waitkey() # hetzelfde, maar retourneert de ruwe $DC01 kolombits (0 bit = toets ingedrukt)
var j = joy(2) # lees joystickpoort 2; retourneert geïnverteerde bits 0-4
var j = joy(1) # lees joystickpoort 1

# bit0=omhoog(1) bit1=omlaag(2) bit2=links(4) bit3=rechts(8) bit4=vuren(16)
var mx = mouse_x() # 1351 muis: geaccumuleerde X-positie (helper: lading+vertraging+delta)
var my = mouse_y() # 1351 muis: geaccumuleerde Y-positie (EOR #$FF geïnverteerd)
var mb = mouse_btn() # muisknoppen: leest $DC01 — bit0=links (vuren), bit1=rechts (omhoog-pin)
```

`mouse_x()` / `mouse_y()` voeren intern een hulpsubroutine uit die het volgende
afhandelt: het opladen van de CIA1 `$DC00` condensator, een vertraging van
ongeveer 516 cycli, het uitlezen van het SID POT X/Y-register (`$D419`/`$D41A`),
de berekening van de getekende 7-bits delta, de inversie van de Y-as `EOR #$FF`
en het bijhouden van de geaccumuleerde positie (permanente ZP-status, 8 bytes).
De hulpsubroutine bemonstert de POT twee keer per frame. `mouse_y()` roept de
hulpsubroutine **niet** aan (alleen `mouse_x()` doet dat) — deze leest alleen de
in de cache opgeslagen `accum_y` om dubbele updates te voorkomen.

De helper onderhoudt een 9-bits X-accumulator (`accum_x` + `accum_x_hi` met
carry/borrow). Gebruik `var sx: word = mouse_x()` — de compiler slaat zowel de
lage als de hoge bytes op, zodat de opdracht `sprite` `$D010` correct verwerkt
voor X-posities voorbij 255.

De helper slaat zijn status op in ZP (`$02`–`$09`). De init-vlag moet nul zijn
vóór de eerste aanroep — zet het gebied met `fill $02, 7, 0` vroeg in je
programma op nul. Schakel ook CIA1-interrupts uit (`poke $DC0D, $7F`) om te
voorkomen dat de KERNAL IRQ `$DC00` aanraakt tijdens het scannen van het
toetsenbord — dat verstoort de POT-uitlezing.

Zie `examples/mouse_demo.ub` voor een werkende demo van de 1351-muis met
sprite-tracking en knopfeedback.

### Uitgang

```basic
bye # JSR $E544 (scherm wissen), STOP-vlag wissen, RTS naar BASIC
exit # alias voor bye
```

### Timing

```basic
wait 50 # wacht 50 raster-lijnovergangen (~3,2 ms)
wait raster 100 # spin tot $D012 == 100 (raster-split effecten)
delay 1 # wacht 1 PAL-frame (1/50 s ≈ 20 ms)
delay 20 # wacht 20 frames ≈ 0,4 s; n kan een variabele zijn (0–255)
```

`delay N` telt N complete PAL-frames met rasterlijn 200 als framegrens.

### SID-geluid

```basic
geluid 0, $1CAD, 25 # stem 0, freq $1CAD (≈ middelste C PAL), duur 25 frames
geluid 1, freq_woord, 50 # stem 1, freq uit woordvariabele, 50 frames (1 s op 50 Hz)
geluid 2, 0, 0 # stem 2, stilte

sid volume 15 # hoofdvolume volledig ($D418 = $0F); bereik 0-15
sid volume 0 # stilte (hoofdvolume = 0)
sid stop # alle 25 SID-registers op nul zetten ($D400–$D418) — volledige stilte
```

`sound <channel>, <freq>, <duration>` — duur in PAL-frames (1/50 s elk). `sound`
**blokken**: het programma wacht tot de noot is afgelopen (gebruik `sfx`
hieronder in een gameloop). Vaste ADSR: attack/decay `$09`, sustain/release
`$F0`, zaagtandgolfvorm. Hoofdvolume `$D418` altijd ingesteld op `$0F`.

*Opgelost in 1.5.7:* de wachtlus bekeek rasterlijn 0, die `$D012` (alleen de
lage 8 bits) twee keer per frame weergeeft (lijnen 0 en 256), waardoor elke noot
**half** zo lang duurde als gevraagd — en twee vertakkingen werden over hun
opcode heen gepatcht, waardoor het programma crashte voor elke duur anders dan
0. `sound` wacht nu op rasterlijn 200 precies zoals `delay`.

`sid volume N` schrijft N naar `$D418`. Bits 0-3 = volume (0-15), bits 4-7 =
filtermodus. `sid stop` genereert een 10-byte nulopvullingslus — sneller dan 25
afzonderlijke prikbewegingen.

### Niet-blokkerende geluidseffecten (`sfx`) — nieuw in 1.5.7

```basic
sound 0, $2000, 25 # BLOKKEN: het programma wacht hier 25 frames
sfx 0, $2000, 25 # keert direct terug; de noot vervaagt vanzelf
sfx 1, $0500, 8, 128 # optionele golfvorm: 16 driehoek, 32 zaagtand (standaard), 64 puls, 128 ruis
sfx 0, freq_word, 4, 16 # freq kan een constante, een woordvariabele of een 8-bits expressie zijn
```

`sfx <channel>, <freq>, <frames> [, <wave>]` programmeert één SID-stem en keert
onmiddellijk terug, dus het is veilig binnen een gameloop. Er is geen gate-off
timer: de envelope is ingesteld op attack 0 / sustain 0 / release 0 en de
**decay** wordt tijdens het compileren gekozen uit `frames` (1 frame = 20 ms,
dichtstbijzijnde SID-vervaltijd: 6, 24, 48, 72, 114, 168, 204, 240, 300, 750,
1500, 2400 ms ...), dus de noot sterft ongeveer in die tijd uit. Het triggert de
stem opnieuw bij elke oproep (gate uit, dan aan) en stelt het mastervolume in
`$0F`. `channel` (0-2), `frames` (1-255) en `wave` moeten
compileertijdconstanten zijn.


### SID Muziek

```basic
load sid "tune.sid" # Sluit de SID-muziek in op het oorspronkelijke laadadres
load sid "tune.sid", $2000 # overschrijven: sluit in op $2000 ongeacht de SID-header
```

`load sid` leest een PSID- of RSID-bestand tijdens **het compileren**,
verwijdert de header en voegt de onbewerkte muziekbytes toe aan de uitvoer
`.prg`. Na `load sid` worden twee compileertijdconstanten beschikbaar:

| Constante  | Beschrijving                                                                           |
| ---------- | -------------------------------------------------------------------------------------- |
| `sid_init` | Adres van de initialisatieroutine — eenmaal aanroepen met A = songnummer (0-gebaseerd) |
| `sid_play` | Speel routineadres af — roep elke frame (50 Hz PAL) aan vanuit een IRQ-handler         |

Beide constanten werken overal waar een constant adres wordt geaccepteerd:
`sys`, `irq`, `poke`, expressies.

**Typisch gebruik:**

```basic
laad sid "music.sid"

sub music_irq()

poke $D019, $FF # Bevestig VIC raster IRQ

sys sid_play # Ga één frame verder met de muziek

irq_exit # JMP $EA81: herstel A/X/Y + RTI (correcte IRQ-uitgang)
end

sys sid_init, 0 # Initialiseer SID-chip: A=0 → eerste sub-tune
irq music_irq, $C0 # Raster IRQ op lijn $C0 → 50 Hz op PAL

sid volume 15 # Hoofdvolume aan
```

**Opmerkingen:**
- De SID-gegevens worden **na** alle gegenereerde code geplaatst en aangevuld
  met nullen tot aan het laadadres. De compiler waarschuwt als het laadadres van
  de SID de gegenereerde code zou overlappen.
- PSID v1 en v2 worden ondersteund. Als het laadadres van de SID-header 0 is,
  worden de eerste twee databytes als adres gebruikt (PRG-stijl, little-endian).
- Slechts één `load sid` per programma is relevant (de laatste wint).

### Tracker-tunes (`tune`)

```basic
tune # optioneel: afstemmen op $C800 (standaard $8000)

snelheid 6 # frames per rij (50 Hz PAL)

inst 0, $41, $09, $F0, $0800, $0064, $27, $1F

inst 1, $10, $08, $A8, $0400, $0000, $00, $0F
imod 0, 6, 3, 9, 40, $0200, $0E00 # vibrato + pulsbreedtemodulatie (1.6.2)
ifilt 0, $0500, 20, 1 # cutoff sweep omhoog naar $500, heen en weer (1.6.2)
igate 1, 2, 1, $09 # gate timer, harde herstart, eerste frame $09 (1.6.2)
itab 1, 2, 0, ".. +0", ".. +4", ".. +7" # arpeggiotabel (1.6.2)
volgorde 0, 1, 0 # patroonvolgorde (patronen kunnen zich herhalen)
pat 0, 0, "C-4 00", "...", "E-4 00 V24", "...", "G-4 00", "... .. C00"
pat 0, 1, "C-2 01", "...", "...", "...", "G-2 01 F03"
pat 1, 0, "G-4 00", "...", "E-4 00", "...", "C-4 00"
einde
muziek afspelen # of: sys sid_init / irq handler roept sys sid_play aan
```

`tune ... end` beschrijft een 3-stemmige tracker-tune in platte tekst (dezelfde
celnotatie die de Visual Assembler SID-editor laat zien) en bouwt de speler
**tijdens het compileren**. Het definieert `sid_init` / `sid_play` precies zoals
`load sid`, dus `music play`, `music stop`, `music pause` en `music resume` (en
een handmatige `irq` handler die `sys sid_play` aanroept) werken ongewijzigd.

| Lijn                                                               | Betekenis                                                                                                                                                                                                                                                                                                                                                                             |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `snelheid N`                                                       | Frames per trackerrij (1-255).                                                                                                                                                                                                                                                                                                                                                        |
| `inst id, ctrl, ad, sr, pw, cutoff, resfilt, modevol`              | Eén instrument: controleregister (golfvormbits plus ringmodulatie `$04` / sync `$02`; de gate-bit wordt door de speler toegevoegd), attack/decay, sustain/release, 12-bits pulsbreedte, 11-bits filtercutoff, resonantie-/filterrouteringsbyte (`$D417`-stijl: elke routeringsbit = routeer de stem die dit instrument bespeelt) en modus-/volumebyte (`$D418`-stijl, bit 7 = 3 UIT). |
| `imod id, vibdelay, vibspeed, vibdiepte, pwmspeed, pwmmin, pwmmax` | (1.6.2) Instrumentvibrato: na `vibdelay` frames wordt een driehoekige LFO geactiveerd die elke `vibspeed` frames (1-15, 0 = uit) draait, diepte 0-15 (geschaald naar de halve toon van de noot). Pulsbreedtemodulatie: `pwmspeed` wordt per frame toegevoegd (0 = uit), stuiterend tussen `pwmmin` en `pwmmax`.                                                                       |
| ` filter id, cutend, sweep, pingpong`                              | (1.6.2) Filter cutoff sweep: van de `inst` cutoff naar `cutend` door `sweep` (0-127) per frame; `pingpong` 1 = heen en weer.                                                                                                                                                                                                                                                          |
| `igate id, gatetimer, hardrestart, firstwave`                      | (1.6.2) De gate wordt vrijgegeven `gatetimer` frames vóór de volgende noot op de stem (houd deze onder `speed`); `hardrestart` 1 zet ADSR dan ook op 0. `firstwave` (bijv. `$09` = test + gate) wordt geschreven op het eerste frame van de noot.                                                                                                                                     |
| `itab id, snelheid, lus, "stap", ...`                              | (1.6.2) Golf-/arpeggiotabel, tot 32 stappen: `"WW +n"`, `".. -n"` of `"WW =n"` - golfvorm in hexadecimaal (`..` behoudt deze) en een nootverschuiving in halve tonen of een absolute noot (`=60`). Eén stap elke `snelheid` frames, dan terug naar stap `lus` (255 = blijf op de laatste stap).                                                                                       |
| `order p, p, ...`                                                  | Patroonvolgorde. Lijnen stapelen zich op, tot 255 stappen.                                                                                                                                                                                                                                                                                                                            |
| `pat p, v, "cel", ...`                                             | Maximaal 32 rijen voor stem `v` (0-2) van patroon `p` (0-7). Ontbrekende rijen zijn leeg.                                                                                                                                                                                                                                                                                             |

Een **cel** is `NOTE INST FX`: `C-4`, `D#3`, `Eb2` of `...` voor geen noot, een
twee-cijferig hexadecimaal instrument (`..` om het zo te laten), en een
optioneel effect - `Vxy` vibrato (x = rijen vasthouden, y = diepte), `Uxx` /
`Dxx` omhoog/omlaag schuiven, `C` noot afsnijden, `Fxx` snelheid instellen. Een
cel die alleen een effect bevat, kan worden geschreven als `"... .. F06"` of
gewoon `"F06"`.

Opmerkingen over de speler:

- Alle spelersstatus bevindt zich **inside the blob** (absolute adressering) -
  het gebruikt geen nulpagina, dus het kan niet botsen met
  UltimateBasic-variabelen of tijdelijke gegevens, en het blijft werken wanneer
  het programma terugkeert naar BASIC.
- Elke frame (1.6.2) voert de speler de golf-/arpeggiotabel, vibrato,
  pulsbreedtemodulatie en gatetimer/harde herstart van elke stem uit, evenals de
  cutoff-sweep van de stem die als laatste een filter-gerouteerd instrument
  startte (deze stem beheert de cutoff, resonantie en modus van het filter;
  `$D417` routeert elke stem waarvan het huidige instrument filter-gerouteerd
  is). Het is hetzelfde algoritme als de geëxporteerde speler en preview van de
  Visual Assembler SID-editor, frame voor frame.
- De blob wordt op een vast adres geplaatst (standaard `$8000`, of `tune op
  $addr`) en de `.prg` wordt aangevuld tot dat adres, zoals `load sid`. Houd het
  uit de buurt van je code, arrays (`$C000+`) en eventueel
  bitmap-/charsetgeheugen. Een tune heeft ongeveer 2,5 KB plus 12 bytes per
  rij-kolom aan gegevens nodig.
- Maximaal 8 patronen (32 rijen elk); de volgordelijst kan ze vrij herhalen.
- `music play` gebruikt de CIA1-timer op 50 Hz; combineer dit niet met een
  andere `load sid`/`tune` (de laatste wint).

### Muziek afspelen

`muziek afspelen/stoppen/pauzeren/hervatten` is een alternatief op hoog niveau
voor de handmatige `sys sid_init` / `cia_timer`-configuratie. Vereist een
voorafgaande `load sid`-instructie of een `tune ... end`-blok (beide definiëren
`sid_init` / `sid_play`).

```basic
laad sid "tune.sid" # SID-bestand insluiten (definieert sid_init / sid_play)

muziek afspelen # sub-tune 0 initialiseren + CIA1 50 Hz IRQ starten
muziek afspelen 1 # starten vanaf sub-tune 1 (nummer 0-gebaseerd)
muziek stoppen # afspelen stoppen + alle 25 SID-registers (D400-D418) op nul zetten
muziek pauzeren # CIA1 timer A IRQ uitschakelen (muziek bevriest, SID ongewijzigd)
muziek hervatten # CIA1 timer A IRQ weer inschakelen (vervolgt vanaf pauze)
```

| Stelling              | Effect                                                                                                |
| --------------------- | ----------------------------------------------------------------------------------------------------- |
| `muziek afspelen [n]` | roep `sid_init(n)` aan, configureer CIA1 timer A op 19.656 cycli (~50 Hz PAL), installeer IRQ wrapper |
| `muziek stopt`        | CIA1 IRQ uitschakelen + alle 25 SID-registers op nul zetten                                           |
| `muziek pauze`        | CIA1 IRQ uitschakelen (SID-uitvoer blijft bevroren)                                                   |
| `muziek hervatten`    | CIA1 IRQ opnieuw inschakelen (vervolg vanaf pauzepunt)                                                |

De IRQ-wrapper (die eenmalig aan het einde van het programma wordt uitgezonden)
doet het volgende: ACK CIA1 timer A → `JSR sid_play` → `JMP $EA81`.

### Elfjes

```basic
sprite 0, x, y, $2000 # sprite 0: stel X- en Y-positie en datapointers in
sprite 0, x, y # zonder datapointers (behoudt bestaande)
sprite on 0 # schakel sprite 0 in ($D015 |= bit0)
sprite off 0 # schakel sprite 0 uit ($D015 &amp;= ~bit0)
sprite color 0, 7 # kleur van sprite 0 = geel ($D027)
sprite multicolor 0, on # schakel meerkleurige modus in voor sprite 0 ($D01C |= bit0)
sprite multicolor 0, off # schakel meerkleurige modus uit ($D01C &amp;= ~bit0)
sprite expand x 0, on # dubbele breedte ($D01D |= bit0)
sprite expand x 0, off # normale breedte ($D01D &amp;= ~bit0)
sprite expand y 0, on # dubbele hoogte ($D017 |= bit0)
sprite expand y 0, off # normale hoogte ($D017 &amp;= ~bit0)
sprite priority 0, on # achter de achtergrond ($D01B |= bit0)
sprite priority 0, off # voor de achtergrond ($D01B &amp;= ~bit0)
var h = sprite_hit() # sprite-sprite botsing ($D01E, gewist bij lezen)
var b = sprite_bg_hit() # sprite-achtergrond botsing ($D01F, gewist bij lezen)
var x = sprite_x(0) # lees sprite 0 X-positie (lo byte, $D000)
var y = sprite_y(0) # lees sprite 0 Y-positie ($D001)
sprite_frame 0, $2000 # selecteer één statische sprite-afbeelding
sprite_frame 0, $2000, frame # selecteer een animatieframe uit een frame-sequentie
```

X ondersteunt het volledige 9-bits bereik (0–319): gebruik een `word` variabele
voor runtime-waarden > 255. Sprite-datapointer: `data_addr` moet 64-byte
uitgelijnd zijn; opgeslagen als `addr >> 6` op `$07F8+id`.

#### Sprite-animatie met `sprite_frame`

`sprite_frame` is het commando dat wordt gebruikt om de weergegeven afbeelding
van een sprite tijdens een animatie te wijzigen. Het wijzigt alleen de
datapointers van de sprite; het verplaatst de sprite **niet**, activeert hem
niet en zorgt er ook niet voor dat frames automatisch worden doorgeschoven.

Sla de animatiebeelden achter elkaar op, waarbij elk spritebeeld van 63 bytes
één 64-byte-uitgelijnde sleuf inneemt. Geef het nulgebaseerde animatieframe door
als derde argument:

```basic
sprite_frame sprite_id, first_frame_address, frame_number
```

Bijvoorbeeld, met een basisadres van `$2000`, gebruikt frame 0 `$2000`, frame 1
`$2040`, frame 2 `$2080`, enzovoort. Het programma regelt de timing en de
overgang van de animatie:

```basic
var frame = 0
loop

sprite_frame 0, $2000, frame

frame = frame + 1

if frame == 4 then frame = 0 end

delay 5
end
```

De vorm met twee argumenten, `sprite_frame id, address`, selecteert eenvoudigweg
één statische sprite-afbeelding en blijft achterwaarts compatibel. De positie
van de sprite wordt nog steeds bepaald door `sprite id,x,y`.

### Botsing tussen begrenzingskaders in software

```basic
var touching = box_hit(left1, top1, right1, bottom1,

left2, top2, right2, bottom2)
```

`box_hit()` voert een as-uitgelijnde begrenzingsbox-test (AABB) uit en
retourneert `1` wanneer de twee rechthoeken elkaar overlappen of raken, anders
`0`. In tegenstelling tot `sprite_hit()` en `sprite_bg_hit()` leest of wist deze
functie geen VIC-II-botsingsregisters. De acht argumenten zijn willekeurige
8-bits expressies, dus de begrenzingsboxen kunnen kleiner zijn dan de zichtbare
sprite-afbeelding of kunnen niet-sprite-gameobjecten beschrijven. Coördinaten
zijn inclusief; behoud `left <= right` en `top <= bottom`.

### Sprite definitie

```basic
sprdef 0
  $00,$3C,$00, $00,$FF,$00, $03,$FF,$C0, $07,$FF,$E0,
  $0F,$FF,$F0, $0F,$FF,$F0, $1F,$FF,$F8, $1F,$FF,$F8,
  $1F,$FF,$F8, $0F,$FF,$F0, $0F,$FF,$F0, $07,$FF,$E0,
  $03,$FF,$C0, $00,$FF,$00, $00,$3C,$00, $00,$00,$00,
  $00,$00,$00, $00,$00,$00, $00,$00,$00, $00,$00,$00,
$00, $00, $00
einde
```

`sprdef id ... end` voegt 63 spritebytes in op het eerstvolgende adres in het
codesegment dat is uitgelijnd met 64 bytes, genereert een `JMP` eroverheen en
stelt automatisch `$07F8+id = data_addr >> 6` in. Om dezelfde vorm voor meerdere
sprites te gebruiken, lees je de pointer terug:

```basic
var pg = peek($07F8) # pointer ingesteld door sprdef 0
poke $07F9, pg # kopiëren naar sprites 1–7
```

### Tekentegelkaarten (`.ubmap`)

```basic
map load "levels/world.ubmap"
map load "level.bin", $4000 # Level Editor-project, data op $4000 (1.6.1)
map draw map_x, map_y # teken een viewport van 40x25 naar scherm/kleur-RAM
map view px, py # vloeiende dubbelgebufferde weergave op pixel px, py (1.6.1)

var tile = map_tile(x, y) # lees tekencode van de kaart
map set x, y, 42 # verander tekencode in beschrijfbare kaartgegevens
var shade = map_color(x, y) # lees celkleur (0 wanneer de kaart geen kleurgegevens heeft)
map color x, y, 7 # verander celkleur wanneer kleurgegevens aanwezig zijn
```

`map load` lost de bestandsnaam op ten opzichte van het `.ub` bronbestand,
valideert deze tijdens het compileren en slaat de teken- en optionele
kleurarrays ervan op in het beschrijfbare programmageheugen. Een latere `map
load` vervangt de actieve kaart voor volgende kaartopdrachten.

`map load` accepteert ook een VisualAssembler `me-map` `.bin` export direct:

```basic
kaart laden "map-multicolor.bin"
```

De eerste 1000 bytes vormen de 40×25 tekenkaart en de volgende 1000 bytes worden
celkleuren. De meerkleurenmodus en `$D021-$D023` worden gelezen uit de
VisualAssembler-metadatatrailer, dus er is geen `.ubmap`-conversie nodig.

**Level Editor-projecten (nieuw in 1.6.1).** `kaart laden` leest ook een
VisualAssembler Level Editor-project (`Level opslaan (.bin)`) en combineert de
schermen tot één kaart: een level van W×H schermen wordt een (W·40)×(H·25) kaart
met kleuren, lege plekken zijn ruimtes. Kaarten zijn beperkt tot 255×255 cellen,
dus een level kan maximaal 6 schermen breed en 10 hoog zijn.

```basic
kaart laden "level.bin" # 2x5 schermen -&gt; één kaart van 80x125
```

**Plaatsen van de kaartgegevens (nieuw in 1.6.1).** `map load "file", addr`
slaat de kaart op een vast adres op in plaats van inline in de code, zoals
`incbin "file", addr` (het adres moet boven de gegenereerde code staan of binnen
een `org` gap). Tekens komen eerst, kleuren volgen:

```basic
kaart laden "level.bin", $4000 # 80x125 kaart: tekens $4000-$6713, kleuren $6714-$8E1F
```

#### Vloeiend scrollen — `kaartweergave` (nieuw in 1.6.1)

```basic
kaart laden "level.bin", $4000
var px: woord = 0
var py: woord = 0
loop

kaartweergave px, py # eenmaal per frame, in plaats van `wacht raster`

# lees de joystick, verander px / py, spellogica ...
einde
```

`kaartweergave x, y` toont de kaart op pixelpositie `x, y` (woorduitdrukkingen;
`0..(breedte-40)*8` en `0..(hoogte-25)*8`, waarden buiten het bereik worden
begrensd). Roep deze functie één keer per frame aan: hij wacht op de framegrens
(rasterlijn 250), toont de positie die door de vorige aanroep is gegeven en
neemt vervolgens de nieuwe positie, zodat een positie één frame later
verschijnt.

Hoe het werkt: het fijne gedeelte gebruikt XSCROLL / YSCROLL in `$D016` /
`$D011` met 38 kolommen en 24 rijen (de ingescrollde rand blijft verborgen); de
tekenstappen wisselen twee schermbuffers, `$0400` en `$3C00`. De positie wordt
twee frames vooruit voorspeld en de verborgen buffer wordt in twee helften
opgebouwd voor de volgende tekencel voordat de weergave daar aankomt, zodat de
wisseling nooit hoeft te wachten. Kleur-RAM kan niet dubbel gebufferd worden: de
bovenste helft wordt gekopieerd in het laatste oude frame achter de
rasterstraal, de onderste helft direct na de wisseling ervoor (beide met
interrupts gemaskeerd voor een paar rasterlijnen), zodat er geen scheurtjes
ontstaan. Een richtingsverandering precies tijdens een tekenstap kan de weergave
één of twee frames vasthouden terwijl de buffer opnieuw wordt opgebouwd.

Regels:

- De programmacode en inline data moeten buiten `$3C00-$3FFF` (tweede buffer)
  blijven; laad grote maps met een adres (`map load "file", $4000`), anders
  stopt de compilatie met een fout.
- De eerste `kaartweergave` tekent de hele weergave in `$0400`. Daarna behoort
  het scherm tot `kaartweergave`: `print` / `scherm` / `cls` schrijven `$0400`
  alleen en worden overschreven.
- Sprites werken zoals gebruikelijk: `map view` kopieert de spritepointers
  `$07F8-$07FF` naar `$3FF8-$3FFF` elke frame, zodat `sprdef` / `sprite_frame`
  in beide buffers worden weergegeven. Bewaar spritegegevens in VIC-bank 0
  (`$0000-$3FFF`, niet `$1000-$1FFF`), bijvoorbeeld door `sprdef` vóór een grote
  inline `map load` te plaatsen.
- De charset-bits van `$D018` blijven behouden (`charset on` werkt); de
  multicolor-bit van `$D016` blijft behouden omdat `map load` deze heeft
  ingesteld.
- Laat ongeveer 6000 cycli (~95 rasterlijnen) aan spellogica per frame over; een
  langer frame zorgt ervoor dat het beeld een frame lang behouden blijft, maar
  nooit vervormt.
- Voorbeeld: `examples/level_scroll_demo.ub` (gestuurd met een joystick, met een
  speler-sprite).

`map draw map_x, map_y` kopieert een 40×25 viewport, beginnend bij de opgegeven
kaartcel, naar scherm-RAM `$0400` en, indien aanwezig, kleur-RAM `$D800`. De
kaart moet de volledige gevraagde viewport bevatten: behoud `map_x <= width-40`
en `map_y <= height-25`. Coördinaten en afmetingen zijn momenteel 8-bits
(0–255).

Normale kaarten wissen de meerkleurige bit van de tekst in `$D016`. Meerkleurige
kaarten stellen deze in en laden hun drie globale kleuren in `$D021`, `$D022` en
`$D023`. Tekenkaarten bevatten tekencodes, geen charsetpixels; combineer ze met
`charset`/`chardef` of een andere methode voor het laden van de charset. In de
meerkleurige tekstmodus selecteren celkleuren 8-15 meerkleurige tekens volgens
de VIC-II-regels.

#### UBMP versie 1 binair formaat

Alle multibyte-gehele getallen zijn little-endian:

|  Offset |           Maat | Betekenis                                                               |
| ------: | -------------: | ----------------------------------------------------------------------- |
|       0 |              4 | ASCII magie `UBMP`                                                      |
|       4 |              1 | Versie, momenteel `1`                                                   |
|       5 |              1 | Vlaggen: bit 0 = kleurenarray aanwezig, bit 1 = meerkleurige tekstmodus |
|       6 |              2 | Kaartbreedte, 1–255 cellen                                              |
|       8 |              2 | Kaarthoogte, 1–255 cellen                                               |
|      10 |              1 | Achtergrond 0 (`$D021`), lage nibble gebruikt                           |
|      11 |              1 | Meerkleurig 1 (`$D022`), lage nippel gebruikt                           |
|      12 |              1 | Multicolor 2 (`$D023`), lage nibble gebruikt                            |
|      13 | breedte×hoogte | Rijhoofdtekencodes                                                      |
| volgend | breedte×hoogte | Optionele rij-georiënteerde kleurnibbles wanneer vlagbit 0 is ingesteld |

Een UBMP-bestand moet exact de lengte hebben die in de header wordt aangegeven.
Ongeldige magic-, versie-, dimension- of lengtewaarden leiden tot een
compileerfout.

### Koala Painter afbeelding importeren

```basic
koala load "pictures/title.kla" # valideer en integreer tijdens het compileren
koala show # ga naar de bitmap-meerkleurenmodus
koala hide # keer terug naar de standaard tekstweergave
```

`koala load` accepteert een standaard Koala-bestand van 10003 bytes (`$6000`
laadadres plus 10001 databytes) of een onbewerkte payload van 10001 bytes. Paden
zijn relatief ten opzichte van het `.ub` bestand. De payload bevat 8000
bitmapbytes, 1000 schermbytes, 1000 kleurnibbles en één achtergrondkleurbyte.

De compiler slaat het op bij `$6000-$8710`. `koala show` kopieert de bitmap naar
`$2000`, de schermmatrix naar `$0400`, de kleuren naar `$D800` en schakelt de
bitmap-meerkleurenmodus in. `koala hide` schakelt de bitmap-/meerkleurenmodus
uit en herstelt de standaard tekstindeling.

De gegenereerde code en helpers moeten onder `$2000` eindigen, omdat de
weergegeven bitmap `$2000-$3F3F` overschrijft; anders geeft de compiler een
foutmelding. De Koala-import kan momenteel niet in hetzelfde programma worden
gecombineerd met `load sid`.

### Code-indeling: `org` — nieuw in 1.5.7

```basic
sub a() ... end # subroutines/functies worden één voor één vanaf het einde van de hoofdtekst geplaatst
org $4000 # de volgende subroutines/functies gaan verder op $4000; $xxxx-$3FFF blijft gevuld met nullen
sub b() ... end
incbin "font.bin", $3800 # gegevens kunnen in de ruimte staan ($3800-$3FFF is een volledige VIC-tekenset-slot)
```

`org addr` gaat **tussen sub/fn-definities** (het wordt genegeerd in de
hoofdcode en werkt alleen in de tweede doorgang). Subroutines lopen nooit in
elkaar over, dus de overgeslagen bytes worden gewoon met nullen opgevuld en
gereserveerd: een `incbin "f", addr` die volledig binnen de opening ligt, wordt
erin geschreven, en `charset on` telt de opening niet als code. De nulbytes
maken deel uit van de `.prg`. `org` onder het huidige einde van de code is een
compileerfout. Alles wat na de laatste subroutine wordt gegenereerd (helpers,
`data`-tabellen) volgt de laatste subroutine, d.w.z. komt boven de opening
terecht.

### Aangepaste tekenset (`charset on` / `charset off` nieuw in 1.5.7)

```basic
charset $3800 # Stel het basisadres in voor chardef (standaard $3800)

chardef 65 # Herdefinieer teken 65 ('A')

$18,$3C,$66,$7E,$66,$66,$66,$00
einde

chardef 66 # Minder dan 8 bytes worden opgevuld met nullen

$7C,$66,$7C,$66,$7C
einde
```

`charset base` stelt het bestemmingsadres in dat wordt gebruikt door alle
volgende `chardef`-instructies. `chardef id ... end` voegt 8 bytes inline in het
codesegment in (voorafgegaan door een `JMP` om ze over te slaan), en kopieert ze
vervolgens tijdens runtime naar `charset_base + id*8`. Waarden moeten
compileertijdconstanten zijn die geschreven zijn als `$xx` of decimaal. **`%`
binaire literals worden niet ondersteund** door de lexer (de handleiding zei dit
vóór 1.5.7 — dat was onjuist).

`charset addr` stelt alleen de bestemming `chardef` in; er wordt geen code
verzonden. Om de VIC-II de set te laten gebruiken, moet u deze inschakelen (en
weer uitschakelen wanneer u klaar bent):
```basic
charset $3800
chardef 1 $FF,$81,$81,$81,$81,$81,$81,$FF end # box border
charset on # VIC-II leest tekens van $3800 (schermmatrix onaangeraakt)
...
charset off # terug naar de ROM-set ($1800 als `lowercase` actief is, anders $1000)
```

`charset on` read-modify-writes `$D018` bits 1-3 from the last `charset addr`
(default `$3800`); the screen-matrix bits are preserved. The address must be a
multiple of `$800` within VIC bank 0 (`$0000-$3FFF`), otherwise it is a
compile-time error. Both statements use the `charset addr` that was compiled
lastly, so keep the directive in the main program body (subroutine bodies are
compiled after it). De equivalente raw write is `poke $D018, $1A` voor `$2800`
of `poke $D018, $1E` voor `$3800`.

**Overlapcontrole.** `charset on` claimt de hele 2 KB set en elke `chardef` zijn
8 bytes. Als de gegenereerde code dat gebied bereikt, stopt de build met `the
program code ($080D-$xxxx) overlaps the charset area $2800-$2FFF; move the
charset ...`. Grote programma's hebben daarom de set boven de code nodig
(`charset $3800`) — of gebruik `org` (hierboven) om de code boven de set te
laten doorlopen. Gegevens die in een `org` gat worden geplaatst (`incbin ...,
addr`) worden niet als code geteld.

### Geheugen

```basic
poke $D020, 2 # STA $D020
poke addr_var, 6 # STA (addr_var),Y — als addr_var van het type word is
var v = peek($D012) # LDA $D012
var v = peek(addr_var) # LDA (addr_var),Y — als addr_var van het type word is

var w: word = peek16($C000) # lees 16-bit little-endian: lo=$C000, hi=$C001
poke16 $0314, $EA81 # schrijf 16-bit little-endian: lo→$0314, hi→$0315
poke16 ptr, w # word var als adres; woord var als waarde

var k = 2
var p = peek($07F8 + k) # LDA $07F8,Y — constante + byte variabele
poke $07F8 + k, p # STA $07F8,Y
poke ptr + k, 1 # woord + byte: volledig 16-bits adres
```

`peek16(addr)` leest twee opeenvolgende bytes (lo, hi) als een `word`. `poke16`
schrijft eerst lo en daarna hi.

Een adres is altijd een 16-bits waarde. Sinds versie 1.6.5 behoudt een
adresuitdrukking zoals `$07F8 + k` de hoogste byte van de constante en de
overdracht (voorheen werd dit berekend in 8 bits en las `peek($07F8 + k)` `$00F8
+ k`). Dit geldt voor `peek`, `poke`, `peek16`, `poke16`, `fill`, `memcopy`,
`drawmem`, `save` en `reu`; `fill` / `memcopy` lengtes zoals `40 * rows` zijn
ook 16-bits. `peek(k)` met een bytevariabele leest adres `$00kk` (het gaf de
waarde van `k` zelf terug vóór 1.6.5).

### Schijf-I/O

```basic
load "PROGRAM" # KERNAL LOAD: laadt bestand van apparaat 8 naar het native adres
load "DATA", $C000 # laadt bestand naar een specifiek adres
chain "GAME" # laad een ander programma over dit programma heen en voer het uit (zie hieronder)
load "DATA", ptr # adres uit woordvariabele

save "DATA", $C000, 4096 # KERNAL SAVE van $C000, 4096 bytes → apparaat 8
save "PROG", start, len # adres en lengte uit woord-/intvariabelen
```

`load` roept KERNAL `SETNAM`+`SETLFS`+`LOAD` (`$FFBD`/`$FFBA`/`$FFD5`) aan.
Zonder adres: secundair adres 1 (de eigen 2-byte header van het bestand is het
laadadres). Met adres: secundair adres 0 (het bestand wordt geladen naar het
opgegeven adres, de header wordt overgeslagen). (Opgelost in 1.5.9 — voorheen
waren de twee verwisseld: `load "F"` geladen naar `$0000`.) `save` roept
`SETNAM`+`SETLFS`+`SAVE` (`$FFBD`/`$FFBA`/`$FFD8`) aan. Vereist zowel `addr` als
`len`.

#### Doorverbinden naar een ander programma — `chain` (nieuw in 1.5.9)

```basic
chain "GAME" # laad GAME vanaf de schijf waar we begonnen zijn en voer het uit
chain "GAME", 9 # vanaf schijf 9 (willekeurige expressie)
print "LAADFOUT" # wordt alleen bereikt als het bestand niet kon worden geladen
```

`chain` laadt een ander programma naar zijn eigen laadadres — normaal gesproken
`$0801`, direct over het draaiende programma heen — en start het precies alsof
`LOAD"GAME",8,1` en `RUN` waren getypt. Dit is wat een opstart-/titelprogramma
nodig heeft. Een simpele `load` kan dit niet: het geladen bestand zou de code
overschrijven die de `load` uitvoert.

Hoe het werkt:

- Een 46-byte, positie-onafhankelijke loader plus de bestandsnaam wordt
  gekopieerd naar de cassettebuffer (`$033C`), waarover noch een Ultimate
  Basic-programma noch een Exomizer-gecomprimeerd bestand wordt geladen.
- Voordat dat gebeurt, wordt de machine teruggezet naar een schone staat: VIC
  IRQ's uit, SID-volume 0, `IOINIT` (`$FDA3`: CIA-timers, toetsenbord-IRQ,
  seriële bus), `RESTOR` (`$FF8A`: standaard IRQ/BRK/NMI- en I/O-vectoren), `$01
  = $37`. Aangepaste raster-IRQ's, `muziek afspelen` en `nmi` handlers stoppen.
  Scherm, kleuren en VIC-bankregisters, met uitzondering van `$DD00`, blijven
  ongewijzigd, zodat een afbeelding op het scherm kan blijven staan terwijl het
  volgende programma wordt geladen (`IOINIT` selecteert VIC-bank 0).
- De loader roept `SETNAM` / `SETLFS` (secundair 1) / `LOAD` aan. Zonder een
  apparaatargument gebruikt hij de schijf waarvan het programma zelf is geladen
  (`$BA`), of schijf 8.
- Na een succesvolle laadbewerking stelt het de end-of-program pointer in
  (`$2D/$2E`), initialiseert het BASIC opnieuw (`$E453`, `$E3BF` — een
  zelf-uitpakkende cruncher zoals Exomizer `sfx` heeft mogelijk de zero page van
  BASIC gebruikt) en voert het het programma uit (`$A659`, `$A7AE`). Het werkt
  voor zowel Ultimate Basic-programma's, gecomprimeerde (`exomizer sfx sys`)
  bestanden als gewone BASIC-programma's.
- Als het bestand niet kan worden geladen (niet gevonden, geen schijfstation),
  keert `chain` terug en gaat het programma verder met de volgende instructie.

De bestandsnaam moet een tekenreeks zijn van 1 tot en met 16 tekens.

### Seriële kanaal bestands-I/O

```basic
open 1, 8, 2, "MYFILE" # open logisch bestand 1, apparaat 8, secundair 2, naam "MYFILE"
open 2, 4, 7 # open printer (apparaat 4), geen bestandsnaam
open ch, dev, sec # kanaal, apparaat, secundair uit variabelen

print# 1, "HELLO" # stuur "HELLO"+CR naar logisch bestand 1
print# ch, x, "text" # elke combinatie van variabelen en tekenreeksen — hetzelfde als print, maar naar een bestand

close 1 # sluit logisch bestand 1
close ch # kanaal uit variabele
```

`open` roept `SETNAM` ($FFBD) + `SETLFS` ($FFBA) + `OPEN` ($FFC0) aan. Zonder
bestandsnaam wordt SETNAM aangeroepen met lengte 0. `print#` routeert de uitvoer
via `CHKOUT` ($FFC9), CHROUT per teken (+ afsluitende CR), en vervolgens
`CLRCHN` ($FFCC). `close` plaatst het kanaalnummer in A en roept `CLOSE` ($FFC3)
aan.

### Invoer

```basic
input score # lees maximaal 3 cijfers van het toetsenbord → 8-bits integer var
input "Naam: ", naam # optionele promptstring, lees vervolgens de regel → string var
input "Score: ", score # prompt + integer input
```

`input` gebruikt KERNAL BASIN (`$FFCF`) voor blokkerende, herhaalde regelinvoer
met DEL-ondersteuning.
- **Int var**: accepteert alleen `0`–`9`, maximaal 3 tekens; wordt geconverteerd
  naar een 8-bits waarde bij CR.
- **Stringvariabele**: accepteert maximaal 30 tekens; wordt opgeslagen als een
  null-terminated string; ZP-paar bijgewerkt.
- **FLOAT var** (1.6.3): cijfers en `.`, bijv. `12.5` → 12.50 (twee decimalen).
- **ENKEL / DUBBEL var** (1.6.4): elk getal, `-12.5`, `.5`, `3.25E2`.
- **Array element** (1.6.3): `input t(i)` / `input nevek(i)`; `input "prompt";
  x` werkt ook.
- **String var**: accepteert maximaal 30 tekens; slaat op als een
  null-terminated string; ZP-paar bijgewerkt.

### Zwevende-komma / Vaste-komma

`float` variabelen gebruiken het Q8.8 fixed-point formaat: de hoge byte is het
gehele deel (0–255) en de lage byte is het fractionele deel (0/256 … 255/256).

```basic
var f: float = 3.5 # 3.5 → hi=3, lo=128 (= 0x0380)
var g: float = 0 # integer 0 wordt automatisch gepromoveerd naar 0.0

f = 1.5 # Q8.8 letterlijke toewijzing
f = f + 1.5 # 16-bits Q8.8 rekenkunde (resultaat: 3.0)
f = f + g # float + float

var n = int(f) # extraheer het integergedeelte (hi byte) → 8-bits int
print f # print als "N.DD" (bijv. 3.5 → "3.50", 1.25 → "1.25")
```

| Operatie            | Voorbeeld            | Notities                                                  |
| ------------------- | -------------------- | --------------------------------------------------------- |
| Letterlijk          | `3.5`, `0.25`, `1.0` | Tijdens het compileren werd het als Q8.8 geïnterpreteerd. |
| Integerpromotie     | `f = 5`              | opslag 5.0 (hoog=5, laag=0)                               |
| Toevoegen/vervangen | `f + 1.5`, `f - g`   | 16-bits Q8.8 rekenkunde                                   |
| Extract int         | `int(f)`             | retourneert de hoogste byte als een 8-bits integer.       |
| Afdrukken           | `print f`            | formaat "N.DD", altijd 2 decimalen                        |

**Let op:** Rekenkundige overloop treedt op bij 255.255 (geen verzadiging).
Vermenigvuldiging en deling van twee drijvende-komma-variabelen worden nog niet
ondersteund — gebruik `int()` + integer-rekenkunde voor die gevallen.

**Het afdrukken van float-expressies (opgelost in 1.5.7).** `print` van een
rekenkundige expressie die een `float` bevat (bijvoorbeeld `print a / 10` met
`a: float = 1`) print nu het Q8.8-resultaat als `N.DD`. Vóór 1.5.7 printte het
de ruwe 16-bits waarde als een integer (`25` in plaats van `0.09`). De breuk
wordt afgekapt, niet afgerond: 1/10 = 25/256 wordt afgedrukt als `0.09`.

### Zwevende-komma: `SINGLE` / `DOUBLE` (1.6.4)

`dim x as single` en `dim x as double` zijn reële drijvende-komma getallen — het
5-byte formaat van C64 BASIC: ongeveer 9 significante cijfers, bereik ±2,9·10⁻³⁹
… ±1,7·10³⁸. (`single` en `double` zijn van hetzelfde type.) Het snelle 2-byte
Q8.8 type is nog steeds beschikbaar als `float`.

```basic
DIM r AS DOUBLE, t AS DOUBLE
DIM k(9) AS SINGLE ' arrays: 5 bytes per element
r = 2.5
t = ATN(1) * 4 * r ^ 2 ' 19.6349541
PRINT t; " "; SQR(2); " "; 1E10; " "; 1 / 3
FOR r = 0 TO 1 STEP 0.25 : PRINT r : NEXT
FUNCTION Atfogo (a AS DOUBLE, b AS DOUBLE) AS DOUBLE

Atfogo = SQR(a * a + b * b)
END FUNCTION
```

|                     |                                                                                                                                                                                  |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Operators           | `+ - * /` en `^` (macht; rechtsassociatief, bindt sterker dan unaire min: `-2^2` = -4)                                                                                           |
| Functies            | `SQR`, `SIN`, `COS`, `TAN`, `ATN` (radialen), `EXP`, `LOG` (natuurlijk), `INT` (naar beneden), `FIX` (afkappen), `CINT` (afronden), `ABS`, `SGN`, `CSNG` / `CDBL` (no-op), `VAL` |
| Letterlijke waarden | `1.5`, `.5`, `1E6`, `2.5e-3`, `70000`                                                                                                                                            |
| Vergelijkingen      | `= &lt;&gt; &lt; &gt; &lt;= &gt;=` in `IF` / `WHILE` / `UNTIL` / `SELECT CASE` en als waarden                                                                                    |
| Afdrukken           | C64 BASIC-stijl: `.5`, `-3.25`, `3.33333333`, `1E+10`, `1.5E-07` (geen spatie aan het begin)                                                                                     |
| Snaren              | `s = "X=" + x`, `STR$(x)`, `VAL(s)` leest `-1.25E3`                                                                                                                              |
| `VOOR`              | drijvende-kommateller, limiet en stap (`STEP 0.1`, negatief, of een variabele)                                                                                                   |
| `INPUT` / `READ`    | `INPUT x` leest een willekeurig getal; `READ x` leest de volgende `data` byte                                                                                                    |
| Sub / functie       | `p ALS DOUBLE` parameters en ` ALS DOUBLE` resultaten                                                                                                                            |

**Mengsel met gehele getallen.** Een expressie wordt berekend in
drijvende-kommaformaat wanneer deze een SINGLE/DOUBLE-waarde bevat, `^`, een van
de bovenstaande functies, of een letterlijke waarde die alleen in
drijvende-kommaformaat kan worden opgeslagen (`1E6`, `300.5`, `70000`). Zodra
een programma drijvende-kommaformaat gebruikt, is elke decimale letterlijke
waarde (`0.1`) ook een drijvende-kommaconstante. Het opslaan van een
drijvende-kommawaarde in een `byte`, `integer` of `word` **rounds** wordt een
getal (de helft van nul verwijderd: 2,5 → 3, -2,5 → -3); in een `float` wordt
het Q8.8. Een integerwaarde die aan een DOUBLE wordt toegewezen, wordt exact
geconverteerd. Integeruitdrukkingen behouden hun integerregels (`var c = a + b`
is nog steeds een byte).

**Notities**
- Een geheel getal van 32768 tot 65535 wordt gelezen als een 16-bits patroon en
  wordt negatief in de context van drijvende-kommagetallen: schrijf `40000.0` of
  `4E4`.
- `7 / 2` is 3,5 wanneer toegewezen aan een DOUBLE; in de context van gehele
  getallen is het 3 zoals eerder.
- `x MOD y` en `AND` / `OR` / `XOR` ronden hun operanden af naar gehele
  getallen.
- `SIN` / `COS` van een byte-waarde behouden de oude betekenis van de tabel
  0-255 (volledige cirkel = 256); met een SINGLE/DOUBLE-argument werken ze in
  radialen.
- Floating-point code mag niet worden uitgevoerd in IRQ/NMI-handlers (de runtime
  bewaart zijn status in vast RAM-geheugen).
- Kosten: de floating-point runtime (ongeveer 4,4 KB, geassembleerd door de
  compiler) wordt na het programma toegevoegd de eerste keer dat SINGLE/DOUBLE
  wordt gebruikt. Variabelen nemen 5 bytes in beslag in het arraygebied, plus
  een 2-byte zero-page pointer voor de runtime. Een vermenigvuldiging duurt
  ongeveer 1-2 ms op een 1 MHz C64.

### Variabelen in RAM, arraygeheugen (1.6.4)

- **Nulpagina vol:** Wanneer de variabelen van het programma niet in de
  permanente nulpagina passen (`$02-$4F`), compileert de compiler het programma
  opnieuw en verplaatst de variabelen die het minst worden gebruikt in de 'hot
  code' naar het normale RAM-geheugen (na de arrays). Een instructie die zo'n
  variabele gebruikt, kopieert deze naar een nulpagina-slot en weer terug, zodat
  programma's zich hetzelfde gedragen, alleen zijn deze variabelen iets trager.
  Lustellers, parameters en alles wat een IRQ-handler kan aanraken, blijven in
  de nulpagina. De geheugenkaart toont ze als `RAM:$xxxx`. Het opraken van de
  nulpagina is geen fout meer, behalve in extreme gevallen (`uit nulpagina`
  blijft voor die gevallen van toepassing).
- **Arraygeheugen:** arrays (en spilled/floating-point variabelen) gebruiken
  `$C000-$CFFF`. Wanneer ze meer dan 4096 bytes nodig hebben, begint het gebied
  in plaats daarvan bij `$A000`, wat 12 KB oplevert (`$A000-$CFFF`): de BASIC
  ROM wordt uitgeschakeld bij de start van het programma (`$01` bit 0) en weer
  ingeschakeld bij elke exit naar BASIC (`end`, `bye`, einde van het programma,
  `chain`), zodat het programma nog steeds terugkeert naar een werkende BASIC.
  Programma's die zelf BASIC ROM-routines aanroepen (`sys $Axxx`) mogen niet
  meer dan 4 KB aan arrays gebruiken.

### Wiskundige functies

```basic
var a = abs(x - 20) # absolute waarde in two's-complement
var b = min(x, 39) # 8-bits minimum
var c = max(x, 0) # 8-bits maximum
var s = sgn(score) # 0 = nul, 1 = positief (1–127), $FF = negatief (128–255)
var r = rnd() # LCG pseudo-willekeurig 0-255; zaadwaarde van rasterlijn
var r = rnd(10) # LCG pseudo-willekeurig 0-9 (rnd() mod n; resultaat 0..n-1)
var s = sin(hoek) # sinus: hoek 0-255 (volledige cirkel), retourneert 0-255 (middelpunt=128)
var c = cos(hoek) # cosinus = sin(hoek+64)
var v = clamp(x, 0, 39) # 8-bits unsigned clamp: resultaat = max(lo, min(hi, val))

print hex(n) # print als 2-cijferige hoofdletter hexadecimale waarde
print bin(n) # print als 8-bits binaire tekenreeks
```

### Stringfuncties

```basic
var n = len(msg) # lengte van de null-terminated string var (0–255)
var c = asc(msg) # PETSCII-code van het eerste teken (0 als leeg)
var c = asc("A") # compileertijd: constante PETSCII-code
var n = val(s) # runtime: parse decimale PETSCII-string → 8-bits integer (bijv. "042" → 42)
var c = msg[i] # teken op index i: PETSCII-code van msg[i]
msg[i] = c # schrijf PETSCII-byte c naar string op index i — STA (ptr),Y
msg[0] = 72 # constante index → LDY #0; STA (ptr),Y
```

### Nummeropmaak

```basic
print hex(n) # print als 2-cijferig hoofdletter hexadecimaal getal
print bin(n) # print als 8-bits binaire tekenreeks
print dec(n, 4) # rechts uitgelijnd decimaal getal in een veld van 4 tekens (bijv. 42 → " 42")
print dec(n, width) # width kan ook een variabele zijn
```

`dec(n, width)` vult het getal aan de linkerkant aan met spaties om de tekens
`width` te vullen. Als het getal meer cijfers heeft dan `width`, wordt het
afgedrukt zonder opvulling (geen afkapping). In niet-afdrukcontexten wordt
`dec(n, w)` onveranderd geëvalueerd tot `n` (hetzelfde als `hex`/`bin`).

### REU (RAM-uitbreidingseenheid)

```basic
var ok = reu_present() # 1 als REU gedetecteerd, 0 anders (schrijf-/leestest op $DF04)
var ok = reudet() # alias voor reu_present()

reu stash c64addr, bank, reu_addr, len # kopieer C64 → REU
reu fetch c64addr, bank, reu_addr, len # kopieer REU → C64
reu swap c64addr, bank, reu_addr, len # wissel tussen C64 en REU
```

`reu_present()` voert een schrijf-/leestest uit op REU-register `$DF04`. Zonder
een REU gaat de schrijfbewerking verloren (open bus), waardoor de leestest
anders verloopt — hiermee wordt de aanwezigheid betrouwbaar gedetecteerd zonder
dat er een ander commando-register wordt aangeraakt dat neveneffecten kan
veroorzaken.

| Parameter  | Breedte | Notities                                                                 |
| ---------- | ------- | ------------------------------------------------------------------------ |
| `c64addr`  | 16-bit  | C64 RAM-start — constante, `word` variabele of 8-bits expressie          |
| `bank`     | 8-bit   | REU-banknummer (0–7 voor een eenheid van 512 KB)                         |
| `reu_addr` | 16-bit  | Compensatie binnen de REU-bank                                           |
| `len`      | 16-bit  | Aantal bytes dat moet worden overgedragen (`0` = 65 536 in REU-hardware) |

REU-registers: `$DF01` commando (`$B0` stash / `$B1` fetch / `$B2` swap),
`$DF02–$DF03` C64-adres, `$DF04–$DF05` REU-offset, `$DF06` bank, `$DF07–$DF08`
lengte. De overdracht is synchroon (CPU wordt gepauzeerd tijdens DMA). Vereist
een echte REU of VICE: **Instellingen → Hardware → RAM-uitbreidingsmodule**.

### Geheugenhulpprogramma's

```basic
fill screen 32 # vul het schermgeheugen $0400–$07FF met waarde 32 (spatieteken)
fill color 1 # vul het geheugengeheugen $D800–$DBFF met waarde 1 (wit)

fill $0400, 1000, 32 # vul 1000 bytes vanaf $0400 met waarde 32
fill addr, 256, 0 # addr kan een woordvariabele zijn
fill ptr, len_word, val # alle operanden kunnen expressies/woordvariabelen zijn

memcopy $C000, $0400, 256 # kopieer 256 bytes van $C000 → $0400
memcopy src_ptr, dst_ptr, 40 # woordvariabelen voor bron en bestemming

drawmem $C000, $0400, 8, 10, 40 # blit 8×10 rechthoek van $C000 → scherm op $0400, stapgrootte 40
drawmem src_ptr, dst_ptr, w, h, 40 # woordvariabelen voor src/dst
```

Zowel `fill` als `memcopy` ondersteunen lengtes van 16 bits (0–65535). Gebruik
`word` variabelen voor lengtes groter dan 255.

`drawmem src, dst, width, height, stride` kopieert een rechthoekig 2D-blok.
`src` wordt lineair gelezen (gepakte rijen); `dst` gaat met `stride` bytes
vooruit tussen rijen — gebruik `40` ($28) voor het C64-scherm of kleuren-RAM (40
kolommen). Breedte, hoogte en stapgrootte zijn allemaal 8-bits waarden. `src` en
`dst` kunnen constanten, `word` variabelen of 8-bits expressies zijn.

### Raster IRQ

```basic
irq my_handler # raster-IRQ op regel 0, handler = subnaam of adres
irq my_handler, 100 # raster-IRQ op rasterregel 100
irq $C800, 200 # handler op vast adres
irq addr_word # handleradres uit een woordvariabele
```

Stelt een raster-IRQ in via de BASIC soft vector (`$0314`/`$0315`): schakelt de
CIA1 timer-IRQ uit, bevestigt de wachtende VIC-IRQ, schrijft de rasterlijn naar
`$D012`, schakelt de VIC raster-IRQ in (`$D01A=$01`), schrijft het handleradres
en schakelt de interrupts opnieuw in.

De handler **moet** eindigen met `sys $EA81` (KERNAL einde-van-IRQ) — een
simpele `RTS` of `RTI` zal de stack beschadigen. Bevestig eerst de VIC IRQ:

```basic
sub my_handler()

poke $D019, $FF # Bevestig VIC IRQ

# ... werk hier ...

sys $EA81 # Spring naar KERNAL einde van IRQ
end
```

Voorwaartse verwijzingen worden ondersteund (`irq my_handler` vóórdat de sub is
gedefinieerd).

### NMI-handler

```basic
nmi my_nmi # Stel NMI-vector $0318/$0319 in op handler-subroutine of adres

sub my_nmi()

# ... NMI-bewerkingen hier ...

nmi_exit # JMP $FE47 — correcte NMI-afsluiting (herstelt A/X/Y + RTI)
end
```

`nmi handler` schrijft het handleradres naar de NMI-softvector
(`$0318`/`$0319`). De hardware-NMI-vector op `$FFFA` wijst naar de KERNAL
NMI-routine die via `$0318` vertakt. De handler **moet** eindigen met `nmi_exit`
(zendt `JMP $FE47` uit) — het gebruik van een gewone `RTI` zal de stack
beschadigen. Forward references worden ondersteund.

### CIA1 timer IRQ

```basic
cia_timer 19656, my_handler # CIA1 timer A: wordt elke 19656 cycli geactiveerd (~50 Hz PAL)
cia_timer period, handler # period kan een variabele of expressie zijn
```

Stelt CIA1 timer A in als een periodieke IRQ-bron via de BASIC soft vector
(`$0314`/`$0315`):
1. SEI — interrupties uitschakelen
2. `$DC0D = $7F` — schakel alle CIA1 IRQ's uit
3. Laad 16-bits periode lo→`$DC04`, hi→`$DC05`
4. Schrijf het handleradres naar `$0314`/`$0315`
5. `$DC0D = $81` — CIA1 timer A IRQ inschakelen
6. `$DC0E = $01` — start timer A in continue modus
7. CLI — interrupts opnieuw inschakelen

De handler moet eindigen met `irq_exit` (of `sys $EA81`) en moet de CIA1 IRQ
bevestigen:

```basic
sub my_handler()

poke $DC0D, $01 # ACK CIA1 timer A IRQ (lezen wist deze ook)

# ... werk hier ...

irq_exit # JMP $EA81: herstel A/X/Y + RTI
end
```

PAL-timing: klokfrequentie = 985 248 Hz. Periode voor 50 Hz = 985 248 / 50 = 19
705 cycli ≈ `$4CC9`. Voorwaartse referenties worden ondersteund.

### Foutafhandeling

```basic
onerr goto err_handler # Stel de kernel I/O-foutvector ($0300/$0301) in op een label

...

label err_handler

print "I/O-FOUT"

bye
```

`onerr goto label` schrijft het labeladres (lo, hi) naar de KERNAL-locaties
`$0300` en `$0301`. Wanneer er een KERNAL I/O-fout optreedt (bijv. een mislukte
`load` of `open`), voert de KERNAL `JMP ($0300)` uit, die naar het label
springt. Voorwaartse verwijzingen (label gedefinieerd na `onerr goto`) worden
ondersteund.

### Compile-time file embedding (`incbin` skip / length new in 1.5.7)

```basic
incbin "sprites.bin" # Voeg ruwe binaire bytes in op de huidige codepositie
incbin "charset.bin", $2000 # Voeg in op een absoluut adres, vul indien nodig aan
incbin "font.prg", $3C00, 2 # ...sla de eerste 2 bytes over (bijv. een .prg-laadadres)
incbin "big.bin", $4000, 16, 256 # ...sla 16 bytes over, neem vervolgens maximaal 256 bytes
include "defs.ub" # Voeg een ander .ub-bronbestand inline in (lexed+parsed in place)
```

`incbin "file", addr, skip [, length]` verwijdert de eerste `skip` bytes van het
bestand (doorgaans het 2-byte laadadres van een `.prg`) en neemt optioneel
maximaal `length` bytes; `skip` en `length` zijn constanten, en een `skip`
voorbij het einde van het bestand is een fout. De adresvorm vereist dat het doel
zich boven de gegenereerde code bevindt — of binnen een `org` gat.

### Gegevens / Lezen

```basic
data 1, 2, 3, 255 # constante bytetabel
lees varname # laad de volgende byte in varname (wordt automatisch gedeclareerd indien nodig)
```

Alle `data`-waarden worden tijdens het compileren verzameld. Een 2-byte
ZP-pointer wordt automatisch toegewezen en geïnitialiseerd bij de start van het
programma. Elke `read` verhoogt de pointer.

**Initialiseerde arrays — `data <array>: …` (nieuw in 1.5.8)**

```basic
var sinus = array(8)
data sinus: 128, 218, 255, 218
data sinus: 128, 37, 0, 37 # volgende regels gaan verder waar de vorige is geëindigd
print sinus[i] # willekeurige toegang, zoals elke array

var xpos = array_word(2)
data xpos: 24, 300 # woordarrays nemen 16-bits waarden aan (opgeslagen als laag, hoog)
```

Een `data`-regel waarvan het eerste item `name:` is, vult een gedeclareerde
`array` / `array_word` in plaats van de `read`-stream. De waarden worden na de
code opgeslagen en eenmaal bij de start van het programma naar de array
gekopieerd (direct nadat de arrays op nul zijn gezet), waardoor de tabel
volledig beschrijfbaar en geïndexeerd is zoals elke andere array. Meer waarden
dan de array kan bevatten, of een niet-gedeclareerde naam, is een compileerfout.
Deze regels hebben geen invloed op `read`.

### Inline-assemblage

```basic
sys $FFD2 # JSR $FFD2
sys $FFD2, 7 # LDA #7 ; JSR $FFD2 (byte-waarde doorgeven in A-register)
irq_exit # JMP $EA81 — correcte IRQ-handler exit (A/X/Y + RTI herstellen)
asm $EA, $EA # inline raw bytes (NOP NOP) — legacy-vorm
asm {

; Volledige 6502 mnemonics en adresseermodi

LDA #$07 ; direct

STA $0286 ; absoluut

LDA $50 ; zero-page ($50 ≤ $FF → ZP automatisch geselecteerd)

STA $0400,X ; absoluut,X geïndexeerd

LDA ($50),Y ; (indirect),Y

LDA ($50,X) ; (indirect,X)

JSR $FFD2 ; subroutine-aanroep

JMP $C000 ; absolute sprong

JMP ($FFFC) ; indirecte sprong

CLC

ADC #1

SEC

SBC #1

TAX ; impliciet / overdracht

ASL A ; accumulator (ook gewoon: ASL)

LSR A

ROL

ROR

; Vertakkingen — operand is een absoluut adres; offset wordt automatisch berekend

BNE loop ; voorwaartse of achterwaartse sprong naar lokaal label

BEQ done

loop:

NOP
done:

RTS

; #<label / #>label — lage / hoge byte van een labeladres

LDA #<handler

STA $0314

LDA #>handler

STA $0315

; * — huidige assembly-locatie

JMP *

; Ruwe hexadecimale bytes (achterwaarts compatibel met oude asm { $xx ... } syntax)

$EA $EA ; twee NOP-bytes
}
```

**Adresmodi:**

| Syntaxis       | Modus         | Bytes | Voorbeeld                     |
| -------------- | ------------- | ----- | ----------------------------- |
| (geen operand) | Impliciet     | 1     | `NOP`, `RTS`                  |
| `A`            | Accumulator   | 1     | `ASL A`, `LSR`                |
| `#waarde`      | Onmiddellijk  | 2     | `LDA #$07`                    |
| `$zz` (0–255)  | Nulpagina     | 2     | `LDA $50`                     |
| `$zz,X`        | ZP,X          | 2     | `LDA $50,X`                   |
| `$zz,Y`        | ZP,Y          | 2     | `LDX $50,Y`                   |
| `$xxxx`        | Absoluut      | 3     | `LDA $0400`                   |
| `$xxxx,X`      | Absoluut, X   | 3     | `LDA $0400,X`                 |
| `$xxxx,Y`      | Absoluut, Y   | 3     | `LDA $0400,Y`                 |
| `($xxxx)`      | Indirect      | 3     | `JMP ($FFFC)`                 |
| `($zz,X)`      | (Indirect, X) | 2     | `LDA ($50,X)`                 |
| `($zz),Y`      | (Indirect), Y | 2     | `LDA ($50),Y`                 |
| `label`        | Relatief      | 2     | `BNE label` (alleen filialen) |

- `$zz` (1–2 hexadecimale cijfers, waarde ≤ 255) selecteert zero-page als de
  instructie dit ondersteunt; anders wordt automatisch geüpgraded naar absolute.
  Gebruik `$00xx` (4 cijfers) om absolute af te dwingen.
- Branch-operanden zijn absolute adressen; de relatieve byte-offset wordt
  automatisch berekend.
- Lokale labels (`name:`) zijn beperkt tot het `asm { }` blok. Forward branches
  worden in stap 2 opgelost.
- `#<label` / `#>label` geven de lage/hoge byte van het adres van een label
  weer.
- `*` geeft het huidige instructieadres weer, dus `JMP *` wordt geassembleerd
  als een zelflus.
- Regels die beginnen met `$`, `%` of een cijfer worden als onbewerkte bytes
  verzonden (achterwaarts compatibel).
- Binnen `asm { }` zijn commentaren `;` of `//` tot het einde van de regel. (`#`
  is het directe voorvoegsel, geen commentaar.)

**Het combineren van `asm { }` met subroutineparameters**

Parameternamen zijn **niet toegankelijk** binnen `asm { }`-blokken. Gebruik
UltimateBasic-instructies om waarden naar bekende locaties te verplaatsen vóór
het `asm { }`-blok:

```basic
sub set_colors(border_col, bg_col)

poke $D020, border_col # UltimateBasic lost het ZP-adres op

poke $D021, bg_col

asm {

; waarden zijn al aanwezig in $D020 / $D021

LDA $D020

}
end
```

Voor routines waarvan de volledige body uit assemblycode bestaat — met name
IRQ-handlers die naar elkaar moeten verwijzen — plaatst u alle handlers in één
**enkel blok op het hoogste niveau `asm { }`** in het hoofdprogramma. Labels in
hetzelfde blok delen een bereik, dus `irq1` en `irq2` kunnen vrijelijk naar
elkaar verwijzen. Zie `examples/raster_irq_demo.ub`.

### String ↔ integer

```basic
numstr score, $0340 # schrijft "042\0" op $0340 (altijd 3 cijfers, opgevuld met nullen)
var n = str_to_int("42") # compileertijd: Expr::Number(42)

print str$(score) # print 8-bits integer als 3-cijferige decimale tekenreeks ("000"–"255")
print "Score: " + str$(score) # bruikbaar in de context van string concat print
var s: string = str$(n) # wijs het resultaat van str$() toe aan een string var (gedeelde statische buffer)
```

`str$(n)` converteert een 8-bits waarde naar een decimale tekenreeks van 3
tekens (altijd 3 cijfers met voorloopnullen, bijv. `5` → `"005"`, `42` →
`"042"`, `255` → `"255"`), gevolgd door een null-terminator. De resultaatpointer
wordt opgeslagen in een permanent ZP-paar dat tijdens de compilatie wordt
toegewezen.

> **Opmerking:** `str$(n)` gebruikt één gedeelde statische buffer van 4 bytes.
> Als u `str$(n)` opnieuw aanroept, wordt het vorige resultaat overschreven.
> Voor gelijktijdige weergave van meerdere waarden gebruikt u `numstr` om naar
> afzonderlijke absolute adressen te schrijven.

## Voorbeelden

| Bestand                             | Beschrijving                                                                                               |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `voorbeelden/functies.ub`           | const, label/goto, poke/peek, rnd, wiskundige functies                                                     |
| `examples/new_features.ub`          | subparameters, arrays, woordvariabelen, tekenreeksvariabelen                                               |
| `examples/bitmap_demo.ub`           | 320×200 bitmap, plotten, grafische weergave aan/uit                                                        |
| `examples/block_demo.ub`            | 80×50 blokgrafieken, plot4, circle4, grafieken op blok                                                     |
| `examples/joystick_demo.ub`         | joystickuitlezing, spritebeweging                                                                          |
| `examples/mux_demo.ub`              | raster sprite multiplexer (3 vensters × 8 sprites = 24)                                                    |
| `examples/orbit_demo.ub`            | 24-sprite baan met pulserende straal en willekeurige kleuren                                               |
| `examples/plasma_demo.ub`           | Plasma-effect bitmap met rasterbalkrandanimatie                                                            |
| `examples/sprite_data.ub`           | sprdef-vormgegevens (meegeleverd door andere demo's)                                                       |
| `examples/sprite_mux_orbit.ub`      | Demo van een baan met 24 sprites, sprdef en vooraf berekende posities.                                     |
| `examples/sprite_orbit_demo.ub`     | 8 hardware-sprites in een cirkelvormige baan via de sinus/cosinus-tabel                                    |
| `examples/reu_bitmap_demo.ub`       | REU-opslag/ophaling met bitmapafbeeldingen                                                                 |
| `examples/sid_music_demo.ub`        | SID-muziekspeler met raster-IRQ en toetsenborduitgang                                                      |
| `voorbeelden/tenprint.ub`           | 5 TENPRINT doolhofimplementaties met menu; demo's `lowercase` tekensetmodus                                |
| `examples/countdown_demo.ub`        | Aftellen `for..next` met negatieve stap, incl. `for i = 20 to 0 step -2`                                   |
| `examples/countdown_errors_demo.ub` | Compileerfout voor default-step `from > to`                                                                |
| `examples/explicit_demo.ub`         | `--explicit` CLI-vlagdemo met volledig getypte `var`, `sub`, `fn`                                          |
| `examples/explicit_errors_demo.ub`  | Losse code die compileert zonder --explicit, geeft een foutmelding mét `--explicit`.                       |
| `examples/dim_demo.ub`              | `DIM … AS …` scalaire waarden en arrays van elk type                                                       |
| `voorbeelden/qbasic_demo.ub`        | QBasic-stijl FUNCTION / SUB / ELSEIF / DO-LOOP / SELECT CASE / strings                                     |
| `examples/float_demo.ub`            | ENKELVOUDIGE / DUBBEL drijvende-komma: `^`, SQR, SIN, ATN, EXP, LOG, `FOR … STEP 0.5`, `AS DOUBLE` functie |

## CLI-referentie

```
ub build <input.ub> [OPTIES]

-o, --output <bestand> Uitvoerbestand .prg of .crt (standaard: <input>.prg)

-v, --verbose Toon de lay-out van de nulpagina en een hex-dump van de code

--no-stub Sla de BASIC SYS-stub over (code laadt op $0801)

--debug Produceer ook debugbestanden .sym, .dbg en .vs

--asm Produceer ook een leesbare 6502 codegen .asm-lijst

--d64 [bestand] Produceer ook een .d64-schijfkopie;

zonder bestandsnaam is de standaardwaarde <output>.d64

--add <bestand> Voeg een extra bestand toe aan de .d64-schijfkopie;

kan worden herhaald voor meerdere bestanden

--explicit Vereis :type voor elke variabele / subparameter / functieparameter

-h, --help Toon help
```

### CRT-export

Ultimate Basic kan ook een Magic Desk type-19 cartridge-image schrijven als de
uitvoerbestandsnaam eindigt op `.crt`:

```bash
ub build demo.ub -o demo.crt
```

De compiler verpakt de gegenereerde PRG in een CRT-container met bankstructuur,
met dezelfde lay-out als de CRT-export van VisualAssembler: een cartridgeheader
van 64 bytes, een Magic Desk-image van 8×8K en een bootloader in bank 0 die de
PRG-payload naar het C64-RAM kopieert voordat er naar het programma-ingangspunt
wordt gesprongen. De paden `.prg` en `.d64` blijven gewoon werken zoals
voorheen.

### Expliciete typemodus

Geef `--explicit` door om elke declaratielocatie te dwingen een
`:type`-annotatie te bevatten:

```bash
ub build game.ub --explicit
```

Zonder de vlag accepteert Ultimate Basic zowel `var x = 5` (type afgeleid van de
initialisatie of standaard ingesteld op `int`) als `var x: int = 5`. Met de vlag
compileert alleen de geannoteerde vorm; de losse vorm leidt tot een
compileerfout.

**Wat het afdwingt:**

| Verklaringformulier                                             | Zonder `--explicit` | Met `--explicit`      |
| --------------------------------------------------------------- | ------------------- | --------------------- |
| `var name = expr` (geen `:type`)                                | ok — type afgeleid  | fout                  |
| `var name: int = expr` (of woord/zwevendekommagetal/tekenreeks) | OK                  | OK                    |
| `var arr = array(N)`                                            | ok — type afgeleid  | fout                  |
| `var arr = array_word(N)`                                       | OK                  | OK                    |
| `const NAME = value`                                            | OK                  | ok — ongewijzigd      |
| `sub foo(a, b)` (ongetypte parameters)                          | OK                  | ok — ongewijzigd      |
| `sub foo(a: int, b: int)`                                       | OK                  | ok — ongewijzigd      |
| `fn foo(a): int` (parameter zonder typeaanduiding)              | OK                  | fout bij de parameter |
| `fn foo(a: int): int`                                           | OK                  | OK                    |
| `fn foo(a): int` (ongetypeerde parameter)                       | OK                  | fout bij de parameter |
| `fn foo(a: int): int`                                           | OK                  | OK                    |

Constanten en arraydeclaraties worden altijd geaccepteerd — hun type wordt
bepaald door de declaratievorm, dus `:type` zou overbodig zijn.

**Voorbeeld van een foutmelding:**

```
$ ub build myprog.ub --explicit
Compilatiefouten:

regel 14: 'explicit'-modus: 'var loose' heeft geen type — gebruik 'var loose: int|word|float|string'

regel 16: 'explicit'-modus: parameter 'a' heeft geen type — gebruik 'a: int|word|float|string'
```

Deze vlag is een schakelaar die tijdens het compileren wordt ingeschakeld; er
hoeft niets in de broncode te worden gewijzigd om deze in of uit te schakelen.
Voeg de vlag toe aan je Makefile/compilatiescript om de getypte stijl
projectbreed af te dwingen, of laat hem weg voor verkennende scripts. Zie
`examples/explicit_demo.ub` en `examples/explicit_errors_demo.ub`.

### Foutopsporingsbestanden

Gebruik `--debug` om samen met het programma debugsymbolen te genereren:

```bash
ub build demo.ub --debug
```

De compiler schrijft de bestanden naast de `.prg`, waarbij de stam van het
uitvoerbestand wordt gebruikt:

| Bestand    | Vorm en doel                                                                                               |
| ---------- | ---------------------------------------------------------------------------------------------------------- |
| `demo.sym` | Een symboolbron die compatibel is met KickAssembler en geschikt is om te importeren in assembler-broncode. |
| `demo.dbg` | C64Debugger/RetroDebugger KickAssembler debug-dump met het programmasegment en labels                      |
| `demo.vs`  | VICE monitor-opdrachtbestand met `al`-opdrachten voor adreslabels                                          |

Alle drie de exportopties bevatten `program_start`, `program_end`, variabelen,
arrays, subroutines en BASIC-labels die bekend zijn na het genereren van de
code. Laad bijvoorbeeld de VICE-symbolen met de opdrachtregeloptie `-moncommands
demo.vs` of met de monitoropdracht `ll "demo.vs"`.

De huidige `.dbg` export biedt segment- en adressymboolinformatie. Deze bevat
nog geen instructie-naar-bronregel-mapping voor stapsgewijze uitvoering op
broncodeniveau.

### Lijst met assembly-codegeneratie (nieuw in 1.5.2)

Gebruik `--asm` om een leesbare 6502-broncodelijst naast de PRG te schrijven:

```bash
ub build demo.ub --asm
```

Voor een uitvoerbestand met de naam `demo.prg` wordt hiermee `demo.asm`
gegenereerd. De lijst wordt geproduceerd op basis van metadata die zijn
verzameld tijdens het genereren van de machinecode door Ultimate Basic; het is
niet zomaar een disassemblage van de voltooide PRG. Het bevat:

- `; UB:` opmerkingen die het gegenereerde bytebereik van elke emitterende
  UB-instructie markeren;
- benoemde constanten voor variabelen op nul pagina's en arrays, inclusief hun
  typen/groottes; `$C000+`
- definitieve namen en adressen voor subroutines en BASIC-labels;
- genereerde `loc_xxxx` labels voor relatieve takken en in-programma `JMP`/`JSR`
  doelen;
- Normale 6502-mnemoniccodes en -operanden, waarbij compilersymbolen waar
  mogelijk zijn vervangen;
- Het exacte C64-adres en de uitgezonden bytes worden naast elke instructie
  weergegeven;
- Door de compiler gegenereerde hulpfuncties en ingebedde code in hun
  uiteindelijke geheugenvolgorde;
- `.byte` uitvoer voor bytes die niet kunnen worden gedecodeerd als ondersteunde
  6502-instructies.

Compilerhulpfuncties krijgen beschrijvende namen zoals `ub_helper_plot`,
`ub_helper_line_erase`, `ub_helper_print_hex` en `ub_helper_music_irq`. Bekende
ingebedde gegevens – waaronder `data`-instructies, kaartteken-/kleurarrays,
sprite- en tekendefinities, de sinustabel, laadbestandsnamen,
`incbin`-bestanden, SID-muziek en Koala-payloads – worden uitgezonden als
benoemde `.byte`-regio's. Lange, met nullen gevulde adresgaten gebruiken de
`.fill`-richtlijn van KickAssembler.

Voorbeeldfragment:

```asm
.label x = $02 ; int

* = $080D

ub_start:

cld ; $080D: D8

; UB: var x

lda #$01 ; $080E: A9 01
sta x ; $0810: 85 02
```

De opmerkingen bij de adressen/bytes maken de lijst gemakkelijk te vergelijken
met `.prg`. De uitvoer gebruikt de KickAssembler-syntaxis (`.label`, `.byte`,
`.fill` en `* = origin`), zodat deze opnieuw geassembleerd kan worden;
machinecode-opmerkingen hebben geen invloed op het resultaat.

`--add` vereist `--d64`. Het gecompileerde `.ub` programma is altijd het eerste
bestand op de schijf; elk `--add` bestand wordt erachter geplaatst.
Bestandsnamen op de schijf zijn afgeleid van de stam van het bronbestand, in
hoofdletters (bijv. `music.prg` → `MUSIC`).

Na een succesvolle compilatie print de compiler altijd een geheugenkaart af:

```
demo.ub → demo.prg (386 bytes)

Laden: $080D – $0989

Variabelen (nulpagina):

score ZP:$08 byte

lives ZP:$0A byte

msg ZP:$0C string

ptr ZP:$0E word

Subroutines:

greet $0900

show $0912

Arrays ($C000+):

sprites $C000 8 bytes
```

Met `-v` toont de uitvoer bovendien de interne ZP-toewijzingen en een volledige
hex-dump.

### Gegenereerde code (geoptimaliseerd in 1.6.0)

De codegenerator genereert een strakkere 6502-code voor de meest voorkomende
gevallen; programma's hoeven niet te worden aangepast.

- Voorwaarden in `if` / `while` / `until` / `select` zijn een `CMP` plus een
  sprong (er wordt geen 0/1-waarde geconstrueerd en opnieuw getest). `x &gt; n`
  wordt gecompileerd als `x &gt;= n+1`; `and` / `or` van vergelijkingen worden
  afgebroken wanneer de rechterkant geen neveneffecten heeft; `while` test
  onderaan de lus.
- Constanten en bytevariabelen zijn directe operanden (`ADC #n`, `CMP zp`);
  `poke` naar een constante of `word` adresopslagen direct.
- Arrays met een variabele index gebruiken `base,Y`-adressering in plaats van
  een nulpagina-pointer.
- Wanneer een instructie begint met het laden van de variabele die de vorige
  instructie zojuist heeft opgeslagen, wordt de overbodige `LDA` overgeslagen.

Gebruik `--asm` om de gegenereerde code voor je eigen programma te bekijken.

## Bekende beperkingen

| Functie                               | Beperking                                                                                                                                                                                                                                                                                                                                |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Rekenen met gehele getallen           | 8-bits niet-ondertekend (0–255); `word` variabelen bevatten 16-bits waarden                                                                                                                                                                                                                                                              |
| Nul pagina budget                     | De permanente nulpagina is `$02–$4F` (78 bytes): elke variabele en sub/fn-parameter neemt 2 bytes in beslag, elke lopende `for`-lus nog eens 2 bytes. Sinds 1.6.4 worden variabelen die niet passen automatisch naar RAM verplaatst (zie *Variabelen in RAM*); alleen in extreme gevallen wordt nog steeds `buiten de nulpagina` gemeld. |
| Binaire literals                      | `%01010101` (sinds 1.6.4), `$hex` en decimaal                                                                                                                                                                                                                                                                                            |
| Subroutines                           | Geen recursie — ZP-parameterposities worden statisch toegewezen                                                                                                                                                                                                                                                                          |
| Stringvariabelen                      | `single` / `double` zijn 5-byte floating point sinds 1.6.4 (niet bruikbaar in IRQ-handlers; de ~4,4 KB runtime wordt toegevoegd aan het programma); `float` blijft Q8.8 (0–255,99)                                                                                                                                                       |
| Unaire min                            | Sinds 1.6.4 bindt een leidende `-` zich aan zijn operand: `-5 - 3` is -8 (het was -(5 - 3) = -2)                                                                                                                                                                                                                                         |
| String concat runtime                 | `s1 + s2` print sequentieel — geen geheugenallocatie of lengtecontrole                                                                                                                                                                                                                                                                   |
| `rnd()` / `rnd(n)`                    | Eenvoudige LCG, niet cryptografisch; periode = 256                                                                                                                                                                                                                                                                                       |
| `abs()` / `sgn()` / `min()` / `max()` | Alleen 8-bits waarden; `abs`/`sgn` behandelen waarden als getekend (bit 7 = negatief → `abs` tweecomplement, `sgn` retourneert `$FF`); `min`/`max` zijn ongetekend (0–255)                                                                                                                                                               |
| `plot`                                | Pixels buiten het bereik worden stilzwijgend afgesneden (Y ≥ 200 of X ≥ 320 → geen actie)                                                                                                                                                                                                                                                |
| `mplot`                               | Geen grenscontrole — x moet tussen 0 en 159 liggen, y moet tussen 0 en 199 liggen.                                                                                                                                                                                                                                                       |
| `mline` / `mrect`                     | Meerkleurig; x: 0–159, y: 0–199. Pixels buiten het scherm worden automatisch overschreven (geen uitsnijding) — coördinaten blijven binnen het bereik.                                                                                                                                                                                    |
| `mcircle`                             | Meerkleurig; punten buiten beeld (x ≥ 160 of y ≥ 200 worden overgeslagen) worden uitgeknipt.                                                                                                                                                                                                                                             |
| `kleurpen`                            | Alleen voor huurcellen; stelt de voorgrond-nibble van aangeraakte cellen in (achtergrond blijft behouden). Heeft geen effect in blokmodus (`plot4`/`circle4`)                                                                                                                                                                            |
| `rechthoek`                           | Geen grenscontrole — x: 0–319, y: 0–199; x1≤x2 en y1≤y2 worden niet afgedwongen (gedegenereerde/omgekeerde rechthoeken produceren ongedefinieerde uitvoer)                                                                                                                                                                               |
| `plot4`                               | Geen grenscontrole — x moet tussen 0 en 79 liggen, y moet tussen 0 en 49 liggen (blokmodus)                                                                                                                                                                                                                                              |
| `circle4`                             | Snijdt pixels buiten het scherm af; de bruikbare straal is ongeveer 0–49 in de 80×50 blokmodus.                                                                                                                                                                                                                                          |
| `chr$`                                | Geen PETSCII↔ASCII-mapping — n wordt ongewijzigd doorgegeven aan CHROUT                                                                                                                                                                                                                                                                  |
| `muziek afspelen`                     | Vereist `load sid` of een `tune` blok; er wordt slechts één CIA1 wrapper uitgezonden (de laatste `music play` wint)                                                                                                                                                                                                                      |
| `grafische weergave op dubbel`        | Alleen voor huurlingen; gebruikt `$4000–$7FFF` voor de backbuffer, dus programmacode moet onder `$4400` blijven; niet combineerbaar met sprites of meerkleurig                                                                                                                                                                           |
| Foutrapportage                        | Alleen tijdens het compileren; `onerr goto` behandelt kernel-I/O-fouten tijdens de uitvoering.                                                                                                                                                                                                                                           |
