# C64 Visual Assembler — Felhasználói kézikönyv

**2.4.0 verzió**

Vizuális, blokk alapú 6502 assembler a Commodore 64-hez. Programokat hozhat létre húzással és elengedéssel (fogd és vidd) utasításblokkokkal, és valós időben tekintheti meg a létrehozott assembly és gépi kódot.

---

## Tartalomjegyzék

- [C64 Visual Assembler — Felhasználói kézikönyv](#c64-visual-assembler--user-manual)
    - [2.4.0 verzió – kiemelt funkciók](#version-240-highlights)
    - [2.3.9-es verzió – kiemelt funkciók](#version-239-highlights)
    - [2.3.8-as verzió kiemelt funkciói](#version-238-highlights)
  - [Tartalomjegyzék](#table-of-contents)
  - [1. Felület áttekintése](#1-interface-overview)
  - [2. Blokk paletta](#2-block-palette)
  - [3. Programterület](#3-program-area)
    - [Operandus bemenet](#operand-input)
  - [4. ASM nézet](#4-asm-view)
    - [Kimeneti módok](#output-modes)
    - [Eszközkészlet fül](#toolkit-tab)
    - [Beállítások fül](#options-tab)
    - [ASM sorra kattintás](#clicking-an-asm-line)
    - [ASM sorszámok](#asm-line-numbers)
    - [Fordítási folyamatjelző modális ablak](#compile-progress-modal)
  - [5. Beállítások \&amp; Eszköztár](#5-settings--toolbar)
    - [.asm fájl betöltése (gyors útmutató)](#load-asm-file-quick-reference)
      - [Import elemzési megjegyzések és ajánlott eljárások](#import-parsing-notes-and-best-practices)
  - [UltimateBasic mód](#ultimatebasic-mode)
    - [Az UB szerkesztő megnyitása](#opening-the-ub-editor)
    - [Szerkesztőeszközök](#editor-tools)
    - [Projektek, lapok és indítófájlok](#projects-tabs-and-startup-files)
    - [Épületépítés és diagnosztika](#building-and-diagnostics)
    - [Futás, D64 és Exomizer](#running-d64-and-exomizer)
    - [Hibakereső szimbólumok és szétszerelés](#debugger-symbols-and-disassembly)
    - [Ultimate Basic kézikönyv és forrás](#ultimate-basic-manual-and-source)
  - [6. Szakértői mód](#6-expert-mode)
    - [Módok váltása](#switching-modes)
    - [Szerkesztői elrendezés](#editor-layout)
    - [Eszköztár gombjai](#toolbar-buttons)
    - [Kiemelési hiba](#error-highlighting)
    - [Szintaxis kiemelés](#syntax-highlight)
    - [Forrásformázó](#source-formatter)
    - [Projekt panel \&amp; fülek](#project-panel--tabs)
    - [Tabulátorsáv](#tab-bar)
  - [7. Címzési módok](#7-addressing-modes)
    - [Kifejezések operandusként való címkézése](#label-expressions-as-operands)
    - [Az `*` programszámláló kifejezésekben](#the--program-counter-in-expressions)
    - [Helyi (pontozott) címkék](#local-dotted-labels)
    - [Önmódosító kód operandus címkéi](#self-modifying-code-operand-labels)
  - [8. 6502-es szabvány szerinti utasítások](#8-standard-6502-instructions)
    - [Adatmozgatás](#data-movement)
    - [Számtan](#arithmetic)
    - [Logika](#logic)
    - [Ugrások \&amp; Elágazások](#jumps--branches)
    - [LBNE / LBEQ / … (Hosszú ágak)](#lbne--lbeq---long-branches)
    - [Regiszterműveletek](#register-operations)
    - [Shift \&amp; Rotate](#shift--rotate)
    - [Verem](#stack)
    - [Rendszer / Jelzők](#system--flags)
    - [Törvénytelen / Nem dokumentált utasítások](#illegal--undocumented-instructions)
  - [9. Makróblokkok — Referencia](#9-macro-blocks--reference)
    - [LABEL](#label)
    - [COMMENT](#comment)
    - [BYTE](#byte)
    - [WORD](#word)
    - [FILL](#fill)
    - [ALIGN](#align)
    - [TEXT](#text)
    - [STRING](#string)
    - [DATA](#data)
    - [RAWBYTES](#rawbytes)
    - [RAWTEXT](#rawtext)
    - [PETSCII](#petscii)
    - [CHARSET](#charset)
    - [CHARDEF](#chardef)
    - [BOX_HIT](#box_hit)
    - [INCBIN](#incbin)
    - [SID](#sid)
    - [INCLUDE](#include)
    - [TABLE](#table)
    - [ORG](#org)
    - [LOOP / NEXT](#loop--next)
      - [LOOP](#loop)
      - [NEXT](#next)
    - [FOR / ENDF](#for--endf)
      - [FOR](#for)
      - [ENDF](#endf)
    - [PUSH / PULL](#push--pull)
      - [PUSH](#push)
      - [PULL](#pull)
    - [END / RTS alias](#end--rts-alias)
    - [MACRO / ENDM / INVOKE](#macro--endm--invoke)
      - [MACRO (definition start)](#macro-definition-start)
      - [ENDM (definition end)](#endm-definition-end)
      - [INVOKE](#invoke)
    - [REGION / ENDREGION](#region--endregion)
    - [DEFINE / IF / ELSE / ENDIF](#define--if--else--endif)
    - [.ASSERT](#assert)
      - [DEFINE](#define)
      - [IF](#if)
      - [ELSE](#else)
    - [ENDIF](#endif)
    - [CONST](#const)
    - [VAR](#var)
    - [Runtime IF / ELSE / ENDIF](#runtime-if--else--endif)
    - [WHILE / ENDW](#while--endw)
    - [REPEAT / UNTIL](#repeat--until)
    - [MEMCPY / MEMSET](#memcpy--memset)
    - [PRINT / PRINT_CHAR / PRINT_HEX / CLEAR_SCREEN / WAIT_KEY / DELAY / SET_BORDER / SET_BG](#print--print_char--print_hex--clear_screen--wait_key--delay--set_border--set_bg)
    - [IRQ_SETUP](#irq_setup)
    - [RAND](#rand)
    - [SPRITE\_INIT](#sprite_init)
    - [SPRITE\_POS](#sprite_pos)
    - [WAIT\_RASTER](#wait_raster)
    - [JOYSTICK](#joystick)
    - [MOUSE](#mouse)
    - [SPRITE\_COL](#sprite_col)
    - [LOADFILE](#loadfile)
    - [EXODECRUNCH](#exodecrunch)
    - [REU\_CHECK](#reu_check)
    - [REU\_STASH / REU\_FETCH / REU\_SWAP](#reu_stash--reu_fetch--reu_swap)
    - [TURBO\_SET](#turbo_set)
    - [SUPERCPU\_DETECT](#supercpu_detect)
    - [TURBO\_ENABLE](#turbo_enable)
    - [MAP\_COPY](#map_copy)
    - [MAP\_COPY16X16](#map_copy16x16)
    - [SPRITE\_ANIM](#sprite_anim)
    - [SCORE\_BCD](#score_bcd)
  - [10. Hibakereső integráció](#10-debugger-integration)
    - [RetroDebugger](#retrodebugger)
    - [Töréspont blokkok](#breakpoint-blocks)
    - [Hibakereső jelzők (Beállítások lap)](#debugger-flags-options-tab)
  - [11. Tudásbázis linkek](#11-knowledge-base-links)
  - [12. D64 Exportálás \&amp; Futtatás](#12-d64-export--run)
    - [Felosztás gomb](#split-run-button)
    - [Exportálás D64-be párbeszédpanel](#export-to-d64-dialog)
    - [D64 metaadatok a projektekben](#d64-metadata-in-projects)
  - [12b. CRT Export (Magic Desk 64K kazetta)](#12b-crt-export-magic-desk-64k-cartridge)
  - [13. Hardverbeállítások](#13-hardware-settings)
    - [VICE emulátor](#vice-emulator)
    - [Exomizer](#exomizer)
    - [Retro hibakereső](#retro-debugger)
    - [C64 Végső / 1541 Végső](#c64-ultimate--1541-ultimate)
  - [14. Vizuális szerkesztők (Eszköztár)](#14-visual-editors-toolkit)
    - [Nagy felbontású / Többszínű szerkesztő](#hi-res--multicolor-editor)
    - [Sprite szerkesztő](#sprite-editor)
    - [C64 Karakter ROM böngésző ("Karaktertérkép")](#c64-character-rom-browser-char-map)
    - [Karakterszerkesztő (Karakterkészlet)](#character-editor-charset)
    - [Karakterkészlet-vászonszerkesztő](#charset-canvas-editor)
    - [Térképszerkesztő (Többrétegű csempetérképek)](#map-editor-multilayer-tilemaps)
    - [SID Editor (3-Voice Tracker)](#sid-editor-3-voice-tracker)
    - [Görbeszerkesztő](#curve-editor)

---

## A 2.4.0 verzió legfontosabb elemei

- **D64 szerkesztő** — egy teljes értékű lemezkép-böngésző az eszköztáron (a Görbeszerkesztő után). Nyisson meg egy meglévő `.d64` fájlt, hozzon létre egy új üres lemezt, vagy indítsa el az aktuális lemezt közvetlenül a VICE-ba, mindezt a Fájlok ▾ menüből, a többi vizuális szerkesztőhöz hasonlóan. Lásd: [D64 szerkesztő (meglévő lemezkép böngészése és szerkesztése)](#d64-editor-browse--edit-an-existing-disk-image).
- **Hozzáadás / kibontás / átnevezés / törlés a D64 szerkesztőben** — helyi fájl hozzáadása a lemezkönyvtárhoz, kijelölt bejegyzés visszacsomagolása egy `.prg` fájlba, bejegyzés átnevezése a táblázatban, vagy törlése — minden művelet közvetlenül a `.d64` fájlra kerül alkalmazásra a `c1541` fájlon keresztül, külön mentési lépés nélkül.
- **Betöltési cím, kicsomagolási cím és Exomizer a D64 szerkesztőben** — fejléc nélküli nyers fájl hozzáadásával beállítható egy opcionális betöltési cím, egy Exomizer kicsomagolási cél, és tömöríthető a fájl betöltés közben, ugyanazokkal a `mem`/`sfx` tömörítési módokkal, mint az Exportálás D64-be párbeszédpanel extra fájljai. Egy már saját fejlécet tartalmazó `.prg` fájl teljesen kihagyja ezeket a mezőket.
- **Lemezbejegyzés típusválasztó** — PRG / SEQ / USR / REL kiválasztása egy újonnan hozzáadott fájlhoz ahelyett, hogy mindig PRG-ként írná ki.
- **Autentikus könyvtárlista** — a D64 szerkesztő fájllistája a mellékelt C64 Pro betűtípussal, nagybetűkkel jelenik meg a klasszikus `LOAD"$",8` megjelenés érdekében.
- **Javítva:** A D64 szerkesztőben egy bejegyzés átnevezése már nem veti el a szerkesztést, amikor a szövegmezőbe kattintasz.
- **Fejlesztve:** a világos téma módjelző eszköztár jelvénye (BLOKK MÓD / SZAKÉRTŐI MÓD / …) sötétebb és olvashatóbb lett, és a csillogó animációja ismét látható.

---

## A 2.3.9-es verzió legfontosabb elemei

Öt assembly-funkció, amelyek mindegyike használható szövegként szakértői módban és (ahol értelmes) blokkokként is. Mindegyikhez tartozik egy saját referencia rész lejjebb:

- **`*` bármilyen kifejezésben** — a programszámláló szimbólum mostantól operandus kifejezéseken belül is működik, nem csak önmagában: `BNE *-5`, `JMP *+20`, `LDA #&lt;*`, `LDA #&gt;(*+63)`. Az értéket követő `*` (`STRIDE*2`) továbbra is szorzás. Lásd: [Címzési módok → Az `*` programszámláló kifejezésekben](#the--program-counter-in-expressions).
- **Helyi (pontozott) címkék** — egy olyan címke, mint az `.loop`, a legközelebbi megelőző *global* (nem pontozott) címke hatókörébe tartozik, így a `DrawSprite` és a `ClearScreen` mindegyike ütközés nélkül definiálhatja a saját `.loop` címkéjét. Lásd: [Helyi (pontozott) címkék]{1].
- **Hosszú ágú pszeudo-op-ok** — `LBNE`, `LBEQ`, `LBCC`, `LBCS`, `LBMI`, `LBPL`, `LBVC`, `LBVS` egy `JMP` (mindig 5 bájt) feletti invertált ággá állnak össze, így a cél tetszőleges távolságra lehet. Új **Hosszú ágak** paletta kategória. Lásd: [LBNE / LBEQ / … (Hosszú ágak)](#lbne--lbeq---long-branches).
- **`.assert` direktive** — `.assert end - start &lt;= 256` vagy `.assert * &lt; $A000, A "message"` üzenet kiértékelése az összeszerelési időben történik, és a build meghiúsul (a tényleges értéket mutatja), ha a kifejezés hamis. Lásd: [.ASSERT](#assert).
- **Önmódosító kód operandus címkéi** — `LDA érték:#$00` határozza meg az `érték` címkét, amely az utasítás operandus bájtjára mutat, így az `STA érték` közvetlenül azt foltozza. Lásd: [Önmódosító kód operandus címkéi](#self-modifying-code-operand-labels).
- **Barátságosabb „tartományon kívüli” ághibák** — a −128…+127 tartományon kívülre eső ág mostantól pontosan jelzi, hogy mennyire túllépi a határt, és javaslatot tesz a megfelelő `LBxx` hosszú ágra.

---

## A 2.3.8-as verzió legfontosabb elemei

- **Munkaterület mentése / megnyitása:** A megnyitott, fájllal védett lapok pontos készletét – beleértve az aktív lapot és az egyes lapok szerkesztőmódját is – egy `.vaws` munkaterület-fájlba menti. A munkaterületek automatikusan mentésre kerülnek módosításkor, és az alkalmazás indításkor automatikusan visszaállítja az utolsó munkaterületet.
- **Globális memória panel kapcsoló:** A teljes C64 memória panel megjelenítése vagy elrejtése egy dedikált felhasználói felület kapcsolóval.
- **Lokalizált Ultimate Basic parancsreferencia:** Az automatikus kiegészítés felugró ablakában és a Parancsok panelen található parancsleírások mostantól a felhasználói felület jelenlegi nyelvét (magyar, angol, spanyol, német, holland) követik, angol nyelvű tartalékkal.
- **Frissített Ultimate Basic grafikai dokumentációk:** `SZÍNES TOLL` és a plot/line/tégl/kör és többszínű rajzolási parancsok súgószövege mostantól megfelel a jelenlegi fordító viselkedésének.
- **Kijavított KERNAL hivatkozás:** kijavította a `SETLFS` és `PLOT` bejegyzéseket (címek és hívási konvenciók) a szétszerelő KERNAL címtáblázatában.
- **Kijavított memóriahasználat sok megnyitott lap esetén:** A laponkénti visszavonási/ismétlési előzmények mostantól korlátozottak (kis visszapattanással), megakadályozva a korlátlan memórianövekedést, amelyet korábban a sok megnyitott dokumentummal járó hosszú munkamenet okozott.
- **Szerkesztő eszköztár tisztítása:** eltávolítottuk a redundáns töréspont-váltó gombokat a Szakértő és az Ultimate Basic eszköztárakról (a töréspontok továbbra is a sorszámozási kötőtűből állíthatók be), és a Szakértő eszköztár magasságát az Ultimate Basic eszköztár magasságához igazítottuk.

---

## 1. Felület áttekintése

Az alkalmazás három fő panelre oszlik:

| Panel                 | Leírás                                                                             |
| --------------------- | ---------------------------------------------------------------------------------- |
| **Balra — Paletta**   | Minden elérhető utasítás- és makróblokk. Keresés vagy böngészés kategória szerint. |
| **Központ — Program** | A programod. Húzd ide a blokkokat, rendezd át őket, szerkeszd az operandusokat.    |
| **Jobbra — Kimenet**  | Élő ASM nézet és/vagy memóriamonitor kimenet.                                      |

A fejléc jobb szélén található mód jelvény azonosítja az aktív **Block**, **Expert** vagy **Ultimate Basic** szerkesztőt. Azonnal frissül, amikor a szerkesztési mód megváltozik.

---

## 2. Blokk paletta

A bal oldali paletta kategóriák szerint csoportosítva felsorolja az összes elérhető blokkot:

- **Adatmozgatás** — LDA, LDX, STA, STX, …
- **Számtani** — ADC, SBC, INC, DEC, CMP, …
- **Logika** — ÉS, ORA, EOR, BIT
- **Ugrások és ágak** – JMP, JSR, RTS, BNE, BEQ,…
- **Hosszú ágak** — LBNE, LBEQ, LBCC, LBCS, LBMI, LBPL, LBVC, LBVS (elágazás tetszőleges távolságra; lásd §8)
- **Nyilvántartási műveletek** — TAX, TAY, INX, DEX, …
- **Eltolás és forgatás** — ASL, LSR, ROL, ROR
- **Stack** — PHA, PHP, PLA, PLP
- **Rendszer** — CLC, SEC, NOP, BRK, …
- **Érvénytelen utasítások** — LAX, SAX, DCP, …
- **Structure** — LABEL, COMMENT, REGION, ENDREGION
- **Makrók** — LOOP, NEXT, FOR, ENDF, PUSH, PULL, END, TEXT, BYTE, WORD, FILL, ALIGN, ASSERT, STRING, DATA, RAWBYTES, RAWTEXT, PETSCII, CHARSET, INCBIN, SID, INCLUDE, TABLE, ORG, MACRO, ENDM, INVOKE, IF, ELSE, ENDIF, VAR, WHILE, ENDW, REPEAT, UNTIL, MEMCPY, MEMSET, PRINT, PRINT_CHAR, PRINT_HEX, CLEAR_SCREEN, WAIT_KEY, DELAY, SET_BORDER, SET_BG, IRQ_SETUP, RAND, SPRITE_INIT, SPRITE_POS, WAIT_RASTER, JOYSTICK, MOUSE, SPRITE_COL, LOADFILE, REU_CHECK, REU_STASH, REU_FETCH, REU_SWAP, TURBO_SET, SUPERCPU_DETECT, TURBO_ENABLE, MAP_COPY, MAP_COPY16X16, SPRITE_ANIM, SCORE_BCD

A paletta tetején található **keresőmezővel** név szerinti szűréshez kattintson a **Kijelölt blokk hozzáadása** gombra, vagy húzzon egy blokkot a programterületre.

---

## 3. Programterület

- **Húzzon át** blokkokat a palettáról, vagy **rendezze át** a meglévő blokkokat a fogantyújuk (≡) húzásával.
- Minden blokk mutatja a **mnemonikját**, az **operandus mezőjét** és az **címzési mód választóját** (ahol alkalmazható).
- Kattintson az **▸ / ▾** kapcsolóra egy blokk összecsukásához vagy kibontásához.
- Egy blokk eltávolításához használd az **× (törlés)** gombot.
- Az **Összes összecsukása** gomb egyszerre hajtja össze az összes blokkot.

### Blokk panel minitérkép

A Program panel fejlécében található egy bekapcsolható **minimap** gomb. Engedélyezése esetén egy keskeny `56 px` vászonsáv jelenik meg a panel jobb szélén, amely az összes blokkot színkódolt vízszintes sávokként mutatja:

| Sáv színe | Blokk típusa                           |
| --------- | -------------------------------------- |
| Cián      | Címkék                                 |
| Kék/lila  | Makrók és direktívák                   |
| Sárga     | Utasítás                               |
| Zöld      | Megjegyzések és üres sorok             |
| Piros     | Érvényesítési hibát tartalmazó blokkok |

Az összecsukott blokkok csökkentett átlátszósággal jelennek meg. Kattintson vagy húzzon a minitérkép bármely pontjára, hogy a programlistát az adott pozícióba görgessen. A nézetablak-jelző (ékezetes színű téglalap) követi a lista látható részét. Az állapot a felhasználói felület beállításaiban marad meg (`blockMinimap` billentyű).

### Operandus bemenet

- Elágazási/ugrási utasítások esetén (`BNE`, `JMP`, `JSR` stb.) egy **címkeválasztó** legördülő menü jelenik meg – kattintson egy definiált címkére a beszúrásához.
- A számformátum az eszköztáron található **HEX / DEC** kapcsolót követi (lásd az 5. szakaszt).

---

## 4. ASM nézet

A jobb oldali panel valós időben mutatja a generált kimenetet.

### Kimeneti módok

| Mód               | Leírás                                                                                                                                                                                                                                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **ASM**           | 6502 assembly forráskód címekkel és címkékkel                                                                                                                                                                                                                                                                      |
| **Monitor**       | Hex / bájt kiíratás (C64 monitor stílus)                                                                                                                                                                                                                                                                           |
| **Diazmus**       | Tiszta 6502 szétszerelés: cím · hex bájtok · feloldott numerikus operandusokkal ellátott mnemonikok. A makrók kibővítve egyedi utasításokra (TEXT → LDA/STA párok, LOOP → LDX, stb.). A BYTE/WORD/FILL adatok darabolt hex dumpként jelennek meg. A kimenetben nincsenek makrónevek, megjegyzések vagy annotációk. |
| **Mindkettő**     | ASM felül, monitor alul                                                                                                                                                                                                                                                                                            |
| **Szétszerelő**   | Ugyanaz, mint a Disasm — dedikált fül a szétszerelési nézethez                                                                                                                                                                                                                                                     |
| **Eszközkészlet** | C64 referencia panel: 16 színű palettaminta + PETSCII vezérlőkód és nyomtatható karakterfelismerő lap. Csak olvasható – a részletekért lásd az alábbi „Eszközkészlet fül” alszakaszt.                                                                                                                              |
| **Beállítások**   | Programbeállítások panel — számformátum, makróforrás-váltás, hibakereső paraméterek                                                                                                                                                                                                                                |

### Eszközkészlet fül

Az ASM nézet **Toolkit** füle egy írásvédett gyorsreferencia panel – soha nem módosítja a programot. Két részből áll:

| Szakasz                   | Tartalom                                                                                                                                                                                                                                                                                                                                                                                                               |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **C64 színpaletta**       | 16 színmintából álló rács, amely minden C64 színt megjelenít az indexével (0–15 / `$00`–`$0F`) és nevével. Kattintson egy színmintára a hexadecimális indexének vágólapra másolásához. Vigye az egérmutatót a szín nevére (világoskék, barna stb.).                                                                                                                                                                    |
| **PETSCII control codes** | Gyakori vezérlőkódok a `CHROUT` ($FFD2) számára: színváltó kódok (`$05` fehér, `$1C` piros, `$1E` zöld, `$1F` kék, …), kurzormozgás (`$11`/`$1D`/`$91`/`$9D`), fordított be/ki (`$12`/`$92`), `$93` képernyő törlése, `$8E`/`$0E` karakterkészlet-kapcsolók. Valamint egy nyomtatható tartományú összefoglaló (32-64 írásjelek, 65-90 A-Z, 91-95 zárójelek, 96-127 grafika, 160-191 eltolt grafika, 192-223 tükrözés). |

A Toolkit a leggyorsabb módja annak, hogy színindexet vagy PETSCII vezérlőbájtot keressünk a szerkesztő elhagyása nélkül.

### Beállítások fül

Az **Beállítások** fül tartalmazza a kódgenerálást és a kimenet megjelenítését befolyásoló beállításokat:

- **Makró forrás** — BE kapcsolás esetén a makródefiníciós blokkok (MACRO…ENDM) a forráskódjukat beágyazva jelenítik meg az ASM nézetben.
- **Program kezdőcíme** — mostantól a programterületen egy **ORG blokkon** keresztül adható meg, nem pedig egy külön beviteli mezőben. Az első ORG blokk határozza meg a program betöltési címét; a további ORG blokkok további szakaszokat indítanak különböző címeken.
- **Hibakereső paraméterek** — három beágyazott kapcsoló, amelyek szabályozzák, hogy mely jelzők kerüljenek átadásra a külső hibakeresőnek indításkor:
  - **`-jmp` BE/KI** — betöltés után közvetlenül a program kezdőcímére ugrás.
  - **`-unpause` BE/KI** — a hibakereső betöltéskor azonnali szüneteltetésének folytatása.
  - **`-wait` ms BE/KI** — `-wait <ms>` késleltetést ad hozzá a szüneteltetés folytatása előtt; válasszon 500 ms vagy 1000 ms értéket a legördülő menüből.
- **Fordítási információk** — a lefordított program összefoglalását mutatja (kód kezdőcíme, mérete, BASIC SYS csonk állapota).

### ASM sorra kattintás

Kattintson az ASM nézet bármelyik sorára a megfelelő blokk ** kiemeléséhez a programterületen. **

### ASM sorszámok

Az ASM panel az **sorszámokat jeleníti meg** (`001 |`, `002 |`, …), hogy megkönnyítse a hibakeresést, ha egy fordítási hiba egy adott sorra mutat.

- A vizuális sorszámok csak diagnosztikai célokat szolgálnak.
- Az **Copy ASM** továbbra is a tiszta forrásszöveget másolja **sorszám előtagok nélkül **.

### Fordítási folyamatábra

Nehezebb műveletek közben egy középre igazított folyamatjelző jelenik meg egy folyamatjelző sávval:

- **Futtatás VICE-ban** — PRG fordítása/felépítése és emulátor indítása.
- **Debug** — PRG fordítása/felépítése és hibakereső indítása.
- **.asm fájl betöltése** — `.asm` fájl megnyitása Szakértő módban és blokkok materializálása a forrásból.

A modális ablak automatikusan bezárul, ha a művelet befejeződik vagy sikertelen.

---

## 5. Beállítások és eszköztár

| Ellenőrzés                              | Leírás                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Számrendszer (HEX / DEC / BIN)**      | Beállítja az operandusok megjelenítési/beviteli formátumát a felhasználói felületen. A BIN mód bináris formátumban jeleníti meg az értékeket `%` előtaggal (pl. `%11111000`). Az ASM nézet mindig minden blokkot a saját formátumában jelenít meg.                                                                                                                                                                                                                                     |
| **Nyelv**                               | Váltás a felhasználói felület között angol, magyar, spanyol, német és holland (holland) nyelven                                                                                                                                                                                                                                                                                                                                                                                        |
| **Téma**                                | Világos / Sötét / OLED / Commodore 77 – válasszon a Beállítások menü témaválasztójából. Az OLED tiszta fekete hátteret használ az AMOLED kijelzőkön. A Commodore 77 egy neonsárga-fekete téma; amikor ez az aktív téma, az indítási splash panel a téma panelszínét használja (megfelel az üzenetkártyának), egy kisebb, dedikált Commodore 77 logót és egy sárga folyamatjelző sávot jelenít meg. A kiválasztott téma a következő indításkor az első festés előtt kerül alkalmazásra. |
| **CRT retró mód**                       | Teljes képernyős CRT szűrő ki-/bekapcsolása: pásztázási vonalak, foszforvignettálás, villogás és hordótorzítás. Az állapot a munkamenetek között mentésre kerül.                                                                                                                                                                                                                                                                                                                       |
| **Memória panel megjelenítése**         | Globális kapcsoló, amely megjeleníti vagy elrejti a teljes C64 memóriapanelt                                                                                                                                                                                                                                                                                                                                                                                                           |
| **ALAP RENDSZER csonk**                 | Egy SYS-t meghívó BASIC sort illeszt a program eredete elé.                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Minta**                               | Beépített példaprogram betöltése                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Nagyítás / Kicsinyítés**              | A blokk felhasználói felületének skálázása (az összes blokkelemet érinti)                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Projekt mentése**                     | Mentse el az aktuális programot `.json` projektfájlként                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Program mentése más néven**           | Mentse el az aktuális programot `.json` projektfájlként, minden alkalommal új fájl párbeszédablakot használva.                                                                                                                                                                                                                                                                                                                                                                         |
| **Projekt betöltése**                   | Korábban mentett projekt betöltése                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Munkaterület mentése**                | Mentse el a jelenleg megnyitott, fájllal védett lapok pontos készletét – beleértve az aktív lapot és az egyes lapok szerkesztőmódját (Blokk/Szakértő/Ultimate Basic) – egy `.vaws` munkaterület-fájlba.                                                                                                                                                                                                                                                                                |
| **Munkaterület mentése más néven**      | Az aktuális munkaterület mentése minden alkalommal új fájl párbeszédpanel használatával                                                                                                                                                                                                                                                                                                                                                                                                |
| **Munkaterület megnyitása**             | Zárja be az összes megnyitott lapot, és nyissa meg újra a `.vaws` munkaterület-fájlban tárolt fájlokat.                                                                                                                                                                                                                                                                                                                                                                                |
| **Munkakönyvtár beállítása**            | Válassza ki a fájlválasztók és a mentési párbeszédpanelek által használt alapértelmezett mappát. Az elérési út az alkalmazás konfigurációjában tárolódik, és a menü előnézetei láthatóvá teszik az elérési út végét.                                                                                                                                                                                                                                                                   |
| **Projekt megnyitása** (`Menü → Fájl`)  | Nyisson meg egy többfájlos `.proj` projektet, és nyissa meg az összes forrásfájlt fülként.                                                                                                                                                                                                                                                                                                                                                                                             |
| **Projekt mentése** (`Menü → Fájl`)     | Mentsd el az aktuális `.proj` projektet (a projekt panelnek nyitva kell lennie)                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Projekt bezárása** (`Menü → Fájl`)    | Bezárja a jelenleg megnyitott projektet és az összes fájlfülét. Rákérdez a nem mentett változtatások mentésére. A projektpanel visszaáll üres állapotába.                                                                                                                                                                                                                                                                                                                              |
| ** .asm fájl betöltése**                | Megnyit egy `.asm` fájlt Szakértő módban, és importálja a szöveges 6502 ASM-et az aktuális lapra.                                                                                                                                                                                                                                                                                                                                                                                      |
| **PRG mentése**                         | Exportálja a lefordított bináris fájlt `.prg` fájlként                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **CRT építése**                         | Exportáld a programot 64K-s Magic Desk (`.crt`, kazettatípus 19) fájlként. Lásd: [12b. szakasz](#12b-crt-export-magic-desk-64k-cartridge).                                                                                                                                                                                                                                                                                                                                             |
| **Futtatás (felosztó gomb)**            | A fő **▶ Futtatás** gomb futtatja az aktuális módot; kattintson az **▾** nyílra a következők közötti váltáshoz: **Futtatás PRG-ként** (VICE közvetlen fordítása és indítása), **Futtatás D64-en keresztül** (.d64 lemezképbe csomagolva és VICE indítása), vagy **Futtatás hardveren** (PRG küldése C64 Ultimate / 1541 Ultimate eszközre). Lásd a [12. szakasz](#12-d64-export--run) és a [13. szakasz](#13-hardware-settings) pontokat.                                              |
| **Hibakeresés (RetroDebugger)**         | Fordítás és indítás a RetroDebuggerben töréspontokkal, szimbólumokkal és automatikus indítási jelzőkkel (lásd: [9. szakasz](#9-debugger-integration))                                                                                                                                                                                                                                                                                                                                  |
| **Futtatás az Exomizerrel**             | Jelölőnégyzet a Beállítások menüben – ha engedélyezve van, az összes Futtatás és Összeállítás művelet a PRG-t az `exomizer sfx sys` fájlon keresztül futtatja indítás vagy mentés előtt. Működik a Futtatás PRG-ként, Futtatás D64-en keresztül, Futtatás hardveren, PRG összeállítása és D64 összeállítása beállításokkal. Először konfigurálja az Exomizer futtatható fájlját a **Hardverbeállítások** menüpontban.                                                                  |
| **Automatikus pillanatfelvétel-mentés** | Jelölőnégyzet a **Hardverbeállítások → Pillanatkép** részben. Ha engedélyezve van, az alkalmazás automatikusan pillanatképet készít körülbelül 2,5 másodperccel a fül szerkesztésének befejezése után. Kapcsolja ki, ha csak manuális pillanatkép-mentést szeretne.                                                                                                                                                                                                                    |
| **Hardverbeállítások**                  | Nyissa meg a hardverkonfigurációs párbeszédablakot — konfigurálja a VICE, az Exomizer, a RetroDebugger és a C64 Ultimate csomagokat (gazdagép, jelszó, kapcsolatteszt). Lásd: [13. szakasz](#13-hardware-settings).                                                                                                                                                                                                                                                                    |
| **Új program…**                         | Megnyit egy megerősítő párbeszédpanelt, majd törli az összes blokkot a programterületről.                                                                                                                                                                                                                                                                                                                                                                                              |
| **Összes összecsukása**                 | Összes blokk összecsukása                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Rólunk**                              | Verzióinformáció                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Újdonságok**                          | Változásnapló                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |

### Projekt pillanatképek

A projekt pillanatképei JSON fájlként, lemezen tárolódnak, nem pedig a localStorage tárolóban. Az aktuális projektfájlhoz kapcsolódnak, ha létezik ilyen, így az előzmények az újraindítások után is megmaradnak, és követik a projektet.

- **Menü → Építés → Pillanatkép mentése** megnyitja a pillanatkép párbeszédablakot, és elmenti az aktuális blokkállapotot, valamint a Szakértői ASM szöveget.
- **Menü → Építés → Előző verzió visszaállítása** közvetlenül visszaállítja a legutóbbi pillanatképet.
- **Menü → Létrehozás → Pillanatkép előzmények** megnyitja a párbeszédablakot, ahol jegyzeteket adhat hozzá, visszaállíthatja a régebbi bejegyzéseket, vagy törölheti azokat.
- **Hardverbeállítások → Pillanatkép → Automatikus pillanatkép-mentés** szabályozza, hogy az alkalmazás automatikusan létrehozzon-e pillanatképeket a szerkesztések után. Az alapértelmezett késleltetés körülbelül 2,5 másodperc, és a beállítás laponként érvényes.
- Ha egy projektet még nem mentettek el, a pillanatképek az alkalmazás konfigurációs könyvtárában tárolódnak, amíg a projekt nem kap egy fájlútvonalat. | **Tudásbázis** | Referencia linkek (6502 opcode-ok, C64 KERNAL, memóriatérkép, színek) | | **Frissítések keresése** | Nyissa meg az itch.io oldalt az újabb kiadások kereséséhez |

### Munkaterületek

Egy **munkaterület** (`.vaws` fájl) megjegyzi, hogy mely valós, lemezen lévő fájlok voltak megnyitva az egyes lapokon – beleértve az egyes lapok szerkesztő módját és azt is, hogy melyik lap volt aktív –, így később pontosan ezt a csoportot nyithatod meg újra. Ez elkülönül egy `.proj` projekttől: egy munkaterület a Block/Expert `.json` projektfájlok, az önálló `.asm` fájlok és az Ultimate Basic `.ub`/`.proj` források bármilyen keverékét magában foglalhatja több lapon.

- A munkaterületek **automatikus mentése** néhány száz milliszekundummal a mentés vagy megnyitás után.
- Az alkalmazás **indításkor automatikusan visszaállítja az utolsó munkaterületet,** így a megnyitott lapok onnan folytatódnak, ahol abbahagytad.
- Csak azok a fülek kerülnek mentésre a munkaterületre, amelyek mögött egy valódi fájl található a lemezen; egy nem mentett mintát vagy csak memóriában tárolt programot tartalmazó fülnek nincs mit megőriznie, és kimarad (értesítést küld, ha egyik nyitott fül sem felel meg a feltételeknek).
- Egy munkaterület megnyitása először az összes aktuálisan megnyitott lapot bezárja – a folytatás előtt megerősítést kér a rendszer.
- Ha egy munkaterület egy azóta áthelyezett vagy törölt fájlra hivatkozik, a bejegyzés kimarad, és a betöltés után név szerint jelenik meg.

### .asm fájl betöltése (gyors útmutató)

Az Expert módú `.asm` betöltő elfogadja a gyakori 6502-es forrásmintákat, és blokkokká alakítja azokat:

- `* = $1500` → ORG block
- `Label:` → LABEL block
- `Label: .byte 0` → LABEL + BYTE blocks
- `.byte ...` → BYTE block
- `; comment` (or inline `; ...`) → COMMENT block
- utasítások (`lda`, `jsr`, `beq`, stb.) → észlelt címzési móddal rendelkező utasításblokkok

#### Import elemzési megjegyzések és ajánlott eljárások

- A helyi címkék, mint például az `.wait`, standard címkékként importálódnak (pontok nélkül), és a hivatkozások ennek megfelelően normalizálódnak.
- Az `($zp),Y` / `($zp,X)` stílusú címzés esetén a legjobb kompatibilitás érdekében használjon konkrét nulla oldalas bájtot (`$FB`, `$FC` stb.).
- Kerüld a kétértelmű, hexadecimálisnak tűnő rövid címkéket (`cc1`, `dead`, `beef`) az ágak kontextusában; részesítsd előnyben az olyan neveket, mint a `loop_cc1`.
- Ha a programod a végrehajtható kód előtt adatokkal (`.byte`) kezdődik, akkor adj hozzá egy explicit ugrást (például `JMP Start`) a tetejéhez.

### ASM import (Kick Assembler)

A Program menü **ASM import** gombja a nyers Kick Assembler forráskódot egy új blokk módú lapra tölti be. Ez elkülönül a fenti `.asm fájl betöltése` Expert módú ` gombtól — az egyéni tooltipje jelzi, hogy **csak a Kick Assembler kód támogatott** (más assembler kódok részlegesen értelmezhetnek, de nem garantált az oda-vissza átvitel).

Támogatott minták:

- `.pc = $XXXX` eredet direktíva → ORG blokk
- `.const NAME = value`, `.label NAME = value` → CONST equate
- `.makró NÉV(p1, p2, ...) { ... }` with `{`/`}` merevítő törzs vagy `.endm` → felhasználói makró definíció
- Makróhívás `NAME(args)`, Kick colon prefix `:NAME(args)`, és `.invoke NAME(args)` — mindegyik oda-vissza a Kick colon űrlapon keresztül
- Az `@local` címkék (`@loop:`, `BEQ @loop`) megőrzik az `@` előtagot a jelenlegi állapotában.
- Operandus `címke + N` / `címke - N` (pl. `STA mod1+2`, `LDA xp+1`)
- Sormegjegyzések `// ...` és `;` — mindkettő elfogadott, az `/* ... */` blokkokat egyetlen megjegyzéssorként kezeli a rendszer
- BASIC autostart áteresztés: amikor a program a `$0801` címen indul a standard `SYS 2061` bájtos csonkkal (`.bájt $0B,$08,$0A,$00,$9E,$32,$30,$36,$31,$00,$00,$00`), a fordító szó szerint kiadja a PRG-t ahelyett, hogy egy második BASIC SYS-t csomagolna köré.

Ismert korlátozás:

- A nulla oldalas címre feloldódó konstansok (például `.const BYTEADDR = $FC`, amelyet `STA BYTEADDR` címként használnak) jelenleg abszolút módú utasításokká (3 bájt) fordulnak le a nulla oldalas (2 bájt) helyett. A lefordított kód továbbra is a megfelelő memóriahelyre ír, csak kisebb mérettel és ciklusterheléssel a Kick Assembler által készített ugyanennek a forráskódnak a kódjához képest.

## UltimateBasic mód

A Visual Assembler tartalmaz egy teljes **Ultimate Basic IDE-t**. Az Ultimate Basic egy modern, lefordított BASIC nyelv C64 programok, játékok és demók létrehozásához anélkül, hogy minden műveletet alacsony szintű 6502 assemblyben kellene írni. A fordító lokálisan fut és natív C64 PRG kimenetet generál.

### Az UB szerkesztő megnyitása

Válassza az **UB** ikont a fő eszköztáron az Ultimate Basic módba való váltáshoz. A kiválasztott szerkesztőmódot a rendszer megjegyzi az alkalmazás újraindításakor. Egy új forráskód a következővel kezdődik:

```basic
color bg 0
color border 0

print "HELLO FROM ULTIMATE BASIC"
```

Az UB mód az `.ub` forrásfájlokkal működik. Az **Új**, **Megnyitás**, **Mentés** és **Mentés másként** parancsok az aktív UB fülön használhatók. Egy `.ub` fájl megnyitása automatikusan aktiválja a megfelelő szerkesztő fület.

Az eszköztár az aktuális UB munkamappát mutatja. Ez a mappa a Blokk/Szakértő munkamappától elkülönítve tárolódik. Amikor az UB mód aktív, a **Fájl → Munkamappa beállítása** parancs kiválasztja az UB mappát; az eszköztipp azonosítja az aktív hatókört. Az UB Megnyitás/Mentés párbeszédablakok itt indulnak, és a nem mentett források ezt használják a relatív `include` és `incbin` elérési utak alapjául.

### Szerkesztőeszközök

Az UB eszköztár ugyanazt a vizuális nyelvet és egyéni eszköztippeket követi, mint a Szakértő mód. A következőket kínálja:

- szintaxiskiemelések az aktuális Ultimate Basic nyelvi referencia alapján;
- a hosszú fájlokkal szinkronban maradó sorszámok;
- egy minitérkép és egy szerkesztő nagyítási vezérlőelemei; kattintson a minitérképre az ugráshoz, vagy húzza a nézetablak kijelölését a folyamatos görgetéshez;
- Keresd meg a (`Ctrl+F` / `Cmd+F`) parancsot a Szakértő stílusú keresősávval;
- forráskód formázása szerkezet-érzékeny behúzással;
- automatikus kiegészítés parancsokhoz és beépített függvényekhez;
- egy kereshető **Parancsok** panel szintaxissal, leírással és használati útmutatóval – a leírások a felhasználói felület aktuális nyelvét követik (magyar, angol, spanyol, német, holland), a még le nem fordított részek esetében pedig az angolt használják;
- függetlenül kapcsolható **Projekt** és **Parancsok** panelek, amelyek egymás mellett jelennek meg, ha mindkettő engedélyezve van;
- függetlenül ki-be kapcsolható és átméretezhető **Build Output** és **Disassembly** panelek.

A Szétszerelés panel tartalmaz egy **Másolás** gombot, amely a teljes megjelenített forráskódot a vágólapra másolja. A parancssúgó a mellékelt fordítót követi: például az `sprite_frame id, data_address [, frame]` parancs egy animációs képet választ ki egymást követő 64 bájtos sprite képkockák közül.

A parancslista magassága szándékosan korlátozott, így a parancsrészletező kártya kitöltheti a panel fennmaradó magasságát. A részletes terület külön görgethető a hosszabb szintaxisleírásokért.

### Projektek, lapok és indítófájlok

Az Ultimate Basic projektek `.proj` fájlokat használnak, és több `.ub` forrást is tartalmazhatnak. A Projekt panel listázza a megnyitott fájlokat, megjelöli a nem mentett lapokat, és megjeleníti a felfedezett címkéket, függvényeket és alprogramokat. A Projekt műveletek lehetővé teszik egy projekt létrehozását, megnyitását, mentését és bezárását, vagy egy másik forrásfájl hozzáadását.

Kattintson a projektfájl melletti csillagra, hogy **indítófájlként** jelölje meg. A Build, Run, D64, C64 Ultimate és Debug parancsok akkor is lefordítják az adott indítófájlt, ha egy másik lap aktív. Indítási beállítások nélkül az aktív UB lap lesz használatban.

### Épület és diagnosztika

Az **Build** gomb ugyanazt a középre igazított folyamatélményt nyitja meg, amelyet a többi Visual Assembler futtatási munkafolyamat is használ. A sikeres buildek frissítik a Build Output, a Build Info és a Disassembly adatokat. Engedélyezze az **Verbose** gombot a fordító memória-térképének részleteinek, a belső nulla oldalas allokációknak és a generált kódadatoknak a megjelenítéséhez.

Amikor a fordítás sikertelen:

- A kimenet automatikusan láthatóvá válik;
- a fordítási hibák pirossal jelennek meg;
- a középre igazított fordítási párbeszédpanel megjeleníti a hibát;
- A forrássort tartalmazó hibák esetén válassza ki az adott sort az aktív UB szerkesztőben.

A Build Info jelentéseket tartalmaz a betöltési/befejezési címekről, a kód- és PRG-méretekről, az Exomizer állapotáról, a változókról, a tömbökről, a függvényekről/alprogramokról és a címkékről.

### Futás, D64 és Exomizer

A fő **Futtatás** gomb minden normál célhelyen támogatja az Ultimate Basic-et:

| Futási mód                      | Végső alapvető viselkedés                                                                                |
| ------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Futtatás PRG-ként**           | Fordítsd le és indítsd el a PRG-t közvetlenül a VICE-ban.                                                |
| **Futtatás a D64-en keresztül** | Fordítsd le, nyisd meg a szokásos D64 csomagolási párbeszédablakot, majd indítsd el a lemezt a VICE-ban. |
| **Futtatás Ultimate-on**        | Töltse fel és futtassa a PRG-t a konfigurált C64 Ultimate REST kapcsolaton keresztül.                    |
| **D64 futtatása hardveren**     | Csomagolj be egy D64-et, és küldd el a konfigurált C64 Ultimate-nek.                                     |

A globális **Beállítások → Exomizer** opció az UB buildekre és a normál futtatású célpontokra is vonatkozik; nincs szükség külön UB eszköztár kapcsolóra. A hibakereső indításai szándékosan a tömörítetlen PRG-t használják, így a fordító címei és szimbólumai továbbra is megegyeznek a végrehajtott programmal.

Engedélyezze a **Beállítások → Programbeállítások → UltimateBasic ASM forrás (.asm) generálása** lehetőséget, ha a fordító által generált assemblyt egy PRG vagy D64 build mellé szeretné menteni, ugyanazzal az alap fájlnévvel. Ez egy build opció, így az UB eszköztár nem tartalmaz külön ASM export gombokat. A `load "NAME", $address` utasítás a megfelelő D64 extra fájl PRG betöltési címét is megadja.

### Hibakereső szimbólumok és szétszerelés

A buildek Ultimate Basic hibakeresési információkat kérnek, és három kompatibilis mellékkocsit hoznak létre:

- `.sym` a KickAssembler stílusú szimbólumokhoz;
- `.dbg` a C64Debugger/RetroDebugger forrás- és szegmensinformációihoz;
- `.vs` a VICE monitor címkékhez.

A színesített UB Disassembler panel feloldja az ismert címkéket, és címeket, bájtokat, mnemonikokat és operandusokat jelenít meg. Az **Debug** gomb elindítja a RetroDebuggert a nyers UB PRG-vel, a hibakeresési oldalkocsikkal, valamint a fordító címkéivel, függvényeivel, alprogramjaival, változóival és tömbjeivel. A hibakeresési várakozási és szüneteltetési beállítások megoszlanak a normál Visual Assembler hibakereső konfigurációjával.

### Ultimate Basic kézikönyv és forrás

A könyv ikonra az UB eszköztáron kattintva offline módban megnyitható a megfelelő Ultimate Basic `MANUAL.pdf` fájl; a kézikönyv gombjára az indítási üdvözlő párbeszédpanelen ugyanez a kézikönyv nyílik meg. A Visual Assembler mind a fordítót, mind a PDF-et a rögzített upstream Git/Cargo függőségből veszi, így az IDE nem tart fenn második példányt az Ultimate Basic implementációjáról. A Névjegy párbeszédpanel és a nyitóképernyő a tényleges függőség verzióját jeleníti meg.

Az Ultimate Basic önálló nyílt forráskódú projektként is elérhető:

<https://github.com/zstarczali/UltimateBasic>

A fordítóprogram a Visual Assembler része, így futásidőben nincs szükség külön `ub` futtatható fájlra.

## 6. Szakértői mód

A Szakértői mód egy teljes funkcionalitású, közvetlen szöveges 6502-es assembly-szerkesztő, amely a blokkszerkesztő mellett található. Minden fül lehet Blokk vagy Szakértő módban – a felső sávban található **Blokk / Szakértő** kapcsolóval bármikor szabadon válthat közöttük.

### Módok váltása

- **Blokk → Szakértő:** az aktuális program szöveggé alakul (soronként egy utasítás, címkék, makrók direktívákként). A Szakértő módban végzett szerkesztések visszaszinkronizálódnak a blokk tömbbe, valahányszor visszaváltasz vagy egy műveletet elindítasz.
- **Szakértő → Blokk:** a szöveget a `parseAsmText()` függvénnyel elemzi, és az eredmény felülírja a blokkprogramot. Sikertelen elemzés esetén fordítási hibaüzenet jelenik meg.
- **Az üres sorok** megőrződnek a körbe-körbe váltás során: a Szakértő szerkesztőben az üres sorok vékony szaggatott térközökként jelennek meg Blokk módban, és üres sorként állnak vissza, amikor visszaváltunk Szakértő módba.

### Szerkesztő elrendezése

```
┌──────────────────────────────────────────────────────┐
│ [toolbar]  Block │ Expert < tab toggle               │
├────────────┬────────────────────────────┬────────────┤
│  Palette   │   ASM text editor          │  Disasm    │
│  (opt.)    │   (monospace, editable)    │  panel     │
│            │                            │  (opt.)    │
└────────────┴────────────────────────────┴────────────┘
```

| Panel               | Váltás                    | Leírás                                                                                                                   |
| ------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Paletták**        | `#szakértői-paletta-gomb` | A bal oldali blokkpaletta – húzzon blokkokat a szerkesztőbe, vagy kattintson a kurzorhoz való beszúráshoz                |
| **ASM szerkesztő**  | mindig látható            | Teljesen egyszélességű szövegterület élő szintaxiskiemeléssel                                                            |
| **Hamisítás panel** | `#szakértői-disazm-gomb`  | Pure 6502 szétszerelés: minden utasítás címet, hex bájtokat és numerikus operandusokat mutat; a makrók teljesen kibontva |

### Eszköztár gombjai

| Gomb                                      | azonosító                                                   | Funkció                                                                                                                                                                                                                                                                                      |
| ----------------------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Formátum**                              | `#szakértői formátum gomb`                                  | Forrás automatikus formázása (0. oszlop címkéi, 4-es behúzás, 1-es mnemonikus/operandus)                                                                                                                                                                                                     |
| ** .asm betöltése**                       | `#szakértői-asm-betöltés-gomb`                              | Nyisson meg egy `.asm` fájlt — a tartalom egy **új fülre** töltődik be, amelynek címkéje a fájlnév lesz. Minden betöltött fájl független fül lesz, saját programblokkokkal és szerkesztőállapottal.                                                                                          |
| ** .asm mentése**                         | `#szakértői-mentés-asm-gomb`                                | Szerkesztő tartalmának mentése `.asm` fájlba (fájl párbeszédablak az első mentéskor)                                                                                                                                                                                                         |
| **Build információk**                     | `#szakértői-építési-info-gomb`                              | Nyissa meg az Építési információk párbeszédpanelt (eredet, méret, címkék, hibák)                                                                                                                                                                                                             |
| **HL**                                    | `#szakértői-hl-gomb`                                        | Szintaxiskiemelések be-/kikapcsolása (nagyon nagy fájlok esetén letiltás)                                                                                                                                                                                                                    |
| **Automatikus kiegészítés**               | `#szakértői-automatikus-kiegészítés-gomb`                   | Szakértői automatikus kiegészítési javaslatok be- és kikapcsolása. Ha le van tiltva, nem jelenik meg utasítás, emlékeztető vagy címke felugró ablak a szakértői szerkesztőben.                                                                                                               |
| **Régió kiválasztása**                    | `#szakértői-régió-kiválasztó-gomb`                          | Szakértő módban be-/kikapcsolja az automatikus régiók kiemelését. A hajtási állapot tárolva marad, de kikapcsolt állapotban a szerkesztő láthatóvá teszi a teljes forráskódot, és nem választja ki automatikusan az aktuális régiót.                                                         |
| **Összes régió összecsukása / kibontása** | `#szakértői-régió-összes-gombfelhajtás`                     | Egyetlen kattintással összehajthatja vagy kibonthatja az összes `.region` blokkot. Ha bármelyik régió meg van nyitva, a gomb az összeset összecsukja; ha már minden régió össze van csukva, a következő kattintás az összeset kibontja. A gomb világít, ha az összes régió össze van csukva. |
| **Sorszámok**                             | `#szakértői-sorszámok-gomb`                                 | Be-/kikapcsolhatod a sorszámozás utáni kötésmargót a szerkesztő bal oldalán. A kötésmargó szinkronban marad a görgetési pozícióval, és gépelés közben frissül élőben.                                                                                                                        |
| **Keresés**                               | `#szakértői-kereső-gomb`                                    | Nyisd meg a lebegő keresősávot (`Ctrl+F`). Gépelj be a kereséshez; a találatok kiemelve jelennek meg az átfedésben. Az `Enter` / `Shift+Enter` navigál a találatok között. Az `Escape` bezárja a sávot.                                                                                      |
| **Kicsinyítés / Kicsinyítés**             | `#szakértői-kicsinyítés-gomb` / `#szakértői-közelítés-gomb` | A szerkesztő betűméretének csökkentése/növelése (8–28 px). A beállítás megmarad.                                                                                                                                                                                                             |
| **Paletták**                              | `#szakértői-paletta-gomb`                                   | A bal oldali mnemonikus paletta megjelenítése/elrejtése                                                                                                                                                                                                                                      |
| **Diazmus**                               | `#szakértői-disazm-gomb`                                    | A szétszerelési panel megjelenítése/elrejtése (tiszta 6502, makrók kibontva)                                                                                                                                                                                                                 |
| **Monitor**                               | `#szakértői-monitor-gomb`                                   | A monitor hex-dump paneljének megjelenítése/elrejtése                                                                                                                                                                                                                                        |
| **Minitérkép**                            | `#szakértői-minitérkép-gomb`                                | A kód minitérkép sávjának megjelenítése/elrejtése a szerkesztő jobb oldalán                                                                                                                                                                                                                  |

Szerkesztői gyorsbillentyűk: Az `Ctrl+/` (macOS rendszeren `Cmd+/`) a jelenlegi sort vagy minden kijelölt sort kommentbe helyez; az `Shift` hozzáadása eltávolítja a vezető kommentjelölőt ezekből a sorokból. A beágyazott kommentek (például `LDA $12 ; magyarázat`) az utasítássorban maradnak a Szakértő és a Blokk mód közötti váltáskor. Blokk módban zöld dőlt betűvel ` jelennek meg; megjegyzés` jelölőként a blokk fejlécében; a jelölő fölé mutató egérmutató a teljes szöveget mutatja, ha csonkolva van.

### Szakértő szerkesztő minitérkép

A Szakértői szerkesztő minitérképe egy keskeny vászoncsík (`88 px`) a szerkesztőterület jobb szélén. Minden forrássor kicsinyített ábrázolását jeleníti meg:

| Sáv színe        | Token típusa                                              |
| ---------------- | --------------------------------------------------------- |
| Megjegyzés színe | `;` kezdetű sorok                                         |
| Címke színe      | `címkével ellátott vonalak:` definíció                    |
| Irányelv színe   | `.byte`, `.macro`, `.region` és az összes többi direktíva |
| Emlékeztető szín | Minden más (utasítások)                                   |

Egy **félig átlátszó nézetablak-jelző** (ékezetes színű téglalap) mutatja, hogy a forrás melyik része látható jelenleg. Kattintson a minitérkép bármely pontjára, hogy arra a pozícióra ugorjon; húzással görgethet folyamatosan. A minitérkép függetlenül görgethető, hogy a nézetablak-jelző középen maradjon. Az állapot a felhasználói felület beállításaiban marad megőrzve (`expertMinimap` billentyű).

### Hiba a kiemelés során

A sikertelenül lefordított sorokat valós időben **piros** (színezett háttér + bal oldali ékezetes szegély) jelöli a program, minden billentyűleütés után 350 ms-mal. Az első hibaüzenet az állapotsorban is megjelenik. Javítsa ki a sort, és a kiemelés automatikusan eltűnik.

### Szintaxis kiemelése

A szerkesztő egy átlátszó `<div>` réteget (`expert-hl`) használ, amely a szövegterület tartalmát színes `<span>` elemekkel tükrözi. A kiemelés kikapcsolható az **HL** gombbal a nagyon nagy programok teljesítményének javítása érdekében.

| Szín       | Jelképes                                                                                                                                              |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sárgászöld | Mnemonikok (`LDA`, `STA`, `JMP`, …) és hosszú elágazású pszeudo-opciók (`LBNE`, `LBEQ`, …)                                                            |
| Kék        | Irányelvek (`.byte`, `.word`, `.fill`, `.assert`, `*=`, …)                                                                                            |
| Narancs    | Számok (`$FF`, `%1010`, `255`)                                                                                                                        |
| Cián       | Címkék — `:` végződésű sorok, beleértve a lokális címkéket (`.loop:`) és az önmódosító kódú operandus címkéket (`value:` az `LDA value:#$00` részben) |
| Böjti réce | Karakterlánc literálok                                                                                                                                |
| Sötétzöld  | Hozzászólások (`; …`)                                                                                                                                 |

A `REGION` / `ENDREGION` direktívák a többi assembler direktívához hasonlóan kiemelve jelennek meg. Az összecsukott régiók csak a régió fejlécét tartják láthatónak a szerkesztőben, amíg újra meg nem nyitod őket. Az új **Region selection** eszköztár kapcsolója csak az automatikus aktuális régió kiemelését vezérli Szakértő módban; kikapcsolása esetén a forrás látható marad a hajtási állapot megváltoztatása nélkül.

### Forrásformázó

Kattintson az **Formátum** gombra (`#expert-format-btn`) az aktuális forrás automatikus formázásához:

- A címkedefiníciók a 0. oszlopba kerülnek.
- Az utasítások 4 szóközzel vannak behúzva.
- A mnemonikus szavak nagybetűsek.
- Pontosan egy szóköz a mnemonikus és az operandus között (a plusz szóközök normalizáltak).
- Ha a forrás már formázott, akkor a `„Már formázva”` állapot jelenik meg.

### Projekt panel és fülek

A Szakértő mód támogatja a **projektpanelt** (`#expert-project-panel`) többfájlos `.proj` projektekhez:

- Az `.proj` fájl egy JSON manifest, amely felsorolja a forrásfájlokat és azok metaadatait.
- Nyiss meg egy projektet a **Menü → Fájl → Projekt megnyitása** menüponttal, vagy húzz egy `.proj` fájlt az ablakba.
- A projektben található minden fájl külön **fülként** nyílik meg a szerkesztő tetején található fülsávon.
- **Projekt bezárása** (`Menü → Fájl → Projekt bezárása` / `#menu-close-project`) egyszerre bezárja az aktuális projektet és az összes fájlfülét. Bezárás előtt rákérdez a nem mentett módosítások mentésére. A projektpanel visszaáll üres állapotába, és az `_expertProjectData` törlődik.
- Minden fájl megjelölhető **indítófájlként** (★ csillag ikon). Amikor beállít egy indítófájlt, a **Futtatás** gomb (PRG, D64, Ultimate) mindig összeállítja és futtatja az adott fájl kódját – függetlenül attól, hogy melyik lap aktív. Ez blokk módban és Szakértő módban is működik.
- A projektpanel alján található **szimbólumok** szakasz függőlegesen átméretezhető a fájlfa és a szimbólumlista közötti elválasztóval, így a hosszú szimbólumlisták szükség esetén több helyet foglalhatnak el.

### Tab sáv

A fülsáv a szerkesztő felett jelenik meg, ha egynél több fül van megnyitva.

| Jellemző                         | Leírás                                                                                                                                                                                                                                                                                                                      |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Piszkos pötty**                | A lap nevében egy kis, színes pont jelzi a nem mentett módosításokat.                                                                                                                                                                                                                                                       |
| **Görgetőnyilak**                | Bal/jobb görgetőgombok jelennek meg, ha több fül van, mint amennyi elfér a sávon                                                                                                                                                                                                                                            |
| **Bezárás (×)**                  | Bezárja a fület; mentésre kér, ha a fül piszkos                                                                                                                                                                                                                                                                             |
| **Fájlkiterjesztés**             | A teljes fájlnév, beleértve a kiterjesztést is (`.c64va`, `.json`), látható.                                                                                                                                                                                                                                                |
| **Jobb gombbal előhívható menü** | Jobb klikk egy fülre (vagy üres fülsávra) a következőkhöz: **Új fül**, **Fül bezárása**, **További fülek bezárása**, **Jobb oldali fülek bezárása**, **Összes fül bezárása**. Kötegelt bezárási műveletek kérése minden piszkos fülön, és leállítás, ha megszakítja. Az **Összes bezárása** mindig egy üres fület hagy meg. |

> **Tipp:** A Paletta szinkronizálása (`#expert-palette-sync-btn`) szinkronban tartja a paletta kiválasztását a kurzornál lévő emlékeztetővel. Kapcsold ki, ha nem szeretnéd, hogy a paletta ugráljon szerkesztés közben.

---

## 7. Címzési módok

Minden 6502-es utasítás egy vagy több címzési módot támogat. A módválasztó minden blokkon megjelenik.

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
| **indirectY**   | Közvetett, Y   | `LDA ($FB),Y`       | Nulla oldalas indirekt indexelés (operandus = nulla oldalcím, 1 bájt)          |
| **közvetett**   | Közvetett      | `JMP (0100 dollár)` | Közvetett; csak JMP-vel használható                                            |

### Kifejezések operandusként való címkézése

Bármely operandusmező, amely címet vagy azonnali értéket fogad el, közvetlenül elfogad egy **konstans nevű** értéket is (egy `CONST` blokkból vagy egy `LABEL`-ből). Ezenkívül használhatod a **label+offset** vagy az **label−offset** kifejezéseket egy elnevezett konstanshoz viszonyított címre való hivatkozáshoz:

| Szintaxis         | Példa                      | Leírás                                                                                                             |
| ----------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `címke`           | `STA képernyő_RAM,X`       | Feloldódik a címke/állandó értékére                                                                                |
| `címke+$hex`      | `STA képernyő_RAM+$0100,X` | Címkecím plusz egy hexadecimális eltolás                                                                           |
| `címke+decimális` | `STA képernyő_RAM+256,X`   | Címkecím plusz egy tizedes eltolás                                                                                 |
| `címke-$hex`      | `LDA asztal - 10 dollár`   | Címkecím hexadecimális eltolás nélkül                                                                              |
| `#<címke`         | `LDA #<képernyő_RAM`       | A címke címének alsó bájtja                                                                                        |
| `#&gt;címke`      | `LDA #&gt;képernyő_RAM`    | A címke címének felső bájtja                                                                                       |
| `*`               | `BNE *`                    | Aktuális programszámláló (az utasítás saját címe); az `*` elágazások végtelen önhurkot generálnak (eltolás: `$FE`) |

**Példa — két képernyőoldal törlése CONST használatával:**
```
; .CONST screen_ram = $0400
    LDX #$00
clear:
    STA screen_ram,X
    STA screen_ram+$0100,X
    DEX
    BNE clear
```

### Az `*` programszámláló kifejezésekben

*(Újdonság a 2.3.9-es verzióban.)* `*` már nem korlátozódik a teljes operandusra – megjelenhet **egy operanduskifejezésen belül bárhol**, és annak az utasításnak a címét jelöli, amelyre írták. Assembly időben feloldódik az utasítás valódi címe alapján, így nincs szükség címkére a rövid relatív ugrásokhoz vagy a PC-hez viszonyított adatolvasásokhoz.

| Szintaxis           | Példa                      | Jelentés                                            |
| ------------------- | -------------------------- | --------------------------------------------------- |
| `*`                 | `BNE *`                    | Elágazás önmagához (végtelen ciklus, eltolás `$FE`) |
| `*-n` / `*+n`       | `BNE *-5`, `BEQ *+4`       | Elágazás az aktuális PC-hez képest *n* bájttal      |
| `JMP *+n`           | `JMP *+20`                 | Az aktuális PC-ből számított abszolút ugrás         |
| `#&lt;*` / `#&gt;*` | `LDA #&lt;*`, `LDA #&gt;*` | Az aktuális PC alacsony/magas bájtja                |
| `#&gt;(*+n)`        | `LDA #&gt;(*+63)`          | PC-hez viszonyított cím alsó/felső bájtja           |

**PC vs. szorzás.** Az `*` csak akkor kezeli a programszámlálót, ha az *értékpozícióban* található — a kifejezés elején, vagy közvetlenül egy operátor, `(`, `,`, `&lt;`, `&gt;` vagy szóköz után. Egy `*`, amely egy számot, `)` vagy egy azonosítót követ, közönséges szorzásnak minősül, tehát az `LDA table*2` és a `CONST_A*4` változatlanok maradnak.

**Hol működik.** Bármely operandus, amely már elfogad egy kifejezést: elágazási célpontok, `JMP` / `JSR`, `LDA`/`STA`/… abszolút és indexelt, azonnali alacsony/magas bájtos operátorok, és az `.assert` kifejezés. Az `*` soha nem változtatja meg egy utasítás méretét, így minden címzési módban biztonságos.

### Helyi (pontozott) címkék

*(Újdonság a 2.3.9. verzióban.)* Egy ponttal kezdődő címke — `.loop`, `.skip`, `.done` — egy **lokális címke**. A legközelebbi megelőző **global** (nem pontozott) címke hatókörébe tartozik, és belsőleg `<global>.<name>` lesz. Két azonos rövid nevű, különböző globális címkék alatti lokális címke nem ütközik **nem**.

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

- Egy hatókörön belül a következőképpen hivatkozz egy helyi címkére: `.name`.
- Egy másik hatókörből explicit módon hivatkozz rá `Global.name` néven (pl. `JMP ClearScreen.loop`).
- Egy globális címke elé írt `.name` továbbra is egy egyszerű legfelső szintű `.name` marad.
- A lokális címkék változatlanok maradnak a Blokk ⇄ Szakértő módban; az `<globális>.` előtag egy elrendezési idejű részlet, és soha nem kerül tárolásra a blokkprogramban.

### Önmódosító kód operandus címkéi

*(Újdonság a 2.3.9-es verzióban.)* Az utasítás operandusának elé `címke:` kerül, hogy a címkét az **operandus bájtjára helyezzük el ** az opkód helyett. Az utasítás a kettőspont utáni értékből áll össze.

```
setup:
    LDA value:#$00     ; 'value' -> address of the #$00 operand byte
    ...
patch:
    LDA #new
    STA value          ; writes the operand byte directly — classic SMC
```

Az `érték` az `<utasításcím> + 1` (az első operandus bájt) címre mutat, minden címzési mód esetén. Ez felváltja a régebbi `STA utasítás+1` / `utasítás: LDA #$00` mintát. Blokk ⇄ Szakértő módban körbejár (az operandus mező megtartja az `címke:` előtagot).

---

## 8. Standard 6502 utasítások

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

*(Újdonság a 2.3.9-es verzióban.)* A **Hosszú ágak** palettakategória nyolc pszeudo-opciót tartalmaz, amelyek feltételes elágazásokként viselkednek, de **bármely címet** érnek el, nem csak a −128…+127 címet. Mindegyik egy invertált ágat alkot, amely kihagy egy 3 bájtos `JMP` címet — mindig **5 bájtot**:

```
LBEQ done      ; assembles to:   BNE *+3   ($D0 $03)
               ;                 JMP done  ($4C lo hi)
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

- Operandus: egy címke, egy `*`-kifejezés, vagy egy literál cím – ugyanaz, mint egy normál ágcélpontnál.
- Költség: 5 bájt és 1 extra ciklus a megtett útvonalon egy rövid ághoz képest. Rövid ágak esetén nincs automatikus előléptetés – explicit módon kell kiválasztani az `LBxx` ágat.
- Amikor egy sima ág (`BNE`, `BEQ`, …) kívül esik a tartományon, a fordítási hiba mostantól megnevezi a pontos túllépést, és javaslatot tesz az egyező `LBxx`-re.

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

### Shift & Rotate

| Emlékezeterősítő    | Leírás                            |
| ------------------- | --------------------------------- |
| `Amerikai jelnyelv` | Aritmetikai balra eltolás         |
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

Ezek haladó használatra készültek. Óvatosan használja – a viselkedés chipenként eltérő lehet.

`LAX`, `SAX`, `DCP`, `ISC`, `SLO`, `RLA`, `SRE`, `RRA`, `ANC`, `ALR`, `ARR`, `AXS`

---

## 9. Makróblokkok – Referencia

A makróblokkok lehetővé teszik a gyakori feladatok egyetlen lépésben történő elvégzését – ahelyett, hogy kézzel írnál 10-20 utasítást, eldobsz egy blokkot, és az assembler generálja helyetted a kódot. Gondolj rájuk beépített alprogramokként.

---

### LABEL

Mint egy ** sorszám a BASIC**-ben — de névvel a szám helyett. Ugrási célpontok a `JMP`, `JSR`, `BNE` stb. fájlokhoz.

| Mező       | Leírás                                                    |
| ---------- | --------------------------------------------------------- |
| Címke neve | Az `JMP`, `JSR`, `BNE` stb. fájlokban használt azonosító. |

**Szakértői szintaxis:**
```
loop:
```

**Generált ASM:**
```
loop:  ; $0820
```

Az aktuális cím megjegyzésként jelenik meg. A címkék mérete **0 bájt **.

---

### COMMENT

Mint a BASIC**-ben szereplő **REM — egy megjegyzés magadnak, amit az assembler teljesen figyelmen kívül hagy.

**Szakértői szintaxis:**
```
; Your comment text here
```

**Generált ASM:**
```
; Your comment text here
```

---

### BYTE

Mint az **DATA a BASIC**-ben — nyers bájtértékek listáját tárolja a programban.

| Mező      | Leírás                                                                    |
| --------- | ------------------------------------------------------------------------- |
| Operandus | Vesszővel elválasztott bájtértékek (pl. `$01, $02, $FF` vagy `1, 2, 255`) |

**Szakértői szintaxis:**
```
.byte $01, $02, $FF
```

**Generált ASM:**
```
    .byte $01, $02, $FF
```

**Lo/hi byte címke hivatkozások:** A BYTE elfogadja a KickAssembler / ca65 stílusú `<label` (alacsony bájt) és `>label` (magas bájt) tokeneket a numerikus értékek mellett. Az assembler fordítási időben feloldja a címke címét, és beszúrja a megfelelő bájtot. Példa:

```
    .byte <frame_0, >frame_0, <frame_1, >frame_1
```

Ez a(z) `frame_0` címének alsó bájtját tárolja, majd a felső bájtot, végül pedig ugyanezt a(z) `frame_1` címét. Hasznos ugrótáblák és címlisták létrehozásához.

**Méret:** A listában lévő bájtok száma.

---

### WORD

Mint a BASIC **DATA függvénye, de 16 bites számokhoz **. Minden érték két bájtként tárolódik (először az alacsony bájt, majd a magasabb – 6502 kis-endián sorrend).

| Mező      | Leírás                                                       |
| --------- | ------------------------------------------------------------ |
| Operandus | Vesszővel elválasztott 16 bites értékek (pl. `$0400, $C000`) |

**Szakértői szintaxis:**
```
.word $0400, $C000
```

**Generált ASM:**
```
    .word $0400, $C000
```

**Méret:** 2 bájt szavanként.

---

### FILL

Mint például a `FOR I=1 TO N : POKE addr+I, val : NEXT` — egy memóriablokkot tölt ki ugyanazzal a bájttal, de egyetlen blokkban. Nagyszerű területek törlésére vagy táblázatok előzetes feltöltésére.

| Mező      | Leírás                                                  |
| --------- | ------------------------------------------------------- |
| Operandus | `count,value` — pl. `256,0` 256 bájtot nullával tölt ki |

**Szakértői szintaxis:**
```
.fill 256, $00
```

**Generált ASM:**
```
    .fill 256, $00
```

**Kifejezés szintaxisa:** Mind a `count`, mind az `value` elfogad aritmetikai kifejezéseket. Hivatkozhatsz CONST nevekre, használhatsz hex/bináris literálokat, és meghívhatsz beépített matematikai függvényeket:

| Kifejezés                   | Jelentés                              |
| --------------------------- | ------------------------------------- |
| `CSEMPE_SZÁMA, $00`         | count from a CONST, value hex literal |
| `40*25, 0`                  | soron belüli szorzás                  |
| `round(sin(PI/4)*255), $80` | trigonometria                         |

**Beépített függvények:** `sin()`, `cos()`, `round()`, `max(a,b)`, `min(a,b)`, `abs()`, konstans `PI`

Operátorok: `+ - * /` Literálok: `$FF` (hex), `%10110000` (bináris) Alacsony/magas bájt: `lo(kifejezés)`, `hi(kifejezés)`

**Méret:** A számláló értéke bájtban.

---

### ALIGN

Nullákkal kiegészített bájtok beszúrásával az aktuális címet előrecsúsztatja a következő tiszta határra. A C64 megköveteli, hogy a sprite adatok 64 bájtos határon kezdődjenek — az `ALIGN 64` ezt automatikusan kezeli.

| Mező  | Leírás                                                                     |
| ----- | -------------------------------------------------------------------------- |
| Határ | Igazítási érték — pl. `64` (sprite határ), `256` (oldal), `$2000` (bitkép) |

**Szakértői szintaxis:**
```
.align 64
.align $2000
```

**Generált ASM:**
```
    ; ALIGN 64 → $0840 (12 bytes padding)
```

**Méret:** Dinamikus — az aktuális programszámláló pozíciójától függ.

> **Tipp:** Használj `ALIGN 64` igazítást sprite adatok előtt, `ALIGN 256` igazítást az oldalhoz igazított táblázatok biztosításához.

---

### TEXT

A **PRINT AT** parancshoz hasonlóan — közvetlenül a C64 képernyőjére írja a szöveget egy adott oszlopba és sorba, a KERNAL használata nélkül. Karakterenként egy LDA/STA párt generál, a képernyő RAM-ját a `$0400` tárolóhelyre célozva.

| Mező                     | Leírás                                                          |
| ------------------------ | --------------------------------------------------------------- |
| Szöveg                   | A megjelenítendő karakterlánc                                   |
| X                        | Oszlop (0–39)                                                   |
| Y                        | Sor (0–24)                                                      |
| Címke (opcionális)       | Hozzárendel egy címkét, amely a kiszámított képernyőcímre mutat |
| Kisbetűs karakterkészlet | Jelölőnégyzet – lásd alább                                      |

**Karakterkészlet módok:**

A C64 két karakterkészlettel rendelkezik, amelyek futásidőben választhatók ki:

| Mód                                      | $D018 1. bit | Nagybetűs bevitel                 | Kisbetűs bevitel               |
| ---------------------------------------- | ------------ | --------------------------------- | ------------------------------ |
| **Nagybetűs/grafikus** (alapértelmezett) | 0            | `A`–`Z` → képernyőkódok $01–$1A ✓ | nagybetűként kezelve is        |
| **Kisbetű/nagybetű** (CHARSET után)      | 1            | `A`–`Z` → $01–$1A (nagybetűs)     | `a`–`z` → $41–$5A (kisbetűs) ✓ |

- **Nagybetűs karakterkészlet (alapértelmezett, jelölőnégyzet nincs bejelölve):** Írja be, amit nagybetűvel szeretne látni. A `"HELLO"` így jelenik meg: `HELLO`. A kisbetűs bevitel nagybetűs képernyőkódokhoz van rendelve.
- **Kisbetűs karakterkészlet (jelölőnégyzet bejelölve):** Írd be a kívánt kis- és nagybetűméretet. `"hello"` → kisbetűs megjelenítés, `"HELLO"` → nagybetűs megjelenítés. Futásidejű karakterkészlet-váltást igényel a képernyőre írás előtt (használd a **CHARSET lower** makrót).

**Generált ASM (nagybetűs mód, `"HELLO"`):**
```
    LDA #$08      ; 'H' screen code $08
    STA $0400
    LDA #$05      ; 'E' screen code $05
    STA $0401
    ...
```

**Szakértői szintaxis:**
```
.text 0, 2, "HELLO"           ; uppercase charset (default)
.text 0, 2, "hello", lower    ; lowercase charset
```

A karakterek **képernyőkódként** vannak kódolva (nem PETSCII). **Méret:** `szöveghossz × 5` bájt (LDA + STA karakterenként).

---

### STRING

Mint például egy ** karakterlánc beszúrása ** bármely memóriacímre futásidőben. LDA/STA párokat generál, amelyek minden karakter képernyőkódját egymást követő címekre másolják.

| Mező                     | Leírás                                                                               |
| ------------------------ | ------------------------------------------------------------------------------------ |
| Szöveg                   | A kiírandó karakterlánc                                                              |
| Cím                      | Cél memóriacím — `$C000` hex vagy egy **címkenév**                                   |
| Címke (opcionális)       | Hozzárendel egy címkét, amely a célcímre mutat                                       |
| Váltás                   | Hex érték (00–FF) hozzáadva minden képernyőkód bájthoz (pl. `$80` = fordított videó) |
| Kisbetűs karakterkészlet | Jelölőnégyzet – ugyanaz a szemantika, mint a TEXT esetében (lásd a TEXT részt)       |

**Szakértői szintaxis:**
```
.string $C000, "HELLO"                  ; uppercase charset (default)
.string $C000, "hello", lower           ; lowercase charset
.string $C000, "HELLO", 80             ; with shift (reverse video)
.string $C000, "hello", 80, lower      ; shift + lowercase
.string $C000, "HELLO" :my_string      ; with macroLabel
```

**Generált ASM:**
```
    LDA #$08      ; 'H' screen code
    STA $C000
    LDA #$05      ; 'E' screen code
    STA $C001
    ...
```

A karaktereket **képernyőkódként** kódoljuk (nem PETSCII). Az opcionális **Shift** érték minden bájthoz hozzáadódik, pl. `$80` fordított videó esetén. **Méret:** `text.length × 5` bájt (karakterenként egy LDA + egy STA).

---

### DATA

Mint egy **POKE ciklus** — futásidőben egy nyers bájtok listáját írja ki egy memóriacímre, bájtonként egy LDA/STA párt.

| Mező               | Leírás                                             |
| ------------------ | -------------------------------------------------- |
| Bájtok             | Vesszővel elválasztott bájtértékek                 |
| Cím                | Cél memóriacím — `$C000` hex vagy egy **címkenév** |
| Címke (opcionális) | Hozzárendel egy címkét, amely a célcímre mutat     |

**Szakértői szintaxis:**
```
.data $C000, $01, $02, $03          ; hex address
.data my_buf, $01, $02, $03         ; label address
.data $C000, $01, $02, $03 :mydata  ; with macroLabel
```

**Generált ASM:**
```
    LDA #$01
    STA $C000
    LDA #$02
    STA $C001
    ...
```

**Méret:** `bájt_szám × 5` bájt (egy LDA + egy STA bájtonként).

---

### RAWBYTES

Mint az **DATA, ami közvetlenül a memóriába töltődik** – egyáltalán nincs futásidejű kód. A bájtok a PRG betöltésének pillanatától kezdve jelen vannak, még mielőtt a kódod elindulna. Használd ezt sprite adatokhoz, szinttérképekhez, keresőtáblákhoz, bármihez, aminek csak egy adott címen kell lennie.

| Mező               | Leírás                                             |
| ------------------ | -------------------------------------------------- |
| Bájtok             | Vesszővel elválasztott bájtértékek                 |
| Cím                | Cél memóriacím — `$C000` hex vagy egy **címkenév** |
| Címke (opcionális) | Hozzárendel egy címkét, amely a célcímre mutat     |

**Szakértői szintaxis:**
```
.rawbytes $C000, $00, $00, $00      ; hex address
.rawbytes sprite_data, $00, $00     ; label address
.rawbytes $0C50, $00, $00 :nev      ; with macroLabel — other code can use LDA nev,X
```

**Méret a kódban:** 0 bájt. Az adat a kimenetben megadott címre kerül.

> **DATA vs RAWBYTES:** A DATA LDA/STA kódot generál, amely futásidőben másolja a bájtokat (lassabb, de működik, ha az adatoknak dinamikusnak kell lenniük). A RAWBYTES közvetlenül elhelyezi a bájtokat – nincs kód, azonnal, nulla költséggel.

---

### RAWTEXT

Mint a RAWBYTES, de szöveg esetén — képernyőkódként kódolja a karakterláncot, és a bájtokat egy fix címre helyezi **futásidejű kód nélkül **. A szöveg a PRG betöltése után azonnal készen áll a memóriában.

| Mező                     | Leírás                                                                               |
| ------------------------ | ------------------------------------------------------------------------------------ |
| Szöveg                   | Kódolandó karakterlánc                                                               |
| Cím                      | Cél memóriacím — `$C000` hex vagy egy **címkenév**                                   |
| Címke (opcionális)       | Hozzárendel egy címkét, amely a célcímre mutat                                       |
| Váltás                   | Hex érték (00–FF) hozzáadva minden képernyőkód bájthoz (pl. `$80` = fordított videó) |
| Kisbetűs karakterkészlet | Jelölőnégyzet – ugyanaz a szemantika, mint a TEXT esetében (lásd a TEXT részt)       |

**Szakértői szintaxis:**
```
.rawtext $C000, "HELLO"                 ; uppercase charset (default)
.rawtext $C000, "hello", lower          ; lowercase charset
.rawtext $C000, "HELLO", 80            ; with shift (reverse video)
.rawtext $C000, "hello", 80, lower     ; shift + lowercase
.rawtext $0400, "HELLO" :my_text       ; with macroLabel
```

**Generált ASM:**
```
; .rawtext "HELLO" -> $C000
; $C000
    .byte $08, $05, $0C, $0C, $0F   ; H E L L O (uppercase screen codes)

; .rawtext "hello", lower -> $C000
; $C000
    .byte $48, $45, $4C, $4C, $4F   ; h e l l o (lowercase screen codes $41–$5A range)
```

**Méret a kódban:** 0 bájt. Az adat a kimenetben megadott címre kerül.

> **STRING vs RAWTEXT:** A STRING LDA/STA kódot generál, amely futásidőben másolja a szöveget. A RAWTEXT betöltéskor beépíti a bájtokat a PRG-be – nincs kód, nincs várakozás.

---

### PETSCII

Mint az **RAWBYTES, de a KERNAL kimenete ** — PETSCII bájtként kódolja a karakterláncot (kompatibilis a CHROUT-tal a `$FFD2` címen), és fix címre helyezi őket futásidejű kód nélkül. Ezt akkor használd, ha karaktereket szeretnél kinyomtatni a `JSR $FFD2` címen keresztül egy ciklusban, és vedd figyelembe, hogy az új `PRINT` makró ugyanazt a kódolót és kisbetűs jelölőnégyzet viselkedést használja.

> **PETSCII vs. képernyőkódok:** A PETSCII és a képernyőkódok két különböző kódolás. A képernyőkód: `$01` = A betű; a PETSCII `$41` = A betű (CHROUT-on keresztül). A PETSCII-t csak KERNAL-on keresztüli nyomtatáskor használd; a képernyő RAM-jába való közvetlen íráshoz használd a TEXT/STRING/RAWTEXT kódolást.

| Mező               | Leírás                                             |
| ------------------ | -------------------------------------------------- |
| Szöveg             | PETSCII bájtként kódolandó karakterlánc            |
| Cím                | Cél memóriacím — `$C000` hex vagy egy **címkenév** |
| Címke (opcionális) | Hozzárendel egy címkét, amely a célcímre mutat     |
| Kisbetűs PETSCII   | Jelölőnégyzet – lásd alább                         |

**Karakterkészlet módok:**

| Mód                                             | Nagybetűs bevitel (`A`–`Z`)                                                                                                      | Kisbetűs bevitel (`a`–`z`)         |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| **Nagybetű (alapértelmezett, nincs bejelölve)** | `$41`–`$5A` (PETSCII nagybetűs CHROUT-on keresztül)                                                                              | szintén leképezve a `$41`–`$5A`-re |
| **Kisbetűs (bejelölve)**                        | Az ábécé betűi át lettek képezve, így a látható kis- és nagybetűs karakterkészletben a kis- és nagybetűk változatlanok maradnak. | Ugyanaz a szabály                  |

**Szakértői szintaxis:**
```
.petscii $C000, "HELLO"              ; uppercase PETSCII (default)
.petscii $C000, "hello", lower       ; lowercase PETSCII ($61–$7A)
.petscii $C000, "HELLO", null        ; with null terminator
.petscii $C000, "hello", lower, null ; lowercase + null terminator
.petscii $C000, "HELLO" :my_msg      ; with macroLabel
```

**Generált bájtok (nagybetűvel, `"SZIA"`):**
```
; $C000
    .byte $48, $45, $4C, $4C, $4F   ; H E L L O (PETSCII $41–$5A range)
```

**Méret a kódban:** 0 bájt. Az adat a célcímen késleltetett adatszakaszként kerül elhelyezésre (mint a RAWBYTES).

**Nulla terminátor:** Jelölje be az *"`$00` (null terminátor) hozzáfűzése"* jelölőnégyzetet, hogy automatikusan hozzáadjon egy `$00` bájtot a szöveg után. Ideális nullával lezárt ciklusokhoz:

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

**Kódolási szabályok:**

| Bemenet                                | Nagybetűs mód                        | Kisbetűs mód |
| -------------------------------------- | ------------------------------------ | ------------ |
| `A`–`Z`                                | `$41`–`$5A`                          | `$61`–`$7A`  |
| `a`–`z`                                | `$41`–`$5A` (kényszerített nagybetű) | `$41`–`$5A`  |
| Szóköz, számjegyek, írásjelek (32–126) | ahogy van                            | ahogy van    |
| Új sor                                 | `$0D` (VISSZATÉRÍTÉS)                | `$0D`        |
| Más                                    | `$20` (szóköz)                       | `$20`        |

> **Tipp:** Használj PETSCII-t a CHROUT-on keresztül kimenetre kerülő adatokhoz (`$FFD2`). Közvetlenül a képernyő RAM-ba való íráshoz használd a STRING vagy a RAWTEXT formátumot.

---

### CHARSET

Futásidőben a `$D018` 1. bitjének módosításával átkapcsolja a VIC-II karakter ROM-ot nagybetűs/grafikus mód (C64 alapértelmezett) és kisbetűs/nagybetűs mód között.

| Mező | Leírás                                                                                                                                                   |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mód  | **Kisbetűs** — engedélyezi a kisbetűs/nagybetűs karakterkészletet; **Nagybetűs** — visszaállítja az alapértelmezett nagybetűs/grafikus karakterkészletet |

**Szakértői szintaxis:**
```
.charset lower    ; switch to lowercase charset
.charset upper    ; switch back to uppercase/graphics charset
```

**Generált ASM:**

Kisbetűs mód:
```
    LDA $D018
    ORA #$02      ; set bit 1 → lowercase/uppercase ROM at $1800
    STA $D018
```

Nagybetűs mód:
```
    LDA $D018
    AND #$FD      ; clear bit 1 → uppercase/graphics ROM at $1000
    STA $D018
```

**Méret:** 8 bájt (LDA abs + ORA/AND imm + STA abs).

**Miért ORA/ÉS a közvetlen írás helyett?** `$D018` a képernyő RAM helyét is vezérli (7–4. bitek). Csak az 1. bit bekapcsolása őrzi meg a regiszter többi részét.

**Tipikus munkafolyamat:**

```
    CHARSET lower             ; switch to lowercase charset
    TEXT 0, 0, "hello world"  ; [checkbox: Lowercase charset]
    ...
    CHARSET upper             ; restore default when done
```

Vagy szakértői módban:
```
.charset lower
.text 0, 0, "hello world", lower
.charset upper
```

Szakértő módban az `.charset` blokk mostantól a mód legördülő menüben is végighalad, így a blokk előnézete és az exportált forráskód egy vonalban marad.

> **Megjegyzés:** A CHARSET makró csak a VIC karakter ROM mutatót módosítja. Nem hívja meg az `$E544` (KERNAL karakterkészlet init) függvényt. A legtöbb esetben ez elegendő; csak akkor hívja meg először az `JSR $E544` makrót, ha szüksége van arra, hogy a KERNAL saját nyomtatási rutinjai is figyelembe vegyék a változást.

---

### CHARDEF

Egyetlen 8×8-as egyéni karaktert definiál egy RAM-alapú karakterkészletben. Beágyazott futásidejű kódot bocsát ki, amely végrehajtáskor 8 bájtot másol a `base + index * 8` mappába – nincs szükség megelőző címkére vagy `ORG` indexre.

| Mező                 | Leírás                                                                                                               |
| -------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Karakterkészlet alap | A RAM karakterkészlet alapcíme (alapértelmezett: `$3800`). Úgy kell beállítani, hogy a VIC-II láthassa (lásd alább). |
| Karakterindex        | Melyik karakterhelyet kell újradefiniálni, 0–255. `65` = 'A' az alapértelmezett képernyőkód-elrendezésben.           |
| 8 bájt               | Vesszővel elválasztott bitképsorok, fentről lefelé. Minden bájt 7. bitje = a bal szélső képpont.                     |

**Szakértői szintaxis:**
```
.chardef $3800, 65, $18,$3C,$66,$7E,$66,$66,$66,$00
```

**Generált ASM (8 × `LDA #b` / `STA célpont+n`, összesen 40 bájt):**
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

**Cél címe:** `$3800 + 65 * 8 = $3A08`. Fordítási időben kiszámítva és fixen beépítve az STA operandusokba.

**Méret:** 40 bájt karakterenként (8 × 5).

**Tipikus munkafolyamat:**
```
    ; Point VIC-II at RAM charset at $3800
    LDA $D018
    AND #$F1
    ORA #$0E       ; bits 3-1 = %111 → charset at bank+$3800
    STA $D018

    CHARDEF $3800, 65, $18,$3C,$66,$7E,$66,$66,$66,$00   ; redefine 'A'
    CHARDEF $3800, 66, $7C,$66,$66,$7C,$66,$66,$7C,$00   ; redefine 'B'
    ; ... more CHARDEF calls for each custom char
```

**Mikor használjuk a CHARDEF-et alternatívákkal szemben:**

| Megközelítés                        | Használja, amikor                                                                                          |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **CHARDEF**                         | Szükséged lesz néhány egyéni karakterre (mondjuk 1–20). A futásidejű költség 40 bájt karakterenként.       |
| **RAWBYTES @ $3800**                | Teljes egyéni karakterkészlettel rendelkezik (256 karakter). Összesen 2 KB adat, nincs futásidejű másolat. |
| **INCBIN "charset.bin" @ $3800**    | Külső karakterkészletfájl (a Karakterszerkesztő által létrehozva). A legtisztább opció.                    |
| **Karakterkészlet vászon + INCBIN** | Teljes 256 karakteres bitkép egyetlen 128×128-as képként festve.                                           |

> **Igazítási emlékeztető:** A VIC-II a karakterkészlet bázisát `$0800` többszörösének várja. Érvényes bankok: `$0000`, `$0800`, `$1000`, ... , `$3800` (a jelenlegi 16 KB-os VIC bankon belül). A RAM karakterkészletek jellemzően `$2000`, `$2800`, `$3000` vagy `$3800` értéknél találhatók.

---

### BOX_HIT

Tengelyhez igazított határolókeret (AABB) ütközési teszt két, 4 bájtos nulla oldalas struktúrákkal leírt téglalap között. Az eredményt az akkumulátorban adja vissza: **A = 1** átfedés esetén, **A = 0** egyébként. Tisztán inline assembly, nincs alprogramhívás.

| Mező              | Leírás                                                                                    |
| ----------------- | ----------------------------------------------------------------------------------------- |
| Box1 irányítószám | Az első doboz 4 bájtos struktúrájának nulladik oldalas alapja (alapértelmezett: `$FB`).   |
| Box2 irányítószám | A második doboz 4 bájtos struktúrájának nulladik oldalas alapja (alapértelmezett: `$F7`). |

**Struktúra elrendezés** (4 bájt dobozonként, előjel nélküli 8 bites koordináták):

| Eltolás | Mező   |
| ------- | ------ |
| `+0`    | Balra  |
| `+1`    | Felső  |
| `+2`    | Jobbra |
| `+3`    | Alsó   |

**Szakértői szintaxis:**
```
.box_hit $FB, $F7
```

**Generált ASM (30 bájt, teljesen PC-relatív — nincsenek alprogramok, nincsenek abszolút ugrások):**
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

**Méret:** 30 bájt.

**Tipikus munkafolyamat:**

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

    BOX_HIT $FB, $F7        ; test player vs enemy → A = 0 or 1

    CMP #$01
    BNE no_collision
    JSR handle_hit
no_collision:
```

**Korlátozások:**
- Mindkét nulladik oldalcímnek `≤ $FC` értékűnek kell lennie (mindegyik mezőnek 4 egymást követő bájtból kell állnia: `zp`, `zp+1`, `zp+2`, `zp+3`).
- A koordinátákat **előjel nélküli 8-bites** (0–255) koordinátaként kezeli a rendszer. Az ezen a tartományon kívül eső előjeles sprite-koordinátákat tárolás előtt normalizálja.
- A két mező átfedheti egymást a ZP területen, ha szükséges, de általában 8 különálló bájtra van szükség.

**Miért ne lenne egy alprogram?** Az inline generálás elkerüli a JSR/RTS többletterhelést (14+ ciklus), és a tesztet forrón tartja a gyorsítótárban a szűk játékciklusok érdekében. Ha sok párt kell tesztelned, helyezd el a saját `JSR box_hit_sub`-edet manuálisan egyetlen BOX_HIT blokk köré.

**Összehasonlítás az UB `box_hit()` függvényével:** Az Ultimate Basic ugyanazt a 6502-es logikát használja, mint egy futásidejű függvény, amely egy változóra tér vissza. A VA-ban a BOX_HIT függvényt oda kell beilleszteni, ahol a tesztre szükség van; az eredmény az `A` mappában található.

---

### INCBIN

Mint a BASIC**-ben található **BLOAD — kiválaszt egy külső bináris fájlt (`.bin`, `.prg`, `.sid`, `.raw`) és közvetlenül beágyazza az összeállított PRG-be a megadott címen.

| Mező | Leírás                                                                 |
| ---- | ---------------------------------------------------------------------- |
| Fájl | Tallózással válasszon ki egy `.bin`, `.prg`, `.sid` vagy `.raw` fájlt. |
| Cím  | Cél betöltési cím (pl. `$C000`)                                        |

**Szakértői szintaxis:**
```
.incbin "music.bin", $C000
```

**Generált ASM megjegyzés:**
```
    ; INCBIN "music.bin" @ $C000 (2048 bytes)
    .byte $01, $02, ...
```

**Méret a kódban:** 0 bájt (elhalasztott adatszakasz). A bináris fájl a megadott címre van beágyazva.

---

### SID

Mint a **BLOAD a zenéhez** — betölt egy `.sid` fájlt a PRG-be, és automatikusan beolvassa az Init és Play címeket a fejlécből. Indításkor egyszer hívja meg az Init függvényt, majd minden képkockán hívja meg a Play függvényt az IRQ kezelőjéből.

| Mező                    | Leírás                                                                                                                      |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Fájl                    | Tallózással válasszon ki egy `.sid` fájlt                                                                                   |
| Egyéni cím (opcionális) | Írja felül a SID natív betöltési címét (pl. `$1000`). Hagyja üresen, ha a SID fejlécben található címet szeretné használni. |

A blokk a következőket jeleníti meg:
- **Cím / Szerző** a SID fejlécből
- **Betöltési cím** — az adat memóriában való elhelyezésének helye (effektív cím bármilyen felülbírálás után)
- **Init cím** — JSR-rel hívja meg ezt a függvényt a zene inicializálásához (egyéni cím használata esetén az áthelyezéshez igazítva)
- **Lejátszási cím** — ezt JSR-rel hívjuk meg minden IRQ kezelő keretén (áthelyezéshez igazítva)
- Egy **(áthelyezett)** jelvény jelenik meg, ha egy egyéni cím elmozdítja az adatokat az eredeti pozíciójukból.

**Szakértői szintaxis:**
```
.sid "Ikari_Warriors.sid"
.sid "Ikari_Warriors.sid", $1000
```

**Generált ASM megjegyzés:**
```
    ; SID "Ikari_Warriors.sid" @ $1000  Init:$1000  Play:$1006  (4096 bytes)
```

**Méret a kódban:** 0 bájt soronként. A SID bináris fájl a megadott címen, késleltetett chunkként kerül a PRG-be.

> **Fontos:** A legtöbb SID fájl fixen kódolt belső abszolút címeket tartalmaz. Ezek csak akkor helyezhetők át, ha a teljes bináris fájlt ugyanazzal az eltolással eltoljuk. Ha egy SID belső ugrásokkal rendelkezik `$10xx` címre, akkor `$1000` címen kell maradnia – egy másik címre való áthelyezése ezeket a belső hivatkozásokat megszakítja.

> **Tipikus használat:** Helyezzen el egy ORG blokkot a SID blokk elé a címének beállításához. Indításkor hívja meg az Init blokkot, majd hívja meg a Play minden képkockát egy raszteres IRQ kezelőből.

---

### INCLUDE

Mint az **MERGE a BASIC**-ben — behúz egy másik fájlt, és kibontja a blokkjait ezen a pozíción. Tökéletes újrafelhasználható alprogramkönyvtárakhoz. A beillesztett blokkok csak olvashatók az aktuális projektben.

Két fájltípus támogatott:
- **Visual Assembler projekt** (`.json`) — a projekt blokkjai eredeti állapotukban kerülnek beillesztésre.
- **Plain assembly source** (`.inc`, `.asm`, `.s`) — a fájl szövegként kerül beolvasásra és elemzésre ugyanúgy, mint a szakértői módban. Minden fordításkor a fájl újraolvasásra kerül a lemezről (az igazság forrása = a fájl), így külsőleg szerkeszthető bármilyen szerkesztővel.

| Mező                       | Leírás                                                                                                                                                                                                                                                                                |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fájl                       | Tallózással válasszon ki egy `.json` projektet vagy egy `.inc`/`.asm`/`.s` assembly forrást.                                                                                                                                                                                          |
| Betöltési cím (opcionális) | Ha be van állítva (hex, pl. `C000`), akkor a beszúrt blokkok erre a címre kerülnek – egy szintetikus `ORG` kerül beszúrásra eléjük, felülírva a beszúrt fájlban lévő ORG blokkokat. Hagyja üresen, ha azt szeretné, hogy a beszúrt fájl saját ORG blokkjai vezéreljék az elhelyezést. |

**Szakértői mód szintaxisa:**
```
.include "library.json"
.include "macros.inc", $1500
.include "sprites.asm"
```

- A(z) ** fájlkiterjesztés szükséges szakértői módban** — egy egyszerű nevet, mint például az `.include "macros"`, a rendszer `.include "macros.json"`-ként kezel.
- Útvonalfeloldás: először a projektfájl melletti (relatív) keresést indítja, majd visszatér az alkalmazáshoz mellékelt `samples/` könyvtárba.

**Generált ASM (címfelülírás nélkül):**
```
    ; .include "library.json" — 12 block(s)
    ... (expanded blocks follow)
```

**Generált ASM (`C000` betöltési címmel):**
```
    ; .include "library.json" @ $C000 — 12 block(s)
    *=$C000
    ... (expanded blocks follow)
```

> **Tipp:** Az INCLUDE segítségével újrafelhasználható alprogramkönyvtárakat hozhat létre, amelyeket megoszthat a projektek között. Az `.inc`/`.asm`/`.s` fájlok akkor a legjobbak, ha a könyvtárat egyszerű szövegszerkesztőben szeretné szerkeszteni, vagy más 6502 assemblerekkel szeretné megosztani; a `.json` fájlok pedig akkor, ha a könyvtár magában a Visual Assemblerben készült. Állítson be egy betöltési címet, ha a könyvtárnak nincs saját ORG-ja, vagy ha felül szeretné írni az alapértelmezett elhelyezését.

---

### TABLE

Mint az **DIM egy adott címen** — elnevezi a keresőtáblát, és meghatározza, hogy hol található a memóriában. A tábla tartalmának meghatározásához BYTE, WORD vagy FILL blokkokat kell utána elhelyezni.

| Mező | Leírás                                           |
| ---- | ------------------------------------------------ |
| Név  | A tábla címkéjének azonosítója (pl. `színtábla`) |
| Cím  | Fix cím, ahol a tábla kezdődik (pl. `$C000`)     |

**Szakértői szintaxis:**
```
.table color_table, $C000
```

**Generált ASM:**
```
color_table:
```

A programszámláló a megadott címre ugrik. A tartalom kitöltéséhez a TABLE után BYTE/WORD/FILL blokkokat kell elhelyezni.

**Méret:** 0 bájt.

---

### ORG

Beállítja, hogy a program (vagy annak egy része) hova kerüljön a memóriában – mintha egy kezdőcímet választanánk ki a gépi kód beírása előtt. Minden programhoz legalább egy ORG szükséges. A szabványos C64 BASIC által betölthető kezdőcím az `$0801`.

| Mező      | Leírás                                                          |
| --------- | --------------------------------------------------------------- |
| Cím       | Az új forráscím (pl. `0801` HEX-ben, vagy `2049` DEC-ben)       |
| HEX / DEC | Váltás a címbevitel hexadecimális és decimális kijelzése között |

**Szakértői szintaxis:**
```
* = $C000
```

**Generált ASM:**
```
* = $C000
```

**Méret:** 0 bájt. Maga az ORG blokk nem generál gépi kódot.

Minden ORG blokk egy új szakaszt indít. Az azt követő blokkok erről a címről kiindulva kerülnek összeállításra. A PRG exportálásakor az összes szakasz egyetlen fájlba kerül egyesítésre – a szakaszok közötti réseket nullákkal tölti ki.

**Példa — kód az `$0801` helyen, adattábla az `$C000` helyen:**
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

> **Tipp:** Minden programnak egy ORG blokkal kell kezdődnie. A C64 BASIC-kel betölthető programok tipikus kezdőcíme `$0801` (2049 decimális). Amikor a **BASIC SYS csonk** engedélyezve van, az assembler egy rövid BASIC sort ad hozzá az `$0801` címen, és a kódod az `$080D` címen kezdődik.

---

### LOOP / NEXT

Mint a BASIC-ben a **`FOR X=N TO 1 STEP -1 : ... : NEXT X`** — N-től 1-ig számol vissza az X vagy Y regiszter használatával. Tegyél ki egy LOOP blokkot, helyezd el az utasításaidat a blokk és a NEXT regiszter közé, és a blokk automatikusan a megfelelő számú ciklust ismétli.

#### LOOP

| Mező          | Leírás                                                  |
| ------------- | ------------------------------------------------------- |
| Nyilvántartás | `X` vagy `Y` — a számlálóregiszter                      |
| Gróf          | Ciklus iterációszám (hex vagy decimális, pl. `0A` = 10) |
| Címke         | Automatikusan generált cikluscímke (pl. `ciklus0`)      |

**Szakértői szintaxis:**
```
.loop X, 10, loop0
```

**Generált ASM:**
```
    LDX #$0A
loop0:
```

**Méret:** 2 bájt (LD_ opkód + azonnali operandus).

#### NEXT

| Mező          | Leírás                                        |
| ------------- | --------------------------------------------- |
| Nyilvántartás | Automatikusan illeszkedik a LOOP regiszterhez |
| Címke         | Automatikusan kapcsolódik a LOOP címkéhez     |

**Szakértői szintaxis:**
```
.next loop0
```

**Generált ASM:**
```
    DEX
    BNE loop0
```

**Méret:** 3 bájt (DEX + BNE + elágazási eltolás).

**Példa — 10 képernyőcella törlése:**
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

Mint a BASIC-ben a **`FOR X=0 TO N-1 : ... : NEXT X`** — 0-tól *felfelé* számol. Ideális, ha előre mutató indexre van szükség, például egy karakterláncon vagy tömbön való lépéshez.

#### FOR

| Mező          | Leírás                                                                      |
| ------------- | --------------------------------------------------------------------------- |
| Nyilvántartás | `X` vagy `Y` — a számlálóregiszter                                          |
| Gróf          | Ciklushatár (hex vagy decimális, pl. `$12` = 18). Az X/Y 0-tól 1-ig terjed. |
| Címke         | Automatikusan generált cikluscímke (pl. `for0`)                             |

**Szakértői szintaxis:**
```
.for X, $12, for0
```

**Generált ASM:**
```
    LDX #$00
for0:
```

**Méret:** 2 bájt (LD_ opcode + `#$00`).

#### ENDF

| Mező          | Leírás                                       |
| ------------- | -------------------------------------------- |
| Nyilvántartás | Automatikusan illeszkedik a FOR regiszterhez |
| Címke         | Automatikusan kapcsolódik a FOR címkéhez     |
| Gróf          | Automatikusan másolva a párosított FOR-ból   |

**Szakértői szintaxis:**
```
.endf for0
```

**Generált ASM:**
```
    INX
    CPX #$12
    BNE for0
```

**Méret:** 5 bájt (IN_ + CP_ #imm + BNE eltolás).

**Példa — nullával lezárt karakterlánc kiírása:**
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

> **LOOP vs FOR:** A LOOP lefelé számol (N→1) — jó késleltetésekhez, kitöltésekhez, pixelhurkokhoz. A FOR felfelé számol (0→N) — jó karakterlánc/tömb eléréséhez. Mindkettő használhatja az X vagy Y koordinátákat.

---

### PUSH / PULL

Mint az **változók mentése egy GOSUB előtt és visszaállítása után ** — de a 6502 hardververmet használja. Ha egy alprogram A, X vagy Y értékeket használ, akkor PUSH és PULL utasításokkal kell becsomagolni, hogy a hívó kód regiszterei megmaradjanak.

#### PUSH

Egy vagy több regisztert helyez a verembe. A sorrend mindig A → X → Y (a legbelső először).

| Mező        | Leírás                                                         |
| ----------- | -------------------------------------------------------------- |
| Regiszterek | Bármilyen kombináció: `A`, `X`, `Y`, `AX`, `AY`, `XY`, `XY[X2] |

**Szakértői szintaxis:**
```
.push AXY
```

**Generált ASM (példa: `AX`):**
```
    PHA
    TXA
    PHA
```

**Méret:** 1 bájt A-nak (`PHA`), 2 bájt X-nek vagy Y-nak (átvitel + push).

#### PULL

Visszaállítja a regisztereket a veremből ** fordított sorrendben ** (Y → X → A).

| Mező        | Leírás                                                            |
| ----------- | ----------------------------------------------------------------- |
| Regiszterek | Ugyanaz, mint a PUSH – meg kell egyeznie a megfelelő PUSH blokkal |

**Szakértői szintaxis:**
```
.pull AXY
```

**Generált ASM (példa: `AX`):**
```
    PLA
    TAX
    PLA
```

> **Szabály:** A PUSH és PULL utasításoknak mindig **ugyanazt a regiszterkészletet kell használniuk**. `PUSH AX` → `PULL AX` (belsőleg fordított sorrendben állítja vissza: először X, majd A).

---

### END / RTS alias

Az **RTS-hez hasonlóan, egy barátságosabb makrónévvel ** — az `.end` egyetlen `RTS` bájtot bocsát ki, és szakértői módban rövid alprogramterminátorként viselkedik.

**Szakértői szintaxis:**
```
.end
```

**Generált ASM:**
```
    RTS
```

**Méret:** 1 bájt.

Ezt akkor használd, ha egy olyan alprogram vége jelölőt szeretnél, ami inkább makróként, mint nyers utasításként olvasható.

---

### MACRO / ENDM / INVOKE

Mint egy ** nevű GOSUB paraméterekkel ** — definiáljon egyszer egy újrafelhasználható kódrészletet (MACRO…ENDM), majd hívja meg bárhol az INVOKE paranccsal. Minden alkalommal más argumentumértékeket adjon át a blokkok másolása-beillesztése helyett.

#### MACRO (definition start)

| Mező        | Leírás                                                                             |
| ----------- | ---------------------------------------------------------------------------------- |
| Név         | A makró azonosítója (pl. `setColor`)                                               |
| Paraméterek | Opcionális vesszővel elválasztott paraméternevek (pl. `color` vagy `color, count`) |

A makródefiníció kezdetét jelzi. A MACRO és ENDM közötti blokkok a makró törzsét alkotják – ezek **nem generálnak semmilyen kódot** ott, ahol a definíció található. Az argumentumokhoz használd a `{paramName}` karakterláncot helykitöltőként.

**Generált ASM:**
```
; .MACRO setColor (color)
    ... (body blocks)
; .ENDM
```

**Szakértői mód szintaxisa:**
```
.macro setColor color
    LDA {color}
    STA $D020
.endm
```

#### ENDM (definition end)

Bezárja az aktuális makródefiníciót. Nincsenek mezők.

#### INVOKE

Meghív egy definiált makrót ezen a pozíción, és a megadott argumentumértékeket helyettesíti a törzsben lévő `{paramName}` helyőrzők helyére.

| Mező       | Leírás                                                                                                 |
| ---------- | ------------------------------------------------------------------------------------------------------ |
| Makró neve | Válasszon a definiált makrók legördülő menüjéből                                                       |
| érvek      | Vesszővel elválasztott argumentumértékek, amelyek megegyeznek a makró paraméterlistájával (pl. `#$07`) |

**Generált ASM:**
```
; .invoke setColor(#$07)
    LDA #$07
    STA $D020
```

**Szakértői mód szintaxisa:**
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

A makró törzse kibővül a `{paramName}` paraméterrel, amelyet a tényleges argumentumok helyettesítenek. A szóközzel elválasztott formátum (`.invoke setColor #$07`) is elfogadott.

**Argumentumtípusok:**
- **Numerikus**: `#$07`, `$10`, `255` — hexadecimális vagy decimális értékek
- **Szöveges karakterláncok**: `"Hello, World!"` — idézőjelek közé tett karakterláncok; az idézőjelek között lévő vesszőket a szöveg részeként kezeli a rendszer, nem pedig argumentum-elválasztóként.
- **Vegyes**: `#$07, "hello", $20` — bármilyen kombináció

> **Tipp:** Definiálj makrókat a programod tetején (vagy alján), majd INVOKE őket, ahol szükséges. A makrók többször is meghívhatók különböző argumentumokkal.

---

### REGION / ENDREGION

Tisztán vizuális csoportosítás — **nulla bájt**, nulla hatás az összeállított kódra. Mint amikor egy BASIC program egy szakaszát egy elnevezett blokkba hajtogatod, hogy aztán összecsukhasd és valami másra koncentrálhass.

| Mező       | Leírás                                                                        |
| ---------- | ----------------------------------------------------------------------------- |
| Régió neve | Szabad szöveges címkék a szakaszhoz (pl. `init`, `game_loop`, `sprite_setup`) |

**Szakértői szintaxis:**
```
.region init
    ; blocks...
.endregion
```

**A REGION blokk fejlécében található vezérlők (mindig láthatóak):**
- **▸ / ▾ ki-/bekapcsolás** — összecsukja vagy kibontja a teljes régiót. Összecsukáskor a REGION és ENDREGION közötti összes blokk rejtett lesz.
- **↕ Összes kibontása** — visszaállítja az összes egyenként összecsukott blokk összecsukását a régión belül, és szükség esetén kibontja magát a régiót.
- **⦵ Kijelölés az ASM-ben** — kiemeli a teljes régió kódtartományát az ASM nézetben (`; ===[ név ]===`-től `; ===[/ név]===`-ig), és legörget rá. Automatikusan átvált az ASM fülre, ha az jelenleg nem látható.
- **⧉ Régió másolása** — a REGION blokkot, az összes gyermekblokkot és a hozzá tartozó ENDREGION-t a vágólapra másolja. Egy ✓ villogó jel megerősíti a másolást.
- **⎘ Régió beillesztése** — beszúrja a másolt régiót új régióként közvetlenül az aktuális régió ENDREGION-ja után, és odagörget. A gomb halványan jelenik meg, amíg a régió másolása meg nem történik.

**Generált ASM:**
```
; region init
    SEI
    LDA #$00
    STA $D020
; endregion init
```

**Méret:** 0 bájt mind a REGION, mind az ENDREGION esetében.

**Példa munkafolyamatra:**
1. Adj hozzá egy `REGION` blokkot, és állítsd be a régió nevét `init`-re.
2. Add hozzá az inicializálási utasításokat alatta.
3. Adj hozzá egy `ENDREGION` blokkot a szakasz lezárásához.
4. Kattintson a REGION ▸ ikonjára, ha a teljes szakaszt egyetlen sorba szeretné csukni, miközben a program más részein dolgozik.

> **Megjegyzés:** A régiók **egymásba ágyazhatók**. Minden ENDREGION lezárja a legközelebbi nyitott REGION-t. Nincs hatással az összeszerelt kimenetre.

---

### DEFINE / IF / ELSE / ENDIF

Mint egy ** kapcsoló, az assembler a következőt olvassa: ** — `DEFINE DEBUG` bekapcsol egy szimbólumot, majd bármely `IF DEBUG` blokk bekerül a kimenetbe, és a `ELSE` ága kimarad. A DEFINE blokk eltávolításával az IF blokk eltűnik a kimenetből. A kiadott buildekhez nem kell kódot törölni.

#### DEFINE

| Mező      | Leírás                                                                                         |
| --------- | ---------------------------------------------------------------------------------------------- |
| Szimbólum | Egy vagy több vesszővel elválasztott azonosító az aktiváláshoz (pl. `DEBUG` vagy `DEBUG, PAL`) |

**Szakértői szintaxis:**
```
.define DEBUG, PAL
```

**Generált ASM:**
```
; .DEFINE DEBUG
; .DEFINE DEBUG, PAL
```

Egy `DEFINE` blokk egyszerre több szimbólumot is aktiválhat (vesszővel elválasztva). A DEFINE blokkokat a program elejére kell helyezni. A blokk eltávolítása azonnal deaktiválja az összes szimbólumát.

#### IF

| Mező    | Leírás                                                                              |
| ------- | ----------------------------------------------------------------------------------- |
| Állapot | Tesztelendő azonosító (egyeznie kell egy `DEFINE` szimbólummal az aktív állapothoz) |

**Szakértői szintaxis:**
```
.if DEBUG
```

**Generált ASM:**
```
; .IF DEBUG
```

Az `IF` és `ENDIF` (vagy `ELSE`) közötti blokkok attól függően kerülnek bele vagy maradnak, hogy a feltétel szimbólumnak van-e egyező `DEFINE` a programban. A kihagyott blokkok `; [IF kihagyva] …` megjegyzésként jelennek meg, és **nulla bájtot** generálnak.

#### ELSE

Nincsenek mezők. Az alternatív ágat jelöli — akkor állítódik össze, amikor az `IF` feltétel *not* aktív.

**Szakértői szintaxis:**
```
.else
```

**Generált ASM:**
```
; .ELSE
```

#### ENDIF

Nincsenek mezők. Lezárja a feltételes blokkot.

**Szakértői szintaxis:**
```
.endif
```

**Generált ASM:**
```
; .ENDIF
```

**Méret:** 0 bájt mind a négy blokknak. Csak a közöttük lévő * tartalom számít.*

**Példa — hibakeresési border flash, a kiadás kihagyja:**
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

**Példa — több szimbólum egy DEFINE blokkban:**
```
; .DEFINE DEBUG, PAL

; .IF PAL
    LDA #$xx        ; PAL timing constant
; .ELSE
    LDA #$xx        ; NTSC timing constant
; .ENDIF
```

A beágyazott `IF` blokkok támogatottak. Ha egy külső blokkot kihagy, a belső blokkok is kimaradnak.

> **Megjegyzés:** Ez fordítási idejű feltételkezelés. A futásidejű összehasonlításhoz/elágazáshoz lásd a **Futásidejű IF / ELSE / ENDIF** részt alább.

### .ASSERT

*(Újdonság a 2.3.9-es verzióban.)* Egy **fordítási idejű épségellenőrzés**. Az `.assert` kiértékel egy kifejezést az összeszerelés során; ha hamis (`0`), a fordítás egy tiszta hibával leáll, amely tartalmazza a tényleges értéket. Ha igaz (nem nulla), akkor semmit nem bocsát ki.

| Mező      | Leírás                                                                                                                                                          |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kifejezés | Bármely assembler kifejezés: címkék, `CONST`s, `*` (programszámláló), aritmetikai műveletek és összehasonlítások (`&lt;`, `&lt;=`, `&gt;`, `&gt;=`, `==`, `!=`) |
| Üzenet    | A hibaüzenethez hozzáfűzött opcionális szöveg                                                                                                                   |

**Szakértői szintaxis:**
```
.assert spriteData < $C000
.assert * < $A000
.assert end - start <= 256, "sprite table overflowed one page"
```

**Viselkedés:**

- **Méret:** 0 bájt.
- Egy hamis állítás megszakítja az összeszerelést: `` `.assert end - start &lt;= 256` is false (value: 0). sprite tábla túlcsordult egy oldalon.``
- Egy olyan állítás, amely nem értékelhető ki (nincs definiált címke stb.), szintén sikertelen, a következő hibakóddal: *"nem értékelhető ki assembly időben"*.
- Az összehasonlítások eredményeként `1` / `0` címet kapunk; az `.assert` címet a programfolyamat bármely pontjára helyezzük el — a program a rajta lévő címen ellenőrzi, tehát az `.assert * &lt; $D000` az aktuális kimeneti pozíciót teszteli.

**Példa – sprite blokk védelme az oldal átlépése ellen:**
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

Mint egy ** nevű változó, ami sosem változik** — `SCREEN = $0400`. Használd a nevet a nyers címek begépelése helyett, így a kód könnyebben olvasható és később módosítható.

| Mező     | Leírás                                                                                                                     |
| -------- | -------------------------------------------------------------------------------------------------------------------------- |
| Név      | A konstans azonosítója (pl. `SCREEN`)                                                                                      |
| Érték    | Numerikus érték a kiválasztott számrendszerben (pl. `0400` HEX = $0400 cím esetén), vagy PC-relatív kifejezés (lásd alább) |
| Formátum | HEX vagy DEC — az érték bevitelének és megjelenítésének módját szabályozza                                                 |

**Szakértői szintaxis:**
```
.const SCREEN = $0400
.const FRAMES_1S = 60
```

**Generált ASM:**
```
; .CONST SCREEN = $0400
```

Az állandó neve megjelenik az utasításblokkok **címkeválasztó** legördülő menüjében – egyszerűen kattintson rá a beszúráshoz.

**PC-relatív kifejezések (`*+N` / `*-N`):**

Az érték mező elfogadja az `*+N` vagy az `*-N` értékeket is, ahol az `*` a CONST blokk fordítási címe. Ez egy névvel ellátott alias létrehozására szolgál egy bájthoz egy közeli utasításon belül – a klasszikus önmódosító kódminta:

```
CONST op = *+1      ; op → address of the immediate operand of the next LDA
LDA #$00            ; $00 will be patched at runtime
...
STA op              ; overwrites the #$00 byte → LDA reads the new value next time
```

A CONST 0 bájtot bocsát ki; a címke fordítási időben `aktuális_cím + 1`-re van feloldva.

**Számtani kifejezések:**

Az érték mező általános aritmetikai műveleteket fogad el, beleértve a korábban definiált CONST nevekre, hex/bináris literálokra és beépített matematikai függvényekre való hivatkozásokat:

```
.const SCREEN      = $0400
.const SCREEN_END  = SCREEN + 40*25   ; 1000 bytes later
.const COLOR_RAM   = $D800
.const MID_X       = 160
.const SIN_TABLE   = round(sin(PI/8) * 127)   ; pre-computed sine value
```

**Beépített függvények:** `sin()`, `cos()`, `round()`, `max(a,b)`, `min(a,b)`, `abs()`, konstans `PI`

Operátorok: `+ - * /` Literálok: `$FF` (hex), `%10110000` (bináris) Alacsony/magas bájt: `lo(kifejezés)`, `hi(kifejezés)`

**Méret:** 0 bájt.

---

### VAR

Mint az **CONST, de automatikusan lefoglalt** — Az `VAR` lefoglalja a nulla oldalas tárhelyet egy címkének anélkül, hogy be kellene gépelni a címet. Használja számlálókhoz, mutatókhoz és a ZP-be tartozó rövid életű állapotokhoz.

| Mező               | Leírás                                                       |
| ------------------ | ------------------------------------------------------------ |
| Név                | Változó neve / címkéje                                       |
| Méret (opcionális) | A lefoglalandó bájtok száma. Egyetlen bájt esetén hagyja ki. |

**Szakértői szintaxis:**
```
.var counter
.var timer, 2
.var lives
```

**Gyakorlati példa:**
```
.region Vars
.var counter
.var timer, 2
.endregion

LDA #$00
STA counter
```

**Generált ASM:**
```
; .var counter
```

**Méret:** 1 bájt alapértelmezés szerint, vagy `N` bájt, ha a méret meg van adva.

A lefoglaló végigsétál egy konfigurálható nulla oldalas kurzoron (`$02` - `$FE`), és hozzárendeli a következő szabad helyet. Ha a kért régió átfedésben van egy már használt címkével, a fordító figyelmeztetést ad.

---

### Runtime IF / ELSE / ENDIF

Mint egy **egy igazi elágazási sablon** — ez a verzió futásidőben működik, nem fordítási időben. Összehasonlítja az `A`, `X` vagy `Y` értékeket egy azonnali értékkel, és kiadja a helyes `CMP` / `CPX` / `CPY` + elágazási szekvenciát.

| Mező          | Leírás                                       |
| ------------- | -------------------------------------------- |
| Nyilvántartás | `A`, `X` vagy `Y`                            |
| Operátor      | `==`, `!=`, `&lt;`, `&lt;=`, `&gt;`, `&gt;=` |
| Érték         | Azonnali érték HEX vagy DEC formátumban      |

**Szakértői szintaxis:**
```
.if A == #$10
    LDA #$07
.else
    LDA #$0F
.endif
```

**Méret:** A kiválasztott ágaktól és az összehasonlítási űrlaptól függ.

Az összehasonlítás alapértelmezés szerint előjel nélküli. Az `&lt;=` és az `&gt;` esetén a makró a kiválasztott regiszterhez tartozó legrövidebb ekvivalens elágazási láncra bővül.

---

### WHILE / ENDW

Mint egy **futásidejű ciklus tetején egy teszttel** — a törzs addig fut, amíg a feltétel igaz marad.

| Mező          | Leírás                                       |
| ------------- | -------------------------------------------- |
| Nyilvántartás | `A`, `X` vagy `Y`                            |
| Operátor      | `==`, `!=`, `&lt;`, `&lt;=`, `&gt;`, `&gt;=` |
| Érték         | Azonnali érték HEX vagy DEC formátumban      |

**Szakértői szintaxis:**
```
.while A != #$00
    JSR getchar
.endw
```

**Méret:** A ciklus törzsétől és az összehasonlítás formájától függ.

Használd az `WHILE` függvényt, ha a ciklus az első iteráció befejezése előtt véget érhet. Ez a számlálóalapú `LOOP / NEXT` segédfüggvény futásidejű megfelelője.

---

### REPEAT / UNTIL

Mint egy **futásidejű ciklus alul egy teszttel** — a törzs mindig lefut legalább egyszer, majd a feltétel eldönti, hogy leálljon-e.

| Mező          | Leírás                                       |
| ------------- | -------------------------------------------- |
| Nyilvántartás | `A`, `X` vagy `Y`                            |
| Operátor      | `==`, `!=`, `&lt;`, `&lt;=`, `&gt;`, `&gt;=` |
| Érték         | Azonnali érték HEX vagy DEC formátumban      |

**Szakértői szintaxis:**
```
.repeat
    JSR getchar
.until A == #$00
```

**Méret:** A ciklus törzsétől és az összehasonlítás formájától függ.

Használd az `REPEAT / UNTIL` függvényt, ha azt szeretnéd, hogy a törzs legalább egyszer lefusson a kilépési ellenőrzés előtt.

---

### MEMCPY / MEMSET

Mint a(z) **kis memóriarutinok, amelyekhez folyamatosan nyúlsz** — a(z) `MEMCPY` egy összefüggő blokkot másol, a(z) `MEMSET` pedig egy tartományt tölt ki egyetlen bájttal.

| Makró    | Mezők                    |
| -------- | ------------------------ |
| `MEMCPY` | `forrás`, `dst`, `méret` |
| `MEMSET` | `cím`, `érték`, `méret`  |

**Szakértői szintaxis:**
```
.memcpy src=$C000, dst=$D000, size=$0100
.memset addr=$0400, value=#$20, size=$03E8
```

**Generált ASM:** beágyazott másolási/kitöltési ciklusok, a kért méretnek megfelelően kiválasztva.

A legfeljebb 256 bájtos méretek egy rövid, 8 bites ciklust használnak. Nagyobb méretek esetén automatikusan 16 bites számlálóra váltanak.

---

### PRINT / PRINT_CHAR / PRINT_HEX / CLEAR_SCREEN / WAIT_KEY / DELAY / SET_BORDER / SET_BG

#### PRINT

Mint a **PETSCII kimenet a sablonos ** nélkül — egy karakterláncot nyomtat ki a `CHROUT` blokkon keresztül, ugyanazzal a nagybetűs/kisbetűs kezeléssel, mint a PETSCII blokk. A kisbetűs jelölőnégyzet meg van osztva a PETSCII kódolóval, így a szöveg elérési útja konzisztens marad.

**Szakértői szintaxis:**
```
.print "HELLO"
.print "hello", lower
```

#### PRINT_CHAR

Kiír egy PETSCII bájtot numerikus kódként, és elküldi azt a `CHROUT` metóduson keresztül. Az érték lehet egy elnevezett konstans vagy címke is, amely összeszereléskor bájtra oldódik fel, mind Blokk, mind Szakértő módban.

**Szakértői szintaxis:**
```
.print_char 65
.print_char $41
.print_char color
```

#### PRINT_HEX

Egy 8 bites értéket nyomtat ki hexadecimális szövegként a normál KERNAL kimeneti útvonalon keresztül.

**Szakértői szintaxis:**
```
.print_hex A
```

#### CLEAR_SCREEN

A szabványos C64 képernyős vezérlőkód gyorsbillentyűje.

**Szakértői szintaxis:**
```
.clear_screen
```

#### WAIT_KEY

Megvárja, amíg lenyomnak egy billentyűt, így nem kell minden alkalommal kézzel futtatni a `GETIN` ciklust.

**Szakértői szintaxis:**
```
.wait_key
```

#### DELAY

Egy megosztott segítőrutinon keresztül megvárja a kért számú képkockát. Ezt rövid szünetekhez és időzítési hézagokhoz használjuk, amikor egy teljes egyéni ciklus túlzás lenne. A képkockaszám lehet nyers szám vagy egy elnevezett konstans, és az `.wait` csak az `.delay` álneve.

**Szakértői szintaxis:**
```
.delay 29
.wait 29
.delay frames=FRAMES_1S
```

Blokk módban a késleltetés mező egy kompakt konstansválasztót használ, ha szimbolikus érték áll rendelkezésre, így nem kell minden alkalommal manuálisan beírni a nevet.

#### SET_BORDER / SET_BG

Kényelmi burkolók a VIC-II színregiszterekhez. A színérték lehet nyers szám vagy egy elnevezett konstans, amely 0–15-re oldódik fel. Mind a Blokk mód, mind a Szakértő mód elfogad szimbolikus konstansneveket.

**Szakértői szintaxis:**
```
.set_border 6
.set_bg 0
.set_border color
.set_bg color
```

**Méret:** Minden segítő egy apró regiszterírási szekvenciává vagy egy rövid KERNAL hívássá bővül.

Blokk módban ezek a mezők szintén a konstansválasztót használják, így a szimbolikus érték látható marad ahelyett, hogy egy nyers számmal helyettesítenénk.

---

### IRQ_SETUP

Egyetlen lépésben beállít egy raszteres IRQ kezelőt. A makró kiírja az IRQ vektort, engedélyezi a raszteres IRQ-kat, beállítja a vonalat, letiltja a gyakori CIA IRQ forrásokat, és a `CLI` paranccsal visszatér a normál végrehajtáshoz.

| Mező    | Leírás                                                            |
| ------- | ----------------------------------------------------------------- |
| Kezelő  | IRQ rutin címkéje (pl. `my_irq`)                                  |
| Raszter | Raszteres vonal hexadecimális vagy decimális formában (pl. `$FA`) |

**Szakértői szintaxis:**
```
.irq_setup handler=my_irq, raster=$FA
```

**Méret:** Egy rövid beállítási sorozat; a pontos hossz a kiválasztott rasztervonaltól függ.

Ezt akkor használd, ha a megszokott "SEI / telepítéskezelő / IRQ engedélyezése / CLI" sablont szeretnéd használni anélkül, hogy szétszórnád a programban.

---

### RAND

Mint egy apró, beépített PRNG, az ** — egy 8 bites pszeudovéletlenszerű értéket ad vissza egy kompakt nulla oldalas kezdőértékből.

| Mező | Leírás                                                                 |
| ---- | ---------------------------------------------------------------------- |
| Mag  | Opcionális nulla oldalas kezdőbájt vagy címke (alapértelmezett: `$FB`) |

**Szakértői szintaxis:**
```
.rand
```

**Méret:** Néhány bájt, a választott megvalósítási útvonaltól függően.

A generátor játékmenetre, effektvariációkra és gyors tesztadatokra készült. Szándékosan kicsi, nem pedig kriptográfiailag bonyolult.

---

<a id="sprite_init"></a>
### SPRITE_INIT

Beállít egy VIC-II sprite-ot egyetlen blokkban — a BASIC-ben körülbelül 6 POKE utasítás írása helyett csak töltse ki a mezőket. Beállítja a sprite adatmutatóját, bekapcsolja azt, opcionálisan engedélyezi a többszínű módot, és beállítja a színét.

| Mező      | Leírás                                                                |
| --------- | --------------------------------------------------------------------- |
| Sprite #  | Sprite-szám 0–7                                                       |
| Szín      | Színindex 0–15 (C64 paletta)                                          |
| Adatoldal | Sprite adatcím / 64 (pl. `$21`, ha az adat a `$0840` címen található) |
| Sokszínű  | Be-/kikapcsolja a sprite többszínű bitjét (`$D01C`)                   |

**Szakértői szintaxis:**
```
.sprite_init 0, 7, $21
.sprite_init 0, 7, $21, multicolor
.sprite_init 0, 7, $21, mono
```

**Generált ASM:**
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

**Méret:** 26 bájt.

> **Sprite adatlap:** `adat_cím ÷ 64`. Az alapértelmezett BASIC SYS csonkkal, az `ALIGN 64` parancs a `JMP main` után a sprite adatokat az `$0840` helyre helyezi → oldal = `$21`.

---

<a id="sprite_pos"></a>
### SPRITE_POS

Mint a BASIC-ben található **`POKE 53248, x : POKE 53249, y`** — beállítja egy sprite kezdőpozícióját. A koordináták az összeszereléskor kerülnek beillesztésre, és a mezők blokk módban fogadnak konstansokat; animációhoz használd közvetlenül a sprite regiszteren az `INC`/`DEC` metódust.

| Mező     | Leírás                   |
| -------- | ------------------------ |
| Sprite # | Sprite-szám 0–7          |
| X        | Vízszintes pozíció 0–319 |
| Y        | Függőleges pozíció 0–255 |

**Szakértői szintaxis:**
```
.sprite_pos 0, 152, 100
```

**Generált ASM (példa: sprite 0, X=152, Y=100):**
```
    LDA #$98        ; X low byte
    STA $D000       ; sprite 0 X register
    LDA $D010
    AND #$FE        ; clear X MSB for sprite 0 (X ≤ 255)
    STA $D010
    LDA #$64        ; Y = 100
    STA $D001       ; sprite 0 Y register
```

X > 255 esetén a makró a megfelelő bitet az `$D010` mappában törli, ahelyett, hogy törölné azt.

**Méret:** 18 bájt.

> **Megjegyzés:** A `SPRITE_POS` függvény beépíti az X/Y koordinátákat a kódba (`LDA #$xx`). Sprite futásidejű animálásához használd az `INC $D000` / `DEC $D000` parancsot — lásd a `sprite-macro-demo` példát.

---

<a id="wait_raster"></a>
### WAIT_RASTER

Megvárja, amíg a VIC-II elektronnyaláb eléri a megadott pásztázási vonalat – mintha egy tévéképernyő képkockájához szinkronizálna. Tedd ezt a játék ciklusának elejére, hogy megakadályozd a sprite-ok szakadását. Nincs szükség JSR-re, nincs szükség címkére.

| Mező            | Leírás                                                    |
| --------------- | --------------------------------------------------------- |
| Raszteres vonal | Cél raszteres vonal hexadecimálisan (pl. `FF` = 255. sor) |

**Szakértői szintaxis:**
```
.wait_raster $FF
```

**Generált ASM:**
```
wait:
    LDA $D012       ; current raster line
    CMP #$FF        ; target line
    BNE wait        ; loop back (-7 bytes)
```

**Méret:** 7 bájt (a `BNE` eltolás `$F9` = −7 mindig az `LDA`-re mutat vissza).

> **Tipp:** Helyezd el a `WAIT_RASTER` elemet a játék ciklusának tetejére, hogy szinkronizálódjon a kijelzővel és elkerüld a sprite-ok szakadását.

---

### JOYSTICK

Mintha a **`PEEK($DC00)`** parancsot olvasná be, majd a sprite pozícióját POKE-olná – de egy blokkban. Egy CIA joystick portot olvas be, és ennek megfelelően állítja be a sprite X/Y regisztereit. Teljesen inline, nincs szükség JSR-re.

| Mező     | Leírás                                                                 |
| -------- | ---------------------------------------------------------------------- |
| Kikötő   | `1` = 1-es port (`$DC01`) vagy `2` = 2-es port (`$DC00`)               |
| Sprite # | Sprite szám 0–7 (azt vezérli, hogy melyik X/Y regiszterpár frissüljön) |

**Szakértői szintaxis:**
```
.joystick 2, 0
```

**Generált ASM (2. port, 0. sprite):**
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

**Joystick bittérkép (aktív-LOW — a 0 bit azt jelenti, hogy lenyomva):**

| Bit | Irány  | CIA-nyilvántartás                     |
| --- | ------ | ------------------------------------- |
| 0   | Fel    | $DC00 (2-es port) / $DC01 (1-es port) |
| 1   | Le     |                                       |
| 2   | Balra  |                                       |
| 3   | Jobbra |                                       |
| 4   | Tűz    | (ez a makró nem kezeli)               |

**Méret:** 27 bájt. Az `BCS` eltolás mindig `+3` (kihagyja a következő 3 bájtos `DEC`/`INC abs` utasítást).

> **Tipikus használat:** Elhelyezzük egy `gameloop` címkén belül, először a `WAIT_RASTER` címkével:
> ```
> gameloop:
>     WAIT_RASTER ($FF)
>     JOYSTICK (port=2, sprite=0)
>     JMP gameloop
> ```

---

<a id="mouse"></a>
### MOUSE

Commodore 1351 proporcionális egér adatait olvassa és egy sprite-ot mozgat. Teljesen **inline** — nincs szükség JSR-re vagy címkére. A makró kiválasztja a CIA portot, megvárja, amíg a SID lapát bemenetek leülepednek, majd dekódolja a delta mozgást a szabványos 1351-es illesztőprogram-minta segítségével, és alkalmazza azt a sprite regiszterekre.

| Mező      | Leírás                                                            |
| --------- | ----------------------------------------------------------------- |
| Kikötő    | `1` = CIA `$DC00` bit `7:6` = `%01`; `2` = `%10`                  |
| Sprite #  | Sprite-szám 0–7                                                   |
| ZP bájt X | Nulla oldalas cím (hex) az előző POTX minta tárolására (pl. `FD`) |
| ZP bájt Y | Nulla oldalas cím (hex) az előző POTY minta tárolására (pl. `FE`) |

**Generált ASM alakzat (1. port, 0. sprite, ZP `$FD`/`$FE`):**

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

**Méret:** 142 bájt.

**Szakértői mód szintaxisa:**
```
.mouse port, spriteNum, zpX, zpY
; example:
.mouse 2, 0, FD, FE
```

> **Fontos:** Az első hívás előtt inicializálja a nulla oldalas bájtokat az aktuális POTX/POTY értékekkel, hogy elkerülje az ugrást az első képkockánál:
> ```
>     ; port 1: LDA $DC00 : AND #$3F : ORA #$40 : STA $DC00
>     ; port 2: LDA $DC00 : AND #$3F : ORA #$80 : STA $DC00
>     LDA $D419 : LSR A : AND #$3F : STA $FD
>     LDA $D41A : LSR A : AND #$3F : STA $FE
> ```

> **Tipp:** Az egér lekérdezése képkockánként egyszer szükséges — a játék ciklusában a `WAIT_RASTER` elemet a `MOUSE` elé kell helyezni.

---

<a id="sprite_col"></a>
### SPRITE_COL

Mint a BASIC-ben lévő **`PEEK($D01E)`** — ellenőrzi a VIC-II hardveres ütközési regisztereket, és megmondja, hogy egy sprite egy másik sprite-ba vagy a háttérbe ütközött-e. Teljesen inline, nincs szükség JSR-re.

| Mező           | Leírás                                                                                                         |
| -------------- | -------------------------------------------------------------------------------------------------------------- |
| Sprite #       | Sprite szám 0–7 (melyik sprite bitjét kell ellenőrizni)                                                        |
| Ütközés típusa | `Sprite-Sprite ($D01E)` — ütközés egy másik sprite-tal; `Sprite-Background ($D01F)` — ütközés háttérgrafikával |

**Szakértői szintaxis:**
```
.sprite_col 0, sprite
.sprite_col 0, background
```

**Generált ASM (sprite 0, sprite–sprite):**
```
    LDA $D01E       ; read sprite-sprite collision register (clears it!)
    AND #$01        ; isolate bit 0 (sprite 0)
                    ; A ≠ 0 → collision occurred
```

**Méret:** 5 bájt.

> **Fontos:** A(z) `$D01E`/`$D01F` ** beolvasása törli a(z)** regisztert. Olvasd be képkockánként egyszer, és azonnal reagálj az eredményre a(z) `BEQ`/`BNE` paranccsal.

**Tipikus használat:**
```
gameloop:
    WAIT_RASTER ($FF)
    JOYSTICK (port=2, sprite=0)
    SPRITE_COL (sprite=0, type=sprite-sprite)
    BEQ no_hit          ; A = 0 → no collision
    LDA #$02
    STA $D020           ; red border = hit!
    JMP gameloop
no_hit:
    LDA #$0E
    STA $D020           ; light blue border = clear
    JMP gameloop
```

> **Lásd még:** `ütközés-demó` példa — zöld golyó (sprite #0) vs. piros kereszt (sprite #1).

---

### LOADFILE

Mint a BASIC-ben a **`LOAD "fájl",8`** — futásidőben betölt egy fájlt egy D64 lemezről a KERNAL LOAD rutin használatával. Ezzel adatokat, zenét vagy extra kódot tölthet be lemezről a program futása közben.

| Mező                        | Leírás                                                                                                                                                                                                                  |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fájlnév                     | Fájlnév a lemezen (maximum 16 karakter, automatikus nagybetűs írásmód; a következő karakterek szűrve: `,`, `"`, `/`, `\`, `:`, `*`, `?`, `&lt;`, `&gt;`, `|`)                                                           |
| Eszköz                      | Eszközszám 8–30 (alapértelmezett: `8`)                                                                                                                                                                                  |
| Cím felülírása (opcionális) | Hex betöltési cím (pl. `C000`). Ha be van állítva, a fájl erre a címre töltődik be (`sec=0`, figyelmen kívül hagyva a PRG fejlécet). Hagyja üresen, ha a fájl saját 2 bájtos PRG fejlécét szeretné használni (`sec=1`). |
| Hibacímke (opcionális)      | Ha be van állítva, a JSR LOAD után egy `BCS` utasítás generálódik. Ha a KERNAL carry set (hiba) értékkel tér vissza, a végrehajtás erre a címkére ugrik.                                                                |

**Szakértői szintaxis:**
```
.loadfile "DEMO-COLORS", 8
.loadfile "DEMO-COLORS", 8, $C000
.loadfile "DEMO-COLORS", 8, $C000, error_label
```

**Generált kódstruktúra:**
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

**Méret:** `3 + fájlnév_hossz + 9 (SETNAM) + 9 (SETLFS) + (4 felülbírálás esetén) + 5 (BETÖLTÉS) + (2 hibacímke esetén)` bájt. Minimum 27 bájt.

> **Fontos:** A fájlnév a gépi kódban, közvetlenül egy `JMP skip_filename` után tárolódik. A lemezen lévő fájlnévnek nagybetűs PETSCII-nek kell lennie – ami megegyezik a sima ASCII nagybetűkkel (`A`–`Z`). A makró ezt automatikusan kikényszeríti.

> **Éles programok esetén mindig használj hibakódot** — ha a fájl nem található, a KERNAL beállítja az átvitel jelzőt, és a végrehajtás a következőre hárul.

> **Lásd még:** `loadfile-demo` példa — bemutatja a `DEMO-COLORS.PRG` betöltését egy D64-ből egy BCS hibaággal és egy vizuális hibaképernyővel.

---

### EXODECRUNCH

Programon belüli **Exomizer kicsomagolás**. Ezt a makrót közvetlenül egy `LOADFILE` után használjuk, amely egy Exomizer `mem` módú tömörített adatfolyamot töltött be — az EXODECRUNCH visszafelé kicsomagolja azt a adatfolyamba beágyazott címre.

| Mező          | Leírás                                                                                                                 |
| ------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Depakoló címe | A kicsomagoló kód memóriában való tárolási helye (alapértelmezett: `B000`). 16 bites hexadecimális címnek kell lennie. |

**Szakértői szintaxis:**
```
.exodecrunch
.exodecrunch depacker=$B000
```

**Generált kód (19 bájt):**
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

**Hogyan működik:**

1. A KERNAL `LOAD` ($FFD5) frissíti a ZP `$AE/$AF` fájlokat, hogy eggyel a legutóbb betöltött bájt után mutasson. Az EXODECRUNCH ezt átmásolja a ZP `$04/$05` fájlokba, ami az Exomizer hivatalos visszafelé forrás-vég konvenciója.
2. A kicsomagoló jellemzően az `$B000` címen található (a BASIC ROM leképezett régióján belül). A makró átváltja az `$01 = $36` értéket, így a CPU a JSR során ott látja a RAM-ot, majd utána visszaállítja az `$01 = $37` értéket.
3. A kicsomagolási célcím **kódolású ** magába a tömörített adatfolyamba kerül, amikor az `exomizer mem -l <load> file,<target>` paranccsal tömöríted — a kicsomagoló a folyam első bájtjaiból olvassa be.

**Depacker bináris:** Az előre elkészített visszafelé irányuló kicsomagoló a `samples/exo-decrunch.bin` (477 bájt, ORG $B000). Ez a hivatalos `exodecrunch.asm` fájl Kick Assembler csomagolása, amelyben minden olvasásnál `INC $D020` hozzáadódik a látható szegélyvillanás effektus érdekében a kicsomagolás során. Helyezd el a programodban egy `INCBIN` blokkal a kicsomagoló címén.

**Biztonsági eltolás kompenzáció:** Az Exomizer alapértelmezett memória módja 2 bájtos biztonsági eltolást alkalmaz — az adat 2 bájttal korábban érkezik, mint a kért cél. A Futtatás D64-en keresztül párbeszédablak ** automatikusan hozzáad 2-t a Dst mezőhöz ** az exomizer meghívása előtt, így a látható viselkedés megegyezik a beírt címmel.

> **Lásd még:** az `exo-multicolor-demo` példa — teljes, végponttól végpontig tartó példa: LOADFILE egy tömörített többszínű bitképet $C000-re, az EXODECRUNCH kicsomagolja $2000-re, majd másolja a képernyőt → $0400 és a színt → $D800, és kapcsolja a VIC-II-t többszínű bitkép módba.

> **Integrációs teszt:** A `cargo test --test exomizer_integration` (a `src-tauri/` fájlban) ellenőrzi a teljes tömörítési + kicsomagolási oda-vissza utat egy 6502 emulátoron a valódi kicsomagoló bináris fájllal. Sikeres feltétel: 10000 bájt, amely bájt-egyenlő a forrás `multi-color.bin` fájljával.

---

### REU_CHECK

Észleli, hogy van-e Commodore RAM bővítőegység (REU) csatlakoztatva – mintha a `PEEK($D010)` regisztert ellenőrizné a hardver meglétének megállapítására. Két minta `$DF04` REU regiszterbe való visszaírásával és visszaolvasásával teszteli.

| Mező      | Leírás                |
| --------- | --------------------- |
| Egyik sem | Nincsenek operandusok |

**Generált kód (34 bájt):**
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
> A makró normalizálja az eredményt, így a következő ág egyszerű marad: az `BNE` REU jelenlétét, az `BEQ` hiányzó REU-t jelent.

**Szakértői szintaxis:**
```
.reu_check
```

**Eredmény a jelzőkben:**
- **Z = 0** (eredmény ≠ 0) → REU jelen → `BNE` használata
- **Z = 1** (eredmény = 0) → nincs REU → használja az `BEQ`

**Nincsenek konfigurálható mezők** — a makró minden alkalommal ugyanazt a kódot generálja.

**Tipikus használat:**
```assembly
REU_CHECK
BEQ no_reu        ; skip if REU not present
; ... REU code here ...
no_reu:
```

---

### REU_STASH / REU_FETCH / REU_SWAP

DMA blokkátvitel C64 RAM és REU bővítőmemória között – mint egy nagyon gyors POKE ciklus, de a CPU nem végez semmilyen munkát (a REU chip másolja az adatokat, miközben a CPU áll). Egy `$1000` bájtos átvitel gyakorlatilag azonnali.

| Makró       | Irány         | `$DF01` parancs |
| ----------- | ------------- | --------------- |
| `REU_STASH` | C64 RAM → REU | `$90`           |
| `REU_FETCH` | REU → C64 RAM | `$91`           |
| `REU_SWAP`  | C64 RAM ↔ REU | `$92`           |

**Mezők:**

| Mező     | Leírás                                | Példa  |
| -------- | ------------------------------------- | ------ |
| C64 cím  | Forrás/cél a C64 RAM-ban (hex)        | `C000` |
| REU-cím  | Forrás/cél REU-ban (hex, 16 bites)    | `0000` |
| REU bank | REU memóriabank (0–7)                 | `0`    |
| Hossz    | Átviendő bájtok száma (hex, 16 bites) | `1000` |

**Szakértői szintaxis:**
```
.reu_stash $C000, $0000, 0, $1000
.reu_fetch $C000, $0000, 0, $1000
.reu_swap $C000, $0000, 0, $1000
```

**Generált kód (40 bájt):**
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

> **Megjegyzés:** A parancsok az `$90/$91/$92` címeket használják (a 4. bit beállítása = azonnali DMA mód). Az `$DF01` címre írás elindítja az átvitelt; a CPU a befejezés után folytatja a munkát.

---

### TURBO_SET

Beállítja az **Ultimate-64 (U64) CPU sebességét** a `$D031` regiszteren keresztül. Nincs hatással egy valódi C64-re vagy más emulátorokra.

**Mezők:**

| Mező        | Leírás               | Hatótávolság                                         |
| ----------- | -------------------- | ---------------------------------------------------- |
| Sebesség    | CPU sebességindex    | 0 = 1 MHz … 7 ≈ 10 MHz … 15 ≈ 48 MHz                 |
| Rossz vonal | Rossz vonal emuláció | Engedélyezett (C64 kompatibilis) / Letiltott (turbó) |

A sebességbájt kiszámítása a következőképpen történik: `(speedIndex &amp; 0x0F) | (badline_disabled ? 0x80 : 0x00)`.

**Generált kód (5 bájt):**
```
A9 xx   LDA #speed_byte
8D 31 D0   STA $D031
```

**Szakértői mód szintaxisa:**
```
.turbo_set 7,0    ; speed=7 (~10 MHz), badline enabled
.turbo_set 15,1   ; speed=15 (~48 MHz), badline disabled
```

> **Megjegyzés:** Ez a makró csak az U64 hardvert érinti. Egy valódi C64-en vagy más emulátorokon ez a `$D031` fájlba ír, ami befolyásolhatja a CIA-t, vagy figyelmen kívül hagyható.

---

### SUPERCPU_DETECT

Ellenőrzi, hogy van-e telepítve **CMD SuperCPU** gyorsító — például `PEEK($D0B8)` —, hogy a `$FF`-től eltérő értéket ad-e vissza.

**Generált kód (5 bájt):**
```
AD B8 D0   LDA $D0B8
C9 FF      CMP #$FF
```

**Eredmény a jelzőkben:**
- **Z = 0** → SuperCPU jelen → `BNE` használata
- **Z = 1** → Nem található SuperCPU → használja az `BEQ` függvényt

**Nincsenek konfigurálható mezők.**

**Szakértői szintaxis:**
```
.supercpu_detect
```

**Tipikus használat:**
```assembly
SUPERCPU_DETECT
BEQ no_scpu       ; skip if SuperCPU not present
; ... SuperCPU turbo code here ...
no_scpu:
```

---

### TURBO_ENABLE

Be- vagy kikapcsolja a(z) **CMD SuperCPU turbó módot**. Először hívja meg a(z) `SUPERCPU_DETECT` függvényt, és hagyja ki ezt, ha a SuperCPU nincs jelen.

| Mód          | Nyilvántartás | Hatás                                         |
| ------------ | ------------- | --------------------------------------------- |
| Engedélyezés | `$D07A`       | Turbó bekapcsolása (akár 20 MHz SuperCPU-val) |
| Letiltás     | `$D07B`       | Visszatérés 1 MHz-es kompatibilitási módba    |

**Generált kód (5 bájt):**
```
A9 00         LDA #$00
8D 7A D0      STA $D07A    ; (or $D07B for disable)
```

**Szakértői mód szintaxisa:**
```
.turbo_enable on
.turbo_enable off
```

> **Megjegyzés:** Először hívd meg a `SUPERCPU_DETECT` makrót, és ha a SuperCPU nincs jelen, akkor e makró körül ágazz el.

---

<a id="map_copy"></a>
### MAP_COPY

Egy forráscímről egy tilemap-et másol a képernyő RAM-ba (és opcionálisan a szín RAM-ba) `LDA abs,X` / `STA abs,X` ciklusok sorozatát használva. Ciklusonként egy 256 bájtos oldal másolódik; egy részleges oldal a végén a `CPX #rem / BNE` paranccsal állítja le. Nincs szükség JSR-re — az összes kód inline generálódik.

| Mező                  | Leírás                                                                                                                                                                                     |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Forráscím (képernyő)  | A térképadatok betöltés utáni helyének hexadecimális címe (pl. `C000`)                                                                                                                     |
| Képernyő RAM cél      | Hová másolja a képernyőkódokat (pl. `0400`)                                                                                                                                                |
| Méret (bájt)          | Másolandó bájtok száma összesen — jellemzően `$03E8` = 1000 (40×25 karakter)                                                                                                               |
| Kombinált .bin fájlok | Ha be van jelölve, akkor a képernyőkódokat közvetlenül a `source + size` értékeknél színadatok követik; a színadatokat a **Color RAM dest** memóriaterületre másolja egy második menetben. |
| Színes RAM cél        | Színadatok célhelye — alapértelmezett `D800` (C64 színes RAM)                                                                                                                              |

**Generált ASM (1000 bájtos térkép, csak képernyő):**
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

**Méret:** `2 (LDX) + teljesOldalak×9 + (rem &gt; 0 ? 11 : 0)` bájt szakaszonként. Kombinált módban ez megduplázódik (képernyőszakasz + azonos színű szakasz).

**Párosítás a Térképszerkesztővel:**

A Térképszerkesztő **Fájlok → Térkép + színes RAM (.bin)** parancsa egyetlen bináris fájlt exportál, ahol az első `size` bájtok képernyőkódok, a következő `size` bájtok pedig színes RAM értékek. Használd a MAP_COPY függvényt a **Combined .bin** jelölőnégyzettel, és irányítsd a **Source addr** címet oda, ahová ez a fájl betöltésre került (pl. az INCBIN-en keresztül a `$C000` címen):

```
* = $C000
    INCBIN "map-color.bin" @ $C000   ; screen codes $C000–$C3E7, color $C3E8–$C7CF
* = $0801
    ; ...
    MAP_COPY src=$C000 dst=$0400 size=1000 combined color_dst=$D800
```

**Szakértői mód szintaxisa:**
```
.map_copy $C000, $0400, 1000               ; screen only
.map_copy $C000, $0400, 1000, auto, $D800  ; combined (color at src+size)
.map_copy $C000, $0400, 1000, $C3E8, $D800 ; explicit color source address
```

---

<a id="map_copy16x16"></a>
### MAP_COPY16X16

Egy 16×16 karakteres területet másol ki egy kompakt, 256 bájtos képernyőkód-blokkból, plusz egy hozzá illő 256 bájtos színes RAM-blokkot. Charset Canvas exportokhoz és kis csempe/kép darabokhoz készült, ahol tizenhat különálló MAP_COPY sor írása zajos lenne.

**Alapértelmezett elrendezés:**

| Adat                   | Alapértelmezett cím        |
| ---------------------- | -------------------------- |
| 16×16-os képernyőkódok | Forráscím (`src`)          |
| 16×16 színértékek      | `forrás + 256`             |
| Képernyő RAM célhelye  | `0400 $ + sor×40 + oszlop` |
| Színes RAM célhely     | `$D800 + sor×40 + oszlop`  |

**Szakértői mód szintaxisa:**
```
.map_copy16x16 $3000, 12, 4
.map_copy16x16 $3000, 12, 4, $0400, $3100, $D800
```

A rövid űrlap a képernyőbájtokat az `$3000` oszlopból, a színbájtokat az `$3100` oszlopból másolja, és a 16×16-os blokkot a 12. oszlop 4. sorába helyezi. Az érvényes bal felső pozíciók a `col = 0..24` és az `row = 0..9`, így a teljes 16×16-os terület a 40×25-ös C64-es szövegképernyőn marad.

**Generált viselkedés:**

- Tizenhat beágyazott sormásolatot generál.
- Minden sor 16 képernyőbájtot és 16 színbájtot másol.
- Nincs szükség JSR-re; a kód közvetlenül a makró pozícióban kerül kibocsátásra.
- Normál karaktermóddal és többszínű karaktermóddal működik; a Szín RAM bájtjai tartalmazzák az egyes cellák karakterszín/többszínű engedélyezési bitjét.

Tipikus párosítás a Charset Canvas-szal:

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

Minden híváskor egy sprite animációs képkockát léptet előre, és frissíti a VIC-II sprite adatmutatót. Képkockánként egy bájtot tároljon egy táblázatban (a sprite adatlap száma = `adat_cím / 64`), mutasson rá a SPRITE_ANIM-mel, és játékkockánként egyszer hívja meg – nincs szükség JSR-re.

| Mező            | Leírás                                                                                       |
| --------------- | -------------------------------------------------------------------------------------------- |
| Sprite #        | Sprite-szám 0–7                                                                              |
| Keretlista címe | A frame tábla hex címe — keretenként egy bájt, minden bájt = sprite oldal (`data_addr / 64`) |
| Képkockák száma | Képkockák száma összesen (1–255)                                                             |
| ZP keret        | Nulla oldalszámú bájt, amelyet keretszámlálóként használnak (pl. `FB`)                       |

**Generált ASM (sprite 0, 4 képkocka, ZP `$FB`, lista a `$C100` pontban):**
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

**Méret:** 19 bájt.

**Tipikus használat:**
```
frameTable:
    .byte $21, $22, $23, $24   ; 4 frames at $0840, $0880, $08C0, $0900

gameloop:
    WAIT_RASTER ($FF)
    SPRITE_ANIM (sprite=0, list=$C100, count=4, zp=$FB)
    JMP gameloop
```

**Szakértői mód szintaxisa:**
```
.sprite_anim spriteNum, frameListAddr, frameCount, zpByte
; example:
.sprite_anim 0, C100, 4, FB
```

> **Tipp:** Helyezd el a frame táblázatot RAWBYTES blokkként egy fix címen. A számláló ZP bájtját (`$FB`) az első hívás előtt `$00` értékre kell inicializálni. Ha a kódod az `$FB` címet valami másra használja, válassz egy szabad ZP helyet.

---

<a id="score_bcd"></a>
### SCORE_BCD

Hozzáad egy fixpontos értéket egy memóriában tárolt többbájtos BCD-pontszámhoz, majd minden számjegyet képernyőkód karakterként jelenít meg a képernyő RAM-ban. A 6502-es decimális módot (`SED`/`CLD`) használja a hordozható BCD-aritmetikához – nincs szükség kézi hordozás-zsonglőrködésre.

| Mező              | Leírás                                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------------------ |
| Pontszám címe     | A BCD pontszámbájtok hexadecimális címe (pl. `C200`). Az alsó bájttól kezdődik.                              |
| Számjegyek        | BCD bájtok száma (mindegyik bájt két számjegyet tartalmaz: `$99` = "99"). `4` bájt = legfeljebb 99999999.    |
| Pontok hozzáadása | Hívásonként hozzáadandó decimális érték (pl. `100`).                                                         |
| Képernyőcím       | Hová kell írni a számjegy képernyőkódokat (pl. `0400`). Számjegyenként egy bájt (a magasabb nibble először). |

**Szakértői szintaxis:**
```
.score_bcd $C200, 4, 100, $0400
```

**Generált ASM (4 bájt, +100 pont, pontszám `$C200`, képernyő `$0400`):**
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

**Méret:** `3 + számjegy×8` bájt (SED + CLC + CLD többletterhelés + 8 bájt BCD bájtonként az ADC + kijelzőhurok számára).

**Szakértői mód szintaxisa:**
```
.score_bcd $C200, 4, 100, $0400
```

> **Tipp:** Indításkor inicializálja a pontszámbájtokat `$00` értékre. A pontszámcímnek a nulla oldalas vagy abszolút RAM-ban kell lennie – nem ROM-ban. A képernyőcímnek a bal szélső számjegy cellára kell mutatnia; a számjegyeket balról jobbra kell írni (a leghelyesebb bájttal kezdve).

> **BCD tartomány:** `számjegyek=4` bájt → 8 decimális számjegy → maximális pontszám 99 999 999. Minden bájt két BCD számjegyet kódol: `$00`–`$99`.

---

## 10. Hibakereső integráció

Az alkalmazás támogatja a **RetroDebugger** külső C64 hibakeresőt. Ez a program fogadja az összeállított programból generált töréspontokat, szimbólumokat és autostart flageket.

### RetroDebugger

A [RetroDebugger](https://github.com/slajerek/RetroDebugger) egy többplatformos Commodore 64 hibakereső töréspont-támogatással, memória-ellenőrzéssel és címke-érzékeny szétszereléssel.

**Beállítás:** Nyisd meg a **Beállítások → RetroDebugger futtatható fájl konfigurálása** fájlt, és irányítsd át a `RetroDebugger` bináris fájlra.

**Indítás:** Kattintson a **Debug (RetroDebugger)** lehetőségre az eszköztáron. Az alkalmazás a következőket teszi:

1. Szereld össze a programot egy `.prg` fájlba egy ideiglenes könyvtárban.
2. Írj egy **töréspont-fájlt** (`töréspontok.txt`) — minden megjelölt blokkhoz egy `törési $ADDR` fájlt.
3. Írj egy **szimbólumfájlt** (`symbols.txt`) Vice/RetroDebugger címkeformátumban (`al C:addr .name`). Minden LABEL és CONST blokk benne van.
4. Írd le a C64Debugger stílusú mellékgépeket is a lefordított PRG mellé: `.dbg`, `.sym` és `.vs`.
5. Indítsd el a RetroDebuggert a következővel:
   ```
   RetroDebugger -prg <file.prg> -breakpoints <breakpoints.txt> -symbols <symbols.txt> [flags]
   ```

### Töréspont blokkok

Kattintson a töréspont ikonra (●) bármelyik utasításblokkon, ha azt töréspontként szeretné beállítani. A töréspontos blokkok pirossal vannak kiemelve. Címük minden hibakereső indításakor beíródik a töréspont fájlba.

### Hibakereső jelzők (Beállítások fül)

| Váltás                            | Zászló                         | Hatás                                                                  |
| --------------------------------- | ------------------------------ | ---------------------------------------------------------------------- |
| `-jump` BE                        | `-jump $CÍM`                   | Betöltés után közvetlenül a program kezdőcímére ugorhat                |
| `-szüneteltetés megszüntetése` BE | `-szüneteltetés megszüntetése` | A hibakereső szüneteltetésének azonnali feloldása betöltéskor          |
| `-várás` BE                       | `-vár <ms>`                    | Várjon `<ms>` milliszekundumot a folytatás előtt — 500 ms vagy 1000 ms |

> **Tipp:** A legtöbb program esetében engedélyezd az `-jmp` és az `-unpause` kapcsolókat az azonnali automatikus indításhoz. Használd az `-wait 500` vagy az `-wait 1000` kapcsolót, ha a programod olyan IRQ-kat vagy SID zenét állít be, amelynek időre van szüksége az inicializáláshoz az első raszter előtt.

---

## 11. Tudásbázis linkek

Gyorsreferencia linkek érhetők el az alkalmazásban a **Tudásbázis** alatt:

| Forrás                  | URL-cím                                        |
| ----------------------- | ---------------------------------------------- |
| 6502 Opkódok referencia | http://www.6502.org/tutorials/6502opcodes.html |
| C64 KERNAL függvények   | https://sta.c64.org/cbm64krnfunc.html          |
| C64 memóriatérkép       | https://sta.c64.org/cbm64mem.html              |
| C64 színkódok           | https://sta.c64.org/cbm64col.html              |
| VIC-II cikk             | https://www.cebix.net/VIC-Article.txt          |
| C64 kódbázis            | https://codebase.c64.org/                      |
| A turbóösszeszerelő     | https://turbo.style64.org/                     |
| RetroDebugger           | https://github.com/slajerek/RetroDebugger/     |

---

## 12. D64 Exportálás és futtatás

Az 1.5.1-es verzió lehetővé teszi a program (és a további adatfájlok) C64 D64 lemezképbe csomagolását és a VICE-ban való elindítását – vagy a lemezkép exportálását máshol történő felhasználásra.

### Megosztott futás gomb

Az eszköztár **Futtatás** gombját egy **osztott gomb** váltotta fel:

| Rész                | Akció                                               |
| ------------------- | --------------------------------------------------- |
| **▶ Futtatás** (fő) | Végrehajtja az aktuálisan kiválasztott futási módot |
| **▾** (nyíl)        | Megnyitja az üzemmódválasztót                       |

**Elérhető futási módok:**

| Mód                             | Leírás                                                                                                                                                                                                                                    |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Futtatás PRG-ként**           | Összegyűjtjük egy ideiglenes `.prg` fájlt, és közvetlenül elindítjuk a VICE-t. Klasszikus viselkedés.                                                                                                                                     |
| **Futtatás a D64-en keresztül** | Állítsd össze, készíts egy `.d64` lemezképet (c1541 használatával), add hozzá a konfigurált extra fájlokat, majd indítsd el a VICE-t a lemezről. Használd ezt, amikor a programod futásidőben fájlokat tölt be (pl. a LOADFILE makróval). |
| **Hardveren futtatva**          | Gyűjtsd össze PRG-re, és küldd el egy **1541 Ultimate / Ultimate 64** eszközre a helyi hálózaton keresztül. Lásd: [13. szakasz](#13-hardware-settings).                                                                                   |

A kiválasztott mód a munkamenetek között mentésre kerül.

### Exportálás D64-be párbeszédpanel

Nyissa meg a **PRG mentése ▾** legördülő menü → **Exportálás D64-be** menüpontban. A párbeszédpanelen a következőket teheti:

1. Állítsd be a **lemez nevét** (maximum 16 karakter) és az **program nevét** — ezek a nevek jelennek meg a C64 lemezkönyvtárában.
2. **Extra fájlok hozzáadása** — kattintson az **+** kombinációkra bármely bináris fájl kiválasztásához (`.prg`, `.bin`, `.sid` stb.). Minden további fájlhoz:
   - **Név** — hogyan jelenik meg a D64 könyvtárban (maximum 16 karakter, automatikus nagybetűs írásmód).
   - **Addr** (betöltési cím, opcionális) — ha meg van adva, egy 2 bájtos PRG fejléc kerül elé. Nyers bájtok fejléc nélküli írásához hagyja üresen.
   - **Dst** (kicsomagolási cél, csak EXO esetén) — ahová a kicsomagolónak az adatokat a C64-re kell vinnie. Ha az EXO engedélyezve van, az extra fájlt a `exomizer mem -l <Cím> file,<Dst>` paranccsal tömöríti a rendszer, mielőtt a D64-re íródik. A +2 biztonsági eltolás kompenzációja automatikusan alkalmazásra kerül.
   - **EXO** — jelölőnégyzet, amely bekapcsolja a visszafelé `mem` módú adatfeldolgozást ehhez a bejegyzéshez. A lemezen lévő méret jellemzően az eredeti 5-20%-a.
3. Kattintson az **Export** gombra a `.d64` fájl létrehozásához a VICE `c1541` eszközével.

**Párosítás az EXODECRUNCH:** metódussal Amikor egy EXO=on beállítással küldesz el egy fájlt, az azt olvasó programnak be kell töltenie azt az **Addr** címre (sec=1, a fájl saját PRG fejléce), majd meg kell hívnia az **EXODECRUNCH** makrót, hogy visszacsomagolja a fájlt az **Dst** mappába. A teljes mintát lásd az `exo-multicolor-demo` példában.

### D64 metaadatok a projektekben

A lemez neve, a program neve és az extra fájlok listája a projekt JSON-fájljában kerül mentésre (a `d64` kulcs alatt). Amikor újratölti a projektet vagy egy D64 metaadatokat tartalmazó mintát, az extra fájlok automatikusan visszaállnak – nem kell minden alkalommal újra hozzáadni őket.

Az **loadfile-demo** minta előre konfigurálva tartalmazza a `DEMO-COLORS.PRG` fájlt extra fájlként. Jelöld ki, nyisd meg a **Run via D64** fájlt, és kattints az **Run** gombra a teljes betöltési folyamat működés közbeni megtekintéséhez.

> **Követelmény:** A D64 exportáláshoz és a Futtatás D64-en keresztül funkcióhoz egyaránt konfigurálni kell a VICE-t (`c1541`) a [Hardverbeállítások](#13-hardware-settings) alatt.

### D64 szerkesztő (meglévő lemezkép böngészése és szerkesztése)

A Görbeszerkesztő utáni eszköztár ikon megnyitja a **D64 szerkesztőt** – egy önálló eszközt, amellyel közvetlenül, az aktuálisan megnyitott programtól függetlenül dolgozhatunk egy meglévő `.d64` képpel. A fenti Exportálás D64-be párbeszédablakkal ellentétben (amely mindig egy *új* lemezt épít a lefordított PRG-ből), a D64 szerkesztő a lemezképet a `c1541` segítségével szerkeszti helyben, így könnyűsúlyú lemezkezelőként is funkcionál.

**Fájlok ▾ menü:**

| Tétel                   | Akció                                                                                               |
| ----------------------- | --------------------------------------------------------------------------------------------------- |
| **Új D64…**             | Válasszon ki egy cél elérési utat, és hozzon létre ott egy frissen formázott, üres lemezképet.      |
| **D64 megnyitása…**     | Válassz ki egy meglévő `.d64` fájlt és töltsd be a könyvtárát.                                      |
| **Mentés másként…**     | Másolja a jelenleg megnyitott lemezképet egy új elérési útra, és folytassa a másolat szerkesztését. |
| **Futtassa a VICE-ban** | Indítsa el a jelenleg megnyitott lemezképet közvetlenül a VICE-ban (`-drive8type 1541`).            |

**Eszköztár:**

| Ikon                     | Akció                                                                                                                |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| **Program hozzáadása**   | Válassz ki egy helyi fájlt, és írd be a lemez könyvtárába.                                                           |
| **Kijelöltek kinyerése** | A kiválasztott bejegyzés bájtjainak mentése egy helyi `.prg` fájlba.                                                 |
| **Kijelölt átnevezése**  | A bejegyzés nevének szerkesztése a táblázatban soron belül — Az Enter megerősíti, az Escape megszakítja a műveletet. |
| **Kijelölt törlése**     | Távolítsa el a kiválasztott bejegyzést a lemezről.                                                                   |
| **Frissítés**            | Olvasd be újra a könyvtárat, pl. miután szerkesztetted a lemezt egy másik eszközzel.                                 |

**Program hozzáadása:** Egy olyan fájl kiválasztása, amely már `.prg` végződésű, csak a **Név** és a lemez **Típusa** (PRG/SEQ/USR/REL) megadását kéri – egy `.prg` már rendelkezik saját betöltési cím fejléccel, így változatlanul kerül kiírásra. Bármely más fájl kiválasztása (pl. egy nyers `.bin`) a következőket is mutatja:

- **Cím betöltése** (hex, opcionális) — egy 2 bájtos PRG fejlécet illeszt be erre a címre; hagyja üresen, ha a bájtokat nyersen szeretné írni.
- **Kicsomagolási cím** (hex, opcionális) — csak az Exomizerrel együtt használatos; a célcím, ahová a kicsomagolónak ki kell csomagolnia az adatokat.
- **Exomizer** jelölőnégyzet – a fájl tömörítése írás előtt ugyanazokkal a `mem`/`sfx` tömörítési módokkal, mint a fenti Exportálás D64-be párbeszédpanelen található extra fájlok esetében.

A könyvtárlista a fájlneveket ugyanolyan betűtípussal és nagybetűs stílusban jeleníti meg, mint egy valódi C64 `LOAD"$",8` lista.

> **Követelmény:** a D64-be exportáláshoz hasonlóan a D64 szerkesztőhöz is VICE (`c1541`) szükséges, amely a [Hardverbeállítások](#13-hardware-settings) részben van konfigurálva. Minden művelet (hozzáadás/törlés/átnevezés/kivonás) közvetlenül a lemezen lévő `.d64` fájlra vonatkozik – nincs külön „mentés” lépés.

---

## 12b. CRT Export (Magic Desk 64K kazetta)

A **Menü → Build → CRT Build** parancs egy Commodore 64 kazettaképet (`.crt`, **19-es típusú kazetta — Magic Desk / Domark / HES Australia**) hoz létre, amely VICE, TheC64, valódi hardveren EasyFlash / Kung Fu Flash segítségével, és 1541 Ultimate II+ kazettafoglalatokon fut. Elérhető mind **blokk módban**, mind **Szakértő módban**, és — a jelenlegi build óta — **UltimateBasic módban** is.

### A kosár tartalma

- **8 × 8 KB bank** `$8000` áron, bankváltás `$DE00`-en keresztül (Magic Desk konvenció: alsó 3 bit = bank, 7. bit = kocsi letiltása).
- A **Bank 0** egy 128 bájtos fejlécet és rendszerbetöltőt tartalmaz:
  - `$8000/$8002` hidegindítás + melegindítás vektorok `$8009`-re mutatnak.
  - `$8004–$8008` = a KERNAL visszaállító kód által megkövetelt `CBM80` aláírás.
  - `$8009–$807F` = a betöltő: SEI / stack init / `JSR $FDA3` (IOINIT) / `JSR $FD50` (RAMTAS) / `JSR $FD15` (RESTOR) / `JSR $FF5B` (CINT), majd egy bájtmásoló ciklus, amely a hasznos adatot a cart ROM-ból a RAM-ba streameli, és bankot vált, amikor az `$FC` eléri az `$A0` értéket. A végén egy apró **kilépési csonkot** átmásol a `$0100` címre, letiltja a kosarat az `LDA #$80 : STA $DE00` paranccsal, és a `JMP` paranccsal a belépési pontra.
- Az **Payload** a 0. bankban a `$8080` értéknél kezdődik, és szükség szerint az 1–7. bankokba bonyolódik. Maximális hasznos adat = `8 * 8192 − 128 = 65 408 bájt`.

### Berakodási cím és belépési pont

A Build CRT soha nem használ Exomizert (a kicsomagoló nem futtatható a cart ROM-ról). A jelenlegi lapot a szabványos automatikus indítási folyamattal fordítja le, és a betöltési címet a PRG fejlécből, a belépési pontot pedig a SYS célból veszi:

- **Blokk / Szakértő mód BASIC SYS csonkkal bekapcsolva:** betöltés = `$0801`, bejegyzés = a SYS cél (jellemzően `$080D` vagy a felhasználó eredete).
- **Blokk / Szakértő mód kikapcsolt BASIC SYS csonkkal:** betöltés = felhasználói eredet (a klasszikus `$0801 → $C000` tartalék opcióval), bejegyzés = betöltési cím.
- **UltimateBasic mód:** A betöltés és a bejegyzés is az UB fordító térképéről származik (`build.map.loadAddress`). A hasznos adaton belüli UB autostart csonk ezután pontosan úgy hajtódik végre, ahogyan a lemezről futtatott `LOAD "...",8,1 : RUN` parancs után történne.

Az ASM kimenetében látható eredetcím megőrződik; a betöltő egyszerűen átmásolja a lapos memóriaképet a PRG-ből a RAM-ba, és a belépési pontra ugrik, miután a cart ROM leképezése megszűnt.

### Méretkorlát

Mivel a hasznos adat lineárisan tárolódik, és az `assembleProgramToPrg()` egy sima `minAddr..maxAddr` puffert ad vissza nullákkal kitöltött résekkel, egy szélesen elhelyezkedő ORG szegmensekkel rendelkező program (pl. `$0801` + `$C000` + `$E000`) minden egyes bájtot beleszámít a 65 408 bájtos költségvetésbe. Ha túllépi a korlátot, a build `saveCrtTooLarge` hibával megszakad – vagy tömörítse a memória-elrendezést, vagy ossza fel az adatokat.

> **⚠️ Fontos figyelmeztetés – olvassa el a CRT monitor elküldése előtt.**
> 
> A betöltő a standard reset szekvencia részeként meghívja a KERNAL **`RESTOR` ($FD15)** függvényt. Ez szándékosan átírja a standard I/O vektorokat a `$0314/$0315`, `$0316/$0317`, `$0318/$0319`, `$0328/$0329` és barátaiknál, és visszaállítja azokat az alapértelmezett ROM értékekre. Következmények:
> 
> - **Bármely IRQ / NMI / BRK hook, ami a CRT bootok törlése előtt lett beállítva.** A programodnak magától kell telepítenie ezeket a belépés után – pontosan úgy, mint egy friss `LOAD "",8,1 : RUN` parancsot szalagról/lemezről.
> - Az olyan **UltimateBasic programok**, amelyek a belépéskor élő, nem alapértelmezett KERNAL vektorokra támaszkodnak, explicit `SYS` vagy init hívást igényelhetnek az automatikus indítási csonkban. A szabványos UB automatikus indítás azonnal működik; a vektorokat *a* `RUN` előtt összekapcsoló bővítménykönyvtárak nem.
> - Az **CIA1 / CIA2** újrainicializálása az `IOINIT` által történik. Az egyéni időzítő beállításokat (raszteres IRQ-k, CIA-A zenelejátszó) a belépés után újra kell programozni.
> - A kocsit egy 8 bájtos csonk tiltja le az **RAM-ban a `$0100`** címen, így a `STA $DE00` futási idejét nem szakíthatja meg egy hibás ROM-lehívás. Ne hagyatkozzon arra, hogy a `$0100–$0107` mappák tartalmazzák a verem tetejének képét a belépéskor – az első RAM-lehívás felülírja a csonkot.
> 
> Ha egy CRT VICE környezetben fut, de valódi hardveren hibát jelez, akkor először is ellenőrizni kell, hogy a program a belépéskor feltételez-e egy adott KERNAL vektor vagy CIA időzítő állapotot. Telepítsd az állapotot explicit módon az init rutinodba, és mindkettőn ugyanúgy fog viselkedni.

### Kompatibilitás

| Platform                        | Állapot                                                |
| ------------------------------- | ------------------------------------------------------ |
| ALELNÖK (`x64sc`, `x64`)        | A **Fájl → Kazettakép csatolása** menüpontban működik. |
| TheC64 / TheC64 Mini            | A beépített patronbetöltőn keresztül működik.          |
| Kung Fu Flash                   | Működik — natív Magic Desk mód.                        |
| EasyFlash patron                | Magic Desk-ként programozva működik.                   |
| 1541 Ultimate II+ / Ultimate 64 | **Patron → Kosár betöltése kép ** menüpontban működik. |
| Kaméleon / Turbó kaméleon       | Művek.                                                 |

---

## 13. Hardverbeállítások

Nyissa meg az eszköztár menüjének **Beállítások → Hardverbeállítások…** menüpontjában. Az összes külső hardverútvonal és hálózati konfiguráció itt található.

### VICE emulátor

| Beállítás             | Leírás                                                                     |
| --------------------- | -------------------------------------------------------------------------- |
| **Válassza a VICE-t** | Tallózz a(z) `x64sc` (vagy `x64`) VICE futtatható fájlhoz.                 |
| **Állapot**           | Megjeleníti, hogy a végrehajtható fájl elérési útja érvényes és elérhető-e |

VICE szükséges a **Futtatás PRG-ként**, **Futtatás D64-en keresztül** és **Exportálás D64-be** parancsokhoz.

### Exomizer

| Beállítás                                | Leírás                                                                                                                                                                                       |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Válaszd az Exomizert**                 | Tallózással keresd meg az `exomizer` futtatható fájlt.                                                                                                                                       |
| **Szegélyvillanás dekompresszió közben** | Ha engedélyezve van, az SFX-tömörített PRG-k az exomizer beépített `-x1` gyors szegélyvillanás effektjét használják; ha le van tiltva, az `-n` effektust adják át a csendes kicsomagoláshoz. |
| **Állapot**                              | Megjeleníti, hogy a végrehajtható fájl elérési útja érvényes és elérhető-e                                                                                                                   |

**Munkafolyamat:**
1. Telepítsd az Exomizer bináris fájlt:
   - **Windows:** töltse le az előre elkészített `win32/exomizer.exe` fájlt a https://bitbucket.org/magli143/exomizer/wiki/Home vagy a https://csdb.dk/release/?id=244342 oldalról.
   - **macOS:** `brew install exomizer` (Magnus Lind hivatalos 3.1.2-es buildjét telepíti).
2. Konfigurálja az elérési utat az **Hardverbeállítások → Exomizer részben **.
3. Engedélyezd a **Futtatás Exomizerrel** jelölőnégyzetet a **Beállítások menüben**.
4. Az összes **Run** művelet (PRG, D64, hardver) és az **Build** műveletek (Build PRG, Build D64) mostantól az összeállított programot az `exomizer sfx sys` paraméteren keresztül futtatják indítás vagy mentés előtt.

Az Exomizer ugyanúgy működik Windows és macOS rendszereken – a parancssori felületet a Tauri háttérrendszer hívja meg; az integrációban semmi sem platformspecifikus.

** Két belső tömörítési módot használnak:**

| Mód                | Használta                                                    | Hívási konvenció                                                                                                                                                                                    |
| ------------------ | ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sfx rendszer`     | Építés/Futtatás Exomizerrel kapcsolóval (fő PRG útvonal)     | Önkicsomagoló PRG beépített decruncherrel; a Border-flash beállítás a `-x1` és a `-n` közötti tartományokat szabályozza.                                                                            |
| `mem` (visszafelé) | D64-en keresztül futtatva → fájlonként **EXO** jelölőnégyzet | Minden extra fájlt `mem` módú adatfolyamba tömörít; a program futásidőben kicsomagolja azt az **EXODECRUNCH** makró és egy előre elkészített kicsomagoló (`samples/exo-decrunch.bin`) segítségével. |

> **Tipp:** Ha az Exomizer elérési útja nincs konfigurálva, de a jelölőnégyzet be van jelölve, akkor egy hibaüzenet jelenik meg az indítás helyett. Kapcsolja ki a jelölőnégyzetet a tömörítés nélküli futtatáshoz.

> **Integrációs teszt:** `cargo test --test exomizer_integration` (a `src-tauri/` fájlban) ellenőrzi a teljes memória módú tömörítési + kicsomagolási oda-vissza utat egy 6502 emulátoron.

### Retro hibakereső

| Beállítás                      | Leírás                                                    |
| ------------------------------ | --------------------------------------------------------- |
| **RetroDebugger kiválasztása** | Tallózással keresse meg az `RetroDebugger` bináris fájlt. |
| **Állapot**                    | Megmutatja, hogy az elérési út érvényes-e                 |

A teljes hibakereső dokumentációt lásd a [9. szakasz](#9-debugger-integration) alatt.

### C64 Végső / 1541 Végső

Összeállított PRG-ket futtathat közvetlenül valódi hardveren a helyi hálózaton keresztül az Ultimate REST API használatával.

| Beállítás                | Leírás                                                                 |
| ------------------------ | ---------------------------------------------------------------------- |
| **Gép (IP)**             | Az eszköz IP-címe (pl. `192.168.1.100`)                                |
| **Jelszó**               | Opcionális – ha az eszköz hitelesítést igényel                         |
| **Kapcsolat tesztelése** | Tesztkérést küld a(z) `/v3/runners/info` címre; OK-t vagy hibát jelez. |

**Munkafolyamat:**
1. Csatlakoztassa a 1541 Ultimate / Ultimate 64 készüléket a helyi hálózathoz.
2. Adja meg az IP-címét (és a jelszavát, ha be van állítva) a Hardverbeállítások részben.
3. Válaszd a **Futtatás hardveren** lehetőséget a megosztott futtatás menüből.
4. Kattintson a **▶ Futtatás** gombra — a PRG lefordításra kerül, és HTTP POST-on keresztül elküldésre kerül az eszközre a `/v3/runners/prg` címre. Az eszköz azonnal betölti és futtatja a C64-en.

> **Tipp:** Nincs szükség USB-kábelre vagy illesztőprogramra – a REST API be van építve az Ultimate firmware-be. A számítógépnek és az eszköznek ugyanazon a helyi hálózaton kell lennie.

---

## 14. Vizuális szerkesztők (eszközkészlet)

Az eszköztár **Toolkit** menüje csoportosítja a vizuális adatszerkesztőket, amelyek mindegyike egy közös Fájlok menüt (`Fájlok ▾`) használ a BIN betöltése / BIN mentése / Exportálás blokkokba / Mentés D64-be menüpontokban. Minden szerkesztő nyers `.bin` adatokat hoz létre, amelyek elhelyezhetők egy programban az `INCBIN` paraméterrel, vagy közvetlenül hozzáadhatók egy D64 lemezhez a **Mentés D64-be** bejegyzéssel.

A vizuális szerkesztő párbeszédablakok a fejlécüknél fogva húzhatók a teljes Visual Assembler munkaterületen. A mentett pozícióval nem rendelkező párbeszédablakok középre igazítva jelennek meg; áthelyezés után az utolsó pozíciója a felhasználói felület beállításaiban tárolódik, és a következő megnyitáskor visszaáll.

### Nagy felbontású / többszínű szerkesztő

Pixel szintű bitképszerkesztő 320×200 nagy felbontású és 160×200 többszínű móddal. Megnyitás a Toolkit → Nagy felbontású szerkesztő menüpontban.

| Jellemző                  | Leírás                                                                                                                          |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Módváltás                 | A **Többszínű** jelölőnégyzet a nagy felbontású (cellánként fekete-fehér) és a többszínű (cellánként 4 szín) között vált.       |
| Eszközök                  | Ceruza, radír, vonal, téglalap, kitöltött téglalap, ovális, kitöltött ovális, kitöltés.                                         |
| Szóróeszköz               | Airbrush stílusú festő, amely rajzolás közben pixeleket szór a kurzor körül.                                                    |
| Permetezés intenzitása    | A szóróeszköz melletti legördülő menüvel szabályozható az egyes szóróvonások sűrűsége.                                          |
| Színpaletta               | Előtér (tinta) + papír (háttér) választó. A többszínű mód automatikusan cellánként 3 extrát követ.                              |
| Visszavonás / Újraindítás | Löketenkénti előzmények, ctrl-Z / ctrl-Y.                                                                                       |
| Rács + Raszter            | Opcionális 8×8-as rács és raszteres sorrátét a cellaigazításhoz.                                                                |
| Kép importálása           | A vászonra dobott PNG/JPEG/GIF fájlok automatikusan kvantálódnak a 16 színű C64 palettára.                                      |
| Blokk exportálása         | BYTE/RAWBYTES blokkokat fűz a programhoz a kódolt bitképes, képernyő- és színadatokkal.                                         |
| Exportálás: `.bin`        | Elmenti a natív többszínű formátumot (10000 bájt: 8000 bitkép + 1000 képernyő + 1000 szín) a LOADFILE-ra $2000 fájlformátumban. |

### Sprite-szerkesztő

24×21 pixeles sprite szerkesztő több képkockás animációval. Megnyitás a Toolkit → Sprite szerkesztő menüpontban.

| Jellemző                  | Leírás                                                                                                                                                                                                                                                      |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Keretek                   | Keretek hozzáadása / eltávolítása / átrendezése; a keretsáv alul látható.                                                                                                                                                                                   |
| Mód                       | Monokróm / többszínű váltás.                                                                                                                                                                                                                                |
| Eszközök                  | Ceruza, kitöltés, vonal, téglalap, kör – plusz vízszintes tükrözés, függőleges tükrözés, eltolás balra/jobbra/fel/le (opcionális körbefuttatás). Az alakzateszközök élő előnézetet jelenítenek meg húzás közben; a véglegesítéshez engedje el a billentyűt. |
| Visszavonás / újraindítás | Teljes visszavonás/ismétlés művelet képkockánként. Ctrl/Cmd+Z / Ctrl/Cmd+Y vagy az eszköztár gombjai.                                                                                                                                                       |
| Képimportálás             | PNG vagy JPEG fájl importálása a Fájlok → Kép importálása menüpontban. Az importáló minden képpontot a legközelebbi C64 palettaszínhez rendel, és beírja az aktuális képkockába.                                                                            |
| Animáció előnézete        | Lejátszás / leállítás konfigurálható sebességgel.                                                                                                                                                                                                           |
| Blokk exportálása         | Minden képkockához beszúr egy RAWBYTES blokkot 64 bájtos, egymáshoz igazított címen, valamint egy sprite pointer beállítást.                                                                                                                                |
| Mentés `.bin`             | Képkockánként 64 bájtot ír (nyers sprite adatok kitöltés nélkül).                                                                                                                                                                                           |

### C64 karakter ROM böngésző ("Karaktertérkép")

A C64 karakter ROM (a beépített PETSCII betűtípus) csak olvasható megjelenítője. Megnyitható az **C64 chargen** bejegyzéssel az Eszközkészlet menüben. Hasznos egy karakterjel képernyőkódjának megkereséséhez, mielőtt azt a `RAWBYTES` vagy `TEXT` paranccsal megírná.

| Jellemző            | Leírás                                                                                                                                                                                                                                             |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Két karakterkészlet | 1. fül: ** 1. készlet — Felső/Grafika** (alapértelmezett mód bekapcsolás után). 2. fül: ** 2. készlet — Alsó/Felső** (`$0E` váltás után).                                                                                                          |
| Karakterjelrács     | 16×16-os rács, mind a 256 karakterből. Kattintson egy karakterjelre a részletes panel megtekintéséhez: nagyított 8×8 pixeles nézet, képernyőkód (decimális + hex), PETSCII kódok (alapértelmezett és eltolt is), valamint a nyers 8 bájtos bitkép. |
| Részletes panel     | Megjeleníti a kiválasztott karakterjel képernyőkódját, a PETSCII kódokat és a nyolc nyers bájtot – készen áll a beillesztésre egy `RAWBYTES` vagy BYTE blokkba.                                                                                    |
| Csak olvasható      | Itt nincs szerkesztés — a Karakterszerkesztővel (lent) módosíthatja a szimbólumokat.                                                                                                                                                               |

### Karakterszerkesztő (Karakterkészlet)

256 karakteres, 8×8 karakterkészlet-szerkesztő. Megnyitás az Eszköztár → Karakterszerkesztő menüpontban.

| Jellemző                   | Leírás                                                                                                                                                                                         |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ROM betöltése              | Importálja a C64 ROM karakterkészletet közvetlenül a VICE `chargen` fájljából (fájlválasztó nélkül).                                                                                           |
| Betöltés `.bin`            | Importál egy külső, 2048 bájtos karakterkészletű bináris fájlt.                                                                                                                                |
| Karakterenkénti előnézet   | 16 szélességű rács, amely mind a 256 karakterjelet tartalmazza, az aktuális cellával kiemelve.                                                                                                 |
| Pixel szerkesztő           | 8×8-as egykarakteres szerkesztő váltó/invertáló/törlés eszközökkel.                                                                                                                            |
| Karakterenkénti szín       | Minden karakterjelhez egy alapértelmezett Color RAM értéket tárol. Többszínű karaktermódban ez megőrzi a cellánkénti többszínű engedélyezési bitet és a karakter saját alsó 3 bites színét is. |
| Metaadatok oda-vissza útja | Kompatibilis adatok betöltésekor Charset Canvas / Map munkafolyamatokból a karakterenkénti szín metaadatok megmaradnak, így a szerkesztések a színszándék elvesztése nélkül folytatódhatnak.   |
| Blokk exportálása          | A RAWBYTES értékét a $0800 (2. blokk) vagy a $3800 (7. blokk) értéknél a kódolt karakterkészlettel fűzi hozzá.                                                                                 |

### Karakterkészlet-vászonszerkesztő

Teljes vászon karakterkészlet-festő képernyők létrehozásához egy teljes 256 karakteres karakterkészletből. Megnyitás a Toolkit → Charset Canvas menüpontban.

A vászon 16×16 karakteres. Monokróm módban ez 128×128 pixeles munkaterületet biztosít; többszínű karaktermódban 64×128 pixeles széles munkaterületet biztosít a C64 valódi karaktereinek többszínűségi szabályait használva.

| Jellemző                                    | Leírás                                                                                                                                                                                                                |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Monokróm / többszínű                        | A monokróm mód 1 bites 8×8-as karakterjeleket tárol. A többszínű mód két bites vízszintes pixelpárokat tárol, és a felhasznált cellákat a Color RAM 3-as bitjével jelöli.                                             |
| C64 színmodell                              | A háttér az `$D021` biteket használja; a megosztott többszínű 1 az `$D022` biteket használja; a megosztott többszínű 2 az `$D023` biteket használja; minden karakter saját színe a Color RAM 0–2 bitjeiből származik. |
| Rajzeszközök                                | A ceruza, radír, vonal, téglalap, ovális és elárasztásos kitöltés a karakterhatárokon átívelően működik.                                                                                                              |
| Szóróeszköz                                 | Airbrush stílusú rajz, amely pixeleket szór szét a szomszédos cellákon/karaktereken.                                                                                                                                  |
| Permetezés intenzitása                      | A szóróeszköz melletti legördülő menüvel állíthatja be a vonal sűrűségét.                                                                                                                                             |
| Rács váltása                                | A Rács jelölőnégyzet megjeleníti vagy elrejti a 16×16 karakteres rácsot.                                                                                                                                              |
| Karakterkészlet mentése: `.bin`             | Menti a 2048 bájtos karakteres bitképes adatokat.                                                                                                                                                                     |
| 16×16-os térkép + Színes RAM mentése `.bin` | 256 képernyőkódot, majd 256 színes RAM-értéket ment. Használja ezt a `MAP_COPY16X16` paranccsal.                                                                                                                      |
| Terhelés                                    | Betöltheti a charset-canvas mentéseket, az egyszerű charset adatokat és a kompatibilis Karakterszerkesztő charset adatokat, beleértve a karakterenként tárolt színeket is, ha vannak.                                 |

**Fontos C64 korlátozás:** többszínű karaktermódban a két megosztott szín globális a teljes képernyőn (`$D022` / `$D023`). Cellánként csak a karakter saját színe van megadva, és ez a 0–7 színekre korlátozódik, mivel a Color RAM 3. bitje a többszínű módot választja ki.

### Térképszerkesztő (többrétegű csempetérképek)

Réteges csempetérkép-szerkesztő statikus tájképekhez, sprite-alapú spawn-térképekhez, ütközési adatokhoz és hasonlókhoz. Megnyitás az Eszköztár → Térképszerkesztő menüpontban.

| Jellemző                                  | Leírás                                                                                                                                                                                                                                                                              |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Rétegek                                   | Több elnevezett réteg, mindegyik saját csempével és átlátszósággal.                                                                                                                                                                                                                 |
| Ecsetek                                   | Egyetlen csempés, kitöltés, vonal, téglalap és kör módok. Az alakzateszközök élő előnézetet jelenítenek meg húzás közben; a véglegesítéshez engedje el az egérgombot.                                                                                                               |
| Visszavonás / újraindítás                 | Teljes visszavonás/ismétlés művelet rétegenként. Ctrl/Cmd+Z / Ctrl/Cmd+Y vagy az eszköztár gombjai.                                                                                                                                                                                 |
| Menü törlése                              | Rétegenkénti vagy teljes térképi törlés megerősítéssel.                                                                                                                                                                                                                             |
| Képimportálás                             | Helyezzen el egy tilemap PNG-jét; a szerkesztő automatikusan csempékre szeleteli.                                                                                                                                                                                                   |
| Másolás / beillesztés                     | Másolja ki a kijelölt csempeterületet, majd illessze be normál módon, vagy használjon átlátszó pasztát az üres csempék átlátszóságának megőrzéséhez.                                                                                                                                |
| Többszínű csempe színezés                 | Kompatibilis karakterkészlet metaadatokkal a festés a csempe tárolt Color RAM alapértelmezett értékeit használja (beleértve a többszínűséggel kapcsolatos kódolást is) egy általános, egyszínű helyett.                                                                             |
| Egyéni karakterkészlet színek             | Amikor egy karakterkészlet `charColors` metaadatot hordoz, a Térképszerkesztő a kiválasztott csempe alapértelmezett Szín RAM értékét használja festés közben.                                                                                                                       |
| Blokk exportálása                         | RAWBYTES blokkokat bocsát ki a csempék grafikáihoz + térképadatokhoz.                                                                                                                                                                                                               |
| Képernyő RAM mentése (.bin)…              | Csak az aktuális térképréteg képernyőkódjait menti el (40×25 = 1000 bájt).                                                                                                                                                                                                          |
| Képernyő RAM + Színes RAM (.bin) mentése… | A színes RAM-értékekkel összefűzött képernyőkódokat egyetlen 2000 bájtos fájlba menti (`screen[0..999]`, majd `color[0..999]`). Használja ezt az **MAP_COPY** makróval (kombinált .bin mód) a képernyő és a színek egyetlen művelettel történő visszaállításához futásidejű módban. |

### SID-szerkesztő (3 hangos követő)

Többhangú, 3 hangú követő Web Audio előnézeti motorral. Megnyitás a Toolkit → SID Editor menüpontban.

**Eszközönkénti vezérlők:**
- Hullámforma jelölőnégyzetek (TRI / SAW / PUL / NOI) – több hullámforma VAGY művelettel összekapcsolható.
- Az ADSR (támadás / lecsengés / fenntartás / felszabadulás) húzásdiagramként látható a négy csúszka felett.
- Impulzusszélesség-csúszka (0-4095) opcionális csengetési/szinkronizációs jelzőkkel.
- Szűrőútvonal-jelölő jelölőnégyzet hangszínenként; globális szűrő levágás / rezonancia / hangerő / mód (LP/BP/HP).

**Követőrács:**
- 3 hang × maximum 7 minta × 32 sor = 7 × 32 = max. 224 sor (a 8 bites sorszámláló korlátozza).
- Soronként: hangjegy + hangszerindex. Az üres sorok az előző hangjegyet tartalmazzák.
- Jelöljön ki egy cellát a szokásos módon, vagy tartsa lenyomva a **Shift** billentyűt kattintás közben, illetve a nyílbillentyűkkel bővítse ki a téglalap alakú kijelölés sorokon és a három hang bármelyikén át. A kijelölt területen belül a jobb gombbal kattintva a tartomány érintetlen marad.
- A Másolás, Kivágás, Beillesztés és Törlés parancsok elérhetők az ikon eszköztáron és az ikon alapú helyi menüben. A `Ctrl/Cmd+C` és a `Ctrl/Cmd+V` billentyűkombinációk ugyanazon a téglalap alakú kijelölésen működnek.
- Harmónia segéd: válassz alaphangot, akkordtípust és oktávot, hallgasd meg az akkordot az aktuális hangszerrel, majd illeszd be a hangmintát közvetlenül a követőbe. Az elérhető típusok: dúr, moll, csökkentett, kiterjesztett, sus2, sus4, domináns 7, dúr 7, moll 7, 6, moll 6, 9, b9, #9, dim7 és 7sus4.
- Arpeggio segéd: a kiválasztott akkordból kiindulva 4, 8 vagy 16 lépéses hangjegyfutamok előzetes megtekintése vagy beszúrása fel, le vagy fel/le irányban.
- A **Sor meghallgatása** meghallgatja a kiválasztott sort mindhárom hangon a pattern lejátszásának elindítása nélkül.
- A cellatartomány-beillesztés mostantól a kiválasztott tartomány kezdőcellájánál kezdődik, és tisztán megáll a hang- és sorhatároknál, ahelyett, hogy a következő oszlopba vagy sorba folyatódna.
- A Sebesség csúszka beállítja az IRQ osztót (a sorok közötti képkockák számát).

**Lejátszás és virtuális billentyűzet:**
- A Lejátszás eszköztár gombja lejátszás közben Szünetre, szüneteltetés közben pedig Folytatásra vált; a Leállítás gomb leállítja a lejátszást és visszaállítja az eredeti állapotot.
- A billentyűzet eszköztár gombja egy nem modális zongorát nyit meg, amely használható marad, amíg az SID-szerkesztő aktív. Húzza a fejlécét, hogy a fő alkalmazás tetszőleges pontjára helyezze.
- Engedélyezd az **Beszúrás a követőbe** funkciót, hogy minden lejátszott hangot az aktuális követőkurzornál írj, és a következő sorra lépj. Kapcsold ki, ha szerkesztés nélkül szeretnél meghallgatni hangokat.
- Az akkord- és arpeggio-előnézetek megvilágítják a megfelelő zongorabillentyűket, amikor a billentyűzet nyitva van.

**Fájlok menü exportálása:**
| Export                               | Mit csinál                                                                                                                                                                                                          |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ` .bin mentése…`                     | A szerkesztő natív szerializált formátumát írja (hangszerek + minták + szekvencia).                                                                                                                                 |
| `Blokkok exportálása (csak adatok)`  | A `* = $C000` helyen hozzáfűzi a műszertáblázatot + minta blokkokat a programhoz.                                                                                                                                   |
| `Blokkok exportálása + minilejátszó` | Hozzáadja a teljes lejátszót (sid_init / sid_irq / sid_play_row / sid_set_voice) plusz PAL frekvenciatáblázatokat. Exportálás után illessz be egy `JSR sid_init` fájlt a fő kódodba, ahol a zenének kezdődnie kell. |
| ` ASM exportálása (vágólap)`         | A teljes assembly forráskódot a vágólapra másolja.                                                                                                                                                                  |

**Player ZP használat:** `$FB` (tick számláló), `$FC` (sorindex), `$FD` (hanghőmérséklet beállítása). Ezek ütköznek, ha a fő kódod használja őket — szükség esetén helyezd át Szakértő módban.

**Ismert korlátok:**
- Egyetlen lineáris minta lista (egyelőre nincs hangonkénti szekvencia táblázat).
- A 8 bites sorszámláló 7 mintára × 32 sorra korlátozódik.
- A C64 `$D418` globális hangerő több hangszerhang között megoszlik – a hangszerenkénti hangerőcsúszka tájékoztató jellegű; a kitartási szint (az ADSR `S` értéke) a hangszerhangonkénti effektív hangerő.
- A Web Audio előzetese hozzávetőleges: a PWM moduláció, a gyűrű/szinkron és a SID szűrő karaktere eltér a valódi chiptől.

---

### Görbeszerkesztő

Használatra kész `.byte` keresőtáblákat generál matematikai görbékből – szinusz, könnyítés, háromszög/fűrészfog/négyzet és pattogás. Ideális sprite mozgatáshoz, raszter effektekhez, színváltáshoz vagy bármilyen előre kiszámított táblázat által vezérelt animációhoz. Nyissa meg a felső eszköztáron (a SID Editor gomb mellett) található **Görbeszerkesztő** ikonnal.

**Görbék:** Szinusz, koszinusz, lineáris, Könnyű be/ki/be/ki (négyszög és harmadfokú), Könnyű be/ki (kör), Háromszög, Fűrészfog, Négyzet és Könnyű be/ki/be/ki pattogás.

**Vezérlők:**
| Ellenőrzés                   | Cél                                                                                                                                                                                                                                        |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Kezdő / Záró érték**       | Kimeneti tartomány. 0..255 8 bites módban, 0..320 16 bites módban.                                                                                                                                                                         |
| **Értékek száma**            | Táblázat hossza, 4–512 bejegyzés.                                                                                                                                                                                                          |
| **Ciklusok**                 | Hány rezgés legyen az asztalon (csak szinusz/koszinusz/háromszög/fűrészfog/négyzet). Törteket is elfogad (pl. `3,625`).                                                                                                                    |
| **Fázis**                    | Fáziseltolódás fokban (csak szinusz/koszinusz).                                                                                                                                                                                            |
| **Második görbe egyesítése** | Keverj össze egy második görbét a **Mix / Add / Multiply / Min / Max / Subtract** paraméterrel, a hozzá tartozó ciklusokkal/fázissal és egy keverési mennyiséggel. Mindkét forrásgörbe szaggatott segédvonalként jelenik meg a grafikonon. |
| **Címke**                    | Táblázatcímke (automatikusan javasolt a görbe neve alapján).                                                                                                                                                                               |
| **Számformátum**             | `$XX` hexadecimális vagy decimális.                                                                                                                                                                                                        |
| **Értékek soronként**        | 8 / 16 / 32 bájt `.bájt` soronként.                                                                                                                                                                                                        |

**Kimeneti módok:**
| Mód          | Kibocsát                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **8 bites**  | Egyetlen `.byte` tábla (értékek 0..255). Olvasható az `LDX #index / LDA table,X` paranccsal. Opcionálisan kibocsát egy **sprite-Y olvasó rutint** (`<címke>_set_y`) — `LDA <címke>,X` / `STA $D001+2N` — egy választható sprite számhoz 0-7 között.                                                                                                                                                                                        |
| **16 bites** | Két párhuzamos bájttábla — `<címke>_lo` (alsó 8 bit) és `<címke>_hi` (9. bit, 0/1) — a **same** X által indexelve (bejegyzésenként 2 bájt). Szükséges a sprite X teljes képernyős megjelenítéséhez (0..320 > egy bájt). Opcionálisan kibocsát egy **sprite-X olvasó rutint** (`<címke>_set_x`), amely az alsó bájtot a `$D000+2N` mappába írja, és beállítja/törli a sprite MSB-jét a `$D010` mappában, egy választható spriteszámhoz 0-7. |

Minden másolási/beszúrási kimenet egy fejlécommenttel kezdődik, amely dokumentálja a görbét, a tényleges min/max tartományt, a bejegyzések számát és a pontos felhasználást (amelyek regisztrálják az egyes táblázatok bemeneteit).

**Előnézet:**
- **Grafikon** — a görbe, amelynek értéke 0 a **felül** és a maximum az **alul**, a C64 sprite-Y / raszter konvenciónak megfelelően (tehát amit látsz, az a hardveren futó táblázat). A grafikon alatti meta vonal mutatja a bájtszámot, a generált értékek tényleges minimum/max értékét és a görbe(k) nevét.
- **Pattogó labda** — egy markert animál a táblázatban a **Tempo** tempóban (5–240 érték/másodperc). 50-es tempónál ez PAL-on (50 Hz) egy értéket jelent képkockánként, azaz indexenként egy `.wait_raster` lépést. Lejátszás/Szünet és Újraindítás gombok, az utolsó ~24 pozíció elhalványuló sávja, valamint élő `Index · Érték` kijelzés.

**Másolás / Beszúrás:** az eszköztár két ikonja — **Másolás** a vágólapra helyezi a táblázatot; **Beszúrás a szerkesztőbe** blokkként hozzáfűzi a táblázatot (és az olvasót, ha engedélyezve van) az aktuális programhoz. Az újbóli beszúrás ** lecseréli** az előző Görbeszerkesztő beszúrást a duplikátumok egymásra halmozása helyett (Blokk és Szakértő módban működik).

**Fájlok menü:**
| Akció                          | Mit csinál                                                                                                                                                                                                                                                                                                                                                                |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Görbe mentése (.bin)…**      | A nyers tábla bájtjait pontosan úgy menti el, ahogyan a C64 olvasná azokat az `INCBIN` paraméterrel. 16 bites: N lo bájt, majd N hi bájt.                                                                                                                                                                                                                                 |
| **Terhelési görbe (.bin)…**    | Betölti a nyers tábla bájtjait a szerkesztőbe, az aktuális bitmélységnek megfelelően értelmezve (16 bit: első fele lo, második fele hi). A betöltött tábla jelenlegi állapotában jelenik meg, amíg valamelyik görbevezérlő új görbét nem generál.                                                                                                                         |
| **Demó exportálása blokkokba** | Hozzáfűz egy teljes, futtatható sprite demót: sprite init, raszterrel szinkronizált fő ciklus, a beágyazott táblázat és golyós sprite adatok. Az X 0..320-at söpör be a 8.8-as fixpontban az `$D010` MSB-vel, miközben a táblázat az Y sprite-ot hajtja – pontosan megegyezik a szerkesztő előnézetével. Az újraexportálás lecseréli a korábbi görbeszerkesztő beszúrást. |

**A C64 előnézetének megfelelően:** az előnézet lineárisan olvassa a táblázatot **, 0 → N-1 → 0 ciklusokban, képkockánként egy értékkel**. A pontos reprodukáláshoz ugyanúgy kell futtatni a táblázatot (az indexet képkockánként egyszer növelni, a táblázat hosszánál sortöréssel). Egy pingpong vagy részleges tartományú lejátszás másképp fog mozogni, még akkor is, ha a bájtértékek azonosak. Lásd a `samples/curve-new-demo.asm` fájlt egy működő 16 bites sprite-X példáért.

---


*© 2026 Tarczali Zsolt — C64 Visual Assembler*
