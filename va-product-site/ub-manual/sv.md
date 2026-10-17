# Ultimate Basic v1.6.5 — Språkmanual

Komplett språk- och CLI-referens för Ultimate Basic, ett BASIC-liknande språk
som kompilerar direkt till 6502-maskinkod för Commodore 64. Utdata: `.prg` filer
(VICE eller riktig hårdvara), `.crt` kassettavbildningar och `.d64`
diskavbildningar.

För en kort projektöversikt och bygginstruktioner, se README.md.

© 2026 Zsolt Tarczali

> Att bygga `ub`-kompilatorn och kommandoradsalternativen beskrivs i
> [README.md](README.md). Denna manual dokumenterar själva Ultimate
> Basic-språket.

## Språkreferens

### Variabler och konstanter

**Alla variabler måste deklareras med `var` innan de används.** Att använda en
odeklarerad variabel i ett uttryck, en tilldelning, en `for`/`loop`-räknare, en
`inc`/`dec`, `input` eller `read`-sats producerar ett kompileringsfel.

```basic
var x = 10 # 8-bitars heltal (standard)
var ptr: word = $0400 # 16-bitars — två nollsidiga byte, användbara som 16-bitarsadress
var f: float = 3.5 # Q8.8 fixed-point — hi byte = heltal, lo byte = bråk
var msg = "HELLO" # strängvariabel (pekare till inline PETSCII-data)
var s: sträng = "TEXT" # sträng med explicit typ
var scores = array(10) # byte-array, 10 element lagrade vid $C000+
var moments = array_word(8) # ord-array, 8 ord-element lagrade vid $C000+
const BORDER_ADDR = $D020 # kompileringstidskonstant (substituerad inline, ingen ZP-plats)
```

Nyckelord och identifierare är **skiftlägesokänsliga**: `PRINT`, `Print` och
`print` är alla giltiga.

| Typ                   | Bredd          | Anteckningar                                                               |
| --------------------- | -------------- | -------------------------------------------------------------------------- |
| `int`                 | 8-bitars       | standard för numeriska literaler                                           |
| `ord`                 | 16-bitars      | två ZP-byte; kan användas som adress i `poke`/`peek`                       |
| `flyta`               | 16-bitars Q8.8 | hi byte = heltalsdel (0–255), lo byte = bråkdel                            |
| `enkel` / `dubbel`    | 5 byte, RAM    | flyttal (C64 BASIC-format, ~9 siffror) — `dim x som dubbelt`; se *Flyttal* |
| `sträng`              | pekare         | ZP-par → nollterminerad PETSCII i kodsegment                               |
| `matris(N)`           | N byte         | byte-element; finns på `$C000+`, inte i ZP                                 |
| `array_ord(N)`        | N×2 byte       | ordelement (16-bitars); finns på `$C000+`, inte i ZP                       |
| `array(R, C, …)`      | ∏dims byte     | flerdimensionell (rad-stor); index `arr[r, c]`                             |
| `array_word(R, C, …)` | ∏dims×2 byte   | flerdimensionell ordmatris (rad-stor)                                      |

#### BASIC-deklarationer: `dim … som …`

`dim namn som type` är en alternativ stavning av `var namn: type` — samma
lagring, samma kod:

```basic
DIM kor AS INTEGER # signerad 16-bitars, börjar vid 0
DIM nev AS STRING # sträng, börjar som ""
DIM files AS DOUBLE # flyttal, börjar vid 0
DIM x, y AS BYTE # flera namn, alla får typen
DIM punkt AS INTEGER = 1000, cim AS STRING = "C64" # initialiseringar, blandade typer
```

| `som …`           | Ultimat grundläggande typ                                                |
| ----------------- | ------------------------------------------------------------------------ |
| `byte`, `helhet`  | `int` (8-bitars, 0–255)                                                  |
| `heltal`          | signerad 16-bitars (−32768 … 32767) — QBasic HELTAL                      |
| `ord`             | `ord` (osignerad 16-bitars, 0–65535)                                     |
| `enkel`, `dubbel` | flyttal, 5 byte i RAM (±2,9·10⁻³⁹ … 1,7·10³⁸, ~9 siffror) — se *Flyttal* |
| `flyta`           | `flytande` (Q8.8 fast punkt — 0–255.99, snabbt)                          |
| `sträng`          | `sträng`                                                                 |

- Utan `= värde` börjar tal på 0 och strängar på `""`.
- `dim a, b som heltal` ger **båda** namnen av typen (VB.NET-stil, inte QBasic).
  Endast ett enda namn får ha en initialisering.
- `as` och BASIC-typnamnen är kontextord, inte reserverade — de kan fortfarande
  användas som namn.
- Stöds inte: `as long`, struct-typer (använd `var name: TName = array(N)`) —
  kompileringsfel.
- Med `--explicit` är en `dim` utan `as` ett fel.
- Strängtilldelning har värdesemantik: `s = "TEXT"` pekar på literalen, `t = s`
  och beräknade värden kopieras till `t`s egen buffert (se *Strings at
  runtime*). Före 1.6.3 lagrade `s = "TEXT"` efter deklarationen en skräpbyte i
  pekaren.

#### Arrayer med `dim`: `dim name(u1, u2, …) som typ`

```basic
DIM tabla(2, 3) AS INTEGER ' 3 × 4 element: tabla(0..2, 0..3)
DIM kocka(1, 2, 3) AS BYTE ' valfritt antal dimensioner
DIM ar(9) AS DOUBLE ' 10 flyttal (5 byte vardera)
DIM nevek(4) AS STRING ' 5 strängar, alla börjar som ""
DIM v(9) ' nej AS → byte array

tabla(2, 3) = 999 ' QBasic-stil index med ( )
tabla[2, 3] = 999 ' … eller den vanliga [ ]
nevek(0) = "ZSOLT"
PRINT tabla(2, 3); " "; nevek(0); " "; ar(1)
```

- Varje gräns är det **högsta indexet** (GRUNDLÄGGANDE regel): `dim t(2, 3)` har
  3 × 4 element. (`var t = array(3, 4)` tar elementantal — samma array.)
- Elementtyper: `byte`/`int` → 1 byte, `heltal` (med signatur) / `ord` → 2 byte,
  `flyttal` → 2-byte Q8.8, `enkel`/`dubbel` → 5-byte flyttal, `sträng` → 2-byte
  pekare. Gränser måste vara kompileringstidskonstanter. Arrayer finns i
  `$C000-$CFFF` (4 KB); När de behöver mer flyttas hela arrayområdet till
  `$A000-$CFFF` (12 KB, under BASIC ROM — se *Arrayminne*). Mer än 12288 byte är
  ett kompileringsfel.
- String-array-element börjar som `""`; `nevek(i) = "TEXT"` / `= s` / `= a + b`,
  `n = nevek(i)`, utskrift, `+`, överföring till en `string`-parameter och
  `inmatning av nevek(i)` fungerar alla (icke-litterala värden kopieras till en
  plats med 31 tecken per element).
- `name(i)`-indexering fungerar även för arrayer deklarerade med `var a =
  array(…)`.
- En array per `dim`-grupp: `dim a(3) som byte, n som heltal` är okej, `dim n,
  a(3) som heltal` är ett fel. Ingen initialisering — använd `datanamn: …`.

### Reserverade ord

Följande identifierare är **nyckelord** — de kan inte användas som variabel-,
konstant-, subrutin-, funktions-, parameter- eller etikettnamn. All matchning är
skiftlägesokänslig (`END`, `end`, `End` kolliderar alla). Att använda ett
reserverat ord som namn ger vanligtvis ett förvirrande fel (en `var`-rad
misslyckas tyst med att deklarera, eller ett uttryck som `for i = 1 to times`
viks till `Number(0)`) — så välj ett annat namn.

**Deklarations- och kontrollflöde** `var`, `const`, `sub`, `fn`, `type`,
`endtype`, `return`, `call`, `label`, `goto`, `gosub`, `if`, `then`, `else`,
`end`, `select`, `case`, `for`, `next`, `loop`, `times`, `to`, `step`, `while`,
`repeat`, `until`, `break`, `continue`, `inc`, `dec`, `bye`, `exit`, `rem`

**Musik** `tune` (blocknyckelord; raderna inuti - `speed`, `inst`, `order`,
`pat` - är inte reserverade)

**Typer och typrelaterade** `int`, `word`, `float`, `string`, `array`,
`array_word`

**Skriv ut och I/O** `skriv ut`, `spc`, `tab`, `vid`, `inmatning`, `chr$`,
`str$`, `hex`, `bin`, `öppna`, `stäng`, `ladda`, `spara`, `kedja`, `data`,
`läs`, `include`, `incbin` (även `dec` — listad ovan som minskningssatsen; samma
token används för utskriftsformatet `dec(n, width)`)

**Inbyggda matematik- och strängfunktioner** `abs`, `min`, `max`, `clamp`,
`sgn`, `mod`, `rnd`, `sin`, `cos`, `and`, `or`, `xor`, `not`, `bnot`, `shl`,
`shr`, `len`, `asc`, `val`, `str_to_int`, `numstr`

**Minne och timing** `poke`, `peek`, `poke16`, `peek16`, `fill`, `memcopy`,
`drawmem`, `wait`, `raster`, `delay`, `sys`, `asm`

**Skärm och text** `cls`, `fast`, `color`, `text`, `border`, `bg`, `screen`,
`cursor`, `lowercase`, `uppercase`, `display`, `on`, `off`, `scroll`, `speed`,
`badlines`, `turbo`

**Bitmapp- och blockgrafik** `graphics`, `gcls`, `flip`, `plot`, `plot4`,
`mplot`, `mline`, `mrect`, `mcircle`, `line`, `circle`, `circle4`, `rect`,
`paint`, `erase`, `pen`, `multi`, `block`

**Spriter** `sprite`, `sprdef`, `sprite_frame`, `sprite_x`, `sprite_y`,
`sprhit`, `sprbghit`, `box_hit`, `chardef`, `charset`, `org`, `expand`,
`priority`

**Ljud och musik** `sid`, `sound`, `sfx`, `volume`, `music`, `play`, `pause`,
`resume`, `stop`

**Inmatningsenheter** `getch`, `inkey`, `waitkey`, `joy`, `mouse_x`,
`mouse_x_hi`, `mouse_y`, `mouse_btn`

**Avbrott och vektorer** `irq`, `irq_exit`, `nmi`, `nmi_exit`, `cia_timer`,
`onerr`

**Karaktärskartor och bilder** `map`, `map_tile`, `map_color`, `koala`, `show`,
`hide`

**REU (RAM-expansion)** `reu`, `reudet`, `stash`, `fetch`

**Stilfallgropar — namn som *ser* fria ut men är reserverade**

Dessa vanliga engelska ord ser ut som oskyldiga identifierare men är redan
uppfattade av den som skriver texten. Byt namn för att undvika tysta brytningar:

| Reserverad                                           | Föreslagen namnbyte                 |
| ---------------------------------------------------- | ----------------------------------- |
| `slut`                                               | `stoppa_vid`, `mål`, `sista`        |
| `stopp`                                              | `stoppa_vid`, `stoppa`              |
| ` gånger `                                           | `antal`, `n`, `iter`                |
| `skärm`                                              | `scraddr`, `screen_addr`            |
| `kantlinje`, `bakgrund`, `text`                      | `border_addr`, `bg_col`, `text_col` |
| `klämma`                                             | `lock`, `bunden`                    |
| `linje`, `cirkel`, `rätlinje`                        | `ln`, `cirkel`, `box_r`             |
| `data`, `läs`                                        | `byte`, `nästa_byte`                |
| `ladda`, `spara`, `öppna`, `stäng`                   | `ladda_fil`, ...                    |
| `karta`, `visa`, `dölj`                              | `kakelkarta`, `visa`, `dölj`        |
| `spela upp`, `pausa`, `återuppta`, `stoppa`, `volym` | `spela_låt`, `volym`                |
| `heltal`, `flyttal`, `ord`, `sträng`                 | `n_int`, `speed_f`, `addr`, `msg`   |

Symboliska tokens (`+ - * / = == != < > <= >= : , ; ( ) [ ] # $ % @`) kan
naturligtvis inte användas i identifierare.

### Kommentarer

```basic
# hash comment
rem this is also a comment
var x = 5  # inline comment
var x = 5 : var y = 6  # colon separates statements on one line
```

### Operatörer

```basic
x = x + 1
y = a * b - c / 2
z = x och 15 # bitvis OCH
w = a eller b # bitvis ELLER
v = a xor b # bitvis XOR
m = x shl 3 # skift åt vänster
n = x shr 2 # skift åt höger
r = x mod 40 # 8-bitars modulo (resten); x mod 0 = x, x / 0 = 255
b = bnot x # bitvis INTE: x XOR 255 (komplementera alla 8 bitar)
```

Jämförelser: `==` `!=` `<` `>` `<=` `>=` (retur 1/0)

Aritmetisk kod (1.6.0): `*` med en konstant kompilerar till shifts / shift-add
(`x * 8` → 3× `ASL`), annars till en shift-add-loop på högst 8 rundor. `/` och
`mod` med tvåpotens är `LSR` / `OCH #(n-1)`, annars en 8-rundors
shift-subtract-loop vars körtid inte längre beror på kvoten. Division med noll
definieras: `x / 0 = 255`, `x mod 0 = x` (före 1.6.0 hängde den sig). `x = x +
1` / `x = x - 1` (och ±2) kompilerar till `INC` / `DEC`.

### Ökning / Minskning

```basic
inc x # x = x + 1 (INC zp — enskild instruktion)
dec x # x = x - 1 (DEC zp — enskild instruktion)
```

För variablerna `word` hanteras carry: `inc` använder `INC lo; BNE skip; INC
hi`; `dec` använder `LDA lo; BNE skip; DEC hi; DEC lo`.

### Sammansatta uppgifter

```basic
x += 5 # x = x + 5
x -= 3 # x = x - 3
x *= 2 # x = x * 2
x /= 4 # x = x / 4
x och= 15 # x = x och 15 (bitvis OCH)
x eller= 64 # x = x eller 64 (bitvis ELLER)
x x eller= 255 # x = x x eller 255 (bitvis XELLER)
x shl= 2 # x = x shl 2
x shr= 1 # x = x shr 1
```

### Skriva ut

```basic
print "HELLO"
print x
print x, y, "text"
print # tom rad

print spc(5) # print 5 mellanslag
print tab(20), "VÄRDE" # flytta markören till kolumn 20, print sedan
print "A", spc(3), "B" # blanda fritt

print "A=" + a # sträng + numerisk variabel
print s1 + s2 # två strängvariabler → sekventiell print
print "Hello " + "Världen" # två literaler → kompileringstidsfold
print chr$(13) # print med PETSCII-kod
```

### chr$

```basic
print chr$(65) # utdatatecken med PETSCII-kod 65 ('A')
var c = chr$(n) # lagra bytevärde n i variabel c
print "&gt;" + chr$(42) # kan användas i strängen concat
```

### Förgrening

```basic
om x == 1 då skriv "JA"
annars skriv "NEJ"
slut
```

### Välj / Ärende

```basic
välj x fall 1: skriv ut "ETT" fall 2: skriv ut "TVÅ" annars: skriv ut "ANDRA"
slut
```

`select expr` utvärderar uttrycket en gång och jämför det med varje `case`-värde
i ordning. Den första matchande ärendetexten körs och kontrollen hoppar till
efter `end`. Den valfria `else:`-texten körs om inget ärendetext matchar. Alla
värden måste vara 8-bitars (0–255).

### Loopar

```basic
loop 5 # räknad loop (5 iterationer)
print "HI"
end

times 5 # alias för loop N ... end
print "HI"
end

loop # oändlig loop x = x + 1
om x == 5 fortsätt slut # hoppa till nästa iteration om x == 100 bryt slut
end

var i = 0
för i = 1 till 10 # för..nästa (föredraget) om i == 5 fortsätt slut # hoppa till steg print i
nästa

för i = 0 till 20 steg 2
print i
nästa i # variabelnamn efter 'nästa' är valfritt

för i = 10 till 1 steg -1 # nedräkning — negativ konstant steg stöds
print i
nästa

för i = 20 till 0 steg -2 # avslutas korrekt vid i = 0 (11 iterationer)
print i
nästa i

var i = 0
loop i = 1 till 10 # äldre loop..end syntax — identisk kod
print i
end

while x &lt; 100
x = x + 1
end

repeat # do-while: kroppen körs minst en gång
x = x + 1
tills x == 100 # avslutas när villkoret är sant
```

**Riktningsregler för `for`/`loop`:**

| Fall                                                  | Beteende                                                                                                             |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `for i = 1 to 10` (standard `step +1`, `from ≤ to`)   | räknar uppåt, standard                                                                                               |
| `for i = 0 to 20 step 2` (positivt steg, `from ≤ to`) | räknar upp med 2                                                                                                     |
| `for i = 10 to 1 step -1` (negativt konstant steg)    | räknar ner; kroppen körs för i = 10, 9, ..., 1                                                                       |
| `for i = 20 to 0 step -2` (ner till noll)             | avslutas vid i = 0 genom att detektera omslaget under 0 efter minskningen; ingen oändlig loop                        |
| `for i = 10 to 1` (inget steg, `from > to`)           | **kompileringsfel**: `for-loop: from (10) > to (1) with default step +1 loops 0 times — use 'step -1' to count down` |

Kodform (1.6.0): loopen *roteras* — `JMP test` (utelämnas när konstanta gränser
garanterar ett första pass), kroppen, `var += step`, sedan förgrenar sig testet
längst ner tillbaka till kroppen, så det finns ingen extra `JMP` per iteration.
Steget detekterar 8-bitars omslutning i båda riktningarna (`INC`/`BEQ` eller
`ADC`/`BCS` räknar uppåt, `BEQ`/`DEC` eller `SBC`/`BCC` räknar nedåt), så `för i
= 0 till 255` körs 256 gånger och stoppar, och `för i = N till 0 steg -k` är
alltid ändligt. Konstanta gränser och steg används som omedelbara värden (ingen
nollasida); En icke-konstant gräns eller ett steg utvärderas en gång och sparas
på en permanent nollsida.

Icke-konstanta `step`-värden (t.ex. från en variabel eller ett uttryck)
behandlas som positiva vid kompileringstillfället; om du behöver nedräkning med
ett körtidsstegvärde, dela loopen eller använd en `while`-konstruktion.

### Etiketter och gå till

```basic
etikett huvudloop x = x + 1 om x &lt; 10 så gå till huvudloop slut
```

Vidarebefordra `goto` (etikett definieras senare) stöds fullt ut.

`gosub label` / `return` hoppar till en etikett och går tillbaka (JSR / RTS på
maskinkodsnivå). Etiketten måste vara en `label name`-sats, inte en `sub` — den
har inga parametrar och delar samma nollsidiga omfattning. `gosub` stöder
framåtriktade referenser (etikett definierad efter `gosub`).

```basic
gosub draw_border
...
etikett draw_border
# ... rita något ...
returnera # RTS — återgår till instruktionen efter gosub
```

### Subrutiner

```basic
sub greet() print "HALLÅ!" end

sub set_color(col)
color border col
color text col
end

greet() # ring med parenteser
call greet # ring nyckelord (utan parenteser)
set_color(6)
```

Parametrar skickas via dedikerade nollsidiga platser. Ingen rekursion (platserna
är statiska). Typade parametrar stöds: `sub draw(x, y:int)` eller `sub
copy(src:string)` — strängparametrar får en 2-byte-pekare så att den anropade
kan indexera källsträngen via `src[i]`.

### Funktioner (returvärden)

```basic
fn square(x)
returnera x * x
end

fn add(a, b)
returnera a + b
end

fn clamp(värde, låg, hög)
om värde &lt; låg returnera låg slut
om värde &gt; hög returnera hög slut
returnera värde
end

var s = square(9) # s = 81 — fn anropa som uttryck
var c = clamp(glädje, 0, 39) # c = fastklämt värde
print add(10, 20) # 30 — kan användas inline i print
```

Funktioner stöder en valfri `: word` returtyp för 16-bitarsvärden:

```basic
fn get_addr(): word
return $C000
end

var ptr: word = get_addr() # ptr = $C000
poke ptr, 42 # STA(ptr),Y — giltig indirekt adressering
var v = peek(ptr) # LDA(ptr),Y
```

`fn` genereras i pass 2 (samma som `sub`), så funktionskroppar körs aldrig vid
start. Framåtriktade referenser stöds fullt ut.


#### QBasic-stil `FUNKTION` / `SUB`

```basic
FUNKTION Negyzet (szam SOM HELTAL) SOM HELTAL
    Negyzet = szam * szam ' returvärde = tilldela funktionsnamnet
AVSLUTA FUNKTION

FUNKTION Nagyobb (a SOM BYTE, b SOM BYTE) SOM BYTE
    Nagyobb = a
    OM b &gt; a DÅ
        Nagyobb = b
        EXIT FUNCTION ' återvänder nu, med det värde som tilldelats hittills
    SLUT OM
AVSLUTA FUNKTION

SUB Koszont (nev AS STRING)
    SKRIV UT "Üdvözöllek, "; nev; "!"
END SUB

n = Negyzet(30)
Koszont "Zsolt" ' anrop utan parentes
Koszont("Zsolt") ' ... eller med dem
RING Koszont("Zsolt")
```

- `function` är en synonym för `fn`; `p AS type` fungerar i parameterlistor och
  `AS type` efter `)` ger returtypen (samma typnamn som `dim`). `: type`
  fungerar fortfarande.
- Att tilldela ett namn till funktionen lagras i en dold
  `<namn>__result`-variabel som returneras vid `END FUNCTION` / `EXIT FUNCTION`;
  `return expr` fungerar fortfarande också.
- `END SUB`, `END FUNCTION`, `END IF`, `END SELECT` accepteras (det andra ordet
  är valfritt); `EXIT SUB` / `EXIT FUNCTION` returnerar (vanlig `exit` är
  fortfarande `bye`).
- En sub/fn kan anropas utan parentes: `Koszont "Zsolt"`, `Rajzol x, y`.
- `PRINT a; b; c` — `;` kopplar ihop objekt utan mellanslag; ett avslutande `;`
  undertrycker nyradstecken. Ett `;` följt av en sats (`print x; y = 1`)
  separerar fortfarande satser.
- Accentbokstäver i strängliteraler skrivs ut som sin basbokstav (`ü` → `u`, `ő`
  → `o`); C64-teckenuppsättningen har inga accenter.
- Word/float-parametrar tar nu emot båda byten, och en strängliteral som skickas
  till en `string`-parameter fungerar (tidigare fungerade bara lo byte / a
  strängvariabel).
- Ingen rekursion (parametrar finns i statiska nollsidiga platser); sedan 1.6.3
  är ett rekursivt anrop ett kompileringsfel istället för tyst felaktiga
  resultat.

#### Mer QBasic-syntax (1.6.3)

QBasic-formulären nedan kompileras bredvid den ursprungliga syntaxen
(kommentarerna `==`, `end`, `loop`, `#` fortsätter alla att fungera).

```basic
' kommentar (QBasic-stil, som #)
OM x = 3 SÅ SKRIV UT "tre" ' enkelrad OM: nej END OM behövs
OM x &lt;&gt; 3 SÅ SKRIV UT "nej" ELSE SKRIV UT "ja"
OM n &lt; 0 SÅ SKRIV UT "negativ"
ANDRA OM n = 0 SÅ SKRIV UT "noll"
ANDRA OM

DO WHILE i &lt; 10 : i = i + 1 : LOOP ' även DO UNTIL c … LOOP,
DO : i = i - 1 : LOOP UNTIL i = 0 ' DO … LOOP WHILE c, DO … LOOP (oändlig)
WHILE k &lt;&gt; 5 : k = k + 1 : WEND
FÖR i = 1 TILL 100
OM i = 12 SÅ AVSLUTA FÖR ' AVSLUTA DO / AVSLUTA FÖR / AVSLUTA WHILE
NÄSTA

VÄLJ FALL n FALL 1, 2, 3 : SKRIV UT "liten" FALL 10 TILL 20 : SKRIV UT "tonåring" FALL ÄR &gt; 1000 : SKRIV UT "stor" FALL ANNAT : SKRIV UT "annan"
END SELECT

END ' avslutar programmet (skärmen behålls)
```

- **Villkor:** inuti `IF` / `ELSEIF` / `WHILE` / `UNTIL` / `LOOP WHILE|UNTIL`,
  en enda `=` jämförs. `&lt;&gt;` betyder inte lika överallt (samma som `!=`).
- **Enkelradig OM:** en sats direkt efter `THEN` skapar en enkelradig OM som
  slutar med raden, eller med ett `end` på samma rad (`if c then x = 1 end`, som
  tidigare). En flerradig OM behöver en radbrytning efter `THEN`. Precis som i
  QBasic tillhör allt efter `THEN` på den raden OM (`… THEN EXIT FOR : NEXT`
  skulle svälja `NEXT`).
- **`END` på egen hand:** ett `END` som inte stänger ett block avslutar
  programmet, som QBasic. Ett överskott av `end` visas därför inte längre som
  ett fel.
- **`DO`-block: ** inuti en `DO`, en `LOOP` i slutet av en rad avslutar den (de
  ursprungliga `loopen N … end` / `loopen i = … end`-looparna fungerar
  fortfarande inuti).
- **`SELECT CASE`:** den gamla `select x` / `case n:` formen är oförändrad.
  `SELECT CASE` sänks till en IF-kedja över en dold `select__N` variabel.

#### Strängar vid körning (1.6.3)

```basic
DIM s AS STRING, t AS STRING
s = "Pont: " + pont + "!" ' tal blir text (16-bitars, signerad för INTEGER)
t = s ' en kopia: att ändra s senare ändrar inte t
s = s + "?"
PRINT LEFT$(s, 4); RIGHT$(s, 2); MID$(s, 7, 3); MID$(s, 7)
PRINT LEN(s + t), VAL("1234") + 1, STR$(pont)
IF s = "ABC" ELLER t &lt;&gt; "" THEN PRINT "jämför med = / &lt;&gt;"
```

- **Buffrar:** en strängvariabel som får ett beräknat värde (`+`, `left$`,
  `right$`, `mid$`, numbers, en annan variabel) äger en buffert på 80 tecken;
  längre resultat klipps bort vid 80. Att tilldela en literal pekar fortfarande
  bara på den.
- **Strängmatriser:** element som får ett icke-litteralt värde (eller `input`)
  får sin egen 32-byte-plats (31 tecken), så `input nevek(i)` i en loop behåller
  alla namn.
- **`STR$` / `VAL`:** `STR$` för ett 16-bitars eller teckenförtecknat värde har
  inga inledande nollor (`"-42"`). För kompatibilitet behåller `STR$` för en
  byte den 3-siffriga formen (`"007"`). `VAL` läser 16-bitars teckenförtecknade
  tal (`VAL("1234") + 1` = 1235).
- **Jämförelse:** endast `=` / `&lt;&gt;` (och `==` / `!=`); det finns ingen
  `&lt;` / `&gt;` ordning på strängarna.

#### Signerat HELTAL, INMATNING, DUBBELT (1.6.3)

- **INTEGER har tecken:** `DIM x AS INTEGER` har tecken 16-bitars (−32768 …
  32767, som QBasic): utskrift, `&lt;` `&gt;` jämförelser, `/` (avkortas mot
  noll), `ABS`, textkonvertering, `INPUT` och `FOR` loopar genom noll (`FOR i =
  3 TO -3 STEP -2`) följer alla tecknet. `WORD` förblir osignerad 0 … 65535.
  Unär minus fungerar var som helst (`a &lt; -10`, `x * -2`).
- **`FOR` med en 16-bitars räknare** (`INTEGER` / `WORD`) är en riktig 16-bitars
  loop. Den brukade varva vid 256, så `FOR k = 0 TO 300` kördes 45 gånger.
- **`INPUT`:** i ett INTEGER / WORD läser upp till 6 tecken (med `-` för
  INTEGER), i ett DOUBLE accepterar `12.5` (två decimaler). `INPUT t(i)` läser
  in i ett arrayelement, och `INPUT "prompt"; x` fungerar också.
- **DUBBELT ÷ DUBBELT** är nu exakt (`7,5 / 2,5 = 3,00`); tidigare användes
  endast divisorns heltalsdel. DUBBELT × DUBBELT stöddes redan.
- **Arrayer över 256 byte** (`DIM t(200) AS INTEGER`, `DIM g(19, 19)`) arbetar
  med variabla index; indexet som används för att radbrytas vid 256 och skrivas
  in i fel element.
- **Rekursion** (en delfunktion som anropar sig själv, direkt eller via andra)
  är ett kompileringsfel. Det brukade kompilera och returnera fel resultat,
  eftersom parametrar finns i fasta noll-sidesplatser.

### Matriser

```basic
var scores = array(8) # 8 byte vid $C000
# (alla arrayer fylls med noll vid programstart — nytt i 1.5.7)

scores[0] = 100 # konstant index → STA $C000
scores[i] = 99 # variabel index → STA (ptr),Y
var v = scores[i] # LDA (ptr),Y
print scores[2] # användbar inline i print

var moments = array_word(8) # 16 byte (8×2) vid $C000+

moments[0] = $1234 # konstant index → STA $C000 (lo), STA $C001 (hi)
moments[i] = $5678 # variabel index → ASL A för stride; (ptr),Y × 2
var t: word = moments[1] # LDA $C002, LDA $C003
```

**Flerdimensionella arrayer** (nytt i 1.5.3)

Matriser kan deklareras med mer än en dimension. De lagras **rad-stor** och
indexeras med en kommaseparerad nedsänkt lista. Den totala storleken är
produkten av alla dimensioner.

```basic
var grid = array(8, 8) # 8×8 = 64 byte vid $C000
grid[1, 0] = 11 # rad 1, kolumn 0 → flat index 1*8+0 = 8 → STA $C008
grid[0, 1] = 22 # rad 0, kolumn 1 → flat index 1 → STA $C001
grid[r, c] = 33 # variabel → beräknar r*8 + c, sedan STA(ptr),Y
var v = grid[r, c] # LDA(ptr),Y

var wm = array_word(4, 4) # 4×4 ord array = 32 byte
wm[1, 2] = $ABCD # element 1*4+2 = 6 → byte $C00C/$C00D

const ROWS = 3
const COLS = 5
var m = array(ROWS, COLS) # dimensioner kan vara kompileringstidskonstanter
```

Row-major-layout innebär att det sista indexet är sammanhängande: `grid[r, c]`
sitter vid `base + r*COLS + c`. Valfritt antal dimensioner stöds (`array(a, b,
c)`). När varje index är en konstant viks adressen vid kompileringstid till en
enda absolut lagring/laddning; ett variabelt index genererar `row*stride +
col`-beräkningen och en indexerad `(ptr),Y`-åtkomst. Ett enda index i en
flerdimensionell array är fortfarande tillåtet och behandlas som ett
platt/linjärt index (`grid[10]`). Dimensioner måste vara
kompileringstidskonstanter (litteraler eller `const`s), och arrayen måste
deklareras innan den indexeras.

**Strukturtyper (`type ... endtype`, nytt i 1.5.4)**

Definiera en fast layout för namngivna fält med `type`, allokera sedan en array
av instanser på samma sätt som en vanlig array. Fältåtkomst använder
`arr[idx].field` och fungerar för både konstanta och variabla index.

```basic
typ TEntity
var x: int # 1 byte
var y: int # 1 byte
var hp: ord # 2 byte → elementstorlek = 4
endtype

const N = 8
var enemies: TEntity = array(N) # allokerar N × 4 = 32 byte vid $C000

enemies[0].x = 5
enemies[0].y = 10
enemies[0].hp = $0100
var v = enemies[0].hp # läs tillbaka — LDA $C002 / LDA $C003

var i: int = 2
enemies[i].x = 42 # variabelindex → idx * elementstorlek + offset

# Flyttal (Q8.8 fast punkt)
typ TBall
var bx: int # 1 byte
var by: int # 1 byte
var vel: flyttal # 2 byte Q8.8 → elementstorlek = 4
endtype

var balls: TBall = array(3)
balls[0].vel = 1.5 # lagrar Q8.8: hi=1, lo=128
var f: float = balls[0].vel # läser flyttalsfältet till flyttalsvariabeln
print balls[0].vel # skriver ut "1.50"
```

Regler och begränsningar:

- Fälttyper: `int` (1 byte), `word` (2 byte LE), `float` (2 byte Q8.8). `string`
  och kapslade `type`-fält stöds ännu inte.
- Elementstorlek = summan av fältbredderna (deklarationsordning, ingen
  utfyllnad).
- Lagring finns på `$C000+` tillsammans med vanliga arrayer och visas i
  minneskartan som en vanlig array med den totala bytestorleken.
- Konstant index → `LDA/STA absolute` vid kompileringstid.
- Variabelindex → shift-and-adder-multiplikation för `idx * elem_size`, sedan
  indexerad `(ptr),Y`-åtkomst. Elementstorlekar som är potenser av två (1, 2, 4,
  8, 16) använder bara `ASL A`-kedjor; andra storlekar avger en kort
  shift-adder-sekvens via två nollsidiga byte.
- Sub-/fn-parametrar av en struct-typ stöds ännu inte — skicka istället arrayen
  och ett index, t.ex. `sub move(idx: int) ... enemies[idx].x = ...`.
- Standardfältvärden (`var fire: int = 2` inuti typen) analyseras för
  kompatibilitet med förslaget men har ännu inte initierats vid
  allokeringstillfället.
- Endast ett nedsänkt tecken är tillåtet på en struct-typad array;
  flerdimensionella struct-arrayer stöds inte (använd ett beräknat platt index).

Se `examples/type_demo.ub`.

### 16-bitars (ord)variabler

```basic
var ptr: word = $0400 # två ZP-byte: lo=$00 hi=$04
peta ptr, 6 # STA (ptr),Y
var v = peek(ptr) # LDA (ptr),Y
```

**16-bitarsprodukter (åtgärdat i 1.5.7).** En produkt som tilldelats ett `word`
behåller alla 16 bitar, även när ingen av faktorerna är ett `word`:

```basic
var poäng: ord = 0
var nivå = 3
poäng += 300 * nivå # 900 (före 1.5.7 var detta avkortat till 8 bitar: 44)
poäng = poäng + 100 * nivå
var stor: ord = 100 * nivå + 900
```

Sedan 1.6.1 gäller detta även inom summor och för `shl`, och för konstanta
multiplikatorer över 255: `py = cy * 8 + fy`, `py = (cy shl 3) + fy` och `w = cy

### Bitmappsgrafik

```basic
grafik på # VIC-II använder bitmappsläge (320×200, 1bpp); bitmapp vid $2000
grafik på multi # VIC-II flerfärgsbitmappsläge (160×200, 2bpp, 4 färger/cell)
grafik av # återgå till textläge

gcls # rensa bitmapp (fyller $2000-$3FFF) + ställ in videomatrisfärger

plot x, y # ställ in pixel vid (x, y); x: 0-319, y: 0-199
plot radera x, y # rensa pixel (OCH ~mask)
plot xor x, y # växla pixel (EOR-mask) — flimmerfri animering
cirkla in x, y, r # mittpunkt cirkel centrerad vid (x, y) med radie r; klipper punkter utanför skärmen
linje x1, y1, x2, y2 # Bresenham-linje från (x1,y1) till (x2,y2); x: 0-319, y: 0-199
radera linje x1, y1, x2, y2 # rensa pixlar längs linjen (OCH ~mask)
linje xor x1, y1, x2, y2 # växla pixlar längs linjen (EOR-mask)
rect x1, y1, x2, y2 # rita rektangelkontur (4 kanter); x: 0-319, y: 0-199
radera rektangel x1, y1, x2, y2 # rensa rektangelkontur (OCH ~mask)
rect xor x1, y1, x2, y2 # XOR rektangelkontur (EOR-mask)
måla x, y # 4-kopplad fyllning från (x, y); fyller rensa pixlar begränsade av ange ettor

färgpenna c # ange anställningens ritfärg (0-15); se nedan

# ── Flerfärgad bitmapp (grafik på multi, 160×200) ──
mplot x, y, color # set multicolor pixel (x: 0-159, y: 0-199, color: 0-3)
mline x1, y1, x2, y2, color # multicolor line
mrect x1, y1, x2, y2, color # multicolor rectangle outline
mcircle x, y, r, color # multicolor circle
```

Båda `graphics on`-varianterna tömmer displayen (`LDA $D011 / AND #$EF / STA
$D011`) när de växlar VIC-register, och återaktiverar den sedan i målläget —
förhindrar problem med lägesbytet.

`x` kan vara hela `0–319`-intervallet. Koordinater över 255 hanteras automatiskt
(hjälparen lägger till den nionde X-biten), så `plot`, `line`, `circle` och
`rect` når alla skärmens högra kant. Använd en `word`-variabel när en
X-koordinat kan överstiga 255.

#### Anställer ritfärg — `color pen`

I anställningsläge (320×200) är färgen **per 8×8 cell**, hålls i videomatrisen
(hög nibble = förgrund, låg nibble = bakgrund), inte per pixel. `color pen c`
anger en beständig förgrundsfärg (0-15) som `plot`, `line`, `rect`, `circle` och
`paint` stämplar in i cellen för varje pixel de ritar; cellens bakgrundsnibble
bevaras. Den förblir aktiv till nästa `color pen`. Standardinställningen är vit
(1), så program som aldrig anropar `color pen` ser exakt ut som tidigare.

```basic
grafik på
gcls
färgpenna 2 # röd
linje 0, 0, 100, 100
färgpenna 6 # blå
cirkel 160, 100, 40
display på
```

#### Flerfärgade former — `mline` / `mrect` / `mcircle`

I flerfärgsläge (`graphics on multi`, 160×200) väljer varje pixel en av fyra
färgkällor via ett 2-bitarsvärde (`%00` bakgrund `$D021`, `%01` skärm hög
nibble, `%10` skärm låg nibble, `%11` färg-RAM). `mplot` anger en enda sådan
pixel; `mline`, `mrect` och `mcircle` ritar former på samma sätt — det
efterföljande `color`-argumentet är 2-bitarskällan (0-3), och de faktiska
färgerna kommer från cellpaletten (skärm / färg-RAM) exakt som för `mplot`.

```basic
grafik på multi
gcls
mcircle 80, 100, 40, 1
mrect 10, 10, 150, 190, 2
mline 0, 0, 159, 199, 3
display på
```

`mline`/`mrect`/`mcircle` återanvänder samma Bresenham-/mittpunktsrutiner som
deras motsvarigheter i anställningsprogrammet, och plottar varje pixel genom
`mplot`; punkter utanför skärmen (x ≥ 160 eller y ≥ 200) hoppas över.

### Dubbelbuffrad bitmapp (flimmerfri)

```basic
grafik på dubbel # dubbelbuffrad anställer bitmapp (320×200)
gcls # rensar den DOLDDA bakre bufferten
rad 0, 0, 319, 199 # alla ritningar (plot/line/circle/rect/paint/gcls) går till bakre bufferten
vänd # visa den ritade bufferten; omdirigera ritningen till den andra
grafik av # tillbaka till textläge (återställer VIC bank 0)
```

`graphics on double` behåller **två** kompletta anlitade bitmappar och visar
endast färdiga bildrutor, vilket eliminerar flimmer utan några XOR-trick — varje
bildruta `gcls`, ritar du och sedan `flip`.

| Buffert                   | Bitmapp     | Videomatris | VIC-banken | `$DD00` låga bitar |
| ------------------------- | ----------- | ----------- | ---------- | ------------------ |
| A (framsida, visas först) | 2000 dollar | `$0400`     | bank 0     | `%11`              |
| B (baksida, ritad först)  | 6000 dollar | 4400 dollar | bank 1     | `%10`              |

* Alla pixelkommandon skriver genom en runtime **draw base** (en nollsidig
  byte), så de riktar sig automatiskt mot den buffert som för närvarande är
  dold.
* `flip` väntar på den nedre gränsen (raster ≥ 251) innan VIC-banken byts, så
  att växlingen är **fri från tearing**, och pekar sedan ritbasen mot den nu
  dolda bufferten.
* Typisk loop: `gcls` → rita ramen → `flip`. Anropa `display on` en gång efter
  den första `flip` så att den första visade bufferten redan är komplett.

**Krav / begränsningar:**
* Endast anställningar (inte `multi`). Sprites hämtas inte från den bakre
  buffertens VIC-bank.
* Bakbufferten använder `$4000–$7FFF` (matris `$4400`, bitmapp `$6000–$7FFF`),
  så programmets maskinkod måste hålla sig under `$4400`. De flesta demos är
  bara några få kB stora, så detta sker automatiskt; mycket stora program kan
  inte använda dubbel buffring.
* På en standard 1 MHz C64 begränsar den fullständiga `gcls` (8 KB) per bildruta
  bildhastigheten; på Commodore 64 Ultimate höjs `speed` för jämn
  höghastighetsanimation.

Se `examples/cube_demo.ub` — en tumlande 3D-trådmodellkub renderad flimmerfri.

### Blockgrafik (80×50)

```basic
grafik på block # 80×50 blockpixelläge (textläge + anpassad 4-pixel teckenuppsättning @ $2800)
grafik av # återgå till textläge
gcls # rensa blockets spelfält: skärm-RAM $0400-$07FF + färg-RAM $D800-$DBFF

plot4 x, y # sätt blockpixel vid (x, y); x: 0-79, y: 0-49
plot4 radera x, y # rensa blockpixel vid (x, y)
circle4 x, y, r # rita mittpunktscirkel i blockpixlar; klipp till 80×50
```

Ett tjockt lågupplöst läge ovanpå standard 40×25-text. En anpassad
teckenuppsättning med 16 tecken kopierad till `$2800` kodar ett 2×2
kvadrantrutnät per tecken (bit3=TL, bit2=TR, bit1=BL, bit0=BR), så varje
textcell innehåller 2×2 blockpixlar → ett effektivt 80×50-rutnät. Inget
bitmapps-RAM används (`$2000-$3FFF` förblir ledigt), vilket gör det snabbare än
att hyra bitmapp. `plot4` ELLER om kvadrantbiten är in i cellen så att
överlappande pixlar ackumuleras; `plot4 erase` rensar den. `circle4` använder
samma blockpixelhjälpare för att rita en konturcirkel i 80×50-koordinatutrymmet.
`gcls` rensar både skärm- och färg-RAM. Se `examples/block_demo.ub`.

### Skärm och färg

```basic
cls # rensa skärm (KERNAL $E544)
cls snabbt # snabb ifyllning: skärm-RAM + färg-RAM + HOME

färg text 14 # text färg register $0286
färg kantlinje 6 # $D020
färg bakgrund 0 # $D021
färgpenna 2 # anlitar ritfärg (0-15) för plot/linje/rektangulär/cirkel/målning

skärm 0, 0, 65 # skriv tecken 65 ('A') till skärm-RAM vid kolumn 0, rad 0 ($0400)
skärm 10, 5, ch # kolumn 10, rad 5 — kolumn/rad kan vara variabler
skärm 5, 3, 42, 7 # tecken 42 vid kolumn 5, rad 3, färg 7 (skriver även färg-RAM $D800)
skärm x, y, ch, kolumn # alla fyra argument som variabler

display på # återaktivera VIC-display ($D011 DEN bit)
display av # blank display

gemener # CHR$(14) → växla VIC-II till gemener/versaler
versaler # CHR$(142) → växla VIC-II tillbaka till versaler/grafik

markör 20, 10 # flytta markören till kolumn 20, rad 10 (KERNAL PLOT $FFF0)
markör x, y # kolumn från variabel x (0–39), rad från y (0–24)

print at 20, 10, "HELLO" # markör(20,10) + print in one-sats (ingen avslutande radbrytning)
print at x, y, "Poäng:", poäng # valfri blandning av uttryck
print at 0, 0 # endast position (ingen text, ingen radbrytning)

scroll x 3 # sätt horisontell fin rullning: $D016 bitar 0-2 = 3 (0-7)
scroll y 2 # sätt vertikal fin rullning: $D011 bitar 0-2 = 2 (0-7)
scroll x n # värdet kan vara en variabel eller ett uttryck (maskerat till bitar 0-2)
scroll x 7 narrow # ställ in fin scroll och tvinga fram 38-kolumnsläge (dölj kantkolumn)
scroll x 0 wide # ställ in fin scroll och återställ 40-kolumnsläge
scrolla rad 12 åt vänster # flytta skärmens RAM-rad 12 åt vänster med ett tecken
```

`lowercase` genererar `LDA #$0E; JSR $FFD2` vid körning. Strängliteraler som
kompileras efter `lowercase` får sina gemener och versaler automatiskt
omväxlande — källtecken i versaler lagras i PETSCII-platsen för gemener (`$61+`)
och källtecken i gemener i platsen (`$41+`) — så `"Hello World"`-källkoden visas
som **Hej världen** på skärmen. `uppercase` genererar `LDA #$8E; JSR $FFD2` och
återgår till direkt mappning. `cls` återställer **inte**
teckenuppsättningsläget.

`scroll x n` skriver `(n AND 7)` till bit 0-2 av `$D016` (bit 3-7 bevaras).
`scroll x n narrow` skriver finskrollningsbitarna och rensar `$D016` bit 3
(38-kolumnsläge). `scroll x n wide` skriver finskrollningsbitarna och sätter
`$D016` bit 3 (40-kolumnsläge). `scroll y n` skriver `(n AND 7)` till bit 0-2 av
`$D011` (bit 3-7 bevaras). `scroll row R left` flyttar en konstant skärmrad åt
vänster; skriv det nya tecknet längst till höger med `screen 39, R, ch`.
Användbart för smidig hårdvaruskrollning: minska varje bildruta från 7 ner till
0, flytta skärm-RAM, återställ till 7.

`screen col, row, char [, color]` skriver direkt till skärmens RAM (`$0400 +
row*40 + col`) och eventuellt till färgat RAM (`$D800 + row*40 + col`). Konstant
col/row: adress beräknad vid kompileringstid.

### Ultimate 64 — CPU-hastighet

```basic
hastighet 4 # sätter CPU till 4 MHz (läser $D031, uppdaterar bitar 0-3, skriver tillbaka)
hastighet 48 # 48 MHz (maxhastighet på U64)
hastighet max # samma som hastighet 48 (alias)
hastighet av # tillbaka till 1 MHz (alias för hastighet 1)

badlines på # aktiverar badline-timing ($D031 bit 7 = 0, standard C64-beteende)
badlines av # inaktiverar badline-timing ($D031 bit 7 = 1, fler CPU-cykler)

var t = turbo() # 1 om turbo är aktiv (bitar 0-3 av $D031 != 0), 0 om vid 1 MHz
```

Tillgängliga MHz-värden: `1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 20, 24, 32, 40,
48`. Konstanta värden avrundas nedåt till närmaste tillgängliga hastighet vid
kompileringstillfället. Variabla värden behandlas som ett rått hastighetsindex
(0–15) och ELLER-omvandlas till bitar 0-3 av `$D031`.

| $D031 index | MHz (U64) | MHz (U64 Elite-II) |
| ----------- | --------- | ------------------ |
| 0           | 1         | 1                  |
| 3           | 4         | 4                  |
| 6           | 8         | 10                 |
| 11          | 20        | 24                 |
| 15          | 48        | 64                 |

Kräver **U64 Turbo Control** inställd på `U64 Turbo Registers` eller `Turbo
Enable Bit` i U64-konfigurationsmenyn. På en vanlig C64 eller emulator utan
register ignoreras `poke` till `$D031` tyst.

### Tangentbord

```basic
var key = getch() # upptagen-vänta på $FFE4 tills nyckel; returnerar PETSCII-kod
var k = inkey() # icke-blockerande: returnerar PETSCII-kod, eller 0 om ingen tangent trycks ner
waitkey # vänta tills valfri tangent trycks ner (CIA1-matrisskanning; fungerar under IRQ)
var k = waitkey() # samma men returnerar råa $DC01-kolumnbitar (0 bit = tangent nedtryckt)
var j = joy(2) # läs joystickport 2; returnerar inverterade bitar 0-4
var j = joy(1) # läs joystickport 1
# bit0=upp(1) bit1=ner(2) bit2=vänster(4) bit3=höger(8) bit4=eld(16)
var mx = mouse_x() # 1351 mus: ackumulerad X-position (hjälpare: laddning+fördröjning+delta)
var my = mouse_y() # 1351 mus: ackumulerad Y-position (EOR #$FF inverterad)
var mb = mouse_btn() # musknappar: läser $DC01 — bit0=vänster (eld), bit1=höger (uppåtriktad pin)
```

`mouse_x()` / `mouse_y()` kör internt en hjälprutin som hanterar: CIA1 `$DC00`
kondensatorladdning, ~516-cyklers fördröjning, SID POT X/Y-registerläsning
(`$D419`/`$D41A`), signerad 7-bitars delta-beräkning, Y-axel `EOR #$FF`
inversion och ackumulerad positionsspårning (permanent ZP-tillstånd, 8 byte).
Hjälparen samplar POT två gånger per ram. `mouse_y()` anropar **inte** hjälparen
(endast `mouse_x()` gör det) — den läser bara den cachade `accum_y` för att
undvika dubbeluppdatering.

Hjälparen underhåller en 9-bitars X-ackumulator (`accum_x` + `accum_x_hi` med
carry/borrow). Använd `var sx: word = mouse_x()` — kompilatorn lagrar både lo-
och hi-byte, så `sprite`-kommandot hanterar `$D010` korrekt för X-positioner
bortom 255.

Hjälparen lagrar sitt tillstånd i ZP (`$02`–`$09`). Init-flaggan måste vara noll
före det första anropet — nollställ området med `fill $02, 7, 0` tidigt i ditt
program. Inaktivera även CIA1-avbrott (`poke $DC0D, $7F`) för att förhindra att
KERNAL IRQ vidrör `$DC00` under tangentbordsskanning — vilket stör
POT-avläsningen.

Se `examples/mouse_demo.ub` för en fungerande 1351-musdemo med sprite-spårning
och knappfeedback.

### Utgång

```basic
hej då # JSR $E544 (ren skärm), rensa STOP-flaggan, RTS till BASIC
avsluta # alias för hej då
```

### Tidpunkt

```basic
vänta 50 # vänta 50 rasterlinjeövergångar (~3,2 ms)
vänta raster 100 # snurra tills $D012 == 100 (rasterdelningseffekter)
fördröjning 1 # vänta 1 PAL-bildruta (1/50 s ≈ 20 ms)
fördröjning 20 # vänta 20 bildrutor ≈ 0,4 s; n kan vara en variabel (0–255)
```

`delay N` räknar N kompletta PAL-bildrutor med rasterlinje 200 som
bildrutegräns.

### SID-ljud

```basic
ljud 0, $1CAD, 25 # röst 0, frekvens $1CAD (≈ mellersta C PAL), 25 bildrutors varaktighet
ljud 1, frekvensord, 50 # röst 1, frekvens från ord variabel, 50 bildrutor (1 s vid 50 Hz)
ljud 2, 0, 0 # röst 2, tystnad

sid volym 15 # huvudvolym full ($D418 = $0F); intervall 0-15
sid volym 0 # tystnad (huvudvolym = 0)
sid stopp # nollställ alla 25 SID-register ($D400–$D418) — fullständig tystnad
```

`sound <channel>, <freq>, <duration>` — längd i PAL-bildrutor (1/50 s vardera).
`sound` **blocks**: programmet väntar tills tonen är klar (använd `sfx` nedan
inuti en spelloop). Åtgärdat ADSR: attack/decay `$09`, sustain/release `$F0`,
sågtandsvågform. Mastervolym `$D418` alltid inställd på `$0F`.

*Åtgärdat i 1.5.7:* väntslingan tittade på rasterrad 0, vilken `$D012` (endast
låg 8 bitar) visas två gånger per bildruta (rad 0 och 256), så varje ton varade
**halv** så länge som begärdes — och två grenar patchades över sin opkod, vilket
kraschade programmet under någon annan varaktighet än 0. `sound` väntar nu på
rasterrad 200 precis som `delay`.

`sid volume N` skriver N till `$D418`. Bitarna 0-3 = volym (0-15), bitarna 4-7 =
filterläge. `sid stop` avger en 10-byte nollfyllningsslinga — snabbare än 25
individuella pokes.

### Icke-blockerande ljudeffekter (`sfx`) — nytt i 1.5.7

```basic
ljud 0, $2000, 25 # BLOCK: programmet väntar 25 bildrutor här
sfx 0, $2000, 25 # returnerar direkt; tonen tonar ut av sig själv
sfx 1, $0500, 8, 128 # valfri våg: 16 triangel, 32 såg (standard), 64 puls, 128 brus
sfx 0, freq_word, 4, 16 # freq kan vara en konstant, en ordvariabel eller ett 8-bitarsuttryck
```

`sfx <channel>, <freq>, <frames> [, <wave>]` programmerar en SID-röst och
returnerar omedelbart, så den är säker inuti en spelloop. Det finns ingen
gate-off-timer: enveloppen är inställd på att attackera 0 / sustain 0 / release
0 och **decay** väljs vid kompileringstid från `frames` (1 ram = 20 ms, närmaste
SID-decaytid: 6, 24, 48, 72, 114, 168, 204, 240, 300, 750, 1500, 2400 ms ...),
så tonen dör bort under ungefär den tiden. Den återaktiverar rösten varje anrop
(gate av, sedan på) och ställer in huvudvolymen `$0F`. `channel` (0-2), `frames`
(1-255) och `wave` måste vara kompileringstidskonstanter.


### SID Music

```basic
ladda sid "tune.sid" # bädda in SID-musik på dess ursprungliga laddningsadress
ladda sid "tune.sid", $2000 # åsidosätta: bädda in vid $2000 oavsett SID-rubrik
```

`load sid` läser en PSID- eller RSID-fil vid **kompileringstid**, raderar
rubriken och lägger till de råa musikbytena i utdata `.prg`. Efter `load sid`
blir två kompileringstidskonstanter tillgängliga:

| Konstant   | Beskrivning                                                                     |
| ---------- | ------------------------------------------------------------------------------- |
| `sid_init` | Init-rutinadress — anropa en gång med A = låtnummer (0-baserat)                 |
| `sid_play` | Spela upp rutinadress — anropa varje bildruta (50 Hz PAL) från en IRQ-hanterare |

Båda konstanterna fungerar överallt där en konstant adress accepteras: `sys`,
`irq`, `poke`, uttryck.

**Typisk användning:**

```basic
ladda sid "music.sid"

sub music_irq()
poke $D019, $FF # ACK VIC raster IRQ
sys sid_play # gå framåt en bildruta med musik
irq_exit # JMP $EA81: återställ A/X/Y + RTI (korrekt IRQ-utgång)
end

sys sid_init, 0 # initiera SID-chip: A=0 → första sublåten
irq music_irq, $C0 # raster IRQ vid linje $C0 → 50 Hz på PAL

sid volym 15 # huvudvolym på
```

**Anteckningar:**
- SID-data placeras **efter** all genererad kod, utfylld med nollor upp till
  laddningsadressen. Kompilatorn varnar om SID-laddningsadressen skulle
  överlappa genererad kod.
- PSID v1 och v2 stöds. Om SID-headerns laddningsadress är 0 används de två
  första databytena som adress (PRG-stil, little-endian).
- Endast en `load sid` per program är meningsfull (den sista vinner).

### Tracker-låtar (`tune`)

```basic
justering # valfritt: justering vid $C800 (standard $8000) hastighet 6 # bildrutor per rad (50 Hz PAL) inst 0, $41, $09, $F0, $0800, $0064, $27, $1F inst 1, $10, $08, $A8, $0400, $0000, $00, $0F imod 0, 6, 3, 9, 40, $0200, $0E00 # vibrato + pulsbreddsmodulering (1.6.2) ifilt 0, $0500, 20, 1 # avgränsningssvep upp till $500, fram och tillbaka (1.6.2) igate 1, 2, 1, $09 # gatetimer, hård omstart, första bildrutan $09 (1.6.2) itab 1, 2, 0, ".. +0", ".. +4", ".. +7" # arpeggiotabell (1.6.2) ordning 0, 1, 0 # mönsterordning (mönster kan upprepas) pat 0, 0, "C-4 00", "...", "E-4 00 V24", "...", "G-4 00", "... .. C00" pat 0, 1, "C-2 01", "...", "...", "...", "G-2 01 F03" pat 1, 0, "G-4 00", "...", "E-4 00", "...", "C-4 00"
end
musikuppspelning # eller: sys sid_init / irq-hanterare som anropar sys sid_play
```

`tune ... end` beskriver en 3-stämmig spårningsmelodi i klartext (samma
cellnotation som Visual Assembler SID-editorn visar) och bygger spelaren **vid
kompileringstid**. Den definierar `sid_init` / `sid_play` exakt som `load sid`,
så `music play`, `music stop`, `music pause` och `music resume` (och en manuell
`irq`-hanterare som anropar `sys sid_play`) fungerar oförändrat.

| Linje                                                             | Menande                                                                                                                                                                                                                                                                                                                                                             |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `hastighet N`                                                     | Bildrutor per spårningsrad (1–255).                                                                                                                                                                                                                                                                                                                                 |
| `inst-id, ctrl, ad, sr, pw, cutoff, resilt, modevol`              | Ett instrument: kontrollregister (vågformsbitar plus ringmod `$04` / synk `$02`; gate-biten läggs till av spelaren), attack/decay, sustain/release, 12-bitars pulsbredd, 11-bitars filteravstängning, resonans-/filterrouting-byte (`$D417`-stil: valfri routing-bit = routa rösten som spelar detta instrument) och mode/volym-byte (`$D418`-stil, bit 7 = 3 OFF). |
| `imod id, vibdelay, vibspeed, vibdepth, pwmspeed, pwmmin, pwmmax` | (1.6.2) Instrumentvibrato: efter `vibdelay`-ramar en triangel-LFO som vrider varje `vibspeed`-ram (1-15, 0 = av), djup 0-15 (skalat till notens halvton). Pulsbreddsmodulering: `pwmspeed` tillagd per ram (0 = av), studsar mellan `pwmmin` och `pwmmax`.                                                                                                          |
| `iFilt-id, cutend, svep, pingis`                                  | (1.6.2) Filtergränssvep: från `instant`-gränsen mot `cutend` med `svep` (0-127) per bildruta; `pingpong` 1 = fram och tillbaka.                                                                                                                                                                                                                                     |
| `igate-id, gatetimer, hård omstart, firstwave`                    | (1.6.2) Grinden släpps `gatetimer` ramar före nästa ton på rösten (håll den under `speed`); `hardrestart` 1 sätter även ADSR till 0 då. `firstwave` (t.ex. `$09` = test + gate) skrivs på tonens första ram.                                                                                                                                                        |
| `itab-id, hastighet, loop, "steg", ...`                           | (1.6.2) Vågform/arpeggio-tabell, upp till 32 steg: `"WW +n"`, `".. -n"` eller `"WW =n"` - vågform i hexagonal (`..` behåller den) och en tonförskjutning i halvtoner eller en absolut ton (`=60`). Ett steg varje `hastighets` bildruta, sedan tillbaka till steg `loop` (255 = stanna på sista steget).                                                            |
| `ordning p, p, ... `                                              | Mönsterordning. Linjerna ackumuleras, upp till 255 steg.                                                                                                                                                                                                                                                                                                            |
| `klappa p, v, "cell", ...`                                        | Upp till 32 rader för röst `v` (0-2) av mönster `p` (0-7). Saknade rader är tomma.                                                                                                                                                                                                                                                                                  |

En **cell** är `NOTE INST FX`: `C-4`, `D#3`, `Eb2` eller `...` för ingen not,
ett tvåsiffrigt hexagonalt instrument (`..` för att lämna det), och en valfri
effekt - `Vxy` vibrato (x = håll rader, y = djup), `Uxx` / `Dxx` glid upp / ner,
`C` notklipp, `Fxx` inställd hastighet. En cell med endast effekter kan skrivas
som `"... .. F06"` eller bara `"F06"`.

Anteckningar om spelaren:

- Alla spelartillstånd finns ** inuti blobben ** (absolut adressering) - den
  använder ingen nollasida, så den kan inte kollidera med
  UltimateBasic-variabler eller temporära variabler, och den fortsätter att
  fungera när programmet återgår till BASIC.
- Varje bildruta (1.6.2) kör spelaren varje rösts wave/arpeggio-tabell, vibrato,
  pulsbreddsmodulation och gate-timer/hård omstart, samt cutoff-svepet för den
  röst som senast startade ett filterdirigerat instrument (den äger filtrets
  cutoff, resonans och läge; `$D417` dirigerar varje röst vars nuvarande
  instrument är filterdirigerat). Det är samma algoritm som Visual Assembler
  SID-editorns exporterade spelare och förhandsvisning, bildruta för bildruta.
- Blobben placeras på en fast adress (standard `$8000`, eller `tune på $addr`)
  och `.prg` utfylls upp till den, som `load sid`. Håll den fri från din kod,
  arrayer (`$C000+`) och eventuellt bitmapps-/teckenuppsättningsminne. En tune
  behöver cirka 2,5 KB plus 12 byte per rad-kolumn med data.
- Högst 8 mönster (32 rader vardera); beställningslistan kan upprepa dem fritt.
- `music play` använder CIA1-timern vid 50 Hz; kombinera den inte med en annan
  `load sid`/`tune` (den sista vinner).

### Musikuppspelning

`musik spela/stoppa/pausa/återuppta` är ett övergripande alternativ till den
manuella `sys sid_init` / `cia_timer`-installationen. Kräver en tidigare `load
sid`-sats eller ett `tune ... end`-block (båda definierar `sid_init` /
`sid_play`).

```basic
ladda sid "tune.sid" # bädda in SID-fil (definierar sid_init / sid_play)

musikuppspelning # initiera undermelodi 0 + starta CIA1 50 Hz IRQ
musikuppspelning 1 # starta från undermelodi 1 (baserat på låtnummer 0)
musikstopp # stoppa uppspelning + nollställ alla 25 SID-register ($D400-$D418)
musikpaus # inaktivera CIA1 timer A IRQ (musiken fryser, SID oförändrat)
musikåteruppta # återaktivera CIA1 timer A IRQ (fortsätter från pauspunkt)
```

| Påstående              | Effekt                                                                                                |
| ---------------------- | ----------------------------------------------------------------------------------------------------- |
| `musikuppspelning [n]` | anropa `sid_init(n)`, konfigurera CIA1-timer A till 19 656 cykler (~50 Hz PAL), installera IRQ-omslag |
| `musikstopp`           | inaktivera CIA1 IRQ + nollställ alla 25 SID-register                                                  |
| `musikpaus`            | inaktivera CIA1 IRQ (SID-utmatningen förblir fryst)                                                   |
| `musik-CV`             | återaktivera CIA1 IRQ (fortsätter från pauspunkten)                                                   |

IRQ-omslaget (som skickas ut en gång i slutet av programmet) gör: ACK CIA1 timer
A → `JSR sid_play` → `JMP $EA81`.

### Sprites

```basic
sprite 0, x, y, $2000 # sprite 0: sätt X-, Y-position och datapekare
sprite 0, x, y # utan datapekare (behåller existens)
sprite på 0 # aktivera sprite 0 ($D015 |= bit0)
sprite av 0 # inaktivera sprite 0 ($D015 &amp;= ~bit0)
sprite färg 0, 7 # sprite 0 färg = gul ($D027)
sprite multicolor 0, på # aktivera flerfärgsläge för sprite 0 ($D01C |= bit0)
sprite multicolor 0, av # inaktivera flerfärgsläge ($D01C &amp;= ~bit0)
sprite expand x 0, på # dubbel bredd ($D01D |= bit0)
sprite expand x 0, av # normal bredd ($D01D &amp;= ~bit0)
sprite expand y 0, på # dubbel höjd ($D017 |= bit0)
sprite expand y 0, av # normal höjd ($D017 &amp;= ~bit0)
sprite-prioritet 0, på # bakom bakgrunden ($D01B |= bit0)
sprite-prioritet 0, av # framför bakgrunden ($D01B &amp;= ~bit0)
var h = sprite_hit() # sprite-sprite-kollision ($D01E, rensad vid läsning)
var b = sprite_bg_hit() # sprite-bakgrundskollision ($D01F, rensad vid läsning)
var x = sprite_x(0) # läs sprite 0 X-position (låg byte, $D000)
var y = sprite_y(0) # läs sprite 0 Y-position ($D001)
sprite_frame 0, $2000 # välj en statisk sprite-bild
sprite_frame 0, $2000, frame # välj en animationsbildruta från en bildrutesekvens
```

X stöder hela 9-bitarsintervallet (0–319): använd en `word`-variabel för
runtime-värden > 255. Sprite-datapekare: `data_addr` måste vara
64-byte-justerad; lagras som `addr >> 6` vid `$07F8+id`.

#### Sprite-animering med `sprite_frame`

`sprite_frame` är kommandot som används för att ändra den visade bilden av en
sprite under animering. Det ändrar bara spritens datapekare; det flyttar
**inte** spriten, aktiverar den eller flyttar bildrutor automatiskt.

Lagra animationsbilderna i följd, där varje 63-byte sprite-bild upptar en
64-byte-justerad plats. Skicka den nollbaserade animationsbildrutan som det
tredje argumentet:

```basic
sprite_frame sprite_id, första_bildruteadress, bildrutenummer
```

Till exempel, med basadressen `$2000`, använder bildruta 0 `$2000`, bildruta 1
använder `$2040`, bildruta 2 använder `$2080`, och så vidare. Programmet styr
animeringens timing och radbrytning:

```basic
var frame = 0
loop sprite_frame 0, $2000, frame frame = frame + 1 om frame == 4 så är frame = 0 end fördröjning 5
end
```

Tvåargumentformen, `sprite_frame id, address`, väljer helt enkelt en statisk
sprite-bild och förblir bakåtkompatibel. Sprite-positionen styrs fortfarande av
`sprite id,x,y`.

### Kollision i programvarans gränsruta

```basic
var beröring = box_hit(vänster1, topp1, höger1, botten1,
vänster2, topp2, höger2, botten2)
```

`box_hit()` utför ett axeljusterat avgränsningsboxtest (AABB) och returnerar `1`
när de två rektanglarna överlappar eller nuddar varandra, annars `0`. Till
skillnad från `sprite_hit()` och `sprite_bg_hit()` läser eller rensar den inte
VIC-II-kollisionsregister. De åtta argumenten är godtyckliga 8-bitarsuttryck, så
rutor kan vara mindre än den synliga sprite-bilden eller kan beskriva spelobjekt
som inte är sprite. Koordinaterna är inkluderande; behåll `left <= right` och
`top <= bottom`.

### Sprite-definition

```basic
sprdef 0
  $00,$3C,$00, $00,$FF,$00, $03,$FF,$C0, $07,$FF,$E0,
  $0F,$FF,$F0, $0F,$FF,$F0, $1F,$FF,$F8, $1F,$FF,$F8,
  $1F,$FF,$F8, $0F,$FF,$F0, $0F,$FF,$F0, $07,$FF,$E0,
  $03,$FF,$C0, $00,$FF,$00, $00,$3C,$00, $00,$00,$00,
  $00,$00,$00, $00,$00,$00, $00,$00,$00, $00,$00,$00,
00 kr, 00 kr, 00 kr slut
```

`sprdef id ... end` bäddar in 63 spritebyte vid nästa 64-byte-justerade adress i
kodsegmentet, skickar en `JMP` över dem och ställer automatiskt in `$07F8+id =
data_addr >> 6`. För att använda samma form för flera sprites, läs tillbaka
pekaren:

```basic
var pg = peek($07F8) # pekare satt av sprdef 0
poke $07F9, pg # kopiera till sprites 1–7
```

### Karaktärsrutekartor (`.ubmap`)

```basic
karta ladda "levels/world.ubmap"
karta ladda "level.bin", $4000 # Nivåredigeringsprojekt, data vid $4000 (1.6.1)
karta rita map_x, map_y # rita en 40x25-vyport till skärm/färg-RAM
karta vy px, py # jämn dubbelbuffrad vy vid pixel px, py (1.6.1)

var tile = map_tile(x, y) # läs teckenkod från kartan
karta uppsättning x, y, 42 # ändra teckenkod i skrivbar kartdata

var shade = map_color(x, y) # läs cellfärg (0 när kartan inte har någon färgdata)
karta färg x, y, 7 # ändra cellfärg när färgdata finns
```

`map load` löser filnamnet relativt till `.ub` källfilen, validerar den vid
kompileringstid och bäddar in dess tecken- och valfria färgmatriser i skrivbart
program-RAM. En senare `map load` ersätter den aktiva mappningen för
efterföljande mappningskommandon.

`map load` accepterar även en VisualAssembler `me-map` `.bin`-export direkt:

```basic
kartläsning "map-multicolor.bin"
```

De första 1000 byten blir 40×25-teckenmappningen och de kommande 1000 byten blir
cellfärger. Flerfärgsläge och `$D021-$D023` läses från
VisualAssembler-metadatatrailern, så ingen `.ubmap`-konvertering krävs.

**Level Editor-projekt (nytt i 1.6.1).** `map load` läser också ett
VisualAssembler Level Editor-projekt (`Save level (.bin)`) och komponerar dess
skärmar till en karta: en nivå av B×H-skärmar blir en (B·40)×(H·25)-karta med
färger, tomma platser är mellanslag. Kartor är begränsade till 255×255 celler,
så en nivå får vara högst 6 skärmar bred och 10 hög.

```basic
kartladdning "level.bin" # 2x5 skärmar -&gt; en 80x125 karta
```

**Placera kartdata (nytt i 1.6.1).** `map load "file", addr` lagrar kartan på en
fast adress istället för inbäddad i koden, som `incbin "file", addr` (adressen
måste vara ovanför den genererade koden eller inuti ett `org` mellanrum). Tecken
kommer först, färger följer:

```basic
karta laddas "level.bin", $4000 # 80x125 karta: tecken $4000-$6713, färger $6714-$8E1F
```

#### Smidig rullning — `kartvy` (nytt i 1.6.1)

```basic
kartladdning "level.bin", $4000
var px: word = 0
var py: word = 0
loop
kartvy px, py # en gång per bildruta, istället för `vänta raster`
# läs joysticken, ändra px / py, spellogik ...
slut
```

`kartvy x, y` visar kartan vid pixelposition `x, y` (orduttryck;
`0..(bredd-40)*8` och `0..(höjd-25)*8`, värden utanför intervallet är
begränsade). Anropar den en gång per bildruta: den väntar på bildrutans gräns
(rasterlinje 250), visar positionen som angavs av föregående anrop och tar sedan
den nya, så en position visas en bildruta senare.

Så här fungerar det: den fina delen använder XSCROLL / YSCROLL i `$D016` /
`$D011` med 38 kolumner och 24 rader (den inskrollade kanten förblir dold);
teckenstegen byter två skärmbuffertar, `$0400` och `$3C00`. Positionen förutsägs
två bildrutor framåt och den dolda bufferten byggs för nästa teckencell i två
halvor innan vyn kommer dit, så bytet väntar aldrig. Färg-RAM kan inte
dubbelbuffras: dess övre halva kopieras i den sista gamla bildrutan bakom
rasterstrålen, den nedre halvan precis efter bytet framför den (båda med avbrott
maskerade för några rasterlinjer), så ingenting rivs. En riktningsändring precis
vid ett teckensteg kan hålla vyn i en eller två bildrutor medan bufferten byggs
om.

Regler:

- Programkoden och inline-data måste hålla sig utanför `$3C00-$3FFF` (andra
  bufferten); ladda stora kartor med en adress (`karta ladda "fil", $4000`),
  annars stoppas kompileringen med ett fel.
- Den första `kartvyn` ritar hela vyn till `$0400`. Därefter tillhör skärmen
  `kartvyn`: `print` / `screen` / `cls` write `$0400` endast och skrivs över.
- Sprites fungerar som vanligt: `map view` kopierar sprite-pekarna `$07F8-$07FF`
  till `$3FF8-$3FFF` i varje bildruta, så att `sprdef` / `sprite_frame` visas i
  båda buffertarna. Behåll sprite-data i VIC-bank 0 (`$0000-$3FFF`, inte
  `$1000-$1FFF`), t.ex. genom att placera `sprdef` före en stor inline `map
  load`.
- Teckenuppsättningsbitarna i `$D018` behålls (`teckenuppsättning på` fungerar);
  flerfärgsbiten i `$D016` behålls eftersom `map load` satte den.
- Lämna cirka 6000 cykler (~95 rasterlinjer) spellogik per bildruta; en längre
  bildruta gör att vyn håller i en bildruta men aldrig rivs.
- Exempel: `examples/level_scroll_demo.ub` (joystickstyrd, med en spelarsprite).

`map draw map_x, map_y` kopierar en 40×25-vyport med början vid den angivna
kartcellen till skärm-RAM `$0400` och, om sådan finns, färg-RAM `$D800`. Kartan
måste innehålla hela den begärda vyporten: behåll `map_x <= width-40` och `map_y
<= height-25`. Koordinater och dimensioner är för närvarande 8-bitars (0–255).

Vanliga kartor rensar textens flerfärgsbit i `$D016`. Flerfärgskartor ställer in
den och laddar deras tre globala färger i `$D021`, `$D022` och `$D023`.
Teckenkartor innehåller teckenkoder, inte teckenuppsättningspixlar; kombinera
dem med `charset`/`chardef` eller någon annan teckenuppsättningsladdningsmetod.
I flerfärgstextläge väljer cellfärgerna 8–15 flerfärgade tecken enligt
VIC-II-reglerna.

#### UBMP version 1 binärt format

Alla multibyte-heltal är little-endian:

|   Offset |    Storlek | Menande                                                        |
| -------: | ---------: | -------------------------------------------------------------- |
|        0 |          4 | ASCII-magi `UBMP`                                              |
|        4 |          1 | Version, för närvarande `1`                                    |
|        5 |          1 | Flaggor: bit 0 = färgmatris finns, bit 1 = flerfärgat textläge |
|        6 |          2 | Kartbredd, 1–255 celler                                        |
|        8 |          2 | Karthöjd, 1–255 celler                                         |
|       10 |          1 | Bakgrund 0 (`$D021`), låg nibble-användning                    |
|       11 |          1 | Flerfärgad 1 (`$D022`), används med låg nibblekvalitet         |
|       12 |          1 | Multicolor 2 (`$D023`), används med låg nibble-effekt          |
|       13 | bredd×höjd | Koder för större radtecken                                     |
| följande | bredd×höjd | Valfria rad-huvudfärgsnibbles när flaggbit 0 är satt           |

En UBMP-fil måste ha exakt den längd som anges i dess rubrik. Ogiltig magi,
version, dimensioner eller längd producerar ett kompileringsfel.

### Import av bild från Koala Painter

```basic
koala ladda "pictures/title.kla" # validera och bädda in vid kompileringstid
koala visa # gå in i bitmappsläge för flerfärgade bilder
koala dölj # återgå till standardtextvisning
```

`koala load` accepterar en standard 10003-byte Koala-fil (`$6000`
laddningsadress plus 10001 databyte) eller en rå nyttolast på 10001 byte.
Sökvägarna är relativa till `.ub`-filen. Nyttelasten innehåller 8000
bitmappsbyte, 1000 skärmbyte, 1000 färgbitar och en bakgrundsfärgsbyte.

Kompilatorn lagrar den på `$6000-$8710`. `koala show` kopierar bitmappen till
`$2000`, skärmmatrisen till `$0400`, färgerna till `$D800` och aktiverar
bitmap-flerfärgsläge. `koala hide` rensar bitmap-/flerfärgsläge och återställer
standardtextlayouten.

Genererad kod och hjälpfiler måste sluta nedanför `$2000`, eftersom den visade
bitmappen skriver över `$2000-$3F3F`; kompilatorn rapporterar ett fel annars.
Koala-import kan för närvarande inte kombineras med `load sid` i samma program.

### Kodlayout: `org` — nytt i 1.5.7

```basic
sub a() ... end # subs/fns placeras efter varandra från slutet av huvuddelen
org $4000 # nästa subs/fns fortsätter vid $4000; $xxxx-$3FFF förblir nollfylld
sub b() ... end
incbin "font.bin", $3800 # data kan finnas i mellanrummet ($3800-$3FFF är en hel VIC-teckenuppsättningsplats)
```

`org addr` går **mellan sub/fn-definitioner** (den ignoreras i huvuddelen och
agerar endast i andra omgången). Subrutiner faller aldrig igenom varandra, så de
hoppade bytena är bara nollfyllda och reserverade: en `incbin "f", addr` som
ligger helt innanför mellanrummet skrivs in i den, och `charset on` räknar inte
mellanrummet som kod. Nollbytena är en del av `.prg`. `org` under den aktuella
kodens slut är ett kompileringsfel. Allt som genereras efter den sista suben
(hjälpare, `data`-tabeller) följer den sista suben, d.v.s. landar ovanför
mellanrummet.

### Anpassad teckenuppsättning (`charset on` / `charset off` nytt i 1.5.7)

```basic
teckenuppsättning $3800 # ange basadress för chardef (standard $3800)

chardef 65 # omdefiniera tecken 65 ('A')
$18,$3C,$66,$7E,$66,$66,$66,$00
end

chardef 66 # färre än 8 byte är nollfyllda
$7C,$66,$7C,$66,$7C
end
```

`charset base` anger destinationsadressen som används av alla efterföljande
`chardef`-satser. `chardef id ... end` bäddar in 8 byte inline i kodsegmentet
(föregånget av en `JMP` för att hoppa över dem), och kopierar dem sedan till
`charset_base + id*8` vid körning. Värden måste vara kompileringstidskonstanter
skrivna som `$xx` eller decimal. **`%` binära litteraler stöds inte** av
programmeraren (manualen sa det före 1.5.7 — det var fel).

`charset addr` ställer bara in `chardef`-destinationen; den skickar ingen kod.
För att få VIC-II att använda setet, slå på det (och stäng av det igen när du är
klar):
```basic
teckenuppsättning $3800
chardef 1 $FF,$81,$81,$81,$81,$81,$81,$81,$FF slut # boxkant
teckenuppsättning på # VIC-II läser tecken från $3800 (skärmmatris orörd)
...
teckenuppsättning av # tillbaka till ROM-uppsättningen ($1800 om `gemener` är aktiv, annars $1000)
```

`charset on` läs-ändra-skriver `$D018` bitarna 1-3 från den sista `charset addr`
(standard `$3800`); skärmmatrisbitarna bevaras. Adressen måste vara en multipel
av `$800` inuti VIC-bank 0 (`$0000-$3FFF`), annars är det ett kompileringsfel.
Båda satserna använder den `charset addr` som kompilerades senast, så behåll
direktivet i huvudprogrammets innehåll (subrutinens innehåll kompileras efter
det). Motsvarande råskrivning är `poke $D018, $1A` för `$2800` eller `poke
$D018, $1E` för `$3800`.

**Överlappningskontroll.** `charset on` gör anspråk på hela 2 KB-uppsättningen
och varje `chardef` dess 8 byte. Om den genererade koden når in i det området
stoppas bygget med `the program code ($080D-$xxxx) overlaps the charset area
$2800-$2FFF; move the charset ...`. Stora program behöver därför uppsättningen
ovanför koden (`charset $3800`) — eller använd `org` (ovan) för att låta koden
fortsätta ovanför uppsättningen. Data som placeras i ett `org`-gap (`incbin ...,
addr`) räknas inte som kod.

### Minne

```basic
poke $D020, 2 # STA $D020
poke addr_var, 6 # STA (addr_var),Y — om addr_var är ordtypen
var v = peek($D012) # LDA $D012
var v = peek(addr_var) # LDA (addr_var),Y — om addr_var är ordtypen

var w: word = peek16($C000) # läs 16-bitars little-endian: lo=$C000, hi=$C001
poke16 $0314, $EA81 # skriv 16-bitars little-endian: lo→$0314, hi→$0315
poke16 ptr, w # word var som adress; ordvariabel som värde

var k = 2
var p = peek($07F8 + k) # LDA $07F8,Y — konstant + bytevariabel
poke $07F8 + k, p # STA $07F8,Y
poke ptr + k, 1 # ord + byte: fullständig 16-bitarsadress
```

`peek16(addr)` läser två på varandra följande byte (lo, hi) som en `word`.
`poke16` skriver lo och sedan hi.

En adress är alltid ett 16-bitarsvärde. Sedan 1.6.5 behåller ett adressuttryck
som `$07F8 + k` konstantens höga byte och överföringshastigheten (tidigare
beräknades den i 8 bitar och `peek($07F8 + k)` läste `$00F8 + k`). Detta gäller
för `peek`, `poke`, `peek16`, `poke16`, `fill`, `memcopy`, `drawmem`, `save` och
`reu`; `fill` / `memcopy` längder som `40 * rader` är också 16-bitars. `peek(k)`
med en bytevariabel läser adressen `$00kk` (den returnerade värdet av `k` själv
före 1.6.5).

### Disk-I/O

```basic
ladda "PROGRAM" # KERNAL LOAD: laddar fil från enhet 8 till dess ursprungliga adress
ladda "DATA", $C000 # laddar fil till en specifik adress
kedja "GAME" # ladda ett annat program över detta och KÖR det (se nedan)
ladda "DATA", ptr # adr från word-variabel

spara "DATA", $C000, 4096 # KERNAL SAVE från $C000, 4096 byte → enhet 8
spara "PROG", starta, len # adr och len från word/int-variabler
```

`load` anropar KERNAL `SETNAM`+`SETLFS`+`LOAD` (`$FFBD`/`$FFBA`/`$FFD5`). Utan
adress: sekundär adress 1 (filens egen 2-byte-rubrik är laddningsadressen). Med
adress: sekundär adress 0 (filen laddas till den angivna adressen, dess rubrik
hoppas över). (Åtgärdat i 1.5.9 — tidigare byttes de två: `load "F"` laddad till
`$0000`.) `save` anropar `SETNAM`+`SETLFS`+`SAVE` (`$FFBD`/`$FFBA`/`$FFD8`).
Kräver både `addr` och `len`.

#### Kedja till ett annat program — `kedja` (nytt i 1.5.9)

```basic
kedja "GAME" # ladda GAME från den enhet vi startades från och KÖR det
kedja "GAME", 9 # från enhet 9 (valfritt uttryck)
print "LOAD ERROR" # nåddes endast om filen inte kunde laddas
```

`chain` laddar ett annat program till sin egen laddningsadress — normalt
`$0801`, direkt ovanför det program som körs — och startar det exakt som om
`LOAD"GAME",8,1` och `RUN` hade skrivits. Detta är vad ett start-/titelprogram
behöver. En vanlig `load` kan inte göra det: den laddade filen skulle skriva
över koden som kör `load`.

Hur det fungerar:

- En 46-byte, positionsoberoende laddare plus filnamnet kopieras till
  kassettbufferten (`$033C`), som varken ett Ultimate Basic-program eller en
  Exomizer-packad fil laddas över.
- Innan dess sätts maskinen tillbaka till ett rent tillstånd: VIC IRQ av,
  SID-volym 0, `IOINIT` (`$FDA3`: CIA-timers, tangentbords-IRQ, seriell buss),
  `RESTOR` (`$FF8A`: standard-IRQ/BRK/NMI och I/O-vektorer), `$01 = $37`.
  Anpassade raster-IRQ, hanterare för `musikuppspelning` och `nmi` stoppas.
  Skärm, färger och VIC-bankregister, förutom `$DD00`, lämnas som de är, så en
  bild kan finnas kvar på skärmen medan nästa program laddas (`IOINIT` väljer
  VIC-bank 0).
- Laddaren anropar `SETNAM` / `SETLFS` (sekundär 1) / `LOAD`. Utan ett
  enhetsargument använder den enheten som själva programmet laddades från
  (`$BA`), eller enhet 8.
- Efter en lyckad laddning ställer den in programslutspekaren (`$2D/$2E`),
  ominitialiserar BASIC (`$E453`, `$E3BF` — en självuppackande cruncher som
  Exomizer `sfx` kan ha använt BASICs nollpsida) och KÖR programmet (`$A659`,
  `$A7AE`). Den fungerar för både Ultimate Basic-program, crunkade (`exomizer
  sfx sys`) filer och vanliga BASIC-program.
- Om filen inte kan läsas in (hittas inte, ingen enhet) returnerar `chain` och
  programmet fortsätter med nästa kommando.

Filnamnet måste vara en strängliteral på 1–16 tecken.

### Seriell kanalfil I/O

```basic
öppna 1, 8, 2, "MIN FIL" # öppna logisk fil 1, enhet 8, sekundär 2, namn "MIN FIL"
öppna 2, 4, 7 # öppna skrivare (enhet 4), inget filnamn
öppna kanal, dev, sek # kanal, enhet, sekundär från variabler

print# 1, "HEJ" # skicka "HEJ"+CR till logisk fil 1
print# kanal, x, "text" # valfri blandning av variabler, strängar — samma som print men till fil

stäng 1 # stäng logisk fil 1
stäng kanal # kanal från variabel
```

`open` anropar `SETNAM` ($FFBD) + `SETLFS` ($FFBA) + `OPEN` ($FFC0). Utan ett
filnamn anropas SETNAM med längden 0. `print#` skickar utdata via `CHKOUT`
($FFC9), CHROUT per tecken (+ efterföljande CR), sedan `CLRCHN` ($FFCC). `close`
placerar kanalnumret i A och anropar `CLOSE` ($FFC3).

### Input

```basic
inmatning av poäng # läs upp till 3 siffror från tangentbordet → 8-bitars int var
inmatning av "Namn: ", namn # valfri promptsträng, läs sedan rad → sträng var
inmatning av "Poäng: ", poäng # prompt + int inmatning
```

`input` använder KERNAL BASIN (`$FFCF`) för blockerande, ekoad linjeinmatning
med DEL-stöd.
- **Int var**: accepterar endast `0`–`9`, max 3 tecken; konverterar till
  8-bitarsvärde vid CR.
- **Strängvariabel**: accepterar upp till 30 tecken; lagrar som null-avslutad
  sträng; ZP-par uppdaterat.
- **FLYTTTAL var** (1.6.3): siffror och `.`, t.ex. `12,5` → 12,50 (två
  decimaler).
- **ENKEL / DUBBEL var** (1.6.4): valfritt tal, `-12.5`, `.5`, `3.25E2`.
- **Array-element** (1.6.3): `input t(i)` / `input nevek(i)`; `input "prompt";
  x` fungerar också.
- **Strängvariabel**: accepterar upp till 30 tecken; lagrar som null-avslutad
  sträng; ZP-par uppdateras.

### Flytpunkt / Fixpunkt

`float`-variabler använder Q8.8-formatet med fast punkt: den höga byten är
heltalsdelen (0–255) och den låga byten är bråkdelen (0/256 … 255/256).

```basic
var f: flyttal = 3.5 # 3.5 → hi=3, lo=128 (= 0x0380)
var g: flyttal = 0 # heltal 0 höjs automatiskt till 0.0

f = 1.5 # Q8.8 bokstavstilldelning
f = f + 1.5 # 16-bitars Q8.8 aritmetik (resultat: 3.0)
f = f + g # flyttal + flyttal

var n = int(f) # extrahera heltalsdelen (hi byte) → 8-bitars heltal
print f # skriver ut som "N.DD" (t.ex. 3.5 → "3.50", 1.25 → "1.25")
```

| Drift          | Exempel              | Anteckningar                           |
| -------------- | -------------------- | -------------------------------------- |
| Bokstavlig     | `3,5`, `0,25`, `1,0` | parsad som Q8.8 vid kompileringstid    |
| Heltalskampanj | `f = 5`              | lagrar 5,0 (hög=5, låg=0)              |
| Lägg till/dela | `f + 1,5`, `f - g`   | 16-bitars Q8.8-aritmetik               |
| Extrahera int  | `int(f)`             | returnerar hi byte som 8-bitars heltal |
| Skriva ut      | `skriv ut f`         | formatera "N.DD", alltid 2 bråksiffror |

**Varning:** Aritmetiskt överflöde avslutas vid 255,255 (ingen mättnad).
Multiplikation och division av två flyttalvariabler stöds ännu inte — använd
`int()` + heltalsaritmetik för dessa fall.

**Skriver ut flyttalsuttryck (åtgärdat i 1.5.7).** `print` av ett aritmetiskt
uttryck som involverar ett `float` (till exempel `print a / 10` med `a: float =
1`) skriver nu ut Q8.8-resultatet som `N.DD`. Före 1.5.7 skrevs det råa
16-bitarsvärdet ut som ett heltal (`25` istället för `0.09`). Bråktalet är
avkortat, inte avrundat: 1/10 = 25/256 skrivs ut som `0.09`.

### Flyttalspunkt: `ENKEL` / `DUBBEL` (1.6.4)

`dim x som single` och `dim x som double` är riktiga flyttal — 5-byteformatet
för C64 BASIC: cirka 9 signifikanta siffror, intervall ±2,9·10⁻³⁹ … ±1,7·10³⁸.
(`single` och `double` är av samma typ.) Den snabba 2-byte Q8.8-typen är
fortfarande tillgänglig som `flyttal`.

```basic
DIM r SOM DUBBEL, t SOM DUBBEL
DIM k(9) SOM ENKEL ' arrayer: 5 byte per element
r = 2,5
t = ATN(1) * 4 * r ^ 2 ' 19,6349541
SKRIV UT t; " "; SQR(2); " "; 1E10; " "; 1 / 3
FÖR r = 0 TILL 1 STEG 0,25 : SKRIV UT r : NÄSTA
FUNKTION Atfogo (a SOM DUBBEL, b SOM DUBBEL) SOM DUBBEL
Atfogo = SQR(a * a + b * b)
SLUT FUNKTION
```

|                  |                                                                                                                                                                      |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Operatörer       | `+ - * /` och `^` (potens; högerassociativ, binder hårdare än unär minus: `-2^2` = -4)                                                                               |
| Funktioner       | `SQR`, `SIN`, `COS`, `TAN`, `ATN` (radianer), `EXP`, `LOG` (naturlig), `INT` (golv), `FIX` (avkorta), `CINT` (rund), `ABS`, `SGN`, `CSNG` / `CDBL` (ingen op), `VAL` |
| Literaler        | `1,5`, `.5`, `1E6`, `2,5e-3`, `70000`                                                                                                                                |
| Jämförelser      | `= &lt;&gt; &lt; &gt; &lt;= &gt;=` i `OM` / `MEDA` / `TILL` / `VÄLJ FALL` och som värden                                                                             |
| Utskrift         | C64 BASIC-stil: `.5`, `-3.25`, `3.33333333`, `1E+10`, `1.5E-07` (inget inledande mellanslag)                                                                         |
| Strängar         | `s = "X=" + x`, `STR$(x)`, `VAL(s)` läser `-1.25E3`                                                                                                                  |
| `FÖR`            | flyttalsräknare, gränsvärde och steg (`STEP 0.1`, negativt eller en variabel)                                                                                        |
| `INGÅNG` / `LÄS` | `INPUT x` läser valfritt tal; `READ x` läser nästa `data` byte                                                                                                       |
| Underfunktion    | `p AS DOUBLE`-parametrar och `AS DOUBLE`-resultat                                                                                                                    |

**Blandning med heltal.** Ett uttryck beräknas i flyttal när det innehåller ett
ENKELT / DUBBELT värde, `^`, en av funktionerna ovan, eller en literal som
endast flyttal kan innehålla (`1E6`, `300.5`, `70000`). När ett program använder
flyttal är varje decimalliteral (`0.1`) också en flyttalskonstant. Att lagra ett
flyttal i ett `byte`, `heltal` eller `ord` **avrundar** det (halvvägs från noll:
2,5 → 3, -2,5 → -3); till ett `flyttal` blir det Q8.8. Ett heltalsvärde som
tilldelats en DOUBLE konverteras exakt. Heltalsuttryck behåller sina
heltalsregler (`var c = a + b` är fortfarande en byte).

**Anteckningar**
- En heltalsliteral från 32768 till 65535 läses som ett 16-bitarsmönster och
  blir negativt i flyttal: skriv `40000.0` eller `4E4`.
- `7 / 2` är 3,5 när det tilldelas en DUBBEL; i heltalskontext är det 3 som
  tidigare.
- `x MOD y` och `AND` / `OR` / `XOR` avrundar sina operander till heltal.
- `SIN` / `COS` för ett bytevärde behåller den gamla tabellbetydelsen 0–255
  (cirkelform = 256); med ett ENKELT / DUBBELT argument arbetar de i radianer.
- Flyttalskod får inte köras i IRQ/NMI-hanterare (körtiden behåller sitt
  tillstånd i fast RAM-minne).
- Kostnad: flyttalsomkörningen (cirka 4,4 KB, sammansatt av kompilatorn) läggs
  till efter programmet första gången SINGLE / DOUBLE används. Variabler tar 5
  byte i arrayområdet, plus en 2-byte noll-sidspekare för körtiden. En
  multiplikation tar ungefär 1–2 ms på en 1 MHz C64.

### Variabler i RAM, arrayminne (1.6.4)

- **Noll sida full:** när programmets variabler inte får plats på den permanenta
  nollsidan (`$02-$4F`), bygger kompilatorn om den och flyttar de variabler som
  används minst i aktiv kod till normalt RAM-minne (efter arrayerna). En sats
  som använder en sådan variabel kopierar den till en noll-sida-plats och
  tillbaka, så programmen beter sig på samma sätt, bara att dessa variabler är
  lite långsammare. Loopräknare, parametrar och allt som en IRQ-hanterare kan
  komma att röra vid stannar kvar på nollsidan. Minneskartan visar dem som
  `RAM:$xxxx`. Att få slut på nollsidan är inte längre ett fel förutom i extrema
  fall (`slut på nollsidan` finns kvar för dessa).
- **Arrayminne:**-arrayer (och spillda/flyttalsvariabler) använder
  `$C000-$CFFF`. När de behöver mer än 4096 byte börjar området istället vid
  `$A000`, vilket ger 12 KB (`$A000-$CFFF`): BASIC-ROM:et stängs av vid
  programstart (`$01` bit 0) och slås på igen vid varje utgång till BASIC
  (`slut`, `bye`, programslut, `kedja`), så programmet återgår fortfarande till
  en fungerande BASIC. Program som själva anropar BASIC ROM-rutiner (`sys
  $Axxx`) får inte använda mer än 4 KB arrayer.

### Matematiska funktioner

```basic
var a = abs(x - 20) # absolutvärde för tvåkomplement
var b = min(x, 39) # 8-bitars minimum
var c = max(x, 0) # 8-bitars maximum
var s = sgn(poäng) # 0 = noll, 1 = positiv (1–127), $FF = negativ (128–255)
var r = rnd() # LCG pseudo-slumpmässig 0-255; frö från rasterlinje
var r = rnd(10) # LCG pseudo-random 0-9 (rnd() mod n; resultat 0..n-1)
var s = sin(vinkel) # sinus: vinkel 0-255 (full cirkel), returnerar 0-255 (centrum=128)
var c = cos(vinkel) # cosinus = sin(vinkel+64)
var v = clamp(x, 0, 39) # 8-bitars osignerad clamp: resultat = max(lo, min(hi, val))

print hex(n) # print as 2-siffrig versal hex
print bin(n) # print as 8-bitars binär sträng
```

### Strängfunktioner

```basic
var n = len(msg) # längd på null-avslutad sträng var (0–255)
var c = asc(msg) # PETSCII-kod för första tecknet (0 om tom)
var c = asc("A") # kompileringstid: konstant PETSCII-kod
var n = val(s) # körtid: tolka decimal PETSCII-sträng → 8-bitars heltal (t.ex. "042" → 42)
var c = msg[i] # strängtecken vid index i: PETSCII-kod för msg[i]
msg[i] = c # skriv PETSCII-byte c till sträng vid index i — STA (ptr),Y
msg[0] = 72 # konstant index → LDY #0; STA (ptr),Y
```

### Nummerformatering

```basic
print hex(n) # skriv ut som 2-siffrigt hexadecimalt tecken i versaler
print bin(n) # skriv ut som 8-bitars binär sträng
print dec(n, 4) # högerjusterat decimaltal i ett fält med 4 tecken (t.ex. 42 → "42")
print dec(n, width) # width kan också vara en variabel
```

`dec(n, width)` fyller ut talet till vänster med mellanslag för att fylla
`width` tecken. Om talet har fler siffror än `width` skrivs det ut utan
utfyllnad (ingen trunkering). I icke-utskriftssammanhang utvärderas `dec(n, w)`
till `n` oförändrad (samma som `hex`/`bin`).

### REU (RAM-expansionsenhet)

```basic
var ok = reu_present() # 1 om REU upptäcktes, 0 om inte (skriv-/lästest på $DF04)
var ok = reudet() # alias för reu_present()

reu stash c64addr, bank, reu_addr, len # kopiera C64 → REU
reu hämta c64addr, bank, reu_addr, len # kopiera REU → C64
reu swap c64addr, bank, reu_addr, len # växla mellan C64 och REU
```

`reu_present()` utför ett skriv-/återläsningstest på REU-registret `$DF04`. Utan
en REU går skrivningen förlorad (öppen buss), så återläsningen skiljer sig åt —
detekterar tillförlitligt närvaro utan att vidröra något sidoverkande
kommandoregister.

| Parameter  | Bredd     | Anteckningar                                                     |
| ---------- | --------- | ---------------------------------------------------------------- |
| `c64addr`  | 16-bitars | C64 RAM-start — konstant, `word` variabel eller 8-bitars uttryck |
| `bank`     | 8-bitars  | REU-banknummer (0–7 för en 512 KB-enhet)                         |
| `reu_addr` | 16-bitars | Kvittning inom REU-banken                                        |
| `lens`     | 16-bitars | Byte att överföra (`0` = 65 536 i REU-hårdvara)                  |

REU-register: `$DF01` kommando (`$B0` stash / `$B1` fetch / `$B2` swap),
`$DF02–$DF03` C64 addr, `$DF04–$DF05` REU offset, `$DF06` bank, `$DF07–$DF08`
längd. Överföringen är synkron (CPU stoppad under DMA). Kräver en riktig REU
eller VICE: **Inställningar → Hårdvara → RAM-expansionsmodul**.

### Minnesverktyg

```basic
fyll skärm 32 # fyll skärm RAM $0400–$07FF med värde 32 (mellanslag)
fyllningsfärg 1 # fyllningsfärg RAM $D800–$DBFF med värde 1 (vit)

fyll $0400, 1000, 32 # fyll 1000 byte från $0400 med värde 32
fyll addr, 256, 0 # addr kan vara ordvariabel
fyll ptr, len_word, val # alla operander kan vara uttryck / ordvariabel

memcopy $C000, $0400, 256 # kopiera 256 byte från $C000 → $0400
memcopy src_ptr, dst_ptr, 40 # ordvariabel för källa och destination

drawmem $C000, $0400, 8, 10, 40 # blit 8×10 rect from $C000 → skärm vid $0400, steg 40
drawmem src_ptr, dst_ptr, w, h, 40 # ordvariabler för src/dst
```

Både `fill` och `memcopy` stöder 16-bitarslängder (0–65535). Använd
`word`-variabler för längder > 255.

`drawmem src, dst, width, height, stride` kopierar ett 2D rektangulärt block.
`src` läses linjärt (packade rader); `dst` går framåt med `stride` byte mellan
raderna — använd `40` ($28) för C64-skärmen eller färg-RAM (40 kolumner). Bredd,
höjd och steglängd är alla 8-bitarsvärden. `src` och `dst` kan vara konstanter,
`word` variabler eller 8-bitarsuttryck.

### Raster-IRQ

```basic
irq my_handler # raster IRQ på rad 0, handler = subnamn eller adress
irq my_handler, 100 # raster IRQ på rasterrad 100
irq $C800, 200 # handler vid fast adress
irq adr_word # handleradress från en ordvariabel
```

Ställer in en raster-IRQ via BASIC-mjukvektorn (`$0314`/`$0315`): inaktiverar
CIA1-timer-IRQ, ACK:er väntar på VIC IRQ, skriver rasterlinje till `$D012`,
aktiverar VIC-raster-IRQ (`$D01A=$01`), skriver hanteraradress och återaktiverar
avbrott.

Hanteraren **måste** sluta med `sys $EA81` (KERNAL-slutet av IRQ) — vanliga
`RTS` eller `RTI` kommer att korrumpera stacken. Bekräfta VIC IRQ först:

```basic
sub my_handler()
poke $D019, $FF # ACK VIC IRQ
# ... fungerar här ...
sys $EA81 # JMP till KERNAL slutet av IRQ
slut
```

Framåtriktade referenser stöds (`irq my_handler` innan suben är definierad).

### NMI-hanterare

```basic
nmi my_nmi # sätt NMI-vektorn $0318/$0319 till hanterarens sub eller adress

sub my_nmi()
# ... NMI fungerar här ...
nmi_exit # JMP $FE47 — korrekt NMI-utgång (återställer A/X/Y + RTI)
end
```

`nmi handler` skriver hanteraradressen till NMI-mjukvektorn (`$0318`/`$0319`).
Hårdvaru-NMI-vektorn vid `$FFFA` pekar på KERNAL NMI-rutinen som förgrenar sig
till `$0318`. Hanteraren **måste** sluta med `nmi_exit` (skriver ut `JMP $FE47`)
— användning av vanlig `RTI` kommer att korrumpera stacken. Framåtriktade
referenser stöds.

### CIA1-timer-IRQ

```basic
cia_timer 19656, my_handler # CIA1 timer A: utlöses var 19656:e cykel (~50 Hz PAL)
cia_timer period, handler # period kan vara en variabel eller ett uttryck
```

Ställer in CIA1-timer A som en periodisk IRQ-källa via BASIC-mjukvektorn
(`$0314`/`$0315`):
1. SEI — inaktivera avbrott
2. `$DC0D = $7F` — inaktivera alla CIA1 IRQ:er
3. Ladda 16-bitarsperiod lo→`$DC04`, hi→`$DC05`
4. Skriv hanteraradressen till `$0314`/`$0315`
5. `$DC0D = $81` — aktivera CIA1-timer A IRQ
6. `$DC0E = $01` — starta timer A i kontinuerligt läge
7. CLI — återaktivera avbrott

Hanteraren måste sluta med `irq_exit` (eller `sys $EA81`) och ska bekräfta CIA1
IRQ:n:

```basic
sub my_handler()
poke $DC0D, $01 # ACK CIA1 timer A IRQ (läs rensar den också)
# ... fungera här ...
irq_exit # JMP $EA81: återställ A/X/Y + RTI
end
```

PAL-timing: klocka = 985 248 Hz. Period för 50 Hz = 985 248 / 50 = 19 705 cykler
≈ `$4CC9`. Framåtriktade referenser stöds.

### Felhantering

```basic
onerr goto err_handler # sätt KERNAL I/O-felvektor ($0300/$0301) till en etikett

...

etikett err_handler
skriv ut "I/O-FEL" hej då
```

`onerr goto label` skriver etikettadressen (lo, hi) till KERNAL-platserna
`$0300` och `$0301`. När ett KERNAL I/O-fel uppstår (t.ex. ett misslyckat `load`
eller `open`) kör KERNAL `JMP ($0300)`, vilket förgrenar sig till etiketten.
Framåtriktade referenser (etikett definierad efter `onerr goto`) stöds.

### Inbäddning av filer vid kompilering (`incbin` hoppa över / längd nytt i 1.5.7)

```basic
incbin "sprites.bin" # bädda in råa binära byte vid aktuell kodposition
incbin "charset.bin", $2000 # bädda in vid en absolut adress, utfyllnad efter behov
incbin "font.prg", $3C00, 2 # ...hoppar över de första 2 byten (t.ex. en .prg-laddningsadress)
incbin "big.bin", $4000, 16, 256 # ...hoppar över 16 byte, ta sedan högst 256 byte
include "defs.ub" # infogar en annan .ub-källfil (lexed+parsad på plats)
```

`incbin "file", addr, skip [, length]` tar bort de första `skip` bytena i filen
(vanligtvis den 2 byte långa laddningsadressen för en `.prg`) och tar valfritt
högst `length` byte; `skip` och `length` är konstanter, och ett `skip` bortom
slutet av filen är ett fel. Adressformen kräver att målet är ovanför den
genererade koden — eller inuti ett `org`-gap.

### Data / Läsning

```basic
data 1, 2, 3, 255 # konstant byte-tabell
läs variabelnamn # ladda nästa byte i variabelnamn (deklarerar automatiskt om det behövs)
```

Alla `data`-värden samlas in vid kompileringstillfället. En 2-byte ZP-pekare
allokeras och initieras automatiskt vid programstart. Varje `read` flyttar
pekaren framåt.

**Initialiserade arrayer — `data <array>: …` (nytt i 1.5.8)**

```basic
var sinus = array(8)
data sinus: 128, 218, 255, 218
data sinus: 128, 37, 0, 37 # ytterligare rader fortsätter där den föregående slutade
print sinus[i] # slumpmässig åtkomst, som vilken array som helst

var xpos = array_word(2)
data xpos: 24, 300 # ordarrayer tar 16-bitars värden (lagras lågt, högt)
```

En `data`-rad vars första element är `name:` fyller en deklarerad `array` /
`array_word` istället för `read`-strömmen. Värdena lagras efter koden och
kopieras till arrayen en gång vid programstart (direkt efter att arrayerna
nollställts), så tabellen är fullt skrivbar och indexerad som vilken annan array
som helst. Fler värden än arrayen innehåller, eller ett odeklarerat namn, är ett
kompileringsfel. Dessa rader påverkar inte `read`.

### Inline-montering

```basic
sys $FFD2 # JSR $FFD2
sys $FFD2, 7 # LDA #7 ; JSR $FFD2 (pass byte-värde i A-register)
irq_exit # JMP $EA81 — korrekt IRQ-hanterare exit (återställ A/X/Y + RTI)
asm $EA, $EA # inline råa bytes (NOP NOP) — äldre form
asm {
; Fullständig 6502 mnemonik och adresseringslägen
LDA #$07 ; omedelbar
STA $0286 ; absolut
LDA $50 ; noll-sida ($50 ≤ $FF → ZP autovald)
STA $0400,X ; absolut,X indexerad
LDA ($50),Y ; (indirekt),Y
LDA ($50,X) ; (indirekt,X)
JSR $FFD2 ; subrutinanrop
JMP $C000 ; absolut hopp
JMP ($FFFC); indirekt hopp

CLC
ADC #1
SEC SBC #1

TAX; implicit / överföring
ASL A; ackumulator (även bara: ASL)
LSR A
ROL
ROR

; Förgreningar — operand är en absolut adress; offset beräknas automatiskt
BNE-loop; framåt- eller bakåtförgrening till lokal etikett
BEQ klar

loop:
NOP
klar:
RTS

; #<etikett / #>etikett — låg/hög byte av en etikettadress
LDA #<hanterare
STA $0314
LDA #>hanterare
STA $0315

; * — aktuell monteringsplats
JMP *

; Råa hexagonala byte (bakåtkompatibel med gammal asm { $xx ... } syntax)
$EA $EA; två NOP-byte
}
```

**Adresseringslägen:**

| Syntax          | Läge          | Byte | Exempel                       |
| --------------- | ------------- | ---- | ----------------------------- |
| (ingen operand) | Underförstådd | 1    | `NOP`, `RTS`                  |
| `A`             | Ackumulator   | 1    | `ASL A`, `LSR`                |
| `#värde`        | Omedelbar     | 2    | `LDA #$07`                    |
| `$zz` (0–255)   | Noll-sida     | 2    | `LDA $50`                     |
| `$zz,X`         | ZP,X          | 2    | `LDA $50,X`                   |
| `$zz,Y`         | ZP,Y          | 2    | `LDX $50,Y`                   |
| `$xxxx`         | Absolut       | 3    | `LDA $0400`                   |
| `$xxxx,X`       | Absolut, X    | 3    | `LDA $0400,X`                 |
| `$xxxx,Y`       | Absolut, Y    | 3    | `LDA $0400,Y`                 |
| `($xxxx)`       | Indirekt      | 3    | `JMP ($FFFC)`                 |
| `($zz,X)`       | (Indirekt, X) | 2    | `LDA ($50,X)`                 |
| `($zz),Y`       | (Indirekt), Y | 2    | `LDA ($50),Y`                 |
| `etikett`       | Relativ       | 2    | `BNE label` (endast filialer) |

- `$zz` (1–2 hexagonsiffror, värde ≤ 255) väljer noll-sida om instruktionen
  stöder det; annars uppgraderas automatiskt till absolut. Använd `$00xx` (4
  siffror) för att tvinga fram absolutvärde.
- Grenoperander är absoluta adresser; den relativa byteoffseten beräknas
  automatiskt.
- Lokala etiketter (`name:`) är begränsade till `asm { }`-blocket. Framåtriktade
  grenar löstes i steg 2.
- `#<label` / `#>label` ger lo / hi-byten för en etiketts adress.
- `*` ger den aktuella instruktionsadressen, så `JMP *` monteras som en
  självloop.
- Rader som börjar med `$`, `%` eller en siffra genereras som råa byte
  (bakåtkompatibla).
- Inuti `asm { }` är kommentarer `;` eller `//` till slutet av raden. (`#` är
  det omedelbara prefixet, inte en kommentar.)

**Blandar `asm { }` med subrutinparametrar**

Parameternamn är **inte tillgängliga** inuti `asm { }`-block. Använd
UltimateBasic-satser för att flytta värden till kända platser före `asm {
}`-blocket:

```basic
sub set_colors(border_col, bg_col)
poke $D020, border_col # UltimateBasic löser ZP-adressen
poke $D021, bg_col
asm {
; värdena finns redan i $D020 / $D021
LDA $D020
}
end
```

För rutiner vars hela kropp är assembler — särskilt IRQ-hanterare som måste
korsreferera varandra — placera alla hanterare i ett **enda toppnivå `asm {
}`-block** i huvudprogrammet. Etiketter i samma block delar scope, så att `irq1`
och `irq2` kan referera till varandra fritt. Se `examples/raster_irq_demo.ub`.

### Sträng ↔ heltal

```basic
numstr poäng, $0340 # skriver "042\0" vid $0340 (alltid 3 siffror, nollfyllt)
var n = str_to_int("42") # kompileringstid: Expr::Number(42)

print str$(poäng) # skriv ut 8-bitars heltal som 3-siffrig decimalsträng ("000"–"255")
print "Poäng: " + str$(poäng) # kan användas i sammansatt sträng print-kontext
var s: string = str$(n) # tilldela str$() resultat till en sträng var (delad statisk buffert)
```

`str$(n)` konverterar ett 8-bitarsvärde till en decimalsträng med 3 tecken
(alltid 3 siffror med inledande nollor, t.ex. `5` → `"005"`, `42` → `"042"`,
`255` → `"255"`) följt av en nullterminator. Resultatpekaren lagras i ett
permanent ZP-par som allokeras vid kompileringstillfället.

> **Obs!** `str$(n)` använder en enda delad statisk buffert på 4 byte. Om du
> anropar `str$(n)` igen skrivs det föregående resultatet över. För samtidig
> visning av flera värden, använd `numstr` för att skriva till separata absoluta
> adresser.

## Exempel

| Fil                                 | Beskrivning                                                                                  |
| ----------------------------------- | -------------------------------------------------------------------------------------------- |
| `exempel/funktioner.ub`             | const, label/goto, poke/peek, rnd, matematiska funktioner                                    |
| `exemples/new_functions.ub`         | underparametrar, arrayer, ordvariabler, strängvariabler                                      |
| `exemples/bitmap_demo.ub`           | 320×200 bitmapp, plott, grafik på/av                                                         |
| `examples/block_demo.ub`            | 80×50 blockgrafik, plot4, cirkel4, grafik på block                                           |
| `exemples/joystick_demo.ub`         | joystickläsning, sprite-rörelse                                                              |
| `examples/mux_demo.ub`              | raster sprite multiplexer (3 fönster × 8 sprites = 24)                                       |
| `examples/orbit_demo.ub`            | 24-sprite-bana med pulserande radie och slumpmässiga färger                                  |
| `examples/plasma_demo.ub`           | plasmaeffektbitmapp med rasterkantanimering                                                  |
| `examples/sprite_data.ub`           | sprdef-formdata (inkluderad av andra demos)                                                  |
| `examples/sprite_mux_orbit.ub`      | Demo av en 24-sprite-bana med sprdef + förberäknade positioner                               |
| `examples/sprite_orbit_demo.ub`     | 8 hårdvaruspriter i cirkulär bana via sin/cos-tabellen                                       |
| `examples/reu_bitmap_demo.ub`       | REU-lagring/hämtning med bitmappsgrafik                                                      |
| `examples/sid_music_demo.ub`        | SID-musikspelare med raster-IRQ och tangentbordsutgång                                       |
| `examples/tenprint.ub`              | 5 TENPRINT-labyrintimplementeringar med meny; demos `lowercase` teckenuppsättningsläge       |
| `examples/countdown_demo.ub`        | Nedräkning `for..next` med negativa steg, inkl. `for i = 20 to 0 step -2`                    |
| `examples/countdown_errors_demo.ub` | Kompileringsfel för standardsteget `from > to`                                               |
| `exemples/explicit_demo.ub`         | `--explicit` CLI-flag-demo med fullständigt typade `var`, `sub`, `fn`                        |
| `examples/explicit_errors_demo.ub`  | Lös kod som bygger utan `--explicit`, fel med den                                            |
| `examples/dim_demo.ub`              | `DIM … AS …` skalärer och arrayer av alla typer                                              |
| `examples/qbasic_demo.ub`           | QBasic-stil FUNCTION / SUB / ELSEIF / DO-LOOP / SELECT CASE / strängar                       |
| `exemples/float_demo.ub`            | ENKEL / DUBBEL flyttal: `^`, SQR, SIN, ATN, EXP, LOG, `FÖR … STEP 0.5`, `AS DUBBEL`-funktion |

## CLI-referens

```
ub build <input.ub> [ALTERNATIV]

-o, --output <fil> Skriv ut .prg- eller .crt-fil (standard: <input>.prg)
-v, --verbose Visa nollsidig layout och hex-dump av kod
--no-stub Hoppa över BASIC SYS-stubben (kod laddas vid $0801)
--debug Skapar även .sym-, .dbg- och .vs-felsökarfiler
--asm Skapar även en läsbar 6502-kodgenereringslista för .asm
--d64 [fil] Skapar även en .d64-diskavbildning;
utan filnamn används standardvärdet <output>.d64
--add <fil> Lägger till en extra fil till .d64-diskavbildningen;
kan upprepas för flera filer
--explicit Kräver :type på varje var / sub-param / fn-param
-h, --help Visa hjälp
```

### CRT-export

Ultimate Basic kan också skriva en Magic Desk typ-19-patronavbildning när
utdatafilnamnet slutar på `.crt`:

```bash
ub build demo.ub -o demo.crt
```

Kompilatorn slår in den genererade PRG:n i en bankad CRT-container med samma
layout som VisualAssemblers CRT-export: en 64-byte patronhuvud, en 8×8K Magic
Desk-avbildning och en starthanterare i bank 0 som kopierar PRG-nyttolasten till
C64 RAM innan den hoppar till programmets startpunkt. Sökvägarna `.prg` och
`.d64` fortsätter att fungera som tidigare.

### Explicit-typläge

Skicka `--explicit` för att tvinga varje deklarationsplats att bära en
`:type`-annotering:

```bash
ub bygg spel.ub --explicit
```

Utan flaggan accepterar Ultimate Basic både `var x = 5` (typ härledd från
initialiseraren eller standardinställd till `int`) och `var x: int = 5`. Med
flaggan kompileras endast den annoterade formen — den lösa formen blir ett
kompileringsfel.

**Vad den tillämpar:**

| Deklarationsblankett                              | Utan `--explicit` | Med `--explicit`  |
| ------------------------------------------------- | ----------------- | ----------------- |
| `var name = expr` (nej `:type`)                   | ok — typ antydd   | fel               |
| `var name: int = expr` (eller ord/flyttal/sträng) | ok                | ok                |
| `var arr = array(N)`                              | ok — typ antydd   | fel               |
| `var arr = array_word(N)`                         | ok                | ok                |
| `const NAME = value`                              | ok                | okej — oförändrad |
| `sub foo(a, b)` (otypade parametrar)              | ok                | okej — oförändrad |
| `sub foo(a: int, b: int)`                         | ok                | okej — oförändrad |
| `fn foo(a): int` (otypad parameter)               | ok                | fel på parametern |
| `fn foo(a: int): int`                             | ok                | ok                |
| `fn foo(a): int` (otypad parameter)               | ok                | fel på parametern |
| `fn foo(a: int): int`                             | ok                | ok                |

Konstanter och arraydeklarationer accepteras alltid — deras typ fastställs av
deklarationsformuläret, så `:type` skulle vara redundant.

**Exempel på felutdata:**

```
$ ub build myprog.ub --explicit
Kompileringsfel:
rad 14: 'explicit' läge: 'var loose' har ingen typ — använd 'var loose: int|word|float|string'
rad 16: 'explicit' läge: parameter 'a' har ingen typ — använd 'a: int|word|float|string'
```

Flaggan är en växling vid byggtid — ingenting i källkoden behöver ändras för att
välja att delta eller inte delta. Lägg till den i ditt Makefile-/byggskript för
att tillämpa typsnittsstil i hela projektet, eller ta bort den för utforskande
skript. Se `examples/explicit_demo.ub` och `examples/explicit_errors_demo.ub`.

### Felsök filer

Använd `--debug` för att generera felsökarsymboler tillsammans med programmet:

```bash
ub build demo.ub --debug
```

Kompilatorn skriver filerna bredvid `.prg` med hjälp av utdatafilens stam:

| Fil        | Format och syfte                                                                                   |
| ---------- | -------------------------------------------------------------------------------------------------- |
| `demo.sym` | KickAssembler-kompatibel symbolkälla, lämplig för import till assemblerkällkod                     |
| `demo.dbg` | C64Debugger/RetroDebugger KickAssembler debug-dump som innehåller programsegmentet och etiketterna |
| `demo.vs`  | VICE monitor-kommandofil som innehåller `al`-kommandon för adressetiketter                         |

Alla tre exporterna inkluderar `program_start`, `program_end`, variabler,
arrayer, subrutiner och BASIC-etiketter som är kända efter kodgenerering. Ladda
till exempel VICE-symbolerna med dess `-moncommands demo.vs`
kommandoradsalternativ eller bildskärmens `ll "demo.vs"`-kommando.

Den nuvarande `.dbg`-exporten tillhandahåller information om segment och
adresssymboler. Den inkluderar ännu inte mappningar av instruktions-till-källrad
för stegning på källnivå.

### Listning av assemblerkodgenerering (nytt i 1.5.2)

Använd `--asm` för att skriva en läsbar 6502-källförteckning bredvid PRG:n:

```bash
ub build demo.ub --asm
```

För en utdata med namnet `demo.prg` skapar detta `demo.asm`. Listningen
produceras från metadata som samlas in medan Ultimate Basic genererar
maskinkoden; det är inte bara en demontering av den färdiga PRG:n. Den
innehåller:

- `; UB:` kommentarer som markerar det genererade byteintervallet för varje
  emitterande UB-sats;
- namngivna konstanter för nollsidiga variabler och `$C000+`-arrayer, inklusive
  deras typer/storlekar;
- slutgiltiga namn och adresser för subrutiner och BASIC-etiketter;
- genererade `loc_xxxx`-etiketter för relativa grenar och `JMP`/`JSR`-mål i
  programmet;
- normal 6502 mnemonik och operander, med kompilatorsymboler ersatta där de är
  kända;
- den exakta C64-adressen och emitterade byte bredvid varje instruktion;
- kompilatorgenererade hjälpprogram och inbäddad kod i deras slutliga
  minnesordning;
- `.byte` utdata för byte som inte avkodas enligt stödda 6502-instruktioner.

Kompilatorhjälpare får beskrivande namn som `ub_helper_plot`,
`ub_helper_line_erase`, `ub_helper_print_hex` och `ub_helper_music_irq`. Kända
inbäddade data – inklusive `data`-satser, mapptecken-/färgmatriser, sprite- och
teckendefinitioner, sinus-tabellen, laddningsfilnamn, `incbin`-filer, SID-musik
och Koala-nyttolaster – genereras som namngivna `.byte`-regioner. Långa
nolfyllda adressgap använder KickAssemblers `.fill`-direktiv.

Exempelutdrag:

```asm
.label x = $02; int

* = $080D

ub_start:
cld; $080D: D8
; UB: var x
lda #$01; $080E: A9 01
sta x; $0810: 85 02
```

Adress-/bytekommentarerna gör det enkelt att jämföra listan med `.prg`. Utdata
använder KickAssembler-syntax (`.label`, `.byte`, `.fill` och `* = origin`) så
att den kan assembleras igen; maskinkodskommentarer påverkar inte resultatet.

`--add` kräver `--d64`. Det kompilerade `.ub`-programmet är alltid den första
filen på disken; varje `--add`-fil läggs till efter den. Filnamn på disken
härleds från källfilens stam, med versaler (t.ex. `music.prg` → `MUSIC`).

Efter en lyckad byggprocess skriver kompilatorn alltid ut en minneskarta:

```
demo.ub → demo.prg (386 byte)

Ladda: $080D – $0989

Variabler (noll sida):
poäng ZP:$08 byte
liv ZP:$0A byte
meddelande ZP:$0C sträng ptr ZP:$0E ord

Subrutiner: hälsning $0900 visa $0912

Matriser ($C000+):
sprites $C000 8 byte
```

Med `-v` visar utdata dessutom de interna ZP-allokeringarna och en fullständig
hex-dump.

### Genererad kod (optimerad i 1.6.0)

Kodgeneratorn avger en strängare 6502 för vanliga fall; programmen behöver inga
ändringar:

- Villkoren i `if` / `while` / `until` / `select` är en `CMP` plus en gren
  (inget 0/1-värde byggs och testas om). `x &gt; n` kompileras som `x &gt;=
  n+1`; `och` / `eller` av jämförelser kortsluter när höger sida inte har några
  biverkningar; `while` testar längst ner i loopen.
- Konstanter och bytevariabler är direkta operander (`ADC #n`, `CMP zp`); `poke`
  till en konstant eller `ord`adress lagras direkt.
- Arrayer med ett variabelt index använder `base,Y`-adressering istället för en
  nollsidig pekare.
- När en sats börjar med att ladda variabeln som den föregående satsen just
  lagrade, hoppas den redundanta `LDA` över.

Använd `--asm` för att se den genererade koden för ditt eget program.

## Kända begränsningar

| Särdrag                               | Begränsning                                                                                                                                                                                                                                                                         |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Heltalsaritmetik                      | 8-bitars osignerad (0–255); `word`-variabler innehåller 16-bitarsvärden                                                                                                                                                                                                             |
| Noll sidbudget                        | Permanent nollsida är `$02–$4F` (78 byte): varje variabel och sub/fn-parameter tar 2 byte, varje körande `för` loop 2 till. Eftersom 1.6.4 flyttas variabler som inte passar till RAM automatiskt (se *Variabler i RAM*); endast extrema fall rapporterar fortfarande `av nollsida` |
| Binära literaler                      | `%01010101` (sedan 1.6.4), `$hex` och decimal                                                                                                                                                                                                                                       |
| Subrutiner                            | Ingen rekursion — ZP-parameterplatser allokeras statiskt                                                                                                                                                                                                                            |
| Strängvariabler                       | `single` / `double` är 5-byte flyttal sedan 1.6.4 (ej användbara i IRQ-hanterare; runtime på ~4,4 KB har lagts till i programmet); `float` förblir Q8.8 (0–255,99)                                                                                                                  |
| Unär minus                            | Eftersom 1.6.4 binder en inledande `-` till sin operand: `-5 - 3` är -8 (den var -(5 - 3) = -2)                                                                                                                                                                                     |
| String concat-körning                 | `s1 + s2` skrivs ut sekventiellt — ingen heapallokering eller längdspårning                                                                                                                                                                                                         |
| `rnd()` / `rnd(n)`                    | Enkel LCG, inte kryptografisk; punkt = 256                                                                                                                                                                                                                                          |
| `abs()` / `sgn()` / `min()` / `max()` | Endast 8-bitarsvärden; `abs`/`sgn` behandlar värden som signerade (bit 7 = negativ → `abs` tvåkomplement, `sgn` returnerar `$FF`); `min`/`max` är osignerade (0–255)                                                                                                                |
| `diagram`                             | Pixlar utanför räckvidden klipps tyst bort (Y ≥ 200 eller X ≥ 320 → no-op)                                                                                                                                                                                                          |
| `mplot`                               | Ingen gränskontroll — x måste vara 0–159, y måste vara 0–199                                                                                                                                                                                                                        |
| `mline` / `mrect`                     | Flerfärgad; x: 0–159, y: 0–199. Pixlar utanför skärmen radbryts (ingen klippning) — håll koordinaterna inom intervallet                                                                                                                                                             |
| `mcirkel`                             | Flerfärgad; klipp av punkter utanför skärmen (x ≥ 160 eller y ≥ 200 hoppas över)                                                                                                                                                                                                    |
| `färgpenna`                           | Anställer endast; ställer in förgrundsbiten för berörda celler (bakgrunden bevaras). Har ingen effekt i blockläge (`plot4`/`circle4`)                                                                                                                                               |
| `rect`                                | Ingen gränskontroll — x: 0–319, y: 0–199; x1≤x2 och y1≤y2 tillämpas inte (degenererade/inverterade rektangulära element producerar odefinierad utdata)                                                                                                                              |
| `diagram4`                            | Ingen gränskontroll — x måste vara 0–79, y måste vara 0–49 (blockläge)                                                                                                                                                                                                              |
| `cirkel4`                             | Klipp ut blockpixlar utanför skärmen; användbar radie är ungefär 0–49 i 80×50 blockläge                                                                                                                                                                                             |
| `chr$`                                | Ingen PETSCII↔ASCII-mappning — n skickas som det är till CHROUT                                                                                                                                                                                                                     |
| `musikuppspelning`                    | Kräver `load sid` eller ett `tune`-block; endast en CIA1-omslagsfil genereras (den sista `musikuppspelningen` vinner)                                                                                                                                                               |
| `grafik på dubbel`                    | Anställer endast; använder `$4000–$7FFF` för backbufferten, så programkoden måste hålla sig under `$4400`; kan inte kombineras med sprites eller multicolor                                                                                                                         |
| Felrapportering                       | Endast vid kompilering; `onerr goto` hanterar KERNAL I/O-fel vid körning                                                                                                                                                                                                            |
