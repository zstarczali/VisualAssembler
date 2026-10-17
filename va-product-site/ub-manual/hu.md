# Ultimate Basic v1.6.6 — Nyelvi kézikönyv

Teljes nyelvi és parancssori felület (CLI) referencia az Ultimate Basichez, egy
BASIC-szerű nyelvhez, amely közvetlenül 6502-es gépi kóddá fordul Commodore
64-hez. Kimenet: `.prg` fájlok (VICE vagy valódi hardver), `.crt` kazettaképek
és `.d64` lemezképek.

A projekt rövid áttekintését és az építési utasításokat lásd a README.md
fájlban.

© 2026 Tarczali Zsolt

> A `ub` fordítóprogram fordítását és a parancssori opciókat a [README.md]{1]
> fájl tárgyalja. Ez a kézikönyv magát az Ultimate Basic nyelvet dokumentálja.

## Nyelvi referencia

### Változók és állandók

**Használat előtt minden változót deklarálni kell a `var` paranccsal.** Nem
deklarált változó használata kifejezésben, értékadásban, `for`/`loop`
számlálóban, `inc`/`dec`, `input` vagy `read` utasításban fordítási idejű hibát
eredményez.

```basic
var x = 10 # 8 bites egész szám (alapértelmezett)
var ptr: word = $0400 # 16 bites — két nulla oldalas bájt, 16 bites címként használható
var f: float = 3.5 # Q8.8 fixpontos — hi byte = egész szám, lo byte = tört szám
var msg = "HELLO" # karakterlánc változó (mutató a beágyazott PETSCII adatokra)
var s: string = "TEXT" # explicit típusú karakterlánc
var scores = array(10) # bájtos tömb, 10 elem a $C000+ címen tárolva
var moments = array_word(8) # szótömb, 8 szóelem a $C000+ címen tárolva
const BORDER_ADDR = $D020 # fordítási idejű állandó (beágyazott, nincs ZP slot)
```

A kulcsszavak és azonosítók **nem megkülönböztetik a kis- és nagybetűket**: a
`PRINT`, `Print` és `print` mind érvényes.

| Típus                 | Szélesség     | Megjegyzések                                                                            |
| --------------------- | ------------- | --------------------------------------------------------------------------------------- |
| `int`                 | 8 bites       | alapértelmezett numerikus literálok esetén                                              |
| `szó`                 | 16 bites      | két ZP bájt; címként használható `poke`/`peek`-ban                                      |
| `lebeg`               | 16 bites Q8.8 | hi byte = egész rész (0–255), lo byte = tört rész                                       |
| `egyszeres` / `dupla` | 5 bájt RAM    | lebegőpontos (C64 BASIC formátum, ~9 számjegy) — `dim x as double`; lásd *Lebegőpontos* |
| `karakterlánc`        | mutató        | ZP pár → null-terminált PETSCII a kódszegmensben                                        |
| `tömb(N)`             | N bájt        | bájt elemek; a `$C000+` címen található, nem a ZP-ben                                   |
| `array_word(N)`       | N×2 bájt      | szóelemek (16 bitesek); `$C000+` címen találhatók, nem ZP-ben                           |
| `tömb(R, C, …)`       | ∏dims bájtok  | többdimenziós (sor-szak); index `arr[r, c]`                                             |
| `array_word(R, C, …)` | ∏dims×2 bájt  | többdimenziós szótömb (sor-fő)                                                          |

#### BASIC stílusú deklarációk: `dim … as …`

Az `dim név típusként` az `var név alternatív írásmódja: típus` — ugyanaz a
tároló, ugyanaz a kód:

```basic
DIM kor AS INTEGER # előjeles 16 bites, 0-tól kezdődik
DIM nev AS STRING # karakterlánc, ""-ként kezdődik
DIM fizetes AS DOUBLE # lebegőpontos, 0-tól kezdődik
DIM x, y AS BYTE # több név, mindegyik típust kap
DIM pont AS INTEGER = 1000, cim AS STRING = "C64" # inicializálók, vegyes típusok
```

| `mint …`             | Ultimate Basic típus                                                                    |
| -------------------- | --------------------------------------------------------------------------------------- |
| `bájt`, `int`        | `int` (8 bites, 0–255)                                                                  |
| `egész szám`         | előjeles 16 bites (−32768 … 32767) — QBasic INTEGER                                     |
| `szó`                | `szó` (előjel nélküli 16 bites, 0–65535)                                                |
| `egyszeres`, `dupla` | lebegőpontos, 5 bájt RAM-ban (±2,9·10⁻³⁹ … 1,7·10³⁸, ~9 számjegy) — lásd *Lebegőpontos* |
| `lebeg`              | `float` (Q8.8 fixpont — 0–255.99, gyors)                                                |
| `karakterlánc`       | `karakterlánc`                                                                          |

- `= value` nélkül a számok 0-val, a karakterláncok pedig `""`-nél kezdődnek.
- Az `dim a, b as integer` függvény a **both** típusneveket adja vissza (VB.NET
  stílus, nem QBasic). Csak egyetlen névhez tartozhat inicializáló.
- Az `as` és a BASIC típusnevek kontextusszavak, nem foglaltak – névként
  továbbra is használhatók.
- Nem támogatott: `as long`, struktúratípusok (`var name: TName = array(N)`
  használata) — fordítási idejű hibák.
- Az `--explicit` esetén a `dim` `as` nélkül hibát jelent.
- A karakterlánc-hozzárendelésnek érték-szemantikájával kell rendelkeznie: az `s
  = "TEXT"` a literálra mutat, az `t = s` és a kiszámított értékek a `t` saját
  pufferébe másolódnak (lásd: *Karakterláncok futásidejű állapotban*). Az 1.6.3
  előtt az `s = "TEXT"` a deklaráció után egy szemétbájtot tárolt a mutatóban.

#### `dim` típusú tömbök: `dim név(u1, u2, …) típus`

```basic
DIM tabla(2, 3) AS INTEGER ' 3 × 4 elem: tabla(0..2, 0..3)
DIM kocka(1, 2, 3) AS BYTE ' tetszőleges számú dimenzió
DIM ar(9) AS DOUBLE ' 10 lebegőpontos érték (egyenként 5 bájt)
DIM nevek(4) AS STRING ' 5 karakterlánc, mindegyik ""-vel kezdődik
DIM v(9) ' nincs AS → bájt tömb

tabla(2, 3) = 999 ' QBasic stílusú index ( )-vel
tabla[2, 3] = 999 ' … vagy a szokásos [ ]
nevek(0) = "ZSOLT"
PRINT tabla(2, 3); " "; nevek(0); " "; ar(1)
```

- Minden korlát a **legmagasabb indexű** (ALAP szabály): Az `dim t(2, 3)` 3 × 4
  elemet tartalmaz. (Az `var t = array(3, 4)` elemszámot vesz fel — ugyanaz a
  tömb.)
- Elemtípusok: `byte`/`int` → 1 byte, `integer` (előjeles) / `word` → 2 byte,
  `float` → 2 byte Q8.8, `single`/`double` → 5 byte lebegőpontos, `string` → 2
  byte-os pointer. A határoknak fordítási idejű állandóknak kell lenniük. A
  tömbök a `$C000-$CFFF` (4 KB) mappában találhatók; Amikor többre van
  szükségük, a teljes tömbterület a `$A000-$CFFF` mappába kerül (12 KB, a BASIC
  ROM alatt — lásd *Tömbmemória*). 12288 bájtnál nagyobb méret fordítási idejű
  hibát jelent.
- A karakterlánc-tömb elemei így kezdődnek: `""`; `nevek(i) = "TEXT"` / `= s` /
  `= a + b`, `n = nevek(i)`, nyomtatás, `+`, átadva egy `string` paraméternek és
  `input nevek(i)` mind működnek (a nem literál értékek elemenként egy 31
  karakteres helyre másolódnak).
- Az `name(i)` indexelés a `var a = array(…)` paraméterrel deklarált tömbök
  esetén is működik.
- Egy tömb `dim` csoportonként: `dim a(3) bájtként, n egész számként. Az `
  rendben van, az `dim n, az a(3) egész számként ` hiba. Nincs inicializáló —
  használja az ` adatnevet: …`.

### Foglalt szavak

A következő azonosítók **kulcsszavak** – nem használhatók változó, konstans,
alprogram, függvény, paraméter vagy címkenévként. Minden egyezés kis- és
nagybetűérzékeny (`END`, `end`, `End` mind ütköznek). Foglalt szó névként való
használata általában zavaró hibát okoz (egy `var` sor csendben nem deklarálódik,
vagy egy olyan kifejezés, mint a `for i = 1 to times`, `Number(0)`-ra hajtódik)
– ezért válasszon másik nevet.

**Deklarációs és vezérlési folyamat** `var`, `const`, `sub`, `fn`, `type`,
`endtype`, `return`, `call`, `label`, `goto`, `gosub`, `if`, `then`, `else`,
`end`, `select`, `case`, `for`, `next`, `loop`, `times`, `to`, `step`, `while`,
`repeat`, `until`, `break`, `continue`, `inc`, `dec`, `bye`, `exit`, `rem`

**Music** `tune` (blokk kulcsszó; a benne lévő sorok - `speed`, `inst`, `order`,
`pat` - nincsenek lefoglalva)

**Típusok és típussal kapcsolatos** `int`, `word`, `float`, `string`, `array`,
`array_word`

**Nyomtatás és I/O** `nyomtatás`, `spc`, `tab`, `at`, `bemenet`, `chr$`, `str$`,
`hex`, `bin`, `megnyitás`, `bezárás`, `betöltés`, `mentés`, `lánc`, `adat`,
`read`, `include`, `incbin` (szintén `dec` — fentebb csökkentési utasításként
szerepel; ugyanazt a tokent használjuk a `dec(n, width)` nyomtatási formátumhoz)

**Beépített matematikai és karakterlánc-funkciók** `abs`, `min`, `max`, `clamp`,
`sgn`, `mod`, `rnd`, `sin`, `cos`, `and`, `or`, `xor`, `not`, `bnot`, `shl`,
`shr`, `len`, `asc`, `val`, `str_to_int`, `numstr`

**Memória és időzítés** `poke`, `peek`, `poke16`, `peek16`, `fill`, `memcopy`,
`drawmem`, `wait`, `raster`, `delay`, `sys`, `asm`

**Képernyő és szöveg** `cls`, `fast`, `color`, `text`, `border`, `bg`, `screen`,
`cursor`, `lowercase`, `uppercase`, `display`, `on`, `off`, `scroll`, `speed`,
`badlines`, `turbo`

**Bitképes és blokkos grafika** `graphics`, `gcls`, `flip`, `plot`, `plot4`,
`mplot`, `mline`, `mrect`, `mcircle`, `line`, `circle`, `circle4`, `rect`,
`paint`, `erase`, `pen`, `multi`, `block`

**Sprite-ok** `sprhit`, `sprdef`, `sprite_frame`, `sprite_x`, `sprite_y`,
`sprite`, `sprbghit`, `box_hit`, `chardef`, `charset`, `org`, `expand`,
`priority`

**Hang és zene** `sid`, `sound`, `sfx`, `volume`, `music`, `play`, `pause`,
`resume`, `stop`

**Beviteli eszközök** `getch`, `inkey`, `waitkey`, `joy`, `mouse_x`,
`mouse_x_hi`, `mouse_y`, `mouse_btn`

**Megszakítások és vektorok** `irq`, `irq_exit`, `nmi`, `nmi_exit`, `cia_timer`,
`onerr`

**Karaktertérképek és képek** `map`, `map_tile`, `map_color`, `koala`, `show`,
`hide`

**REU (RAM bővítés)** `reu`, `reudet`, `stash`, `fetch`

**Stílusbeli buktatók – olyan nevek, amelyek *szabadnak* tűnnek, de mégis
visszafogottak**

Ezek az angol szavak ártatlan azonosítóknak tűnnek, de a lexer már lekéri őket.
Nevezd át őket a csendes megszakítás elkerülése érdekében:

| Fenntartott                                                | Javasolt átnevezés                              |
| ---------------------------------------------------------- | ----------------------------------------------- |
| `vég`                                                      | `megállás`-nél, `befejezés`, `utolsó`           |
| `állj`                                                     | `megállj_`-nél, `megállj`                       |
| `szor`                                                     | `számlálás`, `n`, `iter`                        |
| `képernyő`                                                 | `képernyő_cím`, `képernyő_cím`                  |
| `szegély`, `háttér`, `szöveg`                              | `szegély_cím`, `háttér_oszlop`, `szöveg_oszlop` |
| `szorító`                                                  | `sapka`, `kötés`                                |
| `vonal`, `kör`, `téglalap`                                 | `ln`, `kör`, `doboz_r`                          |
| `adat`, `olvasás`                                          | `bájt`, `következő_bájt`                        |
| `betöltés`, `mentés`, `megnyitás`, `bezárás`               | `fájl_betöltés`, ...                            |
| `térkép`, `megjelenítés`, `elrejtés`                       | `csempetérkép`, `felfedés`, `elrejtett`         |
| `lejátszás`, `szünet`, `folytatás`, `leállítás`, `hangerő` | `dal_lejátszása`, `hangerő`                     |
| `int`, `float`, `word`, `string`                           | `n_int`, `speed_f`, `cím`, `üzenet`             |

A szimbolikus tokenek (`+ - * / = == != < > <= >= : , ; ( ) [ ] # $ % @`)
természetesen nem használhatók azonosítókban.

### Hozzászólások

```basic
# hash comment
rem this is also a comment
var x = 5  # inline comment
var x = 5 : var y = 6  # colon separates statements on one line
```

### Operátorok

```basic
x = x + 1
y = a * b - c / 2
z = x és 15 # bitenkénti ÉS
w = a vagy b # bitenkénti VAGY
v = a xor b # bitenkénti XOR
m = x shl 3 # eltolás balra
n = x shr 2 # eltolás jobbra (INTEGER esetén: -8 shr 1 = -4)
r = x mod 40 # maradék; x mod 0 = x, x / 0 = 255
b = bnot x # bitenkénti NEM: x XOR 255 (mind a 8 bit komplementere)
```

Összehasonlítások: `==` `!=` `<` `>` `<=` `>=` (visszaadás 1/0)

Számtani kód (1.6.0): Az `*` egy konstans hatására shifts / shift-add (`x * 8` →
3× `ASL`) formátumba fordul, egyébként egy legfeljebb 8 körös shift-add
ciklusba. Az `/` és a `mod` kettő hatványán `LSR` / `ÉS #(n-1)`, egyébként egy 8
körös shift-subtract ciklusba, amelynek futási ideje már nem függ a hányadostól.
A nullával való osztás definíciója: `x / 0 = 255`, `x mod 0 = x` (az 1.6.0 előtt
lefagyott).

Az `mod` egy `word` vagy `integer` operandussal (vagy negatív konstanssal) egy
16 bites maradék az osztandó előjelével, mint a QBasic-ben: `-7 mod 3` = -1, `7
mod -3` = 1, `(w + 5) mod 7` 16 bitet tart meg. EGYSZERES / KETTŐS operandussal
lebegőpontos számként működik (lásd *Lebegőpontos*). Egy `egész szám` `shr`
értéke aritmetikai eltolódás (az előjel megmarad: `-8 shr 1` = -4); az `szó` és
a bájtértékek logikailag eltolódnak. Az `x = x + 1` / `x = x - 1` (és ±2) `INC`
/ `DEC` formátumra fordítandó.

### Növelés / Csökkentés

```basic
inc x # x = x + 1 (INC zp — egyetlen utasítás) dec x # x = x - 1 (DEC zp — egyetlen utasítás)
```

Az `szó` esetén a változók átvitele a következőképpen történik: `inc` a
következőt használja: `INC lo; BNE skip; INC hi`; `dec` a következőt használja:
`LDA lo; BNE skip; DEC hi; DEC lo`.

### Összetett hozzárendelések

```basic
x += 5 # x = x + 5
x -= 3 # x = x - 3
x *= 2 # x = x * 2
x /= 4 # x = x / 4
x és= 15 # x = x és 15 (bitenkénti ÉS)
x vagy= 64 # x = x vagy 64 (bitenkénti VAGY)
x xor= 255 # x = x xor 255 (bitenkénti XOR)
x shl= 2 # x = x shl2
x shr= 1 # x = x shr1
```

### Nyomtatás

```basic
print "HELLO"
print x
print x, y, "text"
print # üres sor

print spc(5) # 5 szóköz karakter kiírása
print tab(20), "VALUE" # kurzor mozgatása a 20. oszlopba, majd kiírás
print "A", spc(3), "B" # szabadon keverhető

print "A=" + a # karakterlánc + numerikus változó
print s1 + s2 # két karakterlánc változó → szekvenciális kiírás
print "Hello " + "World" # két literál → fordítási idejű hajtogatás
print chr$(13) # kiírás PETSCII kóddal
```

Alapértelmezés szerint a számok szóközök nélkül kerülnek kinyomtatásra, és az
`,` csak elválasztja az elemeket (az `print 1, 2` eredményül `12`) kerül
kinyomtatásra. A C64 BASIC térközökhöz használd az `--basic-print` kapcsolót,
vagy írj be egy `opciót a basic print` sorba: egy szám ezután egy kezdő
szóközzel (vagy a `-`) és egy záró szóközzel (`print 5` → ` 5 `) nyomtat ki, egy
`,` karakter a következő 10 oszlopos nyomtatási zónára ugrik, és egy záró `,`
karakter a kurzort a sorban tartja, mint egy záró `;`. A `spc`, `tab`, `hex`,
`bin`, `dec`, `chr$` és `str$` karakterláncok az előzőek szerint jelennek meg.

#### `NYOMTATÁS ` HASZNÁLATÁVAL

```basic
DIM ar AS DOUBLE = 1234,5
DIM s AS STRING = "ALMA"
NYOMTATÁS "###.##"; 3,14159 ' 3,14
NYOMTATÁS "Ar: #,###.## Ft"; ar ' Ar: 1 234,50 Ft
NYOMTATÁS "+##"; 7 ' +7
NYOMTATÁS "##.##-"; -2,25 ' 2,25-
NYOMTATÁS "##"; 123 ' %123
NYOMTATÁS "[&amp;] [!] [\ \]"; s; s; s ' [ALMA] [A] [ALMA]
NYOMTATÁS "## "; 1, 2, 3 ' 1 2 3
```

| Mező                  | Jelentés                                                                                                                            |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `#`                   | egy számjegy pozíciója; a számok jobbra igazítottak és tizedesjegyekre vannak kerekítve                                             |
| `.`                   | tizedesvessző; az utána következő `#` számjegyek a tizedesjegyek (legfeljebb 9)                                                     |
| `,`                   | pont előtt: ezreselválasztók (mindegyik `,` egy-egy karaktert jelöl)                                                                |
| `+` az elején         | mindig írja ki a jelet (`+` / `-`)                                                                                                  |
| `-` a végén           | írd ki a mínuszjelet a szám után (pozitív esetben szóközt)                                                                          |
| `&amp;` / `!` / `\ \` | karakterlánc: a teljes karakterlánc / az első karaktere / pontosan annyi karakter, amennyi a mező szélessége (`\` + szóközök + `\`) |
| `_`                   | írja ki a következő karaktert úgy, ahogy van (`_#`)                                                                                 |

Egy nem férő szám elé `%` karakterlánc kerül kiírásra (`%123`); először egy
kezdő 0 kerül kiírásra (`#.##` -0.5 → `-.50`). A többi karakter változatlanul
kerül kiírásra. Az értékek végighaladnak a mezőkön (a formátum újraindul, amikor
elfogy); az utolsó érték után a következő mezőig tartó szöveg kerül kiírásra. A
`;` vagy `,` karakterlánc a sorban tartja a kurzort. A formátumnak karakterlánc
literálnak kell lennie; az `**`, `$$` és `^^^^` mezők nem támogatottak. Egy
`PRINT USING` függvénnyel rendelkező program tartalmazza a lebegőpontos futási
környezetet (csak a szükséges részeket).

### chr$

```basic
print chr$(65) # PETSCII kódú karakter kimenete 65 ('A')
var c = chr$(n) # az n byte értékének tárolása a c változóban
print "&gt;" + chr$(42) # használható karakterláncban concat
```

### Elágazó

```basic
ha x == 1, akkor kiírja: "IGEN"
különben kiírja: "NEM"
vége
```

### Kiválasztás / Eset

```basic
x kiválasztása
1. eset:
"EGY" kiírása
2. eset:
"KETTŐ" kiírása
egyébként:
"EGYÉB" kiírása
vége
```

A `select expr` egyszer kiértékeli a kifejezést, és sorban összehasonlítja az
egyes `case` értékekkel. Az első egyező esettörzs végrehajtásra kerül, és a
vezérlés a `end` utáni értékre ugrik. Az opcionális `else:` törzs akkor fut le,
ha nincs egyező esettörzs. Minden értéknek 8 bitesnek (0–255) kell lennie.

### Hurokok

```basic
5. ciklus # számlált ciklus (5 iteráció)
print "HI"
end

times 5 # az N. ciklus aliasa ... end
print "HI"
end

ciklus # végtelen ciklus
x = x + 1
ha x == 5, akkor folytatódik end # ugrás a következő iterációra
ha x == 100, akkor megszakít end
end

var i = 0
for i = 1-től 10-ig # for..next (ajánlott)
ha i == 5, akkor folytatódik end # ugrás a növelési lépésre
print i
next

for i = 0-tól 20-ig 2. lépés
print i
next i # a 'next' utáni változó neve opcionális

for i = 10-től 1-ig step -1 # visszaszámlálás — negatív konstans step támogatott

print i
next

for i = 20-tól 0-ig step -2 # helyesen fejeződik be i = 0-nál (11 iteráció)
print i
next i

var i = 0
loop i = 1-től 10 # hagyományos ciklus..end szintaxis — azonos kód
print i
end

while x &lt; 100
x = x + 1
end

repeat # do-while: törzs legalább egyszer lefut
x = x + 1
amíg x == 100 # kilép, ha a feltétel igaz
```

**Útvonalszabályok `for`/`loop` számára:**

| Ügy                                                        | Viselkedés                                                                                                                |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `for i = 1 to 10` (alapértelmezett `step +1`, `from ≤ to`) | számol felfelé, standard                                                                                                  |
| `for i = 0 to 20 step 2` (pozitív lépés, `from ≤ to`)      | 2-vel felszámol                                                                                                           |
| `for i = 10 to 1 step -1` (negatív állandó lépésköz)       | visszaszámol; a test i = 10, 9, ..., 1-ig fut                                                                             |
| `for i = 20 to 0 step -2` (nulláig)                        | i = 0-nál ér véget a csökkentés utáni 0 alatti körbefordulás észlelésével; nincs végtelen ciklus                          |
| `for i = 10 to 1` (nincs lépés, `from > to`)               | **fordítási idejű hiba**: `for-loop: from (10) > to (1) with default step +1 loops 0 times — use 'step -1' to count down` |

Kód alakja (1.6.0): a ciklus *rotated* — `JMP test` (elhagyva, ha az állandó
korlátok garantálják az első menetet), a törzs, `var += step`, majd az alsó
teszt visszaágazik a törzsre, így nincs extra `JMP` iterációnként. A lépés
mindkét irányban 8 bites körbefuttatást észlel (`INC`/`BEQ` vagy `ADC`/`BCS`
felfelé számol, `BEQ`/`DEC` vagy `SBC`/`BCC` lefelé számol), így az `i = 0 és
255 között ` 256-szor lefut és megáll, a `i = N és 0 között pedig a -k lépés `
mindig véges. Azonnali értékként konstans határértékeket és lépéseket használunk
(nincs nulla oldal); Egy nem konstans határérték vagy lépés egyszer kerül
kiértékelésre, és állandó nulla oldalon marad.

A nem konstans `step` értékeket (például egy változóból vagy kifejezésből)
fordítási időben pozitívként kezeli a rendszer; ha futásidejű lépésértékkel
rendelkező visszaszámlálásra van szükséged, oszd szét a ciklust, vagy használj
`while` konstrukciót.

### Címkék és ugrás

```basic
címke fő_ciklus
x = x + 1
ha x &lt; 10, akkor a fő_ciklus végére ugorunk
```

A `goto` továbbítási mód (a címke később definiálva) teljes mértékben
támogatott.

`gosub label` / `return` ugrás egy címkére és visszalépés (JSR / RTS gépi kód
szinten). A címkének `label name` utasításnak kell lennie, nem `sub` – nincsenek
paraméterei, és ugyanazt a nulla oldalas hatókört használja. A `gosub` támogatja
az előre mutató hivatkozásokat (a címke a `gosub` után van definiálva).

```basic
gosub rajzol_keret
...
címke rajzol_keret
# ... rajzol valamit ...
return # RTS — visszatér a gosub utáni utasításhoz
```

### Alprogramok

```basic
sub greet()
print "HELLO!"
end

sub set_color(col)
szegély színe oszlop
szöveg színe oszlop
end

greet() # hívás zárójelekkel
greet hívása # kulcsszó hívása (zárójelek nélkül)
set_color(6)
```

A paraméterek átadása dedikált nulla oldalas tárolóhelyeken keresztül történik.
Nincs rekurzió (a tárolóhelyek statikusak). A típusos paraméterek támogatottak:
`sub draw(x, y:int)` vagy `sub copy(src:string)` — a karakterlánc paraméterek
egy 2 bájtos mutatót kapnak, így a hívott fél a `src[i]` segítségével
indexelheti a forrás karakterláncot.

### Függvények (visszatérési értékek)

```basic
fn négyzet(x)
return x * x
end

fn összeadás(a, b)
return a + b
end

fn clamp(érték, lo, hi)
ha érték &lt; lo, akkor return lo end
ha érték &gt; hi, akkor return hi end
return érték
end

var s = négyzet(9) # s = 81 — fn hívás kifejezésként
var c = clamp(joy, 0, 39) # c = rögzített érték
print összeadás(10, 20) # 30 — használható inline a nyomtatásban
```

A függvények támogatják az opcionális `: word` visszatérési típust 16 bites
értékek esetén:

```basic
fn get_addr(): word
return $C000
end

var ptr: word = get_addr() # ptr = $C000
poke ptr, 42 # STA (ptr),Y — érvényes közvetett címzés
var v = peek(ptr) # LDA (ptr),Y
```

A `fn` a 2. lépésben kerül kibocsátásra (ugyanaz, mint a `sub`), így a
függvénytörzsek soha nem futnak le indításkor. Az előre mutató hivatkozások
teljes mértékben támogatottak.


#### QBasic stílusú `FUNCTION` / `SUB`

```basic
FUNKCIÓ Negyzet (szam AS INTEGER) AS INTEGER
    Negyzet = szam * szam ' return value = hozzárendelés a függvény nevéhez
VÉGE FUNKCIÓ

FUNKCIÓ Nagyobb (a AS BYTE, b AS BYTE) AS BYTE
    Nagyobb = a
    HA b &gt; a AKKOR
        Nagyobb = b
        EXIT FUNCTION ' visszatér most, az eddig hozzárendelt értékkel
    VÉGE HA
VÉGE FUNKCIÓ

SUB Koszont (nev AS STRING)
    NYOMTATÁS "Üdvözöllek, "; nev; "!"
END SUB

n = Negyzet(30)
Koszont "Zsolt" ' hívás zárójel nélkül
Koszont("Zsolt") ' ... vagy velük
CALL Koszont("Zsolt")
```

- Az `function` a `fn` szinonimája; az `p AS type` paraméterlistákban működik,
  az `AS type` pedig a ` után)` megadja a visszatérési típust (ugyanazok a
  típusnevek, mint a `dim`-nél). Az `: a type` továbbra is működik.
- A függvénynévhez rendelt érték egy rejtett `<név>__result` változóba
  tárolódik, amely az `END FUNCTION` / `EXIT FUNCTION` parancsnál tér vissza; a
  `return expr` parancs is működik.
- Az `END SUB`, `END FUNCTION`, `END IF`, `END SELECT` szavak elfogadottak (a
  második szó opcionális); az `EXIT SUB` / `EXIT FUNCTION` szavak visszatérési
  értéke (a sima `exit` továbbra is `bye`).
- Egy sub/fn zárójel nélkül hívható: `Koszont "Zsolt"`, `Rajzol x, y`.
- Az `PRINT a; b; c` — `;` utasítás szóközök nélkül köti össze az elemeket; egy
  `;` utasítás utáni `;` utasítás, amelyet egy utasítás követ (`print x; y =
  1`), továbbra is elválasztja az utasításokat.
- A karakterlánc literálokban az ékezetes betűk az alapbetűjükkel megegyezően
  jelennek meg (`ü` → `u`, `ő` → `o`); a C64 karakterkészletben nincsenek
  ékezetek.
- A szó/float paraméterek mostantól mindkét bájtot fogadják, és egy `string`
  paraméternek átadott karakterlánc literál is működik (korábban csak a lo bájt
  / egy karakterlánc változó működött).
- Nincs rekurzió (a paraméterek statikus nulla oldalas helyeken találhatók); az
  1.6.3 verzió óta a rekurzív hívás fordítási hibát jelez, nem pedig csendes
  hibás eredményt.

#### További QBasic szintaxis (1.6.3)

Az alábbi QBasic űrlapok az eredeti szintaxis mellett fordulnak le (az `==`,
`end`, `loop`, `#` megjegyzések mind továbbra is működnek).

```basic
' megjegyzés (QBasic stílus, például #)
HA x = 3 AKKOR KIÍR "három" ' egysoros HA: nem VÉGE HA szükséges
HA x &lt;&gt; 3 AKKOR KIÍR "nem" KÜLÖNBEN KIÍR "igen"
HA n &lt; 0 AKKOR KIÍR "negatív"
KÜLÖNBEN HA n = 0 AKKOR KIÍR "nulla"
KÜLÖNBEN KIÍR "pozitív"
VÉGE HA

DO WHILE i &lt; 10 : i = i + 1 : LOOP ' szintén DO UNTIL c … LOOP,
DO : i = i - 1 : LOOP UNTIL i = 0 ' DO … LOOP WHILE c, DO … LOOP (végtelen)
WHILE k &lt;&gt; 5 : k = k + 1 : WEND
i = 1-TŐL 100-IG
HA i = 12 AKKOR KILÉPÉS FOR ' KILÉPÉS DO / KILÉPÉS FOR / KILÉPÉS FOR
KÖVETKEZŐ

SELECT CASE n CASE 1, 2, 3: PRINT "kicsi"
CASE 10 TO 20: PRINT "tinédzser"
CASE IS &gt; 1000: PRINT "nagy"
CASE ELSE: PRINT "egyéb"
END SELECT

AZ END ' befejezi a programot (a képernyő megmarad)
```

- **Feltételek:** az `IF` / `ELSEIF` / `WHILE` / `UNTIL` / `LOOP WHILE|UNTIL`
  cikluson belül egyetlen `=` összehasonlítja. Az `&lt;&gt;` azt jelenti, hogy
  nem mindenhol egyenlő (ugyanaz, mint az `!=`).
- **Egysoros HA:** egy `THEN` utáni utasítás egy egysoros HA-t hoz létre, amely
  a sorral végződik, vagy egy `end` utasítással ugyanazon a sorban (`if c then x
  = 1 end`, mint korábban). Egy többsoros HA-nak sortörésre van szüksége az
  `THEN` után. A QBasic-hez hasonlóan minden, ami az adott sorban a `THEN` után
  van, az HA-hoz tartozik (`… THEN EXIT FOR : NEXT` elnyelné a `NEXT`
  utasítást).
- **`END` önmagában:** egy `END`, ami nem zár le blokkot, befejezi a programot,
  mint a QBasic. Egy felesleges `end` ezért már nem jelenik meg hibaként.
- **`DO` blokkok:** egy `DO` blokkon belül egy `LOOP` zárja le a sort (az
  eredeti `ciklus N … end` / `ciklus i = … end` ciklusok továbbra is működnek
  benne).
- **`SELECT CASE`:** a régi `select x` / `case n:` űrlap változatlan. A `SELECT
  CASE` egy HA lánccá redukálódik egy rejtett `select__N` változó felett.

#### Futásidejű karakterláncok (1.6.3)

```basic
DIM s AS STRING, t AS STRING
s = "Pont: " + pont + "!" ' a számok szöveggé alakulnak (16 bites, előjeles INTEGER esetén)
t = s ' egy másolat: s későbbi módosítása nem változtatja meg a t-t
s = s + "?"
PRINT LEFT$(s, 4); RIGHT$(s, 2); MID$(s, 7, 3); MID$(s, 7)
PRINT LEN(s + t), VAL("1234") + 1, STR$(pont)
HA s = "ABC" VAGY t &lt;&gt; "" AKKOR PRINT "összehasonlítás = / &lt;&gt;-val"
```

- **Pufferek:** egy karakterlánc változó, amely számított értéket kap (`+`,
  `left$`, `right$`, `mid$`, számok, egy másik változó), egy 80 karakteres
  pufferrel rendelkezik; a hosszabb eredményeket 80 karakternél vágja le a
  rendszer. Egy literál hozzárendelése továbbra is csak rámutat rá.
- **Sztringtömbök: Az ** elemek, amelyek nem literál értéket kapnak (vagy
  `input`), saját 32 bájtos helyet kapnak (31 karakter), így az `input nevek(i)`
  egy ciklusban minden nevet megtart.
- **`STR$` / `VAL`:** Egy 16 bites vagy előjeles érték `STR$` eleme nem
  tartalmaz vezető nullákat (`"-42"`). A kompatibilitás érdekében egy bájt
  `STR$` eleme megőrzi a 3 jegyű alakját (`"007"`). Az `VAL` 16 bites előjeles
  számokat olvas be (`VAL("1234") + 1` = 1235).
- **Összehasonlítás:** `=` / `&lt;&gt;` (és `==` / `!=`), és `&lt;` `&gt;`
  `&lt;=` `&gt;=` PETSCII sorrendben, mint a C64 BASIC; minden hosszabb
  karakterlánc előtt egy karakterlánc áll, amelyik kezdődik (`"AB" &lt; "ABC"`,
  `"" &lt; "A"`).

#### Előjeles INTEGER, INPUT, DOUBLE (1.6.3)

- Az **INTEGER előjeles:** `DIM x AS INTEGER` előjeles 16 bites (−32768 … 32767,
  mint a QBasic): nyomtatás, `&lt;` `&gt;` összehasonlítások, `/` (nulla felé
  csonkol), `ABS`, szövegkonverzió, `INPUT` és `FOR` nullán keresztüli ciklusok
  (`FOR i = 3 TO -3 STEP -2`) mind az előjelet követik. Az `WORD` előjel nélküli
  0 … 65535 marad. Az unáris mínusz bárhol működik (`a &lt; -10`, `x * -2`).
- A **`FOR` egy 16 bites számlálóval** (`INTEGER` / `WORD`) egy valódi 16 bites
  ciklus. Régebben 256-nál tördelte a ciklust, így a `FOR k = 0 TO 300` 45-ször
  futott le.
- **`INPUT`:** INTEGER / WORD-ba maximum 6 karaktert olvas be (`-` INTEGER
  esetén), DOUBLE-ba `12.5` (két tizedesjegy) fogad el. `INPUT t(i)` tömbelembe
  olvas, és `INPUT "prompt"; x` is működik.
- Az **DOUBLE ÷ DOUBLE** most már pontos (`7.5 / 2.5 = 3.00`); korábban csak az
  osztó egész részét használták. A DOUBLE × DOUBLE már korábban is támogatott
  volt.
- A 256 bájtnál nagyobb ** tömbök** (`DIM t(200) AS INTEGER`, `DIM g(19, 19)`)
  változó indexekkel működnek; az indexet a 256-os értéknél történő tördeléshez
  és a rossz elembe való íráshoz használják.
- Az **Rekurzió** (egy al-/függvény, amely közvetlenül vagy másokon keresztül
  hívja meg önmagát) egy fordítási hiba. Korábban hibás eredményeket adott
  vissza, mivel a paraméterek fix nulla oldalas helyeken találhatók.

### Tömbök

```basic
var scores = array(8) # 8 bájt $C000-nál
# (minden tömböt nullával töltünk ki egyszer a program indításakor — újdonság az 1.5.7-es verzióban)

scores[0] = 100 # konstans index → STA $C000
scores[i] = 99 # változó index → STA (ptr),Y
var v = scores[i] # LDA (ptr),Y
print scores[2] # használható inline a nyomtatásban

var moments = array_word(8) # 16 bájt (8×2) $C000+-nál

moments[0] = $1234 # konstans index → STA $C000 (lo), STA $C001 (hi)
moments[i] = $5678 # változó index → ASL A stride; (ptr),Y × 2
var t: word = moments[1] # LDA $C002, LDA $C003
```

**Többdimenziós tömbök** (újdonság az 1.5.3-as verzióban)

A tömbök több dimenzióval is deklarálhatók. Tárolásuk **sor-fő**, és vesszővel
elválasztott alsó indexű listával vannak indexelve. A teljes méret az összes
dimenzió szorzata.

```basic
var grid = array(8, 8) # 8×8 = 64 bájt $C000-nél
grid[1, 0] = 11 # 1. sor, 0. oszlop → flat index 1*8+0 = 8 → STA $C008
grid[0, 1] = 22 # 0. sor, 1. oszlop → flat index 1 → STA $C001
grid[r, c] = 33 # változó → kiszámítja az r*8 + c értéket, majd STA (ptr),Y
var v = grid[r, c] # LDA (ptr),Y

var wm = array_word(4, 4) # 4×4 szavas tömb = 32 bájt
wm[1, 2] = $ABCD # elem 1*4+2 = 6 → bájtok $C00C/$C00D

const ROWS = 3
const COLS = 5}var m = array(ROWS, COLS) # a dimenziók lehetnek fordítási idejű állandók
```

A sor-fő elrendezés azt jelenti, hogy az utolsó alsó index összefüggő: a
`grid[r, c]` a `base + r*COLS + c` címen található. Tetszőleges számú dimenzió
támogatott (`array(a, b, c)`). Ha minden alsó index konstans, a cím fordítási
időben egyetlen abszolút tárolási/betöltési címre hajtódik össze; egy változó
alsó index adja ki a `row*stride + col` számítást és az indexelt `(ptr),Y`
hozzáférést. Egyetlen alsó index hozzáadása egy többdimenziós tömbhöz továbbra
is megengedett, és flat/lineáris indexként kezelendő (`grid[10]`). A
dimenzióknak fordítási idejű állandóknak (literáloknak vagy `const`s-nek) kell
lenniük, és a tömböt indexelés előtt deklarálni kell.

**Struktúratípusok (`type ... endtype`, új az 1.5.4-es verzióban)**

Definiáljon egy fix elrendezésű elnevezett mezőket a `type` értékkel, majd
foglaljon le egy tömböt a példányok közül ugyanúgy, mint egy hagyományos tömböt.
A mezőhozzáférés a `arr[idx].field` értéket használja, és mind konstans, mind
változó indexek esetén működik.

```basic
típus TEntity
var x: int # 1 bájt
var y: int # 1 bájt
var hp: szó # 2 bájt → elem mérete = 4
endtype

const N = 8
var enemies: TEntity = array(N) # N × 4 = 32 bájtot foglal le $C000-nál

enemies[0].x = 5
enemies[0].y = 10
enemies[0].hp = $0100
var v = enemies[0].hp # visszaolvasás — LDA $C002 / LDA $C003

var i: int = 2
enemies[i].x = 42 # változó index → idx * elem_size + offset

# Lebegőpontos mező (Q8.8 fixpontos)
type TBall
var bx: int # 1 bájt
var by: int # 1 bájt
var vel: float # 2 bájt Q8.8 → elem mérete = 4
endtype

var balls: TBall = array(3)
balls[0].vel = 1.5 # elmenti a Q8.8-at: hi=1, lo=128
var f: float = balls[0].vel # float mező beolvasása a float változóba
print balls[0].vel # kiírja "1.50"-et
```

Szabályok és korlátozások:

- Mezőtípusok: `int` (1 bájt), `word` (2 bájt LE), `float` (2 bájt Q8.8). A
  `string` és a beágyazott `type` mezők még nem támogatottak.
- Elemméret = a mezőszélességek összege (deklarációs sorrend, kitöltés nélkül).
- A tárhely a `$C000+` címen található a hagyományos tömbök mellett, és a
  memóriatérképen a teljes bájtméretű hagyományos tömbként jelenik meg.
- Konstans index → `LDA/STA absolute` fordítási időben.
- Változó index → eltolással és összeadással szorzás a `idx * elem_size`
  értékhez, majd indexelve a `(ptr),Y` hozzáféréssel. A kettő hatványai (1, 2,
  4, 8, 16) elemméretek csupasz `ASL A` láncokat használnak; más méretek egy
  rövid eltolással és összeadással végrehajtott szekvenciát bocsátanak ki két
  üres nulla oldalas bájton keresztül.
- A struktúratípusok sub / fn paraméterei még nem támogatottak — ehelyett a
  tömböt és egy indexet kell átadni, pl. `sub move(idx: int) ... enemies[idx].x
  = ...`.
- Az alapértelmezett mezőértékeket (`var fire: int = 2` a típuson belül) a
  rendszer elemzi a javaslattal való kompatibilitás érdekében, de az elosztáskor
  még nem inicializálja.
- Csak egy alsó index engedélyezett egy struktúra típusú tömbön; a többdimenziós
  struktúra tömbök nem támogatottak (használjon számított lapos indexet).

Lásd: `examples/type_demo.ub`.

### 16 bites (szó) változók

```basic
var ptr: szó = 0400 USD # két ZP bájt: lo=00 USD hi=04 USD
poke ptr, 6 # STA (ptr),Y
var v = peek(ptr) # LDA (ptr),Y
```

**16 bites szorzatok (javítva az 1.5.7-es verzióban).** Egy `word` rendelt
szorzat mind a 16 bitet megtartja, akkor is, ha egyik tényező sem `word`:

```basic
változó pontszám: szó = 0
változó szint = 3
pontszám += 300 * szint # 900 (1.5.7 előtt ez 8 bitre volt csonkítva: 44)
pontszám = pontszám + 100 * szint
változó nagy: szó = 100 * szint + 900
```

Az 1.6.1 óta ez az összegeken belül is érvényes, valamint `shl` esetén, és 255
feletti konstans szorzók esetén: `py = cy * 8 + fy`, `py = (cy shl 3) + fy` és
`w = cy * 300` megtartják mind a 16 bitet (korábban az összegzési alakokat 8
bitre csonkították). A bájtcélok 8 bites eredményeket tartanak meg.

### Bittérképes grafika

```basic
grafika bekapcsolva # VIC-II bitkép módot használ (320×200, 1 bit/cella); bitkép ára $2000
grafika több # VIC-II többszínű bitkép mód (160×200, 2 bit/cella)
grafika kikapcsolva # vissza szöveges módba

gcls # bitkép törlése ($2000-$3FFF kitöltése) + videómátrix színeinek beállítása

x, y ábrázolása # képpont beállítása (x, y); x: 0-319, y: 0-199
x, y törlése # képpont törlése (ÉS ~maszk)
x vagy x, y ábrázolása # képpont ki-/bekapcsolása (EOR maszk) — villódzásmentes animáció
x, y, r kör # (x, y) középpontú, r sugárral rendelkező kör középpontja; képernyőn kívüli pontok levágása
x1, y1, x2, y2 vonal # Bresenham vonal (x1,y1) pontból (x2,y2) pontba; x: 0-319, y: 0-199
x1, y1, x2, y2 vonaltörlés # pixelek törlése a vonal mentén (ÉS ~maszk)
xor vonal x1, y1, x2, y2 # pixelek ki-/bekapcsolása a vonal mentén (EOR maszk)
x1, y1, x2, y2 # téglalap körvonal rajzolása (4 él); x: 0-319, y: 0-199
x1, y1, x2, y2 vonaltörlés # téglalap körvonal törlése (ÉS ~maszk)
xor vonal x1, y1, x2, y2 # XOR téglalap körvonal (EOR maszk)
x, y festése # 4-összefüggő kitöltés (x, y) pontból; kitölti a halmaz által határolt üres pixeleket

color pen c # beállítja a rajz színét (0-15); lásd alább

# ── Többszínű bitkép (grafika többszínű képen, 160×200) ──
mplot x, y, color # beállítja a többszínű pixelt (x: 0-159, y: 0-199, color: 0-3)
mline x1, y1, x2, y2, color # többszínű vonal
mrect x1, y1, x2, y2, color # többszínű téglalap körvonal
mcircle x, y, r, color # többszínű kör
```

Mindkét `graphics on` változat elsötétíti a kijelzőt (`LDA $D011 / AND #$EF /
STA $D011`) a VIC regiszterek váltása közben, majd újra engedélyezi azt a cél
módban – ezzel megelőzve a módváltási hibákat.

Az `x` lehet a teljes `0–319` tartomány. A 255 feletti koordinátákat a rendszer
automatikusan kezeli (a segítő hozzáadja a 9. X bitet), így a `plot`, `line`,
`circle` és `rect` mind eléri a képernyő jobb szélét. Használjon `word`
változót, ha az X koordináta meghaladhatja a 255-öt.

#### Felbérel rajzszínt — `color pen`

Hires módban (320×200) a szín **8×8-as cellánként** van megadva, a
videómátrixban tárolva (magas nibble = előtér, alacsony nibble = háttér), nem
pixelenként. A `color pen c` egy állandó előtérszínt (0-15) állít be, amelyet a
`plot`, `line`, `rect`, `circle` és `paint` minden kirajzolt pixel cellájába
rányom; a cella háttér-nibble színe megmarad. A következő `color pen`-ig marad
érvényben. Az alapértelmezett érték a fehér (1), így azok a programok, amelyek
soha nem hívják meg a `color pen` függvényt, pontosan úgy néznek ki, mint
korábban.

```basic
grafika bekapcsolva
gcls
színes toll 2 # piros
vonal 0, 0, 100, 100
színes toll 6 # kék
kör 160, 100, 40
kijelző bekapcsolva
```

#### Többszínű alakzatok — `mline` / `mrect` / `mcircle`

Többszínű módban (`graphics on multi`, 160×200) minden pixel négy színforrás
egyikét választja ki egy 2 bites értékkel (`%00` background `$D021`, `%01`
screen hi nibble, `%10` screen lo nibble, `%11` color RAM). A `mplot` egyetlen
ilyen pixelt állít be; a `mline`, `mrect` és `mcircle` ugyanúgy rajzolják az
alakzatokat – a záró `color` argumentum a 2 bites forrás (0-3), a tényleges
színek pedig a cellapalettából (képernyő / szín RAM) származnak, pontosan úgy,
mint a `mplot` esetében.

```basic
grafika többrétegű grafikákon
gcls
mcircle 80, 100, 40, 1
mrect 10, 10, 150, 190, 2
mline 0, 0, 159, 199, 3
megjelenítés bekapcsolva
```

A `mline`/`mrect`/`mcircle` ugyanazokat a Bresenham/középpont rutinokat
használják újra, mint a megfelelőik, minden pixelt `mplot`-on keresztül
ábrázolva; a képernyőn kívüli pontokat (x ≥ 160 vagy y ≥ 200) kihagyják.

### Duplán pufferelt bitkép (villódzásmentes)

```basic
grafika dupla # dupla pufferelésű hires bitkép (320×200)
gcls # törli a REJTETT hátsó puffert
0. sor, 0, 319, 199 # minden rajz (plot/line/circle/tégl/paint/gcls) a hátsó pufferbe kerül
flip # megjeleníti a rajzolt puffert; átirányítja a rajzot a másikra
grafika kikapcsolva # vissza szöveges módba (visszaállítja a 0. VIC bank-ot)
```

A `graphics on double` **két** teljes képkockát tart meg, és csak a kész
képkockákat mutatja, kiküszöbölve a villódzást XOR trükkök nélkül – minden
képkockát `gcls` megrajzolsz, majd `flip`.

| Puffer                    | Bitkép        | Videómátrix   | VIC bank | `$DD00` alacsony bitek |
| ------------------------- | ------------- | ------------- | -------- | ---------------------- |
| A (elöl, először látható) | `2000 dollár` | `0400 dollár` | 0. bank  | `%11`                  |
| B (hátul, először húzva)  | `6000 dollár` | `4400 dollár` | 1. bank  | `%10`                  |

* Minden pixelparancs egy futásidejű **draw base**-en (egy nulla oldalas bájton)
  keresztül ír, így automatikusan azt a puffert célozzák meg, amelyik éppen
  rejtve van.
* A `flip` megvárja az alsó határt (raszter ≥ 251), mielőtt átváltaná a VIC
  bankot, így a csere **szakadásmentes**, majd a rajzolási alapot a most rejtett
  pufferre állítja.
* Tipikus ciklus: `gcls` → keret megrajzolása → `flip`. A `display on` függvényt
  az első `flip` függvény után egyszer hívjuk meg, így az elsőként megjelenített
  puffer már teljes.

**Követelmények / korlátozások:**
* Csak felbérelhetők (nem `multi`). A sprite-ok nem a hátsó puffer VIC bankjából
  kerülnek lekérésre.
* A hátsó puffer `$4000–$7FFF`-t használ (mátrix `$4400`, bitkép `$6000–$7FFF`),
  így a program gépi kódjának `$4400` méret alatt kell maradnia. A legtöbb demó
  csak néhány KB-os, így ez automatikus; a nagyon nagy programok nem
  használhatnak dupla pufferelést.
* Egy gyári 1 MHz-es C64-en a képkockánkénti teljes `gcls` (8 KB) korlátozza a
  képkockasebességet; a Commodore 64 Ultimate-on ez `speed` értékre emelhető a
  gördülékeny, nagy képkockasebességű animáció érdekében.

Lásd: `examples/cube_demo.ub` — egy vibrálásmentesen renderelt, zuhanó 3D-s
drótvázas kocka.

### Blokkgrafikák (80×50)

```basic
grafika a blokkon # 80×50 blokk-pixel mód (szöveges mód + egyéni 4 pixeles karakterkészlet @ $2800)
grafika kikapcsolva # vissza szöveges módba
gcls # blokk játékmező törlése: képernyő RAM $0400-$07FF + színes RAM $D800-$DBFF

plot4 x, y # blokk pixel beállítása (x, y) ponton; x: 0-79, y: 0-49
plot4 x, y törlése # blokk pixel törlése (x, y) ponton
circle4 x, y, r # középponti kör rajzolása blokk pixelekben; 80×50-re vágás
```

Egy vaskos, alacsony felbontású mód rétegezve a szabványos 40×25-ös szövegre.
Egy 16 karakteres egyéni karakterkészlet, amelyet a `$2800` mappába másoltak,
karakterenként egy 2×2-es kvadráns rácsot kódol (3. bit=TL, 2. bit=TR, 1.
bit=BL, 0. bit=BR), így minden szövegcella 2×2 blokkpixelt tartalmaz → egy
effektív 80×50-es rácsot. Nem használ bitképes RAM-ot (`$2000-$3FFF` szabadon
marad), így gyorsabb, mint a bitképek bérlése. `plot4` VAGY beilleszti a
kvadráns bitet a cellába, így az átfedő pixelek felhalmozódnak; a `plot4 erase`
törli azt. A `circle4` ugyanazt a blokkpixel segítőt használja egy körvonal
rajzolásához a 80×50-es koordinátatérben. A `gcls` törli a képernyő- és a színes
RAM-ot is. Lásd: `examples/block_demo.ub`.

### Képernyő és szín

```basic
cls # képernyő törlése (KERNAL $E544)
cls fast # gyors kitöltés: képernyő RAM + szín RAM + HOME

színes szöveg 14 # szövegszín regiszter $0286
színes szegély 6 # $D020
színes háttér 0 # $D021
színes toll 2 # rajzszín (0-15) bérlése a diagramhoz/vonalhoz/téglalaphoz/körhöz/festéshez

képernyő 0, 0, 65 # 65. karakter ('A') írása a képernyő RAM-ba a 0. oszlopban, 0. sorba ($0400)
képernyő 10, 5, ch # 10. oszlop, 5. sor — az oszlop/sor változók lehetnek
képernyő 5, 3, 42, 7 # 42. karakter az 5. oszlopban, 3. sorba, 7. szín (a $D800 színRAM-ot is kiírja)
képernyő x, y, ch, col # mind a négy argumentum változóként

kijelzés bekapcsolva # VIC kijelző újraengedélyezése ($D011 DEN bit)
kijelzés kikapcsolva # üres kijelző

kisbetűs # CHR$(14) → VIC-II átváltása kisbetűs/nagybetűs karakterkészletre
nagybetűs # CHR$(142) → VIC-II visszaváltása nagybetűs/grafikus karakterkészletre

kurzor 20, 10 # kurzor mozgatása a 20. oszlopba, 10. sorba (KERNAL PLOT $FFF0)
kurzor x, y # oszlop az x változóból (0–39), sor az y-ból (0–24)

kiírás 20, 10-nél, "HELLO" # kurzor(20,10) + kiírás egy utasításban (nincs sortörés)
kiírás x, y-nál, "Pontszám:", pontszám # kifejezések bármilyen keveréke
kiírás 0, 0-nál # csak pozíció (nincs szöveg, nincs sortörés)

görgetés x 3 # vízszintes finomgörgetés beállítása: $D016 bitek 0-2 = 3 (0-7)
görgetés y 2 # függőleges finomgörgetés beállítása: $D011 0-2. bitek = 2 (0-7)
scroll x n # az érték lehet változó vagy kifejezés (a 0-2. bitekre maszkolva)
scroll x 7 narrow # finom görgetés beállítása és 38 oszlopos mód kikényszerítése (éloszlop elrejtése)
scroll x 0 wide # finom görgetés beállítása és 40 oszlopos mód visszaállítása
12. sor görgetése balra # képernyő RAM 12. sorának eltolása balra egy karakterrel
```

A `lowercase` futásidőben `LDA #$0E; JSR $FFD2` értéket bocsát ki. A `lowercase`
után fordított karakterlánc literálok kis- és nagybetűiket automatikusan
felcseréli a rendszer — a nagybetűs forráskarakterek a PETSCII kisbetűs
tárolóhelyen (`$61+`), a kisbetűs forráskarakterek pedig a nagybetűs
tárolóhelyen (`$41+`) tárolódnak —, így a `"Hello World"` forrás **Hello World**
formában jelenik meg a képernyőn. A `uppercase` `LDA #$8E; JSR $FFD2` értéket
bocsát ki, és visszatér közvetlen leképezésre. A `cls` **nem** állítja vissza a
karakterkészlet módot.

`scroll x n` `(n AND 7)` karaktereket a `$D016` karakterek 0-2. bitjeibe írja (a
3-7. bitek megőrzése mellett). `scroll x n narrow` a finom görgetési biteket
írja, és törli a `$D016` 3. bitet (38 oszlopos mód). `scroll x n wide` a finom
görgetési biteket írja, és beállítja a `$D016` 3. bitet (40 oszlopos mód).
`scroll y n` a `(n AND 7)` karaktereket a `$D011` karakterek 0-2. bitjeibe írja
(a 3-7. bitek megőrzése mellett). `scroll row R left` egy állandó képernyősort
balra tol el; az új jobb szélső karaktert a `screen 39, R, ch` karakterekkel
írja ki. Hasznos a sima hardveres görgetéshez: minden képkocka csökkentése 7-ről
0-ra, képernyő RAM eltolása, visszaállítás 7-re.

Az `screen col, row, char [, color]` közvetlenül a képernyő RAM-ba (`$0400 +
row*40 + col`) és opcionálisan a szín RAM-ba (`$D800 + row*40 + col`) ír.
Konstans oszlop/sor: a fordítási időben kiszámított cím.

### Ultimate 64 — CPU-sebesség

```basic
speed 4 # CPU beállítása 4 MHz-re ($D031 olvasása, 0-3 bitek frissítése, visszaírás)
speed 48 # 48 MHz (maximális sebesség U64-en)
speed max # ugyanaz, mint a speed 48 (alias)
speed off # vissza 1 MHz-re (alias a speed 1-hez)

badlines on # rossz vonal időzítésének engedélyezése ($D031 bit 7 = 0, alapértelmezett C64 viselkedés)
badlines off # rossz vonal időzítésének letiltása ($D031 bit 7 = 1, több CPU ciklus)

var t = turbo() # 1, ha a turbo aktív ($D031 0-3 bitjei != 0), 0, ha 1 MHz-en van
```

Elérhető MHz értékek: `1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 20, 24, 32, 40, 48`.
Az állandó értékeket lefelé kerekíti a rendszer a legközelebbi elérhető
sebességre fordítási időben. A változó értékeket nyers sebességindexként (0–15)
kezeli, és VAGY művelettel a `$D031` 0-3. bitjeire köti.

| $D031 index | MHz (U64) | MHz (U64 Elite-II) |
| ----------- | --------- | ------------------ |
| 0           | 1         | 1                  |
| 3           | 4         | 4                  |
| 6           | 8         | 10                 |
| 11          | 20        | 24                 |
| 15          | 48        | 64                 |

A funkcióhoz az **U64 Turbo Control** beállítást `U64 Turbo Registers` vagy
`Turbo Enable Bit` értékre kell állítani az U64 konfigurációs menüjében. Egy
hagyományos C64-en vagy emulátoron, amely nem tartalmazza a regisztert, a `poke`
és `$D031` közötti értékeket a rendszer csendben figyelmen kívül hagyja.

### Billentyűzet

```basic
var key = getch() # busy - várakozás a $FFE4-en, amíg a billentyű le nem nyomódik; PETSCII kódot ad vissza
var k = inkey() # nem blokkoló: PETSCII kódot ad vissza, vagy 0-t, ha nem nyomnak le billentyűt
waitkey # várakozás, amíg le nem nyomnak egy billentyűt (CIA1 mátrix letapogatás; IRQ alatt működik)
var k = waitkey() # ugyanaz, de nyers $DC01 oszlopbiteket ad vissza (0 bit = lenyomott billentyű)
var j = joy(2) # joystick 2. portjának beolvasása; invertált 0-4 biteket ad vissza
var j = joy(1) # joystick port 1 olvasása
# bit0=up(1) bit1=down(2) bit2=left(4) bit3=right(8) bit4=fire(16)
var mx = mouse_x() # 1351 egér: összesített X pozíció (segítő: charge+delay+delta)
var my = mouse_y() # 1351 egér: összesített Y pozíció (EOR #$FF invertált)
var mb = mouse_btn() # egérgombok: $DC01 olvasása — bit0=bal (tűz), bit1=jobb (fel pin)
```

A `mouse_x()` / `mouse_y()` belsőleg futtat egy segítő szubrutint, amely a
következőket kezeli: CIA1 `$DC00` kondenzátor töltése, ~516 ciklusos
késleltetés, SID POT X/Y regiszter olvasása (`$D419`/`$D41A`), előjeles 7 bites
delta számítás, Y tengely `EOR #$FF` inverzió és kumulált pozíciókövetés
(állandó ZP állapot, 8 bájt). A segítő képkockánként kétszer vesz mintát a
POT-ból. A `mouse_y()` **nem** hívja meg a segítőt (csak `mouse_x()` hívja meg)
— csak a gyorsítótárban tárolt `accum_y` adatokat olvassa be a dupla frissítés
elkerülése érdekében.

A segítő egy 9 bites X akkumulátort tart fenn (`accum_x` + `accum_x_hi`
carry/borrow használatával). Használj `var sx: word = mouse_x()` paramétert — a
fordító mind a lo, mind a hi bájtokat tárolja, így a `sprite` parancs helyesen
kezeli a `$D010` értékeket a 255-ön túli X pozíciók esetén.

A segítő a ZP-ben tárolja az állapotát (`$02`–`$09`). Az init jelzőnek nullának
kell lennie az első hívás előtt – nullázd a területet `fill $02, 7, 0` jelzéssel
a programod elején. A CIA1 megszakításokat (`poke $DC0D, $7F`) is tiltsd le,
hogy megakadályozd a KERNAL IRQ hozzáérését a `$DC00` jelzéshez a billentyűzet
letapogatása során – ami zavarná a POT leolvasását.

Lásd a `examples/mouse_demo.ub` oldalon egy működő 1351-es egér demót sprite
követéssel és gomb visszajelzéssel.

### Kijárat

```basic
bye # JSR $E544 (képernyő törlése), STOP jelző törlése, RTS BASIC-be
exit # alias a bye-hoz
```

### Időzítés

```basic
wait 50 # 50 raszteres vonalátmenet várakozása (~3,2 ms)
wait raster 100 # pörgetés, amíg $D012 == 100 (raszterfelosztási effektek)
delay 1 # 1 PAL képkocka várakozása (1/50 s ≈ 20 ms)
delay 20 # 20 képkocka várakozása ≈ 0,4 s; n változó lehet (0–255)
```

A `delay N` N teljes PAL képkockát számol meg, a 200-as rasztervonalat használva
képkockahatárként.

### SID hang

```basic
hang 0, $1CAD, 25 # 0. hang, frekvencia $1CAD (≈ középső C PAL), 25 képkocka időtartama
hang 1, frekvencia_szó, 50 # 1. hang, frekvencia a szóváltozóból, 50 képkocka (1 s 50 Hz-en)
hang 2, 0, 0 # 2. hang, csend

sid hangerő 15 # fő hangerő teljes ($D418 = $0F); tartomány 0-15
sid hangerő 0 # csend (fő hangerő = 0)
sid leállítás # mind a 25 SID regiszter nullázása ($D400–$D418) — teljes csend
```

`sound <channel>, <freq>, <duration>` — időtartam PAL képkockákban (egyenként
1/50 s). `sound` **blocks**: a program megvárja, amíg a hang véget ér (használd
az alábbi `sfx` funkciót egy játékcikluson belül). Javított ADSR: attack/decay
`$09`, sustain/release `$F0`, fűrészfog hullámforma. A Master hangerő `$D418`
mindig `$0F`-re van állítva.

*Javítva az 1.5.7-es verzióban:* a várakozási ciklus a 0. raszteres sort
figyelte, amely `$D012` (csak az alsó 8 bites) kétszer jelent meg képkockánként
(0. és 256. sor), így minden hang **fele** ideig tartott a kért ideig — és két
ágat foltoztak az opcode-jukon, ami a program 0-tól eltérő időtartamra történő
összeomlását okozta. A `sound` mostantól a 200-as raszteres soron várakozik
pontosan úgy, mint a `delay`.

Az `sid volume N` N-t ír az `$D418`-ba. A 0-3. bitek = hangerő (0-15), a 4-7.
bitek = szűrő mód. Az `sid stop` egy 10 bájtos nulla-kitöltő ciklust bocsát ki –
gyorsabban, mint 25 egyedi piszkálás.

### Nem blokkoló hangeffektek (`sfx`) — újdonság az 1.5.7-es verzióban

```basic
sound 0, $2000, 25 # BLOCKS: a program itt 25 képkockát vár
sfx 0, $2000, 25 # azonnal visszatér; a hang magától elhalkul
sfx 1, $0500, 8, 128 # opcionális wave: 16 triangle, 32 saw (alapértelmezett), 64 pulse, 128 noise
sfx 0, freq_word, 4, 16 # a freq lehet konstans, szóváltozó vagy 8 bites kifejezés
```

Az `sfx <channel>, <freq>, <frames> [, <wave>]` egy SID hangot programoz, és
azonnal visszatér, így biztonságosan használható egy játék cikluson belül. Nincs
kapu-kikapcsolási időzítő: a burkológörbe támadásra 0 / fenntartásra 0 /
kioldásra 0 van beállítva, és a **lecsengést** fordítási időben választják ki a
`frames` közül (1 képkocka = 20 ms, a legközelebbi SID lecsengési idő: 6, 24,
48, 72, 114, 168, 204, 240, 300, 750, 1500, 2400 ms ...), így a hang nagyjából
ennyi idő alatt elhalkul. Minden híváskor újraindítja a hangot (kapu ki, majd
be), és beállítja a fő hangerőt `$0F`. Az `channel` (0-2), az `frames` (1-255)
és az `wave` értékeknek fordítási idejű állandóknak kell lenniük.


### SID Zene

```basic
load sid "tune.sid" # SID zene beágyazása a natív betöltési címére
load sid "tune.sid", $2000 # felülbírálás: beágyazás $2000-re a SID fejléctől függetlenül
```

A `load sid` **fordítási időben** beolvassa a PSID vagy RSID fájlt, eltávolítja
a fejlécet, és hozzáfűzi a nyers zenei bájtokat a kimenethez. `.prg`. A `load
sid` után két fordítási idejű állandó válik elérhetővé:

| Állandó        | Leírás                                                                     |
| -------------- | -------------------------------------------------------------------------- |
| `oldal_kezdet` | Init rutin cím — egyszeri hívás A = dalszámmal (0-alapú)                   |
| `sid_play`     | Rutincím lejátszása — minden keret meghívása (50 Hz PAL) egy IRQ kezelőből |

Mindkét konstans bárhol működik, ahol konstans címet fogadnak el: `sys`, `irq`,
`poke`, kifejezések.

**Tipikus használat:**

```basic
sid "music.sid" betöltése

sub music_irq()
poke $D019, $FF # ACK VIC raszter IRQ
sys sid_play # zene egy képkockával előrébb ugrása
irq_exit # JMP $EA81: A/X/Y + RTI visszaállítása (megfelelő IRQ kilépés)
end

sys sid_init, 0 # SID chip inicializálása: A=0 → első alhangolás
irq music_irq, $C0 # raszter IRQ a $C0 soron → 50 Hz PAL-on

sid volume 15 # fő hangerő bekapcsolva
```

**Megjegyzések:**
- A SID adatok a generált kód **után** kerülnek elhelyezésre, nullákkal
  kiegészítve a betöltési címig. A fordító figyelmeztet, ha a SID betöltési címe
  átfedésben lenne a generált kóddal.
- A PSID v1 és v2 támogatott. Ha a SID fejléc betöltési címe 0, akkor az első
  két adatbájtot használja címként (PRG stílusú, little-endian).
- Programonként csak egy `load sid` értelmes (az utolsó nyer).

### Tracker dallamok (`tune`)

```basic
hangolás # opcionális: hangolás $C800-on (alapértelmezett $8000)
sebesség 6 # képkocka soronként (50 Hz PAL)
inst 0, $41, $09, $F0, $0800, $0064, $27, $1F
inst 1, $10, $08, $A8, $0400, $0000, $00, $0F
imod 0, 6, 3, 9, 40, $0200, $0E00 # vibrato + impulzusszélesség-moduláció (1.6.2)
ifilt 0, $0500, 20, 1 # levágási sweep $500-ig, oda-vissza (1.6.2)
igate 1, 2, 1, $09 # kapu időzítő, kemény újraindítás, első képkocka $09 (1.6.2)
itab 1, 2, 0, ".. +0", ".. +4", ".. +7" # arpeggio tábla (1.6.2)
sorrend 0, 1, 0 # pattern sorrend (a pattern-ek ismétlődhetnek)
pat 0, 0, "C-4 00", "...", "E-4 00 V24", "...", "G-4 00", "... .. C00"
pat 0, 1, "C-2 01", "...", "...", "...", "G-2 01 F03"
pat 1, 0, "G-4 00", "...", "E-4 00", "...", "C-4 00"
vége
zene lejátszás # vagy: sys sid_init / irq kezelő hívja a sys sid_play-t
```

Az `tune ... end` egy 3 hangú követő dallamot ír le egyszerű szövegben
(ugyanazzal a cellajelöléssel, mint amit a Visual Assembler SID szerkesztő
mutat), és fordítási időben felépíti a lejátszót ****. A `sid_init` / `sid_play`
paramétert pontosan úgy definiálja, mint a `load sid` paramétert, így a `music
play`, `music stop`, `music pause` és `music resume` (és egy manuális `irq`
kezelő, amely a `sys sid_play` függvényt hívja meg) változatlanul működik.

| Vonal                                                                                                   | Jelentés                                                                                                                                                                                                                                                                                                                                                                                         |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `sebesség N`                                                                                            | Keretek követő soronként (1-255).                                                                                                                                                                                                                                                                                                                                                                |
| `inst id, ctrl, ad, sr, pw, cutoff, resfilt, modevol`                                                   | Egy hangszer: vezérlőregiszter (hullámforma bitek plusz gyűrű mod `$04` / szinkron `$02`; a gate bitet a játékos adja hozzá), attack/decay, sustain/release, 12 bites impulzusszélesség, 11 bites szűrő levágás, rezonancia/szűrő-útválasztó bájt (`$D417` stílus: bármelyik útvonalválasztó bit = a hangszeren játszó hang útvonalát adja) és mód/hangerő bájt (`$D418` stílus, 7. bit = 3 KI). |
| `imod azonosító, vibrációs késleltetés, vibrációs sebesség, vibrációmélység, pwmspeed, pwmmin, pwmmax ` | (1.6.2) Hangszer vibrato: az `vibdelay` keretek után egy háromszög alakú LFO, amely minden `vibspeed` keretben (1-15, 0 = kikapcsolva) bekapcsol, mélység 0-15 (a hangjegy félhangjára skálázva). Impulzusszélesség-moduláció: keretenként hozzáadott `pwmspeed` (0 = kikapcsolva), `pwmmin` és `pwmmax` között ugrál.                                                                           |
| `ifilt azonosító, cutend, sweep, pingpong`                                                              | (1.6.2) Szűrő levágási sweep: az `inst` levágástól a `cutend` felé `sweep` (0-127) lépésekben képkockánként; `pingpong` 1 = oda-vissza.                                                                                                                                                                                                                                                          |
| `igate azonosító, kapuidőzítő, hardrestart, első hullám`                                                | (1.6.2) A kapu a következő hangjegy előtt `gatetimer` képkockával feloldódik (tartsa a `speed` alatt); a `hardrestart` 1 parancs az ADSR-t is 0-ra állítja. A hangjegy első képkockájára a `firstwave` (pl. `$09` = test + gate) kerül írásra.                                                                                                                                                   |
| `itab azonosító, sebesség, ciklus, "lépés", ...`                                                        | (1.6.2) Hullámforma / arpeggio táblázat, akár 32 lépésben: `"WW +n"`, `".. -n"` vagy `"WW =n"` - hullámforma hexadecimálisban (`..` megtartja) és egy hangjegy eltolás félhangokban vagy egy abszolút hangjegy (`=60`). Egy lépés minden `sebesség` képkockánként, majd vissza a `hurok` lépéshez (255 = marad az utolsó lépésen).                                                               |
| ` sorrend p, p, ...`                                                                                    | Minta sorrend. A vonalak felhalmozódnak, akár 255 lépésben.                                                                                                                                                                                                                                                                                                                                      |
| `pat p, v, "cella", ...`                                                                                | Legfeljebb 32 sor a `v` (0-2) hanghoz, amely a `p` (0-7) mintában található. A hiányzó sorok üresek.                                                                                                                                                                                                                                                                                             |

Egy **cell** a `NOTE INST FX`: `C-4`, `D#3`, `Eb2` vagy `...` ha nincs hang, egy
kétjegyű hex hangszer (`..` ha ki akarja hagyni), és egy opcionális effekt -
`Vxy` vibrato (x = sorok tartása, y = mélység), `Uxx` / `Dxx` csúsztatás fel /
le, `C` hangvágás, `Fxx` beállított sebesség. Egy csak hatást tartalmazó cella
felírható `"... .. F06"` vagy egyszerűen `"F06"` alakban.

Megjegyzések a lejátszóról:

- Minden játékosállapot a **blobon belül található ** (abszolút címzés) - nem
  használ nulla oldalt, így nem ütközik az UltimateBasic változókkal vagy
  ideiglenes értékekkel, és akkor is működik tovább, amikor a program visszatér
  BASIC-be.
- Minden képkockán (1.6.2) a lejátszó lefuttatja az egyes hangszínek
  hullámforma/arpeggio táblázatát, vibrato-ját, impulzusszélesség-modulációját
  és kapuidőzítőjét/hard újraindítását, valamint annak a hangszínnek a
  vágófrekvenciás sweepjét, amelyik utoljára indította el a szűrővel irányított
  hangszert (ez birtokolja a szűrő vágófrekvenciáját, rezonanciáját és módját;
  az `$D417` minden olyan hangszínt lefuttat, amelynek aktuális hangszere
  szűrővel irányított). Ez ugyanaz az algoritmus, mint a Visual Assembler SID
  szerkesztő exportált lejátszójában és előnézetében, képkockánként.
- A blob egy fix címen található (alapértelmezett: `$8000`, vagy `tune a $addr`
  címen), és az `.prg` fájlt ehhez igazítják, például: `load sid`. Tartsd távol
  a kódodtól, tömböktől (`$C000+`) és bármilyen bitképes/karakterkészletes
  memóriától. Egy blobnak körülbelül 2,5 KB-ra van szüksége, plusz soronként és
  oszloponként 12 bájtra.
- Legfeljebb 8 minta (egyenként 32 sor); a rendezési lista szabadon ismételheti
  őket.
- Az `music play` a CIA1 időzítőt használja 50 Hz-en; ne kombináld másik `load
  sid`/`tune` (az utolsó nyer).

### Zenelejátszás

Az `music play/stop/pause/resume` egy magas szintű alternatívája a manuális `sys
sid_init` / `cia_timer` beállításnak. Előzetes `load sid` utasítást vagy `tune
... end` blokkot igényel (mindkettő a `sid_init` / `sid_play` függvényt
definiálja).

```basic
"tune.sid" sid betöltése # SID fájl beágyazása (sid_init / sid_play definiálása)

zenelejátszás # 0. alhangolás inicializálása + CIA1 50 Hz IRQ indítása
zenelejátszás 1 # indítás az 1. alhangolásról (0. szám alapján)
zenelejátszás leállítása # lejátszás leállítása + mind a 25 SID regiszter nullázása ($D400-$D418)
zenelejátszás szüneteltetése # CIA1 A időzítő IRQ letiltása (a zene lefagy, a SID változatlan)
zenelejátszás folytatása # CIA1 A időzítő IRQ újraengedélyezése (a szüneteltetési ponttól folytatódik)
```

| Nyilatkozat           | Hatás                                                                                                             |
| --------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `zene lejátszása [n]` | hívja a `sid_init(n)` kódot, állítsa be a CIA1 időzítőt A 19 656 ciklusra (~50 Hz PAL), telepítse az IRQ burkolót |
| `zene leáll`          | CIA1 IRQ letiltása + mind a 25 SID regiszter nullázása                                                            |
| `zene szünet`         | CIA1 IRQ letiltása (a SID kimenet lefagyva marad)                                                                 |
| `zenei önéletrajz`    | CIA1 IRQ újraengedélyezése (a szüneteltetési ponttól folytatva)                                                   |

Az IRQ burkoló (a program végén egyszer kibocsátott) a következőket teszi: ACK
CIA1 időzítő A → `JSR sid_play` → `JMP $EA81`.

### Sprite-ok

```basic
sprite 0, x, y, $2000 # sprite 0: X, Y pozíció és adatmutató beállítása
sprite 0, x, y # adatmutató nélkül (megtartja a meglévőt)
sprite bekapcsolva 0 # sprite 0 engedélyezése ($D015 |= bit0)
sprite kikapcsolva 0 # sprite 0 letiltása ($D015 &amp;= ~bit0)
sprite színe 0, 7 # sprite 0 szín = sárga ($D027)
sprite többszínű 0, bekapcsolva # többszínű mód engedélyezése a sprite 0-hoz ($D01C |= bit0)
sprite többszínű 0, kikapcsolva # többszínű mód letiltása ($D01C &amp;= ~bit0)
sprite kiterjesztés x 0, bekapcsolva # dupla szélesség ($D01D |= bit0)
sprite kiterjesztés x 0, kikapcsolva # normál szélesség ($D01D &amp;= ~bit0)
sprite kiterjesztés y 0, bekapcsolva # dupla magasság ($D017 |= bit0)
sprite kiterjesztés y 0, ki # normál magasság ($D017 &amp;= ~bit0)
sprite prioritás 0, bekapcsolva # háttér mögött ($D01B |= bit0)
sprite prioritás 0, kikapcsolva # háttér előtt ($D01B &amp;= ~bit0)
var h = sprite_hit() # sprite-sprite ütközés ($D01E, olvasáskor törlődik)
var b = sprite_bg_hit() # sprite-háttér ütközés ($D01F, olvasáskor törlődik)
var x = sprite_x(0) # sprite 0 X pozíció beolvasása (lo byte, $D000)
var y = sprite_y(0) # sprite 0 Y pozíció beolvasása ($D001)
sprite_frame 0, $2000 # egy statikus sprite kép kiválasztása
sprite_frame 0, $2000, frame # egy animációs képkocka kiválasztása egy képkockasorozatból
```

Az X a teljes 9 bites tartományt támogatja (0–319): a 255-nél nagyobb futásidejű
értékekhez `word` változót kell használni. Sprite adatmutató: a `data_addr`-nak
64 bájtos igazítottnak kell lennie; `addr >> 6` néven tárolva a `$07F8+id`
címen.

#### Sprite animáció `sprite_frame`-szel

A `sprite_frame` parancs segítségével módosíthatjuk egy sprite megjelenített
képét animáció közben. Ez csak a sprite adatmutatóját változtatja meg; **nem**
mozgatja a sprite-ot, nem engedélyezi azt, és nem lépteti automatikusan a
képkockákat.

Tárold az animációs képeket egymás után, minden 63 bájtos sprite kép egy 64
bájtosra igazított helyet foglaljon el. Add át a nulla alapú animációs képkockát
harmadik argumentumként:

```basic
sprite_frame sprite_azonosító, első_képkocka_címe, képkocka_száma
```

Például, ha az alapcím `$2000`, akkor a 0. képkocka `$2000`, az 1. képkocka
`$2040`, a 2. képkocka `$2080` címet használ, és így tovább. A program vezérli
az animáció időzítését és tördelését:

```basic
var frame = 0
ciklus
sprite_frame 0, $2000, frame frame = frame + 1
ha frame == 4, akkor frame = 0 end delay 5
end
```

A kétargumentumos űrlap, `sprite_frame id, address`, egyszerűen kiválaszt egy
statikus sprite képet, és visszafelé kompatibilis marad. A sprite pozícióját
továbbra is a `sprite id,x,y` vezérli.

### Szoftveres határolókeret-ütközés

```basic
var touching = box_hit(bal1, felső1, jobb1, alsó1, bal2, felső2, jobb2, alsó2)
```

A `box_hit()` tengelyhez igazított határolókeret (AABB) tesztet hajt végre, és
`1` értéket ad vissza, ha a két téglalap átfedésben van vagy érinti egymást,
egyébként `0`. A `sprite_hit()` és `sprite_bg_hit()` értékekkel ellentétben ez
nem olvassa vagy törli a VIC-II ütközési regisztereket. A nyolc argumentum
tetszőleges 8 bites kifejezés, így a dobozok kisebbek lehetnek, mint a látható
sprite grafika, vagy nem sprite játékobjektumokat írhatnak le. A koordináták
inkluzívak; a `left <= right` és a `top <= bottom` értékeket tartsa meg.

### Sprite definíció

```basic
sprdef 0
  $00,$3C,$00, $00,$FF,$00, $03,$FF,$C0, $07,$FF,$E0,
  $0F,$FF,$F0, $0F,$FF,$F0, $1F,$FF,$F8, $1F,$FF,$F8,
  $1F,$FF,$F8, $0F,$FF,$F0, $0F,$FF,$F0, $07,$FF,$E0,
  $03,$FF,$C0, $00,$FF,$00, $00,$3C,$00, $00,$00,$00,
  $00,$00,$00, $00,$00,$00, $00,$00,$00, $00,$00,$00,
$00,$00,$00
vége
```

A `sprdef id ... end` 63 sprite bájtot ágyaz be a kódszegmens következő 64
bájtos igazított címére, egy `JMP` címkét helyez föléjük, és automatikusan
beállítja a `$07F8+id = data_addr >> 6` értéket. Ha ugyanazt az alakzatot több
sprite-hoz szeretné használni, olvassa vissza a mutatót:

```basic
var pg = peek($07F8) # a sprdef által beállított mutató 0
poke $07F9, pg # másolás az 1–7. sprite-okba
```

### Karakterlap-térképek (`.ubmap`)

```basic
map load "levels/world.ubmap"
map load "level.bin", $4000 # Pályaszerkesztő projekt, adatok $4000-on (1.6.1)
map draw map_x, map_y # 40x25-ös nézetablak rajzolása a képernyő/színes RAM-ba
map view px, py # sima dupla pufferelt nézet pixel px-nél, py (1.6.1)

var tile = map_tile(x, y) # karakterkód beolvasása a térképről
map set x, y, 42 # karakterkód módosítása írható térképadatokban

var shade = map_color(x, y) # cellaszín beolvasása (0, ha a térképnek nincs színadata)
map color x, y, 7 # cellaszín módosítása, ha van színadat
```

A `map load` függvény a fájlnevet a `.ub` forrásfájlhoz képest oldja fel,
fordítási időben érvényesíti, majd beágyazza a karakter- és opcionális
színtömböket az írható program RAM-ba. Egy későbbi `map load` függvény lecseréli
az aktív map-et a későbbi map parancsokhoz.

A `map load` közvetlenül is elfogad VisualAssembler `me-map` `.bin` exportot:

```basic
térkép betöltése "map-multicolor.bin"
```

Az első 1000 bájtból lesz a 40×25-ös karaktertérkép, a következő 1000 bájt pedig
a cellaszínek. A többszínű mód és a `$D021-$D023` a VisualAssembler
metaadat-előzeteséből olvasható ki, így nincs szükség `.ubmap` konverzióra.

**Pályaszerkesztő projektek (újdonság az 1.6.1-es verzióban).** `térkép
betöltése` beolvassa a VisualAssembler Pályaszerkesztő projektet (`Level mentése
(.bin)`) és a képernyőit egyetlen térképpé állítja össze: egy Sz×M képernyőkből
álló szint egy (Sz·40)×(M·25) térképpé válik színekkel, az üres helyek pedig
szóközök. A térképek mérete 255×255 cellára korlátozódik, így egy szint
legfeljebb 6 képernyő széles és 10 magas lehet.

```basic
térkép betöltés "level.bin" # 2x5 képernyő -&gt; egy 80x125-ös térkép
```

**A térképadatok elhelyezése (újdonság az 1.6.1-es verzióban).** A `map load
"file", addr` függvény a térképet fix címen tárolja a kódban lévő helyett,
például az `incbin "file", addr` címen (a címnek a generált kód felett vagy egy
`org` résen belül kell lennie). A karakterek először jönnek, a színek pedig
utánuk:

```basic
térkép betöltés "level.bin", $4000 # 80x125 térkép: karakterek $4000-$6713, színek $6714-$8E1F
```

#### Sima görgetés — `térkép nézet` (új az 1.6.1-es verzióban)

```basic
map load "level.bin", $4000
var px: word = 0
var py: word = 0
loop
map view px, py # képkockánként egyszer, a `wait raster` helyett
# joystick olvasása, px / py módosítása, játéklogika ...
end
```

Az `térkép nézet x, y` a térképet az `x, y` pixelpozícióban mutatja
(szókifejezések; `0..(szélesség-40)*8` és `0..(magasság-25)*8`, a tartományon
kívüli értékek rögzítve vannak). Képkockánként egyszer hívódik meg: megvárja a
képkockahatárt (250. rasztervonal), megjeleníti az előző hívás által megadott
pozíciót, majd átveszi az újat, így a pozíció egy képkockával később jelenik
meg.

Hogyan működik: a finom rész az XSCROLL / YSCROLL metódust használja a `$D016` /
`$D011` mappában 38 oszloppal és 24 sorral (a begörgetett él rejtve marad); a
karakter lépések két képernyőpuffert cserélnek, `$0400` és `$3C00`. A pozíciót
két képkockával előre jósolják meg, és a rejtett puffer a következő karakter
cellához két részben épül fel, mielőtt a nézet odaérne, így a csere soha nem
vár. A színes RAM nem pufferelhető duplán: a felső felét a rasztersugár mögötti
utolsó régi képkockába, az alsó felét pedig közvetlenül az előtte lévő csere
után másolja (mindkettőt néhány rasztervonalra maszkolt megszakításokkal), így
semmi sem szakad el. Egy karakter lépésnél közvetlenül egy irányváltás egy vagy
két képkockáig visszatarthatja a nézetet, amíg a puffer újjáépül.

Szabályok:

- A programkódnak és az inline adatoknak a `$3C00-$3FFF` (második puffer)
  tartományon kívül kell maradniuk; a nagy térképeket címmel kell betölteni
  (`map load "file", $4000`), különben a fordítás hibával leáll.
- Az első `térképnézet` a teljes nézetet kirajzolja az `$0400`-be. Ezután a
  képernyő a `térképnézethez` tartozik: `print` / `screen` / `cls` csak a
  `$0400` fájlokat írja ki, és felülírja őket.
- A sprite-ok a szokásos módon működnek: az `map view` minden képkockán
  átmásolja a `$07F8-$07FF` sprite-mutatókat az `$3FF8-$3FFF`-re, így az
  `sprdef` / `sprite_frame` mindkét pufferben megjelenik. A sprite adatokat a
  VIC 0. bankban kell tartani (`$0000-$3FFF`, nem pedig az `$1000-$1FFF`), pl.
  az `sprdef` beállítással egy nagy beágyazott `map load` elé.
- Az `$D018` karakterkészlet bitjei megmaradnak (az ` karakterkészlet az `-en
  működik); az `$D016` többszínű bitje megmarad, ahogy a `map load` beállította.
- Hagyj körülbelül 6000 ciklust (~95 raszteres sort) a játék logikájából
  képkockánként; egy hosszabb képkocka megtartja a nézetet egy képkockáig, de
  soha nem szakad el.
- Példa: `examples/level_scroll_demo.ub` (joystick-kal vezérelt, játékos
  sprite-tal).

A `map draw map_x, map_y` egy 40×25-ös nézetablakot másol a megadott
térképcellától kezdve a képernyő RAM-ba `$0400`, és ha van ilyen, a színes
RAM-ba `$D800`. A térképnek tartalmaznia kell a teljes kért nézetablakot: tartsa
meg a `map_x <= width-40` és a `map_y <= height-25` értékeket. A koordináták és
a méretek jelenleg 8 bitesek (0–255).

A normál karaktertérképek törlik a szöveg többszínű bitjét a `$D016` zónában. A
többszínű térképek beállítják ezt, és betöltik a három globális színüket a
`$D021`, `$D022` és `$D023` zónákba. A karaktertérképek karakterkódokat
tartalmaznak, nem karakterkészlet pixeleket; kombinálhatók `charset`/`chardef`
vagy más karakterkészlet-betöltési módszerrel. Többszínű szöveg módban a 8–15.
cellaszínek a VIC-II szabályok szerint választják ki a többszínű karaktereket.

#### UBMP 1. verziójú bináris formátum

Minden többbájtos egész szám kis-endiánus:

|   Eltolás |                Méret | Jelentés                                                        |
| --------: | -------------------: | --------------------------------------------------------------- |
|         0 |                    4 | ASCII varázslat `UBMP`                                          |
|         4 |                    1 | Verzió, jelenleg `1`                                            |
|         5 |                    1 | Jelzők: 0. bit = színmező jelen, 1. bit = többszínű szövegmód   |
|         6 |                    2 | Térkép szélessége, 1–255 cella                                  |
|         8 |                    2 | Térkép magassága, 1–255 cella                                   |
|        10 |                    1 | 0. háttér (`$D021`), alacsony rágcsálnivalót használtak         |
|        11 |                    1 | Többszínű 1 (`$D022`), kevés rágcsálnivalót használt            |
|        12 |                    1 | Többszínű 2 (`$D023`), alacsony rágcsálnivalóval                |
|        13 | szélesség × magasság | Sor-fő karakterkódok                                            |
| következő | szélesség × magasság | Opcionális sor-fő szín nibbles, ha a 0. jelzőbit be van állítva |

Egy UBMP fájlnak pontosan a fejlécében megadott hosszúsággal kell rendelkeznie.
Az érvénytelen mágikus érték, verzió, dimenzió vagy hossz fordítási idejű hibát
okoz.

### Koala Painter képimportálás

```basic
koala betöltés "pictures/title.kla" # érvényesítés és beágyazás fordítási időben
koala show # bitképes többszínű módba lépés
koala hide # visszaállítás az alapértelmezett szövegmegjelenítésre
```

A `koala load` elfogad egy szabványos 10003 bájtos Koala fájlt (`$6000`
betöltési cím plusz 10001 adatbájt), vagy egy nyers 10001 bájtos hasznos adatot.
Az elérési utak a `.ub` fájlhoz képest relatívak. A hasznos adat 8000 bitkép
bájtot, 1000 képernyőbájtot, 1000 színrészletet és egy háttérszín bájtot
tartalmaz.

A fordító a `$6000-$8710` címen tárolja. A `koala show` a bitképet a `$2000`
címre, a képernyőmátrixot a `$0400` címre, a színeket a `$D800` címre másolja,
és engedélyezi a bitkép többszínű módot. A `koala hide` törli a bitkép/többszínű
módot, és visszaállítja az alapértelmezett szövegelrendezést.

A generált kódnak és a segítőknek `$2000` alatt kell befejeződniük, mert a
megjelenített bitkép felülírja a `$2000-$3F3F` értéket; ellenkező esetben a
fordító hibát jelez. A Koala importálás jelenleg nem kombinálható a `load sid`
értékkel ugyanabban a programban.

### Kód elrendezése: `org` — újdonság az 1.5.7-es verzióban

```basic
sub a() ... end # a rész/fn-ek egymás után kerülnek elhelyezésre a törzs végétől számítva
org $4000 # a következő rész/fn-ek $4000-nél folytatódnak; $xxxx-$3FFF nullával kitöltve marad
sub b() ... end
incbin "font.bin", $3800 # az adatok elhelyezkedhetnek a résben ($3800-$3FFF egy teljes VIC karakterkészlet slot)
```

Az `org addr` függvény az **alprogram/fn definíciók között helyezkedik el** (a
törzsben figyelmen kívül hagyjuk, és csak a második menetben lép életbe). Az
alprogramok soha nem esnek egymásba, így a kihagyott bájtok csak nullákkal
vannak kitöltve és lefoglalva: egy teljes egészében a résen belül fekvő `incbin
"f", addr` karakterkészlet beleíródik, és az `charset on`-en nem számolja a rést
kódként. A nulla bájtok a `.prg` részét képezik. Az aktuális kód vége alatti
`org` függvény fordítási idejű hiba. Minden, ami az utolsó alprogram után
generálódik (segítők, `data` táblák), az utolsó alprogramot követi, azaz a rés
fölé kerül.

### Egyéni karakterkészlet (`charset on` / `charset off` újdonság az 1.5.7-es verzióban)

```basic
charset $3800 # a chardef alapcímének beállítása (alapértelmezett $3800)

chardef 65 # a 65-ös karakter ('A') újradefiniálása
$18,$3C,$66,$7E,$66,$66,$66,$00
end

chardef 66 # kevesebb, mint 8 bájt nullával van kiegészítve
$7C,$66,$7C,$66,$7C
end
```

Az `charset base` beállítja az összes további `chardef` utasítás által használt
célcímet. Az `chardef id ... end` beágyaz 8 bájtot a kódszegmensbe (ezt egy
`JMP` előzi meg az átugrásukhoz), majd futásidőben átmásolja őket a
`charset_base + id*8` helyre. Az értékeknek fordítási idejű állandóknak kell
lenniük, `$xx` vagy decimális formában. A **`%` bináris literálokat a lexer nem
támogatja** (a kézikönyv ezt írta az 1.5.7 előtt - ez tévedett).

Az `charset addr` csak az `chardef` célállomást állítja be; nem bocsát ki kódot.
Ahhoz, hogy a VIC-II ezt a készletet használja, kapcsolja be (és kapcsolja ki,
ha végzett):
```basic
karakterkészlet $3800
chardef 1 $FF,$81,$81,$81,$81,$81,$81,$FF vége # mező kerete
karakterkészlet bekapcsolva # A VIC-II karaktereket olvas $3800-ból (a képernyőmátrix érintetlen)
...
karakterkészlet kikapcsolva # Vissza a ROM készlethez ($1800, ha a `kisbetűs` aktív, egyébként $1000)
```

`charset on` olvasási-módosítási-írási műveletén keresztül `$D018` bitek 1-3-át
végzi az utolsó `charset addr` címétől (alapértelmezett: `$3800`); a
képernyőmátrix bitjei megmaradnak. A címnek a VIC 0. bankján belüli `$800`
többszörösének kell lennie (`$0000-$3FFF`), különben fordítási idejű hiba
keletkezik. Mindkét utasítás az utoljára fordított `charset addr` címet
használja, ezért a direktívát a fő programtörzsben kell tartani (az
alprogramtörzsek ezután fordulnak le). Az ezzel egyenértékű nyers írási művelet:
`poke $D018, $1A` a `$2800` értékhez, vagy `poke $D018, $1E` a `$3800` értékhez.

Az **Átfedés ellenőrzése.** Az `charset on`-en a teljes 2 KB-os készletet
igényli, és minden `chardef` a saját 8 bájtját foglalja. Ha a generált kód eléri
ezt a területet, a build leáll, amikor `the program code ($080D-$xxxx) overlaps
the charset area $2800-$2FFF; move the charset ...`. A nagy programoknak ezért
szükségük van a kód feletti készletre (`charset $3800`) — vagy használd az
`org`-et (fent), hogy a kód a készlet felett folytassa. Az `org` résbe helyezett
adatokat (`incbin ..., addr`) nem számítjuk kódnak.

### Memória

```basic
poke $D020, 2 # STA $D020
poke addr_var, 6 # STA (addr_var),Y — ha az addr_var szótípus
var v = peek($D012) # LDA $D012
var v = peek(addr_var) # LDA (addr_var),Y — ha az addr_var szótípus

var w: word = peek16($C000) # 16 bites little-endian olvasása: lo=$C000, hi=$C001
poke16 $0314, $EA81 # 16 bites little-endian írása: lo→$0314, hi→$0315
poke16 ptr, w # a word var címként van megadva; szó változó értékként

var k = 2
var p = peek($07F8 + k) # LDA $07F8,Y — konstans + bájtváltozó
poke $07F8 + k, p # STA $07F8,Y
poke ptr + k, 1 # szó + bájt: teljes 16 bites cím
```

A `peek16(addr)` két egymást követő bájtot (lo, hi) `word`-ként olvas be. A
`poke16` először a "lo", majd a "hi" karaktereket írja.

Egy cím mindig egy 16 bites érték. Az 1.6.5-ös verzió óta egy olyan
címkifejezés, mint az `$07F8 + k`, megtartja a konstans felső bájtját és az
átvitelt (korábban 8 bitben számították ki, és a `peek($07F8 + k)` a
következőképpen olvasta be: `$00F8 + k`). Ez igaz a `peek`, `poke`, `peek16`,
`poke16`, `fill`, `memcopy`, `drawmem`, `save` és `reu` sorokra; a `fill` /
`memcopy` hosszúságok, mint például a `40 * rows` szintén 16 bitesek. A
bájtváltozóval rendelkező `peek(k)` parancs beolvassa az `$00kk` címet (az 1.6.5
előtti verziók előtt maga az `k` cím értékét adta vissza).

### Lemez I/O

```basic
load "PROGRAM" # KERNAL LOAD: betölti a fájlt a 8-as eszközről a natív címére
load "DATA", $C000 # betölti a fájlt egy adott címre
chain "GAME" # betölt egy másik programot erre a programra és FUTATJA (lásd alább)
load "DATA", ptr # cím a word változóból

save "DATA", $C000, 4096 # KERNAL SAVE from $C000, 4096 bytes → device 8
save "PROG", start, len # cím és len a word/int változókból
```

A `load` függvény meghívja a KERNAL `SETNAM`+`SETLFS`+`LOAD`
(`$FFBD`/`$FFBA`/`$FFD5`) függvényt. Cím nélkül: másodlagos cím 1 (a fájl saját
2 bájtos fejléce a betöltési cím). Címmel: másodlagos cím 0 (a fájl a megadott
címre töltődik be, a fejléce kimarad). (Javítva az 1.5.9-es verzióban — korábban
a kettő felcserélődött: `load "F"` betöltése a következőbe: `$0000`.) A `save`
meghívja a `SETNAM`+`SETLFS`+`SAVE` (`$FFBD`/`$FFBA`/`$FFD8`) metódust.
Szükséges mind az `addr`, mind a `len` metódus.

#### Láncolás egy másik programhoz — `lánc` (újdonság az 1.5.9-es verzióban)

```basic
chain "GAME" # betöltjük a GAME-et arról a meghajtóról, amelyről elindítottuk, és FUTJUK
chain "GAME", 9 # a 9-es meghajtóról (bármilyen kifejezés)
print "BETÖLTÉSI HIBA" # csak akkor érhető el, ha a fájlt nem sikerült betölteni
```

Az `chain` parancs betölt egy másik programot a saját betöltési címére —
általában `$0801`, közvetlenül a futó program fölé —, és pontosan úgy indítja
el, mintha a `LOAD"GAME",8,1` és az `RUN` parancsokat beírtuk volna. Erre van
szüksége egy boot / title programnak. Egy sima `load` nem tudja ezt megtenni: a
betöltött fájl felülírná a `load` parancsot végrehajtó kódot.

Hogyan működik:

- Egy 46 bájtos, pozíciófüggetlen betöltő plusz a fájlnév másolásra kerül a
  kazettapufferbe (`$033C`), amelyet sem egy Ultimate Basic program, sem egy
  Exomizerrel csomagolt fájl nem tölt be.
- Előtte a gép visszakerül tiszta állapotba: VIC IRQ-k kikapcsolva, SID hangerő
  0, `IOINIT` (`$FDA3`: CIA időzítők, billentyűzet IRQ, soros busz), `RESTOR`
  (`$FF8A`: alapértelmezett IRQ/BRK/NMI és I/O vektorok), `$01 = $37`. Az egyéni
  raszteres IRQ-k, a `zenelejátszás` és az `nmi` kezelők leállnak. A képernyő, a
  színek és a `$DD00` regiszteren kívüli VIC bankregiszterek változatlanok
  maradnak, így a kép a képernyőn maradhat, amíg a következő program be nem
  töltődik (az `IOINIT` a 0. VIC bankot választja ki).
- A betöltő meghívja az `SETNAM` / `SETLFS` (másodlagos 1) / `LOAD` függvényt.
  Eszköz argumentum nélkül azt a meghajtót használja, ahonnan a program
  betöltésre került (`$BA`), vagyis a 8-as meghajtót.
- Sikeres betöltés után beállítja a program vége mutatót (`$2D/$2E`),
  újrainicializálja a BASIC-et (`$E453`, `$E3BF` — egy önkicsomagoló feldolgozó
  program, mint például az Exomizer `sfx`, esetleg a BASIC nulla oldalát
  használta), és FUTATJA a programot (`$A659`, `$A7AE`). Működik Ultimate Basic
  programoknál, feldolgozó (`exomizer sfx sys`) fájloknál és hagyományos BASIC
  programoknál egyaránt.
- Ha a fájl nem tölthető be (nem található, nincs meghajtó), akkor az `chain`
  értéket adja vissza, és a program a következő utasítással folytatódik.

A fájlnévnek 1–16 karakter hosszúságú karakterláncnak kell lennie.

### Soros csatorna fájl I/O

```basic
open 1, 8, 2, "MYFILE" # logikai fájl megnyitása 1, eszköz 8, másodlagos 2, név "MYFILE"
open 2, 4, 7 # nyomtató megnyitása (eszköz 4), nincs fájlnév
open ch, dev, sec # csatorna, eszköz, másodlagos változókból

print# 1, "HELLO" # "HELLO"+CR küldése az 1. logikai fájlnak
print# ch, x, "text" # változók és karakterláncok bármilyen keveréke — ugyanaz, mint a print, de fájlba küldés

close 1 # logikai fájl bezárása 1
close ch # csatorna változóból
```

A `open` meghívja a `SETNAM` ($FFBD) + `SETLFS` ($FFBA) + `OPEN` ($FFC0)
függvényt. Fájlnév nélkül a SETNAM 0 hosszúsággal kerül meghívásra. A `print#`
kimenete a `CHKOUT` ($FFC9), karakterenként CHROUT (+ záró CR), majd a `CLRCHN`
($FFCC) parancson keresztül kerül továbbításra. A `close` beilleszti a
csatornaszámot az A-ba és meghívja a `CLOSE` ($FFC3) függvényt.

### Bemenet

```basic
input score # maximum 3 számjegy beolvasása a billentyűzetről → 8 bites int var
input "Név: ", név # opcionális prompt karakterlánc, majd sor beolvasása → string var
input "Pontszám: ", score # prompt + int input
```

Az `input` KERNAL BASIN-t (`$FFCF`) használja a blokkoláshoz, visszhangos
vonalbemenetet biztosít DEL támogatással.
- **Int var**: csak `0`–`9` értékeket fogad el, maximum 3 karaktert; CR esetén 8
  bites értékké konvertál.
- **Karakterlánc-változó**: maximum 30 karaktert fogad el; nullával lezárt
  karakterláncként tárolódik; a ZP pár frissül.
- **FLOAT változó** (1.6.3): számjegyek és `.`, pl. `12,5` → 12,50 (két
  tizedesjegy).
- **EGYSZERES / KETTŐS változó** (1.6.4): tetszőleges szám, `-12,5`, `.5`,
  `3,25E2`.
- **Tömbelem** (1.6.3): `input t(i)` / `input nevek(i)`; `input "prompt"; x` is
  működik.
- **Karakterlánc var**: maximum 30 karaktert fogad el; nullával lezárt
  karakterláncként tárolódik; a ZP pár frissül.

### Úszópont / Fixpont

Az `float` változók Q8.8 fixpontos formátumot használnak: a felső bájt az egész
rész (0–255), az alsó bájt pedig a tört rész (0/256 … 255/256).

```basic
var f: float = 3.5 # 3.5 → hi=3, lo=128 (= 0x0380)
var g: float = 0 # a 0 egész szám automatikusan 0.0-ra lép elő

f = 1.5 # Q8.8 literál értékadás
f = f + 1.5 # 16 bites Q8.8 aritmetikai művelet (eredmény: 3.0)
f = f + g # float + float

var n = int(f) # egész rész kinyerése (hi byte) → 8 bites int
print f # "N.DD" formátumban nyomtat (pl. 3.5 → "3.50", 1.25 → "1.25")
```

| Művelet                | Példa                | Megjegyzések                                    |
| ---------------------- | -------------------- | ----------------------------------------------- |
| Szó szerinti           | `3,5`, `0,25`, `1,0` | fordítási időben Q8.8-ként értelmezve           |
| Egész szám előléptetés | [X₀X]f = 5[X₀X]      | 5.0-ás üzletek (magas=5, alacsony=0)            |
| Hozzáadás/felirat      | `f + 1,5`, `f - g`   | 16 bites Q8.8 aritmetikai                       |
| Int kinyerése          | `int(f)`             | a hi byte-ot 8 bites egész számként adja vissza |
| Nyomtatás              | `f nyomtatása`       | "N.DD" formátum, mindig 2 tört számjegy         |

**Figyelmeztetés:** A számtani túlcsordulás 255,255-nél tördelődik (nincs
telítés). Két lebegőpontos változó szorzása és osztása még nem támogatott –
ezekben az esetekben a `int()` + egész aritmetikai műveletet kell használni.

**Lebegőpontos kifejezések nyomtatása (javítva az 1.5.7-es verzióban).** Egy
`float`-et tartalmazó aritmetikai kifejezés `print` parancsa (például `print a /
10` ahol `a: float = 1`) mostantól `N.DD` formátumban nyomtatja ki a Q8.8
eredményt. Az 1.5.7 előtt a nyers 16 bites értéket egész számként nyomtatta ki
(`25` a `0.09` helyett). A tört csonkolva van, nem kerekítve: az 1/10 = 25/256
`0.09` formátumban nyomtatja ki.

### Lebegőpontos: `EGYSZERES` / `DUPLA` (1.6.4)

Az `dim x as single` és az `dim x as double` valós lebegőpontos számok – a C64
BASIC 5 bájtos formátuma: körülbelül 9 értékes számjegy, tartomány ±2,9·10⁻³⁹ …
±1,7·10³⁸. (Az `single` és az `double` ugyanazon típus.) A gyors 2 bájtos Q8.8
típus továbbra is elérhető `float` néven.

```basic
DIM r AS DOUBLE, t AS DOUBLE
DIM k(9) AS SINGLE ' tömbök: 5 bájt elemenként
r = 2,5
t = ATN(1) * 4 * r ^ 2 ' 19,6349541
PRINT t; " "; SQR(2); " "; 1E10; " "; 1 / 3
FOR r = 0 TO 1 STEP 0,25 : PRINT r : NEXT
FUNCTION Atfogo(a AS DOUBLE, b AS DOUBLE) AS DOUBLE
Atfogo = SQR(a * a + b * b)
END FUNCTION
```

|                       |                                                                                                                                                                                         |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Operátorok            | `+ - * /` és `^` (hatvány; jobb asszociatív, szorosabb kötés, mint az egykomponensű mínusz: `-2^2` = -4)                                                                                |
| Funkciók              | `SQR`, `SIN`, `COS`, `TAN`, `ATN` (radián), `EXP`, `LOG` (természetes), `INT` (padló), `FIX` (csonkítás), `CINT` (kerek), `ABS`, `SGN`, `CSNG` / `CDBL` (nincs művelet), `ÉRTÉK`, `RND` |
| `MOD`                 | `a MOD b` = `a - b * FIX(a / b)` (`a` előjele, mint VB / C `fmod`): `7.5 MOD 2` = 1.5; `x MOD 0` = x                                                                                    |
| `RND`                 | Egy lebegőpontos utasításban az `RND` / `RND()` egy véletlenszám 0 ≤ x < 1 (`d = RND`, `x = RND * 6`); az `rnd(n)` értéke 0 … n-1 egész szám marad                                      |
| Literálok             | `1,5`, `.5`, `1E6`, `2,5e-3`, `70000`                                                                                                                                                   |
| Összehasonlítások     | `= &lt;&gt; &lt; &gt; &lt;= &gt;=` a `HA` / `MIközben` / `Amíg` / `SELECT CASE` és értékekként                                                                                          |
| Nyomtatás             | C64 BASIC stílus: `.5`, `-3.25`, `3.33333333`, `1E+10`, `1.5E-07` (nincs kezdő szóköz, kivéve, ha `--basic-print`); rögzített tizedesjegyek a `PRINT USING` paranccsal                  |
| Húrok                 | `s = "X=" + x`, `STR$(x)`, `VAL(s)` beolvassa a `-1.25E3` értéket                                                                                                                       |
| `FOR`                 | lebegőpontos számláló, határérték és lépésköz (`STEP 0.1`, negatív vagy változó)                                                                                                        |
| `BEVITEL` / `OLVASÁS` | `INPUT x` beolvas bármilyen számot; `READ x` beolvassa a következő `adat` bájtot                                                                                                        |
| Al-/funkció           | `p AS DOUBLE` paraméterek és `AS DOUBLE` eredmények                                                                                                                                     |

**Egész számokkal való keverés.** Egy kifejezés lebegőpontos konstansként kerül
kiszámításra, ha EGYSZERES / KETTŐS értéket, `^` értéket, a fenti függvények
egyikét, vagy egy olyan literált tartalmaz, amelyet csak lebegőpontos érték
tarthat meg (`1E6`, `300.5`, `70000`). Ha egy program lebegőpontos számot
használ, minden decimális literál (`0.1`) szintén lebegőpontos konstans. Egy
lebegőpontos érték `bájtba`, `egész számba` vagy `szóba` **kerekítve** jelenik
meg (nullától félig: 2,5 → 3, -2,5 → -3); egy `float` szóba Q8,8 lesz. Egy
DOUBLE-hoz rendelt egész szám pontosan konvertálódik. Az egész szám kifejezések
megtartják az egész számra vonatkozó szabályaikat (az `var c = a + b` továbbra
is egy bájt).

**Jegyzetek**
- Egy 32768-tól 65535-ig terjedő egész számú literál megtartja az értékét egy
  olyan utasításban, amely lebegőpontos formában számol (`d = 40000`, `d +
  50000`). Egy utasítás lebegőpontosnak számít, ha EGYSZERES / KETTŐS változót,
  tömböt, paramétert vagy függvényt nevez meg, vagy ha az `^` kifejezést, egy
  csak lebegőpontos literált vagy a fenti függvények egyikét használja; máshol
  egy ilyen literál egy 16 bites minta, mint korábban (`beszúrja az 53280, 1`,
  `w = 40000` karaktereket egy SZÓBA). Egy olyan változó, ami csak a `var x =
  2.5` paraméteren keresztül lett lebegőpontos, nem számít – írd ide a `40000.0`
  értéket.
- Az `7 / 2` értéke 3,5, ha DUPLA típusúhoz rendeljük; egész kontextusban, mint
  korábban, 3.
- Az `ÉS` / `VAGY` / `XVAGY` függvények egész számokra kerekítik az
  operandusaikat.
- Egy bájtérték `SIN` / `COS` értékei megőrzik a régi 0–255 táblázat jelentését
  (teljes kör = 256); EGYSZERES / KETTŐS argumentummal radiánban működnek.
- Az IRQ / NMI kezelők használhatnak lebegőpontos értéket: egy `irq`, `nmi` vagy
  `cia_timer` tárolóban megnevezett részhalmaz, amely (közvetlenül vagy a
  meghívott részhalmazokon keresztül) SINGLE / DOUBLE értéket használ, elmenti a
  futásidejű állapotot a kezdetén, és visszaállítja azt az `irq_exit` /
  `nmi_exit` előtt (megszakításonként körülbelül 4-5 ezer ciklus). A
  lebegőpontos érték nélküli kezelőket nem lassítja le a rendszer. Nem tartozik
  ide: a cím vagy szóváltozó által beállított kezelő, vagy az, amely sima `RTS`
  / `RTI` értékkel távozik.
- Költség: a lebegőpontos futási környezetet a fordító állítja össze és fűzi
  hozzá a program után; csak a program által használt rutinok szerepelnek benne
  (kb. 2 KB az `+ - * /` és az `PRINT` függvények esetén, legfeljebb körülbelül
  5 KB az összes függvénnyel és az `PRINT USING` függvényekkel). A változók 5
  bájtot foglalnak el a tömbterületen, plusz egy 2 bájtos nulla oldalas mutatót
  a futási környezethez. Egy szorzás nagyjából 1-2 ms-ot vesz igénybe egy 1
  MHz-es C64-en.

### Változók RAM-ban, tömbmemóriában (1.6.4)

- **Nulla oldal megtelt:** amikor a program változói nem férnek el az állandó
  nulla oldalra (`$02-$4F`), a fordító újrafordítja azt, és a gyorskódban
  legkevésbé használt változókat a normál RAM-ba (a tömbök után) helyezi át. Egy
  ilyen változót használó utasítás azt egy nulla oldalas helyre és vissza
  másolja, így a programok ugyanúgy viselkednek, csak ezek a változók egy kicsit
  lassabbak. A ciklusszámlálók, paraméterek és bármi, amit egy IRQ kezelő
  megérinthet, a nulla oldalon marad. A memóriatérkép `RAM:$xxxx` formában
  mutatja őket. A nulla oldal kimerülése már nem hiba, kivéve szélsőséges
  eseteket (az `nulla oldal kimerülése` megmarad ezekre).
- **Tömbmemória: Az ** tömbök (és a kiömlött / lebegőpontos változók) az
  `$C000-$CFFF` tartományt használják. Amikor 4096 bájtnál több helyre van
  szükségük, a terület `$A000` tartományban kezdődik, ami 12 KB-ot eredményez
  (`$A000-$CFFF`): a BASIC ROM a program indításakor kikapcsol (`$01` 0. bit),
  és minden BASIC-be való kilépéskor újra bekapcsol (`end`, `bye`, end of
  program, `chain`), így a program továbbra is egy működő BASIC-be tér vissza. A
  BASIC ROM rutinokat maguk hívó programok (`sys $Axxx`) nem használhatnak 4
  KB-nál több tömböt.

### Matematikai függvények

```basic
var a = abs(x - 20) # kettes komplementer abszolút érték
var b = min(x, 39) # 8 bites minimum
var c = max(x, 0) # 8 bites maximum
var s = sgn(pontszám) # 0 = nulla, 1 = pozitív (1–127), $FF = negatív (128–255)
var r = rnd() # LCG pszeudo-véletlenszerű 0-255; seed from raszteres sor
# (0 &lt;= x &lt; 1 EGYSZERES / KETTŐS utasításban: d = rnd)
var r = rnd(10) # LCG pszeudo-véletlen 0-9 (rnd() mod n; eredmény 0..n-1)
var s = sin(szög) # szinusz: szög 0-255 (teljes kör), visszaadja a 0-255 értéket (középpont=128)
var c = cos(szög) # koszinusz = sin(szög+64)
var v = clamp(x, 0, 39) # 8 bites előjel nélküli clamp: eredmény = max(lo, min(hi, val))

print hex(n) # kiírás 2 számjegyű nagybetűs hexként
print bin(n) # kiírás 8 bites bináris karakterláncként
```

### Sztringfüggvények

```basic
var n = len(msg) # a nullával lezárt karakterlánc hossza var (0–255)
var c = asc(msg) # az első karakter PETSCII kódja (0, ha üres)
var c = asc("A") # fordítási idő: konstans PETSCII kód
var n = val(s) # futási idő: decimális PETSCII karakterlánc elemzése → 8 bites egész (pl. "042" → 42)
var c = msg[i] # az i indexen lévő karakterlánc: az msg[i] PETSCII kódja
msg[i] = c # a PETSCII c bájt kiírása az i indexen lévő karakterláncba — STA (ptr),Y
msg[0] = 72 # konstans index → LDY #0; STA (ptr),Y
```

### Számformázás

```basic
print hex(n) # kinyomtatás 2 számjegyű nagybetűs hexként
print bin(n) # kinyomtatás 8 bites bináris karakterláncként
print dec(n, 4) # jobbra igazított decimális szám 4 karakteres mezőben (pl. 42 → " 42")
print dec(n, width) # a width változó is lehet
```

A `dec(n, width)` a bal oldali számot szóközökkel tölti ki a `width` karakterek
kitöltéséhez. Ha a szám több számjegyből áll, mint a `width`, akkor kitöltés
nélkül (csonkolás nélkül) kerül kinyomtatásra. Nem nyomtatási környezetben a
`dec(n, w)` a `n` értéket változatlanul adja (ugyanaz, mint a `hex`/`bin`).

### REU (RAM bővítőegység)

```basic
var ok = reu_present() # 1, ha REU-t észlel, 0, ha nem (írási/olvasási teszt a $DF04-en)
var ok = reudet() # a reu_present() álneve

reu stash c64addr, bank, reu_addr, len # C64 másolása → REU
reu fetch c64addr, bank, reu_addr, len # REU másolása → C64
reu swap c64addr, bank, reu_addr, len # csere C64 és REU között
```

Az `reu_present()` írási/visszaolvasási tesztet hajt végre a `$DF04` REU
regiszteren. REU nélkül az írás elvész (nyitott busz), így a visszaolvasás
eltérő – megbízhatóan érzékeli a jelenlétet anélkül, hogy bármilyen mellékhatást
okozó parancsregisztert érintene.

| Paraméter | Szélesség | Megjegyzések                                                       |
| --------- | --------- | ------------------------------------------------------------------ |
| `c64cím`  | 16 bites  | C64 RAM indítása — konstans, `word` változó vagy 8 bites kifejezés |
| `bank`    | 8 bites   | REU bankszám (0–7 egy 512 KB-os egységhez)                         |
| `reu_cím` | 16 bites  | REU bankon belüli elszámolás                                       |
| `len`     | 16 bites  | Átvinni kívánt bájtok (`0` = 65 536 REU hardverben)                |

REU regiszterek: `$DF01` parancs (`$B0` stash / `$B1` fetch / `$B2` swap),
`$DF02–$DF03` C64 cím, `$DF04–$DF05` REU eltolás, `$DF06` bank, `$DF07–$DF08`
hossz. Az átvitel szinkron (a CPU leáll DMA közben). Valódi REU vagy VICE
szükséges: **Beállítások → Hardver → RAM bővítőmodul**.

### Memória segédprogramok

```basic
fill screen 32 # képernyő kitöltése RAM $0400–$07FF értékkel 32 (szóköz karakter)
fill color 1 # kitöltőszín RAM $D800–$DBFF értékkel 1 (fehér)

fill $0400, 1000, 32 # 1000 bájt kitöltése $0400-tól kezdődően 32 értékkel
fill addr, 256, 0 # addr lehet szóváltozó
fill ptr, len_word, val # minden operandus lehet kifejezés / szóváltozó

memcopy $C000, $0400, 256 # 256 bájt másolása $C000 → $0400 címről
memcopy src_ptr, dst_ptr, 40 # szóváltozók a forráshoz és a célhoz

drawmem $C000, $0400, 8, 10, 40 # 8×10 bit másolása közvetlenül innen $C000 → képernyő $0400-nál, 40-es lépésszám
drawmem src_ptr, dst_ptr, w, h, 40 # szóváltozók az src/dst-hez
```

A `fill` és a `memcopy` is támogatja a 16 bites hosszúságokat (0–65535). 255-nél
nagyobb hosszúságok esetén `word` változókat használjon.

A `drawmem src, dst, width, height, stride` egy kétdimenziós téglalap alakú
blokkot másol. A `src` lineárisan olvasható (csomagolt sorok); a `dst` `stride`
bájttal lép előre a sorok között — a C64 képernyőhöz vagy színes RAM-hoz (40
oszlop) a `40` (28 dollár) használható. A szélesség, magasság és lépésszám mind
8 bites értékek. A `src` és a `dst` lehetnek konstansok, `word` változók vagy 8
bites kifejezések.

### Raszteres IRQ

```basic
irq my_handler # raszter IRQ a 0. sorban, kezelő = alnév vagy cím
irq my_handler, 100 # raszter IRQ a 100. rasztersorban
irq $C800, 200 # kezelő fix címen
irq addr_word # kezelő címe egy szóváltozóból
```

Beállít egy raszteres IRQ-t a BASIC szoftveres vektoron (`$0314`/`$0315`)
keresztül: letiltja a CIA1 időzítő IRQ-ját, nyugtázza a VIC IRQ-t függőben,
raszteres sort ír a `$D012` címre, engedélyezi a VIC raszteres IRQ-t
(`$D01A=$01`), kiírja a kezelő címét, és újra engedélyezi a megszakításokat.

A kezelőnek **kell** `sys $EA81`-ra végződnie (KERNAL IRQ vége) — a sima `RTS`
vagy `RTI` sérti a verem tartalmát. Először nyugtázd a VIC IRQ-t:

```basic
sub my_handler()
poke $D019, $FF # ACK VIC IRQ
# ... itt működik ...
sys $EA81 # JMP a KERNAL-hoz IRQ vége
end
```

Az előrehivatkozások támogatottak (`irq my_handler` az aldefiniálás előtt).

Egy kezelő alrendszer EGYSZERES / KETTŐS lebegőpontos műveletet használhat: ez a
művelet a törzse körüli futásidejű állapotot menti és állítja vissza (lásd:
*Lebegőpontos művelet*).

### NMI-kezelő

```basic
nmi my_nmi # $0318/$0319 NMI vektor beállítása a kezelő alcímére vagy címére

sub my_nmi()
# ... Az NMI itt működik ...
nmi_exit # JMP $FE47 — megfelelő NMI kilépés (visszaállítja az A/X/Y + RTI értékeket)
end
```

A `nmi handler` a kezelő címét az NMI soft vektorba írja (`$0318`/`$0319`). A
`$FFFA` helyen található hardveres NMI vektor a KERNAL NMI rutinra mutat, amely
a `$0318` címen keresztül ágazik el. A kezelőnek **kell** végződnie
`nmi_exit`-ra (`JMP $FE47` címet bocsát ki) — a sima `RTI` használata a verem
sérüléséhez vezet. Előrehivatkozások támogatottak.

### CIA1 időzítő megszakítás

```basic
cia_timer 19656, my_handler # CIA1 időzítő A: 19656 ciklusonként aktiválódik (~50 Hz PAL)
cia_timer period, handler # az időszak lehet változó vagy kifejezés
```

Beállítja a CIA1 időzítőt A periodikus IRQ forrásként a BASIC szoftveres
vektoron (`$0314`/`$0315`) keresztül:
1. SEI – megszakítások letiltása
2. `$DC0D = $7F` — minden CIA1 IRQ letiltása
3. 16 bites periódus betöltése lo→`$DC04`, hi→`$DC05`
4. Írd be a kezelő címét `$0314`/`$0315` ide
5. `$DC0D = $81` — CIA1 időzítő A IRQ engedélyezése
6. `$DC0E = $01` — Az A időzítő indítása folyamatos üzemmódban
7. CLI – megszakítások újraengedélyezése

A kezelőnek `irq_exit` (vagy `sys $EA81`) végződésűnek kell lennie, és
nyugtáznia kell a CIA1 IRQ-t:

```basic
sub my_handler()
poke $DC0D, $01 # ACK CIA1 időzítő A IRQ (az olvasás törli is)
# ... itt működik ...
irq_exit # JMP $EA81: A/X/Y + RTI visszaállítása
end
```

PAL időzítés: órajel = 985 248 Hz. Periódusidő 50 Hz-nél = 985 248 / 50 = 19 705
ciklus ≈ `$4CC9`. Előremeneti referenciák támogatottak.

### Hibakezelés

```basic
onerr goto err_handler # a KERNAL I/O hibavektor ($0300/$0301) címkévé tétele

...

címke err_handler
print "I/O HIBA"
bye
```

A `onerr goto label` a címkét (lo, hi) a KERNAL `$0300` és `$0301` helyekre
írja. Amikor KERNAL I/O hiba történik (pl. sikertelen `load` vagy `open`), a
KERNAL végrehajtja a `JMP ($0300)` parancsot, amely a címkére ágazik. Az előre
mutató hivatkozások (a `onerr goto` után definiált címke) támogatottak.

### Fordítási idejű fájlbeágyazás (`incbin` skip / length, új az 1.5.7-es verzióban)

```basic
incbin "sprites.bin" # nyers bináris bájtok beágyazása az aktuális kódpozícióba
incbin "charset.bin", $2000 # beágyazás abszolút címre, szükség szerint kitöltve
incbin "font.prg", $3C00, 2 # ...az első 2 bájt kihagyása (pl. egy .prg betöltési cím)
incbin "big.bin", $4000, 16, 256 # ...16 bájt kihagyása, majd legfeljebb 256 bájt felhasználása
include "defs.ub" # egy másik .ub forrásfájl beágyazása (lexikálisan + helyben értelmezve)
```

Az `incbin "file", addr, skip [, length]` függvény eldobja a fájl első `skip`
bájtját (jellemzően egy `.prg` 2 bájtos betöltési címe), és opcionálisan
legfeljebb `length` bájtot foglal el; az `skip` és `length` konstansok, és a
fájl vége utáni `skip` hiba. A címforma megköveteli, hogy a cél a generált kód
felett legyen – vagy egy `org` résen belül.

### Adatok / Olvasás

```basic
data 1, 2, 3, 255 # konstans bájttábla
read varname # a következő bájt betöltése a változónév táblába (szükség esetén automatikusan deklarálódik)
```

Az összes `data` értéket fordítási időben gyűjti össze a rendszer. A program
indításakor automatikusan lefoglal és inicializál egy 2 bájtos ZP mutatót.
Minden `read` lépéssel előrébb viszi a mutatót.

**Inicializált tömbök — `data <tömb>: …` (új az 1.5.8-as verzióban)**

```basic
var sinus = array(8)
data sinus: 128, 218, 255, 218
data sinus: 128, 37, 0, 37 # a további sorok ott folytatódnak, ahol az előző abbamaradt
print sinus[i] # véletlenszerű hozzáférés, mint bármely tömb

var xpos = array_word(2)
data xpos: 24, 300 # a szavas tömbök 16 bites értékeket fogadnak (lo, hi tárolva)
```

Egy `data` sor, amelynek első eleme `name:`, egy deklarált `array` /
`array_word` adatfolyamot tölt ki a `read` adatfolyam helyett. Az értékek a kód
után tárolódnak, és a program indításakor egyszer másolódnak a tömbbe
(közvetlenül a tömbök nullázása után), így a táblázat teljesen írható és
indexelhető, mint bármely más tömb. A tömbben lévőnél több érték, vagy a nem
deklarált név fordítási hibát jelent. Ezek a sorok nem befolyásolják az `read`
adatfolyamot.

### Soros összeszerelés

```basic
sys $FFD2 # JSR $FFD2
sys $FFD2, 7 # LDA #7 ; JSR $FFD2 (átadott bájtérték az A regiszterben)
irq_exit # JMP $EA81 — megfelelő IRQ kezelő kilépés (A/X/Y + RTI visszaállítása)
asm $EA, $EA # inline nyers bájtok (NOP NOP) — örökölt forma
asm {
; Teljes 6502 mnemonika és címzési módok
LDA #$07 ; azonnali
STA $0286 ; abszolút
LDA $50 ; nulla oldalas ($50 ≤ $FF → ZP automatikusan kiválasztva)
STA $0400,X ; abszolút,X indexelt
LDA ($50),Y ; (közvetett),Y
LDA ($50,X) ; (közvetett,X)
JSR $FFD2 ; alprogramhívás
JMP $C000 ; abszolút ugrás
JMP ($FFFC); közvetett ugrás

CLC
ADC #1
SEC
SBC #1

TAX; implicit / transzfer
ASL A; akkumulátor (szintén csak: ASL)
LSR A
ROL
ROR

; Elágazások — az operandus abszolút cím; az eltolás automatikusan kiszámításra kerül
BNE ciklus; előre vagy hátra elágazás a helyi címkére
BEQ kész

ciklus:
NOP
kész:
RTS

; #<címke / #>címke — a címkecím alsó / felső bájtja
LDA #<kezelő
STA $0314
LDA #>kezelő
STA $0315

; * — aktuális assembly hely
JMP *

; Nyers hex bájtok (visszafelé kompatibilis a régi asm { $xx ... } szintaxissal)
$EA $EA; két NOP bájt
}
```

**Címzési módok:**

| Szintaxis         | Mód            | Bájtok | Példa                     |
| ----------------- | -------------- | ------ | ------------------------- |
| (nincs operandus) | Hallgatólagos  | 1      | `NOP`, `RTS`              |
| `A`               | Akkumulátor    | 1      | `ASL A`, `LSR`            |
| `#érték`          | Azonnali       | 2      | `LDA #07`                 |
| `$zz` (0–255)     | Nulla oldal    | 2      | `LDA $50`                 |
| `$zz,X`           | ZP,X           | 2      | `LDA $50,X`               |
| `$zz,Y`           | ZP,Y           | 2      | `LDX $50,Y`               |
| `$xxxx`           | Abszolút       | 3      | `LDA $0400`               |
| `$xxxx,X`         | Abszolút,X     | 3      | `LDA $0400,X`             |
| `$xxxx,Y`         | Abszolút,Y     | 3      | `LDA $0400,Y`             |
| `($xxxx)`         | Közvetett      | 3      | `JMP ($FFFC)`             |
| `($zz,X)`         | (Közvetett, X) | 2      | `LDA ($50,X)`             |
| `($zz),Y`         | (Közvetett),Y  | 2      | `LDA (50 dollár),Y`       |
| `címke`           | Relatív        | 2      | `BNE label` (csak fiókok) |

- Az `$zz` (1–2 hexadecimális számjegy, érték ≤ 255) a nulladik oldalas
  formátumot választja, ha az utasítás támogatja; egyébként automatikusan
  abszolútra frissül. Az `$00xx` (4 számjegy) használatával kényszerítheti ki az
  abszolút formátumot.
- Az elágazási operandusok abszolút címek; a relatív bájt eltolást a rendszer
  automatikusan számítja ki.
- A lokális címkék (`name:`) hatóköre a `asm { }` blokkra korlátozódik. Az előre
  irányuló ágak a 2. menetben oldódtak fel.
- A `#<label` / `#>label` értékek a címke címének lo / hi bájtját adják.
- A `*` visszaadja az aktuális utasításcímet, így a `JMP *` önálló ciklusként
  állítódik össze.
- A `$`, `%` karakterekkel vagy számjeggyel kezdődő sorok nyers bájtként
  kerülnek kibocsátásra (visszafelé kompatibilis).
- A `asm { }` karaktereken belül a megjegyzések `;` vagy `//` karakterekkel
  végződnek a sor végéig. Az (`#` a közvetlen előtag, nem megjegyzés.)

**A `asm { }` keverése alprogramparaméterekkel**

A paraméternevek **nem érhetők el** a `asm { }` blokkokon belül. Az
UltimateBasic utasításokkal az értékeket a `asm { }` blokk előtti ismert
helyekre helyezheti át:

```basic
sub set_colors(border_col, bg_col)
poke $D020, border_col # Az UltimateBasic feloldja a ZP címet
poke $D021, bg_col
asm { 
; az értékek már benne vannak a $D020 / $D021-ben
LDA $D020
}
end
```

Az olyan rutinok esetében, amelyeknek teljes törzse assembly – különösen az IRQ
kezelők esetében, amelyeknek kereszthivatkozásokat kell tartalmazniuk egymásra
–, az összes kezelőt helyezd el **egyetlen legfelső szintű `asm { }` blokkba** a
főprogramban. Az azonos blokkban lévő címkék megosztják a hatókört, így a `irq1`
és a `irq2` szabadon hivatkozhatnak egymásra. Lásd:
`examples/raster_irq_demo.ub`.

### Karakterlánc ↔ egész szám

```basic
numstr pontszám, $0340 # kiírja a "042\0"-t $0340-nek (mindig 3 számjegy, nullákkal kiegészítve)
var n = str_to_int("42") # fordítási idejű: Expr::Number(42)

print str$(score) # 8 bites egész számot ír ki 3 számjegyű decimális karakterláncként ("000"–"255")
print "Pontszám: " + str$(score) # használható karakterlánc concat nyomtatási környezetben
var s: string = str$(n) # az str$() eredményét karakterlánchoz rendeli var (megosztott statikus puffer)
```

A `str$(n)` egy 8 bites értéket 3 karakteres decimális karakterlánccá alakít
(mindig 3 számjegy vezető nullákkal, pl. `5` → `"005"`, `42` → `"042"`, `255` →
`"255"`), amelyet egy null terminátor követ. Az eredménymutatót egy állandó ZP
párban tárolja a rendszer, amelyet fordítási időben foglalnak le.

> **Megjegyzés:** A `str$(n)` egyetlen megosztott 4 bájtos statikus puffert
> használ. A `str$(n)` ismételt meghívása felülírja az előző eredményt. Több
> érték egyidejű megjelenítéséhez a `numstr` használatával külön abszolút
> címekre kell írni.

## Példák

| Fájl                                  | Leírás                                                                                                |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `példák/jellemzők.ub`                 | konstans, címke/goto, piszkálás/bukás, rnd, matematikai függvények                                    |
| `példák/új_szolgáltatások.ub`         | alparaméterek, tömbök, szóváltozók, karakterláncváltozók                                              |
| `példák/bitmap_demo.ub`               | 320×200 bitkép, plot, grafika be/ki                                                                   |
| `példák/blokk_demo.ub`                | 80×50 blokkgrafika, plot4, circle4, grafika blokkon                                                   |
| `példák/joystick_demo.ub`             | joystick olvasás, sprite mozgás                                                                       |
| `példák/mux_demo.ub`                  | raszteres sprite multiplexer (3 ablak × 8 sprite = 24)                                                |
| `példák/orbit_demo.ub`                | 24 sprite pálya pulzáló sugárral és véletlenszerű színekkel                                           |
| `példák/plasma_demo.ub`               | plazmahatású bitkép raszteres sávszegély animációval                                                  |
| `példák/sprite_adatok.ub`             | sprdef alakzatadatok (más demókban is megtalálhatók)                                                  |
| `példák/sprite_mux_orbit.ub`          | 24 sprite-os pálya demó sprdef-fel + előre kiszámított pozíciókkal                                    |
| `példák/sprite_orbit_demo.ub`         | 8 hardveres sprite körpályán sin/cos táblázat segítségével                                            |
| `példák/reu_bitmap_demo.ub`           | REU stash/fetch bitmap grafikával                                                                     |
| `példák/sid_music_demo.ub`            | SID zenelejátszó raszteres IRQ-val és billentyűzetkilépéssel                                          |
| `példák/tenprint.ub`                  | 5 TENPRINT labirintus implementáció menüvel; demók `lowercase` karakterkészlet módban                 |
| `példák/visszaszámláló_demo.ub`       | Visszaszámlálás `for..next` negatív lépésekkel, beleértve a `for i = 20 to 0 step -2`-t is            |
| `példák/visszaszámláló_hibák_demo.ub` | Fordítási idejű hiba az alapértelmezett lépéshez `from > to`                                          |
| `példák/explicit_demo.ub`             | `--explicit` CLI-flag bemutató teljesen begépelt `var`, `sub`, `fn` szövegekkel                       |
| `examples/explicit_errors_demo.ub`    | Laza kód, ami `--explicit` nélkül épül fel, hibákat okoz                                              |
| `példák/dim_demo.ub`                  | `DIM … AS …` minden típusú skalár és tömb                                                             |
| `examples/qbasic_demo.ub`             | QBasic stílusú FUNCTION / SUB / ELSEIF / DO-LOOP / SELECT CASE / karakterláncok                       |
| `példák/float_demo.ub`                | EGYSZERES / KETTŐS lebegőpontos: `^`, SQR, SIN, ATN, EXP, LOG, `FOR … STEP 0.5`, `AS DOUBLE` függvény |

## CLI-referencia

```
ub build <input.ub> [OPCIÓK]

-o, --output <fájl> .prg vagy .crt fájl kimenete (alapértelmezett: <input>.prg)

-v, --verbose Nulla oldalas elrendezés és kód hex dump megjelenítése
--no-stub A BASIC SYS stub kihagyása (a kód $0801-kor töltődik be)
--debug .sym, .dbg és .vs hibakereső fájlok létrehozása is
--asm Olvasható 6502 kódgeneráló .asm lista létrehozása is
--d64 [fájl] .d64 lemezkép létrehozása is;
fájlnév nélkül alapértelmezetten <output>.d64
--add <fájl> Egy extra fájl hozzáadása a .d64 lemezképhez;
több fájlnál is megismételhető
--explicit :type megadása kötelező minden változó / alparaméter / fn-paraméter esetén
--basic-print C64 ALAPVETÍTÉS térköz: számok körüli szóközök, ',' = 10 oszlopos zónák
-h, --help Súgó megjelenítése
```

### CRT export

Az Ultimate Basic képes Magic Desk 19-es típusú kazettaképet is írni, ha a
kimeneti fájlnév `.crt`-ra végződik:

```bash
ub build demo.ub -o demo.crt
```

A fordítóprogram a generált PRG-t egy tárolt CRT konténerbe csomagolja, ugyanazt
az elrendezést használva, mint a VisualAssembler CRT exportja: egy 64 bájtos
kazettafejléc, egy 8×8K-s Magic Desk kép és egy boot betöltő a 0. bankban, amely
a PRG hasznos adatát a C64 RAM-ba másolja, mielőtt a program belépési pontjára
ugrik. A `.prg` és `.d64` elérési utak továbbra is a korábbiakhoz hasonlóan
működnek.

### Explicit típusú mód

Adja meg a `--explicit` parancsot, hogy minden deklarációs webhelyen `:type`
annotáció szerepeljen:

```bash
ub build game.ub --explicit
```

A jelző nélkül az Ultimate Basic elfogadja mind a `var x = 5` típust (az
inicializálóból kikövetkeztetett vagy alapértelmezés szerint `int` típusút),
mind a `var x: int = 5` típust. A jelzővel csak az annotált forma fordul le – a
laza forma fordítási idejű hibává válik.

**Amit érvényesít:**

| Nyilatkozati űrlap                                   | `--explicit` nélkül         | `--explicit`-val      |
| ---------------------------------------------------- | --------------------------- | --------------------- |
| `var name = expr` (nem `:type`)                      | ok — típus kikövetkeztetett | hiba                  |
| `var name: int = expr` (vagy szó/float/karakterlánc) | Rendben                     | Rendben               |
| `var arr = array(N)`                                 | ok — típus kikövetkeztetett | hiba                  |
| `var arr = array_word(N)`                            | Rendben                     | Rendben               |
| `const NAME = value`                                 | Rendben                     | rendben – változatlan |
| `sub foo(a, b)` (beíratlan paraméterek)              | Rendben                     | rendben – változatlan |
| `sub foo(a: int, b: int)`                            | Rendben                     | rendben – változatlan |
| `fn foo(a): int` (beíratlan paraméter)               | Rendben                     | hiba a paraméterben   |
| `fn foo(a: int): int`                                | Rendben                     | Rendben               |
| `fn foo(a): int` (beíratlan paraméter)               | Rendben                     | hiba a paraméterben   |
| `fn ize(a: int): int`                                | Rendben                     | Rendben               |

A konstansok és a tömbdeklarációk mindig elfogadottak – típusukat a deklarációs
űrlap rögzíti, így a `:type` redundáns lenne.

**Példa hibaüzenetre:**

```
$ ub build myprog.ub --explicit
Fordítási hibák:
14. sor: 'explicit' mód: a 'var loose' paraméternek nincs típusa — használja a 'var loose: int|word|float|string' formátumot
16. sor: 'explicit' mód: az 'a' paraméternek nincs típusa — használja az 'a: int|word|float|string' formátumot
```

A jelző egy építési időben változó kapcsoló – a forrásban semminek sem kell
megváltoznia a be- vagy kikapcsoláshoz. Add hozzá a Makefile / build
szkriptedhez, hogy a típusos stílust a projekt egészére érvényesítsd, vagy hagyd
el a felfedező szkripteknél. Lásd: `examples/explicit_demo.ub` és
`examples/explicit_errors_demo.ub`.

### Hibakeresési fájlok

A `--debug` használatával hibakereső szimbólumokat generálhat a programmal
együtt:

```bash
ub build demo.ub --debug
```

A fordítóprogram a fájlokat a `.prg` mellé írja, a kimeneti fájl törzsét
használva:

| Fájl       | Formátum és cél                                                                                              |
| ---------- | ------------------------------------------------------------------------------------------------------------ |
| `demo.sym` | KickAssembler-kompatibilis szimbólumforrás, amely alkalmas assembler forráskódba importálásra                |
| `demo.dbg` | C64Debugger/RetroDebugger KickAssembler hibakeresési dump, amely tartalmazza a program szegmensét és címkéit |
| `demó.vs`  | VICE monitor parancsfájl, amely `al` parancsokat tartalmaz a címcímkékhez                                    |

Mindhárom exportálás tartalmazza a `program_start`, `program_end` értékeket,
változókat, tömböket, alprogramokat és a kódgenerálás után ismert BASIC
címkéket. Például a VICE szimbólumokat a `-moncommands demo.vs` parancssori
opcióval vagy a monitor `ll "demo.vs"` parancsával töltheti be.

A jelenlegi `.dbg` export szegmens- és címszimbólum-információkat biztosít. Még
nem tartalmazza az utasítás-forrásvonal leképezéseket a forrásszintű lépésekhez.

### Assembly kódgeneráló lista (újdonság az 1.5.2-es verzióban)

A `--asm` karakterlánccal írjon olvasható 6502-es forráslistát a PRG mellé:

```bash
ub build demo.ub --asm
```

Egy `demo.prg` nevű kimenet esetén ez létrehozza a `demo.asm` fájlt. A lista a
gépi kód generálása során gyűjtött metaadatokból készül; ez nem pusztán a kész
PRG szétszerelése. A következőket tartalmazza:

- `; UB:` megjegyzések, amelyek az egyes kibocsátó UB utasítások generált
  bájttartományát jelölik;
- névvel ellátott konstansok a nulladik oldalas változókhoz és a `$C000+`
  tömbökhöz, beleértve azok típusát/méretét is;
- az alprogramok és a BASIC címkék végső nevei és címei;
- `loc_xxxx` címkéket generált a relatív ágakhoz és a programon belüli
  `JMP`/`JSR` célpontokhoz;
- normál 6502 mnemonikok és operandusok, ahol ismertek, fordítói szimbólumokkal
  helyettesítve;
- a pontos C64 cím és a kibocsátott bájtok száma minden utasítás mellett;
- a fordító által generált segítők és a beágyazott kód végső
  memóriasorrendjükben;
- `.byte` kimenet azokhoz a bájtokhoz, amelyeket nem a támogatott 6502-es
  utasítások szerint dekódolnak.

A fordítási segédprogramok leíró neveket kapnak, például `ub_helper_plot`,
`ub_helper_line_erase`, `ub_helper_print_hex` és `ub_helper_music_irq`. Az
ismert beágyazott adatok – beleértve a `data` utasításokat, a leképezési
karakter/szín tömböket, a sprite- és karakterdefiníciókat, a szinusztáblázatot,
a betöltési fájlneveket, a `incbin` fájlokat, a SID zenét és a Koala hasznos
adatokat – elnevezett `.byte` régiókként kerülnek kibocsátásra. A hosszú,
nullákkal kiegészített címhézagok a KickAssembler `.fill` direktíváját
használják.

Példa részlet:

```asm
.label x = $02; int

* = $080D

ub_start:
cld; $080D: D8

; UB: var x
lda #$01; $080E: A901
stax; $0810: 8502
```

A cím/bájt megjegyzések megkönnyítik a lista összehasonlítását a `.prg`
listával. A kimenet a KickAssembler szintaxist használja (`.label`, `.byte`,
`.fill` és `* = origin`), így újra összeállítható; a gépi kódú megjegyzések nem
befolyásolják az eredményt.

A `--add` használatához `--d64` szükséges. A lefordított `.ub` program mindig az
első fájl a lemezen; minden `--add` fájl utána fűződik hozzá. A lemezen lévő
fájlnevek a forrásfájl nevéből származnak, nagybetűvel írva (pl. `music.prg` →
`MUSIC`).

Sikeres fordítás után a fordító mindig kinyomtat egy memóriatérképet:

```
demo.ub → demo.prg (386 bájt)

Betöltés: $080D – $0989

Változók (nulladik oldal):
score ZP:$08 bájt
lives ZP:$0A bájt
msg ZP:$0C string
ptr ZP:$0E word

Alprogramok:
greet $0900
show $0912

Tömbök ($C000+):
sprite-ok $C000 8 bájt
```

A `-v` beállítással a kimenet ezen felül mutatja a belső ZP-foglalásokat és egy
teljes hexadecimális kiírást.

### Generált kód (1.6.0-ban optimalizálva)

A kódgenerátor szigorúbb 6502-es kódot bocsát ki a gyakori esetekben; a
programoknak nincs szükségük változtatásokra:

- Az `if` / `while` / `until` / `select` feltételek egy `CMP` plusz egy elágazás
  (nincs 0/1 érték felépítve és újra tesztelve). Az `x &gt; n` a következőképpen
  fordul elő: `x &gt;= n+1`; az összehasonlítások `és` / `vagy` zárlatosak, ha a
  jobb oldalnak nincsenek mellékhatásai; a `while` tesztek a ciklus alján
  találhatók.
- A konstansok és a bájtváltozók közvetlen operandusok (`ADC #n`, `CMP zp`); a
  `poke` egy konstansra vagy `szó` címre közvetlenül tárolódnak.
- A változó indexű tömbök az `base,Y` címzést használják a nulla oldalas mutató
  helyett.
- Amikor egy utasítás az előző utasításban tárolt változó betöltésével kezdődik,
  a redundáns `LDA` kimarad.

Használd az `--asm` kapcsolót a saját programodhoz generált kód megtekintéséhez.

## Ismert korlátozások

| Jellemző                              | Korlátozás                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Egész számtani                        | 8 bites előjel nélküli (0–255); a `word` változók 16 bites értékeket tárolnak                                                                                                                                                                                                                                                              |
| Nulla oldalas költségvetés            | Az állandó nulla oldal az `$02–$4F` (78 bájt): minden változó és sub/fn paraméter 2 bájtot foglal el, minden futó `for` ciklus további 2 bájtot. Az 1.6.4 verzió óta a nem illeszkedő változók automatikusan a RAM-ba kerülnek (lásd *Változók a RAM-ban*); csak szélsőséges esetekben jelenik meg továbbra is a `kiesés a nulla oldalról` |
| Bináris literálok                     | `%01010101` (1.6.4 óta), `$hex` és decimális                                                                                                                                                                                                                                                                                               |
| Alprogramok                           | Nincs rekurzió — A ZP paraméterhelyek statikusan vannak lefoglalva                                                                                                                                                                                                                                                                         |
| Karakterlánc-változók                 | Az `single` / `double` értékek 5 bájtos lebegőpontosak az 1.6.4-es verzió óta (a program által használt rutinok, ~2–5 KB, hozzáadódnak hozzá); az `float` továbbra is Q8.8 (0–255,99)                                                                                                                                                      |
| Unáris mínusz                         | Az 1.6.4 óta a vezető `-` az operandusához kapcsolódik: `-5 - 3` értéke -8 (korábban -(5 - 3) = -2)                                                                                                                                                                                                                                        |
| Karakterlánc-összefűzés futásideje    | A számított értékek változónként egy 80 karakteres pufferben tárolódnak (a hosszabb eredményeket kivágja a rendszer); a karakterlánc-tömb elemértékek 31 karakteres helyeken helyezkednek el; az `&lt;` / `&gt;` sorrend PETSCII bájtsorrendű.                                                                                             |
| `ford()` / `ford(n)`                  | Egyszerű LCG, nem kriptográfiai; periódus = 256 (a lebegőpontos `rnd` egy 32 bites xorshift)                                                                                                                                                                                                                                               |
| `abs()` / `sgn()` / `min()` / `max()` | csak 8 bites értékek; `abs`/`sgn` az értékeket előjelesként kezeli (7. bit = negatív → `abs` kettes komplementer, `sgn` `$FF` értéket ad vissza); `min`/`max` előjel nélküliek (0–255)                                                                                                                                                     |
| `diagram`                             | A tartományon kívüli pixeleket hangtalanul levágja a rendszer (Y ≥ 200 vagy X ≥ 320 → nincs művelet)                                                                                                                                                                                                                                       |
| `mplot`                               | Nincs határérték-ellenőrzés — x-nek 0–159, y-nak 0–199 között kell lennie                                                                                                                                                                                                                                                                  |
| `mline` / `mrect`                     | Többszínű; x: 0–159, y: 0–199. Képernyőn kívüli pixelek tördelése (nincs vágás) – a koordináták a tartományon belül maradnak                                                                                                                                                                                                               |
| `mkör`                                | Többszínű; képernyőn kívüli pontokat vág (x ≥ 160 vagy y ≥ 200 kihagyva)                                                                                                                                                                                                                                                                   |
| `színes toll`                         | Csak felvételek; beállítja az érintett cellák előtérbeli részét (a háttér megmarad). Blokk módban nincs hatása (`plot4`/`circle4`)                                                                                                                                                                                                         |
| `egyenes`                             | Nincs határérték-ellenőrzés — x: 0–319, y: 0–199; x1≤x2 és y1≤y2 nincsenek kikényszerítve (a degenerált/invertált egyenesek nem definiált kimenetet eredményeznek)                                                                                                                                                                         |
| `plot4`                               | Nincs határérték-ellenőrzés — x értékének 0–79, y értékének 0–49 között kell lennie (blokk mód)                                                                                                                                                                                                                                            |
| `kör4`                                | Kivágja a képernyőn kívüli blokkképpontokat; a hasznos sugár nagyjából 0–49 80×50-es blokk módban.                                                                                                                                                                                                                                         |
| `karakter`                            | Nincs PETSCII↔ASCII leképezés — az n értékét változatlanul adja át a CHROUT-nak                                                                                                                                                                                                                                                            |
| `zenelejátszás`                       | `load sid` vagy `tune` blokkot igényel; csak egy CIA1 wrapper kerül kibocsátásra (az utolsó `musicplay` nyer)                                                                                                                                                                                                                              |
| `grafika dupla `-en                   | Csak bérelt példányok; `$4000–$7FFF` karaktereket használ a hátsó pufferhez, így a programkódnak `$4400` alatt kell maradnia; nem kombinálható sprite-okkal vagy többszínűvel                                                                                                                                                              |
| Hibajelentés                          | Csak fordítási időben; a `onerr goto` futási időben kezeli a KERNAL I/O hibákat                                                                                                                                                                                                                                                            |
