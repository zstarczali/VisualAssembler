# VMA-koodin merkitys kielellä tšekki**Kieliopas · versio 2.1.0**VMA on [C64 Visual Assembler](https://github.com/zstarczali/VisualAssembler)
-sovelluksen 6502/6510-assembleri — sen Expert-tilan ja sen lohko-ohjelmien
tekstikieli. Tässä käyttöoppaassa kuvataan kieli; editori, lohkopaletti ja muut
sovelluksen työkalut löytyvät C64 Visual Assembler -käyttöoppaasta.

## Sisällys

1. [Lähdetiedoston muoto](#1-lahdetiedoston-muoto)
2. [Numerot ja lausekkeet](#2-numerot-ja-lausekkeet)
3. [Tuloste: PRG, BASIC-tynkä ja
   aloituskohta](#3-lahto-prg-basic-tynka-ja-aloituspiste)
4. [Osoitetilat](#4-osoitustavat)
5. [6502 ohjeet](#5-6502-ohjeet)
6. [Direktiivit ja makrot — viite](#6-direktiivit-ja-makrot-viite)
7. [KickAssembler-tyylinen syntaksi](#7-kickassembler-tyylinen-syntaksi)
8. [Komentorivi](#8-komentorivi)
9. [Tunnetut rajoitukset](#9-tunnetut-rajoitukset)

---

## 1. Lähdetiedoston muoto

VMA-lähdekoodi on pelkkää tekstiä, yksi lause riviä kohden. Kirjainkoolla ei ole
merkitystä muistisäännöissä ja direktiiveissä (`lda`, `LDA`, `.BYTE`, `.byte`);
tunnisteiden nimissä kirjainkoko on merkitsevä.

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

-**Kommentit**alkavat merkeillä `;` tai `//` ja jatkuvat rivin loppuun (ei
  lainausmerkeissä olevan merkkijonon sisällä).
-**Labelit**kirjoitetaan muodossa `name:` — kirjaimia, numeroita ja `_`,
  eivätkä ne ala numerolla. Leima voi olla omalla rivillään tai käskyn edessä.
  Pisteellä alkava nimi (`.loop:`) on**local label**(katso [Local (dotted)
  labels](#paikalliset-pisteviivalla-tunnisteet)); `-` ja `+` yksinään ovat**anonyymejä
  leimoja**, joihin viittaa `bne -` / `beq +` (lähimpänä ennen / jälkeen oleva).
-**Käskyt**ovat muistisääntö ja operandi; sisennys on vapaa.
-**Direktiivit**alkavat pisteellä (`.byte`, `.macro`, `.if` …); `* = $xxxx`
  (tai `.pc = $xxxx`) asettaa osoitteen.
- Käyttäjämakroja****kutsutaan seuraavasti: `:nimi(args)`,
  `.invokenimi(args)`, `.callnimi(args)` tai `nimi(args)`.

## 2. Numerot ja lausekkeet

| Lomake          | Esimerkki      | Arvo                                                                             |
| --------------- | -------------- | -------------------------------------------------------------------------------- |
| Heksadesimaali  | `$D020`, `$0F` | `$` etuliite                                                                     |
| Binääri         | `%00001111`    | `%` etuliite                                                                     |
| Desimaali       | `255`, `40*25` | ei etuliitettä                                                                   |
| Merkki          | `'A'`          | sen koodi (`$41`)                                                                |
| Nykyinen osoite | `*`            | linjan osoite (katso [`*` ohjelmalaskuri](#the--program-counter-in-expressions)) |

Käskyoperandeissa kirjoitetaan heksadesimaalilukuja muodossa `$`.
Kirjastomakrojen osoiteargumenteissa (`.rawbytes C000, …`, `.sprite_init 0, 1,
80`) luetaan heksadesimaalilukuna tyhjä yhdestä neljään numeroa.**Operaattorit**(operandeissa `.const`, `.fill`, `.assert`, `.if`): `+ - * /
%`, `& | ^ ~`, `<< >>`, sulkeissa `<lauseke` (alhainen tavu) ja `>lauseke`
(ylempi tavu), ja ehdoissa `== != < > <= >=` (tosi = 1, epätosi = 0). `.fill`,
`.const` ja vastaavat tuntevat myös funktiot `lo()`, `hi()`, `sin()`, `cos()`,
`round()`, `min()`, `max()`, `abs()` ja `PI`.

```
.const B = 7
    lda #(B+1)*2
    lda #B & 3 | 8
    lda #~B & $FF
    ldx #'A'
    lda #<screen        ; low byte of a label
    lda #>(*+63)        ; high byte of a PC-relative address
```

## 3. Lähtö: PRG, BASIC-tynkä ja aloituspiste

VMA kirjoittaa C64**PRG**: kaksitavuisen latausosoitteen, jota seuraa
muistikuva. Jokainen ORG-osio ja jokainen direktiivi, joka sijoittaa datan omaan
osoitteeseensa (`.rawbytes`, `.incbin`, `.sid` …), menee yhteen kuvaan; niiden
väliset aukot ovat nollia.

-**Ilman ORG-osoitetta**ohjelma alkaa kohdasta `$0801`, josta BASIC alkaa.
-**BASIC SYS -tynkä**(oletus): rivi `10 SYS nnnn` sijoitetaan kohtaan `$0801`,
  joten ohjelma alkaa rivillä `RUN`. Ohjelma, jonka ensimmäinen ORG on `$0801`,
  käynnistyy sitten kohdasta `$080D`. Poista tynkä käytöstä valitsemalla
  `--no-basic-stub`; ilman sitä ohjelma kohdassa `$0801` kootaan muotoon
  `$C000`, kaikki muut pysyvät ensimmäisessä ORG:ssaan.
-**Aloituskohta:**SYS-rivi hyppää koodin alkuun tai ensimmäisen rivin
  kommentissa mainittuun osoitteeseen `; Aloituskohta: $1234`.
-**BASIC-rivin alapuolella oleva koodi**(ORG, joka on alempi kuin `$0801`,
  sekä tynkä): pieni lataaja käynnistää ohjelman ja siirtää sen paikalleen,
  joten se käynnistyy silti `RUN`:llä.
- Lähde, joka alkaa omalla BASIC SYS -rivillään (`.byte $0B, $08, $0A, $00, $9E,
  …` kohdassa `$0801`), lähetetään sellaisenaan ilman toista tynkää.

PRG:stä komentorivi luo myös**kasetin**ja**levynkuvan**(uusi versiossa
2.1.0, katso [8. Komentorivi](#8-komentorivi)):

- `--crt FILE` — Magic Desk -äänikortti (CRT-tyyppi 19, 8 × 8K pankkia, enintään
  65 408 tavua ohjelmaa). Pankissa 0 oleva latausohjelma alustaa KERNALin,
  suorittaa kopiointirutiinin RAM-muistista osoitteesta `$0100–$013B`, joka
  siirtää ohjelman latausosoitteeseensa (vaihtaen pankkeja `$DE00` kautta),
  sammuttaa kasetin ja hyppää aloituskohtaan. Pidä ohjelma poissa osoitteista
  `$0100–$013B` ja latausohjelman käyttämistä nollasivutavuista `$02–$04` /
  `$FB–$FE`.
- `--d64 [TIEDOSTO]` — vuoden 1541 levykuva (35 raitaa), jonka mukaan PRG on
  nimetty, sekä `--add`-tiedostot, jotka on aseteltu siten kuin vuoden 1541 DOS
  ne kirjoittaa; c1541-tiedostoa ei tarvita.

---

## 4. Osoitustavat

Jokainen 6502-käsky tukee yhtä tai useampaa osoitustilaa. VMA valitsee tilan
operandin kirjoitustavan perusteella.

| Tila               | Tarra               | Esimerkki             | Kuvaus                                                                    |
| ------------------ | ------------------- | --------------------- | ------------------------------------------------------------------------- |
|**implied**| Implisiittinen      | `EI `                 | Ei operandia; käsky on itsenäinen                                         |
|**immediate**| Välitön             | `LDA #$FF`            | Rivinsisäinen vakio; assembler lisää `#` automaattisesti                  |
|**zeroPage**| Nolla sivua         | `LDA $10`             | Yksitavuinen osoite sivulla nolla (0–255)                                 |
|**zeroPageX**| Nolla sivua, X      | `LDA $10,X`           | Sivun osoite nolla + X-rekisterin siirtymä (tulos rivittyy sivulle 0)     |
|**zeroPageY**| Nolla sivua, Y      | `LDX $FB,Y`           | Nollasivun osoite + Y-rekisterin siirtymä                                 |
|**absolute**| Absoluuttinen       | `LDA 0400 $`          | Täysi 16-bittinen muistiosoite                                            |
|**absoluteX**| Absoluuttinen, X    | `LDA $0400,X`         | 16-bittinen osoite + X-rekisterin offset                                  |
|**absoluteY**| Absoluuttinen, Y    | `LDA $0400,Y`         | 16-bittinen osoite + Y-rekisterin offset                                  |
|**relative**| Sukulainen/Tunniste | `BNE-silmukka`        | Haarakonttorin ohjeita varten anna tunnisteen nimi tai kohdeosoite        |
|**indirectX**| Epäsuora, X         | `LDA ($FB,X)`         | Nollasivun indeksointi epäsuorasti (operandi = nollasivun osoite, 1 tavu) |
|**indirectY**| Epäsuora, Y         | `LDA ($FB),Y`         | Nollasivu epäsuora indeksointi (operandi = nollasivun osoite, 1 tavu)     |
|**indirect**| Epäsuora            | `JMP (0100 dollaria)` | Epäsuora; käytettävissä vain JMP:n kanssa                                 |

### Vakiot nollasivulla

Vain vakioista (`.const`, `name = value`, a `.var`) koostuva operandi, joka
mahtuu tavuun, ottaa käskyn**zero-page**-tilan, täsmälleen samalla tavalla
kuin numero: `.const zp = $FB`:n jälkeen `lda zp` muodostaa `A5 FB`:n (2 tavua,
3 sykliä) ja `lda zp,x` muodostaa `B5 FB`. Tila, jolla käskyllä ei ole
nollasivuista muotoa, pysyy absoluuttisena (`lda zp,y` → `B9 FB 00`). Nimikettä
ei rajata – sen osoite tiedetään vasta asettelun jälkeen – ja `lda.abs zp`
pakottaa absoluuttisen tilan. Numero säilyttää kirjoitusleveyden: `$FB` on
nollasivu, `$00FB` on absoluuttinen. *(Uutta versiossa 2.1.)*

### Merkitse lausekkeet operandeiksi

Mikä tahansa operandi, joka hyväksyy osoitteen tai välittömän arvon, hyväksyy
myös suoraan**vakion nimen**(`.const` tai otsikon). Lisäksi voit käyttää**label+offset**- tai**label−offset**-lausekkeita viitataksesi osoitteeseen
suhteessa nimettyyn vakioon:

| Syntaksi          | Esimerkki                           | Kuvaus                                                                                                            |
| ----------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `tarra`           | `STA näyttö_ram,X`                  | Ratkaisee otsikon/vakion arvon                                                                                    |
| `tarra+$heksa`    | `STA näyttömuisti + $0100, X `      | Nimikkeen osoite ja heksadesimaalioffset                                                                          |
| `tarra+desimaali` | `STA näyttö_ram+256,X`              | Nimikkeen osoite ja desimaaliero                                                                                  |
| `tarra-$hex`      | `LDA-pöytä - 10 dollaria`           | Nimikkeen osoite ilman heksadesimaalioffsettia                                                                    |
| `$hex+lauseke`    | `LDA $1234+1`, `STA $0400+40*2,X`   | Mikä tahansa numeroiden, tunnisteiden ja vakioiden lauseke *(2.1)*                                                |
| `(etiketti)`      | `JMP (vektori)`, `JMP (taulukko+2)` | Epäsuora hyppy otsikon tai lausekkeen kautta *(2.1)*                                                              |
| `#<tunniste`      | `LDA #<näyttö_ram`                  | Otsikon osoitteen pienin tavu                                                                                     |
| `#>tarra`         | `LDA #>näyttö_RAM`                  | Nimikkeen osoitteen korkeampi tavu                                                                                |
| `*`               | `BNE *`                             | Nykyinen ohjelmalaskuri (käskyn oma osoite); haarat, joissa on `*`, luovat äärettömän itsesilmukan (offset `$FE`) |**Esimerkki — kahden näyttösivun tyhjentäminen CONST:**-muuttujalla
```
; .CONST screen_ram = $0400
    LDX #$00
clear:
    STA screen_ram,X
    STA screen_ram+$0100,X
    DEX
    BNE clear
```

### Lausekkeissa oleva `*`-ohjelmalaskuri

`*` ei enää rajoitu olemaan koko operandi – se voi esiintyä**missä tahansa
operandilausekkeen**sisällä ja edustaa sen käskyn osoitetta, johon se on
kirjoitettu. Se ratkaistaan kokoonpanovaiheessa kyseisen käskyn todellista
osoitetta vasten, joten lyhyille suhteellisille hyppyille tai PC:hen
suhteellisille datan lukukerroille ei tarvita tunnistetta.

| Syntaksi      | Esimerkki            | Merkitys                                             |
| ------------- | -------------------- | ---------------------------------------------------- |
| `*`           | `BNE *`              | Haara itseensä (ääretön silmukka, offset `$FE`)      |
| `*-n` / `*+n` | `BNE *-5`, `BEQ *+4` | Haarautuminen suhteessa nykyiseen PC:hen *n* tavulla |
| `JMP *+n`     | `JMP *+20`           | Absoluuttinen hyppy laskettuna nykyisestä PC:stä     |
| `#<*` / `#>*` | `LDA #<*`, `LDA #>*` | Nykyisen tietokoneen pienin/korkein tavu             |
| `#>(*+n)`     | `LDA #>(*+63)`       | PC:hen suhteellisen osoitteen alempi/ylempi tavu     |**PC vs. kertolasku.**`*` käsitellään ohjelmalaskurina vain, kun se on
*arvopaikalla* — lausekkeen alussa tai heti operaattorin `(`, `,`, `<`, `>` tai
välilyönnin jälkeen. Numeron `)` tai tunnisteen perässä oleva `*` on tavallinen
kertolasku, joten `LDA-taulukko*2` ja `CONST_A*4` pysyvät muuttumattomina.**Missä se toimii.**Mikä tahansa operandi, joka jo hyväksyy lausekkeen:
haarautumiskohteet, `JMP` / `JSR`, `LDA`/`STA`/… absoluuttiset ja indeksoidut,
välittömät matalan/korkean tavun operaattorit ja `.assert`-lauseke. `*` ei
koskaan muuta käskyn kokoa, joten se on turvallinen kaikissa osoitustiloissa.

### Paikalliset (pisteviivalla) tunnisteet

Pisteellä alkava tunniste — `.loop`, `.skip`, `.done` — on**paikallinen
tunniste**. Se kuuluu lähimmän edeltävän**global**(ei-pisteellinen) tunnisteen
piiriin ja siitä tulee sisäisesti `<global>.<nimi>`. Kaksi paikallista
tunnistetta, joilla on sama lyhyt nimi eri globaalien tunnisteiden alla, eivät
törmää toisiinsa**not**.

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

- Vaikutusalueen sisällä viitataan paikalliseen otsikkoon muodossa `.name`.
- Viittaa siihen toisesta laajuusalueesta eksplisiittisesti muodossa
  `Global.name` (esim. `JMP ClearScreen.loop`).
- Ennen globaaleja tunnisteita kirjoitettu `.name` pysyy tavallisena ylimmän
  tason tunnisteena `.name`.

### Itsemuokkaavan koodin operanditunnisteet

Lisää käskyn operandin eteen `label:` sijoittaaksesi merkinnän**operandin
tavulle**operaatiokoodin sijaan. Käsky kootaan kaksoispistettä seuraavasta
merkistä.

```
setup:
    LDA value:#$00     ; 'value' -> address of the #$00 operand byte
    ...
patch:
    LDA #new
    STA value          ; writes the operand byte directly — classic SMC
```

`arvo` osoittaa kohtaan `<käskyosoite> + 1` (ensimmäinen operanditavu) jokaista
osoitustilaa varten. Tämä korvaa vanhemman `STA-käskyn + 1` / `-käskyn: LDA
#$00` -kuvion.

---

## 5. 6502-ohjeet

### Tiedonsiirto

| Muistijärjestelmä | Kuvaus                 | Tilat                                                                                   |
| ----------------- | ---------------------- | --------------------------------------------------------------------------------------- |
| `LDA`             | Kuorma-akku            | välitön, nollasivu, absoluuttinen, absoluuttinenX, absoluuttinenY, epäsuoraX, epäsuoraY |
| `LDX`             | Lataa X-rekisteri      | välitön, nollasivu, nollasivuY, absoluuttinen, absoluuttinenY                           |
| `LDY`             | Lataa Y-rekisteri      | välitön, nollasivu, absoluuttinen, absoluuttinenX                                       |
| `STA`             | Säilytä akkumulaattori | nollasivu, absoluuttinen, absoluuttinenX, absoluuttinenY, epäsuoraX, epäsuoraY          |
| `STX`             | Myymälän X kassa       | nollaSivu, nollaSivuY, absoluuttinen                                                    |
| `STY`             | Myymälän Y-kassa       | nollasivu, absoluuttinen                                                                |

### Aritmeettinen

| Muistijärjestelmä | Kuvaus               | Muistiinpanoja                                                         |
| ----------------- | -------------------- | ---------------------------------------------------------------------- |
| `ADC`             | Lisää kantovälineenä | Aseta kantoaika useimmissa tapauksissa `SEC`-asetuksilla ennen käyttöä |
| `SBC`             | Vähennä ja kanna     | Aseta siirto `SEC` ennen vähennyslaskua                                |
| `SISÄLTÄÄ`        | Muistin lisääminen   | —                                                                      |
| `DEC`             | Vähennä muistia      | —                                                                      |
| `CMP`             | Vertaa A:han         | Asettaa liput; ei muokkaa A:ta                                         |
| `CPX`             | Vertaa X:ään         | —                                                                      |
| `CPY`             | Vertaa Y:n kanssa    | —                                                                      |

### Logiikka

| Muistijärjestelmä | Kuvaus                                                       |
| ----------------- | ------------------------------------------------------------ |
| `JA`              | Looginen JA akkumulaattorilla                                |
| `ORA`             | Looginen TAI akkumulaattorilla                               |
| `EOR`             | Yksinoikeudella TAI kertyvällä vedolla                       |
| `BITTI`           | Testaa muistibittejä A:ta vasten (asettaa N-, V- ja Z-liput) |

### Hypyt ja oksat

| Muistijärjestelmä | Kuvaus                                                |
| ----------------- | ----------------------------------------------------- |
| `JMP`             | Ehdoton hyppy (absoluuttinen tai epäsuora)            |
| `JSR`             | Hyppää aliohjelmaan (tallentaa paluuosoitteen pinoon) |
| `RTS`             | Paluu aliohjelmasta                                   |
| `RTI`             | Paluu keskeytyksestä                                  |
| `BNE`             | Haara, jos ei ole yhtäsuuri (Z=0)                     |
| `BEQ`             | Haara, jos yhtä suuri (Z=1)                           |
| `Piilokopio`      | Haara, jos kantaa, selkeä (C=0)                       |
| `BCS`             | Haara, jos kantosarja (C=1)                           |
| `Painoindeksi`    | Haara, jos miinus (N=1)                               |
| `BPL`             | Haara, jos plus (N=0)                                 |
| `BVC`             | Haara, jos ylivuoto on tyhjä (V=0)                    |
| `BVS`             | Haara, jos ylivuoto on asetettu (V=1)                 |

#### LBNE / LBEQ / … (Pitkät oksat)

Kahdeksan pseudo-operaatiota käyttäytyvät ehdollisten haarojen tavoin, mutta ne
saavuttavat**mikä tahansa osoitteen**, eivät vain −128…+127. Jokainen niistä
muodostaa käänteisen haaran, joka ohittaa 3-tavuisen `JMP` - aina**5-tavuisen**:

```
LBEQ done      ; assembles to:   BNE *+3   ($D0 $03)
               ;                 JMP done  ($4C lo hi)
```

| Pitkä op | Kunto                    | Lähetetty muodossa      |
| -------- | ------------------------ | ----------------------- |
| `LBNE`   | ei yhtä suuri (Z=0)      | `BEQ *+3 / JMP-tavoite` |
| `LBEQ`   | yhtä suuri (Z=1)         | `BNE *+3 / JMP-kohde`   |
| `LBCC`   | kantaa selkeästi (C=0)   | `BCS *+3 / JMP-kohde`   |
| `LBCS`   | kantosarja (C=1)         | `BCC *+3 / JMP-kohde`   |
| `LBMI`   | miinus (N=1)             | `BPL *+3 / JMP-kohde`   |
| `LBPL`   | plus (N=0)               | `BMI *+3 / JMP-tavoite` |
| `LBVC`   | ylivuoto tyhjentää (V=0) | `BVS *+3 / JMP-kohde`   |
| `LBVS`   | ylivuotojoukko (V=1)     | `BVC *+3 / JMP-kohde`   |

- Operandi: otsikko, `*`-lauseke tai literaaliosoite — sama kuin normaalissa
  haaran kohdefunktiossa.
- Kustannukset: 5 tavua ja 1 ylimääräinen sykli valitulla polulla lyhyeen
  haaraan verrattuna. Lyhyen haaran automaattista ylennystä ei tapahdu —
  valitset `LBxx` eksplisiittisesti.
- Kun tavallinen haara (`BNE`, `BEQ`, …) on alueen ulkopuolella, kääntäjävirhe
  nimeää nyt tarkan ylityksen ja ehdottaa vastaavaa `LBxx`.

### Rekisteritoiminnot

| Muistijärjestelmä | Kuvaus                  |
| ----------------- | ----------------------- |
| `VERO`            | Siirto A → X            |
| `TAY`             | Siirto A → Y            |
| `TXA`             | Siirto X → A            |
| `TYA`             | Siirto Y → A            |
| `TSX`             | Siirtopino-osoitin → X  |
| `TXS`             | Siirto X → Pino-osoitin |
| `INX`             | Lisäys X:llä            |
| `DEX`             | Vähennä X               |
| `INY`             | Y-arvon lisäys          |
| `DEY`             | Vähennä Y-arvoa         |

### Siirrä ja kierrä

| Muistijärjestelmä | Kuvaus                                 |
| ----------------- | -------------------------------------- |
| `ASV-viite `      | Aritmeettinen siirto vasemmalle        |
| `LSR`             | Looginen siirto oikealle               |
| `ROL`             | Kierrä vasemmalle kuljetuksen kautta   |
| `ROR`             | Kierrä oikealle Carry-toiminnon kautta |

### Pino

| Muistijärjestelmä | Kuvaus                         |
| ----------------- | ------------------------------ |
| `PHA`             | Työnnä akku pinon päälle       |
| `PHP`             | Työnnä prosessorin tila pinoon |
| `PLA`             | Vedä akku pinosta              |
| `PLP`             | Vedä prosessorin tila pinosta  |

### Järjestelmä / Liput

| Muistijärjestelmä | Kuvaus                                 |
| ----------------- | -------------------------------------- |
| `CLC`             | Selkeä kantolippu                      |
| `CLD`             | Tyhjennä desimaalitila                 |
| `CLI`             | Tyhjennä keskeytyksen esto             |
| `CLV`             | Tyhjennä ylivuotomerkki                |
| `SEK`             | Aseta kantolippu                       |
| `SED`             | Aseta desimaalitila                    |
| `SEI`             | Aseta keskeytyksen esto                |
| `EI `             | Ei toimintoa                           |
| `BRK`             | Pakota keskeytys / ohjelmistokeskeytys |

### Laittomat / dokumentoimattomat ohjeet

Näitä tuetaan edistyneessä käytössä. Käytä varoen — toiminta voi vaihdella eri
sirujen välillä.

`LAX`, `SAX`, `DCP`, `ISC`, `SLO`, `RLA`, `SRE`, `RRA`, `ANC`, `ALR`, `ARR`,
`AXS` ja `NOP`-lomakkeet, jotka lukevat operandin: `NOP #$nn` ($80), `NOP $nn`
($04), `NOP $nn,X` (14 $), `NOP $nnnn` (0C $), `NOP $nnnn, X` (1 C $)

---

## 6. Direktiivit ja makrot — viite

Direktiivit ohjaavat assembleria (tunnisteet, data, alkuperä, ehdot,
käyttäjämakrot); kirjastomakrot tekevät yleisiä C64-tehtäviä yhdellä rivillä –
sen sijaan, että kirjoittaisit 10–20 käskyä käsin, kirjoitat yhden rivin ja
assembler luo koodin. Ajattele niitä sisäänrakennettuina aliohjelmina.

---

### LABEL

Kuten**rivinumero BASICissa**— mutta nimellä numeron sijaan. Hyppykohteet
`JMP`, `JSR`, `BNE` jne.

| Argumentti       | Kuvaus                                                                   |
| ---------------- | ------------------------------------------------------------------------ |
| Levy-yhtiön nimi | Tunniste, jota käytetään esimerkiksi `JMP`-, `JSR`-, `BNE`-tiedostoissa. |**Syntaksi:**```
loop:
```**Generoitu koodi:**```
loop:  ; $0820
```

Nykyinen osoite näkyy kommenttina. Nimikkeiden koko on**0 tavua**.

---

### COMMENT

Kuten**REM BASIC**:ssä — huomautus itsellesi, jonka assembler jättää täysin
huomiotta.**Syntaksi:**```
; Your comment text here
```**Generoitu koodi:**```
; Your comment text here
```

---

### BYTE

Kuten**DATA BASIC**-ohjelmassa — tallentaa luettelon raakatavuarvoista
ohjelmaan.

| Argumentti | Kuvaus                                                              |
| ---------- | ------------------------------------------------------------------- |
| Operandi   | Pilkulla erotetut tavuarvot (esim. `$01, $02, $FF` tai `1, 2, 255`) |**Syntaksi:**```
.byte $01, $02, $FF
```**Generoitu koodi:**```
    .byte $01, $02, $FF
```**Lo/hi-tavun tunnisteviittaukset:**BYTE hyväksyy KickAssembler / ca65-tyyliset
`<label` (matala tavu) ja `>label` (korkea tavu) -tokenit numeeristen arvojen
rinnalla. Assembler selvittää tunnisteosoitteen käännösaikana ja lisää sopivan
tavun. Esimerkki:

```
    .byte <frame_0, >frame_0, <frame_1, >frame_1
```

Tämä tallentaa `frame_0`-kehyksen osoitteen alimman tavun, sitten ylemmän tavun
ja lopuksi saman tavun osoitteelle `frame_1`. Hyödyllinen hyppytaulukoiden ja
osoitelistojen rakentamiseen.**Koko:**Listan tavujen määrä.

---

### WORD

Kuten BASICin**DATA, mutta 16-bittisille luvuille**. Jokainen arvo
tallennetaan kahtena tavuna (ensin pienin tavu, sitten suurin – 6502
little-endian -järjestys).

| Argumentti | Kuvaus                                                     |
| ---------- | ---------------------------------------------------------- |
| Operandi   | Pilkulla erotetut 16-bittiset arvot (esim. `$0400, $C000`) |**Syntaksi:**```
.word $0400, $C000
```**Generoitu koodi:**```
    .word $0400, $C000
```**Koko:**2 tavua sanaa kohden.

---

### FILL

Kuten `FOR I=1 TO N : POKE addr+I, val : NEXT` — täyttää muistilohkon samalla
tavulla yhdellä rivillä. Erinomainen alueiden tyhjentämiseen tai taulukoiden
esitäyttöön.

| Argumentti | Kuvaus                                                  |
| ---------- | ------------------------------------------------------- |
| Operandi   | `määrä,arvo` — esim. `256,0` täyttää 256 tavua nollalla |**Syntaksi:**```
.fill 256, $00
```**Generoitu koodi:**```
    .fill 256, $00
```**Lausekkeen syntaksi:**Sekä `count` että `value` hyväksyvät aritmeettisia
lausekkeita. Voit viitata CONST-nimiin, käyttää
heksadesimaali-/binääriliteraaleja ja kutsua sisäänrakennettuja matemaattisia
funktioita:

| Ilmaisu                     | Merkitys                                          |
| --------------------------- | ------------------------------------------------- |
| `LAATTAMÄÄRÄ, 00 $`         | määrä CONST-arvosta, arvo heksadesimaaliliteraali |
| `40*25, 0`                  | rivinsisäinen kertolasku                          |
| `round(sin(PI/4)*255), $80` | trigonometria                                     |**Sisäänrakennetut funktiot:**`sin()`, `cos()`, `round()`, `max(a,b)`,
`min(a,b)`, `abs()`, vakio `PI`

Operaattorit: `+ - * /` Literaalit: `$FF` (heksadesimaali), `%10110000`
(binääri) Matala/korkea tavu: `lo(lauseke)`, `hi(lauseke)`**Koko:**Määrän arvo tavuina.

---

### ALIGN

Liu'uttaa nykyisen osoitteen eteenpäin seuraavaan puhtaaseen reunaan lisäämällä
nollilla täytettäviä tavuja. C64 vaatii sprite-datan alkavan 64-tavuiselta
rajalta — `ALIGN 64` käsittelee tämän automaattisesti.

| Argumentti | Kuvaus                                                                     |
| ---------- | -------------------------------------------------------------------------- |
| Raja       | Tasausarvo — esim. `64` (sprite-raja), `256` (sivu), `$2000` (bittikartta) |**Syntaksi:**```
.align 64
.align $2000
```**Generoitu koodi:**```
    ; ALIGN 64 → $0840 (12 bytes padding)
```**Koko:**Dynaaminen — riippuu nykyisen ohjelmalaskurin sijainnista.

>**Vinkki:**Käytä `ALIGN 64` ennen sprite-dataa ja `ALIGN 256` varmistaaksesi
> sivunmukaiset taulukot.

---

### TEXT

Kuten**PRINT AT**— kirjoittaa tekstiä suoraan C64-näytölle tiettyyn
sarakkeeseen ja riville käyttämättä KERNAL-kutsua. Se luo yhden LDA/STA-parin
merkkiä kohden ja kohdistaa näytön RAM-muistiin kohdassa `$0400`.

| Argumentti          | Kuvaus                                                     |
| ------------------- | ---------------------------------------------------------- |
| Teksti              | Näytettävä merkkijono                                      |
| X                   | Sarake (0–39)                                              |
| Y                   | Rivi (0–24)                                                |
| Tarra (valinnainen) | Määrittää laskettuun näyttöosoitteeseen osoittavan otsikon |
| `alempi`            | Valinnainen lippu – katso alla                             |**Merkistötilat:**C64:ssä on kaksi merkistöä, jotka voidaan valita ajonaikana:

| Tila                                                | $D018 bitti 1 | Isojen kirjainten syöttö         | Pienten kirjainten syöttö              |
| --------------------------------------------------- | ------------- | -------------------------------- | -------------------------------------- |
|**Isot kirjaimet/grafiikka**(oletus)               | 0             | `A`–`Z` → näyttökoodit $01–$1A ✓ | käsitellään myös isona kirjaimena      |
|**Pienet/isot kirjaimet**(CHARSET-lauseen jälkeen) | 1             | `A`–`Z` → $01–$1A (iso kirjain)  | `a`–`z` → $41–$5A (pienet kirjaimet) ✓ |

-**Isojen kirjainten merkistö (oletus):**Kirjoita haluamasi teksti isoilla
  kirjaimilla. `"HELLO"` näkyy muodossa `HELLO`. Pienillä kirjaimilla syötetty
  teksti on muunnettu isojen kirjainten näyttökoodeiksi.
-**Pienet kirjaimet (`lower`):**Kirjoita tarkalleen haluamasi kirjainkoko.
  `"hello"` → pienten kirjainten näyttö, `"HELLO"` → isojen kirjainten näyttö.
  Vaatii ajonaikaisen merkistövalinnan ennen kuin näyttöön kirjoitetaan (käytä**CHARSET lower**-makroa).**Generoitu koodi (isoilla kirjaimilla, `"HEI"`):**```
    LDA #$08      ; 'H' screen code $08
    STA $0400
    LDA #$05      ; 'E' screen code $05
    STA $0401
    ...
```**Syntaksi:**```
.text 0, 2, "HELLO"           ; uppercase charset (default)
.text 0, 2, "hello", lower    ; lowercase charset
```

Merkit koodataan**näyttökoodeina**(ei PETSCII).**Koko:**`tekstin pituus × 5`
tavua (LDA + STA merkkiä kohden).

---

### STRING

Kuten**Työkkäämällä merkkijonon**mihin tahansa muistiosoitteeseen suorituksen
aikana. Luo LDA/STA-pareja, jotka kopioivat kunkin merkin näyttökoodin
peräkkäisiin osoitteisiin.

| Argumentti          | Kuvaus                                                                                    |
| ------------------- | ----------------------------------------------------------------------------------------- |
| Teksti              | Kirjoitettava merkkijono                                                                  |
| Osoite              | Kohdemuistin osoite — `$C000` heksadesimaali tai**otsikkonimi**|
| Tarra (valinnainen) | Määrittää kohdeosoitteeseen osoittavan tunnisteen                                         |
| Siirtää             | Heksadiarvo (00–FF) lisätään jokaiseen näyttökooditavuun (esim. `$80` = käänteinen video) |
| `alempi`            | Valinnainen merkintä — sama semantiikka kuin TEXT (katso TEXT-osio)                       |**Syntaksi:**```
.string $C000, "HELLO"                  ; uppercase charset (default)
.string $C000, "hello", lower           ; lowercase charset
.string $C000, "HELLO", 80             ; with shift (reverse video)
.string $C000, "hello", 80, lower      ; shift + lowercase
.string $C000, "HELLO" :my_string      ; with macroLabel
```**Generoitu koodi:**```
    LDA #$08      ; 'H' screen code
    STA $C000
    LDA #$05      ; 'E' screen code
    STA $C001
    ...
```

Merkit koodataan**näyttökoodeina**(ei PETSCII). Valinnainen**Shift**-arvo
lisätään jokaiseen tavuun, esim. `$80` käänteiselle videolle.**Koko:**`text.length × 5` tavua (yksi LDA + yksi STA merkkiä kohden).

---

### DATA

Kuten**POKE-silmukka**— kirjoittaa raakatavuluettelon muistiosoitteeseen
ajonaikana, yhden LDA/STA-parin tavua kohden.

| Argumentti          | Kuvaus                                                           |
| ------------------- | ---------------------------------------------------------------- |
| Tavut               | Pilkulla erotetut tavuarvot                                      |
| Osoite              | Kohdemuistin osoite — `$C000` heksadesimaali tai**otsikkonimi**|
| Tarra (valinnainen) | Määrittää kohdeosoitteeseen osoittavan tunnisteen                |**Syntaksi:**```
.data $C000, $01, $02, $03          ; hex address
.data my_buf, $01, $02, $03         ; label address
.data $C000, $01, $02, $03 :mydata  ; with macroLabel
```**Generoitu koodi:**```
    LDA #$01
    STA $C000
    LDA #$02
    STA $C001
    ...
```**Koko:**`tavujen_määrä × 5` tavua (yksi LDA + yksi STA tavua kohden).

>**2.1:**tavut voivat nimetä tunnisteita: `.data $2010, <target, >target`
> kirjoittaa kohteen `kohteen` osoitteen, joka myös myöhemmin määritellyn
> tunnisteen mukainen. Makron `:nimi`-tunniste voi osoittaa kohdeosoitteeseen,
> joka itse on tunniste.

---

### RAWBYTES

Kuten suoraan muistiin latautuva**DATA**— ei lainkaan ajonaikaista koodia.
Tavut ovat läsnä PRG:n lataushetkestä lähtien, ennen kuin koodisi edes alkaa.
Käytä tätä sprite-dataan, tasokarttoihin, hakutaulukoihin ja kaikkeen muuhun,
minkä tarvitsee vain olla tietyssä osoitteessa.

| Argumentti          | Kuvaus                                                           |
| ------------------- | ---------------------------------------------------------------- |
| Tavut               | Pilkulla erotetut tavuarvot                                      |
| Osoite              | Kohdemuistin osoite — `$C000` heksadesimaali tai**otsikkonimi**|
| Tarra (valinnainen) | Määrittää kohdeosoitteeseen osoittavan tunnisteen                |**Syntaksi:**```
.rawbytes $C000, $00, $00, $00      ; hex address
.rawbytes sprite_data, $00, $00     ; label address
.rawbytes $0C50, $00, $00 :nev      ; with macroLabel — other code can use LDA nev,X
```**Koko koodissa:**0 tavua. Data sijoitetaan tulosteessa annettuun osoitteeseen.

>**DATA vs. RAWBYTES:**DATA luo LDA/STA-koodia, joka kopioi tavuja suorituksen
> aikana (hitaampaa, mutta toimii, jos datan on oltava dynaamista). RAWBYTES
> vain sijoittaa tavut suoraan – ei koodia, välittömästi, ilman kustannuksia.

>**2.1:**tavut voivat nimetä tunnisteita (`.rawbytes $2000, <target, >target`
> — osoitintaulukko); `:name` tunniste voi osoittaa tunnisteeseen
> kohdeosoitteena, joka myös määritellään myöhemmin. Makron puskuriargumenttina
> tavut vievät oman tilansa puskureissa ohjelman jälkeen.

---

### RAWTEXT

Kuten RAWBYTES, mutta tekstille — koodaa merkkijonon näyttökoodeiksi ja
sijoittaa tavut kiinteään osoitteeseen ilman ajonaikaista koodia****. Teksti on
valmiina muistissa heti, kun PRG latautuu.

| Argumentti          | Kuvaus                                                                                    |
| ------------------- | ----------------------------------------------------------------------------------------- |
| Teksti              | Koodattava merkkijono                                                                     |
| Osoite              | Kohdemuistin osoite — `$C000` heksadesimaali tai**otsikkonimi**|
| Tarra (valinnainen) | Määrittää kohdeosoitteeseen osoittavan tunnisteen                                         |
| Siirtää             | Heksadiarvo (00–FF) lisätään jokaiseen näyttökooditavuun (esim. `$80` = käänteinen video) |
| `alempi`            | Valinnainen merkintä — sama semantiikka kuin TEXT (katso TEXT-osio)                       |**Syntaksi:**```
.rawtext $C000, "HELLO"                 ; uppercase charset (default)
.rawtext $C000, "hello", lower          ; lowercase charset
.rawtext $C000, "HELLO", 80            ; with shift (reverse video)
.rawtext $C000, "hello", 80, lower     ; shift + lowercase
.rawtext $0400, "HELLO" :my_text       ; with macroLabel
```**Generoitu koodi:**```
; .rawtext "HELLO" -> $C000
; $C000
    .byte $08, $05, $0C, $0C, $0F   ; H E L L O (uppercase screen codes)

; .rawtext "hello", lower -> $C000
; $C000
    .byte $48, $45, $4C, $4C, $4F   ; h e l l o (lowercase screen codes $41–$5A range)
```**Koko koodissa:**0 tavua. Data sijoitetaan tulosteessa annettuun osoitteeseen.

>**STRING vs. RAWTEXT:**STRING luo LDA/STA-koodia, joka kopioi tekstin
> suorituksen aikana. RAWTEXT tallentaa tavut PRG:hen latausaikana – ei koodia,
> ei odottelua.

---

### PETSCII

Kuten**RAWBYTES, mutta KERNAL-tulosteelle**— koodaa merkkijonon
PETSCII-tavuina (yhteensopiva CHROUT:n kanssa kohdassa `$FFD2`) ja sijoittaa ne
kiinteään osoitteeseen ilman ajonaikaista koodia. Käytä tätä, kun haluat
tulostaa merkkejä `JSR $FFD2`:n kautta silmukassa, ja huomaa, että `.print`
käyttää samaa enkooderia ja `lower` -lippua.

>**PETSCII vs. näyttökoodit:**PETSCII ja näyttökoodit ovat kaksi eri
> koodausta. Näyttökoodi `$01` = kirjain A; PETSCII `$41` = kirjain A (CHROUTin
> kautta). Käytä PETSCII:tä vain tulostettaessa KERNALin kautta; käytä
> TEXT/STRING/RAWTEXT-koodausta suoraan näyttömuistiin kirjoittamiseen.

| Argumentti          | Kuvaus                                                           |
| ------------------- | ---------------------------------------------------------------- |
| Teksti              | PETSCII-tavuina koodattava merkkijono                            |
| Osoite              | Kohdemuistin osoite — `$C000` heksadesimaali tai**otsikkonimi**|
| Tarra (valinnainen) | Määrittää kohdeosoitteeseen osoittavan tunnisteen                |
| `alempi`            | Valinnainen lippu – katso alla                                   |**Merkistötilat:**| Tila                            | Isojen kirjainten syöttö (`A`–`Z`)                                                                                        | Pienten kirjainten syöttö (`a`–`z`) |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
|**Isot kirjaimet (oletus)**| `$41`–`$5A` (PETSCII-isot kirjaimet CHROUTin kautta)                                                                      | myös yhdistetty `$41`–`$5A`         |
|**Pienet kirjaimet (`pienet`)**| Aakkosten kirjaimet on uudelleenjärjestetty, jotta näkyvä kirjainkoko pysyy samana pienten/isojen kirjainten merkistössä. | Sama sääntö                         |**Syntaksi:**```
.petscii $C000, "HELLO"              ; uppercase PETSCII (default)
.petscii $C000, "hello", lower       ; lowercase PETSCII ($61–$7A)
.petscii $C000, "HELLO", null        ; with null terminator
.petscii $C000, "hello", lower, null ; lowercase + null terminator
.petscii $C000, "HELLO" :my_msg      ; with macroLabel
```**Generoidut tavut (isoilla kirjaimilla, `"HEI"`):**```
; $C000
    .byte $48, $45, $4C, $4C, $4F   ; H E L L O (PETSCII $41–$5A range)
```**Koko koodissa:**0 tavua. Data sijoitetaan kohdeosoitteeseen lykättynä
dataosana (kuten RAWBYTES).**Nollapäätteinen merkki:**lisää `null`-lipun liittääksesi `$00` tavun tekstin
jälkeen. Ihanteellinen null-päätteisille silmukoille:

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
```**Koodaussäännöt:**| Syöttö                                   | Isojen kirjainten tila                      | Pienten kirjainten tila |
| ---------------------------------------- | ------------------------------------------- | ----------------------- |
| `A`–`Z`                                  | `41 $`–`5A $`                               | `$61`–`$7A`             |
| `a`–`z`                                  | `$41`–`$5A` (pakotettu isoilla kirjaimilla) | `41 $`–`5A $`           |
| Välilyönti, numerot, välimerkit (32–126) | sellaisenaan                                | sellaisenaan            |
| Rivinvaihto                              | `$0D` (PALUU)                               | `$0D`                   |
| Muut                                     | `$20` (välilyönti)                          | `20 dollaria`           |

>**Vinkki:**Käytä PETSCII:tä datalle, joka lähetetään CHROUTin kautta
> (`$FFD2`). Kirjoitettaessa suoraan näytön RAM-muistiin, käytä STRING- tai
> RAWTEXT-komentoa.

---

### CHARSET

Vaihtaa VIC-II-merkki-ROMin isojen kirjainten/grafiikkatilan (C64-oletus) ja
pienten kirjainten/isojen kirjainten tilan välillä muokkaamalla `$D018`:n bittiä
1 ajonaikana.

| Argumentti | Kuvaus                                                                                                                                                         |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tila       |**Pienet kirjaimet**— ottaa käyttöön pienten/isojen kirjainten merkistöä;**Isot kirjaimet**— palauttaa oletusarvoisen isojen kirjainten/grafiikkamerkistöä. |**Syntaksi:**```
.charset lower    ; switch to lowercase charset
.charset upper    ; switch back to uppercase/graphics charset
```**Generoitu koodi:**Pienten kirjainten tila:
```
    LDA $D018
    ORA #$02      ; set bit 1 → lowercase/uppercase ROM at $1800
    STA $D018
```

Isojen kirjainten tila:
```
    LDA $D018
    AND #$FD      ; clear bit 1 → uppercase/graphics ROM at $1000
    STA $D018
```**Koko:**8 tavua (LDA abs + ORA/AND imm + STA abs).**Miksi ORA/AND suoran kirjoituksen sijaan?**`$D018` ohjaa myös näytön
RAM-muistin sijaintia (bitit 7–4). Vain bitin 1 kytkeminen päälle/pois säilyttää
loput rekisteristä.**Tyypillinen työnkulku:**```
.charset lower
.text 0, 0, "hello world", lower
.charset upper
```

>**Huomautus:**CHARSET-makro muuttaa vain VIC-merkki-ROM-osoitinta. Se ei
> kutsu `$E544` (KERNAL-merkkijoukon alustus). Useimmissa tapauksissa tämä
> riittää; kutsu `JSR $E544` ensin vain, jos tarvitset KERNALin omien
> tulostusrutiinien huomioivan muutoksen.

---

### CHARDEF

Määrittää yhden 8×8 mukautetun merkin RAM-pohjaisessa merkistössä. Lähettää
suorituksenaikaista koodia, joka kopioi 8 tavua `base + index * 8` -merkkijonoon
— ei tarvita edeltävää otsikkoa tai `ORG`-merkkijonoa.

| Argumentti      | Kuvaus                                                                                                                          |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Merkistöpohja   | RAM-merkistölle määritetty perusosoite (oletusarvo `$3800`). Osoite on kohdistettava siten, että VIC-II näkee sen (katso alla). |
| Merkkihakemisto | Mikä merkkipaikka määritellään uudelleen, 0–255. `65` = 'A' oletusnäyttökoodin asettelussa.                                     |
| 8 tavua         | Pilkuilla erotetut bittikarttarivit ylhäältä alas. Kunkin tavun bitti 7 = vasemmanpuoleisin pikseli.                            |**Syntaksi:**```
.chardef $3800, 65, $18,$3C,$66,$7E,$66,$66,$66,$00
```**Generoitu koodi (8 × `LDA #b` / `STA target+n`, yhteensä 40 tavua):**```
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
```**Kohdeosoite:**`$3800 + 65 * 8 = $3A08`. Lasketaan käännösaikana ja koodataan
kiinteästi STA-operandeihin.**Koko:**40 tavua merkkiä kohden (8 × 5).**Tyypillinen työnkulku:**```
    ; Point VIC-II at RAM charset at $3800
    LDA $D018
    AND #$F1
    ORA #$0E       ; bits 3-1 = %111 → charset at bank+$3800
    STA $D018

    .chardef $3800, 65, $18,$3C,$66,$7E,$66,$66,$66,$00   ; redefine 'A'
    .chardef $3800, 66, $7C,$66,$66,$7C,$66,$66,$7C,$00   ; redefine 'B'
    ; ... more .chardef lines for each custom char
```**Milloin käyttää CHARDEFia vs. vaihtoehtoja:**| Lähestyä                          | Käytä, kun                                                                                                       |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
|**CHARDEF**| Tarvitset muutaman mukautetun merkin (esimerkiksi 1–20). Suoritusaikakustannukset ovat 40 tavua merkkejä kohden. |
|**RAWBYTES @ 3800 dollaria**| Sinulla on täysi mukautettu merkistö (256 merkkiä). Yhteensä 2 kt dataa, ei ajonaikaista kopiota.                |
|**INCBIN "charset.bin" @ 3800 $**| Ulkoinen merkistötiedosto (character editor -ohjelman luoma). Siistein vaihtoehto.                               |
|**Merkistöpohja + INCBIN**| Täysi 256 merkin bittikarttakuva maalattu yhdeksi 128 × 128 -kuvaksi.                                            |

>**Tasonkorjausmuistutus:**VIC-II odottaa merkistöpohjan olevan `$0800`
> kerrannainen. Kelvolliset pankit: `$0000`, `$0800`, `$1000`, ... , `$3800`
> (nykyisen 16 kt:n VIC-pankin sisällä). RAM-merkistöjen tyypillisesti ovat
> `$2000`, `$2800`, `$3000` tai `$3800`.

---

### BOX_HIT

Akselikohtaisesti tasatun rajaavan laatikon (AABB) törmäystesti kahden
nelitavuisen nollasivuisen rakenteen kuvaaman suorakulmion välillä. Palauttaa
tuloksen akkumulaattoriin:**A = 1**päällekkäisyydessä,**A = 0**muuten.
Puhdas inline-kokoonpano, ei aliohjelmakutsuja.

| Argumentti             | Kuvaus                                                                       |
| ---------------------- | ---------------------------------------------------------------------------- |
| Box1:n postinumeroalue | Ensimmäisen laatikon 4-tavuisen rakenteen nollasivupohja (oletusarvo `$FB`). |
| Box2:n postinumeroalue | Toisen laatikon 4-tavuisen rakenteen nollasivupohja (oletusarvo `$F7`).      |**Rakenteen asettelu**(4 tavua ruutua kohden, etumerkittömät 8-bittiset
koordinaatit):

| Offset | Ala    |
| ------ | ------ |
| `+0`   | Vasen  |
| `+1`   | Yläosa |
| `+2`   | Oikea  |
| `+3`   | Pohja  |**Syntaksi:**```
.box_hit $FB, $F7
```**Generoitu koodi (30 tavua, täysin PC-relatiivinen — ei aliohjelmia, ei
absoluuttisia hyppyjä):**```
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
```**Koko:**30 tavua.**Tyypillinen työnkulku:**```
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
```**Rajoitukset:**- Molempien nollasivuosoitteiden on oltava muotoa `≤ $FC` (jokainen laatikko
  tarvitsee 4 peräkkäistä tavua: `zp`, `zp+1`, `zp+2`, `zp+3`).
- Koordinaatit käsitellään muodossa**merkitön 8-bittinen**(0–255). Tämän
  alueen ulkopuolella olevat etumerkilliset sprite-koordinaatit normalisoidaan
  ennen tallennusta.
- Kaksi laatikkoa voivat halutessaan olla päällekkäin ZP-tilassa, mutta yleensä
  tarvitaan 8 erillistä tavua.**Miksi ei aliohjelmaa?**Rivinsisäinen generointi välttää
JSR/RTS-yleiskuormituksen (yli 14 sykliä) ja pitää testin kuumana välimuistissa
tiukkoja pelisilmukoita varten. Jos sinun täytyy testata useita pareja, aseta
oma `JSR box_hit_sub` manuaalisesti yhden BOX_HIT-rivin ympärille.**Vertailu UB:n `box_hit()`-funktioon:**Ultimate Basic käyttää samaa
6502-logiikkaa kuin ajonaikainen funktio, joka palaa muuttujaan. VA:ssa BOX_HIT
sijoitetaan riville siihen kohtaan, johon testiä tarvitaan; tulos on
`A`-tiedostossa.

---

### INCBIN

Kuten**BLOAD BASIC**:ssä — poimii ulkoisen binääritiedoston (`.bin`, `.prg`,
`.sid`, `.raw`) ja upottaa sen suoraan koottuun PRG:hen määrittämääsi
osoitteeseen.

| Argumentti | Kuvaus                                                                       |
| ---------- | ---------------------------------------------------------------------------- |
| Tiedosto   | Selaa ja valitse tiedosto, jonka tyyppi on `.bin`, `.prg`, `.sid` tai `.raw` |
| Osoite     | Kohdekuormitusosoite (esim. `$C000`)                                         |**Syntaksi:**```
.incbin "music.bin", $C000
```**Generoidun koodin kommentti:**```
    ; INCBIN "music.bin" @ $C000 (2048 bytes)
    .byte $01, $02, ...
```**Koko koodissa:**0 tavua (lykätty dataosa). Binääritiedosto on upotettu
annettuun osoitteeseen.

---

### KOALA

Lataa**Koala Painter**-kuvan (`.koa` / `.kla`, 160×200 monivärinen) ja näyttää
sen. Kuvan tiedot upotetaan kiinteään osoitteeseen, kuten `INCBIN` (tiedoston
2-tavuinen `$6000` latausosoite poistetaan), ja itse direktiivi kääntyy
86-tavuiseksi näyttörutiiniksi, joka suoritetaan siinä missä se sijaitsee.

| Argumentti | Kuvaus                                                                                                                                                  |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tiedosto   | Selaa ja valitse tiedosto `.koa` / `.kla` (10003 tavua tai 10001 ilman latausosoitetta)                                                                 |
| Osoite     | Bittikarttaosoite: `$6000` (oletus, Koalan alkuperäinen, VIC-pankki 1, näytön RAM-muisti `$4400`) tai `$2000` (VIC-pankki 0, näytön RAM-muisti `$0400`) |

Näyttörutiini kopioi näyttömuistin RAM-osan näytölle ja värimuistin osan
osoitteeseen `$D800`, kirjoittaa taustatavun osoitteeseen `$D021`, valitsee
VIC-pankin osoitteesta `$DD00` (säilyttäen muut porttibitit) ja vaihtaa
monivärisen bittikarttatilan päälle (`$D011 = $3B`, `$D016 = $18`, `$D018 =
$18`). Muut osoitteet hylätään: loput 8K-paikkaa ovat BASIC/KERNAL ROM -muistin
alla (kopiointisilmukka lukisi ROMia) tai menevät päällekkäin merkki-ROM-varjon
kanssa.**Syntaksi:**```
.koala "picture.koa"
.koala "picture.koa", $2000
```**Esimerkki — näytä kuva ja odota:**```
* = $0801
.koala "picture.koa"
wait:
    JMP wait
```**Koko koodissa:**86 tavua (näyttörutiini); 10001 tavua kuvadataa menee
annettuun osoitteeseen. C64 Visual Assemblerin Hires-editori vie yhteensopivan
tiedoston.

---

### LEVEL / LEVEL_ROW

Lisää**Level Editor**-projektin ohjelmaasi ja kopioi tason rivit
näyttöpuskuriin – vierityspelin rakennuspalikoita. C64 Visual Assemblerin
`level-demo.asm` -esimerkki on täydellinen joystick-vieritystaso.

#### LEVEL

INCBIN-tyylinen direktiivi, joka tuottaa**0 tavua koodia**. Vain**sijoitetut**näytöt tasoeditoriprojektista (`.bin`, jonka C64 Visual Assemblerin tasoeditori
tallentaa) menevät muistiin annetusta osoitteesta (oletusarvo `$2000`),
järjestyksessä 2000 tavua näyttöä kohden (1000 näyttökoodia + 1000 väriä).
Identtiset näytöt tallennetaan kerran, ja kaikki tyhjät paikat jakavat yhden
tyhjän näytön. Osoitintaulukot seuraavat näyttöjä. Taso voi olla jopa 7 × 10
näyttöä.**Syntaksi:**```
.level "level.bin"
.level "level.bin", $4000
```

| Määritelty                                                                    | Merkitys                                                                                                                                                           |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `TASO_PAIKKA_ALHAINEN` / `TASO_PAIKKA_KORKEIN`                                | Kunkin paikan näytön osoite (rivikohtainen, `LEVEL_W` paikkaa riviä kohden)                                                                                        |
| `TASO_RIVI_PAIKKA`                                                            | Tasomerkkirivi → sen näyttörivin ensimmäinen paikka                                                                                                                |
| `TASO_RIVI_ALHAINEN/KORKEA`, `TASO_VARREN_ALHAINEN/KORKEA`                    | Tasomerkkirivi → sen näyttökoodirivin / väririvin siirtymä näytön sisällä                                                                                          |
| `TASO_KOLON_PAIKKA`, `TASO_KOLON_MUKAISET`                                    | Näkymän aloitussarake → näytön sarake ja näytön sisällä oleva sarake                                                                                               |
| `TASO_V`, `TASO_K`                                                            | Tasojen koko näytöillä                                                                                                                                             |
| `TASO_SARAKKEET`, `TASO_RIVIT`                                                | Tason koko merkeinä                                                                                                                                                |
| `LEVEL_MAX_X`, `LEVEL_MAX_Y`                                                  | 40×25-näkymän suurin pikselin vierityskohta                                                                                                                        |
| `TASO_BG`, `TASO_MC1`, `TASO_MC2`, `TASO_MONIVÄRINEN`                         | Tausta-/moniväriset värit ja tason tila                                                                                                                            |
| `TASOTIEDOT`, `TASOKO`, `TASOLOPPUTAUDEN`                                     | Aloitus, koko ja ensimmäinen vapaa osoite tasotietojen jälkeen                                                                                                     |
| `LEVEL_OBJ_X_LO/HI`, `LEVEL_OBJ_Y_LO/HI`, `LEVEL_OBJ_TYPE`, `LEVEL_OBJ_PARAM` | Objektitaulukko (Level Editor -objektitaso): sijainti tasopikseleissä, tyyppi ja parametritavu vieritysjärjestyksessä — `LEVEL_OBJ_COUNT` merkintää (enintään 255) |
| `LEVEL_OBJ_T_START` … `LEVEL_OBJ_T_TRIGGER`                                   | Objektityyppien numerot: ALKU 0, VIHOLLISEN 1, ESINE 2, OVI 3, ULOSKÄYNTI 4, LIIPAISIN 5                                                                           |
| `LEVEL_START_X`, `LEVEL_START_Y`                                              | Ensimmäisen aloitusobjektin sijainti (määritellään vain, jos tasolla on sellainen)                                                                                 |
| `TASO_ATTR`, `TASO_ATTR_KIINTEÄ` … `TASO_ATTR_KERÄYS`                         | Merkkien ominaisuustaulukko (yksi lipputavu näyttökoodia kohden; vain silloin, kun tasolla on ominaisuuksia) ja sen bitit: 1, 2, 4, 8                              |
| `TASO_REUNUS`, `TASO_VÄRIT`, `TASO_REUNUS/REUNUS/MC1/MC2`                     | Tasoraja; paikkakohtaiset väritaulukot (rivikohtainen, kuten `LEVEL_SLOT_*`), kun näytöllä on omat värinsä (`LEVEL_SCR_COLORS` = 1)                                |

Tyypillinen vartija: `.assert LEVEL_END <= $9200, "tasodata törmää koodiin"`.

#### LEVEL_ROW

Kopioi yhden 40-merkkisen rivin tasosta puskuriin: tasorivin muuttujassa**X**alkaen `col`-muuttujassa olevasta tasosarakkeesta, `dst`-osoittimessa olevaan
osoitteeseen (`dst` / `dst+1`, lo/hi). Kolmannella argumentilla `color`
kopioidaan värit näyttökoodien sijaan (väri-RAMia varten). Kahden näytön yli
ulottuvaa 40-merkkistä ikkunaa käsitellään itseään muokkaavalla
kopiointisilmukalla (~14 sykliä tavua kohden). X säilytetään, A ja Y tuhotaan.
Ohjelmassa tarvitaan `.level`-lohko.**Syntaksi:**```
.level_row dst_lo, view_x
.level_row dst_lo, view_x, color
```**Koko koodissa:**132 tavua — käytä `LBEQ` / `LBNE`, kun haaran on hypättävä
sen yli.

---

### SID

Kuten**BLOAD musiikille**— lataa `.sid` -tiedoston PRG:hen ja lukee
automaattisesti sen Init- ja Play-osoitteet otsikosta. Kutsu Init-komentoa
kerran käynnistyksen yhteydessä ja sitten Play-komentoa IRQ-käsittelijästäsi
joka kehys.

| Argumentti                      | Kuvaus                                                                                               |
| ------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Tiedosto                        | Tiedosto `.sid` (PSID / RSID)                                                                        |
| Mukautettu osoite (valinnainen) | Korvaa SID:n natiivi latausosoite (esim. `$1000`). Jätä tyhjäksi käyttääksesi SID-otsikon osoitetta. |

SID-otsikko antaa:
-**Latausosoite**— mihin data sijoitetaan muistissa (mukautettu osoite, jos
  sellainen annetaan)
-**Init-osoite**— kutsu tätä JSR:llä musiikin alustamiseksi (siirretään
  mukautetun osoitteen kanssa)
-**Toistoosoite**— kutsu tätä JSR:llä jokaisella IRQ-käsittelijän kehyksellä
  (siirretään yhdessä mukautetun osoitteen kanssa)**Syntaksi:**```
.sid "Ikari_Warriors.sid"
.sid "Ikari_Warriors.sid", $1000
```**Generoidun koodin kommentti:**```
    ; SID "Ikari_Warriors.sid" @ $1000  Init:$1000  Play:$1006  (4096 bytes)
```**Koko koodissa:**0 tavua rivillä. SID-binääritiedosto sijoitetaan PRG:n
määritettyyn osoitteeseen lykättynä osana.

>**Tärkeää:**Useimmat SID-tiedostot sisältävät kovakoodattuja sisäisiä
> absoluuttisia osoitteita. Ne voidaan siirtää vain, jos koko binääritiedostoa
> siirretään samalla siirtymällä. Jos SID:ssä on sisäisiä hyppyjä osoitteeseen
> `$10xx`, sen on pysyttävä osoitteessa `$1000` – sen siirtäminen eri
> osoitteeseen rikkoo nämä sisäiset viittaukset.

>**Tyypillinen käyttö:**Anna SID:lle oma osoite (`.sid "tune.sid", $1000`),
> kun sen natiiviosoite on ristiriidassa koodisi kanssa. Kutsu Init-funktiota
> kerran käynnistyksen yhteydessä ja sitten Play-funktiota joka kehys
> rasteri-IRQ-käsittelijältä — tai anna [SID_PLAYER](#sid_player):n tehdä
> molemmat.**Tunnisteet:**SID-direktiivi määrittelee `SID_LOAD` (mihin data sijoitetaan),
`SID_INIT` ja `SID_PLAY` (init- ja toisto-osoitteet, siirretty yhdessä
mukautetun osoitteen kanssa). `SID_PLAY` puuttuu, kun sävelmällä ei ole
toisto-osoitetta (RSID, joka asentaa oman IRQ:n). Käytä niitä omassa koodissasi,
esim. `JSR SID_PLAY` IRQ-käsittelijässä.

---

### SID_PLAYER

Toistaa**SID**-direktiivin sävelmän yhdellä rivillä: se alustaa sävelmän ja
kutsuu toistorutiiniaan jatkuvasti rasterikeskeytyksestä, jotta ohjelmasi voi
jatkaa omaa työtään.

| Argumentti | Kuvaus                                                                |
| ---------- | --------------------------------------------------------------------- |
| Laulu      | A-muistin init-rutiinille välitetty aliviritysnumero (oletusarvo `0`) |
| Rasteri    | Keskeytyksen rasteririvi, `$00`–`$FF` (oletusarvo `$FA`)              |

Mitä se tekee: `SEI`, `LDA #song` / `JSR SID_INIT`, kytkee CIA1-ajastimen IRQ:n
pois päältä (`$DC0D`), asettaa IRQ-vektorin (`$0314/$0315`) sisäänrakennetulle
käsittelijälleen, rasteririville (`$D012`, bitti 8 kohdassa `$D011` tyhjennetty)
ja rasteri-IRQ:lle (`$D01A`), `CLI`, sitten hyppää käsittelijän yli. Käsittelijä
kuittaa keskeytyksen (`ASL $D019`), kutsuu `JSR SID_PLAY` ja siirtyy
KERNAL-käsittelijään (`JMP $EA31`), joka myös skannaa näppäimistön.**Syntaksi:**```
.sid "Ikari_Warriors.sid"
.sid_player
.sid_player 1, $80
```**Koko koodissa:**58 tavua.

>**Huom:**ohjelmassa on oltava rivi `.sid` (`SID_INIT` ja `SID_PLAY`); muuten
> koonti pysähtyy virheeseen. Kun CIA1-ajastimen IRQ on pois päältä, KERNAL
> suoritetaan kerran rasteri-IRQ:n kehyksessä — näppäimistö ja `GETIN` jatkavat
> toimintaansa.

---

### INCLUDE

Kuten**MERGE BASIC**-komennossa — noutaa toisen tiedoston ja laajentaa sen
rivillä tässä kohdassa. Täydellinen uudelleenkäytettäville
aliohjelmakirjastoille.

Kahta tiedostotyyppiä tuetaan:
-**Plain assembly-lähdekoodi**(`.inc`, `.asm`, `.s`) — tiedosto luetaan
  VMA-lähdekoodina. Se luetaan uudelleen jokaisella koonnilla, joten voit
  muokata sitä millä tahansa editorilla.
-**Visual Assembler -projekti**(`.json`) — C64 Visual Assembler
  -lohko-ohjelman lohkot.

| Argumentti                 | Kuvaus                                                                                                                                                                                                                                                           |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tiedosto                   | `.inc` / `.asm` / `.s` -lähdekoodi tai `.json` -visuaalinen assembler-projekti                                                                                                                                                                                   |
| Latausosoite (valinnainen) | Jos se on asetettu (heksadesimaali, esim. `C000`), sisällytetty koodi sijoitetaan kyseiseen osoitteeseen — sen eteen lisätään `ORG`, ja sisällytetyn tiedoston omat ORG:t jätetään huomiotta. Ilman sitä sisällytetyn tiedoston omat ORG:t ohjaavat sijoittelua. |**Syntaksi:**```
.include "library.json"
.include "macros.inc", $1500
.include "sprites.asm"
```

- Anna**-tiedostolle tiedostopääte**— pelkkää nimeä, kuten `.include
  "macros"`, käsitellään nimellä `.include "macros.json"`.
- Polun tarkkuus: ensin lähteen vierestä, sitten jokaisessa hakukansiossa (CLI:n
  `--base-dir` / `--search`); toisella koneella kirjoitettu polku palaa pelkkään
  tiedostonimeensä. Puuttuva include-osa ei ole virhe – koonti jatkuu ilman
  sitä.**Generoitu koodi (ei osoitteen ohitusta):**```
    ; .include "library.json"
    ... (the included code follows)
```**Generoitu koodi (latausosoitteella `C000`):**```
    ; .include "library.json" @ $C000
    *=$C000
    ... (the included code follows)
```

>**Vinkki:**Käytä INCLUDE-komentoa luodaksesi uudelleenkäytettäviä
> aliohjelmakirjastoja, joita voit jakaa projektien välillä.
> `.inc`/`.asm`/`.s`-tiedostot sopivat parhaiten, kun haluat muokata kirjastoa
> tekstieditorissa tai jakaa sen muiden 6502-assembler-ohjelmien kanssa;
> `.json`-tiedostot, kun kirjasto on Visual Assembler -lohko-ohjelma. Aseta
> latausosoite, kun kirjastolla ei ole omaa ORG:ta tai kun haluat ohittaa sen
> oletussijainnin.

>**2.1:**Sisällytetty tiedosto, jota ei löydy, on virhe, samoin kuin tiedosto,
> joka sisällyttää itsensä (suoraan tai alempana). Sisällytetyn tiedoston omat
> rivit `.include`, `.incbin` ja `.sid` ladataan myös suhteessa sen omaan
> kansioon, ja sen makrokutsuja laajennetaan – jopa 16 tasoa syvälle.

---

### TABLE

Kuten**DIM tietyssä osoitteessa**— nimeää hakutaulukon ja määrittää sen
sijainnin muistissa. Lisää sen jälkeen rivit `.byte`, `.word` tai `.fill`
määrittääksesi taulukon sisällön.

| Argumentti | Kuvaus                                               |
| ---------- | ---------------------------------------------------- |
| Nimi       | Taulukon tunniste (esim. `väritaulukko`)             |
| Osoite     | Kiinteä osoite, josta taulukko alkaa (esim. `$C000`) |**Syntaksi:**```
.table color_table $C000
.table lookup              ; at the current address
```**Generoitu koodi:**```
color_table:
```

Osoitteen kanssa ohjelmalaskuri hyppää siihen; ilman sitä taulukko aloittaa
nykyisestä osoitteesta. Lisää sen jälkeen rivit `.byte` / `.word` / `.fill`
sisällön täyttämiseksi.**Koko:**0 tavua.

---

### ORG

Määrittää, mihin kohtaan muistia ohjelma (tai sen osa) sijoitetaan – aivan kuin
aloitusosoite valittaisiin ennen konekielisen koodin kirjoittamista. Jokainen
ohjelma tarvitsee vähintään yhden ORG:n. C64 BASICin vakiomuotoinen ladattava
aloitusosoite on `$0801`.

| Argumentti | Kuvaus                                                                             |
| ---------- | ---------------------------------------------------------------------------------- |
| Osoite     | Uusi lähtöosoite (esim. `0801` heksadesimaalimuodossa tai `2049` detsembrimuotoon) |
| HEX / DEC  | Vaihda osoitesyötön heksadesimaali- ja desimaalinäytön välillä                     |**Syntaksi:**```
* = $C000
```**Generoitu koodi:**```
* = $C000
```**Koko:**0 tavua. ORG itsessään ei tuota konekielistä koodia.

Jokainen ORG aloittaa uuden osion. Seuraavat rivit kootaan tästä osoitteesta
alkaen. PRG sisältää kaikki osiot yhdessä tiedostossa – osioiden väliset aukot
täytetään nollilla.**Esimerkki — koodi kohdassa `$0801`, datataulukko kohdassa `$C000`:**```
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

>**Vinkki:**Ilman ORG-elementtiä ohjelma alkaa kohdasta `$0801` (2049
> desimaalia), joka on BASIC-ohjelman alku. BASIC SYS -tynkällä (oletusarvo)
> assembler lisää lyhyen `10 SYS…` rivin kohtaan `$0801` ja koodisi alkaa
> kohdasta `$080D`. Katso [Tuloste: PRG, BASIC-tynkä ja
> aloituskohta](#3-lahto-prg-basic-tynka-ja-aloituspiste).

---

### LOOP / NEXT

Kuten**`FOR X=N TO 1 STEP -1 : ... : NEXT X`**BASICissa — laskee alaspäin
N:stä 1:een käyttäen X- tai Y-rekisteriä. Aseta käskysi LOOP- ja
NEXT-rekisterien väliin, niin se toistaa silmukan automaattisesti oikean määrän
kertoja.

#### LOOP

| Argumentti   | Kuvaus                                                              |
| ------------ | ------------------------------------------------------------------- |
| Rekisteröidy | `X` tai `Y` — laskurirekisteri                                      |
| Laskea       | Silmukan iteraatiomäärä (heksa- tai desimaaliluku, esim. `0A` = 10) |
| Tarra        | Automaattisesti luotu silmukan otsikko (esim. `loop0`)              |**Syntaksi:**```
.loop X, 10, loop0
```**Generoitu koodi:**```
    LDX #$0A
loop0:
```**Koko:**2 tavua (LD_-operaatiokoodi + välitön operandi).

#### NEXT

| Argumentti   | Kuvaus                                     |
| ------------ | ------------------------------------------ |
| Rekisteröidy | Automaattisesti sovitettu LOOP-rekisteriin |
| Tarra        | Automaattisesti linkitetty LOOP-tarraan    |**Syntaksi:**```
.next loop0
```**Generoitu koodi:**```
    DEX
    BNE loop0
```**Koko:**3 tavua (DEX + BNE + haaran offset).**Esimerkki — 10 näytön solun tyhjentäminen:**```
    LDX #$0A
loop0:
    LDA #$20        ; space character
    STA $0400,X
    DEX
    BNE loop0
```

---

### FOR / ENDF

Kuten**`FOR X=0 TO N-1 : ... : NEXT X`**BASICissa — laskee *ylöspäin*
nollasta. Ihanteellinen, kun tarvitset eteenpäin suuntautuvan indeksin,
esimerkiksi merkkijonon tai taulukon läpi askellettaessa.

#### FOR

| Argumentti   | Kuvaus                                                                                             |
| ------------ | -------------------------------------------------------------------------------------------------- |
| Rekisteröidy | `X` tai `Y` — laskurirekisteri                                                                     |
| Laskea       | Silmukan raja (heksa- tai desimaaliluku, esim. `$12` = 18). X/Y alkaa 0:sta ja päättyy raja-1:een. |
| Tarra        | Automaattisesti luotu silmukan otsikko (esim. `for0`)                                              |**Syntaksi:**```
.for X, $12, for0
```**Generoitu koodi:**```
    LDX #$00
for0:
```**Koko:**2 tavua (LD_-operaatiokoodi + `#$00`).

#### ENDF

| Argumentti   | Kuvaus                                            |
| ------------ | ------------------------------------------------- |
| Rekisteröidy | Automaattisesti FOR-rekisteriin täsmäävä          |
| Tarra        | Automaattisesti linkitetty FOR-tarraan            |
| Laskea       | Kopioidaan automaattisesti pariliitetystä FOR:sta |**Syntaksi:**```
.endf for0
```**Generoitu koodi:**```
    INX
    CPX #$12
    BNE for0
```**Koko:**5 tavua (IN_ + CP_ #imm + BNE-offset).**Esimerkki — tulosta tyhjään päättyvä merkkijono:**```
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

>**SILMUKKA vs. FOR:**SILMUKKA laskee alaspäin (N→1) — hyvä viiveille,
> täyttöille ja pikselisilmukoille. FOR laskee ylöspäin (0→N) — hyvä
> merkkijono-/taulukkosyötteelle. Molemmat voivat käyttää X:ää tai Y:tä.

---

### PUSH / PULL

Kuten**muuttujien tallentaminen ennen GOSUBia ja niiden palauttaminen**:n
jälkeen — mutta käyttää 6502-laitteistopinoa. Jos aliohjelma käyttää A:ta, X:ää
tai Y:tä, se kiedotaan PUSH- ja PULL-käskyihin, jotta kutsuvan koodin rekisterit
säilyvät.

#### PUSH

Lisää yhden tai useamman rekisterin pinoon. Järjestys on aina A → X → Y (sisin
ensin).

| Argumentti | Kuvaus                                                           |
| ---------- | ---------------------------------------------------------------- |
| Rekisterit | Mikä tahansa yhdistelmä: `A`, `X`, `Y`, `AX`, `AY`, `XY`, `XY[X] |**Syntaksi:**```
.push AXY
```**Generoitu koodi (esimerkki: `AX`):**```
    PHA
    TXA
    PHA
```**Koko:**1 tavu A:lle (`PHA`), 2 tavua X:lle tai Y:lle (siirto + push).

#### PULL

Palauttaa rekisterit pinosta käänteisessä**järjestyksessä**(Y → X → A).

| Argumentti | Kuvaus                                               |
| ---------- | ---------------------------------------------------- |
| Rekisterit | Sama kuin PUSH — täytyy vastata vastaavaa PUSH-arvoa |**Syntaksi:**```
.pull AXY
```**Generoitu koodi (esimerkki: `AX`):**```
    PLA
    TAX
    PLA
```

>**Sääntö:**PUSH- ja PULL-komentojen on aina käytettävä**samaa
> rekisterijoukkoa**. `PUSH AX` → `PULL AX` (palauttaa sisäisesti käänteisessä
> järjestyksessä: ensin X, sitten A).

---

### END / RTS alias

Kuten**RTS, mutta ystävällisemmällä makronimellä**— `.end` lähettää yhden
`RTS` tavun, lyhyen aliohjelman päättäjäismerkin.**Syntaksi:**```
.end
```**Generoitu koodi:**```
    RTS
```**Koko:**1 tavu.

Käytä tätä, kun haluat aliohjelman loppumerkin, joka lukee hieman enemmän makron
kuin raakakäskyn kaltaisesti.

---

### MACRO / ENDM / INVOKE

Kuten**niminen GOSUB parametreilla**— määrittele uudelleenkäytettävä
koodipätkä kerran (MACRO…ENDM) ja kutsu sitä sitten missä tahansa
INVOKE-komennolla. Anna eri argumenttiarvot joka kerta koodin kopioinnin ja
liittämisen sijaan.

#### MACRO (definition start)

| Argumentti | Kuvaus                                                                             |
| ---------- | ---------------------------------------------------------------------------------- |
| Nimi       | Makron tunniste (esim. `setColor`)                                                 |
| Parametrit | Valinnaiset pilkulla erotetut parametrien nimet (esim. `color` tai `color, count`) |

Merkitsee makromääritelmän alkua. MACRO- ja ENDM-merkkien väliset viivat
muodostavat makron rungon. Parametrillinen makro**ei luo koodia**, jossa
määritelmä sijaitsee; parametriton makro kootaan myös aliohjelmana (`JSR-nimi`
kutsuu sitä): ohjelma hyppää sen yli, ja sen loppuun lisätään `RTS`. Kiinteässä
osoitteessa olevassa kirjastossa tällainen makro saa myös `RTS`:n. Runkoon
parametri kirjoitetaan muodossa `{paramName}` tai sen pelkänä nimenä; Kutsu
täyttää argumentin — sekä käskyoperandit että kirjastomakrojen argumentit
(`.set_border c`, `.sprite_pos n, x, y` …). Makrorungon otsikot, silmukan
otsikot ja ajonaikaiset `.if` / `.while` -otsikot ovat yksilöllisiä
kutsukohtaisesti. Makrorungon sisällä olevaa makrokutsua ei laajenneta (virhe).**Generoitu koodi:**```
; .MACRO setColor (color)
    ... (body)
; .ENDM
```**Syntaksi:**```
.macro setColor color
    LDA {color}
    STA $D020
.endm
```

#### ENDM (definition end)

Sulkee nykyisen makromäärityksen. Ei argumentteja.

#### INVOKE

Kutsuu tässä kohdassa määriteltyä makroa ja korvaa annetuilla argumenttiarvoilla
`{paramName}` -paikkamerkit rungossa.

| Argumentti  | Kuvaus                                                                                       |
| ----------- | -------------------------------------------------------------------------------------------- |
| Makron nimi | Ohjelmassa tai sen mukana toimitetussa tiedostossa määritelty makro                          |
| Argumentit  | Pilkuilla erotetut argumenttiarvot, jotka vastaavat makron parametriluetteloa (esim. `#$07`) |**Generoitu koodi:**```
; .invoke setColor(#$07)
    LDA #$07
    STA $D020
```**Syntaksi:**```
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

Makron runko laajennetaan rivillä `{paramName}` korvattuna varsinaisilla
argumenteilla. Myös välilyönneillä erotettu muoto (`.invoke setColor #$07`) on
sallittu.**Argumenttityypit:**-**Numeerinen**: `#$07`, `$10`, `255` — heksa- tai desimaaliarvot
-**Tekstimerkkijonot**: `"Hello, World!"` — lainausmerkit (lainausmerkit on
  poistettu); lainausmerkkien sisällä olevia pilkkuja käsitellään osana tekstiä,
  ei argumenttien erottimina
-**Merkkiliteraali**: `'A'` — pysyy merkkiliteraalina, joten runko saa koodinsa
  (`$41`)
-**Sekoitettu**: `#07$, "hello", 20$` — mikä tahansa yhdistelmä

>**Vinkki:**Määrittele makrot ohjelmasi ylä- (tai alareunassa) ja KUTSU niitä
> sitten tarvittaessa. Makroja voidaan kutsua useita kertoja eri argumenteilla.

>**2.1:**makro voi kutsua toista makroa (`both(a, b)` kutsumalla `setc(a)`);
> sisempi kutsu saa ulomman kutsun argumentit ja omat yksilölliset paikalliset
> tunnisteensa. Itseään kutsuva makro pysähtyy virheeseen 16 tason jälkeen
> jumiutumisen sijaan.

---

### REGION / ENDREGION

Puhdas ryhmittely editoreille ja listauksille —**nolla tavua**, nolla
vaikutusta koottuun koodiin.

| Argumentti  | Kuvaus                                                                           |
| ----------- | -------------------------------------------------------------------------------- |
| Alueen nimi | Vapaamuotoinen tekstiotsikko osiolle (esim. `init`, `game_loop`, `sprite_setup`) |**Syntaksi:**```
.region init
    ; code...
.endregion
```**Generoitu koodi:**```
; region init
    SEI
    LDA #$00
    STA $D020
; endregion init
```**Koko:**0 tavua sekä REGION- että ENDREGION-kohteille.

>**Huom:**Alueet voivat olla**sisäkkäisiä**toistensa sisällä. Jokainen
> PÄÄALUE sulkee lähimmän avoimen ALUEEN. Ei vaikutusta koottuun tulosteeseen.

---

### DEFINE / IF / ELSE / ENDIF

Kuten**-kytkin, assembler lukee**— `DEFINE DEBUG` kytkee symbolin päälle,
minkä jälkeen minkä tahansa `IF DEBUG`-haaran rivit kootaan ja sen `ELSE`-haaran
ohitetaan. Poistamalla DEFINE-osan IF-osa katoaa tulosteesta. Julkaisuversioita
varten ei tarvitse poistaa koodia.

#### DEFINE

| Argumentti | Kuvaus                                                                                      |
| ---------- | ------------------------------------------------------------------------------------------- |
| Symboli    | Yksi tai useampi pilkulla erotettu tunniste aktivoitavaksi (esim. `DEBUG` tai `DEBUG, PAL`) |**Syntaksi:**```
.define DEBUG, PAL
```**Generoitu koodi:**```
; .DEFINE DEBUG
; .DEFINE DEBUG, PAL
```

`DEFINE` voi aktivoida useita symboleja kerralla (pilkulla erotettuna). Lisää
DEFINE-käskyt ohjelmasi alkuun.

#### IF

| Argumentti | Kuvaus                                                                                                                       |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Kunto      | `.define`d-symboli (aktiivinen), `.const`-nimi (aktiivinen, kun se ei ole nolla) tai vakiolauseke (`LEVEL == 2`, `MODE & 1`) |**Syntaksi:**```
.if DEBUG
```**Generoitu koodi:**```
; .IF DEBUG
```

Ehto joko kokoaa rivit `IF` ja `ENDIF` (tai `ELSE`) väliin tai ohittaa ne.
Pelkkä nimi on tosi, kun se on `.define`d tai nollasta poikkeava `.const`, ja
epätosi, kun se ei ole kumpikaan; minkä tahansa muun ehdon on oltava
vakiolauseke – lauseke, jota ei voida laskea kokoamisvaiheessa, on virhe.
Ohitetut rivit näkyvät muodossa `; [IF skipped] …` kommentteja ja luovat**zero
bytes**.

#### ELSE

Ei argumentteja. Merkitsee vaihtoehtoisen haaran — kootaan, kun `IF`-ehto on
*not* aktiivinen.**Syntaksi:**```
.else
```**Generoitu koodi:**```
; .ELSE
```

#### ENDIF

Ei argumentteja. Sulkee ehdollisen osan.**Syntaksi:**```
.endif
```**Generoitu koodi:**```
; .ENDIF
```**Koko:**0 tavua kaikille neljälle direktiiville. Vain niiden välissä oleva
sisältö * lasketaan.***Esimerkki — debug border flash, release build ohittaa sen:**```
; .DEFINE DEBUG

; .IF DEBUG
    LDA #$02        ; red border
    STA $D020
; .ELSE
    LDA #$00        ; black (release)
    STA $D020
; .ENDIF
```**Esimerkki — useita symboleja yhdessä DEFINE:**```
; .DEFINE DEBUG, PAL

; .IF PAL
    LDA #$xx        ; PAL timing constant
; .ELSE
    LDA #$xx        ; NTSC timing constant
; .ENDIF
```

Sisäkkäisiä `IF`-funktioita tuetaan. Jos ulompi osa ohitetaan, myös sisemmät
osat ohitetaan.

>**Huomautus:**Tämä on käännösaikaista ehtojen käsittelyä. Katso
> ajonaikaisesta vertailusta/haarautumisesta**Ajonaikainen IF / ELSE / ENDIF**> alla.

### .ASSERT

Käännösaikainen**tarkistus**. `.assert` arvioi lausekkeen kokoonpanon aikana;
jos se on epätosi (`0`), koonti pysähtyy selkeään virheeseen, joka sisältää
todellisen arvon. Jos se on tosi (ei nolla), se ei tuota mitään.

| Argumentti | Kuvaus                                                                                                                                |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Ilmaisu    | Mikä tahansa assembler-lauseke: otsikot, `CONST`s, `*` (ohjelmalaskuri), aritmetiikka ja vertailut (`<`, `<=`, `>`, `>=`, `==`, `!=`) |
| Viesti     | Valinnainen teksti, joka on liitetty virheilmoitukseen                                                                                |**Syntaksi:**```
.assert spriteData < $C000
.assert * < $A000
.assert end - start <= 256, "sprite table overflowed one page"
```**Käyttäytyminen:**-**Koko:**0 tavua.
- Epätosi väittämä keskeyttää kokoamisen: `` `.assert end - start <= 256` on
  epätosi (arvo: 0). sprite-taulukko ylitti yhden sivun.``
- Väite, jota ei voida evaluoida (määrittelemätön otsikko tms.), epäonnistuu
  myös merkinnällä *"ei voida evaluoida kokoonpanon aikana"*.
- Vertailut tuottavat `1` / `0`; sijoita `.assert` mihin tahansa ohjelmavirran
  kohtaan — se tarkistetaan siinä osoitteessa, jossa se sijaitsee, joten
  `.assert * < $D000` testaa nykyisen tulosteen sijainnin.**Esimerkki — sprite-datan suojaaminen sivun ylitykseltä:**```
* = $3000
sprite_data:
    .byte $00, $00, $00        ; … 63 bytes …
sprite_data_end:
    .assert sprite_data_end - sprite_data == 63, "sprite must be exactly 63 bytes"
    .assert (sprite_data % 64) == 0, "sprite must be 64-byte aligned"
```

---

### CONST

Kuten**nimetty muuttuja, joka ei koskaan muutu**— `SCREEN = $0400`. Käytä
nimeä sen sijaan, että kirjoittaisit raakaosoitteita kaikkialle, mikä helpottaa
koodin lukemista ja muuttamista myöhemmin.

| Argumentti | Kuvaus                                                                                                                               |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Nimi       | Vakion tunniste (esim. `SCREEN`)                                                                                                     |
| Arvo       | Numeerinen arvo valitussa kantaluvussa (esim. `0400` heksadesimaalimuodossa = osoite $0400) tai PC-relatiivinen lauseke (katso alla) |
| Muoto      | HEX tai DE — määrittää, miten arvo syötetään ja näytetään                                                                            |**Syntaksi:**```
.const SCREEN = $0400
.const FRAMES_1S = 60
```**Generoitu koodi:**```
; .CONST SCREEN = $0400
```**PC-relatiiviset lausekkeet (`*+N` / `*-N`):**Arvo hyväksyy myös muodon `*+N` tai `*-N`, jossa `*` on itse `.const`-rivin
osoite. Tätä käytetään nimetyn aliaksen luomiseen tavulle läheisen käskyn
sisällä – klassinen itseään muokkaava koodimalli:

```
.const op = *+1      ; op → address of the immediate operand of the next LDA
LDA #$00            ; $00 will be patched at runtime
...
STA op              ; overwrites the #$00 byte → LDA reads the new value next time
```

CONST-muuttuja tuottaa 0 tavua; käännöksen yhteydessä sen nimi palautuu muotoon
`current_address + 1`.**Aritmeettiset lausekkeet:**Arvo hyväksyy yleisiä aritmeettisia laskutoimituksia, mukaan lukien viittaukset
aiemmin määriteltyihin CONST-nimiin, heksadesimaali-/binääriliteraaleihin ja
sisäänrakennettuihin matemaattisiin funktioihin:

```
.const SCREEN      = $0400
.const SCREEN_END  = SCREEN + 40*25   ; 1000 bytes later
.const COLOR_RAM   = $D800
.const MID_X       = 160
.const SIN_TABLE   = round(sin(PI/8) * 127)   ; pre-computed sine value
```**Sisäänrakennetut funktiot:**`sin()`, `cos()`, `round()`, `max(a,b)`,
`min(a,b)`, `abs()`, vakio `PI`

Operaattorit: `+ - * /` Literaalit: `$FF` (heksadesimaali), `%10110000`
(binääri) Matala/korkea tavu: `lo(lauseke)`, `hi(lauseke)`**Koko:**0 tavua.

---

### VAR

Kuten**CONST, mutta automaattisesti allokoitu**— `VAR` varaa nollasivuisen
tallennustilan etiketille ilman, että sinun tarvitsee kirjoittaa osoitetta.
Käytä sitä laskureille, osoittimille ja lyhytaikaisille tiloille, jotka kuuluvat
ZP:hen.

| Argumentti         | Kuvaus                                                                 |
| ------------------ | ---------------------------------------------------------------------- |
| Nimi               | Muuttujan nimi / otsikko                                               |
| Koko (valinnainen) | Varattavien tavujen määrä. Jätä pois, jos varauksia on vain yksi tavu. |**Syntaksi:**```
.var counter
.var timer, 2
.var lives
```**Käytännön esimerkki:**```
.region Vars
.var counter
.var timer, 2
.endregion

LDA #$00
STA counter
```**Generoitu koodi:**```
; .var counter
```**Koko:**1 tavu oletusarvoisesti tai `N` tavua, kun koko on määritetty.

Allokaattori kävelee konfiguroitavan nollasivun kursorin (`$02` - `$FE`) yli ja
varaa seuraavan vapaan paikan. Jos pyydetty alue on päällekkäinen jo käytetyn
tunnisteen kanssa, kääntäjä antaa varoituksen.

---

### Runtime IF / ELSE / ENDIF

Kuten**oikea haarautumismalli**— tämä versio toimii ajonaikana, ei
käännösaikana. Se vertaa `A`, `X` tai `Y` välittömään arvoon ja tuottaa oikean
`CMP` / `CPX` / `CPY` + haarautumissekvenssin puolestasi.

| Argumentti   | Kuvaus                                    |
| ------------ | ----------------------------------------- |
| Rekisteröidy | `A`, `X` tai `Y`                          |
| Operaattori  | `==`, `!=`, `<`, `<=`, `>`, `>=`          |
| Arvo         | Välitön arvo heksa- tai desimaalimuodossa |**Syntaksi:**```
.if A == #$10
    LDA #$07
.else
    LDA #$0F
.endif
```**Koko:**Riippuu valituista haaroista ja vertailumuodosta.

Vertailu on oletusarvoisesti etumerkitön. Rekistereille `<=` ja `>` makro
laajenee valitun rekisterin lyhyimpään vastaavaan haaraketjuun.

---

### WHILE / ENDW

Kuten**suorituksenaikainen silmukka, jonka alussa on testi**— runko
suoritetaan niin kauan kuin ehto pysyy tosi.

| Argumentti   | Kuvaus                                    |
| ------------ | ----------------------------------------- |
| Rekisteröidy | `A`, `X` tai `Y`                          |
| Operaattori  | `==`, `!=`, `<`, `<=`, `>`, `>=`          |
| Arvo         | Välitön arvo heksa- tai desimaalimuodossa |**Syntaksi:**```
.while A != #$00
    JSR getchar
.endw
```**Koko:**Riippuu silmukan rungosta ja vertailumuodosta.

Käytä `WHILE`-metodia, kun silmukka saattaa päättyä ennen ensimmäisen iteraation
päättymistä. Se on laskemiseen perustuvan `LOOP / NEXT` -apufunktion
ajonaikainen vastine.

---

### REPEAT / UNTIL

Kuten**suorituksenaikainen silmukka, jonka lopussa on testi**— runko
suoritetaan aina ainakin kerran, minkä jälkeen ehto päättää, pysähtyykö se.

| Argumentti   | Kuvaus                                    |
| ------------ | ----------------------------------------- |
| Rekisteröidy | `A`, `X` tai `Y`                          |
| Operaattori  | `==`, `!=`, `<`, `<=`, `>`, `>=`          |
| Arvo         | Välitön arvo heksa- tai desimaalimuodossa |**Syntaksi:**```
.repeat
    JSR getchar
.until A == #$00
```**Koko:**Riippuu silmukan rungosta ja vertailumuodosta.

Käytä `REPEAT / UNTIL`, kun haluat rungon suoritettavan ainakin kerran ennen
poistumistarkistusta.

---

### MEMCPY / MEMSET

Kuten**pienet muistirutiinit, joita tavoittelet jatkuvasti**— `MEMCPY` kopioi
yhtenäisen lohkon, `MEMSET` täyttää alueen yhdellä tavulla.

| Makro          | Argumentit               |
| -------------- | ------------------------ |
| `MEMCPY`       | `lähde`, `dst`, `koko`   |
| `MUISTIASETUS` | `osoite`, `arvo`, `koko` |**Syntaksi:**```
.memcpy src=$C000, dst=$D000, size=$0100
.memset addr=$0400, value=#$20, size=$03E8
```**Generoitu koodi:**sisäisiä kopiointi-/täyttösilmukoita, jotka on valittu
vastaamaan pyydettyä kokoa.

Jopa 256 tavun koot käyttävät lyhyttä 8-bittistä silmukkaa. Suuremmat koot
vaihtavat automaattisesti 16-bittiseen laskuriin.

>**2.1:**Koodin koko on tiedettävä jo koodia piirrettäessä — luku tai vakio.
> Myöhemmin määritelty merkintä (jonka arvoa asettelu ei vielä tiedä) on virhe
> eikä paikkaansa sopimaton koodi.

---

### PRINT / PRINT_CHAR / PRINT_HEX / CLEAR_SCREEN / WAIT_KEY / DELAY / SET_BORDER / SET_BG

#### PRINT

Kuten**PETSCII-tuloste ilman vakiomuotoista**-tulostetta — tulostaa
merkkijonon `CHROUT`-funktion kautta samalla isojen/pienten kirjainten
käsittelyllä (`lower`) kuin `.petscii`.**Syntaksi:**```
.print "HELLO"
.print "hello", lower
```

#### PRINT_CHAR

Tulostaa yhden PETSCII-tavun numeerisena koodina ja lähettää sen
`CHROUT`-funktion kautta. Arvo voi olla myös nimetty vakio tai tunniste, joka
muunnetaan tavuksi kokoamisvaiheessa.**Syntaksi:**```
.print_char 65
.print_char $41
.print_char color
```

#### PRINT_HEX

Tulostaa 8-bittisen arvon heksadesimaalimuotoisena tekstinä normaalin
KERNAL-tulostuspolun kautta.**Syntaksi:**```
.print_hex A
```

#### CLEAR_SCREEN

Pikanäppäin C64:n vakiomuotoiseen selkeän näytön ohjauskoodiin.**Syntaksi:**```
.clear_screen
```

#### WAIT_KEY

Odottaa, kunnes näppäintä painetaan, joten sinun ei tarvitse suorittaa
`GETIN`-silmukkaa käsin joka kerta.**Syntaksi:**```
.wait_key
```

#### DELAY

Odottaa pyydetyn määrän kehyksiä jaetun apurutiinin kautta. Käytä tätä lyhyisiin
taukoihin ja ajoitusaukkoihin, kun täysin mukautettu silmukka olisi liiallinen.
Kehysten määrä voi olla raakaluku tai nimetty vakio, ja `.wait` on vain
`.delay`:n alias.**Syntaksi:**```
.delay 29
.wait 29
.delay frames=FRAMES_1S
```

#### SET_BORDER / SET_BG

VIC-II-värirekisterien mukavuuskääreet. Väriarvo voi olla raakaluku tai nimetty
vakio, joka ratkaisee välillä 0–15.**Syntaksi:**```
.set_border 6
.set_bg 0
.set_border color
.set_bg color
```**Koko:**Jokainen apufunktio laajenee pieneksi rekisterin kirjoitussekvenssiksi
tai lyhyeksi KERNAL-kutsuksi.

---

### IRQ_SETUP

Määrittää rasteri-IRQ-käsittelijän yhdellä vaiheella. Makro kirjoittaa
IRQ-vektorin, ottaa käyttöön rasteri-IRQ:t, asettaa linjan, poistaa käytöstä
yleiset CIA:n IRQ-lähteet ja palaa normaaliin suoritukseen komennolla `CLI`.

| Argumentti  | Kuvaus                                                  |
| ----------- | ------------------------------------------------------- |
| Käsittelijä | IRQ-rutiinin nimi (esim. `my_irq`)                      |
| Rasteri     | Rasteriviiva heksa- tai desimaalimuodossa (esim. `$FA`) |**Syntaksi:**```
.irq_setup handler=my_irq, raster=$FA
```**Koko:**Lyhyt asennussekvenssi; tarkka pituus riippuu valitusta
rasteriviivasta.

Käytä tätä, kun haluat yleisen "SEI / asennuskäsittelijä / IRQ:n käyttöönotto /
CLI" -mallin hajottamatta sitä koko ohjelmaan.

---

### RAND

Kuten pieni sisäänrakennettu PRNG**— palauttaa 8-bittisen pseudo-satunnaisen
arvon kompaktista nollasivuisesta siemenestä.

| Argumentti | Kuvaus                                                             |
| ---------- | ------------------------------------------------------------------ |
| Siemen     | Valinnainen nollasivun siementavu tai -tunniste (oletusarvo `$FB`) |**Syntaksi:**```
.rand
```**Koko:**Muutama tavu valitusta toteutustavasta riippuen.

Generaattori on tarkoitettu pelattavuuteen, tehosteiden muunteluun ja nopeaan
testidataan. Se on tarkoituksella pieni eikä kryptografisesti hienostunut.

---

<a id="sprite_init"></a>
### SPRITE_INIT

Määrittää VIC-II-spriten yhdellä rivillä — BASICissa kirjoitettaisiin noin kuusi
POKE-lauseketta. Asettaa spritin dataosoittimen, ottaa sen käyttöön,
valinnaisesti ottaa käyttöön moniväritilan ja asettaa sen värin.

| Argumentti  | Kuvaus                                                                  |
| ----------- | ----------------------------------------------------------------------- |
| Sprite #    | Sprite-numero 0–7                                                       |
| Väri        | Väri-indeksi 0–15 (C64-paletti)                                         |
| Tietosivu   | Sprite-datan osoite / 64 (esim. `$21`, jos data on osoitteessa `$0840`) |
| Monivärinen | Vaihtaa спрайtin monivärisbitin päälle/pois (`$D01C`)                   |**Syntaksi:**```
.sprite_init 0, 7, $21
.sprite_init 0, 7, $21, multicolor
.sprite_init 0, 7, $21, mono
```**Generoitu koodi:**```
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
```**Koko:**26 tavua.

>**Sprite-tietosivu:**`tieto_osoite ÷ 64`. Oletusarvoisella BASIC SYS
> -tynkällä `ALIGN 64` sivun `JMP main` jälkeen sijoittaa sprite-tiedot kohtaan
> `$0840` → sivu = `$21`.

---

<a id="sprite_pos"></a>
### SPRITE_POS

Kuten**`POKE 53248, x : POKE 53249, y`**BASICissa — asettaa spritin
aloituskohdan. Koordinaatit syötetään sisään kokoamisvaiheessa ja ne hyväksyvät
vakiot; animaatioon käytä `INC`/`DEC` suoraan spritin rekisterissä.

| Argumentti | Kuvaus                  |
| ---------- | ----------------------- |
| Sprite #   | Sprite-numero 0–7       |
| X          | Vaakasuora asento 0–319 |
| Y          | Pystysuora asento 0–255 |**Syntaksi:**```
.sprite_pos 0, 152, 100
```**Generoitu koodi (esimerkki: sprite 0, X=152, Y=100):**```
    LDA #$98        ; X low byte
    STA $D000       ; sprite 0 X register
    LDA $D010
    AND #$FE        ; clear X MSB for sprite 0 (X ≤ 255)
    STA $D010
    LDA #$64        ; Y = 100
    STA $D001       ; sprite 0 Y register
```

Jos X > 255, makro asettaa vastaavan bitin kohtaan `$D010` sen tyhjentämisen
sijaan.**Koko:**18 tavua.

>**Huomautus:**`SPRITE_POS` lisää X/Y-matriisin koodiin (`LDA #$xx`).
> Sprite-objektin animoimiseksi suorituksen aikana käytä `INC $D000` / `DEC
> $D000` — katso `sprite-macro-demo` esimerkki.

---

<a id="wait_raster"></a>
### WAIT_RASTER

Odottaa, että VIC-II-elektronisuihku saavuttaa tietyn skannausviivan – ikään
kuin synkronoituisi TV-ruudun kanssa. Aseta tämä pelisilmukan alkuun estääksesi
spritejen repeytymisen. Ei JSR:ää, ei etikettiä tarvita.

| Argumentti   | Kuvaus                                                     |
| ------------ | ---------------------------------------------------------- |
| Rasteriviiva | Kohderasteriviiva heksadesimaalina (esim. `FF` = rivi 255) |**Syntaksi:**```
.wait_raster $FF
```**Generoitu koodi:**```
wait:
    LDA $D012       ; current raster line
    CMP #$FF        ; target line
    BNE wait        ; loop back (-7 bytes)
```**Koko:**7 tavua (`BNE`-offset `$F9` = −7 osoittaa aina takaisin
`LDA`-kohtaan).

>**Vinkki:**Aseta `WAIT_RASTER` pelisilmukan yläreunaan synkronoidaksesi sen
> näytön kanssa ja estääksesi spritejen repeytymisen.

---

### JOYSTICK

Kuten lukee**`PEEK($DC00)`**ja sitten POKE-käyttää спрайtin sijaintia – mutta
yhdellä rivillä. Lukee yhden CIA-joystick-portin ja säätää спрайtin
X/Y-rekistereitä vastaavasti. Täysin inline-tilassa, ei JSR:ää tarvita.

| Argumentti | Kuvaus                                                            |
| ---------- | ----------------------------------------------------------------- |
| Portti     | `1` = portti 1 (`$DC01`) tai `2` = portti 2 (`$DC00`)             |
| Sprite #   | Sprite-numero 0–7 (säätelee, mitä X/Y-rekisteriparia päivitetään) |**Syntaksi:**```
.joystick 2, 0
```**Generoitu koodi (portti 2, sprite 0):**```
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
```**Ohjaussauvan bittikartta (aktiivinen-LOW — bitti = 0 tarkoittaa
painettuna):**| Bitti | Suunta | CIA-rekisteri                       |
| ----- | ------ | ----------------------------------- |
| 0     | Ylös   | $DC00 (portti 2) / $DC01 (portti 1) |
| 1     | Alas   |                                     |
| 2     | Vasen  |                                     |
| 3     | Oikea  |                                     |
| 4     | Palo   | (tämä makro ei käsittele)           |**Koko:**27 tavua. `BCS`-offset on aina `+3` (ohittaa seuraavan 3-tavuisen
`DEC`/`INC abs` -käskyn).**Muuttujatila — `.joystick port, vx, vy[, fire]`:**Spriten siirtämisen sijaan
suunta kirjoitetaan muuttujiin: `vx` / `vy` = `-1` / `0` / `+1` (`$FF` / `$00` /
`$01`), ja valinnainen `fire` = `1`, kun painiketta painetaan, `0` muuten. Käytä
sitä vieritettävään kameraan, pelaajaan, jolla on oma fysiikka, tai valikoihin.
Portti `3` lukee molemmat joystick-portit samanaikaisesti (`LDA $DC00` / `AND
$DC01`), joten kumpi tahansa portti toimii.

```
.joystick 2, vx, vy          ; 35 bytes
.joystick 3, vx, vy, fire    ; both ports + fire: 45 bytes
```

>**Tyypillinen käyttö:**Sijoita `gameloop`-otsikon sisään ensin `WAIT_RASTER`:
> ```
> pelinkehitys:
> WAIT_RASTER ($FF) JOYSTICK (portti=2, sprite=0)
> JMP-pelinkehitys
> ```

---

<a id="mouse"></a>

>**2.1:**portti on tiedettävä koodia kirjoitettaessa (numero tai vakio), koska
> portti 3 pidentää koodia 3 tavua; myöhemmin määritelty tunniste on virhe.
### MOUSE

Lukee Commodore 1351 -suhteellisen hiiren ja liikuttaa спрайтиa. Täysin**inline**— ei JSR:ää tai label-koodausta tarvita. Makro valitsee CIA-portin,
odottaa SID-mela-sisääntulojen tasaantumista, dekoodaa sitten delta-liikkeen
käyttämällä 1351-vakioajurikuviota ja soveltaa sitä спрайтirekistereihin.

| Argumentti | Kuvaus                                                                              |
| ---------- | ----------------------------------------------------------------------------------- |
| Portti     | `1` = CIA `$DC00` bittiä `7:6` = `%01`; `2` = `%10`                                 |
| Sprite #   | Sprite-numero 0–7                                                                   |
| ZP-tavu X  | Nollasivun osoite (heksa) edellisen POTX-näytteen säilyttämistä varten (esim. `FD`) |
| ZP-tavu Y  | Nollasivun osoite (heksa) edellisen POTY-näytteen säilyttämistä varten (esim. `FE`) |**Generoitu koodimuoto (portti 1, sprite 0, ZP `$FD`/`$FE`):**```
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
```**Koko:**142 tavua.**Syntaksi:**```
.mouse port, spriteNum, zpX, zpY
; example:
.mouse 2, 0, FD, FE
```

>**Tärkeää:**Ennen ensimmäistä kutsua alusta nollasivutavut nykyisillä
> POTX/POTY-arvoilla välttääksesi hypyn ensimmäisessä kehyksessä:
> ```
> ; portti 1: LDA $DC00 : JA #$3F : ORA #$40 : STA $DC00
> ; portti 2: LDA $DC00 : JA #$3F : ORA #$80 : STA $DC00
> LDA $D419 : LSR A : JA #$3F : STA $FD
> LDA $D41A : LSR A : JA #$3F : STA $FE
> ```

>**Vinkki:**Kysele hiirtä kerran kehystä kohden — lisää `WAIT_RASTER`
> pelisilmukkaan ennen `MOUSE`.

---

<a id="sprite_col"></a>
### SPRITE_COL

Kuten BASICin**`PEEK($D01E)`**— tarkistaa VIC-II-laitteiston törmäysrekisterit
ja kertoo, osuiko sprittiin toiseen spriteen vai taustaan. Täysin
inline-tilassa, ei JSR:ää tarvita.

| Argumentti    | Kuvaus                                                                                                                |
| ------------- | --------------------------------------------------------------------------------------------------------------------- |
| Sprite #      | Spriten numero 0–7 (mitä spritin bittiä tarkistetaan)                                                                 |
| Törmäystyyppi | `Sprite-Sprite ($D01E)` — törmäys toisen spriten kanssa; `Sprite-Background ($D01F)` — törmäys taustagrafiikan kanssa |**Syntaksi:**```
.sprite_col 0, sprite
.sprite_col 0, background
```**Generoitu koodi (sprite 0, sprite–sprite):**```
    LDA $D01E       ; read sprite-sprite collision register (clears it!)
    AND #$01        ; isolate bit 0 (sprite 0)
                    ; A ≠ 0 → collision occurred
```**Koko:**5 tavua.

>**Tärkeää:**Lukeminen `$D01E`/`$D01F`**tyhjentää rekisterin**. Lue se
> kerran kehystä kohden ja toimi tuloksen perusteella välittömästi komennolla
> `BEQ`/`BNE`.**Tyypillinen käyttö:**```
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

>**Katso myös:**`törmäysdemo` esimerkki — vihreä pallo (sprite #0) vs.
> punainen risti (sprite #1).

---

### LOADFILE

Kuten BASICissa komennot**`LOAD "tiedosto",8`**— lataa tiedoston D64-levyltä
suorituksen aikana käyttämällä KERNAL LOAD -rutiinia. Käytä tätä ladataksesi
tietoja, musiikkia tai muuta koodia levyltä ohjelman ollessa käynnissä.

| Argumentti                    | Kuvaus                                                                                                                                                                                                                |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tiedostonimi                  | Tiedoston nimi levyllä (enintään 16 merkkiä, automaattisesti isot kirjaimet; merkit `,`, `"`, `/`, `\`, `:`, `*`, `?`, `<`, `>`, `|` suodatetaan)                                                                     |
| Laite                         | Laitenumero 8–30 (oletus `8`)                                                                                                                                                                                         |
| Ohitusosoite (valinnainen)    | Heksamuotoinen latausosoite (esim. `C000`). Jos asetettu, tiedosto ladataan tähän osoitteeseen (`sec=0`, jättäen PRG-otsikon huomiotta). Jätä tyhjäksi käyttääksesi tiedoston omaa 2-tavuista PRG-otsikkoa (`sec=1`). |
| Virheen otsikko (valinnainen) | Jos asetettu, JSR LOAD -käskyn jälkeen luodaan `BCS`-käsky. Jos KERNAL palauttaa carry set -arvon (virhe), suoritus hyppää tähän tunnisteeseen.                                                                       |**Syntaksi:**```
.loadfile "DEMO-COLORS", 8
.loadfile "DEMO-COLORS", 8, $C000
.loadfile "DEMO-COLORS", 8, $C000, error_label
```**Generoidun koodin rakenne:**```
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
```**Koko:**`3 + tiedostonimen_pituus + 9 (SETNAM) + 9 (SETLFS) + (4 jos ohitus) +
5 (LOAD) + (2 jos virheen nimi)` tavua. Vähintään 27 tavua.

>**Tärkeää:**Tiedostonimi tallennetaan konekoodiin heti `JMP skip_filename`
> -makromerkinnän jälkeen. Levyllä olevan tiedostonimen on oltava isoja
> PETSCII-kirjaimia – mikä vastaa tavallisia ASCII-isoja kirjaimia (`A`–`Z`).
> Makro valvoo tätä automaattisesti.

>**Käytä aina virhetunnistetta**tuotanto-ohjelmissa — jos tiedostoa ei löydy,
> KERNAL asettaa siirtolipun ja suoritus siirtyy seuraavaan tehtävään.

>**Katso myös:**`loadfile-demo` esimerkki — esittelee `DEMO-COLORS.PRG`
> -tiedoston lataamista D64-tiedostosta BCS-virhehaaran ja visuaalisen
> virhenäytön avulla.

---

### EXODECRUNCH

Ohjelman sisäinen**Exomizer-pakkauksen purku**. Käytä tätä makroa heti
`LOADFILE`-komennon jälkeen, joka latasi Exomizer `mem`-tilassa pakatun virran —
EXODECRUNCH purkaa sen taaksepäin virtaan upotettuun osoitteeseen.

| Argumentti       | Kuvaus                                                                                                              |
| ---------------- | ------------------------------------------------------------------------------------------------------------------- |
| Pakkaajan osoite | Pakkauksenpurkukoodin sijainti muistissa (oletusarvo `B000`). Osoitteen on oltava 16-bittinen heksadesimaaliosoite. |**Syntaksi:**```
.exodecrunch
.exodecrunch depacker=$B000
```**Generoitu koodi (19 tavua):**```
    LDA $AE           ; KERNAL load-end lo (set by previous LOAD)
    STA $04           ; depacker src-end pointer lo
    LDA $AF           ; KERNAL load-end hi
    STA $05           ; depacker src-end pointer hi
    LDA #$36          ; BASIC ROM off ($A000-$BFFF becomes RAM)
    STA $01
    JSR depacker      ; depacker reads back-to-front via $04/$05
    LDA #$37          ; restore default mapping (BASIC + KERNAL + I/O)
    STA $01
```**Toimintaperiaate:**1. KERNAL `LOAD` ($FFD5) päivittää ZP `$AE/$AF` -tiedoston osoittamaan yhden
   tavun viimeksi ladatun tavun ohi. EXODECRUNCH kopioi tämän ZP `$04/$05`
   -tiedostoon, mikä on Exomizerin virallinen taaksepäin lähteen ja pään välinen
   käytäntö.
2. Pakkauksenpurkuohjelma sijoitetaan tyypillisesti kohtaan `$B000` (BASIC ROM
   -muistin määrittämän alueen sisällä). Makro vaihtaa tilaan `$01 = $36`, joten
   suoritin näkee RAM-muistin siellä JSR:n aikana ja palauttaa sitten `$01 =
   $37` -muistin sen jälkeen.
3. Pakkauksen kohdeosoite**koodataan itse pakattuun tietovirtaan**, kun pakkaat
   sen komennolla `exomizer mem -l <load> file,<target>` — purkaja lukee sen
   virran ensimmäisistä tavuista.**Pakkaajan binääritiedosto:**Valmiiksi rakennettu taaksepäin purkaja on
`exo-decrunch.bin` (C64 Visual Assemblerin `samples/`-kansiossa) (477 tavua, ORG
$B000). Se on virallisen `exodecrunch.asm`-tiedoston Kick Assembler -versio,
johon on lisätty `INC $D020` jokaiseen lukukertaan näkyvän reunan
välähdysefektin aikaansaamiseksi purkamisen aikana. Sijoita se ohjelmaasi
käyttämällä `.incbin` -muuttujaa pakkaajan osoitteessa.**Raakalasyöte:**ylimääräinen syöte välitetään Exomizerille raakana tiedostona,
joka ladataan Dst-osoitteeseen (`file@<Dst>`), joten pakkauksen purkaja
kirjoittaa jokaisen tavun ensimmäisestä alkaen täsmälleen kirjoittamaasi
osoitteeseen.

>**Katso myös:**`exo-multicolor-demo` esimerkki — täydellinen esimerkki päästä
> päähän: LATAA pakattu monivärinen bittikartta tiedostomuotoon $C000,
> EXODECRUNCH purkaa sen tiedostomuotoon $2000, kopioi sitten näyttö → $0400 ja
> väri → $D800, ja vaihda VIC-II moniväriseen bittikarttatilaan.

---

### REU_CHECK

Havaitsee, onko Commodore RAM -laajennusyksikkö (REU) kytketty – ikään kuin
tarkistaisi `PEEK($D010)` laitteiston läsnäolon. Testaa kirjoittamalla ja
lukemalla kaksi kuviota REU-rekisteriin `$DF04`.

| Argumentti | Kuvaus        |
| ---------- | ------------- |
| Ei mitään  | Ei operandeja |**Generoitu koodi (34 tavua):**```
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
> Makro normalisoi tuloksen, joten seuraava haara pysyy yksinkertaisena: `BNE`
> tarkoittaa, että REU on läsnä, `BEQ` tarkoittaa, että REU puuttuu.**Syntaksi:**```
.reu_check
```**Tulos lipuissa:**-**Z = 0**(tulos ≠ 0) → REU läsnä → käytä `BNE`
-**Z = 1**(tulos = 0) → ei REU:ta → käytä `BEQ`**Ei argumentteja**— makro luo saman koodin joka kerta.**Tyypillinen käyttö:**```assembly
.reu_check
BEQ no_reu        ; skip if REU not present
; ... REU code here ...
no_reu:
```

---

### REU_STASH / REU_FETCH / REU_SWAP

DMA-lohkonsiirto C64 RAM -muistin ja REU-laajennusmuistin välillä – kuin
erittäin nopea POKE-silmukka, mutta suoritin ei tee mitään (REU-siru kopioi
tiedot suorittimen ollessa pysähdyksissä). 1000 tavun siirto on käytännössä
välitön.

| Makro       | Suunta        | `$DF01`-komento |
| ----------- | ------------- | --------------- |
| `REU_STASH` | C64 RAM → REU | `90 dollaria`   |
| `REU_FETCH` | REU → C64 RAM | `91 dollaria`   |
| `REU_SWAP`  | C64 RAM ↔ REU | `92 dollaria`   |**Argumentit:**| Argumentti | Kuvaus                                           | Esimerkki |
| ---------- | ------------------------------------------------ | --------- |
| C64-osoite | Lähde/kohde C64 RAM -muistissa (heksadesimaali)  | `C000`    |
| REU-osoite | Lähde/kohde REU:ssa (heksa, 16-bittinen)         | `0000`    |
| REU-pankki | REU-muistipankki (0–7)                           | `0`       |
| Pituus     | Siirrettävien tavujen määrä (heksa, 16-bittinen) | `1000`    |**Syntaksi:**```
.reu_stash $C000, $0000, 0, $1000
.reu_fetch $C000, $0000, 0, $1000
.reu_swap $C000, $0000, 0, $1000
```**Generoitu koodi (40 tavua):**```
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

>**Huomautus:**Komennot käyttävät `$90/$91/$92` (bitti 4 asetettu = välitön
> DMA-tila). Kirjoittaminen kansioon `$DF01` aloittaa siirron; suoritin jatkaa
> toimintaansa, kun se on valmis.

---

### TURBO_SET

Asettaa**Ultimate-64 (U64) -prosessorin nopeuden**rekisterin `$D031` kautta.
Ei vaikutusta oikeaan C64:ään tai muihin emulaattoreihin.**Argumentit:**| Argumentti  | Kuvaus                    | Alue                                                |
| ----------- | ------------------------- | --------------------------------------------------- |
| Nopeus      | Suorittimen nopeusindeksi | 0 = 1 MHz … 7 ≈ 10 MHz … 15 ≈ 48 MHz                |
| Huono linja | Badline-emulointi         | Käytössä (C64-yhteensopiva) / Pois käytöstä (turbo) |

Nopeustavu lasketaan seuraavasti: `(speedIndex & 0x0F) | (badline_disabled ?
0x80 : 0x00)`.**Generoitu koodi (5 tavua):**```
A9 xx   LDA #speed_byte
8D 31 D0   STA $D031
```**Syntaksi:**```
.turbo_set 7,0    ; speed=7 (~10 MHz), badline enabled
.turbo_set 15,1   ; speed=15 (~48 MHz), badline disabled
```

>**Huom:**Tämä makro vaikuttaa vain U64-laitteistoon. Oikealla C64:llä tai
> muilla emulaattoreilla tämä kirjoittaa tiedostoon `$D031`, mikä voi vaikuttaa
> CIA:han tai se voidaan jättää huomiotta.

---

### SUPERCPU_DETECT

Tarkistaa, onko**CMD SuperCPU**-kiihdytin asennettu — esimerkiksi
`PEEK($D0B8)`, ja tarkistaa, palauttaako se jonkin muun funktion kuin `$FF`.**Generoitu koodi (5 tavua):**```
AD B8 D0   LDA $D0B8
C9 FF      CMP #$FF
```**Tulos lipuissa:**-**Z = 0**→ SuperCPU läsnä → käytä `BNE`
-**Z = 1**→ SuperCPU:ta ei löydy → käytä `BEQ`**Ei argumentteja.****Syntaksi:**```
.supercpu_detect
```**Tyypillinen käyttö:**```assembly
.supercpu_detect
BEQ no_scpu       ; skip if SuperCPU not present
; ... SuperCPU turbo code here ...
no_scpu:
```

---

### TURBO_ENABLE

Kytkee**CMD SuperCPU turbo -tilan**päälle tai pois päältä. Kutsu ensin
`SUPERCPU_DETECT` ja ohita tämä, jos SuperCPU:ta ei ole.

| Tila            | Rekisteröidy | Vaikutus                                                   |
| --------------- | ------------ | ---------------------------------------------------------- |
| Ota käyttöön    | `$D07A`      | Turbo-ominaisuuden käyttöönotto (jopa 20 MHz SuperCPU:lla) |
| Poista käytöstä | `$D07B`      | Palaa 1 MHz:n yhteensopivuustilaan                         |**Generoitu koodi (5 tavua):**```
A9 00         LDA #$00
8D 7A D0      STA $D07A    ; (or $D07B for disable)
```**Syntaksi:**```
.turbo_enable on
.turbo_enable off
```

>**Huomautus:**Kutsu ensin `SUPERCPU_DETECT`-makroa ja haaraudu tämän makron
> ympärille, jos SuperCPU:ta ei ole.

---

<a id="map_copy"></a>
### MAP_COPY

Kopioi laattakartan lähdeosoitteesta näyttömuistiin (ja valinnaisesti
värimuistiin) käyttämällä sarjaa `LDA abs,X` / `STA abs,X` silmukoita. Yksi
256-tavuinen sivu kopioidaan silmukkaiteraatiota kohden; osittainen sivu lopussa
käyttää `CPX #rem / BNE` pysäyttämiseen. JSR-komentoa ei tarvita — kaikki koodi
luodaan inline-tilassa.

| Argumentti               | Kuvaus                                                                                                                                                                                                                       |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lähdeosoite (näyttö)     | Heksa-osoite, jossa karttatiedot sijaitsevat latauksen jälkeen (esim. `C000`)                                                                                                                                                |
| Näytön RAM-muistin kohde | Minne kopioida näyttökoodit (esim. `0400`)                                                                                                                                                                                   |
| Koko (tavua)             | Kopioitavien tavujen kokonaismäärä — tyypillisesti `$03E8` = 1000 (40 × 25 merkkiä)                                                                                                                                          |
| Värilähde                | `auto`: väridata seuraa näyttökoodeja (`source + size`); tai eksplisiittinen värilähteen osoite. Väridata kopioidaan väri-RAM-kohteeseen toisella kierroksella. Jätä se (ja värikohde) pois kopioidaksesi vain näyttökoodit. |
| Väri-RAM-kohde           | Väritietojen kohde — oletusarvo `D800` (C64-väri-RAM)                                                                                                                                                                        |**Generoitu koodi (1000 tavun kartta, vain näyttö):**```
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
```**Koko:**`2 (LDX) + fullPages×9 + (rem > 0 ? 11 : 0)` tavua osiota kohden.
Yhdistetty tila kaksinkertaistaa sen (näyttöosio + identtisen värin osio).**Yhdistäminen karttaeditorin kanssa:**C64 Visual Assemblerin karttaeditori (**Save map + color RAM**) vie yhden
binääritiedoston, jossa ensimmäiset `size` tavut ovat näyttökoodeja ja seuraavat
`size` tavut ovat väri-RAM-arvoja. Käytä tiedostoa `.map_copy`, jossa on `auto`
värilähteenä ja lähdeosoite, johon tämä tiedosto ladataan (esim. `.incbin`
kohdassa `$C000`):

```
    .incbin "map-color.bin", $C000   ; screen codes $C000–$C3E7, color $C3E8–$C7CF
    ; ...
    .map_copy $C000, $0400, 1000, auto, $D800
```**Syntaksi:**```
.map_copy $C000, $0400, 1000               ; screen only
.map_copy $C000, $0400, 1000, auto, $D800  ; combined (color at src+size)
.map_copy $C000, $0400, 1000, $C3E8, $D800 ; explicit color source address
```

---

<a id="map_copy16x16"></a>
### MAP_COPY16X16

Kopioi 16×16 merkkialueen kompaktista 256-tavuisesta näyttökoodilohkosta sekä
vastaavan 256-tavuisen Color RAM -lohkon. Se on tarkoitettu Charset Canvas
-viennille ja pienille laatta-/kuvalohkoille, joissa kuudentoista erillisen
MAP_COPY-rivin kirjoittaminen olisi kohinaa.**Oletusasettelu:**| Data                     | Oletusosoite                   |
| ------------------------ | ------------------------------ |
| 16×16 näyttökoodit       | Lähdeosoite (`src`)            |
| 16×16 väriarvot          | `lähde + 256`                  |
| Näytön RAM-muistin kohde | `0400 $ + rivi × 40 + sarake ` |
| Väri-RAM-kohde           | `$D800 + rivi×40 + sarake`     |**Syntaksi:**```
.map_copy16x16 $3000, 12, 4
.map_copy16x16 $3000, 12, 4, $0400, $3100, $D800
```

Lyhyt muoto kopioi näyttötavut sarakkeesta `$3000`, väritavut sarakkeesta
`$3100` ja sijoittaa 16×16-lohkon sarakkeeseen 12, riville 4. Kelvolliset
vasemman yläkulman sijainnit ovat `col = 0..24` ja `row = 0..9`, joten koko
16×16-alue jää 40×25 C64 -tekstinäytölle.**Generoitu käyttäytyminen:**- Luo kuusitoista rivikohtaista kopiota.
- Jokainen rivi kopioi 16 näyttötavua ja 16 väritavua.
- JSR:ää ei tarvita; koodi lähetetään suoraan makron sijaintiin.
- Toimii normaalin merkkitilan ja monivärisen merkkitilan kanssa; Color RAM
  -tavut sisältävät kunkin solun merkkivärin/monivärin käyttöönottobitin.

Tyypillinen pariliitos Charset Canvasin kanssa:

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

Siirtää спрайtin animaatiokehystä eteenpäin jokaisella kutsulla ja päivittää
VIC-II спрайtin dataosoittimen. Tallenna yksi tavu kehystä kohden taulukkoon
(спрайtin datasivunumero = `data_address / 64`), osoita SPRITE_ANIM siihen ja
kutsu sitä kerran pelikehystä kohden – JSR:ää ei tarvita.

| Argumentti            | Kuvaus                                                                                               |
| --------------------- | ---------------------------------------------------------------------------------------------------- |
| Sprite #              | Sprite-numero 0–7                                                                                    |
| Kehysluettelon osoite | Kehystaulukon heksaosoite — yksi tavu kehystä kohden, jokainen tavu = sprite-sivu (`data_addr / 64`) |
| Kehysten määrä        | Kehysten kokonaismäärä (1–255)                                                                       |
| Runko ZP              | Kehyslaskurina käytetty nollasivutavu (esim. `FB`)                                                   |**Generoitu koodi (sprite 0, 4 kehystä, ZP `$FB`, lista kohdassa `$C100`):**```
    INC $FB         ; advance frame counter
    LDA $FB
    CMP #$04        ; frame count
    BCC *+6         ; if counter < count, skip reset
    LDA #$00
    STA $FB
    TAX             ; X = current frame index
    LDA $C100,X     ; load sprite data page for this frame
    STA $07F8       ; update sprite 0 pointer ($07F8 + sprite#)
```**Koko:**19 tavua.**Tyypillinen käyttö:**```
frameTable:
    .byte $21, $22, $23, $24   ; 4 frames at $0840, $0880, $08C0, $0900

gameloop:
    .wait_raster $FF
    .sprite_anim 0, $C100, 4, $FB
    JMP gameloop
```**Syntaksi:**```
.sprite_anim spriteNum, frameListAddr, frameCount, zpByte
; example:
.sprite_anim 0, C100, 4, FB
```

>**Vinkki:**Sijoita kehystaulukko, jossa on `.rawbytes`, kiinteään
> osoitteeseen. Laskurin ZP-tavu (`$FB`) on alustettava arvoon `$00` ennen
> ensimmäistä kutsua. Jos koodisi käyttää `$FB` johonkin muuhun, valitse vapaa
> ZP-sijainti.

---

<a id="score_bcd"></a>
### SCORE_BCD

Lisää kiinteän pisteen arvon muistiin tallennettuun monitavuiseen
BCD-pistemäärään ja renderöi sitten jokaisen numeron näyttö-RAM-muistiin
näyttökoodimerkkinä. Käyttää 6502-desimaalitilaa (`SED`/`CLD`) turvalliseen
BCD-aritmetiikkaan – manuaalista kortin vaihtamista ei tarvita.

| Argumentti       | Kuvaus                                                                                                         |
| ---------------- | -------------------------------------------------------------------------------------------------------------- |
| Pisteiden osoite | BCD-pistetavujen heksaosoite (esim. `C200`). Alhaisin tavu ensin.                                              |
| Numerot          | BCD-tavujen määrä (jokainen tavu sisältää kaksi numeroa: `$99` = "99"). `4` tavua = enintään 99999999.         |
| Lisää pisteitä   | Kutsua kohden lisättävä desimaaliarvo (esim. `100`).                                                           |
| Näytön osoite    | Mihin numeronäyttökoodit kirjoitetaan (esim. `0400`). Yksi tavu numeroa kohden (korkeampi tavun numero ensin). |**Syntaksi:**```
.score_bcd $C200, 4, 100, $0400
```**Generoitu koodi (4 tavua, +100 pistettä, pisteet kohdassa `$C200`, näyttö
kohdassa `$0400`):**```
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
```**Koko:**`3 + numerot × 8` tavua (SED + CLC + CLD-lisäkuorma + 8 tavua
BCD-tavua kohden ADC:lle + näyttösilmukalle).**Syntaksi:**```
.score_bcd $C200, 4, 100, $0400
```

>**Vinkki:**Alusta pistetavut muotoon `$00` käynnistyksen yhteydessä.
> Pisteiden osoitteen tulisi olla nollasivu- tai absoluuttisessa RAM-muistissa –
> ei ROM-muistissa. Näyttöosoitteen tulisi osoittaa vasemmanpuoleisimpaan
> numerosoluun; numerot kirjoitetaan vasemmalta oikealle (merkittävin tavu
> ensin).

>**BCD-alue:**`numerot = 4` tavua → 8 desimaalinumeroa → enimmäispistemäärä 99
> 999 999. Jokainen tavu koodaa kaksi BCD-numeroa: `$00`–`$99`.

---

## 7. KickAssembler-tyylinen syntaksi

VMA lukee myös yleisiä KickAssembler-lomakkeita, joten KickAssembler-lähdekoodi
usein rakentuu sellaisenaan:

- `.pc = $1000` ja `*=$1000 "nimi"` asettavat osoitteen (segmentin nimeä ei
  huomioida).
- `.const NIMI = arvo` ja `.label NIMI = arvo` määrittelevät vakiot; `.label
  NIMI = *`, `.label NIMI = * + 1` lisää otsikon nykyiseen osoitteeseen (tai sen
  lähelle).
- `.macro name(p1, p2) { … }` — aaltosulkeissa oleva makrorunko, jota kutsuvat
  `.macro … .endm`; `:name(args)` ja `name(args)`.
- `nimi: { … }` -laajuusalueet: sisällä olevat otsikot ovat paikallisia
  `nimelle` (`nimi.label` ulkopuolelta).
- `@label`-tunnisteet säilyttävät `@`-arvonsa.
- `.teksti "…"` ilman näyttökoordinaatteja tallentaa koodatut tavut, kuten
  `.tavu`. Useita alkioita voidaan yhdistää merkeillä `, ` tai `+`: `"…"`,
  `@"…"` koodinvaihtomerkeillä `\n` `\r` `\t` `\$NN` ja `$NN` / desimaalitavuja.
  `.encoding "nimi"` valitsee seuraavien `.text` -rivien koodauksen:
  `screencode_mixed` (oletus), `screencode_upper`, `petscii_mixed`,
  `petscii_upper`, `ascii`; merkki, jolle koodauksella ei ole koodia, on virhe.
- Muistisääntöliitteet `.abs` / `.a` ja `.zp` / `.z` pakottavat absoluuttisen
  tai nollasivuisen osoituksen: `sta.abs $00FC,x`, `ldx.zp ptr,y`.
- `// …` kommentteja.

Loput KickAssembler-kielestä (`.for`, `.var` / `.eval`, `.function`,
`.pseudocommand`, `#import`, `#if`, `LoadBinary`, segments …) käsittelee C64
Visual Assemblerin Kick-esiprosessori, joka muuntaa KickAssembler-lähdekoodipuun
VMA-tekstiksi.

## 8. Komentorivi

Uutta versiossa 2.1.0: `--crt` / `--crt-name` (kasetti) ja `--d64` / `--add` /
`--disk-name` (levynkuva).

```
vma build <input.asm> [options]
vma --help
vma --version
```

| Vaihtoehto               | Merkitys                                                                                                                                                                                                                                     |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-o TIEDOSTO`            | Kirjoitettava PRG (oletus: syöte, jonka pääte on `.prg`)                                                                                                                                                                                     |
| `--kantahakemisto DIR`   | Missä tiedostot `.incbin` / `.koala` / `.level` / `.sid` / `.include` haetaan ensin (oletus: syötteen kansio)                                                                                                                                |
| `--hae hakemistosta`     | Lisäkansio perushakemiston jälkeen (toistettavissa järjestyksessä); toisella koneella kirjoitettu polku palaa pelkkään tiedostonimeen                                                                                                        |
| `--ei-perus-tynkää`      | Ei `10 SYS…` BASIC-riviä koodin edessä                                                                                                                                                                                                       |
| `--raaka`                | Pelkkä kuva ensimmäisessä ORG:ssaan: ei tynkää, ei siirtoa kohteeseen `$C000`                                                                                                                                                                |
| `--crt-TIEDOSTO`         | Magic Desk -äänirasia (CRT-tyyppi 19, 8 × 8K pankkia, enintään 65 408 tavua): lataaja kopioi ohjelman latausosoitteeseensa ja käynnistää sen SYS-osoitteesta – Visual Assemblerin koonti-CRT:stä. Ilman `-o`-osoitetta PRG:tä ei kirjoiteta. |
| `--crt-nimi NIMI`        | Kasetin nimi CRT-otsikossa (oletus: `VA CART`)                                                                                                                                                                                               |
| `--d64 [TIEDOSTO]`       | Vuoden 1541 levykuva, jossa on PRG ja joka on nimetty PRG:n mukaan (oletustiedosto: PRG, jonka tiedostopääte on `.d64`); c1541:tä ei tarvita. Ilman `-o`:ää PRG:tä ei kirjoiteta.                                                            |
| `--lisää TIEDOSTO`       | Levyllä oleva tiedosto sellaisenaan (PRG latausosoitteella), nimetty tiedoston mukaan (toistettavissa, järjestyksessä)                                                                                                                       |
| `--levyn-nimi NIMI`      | Levyn nimi (oletus: D64:n tiedostonimi; ID `01`)                                                                                                                                                                                             |
| `--symmetrinen TIEDOSTO` | KickAssembler-otsikkotiedosto (`.label NIMI=$xxxx`)                                                                                                                                                                                          |
| `--vs. TIEDOSTO`         | VICE-monitorin nimitiedosto (`al C:xxxx .NAME`; `x64sc -moncommands TIEDOSTO`)                                                                                                                                                               |
| `--dbg-TIEDOSTO`         | RetroDebugger / C64 Debugger -lähdekoodikartta (XML)                                                                                                                                                                                         |
| `--virheenkorjaus`       | Kaikki kolme PRG:n vieressä (`out.sym`, `out.vs`, `out.dbg`)                                                                                                                                                                                 |
| `--json-TIEDOSTO`        | JSON-muodossa oleva koonti: PRG, SYS-osoite, symbolit, asetetut rivit, kirjoitetut segmentit, muistinäkymä — tai jokainen rivillä oleva virhe                                                                                                |
| `--lähdepolun NIMI`      | Pääasiallinen lähde `.dbg` nimille (oletus: syöte)                                                                                                                                                                                           |
| `--viivakartta TIEDOSTO` | JSON-taulukko: syöte rivi → rivi `.dbg` nimet                                                                                                                                                                                                |

Poistumistila: `0` rakennettu, `1` käännösvirhe (`TIEDOSTOA:RIVI: viesti`
vakiovirheen yhteydessä, yksi rivi virhettä kohden), `2` virheellinen käyttö.

```
vma build game.asm -o game.prg --debug
vma build game.asm --no-basic-stub --search ../assets
vma build game.asm --crt game.crt                    # the cartridge only
vma build game.asm --d64 --add music.prg             # game.d64 with GAME and MUSIC
```

## 9. Tunnetut rajoitukset

VMA toistaa C64 Visual Assembler -kääntäjän tavu tavulta, sen karkeat reunat
mukaan lukien:

- `lda.zp c` → `LDA $0C`: `.zp` luetaan heksadesimaalinumeroista koostuva
  symboli numeroksi.
- Parametrittoman makron runko kootaan myös siihen kohtaan, missä se on
  määritelty; määritelmä ennen ensimmäistä `* =` -merkkiä tulee ohjelman alkuun.
- `.text X, Y, "s", 80` jäsentää merkkisiirtymän, mutta ei käytä sitä.
- `.chardef`-tiedoston tavut ovat heksadesimaalimuodossa (`129` = `$129`,
  virhe).
- Suoritusympäristön `.if` / `.while` / `.until` ei-välitön operandi luetaan
  osoitteeksi: `%bin` on virhe ja `10` on heksadesimaali (`$0010`).
- DELAY-apurutiini suoritetaan asettelun viimeisen rivin ja jokaisen dataosan
  jälkeen – jopa ohitetun (`.if 0`) DELAY-rutiinin tapauksessa.

Korjattu versiossa 2.1 (ne antoivat väärää koodia tai epäonnistuivat aiemmin):
`.const` / `.var` operandi nollasivulla, `JMP (otsikko)`, `lda $1234+1`,
makrokutsu makron sisällä, ratkaisematon TURBO_SET / SPRITE_ANIM-arvo (nyt
virhe), otsikot `.data` / `.rawbytes` -tiedostojen tavuissa, `:name` -otsikko,
jonka kohde on otsikko, JOYSTICK / MEMCPY / MEMSET -ohjaimen koko myöhemmästä
otsikosta (nyt virhe), `.data` / automaattinen puskurointi `.rawbytes` ja
include-tiedostot (puuttuva tiedosto on virhe, sisällytetyn tiedoston omat
`.include` / `.incbin` / `.sid` ladataan).
