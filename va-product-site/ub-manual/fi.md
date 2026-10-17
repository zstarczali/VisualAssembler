# Ultimate Basic v1.6.6 — Kieliopas

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
var x = 10 # 8-bittinen kokonaisluku (oletus)
var ptr: word = $0400 # 16-bittinen — kaksi nollasivuista tavua, käytettävissä 16-bittisenä osoitteena
var f: float = 3.5 # Q8.8 fixed-point — hi byte = kokonaisluku, low byte = murtoluku
var msg = "HELLO" # merkkijonomuuttuja (osoitin inline-PETSCII-dataan)
var s: string = "TEXT" # merkkijono, jolla on eksplisiittinen tyyppi
var scores = array(10) # tavutaulukko, 10 alkiota tallennettuna kohtaan $C000+
var moments = array_word(8) # sanataulukko, 8 sanaelementtiä tallennettuna kohtaan $C000+
const BORDER_ADDR = $D020 # käännösaikainen vakio (korvattu inline-muodossa, ei ZP-paikkaa)
```

Avainsanat ja tunnisteet **kirjainkokoa ei erotella**: `PRINT`, `Print` ja
`print` ovat kaikki kelvollisia.

| Tyyppi                            | Leveys              | Muistiinpanoja                                                                  |
| --------------------------------- | ------------------- | ------------------------------------------------------------------------------- |
| `int`                             | 8-bittinen          | oletusarvo numeerisille literaaleille                                           |
| `sana`                            | 16-bittinen         | kaksi ZP-tavua; voidaan käyttää osoitteena `poke`/`peek`-muodossa               |
| `kelluva`                         | 16-bittinen Q8.8    | hi-tavu = kokonaislukuosa (0–255), lo-tavu = murtolukuosa                       |
| `yksittäinen` / `kaksinkertainen` | 5 tavua RAM-muistia | liukuluku (C64 BASIC -muoto, ~9 numeroa) — `dim x as double`; katso *Liukuluku* |
| `merkkijono`                      | osoitin             | ZP-pari → nollapäätteinen PETSCII koodisegmentissä                              |
| `taulukko(N)`                     | N tavua             | tavuelementit; sijaitsee `$C000+`-kohdassa, ei ZP:ssä                           |
| `taulukon_sana(N)`                | N×2 tavua           | sanaelementit (16-bittiset); sijaitsee `$C000+`-merkillä, ei ZP-tiedostossa     |
| `array(R, C, …)`                  | ∏dims tavua         | moniulotteinen (rivi-pääaine); indeksi `arr[r, c]`                              |
| `array_word(R, C, …)`             | ∏dims×2 tavua       | moniulotteinen sanataulukko (rivi-pääaine)                                      |

#### BASIC-tyyliset määrittelyt: `dim … as …`

`dim-nimi tyyppinä` on `var-nimen vaihtoehtoinen kirjoitusasu: tyyppi` — sama
tallennustila, sama koodi:

```basic
DIM kor AS INTEGER # etumerkillinen 16-bittinen, alkaa merkistä 0
DIM nev AS STRING # merkkijono, alkaa merkistä ""
DIM fzetes AS DOUBLE # liukuluku, alkaa merkistä 0
DIM x, y AS BYTE # useita nimiä, kaikki saavat tyypin
DIM pont AS INTEGER = 1000, cim AS STRING = "C64" # alustajat, sekalaiset tyypit
```

| `kuten …`                        | Ultimate Basic -tyyppi                                                                   |
| -------------------------------- | ---------------------------------------------------------------------------------------- |
| `tavu`, `kokonaisluku`           | `int` (8-bittinen, 0–255)                                                                |
| `kokonaisluku`                   | etumerkillinen 16-bittinen (−32768 … 32767) — QBasic INTEGER                             |
| `sana`                           | `sana` (etumerkitön 16-bittinen, 0–65535)                                                |
| `yksittäinen`, `kaksinkertainen` | liukuluku, 5 tavua RAM-muistissa (±2,9·10⁻³⁹ … 1,7·10³⁸, ~9 numeroa) — katso *Liukuluku* |
| `kelluva`                        | `liukuva` (Q8.8 kiinteä piste — 0–255.99, nopea)                                         |
| `merkkijono`                     | `merkkijono`                                                                             |

- Ilman `= value`, luvut alkavat nollasta ja merkkijonot kohdasta `""`.
- `dim a, b as integer` antaa **both** nimille tyypin (VB.NET-tyyliin, ei
  QBasic). Vain yhdellä nimellä voi olla alustaja.
- `as` ja BASIC-tyyppinimet ovat kontekstisanoja, eivät varattuja – ne ovat
  edelleen käyttökelpoisia niminä.
- Ei tuettuja: `as long`, rakennetyypit (käytä `muuttujan nimeä: TName =
  array(N)`) — käännösaikaisia virheitä.
- Kun käytössä on `--explicit`, `dim` ilman `as` on virhe.
- Merkkijonojen sijoituksella on arvon semantiikkaa: `s = "TEXT"` osoittaa
  literaaliin, `t = s` ja lasketut arvot kopioidaan `t`:n omaan puskuriin (katso
  *Strings at runtime*). Ennen versiota 1.6.3 `s = "TEXT"` tallensi määrittelyn
  jälkeen roskatavun osoittimeen.

#### Taulukot, joiden tyyppi on `dim`: `dim nimi(u1, u2, …) `

```basic
DIM tabla(2, 3) AS INTEGER ' 3 × 4 elementtiä: tabla(0..2, 0..3)
DIM kocka(1, 2, 3) AS BYTE ' mikä tahansa määrä ulottuvuuksia
DIM ar(9) AS DOUBLE ' 10 liukulukuarvoa (5 tavua kukin)
DIM nevek(4) AS STRING ' 5 merkkijonoa, kaikki alkavat merkeillä ""
DIM v(9) ' ei AS → tavutaulukkoa

tabla(2, 3) = 999 ' QBasic-tyylinen indeksi ( )-metodilla
tabla[2, 3] = 999 ' … tai tavallinen [ ]
nevek(0) = "ZSOLT"
PRINT tabla(2, 3); " "; nevek(0); " "; ar(1)
```

- Jokainen raja on **korkein indeksi** (PERUSSääntö): `dim t(2, 3)` sisältää 3 ×
  4 alkiota. (`var t = array(3, 4)` ottaa huomioon alkioiden lukumäärän — sama
  taulukko.)
- Elementtityypit: `byte`/`int` → 1 tavu, `integer` (etumerkillinen) / `word` →
  2 tavua, `float` → 2-tavuinen Q8.8, `single`/`double` → 5-tavuinen liukuluku,
  `string` → 2-tavuinen osoitin. Rajojen on oltava käännösaikaisia vakioita.
  Taulukot sijaitsevat tiedostossa `$C000-$CFFF` (4 kt); Kun he tarvitsevat
  lisää, koko taulukon alue siirtyy kansioon `$A000-$CFFF` (12 kt, BASIC ROM
  -muistissa — katso *Matriisimuisti*). Yli 12 288 tavua on käännösaikainen
  virhe.
- Merkkijonotaulukon alkiot alkavat muodossa `""`; `nevek(i) = "TEXT"` / `= s` /
  `= a + b`, `n = nevek(i)`, tulostus, `+`, välitys `string` -parametrille ja
  `input nevek(i)` toimivat kaikki (ei-literaaliarvot kopioidaan 31 merkin
  paikkaan elementtiä kohden).
- `name(i)`-indeksointi toimii myös taulukoille, jotka on ilmoitettu funktiolla
  `var a = array(…)`.
- Yksi taulukko per `dim`-ryhmä: `dim a(3) tavuna, n kokonaislukuna` on
  hyväksyttävä, `dim n, a(3) kokonaislukuna` on virhe. Ei alustajaa — käytä
  `-datan nimeä: …`.

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

**Music** `tune` (lohkon avainsana; rivit sisällä - `speed`, `inst`, `order`,
`pat` - eivät ole varattuja)

**Tyypit ja tyyppiin liittyvät** `int`, `word`, `float`, `string`, `array`,
`array_word`

**Tulostus ja I/O** `tulostus`, `spc`, `välilehti`, `at`, `tulo`, `ketju`,
`jono`, `heksa`, `roska`, `avaa`, `sulje`, `lataus`, `tallenna`, `ketju`,
`tiedot`, `read`, `include`, `incbin` (myös `dec` — yllä mainittu
vähennyslauseena; samaa tunnusta käytetään tulostusmuodossa `dec(n, width)`)

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

**Sprite** `sprhit`, `sprdef`, `sprite_frame`, `sprite_x`, `sprite_y`, `sprite`,
`sprbghit`, `box_hit`, `chardef`, `charset`, `org`, `expand`, `priority`

**Ääni ja musiikki** `sid`, `sound`, `sfx`, `volume`, `music`, `play`, `pause`,
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

| Varattu                                                   | Ehdotettu uudelleennimeäminen                  |
| --------------------------------------------------------- | ---------------------------------------------- |
| `loppu`                                                   | `lopea_kohdassa`, `lopea`, `viimeinen`         |
| `lopeta`                                                  | `pysähdy_kohdassa`, `pysäytys`                 |
| ` kertaa`                                                 | `määrä`, `n`, `itteriä`                        |
| `näyttö`                                                  | `näyttö`, `näyttöosoite`                       |
| `reunus`, `tausta`, `teksti`                              | `reunuksen_osoite`, `taus_väri`, `teksti_väri` |
| `puristin`                                                | `korkki`, `sidottu`                            |
| `viiva`, `ympyrä`, `suorakulma`                           | `ln`, `ympyrä`, `laatikko_r`                   |
| `tiedot`, `lue`                                           | `tavua`, `seuraava_tavu`                       |
| `lataa`, `tallenna`, `avaa`, `sulje`                      | `lataustiedosto`, ...                          |
| `kartta`, `näytä`, `piilota`                              | `laattakartta`, `paljasta`, `piilota`          |
| `toisto`, `tauko`, `jatka`, `pysäytys`, `äänenvoimakkuus` | `soita_kappale`, `äänenvoimakkuus`             |
| `int`, `liukuväritys`, `sana`, `merkkijono`               | `n_int`, `nopeus_f`, `osoite`, `viesti`        |

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
z = x ja 15 # bittikohtainen JA
w = a tai b # bittikohtainen TAI
v = a xor b # bittikohtainen XOR
m = x shl 3 # siirto vasemmalle
n = x shr 2 # siirto oikealle (aritmeettinen kokonaisluku: -8 shr 1 = -4)
r = x mod 40 # jakojäännös; x mod 0 = x, x / 0 = 255
b = bnot x # bittikohtainen EI: x XOR 255 (komplementoi kaikki 8 bittiä)
```

Vertailut: `==` `!=` `<` `>` `<=` `>=` (palauta 1/0)

Aritmeettinen koodi (1.6.0): Vakioarvolla `*` kääntyy muotoon shifts / shift-add
(`x * 8` → 3× `ASL`), muuten enintään 8 kierroksen shift-add-silmukaksi. `/` ja
kahden potenssilla korotettu `mod` ovat `LSR` / `AND #(n-1)`, muuten 8
kierroksen shift-subtract-silmukka, jonka suoritusaika ei enää riipu
osamäärästä. Nollalla jakaminen määritellään seuraavasti: `x / 0 = 255`, `x mod
0 = x` (ennen versiota 1.6.0 se jumiutui).

`mod`, jossa on `word` tai `integer` operandi (tai negatiivinen vakio), on
16-bittinen jakojäännös, jonka etumerkki on jaettava, kuten QBasicissa: `-7 mod
3` = -1, `7 mod -3` = 1, `(w + 5) mod 7` säilyttää 16 bittiä. YKSITTÄIS- /
KAKSINKERTAIS-operandilla se toimii liukulukulaskulla (katso *Floating point*).
Kokonaisluvun ` ` ` shr` on aritmeettinen siirto (merkki säilytetään: `-8 shr 1`
= -4); ` sanan ` ja tavujen arvot siirtyvät loogisesti. `x = x + 1` / `x = x -
1` (ja ±2) käännetään muotoon `INC` / `DEC`.

### Lisäys / Vähennys

```basic
inc x # x = x + 1 (INC zp — yksittäinen käsky)
dec x # x = x - 1 (DEC zp — yksittäinen käsky)
```

`sanalle` muuttujien siirto käsitellään seuraavasti: `inc` käyttää `INC lo; BNE
skip; INC hi`; `dec` käyttää `LDA lo; BNE skip; DEC hi; DEC lo`.

### Yhdistelmätehtävät

```basic
x += 5 # x = x + 5
x -= 3 # x = x - 3
x *= 2 # x = x * 2
x /= 4 # x = x / 4
x ja = 15 # x = x ja 15 (bittikohtainen JA)
x tai = 64 # x = x tai 64 (bittikohtainen TAI)
x x tai = 255 # x = x x tai 255 (bittikohtainen XOR)
x shl = 2 # x = x shl 2
x shr = 1 # x = x shr 1
```

### Painaa

```basic
tulosta "HEI"
tulosta x
tulosta x, y, "teksti"
tulosta # tyhjä rivi

tulosta spc(5) # tulosta 5 välilyöntiä
tulosta tab(20), "ARVO" # siirrä kohdistin sarakkeeseen 20 ja tulosta
tulosta "A", spc(3), "B" # sekoita vapaasti

tulosta "A=" + a # merkkijono + numeerinen muuttuja
tulosta s1 + s2 # kaksi merkkijonomuuttujaa → peräkkäinen tulostus
tulosta "Hei " + "Maailma" # kaksi literaalia → käännösaikainen taitto
tulosta chr$(13) # tulosta PETSCII-koodilla
```

Oletusarvoisesti numerot tulostetaan ilman ylimääräisiä välilyöntejä ja `,` vain
erottaa alkiot (`print 1, 2` antaa tulokseksi `12`). C64 BASIC -välistys
rakennetaan komennolla `--basic-print` tai lisätään ohjelmaan rivi `-asetus
basic print`: luku tulostuu sitten etu- ja takavälillä (tai sen `-`) ja
takavälillä (`print 5` → ` 5 `), `,` siirtää luvun seuraavaan 10 sarakkeen
tulostusvyöhykkeeseen ja loppu- `,` pitää kohdistimen rivillä kuten loppu- `;`.
Merkkijonot `spc`, `tab`, `hex`, `bin`, `dec`, `chr$` ja `str$` tulostuvat kuten
ennenkin.

#### `TULOSTA KÄYTTÄEN `

```basic
DIM ar AS DOUBLE = 1234,5
DIM s AS STRING = "ALMA"
TULOSTA KÄYTTÄEN "###.##"; 3,14159 ' 3,14
TULOSTA KÄYTTÄEN "Ar: #,###.## Ft"; ar ' Ar: 1 234,50 Ft
TULOSTA KÄYTTÄEN "+##"; 7 ' +7
TULOSTA KÄYTTÄEN "##.##-"; -2,25 ' 2,25-
TULOSTA KÄYTTÄEN "##"; 123 ' %123
TULOSTA KÄYTTÄEN "[&amp;] [!] [\ \]"; s; s; s ' [ALMA] [A] [ALMA]
TULOSTA KÄYTTÄEN "## "; 1, 2, 3 ' 1 2 3
```

| Ala                   | Merkitys                                                                                                                            |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `#`                   | numeron sijainti; numerot on tasattu oikealle ja pyöristetty desimaalien tarkkuudelle                                               |
| `.`                   | desimaalipilkku; sen jälkeiset `#` ovat desimaaleja (enintään 9)                                                                    |
| `,`                   | ennen pistettä: tuhaterottimet (jokainen `,` on yksi merkki)                                                                        |
| `+` alussa            | tulosta aina merkki (`+` / `-`)                                                                                                     |
| `-` lopussa           | tulosta miinusmerkki luvun perään (välilyönti, jos luku on positiivinen)                                                            |
| `&amp;` / `!` / `\ \` | merkkijono: koko merkkijono / sen ensimmäinen merkki / täsmälleen yhtä monta merkkiä kuin kenttä on leveä (`\` + välilyönnit + `\`) |
| `_`                   | tulosta seuraava merkki sellaisenaan (`_#`)                                                                                         |

Jos luku ei mahdu kenttään, sen eteen tulostetaan `%` (`%123`); ensin jätetään
pois yksinäinen nolla (`#.##`, jossa -0.5 → `-.50`). Muut merkit tulostetaan
sellaisenaan. Arvot vaihtuvat kenttien välillä (muotoilu alkaa alusta, kun se
loppuu); viimeisen arvon jälkeen tulostuu teksti seuraavaan kenttään asti.
Merkinnät `;` tai `,` pitävät kohdistimen rivillä. Muodon on oltava
merkkijonoliteraali; kenttiä `**`, `$$` ja `^^^^` ei tueta. Ohjelma, jossa on
`PRINT USING`, sisältää liukulukujen suoritusympäristön (vain tarvittavat osat).

### chr$

```basic
print chr$(65) # tulostetaan merkki PETSCII-koodilla 65 ('A')
var c = chr$(n) # tallennetaan tavuarvo n muuttujaan c
print "&gt;" + chr$(42) # voidaan käyttää merkkijonossa concat
```

### Haarautuminen

```basic
jos x == 1, niin tulosta "KYLLÄ"
muuten tulosta "EI"
loppu
```

### Valitse / Tapaus

```basic
valitse x
tapaus 1:
tulosta "YKSI"
tapaus 2:
tulosta "KAKSI"
muuten:
tulosta "MUU"
loppu
```

`select expr` laskee lausekkeen kerran ja vertaa sitä järjestyksessä kaikkiin
`case` -arvoihin. Ensimmäinen vastaava case-runko suoritetaan ja ohjaus siirtyy
`end` -arvon jälkeen. Valinnainen `else:` -runko suoritetaan, jos mikään tapaus
ei täsmää. Kaikkien arvojen on oltava 8-bittisiä (0–255).

### Silmukat

```basic
silmukka 5 # laskettu silmukka (5 iteraatiota)
print "HI"
end

times 5 # silmukan N alias ... end
print "HI"
end

silmukka # ääretön silmukka
x = x + 1
jos x == 5, jatka end # siirry seuraavaan iteraatioon
jos x == 100, keskeytä end
end

var i = 0
for i = 1 to 10 # for..next (suositeltu)
jos i == 5, jatka end # siirry lisäysaskeleeseen
print i
next

for i = 0 to 20 step 2
print i
next i # muuttujan nimi 'next'-sanan jälkeen on valinnainen

for i = 10 to 1 step -1 # laskee alaspäin — negatiivinen vakio step on tuettu

print i
next

for i = 20 to 0 step -2 # päättyy oikein kohdassa i = 0 (11 iteraatiota)
print i
next i

var i = 0
silmukka i = 1 to 10 # vanha silmukka..end syntaksi — identtinen koodi
print i
end

while x &lt; 100
x = x + 1
end

repeat # do-while: runko suoritetaan ainakin kerran
x = x + 1
kunnes x == 100 # poistuu, kun ehto on tosi
```

**Suuntasäännöt `for`/`loop`:**

| Tapaus                                                     | Käyttäytyminen                                                                                                                |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `for i = 1 to 10` (oletus `step +1`, `from ≤ to`)          | laskee ylöspäin, vakio                                                                                                        |
| `for i = 0 to 20 step 2` (positiivinen askel, `from ≤ to`) | laskee kahdella ylöspäin                                                                                                      |
| `for i = 10 to 1 step -1` (negatiivinen vakioaskel)        | laskee alaspäin; kappale juoksee ajan i = 10, 9, ..., 1                                                                       |
| `for i = 20 to 0 step -2` (nollasta ylöspäin)              | päättyy kohtaan i = 0 havaitsemalla kiertymisen 0:n alapuolelle vähennyksen jälkeen; ei loputonta silmukkaa                   |
| `for i = 10 to 1` (ei askelta, `from > to`)                | **käännöksenaikainen virhe**: `for-loop: from (10) > to (1) with default step +1 loops 0 times — use 'step -1' to count down` |

Koodin muoto (1.6.0): silmukka *kierretään* — `JMP-testi` (jätetään pois, kun
vakiorajat takaavat ensimmäisen läpimenon), runko, `var += step`, sitten
alhaalla oleva testi haarautuu takaisin runkoon, joten iteraatiota kohden ei ole
ylimääräistä `JMP`:tä. Askel havaitsee 8-bittisen kiertoliikkeen molempiin
suuntiin (`INC`/`BEQ` tai `ADC`/`BCS` laskee ylöspäin, `BEQ`/`DEC` tai
`SBC`/`BCC` laskee alaspäin), joten ` i = 0 - 255 ` suoritetaan 256 kertaa ja
pysähtyy, ja ` i = N - 0 askel -k` on aina äärellinen. Vakioita rajoja ja
askeleita käytetään välittöminä (ei nollasivua); Ei-vakio raja-arvo tai askel
lasketaan kerran ja säilytetään pysyvästi nollasivulla.

Muuttuvat `step`-arvot (esim. muuttujasta tai lausekkeesta) käsitellään
positiivisina käännösaikana; jos tarvitset lähtölaskentaa ajonaikaisella
askelarvolla, jaa silmukka tai käytä `while`-rakennetta.

### Otsikot ja siirtyminen

```basic
otsikko pää_silmukka
x = x + 1
jos x &lt; 10, niin mene pää_silmukan loppuun
```

Eteenpäin `goto` (tunniste määritellään myöhemmin) on täysin tuettu.

`gosub label` / `return` hyppää otsikkoon ja palaa takaisin (JSR / RTS
konekielitasolla). Otsikon on oltava `label name`-lauseke, ei `sub` — sillä ei
ole parametreja ja se jakaa saman nollasivuisen laajuuden. `gosub` tukee
eteenpäin suuntautuvia viittauksia (otsikko on määritelty `gosub`-merkin
jälkeen).

```basic
gosub piirto_reunus
...
label piirto_reunus
# ... piirrä jotain ...
return # RTS — palaa gosub-käskyn jälkeiseen käskyyn
```

### Aliohjelmat

```basic
sub greet()
tulosta "HEI!"
loppu

sub set_color(col)
reunuksen väricol
tekstin väricol
loppu

greet() # kutsu sulkeilla
kutsu greet # kutsu avainsanaa (ei sulkeita)
set_color(6)
```

Parametrit välitetään erillisten nollasivuisten paikkojen kautta. Ei rekursiota
(paikat ovat staattisia). Tyypillisiä parametreja tuetaan: `sub draw(x, y:int)`
tai `sub copy(src:string)` — merkkijonoparametrit vastaanottavat 2-tavuisen
osoittimen, jotta kutsuttava voi indeksoida lähdemerkkijonon `src[i]`-osoitteen
kautta.

### Funktiot (paluuarvot)

```basic
fn neliö(x)
return x * x
end

fn lisää(a, b)
return a + b
end

fn clamp(arvo, lo, hi)
jos arvo &lt; lo, niin palauta lo end
jos arvo &gt; hi, niin palauta hi end
return arvo
end

muuttuja s = neliö(9) # s = 81 — fn-funktion kutsu lausekkeena
muuttuja c = clamp(joy, 0, 39) # c = lukittu arvo
tulosta lisää(10, 20) # 30 — käytettävissä tulosteen sisäisesti
```

Funktiot tukevat valinnaista `: word`-paluutyyppiä 16-bittisille arvoille:

```basic
fn get_addr(): word
return $C000
end

var ptr: word = get_addr() # ptr = $C000
poke ptr, 42 # STA (ptr),Y — kelvollinen epäsuora osoitus
var v = peek(ptr) # LDA (ptr),Y
```

`fn` lähetetään toisella kierroksella (sama kuin `sub`), joten funktion runkoa
ei koskaan suoriteta käynnistyksen yhteydessä. Eteenpäin suuntautuvia
viittauksia tuetaan täysin.


#### QBasic-tyylinen `FUNCTION` / `SUB`

```basic
TOIMINTO Negyzet (szam AS INTEGER) AS INTEGER
    Negyzet = szam * szam ' paluuarvo = määritä funktion nimi
LOPPUTOIMINTO

TOIMINTO Nagyobb (a AS BYTE, b AS BYTE) AS BYTE
    Nagyobb = a
    JOS b &gt; a NIIN
        Nagyobb = b
        EXIT FUNCTION ' palaa nyt tähän mennessä määritetyllä arvolla
    LOPETA JOS
LOPPUTOIMINTO

SUB Koszont (nev AS STRING)
    PRINT "Üdvözöllek, "; nev; "!"
LOPETA SUB

n = Negyzet(30)
Koszont "Zsolt" kutsu ilman sulkeita
Koszont("Zsolt") ' ... tai heidän kanssaan
SOITA Koszont("Zsolt")
```

- `function` on synonyymi funktiolle `fn`; `p AS type` toimii parametrilistoissa
  ja `AS type` (`:n jälkeen)` antaa paluuarvon tyypin (samat tyyppinimet kuin
  `dim`). `: type` toimii edelleen.
- Funktion nimen määrittäminen tallentaa piilotettuun
  `<nimi>__tulos`-muuttujaan, joka palautetaan kohdassa `END FUNCTION` / `EXIT
  FUNCTION`; `return lauseke` toimii myös edelleen.
- `END SUB`, `END FUNCTION`, `END IF`, `END SELECT` hyväksytään (toinen sana on
  valinnainen); `EXIT SUB` / `EXIT FUNCTION` return (tavallinen `exit` on
  edelleen `bye`).
- Sub/fn voidaan kutsua ilman sulkeita: `Koszont "Zsolt"`, `Rajzol x, y`.
- `PRINT a; b; c` — `;` yhdistää alkiot ilman välilyöntejä; lopussa oleva `;`
  poistaa rivinvaihdon. Merkki `;`, jota seuraa lauseke (`print x; y = 1`),
  erottaa edelleen lausekkeet.
- Merkkijonoliteraalien aksenttiset kirjaimet tulostuvat peruskirjaimikseen (`ü`
  → `u`, `ő` → `o`); C64-merkistössä ei ole aksenttisia kirjaimia.
- Sana-/liukumalukuparametrit vastaanottavat nyt molemmat tavut, ja
  `string`-parametrille annettu merkkijonoliteraali toimii (aiemmin vain lo-tavu
  / merkkijonomuuttuja toimi).
- Ei rekursiota (parametrit sijaitsevat staattisissa nollasivuisissa paikoissa);
  versiosta 1.6.3 lähtien rekursiivinen kutsu on käännösvirhe eikä hiljainen
  virheellinen tulos.

#### Lisää QBasic-syntaksia (1.6.3)

Alla olevat QBasic-lomakkeet kääntyvät alkuperäisen syntaksin viereen (kommentit
`==`, `end`, `loop`, `#` toimivat kaikki edelleen).

```basic
' kommentti (QBasic-tyyliin, kuten #)
JOS x = 3 NIIN TULOSTA "kolme" ' yksirivinen JOS: ei LOPPU JOS tarvitaan
JOS x &lt;&gt; 3 NIIN TULOSTA "ei" MUUTEN TULOSTA "kyllä"
JOS n &lt; 0 NIIN
TULOSTA "negatiivinen"
JOS n = 0 NIIN
TULOSTA "nolla"
MUUTEN TULOSTA "positiivinen"
LOPPU JOS

DO WHILE i &lt; 10 : i = i + 1 : SILMUKKA ' myös DO UNTIL c … SILMUKKA,
DO : i = i - 1 : SILMUKKA KUNNES i = 0 ' DO … SILMUKKA WHILE c, DO … SILMUKKA (loputon)
WHILE k &lt;&gt; 5 : k = k + 1 : WEND
FOR i = 1 TO 100
JOS i = 12 NIIN POISTU FOR ' POISTU DO / POISTU FOR / POISTU WHILE
NEXT

SELECT CASE n CASE 1, 2, 3: TULOSTA "pieni"
CASE 10 TO 20: TULOSTA "teini"
CASE IS &gt; 1000: TULOSTA "iso"
CASE ELSE: TULOSTA "muu"
END SELECT

END ' lopettaa ohjelman (näyttö säilyy)
```

- **Ehdot:** merkinnän `IF` / `ELSEIF` / `WHILE` / `UNTIL` / `LOOP WHILE|UNTIL`
  sisällä yksi `=` vertailee. `&lt;&gt;` tarkoittaa, ettei kaikkialla ole yhtä
  suuri (sama kuin `!=`).
- **Yksirivinen JOS:** heti `THEN` jälkeen oleva lauseke muodostaa yksirivisen
  JOS-lausekkeen, joka päättyy riviin tai `end`-lauseeseen samalla rivillä (`if
  c then x = 1 end`, kuten ennenkin). Monirivinen JOS-lauseke tarvitsee
  rivinvaihdon `THEN`-lausekkeen jälkeen. Kuten QBasicissa, kaikki
  `THEN`-lausekkeen jälkeen kyseisellä rivillä kuuluu JOS-lausekkeelle (`… THEN
  EXIT FOR : NEXT` nielaisi `NEXT`-lausekkeen).
- **`END` yksinään:** `END`, joka ei sulje lohkoa, lopettaa ohjelman, kuten
  QBasic. Ylimääräinen `end` ei siis enää näy virheenä.
- **`DO` -lohkot: ** rivin `DO` sisällä rivin lopussa oleva `LOOP` sulkee sen
  (alkuperäiset `silmukka N … end` / `silmukka i = … end` silmukat toimivat
  edelleen rivin sisällä).
- **`SELECT CASE`:** vanha `select x` / `case n:` -muoto ei muutu. `SELECT CASE`
  alennetaan JOS-ketjuksi piilotetun `select__N`-muuttujan kautta.

#### Merkkijonot suorituksen aikana (1.6.3)

```basic
DIM s AS STRING, t AS STRING
s = "Pont: " + pont + "!" ' luvuista tulee tekstiä (16-bittinen, etumerkillinen INTEGER)
t = s ' kopio: s:n muuttaminen myöhemmin ei muuta t:tä
s = s + "?"
PRINT LEFT$(s, 4); RIGHT$(s, 2); MID$(s, 7, 3); MID$(s, 7)
PRINT LEN(s + t), VAL("1234") + 1, STR$(pont)
JOS s = "ABC" TAI t &lt;&gt; "" NIIN PRINT "vertaa = / &lt;&gt;"
```

- **Puskurit:** merkkijonomuuttuja, joka saa lasketun arvon (`+`, `left$`,
  `right$`, `mid$`, luvut, toinen muuttuja), omistaa 80 merkin puskurin;
  pidemmät tulokset katkaistaan 80 merkin kohdalla. Literaalin osoittaminen
  osoittaa edelleen siihen.
- **Merkkijonotaulukot:**-elementit, jotka saavat ei-literaalisen arvon (tai
  `input`), saavat oman 32-tavuisen paikan (31 merkkiä), joten `input nevek(i)`
  säilyttää kaikki nimet silmukassa.
- **`STR$` / `VAL`:** 16-bittisen tai etumerkillisen arvon `STR$`:ssä ei ole
  etunollia (`"-42"`). Yhteensopivuuden vuoksi tavun `STR$` säilyttää
  kolminumeroisen muodon (`"007"`). `VAL` lukee 16-bittiset etumerkilliset luvut
  (`VAL("1234") + 1` = 1235).
- **Vertailu:** `=` / `&lt;&gt;` (ja `==` / `!=`), ja `&lt;` `&gt;` `&lt;=`
  `&gt;=` PETSCII-järjestyksessä kuten C64 BASICissa; merkkijono tulee ennen
  jokaista pidempää merkkijonoa, jonka se aloittaa (`"AB" &lt; "ABC"`, `"" &lt;
  "A"`).

#### Etumerkillinen KOKONAISLUKU, SYÖTE, KAKSINKERTAINEN (1.6.3)

- **INTEGER on etumerkillinen:** `DIM x AS INTEGER` on etumerkillinen
  16-bittinen (−32768 … 32767, kuten QBasic): tulostus, `&lt;` `&gt;` vertailut,
  `/` (katkaistuu kohti nollaa), `ABS`, tekstimuunnos, `INPUT` ja `FOR` silmukat
  nollan läpi (`FOR i = 3 TO -3 STEP -2`) seuraavat kaikki etumerkkiä. `WORD`
  pysyy etumerkittömänä 0 … 65535. Unaarinen miinus-merkki toimii missä tahansa
  (`a &lt; -10`, `x * -2`).
- **`FOR` 16-bittisellä laskurilla** (`INTEGER` / `WORD`) on todellinen
  16-bittinen silmukka. Se kietoutui aiemmin 256 bitin kohdalle, joten `FOR k =
  0 TO 300` suoritettiin 45 kertaa.
- **`INPUT`:** lukee INTEGER / WORD -muotoon enintään 6 merkkiä (`-`
  INTEGER-muotoon), DOUBLE-muotoon hyväksyy `12.5` (kaksi desimaalia). `INPUT
  t(i)` lukee taulukkoelementin ja `INPUT "kehote"; x` toimii myös.
- **DOUBLE ÷ DOUBLE** on nyt tarkka (`7.5 / 2.5 = 3.00`); ennen käytettiin vain
  jakajan kokonaislukuosaa. DOUBLE × DOUBLE oli jo tuettu.
- **Yli 256 tavun taulukot** (`DIM t(200) AS INTEGER`, `DIM g(19, 19)`) toimivat
  muuttuvien indeksien kanssa; indeksiä käytetään rivittämiseen 256 tavuun ja
  kirjoittamiseen väärään elementtiin.
- **Rekursio** (ali-/funktio, joka kutsuu itseään, suoraan tai muiden kautta) on
  käännösvirhe. Se aiemmin aiheutti virheellisiä tuloksia, koska parametrit
  sijaitsivat kiinteissä nollasivupaikoissa.

### Taulukot

```basic
muuttuja scores = array(8) # 8 tavua kohdassa $C000
# (kaikki taulukot täytetään nollilla kerran ohjelman alussa — uutta versiossa 1.5.7)

scores[0] = 100 # vakioindeksi → STA $C000
scores[i] = 99 # muuttujaindeksi → STA (ptr),Y
muuttuja v = scores[i] # LDA (ptr),Y
tulosta scores[2] # käytettävissä tulostettaessa

muuttuja moments = array_word(8) # 16 tavua (8×2) kohdassa $C000+

moments[0] = $1234 # vakioindeksi → STA $C000 (lo), STA $C001 (hi)
moments[i] = $5678 # muuttujaindeksi → ASL A for stride; (ptr),Y × 2
muuttuja t: sana = moments[1] # LDA $C002, LDA $C003
```

**Moniulotteiset taulukot** (uusi versiossa 1.5.3)

Taulukot voidaan deklaroida useammalla kuin yhdellä ulottuvuudella. Ne
tallennetaan **rivi-pää**-muodossa ja indeksoidaan pilkulla erotetulla
alaindeksiluettelolla. Kokonaiskoko on kaikkien ulottuvuuksien tulo.

```basic
muuttuja grid = array(8, 8) # 8×8 = 64 tavua kohdassa $C000
grid[1, 0] = 11 # rivi 1, sarake 0 → tasainen indeksi 1*8+0 = 8 → STA $C008
grid[0, 1] = 22 # rivi 0, sarake 1 → tasainen indeksi 1 → STA $C001
grid[r, c] = 33 # muuttuja → laskee r*8 + c, sitten STA (ptr),Y
muuttuja v = grid[r, c] # LDA (ptr),Y

muuttuja wm = array_word(4, 4) # 4×4 sanan taulukko = 32 tavua
wm[1, 2] = $ABCD # elementti 1*4+2 = 6 → tavut $C00C/$C00D

vakio RIVIT = 3
vakio SARAKKEET = 5}var m = array(ROWS, COLS) # ulottuvuudet voivat olla käännösaikaisia vakioita
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
tyyppi TEntity
muuttuja x: int # 1 tavu
muuttuja y: int # 1 tavu
muuttuja hp: sana # 2 tavua → elementin koko = 4
lopputyyppi

vakio N = 8
muuttuja enemies: TEntity = array(N) # varaa N × 4 = 32 tavua kohdassa $C000

enemies[0].x = 5
enemies[0].y = 10
enemies[0].hp = $0100
muuttuja v = enemies[0].hp # lue takaisin — LDA $C002 / LDA $C003

muuttuja i: int = 2
enemies[i].x = 42 # muuttujan indeksi → idx * elem_size + offset

# Liukulukukenttä (Q8.8 kiinteäpisteinen)
tyyppi TBall
muuttuja bx: int # 1 tavu
muuttuja by: int # 1 tavu
muuttuja vel: liukuluku # 2 tavua K8.8 → elementin koko = 4
endtype

var balls: TBall = array(3)
balls[0].vel = 1.5 # tallentaa K8.8: hi=1, lo=128
var f: float = balls[0].vel # lukee float-kentän float-muuttujaan
print balls[0].vel # tulostaa "1.50"
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
var ptr: sana = 0400 dollaria # kaksi ZP-tavua: lo = 00 dollaria hi = 04 dollaria
poke ptr, 6 # STA (ptr),Y
var v = peek(ptr) # LDA (ptr),Y
```

**16-bittiset tulot (korjattu versiossa 1.5.7).** Sanalle `` osoitettu tulo
säilyttää kaikki 16 bittiä, myös silloin, kun kumpikaan tekijä ei ole `sana`:

```basic
muuttujan pistemäärä: sana = 0
muuttujan taso = 3
pistemäärä += 300 * taso # 900 (ennen versiota 1.5.7 tämä katkaistiin 8 bittiin: 44)
pistemäärä = pistemäärä + 100 * taso
muuttujan iso: sana = 100 * taso + 900
```

Versiosta 1.6.1 lähtien tämä pätee myös summien sisällä ja `shl`:lle sekä yli
255:n vakiokertoimille: `py = cy * 8 + fy`, `py = (cy shl 3) + fy` ja `w = cy *
300` säilyttävät kaikki 16 bittiä (ennen summamuodot katkaistiin 8 bittiin).
Tavukohteet säilyttävät 8-bittiset tulokset.

### Bittikarttagrafiikka

```basic
grafiikka päällä # VIC-II käyttää bittikarttatilaa (320×200, 1 bittiä sivua); bittikartta hintaan $2000
grafiikka päällä moni # VIC-II monivärinen bittikarttatila (160×200, 2 bittiä sivua sivua kohden, 4 väriä/solu)
grafiikka pois päältä # paluu tekstitilaan

gcls # tyhjennä bittikartta (täyttää $2000-$3FFF) + aseta videomatriisin värit

plot x, y # aseta pikseli kohtaan (x, y); x: 0-319, y: 0-199
plot erase x, y # tyhjennä pikseli (AND ~mask)
plot xor x, y # kytke pikseli päälle/pois (EOR mask) — välkkymätön animaatio
circle x, y, r # keskipisteympyrä keskitettynä kohtaan (x, y) säteellä r; leikkaa näytön ulkopuolisia pisteitä
viiva x1, y1, x2, y2 # Bresenham-viiva pisteestä (x1,y1) pisteeseen (x2,y2); x: 0-319, y: 0-199
viivan poisto x1, y1, x2, y2 # pikselien poistaminen viivalta (JA ~maski)
viiva xor x1, y1, x2, y2 # pikselien poistaminen viivalta (EOR-maski)
rect x1, y1, x2, y2 # suorakulmion ääriviivan piirtäminen (4 reunaa); x: 0-319, y: 0-199
rect erase x1, y1, x2, y2 # suorakulmion ääriviivan poistaminen (JA ~maski)
rect xor x1, y1, x2, y2 # suorakulmion ääriviivan poistaminen (EOR-maski)
maalaa x, y # 4-yhteinen täyttö pisteestä (x, y); täyttää tyhjät pikselit, jotka on rajattu ykkösten avulla

color pen c # aseta piirustusvärin väri (0-15); katso alla

# ── Monivärinen bittikartta (grafiikka monivärisellä, 160×200) ──
mplot x, y, color # aseta monivärinen pikseli (x: 0-159, y: 0-199, color: 0-3)
mline x1, y1, x2, y2, color # monivärinen viiva
mrect x1, y1, x2, y2, color # monivärisen suorakulmion ääriviiva
mcircle x, y, r, color # monivärinen ympyrä
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
grafiikka päällä
gcls
värikynä 2 # punainen
viiva 0, 0, 100, 100
värikynä 6 # sininen
ympyrä 160, 100, 40
näyttö päällä
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
grafiikka useilla
gcls
mcircle 80, 100, 40, 1
mrect 10, 10, 150, 190, 2
mline 0, 0, 159, 199, 3
näyttö päällä
```

`mline`/`mrect`/`mcircle` käyttävät samoja Bresenham / keskipiste -rutiineja
kuin vastaavat rutiinit piirtämällä jokaisen pikselin `mplot`:n kautta; näytön
ulkopuoliset pisteet (x ≥ 160 tai y ≥ 200) ohitetaan.

### Kaksoispuskuroitu bittikartta (välkkymätön)

```basic
grafiikka päällä kaksinkertaisesti # kaksinkertaisesti puskuroitu palkattu bittikartta (320×200)
gcls # tyhjentää PIILOTETUN takapuskurin
rivi 0, 0, 319, 199 # kaikki piirustukset (kuvaaja/viiva/ympyrä/suoraviiva/maalaus/gcls) siirtyvät takapuskuriin
käännä # näytä piirretty puskuri; ohjaa piirustuksen toiseen
grafiikka pois päältä # takaisin tekstitilaan (palauttaa VIC-pankin 0)
```

`graphics on double` säilyttää **kaksi** valmista palkattua bittikarttaa ja
näyttää vain valmiit ruudut, mikä poistaa välkkymisen ilman XOR-kikkoja —
jokaisen ruudun `gcls` piirrät ja sitten `flip`.

| Puskuri                       | Bittikartta     | Videomatriisi   | VIC-pankki | `$DD00` matalat bitit |
| ----------------------------- | --------------- | --------------- | ---------- | --------------------- |
| A (edestä, ensin kuvassa)     | `2000 dollaria` | `0400 dollaria` | pankki 0   | `%11`                 |
| B (takaosa, piirretään ensin) | `6000 dollaria` | `4400 dollaria` | pankki 1   | `%10`                 |

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
grafiikka lohkossa # 80×50 lohkopikselitila (tekstitila + mukautettu 4 pikselin merkistö @ $2800)
grafiikka pois päältä # palaa tekstitilaan
gcls # tyhjennä lohkon pelikenttä: näytön RAM $0400-$07FF + väri-RAM $D800-$DBFF

plot4 x, y # aseta lohkon pikseli kohtaan (x, y); x: 0-79, y: 0-49
plot4 pyyhi x, y # tyhjennä lohkon pikseli kohdassa (x, y)
circle4 x, y, r # piirrä keskipisteympyrä lohkon pikseleihin; leikkaa kokoon 80×50
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
cls # näytön tyhjennys (KERNAL $E544)
cls fast # nopea täyttö: näytön RAM + väri-RAM + HOME

tekstin väri 14 # tekstin värirekisteri $0286
reunuksen väri 6 # $D020
taustan väri 0 # $D021
värikynä 2 # palkkaa piirustusvärin (0-15) kuvaajalle/viivalle/suorakulmiolle/ympyrälle/maalaukselle

näyttö 0, 0, 65 # kirjoita merkki 65 ('A') näytön RAM-muistiin sarakkeeseen 0, riville 0 ($0400)
näyttö 10, 5, ketju # sarake 10, rivi 5 — sarake/rivi voi olla muuttujia
näyttö 5, 3, 42, 7 # merkki 42 sarakkeeseen 5, riville 3, väri 7 (kirjoittaa myös väri-RAM-muistiin $D800)
näyttö x, y, ketju, sarake # kaikki neljä argumenttia muuttujina

näyttö päällä # ota VIC-näyttö uudelleen käyttöön ($D011 DEN-bitti)
näyttö pois päältä # tyhjä näyttö

pienet kirjaimet # CHR$(14) → vaihda VIC-II pieniin/isoihin kirjaimiin
isot kirjaimet # CHR$(142) → vaihda VIC-II takaisin isoihin/grafiikkamerkistöön

kursori 20, 10 # siirrä kohdistin sarakkeeseen 20, riville 10 (KERNAL PLOT $FFF0)

kursori x, y # sarake muuttujasta x (0–39), rivi y:stä (0–24)

tulosta kohdassa 20, 10, "HEI" # kohdistin(20,10) + tulosta yhdessä lausekkeessa (ei rivinvaihtoa lopussa)

tulosta kohdassa x, y, "Pisteet:", pisteet # mikä tahansa lausekkeiden yhdistelmä
tulosta kohdassa 0, 0 # vain kohta (ei tekstiä, ei rivinvaihtoa)

vieritä x 3 # aseta vaakasuora hienovieritys: $D016 bitit 0-2 = 3 (0-7)

vieritä y 2 # aseta pystysuora hienovieritys: $D011 bitit 0-2 = 2 (0-7)
scroll x n # arvo voi olla muuttuja tai lauseke (maskattu biteille 0-2)
scroll x 7 narrow # aseta hienovieritys ja pakota 38 sarakkeen tila (piilota reunasarake)
scroll x 0 wide # aseta hienovieritys ja palauta 40 sarakkeen tila
scroll row 12 left # siirrä näytön RAM-riviä 12 vasemmalle yhden merkin verran
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
speed 4 # aseta suorittimen taajuuteen 4 MHz (lukee $D031:n, päivittää bitit 0-3, kirjoittaa takaisin)
speed 48 # 48 MHz (maksiminopeus U64:llä)
speed max # sama kuin nopeus 48 (alias)
speed off # takaisin 1 MHz:iin (alias nopeudelle 1)

badlines on # ota käyttöön huonon viivan ajoitus ($D031 bitti 7 = 0, oletusarvoinen C64-toiminta)
badlines off # poista käytöstä huonon viivan ajoitus ($D031 bitti 7 = 1, lisää suorittimen syklejä)

var t = turbo() # 1, jos turbo on aktiivinen ($D031:n bitit 0-3 != 0), 0, jos taajuudella 1 MHz
```

Käytettävissä olevat MHz-arvot: `1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 20, 24,
32, 40, 48`. Vakiot pyöristetään alaspäin lähimpään käännösaikana käytettävissä
olevaan nopeuteen. Muuttujien arvoja käsitellään raakana nopeusindeksinä (0–15)
ja ne TAI-operaattorilla lisätään `$D031`-muuttujan biteille 0–3.

| $D031-indeksi | MHz (U64) | MHz (U64 Elite-II) |
| ------------- | --------- | ------------------ |
| 0             | 1         | 1                  |
| 3             | 4         | 4                  |
| 6             | 8         | 10                 |
| 11            | 20        | 24                 |
| 15            | 48        | 64                 |

Vaatii **U64 Turbo Control** -asetuksen olevan `U64 Turbo Registers` tai `Turbo
Enable Bit` U64-määritysvalikossa. Tavallisessa C64:ssä tai emulaattorissa,
jossa ei ole rekisteriä, `poke` - `$D031` ohitetaan hiljaa.

### Näppäimistö

```basic
var key = getch() # varattu - odota $FFE4:ää, kunnes näppäintä painetaan; palauttaa PETSCII-koodin
var k = inkey() # ei-estävä: palauttaa PETSCII-koodin tai 0, jos näppäintä ei paineta
waitkey # odota, kunnes mitä tahansa näppäintä painetaan (CIA1-matriisin skannaus; toimii IRQ:n aikana)
var k = waitkey() # sama, mutta palauttaa raakat $DC01-sarakkeen bitit (0 bittiä = näppäintä painettu)
var j = joy(2) # lue joystickin portti 2; palauttaa käänteiset bitit 0-4
var j = joy(1) # lue joystick-portti 1
# bit0=up(1) bit1=down(2) bit2=left(4) bit3=right(8) bit4=fire(16)
var mx = mouse_x() # 1351 mouse: kertynyt X-sijainti (apu: charge+delay+delta)
var my = mouse_y() # 1351 mouse: kertynyt Y-sijainti (EOR #$FF käänteinen)
var mb = mouse_btn() # hiiren painikkeet: lukee $DC01 — bit0=left (fire), bit1=right (yläpinni)
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
hei # JSR $E544 (tyhjennä näyttö), tyhjennä STOP-lippu, RTS BASICiin
exit # alias heille
```

### Ajoitus

```basic
odota 50 # odota 50 rasteririvisiirtymää (~3,2 ms)
odota rasteria 100 # pyöritä kunnes $D012 == 100 (rasterijakotehosteet)
viive 1 # odota 1 PAL-kehys (1/50 s ≈ 20 ms)
viive 20 # odota 20 kehystä ≈ 0,4 s; n voi olla muuttuja (0–255)
```

`delay N` laskee N kokonaista PAL-kehystä käyttäen rasteriviivaa 200 kehyksen
rajana.

### SID-ääni

```basic
ääni 0, $1CAD, 25 # ääni 0, taajuus $1CAD (≈ keskimmäinen C PAL), 25 ruudun kesto
ääni 1, taajuussana, 50 # ääni 1, taajuus sanamuuttujasta, 50 ruutua (1 s 50 Hz:ssä)
ääni 2, 0, 0 # ääni 2, hiljaisuus

sid-äänenvoimakkuus 15 # päääänenvoimakkuus täysi ($D418 = $0F); alue 0-15
sid-äänenvoimakkuus 0 # hiljaisuus (päääänenvoimakkuus = 0)
sid-pysäytys # nollaa kaikki 25 SID-rekisteriä ($D400–$D418) — täydellinen hiljaisuus
```

`sound <channel>, <freq>, <duration>` — kesto PAL-kehyksissä (1/50 s kukin).
`sound` **blocks**: ohjelma odottaa, kunnes nuotti on loppunut (käytä `sfx` alla
pelisilmukan sisällä). Korjattu ADSR: attack/decay `$09`, sustain/decay `$F0`,
sahaaaltomuoto. Äänenvoimakkuuden pääasetus `$D418` aina `$0F`.

*Korjattu versiossa 1.5.7:* odotussilmukka tarkkaili rasteririviä 0, joka
`$D012` (vain matalat 8 bittiä) näkyi kahdesti kehystä kohden (rivit 0 ja 256),
joten jokainen nuotti kesti **puolet** pyydetyn ajan — ja kaksi haaraa
korjattiin niiden operaatiokoodin päälle, mikä kaatoi ohjelman muuksi ajaksi
kuin nollaksi. `sound` odottaa nyt rasteririvillä 200 täsmälleen kuten `delay`.

`sid volume N` kirjoittaa N:n `$D418`:iin. Bitit 0–3 = äänenvoimakkuus (0–15),
bitit 4–7 = suodatustila. `sid stop` lähettää 10 tavun pituisen
nollatäyttösilmukan – nopeammin kuin 25 yksittäistä työntöä.

### Ei-estävät äänitehosteet (`sfx`) — uutta versiossa 1.5.7

```basic
ääni 0, $2000, 25 # LOHKOJA: ohjelma odottaa tässä 25 kehystä
sfx 0, $2000, 25 # palaa heti; nuotti vaimenee itsestään
sfx 1, $0500, 8, 128 # valinnainen aalto: 16 kolmio, 32 saha (oletus), 64 pulssi, 128 kohina
sfx 0, freq_word, 4, 16 # freq voi olla vakio, sanamuuttuja tai 8-bittinen lauseke
```

`sfx <channel>, <freq>, <frames> [, <wave>]` ohjelmoi yhden SID-äänen ja
palauttaa sen välittömästi, joten se on turvallinen pelisilmukan sisällä.
Ajastintoimintoa ei ole: verhokäyrä asetetaan hyökkäysarvoon 0 / ylläpitoarvoon
0 / vapautusarvoon 0 ja **decay** valitaan käännösaikana joukosta `frames` (1
kehys = 20 ms, lähin SID:n vaimenemisaika: 6, 24, 48, 72, 114, 168, 204, 240,
300, 750, 1500, 2400 ms ...), joten nuotti vaimenee suunnilleen tänä aikana. Se
käynnistää äänen uudelleen jokaisen kutsun yhteydessä (portti pois, sitten
päälle) ja asettaa päääänenvoimakkuuden `$0F`. `channel` (0-2), `frames` (1-255)
ja `wave` on oltava käännösaikavakioita.


### SID-musiikki

```basic
load sid "tune.sid" # upota SID-musiikki sen alkuperäiseen latausosoitteeseen
load sid "tune.sid", $2000 # ohitus: upota kohtaan $2000 riippumatta SID-otsikosta
```

`load sid` lukee PSID- tai RSID-tiedoston **käännöksen aikana**, poistaa otsikon
ja lisää raakatuota musiikkiin tulosteen `.prg` jälkeen. `load sid` jälkeen
käytettävissä on kaksi käännösaikaista vakiota:

| Vakio           | Kuvaus                                                                         |
| --------------- | ------------------------------------------------------------------------------ |
| `sivun_aloitus` | Init-rutiinin osoite — kutsu kerran, jossa A = kappaleen numero (0-pohjainen)  |
| `sid_play`      | Toista rutiinin osoite — kutsu jokaista kehystä (50 Hz PAL) IRQ-käsittelijältä |

Molemmat vakiot toimivat kaikkialla, missä vakio-osoite hyväksytään: `sys`,
`irq`, `poke`, lausekkeet.

**Tyypillinen käyttö:**

```basic
lataa sid "music.sid"

sub music_irq()
poke $D019, $FF # ACK VIC rasteri-IRQ
sys sid_play # siirrä musiikkia yhden ruudun eteenpäin
irq_exit # JMP $EA81: palauta A/X/Y + RTI (oikea IRQ-lähtö)
end

sys sid_init, 0 # alusta SID-piiri: A=0 → ensimmäinen aliviritys
irq music_irq, $C0 # rasteri-IRQ linjalla $C0 → 50 Hz PAL:ssa

sid volume 15 # päääänenvoimakkuus päällä
```

**Huomautuksia:**
- SID-tiedot sijoitetaan kaiken luodun koodin **jälkeen**, ja ne täytetään
  nollilla latausosoitteeseen asti. Kääntäjä varoittaa, jos SID:n latausosoite
  menee päällekkäin luodun koodin kanssa.
- PSID-versioita 1 ja 2 tuetaan. Jos SID-otsikon latausosoite on 0, kahta
  ensimmäistä datatavua käytetään osoitteena (PRG-tyylinen, little-endian).
- Vain yksi `load sid` ohjelmaa kohden on merkityksellinen (viimeinen voittaa).

### Seurantamelodiat (`tune`)

```basic
viritys # valinnainen: viritys taajuudella $C800 (oletus $8000) nopeus 6 # kehyksiä rivillä (50 Hz PAL) inst 0, $41, $09, $F0, $0800, $0064, $27, $1F inst 1, $10, $08, $A8, $0400, $0000, $00, $0F imod 0, 6, 3, 9, 40, $0200, $0E00 # vibrato + pulssinleveysmodulaatio (1.6.2) ifilt 0, $0500, 20, 1 # katkaisupyyhkäisy jopa $500:aan asti, edestakaisin (1.6.2) igate 1, 2, 1, $09 # portin ajastin, kova uudelleenkäynnistys, ensimmäinen kehys $09 (1.6.2) itab 1, 2, 0, ".. +0", ".. +4", ".. +7" # arpeggio-taulukko (1.6.2)
järjestys 0, 1, 0 # kuvioiden järjestys (kuviot voivat toistua)
pat 0, 0, "C-4 00", "...", "E-4 00 V24", "...", "G-4 00", "... .. C00"
pat 0, 1, "C-2 01", "...", "...", "...", "G-2 01 F03"
pat 1, 0, "G-4 00", "...", "E-4 00", "...", "C-4 00"
end
musiikin toisto # tai: sys sid_init / irq-käsittelijä kutsuu sys sid_play:tä
```

`tune ... end` kuvaa kolmiäänisen seurantasävelmän selkokielellä (sama
solunotaatio kuin Visual Assembler SID-editorissa) ja rakentaa soittimen **
käännösaikana **. Se määrittelee `sid_init` / `sid_play` täsmälleen samalla
tavalla kuin `load sid`, joten `music play`, `music stop`, `music pause` ja
`music resume` (ja manuaalinen `irq`-käsittelijä, joka kutsuu `sys sid_play`)
toimivat muuttumattomina.

| Linja                                                             | Merkitys                                                                                                                                                                                                                                                                                                                                                                                                           |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `nopeus N`                                                        | Kehyksiä seurantariviä kohden (1–255).                                                                                                                                                                                                                                                                                                                                                                             |
| `inst id, ctrl, ad, sr, pw, cutoff, resfilt, modevol`             | Yksi instrumentti: ohjausrekisteri (aaltomuotobitit sekä rengasmodaus `$04` / sync `$02`; soittaja lisää gate-bitin), attack/decay, sustain/release, 12-bittinen pulssinleveys, 11-bittinen suodattimen katkaisu, resonanssi-/suodatinreititystavu (`$D417` -tyyliin: mikä tahansa reititysbitti = reitittää tätä instrumenttia soittavan äänen) ja tila-/äänenvoimakkuustavu (`$D418` -tyyliin, bitti 7 = 3 OFF). |
| `imod id, vibdelay, vibspeed, vibdepth, pwmspeed, pwmmin, pwmmax` | (1.6.2) Instrumenttivibrato: `vibdelay`-kehysten jälkeen kolmio-LFO, joka kääntyy joka `vibspeed`-kehys (1-15, 0 = pois päältä), syvyys 0-15 (skaalattu nuotin puolisävelaskeleeseen). Pulssinleveysmodulaatio: `pwmspeed` lisätään kehystä kohden (0 = pois päältä), pomppii `pwmmin` ja `pwmmax` välillä.                                                                                                        |
| `ifilt id, cutend, sweep, pingpong`                               | (1.6.2) Suodattimen katkaisupyyhkäisy: `inst`-katkaisusta `cutend`-katkaisuun `-pyyhkäisyllä` (0-127) kehystä kohden; `pingpong` 1 = edestakaisin.                                                                                                                                                                                                                                                                 |
| `igate id, gatetimer, hardrestart, firstwave`                     | (1.6.2) Portti vapautetaan `gatetimer` kehystä ennen äänen seuraavaa nuottia (pidä se alle `speed`-nopeuden); `hardrestart` 1 asettaa myös ADSR:n arvoon 0. `firstwave` (esim. `$09` = test + gate) kirjoitetaan nuotin ensimmäiseen kehytykseen.                                                                                                                                                                  |
| `itab-tunnus, nopeus, silmukka, "askel", ...`                     | (1.6.2) Aaltomuoto-/arpeggiotaulukko, jopa 32 askelta: `"WW +n"`, `".. -n"` tai `"WW =n"` - aaltomuoto heksadesimaalina (`..` säilyttää sen) ja nuotin siirtymä puolisävelaskelissa tai absoluuttinen nuotti (`=60`). Yksi askel joka `nopeus` ruudulla, sitten takaisin askeleeseen `silmukka` (255 = pysy viimeisellä askeleella).                                                                               |
| `järjestys p, p, ...`                                             | Kuviojärjestys. Viivat kasautuvat, jopa 255 askelta.                                                                                                                                                                                                                                                                                                                                                               |
| `pat p, v, "solu", ...`                                           | Jopa 32 riviä äänelle `v` (0-2) kuviossa `p` (0-7). Puuttuvat rivit ovat tyhjiä.                                                                                                                                                                                                                                                                                                                                   |

**solu** on `NOTE INST FX`: `C-4`, `D#3`, `Eb2` tai `...` ei nuottia,
kaksinumeroinen heksadecimal-instrumentti (`..` sen jättämiseksi) ja valinnainen
efekti - `Vxy` vibrato (x = rivien pito, y = syvyys), `Uxx` / `Dxx` liuku
ylös/alas, `C` nuotin leikkaus, `Fxx` asetettu nopeus. Pelkkä vaikutus -solu
voidaan kirjoittaa muodossa `"... .. F06"` tai vain `"F06"`.

Huomioita soittimesta:

- Kaikki pelaajan tilatiedot sijaitsevat **-blobin sisällä ** (absoluuttinen
  osoitus) - se ei käytä nollasivua, joten se ei voi törmätä
  UltimateBasic-muuttujiin tai väliaikaisiin muuttujiin, ja se jatkaa
  toimintaansa, kun ohjelma palaa BASIC-tilaan.
- Joka ruudulla (1.6.2) soittaja suorittaa kunkin äänen
  aalto-/arpeggio-taulukon, vibraton, pulssinleveysmodulaation ja
  porttiajastimen / kovan uudelleenkäynnistyksen sekä sen äänen
  katkaisutaajuuden pyyhkäisyn, joka viimeksi käynnisti suodinreititetyn
  instrumentin (se omistaa suotimen katkaisutaajuuden, resonanssin ja tilan;
  `$D417` reitittää jokaisen äänen, jonka nykyinen instrumentti on
  suodinreititetty). Se on sama algoritmi kuin Visual Assembler SID -editorin
  viedyn soittimen ja esikatselun, ruutu ruudulta.
- Blob-objekti sijoitetaan kiinteään osoitteeseen (oletusarvo `$8000` tai `tune
  osoitteessa $addr`) ja `.prg`-tiedosto täytetään siihen, kuten `load sid`.
  Pidä se erillään koodistasi, taulukoistasi (`$C000+`) ja kaikesta
  bittikartta-/merkistömuistista. Yksi lohko tarvitsee noin 2,5 kt + 12 tavua
  rivi-saraketta kohden.
- Enintään 8 kuviota (32 riviä kukin); järjestysluettelo voi toistaa niitä
  vapaasti.
- `music play` käyttää CIA1-ajastinta 50 Hz:n taajuudella; älä yhdistä sitä
  toiseen `load sid`/`tune` (viimeinen voittaa).

### Musiikin toisto

`music play/stop/pause/resume` on korkeamman tason vaihtoehto manuaaliselle `sys
sid_init` / `cia_timer` -asennukselle. Vaatii aiemman `load sid` -lausekkeen tai
`tune ... end` -lohkon (molemmat määrittelevät `sid_init` / `sid_play`).

```basic
lataa sid "tune.sid" # upota SID-tiedosto (määrittelee sid_init / sid_play)

musiikin toisto # alusta aliviritys 0 + käynnistä CIA1 50 Hz IRQ
musiikin toisto 1 # aloita alivirityksestä 1 (kappalenumerosta 0 riippuen)
musiikin pysäytys # pysäytä toisto + nollaa kaikki 25 SID-rekisteriä ($D400-$D418)
musiikin tauko # poista CIA1-ajastin A:n IRQ käytöstä (musiikki jumiutuu, SID ei muutu)
musiikin jatkaminen # ota CIA1-ajastin A:n IRQ uudelleen käyttöön (jatkuu taukokohdasta)
```

| Lausunto                | Vaikutus                                                                                                  |
| ----------------------- | --------------------------------------------------------------------------------------------------------- |
| `musiikkisoiton [n]`    | Soita `sid_init(n)`-osoitteeseen, konfiguroi CIA1-ajastin A 19 656 sykliin (~50 Hz PAL), asenna IRQ-kääre |
| `musiikkipysähdys`      | Poista CIA1 IRQ käytöstä + nollaa kaikki 25 SID-rekisteriä                                                |
| `musiikin tauko`        | poista CIA1 IRQ käytöstä (SID-lähtö pysyy jäädytettynä)                                                   |
| `musiikkiansioluettelo` | ota CIA1 IRQ uudelleen käyttöön (jatkuu taukokohdasta)                                                    |

IRQ-kääre (lähetetään kerran ohjelman lopussa) tekee seuraavaa: ACK CIA1-ajastin
A → `JSR sid_play` → `JMP $EA81`.

### Spritet

```basic
sprite 0, x, y, $2000 # sprite 0: aseta X- ja Y-sijainnit sekä dataosoitin
sprite 0, x, y # ilman dataosoitinta (säilyttää olemassa olevan)
sprite päällä 0 # ota sprite 0 käyttöön ($D015 |= bitti0)
sprite pois päältä 0 # poista sprite 0 käytöstä ($D015 &amp;= ~bitti0)
spriten väri 0, 7 # sprite 0 väri = keltainen ($D027)
sprite monivärinen 0, päällä # ota käyttöön monivärinen tila spritelle 0 ($D01C |= bitti0)
sprite monivärinen 0, pois päältä # poista monivärinen tila käytöstä ($D01C &amp;= ~bitti0)
spriten laajennus x 0, päällä # tuplaleveys ($D01D |= bitti0)
spriten laajennus x 0, pois päältä # normaalileveys ($D01D &amp;= ~bitti0)
spriten laajennus y 0, päällä # tuplakorkeus ($D017 |= bitti0)
spriten laajennus y 0, pois # normaali korkeus ($D017 &amp;= ~bit0)
sprite prioriteetti 0, päällä # taustan takana ($D01B |= bit0)
sprite prioriteetti 0, pois # taustan edessä ($D01B &amp;= ~bit0)
var h = sprite_hit() # sprite-sprite törmäys ($D01E, tyhjennetään luettaessa)
var b = sprite_bg_hit() # sprite-tausta törmäys ($D01F, tyhjennetään luettaessa)
var x = sprite_x(0) # lue sprite 0 X-sijainti (lo tavu, $D000)
var y = sprite_y(0) # lue sprite 0 Y-sijainti ($D001)
sprite_frame 0, $2000 # valitse yksi staattinen sprite-kuva
sprite_frame 0, $2000, frame # valitse animaatiokehys kehyssekvenssistä
```

X tukee koko 9-bittistä aluetta (0–319): käytä `word`-muuttujaa ajonaikaisille
arvoille > 255. Sprite-dataosoitin: `data_addr` on oltava 64-tavuisesti tasattu;
tallennetaan muodossa `addr >> 6` kohtaan `$07F8+id`.

#### Sprite-animaatio, jossa on `sprite_frame`

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
muuttuja kehys = 0
silmukka
sprite_kehys 0, $2000, kehys kehys = kehys + 1
jos kehys == 4, niin kehys = 0 loppu
viive 5
loppu
```

Kaksiargumenttinen muoto, `sprite_frame id, address`, valitsee yhden staattisen
спрайтkuvan ja pysyy taaksepäin yhteensopivana. спрайтkuvan sijaintia kontrolloi
edelleen `sprite id,x,y`.

### Ohjelmiston rajaavan laatikon törmäys

```basic
muuttuja touching = box_hit(vasen1, ylä1, oikea1, ala1, vasen2, ylä2, oikea2, ala2)
```

`box_hit()` suorittaa akselin suuntaisen rajaavan laatikon (AABB) testin ja
palauttaa arvon `1`, kun kaksi suorakulmiota ovat päällekkäin tai koskettavat
toisiaan, muuten `0`. Toisin kuin `sprite_hit()` ja `sprite_bg_hit()`, se ei lue
tai tyhjennä VIC-II-törmäysrekistereitä. Kahdeksan argumenttia ovat
mielivaltaisia 8-bittisiä lausekkeita, joten laatikot voivat olla pienempiä kuin
näkyvä sprite-kuvitus tai ne voivat kuvata muita kuin sprite-peliobjekteja.
Koordinaatit ovat osallistavia; säilytä `left <= right` ja `top <= bottom`.

### Sprite-määritelmä

```basic
sprdef 0
  $00,$3C,$00, $00,$FF,$00, $03,$FF,$C0, $07,$FF,$E0,
  $0F,$FF,$F0, $0F,$FF,$F0, $1F,$FF,$F8, $1F,$FF,$F8,
  $1F,$FF,$F8, $0F,$FF,$F0, $0F,$FF,$F0, $07,$FF,$E0,
  03 $, $ FF, $ C0, $ 00, $ FF, $ 00, $ 00, $ 3C, $ 00, $ 00, $ 00, $ 00,
  $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00,
00 $, 00 $, 00 $ loppu
```

`sprdef id ... end` upottaa 63 sprite-tavua koodisegmentin seuraavaan 64-tavun
tasaamaan osoitteeseen, lähettää niiden päälle `JMP`-merkin ja asettaa
automaattisesti `$07F8+id = data_addr >> 6`-merkin. Jos haluat käyttää samaa
muotoa useille spriteille, lue osoitin takaisin:

```basic
var pg = peek($07F8) # sprdef:n asettama osoitin 0
poke $07F9, pg # kopioi spritien luo 1–7
```

### Hahmolaattakartat (`.ubmap`)

```basic
map load "levels/world.ubmap"
map load "level.bin", $4000 # Kenttäeditoriprojekti, data $4000 (1.6.1)
map draw map_x, map_y # piirtää 40x25 näkymän näyttö-/väri-RAM-muistiin
map view px, py # tasoittaa kaksoispuskuroitua näkymää pikselin pikselikoossa, py (1.6.1)

var tile = map_tile(x, y) # lukee merkkikoodin kartalta
map set x, y, 42 # muuttaa merkkikoodia kirjoitettavassa karttadatassa

var shade = map_color(x, y) # lukee solun värin (0, kun kartalla ei ole väridataa)
map color x, y, 7 # muuttaa solun väriä, kun väridata on läsnä
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

**Kehänmuokkausohjelman projektit (uusi versiossa 1.6.1).** `kartan lataus`
lukee myös VisualAssembler-kehänmuokkausohjelman projektin (`Tallenna taso
(.bin)`) ja kokoaa sen näytöt yhdeksi kartaksi: L×K-näyttöjen tasosta tulee
(L·40)×(K·25)-kartta väreillä, tyhjät kohdat ovat välilyöntejä. Kartat ovat
rajoitettu 255×255 soluun, joten taso voi olla enintään 6 näyttöä leveä ja 10
näyttöä korkea.

```basic
kartan lataus "level.bin" # 2x5 näyttöä -&gt; yksi 80x125 kartta
```

**Karttadatan sijoittaminen (uusi versiossa 1.6.1).** `map load "file", addr`
tallentaa kartan kiinteään osoitteeseen koodin sisäisen osoitteen sijaan, kuten
`incbin "file", addr` (osoitteen on oltava luodun koodin yläpuolella tai
`org`-välin sisällä). Merkit tulevat ensin, värit seuraavat:

```basic
kartan lataus "level.bin", $4000 # 80x125 kartta: merkit $4000-$6713, värit $6714-$8E1F
```

#### Tasainen vieritys — `karttanäkymä` (uusi versiossa 1.6.1)

```basic
kartan lataus "level.bin", $4000
muuttuja px: sana = 0
muuttuja py: sana = 0
silmukka
karttanäkymä px, py # kerran kehystä kohden, `wait raster` sijaan
# lue ohjainsauva, muuta px / py, pelilogiikka ...
loppu
```

`karttanäkymä x, y` näyttää kartan pikselikohdassa `x, y` (sanalausekkeet;
`0..(leveys-40)*8` ja `0..(korkeus-25)*8`, alueen ulkopuoliset arvot on
lukittu). Kutsutaan kerran kehystä kohden: se odottaa kehyksen reunaa
(rasteririvi 250), näyttää edellisen kutsun antaman sijainnin ja ottaa sitten
uuden, joten sijainti ilmestyy yhden kehyksen myöhemmin.

Toimintaperiaate: hieno-osainen osa käyttää XSCROLL / YSCROLL-metodia kohdassa
`$D016` / `$D011` 38 sarakkeella ja 24 rivillä (sisään vieritetty reuna pysyy
piilossa); merkkivaiheet vaihtavat kaksi näyttöpuskuria, `$0400` ja `$3C00`.
Sijainti ennustetaan kaksi kehystä eteenpäin ja piilotettu puskuri rakennetaan
seuraavalle merkkisolulle kahteen osaan ennen kuin näkymä saapuu sinne, joten
vaihto ei koskaan odota. Väri-RAMia ei voida puskuroida kahdesti: sen yläosa
kopioidaan viimeiseen vanhaan kehykseen rasterisäteen taakse, alaosa heti sen
edessä olevan vaihdon jälkeen (molemmissa keskeytykset on peitetty muutamalla
rasteririvillä), joten mikään ei repeä. Suunnanmuutos juuri merkkivaiheessa
saattaa pitää näkymää paikallaan yhden tai kahden kehyksen ajan, kun puskuri
rakennetaan uudelleen.

Säännöt:

- Ohjelmakoodin ja inline-datan on pysyttävä `$3C00-$3FFF` (toinen puskuri)
  ulkopuolella; lataa suuret kartat osoitteella (`map load "file", $4000`),
  muuten kääntäminen pysähtyy virheeseen.
- Ensimmäinen `karttanäkymä` piirtää koko näkymän kohteeseen `$0400`. Tämän
  jälkeen näyttö kuuluu karttanäkymään `: `print` / `screen` / `cls` kirjoittaa
  vain `$0400` ja ne korvataan.
- Spritet toimivat normaalisti: `map view` kopioi sprite-osoittimet
  `$07F8-$07FF` pisteisiin `$3FF8-$3FFF` joka ruudussa, joten `sprdef` /
  `sprite_frame` näkyvät molemmissa puskureissa. Pidä sprite-tiedot VIC-pankissa
  0 (`$0000-$3FFF`, ei `$1000-$1FFF`), esim. asettamalla `sprdef` ennen suurta
  `map load` -komentoa.
- Muodon `$D018` merkistöbitit säilytetään (` merkistö toimii kohdassa `);
  muodon `$D016` moniväribitti säilytetään, koska `map load` sen asettaa.
- Jätä noin 6000 sykliä (~95 rasteririviä) pelilogiikkaa kehystä kohden; pidempi
  kehys pitää näkymän samana yhden ruudun ajan, mutta ei koskaan repeä.
- Esimerkki: `examples/level_scroll_demo.ub` (ohjaussauvalla ohjattava,
  pelaajakuvalla).

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
koala lataa "pictures/title.kla" # validoi ja upota käännösaikana
koala show # siirry bittikarttakuvan moniväritilaan
koala hide # palaa oletusarvoiseen tekstinäyttöön
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

### Koodin asettelu: `org` — uutta versiossa 1.5.7

```basic
sub a() ... end # ali-/funktiot sijoitetaan peräkkäin pääosan lopusta
org $4000 # seuraavat ali-/funktiot jatkuvat kohdasta $4000; $xxxx-$3FFF pysyy nollilla täytettynä
sub b() ... end
incbin "font.bin", $3800 # tiedot voivat sijaita aukossa ($3800-$3FFF on kokonainen VIC-merkistöpaikka)
```

`org addr` siirtyy **ali-/fn-määritelmien väliin** (sitä ei huomioida pääosiossa
ja se toimii vain toisella kierroksella). Aliohjelmat eivät koskaan osu
toisiinsa, joten ohitetut tavut täytetään vain nollilla ja varataan: kokonaan
aukon sisällä oleva `incbin "f", addr` kirjoitetaan siihen, eikä `charset on`
lasketa koodiksi. Nollatavut ovat osa `.prg`-tiedostoa. Nykyisen koodin lopun
alapuolella oleva `org` on käännösaikainen virhe. Kaikki viimeisen aliohjelman
jälkeen luotu (avustajat, `data`-taulukot) seuraa viimeistä aliohjelmaa eli
sijoittuu aukon yläpuolelle.

### Mukautettu merkistö (`charset on` / `charset off`, uusi versiossa 1.5.7)

```basic
charset $3800 # aseta chardefin perusosoite (oletusarvo $3800)

chardef 65 # määrittele merkki 65 ('A') uudelleen
$18,$3C,$66,$7E,$66,$66,$66,$00
end

chardef 66 # alle 8 tavua on täytetty nollilla
$7C,$66,$7C,$66,$7C
end
```

`charset base` asettaa kohdeosoitteen, jota käytetään kaikissa seuraavissa
`chardef`-lausekkeissa. `chardef id ... end` upottaa 8 tavua koodisegmenttiin
(jota edeltää `JMP` niiden ohittamiseksi) ja kopioi ne sitten suorituksen aikana
segmenttiin `charset_base + id*8`. Arvojen on oltava käännösaikaisia vakioita,
jotka on kirjoitettu muodossa `$xx` tai desimaalilukuina. Lekseri ei tue
binääriliteraaleja **`%` (käyttöohjeessa sanottiin niin ennen versiota 1.5.7 –
se oli väärin).

`charset addr` asettaa vain `chardef`-kohteen; se ei lähetä koodia. Saadaksesi
VIC-II:n käyttämään joukkoa, kytke se päälle (ja pois päältä uudelleen, kun olet
valmis):
```basic
charset $3800
chardef 1 $FF,$81,$81,$81,$81,$81,$81,$FF end # laatikon reuna
charset on # VIC-II lukee merkkejä laatikosta $3800 (näyttömatriisi koskematon)
...
charset off # takaisin ROM-joukkoon ($1800, jos `pienet kirjaimet` ovat aktiivisia, muuten $1000)
```

`charset on` read-modify-writes `$D018` bitit 1-3 viimeisestä `charset addr`
(oletusarvo `$3800`); näyttömatriisin bitit säilyvät. Osoitteen on oltava
`$800`:n monikerta VIC-pankin 0 sisällä (`$0000-$3FFF`), muuten kyseessä on
käännösvirhe. Molemmat lauseet käyttävät viimeksi käännettyä `charset addr`:ää,
joten säilytä direktiivi pääohjelman rungossa (aliohjelmarungot käännetään sen
jälkeen). Vastaava raaka kirjoitus on `poke $D018, $1A` arvolle `$2800` tai
`poke $D018, $1E` arvolle `$3800`.

**Päällekkäisyyden tarkistus.** `charset on` varaa koko 2 kt:n joukon ja
jokainen `chardef` sen 8 tavua. Jos luotu koodi ulottuu tälle alueelle, koonti
pysähtyy kohtaan `the program code ($080D-$xxxx) overlaps the charset area
$2800-$2FFF; move the charset ...`. Suuret ohjelmat tarvitsevat siksi koodin
yläpuolella olevan joukon (`charset $3800`) — tai käytä `org` (yllä), jotta
koodi voi jatkua joukon yläpuolella. `org`-väliin sijoitettua dataa (`incbin
..., addr`) ei lasketa koodiksi.

### Muisti

```basic
poke $D020, 2 # STA $D020
poke addr_var, 6 # STA (addr_var),Y — jos addr_var on sanatyyppi
var v = peek($D012) # LDA $D012
var v = peek(addr_var) # LDA (addr_var),Y — jos addr_var on sanatyyppi

var w: word = peek16($C000) # lue 16-bittinen little-endian: lo=$C000, hi=$C001
poke16 $0314, $EA81 # kirjoita 16-bittinen little-endian: lo→$0314, hi→$0315
poke16 ptr, w # sanamuuttujan osoite; sana muuttuja arvona

muuttuja k = 2
muuttuja p = peek($07F8 + k) # LDA $07F8,Y — vakio + tavu muuttuja
poke $07F8 + k, p # STA $07F8,Y
poke ptr + k, 1 # sana + tavu: täysi 16-bittinen osoite
```

`peek16(addr)` lukee kaksi peräkkäistä tavua (lo, hi) `word`-muodossa. `poke16`
kirjoittaa ensin lo ja sitten hi.

Osoite on aina 16-bittinen arvo. Versiosta 1.6.5 lähtien osoitelauseke, kuten
`$07F8 + k`, säilyttää vakion korkeamman tavun ja siirtobitin (ennen se
laskettiin 8 bitissä ja `peek($07F8 + k)` luki `$00F8 + k`). Tämä pätee `peek`,
`poke`, `peek16`, `poke16`, `fill`, `memcopy`, `drawmem`, `save` ja `reu`
-muuttujalle; `fill` / `memcopy` -pituudet, kuten `40 * rivit`, ovat myös
16-bittisiä. `peek(k)` tavumuuttujan kanssa lukee osoitteen `$00kk` (se palautti
itse arvon `k` ennen versiota 1.6.5).

### Levyn I/O

```basic
load "PROGRAM" # KERNAL LOAD: lataa tiedoston laitteelta 8 sen alkuperäiseen osoitteeseen
load "DATA", $C000 # lataa tiedoston tiettyyn osoitteeseen
chain "GAME" # lataa toinen ohjelma tämän päälle ja SUORITA se (katso alla)
load "DATA", ptr # osoite sanamuuttujasta

save "DATA", $C000, 4096 # KERNAL SAVE sanasta $C000, 4096 tavua → laite 8
save "PROG", start, len # osoite ja pituus sana-/int-muuttujista
```

`load` kutsuu KERNAL `SETNAM`+`SETLFS`+`LOAD` (`$FFBD`/`$FFBA`/`$FFD5`)
-funktiota. Ilman osoitetta: toissijainen osoite 1 (tiedoston oma 2-tavuinen
otsikko on latausosoite). Osoitteen kanssa: toissijainen osoite 0 (tiedosto
ladataan annettuun osoitteeseen, sen otsikko ohitetaan). (Korjattu versiossa
1.5.9 — aiemmin nämä kaksi olivat vaihtaneet paikkaa: `load "F"` ladattu
kohteeseen `$0000`.) `save` kutsuu funktiota `SETNAM`+`SETLFS`+`SAVE`
(`$FFBD`/`$FFBA`/`$FFD8`). Vaatii sekä `addr` että `len`.

#### Ketjuttaminen toiseen ohjelmaan — `ketju` (uusi versiossa 1.5.9)

```basic
chain "GAME" # lataa GAME käynnistysasemalta ja SUORITA se
chain "GAME", 9 # asemalta 9 (mikä tahansa lauseke)
print "LOAD ERROR" # saavutetaan vain, jos tiedostoa ei voitu ladata
```

`chain` lataa toisen ohjelman omaan latausosoitteeseensa — normaalisti `$0801`,
suoraan käynnissä olevan ohjelman päälle — ja käynnistää sen täsmälleen ikään
kuin olisi kirjoitettu `LOAD"GAME",8,1` ja `RUN`. Tätä tarvitsee
käynnistys-/title-ohjelma. Tavallinen `load` ei voi tehdä tätä: ladattu tiedosto
korvaa `load`-komentoa suorittavan koodin.

Näin se toimii:

- 46-tavuinen, sijainnista riippumaton lataaja ja tiedostonimi kopioidaan
  kasettipuskuriin (`$033C`), jonka yli ei lataudu Ultimate Basic -ohjelma eikä
  Exomizerilla pakattu tiedosto.
- Ennen sitä kone palautetaan puhtaaseen tilaan: VIC-IRQ:t pois päältä,
  SID-äänenvoimakkuus 0, `IOINIT` (`$FDA3`: CIA-ajastimet, näppäimistön IRQ,
  sarjaväylä), `RESTOR` (`$FF8A`: oletus-IRQ/BRK/NMI- ja I/O-vektorit), `$01 =
  $37`. Mukautetut rasteri-IRQ:t, `musiikin toisto` ja `nmi` -käsittelijät
  pysähtyvät. Näyttö, värit ja VIC-pankkirekisterit `$DD00` lukuun ottamatta
  jätetään ennalleen, joten kuva voi pysyä näytöllä seuraavan ohjelman
  latautumisen ajan (`IOINIT` valitsee VIC-pankin 0).
- Lataaja kutsuu funktiota `SETNAM` / `SETLFS` (toissijainen 1) / `LOAD`. Ilman
  laiteargumenttia se käyttää asemaa, josta ohjelma itse ladattiin (`$BA`), tai
  asemaa 8.
- Onnistuneen latauksen jälkeen se asettaa ohjelman loppuosoittimen (`$2D/$2E`),
  alustaa BASICin uudelleen (`$E453`, `$E3BF` — itsepurkautuva murskaustyökalu,
  kuten Exomizer `sfx`, on saattanut käyttää BASICin nollasivua) ja SUORITAA
  ohjelman (`$A659`, `$A7AE`). Se toimii sekä Ultimate Basic -ohjelmien,
  murskattujen (`exomizer sfx sys`) tiedostojen että tavallisten BASIC-ohjelmien
  kanssa.
- Jos tiedostoa ei voida ladata (ei löydy, ei asemaa), `chain` palauttaa ja
  ohjelma jatkuu seuraavalla lausekkeella.

Tiedostonimen on oltava merkkijono, jonka pituus on 1–16 merkkiä.

### Sarjakanavan tiedosto I/O

```basic
open 1, 8, 2, "MYFILE" # avaa looginen tiedosto 1, laite 8, toissijainen 2, nimi "MYFILE"
open 2, 4, 7 # avaa tulostin (laite 4), ei tiedostonimeä
open ch, dev, sec # kanava, laite, toissijainen muuttujista

print# 1, "HELLO" # lähetä "HELLO"+CR loogiseen tiedostoon 1
print# ch, x, "text" # mikä tahansa sekoitus muuttujia, merkkijonoja — sama kuin print, mutta tiedostoon

close 1 # sulje looginen tiedosto 1
close ch # kanava muuttujasta
```

`open` kutsuu `SETNAM` ($FFBD) + `SETLFS` ($FFBA) + `OPEN` ($FFC0). Ilman
tiedostonimeä kutsutaan SETNAM-metodia, jonka pituus on 0. `print#` reitittää
tulosteen `CHKOUT` ($FFC9) kautta, CHROUT per merkki (+ lopun CR) ja sitten
`CLRCHN` ($FFCC). `close` asettaa kanavanumeron A:han ja kutsuu `CLOSE` ($FFC3).

### Syöttö

```basic
input score # lue jopa 3 numeroa näppäimistöltä → 8-bittinen kokonaisluku muuttuja
input "Nimi: ", nimi # valinnainen kehotemerkkijono, sitten lue rivi → merkkijono muuttuja
input "Pisteet: ", score # kehote + kokonaisluku input
```

`input` käyttää KERNAL BASINia (`$FFCF`) kaiutetun linjatulon estoon DEL-tuella.
- **Int-muuttuja**: hyväksyy vain `0`–`9`, enintään 3 merkkiä; muuntaa
  8-bittiseksi arvoksi CR:ssä.
- **Merkkijonomuuttuja**: hyväksyy enintään 30 merkkiä; tallentaa
  null-päätteisenä merkkijonona; ZP-pari päivitetään.
- **FLOAT muuttuja** (1.6.3): numerot ja `.`, esim. `12.5` → 12.50 (kaksi
  desimaalia).
- **YKSITTÄINEN / KAKSINKERTAINEN muuttuja** (1.6.4): mikä tahansa luku,
  `-12,5`, `.5`, `3,25E2`.
- **Taulukon elementti** (1.6.3): `input t(i)` / `input nevek(i)`; `input
  "kehote"; x` toimii myös.
- **Merkkijono muuttuja**: hyväksyy enintään 30 merkkiä; tallentaa
  null-päätteisenä merkkijonona; ZP-pari päivitetään.

### Liukuluku / Kiinteäpisteinen

`float`-muuttujat käyttävät Q8.8-kiintolukumuotoa: korkeampi tavu on
kokonaislukuosa (0–255) ja alempi tavu on desimaaliosa (0/256 … 255/256).

```basic
var f: float = 3.5 # 3.5 → hi=3, lo=128 (= 0x0380)
var g: float = 0 # kokonaisluku 0 ylennetään automaattisesti arvoon 0.0

f = 1.5 # Q8.8 literaalin osoitus
f = f + 1.5 # 16-bittinen Q8.8 aritmeettinen laskutoimitus (tulos: 3.0)
f = f + g # float + float

var n = int(f) # kokonaislukuosan poimiminen (hi byte) → 8-bittinen int
print f # tulostaa muodossa "N.DD" (esim. 3.5 → "3.50", 1.25 → "1.25")
```

| Käyttö              | Esimerkki            | Muistiinpanoja                                |
| ------------------- | -------------------- | --------------------------------------------- |
| Kirjaimellinen      | `3,5`, `0,25`, `1,0` | jäsennetty Q8.8:ksi käännösaikana             |
| Kokonaislukuylennys | `f = 5`              | myymälät 5.0 (korkea=5, matala=0)             |
| Lisää/tilaa         | `f + 1,5`, `f - g`   | 16-bittinen Q8.8-aritmeettinen                |
| Poimi kokonaisluku  | `int(f)`             | palauttaa hi-tavun 8-bittisenä kokonaislukuna |
| Painaa              | `tulosta f`          | muoto "N.DD", aina 2 desimaalilukua           |

**Varoitus:** Aritmeettinen ylivuoto päättyy kohtaan 255.255 (ei saturaatiota).
Kahden liukulukumuuttujan kerto- ja jakolaskuja ei vielä tueta – käytä näissä
tapauksissa `int()` + kokonaislukuaritmetiikkaa.

** Liukulukulausekkeiden tulostaminen (korjattu versiossa 1.5.7).** `print`
aritmeettisesta lausekkeesta, jossa on `float` (esimerkiksi `print a / 10`,
jossa `a: float = 1`) tulostaa nyt Q8.8-tuloksen muodossa `N.DD`. Ennen versiota
1.5.7 se tulosti raakana 16-bittisenä arvona kokonaislukuna (`25` eikä `0.09`).
Murtoluku katkaistaan, ei pyöristetä: 1/10 = 25/256 tulostuu muodossa `0.09`.

### Liukuluku: `YKSI` / `KAKSINKERTAINEN` (1.6.4)

`dim x as single` ja `dim x as double` ovat reaalilukuja liukulukuina – C64
BASICin 5-tavuinen formaatti: noin 9 merkitsevää numeroa, vaihteluväli
±2,9·10⁻³⁹ … ±1,7·10³⁸. (`single` ja `double` ovat samaa tyyppiä.) Nopea
2-tavuinen Q8.8-tyyppi on edelleen saatavilla muodossa `float`.

```basic
DIM r AS DOUBLE, t AS DOUBLE
DIM k(9) AS SINGLE ' taulukot: 5 tavua elementtiä kohden
r = 2,5
t = ATN(1) * 4 * r ^ 2 ' 19,6349541
PRINT t; " "; SQR(2); " "; 1E10; " "; 1 / 3
FOR r = 0 TO 1 STEP 0,25 : PRINT r : NEXT
FUNCTION Atfogo(a AS DOUBLE, b AS DOUBLE) AS DOUBLE
Atfogo = SQR(a * a + b * b)
END FUNCTION
```

|                   |                                                                                                                                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Operaattorit      | `+ - * /` ja `^` (potenssi; oikealle assosiatiivinen, sitoo tiukemmin kuin unaarinen miinus: `-2^2` = -4)                                                                                  |
| Toiminnot         | `SQR`, `SIN`, `COS`, `TAN`, `ATN` (radiaanit), `EXP`, `LOG` (luonnollinen), `INT` (lattia), `FIX` (katkaistu), `CINT` (pyöreä), `ABS`, `SGN`, `CSNG` / `CDBL` (ei toimintoa), `VAL`, `RND` |
| `MOD`             | `a MOD b` = `a - b * FIX(a / b)` (funktion `a` etumerkki, kuten VB / C `fmod`): `7.5 MOD 2` = 1.5; `x MOD 0` = x                                                                           |
| `RND`             | liukulukulausekkeessa `RND` / `RND()` on satunnaisluku 0 ≤ x < 1 (`d = RND`, `x = RND * 6`); `rnd(n)` pysyy kokonaislukuna 0 … n-1                                                         |
| Literaalit        | `1,5`, `.5`, `1E6`, `2,5e-3`, `70000`                                                                                                                                                      |
| Vertailut         | `= &lt;&gt; &lt; &gt; &lt;= &gt;=` kohdassa `IF` / `WHILE` / `UNT` / `SELECT CASE` ja arvoina                                                                                              |
| Tulostaminen      | C64 BASIC-tyyli: `.5`, `-3.25`, `3.33333333`, `1E+10`, `1.5E-07` (ei välilyöntiä alussa, ellei `--basic-print`); kiinteät desimaaliluvut `PRINT USING` -komennolla                         |
| Jouset            | `s = "X=" + x`, `STR$(x)`, `VAL(s)` lukee `-1.25E3`                                                                                                                                        |
| `FOR`             | liukulukulaskuri, raja ja askel (`STEP 0.1`, negatiivinen tai muuttuja)                                                                                                                    |
| `SYÖTTÖ` / `LUKU` | `INPUT x` lukee minkä tahansa numeron; `READ x` lukee seuraavan `data` tavun                                                                                                               |
| Ali-/toiminto     | `p AS DOUBLE` -parametrit ja `AS DOUBLE` -tulokset                                                                                                                                         |

**Sekoittaminen kokonaislukujen kanssa.** Lauseke lasketaan liukulukuvakiona,
kun se sisältää YKSITTÄISEN / KAKSINKERTAISEN arvon, `^`, jonkin yllä olevista
funktioista tai literaalin, jota vain liukuluku voi sisältää (`1E6`, `300.5`,
`70000`). Kun ohjelma käyttää liukulukua, jokainen desimaaliliteeri (`0.1`) on
myös liukulukuvakio. Liukulukuarvon tallentaminen `tavuun`, `kokonaislukuun` tai
`sanaan` ** pyöristää sen** (puoliksi pois nollasta: 2,5 → 3, -2,5 → -3);
`liukulukuun` siitä tulee Q8,8. DOUBLE-muuttujalle annettu kokonaislukuarvo
muunnetaan tarkasti. Kokonaislukulausekkeet säilyttävät kokonaislukusäännöt
(`muuttuja c = a + b` on edelleen tavu).

**Muistiinpanot**
- Kokonaislukuliteraali välillä 32768–65535 säilyttää arvonsa lausekkeessa, joka
  lasketaan liukulukuina (`d = 40000`, `d + 50000`). Lauseke lasketaan
  liukulukuksi, kun se nimeää YKSITTÄIS-/KAKSINKERTAISMUUTTUJAN, taulukon,
  parametrin tai funktion tai käyttää `^`, vain liukulukuja sisältävää
  literaalia tai jotakin yllä olevista funktioista; muualla tällainen literaali
  on 16-bittinen kuvio kuten aiemmin (` lisää 53280, 1`, `w = 40000` SANAAN).
  Muuttujaa, josta tuli liukuluku vain muutoksen `var x = 2.5` kautta, ei
  lasketa – kirjoita siihen `40000.0`.
- `7 / 2` on 3,5, kun se on liitetty KAKSINKERTAISEEN; kokonaislukukontekstissa
  se on 3 kuten ennenkin.
- `JA` / `TAI` / `XTAI` pyöristävät operandinsa kokonaisluvuiksi.
- Tavun arvon `SIN` / `COS` säilyttävät vanhan 0–255-taulukon merkityksen (täysi
  ympyrä = 256); YKSITTÄISEN / KAKSINKERTAISEN argumentin kanssa ne toimivat
  radiaaneina.
- IRQ-/NMI-käsittelijät voivat käyttää liukulukua: `irq`, `nmi` tai `cia_timer`
  -niminen alifunktio, joka (suoraan tai kutsumiensa alifunktioiden kautta)
  käyttää SINGLE / DOUBLE -menetelmää ja tallentaa ajonaikaisen tilan sen alussa
  ja palauttaa sen ennen `irq_exit` / `nmi_exit` -menetelmää (noin 4–5 tuhatta
  sykliä keskeytystä kohden). Käsittelijöitä, joilla ei ole liukulukua, ei
  hidasteta. Ei sisälly: osoitteen tai sanamuuttujan asettama käsittelijä tai
  käsittelijä, joka poistuu pelkällä `RTS` / `RTI`.
- Kustannukset: kääntäjä kokoaa liukulukulaskufunktion ja liittää sen ohjelman
  loppuun; vain ohjelman käyttämät rutiinit sisällytetään (noin 2 kt funktioille
  `+ - * /` ja `PRINT`, noin 5 kt kaikkine funktioineen ja `PRINT USING`).
  Muuttujat vievät 5 tavua taulukkoalueella sekä yhden 2-tavuisen nollasivuisen
  osoittimen ajonaikaista toimintaa varten. Kertolasku kestää noin 1–2 ms 1
  MHz:n C64-prosessorilla.

### RAM-muistin muuttujat, taulukkomuisti (1.6.4)

- **Nollasivu täynnä:** Kun ohjelman muuttujat eivät mahdu pysyvälle
  nollasivulle (`$02-$4F`), kääntäjä rakentaa sen uudelleen ja siirtää vähiten
  kuumassa koodissa käytetyt muuttujat normaaliin RAM-muistiin (taulukoiden
  jälkeen). Tällaista muuttujaa käyttävä lauseke kopioi sen nollasivun paikkaan
  ja takaisin, joten ohjelmat toimivat samalla tavalla, vain nämä muuttujat ovat
  hieman hitaampia. Silmukkalaskurit, parametrit ja kaikki, mihin
  IRQ-käsittelijä saattaa koskea, pysyvät nollasivulla. Muistikartta näyttää ne
  muodossa `RAM:$xxxx`. Nollasivun loppuminen ei ole enää virhe paitsi
  äärimmäisissä tapauksissa (`nollasivun loppuminen` on edelleen käytössä
  niille).
- **Matriisimuisti:**-taulukot (ja vuotaneet / liukulukumuuttujat) käyttävät
  `$C000-$CFFF`. Kun ne tarvitsevat yli 4096 tavua, alue alkaa kohdasta `$A000`,
  jolloin saadaan 12 kt (`$A000-$CFFF`): BASIC ROM sammutetaan ohjelman alussa
  (`$01` bitti 0) ja kytketään takaisin päälle joka kerta, kun BASIC-tilaan
  siirrytään (`end`, `bye`, end of program, `chain`), joten ohjelma palaa silti
  toimivaan BASIC-tilaan. Ohjelmat, jotka kutsuvat itse BASIC ROM -rutiineja
  (`sys $Axxx`), eivät saa käyttää yli 4 kt:n taulukoita.

### Matemaattiset funktiot

```basic
var a = abs(x - 20) # kahden komplementin itseisarvo
var b = min(x, 39) # 8-bittinen minimi
var c = max(x, 0) # 8-bittinen maksimi
var s = sgn(pisteet) # 0 = nolla, 1 = positiivinen (1–127), $FF = negatiivinen (128–255)
var r = rnd() # LCG pseudo-satunnainen 0-255; siemen rasteririviltä
# (0 &lt;= x &lt; 1 YKSITTÄIS- / KAKSINKERTAISESSA lausekkeessa: d = rnd)
var r = rnd(10) # LCG pseudo-satunnainen 0-9 (rnd() mod n; tulos 0..n-1)
var s = sin(kulma) # sini: kulma 0-255 (täysi ympyrä), palauttaa 0-255 (keskipiste=128)
var c = cos(kulma) # kosini = sin(kulma+64)
var v = clamp(x, 0, 39) # 8-bittinen etumerkitön clamp: tulos = max(lo, min(hi, val))

print hex(n) # tulosta 2-numeroisena isona heksalukuna
print bin(n) # tulosta 8-bittisenä binäärimerkkijonona
```

### Merkkijonofunktiot

```basic
var n = len(msg) # null-päätteisen merkkijonon pituus var (0–255)
var c = asc(msg) # ensimmäisen merkin PETSCII-koodi (0, jos tyhjä)
var c = asc("A") # käännösaikainen: vakio PETSCII-koodi
var n = val(s) # suorituksenaikainen: desimaalimuotoisen PETSCII-merkkijonon jäsentäminen → 8-bittinen kokonaisluku (esim. "042" → 42)
var c = msg[i] # merkkijonomerkki indeksissä i: msg[i]:n PETSCII-koodi
msg[i] = c # kirjoita PETSCII-tavu c merkkijonoon indeksissä i — STA (ptr),Y
msg[0] = 72 # vakioindeksi → LDY #0; STA (ptr),Y
```

### Numeroiden muotoilu

```basic
print hex(n) # tulosta kaksinumeroisena isona heksalukuna
print bin(n) # tulosta 8-bittisenä binäärimerkkijonona
print dec(n, 4) # oikealle tasattu desimaaliluku neljän merkin kentässä (esim. 42 → " 42")
print dec(n, width) # width voi olla myös muuttuja
```

`dec(n, width)` täyttää vasemmalla olevan luvun välilyönneillä, jotka täyttävät
`width` merkit. Jos luvussa on enemmän numeroita kuin `width`, se tulostetaan
ilman täyttöä (ei katkaisua). Muissa kuin tulostusyhteyksissä `dec(n, w)`
arvoksi saadaan `n` muuttumattomana (sama kuin `hex`/`bin`).

### REU (RAM-laajennusyksikkö)

```basic
var ok = reu_present() # 1 jos REU havaittu, 0 jos ei (kirjoitus-/lukutesti $DF04:lle)
var ok = reudet() # alias reu_present():lle

reu stash c64addr, bank, reu_addr, len # kopioi C64 → REU
reu fetch c64addr, bank, reu_addr, len # kopioi REU → C64
reu swap c64addr, bank, reu_addr, len # vaihto C64:n ja REU:n välillä
```

`reu_present()` suorittaa kirjoitus-/lukutestin REU-rekisterille `$DF04`. Ilman
REU:ta kirjoitus menetetään (avoin väylä), joten luku toimii eri tavalla — se
havaitsee läsnäolon luotettavasti koskematta mihinkään sivuvaikutteiseen
komentorekisteriin.

| Parametri    | Leveys      | Muistiinpanoja                                                             |
| ------------ | ----------- | -------------------------------------------------------------------------- |
| `c64osoite`  | 16-bittinen | C64 RAM-muistin käynnistys — vakio, `word` muuttuja tai 8-bittinen lauseke |
| `pankki`     | 8-bittinen  | REU-pankkinumero (0–7 512 kt:n yksikölle)                                  |
| `reu_osoite` | 16-bittinen | Vastasiirto REU-pankin sisällä                                             |
| `pituus`     | 16-bittinen | Siirrettäviä tavuja (`0` = 65 536 REU-laitteistossa)                       |

REU-rekisterit: `$DF01` komento (`$B0` stash / `$B1` fetch / `$B2` swap),
`$DF02–$DF03` C64-osoite, `$DF04–$DF05` REU-offset, `$DF06` bank, `$DF07–$DF08`
pituus. Tiedonsiirto on synkroninen (suoritin pysäytetty DMA:n aikana). Vaatii
oikean REU:n tai VICE:n: **Asetukset → Laitteisto → RAM-laajennusmoduuli**.

### Muistiapuohjelmat

```basic
fill screen 32 # täytä näytön RAM-muisti $0400–$07FF arvolla 32 (välilyönti)
täyttöväri 1 # täyttöväri RAM-muisti $D800–$DBFF arvolla 1 (valkoinen)

täytä $0400, 1000, 32 # täytä 1000 tavua alkaen kohdasta $0400 arvolla 32
täytä osoite, 256, 0 # osoite voi olla sanamuuttuja
täytä ptr, len_word, val # kaikki operandit voivat olla lausekkeita / sanamuuttujat

memcopy $C000, $0400, 256 # kopioi 256 tavua kohteesta $C000 → $0400
memcopy src_ptr, dst_ptr, 40 # sanamuuttujat lähteelle ja kohteelle

drawmem $C000, $0400, 8, 10, 40 # kopioi 8×10 suoraan kohteesta $C000 → näyttö kohdassa $0400, askelmäärä 40
drawmem src_ptr, dst_ptr, w, h, 40 # sanamuuttujat src/dst:lle
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
irq my_handler # rasterin IRQ rivillä 0, käsittelijä = alinimi tai osoite
irq my_handler, 100 # rasterin IRQ rasteririvillä 100
irq $C800, 200 # käsittelijä kiinteässä osoitteessa
irq addr_word # käsittelijän osoite sanamuuttujasta
```

Asettaa rasteri-IRQ:n BASIC-ohjelmistovektorin (`$0314`/`$0315`) kautta):
poistaa CIA1-ajastimen IRQ:n käytöstä, kuittaa odottavat VIC-IRQ:t, kirjoittaa
rasteririvin kohtaan `$D012`, ottaa VIC-rasteri-IRQ:n käyttöön (`$D01A=$01`),
kirjoittaa käsittelijän osoitteen ja ottaa keskeytykset uudelleen käyttöön.

Käsittelijän **täytyy** päättyä `sys $EA81` (KERNAL-IRQ:n loppuosa) — pelkkä
`RTS` tai `RTI` korruptoi pinon. Kuittaa VIC-IRQ ensin:

```basic
sub my_handler()
poke $D019, $FF # ACK VIC IRQ
# ... toimii tässä ...
sys $EA81 # JMP KERNALille IRQ:n loppu
end
```

Eteenpäin viittauksia tuetaan (`irq my_handler` ennen kuin ali on määritelty).

Käsittelijä-ali voi käyttää YKSITTÄISTÄ / KAKSINKERTAISTA liukulukua: se
tallentaa ja palauttaa ajonaikaisen tilan rungon ympärille (katso *Liukuluku*).

### NMI-käsittelijä

```basic
nmi my_nmi # aseta NMI-vektori $0318/$0319 käsittelijän aliosoitteeseen tai osoitteeseen

sub my_nmi()
# ... NMI toimii tässä ...
nmi_exit # JMP $FE47 — oikea NMI-exit (palauttaa A/X/Y + RTI)
end
```

`nmi handler` kirjoittaa käsittelijän osoitteen NMI-pehmeään vektoriin
(`$0318`/`$0319`). Laitteiston NMI-vektori kohdassa `$FFFA` osoittaa KERNAL NMI
-rutiiniin, joka haarautuu `$0318`:n kautta. Käsittelijän **täytyy** päättyä
`nmi_exit` (päättyy `JMP $FE47`) — pelkän `RTI`:n käyttö korruptoi pinon.
Eteenpäin viittaukset tuettuja.

### CIA1-ajastimen keskeytys

```basic
cia_timer 19656, my_handler # CIA1-ajastin A: laukeaa 19656 syklin välein (~50 Hz PAL)
cia_timer period, handler # period voi olla muuttuja tai lauseke
```

Asettaa CIA1-ajastimen A jaksolliseksi IRQ-lähteeksi BASIC-ohjelmistovektorin
(`$0314`/`$0315`) kautta):
1. SEI — poista keskeytykset käytöstä
2. `$DC0D = $7F` — poista kaikki CIA1-IRQ:t käytöstä
3. Lataa 16-bittinen jakso lo→`$DC04`, hi→`$DC05`
4. Kirjoita käsittelijän osoite osoitteeseen `$0314`/`$0315`
5. `$DC0D = $81` — ota käyttöön CIA1-ajastimen A IRQ
6. `$DC0E = $01` — käynnistä ajastin A jatkuvassa tilassa
7. CLI — ota keskeytykset uudelleen käyttöön

Käsittelijän on päätyttävä `irq_exit` (tai `sys $EA81`) ja sen pitäisi kuitata
CIA1-keskeytyksen:

```basic
sub my_handler()
poke $DC0D, $01 # ACK CIA1-ajastimen A IRQ (lue myös tyhjentää sen)
# ... toimii tässä ...
irq_exit # JMP $EA81: palauta A/X/Y + RTI
end
```

PAL-ajoitus: kello = 985 248 Hz. Jakso 50 Hz:llä = 985 248 / 50 = 19 705 sykliä
≈ `$4CC9`. Eteenpäin suuntautuvia referenssejä tuetaan.

### Virheiden käsittely

```basic
onerr goto err_handler # aseta KERNAL I/O -virhevektorin ($0300/$0301) otsikkoon

...

otsikko err_handler
tulosta "I/O-VIRHE"
hei hei
```

`onerr goto label` kirjoittaa otsikon osoitteen (lo, hi) KERNAL-sijainteihin
`$0300` ja `$0301`. Kun KERNAL I/O -virhe tapahtuu (esim. epäonnistunut `load`
tai `open`), KERNAL suorittaa `JMP ($0300)`, joka haarautuu otsikkoon. Eteenpäin
suuntautuvia viittauksia (otsikko määritelty `onerr goto`-osoitteen jälkeen)
tuetaan.

### Käännösaikainen tiedostojen upottaminen (`incbin` skip / length, uusi versiossa 1.5.7)

```basic
incbin "sprites.bin" # upottaa raakabinääritavut nykyiseen koodipaikkaan
incbin "charset.bin", $2000 # upottaa absoluuttiseen osoitteeseen, täydentäen tarvittaessa
incbin "font.prg", $3C00, 2 # ...ohita kaksi ensimmäistä tavua (esim. .prg-latausosoite)
incbin "big.bin", $4000, 16, 256 # ...ohita 16 tavua, ota sitten enintään 256 tavua
include "defs.ub" # upottaa toisen .ub-lähdekooditiedoston (leksattu ja jäsennetty paikalleen)
```

`incbin "file", addr, skip [, length]` poistaa tiedostosta ensimmäiset `skip`
tavua (tyypillisesti `.prg`-tiedoston 2-tavuinen latausosoite) ja voi
halutessaan ottaa enintään `length` tavua; `skip` ja `length` ovat vakioita, ja
`skip` tiedoston lopun jälkeen on virhe. Osoitemuoto vaatii, että kohde on
luodun koodin yläpuolella — tai `org`-aukon sisällä.

### Data / Luettu

```basic
data 1, 2, 3, 255 # vakio tavutaulukko
lue muuttujan_nimi # lataa seuraavan tavun muuttujan_nimi-taulukkoon (automaattinen määrittely tarvittaessa)
```

Kaikki `data`-arvot kerätään käännösaikana. Ohjelmalle varataan ja alustetaan
automaattisesti 2-tavuinen ZP-osoitin. Jokainen `read` siirtää osoitinta
eteenpäin.

**Alustetut taulukot — `data <taulukko>: …` (uusi versiossa 1.5.8)**

```basic
var sinus = array(8)
data sinus: 128, 218, 255, 218
data sinus: 128, 37, 0, 37 # seuraavat rivit jatkuvat edellisestä
print sinus[i] # satunnaisluku, kuten mikä tahansa taulukko

var xpos = array_word(2)
data xpos: 24, 300 # sanataulukot ottavat 16-bittisiä arvoja (tallennettuna lo, hi)
```

Rivi `data`, jonka ensimmäinen alkio on `name:`, täyttää ilmoitetun `array` /
`array_word` -virran `read`-virran sijaan. Arvot tallennetaan koodin jälkeen ja
kopioidaan taulukkoon kerran ohjelman käynnistyessä (heti taulukoiden
nollaamisen jälkeen), joten taulukkoon voi kirjoittaa ja se indeksoidaan kuten
mikä tahansa muu taulukko. Enemmän arvoja kuin taulukossa on tai ilmoittamaton
nimi on käännösvirhe. Nämä rivit eivät vaikuta `read`-virtaan.

### Sisäänrakennettu kokoonpano

```basic
sys $FFD2 # JSR $FFD2
sys $FFD2, 7 # LDA #7 ; JSR $FFD2 (välitystavun arvo A-rekisterissä)
irq_exit # JMP $EA81 — oikean IRQ-käsittelijän poistuminen (palauttaa A/X/Y + RTI)
asm $EA, $EA # rivinsisäiset raakatavut (NOP NOP) — perinnemuoto
asm {
; Täydellinen 6502-mnemoniikka ja osoitustilat
LDA #$07 ; välitön
STA $0286 ; absoluuttinen
LDA $50 ; nollasivu ($50 ≤ $FF → ZP automaattisesti valittu)
STA $0400,X ; absoluuttinen,X indeksoitu
LDA ($50),Y ; (epäsuora),Y
LDA ($50,X) ; (epäsuora,X)
JSR $FFD2 ; aliohjelman kutsu
JMP $C000 ; absoluuttinen hyppy
JMP ($FFFC); epäsuora hyppy

CLC
ADC #1
SEC
SBC #1

VERO; implisiittinen / siirto
ASL A; akkumulaattori (myös vain: ASL)
LSR A
ROL
ROR

; Haarat — operandi on absoluuttinen osoite; siirtymä lasketaan automaattisesti
BNE-silmukka; eteen- tai taaksepäin suuntautuva haarautuminen paikalliseen otsikkoon
BEQ valmis

silmukka:
NOP
valmis:
RTS

; #<otsikko / #>otsikko — otsikkoosoitteen lo/hi-tavu
LDA #<käsittelijä
STA $0314
LDA #>käsittelijä
STA $0315

; * — nykyinen kokoonpanon sijainti
JMP *

; Raakat heksatavut (taaksepäin yhteensopiva vanhan asm { $xx ... } -syntaksin kanssa)
$EA $EA; kaksi NOP-tavua
}
```

**Osoitetilat:**

| Syntaksi       | Tila             | Tavut | Esimerkki                    |
| -------------- | ---------------- | ----- | ---------------------------- |
| (ei operandia) | Implisiittinen   | 1     | `EI `, `RTS `                |
| `A`            | Akkumulaattori   | 1     | `ASL A`, `LSR`               |
| `#arvo`        | Välitön          | 2     | `LDA #07`                    |
| `$zz` (0–255)  | Nollasivu        | 2     | `LDA 50 dollaria`            |
| `$zz,X`        | ZP,X             | 2     | `LDA $50,X`                  |
| `$zz,Y`        | ZP,Y             | 2     | `LDX $50,Y`                  |
| `$xxxx`        | Absoluuttinen    | 3     | `LDA 0400 $`                 |
| `$xxxx,X`      | Absoluuttinen, X | 3     | `LDA $0400,X`                |
| `$xxxx,Y`      | Absoluuttinen, Y | 3     | `LDA $0400,Y`                |
| `($xxxx)`      | Epäsuora         | 3     | `JMP ($FFFC)`                |
| `($zz,X)`      | (Epäsuora, X)    | 2     | `LDA (50 dollaria,X)`        |
| `($zz),Y`      | (Epäsuora), Y    | 2     | `LDA (50 dollaria),Y`        |
| `tarra`        | Suhteellinen     | 2     | `BNE label` (vain konttorit) |

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
poke $D020, border_col # UltimateBasic selvittää ZP-osoitteen
poke $D021, bg_col
asm { 
; arvot ovat jo $D020 / $D021 -kohdassa
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
numstr score, $0340 # kirjoittaa "042\0" kohtaan $0340 (aina 3 numeroa, nollilla täytetty)
var n = str_to_int("42") # käännösaikainen: Expr::Number(42)

print str$(score) # tulosta 8-bittinen kokonaisluku 3-numeroisena desimaalimerkkijonona ("000"–"255")
print "Score: " + str$(score) # käytettävissä merkkijono concat-tulostuskontekstissa
var s: string = str$(n) # määrittää str$()-funktion tuloksen merkkijonolle var (jaettu staattinen puskuri)
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

| Tiedosto                                      | Kuvaus                                                                                                       |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `esimerkkejä/ominaisuuksia.ub`                | vakio, label/goto, poke/peek, rnd, matemaattiset funktiot                                                    |
| `esimerkkejä/uudet_ominaisuudet.ub`           | aliparametrit, taulukot, sanamuuttujat, merkkijonomuuttujat                                                  |
| `esimerkkejä/bitmap_demo.ub`                  | 320×200 bittikartta, juoni, grafiikka päällä/pois                                                            |
| `esimerkkejä/lohkon_demo.ub`                  | 80×50 lohkografiikka, plot4, circle4, grafiikka lohkolla                                                     |
| `esimerkkejä/joystick_demo.ub`                | joystick-lukeminen, sprite-liike                                                                             |
| `esimerkkejä/mux_demo.ub`                     | rasterisprite-multiplekseri (3 ikkunaa × 8 sprittiä = 24)                                                    |
| `esimerkkejä/orbit_demo.ub`                   | 24-sprite-kiertorata pulssisäteellä ja satunnaisilla väreillä                                                |
| `esimerkkejä/plasma_demo.ub`                  | plasmaefektinen bittikartta rasteripalkkireunuksen animaatiolla                                              |
| `esimerkkejä/sprite_data.ub`                  | sprdef-muototiedot (sisältyvät muihin demoihin)                                                              |
| `esimerkkejä/sprite_mux_orbit.ub`             | 24-sprite-kiertoradan demo sprdefillä + esilasketuilla sijainneilla                                          |
| `esimerkkejä/sprite_orbit_demo.ub`            | 8 laitteistosprittiä ympyräradalla sin/cos-taulukon kautta                                                   |
| `esimerkkejä/reu_bitmap_demo.ub`              | REU-varasto/nouto bittikarttagrafiikalla                                                                     |
| `esimerkkejä/sid_music_demo.ub`               | SID-musiikkisoitin rasteri-IRQ:lla ja näppäimistöuloskäynnillä                                               |
| `esimerkkejä/kymmenentuloste.ub`              | 5 TENPRINT-sokkelototeutusta valikoilla; demoja `lowercase` merkistötilassa                                  |
| `esimerkkejä/countdown_demo.ub`               | Lähtölaskenta `for..next` negatiivisella askeleella, mukaan lukien `for i = 20 to 0 step -2`                 |
| `esimerkkejä/laskentavirheiden_demo.ub`       | Käännösaikainen virhe oletusvaiheelle `from > to`                                                            |
| `esimerkkejä/eksplisiittinen_demo.ub`         | `--explicit` CLI-lippudemo täysin kirjoitetuilla `var`, `sub`, `fn` -komennoilla                             |
| `esimerkkejä/eksplisiittiset_virheet_demo.ub` | Löyhä koodi, joka rakentuu ilman `--explicit`-koodia, aiheuttaa virheitä                                     |
| `esimerkkejä/dim_demo.ub`                     | `DIM … AS …` kaikenlaiset skalaarit ja taulukot                                                              |
| `examples/qbasic_demo.ub`                     | QBasic-tyylinen FUNCTION / SUB / ELSEIF / DO-LOOP / SELECT CASE / merkkijonot                                |
| `esimerkkejä/float_demo.ub`                   | YKSITTÄINEN / KAKSINKERTAINEN liukuluku: `^`, SQR, SIN, ATN, EXP, LOG, `FOR … STEP 0.5`, `AS DOUBLE` funktio |

## CLI-viite

```
ub build <input.ub> [OPTIOT]

-o, --output <tiedosto> Tulostaa .prg- tai .crt-tiedoston (oletus: <input>.prg)

-v, --verbose Näytä nollasivuinen asettelu ja koodin heksadesimaalivedos
--no-stub Ohita BASIC SYS -tynkä (koodi latautuu kohdassa $0801)
--debug Luo myös .sym-, .dbg- ja .vs-virheenjäljitystiedostot
--asm Luo myös luettava 6502 koodin luontia varten .asm-listaus
--d64 [tiedosto] Luo myös .d64-levykuvan;

ilman tiedostonimeä oletusarvo on <output>.d64
--add <tiedosto> Lisää ylimääräisen tiedoston .d64-levykuvaan;
voidaan toistaa useille tiedostoille
--explicit Vaaditaan :type jokaiselle muuttujalle / aliparametrille / fn-parametrille
--basic-print C64 PERUSTULOSTUS välilyönti: välilyönnit numeroiden ympärillä, ',' = 10 sarakkeen vyöhykkeet
-h, --help Näytä ohje
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

| Ilmoituslomake                                         | Ilman `--explicit`   | `--explicit` kanssa      |
| ------------------------------------------------------ | -------------------- | ------------------------ |
| `var name = expr` (ei `:type`)                         | ok — tyyppi päätelty | virhe                    |
| `var name: int = expr` (tai sana/liukuväri/merkkijono) | okei                 | okei                     |
| `var arr = array(N)`                                   | ok — tyyppi päätelty | virhe                    |
| `var arr = array_word(N)`                              | okei                 | okei                     |
| `const NAME = value`                                   | okei                 | ok — muuttumaton         |
| `sub foo(a, b)` (tyypittämättömät parametrit)          | okei                 | ok — muuttumaton         |
| `sub foo(a: int, b: int)`                              | okei                 | ok — muuttumaton         |
| `fn foo(a): int` (tyypitön parametri)                  | okei                 | parametrissa oleva virhe |
| `fn foo(a: int): int`                                  | okei                 | okei                     |
| `fn foo(a): int` (tyypitön parametri)                  | okei                 | parametrissa oleva virhe |
| `fn foo(a: int): int`                                  | okei                 | okei                     |

Vakiot ja taulukkomäärittelyt hyväksytään aina — niiden tyyppi määräytyy
määrittelymuodon mukaan, joten `:type` olisi tarpeeton.

**Esimerkki virhetulosteesta:**

```
$ ub build myprog.ub --explicit
Käännösvirheet:
rivi 14: 'explicit' tila: 'var loose':lla ei ole tyyppiä — käytä 'var loose: int|word|float|string'
rivi 16: 'explicit' tila: parametrilla 'a' ei ole tyyppiä — käytä 'a: int|word|float|string'
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
| `demo.vs.` | VICE-monitorin komentotiedosto, joka sisältää `al`-komennot osoitetarroille                             |

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

Tulosteelle nimeltä `demo.prg` tämä luo tiedoston `demo.asm`. Listaus luodaan
Ultimate Basicin konekielisen koodin luomisen aikana kerätyistä metatiedoista;
se ei ole pelkkä valmiin PRG:n osittaista purkamista. Se sisältää:

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
.label x = $02; int

* = $080D

ub_start:
cld; $080D: D8

; UB: muuttuja x
lda #$01; $080E: A9 01
sta x; $0810: 85 02
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
demo.ub → demo.prg (386 tavua)

Lataus: $080D – $0989

Muuttujat (nollasivu):
score ZP:$08 tavua
lives ZP:$0A tavu
msg ZP:$0C merkkijono
ptr ZP:$0E sana

Aliohjelmat:
greet $0900
show $0912

Taulukot ($C000+):
sprites $C000 8 tavua
```

`-v`-merkillä tuloste näyttää lisäksi sisäiset ZP-allokoinnit ja täyden
heksaedrisen vedoksen.

### Luotu koodi (optimoitu versiossa 1.6.0)

Koodigeneraattori tuottaa tiukemman 6502-koodin yleisimmissä tapauksissa;
ohjelmiin ei tarvitse tehdä muutoksia:

- Ehdot `if` / `while` / `until` / `select` -lausekkeissa ovat `CMP` ja haara
  (0/1-arvoa ei rakenneta eikä testata uudelleen). `x &gt; n` käännetään
  muodossa `x &gt;= n+1`; vertailujen ` ja ` / ` tai ` oikosulkevat, kun
  oikealla puolella ei ole sivuvaikutuksia; `while` testaa silmukan lopussa.
- Vakiot ja tavumuuttujat ovat suoria operandeja (`ADC #n`, `CMP zp`); `poke`
  vakioon tai `sana`-osoite tallentuu suoraan.
- Muuttuvan indeksin omaavat taulukot käyttävät `base,Y` -osoitusta
  nollasivuisen osoittimen sijaan.
- Kun lauseke alkaa lataamalla muuttujaa, jonka edellinen lauseke juuri
  tallensi, redundantti `LDA` ohitetaan.

Käytä `--asm` nähdäksesi oman ohjelmasi luoman koodin.

## Tunnetut rajoitukset

| Ominaisuus                                  | Rajoitus                                                                                                                                                                                                                                                                                                                                                           |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Kokonaislukuaritmetiikka                    | 8-bittinen etumerkitön (0–255); `word` -muuttujilla on 16-bittiset arvot                                                                                                                                                                                                                                                                                           |
| Nolla sivubudjetti                          | Pysyvä nollasivu on `$02–$4F` (78 tavua): jokainen muuttuja ja sub/fn-parametri vie 2 tavua, jokainen suoritettava `for`-silmukka vie 2 tavua lisää. Versiosta 1.6.4 lähtien muuttujat, jotka eivät sovi, siirtyvät automaattisesti RAM-muistiin (katso *RAM-muistin muuttujat*); vain äärimmäisissä tapauksissa raportoidaan edelleen `ulkopuolelta nollasivulta` |
| Binääriliteraalit                           | `%01010101` (versiosta 1.6.4 lähtien), `$hex` ja desimaaliluku                                                                                                                                                                                                                                                                                                     |
| Aliohjelmat                                 | Ei rekursiota — ZP-parametripaikat allokoidaan staattisesti                                                                                                                                                                                                                                                                                                        |
| Merkkijonomuuttujat                         | `single` / `double` ovat 5-tavuisia liukulukuja versiosta 1.6.4 lähtien (ohjelman käyttämät rutiinit, ~2–5 kt, on lisätty niihin); `float` pysyy Q8.8:ssa (0–255.99)                                                                                                                                                                                               |
| Unaarinen miinus                            | Versiosta 1.6.4 lähtien johtava `-` sitoutuu operandiinsa: `-5 - 3` on -8 (se oli -(5 - 3) = -2)                                                                                                                                                                                                                                                                   |
| Merkkijonojen yhdistämisen suoritusaikainen | Lasketut arvot sijaitsevat 80 merkin puskurissa muuttujaa kohden (pidemmät tulokset karsitaan); merkkijonotaulukon elementtien arvot sijaitsevat 31 merkin paikoissa; `&lt;` / `&gt;` -järjestys on PETSCII-tavujärjestys.                                                                                                                                         |
| `rnd()` / `rnd(n)`                          | Yksinkertainen LCG, ei kryptografinen; jakso = 256 (liukuluku `rnd` on 32-bittinen xorshift)                                                                                                                                                                                                                                                                       |
| `abs()` / `sgn()` / `min()` / `max()`       | vain 8-bittisiä arvoja; `abs`/`sgn` käsittelee arvoja etumerkillisinä (bitti 7 = negatiivinen → `abs` kahden komplementit, `sgn` palauttaa `$FF`); `min`/`max` ovat etumerkittömiä (0–255)                                                                                                                                                                         |
| `kuvaaja`                                   | Alueen ulkopuolella olevat pikselit rajataan äänettömästi (Y ≥ 200 tai X ≥ 320 → ei toimintoa)                                                                                                                                                                                                                                                                     |
| `mplot`                                     | Ei rajojen tarkistusta — x:n on oltava 0–159, y:n on oltava 0–199                                                                                                                                                                                                                                                                                                  |
| `mline` / `mrect`                           | Monivärinen; x: 0–159, y: 0–199. Näytön ulkopuolisten pikselien rivitys (ei katkaisua) — pitää koordinaatit alueella                                                                                                                                                                                                                                               |
| `mympyrä`                                   | Monivärinen; leikkaa näytön ulkopuoliset pisteet (x ≥ 160 tai y ≥ 200 ohitetaan)                                                                                                                                                                                                                                                                                   |
| `värikynä`                                  | Vain palkkaukset; asettaa kosketettujen solujen etualan näytteen (tausta säilyy). Ei vaikutusta lohkotilassa (`plot4`/`circle4`)                                                                                                                                                                                                                                   |
| `suora`                                     | Ei rajojen tarkistusta — x: 0–319, y: 0–199; x1≤x2 ja y1≤y2 eivät ole pakollisia (degeneroituneet/käänteiset suorakulmat tuottavat määrittelemättömän tulosteen)                                                                                                                                                                                                   |
| `plot4`                                     | Ei rajojen tarkistusta — x:n on oltava 0–79, y:n on oltava 0–49 (lohkotila)                                                                                                                                                                                                                                                                                        |
| `ympyrä4`                                   | Leikkaa näytön ulkopuolisia lohkopikseleitä; hyödyllinen säde on noin 0–49 80×50-lohkotilassa                                                                                                                                                                                                                                                                      |
| `merkkiä$`                                  | Ei PETSCII↔ASCII-määritystä — n välitetään sellaisenaan CHROUT-funktiolle                                                                                                                                                                                                                                                                                          |
| `musiikin toisto`                           | Vaatii `load sid`- tai `tune`-lohkon; vain yksi CIA1-kääre lähetetään (viimeinen `music play` voittaa)                                                                                                                                                                                                                                                             |
| `grafiikka tuplalla`                        | Vain palkattu; käyttää `$4000–$7FFF`-merkkiä takapuskurissa, joten ohjelmakoodin on pysyttävä `$4400`-merkkiä pienempänä; ei yhdistettävissä spritien tai moniväristen kanssa                                                                                                                                                                                      |
| Virheraportointi                            | Vain käännösaikana; `onerr goto` käsittelee KERNAL I/O -virheet ajonaikana                                                                                                                                                                                                                                                                                         |
