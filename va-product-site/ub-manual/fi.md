# Ultimate Basic v1.5.6 — Kieliopas

Täydellinen kieli- ja komentoriviviite Ultimate Basicille, BASICin kaltaiselle
kielelle, joka kääntyy suoraan 6502-konekoodiksi Commodore 64:lle. Tuloste:
`.prg` tiedostot (VICE tai oikea laitteisto), `.crt` kasettikuvat ja `.d64`
levykuvat.

Lyhyen projektin yleiskatsauksen ja rakennusohjeet löydät tiedostosta README.md.

© 2026 Zsolt Tarczali

> `ub`-kääntäjän rakentaminen ja komentorivivalitsimet on käsitelty tiedostossa
> [README.md](README.md). Tämä käyttöohje dokumentoi itse Ultimate Basic
> -kielen.

## Kieliviite

### Muuttujat ja vakiot

**Kaikki muuttujat on ilmoitettava `var`-merkillä ennen käyttöä.**
Määrittämättömän muuttujan käyttäminen lausekkeessa, sijoituksessa,
`for`/`loop`-laskimessa, `inc`/`dec`-, `input`- tai `read`-lauseessa aiheuttaa
käännösaikaisen virheen.

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

Avainsanat ja tunnisteet **kirjainkokoa ei erotella**: `PRINT`, `Print` ja
`print` ovat kaikki kelvollisia.

| Tyyppi                | Leveys           | Muistiinpanoja                                                              |
| --------------------- | ---------------- | --------------------------------------------------------------------------- |
| `int`                 | 8-bittinen       | oletusarvo numeerisille literaaleille                                       |
| `word`                | 16-bittinen      | kaksi ZP-tavua; voidaan käyttää osoitteena `poke`/`peek`-muodossa           |
| `float`               | 16-bittinen Q8.8 | hi-tavu = kokonaislukuosa (0–255), lo-tavu = murtolukuosa                   |
| `string`              | osoitin          | ZP-pari → nollapäätteinen PETSCII koodisegmentissä                          |
| `array(N)`            | N tavua          | tavuelementit; sijaitsee `$C000+`-kohdassa, ei ZP:ssä                       |
| `array_word(N)`       | N×2 tavua        | sanaelementit (16-bittiset); sijaitsee `$C000+`-merkillä, ei ZP-tiedostossa |
| `array(R, C, …)`      | ∏dims tavua      | moniulotteinen (rivi-pääaine); indeksi `arr[r, c]`                          |
| `array_word(R, C, …)` | ∏dims×2 tavua    | moniulotteinen sanataulukko (rivi-pääaine)                                  |

### Varatut sanat

Seuraavat tunnisteet ovat **avainsanoja** – niitä ei voi käyttää muuttujien,
vakioiden, aliohjelmien, funktioiden, parametrien tai otsikoiden niminä. Kaikki
osumat ovat kirjainkokoa riippumattomia (`END`, `end`, `End` kaikki törmäävät).
Varatun sanan käyttäminen nimenä aiheuttaa yleensä hämmentävän virheen
(`var`-rivin määrittely epäonnistuu hiljaisesti tai lauseke, kuten `for i = 1 to
times`, taittuu muotoon `Number(0)`) – joten valitse eri nimi.

**Ilmoitus- ja ohjausvirta** `var`, `const`, `sub`, `fn`, `type`, `endtype`,
`return`, `call`, `label`, `goto`, `gosub`, `if`, `then`, `else`, `end`,
`select`, `case`, `for`, `next`, `loop`, `times`, `to`, `step`, `while`,
`repeat`, `until`, `break`, `continue`, `inc`, `dec`, `bye`, `exit`, `rem`

**Tyypit ja tyyppiin liittyvät** `int`, `word`, `float`, `string`, `array`,
`array_word`

**Tulostus ja I/O** `print`, `spc`, `tab`, `at`, `input`, `chr$`, `str$`, `hex`,
`bin`, `open`, `close`, `load`, `save`, `data`, `read`, `include`, `incbin`
(myös `dec` — yllä mainittu vähennyslauseena; samaa tunnusta käytetään `dec(n,
width)` tulostusmuodolle)

**Sisäänrakennetut matemaattiset ja merkkijonofunktiot** `abs`, `min`, `max`,
`clamp`, `sgn`, `mod`, `rnd`, `sin`, `cos`, `and`, `or`, `xor`, `not`, `bnot`,
`shl`, `shr`, `len`, `asc`, `val`, `str_to_int`, `numstr`

**Muisti ja ajoitus** `poke`, `peek`, `poke16`, `peek16`, `fill`, `memcopy`,
`drawmem`, `wait`, `raster`, `delay`, `sys`, `asm`

**Näyttö ja teksti** `cls`, `fast`, `color`, `text`, `border`, `bg`, `screen`,
`cursor`, `lowercase`, `uppercase`, `display`, `on`, `off`, `scroll`, `speed`,
`badlines`, `turbo`

**Bittikartta- ja lohkografiikka** `graphics`, `gcls`, `flip`, `plot`, `plot4`,
`mplot`, `mline`, `mrect`, `mcircle`, `line`, `circle`, `circle4`, `rect`,
`paint`, `erase`, `pen`, `multi`, `block`

**Spritet** `sprite`, `sprdef`, `sprite_frame`, `sprite_x`, `sprite_y`,
`sprhit`, `sprbghit`, `box_hit`, `chardef`, `charset`, `expand`, `priority`

**Ääni ja musiikki** `sid`, `sound`, `volume`, `music`, `play`, `pause`,
`resume`, `stop`

**Syöttölaitteet** `getch`, `inkey`, `waitkey`, `joy`, `mouse_x`, `mouse_x_hi`,
`mouse_y`, `mouse_btn`

**Keskeytykset ja vektorit** `irq`, `irq_exit`, `nmi`, `nmi_exit`, `cia_timer`,
`onerr`

**Hahmokartat ja -kuvat** `map`, `map_tile`, `map_color`, `koala`, `show`,
`hide`

**REU (RAM-laajennus)** `reu`, `reudet`, `stash`, `fetch`

**Tyylien sudenkuopat — nimet, jotka *näyttävät* vapailta, mutta ovat
varautuneita**

Nämä yleiset englanninkieliset sanat näyttävät viattomilta tunnisteilta, mutta
lekseri on jo poiminut ne. Nimeä uudelleen välttääksesi hiljaisen katkoksen:

| Varattu                                     | Ehdotettu uudelleennimeäminen       |
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

Symbolisia tokeneita (`+ - * / = == != < > <= >= : , ; ( ) [ ] # $ % @`) ei
luonnollisestikaan voida käyttää tunnisteissa.

### Kommentit

```basic
# hash comment
rem this is also a comment
var x = 5  # inline comment
var x = 5 : var y = 6  # colon separates statements on one line
```

### Operaattorit

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

Vertailut: `==` `!=` `<` `>` `<=` `>=` (palauta 1/0)

### Lisäys / Vähennys

```basic
inc x                    # x = x + 1  (INC zp — single instruction)
dec x                    # x = x - 1  (DEC zp — single instruction)
```

For `word` variables carry is handled: `inc` uses `INC lo; BNE skip; INC hi`;
`dec` uses `LDA lo; BNE skip; DEC hi; DEC lo`.

### Yhdistelmätehtävät

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

### Painaa

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

### Haarautuminen

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

`select expr` laskee lausekkeen kerran ja vertaa sitä järjestyksessä kaikkiin
`case` -arvoihin. Ensimmäinen vastaava case-runko suoritetaan ja ohjaus siirtyy
`end` -arvon jälkeen. Valinnainen `else:` -runko suoritetaan, jos mikään tapaus
ei täsmää. Kaikkien arvojen on oltava 8-bittisiä (0–255).

### Silmukat

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

**Suuntasäännöt `for`/`loop`:**

| Case                                                       | Käyttäytyminen                                                                                                                |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `for i = 1 to 10` (oletus `step +1`, `from ≤ to`)          | laskee ylöspäin, vakio                                                                                                        |
| `for i = 0 to 20 step 2` (positiivinen askel, `from ≤ to`) | laskee kahdella ylöspäin                                                                                                      |
| `for i = 10 to 1 step -1` (negatiivinen vakioaskel)        | laskee alaspäin; kappale juoksee ajan i = 10, 9, ..., 1                                                                       |
| `for i = 20 to 0 step -2` (nollasta ylöspäin)              | päättyy kohtaan i = 0 havaitsemalla ADC-alivuoto (C=0) vähennyksen jälkeen; ei loputonta silmukkaa                            |
| `for i = 10 to 1` (ei askelta, `from > to`)                | **käännöksenaikainen virhe**: `for-loop: from (10) > to (1) with default step +1 loops 0 times — use 'step -1' to count down` |

Kääntäjä valitsee lopetushaaran koodauksen käännösaikana vakion `step` etumerkin
perusteella:

- Positiivinen askel (tai oletusarvo `+1`) → poistutaan, kun `var > to`
  (etumerkitön `CMP` + `BCC`/`BEQ` läpimenoaika arvoon `JMP exit`).
- Negatiivinen vakioaskel → poistutaan kun `var < to` (etumerkitön `CMP` + `BCS`
  runkoon), **sekä** jälki-inkrementti `BCS loop_top ; JMP exit`, joka nappaa
  kierroksen, kun `var` alivuodossa on alle 0. Tämä ylimääräinen käskypari pitää
  `for i = N to 0 step -k` äärellisenä.

Muuttuvat `step`-arvot (esim. muuttujasta tai lausekkeesta) käsitellään
positiivisina käännösaikana; jos tarvitset lähtölaskentaa ajonaikaisella
askelarvolla, jaa silmukka tai käytä `while`-rakennetta.

### Otsikot ja siirtyminen

```basic
label main_loop
  x = x + 1
  if x < 10 then goto main_loop end
```

Eteenpäin `goto` (tunniste määritellään myöhemmin) on täysin tuettu.

`gosub label` / `return` hyppää otsikkoon ja palaa takaisin (JSR / RTS
konekielitasolla). Otsikon on oltava `label name`-lauseke, ei `sub` — sillä ei
ole parametreja ja se jakaa saman nollasivuisen laajuuden. `gosub` tukee
eteenpäin suuntautuvia viittauksia (otsikko on määritelty `gosub`-merkin
jälkeen).

```basic
gosub draw_border
...
label draw_border
  # ... draw something ...
  return               # RTS — returns to the instruction after gosub
```

### Aliohjelmat

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

Parametrit välitetään erillisten nollasivuisten paikkojen kautta. Ei rekursiota
(paikat ovat staattisia). Tyypillisiä parametreja tuetaan: `sub draw(x, y:int)`
tai `sub copy(src:string)` — merkkijonoparametrit vastaanottavat 2-tavuisen
osoittimen, jotta kutsuttava voi indeksoida lähdemerkkijonon `src[i]`-osoitteen
kautta.

### Funktiot (paluuarvot)

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

Funktiot tukevat valinnaista `: word`-paluutyyppiä 16-bittisille arvoille:

```basic
fn get_addr(): word
  return $C000
end

var ptr: word = get_addr()  # ptr = $C000
poke ptr, 42                 # STA (ptr),Y — valid indirect addressing
var v = peek(ptr)            # LDA (ptr),Y
```

`fn` lähetetään toisella kierroksella (sama kuin `sub`), joten funktion runkoa
ei koskaan suoriteta käynnistyksen yhteydessä. Eteenpäin suuntautuvia
viittauksia tuetaan täysin.

### Taulukot

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

**Moniulotteiset taulukot** (uusi versiossa 1.5.3)

Taulukot voidaan deklaroida useammalla kuin yhdellä ulottuvuudella. Ne
tallennetaan **rivi-pää**-muodossa ja indeksoidaan pilkulla erotetulla
alaindeksiluettelolla. Kokonaiskoko on kaikkien ulottuvuuksien tulo.

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

Rivi-pääasettelu tarkoittaa, että viimeinen alaindeksi on yhtenäinen: `grid[r,
c]` sijaitsee kohdassa `base + r*COLS + c`. Mitä tahansa määrää ulottuvuuksia
tuetaan (`array(a, b, c)`). Kun jokainen alaindeksi on vakio, osoite taitetaan
käännösaikana yhdeksi absoluuttiseksi tallennus-/latausosoitteeksi;
muuttuja-alaindeksi tuottaa `row*stride + col` -laskennan ja indeksoidun
`(ptr),Y` -käytön. Yksittäisen alaindeksin lisääminen moniulotteiseen taulukkoon
on edelleen sallittu ja sitä käsitellään flat/lineaarisena indeksinä
(`grid[10]`). Ulottuvuuksien on oltava käännösaikaisia vakioita (literaaleja tai
`const`s), ja taulukko on esitettävä ennen sen indeksointia.

**Rakennetyypit (`type ... endtype`, uutta versiossa 1.5.4)**

Määrittele nimettyjen kenttien kiinteä asettelu `type`-metodilla ja varaa sitten
instansseja taulukolle samalla tavalla kuin tavalliselle taulukolle. Kenttien
käyttö käyttää `arr[idx].field`-metodia ja toimii sekä vakio- että muuttuvien
indeksien kanssa.

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

Säännöt ja rajoitukset:

- Kenttätyypit: `int` (1 tavu), `word` (2 tavua LE), `float` (2 tavua Q8.8).
  `string`- ja sisäkkäisiä `type`-kenttiä ei vielä tueta.
- Elementin koko = kenttien leveyksien summa (ilmoitusjärjestys, ilman
  täytettä).
- Tallennustila sijaitsee osoitteessa `$C000+` tavallisten taulukoiden rinnalla,
  ja se näkyy muistikartassa tavallisena kokonaistavukokoisena taulukkona.
- Vakioindeksi → `LDA/STA absolute` käännösaikana.
- Muuttujan indeksi → siirto- ja yhteenlaskukertolasku `idx *
  elem_size`-alueelle, sitten indeksoidaan `(ptr),Y`-käyttö. Kahden potensseja
  (1, 2, 4, 8, 16) vastaavat elementtikoot käyttävät paljaita `ASL A`-ketjuja;
  muut koot lähettävät lyhyen siirto-yhteenlaskusekvenssin kahden tyhjän
  nollasivutavun kautta.
- Rakennetyypin sub-/fn-parametreja ei vielä tueta — välitä niiden sijaan
  taulukko ja indeksi, esim. `sub move(idx: int) ... enemies[idx].x = ...`.
- Oletuskenttien arvot (`var fire: int = 2` tyypin sisällä) jäsennetään
  yhteensopivuuden varmistamiseksi ehdotuksen kanssa, mutta niitä ei vielä
  alusteta allokointivaiheessa.
- Rakennetyyppisessä taulukossa sallitaan vain yksi alaindeksi; moniulotteisia
  rakennetaulukoita ei tueta (käytä laskettua tasaista indeksiä).

Katso `examples/type_demo.ub`.

### 16-bittiset (sana)muuttujat

```basic
var ptr: word = $0400    # two ZP bytes: lo=$00 hi=$04
poke ptr, 6              # STA (ptr),Y
var v = peek(ptr)        # LDA (ptr),Y
```

### Bittikarttagrafiikka

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

Molemmat `graphics on`-variantit tyhjentävät näytön (`LDA $D011 / AND #$EF / STA
$D011`) VIC-rekistereitä vaihdettaessa ja ottavat sen sitten uudelleen käyttöön
kohdetilassa – estäen tilanvaihdon häiriöt.

`x` voi olla koko `0–319`-alue. Yli 255:n koordinaatit käsitellään
automaattisesti (avustaja lisää 9. X-bitin), joten `plot`, `line`, `circle` ja
`rect` ulottuvat kaikki näytön oikeaan reunaan. Käytä `word`-muuttujaa, kun
X-koordinaatti voi ylittää 255:n.

#### Palkkaa piirustusvärin — `color pen`

Hires-tilassa (320×200) väri on **8×8-solukohtainen**, joka säilytetään
videomatriisissa (korkea näppy = etuala, matala näppy = tausta), ei
pikselikohtainen. `color pen c` asettaa pysyvän etualan värin (0–15), jonka
`plot`, `line`, `rect`, `circle` ja `paint` leimaavat jokaisen piirtämänsä
pikselin soluun; solun taustan näppy säilyy. Se pysyy voimassa seuraavaan `color
pen`-kertoihin asti. Oletusarvo on valkoinen (1), joten ohjelmat, jotka eivät
koskaan kutsu `color pen`-funktiota, näyttävät täsmälleen samalta kuin ennen.

```basic
graphics on
gcls
color pen 2              # red
line 0, 0, 100, 100
color pen 6              # blue
circle 160, 100, 40
display on
```

#### Moniväriset muodot — `mline` / `mrect` / `mcircle`

Moniväritilassa (`graphics on multi`, 160×200) jokainen pikseli valitsee yhden
neljästä värilähteestä 2-bittisen arvon kautta (`%00` background `$D021`, `%01`
screen hi nibble, `%10` screen lo nibble, `%11` color RAM). `mplot` asettaa
yhden tällaisen pikselin; `mline`, `mrect` ja `mcircle` piirtävät muotoja
samalla tavalla — seuraava `color` argumentti on 2-bittinen lähde (0-3), ja
varsinaiset värit tulevat solupaletista (screen / color RAM) täsmälleen kuten
`mplot`-tilassa.

```basic
graphics on multi
gcls
mcircle 80, 100, 40, 1
mrect 10, 10, 150, 190, 2
mline 0, 0, 159, 199, 3
display on
```

`mline`/`mrect`/`mcircle` käyttävät samoja Bresenham / keskipiste -rutiineja
kuin vastaavat rutiinit piirtämällä jokaisen pikselin `mplot`:n kautta; näytön
ulkopuoliset pisteet (x ≥ 160 tai y ≥ 200) ohitetaan.

### Kaksoispuskuroitu bittikartta (välkkymätön)

```basic
graphics on double       # double-buffered hires bitmap (320×200)
gcls                     # clears the HIDDEN back buffer
line 0, 0, 319, 199      # all drawing (plot/line/circle/rect/paint/gcls) goes to the back buffer
flip                     # show the drawn buffer; redirect drawing to the other one
graphics off             # back to text mode (restores VIC bank 0)
```

`graphics on double` säilyttää **kaksi** valmista palkattua bittikarttaa ja
näyttää vain valmiit ruudut, mikä poistaa välkkymisen ilman XOR-kikkoja —
jokaisen ruudun `gcls` piirrät ja sitten `flip`.

| Puskuri                       | Bittikartta | Videomatriisi | VIC-pankki | `$DD00` matalat bitit |
| ----------------------------- | ----------- | ------------- | ---------- | --------------------- |
| A (edestä, ensin kuvassa)     | `$2000`     | `$0400`       | pankki 0   | `%11`                 |
| B (takaosa, piirretään ensin) | `$6000`     | `$4400`       | pankki 1   | `%10`                 |

* Kaikki pikselikomennot kirjoittavat ajonaikaisen **piirtokanta-asteikon**
  (nollasivutavun) kautta, joten ne kohdistavat automaattisesti siihen
  puskuriin, joka on kulloinkin piilossa.
* `flip` odottaa alareunaa (rasteri ≥ 251) ennen VIC-pankin vaihtamista, jotta
  vaihto tapahtuu **repeämättä**, ja osoittaa sitten piirtopohjan nyt
  piilotettuun puskuriin.
* Tyypillinen silmukka: `gcls` → piirrä kehys → `flip`. Kutsu `display
  on`-funktiota kerran ensimmäisen `flip`-funktion jälkeen, joten ensimmäinen
  näytetty puskuri on jo valmis.

**Vaatimukset / rajoitukset:**
* Vain palkatut (ei `multi`). Spritejä ei noudeta takapuskurin VIC-pankista.
* Takapuskuri käyttää `$4000–$7FFF` (matriisi `$4400`, bittikartta
  `$6000–$7FFF`), joten ohjelman konekielen on pysyttävä `$4400`-koon
  alapuolella. Useimmat demot ovat vain muutaman kilotavun kokoisia, joten tämä
  on automaattista; erittäin suuret ohjelmat eivät voi käyttää
  kaksoispuskurointia.
* Vakiomallisella 1 MHz:n C64-prosessorilla täysi kehyskohtainen `gcls` (8 kt)
  rajoittaa kehyspäivitysnopeutta; Commodore 64 Ultimatessa se nostetaan `speed`
  sulavaa korkean nopeuden animaatiota varten.

Katso `examples/cube_demo.ub` — pyörivä 3D-lankamallikuutio, joka on renderöity
välkkymättömäksi.

### Lohkografiikka (80×50)

```basic
graphics on block        # 80×50 block-pixel mode (text mode + custom 4-pixel charset @ $2800)
graphics off             # return to text mode
gcls                     # clear block playfield: screen RAM $0400-$07FF + color RAM $D800-$DBFF

plot4 x, y               # set block pixel at (x, y);  x: 0-79, y: 0-49
plot4 erase x, y         # clear block pixel at (x, y)
circle4 x, y, r          # draw midpoint circle in block pixels; clips to 80×50
```

Paksu, matalan resoluution tila kerrostettuna standardin 40×25 tekstin päälle.
16 merkin mukautettu merkistö, joka on kopioitu `$2800`-soluun, koodaa 2×2
neljännesruudukon merkkiä kohden (bit3=TL, bit2=TR, bit1=BL, bit0=BR), joten
jokainen tekstisolu sisältää 2×2 lohkopikseliä → tehokas 80×50 ruudukko.
Bittikarttamuistia ei käytetä (`$2000-$3FFF` pysyy vapaana), mikä tekee siitä
nopeamman kuin bittikartan vuokraaminen. `plot4` TAI lisää neljännesbitin
soluun, jolloin päällekkäiset pikselit kertyvät; `plot4 erase` tyhjentää sen.
`circle4` käyttää samaa lohkopikseliapua piirtääkseen ääriviivaympyrän 80×50
koordinaattiavaruuteen. `gcls` tyhjentää sekä näyttö- että väri-RAM-muistin.
Katso `examples/block_demo.ub`.

### Näyttö ja väri

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

`lowercase` lähettää `LDA #$0E; JSR $FFD2` ajonaikana. `lowercase` jälkeen
käännetyillä merkkijonoliteraaleilla kirjainkoko vaihdetaan automaattisesti —
isot lähdekoodit tallennetaan PETSCII:n pienten kirjainten paikkaan (`$61+`) ja
pienet lähdekoodit isojen kirjainten paikkaan (`$41+`) — joten `"Hello World"`
lähdekoodi näkyy näytöllä muodossa **Hei maailma**. `uppercase` lähettää `LDA
#$8E; JSR $FFD2` ja palaa suoraan merkistöasetukseen. `cls` **ei** nollaa
merkistötilaa.

`scroll x n` kirjoittaa `(n AND 7)` bitit 0-2 kohtaan `$D016` (säilyttäen bitit
3-7). `scroll x n narrow` kirjoittaa hienovieritysbitit ja tyhjentää `$D016`
bitin 3 (38-sarakkeinen tila). `scroll x n wide` kirjoittaa hienovieritysbitit
ja asettaa `$D016` bitin 3 (40-sarakkeinen tila). `scroll y n` kirjoittaa `(n
AND 7)` bitit 0-2 kohtaan `$D011` (säilyttäen bitit 3-7). `scroll row R left`
siirtää yhden vakionäyttörivin vasemmalle; kirjoita uusi oikeanpuoleisin merkki
`screen 39, R, ch`-merkillä. Hyödyllinen sujuvaan laitteistovieritykseen:
vähennä jokaisen kehyksen arvoa 7:stä 0:aan, siirrä näytön RAM-muistia, palauta
arvoon 7.

`screen col, row, char [, color]` kirjoittaa suoraan näyttömuistiin (`$0400 +
row*40 + col`) ja valinnaisesti värimuistiin (`$D800 + row*40 + col`). Vakio
sara/rivi: osoite lasketaan käännösaikana.

### Ultimate 64 — Suorittimen nopeus

```basic
speed 4              # set CPU to 4 MHz  (reads $D031, updates bits 0-3, writes back)
speed 48             # 48 MHz  (maximum speed on U64)
speed max            # same as speed 48  (alias)
speed off            # back to 1 MHz  (alias for speed 1)

badlines on          # enable badline timing  ($D031 bit 7 = 0, default C64 behaviour)
badlines off         # disable badline timing ($D031 bit 7 = 1, more CPU cycles)

var t = turbo()      # 1 if turbo is active (bits 0-3 of $D031 != 0), 0 if at 1 MHz
```

Käytettävissä olevat MHz-arvot: `1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 20, 24,
32, 40, 48`. Vakiot pyöristetään alaspäin lähimpään käännösaikana käytettävissä
olevaan nopeuteen. Muuttujien arvoja käsitellään raakana nopeusindeksinä (0–15)
ja ne TAI-operaattorilla lisätään `$D031`-muuttujan biteille 0–3.

| $D031 index | MHz (U64) | MHz (U64 Elite-II) |
| ----------- | --------- | ------------------ |
| 0           | 1         | 1                  |
| 3           | 4         | 4                  |
| 6           | 8         | 10                 |
| 11          | 20        | 24                 |
| 15          | 48        | 64                 |

Vaatii **U64 Turbo Control** -asetuksen olevan `U64 Turbo Registers` tai `Turbo
Enable Bit` U64-määritysvalikossa. Tavallisessa C64:ssä tai emulaattorissa,
jossa ei ole rekisteriä, `poke` - `$D031` ohitetaan hiljaa.

### Näppäimistö

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

`mouse_x()` / `mouse_y()` ajavat sisäisesti apuohjelman, joka käsittelee: CIA1
`$DC00` kondensaattorin latauksen, ~516 jakson viiveen, SID POT X/Y-rekisterin
lukemisen (`$D419`/`$D41A`), etumerkityn 7-bittisen delta-laskennan, Y-akselin
`EOR #$FF` inversion ja kertyneen sijainnin seurannan (pysyvä ZP-tila, 8 tavua).
Apuohjelma ottaa POT-näytteitä kahdesti kehystä kohden. `mouse_y()` **ei** kutsu
apuohjelmaa (vain `mouse_x()` kutsuu) — se vain lukee välimuistissa olevan
`accum_y` tiedoston välttääkseen kaksinkertaisen päivityksen.

Apuohjelma ylläpitää 9-bittistä X-akkumulaattoria (`accum_x` + `accum_x_hi`
carry/borrow-operaattorilla). Käytä `var sx: word = mouse_x()` — kääntäjä
tallentaa sekä lo- että hi-tavut, joten `sprite` -komento käsittelee `$D010`
oikein X-positioissa 255 jälkeen.

Apuohjelma tallentaa tilansa ZP:hen (`$02`–`$09`). Init-lipun on oltava nolla
ennen ensimmäistä kutsua – nollaa alue `fill $02, 7, 0` -merkillä ohjelman
alkuvaiheessa. Poista myös CIA1-keskeytykset käytöstä (`poke $DC0D, $7F`)
estääksesi KERNAL IRQ:n koskettamasta `$DC00` -merkkiä näppäimistöskannauksen
aikana – mikä häiritsee POT-lukemaa.

Katso `examples/mouse_demo.ub` toimivan 1351-hiiren demon, jossa on
sprite-seuranta ja painikepalaute.

### Uloskäynti

```basic
bye                      # JSR $E544 (clear screen), clear STOP flag, RTS to BASIC
exit                     # alias for bye
```

### Ajoitus

```basic
wait 50                  # wait 50 raster-line transitions (~3.2 ms)
wait raster 100          # spin until $D012 == 100 (raster-split effects)
delay 1                  # wait 1 PAL frame (1/50 s ≈ 20 ms)
delay 20                 # wait 20 frames ≈ 0.4 s; n can be a variable (0–255)
```

`delay N` laskee N kokonaista PAL-kehystä käyttäen rasteriviivaa 200 kehyksen
rajana.

### SID-ääni

```basic
sound 0, $1CAD, 25       # voice 0, freq $1CAD (≈ middle C PAL), 25 frames duration
sound 1, freq_word, 50   # voice 1, freq from word var, 50 frames (1 s at 50 Hz)
sound 2, 0, 0            # voice 2, silence

sid volume 15            # master volume full ($D418 = $0F); range 0-15
sid volume 0             # silence (master volume = 0)
sid stop                 # zero all 25 SID registers ($D400–$D418) — complete silence
```

`sound <channel>, <freq>, <duration>` — kesto PAL-kehyksissä (1/50 s kukin).
Kiinteä ADSR: attack/decay `$09`, sustain/release `$F0`, sahaaaltomuoto.
Äänenvoimakkuuden pääasetus `$D418` aina arvoon `$0F`.

`sid volume N` kirjoittaa N:n `$D418`:iin. Bitit 0–3 = äänenvoimakkuus (0–15),
bitit 4–7 = suodatustila. `sid stop` lähettää 10 tavun pituisen
nollatäyttösilmukan – nopeammin kuin 25 yksittäistä työntöä.

### Musiikin toisto

`music play/stop/pause/resume` on korkean tason vaihtoehto manuaaliselle `sys
sid_init` / `cia_timer` -määritykselle. Vaatii edeltävän `load sid` -lausekkeen
(määrittelee `sid_init` / `sid_play`).

```basic
load sid "tune.sid"         # embed SID file (defines sid_init / sid_play)

music play                  # initialise sub-tune 0 + start CIA1 50 Hz IRQ
music play 1                # start from sub-tune 1 (song number 0-based)
music stop                  # stop playback + zero all 25 SID registers ($D400-$D418)
music pause                 # disable CIA1 timer A IRQ (music freezes, SID unchanged)
music resume                # re-enable CIA1 timer A IRQ (continues from pause point)
```

| Lausunto         | Vaikutus                                                                                                  |
| ---------------- | --------------------------------------------------------------------------------------------------------- |
| `music play [n]` | Soita `sid_init(n)`-osoitteeseen, konfiguroi CIA1-ajastin A 19 656 sykliin (~50 Hz PAL), asenna IRQ-kääre |
| `music stop`     | Poista CIA1 IRQ käytöstä + nollaa kaikki 25 SID-rekisteriä                                                |
| `music pause`    | poista CIA1 IRQ käytöstä (SID-lähtö pysyy jäädytettynä)                                                   |
| `music resume`   | ota CIA1 IRQ uudelleen käyttöön (jatkuu taukokohdasta)                                                    |

IRQ-kääre (lähetetään kerran ohjelman lopussa) tekee seuraavaa: ACK CIA1-ajastin
A → `JSR sid_play` → `JMP $EA81`.

### Spritet

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

X tukee koko 9-bittistä aluetta (0–319): käytä `word`-muuttujaa ajonaikaisille
arvoille > 255. Sprite-dataosoitin: `data_addr` on oltava 64-tavuisesti tasattu;
tallennetaan muodossa `addr >> 6` kohtaan `$07F8+id`.

#### Sprite animation with `sprite_frame`

`sprite_frame` on komento, jota käytetään спрайtin näytettävän kuvan
muuttamiseen animaation aikana. Se muuttaa vain спрайtin dataosoitinta; se
**ei** siirrä спрайttiä, ota sitä käyttöön tai siirrä kuvia eteenpäin
automaattisesti.

Tallenna animaatiokuvat peräkkäin siten, että jokainen 63-tavuinen sprite-kuva
käyttää yhtä 64-tavuista tasattua paikkaa. Anna nollapohjainen animaatiokehys
kolmantena argumenttina:

```basic
sprite_frame sprite_id, ensimmäisen_kehyksen_osoite, kehyksen_numero
```

Esimerkiksi, jos perusosoite on `$2000`, kehys 0 käyttää `$2000`, kehys 1
käyttää `$2040`, kehys 2 käyttää `$2080` ja niin edelleen. Ohjelma ohjaa
animaation ajoitusta ja rivitystä:

```basic
var frame = 0
loop
  sprite_frame 0, $2000, frame
  frame = frame + 1
  if frame == 4 then frame = 0 end
  delay 5
end
```

Kaksiargumenttinen muoto, `sprite_frame id, address`, valitsee yhden staattisen
спрайтkuvan ja pysyy taaksepäin yhteensopivana. спрайтkuvan sijaintia kontrolloi
edelleen `sprite id,x,y`.

### Ohjelmiston rajaavan laatikon törmäys

```basic
var touching = box_hit(left1, top1, right1, bottom1,
                       left2, top2, right2, bottom2)
```

`box_hit()` suorittaa akselin suuntaisen rajaavan laatikon (AABB) testin ja
palauttaa arvon `1`, kun kaksi suorakulmiota ovat päällekkäin tai koskettavat
toisiaan, muuten `0`. Toisin kuin `sprite_hit()` ja `sprite_bg_hit()`, se ei lue
tai tyhjennä VIC-II-törmäysrekistereitä. Kahdeksan argumenttia ovat
mielivaltaisia 8-bittisiä lausekkeita, joten laatikot voivat olla pienempiä kuin
näkyvä sprite-kuvitus tai ne voivat kuvata muita kuin sprite-peliobjekteja.
Koordinaatit ovat osallistavia; säilytä `left <= right` ja `top <= bottom`.

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

`sprdef id ... end` upottaa 63 sprite-tavua koodisegmentin seuraavaan 64-tavun
tasaamaan osoitteeseen, lähettää niiden päälle `JMP`-merkin ja asettaa
automaattisesti `$07F8+id = data_addr >> 6`-merkin. Jos haluat käyttää samaa
muotoa useille spriteille, lue osoitin takaisin:

```basic
var pg = peek($07F8)   # pointer set by sprdef 0
poke $07F9, pg         # copy to sprites 1–7
```

### Hahmolaattakartat (`.ubmap`)

```basic
map load "levels/world.ubmap"
map draw map_x, map_y       # draw a 40x25 viewport to screen/color RAM

var tile = map_tile(x, y)   # read character code from the map
map set x, y, 42            # change character code in writable map data

var shade = map_color(x, y) # read cell color (0 when map has no color data)
map color x, y, 7           # change cell color when color data is present
```

`map load` selvittää tiedostonimen suhteessa `.ub`-lähdetiedostoon, validoi sen
käännösaikana ja upottaa sen merkkijonot ja valinnaiset väritaulukot
kirjoitettavaan ohjelman RAM-muistiin. Myöhempi `map load` korvaa aktiivisen
kartan seuraavia karttakomentoja varten.

`map load` hyväksyy myös suoraan VisualAssembler `me-map` `.bin` -viennin:

```basic
kartan lataus "map-multicolor.bin"
```

Ensimmäisistä 1000 tavusta tulee 40×25 merkistökartta ja seuraavista 1000
tavusta tulee solujen värejä. Monivärinen tila ja `$D021-$D023` luetaan
VisualAssemblerin metadatan trailerista, joten `.ubmap`-muunnosta ei tarvita.

`map draw map_x, map_y` kopioi 40×25-kokoisen näyttöalueen määritetystä
karttasolusta alkaen näyttömuistiin `$0400` ja värimuistiin, jos sellainen on,
`$D800`. Kartan on sisällettävä koko pyydetty näyttöalue: säilytä `map_x <=
width-40` ja `map_y <= height-25`. Koordinaatit ja mitat ovat tällä hetkellä
8-bittisiä (0–255).

Normaalit kartat tyhjentävät tekstin moniväribitin `$D016`-solussa.
Monivärikartat asettavat sen ja lataavat kolme globaalia väriään solujen
`$D021`, `$D022` ja `$D023` solujen välillä. Merkistökartat sisältävät
merkkikoodeja, eivät merkistöpikseleitä; voit yhdistää ne
`charset`/`chardef`-menetelmään tai muuhun merkistöjen latausmenetelmään.
Moniväritekstitilassa solujen värit 8–15 valitsevat moniväriset merkit
VIC-II-sääntöjen mukaisesti.

#### UBMP-version 1 binäärimuoto

Kaikki monitavuiset kokonaisluvut ovat little-endian-tyyppisiä:

|  Offset |             Koko | Merkitys                                                                 |
| ------: | ---------------: | ------------------------------------------------------------------------ |
|       0 |                4 | ASCII-taikaa `UBMP`                                                      |
|       4 |                1 | Versio, tällä hetkellä `1`                                               |
|       5 |                1 | Liput: bitti 0 = väritaulukko käytössä, bitti 1 = monivärinen tekstitila |
|       6 |                2 | Kartan leveys, 1–255 solua                                               |
|       8 |                2 | Kartan korkeus, 1–255 solua                                              |
|      10 |                1 | Tausta 0 (`$D021`), käytetty vähän naposteltavaa                         |
|      11 |                1 | Monivärinen 1 (`$D022`), käytetty vähän naposteltavaa                    |
|      12 |                1 | Monivärinen 2 (`$D023`), käytetty vähän naposteltavaa                    |
|      13 | leveys × korkeus | Rivi-päämerkkikoodit                                                     |
| jälkeen | leveys × korkeus | Valinnaiset rivin päävärin napostelut, kun lipun bitti 0 on asetettu     |

UBMP-tiedoston pituuden on oltava täsmälleen sama kuin sen otsikkokoodissa
ilmoitetaan. Virheellinen magic-arvo, versio, dimensiot tai pituus aiheuttavat
käännösaikavirheen.

### Koala Painter -kuvien tuonti

```basic
koala load "pictures/title.kla"  # validate and embed at compile time
koala show                       # enter bitmap multicolor mode
koala hide                       # return to the default text display
```

`koala load` hyväksyy joko 10003 tavun pituisen Koala-tiedoston (`$6000`
latausosoite plus 10001 datatavua) tai raa'an 10001 tavun pituisen hyötykuorman.
Polut ovat suhteellisia `.ub` tiedostoon nähden. Hyötykuorma sisältää 8000
bittikarttatavua, 1000 näyttötavua, 1000 väripalaa ja yhden taustaväritavun.

Kääntäjä tallentaa sen kohtaan `$6000-$8710`. `koala show` kopioi bittikartan
kohtaan `$2000`, näyttömatriisin kohtaan `$0400`, värit kohtaan `$D800` ja ottaa
käyttöön bittikartan monivärisen tilan. `koala hide` tyhjentää
bittikartta-/monivärisen tilan ja palauttaa oletusarvoisen tekstiasettelun.

Luodun koodin ja apuohjelmien on päätyttävä alle `$2000`-arvon, koska näytetty
bittikartta korvaa `$2000-$3F3F`-arvon; muuten kääntäjä ilmoittaa virheestä.
Koala-tuontia ei voi tällä hetkellä yhdistää `load sid`-arvon kanssa samassa
ohjelmassa.

### Mukautettu merkistö

```basic
charset $3800            # set base address for chardef (default $3800)

chardef 65               # redefine character 65 ('A')
  $18,$3C,$66,$7E,$66,$66,$66,$00
end

chardef 66               # fewer than 8 bytes are zero-padded
  $7C,$66,$7C,$66,$7C
end
```

`charset base` asettaa kohdeosoitteen, jota käytetään kaikissa myöhemmissä
`chardef` -lausekkeissa. `chardef id ... end` upottaa 8 tavua koodisegmenttiin
(jota edeltää `JMP` ohittaakseen ne) ja kopioi ne sitten osoitteeseen
`charset_base + id*8` ajon aikana. Arvojen on oltava käännösaikaisia vakioita;
käytä `%` binääriliteraaleille (`%00011000`).

Voit aktivoida mukautetun merkistöä VIC-II:ssa asettamalla merkkigeneraattorin
osoitteen `$D018`-määrityksellä:
```basic
charset $3800
chardef 1  $FF,$81,$81,$81,$81,$81,$81,$FF  end  # box border
poke $D018, $1A     # screen at $0400, charset at $3800 (bank 0)
```

### Muisti

```basic
poke $D020, 2            # STA $D020
poke addr_var, 6         # STA (addr_var),Y  — if addr_var is word type
var v = peek($D012)      # LDA $D012
var v = peek(addr_var)   # LDA (addr_var),Y  — if addr_var is word type

var w: word = peek16($C000)   # read 16-bit little-endian: lo=$C000, hi=$C001
poke16 $0314, $EA81           # write 16-bit little-endian: lo→$0314, hi→$0315
poke16 ptr, w                 # word var as address; word var as value
```

`peek16(addr)` lukee kaksi peräkkäistä tavua (lo, hi) `word`-muodossa. `poke16`
kirjoittaa ensin lo ja sitten hi.

### Levyn I/O

```basic
load "PROGRAM"           # KERNAL LOAD: loads file from device 8 to its native address
load "DATA", $C000       # loads file to a specific address
load "DATA", ptr         # addr from word variable

save "DATA", $C000, 4096 # KERNAL SAVE from $C000, 4096 bytes → device 8
save "PROG", start, len  # addr and len from word/int variables
```

`load` kutsuu KERNAL-käskyä `SETNAM`+`SETLFS`+`LOAD` (`$FFBD`/`$FFBA`/`$FFD5`).
Ilman osoitetta: toissijainen osoite 0 (tiedoston oma 2-tavuinen otsikko
käytetään latausosoitteena). Osoitteen kanssa: toissijainen osoite 1 (tiedosto
ladataan määritettyyn sijaintiin). `save` kutsuu `SETNAM`+`SETLFS`+`SAVE`
(`$FFBD`/`$FFBA`/`$FFD8`). Vaatii sekä `addr` että `len`.

### SID-musiikki

```basic
load sid "tune.sid"            # embed SID music at its native load address
load sid "tune.sid", $2000     # override: embed at $2000 regardless of SID header
```

`load sid` lukee PSID- tai RSID-tiedoston **käännöksen aikana**, poistaa otsikon
ja lisää raakatuota musiikkiin tulosteen `.prg` jälkeen. `load sid` jälkeen
käytettävissä on kaksi käännösaikaista vakiota:

| Vakio      | Kuvaus                                                                         |
| ---------- | ------------------------------------------------------------------------------ |
| `sid_init` | Init-rutiinin osoite — kutsu kerran, jossa A = kappaleen numero (0-pohjainen)  |
| `sid_play` | Toista rutiinin osoite — kutsu jokaista kehystä (50 Hz PAL) IRQ-käsittelijältä |

Molemmat vakiot toimivat kaikkialla, missä vakio-osoite hyväksytään: `sys`,
`irq`, `poke`, lausekkeet.

**Tyypillinen käyttö:**

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

**Huomautuksia:**
- SID-tiedot sijoitetaan kaiken luodun koodin **jälkeen**, ja ne täytetään
  nollilla latausosoitteeseen asti. Kääntäjä varoittaa, jos SID:n latausosoite
  menee päällekkäin luodun koodin kanssa.
- PSID-versioita 1 ja 2 tuetaan. Jos SID-otsikon latausosoite on 0, kahta
  ensimmäistä datatavua käytetään osoitteena (PRG-tyylinen, little-endian).
- Vain yksi `load sid` ohjelmaa kohden on merkityksellinen (viimeinen voittaa).

### Sarjakanavan tiedosto I/O

```basic
open 1, 8, 2, "MYFILE"  # open logical file 1, device 8, secondary 2, name "MYFILE"
open 2, 4, 7             # open printer (device 4), no filename
open ch, dev, sec        # channel, device, secondary from variables

print# 1, "HELLO"        # send "HELLO"+CR to logical file 1
print# ch, x, "text"     # any mix of vars, strings — same as print but to file

close 1                  # close logical file 1
close ch                 # channel from variable
```

`open` kutsuu `SETNAM` ($FFBD) + `SETLFS` ($FFBA) + `OPEN` ($FFC0). Ilman
tiedostonimeä kutsutaan SETNAM-metodia, jonka pituus on 0. `print#` reitittää
tulosteen `CHKOUT` ($FFC9) kautta, CHROUT per merkki (+ lopun CR) ja sitten
`CLRCHN` ($FFCC). `close` asettaa kanavanumeron A:han ja kutsuu `CLOSE` ($FFC3).

### Input

```basic
input score              # read up to 3 digits from keyboard → 8-bit int var
input "Name: ", name     # optional prompt string, then read line → string var
input "Score: ", score   # prompt + int input
```

`input` käyttää KERNAL BASINia (`$FFCF`) kaiutetun linjatulon estoon DEL-tuella.
- **Int-muuttuja**: hyväksyy vain `0`–`9`, enintään 3 merkkiä; muuntaa
  8-bittiseksi arvoksi CR:ssä.
- **Merkkijonomuuttuja**: hyväksyy enintään 30 merkkiä; tallentaa
  null-päätteisenä merkkijonona; ZP-pari päivitetään.

### Liukuluku / Kiinteäpisteinen

`float`-muuttujat käyttävät Q8.8-kiintolukumuotoa: korkeampi tavu on
kokonaislukuosa (0–255) ja alempi tavu on desimaaliosa (0/256 … 255/256).

```basic
var f: float = 3.5       # 3.5 → hi=3, lo=128 (= 0x0380)
var g: float = 0         # integer 0 is promoted to 0.0 automatically

f = 1.5                  # Q8.8 literal assignment
f = f + 1.5              # 16-bit Q8.8 arithmetic (result: 3.0)
f = f + g                # float + float

var n = int(f)           # extract integer part (hi byte) → 8-bit int
print f                  # prints as "N.DD" (e.g. 3.5 → "3.50", 1.25 → "1.25")
```

| Käyttö              | Esimerkki            | Muistiinpanoja                                |
| ------------------- | -------------------- | --------------------------------------------- |
| Kirjaimellinen      | `3.5`, `0.25`, `1.0` | jäsennetty Q8.8:ksi käännösaikana             |
| Kokonaislukuylennys | `f = 5`              | myymälät 5.0 (korkea=5, matala=0)             |
| Lisää/tilaa         | `f + 1.5`, `f - g`   | 16-bittinen Q8.8-aritmeettinen                |
| Poimi kokonaisluku  | `int(f)`             | palauttaa hi-tavun 8-bittisenä kokonaislukuna |
| Painaa              | `print f`            | muoto "N.DD", aina 2 desimaalilukua           |

**Varoitus:** Aritmeettinen ylivuoto päättyy kohtaan 255.255 (ei saturaatiota).
Kahden liukulukumuuttujan kerto- ja jakolaskuja ei vielä tueta – käytä näissä
tapauksissa `int()` + kokonaislukuaritmetiikkaa.

### Matemaattiset funktiot

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

### Merkkijonofunktiot

```basic
var n = len(msg)         # length of null-terminated string var (0–255)
var c = asc(msg)         # PETSCII code of first character (0 if empty)
var c = asc("A")         # compile-time: constant PETSCII code
var n = val(s)           # runtime: parse decimal PETSCII string → 8-bit int (e.g. "042" → 42)
var c = msg[i]           # string character at index i: PETSCII code of msg[i]
msg[i] = c               # write PETSCII byte c to string at index i — STA (ptr),Y
msg[0] = 72              # constant index → LDY #0; STA (ptr),Y
```

### Numeroiden muotoilu

```basic
print hex(n)             # print as 2-digit uppercase hex
print bin(n)             # print as 8-bit binary string
print dec(n, 4)          # right-justified decimal in a field of 4 chars (e.g. 42 → "  42")
print dec(n, width)      # width can also be a variable
```

`dec(n, width)` täyttää vasemmalla olevan luvun välilyönneillä, jotka täyttävät
`width` merkit. Jos luvussa on enemmän numeroita kuin `width`, se tulostetaan
ilman täyttöä (ei katkaisua). Muissa kuin tulostusyhteyksissä `dec(n, w)`
arvoksi saadaan `n` muuttumattomana (sama kuin `hex`/`bin`).

### REU (RAM-laajennusyksikkö)

```basic
var ok = reu_present()   # 1 if REU detected, 0 if not (write/read test on $DF04)
var ok = reudet()        # alias for reu_present()

reu stash c64addr, bank, reu_addr, len  # copy C64 → REU
reu fetch c64addr, bank, reu_addr, len  # copy REU → C64
reu swap  c64addr, bank, reu_addr, len  # swap between C64 and REU
```

`reu_present()` suorittaa kirjoitus-/lukutestin REU-rekisterille `$DF04`. Ilman
REU:ta kirjoitus menetetään (avoin väylä), joten luku toimii eri tavalla — se
havaitsee läsnäolon luotettavasti koskematta mihinkään sivuvaikutteiseen
komentorekisteriin.

| Parametri  | Leveys      | Muistiinpanoja                                                             |
| ---------- | ----------- | -------------------------------------------------------------------------- |
| `c64addr`  | 16-bittinen | C64 RAM-muistin käynnistys — vakio, `word` muuttuja tai 8-bittinen lauseke |
| `bank`     | 8-bittinen  | REU-pankkinumero (0–7 512 kt:n yksikölle)                                  |
| `reu_addr` | 16-bittinen | Vastasiirto REU-pankin sisällä                                             |
| `len`      | 16-bittinen | Siirrettäviä tavuja (`0` = 65 536 REU-laitteistossa)                       |

REU-rekisterit: `$DF01` komento (`$B0` stash / `$B1` fetch / `$B2` swap),
`$DF02–$DF03` C64-osoite, `$DF04–$DF05` REU-offset, `$DF06` bank, `$DF07–$DF08`
pituus. Tiedonsiirto on synkroninen (suoritin pysäytetty DMA:n aikana). Vaatii
oikean REU:n tai VICE:n: **Asetukset → Laitteisto → RAM-laajennusmoduuli**.

### Muistiapuohjelmat

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

Sekä `fill` että `memcopy` tukevat 16-bittisiä pituuksia (0–65535). Käytä
`word`-muuttujia, jos pituudet ovat > 255.

`drawmem src, dst, width, height, stride` kopioi kaksiulotteisen suorakaiteen
muotoisen lohkon. `src` luetaan lineaarisesti (pakatut rivit); `dst` etenee
`stride` tavua rivien välillä — käytä `40` (28 dollaria) C64-näytölle tai
väri-RAM-muistille (40 saraketta). Leveys, korkeus ja askelmäärä ovat kaikki
8-bittisiä arvoja. `src` ja `dst` voivat olla vakioita, `word` muuttujia tai
8-bittisiä lausekkeita.

### Rasteri-IRQ

```basic
irq my_handler           # raster IRQ at line 0, handler = sub name or address
irq my_handler, 100      # raster IRQ at raster line 100
irq $C800, 200           # handler at fixed address
irq addr_word            # handler address from a word variable
```

Asettaa rasteri-IRQ:n BASIC-ohjelmistovektorin (`$0314`/`$0315`) kautta):
poistaa CIA1-ajastimen IRQ:n käytöstä, kuittaa odottavat VIC-IRQ:t, kirjoittaa
rasteririvin kohtaan `$D012`, ottaa VIC-rasteri-IRQ:n käyttöön (`$D01A=$01`),
kirjoittaa käsittelijän osoitteen ja ottaa keskeytykset uudelleen käyttöön.

Käsittelijän **täytyy** päättyä `sys $EA81` (KERNAL-IRQ:n loppuosa) — pelkkä
`RTS` tai `RTI` korruptoi pinon. Kuittaa VIC-IRQ ensin:

```basic
sub my_handler()
  poke $D019, $FF      # ACK VIC IRQ
  # ... work here ...
  sys $EA81            # JMP to KERNAL end-of-IRQ
end
```

Eteenpäin viittauksia tuetaan (`irq my_handler` ennen kuin ali on määritelty).

### NMI-käsittelijä

```basic
nmi my_nmi               # set NMI vector $0318/$0319 to handler sub or address

sub my_nmi()
  # ... NMI work here ...
  nmi_exit               # JMP $FE47 — proper NMI exit (restores A/X/Y + RTI)
end
```

`nmi handler` kirjoittaa käsittelijän osoitteen NMI-pehmeään vektoriin
(`$0318`/`$0319`). Laitteiston NMI-vektori kohdassa `$FFFA` osoittaa KERNAL NMI
-rutiiniin, joka haarautuu `$0318`:n kautta. Käsittelijän **täytyy** päättyä
`nmi_exit` (päättyy `JMP $FE47`) — pelkän `RTI`:n käyttö korruptoi pinon.
Eteenpäin viittaukset tuettuja.

### CIA1-ajastimen keskeytys

```basic
cia_timer 19656, my_handler   # CIA1 timer A: fires every 19656 cycles (~50 Hz PAL)
cia_timer period, handler      # period can be a variable or expression
```

Asettaa CIA1-ajastimen A jaksolliseksi IRQ-lähteeksi BASIC-ohjelmistovektorin
(`$0314`/`$0315`) kautta):
1. SEI — poista keskeytykset käytöstä
2. `$DC0D = $7F` — poista kaikki CIA1-IRQ:t käytöstä
3. Load 16-bit period lo→`$DC04`, hi→`$DC05`
4. Kirjoita käsittelijän osoite osoitteeseen `$0314`/`$0315`
5. `$DC0D = $81` — ota käyttöön CIA1-ajastimen A IRQ
6. `$DC0E = $01` — käynnistä ajastin A jatkuvassa tilassa
7. CLI — ota keskeytykset uudelleen käyttöön

Käsittelijän on päätyttävä `irq_exit` (tai `sys $EA81`) ja sen pitäisi kuitata
CIA1-keskeytyksen:

```basic
sub my_handler()
  poke $DC0D, $01      # ACK CIA1 timer A IRQ (read also clears it)
  # ... work here ...
  irq_exit             # JMP $EA81: restore A/X/Y + RTI
end
```

PAL-ajoitus: kello = 985 248 Hz. Jakso 50 Hz:llä = 985 248 / 50 = 19 705 sykliä
≈ `$4CC9`. Eteenpäin suuntautuvia referenssejä tuetaan.

### Virheiden käsittely

```basic
onerr goto err_handler   # set KERNAL I/O error vector ($0300/$0301) to a label

...

label err_handler
  print "I/O ERROR"
  bye
```

`onerr goto label` kirjoittaa otsikon osoitteen (lo, hi) KERNAL-sijainteihin
`$0300` ja `$0301`. Kun KERNAL I/O -virhe tapahtuu (esim. epäonnistunut `load`
tai `open`), KERNAL suorittaa `JMP ($0300)`, joka haarautuu otsikkoon. Eteenpäin
suuntautuvia viittauksia (otsikko määritelty `onerr goto`-osoitteen jälkeen)
tuetaan.

### Käännösaikainen tiedostojen upottaminen

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

Kaikki `data`-arvot kerätään käännösaikana. Ohjelmalle varataan ja alustetaan
automaattisesti 2-tavuinen ZP-osoitin. Jokainen `read` siirtää osoitinta
eteenpäin.

### Sisäänrakennettu kokoonpano

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

**Osoitetilat:**

| Syntaksi       | Tila             | Tavut | Esimerkki                    |
| -------------- | ---------------- | ----- | ---------------------------- |
| (ei operandia) | Implisiittinen   | 1     | `NOP`, `RTS`                 |
| `A`            | Akkumulaattori   | 1     | `ASL A`, `LSR`               |
| `#value`       | Välitön          | 2     | `LDA #$07`                   |
| `$zz` (0–255)  | Nollasivu        | 2     | `LDA $50`                    |
| `$zz,X`        | ZP,X             | 2     | `LDA $50,X`                  |
| `$zz,Y`        | ZP,Y             | 2     | `LDX $50,Y`                  |
| `$xxxx`        | Absoluuttinen    | 3     | `LDA $0400`                  |
| `$xxxx,X`      | Absoluuttinen, X | 3     | `LDA $0400,X`                |
| `$xxxx,Y`      | Absoluuttinen, Y | 3     | `LDA $0400,Y`                |
| `($xxxx)`      | Epäsuora         | 3     | `JMP ($FFFC)`                |
| `($zz,X)`      | (Epäsuora, X)    | 2     | `LDA ($50,X)`                |
| `($zz),Y`      | (Epäsuora), Y    | 2     | `LDA ($50),Y`                |
| `label`        | Suhteellinen     | 2     | `BNE label` (vain konttorit) |

- `$zz` (1–2 heksadesimaalinumeroa, arvo ≤ 255) valitsee nollasivuisen tilan,
  jos käsky tukee sitä; muuten päivittyy automaattisesti absoluuttiseksi
  tilaksi. Käytä `$00xx` (4 numeroa) pakottaaksesi absoluuttisen tilan.
- Haaraoperandit ovat absoluuttisia osoitteita; suhteellinen tavuoffset
  lasketaan automaattisesti.
- Paikalliset tunnisteet (`name:`) on rajattu `asm { }`-lohkoon. Eteenpäin
  suuntautuvat haarat ratkaistu toisessa vaiheessa.
- `#<label` / `#>label` antavat tunnisteen osoitteen lo- / hi-tavun.
- `*` antaa nykyisen käskyosoitteen, joten `JMP *` muodostaa itseään suorittavan
  silmukan.
- Rivit, jotka alkavat merkeillä `$`, `%` tai numerolla, lähetetään raakatavuina
  (taaksepäin yhteensopiva).
- `asm { }`-merkin sisällä kommentit ovat `;` tai `//` rivin loppuun asti. (`#`
  on välitön etuliite, ei kommentti.)

**`asm { }`-merkin yhdistäminen aliohjelmaparametreihin**

Parametrien nimet **eivät ole käytettävissä** `asm { }`-lohkojen sisällä. Käytä
UltimateBasic-lauseita siirtääksesi arvoja tunnettuihin paikkoihin ennen `asm {
}`-lohkoa:

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

Rutiineille, joiden koko runko on assembly-tyyppinen – erityisesti
IRQ-käsittelijöille, joiden on ristiviitattava toisiinsa – sijoita kaikki
käsittelijät **yhteen ylimmän tason `asm { }`-lohkoon** pääohjelmassa. Saman
lohkon otsikot jakavat yhteisen soveltamisalan, joten `irq1` ja `irq2` voivat
viitata toisiinsa vapaasti. Katso `examples/raster_irq_demo.ub`.

### Merkkijono ↔ kokonaisluku

```basic
numstr score, $0340      # writes "042\0" at $0340 (always 3 digits, zero-padded)
var n = str_to_int("42") # compile-time: Expr::Number(42)

print str$(score)                # print 8-bit int as 3-digit decimal string ("000"–"255")
print "Score: " + str$(score)   # usable in string concat print context
var s: string = str$(n)          # assign str$() result to a string var (shared static buffer)
```

`str$(n)` muuntaa 8-bittisen arvon 3-merkkiseksi desimaalimerkkijonoksi (aina 3
numeroa ja niiden alussa nollat, esim. `5` → `"005"`, `42` → `"042"`, `255` →
`"255"`), jota seuraa null-terminaattori. Tulososoitin tallennetaan pysyvään
ZP-pariin, joka varataan käännösaikana.

> **Huomautus:** `str$(n)` käyttää yhtä jaettua 4-tavuista staattista puskuria.
> `str$(n)`-funktion uudelleenkutsuminen korvaa edellisen tuloksen. Useiden
> arvojen samanaikaista näyttämistä varten käytä `numstr`-funktiota
> kirjoittaaksesi erillisiin absoluuttisiin osoitteisiin.

## Esimerkkejä

| Tiedosto                            | Kuvaus                                                                                       |
| ----------------------------------- | -------------------------------------------------------------------------------------------- |
| `examples/features.ub`              | vakio, label/goto, poke/peek, rnd, matemaattiset funktiot                                    |
| `examples/new_features.ub`          | aliparametrit, taulukot, sanamuuttujat, merkkijonomuuttujat                                  |
| `examples/bitmap_demo.ub`           | 320×200 bittikartta, juoni, grafiikka päällä/pois                                            |
| `examples/block_demo.ub`            | 80×50 lohkografiikka, plot4, circle4, grafiikka lohkolla                                     |
| `examples/joystick_demo.ub`         | joystick-lukeminen, sprite-liike                                                             |
| `examples/mux_demo.ub`              | rasterisprite-multiplekseri (3 ikkunaa × 8 sprittiä = 24)                                    |
| `examples/orbit_demo.ub`            | 24-sprite-kiertorata pulssisäteellä ja satunnaisilla väreillä                                |
| `examples/plasma_demo.ub`           | plasmaefektinen bittikartta rasteripalkkireunuksen animaatiolla                              |
| `examples/sprite_data.ub`           | sprdef-muototiedot (sisältyvät muihin demoihin)                                              |
| `examples/sprite_mux_orbit.ub`      | 24-sprite-kiertoradan demo sprdefillä + esilasketuilla sijainneilla                          |
| `examples/sprite_orbit_demo.ub`     | 8 laitteistosprittiä ympyräradalla sin/cos-taulukon kautta                                   |
| `examples/reu_bitmap_demo.ub`       | REU-varasto/nouto bittikarttagrafiikalla                                                     |
| `examples/sid_music_demo.ub`        | SID-musiikkisoitin rasteri-IRQ:lla ja näppäimistöuloskäynnillä                               |
| `examples/tenprint.ub`              | 5 TENPRINT-sokkelototeutusta valikoilla; demoja `lowercase` merkistötilassa                  |
| `examples/countdown_demo.ub`        | Lähtölaskenta `for..next` negatiivisella askeleella, mukaan lukien `for i = 20 to 0 step -2` |
| `examples/countdown_errors_demo.ub` | Käännösaikainen virhe oletusvaiheelle `from > to`                                            |
| `examples/explicit_demo.ub`         | `--explicit` CLI-lippudemo täysin kirjoitetuilla `var`, `sub`, `fn` -komennoilla             |
| `examples/explicit_errors_demo.ub`  | Löyhä koodi, joka rakentuu ilman `--explicit`-koodia, aiheuttaa virheitä                     |

## CLI-viite

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

### CRT-vienti

Ultimate Basic voi myös kirjoittaa Magic Desk -tyypin 19 patruunakuvan, kun
tulostetiedoston nimi päättyy `.crt`:

```bash
ub build demo.ub -o demo.crt
```

Kääntäjä käärii luodun PRG:n pankkiin asetettuun CRT-konttiin käyttäen samaa
asettelua kuin VisualAssemblerin CRT-vienti: 64-tavuinen kasettiotsikko, 8×8K
Magic Desk -kuva ja käynnistyslataaja pankissa 0, joka kopioi PRG-hyötykuorman
C64 RAM -muistiin ennen hyppäämistä ohjelman aloituspisteeseen. `.prg`- ja
`.d64`-polut toimivat edelleen kuten ennenkin.

### Eksplisiittisen tyypin tila

Anna `--explicit` pakottaaksesi jokaisen määrittelysivuston sisältämään `:type`
-annotaation:

```bash
ub build game.ub --explicit
```

Ilman lippua Ultimate Basic hyväksyy sekä `var x = 5` (alustajasta päätelty tai
oletusarvoisesti `int` oleva tyyppi) että `var x: int = 5`. Lipun kanssa vain
annotoitu muoto käännetään – irrallinen muoto aiheuttaa käännösaikaisen virheen.

**Mitä se valvoo:**

| Ilmoituslomake                                         | Ilman `--explicit`              | `--explicit` kanssa                     |
| ------------------------------------------------------ | ------------------------------- | --------------------------------------- |
| `var name = expr` (ei `:type`)                         | ok — tyyppi päätelty            | virhe                                   |
| `var name: int = expr` (tai sana/liukuväri/merkkijono) | okei                            | okei                                    |
| `var arr = array(N)`                                   | okei — epäsuorasti `array`      | okei — muuttumaton                      |
| `var arr = array_word(N)`                              | okei — epäsuorasti `array_word` | okei — muuttumaton                      |
| `const NAME = value`                                   | okei                            | okei — muuttumaton                      |
| `sub foo(a, b)` (tyypittämättömät parametrit)          | okei                            | virhe tyypittämätöntä parametria kohden |
| `sub foo(a: int, b: int)`                              | okei                            | okei                                    |
| `fn foo(a): int` (tyypitön parametri)                  | okei                            | parametrissa oleva virhe                |
| `fn foo(a: int): int`                                  | okei                            | okei                                    |

Vakiot ja taulukkomäärittelyt hyväksytään aina — niiden tyyppi määräytyy
määrittelymuodon mukaan, joten `:type` olisi tarpeeton.

**Esimerkki virhetulosteesta:**

```
$ ub build myprog.ub --explicit
Compilation errors:
  line 14: 'explicit' mode: 'var loose' has no type — use 'var loose: int|word|float|string'
  line 16: 'explicit' mode: parameter 'a' has no type — use 'a: int|word|float|string'
```

Lippu on koontiaikainen kytkin — lähdekoodissa ei tarvitse muuttua mitään
käyttöönottoa tai poistamista varten. Lisää se Makefile-/koontikomentosarjaasi
pakottaaksesi tyypitetyn tyylin koko projektissa tai jätä se pois tutkivista
komentosarjoista. Katso `examples/explicit_demo.ub` ja
`examples/explicit_errors_demo.ub`.

### Virheenkorjaustiedostot

Käytä `--debug`-merkkiä debuggerisymbolien luomiseen yhdessä ohjelman kanssa:

```bash
ub-koontitiedosto demo.ub --debug
```

Kääntäjä kirjoittaa tiedostot `.prg`-tunnisteen viereen käyttäen tulostiedoston
runkoa:

| Tiedosto   | Muoto ja tarkoitus                                                                                      |
| ---------- | ------------------------------------------------------------------------------------------------------- |
| `demo.sym` | KickAssembler-yhteensopiva symbolilähdekoodi, soveltuu tuotavaksi assembler-lähdekoodiin                |
| `demo.dbg` | C64Debugger/RetroDebugger KickAssembler -virheenkorjausvedos, joka sisältää ohjelmasegmentin ja otsikot |
| `demo.vs`  | VICE-monitorin komentotiedosto, joka sisältää `al`-komennot osoitetarroille                             |

Kaikki kolme vientiä sisältävät `program_start`-, `program_end`-muuttujat,
taulukot, aliohjelmat ja BASIC-tunnisteet, jotka tunnetaan koodin luomisen
jälkeen. Voit esimerkiksi ladata VICE-symbolit sen `-moncommands
demo.vs`-komentorivivalitsimella tai monitorin `ll "demo.vs"`-komennolla.

Nykyinen `.dbg`-vienti tarjoaa segmentti- ja osoitesymbolitiedot. Se ei vielä
sisällä käskyjen ja lähderivien välisiä vastaavuuksia lähdetason askellusta
varten.

### Assembly-koodinluontilistaus (uusi versiossa 1.5.2)

Kirjoita luettava 6502-lähdeluettelo PRG:n viereen käyttämällä `--asm`-merkkiä:

```bash
ub-koontitiedoston demo.ub --asm
```

For an output named `demo.prg`, this creates `demo.asm`. The listing is produced
from metadata collected while Ultimate Basic generates the machine code; it is
not merely a disassembly of the completed PRG. It contains:

- `; UB:` kommentit, jotka merkitsevät kunkin lähettävän UB-lausekkeen
  generoidun tavualueen;
- nimetyt vakiot nollasivuisille muuttujille ja `$C000+`-taulukoille, mukaan
  lukien niiden tyypit/koot;
- aliohjelmien ja BASIC-otsikoiden lopulliset nimet ja osoitteet;
- luotiin `loc_xxxx` -tunnisteita suhteellisille haaroille ja ohjelman
  sisäisille `JMP`/`JSR` -kohteille;
- normaali 6502-mnemoniikka ja operandit, joissa kääntäjän symbolit on korvattu
  tiedoissa;
- tarkka C64-osoite ja lähetetyt tavut jokaisen käskyn vieressä;
- kääntäjän luomat apuohjelmat ja upotettu koodi lopullisessa
  muistijärjestyksessään;
- `.byte` tuloste tavuille, joita ei dekoodata tuettujen 6502-käskyjen
  mukaisesti.

Kääntäjän apuohjelmat saavat kuvaavia nimiä, kuten `ub_helper_plot`,
`ub_helper_line_erase`, `ub_helper_print_hex` ja `ub_helper_music_irq`. Tunnetut
upotetut tiedot – mukaan lukien `data` -lausekkeet, karttamerkki-/väritaulukot,
sprite- ja merkkimääritelmät, sinitaulukko, lataustiedostojen nimet, `incbin`
-tiedostot, SID-musiikki ja Koala-hyötykuormat – lähetetään nimettyinä `.byte`
-alueina. Pitkät nollilla täytetyt osoiteaukot käyttävät KickAssemblerin `.fill`
-direktiiviä.

Esimerkkiote:

```asm
.label x                 = $02 ; int

* = $080D

ub_start:
    cld                         ; $080D: D8
    ; UB: var x
    lda  #$01                   ; $080E: A9 01
    sta  x                      ; $0810: 85 02
```

Osoite-/tavukommenttien avulla listausta on helppo vertailla `.prg`-luettelon
kanssa. Tuloste käyttää KickAssembler-syntaksia (`.label`, `.byte`, `.fill` ja
`* = origin`), joten se voidaan koota uudelleen; konekieliset kommentit eivät
vaikuta tulokseen.

`--add` vaatii `--d64`. Käännetty `.ub`-ohjelma on aina levyn ensimmäinen
tiedosto; jokainen `--add`-tiedosto liitetään sen perään. Levyllä olevat
tiedostonimet johdetaan lähdetiedoston rungosta isoilla kirjaimilla (esim.
`music.prg` → `MUSIC`).

Onnistuneen koonnin jälkeen kääntäjä tulostaa aina muistikartan:

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

`-v`-merkillä tuloste näyttää lisäksi sisäiset ZP-allokoinnit ja täyden
heksaedrisen vedoksen.

## Tunnetut rajoitukset

| Ominaisuus                                  | Rajoitus                                                                                                                                                                                   |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Kokonaislukuaritmetiikka                    | 8-bittinen etumerkitön (0–255); `word` -muuttujilla on 16-bittiset arvot                                                                                                                   |
| Aliohjelmat                                 | Ei rekursiota — ZP-parametripaikat allokoidaan staattisesti                                                                                                                                |
| Merkkijonomuuttujat                         | Read-only after init; assignment replaces the pointer, not the data                                                                                                                        |
| Merkkijonojen yhdistämisen suoritusaikainen | `s1 + s2` tulostaa peräkkäin — ei keon allokointia tai pituuden seurantaa                                                                                                                  |
| `rnd()` / `rnd(n)`                          | Yksinkertainen LCG, ei kryptografinen; jakso = 256                                                                                                                                         |
| `abs()` / `sgn()` / `min()` / `max()`       | vain 8-bittisiä arvoja; `abs`/`sgn` käsittelee arvoja etumerkillisinä (bitti 7 = negatiivinen → `abs` kahden komplementit, `sgn` palauttaa `$FF`); `min`/`max` ovat etumerkittömiä (0–255) |
| `plot`                                      | Alueen ulkopuolella olevat pikselit rajataan äänettömästi (Y ≥ 200 tai X ≥ 320 → ei toimintoa)                                                                                             |
| `mplot`                                     | Ei rajojen tarkistusta — x:n on oltava 0–159, y:n on oltava 0–199                                                                                                                          |
| `mline` / `mrect`                           | Monivärinen; x: 0–159, y: 0–199. Näytön ulkopuolisten pikselien rivitys (ei katkaisua) — pitää koordinaatit alueella                                                                       |
| `mcircle`                                   | Monivärinen; leikkaa näytön ulkopuoliset pisteet (x ≥ 160 tai y ≥ 200 ohitetaan)                                                                                                           |
| `color pen`                                 | Vain palkkaukset; asettaa kosketettujen solujen etualan näytteen (tausta säilyy). Ei vaikutusta lohkotilassa (`plot4`/`circle4`)                                                           |
| `rect`                                      | Ei rajojen tarkistusta — x: 0–319, y: 0–199; x1≤x2 ja y1≤y2 eivät ole pakollisia (degeneroituneet/käänteiset suorakulmat tuottavat määrittelemättömän tulosteen)                           |
| `plot4`                                     | Ei rajojen tarkistusta — x:n on oltava 0–79, y:n on oltava 0–49 (lohkotila)                                                                                                                |
| `circle4`                                   | Leikkaa näytön ulkopuolisia lohkopikseleitä; hyödyllinen säde on noin 0–49 80×50-lohkotilassa                                                                                              |
| `chr$`                                      | Ei PETSCII↔ASCII-määritystä — n välitetään sellaisenaan CHROUT-funktiolle                                                                                                                  |
| `music play`                                | Vaatii `load sid`; vain yksi CIA1-kääre lähetetään (viimeinen `music play` voittaa)                                                                                                        |
| `graphics on double`                        | Vain palkattu; käyttää `$4000–$7FFF`-merkkiä takapuskurissa, joten ohjelmakoodin on pysyttävä `$4400`-merkkiä pienempänä; ei yhdistettävissä spritien tai moniväristen kanssa              |
| Virheraportointi                            | Vain käännösaikana; `onerr goto` käsittelee KERNAL I/O -virheet ajonaikana                                                                                                                 |
