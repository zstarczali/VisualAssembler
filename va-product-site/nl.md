# C64 Visual Assembler — Gebruikershandleiding

**Versie 2.4.0**

Een visuele, blokgebaseerde 6502-assembler voor de Commodore 64. Bouw programma's door instructieblokken te slepen en neer te zetten, en bekijk de gegenereerde assembly- en machinecode in realtime.

---

## Inhoudsopgave

- [C64 Visual Assembler — Gebruikershandleiding](#c64-visual-assembler--user-manual)
    - [Hoogtepunten van versie 2.4.0](#version-240-highlights)
    - [Hoogtepunten van versie 2.3.9](#version-239-highlights)
    - [Hoogtepunten van versie 2.3.8](#version-238-highlights)
  - [Inhoudsopgave](#table-of-contents)
  - [1. Interfaceoverzicht](#1-interface-overview)
  - [2. Blokpalet](#2-block-palette)
  - [3. Programmagebied](#3-program-area)
    - [Operandinvoer](#operand-input)
  - [4. ASM-weergave](#4-asm-view)
    - [Uitvoermodi](#output-modes)
    - [Toolkit-tabblad](#toolkit-tab)
    - [Tabblad Opties](#options-tab)
    - [Klikken op een ASM-regel](#clicking-an-asm-line)
    - [ASM-regelnummers](#asm-line-numbers)
    - [Voortgangsweergave compilatie](#compile-progress-modal)
  - [5. Instellingen & Werkbalk](#5-settings--toolbar)
    - [Laad .asm-bestand (snelle referentie)](#load-asm-file-quick-reference)
      - [Import parsing notes and best practices](#import-parsing-notes-and-best-practices)
  - [Ultieme Basismodus](#ultimatebasic-mode)
    - [UB-editor openen](#opening-the-ub-editor)
    - [Editortools](#editor-tools)
    - [Projecten, tabbladen en opstartbestanden](#projects-tabs-and-startup-files)
    - [Bouw en diagnostiek](#building-and-diagnostics)
    - [Running, D64, and Exomizer](#running-d64-and-exomizer)
    - [Debuggersymbolen en demontage](#debugger-symbols-and-disassembly)
    - [Ultieme basishandleiding en broncode](#ultimate-basic-manual-and-source)
  - [6. Expertmodus](#6-expert-mode)
    - [Modi wisselen](#switching-modes)
    - [Editorindeling](#editor-layout)
    - [Werkbalkknoppen](#toolbar-buttons)
    - [Fout bij het markeren](#error-highlighting)
    - [Syntaxmarkering](#syntax-highlight)
    - [Bronformatter](#source-formatter)
    - [Projectpaneel & tabbladen](#project-panel--tabs)
    - [Tabbalk](#tab-bar)
  - [7. Adresseringsmodi](#7-addressing-modes)
    - [Label expressies als operanden](#label-expressions-as-operands)
    - [De `*` programmateller in expressies](#the--program-counter-in-expressions)
    - [Lokale (gestippelde) labels](#local-dotted-labels)
    - [Operandlabels voor zelfmodificerende code](#self-modifying-code-operand-labels)
  - [8. Standaard 6502-instructies](#8-standard-6502-instructions)
    - [Gegevensverplaatsing](#data-movement)
    - [Rekenen](#arithmetic)
    - [Logica](#logic)
    - [Sprongen & Vertakkingen](#jumps--branches)
    - [LBNE / LBEQ / … (Lange takken)](#lbne--lbeq---long-branches)
    - [Registerbewerkingen](#register-operations)
    - [Shift \&amp; Rotate](#shift--rotate)
    - [Stack](#stack)
    - [Systeem / Vlaggen](#system--flags)
    - [Onwettige / niet-gedocumenteerde instructies](#illegal--undocumented-instructions)
  - [9. Macroblokken — Referentie](#9-macro-blocks--reference)
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
    - [SPRITE_INIT](#sprite_init)
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
  - [10. Debuggerintegratie](#10-debugger-integration)
    - [RetroDebugger](#retrodebugger)
    - [Breakpoint Blocks](#breakpoint-blocks)
    - [Flags voor de debugger (tabblad Opties)](#debugger-flags-options-tab)
  - [11. Links naar de kennisbank](#11-knowledge-base-links)
  - [12. D64 Exporteren & Uitvoeren](#12-d64-export--run)
    - [Knop Split Run](#split-run-button)
    - [Exporteren naar D64-dialoogvenster](#export-to-d64-dialog)
    - [D64-metadata in projecten](#d64-metadata-in-projects)
  - [12b. CRT-export (Magic Desk 64K-cartridge)](#12b-crt-export-magic-desk-64k-cartridge)
  - [13. Hardware-instellingen](#13-hardware-settings)
    - [VICE Emulator](#vice-emulator)
    - [Exomizer](#exomizer)
    - [Retro Debugger](#retro-debugger)
    - [C64 Ultimate / 1541 Ultimate](#c64-ultimate--1541-ultimate)
  - [14. Visuele editors (toolkit)](#14-visual-editors-toolkit)
    - [Editor voor hoge resolutie / meerkleurig](#hi-res--multicolor-editor)
    - [Sprite-editor](#sprite-editor)
    - [C64 Character ROM Browser ("Char map")](#c64-character-rom-browser-char-map)
    - [Tekeneditor (Tekenset)](#character-editor-charset)
    - [Tekenset Canvas Editor](#charset-canvas-editor)
    - [Kaarteditor (Meerlaagse tegelkaarten)](#map-editor-multilayer-tilemaps)
    - [SID Editor (3-Voice Tracker)](#sid-editor-3-voice-tracker)
    - [Curve-editor](#curve-editor)

---

## Hoogtepunten van versie 2.4.0

- **D64 Editor** — een volledige schijfimagebrowser op de werkbalk (na de Curve Editor). Open een bestaande `.d64`, maak een nieuwe lege aan of start de huidige schijf rechtstreeks in VICE, allemaal vanuit een menu Bestand ▾ dat overeenkomt met de andere visuele editors. Zie [D64 Editor (een bestaande schijfimage bekijken en bewerken)](#d64-editor-browse--edit-an-existing-disk-image).
- **Toevoegen / extraheren / hernoemen / verwijderen in de D64 Editor** — voeg een lokaal bestand toe aan de schijfdirectory, extraheer een geselecteerde vermelding terug naar een `.prg`, hernoem een vermelding direct in de tabel of verwijder deze — elke actie wordt rechtstreeks toegepast op het `.d64`-bestand via `c1541`, zonder aparte opslagstap.
- **Laadadres, decompressieadres en Exomizer in de D64 Editor** — door een onbewerkt bestand zonder header toe te voegen, kunt u een optioneel laadadres en een Exomizer-decompressiedoel instellen en het bestand tijdens het laden comprimeren met dezelfde `mem`/`sfx` crunch-modi als de extra bestanden in het dialoogvenster Exporteren naar D64. Een `.prg` dat al een eigen header heeft, slaat deze velden volledig over.
- **Selector voor schijfinvoertype** — kies PRG / SEQ / USR / REL voor een nieuw toegevoegd bestand in plaats van het altijd als PRG te schrijven.
- **Authentieke directorylijst** — de bestandslijst van de D64 Editor wordt weergegeven in het meegeleverde C64 Pro-lettertype, in hoofdletters, voor de klassieke `LOAD"$",8` look.
- **Opgelost:** Het hernoemen van een item in de D64 Editor zorgt er niet langer voor dat de bewerking ongedaan wordt gemaakt wanneer je in het tekstveld klikt.
- **Verbeterd:** De modusindicatorbadge in de werkbalk van het lichte thema (BLOKMODUS / EXPERTMODUS / …) is donkerder en beter leesbaar, en de glinsterende animatie is weer zichtbaar.

---

## Hoogtepunten van versie 2.3.9

Vijf handige functies voor assembler, die allemaal bruikbaar zijn in de Expert-modus (tekst) en (waar zinvol) als blokken. Elke functie heeft een eigen referentiesectie verderop:

- **`*` in elke expressie** — het programmatellersymbool werkt nu binnen operandexpressies, niet alleen op zichzelf: `BNE *-5`, `JMP *+20`, `LDA #&lt;*`, `LDA #&gt;(*+63)`. Een `*` die volgt op een waarde (`STRIDE*2`) is nog steeds vermenigvuldiging. Zie [Addressing Modes → De `*` programmateller in expressies](#the--program-counter-in-expressions).
- **Lokale (gestippelde) labels** — een label zoals `.loop` behoort tot het bereik van het dichtstbijzijnde voorafgaande *globale* (niet-gestippelde) label, zodat `DrawSprite` en `ClearScreen` elk hun eigen `.loop` kunnen definiëren zonder conflict. Zie [Lokale (gestippelde) labels](#local-dotted-labels).
- **Pseudo-operaties met lange vertakkingen** — `LBNE`, `LBEQ`, `LBCC`, `LBCS`, `LBMI`, `LBPL`, `LBVC`, `LBVS` assembleren naar een omgekeerde vertakking over een `JMP` (altijd 5 bytes), zodat het doel zich op elke willekeurige afstand kan bevinden. Nieuwe paletcategorie **Lange vertakkingen**. Zie [LBNE / LBEQ / … (Lange vertakkingen)](#lbne--lbeq---long-branches).
- **`.assert` directive** — `.assert end - start &lt;= 256` or `.assert * &lt; $A000, "message"` wordt geëvalueerd tijdens het assembleren en de build mislukt (waarbij de werkelijke waarde wordt weergegeven) wanneer de expressie onwaar is. Zie [.ASSERT](#assert).
- **Operandlabels voor zelfmodificerende code** — `LDA-waarde:#$00` definieert het label `waarde` dat naar de operandbyte van de instructie wijst, zodat `STA-waarde` deze direct patcht. Zie [Operandlabels voor zelfmodificerende code](#self-modifying-code-operand-labels).
- **Vriendelijkere foutmeldingen bij vertakkingen buiten het bereik** — een vertakking die buiten −128…+127 terechtkomt, meldt nu precies hoeveel deze wordt overschreden en suggereert de overeenkomende `LBxx` lange vertakking.

---

## Hoogtepunten van versie 2.3.8

- **Werkruimte opslaan/openen:** sla de exacte set geopende, door bestanden ondersteunde tabbladen op — inclusief het actieve tabblad en de editormodus van elk tabblad — in een `.vaws` werkruimtebestand. Werkruimtes worden automatisch opgeslagen bij wijzigingen en de app herstelt automatisch uw laatst gebruikte werkruimte bij het opstarten.
- **Waak het geheugenpaneel weergeven of verbergen: ** Toon of verberg het volledige C64-geheugenpaneel via een speciale UI-schakelaar.
- **Gelokaliseerde Ultimate Basic-opdrachtreferentie: ** De opdrachtbeschrijvingen in het pop-upvenster voor automatisch aanvullen en het paneel Opdrachten volgen nu de huidige UI-taal (Hongaars, Engels, Spaans, Duits, Nederlands), met Engels als terugvaloptie.
- **Vernieuwde Ultimate Basic-grafische documentatie: ** `KLEURENPEN` en de helptekst voor de opdrachten plot/lijn/rechthoek/cirkel en meerkleurig tekenen komen nu overeen met het huidige compilergedrag.
- **KERNAL-referentie gecorrigeerd: ** De `SETLFS` en `PLOT` vermeldingen (adressen en aanroepconventies) in de KERNAL-adrestabel van de disassembler zijn gecorrigeerd.
- **Geheugengebruik met veel geopende tabbladen opgelost: ** De undo/redo-geschiedenis per tabblad is nu beperkt (met een kleine debounce), waardoor de onbeperkte geheugengroei die een lange sessie met veel geopende documenten voorheen veroorzaakte, wordt voorkomen.
- **Opruiming van de editorwerkbalk: ** De overbodige knoppen voor het in- en uitschakelen van breekpunten zijn verwijderd uit de Expert- en Ultimate Basic-werkbalken (breekpunten worden nog steeds ingesteld vanuit de regelnummermarge) en de hoogte van de Expert-werkbalk is gelijkgetrokken met die van de Ultimate Basic-werkbalk.

---

## 1. Interfaceoverzicht

De app is opgedeeld in drie hoofdpanelen:

| Paneel                  | Beschrijving                                                                |
| ----------------------- | --------------------------------------------------------------------------- |
| **Links — Palet**       | Alle beschikbare instructie- en macroblokken. Zoek of blader per categorie. |
| **Centrum — Programma** | Jouw programma. Sleep blokken hierheen, herschik ze en bewerk de operanden. |
| **Rechts — Uitvoer**    | Live ASM-weergave en/of geheugenmonitoruitvoer.                             |

De modusbadge helemaal rechts in de header geeft de actieve editor aan: **Block**, **Expert** of **Ultimate Basic**. Deze badge wordt direct bijgewerkt wanneer de bewerkingsmodus verandert.

---

## 2. Blokpalet

Het palet aan de linkerkant toont alle beschikbare blokken, gegroepeerd per categorie:

- **Gegevensverplaatsing** — LDA, LDX, STA, STX, …
- ** Rekenkundig ** — ADC, SBC, INC, DEC, CMP, …
- **Logica** — EN, ORA, EOR, BIT
- ** Sprongen en vertakkingen ** — JMP, JSR, RTS, BNE, BEQ, …
- **Lange aftakkingen** — LBNE, LBEQ, LBCC, LBCS, LBMI, LBPL, LBVC, LBVS (aftakking naar elke afstand; zie §8)
- **Registerbewerkingen** — TAX, TAY, INX, DEX, …
- **Verschuiven en roteren** — ASL, LSR, ROL, ROR
- **Stack** — PHA, PHP, PLA, PLP
- **Systeem** — CLC, SEC, NOP, BRK, …
- **Onwettige instructies** — LAX, SAX, DCP, …
- **Structure** — LABEL, COMMENT, REGION, ENDREGION
- **Macro's** — LOOP, NEXT, FOR, ENDF, PUSH, PULL, END, TEXT, BYTE, WORD, FILL, ALIGN, ASSERT, STRING, DATA, RAWBYTES, RAWTEXT, PETSCII, CHARSET, INCBIN, SID, INCLUDE, TABLE, ORG, MACRO, ENDM, INVOKE, IF, ELSE, ENDIF, VAR, WHILE, ENDW, REPEAT, UNTIL, MEMCPY, MEMSET, PRINT, PRINT_CHAR, PRINT_HEX, CLEAR_SCREEN, WAIT_KEY, DELAY, SET_BORDER, SET_BG, IRQ_SETUP, RAND, SPRITE_INIT, SPRITE_POS, WAIT_RASTER, JOYSTICK, MOUSE, SPRITE_COL, LOADFILE, REU_CHECK, REU_STASH, REU_FETCH, REU_SWAP, TURBO_SET, SUPERCPU_DETECT, TURBO_ENABLE, MAP_COPY, MAP_COPY16X16, SPRITE_ANIM, SCORE_BCD

Gebruik het zoekvak **** bovenaan het palet om te filteren op naam. Klik op de knop **Geselecteerd blok toevoegen** of sleep een blok naar het programmagebied.

---

## 3. Programmagebied

- **Sleep ** blokken vanuit het palet, of **herschik ** bestaande blokken door hun handvat (≡) te slepen.
- Elk blok toont zijn **mnemonic**, **operandveld** en **adresmodusselector** (indien van toepassing).
- Klik op de **▸ / ▾** schakelaar om een blok in te klappen of uit te vouwen.
- Gebruik de **× (verwijderen)** knop op een blok om het te verwijderen.
- **Alles inklappen** De knop vouwt alle blokken in één keer in.

### Blokpaneel minimap

Het Programma-paneel heeft een in- en uitschakelbare **minimap**-knop in de koptekst. Wanneer deze is ingeschakeld, verschijnt er een smalle `56 px` canvasstrook aan de rechterkant van het paneel, waarop alle blokken als kleurgecodeerde horizontale balken worden weergegeven:

| Kleur van de balk | Bloktype                      |
| ----------------- | ----------------------------- |
| Cyaan             | Labels                        |
| Blauw/paars       | Macro's en richtlijnen        |
| Geel              | Instructies                   |
| Groente           | Opmerkingen en lege regels    |
| Rood              | Blokken met een validatiefout |

Ingeklapte blokken worden weergegeven met een lagere transparantie. Klik of sleep ergens op de minimap om de programmalijst naar die positie te scrollen. De viewport-indicator (een rechthoek in de accentkleur) geeft het zichtbare gedeelte van de lijst aan. De status wordt opgeslagen in de UI-instellingen (`blockMinimap`-toets).

### Operandinvoer

- Voor branch/jump-instructies (`BNE`, `JMP`, `JSR`, enz.) verschijnt een **label picker** dropdownmenu — klik op een gedefinieerd label om het in te voegen.
- De getalnotatie volgt de **HEX / DEC** schakelaar in de werkbalk (zie sectie 5).

---

## 4. ASM-weergave

Het rechterpaneel toont de gegenereerde uitvoer in realtime.

### Uitvoermodi

| Modus            | Beschrijving                                                                                                                                                                                                                                                                                                                                 |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ASM**          | 6502 assemblagebron met adressen en labels                                                                                                                                                                                                                                                                                                   |
| **Monitor**      | Hex-/bytedump (C64-monitorstijl)                                                                                                                                                                                                                                                                                                             |
| **Disasm**       | Pure 6502-disassemblage: adres · hexadecimale bytes · mnemonics met opgeloste numerieke operanden. Macro's worden uitgebreid tot individuele instructies (TEXT → LDA/STA-paren, LOOP → LDX, enz.). BYTE/WORD/FILL-gegevens worden weergegeven als een gechunkte hexadecimale dump. Geen macronamen, commentaren of annotaties in de uitvoer. |
| **Beide**        | ASM bovenaan, monitor onderaan                                                                                                                                                                                                                                                                                                               |
| **Disassembler** | Hetzelfde als Disasm — een apart tabblad voor de demontageweergave.                                                                                                                                                                                                                                                                          |
| **Toolkit**      | C64-referentiepaneel: kleurenpalet met 16 kleuren + PETSCII-besturingscode en spiekbriefje met afdrukbare tekens. Alleen-lezen — zie het subgedeelte "Toolkit" hieronder voor meer informatie.                                                                                                                                               |
| **Opties**       | Instellingenpaneel van het programma — getalnotatie, macrobron in-/uitschakelen, foutopsporingsparameters                                                                                                                                                                                                                                    |

### Toolkit-tabblad

Het tabblad **Toolkit** in de ASM-weergave is een alleen-lezen snelreferentiepaneel — het wijzigt uw programma nooit. Twee secties:

| Sectie                    | Inhoud                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **C64 kleurenpalet**      | Een raster van 16 kleurstalen met alle C64-kleuren, inclusief index (0–15 / `$00`–`$0F`) en naam. Klik op een kleurstaal om de hexadecimale index naar het klembord te kopiëren. Beweeg de muis over de kleur om de naam te zien (Lichtblauw, Bruin, enz.).                                                                                                                                                                                        |
| **PETSCII control codes** | Algemene besturingscodes voor `CHROUT` ($FFD2): codes voor kleurverandering (`$05` wit, `$1C` rood, `$1E` groen, `$1F` blauw, …), cursorbeweging (`$11`/`$1D`/`$91`/`$9D`), omgekeerd aan/uit (`$12`/`$92`), `$93` scherm wissen, `$8E`/`$0E` charset switches. Ook een afdrukbaar spiekbriefje met bereiken (32-64 leestekens, 65-90 A-Z, 91-95 haakjes, 96-127 grafische elementen, 160-191 verschoven grafische elementen, 192-223 spiegeling). |

De Toolkit is de snelste manier om een kleurindex of een PETSCII-besturingsbyte op te zoeken zonder de editor te verlaten.

### Tabblad Opties

Het tabblad **Opties** bevat de instellingen die van invloed zijn op de codegeneratie en de weergave van de uitvoer:

- **Macrobron** — wanneer AAN, tonen macrodefinitieblokken (MACRO…ENDM) hun broncode inline in de ASM-weergave.
- **Programmastartadres** — nu ingesteld via een **ORG-blok** in het programmagebied in plaats van een apart invoerveld. Het eerste ORG-blok definieert het laadadres van het programma; volgende ORG-blokken starten extra secties op verschillende adressen.
- **Debugger-parameters** — drie inline-schakelaars die bepalen welke vlaggen bij het opstarten aan de externe debugger worden doorgegeven:
  - **`-jmp` AAN/UIT** — spring direct naar het startadres van het programma na het laden.
  - **`-unpause` AAN/UIT** — de debugger direct hervatten bij het laden.
  - **`-wacht` ms AAN/UIT** — voegt een `-wacht <ms>` vertraging toe voordat de pauze wordt opgeheven; selecteer 500 ms of 1000 ms in het dropdownmenu.
- **Compileerinfo** — toont een samenvatting van het gecompileerde programma (startadres van de code, grootte, status van de BASIC SYS-stub).

### Een ASM-lijn aanklikken

Klik op een willekeurige regel in de ASM-weergave om het bijbehorende blok in het programmagebied te markeren. **

### ASM-lijnnummers

Het ASM-paneel geeft **regelnummers** weer (`001 |`, `002 |`, …) om het oplossen van problemen te vergemakkelijken wanneer een compilatiefout naar een specifieke regel verwijst.

- De visuele lijnnummers dienen uitsluitend voor diagnostische doeleinden.
- **Copy ASM** kopieert nog steeds de schone brontekst **zonder** regelnummerprefixes.

### Voortgangsweergave compileren

Tijdens intensievere acties verschijnt een gecentreerd voortgangsvenster met een voortgangsbalk:

- **Uitvoeren in VICE** — PRG compileren/bouwen en emulator starten.
- **Debug** — PRG compileren/bouwen en debugger starten.
- **Laad .asm-bestand** — open een `.asm`-bestand in Expert-modus en materialiseer blokken vanuit de bron.

Het modale venster sluit automatisch wanneer de actie is voltooid of mislukt.

---

## 5. Instellingen en werkbalk

| Controle                               | Beschrijving                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Getallenbasis (HEX / DEC / BIN)**    | Hiermee wordt het weergave-/invoerformaat voor operanden in de gebruikersinterface ingesteld. In de BIN-modus worden waarden binair weergegeven met het voorvoegsel `%` (bijv. `%11111000`). De ASM-weergave toont elk blok altijd in zijn eigen formaat.                                                                                                                                                                                                                                                   |
| **Taal**                               | Schakel tussen de gebruikersinterface in het Engels, Hongaars, Spaans, Duits en Nederlands.                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Thema**                              | Licht / Donker / OLED / Commodore 77 — selecteer dit in de themakiezer in het menu Instellingen. OLED gebruikt een volledig zwarte achtergrond voor AMOLED-schermen. Commodore 77 is een neongeel-op-zwart thema; wanneer dit het actieve thema is, gebruikt het opstartscherm de kleur van het thema (overeenkomend met de berichtkaart), toont het een kleiner, speciaal Commodore 77-logo en een gele voortgangsbalk. Het gekozen thema wordt toegepast vóór de eerste weergave bij de volgende opstart. |
| **CRT retro-modus**                    | Schakelt een CRT-filter voor het volledige scherm in of uit: scanlijnen, fosforvignettering, flikkering en tonvormige vertekening. De instelling wordt tussen sessies bewaard.                                                                                                                                                                                                                                                                                                                              |
| **Geheugenpaneel weergeven**           | Globale schakelaar waarmee het volledige C64-geheugenpaneel kan worden weergegeven of verborgen.                                                                                                                                                                                                                                                                                                                                                                                                            |
| **BASIC SYS stub**                     | Voegt een BASIC-regel die SYS aanroept toe aan het begin van uw programma.                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Voorbeeld**                          | Een ingebouwd voorbeeldprogramma laden                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **In-/uitzoomen**                      | Schaal de gebruikersinterface van het blok (dit heeft invloed op alle elementen van het blok)                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Project opslaan**                    | Sla het huidige programma op als een `.json` projectbestand                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Programma opslaan als**              | Sla het huidige programma elke keer op als een `.json`-projectbestand met behulp van een nieuw bestandsdialoogvenster.                                                                                                                                                                                                                                                                                                                                                                                      |
| **Project laden**                      | Een eerder opgeslagen project laden                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Werkruimte opslaan**                 | Sla de exacte set van momenteel geopende, door bestanden ondersteunde tabbladen op — inclusief het actieve tabblad en de editormodus van elk tabblad (Blok/Expert/Ultieme Basis) — in een `.vaws` werkruimtebestand                                                                                                                                                                                                                                                                                         |
| **Werkruimte opslaan als**             | Sla de huidige werkruimte elke keer op via een nieuw bestandsdialoogvenster.                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Werkruimte openen**                  | Sluit alle geopende tabbladen en heropen de set bestanden die zijn opgeslagen in een `.vaws`-werkruimtebestand.                                                                                                                                                                                                                                                                                                                                                                                             |
| **Werkmap instellen**                  | Kies de standaardmap die wordt gebruikt door bestandsselectoren en dialoogvensters voor opslaan. Het pad wordt opgeslagen in de app-configuratie en in menuvoorbeelden blijft het einde van het pad zichtbaar.                                                                                                                                                                                                                                                                                              |
| **Project openen** (`Menu → Bestand`)  | Open een project met meerdere bestanden `.proj` en open alle bronbestanden als tabbladen.                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Project opslaan** (`Menu → Bestand`) | Sla het huidige `.proj`-project op (het projectvenster moet geopend zijn).                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Project sluiten** (`Menu → Bestand`) | Sluit het momenteel geopende project en alle bijbehorende bestandstabbladen. Er verschijnt een prompt om niet-opgeslagen wijzigingen op te slaan. Het projectpaneel wordt teruggezet naar de lege staat.                                                                                                                                                                                                                                                                                                    |
| **Laad .asm-bestand**                  | Opent een `.asm`-bestand in de expertmodus en importeert tekstuele 6502 ASM in het huidige tabblad.                                                                                                                                                                                                                                                                                                                                                                                                         |
| **PRG opslaan**                        | Exporteer het gecompileerde binaire bestand als een `.prg`-bestand                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **CRT bouwen**                         | Exporteer het programma als een 64K Magic Desk-bestand (`.crt`, cartridgetype 19). Zie [Paragraaf 12b](#12b-crt-export-magic-desk-64k-cartridge).                                                                                                                                                                                                                                                                                                                                                           |
| **Uitvoeren (splitknop)**              | De hoofdknop **▶ Run** start de huidige modus; klik op de pijl **▾** om te schakelen tussen: **Uitvoeren als PRG** (VICE rechtstreeks compileren en starten), **Uitvoeren via D64** (verpakken in een .d64-schijfimage en VICE starten), of **Uitvoeren op hardware** (PRG naar een C64 Ultimate / 1541 Ultimate-apparaat sturen). Zie [Sectie 12](#12-d64-export--run) en [Sectie 13](#13-hardware-settings).                                                                                              |
| **Debug (RetroDebugger)**              | Compileer en start in RetroDebugger met breakpoints, symbolen en autostart-vlaggen (zie [Sectie 9](#9-debugger-integration))                                                                                                                                                                                                                                                                                                                                                                                |
| **Uitvoeren met Exomizer**             | Selectievakje in het menu Instellingen — wanneer ingeschakeld, verwerken alle Run- en Build-bewerkingen de PRG via `exomizer sfx sys` voordat ze worden gestart of opgeslagen. Werkt met Run as PRG, Run via D64, Run on Hardware, Build PRG en Build D64. Configureer eerst het Exomizer-uitvoerbare bestand in **Hardware Settings**.                                                                                                                                                                     |
| **Automatisch momentopnamen opslaan**  | Schakel het selectievakje in **Hardware-instellingen → Snapshot** in. Wanneer dit is ingeschakeld, maakt de app automatisch een snapshot ongeveer 2,5 seconden nadat u stopt met het bewerken van een tabblad. Schakel het uit als u alleen handmatig snapshots wilt opslaan.                                                                                                                                                                                                                               |
| **Hardware-instellingen**              | Open het dialoogvenster voor hardwareconfiguratie — configureer VICE, Exomizer, RetroDebugger en C64 Ultimate (host, wachtwoord, verbindingstest). Zie [Sectie 13](#13-hardware-settings).                                                                                                                                                                                                                                                                                                                  |
| **Nieuw programma…**                   | Opent een bevestigingsdialoogvenster en verwijdert vervolgens alle blokkeringen uit het programmagebied.                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Alles inklappen**                    | Vouw alle blokken samen                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Over**                               | Versie-informatie                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Wat is er nieuw**                    | Wijzigingslogboek                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |

### Projectmomentopnamen

Projectsnapshots worden opgeslagen als JSON-bestanden op de schijf, niet in localStorage. Ze zijn gekoppeld aan het huidige projectbestand (indien aanwezig), zodat de geschiedenis behouden blijft na herstarts en het project blijft volgen.

- **Menu → Bouwen → Momentopname opslaan** opent het dialoogvenster voor momentopnamen en slaat de huidige blokstatus plus Expert ASM-tekst op.
- **Menu → Bouwen → Vorige versie herstellen** herstelt direct de meest recente snapshot.
- **Menu → Bouwen → Momentopnamegeschiedenis** opent het dialoogvenster waarin u notities kunt toevoegen, oudere vermeldingen kunt herstellen of verwijderen.
- **Hardware-instellingen → Momentopname → Automatisch momentopnamen opslaan** bepaalt of de app automatisch momentopnamen maakt na bewerkingen. De standaardvertraging is ongeveer 2,5 seconden en de instelling geldt per tabblad.
- Als een project nog niet is opgeslagen, worden momentopnamen bewaard in de configuratiemap van de app totdat het project een bestandspad krijgt. | **Kennisbank** | Referentielinks (6502 opcodes, C64 KERNAL, geheugenkaart, kleuren) | | **Controleren op updates** | Open de itch.io-pagina om te controleren op een nieuwere release |

### Werkruimtes

Een **werkruimte** (`.vaws`-bestand) onthoudt welke echte bestanden op de schijf geopend waren in elk tabblad — inclusief de editormodus van elk tabblad en welk tabblad actief was — zodat u diezelfde set later opnieuw kunt openen. Het is iets anders dan een `.proj`-project: een werkruimte kan elke combinatie van Block/Expert `.json`-projectbestanden, losstaande `.asm`-bestanden en Ultimate Basic `.ub`/`.proj`-bronnen over meerdere tabbladen omvatten.

- Werkruimtes ** slaan automatisch ** een paar honderd milliseconden op nadat je een wijziging hebt aangebracht, zodra er een is opgeslagen of geopend.
- De app ** herstelt automatisch je laatst geopende werkruimte ** bij het opstarten, zodat je geopende tabbladen verdergaan waar je gebleven was.
- Alleen tabbladen die gekoppeld zijn aan een daadwerkelijk bestand op de schijf worden opgeslagen in de werkruimte; een tabblad met een niet-opgeslagen voorbeeld of een programma dat alleen in het geheugen draait, heeft niets om op te slaan en wordt overgeslagen (met een melding als geen van de geopende tabbladen hiervoor in aanmerking komt).
- Bij het openen van een werkruimte worden eerst alle geopende tabbladen gesloten. U wordt gevraagd om te bevestigen voordat het proces verdergaat.
- Als een werkruimte verwijst naar een bestand dat inmiddels is verplaatst of verwijderd, wordt die vermelding overgeslagen en na het laden alleen de naam ervan weergegeven.

### Laad een .asm-bestand (snel naslagwerk)

De Expert-modus `.asm` loader accepteert gangbare 6502-bronpatronen en zet deze om in blokken:

- `* = $1500` → ORG block
- `Label:` → LABEL-blok
- `Label: .byte 0` → LABEL + BYTE blokken
- `.byte ...` → BYTE block
- `; comment` (or inline `; ...`) → COMMENT block
- instructies (`lda`, `jsr`, `beq`, enz.) → instructieblokken met gedetecteerde adresseermodus

#### Importeer parseernotities en best practices

- Lokale labels zoals `.wait` worden geïmporteerd als standaardlabels (punt verwijderd) en de verwijzingen worden dienovereenkomstig genormaliseerd.
- Voor adressering in de stijl `($zp),Y` / `($zp,X)` kunt u het beste een concrete nulpaginabyte gebruiken (`$FB`, `$FC`, enz.) voor optimale compatibiliteit.
- Vermijd dubbelzinnige korte labels die eruitzien als hex (`cc1`, `dead`, `beef`) in vertakkingscontexten; geef de voorkeur aan namen zoals `loop_cc1`.
- Als uw programma begint met gegevens (`.byte`) vóór de uitvoerbare code, voeg dan bovenaan een expliciete startsprong toe (bijvoorbeeld `JMP Start`).

### ASM-import (Kick Assembler)

De knop **ASM import** in het menu Programma laadt onbewerkte Kick Assembler-broncode in een nieuw tabblad in blokmodus. Deze is gescheiden van de Expert-modus `Load .asm file` hierboven — de aangepaste tooltip geeft aan dat **alleen Kick Assembler-code wordt ondersteund** (andere assemblers kunnen de code gedeeltelijk parseren, maar een volledige round-trip is niet gegarandeerd).

Ondersteunde patronen:

- `.pc = $XXXX` oorsprongsrichtlijn → ORG-blok
- `.const NAME = waarde`, `.label NAME = waarde` → CONST gelijkstellen
- `.macro NAME(p1, p2, ...) { ... }` met `{`/`}` accolades of `.endm` → gebruikersmacrodefinitie
- Macro-aanroep `NAME(args)`, Kick-dubbele punt-voorvoegsel `:NAME(args)` en `.invoke NAME(args)` — allemaal heen en weer via de Kick-dubbele punt-vorm
- `@local` labels (`@loop:`, `BEQ @loop`) behouden het `@`-voorvoegsel zoals het is
- Operand `label + N` / `label - N` (bijv. `STA mod1+2`, `LDA xp+1`)
- Regelcommentaren `// ...` en `;` — beide geaccepteerd, `/* ... */` blokken worden behandeld als één enkele commentaarregel
- BASIC autostart passthrough: wanneer het programma start op `$0801` met de standaard `SYS 2061` byte stub (`.byte $0B,$08,$0A,$00,$9E,$32,$30,$36,$31,$00,$00,$00`), genereert de compiler de PRG letterlijk in plaats van er een tweede BASIC SYS omheen te wikkelen.

Bekende beperking:

- Constanten die verwijzen naar een nulpagina-adres (bijvoorbeeld `.const BYTEADDR = $FC` gebruikt als `STA BYTEADDR`) worden momenteel gecompileerd naar instructies in absolute modus (3 bytes) in plaats van nulpagina-instructies (2 bytes). De gecompileerde code schrijft nog steeds naar de juiste geheugenlocatie, alleen met een kleine overhead in grootte en cyclus vergeleken met dezelfde broncode die is gecompileerd door Kick Assembler.

## Ultieme Basismodus

Visual Assembler bevat een complete **Ultimate Basic IDE**. Ultimate Basic is een moderne, gecompileerde BASIC-taal voor het maken van C64-programma's, games en demo's zonder elke bewerking in low-level 6502-assembler te hoeven schrijven. De compiler draait lokaal en genereert native C64 PRG-uitvoer.

### De UB-editor openen

Selecteer het **UB**-pictogram in de hoofdwerkbalk om over te schakelen naar de Ultimate Basic-modus. De geselecteerde editormodus wordt onthouden, ook na het opnieuw opstarten van de applicatie. Een nieuwe bron begint met:

```basic
color bg 0
color border 0

print "HELLO FROM ULTIMATE BASIC"
```

De UB-modus werkt met `.ub`-bronbestanden. **Nieuw**, **Openen**, **Opslaan** en **Opslaan als** werken op het actieve UB-tabblad. Het openen van een `.ub`-bestand activeert automatisch het bijbehorende editor-tabblad.

De werkbalk toont de huidige UB-werkmap. Deze map wordt apart opgeslagen van de Block/Expert-werkmap. Wanneer de UB-modus actief is, selecteert **Bestand → Werkmap instellen** de UB-map; de tooltip geeft het actieve bereik aan. UB-dialoogvensters voor openen/opslaan starten daar, en niet-opgeslagen bronnen gebruiken deze map als basis voor relatieve `include` en `incbin` paden.

### Editortools

De UB-werkbalk hanteert dezelfde visuele stijl en aangepaste tooltips als de Expert-modus. Deze biedt het volgende:

- Syntaxmarkering op basis van de huidige Ultimate Basic-taalreferentie;
- regelnummers die synchroon blijven met lange bestanden;
- een minimap en zoomknoppen voor de editor; klik op de minimap om te springen of sleep de selectie in het weergavegebied voor continu scrollen;
- Zoek (`Ctrl+F` / `Cmd+F`) met behulp van de zoekbalk in expertstijl;
- Broncode opmaken met structuurbewuste inspringing;
- Automatische aanvulling voor commando's en ingebouwde functies;
- een doorzoekbaar **Commands**-paneel met syntaxis, beschrijving en gebruiksaanwijzing — beschrijvingen volgen de huidige UI-taal (Hongaars, Engels, Spaans, Duits, Nederlands), waarbij voor alles wat nog niet vertaald is, wordt teruggevallen op Engels;
- De panelen **Project** en **Commands** zijn onafhankelijk van elkaar in- en uitschakelbaar en worden naast elkaar weergegeven wanneer beide zijn ingeschakeld;
- Onafhankelijk in- en uitschakelbare en in grootte aanpasbare **Build Output** en **Disassembly** panelen.

Het paneel 'Disassembly' bevat een knop **Kopiëren** waarmee de volledige weergegeven broncode naar het klembord wordt gekopieerd. De meegeleverde compiler geeft helpinformatie voor de commando's: bijvoorbeeld, `sprite_frame id, data_address [, frame]` selecteert een animatieafbeelding uit opeenvolgende spriteframes van 64 bytes.

De lijst met opdrachten is opzettelijk in hoogte beperkt, zodat de detailkaart van de opdracht de resterende paneelhoogte kan vullen. Het detailgebied scrollt onafhankelijk voor langere syntaxbeschrijvingen.

### Projecten, tabbladen en opstartbestanden

Ultimate Basic-projecten gebruiken `.proj`-bestanden en kunnen meerdere `.ub`-bronbestanden bevatten. Het projectpaneel toont geopende bestanden, markeert niet-opgeslagen tabbladen en toont gevonden labels, functies en subroutines. Met projectacties kunt u een project maken, openen, opslaan en sluiten, of een ander bronbestand toevoegen.

Klik op het sterretje naast een projectbestand om het te markeren als het **opstartbestand**. De commando's Build, Run, D64, C64 Ultimate en Debug compileren die opstartbroncode, zelfs als er een ander tabblad actief is. Zonder een opstartselectie wordt het actieve UB-tabblad gebruikt.

### Bouw en diagnose

De knop **Build** opent dezelfde gecentreerde voortgangsweergave als de andere Visual Assembler-workflows. Succesvolle builds werken Build Output, Build Info en Disassembly bij. Schakel **Verbose** in om details over de geheugenmapping van de compiler, interne toewijzingen op nulpagina's en gegenereerde codegegevens weer te geven.

Als de compilatie mislukt:

- De buildoutput wordt automatisch zichtbaar gemaakt;
- Compilerfouten worden in het rood weergegeven;
- Het gecentreerde compilatiedialoogvenster geeft de foutmelding weer;
- Fouten die een bronregel bevatten, selecteren die regel in de actieve UB-editor.

Build Info rapporteert laad-/eindadressen, code- en PRG-groottes, Exomizer-status, variabelen, arrays, functies/subroutines en labels.

### Hardlopen, D64 en Exomizer

De hoofdsplit **Run**-knop ondersteunt Ultimate Basic in elke normale bestemming:

| Uitvoeringsmodus              | Ultiem basisgedrag                                                                                               |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Uitvoeren als PRG**         | Compileer en start de PRG rechtstreeks in VICE.                                                                  |
| **Uitvoeren via D64**         | Compileer het programma, open het standaard D64-verpakkingsdialoogvenster en start vervolgens de schijf in VICE. |
| **Speel op Ultimate**         | Upload en voer het PRG-bestand uit via de geconfigureerde C64 Ultimate REST-verbinding.                          |
| **D64 uitvoeren op hardware** | Verpak een D64 en stuur deze naar de geconfigureerde C64 Ultimate.                                               |

De globale **Settings → Exomizer**-optie is ook van toepassing op UB-builds en normale uitvoeringsdoelen; er is geen aparte schakelaar in de UB-werkbalk nodig. Bij het starten van de debugger wordt bewust de niet-gecomprimeerde PRG gebruikt, zodat compileradressen en symbolen overeenkomen met het uitgevoerde programma.

Schakel **Instellingen → Programma-instellingen → UltimateBasic ASM-broncode (.asm) genereren** in om de door de compiler gegenereerde assembly naast een PRG- of D64-build op te slaan met dezelfde basisbestandsnaam. Dit is een build-optie, dus de UB-werkbalk bevat geen aparte knoppen voor ASM-export. Een `load "NAME", $address`-instructie levert ook het bijbehorende PRG-laadadres van het D64-extrabestand.

### Debuggersymbolen en demontage

De builds vragen om Ultimate Basic-debuginformatie en produceren drie compatibele sidecars:

- `.sym` voor symbolen in KickAssembler-stijl;
- `.dbg` voor C64Debugger/RetroDebugger bron- en segmentinformatie;
- `.vs` voor VICE-monitorlabels.

Het gekleurde UB Disassembly-paneel lost bekende labels op en toont adressen, bytes, mnemonics en operanden. De **Debug**-knop start RetroDebugger met de ruwe UB PRG, debug-sidecars en de labels, functies, subroutines, variabelen en arrays van de compiler. De instellingen voor debug-wacht en hervatten worden gedeeld met de normale Visual Assembler-debuggerconfiguratie.

### Ultieme basishandleiding en bron

Het boekpictogram in de UB-werkbalk opent de bijbehorende Ultimate Basic `MANUAL.pdf` offline; de knop 'handleiding' in het welkomstvenster bij het opstarten opent dezelfde handleiding. Visual Assembler haalt zowel de compiler als de PDF uit de vastgezette upstream Git/Cargo-afhankelijkheid, waardoor de IDE geen tweede kopie van de Ultimate Basic-implementatie onderhoudt. Het dialoogvenster 'Over' en het opstartscherm tonen de actuele versie van de afhankelijkheid.

Ultimate Basic is ook beschikbaar als een zelfstandig open-sourceproject:

<https://github.com/zstarczali/UltimateBasic>

De compiler is gebundeld in Visual Assembler, dus er is geen apart `ub` uitvoerbaar bestand nodig tijdens de uitvoering.

## 6. Expertmodus

Expertmodus is een volwaardige 6502-assemblereditor voor directe tekst die naast de blokeditor bestaat. Elk tabblad kan zich in de blokmodus of de expertmodus bevinden; u kunt er op elk gewenst moment vrij tussen schakelen met de schakelaar **Blok / Expert** in de bovenste balk.

### Modi wisselen

- **Blok → Expert:** Het huidige programma wordt geserialiseerd naar tekst (één instructie per regel, labels en macro's als richtlijnen). Bewerkingen in de Expert-modus worden gesynchroniseerd met de blokarray wanneer u terugschakelt of een actie activeert.
- **Expert → Blok:** De tekst wordt geparseerd met `parseAsmText()` en het resultaat vervangt het blokprogramma. Er wordt een dialoogvenster met een compilatie-fout weergegeven als het parseren mislukt.
- **Lege regels** blijven behouden tijdens retouren: lege regels in de Expert-editor verschijnen als dunne stippellijnen in de Blokmodus en worden hersteld als lege regels wanneer er teruggeschakeld wordt naar Expert.

### Editor-lay-out

```
┌──────────────────────────────────────────────────────┐
│ [toolbar]  Block │ Expert < tab toggle               │
├────────────┬────────────────────────────┬────────────┤
│  Palette   │   ASM text editor          │  Disasm    │
│  (opt.)    │   (monospace, editable)    │  panel     │
│            │                            │  (opt.)    │
└────────────┴────────────────────────────┴────────────┘
```

| Paneel              | Schakelaar            | Beschrijving                                                                                                                               |
| ------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Palet**           | `#expert-palette-btn` | Het linker blokkenpalet — sleep blokken naar de editor of klik om ze op de cursorpositie in te voegen                                      |
| **ASM-editor**      | altijd zichtbaar      | Volledig monospace tekstgebied met live syntax highlighting-overlay.                                                                       |
| **Demontagepaneel** | `#expert-disasm-btn`  | Pure 6502-disassemblage: elke instructie toont het adres, de hexadecimale bytes en de numerieke operanden; macro's volledig uitgeschreven. |

### Werkbalkknoppen

| Knop                                  | ID                                             | Functie                                                                                                                                                                                                                                                     |
| ------------------------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Formaat**                           | `#expert-format-btn`                           | Broncode automatisch formatteren (labels naar kolom 0, 4 spaties inspringen, 1 spatie voor mnemonic/operand)                                                                                                                                                |
| **Laad .asm**                         | `#expert-load-asm-btn`                         | Open een `.asm`-bestand — de inhoud wordt geladen in een **nieuw tabblad** met de bestandsnaam als tabbladlabel. Elk geladen bestand wordt een onafhankelijk tabblad met eigen programmablokken en editorstatus.                                            |
| **Sla .asm op**                       | `#expert-save-asm-btn`                         | Sla de editorinhoud op in een `.asm`-bestand (bestanddialoogvenster bij de eerste keer opslaan)                                                                                                                                                             |
| **Bouwinfo**                          | `#expert-build-info-btn`                       | Open het dialoogvenster Build Info (oorsprong, grootte, labels, fouten).                                                                                                                                                                                    |
| **HL**                                | `#expert-hl-btn`                               | Syntaxmarkering in- of uitschakelen (uitschakelen voor zeer grote bestanden)                                                                                                                                                                                |
| **Automatisch aanvullen**             | `#expert-autocomplete-btn`                     | Schakel de automatische aanvulsuggesties voor experts in of uit. Wanneer deze functie is uitgeschakeld, verschijnen er geen instructies, ezelsbruggetjes of labels in de experteditor.                                                                      |
| **Regioselectie**                     | `#expert-regio-selectie-knop`                  | Schakel de automatische regiomarkering in de expertmodus in of uit. De vouwstatus blijft behouden, maar wanneer deze functie is uitgeschakeld, blijft de volledige broncode zichtbaar in de editor en wordt de huidige regio niet automatisch geselecteerd. |
| **Alle regio's inklappen/uitklappen** | `#expert-region-fold-all-btn`                  | Vouw elk `.region`-blok in één klik in of uit. Als er momenteel een regio open is, vouwt de knop ze allemaal in; als alle regio's al ingeklapt zijn, vouwt de volgende klik ze allemaal uit. De knop licht op wanneer alle regio's zijn ingeklapt.          |
| **Regelnummers**                      | `#expert-line-numbers-btn`                     | Schakel de regelnummermarge aan de linkerkant van de editor in of uit. De marge blijft gesynchroniseerd met de scrollpositie en wordt live bijgewerkt terwijl u typt.                                                                                       |
| **Vind**                              | `#expert-find-btn`                             | Open de zwevende zoekbalk (`Ctrl+F`). Typ om te zoeken; overeenkomsten worden gemarkeerd in de overlay. `Enter` / `Shift+Enter` navigeer tussen overeenkomsten. `Escape` sluit de balk.                                                                     |
| **Uitzoomen/inzoomen**                | `#expert-zoom-out-btn` / `#expert-zoom-in-btn` | Verklein/vergroot de lettergrootte van de editor (8–28 px). De instelling wordt opgeslagen.                                                                                                                                                                 |
| **Palet**                             | `#expert-palette-btn`                          | Toon/verberg het linker geheugenpalet                                                                                                                                                                                                                       |
| **Disasm**                            | `#expert-disasm-btn`                           | Het demontagepaneel weergeven/verbergen (pure 6502, macro's uitgebreid)                                                                                                                                                                                     |
| **Monitor**                           | `#expert-monitor-btn`                          | Het paneel voor de hex-dump van de monitor weergeven/verbergen                                                                                                                                                                                              |
| **Minimap**                           | `#expert-minimap-btn`                          | Toon/verberg de code-minimap aan de rechterkant van de editor                                                                                                                                                                                               |

Editor-sneltoetsen: `Ctrl+/` (`Cmd+/` op macOS) voegt commentaar toe aan de huidige regel of aan alle geselecteerde regels; door `Shift` toe te voegen, wordt de commentaarmarkering aan het begin van die regels verwijderd. Inline-commentaren (bijvoorbeeld `LDA $12 ; explanation`) blijven op de instructieregel staan bij het schakelen tussen de expertmodus en de blokmodus. In de blokmodus worden ze weergegeven als een groene cursieve `; comment`-markering in de blokkop; door met de muis over de markering te bewegen, wordt de volledige tekst weergegeven wanneer deze is afgekapt.

### Expert editor minimap

De minimap van de Expert-editor is een smalle strook (`88 px`) helemaal rechts in het editorgebied. Deze geeft een verkleinde weergave van elke bronregel weer:

| Kleur van de balk     | Tokentype                                                |
| --------------------- | -------------------------------------------------------- |
| Commentaar kleur      | Regels die beginnen met `;`                              |
| Labelkleur            | Lijnen met een `label:` definitie                        |
| Richtlijnkleur        | `.byte`, `.macro`, `.region`, en alle andere richtlijnen |
| Mnemotechnische kleur | Al het overige (instructies)                             |

Een **semi-transparante viewport-indicator** (rechthoek in accentkleur) geeft aan welk deel van de bron momenteel zichtbaar is. Klik ergens op de minimap om naar die positie te springen; sleep om continu te scrollen. De minimap scrollt onafhankelijk mee om de viewport-indicator gecentreerd te houden. De status wordt opgeslagen in de UI-instellingen (`expertMinimap`-toets).

### Foutmarkering

Regels die niet compileren, worden in realtime gemarkeerd in **rood** (getinte achtergrond + linker accentrand), 350 ms na elke toetsaanslag. Het eerste foutbericht wordt ook weergegeven in de statusbalk. Corrigeer de regel en de markering verdwijnt automatisch.

### Syntaxmarkering

De editor gebruikt een transparante `<div>` overlay (`expert-hl`) die de inhoud van het tekstgebied spiegelt met gekleurde `<span>` elementen. De markering kan worden uitgeschakeld met de **HL** knop voor betere prestaties bij zeer grote programma's.

| Kleur       | Token                                                                                                                                                  |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Geelgroen   | Mnemonics (`LDA`, `STA`, `JMP`, …) en pseudo-operaties met lange vertakkingen (`LBNE`, `LBEQ`, …)                                                      |
| Blauw       | Richtlijnen (`.byte`, `.word`, `.fill`, `.assert`, `*=`, …)                                                                                            |
| Oranje      | Getallen (`$FF`, `%1010`, `255`)                                                                                                                       |
| Cyaan       | Labels — regels die eindigen op `:`, inclusief lokale labels (`.loop:`) en labels voor zelfmodificerende code-operanden (`value:` in `LDA value:#$00`) |
| Teal        | Stringliteralen                                                                                                                                        |
| Donkergroen | Opmerkingen (`; …`)                                                                                                                                    |

`REGION` / `ENDREGION`-richtlijnen worden gemarkeerd zoals de andere assemblerrichtlijnen. In ingeklapte regio's blijft alleen de regiokop zichtbaar in de editor totdat u ze opnieuw opent. De nieuwe **Regioselectie**-schakelaar in de werkbalk regelt alleen de automatische markering van de huidige regio in de Expert-modus; als u deze uitschakelt, blijft de broncode zichtbaar zonder de ingeklapte status te wijzigen.

### Bronformatter

Klik op de knop **Format** (`#expert-format-btn`) om de huidige bron automatisch te formatteren:

- Labeldefinities worden verplaatst naar kolom 0.
- Instructies worden met 4 spaties ingesprongen.
- Ezelsbruggetjes worden met een hoofdletter geschreven.
- Precies één spatie tussen de mnemonische code en de operand (extra witruimte wordt genormaliseerd).
- Als de bron al geformatteerd is, wordt de status `"Al geformatteerd"` weergegeven.

### Projectpaneel en tabbladen

De expertmodus ondersteunt een **projectpaneel** (`#expert-project-panel`) voor projecten met meerdere bestanden `.proj`:

- Een `.proj`-bestand is een JSON-manifest dat een lijst bevat van bronbestanden en hun metadata.
- Open een project met **Menu → Bestand → Project openen** of sleep een `.proj`-bestand naar het venster.
- Elk bestand in het project wordt geopend als een apart **tabblad** in de tabbladbalk bovenaan de editor.
- **Project sluiten** (`Menu → Bestand → Project sluiten` / `#menu-close-project`) sluit het huidige project en alle bijbehorende bestandstabbladen in één keer. Er wordt gevraagd om eventuele niet-opgeslagen wijzigingen op te slaan voordat het project wordt gesloten. Het projectpaneel wordt teruggezet naar de lege staat en `_expertProjectData` wordt gewist.
- Elk bestand kan worden gemarkeerd als het **opstartbestand** (★ sterpictogram). Wanneer een opstartbestand is ingesteld, compileert en voert de **Uitvoeren** knop (PRG, D64, Ultimate) altijd de code van dat bestand uit, ongeacht welk tabblad momenteel actief is. Dit werkt zowel in de blokmodus als in de expertmodus.
- Het gedeelte **symbolen** onderaan het projectpaneel kan verticaal worden aangepast met behulp van de scheidingslijn tussen de bestandsstructuur en de symbolenlijst, zodat lange symbolenlijsten meer ruimte kunnen innemen wanneer dat nodig is.

### Tabbalk

De tabbladbalk verschijnt boven de editor wanneer er meer dan één tabblad geopend is.

| Functie              | Beschrijving                                                                                                                                                                                                                                                                                                                                                                                                                      |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Vuile stip**       | Een klein, contrasterend gekleurd stipje bij de tabnaam geeft aan dat er nog wijzigingen zijn die niet zijn opgeslagen.                                                                                                                                                                                                                                                                                                           |
| **Scrollpijlen**     | De scrollknoppen naar links/rechts verschijnen wanneer er meer tabbladen zijn dan er in de balk passen.                                                                                                                                                                                                                                                                                                                           |
| **Sluiten (×)**      | Sluit het tabblad; vraagt om op te slaan als het tabblad gewijzigd is.                                                                                                                                                                                                                                                                                                                                                            |
| **Bestandsextensie** | De volledige bestandsnaam inclusief extensie (`.c64va`, `.json`) wordt weergegeven.                                                                                                                                                                                                                                                                                                                                               |
| **Rechtermuismenu**  | Klik met de rechtermuisknop op een tabblad (of een lege ruimte in de tabbladbalk) voor: **Nieuw tabblad**, **Tabblad sluiten**, **Andere tabbladen sluiten**, **Tabbladen rechts sluiten**, **Alle tabbladen sluiten**. Bij het sluiten van meerdere tabbladen tegelijk wordt er per gewijzigd tabblad een prompt weergegeven en wordt de bewerking gestopt als u annuleert. **Alles sluiten** laat altijd één leeg tabblad open. |

> **Tip:** Paletsynchronisatie (`#expert-palette-sync-btn`) zorgt ervoor dat de paletselectie synchroon blijft met de sneltoets bij de cursor. Schakel deze functie uit als u niet wilt dat het palet verspringt tijdens het bewerken.

---

## 7. Adresseringsmodi

Elke 6502-instructie ondersteunt een of meer adresseermodi. De modusselector staat op elk blok.

| Modus            | Label          | Voorbeeld     | Beschrijving                                                                              |
| ---------------- | -------------- | ------------- | ----------------------------------------------------------------------------------------- |
| **impliciet**    | Impliciet      | `NOP`         | Geen operand; de instructie is op zichzelf staand.                                        |
| **onmiddellijk** | Onmiddellijk   | `LDA #$FF`    | Inline constante; de assembler voegt `#` automatisch toe                                  |
| **nulPagina**    | Nul pagina     | `LDA $10`     | Enkelbyte-adres op pagina nul (0–255)                                                     |
| **nulPaginaX**   | Nul pagina, X  | `LDA $10,X`   | Paginaadres nul + X-registeroffset (resultaat loopt door naar pagina 0)                   |
| **nulPaginaY**   | Nulpagina, Y   | `LDX $FB,Y`   | Pagina-adres nul + Y-registeroffset                                                       |
| **absoluut**     | Absoluut       | `LDA $0400`   | Volledig 16-bits geheugenadres                                                            |
| **absoluteX**    | Absoluut, X    | `LDA $0400,X` | 16-bits adres + X-registeroffset                                                          |
| **absoluteY**    | Absoluut, Y    | `LDA $0400,Y` | 16-bits adres + Y-registeroffset                                                          |
| **relatief**     | Relatief/Label | `BNE-lus`     | Voor instructies aan een filiaal: voer een labelnaam of doeladres in.                     |
| **indirectX**    | Indirect, X    | `LDA ($FB,X)` | Indirecte zoekopdracht met indexering op nulpagina (operand = adres op nulpagina, 1 byte) |
| **indirectY**    | Indirect, Y    | `LDA ($FB),Y` | Indirecte indexering op nulpagina (operand = adres op nulpagina, 1 byte)                  |
| **indirect**     | Indirect       | `JMP ($0100)` | Indirect; alleen bruikbaar met JMP                                                        |

### Label expressies als operanden

Elk operandveld dat een adres of directe waarde accepteert, accepteert ook rechtstreeks een **constante naam** (uit een `CONST`-blok of een `LABEL`). Daarnaast kunt u **label+offset** of **label−offset** expressies gebruiken om te verwijzen naar een adres ten opzichte van een benoemde constante:

| Syntaxis         | Voorbeeld                | Beschrijving                                                                                                                 |
| ---------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `label`          | `STA scherm_ram,X`       | Wordt opgelost naar de label-/constante waarde                                                                               |
| `label+$hex`     | `STA scherm_ram+$0100,X` | Labeladres plus een hexadecimale offset                                                                                      |
| `label+decimaal` | `STA scherm_ram+256,X`   | Labeladres plus een decimale offset                                                                                          |
| `label-$hex`     | `LDA-tabel-$10`          | Labeladres min een hexadecimale offset                                                                                       |
| `#<label`        | `LDA #<screen_ram`       | Laagste byte van het labeladres                                                                                              |
| `#&gt;label`     | `LDA #&gt;screen_ram`    | Hoogste byte van het labeladres                                                                                              |
| `*`              | `BNE *`                  | Huidige programmateller (het eigen adres van de instructie); sprongen met `*` genereren een oneindige zelflus (offset `$FE`) |

**Voorbeeld — wis twee schermpagina's met behulp van een CONST:**
```
; .CONST screen_ram = $0400
    LDX #$00
clear:
    STA screen_ram,X
    STA screen_ram+$0100,X
    DEX
    BNE clear
```

### De `*` programmateller in expressies

*(Nieuw in 2.3.9.)* `*` is niet langer beperkt tot de volledige operand — het kan ** overal binnen een operandexpressie voorkomen** en staat voor het adres van de instructie waarop het is geschreven. Het wordt tijdens de assembleertijd opgelost ten opzichte van het werkelijke adres van die instructie, dus er is geen label nodig voor korte relatieve sprongen of PC-relatieve gegevenslezingen.

| Syntaxis            | Voorbeeld                  | Betekenis                                           |
| ------------------- | -------------------------- | --------------------------------------------------- |
| `*`                 | `BNE *`                    | Spring naar zichzelf (oneindige lus, offset `$FE`)  |
| `*-n` / `*+n`       | `BNE *-5`, `BEQ *+4`       | Spring ten opzichte van de huidige pc met *n* bytes |
| `JMP *+n`           | `JMP *+20`                 | Absolute sprong berekend vanaf de huidige pc        |
| `#&lt;*` / `#&gt;*` | `LDA #&lt;*`, `LDA #&gt;*` | Laagste/hoogste byte van de huidige pc              |
| `#&gt;(*+n)`        | `LDA #&gt;(*+63)`          | Lage/hoge byte van een PC-relatief adres            |

**PC versus vermenigvuldiging.** `*` wordt alleen als programmateller behandeld wanneer deze zich in *waardepositie* bevindt — aan het begin van de expressie, of direct na een operator, `(`, `,`, `&lt;`, `&gt;` of witruimte. Een `*` die volgt op een getal, `)` of een identifier is gewone vermenigvuldiging, dus `LDA-tabel*2` en `CONST_A*4` blijven ongewijzigd.

**Waar het werkt.** Elke operand die al een expressie accepteert: vertakkingsdoelen, `JMP` / `JSR`, `LDA`/`STA`/… absolute en geïndexeerde, directe lage/hoge byte-operatoren, en de `.assert`-expressie. `*` verandert nooit de grootte van een instructie, dus het is veilig in elke adresseermodus.

### Lokale (gestippelde) labels

*(Nieuw in 2.3.9.)* Een label waarvan de naam begint met een punt — `.loop`, `.skip`, `.done` — is een **lokaal label**. Het behoort tot het bereik van het dichtstbijzijnde voorafgaande **globale** (niet-puntige) label en wordt intern `<global>.<name>`. Twee lokale labels met dezelfde korte naam onder verschillende globale labels **botsen niet**.

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

- Binnen een bereik kun je naar een lokaal label verwijzen als `.name`.
- Vanuit een andere scope kun je er expliciet naar verwijzen als `Global.name` (bijv. `JMP ClearScreen.loop`).
- Een `.name` die vóór een globaal label wordt geschreven, blijft een gewoon label op het hoogste niveau, zoals `.name`.
- Lokale labels worden ongewijzigd doorgegeven tussen de Block- en Expert-modus; het voorvoegsel `<global>.` is een detail dat tijdens de lay-out wordt bepaald en wordt nooit in het blokprogramma opgeslagen.

### Operandlabels voor zelfmodificerende code

*(Nieuw in 2.3.9.)* Voorzie de operand van een instructie van het voorvoegsel `label:` om een label op de **operandbyte** te plaatsen in plaats van op de opcode. De instructie wordt geassembleerd vanuit alles wat na de dubbele punt komt.

```
setup:
    LDA value:#$00     ; 'value' -> address of the #$00 operand byte
    ...
patch:
    LDA #new
    STA value          ; writes the operand byte directly — classic SMC
```

`value` wijst naar `<instructieadres> + 1` (de eerste operandbyte), voor elke adresseermodus. Dit vervangt het oudere `STA instruction+1` / `instruction: LDA #$00` patroon. Het doorloopt de Block ⇄ Expert-modus (het operandveld behoudt het `label:`-voorvoegsel).

---

## 8. Standaard 6502-instructies

### Gegevensverplaatsing

| Ezelsbruggetje | Beschrijving          | Modi                                                                          |
| -------------- | --------------------- | ----------------------------------------------------------------------------- |
| `LDA`          | Belastingsaccumulator | onmiddellijk, nulPagina, absoluut, absoluutX, absoluutY, indirectX, indirectY |
| `LDX`          | Laad X-register       | onmiddellijk, nulpagina, nulpaginaY, absoluut, absoluutY                      |
| `LDY`          | Laad Y-register       | onmiddellijk, nulpagina, absoluut, absoluteX                                  |
| `STA`          | Winkelaccumulator     | zeroPage, absolute, absoluteX, absoluteY, indirectX, indirectY                |
| `STX`          | Winkel X kassa        | nulPagina, nulPaginaY, absoluut                                               |
| `STY`          | Winkel Y kassa        | nulPagina, absoluut                                                           |

### Rekenkundig

| Ezelsbruggetje | Beschrijving             | Notities                                                                  |
| -------------- | ------------------------ | ------------------------------------------------------------------------- |
| `ADC`          | Voeg toe met meenemen    | Stel de carry-eigenschap in met `SEC` vóór gebruik in de meeste gevallen. |
| `SBC`          | Aftrekken met overdracht | Stel de overdracht in met `SEC` vóór de aftrekking.                       |
| `INC`          | Geheugen vergroten       | —                                                                         |
| `DEC`          | Verminder het geheugen   | —                                                                         |
| `CMP`          | Vergelijk met A          | Stelt vlaggen in; wijzigt A niet.                                         |
| `CPX`          | Vergelijk met X          | —                                                                         |
| `CPY`          | Vergelijk met Y          | —                                                                         |

### Logica

| Ezelsbruggetje | Beschrijving                                                            |
| -------------- | ----------------------------------------------------------------------- |
| `EN`           | Logische EN met accumulator                                             |
| `ORA`          | Logische OF met accumulator                                             |
| `EOR`          | Exclusieve OF met accumulator                                           |
| `BIT`          | Test de bits in het geheugen tegen A (stelt de N-, V- en Z-vlaggen in). |

### Sprongen en takken

| Ezelsbruggetje | Beschrijving                                                  |
| -------------- | ------------------------------------------------------------- |
| `JMP`          | Onvoorwaardelijke sprong (absoluut of indirect)               |
| `JSR`          | Spring naar subroutine (slaat het retouradres op de stack op) |
| `RTS`          | Terugkeer uit subroutine                                      |
| `RTI`          | Terugkeer van onderbreking                                    |
| `BNE`          | Splitsen indien niet gelijk (Z=0)                             |
| `BEQ`          | Takken indien gelijk (Z=1)                                    |
| `BCC`          | Branch if Carry Clear (C=0)                                   |
| `BCS`          | Branch if Carry Set (C=1)                                     |
| `BMI`          | Branch if Minus (N=1)                                         |
| `BPL`          | Branch if Plus (N=0)                                          |
| `BVC`          | Vertakking indien overloop wissen (V=0)                       |
| `BVS`          | Vertakking als de set overloopt (V=1)                         |

#### LBNE / LBEQ / … (Lange takken)

*(Nieuw in 2.3.9.)* De paletcategorie **Lange sprongen** bevat acht pseudo-operaties die zich gedragen als voorwaardelijke sprongen, maar **elk adres** bereiken, niet alleen −128…+127. Elk ervan assembleert tot een omgekeerde sprong die een 3-byte `JMP` overslaat — altijd **5 bytes**:

```
LBEQ done      ; assembles to:   BNE *+3   ($D0 $03)
               ;                 JMP done  ($4C lo hi)
```

| Lange operatie | Voorwaarde            | Uitgestoten als        |
| -------------- | --------------------- | ---------------------- |
| `LBNE`         | niet gelijk aan (Z=0) | `BEQ *+3 / JMP-doel`   |
| `LBEQ`         | gelijk (Z=1)          | `BNE *+3 / JMP target` |
| `LBCC`         | draag helder (C=0)    | `BCS *+3 / JMP-doel`   |
| `LBCS`         | draagset (C=1)        | `BCC *+3 / JMP-doel`   |
| `LBMI`         | min (N=1)             | `BPL *+3 / JMP-doel`   |
| `LBPL`         | plus (N=0)            | `BMI *+3 / JMP-doel`   |
| `LBVC`         | overflow clear (V=0)  | `BVS *+3 / JMP-doel`   |
| `LBVS`         | overloopset (V=1)     | `BVC *+3 / JMP-doel`   |

- Operand: een label, een `*`-expressie of een letterlijk adres — hetzelfde als een normale vertakkingsdoel.
- Kosten: 5 bytes en 1 extra cyclus op het gekozen pad in vergelijking met een korte sprong. Er is geen automatische promotie van een korte sprong — je kiest expliciet voor `LBxx`.
- Wanneer een gewone sprong (`BNE`, `BEQ`, …) buiten het bereik valt, geeft de compilerfout nu de exacte overschrijding aan en suggereert de overeenkomende `LBxx`.

### Registratie van bewerkingen

| Ezelsbruggetje | Beschrijving                   |
| -------------- | ------------------------------ |
| `BELASTING`    | Overdracht A → X               |
| `TAY`          | Overdracht A → Y               |
| `TXA`          | Overdracht X → A               |
| `TYA`          | Overdracht Y → A               |
| `TSX`          | Overdrachtspunt naar stack → X |
| `TXS`          | Overdracht X → Stackpointer    |
| `INX`          | Verhoog X                      |
| `DEX`          | Verminder X                    |
| `INY`          | Verhoog Y                      |
| `DEY`          | Verminder Y                    |

### Shift & Rotate

| Ezelsbruggetje | Beschrijving                           |
| -------------- | -------------------------------------- |
| `ASL`          | Rekenkundige verschuiving naar links   |
| `LSR`          | Logische verschuiving naar rechts      |
| `ROL`          | Draai naar links door de Carry-functie |
| `ROR`          | Draai naar rechts tijdens het dragen.  |

### Stapel

| Ezelsbruggetje | Beschrijving                             |
| -------------- | ---------------------------------------- |
| `PHA`          | Plaats de accumulator op de stapel.      |
| `PHP`          | Plaats de processorstatus op de stack.   |
| `PLA`          | Haal de accumulator uit de stapel.       |
| `PLP`          | Haal de processorstatus op uit de stack. |

### Systeem / Vlaggen

| Ezelsbruggetje | Beschrijving                                     |
| -------------- | ------------------------------------------------ |
| `CLC`          | Vlag voor het dragen van een Clear Carry-vlag    |
| `CLD`          | Decimale modus wissen                            |
| `CLI`          | Wis de onderbrekingsfunctie                      |
| `CLV`          | Wis de overloopvlag                              |
| `SEC`          | Stel de draagvlag in                             |
| `SED`          | Decimale modus instellen                         |
| `SEI`          | Onderbreking uitschakelen                        |
| `NOP`          | Geen operatie                                    |
| `BRK`          | Geforceerde onderbreking / software-onderbreking |

### Illegale / niet-gedocumenteerde instructies

Deze chips zijn geschikt voor geavanceerd gebruik. Gebruik ze met zorg, want het gedrag kan per chip verschillen.

`LAX`, `SAX`, `DCP`, `ISC`, `SLO`, `RLA`, `SRE`, `RRA`, `ANC`, `ALR`, `ARR`, `AXS`

---

## 9. Macroblokken — Referentie

Macroblokken stellen je in staat om veelvoorkomende taken in één stap uit te voeren. In plaats van 10-20 instructies handmatig te schrijven, voeg je één blok toe en genereert de assembler de code voor je. Zie ze als ingebouwde subroutines.

---

### LABEL

Net als een **regelnummer in BASIC** — maar dan met een naam in plaats van een nummer. Springdoelen voor `JMP`, `JSR`, `BNE`, enz.

| Veld      | Beschrijving                                            |
| --------- | ------------------------------------------------------- |
| Labelnaam | Identificatiecode gebruikt in `JMP`, `JSR`, `BNE`, enz. |

**Expert syntax:**
```
loop:
```

**Gegenereerde ASM:**
```
loop:  ; $0820
```

Het huidige adres wordt weergegeven als een opmerking. Labels hebben een grootte van **0 bytes**.

---

### COMMENT

Net als **REM in BASIC** — een notitie voor jezelf die de assembler volledig negeert.

**Expert syntax:**
```
; Your comment text here
```

**Gegenereerde ASM:**
```
; Your comment text here
```

---

### BYTE

Net als **DATA in BASIC** — slaat een lijst met onbewerkte byte-waarden direct in het programma op.

| Veld     | Beschrijving                                                                |
| -------- | --------------------------------------------------------------------------- |
| Operande | Door komma's gescheiden byte-waarden (bijv. `$01, $02, $FF` of `1, 2, 255`) |

**Expert syntax:**
```
.byte $01, $02, $FF
```

**Gegenereerde ASM:**
```
    .byte $01, $02, $FF
```

** Referenties naar lage/hoge byte-labels: ** BYTE accepteert tokens in KickAssembler/ca65-stijl `<label` (lage byte) en `>label` (hoge byte) naast numerieke waarden. De assembler lost het labeladres op tijdens het compileren en voegt de juiste byte in. Voorbeeld:

```
    .byte <frame_0, >frame_0, <frame_1, >frame_1
```

Hierin wordt de lage byte van het adres van `frame_0` opgeslagen, vervolgens de hoge byte, en daarna hetzelfde voor `frame_1`. Handig voor het maken van sprongtabellen en adreslijsten.

**Grootte:** Aantal bytes in de lijst.

---

### WORD

Net als **DATA in BASIC, maar dan voor 16-bits getallen **. Elke waarde wordt opgeslagen als twee bytes (eerst de lage byte, dan de hoge byte — 6502 little-endian volgorde).

| Veld     | Beschrijving                                                   |
| -------- | -------------------------------------------------------------- |
| Operande | Door komma's gescheiden 16-bits waarden (bijv. `$0400, $C000`) |

**Expert syntax:**
```
.word $0400, $C000
```

**Gegenereerde ASM:**
```
    .word $0400, $C000
```

**Grootte:** 2 bytes per woord.

---

### FILL

Zoals `FOR I=1 TO N : POKE addr+I, val : NEXT` — vult een geheugenblok met dezelfde byte, maar in één blok. Ideaal voor het wissen van gebieden of het vooraf vullen van tabellen.

| Veld     | Beschrijving                                            |
| -------- | ------------------------------------------------------- |
| Operande | `count,value` — bijv. `256,0` vult 256 bytes met nullen |

**Expert syntax:**
```
.fill 256, $00
```

**Gegenereerde ASM:**
```
    .fill 256, $00
```

**Expressiesyntaxis:** Zowel `count` als `value` accepteren rekenkundige expressies. Je kunt verwijzen naar CONST-namen, hexadecimale/binaire letterlijke waarden gebruiken en ingebouwde wiskundige functies aanroepen:

| Uitdrukking                 | Betekenis                             |
| --------------------------- | ------------------------------------- |
| `TEGEL_AANTAL, $00`         | count from a CONST, value hex literal |
| `40*25, 0`                  | inline vermenigvuldiging              |
| `round(sin(PI/4)*255), $80` | trigonometrie                         |

**Ingebouwde functies:** `sin()`, `cos()`, `round()`, `max(a,b)`, `min(a,b)`, `abs()`, constant `PI`

Operatoren: `+ - * /` Literalen: `$FF` (hex), `%10110000` (binair) Laagste/hoogste byte: `lo(expr)`, `hi(expr)`

**Grootte:** De telwaarde in bytes.

---

### ALIGN

Schuift het huidige adres naar voren naar de volgende schone grens door nulopvullingsbytes in te voegen. De C64 vereist dat spritegegevens beginnen op een grens van 64 bytes — `ALIGN 64` regelt dat automatisch.

| Veld  | Beschrijving                                                                   |
| ----- | ------------------------------------------------------------------------------ |
| Grens | Uitlijningswaarde — bijv. `64` (spritegrens), `256` (pagina), `$2000` (bitmap) |

**Expert syntax:**
```
.align 64
.align $2000
```

**Gegenereerde ASM:**
```
    ; ALIGN 64 → $0840 (12 bytes padding)
```

**Grootte:** Dynamisch — afhankelijk van de huidige programmatellerpositie.

> **Tip:** Gebruik `ALIGN 64` vóór spritegegevens, `ALIGN 256` om ervoor te zorgen dat tabellen pagina-uitgelijnd zijn.

---

### TEXT

Net als **PRINT AT** — schrijft tekst rechtstreeks naar het C64-scherm op een bepaalde kolom en rij, zonder de kernel te gebruiken. Het genereert één LDA/STA-paar per teken, gericht op het scherm-RAM op `$0400`.

| Veld                    | Beschrijving                                                    |
| ----------------------- | --------------------------------------------------------------- |
| Tekst                   | De weer te geven tekenreeks                                     |
| X                       | Kolom (0–39)                                                    |
| Y                       | Rij (0–24)                                                      |
| Label (optioneel)       | Kent een label toe dat verwijst naar het berekende schermadres. |
| Kleine letters tekenset | Selectievakje — zie hieronder                                   |

**Tekensetmodi:**

De C64 heeft twee tekensets die tijdens het uitvoeren van het spel kunnen worden geselecteerd:

| Modus                                              | $D018 bit 1 | Hoofdletterinvoer                | Invoer van kleine letters            |
| -------------------------------------------------- | ----------- | -------------------------------- | ------------------------------------ |
| **Hoofdletters/afbeeldingen** (standaard)          | 0           | `A`–`Z` → schermcodes $01–$1A ✓  | ook als hoofdletter behandeld        |
| **Kleine letters/hoofdletters** (na CHARSET lower) | 1           | `A`–`Z` → $01–$1A (hoofdletters) | `a`–`z` → $41–$5A (kleine letters) ✓ |

- **Hoofdlettertekenset (standaard, selectievakje niet aangevinkt):** Typ wat u in hoofdletters wilt zien. `"HALLO"` wordt weergegeven als `HALLO`. Invoer in kleine letters wordt omgezet naar hoofdlettercodes op het scherm.
- **Tekenset voor kleine letters (selectievakje aangevinkt):** Typ de exacte hoofdlettergevoeligheid die u wilt zien. `"hello"` → weergave in kleine letters, `"HELLO"` → weergave in hoofdletters. Vereist een runtime-tekensetwissel voordat het scherm wordt beschreven (gebruik de macro **CHARSET lower**).

**Gegenereerde ASM (hoofdlettermodus, `"HALLO"`):**
```
    LDA #$08      ; 'H' screen code $08
    STA $0400
    LDA #$05      ; 'E' screen code $05
    STA $0401
    ...
```

**Expert syntax:**
```
.text 0, 2, "HELLO"           ; uppercase charset (default)
.text 0, 2, "hello", lower    ; lowercase charset
```

Tekens worden gecodeerd als **schermcodes** (niet PETSCII). **Grootte:** `tekstlengte × 5` bytes (LDA + STA per teken).

---

### STRING

Net zoals **POKE een string** in een willekeurig geheugenadres tijdens runtime. Genereert LDA/STA-paren die de schermcode van elk teken naar opeenvolgende adressen kopiëren.

| Veld                    | Beschrijving                                                                                            |
| ----------------------- | ------------------------------------------------------------------------------------------------------- |
| Tekst                   | De te schrijven tekenreeks                                                                              |
| Adres                   | Doelgeheugenadres — `$C000` hex of een **labelnaam**                                                    |
| Label (optioneel)       | Kent een label toe dat verwijst naar het doeladres.                                                     |
| Verschuiving            | Hexadecimale waarde (00–FF) toegevoegd aan elke byte van de schermcode (bijv. `$80` = omgekeerde video) |
| Kleine letters tekenset | Selectievakje — dezelfde betekenis als TEKST (zie het gedeelte TEKST)                                   |

**Expert syntax:**
```
.string $C000, "HELLO"                  ; uppercase charset (default)
.string $C000, "hello", lower           ; lowercase charset
.string $C000, "HELLO", 80             ; with shift (reverse video)
.string $C000, "hello", 80, lower      ; shift + lowercase
.string $C000, "HELLO" :my_string      ; with macroLabel
```

**Gegenereerde ASM:**
```
    LDA #$08      ; 'H' screen code
    STA $C000
    LDA #$05      ; 'E' screen code
    STA $C001
    ...
```

Tekens worden gecodeerd als **schermcodes** (niet PETSCII). De optionele **Shift**-waarde wordt aan elke byte toegevoegd, bijvoorbeeld `$80` voor omgekeerde video. **Grootte:** `tekstlengte × 5` bytes (één LDA + één STA per teken).

---

### DATA

Net als een **POKE-lus** — schrijft een lijst met ruwe bytes naar een geheugenadres tijdens de uitvoering, één LDA/STA-paar per byte.

| Veld              | Beschrijving                                         |
| ----------------- | ---------------------------------------------------- |
| Bytes             | Door komma's gescheiden byte-waarden                 |
| Adres             | Doelgeheugenadres — `$C000` hex of een **labelnaam** |
| Label (optioneel) | Kent een label toe dat verwijst naar het doeladres.  |

**Expert syntax:**
```
.data $C000, $01, $02, $03          ; hex address
.data my_buf, $01, $02, $03         ; label address
.data $C000, $01, $02, $03 :mydata  ; with macroLabel
```

**Gegenereerde ASM:**
```
    LDA #$01
    STA $C000
    LDA #$02
    STA $C001
    ...
```

**Grootte:** `byte_count × 5` bytes (één LDA + één STA per byte).

---

### RAWBYTES

Net als **DATA die direct in het geheugen wordt geladen** — helemaal geen runtime-code. De bytes zijn aanwezig vanaf het moment dat de PRG wordt geladen, nog voordat je code begint. Gebruik dit voor sprite-data, level-maps, opzoektabellen, alles wat gewoon op een specifiek adres moet staan.

| Veld              | Beschrijving                                         |
| ----------------- | ---------------------------------------------------- |
| Bytes             | Door komma's gescheiden byte-waarden                 |
| Adres             | Doelgeheugenadres — `$C000` hex of een **labelnaam** |
| Label (optioneel) | Kent een label toe dat verwijst naar het doeladres.  |

**Expert syntax:**
```
.rawbytes $C000, $00, $00, $00      ; hex address
.rawbytes sprite_data, $00, $00     ; label address
.rawbytes $0C50, $00, $00 :nev      ; with macroLabel — other code can use LDA nev,X
```

**Grootte in code: ** 0 bytes. De gegevens worden op het opgegeven adres in de uitvoer geplaatst.

> **DATA vs RAWBYTES:** DATA genereert LDA/STA-code die bytes tijdens de uitvoering kopieert (langzamer, maar werkt als de data dynamisch moet zijn). RAWBYTES plaatst de bytes direct — geen code, direct, geen kosten.

---

### RAWTEXT

Net als RAWBYTES, maar dan voor tekst: de tekenreeks wordt gecodeerd als schermcodes en de bytes worden op een vast adres geplaatst met **geen runtimecode**. De tekst is direct in het geheugen beschikbaar zodra de PRG wordt geladen.

| Veld                    | Beschrijving                                                                                            |
| ----------------------- | ------------------------------------------------------------------------------------------------------- |
| Tekst                   | Te coderen tekenreeks                                                                                   |
| Adres                   | Doelgeheugenadres — `$C000` hex of een **labelnaam**                                                    |
| Label (optioneel)       | Kent een label toe dat verwijst naar het doeladres.                                                     |
| Verschuiving            | Hexadecimale waarde (00–FF) toegevoegd aan elke byte van de schermcode (bijv. `$80` = omgekeerde video) |
| Kleine letters tekenset | Selectievakje — dezelfde betekenis als TEKST (zie het gedeelte TEKST)                                   |

**Expert syntax:**
```
.rawtext $C000, "HELLO"                 ; uppercase charset (default)
.rawtext $C000, "hello", lower          ; lowercase charset
.rawtext $C000, "HELLO", 80            ; with shift (reverse video)
.rawtext $C000, "hello", 80, lower     ; shift + lowercase
.rawtext $0400, "HELLO" :my_text       ; with macroLabel
```

**Gegenereerde ASM:**
```
; .rawtext "HELLO" -> $C000
; $C000
    .byte $08, $05, $0C, $0C, $0F   ; H E L L O (uppercase screen codes)

; .rawtext "hello", lower -> $C000
; $C000
    .byte $48, $45, $4C, $4C, $4F   ; h e l l o (lowercase screen codes $41–$5A range)
```

**Grootte in code: ** 0 bytes. De gegevens worden op het opgegeven adres in de uitvoer geplaatst.

> **STRING vs RAWTEXT:**STRING genereert LDA/STA-code die de tekst tijdens runtime kopieert. RAWTEXT bakt de bytes in de PRG tijdens het laden — geen code, geen wachttijd.

---

### PETSCII

Net als **RAWBYTES maar dan voor KERNAL-uitvoer** — codeert de tekenreeks als PETSCII-bytes (compatibel met CHROUT op `$FFD2`) en plaatst deze op een vast adres zonder runtime-code. Gebruik dit wanneer u tekens wilt afdrukken via `JSR $FFD2` in een lus, en merk op dat de nieuwe `PRINT`-macro dezelfde encoder en hetzelfde gedrag van het selectievakje voor kleine letters gebruikt.

> **PETSCII versus schermcodes:** PETSCII en schermcodes zijn twee verschillende coderingen. Schermcode `$01` = letter A; PETSCII `$41` = letter A (via CHROUT). Gebruik PETSCII alleen bij het afdrukken via de KERNAL; gebruik TEXT/STRING/RAWTEXT om direct naar het scherm-RAM te schrijven.

| Veld                   | Beschrijving                                         |
| ---------------------- | ---------------------------------------------------- |
| Tekst                  | Tekst die als PETSCII-bytes moet worden gecodeerd.   |
| Adres                  | Doelgeheugenadres — `$C000` hex of een **labelnaam** |
| Label (optioneel)      | Kent een label toe dat verwijst naar het doeladres.  |
| Kleine letters PETSCII | Selectievakje — zie hieronder                        |

**Tekensetmodi:**

| Modus                                         | Invoer in hoofdletters (`A`–`Z`)                                                                                                              | Invoer in kleine letters (`a`–`z`) |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| **Hoofdletters (standaard, niet aangevinkt)** | `$41`–`$5A` (PETSCII hoofdletters via CHROUT)                                                                                                 | ook afgebeeld op `$41`–`$5A`       |
| **Kleine letters (aangevinkt)**               | Alfabetische letters worden opnieuw toegewezen zodat de zichtbare hoofdlettergevoeligheid consistent blijft in de kleine/hoofdlettertekenset. | Dezelfde regel                     |

**Expert syntax:**
```
.petscii $C000, "HELLO"              ; uppercase PETSCII (default)
.petscii $C000, "hello", lower       ; lowercase PETSCII ($61–$7A)
.petscii $C000, "HELLO", null        ; with null terminator
.petscii $C000, "hello", lower, null ; lowercase + null terminator
.petscii $C000, "HELLO" :my_msg      ; with macroLabel
```

**Gegenereerde bytes (hoofdletters, `"HALLO"`):**
```
; $C000
    .byte $48, $45, $4C, $4C, $4F   ; H E L L O (PETSCII $41–$5A range)
```

**Grootte in code: ** 0 bytes. De gegevens worden op het doeladres geplaatst als een uitgestelde gegevenssectie (zoals RAWBYTES).

**Null-terminator:** Vink het selectievakje *"Voeg `$00` (null-terminator) toe"* aan om automatisch een `$00` byte na de tekst toe te voegen. Ideaal voor null-terminated lussen:

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

**Coderingsregels:**

| Invoer                               | Hoofdlettermodus                     | Kleine lettermodus |
| ------------------------------------ | ------------------------------------ | ------------------ |
| `A`–`Z`                              | `$41`–`$5A`                          | `$61`–`$7A`        |
| `a`–`z`                              | `$41`–`$5A` (gedwongen hoofdletters) | `$41`–`$5A`        |
| Spatie, cijfers, leestekens (32–126) | zoals het is                         | zoals het is       |
| Nieuwe regel                         | `$0D` (RETURN)                       | `$0D`              |
| Ander                                | `$20` (spatie)                       | `$20`              |

> **Tip:** Gebruik PETSCII voor gegevens die via CHROUT worden uitgevoerd (`$FFD2`). Gebruik STRING of RAWTEXT in plaats daarvan om rechtstreeks naar het scherm-RAM te schrijven.

---

### CHARSET

Schakelt de VIC-II-karakter-ROM tussen hoofdletter-/grafische modus (standaard C64) en kleine letter-/hoofdlettermodus door bit 1 van `$D018` tijdens runtime te wijzigen.

| Veld  | Beschrijving                                                                                                                                            |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Modus | **Kleine letters** — schakelt de tekenset voor kleine/hoofdletters in; **Hoofdletters** — herstelt de standaard tekenset voor hoofdletters/afbeeldingen |

**Expert syntax:**
```
.charset lower    ; switch to lowercase charset
.charset upper    ; switch back to uppercase/graphics charset
```

**Gegenereerde ASM:**

Kleine letters-modus:
```
    LDA $D018
    ORA #$02      ; set bit 1 → lowercase/uppercase ROM at $1800
    STA $D018
```

Hoofdlettermodus:
```
    LDA $D018
    AND #$FD      ; clear bit 1 → uppercase/graphics ROM at $1000
    STA $D018
```

**Grootte:** 8 bytes (LDA abs + ORA/AND imm + STA abs).

**Waarom ORA/AND in plaats van een directe schrijfbewerking?** `$D018` regelt ook de locatie van het scherm-RAM (bits 7-4). Door alleen bit 1 te schakelen, blijft de rest van het register behouden.

**Typische workflow:**

```
    CHARSET lower             ; switch to lowercase charset
    TEXT 0, 0, "hello world"  ; [checkbox: Lowercase charset]
    ...
    CHARSET upper             ; restore default when done
```

Of in de expertmodus:
```
.charset lower
.text 0, 0, "hello world", lower
.charset upper
```

In de Expert-modus doorloopt het `.charset`-blok nu ook het keuzemenu voor de modus, zodat de blokpreview en de geëxporteerde broncode op één lijn blijven.

> **Opmerking:** De CHARSET-macro wijzigt alleen de pointer naar het VIC-teken-ROM. Deze roept `$E544` (KERNAL-tekensetinitialisatie) niet aan. In de meeste gevallen is dit voldoende; roep `JSR $E544` alleen eerst aan als u wilt dat de printroutines van de KERNAL de wijziging respecteren.

---

### CHARDEF

Definieert een enkel 8×8 aangepast teken in een op RAM gebaseerde tekenset. Genereert inline runtime-code die 8 bytes kopieert naar `base + index * 8` tijdens de uitvoering — er is geen voorafgaand label of `ORG` nodig.

| Veld          | Beschrijving                                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Tekensetbasis | Basisadres van de RAM-tekenset (standaard `$3800`). Moet uitgelijnd zijn zodat de VIC-II het kan lezen (zie hieronder).  |
| Tekenindex    | Welke tekenpositie moet opnieuw worden gedefinieerd, 0–255. `65` = 'A' in de standaard schermcode-indeling.              |
| 8 bytes       | Door komma's gescheiden bitmaprijen, van boven naar beneden. Bit 7 van elke byte komt overeen met de meest linkse pixel. |

**Expert syntax:**
```
.chardef $3800, 65, $18,$3C,$66,$7E,$66,$66,$66,$00
```

**Gegenereerde ASM (8 × `LDA #b` / `STA-doel+n`, 40 bytes totaal):**
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

**Doeladres:** `$3800 + 65 * 8 = $3A08`. Berekend tijdens het compileren en vastgelegd in de STA-operanden.

**Grootte:** 40 bytes per teken (8 × 5).

**Typische workflow:**
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

**Wanneer CHARDEF gebruiken versus alternatieven:**

| Benadering                       | Gebruik wanneer                                                                                                 |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **CHARDEF**                      | Je hebt een paar aangepaste tekens nodig (bijvoorbeeld 1-20). De uitvoeringskosten bedragen 40 bytes per teken. |
| **RAWBYTES @ $3800**             | Je hebt een volledig aangepaste tekenset (256 tekens). In totaal 2 KB aan gegevens, geen runtime-kopie.         |
| **INCBIN "charset.bin" @ $3800** | Extern tekensetbestand (gemaakt door de tekeneditor). De meest overzichtelijke optie.                           |
| **Tekenset Canvas + INCBIN**     | Een volledige bitmap van 256 tekens, weergegeven als één afbeelding van 128×128 pixels.                         |

> **Uitlijningsherinnering: ** VIC-II verwacht de basis van de tekenset op een veelvoud van `$0800`. Geldige banken: `$0000`, `$0800`, `$1000`, ... , `$3800` (binnen de huidige 16 KB VIC-bank). RAM-tekensets bevinden zich doorgaans op `$2000`, `$2800`, `$3000` of `$3800`.

---

### BOX_HIT

Botsingstest met as-uitgelijnde begrenzingskaders (AABB) tussen twee rechthoeken beschreven door 4-byte zero-page structuren. Retourneert het resultaat in de accumulator: **A = 1** bij overlapping, **A = 0** anders. Pure inline assembly, geen subroutine-aanroep.

| Veld               | Beschrijving                                                                    |
| ------------------ | ------------------------------------------------------------------------------- |
| Postbus 1 ZP-adres | Nulpagina-basis van de 4-byte structuur van het eerste vakje (standaard `$FB`). |
| Box2 ZP-adres      | Nulpagina-basis van de 4-byte structuur van het tweede vak (standaard `$F7`).   |

**Structuurindeling** (4 bytes per vakje, niet-ondertekende 8-bits coördinaten):

| Offset | Veld      |
| ------ | --------- |
| `+0`   | Links     |
| `+1`   | Bovenkant |
| `+2`   | Rechts    |
| `+3`   | Onderkant |

**Expert syntax:**
```
.box_hit $FB, $F7
```

**Gegenereerde ASM (30 bytes, volledig PC-relatief — geen subroutine, geen absolute sprongen):**
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

**Grootte:** 30 bytes.

**Typische workflow:**

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

**Beperkingen:**
- Beide zero-page-adressen moeten `≤ $FC` zijn (elk vakje heeft 4 opeenvolgende bytes nodig: `zp`, `zp+1`, `zp+2`, `zp+3`).
- Coördinaten worden behandeld als **unsigned 8-bit** (0–255). Voor getekende spritecoördinaten buiten dit bereik moet u normaliseren voordat u ze opslaat.
- De twee vakjes kunnen elkaar in de ZP-ruimte overlappen, indien gewenst, maar meestal wilt u 8 afzonderlijke bytes.

**Waarom geen subroutine?** Inline-generatie vermijdt de overhead van JSR/RTS (14+ cycli) en houdt de test actief in de cache voor strakke game-loops. Als je veel paren moet testen, plaats dan handmatig je eigen `JSR box_hit_sub` rond een enkel BOX_HIT-blok.

**Vergelijking met UB's `box_hit()` functie:** Ultimate Basic verpakt dezelfde 6502-logica als een runtimefunctie die een variabele retourneert. In VA plaats je BOX_HIT inline waar je de test nodig hebt; het resultaat bevindt zich in `A`.

---

### INCBIN

Net als **BLOAD in BASIC** — pakt een extern binair bestand (`.bin`, `.prg`, `.sid`, `.raw`) en voegt het direct in de geassembleerde PRG in op het adres dat u opgeeft.

| Veld    | Beschrijving                                                          |
| ------- | --------------------------------------------------------------------- |
| Bestand | Blader om een `.bin`, `.prg`, `.sid` of `.raw` bestand te selecteren. |
| Adres   | Doellaadadres (bijv. `$C000`)                                         |

**Expert syntax:**
```
.incbin "music.bin", $C000
```

**Gegenereerde ASM-opmerking: **
```
    ; INCBIN "music.bin" @ $C000 (2048 bytes)
    .byte $01, $02, ...
```

**Grootte in code: ** 0 bytes (uitgestelde datasectie). De binaire code is ingebed op het opgegeven adres.

---

### SID

Net als **BLOAD voor muziek** — laadt een `.sid`-bestand in je PRG en leest automatisch de Init- en Play-adressen uit de header. Roep Init eenmaal aan bij het opstarten en roep vervolgens Play aan vanuit je IRQ-handler in elk frame.

| Veld                        | Beschrijving                                                                                                                    |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Bestand                     | Blader om een `.sid`-bestand te selecteren                                                                                      |
| Aangepast adres (optioneel) | Overschrijf het standaard laadadres van de SID (bijv. `$1000`). Laat dit veld leeg om het adres uit de SID-header te gebruiken. |

Het blok toont:
- **Titel / Auteur** uit de SID-header
- **Laadadres** — waar de gegevens in het geheugen worden geplaatst (effectief adres na eventuele overschrijving)
- **Init adres** — roep dit aan met JSR om de muziek te initialiseren (aangepast voor verplaatsing als een aangepast adres wordt gebruikt)
- **Speel adres** — roep dit aan met JSR op elk frame in een IRQ-handler (aangepast voor verplaatsing)
- Een **(verplaatst)**-badge verschijnt wanneer een aangepast adres de gegevens verschuift ten opzichte van hun oorspronkelijke positie.

**Expert syntax:**
```
.sid "Ikari_Warriors.sid"
.sid "Ikari_Warriors.sid", $1000
```

**Gegenereerde ASM-opmerking: **
```
    ; SID "Ikari_Warriors.sid" @ $1000  Init:$1000  Play:$1006  (4096 bytes)
```

**Grootte in code: ** 0 bytes inline. Het SID-binair bestand wordt op het opgegeven adres geplaatst als een uitgesteld blok in de PRG.

> **Belangrijk:** De meeste SID-bestanden bevatten hardgecodeerde interne absolute adressen. Deze kunnen alleen worden verplaatst als het hele binaire bestand met dezelfde offset wordt verschoven. Als een SID interne sprongen naar `$10xx` bevat, moet deze op `$1000` blijven staan — het verplaatsen naar een ander adres zal deze interne verwijzingen verbreken.

> **Typisch gebruik:** Plaats een ORG-blok vóór het SID-blok om het adres ervan in te stellen. Roep Init eenmaal aan bij het opstarten en roep vervolgens Play aan voor elk frame vanuit een raster-IRQ-handler.

---

### INCLUDE

Net als **MERGE in BASIC** — laadt een ander bestand in en breidt de blokken ervan inline uit op deze positie. Perfect voor herbruikbare subroutinebibliotheken. De opgenomen blokken zijn alleen-lezen in het huidige project.

Er worden twee bestandstypen ondersteund:
- **Visual Assembler-project** (`.json`) — de blokken van het project worden ongewijzigd ingevoegd.
- **Platte assembly-broncode** (`.inc`, `.asm`, `.s`) — het bestand wordt als tekst gelezen en op dezelfde manier geparseerd als in de expertmodus. Telkens wanneer u compileert, wordt het bestand opnieuw van de schijf gelezen (bron van waarheid = het bestand), zodat u het extern kunt bewerken met elke editor.

| Veld                  | Beschrijving                                                                                                                                                                                                                                                                                                                     |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bestand               | Blader om een `.json`-project of een `.inc`/`.asm`/`.s`-assemblybroncode te selecteren.                                                                                                                                                                                                                                          |
| Laadadres (optioneel) | Indien ingesteld (hexadecimaal, bijv. `C000`), worden de opgenomen blokken op dat adres geplaatst. Een synthetisch `ORG`-blok wordt ervoor ingevoegd, waardoor elk ORG-blok in het opgenomen bestand wordt overschreven. Laat dit veld leeg om de plaatsing te laten bepalen door de ORG-blokken van het opgenomen bestand zelf. |

**Expertmodus-syntaxis:**
```
.include "library.json"
.include "macros.inc", $1500
.include "sprites.asm"
```

- De bestandsextensie ** is vereist in de expertmodus ** — een kale naam zoals `.include "macros" ` wordt behandeld als `.include "macros.json" `.
- Padresolutie: eerst wordt geprobeerd om het pad naast het projectbestand te vinden (relatief), daarna wordt teruggevallen op de meegeleverde map `samples/` van de app.

**Gegenereerde ASM (geen adresoverride):**
```
    ; .include "library.json" — 12 block(s)
    ... (expanded blocks follow)
```

**Gegenereerde ASM (met laadadres `C000`):**
```
    ; .include "library.json" @ $C000 — 12 block(s)
    *=$C000
    ... (expanded blocks follow)
```

> **Tip:** Gebruik INCLUDE om herbruikbare subroutinebibliotheken te maken die u in verschillende projecten kunt delen. `.inc`/`.asm`/`.s`-bestanden zijn het meest geschikt wanneer u de bibliotheek wilt bewerken in een eenvoudige teksteditor of deze wilt delen met andere 6502-assemblers; `.json` wanneer de bibliotheek in Visual Assembler zelf is gemaakt. Stel een laadadres in wanneer de bibliotheek geen eigen ORG heeft, of wanneer u de standaardplaatsing wilt overschrijven.

---

### TABLE

Net als **DIM op een specifiek adres** — benoemt een opzoektabel en stelt de locatie ervan in het geheugen in. Plaats BYTE-, WORD- of FILL-blokken erachter om de inhoud van de tabel te definiëren.

| Veld  | Beschrijving                                            |
| ----- | ------------------------------------------------------- |
| Naam  | Label-identificatie voor de tabel (bijv. `color_table`) |
| Adres | Vast adres waar de tabel begint (bijv. `$C000`)         |

**Expert syntax:**
```
.table color_table, $C000
```

**Gegenereerde ASM:**
```
color_table:
```

De programmateller springt naar het opgegeven adres. Plaats BYTE/WORD/FILL-blokken na TABLE om de inhoud te vullen.

**Grootte:** 0 bytes.

---

### ORG

Hiermee wordt bepaald waar in het geheugen het programma (of een gedeelte ervan) wordt geplaatst — vergelijkbaar met het kiezen van een startadres voordat machinecode wordt ingevoerd. Elk programma heeft minstens één ORG nodig. De standaard startlocatie voor C64 BASIC is `$0801`.

| Veld      | Beschrijving                                                                     |
| --------- | -------------------------------------------------------------------------------- |
| Adres     | Het nieuwe oorsprongsadres (bijv. `0801` in hexadecimaal, of `2049` in decimaal) |
| HEX / DEC | Schakel de adresinvoer tussen hexadecimale en decimale weergave.                 |

**Expert syntax:**
```
* = $C000
```

**Gegenereerde ASM:**
```
* = $C000
```

**Grootte:** 0 bytes. Het ORG-blok zelf genereert geen machinecode.

Elk ORG-blok begint een nieuwe sectie. De blokken die volgen, worden vanaf dat adres samengesteld. Wanneer je de PRG exporteert, worden alle secties samengevoegd tot één bestand; de gaten tussen secties worden opgevuld met nullen.

**Voorbeeld — code op `$0801`, gegevenstabel op `$C000`:**
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

> **Tip:** Elk programma moet beginnen met een ORG-blok. Het typische startadres voor een C64 BASIC-laadbaar programma is `$0801` (2049 decimaal). Wanneer **BASIC SYS stub** is ingeschakeld, voegt de assembler een korte BASIC-regel toe op `$0801` en begint uw code op `$080D`.

---

### LOOP / NEXT

Net als **`FOR X=N TO 1 STEP -1 : ... : NEXT X`** in BASIC — telt af van N naar 1 met behulp van het X- of Y-register. Plaats een LOOP-blok, zet je instructies ertussen en NEXT, en de lus herhaalt zich automatisch het juiste aantal keren.

#### LOOP

| Veld     | Beschrijving                                                            |
| -------- | ----------------------------------------------------------------------- |
| Register | `X` of `Y` — het tellerregister                                         |
| Graaf    | Aantal iteraties van de lus (hexadecimaal of decimaal, bijv. `0A` = 10) |
| Label    | Automatisch gegenereerd luslabel (bijv. `loop0`)                        |

**Expert syntax:**
```
.loop X, 10, loop0
```

**Gegenereerde ASM:**
```
    LDX #$0A
loop0:
```

**Grootte:** 2 bytes (LD_ opcode + directe operand).

#### NEXT

| Veld     | Beschrijving                                |
| -------- | ------------------------------------------- |
| Register | Automatisch gekoppeld aan het LOOP-register |
| Label    | Automatisch gekoppeld aan het LOOP-label    |

**Expert syntax:**
```
.next loop0
```

**Gegenereerde ASM:**
```
    DEX
    BNE loop0
```

**Grootte:** 3 bytes (DEX + BNE + vertakkingsoffset).

**Voorbeeld — wis 10 schermcellen:**
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

Net als **`FOR X=0 TO N-1 : ... : NEXT X`** in BASIC — telt *up* vanaf 0. Ideaal wanneer je een voorwaartse index nodig hebt, bijvoorbeeld om door een tekenreeks of een array te stappen.

#### FOR

| Veld     | Beschrijving                                                                          |
| -------- | ------------------------------------------------------------------------------------- |
| Register | `X` of `Y` — het tellerregister                                                       |
| Graaf    | Luslimiet (hexadecimaal of decimaal, bijv. `$12` = 18). X/Y loopt van 0 tot limiet-1. |
| Label    | Automatisch gegenereerd luslabel (bijv. `for0`)                                       |

**Expert syntax:**
```
.for X, $12, for0
```

**Gegenereerde ASM:**
```
    LDX #$00
for0:
```

**Grootte:** 2 bytes (LD_ opcode + `#$00`).

#### ENDF

| Veld     | Beschrijving                                 |
| -------- | -------------------------------------------- |
| Register | Automatisch gekoppeld aan het FOR-register   |
| Label    | Automatisch gekoppeld aan het FOR-label      |
| Graaf    | Automatisch gekopieerd van de gekoppelde FOR |

**Expert syntax:**
```
.endf for0
```

**Gegenereerde ASM:**
```
    INX
    CPX #$12
    BNE for0
```

**Grootte:** 5 bytes (IN_ + CP_ #imm + BNE-offset).

**Voorbeeld — print een null-terminated string:**
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

> **LOOP vs FOR:** LOOP telt af (N→1) — goed voor vertragingen, opvullingen, pixellussen. FOR telt op (0→N) — goed voor toegang tot strings/arrays. Beide kunnen X of Y gebruiken.

---

### PUSH / PULL

Net als ** waarbij variabelen worden opgeslagen vóór een GOSUB en hersteld na ** — maar dan met gebruik van de 6502 hardwarestack. Als een subroutine A, X of Y gebruikt, moet deze worden omwikkeld met PUSH en PULL, zodat de registers van de aanroepende code behouden blijven.

#### PUSH

Plaatst een of meer registers op de stack. De volgorde is altijd A → X → Y (binnenste eerst).

| Veld      | Beschrijving                                            |
| --------- | ------------------------------------------------------- |
| Registers | Elke combinatie: `A`, `X`, `Y`, `AX`, `AY`, `XY`, `AXY` |

**Expert syntax:**
```
.push AXY
```

**Gegenereerde ASM (voorbeeld: `AX`):**
```
    PHA
    TXA
    PHA
```

**Grootte:** 1 byte voor A (`PHA`), 2 bytes voor X of Y (overdracht + push).

#### PULL

Herstelt registers van de stack in **omgekeerde volgorde** (Y → X → A).

| Veld      | Beschrijving                                                              |
| --------- | ------------------------------------------------------------------------- |
| Registers | Hetzelfde als PUSH — moet overeenkomen met het corresponderende PUSH-blok |

**Expert syntax:**
```
.pull AXY
```

**Gegenereerde ASM (voorbeeld: `AX`):**
```
    PLA
    TAX
    PLA
```

> **Regel:** PUSH en PULL moeten altijd dezelfde registerset gebruiken****. `PUSH AX` → `PULL AX` (intern herstelt in omgekeerde volgorde: eerst X, dan A).

---

### END / RTS alias

Net als **RTS met een vriendelijkere macronaam ** — `.end` genereert een enkele `RTS` byte en gedraagt zich als een korte subroutine-terminator in de expertmodus.

**Expert syntax:**
```
.end
```

**Gegenereerde ASM:**
```
    RTS
```

**Grootte:** 1 byte.

Gebruik dit wanneer u een markering voor het einde van een subroutine wilt die meer op een macro lijkt dan op een gewone instructie.

---

### MACRO / ENDM / INVOKE

Net als ** een benoemde GOSUB met parameters** — definieer een herbruikbaar stuk code één keer (MACRO…ENDM), en roep het vervolgens overal aan met INVOKE. Geef elke keer andere argumentwaarden door in plaats van blokken te kopiëren en te plakken.

#### MACRO (definition start)

| Veld       | Beschrijving                                                                        |
| ---------- | ----------------------------------------------------------------------------------- |
| Naam       | Identificatiecode voor de macro (bijv. `setColor`)                                  |
| Parameters | Optionele parameternamen, gescheiden door komma's (bijv. `color` of `color, count`) |

Markeer het begin van een macrodefinitie. Blokken tussen MACRO en ENDM vormen de body van de macro — ze genereren geen code waar de definitie zich bevindt. Gebruik {paramName} als placeholder voor argumenten.

**Gegenereerde ASM:**
```
; .MACRO setColor (color)
    ... (body blocks)
; .ENDM
```

**Expertmodus syntaxis:**
```
.macro setColor color
    LDA {color}
    STA $D020
.endm
```

#### ENDM (definition end)

Sluit de huidige macrodefinitie. Geen velden.

#### INVOKE

Roept op deze positie een gedefinieerde macro aan en vervangt de opgegeven argumentwaarden door de placeholders `{paramName}` in de body.

| Veld       | Beschrijving                                                                                               |
| ---------- | ---------------------------------------------------------------------------------------------------------- |
| Macronaam  | Selecteer een macro uit het keuzemenu.                                                                     |
| Argumenten | Door komma's gescheiden argumentwaarden die overeenkomen met de parameterlijst van de macro (bijv. `#$07`) |

**Gegenereerde ASM:**
```
; .invoke setColor(#$07)
    LDA #$07
    STA $D020
```

**Expertmodus syntaxis:**
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

De macrobody wordt inline uitgebreid, waarbij `{paramName}` wordt vervangen door de daadwerkelijke argumenten. De door spaties gescheiden vorm (`.invoke setColor #$07`) wordt ook geaccepteerd.

**Argumenttypen:**
- **Numeriek**: `#$07`, `$10`, `255` — hexadecimale of decimale waarden
- **Tekstreeksen**: `"Hallo, wereld!"` — geciteerde tekenreeksen; komma's binnen aanhalingstekens worden behandeld als onderdeel van de tekst, niet als argumentscheidingstekens
- **Gemengd**: `#$07, "hallo", $20` — elke combinatie

> **Tip:** Define macros at the top (or bottom) of your program, then INVOKE them wherever needed. Macros can be invoked multiple times with different arguments.

---

### REGION / ENDREGION

Puur visuele groepering — **nul bytes**, geen effect op de geassembleerde code. Net zoals het inklappen van een gedeelte van een BASIC-programma in een benoemd blok, zodat je het kunt inklappen en je op iets anders kunt concentreren.

| Veld      | Beschrijving                                                                |
| --------- | --------------------------------------------------------------------------- |
| Regionaam | Vrije tekstlabel voor de sectie (bijv. `init`, `game_loop`, `sprite_setup`) |

**Expert syntax:**
```
.region init
    ; blocks...
.endregion
```

**Besturingselementen op de REGION-blokkop (altijd zichtbaar):**
- **▸ / ▾ toggle** — vouwt het hele gebied samen of vouwt het uit. Wanneer het is samengevouwen, worden alle blokken tussen REGION en ENDREGION verborgen.
- **↕ Alles uitbreiden** — maakt elk afzonderlijk samengevouwen blok binnen het gebied weer open en breidt het gebied zelf uit indien nodig.
- **⦵ Selecteren in ASM** — markeert het volledige codebereik van de regio in de ASM-weergave (van `; ===[ naam ]===` tot `; ===[/naam]===`) en scrollt ernaartoe. Schakelt automatisch over naar het ASM-tabblad als dit momenteel niet zichtbaar is.
- **⧉ Regio kopiëren** — kopieert het REGION-blok, alle onderliggende blokken en het bijbehorende ENDREGION naar het klembord. Een knipperend ✓-symbool bevestigt het kopiëren.
- **⎘ Plak regio** — voegt de gekopieerde regio in als een nieuwe regio direct na de ENDREGION van de huidige regio en scrollt ernaartoe. De knop is gedimd totdat een regio is gekopieerd.

**Gegenereerde ASM:**
```
; region init
    SEI
    LDA #$00
    STA $D020
; endregion init
```

**Grootte:** 0 bytes voor zowel REGION als ENDREGION.

**Voorbeeldworkflow:**
1. Voeg een `REGION`-blok toe en stel de regionaam in op `init`.
2. Voeg uw initialisatie-instructies eronder toe.
3. Voeg een `ENDREGION`-blok toe om de sectie te sluiten.
4. Click ▸ on the REGION to collapse the whole section into one line while working on other parts of the program.

> **Opmerking:** Regio's kunnen **genest** in elkaar zijn. Elke ENDREGION sluit de dichtstbijzijnde open REGION. Geen effect op de geassembleerde uitvoer.

---

### DEFINE / IF / ELSE / ENDIF

Net als een schakelaar leest de assembler ** — `DEFINE DEBUG` een symbool, waarna elk `IF DEBUG`-blok wordt opgenomen en de `ELSE`-tak wordt overgeslagen. Verwijder het DEFINE-blok en het IF-blok verdwijnt uit de uitvoer. Het is niet nodig om code te verwijderen voor release-builds.

#### DEFINE

| Veld    | Beschrijving                                                                                        |
| ------- | --------------------------------------------------------------------------------------------------- |
| Symbool | Een of meer door komma's gescheiden identificatoren om te activeren (bijv. `DEBUG` of `DEBUG, PAL`) |

**Expert syntax:**
```
.define DEBUG, PAL
```

**Gegenereerde ASM:**
```
; .DEFINE DEBUG
; .DEFINE DEBUG, PAL
```

Een `DEFINE`-blok kan meerdere symbolen tegelijk activeren (gescheiden door komma's). Plaats DEFINE-blokken bovenaan uw programma. Het verwijderen van het blok deactiveert direct alle symbolen.

#### IF

| Veld       | Beschrijving                                                                                  |
| ---------- | --------------------------------------------------------------------------------------------- |
| Voorwaarde | Identificatiecode om te testen (moet overeenkomen met een `DEFINE`-symbool om actief te zijn) |

**Expert syntax:**
```
.if DEBUG
```

**Gegenereerde ASM:**
```
; .IF DEBUG
```

Blokken tussen `IF` en `ENDIF` (of `ELSE`) worden wel of niet opgenomen, afhankelijk van of het voorwaardesymbool een overeenkomende `DEFINE` in het programma heeft. Overgeslagen blokken verschijnen als `; [IF skipped] …` commentaren en genereren **nul bytes**.

#### ELSE

Geen velden. Markeer de alternatieve tak — samengesteld wanneer de `IF`-conditie *not* actief is.

**Expert syntax:**
```
.else
```

**Gegenereerde ASM:**
```
; .ELSE
```

#### ENDIF

Geen velden. Sluit het voorwaardelijke blok.

**Expert syntax:**
```
.endif
```

**Gegenereerde ASM:**
```
; .ENDIF
```

**Grootte:** 0 bytes voor alle vier de blokken. Alleen de inhoud *tussen* telt.

**Voorbeeld — debug-randflits, release-build slaat dit over:**
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

**Voorbeeld — meerdere symbolen in één DEFINE-blok:**
```
; .DEFINE DEBUG, PAL

; .IF PAL
    LDA #$xx        ; PAL timing constant
; .ELSE
    LDA #$xx        ; NTSC timing constant
; .ENDIF
```

Geneste `IF`-blokken worden ondersteund. Als een buitenste blok wordt overgeslagen, worden binnenste blokken ook overgeslagen.

> **Opmerking:** Dit is een voorwaarde die tijdens het compileren wordt afgehandeld. Voor runtime vergelijkings-/vertakkingssyntax, zie **Runtime IF / ELSE / ENDIF** hieronder.

### .ASSERT

*(Nieuw in 2.3.9.)* Een **controle tijdens het compileren**. `.assert` evalueert een expressie tijdens het assembleren; als deze onwaar is (`0`), stopt de build met een duidelijke foutmelding die de werkelijke waarde bevat. Als deze waar is (niet nul), wordt er niets weergegeven.

| Veld        | Beschrijving                                                                                                                                                 |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Uitdrukking | Elke assembler-expressie: labels, `CONST`s, `*` (programmateller), rekenkundige bewerkingen en vergelijkingen (`&lt;`, `&lt;=`, `&gt;`, `&gt;=`, `==`, `!=`) |
| Bericht     | Optionele tekst die aan de foutmelding kan worden toegevoegd                                                                                                 |

**Expert syntax:**
```
.assert spriteData < $C000
.assert * < $A000
.assert end - start <= 256, "sprite table overflowed one page"
```

**Gedrag:**

- **Grootte:** 0 bytes.
- Een onjuiste bewering zorgt ervoor dat de assemblage wordt afgebroken: `` `.assert end - start &lt;= 256` is onjuist (waarde: 0). spritetabel loopt over één pagina ``
- Een bewering die niet kan worden geëvalueerd (ongedefinieerd label, enz.) mislukt ook, met *"kan niet worden geëvalueerd tijdens de assemblage"*.
- Vergelijkingen leveren `1` / `0` op; plaats `.assert` ergens in de programmastroom — het wordt gecontroleerd op het adres waar het zich bevindt, dus `.assert * &lt; $D000` test de huidige uitvoerpositie.

**Voorbeeld — bescherm een spriteblok tegen een paginaoverschrijding:**
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

Zoals **een benoemde variabele die nooit verandert** — `SCREEN = $0400`. Gebruik de naam in plaats van overal ruwe adressen te typen, waardoor de code later gemakkelijker te lezen en te wijzigen is.

| Veld    | Beschrijving                                                                                                                  |
| ------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Naam    | Identificatiecode voor de constante (bijv. `SCREEN`)                                                                          |
| Waarde  | Numerieke waarde in de geselecteerde basis (bijv. `0400` in HEX = adres $0400), of een PC-relatieve expressie (zie hieronder) |
| Formaat | HEX of DEC — bepaalt hoe de waarde wordt ingevoerd en weergegeven.                                                            |

**Expert syntax:**
```
.const SCREEN = $0400
.const FRAMES_1S = 60
```

**Gegenereerde ASM:**
```
; .CONST SCREEN = $0400
```

De constante naam verschijnt in het **label picker** dropdownmenu op instructieblokken — klik er gewoon op om deze in te voegen.

**PC-relatieve expressies (`*+N` / `*-N`):**

Het waardeveld accepteert ook `*+N` of `*-N`, waarbij `*` het compileeradres is van het CONST-blok zelf. Dit wordt gebruikt om een benoemde alias te creëren voor een byte binnen een nabijgelegen instructie — het klassieke patroon van zelfmodificerende code:

```
CONST op = *+1      ; op → address of the immediate operand of the next LDA
LDA #$00            ; $00 will be patched at runtime
...
STA op              ; overwrites the #$00 byte → LDA reads the new value next time
```

De CONST zendt 0 bytes uit; het label wordt tijdens het compileren opgelost naar `huidig_adres + 1`.

** Rekenkundige uitdrukkingen: **

Het waardeveld accepteert algemene rekenkundige bewerkingen, waaronder verwijzingen naar eerder gedefinieerde CONST-namen, hexadecimale/binaire letterlijke waarden en ingebouwde wiskundige functies:

```
.const SCREEN      = $0400
.const SCREEN_END  = SCREEN + 40*25   ; 1000 bytes later
.const COLOR_RAM   = $D800
.const MID_X       = 160
.const SIN_TABLE   = round(sin(PI/8) * 127)   ; pre-computed sine value
```

**Ingebouwde functies:** `sin()`, `cos()`, `round()`, `max(a,b)`, `min(a,b)`, `abs()`, constant `PI`

Operatoren: `+ - * /` Literalen: `$FF` (hex), `%10110000` (binair) Laagste/hoogste byte: `lo(expr)`, `hi(expr)`

**Grootte:** 0 bytes.

---

### VAR

Net als **CONST, maar automatisch toegewezen** — `VAR` reserveert zero-page-geheugen voor een label zonder dat u het adres hoeft in te typen. Gebruik het voor tellers, pointers en kortstondige statusinformatie die in ZP thuishoort.

| Veld             | Beschrijving                                                  |
| ---------------- | ------------------------------------------------------------- |
| Naam             | Variabelenaam / label                                         |
| Maat (optioneel) | Aantal te reserveren bytes. Laat dit getal weg voor één byte. |

**Expert syntax:**
```
.var counter
.var timer, 2
.var lives
```

**Praktisch voorbeeld:**
```
.region Vars
.var counter
.var timer, 2
.endregion

LDA #$00
STA counter
```

**Gegenereerde ASM:**
```
; .var counter
```

**Grootte:** 1 byte standaard, of `N` bytes wanneer grootte is gespecificeerd.

De allocator doorloopt een configureerbare zero-page cursor (`$02` tot `$FE`) en wijst de eerstvolgende vrije plek toe. Als het aangevraagde gebied een reeds gebruikt label overlapt, geeft de compiler een waarschuwing.

---

### Runtime IF / ELSE / ENDIF

Net als **een echte branch template** — werkt deze versie tijdens runtime, niet tijdens compilatie. Het vergelijkt `A`, `X` of `Y` met een directe waarde en genereert de juiste `CMP` / `CPX` / `CPY` + branchsequentie voor u.

| Veld     | Beschrijving                                 |
| -------- | -------------------------------------------- |
| Register | `A`, `X`, of `Y`                             |
| Operator | `==`, `!=`, `&lt;`, `&lt;=`, `&gt;`, `&gt;=` |
| Waarde   | Directe waarde in HEX- of DEC-formaat        |

**Expert syntax:**
```
.if A == #$10
    LDA #$07
.else
    LDA #$0F
.endif
```

**Grootte:** Afhankelijk van de gekozen takken en vergelijkingsvorm.

De vergelijking is standaard zonder teken. Voor `&lt;=` en `&gt;` wordt de macro uitgebreid naar de kortste equivalente vertakkingsketen voor het geselecteerde register.

---

### WHILE / ENDW

Zoals **een runtime-lus met een test bovenaan** — de body wordt uitgevoerd zolang de voorwaarde waar blijft.

| Veld     | Beschrijving                                 |
| -------- | -------------------------------------------- |
| Register | `A`, `X`, of `Y`                             |
| Operator | `==`, `!=`, `&lt;`, `&lt;=`, `&gt;`, `&gt;=` |
| Waarde   | Directe waarde in HEX- of DEC-formaat        |

**Expert syntax:**
```
.while A != #$00
    JSR getchar
.endw
```

**Grootte:** Afhankelijk van de lusbody en de vergelijkingsvorm.

Gebruik `WHILE` wanneer de lus mogelijk eindigt voordat de eerste iteratie is voltooid. Dit is de runtime-tegenhanger van de op telling gebaseerde `LOOP / NEXT` helper.

---

### REPEAT / UNTIL

Zoals **een runtime-lus met een test onderaan** — de body wordt altijd minstens één keer uitgevoerd, waarna de voorwaarde bepaalt of er gestopt moet worden.

| Veld     | Beschrijving                                 |
| -------- | -------------------------------------------- |
| Register | `A`, `X`, of `Y`                             |
| Operator | `==`, `!=`, `&lt;`, `&lt;=`, `&gt;`, `&gt;=` |
| Waarde   | Directe waarde in HEX- of DEC-formaat        |

**Expert syntax:**
```
.repeat
    JSR getchar
.until A == #$00
```

**Grootte:** Afhankelijk van de lusbody en de vergelijkingsvorm.

Gebruik `REPEAT / UNTIL` als je wilt dat de body minstens één keer wordt uitgevoerd voordat de exit-controle plaatsvindt.

---

### MEMCPY / MEMSET

Net als **kleine geheugenroutines waar je constant naar grijpt** — `MEMCPY` kopieert een aaneengesloten blok, `MEMSET` vult een bereik met één byte.

| Macro    | Velden                  |
| -------- | ----------------------- |
| `MEMCPY` | `src`, `dst`, `size`    |
| `MEMSET` | `addr`, `value`, `size` |

**Expert syntax:**
```
.memcpy src=$C000, dst=$D000, size=$0100
.memset addr=$0400, value=#$20, size=$03E8
```

**Gegenereerde ASM:** inline kopieer-/vullussen, gekozen om te voldoen aan de gevraagde grootte.

Groottes tot 256 bytes gebruiken een korte 8-bits lus. Grotere groottes schakelen automatisch over naar een 16-bits teller.

---

### PRINT / PRINT_CHAR / PRINT_HEX / CLEAR_SCREEN / WAIT_KEY / DELAY / SET_BORDER / SET_BG

#### PRINT

Net als **PETSCII-uitvoer zonder de boilerplate** — print een tekenreeks via `CHROUT` met dezelfde behandeling van hoofdletters en kleine letters als het PETSCII-blok. Het selectievakje voor kleine letters wordt gedeeld met de PETSCII-encoder, zodat het tekstpad consistent blijft.

**Expert syntax:**
```
.print "HELLO"
.print "hello", lower
```

#### PRINT_CHAR

Print één PETSCII-byte met behulp van een numerieke code en verzendt deze via `CHROUT`. De waarde kan ook een benoemde constante of label zijn die tijdens het assembleren wordt omgezet in een byte, zowel in blokmodus als in expertmodus.

**Expert syntax:**
```
.print_char 65
.print_char $41
.print_char color
```

#### PRINT_HEX

Drukt een 8-bits waarde af als hexadecimale tekst via het normale KERNAL-uitvoerpad.

**Expert syntax:**
```
.print_hex A
```

#### CLEAR_SCREEN

Sneltoets voor de standaard C64-code om het scherm te wissen.

**Expert syntax:**
```
.clear_screen
```

#### WAIT_KEY

Wacht tot er een toets wordt ingedrukt, zodat je de `GETIN`-lus niet elke keer handmatig hoeft te genereren.

**Expert syntax:**
```
.wait_key
```

#### DELAY

Wacht het gevraagde aantal frames af via een gedeelde hulpfunctie. Gebruik dit voor korte pauzes en timingproblemen wanneer een volledige, op maat gemaakte lus overbodig zou zijn. Het aantal frames kan een ruw getal zijn of een benoemde constante, en `.wait` is gewoon een alias van `.delay`.

**Expert syntax:**
```
.delay 29
.wait 29
.delay frames=FRAMES_1S
```

In de blokmodus gebruikt het vertragingsveld een compacte constante picker wanneer een symbolische waarde beschikbaar is, zodat u de naam niet elke keer handmatig hoeft in te typen.

#### SET_BORDER / SET_BG

Handige wrappers voor de VIC-II-kleurregisters. De kleurwaarde kan een ruw getal zijn of een benoemde constante die wordt opgelost naar 0-15. Zowel de blokmodus als de expertmodus accepteren hier symbolische constante namen.

**Expert syntax:**
```
.set_border 6
.set_bg 0
.set_border color
.set_bg color
```

**Grootte:** Elke helper wordt uitgebreid tot een kleine registerschrijfsequentie of een korte KERNAL-aanroep.

In de blokmodus gebruiken deze velden ook de constante picker, waardoor de symbolische waarde zichtbaar blijft in plaats van te worden vervangen door een exact getal.

---

### IRQ_SETUP

Hiermee wordt in één stap een raster-IRQ-handler ingesteld. De macro schrijft de IRQ-vector, schakelt raster-IRQ's in, stelt de lijn in, schakelt de algemene CIA-IRQ-bronnen uit en keert terug naar de normale uitvoering met `CLI`.

| Veld    | Beschrijving                                         |
| ------- | ---------------------------------------------------- |
| Handler | IRQ-routinelabel (bijv. `my_irq`)                    |
| Raster  | Rasterlijn in hexadecimaal of decimaal (bijv. `$FA`) |

**Expert syntax:**
```
.irq_setup handler=my_irq, raster=$FA
```

**Grootte:** Een korte instelreeks; de exacte lengte is afhankelijk van de geselecteerde rasterlijn.

Gebruik dit wanneer u de standaard "SEI / install handler / enable IRQ / CLI"-opdracht wilt uitvoeren zonder deze door het hele programma te verspreiden.

---

### RAND

Net als ** een kleine ingebouwde PRNG** — retourneert een 8-bits pseudo-willekeurige waarde uit een compacte seed van nul pagina's.

| Veld | Beschrijving                                                     |
| ---- | ---------------------------------------------------------------- |
| Zaad | Optionele seed-byte of label voor de nulpagina (standaard `$FB`) |

**Expert syntax:**
```
.rand
```

**Grootte:** Een handvol bytes, afhankelijk van het gekozen implementatiepad.

De generator is bedoeld voor gameplay, effectvariatie en snelle testdata. Hij is bewust klein gehouden in plaats van cryptografisch geavanceerd.

---

<a id="sprite_init"></a>
### SPRITE_INIT

Hiermee wordt in één blok een VIC-II-sprite ingesteld — in plaats van ~6 POKE-instructies in BASIC te schrijven, hoeft u alleen de velden in te vullen. De datapointers van de sprite worden ingesteld, de sprite wordt ingeschakeld, de meerkleurenmodus wordt optioneel geactiveerd en de kleur wordt ingesteld.

| Veld           | Beschrijving                                                            |
| -------------- | ----------------------------------------------------------------------- |
| Sprite #       | Spritenummer 0–7                                                        |
| Kleur          | Kleurindex 0–15 (C64-palet)                                             |
| Gegevenspagina | Sprite-dataadres / 64 (bijv. `$21` als de data zich bevindt op `$0840`) |
| Veelkleurig    | Schakelt de meerkleurige bit van de sprite in of uit (`$D01C`)          |

**Expert syntax:**
```
.sprite_init 0, 7, $21
.sprite_init 0, 7, $21, multicolor
.sprite_init 0, 7, $21, mono
```

**Gegenereerde ASM:**
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

**Grootte:** 26 bytes.

> **Sprite-gegevenspagina:** `data_adres ÷ 64`. Met de standaard BASIC SYS-stub plaatst `ALIGN 64` na `JMP main` spritegegevens op `$0840` → pagina = `$21`.

---

<a id="sprite_pos"></a>
### SPRITE_POS

Net als **`POKE 53248, x : POKE 53249, y`** in BASIC, stelt dit de startpositie van een sprite in. De coördinaten worden tijdens het assembleren ingebouwd en de velden accepteren constanten in de blokmodus; voor animatie kunt u `INC`/`DEC` rechtstreeks op het sprite-register gebruiken.

| Veld     | Beschrijving              |
| -------- | ------------------------- |
| Sprite # | Spritenummer 0–7          |
| X        | Horizontale positie 0–319 |
| Y        | Verticale positie 0–255   |

**Expert syntax:**
```
.sprite_pos 0, 152, 100
```

**Gegenereerde ASM (voorbeeld: sprite 0, X=152, Y=100):**
```
    LDA #$98        ; X low byte
    STA $D000       ; sprite 0 X register
    LDA $D010
    AND #$FE        ; clear X MSB for sprite 0 (X ≤ 255)
    STA $D010
    LDA #$64        ; Y = 100
    STA $D001       ; sprite 0 Y register
```

Voor X > 255 stelt de macro de overeenkomstige bit in `$D010` in in plaats van deze te wissen.

**Grootte:** 18 bytes.

> **Opmerking:** `SPRITE_POS` bakt de X/Y in de code (`LDA #$xx`). Om een sprite tijdens runtime te animeren, gebruik `INC $D000` / `DEC $D000` — zie het `sprite-macro-demo` voorbeeld.

---

<a id="wait_raster"></a>
### WAIT_RASTER

Wacht tot de elektronenbundel van de VIC-II een specifieke scanlijn bereikt — vergelijkbaar met synchronisatie met een tv-beeld. Plaats dit bovenaan je gameloop om sprite tearing te voorkomen. Geen JSR, geen label nodig.

| Veld       | Beschrijving                                                   |
| ---------- | -------------------------------------------------------------- |
| Rasterlijn | Doelrasterlijn in hexadecimale notatie (bijv. `FF` = lijn 255) |

**Expert syntax:**
```
.wait_raster $FF
```

**Gegenereerde ASM:**
```
wait:
    LDA $D012       ; current raster line
    CMP #$FF        ; target line
    BNE wait        ; loop back (-7 bytes)
```

**Grootte:** 7 bytes (de `BNE` offset `$F9` = −7 wijst altijd terug naar de `LDA`).

> **Tip:** Plaats `WAIT_RASTER` bovenaan je gameloop om te synchroniseren met het scherm en sprite tearing te voorkomen.

---

### JOYSTICK

Het is vergelijkbaar met het lezen van **`PEEK($DC00)`** en vervolgens het POKE-proces om de spritepositie aan te passen — maar dan in één blok. Het leest één CIA-joystickpoort en past de X/Y-registers van een sprite dienovereenkomstig aan. Volledig inline, geen JSR nodig.

| Veld     | Beschrijving                                                      |
| -------- | ----------------------------------------------------------------- |
| Haven    | `1` = poort 1 (`$DC01`) of `2` = poort 2 (`$DC00`)                |
| Sprite # | Spritenummer 0–7 (bepaalt welk X/Y-registerpaar wordt bijgewerkt) |

**Expert syntax:**
```
.joystick 2, 0
```

**Gegenereerde ASM (poort 2, sprite 0):**
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

**Joystick bitmap (actief-LAAG — bit = 0 betekent ingedrukt):**

| Beetje | Richting | CIA-register                             |
| ------ | -------- | ---------------------------------------- |
| 0      | Omhoog   | $DC00 (poort 2) / $DC01 (poort 1)        |
| 1      | Omlaag   |                                          |
| 2      | Links    |                                          |
| 3      | Rechts   |                                          |
| 4      | Vuur     | (wordt niet door deze macro afgehandeld) |

**Grootte:** 27 bytes. De `BCS`-offset is altijd `+3` (slaat de volgende 3-byte `DEC`/`INC abs`-instructie over).

> **Typisch gebruik:** Plaats binnen een `gameloop` label met `WAIT_RASTER` eerst:
> ```
> gameloop:
>     WAIT_RASTER ($FF)
>     JOYSTICK (port=2, sprite=0)
>     JMP gameloop
> ```

---

<a id="mouse"></a>
### MOUSE

Leest een proportionele muis van een Commodore 1351 en beweegt een sprite. Volledig **inline** — geen JSR of label nodig. De macro selecteert de CIA-poort, wacht tot de SID-paddle-inputs stabiel zijn, decodeert vervolgens de delta-beweging met behulp van het standaard 1351-driverpatroon en past deze toe op de sprite-registers.

| Veld      | Beschrijving                                                                |
| --------- | --------------------------------------------------------------------------- |
| Haven     | `1` = CIA `$DC00` bits `7:6` = `%01`; `2` = `%10`                           |
| Sprite #  | Spritenummer 0–7                                                            |
| ZP-byte X | Nulpagina-adres (hex) om het vorige POTX-sample op te slaan (bijv. `FD`)    |
| ZP-byte Y | Nulpagina-adres (hex) om het vorige POTY-voorbeeld op te slaan (bijv. `FE`) |

**Gegenereerde ASM-vorm (poort 1, sprite 0, ZP `$FD`/`$FE`):**

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

**Grootte:** 142 bytes.

**Expertmodus syntaxis:**
```
.mouse port, spriteNum, zpX, zpY
; example:
.mouse 2, 0, FD, FE
```

> **Belangrijk:** Initialiseer vóór de eerste aanroep de nulpagina-bytes met de huidige POTX/POTY-waarden om een sprong in het eerste frame te voorkomen:
> ```
>     ; port 1: LDA $DC00 : AND #$3F : ORA #$40 : STA $DC00
>     ; port 2: LDA $DC00 : AND #$3F : ORA #$80 : STA $DC00
>     LDA $D419 : LSR A : AND #$3F : STA $FD
>     LDA $D41A : LSR A : AND #$3F : STA $FE
> ```

> **Tip:** Controleer de muis één keer per frame — plaats `WAIT_RASTER` in de gameloop vóór `MOUSE`.

---

<a id="sprite_col"></a>
### SPRITE_COL

Net als **`PEEK($D01E)`** in BASIC — controleert de VIC-II hardware-botsingsregisters en vertelt je of een sprite een andere sprite of de achtergrond heeft geraakt. Volledig inline, geen JSR nodig.

| Veld         | Beschrijving                                                                                                                |
| ------------ | --------------------------------------------------------------------------------------------------------------------------- |
| Sprite #     | Spritenummer 0–7 (welke bit van de sprite moet worden gecontroleerd)                                                        |
| Botsingstype | `Sprite-Sprite ($D01E)` — botsing met een andere sprite; `Sprite-Achtergrond ($D01F)` — botsing met achtergrondafbeeldingen |

**Expert syntax:**
```
.sprite_col 0, sprite
.sprite_col 0, background
```

**Gegenereerde ASM (sprite 0, sprite–sprite):**
```
    LDA $D01E       ; read sprite-sprite collision register (clears it!)
    AND #$01        ; isolate bit 0 (sprite 0)
                    ; A ≠ 0 → collision occurred
```

**Grootte:** 5 bytes.

> **Belangrijk:** Het lezen van `$D01E`/`$D01F` ** wist het register**. Lees het eenmaal per frame en verwerk het resultaat onmiddellijk met `BEQ`/`BNE`.

**Typisch gebruik:**
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

> **Zie ook:** `botsingsdemo` voorbeeld — groene bal (sprite #0) versus rood kruis (sprite #1).

---

### LOADFILE

Net als **`LOAD "file",8`** in BASIC — laadt een bestand van een D64-diskette tijdens de uitvoering met behulp van de KERNAL LOAD-routine. Gebruik dit om gegevens, muziek of extra code van de diskette te laden terwijl uw programma draait.

| Veld                            | Beschrijving                                                                                                                                                                                                                        |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bestandsnaam                    | Bestandsnaam op de schijf (max. 16 tekens, automatisch hoofdletters; tekens zoals `,`, `"`, `/`, `\`, `:`, `*`, `?`, `&lt;`, `&gt;`, `|` worden gefilterd)                                                                          |
| Apparaat                        | Apparaatnummer 8–30 (standaard `8`)                                                                                                                                                                                                 |
| Adres overschrijven (optioneel) | Hexadecimaal laadadres (bijv. `C000`). Indien ingesteld, wordt het bestand naar dit adres geladen (`sec=0`, waarbij de PRG-header wordt genegeerd). Laat leeg om de eigen 2-byte PRG-header van het bestand te gebruiken (`sec=1`). |
| Foutlabel (optioneel)           | Indien ingesteld, wordt na JSR LOAD een `BCS`-instructie gegenereerd. Als de KERNAL terugkeert met een ingestelde carry (fout), springt de uitvoering naar dit label.                                                               |

**Expert syntax:**
```
.loadfile "DEMO-COLORS", 8
.loadfile "DEMO-COLORS", 8, $C000
.loadfile "DEMO-COLORS", 8, $C000, error_label
```

**Gegenereerde codestructuur:**
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

**Grootte:** `3 + bestandsnaam_lengte + 9 (SETNAM) + 9 (SETLFS) + (4 indien overschrijven) + 5 (LOAD) + (2 indien foutlabel)` bytes. Minimum 27 bytes.

> **Belangrijk:** De bestandsnaam wordt direct in de machinecode opgeslagen na een `JMP skip_filename`. De bestandsnaam op de schijf moet in hoofdletters PETSCII zijn — wat overeenkomt met gewone ASCII-hoofdletters (`A`–`Z`). De macro zorgt hier automatisch voor.

> **Gebruik altijd een foutlabel** voor productieprogramma's — als het bestand niet wordt gevonden, stelt KERNAL de carry-vlag in en gaat de uitvoering verder met wat er daarna komt.

> **Zie ook:** `loadfile-demo` voorbeeld — demonstreert het laden van `DEMO-COLORS.PRG` vanaf een D64 met een BCS-fouttak en een visueel foutscherm.

---

### EXODECRUNCHT

In-programma **Exomizer-decompressie**. Gebruik deze macro direct na een `LOADFILE` die een Exomizer `mem`-modus gecomprimeerde stream heeft geladen — EXODECRUNCH pakt deze achterwaarts uit naar het adres dat in de stream is ingebed.

| Veld                   | Beschrijving                                                                                                     |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Adres van de uitpakker | Waar de depacker-code zich in het geheugen bevindt (standaard `B000`). Moet een 16-bits hexadecimaal adres zijn. |

**Expert syntax:**
```
.exodecrunch
.exodecrunch depacker=$B000
```

**Gegenereerde code (19 bytes):**
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

**Hoe het werkt:**

1. KERNAL `LOAD` ($FFD5) werkt ZP `$AE/$AF` bij zodat deze één byte voorbij de laatst geladen byte wijst. EXODECRUNCH kopieert dit naar ZP `$04/$05`, wat de officiële Exomizer-conventie voor het achterwaarts laden van de broncode is.
2. De depacker wordt doorgaans geplaatst op `$B000` (binnen het BASIC ROM-toegewezen gebied). De macro schakelt `$01 = $36` om, zodat de CPU daar RAM ziet tijdens de JSR, en herstelt vervolgens `$01 = $37`.
3. Het decompressiedoeladres is **gecodeerd in de gecomprimeerde stream zelf ** wanneer je comprimeert met `exomizer mem -l <load> file,<target> ` — de depacker leest het uit de eerste bytes van de stream.

**Depacker-binair bestand:** De vooraf gecompileerde achterwaartse depacker is `samples/exo-decrunch.bin` (477 bytes, ORG $B000). Het is een Kick Assembler-wrapper van de officiële `exodecrunch.asm` met `INC $D020` toegevoegd aan elke leesbewerking voor een zichtbaar randflits-effect tijdens de decompressie. Plaats het in uw programma met een `INCBIN`-blok op het adres van de depacker.

**Veiligheidscompensatie:** De standaard geheugenmodus van Exomizer past een veiligheidscompensatie van 2 bytes toe — gegevens komen 2 bytes eerder aan dan het gevraagde doel. Het dialoogvenster 'Uitvoeren via D64' ** telt automatisch 2 op bij het veld 'Bestemming' ** voordat Exomizer wordt aangeroepen, zodat het zichtbare gedrag overeenkomt met het adres dat u hebt ingevoerd.

> **Zie ook:** het `exo-multicolor-demo` voorbeeld — volledig end-to-end voorbeeld: LOADFILE een gecomprimeerde meerkleurige bitmap naar $C000, EXODECRUNCH pakt deze uit naar $2000, kopieer vervolgens scherm → $0400 en kleur → $D800, en schakel VIC-II over naar meerkleurige bitmapmodus.

> **Integratietest:** `cargo test --test exomizer_integration` (in `src-tauri/`) verifieert de volledige compressie- en decompressie-roundtrip op een 6502-emulator met het echte depacker-binair bestand. Slaagcriteria: 10000 bytes byte-gelijk aan de bron `multi-color.bin`.

---

### REU_CHECK

Detecteert of een Commodore RAM Expansion Unit (REU) is aangesloten — net zoals bij het controleren van `PEEK($D010)` om te zien of er hardware aanwezig is. Test door twee patronen naar het REU-register `$DF04` te schrijven en vervolgens weer uit te lezen.

| Veld | Beschrijving   |
| ---- | -------------- |
| Geen | Geen operanden |

**Gegenereerde code (34 bytes):**
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
> De macro normaliseert het resultaat zodat de volgende tak eenvoudig blijft: `BNE` betekent dat REU aanwezig is, `BEQ` betekent dat REU ontbreekt.

**Expert syntax:**
```
.reu_check
```

**Resultaat in vlaggen:**
- **Z = 0** (resultaat ≠ 0) → REU aanwezig → gebruik `BNE`
- **Z = 1** (resultaat = 0) → geen REU → gebruik `BEQ`

**Geen configureerbare velden** — de macro genereert elke keer dezelfde code.

**Typisch gebruik:**
```assembly
REU_CHECK
BEQ no_reu        ; skip if REU not present
; ... REU code here ...
no_reu:
```

---

### REU_STASH / REU_FETCH / REU_SWAP

DMA-blokoverdracht tussen C64 RAM en REU-uitbreidingsgeheugen — vergelijkbaar met een zeer snelle POKE-lus, maar de CPU verricht geen werk (de REU-chip kopieert de gegevens terwijl de CPU is uitgeschakeld). Een overdracht van 1000 bytes is vrijwel direct.

| Macro       | Richting      | `$DF01` commando |
| ----------- | ------------- | ---------------- |
| `REU_STASH` | C64 RAM → REU | `$90`            |
| `REU_FETCH` | REU → C64 RAM | `$91`            |
| `REU_SWAP`  | C64 RAM ↔ REU | `$92`            |

**Velden:**

| Veld      | Beschrijving                              | Voorbeeld |
| --------- | ----------------------------------------- | --------- |
| C64-adres | Bron/bestemming in C64 RAM (hex)          | `C000`    |
| REU-adres | Bron/bestemming in REU (hex, 16-bit)      | `0000`    |
| REU-bank  | REU-geheugenbank (0–7)                    | `0`       |
| Lengte    | Aantal over te dragen bytes (hex, 16-bit) | `1000`    |

**Expert syntax:**
```
.reu_stash $C000, $0000, 0, $1000
.reu_fetch $C000, $0000, 0, $1000
.reu_swap $C000, $0000, 0, $1000
```

**Gegenereerde code (40 bytes):**
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

> **Opmerking:** Commando's gebruiken `$90/$91/$92` (bit 4 ingesteld = directe DMA-modus). Schrijven naar `$DF01` start de overdracht; de CPU hervat wanneer deze is voltooid.

---

### TURBO_SET

Stelt de CPU-snelheid van de **Ultimate-64 (U64) ** in via register `$D031`. Heeft geen effect op een echte C64 of andere emulators.

**Velden:**

| Veld     | Beschrijving       | Bereik                                                |
| -------- | ------------------ | ----------------------------------------------------- |
| Snelheid | CPU-snelheidsindex | 0 = 1 MHz … 7 ≈ 10 MHz … 15 ≈ 48 MHz                  |
| Badline  | Badline-emulatie   | Ingeschakeld (C64-compatibel) / Uitgeschakeld (turbo) |

De snelheidsbyte wordt als volgt berekend: `(speedIndex &amp; 0x0F) | (badline_disabled ? 0x80 : 0x00)`.

**Gegenereerde code (5 bytes):**
```
A9 xx   LDA #speed_byte
8D 31 D0   STA $D031
```

**Expertmodus syntaxis:**
```
.turbo_set 7,0    ; speed=7 (~10 MHz), badline enabled
.turbo_set 15,1   ; speed=15 (~48 MHz), badline disabled
```

> **Opmerking:** Deze macro is alleen van invloed op U64-hardware. Op een echte C64 of andere emulators schrijft dit naar `$D031`, wat de CIA kan beïnvloeden of genegeerd kan worden.

---

### SUPERCPU_DETECT

Controleert of een **CMD SuperCPU**-accelerator is geïnstalleerd — zoals `PEEK($D0B8)` om te zien of deze iets anders dan `$FF` retourneert.

**Gegenereerde code (5 bytes):**
```
AD B8 D0   LDA $D0B8
C9 FF      CMP #$FF
```

**Resultaat in vlaggen:**
- **Z = 0** → SuperCPU aanwezig → gebruik `BNE`
- **Z = 1** → SuperCPU niet gevonden → gebruik `BEQ`

**Geen configureerbare velden.**

**Expert syntax:**
```
.supercpu_detect
```

**Typisch gebruik:**
```assembly
SUPERCPU_DETECT
BEQ no_scpu       ; skip if SuperCPU not present
; ... SuperCPU turbo code here ...
no_scpu:
```

---

### TURBO_ENABLE

Schakelt de **CMD SuperCPU-turbomodus** in of uit. Roep eerst `SUPERCPU_DETECT` aan en sla dit over als de SuperCPU niet aanwezig is.

| Modus       | Register | Effect                                             |
| ----------- | -------- | -------------------------------------------------- |
| Inschakelen | `$D07A`  | Schakel de turbomodus in (tot 20 MHz met SuperCPU) |
| Uitzetten   | `$D07B`  | Terug naar de compatibiliteitsmodus van 1 MHz      |

**Gegenereerde code (5 bytes):**
```
A9 00         LDA #$00
8D 7A D0      STA $D07A    ; (or $D07B for disable)
```

**Expertmodus syntaxis:**
```
.turbo_enable on
.turbo_enable off
```

> **Opmerking:** Roep eerst `SUPERCPU_DETECT` aan en spring om deze macro heen als de SuperCPU niet aanwezig is.

---

<a id="map_copy"></a>
### MAP_COPY

Kopieert een tegelkaart van een bronadres naar het scherm-RAM (en optioneel naar het kleuren-RAM) met behulp van een reeks `LDA abs,X` / `STA abs,X` lussen. Per lusiteratie wordt één pagina van 256 bytes gekopieerd; een gedeeltelijke pagina aan het einde wordt gestopt met `CPX #rem / BNE`. Geen JSR nodig — alle code wordt inline gegenereerd.

| Veld                         | Beschrijving                                                                                                                                                                  |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bronadres (scherm)           | Hexadecimaal adres waar de kaartgegevens zich bevinden na het laden (bijv. `C000`)                                                                                            |
| Scherm-RAM bestemming        | Waar moet ik schermcodes kopiëren (bijv. `0400`)?                                                                                                                             |
| Grootte (bytes)              | Totaal aantal bytes om te kopiëren — typisch `$03E8` = 1000 (40×25 tekens)                                                                                                    |
| Gecombineerde .bin-bestanden | Bij controle worden schermcodes direct gevolgd door kleurgegevens verwacht op `source + size`; in een tweede stap worden de kleurgegevens naar **Color RAM dest** gekopieerd. |
| Kleur RAM bestemming         | Bestemming voor kleurgegevens — standaard `D800` (C64 kleuren-RAM)                                                                                                            |

**Gegenereerde ASM (1000-byte kaart, alleen scherm):**
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

**Grootte:** `2 (LDX) + fullPages×9 + (rem &gt; 0 ? 11 : 0)` bytes per sectie. Gecombineerde modus verdubbelt dit (schermsectie + identieke kleursectie).

**Koppelen met de kaarteditor:**

De Map Editor's **Files → Save map + color RAM (.bin)** exporteert één binair bestand waarbij de eerste `size` bytes schermcodes zijn en de volgende `size` bytes kleur-RAM-waarden. Gebruik MAP_COPY met **Combined .bin** aangevinkt en wijs **Source addr** naar de locatie waar dit bestand wordt geladen (bijv. via INCBIN op `$C000`):

```
* = $C000
    INCBIN "map-color.bin" @ $C000   ; screen codes $C000–$C3E7, color $C3E8–$C7CF
* = $0801
    ; ...
    MAP_COPY src=$C000 dst=$0400 size=1000 combined color_dst=$D800
```

**Expertmodus syntaxis:**
```
.map_copy $C000, $0400, 1000               ; screen only
.map_copy $C000, $0400, 1000, auto, $D800  ; combined (color at src+size)
.map_copy $C000, $0400, 1000, $C3E8, $D800 ; explicit color source address
```

---

<a id="map_copy16x16"></a>
### MAP_COPY16X16

Kopieert een tekengebied van 16x16 tekens uit een compact schermcodeblok van 256 bytes plus een bijbehorend kleur-RAM-blok van 256 bytes. Het is bedoeld voor export naar Charset Canvas en kleine tegel-/afbeeldingsfragmenten, waarbij het schrijven van zestien afzonderlijke MAP_COPY-rijen te veel geheugen zou opleveren.

**Standaardindeling: **

| Gegevens              | Standaardadres           |
| --------------------- | ------------------------ |
| 16×16 schermcodes     | Bronadres (`src`)        |
| 16×16 kleurwaarden    | `src + 256`              |
| Scherm-RAM-bestemming | `$0400 + rij×40 + kolom` |
| Kleur RAM-bestemming  | `$D800 + rij×40 + kolom` |

**Expertmodus syntaxis:**
```
.map_copy16x16 $3000, 12, 4
.map_copy16x16 $3000, 12, 4, $0400, $3100, $D800
```

De verkorte vorm kopieert schermbytes van `$3000`, kleurbytes van `$3100` en plaatst het 16×16 blok op kolom 12, rij 4. Geldige posities linksboven zijn `col = 0..24` en `row = 0..9`, waardoor het volledige 16×16 gebied op het 40×25 C64 tekstscherm blijft.

**Gegenereerd gedrag:**

- Genereert zestien inline kopieën van de rij.
- Elke regel kopieert 16 schermbytes en 16 kleurbytes.
- Er is geen JSR nodig; de code wordt direct op de macropositie gegenereerd.
- Werkt met zowel de normale tekenmodus als de meerkleurige tekenmodus; de kleur-RAM-bytes bevatten de bit voor de tekenkleur/meerkleurige inschakeling van elke cel.

Typische combinatie met Charset Canvas:

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

Deze functie verhoogt het animatieframe van een sprite bij elke aanroep en werkt de VIC-II sprite-datapointers bij. Sla één byte per frame op in een tabel (het paginanummer van de spritegegevens = `data_address / 64`), wijs SPRITE_ANIM ernaar en roep deze één keer per gameframe aan — geen JSR nodig.

| Veld             | Beschrijving                                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------------------ |
| Sprite #         | Spritenummer 0–7                                                                                       |
| Frame lijstadres | Hexadecimaal adres van de frametabel — één byte per frame, elke byte = spritepagina (`data_addr / 64`) |
| Aantal frames    | Totaal aantal frames (1–255)                                                                           |
| Frame ZP         | De nulpaginabyte wordt gebruikt als frameteller (bijv. `FB`)                                           |

**Gegenereerde ASM (sprite 0, 4 frames, ZP `$FB`, lijst op `$C100`):**
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

**Grootte:** 19 bytes.

**Typisch gebruik:**
```
frameTable:
    .byte $21, $22, $23, $24   ; 4 frames at $0840, $0880, $08C0, $0900

gameloop:
    WAIT_RASTER ($FF)
    SPRITE_ANIM (sprite=0, list=$C100, count=4, zp=$FB)
    JMP gameloop
```

**Expertmodus syntaxis:**
```
.sprite_anim spriteNum, frameListAddr, frameCount, zpByte
; example:
.sprite_anim 0, C100, 4, FB
```

> **Tip:** Plaats de frametabel als een RAWBYTES-blok op een vast adres. De teller-ZP-byte (`$FB`) moet worden geïnitialiseerd naar `$00` vóór de eerste aanroep. Als uw code `$FB` voor iets anders gebruikt, kies dan een vrije ZP-locatie.

---

<a id="score_bcd"></a>
### SCORE_BCD

Voegt een vaste-kommawaarde toe aan een meerbyte BCD-score die in het geheugen is opgeslagen en zet vervolgens elk cijfer om naar het scherm-RAM als een schermcodekarakter. Gebruikt de 6502 decimale modus (`SED`/`CLD`) voor carry-veilige BCD-rekenkunde — handmatig manipuleren van de carry is niet nodig.

| Veld             | Beschrijving                                                                                                             |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Score adres      | Hexadecimaal adres van de BCD-scorebytes (bijv. `C200`). Lage byte eerst.                                                |
| Cijfers          | Aantal BCD-bytes (elke byte bevat twee cijfers: `$99` = "99"). `4` bytes = tot 99999999.                                 |
| Punten toevoegen | Decimale waarde die per oproep moet worden toegevoegd (bijv. `100`).                                                     |
| Schermadres      | Waar moeten de schermcodes voor de cijfers worden geschreven (bijv. `0400`)? Eén byte per cijfer (hoogste nibble eerst). |

**Expert syntax:**
```
.score_bcd $C200, 4, 100, $0400
```

**Gegenereerde ASM (4 bytes, +100 punten, score op `$C200`, scherm op `$0400`):**
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

**Grootte:** `3 + cijfers×8` bytes (SED + CLC + CLD overhead + 8 bytes per BCD byte voor ADC + display loop).

**Expertmodus syntaxis:**
```
.score_bcd $C200, 4, 100, $0400
```

> **Tip:** Initialiseer de scorebytes bij het opstarten naar `$00`. Het scoreadres moet zich in de nulpagina of het absolute RAM-geheugen bevinden, niet in het ROM-geheugen. Het schermadres moet naar de meest linkse cijfercel wijzen; cijfers worden van links naar rechts geschreven (meest significante byte eerst).

> **BCD-bereik:** `cijfers=4` bytes → 8 decimale cijfers → maximale score 99.999.999. Elke byte codeert twee BCD-cijfers: `$00`–`$99`.

---

## 10. Integratie van de debugger

De app ondersteunt **RetroDebugger** als externe C64-debugger. Deze ontvangt breakpoints, symbolen en autostart-vlaggen die gegenereerd worden door het geassembleerde programma.

### RetroDebugger

[RetroDebugger](https://github.com/slajerek/RetroDebugger) is een platformonafhankelijke Commodore 64-debugger met ondersteuning voor breakpoints, geheugeninspectie en labelbewuste disassemblage.

**Instellingen:** Open **Instellingen → Configureer het RetroDebugger-uitvoerbestand** en wijs het naar het `RetroDebugger`-binair bestand.

**Starten:** Klik op **Debuggen (RetroDebugger)** in de werkbalk. De app zal:

1. Compileer het programma tot een `.prg`-bestand in een tijdelijke map.
2. Schrijf een **breakpoints-bestand** (`breakpoints.txt`) — één `break $ADDR` per gemarkeerd blok.
3. Schrijf een **symbolenbestand** (`symbols.txt`) in Vice/RetroDebugger-labelformaat (`al C:addr .name`). Alle LABEL- en CONST-blokken zijn inbegrepen.
4. Schrijf ook sidecars in C64Debugger-stijl naast de gecompileerde PRG: `.dbg`, `.sym` en `.vs`.
5. Start RetroDebugger met:
   ```
   RetroDebugger -prg <file.prg> -breakpoints <breakpoints.txt> -symbols <symbols.txt> [flags]
   ```

### Breekpuntblokken

Klik op het breakpoint-pictogram (●) bij een instructieblok om dit als breakpoint in te stellen. Blokken met een breakpoint worden rood gemarkeerd. Hun adressen worden bij elke start van de debugger naar het breakpointbestand geschreven.

### Foutopsporingsvlaggen (tabblad Opties)

| Schakelaar            | Vlag              | Effect                                                                    |
| --------------------- | ----------------- | ------------------------------------------------------------------------- |
| `-jmp` AAN            | `-jmp $ADDR`      | Spring na het laden direct naar het startadres van het programma.         |
| `-pauze opheffen` AAN | `-pauze opheffen` | De debugger direct hervatten bij het laden                                |
| `-wacht` AAN          | `-wacht <ms>`     | Wacht `<ms>` milliseconden voordat je de pauze opheft — 500 ms of 1000 ms |

> **Tip:** Schakel voor de meeste programma's `-jmp` en `-unpause` in voor een directe automatische start. Gebruik `-wait 500` of `-wait 1000` wanneer uw programma IRQ's of SID-muziek instelt die tijd nodig heeft om te initialiseren vóór de eerste rastering.

---

## 11. Links naar de kennisbank

Snelkoppelingen zijn beschikbaar in de app onder **Kennisbank**:

| Bron                    | URL                                            |
| ----------------------- | ---------------------------------------------- |
| 6502 Opcodes Referentie | http://www.6502.org/tutorials/6502opcodes.html |
| C64 kernelfuncties      | https://sta.c64.org/cbm64krnfunc.html          |
| C64-geheugenkaart       | https://sta.c64.org/cbm64mem.html              |
| C64-kleurcodes          | https://sta.c64.org/cbm64col.html              |
| VIC-II Artikel          | https://www.cebix.net/VIC-Article.txt          |
| C64-codebasis           | https://codebase.c64.org/                      |
| De Turbo Assembler      | https://turbo.style64.org/                     |
| RetroDebugger           | https://github.com/slajerek/RetroDebugger/     |

---

## 12. D64 Exporteren en uitvoeren

Versie 1.5.1 voegt de mogelijkheid toe om uw programma (en aanvullende gegevensbestanden) te verpakken in een C64 D64-schijfkopie en deze in VICE te starten, of de schijfkopie te exporteren voor gebruik elders.

### Split Run-knop

De knop **Uitvoeren** in de werkbalk is vervangen door een **splitknop**:

| Deel             | Actie                                                  |
| ---------------- | ------------------------------------------------------ |
| **▶ Run** (main) | Voert de momenteel geselecteerde uitvoeringsmodus uit. |
| **▾** (pijl)     | Opent de modusselector.                                |

**Beschikbare uitvoeringsmodi:**

| Modus                     | Beschrijving                                                                                                                                                                                                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Uitvoeren als PRG**     | Compileer naar een tijdelijk `.prg` en start VICE direct. Klassiek gedrag.                                                                                                                                                                                               |
| **Uitvoeren via D64**     | Compileer, bouw een `.d64` schijfimage (met behulp van c1541), voeg eventuele geconfigureerde extra bestanden toe en start VICE vervolgens vanaf de schijf. Gebruik dit wanneer uw programma bestanden laadt tijdens de uitvoering (bijvoorbeeld met de LOADFILE-macro). |
| **Uitvoeren op hardware** | Stel het programma samen tot een PRG en verstuur het via het lokale netwerk naar een **1541 Ultimate / Ultimate 64**-apparaat. Zie [Sectie 13](#13-hardware-settings).                                                                                                   |

De geselecteerde modus wordt tussen sessies opgeslagen.

### Exporteren naar D64-dialoogvenster

Openen via het **PRG opslaan ▾** dropdownmenu → **Exporteren naar D64**. Het dialoogvenster biedt u de volgende mogelijkheden:

1. Stel de **schijfnaam** (max. 16 tekens) en de **programmanaam** in — dit zijn de namen die in de C64-schijfdirectory verschijnen.
2. **Extra bestanden toevoegen** — klik op **+** om een binair bestand te kiezen (`.prg`, `.bin`, `.sid`, enz.). Voor elk extra bestand:
   - **Naam** — zoals het in de D64-directory verschijnt (max. 16 tekens, automatisch hoofdletters).
   - **Addr** (laadadres, optioneel) — indien opgegeven, wordt een 2-byte PRG-header toegevoegd. Laat leeg om onbewerkte bytes zonder header te schrijven.
   - **Dst** (decompressiedoel, alleen met EXO) — waar de depacker de data op de C64 moet plaatsen. Wanneer EXO is ingeschakeld, wordt het extra gedeelte gecomprimeerd met `exomizer mem -l <Addr> file,<Dst>` voordat het naar de D64 wordt geschreven. De +2 veiligheidscompensatie wordt automatisch toegepast.
   - **EXO** — selectievakje waarmee achterwaartse `mem`-modus-compressie voor deze invoer wordt ingeschakeld. De grootte op de schijf is doorgaans 5-20% van het origineel.
3. Klik op **Export** om het `.d64`-bestand te genereren met behulp van de `c1541`-tool van VICE.

**Paren met EXODECRUNCH:** Wanneer je een bestand verzendt met EXO=aan, moet het programma dat het leest het laden naar het **Addr** adres (sec=1, de eigen PRG-header van het bestand), en vervolgens de **EXODECRUNCH** macro aanroepen om het achterwaarts uit te pakken naar **Dst**. Zie het `exo-multicolor-demo` voorbeeld voor het volledige patroon.

### D64-metadata in projecten

De schijfnaam, programmanaam en lijst met extra bestanden worden opgeslagen in het project-JSON-bestand (onder de sleutel `d64`). Wanneer u het project of een voorbeeld met D64-metadata opnieuw laadt, worden de extra bestanden automatisch hersteld; u hoeft ze dus niet elke keer opnieuw toe te voegen.

Het **loadfile-demo** voorbeeld is vooraf geconfigureerd met `DEMO-COLORS.PRG` als extra bestand. Selecteer dit bestand, open **Uitvoeren via D64** en klik op **Uitvoeren** om de volledige laadstroom in actie te zien.

> **Vereiste:** Voor zowel D64-export als uitvoering via D64 is het vereist dat VICE (`c1541`) is geconfigureerd in [Hardware-instellingen](#13-hardware-settings).

### D64 Editor (een bestaande schijfimage bekijken en bewerken)

Het pictogram in de werkbalk na de Curve Editor opent de **D64 Editor** — een zelfstandig hulpmiddel om rechtstreeks met een bestaande `.d64` image te werken, onafhankelijk van het momenteel geopende programma. In tegenstelling tot het bovenstaande dialoogvenster Exporteren naar D64 (dat altijd een *nieuwe* schijf bouwt vanuit de gecompileerde PRG), bewerkt de D64 Editor een schijfimage ter plaatse via `c1541`, waardoor het tevens dienstdoet als een lichtgewicht schijfbeheerder.

**Bestanden ▾ menu:**

| Item                  | Actie                                                                                                         |
| --------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Nieuwe D64…**       | Kies een bestemmingslocatie en maak daar een nieuw geformatteerde, lege schijfkopie aan.                      |
| **Open D64…**         | Selecteer een bestaand `.d64`-bestand en laad de map ervan.                                                   |
| **Opslaan als…**      | Kopieer de momenteel geopende schijfkopie naar een nieuwe locatie en ga verder met het bewerken van de kopie. |
| **Uitvoeren in VICE** | Start de momenteel geopende schijfimage rechtstreeks in VICE (`-drive8type 1541`).                            |

**Werkbalk:**

| Icon                          | Actie                                                                                     |
| ----------------------------- | ----------------------------------------------------------------------------------------- |
| **Programma toevoegen**       | Selecteer een lokaal bestand en schrijf het naar de schijfmap.                            |
| **Selecteer geselecteerde **  | Sla de bytes van de geselecteerde invoer op in een lokaal `.prg`-bestand.                 |
| **Geselecteerde hernoemen**   | Bewerk de naam van het item direct in de tabel — Enter bevestigt, Escape annuleert.       |
| **Geselecteerde verwijderen** | Verwijder het geselecteerde item van de schijf.                                           |
| **Vernieuwen**                | Lees de map opnieuw, bijvoorbeeld nadat u de schijf met een ander programma hebt bewerkt. |

**Een programma toevoegen:** Het selecteren van een bestand dat al eindigt op `.prg` vraagt alleen om een **Naam** en een schijf **Type** (PRG/SEQ/USR/REL) — een `.prg` heeft al zijn eigen laadadresheader, dus die wordt ongewijzigd geschreven. Het selecteren van een ander bestand (bijv. een onbewerkt `.bin`) toont bovendien:

- **Laadadres** (hex, optioneel) — voeg een 2-byte PRG-header toe aan dit adres; laat dit leeg om de bytes onbewerkt te schrijven.
- **Decompressieadres** (hex, optioneel) — alleen te gebruiken in combinatie met Exomizer; het doeladres waarnaar de depacker de gegevens moet uitpakken.
- **Exomizer** selectievakje — comprimeer het bestand vóór het schrijven, met dezelfde `mem`/`sfx` crunch-modi als de extra bestanden in het bovenstaande dialoogvenster Exporteren naar D64.

De directorylijst geeft bestandsnamen weer in hetzelfde lettertype en met dezelfde hoofdletters als een echte C64 `LOAD"$",8`-lijst.

> **Vereiste:** Net als bij Exporteren naar D64, vereist de D64 Editor VICE (`c1541`) geconfigureerd in [Hardware-instellingen](#13-hardware-settings). Elke actie (toevoegen/verwijderen/hernoemen/uitpakken) wordt rechtstreeks toegepast op het `.d64`-bestand op de schijf — er is geen aparte "opslaan"-stap.

---

## 12b. CRT-export (Magic Desk 64K-cartridge)

**Menu → Bouwen → Bouw CRT** produceert een Commodore 64 cartridge-image (`.crt`, **cartridge type 19 — Magic Desk / Domark / HES Australia**) die draait op VICE, TheC64, echte hardware via EasyFlash / Kung Fu Flash, en 1541 Ultimate II+ cartridge-slots. Het is beschikbaar in zowel **blokmodus** als **Expertmodus**, en — vanaf de huidige build — ook in **UltimateBasic-modus**.

### Welke schepen zitten er in de winkelwagen?

- **8 × 8 KB banks** op `$8000`, bankgeschakeld via `$DE00` (Magic Desk-conventie: laagste 3 bits = bank, bit 7 = cartridge uitschakelen).
- **Bank 0** bevat een header van 128 bytes + bootloader:
  - `$8000/$8002` koude + warme startvectoren wijzen naar `$8009`.
  - `$8004–$8008` = de `CBM80` handtekening die vereist is door de KERNAL resetcode.
  - `$8009–$807F` = de loader: SEI / stack init / `JSR $FDA3` (IOINIT) / `JSR $FD50` (RAMTAS) / `JSR $FD15` (RESTOR) / `JSR $FF5B` (CINT), vervolgens een byte-kopieerlus die de payload van cart-ROM naar RAM streamt en van bank wisselt wanneer `$FC` `$A0` bereikt. Aan het einde kopieert het een kleine **exit stub** naar `$0100`, schakelt de wagen uit met `LDA #$80 : STA $DE00`, en `JMP`s naar het ingangspunt.
- **Payload** begint bij `$8080` in bank 0 en loopt door naar banken 1–7 indien nodig. Maximale payload = `8 * 8192 − 128 = 65 408 bytes`.

### Laadadres en toegangspunt

Build CRT maakt nooit gebruik van Exomizer (de depacker kan niet vanuit de cartridge-ROM draaien). Het compileert het huidige tabblad met de standaard autostart-pipeline en haalt het laadadres uit de PRG-header en het entrypoint uit de SYS-target:

- **Blokkeer-/Expertmodus met BASIC SYS-stub ingeschakeld: ** laden = `$0801`, invoer = het SYS-doel (doorgaans `$080D` of de oorsprong van de gebruiker).
- **Blok / Expertmodus met BASIC SYS-stub uitgeschakeld: ** laden = gebruikersoorsprong (met de klassieke `$0801 → $C000` terugvaloptie), invoer = laadadres.
- **UltimateBasic-modus: ** laden en invoeren komen beide uit de UB-compilerkaart (`build.map.loadAddress`). De UB-autostartstub in de payload wordt vervolgens precies zo uitgevoerd als na `LOAD "...",8,1 : RUN` vanaf schijf.

Het oorspronkelijke adres dat u in de ASM-uitvoer ziet, blijft behouden; de loader kopieert eenvoudigweg de platte geheugenafbeelding van de PRG naar het RAM-geheugen en springt naar het ingangspunt zodra het ROM-geheugen van de cartridge is ontkoppeld.

### Groottelimiet

Omdat de payload lineair wordt opgeslagen en `assembleProgramToPrg()` een platte `minAddr..maxAddr` buffer met nullen gevulde gaten retourneert, telt een programma met wijd gespreide ORG-segmenten (bijv. `$0801` + `$C000` + `$E000`) elke byte daartussen mee voor het budget van 65.408 bytes. Als u de limiet overschrijdt, wordt de build afgebroken met een `saveCrtTooLarge` fout — comprimeer de geheugenindeling of splits de gegevens.

> **⚠️ Belangrijke waarschuwing — lees dit voordat u een CRT-monitor verzendt**
> 
> De loader roept de KERNAL **`RESTOR` ($FD15)** aan als onderdeel van de standaard resetsequentie. Dit herschrijft opzettelijk de standaard I/O-vectoren op `$0314/$0315`, `$0316/$0317`, `$0318/$0319`, `$0328/$0329` en dergelijke terug naar hun ROM-standaardwaarden. Gevolgen:
> 
> - **Alle IRQ/NMI/BRK-hooks die vóór het opstarten van de CRT zijn ingesteld, worden gewist.** Uw programma moet ze zelf installeren na het opstarten — precies zoals een nieuwe `LOAD "",8,1 : RUN` vanaf tape/schijf.
> - **UltimateBasic-programma's** die afhankelijk zijn van niet-standaard KERNAL-vectoren die actief zijn bij het opstarten, hebben mogelijk een expliciete `SYS` of init-aanroep nodig in de autostart-stub. De standaard UB-autostart werkt direct; extensiebibliotheken die vectoren onderscheppen *voordat* `RUN` werken niet.
> - **CIA1 / CIA2** worden opnieuw geïnitialiseerd door `IOINIT`. Aangepaste timerinstellingen (raster-IRQ's, muziekspeler CIA-A) moeten na binnenkomst opnieuw worden geprogrammeerd.
> - De cartridge wordt uitgeschakeld door een 8-byte stub in **RAM op `$0100`** zodat de `STA $DE00` niet kan worden onderbroken door een foutieve ROM-fetch. Vertrouw er niet op dat `$0100–$0107` de stack top image bevat bij binnenkomst — de eerste RAM-push overschrijft de stub.
> 
> Als een CRT-programma in VICE werkt, maar op echte hardware niet, controleer dan eerst of het programma bij aanvang een specifieke KERNAL-vector of CIA-timerstatus aanneemt. Stel deze status expliciet in uw init-routine in en het programma zal zich op beide systemen hetzelfde gedragen.

### Verenigbaarheid

| Platform                        | Status                                                       |
| ------------------------------- | ------------------------------------------------------------ |
| VICE (`x64sc`, `x64`)           | Werkt via ** Bestand → Cartridge-image bijvoegen **.         |
| De C64 / De C64 Mini            | Werkt via de ingebouwde patroonlader.                        |
| Kung Fu Flash                   | Werkt — standaard Magic Desk-modus.                          |
| EasyFlash-cartridge             | Werkt wanneer geprogrammeerd als Magic Desk.                 |
| 1541 Ultimate II+ / Ultimate 64 | Werkt via **Cartridge → Afbeelding van de cartridge laden**. |
| Kameleon / Turbo Kameleon       | Werken.                                                      |

---

## 13. Hardware-instellingen

Openen via **Instellingen → Hardware-instellingen…** in het menubalk. Alle externe hardwarepaden en netwerkconfiguratie bevinden zich hier.

### VICE-emulator

| Instelling         | Beschrijving                                                     |
| ------------------ | ---------------------------------------------------------------- |
| **Selecteer VICE** | Blader naar het uitvoerbare bestand `x64sc` (of `x64`) van VICE. |
| **Status**         | Geeft aan of het uitvoerbare pad geldig en toegankelijk is.      |

VICE is vereist voor **Uitvoeren als PRG**, **Uitvoeren via D64** en **Exporteren naar D64**.

### Exomizer

| Instelling                         | Beschrijving                                                                                                                                                                                |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Selecteer exomizer**             | Blader naar het uitvoerbare bestand `exomizer`                                                                                                                                              |
| **Randflits tijdens decompressie** | Wanneer ingeschakeld, gebruiken SFX-gecomprimeerde PRG's het ingebouwde `-x1` snelle randflits-effect van exomizer; wanneer uitgeschakeld, wordt `-n` doorgegeven voor stille decompressie. |
| **Status**                         | Geeft aan of het uitvoerbare pad geldig en toegankelijk is.                                                                                                                                 |

**Werkstroom:**
1. Installeer het Exomizer-programma:
   - **Windows:** download de vooraf gecompileerde `win32/exomizer.exe` van https://bitbucket.org/magli143/exomizer/wiki/Home of https://csdb.dk/release/?id=244342.
   - **macOS:** `brew install exomizer` (installeert de officiële 3.1.2-build van Magnus Lind).
2. Configureer het pad in **Hardware-instellingen → Exomizer-sectie**.
3. Schakel het selectievakje **Uitvoeren met Exomizer** in het menu **Instellingen** in.
4. Alle **Run**-acties (PRG, D64, hardware) en **Build**-acties (Build PRG, Build D64) zullen het geassembleerde programma nu door `exomizer sfx sys` laten verwerken voordat het wordt gestart of opgeslagen.

Exomizer werkt op dezelfde manier op Windows en macOS: de CLI wordt aangeroepen vanuit de Tauri-backend; niets aan de integratie is platformspecifiek.

**Intern worden twee compressiemodi gebruikt:**

| Modus                | Gebruikt door                                            | Bellen conventie                                                                                                                                                                                    |
| -------------------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sfx sys`            | Bouwen/uitvoeren met Exomizer-schakelaar (hoofd-PRG-pad) | Zelfuitpakkende PRG met ingebouwde decruncher; de instelling voor randflits regelt `-x1` versus `-n`                                                                                                |
| `mem` (achterwaarts) | Uitvoeren via D64 → per bestand **EXO** selectievakje    | Comprimeert elk extra bestand tot een `mem`-mode stream; het programma decomprimeert het tijdens runtime via de **EXODECRUNCH** macro en een vooraf gebouwde depacker (`samples/exo-decrunch.bin`). |

> **Tip:** Als het Exomizer-pad niet is geconfigureerd, maar het selectievakje is ingeschakeld, wordt er een duidelijke foutmelding weergegeven in plaats van dat het programma wordt gestart. Schakel het selectievakje uit om het programma zonder compressie uit te voeren.

> **Integratietest:** `cargo test --test exomizer_integration` (in `src-tauri/`) verifieert de volledige mem-mode compressie + decompressie roundtrip op een 6502 emulator.

### Retro Debugger

| Instelling                  | Beschrijving                                   |
| --------------------------- | ---------------------------------------------- |
| **Selecteer RetroDebugger** | Blader naar het `RetroDebugger`-binair bestand |
| **Status**                  | Geeft aan of het pad geldig is.                |

Zie [Sectie 9](#9-debugger-integration) voor de volledige debuggerdocumentatie.

### C64 Ultimate / 1541 Ultimate

Voer geassembleerde PRG's rechtstreeks uit op echte hardware via het lokale netwerk met behulp van de Ultimate REST API.

| Instelling         | Beschrijving                                                                         |
| ------------------ | ------------------------------------------------------------------------------------ |
| **Host (IP)**      | IP-adres van het apparaat (bijv. `192.168.1.100`)                                    |
| **Wachtwoord**     | Optioneel — als het apparaat authenticatie vereist.                                  |
| **Testverbinding** | Verstuurt een testverzoek naar `/v3/runners/info`; geeft OK of een foutmelding weer. |

**Werkstroom:**
1. Sluit de 1541 Ultimate / Ultimate 64 aan op uw lokale netwerk.
2. Voer het IP-adres (en het wachtwoord, indien ingesteld) in bij de hardware-instellingen.
3. Selecteer **Uitvoeren op hardware** in het menu voor gesplitste uitvoering.
4. Klik op **▶ Uitvoeren** — de PRG wordt gecompileerd en via HTTP POST naar het apparaat verzonden naar `/v3/runners/prg`. Het apparaat laadt en voert het direct uit op de C64.

> **Tip:** Geen USB-kabel of stuurprogramma nodig — de REST API is ingebouwd in de Ultimate-firmware. Uw computer en het apparaat moeten zich op hetzelfde lokale netwerk bevinden.

---

## 14. Visuele editors (toolkit)

Het menu **Toolkit** in de werkbalk groepeert de visuele data-editors die allemaal een gemeenschappelijk menu Bestanden (`Bestanden ▾`) delen voor BIN laden / BIN opslaan / Exporteren naar blokken / Opslaan naar D64. Elke editor produceert ruwe `.bin`-gegevens die in een programma kunnen worden geplaatst met `INCBIN`, of direct aan een D64-schijf kunnen worden toegevoegd via de **Opslaan naar D64**-optie.

Dialoogvensters van de visuele editor kunnen aan hun koptekst over de volledige werkruimte van Visual Assembler worden gesleept. Een dialoogvenster zonder opgeslagen positie wordt gecentreerd geopend; nadat het is verplaatst, wordt de laatst gebruikte positie opgeslagen in de UI-instellingen en hersteld wanneer het de volgende keer wordt geopend.

### Editor voor hoge resolutie / meerkleurig

Bitmap-editor op pixelniveau met zowel een hoge resolutie van 320×200 als een meerkleurige modus van 160×200. Openen via Toolkit → Hi-Res Editor.

| Functie                       | Beschrijving                                                                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Modusschakelaar               | **Multicolor** selectievakje schakelt tussen hoge resolutie (mono per cel) en meerkleurig (4 kleuren per cel).                        |
| Hulpmiddelen                  | Potlood, gum, lijn, rechthoek, gevulde rechthoek, ovaal, gevuld ovaal, vlakvulling.                                                   |
| Spuitgereedschap              | Een airbrush-achtig tekenprogramma dat tijdens het tekenen pixels rond de cursor verspreidt.                                          |
| Spuitintensiteit              | Met het keuzemenu naast het spuitgereedschap kunt u de dichtheid van elke spuitbeweging aanpassen.                                    |
| Kleurenpalet                  | Voorgrond (inkt) + papier (achtergrond) selectiekaders. Meerkleurenmodus houdt automatisch 3 extra's per cel bij.                     |
| Ongedaan maken / Opnieuw doen | Geschiedenis per beroerte, ctrl-Z / ctrl-Y.                                                                                           |
| Raster + Raster               | Optioneel 8×8 raster en rasterrij-overlay voor celuitlijning.                                                                         |
| Afbeelding importeren         | PNG/JPEG/GIF-bestanden die op het canvas worden geplaatst, worden automatisch gequantiseerd naar het 16-kleuren C64-palet.            |
| Exporteer blokken             | Voegt BYTE/RAWBYTES-blokken met de gecodeerde bitmap-, scherm- en kleurgegevens toe aan het programma.                                |
| Exporteer `.bin`              | Slaat het oorspronkelijke meerkleurige formaat (10000 bytes: 8000 bitmap + 1000 scherm + 1000 kleur) klaar voor LOADFILE op in $2000. |

### Sprite-editor

Sprite-editor van 24x21 pixels met animatie over meerdere frames. Openen via Toolkit → Sprite-editor.

| Functie                            | Beschrijving                                                                                                                                                                                                                                                 |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Lijsten                            | Lijsten toevoegen/verwijderen/de volgorde wijzigen; de lijststrook wordt onderaan weergegeven.                                                                                                                                                               |
| Modus                              | Schakelaar voor monochroom/meerkleurig.                                                                                                                                                                                                                      |
| Hulpmiddelen                       | Potlood, vulling, lijn, rechthoek, cirkel — plus horizontaal spiegelen, verticaal spiegelen, links/rechts/boven/onder verschuiven (met optionele tekstterugloop). Vormgereedschappen tonen een live voorbeeld tijdens het slepen; laat los om te bevestigen. |
| Ongedaan maken / opnieuw uitvoeren | Volledige stapel met ongedaan maken/herstellen per frame. Ctrl/Cmd+Z / Ctrl/Cmd+Y of de knoppen in de werkbalk.                                                                                                                                              |
| Afbeelding importeren              | Importeer een PNG- of JPEG-bestand via Bestand → Afbeelding importeren. De importeerfunctie koppelt elke pixel aan de dichtstbijzijnde kleur uit het C64-palet en schrijft deze naar het huidige frame.                                                      |
| Animatievoorbeeld                  | Afspelen/stoppen met instelbare snelheid.                                                                                                                                                                                                                    |
| Exporteer blokken                  | Voegt voor elk frame een RAWBYTES-blok in op een adres dat is uitgelijnd met 64 bytes, plus een instelling voor een spritepointer.                                                                                                                           |
| Sla `.bin` op                      | Schrijft 64 bytes per frame (ruwe spritegegevens zonder opvulling).                                                                                                                                                                                          |

### C64 Character ROM Browser ("Char map")

Alleen-lezen viewer van het C64-teken-ROM (het ingebouwde PETSCII-lettertype). Openen via de **C64 chargen**-optie in het Toolkit-menu. Handig om de schermcode van een glyph te vinden voordat je deze schrijft met `RAWBYTES` of `TEXT`.

| Functie        | Beschrijving                                                                                                                                                                                                                                                   |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Twee tekensets | Tabblad 1: **Set 1 — Boven/Grafisch** (standaardmodus na inschakelen). Tabblad 2: **Set 2 — Onder/Boven** (na `$0E` schakelaar).                                                                                                                               |
| Glyfenraster   | Een raster van 16x16 pixels met alle 256 tekens. Klik op een glyph om het detailvenster te bekijken: een ingezoomde weergave van 8x8 pixels, de schermcode (decimaal + hexadecimaal), PETSCII-codes (zowel standaard als verschoven) en de ruwe 8-byte bitmap. |
| Detailpaneel   | Toont de schermcode, PETSCII-codes en de acht onbewerkte bytes van het geselecteerde glyph — klaar om te plakken in een `RAWBYTES` of BYTE-blok.                                                                                                               |
| Alleen-lezen   | Hier hoeft u niets te bewerken — gebruik de tekeneditor (hieronder) om de tekens aan te passen.                                                                                                                                                                |

### Tekeneditor (Charset)

Teksteditor met een tekenset van 256 tekens (8x8). Openen via Toolkit → Teksteditor.

| Functie                     | Beschrijving                                                                                                                                                                                                  |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ROM laden                   | Importeert de C64 ROM-tekenset rechtstreeks van VICE's `chargen` (geen bestandsselector).                                                                                                                     |
| Laad `.bin`                 | Importeert een extern binair bestand met een tekenset van 2048 bytes.                                                                                                                                         |
| Voorbeeldweergave per teken | Een raster van 16 vakjes breed met alle 256 glyphs, waarbij het huidige vakje is gemarkeerd.                                                                                                                  |
| Pixel-editor                | 8x8 tekeneditor voor één teken met schakel-/omkeer-/wisfuncties.                                                                                                                                              |
| Kleur per teken             | Slaat een standaard kleur-RAM-waarde op voor elk teken. In de modus voor meerkleurige tekens behoudt dit ook de per-cel meerkleurige inschakelbit en de eigen lagere 3-bits kleur van het teken.              |
| Metadata retour             | Bij het laden van compatibele gegevens vanuit Charset Canvas/Map-workflows blijven de kleurmetadata per teken behouden, zodat bewerkingen kunnen worden voortgezet zonder dat de kleurintentie verloren gaat. |
| Exporteer blokken           | Voegt de gecodeerde tekenset toe aan RAWBYTES op $0800 (blok 2) of $3800 (blok 7).                                                                                                                            |

### Tekenset Canvas Editor

Volledig canvas tekenset-schilderprogramma voor het bouwen van schermen vanuit een complete tekenset van 256 tekens. Openen via Toolkit → Tekensetcanvas.

Het canvas is 16×16 tekens. In de monochrome modus geeft dat een werkgebied van 128×128 pixels; in de modus met meerdere tekens geeft het een werkgebied van 64×128 pixels, waarbij de regels voor meerdere tekens van de C64 worden gebruikt.

| Functie                                       | Beschrijving                                                                                                                                                                                                     |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mono / meerkleurig                            | In de monochrome modus worden 1-bits 8×8-glyphs opgeslagen. In de meerkleurige modus worden horizontale pixelparen van twee bits opgeslagen en worden gebruikte cellen gemarkeerd met bit 3 van het kleuren-RAM. |
| C64 kleurenmodel                              | Achtergrond gebruikt `$D021`; gedeelde meerkleurige kleur 1 gebruikt `$D022`; gedeelde meerkleurige kleur 2 gebruikt `$D023`; de kleur van elk teken is afkomstig uit bits 0–2 van het kleurengeheugen.          |
| Tekengereedschappen                           | Potlood, gum, lijn, rechthoek, ovaal en vulpen werken over de grenzen van tekens heen.                                                                                                                           |
| Spuitgereedschap                              | Een tekening in airbrush-stijl waarbij pixels over aangrenzende cellen/tekens verspreid worden.                                                                                                                  |
| Spuitintensiteit                              | Via het keuzemenu naast het spuitgereedschap kunt u de spuitdichtheid instellen.                                                                                                                                 |
| Raster schakelaar                             | Met het selectievakje 'Raster' kunt u het raster van 16x16 tekens weergeven of verbergen.                                                                                                                        |
| Sla de tekenset `.bin` op.                    | Slaat de 2048-byte tekenbitmapgegevens op.                                                                                                                                                                       |
| Sla een kaart van 16×16 op + Kleur RAM `.bin` | Slaat 256 schermcodes op, gevolgd door 256 kleur-RAM-waarden. Gebruik dit met `MAP_COPY16X16`.                                                                                                                   |
| Laden                                         | Kan opgeslagen charset-canvasbestanden, gewone charset-gegevens en compatibele Character Editor charset-gegevens laden, inclusief opgeslagen kleuren per teken indien aanwezig.                                  |

**Belangrijke C64-beperking:** In de meerkleurige tekenmodus zijn de twee gedeelde kleuren globaal voor het hele scherm (`$D022` / `$D023`). Alleen de eigen kleur van het teken is per cel, en deze is beperkt tot de kleuren 0-7 omdat bit 3 van het kleuren-RAM de meerkleurige modus selecteert.

### Kaarteditor (tegelkaarten met meerdere lagen)

Gelaagde tegelkaarteditor voor statische omgevingen, sprite-spawnmaps, botsingsgegevens en dergelijke. Openen via Toolkit → Kaarteditor.

| Functie                                          | Beschrijving                                                                                                                                                                                                                                                                               |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Lagen                                            | Meerdere benoemde lagen, elk met een eigen tegelset en transparantie.                                                                                                                                                                                                                      |
| Kwasten                                          | Modi voor enkelvoudige tegels, vulling, lijn, rechthoek en cirkel. Vormgereedschappen tonen een live voorbeeld tijdens het slepen; laat los om te bevestigen.                                                                                                                              |
| Ongedaan maken / opnieuw uitvoeren               | Volledige stapel met ongedaan maken/herstellen per laag. Ctrl/Cmd+Z / Ctrl/Cmd+Y of de knoppen in de werkbalk.                                                                                                                                                                             |
| Menu wissen                                      | Kaart per laag of hele kaart wissen met bevestiging.                                                                                                                                                                                                                                       |
| Afbeelding importeren                            | Sleep een PNG-bestand van een tegelkaart naar de editor; deze verdeelt de kaart automatisch in tegels.                                                                                                                                                                                     |
| Kopiëren/plakken                                 | Kopieer een geselecteerd tegelgebied en plak het vervolgens op de normale manier, of gebruik transparante plakoptie om lege tegels transparant te houden.                                                                                                                                  |
| Tegelkleuring met aandacht voor meerdere kleuren | Bij gebruik van compatibele tekensetmetadata gebruikt het tekenproces de standaardwaarden van het opgeslagen Color RAM-geheugen van de tegel (inclusief meerkleurige codering) in plaats van een generieke effen kleur.                                                                    |
| Aangepaste tekensetkleuren                       | Wanneer een charset `charColors`-metadata bevat, gebruikt de kaarteditor de standaardkleur-RAM-waarde van de geselecteerde tegel tijdens het tekenen.                                                                                                                                      |
| Exporteer blokken                                | Genereert RAWBYTES-blokken voor tegelsetafbeeldingen en kaartgegevens.                                                                                                                                                                                                                     |
| Schermgeheugen opslaan (.bin)…                   | Slaat alleen de schermcodes op voor de huidige kaartlaag (40 × 25 = 1000 bytes).                                                                                                                                                                                                           |
| Scherm-RAM + Kleur-RAM opslaan (.bin)…           | Slaat schermcodes, gecombineerd met kleur-RAM-waarden, op als één bestand van 2000 bytes (`screen[0..999]` gevolgd door `color[0..999]`). Gebruik dit met de macro **MAP_COPY** (gecombineerde .bin-modus) om zowel scherm als kleur in één bewerking tijdens de uitvoering te herstellen. |

### SID-editor (3-stemmen tracker)

Multi-instrumentele 3-stemmige tracker met een Web Audio-previewengine. Openen via Toolkit → SID Editor.

** Bedieningselementen per instrument: **
- Selectievakjes voor golfvormen (TRI / SAW / PUL / NOI) — meerdere golfvormen kunnen met elkaar worden gecombineerd via een OR-bewerking.
- ADSR (attack / decay / sustain / release) wordt weergegeven als een sleepgrafiek boven de vier schuifregelaars.
- Pulsbreedte-schuifregelaar (0-4095) met optionele ring-/synchronisatievlaggen.
- Selectievakje voor filterroutering per stem; globale filterafsnijding / resonantie / volume / modus (LP/BP/HP).

**Tracker raster:**
- 3 stemmen × tot 7 patronen × 32 rijen = 7 × 32 = maximaal 224 rijen (beperking door een 8-bits rijteller).
- Per rij: noot + instrumentindex. Lege rijen bevatten de vorige noot.
- Selecteer een cel op de normale manier, of houd **Shift** ingedrukt terwijl u klikt of de pijltjestoetsen gebruikt om een rechthoekige selectie uit te breiden over rijen en elk van de drie stemmen. Door met de rechtermuisknop binnen het geselecteerde gebied te klikken, blijft het bereik intact.
- Kopiëren, knippen, plakken en wissen zijn beschikbaar via de iconenwerkbalk en het contextmenu met pictogrammen. `Ctrl/Cmd+C` en `Ctrl/Cmd+V` werken op dezelfde rechthoekige selectie.
- Harmoniehulpmiddel: kies een grondtoon, akkoordtype en octaaf, beluister het akkoord met het huidige instrument en voeg de stemvoering vervolgens direct in de tracker in. Beschikbare typen zijn onder andere majeur, mineur, verminderd, verhoogd, sus2, sus4, dominant septiem, majeur septiem, mineur septiem, sext, mineur sext, none, b9, #9, verminderd septiem en 7sus4.
- Arpeggio-hulpmiddel: bekijk of voeg notenreeksen van 4, 8 of 16 stappen in vanaf het geselecteerde akkoord in opwaartse, neerwaartse of op/neerwaartse richting in.
- **Voorbeeldrij** laat de geselecteerde rij horen op alle drie de stemmen zonder het patroon af te spelen.
- Het plakken binnen een celbereik begint nu bij de geselecteerde begincel van het bereik en stopt netjes bij de grenzen van stemmen en rijen, in plaats van door te lopen naar de volgende kolom of rij.
- Met de snelheidsregelaar wordt de IRQ-tickdeler ingesteld (het aantal frames tussen rijen).

**Afspelen en virtueel toetsenbord: **
- De knop 'Afspelen' in de werkbalk verandert in 'Pauze' tijdens het afspelen en in 'Hervatten' wanneer het afspelen gepauzeerd is; 'Stop' beëindigt het afspelen en zet de status terug naar de beginstand.
- De knop in de toetsenbordwerkbalk opent een niet-modaal pianovenster dat bruikbaar blijft terwijl de SID-editor actief is. Versleep de koptekst om het venster overal boven de hoofdapplicatie te plaatsen.
- Schakel **Invoegen in tracker** in om elke gespeelde noot op de huidige trackercursor te schrijven en naar de volgende regel te gaan. Schakel deze functie uit om noten te beluisteren zonder ze te bewerken.
- Bij het openen van het klavier lichten de bijbehorende pianotoetsen op als de akkoord- en arpeggiovoorbeelden worden weergegeven.

**Exporteren via het menu Bestanden:**
| Exporteren                             | Wat het doet                                                                                                                                                                                                        |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Sla .bin op…`                         | Schrijft het eigen geserialiseerde formaat van de editor (instrumenten + patronen + sequentie).                                                                                                                     |
| `Blokken exporteren (alleen gegevens)` | Voegt de instrumenttabel + patroonblokken toe aan het programma op `* = $C000`.                                                                                                                                     |
| `Blokken exporteren + miniplayer`      | Voegt de volledige speler (sid_init / sid_irq / sid_play_row / sid_set_voice) plus PAL-frequentietabellen toe. Plaats na het exporteren een `JSR sid_init` in uw hoofdcode op de plek waar de muziek moet beginnen. |
| `Exporteer asm (klembord)`             | Kopieert de volledige broncode van de assembly naar het klembord.                                                                                                                                                   |

**Gebruik van speler ZP: ** `$FB` (tick-teller), `$FC` (rij-index), `$FD` (set_voice temp). Deze conflicteren als uw hoofdcode ze gebruikt — verplaats ze indien nodig via de Expert-modus.

**Bekende limieten: **
- Enkele lineaire patroonlijst (nog geen sequentietabel per stem).
- Een 8-bits rijteller is beperkt tot 7 patronen × 32 rijen.
- C64 `$D418` Het globale volume wordt gedeeld over alle stemmen — de volumeregelaar per instrument is informatief; het sustainniveau (`S` van ADSR) is het effectieve volume per stem.
- De audiopreview op de website is bij benadering: de PWM-modulatie, ring/sync en de eigenschappen van het SID-filter wijken af van de daadwerkelijke chip.

---

### Curve-editor

Genereert kant-en-klare `.byte` opzoektabellen op basis van wiskundige krommen — sinus, easing, driehoek/zaagtand/vierkant en bounce. Ideaal voor spritebeweging, rastereffecten, kleurwisselingen of elke animatie die wordt aangestuurd door een vooraf berekende tabel. Openen via het **Curve Editor**-pictogram in de bovenste werkbalk (naast de SID Editor-knop).

**Curven:** Sinus, Cosinus, Lineair, Ease In/Out/InOut (Kwadraat en Kubiek), Ease In/Out (Cirkel), Driehoek, Zaagtand, Vierkant en Ease In/Out/InOut Bounce.

**Besturing:**
| Controle                   | Doel                                                                                                                                                                                          |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Start-/eindwaarde**      | Uitgangsbereik: 0..255 in 8-bits modus, 0..320 in 16-bits modus.                                                                                                                              |
| **Aantal waarden**         | Tabellengte, 4–512 items.                                                                                                                                                                     |
| **Cycli**                  | Hoeveel oscillaties over de hele tabel (alleen sinus/cosinus/driehoek/zaagtand/vierkant). Breuken worden geaccepteerd (bijv. `3.625`).                                                        |
| **Fase**                   | Faseverschuiving in graden (alleen sinus/cosinus).                                                                                                                                            |
| **Combineer tweede curve** | Meng een tweede curve met **Mix / Add / Multiply / Min / Max / Subtract**, zijn eigen cycli/fase en een menghoeveelheid. Beide broncurven worden als stippellijnen op de grafiek weergegeven. |
| **Label**                  | Tabellabel (automatisch voorgesteld op basis van de curvenaam).                                                                                                                               |
| **Nummerformaat**          | `$XX` hexadecimaal of decimaal.                                                                                                                                                               |
| **Waarden per regel**      | 8 / 16 / 32 bytes per `.byte` regel.                                                                                                                                                          |

**Uitvoermodi: **
| Modus      | stoot uit                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **8-bit**  | Een enkele `.byte` tabel (waarden 0..255). Gelezen met `LDX #index / LDA tabel,X`. Optioneel genereert een **sprite-Y leesroutine** (`<label>_set_y`) — `LDA <label>,X` / `STA $D001+2N` — voor een selecteerbaar spritenummer 0-7.                                                                                                                                                                                             |
| **16-bit** | Twee parallelle byte-tabellen — `<label>_lo` (lage 8 bits) en `<label>_hi` (9e bit, 0/1) — geïndexeerd door de **same** X (2 bytes per item). Nodig voor sprite X over het volledige scherm (0..320 > één byte). Optioneel wordt een **sprite-X leesroutine** (`<label>_set_x`) gegenereerd die de lage byte naar `$D000+2N` schrijft en de MSB van de sprite in `$D010` instelt/wist, voor een selecteerbaar spritenummer 0-7. |

Elke uitvoer van kopiëren/invoegen begint met een koptekstcommentaar waarin de curve, het werkelijke minimum/maximumbereik, het aantal items en het exacte gebruik (waarbij elke tabelinvoer wordt geregistreerd) worden beschreven.

**Voorbeeld:**
- **Grafiek** — de curve is getekend met waarde 0 aan de **bovenkant** en het maximum aan de **onderkant**, conform de C64 sprite-Y / rasterconventie (dus wat je ziet is wat de tafel op hardware aanstuurt). Een meta-lijn onder de grafiek toont het aantal bytes, de werkelijke minimum- en maximumwaarden van de gegenereerde waarden en de naam/namen van de curve(s).
- **Stuiterende bal** — animeert een marker door de tabel met het **Tempo** (5–240 waarden/sec). Bij tempo 50 komt dit overeen met één waarde per frame op PAL (50 Hz), d.w.z. één `.wait_raster` stap per index. Afspeel-/pauze- en herstartknoppen, een vervagend spoor van de laatste ~24 posities en een live `Index · Waarde` uitlezing.

**Kopiëren / Invoegen:** de twee pictogrammen van de werkbalk — **Kopiëren** plaatst de tabel op het klembord; **Invoegen in editor** voegt de tabel (en lezer, indien ingeschakeld) als blokken toe aan het huidige programma. Opnieuw invoegen **vervangt** de vorige invoeging in de Curve Editor in plaats van duplicaten te stapelen (werkt in blok- en expertmodus).

**Bestandenmenu:**
| Actie                           | Wat het doet                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Curve opslaan (.bin)…**       | Slaat de ruwe tabelbytes exact op zoals de C64 ze zou lezen via `INCBIN`. 16-bit: N lage bytes gevolgd door N hoge bytes.                                                                                                                                                                                                                                       |
| **Laadcurve (.bin)…**           | Laadt de onbewerkte tabelbytes terug in de editor, geïnterpreteerd volgens de huidige bitdiepte (16-bits: eerste helft laag, tweede helft hoog). De geladen tabel wordt ongewijzigd weergegeven totdat een curvebesturing een nieuwe curve genereert.                                                                                                           |
| **Exporteer demo naar blokken** | Voegt een complete, uitvoerbare sprite-demo toe: sprite-initialisatie, raster-gesynchroniseerde hoofdloop, de ingebedde tabel en bal-spritegegevens. X veegt van 0 tot 320 in 8.8 fixed point met de `$D010` MSB terwijl de tabel de sprite-Y aanstuurt — exact overeenkomend met de preview in de editor. Re-export vervangt de vorige Curve Editor-invoeging. |

**Overeenkomend met de preview op de C64:** de preview leest de tabel **lineair, in een lus van 0 → N-1 → 0, één waarde per frame**. Om dit exact te reproduceren, moet u de tabel op dezelfde manier aansturen (de index één keer per frame verhogen, terugspringen bij de lengte van de tabel). Een pingpong- of gedeeltelijke weergave zal anders bewegen, ook al zijn de byte-waarden identiek. Zie `samples/curve-new-demo.asm` voor een werkend 16-bits sprite-X-voorbeeld.

---


*© 2026 Zsolt Tarczali — C64 Visuele Assembler*
