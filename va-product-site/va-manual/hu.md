# C64 Visual Assembler — Felhasználói kézikönyv

**2.6.7-es verzió**

Vizuális, blokk alapú 6502 assembler a Commodore 64-hez. Programokat hozhat
létre húzással és elengedéssel (fogd és vidd) utasításblokkokkal, és valós
időben tekintheti meg a létrehozott assembly és gépi kódot.

---

## Tartalomjegyzék

- [2.6.7-es verzió – kiemelt funkciók](#version-267-highlights)
- [2.6.6-os verzió – kiemelt funkciók](#version-266-highlights)
- [2.6.5-ös verzió – kiemelt funkciók](#version-265-highlights)
- [2.6.4-es verzió – kiemelt funkciók](#version-264-highlights)
- [2.6.3-as verzió kiemelt funkciói](#version-263-highlights)
- [2.6.2-es verzió – kiemelt funkciók](#version-262-highlights)
- [2.6.1-es verzió – kiemelt funkciók](#version-261-highlights)
- [2.6.0 verzió – kiemelt funkciók](#version-260-highlights)
- [2.5.9-es verzió – kiemelt funkciók](#version-259-highlights)
- [2.5.8-as verzió kiemelt funkciói](#version-258-highlights)
- [2.5.7-es verzió – kiemelt funkciók](#version-257-highlights)
- [2.5.6-os verzió kiemelt funkciói](#version-256-highlights)
- [2.5.5-ös verzió – kiemelt funkciók](#version-255-highlights)
- [2.5.4-es verzió – kiemelt funkciók](#version-254-highlights)
- [2.5.3-as verzió kiemelt funkciói](#version-253-highlights)
- [2.5.2-es verzió – kiemelt funkciók](#version-252-highlights)
- [2.5.1-es verzió – kiemelt funkciók](#version-251-highlights)
- [2.5.0 verzió – kiemelt funkciók](#version-250-highlights)
- [2.4.9-es verzió – kiemelt funkciók](#version-249-highlights)
- [2.4.8-as verzió kiemelt funkciói](#version-248-highlights)
- [2.4.7-es verzió – kiemelt funkciók](#version-247-highlights)
- [2.4.6-os verzió kiemelt funkciói](#version-246-highlights)
- [2.4.5-ös verzió – kiemelt funkciók](#version-245-highlights)
- [2.4.3-as verzió kiemelt funkciói](#version-243-highlights)
- [2.4.2-es verzió – kiemelt funkciók](#version-242-highlights)
- [2.4.1-es verzió – kiemelt funkciók](#version-241-highlights)
- [2.4.0 verzió – kiemelt funkciók](#version-240-highlights)
- [2.3.9-es verzió – kiemelt funkciók](#version-239-highlights)
- [1. Felület áttekintése](#1-interface-overview)
- [2. Blokk paletta](#2-block-palette)
  - [Paraméterek az operandus mezőben](#parameters-in-the-operand-field)
- [3. Programterület](#3-program-area)
  - [Blokk panel minitérkép](#block-panel-minimap)
  - [Operandus bemenet](#operand-input)
- [4. ASM nézet](#4-asm-view)
  - [Kimeneti módok](#output-modes)
  - [Eszközkészlet fül](#toolkit-tab)
  - [Fordítási információk és kimeneti
    beállítások](#compile-info-and-output-settings)
  - [ASM sorra kattintás](#clicking-an-asm-line)
  - [ASM sorszámok](#asm-line-numbers)
  - [Fordítási folyamatjelző modális ablak](#compile-progress-modal)
- [5. Beállítások és eszköztár](#5-settings--toolbar)
  - [Verziókövetés](#version-control)
    - [Projekt mód](#project-mode)
    - [Git](#git)
  - [Alkalmazáson belüli frissítések](#in-app-updates)
  - [Ingyenes és nyílt forráskódú](#free-and-open-source)
  - [Hiba jelentése](#reporting-a-bug)
  - [Támogatás](#support)
  - [Munkaterületek](#workspaces)
  - [Memóriaablak és nulla oldalhasználat](#memory-window-and-zero-page-usage)
  - [Projektsablonok](#project-templates)
  - [Oktatóanyagok és a leckeszerkesztő](#tutorials-and-the-lesson-editor)
    - [Online leckék](#online-lessons)
  - [Projekt építése](#build-project)
  - [Példaprogramok](#example-programs)
  - [.asm fájl betöltése (gyors útmutató)](#load-asm-file-quick-reference)
    - [Import elemzési megjegyzések és ajánlott
      eljárások](#import-parsing-notes-and-best-practices)
  - [Kick importálás (Kick Assembler)](#kick-import-kick-assembler)
    - [Kick projektek (Kick projekt
      importálása…)](#kick-projects-import-kick-project)
- [UltimateBasic mód](#ultimatebasic-mode)
  - [Az UB szerkesztő megnyitása](#opening-the-ub-editor)
  - [Szerkesztőeszközök](#editor-tools)
  - [Projektek, lapok és indítófájlok](#projects-tabs-and-startup-files)
  - [Épületépítés és diagnosztika](#building-and-diagnostics)
  - [Kódméret soronként és tippek](#code-size-per-line-and-hints)
  - [Futás, D64 és Exomizer](#running-d64-and-exomizer)
  - [Hibakereső szimbólumok és szétszerelés](#debugger-symbols-and-disassembly)
  - [Ultimate Basic kézikönyv és forrás](#ultimate-basic-manual-and-source)
- [6. Szakértői mód](#6-expert-mode)
  - [Módok váltása](#switching-modes)
  - [Szerkesztői elrendezés](#editor-layout)
  - [Eszköztár gombjai](#toolbar-buttons)
  - [Szakértő szerkesztő minitérkép](#expert-editor-minimap)
  - [Ciklusszám](#cycle-counts)
  - [Optimalizálási tippek](#optimisation-hints)
  - [Kiemelési hiba](#error-highlighting)
  - [Szintaxis kiemelés](#syntax-highlight)
  - [Forrásformázó](#source-formatter)
  - [Projekt panel és fülek](#project-panel--tabs)
  - [Tabulátorsáv](#tab-bar)
  - [ACME mód](#acme-mode)
- [7. Címzési módok](#7-addressing-modes)
  - [Kifejezések operandusként való címkézése](#label-expressions-as-operands)
  - [Az `*` programszámláló
    kifejezésekben](#the--program-counter-in-expressions)
  - [Helyi (pontozott) címkék](#local-dotted-labels)
  - [Önmódosító kód operandus címkéi](#self-modifying-code-operand-labels)
- [8. 6502-es szabvány szerinti utasítások](#8-standard-6502-instructions)
  - [Adatmozgatás](#data-movement)
  - [Számtan](#arithmetic)
  - [Logika](#logic)
  - [Ugrások és elágazások](#jumps--branches)
    - [LBNE / LBEQ / … (Hosszú ágak)](#lbne--lbeq---long-branches)
  - [Regiszterműveletek](#register-operations)
  - [Eltolás és forgatás](#shift--rotate)
  - [Verem](#stack)
  - [Rendszer / Jelzők](#system--flags)
  - [Törvénytelen / Nem dokumentált
    utasítások](#illegal--undocumented-instructions)
- [9. Makróblokkok — Referencia](#9-macro-blocks--reference)
  - [CÍMKE](#label)
  - [MEGJEGYZÉS](#comment)
  - [BÁJT](#byte)
  - [SZÓ](#word)
  - [KITÖLTÉS](#fill)
  - [IGAZÍTÁS](#align)
  - [SZÖVEG](#text)
  - [SZÖVEG](#string)
  - [ADATOK](#data)
  - [NYERS BÁJTOK](#rawbytes)
  - [NYERS SZÖVEG](#rawtext)
  - [PETSCII](#petscii)
  - [KARAKTERHEZÉS](#charset)
  - [CHARDEF](#chardef)
  - [BOX_HIT](#box_hit)
  - [INCBIN](#incbin)
  - [KOALA](#koala)
  - [SZINT / SZINT_SOR](#level--level_row)
    - [SZINT](#level)
    - [SZINT_SOR](#level_row)
  - [SID](#sid)
  - [SID_PLAYER](#sid_player)
  - [BELEÉRTVE](#include)
  - [TÁBLÁZAT](#table)
  - [SZERV](#org)
  - [HIRDETÉS / KÖVETKEZŐ](#loop--next)
    - [HURKOLAT](#loop)
    - [KÖVETKEZŐ](#next)
  - [FOR / ENDF](#for--endf)
    - [FOR](#for)
    - [VÉGE](#endf)
  - [TOLÁS / HÚZÁS](#push--pull)
    - [NYOMJA](#push)
    - [HÚZÁS](#pull)
  - [VÉGE / RTS álnév](#end--rts-alias)
  - [MAKRO / VÉGE / MEGHÍVÁS](#macro--endm--invoke)
    - [MAKRO (definíció kezdete)](#macro-definition-start)
    - [ENDM (definíció vége)](#endm-definition-end)
    - [MEGHÍVÁS](#invoke)
  - [RÉGIÓ / RÉGIÓ VÉGRÉGIÓ](#region--endregion)
  - [DEFINE / HA / KÜLÖNBEN / ENDIF](#define--if--else--endif)
    - [MEGHATÁROZÁS](#define)
    - [HA](#if)
    - [KÜLÖNBEN](#else)
    - [ENDIF](#endif)
  - [.ÉRTÉKELÉS](#assert)
  - [ÁLLANDÓ](#const)
  - [VAR](#var)
  - [Futásidejű HA / KÜLÖNBEN / ENDIF](#runtime-if--else--endif)
  - [Míg / Vége](#while--endw)
  - [ISMÉTLÉS / AMÍG](#repeat--until)
  - [MEMCPY / MEMSET](#memcpy--memset)
  - [NYOMTATÁS / PRINT_CHAR / PRINT_HEX / CLEAR_SCREEN / WAIT_KEY / DELAY /
    SET_BORDER /
    SET_BG](#print--print_char--print_hex--clear_screen--wait_key--delay--set_border--set_bg)
    - [NYOMTATÁS](#print)
    - [NYOMTATOTT_KARAKTER](#print_char)
    - [PRINT_HEX](#print_hex)
    - [KÉPERNYŐ_TÖRLÉSE](#clear_screen)
    - [VÁRAKOZÁSI_KULCS](#wait_key)
    - [KÉSLELTETÉS](#delay)
    - [SZEGÉLY BEÁLLÍTÁSA / HÁZ BEÁLLÍTÁSA](#set_border--set_bg)
  - [IRQ_BEÁLLÍTÁS](#irq_setup)
  - [RAND](#rand)
  - [SPRITE_INIT](#sprite_init)
  - [SPRITE_POS](#sprite_pos)
  - [VÁRAKOZÁSI_RASZTER](#wait_raster)
  - [JOYSTICK](#joystick)
  - [EGÉR](#mouse)
  - [SPRITE_COL](#sprite_col)
  - [FÁJL BETÖLTÉSE](#loadfile)
  - [EXODECRUNCH](#exodecrunch)
  - [REU_CHECK](#reu_check)
  - [REU_STASH / REU_FETCH / REU_SWAP](#reu_stash--reu_fetch--reu_swap)
  - [TURBÓ_BEÁLLÍTÁS](#turbo_set)
  - [SZUPERCPU_ÉRZÉKELÉS](#supercpu_detect)
  - [TURBÓ_ENGEDÉLYEZÉS](#turbo_enable)
  - [MÉRKÉP_MÁSOLAT](#map_copy)
  - [MÉRKÉP_MÁSOLAT16X16](#map_copy16x16)
  - [SPRITE_ANIM](#sprite_anim)
  - [PONTSZÁM_BCD](#score_bcd)
- [10. Hibakereső integráció](#10-debugger-integration)
  - [RetroDebugger](#retrodebugger)
  - [Töréspont blokkok](#breakpoint-blocks)
  - [Hibakereső jelzések](#debugger-flags)
  - [VICE Monitor (gyors újratöltés, élő megfigyelés,
    profilkészítő)](#vice-monitor-hot-reload-live-watch-profiler)
- [11. Tudásbázis linkek](#11-knowledge-base-links)
- [12. D64 Exportálás és futtatás](#12-d64-export--run)
  - [Felosztás gomb](#split-run-button)
  - [Exportálás D64-be párbeszédpanel](#export-to-d64-dialog)
  - [D64 metaadatok a projektekben](#d64-metadata-in-projects)
  - [D64 szerkesztő (meglévő lemezkép böngészése és
    szerkesztése)](#d64-editor-browse--edit-an-existing-disk-image)
- [12b. CRT Export (Magic Desk 64K
  kazetta)](#12b-crt-export-magic-desk-64k-cartridge)
  - [A kosár tartalma](#what-ships-in-the-cart)
  - [Cím és belépési pont betöltése](#load-address-and-entry-point)
  - [Méretkorlát](#size-limit)
  - [Kompatibilitás](#compatibility)
- [13. Beállítások](#13-settings)
  - [VMA fordító](#vma-compiler)
  - [VICE emulátor](#vice-emulator)
  - [Exomizer](#exomizer)
  - [Retro hibakereső](#retro-debugger)
  - [C64 Végső / 1541 Végső](#c64-ultimate--1541-ultimate)
  - [Kung Fu Villám 2](#kung-fu-flash-2)
  - [Verziókövetés (git)](#version-control-git)
- [14. Vizuális szerkesztők (Eszköztár)](#14-visual-editors-toolkit)
  - [Nagy felbontású / Többszínű szerkesztő](#hi-res--multicolor-editor)
  - [Sprite szerkesztő](#sprite-editor)
  - [C64 Karakter ROM böngésző
    ("Karaktertérkép")](#c64-character-rom-browser-char-map)
  - [Karakterszerkesztő (Karakterkészlet)](#character-editor-charset)
  - [Karakterkészlet-vászonszerkesztő](#charset-canvas-editor)
  - [Térképszerkesztő (Többrétegű
    csempetérképek)](#map-editor-multilayer-tilemaps)
  - [Pályaszerkesztő](#level-editor)
  - [SID-szerkesztő (3 hangos követő)](#sid-editor-3-voice-tracker)
  - [SID-lejátszó](#sid-player)
    - [HVSC (Nagyfeszültségű SID-gyűjtemény)](#hvsc-high-voltage-sid-collection)
    - [Spektrumanalizátor](#spectrum-analyzer)
  - [Görbeszerkesztő](#curve-editor)
  - [Táblázatgenerátor](#table-generator)
  - [Számátváltó](#number-converter)

---

## A 2.6.7-es verzió legfontosabb elemei

- **Rust VMA fordító** — **Beállítások → Általános → Program → VMA fordító**
  kiválasztja a motort: **JavaScript** (alapértelmezett), **Rust** vagy **Rust +
  JavaScript ellenőrzés**, amely mindkettővel fordul, és naplózza az esetleges
  eltéréseket. A Rust fordító ugyanazokat a bájtokat, memória nézetet,
  szegmenseket és lefordított hibaüzeneteket adja; A Kick projektek is rajta
  keresztül épülnek fel, hibákkal a `file:line` helyen. Lásd: [VMA
  fordító](#vma-compiler).
- A **VMA nyílt forráskódú** – a Visual Macro Assembler fordítója a saját GPLv3
  repositoryjában található, a
  [github.com/zstarczali/VMA](https://github.com/zstarczali/VMA)-ben (2.0.0
  verzió), egy angol és egy magyar nyelvű kézikönyvvel, valamint egy parancssori
  fordítóval. A Névjegy mezőben látható a VMA verziója és az Ultimate Basic
  melletti szalagcím.
- **Projekt szimbólumok és konstansok** — **Projektbeállítások** beállítja a VMA
  szimbólumokat (`.define`, a `.if` / `.ifdef` fájlokhoz) és konstansokat
  (`.const`) a teljes projektre vonatkozóan, melyek a `.proj` fájlba kerülnek
  mentésre; a hibasorok helyesek maradnak. Lásd: [Projekt panel és
  fülek](#project-panel--tabs).
- **Fordítási párbeszédablak** — a folyamatjelző alatti lépéssor megnevezi a
  motort, a fájlt és a PRG méretét.
- **Build információk** — megjeleníti a leírt fájlt; egy ACME forrás a valódi
  ACME buildből kapja meg a saját nézetét (eredet, vég, méret, szegmensek,
  címkék). Már nem záródik be külső kattintásra.
- **Gyorsabb gépelés** — ACME módban a Szétszerelés és a Monitor panelek
  buildenként egyszer újraépülnek, és halványan jelennek meg, amíg a forrás
  újabb; a nagy Kick projektek újra felhasználják az utolsó előfeldolgozásukat,
  és a szétszerelést darabokban renderelik.
- **Projektfa** — **Felfelé** / **Lefelé** a fájlok és mappák jobb gombbal
  előhívható menüjében. A Kick kompatibilitás a **Projektbeállítások**
  menüpontban kapcsolható be.
- **Javítások** — egy `.asm` mentése (Ctrl+S, Menü → Mentés, egy git commit
  előtt) ismét sima szöveget ír, nem pedig VA JSON-t; a verziókövető
  pillanatképek szövegként tartják meg a forrásfájlokat; a felhasználói makrókon
  belüli könyvtármakrók (SET_BORDER, SPRITE_*, JOYSTICK, TEXT …) megkapják a
  paramétereiket, a futásidejű IF / WHILE / REPEAT címkék hívásonként egyediek,
  és az `'A'` argumentum karakter marad; a húzható párbeszédablakok a mentési
  helyükön nyílnak meg.
- **Nézd** — a fordítási, fordítási információk, D64 export, fordítási hibák és
  kérdések párbeszédablakoknál megjelenik a Névjegy mező keret.

---

## A 2.6.6-os verzió legfontosabb elemei

- **SID lejátszó makró** — `.sid_player [subtune][, raster]` (**SID_PLAYER** a
  palettán) lejátssza az `.sid` makró dallamát: meghívja az init rutint a
  részhanggal, kikapcsolja a CIA1 időzítő IRQ-ját, rákapcsol egy raszter IRQ-t,
  és minden képkockán meghívja a lejátszás rutint a beépített kezelőjéből. Egy
  zenét tartalmazó program most `.sid "music.sid"` + `.sid_player`. Lásd:
  [SID_PLAYER]{1].
- **SID címkék** — az `.sid` makró definiálja az `SID_LOAD`, `SID_INIT` és
  `SID_PLAY` értékeket, melyeket egyéni betöltési címmel együtt mozgattunk, így
  a saját IRQ kezelőd írhat `JSR SID_PLAY` címre. Lásd: [SID](#sid).
- **Csak szakértői módban** — **Projektbeállítások** tartalmaz egy kapcsolót,
  amely bezárja a blokk módot a projekt fájljainál, méretüktől függetlenül (a
  `.proj` fájlba mentve). Lásd: [Projekt panel és fülek](#project-panel--tabs).
- **SID Player puffer** — **Beállítások → Általános → SID előnézet → SID Player
  puffer** 2048–16384 mintát állít be; egy nagyobb puffer megállítja a
  sercegést, amíg az alkalmazás foglalt. A WebSID újraindítás után használja, a
  VA SID Core 10 / 15 / 20 / 30 másodperccel előre renderel. Lásd: [SID
  Player](#sid-player).
- **Egyéni C64 paletta** — **Beállítások → Általános → Szerkesztők → Egyéni
  paletta szerkesztése…** beállítja a saját RGB-értéket mind a 16 színhez,
  bármelyik beépített palettáról kiindulva; importáljon egy Photoshop `.act`,
  VICE `.vpl`, GIMP `.gpl` palettát vagy egy hexadecimális színek listáját,
  exportálja az `.act` / `.vpl` fájlt. Lásd: [14. Vizuális szerkesztők
  (Toolkit)](#14-visual-editors-toolkit).
- **Nézd** — a C64 memóriapanel összecsukva visszaáll a dokkolásra; az
  Újdonságok, frissítés, beállítások és tudásbázis ablakok kerete megegyezik a
  Névjegy mezőével; a Projektbeállítások jelölőnégyzetek VA kapcsolók.
- **Javítások** — a hibajelentés PNG és JPG képernyőképeket fogad el a
  kiadásban; a kezdőképernyőn a `READY.` után villogó kurzor egy tömör C64
  cella, a macOS által rajzolt vonalak nélkül; a macOS beágyazott prediktív
  szövege ki van kapcsolva az Expert és az Ultimate Basic szerkesztőkben.

---

## A 2.6.5-ös verzió legfontosabb elemei

- **KickAssembler projektek** — **Menü → Program → Kick projekt importálása…**
  vesz egy teljes KickAssembler forrásfát (a fő fájlt a `#import` moduljaival és
  az `.import bináris` elemeivel), és mellé ír egy `.proj` fájlt; a források ott
  maradnak, ahol vannak. A Visual Assembler a saját assemblerjével építi fel,
  bájtról bájtra, mint a KickAssembler 5.25 — Futtatás, PRG / D64 / CRT építése,
  Exomizer, Hibakeresés, a VICE Monitor és a Build projekt mind működik, a hibák
  a `file:line` nevet adják, és a teljes fa ellenőrzésre kerül gépelés közben. A
  Dark Chambers C64 port és mind a tizenegy KickAssembler példaprogram kóddal
  azonosan épül fel. Lásd: [Kick projektek (Kick projekt
  importálása…)](#kick-projects-import-kick-project).
- **Projektbeállítások** — a Projekt panelen található fogaskerék gomb (vagy a
  **Menü → Fájl → Projektbeállítások…**) megjeleníti és szerkeszti a projekt
  nevét, indítófájlját, assemblerjét, KickAssembler kompatibilitását, `#define`
  szimbólumait és `cmdLineVars` elemeit. Lásd: [Projekt panel és
  fülek](#project-panel--tabs).
- **Kick-kompatibilis kapcsoló** — egy kapcsoló (a 2.6.7-es verzió óta a
  **Projektbeállításokban**) bármely VMA projektet KickAssembler-kompatibilissé
  tesz; a VA makrók és direktívák továbbra is működnek a KickAssembler szkript
  mellett.
- **KickAssembler nyelv** — `#import` / `#importonce` / `#importif`, `#define` /
  `#if`, `.const` / `.label` (nulla oldal vagy abszolút érték), `.for`,
  `.while`, `.if … else`, `.var` / `.eval`, `.function`, `.macro { } }`,
  `.pseudocommand`, többcímkék, hatókörök és névterek, `.pseudopc`, `.import
  binary`, `LoadBinary` (sablonokkal, mint például `BF_KOALA`), `LoadSid`,
  `virtual` memóriablokkok, `cmdLineVars`, `BasicUpstart2`, `List` / `Hashtable`
  / `.struct` / karakterláncok, `.enum`, a matematikai függvénykönyvtár, a szín-
  és opkód-konstansok, `*` programszámlálóként, `;` az utasítások között,
  `.error` / `.errorif`.
- **Építési információk oszlopokban** — szélesebb ablak: felül az eredet, a vég,
  a méret és a szegmensek száma, majd a szegmensek, a hibák és az `.print`
  kimenet, valamint a címkék, konstansok és makrók oszlopokban. Egy Kick
  projektben a felépített fát, a belső címkéket `scope.label` formátumban
  mutatja.
- **C64 színpaletta** — **Beállítások → Általános → Szerkesztők → C64
  színpaletta** beállítja a 16 C64 szín RGB-értékeit minden szerkesztőben
  (sprite, karakter, Charset Canvas, Hi-Res, map, level, Toolkit swatches):
  **Colodore** alapértelmezés szerint (a valódi C64-hez legközelebb eső), vagy
  Pepto, VICE, Deekay, C64 Wiki / Godot. Csak a megjelenítés változik; a Hi-Res
  képimportálás is ezt használja. Lásd: [14. Vizuális szerkesztők
  (Toolkit)](#14-visual-editors-toolkit).
- **Színválasztó** – a Nagy felbontású, Sprite, Karakter (többszínű) és Charset
  Canvas szerkesztők rendelkeznek egy választó eszközzel; az **Alt+kattintás**
  lenyomásával bármelyik eszközzel kiválaszthatja a színt. Lásd: [Nagy
  felbontású / Többszínű szerkesztő](#hi-res--multicolor-editor).
- **Ctrl + görgős zoom** a Nagy felbontású, Sprite, Térkép és Pálya
  szerkesztőkben, a kurzor körül. A Nagy felbontású raszter kapcsoló a Rács
  mellett található.
- **ACME mód** – a memóriatérkép és az átfedési figyelmeztetés az ACME
  felépítését követi; egy ACME projekt felépíti az indítófájlját; az ACME
  sablonok csak akkor jelennek meg, ha egy működő ACME van beállítva, és egy
  ACME projekt létrehozásakor a beállítások ACME módba kapcsolnak. Lásd: [ACME
  mód](#acme-mode).
- **Új projekt** — **Új projekt sablonból…** a menü **Új projekt** menüpontja
  alatt található (a három különálló bejegyzés eltűnt); a Visual Assembler
  sprite multiplexer sablon kinyomtatja a címét.
- **Javítások** — A címkekifejezésekkel (`<(label+1)`, `.word label` a címke
  előtt) rendelkező `.byte` / `.word` már nem állítja az assembler értéket 0-ra;
  az illegális `NOP` operandust olvasó assembler űrlapok (lásd [Érvénytelen /
  Nem dokumentált utasítások](#illegal--undocumented-instructions)); az Ultimate
  Basic megnyitó gombja minden nyelven a **Load .ub file** feliratot mutatja.

---

## A 2.6.4-es verzió legfontosabb elemei

- **ACME assembler mód** — **Beállítások → Általános → Assembler mód** vált a
  *VMA mód* (a beépített Visual Assembler assembler) és az *ACME mód* között: az
  Expert forráskódot az ACME 0.97 építi, és a Futtatás, Build, a Szétszerelés /
  Monitor panelek, a hibakereső szimbólumok, a ciklusszámlálók, az
  optimalizálási tippek és a VICE Monitor mind a valódi ACME kimenetet
  használják. Lásd: [ACME mód](#acme-mode).
- **Better Kick Assembler import** — a Program menüpont mostantól **Kick
  import**. Az `.encoding` után sima `.text "…"` sorok következnek, az `.label
  NAME = * + N` címkét helyez el egy utasításon belül, és az `.abs` / `.zp`
  emlékeztető utótagok kényszerítik ki a címzési módot. A Restore64
  disassemblereket bájtról bájtra építi fel, mint a KickAssembler. Lásd: [Kick
  import (Kick Assembler)](#kick-import-kick-assembler).
- A(z) **Run parancs a BASIC sor alatti programokat indítja el** — a BASIC SYS
  sor alatt vagy azon túl betöltődő programok kis indítóbetöltőt kapnak; a
  forráskód későbbi részében található alacsonyabb ORG már nem kerül feljebb a
  kezdőcímre. Lásd a(z) **BASIC SYS csonkot** sort a [Beállítások és
  eszköztár](#5-settings--toolbar) menüpontban.
- **Exomizer** — egy összerakott program már nem adja a `?SZINTAXIS ERROR` hibát
  a második FUTTATÁSKOR: egy BASIC sorral rendelkező PRG `sfx basic` sorral van
  becsomagolva, bármely más `sfx $<betöltési cím>` sorral.
- **SID szerkesztő** — lejátszási LCD a követő eszköztáron (dal pozíciója,
  pattern, sor, idő; zöld vagy piros a **Beállítások → Általános → SID előnézet
  → LCD színe** menüpontban), egy hangszergomb LCD-vel a VA-VK-n, egy
  folyamatjelző sáv az **.sid importálás…** folyamathoz. Lásd: [SID
  szerkesztő](#sid-editor-3-voice-tracker).
- **Beállítások három lapon** — **Általános**, **Fájlok és elérési utak** és
  **Integrációk**. Lásd: [13. szakasz](#13-settings).
- **Kisebb fejlesztések** — A **Ctrl+N** új lapot nyit; a párbeszédablak szövege
  már nem jelölhető ki véletlenül (a szövegmezők és a másolható kimenet, például
  a fordítási hibák továbbra is lehetségesek); a nagyméretű Expert forráskódok
  gyorsabban szerkeszthetők; az `LSR A` és az `JMP ($nnnn)` helyesen
  importálhatók; a Tudásbázis hivatkozik a Restore64-re (restore64.dev), amely
  egy C64 PRG-t KickAssembler / ACME forrássá alakít **Kick import** vagy ACME
  módhoz. Az olyan ACME forráskód, amelynek szegmense a `$0801` alatt van
  (memóriakiírás), már nem kerül a BASIC SYS sor mögé eltolásra: a saját címein
  épül fel, és a start betöltőt kapja.

---

## A 2.6.3-as verzió legfontosabb elemei

- **.sid importálás az SID szerkesztőben** — **Fájlok → .sid importálása…**
  bármely PSID / RSID dallamot hangszerré, pattern-né és szerkeszthető dallá
  alakít: hangjegyek és legato hangjegyek, pontosan a hangjegyekre helyezett
  sorok (funktempo és swing a `F` sebességváltozásokon keresztül), wave /
  arpeggio táblázatok fix hangmagasságú dobtámadásokkal, pulzus- és
  szűrőmozgással, kapuidőzítéssel és vibratoval. Lásd: [SID
  szerkesztő](#sid-editor-3-voice-tracker).
- **A hosszú dallamok helyesen játszódnak le** — amikor a dallamadat nem fér el
  a lejátszó mellett a `$C000` pozícióban, akkor a `$A000` alatti saját
  szegmensbe ugrik ahelyett, hogy I/O-ba futna; a `.sid` export következik.
- **A VA SID Core előnézete újraindítja a hangokat** — egy visszatartott kapu
  alatt újraindított hang új támadást kap, mint az igazi játékosnál.
- **SID szerkesztő** — a fejléc az aktív SID emulációt mutatja (WebSID vagy VA
  SID Core a chip modellel); a Sebesség mező − / + gombokkal rendelkezik, és
  1–255 értéket vehet fel; a dal akár 256 mintát is használhat.
- **Frissítési szerver beállításai** — **Beállítások → Általános → Frissítések**
  beállítja azt a szervert, amelyről az alkalmazáson belüli frissítések
  beolvassák a kiadásokat (alapértelmezett: `https://www.c64va.pro/`). Lásd:
  [Alkalmazáson belüli frissítések](#in-app-updates).
- **Ultimate Basic 1.6.6** — `NYOMTATÁS "formátum" használatával; értékek`,
  karakterlánc-összehasonlítás PETSCII sorrendben, lebegőpontos `rnd` és `mod`,
  lebegőpontos az IRQ / NMI kezelőkben, `opció basic print` a C64 BASIC PRINT
  térközhöz, kisebb programok (csak a lebegőpontos rutinok használatban vannak)
  és 16 bites címkifejezések (1.6.5). Az Ultimate Basic szerkesztő kiemeli a
  `print` és az `opció basic print` opciókat.

---

## A 2.6.2-es verzió legfontosabb elemei

- **HVSC az SID lejátszóban** – kereshet a High Voltage SID gyűjteményben (kb.
  61 000 dallam) cím, zeneszerző vagy mappa alapján, lejátszhat, hozzáadhat a
  lejátszási listához vagy menthet bármely dallamot; letöltheti a teljes
  gyűjteményt egy menetben offline használatra, vagy a lejátszóval megnyithat
  egy kicsomagolt HVSC mappát. A HVSC dallamai a keresősávon jelennek meg, és a
  lejátszási lista továbblép, amikor egy aldallam véget ér. Lásd: [HVSC (High
  Voltage SID gyűjtemény)](#hvsc-high-voltage-sid-collection).
- **Spektrumanalizátor** — egy lebegő LED-sávos megjelenítő az SID lejátszóhoz
  8-32 sávval, elhalványuló cellákkal és tükrözött padlóval. Lásd:
  [Spektrumanalizátor](#spectrum-analyzer).
- **Leckeszerkesztő** — alakítsd át saját programodat lépésről lépésre vezetett
  leckévé, hasonlóan a beépített "Build: Az első szöveges programod" funkcióhoz:
  adj hozzá magyarázatokat, válaszd ki a mappát, próbáld ki, mentsd el,
  exportáld/importáld az `.vatut` fájlokat. Lásd: [Oktatóanyagok és a
  leckeszerkesztő]{1].
- **Online leckék** — töltsd le a www.c64va.pro oldalon közzétett leckéket
  közvetlenül a Tutoriálok listájába a frissítésekkel együtt, és töltsd fel a
  sajátjaidat a Leckeszerkesztőből áttekintésre. Lásd: [Online
  leckék](#online-lessons).
- **Minden makró az operandusmezőben veszi fel a paramétereit** — `SET_BG $06`,
  `REGION Main`, `ORG $C000`, `SPRITE_POS 1, 200, 50` …: a szöveg a makró Expert
  soraként olvasható, a mező pedig a várt formát mutatja. Lásd: [Paraméterek az
  operandusmezőben](#parameters-in-the-operand-field).
- **Kisebb fejlesztések** — az aktív lebegő ablak kiemelve jelenik meg, a
  Támogatás ablak úgy néz ki, mint egy csevegés, az egérgörgő oldalra görgeti a
  fülsávot, és az Ultimate Basic kódméret oszlopa már nem takarja el a
  sorszámokat.

---

## A 2.6.1-es verzió legfontosabb elemei

- **Ciklusszámlálók Szakértő módban** — egy ereszcsatorna mutatja az egyes
  utasítások ciklusait, a kijelölések teljes számát és a szükséges
  rasztervonalak számát. Lásd: [Ciklusszámlálók](#cycle-counts).
- **Optimalizálási tippek** — a Szakértői szerkesztő megjelöli a rövidebb vagy
  gyorsabb sorokat (farokhívás, redundáns `CMP #0`, újratöltések, `INC` / `DEC`
  idiómák…). Lásd: [Optimalizálási tippek](#optimisation-hints).
- **Táblázatgenerátor** — képernyő/bittérkép sorcímek, pixelmaszkok,
  szorzó/osztás táblázatok, negyednégyzetek, log/exp, bitfordítás, egyéni
  kifejezések és kibontás nélküli kitöltés/másolás sebességkód. Lásd:
  [Táblázatgenerátor](#table-generator).
- **VICE Monitor** – gyors újratöltés a futó VICE-ba, címkék és címek élő
  figyelése, valamint PC-s mintavételezésű profilkészítő. Lásd: [VICE
  Monitor](#vice-monitor-hot-reload-live-watch-profiler).
- **Nulla oldalhasználati térkép** és egy **leválasztható memóriaablak**. Lásd:
  [Memóriaablak és nulla oldalhasználat](#memory-window-and-zero-page-usage).
- **Ultimate Basic** — soronkénti kódméret, tippek és Sprite szerkesztő →
  Ultimate Basic export animációval.
- **SID szerkesztő → .sid (PSID) export** és egy **sprite multiplexer** projekt
  sablon (16 sprite).
- Több lebegő ablak is megnyitható egyszerre; amelyikre rákattint, az kerül
  előtérbe.

---

## A 2.6.0 verzió legfontosabb elemei

- **A Visual Assembler mostantól teljesen ingyenes** — a Freemium / Professional
  licencet eltávolították. Minden szerkesztő, build és hardver futtatási
  lehetőség, mind a 7 felhasználói felület nyelve és minden téma mindenki
  számára működik, regisztráció vagy sorozatszám nélkül. Az ok egyszerű: a
  magyar adószabályok értelmében a program eladása túl kevés pénzt hagyna maga
  után az adók és a papírmunka után ahhoz, hogy megérje. A már meglévő
  sorozatszámokra egyszerűen már nincs szükség. Lásd: [Ingyenes és nyílt
  forráskódú](#free-and-open-source).

---

## A 2.5.9-es verzió legfontosabb elemei

- **Commodore 64 téma** — a C64 bekapcsolóképernyője: világoskék szegély a kék
  panelek körül, világoskék szöveg, fordított videó gombok, a C64 palettájának
  szintaxisszínei és a C64 betűtípus a monitor nézetben.
- **Commodore Beige téma** — a klasszikus kenyértartó: bézs ház, mustársárga
  funkciógombok, szivárványszínű jelvénycsíkok és C64 kék monitor nézet. Válaszd
  ki a témaválasztóban, vagy válts rá a téma gombbal. Lásd: [Beállítások és
  eszköztár](#5-settings--toolbar).
- **Commodore Starlight téma** — egy világos téma az áttetsző C64 kenyértartó
  után: matt üveg szivárványos RGB-fényvilággal, bíborvörös díszítéssel,
  szivárványos szintaxisszínekkel és füstös sötét monitorképpel.
- **Verziókövetési párbeszédpanel** — a párbeszédpanel a fejlécénél fogva
  húzható, és ott nyílik meg újra, ahol abbahagyta; a képernyőn marad, ha a
  napló vagy egy különbség magasabbá teszi, és a külső kattintás már nem zárja
  be (az Esc billentyűvel igen). Lásd: [Verziókövetés](#version-control).
- **Projektszintű verziókövetés** — egy megnyitott `.proj` projekt egy füléhez
  egy **File / Project** kapcsoló egyetlen bejegyzésben commitolja a projekt
  összes forrásfájlját (projektfa + belefoglalt fájlok). A napló felsorolja az
  egyes commitok módosított fájljait, a Diff fájlonként működik, a Checkout
  visszaállítja az összes fájlt a szerkesztőfülekre, és az automatikus mentési
  bejegyzések is projektenként készülnek. Git módban a napló és a diff a teljes
  tárolót lefedi. Lásd: [Projekt mód](#project-mode).

---

## A 2.5.8-as verzió legfontosabb elemei

- **Verziókövetés** — a projekt pillanatképei git-szerű verziókövetéssé váltak:
  commitok üzenettel és rövid hash-sel, naplózás **HEAD** értékkel, **Diff** a
  munkapéldányon, **Checkout** a szerkesztőbe és külön automatikus mentési
  bejegyzések. A blokk módú (JSON) programok összehasonlítása összeszerelő
  sorként történik, így a különbség a valódi változásokat mutatja. Működik a
  Blokk, Expert és Ultimate Basic lapokon. Lásd: [Verziókövetés]{1].
- **Git integráció** — válaszd a `git.exe` fájlt a **Beállítások →
  Verziókövetés** menüpontban (vagy hagyd, hogy az alkalmazás megtalálja).
  Amikor a projekt egy git repositoryban van, a párbeszédpanelen látható az ág,
  a módosított fájlok, a commit (először mentés), a napló, a diff **RAW**
  nézettel, a kijelentkezés, a **Pull** / **Push** és a **git init**.
- **Hiba jelentése** — beépített jelentési űrlap, amely akár 4 képernyőképet is
  tartalmazhat (fájl, Ctrl+V vagy drag and drop), opcionális e-mail címet,
  rendszerinformációkat és a legutóbbi alkalmazáshibákat. Lásd: [Hiba
  jelentése](#reporting-a-bug).
- **SID lejátszó** — **Véletlenszerű lejátszás** és **kedvencek** (★)
  dallamonként. Lásd: [SID lejátszó](#sid-player).

---

## A 2.5.7-es verzió legfontosabb elemei

- **VA SID Core 1.2** — az SID Player mostantól egy natív Rust C64 magot
  használ: egy cikluspontos 6510-et precíz megszakításidőzítéssel, a CIA
  6526A-t, VIC-II időzítést hibás vonalakkal, sprite DMA és raszteres
  megszakításokat, valamint a 6510 I/O portot. Lásd: [SID Player](#sid-player).
- **Nagy felbontású szerkesztő** — két szín minden 8×8-as cellában: az új **Cell
  paper** eszköz. Lásd: [Nagy felbontású / Többszínű
  szerkesztő](#hi-res--multicolor-editor).
- **Pontos karakter ROM** a ROM-nézegetőben, a Karakterszerkesztő **ROM
  betöltése** menüpontjában és a Térkép/Pályaszerkesztőkben.
- **Sprite szerkesztő** — nagy felbontású átfedés, kitöltés kitöltés,
  kijelölés/mozgatás, forgatás, összes tükrözése, sprite lap importálása,
  találati mező, X / Y ×2 előnézet. Lásd: [Sprite szerkesztő](#sprite-editor).
- **Pályaszerkesztő** — objektumok, karakterattribútumok, élellenőrzés,
  képernyőnkénti színek, memóriamérő RLE-vel, Futtatás VICE-ban. Lásd:
  [Pályaszerkesztő](#level-editor).
- **Karakterszerkesztő** — visszavonás / újra, rajzeszközök, 90°-os elforgatás,
  másolás / beillesztés és húzás a térképen való cseréhez, 2×2-es csempék,
  kisbetűs ROM készlet, szöveg előnézete és tartomány exportálása. Lásd:
  [Karakterszerkesztő](#character-editor-charset).
- **Karakterkészlet-szerkesztő** — 2×–24× nagyítás (csúszka vagy Ctrl+görgő)
  pixelráccsal, háttérszín nagy felbontású módban, nagy felbontású karakterek
  többszínű módban, és **ECM** (karakterenként külön háttér). Lásd:
  [Karakterkészlet-szerkesztő]{1].

---

## A 2.5.6-os verzió legfontosabb elemei

- **SID lejátszó** — egy új eszköztár gomb megnyit egy lebegő lejátszót a `.sid`
  (PSID / RSID) dallamokhoz: egy lejátszási lista húzással, előző/következő
  dallam, aldallamok, keresés és ±10 másodperc, hangerő, valamint a lejátszási
  lista mentése/megnyitása (`.sidpl`) lehetőséggel; a lista és az ablak állapota
  megjegyzendő. Lásd: [SID lejátszó](#sid-player).
- **VA SID Core 1.1** — beépített SID emuláció (MOS 6581 / 8580, MOS 6581/8580
  alapú 6581 szűrővel) és ciklusfüggő PSID / RSID lejátszó (6510 CPU, CIA / VIC
  időzítés). Válaszd ki a **Beállítások → Általános → SID előnézet**
  menüpontban; az SID lejátszó mutatja, hogy melyik motor játszik le.
- **SID szerkesztő** — gombok a hangszerparaméterekhez, szélesebb ADSR grafikon,
  **MIDI bemenet**, **felvétel** a trackerbe (új pattern kerül hozzáadásra, ha a
  jelenlegi megtelt), **metronóm** ütemlámpákkal, **pattern törlése**, a VA-VK
  master hangerőszabályzója, és **GoatTracker .sng importálása**. Lásd: [SID
  szerkesztő](#sid-editor-3-voice-tracker).
- Az **Ultimate Basic 1.6.4** csomagban található.

---

## A 2.5.5-ös verzió legfontosabb elemei

- **Nagy felbontású szerkesztő: képpontrács és 16× nagyítás** — bekapcsolt
  **ráccsal** 4× nagyítástól minden képpont saját rácsvonalat kap, amely erősebb
  a karaktercella-szegélyeken, és árnyékolt, hogy mind a 16 színnél látható
  maradjon. A nagyítási csúszka mostantól 16×-ig nagyítható. Lásd: [Nagy
  felbontású / Többszínű szerkesztő](#hi-res--multicolor-editor).
- **Jobb klikk a Másolás / Beillesztés menüre** — a Nagy felbontású és Térkép
  szerkesztő vásznán (Másolás, Beillesztés, Átlátszó beillesztés) és a Sprite
  szerkesztőben (Keret másolása, Keret beillesztése, szintén a keretsávon). A
  beillesztés a menü előnézetéből indult ki, ahová kattintott.
- **Számátváltó** — az eszköztár gombja kiemelve marad, amíg az átváltó látható.
- **Javítva** — a Nagy felbontású szerkesztő többszínű cellarácsa kétszer olyan
  széles volt, mint egy karaktercella; a Nagy felbontású eszköztár
  **Beillesztés** gombja mindig átlátszóan illesedett be; az SID szerkesztő jobb
  gombbal megjelenő menüje a kurzortól távol nyílt meg, miközben a
  párbeszédpanel középre volt igazítva.
- **Ez a kézikönyv** – a Nagy Felbontású Szerkesztő kijelölési,
  másolási/beillesztési és átlátszó beillesztési funkcióit ismerteti.

---

## A 2.5.4-es verzió legfontosabb elemei

- **Javítva: ablak nem jelent meg újraindításkor** — ha az alkalmazás
  minimalizált vagy rejtett ablakkal záródott be (főleg macOS-en, de
  Linuxon/Waylandon is), a következő indításkor előfordulhatott, hogy ablak
  nélkül jelent meg. A látható állapot már nem kerül mentésre (az ablak mérete
  továbbra is megmarad), és az ablak mindig látható indításkor.
- **Ultimate Basic 1.6.3 csomagban** — QBasic stílusú szintaxis: `dim név
  típusként` változókhoz és minden típusú tömbhöz, `függvény` / `sub` `as`
  típusokkal, `elseif`, `do … ciklus`, `while … wend`, `select case`, `exit do`
  / `exit sub`, egysoros `if`, `'` megjegyzések és `kiírja a; b; c`; futásidejű
  karakterláncokat (`+`, `left$` / `right$` / `mid$`) és előjeles 16 bites
  `integer`. Kiemelve, kiegészítve és formázva az UB szerkesztőben, új **DIM**,
  **FUNCTION**, **ELSEIF**, **DO**, **WEND**, **SELECT CASE**, **END**, **EXIT
  SUB** és **LEFT$** / **RIGHT$** / **MID$** bejegyzésekkel a Parancsok panelen.
  Lásd: [UltimateBasic Mode](#ultimatebasic-mode).

---

## A 2.5.2-es verzió legfontosabb elemei

- **A SID szerkesztő előnézetei a valódi SID-en** — hangszer előnézet, virtuális
  billentyűzet, hangjegybevitel, akkord/arpeggio, sor és egyetlen pattern
  lejátszása a WebSid-en keresztül történik; a szintetizátor csak tartalékként
  marad meg. Lásd: [SID szerkesztő]{1}.

---

## A 2.5.1-es verzió legfontosabb elemei

- **SID Editor hangszerek** — szűrőválasztás hangonként, **3 OFF** és rezonáns
  vágási ** sweep** (start, end, speed, ping-pong); hangszer **vibrato** (delay,
  speed, depth); **impulzusszélesség-moduláció**; **kapu időzítő**, **hard
  restart** és első képkocka hullámforma; **hullám/arpeggio táblázat** előre
  beállított értékekkel; **RING** és **SYNC**. Lásd: [SID
  Editor](#sid-editor-3-voice-tracker).
- **Új SID lejátszó** — az exportált lejátszó minden képkockán lefuttatja a
  hangszer modulációját (`JSR sid_frame` a saját IRQ-dhoz); az előnézet ugyanazt
  a lejátszót rendereli egy kis SID szintetizátoron keresztül. Az `.bin`
  mentései megőrzik a hangszerek nevét és sebességét.
- **Virtuális billentyűzet** — 2, 3 vagy 4 oktáv Commodore 64 szintetizátor
  kinézetben.
- **Az Ultimate Basic 1.6.2 csomagban** — A `tune` tartalmazza a következő
  funkciókat: `imod`, `ifilt`, `igate` és `itab`; az **Exportálás az
  UltimateBasic-be** kiírja ezeket.
- **Könyvjelzők és Ugrás a sorra** az Expert és az Ultimate Basic szerkesztőkben
  — Ctrl+F2 / F2 / Shift+F2, Ctrl+G.
- **Javítva:** A címkekifejezések (`.assert`, `LEVEL_MULTICOLOR*16`, `*`) ismét
  működnek a telepített alkalmazásban (a kiadási CSP alatt nincs `eval`).

---

## A 2.5.0 verzió legfontosabb elemei

- **Pályaszerkesztő** — egy új eszköztár-szerkesztő, amely függőlegesen,
  vízszintesen vagy 2D-s rácsban rendezi el a Térképszerkesztő képernyőit, és
  folyamatos görgetéssel előnézetben jeleníti meg a teljes pályát. Lásd:
  [Pályaszerkesztő](#sid-editor-3-voice-tracker).
- **LEVEL / LEVEL_ROW makrók** — `.level "level.bin"[, $addr]` csak a Level
  Editor projekt elhelyezett képernyőit helyezi el, plusz a pointer táblákat, és
  definiálja a `LEVEL_*` címkéket és konstansokat; `.level_row dst, col[,
  color]` egy 40 karakteres szintsort másol egy pufferbe. Lásd: [LEVEL /
  LEVEL_ROW]{1].
- **JOYSTICK változó mód** — `.joystick port, vx, vy[, fire]` az irányt
  változókba írja (−1 / 0 / +1) sprite mozgatása helyett; az `3` port mindkét
  joystick portot beolvassa. Lásd: [JOYSTICK]{1].
- **Szintgörgetési demó** — `samples/level-demo.asm` görget egy 2×5-ös
  képernyőszintet pixelről pixelre minden irányba a joystick segítségével,
  szakadásmentesen, elegendő hellyel a sprite-oknak és a játékkódnak.
- **Számátalakító** — egy nem modális DEC / HEX / BIN párbeszédpanel az
  eszköztáron. Lásd: [Számátalakító]{1}.
- **Példák párbeszédpanel** — **Menü → Példák…** megnyitja a beépített
  példaprogramok kereshető, kategorizált listáját. Lásd: [Példaprogramok]{1}.
- **Ultimate Basic 1.6.1 csomagban** — `map load "level.bin"[, addr]`
  közvetlenül beolvassa a Level Editor projektet, és az új `map view px, py`
  görgeti a térképet simán és szakadásmentesen egy pixel pozícióban (példa:
  `level_scroll_demo.ub`). Egy 16 bites összegen belüli bájtszorzat már nem
  csonkolódik 8 bitre. Az UB parancsreferencia felsorolja a `map view`-et, és a
  keresése a parancsnév-találatokat helyezi előtérbe.

---

## A 2.4.9-es verzió legfontosabb elemei

- **Projektsablonok** — **Menü → Fájl → Új projekt sablonból…**, vagy az
  **Menü** és az **Oktatóanyagok** között található új eszköztárgomb egy
  építésre kész `.proj` projektet hoz létre saját mappájában. A párbeszédpanelen
  található egy **Assembler** rész (üres program, játékvázlat, hires és
  többszínű bitkép) és egy **UltimateBasic** rész (üres program, játékvázlat,
  hires bitkép, raszteres IRQ), szintaxissal kiemelt előnézettel. A saját `.asm`
  / `.ub` sablonok a felhasználói sablonok mappából tölthetők le. Lásd:
  [Projektsablonok](#level-editor).
- **Projektépítés** — **Menü → Építés → Projektépítés** A megnyitott projekt
  (vagy a megnyitott lapok) összes építhető fájlját egy `.prg` fájlba fordítja a
  forráskódja mellé, ahol elérhető, hibakereső szimbólumfájlokat ír, kihagyja a
  csak include-okat tartalmazó modulokat, és fájlonkénti jelentést jelenít meg.
  Lásd: [Projektépítés]{1].
- **Ctrl + egérgörgő zoom** az Expert és Ultimate Basic szerkesztőkben (`Cmd` +
  görgő macOS-en; az érintőpad csippentése is működik).
- **A munkaterületek megjegyzik a projekteket** — az Expert és az Ultimate Basic
  projektfák, az indítófájl és a nem mentett projektmódosítások a `.vaws`
  munkaterületre kerülnek mentésre, és azzal együtt kerülnek visszaállításra. A
  régebbi munkaterületek továbbra is nyitva maradnak.
- **Ultimate Basic** — a mellékelt fordító gyorsabb, kisebb 6502-es kódot
  generál; a memóriatérkép mostantól megkülönbözteti a valódi kódot és adatokat
  a kitöltéstől és a hosszú `org` hézagoktól.
- **A fájl párbeszédablakok az aktív munkamappában** indulnak – a Blokk/Szakértő
  vagy az Ultimate Basic mappában, az aktuális módtól függően.
- **Ultimate Basic 1.6.1 csomagban** — `map load "level.bin"[, addr]`
  közvetlenül beolvassa a Level Editor projektet, és az új `map view px, py`
  görgeti a térképet simán és szakadásmentesen egy pixel pozícióban (példa:
  `level_scroll_demo.ub`). Egy 16 bites összegen belüli bájtszorzat már nem
  csonkolódik 8 bitre. Az UB parancsreferencia felsorolja a `map view`-et, és a
  keresése a parancsnév-találatokat helyezi előtérbe.

---

## A 2.4.8-as verzió legfontosabb elemei

- **Projektsablonok** — **Menü → Új projekt → Új projekt sablonból…**, vagy az
  **Menü** és az **Oktatóanyagok** között található új eszköztárgomb egy
  építésre kész `.proj` projektet hoz létre saját mappájában. A párbeszédpanelen
  található egy **Assembler** rész (üres program, játékvázlat, hires és
  többszínű bitkép) és egy **UltimateBasic** rész (üres program, játékvázlat,
  hires bitkép, raszteres IRQ), szintaxissal kiemelt előnézettel. A saját `.asm`
  / `.ub` sablonok a felhasználói sablonok mappából tölthetők le. Lásd:
  [Projektsablonok](#project-templates).
- **Koala import/export a Hires szerkesztőben** — **Fájlok → Koala importálása
  (.koa)…** / **Koala exportálása (.koa)…** (szabványos 10003 bájtos fájl; a
  nagy felbontású képek exportáláskor többszínűvé válnak). A(z) `.koa` / `.kla`
  fájlokat a(z) **Kép importálása / .bin** is felismeri.
- **Az Ultimate Basic 1.5.9 verziója a csomagban** — új `chain "FILE" [,
  eszköz]` (tölts be egy másik programot a futó fölé és FUTSD); `load "FILE"` a
  fájl saját címére töltődik be, `load "FILE", addr` a `addr` címre töltődik;
  D64 javítások. A `chain` kiemelve és felsorolva van a parancsreferenciában.
- **Frissítés állapota a Szakértői állapotsorban** — ugyanaz a *Naprakész* /
  kattintható *Elérhető frissítés* jelző, mint az Alapfokú Alapmódban.
- A **Mentés párbeszédablakok** a fájl saját típusát kínálják fel (pl. *KOA*) a
  *Bináris (\*.bin)* helyett.
- **Hatalmasabb frissítés-ellenőrzés** — a telepítők listája a
  c64va.tech/downloads/VA/ címen található, így az ellenőrzés az új letöltési
  oldallal is működik; a Linux frissítési segéd már nem örökli az AppImage
  könyvtár elérési útját.

---

## A 2.4.7-es verzió főbb jellemzői

- **Alkalmazáson belüli frissítések** — **Menü → Frissítések keresése**
  ellenőrzi a c64va.tech webhelyen az újabb verziókat, és a megerősítést
  követően letölti a platformodhoz tartozó telepítőt egy folyamatjelző sávval,
  majd telepíti azt. Lásd: [Alkalmazáson belüli frissítések](#koala). Az
  ellenőrzés minden indításkor csendben fut.
- **Frissítési állapot az Ultimate Basic állapotsorán** — a **Frissítés (vX)**
  feliratot, vagy a kiemelt **Elérhető frissítés: vY** feliratot jeleníti meg,
  amelyre kattintva megnyílik a frissítési párbeszédablak.
- **Görbeszerkesztő → UltimateBasic export** — **Fájlok → Exportálás
  UltimateBasic-be** inicializált UB tömbként írja ki a táblázatot; a **Fájlok →
  UltimateBasic demó exportálása** egy futtatásra kész UB sprite demót hoz
  létre. Lásd: [Görbeszerkesztő]{1}.
- **Ultimate Basic 1.5.8 csomagban** — az új **`data <tömb>: v, …`** űrlap
  kitölti a deklarált `tömböt` / `array_word` a program indításakor (a további
  sorok ott folytatódnak, ahol az előző abbamaradt, a szótömbök 16 bites
  értékeket vesznek fel) anélkül, hogy érintené a `read` folyamot.
- **Az elrendezés illeszkedik az ablakhoz** — a szerkesztőpanelek pontosan a
  fennmaradó ablakmagasságot veszik fel, így az alkalmazás már nem jelenít meg
  oldalszintű függőleges görgetősávot; az ASM kimeneti panel minimális
  szélessége 440 px; a munkamappa elérési útja egy finom jelvényben található az
  ASM nézet címe felett, és ugyanazt a jelvényt használja a Szakértő és az
  Ultimate Basic eszköztáron is. A párbeszédpanelek feliratai már nem
  tördelődnek.
- **Hatalmasabb frissítés-ellenőrzés** — a telepítők listája a
  c64va.pro/downloads/VA/ címen található, így az ellenőrzés az új letöltési
  oldallal is működik; a Linux frissítési segéd már nem örökli az AppImage
  könyvtár elérési útját.

---

## A 2.4.6-os verzió legfontosabb elemei

- **Alkalmazáson belüli frissítések** — **Menü → Frissítések keresése**
  ellenőrzi a c64va.pro fájlt újabb verziókért, és megerősítés esetén letölti a
  platformodhoz tartozó telepítőt egy folyamatjelző sávval, majd telepíti azt.
  Lásd: [Alkalmazáson belüli frissítések](#in-app-updates). Az ellenőrzés minden
  indításkor csendben fut.
- **Alapfokú nyelvi frissítés** — a szintaxiskiemelések és a parancsreferenciák
  mostantól lefedik a következőket: **`sfx`** (nem blokkoló SID hatás: `sfx
  channel, frames, frames [, wave]`), **`org`** (a sub/fn kód folytatása egy
  címen, nullával kitöltött rés hagyása, amelybe az `incbin` adat fér),
  **`charset on` / `charset off`** (a VIC-II átkapcsolása RAM karakterkészletre
  és vissza) és **`incbin` A slicing** (`incbin "font.prg", $3C00, 2` kihagyja
  az első bájtokat, egy opcionális negyedik argumentum korlátozza a hosszt).
- **Többblokkos kiemelés az ASM nézetben** — több blokk kijelölése egyszerre
  kiemeli az összes ASM-sorukat, a görgetési pozíció stabil marad a kijelölés
  során, és a sorszámok lágyabbak egy finom függőleges elválasztó szabálynak
  köszönhetően.
- **Az Assembler mód megmaradt az Ultimate Basic kapcsolóin keresztül** — egy
  projekt vagy egy beépített minta megnyitásakor, miközben az Ultimate Basic
  aktív, mostantól az UB-t hagyja el először, és visszatér az utolsó
  Blokk/Szakértő módba, így az UB puffer már nem tudja felülírni az új lap
  módját vagy címét. Az új lapok a megfelelő módban jönnek létre.
- **Kung Fu Flash 2 beállítások** — a Hardverbeállításokban található **USB
  érzékelése** gomb újrakeresi a kazetta soros portját, és a KFF2 előfeltételei
  mostantól a szükséges Kung Fu Flash firmware-t (v2.07+) jelzik.
- **Ultimate Basic parancsreferencia** — A `tune` és az `music` teljes,
  kommentált példákat mutat (cellaponkénti formátum, effektek, játékosjegyzetek,
  `music lejátszás N`); az `inst`, `order`, `pat` és a tune `speed` saját
  bejegyzésekkel rendelkezik; a `data` az új tömbformát mutatja; a `load sid`
  szintaxis javítva lett (`load sid "tune.sid", $2000`).

---

## A 2.4.5-ös verzió legfontosabb elemei

- **Kung Fu Flash 2 támogatás — futtasd a programjaidat egy valódi Commodore
  64/128-on.** Egy új **Kung Fu Flash 2** bejegyzés a megosztott **Futtatás**
  menüben lefordítja a programot, és USB-n keresztül közvetlenül egy valódi,
  bekapcsolt, Kung Fu Flash 2 kazettával felszerelt C64-re (vagy C128-ra) tölti
  fel — nincs lemezkép, nincs SD-kártya másolás, nincs emulátor. Blokk, Expert
  és Ultimate Basic módban működik. A kazetta USB soros portját a rendszer
  automatikusan felismeri (és kézzel is beírható); a beállításért és a pontos
  munkafolyamatért lásd a [Kung Fu Flash 2]{1}-et.
- **Átméretezhető Program / ASM panelek** — egy vékony függőleges elválasztó a
  Program panel és az ASM/Kimenet panel között, amellyel a határvonalat balra
  vagy jobbra húzhatjuk (panelenként minimum 260 px). A nyílbillentyűkkel el
  lehet húzni, dupla kattintással 50/50 arányú felosztásra lehet visszaállítani,
  a pozíciót pedig a munkamenetek között megőrzi a rendszer. Az elválasztó
  rejtett a Szakértő és az Ultimate Basic módban, valamint a keskeny, egymásra
  helyezett elrendezésben.
- **Letisztultabb makrósorok az ASM nézetben** — a makróblokkok mostantól a
  vezető kommentjelölő nélkül jelennek meg (`.print "HELLO"`, `.if A == 1`,
  `.sprite_init …` a ` helyett; .print …`), és az ASM szintaxiskiemelője
  makróként színezi őket. A hagyományos COMMENT blokkok és régiójelölők továbbra
  is `;` karakterlánccal kezdődnek.
- **Egyéni makrókiemelés a Szakértő szerkesztőben** — a makró neve az `.macro`,
  `.invoke` és `.call` (és a Kick stílusú `:name(...)` hívások után) saját
  színnel rendelkezik, akárcsak a makró törzsében lévő `{param}`
  helyettesítések, valamint a paraméternevek a `.macro` fejlécben, minden
  témában.
- **Frissített Névjegy párbeszédpanel** — szélesebb, kétoszlopos elrendezés
  csoportosított projekt-, licenc- és hitellinkekkel, az Ultimate Basic banner
  pedig mostantól átlátszó háttérrel rendelkezik, így minden témába beleolvad.

---

## A 2.4.3-as verzió legfontosabb elemei

- **SID szerkesztő: Dal/sorrend lista** — a pattern-ek mostantól egy megfelelő
  dal/sorrend listán keresztül vannak elrendezve, amely a nyers pattern bank
  tetején található, így egy pattern ismétlődhet, és a dal hosszabb lehet, mint
  a tárolt pattern-ek száma. Lépések hozzáadása, eltávolítása és átrendezése
  közvetlenül a SID szerkesztőből lehetséges; a lejátszás és az exportált
  lejátszó is ezt a listát követi a nyers pattern sorrend helyett.
- **SID szerkesztő: Effekt oszlop** — minden követő cella mostantól hordozhat
  effektet a hangjegye mellett: **V**ibrato, slide **U**p / **D**own,
  note-**C**ut, és sebességváltozás (**F**). Írd be közvetlenül egy cellába, pl.
  `C-4 01 V24` (hangjegy + hangszer + vibrato) vagy `F06` (csak
  sebességváltozás). Az effektek soronként egyszer futnak, illeszkedve az
  exportált lejátszóhoz, és mostantól helyesen játszódnak le mind az
  alkalmazáson belüli Web Audio előnézetben, mind a lefordított 6502 exportban —
  egy valódi, játszható effektmotor, nem csak export állványzat.
- **Visszafelé kompatibilis SID mentési formátum** — Az SID mentések mostantól
  verziójelölővel rendelkeznek, így a régebbi `.bin` mentések, amelyek az effekt
  oszlop létezése előtt készültek, továbbra is pontosan úgy töltődnek be, mint
  korábban, az effektek egyszerűen hiányoznak.
- **D64 Szerkesztő: explicit Mentés munkafolyamat** — minden szerkesztés
  (hozzáadás/kivonás/átnevezés/törlés, és most már a Blokkszerkesztő
  bájtszerkesztései is) egy privát munkapéldányon történik; semmi sem érinti a
  valódi `.d64` fájlt, amíg a **Mentés** gombra nem kattintasz, ami először
  automatikus biztonsági mentést is készít. A szerkesztő bezárása vagy egy másik
  lemez megnyitása a nem mentett módosításokat mostantól megerősítést kér a
  csendes elvetésük helyett.
- **D64 Szerkesztő: Blokkszerkesztő hexadecimális rács** — a kiválasztott 256
  bájtos blokk nyers bájtnézete mostantól egy megfelelő bájtonkénti
  hexadecimális rács egy sima szövegdoboz helyett, és a párbeszédpanel már nem
  halványítja el az alkalmazás többi részét mögötte, amikor meg van nyitva.
- **Web64 a termék weboldalán** — új Web64 IDE részleg a
  [c64va.pro](https://www.c64va.pro) oldalon.
- **Mintafrissítés** — az `makró-paraméterrel` minta mostantól a zárójeles
  `.macro setColor(color)` űrlapot használja.

---

## A 2.4.2-es verzió legfontosabb elemei

- **Húzd át az egérmutatót a D64 szerkesztőbe** — húzd át a lefordított
  `.prg`/`.bin` fájlt (a SID/sprite/char szerkesztők exportjaiból, vagy
  bárhonnan máshonnan) közvetlenül a lemezképre; a Hozzáadás panel előre
  kitöltve nyílik meg. Több fájl egyidejű áthúzása egymás után sorba állítja
  őket.
- **Include fájl létrehozása** — egy új eszköztárgomb létrehoz egy `.inc` fájlt,
  amely a lemezen lévő minden bejegyzéshez listázza a `.const NAME = $ADDR`
  értéket, így a főprogram hivatkozhat arra, hogy az egyes bejegyzések hová
  kerültek anélkül, hogy kézzel kellene beírni a címeket.
- **Blokkszerkesztő (új)** — egy eszköztári kapcsoló átváltja a D64 szerkesztőt
  nyers sáv/szektor hozzáférésre a könyvtár alatt: kattintható blokktérkép (a
  BAM szabad/használt bitképével színezve, a BAM és a könyvtárlánc külön
  jelölve), hexadecimális nézet/szerkesztő a kiválasztott 256 bájtos blokkhoz,
  és Előző/Következő szektornavigáció. Közvetlenül olvassa és írja a lemezképet
  (`read_bin_file`/`write_bin_file`), függetlenül a `c1541`-től.
- **D64 Szerkesztő: explicit Mentés munkafolyamat** — minden szerkesztés
  (hozzáadás/kivonás/átnevezés/törlés, és most már a Blokkszerkesztő
  bájtszerkesztései is) egy privát munkapéldányon történik; semmi sem érinti a
  valódi `.d64` fájlt, amíg a **Mentés** gombra nem kattintasz, ami először
  automatikus biztonsági mentést is készít. A szerkesztő bezárása vagy egy másik
  lemez megnyitása a nem mentett módosításokat mostantól megerősítést kér a
  csendes elvetésük helyett.
- **D64 Szerkesztő: Blokkszerkesztő hexadecimális rács** — a kiválasztott 256
  bájtos blokk nyers bájtnézete mostantól egy megfelelő bájtonkénti
  hexadecimális rács egy sima szövegdoboz helyett, és a párbeszédpanel már nem
  halványítja el az alkalmazás többi részét mögötte, amikor meg van nyitva.

---

## A 2.4.1-es verzió legfontosabb elemei

- **Lengyel és olasz felhasználói felület nyelvei** — teljes felület fordítása
  (menük, párbeszédablakok, emlékeztető leírások, Ultimate Basic
  parancsreferencia) a meglévő magyar, angol, spanyol, német és holland mellett.
- **Online súgó eszköztár gomb** — egy új ikon gomb a Debug után, amely
  közvetlenül az alkalmazásból nyitja meg a többnyelvű dokumentációs webhelyet
  ([c64va.tech/docs.html]{1}).
- **Központosított mnemonikus leírások:** A nyelvenkénti mnemonikus leírások
  átkerültek a megosztott fordítási fájlba a felhasználói felület többi
  karakterláncával együtt. Kijavít egy régóta fennálló hibát is, amely miatt a
  `PRINT`, `PRINT_HEX`, `CLEAR_SCREEN`, `WAIT_KEY`, `SET_BORDER`, `SET_BG`,
  `IRQ_SETUP` és `RAND` angol leírásait csendben felülírta a megmaradt spanyol
  szöveg.

---

## A 2.4.0 verzió legfontosabb elemei

- **D64 szerkesztő** — egy teljes értékű lemezkép-böngésző az eszköztáron (a
  Görbeszerkesztő után). Nyisson meg egy meglévő `.d64` fájlt, hozzon létre egy
  új üres lemezt, vagy indítsa el az aktuális lemezt közvetlenül a VICE-ba,
  mindezt a Fájlok ▾ menüből, a többi vizuális szerkesztőhöz hasonlóan. Lásd:
  [D64 szerkesztő (meglévő lemezkép böngészése és szerkesztése)]{1}.
- **Online súgó eszköztár gomb** — egy új ikon gomb a Debug után, amely
  közvetlenül az alkalmazásból nyitja meg a többnyelvű dokumentációs webhelyet
  ([c64va.pro/docs.html](https://www.c64va.pro/docs.html)).
- **Betöltési cím, kicsomagolási cím és Exomizer a D64 szerkesztőben** — fejléc
  nélküli nyers fájl hozzáadásával beállítható egy opcionális betöltési cím, egy
  Exomizer kicsomagolási cél, és tömöríthető a fájl betöltés közben,
  ugyanazokkal a `mem`/`sfx` tömörítési módokkal, mint az Exportálás D64-be
  párbeszédpanel extra fájljai. Egy már saját fejlécet tartalmazó `.prg` fájl
  teljesen kihagyja ezeket a mezőket.

---

## A 2.3.9-es verzió legfontosabb elemei

- **`*` bármilyen kifejezésben** — a programszámláló szimbólum mostantól
  operandus kifejezéseken belül is működik, nem csak önmagában: `BNE *-5`, `JMP
  *+20`, `LDA #<*`, `LDA #>(*+63)`. Az értéket követő `*` (`STRIDE*2`) továbbra
  is szorzás. Lásd: [Címzési módok → Az `*` programszámláló
  kifejezésekben](#d64-editor-browse--edit-an-existing-disk-image).
- **Helyi (pontozott) címkék** — egy olyan címke, mint az `.loop`, a
  legközelebbi megelőző *global* (nem pontozott) címke hatókörébe tartozik, így
  a `DrawSprite` és a `ClearScreen` mindegyike ütközés nélkül definiálhatja a
  saját `.loop` címkéjét. Lásd: [Helyi (pontozott) címkék]{1].
- **Hosszú ágú pszeudo-op-ok** — `LBNE`, `LBEQ`, `LBCC`, `LBCS`, `LBMI`, `LBPL`,
  `LBVC`, `LBVS` egy `JMP` (mindig 5 bájt) feletti invertált ággá állnak össze,
  így a cél tetszőleges távolságra lehet. Új **Hosszú ágak** paletta kategória.
  Lásd: [LBNE / LBEQ / … (Hosszú ágak)]{1}.
- **`.assert` direktive** — `.assert end - start <= 256` vagy `.assert * <
  $A000, A "message"` üzenet kiértékelése az összeszerelési időben történik, és
  a build meghiúsul (a tényleges értéket mutatja), ha a kifejezés hamis. Lásd:
  [.ASSERT]{1}.
- **Önmódosító kód operandus címkéi** — `LDA érték:#$00` határozza meg az
  `érték` címkét, amely az utasítás operandus bájtjára mutat, így az `STA érték`
  közvetlenül azt foltozza. Lásd: [Önmódosító kód operandus címkéi]{1}.
- **Barátságosabb „tartományon kívüli” ághibák** — a −128…+127 tartományon
  kívülre eső ág mostantól pontosan jelzi, hogy mennyire túllépi a határt, és
  javaslatot tesz a megfelelő `LBxx` hosszú ágra.
- **Fejlesztve:** a világos téma módjelző eszköztár jelvénye (BLOKK MÓD /
  SZAKÉRTŐI MÓD / …) sötétebb és olvashatóbb lett, és a csillogó animációja
  ismét látható.

---

## 1. Felület áttekintése

Az alkalmazás három fő panelre oszlik:

- **`*` bármilyen kifejezésben** — a programszámláló szimbólum mostantól
  operandus kifejezéseken belül is működik, nem csak önmagában: `BNE *-5`, `JMP
  *+20`, `LDA #<*`, `LDA #>(*+63)`. Az értéket követő `*` (`STRIDE*2`) továbbra
  is szorzás. Lásd: [Címzési módok → Az `*` programszámláló
  kifejezésekben](#the--program-counter-in-expressions).
- **Helyi (pontozott) címkék** — egy olyan címke, mint az `.loop`, a
  legközelebbi megelőző *global* (nem pontozott) címke hatókörébe tartozik, így
  a `DrawSprite` és a `ClearScreen` mindegyike ütközés nélkül definiálhatja a
  saját `.loop` címkéjét. Lásd: [Helyi (pontozott) címkék]{1].
- **Hosszú ágú pszeudo-op-ok** — `LBNE`, `LBEQ`, `LBCC`, `LBCS`, `LBMI`, `LBPL`,
  `LBVC`, `LBVS` egy invertált ágba állnak össze egy `JMP` (mindig 5 bájt)
  felett, így a cél tetszőleges távolságra lehet. Új **Hosszú ágak** paletta
  kategória. Lásd: [LBNE / LBEQ / … (Hosszú ágak)](#lbne--lbeq---long-branches).
- **`.assert` direktive** — `.assert end - start <= 256` vagy `.assert * <
  $A000, A "message"` üzenet kiértékelése az összeszerelési időben történik, és
  a build meghiúsul (a tényleges értéket mutatja), ha a kifejezés hamis. Lásd:
  [.ASSERT](#assert).
- **Önmódosító kód operandus címkéi** — `LDA érték:#$00` határozza meg az
  `érték` címkét, amely az utasítás operandus bájtjára mutat, így az `STA érték`
  közvetlenül azt foltozza. Lásd: [Önmódosító kód operandus
  címkéi](#self-modifying-code-operand-labels).
- **Barátságosabb „tartományon kívüli” ághibák** — a −128…+127 tartományon
  kívülre eső ág mostantól pontosan jelzi, hogy mennyire túllépi a határt, és
  javaslatot tesz a megfelelő `LBxx` hosszú ágra.

---

## 2. Blokk paletta

A bal oldali paletta kategóriák szerint csoportosítva felsorolja az összes
elérhető blokkot:

| Panel                 | Leírás                                                                             |
| --------------------- | ---------------------------------------------------------------------------------- |
| **Balra — Paletta**   | Minden elérhető utasítás- és makróblokk. Keresés vagy böngészés kategória szerint. |
| **Központ — Program** | A programod. Húzd ide a blokkokat, rendezd át őket, szerkeszd az operandusokat.    |
| **Jobbra — Kimenet**  | Élő ASM nézet és/vagy memóriamonitor kimenet.                                      |

A paletta tetején található **keresőmezővel** név szerinti szűréshez kattintson
a **Kijelölt blokk hozzáadása** gombra, vagy húzzon egy blokkot a
programterületre.

Blokk módban egy vékony **függőleges elválasztó** található a Program és a
Kimenet panelek között. Húzd el, hogy több hely legyen az egyik panelen
(mindegyik legalább 260 képpontos legyen), a ← / → billentyűkkel 16 képpontos
lépésekben mozgathatod, vagy duplán kattintva visszaállíthatod az 50/50 arányú
felosztást. A pozíció a felhasználói felület beállításaival együtt mentésre
kerül. Az elválasztó rejtett Expert és Ultimate Basic módban, valamint akkor,
amikor az ablak elég keskeny ahhoz, hogy a panelek egymásra rakhatók legyenek.

---

## 3. Programterület

A bal oldali paletta kategóriák szerint csoportosítva felsorolja az összes
elérhető blokkot:

- **Húzzon át** blokkokat a palettáról, vagy **rendezze át** a meglévő blokkokat
  a fogantyújuk (≡) húzásával.
- Minden blokk mutatja a **mnemonikját**, az **operandus mezőjét** és az
  **címzési mód választóját** (ahol alkalmazható).
- Kattintson az **▸ / ▾** kapcsolóra egy blokk összecsukásához vagy
  kibontásához.
- Egy blokk eltávolításához használd az **× (törlés)** gombot.
- Az **Összes összecsukása** gomb egyszerre hajtja össze az összes blokkot.
- **Nyilvántartási műveletek** — TAX, TAY, INX, DEX, …
- **Eltolás és forgatás** — ASL, LSR, ROL, ROR
- **Stack** — PHA, PHP, PLA, PLP
- **Rendszer** — CLC, SEC, NOP, BRK, …
- **Érvénytelen utasítások** — LAX, SAX, DCP, …
- **Struktúra** — CÍMKÉ, MEGJEGYZÉS, RÉGIÓ, VÉGRÉGIÓ
- **Makrók** — LOOP, NEXT, FOR, ENDF, PUSH, PULL, END, TEXT, BYTE, WORD, FILL,
  ALIGN, ASSERT, STRING, DATA, RAWBYTES, RAWTEXT, PETSCII, CHARSET, INCBIN, SID,
  INCLUDE, TABLE, ORG, MACRO, ENDM, INVOKE, IF, ELSE, ENDIF, VAR, WHILE, ENDW,
  REPEAT, UNTIL, MEMCPY, MEMSET, PRINT, PRINT_CHAR, PRINT_HEX, CLEAR_SCREEN,
  WAIT_KEY, DELAY, SET_BORDER, SET_BG, IRQ_SETUP, RAND, SPRITE_INIT, SPRITE_POS,
  WAIT_RASTER, JOYSTICK, MOUSE, SPRITE_COL, LOADFILE, REU_CHECK, REU_STASH,
  REU_FETCH, REU_SWAP, TURBO_SET, SUPERCPU_DETECT, TURBO_ENABLE, MAP_COPY,
  MAP_COPY16X16, SPRITE_ANIM, SCORE_BCD

A paletta tetején található **keresőmezővel** név szerinti szűréshez kattintson
a **Kijelölt blokk hozzáadása** gombra, vagy húzzon egy blokkot a
programterületre.

### Paraméterek az operandusmezőben

Minden paraméterekkel rendelkező blokk az **operandus mezőben** veszi fel őket
az **Add** előtt. Utasítások esetén ez az operandus (`06` az `LDA #$06` esetén);
TEXT, BYTE, LABEL, REGION és a többi szöveg- vagy listamakró esetén ez a
szövegük vagy értékük; minden más makró esetében pedig az, ami a kulcsszó után
áll Szakértő módban:

| Tömb       | Operandusmező    | Vál                      |
| ---------- | ---------------- | ------------------------ |
| SET_BG     | `$06`            | `.set_bg $06`            |
| RÉGIÓ      | `Fő`             | `.region Főoldal`        |
| ORG        | `$C000`          | `* = $C000`              |
| SPRITE_POS | `1, 200, 50`     | `.sprite_pos 1, 200, 50` |
| HUROK      | `Y, $05, myloop` | `.loop Y, $05, myloop`   |

A mező a makró alapértelmezett paramétereit mutatja segítségül. A paraméter
nélküli blokkok (ENDREGION, ELSE …) és a fájlmakrók (INCBIN, KOALA, LEVEL, SID,
INCLUDE – ezek a blokkban választják ki a fájljukat) letiltva tartják a mezőt.

---

## 4. ASM nézet

- **Húzzon át** blokkokat a palettáról, vagy **rendezze át** a meglévő blokkokat
  a fogantyújuk (≡) húzásával.
- Minden blokk mutatja a **mnemonikját**, az **operandus mezőjét** és az
  **címzési mód választóját** (ahol alkalmazható).
- Kattintson az **▸ / ▾** kapcsolóra egy blokk összecsukásához vagy
  kibontásához.
- Egy blokk eltávolításához használd az **× (törlés)** gombot.
- Az **Összes összecsukása** gomb egyszerre hajtja össze az összes blokkot.

### Kimeneti módok

A makróblokkok az ASM és mindkét nézetben sima makrósorként jelennek meg,
megjegyzésjelölő nélkül (`.print "HELLO"`, `.wait_raster $FF`, `.invoke
setColor(blue)`), és makrószínekkel vannak ellátva; csak a valódi COMMENT
blokkok, régiójelölők és figyelmeztetések tartják meg a bevezető `;`
karakterláncukat.

| Sáv színe       | Leírás                                                                                                                                                                                                                                                                                                             |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Cián            | 6502 assembly forráskód címekkel és címkékkel                                                                                                                                                                                                                                                                      |
| **Monitor**     | Hex / bájt kiíratás (C64 monitor stílus)                                                                                                                                                                                                                                                                           |
| **Diazmus**     | Tiszta 6502 szétszerelés: cím · hex bájtok · feloldott numerikus operandusokkal ellátott mnemonikok. A makrók kibővítve egyedi utasításokra (TEXT → LDA/STA párok, LOOP → LDX, stb.). A BYTE/WORD/FILL adatok darabolt hex dumpként jelennek meg. A kimenetben nincsenek makrónevek, megjegyzések vagy annotációk. |
| **Mindkettő**   | ASM felül, monitor alul                                                                                                                                                                                                                                                                                            |
| **Szétszerelő** | Ugyanaz, mint a Disasm — dedikált fül a szétszerelési nézethez                                                                                                                                                                                                                                                     |

Az összecsukott blokkok csökkentett átlátszósággal jelennek meg. Kattintson vagy
húzzon a minitérkép bármely pontjára, hogy a programlistát az adott pozícióba
görgessen. A nézetablak-jelző (ékezetes színű téglalap) követi a lista látható
részét. Az állapot a felhasználói felület beállításaiban marad meg
(`blockMinimap` billentyű).

### Eszközkészlet fül

- Elágazási/ugrási utasítások esetén (`BNE`, `JMP`, `JSR` stb.) egy
  **címkeválasztó** legördülő menü jelenik meg – kattintson egy definiált
  címkére a beszúrásához.
- A számformátum az eszköztáron található **HEX / DEC** kapcsolót követi (lásd
  az 5. szakaszt).

---

## 5. Beállítások és eszköztár

A jobb oldali panel valós időben mutatja a generált kimenetet.

### Projekt pillanatképek

| Mód               | Leírás                                                                                                                                                                                                                                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **ASM**           | 6502 assembly forráskód címekkel és címkékkel                                                                                                                                                                                                                                                                      |
| **Monitor**       | Hex / bájt kiíratás (C64 monitor stílus)                                                                                                                                                                                                                                                                           |
| **Szétszerelő**   | Tiszta 6502 szétszerelés: cím · hex bájtok · feloldott numerikus operandusokkal ellátott mnemonikok. A makrók kibővítve egyedi utasításokra (TEXT → LDA/STA párok, LOOP → LDX, stb.). A BYTE/WORD/FILL adatok darabolt hex dumpként jelennek meg. A kimenetben nincsenek makrónevek, megjegyzések vagy annotációk. |
| **Mindkettő**     | ASM felül, monitor alul                                                                                                                                                                                                                                                                                            |
| **Eszközkészlet** | C64 referencia panel: 16 színű palettaminta + PETSCII vezérlőkód és nyomtatható karakterfelismerő lap. Csak olvasható – a részletekért lásd az alábbi „Eszközkészlet fül” alszakaszt.                                                                                                                              |

A projekt pillanatképei JSON fájlként, lemezen tárolódnak, nem pedig a
localStorage tárolóban. Az aktuális projektfájlhoz kapcsolódnak, ha létezik
ilyen, így az előzmények az újraindítások után is megmaradnak, és követik a
projektet.

### Alkalmazáson belüli frissítések

**Menü → Frissítések keresése** megkeresi a legújabb kiadást a c64va.tech
oldalon (beolvassa a platformod letöltési linkjeit), és összehasonlítja a futó
verzióval:

| Szakasz     | Mi történik?                                                                                                                                                                         |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Ablakok** | A telepítő passzív módban fut (csak folyamatban lévő műveletek), és a befejezése után elindítja az új verziót. A gépenkénti telepítés rendszergazdai jogosultságokat (UAC) kér.      |
| **macOS**   | A DMG csatolásra kerül, az alkalmazáscsomag a helyére kerül, majd elindul az új verzió. Ha az alkalmazásmappa nem írható, a DMG egyszerűen megnyílik, így áthúzhatja az alkalmazást. |

A letöltés után az alkalmazás telepíti a frissítést, majd újraindul:

### Információk és kimeneti beállítások fordítása

- A **Fordítási info** (a kimenet felett) a lefordított program összefoglalását
  mutatja: a kód kezdőcímét, méretét és a BASIC SYS csonkot.
- A program kezdőcímét egy **ORG** blokk állítja be (`* = $C000`): az első ORG a
  betöltési cím, a további ORG-k további szekciókat indítanak más címeken.
- A kimeneti beállítások a **Beállítások → Általános → ASM kimenet** menüpontban
  találhatók: **Makró forrása** (a MACRO…ENDM makródefiníciók a forrásukat
  jelenítik meg az ASM nézetben), **Régió megjegyzések megjelenítése**,
  **Memóriaátfedések megjelenítése** és **Memória panel megjelenítése**.
- A RetroDebugger jelzők (`-jmp`, `-unpause`, `-wait`) a **Beállítások →
  Általános → RetroDebugger** menüpontban találhatók — lásd: [Debugger
  jelzők](#debugger-flags).

### Projekt sablonok

**Menü → Fájl → Új projekt sablonból…** — vagy az eszköztár gombja a **Menü** és
az **Oktatóanyagok** között — megnyitja a sablon párbeszédpanelt:

### Építési projekt

Az **Menü → Build → Build project** parancs egyetlen lépésben lefordítja a
teljes projektet. A megnyitott `.proj` projekt fájljai kerülnek felépítésre –
vagy projekt nélkül a megnyitott fájl fülek:

- minden felépíthető forráskód (`.asm`, `.json` blokk, `.ub`) egy `.prg`
  **fájllá fordul a forráskódja mellett** fájlnévvel; a **Run with Exomizer**
  engedélyezésével a kimenet feldolgozásra kerül;
- Az **ASM exportálása** (Program menü) továbbra is a tiszta forrásszöveget
  másolja **sorszám előtagok nélkül**.

### Példaprogramok

**Menü → Példák…** megnyitja a példa böngészőt: a beépített példaprogramok
témakörök szerint csoportosítva (Alapok, Makrók és vezérlési folyamat, Grafika,
Sprite-ok és bevitel, Fájlok és betöltés, Zene, IRQ és hardver) két oszlopban.

- **Run** (VICE, D64, C64 Ultimate, Kung Fu Flash 2) — a PRG megépítése és
  elindítása.
- **Debug** — a PRG felépítése és a RetroDebugger elindítása.
- **Projekt**, **D64** és **Exomizer** csomagolás.

A sáv alatti sor megnevezi a futó lépést a fájllal együtt — például *Kick:
main.asm előfeldolgozása (14 fájl)…*, *VMA (Rust): main.asm fordítása…*, *PRG
kész: 2061 bájt a $0801 fájlból*, *Exomizer: …* tömörítése, *VICE: …[X242X
indítása]. A modális ablak automatikusan bezárul, ha a művelet befejeződik vagy
sikertelen.

---

## UltimateBasic mód

| Ellenőrzés                                                                                   | Leírás                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Számrendszer (HEX / DEC / BIN)**                                                           | Beállítja az operandusok megjelenítési/beviteli formátumát a felhasználói felületen. A BIN mód bináris formátumban jeleníti meg az értékeket `%` előtaggal (pl. `%11111000`). Az ASM nézet mindig minden blokkot a saját formátumában jelenít meg.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Nyelv**                                                                                    | Váltson a felhasználói felület angol, magyar, spanyol, német, holland (holland), lengyel és olasz között (**Menü → Beállítások**)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Téma**                                                                                     | Világos / Sötét / OLED / Fekete / Commodore 77 / Commodore Starlight / Commodore Beige / Commodore 64 — válasszon a témaválasztóból a **Menü → Nézet** menüpontban. Az OLED tiszta fekete hátteret használ az AMOLED kijelzőkhöz. A Commodore 77 egy neonsárga-fekete téma; amikor ez az aktív téma, az indítópanel a téma panelszínét használja (megfelel az üzenetkártyának), egy kisebb, dedikált Commodore 77 logót és egy sárga folyamatjelző sávot jelenít meg. A Commodore Starlight egy világos téma, amely az áttetsző C64 kenyértartó utánzatot követ: matt üvegpanelek, amelyeken szivárványos RGB fény világít, bíborvörös díszítéssel, szivárványos szintaxisszínekkel és füstös sötét monitorképpel. A Commodore Beige a klasszikus kenyértartó: bézs színű ház, mustársárga funkcióbillentyűk, szivárványos jelvénycsíkok és C64 kék képernyő a monitor nézetéhez. A kiválasztott témát a következő indításkor az első festés előtt alkalmazzák. |
| **CRT retró mód**                                                                            | Teljes képernyős CRT szűrő ki-/bekapcsolása: pásztázási vonalak, foszforvignettálás, villogás és hordótorzítás. Az állapot a munkamenetek között mentésre kerül.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Memória panel megjelenítése**                                                              | Globális kapcsoló (**Beállítások → Általános → ASM kimenet**), amely megjeleníti vagy elrejti a teljes C64 memóriapanelt                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **ALAP RENDSZER csonk**                                                                      | (**Beállítások → Általános → Program**) Egy BASIC sor elé illeszti a program eredetét (az első ORG-ot), amely a SYS-t hívja meg. Az első ORG-nál lejjebb elhelyezett szegmens a saját címén marad. Amikor a program a BASIC sor alatt vagy azon túl töltődik be (`$0801`–`$080C`, például egy importált memóriakép a `$071C`-ből), a Futtatás és a Fordítás parancs egy kis indító betöltőt ad hozzá: `SYS 2061` egy mozgatófájlt másol a szalagos pufferbe (`$033C`), amely a helyére teszi a programot, és az első ORG-ra ugrik.                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Példák…**                                                                                  | Nyisd meg a példa böngészőt, és tölts be egy beépített példa programot — lásd: [Példa programok](#example-programs)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Nagyítás / Kicsinyítés**                                                                   | A blokk felhasználói felületének skálázása (az összes blokkelemet érinti)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Program mentése** (`Menü → Fájl`)                                                          | Az aktuális fül mentése: egy blokkprogram `.json` fájlként, egy forrásfájl (`.asm`, `.s`, `.inc` …) sima szövegként (a Ctrl+S ugyanezt teszi)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Program mentése más néven** (`Menü → Fájl`)                                                | Ugyanaz, minden alkalommal új fájl párbeszédpanellel                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Program betöltése** (`Menü → Fájl`)                                                        | Töltsön be egy korábban mentett programot                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Munkaterület mentése**                                                                     | Mentse el a jelenleg megnyitott, fájllal védett lapok pontos készletét – beleértve az aktív lapot és az egyes lapok szerkesztőmódját (Blokk/Szakértő/Ultimate Basic) – egy `.vaws` munkaterület-fájlba.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Munkaterület mentése más néven**                                                           | Az aktuális munkaterület mentése minden alkalommal új fájl párbeszédpanel használatával                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Munkaterület megnyitása**                                                                  | Zárja be az összes megnyitott lapot, és nyissa meg újra a `.vaws` munkaterület-fájlban tárolt fájlokat.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Munkakönyvtár beállítása**                                                                 | Válassza ki a fájlválasztók és a mentési párbeszédpanelek által használt alapértelmezett mappát. Az elérési út az alkalmazás konfigurációjában tárolódik, és a menü előnézetei láthatóvá teszik az elérési út végét.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Új projekt sablonból…** (`Menü → Új projekt`, vagy az eszköztár gombja a **Menü** mellett) | Hozz létre egy új `.proj` projektet egy Visual Assembler, ACME vagy UltimateBasic sablonból a saját mappádban — lásd: [Projektsablonok](#project-templates)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Projekt megnyitása** (`Menü → Fájl`)                                                       | Nyisson meg egy többfájlos `.proj` projektet, és nyissa meg az összes forrásfájlt fülként.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Projekt mentése** (`Menü → Fájl`)                                                          | Mentsd el az aktuális `.proj` projektet (a projekt panelnek nyitva kell lennie)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Projekt bezárása** (`Menü → Fájl`)                                                         | Bezárja a jelenleg megnyitott projektet és az összes fájlfülét. Rákérdez a nem mentett változtatások mentésére. A projektpanel visszaáll üres állapotába.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ** .asm fájl betöltése** (Szakértői eszköztár)                                               | Megnyit egy `.asm` fájlt szakértői módban egy új lapon.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Programcsomag** létrehozása (`Menü → ` létrehozása)                                        | Exportálja a lefordított bináris fájlt `.prg` fájlként                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **D64 építése** (`Menü →` építése)                                                           | Csomagolja be a programot és a további fájlokat egy `.d64` lemezképbe — lásd: [Exportálás D64-be párbeszédpanel](#export-to-d64-dialog)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **CRT építése**                                                                              | Exportáld a programot 64K-s Magic Desk (`.crt`, kazettatípus 19) fájlként. Lásd: [12b. szakasz](#12b-crt-export-magic-desk-64k-cartridge).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Projekt létrehozása** (`Menü → Építés`)                                                    | Fordítsd le a projekt (vagy a megnyitott lapok) összes összeállítható fájlját egy `.prg` fájlba a forráskódja mellett — lásd: [Projekt összeállítása](#build-project)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Futtatás (felosztó gomb)**                                                                 | A fő **▶ Futtatás** gomb futtatja az aktuális módot; kattintson az **▾** nyílra a következők közötti váltáshoz: **Futtatás PRG-ként** (a VICE közvetlen fordítása és indítása), **Futtatás D64-en keresztül** (.d64 lemezképbe csomagolni és VICE-ot indítani), **Futtatás hardveren** (PRG küldése C64 Ultimate / 1541 Ultimate eszközre), **D64 hardveren** (D64 küldése ugyanarra az eszközre), vagy **Kung Fu Flash 2** (PRG feltöltése USB-n keresztül egy valódi C64/C128-ra egy Kung Fu Flash 2 kazettával). Lásd a [12. szakasz](#12-d64-export--run) és a [13. szakasz](#13-settings) részeket.                                                                                                                                                                                                                                                                                                                                                        |
| **Hibakeresés (RetroDebugger)**                                                              | Fordítás és indítás a RetroDebuggerben töréspontokkal, szimbólumokkal és automatikus indítási jelzőkkel (lásd: [10. szakasz](#10-debugger-integration))                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Futtatás az Exomizerrel**                                                                  | Jelölőnégyzet a **Beállítások → Általános → Program** menüpontban — ha engedélyezve van, akkor az összes Futtatás és Összeállítás művelet a PRG-t az `exomizer sfx` parancson keresztül futtatja indítás vagy mentés előtt (`sfx basic` egy BASIC sorral kezdődő PRG esetén, így a RUN a program visszatérése után újra működik; `sfx $<betöltési cím>` egyébként). Működik a Futtatás PRG-ként, Futtatás D64-en keresztül, Futtatás hardveren, PRG összeállítása és D64 összeállítása paranccsal. Először konfigurálja az Exomizer futtatható fájlját a **Beállítások → Fájlok és elérési utak** menüpontban.                                                                                                                                                                                                                                                                                                                                                  |
| **Automatikus automatikus mentési bejegyzések**                                              | Jelölőnégyzet a **Beállítások → Általános → Verziókövetés** menüpontban. Ha engedélyezve van, az alkalmazás körülbelül 2,5 másodperccel a fül szerkesztésének befejezése után automatikusan mentésre kerül a verzióelőzményekbe (egy projekt füle esetén a projektelőzményekbe is). Kapcsold ki, ha csak a saját commitjaidat szeretnéd. Lásd: [Verziókövetés]{1].                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Beállítások** (korábban Hardverbeállítások)                                                | Nyisd meg a beállítások párbeszédpanelt három füllel: **Általános** (assembler mód, VMA fordító, BASIC SYS csonk, Exomizer, frissítések, ASM kimenet, SID előnézet, hibakereső paraméterek, verziókövetés), **Fájlok és elérési utak** (VICE, RetroDebugger, ACME, Exomizer, git) és **Integrációk** (C64 Ultimate, Kung Fu Flash 2). Lásd: [13. szakasz](#13-settings).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Új program…** (`Menü → Program`)                                                           | Megnyit egy megerősítő párbeszédpanelt, majd törli az összes blokkot a programterületről.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **ASM exportálása** (`Menü → Programozás`)                                                   | A generált assembly forráskód másolása                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Összes összecsukása**                                                                      | Összes blokk összecsukása                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Rólunk**                                                                                   | Verzióinformáció                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Újdonságok**                                                                               | Változásnapló                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Tudásbázis**                                                                               | Referencia linkek (6502 opkódok, C64 KERNAL, memóriatérkép, színek)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Frissítések keresése**                                                                     | Nézd meg a c64va.pro oldalt egy újabb verzióért, és töltsd le / telepítsd – lásd: [Alkalmazáson belüli frissítések](#in-app-updates)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

### Verziókövetés

Minden fülnek megvan a saját verzióelőzménye, mint egy kis git repositorynak;
egy megnyitott `.proj` projekthez tartozó fül is verziózható egy egész
projektként (lásd [Projekt mód](#project-mode)). A **Menü → Verziókezelés →
Verziókövetés…** (vagy **Kommit…**) megnyitja a párbeszédablakot; a
**Változtatások elvetése (vissza a HEAD-be)** közvetlenül visszaállítja az
utolsó commitot.

A szokásos munkafolyamat: írj egy **commit üzenetet** és nyomd meg az **Commit**
(vagy Ctrl+Enter) billentyűkombinációt → folytasd a szerkesztést → nyomd meg az
**Diff** billentyűkombinációt, hogy lásd, mi változott → commit újra.

- **Commit** — elmenti a fül aktuális állapotát az üzeneteddel együtt. Minden
  commit egy rövid hash-t kap (például `1bd55ba`); a legújabb a **HEAD**.
  Változatlan commit, mivel a HEAD nem jön létre.
- **Állapotsor** — *Nincs mit véglegesíteni, folyamatban van a fa tisztítása*
  vagy *Nem véglegesített változtatások a(z) `<hash>`* óta.
- **Diff** — a HEAD óta bekövetkezett változások; a naplóbejegyzés **Diff**
  gombja összehasonlítja az adott verziót a szerkesztővel. A hozzáadott sorok
  zöldek, az eltávolított sorok pirosak, a fejléc pedig **+N / −M** feliratot
  mutat. A blokk módú programok összeszerelési sorokként (blokkonként egy sor),
  szakértői forrásként soronként, Ultimate Basic fülekként hasonlíthatók össze
  forrásuk szerint, így a JSON-ként mentett blokk módú projekt továbbra is
  olvasható változtatásokat mutat. A forrásfájl (`.asm`, `.s`, `.inc` …)
  szövegként tárolódik, így a verzió forrásfájl marad.
- **Checkout** — betölti az adott verziót a szerkesztőbe. A lemezen lévő fájl
  csak mentéskor változik; a **Discard changes** visszakerül a HEAD-be.
- **Automatikus mentésű bejegyzések** — a **Beállítások → Általános →
  Verziókövetés → Automatikus automatikus mentésű bejegyzések menüpontban a
  verziókövetésben** az alkalmazás körülbelül 2,5 másodperccel a szerkesztés
  befejezése után hozzáad egy bejegyzést. Ezek az *automatikus mentés*
  jelöléssel vannak ellátva; az utolsó 20 bejegyzés marad meg, legfeljebb 100
  véglegesítés mellett.
- A párbeszédablak a fejlécével mozgatható; ugyanott újra megnyílik, és az
  **Esc** billentyűkombinációval vagy a bezárás gombbal zárható be (a külső
  kattintás nem zárja be).
- A projekt előzményei a projektfájl mellett tárolódnak
  `<project>.snapshots.json` néven (az alkalmazáskonfigurációs mappában, amíg a
  projektet el nem mentik), így az újraindítások után is fennmaradnak. A korábbi
  verziók által készített pillanatképek véglegesítésként jelennek meg.

#### Projekt mód

Amikor a fül egy megnyitott `.proj` projekthez tartozik (Expert vagy Ultimate
Basic projekt panel), a párbeszédpanel fejléce egy **Fájl / Projekt** kapcsolót
jelenít meg; alapértelmezés szerint a **Projekt** van kiválasztva. A projekten
kívüli fülek megőrzik a fent leírt fájlonkénti előzményeket.

- Az **Commit** egyetlen bejegyzésben rögzíti a projekt összes forrásfájlját: a
  projektfa fájljait, valamint az általuk tartalmazott szövegfájlokat
  (`.include`, `include`, `#import`, `!source`, Block-mode INCLUDE blokkok). A
  megnyitott lapok az aktuális, akár nem mentett tartalmukkal számolódnak; a
  többi fájl a lemezről kerül beolvasásra. A projektfa bináris fájljai
  (betűtípusok, `.koa`, `.bin`, `.sid` …, egyenként legfeljebb 1 MB méretben) is
  rögzítésre kerülnek; a különbségük mutatja a méretváltozást, a **Checkout**
  pedig közvetlenül visszaírja őket a lemezre.
- A napló mutatja a véglegesítési üzenetet, a rövid hash-t és az egyes
  bejegyzések **módosított fájljait** (**A** hozzáadva, **M** módosítva, **D**
  eltávolítva).
- Az **Diff** fájlonként működik: minden módosított fájlhoz saját fejléc és
  tömbök tartoznak.
- A **Változtatások elvetése** parancs ugyanígy visszalép az utolsó projekt
  commitjára (HEAD).
- A **Checkout** (megerősítés után) betölti az adott verzió összes fájlját a
  szerkesztőbe: a megnyitott lapok frissülnek, a hiányzó fájlok új lapként
  nyílnak meg. Semmi sem kerül lemezre, amíg nem mented el; az adott verzió óta
  a projekthez hozzáadott fájlok változatlanok maradnak.
- Az automatikus mentési bejegyzések projekt szinten is készülnek.
- A projekt előzményei a projektfájl mellett tárolódnak
  `<project>.proj.history.json` néven.
- **Git** módban a napló a teljes repositoryt mutatja az egyes commitok
  módosított fájljaival együtt (`git log --name-status`); egy bejegyzés **Diff**
  parancsa fájlonként mutatja a commit fájlokat, a **Diff** gomb összehasonlítja
  a HEAD értéket a szerkesztőben lévő projektfájlokkal (a **RAW** a repository
  `git diff HEAD` értéke). A **Commit** elmenti az összes nem mentett
  projektfület és előkészíti az összes módosítást (`git add -A`); a **Checkout**
  betölti az adott commit projektfájljait a szerkesztőbe.

#### Git

Ha a `git` telepítve van, ugyanaz a párbeszédablak működhet egy valódi git
repositoryval.

- **Beállítások → Fájlok és elérési utak → git** / **Beállítások → Általános →
  Verziókövetés:** **Válassza a git.exe…** vagy az **Automatikus észlelés**
  lehetőséget (a PATH-ban és a szokásos telepítési mappákban keres); az alábbi
  sor a git verzióját mutatja. **Git használata, ha a projekt egy tárolóban
  van** (alapértelmezés szerint bekapcsolva) automatikusan Git módba kapcsolja a
  párbeszédpanelt a tárolóban lévő fájlok esetén. A **Beépített / Git** kapcsoló
  a párbeszédpanel fejlécében manuálisan módosítja a módot.
- A fejléc az **↑** (push végrehajtása) és az **↓** (pull végrehajtása) ágat
  mutatja, majd a repository módosított fájljai.
- A **Commit** először menti a fájlt, csak ezt a fájlt készíti elő (vagy minden
  módosítást a **Steme all changes (git add -A)** paranccsal), majd lefuttatja a
  `git commit` parancsot.
- A napló felsorolja a fájl commitjait az ágaikkal és címkéikkel együtt. Egy
  bejegyzés **Diff** gombja összehasonlítja a commitot a szülőjével; az **Diff**
  gomb összehasonlítja a HEAD-et a szerkesztővel, a nem mentett változtatásokkal
  együtt. A projektfájlok összehasonlítása ugyanúgy történik, mint a beépített
  módban; az **RAW** a sima `git diff`-et mutatja.
- A **Checkout** betölti az adott commit fájlját a szerkesztőbe (`git show`) a
  lemez megérintése nélkül.
- **Pull** (`--ff-only`), **Push** (az első push beállítja az upstreamet az `-u
  origin <branch>` paranccsal) és **Create repository (git init)** paranccsal,
  ha a mappa még nem repository.
- A git konzolablak nélkül fut, és soha nem kér jelszót: a hitelesítő adatoknak
  hitelesítőadat-kezelőből vagy SSH-kulcsból kell származniuk, ellenkező esetben
  a hibaüzenet megjelenik a párbeszédpanelen.

### Szerkesztőeszközök

**Menü → Frissítések keresése** megkeresi a legújabb kiadást a c64va.pro oldalon
(beolvassa a platformod letöltési linkjeit), és összehasonlítja a futó
verzióval:

- szintaxiskiemelések az aktuális Ultimate Basic nyelvi referencia alapján;
- a hosszú fájlokkal szinkronban maradó sorszámok;

A Szétszerelés panel tartalmaz egy **Másolás** gombot, amely a teljes
megjelenített forráskódot a vágólapra másolja. A parancssúgó a mellékelt
fordítót követi: például az `sprite_frame id, data_address [, frame]` parancs
egy animációs képet választ ki egymást követő 64 bájtos sprite képkockák közül.

| Platform    | Mi történik?                                                                                                                                                                            |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Ablakok** | A telepítő passzív módban fut (csak folyamatban lévő műveletek), és a befejezése után elindítja az új verziót. A gépenkénti telepítés rendszergazdai jogosultságokat (UAC) kér.         |
| **macOS**   | A DMG csatolásra kerül, az alkalmazáscsomag a helyére kerül, majd elindul az új verzió. Ha az alkalmazásmappa nem írható, a DMG egyszerűen megnyílik, így áthúzhatja az alkalmazást.    |
| Linux       | Egy AppImage fájl kicserélődik az újra. Egy `.deb` / `.rpm` telepítés frissül a `pkexec` fájllal (jelszót kér a rendszer); a `pkexec` nélkül a csomag a szoftvertelepítőben nyílik meg. |

A parancslista magassága szándékosan korlátozott, így a parancsrészletező kártya
kitöltheti a panel fennmaradó magasságát. A részletes terület külön görgethető a
hosszabb szintaxisleírásokért.

**Frissítési szerver:** **Beállítások → Általános → Frissítések → Frissítési
szerver** beállítja, hogy hol keressenek a kiadásokat (alapértelmezett:
`https://www.c64va.pro/`); a telepítőket a `<szerver>letöltések/VA/` címről
olvassa be. A címnek `https://` címet kell használnia (sima `http://` csak a
`localhost` esetén, tesztelés céljából); az **Alapértelmezett** címre áll
vissza, ahol a c64va.pro található.

### Ingyenes és nyílt forráskódú

A Visual Assembler ingyenes: minden funkció – a vizuális szerkesztők (SID,
Sprite, Char, Charset, Hi-Res, Map, Level, D64, Curve), a SID Player, a **Build
PRG**, **Build D64**, **Build CRT**, **Build project**, az Exomizer csomagolás,
a C64 Ultimate és a Kung Fu Flash 2 rendszereken való futás, valamint minden
felhasználói felület nyelve és témája – regisztráció vagy sorozatszám nélkül
működik. A forráskód a GNU General Public License v3.0 alatt érhető el (lásd:
**Menü → Névjegy**). A 2.5.9-es verzióig az alkalmazás Freemium / Professional
felosztással rendelkezett; a 2.6.0 óta egyszerűen nincs szükség sorozatszámra.

Ha tetszik a program, adománnyal támogathatod a fejlesztését: **Menü → Adomány**
(a Nézet alatt) megnyitja a c64va.pro adományozási oldalát, ahol PayPal-on
keresztül tetszőleges összeget adományozhatsz.

**Használati statisztikák.** Naponta legfeljebb egyszer, indításkor az
alkalmazás névtelen ping üzenetet küld a c64va.pro oldalra, amely tartalmazza az
alkalmazás verzióját, az operációs rendszert, a felhasználói felület nyelvét, az
indítások számát és az utolsó ping óta aktív percek számát (egy perc akkor
számít, ha az ablak látható, és az elmúlt 5 percben használta az egeret vagy a
billentyűzetet), azt, hogy van-e még tárolva 2.5.6–2.5.9 közötti sorozatszám
(csak igen / nem), és egy véletlenszerű telepítési azonosítót (az alkalmazás
`config.json` fájljában tárolva `launchPing` néven). Nem kerül elküldésre e-mail
cím, sorozatszám, projekt vagy forráskód; offline semmi sem történik. Az
alkalmazás időnként rövid üzeneteket is kér a c64va.pro oldalról (például egy új
verzióról, néha csak a támogatóknak); minden üzenet egyszer jelenik meg.

### Hiba jelentése

**Menü → Hiba jelentése** megnyit egy űrlapot, amely közvetlenül a fejlesztőnek
küldi el a jelentést.

- Az **Összefoglaló** és a **Mi történt?** mezők kitöltése kötelező – írd le,
  mit tettél, mit vártál, és mi történt ehelyett. Az **Email cím** megadása
  opcionális; add meg, ha választ szeretnél.
- **Képernyőképek:** maximum 4 kép a **Kép hozzáadása…** paranccsal,
  beillesztéssel a **Ctrl+V** billentyűkombinációval (például Win+Shift+S után)
  vagy az űrlapra húzással. A nagy képek mérete 1920 pixelre van kicsinyítve.
- **Rendszerinformációk és legutóbbi hibák hozzáadása** (alapértelmezés szerint
  bekapcsolva) hozzáadja az alkalmazás verzióját, az operációs rendszert, a
  nyelvet, a témát, a szerkesztőt és a futási módot, a képernyőméretet, a
  blokkok számát és a legutóbbi alkalmazáshibákat. **Mi kerül elküldésre?**
  megjeleníti az adatokat. A forráskód nem kerül elküldésre.
- A **Jelentés küldése** a jelentésszámmal erősíti meg a műveletet. A
  **E-mailben küldés** ehelyett a levelezőprogramot nyitja meg.

### Támogatás

A **Menü → Támogatás** menüpontban cseveghet a fejlesztővel: írjon egy kérdést,
ötletet vagy problémát, és nyomja meg a **Küldés** (vagy a **Ctrl+Enter**)
gombot. Legfeljebb 3 fájlt csatolhatsz (összesen 4 MB): képeket, forrásfájlokat
(`.asm`, `.ub`, `.txt` …), C64 fájlokat (`.prg`, `.d64`, `.sid`, `.crt` …) vagy
egy `.zip` fájlt — a **Fájl csatolása…** paranccsal, beillesztéssel (**Ctrl+V**)
vagy az ablakra húzással. A válasz ugyanabban az ablakban jelenik meg, szintén a
fájlokkal együtt: a képek előnézetként jelennek meg, egy kattintással menthető a
fájl. Az ablak nem modális: a fejlécénél fogva húzd át, méretezd át a jobb alsó
sarkából, és folytasd a munkát, amíg meg van nyitva. Az alkalmazás indításkor és
percenként ellenőrzi a válaszokat; egy új válasz rövid sípoló hangot ad (az
ablak fejlécében található hangszóró gomb elnémítja), felvillantja a tálca
ikont, amikor az alkalmazás a háttérben van, egy piros pontot jelenít meg a
**Menu** gombon, és egyszer megnyitja az ablakot. Miután beszélgetést
folytattál, a **Menu** gomb melletti boríték ikon megnyitja azt; pirosra vált,
és villog az olvasatlan válaszok számával. Az üzenet melletti **×** ikon törli
az adott üzenetet, az ablak fejlécében található kuka gomb pedig a teljes
beszélgetést törli a mellékleteivel együtt (szintén a fejlesztő számára;
mindkettő kérdezzen rá először). Az e-mail cím megadása opcionális: ha megadsz
egyet, a válasz is e-mailben érkezik meg. A beszélgetés az alkalmazás
véletlenszerű telepítési azonosítójához van kötve, így nincs fiók és nincs
jelszó.

### Projektek, lapok és indítófájlok

Az Ultimate Basic projektek `.proj` fájlokat használnak, és több `.ub` forrást
is tartalmazhatnak. A Projekt panel listázza a megnyitott fájlokat, megjelöli a
nem mentett lapokat, és megjeleníti a felfedezett címkéket, függvényeket és
alprogramokat. A Projekt műveletek lehetővé teszik egy projekt létrehozását,
megnyitását, mentését és bezárását, vagy egy másik forrásfájl hozzáadását. Egy
új projekt UltimateBasic sablonból is indulhat – lásd: [Projektsablonok]{1].

- **Fájl hozzáadása** — egy vagy több fájl kiválasztása egyszerre (bármilyen
  típus — `.ub`, `.bin`, `.prg`, képek, betűtípusok stb.). Az `.ub` források
  szintén szerkesztőfülként nyílnak meg; minden más csak referenciaként kerül
  hozzáadásra, hogy az `incbin`/`loadfile` eszközök a projekttel együtt
  utazhassanak.
- **Mappa hozzáadása** — egy teljes mappára hivatkozik (pl. egy `incbin`
  eszközkönyvtárra, mint például a `fonts/`), hogy az továbbra is a projekthez
  legyen társítva.
- Csak azok a fülek kerülnek mentésre a munkaterületre, amelyek mögött egy
  valódi fájl található a lemezen; egy nem mentett mintát vagy csak memóriában
  tárolt programot tartalmazó fülnek nincs mit megőriznie, és kimarad
  (értesítést küld, ha egyik nyitott fül sem felel meg a feltételeknek).
- Egy munkaterület megnyitása először az összes aktuálisan megnyitott lapot
  bezárja – a folytatás előtt megerősítést kér a rendszer.
- Ha egy munkaterület egy azóta áthelyezett vagy törölt fájlra hivatkozik, a
  bejegyzés kimarad, és a betöltés után név szerint jelenik meg.
- A megnyitott Expert és Ultimate Basic **projektek** is mentésre kerülnek: a
  projektfa (beleértve a nem mentett hozzáadásokat és eltávolításokat), az
  indítófájl és az `.proj` mentési célhely a munkaterülettel együtt visszakerül.
  A régebbi verziók által mentett munkaterületek ezek nélkül nyílnak meg.

### Memóriaablak és nulla oldalhasználat

A **Full C64 memory** panel lebeghet: a fejlécében található **undlock** gomb
egy különálló, nem modális ablakba helyezi át, amelyet húzással átméretezhet a
szerkesztés közben (az átfedés jelvénye is vele jár). A **Dock** (vagy × / Esc)
visszahelyezi. Az ablak megjegyzi, hogy le volt-e választva, és a méretét.

Amikor a program eléri a nulladik oldalt, a memóriatérkép tetején megjelenik egy
**Zero page usage** szakasz: egy 16 × 16-os rács `$00–$FF`, területenként
színezve — CPU port (`$00–$01`), szabad (`$02`, `$FB–$FE`), BASIC (`$03–$8F`,
`$FF`) és KERNAL (`$90–$FA`). A használt cellák feltöltődnek; Egy keret jelöli
az **írás** parancsot, egy sraffozás pedig az **mutatót** (`(zp),Y` / `(zp,X)`)
parancsot. Kattintson egy használt cellára, hogy lássa, mely sorok érik el
(kattintson egy sorra az odaugráshoz), és egy figyelmeztetést, amikor a BASIC
vagy KERNAL területre ír.

Ha a program tartalmazza a SID Editor exportált lejátszóját (`sid_` címkék),
akkor a lejátszó nulla oldala (`$02–$1C`, `$2F`, `$FB–$FD`) is megjelölésre
kerül, és minden olyan cím, amelyet a saját kódod is használ, **ütközésként**
jelenik meg (piros keret, figyelmeztetés a fejlécben).

### Épület és diagnosztika

**Menü → Új projekt → Új projekt sablonból…** — vagy az eszköztár gombja a
**Menü** és az **Oktatóanyagok** között — megnyitja a sablon párbeszédpanelt:

1. Válasszon egy szakaszt felül: **Visual Assembler**, **ACME** vagy
   **UltimateBasic** (a párbeszédpanel az aktuális szerkesztőmódnak megfelelő
   szakaszon nyílik meg). Az **ACME** szakasz csak akkor jelenik meg, ha egy
   működő ACME van beállítva a **Beállítások → Fájlok és elérési utak → ACME**
   menüpontban.
2. a fordítási hibák pirossal jelennek meg;
3. a középre igazított fordítási párbeszédpanel megjeleníti a hibát;
4. A forrássort tartalmazó hibák esetén válassza ki az adott sort az aktív UB
   szerkesztőben.

| Szakasz                   | Beépített sablonok                                                                                                                                                                                                               |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Vizuális összeszerelő** | Üres program, Üres játék (cím / lejátszás / játék vége állapotok, joystick, játékos sprite), Hires bitkép, Többszínű bitkép, Sprite multiplexer (16 sprite Y betűvel rendezve képkockánként, raszteres IRQ lánccal megjelenítve) |
| **ACME**                  | Üres ACME projekt, Raszter IRQ, Sprite multiplexer (16 sprite)                                                                                                                                                                   |
| **Végső Alapszintű**      | Üres program, Üres játék (ugyanaz az állapotgép az UB-ben), Bitmap felbérelése (`line` / `rect` / `circle` `color pen`-szel), Raszter IRQ (a `sub` minden képkockát meghív a raszter megszakításból)                             |

A projekt a saját mappájában jön létre: `<hely>/<név>/<név>.proj` plusz
`main.asm` (Visual Assembler vagy ACME) vagy `main.ub` (UltimateBasic, az
`.proj` Ultimate Basic projektként van megjelölve). Egy ACME projekt `.proj`
fájlja rögzíti az ACME assemblert, és létrehozásakor a **Beállítások → Általános
→ Assembler mód** átvált ACME módba (egy Visual Assembler projekt visszavált VMA
módba). Egy meglévő projekt soha nem kerül felülírásra – ehelyett a
párbeszédpanel jelzi. A megnyitott lapok először bezáródnak (a rendszer rákérdez
a nem mentett változtatásokra), majd az új projekt megnyílik Expert módban vagy
Ultimate Basic módban, láthatóvá téve a projektpanelt, és a fő fájlt állítva be
indítófájlként.

**Saját sablonok:** **Saját sablonok mappa** (a párbeszédpanel bal alsó
sarkában) megnyitja a felhasználói sablonok mappáját az alkalmazáskonfigurációs
könyvtárban. Minden oda helyezett `.asm` vagy `.ub` fájl megjelenik a megfelelő
részben (egy `.asm` egy `; @assembler acme` fejlécsorral az **ACME** mappába
kerül) (a *Saját sablonok* alatt, kivéve, ha kategóriát nevez meg). A sablon egy
közönséges forrásfájl, amelynek tetején opcionális fejléc vagy megjegyzéssor
található — `;` az assemblerben, `#` az Ultimate Basicben:

```asm
; @name Rasztersávok
; @name.hu Rasztercsíkok
; @category Effektek
; @desc Két rasztersáv a szegélyben.
; @order 50
```

Az `@name`, `@category` és `@desc` fájloknak lehetnek nyelvenként eltérő
változatai (`@name.hu`, `@desc.de`, …); az `@order` rendezi a listát. A fejléc
utáni összes elem lesz az új fő fájl, és az `{{PROJECT}}` helyére a projekt neve
kerül (használd megjegyzésben, hogy maga a sablon továbbra is leforduljon).

### Oktatóanyagok és a leckeszerkesztő

Az **Oktatóanyagok** ablak mappák szerint listázza a bemutatókat és a leckéket.
A lista alján található **Leckeszerkesztő…** gomb (és a saját leckéknél a
**Lecke szerkesztése**) megnyitja a **Leckeszerkesztőt**, amely lépésről lépésre
haladó leckéket készít, például a "Build: Az első szöveges programod" című részt
a saját kódodból:

1. Írd meg a programot a Blokk vagy az Expert szerkesztőben.
2. A Leckeszerkesztőben nyomd meg a **Lépések az aktuális programból** gombot.
   Minden sor a tanuló lépéseit adja meg: válaszd ki a mnemonikus elemet (egy
   rossz előre ki van választva), írd be az operandust, nyomd meg az
   **Hozzáadás** gombot. Ahol a paletta nem tud mindent beállítani (például egy
   SZÖVEG pozíciót), a **Paraméterek beállítása** lépés az új blokkra mutat, és
   akkor ugrik tovább, ha egyezik.
3. Adj címet, leírást, nehézségi szintet és **mappát** (bármely Oktatóanyagok
   kategória). Add hozzá a **szöveges lépéseket** magyarázatokhoz, opcionálisan
   az ablak egy részére mutatva (paletta, programpanel, ASM nézet, Futtatás
   gomb, memóriatérkép). Hagyd üresen a lépés címét vagy magyarázatát a
   létrehozott szöveghez.
4. **Próbáld ki a leckét** (törli az aktuális programot), majd **Mentsd el a
   leckét** (Ctrl+S).

A szövegek az aktuális felhasználói felület nyelvén lesznek mentve; egy másik
nyelvet használó diák ezeket látja, vagy a létrehozott szöveget, ahová Ön nem
írt semmit. A **Makróparaméterek automatikus kitöltése** kihagyja a
paraméterlépéseket a diák számára. A **Fájlok ▾** leckéket hoz létre, töröl,
exportál és importál `.vatut` fájlokként, és megnyitja a leckék mappáját.

#### Online órák

Az **Online leckék…** az Oktatóanyagok ablakban felsorolja a www.c64va.pro
oldalon közzétett leckéket a mappájukkal, nehézségükkel és lépésszámukkal
együtt. A **Letöltés** beilleszti a leckét a saját mappájába az Oktatóanyagok
listában; az **Frissítés** akkor jelenik meg, ha a webhelynek újabb verziója van
(a Leckeszerkesztő minden mentéskor frissíti a lecke módosításait). Saját leckéd
megosztásához használd a **Fájlok ▾ → Feltöltés a c64va.pro…** menüpontot a
Leckeszerkesztőben: add meg a neved (szerzőként jelenik meg), és opcionálisan
egy e-mail címet és egy megjegyzést. A leckét először átnézzük; jóváhagyás után
mindenki online leckéinek listájában megjelenik. Az e-mail címed soha nem kerül
nyilvánosságra.

### Futás, D64 és Exomizer

A fő **Futtatás** gomb minden normál célhelyen támogatja az Ultimate Basic-et:

- minden felépíthető forráskód (`.asm`, `.json` blokk, `.ub`) egy `.prg` **
  fájllá fordul a forráskódja mellett ** fájlnévvel; a **Run with Exomizer**
  engedélyezésével a kimenet feldolgozásra kerül;
- A hibakereső mellékfájlok (szimbólumok / forráskódtérkép) a PRG mellett vannak
  írva, ahol elérhetők;
- Az `.include` / `include` (és az `.inc` fájlokkal) egy másik fájl által
  behívott modulok kimaradnak, akárcsak a soha nem mentett fülek;
- Egy jelentés felsorolja az összes fájlt méretével, a *kihagyás* okával vagy
  fordítási hibával együtt, az állapotsor pedig a *N / M felépített fájlt
  mutatja.*

### Hibakereső szimbólumok és szétszerelés

A buildek Ultimate Basic hibakeresési információkat kérnek, és három
kompatibilis mellékkocsit hoznak létre:

- `.sym` a KickAssembler stílusú szimbólumokhoz;
- `.dbg` a C64Debugger/RetroDebugger forrás- és szegmensinformációihoz;
- `.vs` a VICE monitor címkékhez.

### Ultimate Basic kézikönyv és forrás

A könyv ikonra az UB eszköztáron kattintva offline módban megnyitható a
megfelelő Ultimate Basic `MANUAL.pdf` fájl; a kézikönyv gombjára az indítási
üdvözlő párbeszédpanelen ugyanez a kézikönyv nyílik meg. A Visual Assembler mind
a fordítót, mind a PDF-et a rögzített upstream Git/Cargo függőségből veszi, így
az IDE nem tart fenn második példányt az Ultimate Basic implementációjáról. A
Névjegy párbeszédpanel és a nyitóképernyő a tényleges függőség verzióját
jeleníti meg.

- `* = $1500` → ORG blokk
- `Címke:` → CÍMKE blokk
- `Címke: .byte 0` → CÍMKE + BYTE blokkok
- `.byte ...` → BYTE blokk
- `; comment` (vagy inline `; ...`) → COMMENT blokk
- utasítások (`lda`, `jsr`, `beq`, stb.) → észlelt címzési móddal rendelkező
  utasításblokkok

#### Import elemzési megjegyzések és ajánlott eljárások

- A lokális címkék, mint például az `.wait`, megtartják a pontjukat: a felettük
  lévő legközelebbi globális címkéhez tartoznak (lásd: [Local (pontozott)
  címkék](#local-dotted-labels)).
- Az `($zp),Y` / `($zp,X)` stílusú címzés esetén a legjobb kompatibilitás
  érdekében használjon konkrét nulla oldalas bájtot (`$FB`, `$FC` stb.).
- Kerüld a kétértelmű, hexadecimálisnak tűnő rövid címkéket (`cc1`, `dead`,
  `beef`) az ágak kontextusában; részesítsd előnyben az olyan neveket, mint a
  `loop_cc1`.
- Ha a programod az adat (`.byte`) karakterlánccal kezdődik a végrehajtható kód
  előtt, akkor adj hozzá egy explicit ugrást (például `JMP Start`) a tetejéhez.

### Kick import (Kick Assembler)

A Program menü **Kick import** gombja a nyers Kick Assembler forráskódot egy új
blokk módú lapra tölti be. Ez elkülönül a fenti `.asm fájl betöltése` Expert
módú ` gombtól — az egyéni tooltipje jelzi, hogy **csak a Kick Assembler kód
támogatott** (más assembler kódok részlegesen értelmezhetnek, de nem garantált
az oda-vissza átvitel).

Támogatott minták:

- `.pc = $XXXX` eredet direktíva → ORG blokk
- `.const NÉV = érték`, `.label NÉV = érték` → KONST egyenlőségjel
- `.makró NÉV(p1, p2, ...) { ... }` with `{`/`}` merevítő törzs vagy `.endm` →
  felhasználói makró definíció
- Makróhívás `NAME(args)`, Kick colon prefix `:NAME(args)`, és `.invoke
  NAME(args)` — mindegyik oda-vissza a Kick colon űrlapon keresztül
- Az `@local` címkék (`@loop:`, `BEQ @loop`) megőrzik az `@` előtagot a
  jelenlegi állapotában.
- Operandus `címke + N` / `címke - N` (pl. `STA mod1+2`, `LDA xp+1`)
- Sormegjegyzések `// ...` és `;` — mindkettő elfogadott, az `/* ... */`
  blokkokat egyetlen megjegyzéssorként kezeli a rendszer
- `.szöveg "…"` képernyőkoordináták nélkül → BYTE blokk a kódolt bájtokkal (az
  eredeti sor a blokk kommentjeként marad). Több elem is megengedett: `"…"`,
  `@"…"` escape karakterekkel `\n` `\r` `\t` `\$NN`, és `$NN` / decimális
  bájtok, `, ` vagy `+` karakterekkel összekapcsolva
- Az `.encoding "name"` paraméter a következő `.text` sorok kódolását állítja
  be: `screencode_mixed` (a Kick alapértelmezett értéke), `screencode_upper`,
  `petscii_mixed`, `petscii_upper`, `ascii`. A blokkon egy olyan karakter
  jelenik meg, amelynek a kódolásához nincs kód.
- `.label NÉV = *`, `.label NÉV = * + N`, `.label NÉV = * - N` → egy címke a
  programszámlálónál, N-nel eltolva (például egy ugrás egy `BIT` operandusába:
  `.label loc_c474 = * + 1`)
- Az `.abs` / `.a` és `.zp` / `.z` (`sta.abs $00fc,x`, `ldx.zp ptr,y`)
  mnemonikus utótagok abszolút vagy nulla oldalas címzést kényszerítenek ki.
- `*=$XXXX "név"` és `.pc = $XXXX "név"` szegmens tetszőleges sorrendben: az
  elsőnél alacsonyabb szegmens a saját címén marad
- BASIC autostart áteresztés: amikor a program a `$0801` címen indul a standard
  `SYS 2061` bájtos csonkkal (`.bájt
  $0B,$08,$0A,$00,$9E,$32,$30,$36,$31,$00,$00,$00`), a fordító szó szerint
  kiadja a PRG-t ahelyett, hogy egy második BASIC SYS-t csomagolna köré.

A Restore64 által készített szétszerelések (KickAssembler szintaxis) bájtról
bájtra importálják és építik fel, hasonlóan a KickAssemblerhez. A fejlécükben
megnevezett belépési pont az első `.pc`. Egy Plus/4 / C16-ra készült program
(BASIC a `$1001` címen, TED regiszterei a `$FFxx` címen) ugyanígy fordul fel, de
csak egy Plus/4 emulátorban fut, például a VICE `xplus4` paranccsal, nem.

Ismert korlátozás:

- A nulla oldalas címre feloldódó konstansok (például `.const BYTEADDR = $FC`,
  amelyet `STA BYTEADDR` címként használnak) jelenleg abszolút módú utasításokká
  (3 bájt) fordulnak le a nulla oldalas (2 bájt) helyett. A lefordított kód
  továbbra is a megfelelő memóriahelyre ír, csak kisebb mérettel és
  ciklusterheléssel a Kick Assembler által készített ugyanennek a forráskódnak a
  kódjához képest.

#### Kick projektek (Kick projekt importálása…)

Az **Import Kick project…** parancs (Program menü, a **Kick import** alatt) egy
teljes KickAssembler forráskódfát vesz – egy fő fájlt `#import` modulokkal és
`.import binary` elemekkel – és létrehoz belőle egy VA projektet. Válaszd ki a
fő fájlt (`main.asm`); A VA minden `#import` / `.import source` / `.import
binary` ágat követ (szintén a nem foglalt `.if` ágakon belül), és egy `.proj`
fájlt ír mellé, amelyet a mappa után neveznek el (a `src` / `source` / `asm`
mappák a szülőmappa nevét használják). A projekt felsorolja az összes fájlt a
mappafájában; a források ott maradnak, ahol vannak, így egy meglévő
KickAssembler build szkript továbbra is működik. A nem található fájlok a
hibaüzenetben jelennek meg.

**Kick-kompatibilis kapcsoló:** bármely VA (VMA) projekt Kick-kompatibilissé
tehető a **KickAssembler-kompatibilis** kapcsolóval a **Projektbeállítások**
menüpontban (az importált Kick projekteknél be van kapcsolva). A beállítás a
`.proj` (`"kick": true`) fájlban lesz elmentve; kikapcsolt állapotban a projekt
egy sima VMA projekt, és pontosan úgy épül fel, mint korábban.

Egy Kick-kompatibilis projektben a VA makrók és direktívák továbbra is működnek
a KickAssembler szkript mellett: `.text x, y, "…"`, `.set_border`, LOOP / NEXT,
SPRITE_INIT, `.include`, `.incbin`, `.sid`, `.define` / `.if SYMBOL` / `.else` /
`.endif`, VA makrók (`.macro name(p)` … `.endm` with `{p}`), a többi pedig
változatlanul kerül a VA assemblerbe, a Kick konstansok számként szerepelnek. A
mindkettőben létező direktívákat a formájuk különbözteti meg:

| VA (VMA)                                                   | KickAssembler                                                                                                         |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `.X esetén, $0A, 1-hez` … `.endf 1-hez`                    | `.for (i változó = 0; i < 10; i++) { … }`                                                                             |
| `.ha HIBAKERESÉS` … `.else` … `.endif`                     | `.if (kifejezés) { … } else { … }`                                                                                    |
| `.makrónév(p)` … `.endm`, meghívva az `.invoke` paranccsal | `.makró Name(p) { … }`, meghívva: `Name(arg)`                                                                         |
| `.var név = érték` (futásidejű változó)                    | `.var név = érték` (egy szkriptváltozó) — egy Kick-kompatibilis projektben az `.var` mindig a KickAssembler változója |

A projekt a VA assemblerrel fordul, nem a KickAssemblerrel: minden fordítás
(Run, Build PRG, D64, CRT, Exomizer, Debug, VICE Monitor, Build project, a Build
gomb) először lefuttatja az indítófájlt egy KickAssembler előfeldolgozón
keresztül, a megnyitott lapok szerkesztőszövegével, függetlenül attól, hogy
mentve van-e vagy sem. Az eredmény ugyanaz a PRG, mint a KickAssembleré.
Támogatott:

- `#import`, `.import forrás`, `#importonce`; `.import bináris` / `c64` /
  `szöveg[X76X opcionális eltolással és hosszúsággal
- `.const` / `.label` tetszőleges sorrendben, kifejezésekkel; a nulla oldal vagy
  abszolút címzés követi az értéket, mint a KickAssemblerben (az `.abs` / `.zp`
  továbbra is kényszeríti)
- `.for (var i = 0; i < n; i++) { … }` és az egysoros forma, `.var`, `.eval`
  (`=`, `+=`, `++` …), `.if (…) { … } else .if (…) { … } else { … }` és az
  egysoros forma
- `.function Name(params) { .return expr }` és `.macro Name(params) { … }`
  meghívva `Name(args)` vagy `:Name(args)` néven
- többcímkés `!:` / `!név:` `!+`, `!-`, `!++`, `!név+`, `!név-` kombináció
- `.pseudopc cím { … }`: a bennük lévő címkék logikai címet kapnak, a bájtok ott
  maradnak, ahol vannak
- `BasicUpstart2(címke)` / `BasicUpstart(címke)`, `* = "szegmens" címe`, `.fill
  n, kifejezés` (`i`-szel) és `.fill n, [a, b]`, `.align`, `.byte`, `.word`,
  `.dword`, `.text`
- `.assert "leírás", expr, true`; `cmdLineVars.containsKey(…)` /
  `cmdLineVars.get(…)` és `#define` szimbólumok a **Project settings**
  beállításokból származnak (KickAssembler `:name=value` és `-define NAME`
  beállításai)
- `LoadBinary("fájl"[, sablon])` a `get(i)` / `uget(i)` / `getSize()`
  függvényekkel, egy olyan sablonnal, mint a `"C64FILE, Bitmap=$0000,
  ScreenRam=$1f40"` (vagy `BF_KOALA`, `BF_FLI`, `BF_DOODLE`,
  `BF_BITMAP_SINGLECOLOR`, `BF_C64FILE`), amely a következőt adja:
  `getBitmap(i)` / `getBitmapSize()` blokkonként; `LoadSid("file.sid")` a
  következő paraméterekkel: `location`, `init`, `play`, `songs`, `startSong`,
  `size`, `name`, `author`, `copyright`, `getData(i)` …; A `.fill`
  szkriptértékekkel azonnal kibővül
- `* = cím "név" virtual`: egy virtuális memóriablokk — a címkéi címeket kapnak,
  de bájtok nem kerülnek írásra
- `.while (…) { … }`, `i++` / `--i` kifejezésekben, `.var name` érték nélkül
- `*` programszámlálóként (`jmp *`, `bne *-1`, valamint az `.pseudopc` fájlban)
- `;` utasítások között (`lda #1; sta $d020`, `.var a = 1; .var b = 2`): a `;`
  közvetlenül a kód után, szóköz nélkül, majd egy utasítás. Bármely más `;` egy
  megjegyzést kezd, mint a VA-ban, így az `lda #1 ; megjegyzés` továbbra is
  működik.
- a matematikai könyvtár (`sin`, `cos`, `radiánonként`, `fokonként`, `round`,
  `floor`, `sqrt`, `pow`, `atan2`, `log10`, `random` …), a színkonstansok
  (`BLACK` … `LIGHT_GREY`), az opcode konstansok (`RTS`, `LDA_IMM`, `LDA_ZPX`,
  `JMP_IND`, `BNE_REL` …) és `asmCommand26(X)`
- `BasicUpstart2(label)`, ahol a címke a méretek `* =` helyétől bárhol
  megjelenhet (például `* = $4000` … `start:` SYS 16384 értéket ad)
- hatókörök, mint a KickAssemblerben: `{ }` blokkok, `.if` elágazások, `.for` /
  `.while` fordulatok és makróhívások saját címkékkel és konstansokkal
  rendelkeznek (egy ` ciklus:` belül nem ütközik egy külsővel; az `.pseudopc`
  nem hatókör). A hatókör előtti címke elérhetővé teszi a belső címkéket: `name:
  { … }` → `name.inner`, `lp: .for (…)` → `lp[2].inner`, `myIf: .if (…)` →
  `myIf.inner`, `c1: Macro()` → `c1.inner`, `.label base = $1000 { … }` →
  `base.inner`
- `.namespace name { … }` és `.filenamespace name` (a fájl végéig): a címkék a
  következőképpen érhetők el: `name.label`; `@label:`, `.label @x = …`,
  `.function @f` / `.macro @m` a szimbólumot a gyökérbe helyezi, és az `@name` a
  gyökérszimbólumra utal. A függvények és makrók mindenhol láthatók, még az `@`
  nélküli névtér címkéi is.
- `.pseudocommand name a : b { … }`: mnemonikus módon hívódik meg (`mov #10 :
  $1000`, `mov src,x : ($30),y`); Az argumentumok megtartják a címzési módjukat
  (`getType()` = `AT_IMMEDIATE`, `AT_ABSOLUTE`, `AT_ABSOLUTEX` / `Y`,
  `AT_INDIRECT`, `AT_IZEROPAGEX` / `Y`, `AT_NONE` hiányzó argumentum esetén;
  `getValue()`), `CmdArgument(type, value)` újat hoz létre). Egy emlékeztetőként
  elnevezett pszeudoparancshoz kettőspont szükséges (`:adc …`); enélkül az
  emlékeztető összeáll
- az előfeldolgozó: `#define`, `#undef`, `#if` / `#elif` / `#else` / `#endif`
  (with `!`, `&&`, `||`), `#importif`
- `List()` (`hozzáadás`, `lekér`, `beállítás`, `méret`, `eltávolítás`,
  `rendezés`, `fordítás`, `keverés`, `Összes hozzáadása`), `Hashtable()`
  (`felhelyezés`, `lekér`, `kulcsottartalmaz`, `eltávolítás`, `kulcsok`),
  `.struktúra neve {a, b}` (`Név(1, 2)`, `p.a`, `.eval p.a = 3`,
  `getFieldNames()` …), karakterláncok (`+`, `charAt`, `substring`, `méret`,
  `toUpperCase`, `asNumber(radix)` …, `toIntString` / `toHexString` /
  `toBinaryString` minimális mérettel), `.enum {A, B, C = 5}`, `.define name, …
  { … }`, `.eval list.add(…)`, egy karakter az `.byte` fájlban és
  karakterlánc-kifejezések az `.text` fájlban (a jelenlegi `.encoding` fájlban)
- `.error "üzenet"`, `.errorif feltétel, "üzenet"`; `.print` / `.printnow`
  kimenete a státuszsorban (az első üzenet és a darabszám) és teljes egészében a
  **Build Info** részben látható. Egy olyan `.if`, amely csak (`.error` …) hibát
  jelent, kimarad, ha a feltételének címkecímekre van szüksége.
- `LoadPicture("file"[, List().add($rrggbb, …)])` GIF, PNG és JPG esetén:
  `width`, `height`, `getPixel(x, y)`, `getSinglecolorByte(x, y)`,
  `getMulticolorByte(x, y)`; színtábla nélkül a színek a megjelenésük
  sorrendjében kerülnek felhasználásra. A változóban átadott képnév
  (`LoadPicture(filename)`) is működik.
- szegmensek: `.segmentdef Név [start, startAfter, align, min, max, fill,
  fillByte, szegmensek, prgFiles, sidFiles, virtual, outPrg, outBin,
  modify="BasicUpstart", _start]`, `.segment Név [params] "blokk"`, `.segmentout
  [szegmentek=…]`, `.file [név=…, szegmensek=…, allowOverlap]`, `.disk
  [fájlnév=…, név=…] { [név=…, típus=…, szegmensek=…], … }`, `.memblock`. Egy
  `start` nélküli szegmens $2000-től kezdődik, mint a KickAssemblerben. A
  **Run** parancs elindítja a Default szegmenst; ha az üres, akkor az első PRG
  kimenet (a $0801-nél található) jelenik meg először. A **Build project**
  parancs minden `.file` / `outPrg` / `outBin` fájlt kiír az indítófájl mellé,
  és a c1541 paranccsal felépíti a `.disk` rendszerképet.
- `.fillword n, expr`, `.lohifill n, expr` (címkével: `name.lo` / `name.hi`);
  mnemonikus utótagok: `.im` / `.i`, `.z` / `.zp`, `.a` / `.abs`
- `.cpu _6502NoIllegals` / `_6502` (alapértelmezett, illegális opkódokkal) /
  `dtv` (`bra`, `sac`, `sir`) / `_65c02` (`(zp)` mód, `bra`, `phx` / `phy` /
  `plx` / `ply`, `stz`, `trb`, `tsb`, `rmb0-7` / `smb0-7`, `bbr0-7` / `bbs0-7`,
  `stp`, `wai`, `inc` / `dec` A, `bit #`, `jmp (abs,x)`); minden illegális NMOS
  opkód az összes módjával és egyéb neveivel együtt (`sha` / `ahx`, `shx`,
  `shy`, `tas` / `shs`, `las` / `lae`, `xaa` / `ane`, `lxa`, `anc2`, `sbc2` …) —
  a VA assembler is ismeri őket
- `.break ["condition"]` és `.watch address[, end][, "store"]`: töréspontok és
  figyelők a VICE szimbólumfájlban (`break` / `watch` sorok, ahogy a
  KickAssembler írja őket) és a RetroDebugger `.dbg` fájljában; az `.break`
  sorok a **Debug** fájl töréspontjai is.
- `Vektor(x, y, z)` (`+`, `-`, `*` szám / skaláris szorzat, `/`, `X()`
  vektorszorzat, `get(n)`, `getX()` …) és 4×4-es mátrixok: `Mátrix()`,
  `ForgatóMátrix(ax, ay, az)`, `SkálaMátrix`, `MátóMátrix`,
  `PerspektívaMátrix(z)`, `get(n, m)`, `set(n, m, v)`, mátrix × mátrix, mátrix ×
  vektor
- `getNamespace()`; `.assertrorror "név", kifejezés` és a kódformák: `.assert
  "név", { … }, { … }` / `.assertrorror "név", { … }` (az eredmények `.print`
  üzenetek, mint például a KickAssembler assert jelentése); `* - label` egy
  konstansban (`.label size = * - start`)
- `.modify` / `.filemodify` KickAssembler Java pluginre van szükség: a blokk
  módosító nélkül, üzenettel összeállítható

Gépelés közben a teljes fa ellenőrzésre kerül: a megnyitott fájl hibái
megjelölésre kerülnek a szerkesztőben, az állapotsorban az első hiba látható, a
fordítási hiba párbeszédpanelen pedig a következő név szerepel: `file:line` –
egy kattintás a sornál nyitja meg a fájlt. A memóriatérkép a felépített
programot mutatja, a ciklushatár pedig a megnyitott fájl ciklusait mutatja (egy
`.for` által kibontott sor vagy egy `4×8` makró: egy fordulat, nyolcszor; a
kijelölés minden fordulatban összeadódik). A kukucskáló-jelzések a megnyitott
fájl sorait jelölik; a Disassembly és a Monitor panelek a felépített programot
mutatják. A szerkesztő kiemeli a KickAssembler szintaxist (`#import`,
`.segment`, szkriptfüggvényeket, `!labels`, `;` a `.for (…)` fájlon belül), és a
befejezés felkínálja a Kick direktívákat (`.`), az előfeldolgozót (`#`) és a
szkriptfüggvényeket. Az előfeldolgozó üzenetei az alkalmazás nyelvén jelennek
meg. A **Debug** (RetroDebugger) egy forrástérképet kap az eredeti fájlokkal és
sorokkal, olvasható szimbólumnevekkel (`scope.label`), és minden megnyitott
projektfájl töréspontjaival. A projektfában lévő bináris fájlok nem szövegként
nyílnak meg. A Dark Chambers C64 port (19 forrásfájl, 15 bináris fájl) és mind a
tizenegy KickAssembler példa, bájtról bájtra felépített kóddal, mint a
KickAssembler 5.25.

## 6. Szakértői mód

A Szakértői mód egy teljes funkcionalitású, közvetlen szöveges 6502-es
assembly-szerkesztő, amely a blokkszerkesztő mellett található. Minden fül lehet
Blokk vagy Szakértő módban – a felső sávban található **Blokk / Szakértő**
kapcsolóval bármikor szabadon válthat közöttük.

### Módok váltása

Válassza az **UB** ikont a fő eszköztáron az Ultimate Basic módba való
váltáshoz. A kiválasztott szerkesztőmódot a rendszer megjegyzi az alkalmazás
újraindításakor. Egy új forráskód a következővel kezdődik:

```basic
színes háttér 0
színes szegély 0

nyomtatás: "Üdvözlet az Ultimate Basic-től"
```

Az UB mód az `.ub` forrásfájlokkal működik. Az **Új**, **Megnyitás**, **Mentés**
és **Mentés másként** parancsok az aktív UB fülön használhatók. Egy `.ub` fájl
megnyitása automatikusan aktiválja a megfelelő szerkesztő fület.

Az eszköztár az aktuális UB munkamappát mutatja. Ez a mappa a Blokk/Szakértő
munkamappától elkülönítve tárolódik. Amikor az UB mód aktív, a **Fájl →
Munkamappa beállítása** parancs kiválasztja az UB mappát; az eszköztipp
azonosítja az aktív hatókört. Az UB Megnyitás/Mentés párbeszédablakok itt
indulnak, és a nem mentett források ezt használják a relatív `include` és
`incbin` elérési utak alapjául.

### Szerkesztő elrendezése

Az UB eszköztár ugyanazt a vizuális nyelvet és egyéni eszköztippeket követi,
mint a Szakértő mód. A következőket kínálja:

- szintaxiskiemelések az aktuális Ultimate Basic nyelvi referencia alapján;
- a hosszú fájlokkal szinkronban maradó sorszámok;
- minitérkép és szerkesztői zoom vezérlők (`Ctrl` + egérgörgő szintén zoomol);
  kattintson a minitérképre az ugráshoz, vagy húzza a kijelölt nézetet a
  folyamatos görgetéshez;
- Keresd meg a (`Ctrl+F` / `Cmd+F`) parancsot a Szakértő stílusú keresősávval;
- forráskód formázása szerkezet-érzékeny behúzással;
- automatikus kiegészítés parancsokhoz és beépített függvényekhez;
- egy kereshető **Parancsok** panel szintaxissal, leírással és használati
  útmutatóval – a leírások a felhasználói felület aktuális nyelvét követik
  (magyar, angol, spanyol, német, holland, lengyel, olasz), a még le nem
  fordított részek esetében pedig az angolt használják;
- függetlenül kapcsolható **Projekt** és **Parancsok** panelek, amelyek egymás
  mellett jelennek meg, ha mindkettő engedélyezve van;
- függetlenül ki-be kapcsolható és átméretezhető **Build Output** és
  **Disassembly** panelek.

A Szétszerelés panel tartalmaz egy **Másolás** gombot, amely a teljes
megjelenített forráskódot a vágólapra másolja. A parancssúgó a mellékelt
fordítót követi: például az `sprite_frame id, data_address [, frame]` parancs
egy animációs képet választ ki egymást követő 64 bájtos sprite képkockák közül.

A szerkesztő megérti az Ultimate Basic 1.6.3 QBasic stílusú szintaxisát is: `dim
name as type`, `function … end function`, `sub … end sub`, `elseif`, `do … loop
[while |] until]`, `while … wend`, `select case`, `exit do` / `exit for` / `exit
while` / `exit sub` / `exit function`, a `left$` / `right$` / `mid$`
karakterláncfüggvények, és a `'` kezdetű megjegyzések, valamint az `#` vagy
`rem`. Azok a szavak, amelyeket a fordító csak egy pozícióban kezel
kulcsszóként, csak ott lesznek színezve, és névként is használhatók maradnak:
`as` a BASIC típusnevekkel (`byte`, `integer`, `single`, `double`), `case is`,
`map view`, `wait key` és a `scroll` opciókkal (`row`, `x`, `y`, `bal`, `jobb`,
`keskeny`, `széles`). A **Formátum** behúzza a `function`, `do … loop`, `while …
wend` és `elseif` blokkokat, az egysoros ciklusokat (`do while c : … : loop`)
pedig behúzás nélkül hagyja, a Projekt panel a `function` blokkokat listázza a
Függvények alatt, a Parancsok panelen pedig a **DIM**, **FUNCTION**, **ELSEIF**,
**DO**, **WEND** szerepel. **ESET KIVÁLASZTÁSA**, **VÉGE**, **ALKILÉPÉS**,
**BAL$**, **JOBB$** és **KÖZÉPSŐ$** bejegyzések.

A parancslista magassága szándékosan korlátozott, így a parancsrészletező kártya
kitöltheti a panel fennmaradó magasságát. A részletes terület külön görgethető a
hosszabb szintaxisleírásokért.

### Eszköztár gombjai

Az Ultimate Basic projektek `.proj` fájlokat használnak, és több `.ub` forrást
is tartalmazhatnak. A Projekt panel listázza a megnyitott fájlokat, megjelöli a
nem mentett lapokat, és megjeleníti a felfedezett címkéket, függvényeket és
alprogramokat. A Projekt műveletek lehetővé teszik egy projekt létrehozását,
megnyitását, mentését és bezárását, vagy egy másik forrásfájl hozzáadását. A
Verziókövetés párbeszédpanelen a projekt összes fájlját véglegesítheti,
összehasonlíthatja és visszaállíthatja – lásd: [Projekt mód](#project-mode). Egy
új projekt UltimateBasic sablonból is indulhat – lásd: [Projektsablonok]{2].

Kattintson a projektfájl melletti csillagra, hogy **indítófájlként** jelölje
meg. A Build, Run, D64, C64 Ultimate és Debug parancsok akkor is lefordítják az
adott indítófájlt, ha egy másik lap aktív. Indítási beállítások nélkül az aktív
UB lap lesz használatban.

A projektpanel eszköztárán két hozzáadás gomb található, a fájl párbeszédablakok
pedig alapértelmezés szerint az **UB munkamappát** jelenítik meg (Menü → Fájl →
Munkamappa beállítása, UB-specifikus):

- **Fájl hozzáadása** — egy vagy több fájl kiválasztása egyszerre (bármilyen
  típus — `.ub`, `.bin`, `.prg`, képek, betűtípusok stb.). Az `.ub` források
  szintén szerkesztőfülként nyílnak meg; minden más csak referenciaként kerül
  hozzáadásra, hogy az `incbin`/`loadfile` eszközök a projekttel együtt
  utazhassanak.
- **Mappa hozzáadása** — egy teljes mappára hivatkozik (pl. egy `incbin`
  eszközkönyvtárra, mint például a `fonts/`), hogy az továbbra is a projekthez
  legyen társítva.

A fában lévő mappák egy összecsukó/kibontó nyíllal rendelkeznek, és a **jobb
gombbal kattintson egy mappára** egy vagy több beágyazott fájl hozzáadásához
(behúzva látható). Minden bejegyzéshez tartozik egy törlés (✕) gomb; a nem `.ub`
bejegyzések csak referenciaként szolgálnak, és kattintással nem nyílnak meg.

Az **Projekt mentése** gomb automatikusan kikapcsol és „Mentett” állapotot
mutat, ha a projektnek nincsenek függőben lévő módosításai, majd automatikusan
újra engedélyeződik, amint hozzáad, eltávolít vagy átszervez egy fájlt vagy
mappát.

### Szakértő szerkesztő minitérkép

A Szakértői szerkesztő minitérképe egy keskeny vászoncsík (`88 px`) a
szerkesztőterület jobb szélén. Minden forrássor kicsinyített ábrázolását
jeleníti meg:

Egy **félig átlátszó nézetablak-jelző** (ékezetes színű téglalap) mutatja, hogy
a forrás melyik része látható jelenleg. Kattintson a minitérkép bármely
pontjára, hogy arra a pozícióra ugorjon; húzással görgethet folyamatosan. A
minitérkép függetlenül görgethető, hogy a nézetablak-jelző középen maradjon. Az
állapot a felhasználói felület beállításaiban marad megőrzve (`expertMinimap`
billentyű).

- A kimenet automatikusan láthatóvá válik;
- a fordítási hibák pirossal jelennek meg;
- a középre igazított fordítási párbeszédpanel megjeleníti a hibát;
- A forrássort tartalmazó hibák esetén válassza ki az adott sort az aktív UB
  szerkesztőben.

A Build Info jelentéseket tartalmaz a betöltési/befejezési címekről, a kód- és
PRG-méretekről, az Exomizer állapotáról, a változókról, a tömbökről, a
függvényekről/alprogramokról és a címkékről.

### Kódméret soronként és tippek

Az **kódméret** eszköztár gombja (láng ikon) egy fordítás után mutatja, hogy az
egyes forráskód sorok hány bájtra lettek lefordítva – a szám a sorszámok közé
kerül, egy narancssárga sáv pedig a legdrágább sorhoz viszonyított súlyát
mutatja. Az állapotsor összeadja a kurzor alatti sor bájtjait és becsült
ciklusszámát (egyenes, ciklusok nélkül).

Gépelés közben egy **hints** gomb jelenik meg az állapotsorban, ha valami
hibásnak tűnik; kattintson rá a lista megjelenítéséhez, és egy tippre kattintva
ugorhat a következő sorra:

- `sys $EA31` / `sys $EA81` — A `sys` lefordul `JSR` fájllá, így a KERNAL `RTI`
  parancsa a szemétbe tér vissza; IRQ esetén használd az `irq_exit` vagy az `asm
  { JMP $EA31 }` parancsot;
- `wait key` — nem dokumentált forma, használd a `waitkey` formátumot;
- egy soha nem használt `var` / `dim` / `const` változó;
- egy build után: egy `asm` blokk utasítás egy nulla oldalas címen, amely egy
  Ultimate Basic változót vagy a futási környezet saját nulla oldalát
  tartalmazza.

### Hiba a kiemelés során

A sikertelenül lefordított sorokat valós időben **piros** (színezett háttér +
bal oldali ékezetes szegély) jelöli a program, minden billentyűleütés után 350
ms-mal. Az első hibaüzenet az állapotsorban is megjelenik. Javítsa ki a sort, és
a kiemelés automatikusan eltűnik.

| Futási mód                      | Végső alapvető viselkedés                                                                                                                                                |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Futtatás PRG-ként**           | Fordítsd le és indítsd el a PRG-t közvetlenül a VICE-ban.                                                                                                                |
| **Futtatás a D64-en keresztül** | Fordítsd le, nyisd meg a szokásos D64 csomagolási párbeszédablakot, majd indítsd el a lemezt a VICE-ban.                                                                 |
| **Futtatás Ultimate-on**        | Töltse fel és futtassa a PRG-t a konfigurált C64 Ultimate REST kapcsolaton keresztül.                                                                                    |
| **D64 futtatása hardveren**     | Csomagolj be egy D64-et, és küldd el a konfigurált C64 Ultimate-nek.                                                                                                     |
| Kung Fu Flash 2 **              | Fordítsd le az UB indító forráskódját, és töltsd fel a PRG-t USB-n keresztül egy valódi C64/C128-ra, amely Kung Fu Flash 2 kazettát használ. Lásd: [Kung Fu Flash 2]{1]. |

A globális **Futtatás Exomizerrel** opció (**Beállítások → Általános →
Program**) az UB buildekre és a normál futtatási célpontokra is vonatkozik;
nincs szükség külön UB eszköztár kapcsolóra. A hibakereső indításai szándékosan
a tömörítetlen PRG-t használják, így a fordító címei és szimbólumai továbbra is
megegyeznek a végrehajtott programmal.

Engedélyezze a **Beállítások → Általános → Programok → UltimateBasic ASM forrás
(.asm) generálása** lehetőséget, ha a fordító által generált assemblyt egy PRG
vagy D64 build mellé szeretné menteni, ugyanazzal az alap fájlnévvel. Ez egy
build opció, így az UB eszköztár nem tartalmaz külön ASM export gombokat. A
`load "NAME", $address` utasítás a megfelelő D64 extra fájl PRG betöltési címét
is megadja.

### Szintaxis kiemelése

A szerkesztő egy átlátszó `<div>` réteget (`expert-hl`) használ, amely a
szövegterület tartalmát színes `<span>` elemekkel tükrözi. A kiemelés
kikapcsolható az **HL** gombbal a nagyon nagy programok teljesítményének
javítása érdekében.

- `.sym` a KickAssembler stílusú szimbólumokhoz;
- `.dbg` a C64Debugger/RetroDebugger forrás- és szegmensinformációihoz;
- `.vs` a VICE monitor címkékhez.

A `REGION` / `ENDREGION` direktívák a többi assembler direktívához hasonlóan
kiemelve jelennek meg. Az összecsukott régiók csak a régió fejlécét tartják
láthatónak a szerkesztőben, amíg újra meg nem nyitod őket. Az új **Region
selection** eszköztár kapcsolója csak az automatikus aktuális régió kiemelését
vezérli Szakértő módban; kikapcsolása esetén a forrás látható marad a hajtási
állapot megváltoztatása nélkül.

### Forrásformázó

Kattintson az **Formátum** gombra (`#expert-format-btn`) az aktuális forrás
automatikus formázásához:

Az Ultimate Basic önálló nyílt forráskódú projektként is elérhető:

<https://github.com/zstarczali/UltimateBasic>

A fordítóprogram a Visual Assembler része, így futásidőben nincs szükség külön
`ub` futtatható fájlra.

## 7. Címzési módok

Minden 6502-es utasítás egy vagy több címzési módot támogat. A módválasztó
minden blokkon megjelenik.

### Kifejezések operandusként való címkézése

- **Blokk → Szakértő:** az aktuális program szöveggé alakul (soronként egy
  utasítás, címkék, makrók direktívákként). A Szakértő módban végzett
  szerkesztések visszaszinkronizálódnak a blokk tömbbe, valahányszor
  visszaváltasz vagy egy műveletet elindítasz.
- **Szakértő → Blokk:** a szöveg elemzésre kerül, és az eredmény felülírja a
  blokkprogramot. Egy fordítási hibaüzenet jelenik meg, ha az elemzés
  sikertelen.
- **Az üres sorok** megőrződnek a körbe-körbe váltás során: a Szakértő
  szerkesztőben az üres sorok vékony szaggatott térközökként jelennek meg Blokk
  módban, és üres sorként állnak vissza, amikor visszaváltunk Szakértő módba.

### Az `*` programszámláló kifejezésekben

```
┌─────────────────────────────────────────────────────┐
│ [eszköztár] Blokk │ Szakértő < fül váltása │
├────────────┬─────────────────────────────┬────────────┤
│ Paletta │ ASM szövegszerkesztő │ Disasm │
│ (opcionális) │ (egy szélességű, szerkeszthető) │ panel │
│ │ │ (opcionális) │
└────────────┴────────────────────────────┴────────────┘
```

| Panel         | Váltás                    | Leírás                                              |
| ------------- | ------------------------- | --------------------------------------------------- |
| **Paletták**  | `#szakértői-paletta-gomb` | Elágazás önmagához (végtelen ciklus, eltolás `$FE`) |
| `*-n` / `*+n` | `BNE *-5`, `BEQ *+4`      | Elágazás az aktuális PC-hez képest *n* bájttal      |
| `JMP *+n`     | `#szakértői-disazm-gomb`  | Az aktuális PC-ből számított abszolút ugrás         |

### Helyi (pontozott) címkék

| Gomb                                      | azonosító                                                   | Funkció                                                                                                                                                                                                                                                                                      |
| ----------------------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Formátum**                              | `#szakértői formátum gomb`                                  | Forrás automatikus formázása (0. oszlop címkéi, 4-es behúzás, 1-es mnemonikus/operandus)                                                                                                                                                                                                     |
| ** .asm betöltése**                       | `#szakértői-asm-betöltés-gomb`                              | Nyisson meg egy `.asm` fájlt — a tartalom egy **új fülre** töltődik be, amelynek címkéje a fájlnév lesz. Minden betöltött fájl független fül lesz, saját programblokkokkal és szerkesztőállapottal.                                                                                          |
| ** .asm mentése**                         | `#szakértői-mentés-asm-gomb`                                | Szerkesztő tartalmának mentése `.asm` fájlba (fájl párbeszédablak az első mentéskor)                                                                                                                                                                                                         |
| **Build információk**                     | `#szakértői-építési-info-gomb`                              | Nyisd meg a Build Info párbeszédablakot: felül a kezdőpont, a végpont, a méret és a szegmensek száma, majd a szegmensek, a hibák (`file:line` egy Kick projektben) és az `.print` kimenet, az oszlopokban pedig a címkék, konstansok és makrók.                                              |
| **Automatikus kiegészítés**               | `#szakértői-automatikus-kiegészítés-gomb`                   | Szakértői automatikus kiegészítési javaslatok be- és kikapcsolása. Ha le van tiltva, nem jelenik meg utasítás, emlékeztető vagy címke felugró ablak a szakértői szerkesztőben.                                                                                                               |
| **Régió kiválasztása**                    | `#szakértői-régió-kiválasztó-gomb`                          | Szakértő módban be-/kikapcsolja az automatikus régiók kiemelését. A hajtási állapot tárolva marad, de kikapcsolt állapotban a szerkesztő láthatóvá teszi a teljes forráskódot, és nem választja ki automatikusan az aktuális régiót.                                                         |
| **Összes régió összecsukása / kibontása** | `#szakértői-régió-összes-gombfelhajtás`                     | Egyetlen kattintással összehajthatja vagy kibonthatja az összes `.region` blokkot. Ha bármelyik régió meg van nyitva, a gomb az összeset összecsukja; ha már minden régió össze van csukva, a következő kattintás az összeset kibontja. A gomb világít, ha az összes régió össze van csukva. |
| **Sorszámok**                             | `#szakértői-sorszámok-gomb`                                 | Be-/kikapcsolhatod a sorszámozás utáni kötésmargót a szerkesztő bal oldalán. A kötésmargó szinkronban marad a görgetési pozícióval, és gépelés közben frissül.                                                                                                                               |
| **Keresés**                               | `#szakértői-kereső-gomb`                                    | Nyisd meg a lebegő keresősávot (`Ctrl+F`). Gépelj be a kereséshez; a találatok kiemelve jelennek meg az átfedésben. Az `Enter` / `Shift+Enter` navigál a találatok között. Az `Escape` bezárja a sávot.                                                                                      |
| **Kicsinyítés / Kicsinyítés**             | `#szakértői-kicsinyítés-gomb` / `#szakértői-közelítés-gomb` | A szerkesztő betűméretének csökkentése/növelése (8–28 px). A szerkesztő feletti `Ctrl` + egérgörgő (`Cmd` + görgő macOS-en, vagy érintőpados csippentés) lenyomása ugyanezt teszi. A beállítás megmarad.                                                                                     |
| **Paletták**                              | `#szakértői-paletta-gomb`                                   | A bal oldali mnemonikus paletta megjelenítése/elrejtése                                                                                                                                                                                                                                      |
| **Diazmus**                               | `#szakértői-disazm-gomb`                                    | A szétszerelési panel megjelenítése/elrejtése (tiszta 6502, makrók kibontva)                                                                                                                                                                                                                 |
| **Monitor**                               | `#szakértői-monitor-gomb`                                   | A monitor hex-dump paneljének megjelenítése/elrejtése                                                                                                                                                                                                                                        |
| **Minitérkép**                            | `#szakértői-minitérkép-gomb`                                | A kód minitérkép sávjának megjelenítése/elrejtése a szerkesztő jobb oldalán                                                                                                                                                                                                                  |
| **Projekt panel**                         | `#szakértői-projekt-gomb`                                   | Projektpanel megjelenítése/elrejtése (fájlok, szimbólumok, projektbeállítások)                                                                                                                                                                                                               |
| **Ciklusszám**                            | `#szakértői-ciklusok-gomb`                                  | Ciklusvonal megjelenítése/elrejtése — lásd: [Ciklusszámlálók](#cycle-counts)                                                                                                                                                                                                                 |
| **Ugrás a sorhoz / Könyvjelzők**          | `#szakértői-lépés-sorra`, `#szakértői-könyvjelző-*`         | A Ctrl+G egy sorra ugrik; a Ctrl+F2 ki-be kapcsolja a könyvjelzőt, az F2 / Shift+F2 a következő / előző sorra ugrik                                                                                                                                                                          |
| **ACME építése**                          | `#expert-acme-build-btn`                                    | ACME módban: forráskód létrehozása ACME-vel — lásd: [ACME mód](#acme-mode)                                                                                                                                                                                                                   |

*(Újdonság a 2.3.9. verzióban.)* Egy ponttal kezdődő címke — `.loop`, `.skip`,
`.done` — egy **lokális címke**. A legközelebbi megelőző **global** (nem
pontozott) címke hatókörébe tartozik, és belsőleg `<global>.<name>` lesz. Két
azonos rövid nevű, különböző globális címkék alatti lokális címke nem ütközik
**nem**.

### Önmódosító kód operandus címkéi

*(Újdonság a 2.3.9-es verzióban.)* Az utasítás operandusának elé `címke:` kerül,
hogy a címkét az **operandus bájtjára helyezzük el** az opkód helyett. Az
utasítás a kettőspont utáni értékből áll össze.

| Sáv színe        | Token típusa                                              |
| ---------------- | --------------------------------------------------------- |
| Megjegyzés színe | `;` kezdetű sorok                                         |
| Címke színe      | `címkével ellátott vonalak:` definíció                    |
| Irányelv színe   | `.byte`, `.macro`, `.region` és az összes többi direktíva |
| Emlékeztető szín | Minden más (utasítások)                                   |

Az `érték` az `<utasításcím> + 1` (az első operandus bájt) címre mutat, minden
címzési mód esetén. Ez felváltja a régebbi `STA utasítás+1` / `utasítás: LDA
#$00` mintát. Blokk ⇄ Szakértő módban körbejár (az operandus mező megtartja az
`címke:` előtagot).

### Ciklusszámlálás

Az **ciklusszámláló** eszköztárgomb (óra ikon) egy ereszcsatornát ad hozzá,
amely minden utasítássor 6510 ciklusát mutatja:

| Megjelenik    | Jelentés                                                                                                                                               |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `4`           | állandó költség                                                                                                                                        |
| `4+`          | indexelt olvasás (`abs,X`, `abs,Y`, `(zp),Y`): +1, amikor az index áthalad egy oldalon; egy oldalhoz igazított alap (`$xx00`) mutatja a pontos értéket |
| `2/3`         | ág: nem foglalt / foglalt                                                                                                                              |
| `2/4` (piros) | oldalt keresztező elágazás – érdemes tudni az időzített kódban                                                                                         |

Válasszon ki több sort, és az állapotsor mutatja az összeget: utasítások száma,
min-max ciklusok és a PAL raszter sorok száma (63 ciklus). A makrókat és az
adatsorokat nem számolja a rendszer. A beállítást a rendszer megjegyzi.

### Optimalizálási tippek

A Szakértő szerkesztő ellenőrzi az összeállított kódot a gyakori
kukucskálóminták után. A tippet tartalmazó sorok borostyánsárga csíkot kapnak,
és egy **N tippek** gomb jelenik meg az állapotsorban; kattintson rá a lista
megjelenítéséhez, és kattintson egy tippre az adott sorra ugráshoz. A tippek
soha nem változtatják meg a kódot:

- `JSR x`, majd `RTS` → `JMP x` (1 bájttal rövidebb, 9 ciklussal gyorsabb);
- `CMP #0` / `CPX #0` / `CPY #0` közvetlenül egy olyan utasítás után, amely már
  beállította az N/Z regisztert az adott regiszterhez (megjegyzés: az
  összehasonlítás a C regisztert is beállítja);
- ugyanaz a betöltés kétszer, vagy az imént tárolt értékű betöltés (`STA x` /
  `LDA x`);
- `LDA m` / `CLC` / `ADC #1` / `STA m` → `INC m`, és az `SEC` / `SBC #1` űrlap →
  `DEC m`;
- egy `JMP` vagy elágazás a legkövetkező utasításra, és az `PHA`, amelyet
  közvetlenül az `PLA` követ.

Két utasítás közötti címke (egy lehetséges ugrási célpont) elnyomja azokat a
tippeket, amelyek egyesítésükre szolgálnának.

### Hiba a kiemelés során

A sikertelenül lefordított sorokat valós időben **piros** (színezett háttér +
bal oldali ékezetes szegély) jelöli a program, minden billentyűleütés után 350
ms-mal. Az első hibaüzenet az állapotsorban is megjelenik. Javítsa ki a sort, és
a kiemelés automatikusan eltűnik.

### Szintaxis kiemelése

A szerkesztő egy átlátszó `<div>` réteget (`expert-hl`) használ, amely a
szövegterület tartalmát színes `<span>` elemekkel tükrözi.

| Szín       | Jelképes                                                                                                                                              |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sárgászöld | Mnemonikok (`LDA`, `STA`, `JMP`, …) és hosszú elágazású pszeudo-opciók (`LBNE`, `LBEQ`, …)                                                            |
| Kék        | Irányelvek (`.byte`, `.word`, `.fill`, `.assert`, `*=`, …)                                                                                            |
| Narancs    | Számok (`$FF`, `%1010`, `255`)                                                                                                                        |
| Cián       | Címkék — `:` végződésű sorok, beleértve a lokális címkéket (`.loop:`) és az önmódosító kódú operandus címkéket (`value:` az `LDA value:#$00` részben) |
| Böjti réce | Karakterlánc literálok                                                                                                                                |
| Ibolya     | Egyéni makrónevek — a `.macro`, `.invoke` és `.call`, valamint a Kick-stílusú `:name(...)` hívások utáni név                                          |
| Víz        | Makróparaméterek – a paraméterek nevei a `.macro` fejlécben és az `{param}` helyettesítések a makró törzsében                                         |
| Sötétzöld  | Hozzászólások (`; …`)                                                                                                                                 |

A `REGION` / `ENDREGION` direktívák a többi assembler direktívához hasonlóan
kiemelve jelennek meg. Az összecsukott régiók csak a régió fejlécét tartják
láthatónak a szerkesztőben, amíg újra meg nem nyitod őket. Az új **Region
selection** eszköztár kapcsolója csak az aktuális régió automatikus kiemelését
vezérli Szakértő módban; kikapcsolása esetén a forrás látható marad a hajtási
állapot megváltoztatása nélkül.

### Forrásformázó

Kattintson az **Formátum** gombra (`#expert-format-btn`) az aktuális forrás
automatikus formázásához:

- A címkedefiníciók a 0. oszlopba kerülnek.
- Az utasítások 4 szóközzel vannak behúzva.
- A mnemonikus szavak nagybetűsek.
- Pontosan egy szóköz a mnemonikus és az operandus között (a plusz szóközök
  normalizáltak).
- Ha a forrás már formázott, akkor a `„Már formázva”` állapot jelenik meg.

### Projekt panel és fülek

A Szakértő mód támogatja a **projektpanelt** (`#expert-project-panel`)
többfájlos `.proj` projektekhez:

- Az `.proj` fájl egy JSON manifest, amely felsorolja a forrásfájlokat és azok
  metaadatait.
- Nyiss meg egy projektet a **Menü → Fájl → Projekt megnyitása** menüponttal,
  vagy húzz egy `.proj` fájlt az ablakba.
- A projektben található minden fájl külön **fülként** nyílik meg a szerkesztő
  tetején található fülsávon.
- **Projekt bezárása** (`Menü → Fájl → Projekt bezárása` /
  `#menu-close-project`) egyszerre bezárja az aktuális projektet és az összes
  fájlfülét. Bezárás előtt rákérdez a nem mentett módosítások mentésére. A
  projektpanel visszaáll üres állapotába.
- Minden fájl megjelölhető **indítófájlként** (★ csillag ikon). Amikor beállít
  egy indítófájlt, a **Futtatás** gomb (PRG, D64, Ultimate) mindig összeállítja
  és futtatja az adott fájl kódját – függetlenül attól, hogy melyik lap aktív.
  Ez blokk módban és Szakértő módban is működik.
- Az eszköztár **Hozzáadás** gombja egyszerre egy vagy több fájlt választ ki
  (bármilyen típust, nem csak az `.json`/`.asm`), és a projektben hivatkozik
  rájuk anélkül, hogy megnyitná őket – bináris eszközökhöz, például az `incbin`
  adatokhoz használható. A párbeszédpanel alapértelmezés szerint a VA
  munkamappát használja. A szomszédos **Mappa hozzáadása** gomb ugyanígy
  hivatkozik egy egész mappára (pl. egy eszközkönyvtárra). A csak hivatkozásként
  szolgáló bejegyzéseknél egy törlés (✕) gomb látható, de rájuk kattintva nem
  nyílnak meg.
- A **Projektbeállítások** (a fogaskerék gomb a panel fejlécében, vagy a **Menü
  → Fájl → Projektbeállítások…**) menüpontban megjeleníthetők és szerkeszthetők
  a projekt: név, `.proj` elérési út, indítófájl, assembler (VMA vagy ACME),
  **KickAssembler kompatibilis**, valamint egy Kick projekt esetében az
  előfeldolgozó szimbólumok (`#define`, mint például a KickAssembler
  `-define`-je) és a parancssori változók (`cmdLineVars`, soronként egy
  `name=value`, mint például a `:name=value`), egy VMA projekt esetében pedig a
  szimbólumok. (`.define`) és konstansok (`.const`, soronként egy `NAME=value`)
  — ezek a projekt által felépített forráskód előtt szerepelnek, tehát a `.if
  NAME` / `.if NAME == 3` a forráskód szerkesztése nélkül váltanak build-et —
  plusz a forrás- és egyéb fájlok száma, és a **Csak szakértői mód**: a blokk
  mód zárva van a projekt fájljai számára, méretüktől függetlenül. Minden a
  `.proj` fájlba kerül mentésre.
- A fában lévő mappák egy összecsukó/kibontó nyíllal rendelkeznek, és a **jobb
  gombbal kattintson egy mappára** egy vagy több beágyazott fájl hozzáadásához
  (behúzva látható).
- Az **Projekt mentése** gomb automatikusan kikapcsol és „Mentett” állapotot
  mutat, ha a projektnek nincsenek függőben lévő módosításai, majd automatikusan
  újra engedélyeződik, amint hozzáad, eltávolít vagy átszervez egy fájlt vagy
  mappát.
- A projektpanel alján található **szimbólumok** szakasz függőlegesen
  átméretezhető a fájlfa és a szimbólumlista közötti elválasztóval, így a hosszú
  szimbólumlisták szükség esetén több helyet foglalhatnak el.
- A **Verziókövetés** a teljes projektre vonatkozik: a Verziókövetés
  párbeszédpanel **Projekt** kapcsolójával egy commit rögzít minden
  projektfájlt, a Checkout pedig visszaállítja azokat a fülekre. Lásd: [Projekt
  mód](#project-mode).

### Tab sáv

A fülsáv a szerkesztő felett jelenik meg, ha egynél több fül van megnyitva.

| Jellemző                         | Leírás                                                                                                                                                                                                                                                                                                                      |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Piszkos pötty**                | A lap nevében egy kis, színes pont jelzi a nem mentett módosításokat.                                                                                                                                                                                                                                                       |
| **Görgetőnyilak**                | Bal/jobb görgetőgombok jelennek meg, ha több fül van, mint amennyi elfér a sávon                                                                                                                                                                                                                                            |
| **Bezárás (×)**                  | Bezárja a fület; mentésre kér, ha a fül piszkos                                                                                                                                                                                                                                                                             |
| **Fájlkiterjesztés**             | A teljes fájlnév, beleértve a kiterjesztést is (`.json`, `.asm`, `.ub` …) látható.                                                                                                                                                                                                                                          |
| **Ctrl+N**                       | Megnyit egy új, üres lapot (nem akkor, ha egy modális párbeszédablak van megnyitva)                                                                                                                                                                                                                                         |
| **Jobb gombbal előhívható menü** | Jobb klikk egy fülre (vagy üres fülsávra) a következőkhöz: **Új fül**, **Fül bezárása**, **További fülek bezárása**, **Jobb oldali fülek bezárása**, **Összes fül bezárása**. Kötegelt bezárási műveletek kérése minden piszkos fülön, és leállítás, ha megszakítja. Az **Összes bezárása** mindig egy üres fület hagy meg. |

> **Tipp:** A Paletta szinkronizálása (`#expert-palette-sync-btn`) szinkronban
> tartja a paletta kiválasztását a kurzornál lévő emlékeztetővel. Kapcsold ki,
> ha nem szeretnéd, hogy a paletta ugráljon szerkesztés közben.

### ACME mód

**Beállítások → Általános → Assembler mód** kiválasztja a Szakértői szerkesztő
assemblerjét:

- **VMA mód** (alapértelmezett) — a beépített Visual Assembler assembler a
  blokkjaival, makróival és `.` direktíváival.
- **ACME mód** — a forrás az ACME 0.97 szöveg, amelyet az ACME futtatható fájlja
  állít össze, amely a **Beállítások → Fájlok és elérési utak → ACME** (**ACME
  kiválasztása**) menüpontban van beállítva. Az `ACME-0.97-reference.pdf` leírja
  a nyelvet.

A mód egy `.proj` projekttel kerül mentésre, így minden projekt a saját
assemblerjével nyílik meg. Az ACME mód csak szövegszerkesztésre alkalmas: a
Blokk / Szakértő kapcsoló zárolva van, és az **Oktatóanyagok** gomb rejtett (a
leckék blokkokból építik fel a VMA programokat).

Ami az ACME build után következik:

- A **Build** (a kalapács gomb a Szakértői eszköztáron, *Build ACME forráskód*),
  **Run** (PRG, D64, C64 Ultimate, Kung Fu Flash 2), **Build PRG**, **Build
  D64**, **Build CRT**, **Build project** és **Debug (RetroDebugger)** fájlok az
  ACME-n keresztül fordulnak; az ACME hibák és figyelmeztetések a normál
  fordítási hiba párbeszédablakban nyílnak meg, a forráskód sorral együtt.
- Egy gépelési szünet után a forrás újraépül, így az **memóriatérkép**
  (memóriacsík, szegmens panel, átfedés figyelmeztetés), az **Disassembly** és
  **Monitor** panelek, valamint a ciklushatár a valódi ACME kimenetet mutatja; a
  panelek az ACME címkéket használják. Az átfedés egy olyan cím, amelyet két
  forrássor ír ki (az utóbbi nyer a PRG-ben).
- A **Hibakeresési fájlok** (*Hibakeresési fájlok generálása* a Beállítások →
  Általános menüpontban) az ACME címkekiírásból készülnek: `.sym` (KickAssembler
  stílus) és `.vs` (VICE címkék) a PRG mellett; ACME módban nincs `.dbg`
  forráskód-leképezés. A **Debug (RetroDebugger)** ugyanazokat a címkéket kapja,
  és az Expert töréspontokat az ACME jelentés helyezi el (a kód nélküli sorban
  lévő töréspont a következő kódsorban megáll).
- A **ciklusszámok** és az **optimalizálási tippek** az utolsó build ACME
  jelentéséből (`-r`) származnak.
- Az **VICE Monitor** hot reload csak az ACME által ténylegesen létrehozott
  címtartományokat írja ki; az élő figyelés és a profiler az ACME címkéit és
  forrássorait használja.
- A SID, Hi-Res, Level, Curve és Table szerkesztők ** blokkjaiba exportálás **
  esetén az ACME forráskód a fájl végére kerül beszúrásra (`!byte`, `!word`,
  `!fill`, `NAME = value`; a VA makrók utasításként vannak kiírva).

A kiemelés és az automatikus kiegészítés ismeri az ACME szintaxist: `!` pszeudo
opkódok, `+név` makróhívások, kettőspont nélküli címkék, névtelen `-` / `+`
címkék és `;` megjegyzések. Az ACME forrásban található VMA direktíva (`.byte`,
`.macro` …) és a VMA forrásban található ACME `!` direktíva hibaként jelenik
meg.

```asm
* = $c000
start ldx #0
- lda szöveg,x
beq +
sta $0400,x
inx
bne -
+ rts
szöveg !scr "hello acme", 0
```

A `samples/ACME/acme-crt-demo.asm` egy kis ACME tesztprogram a Run, Build PRG /
D64 és Build CRT futtatásához: egy üzenet a képernyő közepén és raszteres színes
sávok a szegélyen, KERNAL hívások nélkül, tehát a kazettáról is fut.

---

## 8. Standard 6502 utasítások

Minden 6502-es utasítás egy vagy több címzési módot támogat. A módválasztó
minden blokkon megjelenik.

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

### Adatmozgás

Bármely operandusmező, amely címet vagy azonnali értéket fogad el, közvetlenül
elfogad egy **konstans nevű** értéket is (egy `CONST` blokkból vagy egy
`LABEL`-ből). Ezenkívül használhatod a **label+offset** vagy az **label−offset**
kifejezéseket egy elnevezett konstanshoz viszonyított címre való hivatkozáshoz:

| Szintaxis | Példa                   | Leírás                                                                                                             |
| --------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `LDA`     | Töltésakkumulátor       | azonnali, nulla oldal, abszolút, abszolútX, abszolútY, közvetettX, közvetettY                                      |
| `LDX`     | X regiszter betöltése   | azonnali, nulla oldal, nulla oldalY, abszolút, abszolútY                                                           |
| `LDY`     | Y regiszter betöltése   | azonnali, nulla oldal, abszolút, abszolútX                                                                         |
| `STA`     | Tároló akkumulátor      | zeroPage, abszolút, abszolútX, abszolútY, közvetettX, közvetettY                                                   |
| `STX`     | X pénztárgép üzlet      | nulla oldal, nulla oldalY, abszolút                                                                                |
| `STY`     | Y pénztárgép tárolására | nulla oldal, abszolút                                                                                              |
| `*`       | `BNE *`                 | Aktuális programszámláló (az utasítás saját címe); az `*` elágazások végtelen önhurkot generálnak (eltolás: `$FE`) |

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

### Számtani

*(Újdonság a 2.3.9-es verzióban.)* `*` már nem korlátozódik a teljes operandusra
– megjelenhet **egy operanduskifejezésen belül bárhol**, és annak az utasításnak
a címét jelöli, amelyre írták. Assembly időben feloldódik az utasítás valódi
címe alapján, így nincs szükség címkére a rövid relatív ugrásokhoz vagy a PC-hez
viszonyított adatolvasásokhoz.

| Szintaxis | Példa                     | Jelentés                                                                        |
| --------- | ------------------------- | ------------------------------------------------------------------------------- |
| `*`       | `BNE *`                   | A legtöbb esetben használat előtt állítsa be a hordozást az `SEC` paraméterrel. |
| `SBC`     | Kivonás átvitellel        | Kivonás előtt állítsa be az átvitelt `SEC`-cel                                  |
| `INC`     | Memória növelése          | —                                                                               |
| `DEC`     | Memória csökkentése       | —                                                                               |
| `CMP`     | Hasonlítsa össze az A-val | Jelzőket állít be; nem módosítja az A-t                                         |

**PC vs. szorzás.** Az `*` csak akkor kezeli a programszámlálót, ha az
*értékpozícióban* található — a kifejezés elején, vagy közvetlenül egy operátor,
`(`, `,`, `<`, `>` vagy szóköz után. Egy `*`, amely egy számot, `)` vagy egy
azonosítót követ, közönséges szorzásnak minősül, tehát az `LDA table*2` és a
`CONST_A*4` változatlanok maradnak.

**Hol működik.** Bármely operandus, amely már elfogad egy kifejezést: elágazási
célpontok, `JMP` / `JSR`, `LDA`/`STA`/… abszolút és indexelt, azonnali
alacsony/magas bájtos operátorok, és az `.assert` kifejezés. Az `*` soha nem
változtatja meg egy utasítás méretét, így minden címzési módban biztonságos.

### Logika

*(Újdonság a 2.3.9. verzióban.)* Egy ponttal kezdődő címke — `.loop`, `.skip`,
`.done` — egy **lokális címke**. A legközelebbi megelőző **global** (nem
pontozott) címke hatókörébe tartozik, és belsőleg `<global>.<name>` lesz. Két
azonos rövid nevű, különböző globális címkék alatti lokális címke nem ütközik
**nem**.

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
- A lokális címkék változatlanok maradnak a Blokk ⇄ Szakértő módban; az
  `<globális>.` előtag egy elrendezési idejű részlet, és soha nem kerül
  tárolásra a blokkprogramban.

### Ugrások és ágak

*(Újdonság a 2.3.9-es verzióban.)* Az utasítás operandusának elé `címke:` kerül,
hogy a címkét az **operandus bájtjára helyezzük el ** az opkód helyett. Az
utasítás a kettőspont utáni értékből áll össze.

```
beállítás:
LDA érték:#$00 ; 'érték' -> a #$00 operandus bájt címe
...
javítás:
LDA #új
STA érték ; közvetlenül írja az operandus bájtot — klasszikus SMC
```

Az `érték` az `<utasításcím> + 1` (az első operandus bájt) címre mutat, minden
címzési mód esetén. Ez felváltja a régebbi `STA utasítás+1` / `utasítás: LDA
#$00` mintát. Blokk ⇄ Szakértő módban körbejár (az operandus mező megtartja az
`címke:` előtagot).

---

## 9. Makróblokkok – Referencia

### LABEL

| Emlékezeterősítő | Leírás                                                    | Módok                                                                         |
| ---------------- | --------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Címke neve       | Az `JMP`, `JSR`, `BNE` stb. fájlokban használt azonosító. | azonnali, nulla oldal, abszolút, abszolútX, abszolútY, közvetettX, közvetettY |
| `LDX`            | X regiszter betöltése                                     | azonnali, nulla oldal, nulla oldalY, abszolút, abszolútY                      |
| `LDY`            | Y regiszter betöltése                                     | azonnali, nulla oldal, abszolút, abszolútX                                    |
| `STA`            | Tároló akkumulátor                                        | zeroPage, abszolút, abszolútX, abszolútY, közvetettX, közvetettY              |
| `STX`            | X pénztárgép üzlet                                        | nulla oldal, nulla oldalY, abszolút                                           |
| `STY`            | Y pénztárgép tárolására                                   | nulla oldal, abszolút                                                         |

### COMMENT

| Emlékezeterősítő | Leírás                    | Megjegyzések                                                                    |
| ---------------- | ------------------------- | ------------------------------------------------------------------------------- |
| `ADC`            | Hozzáadás átvitellel      | A legtöbb esetben használat előtt állítsa be a hordozást az `SEC` paraméterrel. |
| `SBC`            | Kivonás átvitellel        | Kivonás előtt állítsa be az átvitelt `SEC`-cel                                  |
| `INC`            | Memória növelése          | —                                                                               |
| `DEC`            | Memória csökkentése       | —                                                                               |
| `CMP`            | Hasonlítsa össze az A-val | Jelzőket állít be; nem módosítja az A-t                                         |
| `CPX`            | Hasonlítsa össze X-szel   | —                                                                               |
| `CPY`            | Hasonlítsa össze Y-nal    | —                                                                               |

### BYTE

| Emlékezeterősítő | Leírás                                                                         |
| ---------------- | ------------------------------------------------------------------------------ |
| Operandus        | Vesszővel elválasztott bájtértékek (pl. `$01, $02, $FF` vagy `1, 2, 255`)      |
| `ORA`            | Logikai VAGY akkumulátorral                                                    |
| `EOR`            | Exkluzív VAGY akkumulátorral                                                   |
| `BIT`            | A memória bitjeinek tesztelése A-val szemben (beállítja az N, V és Z jelzőket) |

### WORD

| Emlékezeterősítő | Leírás                                                             |
| ---------------- | ------------------------------------------------------------------ |
| Operandus        | Vesszővel elválasztott 16 bites értékek (pl. `$0400, $C000`)       |
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

*(Újdonság a 2.3.9-es verzióban.)* A **Hosszú ágak** palettakategória nyolc
pszeudo-opciót tartalmaz, amelyek feltételes elágazásokként viselkednek, de
**bármely címet** érnek el, nem csak a −128…+127 címet. Mindegyik egy invertált
ágat alkot, amely kihagy egy 3 bájtos `JMP` címet — mindig **5 bájtot**:

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

### FILL

| Emlékezeterősítő | Leírás                                                  |
| ---------------- | ------------------------------------------------------- |
| Operandus        | `count,value` — pl. `256,0` 256 bájtot nullával tölt ki |
| `TAY`            | Átvitel A → Y                                           |
| `TXA`            | X → A átvitel                                           |
| `TYA`            | Y → A átvitel                                           |
| `TSX`            | Átviteli verem mutató → X                               |
| `TXS`            | X átvitel → Veremmutató                                 |
| `INX`            | X lépésköz                                              |
| `DEX`            | Csökkentés X                                            |
| `INY`            | Y irányú növekmény                                      |
| `DEY`            | Y csökkentése                                           |

### ALIGN

| Emlékezeterősítő | Leírás                                                                     |
| ---------------- | -------------------------------------------------------------------------- |
| Határ            | Igazítási érték — pl. `64` (sprite határ), `256` (oldal), `$2000` (bitkép) |
| `LSR`            | Logikai eltolás jobbra                                                     |
| `ROL`            | Balra forgatás átvitellel                                                  |
| `ROR`            | Jobbra forgatás Carry-n keresztül                                          |

### TEXT

| Emlékezeterősítő   | Leírás                                                          |
| ------------------ | --------------------------------------------------------------- |
| Szöveg             | A megjelenítendő karakterlánc                                   |
| X                  | Oszlop (0–39)                                                   |
| Y                  | Sor (0–24)                                                      |
| Címke (opcionális) | Hozzárendel egy címkét, amely a kiszámított képernyőcímre mutat |

### STRING

| Emlékezeterősítő         | Leírás                                                                               |
| ------------------------ | ------------------------------------------------------------------------------------ |
| Szöveg                   | A kiírandó karakterlánc                                                              |
| Cím                      | Cél memóriacím — `$C000` hex vagy egy **címkenév**                                   |
| Címke (opcionális)       | Hozzárendel egy címkét, amely a célcímre mutat                                       |
| Váltás                   | Hex érték (00–FF) hozzáadva minden képernyőkód bájthoz (pl. `$80` = fordított videó) |
| Kisbetűs karakterkészlet | Jelölőnégyzet – ugyanaz a szemantika, mint a TEXT esetében (lásd a TEXT részt)       |
| `SED`                    | Decimális mód beállítása                                                             |
| `SEI`                    | Megszakítás letiltásának beállítása                                                  |
| `NEM `                   | Nincs művelet                                                                        |
| `BRK`                    | Kényszermegszakítás / szoftveres megszakítás                                         |

### DATA

Mint egy **POKE ciklus** — futásidőben egy nyers bájtok listáját írja ki egy
memóriacímre, bájtonként egy LDA/STA párt.

`LAX`, `SAX`, `DCP`, `ISC`, `SLO`, `RLA`, `SRE`, `RRA`, `ANC`, `ALR`, `ARR`,
`AXS`, és az `NOP` formák, amelyek operandust olvasnak be: `NOP #$nn` ($80),
`NOP $nn` ($04), `NOP $nn,X` (14 USD), `NOP $nnnn` (0C USD), `NOP $nnnn,X` (1C
USD)

---

## 10. Hibakereső integráció

Az alkalmazás támogatja a **RetroDebugger** külső C64 hibakeresőt. Ez a program
fogadja az összeállított programból generált töréspontokat, szimbólumokat és
autostart flageket.

---

### RetroDebugger

A [RetroDebugger]{1} egy többplatformos Commodore 64 hibakereső
töréspont-támogatással, memória-ellenőrzéssel és címke-érzékeny szétszereléssel.

| Mező       | Leírás                                                    |
| ---------- | --------------------------------------------------------- |
| Címke neve | Az `JMP`, `JSR`, `BNE` stb. fájlokban használt azonosító. |

**Szakértői szintaxis:**
```
hurok:
```

**Generált ASM:**
```
hurok: ; $0820
```

Az aktuális cím megjegyzésként jelenik meg. A címkék mérete **0 bájt **.

---

### Töréspont blokkok

Kattintson a töréspont ikonra (●) bármelyik utasításblokkon, ha azt
töréspontként szeretné beállítani. A töréspontos blokkok pirossal vannak
kiemelve. Címük minden hibakereső indításakor beíródik a töréspont fájlba.

**Szakértői szintaxis:**
```
; A hozzászólásod szövege ide
```

**Generált ASM:**
```
; A hozzászólásod szövege ide
```

---

### Hibakereső jelzők (Beállítások fül)

Mint az **DATA a BASIC**-ben — nyers bájtértékek listáját tárolja a programban.

| Mező      | Leírás       |
| --------- | ------------ |
| Operandus | `-jump $CÍM` |

**Szakértői szintaxis:**
```
.byte $01, $02, $FF
```

**Generált ASM:**
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

| Mező      | Leírás                                                       |
| --------- | ------------------------------------------------------------ |
| Operandus | Vesszővel elválasztott 16 bites értékek (pl. `$0400, $C000`) |

**Szakértői szintaxis:**
```
.szó $0400, $C000
```

**Generált ASM:**
```
.szó $0400, $C000
```

**Méret:** 2 bájt szavanként.

---

### KITÖLTÉS

Mint például a `FOR I=1 TO N : POKE addr+I, val : NEXT` — egy memóriablokkot
tölt ki ugyanazzal a bájttal, de egyetlen blokkban. Nagyszerű területek
törlésére vagy táblázatok előzetes feltöltésére.

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

| Mező  | Leírás                                                                     |
| ----- | -------------------------------------------------------------------------- |
| Határ | Igazítási érték — pl. `64` (sprite határ), `256` (oldal), `$2000` (bitkép) |

**Szakértői szintaxis:**
```
.align 64
.align 2000 dollár
```

**Generált ASM:**
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

- **Nagybetűs karakterkészlet (alapértelmezett, jelölőnégyzet nincs
  bejelölve):** Írja be, amit nagybetűvel szeretne látni. A `"HELLO"` így
  jelenik meg: `HELLO`. A kisbetűs bevitel nagybetűs képernyőkódokhoz van
  rendelve.
- **Kisbetűs karakterkészlet (jelölőnégyzet bejelölve):** Írd be a kívánt
  kisbetűs/nagybetűs karakterkészletet. `"hello"` → kisbetűs megjelenítés,
  `"HELLO"` → nagybetűs megjelenítés. Futásidejű karakterkészlet-váltást igényel
  a képernyőre írás előtt (használd a **CHARSET lower** makrót).

**Generált ASM (nagybetűs mód, `"HELLO"`):**
```
LDA #$08 ; 'H' képernyőkód $08
STA $0400
LDA #$05 ; 'E' képernyőkód $05
STA $0401
...
```

**Szakértői szintaxis:**
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

| Mező                     | Leírás                                                                               |
| ------------------------ | ------------------------------------------------------------------------------------ |
| Szöveg                   | A kiírandó karakterlánc                                                              |
| Cím                      | Cél memóriacím — `$C000` hex vagy egy **címkenév**                                   |
| Címke (opcionális)       | Hozzárendel egy címkét, amely a célcímre mutat                                       |
| Váltás                   | Hex érték (00–FF) hozzáadva minden képernyőkód bájthoz (pl. `$80` = fordított videó) |
| Kisbetűs karakterkészlet | Jelölőnégyzet – ugyanaz a szemantika, mint a TEXT esetében (lásd a TEXT részt)       |

**Szakértői szintaxis:**
```
.string $C000, "HELLO" ; nagybetűs karakterkészlet (alapértelmezett)
.string $C000, "hello", alsó ; kisbetűs karakterkészlet
.string $C000, "HELLO", 80 ; eltolásos (fordított videó)
.string $C000, "hello", 80, alsó ; shift + kisbetűs
.string $C000, "HELLO" :my_string ; makrócímkével
```

**Generált ASM:**
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

| Mező               | Leírás                                             |
| ------------------ | -------------------------------------------------- |
| Bájtok             | Vesszővel elválasztott bájtértékek                 |
| Cím                | Cél memóriacím — `$C000` hex vagy egy **címkenév** |
| Címke (opcionális) | Hozzárendel egy címkét, amely a célcímre mutat     |

**Szakértői szintaxis:**
```
.data $C000, $01, $02, $03 ; hex cím
.data my_buf, $01, $02, $03 ; címke cím
.data $C000, $01, $02, $03 :mydata ; makrócímkével
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

Mint az **DATA, ami közvetlenül a memóriába töltődik** – egyáltalán nincs
futásidejű kód. A bájtok a PRG betöltésének pillanatától kezdve jelen vannak,
még mielőtt a kódod elindulna. Használd ezt sprite adatokhoz, szinttérképekhez,
keresőtáblákhoz, bármihez, aminek csak egy adott címen kell lennie.

| Mező               | Leírás                                             |
| ------------------ | -------------------------------------------------- |
| Bájtok             | Vesszővel elválasztott bájtértékek                 |
| Cím                | Cél memóriacím — `$C000` hex vagy egy **címkenév** |
| Címke (opcionális) | Hozzárendel egy címkét, amely a célcímre mutat     |

**Szakértői szintaxis:**
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

---

### NYERS SZÖVEG

Mint a RAWBYTES, de szöveg esetén — képernyőkódként kódolja a karakterláncot, és
a bájtokat egy fix címre helyezi **futásidejű kód nélkül **. A szöveg a PRG
betöltése után azonnal készen áll a memóriában.

| Mező                     | Leírás                                                                               |
| ------------------------ | ------------------------------------------------------------------------------------ |
| Szöveg                   | Kódolandó karakterlánc                                                               |
| Cím                      | Cél memóriacím — `$C000` hex vagy egy **címkenév**                                   |
| Címke (opcionális)       | Hozzárendel egy címkét, amely a célcímre mutat                                       |
| Váltás                   | Hex érték (00–FF) hozzáadva minden képernyőkód bájthoz (pl. `$80` = fordított videó) |
| Kisbetűs karakterkészlet | Jelölőnégyzet – ugyanaz a szemantika, mint a TEXT esetében (lásd a TEXT részt)       |

**Szakértői szintaxis:**
```
.rawtext $C000, "HELLO" ; nagybetűs karakterkészlet (alapértelmezett)
.rawtext $C000, "hello", alsó ; kisbetűs karakterkészlet
.rawtext $C000, "HELLO", 80 ; eltolásos karakterkészlet (fordított videó)
.rawtext $C000, "hello", 80, alsó ; shift + kisbetűs karakterkészlet
.rawtext $0400, "HELLO" :my_text ; makrócímkével
```

**Generált ASM:**
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

Mint az **RAWBYTES, de a KERNAL kimenete ** — PETSCII bájtként kódolja a
karakterláncot (kompatibilis a CHROUT-tal a `$FFD2` címen), és fix címre helyezi
őket futásidejű kód nélkül. Ezt akkor használd, ha karaktereket szeretnél
kinyomtatni a `JSR $FFD2` címen keresztül egy ciklusban, és vedd figyelembe,
hogy az új `PRINT` makró ugyanazt a kódolót és kisbetűs jelölőnégyzet
viselkedést használja.

> **PETSCII vs. képernyőkódok:** A PETSCII és a képernyőkódok két különböző
> kódolás. A képernyőkód: `$01` = A betű; a PETSCII `$41` = A betű (CHROUT-on
> keresztül). A PETSCII-t csak KERNAL-on keresztüli nyomtatáskor használd; a
> képernyő RAM-jába való közvetlen íráshoz használd a TEXT/STRING/RAWTEXT
> kódolást.

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

**Nulla terminátor:** Jelölje be az *"`$00` (null terminátor) hozzáfűzése"*
jelölőnégyzetet, hogy automatikusan hozzáadjon egy `$00` bájtot a szöveg után.
Ideális nullával lezárt ciklusokhoz:

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

| Mező | Leírás                                                                                                                                                   |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mód  | **Kisbetűs** — engedélyezi a kisbetűs/nagybetűs karakterkészletet; **Nagybetűs** — visszaállítja az alapértelmezett nagybetűs/grafikus karakterkészletet |

**Szakértői szintaxis:**
```
.charset lower ; váltás kisbetűs karakterkészletre
.charset upper ; visszaváltás nagybetűs/grafikus karakterkészletre
```

**Generált ASM:**

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
CHARSET alsó ; váltás kisbetűs karakterkészletre
TEXT 0, 0, "hello world" ; [jelölőnégyzet: Kisbetűs karakterkészlet]
...
CHARSET felső ; visszaállítja az alapértelmezett értéket, ha kész
```

Vagy szakértői módban:
```
.charset lower
.text 0, 0, "hello world", lower
.charset upper
```

Szakértő módban az `.charset` blokk mostantól a mód legördülő menüben is
végighalad, így a blokk előnézete és az exportált forráskód egy vonalban marad.

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

| Mező                 | Leírás                                                                                                               |
| -------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Karakterkészlet alap | A RAM karakterkészlet alapcíme (alapértelmezett: `$3800`). Úgy kell beállítani, hogy a VIC-II láthassa (lásd alább). |
| Karakterindex        | Melyik karakterhelyet kell újradefiniálni, 0–255. `65` = 'A' az alapértelmezett képernyőkód-elrendezésben.           |
| 8 bájt               | Vesszővel elválasztott bitképsorok, fentről lefelé. Minden bájt 7. bitje = a bal szélső képpont.                     |

**Szakértői szintaxis:**
```
.chardef 3800 dollár, 65 dollár, 18 dollár, 3 cent, 66 dollár, 7 ezer dollár, 66 dollár, 66 dollár, 66 dollár, 00 dollár
```

**Generált ASM (8 × `LDA #b` / `STA célpont+n`, összesen 40 bájt):**
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

CHARDEF $3800, 65, $18,$3C,$66,$7E,$66,$66,$66,$00 ; 'A' újradefiniálása
CHARDEF $3800, 66, $7C,$66,$66,$7C,$66,$66,$7C,$00 ; 'B' újradefiniálása
; ... további CHARDEF hívások minden egyéni karakterhez
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

| Mező              | Leírás                                                                                    |
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

**Szakértői szintaxis:**
```
.box_hit $FB, $F7
```

**Generált ASM (30 bájt, teljesen PC-relatív — nincsenek alprogramok, nincsenek
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

BOX_HIT $FB, $F7 ; tesztjátékos vs. ellenség → A = 0 vagy 1

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
`JSR box_hit_sub`-edet manuálisan egyetlen BOX_HIT blokk köré.

**Összehasonlítás az UB `box_hit()` függvényével:** Az Ultimate Basic ugyanazt a
6502-es logikát használja, mint egy futásidejű függvény, amely egy változóra tér
vissza. A VA-ban a BOX_HIT függvényt oda kell beilleszteni, ahol a tesztre
szükség van; az eredmény az `A` mappában található.

---

### INCBIN

Mint a BASIC**-ben található **BLOAD — kiválaszt egy külső bináris fájlt
(`.bin`, `.prg`, `.sid`, `.raw`) és közvetlenül beágyazza az összeállított
PRG-be a megadott címen.

| Mező | Leírás                                                                 |
| ---- | ---------------------------------------------------------------------- |
| Fájl | Tallózással válasszon ki egy `.bin`, `.prg`, `.sid` vagy `.raw` fájlt. |
| Cím  | Cél betöltési cím (pl. `$C000`)                                        |

**Szakértői szintaxis:**
```
.incbin "zene.bin", $C000
```

**Generált ASM megjegyzés:**
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
fájl 2 bájtos `$6000` betöltési címét eltávolítják), és maga a blokk egy 86
bájtos megjelenítési rutinná fordul le, amely ott fut, ahol a blokk található.

| Mező | Leírás                                                                                                                               |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Fájl | Tallózással válasszon ki egy `.koa` / `.kla` fájlt (10003 bájt, vagy 10001 betöltési cím nélkül)                                     |
| Cím  | Bitmap cím: `$6000` (alapértelmezett, Koala natív, VIC bank 1, képernyő RAM `$4400`) vagy `$2000` (VIC bank 0, képernyő RAM `$0400`) |

A megjelenítési rutin a képernyő RAM részét a képernyőre, a színes RAM részét
pedig a `$D800` címre másolja, a háttérbájtot a `$D021` címre írja, kiválasztja
a VIC bankot a `$DD00` címen (a többi portbitet megtartva), és bekapcsolja a
többszínű bitképes módot (`$D011 = $3B`, `$D016 = $18`, `$D018 = $18`). A többi
címet elutasítja: a fennmaradó 8K-s nyílás a BASIC/KERNAL ROM alatt van (a
másolási ciklus ROM-ot olvasna), vagy átfedésben van a karakter-ROM árnyékkal.

**Szakértői szintaxis:**
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
megadott címre kerül. A Hires szerkesztő **Fájlok → Koala exportálása (.koa)…**
menüpontja kompatibilis fájlt hoz létre.

---

### SZINT / SZINT_SOR

Egy **Level Editor** projektet helyez a programodba, és a pálya sorait egy
képernyőpufferbe másolja – egy görgetős játék építőelemei. Lásd a
`samples/level-demo.asm` fájlt egy teljes joystick-os görgetős pálya
megtekintéséhez.

#### SZINT

Egy INCBIN stílusú blokk, amely **0 bájtnyi kódot bocsát ki**. Csak a Level
Editor projekt **elhelyezett** képernyői (a **Fájlok → Szint mentése**
paranccsal mentett `.bin`) kerülnek a memóriába a megadott címről
(alapértelmezett: `$2000`), slot sorrendben, képernyőnként 2000 bájt (1000
képernyőkód + 1000 szín). Az azonos képernyők egyszer tárolódnak, és minden üres
slot egy üres képernyőn osztozik. A pointer táblák a képernyőket követik. Egy
szint legfeljebb 7 × 10 képernyő lehet.

**Szakértői szintaxis:**
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

**Szakértői szintaxis:**
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

| Mező                    | Leírás                                                                                                                      |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Fájl                    | Tallózással válasszon ki egy `.sid` fájlt                                                                                   |
| Egyéni cím (opcionális) | Írja felül a SID natív betöltési címét (pl. `$1000`). Hagyja üresen, ha a SID fejlécben található címet szeretné használni. |

A blokk a következőket jeleníti meg:
- **Cím / Szerző** a SID fejlécből
- **Betöltési cím** — az adat memóriában való elhelyezésének helye (effektív cím
  bármilyen felülbírálás után)
- **Init cím** — JSR-rel hívja meg ezt a függvényt a zene inicializálásához
  (egyéni cím használata esetén az áthelyezéshez igazítva)
- **Lejátszási cím** — ezt JSR-rel hívjuk meg minden IRQ kezelő keretén
  (áthelyezéshez igazítva)
- Egy **(áthelyezett)** jelvény jelenik meg, ha egy egyéni cím elmozdítja az
  adatokat az eredeti pozíciójukból.

**Szakértői szintaxis:**
```
.sid "Ikari_Warriors.sid"
.sid "Ikari_Warriors.sid", 1000 dollár
```

**Generált ASM megjegyzés:**
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

> **Tipikus használat:** Helyezzen el egy ORG blokkot a SID blokk elé a címének
> beállításához. Indításkor hívja meg az Init függvényt, majd hívja meg a Play
> függvényt minden képkockánál egy raszteres IRQ kezelőből — vagy hagyja, hogy a
> [SID_PLAYER](#sid_player) mindkettőt megtegye.

**Címkék:** a SID blokk definiálja az `SID_LOAD` (ahová az adatok kerülnek), az
`SID_INIT` és az `SID_PLAY` címeket (az init és play címek, egy egyéni címmel
együtt mozgatva). Az `SID_PLAY` hiányzik, ha a dallamnak nincs play címe (egy
RSID, amely saját IRQ-t telepít). Használd őket a saját kódodban, pl. `JSR
SID_PLAY` egy IRQ kezelőben.

---

### SID_PLAYER

Egyetlen blokkal játssza le az **SID** makró dallamát: inicializálja a dallamot,
és raszteres megszakításból folyamatosan meghívja a lejátszási rutinját, így a
program folytathatja a saját munkáját.

| Mező    | Leírás                                                                      |
| ------- | --------------------------------------------------------------------------- |
| Dal     | Az A-ban lévő init rutinnak átadott alhangolási szám (alapértelmezett: `0`) |
| Raszter | A megszakítás raszteres vonala, `$00`–`$FF` (alapértelmezett: `$FA`)        |

Mit csinál: `SEI`, `LDA #dal` / `JSR SID_INIT`, kikapcsolja a CIA1 időzítő
IRQ-ját (`$DC0D`), beállítja az IRQ vektort (`$0314/$0315`) a beépített
kezelőjére, a raszter vonalat (`$D012`, a `$D011` 8. bitje törölve) és a raszter
IRQ-t (`$D01A`), `CLI`, majd átugrik a kezelőn. A kezelő nyugtázza a
megszakítást (`ASL $D019`), meghívja a `JSR SID_PLAY` függvényt, majd továbblép
a KERNAL-hoz (`JMP $EA31`), amely szintén beolvassa a billentyűzetet.

**Szakértői szintaxis:**
```
.sid "Ikari_Warriors.sid"
.sid_player
.sid_player 1, 80 dollár
```

**Méret a kódban:** 58 bájt.

> **Megjegyzés:** Szükség van egy SID blokkra a programban (`SID_INIT` és
> `SID_PLAY`); különben a build hibával leáll. Ha a CIA1 időzítő IRQ kikapcsolva
> van, a KERNAL a raszteres IRQ-ból származó képkockánként egyszer fut le – a
> billentyűzet és a `GETIN` továbbra is működik.

---

### BELEÉRTVE

Mint az **MERGE a BASIC**-ben — behív egy másik fájlt, és kibontja a blokkjait
ezen a pozíción. Tökéletes újrafelhasználható alprogramkönyvtárakhoz. A
beillesztett blokkok csak olvashatók az aktuális projektben.

Két fájltípus támogatott:
- **Visual Assembler projekt** (`.json`) — a projekt blokkjai eredeti
  állapotukban kerülnek beillesztésre.
- **Plain assembly source** (`.inc`, `.asm`, `.s`) — a fájl szövegként kerül
  beolvasásra és elemzésre ugyanúgy, mint a szakértői módban. Minden fordításkor
  a fájl újraolvasásra kerül a lemezről (az igazság forrása = a fájl), így
  külsőleg szerkeszthető bármilyen szerkesztővel.

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

- A(z) ** fájlkiterjesztés szükséges szakértői módban** — egy egyszerű nevet,
  mint például az `.include "macros"`, a rendszer `.include "macros.json"`-ként
  kezel.
- Útvonalfeloldás: először a projektfájl melletti (relatív) keresést indítja,
  majd visszatér az alkalmazáshoz mellékelt `samples/` könyvtárba.

**Generált ASM (címfelülírás nélkül):**
```
; .include "library.json" — 12 blokk
... (a kibővített blokkok következnek)
```

**Generált ASM (`C000` betöltési címmel):**
```
; .include "library.json" @ $C000 — 12 blokk
*=$C000
... (a kibővített blokkok következnek)
```

> **Tipp:** Az INCLUDE segítségével újrafelhasználható alprogramkönyvtárakat
> hozhat létre, amelyeket megoszthat a projektek között. Az `.inc`/`.asm`/`.s`
> fájlok akkor a legjobbak, ha a könyvtárat egyszerű szövegszerkesztőben
> szeretné szerkeszteni, vagy más 6502 assemblerekkel szeretné megosztani; a
> `.json` fájlok pedig akkor, ha a könyvtár magában a Visual Assemblerben
> készült. Állítson be egy betöltési címet, ha a könyvtárnak nincs saját ORG-ja,
> vagy ha felül szeretné írni az alapértelmezett elhelyezését.

---

### TÁBLÁZAT

Mint az **DIM egy adott címen** — elnevezi a keresőtáblát, és meghatározza, hogy
hol található a memóriában. A tábla tartalmának meghatározásához BYTE, WORD vagy
FILL blokkokat kell utána elhelyezni.

| Mező | Leírás                                           |
| ---- | ------------------------------------------------ |
| Név  | A tábla címkéjének azonosítója (pl. `színtábla`) |
| Cím  | Fix cím, ahol a tábla kezdődik (pl. `$C000`)     |

**Szakértői szintaxis:**
```
.table színtábla $C000
```

**Generált ASM:**
```
színtábla:
```

A programszámláló a megadott címre ugrik. A tartalom kitöltéséhez a TABLE után
BYTE/WORD/FILL blokkokat kell elhelyezni.

**Méret:** 0 bájt.

---

### ORG

Beállítja, hogy a program (vagy annak egy része) hova kerüljön a memóriában –
mintha egy kezdőcímet választanánk ki a gépi kód beírása előtt. Minden
programhoz legalább egy ORG szükséges. A szabványos C64 BASIC által betölthető
kezdőcím az `$0801`.

| Mező      | Leírás                                                          |
| --------- | --------------------------------------------------------------- |
| Cím       | Az új forráscím (pl. `0801` HEX-ben, vagy `2049` DEC-ben)       |
| HEX / DEC | Váltás a címbevitel hexadecimális és decimális kijelzése között |

**Szakértői szintaxis:**
```
* = C000 dollár
```

**Generált ASM:**
```
* = C000 dollár
```

**Méret:** 0 bájt. Maga az ORG blokk nem generál gépi kódot.

Minden ORG blokk egy új szakaszt indít. Az azt követő blokkok erről a címről
kiindulva kerülnek összeállításra. A PRG exportálásakor az összes szakasz
egyetlen fájlba kerül egyesítésre – a szakaszok közötti réseket nullákkal tölti
ki.

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

> **Tipp:** Minden programnak egy ORG blokkal kell kezdődnie. A C64 BASIC-kel
> betölthető programok tipikus kezdőcíme `$0801` (2049 decimális). Amikor a
> **BASIC SYS csonk** engedélyezve van, az assembler egy rövid BASIC sort ad
> hozzá az `$0801` címen, és a kódod az `$080D` címen kezdődik.

---

### KÖVETKEZŐ / KÖVETKEZŐ

Mint a BASIC-ben a **`FOR X=N TO 1 STEP -1 : ... : NEXT X`** — N-től 1-ig számol
vissza az X vagy Y regiszter használatával. Tegyél ki egy LOOP blokkot, helyezd
el az utasításaidat a blokk és a NEXT regiszter közé, és a blokk automatikusan a
megfelelő számú ciklust ismétli.

#### HUROK

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
LDX #$0A}hurok0:
```

**Méret:** 2 bájt (LD_ opkód + azonnali operandus).

#### KÖVETKEZŐ

| Mező          | Leírás                                        |
| ------------- | --------------------------------------------- |
| Nyilvántartás | Automatikusan illeszkedik a LOOP regiszterhez |
| Címke         | Automatikusan kapcsolódik a LOOP címkéhez     |

**Szakértői szintaxis:**
```
.következő ciklus0
```

**Generált ASM:**
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

| Mező          | Leírás                                                                      |
| ------------- | --------------------------------------------------------------------------- |
| Nyilvántartás | `X` vagy `Y` — a számlálóregiszter                                          |
| Gróf          | Ciklushatár (hex vagy decimális, pl. `$12` = 18). Az X/Y 0-tól 1-ig terjed. |
| Címke         | Automatikusan generált cikluscímke (pl. `for0`)                             |

**Szakértői szintaxis:**
```
X-ért, $12, 0-ért
```

**Generált ASM:**
```
LDX #00$0-ért:
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

| Mező        | Leírás                                                         |
| ----------- | -------------------------------------------------------------- |
| Regiszterek | Bármilyen kombináció: `A`, `X`, `Y`, `AX`, `AY`, `XY`, `XY[X2] |

**Szakértői szintaxis:**
```
.push AXY
```

**Generált ASM (példa: `AX`):**
```
PHA (Védőoltás) Adás PHA
```

**Méret:** 1 bájt A-nak (`PHA`), 2 bájt X-nek vagy Y-nak (átvitel + push).

#### HÚZNI

Visszaállítja a regisztereket a veremből ** fordított sorrendben ** (Y → X → A).

| Mező        | Leírás                                                            |
| ----------- | ----------------------------------------------------------------- |
| Regiszterek | Ugyanaz, mint a PUSH – meg kell egyeznie a megfelelő PUSH blokkal |

**Szakértői szintaxis:**
```
.húzza az AXY-t
```

**Generált ASM (példa: `AX`):**
```
PLA ADÓ PLA
```

> **Szabály:** A PUSH és PULL utasításoknak mindig **ugyanazt a
> regiszterkészletet kell használniuk**. `PUSH AX` → `PULL AX` (belsőleg
> fordított sorrendben állítja vissza: először X, majd A).

---

### END / RTS álnév

Az **RTS-hez hasonlóan, egy barátságosabb makrónévvel ** — az `.end` egyetlen
`RTS` bájtot bocsát ki, és szakértői módban rövid alprogramterminátorként
viselkedik.

**Szakértői szintaxis:**
```
.end
```

**Generált ASM:**
```
RTS
```

**Méret:** 1 bájt.

Ezt akkor használd, ha egy olyan alprogram vége jelölőt szeretnél, ami inkább
makróként, mint nyers utasításként olvasható.

---

### MAKRO / VÉGE / MEGHÍVÁS

Mint egy ** nevű GOSUB paraméterekkel ** — definiáljon egyszer egy
újrafelhasználható kódrészletet (MACRO…ENDM), majd hívja meg bárhol az INVOKE
paranccsal. Minden alkalommal más argumentumértékeket adjon át a blokkok
másolása-beillesztése helyett.

#### MAKRO (definíció kezdete)

| Mező        | Leírás                                                                             |
| ----------- | ---------------------------------------------------------------------------------- |
| Név         | A makró azonosítója (pl. `setColor`)                                               |
| Paraméterek | Opcionális vesszővel elválasztott paraméternevek (pl. `color` vagy `color, count`) |

A makródefiníció kezdetét jelzi. A MACRO és ENDM közötti blokkok a makró törzsét
alkotják – ezek **nem generálnak semmilyen kódot** ott, ahol a definíció
található. Az argumentumokhoz használd a `{paramName}` karakterláncot
helykitöltőként.

**Generált ASM:**
```
; .MACRO setColor (szín)
... (törzsblokkok)
; .ENDM
```

**Szakértői mód szintaxisa:**
```
.macro setColor szín
LDA {szín}
STA $D020
.endm
```

#### ENDM (definíció vége)

Bezárja az aktuális makródefiníciót. Nincsenek mezők.

#### MEGHÍVÁS

Meghív egy definiált makrót ezen a pozíción, és a megadott argumentumértékeket
helyettesíti a törzsben lévő `{paramName}` helyőrzők helyére.

| Mező       | Leírás                                                                                                 |
| ---------- | ------------------------------------------------------------------------------------------------------ |
| Makró neve | Válasszon a definiált makrók legördülő menüjéből                                                       |
| érvek      | Vesszővel elválasztott argumentumértékek, amelyek megegyeznek a makró paraméterlistájával (pl. `#$07`) |

**Generált ASM:**
```
; .invoke setColor(#$07)
    LDA #$07
    STA $020
```

**Szakértői mód szintaxisa:**
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
  karakterláncok; az idézőjelek között lévő vesszőket a szöveg részeként kezeli
  a rendszer, nem pedig argumentum-elválasztóként.
- **Vegyes**: `#$07, "hello", $20` — bármilyen kombináció

> **Tipp:** Definiálj makrókat a programod tetején (vagy alján), majd HÍVD MEG
> őket, ahol szükséges. A makrók többször is meghívhatók különböző
> argumentumokkal.

---

### RÉGIÓ / RÉGIÓ VÉGRÉGIÓ

Tisztán vizuális csoportosítás — **nulla bájt**, nulla hatás az összeállított
kódra. Mint amikor egy BASIC program egy szakaszát egy elnevezett blokkba
hajtogatod, hogy aztán összecsukhasd és valami másra koncentrálhass.

| Mező       | Leírás                                                                        |
| ---------- | ----------------------------------------------------------------------------- |
| Régió neve | Szabad szöveges címkék a szakaszhoz (pl. `init`, `game_loop`, `sprite_setup`) |

**Szakértői szintaxis:**
```
.region init
; blokkok...
.endregion
```

**A REGION blokk fejlécében található vezérlők (mindig láthatóak):**
- **▸ / ▾ ki-/bekapcsolás** — összecsukja vagy kibontja a teljes régiót.
  Összecsukáskor a REGION és az ENDREGION közötti összes blokk rejtve marad.
- **↕ Összes kibontása** — visszaállítja az összes egyenként összecsukott blokk
  összecsukását a régión belül, és szükség esetén kibontja magát a régiót.
- **⦵ Kijelölés az ASM-ben** — kiemeli a teljes régió kódtartományát az ASM
  nézetben (`; ===[ név ]===`-től `; ===[/ név]===`-ig), és legörget rá.
  Automatikusan átvált az ASM fülre, ha az jelenleg nem látható.
- **⧉ Régió másolása** — a REGION blokkot, az összes gyermekblokkot és a hozzá
  tartozó ENDREGION-t a vágólapra másolja. Egy ✓ villogó jel megerősíti a
  másolást.
- **⎘ Régió beillesztése** — beszúrja a másolt régiót új régióként közvetlenül
  az aktuális régió ENDREGION-ja után, és odagörget. A gomb halványan jelenik
  meg, amíg a régió másolása meg nem történik.

**Generált ASM:**
```
; régió init
    SEI
    LDA #$00
    STA 020 USD
; endregion init
```

**Méret:** 0 bájt mind a REGION, mind az ENDREGION esetében.

**Példa munkafolyamatra:**
1. Adj hozzá egy `REGION` blokkot, és állítsd be a régió nevét `init`-re.
2. Add hozzá az inicializálási utasításokat alatta.
3. Adj hozzá egy `ENDREGION` blokkot a szakasz lezárásához.
4. Kattintson a RÉGIÓ ▸ ikonjára, ha a teljes szakaszt egyetlen sorba szeretné
   csukni, miközben a program más részein dolgozik.

> **Megjegyzés:** A régiók **egymásba ágyazhatók**. Minden ENDREGION lezárja a
> legközelebbi nyitott REGION-t. Nincs hatással az összeállított kimenetre.

---

### DEFINE / HA / KÜLÖNBEN / ENDIF

Mint egy ** kapcsoló, az assembler a következőt olvassa: ** — `DEFINE DEBUG`
bekapcsol egy szimbólumot, majd bármely `IF DEBUG` blokk bekerül a kimenetbe, és
a `ELSE` ága kimarad. A DEFINE blokk eltávolításával az IF blokk eltűnik a
kimenetből. A kiadott buildekhez nem kell kódot törölni.

#### MEGHATÁROZÁS

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

Egy `DEFINE` blokk egyszerre több szimbólumot is aktiválhat (vesszővel
elválasztva). A DEFINE blokkokat a program elejére kell helyezni. A blokk
eltávolítása azonnal deaktiválja az összes szimbólumát.

#### HA

| Mező    | Leírás                                                                                                                                                   |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Állapot | Egy `.define`d szimbólum (aktív), egy `.const` név (aktív, ha nem nulla) vagy egy konstans kifejezés (`LEVEL == 2`); amelyik nem kiértékelhető, az hiba. |

**Szakértői szintaxis:**
```
.if HIBAKERESÉS
```

**Generált ASM:**
```
; .HA HIBAKERESÉS
```

Az `IF` és `ENDIF` (vagy `ELSE`) közötti blokkok attól függően kerülnek bele
vagy maradnak, hogy a feltétel szimbólumnak van-e egyező `DEFINE` a programban.
A kihagyott blokkok `; [IF kihagyva] …` megjegyzésként jelennek meg, és **nulla
bájtot** generálnak.

#### MÁS

Nincsenek mezők. Az alternatív ágat jelöli — akkor állítódik össze, amikor az
`IF` feltétel *not* aktív.

**Szakértői szintaxis:**
```
.más
```

**Generált ASM:**
```
; .ELSE
```

#### ENDIF

Nincsenek mezők. Lezárja a feltételes blokkot.

**Szakértői szintaxis:**
```
.endif fájltípus
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
LDA #$02 ; piros szegély
STA $D020
; .ELSE
LDA #$00 ; fekete (kiadás)
STA $D020
; .ENDIF
```

**Példa — több szimbólum egy DEFINE blokkban:**
```
; .DEFINE DEBUG, PAL

; .IF PAL
LDA #$xx ; PAL időzítési állandó
; .ELSE
LDA #$xx ; NTSC időzítési állandó
; .ENDIF
```

A beágyazott `IF` blokkok támogatottak. Ha egy külső blokkot kihagy, a belső
blokkok is kimaradnak.

> **Megjegyzés:** Ez fordítási idejű feltételkezelés. A futásidejű
> összehasonlításhoz/elágazáshoz lásd a **Futásidejű IF / ELSE / ENDIF** részt
> alább.

### .ASSERT

*(Újdonság a 2.3.9-es verzióban.)* Egy **fordítási idejű épségellenőrzés**. Az
`.assert` kiértékel egy kifejezést az összeszerelés során; ha hamis (`0`), a
fordítás egy tiszta hibával leáll, amely tartalmazza a tényleges értéket. Ha
igaz (nem nulla), akkor semmit nem bocsát ki.

| Mező      | Leírás                                                                                                                                              |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kifejezés | Bármely assembler kifejezés: címkék, `CONST`s, `*` (programszámláló), aritmetikai műveletek és összehasonlítások (`<`, `<=`, `>`, `>=`, `==`, `!=`) |
| Üzenet    | A hibaüzenethez hozzáfűzött opcionális szöveg                                                                                                       |

**Szakértői szintaxis:**
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

**Példa – sprite blokk védelme az oldal átlépése ellen:**
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

| Mező     | Leírás                                                                                                                     |
| -------- | -------------------------------------------------------------------------------------------------------------------------- |
| Név      | A konstans azonosítója (pl. `SCREEN`)                                                                                      |
| Érték    | Numerikus érték a kiválasztott számrendszerben (pl. `0400` HEX = $0400 cím esetén), vagy PC-relatív kifejezés (lásd alább) |
| Formátum | HEX vagy DEC — az érték bevitelének és megjelenítésének módját szabályozza                                                 |

**Szakértői szintaxis:**
```
.const KÉPERNYŐ = $0400
.const KERETEK_1-EK = 60
```

**Generált ASM:**
```
; .CONST SCREEN = $0400
```

Az állandó neve megjelenik az utasításblokkok **címkeválasztó** legördülő
menüjében – egyszerűen kattintson rá a beszúráshoz.

**PC-relatív kifejezések (`*+N` / `*-N`):**

Az érték mező elfogadja az `*+N` vagy az `*-N` értékeket is, ahol az `*` a CONST
blokk fordítási címe. Ez egy névvel ellátott alias létrehozására szolgál egy
bájthoz egy közeli utasításon belül – a klasszikus önmódosító kódminta:

```
CONST op = *+1 ; op → a következő LDA közvetlen operandusának címe
LDA #$00 ; A $00 futásidőben kerül frissítésre
...
STA op ; felülírja a #$00 bájtot → az LDA legközelebb az új értéket olvassa
```

A CONST 0 bájtot bocsát ki; a címke fordítási időben `aktuális_cím + 1`-re van
feloldva.

**Számtani kifejezések:**

Az érték mező általános aritmetikai műveleteket fogad el, beleértve a korábban
definiált CONST nevekre, hex/bináris literálokra és beépített matematikai
függvényekre való hivatkozásokat:

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

| Mező               | Leírás                                                       |
| ------------------ | ------------------------------------------------------------ |
| Név                | Változó neve / címkéje                                       |
| Méret (opcionális) | A lefoglalandó bájtok száma. Egyetlen bájt esetén hagyja ki. |

**Szakértői szintaxis:**
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

**Generált ASM:**
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

| Mező          | Leírás                                       |
| ------------- | -------------------------------------------- |
| Nyilvántartás | `A`, `X` vagy `Y`                            |
| Operátor      | `==`, `!=`, `<`, `<=`, `>`, `>=` |
| Érték         | Azonnali érték HEX vagy DEC formátumban      |

**Szakértői szintaxis:**
```
.ha A == #$10
LDA #$07
.else
LDA #$0F
.endif
```

**Méret:** A kiválasztott ágaktól és az összehasonlítási űrlaptól függ.

Az összehasonlítás alapértelmezés szerint előjel nélküli. Az `<=` és az `>`
esetén a makró a kiválasztott regiszterhez tartozó legrövidebb ekvivalens
elágazási láncra bővül.

---

### MÍG / VÉGE

Mint egy **futásidejű ciklus tetején egy teszttel** — a törzs addig fut, amíg a
feltétel igaz marad.

| Mező          | Leírás                                       |
| ------------- | -------------------------------------------- |
| Nyilvántartás | `A`, `X` vagy `Y`                            |
| Operátor      | `==`, `!=`, `<`, `<=`, `>`, `>=` |
| Érték         | Azonnali érték HEX vagy DEC formátumban      |

**Szakértői szintaxis:**
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

| Mező          | Leírás                                       |
| ------------- | -------------------------------------------- |
| Nyilvántartás | `A`, `X` vagy `Y`                            |
| Operátor      | `==`, `!=`, `<`, `<=`, `>`, `>=` |
| Érték         | Azonnali érték HEX vagy DEC formátumban      |

**Szakértői szintaxis:**
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

| Makró    | Mezők                    |
| -------- | ------------------------ |
| `MEMCPY` | `forrás`, `dst`, `méret` |
| `MEMSET` | `cím`, `érték`, `méret`  |

**Szakértői szintaxis:**
```
.memcpy forrás=$C000, dst=$D000, méret=$0100
.memset cím=$0400, érték=#$20, méret=$03E8
```

**Generált ASM:** beágyazott másolási/kitöltési ciklusok, a kért méretnek
megfelelően kiválasztva.

A legfeljebb 256 bájtos méretek egy rövid, 8 bites ciklust használnak. Nagyobb
méretek esetén automatikusan 16 bites számlálóra váltanak.

---

### NYOMTATÁS / NYOMTATÁSI_KARKOLAT / NYOMTATÁSI_HEX / KÉPERNYŐ_TÖRLÉSE / VÁRAKOZÁSI_KULCS / KÉSLELTETÉS / SZEGÉLY BEÁLLÍTÁSA / SZEGÉLY BEÁLLÍTÁSA

#### NYOMTATÁS

Mint a **PETSCII kimenet a sablonos ** nélkül — egy karakterláncot nyomtat ki a
`CHROUT` blokkon keresztül, ugyanazzal a nagybetűs/kisbetűs kezeléssel, mint a
PETSCII blokk. A kisbetűs jelölőnégyzet meg van osztva a PETSCII kódolóval, így
a szöveg elérési útja konzisztens marad.

**Szakértői szintaxis:**
```
.print "SZIA"
.print "szia", alsó
```

#### NYOMTATÁSI KARAKTER

Kinyomtat egy PETSCII bájtot numerikus kódként, és elküldi azt a `CHROUT`
metóduson keresztül. Az érték lehet egy elnevezett konstans vagy címke is, amely
összeszereléskor bájtra oldódik fel, mind Blokk, mind Szakértő módban.

**Szakértői szintaxis:**
```
.print_char 65
.print_char $41
.print_char szín
```

#### NYOMTATÁS_HEX

Egy 8 bites értéket nyomtat ki hexadecimális szövegként a normál KERNAL kimeneti
útvonalon keresztül.

**Szakértői szintaxis:**
```
.print_hex A
```

#### TÖRLŐ_KÉPERNYŐ

A szabványos C64 képernyős vezérlőkód gyorsbillentyűje.

**Szakértői szintaxis:**
```
.clear_screen
```

#### VÁRAKOZÁSI KULCS

Megvárja, amíg lenyomnak egy billentyűt, így nem kell minden alkalommal kézzel
futtatni a `GETIN` ciklust.

**Szakértői szintaxis:**
```
.wait_key
```

#### KÉSLELTETÉS

Egy megosztott segítőrutinon keresztül megvárja a kért számú képkockát. Ezt
rövid szünetekhez és időzítési hézagokhoz használjuk, amikor egy teljes egyéni
ciklus túlzás lenne. A képkockaszám lehet nyers szám vagy egy elnevezett
konstans, és az `.wait` csak az `.delay` álneve.

**Szakértői szintaxis:**
```
.delay 29
.wait 29
.delay képkockák=KÉPKOCKA_1S
```

Blokk módban a késleltetés mező egy kompakt konstansválasztót használ, ha
szimbolikus érték áll rendelkezésre, így nem kell minden alkalommal manuálisan
beírni a nevet.

#### SET_BORDER / SET_BORDER

Kényelmi burkolók a VIC-II színregiszterekhez. A színérték lehet nyers szám vagy
egy elnevezett konstans, amely 0–15-re oldódik fel. Mind a Blokk mód, mind a
Szakértő mód elfogad szimbolikus konstansneveket.

**Szakértői szintaxis:**
```
.set_border 6
.set_bg 0
.set_border szín
.set_bg szín
```

**Méret:** Minden segítő egy apró regiszterírási szekvenciává vagy egy rövid
KERNAL hívássá bővül.

Blokk módban ezek a mezők szintén a konstansválasztót használják, így a
szimbolikus érték látható marad ahelyett, hogy egy nyers számmal
helyettesítenénk.

---

### IRQ_SETUP

Egyetlen lépésben beállít egy raszteres IRQ kezelőt. A makró kiírja az IRQ
vektort, engedélyezi a raszteres IRQ-kat, beállítja a vonalat, letiltja a
gyakori CIA IRQ forrásokat, és a `CLI` paranccsal visszatér a normál
végrehajtáshoz.

| Mező    | Leírás                                                            |
| ------- | ----------------------------------------------------------------- |
| Kezelő  | IRQ rutin címkéje (pl. `my_irq`)                                  |
| Raszter | Raszteres vonal hexadecimális vagy decimális formában (pl. `$FA`) |

**Szakértői szintaxis:**
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

| Mező | Leírás                                                                 |
| ---- | ---------------------------------------------------------------------- |
| Mag  | Opcionális nulla oldalas kezdőbájt vagy címke (alapértelmezett: `$FB`) |

**Szakértői szintaxis:**
```
.rand
```

**Méret:** Néhány bájt, a választott megvalósítási útvonaltól függően.

A generátor játékmenetre, effektvariációkra és gyors tesztadatokra készült.
Szándékosan kicsi, nem pedig kriptográfiailag bonyolult.

---

<a id="sprite_init"></a>
### SPRITE_INIT

Beállít egy VIC-II sprite-ot egyetlen blokkban — a BASIC-ben körülbelül 6 POKE
utasítás írása helyett csak töltse ki a mezőket. Beállítja a sprite
adatmutatóját, bekapcsolja azt, opcionálisan engedélyezi a többszínű módot, és
beállítja a színét.

| Mező      | Leírás                                                                |
| --------- | --------------------------------------------------------------------- |
| Sprite #  | Sprite-szám 0–7                                                       |
| Szín      | Színindex 0–15 (C64 paletta)                                          |
| Adatoldal | Sprite adatcím / 64 (pl. `$21`, ha az adat a `$0840` címen található) |
| Sokszínű  | Be-/kikapcsolja a sprite többszínű bitjét (`$D01C`)                   |

**Szakértői szintaxis:**
```
.sprite_init 0, 7, $21
.sprite_init 0, 7, $21, többszínű
.sprite_init 0, 7, $21, egyszínű
```

**Generált ASM:**
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

Mint a BASIC-ben található **`POKE 53248, x : POKE 53249, y`** — beállítja egy
sprite kezdőpozícióját. A koordináták az összeszereléskor kerülnek
beillesztésre, és a mezők blokk módban fogadnak konstansokat; animációhoz
használd közvetlenül a sprite regiszteren az `INC`/`DEC` metódust.

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

| Mező            | Leírás                                                    |
| --------------- | --------------------------------------------------------- |
| Raszteres vonal | Cél raszteres vonal hexadecimálisan (pl. `FF` = 255. sor) |

**Szakértői szintaxis:**
```
.wait_raster $FF
```

**Generált ASM:**
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
POKE-olná – de egy blokkban. Egy CIA joystick portot olvas be, és ennek
megfelelően állítja be a sprite X/Y regisztereit. Teljesen inline, nincs szükség
JSR-re.

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
### EGÉR

Commodore 1351 proporcionális egér adatait olvassa és egy sprite-ot mozgat.
Teljesen **inline** — nincs szükség JSR-re vagy címkére. A makró kiválasztja a
CIA portot, megvárja, amíg a SID lapát bemenetek leülepednek, majd dekódolja a
delta mozgást a szabványos 1351-es illesztőprogram-minta segítségével, és
alkalmazza azt a sprite regiszterekre.

| Mező      | Leírás                                                            |
| --------- | ----------------------------------------------------------------- |
| Kikötő    | `1` = CIA `$DC00` bit `7:6` = `%01`; `2` = `%10`                  |
| Sprite #  | Sprite-szám 0–7                                                   |
| ZP bájt X | Nulla oldalas cím (hex) az előző POTX minta tárolására (pl. `FD`) |
| ZP bájt Y | Nulla oldalas cím (hex) az előző POTY minta tárolására (pl. `FE`) |

**Generált ASM alakzat (1. port, 0. sprite, ZP `$FD`/`$FE`):**

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

**Szakértői mód szintaxisa:**
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

| Mező           | Leírás                                                                                                         |
| -------------- | -------------------------------------------------------------------------------------------------------------- |
| Sprite #       | Sprite szám 0–7 (melyik sprite bitjét kell ellenőrizni)                                                        |
| Ütközés típusa | `Sprite-Sprite ($D01E)` — ütközés egy másik sprite-tal; `Sprite-Background ($D01F)` — ütközés háttérgrafikával |

**Szakértői szintaxis:**
```
.sprite_col 0, sprite
.sprite_col 0, háttér
```

**Generált ASM (sprite 0, sprite–sprite):**
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
WAIT_RASTER ($FF)
JOYSTICK (port=2, sprite=0)
SPRITE_COL (sprite=0, típus=sprite-sprite)
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

| Mező                        | Leírás                                                                                                                                                                                                                  |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fájlnév                     | Fájlnév a lemezen (maximum 16 karakter, automatikus nagybetűs írásmód; a következő karakterek szűrve: `,`, `"`, `/`, `\`, `:`, `*`, `?`, `<`, `>`, `|`)                                                                 |
| Eszköz                      | Eszközszám 8–30 (alapértelmezett: `8`)                                                                                                                                                                                  |
| Cím felülírása (opcionális) | Hex betöltési cím (pl. `C000`). Ha be van állítva, a fájl erre a címre töltődik be (`sec=0`, figyelmen kívül hagyva a PRG fejlécet). Hagyja üresen, ha a fájl saját 2 bájtos PRG fejlécét szeretné használni (`sec=1`). |
| Hibacímke (opcionális)      | Ha be van állítva, a JSR LOAD után egy `BCS` utasítás generálódik. Ha a KERNAL carry set (hiba) értékkel tér vissza, a végrehajtás erre a címkére ugrik.                                                                |

**Szakértői szintaxis:**
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

| Mező          | Leírás                                                                                                                    |
| ------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Depakoló címe | A kicsomagoló kód memóriában való tárolásának helye (alapértelmezett: `B000`). 16 bites hexadecimális címnek kell lennie. |

**Szakértői szintaxis:**
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

**Depacker bináris:** Az előre elkészített visszafelé irányuló kicsomagoló a
`samples/exo-decrunch.bin` (477 bájt, ORG $B000). Ez a hivatalos
`exodecrunch.asm` fájl Kick Assembler csomagolása, amelyben minden olvasásnál
`INC $D020` hozzáadódik a látható szegélyvillanás effektus érdekében a
kicsomagolás során. Helyezd el a programodban egy `INCBIN` blokkal a kicsomagoló
címén.

**Nyers bemenet:** az extra nyers fájlként kerül átadásra az Exomizernek a Dst
címre (`file@<Dst>`) betöltve, így a kicsomagoló minden bájtot, az elsővel
kezdve, pontosan a beírt címre ír.

> **Lásd még:** az `exo-multicolor-demo` példa — teljes, végponttól végpontig
> tartó példa: TÖLTSÖN be egy tömörített többszínű bitképet $C000-re, az
> EXODECRUNCH kicsomagolja $2000-re, majd másolja a képernyőt → $0400 és a színt
> → $D800, és kapcsolja a VIC-II-t többszínű bitkép módba.

> **Integrációs teszt:** A `cargo test --test exomizer_integration` (a
> `src-tauri/` fájlban) ellenőrzi a teljes tömörítési + kicsomagolási oda-vissza
> utat egy 6502 emulátoron a valódi kicsomagoló bináris fájllal. Sikeres
> feltétel: 10000 bájt, amely bájt-egyenlő a forrás `multi-color.bin` fájljával.

---

### REU_CHECK

Észleli, hogy van-e Commodore RAM bővítőegység (REU) csatlakoztatva – mintha a
`PEEK($D010)` regisztert ellenőrizné a hardver meglétének megállapítására. Két
minta `$DF04` REU regiszterbe való visszaírásával és visszaolvasásával teszteli.

| Mező      | Leírás                |
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

**Szakértői szintaxis:**
```
.reu_check
```

**Eredmény a jelzőkben:**
- **Z = 0** (eredmény ≠ 0) → REU jelen → `BNE` használata
- **Z = 1** (eredmény = 0) → nincs REU → használja az `BEQ`

**Nincsenek konfigurálható mezők** — a makró minden alkalommal ugyanazt a kódot
generálja.

**Tipikus használat:**
```assembly
REU_CHECK
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

**Mezők:**

| Mező        | Leírás               | Hatótávolság                                         |
| ----------- | -------------------- | ---------------------------------------------------- |
| Sebesség    | CPU sebességindex    | 0 = 1 MHz … 7 ≈ 10 MHz … 15 ≈ 48 MHz                 |
| Rossz vonal | Rossz vonal emuláció | Engedélyezett (C64 kompatibilis) / Letiltott (turbó) |

A sebességbájt kiszámítása a következőképpen történik: `(speedIndex & 0x0F) |
(badline_disabled ? 0x80 : 0x00)`.

**Generált kód (5 bájt):**
```
A9 xx LDA #speed_byte
8D 31 D0 STA 031 USD
```

**Szakértői mód szintaxisa:**
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

**Nincsenek konfigurálható mezők.**

**Szakértői szintaxis:**
```
.supercpu_detect
```

**Tipikus használat:**
```assembly
SUPERCPU_DETECT
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

**Szakértői mód szintaxisa:**
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

**Méret:** `2 (LDX) + teljesOldalak×9 + (rem > 0 ? 11 : 0)` bájt szakaszonként.
Kombinált módban ez megduplázódik (képernyőszakasz + azonos színű szakasz).

**Párosítás a Térképszerkesztővel:**

A Térképszerkesztő **Fájlok → Térkép + színes RAM (.bin)** parancsa egyetlen
bináris fájlt exportál, ahol az első `size` bájtok képernyőkódok, a következő
`size` bájtok pedig színes RAM értékek. Használd a MAP_COPY függvényt a
**Combined .bin** jelölőnégyzettel, és irányítsd a **Source addr** címet oda,
ahová ez a fájl betöltésre került (pl. az INCBIN-en keresztül a `$C000` címen):

```
* = $C000
INCBIN "map-color.bin" @ $C000 ; képernyőkódok $C000–$C3E7, szín $C3E8–$C7CF
* = $0801
; ...
MAP_COPY src=$C000 dst=$0400 size=1000 combined color_dst=$D800
```

**Szakértői mód szintaxisa:**
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

**Szakértői mód szintaxisa:**
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

| Mező            | Leírás                                                                                       |
| --------------- | -------------------------------------------------------------------------------------------- |
| Sprite #        | Sprite-szám 0–7                                                                              |
| Keretlista címe | A frame tábla hex címe — keretenként egy bájt, minden bájt = sprite oldal (`data_addr / 64`) |
| Képkockák száma | Képkockák száma összesen (1–255)                                                             |
| ZP keret        | Nulla oldalszámú bájt, amelyet keretszámlálóként használnak (pl. `FB`)                       |

**Generált ASM (sprite 0, 4 képkocka, ZP `$FB`, lista a `$C100` pontban):**
```
INC $FB ; képkockaszámláló léptetése LDA $FB CMP #$04 ; képkockaszám BCC *+6 ; ha a számláló < a számláló, akkor kihagyja a visszaállítást LDA #$00 STA $FB TAX ; X = aktuális képkockaindex LDA $C100,X ; sprite adatlap betöltése ehhez a képkockához STA $07F8 ; sprite 0 mutató frissítése ($07F8 + sprite#)
```

**Méret:** 19 bájt.

**Tipikus használat:**
```
frameTable:
.byte $21, $22, $23, $24 ; 4 képkocka $0840, $0880, $08C0, $0900 értékeknél

gameloop:
WAIT_RASTER ($FF)
SPRITE_ANIM (sprite=0, list=$C100, count=4, zp=$FB)
JMP gameloop
```

**Szakértői mód szintaxisa:**
```
.sprite_anim spriteNum, frameListAddr, frameCount, zpByte
; példa:
.sprite_anim 0, C100, 4, FB
```

> **Tipp:** Helyezd el a frame táblázatot RAWBYTES blokkként egy fix címen. A
> számláló ZP bájtját (`$FB`) az első hívás előtt `$00` értékre kell
> inicializálni. Ha a kódod az `$FB` címet valami másra használja, válassz egy
> szabad ZP helyet.

---

<a id="score_bcd"></a>
### PONTSZÁM_BCD

Hozzáad egy fixpontos értéket egy memóriában tárolt többbájtos BCD-pontszámhoz,
majd minden számjegyet képernyőkód karakterként jelenít meg a képernyő RAM-ban.
A 6502-es decimális módot (`SED`/`CLD`) használja a hordozható BCD-aritmetikához
– nincs szükség kézi hordozás-zsonglőrködésre.

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

**Szakértői mód szintaxisa:**
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

## 11. Tudásbázis linkek

Gyorsreferencia linkek érhetők el az alkalmazásban a **Tudásbázis** alatt:

### RetroDebugger

A [RetroDebugger](https://github.com/slajerek/RetroDebugger) egy többplatformos
Commodore 64 hibakereső töréspont-támogatással, memória-ellenőrzéssel és
címke-érzékeny szétszereléssel.

**Beállítás:** a **Beállítások → Fájlok és elérési utak → Retro Debugger**
menüpontban mutasson a `RetroDebugger` bináris fájlra.

**Indítás:** Kattintson a **Debug (RetroDebugger)** lehetőségre az eszköztáron.
Az alkalmazás a következőket teszi:

1. Szereld össze a programot egy `.prg` fájlba egy ideiglenes könyvtárban.
2. Írj egy **töréspont-fájlt** — amely tartalmazza az összes töréspont-blokk és
   az Expert töréspont-sor címét.
3. Írd le az **szimbólumokat** VICE / RetroDebugger címkeformátumban (`al C:addr
   .name`): címkék, konstansok és változók.
4. Írd a C64Debugger stílusú mellékkocsikat a PRG mellé: `.dbg` (forráskód map),
   `.sym` és `.vs`.
5. Indítsd el a RetroDebuggert a PRG-vel, a töréspontokkal, a szimbólumokkal és
   az alábbi jelzőkkel.

### Töréspont blokkok

Kattintson a töréspont ikonra (●) bármelyik utasításblokkon, ha azt
töréspontként szeretné beállítani. A töréspontos blokkok pirossal vannak
kiemelve. Címük minden hibakereső indításakor beíródik a töréspont fájlba.

### Hibakereső jelzők

Ezek a **Beállítások → Általános → RetroDebugger** menüpontban találhatók.

| Váltás                            | Zászló                         | Hatás                                                                  |
| --------------------------------- | ------------------------------ | ---------------------------------------------------------------------- |
| `-jump` BE                        | `-jump $CÍM`                   | Betöltés után közvetlenül a program kezdőcímére ugorhat                |
| `-szüneteltetés megszüntetése` BE | `-szüneteltetés megszüntetése` | A hibakereső szüneteltetésének azonnali feloldása betöltéskor          |
| `-várás` BE                       | `-vár <ms>`                    | Várjon `<ms>` milliszekundumot a folytatás előtt — 500 ms vagy 1000 ms |

> **Tipp:** A legtöbb program esetében engedélyezd az `-jmp` és az `-unpause`
> kapcsolókat az azonnali automatikus indításhoz. Használd az `-wait 500` vagy
> az `-wait 1000` kapcsolót, ha a programod olyan IRQ-kat vagy SID zenét állít
> be, amelynek időre van szüksége az inicializáláshoz az első raszter előtt.

### VICE Monitor (forró újratöltés, élő megfigyelés, profilkészítő)

Az **VICE Monitor** eszköztár gomb egy nem modális ablakot nyit meg, amely a
futó VICE-szal kommunikál a bináris monitorán keresztül. A **Futtatás (VICE)**
elindítja a VICE-t a monitorral a 6502-es porton (**Beállítások → Fájlok és
elérési utak → VICE emulátor → VICE távoli monitor**, alapértelmezés szerint
bekapcsolva). Zárja be és indítsa újra a más módon elindított VICE-t. A fejléc a
kapcsolat állapotát mutatja; a böngésző előnézetében megjelenik a *Csak az
asztali alkalmazásban érhető el*.

| Gomb                                        | Mit csinál                                                                                                                                                             |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Forró újratöltés**                        | Az összeállított programot a futó VICE RAM-jába írja (csak a foglalt tartományokat – a hézagokat hagyja). Adatokhoz használja: sprite-okhoz, táblázatokhoz, szöveghez. |
| **Forró újraindítás + újraindítás**         | Ugyanez, majd újraindul a SYS címen (verem alaphelyzetbe állítás; a végső `RTS` visszatér `READY.` értékre).                                                           |
| **Automatikus újratöltés szerkesztés után** | Minden szerkesztés után körülbelül egy másodperccel újratölti és újraindul, ha a program összeállt.                                                                    |
| **Élő közvetítés**                          | 0,4 másodpercenként frissíti a figyelési listát; a módosított érték villog.                                                                                            |
| **Profil**                                  | Körülbelül 5 másodpercig méri a programszámlálót (kattintson ismét a korai leállításhoz).                                                                              |

**Figyelési lista:** írjon be egy címkét vagy címet — `pontszám`, `$D020`,
`53280`, vagy bájtszámlálóval `tábla, 8` — és nyomja meg az **+**
billentyűkombinációt vagy az Enter billentyűt. Minden sor a címet, a bájtokat
hexadecimális formában, és 1 vagy 2 bájt esetén a decimális értéket mutatja. Az
Ultimate Basic módban a nevek az utolsó UB buildből származnak (változók,
címkék, alcsoportok, tömbök).

**Profilozó eredménye:** két táblázat. A *Routine* a mintákat a legközelebbi
címke szerint csoportosítja (az Ultimate Basicben: `sub` szerint), a %-os
részesedéssel és a futtatott rasztervonalakkal – a KERNAL vagy BASIC ROM-ban
eltöltött idő külön van felsorolva. A *Line* felsorolja a legdrágább
forrássorokat; kattintson az egyikre az ugráshoz. Minden minta rövid időre
szünetelteti az emulátort, így a profil egy statisztikai kép, nem pedig egy
pontos ciklusszám.

---

## 12. D64 Exportálás és futtatás

Az 1.5.1-es verzió lehetővé teszi a program (és a további adatfájlok) C64 D64
lemezképbe csomagolását és a VICE-ban való elindítását – vagy a lemezkép
exportálását máshol történő felhasználásra.

| Forrás                                                         | URL-cím                                                        |
| -------------------------------------------------------------- | -------------------------------------------------------------- |
| 6502 Opkódok referencia                                        | http://www.6502.org/tutorials/6502opcodes.html                 |
| C64 KERNAL függvények                                          | https://sta.c64.org/cbm64krnfunc.html                          |
| C64 memóriatérkép                                              | https://sta.c64.org/cbm64mem.html                              |
| C64 színkódok                                                  | https://sta.c64.org/cbm64col.html                              |
| VIC-II cikk                                                    | https://www.cebix.net/VIC-Article.txt                          |
| C64 kódbázis                                                   | https://codebase.c64.org/                                      |
| A turbóösszeszerelő                                            | https://turbo.style64.org/                                     |
| RetroDebugger                                                  | https://github.com/slajerek/RetroDebugger/                     |
| C64 operációs rendszer fejlesztői környezet                    | https://www.c64os.com/c64os/programmersguide/?s=devenvironment |
| png2c64 képkonverter                                           | https://png2c64.app/                                           |
| Restore64 Disassembler (C64 PRG → KickAssembler / ACME forrás) | https://restore64.dev/                                         |

---

## 12b. CRT Export (Magic Desk 64K kazetta)

A programodat (és a további adatfájlokat) becsomagolhatod egy C64 D64
lemezképbe, és elindíthatod a VICE-ban – vagy exportálhatod a lemezképet máshol
való használatra.

### A kosár tartalma

Az eszköztár **Futtatás** gombja egy **osztott gomb**:

| Rész                | Akció                                               |
| ------------------- | --------------------------------------------------- |
| **▶ Futtatás** (fő) | Végrehajtja az aktuálisan kiválasztott futási módot |
| **▾** (nyíl)        | Megnyitja az üzemmódválasztót                       |

**Elérhető futási módok:**

| Mód                             | Leírás                                                                                                                                                                                                                                    |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Futtatás PRG-ként**           | Összegyűjtjük egy ideiglenes `.prg` fájlt, és közvetlenül elindítjuk a VICE-t. Klasszikus viselkedés.                                                                                                                                     |
| **Futtatás a D64-en keresztül** | Állítsd össze, készíts egy `.d64` lemezképet (c1541 használatával), add hozzá a konfigurált extra fájlokat, majd indítsd el a VICE-t a lemezről. Használd ezt, amikor a programod futásidőben fájlokat tölt be (pl. a LOADFILE makróval). |
| **Hardveren futtatva**          | Gyűjtsd össze PRG-re, és küldd el egy **1541 Ultimate / Ultimate 64** eszközre a helyi hálózaton keresztül. Lásd: [13. szakasz](#13-settings).                                                                                            |
| **D64 hardveren**               | Készíts egy `.d64` fájlt (mint a Run via D64 parancs), és küldd el az **1541 Ultimate / Ultimate 64** szerverre, ami felcsatolja és futtatja azt.                                                                                         |
| Kung Fu Flash 2 **              | Rakd össze PRG-re, majd töltsd fel USB soros porton keresztül egy igazi C64/C128-ra egy **Kung Fu Flash 2** patronnal. Lásd: [Kung Fu Flash 2]{1].                                                                                        |

A kiválasztott mód a munkamenetek között mentésre kerül.

### Berakodási cím és belépési pont

Nyisd meg a **Menu → Build → Build D64** paranccsal (a D64-en keresztül futtatva
is megnyílik). A párbeszédpanel lehetővé teszi:

1. **Blokk / Szakértő mód BASIC SYS csonkkal bekapcsolva:** betöltés = `$0801`,
   bejegyzés = a SYS cél (jellemzően `$080D` vagy a felhasználó eredete).
2. **Blokk / Szakértő mód kikapcsolt BASIC SYS csonkkal:** betöltés =
   felhasználói eredet (a klasszikus `$0801 → $C000` tartalék opcióval),
   bejegyzés = betöltési cím.
   - **Név** — hogyan jelenik meg a D64 könyvtárban (maximum 16 karakter,
     automatikus nagybetűs írásmód).
   - **Addr** (betöltési cím, opcionális) — ha meg van adva, egy 2 bájtos PRG
     fejléc kerül elé. Nyers bájtok fejléc nélküli írásához hagyja üresen.
   - **Dst** (kicsomagolási cél, csak EXO-val) — ahová a kicsomagolónak az
     adatokat a C64-re kell helyeznie. Ha az EXO engedélyezve van, az extra
     fájlt a `exomizer mem -l <Cím> file@<Dst>` paranccsal tömöríti (egy nyers
     fájl a Dst címen), mielőtt a D64-re írná.
   - **EXO** — jelölőnégyzet, amely bekapcsolja a visszafelé `mem` módú
     adatfeldolgozást ehhez a bejegyzéshez. A lemezen lévő méret jellemzően az
     eredeti 5-20%-a.
3. **UltimateBasic mód:** A betöltés és a bejegyzés is az UB fordító térképéről
   származik (`build.map.loadAddress`). A hasznos adaton belüli UB autostart
   csonk ezután pontosan úgy hajtódik végre, ahogyan a lemezről futtatott `LOAD
   "...",8,1 : RUN` parancs után történne.

Az ASM kimenetében látható eredetcím megőrződik; a betöltő egyszerűen átmásolja
a lapos memóriaképet a PRG-ből a RAM-ba, és a belépési pontra ugrik, miután a
cart ROM leképezése megszűnt.

### Méretkorlát

Mivel a hasznos adat lineárisan tárolódik, és az `assembleProgramToPrg()` egy
sima `minAddr..maxAddr` puffert ad vissza nullákkal kitöltött résekkel, egy
szélesen elhelyezkedő ORG szegmensekkel rendelkező program (pl. `$0801` +
`$C000` + `$E000`) minden egyes bájtot beleszámít a 65 408 bájtos
költségvetésbe. Ha túllépi a korlátot, a build `saveCrtTooLarge` hibával
megszakad – vagy tömörítse a memória-elrendezést, vagy ossza fel az adatokat.

Az **loadfile-demo** minta előre konfigurálva tartalmazza a `DEMO-COLORS.PRG`
fájlt extra fájlként. Jelöld ki, nyisd meg a **Run via D64** fájlt, és kattints
az **Run** gombra a teljes betöltési folyamat működés közbeni megtekintéséhez.

> **Követelmény:** A D64 exportáláshoz és a Futtatás D64-en keresztül funkcióhoz
> egyaránt konfigurálni kell a VICE-t (`c1541`) a [Beállítások → Fájlok és
> elérési utak](#13-settings) menüpontban.

### Kompatibilitás

A Táblázatgenerátor utáni eszköztár ikon megnyitja a **D64 szerkesztőt** – egy
önálló eszközt, amellyel közvetlenül, az aktuálisan megnyitott programtól
függetlenül dolgozhatunk egy meglévő `.d64` képpel. A fenti Exportálás D64-be
párbeszédablakkal ellentétben (amely mindig egy *új* lemezt épít a lefordított
PRG-ből), a D64 szerkesztő a lemezképet a `c1541` segítségével szerkeszti
helyben, így könnyűsúlyú lemezkezelőként is funkcionál.

**Fájlok ▾ menü:**

| Platform                 | Akció                                                  |
| ------------------------ | ------------------------------------------------------ |
| ALELNÖK (`x64sc`, `x64`) | A **Fájl → Kazettakép csatolása** menüpontban működik. |
| TheC64 / TheC64 Mini     | A beépített patronbetöltőn keresztül működik.          |
| Kung Fu Flash            | Működik — natív Magic Desk mód.                        |
| EasyFlash patron         | Magic Desk-ként programozva működik.                   |

**Eszköztár:**

| Ikon                     | Akció                                                                                                                                                                        |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Program hozzáadása**   | Válassz ki egy helyi fájlt, és írd be a lemez könyvtárába.                                                                                                                   |
| **Kijelöltek kinyerése** | A kiválasztott bejegyzés bájtjainak mentése egy helyi `.prg` fájlba.                                                                                                         |
| **Kijelölt átnevezése**  | A bejegyzés nevének szerkesztése a táblázatban soron belül — Az Enter megerősíti, az Escape megszakítja a műveletet.                                                         |
| **Kijelölt törlése**     | Távolítsa el a kiválasztott bejegyzést a lemezről.                                                                                                                           |
| **Frissítés**            | Olvasd be újra a könyvtárat, pl. miután szerkesztetted a lemezt egy másik eszközzel.                                                                                         |
| **Mentés**               | A munkapéldány módosításait visszaírja az eredeti `.d64` fájlba, először automatikus biztonsági mentést készítve. Csak akkor engedélyezett, ha vannak mentetlen módosítások. |

**Program hozzáadása:** Egy olyan fájl kiválasztása, amely már `.prg` végződésű,
csak a **Név** és a lemez **Típusa** (PRG/SEQ/USR/REL) megadását kéri – egy
`.prg` már rendelkezik saját betöltési cím fejléccel, így változatlanul kerül
kiírásra. Bármely más fájl kiválasztása (pl. egy nyers `.bin`) a következőket is
mutatja:

- **Cím betöltése** (hex, opcionális) — egy 2 bájtos PRG fejlécet illeszt be
  erre a címre; hagyja üresen, ha a bájtokat nyersen szeretné írni.
- **Kicsomagolási cím** (hex, opcionális) — csak az Exomizerrel együtt
  használatos; a célcím, ahová a kicsomagolónak ki kell csomagolnia az adatokat.
- **Exomizer** jelölőnégyzet – a fájl tömörítése írás előtt ugyanazokkal a
  `mem`/`sfx` tömörítési módokkal, mint a fenti Exportálás D64-be
  párbeszédpanelen található extra fájlok esetében.

A könyvtárlista ugyanolyan betűtípussal és nagybetűs stílusban jeleníti meg a
fájlneveket, mint egy valódi C64 `LOAD"$",8` lista.

**Mentési munkafolyamat:** minden szerkesztés – hozzáadás, kibontás, átnevezés,
törlés és a Blokkszerkesztő bájtszerkesztései – a lemezkép egy privát
munkapéldányára vonatkozik, nem a valódi fájlra. A **Mentés** eszköztár gomb
(amely akkor aktív, ha vannak mentetlen változtatások) a munkapéldányt
visszaírja a valódi `.d64` fölé, először automatikus biztonsági mentést
készítve; a fejléc egy **•** jelölőt mutat, amíg a változtatások nem mentettek,
és a szerkesztő bezárása vagy egy másik, mentetlen változtatásokat tartalmazó
lemez megnyitása megerősítést kér a változtatások elvetése helyett. **Mentés
másként…** (Fájlok ▾ menü) a munkapéldányt egy új elérési útra írja, és ott
folytatja a szerkesztést.

**Blokkszerkesztő:** az eszköztár rács ikonja egy nyers sáv/szektor nézetre vált
a könyvtár alatt — egy kattintható blokktérkép, amelyet a BAM szabad/felhasznált
bitképe színez (a BAM és a könyvtárlánc külön jelölve), egy bájtonkénti
hexadecimális rács a kiválasztott 256 bájtos blokkhoz, és Előző/Következő
szektornavigáció. A blokkok szerkesztése ugyanazon a munkamásolás/mentés
munkafolyamaton megy keresztül, mint a fenti könyvtárműveletek.

> **Követelmény:** a D64-be exportáláshoz hasonlóan a D64 szerkesztőhöz is
> szükség van a [Beállítások → Fájlok és elérési utak](#13-settings) menüpontban
> konfigurált VICE (`c1541`) csomagra.

---

## 13. Hardverbeállítások

A **Menü → Build → CRT Build** parancs egy Commodore 64 kazettaképet (`.crt`,
**19-es típusú kazetta — Magic Desk / Domark / HES Australia**) hoz létre, amely
VICE, TheC64, valódi hardveren EasyFlash / Kung Fu Flash segítségével, és 1541
Ultimate II+ kazettafoglalaton fut. Elérhető **blokk módban**, **Szakértő
módban** és **UltimateBasic módban**.

### VICE emulátor

- **8 × 8 KB bank** `$8000` áron, bankváltás `$DE00`-en keresztül (Magic Desk
  konvenció: alsó 3 bit = bank, 7. bit = kocsi letiltása).
- A **Bank 0** egy 128 bájtos fejlécet és rendszerbetöltőt tartalmaz:
  - `$8000/$8002` hidegindítás + melegindítás vektorok `$8009`-re mutatnak.
  - `$8004–$8008` = a KERNAL visszaállító kód által megkövetelt `CBM80` aláírás.
  - `$8009–$807F` = a betöltő: SEI / stack init / `JSR $FDA3` (IOINIT) / `JSR
    $FD50` (RAMTAS) / `JSR $FD15` (RESTOR) / `JSR $FF5B` (CINT), majd egy
    bájtmásoló ciklus, amely a hasznos adatot a cart ROM-ból a RAM-ba streameli,
    és bankot vált, amikor az `$FC` eléri az `$A0` értéket. A végén egy apró
    **kilépési csonkot** átmásol a `$0100` címre, letiltja a kosarat az `LDA
    #$80 : STA $DE00` paranccsal, és a `JMP` paranccsal a belépési pontra.
- Az **Payload** a 0. bankban a `$8080` értéknél kezdődik, és szükség szerint az
  1–7. bankokba bonyolódik. Maximális hasznos adat = `8 * 8192 − 128 = 65 408
  bájt`.

### Exomizer

**Munkafolyamat:**

- Telepítsd az Exomizer bináris fájlt:
- Konfigurálja az elérési utat az **Hardverbeállítások → Exomizer részben**.
- Engedélyezd a **Futtatás Exomizerrel** jelölőnégyzetet a **Beállítások
  menüben**.

Az Exomizer ugyanúgy működik Windows és macOS rendszereken – a parancssori
felületet a Tauri háttérrendszer hívja meg; az integrációban semmi sem
platformspecifikus.

### Retro hibakereső

Mivel a hasznos adat lineárisan tárolódik – egy lapos kép a legalacsonyabb
címtől a legmagasabb címig, nullákkal kiegészített résekkel –, egy széles
távolságra lévő ORG szegmensekkel rendelkező program (pl. `$0801` + `$C000` +
`$E000`) minden egyes bájtot beleszámol a 65 408 bájtos költségvetésbe. Ha
túllépi a korlátot, a build hibával megszakad – vagy tömöríti a
memória-elrendezést, vagy felosztja az adatokat.

> **⚠️ Fontos figyelmeztetés – olvassa el a CRT monitor elküldése előtt.**
> 
> A betöltő a standard reset szekvencia részeként meghívja a KERNAL **`RESTOR`
> ($FD15)** függvényt. Ez szándékosan átírja a standard I/O vektorokat a
> `$0314/$0315`, `$0316/$0317`, `$0318/$0319`, `$0328/$0329` és barátaiknál, és
> visszaállítja azokat az alapértelmezett ROM értékekre. Következmények:
> 
> - **Bármely IRQ / NMI / BRK hook, ami a CRT bootok törlése előtt lett
>   beállítva.** A programodnak magától kell telepítenie ezeket a belépés után –
>   pontosan úgy, mint egy friss `LOAD "",8,1 : RUN` parancsot
>   szalagról/lemezről.
> - Az olyan **UltimateBasic programok**, amelyek a belépéskor élő, nem
>   alapértelmezett KERNAL vektorokra támaszkodnak, explicit `SYS` vagy init
>   hívást igényelhetnek az automatikus indítási csonkban. A szabványos UB
>   automatikus indítás azonnal működik; a vektorokat *a* `RUN` előtt
>   összekapcsoló bővítménykönyvtárak nem.
> - Az **CIA1 / CIA2** újrainicializálása az `IOINIT` által történik. Az egyéni
>   időzítő beállításokat (raszteres IRQ-k, CIA-A zenelejátszó) a belépés után
>   újra kell programozni.
> - A kocsit egy 8 bájtos csonk tiltja le az **RAM-ban a `$0100`** címen, így a
>   `STA $DE00` futási idejét nem szakíthatja meg egy hibás ROM-lehívás. Ne
>   hagyatkozzon arra, hogy a `$0100–$0107` mappák tartalmazzák a verem
>   tetejének képét a belépéskor – az első RAM-lehívás felülírja a csonkot.
> 
> Ha egy CRT VICE környezetben fut, de valódi hardveren hibát jelez, akkor
> először is ellenőrizni kell, hogy a program a belépéskor feltételez-e egy
> adott KERNAL vektor vagy CIA időzítő állapotot. Telepítsd az állapotot
> explicit módon az init rutinodba, és mindkettőn ugyanúgy fog viselkedni.

### C64 Végső / 1541 Végső

| Platform                        | Leírás                                                                 |
| ------------------------------- | ---------------------------------------------------------------------- |
| **Gép (IP)**                    | Az eszköz IP-címe (pl. `192.168.1.100`)                                |
| **Jelszó**                      | Opcionális – ha az eszköz hitelesítést igényel                         |
| **Kapcsolat tesztelése**        | Tesztkérést küld a(z) `/v3/runners/info` címre; OK-t vagy hibát jelez. |
| EasyFlash patron                | Magic Desk-ként programozva működik.                                   |
| 1541 Ultimate II+ / Ultimate 64 | **Patron → Kosár betöltése kép ** menüpontban működik.                 |
| Kaméleon / Turbó kaméleon       | Művek.                                                                 |

---

## 13. Beállítások

Nyissa meg a **Menü → Beállítások…** (korábban *Hardverbeállítások*)
menüpontban. A párbeszédpanel három füllel rendelkezik: **Általános** (assembler
mód, VMA fordító, BASIC SYS csonk, Futtatás Exomizerrel, frissítések, ASM
kimenet, SID előnézet, C64 Debugger paraméterek, pillanatképek / verziókövetés),
**Fájlok és elérési utak** (VICE, RetroDebugger, ACME, Exomizer, git) és
**Integrációk** (C64 Ultimate, Kung Fu Flash 2). Az alábbi szakaszok a külső
eszközöket és eszközöket ismertetik.

### VMA fordító

**Beállítások → Általános → Program → VMA fordító** kiválasztja a VMA (és Kick
projekt) forráskódokat fordító motort:

- **JavaScript** — a beépített fordító, az alapértelmezett.
- **Rust** — a nyílt forráskódú [VMA fordító](https://github.com/zstarczali/VMA)
  az alkalmazáson belül. Ugyanazokat a bájtokat, memória nézetet, szegmenseket
  és hibaüzeneteket adja, mint a JavaScript fordító.
- **Rust + JavaScript ellenőrzés** — JavaScripttel és Rusttal épít, a JavaScript
  eredményét használja, és minden különbséget (bájtok, memória nézet, hibák)
  naplóz a hibanaplóba, amelyet a hibajelentés is elküld.

A fordítási párbeszédpanel megnevezi a használt motort. A VMA verziója a Névjegy
mezőben látható.

### Nagy felbontású / többszínű szerkesztő

| Beállítás               | Leírás                                                                                                                                             |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Módváltás               | A **Többszínű** jelölőnégyzet a nagy felbontású (cellánként fekete-fehér) és a többszínű (cellánként 4 szín) között vált.                          |
| **Állapot**             | Megjeleníti, hogy a végrehajtható fájl elérési útja érvényes és elérhető-e                                                                         |
| **VICE távoli monitor** | Elindítja a VICE-t a bináris monitorral a 6502-es porton, amelyre a [VICE Monitor](#vice-monitor-hot-reload-live-watch-profiler)-nek szüksége van. |

Pixel szintű bitképszerkesztő 320×200 nagy felbontású és 160×200 többszínű
móddal. Megnyitás a Toolkit → Nagy felbontású szerkesztő menüpontban.

### Sprite-szerkesztő

| Beállítás   | Leírás                                                                     |
| ----------- | -------------------------------------------------------------------------- |
| Keretek     | Keretek hozzáadása / eltávolítása / átrendezése; a keretsáv alul látható.  |
| Mód         | Monokróm / többszínű váltás.                                               |
| **Állapot** | Megjeleníti, hogy a végrehajtható fájl elérési útja érvényes és elérhető-e |

**Munkafolyamat:**
1. Telepítsd az Exomizer bináris fájlt:
   - **Windows:** töltse le az előre elkészített `win32/exomizer.exe` fájlt a
     https://bitbucket.org/magli143/exomizer/wiki/Home vagy a
     https://csdb.dk/release/?id=244342 oldalról.
   - **macOS:** `brew install exomizer` (Magnus Lind hivatalos 3.1.2-es buildjét
     telepíti).
2. Konfigurálja az elérési utat a **Beállítások → Fájlok és elérési utak →
   Exomizer** menüpontban.
3. Engedélyezze a **Futtatás Exomizerrel** jelölőnégyzetet a **Beállítások →
   Általános → Programok** menüpontban.
4. Az összes **Run** művelet (PRG, D64, hardver) és **Build** művelet (Build
   PRG, Build D64) mostantól az `exomizer sfx` soron keresztül futtatja az
   összeállított programot indítás vagy mentés előtt: `sfx basic`, amikor a PRG
   egy BASIC sorral indul (a szétválasztás után a RUN az eredeti `SYS` sort
   indítja, így egy második RUN is működik), `sfx $<betöltési cím>` egyébként.

Az Exomizer ugyanúgy működik Windows és macOS rendszereken – a parancssori
felületet a Tauri háttérrendszer hívja meg; az integrációban semmi sem
platformspecifikus.

** Két belső tömörítési módot használnak:**

| Mód                       | Használta                                                    | Hívási konvenció                                                                                                                                                                                    |
| ------------------------- | ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sfx alap` / `sfx $<cím>` | Építés/Futtatás Exomizerrel kapcsolóval (fő PRG útvonal)     | Önkicsomagoló PRG beépített decruncherrel; a Border-flash beállítás a `-x1` és a `-n` közötti tartományokat szabályozza.                                                                            |
| `mem` (visszafelé)        | D64-en keresztül futtatva → fájlonként **EXO** jelölőnégyzet | Minden extra fájlt `mem` módú adatfolyamba tömörít; a program futásidőben kicsomagolja azt az **EXODECRUNCH** makró és egy előre elkészített kicsomagoló (`samples/exo-decrunch.bin`) segítségével. |

> **Tipp:** Ha az Exomizer elérési útja nincs konfigurálva, de a jelölőnégyzet
> be van jelölve, akkor egy hibaüzenet jelenik meg az indítás helyett. Kapcsolja
> ki a jelölőnégyzetet a tömörítés nélküli futtatáshoz.


### C64 karakter ROM böngésző ("Karaktertérkép")

| Beállítás           | Leírás                                                                                                                                                                                                                                             |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Két karakterkészlet | 1. fül: **1. készlet — Felső/Grafika** (alapértelmezett mód bekapcsolás után). 2. fül: **2. készlet — Alsó/Felső** (`$0E` váltás után).                                                                                                            |
| **Állapot**         | 16×16-os rács, mind a 256 karakterből. Kattintson egy karakterjelre a részletes panel megtekintéséhez: nagyított 8×8 pixeles nézet, képernyőkód (decimális + hex), PETSCII kódok (alapértelmezett és eltolt is), valamint a nyers 8 bájtos bitkép. |

A hibakereső teljes dokumentációját lásd a [10.
szakasz](#10-debugger-integration) alatt.

### Karakterszerkesztő (Karakterkészlet)

256 karakteres, 8×8 karakterkészlet-szerkesztő. Megnyitás az Eszköztár →
Karakterszerkesztő menüpontban.

| Beállítás       | Leírás                                                                                               |
| --------------- | ---------------------------------------------------------------------------------------------------- |
| ROM betöltése   | Importálja a C64 ROM karakterkészletet közvetlenül a VICE `chargen` fájljából (fájlválasztó nélkül). |
| Betöltés `.bin` | Importál egy külső, 2048 bájtos karakterkészletű bináris fájlt.                                      |

**Munkafolyamat:**
1. Csatlakoztassa a 1541 Ultimate / Ultimate 64 készüléket a helyi hálózathoz.
2. Add meg az IP-címét (és a jelszavát, ha be van állítva) a **Beállítások →
   Integrációk → C64 Ultimate** menüpontban.
3. Válaszd a **Futtatás hardveren** lehetőséget a megosztott futtatás menüből.
4. Kattintson a **▶ Futtatás** gombra — a PRG lefordításra kerül, és HTTP
   POST-on keresztül elküldésre kerül az eszközre a `/v3/runners/prg` címre. Az
   eszköz azonnal betölti és futtatja a C64-en.

> **Tipp:** Nincs szükség USB-kábelre vagy illesztőprogramra – a REST API be van
> építve az Ultimate firmware-be. A számítógépnek és az eszköznek ugyanazon a
> helyi hálózaton kell lennie.

### Karakterkészlet-vászonszerkesztő

Teljes vászon karakterkészlet-festő képernyők létrehozásához egy teljes 256
karakteres karakterkészletből. Megnyitás a Toolkit → Charset Canvas menüpontban.

A vászon 16×16 karakteres. Monokróm módban ez 128×128 pixeles munkaterületet
biztosít; többszínű karaktermódban 64×128 pixeles széles munkaterületet biztosít
a C64 valódi karaktereinek többszínűségi szabályait használva.
- egy bekapcsolt Commodore 64 / C128 egy beépített **Kung Fu Flash 2**
  patronnal;
- **Kung Fu Flash firmware v2.07 vagy újabb** a kazettán — a korábbi firmware
  verziók nem támogatják a Visual Assembler által használt feltöltési
  protokollt. Firmware kiadások:
  <https://codeberg.org/KimJorgensen/KungFuFlash2/releases/>;
- egy **USB-kábel**, amely a kazettát a Visual Assembler programot futtató
  számítógéphez csatlakoztatja (virtuális soros portként jelenik meg).

| Beállítás            | Leírás                                                                                                                                                                    |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Monokróm / többszínű | A monokróm mód 1 bites 8×8-as karakterjeleket tárol. A többszínű mód két bites vízszintes pixelpárokat tárol, és a felhasznált cellákat a Color RAM 3-as bitjével jelöli. |

**Munkafolyamat:**
1. Helyezze a Kung Fu Flash 2-t a C64 kazettacsatlakozójába, kapcsolja be a
   számítógépet, és csatlakoztassa az USB-kábelt a PC-hez/Mac-hez.
2. Nyisd meg a **Beállítások → Integrációk** menüpontot, és ellenőrizd a **Kung
   Fu Flash 2** részt – a portnak már ki kell töltenie.
3. Válaszd ki az **Kung Fu Flash 2** elemet a megosztott futtatás menüjéből (a
   választást a rendszer megjegyzi, és a projektfájlokban is tárolja).
4. Kattintson a **▶ Futtatás** gombra. A program lefordításra kerül, a kazetta
   újraindul a MENU betöltőjébe (egy rövid, 1200 baudos soros port-"érintés"),
   egy rövid kézfogás következik, és a PRG feltöltődik. Amikor az átvitel
   befejeződik, a program fut a valódi gépen.

**Block**, **Expert** és **Ultimate Basic** módban egyaránt működik; az Ultimate
Basic programok a projekt indítófájljából fordulnak le.

> **Korlátok és ellenőrzések:** a PRG-nek tartalmaznia kell a kétbájtos
> betöltési címet plusz legalább egy adatbájtot, bele kell férnie a C64 64
> KiB-os címterébe, és nem haladhatja meg a kazetta betöltője által elfogadott
> méretet. A hibákat – a port nincs konfigurálva, a port nem nyitható meg, a
> kazetta nem tér vissza a MENU-ből, vagy a feltöltés elutasítva – egy
> pirítósban jelentik a pontos okkal együtt.

> **Tipp:** Ha élő feltöltés helyett kazettaképet szeretnél, a **Build CRT**
> (Magic Desk 64K) Kung Fu Flash-en is fut — lásd a [12b.
> szakaszt](#12b-crt-export-magic-desk-64k-cartridge).

### Verziókövetés (git)

**Beállítások → Általános → Verziókövetés** és **Beállítások → Fájlok és elérési
utak → git**:

| Beállítás                                               | Leírás                                                                                                                                                                         |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Automatikus mentési bejegyzések a verziókövetésben**  | Hozzáad egy automatikus mentési bejegyzést a verzióelőzményekhez körülbelül 2,5 másodperccel a szerkesztés leállítása után (a projektfülek esetében is a projektelőzményekhez) |
| **Válassza a git.exe…** fájlt                           | Tallózz a(z) `git` futtatható fájlhoz (Windows rendszeren: `git.exe`)                                                                                                          |
| **Automatikus felismerés**                              | Törli a kiválasztott elérési utat, és átkutatja az elérési utat és a szokásos telepítési mappákat.                                                                             |
| **Használj Gitet, ha a projekt egy repositoryban van.** | Megnyitja a verziókövetés párbeszédablakot Git módban a git repositoryban található fájlokhoz.                                                                                 |
| **Állapot**                                             | Megjeleníti a git verzióját, vagy azt, hogy a git nem található (a beépített verziókövetés továbbra is működik)                                                                |

## 14. Vizuális szerkesztők (eszközkészlet)

A vizuális szerkesztők saját eszköztárgombokkal nyílnak meg. Mindegyikhez
tartozik egy **Fájlok ▾** menü az adatok (többnyire nyers `.bin`) betöltéséhez
és mentéséhez, valamint a programba való beillesztéshez (**Exportálás
blokkokba**); egy `.bin` fájl a programba kerül az `INCBIN` paranccsal. A nagy
felbontású szerkesztő közvetlenül D64 lemezre is menthet (**Mentés D64-be…**).

**Színpaletta:** **Beállítások → Általános → Szerkesztők → C64 színpaletta**
választja ki az RGB értékeket, amelyekkel minden szerkesztő kirajzolja a 16 C64
színt (sprite, karakter, Charset Canvas, Hi-Res, térkép- és pályaszerkesztő,
Toolkit színskálák). Az alapértelmezett beállítás a **Colodore**, amely a
legközelebb áll egy valódi C64-hez kompozit / S-Video kijelzőn; a **Pepto** (a
régebbi verziók sötétebb, kevésbé telített palettája), a **VICE**, a **Deekay**
és a **C64 Wiki / Godot** is elérhető. Csak a megjelenítés változik - az
adatokban lévő színindexek változatlanok maradnak. A nagy felbontású
képimportálás is a szerkesztőpalettát használja, kivéve, ha ott választ ki egy
másikat.

**Egyéni paletta:** ha egyik sem felel meg a monitorodnak vagy a valódi
C64-ednek, válaszd az **Egyéni** lehetőséget, majd kattints az **Egyéni paletta
szerkesztése…** gombra. Mind a 16 színhez tartozik egy színválasztó és egy
hexadecimális mező (`#RRGGBB`); A **Kezdés innen:** + **Másolás** mind a 16
színt kitölti egy beépített palettáról. Az **Import…** parancs beolvassa a
Photoshop `.act`, VICE `.vpl`, GIMP `.gpl` vagy bármilyen 16 `#RRGGBB` /
`$RRGGBB` értékű szöveget (az első 16 színt használja); az **Export .act** és az
**Export .vpl** parancs kiírja a palettát Photoshophoz vagy VICE-hoz
(*Beállítások → Videó → Paletta* a VICE-ban), így összehasonlíthatja ugyanazokat
a színeket az emulátorban. A **Mentés** elmenti, és átvált az **Egyéni**
beállításra.

A vizuális szerkesztő párbeszédablakok a fejlécüknél fogva húzhatók a teljes
Visual Assembler munkaterületen. A mentett pozícióval nem rendelkező
párbeszédablakok középre igazítva jelennek meg; áthelyezés után az utolsó
pozíciója a felhasználói felület beállításaiban tárolódik, és a következő
megnyitáskor visszaáll.

### Nagy felbontású / többszínű szerkesztő

Pixel szintű bitképszerkesztő 320×200 nagy felbontású és 160×200 többszínű
móddal. Nyissa meg a Nagy felbontású szerkesztő eszköztár gombjával.

| Jellemző                    | Leírás                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Módváltás                   | A **Többszínű** jelölőnégyzet a nagy felbontású (cellánként fekete-fehér) és a többszínű (cellánként 4 szín) között vált.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Eszközök                    | Ceruza, radír, vonal, téglalap, kitöltött téglalap, ovális, kitöltött ovális, kitöltés, színválasztó, cellás papír, kijelölés.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Színválasztó                | Kattintson egy képpontra, hogy látható színe a tinta legyen (nagy felbontású módban a cella tintája vagy a papír, attól függően, hogy a képpont melyiket mutatja); a szerkesztő ezután visszatér az előző eszközhöz. Az **Alt+kattintás** billentyűkombinációval kiválaszthatja a színt bármelyik eszközzel.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Sejtpapír (nagy felbontású) | A nagy felbontású mód minden 8×8-as cellában két színt engedélyez: a tintaszínt (beállított pixelek, a cella képernyő RAM-jának magas felhasználása) és a papírszínt (tiszta pixelek, alacsony felhasználás). A **Cell paper** eszköz minden kattintással vagy húzással kijelölt cella papírszínét a kiválasztott színre állítja; a **PAPER** továbbra is minden cellát egyszerre állít be. A radír törli a pixeleket, így a cella saját papírszíne látszik. Többszínű módban, ahol a háttér ($D021) megosztott, le van tiltva.                                                                                                                                                                                                                                                                |
| Szóróeszköz                 | Airbrush stílusú festő, amely rajzolás közben pixeleket szór a kurzor körül.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Permetezés intenzitása      | A szóróeszköz melletti legördülő menüvel szabályozható az egyes szóróvonások sűrűsége.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Színpaletta                 | Előtér (tinta) + papír (háttér) választó. A többszínű mód automatikusan cellánként 3 extrát követ.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Visszavonás / Újraindítás   | Löketenkénti előzmények, ctrl-Z / ctrl-Y.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Válasszon                   | A szaggatott négyzet eszköz: húzd az egeret a vásznon egy téglalap alakú régió kijelöléséhez. Az **Esc** billentyűkombináció törli a kijelölést.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Másolás / Beillesztés       | A **Másolás** (`Ctrl/Cmd+C`) paranccsal másolható a kijelölt terület. A **Beillesztés** (`Ctrl/Cmd+V`) paranccsal a kurzort követő előnézetet jeleníthet meg: kattintson a vászonra az elhelyezéséhez, az **Esc** paranccsal megszakíthatja a műveletet. A másolat megmarad, ezért a `Ctrl/Cmd+V` billentyűkombináció megnyomásával és az újbóli kattintással annyiszor helyezheti el, ahányszor szükséges. Nagy felbontású módban a beillesztett képpontok továbbra is követik a cellánkénti két szín korlátját, ezért a terület színeinek megőrzése érdekében igazítsa a cellarácshoz a területet. A Másolás, Beillesztés és Átlátszó beillesztés funkciók a vászon jobb gombbal elérhető menüjében is elérhetők; a beillesztés ott kezdődik, ahol a kattintott ponton kezdődik az előnézet. |
| Átlátszó paszta             | A `Ctrl/Cmd+Shift+V` (vagy annak eszköztárgombja) billentyűkombináció kihagyja a másolat papírszínű pixeleit, így az alattuk lévő kép átlátszik.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Rács + Raszter              | Az **Grid** a karaktercella-rácsot mutatja: 8×8 pixel nagy felbontású, 4×8 dupla széles pixel többszínű módban. 4×-es nagyítástól halványabb vonalat húz minden egyes pixel köré, így minden pixel pontosan elhelyezhető. Az **Raster** raszteres sorrátétet ad hozzá.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Zoomolás                    | Csúsztassa a csúszkát 1×-ről 16×-ra, vagy vigye a Ctrl+görgőt a vásznon (a kurzor alatti pont a helyén marad).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Kép importálása             | A vászonra dobott PNG/JPEG/GIF fájlok automatikusan kvantálódnak a 16 színű C64 palettára.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Blokk exportálása           | BYTE/RAWBYTES blokkokat fűz a programhoz a kódolt bitképes, képernyő- és színadatokkal.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Exportálás: `.bin`          | Elmenti a natív többszínű formátumot (10000 bájt: 8000 bitkép + 1000 képernyő + 1000 szín) a LOADFILE-ra $2000 fájlformátumban.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |

### Sprite-szerkesztő

24×21 pixeles sprite szerkesztő több képkockás animációval. Nyisd meg a Sprite
szerkesztő eszköztár gombjával.

| Jellemző                  | Leírás                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Keretek                   | Keretek hozzáadása / eltávolítása / átrendezése; a keretsáv alul látható. A keretsorban található **Másolás** / **Beillesztés** paranccsal másolja a teljes aktuális keretet; ugyanez a két bejegyzés található a vászon és a keretsáv jobb gombbal előhívható menüjében is.                                                                                                                                                                                                    |
| Mód                       | Monokróm / többszínű váltás.                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Eszközök                  | Ceruza, kitöltés, színválasztó, vonal, téglalap, kör – plusz vízszintes tükrözés, függőleges tükrözés, eltolás balra/jobbra/fel/le (opcionális körbefuttatás). Az alakzateszközök élő előnézetet jelenítenek meg húzás közben; a véglegesítéshez engedje el az egérgombot.                                                                                                                                                                                                      |
| Színválasztó              | Kattintson egy képpontra a színhely (sprite szín, MC1, MC2, háttér- vagy átfedő szín a szerkesztett rétegen) kiválasztásához; a szerkesztő ezután visszatér az előző eszközhöz. **Alt+kattintás** bármelyik eszközzel kiválaszt.                                                                                                                                                                                                                                                |
| Zoomolás                  | Csúszka 3×-ról 40×-re, vagy Ctrl+görgő a vásznon.                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Visszavonás / újraindítás | Teljes visszavonás/ismétlés művelet képkockánként. Ctrl/Cmd+Z / Ctrl/Cmd+Y vagy az eszköztár gombjai.                                                                                                                                                                                                                                                                                                                                                                           |
| Képimportálás             | PNG vagy JPEG fájl importálása a Fájlok → Kép importálása menüpontban. Az importáló minden képpontot a legközelebbi C64 palettaszínhez rendel, és beírja az aktuális képkockába.                                                                                                                                                                                                                                                                                                |
| Animáció előnézete        | Lejátszás / leállítás konfigurálható sebességgel.                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Blokk exportálása         | Minden képkockához beszúr egy RAWBYTES blokkot 64 bájtos, egymáshoz igazított címen, valamint egy sprite pointer beállítást.                                                                                                                                                                                                                                                                                                                                                    |
| Mentés `.bin`             | Képkockánként 64 bájtot ír (nyers sprite adatok kitöltés nélkül).                                                                                                                                                                                                                                                                                                                                                                                                               |
| Kiválasztás               | **Kijelölés / mozgatás**: húzz egy téglalapot, majd húzd az egérmutatót a belsejébe a képpontok mozgatásához (az üres képpontok átlátszóak); a nyílbillentyűk egy képponttal mozgatják (többszínű esetén kettővel), a Delete törli, az Esc elveti. **Elforgatás 90°-kal** (mindkét irányban) elforgatja a kijelölést, vagy az egész keretet. A kijelölés, tükrözés, eltolás és forgatás együttesen hatnak a testre és az átfedésre.                                             |
| Nagy felbontású átfedés   | A **Nagy felbontású overlay** egy második, egyszínű nagy felbontású sprite-ot ad hozzá minden képkockához – a klasszikus körvonalat egy többszínű test felett. Az **Réteg** lista kiválasztja a szerkesztett réteget; az overlay halványan jelenik meg, amíg a test szerkesztve van. A C64-en ez egy különálló sprite: adj neki alacsonyabb sprite-számot, mint a testnek. Az `.bin` és a **Copy bytes** parancsok az overlay sprite-okat a test (`sprite_f1_ov_1`) után írják. |
| Minden tükrözése          | Minden képkocka (és a hozzá tartozó találati mező) vízszintesen tükrözött másolatát hozzáfűzi – egyetlen kattintással elvégezhető a körforgás a másik irányba.                                                                                                                                                                                                                                                                                                                  |
| Sprite lap importálása    | Fájlok → **Sprite lap importálása…**: a cella szélessége / magassága, az eltolás, a rés és a képkockaszám a képet az aktuális méretű képkockákra vágja (a többszínű cellák sprite-onként 12 pixelre vannak méretezve). A színek a képből származnak, vagy a sprite sajátjai maradnak; OKLab illesztés színárnyalatok nélkül, rendezett (Bayer) vagy Floyd-Steinberg színárnyalatok. Lecseréli a képkockákat, vagy hozzájuk fűzi a képeket.                                      |
| Találatmező               | A **Hitbox** eszköz képkockánként egy téglalapot húz (szaggatott ciánkék); a **Fit**, **Fit every frame**, **Copy to every frame** és **Remove** menüpontok az oldalsó panelen találhatók. A Fájlok → **Copy hitbox table** visszaadja a `sprite_hit_x / _y / _w / _h` értéket (képkockánként egy bájt, a képernyő pixelei a bal felső sarokból); a hitbox nélküli képkocka a saját pixelhatárait használja.                                                                    |
| X / Y ×2                  | Az `$D01D` / `$D017` sprite bővítményhez hasonló előnézetet mutat.                                                                                                                                                                                                                                                                                                                                                                                                              |

Az **Exportálás UltimateBasicbe** (Fájlok menü) minden képkockát (maximum 8-at)
`sprdef` formátumban ír ki, beállítja a 0. sprite-ot (színes, többszínű,
kibontás), és animáció esetén hozzáad egy raszteres szinkronizálású ciklust,
amely a szerkesztő FPS-ével lépteti a képkockákat. Ultimate Basic módban a
kurzornál kerül beszúrásra, egyébként a vágólapra másolja.

### C64 karakter ROM böngésző ("Karaktertérkép")

A C64 karakter ROM (a beépített PETSCII betűtípus) csak olvasható megjelenítője.
Nyissa meg a **C64 chargen** eszköztár gombbal. Hasznos egy karakterjel
képernyőkódjának megkereséséhez, mielőtt a `RAWBYTES` vagy az `TEXT` paranccsal
megírná.

| Jellemző            | Leírás                                                                                                                                                                                                                                             |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Két karakterkészlet | 1. fül: ** 1. készlet — Felső/Grafika** (alapértelmezett mód bekapcsolás után). 2. fül: ** 2. készlet — Alsó/Felső** (`$0E` váltás után).                                                                                                          |
| Karakterjelrács     | 16×16-os rács, mind a 256 karakterből. Kattintson egy karakterjelre a részletes panel megtekintéséhez: nagyított 8×8 pixeles nézet, képernyőkód (decimális + hex), PETSCII kódok (alapértelmezett és eltolt is), valamint a nyers 8 bájtos bitkép. |
| Részletes panel     | Megjeleníti a kiválasztott karakterjel képernyőkódját, a PETSCII kódokat és a nyolc nyers bájtot – készen áll a beillesztésre egy `RAWBYTES` vagy BYTE blokkba.                                                                                    |
| Csak olvasható      | Nincs szükség szerkesztésre — a karakterjelek módosításához használd a Karakterszerkesztőt (lent).                                                                                                                                                 |

### Karakterszerkesztő (Karakterkészlet)

256 karakteres 8×8 karakterkészlet-szerkesztő. Nyissa meg a Karakterszerkesztő
eszköztár gombjával.

| Jellemző                   | Leírás                                                                                                                                                                                                                                                                                      |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ROM betöltése              | Betölti a C64 karakter ROM-ot — a pontos 901225-01 karakterjeleket, fájlválasztó nélkül. Az első gomb (és a **Fájlok → ROM: nagybetűs / grafika**) az 1. készletet, a második gomb (vagy a Shift+kattintás, vagy a **Fájlok → ROM: kisbetűs / nagybetűs**) a 2. készletet tölti be.         |
| Betöltés `.bin`            | Importál egy külső, 2048 bájtos karakterkészletű bináris fájlt.                                                                                                                                                                                                                             |
| Karakterenkénti előnézet   | 16 szélességű rács, amely mind a 256 karakterjelet tartalmazza, az aktuális cellával kiemelve.                                                                                                                                                                                              |
| Pixel szerkesztő           | A kiválasztott karaktert, vagy egy 2×1, 1×2 vagy 2×2 szomszédos karakterből álló **csempét** egyetlen képpé szerkeszti (Csempeválasztó).                                                                                                                                                    |
| Rajzeszközök               | Ceruza, vonal, téglalap, kitöltött téglalap, kitöltés és színválasztó. Egy olyan képpontra kattintva, amelyen már van tinta, az törlődik. A színválasztó (csak többszínűeknél; **Alt+kattintás** bármelyik eszközzel) a kattintott képpont színét – FG, BG, MC1 vagy MC2 – teszi a tintává. |
| Átalakítások               | Törlés, megfordítás, vízszintes/függőleges tükrözés, eltolás körbefuttatással, 90°-os elforgatás az óramutató járásával megegyezően/az óramutató járásával ellentétesen (csak négyzet alakú csempéknél) – az egész csempén.                                                                 |
| Visszavonás / Újraindítás  | Eszköztár gombjai, Ctrl+Z és Ctrl+Y (Ctrl+Shift+Z).                                                                                                                                                                                                                                         |
| Másolás / Beillesztés      | Eszköztár gombjai, Ctrl+C / Ctrl+V, vagy jobb egérgombbal kattintás a térképre; a teljes csempét másolja a színeivel együtt.                                                                                                                                                                |
| Térképhúzás                | Húzzon egy karaktert egy másikra a térképen a cseréhez; a Shift billentyű lenyomása mellett húzza át a másolatokat.                                                                                                                                                                         |
| Szöveg előnézete           | Írjon be szöveget a jelenlegi karakterkészletben való megtekintéshez. Válassza ki a nagybetűs vagy kisbetűs karakterkészlet-hozzárendelést; az `{65}` vagy az `{$41}` beszúr egy képernyőkódot.                                                                                             |
| Tartomány exportálása      | Állítsd be a From / Custo karaktereket, majd **Files → Save range (.bin)** (nyers bájtok) vagy **Copy range ASM** (`.byte` sorok).                                                                                                                                                          |
| Karakterenkénti szín       | Minden karakterjelhez egy alapértelmezett Color RAM értéket tárol. Többszínű karaktermódban ez megőrzi a cellánkénti többszínű engedélyezési bitet és a karakter saját alsó 3 bites színét is.                                                                                              |
| Metaadatok oda-vissza útja | Kompatibilis adatok Charset Canvas / Map munkafolyamatokból történő betöltésekor a karakterenkénti szín metaadatok megmaradnak, így a szerkesztések a színszándék elvesztése nélkül folytatódhatnak.                                                                                        |
| Blokk exportálása          | A RAWBYTES értékét a $0800 (2. blokk) vagy a $3800 (7. blokk) értéknél a kódolt karakterkészlettel fűzi hozzá.                                                                                                                                                                              |

### Karakterkészlet-vászonszerkesztő

Teljes vászon karakterkészlet-festő képernyők létrehozásához egy teljes 256
karakteres karakterkészletből. Nyissa meg a Karakterkészlet vászon eszköztár
gombjával.

A vászon 16×16 karakteres, 128×128 pixeles. Többszínű karakter módban minden
karakter vagy többszínű (széles pixelek, 4 szín), vagy nagy felbontású (8
keskeny pixel, 2 szín), pontosan úgy, mint a C64-en.

| Jellemző                                    | Leírás                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |                                                              |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Monokróm / többszínű                        | A monokróm mód 1 bites 8×8-as karakterjeleket tárol. A többszínű mód két bites vízszintes pixelpárokat tárol, és a többszínű cellákat a Color RAM 3-as bitjével jelöli.                                                                                                                                                                                                                                                                                                                                                                                                               |                                                              |
| Karakter mód eszköz                         | Többszínű módban kattints vagy húzd az egérmutatót a karakterek fölé, hogy válthass a többszínű és a nagy felbontású mód között (Color RAM 3. bit). Az alak megmarad: egy beállított pixelpár lesz a karakter saját színe. Egy nagy felbontású karakternek van háttere és saját színe (0–7); az MC1 / MC2 nem fest oda.                                                                                                                                                                                                                                                               |                                                              |
| Háttér                                      | A BG legördülő menü mono módban is látható; az MC1 / MC2 csak többszínű módban.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |                                                              |
| ECM                                         | Az **ECM** jelölőnégyzet (kiterjesztett színmód, nem használható a többszínűvel együtt): minden karakter nagy felbontású, saját színnel (0–15) és négy háttér egyikével (BG0–BG3) (`$D021`–`$D024`; a BG1 / BG2 az MC1 / MC2 regiszterek). Válasszon egy BG színt a palettán (B0–B3 címkével), majd kattintson vagy húzza át az egeret a karakterek felett a **Karakterháttér** eszközzel. Csak 64 különböző karakter fér el: az állapotsor számolja őket, és a mentés az egyenlő karaktereket egyesíti – a karakterkészlet 64 karakter (512 bájt), a képernyőkódok pedig `glyph`-ek. | háttér << 6`. Kapcsolja be az ECM-et az `$D011` 6. bitjével. |
| C64 színmodell                              | A háttér az `$D021` biteket használja; a megosztott többszínű 1 az `$D022` biteket használja; a megosztott többszínű 2 az `$D023` biteket használja; minden karakter saját színe a Color RAM 0–2 bitjeiből származik.                                                                                                                                                                                                                                                                                                                                                                 |                                                              |
| Rajzeszközök                                | A ceruza, radír, vonal, téglalap, ovális és elárasztásos kitöltés a karakterhatárokon átívelően működik.                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |                                                              |
| Színválasztó                                | Kattintson egy képpontra a látható színének kiválasztásához (többszínű karakter esetén a BG / MC1 / MC2 / saját színű tintájának kiválasztásához is); a szerkesztő ezután visszatér az előző eszközhöz. **Alt+kattintás** bármelyik eszközzel kiválaszt.                                                                                                                                                                                                                                                                                                                              |                                                              |
| Szóróeszköz                                 | Airbrush stílusú rajz, amely pixeleket szór szét a szomszédos cellákon/karaktereken.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |                                                              |
| Permetezés intenzitása                      | A szóróeszköz melletti legördülő menüvel állíthatja be a vonal sűrűségét.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |                                                              |
| Rács váltása                                | A Rács jelölőnégyzet bejelölésével megjelenítheti vagy elrejtheti a 16×16-os karakterrácsot.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |                                                              |
| Zoomolás                                    | A zoom csúszka (2×–24×, az eszköz teljes pixelei C64 pixelenként) vagy a Ctrl+görgő a vászon felett; a zoomot a program megjegyzi. 8×-tól a Rács minden pixel szélén egy vékony vonalat húz.                                                                                                                                                                                                                                                                                                                                                                                          |                                                              |
| Karakterkészlet mentése: `.bin`             | Menti a 2048 bájtos karakteres bitképes adatokat.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |                                                              |
| 16×16-os térkép + Színes RAM mentése `.bin` | 256 képernyőkódot, majd 256 színes RAM-értéket ment. Használja ezt a `MAP_COPY16X16` paranccsal.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |                                                              |
| Terhelés                                    | Betöltheti a charset-canvas mentéseket, az egyszerű charset adatokat és a kompatibilis Karakterszerkesztő charset adatokat, beleértve a tárolt karakterenkénti színeket is, ha vannak.                                                                                                                                                                                                                                                                                                                                                                                                |                                                              |

**Fontos C64 korlátozás:** többszínű karakter módban a két megosztott szín
globális a teljes képernyőn (`$D022` / `$D023`). Cellánként csak a karakter
saját színe van megadva, és ez a 0–7 színekre korlátozódik, mivel a Color RAM 3.
bitje választja ki a többszínű módot. Tehát egy karakter legfeljebb **4 színt**
(háttér, MC1, MC2 és a saját színe) jelenít meg, a teljes képernyő pedig
legfeljebb 3 + 8-at. A palettán a megosztott színek BG / 1 / 2 címkével vannak
ellátva, a nem megosztott 8–15. színek pedig halványan jelennek meg. Egy ilyen
szín kiválasztása csak az MC2 vagy MC1 regiszterbe helyezi, miközben egyetlen
pixel sem használja ezt a regisztert; ellenkező esetben módosítsa a legördülő
menüben (ami átszínezi a teljes képernyőt). Nagy felbontású (mono) módban egy
karakternek két színe van: a háttérszíne és a saját színe (0–15).

### Térképszerkesztő (többrétegű csempetérképek)

Réteges csempetérkép-szerkesztő statikus tájképekhez, sprite-alapú
spawn-térképekhez, ütközési adatokhoz és hasonlókhoz. Nyissa meg a
Térképszerkesztő eszköztár gombjával.

| Jellemző                                  | Leírás                                                                                                                                                                                                                                                                                 |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Rétegek                                   | Több elnevezett réteg, mindegyik saját csempével és átlátszósággal.                                                                                                                                                                                                                    |
| Ecsetek                                   | Egyetlen csempés, kitöltés, vonal, téglalap és kör módok. Az alakzateszközök élő előnézetet jelenítenek meg húzás közben; a véglegesítéshez engedje el az egérgombot.                                                                                                                  |
| Zoomolás                                  | Csúszka, vagy Ctrl+görgő a térkép felett.                                                                                                                                                                                                                                              |
| Visszavonás / újraindítás                 | Teljes visszavonás/ismétlés művelet rétegenként. Ctrl/Cmd+Z / Ctrl/Cmd+Y vagy az eszköztár gombjai.                                                                                                                                                                                    |
| Menü törlése                              | Rétegenkénti vagy teljes térképi törlés megerősítéssel.                                                                                                                                                                                                                                |
| Képimportálás                             | Helyezzen el egy tilemap PNG-jét; a szerkesztő automatikusan csempékre szeleteli.                                                                                                                                                                                                      |
| Másolás / beillesztés                     | Másolja ki a kijelölt csempeterületet, majd illessze be normál módon, vagy használjon átlátszó beillesztést az üres csempék átlátszóságának megőrzéséhez. Ugyanezek a bejegyzések találhatók a vászon jobb gombbal elérhető menüjében is.                                              |
| Többszínű csempe színezés                 | Kompatibilis karakterkészlet metaadatokkal a festés a csempe tárolt Color RAM alapértelmezett értékeit használja (beleértve a többszínűséggel kapcsolatos kódolást is) egy általános, egyszínű helyett.                                                                                |
| Egyéni karakterkészlet színek             | Amikor egy karakterkészlet `charColors` metaadatot hordoz, a Térképszerkesztő a kiválasztott csempe alapértelmezett Szín RAM értékét használja festés közben.                                                                                                                          |
| Blokk exportálása                         | RAWBYTES blokkokat bocsát ki a csempék grafikáihoz + térképadatokhoz.                                                                                                                                                                                                                  |
| Képernyő RAM mentése (.bin)…              | Csak az aktuális térképréteg képernyőkódjait menti el (40×25 = 1000 bájt).                                                                                                                                                                                                             |
| Képernyő RAM + Színes RAM (.bin) mentése… | A színes RAM-értékekkel összefűzött képernyőkódokat egyetlen 2000 bájtos fájlba menti (`screen[0..999]`, majd `color[0..999]`). Használja ezt az **MAP_COPY** makróval (`auto` színforrásként) a képernyő és a színek egyetlen művelettel történő visszaállításához futásidejű módban. |

### Szintszerkesztő

A(z) **Térképszerkesztő képernyőit** egy szintbe rendezi – függőleges
lövöldözős, lefelé görgető autós játék, oldalra görgető vagy 2D-s térkép –, és a
teljes pálya előnézetét sima görgetéssel jeleníti meg. Nyissa meg a(z)
**Pályaszerkesztő** eszköztárgombbal a Térképszerkesztő mellett.

| Jellemző          | Leírás                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Elrendezés        | **Függőleges**, **Vízszintes** vagy **Rács** (sorok × oszlopok, sorok és oszlopok hozzáadása/eltávolítása gombokkal).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Képernyők         | **Új üres képernyő**, **Hozzáadás a Térképszerkesztőből** (a jelenleg megnyitott térkép) vagy **Térkép(ek) betöltése (.bin)…** (több Térképszerkesztő export egyszerre). Húzzon egy képernyőt a listából egy helyre; húzza a helyeket egymásra a cseréhez.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Szerkesztés       | **Szerkesztés a Térképszerkesztőben** megnyitja a kijelölt képernyőt a Térképszerkesztőben, és visszaállítja a módosításokat; duplikálás, mozgatás fel/balra vagy le/jobbra, eltávolítás; visszavonás/ismétlés.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Előnézet          | Húzd az előnézetet, vagy használd a nyílbillentyűket a pixelenkénti görgetéshez; az **Lejátszás** automatikusan görget (irány, sebesség 1–8, ismétlés), Szóköz = lejátszás / leállítás. Az *Szegélyek* a képernyő határait jelöli.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Zoomolás          | Az áttekintés nagyításának csúszkája (25–400%), vagy a Ctrl+görgő billentyű lenyomása az áttekintés felett.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Csekkek           | Karakterkészlet-információk, valamint figyelmeztetés, ha a képernyők eltérő karakterkészletet vagy színeket használnak (a szint az első képernyő beállításait használja).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Karakterjellemzők | Az **Karakterattribútumok** gombbal az áttekintést attribútumfestésre válthatod: válaszd a **Solid**, **Ladder**, **Hazard** vagy **Collectible** elemet, kattints egy karakterre, és minden olyan cella, amelyik tartalmazza az adott képernyőkódot, megkapja (vagy elveszíti) azt; húzd az egeret további kódokért. Az attribútumok színes rétegként jelennek meg, és a 256 bájtos `LEVEL_ATTR` táblázatot alkotják (`LEVEL_ATTR_SOLID` = 1, `_LADDER` = 2, `_HAZARD` = 4, `_COLLECT` = 8).                                                                                                                                                                                                                                                                                                                |
| Élellenőrzés      | Pirossal jelölve vannak azok a helyek, ahol a szomszédos képernyők nem folytatódnak: a szegély egyik oldala üres (szóköz), a másik nem, vagy csak az egyik oldal tömör. Az oldalsó panel számolja az éleket és a cellákat.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Színek            | **Szint szegély**, és **Saját színek ehhez a képernyőhöz** (háttér, szegély, többszínű 1 / 2) a kiválasztott képernyőhöz; az előnézeti keret a szegélyt mutatja. Helyenként exportálva `LEVEL_SCR_BG / _BORDER / _MC1 / _MC2` formátumban (`LEVEL_SCR_COLORS` = 1 értékkel), ha egy elhelyezett képernyő saját színekkel rendelkezik.                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Memória           | Az `.level` adatméret egy kiválasztott címen (pontosan úgy számítva ki, ahogy a makró felépíti), figyelmeztetésekkel a BASIC / KERNAL ROM-ra, az alatta lévő I/O területre és memóriára `$0800`, valamint a szint RLE méretére vonatkozóan. Az **RLE exportálása blokkokba / RLE másolása asm** parancs megadja a `level_unrle` kicsomagolóval (`($FB)` → `($FD)`) kicsomagolt szint RLE értékét.                                                                                                                                                                                                                                                                                                                                                                                                            |
| Futás VICE-ban    | Egy joystick-os görgetéses tesztprogramot épít a szintből (a `level-demo` görgető, kód a `$C000`-en, szintadatok a `$2000`-en, egyéni karakterkészlet a `$2000`-en), és elindítja a VICE-ban — a képernyő színei a nézet bal felső sarkában lévő képernyővel váltanak, a kamera az első Start objektumnál indul.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Tárgyak           | Az **Objektum réteg** gombbal az áttekintést objektumszerkesztésre válthatod: válassz egy típust (Start, Ellenség, Tárgy, Ajtó, Kijárat, Trigger) és egy **Param** bájtot (ellenség fajtája, tárgyazonosító, ajtó célpontja…), kattints az elhelyezéshez, húzd az áthelyezéshez (8 px-re rögzítve, Shift = szabad), kattints egy objektumra a kiválasztásához és a típus/paraméter módosításához, a nyílbillentyűk mozgatják, a Törlés gombbal eltávolíthatod. Az objektumok a szint pozíciójához tartoznak, nem egy képernyőhöz. Az oldalsávon vannak felsorolva, az előnézetben láthatók, a szinttel együtt mentve és görgetési sorrendben (függőlegesen Y-nal, vízszintesen X-szel, rács soronként) exportálva `LEVEL_OBJ_*` táblázatokként — az **Copy asm / Export to blocks** és az `.level` makróval. |

**Fájlok menü:**
| Akció                                                                   | Mit csinál                                                                                                                         |
| ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Új szint** / **Szint megnyitása (.bin)…** / **Szint mentése (.bin)…** | A pályaprojekt: az összes képernyő plusz az elrendezés. Ez a fájl, amit az `.level` makró és az Ultimate Basic `map load` beolvas. |
| **Képernyő RAM mentési szintje (.bin)…**                                | Az egész pálya egyetlen karaktertérképként (csak képernyőkódok).                                                                   |
| **Mentési szint Képernyő + Szín RAM (.bin)…**                           | A teljes szint képernyőkódjai, majd a színei.                                                                                      |
| **Exportálás blokkokba** / **asm másolása**                             | A szintadatok blokkokként vagy asm szövegként (vágólap).                                                                           |

**A level:** használata az assemblerben, `.level "level.bin"` + `.level_row`
(lásd [LEVEL / LEVEL_ROW](#level--level_row) és `samples/level-demo.asm`); az
Ultimate Basic 1.6.1+ verziójában, `map load "level.bin", $4000` és `map view
px, py` (példa: `level_scroll_demo.ub`).

### SID-szerkesztő (3 hangos követő)

Többhangszeres, 3 hangú követő. Nyisd meg az SID Editor eszköztár gombjával.
**Lejátszás: Az Összes** a WebSid emulátorban exportált 6502-es lejátszót
futtatja; minden más előnézet (hangszer előnézet, virtuális billentyűzet,
hangjegy bevitel, akkord/arpeggio, sor és egyetlen pattern lejátszása) is az
emulált SID-en játszik le: ugyanazon lejátszó JS modellje (képkockánként) minden
képkockán streameli a SID regisztereit a WebSid-re, és legfeljebb három
előnézeti hangjegy osztozik a három hangon. A stream lejátszó a szerkesztő
megnyitásakor, majd a Stop gomb megnyomásakor töltődik be, így a hangjegyek
egyszerre szólalnak meg; WebSid nélkül egy kis SID szintetizátor játszik le
helyette.

**Előnézeti motor:** **Beállítások → Általános → SID előnézet** kiválasztja a
**WebSID** vagy a **VA SID Core (Rust)** lehetőséget, az alkalmazás saját SID
emulációját; a VA SID Core esetében a chipet is ki kell választani (MOS 6581 /
8580). A szerkesztő fejléce mutatja a használatban lévő motort (pl. *· VA SID
Core v1.2 (MOS 8580)*). A műszerparamétereket gombokkal lehet beállítani.

**Eszközönkénti vezérlők:**
- Hullámforma jelölőnégyzetek (TRI / SAW / PUL / NOI) – több hullámforma ÉS
  kapcsolattal van összekapcsolva, mint a SID-en – plusz **RING** (a háromszög
  gyűrűmodulációja az előző hangszerhang által: 1 ← 3, 2 ← 1, 3 ← 2) és **SYNC**
  (hard szinkron az előző hangszerhanggal).
- Az ADSR (támadás / lecsengés / fenntartás / felszabadulás) húzásdiagramként
  látható a négy csúszka felett.
- Impulzusszélesség csúszka (0-4095).
- **Szűrő:** *Írja át ezt a hangot a szűrőn*, LP / BP / HP és **3 OFF** (a 3-as
  hang némítása, ha nincs átirányítva), vágási frekvencia, rezonancia, hangerő.
  **End** + **Sweep** mozgassa a vágási frekvenciát a Cut-tól az End felé
  képkockánként sweeppeléssel; a **Ping-pong** pattog a kettő között – ez hozza
  létre a rezonáns szűrő sweepeléseket. A szűrővel irányított hangszert elindító
  hang birtokolja a szűrőt (vágási frekvencia, rezonancia, módus); minden hang,
  amelynek a hangszere átirányítva van, áthalad rajta.
- **Vibrato:** a **Delay** effekt után egy háromszög alakú LFO-t keretez, amely
  **Speed** képkockánként megfordul, **Depth** 0-15-tel skálázva a hang
  félhangjára (függetlenül az `V` effekttől).
- **Impulzusszélesség-moduláció:** **Sebesség** hozzáadódik az
  impulzusszélességhez minden képkockán, **Min** és **Max** között ingadozva.
- **Kapu:** **A Kapu időzítő** annyi képkockával engedi el a kaput, ahány
  képkockával a következő hang előtt a hangon lesz (tartsa a Sebesség alatt); A
  **Hard restart** szintén lenullázza az ADSR-t, hogy tiszta attackot kapjon; az
  **First frame** egy hullámformát ír a hang első képkockájára (pl. `$09` teszt
  + kapu).
- **Hullámforma / arpeggio táblázat:** akár 32 hullámforma lépés (— = megtartva)
  és hang (félhanggal eltolva, vagy **abs** = abszolút hang), egy lépés minden
  **Speed** képkockánként, **Loop** vissza egy lépésre vagy megállás az utolsón.
  **Presetek** (25, csoportokban; a lista a kiválasztott presetet tartja meg,
  amíg a táblázatot kézzel nem szerkesztik): arpeggiók (dúr, moll, septum
  akkordok, sus4, csökkentett, növelt, power akkord, oktáv, trilla), dobok
  (lábdob, pergő, tam, taps, zárt / nyitott hi-hat), szóló és basszus attackek,
  valamint hangeffektek (lézer, hangszedő, explosion).

**Követőrács:**
- 3 hang × akár 256 pattern × 32 sor; a dal/sorrend lista akár 255 lépést is
  tartalmazhat.
- Soronként: hangjegy + hangszerindex, plusz egy opcionális effekt (lásd az
  **Effekt oszlopot** alább). Az üres sorok az előző hangjegyet tartalmazzák:
  más követőkhöz (GoatTracker, SID-Wizard) hasonlóan egy hangjegy a következő
  hangjegyig, vagy egy **hangjegy-eltávolításig** tartja a kapuját bekapcsolva.
- Az **Enter** (vagy dupla kattintás) szövegként szerkeszti a kijelölt cellát
  (`C-4 01 V24`); az **Enter** menti és a következő sorra ugrik, az **Esc**
  megszakítja a műveletet.
- **Note-off** (`===`): billentyűzd be a **1** (vagy `` ` `` / `=`) parancsot,
  vagy írd be egy cellába a `===` / `OFF` parancsot. Ez feloldja a kaput, így a
  hangszer kioldása lefut – ugyanúgy, mint az `C` effekt hangjegy nélkül (`C00`
  néven mentve és exportálva).
- Jelöljön ki egy cellát a szokásos módon, vagy tartsa lenyomva a **Shift**
  billentyűt kattintás közben, illetve a nyílbillentyűkkel bővítse ki a téglalap
  alakú kijelölés sorokon és a három hang bármelyikén át. A kijelölt területen
  belül a jobb gombbal kattintva a tartomány érintetlen marad.
- A Másolás, Kivágás, Beillesztés és Törlés parancsok elérhetők az ikon
  eszköztáron és az ikon alapú helyi menüben. A `Ctrl/Cmd+C` és a `Ctrl/Cmd+V`
  billentyűkombinációk ugyanazon a téglalap alakú kijelölésen működnek.
- Harmónia segéd: válassz alaphangot, akkordtípust és oktávot, hallgasd meg az
  akkordot az aktuális hangszerrel, majd illeszd be a hangmintát közvetlenül a
  követőbe. Az elérhető típusok: dúr, moll, csökkentett, kiterjesztett, Sus2,
  Sus4, domináns 7, dúr 7, moll 7, 6, moll 6, 9, b9, #9, dim7 és 7sus4.
- Arpeggio segéd: a kiválasztott akkordból kiindulva 4, 8 vagy 16 lépéses
  hangjegyfutamok előzetes megtekintése vagy beszúrása fel, le vagy fel/le
  irányban.
- A **Sor meghallgatása** meghallgatja a kiválasztott sort mindhárom hangon a
  pattern lejátszásának elindítása nélkül.
- A cellatartomány-beillesztés mostantól a kiválasztott tartomány
  kezdőcellájánál kezdődik, és tisztán megáll a hang- és sorhatároknál,
  ahelyett, hogy a következő oszlopba vagy sorba folyatódna.
- A **Speed** (sorok közötti képkockák, 1–255) paramétert a mellette lévő − / +
  gombokkal lehet beírni vagy léptetni; az `F` effektus lejátszás közben
  megváltoztatja ezt a sebességet.

**Dal / rendelési lista:**
- A mintákat egy dal/sorrend lista szerint rendezik el, amely a nyers pattern
  bankra rétegezve található – ugyanaz a pattern ismétlődhet, és a dal hosszabb
  lehet, mint a tárolt pattern-ek száma.
- Lépések hozzáadása, eltávolítása és átrendezése a dallista panelen; az
  aktuális lépés kiemelve jelenik meg lejátszás közben.
- Mind az alkalmazáson belüli visszajátszás, mind minden exportálás ezt a listát
  követi, nem a nyers pattern sorrendet – a sorrendlista előtti exportálások
  továbbra is helyesen töltődnek be sima 0..N-1 dalként.

**Effekt oszlop:** Minden cella egy effektet tartalmazhat a hangjegye és a
hangszere mellett, amelyet rövid kódként kell megadni közvetlenül a hangjegy
után (pl. `C-4 01 V24`), vagy önállóan egy hangjegy nélküli effekt sor esetén
(pl. `F06`):

| Kód | Hatás                           | Érték                                                         |
| --- | ------------------------------- | ------------------------------------------------------------- |
| `V` | Vibrato                         | kis harapás = mélység, nagy harapás = tartáshossz             |
| `U` | Felfelé csúsztatás (portamento) | a soronkénti gyakorisághoz hozzáadott összeg                  |
| `D` | Csúsztassa le (portamento)      | a sorok gyakoriságából kivont összeg                          |
| `C` | Hangjegykivágás                 | elnémítja a hangot újraindítás nélkül; fel nem használt érték |
| `F` | Sebességváltozás                | új képkocka/sor érték, azonnal érvénybe lép                   |

Az effektek soronként egyszer frissülnek (az exportált lejátszó időzítéséhez
igazodva), azonosan futnak a Web Audio előnézetben és a lefordított 6502-es
exportban, és veszteségmentesen kerülnek mentésre/betöltésre a verziózott `.bin`
formátumban.

**Lejátszás és virtuális billentyűzet:**
- A Lejátszás eszköztár gombja lejátszás közben Szünetre, szüneteltetés közben
  pedig Folytatásra vált; a Leállítás gomb leállítja a lejátszást és
  visszaállítja az eredeti állapotot.
- A követő eszköztár végén található **LCD** lejátszás közben mutatja a dal
  pozícióját (POS), a pattern-t (PAT), a sort (ROW) és a játékidőt (TIME),
  leállított állapotban pedig a szerkesztési pozíciót. **Beállítások → Általános
  → SID előnézet → LCD színe** zöldre vagy pirosra állítja.
- A billentyűzet eszköztár gombja megnyitja a **VA-VK** nevű, nem modális
  zongorát (2, 3 vagy 4 oktáv; pozíció, nyitott állapot, oktáv és *Beszúrás a
  követőbe* megjegyződik) saját **Lejátszás / Leállítás** gombokkal, amelyek a
  SID-szerkesztő aktív állapotában is használhatók. A fejlécét húzással a fő
  alkalmazás bármely pontjára helyezheti.
- A VA-VK **Instrument** gombja (húzás, egérgörgő vagy nyílbillentyűk) választja
  ki a kívánt műszert, amelynek száma és neve mellette látható az LCD-n; a
  szerkesztő műszerlistáját követi. A VA-VK címe melletti jelvény mutatja az
  alkalmazott SID emulációt (WebSID vagy VA SID Core a chip modellel).
- Engedélyezd az **Beszúrás a követőbe** funkciót, hogy minden lejátszott hangot
  az aktuális követőkurzornál írj, és a következő sorra lépj. Kapcsold ki, ha
  szerkesztés nélkül szeretnél meghallgatni hangokat.
- Az akkord- és arpeggio-előnézetek megvilágítják a megfelelő
  zongorabillentyűket, amikor a billentyűzet nyitva van.

**Felvétel, metronóm és MIDI:**
- A **Record** (a piros pont a követő eszköztáron és a VA-VK-n) a lejátszott
  hangokat – a VA-VK-n, a számítógép billentyűzetén vagy egy MIDI billentyűzeten
  – a kiválasztott hangszínre írja be a kiválasztott sortól kezdve, az aktuális
  sebességgel. Amikor a pattern megtelik, egy új üres pattern kerül hozzáadásra
  az aktuális dallépés után, és a felvétel onnan folytatódik. A leállításhoz
  nyomja meg ismét a Record gombot.
- A **Metronóm** (követő eszköztár és VA-VK) 4 sorban kattan, minden 4 ütemes
  sáv első ütemére helyezve a hangsúlyt. A mellette lévő ütemjelzők minden
  ütemnél villognak lejátszás és felvétel közben, még kikapcsolt kattanás
  mellett is.
- **MIDI:** válaszd ki a bemenetet a hangszer neve melletti **MIDI** listában,
  majd nyomd meg a **MIDI csatlakoztatása** gombot; a hangjegyek az aktuális
  hangszert játsszák (és felvétel közben, vagy a *MIDI beszúrása* gombbal
  beíródnak a trackerbe). A gomb melletti lámpa minden bejövő MIDI üzenetnél
  villog.
- **Pattern törlése:** A **−** gomb a **Pat +** mellett törli az aktuális
  pattern-t (először megkérdezi, hogy a pattern tartalmaz-e hangjegyeket). A
  pattern-t használó dallépések eltávolításra kerülnek, a többi pedig
  újraszámozásra kerül; legalább egy pattern mindig megmarad.
- Az **master hangerő** gomb a VA-VK-n található.

**Fájlok menü exportálása:**
| Export                               | Mit csinál                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ` .bin mentése…`                     | A szerkesztő natív szerializált formátumát írja ki (hangszerek az összes modulációs beállítással és névvel, sebességgel, patternekkel, dallal). A régebbi mentések továbbra is betöltődnek.                                                                                                                                                                                                                                    |
| `Blokkok exportálása (csak adatok)`  | A `* = $C000` helyen hozzáfűzi a műszertáblázatot + minta blokkokat a programhoz.                                                                                                                                                                                                                                                                                                                                              |
| `Blokkok exportálása + minilejátszó` | Hozzáadja a teljes lejátszót (sid_init / sid_irq / sid_frame / sid_play_row / sid_set_voice) plusz PAL frekvenciatáblázatokat. Exportálás után helyezz el egy `JSR sid_init` függvényt a fő kódodban, ahol a zenének kezdődnie kell; ehelyett képkockánként egyszer használd a saját `JSR sid_frame` IRQ hívásodat.                                                                                                            |
| ` ASM exportálása (vágólap)`         | A teljes assembly forráskódot a vágólapra másolja.                                                                                                                                                                                                                                                                                                                                                                             |
| `GoatTracker .sng importálása…`      | Betölt egy GoatTracker 2 dalt az aktuális helyett — lásd a **GoatTracker import** részt alább.                                                                                                                                                                                                                                                                                                                                 |
| ` .sid importálása…`                 | PSID / RSID dallamot szerkeszthető dallá konvertál az aktuális helyett — lásd az **.sid import** fájlt alább.                                                                                                                                                                                                                                                                                                                  |
| `Exportálás UltimateBasic-be`        | Kiír egy `tune ... end` blokkot (hangszerek, sorrendlista, pattern sorok szövegként) plusz a `music play` parancsot, és beszúrja azt az Ultimate Basic szerkesztő kurzorához; UB módon kívül a vágólapra másolja a szöveget. Az UltimateBasic fordítója építi fel a lejátszót, így a `music play` / `music stop` vezérli azt. A hangszermoduláció a `imod` / `ifilt` / `igate` / `itab` sorokba kerül (Ultimate Basic 1.6.2+). |

**GoatTracker importálás:** **Fájlok → GoatTracker .sng importálása…** betölt
egy GoatTracker 2 dalt (`.sng`, GTS3–GTS5) a jelenlegi dal helyett. Az átváltás
hozzávetőleges, mivel a két nyomkövető eltérően működik:
- A hangonkénti sorrendi listák (transzponálással és ismétléssel) egyetlen 3
  hangú dallá lapítottak, és 32 soros mintákra vágták őket; az azonos minták
  megosztottak.
- Hangszerek: Az AD/SR, az első hullámforma, a kapuidőzítő és a hard restart
  átvételre kerül; a hullámforma-tábla a hullámforma/arpeggio táblázattá, a PWM
  impulzustáblázattá, a szűrőtábla a szűrőmód, rezonancia és vágási sweep
  táblázattá, a sebességtábla pedig a hangszer vibrato táblájává válik.
- Mintaparancsok: hangnem le → hangnem le, portamento → `U` / `D` (soronként
  legfeljebb 255), tempo → `F`; a toneporta sima hanggá válik. A többi parancs
  elvész, és egy üzenet felsorolja, hogy mi lett megközelítőleg vagy kihagyva.
- A hullámtábla által kiadott kapu hangjelzésként jelenik meg a következő szabad
  sorban. Csak az első aldallam kerül importálásra.

**.sid import:** **Fájlok → .sid importálása…** megnyit egy PSID / RSID fájlt
(csak asztali alkalmazásban, VA SID Core-t használ). Válaszd ki az aldallamot és
a hosszát másodpercben, majd nyomd meg az **Importálás** gombot: a dallam
csendben fut, SID regiszterei képkockánként rögzítésre kerülnek, és az aktuális
regiszter helyett egy dallá alakulnak. Egy folyamatjelző sáv követi a felvételt,
majd a *Konvertálás…* a konverziót.
- **Megjegyzések:** egy hang a kapu élére kerül (a 2 képkockán belüli
  újraindítás egy hangnak számít); a legalább 5 képkockán át tartott kapu alatti
  hangmagasság-változás egy új, újraindító (legato) hanggá válik. A hangmagasság
  a hang fő hullámformájának leggyakoribb félhangja; az NTSC dallamok a PAL
  hangtáblázatra vannak áthangolva.
- **Sorok:** sor pontosan a hangjegyeknél kezdődik. Az alaphossz a leghosszabb,
  amely szinte mindegyikhez illik; az ilyen hosszúságú vagy egy képkockával
  hosszabb sorok (funktempo, swing, tempóváltások) egy sorral előrébb `F`
  effektekkel vannak beállítva.
- **Hangszerek:** AD / SR, a fő hullámforma, impulzusszélesség és PWM, a szűrő
  (útválasztás, módus, rezonancia, vágási sweep) és a hang minden egyes
  keretének hullámformája és hangmagassága, egészen a következőig: a hullámforma
  / arpeggio táblázat (egy előtag plusz egy ismétlődő loop, akár 32 lépés). A
  fix hangmagasságú dob attack abszolút hangjegyeket és egy arpeggio relatív
  hangjegyeket tart meg, ugyanazon hang összes hangja felett eldöntve; egy
  szabályos félhang alatti wobble lesz a hangszer vibrato-ja. A kapu
  hangjegyvágássá, kapu időzítővé (kemény újraindítással, amikor az ADSR
  nullázódik) vagy egy lecsengéssé válik a kioldási ütemben. Az azonos
  hangszerek megosztásra kerülnek, akár 128-ig.
- Egy üzenet felsorolja a közelítő értékeket, például a félhangú lépésekké váló
  diákat vagy a 32 lépésnél hosszabb táblázatokat. A több SID-vel rendelkező
  dallamok és a BASIC programként induló RSID dallamok nem támogatottak.

**Lejátszó ZP használata:** `$02`–`$1C` (mintamutatók, minta eltolás,
hőmérséklet) és `$2F` (aktuális sebesség), plusz `$FB`–`$FD` (tick számláló,
sorindex, sorrendlista pozíció). A hang, a moduláció és a szűrőállapot a
`sid_state` helyen található a játékoskód után. A ZP bájtok ütköznek, ha a fő
kódod használja őket – szükség esetén áthelyezheted őket Szakértő módban.

**Ismert korlátok:**
- A lejátszó és az állapota az `$C000` karikánál található. Amikor a
  dallamadatok nem férnek el a mellettük lévő `$D000` karika alatt, az adatok a
  saját szegmensükbe kerülnek, amelyek az `$A000` karika alatt végződnek (az
  exportált asm-nek van egy második `* =` sora); ezt tartsd távol a saját
  programodtól.
- A C64 `$D418` globális hangerő több hangszerhang között megoszlik – a
  hangszerenkénti hangerőcsúszka tájékoztató jellegű; a kitartási szint (az ADSR
  `S` értéke) a hangszerhangonkénti effektív hangerő.
- Míg a **Play: All** a valódi dallamot tölti be (szüneteltetett állapotban is),
  a hangjegy-előnézetek a kis szintetizátorra vonatkoznak, amely csak
  megközelíti a SID chipet. Az előnézetek a WebSid-re körülbelül 0,1
  másodperccel a hang előtt érnek el.

---

Az **Export .sid (PSID)…** (Fájlok menü) opcióval a lejátszható `$C000`
lejátszóval mentheti el a dallamot szabványos PSID fájlként – ez lejátszható az
SID lejátszóban, a VICE `vsid` lejátszójában és bármely más SID lejátszóban.

### SID-lejátszó

Az **SID Player** eszköztárgomb egy lebegő ablakot nyit meg, amely `.sid`
zenefájlokat (PSID és RSID) játszik le, például a HVSC gyűjteményéből származó
dalokat.

- **Lejátszási lista:** dallamok hozzáadása az **.sid fájlokkal…**, vagy az
  ablakra húzással, majd egy dallamra kattintással lejátszáshoz; **Eltávolítás**
  és **Lejátszási lista törlése** a lista rendezése. **Lejátszási lista
  mentése…** / **Lejátszási lista megnyitása…** egy `.sidpl` fájl írása és
  olvasása a beágyazott dallamokkal. A lista, az aktuális dallam és az, hogy az
  ablak nyitva van-e, megjegyződik.
- **Szállítás:** Lejátszás, Szünet, Leállítás, **Előző** / **Következő** dallam,
  **Előző / Következő aldallam** több dalt tartalmazó fájlokhoz, valamint
  időszámláló.
- **Keresés:** A pozíciójelző és az **Vissza/Előre 10 másodpercig** működik a VA
  SID Core motorral. A WebSID nem tud keresni, így ezek a vezérlők le vannak
  tiltva nála.
- **Hangerő:** a gomb meg van osztva a SID Editor fő hangerőszabályzójával.
- **Puffer:** **Beállítások → Általános → SID előnézet → SID lejátszó puffer**
  (2048, 4096, 8192 vagy 16384 minta). A nagyobb puffer megállítja a sercegést,
  miközben az alkalmazás működik. A WebSID az új méretet használja újraindítás
  után; a VA SID Core 10 / 15 / 20 / 30 másodperccel a következő dallamtól
  kezdve renderel.
- **Engine:** az ablak mutatja, hogy melyik motor játszik le (WebSID, vagy VA
  SID Core a verziójával és SID chipjével); válaszd ki a **Beállítások →
  Általános → SID előnézet** menüpontban. A VA SID Core egy natív Rust C64 magon
  futtatja a dallamot, cikluspontos 6510-es processzorral, precíz megszakítási
  időzítéssel, CIA 6526A-val, VIC-II időzítéssel rossz vonalakkal, sprite DMA és
  raszteres megszakításokkal, valamint a 6510 I/O porttal – így a raszteres IRQ,
  CIA időzített és digitális dallamok egy valódi gép időzítésével játszanak.
- **Véletlenszerű lejátszás:** A **Következő** melletti véletlenszerű lejátszás
  gomb véletlenszerű sorrendben játssza le a lejátszási listát – egyetlen dallam
  sem ismétlődik, amíg az összes dallam le nem hangzott, az **Előző** pedig
  visszalép a véletlenszerű sorrendben. A beállítás megjegyzendő.
- **Kedvencek:** az egyes sorban található ☆ / ★ egy dallamot jelöl; ez a
  mentett állapotban és a `.sidpl` lejátszási listákban is megtalálható.

#### HVSC (Nagyfeszültségű SID-gyűjtés)

Az SID Player eszköztárán található **HVSC** gomb megnyit egy keresőpanelt a
[High Voltage SID Collection](https://www.hvsc.c64.org/) gyűjteményhez, amely
körülbelül 61 000 C64 dallamot tartalmaz.

- **Keresés:** írj be egy címet, zeneszerzőt vagy mappát (`hubbard commando`,
  `games/s-z`); minden szónak egyeznie kell. A **Véletlenszerű dallamok** 25
  véletlenszerű dallamot sorol fel.
- **Lejátszás / hozzáadás / mentés:** kattintson egy dallamra a lejátszáshoz, az
  **+** gomb hozzáadja a lejátszási listához, a letöltés gomb elmenti az `.sid`
  fájlt. Az **Összes találat hozzáadása** legfeljebb 100 találatot ad össze.
- **Dallamhosszak:** A HVSC ismeri minden aldallam hosszát, így a keresősáv
  mutatja azt, és a lejátszási lista továbblép, amikor az aldallam véget ér.
- **A dallamok forrása:** A katalógus és az egyes dallamok az első használatkor
  egy HVSC tükörről töltődnek le, és az alkalmazás gyorsítótárában tárolódnak,
  így az egyszer lejátszott dallam offline is lejátszható. **A katalógus
  frissítése** lekéri a legújabb listát.
- **Teljes gyűjtemény:** **A teljes gyűjtemény letöltése…** letölti a hivatalos
  HVSC archívumot (kb. 85 MB) egy kiválasztott mappába, majd ott kicsomagolja
  (kb. 380 MB); ettől kezdve a lejátszó ezt a másolatot használja, és offline
  működik. **Helyi HVSC mappa használata…** egy már meglévő gyűjteményre mutat.

#### Spektrumanalizátor

A SID Player eszköztárán található sávgomb megnyitja a **Spectrum** ablakot:
LED-stílusú sávok zöldtől sárgán át narancssárgáig, lassan elhalványuló cellák
és tükrözött padló perspektívában. Megjeleníti azt, amit a SID Player vagy a SID
Editor lejátszik, bármelyik motorral. A **Bands** 8, 16, 24 vagy 32 sávot állít
be. Az ablak mozgatható és átméretezhető, a SID Playerrel együtt záródik és
nyílik meg újra, és csak akkor rajzol, amikor meg van nyitva.

---

### Görbeszerkesztő

Használatra kész `.byte` keresőtáblákat generál matematikai görbékből – szinusz,
könnyítés, háromszög/fűrészfog/négyzet és pattogás. Ideális sprite mozgatáshoz,
raszter effektekhez, színváltáshoz vagy bármilyen előre kiszámított táblázat
által vezérelt animációhoz. Nyissa meg a felső eszköztáron (a SID Editor gomb
mellett) található **Görbeszerkesztő** ikonnal.

**Görbék:** Szinusz, koszinusz, lineáris, Könnyű be/ki/be/ki (négyszög és
harmadfokú), Könnyű be/ki (kör), Háromszög, Fűrészfog, Négyzet és Könnyű
be/ki/be/ki pattogás.

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

Minden másolási/beszúrási kimenet egy fejlécommenttel kezdődik, amely
dokumentálja a görbét, a tényleges min/max tartományt, a bejegyzések számát és a
pontos felhasználást (amelyek regisztrálják az egyes táblázatok bemeneteit).

**Előnézet:**
- **Grafikon** — a görbe, amelynek értéke 0 a **felül** és a maximum az
  **alul**, a C64 sprite-Y / raszter konvenciónak megfelelően (tehát amit látsz,
  az a hardveren futó táblázat). A grafikon alatti meta vonal mutatja a
  bájtszámot, a generált értékek tényleges minimum/max értékét és a görbe(k)
  nevét.
- **Pattogó labda** — egy markert animál a táblázatban a **Tempo** tempóban
  (5–240 érték/másodperc). 50-es tempónál ez PAL-on (50 Hz) egy értéket jelent
  képkockánként, azaz indexenként egy `.wait_raster` lépést. Lejátszás/Szünet és
  Újraindítás gombok, az utolsó ~24 pozíció elhalványuló sávja, valamint élő
  `Index · Érték` kijelzés.

**Másolás / Beszúrás:** az eszköztár két ikonja — **Másolás** a vágólapra
helyezi a táblázatot; **Beszúrás a szerkesztőbe** blokkként hozzáfűzi a
táblázatot (és az olvasót, ha engedélyezve van) az aktuális programhoz. Az
újbóli beszúrás ** lecseréli** az előző Görbeszerkesztő beszúrást a duplikátumok
egymásra halmozása helyett (Blokk és Szakértő módban működik).

**Fájlok menü:**
| Akció                              | Mit csinál                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Görbe mentése (.bin)…**          | A nyers tábla bájtjait pontosan úgy menti el, ahogyan a C64 beolvasná azokat az `INCBIN` paraméterrel. 16 bites: N lo bájt, majd N hi bájt.                                                                                                                                                                                                                                                                                                      |
| **Terhelési görbe (.bin)…**        | Betölti a nyers tábla bájtjait a szerkesztőbe, az aktuális bitmélységnek megfelelően értelmezve (16 bit: első fele lo, második fele hi). A betöltött tábla jelenlegi állapotában jelenik meg, amíg valamelyik görbevezérlő új görbét nem generál.                                                                                                                                                                                                |
| **Demó exportálása blokkokba**     | Hozzáfűz egy teljes, futtatható sprite demót: sprite init, raszterrel szinkronizált fő ciklus, a beágyazott táblázat és golyós sprite adatok. Az X 0..320-at söpör be a 8.8-as fixpontban az `$D010` MSB-vel, miközben a táblázat az Y sprite-ot hajtja – pontosan megegyezik a szerkesztő előnézetével. Az újraexportálás lecseréli a korábbi görbeszerkesztő beszúrást.                                                                        |
| **Exportálás UltimateBasic-be**    | A táblázatot inicializált Ultimate Basic tömbként írja ki — `var name = array(N)` (vagy `array_word(N)` 16 bites esetén), majd `data name: …` sor — és beszúrja az UB szerkesztő kurzorához (UB módon kívül a vágólapra másolja). A címke egy érvényes, kisbetűs UB névvé válik; a táblázat indexelése `name[i]` néven történik. Ultimate Basic 1.5.8+ verzió szükséges (csomagban).                                                             |
| **UltimateBasic demó exportálása** | Egy teljes, futtatásra kész UB programot hoz létre: egy golyós sprite-ot (`sprdef 0`), a táblázatot és egy raszterrel szinkronizált ciklust, amely képkockánként egy táblázatbejegyzést játszik le. A 8 bites táblázatok a **Y** sprite-ot hajtják végre, míg az X 0..320-at söpri; a 16 bites (0..320) táblázatok a **X** sprite-ot hajtják végre, míg az Y 0..200-at söpri. A 256 bejegyzésnél hosszabb táblázatok az első 256-ot játsszák le. |

**A C64 előnézetének megfelelően:** az előnézet lineárisan olvassa a táblázatot
**, 0 → N-1 → 0 ciklusokban, képkockánként egy értékkel**. A pontos
reprodukáláshoz ugyanúgy kell futtatni a táblázatot (az indexet képkockánként
egyszer növelni, a táblázat hosszánál sortöréssel). Egy pingpong vagy részleges
tartományú lejátszás másképp fog mozogni, még akkor is, ha a bájtértékek
azonosak. Lásd a `samples/curve-new-demo.asm` fájlt egy működő 16 bites sprite-X
példáért.

---

### Táblázatgenerátor

Az **Táblázatgenerátor** eszköztárgomb (rács ikon, a görbeszerkesztő mellett)
keresőtáblákat és gyorskódokat hozhat létre. Válasszon ki egy táblázattípust,
állítsa be a paramétereit, és tekintse meg az előnézetet; a meta sor a
bejegyzések számát, méretét és értéktartományát mutatja (kód esetén: bájtok és
becsült ciklusok / rasztervonalak).

| Típus                                                  | Értékek                                                                                                                               |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| Képernyő sorok címei                                   | alap + 40 · sor (bármilyen alap és sorhossz)                                                                                          |
| Bitmap sorcímek                                        | Y pixel → bájtcím a 0. oszlopban (8 × 8 cellaelrendezés)                                                                              |
| Bitkép oszlop eltolások                                | pixel X → bájt eltolás a soron belül (bővített vagy többszínű)                                                                        |
| Pixel bitmaszk                                         | X → bitmaszk (bérelhető / többszínű, opcionálisan invertált `ÉS` esetén)                                                              |
| Szorozzon / ossza / maradékot adjon meg egy állandóval | x · k, ⌊x / k⌋, x mod k                                                                                                               |
| Negyed négyzetek                                       | ⌊(x − eltolás)² / 4⌋, 512 bejegyzés — a · b = sqr(a + b) − sqr(a − b)                                                                 |
| Kölcsönös                                              | ⌊N / x⌋                                                                                                                               |
| Logaritmus / exponenciális                             | kerek(log2 x s), kerek(2^(x / s))                                                                                                     |
| Bit fordított                                          | egy bájtot (vagy bitpárokat többszínűben) tükröz sprite-ok és karakterekké                                                            |
| Egyéni kifejezés                                       | `i` bármely képlete (`k` = 0-alapú index, `n` = darabszám); `sin`, `cos`, `abs`, `min`, `max`, `round`, `floor`, `PI`, `$hex`, `%bin` |
| Sebességkód: memória kitöltése / másolása              | egy alprogram; * iterációnként tárol * 0 = teljesen kigörgetve, N = egy X ciklus N tárolással menetenként                             |

A 255 feletti értékek egy **lo / hi táblapárt** (`label_lo`, `label_hi`) vagy
egy `.word` táblát eredményeznek; a negatív értékek kettes komplemensűek.
Opciók: címke, hex / decimális, értékek soronként, **Align to page** (`.align
256`, elkerüli az oldal-keresztezési ciklust). A **Copy** a vágólapra helyezi az
összeállítást; az **Insert** hozzáadja a programhoz (ugyanazon címke újbóli
beszúrása felülírja az előző másolatot) — Ultimate Basic módban egy `array`
tömböt szúr be `data` sorokkal. A Fájlok menü a táblázatot `.bin` néven menti
(alacsony, majd magas bájtok), és exportálja az Ultimate Basicbe.

### Számátalakító

Egy kis **nem modális** DEC / HEX / BIN konverter, amely a SID lejátszó melletti
eszköztár gombbal nyitható meg (kattintson ismét, vagy nyomja meg az Esc
billentyűt a bezáráshoz). A gomb kiemelve marad, amíg a konverter látható. A
program szerkesztése közben bármilyen módban nyitva marad.

- Írj be egy értéket az **DEC**, **HEX** vagy **BIN** mezők bármelyikébe, majd a
  másik kettő következik. Az `$`, `0x`, `%`, `0b` előtagok és elválasztók
  (szóköz, `_`) elfogadottak; a negatív tizedesjegy kettes komplemens lesz az
  aktuális szélességben; az érvénytelen bemenet pirossal van jelölve.
- **8 / 16 bit** szélesség — 255 feletti érték esetén a rendszer automatikusan
  16 bitre vált.
- **Bitek sor** — kattintson egy bitre a ki-/bekapcsoláshoz.
- Az információs sor az **előjeles** értéket, 16 bites módban pedig az
  **alacsony** és **magas** bájtot mutatja.
- Az **Másolás** gombok az előtagjával együtt másolják az értéket (`53280`,
  `$D020`, `%1101000000100000`).
- Húzd a fejlécénél fogva; megjegyzi az értékét, szélességét és pozícióját, és
  újraindítás után újra megnyílik, ha kilépéskor nyitva volt.

---


*© 2026 Tarczali Zsolt — C64 Visual Assembler*
