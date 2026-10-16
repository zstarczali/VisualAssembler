# C64 Visual Assembler — Gebruikershandleiding

**Versie 2.6.0**

Een visuele, blokgebaseerde 6502-assembler voor de Commodore 64. Bouw
programma's door instructieblokken te slepen en neer te zetten, en bekijk de
gegenereerde assembly- en machinecode in realtime.

---

## Inhoudsopgave

- [C64 Visual Assembler —
  Gebruikershandleiding](#c64-visual-assembler--user-manual)
    - [Hoogtepunten van versie 2.6.0](#version-260-highlights)
    - [Hoogtepunten van versie 2.5.9](#version-259-highlights)
    - [Hoogtepunten van versie 2.5.8](#version-258-highlights)
    - [Hoogtepunten van versie 2.5.7](#version-257-highlights)
    - [Hoogtepunten van versie 2.5.6](#version-256-highlights)
    - [Hoogtepunten van versie 2.5.5](#version-255-highlights)
    - [Hoogtepunten van versie 2.5.4](#version-254-highlights)
    - [Hoogtepunten van versie 2.5.3](#version-253-highlights)
    - [Hoogtepunten van versie 2.5.2](#version-252-highlights)
    - [Hoogtepunten van versie 2.5.1](#version-251-highlights)
    - [Hoogtepunten van versie 2.5.0](#version-250-highlights)
    - [Hoogtepunten van versie 2.4.9](#version-249-highlights)
    - [Hoogtepunten van versie 2.4.8](#version-248-highlights)
    - [Hoogtepunten van versie 2.4.7](#version-247-highlights)
    - [Hoogtepunten van versie 2.4.6](#version-246-highlights)
    - [Hoogtepunten van versie 2.4.5](#version-245-highlights)
    - [Hoogtepunten van versie 2.4.3](#version-243-highlights)
    - [Hoogtepunten van versie 2.4.2](#version-242-highlights)
    - [Hoogtepunten van versie 2.4.1](#version-241-highlights)
    - [Hoogtepunten van versie 2.4.0](#version-240-highlights)
    - [Hoogtepunten van versie 2.3.9](#version-239-highlights)
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
    - [Versiebeheer](#version-control)
    - [Gratis en open source](#free-and-open-source)
    - [Een bug melden](#reporting-a-bug)
    - [Projecttemplates](#project-templates)
    - [Project bouwen](#build-project)
    - [Voorbeeldprogramma's](#example-programs)
    - [Laad .asm-bestand (snelle referentie)](#load-asm-file-quick-reference)
      - [Import parsing notes and best
        practices](#import-parsing-notes-and-best-practices)
  - [Ultieme Basismodus](#ultimatebasic-mode)
    - [UB-editor openen](#opening-the-ub-editor)
    - [Editortools](#editor-tools)
    - [Projecten, tabbladen en
      opstartbestanden](#projects-tabs-and-startup-files)
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
    - [De `*` programmateller in
      expressies](#the--program-counter-in-expressions)
    - [Lokale (gestippelde) labels](#local-dotted-labels)
    - [Operandlabels voor zelfmodificerende
      code](#self-modifying-code-operand-labels)
  - [8. Standaard 6502-instructies](#8-standard-6502-instructions)
    - [Gegevensverplaatsing](#data-movement)
    - [Rekenen](#arithmetic)
    - [Logica](#logic)
    - [Sprongen & Vertakkingen](#jumps--branches)
    - [LBNE / LBEQ / … (Lange takken)](#lbne--lbeq---long-branches)
    - [Registerbewerkingen](#register-operations)
    - [Verschuiven & Roteren](#shift--rotate)
    - [Stack](#stack)
    - [Systeem / Vlaggen](#system--flags)
    - [Onwettige / niet-gedocumenteerde
      instructies](#illegal--undocumented-instructions)
  - [9. Macroblokken — Referentie](#9-macro-blocks--reference)
    - [LABEL](#label)
    - [COMMENTAAR](#comment)
    - [BYTE](#byte)
    - [WOORD](#word)
    - [INVULLEN](#fill)
    - [UITLIJNEN](#align)
    - [TEKST 1}
    - [STRING](#string)
    - [DATA](#data)
    - [RAWBYTES](#rawbytes)
    - [RAWTEXT](#rawtext)
    - [PETSCII](#petscii)
    - [CHARSET](#charset)
    - [CHARDEF](#chardef)
    - [BOX_HIT](#box_hit)
    - [INCBIN](#incbin)
    - [KOALA](#koala)
    - [NIVEAU / NIVEAU_RIJ](#level--level_row)
      - [NIVEAU](#level)
      - [NIVEAU_RIJ](#level_row)
    - [SID](#sid)
    - [INCLUDE](#include)
    - [TABEL](#table)
    - [ORG](#org)
    - [LOOP / NEXT](#loop--next)
      - [LOOP](#loop)
      - [VOLGENDE](#next)
    - [VOOR / EINDE](#for--endf)
      - [VOOR](#for)
      - [ENDF](#endf)
    - [DUWEN / TREKKEN](#push--pull)
      - [DUWEN](#push)
      - [TREKKEN](#pull)
    - [END / RTS alias](#end--rts-alias)
    - [MACRO / ENDM / INVOKE](#macro--endm--invoke)
      - [MACRO (definitie start)](#macro-definition-start)
      - [ENDM (einde definitie)](#endm-definition-end)
      - [AANROEPEN](#invoke)
    - [REGIO / ENDREGIO](#region--endregion)
    - [DEFINITIE / ALS / ANDERS / EINDE ALS](#define--if--else--endif)
    - [.ASSERT](#assert)
      - [DEFINITIE](#define)
      - [ALS](#if)
      - [ANDERS](#else)
    - [ENDIF](#endif)
    - [CONST](#const)
    - [VAR](#var)
    - [Runtime IF / ELSE / ENDIF](#runtime-if--else--endif)
    - [WHILE / ENDW](#while--endw)
    - [HERHALEN / TOTDAT](#repeat--until)
    - [MEMCPY / MEMSET](#memcpy--memset)
    - [PRINT / PRINT_CHAR / PRINT_HEX / CLEAR_SCREEN / WAIT_KEY / DELAY /
      SET_BORDER /
      SET_BG](#print--print_char--print_hex--clear_screen--wait_key--delay--set_border--set_bg)
    - [IRQ_SETUP](#irq_setup)
    - [RAND](#rand)
    - [SPRITE_INIT](#sprite_init)
    - [SPRITE\_POS](#sprite_pos)
    - [WAIT\_RASTER](#wait_raster)
    - [JOYSTICK](#joystick)
    - [MUIS](#mouse)
    - [SPRITE\_COL](#sprite_col)
    - [LAADBESTAND](#loadfile)
    - [EXODECRUNCH](#exodecrunch)
    - [REU\_CHECK](#reu_check)
    - [REU\_STASH / REU\_FETCH / REU\_SWAP](#reu_stash--reu_fetch--reu_swap)
    - [TURBO_SET](#turbo_set)
    - [SUPERCPU_DETECT](#supercpu_detect)
    - [TURBO_ENABLE](#turbo_enable)
    - [MAP\_COPY](#map_copy)
    - [MAP\_COPY16X16](#map_copy16x16)
    - [SPRITE_ANIM](#sprite_anim)
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
  - [12b. CRT-export (Magic Desk
    64K-cartridge)](#12b-crt-export-magic-desk-64k-cartridge)
  - [13. Hardware-instellingen](#13-hardware-settings)
    - [VICE Emulator](#vice-emulator)
    - [Exomizer](#exomizer)
    - [Retro Debugger](#retro-debugger)
    - [C64 Ultimate / 1541 Ultimate](#c64-ultimate--1541-ultimate)
    - [Kung Fu Flash 2](#kung-fu-flash-2)
  - [14. Visuele editors (toolkit)](#14-visual-editors-toolkit)
    - [Editor voor hoge resolutie / meerkleurig](#hi-res--multicolor-editor)
    - [Sprite-editor](#sprite-editor)
    - [C64 Character ROM Browser ("Char
      map")](#c64-character-rom-browser-char-map)
    - [Tekeneditor (Tekenset)](#character-editor-charset)
    - [Tekenset Canvas Editor](#charset-canvas-editor)
    - [Kaarteditor (Meerlaagse tegelkaarten)](#map-editor-multilayer-tilemaps)
    - [Niveau-editor](#level-editor)
    - [SID-editor (3-stemmen tracker)](#sid-editor-3-voice-tracker)
    - [SID Speler](#sid-player)
    - [Curve-editor](#curve-editor)
    - [Nummeromzetter](#number-converter)

---

## Hoogtepunten van versie 2.6.0

- **Visual Assembler is nu volledig gratis** — de Freemium/Professional-licentie
  is verwijderd. Elke editor, build- en hardware-uitvoeringsoptie, alle 7
  UI-talen en elk thema werken voor iedereen, zonder registratie of serienummer.
  De reden is simpel: volgens de Hongaarse belastingregels zou de verkoop van
  het programma na aftrek van belastingen en administratie te weinig opleveren
  om de moeite waard te zijn. Serienummers die u al heeft, zijn simpelweg niet
  meer nodig. Zie [Gratis en open source](#free-and-open-source).

---

## Hoogtepunten van versie 2.5.9

- **Commodore 64-thema** — het opstartscherm van de C64: een lichtblauwe rand
  rond blauwe panelen, lichtblauwe tekst, knoppen voor omgekeerde video,
  syntaxkleuren uit het C64-palet en het C64-lettertype in de monitorweergave.
- **Commodore Beige thema** — de klassieke broodtrommel: beige behuizing,
  mosterdkleurige functietoetsen, de regenboogkleurige badge-strepen en een
  C64-blauwe monitorweergave. Selecteer het in de themakiezer of wissel
  ernaartoe met de themaknop. Zie [Instellingen en
  werkbalk](#5-settings--toolbar).
- **Commodore Starlight-thema** — een licht thema na de doorschijnende
  C64-broodbak: mat helder glas met een regenboogkleurige RGB-gloed die
  erdoorheen schijnt, een magenta accent, regenboogkleuren voor de syntax en een
  rokerig donker schermbeeld.
- **Versiebeheerdialoog** — het dialoogvenster kan aan de koptekst worden
  versleept en wordt opnieuw geopend waar u het hebt achtergelaten; het blijft
  op het scherm staan wanneer het logboek of een diff het groter maakt, en een
  klik buiten het dialoogvenster sluit het niet langer (Esc doet dat wel). Zie
  [Versiebeheer](#version-control).
- ** Versiebeheer op projectniveau** — voor een tabblad van een geopend `.proj`
  project, zorgt een ** Bestand / Project** schakelaar ervoor dat elk
  bronbestand van het project (projectstructuur + opgenomen bestanden) in één
  vermelding wordt vastgelegd. Het logboek toont de gewijzigde bestanden van
  elke commit, Diff werkt bestand voor bestand, Checkout herstelt alle bestanden
  in de editortabbladen en er worden ook automatisch opgeslagen vermeldingen per
  project gemaakt. In Git-modus dekken het logboek en diff de hele repository.
  Zie [Projectmodus](#project-mode).

---

## Hoogtepunten van versie 2.5.8

- **Versiebeheer** — de projectsnapshots zijn een git-achtig versiebeheer
  geworden: commits met een bericht en een korte hash, een logboek met **HEAD**,
  een **Diff** ten opzichte van de werkkopie, **Checkout** naar de editor en
  aparte autosave-items. Programma's in blokmodus (JSON) worden vergeleken als
  assemblagelijnen, zodat de diff echte wijzigingen laat zien. Werkt op de
  tabbladen Blok, Expert en Ultieme Basis. Zie [Versiebeheer](#version-control).
- **Git-integratie** — kies `git.exe` in **Instellingen → Versiebeheer** (of
  laat de app het vinden). Wanneer het project zich in een git-repository
  bevindt, toont het dialoogvenster de branch, de gewijzigde bestanden, commit
  (slaat eerst op), logboek, diff met een **RAW**-weergave, checkout, **Pull** /
  **Push** en **git init**.
- **Fout melden** — een ingebouwd meldingsformulier met maximaal 4
  schermafbeeldingen (bestand, Ctrl+V of slepen en neerzetten), optioneel
  e-mailadres, systeeminfo en de recente app-fouten. Zie [Een bug
  melden](#reporting-a-bug).
- **SID-speler** — **Schudden** en **favorieten** (★) per melodie. Zie
  [SID-speler](#sid-player).

---

## Hoogtepunten van versie 2.5.7

- **VA SID Core 1.2** — de SID Player gebruikt nu een native Rust C64-core: een
  cycle-exacte 6510 met precieze interrupt-timing, de CIA 6526A, VIC-II-timing
  met foutlijnen, sprite DMA en raster-interrupts, en de 6510 I/O-poort. Zie
  [SID Player](#sid-player).
- **Editor voor hoge resolutie** — twee kleuren in elke 8×8 cel: de nieuwe
  **Celpapier** tool. Zie [Editor voor hoge resolutie /
  meerkleurig](#hi-res--multicolor-editor).
- **Exacte karakter-ROM** in de ROM-viewer, de Character Editor's **Load ROM**
  en de Map/Level-editors.
- **Sprite-editor** — overlay met hoge resolutie, opvullen,
  selecteren/verplaatsen, roteren, alles spiegelen, sprite-sheet importeren,
  hitbox, X/Y ×2-voorbeeld. Zie [Sprite-editor](#sprite-editor).
- **Level Editor** — objecten, karakterkenmerken, randcontrole, kleuren per
  scherm, geheugenmeter met RLE, uitvoeren in VICE. Zie [Level
  Editor](#level-editor).
- **Tekeneditor** — ongedaan maken/opnieuw doen, tekengereedschappen, 90°
  roteren, kopiëren/plakken en slepen om te wisselen op de kaart, 2×2 tegels, de
  ROM-set met kleine letters, een tekstvoorbeeld en bereikexport. Zie
  [Tekeneditor](#character-editor-charset).
- **Tekensetcanvas** — zoom 2×–24× (schuifregelaar of Ctrl+wiel) met een
  pixelraster, achtergrondkleur in de hoge-resolutiemodus, tekens in hoge
  resolutie in de meerkleurige modus en **ECM** (een achtergrond per teken). Zie
  [Tekensetcanvas-editor](#charset-canvas-editor).

---

## Hoogtepunten van versie 2.5.6

- **SID Player** — een nieuwe knop in de werkbalk opent een zwevende speler voor
  `.sid` (PSID / RSID) nummers: een afspeellijst met slepen en neerzetten,
  vorige/volgende nummer, subnummers, zoeken en ±10 s, volume en afspeellijst
  opslaan/openen (`.sidpl`); de lijst en de vensterstatus worden onthouden. Zie
  [SID Player](#sid-player).
- **VA SID Core 1.1** — een ingebouwde SID-emulatie (MOS 6581/8580, met een op
  MOS 6581/8580 gebaseerd 6581-filter) en een cycle-locked PSID/RSID-speler
  (6510 CPU, CIA/VIC-timing). Selecteer deze in **Instellingen →
  SID-voorbeeld**; de SID-speler toont welke engine wordt afgespeeld.
- **SID Editor** — knoppen voor de instrumentparameters, een bredere
  ADSR-grafiek, **MIDI-ingang**, **opnemen** in de tracker (een nieuw patroon
  wordt toegevoegd wanneer het huidige patroon vol is), een **metronoom** met
  beatlampjes, **patroon verwijderen**, het mastervolume op VA-VK, en
  **GoatTracker .sng importeren**. Zie [SID
  Editor](#sid-editor-3-voice-tracker).
- **Ultimate Basic 1.6.4** meegeleverd.

---

## Hoogtepunten van versie 2.5.5

- **Editor voor hoge resolutie: pixelraster en 16× zoom** — met **Raster**
  ingeschakeld, krijgt elke pixel vanaf 4× zoom een eigen rasterlijn, die
  sterker is op de randen van de tekencellen en gearceerd is zodat deze
  zichtbaar blijft in alle 16 kleuren. De zoomschuifregelaar gaat nu tot 16×.
  Zie [Editor voor hoge resolutie / meerkleurig](#hi-res--multicolor-editor).
- **Rechtsklikken op het menu Kopiëren/Plakken** — op het canvas van de Hi-Res-
  en Kaarteditors (Kopiëren, Plakken, Transparant plakken) en in de
  Sprite-editor (Kader kopiëren, Kader plakken, ook op de kaderstrook). Het
  plakken is gestart vanuit de menuvoorbeelden waarop u hebt geklikt.
- **Getalomzetter** — de knop in de werkbalk blijft gemarkeerd zolang de
  omzetter wordt weergegeven.
- **Opgelost** — het raster van de meerkleurige cellen in de Hi-Res Editor was
  twee keer zo breed als een tekencel; de Hi-Res werkbalk **Plakken**-knop
  plakte altijd transparant; het rechtermuisklikmenu van de SID Editor opende
  buiten de cursor terwijl het dialoogvenster gecentreerd was.
- **In deze handleiding** worden nu de selectie, het kopiëren/plakken en het
  transparant plakken van de Hi-Res Editor beschreven.

---

## Hoogtepunten van versie 2.5.4

- **Opgelost: venster verschijnt niet bij herstart** — als de app werd
  afgesloten terwijl het venster geminimaliseerd of verborgen was (vooral op
  macOS, maar ook op Linux/Wayland), kon het voorkomen dat bij de volgende
  opstart het venster niet werd weergegeven. De zichtbaarheidsstatus wordt niet
  langer opgeslagen (de venstergrootte wel), en het venster wordt altijd
  weergegeven bij het opstarten.
- **Ultimate Basic 1.6.3 meegeleverd** — QBasic-achtige syntaxis: `dim naam als
  type` voor variabelen en arrays van elk type, `functie` / `sub` met `als`
  typen, `elseif`, `do … loop`, `while … wend`, `select case`, `exit do` / `exit
  sub`, op één regel `if`, `'` opmerkingen en `print a; b; c`; runtime strings
  (`+`, `left$` / `right$` / `mid$`) en ondertekende 16-bits `integer`.
  Gemarkeerd, voltooid en opgemaakt in de UB-editor, met nieuwe **DIM**,
  **FUNCTION**, **ELSEIF**, **DO**, **WEND**, **SELECT CASE**, **END**, **EXIT
  SUB** en **LEFT$** / **RIGHT$** / **MID$** vermeldingen in het paneel
  Opdrachten. Zie [UltimateBasic Mode](#ultimatebasic-mode).

---

## Hoogtepunten van versie 2.5.2

- **SID Editor-voorbeelden op de echte SID** — instrumentvoorbeeld, virtueel
  toetsenbord, noteninvoer, akkoord/arpeggio, rij- en enkelpatroonweergave
  worden via WebSid afgespeeld; de synthesizer blijft alleen als terugvaloptie
  beschikbaar. Zie [SID Editor]{1}.

---

## Hoogtepunten van versie 2.5.1

- **SID Editor-instrumenten** — filterroutering per stem, **3 UIT** en een
  resonantie-afsnijding **sweep** (start, einde, snelheid, pingpong); instrument
  **vibrato** (vertraging, snelheid, diepte); **pulsbreedtemodulatie**;
  **gatetimer**, **harde herstart** en golfvorm van het eerste frame; een
  **golf-/arpeggiotabel** met presets; **RING** en **SYNC**. Zie [SID
  Editor](#sid-editor-3-voice-tracker).
- **Nieuwe SID-speler** — de geëxporteerde speler voert de instrumentmodulatie
  elke frame uit (`JSR sid_frame` voor je eigen IRQ); de preview geeft dezelfde
  speler weer via een kleine SID-synthesizer. `.bin` bewaart instrumentnamen en
  snelheid.
- **Virtueel toetsenbord** — 2, 3 of 4 octaven in een Commodore 64 synth-look.
- **Ultimate Basic 1.6.2 gebundeld** — `tune` krijgt `imod`, `ifilt`, `igate` en
  `itab`; **Exporteren naar UltimateBasic** schrijft ze weg.
- **Bladwijzers en Ga naar regel** in de Expert- en Ultimate Basic-editors —
  Ctrl+F2 / F2 / Shift+F2, Ctrl+G.
- **Opgelost:** labeluitdrukkingen (`.assert`, `LEVEL_MULTICOLOR*16`, `*`)
  werken weer in de geïnstalleerde app (geen `eval` onder de release CSP).

---

## Hoogtepunten van versie 2.5.0

- **Niveau-editor** — een nieuwe werkbalk-editor rangschikt de schermen van de
  kaarteditor verticaal, horizontaal of in een 2D-raster en toont een voorbeeld
  van het hele niveau met vloeiend scrollen. Zie
  [Niveau-editor](#sid-editor-3-voice-tracker).
- **LEVEL / LEVEL_ROW macro's** — `.level "level.bin"[, $addr]` plaatst alleen
  de geplaatste schermen van een Level Editor-project plus pointertabellen en
  definieert `LEVEL_*` labels en constanten; `.level_row dst, col[, color]`
  kopieert één levelrij van 40 tekens naar een buffer. Zie [LEVEL /
  LEVEL_ROW]{1}.
- **JOYSTICK variabele modus** — `.joystickpoort, vx, vy[, vuur]` schrijft de
  richting naar variabelen (−1 / 0 / +1) in plaats van een sprite te
  verplaatsen; poort `3` leest beide joystickpoorten. Zie [JOYSTICK]{1}.
- **Level scroll demo** — `samples/level-demo.asm` laat een level van 2×5
  schermen pixel voor pixel in elke richting scrollen met de joystick, zonder
  tearing, met ruimte over voor sprites en spelcode.
- **Getalomzetter** — een niet-modaal DEC/HEX/BIN-dialoogvenster op de werkbalk.
  Zie [Getalomzetter]{1}.
- **Dialoogvenster met voorbeelden** — **Menu → Voorbeelden…** opent een
  doorzoekbare, gecategoriseerde lijst van de ingebouwde voorbeeldprogramma's.
  Zie [Voorbeeldprogramma's]{1}.
- **Ultimate Basic 1.6.1 gebundeld** — `map load "level.bin"[, addr]` leest een
  Level Editor-project direct in, en de nieuwe `map view px, py` scrollt de
  kaart soepel en zonder tearing op een pixelpositie (voorbeeld:
  `level_scroll_demo.ub`). Een byteproduct binnen een 16-bits som wordt niet
  langer afgekapt tot 8 bits. De UB-opdrachtreferentie vermeldt `map view`, en
  de zoekopdracht plaatst overeenkomsten met de opdrachtnaam eerst.

---

## Hoogtepunten van versie 2.4.9

- **Projectsjablonen** — **Menu → Bestand → Nieuw project vanuit sjabloon…**, of
  de nieuwe knop in de werkbalk tussen **Menu** en **Tutorials**, maakt een
  kant-en-klaar `.proj`-project aan in een eigen map. Het dialoogvenster heeft
  een **Assembler**-sectie (leeg programma, spelskelet, hoge resolutie en
  meerkleurige bitmap) en een **UltimateBasic**-sectie (leeg programma,
  spelskelet, hoge resolutie bitmap, raster IRQ), met een syntax-gemarkeerde
  preview. Je eigen `.asm` / `.ub` sjablonen worden opgehaald uit de map met
  gebruikerssjablonen. Zie [Projectsjablonen](#level-editor).
- **Project bouwen** — **Menu → Bouwen → Project bouwen** compileert elk
  bouwbaar bestand van het geopende project (of van de geopende tabbladen) naar
  een `.prg` naast de broncode, schrijft debugsymboolbestanden waar beschikbaar,
  slaat include-only modules over en toont een rapport per bestand. Zie [Project
  bouwen](#level--level_row).
- **Ctrl + muiswiel zoomen** in de Expert- en Ultimate Basic-editors (`Cmd` +
  wiel op macOS; knijpen met het touchpad werkt ook).
- **Werkruimtes onthouden projecten** — de projectstructuren van Expert en
  Ultimate Basic, het opstartbestand en niet-opgeslagen projectwijzigingen
  worden opgeslagen in de `.vaws` werkruimte en daarmee hersteld. Oudere
  werkruimtes blijven geopend.
- **Ultimate Basic** — de meegeleverde compiler genereert snellere, kleinere
  6502-code; de geheugenkaart maakt nu onderscheid tussen echte code en data,
  opvulling en lange `org` gaten.
- **Bestandsdialoogvensters worden geopend in de actieve werkmap** — de
  Block/Expert- of de Ultimate Basic-map, afhankelijk van de huidige modus.
- **Ultimate Basic 1.6.1 gebundeld** — `map load "level.bin"[, addr]` leest een
  Level Editor-project direct in, en de nieuwe `map view px, py` scrollt de
  kaart soepel en zonder tearing op een pixelpositie (voorbeeld:
  `level_scroll_demo.ub`). Een byteproduct binnen een 16-bits som wordt niet
  langer afgekapt tot 8 bits. De UB-opdrachtreferentie vermeldt `map view`, en
  de zoekopdracht plaatst overeenkomsten met de opdrachtnaam eerst.

---

## Hoogtepunten van versie 2.4.8

- **Nieuwe KOALA-macro** — `.koala "picture.koa"` (optioneel `, $2000`) laadt
  een Koala Painter-afbeelding en toont deze met een 86-byte weergaveroutine.
  Zie [KOALA](#project-templates).
- **Koala importeren/exporteren in de Hires-editor** — **Bestanden → Koala
  importeren (.koa)…** / **Koala exporteren (.koa)…** (standaardbestand van
  10003 bytes; afbeeldingen met hoge resolutie worden bij het exporteren
  gereduceerd tot meerdere kleuren). `.koa` / `.kla` worden ook herkend door
  **Afbeelding importeren / .bin**.
- **Ultimate Basic 1.5.9 meegeleverd** — nieuwe `chain "FILE" [, device]` (laad
  een ander programma over het draaiende programma en voer het uit); `load
  "FILE"` laadt naar het eigen adres van het bestand, `load "FILE", addr` naar
  `addr`; D64-correcties. `chain` is gemarkeerd en opgenomen in de
  commandoreferentie.
- **Updatestatus in de Expert-statusbalk** — dezelfde *Update* / klikbare
  *Update beschikbaar* indicator als in de Ultimate Basic-modus.
- **Opslaandialoogvensters** bieden het eigen bestandstype aan (bijv. *KOA*) in
  plaats van *Binair (\*.bin)*.
- **Betere updatecontrole** — de lijst met installatieprogramma's is
  gepubliceerd op c64va.tech/downloads/VA/, dus de controle werkt met de nieuwe
  downloadpagina; de Linux-updatehelper erft niet langer de
  AppImage-bibliotheekpaden.

---

## Hoogtepunten van versie 2.4.7

- **In-app updates** — **Menu → Controleren op updates** controleert c64va.tech
  op een nieuwere versie en downloadt, na bevestiging, het installatieprogramma
  voor uw platform met een voortgangsbalk en installeert het. Zie [In-app
  updates](#koala). De controle wordt ook op de achtergrond uitgevoerd bij elke
  opstart.
- **Updatestatus in de Ultimate Basic-statusbalk** — toont **Update (vX)**, of
  een gemarkeerde **Update beschikbaar: vY** die het updatedialoogvenster opent
  wanneer erop geklikt wordt.
- **Curve Editor → UltimateBasic exporteren** — **Bestanden → Exporteren naar
  UltimateBasic** schrijft de tabel als een geïnitialiseerde UB-array;
  **Bestanden → UltimateBasic-demo exporteren** produceert een kant-en-klare
  UB-sprite-demo. Zie [Curve Editor]{1}.
- **Ultimate Basic 1.5.8 gebundeld** — de nieuwe **`data <array>: v, …`** vorm
  vult een gedeclareerde `array` / `array_word` bij programmastart (verdere
  regels gaan verder waar de vorige is geëindigd, woordarrays nemen 16-bits
  waarden aan) zonder de `read` stream aan te raken.
- **Layout past zich aan het venster aan** — de editorpanelen nemen precies de
  resterende vensterhoogte in beslag, waardoor de app geen verticale schuifbalk
  op paginaniveau meer weergeeft; het ASM-uitvoerpaneel behoudt een minimale
  breedte van 440 px; het pad naar de werkmap bevindt zich in een subtiele badge
  boven de titel van de ASM-weergave en gebruikt dezelfde badge in de Expert- en
  Ultimate Basic-werkbalken. Labels van dialoogvensterknoppen worden niet langer
  afgebroken.
- **Betere updatecontrole** — de lijst met installatieprogramma's is
  gepubliceerd op c64va.pro/downloads/VA/, dus de controle werkt met de nieuwe
  downloadpagina; de Linux-updatehelper erft niet langer de
  AppImage-bibliotheekpaden.

---

## Hoogtepunten van versie 2.4.6

- **In-app updates** — **Menu → Controleren op updates** controleert c64va.pro
  op een nieuwere versie en downloadt, na bevestiging, het installatieprogramma
  voor uw platform met een voortgangsbalk en installeert het. Zie [In-app
  updates](#in-app-updates). De controle wordt ook op de achtergrond uitgevoerd
  bij elke opstart.
- **Update Ultimate Basic-taal** — syntaxmarkering en de commandoreferentie
  omvatten nu **`sfx`** (niet-blokkerend SID-effect: `sfx-kanaal, frequentie,
  frames [, golf]`), **`org`** (vervolg sub/fn-code op een adres, waarbij een
  met nullen gevulde ruimte overblijft die `incbin`-gegevens kan bevatten),
  **`charset on` / `charset off`** (schakel de VIC-II over naar de RAM-tekenset
  en terug) en **`incbin` slicing** (`incbin "font.prg", $3C00, 2` slaat de
  eerste bytes over, een optioneel vierde argument beperkt de lengte).
- **Markering van meerdere blokken in de ASM-weergave** — door meerdere blokken
  te selecteren worden al hun ASM-regels tegelijk gemarkeerd, de scrollpositie
  blijft stabiel tijdens het selecteren en de regelnummers zijn zachter met een
  subtiele verticale scheidingslijn.
- **Assemblermodus blijft behouden bij het wisselen tussen Ultimate Basic-modi**
  — het openen van een project of een ingebouwd voorbeeld terwijl Ultimate Basic
  actief is, verlaat nu eerst UB en keert terug naar uw laatst gebruikte
  blok-/expertmodus, zodat de UB-buffer de modus of titel van het nieuwe tabblad
  niet langer kan overschrijven. Nieuwe tabbladen worden in de juiste modus
  aangemaakt.
- **Kung Fu Flash 2-instellingen** — een **USB detecteren**-knop in
  Hardware-instellingen scant opnieuw naar de seriële poort van de cartridge, en
  de KFF2-vereisten vermelden nu de vereiste Kung Fu Flash-firmware (v2.07+).
- **Ultieme Basic-opdrachtreferentie** — `tune` en `music` tonen volledige, van
  commentaar voorziene voorbeelden (celindeling, effecten, spelernotities,
  `music play N`); `inst`, `order`, `pat` en de tune `speed` hebben hun eigen
  vermeldingen; `data` toont de nieuwe arrayvorm; de `load sid`-syntaxis is
  gecorrigeerd (`load sid "tune.sid", $2000`).

---

## Hoogtepunten van versie 2.4.5

- **Ondersteuning voor Kung Fu Flash 2 — voer je programma's uit op een echte
  Commodore 64/128.** Een nieuwe **Kung Fu Flash 2** optie in het gesplitste
  **Uitvoeren** menu compileert het programma en uploadt het via USB
  rechtstreeks naar een echte, ingeschakelde C64 (of C128) met een Kung Fu Flash
  2 cartridge — geen disk image, geen SD-kaart kopiëren, geen emulator. Het
  werkt in Block-, Expert- en Ultimate Basic-modus. De USB-seriepoort van de
  cartridge wordt automatisch gedetecteerd (en kan handmatig worden ingevoerd);
  zie [Kung Fu Flash 2]{1} voor de installatie en de exacte workflow.
- **Programma-/ASM-panelen met aanpasbare grootte** — een dunne verticale
  scheidingslijn tussen het programmapaneel en het ASM/uitvoerpaneel laat u de
  grens naar links of rechts slepen (minimaal 260 px per paneel). Met de
  pijltjestoetsen kunt u de lijn verschuiven, dubbelklikken zet de verdeling
  terug naar 50/50 en de positie wordt onthouden tussen sessies. De
  scheidingslijn is verborgen in de Expert- en Ultimate Basic-modus en in de
  smalle gestapelde lay-out.
- **Schonere macroregels in de ASM-weergave** — macroblokken worden nu
  weergegeven zonder de voorafgaande commentaarmarkering (`.print "HALLO"`, `.if
  A == 1`, `.sprite_init …` in plaats van `; .print …`), en de
  ASM-syntaxmarkering kleurt ze als macro's. Gewone COMMENT-blokken en
  regiomarkeringen beginnen nog steeds met `;`.
- **Aangepaste macro-markering in de Expert-editor** — de macronaam na `.macro`,
  `.invoke` en `.call` (en Kick-stijl `:name(...)`-aanroepen) heeft een eigen
  kleur, net als de `{param}`-vervangingen in de macrobody en de parameternamen
  in de `.macro`-header, in elk thema.
- **Vernieuwd 'Over'-dialoogvenster** — een bredere lay-out met twee kolommen,
  waarin project-, licentie- en creditlinks zijn gegroepeerd, en de Ultimate
  Basic-banner heeft nu een transparante achtergrond zodat deze in elk thema
  past.

---

## Hoogtepunten van versie 2.4.3

- **SID-editor: Lijst met nummers/volgorde** — patronen worden nu gerangschikt
  via een correcte lijst met nummers/volgorde bovenop de ruwe patroonbank, zodat
  een patroon kan worden herhaald en het nummer langer kan zijn dan het aantal
  opgeslagen patronen. Stappen kunnen direct vanuit de SID-editor worden
  toegevoegd, verwijderd en opnieuw worden gerangschikt; zowel de weergave als
  de geëxporteerde speler doorlopen deze lijst in plaats van de ruwe
  patroonvolgorde.
- **SID Editor: Effectkolom** — elke trackercel kan nu een effect naast de noot
  bevatten: **V**vibrato, slide **U**p / **D**own, noot-**C**ut en
  snelheidsverandering (**F**). Typ het direct in een cel, bijvoorbeeld `C-4 01
  V24` (noot + instrument + vibrato) of `F06` (alleen snelheidsverandering).
  Effecten worden één keer per rij uitgevoerd, overeenkomend met de
  geëxporteerde speler, en worden nu correct afgespeeld, zowel in de Web
  Audio-preview in de app als in de gecompileerde 6502-export — een echte,
  speelbare effectengine, geen export-structuur.
- **Achterwaarts compatibel SID-opslagformaat** — SID-opslagen bevatten nu een
  versieaanduiding, zodat oudere `.bin`-opslagen die zijn gemaakt voordat de
  effectkolom bestond, precies hetzelfde blijven laden als voorheen, alleen
  zonder de effecten.
- **D64 Editor: expliciete opslagworkflow** — elke bewerking
  (toevoegen/extraheren/hernoemen/verwijderen, en nu ook bytebewerkingen in de
  blokeditor) vindt plaats op een privéwerkkopie; niets raakt uw echte
  `.d64`-bestand aan totdat u op **Opslaan** klikt, waarbij eerst ook een
  automatische back-up wordt gemaakt. Het sluiten van de editor of het openen
  van een andere schijf met niet-opgeslagen wijzigingen vraagt nu om bevestiging
  in plaats van ze stilzwijgend te negeren.
- **D64 Editor: Blokeditor hex-raster** — de ruwe byteweergave voor het
  geselecteerde blok van 256 bytes is nu een echt hex-raster per byte in plaats
  van een gewoon tekstvak, en het dialoogvenster dimt niet langer de rest van de
  app erachter wanneer het geopend is.
- **Web64 op de productwebsite** — een nieuwe Web64 IDE-sectie op
  [c64va.pro](https://www.c64va.pro).
- **Voorbeeldupdate** — het `macro-met-parameter` voorbeeld gebruikt nu de
  tussen haakjes geplaatste `.macro setColor(color)` vorm.

---

## Hoogtepunten van versie 2.4.2

- **Sleep en laat vallen op de D64 Editor** — sleep een gecompileerd
  `.prg`/`.bin`-bestand (van de exports van de SID/sprite/char-editors, of van
  elders) rechtstreeks naar de schijfkopie; het paneel 'Toevoegen' wordt geopend
  en is al ingevuld. Als u meerdere bestanden tegelijk sleept, worden ze één
  voor één in de wachtrij geplaatst.
- **Include-bestand genereren** — een nieuwe knop in de werkbalk schrijft een
  `.inc`-bestand met een lijst van `.const NAME = $ADDR` voor elke vermelding op
  de schijf, zodat het hoofdprogramma kan verwijzen naar de locatie van elke
  vermelding zonder de adressen handmatig opnieuw in te typen.
- **Blokeditor (nieuw)** — een schakelaar in de werkbalk schakelt de D64 Editor
  over naar directe toegang tot sporen/sectoren onder de directory: een
  aanklikbare blokkaart (gekleurd op basis van de vrije/gebruikte bitmap van de
  BAM, waarbij de BAM en de directoryketen afzonderlijk zijn gemarkeerd), een
  hex-weergave/editor voor het geselecteerde blok van 256 bytes en navigatie
  naar vorige/volgende sector. Leest en schrijft de schijfimage direct
  (`read_bin_file`/`write_bin_file`), onafhankelijk van `c1541`.
- **D64 Editor: expliciete opslagworkflow** — elke bewerking
  (toevoegen/extraheren/hernoemen/verwijderen, en nu ook bytebewerkingen in de
  blokeditor) vindt plaats op een privéwerkkopie; niets raakt uw echte
  `.d64`-bestand aan totdat u op **Opslaan** klikt, waarbij eerst ook een
  automatische back-up wordt gemaakt. Het sluiten van de editor of het openen
  van een andere schijf met niet-opgeslagen wijzigingen vraagt nu om bevestiging
  in plaats van dat ze stilzwijgend worden verwijderd.
- **D64 Editor: Blokeditor hex-raster** — de ruwe byteweergave voor het
  geselecteerde blok van 256 bytes is nu een echt hex-raster per byte in plaats
  van een gewoon tekstvak, en het dialoogvenster dimt niet langer de rest van de
  app erachter wanneer het geopend is.

---

## Hoogtepunten van versie 2.4.1

- **Poolse en Italiaanse UI-talen** — volledige interfacevertaling (menu's,
  dialoogvensters, beschrijvingen van sneltoetsen, Ultimate
  Basic-opdrachtreferentie) naast de bestaande Hongaarse, Engelse, Spaanse,
  Duitse en Nederlandse talen.
- **Online Help-werkbalkknop** — een nieuwe pictogramknop na Debug opent de
  meertalige documentatiesite ([c64va.tech/docs.html]{1}) rechtstreeks vanuit de
  app.
- **Gecentraliseerde mnemonische beschrijvingen:** per-taal mnemonische
  beschrijvingen zijn verplaatst naar het gedeelde vertaalbestand, samen met de
  rest van de UI-strings. Dit lost ook een hardnekkige bug op waarbij de Engelse
  beschrijvingen voor `PRINT`, `PRINT_HEX`, `CLEAR_SCREEN`, `WAIT_KEY`,
  `SET_BORDER`, `SET_BG`, `IRQ_SETUP` en `RAND` stilletjes werden overschreven
  door overgebleven Spaanse tekst.

---

## Hoogtepunten van versie 2.4.0

- **D64 Editor** — een volledige schijfimagebrowser op de werkbalk (na de Curve
  Editor). Open een bestaande `.d64`, maak een nieuwe lege aan of start de
  huidige schijf rechtstreeks in VICE, allemaal vanuit een menu Bestand ▾ dat
  overeenkomt met de andere visuele editors. Zie [D64 Editor (een bestaande
  schijfimage bekijken en bewerken)]{1}.
- **Online Help-werkbalkknop** — een nieuwe pictogramknop na Debug opent de
  meertalige documentatiesite
  ([c64va.pro/docs.html](https://www.c64va.pro/docs.html)) rechtstreeks vanuit
  de app.
- **Laadadres, decompressieadres en Exomizer in de D64 Editor** — door een
  onbewerkt bestand zonder header toe te voegen, kunt u een optioneel laadadres
  en een Exomizer-decompressiedoel instellen en het bestand tijdens het laden
  comprimeren met dezelfde `mem`/`sfx` crunch-modi als de extra bestanden in het
  dialoogvenster Exporteren naar D64. Een `.prg` dat al een eigen header heeft,
  slaat deze velden volledig over.

---

## Hoogtepunten van versie 2.3.9

- **`*` in elke expressie** — het programmatellersymbool werkt nu binnen
  operandexpressies, niet alleen op zichzelf: `BNE *-5`, `JMP *+20`, `LDA
  #&lt;*`, `LDA #&gt;(*+63)`. Een `*` die volgt op een waarde (`STRIDE*2`) is
  nog steeds vermenigvuldiging. Zie [Addressing Modes → De `*` programmateller
  in expressies](#d64-editor-browse--edit-an-existing-disk-image).
- **Lokale (gestippelde) labels** — een label zoals `.loop` behoort tot het
  bereik van het dichtstbijzijnde voorafgaande *globale* (niet-gestippelde)
  label, zodat `DrawSprite` en `ClearScreen` elk hun eigen `.loop` kunnen
  definiëren zonder conflict. Zie [Lokale (gestippelde) labels]{1}.
- **Pseudo-operaties met lange vertakkingen** — `LBNE`, `LBEQ`, `LBCC`, `LBCS`,
  `LBMI`, `LBPL`, `LBVC`, `LBVS` assembleren naar een omgekeerde vertakking over
  een `JMP` (altijd 5 bytes), zodat het doel zich op elke willekeurige afstand
  kan bevinden. Nieuwe paletcategorie **Lange vertakkingen**. Zie [LBNE / LBEQ /
  … (Lange vertakkingen)]{1}.
- **`.assert` directive** — `.assert end - start &lt;= 256` or `.assert * &lt;
  $A000, "message"` wordt geëvalueerd tijdens het assembleren en de build
  mislukt (waarbij de werkelijke waarde wordt weergegeven) wanneer de expressie
  onwaar is. Zie [.ASSERT]{1}.
- **Operandlabels voor zelfmodificerende code** — `LDA-waarde:#$00` definieert
  het label `waarde` dat naar de operandbyte van de instructie wijst, zodat
  `STA-waarde` deze direct patcht. Zie [Operandlabels voor zelfmodificerende
  code]{1}.
- **Vriendelijkere foutmeldingen bij vertakkingen buiten het bereik** — een
  vertakking die buiten −128…+127 terechtkomt, meldt nu precies hoeveel deze
  wordt overschreden en suggereert de overeenkomende `LBxx` lange vertakking.
- **Verbeterd:** De modusindicatorbadge in de werkbalk van het lichte thema
  (BLOKMODUS / EXPERTMODUS / …) is donkerder en beter leesbaar, en de
  glinsterende animatie is weer zichtbaar.

---

## 1. Interfaceoverzicht

De app is opgedeeld in drie hoofdpanelen:

- **`*` in elke expressie** — het programmatellersymbool werkt nu binnen
  operandexpressies, niet alleen op zichzelf: `BNE *-5`, `JMP *+20`, `LDA
  #&lt;*`, `LDA #&gt;(*+63)`. Een `*` die volgt op een waarde (`STRIDE*2`) is
  nog steeds vermenigvuldiging. Zie [Addressing Modes → De `*` programmateller
  in expressies](#the--program-counter-in-expressions).
- **Lokale (gestippelde) labels** — een label zoals `.loop` behoort tot het
  bereik van het dichtstbijzijnde voorafgaande *globale* (niet-gestippelde)
  label, zodat `DrawSprite` en `ClearScreen` elk hun eigen `.loop` kunnen
  definiëren zonder conflict. Zie [Lokale (gestippelde)
  labels](#local-dotted-labels).
- **Pseudo-operaties met lange vertakkingen** — `LBNE`, `LBEQ`, `LBCC`, `LBCS`,
  `LBMI`, `LBPL`, `LBVC`, `LBVS` assembleren naar een omgekeerde vertakking over
  een `JMP` (altijd 5 bytes), zodat het doel zich op elke willekeurige afstand
  kan bevinden. Nieuwe paletcategorie **Lange vertakkingen**. Zie [LBNE / LBEQ /
  … (Lange vertakkingen)](#lbne--lbeq---long-branches).
- **`.assert` directive** — `.assert end - start &lt;= 256` or `.assert * &lt;
  $A000, "message"` wordt geëvalueerd tijdens het assembleren en de build
  mislukt (waarbij de werkelijke waarde wordt weergegeven) wanneer de expressie
  onwaar is. Zie [.ASSERT](#assert).
- **Operandlabels voor zelfmodificerende code** — `LDA-waarde:#$00` definieert
  het label `waarde` dat naar de operandbyte van de instructie wijst, zodat
  `STA-waarde` deze direct patcht. Zie [Operandlabels voor zelfmodificerende
  code](#self-modifying-code-operand-labels).
- **Vriendelijkere foutmeldingen bij vertakkingen buiten het bereik** — een
  vertakking die buiten −128…+127 terechtkomt, meldt nu precies hoeveel deze
  wordt overschreden en suggereert de overeenkomende `LBxx` lange vertakking.

---

## 2. Blokpalet

Het palet aan de linkerkant toont alle beschikbare blokken, gegroepeerd per
categorie:

| Paneel                  | Beschrijving                                                                |
| ----------------------- | --------------------------------------------------------------------------- |
| **Links — Palet**       | Alle beschikbare instructie- en macroblokken. Zoek of blader per categorie. |
| **Centrum — Programma** | Jouw programma. Sleep blokken hierheen, herschik ze en bewerk de operanden. |
| **Rechts — Uitvoer**    | Live ASM-weergave en/of geheugenmonitoruitvoer.                             |

Gebruik het zoekvak **** bovenaan het palet om te filteren op naam. Klik op de
knop **Geselecteerd blok toevoegen** of sleep een blok naar het programmagebied.

In de blokmodus bevindt zich een dunne verticale scheidingslijn tussen het
programma- en uitvoerpaneel. Versleep deze om een van beide panelen meer ruimte
te geven (elk paneel behoudt minimaal 260 px), gebruik ← / → om de lijn in
stappen van 16 px te verschuiven, of dubbelklik erop om de verdeling terug te
zetten naar 50/50. De positie wordt opgeslagen in de
gebruikersinterface-instellingen. De scheidingslijn is verborgen in de
expertmodus en de ultieme basismodus, en wanneer het venster smal genoeg is om
de panelen te stapelen.

---

## 3. Programmagebied

Het palet aan de linkerkant toont alle beschikbare blokken, gegroepeerd per
categorie:

- **Sleep** blokken vanuit het palet, of **herschik** bestaande blokken door hun
  handvat (≡) te slepen.
- Elk blok toont zijn **mnemonic**, **operandveld** en **adresmodusselector**
  (indien van toepassing).
- Klik op de **▸ / ▾** schakelaar om een blok in te klappen of uit te vouwen.
- Gebruik de **× (verwijderen)** knop op een blok om het te verwijderen.
- **Alles inklappen** De knop vouwt alle blokken in één keer in.
- **Registerbewerkingen** — TAX, TAY, INX, DEX, …
- **Verschuiven en roteren** — ASL, LSR, ROL, ROR
- **Stack** — PHA, PHP, PLA, PLP
- **Systeem** — CLC, SEC, NOP, BRK, …
- **Onwettige instructies** — LAX, SAX, DCP, …
- **Structuur** — LABEL, COMMENTAAR, REGIO, EINDREGIO
- **Macro's** — LOOP, NEXT, FOR, ENDF, PUSH, PULL, END, TEXT, BYTE, WORD, FILL,
  ALIGN, ASSERT, STRING, DATA, RAWBYTES, RAWTEXT, PETSCII, CHARSET, INCBIN, SID,
  INCLUDE, TABLE, ORG, MACRO, ENDM, INVOKE, IF, ELSE, ENDIF, VAR, WHILE, ENDW,
  REPEAT, UNTIL, MEMCPY, MEMSET, PRINT, PRINT_CHAR, PRINT_HEX, CLEAR_SCREEN,
  WAIT_KEY, DELAY, SET_BORDER, SET_BG, IRQ_SETUP, RAND, SPRITE_INIT, SPRITE_POS,
  WAIT_RASTER, JOYSTICK, MOUSE, SPRITE_COL, LOADFILE, REU_CHECK, REU_STASH,
  REU_FETCH, REU_SWAP, TURBO_SET, SUPERCPU_DETECT, TURBO_ENABLE, MAP_COPY,
  MAP_COPY16X16, SPRITE_ANIM, SCORE_BCD

Gebruik het zoekvak **** bovenaan het palet om te filteren op naam. Klik op de
knop **Geselecteerd blok toevoegen** of sleep een blok naar het programmagebied.

---

## 4. ASM-weergave

- **Sleep ** blokken vanuit het palet, of **herschik ** bestaande blokken door
  hun handvat (≡) te slepen.
- Elk blok toont zijn **mnemonic**, **operandveld** en **adresmodusselector**
  (indien van toepassing).
- Klik op de **▸ / ▾** schakelaar om een blok in te klappen of uit te vouwen.
- Gebruik de **× (verwijderen)** knop op een blok om het te verwijderen.
- **Alles inklappen** De knop vouwt alle blokken tegelijk in.

### Uitvoermodi

Macroblokken verschijnen in de ASM- en Both-weergaven als gewone macroregels
zonder commentaarmarkering (`.print "HELLO"`, `.wait_raster $FF`, `.invoke
setColor(blue)`) en worden gekleurd zoals macro's; alleen echte COMMENT-blokken,
regiomarkeringen en waarschuwingen behouden hun voorloopteken `;`.

| Kleur van de balk | Beschrijving                                                                                                                                                                                                                                                                                                                                 |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cyaan             | 6502 assemblagebron met adressen en labels                                                                                                                                                                                                                                                                                                   |
| **Monitor**       | Hex-/bytedump (C64-monitorstijl)                                                                                                                                                                                                                                                                                                             |
| **Disasm**        | Pure 6502-disassemblage: adres · hexadecimale bytes · mnemonics met opgeloste numerieke operanden. Macro's worden uitgebreid tot individuele instructies (TEXT → LDA/STA-paren, LOOP → LDX, enz.). BYTE/WORD/FILL-gegevens worden weergegeven als een gechunkte hexadecimale dump. Geen macronamen, commentaren of annotaties in de uitvoer. |
| **Beide**         | ASM bovenaan, monitor onderaan                                                                                                                                                                                                                                                                                                               |
| **Disassembler**  | Hetzelfde als Disasm — een apart tabblad voor de demontageweergave.                                                                                                                                                                                                                                                                          |

Ingeklapte blokken worden weergegeven met een lagere transparantie. Klik of
sleep ergens op de minimap om de programmalijst naar die positie te scrollen. De
viewport-indicator (een rechthoek in de accentkleur) geeft het zichtbare
gedeelte van de lijst aan. De status wordt opgeslagen in de UI-instellingen
(`blockMinimap`-toets).

### Toolkit-tabblad

- Voor branch/jump-instructies (`BNE`, `JMP`, `JSR`, enz.) verschijnt een
  **label picker** dropdownmenu — klik op een gedefinieerd label om het in te
  voegen.
- De getalnotatie volgt de **HEX / DEC** schakelaar in de werkbalk (zie sectie
  5).

---

## 5. Instellingen en werkbalk

Het rechterpaneel toont de gegenereerde uitvoer in realtime.

### Projectmomentopnamen

| Modus            | Beschrijving                                                                                                                                                                                                                                                                                                                                 |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ASM**          | 6502 assemblagebron met adressen en labels                                                                                                                                                                                                                                                                                                   |
| **Monitor**      | Hex-/bytedump (C64-monitorstijl)                                                                                                                                                                                                                                                                                                             |
| **Disasm**       | Pure 6502-disassemblage: adres · hexadecimale bytes · mnemonics met opgeloste numerieke operanden. Macro's worden uitgebreid tot individuele instructies (TEXT → LDA/STA-paren, LOOP → LDX, enz.). BYTE/WORD/FILL-gegevens worden weergegeven als een gechunkte hexadecimale dump. Geen macronamen, commentaren of annotaties in de uitvoer. |
| **Beide**        | ASM bovenaan, monitor onderaan                                                                                                                                                                                                                                                                                                               |
| **Disassembler** | Hetzelfde als Disasm — een apart tabblad voor de demontageweergave.                                                                                                                                                                                                                                                                          |
| **Toolkit**      | C64-referentiepaneel: kleurenpalet met 16 kleuren + PETSCII-besturingscode en spiekbriefje met afdrukbare tekens. Alleen-lezen — zie het subgedeelte "Toolkit" hieronder voor meer informatie.                                                                                                                                               |
| **Opties**       | Instellingenpaneel van het programma — getalnotatie, macrobron in-/uitschakelen, foutopsporingsparameters                                                                                                                                                                                                                                    |

Projectsnapshots worden opgeslagen als JSON-bestanden op de schijf, niet in
localStorage. Ze zijn gekoppeld aan het huidige projectbestand (indien
aanwezig), zodat de geschiedenis behouden blijft na herstarts en het project
blijft volgen.

### In-app updates

**Menu → Controleren op updates** zoekt de nieuwste versie op c64va.tech (het
leest de downloadlinks voor uw platform) en vergelijkt deze met de actieve
versie:

| Sectie      | Wat gebeurt er?                                                                                                                                                                                                               |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Windows** | De installatie verloopt in passieve modus (alleen voortgangsregistratie) en start de nieuwe versie zodra deze is voltooid. Een installatie per machine vraagt om beheerdersrechten (UAC).                                     |
| **macOS**   | Het DMG-bestand wordt gekoppeld en de app-bundel wordt op de juiste plek vervangen, waarna de nieuwe versie start. Als de app-map niet beschrijfbaar is, wordt het DMG-bestand geopend zodat je de app ernaartoe kunt slepen. |

Na het downloaden installeert de app de update en start opnieuw op:

### Werkruimtes

Een **werkruimte** (`.vaws`-bestand) onthoudt welke echte bestanden op de schijf
geopend waren in elk tabblad — inclusief de editormodus van elk tabblad en welk
tabblad actief was — zodat u diezelfde set later opnieuw kunt openen. Het is
iets anders dan een `.proj`-project: een werkruimte kan elke combinatie van
Block/Expert `.json`-projectbestanden, losstaande `.asm`-bestanden en Ultimate
Basic `.ub`/`.proj`-bronnen over meerdere tabbladen omvatten.

- Werkruimtes **slaan automatisch** een paar honderd milliseconden op nadat je
  een wijziging hebt aangebracht, zodra er een is opgeslagen of geopend.
- De app **herstelt automatisch je laatst geopende werkruimte** bij het
  opstarten, zodat je geopende tabbladen verdergaan waar je gebleven was.
- Alleen tabbladen die gekoppeld zijn aan een daadwerkelijk bestand op de schijf
  worden opgeslagen in de werkruimte; een tabblad met een niet-opgeslagen
  voorbeeld of een programma dat alleen in het geheugen draait, heeft niets om
  op te slaan en wordt overgeslagen (met een melding als geen van de geopende
  tabbladen hiervoor in aanmerking komt).
  - **`-jmp` AAN/UIT** — spring direct naar het startadres van het programma na
    het laden.
  - **`-unpause` AAN/UIT** — de debugger direct hervatten bij het laden.
  - **`-wacht` ms AAN/UIT** — voegt een `-wacht <ms>` vertraging toe voordat de
    pauze wordt opgeheven; selecteer 500 ms of 1000 ms in het dropdownmenu.
- Bij het openen van een werkruimte worden eerst alle geopende tabbladen
  gesloten. U wordt gevraagd om te bevestigen voordat het proces verdergaat.

### Projecttemplates

**Menu → Bestand → Nieuw project vanuit sjabloon…** — of de knop in de werkbalk
tussen **Menu** en **Handleidingen** — opent het sjabloondialoogvenster:

### Bouwproject

**Menu → Bouwen → Project bouwen** compileert een volledig project in één stap.
De bestanden van het geopende `.proj` project worden gebouwd — of, zonder
project, de geopende bestandstabbladen:

- elke compileerbare bron (`.asm`, blok `.json`, `.ub`) wordt gecompileerd naar
  een `.prg` **naast de bron** met dezelfde naam; met **Uitvoeren met Exomizer**
  ingeschakeld wordt de uitvoer gekraakt;
- Debugger-sidecarbestanden (symbolen/bronkaart) worden, indien mogelijk, samen
  met het PRG-bestand geschreven;

### Voorbeeldprogramma's

**Menu → Voorbeelden…** opent de voorbeeldbrowser: de ingebouwde
voorbeeldprogramma's gegroepeerd per onderwerp (Basisprincipes, Macro's en
besturingsstroom, Grafische elementen, Sprites en invoer, Bestanden en laden,
Muziek, IRQ en hardware) in twee kolommen.

- Typ in het zoekvak om te filteren op naam of categorie; in de voettekst wordt
  weergegeven hoeveel voorbeelden overeenkomen.
- Klik op een voorbeeld om het te selecteren, **↑ / ↓** verplaats de selectie;
  **dubbelklik**, **Enter** of **Load** laadt het.
- Het dialoogvenster wordt geopend met het voorbeeld dat u als laatste hebt
  geladen.

Het modale venster sluit automatisch wanneer de actie is voltooid of mislukt.

---

## Ultieme Basismodus

| Controle                                                                                        | Beschrijving                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Getallenbasis (HEX / DEC / BIN)**                                                             | Hiermee wordt het weergave-/invoerformaat voor operanden in de gebruikersinterface ingesteld. In de BIN-modus worden waarden binair weergegeven met het voorvoegsel `%` (bijv. `%11111000`). De ASM-weergave toont elk blok altijd in zijn eigen formaat.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Taal**                                                                                        | Schakel tussen de gebruikersinterface in het Engels, Hongaars, Spaans, Duits en Nederlands.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Thema**                                                                                       | Licht / Donker / OLED / Commodore 77 / Commodore Starlight / Commodore Beige / Commodore 64 — selecteer een thema in het instellingenmenu. OLED gebruikt een puur zwarte achtergrond voor AMOLED-schermen. Commodore 77 is een neongeel-op-zwart thema; wanneer dit het actieve thema is, gebruikt het opstartscherm de paneelkleur van het thema (overeenkomend met de berichtkaart), toont het een kleiner, speciaal Commodore 77-logo en een gele voortgangsbalk. Commodore Starlight is een licht thema, geïnspireerd op de doorschijnende C64-broodbak: matglazen panelen met een regenboogkleurige RGB-gloed die erdoorheen schijnt, een magenta accent, regenboogkleuren voor de syntax en een rokerig donker scherm. Commodore Beige is de klassieke broodbak: een beige behuizing, mosterdkleurige functietoetsen, de regenboogstrepen van het logo en een C64-blauw scherm voor de monitorweergave. Het gekozen thema wordt toegepast vóór de eerste keer dat het programma wordt opgestart. |
| **CRT retro-modus**                                                                             | Schakelt een CRT-filter voor het volledige scherm in of uit: scanlijnen, fosforvignettering, flikkering en tonvormige vertekening. De instelling wordt tussen sessies bewaard.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Geheugenpaneel weergeven**                                                                    | Globale schakelaar waarmee het volledige C64-geheugenpaneel kan worden weergegeven of verborgen.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **BASIC SYS stub**                                                                              | Voegt een BASIC-regel die SYS aanroept toe aan het begin van uw programma.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Voorbeelden…**                                                                                | Open de voorbeeldbrowser en laad een ingebouwd voorbeeldprogramma — zie [Voorbeeldprogramma's](#example-programs)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **In-/uitzoomen**                                                                               | Schaal de gebruikersinterface van het blok (dit heeft invloed op alle elementen van het blok)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Project opslaan**                                                                             | Sla het huidige programma op als een `.json` projectbestand                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Programma opslaan als**                                                                       | Sla het huidige programma elke keer op als een `.json`-projectbestand met behulp van een nieuw bestandsdialoogvenster.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Project laden**                                                                               | Een eerder opgeslagen project laden                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Werkruimte opslaan**                                                                          | Sla de exacte set van momenteel geopende, door bestanden ondersteunde tabbladen op — inclusief het actieve tabblad en de editormodus van elk tabblad (Blok/Expert/Ultieme Basis) — in een `.vaws` werkruimtebestand                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Werkruimte opslaan als**                                                                      | Sla de huidige werkruimte elke keer op via een nieuw bestandsdialoogvenster.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Werkruimte openen**                                                                           | Sluit alle geopende tabbladen en heropen de set bestanden die zijn opgeslagen in een `.vaws`-werkruimtebestand.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Werkmap instellen**                                                                           | Kies de standaardmap die wordt gebruikt door bestandsselectoren en dialoogvensters voor opslaan. Het pad wordt opgeslagen in de app-configuratie en in menuvoorbeelden blijft het einde van het pad zichtbaar.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Nieuw project vanuit sjabloon…** (`Menu → Bestand`, of de knop in de werkbalk naast **Menu**) | Maak een nieuw `.proj`-project aan vanuit een Assembler- of UltimateBasic-sjabloon in een eigen map — zie [Projectsjablonen](#project-templates)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Project openen** (`Menu → Bestand`)                                                           | Open een project met meerdere bestanden `.proj` en open alle bronbestanden als tabbladen.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Project opslaan** (`Menu → Bestand`)                                                          | Sla het huidige `.proj`-project op (het projectvenster moet geopend zijn).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Project sluiten** (`Menu → Bestand`)                                                          | Sluit het momenteel geopende project en alle bijbehorende bestandstabbladen. Er verschijnt een prompt om niet-opgeslagen wijzigingen op te slaan. Het projectpaneel wordt teruggezet naar de lege staat.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Laad .asm-bestand**                                                                           | Opent een `.asm`-bestand in de expertmodus en importeert tekstuele 6502 ASM in het huidige tabblad.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **PRG opslaan**                                                                                 | Exporteer het gecompileerde binaire bestand als een `.prg`-bestand                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **CRT bouwen**                                                                                  | Exporteer het programma als een 64K Magic Desk-bestand (`.crt`, cartridgetype 19). Zie [Paragraaf 12b](#12b-crt-export-magic-desk-64k-cartridge).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Project bouwen** (`Menu → Bouwen`)                                                            | Compileer elk compileerbaar bestand van het project (of van de geopende tabbladen) naar een `.prg` naast de broncode — zie [Project bouwen](#build-project)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Uitvoeren (splitknop)**                                                                       | De hoofdknop **▶ Run** start de huidige modus; klik op de pijl **▾** om te schakelen tussen: **Uitvoeren als PRG** (VICE direct compileren en starten), **Uitvoeren via D64** (verpakken in een .d64-schijfimage en VICE starten), **Uitvoeren op hardware** (PRG naar een C64 Ultimate / 1541 Ultimate-apparaat sturen), of **Kung Fu Flash 2** (de PRG via USB uploaden naar een echte C64/C128 met een Kung Fu Flash 2-cartridge). Zie [Sectie 12](#12-d64-export--run) en [Sectie 13](#13-hardware-settings).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Debug (RetroDebugger)**                                                                       | Compileer en start in RetroDebugger met breakpoints, symbolen en autostart-vlaggen (zie [Sectie 9](#9-debugger-integration))                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Uitvoeren met Exomizer**                                                                      | Selectievakje in het menu Instellingen — wanneer ingeschakeld, verwerken alle Run- en Build-bewerkingen de PRG via `exomizer sfx sys` voordat ze worden gestart of opgeslagen. Werkt met Run as PRG, Run via D64, Run on Hardware, Build PRG en Build D64. Configureer eerst het Exomizer-uitvoerbare bestand in **Hardware Settings**.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Automatische opslag van items**                                                               | Selectievakje in **Hardware-instellingen → Versiebeheer**. Wanneer dit is ingeschakeld, voegt de app ongeveer 2,5 seconden nadat u stopt met het bewerken van een tabblad een automatisch opgeslagen item toe aan de versiegeschiedenis (voor een tabblad van een project ook aan de projectgeschiedenis). Schakel dit uit als u alleen uw eigen commits wilt bewaren. Zie [Versiebeheer](#version-control).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Hardware-instellingen**                                                                       | Open het dialoogvenster voor hardwareconfiguratie — configureer VICE, Exomizer, RetroDebugger, C64 Ultimate (host, wachtwoord, verbindingstest) en de seriële poort van de Kung Fu Flash 2. Zie [Sectie 13](#13-hardware-settings).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Nieuw programma…**                                                                            | Opent een bevestigingsdialoogvenster en verwijdert vervolgens alle blokkeringen uit het programmagebied.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Alles inklappen**                                                                             | Vouw alle blokken samen                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Over**                                                                                        | Versie-informatie                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Wat is er nieuw**                                                                             | Wijzigingslogboek                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |

### Versiebeheer

Elk tabblad heeft zijn eigen versiegeschiedenis, zoals een kleine
git-repository; een tabblad dat bij een open `.proj`-project hoort, kan ook als
geheel project van een versie worden voorzien (zie
[Projectmodus](#project-mode)). **Menu → Bouwen → Versiebeheer…** (of
**Commit…**) opent het dialoogvenster; **Wijzigingen ongedaan maken (terug naar
HEAD)** herstelt de laatste commit direct.

De gebruikelijke workflow: schrijf een **commitbericht** en druk op **Commit**
(of Ctrl+Enter) → blijf bewerken → druk op **Diff** om te zien wat er is
veranderd → commit opnieuw.

- **Commit** — slaat de huidige status van het tabblad op met uw bericht. Elke
  commit krijgt een korte hash (bijvoorbeeld `1bd55ba`); de nieuwste is
  **HEAD**. Een commit zonder wijzigingen sinds HEAD wordt niet aangemaakt.
- **Statusregel** — *Niets om te committen, werkmap schoon* of
  *Niet-gecommitteerde wijzigingen sinds `<hash>`*.
- **Diff** — de wijzigingen sinds HEAD; de **Diff**-knop van een
  logboekvermelding vergelijkt die versie met de editor. Toegevoegde regels zijn
  groen, verwijderde regels rood en de koptekst toont **+N / −M**.
  Blokmodusprogramma's worden vergeleken als assemblerregels (één regel per
  blok), Expert-bronnen regel voor regel, Ultimate Basic-tabbladen per broncode,
  zodat een blokmodusproject dat als JSON is opgeslagen nog steeds leesbare
  wijzigingen laat zien.
- **Checkout** — laadt die versie in de editor. Het bestand op de schijf wordt
  alleen gewijzigd wanneer je opslaat; **Discard changes** gaat terug naar HEAD.
- **Automatisch opslaan van items** — met **Instellingen → Versiebeheer →
  Automatisch opslaan van items in versiebeheer** voegt de app ongeveer 2,5
  seconden nadat u stopt met bewerken een item toe. Ze worden gemarkeerd als
  *automatisch opslaan*; de laatste 20 worden bewaard, naast maximaal 100
  commits.
- Het dialoogvenster kan worden verplaatst via de koptekst; het wordt op
  dezelfde plaats opnieuw geopend en kan worden gesloten met **Esc** of de
  sluitknop (klikken buiten het dialoogvenster sluit het niet).
- De geschiedenis wordt naast het projectbestand opgeslagen als
  `<project>.snapshots.json` (in de app-configuratiemap totdat het project wordt
  opgeslagen), zodat deze behouden blijft na herstarts. Snapshots gemaakt door
  eerdere versies verschijnen als commits.

#### Projectmodus

Wanneer het tabblad bij een geopend `.proj`-project hoort (Expert- of Ultimate
Basic-projectpaneel), toont de dialoogvensterkop een **Bestand /
Project**-schakelaar; **Project** is standaard geselecteerd. Tabbladen buiten
een project behouden de hierboven beschreven geschiedenis per bestand.

- **Commit** registreert elk bronbestand van het project in één vermelding: de
  bestanden van de projectstructuur plus de tekstbestanden die ze bevatten
  (`.include`, `include`, `#import`, `!source`, INCLUDE-blokken in blokmodus).
  Open tabbladen tellen mee met hun huidige, zelfs niet-opgeslagen, inhoud; de
  andere bestanden worden van de schijf gelezen. Binaire bestanden van de
  projectstructuur (lettertypen, `.koa`, `.bin`, `.sid` …, tot 1 MB per stuk)
  worden ook geregistreerd; hun diff toont de grootteverandering en **Checkout**
  schrijft ze direct terug naar de schijf.
- Het logboek toont het commitbericht, de korte hash en de **gewijzigde
  bestanden** van elke vermelding (**A** toegevoegd, **M** gewijzigd, **D**
  verwijderd).
- **Diff** werkt bestand voor bestand: elk gewijzigd bestand krijgt zijn eigen
  header en hunks.
- **Wijzigingen negeren** gaat op dezelfde manier terug naar de laatste
  projectcommit (HEAD).
- **Uitchecken** (na bevestiging) laadt alle bestanden van die versie in de
  editor: geopende tabbladen worden bijgewerkt, ontbrekende bestanden worden als
  nieuwe tabbladen geopend. Er wordt niets naar de schijf geschreven totdat u
  opslaat; bestanden die sinds die versie aan het project zijn toegevoegd,
  blijven ongewijzigd.
- Automatisch opgeslagen gegevens worden ook op projectniveau opgeslagen.
- De projectgeschiedenis wordt naast het projectbestand opgeslagen als
  `<project>.proj.history.json`.
- In de Git-modus (**) toont het logboek de volledige repository met de
  gewijzigde bestanden van elke commit (`git log --name-status`); **Diff** toont
  de commit bestand voor bestand, de knop **Diff** vergelijkt HEAD met de
  projectbestanden in de editor (**RAW** is `git diff HEAD` van de repository).
  **Commit** slaat elk niet-opgeslagen projecttabblad op en zet alle wijzigingen
  in de staging area (`git add -A`); **Checkout** laadt de projectbestanden van
  die commit in de editor.

#### Git

Als `git` is geïnstalleerd, kan hetzelfde dialoogvenster ook werken met een
echte git-repository.

- **Instellingen → Versiebeheer:** **Kies git.exe…** of **Automatisch
  detecteren** (zoekt in het PATH en de gebruikelijke installatiemappen); de
  onderstaande regel toont de git-versie. **Git gebruiken wanneer het project
  zich in een repository bevindt** (standaard ingeschakeld) schakelt het
  dialoogvenster automatisch over naar de Git-modus voor bestanden in een
  repository. De **Ingebouwd / Git** schakelaar in de dialoogvensterkop wijzigt
  de modus handmatig.
- De header toont de branch met **↑** (commits om te pushen) en **↓** (commits
  om te pullen), gevolgd door de gewijzigde bestanden van de repository.
- **Commit** slaat het bestand eerst op, zet alleen dit bestand (of elke
  wijziging met **Stage all changes (git add -A)**) in de staging area en voert
  `git commit` uit.
- Het logboek toont de commits van dit bestand met hun branches en tags.
  **Diff** op een item vergelijkt de commit met de parent; de knop **Diff**
  vergelijkt HEAD met de editor, inclusief niet-opgeslagen wijzigingen.
  Projectbestanden worden op dezelfde manier vergeleken als in de ingebouwde
  modus; **RAW** toont de gewone `git diff`.
- **Checkout** laadt het bestand van die commit in de editor (`git show`) zonder
  de schijf aan te raken.
- **Pull** (`--ff-only`), **Push** (de eerste push stelt de upstream in met `-u
  origin <branch>`) en **Create repository (git init)** wanneer de map nog geen
  repository is.
- Git wordt uitgevoerd zonder consolevenster en vraagt nooit om een wachtwoord:
  de inloggegevens moeten afkomstig zijn van een credential manager of een
  SSH-sleutel, anders wordt de foutmelding in het dialoogvenster weergegeven. |
  **Kennisbank** | Referentielinks (6502 opcodes, C64 KERNAL, geheugenkaart,
  kleuren) | | **Controleren op updates** | Controleer c64va.pro op een nieuwere
  versie en download/installeer deze — zie [In-app updates](#in-app-updates) |

### Editortools

**Menu → Controleren op updates** zoekt de nieuwste versie op c64va.pro (het
leest de downloadlinks voor uw platform) en vergelijkt deze met de actieve
versie:

- Syntaxmarkering op basis van de huidige Ultimate Basic-taalreferentie;
- regelnummers die synchroon blijven met lange bestanden;

Het paneel 'Disassembly' bevat een knop **Kopiëren** waarmee de volledige
weergegeven broncode naar het klembord wordt gekopieerd. De meegeleverde
compiler geeft helpinformatie voor de commando's: bijvoorbeeld, `sprite_frame
id, data_address [, frame]` selecteert een animatieafbeelding uit opeenvolgende
spriteframes van 64 bytes.

| Platform    | Wat gebeurt er?                                                                                                                                                                                                               |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Windows** | De installatie verloopt in passieve modus (alleen voortgangsregistratie) en start de nieuwe versie zodra deze is voltooid. Een installatie per machine vraagt om beheerdersrechten (UAC).                                     |
| **macOS**   | Het DMG-bestand wordt gekoppeld en de app-bundel wordt op de juiste plek vervangen, waarna de nieuwe versie start. Als de app-map niet beschrijfbaar is, wordt het DMG-bestand geopend zodat je de app ernaartoe kunt slepen. |
| **Linux**   | Een AppImage wordt vervangen door de nieuwe. Een `.deb` / `.rpm` installatie wordt bijgewerkt met `pkexec` (u wordt gevraagd om uw wachtwoord); zonder `pkexec` wordt het pakket geopend in uw software-installatieprogramma. |

De lijst met opdrachten is opzettelijk in hoogte beperkt, zodat de detailkaart
van de opdracht de resterende paneelhoogte kan vullen. Het detailgebied scrollt
onafhankelijk voor langere syntaxbeschrijvingen.

### Gratis en open source

Visual Assembler is gratis: alle functies — de visuele editors (SID, Sprite,
Char, Charset, Hi-Res, Map, Level, D64, Curve), de SID Player, **Build PRG**,
**Build D64**, **Build CRT**, **Build project**, Exomizer packing, draaien op de
C64 Ultimate en op de Kung Fu Flash 2, en elke UI-taal en elk thema — werken
zonder registratie of serienummer. De broncode is beschikbaar onder de GNU
General Public License v3.0 (zie **Menu → Over**). Tot versie 2.5.9 had de app
een Freemium/Professional-indeling; sinds versie 2.6.0 is een serienummer
invoeren niet meer nodig.

Als je het programma leuk vindt, kun je de ontwikkeling ervan steunen met een
donatie op c64va.pro.

**Gebruiksstatistieken.** Maximaal één keer per dag, bij het opstarten, stuurt
de app een anonieme ping naar c64va.pro met de app-versie, het
besturingssysteem, de UI-taal, het aantal keren dat de app is gestart en de
actieve minuten sinds de laatste ping (een minuut telt zolang het venster
zichtbaar is en u de muis of het toetsenbord in de afgelopen 5 minuten hebt
gebruikt), of er nog een serienummer van 2.5.6–2.5.9 is opgeslagen (alleen
ja/nee) en een willekeurige installatie-ID (bewaard in het `config.json-bestand
van de app` als `launchPing`). Er wordt geen e-mailadres, serienummer, project
of broncode verzonden; offline gebeurt er niets. De app vraagt c64va.pro ook af
en toe om een kort bericht (bijvoorbeeld over een nieuwe versie, soms alleen
voor supporters); elk bericht wordt één keer weergegeven.

### Een bug melden

**Menu → Bug melden** opent een formulier waarmee het rapport direct naar de
ontwikkelaar wordt verzonden.

- **Samenvatting** en **Wat is er gebeurd?** zijn verplicht — beschrijf wat je
  hebt gedaan, wat je verwachtte en wat er in plaats daarvan is gebeurd.
  **E-mailadres** is optioneel; geef het op als je een antwoord wilt ontvangen.
- **Schermafbeeldingen:** maximaal 4 afbeeldingen met **Afbeelding toevoegen…**,
  door te plakken met **Ctrl+V** (bijvoorbeeld na Win+Shift+S) of door ze op het
  formulier te slepen. Grote afbeeldingen worden verkleind tot 1920 pixels.
- **Systeeminfo en recente fouten toevoegen** (standaard ingeschakeld) voegt de
  app-versie, het besturingssysteem, de taal, het thema, de editor en de
  uitvoeringsmodus, de schermgrootte, het aantal blokken en de laatste
  app-fouten toe. **Wat wordt er verzonden?** toont de gegevens. Uw broncode
  wordt niet verzonden.
- **Rapport verzenden** bevestigt met het rapportnummer. **Verzenden per
  e-mail** opent in plaats daarvan uw e-mailprogramma.

### Steun

**Menu → Ondersteuning** opent een chat met de ontwikkelaar: typ een vraag, een
idee of een probleem en druk op **Verzenden** (of **Ctrl+Enter**). Je kunt
maximaal 3 bestanden bijvoegen (in totaal 4 MB): afbeeldingen, bronbestanden
(`.asm`, `.ub`, `.txt` …), C64-bestanden (`.prg`, `.d64`, `.sid`, `.crt` …) of
een `.zip` — met **Bestand bijvoegen…**, door ze te plakken (**Ctrl+V**) of door
ze naar het venster te slepen. Het antwoord verschijnt in hetzelfde venster, ook
met bestanden: afbeeldingen worden als voorbeeld weergegeven, een klik slaat een
bestand op. Het venster is niet modaal: sleep het aan de koptekst, pas de
grootte aan via de rechteronderhoek en blijf doorwerken terwijl het open is. De
app controleert bij het opstarten en elke minuut op antwoorden; bij een nieuw
antwoord klinkt een kort piepje (de luidsprekerknop in de koptekst van het
venster dempt het geluid), knippert het pictogram in de taakbalk wanneer de app
op de achtergrond draait, verschijnt er een rode stip op de **Menu**-knop en
wordt het venster eenmaal geopend. Zodra je een gesprek hebt, opent een
enveloppictogram naast de **Menu**-knop het gesprek; het wordt rood en knippert
met het aantal ongelezen antwoorden. Een e-mailadres is optioneel: als je er een
opgeeft, ontvang je het antwoord ook per e-mail. Het gesprek is gekoppeld aan de
willekeurige installatie-ID van de app, dus er is geen account en geen
wachtwoord.

### Projecten, tabbladen en opstartbestanden

Ultimate Basic-projecten gebruiken `.proj`-bestanden en kunnen meerdere
`.ub`-bronnen bevatten. Het projectpaneel toont geopende bestanden, markeert
niet-opgeslagen tabbladen en toont gevonden labels, functies en subroutines. Met
projectacties kunt u een project maken, openen, opslaan en sluiten, of een ander
bronbestand toevoegen. Een nieuw project kan ook worden gestart vanuit een
UltimateBasic-sjabloon — zie [Projectsjablonen]{1}.

- **Bestand toevoegen** — selecteer een of meer bestanden tegelijk (elk type —
  `.ub`, `.bin`, `.prg`, afbeeldingen, lettertypen, enz.). `.ub`-bronnen worden
  ook geopend als editortabbladen; al het andere wordt alleen toegevoegd als
  referentie, zodat `incbin`/`loadfile`-assets met het project meereizen.
- **Map toevoegen** — verwijs naar een hele map (bijv. een `incbin`-assetmap
  zoals `fonts/`) zodat deze aan het project gekoppeld blijft.
- Alleen tabbladen die gekoppeld zijn aan een daadwerkelijk bestand op de schijf
  worden opgeslagen in de werkruimte; een tabblad met een niet-opgeslagen
  voorbeeld of een programma dat alleen in het geheugen draait, heeft niets om
  op te slaan en wordt overgeslagen (met een melding als geen van de geopende
  tabbladen hiervoor in aanmerking komt).
- Bij het openen van een werkruimte worden eerst alle geopende tabbladen
  gesloten. U wordt gevraagd om te bevestigen voordat het proces verdergaat.
- Als een werkruimte verwijst naar een bestand dat inmiddels is verplaatst of
  verwijderd, wordt die vermelding overgeslagen en na het laden alleen de naam
  ervan weergegeven.
- De geopende Expert- en Ultimate Basic-projecten **** worden ook opgeslagen: de
  projectstructuur (inclusief niet-opgeslagen toevoegingen en verwijderingen),
  het opstartbestand en het opslagdoel `.proj` worden samen met de werkruimte
  hersteld. Werkruimtes die door oudere versies zijn opgeslagen, worden zonder
  deze bestanden geopend.

### Bouw en diagnose

De knop **Build** opent dezelfde gecentreerde voortgangsweergave als de andere
Visual Assembler-workflows. Succesvolle builds werken Build Output, Build Info
en Disassembly bij. Schakel **Verbose** in om details over de geheugenmapping
van de compiler, interne toewijzingen op nulpagina's en gegenereerde
codegegevens weer te geven.

1. De buildoutput wordt automatisch zichtbaar gemaakt;
2. Compilerfouten worden in het rood weergegeven;
3. Het gecentreerde compilatiedialoogvenster geeft de foutmelding weer;
4. Fouten die een bronregel bevatten, selecteren die regel in de actieve
   UB-editor.

| Sectie           | Ingebouwde sjablonen                                                                                                                                                                                        |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Assembler**    | Leeg programma, leeg spel (titel-/speel-/game over-status, joystick, speler-sprite), bitmap met hoge resolutie, meerkleurige bitmap                                                                         |
| **UltiemeBasis** | Leeg programma, leeg spel (zelfde toestandsmachine in UB), hoge bitmap (`lijn` / `rechthoek` / `cirkel` met `kleurpen`), raster-IRQ (een `sub` die elke frame wordt aangeroepen vanuit de raster-interrupt) |

Als de compilatie mislukt:

Build Info rapporteert laad-/eindadressen, code- en PRG-groottes,
Exomizer-status, variabelen, arrays, functies/subroutines en labels.

```asm
; @name Rasterbalken
; @name.hu Rasterbalken
; @category Effecten
; @desc Twee rasterbalken in de rand.

; @order 50
```

`@name`, `@category` en `@desc` kunnen taalspecifieke varianten hebben
(`@name.hu`, `@desc.de`, …); `@order` sorteert de lijst. Alles na de header
wordt het nieuwe hoofdbestand en `{{PROJECT}}` wordt vervangen door de
projectnaam (gebruik deze in een commentaar zodat de template zelf nog steeds
compileert).

### Hardlopen, D64 en Exomizer

De hoofdsplit **Run**-knop ondersteunt Ultimate Basic in elke normale
bestemming:

- elke compileerbare bron (`.asm`, blok `.json`, `.ub`) wordt gecompileerd naar
  een `.prg` ** naast de bron** met dezelfde naam; met **Uitvoeren met
  Exomizer** ingeschakeld wordt de uitvoer gekraakt;
- Debugger-sidecarbestanden (symbolen/broncode) worden, indien mogelijk, samen
  met het PRG-bestand geschreven;
- Modules die door een ander bestand worden ingevoegd met `.include` / `include`
  (en `.inc`-bestanden) worden overgeslagen, evenals tabbladen die nooit zijn
  opgeslagen;
- Een rapport geeft een lijst van elk bestand met de grootte, *overgeslagen*
  reden of compilerfout, en de statusbalk toont *N / M gebouwde bestanden*.

### Debuggersymbolen en demontage

De builds vragen om Ultimate Basic-debuginformatie en produceren drie
compatibele sidecars:

- `.sym` voor symbolen in KickAssembler-stijl;
- `.dbg` voor C64Debugger/RetroDebugger bron- en segmentinformatie;
- `.vs` voor VICE-monitorlabels.

### Ultieme basishandleiding en bron

Het boekpictogram in de UB-werkbalk opent de bijbehorende Ultimate Basic
`MANUAL.pdf` offline; de knop 'handleiding' in het welkomstvenster bij het
opstarten opent dezelfde handleiding. Visual Assembler haalt zowel de compiler
als de PDF uit de vastgezette upstream Git/Cargo-afhankelijkheid, waardoor de
IDE geen tweede kopie van de Ultimate Basic-implementatie onderhoudt. Het
dialoogvenster 'Over' en het opstartscherm tonen de actuele versie van de
afhankelijkheid.

- `* = $1500` → ORG-blok
- `Label:` → LABEL-blok
- `Label: .byte 0` → LABEL + BYTE blokken
- `.byte ...` → BYTE-blok
- `; commentaar` (of inline `; ...`) → COMMENTAARblok
- instructies (`lda`, `jsr`, `beq`, enz.) → instructieblokken met gedetecteerde
  adresseermodus

#### Importeer parseernotities en best practices

- Lokale labels zoals `.wait` worden geïmporteerd als standaardlabels (punt
  verwijderd) en verwijzingen worden dienovereenkomstig genormaliseerd.
- Voor adressering in de stijl `($zp),Y` / `($zp,X)` kunt u het beste een
  concrete nulpaginabyte gebruiken (`$FB`, `$FC`, enz.) voor optimale
  compatibiliteit.
- Vermijd dubbelzinnige korte labels die eruitzien als hex (`cc1`, `dead`,
  `beef`) in vertakkingscontexten; geef de voorkeur aan namen zoals `loop_cc1`.
- Als uw programma begint met gegevens (`.byte`) vóór de uitvoerbare code, voeg
  dan bovenaan een expliciete startsprong toe (bijvoorbeeld `JMP Start`).

### ASM-import (Kick Assembler)

De knop **ASM import** in het menu Programma laadt onbewerkte Kick
Assembler-broncode in een nieuw tabblad in blokmodus. Deze is gescheiden van de
Expert-modus `Load .asm file` hierboven — de aangepaste tooltip geeft aan dat
**alleen Kick Assembler-code wordt ondersteund** (andere assemblers kunnen de
code gedeeltelijk parseren, maar een volledige round-trip is niet gegarandeerd).

Ondersteunde patronen:

- `.pc = $XXXX` oorsprongsrichtlijn → ORG-blok
- `.const NAME = waarde`, `.label NAME = waarde` → CONST gelijkstellen
- `.macro NAME(p1, p2, ...) { ... }` met `{`/`}` accolades of `.endm` →
  gebruikersmacrodefinitie
- Macro-aanroep `NAME(args)`, Kick-dubbele punt-voorvoegsel `:NAME(args)` en
  `.invoke NAME(args)` — allemaal heen en weer via de Kick-dubbele punt-vorm
- `@local` labels (`@loop:`, `BEQ @loop`) behouden het `@`-voorvoegsel zoals het
  is
- Operand `label + N` / `label - N` (bijv. `STA mod1+2`, `LDA xp+1`)
- Regelcommentaren `// ...` en `;` — beide geaccepteerd, `/* ... */` blokken
  worden behandeld als één enkele commentaarregel
- BASIC autostart passthrough: wanneer het programma start op `$0801` met de
  standaard `SYS 2061` byte stub (`.byte
  $0B,$08,$0A,$00,$9E,$32,$30,$36,$31,$00,$00,$00`), genereert de compiler de
  PRG letterlijk in plaats van er een tweede BASIC SYS omheen te wikkelen.

Bekende beperking:

- Constanten die verwijzen naar een nulpagina-adres (bijvoorbeeld `.const
  BYTEADDR = $FC` gebruikt als `STA BYTEADDR`) worden momenteel gecompileerd
  naar instructies in absolute modus (3 bytes) in plaats van
  nulpagina-instructies (2 bytes). De gecompileerde code schrijft nog steeds
  naar de juiste geheugenlocatie, alleen met een kleine overhead in grootte en
  cyclus vergeleken met dezelfde broncode die is gecompileerd door Kick
  Assembler.

## 6. Expertmodus

Expertmodus is een volwaardige 6502-assemblereditor voor directe tekst die naast
de blokeditor bestaat. Elk tabblad kan zich in de blokmodus of de expertmodus
bevinden; u kunt er op elk gewenst moment vrij tussen schakelen met de
schakelaar **Blok / Expert** in de bovenste balk.

### Modi wisselen

Selecteer het **UB**-pictogram in de hoofdwerkbalk om over te schakelen naar de
Ultimate Basic-modus. De geselecteerde editormodus wordt onthouden, ook na het
opnieuw opstarten van de applicatie. Een nieuwe bron begint met:

```basic
kleur achtergrond 0
kleur rand 0

print "HALLO VAN ULTIMATE BASIC"
```

De UB-modus werkt met `.ub`-bronbestanden. **Nieuw**, **Openen**, **Opslaan** en
**Opslaan als** werken op het actieve UB-tabblad. Het openen van een
`.ub`-bestand activeert automatisch het bijbehorende editor-tabblad.

De werkbalk toont de huidige UB-werkmap. Deze map wordt apart opgeslagen van de
Block/Expert-werkmap. Wanneer de UB-modus actief is, selecteert **Bestand →
Werkmap instellen** de UB-map; de tooltip geeft het actieve bereik aan.
UB-dialoogvensters voor openen/opslaan starten daar, en niet-opgeslagen bronnen
gebruiken deze map als basis voor relatieve `include` en `incbin` paden.

### Editor-lay-out

De UB-werkbalk hanteert dezelfde visuele stijl en aangepaste tooltips als de
Expert-modus. Deze biedt het volgende:

- Syntaxmarkering op basis van de huidige Ultimate Basic-taalreferentie;
- regelnummers die synchroon blijven met lange bestanden;
- een minimap en zoomknoppen voor de editor (`Ctrl` + muiswiel zoomt ook); klik
  op de minimap om te springen of sleep de selectie in het weergavegebied voor
  continu scrollen;
- Zoek (`Ctrl+F` / `Cmd+F`) met behulp van de zoekbalk in expertstijl;
- Broncode opmaken met structuurbewuste inspringing;
- Automatische aanvulling voor commando's en ingebouwde functies;
- een doorzoekbaar **Commands**-paneel met syntaxis, beschrijving en
  gebruiksaanwijzing — beschrijvingen volgen de huidige UI-taal (Hongaars,
  Engels, Spaans, Duits, Nederlands), waarbij voor alles wat nog niet vertaald
  is, wordt teruggevallen op Engels;
- De panelen **Project** en **Commands** zijn onafhankelijk van elkaar in- en
  uitschakelbaar en worden naast elkaar weergegeven wanneer beide zijn
  ingeschakeld;
- Onafhankelijk in- en uitschakelbare en in grootte aanpasbare **Build Output**
  en **Disassembly** panelen.

Het paneel 'Disassembly' bevat een knop **Kopiëren** waarmee de volledige
weergegeven broncode naar het klembord wordt gekopieerd. De meegeleverde
compiler geeft helpinformatie voor de commando's: bijvoorbeeld, `sprite_frame
id, data_address [, frame]` selecteert een animatieafbeelding uit opeenvolgende
spriteframes van 64 bytes.

De editor begrijpt ook de QBasic-achtige syntaxis van Ultimate Basic 1.6.3: `dim
naam als type`, `functie … einde functie`, `sub … einde sub`, `elseif`, `do …
lus [while | tot `, ` terwijl … wend `, ` selecteer geval `, ` afsluiten doe ` /
` afsluiten voor ` / ` afsluiten terwijl ` / ` afsluiten sub ` / ` afsluiten
functie `, de tekenreeksfuncties ` links$ ` / ` rechts$ ` / ` midden$ `, en
commentaren die beginnen met `'` evenals `#` of `rem`. Woorden die de compiler
slechts op één positie als trefwoorden behandelt, worden alleen daar gekleurd en
blijven bruikbaar als namen: `as` met de BASIC-typenamen (`byte`, `integer`,
`single`, `double`), `case is`, `map view`, `wait key` en de `scroll`-opties
(`row`, `x`, `y`, `links`, `rechts`, `smal`, `breed`). **Format** laat
`function`, `do … loop`, `while … wend` en `elseif` blokken inspringen en laat
lussen van één regel (`do while c : … : loop`) niet ingesprongen, het
Project-paneel toont `function` blokken onder Functies, en het Commando-paneel
heeft **DIM**, **FUNCTION**, **ELSEIF**, **DO**, **WEND**, **SELECT CASE**,
**END**, **EXIT SUB**, **LEFT$**, **RIGHT$** en **MID$** entries.

De lijst met opdrachten is opzettelijk in hoogte beperkt, zodat de detailkaart
van de opdracht de resterende paneelhoogte kan vullen. Het detailgebied scrollt
onafhankelijk voor langere syntaxbeschrijvingen.

### Werkbalkknoppen

Ultimate Basic-projecten gebruiken `.proj`-bestanden en kunnen meerdere
`.ub`-bronbestanden bevatten. Het projectpaneel toont geopende bestanden,
markeert niet-opgeslagen tabbladen en toont gevonden labels, functies en
subroutines. Met projectacties kunt u een project maken, openen, opslaan en
sluiten, of een ander bronbestand toevoegen. Het dialoogvenster Versiebeheer kan
alle bestanden van het project tegelijk vastleggen, vergelijken en herstellen —
zie [Projectmodus](#project-mode). Een nieuw project kan ook worden gestart
vanuit een UltimateBasic-sjabloon — zie [Projectsjablonen](#project-templates).

Klik op het sterretje naast een projectbestand om het te markeren als het
**opstartbestand**. De commando's Build, Run, D64, C64 Ultimate en Debug
compileren die opstartbroncode, zelfs als er een ander tabblad actief is. Zonder
een opstartselectie wordt het actieve UB-tabblad gebruikt.

De werkbalk van het projectpaneel heeft twee knoppen om bestanden toe te voegen,
en de bestandsdialoogvensters gebruiken standaard de **UB-werkmap** (Menu →
Bestand → Werkmap instellen, UB-specifiek):

- **Bestand toevoegen** — selecteer een of meer bestanden tegelijk (elk type —
  `.ub`, `.bin`, `.prg`, afbeeldingen, lettertypen, enz.). `.ub`-bronnen worden
  ook geopend als editortabbladen; al het andere wordt alleen toegevoegd als
  referentie, zodat `incbin`/`loadfile`-assets met het project meereizen.
- **Map toevoegen** — verwijs naar een hele map (bijv. een `incbin`-assetmap
  zoals `fonts/`) zodat deze aan het project gekoppeld blijft.

Mappen in de boomstructuur hebben een inklap-/uitklappijl, en **klik met de
rechtermuisknop op een map** om een of meer bestanden die eronder genest zijn
toe te voegen (ingesprongen weergegeven). Elk item heeft een verwijderknop (✕);
items die geen `.ub` zijn, dienen alleen als referentie en worden niet geopend
door erop te klikken.

De knop **Project opslaan** wordt uitgeschakeld en toont de status "Opgeslagen"
zodra er geen wijzigingen meer in het project zijn, en wordt automatisch weer
ingeschakeld zodra u een bestand of map toevoegt, verwijdert of reorganiseert.

### Expert editor minimap

De minimap van de Expert-editor is een smalle strook (`88 px`) helemaal rechts
in het editorgebied. Deze geeft een verkleinde weergave van elke bronregel weer:

Een **semi-transparante viewport-indicator** (rechthoek in accentkleur) geeft
aan welk deel van de bron momenteel zichtbaar is. Klik ergens op de minimap om
naar die positie te springen; sleep om continu te scrollen. De minimap scrollt
onafhankelijk mee om de viewport-indicator gecentreerd te houden. De status
wordt opgeslagen in de UI-instellingen (`expertMinimap`-toets).

- De buildoutput wordt automatisch zichtbaar gemaakt;
- Compilerfouten worden in het rood weergegeven;
- Het gecentreerde compilatiedialoogvenster geeft de foutmelding weer;
- Fouten die een bronregel bevatten, selecteren die regel in de actieve
  UB-editor.

Build Info rapporteert laad-/eindadressen, code- en PRG-groottes,
Exomizer-status, variabelen, arrays, functies/subroutines en labels.

### Foutmarkering

Regels die niet compileren, worden in realtime gemarkeerd in **rood** (getinte
achtergrond + linker accentrand), 350 ms na elke toetsaanslag. Het eerste
foutbericht wordt ook weergegeven in de statusbalk. Corrigeer de regel en de
markering verdwijnt automatisch.

| Uitvoeringsmodus              | Ultiem basisgedrag                                                                                                                                           |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Uitvoeren als PRG**         | Compileer en start de PRG rechtstreeks in VICE.                                                                                                              |
| **Uitvoeren via D64**         | Compileer het programma, open het standaard D64-verpakkingsdialoogvenster en start vervolgens de schijf in VICE.                                             |
| **Speel op Ultimate**         | Upload en voer het PRG-bestand uit via de geconfigureerde C64 Ultimate REST-verbinding.                                                                      |
| **D64 uitvoeren op hardware** | Verpak een D64 en stuur deze naar de geconfigureerde C64 Ultimate.                                                                                           |
| **Kung Fu Flash 2**           | Compileer de UB-opstartbroncode en upload de PRG via USB naar een echte C64/C128 met een Kung Fu Flash 2-cartridge. Zie [Kung Fu Flash 2](#kung-fu-flash-2). |

De globale **Settings → Exomizer**-optie is ook van toepassing op UB-builds en
normale uitvoeringsdoelen; er is geen aparte schakelaar in de UB-werkbalk nodig.
Bij het starten van de debugger wordt bewust de niet-gecomprimeerde PRG
gebruikt, zodat compileradressen en symbolen overeenkomen met het uitgevoerde
programma.

Schakel **Instellingen → Programma-instellingen → UltimateBasic ASM-broncode
(.asm) genereren** in om de door de compiler gegenereerde assembly naast een
PRG- of D64-build op te slaan met dezelfde basisbestandsnaam. Dit is een
build-optie, dus de UB-werkbalk bevat geen aparte knoppen voor ASM-export. Een
`load "NAME", $address`-instructie levert ook het bijbehorende PRG-laadadres van
het D64-extrabestand.

### Syntaxmarkering

De editor gebruikt een transparante `<div>` overlay (`expert-hl`) die de inhoud
van het tekstgebied spiegelt met gekleurde `<span>` elementen. De markering kan
worden uitgeschakeld met de **HL** knop voor betere prestaties bij zeer grote
programma's.

- `.sym` voor symbolen in KickAssembler-stijl;
- `.dbg` voor C64Debugger/RetroDebugger bron- en segmentinformatie;
- `.vs` voor VICE-monitorlabels.

`REGION` / `ENDREGION`-richtlijnen worden gemarkeerd zoals de andere
assemblerrichtlijnen. In ingeklapte regio's blijft alleen de regiokop zichtbaar
in de editor totdat u ze opnieuw opent. De nieuwe **Regioselectie**-schakelaar
in de werkbalk regelt alleen de automatische markering van de huidige regio in
de Expert-modus; als u deze uitschakelt, blijft de broncode zichtbaar zonder de
ingeklapte status te wijzigen.

### Bronformatter

Klik op de knop **Format** (`#expert-format-btn`) om de huidige bron automatisch
te formatteren:

Ultimate Basic is ook beschikbaar als een zelfstandig open-sourceproject:

<https://github.com/zstarczali/UltimateBasic>

De compiler is gebundeld in Visual Assembler, dus er is geen apart `ub`
uitvoerbaar bestand nodig tijdens de uitvoering.

## 7. Adresseringsmodi

Elke 6502-instructie ondersteunt een of meer adresseermodi. De modusselector
staat op elk blok.

### Label expressies als operanden

- **Blok → Expert:** Het huidige programma wordt geserialiseerd naar tekst (één
  instructie per regel, labels en macro's als richtlijnen). Bewerkingen in de
  Expert-modus worden gesynchroniseerd met de blokarray wanneer u terugschakelt
  of een actie activeert.
- **Expert → Blok:** De tekst wordt geparseerd met `parseAsmText()` en het
  resultaat vervangt het blokprogramma. Er wordt een dialoogvenster met een
  compilatie-fout weergegeven als het parseren mislukt.
- **Lege regels** blijven behouden tijdens retouren: lege regels in de
  Expert-editor verschijnen als dunne stippellijnen in de Blokmodus en worden
  hersteld als lege regels wanneer er teruggeschakeld wordt naar Expert.

### De `*` programmateller in expressies

```
┌────────────────────────────────────────────────────────┐
│ [werkbalk] Blokkeren │ Expert &lt; tabblad wisselen │
├────────────┬───────────────────────────┬───────────┤
│ Palet │ ASM-teksteditor │ Disasm │
│ (optioneel) │ (monospace, bewerkbaar) │ paneel │
│ │ │ (optioneel) │
└────────────┴────────────────────────────┴────────────┘
```

| Paneel        | Schakelaar            | Beschrijving                                        |
| ------------- | --------------------- | --------------------------------------------------- |
| **Palet**     | `#expert-palette-btn` | Spring naar zichzelf (oneindige lus, offset `$FE`)  |
| `*-n` / `*+n` | `BNE *-5`, `BEQ *+4`  | Spring ten opzichte van de huidige pc met *n* bytes |
| `JMP *+n`     | `#expert-disasm-btn`  | Absolute sprong berekend vanaf de huidige pc        |

### Lokale (gestippelde) labels

| Knop                                  | ID                                             | Functie                                                                                                                                                                                                                                                       |
| ------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Formaat**                           | `#expert-format-btn`                           | Broncode automatisch formatteren (labels naar kolom 0, 4 spaties inspringen, 1 spatie voor mnemonic/operand)                                                                                                                                                  |
| **Laad .asm**                         | `#expert-load-asm-btn`                         | Open een `.asm`-bestand — de inhoud wordt geladen in een **nieuw tabblad** met de bestandsnaam als tabbladlabel. Elk geladen bestand wordt een onafhankelijk tabblad met eigen programmablokken en editorstatus.                                              |
| **Sla .asm op**                       | `#expert-save-asm-btn`                         | Sla de editorinhoud op in een `.asm`-bestand (bestanddialoogvenster bij de eerste keer opslaan)                                                                                                                                                               |
| **Bouwinfo**                          | `#expert-build-info-btn`                       | Open het dialoogvenster Build Info (oorsprong, grootte, labels, fouten).                                                                                                                                                                                      |
| **HL**                                | `#expert-hl-btn`                               | Syntaxmarkering in- of uitschakelen (uitschakelen voor zeer grote bestanden)                                                                                                                                                                                  |
| **Automatisch aanvullen**             | `#expert-autocomplete-btn`                     | Schakel de automatische aanvulsuggesties voor experts in of uit. Wanneer deze functie is uitgeschakeld, verschijnen er geen instructies, ezelsbruggetjes of labels in de experteditor.                                                                        |
| **Regioselectie**                     | `#expert-regio-selectie-knop`                  | Schakel de automatische regiomarkering in de expertmodus in of uit. De vouwstatus blijft behouden, maar wanneer deze functie is uitgeschakeld, blijft de volledige broncode zichtbaar in de editor en wordt het huidige gebied niet automatisch geselecteerd. |
| **Alle regio's inklappen/uitklappen** | `#expert-region-fold-all-btn`                  | Vouw elk `.region`-blok in één klik in of uit. Als er momenteel een regio open is, vouwt de knop ze allemaal in; als alle regio's al ingeklapt zijn, vouwt de volgende klik ze allemaal uit. De knop licht op wanneer alle regio's zijn ingeklapt.            |
| **Regelnummers**                      | `#expert-line-numbers-btn`                     | Schakel de regelnummermarge aan de linkerkant van de editor in of uit. De marge blijft gesynchroniseerd met de scrollpositie en wordt live bijgewerkt terwijl u typt.                                                                                         |
| **Vind**                              | `#expert-find-btn`                             | Open de zwevende zoekbalk (`Ctrl+F`). Typ om te zoeken; overeenkomsten worden gemarkeerd in de overlay. `Enter` / `Shift+Enter` navigeer tussen overeenkomsten. `Escape` sluit de balk.                                                                       |
| **Uitzoomen/inzoomen**                | `#expert-zoom-out-btn` / `#expert-zoom-in-btn` | Verklein/vergroot de lettergrootte van de editor (8–28 px). `Ctrl` + muiswiel (`Cmd` + wiel op macOS, of knijpen op het touchpad) boven de editor heeft hetzelfde effect. De instelling wordt opgeslagen.                                                     |
| **Palet**                             | `#expert-palette-btn`                          | Toon/verberg het linker geheugenpalet                                                                                                                                                                                                                         |
| **Disasm**                            | `#expert-disasm-btn`                           | Het demontagepaneel weergeven/verbergen (pure 6502, macro's uitgebreid)                                                                                                                                                                                       |
| **Monitor**                           | `#expert-monitor-btn`                          | Het paneel voor de hex-dump van de monitor weergeven/verbergen                                                                                                                                                                                                |
| **Minimap**                           | `#expert-minimap-btn`                          | Toon/verberg de code-minimap aan de rechterkant van de editor                                                                                                                                                                                                 |

*(Nieuw in 2.3.9.)* Een label waarvan de naam begint met een punt — `.loop`,
`.skip`, `.done` — is een **lokaal label**. Het behoort tot het bereik van het
dichtstbijzijnde voorafgaande **globale** (niet-puntige) label en wordt intern
`<global>.<name>`. Twee lokale labels met dezelfde korte naam onder
verschillende globale labels **botsen niet**.

### Operandlabels voor zelfmodificerende code

*(Nieuw in 2.3.9.)* Voorzie de operand van een instructie van het voorvoegsel
`label:` om een label op de **operandbyte** te plaatsen in plaats van op de
opcode. De instructie wordt geassembleerd vanuit alles wat na de dubbele punt
komt.

| Kleur van de balk     | Tokentype                                                |
| --------------------- | -------------------------------------------------------- |
| Commentaar kleur      | Regels die beginnen met `;`                              |
| Labelkleur            | Lijnen met een `label:` definitie                        |
| Richtlijnkleur        | `.byte`, `.macro`, `.region`, en alle andere richtlijnen |
| Mnemotechnische kleur | Al het overige (instructies)                             |

`value` wijst naar `<instructieadres> + 1` (de eerste operandbyte), voor elke
adresseermodus. Dit vervangt het oudere `STA instruction+1` / `instruction: LDA
#$00` patroon. Het doorloopt de Block ⇄ Expert-modus (het operandveld behoudt
het `label:`-voorvoegsel).

### Foutmarkering

Regels die niet compileren, worden in realtime gemarkeerd in **rood** (getinte
achtergrond + linker accentrand), 350 ms na elke toetsaanslag. Het eerste
foutbericht wordt ook weergegeven in de statusbalk. Corrigeer de regel en de
markering verdwijnt automatisch.

### Syntaxmarkering

De editor gebruikt een transparante `<div>` overlay (`expert-hl`) die de inhoud
van het tekstgebied spiegelt met gekleurde `<span>` elementen. De markering kan
worden uitgeschakeld met de **HL** knop voor betere prestaties bij zeer grote
programma's.

| Kleur       | Token                                                                                                                                                  |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Geelgroen   | Mnemonics (`LDA`, `STA`, `JMP`, …) en pseudo-operaties met lange vertakkingen (`LBNE`, `LBEQ`, …)                                                      |
| Blauw       | Richtlijnen (`.byte`, `.word`, `.fill`, `.assert`, `*=`, …)                                                                                            |
| Oranje      | Getallen (`$FF`, `%1010`, `255`)                                                                                                                       |
| Cyaan       | Labels — regels die eindigen op `:`, inclusief lokale labels (`.loop:`) en labels voor zelfmodificerende code-operanden (`value:` in `LDA value:#$00`) |
| Turkoois    | Stringliteralen                                                                                                                                        |
| Violet      | Aangepaste macronamen — de naam na `.macro`, `.invoke` en `.call`, en Kick-stijl `:name(...)`-aanroepen                                                |
| Aqua        | Macroparameters — de parameternamen in de `.macro`-header en de `{param}`-vervangingen in de macrobody.                                                |
| Donkergroen | Opmerkingen (`; …`)                                                                                                                                    |

`REGION` / `ENDREGION`-richtlijnen worden gemarkeerd zoals de andere
assemblerrichtlijnen. In ingeklapte regio's blijft alleen de regiokop zichtbaar
in de editor totdat u ze opnieuw opent. De nieuwe **Regioselectie**-schakelaar
in de werkbalk regelt alleen de automatische markering van de huidige regio in
de Expert-modus; als u deze uitschakelt, blijft de broncode zichtbaar zonder de
ingeklapte status te wijzigen.

### Bronformatter

Klik op de knop **Format** (`#expert-format-btn`) om de huidige bron automatisch
te formatteren:

- Labeldefinities worden verplaatst naar kolom 0.
- Instructies worden ingesprongen met 4 spaties.
- Ezelsbruggetjes worden met een hoofdletter geschreven.
- Precies één spatie tussen de mnemonische code en de operand (extra witruimte
  wordt genormaliseerd).
- Als de bron al geformatteerd is, wordt de status `"Al geformatteerd"`
  weergegeven.

### Projectpaneel en tabbladen

De expertmodus ondersteunt een **projectpaneel** (`#expert-project-panel`) voor
projecten met meerdere bestanden `.proj`:

- Een `.proj`-bestand is een JSON-manifest dat een lijst bevat van bronbestanden
  en hun metadata.
- Open een project met **Menu → Bestand → Project openen** of sleep een
  `.proj`-bestand naar het venster.
- Elk bestand in het project wordt geopend als een apart **tabblad** in de
  tabbladbalk bovenaan de editor.
- **Project sluiten** (`Menu → Bestand → Project sluiten` /
  `#menu-close-project`) sluit het huidige project en alle bijbehorende
  bestandstabbladen in één keer. Er wordt gevraagd om eventuele niet-opgeslagen
  wijzigingen op te slaan voordat het project wordt gesloten. Het projectpaneel
  wordt teruggezet naar de lege staat en `_expertProjectData` wordt gewist.
- Elk bestand kan worden gemarkeerd als het **opstartbestand** (★
  sterpictogram). Wanneer een opstartbestand is ingesteld, compileert en voert
  de **Uitvoeren** knop (PRG, D64, Ultimate) altijd de code van dat bestand uit,
  ongeacht welk tabblad momenteel actief is. Dit werkt zowel in de blokmodus als
  in de expertmodus.
- Met de knop **Toevoegen** in de werkbalk kunt u één of meerdere bestanden
  tegelijk selecteren (elk type, niet alleen `.json`/`.asm`) en deze in het
  project toevoegen zonder ze te openen. Gebruik deze knop voor binaire
  bestanden zoals `incbin`-gegevens. Het dialoogvenster wordt standaard
  weergegeven als de VA-werkmap. De naastgelegen knop **Map toevoegen** verwijst
  op dezelfde manier naar een hele map (bijvoorbeeld een map met bestanden).
  Items die alleen een verwijzing bevatten, tonen een knop voor verwijderen (✕),
  maar worden niet geopend wanneer u erop klikt.
- Mappen in de boomstructuur hebben een inklap-/uitklappijl, en **klik met de
  rechtermuisknop op een map** om een of meer bestanden die eronder genest zijn
  toe te voegen (ingesprongen weergegeven).
- De knop **Project opslaan** wordt uitgeschakeld en toont de status
  "Opgeslagen" zodra er geen wijzigingen meer in het project zijn, en wordt
  automatisch weer ingeschakeld zodra u een bestand of map toevoegt, verwijdert
  of reorganiseert.
- Het gedeelte **symbolen** onderaan het projectpaneel kan verticaal worden
  aangepast met behulp van de scheidingslijn tussen de bestandsstructuur en de
  symbolenlijst, zodat lange symbolenlijsten meer ruimte kunnen innemen wanneer
  dat nodig is.
- **Versiebeheer** werkt voor het hele project: met de **Project**-schakelaar in
  het dialoogvenster Versiebeheer wordt één commit vastgelegd voor elk
  projectbestand, en bij Uitchecken worden ze allemaal teruggezet in de
  tabbladen. Zie [Projectmodus](#project-mode).

### Tabbalk

De tabbladbalk verschijnt boven de editor wanneer er meer dan één tabblad
geopend is.

| Functie                 | Beschrijving                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Vuile stip**          | Een klein, contrasterend gekleurd stipje bij de tabnaam geeft aan dat er nog wijzigingen zijn die niet zijn opgeslagen.                                                                                                                                                                                                                                                                                                       |
| **Scrollpijlen**        | De scrollknoppen naar links/rechts verschijnen wanneer er meer tabbladen zijn dan er in de balk passen.                                                                                                                                                                                                                                                                                                                       |
| **Sluiten (×)**         | Sluit het tabblad; vraagt om op te slaan als het tabblad gewijzigd is.                                                                                                                                                                                                                                                                                                                                                        |
| **Bestandsextensie**    | De volledige bestandsnaam inclusief extensie (`.c64va`, `.json`) wordt weergegeven.                                                                                                                                                                                                                                                                                                                                           |
| **Rechtermuisklikmenu** | Klik met de rechtermuisknop op een tabblad (of een lege ruimte in de tabbladbalk) voor: **Nieuw tabblad**, **Tabblad sluiten**, **Andere tabbladen sluiten**, **Tabbladen rechts sluiten**, **Alle tabbladen sluiten**. Bij het sluiten van meerdere tabbladen tegelijk wordt er per gewijzigd tabblad een prompt weergegeven en wordt de actie gestopt als u annuleert. **Alles sluiten** laat altijd één leeg tabblad open. |

> **Tip:** Paletsynchronisatie (`#expert-palette-sync-btn`) zorgt ervoor dat de
> paletselectie synchroon blijft met de sneltoets bij de cursor. Schakel deze
> functie uit als u niet wilt dat het palet verspringt tijdens het bewerken.

---

## 8. Standaard 6502-instructies

Elke 6502-instructie ondersteunt een of meer adresseermodi. De modusselector
staat op elk blok.

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

### Gegevensverplaatsing

Elk operandveld dat een adres of directe waarde accepteert, accepteert ook
rechtstreeks een **constante naam** (uit een `CONST`-blok of een `LABEL`).
Daarnaast kunt u **label+offset** of **label−offset** expressies gebruiken om te
verwijzen naar een adres ten opzichte van een benoemde constante:

| Syntaxis | Voorbeeld             | Beschrijving                                                                                                                 |
| -------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `LDA`    | Belastingsaccumulator | onmiddellijk, nulPagina, absoluut, absoluutX, absoluutY, indirectX, indirectY                                                |
| `LDX`    | Laad X-register       | onmiddellijk, nulpagina, nulpaginaY, absoluut, absoluutY                                                                     |
| `LDY`    | Laad Y-register       | onmiddellijk, nulpagina, absoluut, absoluteX                                                                                 |
| `STA`    | Winkelaccumulator     | zeroPage, absolute, absoluteX, absoluteY, indirectX, indirectY                                                               |
| `STX`    | Winkel X kassa        | nulPagina, nulPaginaY, absoluut                                                                                              |
| `STY`    | Winkel Y kassa        | nulPagina, absoluut                                                                                                          |
| `*`      | `BNE *`               | Huidige programmateller (het eigen adres van de instructie); sprongen met `*` genereren een oneindige zelflus (offset `$FE`) |

**Voorbeeld — wis twee schermpagina's met behulp van een CONST:**
```
; .CONST screen_ram = $0400

LDX #$00
wissen:

STA screen_ram,X

STA screen_ram+$0100,X

DEX

BNE wissen
```

### Rekenkundig

*(Nieuw in 2.3.9.)* `*` is niet langer beperkt tot de volledige operand — het
kan ** overal binnen een operandexpressie voorkomen** en staat voor het adres
van de instructie waarop het is geschreven. Het wordt tijdens de assembleertijd
opgelost ten opzichte van het werkelijke adres van die instructie, dus er is
geen label nodig voor korte relatieve sprongen of PC-relatieve gegevenslezingen.

| Syntaxis | Voorbeeld                | Betekenis                                                                 |
| -------- | ------------------------ | ------------------------------------------------------------------------- |
| `*`      | `BNE *`                  | Stel de carry-eigenschap in met `SEC` vóór gebruik in de meeste gevallen. |
| `SBC`    | Aftrekken met overdracht | Stel de overdracht in met `SEC` vóór de aftrekking.                       |
| `INC`    | Geheugen vergroten       | —                                                                         |
| `DEC`    | Verminder het geheugen   | —                                                                         |
| `CMP`    | Vergelijk met A          | Stelt vlaggen in; wijzigt A niet.                                         |

**PC versus vermenigvuldiging.** `*` wordt alleen als programmateller behandeld
wanneer deze zich in *waardepositie* bevindt — aan het begin van de expressie,
of direct na een operator, `(`, `,`, `&lt;`, `&gt;` of witruimte. Een `*` die
volgt op een getal, `)` of een identifier is gewone vermenigvuldiging, dus
`LDA-tabel*2` en `CONST_A*4` blijven ongewijzigd.

**Waar het werkt.** Elke operand die al een expressie accepteert:
vertakkingsdoelen, `JMP` / `JSR`, `LDA`/`STA`/… absolute en geïndexeerde,
directe lage/hoge byte-operatoren, en de `.assert`-expressie. `*` verandert
nooit de grootte van een instructie, dus het is veilig in elke adresseermodus.

### Logica

*(Nieuw in 2.3.9.)* Een label waarvan de naam begint met een punt — `.loop`,
`.skip`, `.done` — is een **lokaal label**. Het behoort tot het bereik van het
dichtstbijzijnde voorafgaande **globale** (niet-puntige) label en wordt intern
`<global>.<name>`. Twee lokale labels met dezelfde korte naam onder
verschillende globale labels **botsen niet**.

```
DrawSprite:

LDX #0
.loop: ; == DrawSprite.loop

LDA SpriteData,X

STA $2000,X

INX

CPX #63

BNE .loop ; wordt opgelost binnen DrawSprite

RTS

ClearScreen:

LDX #0
.loop: ; == ClearScreen.loop — geen conflict

STA $0400,X

INX

BNE .loop

RTS
```

- Binnen een bereik kun je naar een lokaal label verwijzen als `.name`.
- Vanuit een andere scope kun je er expliciet naar verwijzen als `Global.name`
  (bijv. `JMP ClearScreen.loop`).
- Een `.name` die vóór een globaal label wordt geschreven, blijft een gewoon
  label op het hoogste niveau, zoals `.name`.
- Lokale labels worden ongewijzigd doorgegeven tussen blok- en expertmodus; het
  voorvoegsel `<global>.` is een detail dat tijdens de lay-out wordt bepaald en
  wordt nooit in het blokprogramma opgeslagen.

### Sprongen en takken

*(Nieuw in 2.3.9.)* Voorzie de operand van een instructie van het voorvoegsel
`label:` om een label op de **operandbyte** te plaatsen in plaats van op de
opcode. De instructie wordt geassembleerd vanuit alles wat na de dubbele punt
komt.

```
setup:

LDA value:#$00 ; 'value' -&gt; adres van de #$00 operandbyte

... patch:

LDA #new

STA value ; schrijft de operandbyte direct — klassieke SMC
```

`value` wijst naar `<instructieadres> + 1` (de eerste operandbyte), voor elke
adresseermodus. Dit vervangt het oudere `STA instruction+1` / `instruction: LDA
#$00` patroon. Het doorloopt de Block ⇄ Expert-modus (het operandveld behoudt
het `label:`-voorvoegsel).

---

## 9. Macroblokken — Referentie

### LABEL

| Ezelsbruggetje | Beschrijving                                            | Modi                                                                          |
| -------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Labelnaam      | Identificatiecode gebruikt in `JMP`, `JSR`, `BNE`, enz. | onmiddellijk, nulPagina, absoluut, absoluutX, absoluutY, indirectX, indirectY |
| `LDX`          | Laad X-register                                         | onmiddellijk, nulpagina, nulpaginaY, absoluut, absoluutY                      |
| `LDY`          | Laad Y-register                                         | onmiddellijk, nulpagina, absoluut, absoluteX                                  |
| `STA`          | Winkelaccumulator                                       | zeroPage, absolute, absoluteX, absoluteY, indirectX, indirectY                |
| `STX`          | Winkel X kassa                                          | nulPagina, nulPaginaY, absoluut                                               |
| `STY`          | Winkel Y kassa                                          | nulPagina, absoluut                                                           |

### COMMENT

| Ezelsbruggetje | Beschrijving             | Notities                                                                  |
| -------------- | ------------------------ | ------------------------------------------------------------------------- |
| `ADC`          | Voeg toe met meenemen    | Stel de carry-eigenschap in met `SEC` vóór gebruik in de meeste gevallen. |
| `SBC`          | Aftrekken met overdracht | Stel de overdracht in met `SEC` vóór de aftrekking.                       |
| `INC`          | Geheugen vergroten       | —                                                                         |
| `DEC`          | Verminder het geheugen   | —                                                                         |
| `CMP`          | Vergelijk met A          | Stelt vlaggen in; wijzigt A niet.                                         |
| `CPX`          | Vergelijk met X          | —                                                                         |
| `CPY`          | Vergelijk met Y          | —                                                                         |

### BYTE

| Ezelsbruggetje | Beschrijving                                                                |
| -------------- | --------------------------------------------------------------------------- |
| Operande       | Door komma's gescheiden byte-waarden (bijv. `$01, $02, $FF` of `1, 2, 255`) |
| `ORA`          | Logische OF met accumulator                                                 |
| `EOR`          | Exclusieve OF met accumulator                                               |
| `BIT`          | Test de bits in het geheugen tegen A (stelt de N-, V- en Z-vlaggen in).     |

### WORD

| Ezelsbruggetje | Beschrijving                                                   |
| -------------- | -------------------------------------------------------------- |
| Operande       | Door komma's gescheiden 16-bits waarden (bijv. `$0400, $C000`) |
| `JSR`          | Spring naar subroutine (slaat het retouradres op de stack op)  |
| `RTS`          | Terugkeer uit subroutine                                       |
| `RTI`          | Terugkeer van onderbreking                                     |
| `BNE`          | Splitsen indien niet gelijk (Z=0)                              |
| `BEQ`          | Takken indien gelijk (Z=1)                                     |
| `BCC`          | Branch if Carry Clear (C=0)                                    |
| `BCS`          | Branch if Carry Set (C=1)                                      |
| `BMI`          | Branch if Minus (N=1)                                          |
| `BPL`          | Branch if Plus (N=0)                                           |
| `BVC`          | Vertakking indien overloop wissen (V=0)                        |
| `BVS`          | Vertakking als de set overloopt (V=1)                          |

#### LBNE / LBEQ / … (Lange takken)

*(Nieuw in 2.3.9.)* De paletcategorie **Lange sprongen** bevat acht
pseudo-operaties die zich gedragen als voorwaardelijke sprongen, maar **elk
adres** bereiken, niet alleen −128…+127. Elk ervan assembleert tot een
omgekeerde sprong die een 3-byte `JMP` overslaat — altijd **5 bytes**:

```
LBEQ voltooid; assembleert naar: BNE *+3 ($D0 $03)

; JMP voltooid ($4C lo hi)
```

| Lange operatie | Voorwaarde            | Uitgestoten als        |
| -------------- | --------------------- | ---------------------- |
| `LBNE`         | niet gelijk aan (Z=0) | `BEQ *+3 / JMP-doel`   |
| `LBEQ`         | gelijk (Z=1)          | `BNE *+3 / JMP target` |
| `LBCC`         | carry clear (C=0)     | `BCS *+3 / JMP-doel`   |
| `LBCS`         | draagset (C=1)        | `BCC *+3 / JMP-doel`   |
| `LBMI`         | min (N=1)             | `BPL *+3 / JMP-doel`   |
| `LBPL`         | plus (N=0)            | `BMI *+3 / JMP-doel`   |
| `LBVC`         | overflow clear (V=0)  | `BVS *+3 / JMP-doel`   |
| `LBVS`         | overloopset (V=1)     | `BVC *+3 / JMP-doel`   |

- Operand: een label, een `*`-expressie of een letterlijk adres — hetzelfde als
  een normale vertakkingsdoel.
- Kosten: 5 bytes en 1 extra cyclus op het gekozen pad in vergelijking met een
  korte sprong. Er is geen automatische promotie van een korte sprong — je kiest
  expliciet voor `LBxx`.
- Wanneer een gewone sprong (`BNE`, `BEQ`, …) buiten het bereik valt, geeft de
  compilerfout nu de exacte overschrijding aan en suggereert de overeenkomende
  `LBxx`.

### FILL

| Ezelsbruggetje | Beschrijving                                            |
| -------------- | ------------------------------------------------------- |
| Operande       | `count,value` — bijv. `256,0` vult 256 bytes met nullen |
| `TAY`          | Overdracht A → Y                                        |
| `TXA`          | Overdracht X → A                                        |
| `TYA`          | Overdracht Y → A                                        |
| `TSX`          | Overdrachtspunt naar stack → X                          |
| `TXS`          | Overdracht X → Stackpointer                             |
| `INX`          | Verhoog X                                               |
| `DEX`          | Verminder X                                             |
| `INY`          | Verhoog Y                                               |
| `DEY`          | Verminder Y                                             |

### ALIGN

| Ezelsbruggetje | Beschrijving                                                                   |
| -------------- | ------------------------------------------------------------------------------ |
| Grens          | Uitlijningswaarde — bijv. `64` (spritegrens), `256` (pagina), `$2000` (bitmap) |
| `LSR`          | Logische verschuiving naar rechts                                              |
| `ROL`          | Draai naar links door de Carry-functie                                         |
| `ROR`          | Draai naar rechts tijdens het dragen.                                          |

### TEXT

| Ezelsbruggetje    | Beschrijving                                                    |
| ----------------- | --------------------------------------------------------------- |
| Tekst             | De weer te geven tekenreeks                                     |
| X                 | Kolom (0–39)                                                    |
| Y                 | Rij (0–24)                                                      |
| Label (optioneel) | Kent een label toe dat verwijst naar het berekende schermadres. |

### STRING

| Ezelsbruggetje          | Beschrijving                                                                                            |
| ----------------------- | ------------------------------------------------------------------------------------------------------- |
| Tekst                   | De te schrijven tekenreeks                                                                              |
| Adres                   | Doelgeheugenadres — `$C000` hex of een **labelnaam**                                                    |
| Label (optioneel)       | Kent een label toe dat verwijst naar het doeladres.                                                     |
| Verschuiving            | Hexadecimale waarde (00–FF) toegevoegd aan elke byte van de schermcode (bijv. `$80` = omgekeerde video) |
| Kleine letters tekenset | Selectievakje — dezelfde betekenis als TEKST (zie het gedeelte TEKST)                                   |
| `SED`                   | Decimale modus instellen                                                                                |
| `SEI`                   | Stel de onderbrekingsfunctie in op uitschakelen                                                         |
| `NOP`                   | Geen operatie                                                                                           |
| `BRK`                   | Geforceerde onderbreking / software-onderbreking                                                        |

### DATA

Net als een **POKE-lus** — schrijft een lijst met ruwe bytes naar een
geheugenadres tijdens de uitvoering, één LDA/STA-paar per byte.

**Expert syntax:**

---

## 10. Integratie van de debugger

De app ondersteunt **RetroDebugger** als externe C64-debugger. Deze ontvangt
breakpoints, symbolen en autostart-vlaggen die gegenereerd worden door het
geassembleerde programma.

---

### RetroDebugger

[RetroDebugger]{1} is een platformonafhankelijke Commodore 64-debugger met
ondersteuning voor breakpoints, geheugeninspectie en labelbewuste disassemblage.

| Veld      | Beschrijving                                            |
| --------- | ------------------------------------------------------- |
| Labelnaam | Identificatiecode gebruikt in `JMP`, `JSR`, `BNE`, enz. |

**Expert syntax:**
```
lus:
```

**Gegenereerde ASM:**
```
lus: ; $0820
```

Het huidige adres wordt als commentaar weergegeven. Labels hebben een grootte
van **0 bytes**.

---

### Breekpuntblokken

Klik op het breakpoint-pictogram (●) bij een instructieblok om dit als
breakpoint in te stellen. Blokken met een breakpoint worden rood gemarkeerd. Hun
adressen worden bij elke start van de debugger naar het breakpointbestand
geschreven.

**Expert syntax:**
```
Uw reactietekst hier
```

**Gegenereerde ASM:**
```
Uw reactietekst hier
```

---

### Foutopsporingsvlaggen (tabblad Opties)

Net als **DATA in BASIC** — slaat een lijst met onbewerkte byte-waarden direct
in het programma op.

| Veld     | Beschrijving |
| -------- | ------------ |
| Operande | `-jmp $ADDR` |

**Expert syntax:**
```
.byte $01, $02, $FF
```

**Gegenereerde ASM:**
```
.byte $01, $02, $FF
```

** Referenties naar lage/hoge byte-labels: ** BYTE accepteert tokens in
KickAssembler/ca65-stijl `<label` (lage byte) en `>label` (hoge byte) naast
numerieke waarden. De assembler lost het labeladres op tijdens het compileren en
voegt de juiste byte in. Voorbeeld:

```
.byte <frame_0, >frame_0, <frame_1, >frame_1
```

Hierin wordt de lage byte van het adres van `frame_0` opgeslagen, vervolgens de
hoge byte, en daarna hetzelfde voor `frame_1`. Handig voor het maken van
sprongtabellen en adreslijsten.

**Grootte:** Aantal bytes in de lijst.

---

### WOORD

Net als **DATA in BASIC, maar dan voor 16-bits getallen **. Elke waarde wordt
opgeslagen als twee bytes (eerst de lage byte, dan de hoge byte — 6502
little-endian volgorde).

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

### VULLEN

Zoals `FOR I=1 TO N : POKE addr+I, val : NEXT` — vult een geheugenblok met
dezelfde byte, maar in één blok. Ideaal voor het wissen van gebieden of het
vooraf vullen van tabellen.

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

**Expressiesyntaxis:** Zowel `count` als `value` accepteren rekenkundige
expressies. Je kunt verwijzen naar CONST-namen, hexadecimale/binaire letterlijke
waarden gebruiken en ingebouwde wiskundige functies aanroepen:

| Uitdrukking                 | Betekenis                                              |
| --------------------------- | ------------------------------------------------------ |
| `TEGEL_AANTAL, $00`         | tellen vanaf een CONST, waarde hexadecimaal letterlijk |
| `40*25, 0`                  | inline vermenigvuldiging                               |
| `round(sin(PI/4)*255), $80` | trigonometrie                                          |

**Ingebouwde functies:** `sin()`, `cos()`, `round()`, `max(a,b)`, `min(a,b)`,
`abs()`, constant `PI`

Operatoren: `+ - * /` Literalen: `$FF` (hex), `%10110000` (binair)
Laagste/hoogste byte: `lo(expr)`, `hi(expr)`

**Grootte:** De telwaarde in bytes.

---

### UITLIJNEN

Schuift het huidige adres naar voren naar de volgende schone grens door
nulopvullingsbytes in te voegen. De C64 vereist dat spritegegevens beginnen op
een grens van 64 bytes — `ALIGN 64` regelt dat automatisch.

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
; ALIGN 64 → $0840 (12 bytes opvulling)
```

**Grootte:** Dynamisch — afhankelijk van de huidige programmatellerpositie.

> **Tip:** Gebruik `ALIGN 64` vóór spritegegevens, `ALIGN 256` om ervoor te
> zorgen dat tabellen pagina-uitgelijnd zijn.

---

### TEKST

Net als **PRINT AT** — schrijft tekst rechtstreeks naar het C64-scherm op een
bepaalde kolom en rij, zonder de kernel te gebruiken. Het genereert één
LDA/STA-paar per teken, gericht op het scherm-RAM op `$0400`.

| Veld                    | Beschrijving                                                    |
| ----------------------- | --------------------------------------------------------------- |
| Tekst                   | De weer te geven tekenreeks                                     |
| X                       | Kolom (0–39)                                                    |
| Y                       | Rij (0–24)                                                      |
| Label (optioneel)       | Kent een label toe dat verwijst naar het berekende schermadres. |
| Kleine letters tekenset | Selectievakje — zie hieronder                                   |

**Tekensetmodi:**

De C64 heeft twee tekensets die tijdens het uitvoeren van het spel kunnen worden
geselecteerd:

| Modus                                              | $D018 bit 1 | Hoofdletterinvoer                | Invoer van kleine letters            |
| -------------------------------------------------- | ----------- | -------------------------------- | ------------------------------------ |
| **Hoofdletters/afbeeldingen** (standaard)          | 0           | `A`–`Z` → schermcodes $01–$1A ✓  | ook als hoofdletter behandeld        |
| **Kleine letters/hoofdletters** (na CHARSET lower) | 1           | `A`–`Z` → $01–$1A (hoofdletters) | `a`–`z` → $41–$5A (kleine letters) ✓ |

- **Hoofdlettertekenset (standaard, selectievakje niet aangevinkt):** Typ wat u
  in hoofdletters wilt zien. `"HALLO"` wordt weergegeven als `HALLO`. Invoer in
  kleine letters wordt omgezet naar hoofdlettercodes op het scherm.
- **Tekenset voor kleine letters (selectievakje aangevinkt):** Typ de exacte
  hoofdlettergevoeligheid die u wilt zien. `"hello"` → weergave in kleine
  letters, `"HELLO"` → weergave in hoofdletters. Vereist een
  runtime-tekensetwissel voordat het scherm wordt beschreven (gebruik de macro
  **CHARSET lower**).

**Gegenereerde ASM (hoofdlettermodus, `"HALLO"`):**
```
LDA #$08 ; 'H' schermcode $08

STA $0400

LDA #$05 ; 'E' schermcode $05

STA $0401

...
```

**Expert syntax:**
```
.text 0, 2, "HALLO" ; hoofdletters (standaard)
.text 0, 2, "hallo", lower ; kleine letters
```

Tekens worden gecodeerd als **schermcodes** (niet PETSCII). **Grootte:**
`tekstlengte × 5` bytes (LDA + STA per teken).

---

### SNAAR

Net zoals **POKE een string** in een willekeurig geheugenadres tijdens runtime.
Genereert LDA/STA-paren die de schermcode van elk teken naar opeenvolgende
adressen kopiëren.

| Veld                    | Beschrijving                                                                                            |
| ----------------------- | ------------------------------------------------------------------------------------------------------- |
| Tekst                   | De te schrijven tekenreeks                                                                              |
| Adres                   | Doelgeheugenadres — `$C000` hex of een **labelnaam**                                                    |
| Label (optioneel)       | Kent een label toe dat verwijst naar het doeladres.                                                     |
| Verschuiving            | Hexadecimale waarde (00–FF) toegevoegd aan elke byte van de schermcode (bijv. `$80` = omgekeerde video) |
| Kleine letters tekenset | Selectievakje — dezelfde betekenis als TEKST (zie het gedeelte TEKST)                                   |

**Expert syntax:**
```
.string $C000, "HALLO" ; hoofdletters (standaard)
.string $C000, "hallo", lower ; kleine letters
.string $C000, "HALLO", 80 ; met shift (omgekeerde video)
.string $C000, "hallo", 80, lower ; shift + kleine letters
.string $C000, "HALLO" :my_string ; met macroLabel
```

**Gegenereerde ASM:**
```
LDA #$08 ; 'H' schermcode

STA $C000

LDA #$05 ; 'E' schermcode

STA $C001

...
```

Tekens worden gecodeerd als **schermcodes** (niet PETSCII). De optionele
**Shift**-waarde wordt aan elke byte toegevoegd, bijvoorbeeld `$80` voor
omgekeerde video. **Grootte:** `tekstlengte × 5` bytes (één LDA + één STA per
teken).

---

### GEGEVENS

Net als een **POKE-lus** — schrijft een lijst met ruwe bytes naar een
geheugenadres tijdens de uitvoering, één LDA/STA-paar per byte.

| Veld              | Beschrijving                                         |
| ----------------- | ---------------------------------------------------- |
| Bytes             | Door komma's gescheiden byte-waarden                 |
| Adres             | Doelgeheugenadres — `$C000` hex of een **labelnaam** |
| Label (optioneel) | Kent een label toe dat verwijst naar het doeladres.  |

**Expert syntax:**
```
.data $C000, $01, $02, $03 ; hex-adres
.data my_buf, $01, $02, $03 ; labeladres
.data $C000, $01, $02, $03 :mydata ; met macroLabel
```

**Gegenereerde ASM:**
```
LDA #$01
    STA $C000
    LDA#$02
    STA $C001
    ...
```

**Grootte:** `byte_count × 5` bytes (één LDA + één STA per byte).

---

### RAWBYTES

Net als **DATA die direct in het geheugen wordt geladen** — helemaal geen
runtime-code. De bytes zijn aanwezig vanaf het moment dat de PRG wordt geladen,
nog voordat je code begint. Gebruik dit voor sprite-data, level-maps,
opzoektabellen, alles wat gewoon op een specifiek adres moet staan.

| Veld              | Beschrijving                                         |
| ----------------- | ---------------------------------------------------- |
| Bytes             | Door komma's gescheiden byte-waarden                 |
| Adres             | Doelgeheugenadres — `$C000` hex of een **labelnaam** |
| Label (optioneel) | Kent een label toe dat verwijst naar het doeladres.  |

**Expert syntax:**
```
.rawbytes $C000, $00, $00, $00 ; hexadecimaal adres
.rawbytes sprite_data, $00, $00 ; labeladres
.rawbytes $0C50, $00, $00 :nev ; met macroLabel — andere code kan LDA nev,X gebruiken
```

**Grootte in code: ** 0 bytes. De gegevens worden op het opgegeven adres in de
uitvoer geplaatst.

> **DATA vs RAWBYTES:** DATA genereert LDA/STA-code die bytes tijdens runtime
> kopieert (langzamer, maar werkt als de data dynamisch moet zijn). RAWBYTES
> plaatst de bytes direct — geen code, direct, geen kosten.

---

### RAWTEXT

Net als RAWBYTES, maar dan voor tekst: de tekenreeks wordt gecodeerd als
schermcodes en de bytes worden op een vast adres geplaatst met **geen
runtimecode**. De tekst is direct in het geheugen beschikbaar zodra de PRG wordt
geladen.

| Veld                    | Beschrijving                                                                                            |
| ----------------------- | ------------------------------------------------------------------------------------------------------- |
| Tekst                   | Te coderen tekenreeks                                                                                   |
| Adres                   | Doelgeheugenadres — `$C000` hex of een **labelnaam**                                                    |
| Label (optioneel)       | Kent een label toe dat verwijst naar het doeladres.                                                     |
| Verschuiving            | Hexadecimale waarde (00–FF) toegevoegd aan elke byte van de schermcode (bijv. `$80` = omgekeerde video) |
| Kleine letters tekenset | Selectievakje — dezelfde betekenis als TEKST (zie het gedeelte TEKST)                                   |

**Expert syntax:**
```
.rawtext $C000, "HALLO" ; hoofdletters (standaard)
.rawtext $C000, "hello", lower ; kleine letters
.rawtext $C000, "HALLO", 80 ; met shift (omgekeerde video)
.rawtext $C000, "hello", 80, lower ; shift + kleine letters
.rawtext $0400, "HALLO" :my_text ; met macroLabel
```

**Gegenereerde ASM:**
```
; .rawtext "HALLO" -&gt; $C000
; $C000

.byte $08, $05, $0C, $0C, $0F ; H E L L O (schermcodes in hoofdletters)

; .rawtext "hello", kleine letters -&gt; $C000
; $C000

.byte $48, $45, $4C, $4C, $4F ; h e l l o (schermcodes in kleine letters, bereik $41–$5A)
```

**Grootte in code: ** 0 bytes. De gegevens worden op het opgegeven adres in de
uitvoer geplaatst.

> **STRING vs RAWTEXT:**STRING genereert LDA/STA-code die de tekst tijdens
> runtime kopieert. RAWTEXT bakt de bytes in de PRG tijdens het laden — geen
> code, geen wachttijd.

---

### PETSCII

Net als **RAWBYTES maar dan voor KERNAL-uitvoer** — codeert de tekenreeks als
PETSCII-bytes (compatibel met CHROUT op `$FFD2`) en plaatst deze op een vast
adres zonder runtime-code. Gebruik dit wanneer u tekens wilt afdrukken via `JSR
$FFD2` in een lus, en merk op dat de nieuwe `PRINT`-macro dezelfde encoder en
hetzelfde gedrag van het selectievakje voor kleine letters gebruikt.

> **PETSCII versus schermcodes:** PETSCII en schermcodes zijn twee verschillende
> coderingen. Schermcode `$01` = letter A; PETSCII `$41` = letter A (via
> CHROUT). Gebruik PETSCII alleen bij het afdrukken via de KERNAL; gebruik
> TEXT/STRING/RAWTEXT om direct naar het scherm-RAM te schrijven.

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
.petscii $C000, "HALLO" ; hoofdletters PETSCII (standaard)
.petscii $C000, "hallo", lower ; kleine letters PETSCII ($61–$7A)
.petscii $C000, "HALLO", null ; met null-terminator
.petscii $C000, "hallo", lower, null ; kleine letters + null-terminator
.petscii $C000, "HALLO" :my_msg ; met macroLabel
```

**Gegenereerde bytes (hoofdletters, `"HALLO"`):**
```
; $C000

.byte $48, $45, $4C, $4C, $4F ; H E L L O (PETSCII $41–$5A bereik)
```

**Grootte in code: ** 0 bytes. De gegevens worden op het doeladres geplaatst als
een uitgestelde gegevenssectie (zoals RAWBYTES).

**Null-terminator:** Vink het selectievakje *"Voeg `$00` (null-terminator) toe"*
aan om automatisch een `$00` byte na de tekst toe te voegen. Ideaal voor
null-terminated lussen:

```
LDX #$00
lus:

LDA bericht,X

BEQ klaar; $00 stopt de lus

JSR $FFD2

INX

BNE-lus
klaar:

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

> **Tip:** Gebruik PETSCII voor gegevens die via CHROUT worden uitgevoerd
> (`$FFD2`). Gebruik STRING of RAWTEXT in plaats daarvan om rechtstreeks naar
> het scherm-RAM te schrijven.

---

### TEKENSET

Schakelt de VIC-II-karakter-ROM tussen hoofdletter-/grafische modus (standaard
C64) en kleine letter-/hoofdlettermodus door bit 1 van `$D018` tijdens runtime
te wijzigen.

| Veld  | Beschrijving                                                                                                                                            |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Modus | **Kleine letters** — schakelt de tekenset voor kleine/hoofdletters in; **Hoofdletters** — herstelt de standaard tekenset voor hoofdletters/afbeeldingen |

**Expert syntax:**
```
.charset lower; schakel over naar de tekenset voor kleine letters
.charset upper; schakel terug naar de tekenset voor hoofdletters/afbeeldingen
```

**Gegenereerde ASM:**

Kleine lettermodus:
```
LDA $D018

ORA #$02 ; bit 1 instellen → ROM voor kleine/hoofdletters op $1800

STA $D018
```

Hoofdlettermodus:
```
LDA $D018

EN #$FD ; wis bit 1 → hoofdletters/grafische ROM op $1000

STA $D018
```

**Grootte:** 8 bytes (LDA abs + ORA/AND imm + STA abs).

**Waarom ORA/AND in plaats van een directe schrijfbewerking?** `$D018` regelt
ook de locatie van het scherm-RAM (bits 7-4). Door alleen bit 1 te schakelen,
blijft de rest van het register behouden.

**Typische workflow:**

```
CHARSET lower; schakel over naar kleine letters

TEKST 0, 0, "hallo wereld"; [selectievakje: Kleine letters]

...

CHARSET upper; herstel de standaardinstellingen na gebruik
```

Of in de expertmodus:
```
.charset lower
.text 0, 0, "hello world", lower
.charset upper
```

In de Expert-modus doorloopt het `.charset`-blok nu ook het keuzemenu voor de
modus, zodat de blokpreview en de geëxporteerde broncode op één lijn blijven.

> **Opmerking:** De CHARSET-macro wijzigt alleen de pointer naar het
> VIC-teken-ROM. Deze roept `$E544` (KERNAL-tekensetinitialisatie) niet aan. In
> de meeste gevallen is dit voldoende; roep `JSR $E544` alleen eerst aan als u
> wilt dat de printroutines van de KERNAL de wijziging respecteren.

---

### CHARDEF

Definieert een enkel 8×8 aangepast teken in een op RAM gebaseerde tekenset.
Genereert inline runtime-code die 8 bytes kopieert naar `base + index * 8`
tijdens de uitvoering — er is geen voorafgaand label of `ORG` nodig.

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
LDA#$18
    STA $3A08
    LDA#$3C
    STA $3A09
    LDA#$66
    STA $3A0A
    LDA#$7E
    STA $3A0B
    LDA#$66
    STA $3A0C
    LDA#$66
    STA $3A0D
    LDA#$66
    STA $3A0E
    LDA#$00
    STA $3A0F
```

**Doeladres:** `$3800 + 65 * 8 = $3A08`. Berekend tijdens het compileren en
vastgelegd in de STA-operanden.

**Grootte:** 40 bytes per teken (8 × 5).

**Typische workflow:**
```
; Point VIC-II at RAM charset at $3800

LDA $D018

AND #$F1

ORA #$0E ; bits 3-1 = %111 → charset at bank+$3800

STA $D018

CHARDEF $3800, 65, $18,$3C,$66,$7E,$66,$66,$66,$00 ; herdefinieer 'A'

CHARDEF $3800, 66, $7C,$66,$66,$7C,$66,$66,$7C,$00 ; herdefinieer 'B'

; ... meer CHARDEF-aanroepen voor elk aangepast teken
```

**Wanneer CHARDEF gebruiken versus alternatieven:**

| Benadering                       | Gebruik wanneer                                                                                                 |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **CHARDEF**                      | Je hebt een paar aangepaste tekens nodig (bijvoorbeeld 1-20). De uitvoeringskosten bedragen 40 bytes per teken. |
| **RAWBYTES @ $3800**             | Je hebt een volledig aangepaste tekenset (256 tekens). In totaal 2 KB aan gegevens, geen runtime-kopie.         |
| **INCBIN "charset.bin" @ $3800** | Extern tekensetbestand (gemaakt door de tekeneditor). De meest overzichtelijke optie.                           |
| **Tekenset Canvas + INCBIN**     | Een volledige bitmap van 256 tekens, weergegeven als één afbeelding van 128×128 pixels.                         |

> **Uitlijningsherinnering: ** VIC-II verwacht de basis van de tekenset op een
> veelvoud van `$0800`. Geldige banken: `$0000`, `$0800`, `$1000`, ... , `$3800`
> (binnen de huidige 16 KB VIC-bank). RAM-tekensets bevinden zich doorgaans op
> `$2000`, `$2800`, `$3000` of `$3800`.

---

### BOX_HIT

Botsingstest met as-uitgelijnde begrenzingskaders (AABB) tussen twee rechthoeken
beschreven door 4-byte zero-page structuren. Retourneert het resultaat in de
accumulator: **A = 1** bij overlapping, **A = 0** anders. Pure inline assembly,
geen subroutine-aanroep.

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

**Gegenereerde ASM (30 bytes, volledig PC-relatief — geen subroutine, geen
absolute sprongen):**
```
LDA $FD ; b1 rechts

CMP $F7 ; b2 links

BCC nee ; R1 &lt; L2 → miss

LDA $F9 ; b2 rechts

CMP $FB ; b1 links

BCC nee

LDA $FE ; b1 onder

CMP $F8 ; b2 boven

BCC nee

LDA $FA ; b2 onder

CMP $FC ; b1 boven

BCC nee

LDA #$01 ; hit

BNE klaar ; onvoorwaardelijk (A ≠ 0)
nee: LDA #$00
klaar:
```

**Grootte:** 30 bytes.

**Typische workflow:**

```
; Speler spritebox op $FB..$FE

LDA sprite_x ; L

STA $FB

LDA sprite_y ; T

STA $FC

CLC
ADC #23 ; +23 → B (24-pixel hoge sprite)

STA $FE

LDA $FB

CLC

ADC #23 ; R

STA $FD

; Vijandbox op $F7..$FA (op dezelfde manier gevuld)

; ...

BOX_HIT $FB, $F7 ; test speler vs vijand → A = 0 of 1

CMP #$01

BNE no_collision

JSR handle_hit
no_collision:
```

**Beperkingen:**
- Beide zero-page-adressen moeten `≤ $FC` zijn (elk vakje heeft 4 opeenvolgende
  bytes nodig: `zp`, `zp+1`, `zp+2`, `zp+3`).
- Coördinaten worden behandeld als **unsigned 8-bit** (0–255). Voor getekende
  spritecoördinaten buiten dit bereik moet u normaliseren voordat u ze opslaat.
- De twee vakjes kunnen elkaar in de ZP-ruimte overlappen, indien gewenst, maar
  meestal wilt u 8 afzonderlijke bytes.

**Waarom geen subroutine?** Inline-generatie vermijdt de overhead van JSR/RTS
(14+ cycli) en houdt de test actief in de cache voor strakke game-loops. Als je
veel paren moet testen, plaats dan handmatig je eigen `JSR box_hit_sub` rond een
enkel BOX_HIT-blok.

**Vergelijking met UB's `box_hit()` functie:** Ultimate Basic verpakt dezelfde
6502-logica als een runtimefunctie die een variabele retourneert. In VA plaats
je BOX_HIT inline waar je de test nodig hebt; het resultaat bevindt zich in `A`.

---

### INCBIN

Net als **BLOAD in BASIC** — pakt een extern binair bestand (`.bin`, `.prg`,
`.sid`, `.raw`) en voegt het direct in de geassembleerde PRG in op het adres dat
u opgeeft.

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

**Grootte in code: ** 0 bytes (uitgestelde datasectie). De binaire code is
ingebed op het opgegeven adres.

---

### KOALA

Laadt een **Koala Painter**-afbeelding (`.koa` / `.kla`, 160×200 meerkleurig) en
toont deze. De afbeeldingsgegevens zijn ingebed op een vast adres zoals `INCBIN`
(het 2-byte `$6000` laadadres van het bestand wordt verwijderd), en het blok
zelf compileert naar een 86-byte weergaveroutine die wordt uitgevoerd op de
plaats waar het blok zich bevindt.

| Veld    | Beschrijving                                                                                                               |
| ------- | -------------------------------------------------------------------------------------------------------------------------- |
| Bestand | Blader om een `.koa` / `.kla`-bestand te selecteren (10003 bytes, of 10001 zonder laadadres)                               |
| Adres   | Bitmapadres: `$6000` (standaard, Koala native, VIC bank 1, scherm-RAM `$4400`) of `$2000` (VIC bank 0, scherm-RAM `$0400`) |

De weergaveroutine kopieert het scherm-RAM-gedeelte naar het scherm en het
kleur-RAM-gedeelte naar `$D800`, schrijft de achtergrondbyte naar `$D021`,
selecteert de VIC-bank in `$DD00` (waarbij de andere poortbits behouden blijven)
en schakelt de meerkleurige bitmapmodus in (`$D011 = $3B`, `$D016 = $18`, `$D018
= $18`). Andere adressen worden afgewezen: de resterende 8K-slots bevinden zich
onder het BASIC/KERNAL-ROM (de kopieerlus zou ROM lezen) of overlappen de
karakter-ROM-schaduw.

**Expert syntax:**
```
.koala "foto.koa"
.koala "foto.koa", $ 2000
```

**Voorbeeld — toon een afbeelding en wacht:**
```
* = $0801
.koala "picture.koa"
wachten:

JMP wachten
```

**Grootte in code:** 86 bytes (weergaveroutine); de 10001 bytes aan
beeldgegevens gaan naar het opgegeven adres. De Hires-editor **Bestanden → Koala
exporteren (.koa)…** produceert een compatibel bestand.

---

### NIVEAU / NIVEAU_RIJ

Voegt een **Level Editor**-project toe aan je programma en kopieert levelrijen
naar een schermbuffer — de bouwstenen van een scrollend spel. Zie
`samples/level-demo.asm` voor een compleet level dat met een joystick wordt
gescrolld.

#### NIVEAU

Een INCBIN-achtig blok dat **0 bytes code** uitzendt. Alleen de **geplaatste**
schermen van het Level Editor-project (de `.bin` die is opgeslagen met
**Bestanden → Level opslaan**) worden in het geheugen geladen vanaf het
opgegeven adres (standaard `$2000`), in volgorde van de slots, 2000 bytes per
scherm (1000 schermcodes + 1000 kleuren). Identieke schermen worden één keer
opgeslagen en alle lege slots delen één leeg scherm. De pointertabellen volgen
de schermen. Een level kan maximaal 7 × 10 schermen bevatten.

**Expert syntax:**
```
.level "level.bin"
.level "level.bin", $4000
```

| Gedefinieerd                                                                  | Betekenis                                                                                                                                           |
| ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `LEVEL_SLOT_LO` / `LEVEL_SLOT_HI`                                             | Adres van het scherm in elk slot (rij-georiënteerd, `LEVEL_W` slots per rij)                                                                        |
| `NIVEAU_RIJ_SLOT`                                                             | Niveaukarakterrij → eerste positie van de bijbehorende schermrij                                                                                    |
| `NIVEAU_RIJ_LAAG/HOOG`, `NIVEAU_KRAAIEN_LAAG/HOOG`                            | Niveau tekenrij → offset van de bijbehorende schermcode-rij / kleurenrij binnen een scherm                                                          |
| `LEVEL_COL_SLOT`, `LEVEL_COL_OFS`                                             | Bekijk de beginkolom → schermkolom en de kolom binnen het scherm                                                                                    |
| `NIVEAU_W`, `NIVEAU_H`                                                        | Niveaugrootte in schermen                                                                                                                           |
| `NIVEAU_KOLOMMEN`, `NIVEAU_RIJEN`                                             | Grootte van het level in tekens                                                                                                                     |
| `LEVEL_MAX_X`, `LEVEL_MAX_Y`                                                  | Grootste scrollpositie in pixels van een 40×25-weergave                                                                                             |
| `LEVEL_BG`, `LEVEL_MC1`, `LEVEL_MC2`, `LEVEL_MULTICOLOR`                      | Achtergrond / meerkleurige kleuren en modus van het level                                                                                           |
| `NIVEAU_GEGEVENS`, `NIVEAU_GROOTTE`, `NIVEAU_EINDE`                           | Start, grootte en eerste vrije adres na de niveaugegevens                                                                                           |
| `LEVEL_OBJ_X_LO/HI`, `LEVEL_OBJ_Y_LO/HI`, `LEVEL_OBJ_TYPE`, `LEVEL_OBJ_PARAM` | Objecttabel (objectlaag van de level-editor): positie in levelpixels, type en parameterbyte, in scrollvolgorde — `LEVEL_OBJ_COUNT` items (max. 255) |
| `LEVEL_OBJ_T_START` … `LEVEL_OBJ_T_TRIGGER`                                   | Objecttypenummers: START 0, VIJAND 1, ITEM 2, DEUR 3, UITGANG 4, TRIGGER 5                                                                          |
| `LEVEL_START_X`, `LEVEL_START_Y`                                              | Positie van het eerste Start-object (alleen gedefinieerd als het level er een heeft)                                                                |
| `LEVEL_ATTR`, `LEVEL_ATTR_SOLID` … `LEVEL_ATTR_COLLECT`                       | Karakterattributentabel (één vlagbyte per schermcode; alleen wanneer het level attributen heeft) en de bijbehorende bits: 1, 2, 4, 8                |
| `LEVEL_BORDER`, `LEVEL_SCR_COLORS`, `LEVEL_SCR_BG/BORDER/MC1/MC2`             | Niveaugrens; kleurentabellen per slot (rij-georiënteerd zoals `LEVEL_SLOT_*`) wanneer een scherm zijn eigen kleuren heeft (`LEVEL_SCR_COLORS` = 1)  |

Typische beveiliging: `.assert LEVEL_END &lt;= $9200, "niveaugegevens komen in
de code terecht"`.

#### NIVEAU_RIJ

Kopieert één rij van 40 tekens van het niveau naar een buffer: de niveaurij in
**X**, beginnend bij de niveaukolom die wordt bewaard in de variabele `col`,
naar het adres dat wordt bewaard in de pointer `dst` (`dst` / `dst+1`,
laag/hoog). Met het derde argument `color` worden de kleuren gekopieerd in
plaats van de schermcodes (voor kleuren-RAM). Een venster van 40 tekens dat zich
over twee schermen uitstrekt, wordt verwerkt met een zelfmodificerende
kopieerlus (~14 cycli per byte). X wordt behouden, A en Y worden vernietigd.
Vereist een `.level`-blok in het programma.

**Expert syntax:**
```
.level_row dst_lo, view_x
.level_row dst_lo, view_x, color
```

**Grootte in code:** 132 bytes — gebruik `LBEQ` / `LBNE` wanneer een sprong
eroverheen moet gaan.

---

### SID

Net als **BLOAD voor muziek** — laadt een `.sid`-bestand in je PRG en leest
automatisch de Init- en Play-adressen uit de header. Roep Init eenmaal aan bij
het opstarten en roep vervolgens Play aan vanuit je IRQ-handler in elk frame.

| Veld                        | Beschrijving                                                                                                                    |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Bestand                     | Blader om een `.sid`-bestand te selecteren                                                                                      |
| Aangepast adres (optioneel) | Overschrijf het standaard laadadres van de SID (bijv. `$1000`). Laat dit veld leeg om het adres uit de SID-header te gebruiken. |

Het blok toont:
- **Titel / Auteur** uit de SID-header
- **Laadadres** — waar de gegevens in het geheugen worden geplaatst (effectief
  adres na eventuele overschrijving)
- **Init adres** — roep dit aan met JSR om de muziek te initialiseren (aangepast
  voor verplaatsing als een aangepast adres wordt gebruikt)
- **Speel adres** — roep dit aan met JSR op elk frame in een IRQ-handler
  (aangepast voor verplaatsing)
- Een **(verplaatst)**-badge verschijnt wanneer een aangepast adres de gegevens
  verschuift ten opzichte van hun oorspronkelijke positie.

**Expert syntax:**
```
.sid "Ikari_Warriors.sid"
.sid "Ikari_Warriors.sid", $1000
```

**Gegenereerde ASM-opmerking: **
```
; SID "Ikari_Warriors.sid" @ $1000 Init:$1000 Spelen:$1006 (4096 bytes)
```

**Grootte in code: ** 0 bytes inline. Het SID-binair bestand wordt op het
opgegeven adres geplaatst als een uitgesteld blok in de PRG.

> **Belangrijk:** De meeste SID-bestanden bevatten hardgecodeerde interne
> absolute adressen. Deze kunnen alleen worden verplaatst als het hele binaire
> bestand met dezelfde offset wordt verschoven. Als een SID interne sprongen
> naar `$10xx` bevat, moet deze op `$1000` blijven staan — het verplaatsen naar
> een ander adres zal deze interne verwijzingen verbreken.

> **Typisch gebruik:** Plaats een ORG-blok vóór het SID-blok om het adres ervan
> in te stellen. Roep Init eenmaal aan bij het opstarten en roep vervolgens Play
> aan voor elk frame vanuit een raster-IRQ-handler.

---

### ERBIJ BETREKKEN

Net als **MERGE in BASIC** — laadt een ander bestand in en breidt de blokken
ervan inline uit op deze positie. Perfect voor herbruikbare
subroutinebibliotheken. De opgenomen blokken zijn alleen-lezen in het huidige
project.

Er worden twee bestandstypen ondersteund:
- **Visual Assembler-project** (`.json`) — de blokken van het project worden
  ongewijzigd ingevoegd.
- **Platte assembly-broncode** (`.inc`, `.asm`, `.s`) — het bestand wordt als
  tekst gelezen en op dezelfde manier geparseerd als in de expertmodus. Telkens
  wanneer u compileert, wordt het bestand opnieuw van de schijf gelezen (bron
  van waarheid = het bestand), zodat u het extern kunt bewerken met elke editor.

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

- De bestandsextensie ** is vereist in de expertmodus ** — een kale naam zoals
  `.include "macros" ` wordt behandeld als `.include "macros.json" `.
- Padresolutie: eerst wordt geprobeerd om het pad naast het projectbestand te
  vinden (relatief), daarna wordt teruggevallen op de meegeleverde map
  `samples/` van de app.

**Gegenereerde ASM (geen adresoverride):**
```
; .include "library.json" — 12 blokken

... (uitgebreide blokken volgen)
```

**Gegenereerde ASM (met laadadres `C000`):**
```
; .include "library.json" @ $C000 — 12 blokken

*=$C000

... (uitgebreide blokken volgen)
```

> **Tip:** Gebruik INCLUDE om herbruikbare subroutinebibliotheken te maken die u
> in verschillende projecten kunt delen. `.inc`/`.asm`/`.s`-bestanden zijn het
> meest geschikt wanneer u de bibliotheek wilt bewerken in een eenvoudige
> teksteditor of deze wilt delen met andere 6502-assemblers; `.json` wanneer de
> bibliotheek in Visual Assembler zelf is gemaakt. Stel een laadadres in wanneer
> de bibliotheek geen eigen ORG heeft, of wanneer u de standaardplaatsing wilt
> overschrijven.

---

### TAFEL

Net als **DIM op een specifiek adres** — benoemt een opzoektabel en stelt de
geheugenlocatie ervan in. Plaats BYTE-, WORD- of FILL-blokken erachter om de
inhoud van de tabel te definiëren.

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
kleurentabel:
```

De programmateller springt naar het opgegeven adres. Plaats
BYTE/WORD/FILL-blokken na TABLE om de inhoud te vullen.

**Grootte:** 0 bytes.

---

### ORG

Hiermee wordt bepaald waar in het geheugen het programma (of een gedeelte ervan)
wordt geplaatst — vergelijkbaar met het kiezen van een startadres voordat
machinecode wordt ingevoerd. Elk programma heeft minstens één ORG nodig. De
standaard startlocatie voor C64 BASIC is `$0801`.

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

Elk ORG-blok begint een nieuwe sectie. De blokken die volgen, worden vanaf dat
adres samengesteld. Wanneer je de PRG exporteert, worden alle secties
samengevoegd tot één bestand; de gaten tussen secties worden opgevuld met
nullen.

**Voorbeeld — code op `$0801`, gegevenstabel op `$C000`:**
```
* = $0801

LDX #$00
lus:

LDA $C000,X

STA $D800,X

INX

BNE-lus

RTS

* = $C000

.byte $01, $02, $03, ...
```

> **Tip:** Elk programma moet beginnen met een ORG-blok. Het typische startadres
> voor een C64 BASIC-laadbaar programma is `$0801` (2049 decimaal). Wanneer
> **BASIC SYS stub** is ingeschakeld, voegt de assembler een korte BASIC-regel
> toe op `$0801` en begint uw code op `$080D`.

---

### LUS / VOLGENDE

Net als **`FOR X=N TO 1 STEP -1 : ... : NEXT X`** in BASIC — telt af van N naar
1 met behulp van het X- of Y-register. Plaats een LOOP-blok, zet je instructies
ertussen en NEXT, en de lus herhaalt zich automatisch het juiste aantal keren.

#### LUS

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

#### VOLGENDE

| Veld     | Beschrijving                                |
| -------- | ------------------------------------------- |
| Register | Automatisch gekoppeld aan het LOOP-register |
| Label    | Automatisch gekoppeld aan het LOOP-label    |

**Expert syntax:**
```
.volgende lus0
```

**Gegenereerde ASM:**
```
DEX

BNE-lus0
```

**Grootte:** 3 bytes (DEX + BNE + vertakkingsoffset).

**Voorbeeld — wis 10 schermcellen:**
```
LDX #$0A
loop0:

LDA #$20 ; spatiekarakter

STA $0400,X

DEX

BNE loop0
```

---

### VOOR / EINDE

Net als **`FOR X=0 TO N-1 : ... : NEXT X`** in BASIC — telt *up* vanaf 0. Ideaal
wanneer je een voorwaartse index nodig hebt, bijvoorbeeld om door een tekenreeks
of een array te stappen.

#### VOOR

| Veld     | Beschrijving                                                                          |
| -------- | ------------------------------------------------------------------------------------- |
| Register | `X` of `Y` — het tellerregister                                                       |
| Graaf    | Luslimiet (hexadecimaal of decimaal, bijv. `$12` = 18). X/Y loopt van 0 tot limiet-1. |
| Label    | Automatisch gegenereerd luslabel (bijv. `for0`)                                       |

**Expert syntax:**
```
.voor X, $12, voor0
```

**Gegenereerde ASM:**
```
LDX #$00
voor0:
```

**Grootte:** 2 bytes (LD_ opcode + `#$00`).

#### EINDE

| Veld     | Beschrijving                                 |
| -------- | -------------------------------------------- |
| Register | Automatisch gekoppeld aan het FOR-register   |
| Label    | Automatisch gekoppeld aan het FOR-label      |
| Graaf    | Automatisch gekopieerd van de gekoppelde FOR |

**Expert syntax:**
```
.endf voor0
```

**Gegenereerde ASM:**
```
INX

CPX #$12

BNE voor 0
```

**Grootte:** 5 bytes (IN_ + CP_ #imm + BNE-offset).

**Voorbeeld — print een null-terminated string:**
```
LDX #$00
voor0:

LDA msg,X ; msg = PETSCII-tekenreeks op vast adres

BEQ klaar ; null-terminator → afsluiten

JSR $FFD2 ; CHROUT

INX

CPX #$12 ; maximaal 18 tekens

BNE voor0
klaar:

RTS
```

> **LOOP vs FOR:** LOOP telt af (N→1) — goed voor vertragingen, opvullingen,
> pixellussen. FOR telt op (0→N) — goed voor toegang tot strings/arrays. Beide
> kunnen X of Y gebruiken.

---

### DUWEN / TREKKEN

Net als ** waarbij variabelen worden opgeslagen vóór een GOSUB en hersteld na **
— maar dan met gebruik van de 6502 hardwarestack. Als een subroutine A, X of Y
gebruikt, moet deze worden omwikkeld met PUSH en PULL, zodat de registers van de
aanroepende code behouden blijven.

#### DUW

Plaatst een of meer registers op de stack. De volgorde is altijd A → X → Y
(binnenste eerst).

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

#### TREKKEN

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

BELASTING

PLA
```

> **Regel:** PUSH en PULL moeten altijd dezelfde registerset gebruiken****.
> `PUSH AX` → `PULL AX` (intern herstelt in omgekeerde volgorde: eerst X, dan
> A).

---

### EINDE / RTS-alias

Net als **RTS met een vriendelijkere macronaam ** — `.end` genereert een enkele
`RTS` byte en gedraagt zich als een korte subroutine-terminator in de
expertmodus.

**Expert syntax:**
```
.einde
```

**Gegenereerde ASM:**
```
RTS
```

**Grootte:** 1 byte.

Gebruik dit wanneer u een markering voor het einde van een subroutine wilt die
meer op een macro lijkt dan op een gewone instructie.

---

### MACRO / EINDE / AANROEPEN

Net als ** een benoemde GOSUB met parameters** — definieer een herbruikbaar stuk
code één keer (MACRO…ENDM), en roep het vervolgens overal aan met INVOKE. Geef
elke keer andere argumentwaarden door in plaats van blokken te kopiëren en te
plakken.

#### MACRO (begin definitie)

| Veld       | Beschrijving                                                                        |
| ---------- | ----------------------------------------------------------------------------------- |
| Naam       | Identificatiecode voor de macro (bijv. `setColor`)                                  |
| Parameters | Optionele parameternamen, gescheiden door komma's (bijv. `color` of `color, count`) |

Markeer het begin van een macrodefinitie. Blokken tussen MACRO en ENDM vormen de
body van de macro — ze genereren geen code waar de definitie zich bevindt.
Gebruik {paramName} als placeholder voor argumenten.

**Gegenereerde ASM:**
```
; .MACRO setColor (kleur)

... (bodyblokken)
; .ENDM
```

**Expertmodus syntaxis:**
```
.macro setColor color

LDA {color}

STA $D020
.endm
```

#### ENDM (einde definitie)

Sluit de huidige macrodefinitie. Geen velden.

#### AANROEPEN

Roept op deze positie een gedefinieerde macro aan en vervangt de opgegeven
argumentwaarden door de placeholders `{paramName}` in de body.

| Veld       | Beschrijving                                                                                               |
| ---------- | ---------------------------------------------------------------------------------------------------------- |
| Macronaam  | Selecteer een macro uit het keuzemenu.                                                                     |
| Argumenten | Door komma's gescheiden argumentwaarden die overeenkomen met de parameterlijst van de macro (bijv. `#$07`) |

**Gegenereerde ASM:**
```
; .roep setColor aan (#$07)
    LDA#$07
    STA $D020
```

**Expertmodus syntaxis:**
```
; één argument:
.invoke setColor(#$07)

; meerdere argumenten:
.invoke drawPixel($10, $20)

; geen argumenten:
.invoke clearScreen

; tekst-/stringargumenten (tussen aanhalingstekens):
.invoke printText("Hallo, wereld!")

; alias voor .call (synoniem voor .invoke):
.call setColor(#$07)
```

De macrobody wordt inline uitgebreid, waarbij `{paramName}` wordt vervangen door
de daadwerkelijke argumenten. De door spaties gescheiden vorm (`.invoke setColor
#$07`) wordt ook geaccepteerd.

**Argumenttypen:**
- **Numeriek**: `#$07`, `$10`, `255` — hexadecimale of decimale waarden
- **Tekstreeksen**: `"Hallo, wereld!"` — geciteerde tekenreeksen; komma's binnen
  aanhalingstekens worden behandeld als onderdeel van de tekst, niet als
  argumentscheidingstekens
- **Gemengd**: `#$07, "hallo", $20` — elke combinatie

> **Tip:** Definieer macro's bovenaan (of onderaan) je programma en roep ze
> vervolgens aan waar nodig. Macro's kunnen meerdere keren met verschillende
> argumenten worden aangeroepen.

---

### REGIO / ENDREGIO

Puur visuele groepering — **nul bytes**, geen effect op de geassembleerde code.
Net zoals het inklappen van een gedeelte van een BASIC-programma in een benoemd
blok, zodat je het kunt inklappen en je op iets anders kunt concentreren.

| Veld      | Beschrijving                                                                |
| --------- | --------------------------------------------------------------------------- |
| Regionaam | Vrije tekstlabel voor de sectie (bijv. `init`, `game_loop`, `sprite_setup`) |

**Expert syntax:**
```
.region init

; blokken...
.endregion
```

**Besturingselementen op de REGION-blokkop (altijd zichtbaar):**
- **▸ / ▾ toggle** — vouwt het hele gebied samen of vouwt het uit. Wanneer het
  is samengevouwen, worden alle blokken tussen REGION en ENDREGION verborgen.
- **↕ Alles uitbreiden** — maakt elk afzonderlijk samengevouwen blok binnen het
  gebied weer open en breidt het gebied zelf uit indien nodig.
- **⦵ Selecteren in ASM** — markeert het volledige codebereik van de regio in de
  ASM-weergave (van `; ===[ naam ]===` tot `; ===[/naam]===`) en scrollt
  ernaartoe. Schakelt automatisch over naar het ASM-tabblad als dit momenteel
  niet zichtbaar is.
- **⧉ Regio kopiëren** — kopieert het REGION-blok, alle onderliggende blokken en
  het bijbehorende ENDREGION naar het klembord. Een knipperend ✓-symbool
  bevestigt het kopiëren.
- **⎘ Plak regio** — voegt de gekopieerde regio in als een nieuwe regio direct
  na de ENDREGION van de huidige regio en scrollt ernaartoe. De knop is gedimd
  totdat een regio is gekopieerd.

**Gegenereerde ASM:**
```
; regio init
    SEI
    LDA#$00
    STA $D020
; eindregio init
```

**Grootte:** 0 bytes voor zowel REGION als ENDREGION.

**Voorbeeldworkflow:**
1. Voeg een `REGION`-blok toe en stel de regionaam in op `init`.
2. Voeg uw initialisatie-instructies eronder toe.
3. Voeg een `ENDREGION`-blok toe om de sectie te sluiten.
4. Klik ▸ op het REGIO om het hele gedeelte samen te vouwen tot één regel
   terwijl u aan andere onderdelen van het programma werkt.

> **Opmerking:** Regio's kunnen **genest** in elkaar zijn. Elke ENDREGION sluit
> de dichtstbijzijnde open REGION. Geen effect op de geassembleerde uitvoer.

---

### DEFINIEER / ALS / ANDERS / EINDE ALS

Net als een schakelaar leest de assembler ** — `DEFINE DEBUG` een symbool,
waarna elk `IF DEBUG`-blok wordt opgenomen en de `ELSE`-tak wordt overgeslagen.
Verwijder het DEFINE-blok en het IF-blok verdwijnt uit de uitvoer. Het is niet
nodig om code te verwijderen voor release-builds.

#### DEFINIËREN

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

Een `DEFINE`-blok kan meerdere symbolen tegelijk activeren (gescheiden door
komma's). Plaats DEFINE-blokken bovenaan uw programma. Het verwijderen van het
blok deactiveert alle symbolen direct.

#### ALS

| Veld       | Beschrijving                                                                                  |
| ---------- | --------------------------------------------------------------------------------------------- |
| Voorwaarde | Identificatiecode om te testen (moet overeenkomen met een `DEFINE`-symbool om actief te zijn) |

**Expert syntax:**
```
.if DEBUG
```

**Gegenereerde ASM:**
```
; .ALS DEBUG
```

Blokken tussen `IF` en `ENDIF` (of `ELSE`) worden wel of niet opgenomen,
afhankelijk van of het voorwaardesymbool een overeenkomende `DEFINE` in het
programma heeft. Overgeslagen blokken verschijnen als `; [IF skipped] …`
commentaren en genereren **nul bytes**.

#### ANDERS

Geen velden. Markeer de alternatieve tak — samengesteld wanneer de `IF`-conditie
*not* actief is.

**Expert syntax:**
```
.anders
```

**Gegenereerde ASM:**
```
; ANDERS
```

#### EINDE ALS

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

LDA #$02 ; rode rand

STA $D020
; .ELSE

LDA #$00 ; zwart (vrijgeven)

STA $D020
; .ENDIF
```

**Voorbeeld — meerdere symbolen in één DEFINE-blok:**
```
; DEFINE DEBUG, PAL

; .IF PAL

LDA #$xx ; PAL-timingconstante
; .ELSE

LDA #$xx ; NTSC-timingconstante
; .ENDIF
```

Geneste `IF`-blokken worden ondersteund. Als een buitenste blok wordt
overgeslagen, worden binnenste blokken ook overgeslagen.

> **Opmerking:** Dit is een voorwaarde die tijdens het compileren wordt
> afgehandeld. Voor runtime vergelijkings-/vertakkingssyntax, zie **Runtime IF /
> ELSE / ENDIF** hieronder.

### .BEWEREN

*(Nieuw in 2.3.9.)* Een **controle tijdens het compileren**. `.assert` evalueert
een expressie tijdens het assembleren; als deze onwaar is (`0`), stopt de build
met een duidelijke foutmelding die de werkelijke waarde bevat. Als deze waar is
(niet nul), wordt er niets weergegeven.

| Veld        | Beschrijving                                                                                                                                                 |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Uitdrukking | Elke assembler-expressie: labels, `CONST`s, `*` (programmateller), rekenkundige bewerkingen en vergelijkingen (`&lt;`, `&lt;=`, `&gt;`, `&gt;=`, `==`, `!=`) |
| Bericht     | Optionele tekst die aan de foutmelding kan worden toegevoegd                                                                                                 |

**Expert syntax:**
```
.assert spriteData &lt; $C000
.assert * &lt; $A000
.assert end - start &lt;= 256, "spritetabel overschrijdt één pagina"
```

**Gedrag:**

- **Grootte:** 0 bytes.
- Een onjuiste bewering zorgt ervoor dat de assemblage wordt afgebroken:
  `` `.assert end - start &lt;= 256` is onjuist (waarde: 0). spritetabel loopt
  over één pagina ``
- Een bewering die niet kan worden geëvalueerd (ongedefinieerd label, enz.)
  mislukt ook, met *"kan niet worden geëvalueerd tijdens de assemblage"*.
- Vergelijkingen leveren `1` / `0` op; plaats `.assert` ergens in de
  programmastroom — het wordt gecontroleerd op het adres waar het zich bevindt,
  dus `.assert * &lt; $D000` test de huidige uitvoerpositie.

**Voorbeeld — bescherm een spriteblok tegen een paginaoverschrijding:**
```
* = $3000
sprite_data:

.byte $00, $00, $00 ; … 63 bytes …
sprite_data_end:

.assert sprite_data_end - sprite_data == 63, "sprite moet precies 63 bytes zijn"

.assert (sprite_data % 64) == 0, "sprite moet 64-byte uitgelijnd zijn"
```

---

### CONST

Zoals **een benoemde variabele die nooit verandert** — `SCREEN = $0400`. Gebruik
de naam in plaats van overal ruwe adressen te typen, waardoor de code later
gemakkelijker te lezen en te wijzigen is.

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

De constante naam verschijnt in het **label picker** dropdownmenu op
instructieblokken — klik er gewoon op om deze in te voegen.

**PC-relatieve expressies (`*+N` / `*-N`):**

Het waardeveld accepteert ook `*+N` of `*-N`, waarbij `*` het compileeradres is
van het CONST-blok zelf. Dit wordt gebruikt om een benoemde alias te creëren
voor een byte binnen een nabijgelegen instructie — het klassieke patroon van
zelfmodificerende code:

```
CONST op = *+1 ; op → adres van de directe operand van de volgende LDA
LDA #$00 ; $00 wordt tijdens runtime aangepast
...
STA op ; overschrijft de #$00 byte → LDA leest de volgende keer de nieuwe waarde
```

De CONST zendt 0 bytes uit; het label wordt tijdens het compileren opgelost naar
`huidig_adres + 1`.

** Rekenkundige uitdrukkingen: **

Het waardeveld accepteert algemene rekenkundige bewerkingen, waaronder
verwijzingen naar eerder gedefinieerde CONST-namen, hexadecimale/binaire
letterlijke waarden en ingebouwde wiskundige functies:

```
.const SCREEN = $0400
.const SCREEN_END = SCREEN + 40*25 ; 1000 bytes later
.const COLOR_RAM = $D800
.const MID_X = 160
.const SIN_TABLE = round(sin(PI/8) * 127) ; vooraf berekende sinuswaarde
```

**Ingebouwde functies:** `sin()`, `cos()`, `round()`, `max(a,b)`, `min(a,b)`,
`abs()`, constant `PI`

Operatoren: `+ - * /` Literalen: `$FF` (hex), `%10110000` (binair)
Laagste/hoogste byte: `lo(expr)`, `hi(expr)`

**Grootte:** 0 bytes.

---

### VAR

Net als **CONST, maar automatisch toegewezen** — `VAR` reserveert
zero-page-geheugen voor een label zonder dat u het adres hoeft in te typen.
Gebruik het voor tellers, pointers en kortstondige statusinformatie die in ZP
thuishoort.

| Veld             | Beschrijving                                                  |
| ---------------- | ------------------------------------------------------------- |
| Naam             | Variabelenaam / label                                         |
| Maat (optioneel) | Aantal te reserveren bytes. Laat dit getal weg voor één byte. |

**Expert syntax:**
```
.var-teller
.var-timer, 2
.var leeft
```

**Praktisch voorbeeld:**
```
.regio Vars
.var-teller
.var-timer, 2
.eindregio

LDA#$00
STA-teller
```

**Gegenereerde ASM:**
```
; .var teller
```

**Grootte:** 1 byte standaard, of `N` bytes wanneer grootte is gespecificeerd.

De allocator doorloopt een configureerbare zero-page cursor (`$02` tot `$FE`) en
wijst de eerstvolgende vrije plek toe. Als het aangevraagde gebied een reeds
gebruikt label overlapt, geeft de compiler een waarschuwing.

---

### Runtime IF / ELSE / ENDIF

Net als **een echte branch template** — werkt deze versie tijdens runtime, niet
tijdens compilatie. Het vergelijkt `A`, `X` of `Y` met een directe waarde en
genereert de juiste `CMP` / `CPX` / `CPY` + branchsequentie voor u.

| Veld     | Beschrijving                                 |
| -------- | -------------------------------------------- |
| Register | `A`, `X`, of `Y`                             |
| Operator | `==`, `!=`, `&lt;`, `&lt;=`, `&gt;`, `&gt;=` |
| Waarde   | Directe waarde in HEX- of DEC-formaat        |

**Expert syntax:**
```
Als A == #$10

LDA #$07
anders

LDA #$0F
einde als
```

**Grootte:** Afhankelijk van de gekozen takken en vergelijkingsvorm.

De vergelijking is standaard zonder teken. Voor `&lt;=` en `&gt;` wordt de macro
uitgebreid naar de kortste equivalente vertakkingsketen voor het geselecteerde
register.

---

### TERWIJL / EINDE

Zoals **een runtime-lus met een test bovenaan** — de body wordt uitgevoerd
zolang de voorwaarde waar blijft.

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

Gebruik `WHILE` wanneer de lus mogelijk eindigt voordat de eerste iteratie is
voltooid. Dit is de runtime-tegenhanger van de op telling gebaseerde `LOOP /
NEXT` helper.

---

### HERHALEN / TOTDAT

Zoals **een runtime-lus met een test onderaan** — de body wordt altijd minstens
één keer uitgevoerd, waarna de voorwaarde bepaalt of er gestopt moet worden.

| Veld     | Beschrijving                                 |
| -------- | -------------------------------------------- |
| Register | `A`, `X`, of `Y`                             |
| Operator | `==`, `!=`, `&lt;`, `&lt;=`, `&gt;`, `&gt;=` |
| Waarde   | Directe waarde in HEX- of DEC-formaat        |

**Expert syntax:**
```
.herhaal

JSR getchar
.totdat A == #$00
```

**Grootte:** Afhankelijk van de lusbody en de vergelijkingsvorm.

Gebruik `REPEAT / UNTIL` als je wilt dat de body minstens één keer wordt
uitgevoerd voordat de exit-controle plaatsvindt.

---

### MEMCPY / MEMSET

Net als **kleine geheugenroutines waar je constant naar grijpt** — `MEMCPY`
kopieert een aaneengesloten blok, `MEMSET` vult een bereik met één byte.

| Macro    | Velden                  |
| -------- | ----------------------- |
| `MEMCPY` | `src`, `dst`, `size`    |
| `MEMSET` | `addr`, `value`, `size` |

**Expert syntax:**
```
.memcpy src=$C000, dst=$D000, size=$0100
.memset addr=$0400, value=#$20, size=$03E8
```

**Gegenereerde ASM:** inline kopieer-/vullussen, gekozen om te voldoen aan de
gevraagde grootte.

Groottes tot 256 bytes gebruiken een korte 8-bits lus. Grotere groottes
schakelen automatisch over naar een 16-bits teller.

---

### PRINT / PRINT_CHAR / PRINT_HEX / CLEAR_SCREEN / WAIT_KEY / DELAY / SET_BORDER / SET_BG

#### AFDRUKKEN

Net als **PETSCII-uitvoer zonder de boilerplate** — print een tekenreeks via
`CHROUT` met dezelfde behandeling van hoofdletters en kleine letters als het
PETSCII-blok. Het selectievakje voor kleine letters wordt gedeeld met de
PETSCII-encoder, zodat het tekstpad consistent blijft.

**Expert syntax:**
```
.print "HALLO"
.print "hallo", lower
```

#### PRINT_CHAR

Print één PETSCII-byte met behulp van een numerieke code en verzendt deze via
`CHROUT`. De waarde kan ook een benoemde constante of label zijn die tijdens het
assembleren wordt omgezet in een byte, zowel in blokmodus als in expertmodus.

**Expert syntax:**
```
.print_char 65
.print_char $41
.print_char kleur
```

#### PRINT_HEX

Drukt een 8-bits waarde af als hexadecimale tekst via het normale
KERNAL-uitvoerpad.

**Expert syntax:**
```
.print_hex A
```

#### WIS SCHERM

Sneltoets voor de standaard C64-code om het scherm te wissen.

**Expert syntax:**
```
.clear_screen
```

#### WAIT_KEY

Wacht tot er een toets wordt ingedrukt, zodat je de `GETIN`-lus niet elke keer
handmatig hoeft te genereren.

**Expert syntax:**
```
.wacht_sleutel
```

#### VERTRAGING

Wacht het gevraagde aantal frames af via een gedeelde hulpfunctie. Gebruik dit
voor korte pauzes en timingproblemen wanneer een volledige, op maat gemaakte lus
overbodig zou zijn. Het aantal frames kan een ruw getal zijn of een benoemde
constante, en `.wait` is gewoon een alias van `.delay`.

**Expert syntax:**
```
.vertraging 29
.wacht 29
.vertraging frames=FRAMES_1S
```

In de blokmodus gebruikt het vertragingsveld een compacte constante picker
wanneer een symbolische waarde beschikbaar is, zodat u de naam niet elke keer
handmatig hoeft in te typen.

#### SET_BORDER / SET_BG

Handige wrappers voor de VIC-II-kleurregisters. De kleurwaarde kan een ruw getal
zijn of een benoemde constante die wordt opgelost naar 0-15. Zowel de blokmodus
als de expertmodus accepteren hier symbolische constante namen.

**Expert syntax:**
```
.set_border 6
.set_bg 0
.set_border color
.set_bg color
```

**Grootte:** Elke helper wordt uitgebreid tot een kleine
registerschrijfsequentie of een korte KERNAL-aanroep.

In de blokmodus gebruiken deze velden ook de constante picker, waardoor de
symbolische waarde zichtbaar blijft in plaats van te worden vervangen door een
exact getal.

---

### IRQ_SETUP

Hiermee wordt in één stap een raster-IRQ-handler ingesteld. De macro schrijft de
IRQ-vector, schakelt raster-IRQ's in, stelt de lijn in, schakelt de algemene
CIA-IRQ-bronnen uit en keert terug naar de normale uitvoering met `CLI`.

| Veld    | Beschrijving                                         |
| ------- | ---------------------------------------------------- |
| Handler | IRQ-routinelabel (bijv. `my_irq`)                    |
| Raster  | Rasterlijn in hexadecimaal of decimaal (bijv. `$FA`) |

**Expert syntax:**
```
.irq_setup handler=my_irq, raster=$FA
```

**Grootte:** Een korte instelreeks; de exacte lengte is afhankelijk van de
geselecteerde rasterlijn.

Gebruik dit wanneer u de standaard "SEI / install handler / enable IRQ /
CLI"-opdracht wilt uitvoeren zonder deze door het hele programma te verspreiden.

---

### RAND

Net als ** een kleine ingebouwde PRNG** — retourneert een 8-bits
pseudo-willekeurige waarde uit een compacte seed van nul pagina's.

| Veld | Beschrijving                                                     |
| ---- | ---------------------------------------------------------------- |
| Zaad | Optionele seed-byte of label voor de nulpagina (standaard `$FB`) |

**Expert syntax:**
```
.rand
```

**Grootte:** Een handvol bytes, afhankelijk van het gekozen implementatiepad.

De generator is bedoeld voor gameplay, effectvariatie en snelle testdata. Hij is
bewust klein gehouden in plaats van cryptografisch geavanceerd.

---

<a id="sprite_init"></a>
### SPRITE_INIT

Hiermee wordt in één blok een VIC-II-sprite ingesteld — in plaats van ~6
POKE-instructies in BASIC te schrijven, hoeft u alleen de velden in te vullen.
De datapointers van de sprite worden ingesteld, de sprite wordt ingeschakeld, de
meerkleurenmodus wordt optioneel geactiveerd en de kleur wordt ingesteld.

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

STA $07F8 ; sprite-pointerregister ($07F8 + N)

LDA $D015

ORA #$01 ; schakelbit voor sprite 0 in

STA $D015

LDA $D01C

AND #$FE ; wis meerkleurig bit voor sprite 0

STA $D01C

LDA #$07

STA $D027 ; kleurenregister voor sprite 0
```

**Grootte:** 26 bytes.

> **Sprite-gegevenspagina:** `data_adres ÷ 64`. Met de standaard BASIC SYS-stub
> plaatst `ALIGN 64` na `JMP main` spritegegevens op `$0840` → pagina = `$21`.

---

<a id="sprite_pos"></a>
### SPRITE_POS

Net als **`POKE 53248, x : POKE 53249, y`** in BASIC, stelt dit de startpositie
van een sprite in. De coördinaten worden tijdens het assembleren ingebouwd en de
velden accepteren constanten in de blokmodus; voor animatie kunt u `INC`/`DEC`
rechtstreeks op het sprite-register gebruiken.

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
LDA #$98 ; X lage byte

STA $D000 ; sprite 0 X-register

LDA $D010

AND #$FE ; wis X MSB voor sprite 0 (X ≤ 255)

STA $D010

LDA #$64 ; Y = 100

STA $D001 ; sprite 0 Y-register
```

Voor X > 255 stelt de macro de overeenkomstige bit in `$D010` in in plaats van
deze te wissen.

**Grootte:** 18 bytes.

> **Opmerking:** `SPRITE_POS` bakt de X/Y in de code (`LDA #$xx`). Om een sprite
> tijdens runtime te animeren, gebruik `INC $D000` / `DEC $D000` — zie het
> `sprite-macro-demo` voorbeeld.

---

<a id="wait_raster"></a>
### WAIT_RASTER

Wacht tot de elektronenbundel van de VIC-II een specifieke scanlijn bereikt —
vergelijkbaar met synchronisatie met een tv-beeld. Plaats dit bovenaan je
gameloop om sprite tearing te voorkomen. Geen JSR, geen label nodig.

| Veld       | Beschrijving                                                   |
| ---------- | -------------------------------------------------------------- |
| Rasterlijn | Doelrasterlijn in hexadecimale notatie (bijv. `FF` = lijn 255) |

**Expert syntax:**
```
.wait_raster $FF
```

**Gegenereerde ASM:**
```
wacht:

LDA $D012 ; huidige rasterlijn

CMP #$FF ; doellijn

BNE wacht ; terugloop (-7 bytes)
```

**Grootte:** 7 bytes (de `BNE` offset `$F9` = −7 wijst altijd terug naar de
`LDA`).

> **Tip:** Plaats `WAIT_RASTER` bovenaan je gameloop om te synchroniseren met
> het scherm en sprite tearing te voorkomen.

---

### JOYSTICK

Het is vergelijkbaar met het lezen van **`PEEK($DC00)`** en vervolgens het
POKE-proces om de spritepositie aan te passen — maar dan in één blok. Het leest
één CIA-joystickpoort en past de X/Y-registers van een sprite dienovereenkomstig
aan. Volledig inline, geen JSR nodig.

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
LDA $DC00 ; lees CIA-poort 2

LSR ; bit 0 → overdracht (Omhoog)

BCS skip_up ; overdracht ingesteld = NIET ingedrukt

DEC $D001 ; Y−1 (omhoog bewegen)
skip_up:

LSR ; bit 1 → overdracht (Omlaag)

BCS skip_down

INC $D001 ; Y+1 (omlaag bewegen)
skip_down:

LSR ; bit 2 → overdracht (Links)

BCS skip_left

DEC $D000 ; X−1 (links bewegen)
skip_left:

LSR ; bit 3 → overdracht (Rechts)

BCS skip_right

INC $D000 ; X+1 (rechts bewegen)
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

**Grootte:** 27 bytes. De `BCS`-offset is altijd `+3` (slaat de volgende 3-byte
`DEC`/`INC abs`-instructie over).

**Variabele modus — `.joystickpoort, vx, vy[, vuur]`:** In plaats van een sprite
te bewegen, wordt de richting in variabelen geschreven: `vx` / `vy` = `-1` / `0`
/ `+1` (`$FF` / `$00` / `$01`), en de optionele `vuur` = `1` terwijl de knop
wordt ingedrukt, `0` anders. Gebruik het voor een scrollende camera, een speler
met eigen fysica of menu's. Poort `3` leest beide joystickpoorten tegelijk (`LDA
$DC00` / `AND $DC01`), dus beide poorten werken.

```
.joystick 2, vx, vy; 35 bytes
.joystick 3, vx, vy, fire; beide poorten + fire: 45 bytes
```

> **Typisch gebruik:** Plaats binnen een `gameloop` label met `WAIT_RASTER`
> eerst:
> ```
> gameloop:
> 
> WAIT_RASTER ($FF)
> 
> JOYSTICK (poort=2, sprite=0)
> 
> JMP gameloop
> ```

---

<a id="mouse"></a>
### MUIS

Leest een proportionele muis van een Commodore 1351 en beweegt een sprite.
Volledig **inline** — geen JSR of label nodig. De macro selecteert de CIA-poort,
wacht tot de SID-paddle-inputs stabiel zijn, decodeert vervolgens de
delta-beweging met behulp van het standaard 1351-driverpatroon en past deze toe
op de sprite-registers.

| Veld      | Beschrijving                                                                |
| --------- | --------------------------------------------------------------------------- |
| Haven     | `1` = CIA `$DC00` bits `7:6` = `%01`; `2` = `%10`                           |
| Sprite #  | Spritenummer 0–7                                                            |
| ZP-byte X | Nulpagina-adres (hex) om het vorige POTX-sample op te slaan (bijv. `FD`)    |
| ZP-byte Y | Nulpagina-adres (hex) om het vorige POTY-voorbeeld op te slaan (bijv. `FE`) |

**Gegenereerde ASM-vorm (poort 1, sprite 0, ZP `$FD`/`$FE`):**

```
; CIA-poort selecteren + afhandelen

LDA $DC00

EN #$3F

ORA #$40

STA $DC00

LDX #$67
wachten:

DEX

BNE wachten

; X-as — standaard 1351-stijl 7-bits delta-decodering

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

; Y-as — dezelfde decodering, vervolgens omgekeerd vóór toepassing

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
.mouse poort, spriteNum, zpX, zpY
; voorbeeld:
.mouse 2, 0, FD, FE
```

> **Belangrijk:** Initialiseer vóór de eerste aanroep de nulpagina-bytes met de
> huidige POTX/POTY-waarden om een sprong in het eerste frame te voorkomen:
> ```
> ; poort 1: LDA $DC00 : AND #$3F : ORA #$40 : STA $DC00
> 
> ; poort 2: LDA $DC00 : AND #$3F : ORA #$80 : STA $DC00
> 
> LDA $D419 : LSR A : AND #$3F : STA $FD
> 
> LDA $D41A : LSR A : AND #$3F : STA $FE
> ```

> **Tip:** Controleer de muis één keer per frame — plaats `WAIT_RASTER` in de
> gameloop vóór `MOUSE`.

---

<a id="sprite_col"></a>
### SPRITE_COL

Net als **`PEEK($D01E)`** in BASIC — controleert de VIC-II
hardware-botsingsregisters en vertelt je of een sprite een andere sprite of de
achtergrond heeft geraakt. Volledig inline, geen JSR nodig.

| Veld         | Beschrijving                                                                                                                |
| ------------ | --------------------------------------------------------------------------------------------------------------------------- |
| Sprite #     | Spritenummer 0–7 (welke bit van de sprite moet worden gecontroleerd)                                                        |
| Botsingstype | `Sprite-Sprite ($D01E)` — botsing met een andere sprite; `Sprite-Achtergrond ($D01F)` — botsing met achtergrondafbeeldingen |

**Expert syntax:**
```
.sprite_col 0, sprite
.sprite_col 0, achtergrond
```

**Gegenereerde ASM (sprite 0, sprite–sprite):**
```
LDA $D01E ; lees het register voor sprite-sprite-botsingen (maakt het leeg!)

AND #$01 ; isoleer bit 0 (sprite 0)

; A ≠ 0 → botsing heeft plaatsgevonden
```

**Grootte:** 5 bytes.

> **Belangrijk:** Het lezen van `$D01E`/`$D01F` ** wist het register**. Lees het
> eenmaal per frame en verwerk het resultaat onmiddellijk met `BEQ`/`BNE`.

**Typisch gebruik:**
```
gameloop:

WAIT_RASTER ($FF)

JOYSTICK (poort=2, sprite=0)

SPRITE_COL (sprite=0, type=sprite-sprite)

BEQ no_hit ; A = 0 → geen botsing

LDA #$02

STA $D020 ; rode rand = geraakt!

JMP gameloop
no_hit:

LDA #$0E

STA $D020 ; lichtblauwe rand = vrij

JMP gameloop
```

> **Zie ook:** `botsingsdemo` voorbeeld — groene bal (sprite #0) versus rood
> kruis (sprite #1).

---

### LAADBESTAND

Net als **`LOAD "file",8`** in BASIC — laadt een bestand van een D64-diskette
tijdens de uitvoering met behulp van de KERNAL LOAD-routine. Gebruik dit om
gegevens, muziek of extra code van de diskette te laden terwijl uw programma
draait.

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
JMP skip_filename ; spring over de inline bestandsnaam

.byte "DEMO-COLORS" ; bestandsnaam bytes (PETSCII, 11 tekens)
skip_filename:

LDA #11 ; lengte bestandsnaam

LDX #<fname ; pointer lo

LDY #>fname ; pointer hi

JSR $FFBD ; SETNAM

LDA #1 ; logisch bestand #1

LDX #8 ; apparaat 8

LDY #0 ; sec=0 (adres overschrijven) of #1 (eigen adres van het bestand)

JSR $FFBA ; SETLFS

LDA #0 ; LOAD-opdracht (niet VERIFY)

JSR $FFD5 ; LOAD

BCS fail ; (alleen als foutlabel is ingesteld)
```

**Grootte:** `3 + bestandsnaam_lengte + 9 (SETNAM) + 9 (SETLFS) + (4 indien
overschrijven) + 5 (LOAD) + (2 indien foutlabel)` bytes. Minimum 27 bytes.

> **Belangrijk:** De bestandsnaam wordt direct in de machinecode opgeslagen na
> een `JMP skip_filename`. De bestandsnaam op de schijf moet in hoofdletters
> PETSCII zijn — wat overeenkomt met gewone ASCII-hoofdletters (`A`–`Z`). De
> macro zorgt hier automatisch voor.

> **Gebruik altijd een foutlabel** voor productieprogramma's — als het bestand
> niet wordt gevonden, stelt KERNAL de carry-vlag in en gaat de uitvoering
> verder met wat er daarna komt.

> **Zie ook:** `loadfile-demo` voorbeeld — demonstreert het laden van
> `DEMO-COLORS.PRG` vanaf een D64 met een BCS-fouttak en een visueel foutscherm.

---

### EXODECRUNCHT

In-programma **Exomizer-decompressie**. Gebruik deze macro direct na een
`LOADFILE` die een Exomizer `mem`-modus gecomprimeerde stream heeft geladen —
EXODECRUNCH pakt deze achterwaarts uit naar het adres dat in de stream is
ingebed.

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
LDA $AE ; KERNAL load-end lo (ingesteld door vorige LOAD)

STA $04 ; depacker src-end pointer lo

LDA $AF ; KERNAL load-end hi

STA $05 ; depacker src-end pointer hi

LDA #$36 ; BASIC ROM uit ($A000-$BFFF wordt RAM)

STA $01

JSR depacker ; depacker leest van achter naar voren via $04/$05

LDA #$37 ; herstel standaardtoewijzing (BASIC + KERNAL + I/O)

STA $01
```

**Hoe het werkt:**

1. KERNAL `LOAD` ($FFD5) werkt ZP `$AE/$AF` bij zodat deze één byte voorbij de
   laatst geladen byte wijst. EXODECRUNCH kopieert dit naar ZP `$04/$05`, wat de
   officiële Exomizer-conventie voor het achterwaarts laden van de broncode is.
2. De depacker wordt doorgaans geplaatst op `$B000` (binnen het BASIC
   ROM-toegewezen gebied). De macro schakelt `$01 = $36` om, zodat de CPU daar
   RAM ziet tijdens de JSR, en herstelt vervolgens `$01 = $37`.
3. Het decompressiedoeladres is **gecodeerd in de gecomprimeerde stream zelf **
   wanneer je comprimeert met `exomizer mem -l <load> file,<target> ` — de
   depacker leest het uit de eerste bytes van de stream.

**Depacker-binair bestand:** De vooraf gecompileerde achterwaartse depacker is
`samples/exo-decrunch.bin` (477 bytes, ORG $B000). Het is een Kick
Assembler-wrapper van de officiële `exodecrunch.asm` met `INC $D020` toegevoegd
aan elke leesbewerking voor een zichtbaar randflits-effect tijdens de
decompressie. Plaats het in uw programma met een `INCBIN`-blok op het adres van
de depacker.

**Veiligheidscompensatie:** De standaard geheugenmodus van Exomizer past een
veiligheidscompensatie van 2 bytes toe — gegevens komen 2 bytes eerder aan dan
het gevraagde doel. Het dialoogvenster 'Uitvoeren via D64' ** telt automatisch 2
op bij het veld 'Bestemming' ** voordat Exomizer wordt aangeroepen, zodat het
zichtbare gedrag overeenkomt met het adres dat u hebt ingevoerd.

> **Zie ook:** het `exo-multicolor-demo` voorbeeld — volledig end-to-end
> voorbeeld: LOADFILE een gecomprimeerde meerkleurige bitmap naar $C000,
> EXODECRUNCH pakt deze uit naar $2000, kopieer vervolgens scherm → $0400 en
> kleur → $D800, en schakel VIC-II over naar meerkleurige bitmapmodus.

> **Integratietest:** `cargo test --test exomizer_integration` (in `src-tauri/`)
> verifieert de volledige compressie- en decompressie-roundtrip op een
> 6502-emulator met het echte depacker-binair bestand. Slaagcriteria: 10000
> bytes byte-gelijk aan de bron `multi-color.bin`.

---

### REU_CHECK

Detecteert of een Commodore RAM Expansion Unit (REU) is aangesloten — net zoals
bij het controleren van `PEEK($D010)` om te zien of er hardware aanwezig is.
Test door twee patronen naar het REU-register `$DF04` te schrijven en vervolgens
weer uit te lezen.

| Veld | Beschrijving   |
| ---- | -------------- |
| Geen | Geen operanden |

**Gegenereerde code (34 bytes):**
```
LDA#$55
STA $DF04
LDA$DF04
CMP #$ 55
BNE faalt
LDA#$AA
STA $DF04
LDA$DF04
CMP#$AA
BNE faalt
LDA#$00
CMP #$FF ; Z=0 =&gt; REU aanwezig
BNE gedaan
mislukking:
LDA#$FF
CMP #$FF ; Z=1 =&gt; geen REU
klaar:
```
> De macro normaliseert het resultaat zodat de volgende tak eenvoudig blijft:
> `BNE` betekent dat REU aanwezig is, `BEQ` betekent dat REU ontbreekt.

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
BEQ no_reu ; overslaan als REU niet aanwezig is
; ... REU-code hier ...
no_reu:
```

---

### REU_STASH / REU_FETCH / REU_SWAP

DMA-blokoverdracht tussen C64 RAM en REU-uitbreidingsgeheugen — vergelijkbaar
met een zeer snelle POKE-lus, maar de CPU verricht geen werk (de REU-chip
kopieert de gegevens terwijl de CPU is uitgeschakeld). Een overdracht van 1000
bytes is vrijwel direct.

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
LDA #c64lo STA $DF02 ; C64-adres LO
LDA #c64hi STA $DF03 ; C64-adres HI
LDA #reuLo STA $DF04 ; REU-adres LO
LDA #reuHi STA $DF05 ; REU-adres HI
LDA #bank STA $DF06 ; REU-bank
LDA #lenLo STA $DF07 ; lengte LO
LDA #lenHi STA $DF08 ; lengte HI
LDA #$00 STA $DF09 ; adrescontrole (vast)
LDA #$00 STA $DF0A ; interruptmasker (vast)
LDA #cmd STA $DF01 ; DMA uitvoeren ($90/$91/$92 = stash/fetch/swap, direct)
```

> **Opmerking:** Commando's gebruiken `$90/$91/$92` (bit 4 ingesteld = directe
> DMA-modus). Schrijven naar `$DF01` start de overdracht; de CPU hervat wanneer
> deze is voltooid.

---

### TURBO_SET

Stelt de CPU-snelheid van de **Ultimate-64 (U64) ** in via register `$D031`.
Heeft geen effect op een echte C64 of andere emulators.

**Velden:**

| Veld     | Beschrijving       | Bereik                                                |
| -------- | ------------------ | ----------------------------------------------------- |
| Snelheid | CPU-snelheidsindex | 0 = 1 MHz … 7 ≈ 10 MHz … 15 ≈ 48 MHz                  |
| Badline  | Badline-emulatie   | Ingeschakeld (C64-compatibel) / Uitgeschakeld (turbo) |

De snelheidsbyte wordt als volgt berekend: `(speedIndex &amp; 0x0F) |
(badline_disabled ? 0x80 : 0x00)`.

**Gegenereerde code (5 bytes):**
```
A9 xx LDA #snelheid_byte
8D 31 D0 STA$D031
```

**Expertmodus syntaxis:**
```
.turbo_set 7,0 ; snelheid=7 (~10 MHz), badline ingeschakeld
.turbo_set 15,1 ; snelheid=15 (~48 MHz), badline uitgeschakeld
```

> **Opmerking:** Deze macro is alleen van invloed op U64-hardware. Op een echte
> C64 of andere emulators schrijft dit naar `$D031`, wat de CIA kan beïnvloeden
> of genegeerd kan worden.

---

### SUPERCPU_DETECT

Controleert of een **CMD SuperCPU**-accelerator is geïnstalleerd — zoals
`PEEK($D0B8)` om te zien of deze iets anders dan `$FF` retourneert.

**Gegenereerde code (5 bytes):**
```
AD B8 D0 LDA $D0B8
C9 FF CMP #$FF
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
BEQ no_scpu ; overslaan als SuperCPU niet aanwezig is
; ... SuperCPU turbocode hier ...
no_scpu:
```

---

### TURBO_ENABLE

Schakelt de **CMD SuperCPU-turbomodus** in of uit. Roep eerst `SUPERCPU_DETECT`
aan en sla dit over als de SuperCPU niet aanwezig is.

| Modus       | Register | Effect                                             |
| ----------- | -------- | -------------------------------------------------- |
| Inschakelen | `$D07A`  | Schakel de turbomodus in (tot 20 MHz met SuperCPU) |
| Uitzetten   | `$D07B`  | Terug naar de compatibiliteitsmodus van 1 MHz      |

**Gegenereerde code (5 bytes):**
```
A9 00 LDA#$00
8D 7A D0 STA $D07A ; (of $D07B voor uitschakelen)
```

**Expertmodus syntaxis:**
```
.turbo_enable aan
.turbo_enable uit
```

> **Opmerking:** Roep eerst `SUPERCPU_DETECT` aan en spring om deze macro heen
> als de SuperCPU niet aanwezig is.

---

<a id="map_copy"></a>
### MAP_COPY

Kopieert een tegelkaart van een bronadres naar het scherm-RAM (en optioneel naar
het kleuren-RAM) met behulp van een reeks `LDA abs,X` / `STA abs,X` lussen. Per
lusiteratie wordt één pagina van 256 bytes gekopieerd; een gedeeltelijke pagina
aan het einde wordt gestopt met `CPX #rem / BNE`. Geen JSR nodig — alle code
wordt inline gegenereerd.

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

LDA $C000,X ; pagina 0

STA $0400,X

INX

BNE *-9 ; herhaalt zich totdat X terugspringt naar 0 (256 iteraties)

LDA $C100,X ; pagina 1

STA $0500,X

INX

BNE *-9

LDA $C200,X ; pagina 2

STA $0600,X

INX

BNE *-9

LDA $C300,X ; rest — 232 bytes

STA $0700,X

INX

CPX #$E8

BNE *-11
```

**Grootte:** `2 (LDX) + fullPages×9 + (rem &gt; 0 ? 11 : 0)` bytes per sectie.
Gecombineerde modus verdubbelt dit (schermsectie + identieke kleursectie).

**Koppelen met de kaarteditor:**

De Map Editor's **Files → Save map + color RAM (.bin)** exporteert één binair
bestand waarbij de eerste `size` bytes schermcodes zijn en de volgende `size`
bytes kleur-RAM-waarden. Gebruik MAP_COPY met **Combined .bin** aangevinkt en
wijs **Source addr** naar de locatie waar dit bestand wordt geladen (bijv. via
INCBIN op `$C000`):

```
* = $C000

INCBIN "map-color.bin" @ $C000 ; schermcodes $C000–$C3E7, kleur $C3E8–$C7CF
* = $0801

; ...

MAP_COPY src=$C000 dst=$0400 size=1000 combined color_dst=$D800
```

**Expertmodus syntaxis:**
```
.map_copy $C000, $0400, 1000 ; alleen scherm
.map_copy $C000, $0400, 1000, auto, $D800 ; gecombineerd (kleur op src+grootte)
.map_copy $C000, $0400, 1000, $C3E8, $D800 ; expliciet adres van de kleurbron
```

---

<a id="map_copy16x16"></a>
### MAP_COPY16X16

Kopieert een tekengebied van 16x16 tekens uit een compact schermcodeblok van 256
bytes plus een bijbehorend kleur-RAM-blok van 256 bytes. Het is bedoeld voor
export naar Charset Canvas en kleine tegel-/afbeeldingsfragmenten, waarbij het
schrijven van zestien afzonderlijke MAP_COPY-rijen te veel geheugen zou
opleveren.

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

De verkorte vorm kopieert schermbytes van `$3000`, kleurbytes van `$3100` en
plaatst het 16×16 blok op kolom 12, rij 4. Geldige posities linksboven zijn `col
= 0..24` en `row = 0..9`, waardoor het volledige 16×16 gebied op het 40×25 C64
tekstscherm blijft.

**Gegenereerd gedrag:**

- Genereert zestien inline kopieën van de rij.
- Elke regel kopieert 16 schermbytes en 16 kleurbytes.
- Er is geen JSR nodig; de code wordt direct op de macropositie gegenereerd.
- Werkt met zowel de normale tekenmodus als de meerkleurige tekenmodus; de
  kleur-RAM-bytes bevatten de bit voor de tekenkleur/meerkleurige inschakeling
  van elke cel.

Typische combinatie met Charset Canvas:

```
* = $0801
    SEI
    LDA#$00
    STA $D021
    LDA#$05
    STA $D022
    LDA#$0D
    STA $D023
    .map_copy16x16 $3000, 12, 4
lus:
    JMP-lus

.incbin "16x16+ram+kleur.bin", $3000
.incbin "16x16+tekenset.bin", $2000
```

---

<a id="sprite_anim"></a>
### SPRITE_ANIM

Deze functie verhoogt het animatieframe van een sprite bij elke aanroep en werkt
de VIC-II sprite-datapointers bij. Sla één byte per frame op in een tabel (het
paginanummer van de spritegegevens = `data_address / 64`), wijs SPRITE_ANIM
ernaar en roep deze functie één keer per gameframe aan — geen JSR nodig.

| Veld             | Beschrijving                                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------------------ |
| Sprite #         | Spritenummer 0–7                                                                                       |
| Frame lijstadres | Hexadecimaal adres van de frametabel — één byte per frame, elke byte = spritepagina (`data_addr / 64`) |
| Aantal frames    | Totaal aantal frames (1–255)                                                                           |
| Frame ZP         | De nulpaginabyte wordt gebruikt als frameteller (bijv. `FB`)                                           |

**Gegenereerde ASM (sprite 0, 4 frames, ZP `$FB`, lijst op `$C100`):**
```
INC $FB ; frameteller verhogen

LDA $FB

CMP #$04 ; frameaantal

BCC *+6 ; als teller &lt; aantal, reset overslaan

LDA #$00

STA $FB

TAX ; X = huidige frame-index

LDA $C100,X ; sprite-gegevenspagina voor dit frame laden

STA $07F8 ; sprite 0-aanwijzer bijwerken ($07F8 + sprite#)
```

**Grootte:** 19 bytes.

**Typisch gebruik:**
```
frameTable:

.byte $21, $22, $23, $24 ; 4 frames op $0840, $0880, $08C0, $0900

gameloop:

WAIT_RASTER ($FF)

SPRITE_ANIM (sprite=0, list=$C100, count=4, zp=$FB)

JMP gameloop
```

**Expertmodus syntaxis:**
```
.sprite_anim spriteNum, frameListAddr, frameCount, zpByte
; voorbeeld:
.sprite_anim 0, C100, 4, FB
```

> **Tip:** Plaats de frametabel als een RAWBYTES-blok op een vast adres. De
> teller-ZP-byte (`$FB`) moet worden geïnitialiseerd naar `$00` vóór de eerste
> aanroep. Als uw code `$FB` voor iets anders gebruikt, kies dan een vrije
> ZP-locatie.

---

<a id="score_bcd"></a>
### SCORE_BCD

Voegt een vaste-kommawaarde toe aan een meerbyte BCD-score die in het geheugen
is opgeslagen en zet vervolgens elk cijfer om naar het scherm-RAM als een
schermcodekarakter. Gebruikt de 6502 decimale modus (`SED`/`CLD`) voor
carry-veilige BCD-rekenkunde — handmatig manipuleren van de carry is niet nodig.

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

**Gegenereerde ASM (4 bytes, +100 punten, score op `$C200`, scherm op
`$0400`):**
```
SED ; BCD-/decimale modus inschakelen

CLC

LDA $C200 ; byte 0 (cijfers 1-2)

ADC #$00 ; lage byte van 100 in BCD = $00

STA $C200

LDA $C201 ; byte 1 (cijfers 3-4)

ADC #$01 ; middelste byte van 100 in BCD = $01 (carry wordt doorgegeven)

STA $C201

LDA $C202

ADC #$00

STA $C202

LDA $C203

ADC #$00
STA $C203

CLD ; terug naar binaire modus

; cijfers weergeven

LDX #$00
digit_loop:

LDA $C200,X

PHA

LSR : LSR : LSR : LSR ; hoge nibble → lage nibble

ORA #$30 ; + '0' schermcode

STA $0406,X ; rechts uitgelijnd: schermadres + (digits*2 - 2) - X*2

PLA

AND #$0F ; lage nibble

ORA #$30

STA $0407,X

INX

CPX #$04

BNE digit_loop
```

**Grootte:** `3 + cijfers×8` bytes (SED + CLC + CLD overhead + 8 bytes per BCD
byte voor ADC + display loop).

**Expertmodus syntaxis:**
```
.score_bcd $C200, 4, 100, $0400
```

> **Tip:** Initialiseer de scorebytes bij het opstarten naar `$00`. Het
> scoreadres moet zich in de nulpagina of het absolute RAM-geheugen bevinden —
> niet in het ROM-geheugen. Het schermadres moet naar de meest linkse cijfercel
> wijzen; cijfers worden van links naar rechts geschreven (meest significante
> byte eerst).

> **BCD-bereik:** `cijfers=4` bytes → 8 decimale cijfers → maximale score
> 99.999.999. Elke byte codeert twee BCD-cijfers: `$00`–`$99`.

---

## 11. Links naar de kennisbank

Snelkoppelingen zijn beschikbaar in de app onder **Kennisbank**:

### RetroDebugger

[RetroDebugger](https://github.com/slajerek/RetroDebugger) is een
platformonafhankelijke Commodore 64-debugger met ondersteuning voor breakpoints,
geheugeninspectie en labelbewuste disassemblage.

**Instellingen:** Open **Instellingen → Configureer het
RetroDebugger-uitvoerbestand** en wijs het naar het `RetroDebugger`-binair
bestand.

**Starten:** Klik op **Debuggen (RetroDebugger)** in de werkbalk. De app zal:

1. Compileer het programma tot een `.prg`-bestand in een tijdelijke map.
2. Schrijf een **breakpoints-bestand** (`breakpoints.txt`) — één `break $ADDR`
   per gemarkeerd blok.
3. Schrijf een **symbolenbestand** (`symbols.txt`) in
   Vice/RetroDebugger-labelformaat (`al C:addr .name`). Alle LABEL- en
   CONST-blokken zijn inbegrepen.
4. Schrijf ook sidecars in C64Debugger-stijl naast de gecompileerde PRG: `.dbg`,
   `.sym` en `.vs`.
5. Start RetroDebugger met:
   ```
   RetroDebugger -prg <file.prg> -breakpoints <breakpoints.txt> -symbols <symbols.txt> [flags]
   ```

### Breekpuntblokken

Klik op het breakpoint-pictogram (●) bij een instructieblok om dit als
breakpoint in te stellen. Blokken met een breakpoint worden rood gemarkeerd. Hun
adressen worden bij elke start van de debugger naar het breakpointbestand
geschreven.

### Foutopsporingsvlaggen (tabblad Opties)

| Schakelaar            | Vlag              | Effect                                                                    |
| --------------------- | ----------------- | ------------------------------------------------------------------------- |
| `-jmp` AAN            | `-jmp $ADDR`      | Spring na het laden direct naar het startadres van het programma.         |
| `-pauze opheffen` AAN | `-pauze opheffen` | De debugger direct hervatten bij het laden                                |
| `-wacht` AAN          | `-wacht <ms>`     | Wacht `<ms>` milliseconden voordat je de pauze opheft — 500 ms of 1000 ms |

> **Tip:** Schakel voor de meeste programma's `-jmp` en `-unpause` in voor een
> directe automatische start. Gebruik `-wait 500` of `-wait 1000` wanneer uw
> programma IRQ's of SID-muziek instelt die tijd nodig heeft om te initialiseren
> vóór de eerste rastering.

---

## 12. D64 Exporteren en uitvoeren

Versie 1.5.1 voegt de mogelijkheid toe om uw programma (en aanvullende
gegevensbestanden) te verpakken in een C64 D64-schijfkopie en deze in VICE te
starten, of de schijfkopie te exporteren voor gebruik elders.

| Bron                         | URL                                                            |
| ---------------------------- | -------------------------------------------------------------- |
| 6502 Opcodes Referentie      | http://www.6502.org/tutorials/6502opcodes.html                 |
| C64 kernelfuncties           | https://sta.c64.org/cbm64krnfunc.html                          |
| C64-geheugenkaart            | https://sta.c64.org/cbm64mem.html                              |
| C64-kleurcodes               | https://sta.c64.org/cbm64col.html                              |
| VIC-II Artikel               | https://www.cebix.net/VIC-Article.txt                          |
| C64-codebasis                | https://codebase.c64.org/                                      |
| De Turbo Assembler           | https://turbo.style64.org/                                     |
| RetroDebugger                | https://github.com/slajerek/RetroDebugger/                     |
| C64 OS-ontwikkelomgeving     | https://www.c64os.com/c64os/programmersguide/?s=devenvironment |
| png2c64 Afbeeldingsconverter | https://png2c64.app/                                           |

---

## 12b. CRT-export (Magic Desk 64K-cartridge)

**Menu → Bouwen → Bouw CRT** produceert een Commodore 64 cartridge-image
(`.crt`, **cartridge type 19 — Magic Desk / Domark / HES Australia**) die draait
op VICE, TheC64, echte hardware via EasyFlash / Kung Fu Flash, en 1541 Ultimate
II+ cartridge-slots. Het is beschikbaar in zowel **blokmodus** als
**Expertmodus**, en — vanaf de huidige build — ook in **UltimateBasic-modus**.

### Welke schepen zitten er in de winkelwagen?

De knop **Uitvoeren** in de werkbalk is vervangen door een **splitknop**:

| Deel             | Actie                                                  |
| ---------------- | ------------------------------------------------------ |
| **▶ Run** (main) | Voert de momenteel geselecteerde uitvoeringsmodus uit. |
| **▾** (pijl)     | Opent de modusselector.                                |

**Beschikbare uitvoeringsmodi:**

| Modus                     | Beschrijving                                                                                                                                                                                                                                                        |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Uitvoeren als PRG**     | Compileer naar een tijdelijk `.prg` en start VICE direct. Klassiek gedrag.                                                                                                                                                                                          |
| **Uitvoeren via D64**     | Stel een `.d64`-schijfimage samen (met behulp van c1541), voeg eventuele geconfigureerde extra bestanden toe en start VICE vervolgens vanaf de schijf. Gebruik dit wanneer uw programma bestanden laadt tijdens de uitvoering (bijvoorbeeld met de LOADFILE-macro). |
| **Uitvoeren op hardware** | Stel het programma samen tot een PRG en verstuur het via het lokale netwerk naar een **1541 Ultimate / Ultimate 64**-apparaat. Zie [Sectie 13](#13-hardware-settings).                                                                                              |
| **Kung Fu Flash 2**       | Compileer naar PRG en upload het via USB-serieel naar een echte C64/C128 met een **Kung Fu Flash 2** cartridge. Zie [Kung Fu Flash 2](#kung-fu-flash-2).                                                                                                            |

De geselecteerde modus wordt tussen sessies opgeslagen.

### Laadadres en toegangspunt

Build CRT maakt nooit gebruik van Exomizer (de depacker kan niet vanuit de
cartridge-ROM draaien). Het compileert het huidige tabblad met de standaard
autostart-pipeline en haalt het laadadres uit de PRG-header en het entrypoint
uit de SYS-target:

1. **Blokkeer-/Expertmodus met BASIC SYS-stub ingeschakeld:** laden = `$0801`,
   invoer = het SYS-doel (doorgaans `$080D` of de oorsprong van de gebruiker).
2. **Blok / Expertmodus met BASIC SYS-stub uitgeschakeld:** laden =
   gebruikersoorsprong (met de klassieke `$0801 → $C000` terugvaloptie), invoer
   = laadadres.
   - **Naam** — zoals het in de D64-directory verschijnt (max. 16 tekens,
     automatisch hoofdletters).
   - **Addr** (laadadres, optioneel) — indien opgegeven, wordt een 2-byte
     PRG-header toegevoegd. Laat leeg om onbewerkte bytes zonder header te
     schrijven.
   - **Dst** (decompressiedoel, alleen met EXO) — waar de depacker de data op de
     C64 moet plaatsen. Wanneer EXO is ingeschakeld, wordt het extra gedeelte
     gecomprimeerd met `exomizer mem -l <Addr> file,<Dst>` voordat het naar de
     D64 wordt geschreven. De +2 veiligheidscompensatie wordt automatisch
     toegepast.
   - **EXO** — selectievakje waarmee achterwaartse `mem`-modus-compressie voor
     deze invoer wordt ingeschakeld. De grootte op de schijf is doorgaans 5-20%
     van het origineel.
3. **UltimateBasic-modus:** laden en invoeren komen beide uit de
   UB-compilerkaart (`build.map.loadAddress`). De UB-autostartstub in de payload
   wordt vervolgens precies zo uitgevoerd als na `LOAD "...",8,1 : RUN` vanaf
   schijf.

Het oorspronkelijke adres dat u in de ASM-uitvoer ziet, blijft behouden; de
loader kopieert eenvoudigweg de platte geheugenafbeelding van de PRG naar het
RAM-geheugen en springt naar het ingangspunt zodra het ROM-geheugen van de
cartridge is ontkoppeld.

### Groottelimiet

Omdat de payload lineair wordt opgeslagen en `assembleProgramToPrg()` een platte
`minAddr..maxAddr` buffer met nullen gevulde gaten retourneert, telt een
programma met wijd gespreide ORG-segmenten (bijv. `$0801` + `$C000` + `$E000`)
elke byte daartussen mee voor het budget van 65.408 bytes. Als u de limiet
overschrijdt, wordt de build afgebroken met een `saveCrtTooLarge` fout —
comprimeer de geheugenindeling of splits de gegevens.

Het **loadfile-demo** voorbeeld is vooraf geconfigureerd met `DEMO-COLORS.PRG`
als extra bestand. Selecteer dit bestand, open **Uitvoeren via D64** en klik op
**Uitvoeren** om de volledige laadstroom in actie te zien.

> **⚠️ Belangrijke waarschuwing — lees dit voordat u een CRT-monitor verzendt**

### Verenigbaarheid

Het pictogram in de werkbalk na de Curve Editor opent de **D64 Editor** — een
zelfstandig hulpmiddel om rechtstreeks met een bestaande `.d64` image te werken,
onafhankelijk van het momenteel geopende programma. In tegenstelling tot het
bovenstaande dialoogvenster Exporteren naar D64 (dat altijd een *nieuwe* schijf
bouwt vanuit de gecompileerde PRG), bewerkt de D64 Editor een schijfimage ter
plaatse via `c1541`, waardoor het tevens dienstdoet als een lichtgewicht
schijfbeheerder.

**Bestanden ▾ menu:**

| Platform              | Actie                                              |
| --------------------- | -------------------------------------------------- |
| VICE (`x64sc`, `x64`) | Werkt via **Bestand → Cartridge-image bijvoegen**. |
| De C64 / De C64 Mini  | Werkt via de ingebouwde patroonlader.              |
| Kung Fu Flash         | Werkt — standaard Magic Desk-modus.                |
| EasyFlash-cartridge   | Werkt wanneer geprogrammeerd als Magic Desk.       |

**Werkbalk:**

| Icon                         | Actie                                                                                                                                                                                             |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Programma toevoegen**      | Selecteer een lokaal bestand en schrijf het naar de schijfmap.                                                                                                                                    |
| **Selecteer geselecteerde ** | Sla de bytes van de geselecteerde invoer op in een lokaal `.prg`-bestand.                                                                                                                         |
| **Geselecteerde hernoemen**  | Bewerk de naam van het item direct in de tabel — Enter bevestigt, Escape annuleert.                                                                                                               |
| **Verwijder geselecteerde**  | Verwijder het geselecteerde item van de schijf.                                                                                                                                                   |
| **Vernieuwen**               | Lees de map opnieuw, bijvoorbeeld nadat u de schijf met een ander programma hebt bewerkt.                                                                                                         |
| **Opslaan**                  | Schrijf de wijzigingen in de werkkopie terug naar het echte `.d64`-bestand, waarbij eerst een automatische back-up wordt gemaakt. Alleen ingeschakeld zolang er niet-opgeslagen wijzigingen zijn. |

**Een programma toevoegen:** Het selecteren van een bestand dat al eindigt op
`.prg` vraagt alleen om een **Naam** en een schijf **Type** (PRG/SEQ/USR/REL) —
een `.prg` heeft al zijn eigen laadadresheader, dus die wordt ongewijzigd
geschreven. Het selecteren van een ander bestand (bijv. een onbewerkt `.bin`)
toont bovendien:

- **Laadadres** (hex, optioneel) — voeg een 2-byte PRG-header toe aan dit adres;
  laat dit leeg om de bytes onbewerkt te schrijven.
- **Decompressieadres** (hex, optioneel) — alleen te gebruiken in combinatie met
  Exomizer; het doeladres waarnaar de depacker de gegevens moet uitpakken.
- **Exomizer** selectievakje — comprimeer het bestand vóór het schrijven, met
  dezelfde `mem`/`sfx` crunch-modi als de extra bestanden in het bovenstaande
  dialoogvenster Exporteren naar D64.

De directorylijst geeft bestandsnamen weer in hetzelfde lettertype en met
dezelfde hoofdletters als een echte C64 `LOAD"$",8`-lijst.

**Opslaan workflow:** elke bewerking — toevoegen, extraheren, hernoemen,
verwijderen en bytebewerkingen in de blokeditor — wordt toegepast op een
privéwerkkopie van de schijfkopie, niet op uw echte bestand. De **Opslaan** knop
in de werkbalk (ingeschakeld zodra er niet-opgeslagen wijzigingen zijn) schrijft
de werkkopie terug over de echte `.d64`, waarbij eerst een automatische back-up
wordt gemaakt; de header toont een **•** markering zolang er wijzigingen niet
zijn opgeslagen, en bij het sluiten van de editor of het openen van een andere
schijf met niet-opgeslagen wijzigingen wordt om bevestiging gevraagd in plaats
van ze te negeren. **Opslaan als…** (menu Bestand ▾) schrijft de werkkopie naar
een nieuw pad en gaat daar verder met bewerken.

**Blokeditor:** Het rasterpictogram in de werkbalk schakelt over naar een ruwe
track-/sectorweergave onder de directory — een aanklikbare blokkaart gekleurd op
basis van de vrije/gebruikte bitmap van de BAM (waarbij de BAM en de
directoryketen afzonderlijk zijn gemarkeerd), een hexadecimaal raster per byte
voor het geselecteerde blok van 256 bytes, en navigatie naar vorige/volgende
sector. Blokbewerkingen doorlopen dezelfde workflow voor werkkopie/opslaan als
de bovenstaande directory-acties.

> **Vereiste:** Net als bij Exporteren naar D64, vereist de D64 Editor dat VICE
> (`c1541`) is geconfigureerd in [Hardware-instellingen](#13-hardware-settings).

---

## 13. Hardware-instellingen

Openen via **Instellingen → Hardware-instellingen…** in het menubalk. Alle
externe hardwarepaden en netwerkconfiguratie bevinden zich hier.

### VICE-emulator

- **8 × 8 KB banks** op `$8000`, bankgeschakeld via `$DE00` (Magic
  Desk-conventie: laagste 3 bits = bank, bit 7 = cartridge uitschakelen).
- **Bank 0** bevat een header van 128 bytes + bootloader:
  - `$8000/$8002` koude + warme startvectoren wijzen naar `$8009`.
  - `$8004–$8008` = de `CBM80` handtekening die vereist is door de KERNAL
    resetcode.
  - `$8009–$807F` = de loader: SEI / stack init / `JSR $FDA3` (IOINIT) / `JSR
    $FD50` (RAMTAS) / `JSR $FD15` (RESTOR) / `JSR $FF5B` (CINT), vervolgens een
    byte-kopieerlus die de payload van cart-ROM naar RAM streamt en van bank
    wisselt wanneer `$FC` `$A0` bereikt. Aan het einde kopieert het een kleine
    **exit stub** naar `$0100`, schakelt de wagen uit met `LDA #$80 : STA
    $DE00`, en `JMP`s naar het ingangspunt.
- **Payload** begint bij `$8080` in bank 0 en loopt door naar banken 1–7 indien
  nodig. Maximale payload = `8 * 8192 − 128 = 65 408 bytes`.

### Exomizer

**Werkstroom:**

- Installeer het Exomizer-programma:
- Configureer het pad in **Hardware-instellingen → Exomizer-sectie**.
- Schakel het selectievakje **Uitvoeren met Exomizer** in het menu
  **Instellingen** in.

Exomizer werkt op dezelfde manier op Windows en macOS: de CLI wordt aangeroepen
vanuit de Tauri-backend; niets aan de integratie is platformspecifiek.

### Retro Debugger

Zie [Sectie 9]{1} voor de volledige debuggerdocumentatie.

> **⚠️ Belangrijke waarschuwing — lees dit voordat u een CRT-monitor verzendt**
> 
> De loader roept de KERNAL **`RESTOR` ($FD15)** aan als onderdeel van de
> standaard resetsequentie. Dit herschrijft opzettelijk de standaard
> I/O-vectoren op `$0314/$0315`, `$0316/$0317`, `$0318/$0319`, `$0328/$0329` en
> dergelijke terug naar hun ROM-standaardwaarden. Gevolgen:
> 
> - **Alle IRQ/NMI/BRK-hooks die vóór het opstarten van de CRT zijn ingesteld,
>   worden gewist.** Uw programma moet ze zelf installeren na het opstarten —
>   precies zoals een nieuwe `LOAD "",8,1 : RUN` vanaf tape/schijf.
> - **UltimateBasic-programma's** die afhankelijk zijn van niet-standaard
>   KERNAL-vectoren die actief zijn bij het opstarten, hebben mogelijk een
>   expliciete `SYS` of init-aanroep nodig in de autostart-stub. De standaard
>   UB-autostart werkt direct; extensiebibliotheken die vectoren onderscheppen
>   *voordat* `RUN` werken niet.
> - **CIA1 / CIA2** worden opnieuw geïnitialiseerd door `IOINIT`. Aangepaste
>   timerinstellingen (raster-IRQ's, muziekspeler CIA-A) moeten na binnenkomst
>   opnieuw worden geprogrammeerd.
> - De cartridge wordt uitgeschakeld door een 8-byte stub in **RAM op `$0100`**
>   zodat de `STA $DE00` niet kan worden onderbroken door een foutieve
>   ROM-fetch. Vertrouw er niet op dat `$0100–$0107` de stack top image bevat
>   bij binnenkomst — de eerste RAM-push overschrijft de stub.
> 
> Als een CRT-programma in VICE werkt, maar op echte hardware niet, controleer
> dan eerst of het programma bij aanvang een specifieke KERNAL-vector of
> CIA-timerstatus aanneemt. Stel deze status expliciet in uw init-routine in en
> het programma zal zich op beide systemen hetzelfde gedragen.

### C64 Ultimate / 1541 Ultimate

| Platform                        | Beschrijving                                                                         |
| ------------------------------- | ------------------------------------------------------------------------------------ |
| **Host (IP)**                   | IP-adres van het apparaat (bijv. `192.168.1.100`)                                    |
| **Wachtwoord**                  | Optioneel — als het apparaat authenticatie vereist.                                  |
| **Testverbinding**              | Verstuurt een testverzoek naar `/v3/runners/info`; geeft OK of een foutmelding weer. |
| EasyFlash-cartridge             | Werkt wanneer geprogrammeerd als Magic Desk.                                         |
| 1541 Ultimate II+ / Ultimate 64 | Werkt via **Cartridge → Afbeelding van de cartridge laden**.                         |
| Kameleon / Turbo Kameleon       | Werken.                                                                              |

---

## 14. Visuele editors (toolkit)

Het menu **Toolkit** in de werkbalk groepeert de visuele data-editors die
allemaal een gemeenschappelijk menu Bestanden (`Bestanden ▾`) delen voor BIN
laden / BIN opslaan / Exporteren naar blokken / Opslaan naar D64. Elke editor
produceert ruwe `.bin`-gegevens die in een programma kunnen worden geplaatst met
`INCBIN`, of direct aan een D64-schijf kunnen worden toegevoegd via de **Opslaan
naar D64**-optie.

### Editor voor hoge resolutie / meerkleurig

| Instelling      | Beschrijving                                                                                                   |
| --------------- | -------------------------------------------------------------------------------------------------------------- |
| Modusschakelaar | **Multicolor** selectievakje schakelt tussen hoge resolutie (mono per cel) en meerkleurig (4 kleuren per cel). |
| **Status**      | Geeft aan of het uitvoerbare pad geldig en toegankelijk is.                                                    |

Bitmap-editor op pixelniveau met zowel een hoge resolutie van 320×200 als een
meerkleurige modus van 160×200. Openen via Toolkit → Hi-Res Editor.

### Sprite-editor

| Instelling | Beschrijving                                                                                   |
| ---------- | ---------------------------------------------------------------------------------------------- |
| Lijsten    | Lijsten toevoegen/verwijderen/de volgorde wijzigen; de lijststrook wordt onderaan weergegeven. |
| Modus      | Schakelaar voor monochroom/meerkleurig.                                                        |
| **Status** | Geeft aan of het uitvoerbare pad geldig en toegankelijk is.                                    |

**Werkstroom:**
1. Installeer het Exomizer-programma:
   - **Windows:** download de vooraf gecompileerde `win32/exomizer.exe` van
     https://bitbucket.org/magli143/exomizer/wiki/Home of
     https://csdb.dk/release/?id=244342.
   - **macOS:** `brew install exomizer` (installeert de officiële 3.1.2-build
     van Magnus Lind).
2. Configureer het pad in **Hardware-instellingen → Exomizer-sectie**.
3. Schakel het selectievakje **Uitvoeren met Exomizer** in het menu
   **Instellingen** in.
4. Alle **Run**-acties (PRG, D64, hardware) en **Build**-acties (Build PRG,
   Build D64) zullen het geassembleerde programma nu door `exomizer sfx sys`
   laten verwerken voordat het wordt gestart of opgeslagen.

Exomizer werkt op dezelfde manier op Windows en macOS: de CLI wordt aangeroepen
vanuit de Tauri-backend; niets aan de integratie is platformspecifiek.

**Intern worden twee compressiemodi gebruikt:**

| Modus                | Gebruikt door                                            | Bellen conventie                                                                                                                                                                                    |
| -------------------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sfx sys`            | Bouwen/uitvoeren met Exomizer-schakelaar (hoofd-PRG-pad) | Zelfuitpakkende PRG met ingebouwde decruncher; de instelling voor randflits regelt `-x1` versus `-n`                                                                                                |
| `mem` (achterwaarts) | Uitvoeren via D64 → per bestand **EXO** selectievakje    | Comprimeert elk extra bestand tot een `mem`-mode stream; het programma decomprimeert het tijdens runtime via de **EXODECRUNCH** macro en een vooraf gebouwde depacker (`samples/exo-decrunch.bin`). |

> **Tip:** Als het Exomizer-pad niet is geconfigureerd, maar het selectievakje
> is ingeschakeld, wordt er een duidelijke foutmelding weergegeven in plaats van
> dat het programma wordt gestart. Schakel het selectievakje uit om het
> programma zonder compressie uit te voeren.

> **Integratietest:** `cargo test --test exomizer_integration` (in `src-tauri/`)
> verifieert de volledige mem-mode compressie + decompressie roundtrip op een
> 6502 emulator.

### C64 Character ROM Browser ("Char map")

| Instelling     | Beschrijving                                                                                                                                                                                                                                                   |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Twee tekensets | Tabblad 1: **Set 1 — Boven/Grafisch** (standaardmodus na inschakelen). Tabblad 2: **Set 2 — Onder/Boven** (na `$0E` schakelaar).                                                                                                                               |
| **Status**     | Een raster van 16x16 pixels met alle 256 tekens. Klik op een glyph om het detailvenster te bekijken: een ingezoomde weergave van 8x8 pixels, de schermcode (decimaal + hexadecimaal), PETSCII-codes (zowel standaard als verschoven) en de ruwe 8-byte bitmap. |

Alleen-lezen viewer van het C64-teken-ROM (het ingebouwde PETSCII-lettertype).
Openen via de **C64 chargen**-optie in het Toolkit-menu. Handig om de schermcode
van een glyph te vinden voordat je deze schrijft met `RAWBYTES` of `TEXT`.

### Tekeneditor (Charset)

Teksteditor met een tekenset van 256 tekens (8x8). Openen via Toolkit →
Teksteditor.

| Instelling                  | Beschrijving                                                                                 |
| --------------------------- | -------------------------------------------------------------------------------------------- |
| ROM laden                   | Importeert de C64 ROM-tekenset rechtstreeks van VICE's `chargen` (geen bestandsselector).    |
| Laad `.bin`                 | Importeert een extern binair bestand met een tekenset van 2048 bytes.                        |
| Voorbeeldweergave per teken | Een raster van 16 vakjes breed met alle 256 glyphs, waarbij het huidige vakje is gemarkeerd. |

**Werkstroom:**
1. Sluit de 1541 Ultimate / Ultimate 64 aan op uw lokale netwerk.
2. Voer het IP-adres (en het wachtwoord, indien ingesteld) in bij de
   hardware-instellingen.
3. Selecteer **Uitvoeren op hardware** in het menu voor gesplitste uitvoering.
4. Klik op **▶ Uitvoeren** — de PRG wordt gecompileerd en via HTTP POST naar het
   apparaat verzonden naar `/v3/runners/prg`. Het apparaat laadt en voert het
   direct uit op de C64.

> **Tip:** Geen USB-kabel of stuurprogramma nodig — de REST API is ingebouwd in
> de Ultimate-firmware. Uw computer en het apparaat moeten zich op hetzelfde
> lokale netwerk bevinden.

### Tekenset Canvas Editor

Volledig canvas tekenset-schilderprogramma voor het bouwen van schermen vanuit
een complete tekenset van 256 tekens. Openen via Toolkit → Tekensetcanvas.

Het canvas is 16×16 tekens. In de monochrome modus geeft dat een werkgebied van
128×128 pixels; in de modus met meerdere tekens geeft het een werkgebied van
64×128 pixels, waarbij de regels voor meerdere tekens van de C64 worden
gebruikt.
- een Commodore 64 / C128 met een **Kung Fu Flash 2** cartridge erin,
  ingeschakeld;
- **Kung Fu Flash-firmware v2.07 of nieuwer** op de cartridge — eerdere
  firmwareversies ondersteunen het uploadprotocol dat door Visual Assembler
  wordt gebruikt niet. Firmwareversies:
  <https://codeberg.org/KimJorgensen/KungFuFlash2/releases/>;
- een **USB-kabel** waarmee de cartridge wordt verbonden met de computer waarop
  Visual Assembler draait (deze verschijnt als een virtuele seriële poort).

| Instelling         | Beschrijving                                                                                                                                                                                                     |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mono / meerkleurig | In de monochrome modus worden 1-bits 8×8-glyphs opgeslagen. In de meerkleurige modus worden horizontale pixelparen van twee bits opgeslagen en worden gebruikte cellen gemarkeerd met bit 3 van het kleuren-RAM. |

**Werkstroom:**
1. Plaats de Kung Fu Flash 2 in de cartridgepoort van de C64, zet de computer
   aan en sluit de USB-kabel aan op je pc/Mac.
2. Open **Hardware-instellingen** en controleer het gedeelte **Kung Fu Flash 2**
   — de poort zou al ingevuld moeten zijn.
3. Selecteer **Kung Fu Flash 2** in het menu voor gesplitste uitvoering (de
   keuze wordt onthouden en ook opgeslagen in projectbestanden).
4. Klik op **▶ Uitvoeren**. Het programma wordt gecompileerd, de cartridge wordt
   opnieuw opgestart in de MENU-loader (een korte "aanraking" van de seriële
   poort met een baudrate van 1200), er volgt een korte handshake en de PRG
   wordt geüpload. Wanneer de overdracht is voltooid, draait het programma op de
   fysieke machine.

Werkt in de modi **Block**, **Expert** en **Ultimate Basic**; Ultimate
Basic-programma's worden gecompileerd vanuit het opstartbestand van het project.

> **Beperkingen en controles:** De PRG moet het twee-byte laadadres plus ten
> minste één databyte bevatten, moet passen in de 64 KiB adresruimte van de C64
> en mag de grootte die de cartridge-loader accepteert niet overschrijden.
> Fouten — poort niet geconfigureerd, poort kan niet worden geopend, de
> cartridge keert niet terug uit MENU of een geweigerde upload — worden gemeld
> in een toastbericht met de exacte reden.

> **Tip:** Als je liever een cartridge-image hebt in plaats van een live-upload,
> **Build CRT** (Magic Desk 64K) draait ook op de Kung Fu Flash — zie [Sectie
> 12b](#12b-crt-export-magic-desk-64k-cartridge).

---

---

### Versiebeheer (git)

| Instelling                                                         | Beschrijving                                                                                                                                                |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Automatisch opslaan van items in versiebeheer**                  | Voegt ongeveer 2,5 seconden nadat u stopt met bewerken een automatisch opgeslagen item toe aan de versiegeschiedenis (dit geldt ook voor projecttabbladen). |
| **Kies git.exe…**                                                  | Navigeer naar het uitvoerbare bestand `git` (`git.exe` op Windows)                                                                                          |
| **Automatische detectie**                                          | Verwijdert het gekozen pad en doorzoekt de PATH-variabele en de gebruikelijke installatiemappen.                                                            |
| **Gebruik Git wanneer het project zich in een repository bevindt** | Opent het dialoogvenster Versiebeheer in Git-modus voor bestanden in een Git-repository.                                                                    |
| **Status**                                                         | Geeft de Git-versie weer, of dat Git niet is gevonden (de ingebouwde versiebeheerfunctie werkt nog steeds).                                                 |

## 14. Visuele editors (toolkit)

Het menu **Toolkit** in de werkbalk groepeert de visuele data-editors die
allemaal een gemeenschappelijk menu Bestanden (`Bestanden ▾`) delen voor BIN
laden / BIN opslaan / Exporteren naar blokken / Opslaan naar D64. Elke editor
produceert ruwe `.bin`-gegevens die in een programma kunnen worden geplaatst met
`INCBIN`, of direct aan een D64-schijf kunnen worden toegevoegd via de **Opslaan
naar D64**-optie.

Dialoogvensters van de visuele editor kunnen aan hun koptekst over de volledige
werkruimte van Visual Assembler worden gesleept. Een dialoogvenster zonder
opgeslagen positie wordt gecentreerd geopend; nadat het is verplaatst, wordt de
laatst gebruikte positie opgeslagen in de UI-instellingen en hersteld wanneer
het de volgende keer wordt geopend.

### Editor voor hoge resolutie / meerkleurig

Bitmap-editor op pixelniveau met zowel een hoge resolutie van 320×200 als een
meerkleurige modus van 160×200. Openen via Toolkit → Hi-Res Editor.

| Functie                       | Beschrijving                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Modusschakelaar               | **Multicolor** selectievakje schakelt tussen hoge resolutie (mono per cel) en meerkleurig (4 kleuren per cel).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Hulpmiddelen                  | Potlood, gum, lijn, rechthoek, gevulde rechthoek, ovaal, gevuld ovaal, vlak vullen, celpapier, selecteren.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Celpapier (hoge resolutie)    | Bij hoge resolutie zijn er twee kleuren in elke 8×8 cel mogelijk: de inkt (ingestelde pixels, hoge nibble van de scherm-RAM-byte van de cel) en het papier (wisbare pixels, lage nibble). Met de tool **Celpapier** wordt het papier van elke cel waarop u klikt of die u sleept ingesteld op de geselecteerde kleur; **PAPIER** stelt nog steeds alle cellen tegelijk in. De gum verwijdert pixels, zodat het eigen papier van de cel zichtbaar wordt. Uitgeschakeld in meerkleurige weergave, waar de achtergrond ($D021) wordt gedeeld.                                                                                                                                               |
| Spuitgereedschap              | Een airbrush-achtig tekenprogramma dat tijdens het tekenen pixels rond de cursor verspreidt.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Spuitintensiteit              | Met het keuzemenu naast het spuitgereedschap kunt u de dichtheid van elke spuitbeweging aanpassen.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Kleurenpalet                  | Voorgrond (inkt) + papier (achtergrond) selectieknoppen. Meerkleurenmodus houdt automatisch 3 extra's per cel bij.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Ongedaan maken / Opnieuw doen | Geschiedenis per beroerte, ctrl-Z / ctrl-Y.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Select                        | Het gereedschap met gestippelde vierkanten: sleep over het canvas om een rechthoekig gebied te markeren. **Esc** wist de selectie.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Kopiëren / Plakken            | **Kopiëren** (`Ctrl/Cmd+C`) kopieert het geselecteerde gebied. **Plakken** (`Ctrl/Cmd+V`) toont een voorbeeld dat de cursor volgt: klik op het canvas om het te plaatsen, **Esc** annuleert. De kopie blijft behouden, dus door op `Ctrl/Cmd+V` te drukken en opnieuw te klikken, kunt u het zo vaak als nodig plaatsen. In de hoge-resolutiemodus volgen geplakte pixels nog steeds de limiet van twee kleuren per cel, dus lijn het gebied uit met het celraster om de kleuren te behouden. Kopiëren, Plakken en Transparant plakken zijn ook beschikbaar in het rechtermuisklikmenu van het canvas; een plakactie die daar wordt gestart, toont een voorbeeld op de aangeklikte plek. |
| Transparante pasta            | `Ctrl/Cmd+Shift+V` (of de bijbehorende knop in de werkbalk) slaat de papierkleurige pixels van de kopie over, zodat de afbeelding eronder zichtbaar wordt.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Raster + Raster               | **Grid** toont het raster van de tekencellen: 8×8 pixels in hoge resolutie, 4×8 dubbelbrede pixels in meerkleurig. Bij 4× zoom wordt er ook een dunnere lijn rond elke pixel getekend, zodat elke pixel precies geplaatst kan worden. **Raster** voegt een rasterrij-overlay toe.                                                                                                                                                                                                                                                                                                                                                                                                        |
| Zoom                          | Schuifregelaar van 1× tot 16×.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Afbeelding importeren         | PNG/JPEG/GIF-bestanden die op het canvas worden geplaatst, worden automatisch gequantiseerd naar het 16-kleuren C64-palet.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Exporteer blokken             | Voegt BYTE/RAWBYTES-blokken met de gecodeerde bitmap-, scherm- en kleurgegevens toe aan het programma.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Exporteer `.bin`              | Slaat het oorspronkelijke meerkleurige formaat (10000 bytes: 8000 bitmap + 1000 scherm + 1000 kleur) klaar voor LOADFILE op in $2000.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |

### Sprite-editor

Sprite-editor van 24x21 pixels met animatie over meerdere frames. Openen via
Toolkit → Sprite-editor.

| Functie                            | Beschrijving                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lijsten                            | Kaders toevoegen/verwijderen/de volgorde wijzigen; de kaderstrook wordt onderaan weergegeven. **Kopiëren** / **Plakken** in de kaderrij kopieert het hele huidige kader; dezelfde twee opties zijn beschikbaar in het rechtermuisklikmenu van het canvas en van de kaderstrook.                                                                                                                                                                                              |
| Modus                              | Schakelaar voor monochroom/meerkleurig.                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Hulpmiddelen                       | Potlood, vulling, lijn, rechthoek, cirkel — plus horizontaal spiegelen, verticaal spiegelen, links/rechts/boven/onder verschuiven (met optionele tekstterugloop). Vormgereedschappen tonen een live voorbeeld tijdens het slepen; laat los om te bevestigen.                                                                                                                                                                                                                 |
| Ongedaan maken / opnieuw uitvoeren | Volledige stapel met ongedaan maken/herstellen per frame. Ctrl/Cmd+Z / Ctrl/Cmd+Y of de knoppen in de werkbalk.                                                                                                                                                                                                                                                                                                                                                              |
| Afbeelding importeren              | Importeer een PNG- of JPEG-bestand via Bestand → Afbeelding importeren. De importeerfunctie koppelt elke pixel aan de dichtstbijzijnde kleur uit het C64-palet en schrijft deze naar het huidige frame.                                                                                                                                                                                                                                                                      |
| Animatievoorbeeld                  | Afspelen/stoppen met instelbare snelheid.                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Exporteer blokken                  | Voegt voor elk frame een RAWBYTES-blok in op een adres dat is uitgelijnd met 64 bytes, plus een instelling voor een spritepointer.                                                                                                                                                                                                                                                                                                                                           |
| Sla `.bin` op                      | Schrijft 64 bytes per frame (ruwe spritegegevens zonder opvulling).                                                                                                                                                                                                                                                                                                                                                                                                          |
| Selectie                           | **Selecteren/verplaatsen**: sleep een rechthoek en sleep vervolgens binnen de rechthoek om de pixels te verplaatsen (lege pixels zijn transparant); met de pijltjestoetsen verplaatst u de rechthoek één pixel (twee bij meerkleurig), Delete verwijdert de selectie, Esc laat de selectie vallen. **90° draaien** (in beide richtingen) draait de selectie of het hele kader. Selecteren, spiegelen, verschuiven en roteren werken tegelijkertijd op de body en de overlay. |
| Overlay met hoge resolutie         | **Hi-res overlay** voegt een tweede, eenkleurige sprite met hoge resolutie toe over elk frame — de klassieke omtrek over een veelkleurig lichaam. De **Layer** lijst selecteert de bewerkte laag; de overlay wordt gedimd terwijl het lichaam wordt bewerkt. Op de C64 is het een aparte sprite: geef deze een lager spritenummer dan het lichaam. `.bin` en **Copy bytes** schrijven de overlay-sprites na die van het lichaam (`sprite_f1_ov_1`).                          |
| Spiegel alles                      | Voegt een horizontaal gespiegelde kopie van elk frame (en de bijbehorende hitbox) toe — een loopcyclus in de andere richting met één klik.                                                                                                                                                                                                                                                                                                                                   |
| Sprite-sheet importeren            | Bestanden → **Spritesheet importeren…**: celbreedte/hoogte, offset, tussenruimte en frameaantal verdelen de afbeelding in frames van de huidige grootte (meerkleurige cellen worden geschaald naar 12 pixels per sprite). Kleuren komen uit de afbeelding of blijven de eigen kleuren van de sprite; OKLab-matching zonder dithering, geordende (Bayer) of Floyd-Steinberg-dithering. Vervangt de frames of voegt eraan toe.                                                 |
| Hitbox                             | De **Hitbox**-tool sleept een rechthoek per frame (gestippeld cyaan); **Fit**, **Fit every frame**, **Copy to every frame** en **Remove** in het zijpaneel. Bestanden → **Copy hitbox table** geeft `sprite_hit_x / _y / _w / _h` (één byte per frame, schermpixels vanaf linksboven); een frame zonder hitbox gebruikt zijn pixelgrenzen.                                                                                                                                   |
| X / Y ×2                           | Toont de preview zoals met `$D01D` / `$D017` sprite-uitbreiding.                                                                                                                                                                                                                                                                                                                                                                                                             |

### C64 Character ROM Browser ("Char map")

Alleen-lezen viewer van het C64-teken-ROM (het ingebouwde PETSCII-lettertype).
Openen via de **C64 chargen**-optie in het Toolkit-menu. Handig om de schermcode
van een glyph te vinden voordat je deze schrijft met `RAWBYTES` of `TEXT`.

| Functie        | Beschrijving                                                                                                                                                                                                                                                   |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Twee tekensets | Tabblad 1: **Set 1 — Boven/Grafisch** (standaardmodus na inschakelen). Tabblad 2: **Set 2 — Onder/Boven** (na `$0E` schakelaar).                                                                                                                               |
| Glyfenraster   | Een raster van 16x16 pixels met alle 256 tekens. Klik op een glyph om het detailvenster te bekijken: een ingezoomde weergave van 8x8 pixels, de schermcode (decimaal + hexadecimaal), PETSCII-codes (zowel standaard als verschoven) en de ruwe 8-byte bitmap. |
| Detailpaneel   | Toont de schermcode, PETSCII-codes en de acht onbewerkte bytes van het geselecteerde glyph — klaar om te plakken in een `RAWBYTES` of BYTE-blok.                                                                                                               |
| Alleen-lezen   | Hier hoeft u niets te bewerken — gebruik de tekeneditor (hieronder) om de tekens aan te passen.                                                                                                                                                                |

### Tekeneditor (Charset)

Teksteditor met een tekenset van 256 tekens (8x8). Openen via Toolkit →
Teksteditor.

| Functie                       | Beschrijving                                                                                                                                                                                                                                                       |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ROM laden                     | Laadt de C64-teken-ROM — de exacte 901225-01 glyphs, zonder bestandsselector. De eerste knop (en **Bestanden → ROM: hoofdletters / afbeeldingen**) laadt set 1, de tweede knop (of Shift+klik, of **Bestanden → ROM: kleine letters / hoofdletters**) laadt set 2. |
| Laad `.bin`                   | Importeert een extern binair bestand met een tekenset van 2048 bytes.                                                                                                                                                                                              |
| Voorbeeldweergave per teken   | Een raster van 16 vakjes breed met alle 256 glyphs, waarbij het huidige vakje is gemarkeerd.                                                                                                                                                                       |
| Pixel-editor                  | Bewerkt het geselecteerde teken, of een **tegel** van 2×1, 1×2 of 2×2 aangrenzende tekens als één afbeelding (tegelkiezer).                                                                                                                                        |
| Tekengereedschappen           | Potlood, lijn, rechthoek, gevulde rechthoek en vlakvulling. Door op een pixel te klikken waar al inkt op staat, wordt deze gewist.                                                                                                                                 |
| Transformaties                | Wissen, omkeren, horizontaal/verticaal spiegelen, verschuiven met omwikkeling, 90° met de klok mee/tegen de klok in draaien (alleen vierkante tegels) — op de hele tegel.                                                                                          |
| Ongedaan maken / Opnieuw doen | Werkbalkknoppen, Ctrl+Z en Ctrl+Y (Ctrl+Shift+Z).                                                                                                                                                                                                                  |
| Kopiëren / Plakken            | Met de knoppen op de werkbalk, Ctrl+C / Ctrl+V, of door met de rechtermuisknop op de kaart te klikken, wordt de hele tegel inclusief de kleuren gekopieerd.                                                                                                        |
| Kaart slepen                  | Sleep een personage naar een ander personage op de kaart om ze te verwisselen; Shift+slepen kopieert.                                                                                                                                                              |
| Tekstvoorbeeld                | Typ tekst om deze in de huidige tekenset te bekijken. Kies de toewijzing voor hoofdletters of kleine letters; `{65}` of `{$41}` voegt een schermcode in.                                                                                                           |
| Bereik exporteren             | Stel de 'Van'- en 'Naar'-tekens in en ga vervolgens naar **Bestanden → Bereik opslaan (.bin)** (ruwe bytes) of **Bereik kopiëren ASM** (`.byte` regels).                                                                                                           |
| Kleur per teken               | Slaat een standaard kleur-RAM-waarde op voor elk teken. In de modus voor meerkleurige tekens behoudt dit ook de per-cel meerkleurige inschakelbit en de eigen lagere 3-bits kleur van het teken.                                                                   |
| Metadata retour               | Bij het laden van compatibele gegevens vanuit Charset Canvas/Map-workflows blijven de kleurmetadata per teken behouden, zodat bewerkingen kunnen worden voortgezet zonder dat de kleurintentie verloren gaat.                                                      |
| Exporteer blokken             | Voegt de gecodeerde tekenset toe aan RAWBYTES op $0800 (blok 2) of $3800 (blok 7).                                                                                                                                                                                 |

### Tekenset Canvas Editor

Volledig canvas tekenset-schilderprogramma voor het bouwen van schermen vanuit
een complete tekenset van 256 tekens. Openen via Toolkit → Tekensetcanvas.

Het tekengebied is 16×16 tekens, 128×128 pixels. In de modus voor meerkleurige
tekens is elk teken ofwel meerkleurig (brede pixels, 4 kleuren) ofwel in hoge
resolutie (8 smalle pixels, 2 kleuren), precies zoals op de C64.

| Functie                                       | Beschrijving                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |                                                      |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Mono / meerkleurig                            | In de monochrome modus worden 1-bits 8×8-glyphs opgeslagen. In de meerkleurige modus worden horizontale pixelparen van twee bits opgeslagen en worden meerkleurige cellen gemarkeerd met bit 3 van het kleurgeheugen.                                                                                                                                                                                                                                                                                                                                                                           |                                                      |
| Tekenmodus-tool                               | In de meerkleurenmodus kunt u op tekens klikken of slepen om ze te wisselen tussen meerkleuren en hoge resolutie (Color RAM-bit 3). De vorm blijft behouden: een vast pixelpaar wordt de eigen kleur van het teken. Een teken met hoge resolutie heeft de achtergrond en zijn eigen kleur (0-7); MC1/MC2 tekenen daar niet.                                                                                                                                                                                                                                                                     |                                                      |
| Achtergrond                                   | Het BG-dropdownmenu wordt ook in de monochrome modus weergegeven; MC1 / MC2 alleen in de meerkleurige modus.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |                                                      |
| ECM                                           | Het selectievakje **ECM** (uitgebreide kleurmodus, niet samen met meerkleurig): elk teken is in hoge resolutie met een eigen kleur (0–15) en een van de vier achtergronden BG0–BG3 (`$D021`–`$D024`; BG1 / BG2 zijn de MC1 / MC2-registers). Kies een achtergrondkleur in het palet (gelabeld B0–B3) en klik of sleep vervolgens over tekens met het gereedschap **Tekenachtergrond**. Er passen slechts 64 verschillende tekens in: de statusregel telt ze en bij het opslaan worden gelijke tekens samengevoegd — de tekenset bestaat uit 64 tekens (512 bytes) en de schermcodes zijn `glyph | achtergrond << 6`. Schakel ECM in met `$D011` bit 6. |
| C64 kleurenmodel                              | Achtergrond gebruikt `$D021`; gedeelde meerkleurige kleur 1 gebruikt `$D022`; gedeelde meerkleurige kleur 2 gebruikt `$D023`; de kleur van elk teken is afkomstig uit bits 0–2 van het kleurengeheugen.                                                                                                                                                                                                                                                                                                                                                                                         |                                                      |
| Tekengereedschappen                           | Potlood, gum, lijn, rechthoek, ovaal en vulpen werken over de grenzen van tekens heen.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |                                                      |
| Spuitgereedschap                              | Een tekening in airbrush-stijl waarbij pixels over aangrenzende cellen/tekens verspreid worden.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |                                                      |
| Spuitintensiteit                              | Via het keuzemenu naast het spuitgereedschap kunt u de spuitdichtheid instellen.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |                                                      |
| Raster inschakelen/uitschakelen               | Met het selectievakje 'Raster' kunt u het raster van 16x16 tekens weergeven of verbergen.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |                                                      |
| Zoom                                          | De zoomregelaar (2×–24×, hele apparaatpixels per C64-pixel) of Ctrl+muiswiel over het canvas; de zoominstelling wordt onthouden. Vanaf 8× tekent het raster ook een fijne lijn op elke pixelrand.                                                                                                                                                                                                                                                                                                                                                                                               |                                                      |
| Sla de tekenset `.bin` op.                    | Slaat de 2048-byte tekenbitmapgegevens op.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |                                                      |
| Sla een kaart van 16×16 op + Kleur RAM `.bin` | Slaat 256 schermcodes op, gevolgd door 256 kleur-RAM-waarden. Gebruik dit met `MAP_COPY16X16`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |                                                      |
| Laden                                         | Kan opgeslagen charset-canvasbestanden, gewone charset-gegevens en compatibele Character Editor charset-gegevens laden, inclusief opgeslagen kleuren per teken indien aanwezig.                                                                                                                                                                                                                                                                                                                                                                                                                 |                                                      |

**Belangrijke C64-beperking:** In de meerkleurige tekenmodus zijn de twee
gedeelde kleuren globaal voor het hele scherm (`$D022` / `$D023`). Alleen de
eigen kleur van het teken is per cel, en deze is beperkt tot kleuren 0-7 omdat
bit 3 van het kleuren-RAM de meerkleurige modus selecteert. Dus één teken toont
maximaal **4 kleuren** (achtergrond, MC1, MC2 en zijn eigen kleur), en het hele
scherm maximaal 3 + 8. In het palet zijn de gedeelde kleuren gelabeld als BG / 1
/ 2, en kleuren 8-15 die niet gedeeld worden, zijn gedimd. Het selecteren van
zo'n kleur plaatst deze alleen in MC2 of MC1 zolang geen pixel dat register
gebruikt; anders wordt deze gewijzigd in het dropdownmenu (waardoor het hele
scherm opnieuw wordt gekleurd). In de hoge-resolutiemodus (mono) heeft een teken
2 kleuren: de achtergrond en zijn eigen kleur (0-15).

### Kaarteditor (tegelkaarten met meerdere lagen)

Gelaagde tegelkaarteditor voor statische omgevingen, sprite-spawnmaps,
botsingsgegevens en dergelijke. Openen via Toolkit → Kaarteditor.

| Functie                                          | Beschrijving                                                                                                                                                                                                                                                                               |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Lagen                                            | Meerdere benoemde lagen, elk met een eigen tegelset en transparantie.                                                                                                                                                                                                                      |
| Kwasten                                          | Modi voor enkelvoudige tegels, vulling, lijn, rechthoek en cirkel. Vormgereedschappen tonen een live voorbeeld tijdens het slepen; laat los om te bevestigen.                                                                                                                              |
| Ongedaan maken / opnieuw uitvoeren               | Volledige stapel met ongedaan maken/herstellen per laag. Ctrl/Cmd+Z / Ctrl/Cmd+Y of de knoppen in de werkbalk.                                                                                                                                                                             |
| Menu wissen                                      | Kaart per laag of hele kaart wissen met bevestiging.                                                                                                                                                                                                                                       |
| Afbeelding importeren                            | Sleep een PNG-bestand van een tegelkaart naar de editor; deze verdeelt de kaart automatisch in tegels.                                                                                                                                                                                     |
| Kopiëren/plakken                                 | Kopieer een geselecteerd tegelgebied en plak het vervolgens normaal of gebruik transparant plakken om lege tegels transparant te houden. Dezelfde opties zijn te vinden in het rechtermuisklikmenu van het canvas.                                                                         |
| Tegelkleuring met aandacht voor meerdere kleuren | Bij gebruik van compatibele tekensetmetadata gebruikt het tekenproces de standaardwaarden van het opgeslagen Color RAM-geheugen van de tegel (inclusief meerkleurige codering) in plaats van een generieke effen kleur.                                                                    |
| Aangepaste tekensetkleuren                       | Wanneer een tekenset `charColors`-metadata bevat, gebruikt de kaarteditor de standaardkleur-RAM-waarde van de geselecteerde tegel tijdens het tekenen.                                                                                                                                     |
| Exporteer blokken                                | Genereert RAWBYTES-blokken voor tegelsetafbeeldingen en kaartgegevens.                                                                                                                                                                                                                     |
| Schermgeheugen opslaan (.bin)…                   | Slaat alleen de schermcodes op voor de huidige kaartlaag (40 × 25 = 1000 bytes).                                                                                                                                                                                                           |
| Scherm-RAM + Kleur-RAM opslaan (.bin)…           | Slaat schermcodes, gecombineerd met kleur-RAM-waarden, op als één bestand van 2000 bytes (`screen[0..999]` gevolgd door `color[0..999]`). Gebruik dit met de macro **MAP_COPY** (gecombineerde .bin-modus) om zowel scherm als kleur in één bewerking tijdens de uitvoering te herstellen. |

### Niveau-editor

Hiermee kunnen de **Map Editor-schermen** in één level worden gerangschikt — een
verticale shooter, een autospel met scrollende neerwaartse beweging, een
side-scroller of een 2D-kaart — en wordt het hele level met vloeiend scrollen
weergegeven. Open het met de **Level Editor**-knop in de werkbalk naast de Map
Editor.

| Functie               | Beschrijving                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Indeling              | **Verticaal**, **Horizontaal** of **Raster** (rijen × kolommen, met knoppen voor het toevoegen/verwijderen van rijen en kolommen).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Schermen              | **Nieuw leeg scherm**, **Toevoegen vanuit Kaarteditor** (de momenteel geopende kaart) of **Kaart(en) laden (.bin)…** (meerdere Kaarteditor-exports tegelijk). Sleep een scherm uit de lijst naar een slot; sleep slots naar elkaar om ze te verwisselen.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Bewerken              | **Bewerken in kaarteditor** opent het geselecteerde scherm in de kaarteditor en brengt de wijzigingen terug; dupliceren, omhoog/links of omlaag/rechts verplaatsen, verwijderen; ongedaan maken/opnieuw doen.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Voorbeeld             | Sleep de preview of gebruik de pijltjes toetsen om pixel voor pixel te scrollen; **Afspelen** scrollt automatisch (richting, snelheid 1–8, herhalen), Spatie = afspelen/stoppen. *Randen* markeert de schermranden.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Controles             | Informatie over de tekenset en een waarschuwing wanneer schermen een andere tekenset of kleuren gebruiken (het level gebruikt de instellingen van het eerste scherm).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Karaktereigenschappen | De knop **Personagekenmerken** schakelt het overzicht over naar het schilderen van kenmerken: kies **Vaste**, **Ladder**, **Gevaar** of **Verzamelobject**, klik op een personage en elke cel met die schermcode krijgt (of verliest) die code; sleep voor meer codes. De attributen worden weergegeven als een gekleurde laag en vormen de 256-byte `LEVEL_ATTR`-tabel (`LEVEL_ATTR_SOLID` = 1, `_LADDER` = 2, `_HAZARD` = 4, `_COLLECT` = 8).                                                                                                                                                                                                                                                                                                                     |
| Randcontrole          | In het rood zijn de plekken aangegeven waar aangrenzende schermen niet doorlopen: de ene kant van de rand is leeg (ruimte) en de andere niet, of slechts aan één kant is de rand gevuld. Het zijpaneel telt de randen en cellen.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Kleuren               | **Niveaurand**, en **Eigen kleuren voor dit scherm** (achtergrond, rand, meerkleurig 1 / 2) voor het geselecteerde scherm; het voorbeeldvenster toont de rand. Geëxporteerd per slot als `NIVEAU_SCHERM_ACHTERGROND / _RAND / _MEERKLEUREN1 / _MEERKLEUREN2` (met `NIVEAU_SCHERM_KLEUREN` = 1) wanneer een geplaatst scherm zijn eigen kleuren heeft.                                                                                                                                                                                                                                                                                                                                                                                                               |
| Geheugen              | De `.level`-gegevensgrootte op een gekozen adres (precies berekend zoals de macro deze opbouwt), met waarschuwingen voor de BASIC/KERNAL ROM, het I/O-gebied en het geheugen onder `$0800`, en de RLE-grootte van het level. **Export RLE to blocks / Copy RLE asm** geeft de level-RLE verpakt met de `level_unrle`-uitpakker (`($FB)` → `($FD)`).                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Verschijnt in VICE    | Bouwt een met een joystick bestuurd testprogramma op basis van het level (de `level-demo`-scroller, code op `$C000`, levelgegevens van `$2000`, aangepaste tekenset op `$2000`) en start het in VICE — de schermkleuren veranderen met het scherm linksboven in het beeld, de camera start bij het eerste Start-object.                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Objecten              | De knop **Objectenlaag** schakelt het overzicht over naar objectbewerking: kies een type (Start, Vijand, Item, Deur, Uitgang, Trigger) en een **Param** byte (vijandsoort, item-ID, deurdoel, enz.), klik om te plaatsen, sleep om te verplaatsen (vastgeklikt op 8 px, Shift = vrij), klik op een object om het te selecteren en het type/de parameter te wijzigen, de pijltjestoetsen verplaatsen het, Delete verwijdert het. Objecten behoren tot de levelpositie, niet tot een scherm. Ze worden weergegeven in de zijbalk, getoond in de preview, opgeslagen met het level en geëxporteerd in scrollvolgorde (verticaal op Y, horizontaal op X, rasterrij voor rij) als `LEVEL_OBJ_*` tabellen — met **Copy asm / Export to blocks** en met de `.level` macro. |

**Bestandenmenu:**
| Actie                                                                  | Wat het doet                                                                                                                    |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Nieuw level** / **Level openen (.bin)…** / **Level opslaan (.bin)…** | Het levelproject: alle schermen plus de lay-out. Dit is het bestand dat de macro `.level` en Ultimate Basic's `map load` lezen. |
| **Sla het levelscherm-RAM (.bin) op…**                                 | Het hele level als één personagekaart (alleen schermcodes).                                                                     |
| **Sla het levelscherm + kleuren-RAM (.bin) op…**                       | De schermcodes van het hele level, gevolgd door de bijbehorende kleuren.                                                        |
| **Exporteren naar blokken** / **Asm kopiëren**                         | De niveaugegevens als blokken of als samengestelde tekst (klembord).                                                            |

**Gebruikmakend van het niveau:** in assembler, `.level "level.bin"` +
`.level_row` (zie [LEVEL / LEVEL_ROW](#level--level_row) en
`samples/level-demo.asm`); in Ultimate Basic 1.6.1+, `map load "level.bin",
$4000` en `map view px, py` (voorbeeld `level_scroll_demo.ub`).

### SID-editor (3-stemmen tracker)

Multi-instrument 3-stemmige tracker. Openen via Toolkit → SID Editor. **Play:
All** voert de geëxporteerde 6502-speler uit in de WebSid-emulator; elke andere
preview (instrumentpreview, virtueel toetsenbord, nootinvoer, akkoord/arpeggio,
rij- en enkelpatroonweergave) wordt ook afgespeeld op de geëmuleerde SID: een
JS-model van dezelfde speler (frame voor frame) streamt zijn SID-registers elke
frame naar WebSid, en maximaal drie previewnoten delen de drie stemmen. De
streamspeler wordt geladen wanneer de editor wordt geopend en opnieuw na Stop,
zodat noten direct klinken; zonder WebSid speelt er in plaats daarvan een kleine
SID-synthesizer.

**Voorbeeldweergave-engine:** **Instellingen → SID-voorbeeld** selecteert
**WebSID** of **VA SID Core (Rust)**, de eigen SID-emulatie van de app; met VA
SID Core kiest u ook de chip (MOS 6581 / 8580). De instrumentparameters worden
ingesteld met draaiknoppen.

** Bedieningselementen per instrument: **
- Golfvormselectievakjes (TRI / SAW / PUL / NOI) — meerdere golfvormen worden
  gecombineerd met een AND-bewerking zoals op de SID — plus **RING**
  (ringmodulatie van de driehoek door de vorige stem: 1 ← 3, 2 ← 1, 3 ← 2) en
  **SYNC** (harde synchronisatie met de vorige stem).
- ADSR (attack / decay / sustain / release) wordt weergegeven als een
  sleepgrafiek boven de vier schuifregelaars.
- Pulsbreedte-schuifregelaar (0-4095).
- **Filter:** *Leid deze stem door het filter*, LP / BP / HP en **3 UIT**
  (dempen stem 3 wanneer deze niet wordt geleid), cutoff, resonantie, volume.
  **Einde** + **Sweep** verplaats de cutoff van Cut naar End met Sweep per
  frame; **Pingpong** stuitert tussen de twee — dit is wat resonante filter
  sweeps mogelijk maakt. De stem die een filter-geleid instrument start, is
  eigenaar van het filter (cutoff, resonantie, modus); elke stem waarvan het
  instrument wordt geleid, gaat erdoorheen.
- **Vibrato:** na **Delay** frames een driehoekige LFO die elke **Speed** frames
  draait, **Depth** 0-15 geschaald naar de halve toon van de noot (onafhankelijk
  van het `V` effect).
- **Pulsbreedtemodulatie:** **Snelheid** wordt elke frame aan de pulsbreedte
  toegevoegd, waarbij deze schommelt tussen **Min** en **Max**.
- **Gate:** **Gate timer** laat de gate los zoveel frames voor de volgende noot
  op de stem (houd deze onder Speed); **Hard restart** zet ADSR dan ook op nul,
  voor een zuivere attack; **Eerste frame** schrijft een golfvorm op het eerste
  frame van de noot (bijv. `$09` test + gate).
- **Golf-/arpeggiotabel: ** tot 32 stappen golfvorm (— = behouden) en noot
  (offset in halve tonen, of **abs** = absolute noot), één stap per **Speed**
  frames, **Loop** terug naar een stap of stop op de laatste. **Presets** (25,
  in groepen; de lijst bewaart de gekozen preset totdat de tabel handmatig wordt
  bewerkt): arpeggio's (majeur, mineur, septiemakkoorden, sus4, verminderd,
  verhoogd, powerchord, octaaf, triller), drums (kick, snare, tom, clap,
  gesloten/open hi-hat), lead- en basaanvallen en geluidseffecten (laser,
  pickup, explosie).

**Tracker raster:**
- 3 stemmen × tot 7 patronen × 32 rijen = 7 × 32 = maximaal 224 rijen (beperking
  door een 8-bits rijteller).
- Per rij: noot + instrumentindex, plus een optioneel effect (zie
  **Effectkolom** hieronder). Lege rijen bevatten de vorige noot: net als in
  andere trackers (GoatTracker, SID-Wizard) houdt een noot zijn gate aan
  (sustainniveau) tot de volgende noot op die stem of een **noot-uit**.
- **Enter** (of een dubbelklik) bewerkt de geselecteerde cel als tekst (`C-4 01
  V24`); **Enter** slaat op en gaat naar de volgende rij, **Esc** annuleert.
- **Note-off** (`===`): toets **1** (of `` ` `` / `=`), of typ `===` / `OFF` in
  een cel. Het laat de gate los, zodat de release van het instrument wordt
  uitgevoerd — hetzelfde als het `C`-effect zonder noot (opgeslagen en
  geëxporteerd als `C00`).
- Selecteer een cel op de normale manier, of houd **Shift** ingedrukt terwijl u
  klikt of de pijltjestoetsen gebruikt om een rechthoekige selectie uit te
  breiden over rijen en elk van de drie stemmen. Door met de rechtermuisknop
  binnen het geselecteerde gebied te klikken, blijft het bereik intact.
- Kopiëren, knippen, plakken en wissen zijn beschikbaar via de iconenwerkbalk en
  het contextmenu met pictogrammen. `Ctrl/Cmd+C` en `Ctrl/Cmd+V` werken op
  dezelfde rechthoekige selectie.
- Harmoniehulpmiddel: kies een grondtoon, akkoordtype en octaaf, beluister het
  akkoord met het huidige instrument en voeg de stemvoering vervolgens direct in
  de tracker in. Beschikbare typen zijn onder andere majeur, mineur, verminderd,
  verhoogd, sus2, sus4, dominant septiem, majeur septiem, mineur septiem, sext,
  mineur sext, none, b9, #9, verminderd septiem en 7sus4.
- Arpeggio-hulpmiddel: bekijk of voeg notenreeksen van 4, 8 of 16 stappen in
  vanaf het geselecteerde akkoord in opwaartse, neerwaartse of op/neerwaartse
  richting in.
- **Voorbeeldrij** laat de geselecteerde rij horen op alle drie de stemmen
  zonder het patroon af te spelen.
- Het plakken binnen een celbereik begint nu bij de geselecteerde begincel van
  het bereik en stopt netjes bij de grenzen van stemmen en rijen, in plaats van
  door te lopen naar de volgende kolom of rij.
- Met de snelheidsregelaar wordt de IRQ-tickdeler ingesteld (het aantal frames
  tussen rijen).

** Nummer / volgordelijst: **
- De patronen worden geordend via een lijst met nummers/volgordes die bovenop de
  ruwe patroonbank is geplaatst. Hetzelfde patroon kan zich herhalen en het
  nummer kan langer zijn dan het aantal opgeslagen patronen.
- Voeg stappen toe aan, verwijder ze uit en wijzig de volgorde van de stappen in
  het paneel met de liedjeslijst; de huidige stap wordt tijdens het afspelen
  gemarkeerd.
- Zowel bij het afspelen binnen de app als bij elke export wordt deze lijst
  gebruikt, niet de oorspronkelijke patroonvolgorde. Exports die zijn gemaakt
  voordat de volgordelijst bestond, laden nog steeds correct als een gewoon
  0..N-1 nummer.

**Effectkolom:** Elke cel kan één effect bevatten naast de noot en het
instrument, ingevoerd als een korte code direct na de noot (bijv. `C-4 01 V24`)
of op een aparte regel voor een effect zonder noot (bijv. `F06`):

| Code | Effect                            | Waarde                                                            |
| ---- | --------------------------------- | ----------------------------------------------------------------- |
| `V`  | Vibrato                           | lage knabbel = diepte, hoge knabbel = vasthoudlengte              |
| `U`  | Omhoog schuiven (portamento)      | bedrag dat aan de frequentie van elke rij wordt toegevoegd        |
| `D`  | Glijden naar beneden (portamento) | bedrag dat van de frequentie van elke rij wordt afgetrokken       |
| `C`  | Let op: knip                      | dempt de stem zonder deze opnieuw te activeren; waarde ongebruikt |
| `F`  | Snelheidsverandering              | nieuwe waarde voor frames per rij, treedt onmiddellijk in werking |

Effecten worden één keer per regel bijgewerkt (overeenkomend met de timing van
de geëxporteerde speler), werken identiek in de Web Audio-preview en de
gecompileerde 6502-export, en worden zonder kwaliteitsverlies opgeslagen/geladen
in het versiebeheerde `.bin`-formaat.

**Afspelen en virtueel toetsenbord: **
- De knop 'Afspelen' in de werkbalk verandert in 'Pauze' tijdens het afspelen en
  in 'Hervatten' wanneer het afspelen gepauzeerd is; 'Stop' beëindigt het
  afspelen en zet de status terug naar de beginstand.
- De knop in de toetsenbordwerkbalk opent **VA-VK**, een niet-modaal piano (2, 3
  of 4 octaven; positie, open status, octaaf en *Invoegen in tracker* worden
  onthouden) met eigen **Afspelen/Stoppen**-knoppen die bruikbaar blijft terwijl
  de SID-editor actief is. Sleep de koptekst om deze overal boven de
  hoofdapplicatie te plaatsen.
- Schakel **Invoegen in tracker** in om elke gespeelde noot op de huidige
  trackercursor te schrijven en naar de volgende regel te gaan. Schakel deze
  functie uit om noten te beluisteren zonder ze te bewerken.
- Bij het openen van het klavier lichten de bijbehorende pianotoetsen op als de
  akkoord- en arpeggiovoorbeelden worden weergegeven.

**Opname, metronoom en MIDI:**
- **Record** (de rode stip in de tracker-werkbalk en op VA-VK) schrijft de noten
  die je speelt – op VA-VK, het computertoetsenbord of een MIDI-keyboard –
  synchroon in de geselecteerde stem, beginnend bij de geselecteerde regel, met
  de huidige snelheid. Wanneer het patroon vol is, wordt er na de huidige
  songstap een nieuw, leeg patroon toegevoegd en gaat de opname daar verder.
  Druk nogmaals op Record om te stoppen.
- **Metronoom** (tracker-werkbalk en VA-VK) klikt elke 4 regels, met de nadruk
  op de eerste tel van elke maat van 4 tellen. De tel-lampjes ernaast knipperen
  bij elke tel tijdens het afspelen en opnemen, zelfs als de klik is
  uitgeschakeld.
- **MIDI:** Kies de ingang in de **MIDI**-lijst naast de instrumentnaam en druk
  op **MIDI verbinden**; noten worden gespeeld door het huidige instrument (en
  worden in de tracker geschreven tijdens het opnemen of met *Invoegen in
  tracker*). Het lampje naast de knop knippert bij elk inkomend MIDI-bericht.
- **Patroon verwijderen:** De **−**-knop naast **Patroon +** verwijdert het
  huidige patroon (er wordt eerst gevraagd of het patroon noten bevat). De
  songstappen die het patroon gebruikten, worden verwijderd en de andere worden
  opnieuw genummerd; er blijft altijd minstens één patroon over.
- De **hoofdvolumeknop** bevindt zich op VA-VK.

**Exporteren via het menu Bestanden:**
| Exporteren                             | Wat het doet                                                                                                                                                                                                                                                                                                                                                                                                                     |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Sla .bin op…`                         | Schrijft de eigen geserialiseerde indeling van de editor (instrumenten met alle modulatie-instellingen en namen, snelheid, patronen, nummer). Oudere saves kunnen nog steeds worden geladen.                                                                                                                                                                                                                                     |
| `Blokken exporteren (alleen gegevens)` | Voegt de instrumenttabel + patroonblokken toe aan het programma op `* = $C000`.                                                                                                                                                                                                                                                                                                                                                  |
| `Blokken exporteren + miniplayer`      | Voegt de volledige speler (sid_init / sid_irq / sid_frame / sid_play_row / sid_set_voice) plus PAL-frequentietabellen toe. Plaats na het exporteren een `JSR sid_init` in uw hoofdcode waar de muziek moet beginnen; gebruik in plaats daarvan uw eigen IRQ-aanroep `JSR sid_frame` eenmaal per frame.                                                                                                                           |
| `Exporteer asm (klembord)`             | Kopieert de volledige broncode van de assembly naar het klembord.                                                                                                                                                                                                                                                                                                                                                                |
| `Importeer GoatTracker .sng…`          | Laadt een GoatTracker 2-nummer in plaats van het huidige — zie **GoatTracker import** hieronder.                                                                                                                                                                                                                                                                                                                                 |
| `Exporteren naar UltimateBasic`        | Schrijft een `tune ... end` blok (instrumenten, volgordelijst, patroonrijen als tekst) plus `music play` en voegt dit in op de cursorpositie van de Ultimate Basic-editor; buiten de UB-modus kopieert het de tekst naar het klembord. De UltimateBasic-compiler bouwt de speler, dus `music play` / `music stop` besturen deze. Instrumentmodulatie komt in `imod` / `ifilt` / `igate` / `itab` regels (Ultimate Basic 1.6.2+). |

**GoatTracker importeren:** **Bestanden → GoatTracker .sng importeren…** laadt
een GoatTracker 2-nummer (`.sng`, GTS3–GTS5) in plaats van het huidige. De
conversie is bij benadering, omdat de twee trackers anders werken:
- De volgordelijsten per stem (met transponering en herhaling) worden
  samengevoegd tot één lied voor drie stemmen en in patronen van 32 rijen
  verdeeld; identieke patronen worden gedeeld.
- Instrumenten: AD/SR, eerste golf, gate timer en harde herstart worden
  overgenomen; de wavetable wordt de golf-/arpeggiotabel, de pulstabel PWM, de
  filtertabel filtermodus, resonantie en cutoff sweep, en de snelheidstabel
  invoert het instrumentvibrato.
- Patrooncommando's: key off → note-off, portamento → `U` / `D` (maximaal 255
  per regel), tempo → `F`; toneporta wordt een gewone noot. Andere commando's
  worden weggelaten en een bericht geeft aan wat is benaderd of overgeslagen.
- Een gate die door de wavetable wordt vrijgegeven, wordt een noot-off op de
  volgende vrije rij. Alleen de eerste subtune wordt geïmporteerd en de
  exportlimiet van 7 patronen blijft van kracht.

**Gebruik van de speler-ZP: ** `$02`–`$1C` (patroonpointers, patroonoffset,
temp) en `$2F` (huidige snelheid), plus `$FB`–`$FD` (tickteller, rij-index,
positie in de orderlijst). De stem-, modulatie- en filterstatus bevinden zich in
`sid_state` na de data. De ZP-bytes conflicteren als uw hoofdcode ze gebruikt —
verplaats ze indien nodig via de Expert-modus.

**Bekende limieten: **
- Een 8-bits rijteller beperkt elk patroon tot 7 patronen × 32 rijen in de ruwe
  databank (de lijst met nummers/volgordes kan nog steeds willekeurig lang zijn
  door herhalende patronen).
- C64 `$D418` Het globale volume wordt gedeeld over alle stemmen — de
  volumeregelaar per instrument is informatief; het sustainniveau (`S` van ADSR)
  is het effectieve volume per stem.
- Terwijl **Play: All** de echte melodie geladen heeft (ook wanneer gepauzeerd),
  vallen de notenvoorbeelden terug op de kleine synthesizer, die slechts een
  benadering is van de SID-chip. De voorbeelden bereiken WebSid ongeveer 0,1
  seconde eerder dan het geluid.

---

### SID-speler

De **SID Player**-werkbalkknop opent een zwevend venster dat
`.sid`-muziekbestanden (PSID en RSID) afspeelt, bijvoorbeeld nummers uit de
HVSC-collectie.

- **Afspeellijst:** Voeg nummers toe met **Voeg .sid-bestanden toe…** of door ze
  naar het venster te slepen en op een nummer te klikken om het af te spelen;
  **Verwijderen** en **Afspeellijst wissen** ruimen de lijst op. **Afspeellijst
  opslaan…** / **Afspeellijst openen…** schrijven en lezen een `.sidpl`-bestand
  met de nummers erin. De lijst, het huidige nummer en of het venster open is,
  worden onthouden.
- **Transport:** Afspelen, Pauze, Stop, **Vorige** / **Volgende** melodie,
  **Vorige / Volgende submelodie** voor bestanden met meerdere nummers, en een
  tijdsteller.
- **Zoeken:** de positiebalk en **Terug/Vooruit 10 s** werken met de VA SID
  Core-engine. WebSID kan niet zoeken, dus deze bedieningselementen zijn daarmee
  uitgeschakeld.
- **Volume:** De knop wordt gedeeld met het hoofdvolume van de SID Editor.
- **Engine:** Het venster toont welke engine wordt gebruikt (WebSID of VA SID
  Core met de bijbehorende versie en SID-chip); kies deze in **Instellingen →
  SID-voorbeeld**. VA SID Core voert de tune uit op een native Rust C64-core met
  een cycle-exacte 6510, precieze interrupt-timing, CIA 6526A, VIC-II-timing met
  foutlijnen, sprite DMA en raster-interrupts, en de 6510 I/O-poort — zodat
  raster-IRQ-, CIA-getimede en digitale tunes worden afgespeeld met de timing
  van een echte machine.
- **Shuffle:** De shuffle-knop naast **Volgende** speelt de afspeellijst in
  willekeurige volgorde af — geen enkel nummer wordt herhaald totdat elk nummer
  is afgespeeld, en **Vorige** gaat terug in de willekeurige volgorde. De
  instelling wordt onthouden.
- **Favorieten:** De ☆ / ★ in elke rij markeert een melodie; deze wordt bewaard
  in de opgeslagen status en in `.sidpl` afspeellijsten.

---

### Curve-editor

Genereert kant-en-klare `.byte` opzoektabellen op basis van wiskundige krommen —
sinus, easing, driehoek/zaagtand/vierkant en bounce. Ideaal voor spritebeweging,
rastereffecten, kleurwisselingen of elke animatie die wordt aangestuurd door een
vooraf berekende tabel. Openen via het **Curve Editor**-pictogram in de bovenste
werkbalk (naast de SID Editor-knop).

**Curven:** Sinus, Cosinus, Lineair, Ease In/Out/InOut (Kwadraat en Kubiek),
Ease In/Out (Cirkel), Driehoek, Zaagtand, Vierkant en Ease In/Out/InOut Bounce.

**Besturing:**
| Controle                   | Doel                                                                                                                                                                                          |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Start-/eindwaarde**      | Uitgangsbereik: 0..255 in 8-bits modus, 0..320 in 16-bits modus.                                                                                                                              |
| **Aantal waarden**         | Tabellengte: 4–512 items.                                                                                                                                                                     |
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

Elke uitvoer van kopiëren/invoegen begint met een koptekstcommentaar waarin de
curve, het werkelijke minimum/maximumbereik, het aantal items en het exacte
gebruik (waarbij elke tabelinvoer wordt geregistreerd) worden beschreven.

**Voorbeeld:**
- **Grafiek** — de curve is getekend met waarde 0 aan de **bovenkant** en het
  maximum aan de **onderkant**, conform de C64 sprite-Y / rasterconventie (dus
  wat je ziet is wat de tafel op hardware aanstuurt). Een meta-lijn onder de
  grafiek toont het aantal bytes, de werkelijke minimum- en maximumwaarden van
  de gegenereerde waarden en de naam/namen van de curve(s).
- **Stuiterende bal** — animeert een marker door de tabel met het **Tempo**
  (5–240 waarden/sec). Bij tempo 50 komt dit overeen met één waarde per frame op
  PAL (50 Hz), d.w.z. één `.wait_raster` stap per index. Afspeel-/pauze- en
  herstartknoppen, een vervagend spoor van de laatste ~24 posities en een live
  `Index · Waarde` uitlezing.

**Kopiëren / Invoegen:** de twee pictogrammen van de werkbalk — **Kopiëren**
plaatst de tabel op het klembord; **Invoegen in editor** voegt de tabel (en
lezer, indien ingeschakeld) als blokken toe aan het huidige programma. Opnieuw
invoegen **vervangt** de vorige invoeging in de Curve Editor in plaats van
duplicaten te stapelen (werkt in blok- en expertmodus).

**Bestandenmenu:**
| Actie                             | Wat het doet                                                                                                                                                                                                                                                                                                                                                                                                                  |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Curve opslaan (.bin)…**         | Slaat de ruwe tabelbytes exact op zoals de C64 ze zou lezen via `INCBIN`. 16-bit: N lage bytes gevolgd door N hoge bytes.                                                                                                                                                                                                                                                                                                     |
| **Laadcurve (.bin)…**             | Laadt de onbewerkte tabelbytes terug in de editor, geïnterpreteerd volgens de huidige bitdiepte (16-bits: eerste helft laag, tweede helft hoog). De geladen tabel wordt ongewijzigd weergegeven totdat een curvebesturing een nieuwe curve genereert.                                                                                                                                                                         |
| **Exporteer demo naar blokken**   | Voegt een complete, uitvoerbare sprite-demo toe: sprite-initialisatie, raster-gesynchroniseerde hoofdloop, de ingebedde tabel en bal-spritegegevens. X veegt van 0 tot 320 in 8.8 fixed point met de `$D010` MSB terwijl de tabel de sprite-Y aanstuurt — exact overeenkomend met de preview in de editor. Re-export vervangt de vorige Curve Editor-invoeging.                                                               |
| **Exporteren naar UltimateBasic** | Schrijft de tabel als een geïnitialiseerde Ultimate Basic-array — `var name = array(N)` (of `array_word(N)` voor 16-bits) gevolgd door `data name: …` lines — en voegt deze in op de cursorpositie in de UB-editor (buiten de UB-modus wordt deze naar het klembord gekopieerd). Het label wordt een geldige UB-naam in kleine letters; indexeer de tabel als `name[i]`. Vereist Ultimate Basic 1.5.8 of hoger (meegeleverd). |
| **Exporteer UltimateBasic demo**  | Produceert een compleet, direct uitvoerbaar UB-programma: een bal-sprite (`sprdef 0`), de tafel en een raster-gesynchroniseerde lus die één tafel-item per frame afspeelt. 8-bits tafels sturen sprite **Y** aan terwijl X van 0 tot 320 loopt; 16-bits (0 tot 320) tafels sturen sprite **X** aan terwijl Y van 0 tot 200 loopt. Tafels met meer dan 256 items spelen de eerste 256 af.                                      |

**Overeenkomend met de preview op de C64:** de preview leest de tabel **lineair,
in een lus van 0 → N-1 → 0, één waarde per frame**. Om dit exact te
reproduceren, moet u de tabel op dezelfde manier aansturen (de index één keer
per frame verhogen, terugspringen bij de lengte van de tabel). Een pingpong- of
gedeeltelijke weergave zal anders bewegen, ook al zijn de byte-waarden identiek.
Zie `samples/curve-new-demo.asm` voor een werkend 16-bits sprite-X-voorbeeld.

---

### Getallenomzetter

Een kleine **niet-modale** DEC/HEX/BIN-converter, die u kunt openen met de knop
in de werkbalk naast de D64 Editor (klik nogmaals of druk op Esc om te sluiten).
De knop blijft gemarkeerd zolang de converter wordt weergegeven. Hij blijft open
terwijl u het programma in elke modus bewerkt.

- Voer in een van de velden **DEC**, **HEX** of **BIN** een regel in. De andere
  twee velden volgen. Voorvoegsels `$`, `0x`, `%`, `0b` en scheidingstekens
  (spatie, `_`) worden geaccepteerd; een negatief decimaal getal wordt omgezet
  naar tweevoudig complement in de huidige breedte; ongeldige invoer wordt rood
  gemarkeerd.
- **8 / 16 bit** breedte — een waarde boven 255 schakelt automatisch over naar
  16 bit.
- **Bitsrij** — klik op een bit om deze te wisselen.
- De info-regel toont de **signed**-waarde en, in 16-bits modus, de **low**- en
  **high**-byte.
- **Kopieer** knoppen kopiëren de waarde met het bijbehorende voorvoegsel
  (`53280`, `$D020`, `%1101000000100000`).
- Sleep het venster aan de koptekst; het onthoudt de waarde, breedte en positie
  en wordt na een herstart opnieuw geopend als het open was toen je het venster
  afsloot.

---


*© 2026 Zsolt Tarczali — C64 Visuele Assembler*
