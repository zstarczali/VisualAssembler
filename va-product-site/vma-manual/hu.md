# VMA – Vizuális makró assembler

**Nyelvi kézikönyv · 2.1.0 verzió**

A VMA a [C64 Visual Assembler](https://github.com/zstarczali/VisualAssembler)
6502 / 6510-es assemblere — az Expert mód nyelve és a blokkprogramjainak
szövege. Ez a kézikönyv a nyelvet ismerteti; a szerkesztő, a blokkpaletta és az
alkalmazás egyéb eszközei a C64 Visual Assembler kézikönyvében találhatók.

## Tartalomjegyzék

1. [Forrásformátum](#1-source-format)
2. [Számok és kifejezések](#2-numbers-and-expressions)
3. [Kimenet: PRG, BASIC stub és belépési
   pont](#3-output-prg-basic-stub-and-entry-point)
4. [Címzési módok](#4-addressing-modes)
5. [6502 utasítások](#5-6502-instructions)
6. [Utasítások és makrók — hivatkozás](#6-directives-and-macros--reference)
7. [KickAssembler-stílusú szintaxis](#7-kickassembler-style-syntax)
8. [Parancssor](#8-command-line)
9. [Ismert korlátok](#9-known-limitations)

---

## 1. Forrásformátum

A VMA forráskód sima szöveg, soronként egy utasítással. A kis- és nagybetűk nem
számítanak a mnemonikoknál és az irányelveknél (`lda`, `LDA`, `.BYTE`, `.byte`);
a címkék nevei megkülönböztetik a kis- és nagybetűket.

```
; egy megjegyzés — so is // egy megjegyzés
* = $1000 ; ORG: assemble from $1000
start: ; egy címke (a kettőspont kötelező)
lda #$06 ; egy utasítás: emlékeztető és operandus
sta $D020
.byte $01, $02, $FF ; egy direktíva ponttal kezdődik
ciklus: dex ; egy címke és egy utasítás egy sorban
bne ciklus
rts
```

- Az **Megjegyzések** `;` vagy `//` karakterekkel kezdődnek, és a sor végéig
  futnak (nem idézőjelek közé tett karakterláncon belül).
- Az **címkék** írásmódja `név:` — betűk, számjegyek és `_`, nem számjeggyel
  kezdődnek. A címke önálló sorban vagy egy utasítás előtt is állhat. A ponttal
  kezdődő név (`.loop:`) egy **lokális címke** (lásd [Local (dotted)
  labels](#local-dotted-labels)); Az `-` és az `+` önmagukban **anonim címkék**,
  amelyekre az `bne -` / `beq +` hivatkozik (a legközelebbi előtte / utána).
- Az **utasítások** egy emlékeztető és egy operandus; a behúzás szabad.
- Az **** direktívák ponttal kezdődnek (`.byte`, `.macro`, `.if` …); az `* =
  $xxxx` (vagy `.pc = $xxxx`) állítja be a címet.
- Az **felhasználói makrók** meghívása a következőképpen történik:
  `:name(args)`, `.invoke name(args)`, `.call name(args)` vagy `name(args)`.

## 2. Számok és kifejezések

| Forma         | Példa          | Érték                                                                               |
| ------------- | -------------- | ----------------------------------------------------------------------------------- |
| Hexadecimális | `$D020`, `$0F` | `$` előtag                                                                          |
| Bináris       | `%00001111`    | `%` előtag                                                                          |
| Decimális     | `255`, `40*25` | nincs előtag                                                                        |
| Karakter      | `'A'`          | a kódja (`$41`)                                                                     |
| Jelenlegi cím | `*`            | a vonal címe (lásd: [Az `*` programszámláló](#the--program-counter-in-expressions)) |

Az utasításoperandusokban a `$` paranccsal hexadecimális számokat írunk. A
könyvtármakrók címargumentumában (`.rawbytes C000, …`, `.sprite_init 0, 1, 80`)
egy-négy számjegyből álló számot olvasunk be hexadecimálisként.

**Operátorok** (operandusokban, `.const`, `.fill`, `.assert`, `.if`): `+ - * /
%`, `& | ^ ~`, `<< >>`, zárójelekben, `<expr` (alacsony bájt) és `>expr` (magas
bájt), és a feltételekben `== != < > <= >=` (igaz = 1, hamis = 0). Az `.fill`,
`.const` és hasonlók a `lo()`, `hi()`, `sin()`, `cos()`, `round()`, `min()`,
`max()`, `abs()` és `PI` függvényeket is ismerik.

```
.const B = 7
lda #(B+1)*2
lda #B & 3 | 8
lda #~B & $FF
ldx #'A'
lda #<screen ; egy címke alsó bájtja
lda #>(*+63) ; egy PC-hez viszonyított cím felső bájtja
```

## 3. Kimenet: PRG, BASIC stub és belépési pont

A VMA egy C64 **PRG** kódot ír: egy kétbájtos betöltési címet, amelyet a
memóriakép követ. Minden ORG szakasz és minden olyan direktíva, amely a saját
címére helyezi az adatokat (`.rawbytes`, `.incbin`, `.sid` …), egyetlen képbe
kerül; a köztük lévő hézagok nullák.

- **ORG nélkül** a program `$0801` helyen kezdődik, ahol a BASIC kezdődik.
- **BASIC SYS stub** (alapértelmezett): egy `10 SYS nnnn` sor kerül a `$0801`
  címre, így a program a `RUN` címmel indul. Egy olyan program, amelynek első
  ORG-ja `$0801`, akkor a `$080D` címen indul. Kapcsolja ki a stubot a
  `--no-basic-stub` paranccsal; enélkül a `$0801` címen található program a
  `$C000` címre áll össze, minden más az első ORG-ján marad.
- **Belépési pont:** a SYS sor a kód elejére, vagy az első soros megjegyzésben
  megadott címre ugrik `; Belépési pont: $1234`.
- **A BASIC sor alatti kód** (egy ORG, amely alacsonyabb, mint `$0801`, a
  csonkkal együtt): egy kis betöltő elindítja a programot és a helyére helyezi,
  így továbbra is `RUN`-szel kezdődik.
- Egy olyan forrás, amely saját BASIC SYS sorral kezdődik (`.byte $0B, $08, $0A,
  $00, $9E, …` a `$0801` címen), eredeti állapotában kerül kibocsátásra, második
  csonk nélkül.

A PRG-ből a parancssor létrehoz egy **patront** és egy **lemezképet** is
(újdonság a 2.1.0 verzióban, lásd [8. Parancssor](#8-command-line)):

- `--crt FÁJL` — egy Magic Desk hangszedő (CRT 19-es típus, 8 × 8K bank,
  legfeljebb 65 408 bájt program). A 0. bankban lévő betöltő inicializálja a
  KERNAL-t, lefuttat egy másolási rutint a RAM-ból a `$0100–$013B` címen, amely
  a programot a betöltési címére mozgatja (bankokat váltva a `$DE00` címen
  keresztül), kikapcsolja a hangszedőt és a belépési pontra ugrik. Tartsa a
  programot távol az `$0100–$013B` címektől és a betöltő által használt
  `$02–$04` / `$FB–$FE` nulla oldalbájtoktól.
- `--d64 [FÁJL]` — egy 1541-es lemezkép (35 sáv), amelyről a PRG-t nevezték el,
  valamint az `--add` fájlok, úgy elrendezve, ahogyan a 1541-es DOS írta őket;
  nincs szükség c1541-re.

---

## 4. Címzési módok

Minden 6502-es utasítás egy vagy több címzési módot támogat. A VMA az operandus
felírási módja alapján választja ki a módot.

| Mód             | Címke          | Példa               | Leírás                                                                         |
| --------------- | -------------- | ------------------- | ------------------------------------------------------------------------------ |
| **implicitált** | Hallgatólagos  | `NEM `              | Nincs operandus; az utasítás önálló                                            |
| **azonnali**    | Azonnali       | `LDA #$FF`          | Beágyazott állandó; az assembler automatikusan hozzáadja az `#` értékeket      |
| **nullaOldal**  | Nulla oldal    | `LDA $10`           | Egybájtos cím a nulladik oldalon (0–255)                                       |
| **nullaOldalX** | Nulla oldal, X | `LDA $10,X`         | Nulla oldalcím + X regiszter eltolás (az eredmény a 0. oldalon tördelődik)     |
| **nullaOldalY** | Nulla oldal, Y | `LDX $FB,Y`         | Nulla oldalcím + Y regiszter eltolás                                           |
| **abszolút**    | Abszolút       | `LDA $0400`         | Teljes 16 bites memóriacím                                                     |
| **abszolútX**   | Abszolút,X     | `LDA $0400,X`       | 16 bites cím + X regiszter eltolás                                             |
| **abszolútY**   | Abszolút,Y     | `LDA $0400,Y`       | 16 bites cím + Y regiszter eltolás                                             |
| **relatív**     | Rokon/Címke    | `BNE hurok`         | Fióktelepre vonatkozó utasításokhoz adjon meg egy címkenevet vagy egy célcímet |
| **indirectX**   | Közvetett, X   | `LDA ($FB,X)`       | Nulla oldal indexelése közvetett módon (operandus = nulla oldal címe, 1 bájt)  |
| **indirektY**   | Közvetett, Y   | `LDA ($FB),Y`       | Nulla oldalas indirekt indexelés (operandus = nulla oldalcím, 1 bájt)          |
| **közvetett**   | Közvetett      | `JMP (0100 dollár)` | Közvetett; csak JMP-vel használható                                            |

### Konstansok a nulladik oldalon

Egy csak konstansokból álló operandus (`.const`, `name = value`, a `.var`),
amely elfér egy bájtban, az utasítás **zero-page** módját veszi fel, pontosan
úgy, ahogy a szám tenné: miután az `.const zp = $FB`, az `lda zp` `A5 FB`-be (2
bájt, 3 ciklus) és az `lda zp,x` `B5 FB`-be áll össze. Az az üzemmód, amelynek
nincs nulla oldalas alakja az utasításnak, abszolút marad (`lda zp,y` → `B9 FB
00`). Egy címke nincs szűkítve – a címe csak az elrendezés után ismert – és az
`lda.abs zp` kényszeríti az abszolút módot. Egy szám megtartja azt a
szélességet, amellyel írva van: `$FB` nulla oldal, `$00FB` abszolút. *(Újdonság
a 2.1-ben.)*

### Kifejezések operandusként való címkézése

Bármely operandus, amely címet vagy azonnali értéket fogad el, közvetlenül
elfogad egy **névű** konstanst (egy `.const`-et vagy egy címkét). Ezenkívül
használhatod a **label+offset** vagy az **label−offset** kifejezéseket egy
elnevezett konstanshoz viszonyított címre való hivatkozáshoz:

| Szintaxis         | Példa                             | Leírás                                                                                                             |
| ----------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `címke`           | `STA képernyő_RAM,X`              | Feloldódik a címke/állandó értékére                                                                                |
| `címke+$hex`      | `STA képernyő_RAM+$0100,X`        | Címkecím plusz egy hexadecimális eltolás                                                                           |
| `címke+decimális` | `STA képernyő_RAM+256,X`          | Címkecím plusz egy tizedes eltolás                                                                                 |
| `címke-$hex`      | `LDA asztal - 10 dollár`          | Címkecím hexadecimális eltolás nélkül                                                                              |
| `$hex+kifejezés`  | `LDA $1234+1`, `STA $0400+40*2,X` | Számok, címkék és konstansok bármilyen kifejezése *(2.1)*                                                          |
| `(címke)`         | `JMP (vektor)`, `JMP (tábla+2)`   | Közvetett ugrás címkén vagy kifejezésen keresztül *(2.1)*                                                          |
| `#<címke`         | `LDA #<képernyő_RAM`              | A címke címének alsó bájtja                                                                                        |
| `#>címke`      | `LDA #>képernyő_RAM`           | A címke címének felső bájtja                                                                                       |
| `*`               | `BNE *`                           | Aktuális programszámláló (az utasítás saját címe); az `*` elágazások végtelen önhurkot generálnak (eltolás: `$FE`) |

**Példa — két képernyőoldal törlése CONST használatával:**
```
; .CONST képernyő_ram = $0400
LDX #$00
törlés:
STA képernyő_ram,X
STA képernyő_ram+$0100,X
DEX
BNE törlés
```

### Az `*` programszámláló kifejezésekben

Az `*` már nem korlátozódik a teljes operandusra – megjelenhet **bárhol egy **
operanduskifejezésen belül, és annak az utasításnak a címét jelöli, amelyre
írták. Assembly időben feloldódik az utasítás valódi címe alapján, így nincs
szükség címkére a rövid relatív ugrásokhoz vagy a PC-relatív adatolvasásokhoz.

| Szintaxis           | Példa                      | Jelentés                                            |
| ------------------- | -------------------------- | --------------------------------------------------- |
| `*`                 | `BNE *`                    | Elágazás önmagához (végtelen ciklus, eltolás `$FE`) |
| `*-n` / `*+n`       | `BNE *-5`, `BEQ *+4`       | Elágazás az aktuális PC-hez képest *n* bájttal      |
| `JMP *+n`           | `JMP *+20`                 | Az aktuális PC-ből számított abszolút ugrás         |
| `#<*` / `#>*` | `LDA #<*`, `LDA #>*` | Az aktuális PC alacsony/magas bájtja                |
| `#>(*+n)`        | `LDA #>(*+63)`          | PC-hez viszonyított cím alsó/felső bájtja           |

**PC vs. szorzás.** Az `*` csak akkor kezeli a programszámlálót, ha az
*értékpozícióban* található — a kifejezés elején, vagy közvetlenül egy operátor,
`(`, `,`, `<`, `>` vagy szóköz után. Egy `*`, amely egy számot, `)` vagy
egy azonosítót követ, közönséges szorzásnak minősül, tehát az `LDA table*2` és a
`CONST_A*4` változatlanok maradnak.

**Hol működik.** Bármely operandus, amely már elfogad egy kifejezést: elágazási
célpontok, `JMP` / `JSR`, `LDA`/`STA`/… abszolút és indexelt, azonnali
alacsony/magas bájtos operátorok, és az `.assert` kifejezés. Az `*` soha nem
változtatja meg egy utasítás méretét, így minden címzési módban biztonságos.

### Helyi (pontozott) címkék

Egy ponttal kezdődő címke — `.loop`, `.skip`, `.done` — egy **lokális címke**. A
legközelebbi megelőző **global** (nem pontozott) címke hatókörébe tartozik, és
belsőleg `<global>.<name>` lesz. Két azonos rövid nevű, különböző globális
címkék alatti lokális címke nem ütközik **not**.

```
DrawSprite:
LDX #0
.loop: ; == DrawSprite.loop
LDA SpriteData,X
STA $2000,X
INX
CPX #63
BNE .loop ; a DrawSprite-on belül feloldódik
RTS

ClearScreen:
LDX #0
.loop: ; == ClearScreen.loop — nincs ütközés
STA $0400,X
INX
BNE .loop
RTS
```

- Egy hatókörön belül a következőképpen hivatkozz egy helyi címkére: `.name`.
- Egy másik hatókörből explicit módon hivatkozz rá `Global.name` néven (pl. `JMP
  ClearScreen.loop`).
- Egy globális címke elé írt `.name` továbbra is egy egyszerű legfelső szintű
  `.name` marad.

### Önmódosító kód operandus címkéi

Ha egy utasítás operandusát az `label:` címke elé helyezzük, akkor a címke az
**operandus bájtjánál, az ** bájtnál, és nem az opkódnál lesz. Az utasítás a
kettőspont utáni részből áll össze.

```
beállítás:
LDA érték:#$00 ; 'érték' -> a #$00 operandus bájt címe
...
javítás:
LDA #új
STA érték ; közvetlenül írja az operandus bájtot — klasszikus SMC
```

Az `value` az `<utasításcím> + 1` (az első operandus bájt) értékre mutat, minden
címzési mód esetén. Ez felváltja a régebbi `STA utasítás+1` / ` utasítást: LDA
#$00` minta.

---

## 5. 6502 utasítások

### Adatmozgás

| Emlékezeterősítő | Leírás                  | Módok                                                                         |
| ---------------- | ----------------------- | ----------------------------------------------------------------------------- |
| `LDA`            | Töltésakkumulátor       | azonnali, nulla oldal, abszolút, abszolútX, abszolútY, közvetettX, közvetettY |
| `LDX`            | X regiszter betöltése   | azonnali, nulla oldal, nulla oldalY, abszolút, abszolútY                      |
| `LDY`            | Y regiszter betöltése   | azonnali, nulla oldal, abszolút, abszolútX                                    |
| `STA`            | Tároló akkumulátor      | zeroPage, abszolút, abszolútX, abszolútY, közvetettX, közvetettY              |
| `STX`            | X pénztárgép üzlet      | nulla oldal, nulla oldalY, abszolút                                           |
| `STY`            | Y pénztárgép tárolására | nulla oldal, abszolút                                                         |

### Számtani

| Emlékezeterősítő | Leírás                    | Megjegyzések                                                                    |
| ---------------- | ------------------------- | ------------------------------------------------------------------------------- |
| `ADC`            | Hozzáadás átvitellel      | A legtöbb esetben használat előtt állítsa be a hordozást az `SEC` paraméterrel. |
| `SBC`            | Kivonás átvitellel        | Kivonás előtt állítsa be az átvitelt `SEC`-cel                                  |
| `INC`            | Memória növelése          | —                                                                               |
| `DEC`            | Memória csökkentése       | —                                                                               |
| `CMP`            | Hasonlítsa össze az A-val | Jelzőket állít be; nem módosítja az A-t                                         |
| `CPX`            | Hasonlítsa össze X-szel   | —                                                                               |
| `CPY`            | Hasonlítsa össze Y-nal    | —                                                                               |

### Logika

| Emlékezeterősítő | Leírás                                                                         |
| ---------------- | ------------------------------------------------------------------------------ |
| `ÉS`             | Logikai ÉS akkumulátorral                                                      |
| `ORA`            | Logikai VAGY akkumulátorral                                                    |
| `EOR`            | Exkluzív VAGY akkumulátorral                                                   |
| `BIT`            | A memória bitjeinek tesztelése A-val szemben (beállítja az N, V és Z jelzőket) |

### Ugrások és ágak

| Emlékezeterősítő | Leírás                                                             |
| ---------------- | ------------------------------------------------------------------ |
| `JMP`            | Feltétel nélküli ugrás (abszolút vagy közvetett)                   |
| `JSR`            | Ugrás az alprogramhoz (a visszatérési címet a veremtárolóba menti) |
| `RTS`            | Visszatérés az alprogramból                                        |
| `RTI`            | Visszatérés megszakításból                                         |
| `BNE`            | Elágazás, ha nem egyenlő (Z=0)                                     |
| `BEQ`            | Elágazás, ha egyenlő (Z=1)                                         |
| `BCC`            | Elágazás, ha átvitel mentes (C=0)                                  |
| `BCS`            | Elágazás, ha átviteli halmaz (C=1)                                 |
| `BMI`            | Elágazás, ha mínusz (N=1)                                          |
| `BPL`            | Elágazás, ha plusz (N=0)                                           |
| `BVC`            | Elágazás túlcsordulás esetén ürítve (V=0)                          |
| `BVS`            | Elágazás túlcsordulás esetén (V=1)                                 |

#### LBNE / LBEQ / … (Hosszú ágak)

Nyolc pszeudo-opció feltételes elágazáshoz hasonlóan viselkedik, de eléri az
**bármely címet**, nem csak a −128…+127 címet. Mindegyik egy invertált ágba áll
össze, amely kihagy egy 3 bájtos `JMP` címet — mindig **5 bájtot**:

```
LBEQ kész; összeállítás: BNE *+3 ($D0 $03)
; JMP kész ($4C lo hi)
```

| Hosszú op | Állapot                     | Kibocsátva mint          |
| --------- | --------------------------- | ------------------------ |
| `LBNE`    | nem egyenlő (Z=0)           | `BEQ *+3 / JMP cél`      |
| `LBEQ`    | egyenlő (Z=1)               | `BNE *+3 / JMP célpont`  |
| `LBCC`    | tiszta átvitel (C=0)        | `BCS *+3 / JMP célpont`  |
| `LBCS`    | hordozókészlet (C=1)        | `BCC *+3 / JMP cél`      |
| `LBMI`    | mínusz (N=1)                | `BPL *+3 / JMP célpont`  |
| `LBPL`    | plusz (N=0)                 | `BMI *+3 / JMP célérték` |
| `LBVC`    | túlcsordulásmentes (V=0)    | `BVS *+3 / JMP célpont`  |
| `LBVS`    | túlcsordulási készlet (V=1) | `BVC *+3 / JMP célpont`  |

- Operandus: egy címke, egy `*`-kifejezés, vagy egy literál cím – ugyanaz, mint
  egy normál ágcélpontnál.
- Költség: 5 bájt és 1 extra ciklus a megtett útvonalon egy rövid ághoz képest.
  Rövid ágak esetén nincs automatikus előléptetés – explicit módon kell
  kiválasztani az `LBxx` ágat.
- Amikor egy sima ág (`BNE`, `BEQ`, …) kívül esik a tartományon, a fordítási
  hiba mostantól megnevezi a pontos túllépést, és javaslatot tesz az egyező
  `LBxx`-re.

### Regiszterműveletek

| Emlékezeterősítő | Leírás                    |
| ---------------- | ------------------------- |
| `ADÓ`            | A → X átvitel             |
| `TAY`            | Átvitel A → Y             |
| `TXA`            | X → A átvitel             |
| `TYA`            | Y → A átvitel             |
| `TSX`            | Átviteli verem mutató → X |
| `TXS`            | X átvitel → Veremmutató   |
| `INX`            | X lépésköz                |
| `DEX`            | Csökkentés X              |
| `INY`            | Y irányú növekmény        |
| `DEY`            | Y csökkentése             |

### Eltolás és forgatás

| Emlékezeterősítő    | Leírás                            |
| ------------------- | --------------------------------- |
| `Amerikai jelnyelv` | Számtani eltolás balra            |
| `LSR`               | Logikai eltolás jobbra            |
| `ROL`               | Balra forgatás átvitellel         |
| `ROR`               | Jobbra forgatás Carry-n keresztül |

### Stack

| Emlékezeterősítő | Leírás                                      |
| ---------------- | ------------------------------------------- |
| `PHA`            | Nyomja az akkumulátort a halomra            |
| `PHP`            | Processzor állapotának feltöltése a veremre |
| `PLA`            | Húzza ki az akkumulátort a veremből         |
| `PLP`            | Processzor állapotának lekérése a veremből  |

### Rendszer / Jelzők

| Emlékezeterősítő | Leírás                                       |
| ---------------- | -------------------------------------------- |
| `CLC`            | Tiszta hordozózászló                         |
| `CLD`            | Tiszta decimális mód                         |
| `CLI`            | Megszakítás letiltásának törlése             |
| `CLV`            | Túlcsordulás jelző törlése                   |
| `SEC`            | Carry zászló beállítása                      |
| `SED`            | Decimális mód beállítása                     |
| `SEI`            | Megszakítás letiltásának beállítása          |
| `NEM `           | Nincs művelet                                |
| `BRK`            | Kényszermegszakítás / szoftveres megszakítás |

### Illegális / Nem dokumentált utasítások

Ezek haladó használatra készültek. Óvatosan használja – a viselkedés chipenként
eltérő lehet.

`LAX`, `SAX`, `DCP`, `ISC`, `SLO`, `RLA`, `SRE`, `RRA`, `ANC`, `ALR`, `ARR`,
`AXS`, és az `NOP` formák, amelyek operandust olvasnak be: `NOP #$nn` ($80),
`NOP $nn` ($04), `NOP $nn,X` (14 USD), `NOP $nnnn` (0C USD), `NOP $nnnn,X` (1C
USD)

---

## 6. Irányelvek és makrók – hivatkozás

Az assembler működését direktívák vezérlik (címkék, adatok, eredet, feltételek,
felhasználói makrók); a könyvtári makrók pedig egyetlen sorban végzik el a
C64-ben megszokott feladatokat – ahelyett, hogy kézzel írnánk 10-20 utasítást,
egyetlen sort írunk, és az assembler generálja a kódot. Gondoljunk rájuk úgy,
mint beépített alprogramokra.

---

### CÍMKE

Mint egy ** sorszám a BASIC**-ben — de névvel a szám helyett. Ugrási célpontok a
`JMP`, `JSR`, `BNE` stb. fájlokhoz.

| Érv        | Leírás                                                    |
| ---------- | --------------------------------------------------------- |
| Címke neve | Az `JMP`, `JSR`, `BNE` stb. fájlokban használt azonosító. |

**Szintaxis:**
```
hurok:
```

**Generált kód:**
```
hurok: ; $0820
```

Az aktuális cím megjegyzésként jelenik meg. A címkék mérete **0 bájt **.

---

### MEGJEGYZÉS

Mint a BASIC**-ben szereplő **REM — egy megjegyzés magadnak, amit az assembler
teljesen figyelmen kívül hagy.

**Szintaxis:**
```
; A hozzászólásod szövege ide
```

**Generált kód:**
```
; A hozzászólásod szövege ide
```

---

### BYTE

Mint az **DATA a BASIC**-ben — nyers bájtértékek listáját tárolja a programban.

| Érv       | Leírás                                                                    |
| --------- | ------------------------------------------------------------------------- |
| Operandus | Vesszővel elválasztott bájtértékek (pl. `$01, $02, $FF` vagy `1, 2, 255`) |

**Szintaxis:**
```
.byte $01, $02, $FF
```

**Generált kód:**
```
.byte $01, $02, $FF
```

**Lo/hi byte címke hivatkozások:** A BYTE elfogadja a KickAssembler / ca65
stílusú `<label` (alacsony bájt) és `>label` (magas bájt) tokeneket a numerikus
értékek mellett. Az assembler fordítási időben feloldja a címke címét, és
beszúrja a megfelelő bájtot. Példa:

```
.byte <képkocka_0, >képkocka_0, <képkocka_1, >képkocka_1
```

Ez a(z) `frame_0` címének alsó bájtját tárolja, majd a felső bájtot, végül pedig
ugyanezt a(z) `frame_1` címét. Hasznos ugrótáblák és címlisták létrehozásához.

**Méret:** A listában lévő bájtok száma.

---

### SZÓ

Mint a BASIC **DATA függvénye, de 16 bites számokhoz **. Minden érték két
bájtként tárolódik (először az alacsony bájt, majd a magasabb – 6502 kis-endián
sorrend).

| Érv       | Leírás                                                       |
| --------- | ------------------------------------------------------------ |
| Operandus | Vesszővel elválasztott 16 bites értékek (pl. `$0400, $C000`) |

**Szintaxis:**
```
.szó $0400, $C000
```

**Generált kód:**
```
.szó $0400, $C000
```

**Méret:** 2 bájt szavanként.

---

### KITÖLTÉS

Mint például a `FOR I=1 TO N : POKE addr+I, val : NEXT` — egy memóriablokkot
tölt ki ugyanazzal a bájttal, egyetlen sorban. Nagyszerű területek törlésére
vagy táblázatok előzetes feltöltésére.

| Érv       | Leírás                                                  |
| --------- | ------------------------------------------------------- |
| Operandus | `count,value` — pl. `256,0` 256 bájtot nullával tölt ki |

**Szintaxis:**
```
.fill 256, $00
```

**Generált kód:**
```
.fill 256, $00
```

**Kifejezés szintaxisa:** Mind a `count`, mind az `value` elfogad aritmetikai
kifejezéseket. Hivatkozhatsz CONST nevekre, használhatsz hex/bináris
literálokat, és meghívhatsz beépített matematikai függvényeket:

| Kifejezés                   | Jelentés                               |
| --------------------------- | -------------------------------------- |
| `CSEMPE_SZÁMA, $00`         | számlálás CONST-ból, hex literál érték |
| `40*25, 0`                  | soron belüli szorzás                   |
| `round(sin(PI/4)*255), $80` | trigonometria                          |

**Beépített függvények:** `sin()`, `cos()`, `round()`, `max(a,b)`, `min(a,b)`,
`abs()`, konstans `PI`

Operátorok: `+ - * /` Literálok: `$FF` (hex), `%10110000` (bináris)
Alacsony/magas bájt: `lo(kifejezés)`, `hi(kifejezés)`

**Méret:** A számláló értéke bájtban.

---

### IGAZÍTÁS

Nullákkal kiegészített bájtok beszúrásával az aktuális címet előrecsúsztatja a
következő tiszta határra. A C64 megköveteli, hogy a sprite adatok 64 bájtos
határon kezdődjenek — az `ALIGN 64` ezt automatikusan kezeli.

| Érv   | Leírás                                                                     |
| ----- | -------------------------------------------------------------------------- |
| Határ | Igazítási érték — pl. `64` (sprite határ), `256` (oldal), `$2000` (bitkép) |

**Szintaxis:**
```
.align 64
.align 2000 dollár
```

**Generált kód:**
```
; ALIGN 64 → $0840 (12 bájtos kitöltés)
```

**Méret:** Dinamikus — az aktuális programszámláló pozíciójától függ.

> **Tipp:** Használj `ALIGN 64` igazítást sprite adatok előtt, `ALIGN 256`
> igazítást az oldalhoz igazított táblázatok biztosításához.

---

### SZÖVEG

A **PRINT AT** parancshoz hasonlóan — közvetlenül a C64 képernyőjére írja a
szöveget egy adott oszlopba és sorba, a KERNAL használata nélkül. Karakterenként
egy LDA/STA párt generál, a képernyő RAM-ját a `$0400` tárolóhelyre célozva.

| Érv                | Leírás                                                          |
| ------------------ | --------------------------------------------------------------- |
| Szöveg             | A megjelenítendő karakterlánc                                   |
| X                  | Oszlop (0–39)                                                   |
| Y                  | Sor (0–24)                                                      |
| Címke (opcionális) | Hozzárendel egy címkét, amely a kiszámított képernyőcímre mutat |
| `alsó`             | Opcionális jelző – lásd alább                                   |

**Karakterkészlet módok:**

A C64 két karakterkészlettel rendelkezik, amelyek futásidőben választhatók ki:

| Mód                                      | $D018 1. bit | Nagybetűs bevitel                 | Kisbetűs bevitel               |
| ---------------------------------------- | ------------ | --------------------------------- | ------------------------------ |
| **Nagybetűs/grafikus** (alapértelmezett) | 0            | `A`–`Z` → képernyőkódok $01–$1A ✓ | nagybetűként kezelve is        |
| **Kisbetű/nagybetű** (CHARSET után)      | 1            | `A`–`Z` → $01–$1A (nagybetűs)     | `a`–`z` → $41–$5A (kisbetűs) ✓ |

- **Nagybetűs karakterkészlet (alapértelmezett):** Írja be, amit nagybetűvel
  szeretne látni. A `"HELLO"` így jelenik meg: `HELLO`. A kisbetűs bevitel
  nagybetűs képernyőkódokhoz van rendelve.
- **Kisbetűs karakterkészlet (`lower`):** Írd be a kívánt kisbetűs/nagybetűs
  karakterkészletet. `"hello"` → kisbetűs megjelenítés, `"HELLO"` → nagybetűs
  megjelenítés. Futásidejű karakterkészlet-váltást igényel a képernyőre írás
  előtt (használd a **CHARSET lower** makrót).

**Generált kód (nagybetűs mód, `"SZIA"`):**
```
LDA #$08 ; 'H' képernyőkód $08
STA $0400
LDA #$05 ; 'E' képernyőkód $05
STA $0401
...
```

**Szintaxis:**
```
.text 0, 2, "HELLO" ; nagybetűs karakterkészlet (alapértelmezett)
.text 0, 2, "hello", alsó ; kisbetűs karakterkészlet
```

A karakterek **képernyőkódként** vannak kódolva (nem PETSCII). **Méret:**
`szöveghossz × 5` bájt (LDA + STA karakterenként).

---

### HÚR

Mint például egy ** karakterlánc beszúrása ** bármely memóriacímre futásidőben.
LDA/STA párokat generál, amelyek minden karakter képernyőkódját egymást követő
címekre másolják.

| Érv                | Leírás                                                                               |
| ------------------ | ------------------------------------------------------------------------------------ |
| Szöveg             | A kiírandó karakterlánc                                                              |
| Cím                | Cél memóriacím — `$C000` hex vagy egy **címkenév**                                   |
| Címke (opcionális) | Hozzárendel egy címkét, amely a célcímre mutat                                       |
| Váltás             | Hex érték (00–FF) hozzáadva minden képernyőkód bájthoz (pl. `$80` = fordított videó) |
| `alsó`             | Opcionális jelző – ugyanaz a szemantika, mint a TEXT-nél (lásd a TEXT részt)         |

**Szintaxis:**
```
.string $C000, "HELLO" ; nagybetűs karakterkészlet (alapértelmezett)
.string $C000, "hello", alsó ; kisbetűs karakterkészlet
.string $C000, "HELLO", 80 ; eltolásos (fordított videó)
.string $C000, "hello", 80, alsó ; shift + kisbetűs
.string $C000, "HELLO" :my_string ; makrócímkével
```

**Generált kód:**
```
LDA #$08 ; 'H' képernyőkód
STA $C000
LDA #$05 ; 'E' képernyőkód
STA $C001
...
```

A karaktereket **képernyőkódként** kódoljuk (nem PETSCII). Az opcionális
**Shift** érték minden bájthoz hozzáadódik, pl. `$80` fordított videó esetén.
**Méret:** `text.length × 5` bájt (karakterenként egy LDA + egy STA).

---

### ADAT

Mint egy **POKE ciklus** — futásidőben egy nyers bájtok listáját írja ki egy
memóriacímre, bájtonként egy LDA/STA párt.

| Érv                | Leírás                                             |
| ------------------ | -------------------------------------------------- |
| Bájtok             | Vesszővel elválasztott bájtértékek                 |
| Cím                | Cél memóriacím — `$C000` hex vagy egy **címkenév** |
| Címke (opcionális) | Hozzárendel egy címkét, amely a célcímre mutat     |

**Szintaxis:**
```
.data $C000, $01, $02, $03 ; hex cím
.data my_buf, $01, $02, $03 ; címke cím
.data $C000, $01, $02, $03 :mydata ; makrócímkével
```

**Generált kód:**
```
LDA #$01
    STA $C000
    LDA #$02
    STA $C001
    ...
```

**Méret:** `bájt_szám × 5` bájt (egy LDA + egy STA bájtonként).

> **2.1:** a bájtok címkéket nevezhetnek el: `.data $2010, <cél, >cél` kiírja az
> `cél` címét, amely egy később definiált címke is. A makró `:név` címkéje
> mutathat egy olyan célcímre, amely maga is egy címke.

---

### RAWBYTES

Mint az **DATA, ami közvetlenül a memóriába töltődik** – egyáltalán nincs
futásidejű kód. A bájtok a PRG betöltésének pillanatától kezdve jelen vannak,
még mielőtt a kódod elindulna. Használd ezt sprite adatokhoz, szinttérképekhez,
keresőtáblákhoz, bármihez, aminek csak egy adott címen kell lennie.

| Érv                | Leírás                                             |
| ------------------ | -------------------------------------------------- |
| Bájtok             | Vesszővel elválasztott bájtértékek                 |
| Cím                | Cél memóriacím — `$C000` hex vagy egy **címkenév** |
| Címke (opcionális) | Hozzárendel egy címkét, amely a célcímre mutat     |

**Szintaxis:**
```
.rawbytes $C000, $00, $00, $00 ; hex cím
.rawbytes sprite_data, $00, $00 ; címke cím
.rawbytes $0C50, $00, $00 :nev ; macroLabel-lel — más kód használhatja az LDA nev,X-et
```

**Méret a kódban:** 0 bájt. Az adat a kimenetben megadott címre kerül.

> **DATA vs RAWBYTES:** A DATA LDA/STA kódot generál, amely futásidőben másolja
> a bájtokat (lassabb, de működik, ha az adatoknak dinamikusnak kell lenniük). A
> RAWBYTES közvetlenül elhelyezi a bájtokat – nincs kód, azonnal, nulla
> költséggel.

> **2.1:** a bájtok címkéket adhatnak meg (`.rawbytes $2000, <cél, >target` —
> egy mutatótábla); az `:name` címke egy címkére, mint célcímre mutathat,
> amelyet szintén később definiálunk. Makró puffer argumentumaként a bájtok a
> program utáni pufferekben foglalják el a saját helyüket.

---

### NYERS SZÖVEG

Mint a RAWBYTES, de szöveg esetén — képernyőkódként kódolja a karakterláncot, és
a bájtokat egy fix címre helyezi **futásidejű kód nélkül **. A szöveg a PRG
betöltése után azonnal készen áll a memóriában.

| Érv                | Leírás                                                                               |
| ------------------ | ------------------------------------------------------------------------------------ |
| Szöveg             | Kódolandó karakterlánc                                                               |
| Cím                | Cél memóriacím — `$C000` hex vagy egy **címkenév**                                   |
| Címke (opcionális) | Hozzárendel egy címkét, amely a célcímre mutat                                       |
| Váltás             | Hex érték (00–FF) hozzáadva minden képernyőkód bájthoz (pl. `$80` = fordított videó) |
| `alsó`             | Opcionális jelző – ugyanaz a szemantika, mint a TEXT-nél (lásd a TEXT részt)         |

**Szintaxis:**
```
.rawtext $C000, "HELLO" ; nagybetűs karakterkészlet (alapértelmezett)
.rawtext $C000, "hello", alsó ; kisbetűs karakterkészlet
.rawtext $C000, "HELLO", 80 ; eltolásos karakterkészlet (fordított videó)
.rawtext $C000, "hello", 80, alsó ; shift + kisbetűs karakterkészlet
.rawtext $0400, "HELLO" :my_text ; makrócímkével
```

**Generált kód:**
```
; .rawtext "HELLO" -> $C000
; $C000
.byte $08, $05, $0C, $0C, $0F ; H E L L O (nagybetűs képernyőkódok)

; .rawtext "hello", alsó -> $C000
; $C000
.byte $48, $45, $4C, $4C, $4F ; h e l l o (kisbetűs képernyőkódok $41–$5A tartományban)
```

**Méret a kódban:** 0 bájt. Az adat a kimenetben megadott címre kerül.

> **STRING vs RAWTEXT:** A STRING LDA/STA kódot generál, amely futásidőben
> másolja a szöveget. A RAWTEXT betöltéskor beépíti a bájtokat a PRG-be – nincs
> kód, nincs várakozás.

---

### PETSCII

Mint az **RAWBYTES, de a KERNAL kimenet esetében ** — PETSCII bájtként kódolja a
karakterláncot (kompatibilis a CHROUT-tal a `$FFD2` címen), és fix címre helyezi
őket futásidejű kód nélkül. Ezt akkor használjuk, ha karaktereket szeretnénk
kinyomtatni a `JSR $FFD2` címen keresztül egy ciklusban, és vegyük figyelembe,
hogy az `.print` ugyanazt a kódolót és az `lower` flaget használja.

> **PETSCII vs. képernyőkódok:** A PETSCII és a képernyőkódok két különböző
> kódolás. A képernyőkód: `$01` = A betű; a PETSCII `$41` = A betű (CHROUT-on
> keresztül). A PETSCII-t csak KERNAL-on keresztüli nyomtatáskor használd; a
> képernyő RAM-jába való közvetlen íráshoz használd a TEXT/STRING/RAWTEXT
> kódolást.

| Érv                | Leírás                                             |
| ------------------ | -------------------------------------------------- |
| Szöveg             | PETSCII bájtként kódolandó karakterlánc            |
| Cím                | Cél memóriacím — `$C000` hex vagy egy **címkenév** |
| Címke (opcionális) | Hozzárendel egy címkét, amely a célcímre mutat     |
| `alsó`             | Opcionális jelző – lásd alább                      |

**Karakterkészlet módok:**

| Mód                            | Nagybetűs bevitel (`A`–`Z`)                                                                                                      | Kisbetűs bevitel (`a`–`z`)         |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| **Nagybetű (alapértelmezett)** | `$41`–`$5A` (PETSCII nagybetűs CHROUT-on keresztül)                                                                              | szintén leképezve a `$41`–`$5A`-re |
| **Kisbetű (`kisbetű`)**        | Az ábécé betűi át lettek képezve, így a látható kis- és nagybetűs karakterkészletben a kis- és nagybetűk változatlanok maradnak. | Ugyanaz a szabály                  |

**Szintaxis:**
```
.petscii $C000, "HELLO" ; nagybetűs PETSCII (alapértelmezett)
.petscii $C000, "hello", kisbetűs ; kisbetűs PETSCII ($61–$7A)
.petscii $C000, "HELLO", null ; null terminátorral
.petscii $C000, "hello", kisbetűs, null ; kisbetűs + null terminátor
.petscii $C000, "HELLO" :my_msg ; makrócímkével
```

**Generált bájtok (nagybetűvel, `"SZIA"`):**
```
; $C000
.byte $48, $45, $4C, $4C, $4F ; H E L L O (PETSCII $41–$5A tartomány)
```

**Méret a kódban:** 0 bájt. Az adat a célcímen késleltetett adatszakaszként
kerül elhelyezésre (mint a RAWBYTES).

**Null terminátor:** add hozzá a `null` jelzőt, hogy egy `$00` bájtot fűzz hozzá
a szöveg után. Ideális nullával lezárt ciklusokhoz:

```
LDX #$00
hurok:
LDA msg,X
BEQ kész ; $00 leállítja a hurkot
JSR $FFD2
INX BNE hurok
kész:
RTS
```

**Kódolási szabályok:**

| Bemenet                                | Nagybetűs mód                        | Kisbetűs mód |
| -------------------------------------- | ------------------------------------ | ------------ |
| `A`–`Z`                                | `$41`–`$5A`                          | `$61`–`$7A`  |
| `a`–`z`                                | `$41`–`$5A` (kényszerített nagybetű) | `$41`–`$5A`  |
| Szóköz, számjegyek, írásjelek (32–126) | ahogy van                            | ahogy van    |
| Új sor                                 | `$0D` (VISSZATÉRÍTÉS)                | `$0D`        |
| Más                                    | `$20` (szóköz)                       | `$20`        |

> **Tipp:** Használj PETSCII-t a CHROUT-on keresztül kimenetre kerülő adatokhoz
> (`$FFD2`). Közvetlenül a képernyő RAM-ba való íráshoz használd a STRING vagy a
> RAWTEXT formátumot.

---

### KARAKTERHEZÉS

Futásidőben a `$D018` 1. bitjének módosításával átkapcsolja a VIC-II karakter
ROM-ot nagybetűs/grafikus mód (C64 alapértelmezett) és kisbetűs/nagybetűs mód
között.

| Érv | Leírás                                                                                                                                                   |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mód | **Kisbetűs** — engedélyezi a kisbetűs/nagybetűs karakterkészletet; **Nagybetűs** — visszaállítja az alapértelmezett nagybetűs/grafikus karakterkészletet |

**Szintaxis:**
```
.charset lower ; váltás kisbetűs karakterkészletre
.charset upper ; visszaváltás nagybetűs/grafikus karakterkészletre
```

**Generált kód:**

Kisbetűs mód:
```
LDA $D018
ORA #$02 ; 1. bit beállítása → kisbetűs/nagybetűs ROM $1800-ra
STA $D018
```

Nagybetűs mód:
```
LDA $D018
ÉS #$FD ; 1. bit törlése → nagybetűs/grafikus ROM $1000-nél
STA $D018
```

**Méret:** 8 bájt (LDA abs + ORA/AND imm + STA abs).

**Miért ORA/ÉS a közvetlen írás helyett?** `$D018` a képernyő RAM helyét is
vezérli (7–4. bitek). Csak az 1. bit bekapcsolása őrzi meg a regiszter többi
részét.

**Tipikus munkafolyamat:**

```
.charset lower
.text 0, 0, "hello world", lower
.charset upper
```

> **Megjegyzés:** A CHARSET makró csak a VIC karakter ROM mutatót módosítja. Nem
> hívja meg az `$E544` (KERNAL karakterkészlet init) függvényt. A legtöbb
> esetben ez elegendő; csak akkor hívja meg először az `JSR $E544` makrót, ha
> szüksége van arra, hogy a KERNAL saját nyomtatási rutinjai is figyelembe
> vegyék a változást.

---

### CHARDEF

Egyetlen 8×8-as egyéni karaktert definiál egy RAM-alapú karakterkészletben.
Beágyazott futásidejű kódot bocsát ki, amely végrehajtáskor 8 bájtot másol a
`base + index * 8` mappába – nincs szükség megelőző címkére vagy `ORG` indexre.

| Érv                  | Leírás                                                                                                               |
| -------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Karakterkészlet alap | A RAM karakterkészlet alapcíme (alapértelmezett: `$3800`). Úgy kell beállítani, hogy a VIC-II láthassa (lásd alább). |
| Karakterindex        | Melyik karakterhelyet kell újradefiniálni, 0–255. `65` = 'A' az alapértelmezett képernyőkód-elrendezésben.           |
| 8 bájt               | Vesszővel elválasztott bitképsorok, fentről lefelé. Minden bájt 7. bitje = a bal szélső képpont.                     |

**Szintaxis:**
```
.chardef 3800 dollár, 65 dollár, 18 dollár, 3 cent, 66 dollár, 7 ezer dollár, 66 dollár, 66 dollár, 66 dollár, 00 dollár
```

**Generált kód (8 × `LDA #b` / `STA célpont+n`, összesen 40 bájt):**
```
LDA #18 dollár
    STA 3A08 USD
    LDA #$3C
    STA 3A09 USD
    LDA #66 dollár
    STA $3A0A
    LDA #$7E
    STA $3A0B
    LDA #66 dollár
    STA $3A0C
    LDA #66 dollár
    STA $3A0D
    LDA #66 dollár
    STA $3A0E
    LDA #$00
    STA $3A0F
```

**Cél címe:** `$3800 + 65 * 8 = $3A08`. Fordítási időben kiszámítva és fixen
beépítve az STA operandusokba.

**Méret:** 40 bájt karakterenként (8 × 5).

**Tipikus munkafolyamat:**
```
; VIC-II pont RAM karakterkészletnél $3800-nál
LDA $D018
ÉS #$F1
ORA #$0E ; 3-1. bitek = %111 → karakterkészlet banknál+$3800
STA $D018

.chardef $3800, 65, $18,$3C,$66,$7E,$66,$66,$66,$00 ; 'A' újradefiniálása
.chardef $3800, 66, $7C,$66,$66,$7C,$66,$66,$7C,$00 ; 'B' újradefiniálása
; ... további .chardef sorok minden egyéni karakterhez
```

**Mikor használjuk a CHARDEF-et alternatívákkal szemben:**

| Megközelítés                             | Használja, amikor                                                                                          |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **CHARDEF**                              | Szükséged lesz néhány egyéni karakterre (mondjuk 1–20). A futásidejű költség 40 bájt karakterenként.       |
| **RAWBYTES @ $3800**                     | Teljes egyéni karakterkészlettel rendelkezik (256 karakter). Összesen 2 KB adat, nincs futásidejű másolat. |
| **INCBIN "karakterkészlet.bin" @ $3800** | Külső karakterkészletfájl (a Karakterszerkesztő által létrehozva). A legtisztább opció.                    |
| **Karakterkészlet vászon + INCBIN**      | Teljes 256 karakteres bitkép egyetlen 128×128-as képként festve.                                           |

> **Igazítási emlékeztető:** A VIC-II a karakterkészlet bázisát `$0800`
> többszörösének várja. Érvényes bankok: `$0000`, `$0800`, `$1000`, ... ,
> `$3800` (a jelenlegi 16 KB-os VIC bankon belül). A RAM karakterkészletek
> jellemzően `$2000`, `$2800`, `$3000` vagy `$3800` értéknél találhatók.

---

### DOBOZ_TALÁLAT

Tengelyhez igazított határolókeret (AABB) ütközési teszt két, 4 bájtos nulla
oldalas struktúrákkal leírt téglalap között. Az eredményt az akkumulátorban adja
vissza: **A = 1** átfedés esetén, **A = 0** egyébként. Tisztán inline assembly,
nincs alprogramhívás.

| Érv               | Leírás                                                                                    |
| ----------------- | ----------------------------------------------------------------------------------------- |
| Box1 irányítószám | Az első doboz 4 bájtos struktúrájának nulladik oldalas alapja (alapértelmezett: `$FB`).   |
| Box2 irányítószám | A második doboz 4 bájtos struktúrájának nulladik oldalas alapja (alapértelmezett: `$F7`). |

**Struktúra elrendezés** (4 bájt dobozonként, előjel nélküli 8 bites
koordináták):

| Eltolás | Mező   |
| ------- | ------ |
| `+0`    | Balra  |
| `+1`    | Felső  |
| `+2`    | Jobbra |
| `+3`    | Alsó   |

**Szintaxis:**
```
.box_hit $FB, $F7
```

**Generált kód (30 bájt, teljesen PC-relatív — nincsenek alprogramok, nincsenek
abszolút ugrások):**
```
LDA $FD ; b1 jobbra CMP $F7 ; b2 balra BCC nem ; R1 < L2 → kihagyott LDA $F9 ; b2 jobbra CMP $FB ; b1 balra BCC nem LDA $FE ; b1 alul CMP $F8 ; b2 felül BCC nem LDA $FA ; b2 alul CMP $FC ; b1 felül BCC nem LDA #$01 ; találat BNE kész ; feltétel nélküli (A ≠ 0)
nem: LDA #$00
kész:
```

**Méret:** 30 bájt.

**Tipikus munkafolyamat:**

```
; Játékos sprite mező $FB..$FE-nél
LDA sprite_x ; L
STA $FB
LDA sprite_y ; T
STA $FC
CLC
ADC #23 ; +23 → B (24 pixel magas sprite)
STA $FE
LDA $FB
CLC
ADC #23 ; R
STA $FD

; Ellenség mező $F7..$FA-nál (hasonlóképpen feltöltve)
; ...

.box_hit $FB, $F7 ; tesztjátékos vs. ellenség → A = 0 vagy 1

CMP #$01
BNE no_collision
JSR handle_hit
no_collision:
```

**Korlátozások:**
- Mindkét nulladik oldalcímnek `≤ $FC` értékűnek kell lennie (mindegyik mezőnek
  4 egymást követő bájtból kell állnia: `zp`, `zp+1`, `zp+2`, `zp+3`).
- A koordinátákat **előjel nélküli 8-bites** (0–255) koordinátaként kezeli a
  rendszer. Az ezen a tartományon kívül eső előjeles sprite-koordinátákat
  tárolás előtt normalizálja.
- A két mező átfedheti egymást a ZP területen, ha szükséges, de általában 8
  különálló bájtra van szükség.

**Miért ne lenne egy alprogram?** Az inline generálás elkerüli a JSR/RTS
többletterhelést (14+ ciklus), és a tesztet forrón tartja a gyorsítótárban a
szűk játékciklusok érdekében. Ha sok párt kell tesztelned, helyezd el a saját
`JSR box_hit_sub`-edet manuálisan egyetlen BOX_HIT sor köré.

**Összehasonlítás az UB `box_hit()` függvényével:** Az Ultimate Basic ugyanazt a
6502-es logikát használja, mint egy futásidejű függvény, amely egy változóra tér
vissza. A VA-ban a BOX_HIT függvényt oda kell beilleszteni, ahol a tesztre
szükség van; az eredmény az `A` mappában található.

---

### INCBIN

Mint a BASIC**-ben található **BLOAD — kiválaszt egy külső bináris fájlt
(`.bin`, `.prg`, `.sid`, `.raw`) és közvetlenül beágyazza az összeállított
PRG-be a megadott címen.

| Érv  | Leírás                                                                 |
| ---- | ---------------------------------------------------------------------- |
| Fájl | Tallózással válasszon ki egy `.bin`, `.prg`, `.sid` vagy `.raw` fájlt. |
| Cím  | Cél betöltési cím (pl. `$C000`)                                        |

**Szintaxis:**
```
.incbin "zene.bin", $C000
```

**Generált kód megjegyzése:**
```
; INCBIN "zene.bin" @ $C000 (2048 bájt)
.bájt $01, $02, ...
```

**Méret a kódban:** 0 bájt (elhalasztott adatszakasz). A bináris fájl a megadott
címre van beágyazva.

---

### KOALA

Betölt egy **Koala Painter** képet (`.koa` / `.kla`, 160×200 többszínű) és
megjeleníti. A képadatok egy fix címen vannak beágyazva, például `INCBIN` (a
fájl 2 bájtos `$6000` betöltési címét eltávolítják), és maga az utasítás egy 86
bájtos megjelenítési rutinná fordul le, amely ott fut, ahol található.

| Érv  | Leírás                                                                                                                               |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Fájl | Tallózással válasszon ki egy `.koa` / `.kla` fájlt (10003 bájt, vagy 10001 betöltési cím nélkül)                                     |
| Cím  | Bitmap cím: `$6000` (alapértelmezett, Koala natív, VIC bank 1, képernyő RAM `$4400`) vagy `$2000` (VIC bank 0, képernyő RAM `$0400`) |

A megjelenítési rutin a képernyő RAM részét a képernyőre, a színes RAM részét
pedig a `$D800` címre másolja, a háttérbájtot a `$D021` címre írja, kiválasztja
a VIC bankot a `$DD00` címen (a többi portbitet megtartva), és bekapcsolja a
többszínű bitképes módot (`$D011 = $3B`, `$D016 = $18`, `$D018 = $18`). A többi
címet elutasítja: a fennmaradó 8K-s nyílás a BASIC/KERNAL ROM alatt van (a
másolási ciklus ROM-ot olvasna), vagy átfedésben van a karakter-ROM árnyékkal.

**Szintaxis:**
```
.koala "kép.koa"
.koala "kép.koa", 2000 USD
```

**Példa — mutass egy képet és várj:**
```
* = $0801
.koala "kép.koa"
várakozás:
JMP várakozás
```

**Méret a kódban:** 86 bájt (megjelenítési rutin); az 10001 bájtnyi képadat a
megadott címre kerül. A C64 Visual Assembler Hires szerkesztője egy kompatibilis
fájlt exportál.

---

### SZINT / SZINT_SOR

Egy **Level Editor** projektet helyez a programodba, és a pálya sorait egy
képernyőpufferbe másolja – egy görgetős játék építőelemeit. A C64 Visual
Assembler `level-demo.asm` példája egy komplett joystick-os görgetős pálya.

#### SZINT

Egy INCBIN stílusú direktíva, amely **0 bájtnyi kódot bocsát ki**. Csak a Level
Editor projekt **elt** képernyői (a C64 Visual Assembler Level Editorja által
mentett `.bin`) kerülnek a memóriába a megadott címről (alapértelmezett:
`$2000`), slot sorrendben, képernyőnként 2000 bájt (1000 képernyőkód + 1000
szín). Az azonos képernyők egyszer tárolódnak, és minden üres slot egy üres
képernyőn osztozik. A pointer táblák a képernyőket követik. Egy szint legfeljebb
7 × 10 képernyő lehet.

**Szintaxis:**
```
.level "szint.bin"
.level "szint.bin", $4000
```

| Meghatározott                                                                        | Jelentés                                                                                                                                                             |
| ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ALACSONY_SZINT` / `MAGAS_SZINT`                                                     | A képernyő címe minden slotban (sor-fő, `LEVEL_W` slot soronként)                                                                                                    |
| `SZINT_SOR_HELY`                                                                     | Szint karakter sor → a képernyő sorának első helye                                                                                                                   |
| `SZINT_SOR_ALACSONY/MAGAS`, `SZINT_VARÁZS_ALACSONY/MAGAS`                            | Szint karaktersor → a képernyőkód sorának / színsorának eltolása a képernyőn belül                                                                                   |
| `SZINT_SZÍN_RÉSZ`, `SZINT_SZÍN_FELÜLET`                                              | Nézet kezdő oszlopa → képernyő oszlop és a képernyőn belüli oszlop                                                                                                   |
| `SZINT_SZINT`, `SZINT_M`                                                             | Szintméret a képernyőkön                                                                                                                                             |
| `SZINT_SZÉLEK`, `SZINT_SOROK`                                                        | Szintméret karakterekben                                                                                                                                             |
| `SZINT_MAX_X`, `SZINT_MAX_Y`                                                         | 40×25-ös nézet legnagyobb görgetési pozíciója pixelenként                                                                                                            |
| `SZINT_BG`, `SZINT_MC1`, `SZINT_MC2`, `SZINT_MULTICOLOR`                             | Háttér / többszínű színek és a szint módja                                                                                                                           |
| `SZINT_ADATOK`, `SZINT_MÉRET`, `SZINT_VÉGE`                                          | Kezdő, méret és az első szabad cím a szintadatok után                                                                                                                |
| `SZINT_OBJ_X_LO/MAGAS`, `SZINT_OBJ_Y_LO/MAGAS`, `SZINT_OBJ_TÍPUS`, `SZINT_OBJ_PARAM` | Objektumtábla (Level Editor objektumréteg): pozíció a szint pixeleiben, típusa és paraméter bájtja, görgetési sorrendben — `LEVEL_OBJ_COUNT` bejegyzés (maximum 255) |
| `LEVEL_OBJ_T_START` … `LEVEL_OBJ_T_TRIGGER`                                          | Tárgytípus számok: START 0, ELLENSÉG 1, TÁRGY 2, AJTÓ 3, KIJÁRAT 4, RIASZTÓ 5                                                                                        |
| `LEVEL_START_X`, `LEVEL_START_Y`                                                     | Az első Start objektum pozíciója (csak akkor van megadva, ha a szint rendelkezik ilyennel)                                                                           |
| `SZINT_ATTR`, `SZINT_ATTR_SZILÁRD` … `SZINT_ATTR_GYŰJTÉS`                            | Karakter attribútumtáblázat (képernyőkódonként egy jelzőbájt; csak akkor, ha a szint rendelkezik attribútumokkal) és bitjei: 1, 2, 4, 8                              |
| `SZINT_SZEGÉLY`, `SZINT_SZÍNEK`, `SZINT_SZEGÉLY/SZEGÉLY/MC1/MC2`                     | Szintszegély; slotonkénti színtáblázatok (soronkénti főbb értékek, mint például `LEVEL_SLOT_*`), ha a képernyőnek saját színei vannak (`LEVEL_SCR_COLORS` = 1)       |

Tipikus őr: `.assert LEVEL_END <= $9200, "szintadatok futnak a kódba"`.

#### SZINT_SORBAN

A szint egy 40 karakteres sorát egy pufferbe másolja: az **X** változóban lévő
szint sorát, a `col` változóban lévő szint oszloptól kezdve, a `dst` mutatóban
lévő címre (`dst` / `dst+1`, lo/hi). A harmadik argumentummal, az `color`-tel a
képernyőkódok helyett a színeket másolja (színes RAM esetén). Egy két képernyőt
átfogó 40 karakteres ablakot egy önmódosító másolási ciklus kezel (~14 ciklus
bájtonként). X megmarad, A és Y törlődik. Szükséges hozzá egy `.level` blokk a
programban.

**Szintaxis:**
```
.level_row dst_lo, nézet_x
.level_row dst_lo, nézet_x, szín
```

**Méret a kódban:** 132 bájt — `LBEQ` / `LBNE` használható, ha egy ágnak át kell
ugrania rajta.

---

### SID

Mint a **BLOAD a zenéhez** — betölt egy `.sid` fájlt a PRG-be, és automatikusan
beolvassa az Init és Play címeket a fejlécből. Indításkor egyszer hívja meg az
Init függvényt, majd minden képkockán hívja meg a Play függvényt az IRQ
kezelőjéből.

| Érv                     | Leírás                                                                                                                      |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Fájl                    | Az `.sid` fájl (PSID / RSID)                                                                                                |
| Egyéni cím (opcionális) | Írja felül a SID natív betöltési címét (pl. `$1000`). Hagyja üresen, ha a SID fejlécben található címet szeretné használni. |

A SID fejléc a következőket adja:
- **Betöltési cím** — hova kerül az adat a memóriában (az egyéni cím, ha van
  ilyen megadva)
- **Init cím** — JSR-rel hívjuk meg ezt a kódot a zene inicializálásához (egyéni
  címmel együtt mozgatva)
- **Lejátszási cím** — ezt JSR-rel hívjuk meg minden IRQ kezelő keretén (egyéni
  címmel együtt mozgatva)

**Szintaxis:**
```
.sid "Ikari_Warriors.sid"
.sid "Ikari_Warriors.sid", 1000 dollár
```

**Generált kód megjegyzése:**
```
; SID "Ikari_Warriors.sid" @ 1000 $ Init: 1000 $ Lejátszás: 1006 $ (4096 bájt)
```

**Méret a kódban:** 0 bájt soronként. A SID bináris fájl a megadott címen,
késleltetett chunkként kerül a PRG-be.

> **Fontos:** A legtöbb SID fájl fixen kódolt belső abszolút címeket tartalmaz.
> Ezek csak akkor helyezhetők át, ha a teljes bináris fájlt ugyanazzal az
> eltolással eltoljuk. Ha egy SID belső ugrásokkal rendelkezik `$10xx` címre,
> akkor `$1000` címen kell maradnia – egy másik címre való áthelyezése ezeket a
> belső hivatkozásokat megszakítja.

> **Tipikus használat:** Adj a SID-nek egy saját címet (`.sid "tune.sid",
> $1000`), ha a natív címe ütközik a kódoddal. Indításkor hívd meg egyszer az
> Init függvényt, majd hívd meg a Play minden képkockát egy raszteres IRQ
> kezelőből — vagy hagyd, hogy a [SID_PLAYER](#sid_player) mindkettőt megtegye.

**Címkék:** az SID direktíva definiálja az `SID_LOAD` (ahová az adatok
kerülnek), az `SID_INIT` és az `SID_PLAY` címeket (az init és play címek, egy
egyéni címmel együtt mozgatva). Az `SID_PLAY` hiányzik, ha a dallamnak nincs
play címe (egy RSID, amely saját IRQ-t telepít). Használd őket a saját kódodban,
pl. `JSR SID_PLAY` egy IRQ kezelőben.

---

### SID_PLAYER

Egyetlen sorral játssza le az **SID** direktíva dallamát: inicializálja a
dallamot és folyamatosan meghívja a lejátszási rutinját egy raszteres
megszakításból, így a program folytathatja a saját munkáját.

| Érv     | Leírás                                                                      |
| ------- | --------------------------------------------------------------------------- |
| Dal     | Az A-ban lévő init rutinnak átadott alhangolási szám (alapértelmezett: `0`) |
| Raszter | A megszakítás raszteres vonala, `$00`–`$FF` (alapértelmezett: `$FA`)        |

Mit csinál: `SEI`, `LDA #dal` / `JSR SID_INIT`, kikapcsolja a CIA1 időzítő
IRQ-ját (`$DC0D`), beállítja az IRQ vektort (`$0314/$0315`) a beépített
kezelőjére, a raszter vonalat (`$D012`, a `$D011` 8. bitje törölve) és a raszter
IRQ-t (`$D01A`), `CLI`, majd átugrik a kezelőn. A kezelő nyugtázza a
megszakítást (`ASL $D019`), meghívja a `JSR SID_PLAY` függvényt, majd továbblép
a KERNAL-hoz (`JMP $EA31`), amely szintén beolvassa a billentyűzetet.

**Szintaxis:**
```
.sid "Ikari_Warriors.sid"
.sid_player
.sid_player 1, 80 dollár
```

**Méret a kódban:** 58 bájt.

> **Megjegyzés:** Szükség van egy `.sid` sorra a programban (`SID_INIT` és
> `SID_PLAY`); különben a fordítás hibával leáll. Ha a CIA1 időzítő IRQ-ja ki
> van kapcsolva, a KERNAL a raszteres IRQ-ból származó képkockánként egyszer fut
> le – a billentyűzet és a `GETIN` továbbra is működik.

---

### BELEÉRTVE

Mint a BASIC** **MERGE függvénye — behúz egy másik fájlt, és kibontja azt ezen a
pozíción. Tökéletes az újrafelhasználható alprogramkönyvtárakhoz.

Két fájltípus támogatott:
- **Egyszerű assembly forrás** (`.inc`, `.asm`, `.s`) — a fájl VMA forrásként
  kerül beolvasásra. Minden buildnél újra beolvasásra kerül, így bármilyen
  szerkesztővel szerkeszthető.
- **Visual Assembler projekt** (`.json`) — egy C64 Visual Assembler blokkprogram
  blokkjai.

| Érv                        | Leírás                                                                                                                                                                                                                         |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Fájl                       | Egy `.inc` / `.asm` / `.s` forráskód vagy egy `.json` Visual Assembler projekt                                                                                                                                                 |
| Betöltési cím (opcionális) | Ha be van állítva (hex, pl. `C000`), akkor a beszúrt kód erre a címre kerül – egy `ORG` kerül elé, és a beszúrt fájl saját ORG-jei figyelmen kívül maradnak. Enélkül a beszúrt fájl saját ORG-jei szabályozzák az elhelyezést. |

**Szintaxis:**
```
.include "library.json"
.include "macros.inc", $1500
.include "sprites.asm"
```

- Add meg az **fájl kiterjesztését: ** — egy egyszerű nevet, például az
  `.include "macros"`-et a rendszer `.include "macros.json"`-ként kezeli.
- Útvonalfelbontás: először a forrás mellett, majd minden keresési mappában (a
  CLI `--base-dir` / `--search`); egy másik gépen írt elérési út a saját
  fájlnevére tér vissza. A hiányzó include nem hiba – a build nélküle
  folytatódik.

**Generált kód (címfelülírás nélkül):**
```
; .include "library.json"
... (a beillesztett kód következik)
```

**Generált kód (`C000` betöltési címmel):**
```
; .include "library.json" @ $C000
*=$C000
... (a beillesztett kód következik)
```

> **Tipp:** Az INCLUDE használatával újrafelhasználható alprogramkönyvtárakat
> hozhat létre, amelyeket megoszthat a projektek között. Az `.inc`/`.asm`/`.s`
> fájlok akkor a legjobbak, ha a könyvtárat egyszerű szövegszerkesztőben
> szeretné szerkeszteni, vagy más 6502 assemblerekkel szeretné megosztani; a
> `.json` fájlok akkor a legjobbak, ha a könyvtár egy Visual Assembler
> blokkprogram. Állítson be egy betöltési címet, ha a könyvtárnak nincs saját
> ORG-ja, vagy ha felül szeretné írni az alapértelmezett elhelyezését.

> **2.1:** A nem található include hiba, ahogy az is, ha egy fájl önmagát
> foglalja magába (közvetlenül vagy lejjebb). Egy included fájl saját
> `.include`, `.incbin` és `.sid` sorai is betöltődnek a saját mappájához
> képest, és a makróhívásai kibővülnek – akár 16 szinttel mélyebbre.

---

### TÁBLÁZAT

Mint az **DIM egy adott címen** — elnevezi a keresőtáblát, és meghatározza, hogy
hol található a memóriában. Írjon utána `.byte`, `.word` vagy `.fill` sorokat a
tábla tartalmának meghatározásához.

| Érv | Leírás                                           |
| --- | ------------------------------------------------ |
| Név | A tábla címkéjének azonosítója (pl. `színtábla`) |
| Cím | Fix cím, ahol a tábla kezdődik (pl. `$C000`)     |

**Szintaxis:**
```
.table color_table $C000
.table lookup ; az aktuális címen
```

**Generált kód:**
```
színtábla:
```

Címmel a programszámláló oda ugrik; cím nélkül a tábla az aktuális címtől
kezdődik. Írj utána `.byte` / `.word` / `.fill` sorokat a tartalom kitöltéséhez.

**Méret:** 0 bájt.

---

### ORG

Beállítja, hogy a program (vagy annak egy része) hova kerüljön a memóriában –
mintha egy kezdőcímet választanánk ki a gépi kód beírása előtt. Minden
programhoz legalább egy ORG szükséges. A szabványos C64 BASIC által betölthető
kezdőcím az `$0801`.

| Érv       | Leírás                                                          |
| --------- | --------------------------------------------------------------- |
| Cím       | Az új forráscím (pl. `0801` HEX-ben, vagy `2049` DEC-ben)       |
| HEX / DEC | Váltás a címbevitel hexadecimális és decimális kijelzése között |

**Szintaxis:**
```
* = C000 dollár
```

**Generált kód:**
```
* = C000 dollár
```

**Méret:** 0 bájt. Az ORG maga nem generál gépi kódot.

Minden ORG új szakaszt indít. Az azt követő sorok erről a címről indulva
kerülnek összeállításra. A PRG az összes szakaszt egy fájlban tárolja – a
szakaszok közötti réseket nullákkal tölti ki.

**Példa — kód az `$0801` helyen, adattábla az `$C000` helyen:**
```
* = $0801
LDX #$00
hurok:
LDA $C000,X
STA $D800,X
INX BNE hurok
RTS

* = $C000
.byte $01, $02, $03, ...
```

> **Tipp:** ORG nélkül a program a BASIC kezdeténél, a `$0801`-nél kezdődik
> (2049 decimális). A BASIC SYS csonkkal (alapértelmezett) az assembler egy
> rövid `10 SYS…` sort helyez el a `$0801`-nél, és a kódod a `$080D`-nél
> kezdődik. Lásd: [Kimenet: PRG, BASIC csonk és belépési
> pont](#3-output-prg-basic-stub-and-entry-point).

---

### KÖVETKEZŐ / KÖVETKEZŐ

Mint a BASIC-ben a **`FOR X=N TO 1 STEP -1 : ... : NEXT X`** — N-től 1-ig számol
vissza az X vagy Y regiszter használatával. Írd az utasításaidat a LOOP és a
NEXT közé, és a program automatikusan a megfelelő számú ciklust ismétli.

#### HUROK

| Érv           | Leírás                                                  |
| ------------- | ------------------------------------------------------- |
| Nyilvántartás | `X` vagy `Y` — a számlálóregiszter                      |
| Gróf          | Ciklus iterációszám (hex vagy decimális, pl. `0A` = 10) |
| Címke         | Automatikusan generált cikluscímke (pl. `ciklus0`)      |

**Szintaxis:**
```
.loop X, 10, loop0
```

**Generált kód:**
```
LDX #$0A}hurok0:
```

**Méret:** 2 bájt (LD_ opkód + azonnali operandus).

#### KÖVETKEZŐ

| Érv           | Leírás                                        |
| ------------- | --------------------------------------------- |
| Nyilvántartás | Automatikusan illeszkedik a LOOP regiszterhez |
| Címke         | Automatikusan kapcsolódik a LOOP címkéhez     |

**Szintaxis:**
```
.következő ciklus0
```

**Generált kód:**
```
DEX BNE hurok0
```

**Méret:** 3 bájt (DEX + BNE + elágazási eltolás).

**Példa — 10 képernyőcella törlése:**
```
LDX #$0A
hurok0:
LDA #$20 ; szóköz karakter
STA $0400,X
DEX BNE hurok0
```

---

### FOR / ENDF

Mint a BASIC-ben a **`FOR X=0 TO N-1 : ... : NEXT X`** — 0-tól *felfelé* számol.
Ideális, ha előre mutató indexre van szükség, például egy karakterláncon vagy
tömbön való lépéshez.

#### A

| Érv           | Leírás                                                                      |
| ------------- | --------------------------------------------------------------------------- |
| Nyilvántartás | `X` vagy `Y` — a számlálóregiszter                                          |
| Gróf          | Ciklushatár (hex vagy decimális, pl. `$12` = 18). Az X/Y 0-tól 1-ig terjed. |
| Címke         | Automatikusan generált cikluscímke (pl. `for0`)                             |

**Szintaxis:**
```
X-ért, $12, 0-ért
```

**Generált kód:**
```
LDX #00$0-ért:
```

**Méret:** 2 bájt (LD_ opcode + `#$00`).

#### ENDF

| Érv           | Leírás                                       |
| ------------- | -------------------------------------------- |
| Nyilvántartás | Automatikusan illeszkedik a FOR regiszterhez |
| Címke         | Automatikusan kapcsolódik a FOR címkéhez     |
| Gróf          | Automatikusan másolva a párosított FOR-ból   |

**Szintaxis:**
```
.endf for0
```

**Generált kód:**
```
INX CPX #$12 BNE 0-ért
```

**Méret:** 5 bájt (IN_ + CP_ #imm + BNE eltolás).

**Példa — nullával lezárt karakterlánc kiírása:**
```
LDX #$00
for0:
LDA msg,X ; msg = PETSCII karakterlánc fix címen
BEQ kész ; null terminátor → kilépés
JSR $FFD2 ; CHROUT
INX
CPX #$12 ; maximum 18 karakter
BNE for0
kész:
RTS
```

> **LOOP vs FOR:** A LOOP lefelé számol (N→1) — jó késleltetésekhez,
> kitöltésekhez, pixelhurkokhoz. A FOR felfelé számol (0→N) — jó
> karakterlánc/tömb eléréséhez. Mindkettő használhatja az X vagy Y
> koordinátákat.

---

### TOLJA / HÚZZA

Mint az **változók mentése egy GOSUB előtt és visszaállítása után ** — de a 6502
hardververmet használja. Ha egy alprogram A, X vagy Y értékeket használ, akkor
PUSH és PULL utasításokkal kell becsomagolni, hogy a hívó kód regiszterei
megmaradjanak.

#### NYOMJA

Egy vagy több regisztert helyez a verembe. A sorrend mindig A → X → Y (a
legbelső először).

| Érv         | Leírás                                                         |
| ----------- | -------------------------------------------------------------- |
| Regiszterek | Bármilyen kombináció: `A`, `X`, `Y`, `AX`, `AY`, `XY`, `XY[X2] |

**Szintaxis:**
```
.push AXY
```

**Generált kód (példa: `AX`):**
```
PHA (Védőoltás) Adás PHA
```

**Méret:** 1 bájt A-nak (`PHA`), 2 bájt X-nek vagy Y-nak (átvitel + push).

#### HÚZNI

Visszaállítja a regisztereket a veremből ** fordított sorrendben ** (Y → X → A).

| Érv         | Leírás                                                        |
| ----------- | ------------------------------------------------------------- |
| Regiszterek | Ugyanaz, mint a PUSH – meg kell egyeznie a megfelelő PUSH-sal |

**Szintaxis:**
```
.húzza az AXY-t
```

**Generált kód (példa: `AX`):**
```
PLA ADÓ PLA
```

> **Szabály:** A PUSH és PULL utasításoknak mindig **ugyanazt a
> regiszterkészletet kell használniuk**. `PUSH AX` → `PULL AX` (belsőleg
> fordított sorrendben állítja vissza: először X, majd A).

---

### END / RTS álnév

Az **RTS-hez hasonlóan, egy barátságosabb makrónévvel ** — az `.end` egyetlen
`RTS` bájtot bocsát ki, egy rövid alprogram terminátort.

**Szintaxis:**
```
.end
```

**Generált kód:**
```
RTS
```

**Méret:** 1 bájt.

Ezt akkor használd, ha egy olyan alprogram vége jelölőt szeretnél, ami inkább
makróként, mint nyers utasításként olvasható.

---

### MAKRO / VÉGE / MEGHÍVÁS

Mint egy ** nevű GOSUB, paraméterekkel ** — definiáljon egyszer egy
újrafelhasználható kódrészletet (MACRO…ENDM), majd hívja meg bárhol az INVOKE
paranccsal. Minden alkalommal más argumentumértékeket adjon át a kód
másolása-beillesztése helyett.

#### MAKRO (definíció kezdete)

| Érv         | Leírás                                                                             |
| ----------- | ---------------------------------------------------------------------------------- |
| Név         | A makró azonosítója (pl. `setColor`)                                               |
| Paraméterek | Opcionális vesszővel elválasztott paraméternevek (pl. `color` vagy `color, count`) |

A makródefiníció kezdetét jelzi. A MACRO és az ENDM közötti sorok a makró
törzsét alkotják. Egy paraméterekkel rendelkező makró ** nem generál kódot**,
ahol a definíció található; egy paraméter nélküli makró is ott áll össze
alprogramként (`JSR név` hívja). A törzsben egy paraméter `{paramName}` formában
vagy a saját neveként szerepel; a hívás kitölti az argumentumot – az
utasításoperandusokban és a könyvtármakrók argumentumában egyaránt (`.set_border
c`, `.sprite_pos n, x, y` …). A törzs címkéi, LOOP címkéi és futásidejű `.if` /
`.while` címkéi hívásonként egyediek. Egy makró törzsén belüli makróhívás nem
lesz kibontva (hiba).

**Generált kód:**
```
; .MACRO setColor (szín)
... (törzs)
; .ENDM
```

**Szintaxis:**
```
.macro setColor szín
LDA {szín}
STA $D020
.endm
```

#### ENDM (definíció vége)

Bezárja az aktuális makródefiníciót. Nincsenek argumentumok.

#### MEGHÍVÁS

Meghív egy definiált makrót ezen a pozíción, és a megadott argumentumértékeket
helyettesíti a törzsben lévő `{paramName}` helyőrzők helyére.

| Érv        | Leírás                                                                                                 |
| ---------- | ------------------------------------------------------------------------------------------------------ |
| Makró neve | A programban vagy egy mellékelt fájlban definiált makró                                                |
| érvek      | Vesszővel elválasztott argumentumértékek, amelyek megegyeznek a makró paraméterlistájával (pl. `#$07`) |

**Generált kód:**
```
; .invoke setColor(#$07)
    LDA #$07
    STA $020
```

**Szintaxis:**
```
; egyetlen argumentum:
.invoke setColor(#$07)

; több argumentum:
.invoke drawPixel($10, $20)

; argumentumok nélkül:
.invoke clearScreen

; szöveges / karakterláncos argumentumok (idézőjelben):
.invoke printText("Hello, World!")

; .call alias (az .invoke szinonimája):
.call setColor(#$07)
```

A makró törzse kibővül a `{paramName}` paraméterrel, amelyet a tényleges
argumentumok helyettesítenek. A szóközzel elválasztott formátum (`.invoke
setColor #$07`) is elfogadott.

**Argumentumtípusok:**
- **Numerikus**: `#$07`, `$10`, `255` — hexadecimális vagy decimális értékek
- **Szöveges karakterláncok**: `"Hello, World!"` — idézőjelek közé tett
  karakterláncok (az idézőjelek elhagyatva); az idézőjelek között lévő vesszőket
  a szöveg részeként kezeli a rendszer, nem pedig argumentum-elválasztóként.
- **Karakterliterál**: `'A'` — karakterliterál marad, így a törzs megkapja a
  kódját (`$41`)
- **Vegyes**: `#$07, "hello", $20` — bármilyen kombináció

> **Tipp:** Definiálj makrókat a programod tetején (vagy alján), majd HÍVD MEG
> őket, ahol szükséges. A makrók többször is meghívhatók különböző
> argumentumokkal.

> **2.1:** egy makró meghívhat egy másik makrót (`both(a, b)` hívja a `setc(a)`
> függvényt); a belső hívás a külső hívás argumentumait és a saját egyedi
> lokális címkéit kapja meg. Egy önmagát meghívó makró 16 szint után hibával
> leáll a lefagyás helyett.

---

### RÉGIÓ / RÉGIÓ VÉGRÉGIÓ

Pusztán egy csoportosítás szerkesztők és listázások számára — **nulla bájt**,
nulla hatás az összeállított kódra.

| Érv        | Leírás                                                                        |
| ---------- | ----------------------------------------------------------------------------- |
| Régió neve | Szabad szöveges címkék a szakaszhoz (pl. `init`, `game_loop`, `sprite_setup`) |

**Szintaxis:**
```
.region init
; kód...
.endregion
```

**Generált kód:**
```
; régió init
    SEI
    LDA #$00
    STA 020 USD
; endregion init
```

**Méret:** 0 bájt mind a REGION, mind az ENDREGION esetében.

> **Megjegyzés:** A régiók **egymásba ágyazhatók**. Minden ENDREGION lezárja a
> legközelebbi nyitott REGION-t. Nincs hatással az összeállított kimenetre.

---

### DEFINE / HA / KÜLÖNBEN / ENDIF

Mint egy ** kapcsoló, az assembler a következőt olvassa: ** — `DEFINE DEBUG`
bekapcsol egy szimbólumot, majd bármely `IF DEBUG` sorai assemblerre kerülnek,
és az `ELSE` ág kimarad. A DEFINE eltávolításával az IF rész eltűnik a
kimenetből. A kiadott buildekhez nem kell kódot törölni.

#### MEGHATÁROZÁS

| Érv       | Leírás                                                                                         |
| --------- | ---------------------------------------------------------------------------------------------- |
| Szimbólum | Egy vagy több vesszővel elválasztott azonosító az aktiváláshoz (pl. `DEBUG` vagy `DEBUG, PAL`) |

**Szintaxis:**
```
.define DEBUG, PAL
```

**Generált kód:**
```
; .DEFINE DEBUG
; .DEFINE DEBUG, PAL
```

Egy `DEFINE` egyszerre több szimbólumot is aktiválhat (vesszővel elválasztva).
Írd a DEFINE-okat a programod elejére.

#### HA

| Érv     | Leírás                                                                                                                              |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Állapot | Egy `.define`d szimbólum (aktív), egy `.const` név (aktív, ha nem nulla) vagy egy konstans kifejezés (`LEVEL == 2`, `MODE & 1`) |

**Szintaxis:**
```
.if HIBAKERESÉS
```

**Generált kód:**
```
; .HA HIBAKERESÉS
```

Az `IF` és `ENDIF` (vagy `ELSE`) közötti sorokat a feltétel összeállítja vagy
kihagyja. Egy csupasz név igaz, ha `.define`d vagy nem nulla `.const`, hamis, ha
egyik sem; minden más feltételnek konstans kifejezésnek kell lennie – az,
amelyik nem értékelhető ki összeszerelési időben, hibát jelent. A kihagyott
sorok `; [IF skipped] …` megjegyzésként jelennek meg, és **nulla bájtot**
generálnak.

#### MÁS

Nincsenek argumentumok. Az alternatív ágat jelöli — akkor állítódik össze,
amikor az `IF` feltétel *not* aktív.

**Szintaxis:**
```
.más
```

**Generált kód:**
```
; .ELSE
```

#### ENDIF

Nincsenek argumentumok. Lezárja a feltételes részt.

**Szintaxis:**
```
.endif fájltípus
```

**Generált kód:**
```
; .ENDIF
```

**Méret:** 0 bájt mind a négy direktívához. Csak a közöttük lévő * tartalom
számít.*

**Példa — hibakeresési border flash, a kiadás kihagyja:**
```
; .DEFINE DEBUG

; .IF DEBUG
LDA #$02 ; piros szegély
STA $D020
; .ELSE
LDA #$00 ; fekete (kiadás)
STA $D020
; .ENDIF
```

**Példa — több szimbólum egy DEFINE:**-ben
```
; .DEFINE DEBUG, PAL

; .IF PAL
LDA #$xx ; PAL időzítési állandó
; .ELSE
LDA #$xx ; NTSC időzítési állandó
; .ENDIF
```

A beágyazott `IF` függvények támogatottak. Ha egy külső részt kihagyunk, a
belsők is kimaradnak.

> **Megjegyzés:** Ez fordítási idejű feltételkezelés. A futásidejű
> összehasonlításhoz/elágazáshoz lásd a **Futásidejű IF / ELSE / ENDIF** részt
> alább.

### .ASSERT

Egy **fordítási idejű épségellenőrzés**.`.assert` kiértékel egy kifejezést az
összeszerelés során; ha az hamis (`0`), a fordítás egy tiszta hibával leáll,
amely tartalmazza a tényleges értéket. Ha igaz (nem nulla), akkor semmit nem
bocsát ki.

| Érv       | Leírás                                                                                                                                                          |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kifejezés | Bármely assembler kifejezés: címkék, `CONST`s, `*` (programszámláló), aritmetikai műveletek és összehasonlítások (`<`, `<=`, `>`, `>=`, `==`, `!=`) |
| Üzenet    | A hibaüzenethez hozzáfűzött opcionális szöveg                                                                                                                   |

**Szintaxis:**
```
.assert spriteData < $C000
.assert * < $A000
.assert end - start <= 256, "a sprite tábla túlcsordult egy oldalon"
```

**Viselkedés:**

- **Méret:** 0 bájt.
- Egy hamis állítás megszakítja az összeszerelést: `` `.assert end - start <=
  256` is false (value: 0). sprite tábla túlcsordult egy oldalon.``
- Egy olyan állítás, amely nem értékelhető ki (nincs definiált címke stb.),
  szintén sikertelen, a következő hibakóddal: *"nem értékelhető ki assembly
  időben"*.
- Az összehasonlítások eredményeként `1` / `0` címet kapunk; az `.assert` címet
  a programfolyamat bármely pontjára helyezzük el — a program a rajta lévő címen
  ellenőrzi, tehát az `.assert * < $D000` az aktuális kimeneti pozíciót
  teszteli.

**Példa – sprite adatok védelme az oldal átlépése ellen:**
```
* = $3000
sprite_data:
.byte $00, $00, $00 ; … 63 bájt …
sprite_data_end:
.assert sprite_data_end - sprite_data == 63, "a sprite-nak pontosan 63 bájtosnak kell lennie"
.assert (sprite_data % 64) == 0, "a sprite-nak 64 bájtosra kell igazítottnak lennie"
```

---

### KONST

Mint egy ** nevű változó, ami sosem változik** — `SCREEN = $0400`. Használd a
nevet a nyers címek begépelése helyett, így a kód könnyebben olvasható és később
módosítható.

| Érv      | Leírás                                                                                                                     |
| -------- | -------------------------------------------------------------------------------------------------------------------------- |
| Név      | A konstans azonosítója (pl. `SCREEN`)                                                                                      |
| Érték    | Numerikus érték a kiválasztott számrendszerben (pl. `0400` HEX = $0400 cím esetén), vagy PC-relatív kifejezés (lásd alább) |
| Formátum | HEX vagy DEC — az érték bevitelének és megjelenítésének módját szabályozza                                                 |

**Szintaxis:**
```
.const KÉPERNYŐ = $0400
.const KERETEK_1-EK = 60
```

**Generált kód:**
```
; .CONST SCREEN = $0400
```

**PC-relatív kifejezések (`*+N` / `*-N`):**

Az érték elfogadja az `*+N` vagy az `*-N` értékeket is, ahol az `*` maga az
`.const` sor címe. Ez egy elnevezett alias létrehozására szolgál egy bájthoz egy
közeli utasításon belül – a klasszikus önmódosító kódminta:

```
.const op = *+1 ; op → a következő LDA közvetlen operandusának címe
LDA #$00 ; A $00 futásidőben kerül javításra
...
STA op ; felülírja a #$00 bájtot → az LDA legközelebb az új értéket olvassa
```

A CONST 0 bájtot bocsát ki; a címke fordítási időben `aktuális_cím + 1`-re van
feloldva.

**Számtani kifejezések:**

Az érték általános aritmetikai műveleteket fogad el, beleértve a korábban
definiált CONST nevekre, hex/bináris literálokra és beépített matematikai
függvényekre való hivatkozásokat is:

```
.const SCREEN = $0400
.const SCREEN_END = SCREEN + 40*25 ; 1000 bájttal később
.const COLOR_RAM = $D800
.const MID_X = 160
.const SIN_TABLE = round(sin(PI/8) * 127) ; előre kiszámított szinuszérték
```

**Beépített függvények:** `sin()`, `cos()`, `round()`, `max(a,b)`, `min(a,b)`,
`abs()`, konstans `PI`

Operátorok: `+ - * /` Literálok: `$FF` (hex), `%10110000` (bináris)
Alacsony/magas bájt: `lo(kifejezés)`, `hi(kifejezés)`

**Méret:** 0 bájt.

---

### VAR

Mint az **CONST, de automatikusan lefoglalt** — Az `VAR` lefoglalja a nulla
oldalas tárhelyet egy címkének anélkül, hogy be kellene gépelni a címet.
Használja számlálókhoz, mutatókhoz és a ZP-be tartozó rövid életű állapotokhoz.

| Érv                | Leírás                                                       |
| ------------------ | ------------------------------------------------------------ |
| Név                | Változó neve / címkéje                                       |
| Méret (opcionális) | A lefoglalandó bájtok száma. Egyetlen bájt esetén hagyja ki. |

**Szintaxis:**
```
.var számláló
.var időzítő, 2
.var él
```

**Gyakorlati példa:**
```
.region Vars
.var számláló
.var időzítő, 2
.endregion

LDA #$00
STA számláló
```

**Generált kód:**
```
; .var számláló
```

**Méret:** 1 bájt alapértelmezés szerint, vagy `N` bájt, ha a méret meg van
adva.

A lefoglaló végigsétál egy konfigurálható nulla oldalas kurzoron (`$02` -
`$FE`), és hozzárendeli a következő szabad helyet. Ha a kért régió átfedésben
van egy már használt címkével, a fordító figyelmeztetést ad.

---

### Futásidejű IF / ELSE / ENDIF

Mint egy **egy igazi elágazási sablon** — ez a verzió futásidőben működik, nem
fordítási időben. Összehasonlítja az `A`, `X` vagy `Y` értékeket egy azonnali
értékkel, és kiadja a helyes `CMP` / `CPX` / `CPY` + elágazási szekvenciát.

| Érv           | Leírás                                       |
| ------------- | -------------------------------------------- |
| Nyilvántartás | `A`, `X` vagy `Y`                            |
| Operátor      | `==`, `!=`, `<`, `<=`, `>`, `>=` |
| Érték         | Azonnali érték HEX vagy DEC formátumban      |

**Szintaxis:**
```
.ha A == #$10
LDA #$07
.else
LDA #$0F
.endif
```

**Méret:** A kiválasztott ágaktól és az összehasonlítási űrlaptól függ.

Az összehasonlítás alapértelmezés szerint előjel nélküli. Az `<=` és az
`>` esetén a makró a kiválasztott regiszterhez tartozó legrövidebb ekvivalens
elágazási láncra bővül.

---

### MÍG / VÉGE

Mint egy **futásidejű ciklus tetején egy teszttel** — a törzs addig fut, amíg a
feltétel igaz marad.

| Érv           | Leírás                                       |
| ------------- | -------------------------------------------- |
| Nyilvántartás | `A`, `X` vagy `Y`                            |
| Operátor      | `==`, `!=`, `<`, `<=`, `>`, `>=` |
| Érték         | Azonnali érték HEX vagy DEC formátumban      |

**Szintaxis:**
```
.while A != #$00 JSR getchar
.endw
```

**Méret:** A ciklus törzsétől és az összehasonlítás formájától függ.

Használd az `WHILE` függvényt, ha a ciklus az első iteráció befejezése előtt
véget érhet. Ez a számlálóalapú `LOOP / NEXT` segédfüggvény futásidejű
megfelelője.

---

### ISMÉTELD / AMÍG

Mint egy **futásidejű ciklus alul egy teszttel** — a törzs mindig lefut legalább
egyszer, majd a feltétel eldönti, hogy leálljon-e.

| Érv           | Leírás                                       |
| ------------- | -------------------------------------------- |
| Nyilvántartás | `A`, `X` vagy `Y`                            |
| Operátor      | `==`, `!=`, `<`, `<=`, `>`, `>=` |
| Érték         | Azonnali érték HEX vagy DEC formátumban      |

**Szintaxis:**
```
.repeat
JSR getchar
.until A == #$00
```

**Méret:** A ciklus törzsétől és az összehasonlítás formájától függ.

Használd az `REPEAT / UNTIL` függvényt, ha azt szeretnéd, hogy a törzs legalább
egyszer lefusson a kilépési ellenőrzés előtt.

---

### MEMCPY / MEMSET

Mint a(z) **kis memóriarutinok, amelyekhez folyamatosan nyúlsz** — a(z) `MEMCPY`
egy összefüggő blokkot másol, a(z) `MEMSET` pedig egy tartományt tölt ki
egyetlen bájttal.

| Makró    | érvek                    |
| -------- | ------------------------ |
| `MEMCPY` | `forrás`, `dst`, `méret` |
| `MEMSET` | `cím`, `érték`, `méret`  |

**Szintaxis:**
```
.memcpy forrás=$C000, dst=$D000, méret=$0100
.memset cím=$0400, érték=#$20, méret=$03E8
```

**Generált kód:** beágyazott másolási/kitöltési ciklusok, a kért méretnek
megfelelően kiválasztva.

A legfeljebb 256 bájtos méretek egy rövid, 8 bites ciklust használnak. Nagyobb
méretek esetén automatikusan 16 bites számlálóra váltanak.

> **2.1:** a méretet a kód elkészítésekor ismerni kell – ez lehet egy szám vagy
> egy konstans. Egy később definiált címke (amelynek értékét az elrendezés még
> nem ismeri) hiba, nem pedig olyan kód, amely nem illik a helyére.

---

### NYOMTATÁS / NYOMTATÁSI_KARKOLAT / NYOMTATÁSI_HEX / KÉPERNYŐ_TÖRLÉSE / VÁRAKOZÁSI_KULCS / KÉSLELTETÉS / SZEGÉLY BEÁLLÍTÁSA / SZEGÉLY BEÁLLÍTÁSA

#### NYOMTATÁS

Mint a **PETSCII kimenet a sablon nélkül** — egy karakterláncot nyomtat ki a
`CHROUT` függvénnyel ugyanazzal a nagybetűs/kisbetűs kezeléssel (`lower`), mint
a `.petscii`.

**Szintaxis:**
```
.print "SZIA"
.print "szia", alsó
```

#### NYOMTATÁSI KARAKTER

Kiír egy PETSCII bájtot numerikus kódként, és elküldi azt a `CHROUT` metóduson
keresztül. Az érték lehet egy elnevezett konstans vagy címke is, amely
összeszereléskor bájtra oldódik fel.

**Szintaxis:**
```
.print_char 65
.print_char $41
.print_char szín
```

#### NYOMTATÁS_HEX

Egy 8 bites értéket nyomtat ki hexadecimális szövegként a normál KERNAL kimeneti
útvonalon keresztül.

**Szintaxis:**
```
.print_hex A
```

#### TÖRLŐ_KÉPERNYŐ

A szabványos C64 képernyős vezérlőkód gyorsbillentyűje.

**Szintaxis:**
```
.clear_screen
```

#### VÁRAKOZÁSI KULCS

Megvárja, amíg lenyomnak egy billentyűt, így nem kell minden alkalommal kézzel
futtatni a `GETIN` ciklust.

**Szintaxis:**
```
.wait_key
```

#### KÉSLELTETÉS

Egy megosztott segítőrutinon keresztül megvárja a kért számú képkockát. Ezt
rövid szünetekhez és időzítési hézagokhoz használjuk, amikor egy teljes egyéni
ciklus túlzás lenne. A képkockaszám lehet nyers szám vagy egy elnevezett
konstans, és az `.wait` csak az `.delay` álneve.

**Szintaxis:**
```
.delay 29
.wait 29
.delay képkockák=KÉPKOCKA_1S
```

#### SET_BORDER / SET_BORDER

Kényelmi burkolók a VIC-II színregiszterekhez. A színérték lehet nyers szám vagy
egy elnevezett konstans, amely 0–15-re oldódik fel.

**Szintaxis:**
```
.set_border 6
.set_bg 0
.set_border szín
.set_bg szín
```

**Méret:** Minden segítő egy apró regiszterírási szekvenciává vagy egy rövid
KERNAL hívássá bővül.

---

### IRQ_SETUP

Egyetlen lépésben beállít egy raszteres IRQ kezelőt. A makró kiírja az IRQ
vektort, engedélyezi a raszteres IRQ-kat, beállítja a vonalat, letiltja a
gyakori CIA IRQ forrásokat, és a `CLI` paranccsal visszatér a normál
végrehajtáshoz.

| Érv     | Leírás                                                            |
| ------- | ----------------------------------------------------------------- |
| Kezelő  | IRQ rutin címkéje (pl. `my_irq`)                                  |
| Raszter | Raszteres vonal hexadecimális vagy decimális formában (pl. `$FA`) |

**Szintaxis:**
```
.irq_setup kezelő=my_irq, raszter=$FA
```

**Méret:** Egy rövid beállítási sorozat; a pontos hossz a kiválasztott
rasztervonaltól függ.

Ezt akkor használd, ha a megszokott "SEI / telepítéskezelő / IRQ engedélyezése /
CLI" sablont szeretnéd használni anélkül, hogy szétszórnád a programban.

---

### RAND

Mint egy apró, beépített PRNG, az ** — egy 8 bites pszeudovéletlenszerű értéket
ad vissza egy kompakt nulla oldalas kezdőértékből.

| Érv | Leírás                                                                 |
| --- | ---------------------------------------------------------------------- |
| Mag | Opcionális nulla oldalas kezdőbájt vagy címke (alapértelmezett: `$FB`) |

**Szintaxis:**
```
.rand
```

**Méret:** Néhány bájt, a választott megvalósítási útvonaltól függően.

A generátor játékmenetre, effektvariációkra és gyors tesztadatokra készült.
Szándékosan kicsi, nem pedig kriptográfiailag bonyolult.

---

<a id="sprite_init"></a>
### SPRITE_INIT

Beállít egy VIC-II sprite-ot egyetlen sorban — a BASIC-ben körülbelül 6 POKE
utasítás írása helyett. Beállítja a sprite adatmutatóját, bekapcsolja azt,
opcionálisan engedélyezi a többszínű módot, és beállítja a színét.

| Érv       | Leírás                                                                |
| --------- | --------------------------------------------------------------------- |
| Sprite #  | Sprite-szám 0–7                                                       |
| Szín      | Színindex 0–15 (C64 paletta)                                          |
| Adatoldal | Sprite adatcím / 64 (pl. `$21`, ha az adat a `$0840` címen található) |
| Sokszínű  | Be-/kikapcsolja a sprite többszínű bitjét (`$D01C`)                   |

**Szintaxis:**
```
.sprite_init 0, 7, $21
.sprite_init 0, 7, $21, többszínű
.sprite_init 0, 7, $21, egyszínű
```

**Generált kód:**
```
LDA #$21
STA $07F8 ; sprite pointer regiszter ($07F8 + N)
LDA $D015
ORA #$01 ; sprite 0 engedélyező bitjének beállítása
STA $D015
LDA $D01C
ÉS #$FE ; sprite 0 többszínű bitjének törlése
STA $D01C
LDA #$07
STA $D027 ; sprite 0 színregiszter
```

**Méret:** 26 bájt.

> **Sprite adatlap:** `adat_cím ÷ 64`. Az alapértelmezett BASIC SYS csonkkal, az
> `ALIGN 64` parancs a `JMP main` után a sprite adatokat az `$0840` helyre
> helyezi → oldal = `$21`.

---

<a id="sprite_pos"></a>
### SPRITE_POS

Mint a BASIC-ben a **`POKE 53248, x : POKE 53249, y`** — beállítja egy sprite
kezdőpozícióját. A koordináták az összeszereléskor kerülnek beillesztésre és
konstansokat fogadnak el; animációhoz használd az `INC`/`DEC` metódust
közvetlenül a sprite regiszteren.

| Érv      | Leírás                   |
| -------- | ------------------------ |
| Sprite # | Sprite-szám 0–7          |
| X        | Vízszintes pozíció 0–319 |
| Y        | Függőleges pozíció 0–255 |

**Szintaxis:**
```
.sprite_pos 0, 152, 100
```

**Generált kód (példa: sprite 0, X=152, Y=100):**
```
LDA #$98 ; X alsó bájt
STA $D000 ; sprite 0 X regiszter
LDA $D010
ÉS #$FE ; X MSB törlése a 0. sprite számára (X ≤ 255)
STA $D010
LDA #$64 ; Y = 100
STA $D001 ; sprite 0 Y regiszter
```

X > 255 esetén a makró a megfelelő bitet az `$D010` mappában törli, ahelyett,
hogy törölné azt.

**Méret:** 18 bájt.

> **Megjegyzés:** A `SPRITE_POS` függvény beépíti az X/Y koordinátákat a kódba
> (`LDA #$xx`). Sprite futásidejű animálásához használd az `INC $D000` / `DEC
> $D000` parancsot — lásd a `sprite-macro-demo` példát.

---

<a id="wait_raster"></a>
### WAIT_RASZTER

Megvárja, amíg a VIC-II elektronnyaláb eléri a megadott pásztázási vonalat –
mintha egy tévéképernyő képkockájához szinkronizálna. Tedd ezt a játék
ciklusának elejére, hogy megakadályozd a sprite-ok szakadását. Nincs szükség
JSR-re, nincs szükség címkére.

| Érv             | Leírás                                                    |
| --------------- | --------------------------------------------------------- |
| Raszteres vonal | Cél raszteres vonal hexadecimálisan (pl. `FF` = 255. sor) |

**Szintaxis:**
```
.wait_raster $FF
```

**Generált kód:**
```
várj:
LDA $D012 ; aktuális raszter sor
CMP #$FF ; cél sor
BNE várj ; vissza ciklus (-7 bájt)
```

**Méret:** 7 bájt (a `BNE` eltolás `$F9` = −7 mindig az `LDA`-re mutat vissza).

> **Tipp:** Helyezd el a `WAIT_RASTER` elemet a játék ciklusának tetejére, hogy
> szinkronizálódjon a kijelzővel és elkerüld a sprite-ok szakadását.

---

### JOYSTICK

Mintha a **`PEEK($DC00)`** parancsot olvasná be, majd a sprite pozícióját
POKE-olná – de egy sorban. Egy CIA joystick portot olvas be, és ennek
megfelelően állítja be a sprite X/Y regisztereit. Teljesen inline, nincs szükség
JSR-re.

| Érv      | Leírás                                                                 |
| -------- | ---------------------------------------------------------------------- |
| Kikötő   | `1` = 1-es port (`$DC01`) vagy `2` = 2-es port (`$DC00`)               |
| Sprite # | Sprite szám 0–7 (azt vezérli, hogy melyik X/Y regiszterpár frissüljön) |

**Szintaxis:**
```
.joystick 2, 0
```

**Generált kód (2. port, 0. sprite):**
```
LDA $DC00 ; CIA 2. port olvasása
LSR ; 0. bit → átvitel (Fel)
BCS skip_up ; átvitel beállítva = NINCS lenyomva
DEC $D001 ; Y−1 (felfelé mozgatás)
skip_up:
LSR ; 1. bit → átvitel (Le)
BCS skip_down
INC $D001 ; Y+1 (lefelé mozgatás)
skip_down:
LSR ; 2. bit → átvitel (Balra)
BCS skip_left
DEC $D000 ; X−1 (balra mozgatás)
skip_left:
LSR ; 3. bit → átvitel (Jobbra)
BCS skip_right
INC $D000 ; X+1 (jobbra mozgatás)
skip_right:
```

**Joystick bittérkép (aktív-LOW — a 0 bit azt jelenti, hogy lenyomva):**

| Bit | Irány  | CIA-nyilvántartás                     |
| --- | ------ | ------------------------------------- |
| 0   | Fel    | $DC00 (2-es port) / $DC01 (1-es port) |
| 1   | Le     |                                       |
| 2   | Balra  |                                       |
| 3   | Jobbra |                                       |
| 4   | Tűz    | (ez a makró nem kezeli)               |

**Méret:** 27 bájt. Az `BCS` eltolás mindig `+3` (kihagyja a következő 3 bájtos
`DEC`/`INC abs` utasítást).

**Változó mód — `.joystick port, vx, vy[, fire]`:** sprite mozgatása helyett az
irányt változókba írjuk: `vx` / `vy` = `-1` / `0` / `+1` (`$FF` / `$00` /
`$01`), és az opcionális `fire` = `1`, miközben a gomb le van nyomva, `0`
egyébként. Használd görgetős kamerához, saját fizikával rendelkező lejátszóhoz
vagy menükhöz. A `3` port egyszerre olvassa mindkét joystick portot (`LDA $DC00`
/ `ÉS $DC01`), így bármelyik port működik.

```
.joystick 2, vx, vy ; 35 bájt
.joystick 3, vx, vy, fire ; mindkét port + fire: 45 bájt
```

> **Tipikus használat:** Elhelyezzük egy `gameloop` címkén belül, először a
> `WAIT_RASTER` címkével:
> ```
> játékmenet:
> WAIT_RASTER ($FF)
> JOYSTICK (port=2, sprite=0)
> JMP játékmenet
> ```

---

<a id="mouse"></a>

> **2.1:** a portot ismerni kell a kód írásakor (egy szám vagy egy konstans),
> mivel a 3-as port 3 bájttal hosszabbá teszi a kódot; egy később definiált
> címke hibát jelent.
### EGÉR

Commodore 1351 proporcionális egér adatait olvassa és egy sprite-ot mozgat.
Teljesen **inline** — nincs szükség JSR-re vagy címkére. A makró kiválasztja a
CIA portot, megvárja, amíg a SID lapát bemenetek leülepednek, majd dekódolja a
delta mozgást a szabványos 1351-es illesztőprogram-minta segítségével, és
alkalmazza azt a sprite regiszterekre.

| Érv       | Leírás                                                            |
| --------- | ----------------------------------------------------------------- |
| Kikötő    | `1` = CIA `$DC00` bit `7:6` = `%01`; `2` = `%10`                  |
| Sprite #  | Sprite-szám 0–7                                                   |
| ZP bájt X | Nulla oldalas cím (hex) az előző POTX minta tárolására (pl. `FD`) |
| ZP bájt Y | Nulla oldalas cím (hex) az előző POTY minta tárolására (pl. `FE`) |

**Generált kód alakzat (1. port, 0. sprite, ZP `$FD`/`$FE`):**

```
; CIA port kiválasztás + kiegyenlítés
LDA $DC00
ÉS #$3F
ORA #$40
STA $DC00
LDX #$67
várakozás:
DEX
BNE várakozás

; X tengely — szabványos 1351-es stílusú 7 bites delta dekódolás
LDA $D419
TAY
SEC SBC $FD ÉS #$7F LDX #$00 CMP #$40 BCS xneg LSR A BEQ xdone STY $FD CLC ADC $D000 STA $D000 TXA ADC #$00 ÉS #$01 BEQ xdone LDA $D010 EOR #$01 STA $D010 JMP xdone
xneg: ORA #$C0 CMP #$FF BEQ xdone SEC ROR DEX STY $FD CLC ADC $D000 STA $D000 TXA ADC #$00 ÉS #$01 BEQ xdone LDA $D010 EOR #$01 STA $D010
xdone:

; Y tengely — ugyanaz a dekódolás, majd alkalmazás előtt invertálva
LDA $D41A
TAX SEC SBC $FE
ÉS #$7F CMP #$40
BCS yneg LSR A BEQ ydone STX $FE EOR #$FF SEC ADC $D001
STA $D001
JMP ydone
yneg:
ORA #$C0
CMP #$FF BEQ ydone SEC ROR STX $FE EOR #$FF SEC ADC $D001
STA $D001
ydone:
```

**Méret:** 142 bájt.

**Szintaxis:**
```
.mouse port, spriteNum, zpX, zpY
; példa:
.mouse 2, 0, FD, FE
```

> **Fontos:** Az első hívás előtt inicializálja a nulla oldalas bájtokat az
> aktuális POTX/POTY értékekkel, hogy elkerülje az ugrást az első képkockánál:
> ```
> ; 1. port: LDA $DC00 : ÉS #$3F : ORA #$40 : STA $DC00
> ; 2. port: LDA $DC00 : ÉS #$3F : ORA #$80 : STA $DC00
> LDA $D419 : LSR A : ÉS #$3F : STA $FD
> LDA $D41A : LSR A : ÉS #$3F : STA $FE
> ```

> **Tipp:** Az egér lekérdezése képkockánként egyszer szükséges — a játék
> ciklusában a `WAIT_RASTER` elemet a `MOUSE` elé kell helyezni.

---

<a id="sprite_col"></a>
### SPRITE_COL

Mint a BASIC-ben lévő **`PEEK($D01E)`** — ellenőrzi a VIC-II hardveres ütközési
regisztereket, és megmondja, hogy egy sprite egy másik sprite-ba vagy a háttérbe
ütközött-e. Teljesen inline, nincs szükség JSR-re.

| Érv            | Leírás                                                                                                         |
| -------------- | -------------------------------------------------------------------------------------------------------------- |
| Sprite #       | Sprite szám 0–7 (melyik sprite bitjét kell ellenőrizni)                                                        |
| Ütközés típusa | `Sprite-Sprite ($D01E)` — ütközés egy másik sprite-tal; `Sprite-Background ($D01F)` — ütközés háttérgrafikával |

**Szintaxis:**
```
.sprite_col 0, sprite
.sprite_col 0, háttér
```

**Generált kód (sprite 0, sprite–sprite):**
```
LDA $D01E ; sprite-sprite ütközési regiszter olvasása (törli!)
ÉS #$01 ; 0. bit elkülönítése (sprite 0)
; A ≠ 0 → ütközés történt
```

**Méret:** 5 bájt.

> **Fontos:** A(z) `$D01E`/`$D01F` ** beolvasása törli a(z)** regisztert. Olvasd
> be képkockánként egyszer, és azonnal reagálj az eredményre a(z) `BEQ`/`BNE`
> paranccsal.

**Tipikus használat:**
```
gameloop:
.wait_raster $FF
.joystick 2, 0
.sprite_col 0, sprite
BEQ no_hit ; A = 0 → nincs ütközés
LDA #$02
STA $D020 ; piros szegély = találat!
JMP gameloop
no_hit:
LDA #$0E
STA $D020 ; világoskék szegély = üres
JMP gameloop
```

> **Lásd még:** `ütközés-demó` példa — zöld golyó (sprite #0) vs. piros kereszt
> (sprite #1).

---

### FÁJL BETÖLTÉSE

Mint a BASIC-ben a **`LOAD "fájl",8`** — futásidőben betölt egy fájlt egy D64
lemezről a KERNAL LOAD rutin használatával. Ezzel adatokat, zenét vagy extra
kódot tölthet be lemezről a program futása közben.

| Érv                         | Leírás                                                                                                                                                                                                                  |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fájlnév                     | Fájlnév a lemezen (maximum 16 karakter, automatikus nagybetűs írásmód; a következő karakterek szűrve: `,`, `"`, `/`, `\`, `:`, `*`, `?`, `<`, `>`, `|`)                                                           |
| Eszköz                      | Eszközszám 8–30 (alapértelmezett: `8`)                                                                                                                                                                                  |
| Cím felülírása (opcionális) | Hex betöltési cím (pl. `C000`). Ha be van állítva, a fájl erre a címre töltődik be (`sec=0`, figyelmen kívül hagyva a PRG fejlécet). Hagyja üresen, ha a fájl saját 2 bájtos PRG fejlécét szeretné használni (`sec=1`). |
| Hibacímke (opcionális)      | Ha be van állítva, a JSR LOAD után egy `BCS` utasítás generálódik. Ha a KERNAL carry set (hiba) értékkel tér vissza, a végrehajtás erre a címkére ugrik.                                                                |

**Szintaxis:**
```
.loadfile "DEMÓ-SZÍNEK", 8
.loadfile "DEMÓ-SZÍNEK", 8, $C000
.loadfile "DEMÓ-SZÍNEK", 8, $C000, hiba_címke
```

**Generált kódstruktúra:**
```
JMP skip_filename ; ugrás a soron belüli fájlnév fölé
.byte "DEMO-COLORS" ; fájlnév bájtokban (PETSCII, 11 karakter)
skip_filename:
LDA #11 ; fájlnév hossza
LDX #<fname ; pointer lo
LDY #>fname ; pointer hi
JSR $FFBD ; SETNAM
LDA #1 ; logikai fájl #1
LDX #8 ; eszköz 8
LDY #0 ; sec=0 (cím felülbírálása) vagy #1 (a fájl saját címe)
JSR $FFBA ; SETLFS
LDA #0 ; LOAD parancs (nem VERIFY)
JSR $FFD5 ; LOAD BCS hiba ; (csak ha a hibacímke be van állítva)
```

**Méret:** `3 + fájlnév_hossz + 9 (SETNAM) + 9 (SETLFS) + (4 felülbírálás
esetén) + 5 (BETÖLTÉS) + (2 hibacímke esetén)` bájt. Minimum 27 bájt.

> **Fontos:** A fájlnév a gépi kódban, közvetlenül egy `JMP skip_filename` után
> tárolódik. A lemezen lévő fájlnévnek nagybetűs PETSCII-nek kell lennie – ami
> megegyezik a sima ASCII nagybetűkkel (`A`–`Z`). A makró ezt automatikusan
> kikényszeríti.

> **Éles programok esetén mindig használj hibakódot** — ha a fájl nem található,
> a KERNAL beállítja az átvitel jelzőt, és a végrehajtás a következőre hárul.

> **Lásd még:** `loadfile-demo` példa — bemutatja a `DEMO-COLORS.PRG` betöltését
> egy D64-ből egy BCS hibaággal és egy vizuális hibaképernyővel.

---

### EXODECRUNCH

Programon belüli **Exomizer kicsomagolás**. Ezt a makrót közvetlenül egy
`LOADFILE` után használjuk, amely egy Exomizer `mem` módú tömörített
adatfolyamot töltött be — az EXODECRUNCH visszafelé kicsomagolja azt a
adatfolyamba beágyazott címre.

| Érv           | Leírás                                                                                                                    |
| ------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Depakoló címe | A kicsomagoló kód memóriában való tárolásának helye (alapértelmezett: `B000`). 16 bites hexadecimális címnek kell lennie. |

**Szintaxis:**
```
.exodecrunch
.exodecrunch kicsomagoló=$B000
```

**Generált kód (19 bájt):**
```
LDA $AE ; KERNAL betöltés-vég alsó (az előző LOAD által beállítva)
STA $04 ; kicsomagoló forrás-vég mutató alsó (lo)
LDA $AF ; KERNAL betöltés-vég felső (hi)
STA $05 ; kicsomagoló forrás-vég mutató felső (hi)
LDA #$36 ; BASIC ROM kikapcsolva ($A000-$BFFF RAM-má válik)
STA $01
JSR kicsomagoló ; kicsomagoló hátulról előre olvas $04/$05-ön keresztül
LDA #$37 ; alapértelmezett leképezés visszaállítása (BASIC + KERNAL + I/O)
STA $01
```

**Hogyan működik:**

1. A KERNAL `LOAD` ($FFD5) frissíti a ZP `$AE/$AF` fájlokat, hogy eggyel a
   legutóbb betöltött bájt után mutasson. Az EXODECRUNCH ezt átmásolja a ZP
   `$04/$05` fájlokba, ami az Exomizer hivatalos visszafelé forrás-vég
   konvenciója.
2. A kicsomagoló jellemzően az `$B000` címen található (a BASIC ROM leképezett
   régióján belül). A makró átváltja az `$01 = $36` értéket, így a CPU a JSR
   során ott látja a RAM-ot, majd utána visszaállítja az `$01 = $37` értéket.
3. A kicsomagolási célcím **kódolású ** magába a tömörített adatfolyamba kerül,
   amikor az `exomizer mem -l <load> file,<target>` paranccsal tömöríted — a
   kicsomagoló a folyam első bájtjaiból olvassa be.

**Depacker bináris:** Az előre elkészített visszafelé irányuló kicsomagoló fájl
neve `exo-decrunch.bin` (a C64 Visual Assembler `samples/` mappájában) (477
bájt, ORG $B000). Ez a hivatalos `exodecrunch.asm` fájl Kick Assembler
csomagolása, amelyben minden olvasásnál `INC $D020` címke látható
szegélyvillanás effektet eredményez a kicsomagolás során. Helyezd el a
programodban a `.incbin` címmel a kicsomagoló címen.

**Nyers bemenet:** az extra nyers fájlként kerül átadásra az Exomizernek a Dst
címre (`file@<Dst>`) betöltve, így a kicsomagoló minden bájtot, az elsővel
kezdve, pontosan a beírt címre ír.

> **Lásd még:** az `exo-multicolor-demo` példa — teljes, végponttól végpontig
> tartó példa: TÖLTSÖN be egy tömörített többszínű bitképet $C000-re, az
> EXODECRUNCH kicsomagolja $2000-re, majd másolja a képernyőt → $0400 és a színt
> → $D800, és kapcsolja a VIC-II-t többszínű bitkép módba.

---

### REU_CHECK

Észleli, hogy van-e Commodore RAM bővítőegység (REU) csatlakoztatva – mintha a
`PEEK($D010)` regisztert ellenőrizné a hardver meglétének megállapítására. Két
minta `$DF04` REU regiszterbe való visszaírásával és visszaolvasásával teszteli.

| Érv       | Leírás                |
| --------- | --------------------- |
| Egyik sem | Nincsenek operandusok |

**Generált kód (34 bájt):**
```
LDA #55 $
STA $DF04
LDA 04 USD
CMP #55
BNE sikertelen
LDA #$AA
STA $DF04
LDA 04 USD
CMP #$AA
BNE sikertelen
LDA #$00
CMP #$FF ; Z=0 => REU jelen van
BNE kész
sikertelen:
LDA #$FF
CMP #$FF ; Z=1 => nincs REU
kész:
```
> A makró normalizálja az eredményt, így a következő ág egyszerű marad: az `BNE`
> REU jelenlétét, az `BEQ` hiányzó REU-t jelent.

**Szintaxis:**
```
.reu_check
```

**Eredmény a jelzőkben:**
- **Z = 0** (eredmény ≠ 0) → REU jelen → `BNE` használata
- **Z = 1** (eredmény = 0) → nincs REU → használja az `BEQ`

**Nincsenek argumentumok** — a makró minden alkalommal ugyanazt a kódot
generálja.

**Tipikus használat:**
```assembly
.reu_check
BEQ no_reu ; hagyja ki, ha a REU nincs jelen
; ... REU kód itt ...
no_reu:
```

---

### REU_STASH / REU_FETCH / REU_SWAP

DMA blokkátvitel C64 RAM és REU bővítőmemória között – mint egy nagyon gyors
POKE ciklus, de a CPU nem végez semmilyen munkát (a REU chip másolja az
adatokat, miközben a CPU áll). Egy `$1000` bájtos átvitel gyakorlatilag
azonnali.

| Makró       | Irány         | `$DF01` parancs |
| ----------- | ------------- | --------------- |
| `REU_STASH` | C64 RAM → REU | `$90`           |
| `REU_FETCH` | REU → C64 RAM | `$91`           |
| `REU_SWAP`  | C64 RAM ↔ REU | `$92`           |

**Argumentumok:**

| Érv      | Leírás                                | Példa  |
| -------- | ------------------------------------- | ------ |
| C64 cím  | Forrás/cél a C64 RAM-ban (hex)        | `C000` |
| REU-cím  | Forrás/cél REU-ban (hex, 16 bites)    | `0000` |
| REU bank | REU memóriabank (0–7)                 | `0`    |
| Hossz    | Átviendő bájtok száma (hex, 16 bites) | `1000` |

**Szintaxis:**
```
.reu_stash $C000, $0000, 0, $1000
.reu_fetch $C000, $0000, 0, $1000
.reu_swap $C000, $0000, 0, $1000
```

**Generált kód (40 bájt):**
```
LDA #c64lo STA $DF02 ; C64 cím LO
LDA #c64hi STA $DF03 ; C64 cím HI
LDA #reuLo STA $DF04 ; REU cím LO
LDA #reuHi STA $DF05 ; REU cím HI
LDA #bank STA $DF06 ; REU bank
LDA #lenLo STA $DF07 ; hossz LO
LDA #lenHi STA $DF08 ; hossz HI
LDA #$00 STA $DF09 ; címvezérlés (rögzített)
LDA #$00 STA $DF0A ; megszakításmaszk (rögzített)
LDA #cmd STA $DF01 ; DMA végrehajtása ($90/$91/$92 = stash/fetch/swap, azonnal)
```

> **Megjegyzés:** A parancsok az `$90/$91/$92` címeket használják (a 4. bit
> beállítása = azonnali DMA mód). Az `$DF01` címre írás elindítja az átvitelt; a
> CPU a befejezés után folytatja a munkát.

---

### TURBÓ_BEÁLLÍTÁS

Beállítja az **Ultimate-64 (U64) CPU sebességét** a `$D031` regiszteren
keresztül. Nincs hatással egy valódi C64-re vagy más emulátorokra.

**Argumentumok:**

| Érv         | Leírás               | Hatótávolság                                         |
| ----------- | -------------------- | ---------------------------------------------------- |
| Sebesség    | CPU sebességindex    | 0 = 1 MHz … 7 ≈ 10 MHz … 15 ≈ 48 MHz                 |
| Rossz vonal | Rossz vonal emuláció | Engedélyezett (C64 kompatibilis) / Letiltott (turbó) |

A sebességbájt kiszámítása a következőképpen történik: `(speedIndex & 0x0F)
| (badline_disabled ? 0x80 : 0x00)`.

**Generált kód (5 bájt):**
```
A9 xx LDA #speed_byte
8D 31 D0 STA 031 USD
```

**Szintaxis:**
```
.turbo_set 7,0 ; sebesség=7 (~10 MHz), rossz vonal engedélyezve
.turbo_set 15,1 ; sebesség=15 (~48 MHz), rossz vonal letiltva
```

> **Megjegyzés:** Ez a makró csak az U64 hardvert érinti. Egy valódi C64-en vagy
> más emulátorokon ez a `$D031` fájlba ír, ami befolyásolhatja a CIA-t, vagy
> figyelmen kívül hagyható.

---

### SUPERCPU_DETECT

Ellenőrzi, hogy van-e telepítve **CMD SuperCPU** gyorsító — például
`PEEK($D0B8)` —, hogy a `$FF`-től eltérő értéket ad-e vissza.

**Generált kód (5 bájt):**
```
AD B8 D0 LDA $D0B8
C9 FF CMP #$FF
```

**Eredmény a jelzőkben:**
- **Z = 0** → SuperCPU jelen → `BNE` használata
- **Z = 1** → Nem található SuperCPU → használja az `BEQ` függvényt

**Nincsenek argumentumok.**

**Szintaxis:**
```
.supercpu_detect
```

**Tipikus használat:**
```assembly
.supercpu_detect
BEQ no_scpu ; kihagyja, ha nincs jelen SuperCPU
; ... SuperCPU turbó kód itt ...
no_scpu:
```

---

### TURBO_ENGEDÉLYEZÉS

Be- vagy kikapcsolja a(z) **CMD SuperCPU turbó módot**. Először hívja meg a(z)
`SUPERCPU_DETECT` függvényt, és hagyja ki ezt, ha a SuperCPU nincs jelen.

| Mód          | Nyilvántartás | Hatás                                         |
| ------------ | ------------- | --------------------------------------------- |
| Engedélyezés | `$D07A`       | Turbó bekapcsolása (akár 20 MHz SuperCPU-val) |
| Letiltás     | `$D07B`       | Visszatérés 1 MHz-es kompatibilitási módba    |

**Generált kód (5 bájt):**
```
A9 00 LDA #$00
8D 7A D0 STA $D07A ; (vagy $07B a letiltáshoz)
```

**Szintaxis:**
```
.turbo_enable be
.turbo_enable ki
```

> **Megjegyzés:** Először hívd meg a `SUPERCPU_DETECT` makrót, és ha a SuperCPU
> nincs jelen, akkor e makró körül ágazz el.

---

<a id="map_copy"></a>
### MAP_COPY

Egy forráscímről egy tilemap-et másol a képernyő RAM-ba (és opcionálisan a szín
RAM-ba) `LDA abs,X` / `STA abs,X` ciklusok sorozatát használva. Ciklusonként egy
256 bájtos oldal másolódik; egy részleges oldal a végén a `CPX #rem / BNE`
paranccsal állítja le. Nincs szükség JSR-re — az összes kód inline generálódik.

| Érv                  | Leírás                                                                                                                                                                                                                                      |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Forráscím (képernyő) | A térképadatok betöltés utáni helyének hexadecimális címe (pl. `C000`)                                                                                                                                                                      |
| Képernyő RAM cél     | Hová másolja a képernyőkódokat (pl. `0400`)                                                                                                                                                                                                 |
| Méret (bájt)         | Másolandó bájtok száma összesen — jellemzően `$03E8` = 1000 (40×25 karakter)                                                                                                                                                                |
| Színforrás           | `auto`: a színadatok a képernyőkódokat követik (`source + size`); vagy egy explicit színforráscímet. A színadatok a második menetben a szín RAM célhelyére másolódnak. Hagyja ki ezt (és a színcélhelyet) csak a képernyőkódok másolásához. |
| Színes RAM cél       | Színadatok célhelye — alapértelmezett `D800` (C64 színes RAM)                                                                                                                                                                               |

**Generált kód (1000 bájtos térkép, csak képernyő):**
```
LDX #$00
LDA $C000,X ; 0. oldal
STA $0400,X
INX BNE *-9 ; ciklusok, amíg X 0-ra nem kerül (256 ismétlés)
LDA $C100,X ; 1. oldal
STA $0500,X
INX BNE *-9
LDA $C200,X ; 2. oldal
STA $0600,X
INX BNE *-9
LDA $C300,X ; maradék — 232 bájt
STA $0700,X
INX CPX #$E8 BNE *-11
```

**Méret:** `2 (LDX) + teljesOldalak×9 + (rem > 0 ? 11 : 0)` bájt
szakaszonként. Kombinált módban ez megduplázódik (képernyőszakasz + azonos színű
szakasz).

**Párosítás a Térképszerkesztővel:**

A C64 Visual Assembler térképszerkesztője (**Térkép mentése + színRAM**)
egyetlen bináris fájlt exportál, ahol az első `size` bájtok képernyőkódok, a
következő `size` bájtok pedig színRAM-értékek. Használd a `.map_copy` fájlt, a
színforrás pedig `auto`, és a forráscím, ahová ez a fájl betöltődik (pl.
`.incbin` címen a `$C000` címen):

```
.incbin "map-color.bin", $C000 ; képernyőkódok $C000–$C3E7, szín $C3E8–$C7CF
; ...
.map_copy $C000, $0400, 1000, auto, $D800
```

**Szintaxis:**
```
.map_copy $C000, $0400, 1000; csak képernyő
.map_copy $C000, $0400, 1000, auto, $D800; kombinált (szín forrás+méret)
.map_copy $C000, $0400, 1000, $C3E8, $D800; explicit színforrás cím
```

---

<a id="map_copy16x16"></a>
### MAP_COPY16X16

Egy 16×16 karakteres területet másol ki egy kompakt, 256 bájtos
képernyőkód-blokkból, plusz egy hozzá illő 256 bájtos színes RAM-blokkot.
Charset Canvas exportokhoz és kis csempe/kép darabokhoz készült, ahol tizenhat
különálló MAP_COPY sor írása zajos lenne.

**Alapértelmezett elrendezés:**

| Adat                   | Alapértelmezett cím        |
| ---------------------- | -------------------------- |
| 16×16-os képernyőkódok | Forráscím (`src`)          |
| 16×16 színértékek      | `forrás + 256`             |
| Képernyő RAM célhelye  | `0400 $ + sor×40 + oszlop` |
| Színes RAM célhely     | `$D800 + sor×40 + oszlop`  |

**Szintaxis:**
```
.map_copy16x16 $3000, 12, 4
.map_copy16x16 $3000, 12, 4, $0400, $3100, $D800
```

A rövid űrlap a képernyőbájtokat az `$3000` oszlopból, a színbájtokat az `$3100`
oszlopból másolja, és a 16×16-os blokkot a 12. oszlop 4. sorába helyezi. Az
érvényes bal felső pozíciók a `col = 0..24` és az `row = 0..9`, így a teljes
16×16-os terület a 40×25-ös C64-es szövegképernyőn marad.

**Generált viselkedés:**

- Tizenhat beágyazott sormásolatot generál.
- Minden sor 16 képernyőbájtot és 16 színbájtot másol.
- Nincs szükség JSR-re; a kód közvetlenül a makró pozícióban kerül kibocsátásra.
- Normál karaktermóddal és többszínű karaktermóddal működik; a Szín RAM bájtjai
  tartalmazzák az egyes cellák karakterszín/többszínű engedélyezési bitjét.

Tipikus párosítás a Charset Canvas-szal:

```
* = 0801 USD
    SEI
    LDA #$00
    STA $D021
    LDA #$05
    STA $D022
    LDA #$0D
    STA $D023
    .map_copy16x16 3000 USD, 12, 4
hurok:
    JMP hurok

.incbin "16x16+ram+color.bin", 3000 USD
.incbin "16x16+charset.bin", 2000 USD
```

---

<a id="sprite_anim"></a>
### SPRITE_ANIM

Minden híváskor egy sprite animációs képkockát léptet előre, és frissíti a
VIC-II sprite adatmutatót. Képkockánként egy bájtot tároljon egy táblázatban (a
sprite adatlap száma = `adat_cím / 64`), mutasson rá a SPRITE_ANIM-mel, és
játékkockánként egyszer hívja meg – nincs szükség JSR-re.

| Érv             | Leírás                                                                                       |
| --------------- | -------------------------------------------------------------------------------------------- |
| Sprite #        | Sprite-szám 0–7                                                                              |
| Keretlista címe | A frame tábla hex címe — keretenként egy bájt, minden bájt = sprite oldal (`data_addr / 64`) |
| Képkockák száma | Képkockák száma összesen (1–255)                                                             |
| ZP keret        | Nulla oldalszámú bájt, amelyet keretszámlálóként használnak (pl. `FB`)                       |

**Generált kód (sprite 0, 4 képkocka, ZP `$FB`, lista a `$C100` pontban):**
```
INC $FB ; képkockaszámláló léptetése LDA $FB CMP #$04 ; képkockaszám BCC *+6 ; ha a számláló < a számláló, akkor kihagyja a visszaállítást LDA #$00 STA $FB TAX ; X = aktuális képkockaindex LDA $C100,X ; sprite adatlap betöltése ehhez a képkockához STA $07F8 ; sprite 0 mutató frissítése ($07F8 + sprite#)
```

**Méret:** 19 bájt.

**Tipikus használat:**
```
frameTable:
.byte $21, $22, $23, $24 ; 4 képkocka $0840, $0880, $08C0, $0900 értékeknél

gameloop:
.wait_raster $FF
.sprite_anim 0, $C100, 4, $FB
JMP gameloop
```

**Szintaxis:**
```
.sprite_anim spriteNum, frameListAddr, frameCount, zpByte
; példa:
.sprite_anim 0, C100, 4, FB
```

> **Tipp:** Helyezd el a `.rawbytes` állományú kerettáblát egy fix címen. A
> számláló ZP bájtját (`$FB`) az első hívás előtt `$00` értékre kell
> inicializálni. Ha a kódod az `$FB` mappát valami másra használja, válassz egy
> szabad ZP helyet.

---

<a id="score_bcd"></a>
### PONTSZÁM_BCD

Hozzáad egy fixpontos értéket egy memóriában tárolt többbájtos BCD-pontszámhoz,
majd minden számjegyet képernyőkód karakterként jelenít meg a képernyő RAM-ban.
A 6502-es decimális módot (`SED`/`CLD`) használja a hordozható BCD-aritmetikához
– nincs szükség kézi hordozás-zsonglőrködésre.

| Érv               | Leírás                                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------------------ |
| Pontszám címe     | A BCD pontszámbájtok hexadecimális címe (pl. `C200`). Az alsó bájttól kezdődik.                              |
| Számjegyek        | BCD bájtok száma (mindegyik bájt két számjegyet tartalmaz: `$99` = "99"). `4` bájt = legfeljebb 99999999.    |
| Pontok hozzáadása | Hívásonként hozzáadandó decimális érték (pl. `100`).                                                         |
| Képernyőcím       | Hová kell írni a számjegy képernyőkódokat (pl. `0400`). Számjegyenként egy bájt (a magasabb nibble először). |

**Szintaxis:**
```
.score_bcd $C200, 4, 100, $0400
```

**Generált kód (4 bájt, +100 pont, pontszám `$C200`, képernyőméret `$0400`):**
```
SED ; BCD / decimális mód engedélyezése
CLC
LDA $C200 ; 0. bájt (1–2. számjegyek)
ADC #$00 ; 100-as alsó bájt a BCD-ben = $00
STA $C200
LDA $C201 ; 1. bájt (3–4. számjegyek)
ADC #$01 ; 100-as középső bájt a BCD-ben = $01 (átvitel terjed)
STA $C201
LDA $C202
ADC #$00
STA $C202
LDA $C203
ADC #$00 STA $C203
CLD ; vissza bináris módba

; számjegyek renderelése
LDX #$00
digit_loop:
LDA $C200,X
PHA
LSR : LSR : LSR : LSR ; magas rágcsálás → alacsony rágcsálás
ORA #$30 ; + '0' képernyőkód
STA $0406,X ; jobbra igazított: képernyő_cím + (digits*2 - 2) - X*2
PLA
ÉS #$0F ; alacsony rágcsálás
ORA #$30
STA $0407,X
INX
CPX #$04
BNE szám_ciklus
```

**Méret:** `3 + számjegy×8` bájt (SED + CLC + CLD többletterhelés + 8 bájt BCD
bájtonként az ADC + kijelzőhurok számára).

**Szintaxis:**
```
.score_bcd $C200, 4, 100, $0400
```

> **Tipp:** Indításkor inicializálja a pontszámbájtokat `$00` értékre. A
> pontszámcímnek a nulla oldalas vagy abszolút RAM-ban kell lennie – nem
> ROM-ban. A képernyőcímnek a bal szélső számjegy cellára kell mutatnia; a
> számjegyeket balról jobbra kell írni (a leghelyesebb bájttal kezdve).

> **BCD tartomány:** `számjegyek=4` bájt → 8 decimális számjegy → maximális
> pontszám 99 999 999. Minden bájt két BCD számjegyet kódol: `$00`–`$99`.

---

## 7. KickAssembler-stílusú szintaxis

A VMA a szokásos KickAssembler űrlapokat is olvassa, így egy KickAssembler
forráskód gyakran úgy fordul elő, ahogy van:

- Az `.pc = $1000` és az `*=$1000 "name"` beállítja a címet (a szegmens neve
  figyelmen kívül marad).
- Az `.const NAME = value` és az `.label NAME = value` konstansokat definiál; az
  `.label NAME = *`, `.label NAME = * + 1` egy címkét helyez el az aktuális
  címen (vagy annak közelében).
- `.macro name(p1, p2) { … }` — egy makró törzs zárójelben, a `.macro … .endm`;
  `:name(args)` és `name(args)` függvények mellett.
- `név: { … }` hatókörök: a bennük lévő címkék lokálisak a `név` számára
  (`név.label` kívülről).
- Az `@label` címkék megtartják az `@` értéküket.
- Az `.text "…"` képernyő-koordináták nélkül tárolja a kódolt bájtokat, például
  `.byte`. Több elem összekapcsolható `, ` vagy `+` karakterekkel: `"…"`, `@"…"`
  escape karakterekkel `\n` `\r` `\t` `\$NN`, és `$NN` / decimális bájt. Az
  `.encoding "name"` paraméter a következő `.text` sorok kódolását választja ki:
  `screencode_mixed` (alapértelmezett), `screencode_upper`, `petscii_mixed`,
  `petscii_upper`, `ascii`; az a karakter, amelyhez a kódolásnak nincs kódja,
  hibát jelez.
- Az `.abs` / `.a` és `.zp` / `.z` mnemonikus utótagok abszolút vagy nulla
  oldalas címzést kényszerítenek ki: `sta.abs $00FC,x`, `ldx.zp ptr,y`.
- `// …` hozzászólások.

A KickAssembler nyelv többi részét (`.for`, `.var` / `.eval`, `.function`,
`.pseudocommand`, `#import`, `#if`, `LoadBinary`, segments …) a C64 Visual
Assembler Kick előfeldolgozója kezeli, amely a KickAssembler forrásfáját VMA
szöveggé alakítja.

## 8. Parancssor

Újdonságok a 2.1.0-s verzióban: `--crt` / `--crt-name` (kazetta) és `--d64` /
`--add` / `--disk-name` (lemezkép).

```
vma build <input.asm> [opciók]
vma --help
vma --version
```

| Opció                  | Jelentés                                                                                                                                                                                                                          |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-o FÁJL`              | Az írandó PRG (alapértelmezett: a bemenet `.prg` kiterjesztéssel)                                                                                                                                                                 |
| `--alap-könyvtár DIR`  | Ahol a `.incbin` / `.koala` / `.level` / `.sid` / `.include` fájlokat keresi ki először (alapértelmezett: a bemenet mappája)                                                                                                      |
| `--keresési könyvtár`  | Egy további mappa, amelyben keresni kell, az alapkönyvtár után (ismétlődően, sorrendben); egy másik gépen írt elérési út a saját fájlnevére vezethető vissza.                                                                     |
| `--no-basic-stub`      | Nincs `10 SYS…` BASIC sor a kód előtt                                                                                                                                                                                             |
| `--nyers`              | A kép önmagában az első ORG-ján: nincs csonk, nincs áthelyezés a(z) `$C000`-re                                                                                                                                                    |
| `--crt FÁJL`           | Egy Magic Desk hangszedő (CRT 19-es típus, 8 × 8K bank, legfeljebb 65 408 bájt): a betöltő a programot a betöltési címére másolja, és a SYS címen indítja el – ez a Visual Assembler Build CRT-je. Az `-o` nélkül nem íródik PRG. |
| `--crt-név NÉV`        | A kazetta neve a CRT fejlécben (alapértelmezett: `VA CART`)                                                                                                                                                                       |
| `--d64 [FÁJL]`         | Egy 1541-es lemezkép a PRG-vel, a PRG-ről elnevezve (alapértelmezett FÁJL: a PRG `.d64` kiterjesztéssel); nincs szükség c1541-re. `-o` nélkül nem kerül PRG írásra.                                                               |
| `--FÁJL hozzáadása`    | Egy további fájl a lemezen jelenlegi állapotában (egy PRG a betöltési címével), a fájlról elnevezve (ismételhető, sorrendben)                                                                                                     |
| `--lemeznév NÉV`       | A lemez neve (alapértelmezett: a D64 fájlneve; azonosító: `01`)                                                                                                                                                                   |
| `--szimbólum FÁJL`     | KickAssembler címkefájl (`.label NAME=$xxxx`)                                                                                                                                                                                     |
| `--vs. FÁJL`           | VICE monitor címkefájl (`al C:xxxx .NAME`; `x64sc -moncommands FÁJL`)                                                                                                                                                             |
| `--dbg FÁJL`           | RetroDebugger / C64 Debugger forráskód térkép (XML)                                                                                                                                                                               |
| `--debug`              | Mindhárom a PRG mellett (`out.sym`, `out.vs`, `out.dbg`)                                                                                                                                                                          |
| `--json FÁJL`          | A build JSON-ként: PRG, SYS cím, szimbólumok, kiosztott sorok, megírt szegmensek, memória nézet — vagy minden sorhiba                                                                                                             |
| `--forrás-útvonal NÉV` | A fő forrás az `.dbg` nevek (alapértelmezett: a bemenet)                                                                                                                                                                          |
| `--vonaltérkép FÁJL`   | JSON tömb: bemeneti sor → a következő sor: `.dbg` nevek                                                                                                                                                                           |

Kilépési állapot: `0` felépítve, `1` fordítási hiba (`FÁJL:LINE: message`
standard hibánál, hibánként egy sor), `2` helytelen használat.

```
vma build game.asm -o game.prg --debug
vma build game.asm --no-basic-stub --search ../assets
vma build game.asm --crt game.crt # csak a kazetta
vma build game.asm --d64 --add music.prg # game.d64 a GAME és a MUSIC paranccsal
```

## 9. Ismert korlátok

A VMA bájtról bájtra reprodukálja a C64 Visual Assembler fordítóját, beleértve a
nyers éleit is:

- `lda.zp c` → `LDA $0C`: az `.zp` paranccsal egy hexadecimális számjegyekből
  álló szimbólumot számként olvasunk be.
- Egy paraméter nélküli makró törzse is ott épül fel, ahol definiálva van; az
  első `* =` előtti definíció a program elején található.
- Az `.text X, Y, "s", 80` elemzi a karakter eltolást, de nem használja azt.
- Az `.chardef` fájlban található bájtok hexadecimálisak (`129` = `$129`, ami
  egy hiba).
- Egy futásidejű `.if` / `.while` / `.until` nem azonnali operandusát címként
  olvassuk be: az `%bin` hiba, az `10` pedig hexadecimális (`$0010`).
- A DELAY segédrutin az elrendezés utolsó sora és minden adatszakasz után
  következik – még egy kihagyott (`.if 0`) DELAY esetén is.

Javítva a 2.1-es verzióban (rossz kódot adtak vagy korábban hibát jeleztek): egy
`.const` / `.var` operandus a nulladik oldalon, `JMP (címke)`, `lda $1234+1`,
egy makróhívás egy makrón belül, egy fel nem oldott TURBO_SET / SPRITE_ANIM
érték (most hiba), címkék a `.data` / `.rawbytes` bájtjaiban, egy `:name` címke,
amelynek célja egy címke, a JOYSTICK / MEMCPY / MEMSET mérete egy későbbi
címkéből (most hiba), az `.data` / automatikus pufferelése `.rawbytes`, és az
include-ok (a hiányzó hiba, a beillesztett fájl saját `.include` / `.incbin` /
`.sid` állományai betöltődnek).
