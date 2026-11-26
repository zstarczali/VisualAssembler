# Projektkezelés a Stúdióban: terv

Állapot: terv, még nincs megvalósítva. Ez a dokumentum a mostani projektkezelés hibáit és a célmodellt
írja le; a lépések a végén vannak.

## 1. Mi van most

Három külön projektkezelés él egymás mellett, mindegyiknek saját állapota, panelje, megnyitási és mentési logikája:

| | Assembly (VMA / ACME / R65, blokk és forrás) | UltimateBasic | C (Oscar64) |
|---|---|---|---|
| Állapot | `_expertProjectData` | `_ubProjectData` | `_osc.root` / `_osc.proj` + `_osc.projects` (több projekt) |
| `.proj` jelölése | nincs `app` (az `assembler` mező dönt) | `app: "ultimate-basic"` | `app: "oscar64"` |
| Fájlok | explicit lista (`files`, mappák `children`-nel) | explicit lista | a mappa tartalma (könyvtár-olvasás) |
| Panel | `#expert-project-panel` (blokk nézetben is, áthelyezve) | `#ub-project-panel` | `#osc-project-*` |
| Megnyitás | most már minden fájl fül + indítófájl aktív | csak az indítófájl (vagy az első `.ub`) | csak az indítófájl |
| Mentés | `_expertSaveProject` + `_expertSaveProjectTabs` | `_ubSaveProject` | `_oscWriteProj` |
| Bezárás | `_closeProject` (Expert ág) | `_closeProject` (UB ág) | `_oscCloseAll` |

Mellettük még három „mentési fogalom” van:

- **Program** (Save program / Load program): egy fájl, blokk módban `.vas`.
- **Projekt** (`.proj`): fájllista + beállítások.
- **Munkaterület** (`.vaws`): a nyitott fülek halmaza, aktív fül, módok.

### A tünetek, amelyeket ez okoz

1. **Módfüggő viselkedés.** Ugyanaz a `.proj` más-más fület nyit attól függően, melyik módban voltál; a
   panel láthatósága is módhoz kötött volt (blokk módban eltűnt).
2. **Hamis „mentetlen” jelzés.** A fül `dirty` jelzője eseményekből jön (`markTabDirty` minden `input`-ra),
   így a módváltás, fülváltás, szinkron is piszkosnak jelöl (javítva `_tabActivate`-ben, de a minta máshol is él).
3. **Átfedő menüpontok.** Save program / Save project / Save workspace: a felhasználó nem tudja, melyik mit ment.
4. **Egyszerre egy projekt, kivéve C-ben**, ahol több is nyitva lehet; a bezárás, a legutóbbiak, a Projekt
   beállítások mind ehhez igazodnak külön ágakkal.
5. **Vegyes nyelvű projekt csak félig létezik.** Egy assembly projektben lévő `.ub` / `.c` fájl a saját
   szerkesztőjében nyílik (`_studioOpenForeign`), de a build és a beállítások a projekt „fajtáját” követik.
6. **Mentetlen projekt.** Expertben az „Új projekt” azonnal mentési ablakot nyit; addig a Projekt beállítások tiltott.

## 2. Célmodell

### 2.1 Egy projekt, egy nyelv, egy állapot (eldöntve)

Mint a Visual Studióban: a projekt **egy nyelvű**, a nyelvét a létrehozáskor kapja (sablon / `.proj`), és nem
változik. Egyszerre **egy** projekt van nyitva (vagy egy sem); másik projekt megnyitása az előzőt bezárja.

| Projekt nyelve | Forrásfájlok | Szerkesztő |
|---|---|---|
| `asm` (VMA / ACME / R65) | `.asm` `.s` `.a65` `.inc` `.vas` `.json` | Blokkok / Forrás |
| `ub` | `.ub` | UB |
| `c` | `.c` `.h`, mellé assembly: `.asm` `.s` `.a65` `.inc` | C (Oscar64); az assembly fájl az assembly szerkesztőben |

Mindegyikbe kerülhetnek **adatfájlok** (`.bin` `.prg` `.sid` `.koa` `.kla` `.vpl` `.act` `.gpl` `.png` `.gif` `.jpg` `.crt`
`.d64` `.txt` `.md`…), ezek nem nyílnak fülként. **Más nyelvű forrásfájl nem vehető fel** (hibaüzenet), régi
projektben talált más nyelvű fájl a fában tiltott jellel látszik, nem nyílik meg.

Az assembly projekt assemblere (VMA / ACME / R65) a projekt beállítása, a nyelven belül marad.
A C projekt assembly fájljai (mint a Visual Studióban a C++ projekt `.asm`-je) szerkeszthetők, a build a C
indítófájlból indul (az Oscar64 `__asm` blokkjai és `#embed`-je használja őket).

```js
_project = {
  kind,          // "asm" | "ub" | "c": nem változik
  path,          // a .proj abszolút útja ("" = még nincs mentve)
  root,          // a .proj mappája; minden relatív út ehhez képest
  name,
  files,         // fa: [{ type: "file" | "folder", name, path, children? }]
  startupFile,   // relatív út: ezt fordítja a Build / Run
  settings,      // a nyelv beállításai: asm { assembler, kick, kickDefines, kickVars, vmaDefines, vmaConsts, noBlockMode },
                 // c { optimize, defines, includeDirs, targets }, ub { }
  dirty,         // a .proj tartalma (fa / beállítás) változott
}
```

A C-ben több program egy projekt **célpontjai** (`targets`, ahogy a build szkript importja már most is csinálja),
nem külön nyitott projektek; az `_osc.projects` megszűnik.

Projekten kívüli fájl (Fájl megnyitása) bármilyen nyelvű lehet, laza fülként; a projekt buildjét nem érinti.

### 2.2 A `.proj` formátum (2. verzió)

```json
{
  "format": "va-project",
  "version": 2,
  "app": "ultimate-basic",
  "name": "cube",
  "startupFile": "box.vas",
  "files": [ { "type": "file", "name": "box.vas", "path": "box.vas" } ],
  "asm": { "assembler": "vma" },
  "ub": {},
  "c": { "optimize": "O2", "defines": [], "includeDirs": [] }
}
```

- **Olvasás:** az 1. verzió minden alakját (Expert, UB `app: "ultimate-basic"`, C `app: "oscar64"`) betöltjük
  és belül 2. verzióvá alakítjuk.
- **Írás:** 2. verzió, de a régi felső szintű mezőket (`app`, `name`, `files`, `startupFile`, `assembler`,
  `kick…`) is megtartjuk, hogy a régebbi VA-k is meg tudják nyitni. Az `app` mezőt csak akkor írjuk, ha az
  alapnyelv UB vagy C (a régi app aszerint dönt).
- **Fájllista, nem mappa (eldöntve):** a fájllista az igazság (egy mappában több projekt is lehet, pl. `samples/`),
  a fában **csak a projektbe felvett fájlok** látszanak. A C projektnél a mostani mappa-olvasás helyett egyszeri
  „mappa hozzáadása” (a forrásfájlok a listába kerülnek); régi C projekt (fájllista nélkül) első megnyitásakor a mappa
  forrásfájljai egyszer felkerülnek a listára.

### 2.3 Munkamenet: `<név>.proj.user`

A nyitott fülek, az aktív fül, fülenként a nézet (Blokkok / Forrás), a kurzor és a görgetés, a könyvjelzők és a
töréspontok **nem** a `.proj`-ba mennek (az verziókezelt, közös), hanem mellé egy `<név>.proj.user` fájlba
(mint a Visual Studio `.suo`-ja); a sablonok `.gitignore`-ja kihagyja.

Ezzel a `.vaws` munkaterület fölöslegessé válik: a projekt maga a munkaterület. A `.vaws` megnyitása
megmarad (régi fájlok), új menüpontként már nem kínáljuk.

### 2.4 Megnyitás

1. Nyitott projekt van → rákérdez a mentetlen fájlokra (egyszer, listában), bezárja.
2. Beolvassa a `.proj`-ot (1. vagy 2. verzió) → `_project`.
3. Ha van `.proj.user`: annak a fülei nyílnak meg, ugyanazzal az aktív füllel és nézettel.
   Ha nincs: a projekt minden forrásfájlja (asm / vas / ub / c / h / inc) fül, az aktív az indítófájl.
   Bináris (`.bin`, `.sid`, `.prg`…) nem nyílik meg, csak a fában van.
4. A fül szerkesztője a fájltól függ, nem az előző módtól.
5. A projektpanel láthatósága globális (egy beállítás minden nézetre), és megnyitáskor mindig látszik.
6. Bekerül a legutóbbiak közé.

Hiányzó fájl: a fában piros, áthúzott, nem nyílik meg, a megnyitás nem áll meg miatta.

### 2.5 Mentett állapot (dirty)

A fül `dirty` jelzője ne eseményekből jöjjön, hanem **összehasonlításból**: a fül megjegyzi a lemezre írt
tartalom hash-ét (`savedHash`), és `dirty = hash(aktuális tartalom) !== savedHash`. A számolás késleltetve,
gépelés után ~300 ms-mal fut. Így semmilyen belső szinkron, mód- vagy fülváltás nem tud hamis jelzést adni,
és a visszavont (Ctrl+Z) módosítás is tisztává teszi a fület.

Blokk-fülnél a tartalom a `_blockToExpertLine` szerinti szöveg (ugyanaz, amit a VMA kap), így a csak
megjelenítési mezők (összecsukás, kijelölés) nem számítanak módosításnak.

A projekt `dirty` jelzője csak a fára és a beállításokra vonatkozik.

### 2.6 Mentés és menük

Fájl menü, egyetlen sorrendben, módtól függetlenül:

| Menüpont | Billentyű | Mit csinál |
|---|---|---|
| Új projekt… | Ctrl+Shift+N | sablonválasztó (a mostani) |
| Új fájl | Ctrl+N | az Új menü (nyelvválasztó) |
| Projekt megnyitása… | Ctrl+Shift+O | csak `.proj` (a választó csak ezt mutatja); a `.vas` / `.json` blokk-program a Fájl megnyitásával nyílik |
| Fájl megnyitása… | Ctrl+O | bármely forrás, projekten kívül is |
| Legutóbbi projektek ▸ | | a mostani lista |
| Mentés | Ctrl+S | az aktív fül |
| Mentés másként… | | az aktív fül |
| Összes mentése | Ctrl+Shift+S | minden mentetlen fül + a `.proj` + a `.proj.user` |
| Projekt beállítások… | | csak nyitott projektnél |
| Projekt bezárása | | |

A „Save program / Load program” = Mentés / Fájl megnyitása (a blokk-program csak egy fájltípus).
A „Save project” = Összes mentése. A munkaterület menüpontjai megszűnnek (2.3).

**Projekt nélküli munka** marad: fülek projekt nélkül. „Mentés projektként…”: a nyitott, fájlhoz kötött fülekből
`.proj`-ot készít (a mappát kérdezi), az aktív fül lesz az indítófájl. Ezért az Expert „Új projekt” gombja
mentési ablak helyett ugyanezt a sablonválasztót nyitja.

### 2.7 Bezárás

A projekt bezárása: egy listás kérdés a mentetlen fájlokról (Mentés / Elvetés / Mégse), a `.proj.user`
mentése, minden projektfül bezárása, a projekten kívüli fülek maradnak. Ha nem marad fül, egy üres fül nyílik
az utolsó használt nyelven.

### 2.8 Projektpanel

A projekt nyelvének szerkesztője mutatja a fát (asm: a blokk és a forrás nézetben ugyanaz, UB: az UB panel,
C: a C panel); mivel egy projekt egy nyelvű, három panel helyett egy közös komponens is elég, de ez nem feltétel.
Fejléc: név, Megnyitás, Új fájl, Meglévő hozzáadása, Új mappa, Beállítások, Frissítés.
Elemek: nyelv-jelvény (mint a fülön), ★ indítófájl, ◆ C cél, hiányzó fájl piros. Nem felvett fájl nem látszik.
Alatta a szimbólumlista az aktív fül nyelvéből (assembly: címkék, makrók; C: függvények, típusok).
A jobb klikk menü a mostaniak uniója (megnyitás, átnevezés, törlés, indítófájl, mozgatás, rendszerben megnyitás).

### 2.9 Build és futtatás

Nyitott projektnél a Build / Run mindig az **indítófájlt** fordítja, az aktív fültől függetlenül; a nyelvet az
indítófájl adja (asm → VMA / ACME / R65, ub → UB, c → Oscar64 vagy a kiválasztott cél). Projekt nélkül az aktív
fület. Az eszköztáron az indítófájl neve látszik a Run gomb mellett, kattintásra választható.

### 2.10 Verziókezelés és legutóbbiak

- A snapshotok (`<név>.snapshots.json`) és a git a projekt gyökeréhez kötődnek, nyelvtől függetlenül
  (a C fülek most kimaradnak a `.vaws` / `_vcTabsUnder` listából: ezt meg kell szüntetni).
- A legutóbbiak listája `{ path, name, kind }` marad; a `kind` az alapnyelv. A C bejegyzés eddig mappára
  mutatott, ezentúl a `.proj`-ra (régi mappás bejegyzés: a mappa első oscar64 `.proj`-ja).

## 3. Lépések

Mindegyik lépés után az app működik, a régi projektek megnyílnak.

1. **Dirty hash-sel** (2.5): `savedHash` a fülön, `markTabDirty` → ütemezett összehasonlítás; minden mentés és
   betöltés beállítja a `savedHash`-t. Teszt: mód- / fülváltás, visszavonás, blokk összecsukás nem piszkít.
2. **`_project` állapot + `.proj` olvasó / író** (2.1, 2.2): `_projRead(json, path)` → 2. verzió,
   `_projWrite()` → kompatibilis JSON. Az `_expertProjectData` / `_ubProjectData` ideiglenesen `_project`-re
   mutató nézet (getter), hogy a meglévő kód működjön. Teszt: az 1. verzió három alakja oda-vissza.
3. **Egy megnyitás és bezárás** (2.4, 2.7): `_studioOpenProject` minden fajtára ugyanazt csinálja; a UB és a C
   is minden fájlt fülként nyit. A `_closeProject` egy ág.
4. **`.proj.user`** (2.3): fülek, aktív fül, nézet, kurzor, könyvjelzők, töréspontok; a sablonok
   `.gitignore`-ja. A `.vaws` menüpontok el.
5. **Egy projektpanel** (2.8): a `#expert-project-panel` lesz a közös; a UB és a C panel fa része megszűnik,
   a C-specifikus elemek (célok, szimbólumok) a közös fába kerülnek.
6. **Menü** (2.6) és **Build az indítófájlból** (2.9).
7. **C több projekt → célok**, verziókezelés a C fülekkel (2.10).
8. Kézikönyv (`Visual Assembler Manual.md` + `.hu.md`), CLAUDE.md, tesztek.

## 4. Döntések és nyitott kérdések

Eldöntve:

- A projektbe fel nem vett fájlok **nem** jelennek meg a fában (2.2, 2.8).
- A `.vas` (és a régi `.json`) blokk-program **fájlként** nyílik meg, akkor is, ha a Projekt megnyitásával
  választják ki; nem kap automatikusan `.proj`-ot (2.6).

Nyitott:

- Legyen-e automatikus mentés (fókuszvesztéskor / build előtt)? Javaslat: build előtt az összes mentése
  kérdés nélkül, kikapcsolható.
