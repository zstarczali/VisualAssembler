# C64 Visuell Assembler — Användarmanual

**Version 2.6.6**

En visuell, blockbaserad 6502-assembler för Commodore 64. Bygg program genom att
dra och släppa instruktionsblock och se den genererade assemblern och
maskinkoden i realtid.

---

## Innehållsförteckning

- [C64 Visual Assembler — Användarmanual](#c64-visual-assembler--user-manual)
    - [Höjdpunkter i version 2.6.6](#version-266-highlights)
    - [Höjdpunkter i version 2.6.5](#version-265-highlights)
    - [Höjdpunkter i version 2.6.4](#version-264-highlights)
    - [Höjdpunkter i version 2.6.3](#version-263-highlights)
    - [Höjdpunkter i version 2.6.2](#version-262-highlights)
    - [Höjdpunkter i version 2.6.1](#version-261-highlights)
    - [Höjdpunkter i version 2.6.0](#version-260-highlights)
    - [Höjdpunkter i version 2.5.9](#version-259-highlights)
    - [Höjdpunkter i version 2.5.8](#version-258-highlights)
    - [Höjdpunkter i version 2.5.7](#version-257-highlights)
    - [Höjdpunkter i version 2.5.6](#version-256-highlights)
    - [Höjdpunkter i version 2.5.5](#version-255-highlights)
    - [Höjdpunkter i version 2.5.4](#version-254-highlights)
    - [Höjdpunkter i version 2.5.3](#version-253-highlights)
    - [Höjdpunkter i version 2.5.2](#version-252-highlights)
    - [Höjdpunkter i version 2.5.1](#version-251-highlights)
    - [Höjdpunkter i version 2.5.0](#version-250-highlights)
    - [Höjdpunkter i version 2.4.9](#version-249-highlights)
    - [Höjdpunkter i version 2.4.8](#version-248-highlights)
    - [Höjdpunkter i version 2.4.7](#version-247-highlights)
    - [Höjdpunkter i version 2.4.6](#version-246-highlights)
    - [Höjdpunkter i version 2.4.5](#version-245-highlights)
    - [Höjdpunkter i version 2.4.3](#version-243-highlights)
    - [Höjdpunkter i version 2.4.2](#version-242-highlights)
    - [Höjdpunkter i version 2.4.1](#version-241-highlights)
    - [Höjdpunkter i version 2.4.0](#version-240-highlights)
    - [Höjdpunkter i version 2.3.9](#version-239-highlights)
  - [Innehållsförteckning](#table-of-contents)
  - [1. Översikt över gränssnittet](#1-interface-overview)
  - [2. Blockpalett](#2-block-palette)
  - [3. Programområde](#3-program-area)
    - [Operandinmatning](#operand-input)
  - [4. ASM-vy](#4-asm-view)
    - [Utmatningslägen](#output-modes)
    - [Fliken Verktyg](#toolkit-tab)
    - [Fliken Alternativ](#options-tab)
    - [Klicka på en ASM-rad](#clicking-an-asm-line)
    - [ASM-radnummer](#asm-line-numbers)
    - [Kompileringsförloppsmodal](#compile-progress-modal)
  - [5. Inställningar \& Verktygsfält](#5-settings--toolbar)
    - [Versionskontroll](#version-control)
    - [Gratis och öppen källkod](#free-and-open-source)
    - [Rapportera ett fel](#reporting-a-bug)
    - [Minnesfönster och noll sidanvändning](#memory-window-and-zero-page-usage)
    - [Projektmallar](#project-templates)
    - [Byggprojekt](#build-project)
    - [Exempelprogram](#example-programs)
    - [Ladda .asm-fil (snabbreferens)](#load-asm-file-quick-reference)
      - [Importera parsningsanteckningar och bästa
        praxis](#import-parsing-notes-and-best-practices)
  - [UltimateBasic-läge](#ultimatebasic-mode)
    - [Öppnar UB-redigeraren](#opening-the-ub-editor)
    - [Redigeringsverktyg](#editor-tools)
    - [Projekt, flikar och startfiler](#projects-tabs-and-startup-files)
    - [Byggnad och diagnostik](#building-and-diagnostics)
    - [Kodstorlek per rad och tips](#code-size-per-line-and-hints)
    - [Löpning, D64 och Exomizer](#running-d64-and-exomizer)
    - [Felsökningssymboler och demontering](#debugger-symbols-and-disassembly)
    - [Ultimate Basic-manual och källa](#ultimate-basic-manual-and-source)
  - [6. Expertläge](#6-expert-mode)
    - [Växla lägen](#switching-modes)
    - [Redigerarens layout](#editor-layout)
    - [Verktygsfältsknappar](#toolbar-buttons)
    - [Cykelräkningar](#cycle-counts)
    - [Optimeringstips](#optimisation-hints)
    - [Fel vid markering](#error-highlighting)
    - [Syntaxmarkering](#syntax-highlight)
    - [Källformatering](#source-formatter)
    - [Projektpanel \& flikar](#project-panel--tabs)
    - [Flikfält](#tab-bar)
    - [ACME-läge](#acme-mode)
  - [7. Adresseringslägen](#7-addressing-modes)
    - [Märk uttryck som operander](#label-expressions-as-operands)
    - [Programräknaren `*` i uttryck](#the--program-counter-in-expressions)
    - [Lokala (prickade) etiketter](#local-dotted-labels)
    - [Operandetiketter för självmodifierande
      kod](#self-modifying-code-operand-labels)
  - [8. Standard 6502-instruktioner](#8-standard-6502-instructions)
    - [Dataförflyttning](#data-movement)
    - [Aritmetik](#arithmetic)
    - [Logik](#logic)
    - [Hopp \& grenar](#jumps--branches)
    - [LBNE / LBEQ / … (Långa grenar)](#lbne--lbeq---long-branches)
    - [Registrera operationer](#register-operations)
    - [Skift \& Rotera](#shift--rotate)
    - [Stack](#stack)
    - [System / Flaggor](#system--flags)
    - [Olagliga/Odokumenterade
      instruktioner](#illegal--undocumented-instructions)
  - [9. Makroblock — Referens](#9-macro-blocks--reference)
    - [ETIKETT](#label)
    - [KOMMENTAR](#comment)
    - [BYTE](#byte)
    - [ORD](#word)
    - [FYLL](#fill)
    - [JUSTERA](#align)
    - [TEXT](#text)
    - [STRING](#string)
    - [DATA](#data)
    - [RAWBYTES](#rawbytes)
    - [RÅTEXT](#rawtext)
    - [PETSCII](#petscii)
    - [TECKENSÄTTNING](#charset)
    - [CHARDEF](#chardef)
    - [BOX_HIT](#box_hit)
    - [INCBIN](#incbin)
    - [KOALA](#koala)
    - [NIVÅ / NIVÅ\RAD](#level--level_row)
      - [NIVÅ](#level)
      - [NIVÅ\RAD](#level_row)
    - [SID](#sid)
    - [SID_PLAYER](#sid_player)
    - [INKLUDERA](#include)
    - [TABELL](#table)
    - [ORG](#org)
    - [LOOP / NÄSTA](#loop--next)
      - [LOOP](#loop)
      - [NÄSTA](#next)
    - [FÖR / SLUT](#for--endf)
      - [FÖR](#for)
      - [SLUT](#endf)
    - [TRYCK / DRA](#push--pull)
      - [TRYCK](#push)
      - [DRA](#pull)
    - [SLUT / RTS-alias](#end--rts-alias)
    - [MAKRO / SLUT / ANROPA](#macro--endm--invoke)
      - [MAKRO (definitionsstart)](#macro-definition-start)
      - [ENDM (definitionsslut)](#endm-definition-end)
      - [ANROPA](#invoke)
    - [REGION / ENDREGION](#region--endregion)
    - [DEFINE / IF / ELSE / ENDIF](#define--if--else--endif)
    - [.ASSERT](#assert)
      - [DEFINERA](#define)
      - [OM](#if)
      - [ANNARS](#else)
    - [ENDIF](#endif)
    - [KONSTANT](#const)
    - [VAR](#var)
    - [Körtid IF / ELSE / ENDIF](#runtime-if--else--endif)
    - [MEDA / SLUT](#while--endw)
    - [UPPREPA / TILLS](#repeat--until)
    - [MEMCPY / MEMSET](#memcpy--memset)
    - [UTSKRIFT / PRINT_CHAR / PRINT_HEX / CLEAR_SCREEN / VÄNTA_KEY /
      FÖRDRÖJNING / SET_BORDER /
      SET_BG](#print--print_char--print_hex--clear_screen--wait_key--delay--set_border--set_bg)
    - [IRQ_SETUP](#irq_setup)
    - [RAND](#rand)
    - [SPRITE\_INIT](#sprite_init)
    - [SPRITE\_POS](#sprite_pos)
    - [VÄNTA\_RASTER](#wait_raster)
    - [JOYSTICK](#joystick)
    - [MUS](#mouse)
    - [SPRITE\_COL](#sprite_col)
    - [LADDA FIL](#loadfile)
    - [EXODECRUNCH](#exodecrunch)
    - [REU\_CHECK](#reu_check)
    - [REU\_STASH / REU\_FETCH / REU\_SWAP](#reu_stash--reu_fetch--reu_swap)
    - [TURBO\_SET](#turbo_set)
    - [SUPERCPU\DETEKTERING](#supercpu_detect)
    - [TURBO\_AKTIVERA](#turbo_enable)
    - [KARTA\_KOPIA](#map_copy)
    - [KARTA\_KOPIA16X16](#map_copy16x16)
    - [SPRITE\_ANIM](#sprite_anim)
    - [POÄNG\_BCD](#score_bcd)
  - [10. Integrering av felsökare](#10-debugger-integration)
    - [RetroDebugger](#retrodebugger)
    - [Brytpunktsblock](#breakpoint-blocks)
    - [Felsökningsflaggor (fliken Alternativ)](#debugger-flags-options-tab)
    - [VICE Monitor (hot reload, live-bevakning,
      profilerare)](#vice-monitor-hot-reload-live-watch-profiler)
  - [11. Länkar till kunskapsbasen](#11-knowledge-base-links)
  - [12. D64 Exportera \& Kör](#12-d64-export--run)
    - [Knapp för delad körning](#split-run-button)
    - [Dialogruta för export till D64](#export-to-d64-dialog)
    - [D64-metadata i projekt](#d64-metadata-in-projects)
  - [12b. CRT-export (Magic Desk
    64K-kassett)](#12b-crt-export-magic-desk-64k-cartridge)
  - [13. Maskinvaruinställningar](#13-hardware-settings)
    - [VICE-emulator](#vice-emulator)
    - [Exomizer](#exomizer)
    - [Retro-felsökare](#retro-debugger)
    - [C64 Ultimate / 1541 Ultimate](#c64-ultimate--1541-ultimate)
    - [Kung Fu Flash 2](#kung-fu-flash-2)
  - [14. Visuella redigerare (verktygslåda)](#14-visual-editors-toolkit)
    - [Högupplöst/Flerfärgsredigerare](#hi-res--multicolor-editor)
    - [Sprite-redigerare](#sprite-editor)
    - [C64 Tecken-ROM-läsare
      ("Teckenkarta")](#c64-character-rom-browser-char-map)
    - [Teckenredigerare (teckenuppsättning)](#character-editor-charset)
    - [Teckenuppsättning Canvas-redigerare](#charset-canvas-editor)
    - [Kartredigerare (Flerskiktade
      kakelkartor)](#map-editor-multilayer-tilemaps)
    - [Nivåredigerare](#level-editor)
    - [SID-redigerare (3-röstsspårare)](#sid-editor-3-voice-tracker)
    - [SID-spelare](#sid-player)
    - [Kurvredigerare](#curve-editor)
    - [Tabellgenerator](#table-generator)
    - [Nummeromvandlare](#number-converter)

---

## Höjdpunkter i version 2.6.6

- **SID-spelarmakro** — `.sid_player [subtune][, raster]` (**SID_PLAYER** i
  paletten) spelar melodin från `.sid`-makrot: det anropar init-rutinen med
  subtunen, stänger av CIA1-timerns IRQ, kopplar en raster-IRQ och anropar
  uppspelningsrutinen varje bildruta från dess inbyggda hanterare. Ett program
  med musik är nu `.sid "music.sid"` + `.sid_player`. Se
  [SID_PLAYER](#sid_player).
- **SID-etiketter** — makrot `.sid` definierar `SID_LOAD`, `SID_INIT` och
  `SID_PLAY`, flyttade tillsammans med en anpassad laddningsadress, så att din
  egen IRQ-hanterare kan skriva `JSR SID_PLAY`. Se [SID](#sid).
- **Endast expertläge** — **Projektinställningar** har en brytare som stänger
  blockläget för projektets filer, oavsett storlek (sparade i `.proj`). Se
  [Projektpanel och flikar](#project-panel--tabs).
- **SID Player-buffert** — **Inställningar → Allmänt → SID-förhandsvisning → SID
  Player-buffert** ställer in 2048–16384 samplingar; en större buffert stoppar
  krackeleringen när appen är upptagen. WebSID använder den efter en omstart, VA
  SID Core renderar 10 / 15 / 20 / 30 sekunder före. Se [SID
  Player](#sid-player).
- **Anpassad C64-palett** — **Inställningar → Allmänt → Redigerare → Redigera
  anpassad palett…** ställer in ditt eget RGB-värde för var och en av de 16
  färgerna, med utgångspunkt från valfri inbyggd palett; importera en Photoshop
  `.act`, VICE `.vpl`, GIMP `.gpl`-palett eller en lista med hexagonala färger,
  exportera `.act` / `.vpl`. Se [14. Visuella redigerare
  (verktygslåda)](#14-visual-editors-toolkit).
- **Titta** — C64-minnespanelens dockningsstation är tillbaka hopfälld; fönstren
  Nyheter, Uppdatera, Inställningar och Kunskapsbas har samma ram som rutan Om;
  kryssrutorna för Projektinställningar är VA-växlar.
- **Åtgärdar** — felrapporten accepterar PNG- och JPG-skärmdumpar i den utgivna
  versionen; den blinkande markören efter `READY.` på välkomstskärmen är en
  heldragen C64-cell, utan de linjer som macOS ritade på den; macOS
  inline-prediktiv text är avstängd i Expert- och Ultimate Basic-redigerarna.

---

## Höjdpunkter i version 2.6.5

- **KickAssembler-projekt** — **Meny → Program → Importera Kick-projekt…** tar
  ett helt KickAssembler-källkodsträd (huvudfilen med dess `#import`-moduler och
  `.import binär`-resurser) och skriver en `.proj` bredvid det; källorna stannar
  där de är. Visual Assembler bygger det med sin egen assembler, byte för byte
  som KickAssembler 5.25 — Run, Build PRG / D64 / CRT, Exomizer, Debug, VICE
  Monitor och Build-projektet fungerar alla, fel namnger `file:line`, och hela
  trädet kontrolleras medan du skriver. Dark Chambers C64-porten och alla elva
  KickAssembler-exempelprogram med kodbyggs identiskt. Se [Kick-projekt
  (Importera Kick-projekt…)](#kick-projects-import-kick-project).
- **Projektinställningar** — kugghjulsknappen i projektpanelen (eller **Meny →
  Arkiv → Projektinställningar…**) visar och redigerar namn, startfil,
  assembler, KickAssembler-kompatibilitet, `#define`-symboler och `cmdLineVars`
  för ett projekt. Se [Projektpanel och flikar](#project-panel--tabs).
- **Kick-kompatibel omkopplare** — knappen `{K}` i projektpanelens rubrik gör
  alla VMA-projekt KickAssembler-kompatibla; VA-makron och direktiv fortsätter
  att fungera bredvid KickAssembler-skriptet.
- **KickAssembler-språk** — `#import` / `#importonce` / `#importif`, `#define` /
  `#if`, `.const` / `.label` (noll sida eller absolut värde), `.for`, `.while`,
  `.if … else`, `.var` / `.eval`, `.function`, `.macro { }`, `.pseudocommand`,
  multi-labels, scopes och namnrymder, `.pseudopc`, `.import binary`,
  `LoadBinary` (med mallar som `BF_KOALA`), `LoadSid`, `virtuella` minnesblock,
  `cmdLineVars`, `BasicUpstart2`, `List` / `Hashtable` / `.struct` / strings,
  `.enum`, matematikbiblioteket, färg- och opkodkonstanterna, `*` som
  programräknare, `;` mellan satser, `.error` / `.errorif`.
- **Bygginfo i kolumner** — ett bredare fönster: ursprung, slut, storlek och
  segmentantal överst, sedan segment, fel och `.print` utdata, och etiketter,
  konstanter och makron i kolumner. I ett Kick-projekt visas det byggda trädet,
  inre etiketter som `scope.label`.
- **C64 färgpalett** — **Inställningar → Allmänt → Redigerare → C64 färgpalett**
  ställer in RGB-värdena för de 16 C64-färgerna i varje editor (sprite,
  karaktär, Charset Canvas, Hi-Res, karta, nivå, Toolkit-färgrutor):
  **Colodore** som standard (närmast en riktig C64), eller Pepto, VICE, Deekay,
  C64 Wiki / Godot. Endast visningen ändras; importen av högupplösta bilder
  använder den också. Se [14. Visuella redigerare
  (verktyg)](#14-visual-editors-toolkit).
- **Färgväljare** — redigerarna för högupplöst, Sprite, tecken (flerfärgat) och
  teckenuppsättning Canvas har ett färgväljarverktyg; **Alt+klicka** väljer
  färgen med valfritt verktyg. Se [Högupplöst/flerfärgat
  redigerare](#hi-res--multicolor-editor).
- **Ctrl + zoomhjul ** i redigerarna för högupplöst raster, Sprite, kartor och
  nivåer, runt markören. Växeln för högupplöst raster sitter bredvid rutnät.
- **ACME-läge** — minneskartan och överlappningsvarningen följer ACME-bygget;
  ett ACME-projekt bygger sin startfil; ACME-mallarna visas bara när en
  fungerande ACME är inställd, och om man skapar ett ACME-projekt växlar
  inställningarna till ACME-läge. Se [ACME-läge](#acme-mode).
- **Nytt projekt** — **Nytt projekt från mallen…** finns under **Nytt projekt**
  i menyn (de tre separata posterna är borta); Visual
  Assembler-spritemultiplexermallen skriver ut sin titel.
- **Åtgärdar** — `.byte` / `.word` med etikettuttryck (`<(etikett+1)`, `.word
  etikett` före etiketten) monteras inte längre till 0; de ogiltigförklarade
  `NOP`-formerna som läser en operand monteras (se [Olagliga/Odokumenterade
  instruktioner](#illegal--undocumented-instructions)); knappen Ultimate Basic
  öppnar läser **Ladda .ub-fil** på alla språk.

---

## Höjdpunkter i version 2.6.4

- **ACME-assemblerläge** — **Inställningar → Allmänt → Assemblerläge** växlar
  mellan *VMA-läge* (den inbyggda Visual Assembler-assembleren) och *ACME-läge*:
  Expertkällkoden är byggd av ACME 0.97, och Kör, Bygg, panelerna
  Demontering/Övervakning, felsökarsymbolerna, cykelantal, optimeringstips och
  VICE Monitor använder alla den verkliga ACME-utdatan. Se
  [ACME-läge](#acme-mode).
- **Better Kick Assembler import** — menyposten i Program är nu **Kick import**.
  Vanliga `.text "…"` rader följer `.encoding`, `.label NAME = * + N` placerar
  en etikett inuti en instruktion, och de mnemoniska suffixen `.abs` / `.zp`
  tvingar fram adresseringsläget. Restore64 disassemblerar byggandet byte för
  byte som KickAssembler. Se [Kick import (Kick
  Assembler)](#kick-import-kick-assembler).
- **Kör startar program under BASIC-raden** — ett program som laddas under eller
  tvärs över BASIC SYS-raden får en liten startladdare; en lägre ORG senare i
  källkoden flyttas inte längre upp till startadressen. Se raden **BASIC
  SYS-stub** i [Inställningar och verktygsfält](#5-settings--toolbar).
- **Exomizer** — ett pressat program ger inte längre `?SYNTAX ERROR` vid andra
  körningen: en PRG med en BASIC-rad packas med `sfx basic`, vilken annan som
  helst med `sfx $<load address>`.
- **SID-redigerare** — en uppspelnings-LCD i spårarens verktygsfält
  (låtposition, mönster, rad, tid; grön eller röd i **Inställningar →
  SID-förhandsvisning → LCD-färg**), en instrumentknapp med en LCD på VA-VK, en
  förloppsindikator för **Importera .sid…**. Se
  [SID-redigerare](#sid-editor-3-voice-tracker).
- **Inställningar i tre flikar ** — **Allmänt **, **Filer och sökvägar ** och
  **Integrationer **. Se [Avsnitt 13](#13-hardware-settings).
- **Mindre förbättringar** — **Ctrl+N** öppnar en ny flik; dialogtext kan inte
  längre väljas av misstag (textfält och kopierbar utdata, såsom
  kompileringsfel, kan fortfarande göra det); stora expertkällor redigeras
  snabbare; `LSR A` och `JMP ($nnnn)` importeras korrekt; kunskapsbasen länkar
  Restore64 (restore64.dev), som omvandlar en C64 PRG till KickAssembler /
  ACME-källa för **Kick import** eller ACME-läge. En ACME-källa med ett segment
  under `$0801` (en minnesdump) flyttas inte längre bakom BASIC SYS-raden: den
  bygger på sina egna adresser och får startladdaren.

---

## Höjdpunkter i version 2.6.3

- **.sid import i SID Editor** — **Filer → Importera .sid…** omvandlar vilken
  PSID/RSID-låt som helst till instrument, mönster och en låt som du kan
  redigera: toner och legato-toner, rader placerade exakt på noterna (funktempo
  och swing genom `F` hastighetsändringar), wave-/arpeggio-tabeller med
  trumattacker med fast tonhöjd, puls- och filterrörelser, gate-timing och
  vibrato. Se [SID Editor](#sid-editor-3-voice-tracker).
- **Långa melodier spelas korrekt** — när melodidatan inte får plats bredvid
  spelaren vid `$C000`, flyttas den till ett eget segment under `$A000` istället
  för att köras in i I/O; `.sid`-exporten följer.
- **VA SID Core-förhandsvisning omaktiverar toner** — en ton som startas om
  under en hållen grind får en ny attack, precis som på den riktiga spelaren.
- **SID-redigerare** — rubriken visar den aktiva SID-emuleringen (WebSID eller
  VA SID Core med chipmodellen); fältet Speed har − / + knappar och tar 1–255;
  låten kan använda upp till 256 mönster.
- **Inställning för uppdateringsserver** — **Inställningar → Uppdateringar**
  ställer in servern som uppdateringar i appen läser utgåvor från (standard
  `https://www.c64va.pro/`). Se [Uppdateringar i appen](#in-app-updates).
- **Ultimate Basic 1.6.6** — `UTSKRIFT MED "format"; värden`, strängjämförelse i
  PETSCII-ordning, flyttal `rnd` och `mod`, flyttal i IRQ/NMI-hanterare,
  `alternativet grundläggande utskrift` för C64 BASIC PRINT-avstånd, mindre
  program (endast flyttalrutinerna används) och 16-bitars adressuttryck (1.6.5).
  Ultimate Basic-redigeraren markerar `utskrift med` och `alternativet
  grundläggande utskrift`.

---

## Höjdpunkter i version 2.6.2

- **HVSC i SID-spelaren** — sök i High Voltage SID-samlingen (cirka 61 000
  låtar) efter titel, kompositör eller mapp, spela upp, lägg till i spellistan
  eller spara valfri låt; ladda ner hela samlingen på en gång för
  offline-användning, eller peka spelaren mot en uppackad HVSC-mapp. Låtar från
  HVSC får sin verkliga längd i sökfältet och spellistan går vidare när en
  underlåt slutar. Se [HVSC (High Voltage SID
  Collection)](#hvsc-high-voltage-sid-collection).
- **Spektranalysator** — en flytande LED-barvisualiseringsverktyg för SID Player
  med 8 till 32 band, blekande celler och ett speglat golv. Se
  [Spektranalysator](#spectrum-analyzer).
- **Lektionsredigerare** — förvandla ditt eget program till en
  steg-för-steg-guidad lektion som den inbyggda "Bygg: Ditt första textprogram":
  lägg till förklaringar, välj mappen, prova det, spara det, exportera/importera
  `.vatut`-filer. Se [Handledningar och
  lektionsredigeraren](#tutorials-and-the-lesson-editor).
- **Onlinelektioner** — ladda ner lektioner publicerade på www.c64va.pro direkt
  till listan över handledningar, med uppdateringar, och ladda upp dina egna
  från lektionsredigeraren för granskning. Se
  [Onlinelektioner](#online-lessons).
- **Varje makro tar sina parametrar i operandfältet** — `SET_BG $06`, `REGION
  Main`, `ORG $C000`, `SPRITE_POS 1, 200, 50` …: texten läses som makrots
  expertrad, och fältet visar den förväntade formen. Se [Parametrar i
  operandfältet](#parameters-in-the-operand-field).
- **Mindre förbättringar** — det aktiva flytande fönstret är markerat,
  supportfönstret ser ut som en chatt, mushjulet rullar flikfältet i sidled och
  kolumnen Ultimate Basic-kodstorlek täcker inte längre radnumren.

---

## Höjdpunkter i version 2.6.1

- **Cykelantal i expertläge** — en marginal visar cyklerna för varje
  instruktion, det totala antalet urval och hur många rasterlinjer det tar. Se
  [Cykelantal](#cycle-counts).
- **Optimeringstips** — Expertredigeraren markerar rader som kan vara kortare
  eller snabbare (tail call, redundant `CMP #0`, omladdningar, `INC` / `DEC`
  idiom…). Se [Optimeringstips](#optimisation-hints).
- **Tabellgenerator** — skärm-/bitmappsradadresser, pixelmasker,
  multiplikations-/divisionstabeller, kvartskvadrater, logaritmisk/exp-analys,
  bitomvändning, anpassade uttryck och utrullad
  fyllnings-/kopieringshastighetskod. Se [Tabellgenerator](#table-generator).
- **VICE Monitor** — snabb omladdning till den VICE som körs, liveövervakning av
  etiketter och adresser och en PC-samplingsprofilerare. Se [VICE
  Monitor](#vice-monitor-hot-reload-live-watch-profiler).
- ** Karta över noll sidanvändning ** och ett ** löstagbart minnesfönster **. Se
  [Minnesfönster och noll sidanvändning](#memory-window-and-zero-page-usage).
- **Ultimate Basic** — kodstorlek per rad, tips och Sprite Editor → Ultimate
  Basic-export med animering.
- **SID-redigerare → .sid (PSID) export** och en
  **sprite-multiplexer**-projektmall (16 sprites).
- Flera flytande fönster kan vara öppna samtidigt; det du klickar på kommer
  fram.

---

## Höjdpunkter i version 2.6.0

- **Visual Assembler är nu helt gratis** — Freemium/Professional-licensen har
  tagits bort. Varje redigerings-, bygg- och hårdvarukörningsalternativ, alla 7
  UI-språk och alla teman fungerar för alla, utan registrering eller en
  serieversion. Anledningen är enkel: enligt ungerska skatteregler skulle det
  vara värt att sälja programmet för lite efter skatt och pappersarbete.
  Serieversioner som du redan har behövs helt enkelt inte längre. Se [Gratis och
  öppen källkod](#free-and-open-source).

---

## Höjdpunkter i version 2.5.9

- **Commodore 64-tema** — C64:s startskärm: en ljusblå ram runt blå paneler,
  ljusblå text, knappar för omvänd video, syntaxfärger från C64-paletten och
  C64-teckensnittet i monitorvyn.
- **Commodore Beige-tema** — den klassiska brödlådan: beige hölje, senapsfärgade
  funktionsknappar, regnbågsfärgade ränder och en C64-blå skärmvy. Välj det i
  temaväljaren eller växla till det med temaknappen. Se [Inställningar och
  verktygsfält](#5-settings--toolbar).
- **Commodore Starlight-tema** — ett ljust tema efter den genomskinliga
  C64-brödlådan: frostat klart glas med regnbågens RGB-glöd som lyser igenom, en
  magenta accent, regnbågens syntaxfärger och en rökig mörk skärmvy.
- **Dialogruta för versionskontroll** — dialogrutan kan dras i rubriken och
  öppnas igen där du lämnade den; den stannar kvar på skärmen när loggen eller
  en diff gör den högre, och ett klick utanför stänger den inte längre (Esc gör
  det). Se [Versionskontroll](#version-control).
- **Versionskontroll på projektnivå** — för en flik i ett öppet `.proj`-projekt,
  committar en **Fil / Projekt**-växel varje källfil i projektet (projektträd +
  inkluderade filer) i en post. Loggen listar de ändrade filerna för varje
  commit, Diff arbetar fil för fil, Checkout återställer alla filer till
  redigeringsflikarna och autospara-poster görs också per projekt. I Git-läge
  täcker loggen och diff hela arkivet. Se [Projektläge](#project-mode).

---

## Höjdpunkter i version 2.5.8

- **Versionskontroll** — projektets snapshots blev en git-liknande
  versionskontroll: commits med ett meddelande och en kort hash, en logg med
  **HEAD**, en **Diff** mot arbetskopian, **Checkout** i redigeraren och
  separata poster för automatisk sparning. Blocklägesprogram (JSON) jämförs som
  monteringslinjer, så diff:en visar verkliga förändringar. Fungerar på flikarna
  Block, Expert och Ultimate Basic. Se [Versionskontroll](#version-control).
- **Git-integration** — välj `git.exe` i **Inställningar → Versionshantering**
  (eller låt appen hitta det). När projektet finns i ett git-arkiv visar
  dialogrutan grenen, de ändrade filerna, commit (sparar först), logg, diff med
  en **RAW**-vy, utcheckning, **Pull** / **Push** och **git init**.
- **Rapportera fel** — ett inbyggt rapportformulär med upp till fyra skärmdumpar
  (fil, Ctrl+V eller dra och släpp), valfri e-post, systeminformation och de
  senaste appfelen. Se [Rapportera ett fel](#reporting-a-bug).
- **SID-spelare** — **Blanda** och **favoriter** (★) per låt. Se
  [SID-spelare](#sid-player).

---

## Höjdpunkter i version 2.5.7

- **VA SID Core 1.2** — SID Player använder nu en inbyggd Rust C64-kärna: en
  cykelexakt 6510 med exakt avbrottstid, CIA 6526A, VIC-II-timing med dåliga
  linjer, sprite DMA och rasteravbrott, och 6510 I/O-porten. Se [SID
  Player](#sid-player).
- **Högupplöst redigerare** — två färger i varje 8×8-cell: det nya verktyget
  **Cellpapper**. Se [Högupplöst /
  Flerfärgsredigerare](#hi-res--multicolor-editor).
- **Exakt karaktärs-ROM** i ROM-visaren, karaktärsredigerarens **Ladda ROM** och
  kart-/nivåredigerarna.
- **Sprite Editor** — högupplöst överlägg, fyllnadseffekt, markera/flytta,
  rotera, spegla allt, importera sprite-ark, träffruta, X/Y
  ×2-förhandsgranskning. Se [Sprite Editor](#sprite-editor).
- **Nivåredigerare** — objekt, karaktärsattribut, kantkontroll, färger per
  skärm, minnesmätare med RLE, Kör i VICE. Se [Nivåredigerare](#level-editor).
- **Teckenredigerare** — ångra/gör om, ritverktyg, rotera 90°, kopiera/klistra
  in och dra-för-att-växla på kartan, 2×2-rutor, ROM-uppsättning med gemener,
  förhandsgranskning av text och export av intervall. Se
  [Teckenredigerare](#character-editor-charset).
- **Teckenuppsättning Canvas** — zooma 2×–24× (skjutreglage eller Ctrl+hjul) med
  ett pixelrutnät, bakgrundsfärg i högupplöst läge, högupplösta tecken i
  flerfärgsläge och **ECM** (en bakgrund per tecken). Se [Teckenuppsättning
  Canvas-redigerare](#charset-canvas-editor).

---

## Höjdpunkter i version 2.5.6

- **SID Player** — en ny verktygsfältsknapp öppnar en flytande spelare för
  `.sid` (PSID / RSID) låtar: en spellista med dra och släpp, föregående / nästa
  låt, undermelodier, sökning och ±10 s, volym och spara / öppna spellista
  (`.sidpl`); listan och fönstrets tillstånd sparas. Se [SID
  Player](#sid-player).
- **VA SID Core 1.1** — en inbyggd SID-emulering (MOS 6581/8580, med ett MOS
  6581/8580-baserat 6581-filter) och en cykellåst PSID/RSID-spelare (6510 CPU,
  CIA/VIC-timing). Välj det i **Inställningar → SID-förhandsgranskning**;
  SID-spelaren visar vilken motor som spelar.
- **SID-redigerare** — rattar för instrumentparametrarna, en bredare ADSR-graf,
  **MIDI-ingång**, **inspelning** i spåraren (ett nytt mönster läggs till när
  det nuvarande är fullt), en **metronom** med taktslagslampor,
  **mönsterborttagning**, mastervolymen på VA-VK och **Importera GoatTracker
  .sng**. Se [SID-redigerare](#sid-editor-3-voice-tracker).
- **Ultimate Basic 1.6.4** medföljer.

---

## Höjdpunkter i version 2.5.5

- **Högupplöst redigerare: pixelrutnät och 16× zoom** — med **Rutnät** aktiverat
  får varje pixel från 4× zoom sin egen rutnätslinje, starkare längs
  tecken-cellskanterna och skuggad för att förbli synlig på alla 16 färger.
  Zoomreglaget går nu upp till 16×. Se [Högupplöst /
  Flerfärgsredigerare](#hi-res--multicolor-editor).
- **Högerklicka på Kopiera / Klistra in-menyn ** — på arbetsytan i högupplösta
  och kartredigeraren (Kopiera, Klistra in, Transparent klistra in) och i
  Sprite-redigeraren (Kopiera ram, Klistra in ram, även på ramremsan). En
  inklistring startade från menyförhandsvisningarna där du klickade.
- **Nummerkonverterare** — dess verktygsfältsknapp förblir markerad medan
  konverteraren visas.
- **Åtgärdat** — det flerfärgade cellrutnätet i högupplösta redigeraren var
  dubbelt så brett som en teckencell; knappen **Klistra in** i högupplösta
  verktygsfältet klistrades alltid in transparent; högerklicksmenyn i
  SID-redigeraren öppnades bort från markören medan dialogrutan var centrerad.
- **Denna manual** — markering, kopiera/klistra in och transparent klistra in i
  högupplösta redigeraren beskrivs nu.

---

## Höjdpunkter i version 2.5.4

- **Åtgärdat: fönstret visas inte vid omstart** — om appen avslutades med
  fönstret minimerat eller dolt (mestadels på macOS, även på Linux / Wayland),
  kunde nästa start komma utan ett fönster. Det synliga läget sparas inte längre
  (fönstrets storlek gör det fortfarande), och fönstret visas alltid vid start.
- **Ultimate Basic 1.6.3 paketerad** — QBasic-stilsyntax: `dim namn som typ` för
  variabler och för arrayer av alla typer, `funktion` / `sub` med `som` typer,
  `elseif`, `do … loop`, `medan … wend`, `select case`, `exit do` / `exit sub`,
  enradig `if`, `'` kommentarer och `skriv ut a; b; c`; körtidssträngar (`+`,
  `left$` / `right$` / `mid$`) och signerat 16-bitars `heltal`. Markerad, ifylld
  och formaterad i UB-redigeraren, med nya poster **DIM**, **FUNCTION**,
  **ELSEIF**, **DO**, **WEND**, **SELECT CASE**, **END**, **EXIT SUB** och
  **LEFT$** / **RIGHT$** / **MID$** i kommandopanelen. Se [UltimateBasic
  Mode](#ultimatebasic-mode).

---

## Höjdpunkter i version 2.5.2

- **SID Editor förhandsgranskningar på det riktiga SID:et** —
  instrumentförhandsgranskning, virtuellt tangentbord, notinmatning,
  ackord/arpeggio, rad- och enkelmönsteruppspelning via WebSid; synthesizern
  finns bara kvar som reserv. Se [SID Editor]{1}.

---

## Höjdpunkter i version 2.5.1

- **SID Editor-instrument** — filterrouting per röst, **3 OFF** och en resonant
  cutoff **sweep** (start, slut, hastighet, ping-pong); instrument **vibrato**
  (delay, hastighet, djup); **pulsbreddsmodulering**; **gatetimer**, **hård
  omstart** och första bildrutans vågform; en **våg-/arpeggiotabell** med
  förinställningar; **RING** och **SYNC**. Se [SID
  Editor](#sid-editor-3-voice-tracker).
- **Ny SID-spelare** — den exporterade spelaren kör instrumentmoduleringen varje
  bildruta (`JSR sid_frame` för din egen IRQ); förhandsgranskningen renderar
  samma spelare genom en liten SID-synthesizer. `.bin` sparar instrumentnamn och
  hastighet.
- ** Virtuellt tangentbord ** — 2, 3 eller 4 oktaver i ett Commodore
  64-syntutseende.
- **Ultimate Basic 1.6.2 medföljer** — `tune` får `imod`, `ifilt`, `igate` och
  `itab`; **Export till UltimateBasic** skriver dem.
- **Bokmärken och Gå till rad** i Expert- och Ultimate Basic-redigerarna —
  Ctrl+F2 / F2 / Shift+F2, Ctrl+G.
- **Åtgärdat: ** etikettuttryck (`.assert`, `LEVEL_MULTICOLOR*16`, `*`) fungerar
  igen i den installerade appen (ingen `eval` under den utgivna CSP:n).

---

## Höjdpunkter i version 2.5.0

- **Nivåredigerare** — en ny verktygsradsredigerare arrangerar kartredigerarens
  skärmar vertikalt, horisontellt eller i ett 2D-rutnät och förhandsgranskar
  hela nivån med smidig rullning. Se
  [Nivåredigerare](#sid-editor-3-voice-tracker).
- **LEVEL / LEVEL_ROW-makron** — `.level "level.bin"[, $addr]` placerar endast
  de placerade skärmarna i ett Level Editor-projekt plus pektabeller och
  definierar `LEVEL_*` etiketter och konstanter; `.level_row dst, col[, color]`
  kopierar en nivårad på 40 tecken till en buffert. Se [LEVEL / LEVEL_ROW]{1}.
- **JOYSTICK variabelläge** — `.joystickport, vx, vy[, fire]` skriver riktningen
  till variabler (−1 / 0 / +1) istället för att flytta en sprite; port `3` läser
  båda joystickportarna. Se [JOYSTICK]{1}.
- **Nivåskrollningsdemo** — `samples/level-demo.asm` skrollar en 2×5-skärm pixel
  för pixel i alla riktningar med joysticken, utan tearing, med plats kvar för
  sprites och spelkod.
- **Talkonverterare** — en icke-modal DEC / HEX / BIN-dialogruta i
  verktygsfältet. Se [Talkonverterare]{1}.
- **Exempeldialogruta ** — **Meny → Exempel… ** öppnar en sökbar, kategoriserad
  lista över de inbyggda exempelprogrammen. Se [Exempelprogram]{1}.
- **Ultimate Basic 1.6.1 medföljer** — `map load "level.bin"[, addr]` läser ett
  Level Editor-projekt direkt, och den nya `map view px, py` rullar kartan
  smidigt och utan tearing vid en pixelposition (exempel:
  `level_scroll_demo.ub`). En byteprodukt inuti en 16-bitars summa trunkeras
  inte längre till 8 bitar. UB-kommandoreferensen listar `map view`, och dess
  sökning placerar matchningar av kommandonamn först.

---

## Höjdpunkter i version 2.4.9

- **Projektmallar** — **Meny → Arkiv → Nytt projekt från mall…**, eller den nya
  verktygsfältsknappen mellan **Meny** och **Handledningar**, skapar ett färdigt
  `.proj`-projekt i en egen mapp. Dialogrutan har en **Assembler**-sektion (tomt
  program, spelskelett, anställningar och flerfärgad bitmapp) och en
  **UltimateBasic**-sektion (tomt program, spelskelett, anställningsbitmapp,
  raster-IRQ), med en syntaxmarkerad förhandsvisning. Dina egna `.asm` /
  `.ub`-mallar hämtas från mappen för användarmallar. Se
  [Projektmallar](#level-editor).
- **Bygg projekt** — **Meny → Bygg → Bygg projekt** kompilerar alla byggbara
  filer i det öppna projektet (eller i de öppna flikarna) till en `.prg` bredvid
  dess källkod, skriver felsökningssymbolfiler där sådana finns, hoppar över
  inkluderingsmoduler och visar en rapport per fil. Se [Bygg
  projekt](#level--level_row).
- **Ctrl + zoomning med mushjulet** i Expert- och Ultimate Basic-redigerarna
  (`Cmd ` + hjul på macOS; nypning med pekplattan fungerar också).
- **Arbetsytor kommer ihåg projekt** — Expert- och Ultimate Basic-projektträden,
  startfilen och osparade projektändringar sparas i `.vaws`-arbetsytan och
  återställs med den. Äldre arbetsytor är fortfarande öppna.
- **Ultimate Basic** — den medföljande kompilatorn genererar snabbare, mindre
  6502-kod; minneskartan skiljer nu åt riktig kod och data förutom utfyllnad och
  långa `org`-gap.
- **Fildialogrutor startar i den aktiva arbetsmappen** — Block/Expert-mappen
  eller Ultimate Basic-mappen, beroende på aktuellt läge.
- **Ultimate Basic 1.6.1 medföljer** — `map load "level.bin"[, addr]` läser ett
  Level Editor-projekt direkt, och den nya `map view px, py` rullar kartan
  smidigt och utan tearing vid en pixelposition (exempel:
  `level_scroll_demo.ub`). En byteprodukt inuti en 16-bitars summa trunkeras
  inte längre till 8 bitar. UB-kommandoreferensen listar `map view`, och dess
  sökning placerar matchningar av kommandonamn först.

---

## Höjdpunkter i version 2.4.8

- **Nytt KOALA-makro** — `.koala "picture.koa"` (valfritt `, $2000`) laddar en
  Koala Painter-bild och visar den med en 86-byte-visningsrutin. Se
  [KOALA](#project-templates).
- **Koala import/export i Hires-redigeraren** — **Filer → Importera Koala
  (.koa)…** / **Exportera Koala (.koa)…** (standard 10003-byte-fil; högupplösta
  bilder reduceras till flerfärgade vid export). `.koa` / `.kla` känns också
  igen av **Importera bild / .bin**.
- **Ultimate Basic 1.5.9 medföljer** — ny `kedja "FIL" [, enhet]` (ladda ett
  annat program över det som körs och KÖR det); `ladda "FIL"` laddar till filens
  egen adress, `ladda "FIL", addr` till `addr`; D64 åtgärdar. `kedja` är
  markerad och listad i kommandoreferensen.
- **Uppdateringsstatus i expertstatusfältet** — samma *Uppdaterad * / klickbara
  *Uppdatering tillgänglig *-indikator som i Ultimate Basic-läget.
- **Spara-dialogrutor** erbjuder filens egen typ (t.ex. *KOA*) istället för
  *Binär (\*.bin)*.
- **Mer robust uppdateringskontroll** — installationslistan publiceras på
  c64va.tech/downloads/VA/, så kontrollen fungerar med den nya
  nedladdningssidan; Linux-uppdateringshjälpen ärver inte längre
  AppImage-bibliotekets sökvägar.

---

## Höjdpunkter i version 2.4.7

- **Uppdateringar i appen** — **Meny → Sök efter uppdateringar** söker efter en
  nyare version i c64va.tech och laddar ner installationsprogrammet för din
  plattform med en förloppsindikator efter bekräftelse och installerar det. Se
  [Uppdateringar i appen](#koala). Kontrollen körs också tyst vid varje start.
- **Uppdateringsstatus i statusfältet för Ultimate Basic** — visar **Uppdaterad
  (vX)** eller en markerad **Uppdatering tillgänglig: vY** som öppnar
  uppdateringsdialogrutan när du klickar på den.
- **Kurvredigerare → UltimateBasic export** — **Filer → Exportera till
  UltimateBasic** skriver tabellen som en initialiserad UB-array; **Filer →
  Exportera UltimateBasic-demo** producerar en körklar UB-spritedemo. Se
  [Kurvredigerare]{1}.
- **Ultimate Basic 1.5.8 bundled** — den nya **`data <array>: v, …`**-formen
  fyller en deklarerad `array` / `array_word` vid programstart (ytterligare
  rader fortsätter där den föregående slutade, ordarrayer tar 16-bitarsvärden)
  utan att vidröra `read`-strömmen.
- **Layouten passar fönstret** — redigeringspanelerna tar exakt den återstående
  fönsterhöjden, så appen visar inte längre en vertikal rullningslist på
  sidnivå; ASM-utdatapanelen behåller en minsta bredd på 440 px; arbetsmappens
  sökväg sitter i en diskret markering ovanför ASM-vytiteln och använder samma
  markering i verktygsfälten Expert och Ultimate Basic. Etiketter för
  dialogknappar radbryts inte längre.
- **Mer robust uppdateringskontroll** — installationslistan publiceras på
  c64va.pro/downloads/VA/, så kontrollen fungerar med den nya nedladdningssidan;
  Linux-uppdateringshjälpen ärver inte längre AppImage-bibliotekets sökvägar.

---

## Höjdpunkter i version 2.4.6

- **Uppdateringar i appen** — **Meny → Sök efter uppdateringar** söker efter en
  nyare version i c64va.pro och laddar ner installationsprogrammet för din
  plattform med en förloppsindikator efter bekräftelse och installerar det. Se
  [Uppdateringar i appen](#in-app-updates). Kontrollen körs också tyst vid varje
  start.
- **Ultimate Basic-språkuppdatering** — syntaxmarkering och kommandoreferensen
  täcker nu **`sfx`** (icke-blockerande SID-effekt: `sfx-kanal, frekvens, frames
  [, wave]`), **`org`** (fortsätt sub-/fn-kod vid en adress, vilket lämnar ett
  nollfyllt mellanrum som kan innehålla `incbin`-data), **`charset on` /
  `charset off`** (växla VIC-II till RAM-teckenuppsättningen och tillbaka) och
  **`incbin` slicing** (`incbin "font.prg", $3C00, 2` hoppar över de första
  bytena, ett valfritt fjärde argument begränsar längden).
- **Markering av flera block i ASM-vyn** — om du väljer flera block markeras
  alla deras ASM-rader samtidigt, rullningspositionen förblir stabil medan du
  markerar och radnumren är mjukare med en subtil vertikal avgränsningsregel.
- **Assemblerläget bevaras över Ultimate Basic-switchar** — om du öppnar ett
  projekt eller ett inbyggt exempel medan Ultimate Basic är aktivt lämnas nu UB
  först och återgår till ditt senaste Block/Expert-läge, så UB-bufferten kan
  inte längre skriva över den nya flikens läge eller titel. Nya flikar skapas i
  rätt läge.
- **Kung Fu Flash 2-inställningar** — en **Identifiera USB**-knapp i
  maskinvaruinställningarna söker om efter kassettens serieport, och KFF2-kraven
  anger nu den nödvändiga Kung Fu Flash-firmwaren (v2.07+).
- **Ultimate Basic-kommandoreferens** — `tune` och `music` visar fullständiga,
  kommenterade exempel (cellformat, effekter, spelarnoter, `musikuppspelning
  N`); `inst`, `order`, `pat` och tune `speed` har sina egna poster; `data`
  visar den nya arrayformen; syntaxen `load sid` är korrigerad (`load sid
  "tune.sid", $2000`).

---

## Höjdpunkter i version 2.4.5

- **Kung Fu Flash 2-stöd — kör dina program på en riktig Commodore 64/128.** En
  ny **Kung Fu Flash 2**-post i den delade **Kör**-menyn kompilerar programmet
  och laddar upp det via USB direkt till en riktig, påslagen C64 (eller C128)
  utrustad med en Kung Fu Flash 2-kassett — ingen diskavbildning, ingen
  SD-kortkopiering, ingen emulator. Den fungerar i Block-, Expert- och Ultimate
  Basic-läge. Kassettens USB-serieport detekteras automatiskt (och kan skrivas
  in för hand); se [Kung Fu Flash 2]{1} för installation och det exakta
  arbetsflödet.
- **Anpassningsbara program-/ASM-paneler** — en tunn vertikal delare mellan
  programpanelen och ASM/utdatapanelen låter dig dra gränsen åt vänster eller
  höger (minst 260 px per panel). Piltangenterna knuffar den, dubbelklick
  återställer den till en 50/50-delning, och positionen sparas mellan sessioner.
  Delaren är dold i Expert- och Ultimate Basic-läge samt i den smala staplade
  layouten.
- **Renare makrorader i ASM-vyn** — makroblock listas nu utan den inledande
  kommentarmarkören (`.print "HELLO"`, `.if A == 1`, `.sprite_init …` istället
  för `; .print …`), och ASM-syntaxmarkören färglägger dem som makron. Vanliga
  KOMMENTARblock och regionmarkörer börjar fortfarande med `;`.
- **Anpassad makromarkering i expertredigeraren** — makronamnet efter `.macro`,
  `.invoke` och `.call` (och Kick-stil `:name(...)`-anrop) har sin egen färg,
  och det har även `{param}`-substitutionerna inuti makrotexten och
  parameternamnen i `.macro`-rubriken, i varje tema.
- **Uppdaterad Om-dialogruta** — en bredare layout med två kolumner med
  grupperade projekt-, licens- och kreditlänkar, och Ultimate Basic-bannern har
  nu en transparent bakgrund så att den smälter in i alla teman.

---

## Höjdpunkter i version 2.4.3

- **SID-redigeraren: Låt-/ordningslista** — mönster är nu ordnade genom en
  ordentlig låt-/ordningslista som placeras ovanpå den råa mönsterbanken, så att
  ett mönster kan upprepas och låten kan vara längre än antalet lagrade mönster.
  Lägg till, ta bort och ändra ordning på steg direkt från SID-redigeraren;
  uppspelning och den exporterade spelaren följer båda denna lista istället för
  den råa mönsterordningen.
- **SID-redigerare: Effektkolumn** — varje spårningscell kan nu bära en effekt
  bredvid sin not: **V**ibrato, slide **U**p / **D**own, not-**C**ut och
  hastighetsändring (**F**). Skriv det direkt i en cell, t.ex. `C-4 01 V24` (not
  + instrument + vibrato) eller `F06` (endast hastighetsändring). Effekter körs
  en gång per rad, matchar den exporterade spelaren, och spelas nu upp korrekt
  både i förhandsgranskningen av webbljud i appen och i den kompilerade
  6502-exporten — en riktig, spelbar effektmotor, inte bara exportscaffolding.
- **Bakåtkompatibelt SID-sparformat** — SID-sparningar har nu en versionsmarkör,
  så äldre `.bin`-sparningar som gjordes innan effektkolumnen fanns fortsätter
  att laddas exakt som tidigare, med effekter helt enkelt frånvarande.
- **D64 Editor: explicit spararbetsflöde** — varje redigering (lägg
  till/extrahera/byt namn/ta bort, och nu byte-redigeringar för Block Editor)
  sker på en privat arbetskopia; ingenting rör din riktiga `.d64`-fil förrän du
  klickar på **Spara**, vilket också skriver en automatisk säkerhetskopia först.
  Om du stänger editorn eller öppnar en annan disk med osparade ändringar frågas
  nu efter bekräftelse istället för att ignorera dem tyst.
- **D64 Editor: Block Editor hex-rutnät** — den råa bytevyn för det valda
  256-byte-blocket är nu ett korrekt hex-rutnät per byte istället för en vanlig
  textruta, och dess dialogruta tonar inte längre ner resten av appen bakom den
  när den är öppen.
- **Web64 på produktsidan** — en ny Web64 IDE-sektion på
  [c64va.pro](https://www.c64va.pro).
- **Exempeluppdatering** — exemplet `makro-med-parameter` använder nu formen
  `.makro setColor(färg)` inom parentes.

---

## Höjdpunkter i version 2.4.2

- **Dra och släpp till D64-redigeraren** — släpp en kompilerad `.prg`/`.bin`-fil
  (från SID/sprite/char-redigerarens exportfiler, eller någon annanstans) direkt
  till diskavbildningen; panelen Lägg till öppnas förifylld. Om du släpper flera
  filer samtidigt köas de en efter en.
- **Generera include-fil** — en ny knapp i verktygsfältet skriver en `.inc`-fil
  som listar `.const NAME = $ADDR` för varje post på disken, så att
  huvudprogrammet kan referera till var varje post hamnade utan att skriva om
  adresser manuellt.
- **Blockredigerare (ny)** — en verktygsfältsknapp växlar D64-redigeraren till
  rå spår-/sektoråtkomst under katalogen: en klickbar blockkarta (färgad av
  BAM:s lediga/använda bitmapp, med BAM och katalogkedjan markerade separat), en
  hexagonalvy/redigerare för det valda 256-byte-blocket och Föregående/Nästa
  sektornavigering. Läser och skriver diskavbildningen direkt
  (`läs_bin_fil`/`skriv_bin_fil`), oberoende av `c1541`.
- **D64 Editor: explicit spararbetsflöde** — varje redigering (lägg
  till/extrahera/byt namn/ta bort, och nu byte-redigeringar för Block Editor)
  sker på en privat arbetskopia; ingenting rör din riktiga `.d64`-fil förrän du
  klickar på **Spara**, vilket också skriver en automatisk säkerhetskopia först.
  Om du stänger editorn eller öppnar en annan disk med osparade ändringar frågas
  nu efter bekräftelse istället för att ignorera dem tyst.
- **D64 Editor: Block Editor hex-rutnät** — den råa bytevyn för det valda
  256-byte-blocket är nu ett korrekt hex-rutnät per byte istället för en vanlig
  textruta, och dess dialogruta tonar inte längre ner resten av appen bakom den
  när den är öppen.

---

## Höjdpunkter i version 2.4.1

- **Polska och italienska gränssnittsspråk** — fullständig
  gränssnittsöversättning (menyer, dialogrutor, mnemoniska beskrivningar,
  Ultimate Basic-kommandoreferens) tillsammans med befintliga ungerska,
  engelska, spanska, tyska och nederländska.
- **Knapp i verktygsfältet Onlinehjälp** — en ny ikonknapp efter Debug öppnar
  den flerspråkiga dokumentationssidan ([c64va.tech/docs.html]{1}) direkt från
  appen.
- **Centraliserade mnemoniska beskrivningar:** mnemoniska beskrivningar per
  språk flyttades till den delade översättningsfilen tillsammans med resten av
  UI-strängarna. Åtgärdar även ett långvarigt fel där de engelska
  beskrivningarna för `PRINT`, `PRINT_HEX`, `CLEAR_SCREEN`, `WAIT_KEY`,
  `SET_BORDER`, `SET_BG`, `IRQ_SETUP` och `RAND` tyst skrevs över av överbliven
  spansk text.

---

## Höjdpunkter i version 2.4.0

- **D64 Editor** — en komplett diskavbildningsläsare i verktygsfältet (efter
  kurvredigeraren). Öppna en befintlig `.d64`, skapa en ny tom disk eller starta
  den aktuella disken direkt i VICE, allt från en Filer ▾-meny som matchar de
  andra visuella redigerarna. Se [D64 Editor (bläddra bland och redigera en
  befintlig diskavbildning)]{1}.
- **Knapp i verktygsfältet Onlinehjälp** — en ny ikonknapp efter Debug öppnar
  den flerspråkiga dokumentationssidan
  ([c64va.pro/docs.html](https://www.c64va.pro/docs.html)) direkt från appen.
- **Ladda adress, dekomprimera adress och Exomizer i D64-redigeraren** — genom
  att lägga till en headerlös råfil kan du ange en valfri laddningsadress, ett
  Exomizer-dekomprimeringsmål och komprimera den på vägen in, med samma
  `mem`/`sfx` komprimeringslägen som i dialogrutan Exportera till D64:s
  extrafiler. En `.prg` som redan har sin egen header hoppar över dessa fält
  helt.

---

## Höjdpunkter i version 2.3.9

- **`*` i vilket uttryck som helst** — programräknarsymbolen fungerar nu inuti
  operanduttryck, inte bara på egen hand: `BNE *-5`, `JMP *+20`, `LDA #<*`, `LDA
  #>(*+63)`. Ett `*` som följer ett värde (`STRIDE*2`) är fortfarande
  multiplikation. Se [Adresseringslägen → Programräknaren `*` i
  uttryck](#d64-editor-browse--edit-an-existing-disk-image).
- **Lokala (prickade) etiketter** — en etikett som `.loop` tillhör omfånget för
  den närmaste föregående *globala* (icke-prickade) etiketten, så `DrawSprite`
  och `ClearScreen` kan var och en definiera sina egna `.loop` utan kollision.
  Se [Lokala (prickade) etiketter]{1}.
- **Långgreniga pseudo-operationer** — `LBNE`, `LBEQ`, `LBCC`, `LBCS`, `LBMI`,
  `LBPL`, `LBVC`, `LBVS` monteras till en inverterad gren över en `JMP` (alltid
  5 byte) så att målet kan vara valfritt avstånd bort. Ny palettkategori för
  **Långa grenar**. Se [LBNE / LBEQ / … (Långa grenar)]{1}.
- **`.assert` direktiv** — `.assert slut - start <= 256` eller `.assert * <
  $A000, "meddelande"` utvärderas vid monteringstillfället och misslyckas med
  byggandet (visar det faktiska värdet) när uttrycket är falskt. Se
  [.ASSERT]{1}.
- **Operandetiketter för självmodifierande kod** — `LDA-värde:#$00` definierar
  etiketten `värde` som pekar på instruktionens operandbyte, så `STA-värde`
  korrigerar den direkt. Se [Operandetiketter för självmodifierande kod]{1}.
- **Användligare fel vid grenar utanför intervallet** — en gren som landar
  utanför −128…+127 rapporterar nu exakt hur långt den överskrider intervallet
  och föreslår den matchande `LBxx` långa grenen.
- **Förbättrat:** Det ljusa temats lägesindikator i verktygsfältet (BLOCKLÄGE /
  EXPERTLÄGE / …) är mörkare och mer läsbart, och dess skimrande animation syns
  igen.

---

## 1. Översikt över gränssnittet

Appen är uppdelad i tre huvudpaneler:

- **`*` i vilket uttryck som helst** — programräknarsymbolen fungerar nu inuti
  operanduttryck, inte bara på egen hand: `BNE *-5`, `JMP *+20`, `LDA #<*`, `LDA
  #>(*+63)`. Ett `*` som följer ett värde (`STRIDE*2`) är fortfarande
  multiplikation. Se [Adresseringslägen → Programräknaren `*` i
  uttryck](#the--program-counter-in-expressions).
- **Lokala (prickade) etiketter** — en etikett som `.loop` tillhör omfånget för
  den närmaste föregående *globala* (icke-prickade) etiketten, så `DrawSprite`
  och `ClearScreen` kan var och en definiera sina egna `.loop` utan kollision.
  Se [Lokala (prickade) etiketter](#local-dotted-labels).
- **Långgreniga pseudo-operationer** — `LBNE`, `LBEQ`, `LBCC`, `LBCS`, `LBMI`,
  `LBPL`, `LBVC`, `LBVS` monteras till en inverterad gren över en `JMP` (alltid
  5 byte) så att målet kan vara valfritt avstånd bort. Ny palettkategori för
  **Långa grenar**. Se [LBNE / LBEQ / … (Långa
  grenar)](#lbne--lbeq---long-branches).
- **`.assert` direktiv** — `.assert slut - start <= 256` eller `.assert * <
  $A000, "meddelande"` utvärderas vid monteringstillfället och misslyckas med
  byggandet (visar det faktiska värdet) när uttrycket är falskt. Se
  [.ASSERT](#assert).
- **Operandetiketter för självmodifierande kod** — `LDA-värde:#$00` definierar
  etiketten `värde` som pekar på instruktionens operandbyte, så `STA-värde`
  korrigerar den direkt. Se [Operandetiketter för självmodifierande
  kod](#self-modifying-code-operand-labels).
- **Användligare fel vid grenar utanför intervallet** — en gren som landar
  utanför −128…+127 rapporterar nu exakt hur långt den överskrider intervallet
  och föreslår den matchande `LBxx` långa grenen.

---

## 2. Blockpalett

Paletten till vänster listar alla tillgängliga block grupperade efter kategori:

| Panel                | Beskrivning                                                                       |
| -------------------- | --------------------------------------------------------------------------------- |
| **Vänster — Palett** | Alla tillgängliga instruktions- och makroblock. Sök eller bläddra efter kategori. |
| **Center — Program** | Ditt program. Dra block hit, ändra ordningen på dem, redigera operander.          |
| **Höger — Utgång**   | Live ASM-vy och/eller minnesövervakningsutgång.                                   |

Använd sökrutan **** högst upp i paletten för att filtrera efter namn. Klicka på
knappen **Lägg till valt block** eller dra ett block till programområdet.

I blockläge sitter en tunn **vertikal delare** mellan program- och
utdatapanelerna. Dra den för att ge endera panelen mer utrymme (var och en
behåller minst 260 px), använd ← / → för att flytta den i steg om 16 px, eller
dubbelklicka på den för att återställa delningen till 50/50. Positionen sparas
med användargränssnittsinställningarna. Delaren är dold i expert- och ultimat
grundläggande läge och när fönstret är tillräckligt smalt för att panelerna ska
kunna staplas.

---

## 3. Programområde

Paletten till vänster listar alla tillgängliga block grupperade efter kategori:

- **Dra och släpp** block från paletten, eller **ordna om** befintliga block
  genom att dra i deras handtag (≡).
- Varje block visar dess **mnemoniska**, **operandfält** och
  **adresseringslägesväljare** (där så är tillämpligt).
- Klicka på växlingsknappen **▸ / ▾** för att minimera eller expandera ett
  block.
- Använd knappen **× (radera)** på ett block för att ta bort det.
- Knappen **Vika alla** viker alla block samtidigt.
- **Registrera operationer** — MOMS, BETALNING, INX, DEX, …
- **Skift och rotera** — ASL, LSR, ROL, ROR
- **Stack** — PHA, PHP, PLA, PLP
- **System** — CLC, SEC, NOP, BRK, …
- **Olagliga instruktioner** — LAX, SAX, DCP, …
- **Struktur** — ETIKETT, KOMMENTAR, REGION, ENDREGION
- **Makron** — LOOP, NEXT, FOR, ENDF, PUSH, PULL, END, TEXT, BYTE, WORD, FILL,
  ALIGN, ASSERT, STRING, DATA, RAWBYTES, RAWTEXT, PETSCII, CHARSET, INCBIN, SID,
  INCLUDE, TABLE, ORG, MACRO, ENDM, INVOKE, IF, ELSE, ENDIF, VAR, WHILE, ENDW,
  REPEAT, UNTIL, MEMCPY, MEMSET, PRINT, PRINT_CHAR, PRINT_HEX, CLEAR_SCREEN,
  WAIT_KEY, DELAY, SET_BORDER, SET_BG, IRQ_SETUP, RAND, SPRITE_INIT, SPRITE_POS,
  WAIT_RASTER, JOYSTICK, MOUSE, SPRITE_COL, LOADFILE, REU_CHECK, REU_STASH,
  REU_FETCH REU_SWAP, TURBO_SET, SUPERCPU_DETECT, TURBO_ENABLE, MAP_COPY,
  MAP_COPY16X16, SPRITE_ANIM, SCORE_BCD

Använd sökrutan **** högst upp i paletten för att filtrera efter namn. Klicka på
knappen **Lägg till valt block** eller dra ett block till programområdet.

### Parametrar i operandfältet

Varje block med parametrar tar dem i **operandfältet** före **Add**. För en
instruktion är det operanden (`06` för `LDA #$06`); för TEXT, BYTE, LABEL,
REGION och de andra text- eller listmakrona är det deras text eller värde; för
varje annat makro är det det som följer dess nyckelord i expertläge:

| Blockera   | Operandfält      | Blir                     |
| ---------- | ---------------- | ------------------------ |
| SET_BG     | `$06`            | `.set_bg $06`            |
| OMRÅDE     | `Huvud`          | `.region Huvud`          |
| ORG        | `$C000`          | `* = $C000`              |
| SPRITE_POS | `1, 200, 50 `    | `.sprite_pos 1, 200, 50` |
| SLINGA     | `Y, $05, myloop` | `.loop Y, $05, myloop`   |

Fältet visar makrots standardparametrar som en ledtråd. Block utan parametrar
(ENDREGION, ELSE…) och filmakron (INCBIN, KOALA, LEVEL, SID, INCLUDE — de väljer
sin fil i blocket) håller fältet inaktiverat.

---

## 4. ASM-vy

- **Dra och släpp** block från paletten, eller **ordna om** befintliga block
  genom att dra i deras handtag (≡).
- Varje block visar dess **mnemoniska**, **operandfält** och
  **adresseringslägesväljare** (där så är tillämpligt).
- Klicka på växlingsknappen **▸ / ▾** för att minimera eller expandera ett
  block.
- Använd knappen **× (radera)** på ett block för att ta bort det.
- Knappen **Vika alla** viker alla block samtidigt.

### Utgångslägen

Makroblock visas i ASM och båda vyerna som vanliga makrorader utan
kommentarmarkör (`.print "HELLO"`, `.wait_raster $FF`, `.invoke setColor(blue)`)
och är färgade som makron; endast riktiga KOMMENTARblock, regionmarkörer och
varningar behåller sina radinledande `;`.

| Färg på stapeln            | Beskrivning                                                                                                                                                                                                                                                                                                 |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cyan                       | 6502 monteringskälla med adresser och etiketter                                                                                                                                                                                                                                                             |
| **Skärm**                  | Hex-/bytedump (C64-monitorstil)                                                                                                                                                                                                                                                                             |
| **Diasm**                  | Ren 6502-disassemblering: adress · hexadecimala byte · mnemonik med upplösta numeriska operander. Makron expanderas till individuella instruktioner (TEXT → LDA/STA-par, LOOP → LDX, etc.). BYTE/WORD/FILL-data visas som chunked hexadecimaldump. Inga makronamn, kommentarer eller anteckningar i utdata. |
| **Båda**                   | ASM ovanpå, monitor nedanför                                                                                                                                                                                                                                                                                |
| **Demonteringshjälpmedel** | Samma som Disasm — dedikerad flik för demonteringsvyn                                                                                                                                                                                                                                                       |

Komprimerade block renderas med reducerad opacitet. Klicka eller dra var som
helst på minikartan för att rulla programlistan till den positionen.
Viewport-indikatorn (accentfärgad rektangel) spårar den synliga delen av listan.
Tillståndet behålls i användargränssnittsinställningarna
(`blockMinimap`-tangenten).

### Verktygslåda-fliken

- För instruktioner för förgrening/hopp (`BNE`, `JMP`, `JSR`, etc.) visas en
  rullgardinsmeny för **etikettväljare** — klicka på en definierad etikett för
  att infoga den.
- Nummerformatet följer växlingsknappen **HEX / DEC** i verktygsfältet (se
  avsnitt 5).

---

## 5. Inställningar och verktygsfält

Den högra panelen visar den genererade utdata i realtid.

### Projektbilder

| Läge                       | Beskrivning                                                                                                                                                                                                                                                                                                 |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ASM**                    | 6502 monteringskälla med adresser och etiketter                                                                                                                                                                                                                                                             |
| **Skärm**                  | Hex-/bytedump (C64-monitorstil)                                                                                                                                                                                                                                                                             |
| **Diasm**                  | Ren 6502-disassemblering: adress · hexadecimala byte · mnemonik med upplösta numeriska operander. Makron expanderas till individuella instruktioner (TEXT → LDA/STA-par, LOOP → LDX, etc.). BYTE/WORD/FILL-data visas som chunked hexadecimaldump. Inga makronamn, kommentarer eller anteckningar i utdata. |
| **Båda**                   | ASM ovanpå, monitor nedanför                                                                                                                                                                                                                                                                                |
| **Demonteringshjälpmedel** | Samma som Disasm — dedikerad flik för demonteringsvyn                                                                                                                                                                                                                                                       |
| **Verktygslåda**           | C64 referenspanel: 16-färgspalettruta + PETSCII-kontrollkod och fusklapp för utskrivbara tecken. Skrivskyddad — se underavsnittet "Verktygslåda" nedan för mer information.                                                                                                                                 |
| **Alternativ**             | Programinställningspanel — talformat, makrokälla, felsökningsparametrar                                                                                                                                                                                                                                     |

Projektbilder lagras som sidofiler av JSON på disk, inte i localStorage. De är
knutna till den aktuella projektfilen när en sådan finns, så historiken finns
kvar efter omstart och följer projektet.

### Uppdateringar i appen

**Meny → Sök efter uppdateringar** söker upp den senaste versionen på c64va.tech
(den läser nedladdningslänkarna för din plattform) och jämför den med den
version som körs:

| Avsnitt    | Vad händer                                                                                                                                                                             |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Windows ** | Installationsprogrammet körs i passivt läge (endast fortskridande) och startar den nya versionen när det är klart. En installation per maskin ber om administratörsrättigheter (UAC).  |
| **macOS**  | DMG-filen monteras och app-paketet sätts tillbaka på plats, sedan startar den nya versionen. Om app-mappen inte är skrivbar öppnas DMG-filen helt enkelt så att du kan dra appen över. |

Efter nedladdningen installerar appen uppdateringen och startar om:

### Arbetsytor

En **arbetsyta** (`.vaws`-fil) kommer ihåg vilka riktiga filer på disken som var
öppna på varje flik – inklusive varje fliks redigeringsläge och vilken flik som
var aktiv – så att du kan öppna exakt den uppsättningen igen senare. Den är
separat från ett `.proj`-projekt: en arbetsyta kan omfatta valfri blandning av
Block/Expert `.json`-projektfiler, fristående `.asm`-filer och Ultimate Basic
`.ub`/`.proj`-källor över flera flikar.

- Arbetsytor **sparas automatiskt** några hundra millisekunder efter att du har
  gjort en ändring när en har sparats eller öppnats.
- Appen **återställer automatiskt din senaste arbetsyta** vid start, så dina
  öppna flikar fortsätter där du slutade.
- Endast flikar som backas upp av en riktig fil på disk sparas i arbetsytan; en
  flik som innehåller ett osparat exempel eller ett program som endast finns i
  minnet har inget att spara och hoppas över (med ett meddelande om ingen av de
  öppna flikarna kvalificerar sig).
  - **`-jmp` PÅ/AV** — hoppar direkt till programmets startadress efter
    laddning.
  - **`-återuppta` PÅ/AV** — återuppta felsökaren omedelbart vid laddning.
  - **`-wait` ms PÅ/AV** — lägger till en `-wait <ms>` fördröjning innan
    återupptas; välj 500 ms eller 1000 ms från rullgardinsmenyn.
- Om du öppnar en arbetsyta stängs först alla öppna flikar – du ombeds att
  bekräfta innan det fortsätter.

### Projektmallar

**Meny → Arkiv → Nytt projekt från mall…** — eller verktygsfältsknappen mellan
**Meny** och **Handledningar** — öppnar malldialogrutan:

### Byggprojekt

**Meny → Bygg → Bygg projekt** kompilerar ett helt projekt i ett steg. Filerna i
det öppna `.proj`-projektet byggs — eller, utan ett projekt, de öppna
filflikarna:

- varje byggbar källkod (`.asm`, block `.json`, `.ub`) kompileras till en `.prg`
  **bredvid dess källkod** med samma namn; med **Kör med Exomizer** aktiverad
  bearbetas utdata;
- felsökarens sidofiler (symboler / källkodskarta) skrivs bredvid PRG där sådana
  finns tillgängliga;

### Exempelprogram

**Meny → Exempel…** öppnar exempelwebbläsaren: de inbyggda exempelprogrammen
grupperade efter ämne (Grunder, Makron och kontrollflöde, Grafik, Sprites och
inmatning, Filer och inläsning, Musik, IRQ och hårdvara) i två kolumner.

- Skriv i sökrutan för att filtrera efter namn eller kategori; sidfoten visar
  hur många exempel som matchar.
- Klicka på ett exempel för att markera det, **↑ / ↓** flytta markeringen; **
  dubbelklicka på **, ** Enter ** eller ** Ladda ** laddar det.
- Dialogrutan öppnas i det exempel du laddade senast.

Modalfönstret stängs automatiskt när åtgärden är slutförd eller misslyckas.

---

## UltimateBasic-läge

| Kontrollera                                                                                      | Beskrivning                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Talbas (HEX / DEC / BIN)**                                                                     | Ställer in visnings-/inmatningsformatet för operander i hela användargränssnittet. BIN-läget visar värden binärt med prefixet `%` (t.ex. `%11111000`). ASM-vyn visar alltid varje block i sitt eget format.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Språk                                                                                            | Växla användargränssnittet mellan engelska, ungerska, spanska, tyska och nederländska (nederländska)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Tema**                                                                                         | Ljus / Mörk / OLED / Commodore 77 / Commodore Starlight / Commodore Beige / Commodore 64 — välj från temaväljaren i inställningsmenyn. OLED använder en helt svart bakgrund för AMOLED-skärmar. Commodore 77 är ett neongult tema på svart; när det är det aktiva temat använder startpanelen temats panelfärg (som matchar meddelandekortet), visar en mindre dedikerad Commodore 77-logotyp och en gul förloppsindikator. Commodore Starlight är ett ljust tema efter den genomskinliga C64-brödlådan: frostade klara glaspaneler med regnbågens RGB-glöd som lyser igenom, en magenta accent, regnbågens syntaxfärger och en rökig mörk skärmvy. Commodore Beige är den klassiska brödlådan: ett beige hölje, senapsgröna funktionstangentknappar, regnbågsfärgade ränder och en C64-blå skärm för skärmvyn. Det valda temat tillämpas före den första färgsättningen vid nästa start. |
| **CRT retroläge**                                                                                | Växlar ett helskärms-CRT-filter: skanningslinjer, fosforvinjett, flimmer och tunnformad distorsion. Tillståndet sparas mellan sessioner.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Visa minnespanelen**                                                                           | Global växlingsknapp som visar eller döljer hela C64-minnespanelen                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **GRUNDLÄGGANDE SYS-stub**                                                                       | Lägger till en BASIC-rad som anropar SYS till programmets ursprung (den första ORG:en). Ett segment som placeras lägre än den första ORG:en stannar kvar på sin egen adress. När programmet laddas under eller tvärs över BASIC-raden (`$0801`–`$080C`, till exempel en importerad dump från `$071C`), lägger Run and Build till en liten startladdare istället: `SYS 2061` kopierar en mover till bandbufferten (`$033C`), vilket placerar programmet på plats och hoppar till den första ORG:en.                                                                                                                                                                                                                                                                                                                                                                                        |
| **Exempel…**                                                                                     | Öppna exempelwebbläsaren och ladda ett inbyggt exempelprogram — se [Exempelprogram](#example-programs)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Zooma in/ut**                                                                                  | Skala blockgränssnittet (påverkar alla blockelement)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Spara projekt**                                                                                | Spara det aktuella programmet som en `.json`-projektfil                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Spara program som**                                                                            | Spara det aktuella programmet som en `.json`-projektfil med hjälp av en ny fildialogruta varje gång                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Ladda projekt**                                                                                | Ladda ett tidigare sparat projekt                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Spara arbetsyta**                                                                              | Spara den exakta uppsättningen av för närvarande öppna, filbaserade flikar – inklusive den aktiva fliken och varje fliks redigeringsläge (Block/Expert/Ultimate Basic) – till en `.vaws` arbetsytefil                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Spara arbetsyta som**                                                                          | Spara den aktuella arbetsytan med en ny fildialogruta varje gång                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Öppen arbetsyta**                                                                              | Stäng alla öppna flikar och öppna uppsättningen filer som lagrats i en `.vaws` arbetsytefil igen                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Ange arbetsmapp**                                                                              | Välj standardmappen som används av filväljare och dialogrutor för att spara. Sökvägen lagras i appkonfigurationen och menyförhandsgranskningar håller slutet på sökvägen synligt.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Nytt projekt från mall…** (`Meny → Nytt projekt`, eller verktygsfältsknappen bredvid **Meny**) | Skapa ett nytt `.proj`-projekt från en Visual Assembler-, ACME- eller UltimateBasic-mall i en egen mapp — se [Projektmallar](#project-templates)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Öppna projekt** (`Meny → Arkiv`)                                                               | Öppna ett projekt med flera filer `.proj` och öppna alla källfiler som flikar                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Spara projekt** (`Meny → Arkiv`)                                                               | Spara det aktuella `.proj`-projektet (projektpanelen måste vara öppen)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Stäng projekt** (`Meny → Arkiv`)                                                               | Stäng det för närvarande öppna projektet och alla dess filflikar. Uppmanas att spara osparade ändringar. Projektpanelen återställs till sitt tomma tillstånd.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Ladda .asm-fil**                                                                               | Öppnar en `.asm`-fil i expertläge och importerar textfilen 6502 ASM till den aktuella fliken.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Spara PRG**                                                                                    | Exportera den kompilerade binärfilen som en `.prg`-fil                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Bygg CRT**                                                                                     | Exportera programmet som en 64K Magic Desk-fil (`.crt`, patrontyp 19). Se [Avsnitt 12b](#12b-crt-export-magic-desk-64k-cartridge).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Bygg projekt** (`Meny → Bygg`)                                                                 | Kompilera alla byggbara filer i projektet (eller de öppna flikarna) till en `.prg` bredvid dess källkod — se [Bygg projekt](#build-project)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Kör (delknapp)**                                                                               | Huvudknappen **▶ Kör** kör det aktuella läget; klicka på pilen **▾** för att växla mellan: **Kör som PRG** (kompilera och starta VICE direkt), **Kör via D64** (paketera till en .d64-diskavbildning och starta VICE), **Kör på hårdvara** (skicka PRG till en C64 Ultimate / 1541 Ultimate-enhet) eller **Kung Fu Flash 2** (ladda upp PRG via USB till en riktig C64/C128 med en Kung Fu Flash 2-pickup). Se [Avsnitt 12](#12-d64-export--run) och [Avsnitt 13](#13-hardware-settings).                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Felsök (RetroDebugger)**                                                                       | Kompilera och starta i RetroDebugger med brytpunkter, symboler och autostartflaggor (se [Avsnitt 9](#9-debugger-integration))                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Kör med Exomizer**                                                                             | Kryssruta i Inställningsmenyn — när den är aktiverad, kör alla Kör- och Bygg-åtgärder PRG genom `exomizer sfx` innan de startas eller sparas (`sfx basic` för en PRG som börjar med en BASIC-rad, så RUN fungerar igen efter att programmet returnerar; `sfx $<ladda adress>` annars). Fungerar med Kör som PRG, Kör via D64, Kör på hårdvara, Bygg PRG och Bygg D64. Konfigurera Exomizer-körbar fil i **Hårdvaruinställningar** först.                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Automatiskt sparade poster**                                                                   | Kryssruta i **Hårdvaruinställningar → Versionskontroll**. När den är aktiverad lägger appen till en automatisk sparningspost i versionshistoriken cirka 2,5 sekunder efter att du slutat redigera en flik (för en flik i ett projekt även i projekthistoriken). Stäng av den om du bara vill ha dina egna commits. Se [Versionskontroll](#version-control).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Inställningar** (tidigare maskinvaruinställningar)                                             | Öppna inställningsdialogrutan med tre flikar: **Allmänt** (assemblerläge, BASIC SYS-stub, Exomizer, uppdateringar, ASM-utdata, SID-förhandsgranskning, felsökarparametrar, versionskontroll), **Filer och sökvägar** (VICE, RetroDebugger, ACME, Exomizer, git) och **Integrationer** (C64 Ultimate, Kung Fu Flash 2). Se [Avsnitt 13](#13-hardware-settings).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Nytt program…**                                                                                | Öppnar en bekräftelsedialogruta och rensar sedan alla block från programområdet                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Komprimera alla**                                                                              | Komprimera alla block                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Om**                                                                                           | Versionsinformation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Nyheter**                                                                                      | Ändringslogg                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |

### Versionskontroll

Varje flik har sin egen versionshistorik, som ett litet git-arkiv; en flik som
tillhör ett öppet `.proj`-projekt kan också versioneras som ett helt projekt (se
[Projektläge](#project-mode)). **Meny → Bygg → Versionskontroll…** (eller
**Commit…**) öppnar dialogrutan; **Ignorera ändringar (tillbaka till HEAD)**
återställer den senaste commit direkt.

Vanligt arbetsflöde: skriv ett **commit-meddelande** och tryck på **Commit**
(eller Ctrl+Enter) → fortsätt redigera → tryck på **Diff** för att se vad som
ändrats → commit igen.

- **Commit** — sparar flikens aktuella tillstånd med ditt meddelande. Varje
  commit får en kort hash (till exempel `1bd55ba`); den senaste är **HEAD**. En
  commit utan ändringar eftersom HEAD inte skapas.
- **Statusrad** — *Inget att committa, fungerar med trädrensning* eller
  *Ocommitterade ändringar sedan `<hash>`*.
- **Diff** — ändringarna sedan HEAD; knappen **Diff** i en loggpost jämför den
  versionen med redigeraren. Tillagda rader är gröna, borttagna rader röda och
  rubriken visar **+N / −M**. Blocklägesprogram jämförs som monteringslinjer (en
  rad per block), Expertkällor rad för rad, Ultimate Basic-flikar efter sin
  källa, så ett blocklägeprojekt som sparats som JSON visar fortfarande läsbara
  ändringar.
- **Utcheckning** — laddar den versionen i editorn. Filen på disken ändras bara
  när du sparar; **Ignorera ändringar** går tillbaka till HEAD.
- **Autospara poster** — med **Inställningar → Versionshantering → Automatiskt
  autospara poster i versionshantering** lägger appen till en post cirka 2,5
  sekunder efter att du slutat redigera. De är markerade som *autospara*; de
  sista 20 behålls, bredvid upp till 100 commits.
- Dialogrutan kan flyttas med hjälp av rubriken; den öppnas igen på samma plats
  och stängs med **Esc** eller dess stängningsknapp (ett klick utanför stänger
  den inte).
- Historiken lagras bredvid projektfilen som `<project>.snapshots.json` (i
  appens konfigurationsmapp tills projektet sparas), så den överlever omstarter.
  Ögonblicksbilder gjorda av tidigare versioner visas som commits.

#### Projektläge

När fliken tillhör ett öppet `.proj`-projekt (Expert- eller Ultimate
Basic-projektpanelen) visar dialogrubriken en **Fil / Projekt**-växling;
**Projekt** är valt som standard. Flikar utanför ett projekt behåller den
filspecifika historiken som beskrivs ovan.

- **Commit** registrerar varje källfil i projektet i en enda post: filerna i
  projektträdet plus de textfiler de inkluderar (`.include`, `include`,
  `#import`, `!source`, INCLUDE-block i blockläge). Öppna flikar räknas med sitt
  nuvarande, även osparade, innehåll; de andra filerna läses från disken. Binära
  filer i projektträdet (fonter, `.koa`, `.bin`, `.sid` …, upp till 1 MB
  vardera) registreras också; deras diff visar storleksförändringen, och
  **Checkout** skriver dem direkt tillbaka till disken.
- Loggen visar commit-meddelandet, den korta hashen och de **ändrade filerna**
  för varje post (**A** tillagda, **M** modifierade, **D** borttagna).
- **Diff** fungerar fil för fil: varje ändrad fil får sin egen rubrik och sina
  egna stycken.
- **Ignorera ändringar** går tillbaka till den senaste projektcommiten (HEAD) på
  samma sätt.
- **Utcheckning** (efter en bekräftelse) laddar alla filer i den versionen till
  redigeraren: öppna flikar uppdateras, saknade filer öppnas som nya flikar.
  Ingenting skrivs till disken förrän du sparar; filer som lagts till i
  projektet sedan den versionen förblir som de är.
- Autosparade poster görs även på projektnivå.
- Projekthistoriken lagras bredvid projektfilen som
  `<project>.proj.history.json`.
- I **Git**-läge visar loggen hela arkivet med de ändrade filerna för varje
  commit (`git log --name-status`); **Diff** på en post visar commit-fil för
  fil, knappen **Diff** jämför HEAD med projektfilerna i editorn (**RAW** är
  `git diff HEAD` för arkivet). **Commit** sparar varje osparad projektflik och
  lagrar alla ändringar (`git add -A`); **Checkout** laddar projektfilerna för
  den commiten till editorn.

#### Git

Om `git` är installerat kan samma dialogruta fungera med ett riktigt git-arkiv.

- **Inställningar → Versionshantering:** **Välj git.exe…** eller **Automatisk
  identifiering** (söker i PATH och de vanliga installationsmapparna); raden
  nedan visar git-versionen. **Använd Git när projektet finns i ett arkiv** (på
  som standard) växlar dialogrutan till Git-läge automatiskt för filer i ett
  arkiv. Växeln **Inbyggd / Git** i dialogrubriken ändrar läget manuellt.
- Rubriken visar grenen med **↑** (commit till push) och **↓** (commit till
  pull), följt av de ändrade filerna från arkivet.
- **Commit** sparar filen först, stagar endast denna fil (eller varje ändring
  med **Stage alla ändringar (git add -A)**) och kör `git commit`.
- Loggen listar commits för den här filen med deras grenar och taggar. **Diff**
  på en post jämför commiten med dess överordnade; knappen **Diff** jämför HEAD
  med editorn, inklusive osparade ändringar. Projektfiler jämförs på samma sätt
  som i det inbyggda läget; **RAW** visar den vanliga `git-diff`.
- **Checkout** laddar filen för den commiten i editorn (`git show`) utan att
  röra disken.
- **Pull** (`--ff-only`), **Push** (första push-funktionen ställer in
  uppströmmen med `-u origin <branch>`) och **Create repository (git init)** när
  mappen ännu inte är en repository.
- git körs utan ett konsolfönster och frågar aldrig efter ett lösenord:
  inloggningsuppgifterna måste komma från en inloggningshanterare eller en
  SSH-nyckel, annars visas felmeddelandet i dialogrutan. | **Kunskapsbas** |
  Referenslänkar (6502 opkoder, C64 KERNAL, minneskarta, färger) | | **Sök efter
  uppdateringar** | Sök på c64va.pro efter en nyare version och ladda
  ner/installera den — se [Uppdateringar i appen](#in-app-updates) |

### Redigeringsverktyg

**Meny → Sök efter uppdateringar** söker upp den senaste versionen på c64va.pro
(den läser nedladdningslänkarna för din plattform) och jämför den med den
version som körs:

- syntaxmarkering baserad på den nuvarande Ultimate Basic-språkreferensen;
- radnummer som förblir synkroniserade med långa filer;

Panelen Demontering innehåller en **Kopiera**-knapp som kopierar hela den visade
källan till urklipp. Kommandohjälpen följer den medföljande kompilatorn: till
exempel väljer `sprite_frame id, data_address [, frame]` en animeringsbild från
på varandra följande 64-byte sprite-frames.

| Plattform  | Vad händer                                                                                                                                                                                  |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Windows ** | Installationsprogrammet körs i passivt läge (endast fortskridande) och startar den nya versionen när det är klart. En installation per maskin ber om administratörsrättigheter (UAC).       |
| **macOS**  | DMG-filen monteras och app-paketet sätts tillbaka på plats, sedan startar den nya versionen. Om app-mappen inte är skrivbar öppnas DMG-filen helt enkelt så att du kan dra appen över.      |
| **Linux**  | En AppImage byts ut mot en ny. En `.deb` / `.rpm`-installation uppdateras med `pkexec` (du blir ombedd att ange ditt lösenord); utan `pkexec` öppnas paketet i din programvaruinstallation. |

Kommandolistan är avsiktligt höjdbegränsad så att kommandodetaljkortet kan fylla
den återstående panelhöjden. Detaljområdet rullar oberoende för längre
syntaxbeskrivningar.

**Uppdateringsserver:** **Inställningar → Uppdateringar → Uppdateringsserver**
anger var utgåvor söks upp (standard `https://www.c64va.pro/`);
installationsprogrammen läses från `<server>downloads/VA/`. Adressen måste
använda `https://` (vanlig `http://` endast för `localhost`, för testning);
**Standard** går tillbaka till c64va.pro.

### Gratis och öppen källkod

Visual Assembler är gratis: alla funktioner — de visuella redigerarna (SID,
Sprite, Char, Charset, Hi-Res, Map, Level, D64, Curve), SID Player, **Build
PRG**, **Build D64**, **Build CRT**, **Build project**, Exomizer-packning,
körning på C64 Ultimate och Kung Fu Flash 2, och alla UI-språk och teman —
fungerar utan registrering eller serienummer. Källkoden är tillgänglig under GNU
General Public License v3.0 (se **Meny → Om**). Fram till version 2.5.9 hade
appen en Freemium/Professional-uppdelning; sedan 2.6.0 behövs helt enkelt inte
längre en serienummer som anges där.

Om du gillar programmet kan du stödja dess utveckling med en donation: **Meny →
Donation** (under Visa) öppnar donationssidan på c64va.pro, där du kan ge
valfritt belopp via PayPal.

**Användarstatistik.** Högst en gång om dagen, vid uppstart, skickar appen ett
anonymt ping till c64va.pro med appversion, operativsystem, UI-språk, antal
startar och aktiva minuter sedan den senaste pingen (en minut räknas så länge
fönstret är synligt och du har använt musen eller tangentbordet under de senaste
5 minuterna), om en serienummer från 2.5.6–2.5.9 fortfarande lagras (endast
ja/nej) och ett slumpmässigt installations-ID (lagras i appens `config.json` som
`launchPing`). Ingen e-postadress, serienummer, projekt eller källkod skickas;
offline händer ingenting. Appen frågar också c64va.pro om ett tillfälligt kort
meddelande (till exempel om en ny version, ibland bara för supportrar); varje
meddelande visas en gång.

### Rapportera ett fel

**Meny → Rapportera fel** öppnar ett formulär som skickar rapporten direkt till
utvecklaren.

- **Sammanfattning** och **Vad hände?** är obligatoriska — beskriv vad du
  gjorde, vad du förväntade dig och vad som hände istället. **E-post** är
  valfritt; ange det om du vill ha svar.
- **Skärmdumpar:** upp till 4 bilder med **Lägg till bild…**, genom att klistra
  in med **Ctrl+V** (till exempel efter Win+Shift+S) eller genom att släppa dem
  på formuläret. Stora bilder skalas ner till 1920 pixlar.
- **Inkludera systeminformation och senaste fel** (på som standard) lägger till
  appversion, operativsystem, språk, tema, redigerare och körläge, skärmstorlek,
  antal block och de senaste appfelen. **Vad skickas?** visar data. Din källkod
  skickas inte.
- **Skicka rapport** bekräftar med rapportnumret. **Skicka via e-post** öppnar
  istället ditt e-postprogram.

### Stöd

**Meny → Support** öppnar en chatt med utvecklaren: skriv en fråga, en idé eller
ett problem och tryck på **Skicka** (eller **Ctrl+Enter**). Du kan bifoga upp
till 3 filer (totalt 4 MB): bilder, källfiler (`.asm`, `.ub`, `.txt` …),
C64-filer (`.prg`, `.d64`, `.sid`, `.crt` …) eller en `.zip` — med **Bifoga
fil…**, genom att klistra in (**Ctrl+V**) eller genom att dra dem till fönstret.
Svaret visas i samma fönster, även med filer: bilder visas som
förhandsgranskningar, ett klick sparar en fil. Fönstret är inte modalt: dra det
i rubriken, ändra storlek från det nedre högra hörnet och fortsätt arbeta medan
det är öppet. Appen söker efter svar vid start och varje minut; ett nytt svar
spelar upp en kort ljudsignal (högtalarknappen i fönstrets rubrik stänger av
ljudet), blinkar aktivitetsfältsikonen när appen är i bakgrunden, visar en röd
prick på **Meny**-knappen och öppnar fönstret en gång. När du har en
konversation öppnas den av en kuvertikon bredvid **Meny**-knappen; den blir röd
och blinkar med antalet olästa svar. **×** bredvid ett meddelande raderar
meddelandet, papperskorgknappen i fönstrets rubrik raderar hela konversationen
med dess bilagor (även för utvecklaren; båda frågar först). En e-postadress är
valfri: om du anger en kommer svaret också via e-post. Konversationen är kopplad
till appens slumpmässiga installations-ID, så det finns inget konto och inget
lösenord.

### Projekt, flikar och startfiler

Ultimate Basic-projekt använder `.proj`-filer och kan innehålla flera
`.ub`-källor. Projektpanelen listar öppna filer, markerar osparade flikar och
visar upptäckta etiketter, funktioner och subrutiner. Med projektåtgärder kan du
skapa, öppna, spara och stänga ett projekt eller lägga till en annan källfil.
Ett nytt projekt kan också starta från en UltimateBasic-mall — se
[Projektmallar]{1}.

- **Lägg till fil** — välj en eller flera filer samtidigt (valfri typ — `.ub`,
  `.bin`, `.prg`, bilder, teckensnitt, etc.). `.ub`-källor öppnas också som
  redigeringsflikar; allt annat läggs endast till som referens, för att
  `incbin`/`loadfile`-resurser ska kunna följa med projektet.
- **Lägg till mapp** — referera till en hel mapp (t.ex. en `incbin`
  resurskatalog som `fonts/`) så att den förblir kopplad till projektet.
- Endast flikar som backas upp av en riktig fil på disk sparas i arbetsytan; en
  flik som innehåller ett osparat exempel eller ett program som endast finns i
  minnet har inget att spara och hoppas över (med ett meddelande om ingen av de
  öppna flikarna kvalificerar sig).
- Om du öppnar en arbetsyta stängs först alla öppna flikar – du ombeds att
  bekräfta innan det fortsätter.
- Om en arbetsyta refererar till en fil som sedan dess har flyttats eller tagits
  bort, hoppas den posten över och rapporteras med namn efter inläsning.
- De öppna Expert- och Ultimate Basic-projekten ** ** lagras också:
  projektträdet (inklusive osparade tillägg och borttagningar), startfilen och
  `.proj `-sparmålet återställs med arbetsytan. Arbetsytor som sparats av äldre
  versioner öppnas utan dem.

### Minnesfönster och noll sidanvändning

Panelen **Fullständigt C64-minne** kan flyta: knappen **undocka** i dess rubrik
flyttar den till ett separat, icke-modalt fönster som du kan dra och ändra
storlek på medan du fortsätter att redigera (överlappningsmärket följer med).
**Docka** (eller × / Esc) placerar tillbaka den. Fönstret kommer ihåg om den
kopplades bort och dess storlek.

När programmet nuddar sidan noll visas ett avsnitt **Noll sidanvändning** högst
upp på minneskartan: ett 16 × 16 rutnät med `$00–$FF`, färgat efter område —
CPU-port (`$00–$01`), ledig (`$02`, `$FB–$FE`), BASIC (`$03–$8F`, `$FF`) och
KERNAL (`$90–$FA`). Använda celler fylls i; En ram markerar en **skrivning**, en
skuggning en **pekare** (`(zp),Y` / `(zp,X)`). Klicka på en använd cell för att
se vilka rader som öppnar den (klicka på en rad för att hoppa dit) och en
varning när du skriver i BASIC- eller KERNAL-området.

Om programmet innehåller SID-redigerarens exporterade spelare
(`sid_`-etiketter), markeras spelarens nollasida (`$02–$1C`, `$2F`, `$FB–$FD`)
också, och varje adress som din egen kod också använder rapporteras som en
**konflikt** (röd ram, varning i rubriken).

### Byggnad och diagnostik

**Meny → Nytt projekt → Nytt projekt från mall…** — eller verktygsfältsknappen
mellan **Meny** och **Handledningar** — öppnar malldialogrutan:

1. Välj ett avsnitt högst upp: **Visual Assembler**, **ACME** eller
   **UltimateBasic** (dialogrutan öppnas i det avsnitt som matchar det aktuella
   redigeringsläget). Avsnittet **ACME** visas bara när en fungerande ACME är
   inställd i **Inställningar → Filer och sökvägar → ACME**.
2. kompilatorfel återges i rött;
3. den centrerade kompileringsdialogrutan visar felet;
4. fel som innehåller en källrad, välj den raden i den aktiva UB-redigeraren.

| Avsnitt                 | Inbyggda mallar                                                                                                                                                                                                                |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ** Visuell assembler ** | Tomt program, Tomt spel (titel / spela / spel över-tillstånd, joystick, spelarsprite), Anlitar bitmapp, Flerfärgad bitmapp, Sprite-multiplexerare (16 sprites sorterade efter Y varje bildruta, visade av en raster-IRQ-kedja) |
| **ACME**                | Tomt ACME-projekt, raster-IRQ, Sprite-multiplexer (16 sprites)                                                                                                                                                                 |
| **UltimateBasic**       | Tomt program, Tomt spel (samma tillståndsmaskin i UB), Anlitar bitmapp (`linje` / `raktär` / `cirkel` med `färgpenna`), Raster-IRQ (en `sub` anropar varje bildruta från rasteravbrottet)                                      |

Projektet skapas i en egen mapp: `<plats>/<namn>/<namn>.proj` plus `main.asm`
(Visual Assembler eller ACME) eller `main.ub` (UltimateBasic, `.proj` är
markerat som ett Ultimate Basic-projekt). Ett ACME-projekts `.proj` registrerar
ACME-assembleren, och om du skapar den växlar **Inställningar → Allmänt →
Assemblerläge** till ACME-läge (ett Visual Assembler-projekt växlar tillbaka
till VMA-läge). Ett befintligt projekt skrivs aldrig över — dialogrutan
rapporterar det istället. Öppna flikar stängs först (du tillfrågas om osparade
ändringar), sedan öppnas det nya projektet i expertläge eller Ultimate
Basic-läge med projektpanelen synlig och huvudfilen inställd som startfil.

**Dina egna mallar:** **Mapp för mina mallar** (längst ner till vänster i
dialogrutan) öppnar mappen för användarmallar i appens konfigurationskatalog.
Varje `.asm`- eller `.ub`-fil som släpps där visas i matchande avsnitt (en
`.asm` med en `; @assembler acme`-rubrikrad går till **ACME**) (under *Mina
mallar* om den inte namnger en kategori). En mall är en vanlig källfil med en
valfri rubrik med kommentarrader högst upp — `;` i assembler, `#` i Ultimate
Basic:

```asm
; @name Rasterbalkar
; @name.hu Rasterbalkar
; @category Effects
; @desc Två rasterbalkar i ramen.
; @order 50
```

`@name`, `@category` och `@desc` kan ha varianter per språk (`@name.hu`,
`@desc.de`, …); `@order` sorterar listan. Allt efter rubriken blir den nya
huvudfilen, och `{{PROJECT}}` ersätts med projektnamnet (använd det i en
kommentar så att själva mallen fortfarande kompileras).

### Handledningar och lektionsredigeraren

Fönstret **Handledningar** listar rundturer och lektioner efter mapp. Knappen
**Lektionsredigerare…** längst ner i listan (och **Redigera lektion** på dina
egna lektioner) öppnar **Lektionsredigeraren**, som skapar en
steg-för-steg-lektion som "Bygg: Ditt första textprogram" från din egen kod:

1. Skriv programmet i Block- eller Experteditorn.
2. I lektionsredigeraren trycker du på **Steg från det aktuella programmet**.
   Varje rad blir elevens steg: välj mnemoniken (fel rad är förvald), skriv
   operanden, tryck på **Lägg till**. Där paletten inte kan ställa in allt (till
   exempel en TEXT-position) pekar ett **Ange parametrarna**-steg på det nya
   blocket och går vidare när det matchar.
3. Ge lektionen en titel, beskrivning, svårighetsgrad och **mapp** (valfri
   kategori för handledningar). Lägg till **textsteg** för förklaringar,
   eventuellt pekande på en del av fönstret (palett, programpanel, ASM-vy,
   Kör-knapp, minneskarta). Lämna ett stegs titel eller förklaring tom för den
   genererade texten.
4. **Försök med lektionen** (det rensar det aktuella programmet), och **Spara
   sedan lektionen** (Ctrl+S).

Texter sparas i det aktuella gränssnittsspråket; en elev som använder ett annat
språk ser dem, eller den genererade texten där du inte skrev några. **Fyll i
makroparametrar automatiskt** hoppar över parameterstegen för eleven. **Filer
▾** skapar, tar bort, exporterar och importerar lektioner som `.vatut`-filer och
öppnar lektionsmappen.

#### Onlinelektioner

**Onlinelektioner…** i handledningsfönstret listar lektionerna som publicerats
på www.c64va.pro med deras mapp, svårighetsgrad och antal steg. **Ladda ner**
placerar en lektion i sin mapp i handledningslistan; **Uppdatera** visas när
webbplatsen har en nyare version (lektionredigeraren uppdaterar en lektions
version varje gång du sparar). För att dela din egen lektion, använd **Filer ▾ →
Ladda upp till c64va.pro…** i lektionsredigeraren: ange ditt namn (visas som
författare) och eventuellt en e-postadress och en anteckning. Lektionen granskas
först; när den är godkänd visas den i allas lista över onlinelektioner. Din
e-postadress publiceras aldrig.

### Löpning, D64 och Exomizer

Huvuddelningsknappen **Run** stöder Ultimate Basic i alla vanliga destinationer:

- varje byggbar källkod (`.asm`, block `.json`, `.ub`) kompileras till en `.prg`
  ** bredvid dess källkod** med samma namn; med **Kör med Exomizer** aktiverad
  bearbetas utdata;
- felsökarens sidofiler (symboler / källkodskarta) skrivs bredvid PRG där sådana
  finns;
- moduler som en annan fil hämtar med `.include` / `include` (och `.inc`-filer)
  hoppas över, liksom flikar som aldrig sparades;
- en rapport listar varje fil med dess storlek, *överhoppad* orsak eller
  kompileringsfel, och statusfältet visar *N/M skapade filer*.

### Felsökarsymboler och demontering

Byggen begär felsökningsinformation för Ultimate Basic och producerar tre
kompatibla sidovagnar:

- `.sym` för symboler i KickAssembler-stil;
- `.dbg` för C64Debugger/RetroDebugger-käll- och segmentinformation;
- `.vs` för VICE-skärmetiketter.

### Ultimate Basic-manual och källa

Bokikonen i UB-verktygsfältet öppnar matchande Ultimate Basic `MANUAL.pdf`
offline; knappen manual i välkomstdialogrutan för start öppnar samma manual.
Visual Assembler hämtar både kompilatorn och PDF-filen från det fästa uppströms
Git/Cargo-beroendet, så IDE:n underhåller inte en andra kopia av Ultimate
Basic-implementeringen. Dialogrutan Om och välkomstskärmen visar den faktiska
beroendeversionen.

- `* = 1500 USD` → ORG-block
- `Etikett:` → ETIKETTblock
- `Etikett: .byte 0` → ETIKETT + BYTE-block
- `.byte ...` → BYTE-block
- `; kommentar` (eller inline `; ...`) → KOMMENTAR-block
- instruktioner (`lda`, `jsr`, `beq`, etc.) → instruktionsblock med detekterat
  adresseringsläge

#### Importera parsningsanteckningar och bästa praxis

- Lokala etiketter som `.wait` importeras som standardetiketter (punkten
  borttagen), och referenser normaliseras därefter.
- För adressering av typen `($zp),Y` / `($zp,X)` ska en konkret nollsidig byte
  (`$FB`, `$FC`, etc.) användas för bästa kompatibilitet.
- Undvik tvetydiga korta etiketter som ser ut som hexagoner (`cc1`, `dead`,
  `beef`) i grenkontexter; föredra namn som `loop_cc1`.
- Om ditt program startar med data (`.byte`) före körbar kod, lägg till ett
  explicit hopp (till exempel `JMP Start`) högst upp.

### Kick-import (Kick Assembler)

Knappen **Kick import** på programmenyn importerar rå Kick Assembler-källkod
till en ny flik i blockläge. Den är separat från expertläget `Ladda .asm-fil`
ovan — dess anpassade verktygstips markerar att **endast Kick Assembler-kod
stöds** (andra assemblerar kan tolka delvis men garanteras inte att de går
runt).

Stödda mönster:

- `.pc = $XXXX` ursprungsdirektiv → ORG-block
- `.konstant NAMN = värde`, `.etikett NAMN = värde` → KONSTANT equate
- `.makro NAMN(p1, p2, ...) { ... }` med `{`/`}` klammerparenteskropp eller
  `.endm` → användarmakrodefinition
- Makroanrop `NAME(args)`, Kick colon-prefix `:NAME(args)` och `.invoke
  NAME(args)` — helt tur och retur via Kick colon-formuläret
- Etiketter som `@local` (`@loop:`, `BEQ @loop`) bevarar prefixet `@` som det är
- Operand `etikett + N` / `etikett - N` (t.ex. `STA mod1+2`, `LDA xp+1`)
- Radkommentarer `// ...` och `;` — båda accepterade, `/* ... */`-block
  behandlas som en enda kommentarsrad
- `.text "…"` utan skärmkoordinater → BYTE-block med de kodade bytena (den
  ursprungliga raden behålls som blockets kommentar). Flera alternativ är
  tillåtna: `"…"`, `@"…"` med escape-tecken `\n` `\r` `\t` `\$NN`, och `$NN` /
  decimalbyte, sammanfogade med `,` eller `+`
- `.encoding "name"` ställer in kodningen för följande `.text` rader:
  `screencode_mixed` (standardinställningen för Kick), `screencode_upper`,
  `petscii_mixed`, `petscii_upper`, `ascii`. Ett tecken som kodningen saknar kod
  för rapporteras på blocket.
- `.label NAME = *`, `.label NAME = * + N`, `.label NAME = * - N` → en etikett
  vid programräknaren, förskjuten med N (till exempel ett hopp in i operanden
  för en `BIT`: `.label loc_c474 = * + 1`)
- Mnemoniska suffix `.abs` / `.a` och `.zp` / `.z` (`sta.abs $00fc,x`, `ldx.zp
  ptr,y`) tvingar fram absolut adressering eller sidnolladressering
- `*=$XXXX "namn"` och `.pc = $XXXX "namn"` segment i valfri ordning: ett
  segment lägre än det första stannar på sin adress
- BASIC autostart-genomströmning: när programmet startar vid `$0801` med
  standard `SYS 2061` byte-stub (`.byte
  $0B,$08,$0A,$00,$9E,$32,$30,$36,$31,$00,$00,$00`), genererar kompilatorn PRG
  ordagrant istället för att omsluta ett andra BASIC SYS-system.

Demonteringar gjorda av Restore64 (KickAssembler-syntax) importerar och bygger
byte för byte som KickAssembler. Startpunkten som namnges i deras rubrik är den
första `.pc`. Ett program för Plus/4 / C16 (BASIC vid `$1001`, TED-register vid
`$FFxx`) bygger på samma sätt, men det körs bara i en Plus/4-emulator som VICE
`xplus4`, inte med Run.

Känd begränsning:

- Konstanter som löses upp till en nollsidig adress (till exempel `.const
  BYTEADDR = $FC` använd som `STA BYTEADDR`) kompilerar för närvarande till
  absolutlägesinstruktioner (3 byte) istället för nollsidig (2 byte). Den
  kompilerade koden skriver fortfarande till rätt minnesplats, bara med en liten
  storlek och cykeloverhead jämfört med samma källkod som byggdes av Kick
  Assembler.

#### Kick-projekt (Importera Kick-projekt…)

**Importera Kick-projekt…** (Programmeny, under **Kick import**) tar ett helt
KickAssembler-källkodsträd — en huvudfil med `#import`-moduler och `.import
binära`-resurser — och skapar ett VA-projekt av det. Välj huvudfilen
(`main.asm`); VA följer varje `#import` / `.import source` / `.import binärfil`
(även inuti `.if`-grenar som inte tas) och skriver en `.proj` bredvid den,
uppkallad efter mappen (`src` / `source` / `asm`-mappar använder den överordnade
mappens namn). Projektet listar varje fil i sitt mappträd; källorna stannar där
de är, så ett befintligt KickAssembler-byggskript fortsätter att fungera. Filer
som inte kan hittas listas i feldialogrutan.

**Kick-kompatibel omkopplare:** vilket VA (VMA)-projekt som helst kan göras
Kick-kompatibelt med knappen `{K}` i projektpanelens rubrik (visas i VMA-läge
när ett projekt är öppet; den är påslagen för importerade Kick-projekt).
Inställningen sparas i `.proj` (`"kick": true`); avslagen är projektet ett
vanligt VMA-projekt och byggs exakt som tidigare.

I ett Kick-kompatibelt projekt fortsätter VA-makron och direktiv att fungera
bredvid KickAssembler-skriptet: `.text x, y, "…"`, `.set_border`, LOOP / NEXT,
SPRITE_INIT, `.include`, `.incbin`, `.sid`, `.define` / `.if SYMBOL` / `.else` /
`.endif`, VA-makron (`.macro name(p)` … `.endm` with `{p}`) och resten går till
VA-assemblern som de är, med Kick-konstanterna som tal. Direktiv som finns i
båda skiljer sig åt genom sin form:

| VA (VMA)                                         | KickAssembler                                                                                                     |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `.för X, $0A, för1` … `.endf för1`               | `.för (var i = 0; i < 10; i++) { … `                                                                              |
| `.if DEBUG` … `.else` … `.endif`                 | `.if (uttryck) { … } else { … }`                                                                                  |
| `.makronamn(p)` … `.endm`, anropad med `.invoke` | `.makro Namn(p) { … }`, anropad som `Namn(arg)`                                                                   |
| `.var namn = värde` (en runtime-variabel)        | `.var name = value` (en skriptvariabel) — i ett Kick-kompatibelt projekt är `.var` alltid KickAssembler-variabeln |

Projektet bygger med VA-assemblern, inte med KickAssembler: varje byggprocess
(Kör, Spara PRG, D64, CRT, Exomizer, Debug, VICE Monitor, Byggprojekt,
Bygg-knappen) kör först startfilen genom en KickAssembler-förbehandlare, med
redigeringstexten för öppna flikar, sparade eller inte. Resultatet är samma PRG
som KickAssemblers. Stöds:

- `#import`, `.importera källa`, `#importonce`; `.importera binärfil` / `c64` /
  `text` med valfri offset och längd
- `.const` / `.label` i valfri ordning, med uttryck; noll sidadressering eller
  absolut adressering följer värdet som i KickAssembler (`.abs` / `.zp` tvingar
  det fortfarande fram)
- `.for (var i = 0; i < n; i++) { … }` och enradig form, `.var`, `.eval` (`=`,
  `+=`, `++` …), `.if (…) { … } else .if (…) { … } else { … }` och enradig form
- `.function Namn(params) { .return expr }` och `.macro Namn(params) { … }`
  anropas som `Namn(args)` eller `:Namn(args)`
- flera etiketter `!:` / `!namn:` med `!+`, `!-`, `!++`, `!namn+`, `!namn-`
- `.pseudopc address { … }`: etiketter inuti får den logiska adressen, bytena
  stannar där de är
- `BasicUpstart2(etikett)` / `BasicUpstart(etikett)`, `* = adress "segment"`,
  `.fill n, expr` (med `i`) och `.fill n, [a, b]`, `.align`, `.byte`, `.word`,
  `.dword`, `.text`
- `.assert "beskrivning", expr, true`; `cmdLineVars.containsKey(…)` /
  `cmdLineVars.get(…)` och `#define` symbolerna kommer från
  **Projektinställningar** (KickAssemblers `:namn=värde` och `-define NAMN`)
- `LoadBinary("fil"[, mall])` med `get(i)` / `uget(i)` / `getSize()`, en mall
  som `"C64FILE, Bitmap=$0000, ScreenRam=$1f40"` (eller `BF_KOALA`, `BF_FLI`,
  `BF_DOODLE`, `BF_BITMAP_SINGLECOLOR`, `BF_C64FILE`) vilket ger `getBitmap(i)`
  / `getBitmapSize()` per block; `LoadSid("file.sid")` med `plats`, `init`,
  `spela`, `låtar`, `startlåt`, `storlek`, `namn`, `författare`, `upphovsrätt`,
  `getData(i)` …; `.fill` med skriptvärden expanderas direkt
- `* = adress "namn" virtuell`: ett virtuellt minnesblock — dess etiketter får
  adresser, men inga byte skrivs
- `.medan (…) { … }`, `i++` / `--i` i uttryck, `.var namn` utan värde
- `*` som programräknare (`jmp *`, `bne *-1`, även inuti `.pseudopc`)
- `;` mellan satser (`lda #1; sta $d020`, `.var a = 1; .var b = 2`): a `;`
  direkt efter koden, utan mellanslag, följt av en sats. Alla andra `;` startar
  en kommentar, som i VA, så `lda #1 ; kommentar` fortsätter att fungera
- matematikbiblioteket (`sin`, `cos`, `tillradianer`, `tillgrader`, `runda`,
  `golv`, `kvadrat`, `pow`, `atan2`, `log10`, `slumpmässig` …), färgkonstanterna
  (`SVART` … `LJUSGRÅ`), opkodkonstanterna (`RTS`, `LDA_IMM`, `LDA_ZPX`,
  `JMP_IND`, `BNE_REL` …) och `asmCommandSize65()[X2]
- `BasicUpstart2(label)` med etiketten var som helst storlekarna når från `* =`
  (till exempel `* = $4000` … `start:` ger SYS 16384)
- omfång som i KickAssembler: `{ }` blocks, `.if` branches, `.for` / `.while`
  turns och makroanrop har sina egna etiketter och konstanter (en `loop:` inuti
  kolliderar inte med en yttre; `.pseudopc` är inget omfång). En etikett före
  omfånget gör de inre etiketterna åtkomliga: `namn: { … }` → `namn.inner`, `lp:
  .för (…)` → `lp[2].inner`, `myIf: .om (…)` → `myIf.inner`, `c1: Macro()` →
  `c1.inner`, `.etikett base = $1000 { … }` → `base.inner`
- `.namespace name { … }` och `.filenamespace name` (till slutet av filen):
  etiketterna kan nås som `name.label`; `@label:`, `.label @x = …`, `.function
  @f` / `.macro @m` placerar symbolen i roten, och `@name` refererar till
  rotsymbolen. Funktioner och makron syns överallt, även de i ett namnutrymme
  utan `@`
- `.pseudokommandonamn a : b { … }`: anropas som en mnemonisk kommandoteckne
  (`mov #10 : $1000`, `mov src,x : ($30),y`); Argumenten behåller sitt
  adresseringsläge (`getType()` = `AT_IMMEDIATE`, `AT_ABSOLUTE`, `AT_ABSOLUTEX`
  / `Y`, `AT_INDIRECT`, `AT_IZEROPAGEX` / `Y`, `AT_NONE` för ett saknat
  argument; `getValue()`), `CmdArgument(type, value)` skapar ett nytt. Ett
  pseudokommando med namnet mnemonik behöver kolon (`:adc …`); utan det sätts
  mnemoniken ihop.
- förprocessorn: `#define`, `#undef`, `#if` / `#elif` / `#else` / `#endif` (med
  `!`, `&&`, `||`), `#importif`
- `List()` (`add`, `get`, `set`, `size`, `remove`, `sort`, `reverse`, `shuffle`,
  `addAll`), `Hashtable()` (`put`, `get`, `containsKey`, `remove`, `nycklar`),
  `.struct Namn {a, b}` (`Namn(1, 2)`, `p.a`, `.eval p.a = 3`, `getFieldNames()`
  …), strings (`+`, `charAt`, `delsträng`, `storlek`, `tillVersals`,
  `somNumber(radix)` …, `tillIntString` / `tillHexString` / `toBinaryString` med
  en minsta storlek), `.enum {A, B, C = 5}`, `.define name, … { … }`, `.eval
  list.add(…)`, ett tecken i `.byte` och stränguttryck i `.text` (i den aktuella
  `.encoding`)
- `.fel "meddelande"`, `.felomvillkor, "meddelande"`; `.print` /
  `.printnow`-utdata visas i statusraden (det första meddelandet och antalet)
  och i sin helhet i **Bygginfo**. Ett `.om` som bara rapporterar (`.fel` …)
  hoppas över när dess villkor behöver etikettadresser.
- `LoadPicture("file"[, List().add($rrggbb, …)])` för GIF, PNG och JPG: `width`,
  `height`, `getPixel(x, y)`, `getSinglecolorByte(x, y)`, `getMulticolorByte(x,
  y)`; utan en färgtabell tas färgerna i den ordning de visas. Ett bildnamn som
  skickas i en variabel (`LoadPicture(filename)`) fungerar också.
- segments: `.segmentdef Namn [start, startAfter, align, min, max, fill,
  fillByte, segments, prgFiles, sidFiles, virtual, outPrg, outBin,
  modify="BasicUpstart", _start]`, `.segment Namn [params] "block"`,
  `.segmentout [segments=…]`, `.file [name=…, segments=…, allowOverlap]`, `.disk
  [filename=…, name=…] { [name=…, type=…, segments=…], … }`, `.memblock`. Ett
  segment utan `start` börjar på $2000 som i KickAssembler. **Run** startar
  standardsegmentet; när det är tomt, kommer den första PRG-utgången (den vid
  $0801) först. **Build project** skriver varje `.file` / `outPrg` / `outBin`
  bredvid startfilen och bygger `.disk`-avbildningen med c1541.
- `.fyllord n, uttryck`, `.lohifyll n, uttryck` (med en etikett: `namn.lo` /
  `namn.hi`); mnemoniska suffix `.im` / `.i`, `.z` / `.zp`, `.a` / `.abs`
- `.cpu _6502NoIllegals` / `_6502` (standard, med de ogiltigförklarade
  opkoderna) / `dtv` (`bra`, `sac`, `sir`) / `_65c02` (`(zp)`-läge, `bra`, `phx`
  / `phy` / `plx` / `ply`, `stz`, `trb`, `tsb`, `rmb0-7` / `smb0-7`, `bbr0-7` /
  `bbs0-7`, `stp`, `wai`, `inc` / `dec` A, `bit #`, `jmp (abs,x)`); varje
  illegal NMOS-opkod med alla dess lägen och andra namn (`sha` / `ahx`, `shx`,
  `shy`, `tas` / `shs`, `las` / `lae`, `xaa` / `ane`, `lxa`, `anc2`, `sbc2` …) —
  VA-assemblern känner också till dem
- `.break ["condition"]` och `.watch address[, end][, "store"]`: brytpunkter och
  bevakningar i VICE-symbolfilen (`break` / `watch`-rader, som KickAssembler
  skriver dem) och i RetroDebugger `.dbg`; `.break`-rader är också brytpunkter
  för **Debug**
- `Vektor(x, y, z)` (`+`, `-`, `*` tal- / punktprodukt, `/`, `X()` korsprodukt,
  `get(n)`, `getX()` …) och 4×4-matriser: `Matris()`, `Rotationsmatris(ax, ay,
  az)`, `Skalningsmatris`, `Flyttningsmatris`, `Perspektivmatris(z)`, `get(n,
  m)`, `set(n, m, v)`, matris × matris, matris × vektor
- `getNamespace()`; `.asserterror "namn", expression` och koden bildar `.assert
  "namn", { … }, { … }` / `.asserterror "namn", { … }` (resultaten är
  `.print`-meddelanden, som KickAssemblers assert-rapport); `* - label` i en
  konstant (`.label size = * - start`)
- `.modify` / `.filemodify` behöver ett KickAssembler Java-plugin: blocket
  assembleras utan modifieraren, med ett meddelande

Medan du skriver kontrolleras hela trädet: fel i den öppna filen markeras i
editorn, statusraden visar det första, och dialogrutan för kompileringsfel heter
`fil:rad` — ett klick öppnar filen på raden. Minneskartan visar det byggda
programmet, och cykelrännan visar cyklerna för den öppna filen (en rad som
rullas ut av `.för` eller ett makro som `4×8`: ett varv, åtta gånger; en
markering summeras varje varv). Titthintarna markerar raderna i den öppna filen;
panelerna Demontering och Övervakning visar det byggda programmet. Redigeraren
markerar KickAssembler-syntaxen (`#import`, `.segment`, script functions,
`!labels`, `;` inside `.for (…)`), och kompletteringen erbjuder Kick-direktiven
(`.`), förprocessorn (`#`) och scriptfunktionerna. Förprocessormeddelanden visas
i appens språk. **Debug** (RetroDebugger) hämtar en källkodskarta med
originalfilerna och raderna, läsbara symbolnamn (`scope.label`) och
brytpunkterna för varje öppen projektfil. Binära filer i projektträdet öppnas
inte som text. Dark Chambers C64-porten (19 källfiler, 15 binära filer) och alla
elva KickAssembler-exemplen med kodbyggnation byte för byte som KickAssembler
5.25.

## 6. Expertläge

Expertläge är en fullfjädrad direkttext-assembleringseditor i 6502 som finns
bredvid blockredigeraren. Varje flik kan vara i antingen blockläge eller
expertläge – du kan växla mellan dem fritt när som helst med hjälp av reglaget
**Block / Expert** i den översta fältet.

### Växlingslägen

Välj ikonen **UB** i huvudverktygsfältet för att växla till Ultimate
Basic-läget. Det valda redigeringsläget sparas även efter omstart av programmet.
En ny källa börjar med:

```basic
färg bg 0
färgkant 0

tryck "HEJ FRÅN ULTIMATE BASIC"
```

UB-läget fungerar med källfilerna `.ub`. **Ny**, **Öppna**, **Spara** och
**Spara som** används på den aktiva UB-fliken. Om du öppnar en `.ub`-fil
aktiveras den matchande redigeringsfliken automatiskt.

Verktygsfältet visar den aktuella UB-arbetsmappen. Denna mapp lagras separat
från Block/Expert-arbetsmappen. Medan UB-läget är aktivt väljer **Arkiv → Ange
arbetsmapp** UB-mappen; dess verktygstips identifierar det aktiva omfånget. UB:s
öppna/spara-dialogrutor börjar där, och osparade källor använder den som bas för
relativa sökvägar `include` och `incbin`.

### Redigerarlayout

UB-verktygsfältet följer samma visuella språk och anpassade verktygstips som
expertläget. Det erbjuder:

- syntaxmarkering baserad på den nuvarande Ultimate Basic-språkreferensen;
- radnummer som förblir synkroniserade med långa filer;
- en minikarta och zoomkontroller för redigeraren (`Ctrl` + mushjul zoomar
  också); klicka på minikartan för att hoppa eller dra dess visningsportval för
  kontinuerlig rullning;
- Sök (`Ctrl+F` / `Cmd+F`) med hjälp av expertsökfältet;
- källformatering med strukturmedveten indentering;
- autokomplettering för kommandon och inbyggda funktioner;
- en sökbar **Kommandon**-panel med syntax, beskrivning och
  användningsvägledning — beskrivningarna följer det aktuella gränssnittsspråket
  (ungerska, engelska, spanska, tyska, nederländska) och använder engelska för
  allt som ännu inte översatts;
- oberoende växlingsbara paneler för **Projekt** och **Kommandon**, som visas
  sida vid sida när båda är aktiverade;
- oberoende växlingsbara och storleksändrbara paneler **Bygg, utgång ** och
  **Demontering **.

Panelen Demontering innehåller en **Kopiera**-knapp som kopierar hela den visade
källan till urklipp. Kommandohjälpen följer den medföljande kompilatorn: till
exempel väljer `sprite_frame id, data_address [, frame]` en animeringsbild från
på varandra följande 64-byte sprite-frames.

Redigeraren förstår också QBasic-stilsyntaxen för Ultimate Basic 1.6.3: `dim
name as type`, `function … end function`, `sub … end sub`, `elseif`, `do … loop
[while | until]`, `while … wend`, `select case`, `exit do` / `exit for` / `exit
while` / `exit sub` / `exit function`, strängfunktionerna `left$` / `right$` /
`mid$`, och kommentarer som börjar med `'` samt `#` eller `rem`. Ord som
kompilatorn behandlar som nyckelord endast på en position färgas endast där och
förblir användbara som namn: `as` med BASIC-typnamnen (`byte`, `integer`,
`single`, `double`), `case is`, `map view`, `wait key` och `scroll`-alternativen
(`row`, `x`, `y`, `left`, `höger`, `smal`, `bred`). **Format** indrag
`function`, `do … loop`, `while … wend` och `elseif` block och lämnar enradiga
loopar (`do while c : … : loop`) oindragna, panelen Projekt listar `function`
block under Funktioner, och panelen Kommandon har **DIM**, **FUNCTION**,
**ELSEIF**, **DO**, **WEND**, **SELECT CASE**, **END**, **EXIT SUB**, **LEFT$**,
**RIGHT$** och **MID$** poster.

Kommandolistan är avsiktligt höjdbegränsad så att kommandodetaljkortet kan fylla
den återstående panelhöjden. Detaljområdet rullar oberoende för längre
syntaxbeskrivningar.

### Verktygsfältsknappar

Ultimate Basic-projekt använder `.proj`-filer och kan innehålla flera
`.ub`-källor. Projektpanelen listar öppna filer, markerar osparade flikar och
visar upptäckta etiketter, funktioner och subrutiner. Med projektåtgärder kan du
skapa, öppna, spara och stänga ett projekt eller lägga till en annan källfil. I
dialogrutan Versionskontroll kan du spara, jämföra och återställa alla filer i
projektet tillsammans – se [Projektläge](#project-mode). Ett nytt projekt kan
också starta från en UltimateBasic-mall – se
[Projektmallar](#project-templates).

Klicka på stjärnan bredvid en projektfil för att markera den som **startfilen**.
Kommandona Build, Run, D64, C64 Ultimate och Debug kompilerar den startkällan
även om en annan flik för närvarande är aktiv. Utan ett startval används den
aktiva UB-fliken.

Verktygsfältet i projektpanelen har två knappar för att lägga till, och
fildialogrutorna är som standard inställda på arbetsmappen **UB** (Meny → Arkiv
→ Ange arbetsmapp, UB-specifik):

- **Lägg till fil** — välj en eller flera filer samtidigt (valfri typ — `.ub`,
  `.bin`, `.prg`, bilder, teckensnitt, etc.). `.ub`-källor öppnas också som
  redigeringsflikar; allt annat läggs endast till som referens, för att
  `incbin`/`loadfile`-resurser ska kunna följa med projektet.
- **Lägg till mapp** — referera till en hel mapp (t.ex. en `incbin`
  resurskatalog som `fonts/`) så att den förblir kopplad till projektet.

Mappar i trädet har en pil för att fälla/expandera, och **högerklicka på en
mapp** för att lägga till en eller flera filer kapslade under den (visas
indragna). Varje post har en raderingsknapp (✕); poster som inte är `.ub` är
endast referensposter och öppnas inte genom att klicka på dem.

Knappen **Spara projekt** inaktiverar sig själv och visar statusen "Sparad" när
projektet inte har några väntande ändringar, och återaktiveras automatiskt i det
ögonblick du lägger till, tar bort eller omorganiserar en fil eller mapp.

### Expertredigerare minikarta

Expertredigerarens minikarta är en smal arbetsytremsa (`88 px`) längst till
höger i redigeringsområdet. Den återger en nedskalad representation av varje
källrad:

En **halvtransparent visningsindikator** (accentfärgad rektangel) visar vilken
del av källan som för närvarande är synlig. Klicka var som helst på minikartan
för att hoppa till den positionen; dra för att rulla kontinuerligt. Minikartan
rullar oberoende för att hålla visningsindikatorn centrerad. Tillståndet sparas
i användargränssnittsinställningarna (`expertMinimap`-tangent).

- Byggresultatet visas automatiskt;
- kompilatorfel återges i rött;
- den centrerade kompileringsdialogrutan visar felet;
- fel som innehåller en källrad, välj den raden i den aktiva UB-redigeraren.

Bygginfo rapporterar inläsnings-/slutadresser, kod- och PRG-storlekar,
Exomizer-status, variabler, arrayer, funktioner/subrutiner och etiketter.

### Kodstorlek per rad och tips

Verktygsfältsknappen **kodstorlek** (flamikon) visar, efter en build, hur många
byte varje källrad kompilerades till — numret placeras i radnummerrännan och en
orange stapel visar dess vikt mot den dyraste raden. Statusfältet lägger ihop
byten och ett uppskattat cykelantal (linjärt, loopar räknas inte) för raden
under markören.

Medan du skriver visas en **ledtrådar**-knapp i statusfältet när något ser fel
ut; klicka på den för att se listan och klicka på en ledtråd för att hoppa till
raden:

- `sys $EA31` / `sys $EA81` — `sys` kompileras till `JSR`, så KERNAL:s `RTI`
  återgår till skräpfilen; från en IRQ använd `irq_exit` eller `asm { JMP $EA31
  }`;
- `väntanyckel` — inte en dokumenterad form, använd `väntanyckel`;
- en `var` / `dim` / `const` som aldrig används;
- efter en build: en `asm`-blockinstruktion på en nollsidaadress som innehåller
  en Ultimate Basic-variabel eller körtidens egen nollsida.

### Fel vid markering

Rader som misslyckas med att kompilera markeras med **rött** (tonad bakgrund +
vänster accentkant) i realtid, 350 ms efter varje tangenttryckning. Det första
felmeddelandet visas också i statusfältet. Korrigera raden så försvinner
markeringen automatiskt.

| Körläge                 | Ultimat grundläggande beteende                                                                                                                      |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Kör som PRG**         | Kompilera och starta PRG direkt i VICE.                                                                                                             |
| **Kör via D64**         | Kompilera, öppna standarddialogrutan för D64-paketering och starta sedan disken i VICE.                                                             |
| **Kör på Ultimate**     | Ladda upp och kör PRG:en via den konfigurerade C64 Ultimate REST-anslutningen.                                                                      |
| **Kör D64 på hårdvara** | Paketera en D64 och skicka den till den konfigurerade C64 Ultimate.                                                                                 |
| **Kung Fu Flash 2**     | Kompilera UB-startkällan och ladda upp PRG:n via USB till en riktig C64/C128 med en Kung Fu Flash 2-pickup. Se [Kung Fu Flash 2](#kung-fu-flash-2). |

Det globala alternativet **Inställningar → Exomizer** gäller även för UB-byggen
och normala körmål; ingen separat UB-verktygsfältsväxling behövs.
Felsökarstarter använder avsiktligt den okomprimerade PRG så att
kompilatoradresser och symboler fortsätter att matcha det körda programmet.

Aktivera **Inställningar → Programinställningar → Generera UltimateBasic
ASM-källa (.asm)** för att spara den kompilatorgenererade assemblyn bredvid en
PRG- eller D64-byggfil med samma basfilnamn. Detta är ett byggalternativ, så
UB-verktygsfältet innehåller inte separata ASM-exportknappar. En `load "NAME",
$address`-sats levererar också den matchande D64-extrafilens
PRG-laddningsadress.

### Syntaxmarkering

Redigeraren använder ett transparent `<div>`-överlägg (`expert-hl`) som speglar
textområdets innehåll med färgade `<span>`-element. Markering kan avaktiveras
med knappen **HL** för prestanda i mycket stora program.

- `.sym` för symboler i KickAssembler-stil;
- `.dbg` för C64Debugger/RetroDebugger-käll- och segmentinformation;
- `.vs` för VICE-skärmetiketter.

Direktiven `REGION` / `ENDREGION` markeras precis som de andra
assemblerdirektiven. Komprimerade regioner behåller endast regionrubriken synlig
i redigeraren tills du öppnar dem igen. Den nya verktygsfältsknappen
**Regionsval** styr endast den automatiska markeringen av aktuell region i
expertläge; om den stängs av förblir källan synlig utan att ändra vikningsläget.

### Källformaterare

Klicka på knappen **Formatera** (`#expert-format-btn`) för att formatera den
aktuella källan automatiskt:

Ultimate Basic finns även tillgängligt som ett fristående projekt med öppen
källkod:

<https://github.com/zstarczali/UltimateBasic>

Kompilatorn är inbyggd i Visual Assembler, så ingen separat `ub` körbar fil
krävs vid körning.

## 7. Adresseringslägen

Varje 6502-instruktion stöder ett eller flera adresseringslägen. Lägesväljaren
visas på varje block.

### Märk uttryck som operander

- **Block → Expert:** det aktuella programmet serialiseras till text (en
  instruktion per rad, etiketter, makron som direktiv). Redigeringar i
  expertläge synkroniseras tillbaka till blockmatrisen när du växlar tillbaka
  eller utlöser en åtgärd.
- **Expert → Block:** texten tolkas med `parseAsmText()` och resultatet ersätter
  blockprogrammet. En dialogruta med kompileringsfel visas om tolkningen
  misslyckas.
- **Blanka linjer** bevaras genom tur och retur: tomma linjer i
  expertredigeraren visas som tunna streckade distanser i blockläge och
  återställs som tomma linjer när man växlar tillbaka till expertläge.

### Programräknaren `*` i uttryck

```
┌──────────────────────────────────────────────────────────┐
│ [verktygsfält] Blockera │ Expert < tabbväxling │
├──────────────┬──────────────────────────────────┬──────────────┤
│ Palett │ ASM-textredigerare │ Disasm │
│ (valfri) │ (monospace, redigerbar) │ panel │
│ │ │ (valfri) │
└─────────────┴────────────────────────────────────┴──────────────┘
```

| Panel         | Växla                | Beskrivning                                            |
| ------------- | -------------------- | ------------------------------------------------------ |
| **Palett**    | `#expert-palett-btn` | Förgrening till sig själv (oändlig loop, offset `$FE`) |
| `*-n` / `*+n` | `BNE *-5`, `BEQ *+4` | Gren relativt till den aktuella datorn med *n* byte    |
| `JMP *+n`     | `#expert-disasm-btn` | Absolut hopp beräknat från den aktuella datorn         |

### Lokala (prickade) etiketter

| Knapp                                  | ID                                                | Fungera                                                                                                                                                                                                                            |
| -------------------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Format**                             | `#expert-format-btn`                              | Autoformatera källa (etiketter till kolumn 0, 4-mellanslags indent, 1-mellanslags mnemonisk/operand)                                                                                                                               |
| **Ladda .asm**                         | `#expert-load-asm-btn`                            | Öppna en `.asm`-fil — innehållet laddas till en **ny flik** med filnamnet som fliketikett. Varje laddad fil blir en oberoende flik med sina egna programblock och redigeringsstatus.                                               |
| **Spara .asm**                         | `#expert-save-asm-btn`                            | Spara redigeringsinnehåll till en `.asm`-fil (fildialogruta vid första sparningen)                                                                                                                                                 |
| **Bygginformation**                    | `#expert-bygg-info-btn`                           | Öppna dialogrutan Bygginfo: ursprung, slut, storlek och segmentantal överst, sedan segmenten, felen (`fil:rad` i ett Kick-projekt) och `.print` utdata, och etiketterna, konstanterna och makrona i kolumnerna.                    |
| **HL**                                 | `#expert-hl-btn`                                  | Aktivera syntaxmarkering (avaktivera för mycket stora filer)                                                                                                                                                                       |
| **Autokomplettera**                    | `#expert-autocomplete-btn`                        | Aktivera/avaktivera expertförslag för autoslutförande. När det är inaktiverat visas inga direktiv, mnemonik eller etikettfönster i expertredigeraren.                                                                              |
| **Regionsval**                         | `#expert-region-val-btn`                          | Aktivera automatisk markering av regioner i expertläge. Vikningsläget förblir lagrat, men när det är avstängt håller redigeraren hela källan synlig och väljer inte automatiskt den aktuella regionen.                             |
| **Komprimera/expandera alla regioner** | `#expert-region-vik-alla-btn`                     | Vik eller vik ut varje `.region`-block med ett enda klick. Om någon region är öppen komprimeras alla; om alla regioner redan är komprimerade expanderas alla med nästa klick. Knappen lyser upp när alla regioner är komprimerade. |
| ** Radnummer **                        | `#expert-linjenummer-btn`                         | Aktivera radnummermarginalen på vänster sida av redigeraren. Mellanmarginalen är synkroniserad med rullningspositionen och uppdateras live medan du skriver.                                                                       |
| **Hitta**                              | `#expert-hitta-btn`                               | Öppna den flytande sökfältet (`Ctrl+F`). Skriv för att söka; träffar markeras i överlägget. `Enter` / `Shift+Enter` navigerar mellan träffar. `Escape` stänger fältet.                                                             |
| **Zooma ut/in**                        | `#expert-zoom-ut-knapp` / `#expert-zoom-in-knapp` | Minska/öka redigerarens teckenstorlek (8–28 px). `Ctrl` + mushjul (`Cmd` + hjul på macOS, eller nyp med pekplattan) över redigeraren gör detsamma. Inställningen sparas.                                                           |
| **Palett**                             | `#expert-palett-btn`                              | Visa/dölj den vänstra mnemoniska paletten                                                                                                                                                                                          |
| **Diasm**                              | `#expert-disasm-btn`                              | Visa/dölj demonteringspanelen (pure 6502, makron expanderade)                                                                                                                                                                      |
| **Skärm**                              | `#expert-monitor-btn`                             | Visa/dölj skärmens hex-dump-panel                                                                                                                                                                                                  |
| **Minikarta**                          | `#expert-minimap-btn`                             | Visa/dölj kodminimap-remsan på höger sida av redigeraren                                                                                                                                                                           |

*(Nytt i 2.3.9.)* En etikett vars namn börjar med en punkt — `.loop`, `.skip`,
`.done` — är en **lokal etikett**. Den tillhör omfånget för den närmaste
föregående **globala** (icke-prickade) etiketten och blir internt
`<global>.<namn>`. Två lokala etiketter med samma korta namn under olika globala
etiketter kolliderar **inte**.

### Operandetiketter för självmodifierande kod

*(Nytt i 2.3.9.)* Sätt prefixet `label:` på en instruktions operand för att
placera en etikett på **operandbyte** snarare än opkoden. Instruktionen samlas
från det som följer efter kolon.

| Färg på stapeln | Tokentyp                                             |
| --------------- | ---------------------------------------------------- |
| Kommentarfärg   | Rader som börjar med `;`                             |
| Etikettfärg     | Rader med en `etikett:`-definition                   |
| Direktivfärg    | `.byte`, `.macro`, `.region` och alla andra direktiv |
| Mnemonisk färg  | Allt annat (instruktioner)                           |

`värde` pekar på `<instruktionsadress> + 1` (den första operandbyten), för varje
adresseringsläge. Detta ersätter det äldre `STA-instruktionsmönstret + 1` / `:
LDA #$00`-mönstret. Det går igenom Block ⇄ Expertläge (operandfältet behåller
prefixet `etikett:`).

### Cykelräkningar

Verktygsfältsknappen **cykelantal** (klockikon) lägger till en mellanränna som
visar de 6510 cyklerna för varje instruktionsrad:

| Visad       | Menande                                                                                                                             |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `4`         | fast kostnad                                                                                                                        |
| `4+`        | Indexerad läsning (`abs,X`, `abs,Y`, `(zp),Y`): +1 när indexet korsar en sida; en sidjusterad bas (`$xx00`) visar det exakta värdet |
| `2/3`       | gren: inte tagen / tagen                                                                                                            |
| `2/4` (röd) | tagen gren som korsar en sida — värt att veta i tidskod                                                                             |

Markera flera rader så visar statusfältet summan: antal instruktioner,
min-max-cykler och hur många PAL-rasterlinjer (63 cykler) det är. Makron och
datalinjer räknas inte. Inställningen sparas.

### Optimeringstips

Expertredigeraren kontrollerar den sammansatta koden för vanliga
titthålsmönster. Linjer med en ledtråd får en gul rand och en **N
ledtrådar**-knapp visas i statusfältet; klicka på den för listan och klicka på
en ledtråd för att hoppa till raden. Ledtrådar ändrar aldrig din kod:

- `JSR x` följt av `RTS` → `JMP x` (1 byte kortare, 9 cykler snabbare);
- `CMP #0` / `CPX #0` / `CPY #0` direkt efter en instruktion som redan har satt
  N/Z för det registret (obs: jämförelsen ställer även in C);
- samma last två gånger, eller en last med det värde som just lagrats (`STA x` /
  `LDA x`);
- `LDA m` / `CLC` / `ADC #1` / `STA m` → `INC m`, och `SEC` / `SBC #1` formen →
  `DEC m`;
- en `JMP` eller förgrening till nästa instruktion, och `PHA` omedelbart följt
  av `PLA`.

En etikett mellan två instruktioner (ett möjligt hoppmål) undertrycker tipsen
som skulle sammanfoga dem.

### Fel vid markering

Rader som misslyckas med att kompilera markeras med **rött** (tonad bakgrund +
vänster accentkant) i realtid, 350 ms efter varje tangenttryckning. Det första
felmeddelandet visas också i statusfältet. Korrigera raden så försvinner
markeringen automatiskt.

### Syntaxmarkering

Redigeraren använder ett transparent `<div>`-överlägg (`expert-hl`) som speglar
textområdets innehåll med färgade `<span>`-element. Markering kan avaktiveras
med knappen **HL** för prestanda i mycket stora program.

| Färg     | Tecken                                                                                                                                                   |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gulgrön  | Mnemonik (`LDA`, `STA`, `JMP`, …) och långgreniga pseudo-operationer (`LBNE`, `LBEQ`, …)                                                                 |
| Blå      | Direktiv (`.byte`, `.word`, `.fill`, `.assert`, `*=`, …)                                                                                                 |
| Orange   | Tal (`$FF`, `%1010`, `255`)                                                                                                                              |
| Cyan     | Etiketter — rader som slutar på `:`, inklusive lokala etiketter (`.loop:`) och operandetiketter för självmodifierande kod (`value:` in `LDA value:#$00`) |
| Kricka   | Strängliteraler                                                                                                                                          |
| Violett  | Anpassade makronamn — namnet efter `.macro`, `.invoke` och `.call`, och Kick-anrop av `:name(...)`                                                       |
| Vatten   | Makroparametrar — parameternamnen i `.macro`-rubriken och `{param}`-substitutionerna i makrotexten                                                       |
| Mörkgrön | Kommentarer (`; …`)                                                                                                                                      |

Direktiven `REGION` / `ENDREGION` markeras precis som de andra
assemblerdirektiven. Komprimerade regioner behåller endast regionrubriken synlig
i redigeraren tills du öppnar dem igen. Den nya verktygsfältsknappen
**Regionsval** styr endast den automatiska markeringen av aktuell region i
expertläge; om den stängs av förblir källan synlig utan att ändra vikningsläget.

### Källformaterare

Klicka på knappen **Formatera** (`#expert-format-btn`) för att formatera den
aktuella källan automatiskt:

- Etikettdefinitionerna flyttas till kolumn 0.
- Instruktionerna är indragna med fyra mellanslag.
- Mnemonik är skrivna med versaler.
- Exakt ett mellanslag mellan mnemonik och operand (extra blanksteg
  normaliseras).
- Om källan redan är formaterad visas statusen `"Redan formaterad"`.

### Projektpanel och flikar

Expertläget stöder en **projektpanel** (`#expert-project-panel`) för projekt med
flera filer `.proj`:

- En `.proj`-fil är ett JSON-manifest som listar källfiler och deras metadata.
- Öppna ett projekt med **Meny → Arkiv → Öppna projekt** eller dra en
  `.proj`-fil till fönstret.
- Varje fil i projektet öppnas som en separat **flik** i flikfältet högst upp i
  redigeraren.
- **Stäng projekt** (`Meny → Arkiv → Stäng projekt` / `#menu-close-project`)
  stänger det aktuella projektet och alla dess filmlikar samtidigt. Uppmanar dig
  att spara eventuella osparade ändringar innan stängning. Projektpanelen
  återställs till sitt tomma tillstånd och `_expertProjectData` rensas.
- Varje fil kan markeras som **startfilen** (★ stjärnikon). När en startfil är
  inställd, samlar och kör knappen **Kör** (PRG, D64, Ultimate) alltid filens
  kod – oavsett vilken flik som är aktiv för närvarande. Detta fungerar i både
  blockläge och expertläge.
- Verktygsfältets knapp **Lägg till** väljer en eller flera filer samtidigt
  (valfri typ, inte bara `.json`/`.asm`) och refererar till dem i projektet utan
  att öppna dem — använd den för binära resurser som `incbin` data. Dess
  dialogruta är som standard VA-arbetsmappen. Den intilliggande knappen **Lägg
  till mapp** refererar till en hel mapp (t.ex. en resurskatalog) på samma sätt.
  Referensposter visar en raderingsknapp (✕) men öppnas inte genom att klicka på
  dem.
- **Projektinställningar** (kugghjulsknappen i panelrubriken, eller **Meny →
  Arkiv → Projektinställningar…**) visar och redigerar projektet: namn, `.proj`
  sökväg, startfil, assembler (VMA eller ACME), **KickAssembler-kompatibel**,
  och för ett Kick-projekt preprocessorsymbolerna (`#define`, som KickAssemblers
  `-define`) och kommandoradsvariablerna (`cmdLineVars`, en `name=value` per
  rad, som `:name=value`), plus antalet källfiler och andra filer, och
  **Expertläge endast **: blockläget är stängt för projektets filer, oavsett
  storlek. Allt sparas i `.proj`.
- Mappar i trädet har en pil för att fälla/expandera, och **högerklicka på en
  mapp ** för att lägga till en eller flera filer kapslade under den (visas
  indragna).
- Knappen **Spara projekt** inaktiverar sig själv och visar statusen "Sparad"
  när projektet inte har några väntande ändringar, och återaktiveras automatiskt
  i det ögonblick du lägger till, tar bort eller omorganiserar en fil eller
  mapp.
- Avsnittet **symboler** längst ner i projektpanelen kan ändras i storlek
  vertikalt med avdelaren mellan filträdet och symbollistan, så långa
  symbollistor kan ta upp mer plats vid behov.
- **Versionskontroll** fungerar för hela projektet: med knappen **Projekt** i
  dialogrutan för versionskontroll registrerar en commit varje projektfil, och
  utcheckningen återställer dem alla till flikarna. Se
  [Projektläge](#project-mode).

### Flikfält

Flikfältet visas ovanför redigeraren när det finns mer än en flik öppen.

| Särdrag             | Beskrivning                                                                                                                                                                                                                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Smutsig prick**   | En liten accentfärgad prick på fliknamnet indikerar osparade ändringar                                                                                                                                                                                                                      |
| **Scrollpilar**     | Vänster/höger rullningsknappar visas när det finns fler flikar än vad som får plats i fältet                                                                                                                                                                                                |
| **Stäng (×)**       | Stänger fliken; uppmanar att spara om fliken är smutsig                                                                                                                                                                                                                                     |
| **Filändelse**      | Det fullständiga filnamnet inklusive filändelsen (`.c64va`, `.json`) visas.                                                                                                                                                                                                                 |
| **Ctrl+N**          | Öppnar en ny, tom flik (inte när en modaldialogruta är öppen)                                                                                                                                                                                                                               |
| **Högerklicksmeny** | Högerklicka på en flik (eller ett tomt flikfält) för: **Ny flik**, **Stäng fliken**, **Stäng andra flikar**, **Stäng flikar till höger**, **Stäng alla flikar**. Batchstängningsåtgärder frågar efter felaktig flik och stoppar om du avbryter. **Stäng alla** behåller alltid en tom flik. |

> **Tips:** Palettsynkronisering (`#expert-palette-sync-btn`) håller palettvalet
> synkroniserat med mnemoniken vid markören. Inaktivera funktionen när du
> föredrar att paletten inte ska hoppa runt när du redigerar.

### ACME-läge

**Inställningar → Allmänt → Assemblerläge ** väljer assemblern för
expertredigeraren:

- **VMA-läge** (standard) — den inbyggda assemblern i Visual Assembler med dess
  block, makron och `.`-direktiv.
- **ACME-läge** — källan är ACME 0.97-text och byggs av den ACME-körbara filen
  som finns i **Inställningar → Filer och sökvägar → ACME** (**Välj ACME**).
  `ACME-0.97-reference.pdf` beskriver språket.

Läget sparas med ett `.proj`-projekt, så varje projekt öppnas med sin egen
assembler. ACME-läget är endast textredigering: Block / Expert-knappen är låst
och knappen **Handledningar** är dold (lektionerna bygger VMA-program från
block).

Vad som följer efter ACME-bygget:

- **Bygg** (hammarknappen i expertverktygsfältet, *Bygg ACME-källkod*), **Kör**
  (PRG, D64, C64 Ultimate, Kung Fu Flash 2), **Spara PRG**, **Bygg D64**, **Bygg
  CRT**, **Bygg projekt** och **Felsök (RetroDebugger)** kompileras via ACME;
  ACME-fel och varningar öppnas i den vanliga dialogrutan för kompileringsfel,
  med källkodsraden.
- Efter en skrivpaus återuppbyggs källkoden, så **minneskartan** (minnesremsa,
  segmentpanel, överlappningsvarning), panelerna **Demontering** och **Skärm**
  samt cykelrännan visar den verkliga ACME-utmatningen; panelerna använder
  ACME-etiketterna. En överlappning är en adress som två källrader skriver (den
  senare vinner i PRG).
- **Felsökningsfiler** (*Generera felsökningsfiler* i Inställningar → Allmänt)
  skapas från ACME-etikettdumpen: `.sym` (KickAssembler-stil) och `.vs`
  (VICE-etiketter) bredvid PRG; det finns ingen `.dbg`-källkodskarta i
  ACME-läge. **Felsökning (RetroDebugger)** får samma etiketter, och
  expertbrytpunkterna placeras av ACME-rapporten (en brytpunkt på en rad utan
  kodstopp vid nästa kodrad).
- **Cykelantal** och **optimeringstips** kommer från ACME-rapporten (`-r`) för
  den senaste versionen.
- **VICE Monitor** hot reload skriver bara de adressintervall som ACME verkligen
  har byggt; livewatch och profiler använder ACME-etiketter och källrader.
- **Export till block** i SID-, Hi-Res-, Level-, Curve- och Table-editorerna
  infogar ACME-källan i slutet av filen (`!byte`, `!word`, `!fill`, `NAME =
  value`; VA-makron skrivs ut som instruktioner).

Markering och autokomplettering känner till ACME-syntaxen: `!` pseudo-opkoder,
`+namn` makroanrop, etiketter utan kolon, anonyma `-` / `+` etiketter och `;`
kommentarer. Ett VMA-direktiv (`.byte`, `.macro` …) i ACME-källan och ett ACME
`!`-direktiv i VMA-källan rapporteras som fel.

```asm
* = $c000
start ldx #0
- lda text,x beq + sta $0400,x inx bne -
+ rts
text !scr "hej acme", 0
```

`samples/acme-crt-demo.asm` är ett litet ACME-testprogram för Run, Build PRG /
D64 och Build CRT: ett meddelande mitt på skärmen och rasterfärgband i kanten,
utan KERNAL-anrop, så det körs också från patronen.

---

## 8. Standard 6502 Instruktioner

Varje 6502-instruktion stöder ett eller flera adresseringslägen. Lägesväljaren
visas på varje block.

| Läge              | Märka           | Exempel         | Beskrivning                                                             |
| ----------------- | --------------- | --------------- | ----------------------------------------------------------------------- |
| **underförstått** | Underförstådd   | `NOP`           | Ingen operand; instruktionen är fristående                              |
| **omedelbart**    | Omedelbar       | `LDA #$FF`      | Inline-konstant; assemblern lägger till `#` automatiskt                 |
| **nollSida**      | Noll sida       | `LDA 10 dollar` | Enkelbyteadress på sidan noll (0–255)                                   |
| **nollSidaX**     | Noll sida, X    | `LDA $10,X`     | Noll sidadress + X-registerförskjutning (resultatet omsluter sidan 0)   |
| **nollSidaY**     | Noll sida, Y    | `LDX $FB,Y`     | Noll sidadress + Y-registerförskjutning                                 |
| **absolut**       | Absolut         | `LDA $0400`     | Fullständig 16-bitars minnesadress                                      |
| **absolutX**      | Absolut, X      | `LDA $0400,X`   | 16-bitars adress + X-registerförskjutning                               |
| **absolutY**      | Absolut, Y      | `LDA $0400,Y`   | 16-bitars adress + Y-registerförskjutning                               |
| **släkting**      | Relativ/Etikett | `BNE-slinga`    | För instruktioner för filialen; ange ett etikettnamn eller en måladress |
| **indirektX**     | Indirekt, X     | `LDA ($FB,X)`   | Noll sidindexerad indirekt (operand = noll sidadress, 1 byte)           |
| **indirektY**     | Indirekt, Y     | `LDA ($FB),Y`   | Noll sid indirekt indexerad (operand = noll sidadress, 1 byte)          |
| **indirekt**      | Indirekt        | `JMP ($0100)`   | Indirekt; endast användbar med JMP                                      |

### Dataförflyttning

Alla operandfält som accepterar en adress eller ett omedelbart värde accepterar
också en **konstant name** (från ett `CONST`-block eller ett `LABEL`) direkt.
Dessutom kan du använda uttrycken **label+offset** eller **label−offset** för
att referera till en adress relativt till en namngiven konstant:

| Syntax | Exempel           | Beskrivning                                                                                                       |
| ------ | ----------------- | ----------------------------------------------------------------------------------------------------------------- |
| `LDA`  | Lastackumulator   | omedelbar, nollSida, absolut, absolutX, absolutY, indirektX, indirektY                                            |
| `LDX`  | Ladda X-register  | omedelbar, nollSida, nollSidaY, absolut, absolutY                                                                 |
| `LDY`  | Ladda Y-register  | omedelbar, nollSida, absolut, absolutX                                                                            |
| `STA`  | Butiksackumulator | nollSida, absolut, absolutX, absolutY, indirektX, indirektY                                                       |
| `STX`  | Lagra X-register  | nollSida, nollSidaY, absolut                                                                                      |
| `STY`  | Lagra Y-register  | nollSida, absolut                                                                                                 |
| `*`    | `BNE *`           | Aktuell programräknare (instruktionens egen adress); grenar med `*` genererar en oändlig självloop (offset `$FE`) |

**Exempel — rensa två skärmsidor med hjälp av en CONST:**
```
; .CONST screen_ram = $0400 LDX #$00
clear: STA screen_ram,X STA screen_ram+$0100,X DEX BNE clear
```

### Aritmetisk

*(Nytt i 2.3.9.)* `*` är inte längre begränsat till att vara hela operanden —
den kan förekomma **var som helst i ett operanduttryck**, och står för adressen
till instruktionen den är skriven på. Den löses upp vid monteringstillfället mot
instruktionens verkliga adress, så ingen etikett behövs för korta relativa hopp
eller PC-relativa dataläsningar.

| Syntax | Exempel               | Menande                                                           |
| ------ | --------------------- | ----------------------------------------------------------------- |
| `*`    | `BNE *`               | Ställ in bärfunktionen med `SEC` före användning i de flesta fall |
| `SBC`  | Subtrahera med bäring | Sätt carry med `SEC` före subtraktion                             |
| `INC`  | Öka minnet            | —                                                                 |
| `DEC`  | Minska minnet         | —                                                                 |
| `CMP`  | Jämför med A          | Sätter flaggor; ändrar inte A                                     |

**PC vs. multiplikation.** `*` behandlas som programräknaren endast när den
sitter i *värdepositionen* — i början av uttrycket, eller direkt efter en
operator, `(`, `,`, `<`, `>` eller blanksteg. En `*` som följer ett tal, `)`
eller en identifierare är vanlig multiplikation, så `LDA-tabellen*2` och
`CONST_A*4` är oförändrade.

**Där det fungerar.** Alla operander som redan accepterar ett uttryck: branch
targets, `JMP` / `JSR`, `LDA`/`STA`/… absoluta och indexerade, omedelbara
operatorer för låg/hög byte och uttrycket `.assert`. `*` ändrar aldrig en
instruktions storlek, så den är säker i alla adresseringslägen.

### Logik

*(Nytt i 2.3.9.)* En etikett vars namn börjar med en punkt — `.loop`, `.skip`,
`.done` — är en **lokal etikett**. Den tillhör omfånget för den närmaste
föregående **globala** (icke-prickade) etiketten och blir internt
`<global>.<namn>`. Två lokala etiketter med samma korta namn under olika globala
etiketter kolliderar **inte**.

```
DrawSprite:
LDX #0
.loop: ; == DrawSprite.loop
LDA SpriteData,X
STA $2000,X
INX
CPX #63
BNE .loop ; löses inom DrawSprite RTS

ClearScreen:
LDX #0
.loop: ; == ClearScreen.loop — ingen kollision
STA $0400,X
INX
BNE .loop
RTS
```

- Inom ett omfång, referera till en lokal etikett som `.namn`.
- Från ett annat scope, referera det explicit som `Global.name` (t.ex. `JMP
  ClearScreen.loop`).
- Ett `.namn` som skrivs före en global etikett förblir ett vanligt `.namn` på
  toppnivå.
- Lokala etiketter går igenom Block ⇄ Expertläge oförändrade; prefixet
  `<global>.` är en detalj vid layouttid och lagras aldrig i blockprogrammet.

### Hopp och grenar

*(Nytt i 2.3.9.)* Sätt prefixet `label:` på en instruktions operand för att
placera en etikett på **operandbyte** snarare än opkoden. Instruktionen samlas
från det som följer efter kolon.

```
setup:
LDA-värde:#$00; 'värde' -> adress för operandbyten #$00
...
patch:
LDA #new STA-värde; skriver operandbyten direkt — klassisk SMC
```

`värde` pekar på `<instruktionsadress> + 1` (den första operandbyten), för varje
adresseringsläge. Detta ersätter det äldre `STA-instruktionsmönstret + 1` / `:
LDA #$00`-mönstret. Det går igenom Block ⇄ Expertläge (operandfältet behåller
prefixet `etikett:`).

---

## 9. Makroblock — Referens

### LABEL

| Mnemonisk   | Beskrivning                                          | Lägen                                                                  |
| ----------- | ---------------------------------------------------- | ---------------------------------------------------------------------- |
| Etikettnamn | Identifierare som används i `JMP`, `JSR`, `BNE` etc. | omedelbar, nollSida, absolut, absolutX, absolutY, indirektX, indirektY |
| `LDX`       | Ladda X-register                                     | omedelbar, nollSida, nollSidaY, absolut, absolutY                      |
| `LDY`       | Ladda Y-register                                     | omedelbar, nollSida, absolut, absolutX                                 |
| `STA`       | Butiksackumulator                                    | nollSida, absolut, absolutX, absolutY, indirektX, indirektY            |
| `STX`       | Lagra X-register                                     | nollSida, nollSidaY, absolut                                           |
| `STY`       | Lagra Y-register                                     | nollSida, absolut                                                      |

### COMMENT

| Mnemonisk | Beskrivning           | Anteckningar                                                      |
| --------- | --------------------- | ----------------------------------------------------------------- |
| `ADC`     | Lägg till med bär     | Ställ in bärfunktionen med `SEC` före användning i de flesta fall |
| `SBC`     | Subtrahera med bäring | Sätt carry med `SEC` före subtraktion                             |
| `INC`     | Öka minnet            | —                                                                 |
| `DEC`     | Minska minnet         | —                                                                 |
| `CMP`     | Jämför med A          | Sätter flaggor; ändrar inte A                                     |
| `CPX`     | Jämför med X          | —                                                                 |
| `CPY`     | Jämför med Y          | —                                                                 |

### BYTE

| Mnemonisk | Beskrivning                                                          |
| --------- | -------------------------------------------------------------------- |
| Operand   | Kommaavgränsade bytevärden (t.ex. `$01, $02, $FF` eller `1, 2, 255`) |
| `ORA`     | Logiskt ELLER med ackumulator                                        |
| `EOR`     | Exklusiv ELLER med ackumulator                                       |
| `BIT`     | Testbitar i minnet mot A (sätter N-, V-, Z-flaggor)                  |

### WORD

| Mnemonisk | Beskrivning                                            |
| --------- | ------------------------------------------------------ |
| Operand   | Kommaavgränsade 16-bitarsvärden (t.ex. `$0400, $C000`) |
| `JSR`     | Hoppa till subrutin (sparar returadress på stacken)    |
| `RTS`     | Återgå från subrutin                                   |
| `RTI`     | Återgång från avbrott                                  |
| `BNE`     | Gren om inte lika (Z=0)                                |
| `BEQ`     | Gren om lika (Z=1)                                     |
| `BCC`     | Förgrena sig om överföringen är klar (C=0)             |
| `BCS`     | Förgrening om bäruppsättning (C=1)                     |
| `BMI`     | Gren om Minus (N=1)                                    |
| `BPL`     | Gren om Plus (N=0)                                     |
| `BVC`     | Gren vid överflöde Rensa (V=0)                         |
| `BVS`     | Gren om överflöde inställt (V=1)                       |

#### LBNE / LBEQ / … (Långa grenar)

*(Nytt i 2.3.9.)* Paletten **Långa grenar** innehåller åtta pseudo-operationer
som beter sig som villkorliga grenar men når **valfri adress**, inte bara
−128…+127. Var och en samlas till en inverterad gren som hoppar över en 3-byte
`JMP` — alltid **5 byte**:

```
LBEQ klar; monteras till: BNE *+3 ($D0 $03)
; JMP klar ($4C lågt värde)
```

| Lång operation | Skick                       | Utsänd som           |
| -------------- | --------------------------- | -------------------- |
| `LBNE`         | inte lika med (Z=0)         | `BEQ *+3 / JMP-mål`  |
| `LBEQ`         | lika med (Z=1)              | `BNE *+3 / JMP-mål`  |
| `LBCC`         | klar bärning (C=0)          | `BCS *+3 / JMP-mål ` |
| `LBCS`         | bäruppsättning (C=1)        | `BCC *+3 / JMP-mål`  |
| `LBMI`         | minus (N=1)                 | `BPL *+3 / JMP-mål ` |
| `LBPL`         | plus (N=0)                  | `BMI *+3 / JMP-mål ` |
| `LBVC`         | överflödesrensning (V=0)    | `BVS *+3 / JMP-mål`  |
| `LBVS`         | överflödesuppsättning (V=1) | `BVC *+3 / JMP-mål ` |

- Operand: en etikett, ett `*`-uttryck eller en litteral adress — samma som ett
  normalt grenmål.
- Kostnad: 5 byte och 1 extra cykel på den tagna vägen jämfört med en kort gren.
  Det sker ingen automatisk befordran av en kort gren — du väljer `LBxx`
  explicit.
- När en vanlig gren (`BNE`, `BEQ`, …) är utanför intervallet, namnger
  kompileringsfelet nu den exakta överskridningen och föreslår matchande `LBxx`.

### FILL

| Mnemonisk | Beskrivning                                            |
| --------- | ------------------------------------------------------ |
| Operand   | `antal,värde` — t.ex. `256,0` fyller 256 byte med noll |
| `TAY`     | Överför A → Y                                          |
| `TXA`     | Överför X → A                                          |
| `TYA`     | Överför Y → A                                          |
| `TSX`     | Överför stackpekare → X                                |
| `TXS`     | Överför X → Stackpekare                                |
| `INX`     | Steg X                                                 |
| `DEX`     | Minska X                                               |
| `INY`     | Ökning Y                                               |
| `DEY`     | Minska Y                                               |

### ALIGN

| Mnemonisk | Beskrivning                                                                 |
| --------- | --------------------------------------------------------------------------- |
| Gräns     | Justeringsvärde — t.ex. `64` (spritegräns), `256` (sida), `$2000` (bitmapp) |
| `LSR`     | Logisk skiftning åt höger                                                   |
| `ROL`     | Rotera vänster genom bärning                                                |
| `ROR`     | Rotera höger genom bärning                                                  |

### TEXT

| Mnemonisk          | Beskrivning                                                   |
| ------------------ | ------------------------------------------------------------- |
| Text               | Strängen som ska visas                                        |
| X                  | Kolumn (0–39)                                                 |
| Y                  | Rad (0–24)                                                    |
| Etikett (valfritt) | Tilldelar en etikett som pekar på den beräknade skärmadressen |

### STRING

| Mnemonisk                 | Beskrivning                                                                 |
| ------------------------- | --------------------------------------------------------------------------- |
| Text                      | Strängen att skriva                                                         |
| Adress                    | Målminnesadress — `$C000` hexagon eller ett **etikettnamn**                 |
| Etikett (valfritt)        | Tilldelar en etikett som pekar mot måladressen                              |
| Flytta                    | Hexvärde (00–FF) läggs till varje skärmkodbyte (t.ex. `$80` = omvänd video) |
| Gemener teckenuppsättning | Kryssruta — samma semantik som TEXT (se avsnittet TEXT)                     |
| `SED`                     | Ställ in decimalläge                                                        |
| `SEI`                     | Ställ in avbrottsavstängning                                                |
| `NOP`                     | Ingen operation                                                             |
| `BRK`                     | Tvingat avbrott / programvaruavbrott                                        |

### DATA

Som en **POKE-loop** — skriver en lista med råa byte till en minnesadress vid
körning, ett LDA/STA-par per byte.

`LAX`, `SAX`, `DCP`, `ISC`, `SLO`, `RLA`, `SRE`, `RRA`, `ANC`, `ALR`, `ARR`,
`AXS`, och `NOP`-formerna som läser en operand: `NOP #$nn` ($80), `NOP $nn`
($04), `NOP $nn,X` ($14), `NOP $nnnn` ($0C), `NOP $nnnn,X` ($1C)

---

## 10. Felsökningsintegration

Appen stöder **RetroDebugger** som extern C64-felsökare. Den tar emot
brytpunkter, symboler och autostartflaggor som genereras från det sammansatta
programmet.

---

### RetroDebugger

[RetroDebugger]{1} är en plattformsoberoende Commodore 64-felsökare med stöd för
brytpunkter, minnesinspektion och etikettmedveten demontering.

| Fält        | Beskrivning                                          |
| ----------- | ---------------------------------------------------- |
| Etikettnamn | Identifierare som används i `JMP`, `JSR`, `BNE` etc. |

**Expertsyntax:**
```
slinga:
```

**Genererad ASM:**
```
slinga: ; $0820
```

Den aktuella adressen visas som en kommentar. Etiketter har en storlek på **0
byte**.

---

### Brytpunktsblock

Klicka på brytpunktsikonen (●) på valfritt instruktionsblock för att växla
mellan att vara en brytpunkt. Brytpunktsblock markeras med rött. Deras adresser
skrivs till brytpunktsfilen varje gång felsökaren startas.

**Expertsyntax:**
```
Din kommentartext här
```

**Genererad ASM:**
```
Din kommentartext här
```

---

### Felsökarflaggor (fliken Alternativ)

Liksom **DATA i BASIC** — lagrar en lista med råa bytevärden inbäddade i
programmet.

| Fält    | Beskrivning  |
| ------- | ------------ |
| Operand | `-jmp $ADDR` |

**Expertsyntax:**
```
.byte $01, $02, $FF
```

**Genererad ASM:**
```
.byte $01, $02, $FF
```

**Referenser för låg/hög byte-etiketter:** BYTE accepterar tokens av
KickAssembler / ca65-stilen `<label` (låg byte) och `>label` (hög byte)
tillsammans med numeriska värden. Assemblern löser etikettadressen vid
kompileringstillfället och infogar lämplig byte. Exempel:

```
.byte <bildruta_0, >bildruta_0, <bildruta_1, >bildruta_1
```

Detta lagrar den låga byten för `frame_0`s adress, sedan den höga byten, och
sedan samma sak för `frame_1`. Användbart för att bygga hopptabeller och
adresslistor.

**Storlek:** Antal byte i listan.

---

### ORD

Liksom **DATA i BASIC men för 16-bitars tal **. Varje värde lagras som två byte
(låg byte först, sedan hög byte — 6502 little-endian-ordning).

| Fält    | Beskrivning                                            |
| ------- | ------------------------------------------------------ |
| Operand | Kommaavgränsade 16-bitarsvärden (t.ex. `$0400, $C000`) |

**Expertsyntax:**
```
.ord 400 USD, 000 USD
```

**Genererad ASM:**
```
.ord 400 USD, 000 USD
```

**Storlek:** 2 byte per ord.

---

### FYLLA

Liksom `FOR I=1 TO N: POKE addr+I, val: NEXT` — fyller ett minnesblock med samma
byte, men i ett enda block. Utmärkt för att rensa områden eller förfylla
tabeller.

| Fält    | Beskrivning                                            |
| ------- | ------------------------------------------------------ |
| Operand | `antal,värde` — t.ex. `256,0` fyller 256 byte med noll |

**Expertsyntax:**
```
.fyll 256, 00 kr
```

**Genererad ASM:**
```
.fyll 256, 00 kr
```

**Uttryckssyntax:** Både `count` och `value` accepterar aritmetiska uttryck. Du
kan referera till CONST-namn, använda hexadecimala/binära litteraler och anropa
inbyggda matematiska funktioner:

| Uttryck                       | Menande                                   |
| ----------------------------- | ----------------------------------------- |
| `TILE_COUNT, 00 kr `          | räkna från en KONSTANT, värde hex-literal |
| `40*25, 0`                    | inline-multiplikation                     |
| `runda(sin(PI/4)*255), 80 kr` | trigonometri                              |

**Inbyggda funktioner: ** `sin()`, `cos()`, `round()`, `max(a,b)`, `min(a,b)`,
`abs()`, konstant `PI`

Operatorer: `+ - * /` Literaler: `$FF` (hex), `%10110000` (binär) Låg/hög byte:
`lo(expr)`, `hi(expr)`

**Storlek:** Antalet värde i byte.

---

### JUSTERA

Skjuter den aktuella adressen framåt till nästa rena gräns genom att infoga
noll-utfyllnadsbyte. C64 kräver att sprite-data börjar på en 64-byte-gräns —
`ALIGN 64` hanterar det automatiskt.

| Fält  | Beskrivning                                                                 |
| ----- | --------------------------------------------------------------------------- |
| Gräns | Justeringsvärde — t.ex. `64` (spritegräns), `256` (sida), `$2000` (bitmapp) |

**Expertsyntax:**
```
.align 64
.align 2000 dollar
```

**Genererad ASM:**
```
; ALIGN 64 → $0840 (12 byte utfyllnad)
```

**Storlek:** Dynamisk — beror på den aktuella programräknarpositionen.

> **Tips:** Använd `ALIGN 64` före spritedata, `ALIGN 256` för att säkerställa
> sidjusterade tabeller.

---

### TEXT

Liksom **PRINT AT** — skriver text direkt till C64-skärmen vid en given kolumn
och rad, utan att använda KERNAL. Den genererar ett LDA/STA-par per tecken, med
skärm-RAM som mål på `$0400`.

| Fält                      | Beskrivning                                                   |
| ------------------------- | ------------------------------------------------------------- |
| Text                      | Strängen som ska visas                                        |
| X                         | Kolumn (0–39)                                                 |
| Y                         | Rad (0–24)                                                    |
| Etikett (valfritt)        | Tilldelar en etikett som pekar på den beräknade skärmadressen |
| Gemener teckenuppsättning | Kryssruta — se nedan                                          |

**Teckenuppsättningslägen: **

C64 har två teckenuppsättningar som kan väljas vid körning:

| Läge                                         | $D018 bit 1 | Stora bokstäver                | Gemener inmatning             |
| -------------------------------------------- | ----------- | ------------------------------ | ----------------------------- |
| **Versala bokstäver/grafik** (standard)      | 0           | `A`–`Z` → skärmkoder $01–$1A ✓ | behandlas också som versaler  |
| **Gemener/versaler** (efter CHARSET gemener) | 1           | `A`–`Z` → $01–$1A (versaler)   | `a`–`z` → $41–$5A (gemener) ✓ |

- **Teckenuppsättning för versaler (standard, kryssruta avmarkerad):** Skriv det
  du vill se med versaler. `"HEJ"` visas som `HEJ`. Gemener mappas till
  skärmkoder med versaler.
- **Gemener teckenuppsättning (kryssruta markerad):** Skriv exakt det
  gemener/versaler du vill se. `"hej"` → gemener, `"HEJ"` → versaler. Kräver en
  teckenuppsättningsväxel vid körning innan skärmen skrivs (använd makrot
  **CHARSET gemener**).

**Genererad ASM (versaler, `"HEJ"`):**
```
LDA #$08 ; 'H' skärmkod $08 STA $0400 LDA #$05 ; 'E' skärmkod $05 STA $0401 ...
```

**Expertsyntax:**
```
.text 0, 2, "HELLO"; teckenuppsättning för versaler (standard)
.text 0, 2, "hello", teckenuppsättning för gemener; teckenuppsättning för gemener
```

Tecken kodas som **skärmkoder** (inte PETSCII). **Storlek:** `text.length × 5`
byte (LDA + STA per tecken).

---

### STRÄNG

Som att **POKEa en sträng** till valfri minnesadress vid körning. Genererar
LDA/STA-par som kopierar varje teckens skärmkod till efterföljande adresser.

| Fält                      | Beskrivning                                                                 |
| ------------------------- | --------------------------------------------------------------------------- |
| Text                      | Strängen att skriva                                                         |
| Adress                    | Målminnesadress — `$C000` hexagon eller ett **etikettnamn**                 |
| Etikett (valfritt)        | Tilldelar en etikett som pekar mot måladressen                              |
| Flytta                    | Hexvärde (00–FF) läggs till varje skärmkodbyte (t.ex. `$80` = omvänd video) |
| Gemener teckenuppsättning | Kryssruta — samma semantik som TEXT (se avsnittet TEXT)                     |

**Expertsyntax:**
```
.string $C000, "HELLO" ; teckenuppsättning för versaler (standard)
.string $C000, "hello", gemener ; teckenuppsättning för gemener
.string $C000, "HELLO", 80 ; med shift (omvänd video)
.string $C000, "hello", 80, gemener ; shift + gemener
.string $C000, "HELLO" :my_string ; med macroLabel
```

**Genererad ASM:**
```
LDA #$08 ; 'H'-skärmkod STA $C000 LDA #$05 ; 'E'-skärmkod STA $C001 ...
```

Tecken kodas som **skärmkoder** (inte PETSCII). Det valfria värdet **Shift**
läggs till varje byte, t.ex. `$80` för omvänd video. **Storlek:** `text.length ×
5` byte (en LDA + en STA per tecken).

---

### DATA

Som en **POKE-loop** — skriver en lista med råa byte till en minnesadress vid
körning, ett LDA/STA-par per byte.

| Fält               | Beskrivning                                                 |
| ------------------ | ----------------------------------------------------------- |
| Byte               | Kommaavgränsade bytevärden                                  |
| Adress             | Målminnesadress — `$C000` hexagon eller ett **etikettnamn** |
| Etikett (valfritt) | Tilldelar en etikett som pekar mot måladressen              |

**Expertsyntax:**
```
.data $C000, $01, $02, $03 ; hex-adress
.data my_buf, $01, $02, $03 ; etikett adress
.data $C000, $01, $02, $03 :mydata ; med macroLabel
```

**Genererad ASM:**
```
LDA #$01
    STA $C000
    LDA #$02
    STA $C001
    ...
```

**Storlek:** `antal_byte × 5` byte (en LDA + en STA per byte).

---

### RAWBYTES

Liksom **DATA som laddas direkt i minnet** — ingen runtime-kod alls. Bytena
finns från det ögonblick då PRG laddas, innan din kod ens startar. Använd detta
för sprite-data, nivåkartor, uppslagstabeller, allt som bara behöver vara på en
specifik adress.

| Fält               | Beskrivning                                                 |
| ------------------ | ----------------------------------------------------------- |
| Byte               | Kommaavgränsade bytevärden                                  |
| Adress             | Målminnesadress — `$C000` hexagon eller ett **etikettnamn** |
| Etikett (valfritt) | Tilldelar en etikett som pekar mot måladressen              |

**Expertsyntax:**
```
.rawbytes $C000, $00, $00, $00; hex-adress
.rawbytes sprite_data, $00, $00; label-adress
.rawbytes $0C50, $00, $00: nev; med macroLabel — annan kod kan använda LDA nev,X
```

**Storlek i kod:** 0 byte. Data placeras på den angivna adressen i utdata.

> **DATA vs RAWBYTES:** DATA genererar LDA/STA-kod som kopierar byte vid körning
> (långsammare, men fungerar om data behöver vara dynamiska). RAWBYTES placerar
> bara bytena direkt — ingen kod, omedelbart, ingen kostnad.

---

### RÅTEXT

Som RAWBYTES men för text — kodar strängen som skärmkoder och placerar bytena på
en fast adress utan **körningskod**. Texten är klar i minnet så fort PRG laddas.

| Fält                      | Beskrivning                                                                 |
| ------------------------- | --------------------------------------------------------------------------- |
| Text                      | Sträng att koda                                                             |
| Adress                    | Målminnesadress — `$C000` hexagon eller ett **etikettnamn**                 |
| Etikett (valfritt)        | Tilldelar en etikett som pekar mot måladressen                              |
| Flytta                    | Hexvärde (00–FF) läggs till varje skärmkodbyte (t.ex. `$80` = omvänd video) |
| Gemener teckenuppsättning | Kryssruta — samma semantik som TEXT (se avsnittet TEXT)                     |

**Expertsyntax:**
```
.rawtext $C000, "HELLO" ; teckenuppsättning för versaler (standard)
.rawtext $C000, "hello", gemener ; teckenuppsättning för gemener
.rawtext $C000, "HELLO", 80 ; med shift (omvänd video)
.rawtext $C000, "hello", 80, gemener ; shift + gemener
.rawtext $0400, "HELLO" :min_text ; med macroLabel
```

**Genererad ASM:**
```
; .rawtext "HELLO" -> $C000
; $C000
.byte $08, $05, $0C, $0C, $0F ; H E L L O (versaler)

; .rawtext "hej", gemener -> $C000
; $C000
.byte $48, $45, $4C, $4C, $4F ; h e l l o (gemener)
```

**Storlek i kod:** 0 byte. Data placeras på den angivna adressen i utdata.

> **STRING vs RAWTEXT:** STRING genererar LDA/STA-kod som kopierar texten vid
> körning. RAWTEXT bakar in byten i PRG vid laddningstid — ingen kod, ingen
> väntetid.

---

### PETSCII

Liksom **RAWBYTES men för KERNAL-utdata** — kodar strängen som PETSCII-byte
(kompatibel med CHROUT vid `$FFD2`) och placerar dem på en fast adress utan
runtime-kod. Använd detta när du vill skriva ut tecken via `JSR $FFD2` i en
loop, och observera att det nya `PRINT`-makrot använder samma kodare och
beteende för kryssrutor med gemener.

> **PETSCII vs skärmkoder:** PETSCII och skärmkoder är två olika kodningar.
> Skärmkod `$01` = bokstav A; PETSCII `$41` = bokstav A (via CHROUT). Använd
> endast PETSCII vid utskrift via KERNAL; använd TEXT/STRING/RAWTEXT för att
> skriva direkt till skärm-RAM.

| Fält                | Beskrivning                                                 |
| ------------------- | ----------------------------------------------------------- |
| Text                | Sträng att koda som PETSCII-byte                            |
| Adress              | Målminnesadress — `$C000` hexagon eller ett **etikettnamn** |
| Etikett (valfritt)  | Tilldelar en etikett som pekar mot måladressen              |
| PETSCII med gemener | Kryssruta — se nedan                                        |

**Teckenuppsättningslägen: **

| Läge                                | Stora bokstäver (`A`–`Z`)                                                                                                    | Gemener (`a`–`z`)            |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| **Versaler (standard, avmarkerad)** | `$41`–`$5A` (PETSCII versaler via CHROUT)                                                                                    | även mappad till `$41`–`$5A` |
| **Gemener (markerad)**              | Alfabetiska bokstäver mappas om så att det synliga skiftläget förblir konsekvent på teckenuppsättningen för gemener/versaler | Samma regel                  |

**Expertsyntax:**
```
.petscii $C000, "HALLÅ" ; versaler PETSCII (standard)
.petscii $C000, "hallå", gemener ; gemener PETSCII ($61–$7A)
.petscii $C000, "HALLÅ", null ; med null-terminator
.petscii $C000, "hallå", gemener, null ; gemener + null-terminator
.petscii $C000, "HALLÅ" :my_msg ; med macroLabel
```

**Genererade byte (versaler, `"HEJ"`):**
```
; $C000 .byte $48, $45, $4C, $4C, $4F ; H E L L O (PETSCII $41–$5A-intervall)
```

**Storlek i kod:** 0 byte. Data placeras på måladressen som en uppskjuten
datasektion (som RAWBYTES).

**Nullterminator:** Markera kryssrutan *"Lägg till `$00` (nullterminator)"* för
att automatiskt lägga till en `$00` byte efter texten. Idealisk för loopar med
nollterminering:

```
LDX #$00
loop: LDA-meddelande,X BEQ klar; $00 stoppar loopen JSR $FFD2 INX BNE-loop
klar: RTS
```

**Kodningsregler:**

| Input                                       | Versalläge                         | Gemenerläge             |
| ------------------------------------------- | ---------------------------------- | ----------------------- |
| `A`–`Z`                                     | `41 dollar`–`5 dollarA`            | `61 dollar`–`7 dollar`  |
| `a`–`z`                                     | `$41`–`$5A` (tvångsskriven versal) | `41 dollar`–`5 dollarA` |
| Mellanslag, siffror, interpunktion (32–126) | som det är                         | som det är              |
| Ny rad                                      | `$0D` (RETUR)                      | `$0D`                   |
| Andra                                       | `20 dollar ` (mellanslag)          | `20 dollar`             |

> **Tips:** Använd PETSCII för data som ska matas ut via CHROUT (`$FFD2`). För
> att skriva direkt till skärmens RAM, använd STRING eller RAWTEXT istället.

---

### TECKENUPPSÄTTNING

Växlar VIC-II-tecken-ROM:et mellan versaler/grafikläge (C64-standard) och
gemener/versaler-läge genom att modifiera bit 1 av `$D018` vid körning.

| Fält | Beskrivning                                                                                                                                  |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Läge | **Gemener** — aktiverar teckenuppsättningen för gemener/versaler; **Versaler** — återställer standardteckenuppsättningen för versaler/grafik |

**Expertsyntax:**
```
.charset lower; växla till gemener teckenuppsättning
.charset upper; växla tillbaka till versaler/grafik teckenuppsättning
```

**Genererad ASM:**

Gemenerläge:
```
LDA $D018 ORA #$02; sätt bit 1 → gemener/versaler ROM till $1800 STA $D018
```

Versalläge:
```
LDA $D018 OCH #$FD ; rensa bit 1 → versaler/grafik-ROM vid $1000 STA $D018
```

**Storlek:** 8 byte (LDA abs + ORA/AND imm + STA abs).

**Varför ORA/AND istället för direktskrivning?** `$D018` styr även skärmens
RAM-plats (bitar 7–4). Om endast bit 1 aktiveras bevaras resten av registret.

**Typiskt arbetsflöde:**

```
CHARSET lägre; växla till gemener teckenuppsättning
TEXT 0, 0, "hej världen"; [kryssruta: Gemener teckenuppsättning]
...
CHARSET övre; återställ standard när det är klart
```

Eller i expertläge:
```
.charset nedre
.text 0, 0, "hej världen", nedre
.charset övre
```

I expertläge går nu blocket `.charset` även igenom rullgardinsmenyn för lägen,
så att blockförhandsgranskningen och den exporterade källan förblir justerade.

> **Obs:** Makrot CHARSET ändrar bara VIC-tecken-ROM-pekaren. Det anropar inte
> `$E544` (KERNAL-teckenuppsättningsinit). I de flesta fall är detta
> tillräckligt; anropa först `JSR $E544` endast om du behöver att KERNAL:s egna
> utskriftsrutiner respekterar ändringen.

---

### CHARDEF

Definierar ett enda 8×8 anpassat tecken i en RAM-baserad teckenuppsättning.
Genererar inline-körningskod som kopierar 8 byte till `base + index * 8` vid
körningstillfället — inget behov av en föregående etikett eller `ORG`.

| Fält        | Beskrivning                                                                                                     |
| ----------- | --------------------------------------------------------------------------------------------------------------- |
| Teckenbas   | Basadressen för RAM-teckenuppsättningen (standard `$3800`). Måste justeras så att VIC-II kan se den (se nedan). |
| Teckenindex | Vilken teckenplats som ska omdefinieras, 0–255. `65` = 'A' i standardskärmkodlayouten.                          |
| 8 byte      | Kommaavgränsade bitmappader, uppifrån och ned. Varje bytes bit 7 = pixel längst till vänster.                   |

**Expertsyntax:**
```
.chardef $3800, 65, $18, $3C, $66, $7E, $66, $66, $66, $00
```

**Genererad ASM (8 × `LDA #b` / `STA-mål+n`, totalt 40 byte):**
```
LDA #$18
    STA $3A08
    LDA #$3C
    STA $3A09
    LDA #66 USD
    STA $3A0A
    LDA #$7E
    STA $3A0B
    LDA #66 USD
    STA $3A0C
    LDA #66 USD
    STA $3A0D
    LDA #66 USD
    STA $3A0E
    LDA #$00
    STA $3A0F
```

**Måladress:** `$3800 + 65 * 8 = $3A08`. Beräknad vid kompileringstillfället och
hårdkodad i STA-operanderna.

**Storlek:** 40 byte per tecken (8 × 5).

**Typiskt arbetsflöde:**
```
; Punkt VIC-II vid RAM-teckenuppsättningen vid $3800
LDA $D018
OCH #$F1
ORA #$0E ; bitar 3-1 = %111 → teckenuppsättning vid bank+$3800
STA $D018

CHARDEF $3800, 65, $18, $3C, $66, $7E, $66, $66, $66, $00 ; omdefiniera 'A'
CHARDEF $3800, 66, $7C, $66, $66, $7C, $66, $66, $7C, $00 ; omdefiniera 'B'
; ... fler CHARDEF-anrop för varje anpassat tecken
```

**När ska man använda CHARDEF jämfört med alternativ:**

| Närma sig                             | Använd när                                                                                         |
| ------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **CHARDEF**                           | Du behöver några anpassade tecken (säg 1–20). Körtidskostnaden är 40 byte per tecken.              |
| **RAWBYTES @ 3800 dollar **           | Du har en komplett anpassad teckenuppsättning (256 tecken). Totalt 2 KB data, ingen runtime-kopia. |
| **INCBIN "charset.bin" @ 3800 USD**   | Extern teckenuppsättningsfil (byggd av teckenredigeraren). Renaste alternativet.                   |
| **Teckenuppsättning Canvas + INCBIN** | Fullständig bitmapp med 256 tecken målad som en 128×128-bild.                                      |

> **Påminnelse om justering:** VIC-II förväntar sig att teckenuppsättningsbasen
> är en multipel av `$0800`. Giltiga banker: `$0000`, `$0800`, `$1000`, ... ,
> `$3800` (inom den nuvarande 16 KB VIC-banken). RAM-teckenuppsättningar ligger
> vanligtvis på `$2000`, `$2800`, `$3000` eller `$3800`.

---

### BOX_HIT

Axis-aligned bounding-box (AABB) kollisionstest mellan två rektanglar beskrivna
av 4-byte nollsidiga strukturer. Returnerar resultatet i ackumulatorn: **A = 1**
vid överlappning, **A = 0** annars. Ren inline-assembling, inget subrutinanrop.

| Fält                     | Beskrivning                                                          |
| ------------------------ | -------------------------------------------------------------------- |
| Postnummeradress i Box 1 | Nollsidig bas för den första rutans 4-bytestruktur (standard `$FB`). |
| Postnummeradress i Box 2 | Nollsidig bas för den andra rutans 4-bytestruktur (standard `$F7`).  |

**Strukturlayout** (4 byte per ruta, osignerade 8-bitars koordinater):

| Offset | Fält    |
| ------ | ------- |
| `+0`   | Vänster |
| `+1`   | Bästa   |
| `+2`   | Rätt    |
| `+3`   | Botten  |

**Expertsyntax:**
```
.box_hit $FB, $F7
```

**Genererad ASM (30 byte, helt PC-relativ — ingen subrutin, inga absoluta
hopp):**
```
LDA $FD; b1 höger CMP $F7; b2 vänster BCC nej; R1 < L2 → missa LDA $F9; b2 höger CMP $FB; b1 vänster BCC nej LDA $FE; b1 botten CMP $F8; b2 topp BCC nej LDA $FA; b2 botten CMP $FC; b1 topp BCC nej LDA #$01; träffad BNE klar; ovillkorlig (A ≠ 0)
nej: LDA #$00
klar:
```

**Storlek:** 30 byte.

**Typiskt arbetsflöde:**

```
; Spelarens sprite-ruta vid $FB..$FE
LDA sprite_x ; L
STA $FB
LDA sprite_y ; T
STA $FC
CLC
ADC #23 ; +23 → B (24 pixlar hög sprite)
STA $FE
LDA $FB
CLC
ADC #23 ; R
STA $FD

; Fiende-ruta vid $F7..$FA (ifylld på liknande sätt)
; ...

BOX_HIT $FB, $F7 ; testspelare mot fiende → A = 0 eller 1

CMP #$01
BNE ingen_kollision
JSR handle_hit
ingen_kollision:
```

**Begränsningar:**
- Båda nollsidiga adresserna måste vara `≤ $FC` (varje ruta behöver 4 på
  varandra följande byte: `zp`, `zp+1`, `zp+2`, `zp+3`).
- Koordinater behandlas som **unsigned 8-bit** (0–255). För signerade
  sprite-koordinater utanför detta intervall, normalisera innan lagring.
- De två rutorna kan överlappa varandra i ZP-utrymmet om så önskas, men
  vanligtvis vill man ha 8 distinkta byte.

**Varför inte en subrutin?** Inline-generering undviker JSR/RTS-overhead (14+
cykler) och håller testet aktivt i cachen för snäva spelloopar. Om du behöver
testa många par, placera din egen `JSR box_hit_sub` runt ett enda BOX_HIT-block
manuellt.

**Jämförelse med UB:s `box_hit()`-funktion:** Ultimate Basic använder samma
6502-logik som en runtime-funktion som returnerar till en variabel. I VA
placerar du BOX_HIT inline där du behöver testet; resultatet är i `A`.

---

### INCBIN

Liksom **BLOAD i BASIC** — hämtar en extern binärfil (`.bin`, `.prg`, `.sid`,
`.raw`) och bäddar in den direkt i den sammansatta PRG:n på den adress du anger.

| Fält   | Beskrivning                                                      |
| ------ | ---------------------------------------------------------------- |
| Fil    | Bläddra för att välja en `.bin`, `.prg`, `.sid` eller `.raw`-fil |
| Adress | Målinläsningsadress (t.ex. `$C000`)                              |

**Expertsyntax:**
```
.incbin "musik.bin", $C000
```

**Genererad ASM-kommentar:**
```
; INCBIN "music.bin" @ $C000 (2048 byte)
.byte $01, $02, ...
```

**Storlek i kod:** 0 byte (uppskjuten datasektion). Binärfilen är inbäddad på
den angivna adressen.

---

### KOALA

Laddar en **Koala Painter**-bild (`.koa` / `.kla`, 160×200 flerfärgad) och visar
den. Bilddatan är inbäddad på en fast adress som `INCBIN` (filens 2-byte `$6000`
laddningsadress tas bort), och själva blocket kompileras till en 86-byte
visningsrutin som körs där blocket finns.

| Fält   | Beskrivning                                                                                                                   |
| ------ | ----------------------------------------------------------------------------------------------------------------------------- |
| Fil    | Bläddra för att välja en `.koa` / `.kla`-fil (10003 byte, eller 10001 utan laddningsadress)                                   |
| Adress | Bitmap-adress: `$6000` (standard, Koala-inbyggt, VIC-bank 1, skärm-RAM `$4400`) eller `$2000` (VIC-bank 0, skärm-RAM `$0400`) |

Visningsrutinen kopierar skärmens RAM-del till skärmen och färg-RAM-delen till
`$D800`, skriver bakgrundsbyten till `$D021`, väljer VIC-banken i `$DD00` (med
behållna andra portbitar) och växlar till flerfärgsbitmappsläge (`$D011 = $3B`,
`$D016 = $18`, `$D018 = $18`). Andra adresser avvisas: de återstående
8K-platserna ligger under BASIC/KERNAL ROM (kopieringsslingan skulle läsa ROM)
eller överlappar tecken-ROM-skuggan.

**Expertsyntax:**
```
.koala "picture.koa"
.koala "picture.koa", $2000
```

**Exempel — visa en bild och vänta:**
```
* = $0801
.koala "bild.koa"
vänta:
JMP vänta
```

**Storlek i kod:** 86 byte (visningsrutin); de 10001 byten med bilddata går till
den angivna adressen. Hires-redigerarens **Filer → Exportera Koala (.koa)…**
producerar en kompatibel fil.

---

### NIVÅ / NIVÅRAD

Lägger in ett **Level Editor**-projekt i ditt program och kopierar nivårader
till en skärmbuffert — byggstenarna i ett skrollande spel. Se
`samples/level-demo.asm` för en komplett joystick-skrollad nivå.

#### NIVÅ

Ett INCBIN-liknande block som avger **0 byte kod**. Endast de
**placerade**-skärmarna i Level Editor-projektet (`.bin` som sparats med **Filer
→ Spara nivå**) sparas i minnet från den angivna adressen (standard `$2000`), i
slotordning, 2000 byte per skärm (1000 skärmkoder + 1000 färger). Identiska
skärmar lagras en gång, och alla tomma slots delar en tom skärm. Pektabellarna
följer skärmarna. En nivå kan vara upp till 7 × 10 skärmar.

**Expertsyntax:**
```
.nivå "nivå.bin"
.nivå "nivå.bin", 4000 dollar
```

| Definierad                                                                     | Menande                                                                                                                                        |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `NIVÅ_PLACERING_LÅG` / `NIVÅ_PLACERING_HÖG`                                    | Skärmens adress i varje plats (huvudrad, `NIVÅ_W` platser per rad)                                                                             |
| `NIVÅ_RAD_PLATS`                                                               | Nivå teckenrad → första platsen på dess skärmrad                                                                                               |
| `NIVÅ_ROD_LÅG/HÖG`, `NIVÅ_KRÅ_LÅG/HÖG`                                         | Nivå teckenrad → förskjutning av dess skärmkodsrad / färgrad inuti en skärm                                                                    |
| `NIVÅKOLUMNPLATS`, `NIVÅKOLUMNOFS`                                             | Visa startkolumn → skärmkolumn och kolumn inuti skärmen                                                                                        |
| `NIVÅ_W`, `NIVÅ_H`                                                             | Nivåstorlek på skärmar                                                                                                                         |
| `NIVÅKOLMER`, `NIVÅRADER`                                                      | Nivåstorlek i tecken                                                                                                                           |
| `NIVÅ_MAX_X`, `NIVÅ_MAX_Y`                                                     | Största pixelrullningsposition i en 40×25-vy                                                                                                   |
| `NIVÅ_BG`, `NIVÅ_MC1`, `NIVÅ_MC2`, `NIVÅ_FLERFÄRG`                             | Bakgrunds-/flerfärgade färger och nivåläge                                                                                                     |
| `NIVÅDATA`, `NIVÅSTORLEK`, `NIVÅSLUT`                                          | Start, storlek och första fria adress efter nivådata                                                                                           |
| `NIVÅ_OBJ_X_LO/HÖG`, `NIVÅ_OBJ_Y_LO/HÖG`, `NIVÅ_OBJ_TYP`, `NIVÅ_OBJ_PARAMETER` | Objekttabell (Level Editor-objektlager): position i nivåpixlar, typ och parameterbyte, i rullningsordning — `LEVEL_OBJ_COUNT` poster (max 255) |
| `NIVÅ_OBJ_T_START` … `NIVÅ_OBJ_T_TRIGGER`                                      | Objekttypnummer: START 0, FIENDE 1, FÖREMÅL 2, DÖRR 3, UTGÅNG 4, AVLÖSARE 5                                                                    |
| `NIVÅ_START_X`, `NIVÅ_START_Y`                                                 | Position för det första startobjektet (definieras endast när nivån har ett)                                                                    |
| `NIVÅ_ATTR`, `NIVÅ_ATTR_FAST` … `NIVÅ_ATTR_INSAMLING`                          | Teckenattributtabell (en flaggbyte per skärmkod; endast när nivån har attribut) och dess bitar: 1, 2, 4, 8                                     |
| `NIVÅKANT`, `NIVÅ_SKÄRM_FÄRGER`, `NIVÅ_SKÄRM_BG/KANT/MC1/MC2`                  | Nivågräns; färgtabeller per plats (rad-huvud som `LEVEL_SLOT_*`) när en skärm har sina egna färger (`LEVEL_SCR_COLORS` = 1)                    |

Typisk skydd: `.assert LEVEL_END <= $9200, "nivådata körs in i koden"`.

#### NIVÅ_RAD

Kopierar en 40-teckensrad av nivån till en buffert: nivåraden i **X**, med
början vid nivåkolumnen som finns i variabeln `col`, till adressen som finns i
pekaren `dst` (`dst` / `dst+1`, låg/hög). Med det tredje argumentet `color`
kopieras färgerna istället för skärmkoderna (för färg-RAM). Ett
40-teckensfönster som sträcker sig över två skärmar hanteras med en
självmodifierande kopieringsslinga (~14 cykler per byte). X behålls, A och Y
förstörs. Behöver ett `.level`-block i programmet.

**Expertsyntax:**
```
.nivårad dst_lo, vy_x
.nivårad dst_lo, vy_x, färg
```

**Storlek i kod:** 132 byte — använd `LBEQ` / `LBNE` när en gren måste hoppa
över den.

---

### SID

Liksom **BLOAD för musik** — laddar en `.sid`-fil i din PRG och läser
automatiskt dess Init- och Play-adresser från headern. Anropa Init en gång vid
uppstart, anropa sedan Play från din IRQ-hanterare varje bildruta.

| Fält                       | Beskrivning                                                                                                             |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Fil                        | Bläddra för att välja en `.sid`-fil                                                                                     |
| Anpassad adress (valfritt) | Åsidosätt SID:s ursprungliga laddningsadress (t.ex. `$1000`). Lämna tomt om du vill använda adressen från SID-rubriken. |

Blocket visar:
- **Titel / Författare** från SID-rubriken
- **Ladda adress** — där data placeras i minnet (effektiv adress efter eventuell
  override)
- **Init-adress** — anropa detta med JSR för att initiera musiken (justerat för
  omlokalisering om en anpassad adress används)
- **Spela upp adress** — anropa detta med JSR på varje ram i en IRQ-hanterare
  (justerat för omlokalisering)
- Ett **(flyttat)**-märke visas när en anpassad adress flyttar data från sin
  ursprungliga position

**Expertsyntax:**
```
.sid "Ikari_Warriors.sid"
.sid "Ikari_Warriors.sid", $1000
```

**Genererad ASM-kommentar:**
```
; SID "Ikari_Warriors.sid" @ $1000 Init:$1000 Play:$1006 (4096 byte)
```

**Storlek i kod:** 0 byte inline. SID-binärfilen placeras på den angivna
adressen som en uppskjuten del i PRG.

> **Viktigt:** De flesta SID-filer innehåller hårdkodade interna absoluta
> adresser. De kan bara flyttas om hela binärfilen förskjuts med samma offset.
> Om ett SID har interna hopp till `$10xx` måste det stå kvar på `$1000` — att
> flytta det till en annan adress kommer att bryta dessa interna referenser.

> **Typisk användning:** Placera ett ORG-block före SID-blocket för att ange
> dess adress. Anropa Init en gång vid start, anropa sedan Play every frame från
> en raster IRQ-hanterare — eller låt [SID_PLAYER](#sid_player) göra båda.

**Etiketter:** SID-blocket definierar `SID_LOAD` (där data placeras), `SID_INIT`
och `SID_PLAY` (init- och play-adresserna, flyttade tillsammans med en anpassad
adress). `SID_PLAY` saknas när låten inte har någon play-adress (ett RSID som
installerar sin egen IRQ). Använd dem i din egen kod, t.ex. `JSR SID_PLAY` i en
IRQ-hanterare.

---

### SID_PLAYER

Spelar melodin från makrot **SID** med ett block: det initierar melodin och
fortsätter att anropa sin uppspelningsrutin från ett rasteravbrott, så att ditt
program kan fortsätta med sitt eget arbete.

| Fält   | Beskrivning                                                     |
| ------ | --------------------------------------------------------------- |
| Låt    | Subtune-nummer som skickas till init-rutinen i A (standard `0`) |
| Raster | Avbrottets rasterlinje, `$00`–`$FF` (standard `$FA`)            |

Vad den gör: `SEI`, `LDA #song` / `JSR SID_INIT`, stänger av CIA1-timerns IRQ
(`$DC0D`), ställer in IRQ-vektorn (`$0314/$0315`) till dess inbyggda hanterare,
rasterlinjen (`$D012`, bit 8 av `$D011` rensad) och raster-IRQ (`$D01A`), `CLI`,
och hoppar sedan över hanteraren. Hanteraren bekräftar avbrottet (`ASL $D019`),
anropar `JSR SID_PLAY` och går vidare till KERNAL (`JMP $EA31`, som också
skannar tangentbordet).

**Expertsyntax:**
```
.sid "Ikari_Warriors.sid"
.sid_player
.sid_player 1, 80 dollar
```

**Storlek i kod: ** 58 byte.

> **Obs:** det behöver ett SID-block i programmet (`SID_INIT` och `SID_PLAY`);
> annars stoppas bygget med ett fel. Med CIA1-timerns IRQ avstängd körs KERNAL
> en gång per bildruta från raster-IRQ:n — tangentbordet och `GETIN` fortsätter
> att fungera.

---

### OMFATTA

Liksom **MERGE i BASIC** — hämtar en annan fil och expanderar dess block inline
på denna position. Perfekt för återanvändbara subrutinbibliotek. De inkluderade
blocken är skrivskyddade i det aktuella projektet.

Två filtyper stöds:
- **Visual Assembler-projekt** (`.json`) — projektets block infogas som de är.
- **Plain assembly source** (`.inc`, `.asm`, `.s`) — filen läses som text och
  tolkas på samma sätt som i expertläge. Varje gång du kompilerar läses filen om
  från disken (santhetskälla = filen), så du kan redigera den externt med valfri
  editor.

| Fält                    | Beskrivning                                                                                                                                                                                                                                                           |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fil                     | Bläddra för att välja ett `.json`-projekt eller en `.inc`/`.asm`/`.s`-assemblagekälla                                                                                                                                                                                 |
| Ladda adress (valfritt) | Om satt (hex, t.ex. `C000`), placeras de inkluderade blocken på den adressen — en syntetisk `ORG` injiceras före dem, vilket åsidosätter alla ORG-block inuti den inkluderade filen. Lämna tomt för att låta den inkluderade filens egna ORG-block styra placeringen. |

**Syntax för expertläge:**
```
.include "library.json"
.include "macros.inc", 1500 USD
.include "sprites.asm"
```

- Filändelsen ** krävs i expertläge ** — ett rent namn som `.include "macros"`
  behandlas som `.include "macros.json"`.
- Sökvägsupplösning: försöker först bredvid projektfilen (relativ), återgår
  sedan till appens medföljande katalog `samples/`.

**Genererad ASM (ingen adressöverstyrning):**
```
; .include "library.json" — 12 block
... (expanderade block följer)
```

**Genererad ASM (med laddningsadress `C000`):**
```
; .include "library.json" @ $C000 — 12 block
*=$C000
... (expanderade block följer)
```

> **Tips:** Använd INCLUDE för att bygga återanvändbara subrutinbibliotek som du
> kan dela mellan projekt. `.inc`/`.asm`/`.s`-filer är bäst när du vill redigera
> biblioteket i en vanlig textredigerare eller dela det med andra
> 6502-assemblerare; `.json` när biblioteket är skapat i själva Visual
> Assembler. Ange en laddningsadress när biblioteket inte har någon egen ORG,
> eller när du vill åsidosätta dess standardplacering.

---

### TABELL

Liksom **DIM vid en specifik adress** — namnger en uppslagstabell och anger var
den finns i minnet. Placera BYTE-, WORD- eller FILL-block efter den för att
definiera tabellens innehåll.

| Fält   | Beskrivning                                     |
| ------ | ----------------------------------------------- |
| Namn   | Etikett-ID för tabellen (t.ex. `color_table`)   |
| Adress | Fast adress där tabellen börjar (t.ex. `$C000`) |

**Expertsyntax:**
```
.tabell färg_tabell, $C000
```

**Genererad ASM:**
```
färg_tabell:
```

Programräknaren hoppar till den angivna adressen. Placera BYTE/WORD/FILL-block
efter TABLE för att fylla innehållet.

**Storlek:** 0 byte.

---

### ORG

Anger var i minnet programmet (eller en del av det) placeras — som att välja en
startadress innan man skriver in maskinkod. Varje program behöver minst en ORG.
Standard C64 BASIC-laddningsbar start är `$0801`.

| Fält      | Beskrivning                                                        |
| --------- | ------------------------------------------------------------------ |
| Adress    | Den nya ursprungsadressen (t.ex. `0801` i HEX, eller `2049` i DEC) |
| HEX / DEC | Växla adressinmatningen mellan hexadecimal och decimal visning     |

**Expertsyntax:**
```
* = 000 kr
```

**Genererad ASM:**
```
* = 000 kr
```

**Storlek:** 0 byte. Själva ORG-blocket genererar ingen maskinkod.

Varje ORG-block startar en ny sektion. Block som följer sätts ihop med början på
den adressen. När du exporterar PRG:n slås alla sektioner samman till en fil –
mellanrummen mellan sektionerna fylls med nollor.

**Exempel — kod vid `$0801`, datatabell vid `$C000`:**
```
* = $0801 LDX #$00
loop: LDA $C000,X STA $D800,X INX BNE-loop RTS

* = $C000 .byte $01, $02, $03, ...
```

> **Tips:** Varje program måste börja med ett ORG-block. Den typiska
> startadressen för ett C64 BASIC-laddningsbart program är `$0801` (2049
> decimaler). När **BASIC SYS stub** är aktiverat lägger assemblern till en kort
> BASIC-rad vid `$0801` och din kod börjar vid `$080D`.

---

### LOPP / NÄSTA

Liksom **`FOR X=N TO 1 STEP -1 : ... : NEXT X`** i BASIC — räknar ner från N
till 1 med hjälp av X- eller Y-registret. Släpp ett LOOP-block, placera dina
instruktioner mellan det och NEXT, och det loopar automatiskt rätt antal gånger.

#### SLINGA

| Fält     | Beskrivning                                                     |
| -------- | --------------------------------------------------------------- |
| Register | `X` eller `Y` — räknarregistret                                 |
| Räkna    | Antal iterationer per loop (hex eller decimal, t.ex. `0A` = 10) |
| Märka    | Automatiskt genererad loopetikett (t.ex. `loop0`)               |

**Expertsyntax:**
```
.loop X, 10, loop0
```

**Genererad ASM:**
```
LDX #$0A
loop0:
```

**Storlek:** 2 byte (LD_ opcode + omedelbar operand).

#### NÄSTA

| Fält     | Beskrivning                            |
| -------- | -------------------------------------- |
| Register | Automatiskt matchad med LOOP-registret |
| Märka    | Automatiskt länkad till LOOP-etiketten |

**Expertsyntax:**
```
.nästa loop0
```

**Genererad ASM:**
```
DEX BNE-slinga 0
```

**Storlek:** 3 byte (DEX + BNE + förgreningsförskjutning).

**Exempel — rensa 10 skärmceller:**
```
LDX #$0A
loop0: LDA #$20; mellanslag STA $0400,X DEX BNE loop0
```

---

### FÖR / SLUT

Liksom **`FOR X=0 TO N-1 : ... : NEXT X`** i BASIC — räknar *upp* från 0.
Perfekt när du behöver ett framåtriktat index, t.ex. stega igenom en sträng
eller en array.

#### FÖR

| Fält     | Beskrivning                                                                       |
| -------- | --------------------------------------------------------------------------------- |
| Register | `X` eller `Y` — räknarregistret                                                   |
| Räkna    | Loopgräns (hex eller decimal, t.ex. `$12` = 18). X/Y går från 0 upp till gräns-1. |
| Märka    | Automatiskt genererad loopetikett (t.ex. `för0`)                                  |

**Expertsyntax:**
```
för X, 12 dollar, för 0
```

**Genererad ASM:**
```
LDX #00 kr för 0:
```

**Storlek:** 2 byte (LD_ opcode + `#$00`).

#### SLUT

| Fält     | Beskrivning                              |
| -------- | ---------------------------------------- |
| Register | Automatiskt matchad med FOR-registret    |
| Märka    | Automatiskt länkad till FOR-etiketten    |
| Räkna    | Kopieras automatiskt från den parade FOR |

**Expertsyntax:**
```
.endf för0
```

**Genererad ASM:**
```
INX CPX #12 USD BNE för 0
```

**Storlek:** 5 byte (IN_ + CP_ #imm + BNE-offset).

**Exempel — skriv ut en null-avslutad sträng:**
```
LDX #$00
för0:
LDA-meddelande,X; meddelande = PETSCII-sträng vid fast adress BEQ klar; nullterminator → avsluta JSR $FFD2; CHROUT INX CPX #$12; max 18 tecken BNE för0
klar: RTS
```

> **LOOP vs FOR:** LOOP räknar ner (N→1) — bra för fördröjningar, fyllningar,
> pixelloopar. FOR räknar upp (0→N) — bra för sträng-/arrayåtkomst. Båda kan
> använda X eller Y.

---

### TRYCK / DRA

Som att ** spara variabler före en GOSUB och återställa dem efter ** — men
använder 6502-hårdvarustacken. Om en subrutin använder A, X eller Y, omslut den
med PUSH och PULL så att den anropande kodens register bevaras.

#### TRYCK

Skjuter ett eller flera register till stacken. Ordningen är alltid A → X → Y
(innerst först).

| Fält     | Beskrivning                                                          |
| -------- | -------------------------------------------------------------------- |
| Register | Vilken kombination som helst: `A`, `X`, `Y`, `AX`, `AY`, `XY`, `AXY` |

**Expertsyntax:**
```
.tryck AXY
```

**Genererad ASM (exempel: `AX`):**
```
PHA TXA PHA
```

**Storlek:** 1 byte för A (`PHA`), 2 byte för X eller Y (överföring + push).

#### DRA

Återställer register från stacken i **omvänd ordning** (Y → X → A).

| Fält     | Beskrivning                                          |
| -------- | ---------------------------------------------------- |
| Register | Samma som PUSH — måste matcha motsvarande PUSH-block |

**Expertsyntax:**
```
.dra AXY
```

**Genererad ASM (exempel: `AX`):**
```
PLA MOMS PLA
```

> **Regel:** PUSH och PULL måste alltid använda **samma registeruppsättning**.
> `PUSH AX` → `PULL AX` (återställer internt i omvänd ordning: X först, sedan
> A).

---

### END / RTS-alias

Liksom **RTS med ett vänligare makronamn ** — `.end` avger en enda `RTS` byte
och beter sig som en kort subrutinterminator i expertläge.

**Expertsyntax:**
```
.avsluta
```

**Genererad ASM:**
```
RTS
```

**Storlek:** 1 byte.

Använd detta när du vill ha en markör för slutet av en subrutin som liknar ett
makro mer än en rå instruktion.

---

### MAKRO / ENDM / ANROPA

Liksom **en namngiven GOSUB med parametrarna ** — definiera en återanvändbar
kodbit en gång (MACRO…ENDM), och anropa den sedan var som helst med INVOKE.
Skicka olika argumentvärden varje gång istället för att kopiera och klistra in
block.

#### MAKRO (definitionsstart)

| Fält       | Beskrivning                                                              |
| ---------- | ------------------------------------------------------------------------ |
| Namn       | Identifierare för makrot (t.ex. `setColor`)                              |
| Parametrar | Valfria kommaseparerade parameternamn (t.ex. `färg` eller `färg, antal`) |

Markerar början på en makrodefinition. Block mellan MACRO och ENDM är makrots
brödtext — de **genererar ingen kod ** där definitionen finns. Använd
`{paramName}` som platshållare för argument.

**Genererad ASM:**
```
; .MACRO setColor (färg)
... (kroppsblock)
; .ENDM
```

**Syntax för expertläge:**
```
.macro setColor färg LDA {färg} STA $D020
.endm
```

#### ENDM (definitionsslut)

Stänger den aktuella makrodefinitionen. Inga fält.

#### ÅBEROPA

Anropar ett definierat makro på denna position och ersätter de angivna
argumentvärdena med platshållarna `{paramName}` i brödtexten.

| Fält      | Beskrivning                                                                      |
| --------- | -------------------------------------------------------------------------------- |
| Makronamn | Välj från rullgardinsmenyn med definierade makron                                |
| Argument  | Kommaavgränsade argumentvärden som matchar makrots parameterlista (t.ex. `#$07`) |

**Genererad ASM:**
```
; .invoke setColor(#$07)
    LDA #$07
    STA $D020
```

**Syntax för expertläge:**
```
; enkelt argument:
.invoke setColor(#$07)

; flera argument:
.invoke drawPixel($10, $20)

; inga argument:
.invoke clearScreen

; text / strängargument (citat):
.invoke printText("Hej världen!")

; .call alias (synonym för .invoke):
.call setColor(#$07)
```

Makrots innehåll expanderas inline med `{paramName}` ersatt av de faktiska
argumenten. Den mellanslagsavgränsade formen (`.invoke setColor #$07`)
accepteras också.

**Argumenttyper:**
- **Numerisk**: `#$07`, `$10`, `255` — hex- eller decimalvärden
- **Textsträngar**: `"Hej världen!"` — citerade strängar; kommatecken inom
  citattecken behandlas som en del av texten, inte som argumentavgränsare
- **Blandat**: `#$07, "hej", $20` — valfri kombination

> **Tips:** Definiera makron högst upp (eller längst ner) i ditt program och
> ANROPA dem sedan där det behövs. Makron kan anropas flera gånger med olika
> argument.

---

### REGION / ENDREGION

Rent visuell gruppering — **noll byte**, noll effekt på den sammansatta koden.
Som att vika en del av ett BASIC-program till ett namngivet block så att du kan
komprimera det och fokusera på något annat.

| Fält           | Beskrivning                                                              |
| -------------- | ------------------------------------------------------------------------ |
| Regionens namn | Fritextetikett för sektionen (t.ex. `init`, `game_loop`, `sprite_setup`) |

**Expertsyntax:**
```
.region init
; blockerar...
.endregion
```

**Kontroller på REGION-blockrubriken (alltid synliga):**
- **▸ / ▾ växla ** — komprimerar eller expanderar hela regionen. När den är
  komprimerad döljs alla block mellan REGION och ENDREGION.
- **↕ Expandera alla** — återställer varje individuellt hopfällt block inom
  regionen och expanderar själva regionen om det behövs.
- **⦵ Välj i ASM** — markerar hela regionens kodintervall i ASM-vyn (från `;
  ===[namn]===` till `; ===[/namn]===`) och bläddrar till det. Växlar
  automatiskt till ASM-fliken om den inte är synlig för närvarande.
- **⧉ Kopiera region** — kopierar REGION-blocket, alla underblock och matchande
  ENDREGION till ett urklipp. En ✓-blixt bekräftar kopieringen.
- **⎘ Klistra in region** — infogar den kopierade regionen som en ny region
  direkt efter den aktuella regionens SLUTREGION och bläddrar till den. Knappen
  är nedtonad tills en region har kopierats.

**Genererad ASM:**
```
; region init
    SEI
    LDA #$00
    STA $D020
; endregion init
```

**Storlek:** 0 byte för både REGION och ENDREGION.

**Exempel på arbetsflöde:**
1. Lägg till ett `REGION`-block, sätt regionnamnet till `init`.
2. Lägg till dina initialiseringsinstruktioner nedanför.
3. Lägg till ett `ENDREGION`-block för att stänga avsnittet.
4. Klicka på ▸ på REGIONEN för att komprimera hela avsnittet till en rad medan
   du arbetar med andra delar av programmet.

> **Obs: ** Regioner kan **kapslas** inuti varandra. Varje ENDREGION stänger
> närmaste öppna REGION. Ingen effekt på den sammanställda utdata.

---

### DEFINERA / OM / ANNARS / ENDIF

Precis som med en **-brytare läser assemblern ** — `DEFINE DEBUG` aktiverar en
symbol, varpå valfritt `IF DEBUG`-block inkluderas och dess `ELSE`-gren hoppas
över. Ta bort DEFINE-blocket så försvinner IF-blocket från utdata. Du behöver
inte ta bort kod för versioner.

#### DEFINIERA

| Fält   | Beskrivning                                                                                  |
| ------ | -------------------------------------------------------------------------------------------- |
| Symbol | En eller flera kommaseparerade identifierare att aktivera (t.ex. `DEBUG` eller `DEBUG, PAL`) |

**Expertsyntax:**
```
.define DEBUG, PAL
```

**Genererad ASM:**
```
; .DEFINE DEBUG
; .DEFINE DEBUG, PAL
```

Ett `DEFINE`-block kan aktivera flera symboler samtidigt (kommaseparerade).
Placera DEFINE-block högst upp i ditt program. Om du tar bort blocket
inaktiveras alla dess symboler direkt.

#### OM

| Fält  | Beskrivning                                                                  |
| ----- | ---------------------------------------------------------------------------- |
| Skick | Identifierare att testa (måste matcha en `DEFINE`-symbol för att vara aktiv) |

**Expertsyntax:**
```
.if DEBUG
```

**Genererad ASM:**
```
; .IF DEBUG
```

Block mellan `IF` och `ENDIF` (eller `ELSE`) inkluderas eller hoppas över
baserat på om villkorssymbolen har en matchande `DEFINE` i programmet.
Överhoppade block visas som `; [IF skipped] …` kommentarer och genererar **noll
byte**.

#### ANNAN

Inga fält. Markerar den alternativa grenen — monteras när villkoret `OM` är
*inte* aktivt.

**Expertsyntax:**
```
.annan
```

**Genererad ASM:**
```
; .ANNARS
```

#### ENDIF

Inga fält. Stänger det villkorliga blocket.

**Expertsyntax:**
```
.endif
```

**Genererad ASM:**
```
; .ENDIF
```

**Storlek:** 0 byte för alla fyra blocken. Endast innehållet *mellan* dem
räknas.

**Exempel — felsöka kantlinjeflash, versionsversion hoppar över det:**
```
; .DEFINE DEBUG

; .IF DEBUG
LDA #$02 ; röd ram
STA $D020
; .ELSE
LDA #$00 ; svart (utgåva)
STA $D020
; .ENDIF
```

**Exempel — flera symboler i ett DEFINE-block:**
```
; .DEFINE DEBUG, PAL

; .IF PAL
LDA #$xx ; PAL-tidskonstant

; .ELSE
LDA #$xx ; NTSC-tidskonstant

; .ENDIF
```

Kapslade `IF`-block stöds. Om ett yttre block hoppas över hoppas även inre block
över.

> **Obs:** Detta är hantering av villkor vid kompilering. För
> jämförelse/förgreningssockrar vid körning, se **Runtime IF / ELSE / ENDIF**
> nedan.

### .HÄVDA

*(Nytt i 2.3.9.)* En **kontroll av sanitet vid kompilering**. `.assert`
utvärderar ett uttryck vid assemblering; om det är falskt (`0`) stoppas bygget
med ett tydligt fel som inkluderar det faktiska värdet. Om det är sant (inte
noll) genererar det ingenting.

| Fält       | Beskrivning                                                                                                                        |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Uttryck    | Valfritt assembleruttryck: etiketter, `CONST`s, `*` (programräknare), aritmetik och jämförelser (`<`, `<=`, `>`, `>=`, `==`, `!=`) |
| Meddelande | Valfri text tillagd till felmeddelandet                                                                                            |

**Expertsyntax:**
```
.assert spriteData < $C000
.assert * < $A000
.assert slut - början <= 256, "sprite-tabellen överflödig en sida"
```

**Beteende:**

- **Storlek:** 0 byte.
- En falsk påstående avbryter sammansättningen: `` `.assert end - start <= 256`
  är falskt (värde: 0). sprite-tabellen översvämmades en sida``
- En påstående som inte kan utvärderas (odefinierad etikett, etc.) misslyckas
  också, med * "kan inte utvärderas vid monteringstillfället"*.
- Jämförelser ger `1` / `0`; placera `.assert` var som helst i programflödet —
  den kontrolleras vid adressen den finns på, så `.assert * < $D000` testar den
  aktuella utgångspositionen.

**Exempel — skydda ett spriteblock mot sidövergångar:**
```
* = $3000
sprite_data:
.byte $00, $00, $00 ; … 63 byte …
sprite_data_end:
.assert sprite_data_end - sprite_data == 63, "sprite måste vara exakt 63 byte"
.assert (sprite_data % 64) == 0, "sprite måste vara 64-byte-justerad"
```

---

### KONSTANT

Liksom **en namngiven variabel som aldrig ändras** — `SCREEN = $0400`. Använd
namnet istället för att skriva råa adresser överallt, vilket gör koden lättare
att läsa och ändra senare.

| Fält      | Beskrivning                                                                                                     |
| --------- | --------------------------------------------------------------------------------------------------------------- |
| Namn      | Identifierare för konstanten (t.ex. `SCREEN`)                                                                   |
| Värde     | Numeriskt värde i den valda basen (t.ex. `0400` i HEX = adress $0400), eller ett PC-relativt uttryck (se nedan) |
| Formatera | HEX eller DEC — styr hur värdet anges och visas                                                                 |

**Expertsyntax:**
```
.konst SKÄRM = $0400
.konst BILDAR_1S = 60
```

**Genererad ASM:**
```
; .KONSTANT SKÄRM = $0400
```

Konstantens namn visas i rullgardinsmenyn **etikettväljaren** på
instruktionsblock — klicka bara på det för att infoga.

**PC-relativa uttryck (`*+N` / `*-N`):**

Värdefältet accepterar även `*+N` eller `*-N`, där `*` är kompileringsadressen
för själva CONST-blocket. Detta används för att skapa ett namngivet alias för en
byte inuti en närliggande instruktion — det klassiska självmodifierande
kodmönstret:

```
CONST op = *+1; op → adress för den omedelbara operanden för nästa LDA
LDA #$00; $00 kommer att patchas vid körning
...
STA op; skriver över #$00-byten → LDA läser det nya värdet nästa gång
```

CONST avger 0 byte; etiketten omvandlas vid kompilering till `current_address +
1`.

**Aritmetiska uttryck:**

Värdefältet accepterar allmän aritmetik, inklusive referenser till tidigare
definierade CONST-namn, hexadecimala/binära litteraler och inbyggda matematiska
funktioner:

```
.const SCREEN = $0400
.const SCREEN_END = SCREEN + 40*25 ; 1000 byte senare
.const COLOR_RAM = $D800
.const MID_X = 160
.const SIN_TABLE = round(sin(PI/8) * 127); förberäknat sinusvärde
```

**Inbyggda funktioner: ** `sin()`, `cos()`, `round()`, `max(a,b)`, `min(a,b)`,
`abs()`, konstant `PI`

Operatorer: `+ - * /` Literaler: `$FF` (hex), `%10110000` (binär) Låg/hög byte:
`lo(expr)`, `hi(expr)`

**Storlek:** 0 byte.

---

### VAR

Liksom **CONST, men automatiskt allokerad** — `VAR` reserverar nollsidig lagring
för en etikett utan att du behöver skriva in adressen. Använd den för räknare,
pekare och kortlivade tillstånd som hör hemma i ZP.

| Fält               | Beskrivning                                              |
| ------------------ | -------------------------------------------------------- |
| Namn               | Variabelnamn / etikett                                   |
| Storlek (valfritt) | Antal byte att reservera. Utelämnas för en enskild byte. |

**Expertsyntax:**
```
.var räknare
.var timer, 2
.var lever
```

**Praktiskt exempel: **
```
.region Vars
.var räknare
.var timer, 2
.endregion

LDA #$00
STA-räknare
```

**Genererad ASM:**
```
.var-räknare
```

**Storlek: ** 1 byte som standard, eller `N` byte när storlek anges.

Allokatorn går med en konfigurerbar nollsidig markör (`$02` till `$FE`) och
tilldelar nästa lediga plats. Om den begärda regionen överlappar en redan använd
etikett, avger kompilatorn en varning.

---

### Körtid IF / ELSE / ENDIF

Precis som **en riktig grenmall** — den här versionen fungerar vid körning, inte
kompileringstid. Den jämför `A`, `X` eller `Y` mot ett omedelbart värde och
genererar den korrekta `CMP` / `CPX` / `CPY` + grensekvensen åt dig.

| Fält     | Beskrivning                                  |
| -------- | -------------------------------------------- |
| Register | `A`, `X` eller `Y`                           |
| Operatör | `==`, `!=`, `<`, `<=`, `>`, `>=` |
| Värde    | Omedelbart värde i HEX- eller DEC-format     |

**Expertsyntax:**
```
.om A == #$10 LDA #$07
.annars LDA #$0F
.endif
```

**Storlek:** Beror på de valda grenarna och jämförelseformuläret.

Jämförelsen är som standard osignerad. För `<=` och `>` expanderas makrot till
den kortaste ekvivalenta grenkedjan för det valda registret.

---

### MEDAN / SLUT

Liksom **en runtime-loop med ett test högst upp** — kroppen körs medan villkoret
förblir sant.

| Fält     | Beskrivning                                  |
| -------- | -------------------------------------------- |
| Register | `A`, `X` eller `Y`                           |
| Operatör | `==`, `!=`, `<`, `<=`, `>`, `>=` |
| Värde    | Omedelbart värde i HEX- eller DEC-format     |

**Expertsyntax:**
```
.medan A != #$00
JSR getchar
.endw
```

**Storlek:** Beror på loopens kropp och jämförelseform.

Använd `WHILE` när loopen kan sluta innan den första iterationen är klar. Det är
motsvarigheten vid körning till den räknarbaserade `LOOP / NEXT`-hjälpen.

---

### UPPREPA / TILLS

Liksom **en runtime-loop med ett test längst ner** — kroppen körs alltid minst
en gång, sedan avgör villkoret om den ska stoppas.

| Fält     | Beskrivning                                  |
| -------- | -------------------------------------------- |
| Register | `A`, `X` eller `Y`                           |
| Operatör | `==`, `!=`, `<`, `<=`, `>`, `>=` |
| Värde    | Omedelbart värde i HEX- eller DEC-format     |

**Expertsyntax:**
```
.repeat
JSR getchar
.until A == #$00
```

**Storlek:** Beror på loopens kropp och jämförelseform.

Använd `REPEAT / UNTIL` när du vill att kroppen ska utföras minst en gång före
utgångskontrollen.

---

### MEMCPY / MEMSET

Precis som **små minnesrutiner du ständigt söker efter ** — `MEMCPY` kopierar
ett sammanhängande block, `MEMSET` fyller ett område med en byte.

| Makro    | Fält                         |
| -------- | ---------------------------- |
| `MEMCPY` | `källa`, `dst`, `storlek`    |
| `MEMSET` | `adress`, `värde`, `storlek` |

**Expertsyntax:**
```
.memcpy src=$C000, dst=$D000, storlek=$0100
.memset adr=$0400, värde=#$20, storlek=$03E8
```

**Genererad ASM:** inline kopierings-/fyllningsloopar, vald för att matcha den
begärda storleken.

Storlekar upp till 256 byte använder en kort 8-bitarsloop. Större storlekar
växlar automatiskt till en 16-bitarsräknare.

---

### SKRIV UT / SKRIV_UT_CHAR / SKRIV_UT_HEX / CLEAR_SCREEN / VÄNTA_KEY / FÖRDRÖJNING / SET_BORDER / SET_BG

#### SKRIVA UT

Liksom **PETSCII-utdata utan standardtexten ** — skriver ut en sträng genom
`CHROUT` med samma hantering av versaler/gemener som PETSCII-blocket. Kryssrutan
för gemener delas med PETSCII-kodaren, så textsökvägen förblir konsekvent.

**Expertsyntax:**
```
.print "HEJ"
.print "hej", sänk
```

#### PRINT_CHAR

Skriver ut en PETSCII-byte med numerisk kod och skickar den via `CHROUT`. Värdet
kan också vara en namngiven konstant eller etikett som omvandlas till en byte
vid monteringstillfället, både i blockläge och expertläge.

**Expertsyntax:**
```
.print_char 65
.print_char $41
.print_char färg
```

#### PRINT_HEX

Skriver ut ett 8-bitarsvärde som hexadecimal text via den vanliga
KERNAL-utdatavägen.

**Expertsyntax:**
```
.print_hex A
```

#### CLEAR_SCREEN

Genväg för standard C64-kontrollkoden för tydlig skärm.

**Expertsyntax:**
```
.clear_screen
```

#### VÄNTA_NYCKEL

Väntar tills en tangent trycks ned, så att du inte behöver rulla `GETIN`-slingan
för hand varje gång.

**Expertsyntax:**
```
.vänta_nyckel
```

#### DRÖJSMÅL

Väntar det begärda antalet bildrutiner genom en delad hjälprutin. Använd detta
för korta pauser och tidsintervall när en fullständig anpassad loop skulle vara
överdriven. Bildruteantalet kan vara ett rått tal eller en namngiven konstant,
och `.wait` är bara ett alias för `.delay`.

**Expertsyntax:**
```
.delay 29
.wait 29
.delay bildrutor=BILDRUTOR_1S
```

I blockläge använder fördröjningsfältet en kompakt konstantväljare när ett
symboliskt värde är tillgängligt, så att du inte behöver skriva namnet manuellt
varje gång.

#### SET_BORDER / SET_BG

Bekvämlighetsomslag för VIC-II-färgregistren. Färgvärdet kan vara ett rått tal
eller en namngiven konstant som upplöses till 0–15. Både blockläge och
expertläge accepterar symboliska konstantnamn här.

**Expertsyntax:**
```
.set_border 6
.set_bg 0
.set_border färg
.set_bg färg
```

**Storlek:** Varje hjälpare expanderar till en liten registerskrivningssekvens
eller ett kort KERNAL-anrop.

I blockläge använder dessa fält även const pickern, så det symboliska värdet
förblir synligt istället för att ersättas av ett rått tal.

---

### IRQ_SETUP

Ställer in en raster-IRQ-hanterare i ett steg. Makrot skriver IRQ-vektorn,
aktiverar raster-IRQ:er, ställer in linjen, inaktiverar de vanliga CIA
IRQ-källorna och återgår till normal körning med `CLI`.

| Fält      | Beskrivning                                           |
| --------- | ----------------------------------------------------- |
| Hanterare | IRQ-rutinens etikett (t.ex. `my_irq`)                 |
| Raster    | Rasterlinje i hexadecimal eller decimal (t.ex. `$FA`) |

**Expertsyntax:**
```
.irq_setup handler=my_irq, raster=$FA
```

**Storlek:** En liten installationssekvens; den exakta längden beror på den
valda rasterlinjen.

Använd detta när du vill ha den vanliga standardbeskrivningen "SEI / install
handler / enable IRQ / CLI" utan att sprida den i programmet.

---

### RAND

Liksom ** returnerar en liten inbyggd PRNG** ett 8-bitars pseudoslumpmässigt
värde från ett kompakt nollsidigt seed-värde.

| Fält   | Beskrivning                                              |
| ------ | -------------------------------------------------------- |
| Utsäde | Valfri nollsidig seedbyte eller etikett (standard `$FB`) |

**Expertsyntax:**
```
.rand
```

**Storlek:** Ett antal byte, beroende på vald implementeringsväg.

Generatorn är avsedd för spelupplägg, effektvariationer och snabb testdata. Den
är avsiktligt liten snarare än kryptografiskt avancerad.

---

<a id="sprite_init"></a>
### SPRITE_INIT

Ställer in en VIC-II-sprite i ett block — istället för att skriva ~6 POKE-satser
i BASIC, fyll bara i fälten. Ställer in spritens datapekare, slår på den,
aktiverar valfritt flerfärgsläge och ställer in dess färg.

| Fält       | Beskrivning                                                   |
| ---------- | ------------------------------------------------------------- |
| Sprite #   | Spritenummer 0–7                                              |
| Färg       | Färgindex 0–15 (C64-palett)                                   |
| Datasida   | Sprite-dataadress / 64 (t.ex. `$21` om data finns på `$0840`) |
| Flerfärgad | Växlar spritens flerfärgade bit (`$D01C`)                     |

**Expertsyntax:**
```
.sprite_init 0, 7, 21 USD
.sprite_init 0, 7, 21 USD, flerfärgad
.sprite_init 0, 7, 21 USD, mono
```

**Genererad ASM:**
```
LDA #$21 STA $07F8; spritepekarregister ($07F8 + N) LDA $D015 ORA #$01; sätt aktiveringsbit för sprite 0 STA $D015 LDA $D01C OCH #$FE; rensa flerfärgsbit för sprite 0 STA $D01C LDA #$07 STA $D027; sprite 0 färgregister
```

**Storlek:** 26 byte.

> **Sprite-datasida:** `dataadress ÷ 64`. Med standard BASIC SYS-stub placerar
> `ALIGN 64` efter `JMP main` sprite-data vid `$0840` → sida = `$21`.

---

<a id="sprite_pos"></a>
### SPRITE_POS

Liksom **`POKE 53248, x : POKE 53249, y`** i BASIC — anger en sprites
startposition. Koordinaterna bakas in vid monteringstillfället, och fälten
accepterar konstanter i blockläge; för animering, använd `INC`/`DEC` direkt på
spritregistret.

| Fält     | Beskrivning             |
| -------- | ----------------------- |
| Sprite # | Spritenummer 0–7        |
| X        | Horisontellt läge 0–319 |
| Y        | Vertikal position 0–255 |

**Expertsyntax:**
```
.sprite_pos 0, 152, 100
```

**Genererad ASM (exempel: sprite 0, X=152, Y=100):**
```
LDA #$98; X låg byte
STA $D000; sprite 0; X-register
LDA $D010
OCH #$FE; rensa X MSB för sprite 0 (X ≤ 255)
STA $D010
LDA #$64; Y = 100
STA $D001; sprite 0; Y-register
```

För X > 255 sätter makrot motsvarande bit i `$D010` istället för att nollställa
den.

**Storlek:** 18 byte.

> **Obs:** `SPRITE_POS` bakar in X/Y i koden (`LDA #$xx`). För att animera en
> sprite vid körning, använd `INC $D000` / `DEC $D000` — se exemplet
> `sprite-macro-demo`.

---

<a id="wait_raster"></a>
### VÄNTA_RASTER

Väntar på att VIC-II-elektronstrålen ska nå en specifik skanningslinje – som att
synkronisera med en TV-bildruta. Placera detta högst upp i din spelloop för att
förhindra sprite-tearing. Ingen JSR, ingen etikett behövs.

| Fält        | Beskrivning                                       |
| ----------- | ------------------------------------------------- |
| Rasterlinje | Målrasterlinje i hexagonal (t.ex. `FF` = rad 255) |

**Expertsyntax:**
```
.wait_raster $FF
```

**Genererad ASM:**
```
vänta:
LDA $D012; aktuell rasterlinje
CMP #$FF; mållinje
BNE vänta; loopa tillbaka (-7 byte)
```

**Storlek:** 7 byte (`BNE`-offsetet `$F9` = −7 pekar alltid tillbaka till
`LDA`).

> **Tips:** Placera `WAIT_RASTER` högst upp i din spelloop för att synkronisera
> med skärmen och förhindra sprite-tearing.

---

### JOYSTICK

Som att läsa **`PEEK($DC00)`** och sedan POKE:a spritens position — men i ett
block. Läser en CIA-joystickport och justerar en sprites X/Y-register därefter.
Helt inline, ingen JSR behövs.

| Fält     | Beskrivning                                                   |
| -------- | ------------------------------------------------------------- |
| Hamn     | `1` = port 1 (`$DC01`) eller `2` = port 2 (`$DC00`)           |
| Sprite # | Spritenummer 0–7 (styr vilket X/Y-registerpar som uppdateras) |

**Expertsyntax:**
```
.joystick 2, 0
```

**Genererad ASM (port 2, sprite 0):**
```
LDA $DC00; läs CIA port 2 LSR; bit 0 → bär (Upp)
BCS hoppa_upp; bär set = EJ nedtryckt DEC $D001; Y−1 (flytta upp)
hoppa_upp:
LSR; bit 1 → bär (Ned)
BCS hoppa_ner INC $D001; Y+1 (flytta ned)
hoppa_ner:
LSR; bit 2 → bär (Vänster)
BCS hoppa_vänster DEC $D000; X−1 (flytta vänster)
hoppa_vänster:
LSR; bit 3 → bär (Höger)
BCS hoppa_höger INC $D000; X+1 (flytta höger)
hoppa_höger:
```

**Joystickbitmapp (aktiv-LOW — bit = 0 betyder nedtryckt):**

| Bit | Riktning | CIA-register                    |
| --- | -------- | ------------------------------- |
| 0   | Upp      | $DC00 (port 2) / $DC01 (port 1) |
| 1   | Ner      |                                 |
| 2   | Vänster  |                                 |
| 3   | Rätt     |                                 |
| 4   | Brand    | (hanteras inte av detta makro)  |

**Storlek:** 27 byte. `BCS`-offsetet är alltid `+3` (hoppar över följande 3-byte
`DEC`/`INC abs`-instruktion).

**Variabelläge — `.joystickport, vx, vy[, fire]`:** istället för att flytta en
sprite skrivs riktningen in i variabler: `vx` / `vy` = `-1` / `0` / `+1` (`$FF`
/ `$00` / `$01`), och det valfria `fire` = `1` medan knappen hålls nedtryckt,
`0` annars. Använd den för en rullande kamera, en spelare med egen fysik eller
menyer. Port `3` läser båda joystickportarna samtidigt (`LDA $DC00` / `OCH
$DC01`), så båda portarna fungerar.

```
.joystick 2, vx, vy; 35 byte
.joystick 3, vx, vy, fire; båda portarna + fire: 45 byte
```

> **Typisk användning:** Placera inuti en `gameloop`-etikett med `WAIT_RASTER`
> först:
> ```
> spelloop: WAIT_RASTER ($FF) JOYSTICK (port=2, sprite=0) JMP spelloop
> ```

---

<a id="mouse"></a>
### MUS

Läser en Commodore 1351 proportionell mus och flyttar en sprite. Helt **inline**
— ingen JSR eller etikett behövs. Makrot väljer CIA-porten, väntar på att
SID-paddelns ingångar ska stabiliseras, avkodar sedan deltarörelsen med hjälp av
standard 1351-drivrutinsmönstret och tillämpar det på spriteregistren.

| Fält      | Beskrivning                                                               |
| --------- | ------------------------------------------------------------------------- |
| Hamn      | `1` = CIA `$DC00` bitar `7:6` = `%01`; `2` = `%10`                        |
| Sprite #  | Spritenummer 0–7                                                          |
| ZP-byte X | Nollsidig adress (hex) för att lagra föregående POTX-prov (t.ex. `FD`)    |
| ZP-byte Y | Nollsidig adress (hex) för att lagra föregående POTY-exempel (t.ex. `FE`) |

**Genererad ASM-form (port 1, sprite 0, ZP `$FD`/`$FE`):**

```
; CIA portval + betalning LDA $DC00 OCH #$3F ORA #$40 STA $DC00 LDX #$67
vänta: DEX BNE vänta

; X-axel — standard 7-bitars deltaavkodning i 1351-stil LDA $D419 TAY SEC SBC $FD OCH #$7F LDX #$00 CMP #$40 BCS xneg LSR A BEQ xdone STY $FD CLC ADC $D000 STA $D000 TXA ADC #$00 OCH #$01 BEQ xdone LDA $D010 EOR #$01 STA $D010 JMP xdone
xneg: ORA #$C0 CMP #$FF BEQ xdone SEC ROR DEX STY $FD CLC ADC $D000 STA $D000 TXA ADC #$00 OCH #$01 BEQ xdone LDA $D010 EOR #$01 STA $D010
xdone:

; Y-axel — samma avkodning, sedan inverterad före tillämpning
LDA $D41A TAX SEC SBC $FE AND #$7F CMP #$40 BCS yneg LSR A BEQ ydone STX $FE EOR #$FF SEC ADC $D001 STA $D001 JMP ydone
yneg:
ORA #$C0 CMP #$FF BEQ ydone SEC ROR STX $FE EOR #$FF SEC ADC $D001 STA $D001
ydone:
```

**Storlek:** 142 byte.

**Syntax för expertläge:**
```
.mouse port, spriteNum, zpX, zpY
; exempel:
.mouse 2, 0, FD, FE
```

> **Viktigt:** Innan det första anropet, initiera noll-sidesbyten med de
> aktuella POTX/POTY-värdena för att undvika ett hopp på den första ramen:
> ```
> ; port 1: LDA $DC00 : OCH #$3F : ORA #$40 : STA $DC00
> ; port 2: LDA $DC00 : OCH #$3F : ORA #$80 : STA $DC00
> LDA $D419 : LSR A : OCH #$3F : STA $FD
> LDA $D41A : LSR A : OCH #$3F : STA $FE
> ```

> **Tips:** Polla musen en gång per bildruta — placera `WAIT_RASTER` i
> spelloopen före `MOUSE`.

---

<a id="sprite_col"></a>
### SPRITE_COL

Liksom **`PEEK($D01E)`** i BASIC — kontrollerar VIC-II
hårdvarukollisionsregister och talar om för dig om en sprite träffar en annan
sprite eller bakgrunden. Helt inline, ingen JSR behövs.

| Fält          | Beskrivning                                                                                                        |
| ------------- | ------------------------------------------------------------------------------------------------------------------ |
| Sprite #      | Sprite nummer 0–7 (vilken spritebit ska kontrolleras)                                                              |
| Kollisionstyp | `Sprite-Sprite ($D01E)` — kollision med en annan sprite; `Sprite-Bakgrund ($D01F)` — kollision med bakgrundsgrafik |

**Expertsyntax:**
```
.sprite_col 0, sprite
.sprite_col 0, bakgrund
```

**Genererad ASM (sprite 0, sprite–sprite):**
```
LDA $D01E; läs sprite-sprite kollisionsregister (rensar det!)
OCH #$01; isolera bit 0 (sprite 0)
; A ≠ 0 → kollision inträffade
```

**Storlek:** 5 byte.

> **Viktigt:** Avläsning av `$D01E`/`$D01F` **rensar registret**. Läs det en
> gång per bildruta och agera omedelbart på resultatet med `BEQ`/`BNE`.

**Typisk användning:**
```
gameloop:
WAIT_RASTER ($FF)
JOYSTICK (port=2, sprite=0)
SPRITE_COL (sprite=0, type=sprite-sprite)
BEQ ingen_träff; A = 0 → ingen kollision LDA #$02 STA $D020; röd kant = träff!
JMP gameloop
ingen_träff:
LDA #$0E STA $D020; ljusblå kant = klar JMP gameloop
```

> **Se även:** `kollisionsdemo` exempel — grön boll (sprite #0) vs. rött kors
> (sprite #1).

---

### LADDA IN FIL

Liksom **`LOAD "fil",8`** i BASIC — laddar en fil från en D64-disk vid körning
med hjälp av KERNAL LOAD-rutinen. Använd detta för att ladda data, musik eller
extra kod från disken medan ditt program körs.

| Fält                        | Beskrivning                                                                                                                                                                                         |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Filnamn                     | Filnamn på disken (max 16 tecken, automatisk versaler; tecknen `,`, `"`, `/`, `\`, `:`, `*`, `?`, `<`, `>`, `|` filtreras)                                                                          |
| Anordning                   | Enhetsnummer 8–30 (standard `8`)                                                                                                                                                                    |
| Åsidosätt adress (valfritt) | Hexadecimal laddningsadress (t.ex. `C000`). Om angiven laddas filen till denna adress (`sec=0`, utan att PRG-rubriken används). Lämna tomt för att använda filens egen 2-byte PRG-rubrik (`sec=1`). |
| Feletikett (valfritt)       | Om den är satt genereras en `BCS`-instruktion efter JSR LOAD. Om KERNAL returnerar med carry satt (fel), hoppar exekveringen till denna etikett.                                                    |

**Expertsyntax:**
```
.loadfile "DEMO-FÄRGER", 8
.loadfile "DEMO-FÄRGER", 8, $C000
.loadfile "DEMO-FÄRGER", 8, $C000, error_label
```

**Genererad kodstruktur:**
```
JMP skip_filename ; hoppa över det inline-filnamnet
.byte "DEMO-COLORS" ; filnamn bytes (PETSCII, 11 tecken)
skip_filename:
LDA #11 ; filnamnslängd
LDX #<filnamn ; pekare låg
LDY #>filnamn ; pekare hög
JSR $FFBD ; SETNAM
LDA #1 ; logisk fil #1
LDX #8 ; enhet 8
LDY #0 ; sek=0 (åsidosätt adress) eller #1 (filens egen adress)
JSR $FFBA ; SETLFS
LDA #0 ; LOAD-kommando (inte VERIFY)
JSR $FFD5 ; LOAD
BCS misslyckande ; (endast om feletiketten är angiven)
```

**Storlek:** `3 + filnamnslängd + 9 (SETNAM) + 9 (SETLFS) + (4 om åsidosättning)
+ 5 (LADDA) + (2 om feletikett)` byte. Minst 27 byte.

> **Viktigt:** Filnamnet lagras inbäddat i maskinkoden direkt efter en `JMP
> skip_filename`. Filnamnet på disken måste vara PETSCII i versaler — vilket
> matchar vanliga ASCII-versaler (`A`–`Z`). Makrot framtvingar detta
> automatiskt.

> **Använd alltid en feletikett** för produktionsprogram — om filen inte hittas
> sätter KERNAL flaggan "carry" och körningen går vidare till nästa steg.

> **Se även:** `loadfile-demo` exempel — demonstrerar laddning av
> `DEMO-COLORS.PRG` från en D64 med en BCS-felgren och en visuell felskärm.

---

### EXODECRUNSH

Inbyggd **Exomizer-dekomprimering**. Använd detta makro direkt efter en
`LOADFILE` som laddade en komprimerad ström i Exomizer-läge `mem` — EXODECRUNCH
packar upp den bakåt till adressen som är inbäddad i strömmen.

| Fält              | Beskrivning                                                                                     |
| ----------------- | ----------------------------------------------------------------------------------------------- |
| Avpackningsadress | Där depacker-koden finns i minnet (standard `B000`). Måste vara en 16-bitars hexadecimaladress. |

**Expertsyntax:**
```
.exodecrunch
.exodecrunch avpackare=$B000
```

**Genererad kod (19 byte):**
```
LDA $AE ; KERNAL load-end lo (inställd av föregående LOAD)
STA $04 ; depacker src-end pekare lo
LDA $AF ; KERNAL load-end hi
STA $05 ; depacker src-end pekare hi
LDA #$36 ; BASIC ROM av ($A000-$BFFF blir RAM)
STA $01
JSR depacker ; depacker läser bakåt-till-framsidan via $04/$05
LDA #$37 ; återställ standardmappning (BASIC + KERNAL + I/O)
STA $01
```

**Hur det fungerar:**

1. KERNAL `LOAD` ($FFD5) uppdaterar ZP `$AE/$AF` för att peka ett efter den
   senast laddade byten. EXODECRUNCH kopierar detta till ZP `$04/$05`, vilket är
   den officiella Exomizer-konventionen för bakåtriktad source-end.
2. Avpackaren placeras vanligtvis vid `$B000` (inom den mappade regionen för
   BASIC ROM). Makrot växlar mellan `$01 och $36` så att processorn ser
   RAM-minnet där under JSR och sedan återställer `$01 och $37` efteråt.
3. Dekomprimeringsmåladressen **kodas in i själva den komprimerade strömmen**
   när du komprimerar med `exomizer mem -l <load> file,<target>` — depackern
   läser den från strömmens första byte.

**Depacker binärfil:** Den förbyggda bakåtriktade depackern är
`samples/exo-decrunch.bin` (477 byte, ORG $B000). Det är en Kick Assembler-wrap
av den officiella `exodecrunch.asm` med `INC $D020` tillagd till varje läsning
för en synlig kantblixteffekt under dekomprimering. Placera den i ditt program
med ett `INCBIN`-block vid depackeradressen.

**Rå indata:** extravärdet skickas till Exomizer som en råfil som laddas på
Dst-adressen (`fil@<Dst>`), så avpackaren skriver varje byte, med början från
den första, exakt på den adress du skrev in.

> **Se även:** `exo-multicolor-demo`-exemplet — ett fullständigt exempel från
> början till slut: LOADFILE en komprimerad flerfärgad bitmapp till $C000,
> EXODECRUNCH packar upp den till $2000, kopierar sedan skärm → $0400 och färg →
> $D800, och växlar VIC-II till flerfärgad bitmappsläge.

> **Integrationstest:** `cargo test --test exomizer_integration` (i
> `src-tauri/`) verifierar den fullständiga komprimerings- +
> dekomprimeringsreturen på en 6502-emulator med den riktiga
> depacker-binärfilen. Godkända kriterier: 10000 byte byte-lika med källkoden
> `multi-color.bin`.

---

### REU_CHECK

Detekterar om en Commodore RAM-expansionsenhet (REU) är inkopplad — som att
kontrollera `PEEK($D010)` för att se om hårdvara finns. Testar genom att skriva
och läsa tillbaka två mönster till REU-registret `$DF04`.

| Fält  | Beskrivning    |
| ----- | -------------- |
| Ingen | Inga operander |

**Genererad kod (34 byte):**
```
LDA #55 USD
STA $DF04
LDA $DF04
CMP #$55
BNE misslyckas
LDA #$AA
STA $DF04
LDA $DF04
CMP #$AA
BNE misslyckas
LDA #$00
CMP #$FF ; Z=0 => REU närvarande
BNE gjort
misslyckas:
LDA #$FF
CMP #$FF ; Z=1 => ingen REU
gjort:
```
> Makrot normaliserar resultatet så att följande gren förblir enkel: `BNE`
> betyder att REU finns, `BEQ` betyder att REU saknas.

**Expertsyntax:**
```
.reu_check
```

**Resultat i flaggor:**
- **Z = 0** (resultat ≠ 0) → REU finns → använd `BNE`
- **Z = 1** (resultat = 0) → ingen REU → använd `BEQ`

**Inga konfigurerbara fält** — makrot genererar samma kod varje gång.

**Typisk användning:**
```assembly
REU_CHECK
BEQ no_reu ; hoppa över om REU inte finns
; ... REU-kod här ...
no_reu:
```

---

### REU_STASH / REU_FETCH / REU_SWAP

DMA-blocköverföring mellan C64 RAM och REU-expansionsminne — som en mycket snabb
POKE-slinga, men processorn utför inget arbete (REU-chippet kopierar data medan
processorn är stoppad). En överföring på `$1000`-byte är i praktiken omedelbar.

| Makro       | Riktning      | `$DF01`-kommando |
| ----------- | ------------- | ---------------- |
| `REU_STASH` | C64 RAM → REU | `90 dollar`      |
| `REU_FETCH` | REU → C64 RAM | `91 dollar`      |
| `REU_SWAP`  | C64 RAM ↔ REU | `92 dollar`      |

**Fält:**

| Fält       | Beskrivning                           | Exempel |
| ---------- | ------------------------------------- | ------- |
| C64-adress | Källa/destination i C64 RAM (hex)     | `C000`  |
| REU-adress | Källa/destination i REU (hex, 16-bit) | `0000`  |
| REU-banken | REU-minnesbank (0–7)                  | `0`     |
| Längd      | Antal byte att överföra (hex, 16-bit) | `1000`  |

**Expertsyntax:**
```
.reu_stash 000 kr, 0000 kr, 0, 1000 kr
.reu_fetch 000 kr, 0000 kr, 0, 1000 kr
.reu_swap 000 kr, 0000 kr, 0, 1000 kr
```

**Genererad kod (40 byte):**
```
LDA #c64lo STA $DF02; C64-adress LO
LDA #c64hi STA $DF03; C64-adress HIGH
LDA #reuLo STA $DF04; REU-adress LO
LDA #reuHi STA $DF05; REU-adress HI
LDA #bank STA $DF06; REU bank
LDA #lenLo STA $DF07; längd LO
LDA #lenHi STA $DF08; längd HI
LDA #$00 STA $DF09; adresskontroll (fast)
LDA #$00 STA $DF0A; avbrottsmask (fast)
LDA #cmd STA $DF01; kör DMA ($90/$91/$92 = stash/fetch/swap, omedelbart)
```

> **Obs:**-kommandon använder `$90/$91/$92` (bit 4 satt = omedelbart DMA-läge).
> Skrivning till `$DF01` startar överföringen; processorn återupptar när den är
> klar.

---

### TURBO_SET

Ställer in CPU-hastigheten **Ultimate-64 (U64)** via register `$D031`. Ingen
effekt på en riktig C64 eller andra emulatorer.

**Fält:**

| Fält        | Beskrivning              | Räckvidd                                         |
| ----------- | ------------------------ | ------------------------------------------------ |
| Hastighet   | CPU-hastighetsindex      | 0 = 1 MHz … 7 ≈ 10 MHz … 15 ≈ 48 MHz             |
| Dålig linje | Emulering av dålig linje | Aktiverad (C64-kompatibel) / Inaktiverad (turbo) |

Hastighetsbyten beräknas som: `(speedIndex & 0x0F) | (badline_disabled ? 0x80 :
0x00)`.

**Genererad kod (5 byte):**
```
A9 xx LDA #speed_byte
8D 31 D0 STA $D031
```

**Syntax för expertläge:**
```
.turbo_set 7,0; hastighet=7 (~10 MHz), dålig linje aktiverad. .turbo_set 15,1; hastighet=15 (~48 MHz), dålig linje inaktiverad.
```

> **Obs:** Detta makro påverkar endast U64-hårdvara. På en riktig C64 eller
> andra emulatorer skriver detta till `$D031` vilket kan påverka CIA eller
> ignoreras.

---

### SUPERCPU_DETECT

Kontrollerar om en **CMD SuperCPU**-accelerator är installerad — som
`PEEK($D0B8)` för att se om den returnerar något annat än `$FF`.

**Genererad kod (5 byte):**
```
AD B8 D0 LDA $D0B8
C9 FF CMP #$FF
```

**Resultat i flaggor:**
- **Z = 0** → SuperCPU finns → använd `BNE`
- **Z = 1** → SuperCPU hittades inte → använd `BEQ`

**Inga konfigurerbara fält.**

**Expertsyntax:**
```
.supercpu_detect
```

**Typisk användning:**
```assembly
SUPERCPU_DETECT
BEQ no_scpu; hoppa över om SuperCPU inte finns
; ... SuperCPU turbokod här ...
no_scpu:
```

---

### TURBO_AKTIVERA

Slår på eller av **CMD SuperCPU turboläge**. Anropa `SUPERCPU_DETECT` först och
hoppa över detta om SuperCPU inte finns.

| Läge       | Register | Effekt                                        |
| ---------- | -------- | --------------------------------------------- |
| Aktivera   | `$D07A`  | Aktivera turbo (upp till 20 MHz med SuperCPU) |
| Inaktivera | `$D07B`  | Återgå till 1 MHz-kompatibilitetsläge         |

**Genererad kod (5 byte):**
```
A9 00 LDA #$00
8D 7A D0 STA $D07A ; (eller $D07B för inaktivering)
```

**Syntax för expertläge:**
```
.turbo_enable på
.turbo_enable av
```

> **Obs:** Anropa `SUPERCPU_DETECT` först och förgrena dig runt detta makro om
> SuperCPU:n inte finns.

---

<a id="map_copy"></a>
### MAP_COPY

Kopierar en tilemapp från en källadress till skärmens RAM (och eventuellt
färg-RAM) med hjälp av en serie `LDA abs,X` / `STA abs,X`-loopar. En sida på 256
byte kopieras per loopiteration; en ofullständig sida i slutet använder `CPX
#rem / BNE` för att stoppa. Ingen JSR behövs — all kod genereras inline.

| Fält                  | Beskrivning                                                                                                                                              |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Källadress (skärm)    | Hexadress där kartdata finns efter inläsning (t.ex. `C000`)                                                                                              |
| Skärm-RAM-destination | Vart skärmkoder ska kopieras (t.ex. `0400`)                                                                                                              |
| Storlek (byte)        | Totalt antal byte att kopiera — vanligtvis `$03E8` = 1000 (40×25 tecken)                                                                                 |
| Kombinerad .bin       | När markerad förväntas skärmkoder omedelbart följt av färgdata vid `källa + storlek`; kopierar färgdata till **Färg-RAM-destination** i en andra omgång. |
| Färg-RAM-destination  | Mål för färgdata — standard `D800` (C64 färg-RAM)                                                                                                        |

**Genererad ASM (1000-byte-karta, endast skärm):**
```
LDX #$00 LDA $C000,X; sida 0 STA $0400,X INX BNE *-9; loopar tills X blir 0 (256 iterationer) LDA $C100,X; sida 1 STA $0500,X INX BNE *-9 LDA $C200,X; sida 2 STA $0600,X INX BNE *-9 LDA $C300,X; resterande — 232 byte STA $0700,X INX CPX #$E8 BNE *-11
```

**Storlek:** `2 (LDX) + hela sidor×9 + (rest > 0 ? 11 : 0)` byte per sektion.
Kombinerat läge fördubblar det (skärmsektion + identisk färgsektion).

**Parning med kartredigeraren: **

Kartredigerarens **Filer → Spara karta + färg-RAM (.bin)** exporterar en enda
binärfil där de första `storlek` bytena är skärmkoder och nästa `storlek` byte
är färg-RAM-värden. Använd MAP_COPY med **Kombinerad .bin** markerad och peka
**Källadress** där filen laddas (t.ex. via INCBIN vid `$C000`):

```
* = $C000
INCBIN "map-color.bin" @ $C000; skärmkoder $C000–$C3E7, färg $C3E8–$C7CF
* = $0801
; ...
MAP_COPY src=$C000 dst=$0400 storlek=1000 kombinerad color_dst=$D800
```

**Syntax för expertläge:**
```
.map_copy $C000, $0400, 1000; endast skärm
.map_copy $C000, $0400, 1000, auto, $D800; kombinerad (färg vid källa + storlek)
.map_copy $C000, $0400, 1000, $C3E8, $D800; explicit färgkälladress
```

---

<a id="map_copy16x16"></a>
### MAP_COPY16X16

Kopierar ett 16×16 teckenområde från ett kompakt 256-byte skärmkodblock plus ett
matchande 256-byte färg-RAM-block. Det är avsett för export av teckenuppsättning
Canvas och små kakel-/bildblock, där det skulle vara bullrigt att skriva sexton
separata MAP_COPY-rader.

**Standardlayout:**

| Data                  | Standardadress            |
| --------------------- | ------------------------- |
| 16×16 skärmkoder      | Källadress (`källa`)      |
| 16×16 färgvärden      | `källa + 256`             |
| Skärm-RAM-destination | `$0400 + rad×40 + kolumn` |
| Färg-RAM-destination  | `$D800 + rad×40 + kolumn` |

**Syntax för expertläge:**
```
.map_copy16x16 3000 kr, 12, 4
.map_copy16x16 3000 kr, 12, 4, 400 kr, 3100 kr, D800 kr
```

Den korta formen kopierar skärmbyte från `$3000`, färgbyte från `$3100` och
placerar 16×16-blocket i kolumn 12, rad 4. Giltiga positioner längst upp till
vänster är `col = 0..24` och `row = 0..9`, så hela 16×16-området finns kvar på
40×25 C64-textskärmen.

**Genererat beteende:**

- Genererar sexton inline-radkopior.
- Varje rad kopierar 16 skärmbyte och 16 färgbyte.
- Ingen JSR behövs; koden genereras direkt vid makropositionen.
- Fungerar med normalt teckenläge och flerfärgsteckenläge; färg-RAM-bytena bär
  varje cells teckenfärgs-/flerfärgsaktiveringsbit.

Typisk parning med Charset Canvas:

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
slinga:
    JMP loop

.incbin "16x16+ram+color.bin", $3000
.incbin "16x16+charset.bin", $2000
```

---

<a id="sprite_anim"></a>
### SPRITE_ANIM

Flyttar fram en sprites animationsbildruta vid varje anrop och uppdaterar
VIC-II-spritedatapekaren. Lagra en byte per bildruta i en tabell
(spritedatasidnumret = `data_address / 64`), peka SPRITE_ANIM mot den och anropa
den en gång per spelbildruta — ingen JSR behövs.

| Fält                 | Beskrivning                                                                              |
| -------------------- | ---------------------------------------------------------------------------------------- |
| Sprite #             | Spritenummer 0–7                                                                         |
| Adress till ramlista | Hexadress för ramtabellen — en byte per ram, varje byte = sprite-sida (`data_addr / 64`) |
| Antal bildrutor      | Totalt antal bildrutor (1–255)                                                           |
| Ram ZP               | Noll-sidbyte som används som bildräknare (t.ex. `FB`)                                    |

**Genererad ASM (sprite 0, 4 bildrutor, ZP `$FB`, lista vid `$C100`):**
```
INC $FB ; öka bildräknaren
LDA $FB
CMP #$04 ; bildräknare
BCC *+6 ; om räknare < antal, hoppa över återställning
LDA #$00
STA $FB
TAX ; X = aktuellt bildindex
LDA $C100,X ; ladda sprite-datasida för denna bildruta
STA $07F8 ; uppdatera sprite 0-pekaren ($07F8 + sprite#)
```

**Storlek:** 19 byte.

**Typisk användning:**
```
frameTable: .byte $21, $22, $23, $24; 4 bildrutor vid $0840, $0880, $08C0, $0900

gameloop:
WAIT_RASTER ($FF)
SPRITE_ANIM (sprite=0, list=$C100, count=4, zp=$FB)
JMP gameloop
```

**Syntax för expertläge:**
```
.sprite_anim spriteNum, frameListAddr, frameCount, zpByte
; exempel:
.sprite_anim 0, C100, 4, FB
```

> **Tips:** Placera ramtabellen som ett RAWBYTES-block på en fast adress.
> Räknarens ZP-byte (`$FB`) måste initieras till `$00` före det första anropet.
> Om din kod använder `$FB` till något annat, välj en ledig ZP-plats.

---

<a id="score_bcd"></a>
### SCORE_BCD

Lägger till ett fast punktvärde till en BCD-poäng på flera byte som lagras i
minnet och återger sedan varje siffra till skärmens RAM-minne som ett
skärmkodstecken. Använder decimalläget 6502 (`SED`/`CLD`) för bärsäker
BCD-aritmetik — ingen manuell bärjonglering behövs.

| Fält            | Beskrivning                                                                                     |
| --------------- | ----------------------------------------------------------------------------------------------- |
| Poängadress     | Hex-adress för BCD-poängbyten (t.ex. `C200`). Låg byte först.                                   |
| Siffror         | Antal BCD-byte (varje byte innehåller två siffror: `$99` = "99"). `4` byte = upp till 99999999. |
| Lägg till poäng | Decimalvärde att lägga till per anrop (t.ex. `100`).                                            |
| Skärmadress     | Var sifferkoderna ska skrivas (t.ex. `0400`). En byte per siffra (hög nibble först).            |

**Expertsyntax:**
```
.score_bcd $C200, 4, 100, $0400
```

**Genererad ASM (4 byte, +100 poäng, poäng vid `$C200`, skärm vid `$0400`):**
```
SED; aktivera BCD/decimalläge
CLC
LDA $C200; byte 0 (siffror 1–2)
ADC #$00; låg byte på 100 i BCD = $00
STA $C200
LDA $C201; byte 1 (siffror 3–4)
ADC #$01; mittenbyte på 100 i BCD = $01 (överföringen fortplantar sig)
STA $C201
LDA $C202
ADC #$00
STA $C202
LDA $C203
ADC #$00
STA $C203
CLD; tillbaka till binärläge

; rendera siffror
LDX #$00
siffrloop:
LDA $C200,X
PHA
LSR: LSR: LSR: LSR; hög nibble → låg nibble
ORA #$30 ; + '0' skärmkod STA $0406,X ; högerjusterad: skärmadress + (siffror*2 - 2) - X*2 PLA OCH #$0F ; låg nibble ORA #$30 STA $0407,X INX CPX #$04 BNE sifferloop
```

**Storlek:** `3 + siffror×8` byte (SED + CLC + CLD-overhead + 8 byte per
BCD-byte för ADC + displayloop).

**Syntax för expertläge:**
```
.score_bcd $C200, 4, 100, $0400
```

> **Tips:** Initiera poängbyten till `$00` vid start. Poängadressen ska vara i
> noll-sid- eller absolut-RAM — inte ROM. Skärmadressen ska peka på siffercellen
> längst till vänster; siffror skrivs från vänster till höger (mest signifikanta
> byte först).

> **BCD-intervall: ** `siffror=4` byte → 8 decimalsiffror → maxpoäng 99 999 999.
> Varje byte kodar två BCD-siffror: `$00`–`$99`.

---

## 11. Länkar till kunskapsbasen

Snabblänkar finns i appen under **Kunskapsbas**:

### RetroDebugger

[RetroDebugger](https://github.com/slajerek/RetroDebugger) är en
plattformsoberoende Commodore 64-felsökare med stöd för brytpunkter,
minnesinspektion och etikettmedveten demontering.

**Inställningar:** Öppna **Inställningar → Konfigurera den körbara filen
RetroDebugger** och peka den till binärfilen `RetroDebugger`.

**Starta:** Klicka på **Felsök (RetroDebugger)** i verktygsfältet. Appen kommer
att:

1. Assemblera programmet till en `.prg`-fil i en temporär katalog.
2. Skriv en **breakpoints-fil** (`breakpoints.txt`) — en `break $ADDR` per
   flaggat block.
3. Skriv en **symbols-fil** (`symbols.txt`) i Vice/RetroDebugger-etikettformat
   (`al C:addr .name`). Alla LABEL- och CONST-block ingår.
4. Skriv även sidovagnar i C64Debugger-stil bredvid den kompilerade PRG: `.dbg`,
   `.sym` och `.vs`.
5. Starta RetroDebugger med:
   ```
   RetroDebugger -prg <file.prg> -breakpoints <breakpoints.txt> -symbols <symbols.txt> [flaggor]
   ```

### Brytpunktsblock

Klicka på brytpunktsikonen (●) på valfritt instruktionsblock för att växla
mellan att vara en brytpunkt. Brytpunktsblock markeras med rött. Deras adresser
skrivs till brytpunktsfilen varje gång felsökaren startas.

### Felsökarflaggor (fliken Alternativ)

| Växla           | Flagga        | Effekt                                                                       |
| --------------- | ------------- | ---------------------------------------------------------------------------- |
| `-jmp` PÅ       | `-jmp $ADDR`  | Hoppa direkt till programmets startadress efter laddning                     |
| `-återuppta` PÅ | `-återuppta`  | Avbryt pausningen av felsökaren omedelbart vid laddning                      |
| `-vänta` PÅ     | `-vänta <ms>` | Vänta `<ms>` millisekunder innan du återupptar pausen — 500 ms eller 1000 ms |

> **Tips:** För de flesta program, aktivera `-jmp` och `-återuppta` för
> omedelbar autostart. Använd `-vänta 500` eller `-vänta 1000` när ditt program
> konfigurerar IRQ:er eller SID-musik som behöver tid att initieras innan den
> första rastret.

### VICE Monitor (hot reload, live-bevakning, profilerare)

Verktygsfältsknappen **VICE Monitor** öppnar ett icke-modalt fönster som
kommunicerar med den körande VICE via dess binära bildskärm. **Kör (VICE)**
startar VICE med bildskärmen på port 6502 (**Inställningar →
VICE-fjärrbildskärm**, aktiverad som standard). Stäng och starta om en VICE som
startades på annat sätt. Rubriken visar anslutningsstatus; *Endast tillgänglig i
skrivbordsappen* visas i webbläsarens förhandsgranskning.

| Knapp                                              | Vad den gör                                                                                                                                                            |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Varm omladdning**                                | Skriver det assemblerade programmet till det körande VICE-minnet (endast de upptagna områdena — luckorna lämnas orörda). Använd det för data: sprites, tabeller, text. |
| **Omladdning + omstart **                          | Samma sak, startar sedan om vid SYS-adressen (stacken återställs; den slutliga `RTS` återgår till `READY`).                                                            |
| **Automatisk snabb omladdning efter redigeringar** | Laddar om och startar om ungefär en sekund efter varje redigering, om programmet monteras.                                                                             |
| **Live-visning**                                   | Uppdaterar bevakningslistan var 0,4:e sekund; ett ändrat värde blinkar.                                                                                                |
| **Profil**                                         | Samplar programräknaren i cirka 5 sekunder (klicka igen för att stoppa i förtid).                                                                                      |

**Övervakningslista:** skriv en etikett eller en adress — `poäng`, `$D020`,
`53280`, eller med en byte-antalstabell `, 8` — och tryck på **+** eller Enter.
Varje rad visar adressen, byten i hexadecimalt tal och, för 1 eller 2 byte,
decimalvärdet. I Ultimate Basic-läget kommer namnen från den senaste
UB-byggningen (variabler, etiketter, undergrupper, arrayer).

**Profilerresultat:** två tabeller. *Rutin* grupperar samplen efter närmaste
etikett (i Ultimate Basic: efter `sub`), med andelen i % och rasterlinjerna den
kördes på — tiden som spenderades i KERNAL- eller BASIC-ROM listas separat.
*Linje* listar de dyraste källlinjerna; klicka på en för att hoppa till den.
Varje sampling pausar emulatorn kort, så profilen är en statistisk bild, inte
ett exakt cykelantal.

---

## 12. D64 Exportera och kör

Version 1.5.1 lägger till möjligheten att paketera ditt program (och ytterligare
datafiler) till en C64 D64-diskavbildning och starta den i VICE — eller
exportera diskavbildningen för användning någon annanstans.

| Resurs                                                        | URL                                                            |
| ------------------------------------------------------------- | -------------------------------------------------------------- |
| 6502 Opkoder Referens                                         | http://www.6502.org/tutorials/6502opcodes.html                 |
| C64 KERNAL-funktioner                                         | https://sta.c64.org/cbm64krnfunc.html                          |
| C64 Minneskarta                                               | https://sta.c64.org/cbm64mem.html                              |
| C64 Färgkoder                                                 | https://sta.c64.org/cbm64col.html                              |
| VIC-II-artikel                                                | https://www.cebix.net/VIC-Article.txt                          |
| C64-kodbas                                                    | https://codebase.c64.org/                                      |
| Turbomonteraren                                               | https://turbo.style64.org/                                     |
| RetroDebugger                                                 | https://github.com/slajerek/RetroDebugger/                     |
| C64 OS-utvecklingsmiljö                                       | https://www.c64os.com/c64os/programmersguide/?s=devenvironment |
| png2c64 Bildkonverterare                                      | https://png2c64.app/                                           |
| Restore64 Disassembler (C64 PRG → KickAssembler / ACME-källa) | https://restore64.dev/                                         |

---

## 12b. CRT-export (Magic Desk 64K-kassett)

**Meny → Bygg → Bygg CRT** producerar en Commodore 64-patronavbildning (`.crt`,
**patrontyp 19 — Magic Desk / Domark / HES Australia**) som körs på VICE,
TheC64, riktig hårdvara via EasyFlash / Kung Fu Flash och 1541 Ultimate II+
patronplatser. Den är tillgänglig i både **blockläge** och **Expertläge**, och —
från och med den nuvarande versionen — även i **UltimateBasic-läge**.

### Vad som skickas i varukorgen

Verktygsfältets **Kör**-knapp har ersatts av en **delknapp**:

| Del               | Handling                          |
| ----------------- | --------------------------------- |
| **▶ Kör** (huvud) | Utför det aktuellt valda körläget |
| **▾** (pil)       | Öppnar lägesväljaren              |

**Tillgängliga körlägen: **

| Läge                | Beskrivning                                                                                                                                                                                                                 |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Kör som PRG**     | Assemblera till en temporär `.prg` och starta VICE direkt. Klassiskt beteende.                                                                                                                                              |
| **Kör via D64**     | Assemblera, bygg en `.d64` diskavbildning (med c1541), lägg till eventuella konfigurerade extrafiler och starta sedan VICE från disken. Använd detta när ditt program laddar filer vid körning (t.ex. med makrot LOADFILE). |
| **Kör på hårdvara** | Assemblera till PRG och skicka den till en **1541 Ultimate / Ultimate 64**-enhet över det lokala nätverket. Se [Avsnitt 13](#13-hardware-settings).                                                                         |
| **Kung Fu Flash 2** | Montera till PRG och ladda upp den via USB-seriellt till en riktig C64/C128 med en **Kung Fu Flash 2**-pickup. Se [Kung Fu Flash 2](#kung-fu-flash-2).                                                                      |

Det valda läget sparas mellan sessionerna.

### Ladda adress och startpunkt

Bygg CRT använder aldrig Exomizer (avpackaren kan inte köras från vagnens ROM).
Den kompilerar den aktuella fliken med standard autostart-pipelinen och tar
laddningsadressen från PRG-headern och startpunkten från SYS-målet:

1. **Block-/expertläge med BASIC SYS-stub på:** load = `$0801`, entry =
   SYS-målet (vanligtvis `$080D` eller användarens ursprung).
2. **Block-/Expertläge med BASIC SYS-stub av:** ladda = användarursprung (med
   den klassiska `$0801 → $C000` reservfunktionen), post = ladda adress.
   - **Namn** — hur det visas i D64-katalogen (max 16 tecken, automatisk
     versaler).
   - **Addr** (ladda adress, valfritt) — om angivet, läggs en 2-byte PRG-rubrik
     till. Lämna tomt för att skriva råa byte utan rubrik.
   - **Dst** (dekomprimeringsmål, endast med EXO) — där depackaren ska landa
     data på C64. När EXO är aktiverat komprimeras extradata med `exomizer mem
     -l <Addr> file@<Dst>` (en råfil på Dst-adressen) innan den skrivs till D64.
   - **EXO** — kryssruta som aktiverar bakåtriktad `mem`-bearbetning för den här
     posten. Storleken på disken är vanligtvis 5–20 % av originalet.
3. **UltimateBasic-läge:** Både inläsning och inmatning kommer från
   UB-kompilatorkartan (`build.map.loadAddress`). UB-autostartstubben inuti
   nyttolasten körs sedan exakt som den skulle göra efter `LOAD "...",8,1 : RUN`
   från disk.

Ursprungsadressen som du ser i ASM-utdata bevaras; laddaren kopierar helt enkelt
den platta minnesbilden från PRG till RAM och hoppar till startpunkten när
vagnens ROM har avmappats.

### Storleksgräns

Eftersom nyttolasten lagras linjärt och `assembleProgramToPrg()` returnerar en
platt `minAddr..maxAddr`-buffert med nollfyllda mellanrum, räknar ett program
med brett utspridda ORG-segment (t.ex. `$0801` + `$C000` + `$E000`) varje byte
däremellan mot budgeten på 65 408 byte. Om du överskrider gränsen avbryts bygget
med ett `saveCrtTooLarge`-fel — antingen komprimera minneslayouten eller dela
upp data.

Exemplet **loadfile-demo** levereras förkonfigurerat med `DEMO-COLORS.PRG` som
en extra fil. Markera den, öppna **Kör via D64** och klicka på **Kör** för att
se hela laddningsflödet i aktion.

> **⚠️ Viktig varning — läs innan du skickar en CRT**

### Kompatibilitet

Verktygsfältsikonen efter kurvredigeraren öppnar **D64-redigeraren** — ett
fristående verktyg för att arbeta direkt med en befintlig `.d64`-bild, oberoende
av det program som för närvarande är öppna. Till skillnad från dialogrutan
Exportera till D64 ovan (som alltid skapar en *ny*-disk från den kompilerade
PRG:n), redigerar D64-redigeraren en diskavbildning på plats via `c1541`, så den
fungerar även som en lättviktig diskhanterare.

**Filer ▾ meny:**

| Plattform             | Handling                                      |
| --------------------- | --------------------------------------------- |
| VICE (`x64sc`, `x64`) | Fungerar via **Arkiv → Bifoga patronbild**.   |
| C64 / C64 Mini        | Fungerar via den inbyggda patronladdaren.     |
| Kung Fu Flash         | Fungerar — inbyggt Magic Desk-läge.           |
| EasyFlash-patron      | Fungerar när den programmeras som Magic Desk. |

**Verktygsfält:**

| Ikon                     | Handling                                                                                                                                                                |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Lägg till program**    | Välj en lokal fil och skriv den till diskkatalogen.                                                                                                                     |
| **Utdrag valt**          | Spara den valda postens byte till en lokal `.prg`-fil.                                                                                                                  |
| **Byt namn på markerad** | Redigera postnamnet infogat i tabellen — Enter bekräftar, Escape avbryter.                                                                                              |
| **Ta bort markerade **   | Ta bort den valda posten från disken.                                                                                                                                   |
| **Uppdatera**            | Läs om katalogen, t.ex. efter att ha redigerat disken från ett annat verktyg.                                                                                           |
| Spara                    | Skriv tillbaka arbetskopians redigeringar till den riktiga `.d64`-filen, och gör först en automatisk säkerhetskopia. Aktiveras endast när det finns osparade ändringar. |

**Lägga till ett program:** Om du väljer en fil som redan slutar på `.prg`
frågar du bara efter ett **Namn** och en diskett **Typ** (PRG/SEQ/USR/REL) — en
`.prg` har redan sin egen load-address-rubrik, så den skrivs oförändrad. Om du
väljer en annan fil (t.ex. en rå `.bin`) visas dessutom:

- **Ladda adress** (hex, valfritt) — lägg till en 2-byte PRG-rubrik vid den här
  adressen; lämna tomt för att skriva bytena råa.
- **Dekomprimeringsadress** (hex, valfritt) — används endast tillsammans med
  Exomizer; måladressen som depackaren ska packa upp data till.
- Kryssrutan **Exomizer** — komprimera filen innan skrivning, med samma
  `mem`/`sfx` crunch-lägen som för extrafilerna i dialogrutan Exportera till D64
  ovan.

Katalogens lista visar filnamn med samma teckensnitt och versaler som en riktig
C64 `LOAD"$",8`-lista.

**Spara arbetsflöde:** varje redigering – lägg till, extrahera, byt namn på, ta
bort och Block Editor byte-redigeringar – tillämpas på en privat arbetskopia av
diskavbildningen, inte din riktiga fil. Verktygsfältsknappen **Spara**
(aktiverad när det finns osparade ändringar) skriver tillbaka arbetskopian över
den riktiga `.d64`, vilket gör en automatisk säkerhetskopia först; rubriken
visar en **•**-markör medan ändringarna inte är sparade, och om du stänger
redigeraren eller öppnar en annan disk med osparade ändringar frågas efter
bekräftelse istället för att ignorera dem. **Spara som…** (Arkiver ▾ meny)
skriver arbetskopian till en ny sökväg och fortsätter redigeringen där.

**Blockredigerare:** Verktygsfältets rutnätsikon växlar till en rå
spår-/sektorvy under katalogen — en klickbar blockkarta färgad av BAM:s
lediga/använda bitmapp (med BAM och katalogkedjan markerade separat), ett
hexagonalt rutnät per byte för det valda 256-byte-blocket och Föregående/Nästa
sektornavigering. Blockredigeringar går igenom samma arbetsflöde för att
kopiera/spara som katalogåtgärderna ovan.

> **Krav:** Precis som Exportera till D64 kräver D64-redigeraren att VICE
> (`c1541`) är konfigurerat i [Maskinvaruinställningar](#13-hardware-settings).

---

## 13. Maskinvaruinställningar

Öppna via **Inställningar → Maskinvaruinställningar…** i verktygsfältsmenyn.
Alla externa maskinvarusökvägar och nätverkskonfiguration finns här.

### VICE-emulator

- **8 × 8 KB banker** vid `$8000`, bankväxlad via `$DE00` (Magic
  Desk-konvention: låga 3 bitar = bank, bit 7 = inaktivera varukorg).
- **Bank 0** innehåller en 128-byte header + boot loader:
  - `$8000/$8002` kall + varm startvektorer pekar på `$8009`.
  - `$8004–$8008` = `CBM80`-signaturen som krävs av KERNAL-återställningskoden.
  - `$8009–$807F` = laddaren: SEI / stack init / `JSR $FDA3` (IOINIT) / `JSR
    $FD50` (RAMTAS) / `JSR $FD15` (RESTOR) / `JSR $FF5B` (CINT), sedan en
    byte-kopieringsslinga som strömmar nyttolasten från vagnens ROM till RAM och
    byter bank när `$FC` når `$A0`. I slutet kopierar den en liten **exit stub**
    till `$0100`, inaktiverar varukorgen med `LDA #$80 : STA $DE00` och `JMP`
    till startpunkten.
- **Nyttolast** börjar vid `$8080` i bank 0 och överförs till bankerna 1–7 efter
  behov. Maximal nyttolast = `8 * 8192 − 128 = 65 408 byte`.

### Exomizer

**Arbetsflöde:**

- Installera Exomizer-binärfilen:
- Konfigurera sökvägen i **Hårdvaruinställningar → Exomizer-sektionen**.
- Aktivera kryssrutan **Kör med Exomizer** i **Inställningsmenyn**.

Exomizer fungerar på samma sätt i Windows och macOS – CLI anropas från
Tauri-backend; ingenting i integrationen är plattformsspecifikt.

### Retro-felsökare

Se [Avsnitt 9]{1} för fullständig dokumentation om felsökaren.

> **⚠️ Viktig varning — läs innan du skickar en CRT**
> 
> Laddaren anropar KERNAL **`RESTOR` ($FD15)** som en del av
> standardåterställningssekvensen. Detta skriver avsiktligt om standard
> I/O-vektorerna vid `$0314/$0315`, `$0316/$0317`, `$0318/$0319`, `$0328/$0329`
> och vänner tillbaka till deras ROM-standardinställningar. Konsekvenser:
> 
> - **Alla IRQ / NMI / BRK-hooks som ställts in innan CRT-starten rensas.** Ditt
>   program måste installera dem självt efter inmatning — precis som en ny `LOAD
>   "",8,1 : RUN` från band/disk.
> - **UltimateBasic-program** som förlitar sig på att icke-standardiserade
>   KERNAL-vektorer är aktiva vid start kan behöva ett explicit `SYS`- eller
>   init-anrop i autostart-stubben. Standard UB-autostarten fungerar direkt;
>   tilläggsbibliotek som kopplar vektorer *före* `RUN` gör det inte.
> - **CIA1 / CIA2** ominitialiseras av `IOINIT`. Anpassade timerinställningar
>   (raster-IRQ:er, musikspelare CIA-A) måste omprogrammeras efter inmatning.
> - Kundvagnen är inaktiverad från en 8-byte stub i **RAM vid `$0100`** så att
>   `STA $DE00` inte kan avbrytas av en felaktig ROM-hämtning. Lita inte på att
>   `$0100–$0107` innehåller stack top-avbildningen vid inmatning — den första
>   RAM-pushen skriver över stubben.
> 
> Om en CRT körs i VICE men misslyckas på riktig hårdvara, är det första man bör
> kontrollera om programmet antar ett specifikt KERNAL-vektor- eller
> CIA-timertillstånd vid start. Installera tillståndet explicit i din init-rutin
> så kommer den att bete sig likadant på båda.

### C64 Ultimate / 1541 Ultimate

| Plattform                       | Beskrivning                                                          |
| ------------------------------- | -------------------------------------------------------------------- |
| **Värd (IP)**                   | Enhetens IP-adress (t.ex. `192.168.1.100`)                           |
| **Lösenord**                    | Valfritt — om enheten kräver autentisering                           |
| **Testanslutning**              | Skickar en testförfrågan till `/v3/runners/info`; visar OK eller fel |
| EasyFlash-patron                | Fungerar när den programmeras som Magic Desk.                        |
| 1541 Ultimate II+ / Ultimate 64 | Fungerar via **Kassett → Ladda varukorg bild **.                     |
| Kameleont / Turbo-kameleont     | Fabrik.                                                              |

---

## 14. Visuella redigerare (verktygslåda)

Öppna via **Meny → Inställningar…** (tidigare *Maskinvaruinställningar*).
Dialogrutan har tre flikar: **Allmänt** (assemblerläge, BASIC SYS-stub, Kör med
Exomizer, uppdateringar, ASM-utdata, SID-förhandsgranskning, C64
Debugger-parametrar, ögonblicksbilder / versionskontroll), **Filer och
sökvägar** (VICE, RetroDebugger, ACME, Exomizer, git) och **Integrationer** (C64
Ultimate, Kung Fu Flash 2). Avsnitten nedan beskriver de externa verktygen och
enheterna.

### Högupplöst/flerfärgsredigerare

| Miljö                 | Beskrivning                                                                                                                   |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Lägesväxlare          | **Multicolor** Kryssrutan växlar mellan hög upplösning (mono per cell) och flerfärg (4 färger per cell).                      |
| **Status**            | Visar om den körbara sökvägen är giltig och tillgänglig                                                                       |
| **VICE fjärrmonitor** | Startar VICE med den binära monitorn på port 6502, som behövs av [VICE Monitor](#vice-monitor-hot-reload-live-watch-profiler) |

Pixelnivå-bitmappsredigerare med både 320×200 högupplösta och 160×200
flerfärgslägen. Öppna via Verktygskit → Högupplöst redigerare.

### Sprite-redigeraren

| Miljö      | Beskrivning                                                               |
| ---------- | ------------------------------------------------------------------------- |
| Ramar      | Lägg till / ta bort / ändra ordning på ramar; ramremsan visas längst ner. |
| Läge       | Mono-/flerfärgsbrytare.                                                   |
| **Status** | Visar om den körbara sökvägen är giltig och tillgänglig                   |

**Arbetsflöde:**
1. Installera Exomizer-binärfilen:
   - **Windows:** ladda ner den förbyggda `win32/exomizer.exe` från
     https://bitbucket.org/magli143/exomizer/wiki/Home eller
     https://csdb.dk/release/?id=244342.
   - **macOS:** `brew install exomizer` (installerar Magnus Linds officiella
     3.1.2-version).
2. Konfigurera sökvägen i **Hårdvaruinställningar → Exomizer-sektionen **.
3. Aktivera kryssrutan **Kör med Exomizer** i **Inställningsmenyn**.
4. Alla **Run**-åtgärder (PRG, D64, hårdvara) och **Build**-åtgärder (Build PRG,
   Build D64) kommer nu att cruska det assemblerade programmet genom `exomizer
   sfx` innan det startas eller sparas: `sfx basic` när PRG startar med en
   BASIC-rad (efter avcrunchning startar RUN den ursprungliga `SYS`-raden, så en
   andra RUN fungerar också), `sfx $<load address>` annars.

Exomizer fungerar på samma sätt i Windows och macOS – CLI anropas från
Tauri-backend; ingenting i integrationen är plattformsspecifikt.

**Två komprimeringslägen används internt:**

| Läge                                | Används av                                        | Anropskonvention                                                                                                                                                                |
| ----------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sfx grundläggande` / `sfx $<addr>` | Bygg/Kör med Exomizer-växling (PRG:s huvudsökväg) | Självutdragande PRG med inbyggd avkrossare; inställningen för kantblixt kontrollerar `-x1` vs `-n`                                                                              |
| `mem` (bakåt)                       | Kör via D64 → kryssruta per fil **EXO**           | Komprimerar varje extra fil till en `mem`-lägesström; programmet dekomprimerar den vid körning via makrot **EXODECRUNCH** och en förbyggd depacker (`samples/exo-decrunch.bin`) |

> **Tips:** Om Exomizer-sökvägen inte är konfigurerad men kryssrutan är
> aktiverad visas ett tydligt felmeddelande istället för att starta. Avaktivera
> kryssrutan för att köra utan komprimering.

> **Integrationstest:** `cargo test --test exomizer_integration` (i
> `src-tauri/`) verifierar den fullständiga mem-mode-komprimeringen +
> dekomprimeringen tur och retur på en 6502-emulator.

### C64 Tecken-ROM-läsare ("Teckenkarta")

| Miljö                   | Beskrivning                                                                                                                                                                                                        |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Två teckenuppsättningar | Flik 1: **Set 1 — Övre/Grafik** (standardläge efter påslag). Flik 2: **Set 2 — Nedre/Övre** (efter `$0E`-brytaren).                                                                                                |
| **Status**              | 16×16 rutnät med alla 256 tecken. Klicka på en teckensymbol för att se dess detaljpanel: zoomad 8×8 pixlarvy, skärmkod (decimal + hex), PETSCII-koder (både standard och förskjutna) och den råa 8-byte bitmappen. |

Skrivskyddad läsare av C64-tecken-ROM (det inbyggda PETSCII-teckensnittet).
Öppnas via posten **C64 chargen** i Toolkit-menyn. Användbart för att hitta
skärmkoden för en tecken innan du skriver den med `RAWBYTES` eller `TEXT`.

### Teckenredigerare (teckenuppsättning)

Teckenuppsättningsredigerare med 256 tecken, 8×8. Öppna via Verktyg →
Teckenredigerare.

| Miljö                      | Beskrivning                                                                              |
| -------------------------- | ---------------------------------------------------------------------------------------- |
| Ladda ROM                  | Importerar C64 ROM-teckenuppsättningen direkt från VICE:s `laddning` (ingen filväljare). |
| Ladda `.bin`               | Importerar en extern binärfil med 2048 byte teckenuppsättning.                           |
| Förhandsvisning per tecken | 16-brett rutnät med alla 256 tecken med den aktuella cellen markerad.                    |

**Arbetsflöde:**
1. Anslut 1541 Ultimate / Ultimate 64 till ditt lokala nätverk.
2. Ange dess IP-adress (och lösenord om det är inställt) i
   maskinvaruinställningar.
3. Välj **Kör på hårdvara** från menyn för delad körning.
4. Klicka på **▶ Kör** — PRG kompileras och skickas till enheten via HTTP POST
   till `/v3/runners/prg`. Enheten laddar och kör den omedelbart på C64.

> **Tips:** Ingen USB-kabel eller drivrutin behövs – REST API är inbyggt i
> Ultimate-firmwaren. Din dator och enheten måste vara på samma lokala nätverk.

### Teckenuppsättning Canvas-redigeraren

Helskärmsverktyg för teckenuppsättningshanterare för att bygga skärmar från en
komplett teckenuppsättning på 256 tecken. Öppna via Toolkit → Charset Canvas.

Arbetsytan är 16×16 tecken stor. I monoläge ger det en arbetsyta på 128×128
pixlar; i flerfärgsläge för tecken ger det en arbetsyta på 64×128 pixlar med
breda pixlar enligt C64:s regler för flerfärgade tecken.
- en Commodore 64 / C128 med en **Kung Fu Flash 2**-pickup monterad, påslagen;
- **Kung Fu Flash firmware v2.07 eller senare ** på kassetten — tidigare
  firmwareversioner stöder inte uppladdningsprotokollet som används av Visual
  Assembler. Firmwareversioner:
  <https://codeberg.org/KimJorgensen/KungFuFlash2/releases/>;
- en **USB-kabel** som ansluter kassetten till datorn som kör Visual Assembler
  (den visas som en virtuell serieport).

| Miljö             | Beskrivning                                                                                                                                  |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Mono / flerfärgad | Monoläget lagrar 1-bitars 8×8-glyfer. Flerfärgsläget lagrar tvåbitars horisontella pixelpar och markerar använda celler med Color RAM-bit 3. |

**Arbetsflöde:**
1. Sätt i Kung Fu Flash 2 i C64:ans pickupport, slå på datorn och anslut
   USB-kabeln till din PC/Mac.
2. Öppna **Maskinvaruinställningar** och kontrollera avsnittet **Kung Fu Flash
   2** — porten borde redan vara ifylld.
3. Välj **Kung Fu Flash 2** från delad körning-menyn (valet sparas och lagras
   även i projektfiler).
4. Klicka på **▶ Kör**. Programmet kompileras, kassetten startas om i sin
   MENU-laddare (en kort 1200-baud "tryckning" på serieporten), en liten
   handskakning följer och PRG:en laddas upp. När överföringen är klar körs
   programmet på den riktiga maskinen.

Fungerar från både **Block**, **Expert** och **Ultimate Basic**-läge; Ultimate
Basic-programmen kompileras från projektets startfil.

> **Gränser och kontroller:** PRG:n måste innehålla den tvåbyte långa
> laddningsadressen plus minst en databyte, måste passa in i C64:ans
> adressutrymme på 64 KiB och får inte överstiga den storlek som kassettens
> laddare accepterar. Fel — porten är inte konfigurerad, porten kan inte öppnas,
> kassetten återgår inte från MENY eller en avvisad uppladdning — rapporteras i
> en toast med den exakta orsaken.

> **Tips:** om du föredrar en patronavbildning istället för en liveuppladdning,
> **Build CRT** (Magic Desk 64K) körs även på Kung Fu Flash — se [Avsnitt
> 12b](#12b-crt-export-magic-desk-64k-cartridge).

---

---

### Versionskontroll (git)

| Miljö                                                    | Beskrivning                                                                                                                                                  |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Automatiska autosparande poster i versionshantering ** | Lägger till en automatisk sparningspost i versionshistoriken cirka 2,5 sekunder efter att du slutat redigera (även för projektflikar till projekthistoriken) |
| **Välj git.exe…**                                        | Bläddra till den körbara filen `git` (`git.exe` i Windows)                                                                                                   |
| **Automatisk identifiering**                             | Rensar den valda sökvägen och söker i PATH och de vanliga installationsmapparna                                                                              |
| **Använd Git när projektet finns i ett repository**      | Öppnar dialogrutan för versionshantering i Git-läge för filer i ett git-arkiv                                                                                |
| **Status**                                               | Visar git-versionen, eller att git inte hittades (den inbyggda versionskontrollen fungerar fortfarande)                                                      |

## 14. Visuella redigerare (verktygslåda)

Verktygsfältsmenyn **Verktygslåda** grupperar de visuella dataredigerarna som
alla delar en gemensam Fil-meny (`Filer ▾`) för Ladda BIN / Spara BIN /
Exportera till block / Spara till D64. Varje redigerare producerar rå
`.bin`-data som kan placeras i ett program med `INCBIN`, eller läggas direkt
till en D64-disk via posten **Spara till D64**.

**Färgpalett:** **Inställningar → Allmänt → Redigerare → C64 färgpalett** väljer
RGB-värdena som varje editor ritar de 16 C64-färgerna med (sprite, karaktär,
Charset Canvas, Hi-Res, kart- och nivåredigerare, Toolkit-färgrutor).
Standardinställningen är **Colodore**, det närmaste som en riktig C64 på en
komposit-/S-Video-skärm; **Pepto** (den mörkare, mindre mättade paletten från
äldre versioner), **VICE**, **Deekay** och **C64 Wiki / Godot** är också
tillgängliga. Endast visningen ändras — färgindexen i dina data förblir desamma.
Importen av högupplösta bilder använder också editorpaletten, såvida du inte
väljer en annan där.

**Anpassad palett:** om ingen av dem matchar din skärm eller din riktiga C64,
välj **Anpassad** och klicka på **Redigera anpassad palett…**. Var och en av de
16 färgerna får en färgväljare och ett hexagonalt fält (`#RRGGBB`); **Börja
från** + **Kopiera** fyller alla 16 från en inbyggd palett. **Importera…** läser
en Photoshop `.act`, en VICE `.vpl`, en GIMP `.gpl` eller valfri text med 16
`#RRGGBB` / `$RRGGBB`-värden (de första 16 färgerna används); **Exportera .act**
och **Exportera .vpl** skriver paletten för Photoshop eller för VICE
(*Inställningar → Video → Palett* i VICE), så att du kan jämföra samma färger i
emulatorn. **Spara** lagrar det och växlar till **Anpassad**.

Dialogrutor i den visuella redigeraren kan dras med hjälp av rubrikerna över
hela arbetsytan i Visual Assembler. En dialogruta utan sparad position öppnas
centrerad; efter att den har flyttats lagras dess senaste position i
användargränssnittsinställningarna och återställs nästa gång den öppnas.

### Högupplöst/flerfärgsredigerare

Pixelnivå-bitmappsredigerare med både 320×200 högupplösta och 160×200
flerfärgslägen. Öppna via Verktygskit → Högupplöst redigerare.

| Särdrag                 | Beskrivning                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lägesväxlare            | **Multicolor** Kryssrutan växlar mellan hög upplösning (mono per cell) och flerfärg (4 färger per cell).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Verktyg                 | Penna, suddgummi, linje, rektangel, fylld rektangel, oval, fylld oval, fyllning, färgväljare, cellpapper, markering.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Färgväljare             | Klicka på en pixel för att synliggöra dess färg bläcket (i hög upplösning cellens bläck eller papper, beroende på vilket pixeln visar); redigeraren återgår sedan till föregående verktyg. **Alt+klicka** väljer färgen med valfritt verktyg.                                                                                                                                                                                                                                                                                                                                                                                                   |
| Cellpapper (högupplöst) | Hög upplösning tillåter två färger i varje 8×8-cell: bläcket (angivna pixlar, hög nibble av cellens skärm-RAM-byte) och pappret (rena pixlar, låg nibble). Verktyget **Cellpapper** ställer in pappret för varje cell du klickar eller drar över till den valda färgen; **PAPPER** ställer fortfarande in varje cell samtidigt. Radergummit rensar pixlar, så att cellens eget papper syns. Inaktiverat i flerfärg, där bakgrunden ($D021) delas.                                                                                                                                                                                               |
| Sprutverktyg            | Airbrush-liknande målare som sprider pixlar runt markören medan du ritar.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Sprutintensitet         | Listrutan bredvid sprutverktyget styr hur tätt varje sprutslag är.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Färgpalett              | Förgrunds- (bläck) + pappers- (bakgrunds) väljare. Flerfärgsläget spårar automatiskt 3 extrafunktioner per cell.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Ångra / Gör om          | Historik per penseldrag, ctrl-Z / ctrl-Y.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Välja                   | Verktyget streckad fyrkant: dra på arbetsytan för att markera ett rektangulärt område. **Esc** rensar markeringen.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Kopiera / Klistra in    | **Kopiera** (`Ctrl/Cmd+C`) kopierar det markerade området. **Klistra in** (`Ctrl/Cmd+V`) visar en förhandsgranskning som följer markören: klicka på arbetsytan för att placera den, **Esc** avbryter. Kopian behålls, så om du trycker på `Ctrl/Cmd+V` och klickar igen placeras den så många gånger som behövs. I högupplöst läge följer inklistrade pixlar fortfarande gränsen på två färger per cell, så justera regionen med cellrutnätet för att behålla dess färger. Kopiera, Klistra in och Genomskinlig klistra finns också i högerklicksmenyn på arbetsytan; en inklistring som startats där förhandsgranskas på den klickade platsen. |
| Transparent pasta       | `Ctrl/Cmd+Shift+V` (eller dess knapp i verktygsfältet) hoppar över de pappersfärgade pixlarna i kopian, så att bilden under syns igenom.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Rutnät + Raster         | **Rutnät** visar tecken-cellsrutnätet: 8×8 pixlar i hög upplösning, 4×8 pixlar med dubbel bredd i flerfärg. Från 4× zoom ritar den också en svagare linje runt varje enskild pixel, så att varje pixel kan placeras exakt. **Raster** lägger till ett rasterradlager.                                                                                                                                                                                                                                                                                                                                                                           |
| Zoom                    | Skjutreglage från 1× till 16×, eller Ctrl+hjul över arbetsytan (punkten under markören stannar på plats).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Importera bild          | PNG/JPEG/GIF som släpps på arbetsytan kvantiseras automatiskt till C64-paletten med 16 färger.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Exportera block         | Lägger till BYTE/RAWBYTES-block i programmet med kodad bitmapp, skärm och färgdata.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Exportera `.bin`        | Sparar det ursprungliga flerfärgsformatet (10000 byte: 8000 bitmapp + 1000 skärm + 1000 färg) klart för LOADFILE till $2000.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |

### Sprite-redigeraren

24×21 pixlars sprite-editor med flerbildsanimering. Öppna via Toolkit → Sprite
Editor.

| Särdrag                      | Beskrivning                                                                                                                                                                                                                                                                                                                                                                                                   |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ramar                        | Lägg till / ta bort / ändra ordning på ramar; ramremsan visas längst ner. **Kopiera** / **Klistra in** i ramraden kopierar du hela den aktuella ramen; samma två poster finns i högerklicksmenyn på arbetsytan och på ramremsan.                                                                                                                                                                              |
| Läge                         | Mono-/flerfärgsbrytare.                                                                                                                                                                                                                                                                                                                                                                                       |
| Verktyg                      | Penna, fyllning, färgväljare, linje, rektangel, cirkel — plus vänd horisontellt, vänd vertikalt, flytta vänster/höger/uppåt/nedåt (med valfri radbrytning). Formverktygen visar en liveförhandsvisning när du drar; släpp för att bekräfta.                                                                                                                                                                   |
| Färgväljare                  | Klicka på en pixel för att välja dess färgplats (spritefärg, MC1, MC2, bakgrunds- eller överläggsfärg, på det redigerade lagret); redigeraren återgår sedan till föregående verktyg. **Alt+klicka** markerar med valfritt verktyg.                                                                                                                                                                            |
| Zoom                         | Skjutreglaget från 3× till 40×, eller Ctrl+hjulet över arbetsytan.                                                                                                                                                                                                                                                                                                                                            |
| Ångra / gör om               | Fullständig ångra/gör om-stapel per bildruta. Ctrl/Cmd+Z / Ctrl/Cmd+Y eller verktygsfältsknapparna.                                                                                                                                                                                                                                                                                                           |
| Bildimport                   | Importera en PNG- eller JPEG-fil via Filer → Importera bild. Importören mappar varje pixel till närmaste C64-palettfärg och skriver den i den aktuella bildrutan.                                                                                                                                                                                                                                             |
| Förhandsvisning av animering | Spela upp/stoppa med konfigurerbar hastighet.                                                                                                                                                                                                                                                                                                                                                                 |
| Exportera block              | Infogar ett RAWBYTES-block vid en 64-byte-justerad adress för varje ram, plus en sprite-pekarinställning.                                                                                                                                                                                                                                                                                                     |
| Spara `.bin`                 | Skriver 64 byte per bildruta (rå sprite-data utan utfyllnad).                                                                                                                                                                                                                                                                                                                                                 |
| Urval                        | **Markera / flytta**: dra en rektangel och dra sedan inuti den för att flytta pixlarna (tomma pixlar är transparenta); piltangenterna flyttar den en pixel (två i flerfärg), Delete tar bort den, Esc tar bort den. **Rotera 90°** (båda riktningarna) roterar markeringen, eller hela ramen. Markeringen, vändningen, skiftningen och rotationen påverkar ramens innehåll och överlappar varandra.           |
| Högupplöst överlägg          | **Högupplöst överlägg** lägger till en andra, enfärgad högupplöst sprite över varje bildruta — den klassiska konturen över en flerfärgad kropp. Listan **Lager** väljer det redigerade lagret; överlägget nedtonas medan kroppen redigeras. På C64 är det en separat sprite: ge den ett lägre spritenummer än kroppen. `.bin` och **Kopiera byte** skriver overlay-sprites efter kroppens (`sprite_f1_ov_1`). |
| Spegla alla                  | Lägger till en horisontellt speglad kopia av varje bildruta (och dess träffruta) — en gångcykel åt andra hållet med ett klick.                                                                                                                                                                                                                                                                                |
| Import av Sprite-ark         | Filer → **Importera sprite-ark…**: cellbredd/höjd, offset, mellanrum och bildruteantal klipper bilden i bildrutor med aktuell storlek (flerfärgade celler skalas till 12 pixlar per sprite). Färgerna kommer från bilden eller förblir spritens egna; OKLab-matchning utan dithering, ordnad (Bayer) eller Floyd-Steinberg-dithering. Ersätter bildrutorna eller lägger till dem.                             |
| Hitbox                       | Verktyget **Hitbox** drar en rektangel per bildruta (streckad cyan); **Anpassa**, **Anpassa varje bildruta**, **Kopiera till varje bildruta** och **Ta bort** i sidopanelen. Filer → **Kopiera träffrute-tabellen** ger `sprite_hit_x / _y / _w / _h` (en byte per bildruta, skärmpixlar från övre vänstra hörnet); en bildruta utan en träffruta använder dess pixelgränser.                                 |
| X/Y ×2                       | Visar förhandsgranskningen som med sprite-expansionen `$D01D` / `$D017`.                                                                                                                                                                                                                                                                                                                                      |

**Exportera till UltimateBasic** (Arkiv-menyn) skriver varje bildruta (upp till
8) som en `sprdef`, ställer in sprite 0 (färg, flerfärgad, expandera) och
lägger, för en animering, till en rastersynkroniserad loop som stegar
bildrutorna vid redigerarens FPS. I Ultimate Basic-läge infogas den vid
markören, annars kopieras den till urklipp.

### C64 Tecken-ROM-läsare ("Teckenkarta")

Skrivskyddad läsare av C64-tecken-ROM (det inbyggda PETSCII-teckensnittet).
Öppnas via posten **C64 chargen** i Toolkit-menyn. Användbart för att hitta
skärmkoden för en tecken innan du skriver den med `RAWBYTES` eller `TEXT`.

| Särdrag                 | Beskrivning                                                                                                                                                                                                        |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Två teckenuppsättningar | Flik 1: **Set 1 — Övre/Grafik** (standardläge efter påslag). Flik 2: **Set 2 — Nedre/Övre** (efter `$0E`-brytaren).                                                                                                |
| Glyfrutnät              | 16×16 rutnät med alla 256 tecken. Klicka på en teckensymbol för att se dess detaljpanel: zoomad 8×8 pixlarvy, skärmkod (decimal + hex), PETSCII-koder (både standard och förskjutna) och den råa 8-byte bitmappen. |
| Detaljpanel             | Visar den valda glyfens skärmkod, PETSCII-koder och de åtta råa bytena – redo att klistra in i ett `RAWBYTES`- eller BYTE-block.                                                                                   |
| Skrivskyddad            | Ingen redigering här — använd teckenredigeraren (nedan) för att modifiera tecken.                                                                                                                                  |

### Teckenredigerare (teckenuppsättning)

Teckenuppsättningsredigerare med 256 tecken, 8×8. Öppna via Verktyg →
Teckenredigerare.

| Särdrag                    | Beskrivning                                                                                                                                                                                                                                                                       |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ladda ROM                  | Laddar C64-tecken-ROM:n — exakt samma tecken som 901225-01, ingen filväljare. Den första knappen (och **Filer → ROM: versaler / grafik**) laddar uppsättning 1, den andra knappen (eller Skift+klicka, eller **Filer → ROM: gemener / versaler**) laddar uppsättning 2.           |
| Ladda `.bin`               | Importerar en extern binärfil med 2048 byte teckenuppsättning.                                                                                                                                                                                                                    |
| Förhandsvisning per tecken | 16-brett rutnät med alla 256 tecken med den aktuella cellen markerad.                                                                                                                                                                                                             |
| Pixelredigerare            | Redigerar det valda tecknet, eller en **ruta** med 2×1, 1×2 eller 2×2 angränsande tecken som en bild (rutväljare).                                                                                                                                                                |
| Ritverktyg                 | Blyertspenna, linje, rektangel, fylld rektangel, flödfyllning och färgväljare. Ett klick på en pixel som redan har bläck raderar den. Färgväljaren (endast flerfärgad; **Alt+klicka** med valfritt verktyg) gör den klickade pixelns färg — FG, BG, MC1 eller MC2 — till bläcket. |
| Transformationer           | Rensa, invertera, vända horisontellt/vertikalt, skifta med omslutning, rotera 90° medurs/moturs (endast fyrkantiga plattor) — på hela plattan.                                                                                                                                    |
| Ångra / Gör om             | Verktygsfältsknappar, Ctrl+Z och Ctrl+Y (Ctrl+Shift+Z).                                                                                                                                                                                                                           |
| Kopiera / Klistra in       | Verktygsfältsknappar, Ctrl+C / Ctrl+V, eller högerklicka på kartan; kopierar hela rutan med dess färger.                                                                                                                                                                          |
| Dra kartan                 | Dra en karaktär till en annan på kartan för att byta ut dem; Skift+dra kopior.                                                                                                                                                                                                    |
| Förhandsgranskning av text | Skriv text för att se den i den aktuella teckenuppsättningen. Välj om du vill använda versaler eller gemener; `{65}` eller `{$41}` infogar en skärmkod.                                                                                                                           |
| Export av intervall        | Ställ in Från/Till-tecknen, sedan **Filer → Spara område (.bin)** (råa byte) eller **Kopiera område ASM** (`.byte` rader).                                                                                                                                                        |
| Färg per tecken            | Lagrar ett standardvärde för färg-RAM för varje tecken. I flerfärgsläge för tecken bevarar detta även aktiveringsbiten för flerfärg per cell och tecknets egen lägre 3-bitarsfärg.                                                                                                |
| Metadata tur och retur     | När man läser in kompatibla data från arbetsflöden för teckenuppsättning Canvas/Map bevaras färgmetadata per tecken så att redigeringar kan fortsätta utan att förlora färgintentionen.                                                                                           |
| Exportera block            | Lägger till RAWBYTES vid $0800 (block 2) eller $3800 (block 7) med den kodade teckenuppsättningen.                                                                                                                                                                                |

### Teckenuppsättning Canvas-redigeraren

Helskärmsverktyg för teckenuppsättningshanterare för att bygga skärmar från en
komplett teckenuppsättning på 256 tecken. Öppna via Toolkit → Charset Canvas.

Arbetsytan är 16×16 tecken, 128×128 pixlar. I flerfärgsläge är varje tecken
antingen flerfärgat (breda pixlar, 4 färger) eller högupplöst (8 smala pixlar, 2
färger), precis som på C64.

| Särdrag                             | Beskrivning                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |                                               |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| Mono / flerfärgad                   | Monoläge lagrar 1-bitars 8×8-glyfer. Flerfärgsläge lagrar tvåbitars horisontella pixelpar och markerar flerfärgade celler med Color RAM-bit 3.                                                                                                                                                                                                                                                                                                                                                                   |                                               |
| Verktyget för teckenläge            | I flerfärgsläge, klicka eller dra över tecken för att växla mellan flerfärg och högupplöst (Color RAM bit 3). Formen behålls: ett angivet pixelpar blir karaktärens egen färg. En högupplöst karaktär har bakgrunden och sin egen färg (0–7); MC1 / MC2 målar inte där.                                                                                                                                                                                                                                          |                                               |
| Bakgrund                            | BG-rullgardinsmenyn visas även i monoläge; MC1/MC2 endast i flerfärgsläge.                                                                                                                                                                                                                                                                                                                                                                                                                                       |                                               |
| ECM                                 | Kryssrutan **ECM** (utökat färgläge, inte tillsammans med flerfärg): varje tecken är högupplöst med sin egen färg (0–15) och en av fyra bakgrunder BG0–BG3 (`$D021`–`$D024`; BG1 / BG2 är MC1 / MC2-registren). Välj en BG-färg i paletten (taggad B0–B3), klicka eller dra sedan över tecknen med verktyget **Teckenbakgrund**. Endast 64 olika tecken får plats: statusraden räknar dem, och när du sparar slås lika tecken samman — teckenuppsättningen är 64 tecken (512 byte) och skärmkoderna är `glyfer`. | bakgrund << 6`. Slå på ECM med `$D011` bit 6. |
| C64 färgmodell                      | Bakgrunden använder `$D021`; delad flerfärg 1 använder `$D022`; delad flerfärg 2 använder `$D023`; varje karaktärs egen färg kommer från Color RAM-bitarna 0–2.                                                                                                                                                                                                                                                                                                                                                  |                                               |
| Ritverktyg                          | Blyertspenna, suddgummi, linje, rektangel, oval och flödfyllning fungerar över teckengränser.                                                                                                                                                                                                                                                                                                                                                                                                                    |                                               |
| Färgväljare                         | Klicka på en pixel för att välja dess synliga färg (i ett flerfärgstecken även dess BG / MC1 / MC2 / egenfärgad bläck); redigeraren återgår sedan till föregående verktyg. **Alt+klicka** markerar med valfritt verktyg.                                                                                                                                                                                                                                                                                         |                                               |
| Sprutverktyg                        | Airbrush-liknande teckning som sprider pixlar över angränsande celler/tecken.                                                                                                                                                                                                                                                                                                                                                                                                                                    |                                               |
| Sprutintensitet                     | Listrutan bredvid sprutverktyget ställer in penseldragets täthet.                                                                                                                                                                                                                                                                                                                                                                                                                                                |                                               |
| Rutnätsväxling                      | Kryssrutnätet visar eller döljer rutnätet med 16×16 tecken.                                                                                                                                                                                                                                                                                                                                                                                                                                                      |                                               |
| Zoom                                | Zoomreglaget (2×–24×, hela enhetens pixlar per C64-pixel) eller Ctrl+hjulet över arbetsytan; zoomen sparas. Från 8× ritar rutnätet också en fin linje längs varje pixelkant.                                                                                                                                                                                                                                                                                                                                     |                                               |
| Spara teckenuppsättning `.bin`      | Sparar bitmappsdata på 2048 tecken.                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |                                               |
| Spara 16×16-karta + Färg-RAM `.bin` | Sparar 256 skärmkoder följt av 256 färg-RAM-värden. Använd detta med `MAP_COPY16X16`.                                                                                                                                                                                                                                                                                                                                                                                                                            |                                               |
| Belastning                          | Kan ladda sparade teckenuppsättningar för canvas, vanliga teckenuppsättningsdata och kompatibla teckenuppsättningsdata för teckenredigeraren, inklusive lagrade färger per tecken när de finns.                                                                                                                                                                                                                                                                                                                  |                                               |

**Viktig C64-begränsning:** i flerfärgsläge för tecken är de två delade färgerna
globala för hela skärmen (`$D022` / `$D023`). Endast tecknets egen färg visas
per cell, och den är begränsad till färgerna 0–7 eftersom Color RAM-bit 3 väljer
flerfärgsläge. Så ett tecken visar högst **4 färger** (bakgrund, MC1, MC2 och
sin egen färg), och hela skärmen högst 3 + 8. I paletten är de delade färgerna
taggade BG / 1 / 2, och färgerna 8–15 som inte delas är nedtonade. Om du väljer
en sådan färg placeras den endast i MC2 eller MC1 medan ingen pixel använder det
registret; annars ändras den i dess rullgardinsmeny (som färgar om hela
skärmen). I högupplöst (mono) läge har en karaktär två färger: bakgrunden och
sin egen färg (0–15).

### Kartredigerare (Flerskiktade kakelkartor)

Skiktad tilemap-redigerare för statiska landskap, sprite-spawnkartor,
kollisionsdata och liknande. Öppna via Toolkit → Map Editor.

| Särdrag                            | Beskrivning                                                                                                                                                                                                                                               |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lager                              | Flera namngivna lager, vart och ett med sin egen uppsättning plattor och opacitet.                                                                                                                                                                        |
| Penslar                            | Lägen för enkel sida, fyllning, linje, rektangel och cirkel. Formverktygen visar en liveförhandsvisning när du drar; släpp för att bekräfta.                                                                                                              |
| Zoom                               | Skjutreglage eller Ctrl+hjul över kartan.                                                                                                                                                                                                                 |
| Ångra / gör om                     | Fullständig ångra/gör om-stapel per lager. Ctrl/Cmd+Z / Ctrl/Cmd+Y eller verktygsfältsknapparna.                                                                                                                                                          |
| Rensa menyn                        | Rensning per lager eller hel karta med bekräftelse.                                                                                                                                                                                                       |
| Bildimport                         | Släpp en PNG av en kakelkarta; redigeraren delar automatiskt upp kakel i kakel.                                                                                                                                                                           |
| Kopiera / klistra in               | Kopiera ett markerat område i rutan och klistra sedan in det normalt eller använd transparent klistra in för att hålla tomma rutor transparenta. Samma poster finns i högerklicksmenyn på arbetsytan.                                                     |
| Flerfärgsmedveten kakelfärgning    | Med kompatibla teckenuppsättningsmetadata använder målningen kakelns lagrade standardinställningar för färg-RAM (inklusive flerfärgsrelaterad kodning) istället för en generisk platt färg.                                                               |
| Anpassade teckenuppsättningsfärger | När en teckenuppsättning innehåller `charColors`-metadata använder kartredigeraren den valda plattans standardvärde för färg-RAM vid målning.                                                                                                             |
| Exportera block                    | Sätter ut RAWBYTES-block för tileset-grafik + kartdata.                                                                                                                                                                                                   |
| Spara skärm-RAM (.bin)…            | Sparar endast skärmkoderna för det aktuella kartlagret (40×25 = 1000 byte).                                                                                                                                                                               |
| Spara skärm-RAM + färg-RAM (.bin)… | Sparar skärmkoder sammanfogade med Color RAM-värden som en enda 2000-byte-fil (`screen[0..999]` följt av `color[0..999]`). Använd detta med makrot **MAP_COPY** (kombinerat .bin-läge) för att återställa både skärm och färg i en operation vid körning. |

### Nivåredigerare

Ordnar **Kartredigerarens skärmar** i en nivå — ett vertikalt skjutspel, ett
bilspel som skrollar nedåt, en sidoskrollare eller en 2D-karta — och
förhandsgranskar hela nivån med smidig skrollning. Öppna den med
verktygsfältsknappen **Nivåredigerare** bredvid kartredigeraren.

| Särdrag           | Beskrivning                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Layout            | **Vertikal**, **Horisontell** eller **Rutnät** (rader × kolumner, med knappar för att lägga till/ta bort rader och kolumner).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Skärmar           | **Ny tom skärm**, **Lägg till från kartredigeraren** (den karta som för närvarande är öppen) eller **Ladda karta(or) (.bin)…** (flera kartredigerarexporter samtidigt). Dra en skärm från listan till en plats; dra platserna till varandra för att byta ut dem.                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Redigering        | **Redigera i kartredigeraren** öppnar den valda skärmen i kartredigeraren och återställer ändringarna; duplicera, flytta upp/vänster eller ned/höger, ta bort; ångra/gör om.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Förhandsvisning   | Dra förhandsgranskningen eller använd piltangenterna för att bläddra pixel för pixel; **Spela upp** bläddrar automatiskt (riktning, hastighet 1–8, loop), Mellanslag = spela upp / stopp. *Kantlinjer* markerar skärmens gränser.                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Zoom              | Översiktszoomreglaget (25–400 %), eller Ctrl+hjul över översikten.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Checkar           | Teckenuppsättningsinformation och en varning när skärmar använder en annan teckenuppsättning eller färger (nivån använder den första skärmens inställningar).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Karaktärsattribut | Knappen **Teckenattribut** växlar översikten till attributmålning: välj **Solid**, **Ladder**, **Hazard** eller **Collectible**, klicka på ett tecken och varje cell med den skärmkoden får (eller förlorar) det; dra för fler koder. Attributen visas som ett färgat lager och blir den 256-byte stora `LEVEL_ATTR`-tabellen (`LEVEL_ATTR_SOLID` = 1, `_LADDER` = 2, `_HAZARD` = 4, `_COLLECT` = 8).                                                                                                                                                                                                                                                                                                          |
| Kantkontroll      | Markeringar i rött där angränsande skärmar inte fortsätter: ena sidan av ramen är tom (mellanslag) och den andra inte, eller heldragen på endast ena sidan. Sidopanelen räknar kanterna och cellerna.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Färger            | **Nivåkant** och **Egna färger för den här skärmen** (bakgrund, kant, flerfärgad 1/2) för den valda skärmen; förhandsgranskningsbilden visar kanten. Exporteras per plats som `LEVEL_SCR_BG / _BORDER / _MC1 / _MC2` (med `LEVEL_SCR_COLORS` = 1) när en placerad skärm har sina egna färger.                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Minne             | Datastorleken `.level` vid en vald adress (beräknad exakt som makrot bygger den), med varningar för BASIC / KERNAL ROM, I/O-området och minnet under `$0800`, och RLE-storleken för nivån. **Exportera RLE till block / Kopiera RLE asm** ger nivån RLE packad med `level_unrle`-uppackaren (`($FB)` → `($FD)`).                                                                                                                                                                                                                                                                                                                                                                                               |
| Spring i VICE     | Bygger ett joystick-skrollat testprogram från nivån (`level-demo`-skrollaren, kod vid `$C000`, nivådata från `$2000`, anpassad teckenuppsättning vid `$2000`) och startar det i VICE — skärmfärgerna växlar med skärmen längst upp till vänster i vyn, kameran startar vid det första startobjektet.                                                                                                                                                                                                                                                                                                                                                                                                           |
| Objekt            | Knappen **Objektlagret** växlar översikten till objektredigering: välj en typ (Start, Fiende, Föremål, Dörr, Utgång, Utlösare) och en **Param** byte (fiendetyp, föremåls-ID, dörrmål...), klicka för att placera, dra för att flytta (fäst till 8 px, Shift = ledig), klicka på ett objekt för att markera det och ändra dess typ/parameter, piltangenterna flyttar det, Delete tar bort det. Objekt tillhör nivåpositionen, inte en skärm. De listas i sidofältet, visas i förhandsgranskningen, sparas med nivån och exporteras i rullningsordning (vertikalt med Y, horisontellt med X, rutnät rad för rad) som `NIVÅ_OBJ_*` tabeller — med **Kopiera asm / Exportera till block** och med makrot `.nivå`. |

**Filmeny: **
| Handling                                                      | Vad den gör                                                                                                             |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Ny nivå** / **Öppna nivå (.bin)…** / **Spara nivå (.bin)…** | Nivåprojektet: alla skärmar plus layouten. Detta är filen som makrot `.level` och Ultimate Basics `kartladdning` läser. |
| **Spara nivå Skärm-RAM (.bin)…**                              | Hela nivån som en karaktärskarta (endast skärmkoder).                                                                   |
| ** Spara nivå Skärm + Färg RAM (.bin)…**                      | Hela nivåns skärmkoder följt av dess färger.                                                                            |
| **Exportera till block** / **Kopiera asm**                    | Nivådata som block eller som asm-text (urklipp).                                                                        |

**Med hjälp av nivån:** i assemblern, `.level "level.bin"` + `.level_row` (se
[LEVEL / LEVEL_ROW](#level--level_row) och `samples/level-demo.asm`); i Ultimate
Basic 1.6.1+, `map load "level.bin", $4000` och `map view px, py` (exempel
`level_scroll_demo.ub`).

### SID-redigerare (3-röstsspårare)

Multiinstrument 3-rösters tracker. Öppna via Toolkit → SID Editor. **Spela:
All** kör den exporterade 6502-spelaren i WebSid-emulatorn; alla andra
förhandsvisningar (instrumentförhandsvisning, virtuellt tangentbord,
notinmatning, ackord/arpeggio, rad- och enkelmönsteruppspelning) spelas också
upp på det emulerade SID:et: en JS-modell av samma spelare (bildruta för
bildruta) streamar sina SID-register till WebSid varje bildruta, och upp till
tre förhandsvisningsnoter delar de tre rösterna. Streamspelaren laddas när
editorn öppnas och igen efter Stopp, så noterna ljuder samtidigt; utan WebSid
spelas en liten SID-synthesizer istället.

**Förhandsgranskningsmotor:** **Inställningar → SID-förhandsgranskning** väljer
**WebSID** eller **VA SID Core (Rust)**, appens egen SID-emulering; med VA SID
Core väljer du även chipet (MOS 6581 / 8580). Redigerarens rubrik visar vilken
motor som används (t.ex. *· VA SID Core v1.2 (MOS 8580)*).
Instrumentparametrarna ställs in med rattar.

**Kontroller per instrument: **
- Kryssrutor för vågformer (TRI / SAW / PUL / NOI) — flera vågformer
  AND-behandlas som på SID — plus **RING** (ringmodulering av triangeln av
  föregående röst: 1 ← 3, 2 ← 1, 3 ← 2) och **SYNC** (hård synkronisering till
  föregående röst).
- ADSR (attack / decay / sustain / release) visas som en draggraf ovanför de
  fyra reglagen.
- Pulsbreddsreglage (0-4095).
- **Filter:** *Routera den här rösten genom filtret*, LP / BP / HP och **3 OFF**
  (dämpa röst 3 när den inte är routad), cutoff, resonans, volym. **End** +
  **Sweep** flyttar cutoff från Cut mot End per Sweep per bildruta;
  **Ping-pong** studsar mellan de två — det är detta som skapar resonanta
  filtersvep. Rösten som startar ett filterroutat instrument äger filtret
  (cutoff, resonans, läge); varje röst vars instrument är routad går igenom det.
- **Vibrato:** efter **Delay** ramar in en triangel-LFO som vrider varje
  **Speed** ram, **Depth** 0-15 skalad till notens halvton (oberoende av
  `V`-effekten).
- **Pulsbreddsmodulering: ** **Hastighet** läggs till pulsbredden varje
  bildruta, och studsar mellan **Min** och **Max**.
- **Gate:** **Gate-timern** släpper gaten så många bildrutor före nästa ton på
  rösten (håll den under Speed); **Hård omstart** nollställer även ADSR då, för
  en ren attack; **Första bildrutan** skriver en vågform på tonens första
  bildruta (t.ex. `$09` test + gate).
- **Våg-/arpeggiotabell:** upp till 32 steg av vågform (— = behåll) och not
  (offset i halvtoner, eller **abs** = absolut not), ett steg varje
  **Hastighet** bildruta, **Loop** tillbaka till ett steg eller stopp på det
  sista. **Förinställningar** (25, i grupper; listan behåller den valda
  förinställningen tills tabellen redigeras manuellt): arpeggion (dur, moll, 7:e
  ackord, sus4, förminskat, förstärkt, powerackord, oktav, drill), trummor (bas,
  virveltrumma, puka, klapp, stängd/öppen hi-hat), lead- och basattacker och
  ljudeffekter (laser, pickup, explosion).

**Spårningsrutnät:**
- 3 röster × upp till 256 mönster × 32 rader; sång-/ordningslistan rymmer upp
  till 255 steg.
- Per rad: not + instrumentindex, plus en valfri effekt (se **Effektkolumnen**
  nedan). Tomma rader innehåller föregående not: precis som i andra trackers
  (GoatTracker, SID-Wizard) behåller en not sin gate på (sustainnivå) tills
  nästa not på det ljudet eller en **not-off**.
- **Enter** (eller ett dubbelklick) redigerar den markerade cellen som text
  (`C-4 01 V24`); **Enter** sparar och flyttar till nästa rad, **Esc** avbryter.
- **Note-off** (`===`): tangent **1** (eller `` ` `` / `=`), eller skriv `===` /
  `OFF` i en cell. Det frigör grinden, så instrumentets frigöring sker — på
  samma sätt som `C`-effekten utan en not (sparad och exporterad som `C00`).
- Markera en cell normalt, eller håll ner Shift** medan du klickar eller
  använder piltangenterna för att utöka en rektangulär markering över rader och
  någon av de tre rösterna. Om du högerklickar inuti det markerade området
  behålls området intakt.
- Kopiera, Klipp ut, Klistra in och Rensa är tillgängliga från
  ikonverktygsfältet och den ikonbaserade snabbmenyn. `Ctrl/Cmd+C` och
  `Ctrl/Cmd+V` fungerar på samma rektangulära markering.
- Harmonihjälp: välj en grundton, ackordtyp och oktav, förhandsgranska ackordet
  med det aktuella instrumentet och infoga sedan instämmandet direkt i spåraren.
  Tillgängliga typer inkluderar dur, moll, förminskad, förstärkt, sus2, sus4,
  dominant 7, dur 7, moll 7, 6, moll 6, 9, b9, #9, dim7 och 7sus4.
- Arpeggio-hjälp: förhandsgranska eller infoga 4-, 8- eller 16-stegsnoter som
  löper från det valda ackordet i uppåt-, nedåt- eller uppåt/nedåt-riktning.
- **Förhandsgranskningsrad** provspelar den valda raden över alla tre ljud utan
  att starta mönsteruppspelning.
- Inklistring av cellintervall börjar nu vid den valda intervallets startcell
  och stoppar tydligt vid röst- och radgränser istället för att radbrytas till
  nästa kolumn eller rad.
- **Speed** (bildrutor mellan rader, 1–255) matas in eller stegas med − / +
  knapparna bredvid; `F` effekten ändrar den under uppspelning.

**Låt / beställningslista:**
- Mönster är ordnade genom en låt-/ordningslista som placeras ovanpå den råa
  mönsterbanken — samma mönster kan upprepas, och låten kan vara längre än
  antalet lagrade mönster.
- Lägg till, ta bort och ändra ordning på steg från låtlistpanelen; det aktuella
  steget markeras under uppspelning.
- Både uppspelningen i appen och varje export går igenom den här listan, inte
  den råa mönsterordningen – exporter gjorda innan ordningslistan fanns laddas
  fortfarande korrekt som en vanlig 0..N-1-låt.

**Effektkolumn:** Varje cell kan innehålla en effekt utöver sin not och sitt
instrument, angiven som en kort kod direkt efter noten (t.ex. `C-4 01 V24`)
eller separat för en notlös effektrad (t.ex. `F06`):

| Koda | Effekt                 | Värde                                                       |
| ---- | ---------------------- | ----------------------------------------------------------- |
| `V`  | Vibrato                | låg nibble = djup, hög nibble = hålllängd                   |
| `U`  | Glida upp (portamento) | mängd som läggs till frekvensen varje rad                   |
| `D`  | Glida ner (portamento) | belopp subtraherat från frekvensen varje rad                |
| `C`  | Notklipp               | tystar rösten utan att återaktivera den; värde outnyttjas   |
| `F`  | Hastighetsändring      | nytt värde för bildrutor per rad, träder i kraft omedelbart |

Effekter uppdateras en gång per rad (matchar den exporterade spelarens timing),
körs identiskt i Web Audio-förhandsvisningen och den kompilerade 6502-exporten,
och sparas/läses förlustfritt i det versionerade `.bin`-formatet.

**Uppspelning och virtuellt tangentbord: **
- Knappen Spela upp i verktygsfältet ändras till Paus under uppspelning och till
  Återuppta under paus; Stopp avslutar uppspelningen och återställer läget.
- **LCD** längst ner i spårningsverktygsfältet visar låtposition (POS), mönster
  (PAT), rad (ROW) och speltid (TIME) under uppspelning, samt
  redigeringspositionen när uppspelningen är stoppad. **Inställningar →
  SID-förhandsvisning → LCD-färg** gör den grön eller röd.
- Knappen i verktygsfältet på tangentbordet öppnar **VA-VK**, ett icke-modalt
  piano (2, 3 eller 4 oktaver; position, öppet tillstånd, oktav och *Insert into
  tracker* kommer ihåg) med egna **Play / Stop**-knappar som förblir användbara
  medan SID-redigeraren är aktiv. Dra dess rubrik för att placera den var som
  helst över huvudapplikationen.
- Med **Instrument**-ratten på VA-VK (dra, mushjul eller piltangenter) väljer du
  instrumentet, vilket visas med dess nummer och namn på LCD-skärmen bredvid;
  det följer instrumentlistan i editorn. Märket bredvid VA-VK-titeln visar
  vilken SID-emulering som används (WebSID eller VA SID Core med chipmodellen).
- Aktivera **Insert into tracker** för att skriva varje spelad not vid den
  aktuella tracker-markören och gå vidare till nästa rad. Inaktivera den för att
  lyssna på noter utan att redigera.
- Förhandsvisningar av ackord och arpeggio lyser upp motsvarande pianotangenter
  när klaviaturen är öppet.

**Inspelning, metronom och MIDI: **
- **Record** (den röda pricken, i spårningsverktygsfältet och på VA-VK) skriver
  in noterna du spelar – på VA-VK, datorns keyboard eller ett MIDI-keyboard – i
  takt till det valda ljudet, med början på den valda raden, med aktuell
  hastighet. När mönstret är fullt läggs ett nytt tomt mönster till efter det
  aktuella låtsteget och inspelningen fortsätter där. Tryck på Record igen för
  att stoppa.
- **Metronomen** (trackerverktygsfältet och VA-VK) klickar var fjärde rad, med
  accent på det första slaget i varje 4-taktstakt. Taktslagslamporna bredvid
  blinkar vid varje slag under uppspelning och inspelning, även när klicket är
  avstängt.
- **MIDI:** välj ingången i **MIDI**-listan bredvid instrumentnamnet och tryck
  på **Anslut MIDI**; noter spelar det aktuella instrumentet (och skrivs in i
  trackern under inspelning eller med *Insert into tracker*). Lampan bredvid
  knappen blinkar vid varje inkommande MIDI-meddelande.
- **Mönsterborttagning:** knappen **−** bredvid **Pat +** raderar det aktuella
  mönstret (den frågar först om mönstret har noter). Låtstegen som använde det
  tas bort och de andra numreras om; minst ett mönster finns alltid kvar.
- **Mastervolymratten ** sitter på VA-VK.

**Export av filer-menyn:**
| Exportera                       | Vad den gör                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Spara .bin…`                   | Skriver editorns ursprungliga serialiserade format (instrument med alla moduleringsinställningar och namn, hastighet, mönster, låt). Äldre sparade filer laddas fortfarande.                                                                                                                                                                                                                                   |
| `Exportera block (endast data)` | Lägger till instrumenttabell + mönsterblock till programmet vid `* = $C000`.                                                                                                                                                                                                                                                                                                                                   |
| `Exportera block + minispelare` | Lägger till hela spelaren (sid_init / sid_irq / sid_frame / sid_play_row / sid_set_voice) plus PAL-frekvenstabeller. Efter export, placera en `JSR sid_init` i din huvudkod där musiken ska börja; med ditt eget IRQ-anrop `JSR sid_frame` en gång per bildruta istället.                                                                                                                                      |
| `Exportera asm (urklipp)`       | Kopierar hela assembly-källkoden till urklipp.                                                                                                                                                                                                                                                                                                                                                                 |
| `Importera GoatTracker .sng…`   | Laddar en GoatTracker 2-låt istället för den nuvarande — se **GoatTracker-import** nedan.                                                                                                                                                                                                                                                                                                                      |
| `Importera .sid…`               | Konverterar en PSID/RSID-låt till en redigerbar låt istället för den aktuella — se **.sid import** nedan.                                                                                                                                                                                                                                                                                                      |
| `Exportera till UltimateBasic`  | Skriver ett `melodi ... slut`-block (instrument, ordningslista, mönsterrader som text) plus `musikuppspelning` och infogar det vid markören i Ultimate Basic-editorn; utanför UB-läge kopieras texten till urklipp. UltimateBasic-kompilatorn bygger spelaren, så `musikuppspelning` / `musikstopp` styr den. Instrumentmodulering går in i `imod` / `ifilt` / `igate` / `itab`-rader (Ultimate Basic 1.6.2+). |

**GoatTracker import:** **Filer → Importera GoatTracker .sng…** laddar en
GoatTracker 2-låt (`.sng`, GTS3–GTS5) istället för den nuvarande. Konverteringen
är ungefärlig, eftersom de två spårarna fungerar olika:
- Ordningslistorna per röst (med transponering och upprepning) är utplattade
  till en 3-stämmig sång och uppdelade i 32-radiga mönster; identiska mönster
  delas.
- Instrument: AD/SR, första vågen, gatetimer och hård omstart tas över;
  vågtabellen blir våg-/arpeggiotabellen, pulstabellen PWM, filtertabellen blir
  filterläge, resonans- och cutoff-svep, och hastighetstabellen blir
  instrumentets vibrato.
- Mönsterkommandon: key off → note-off, portamento → `U` / `D` (högst 255 per
  rad), tempo → `F`; toneporta blir en vanlig ton. Andra kommandon tas bort och
  ett meddelande listar vad som approximerades eller hoppades över.
- En grind som släpps av wavetablen blir en tonstart på nästa fria rad. Endast
  den första submelodin importeras.

**.sid import:** **Filer → Importera .sid…** öppnar en PSID/RSID-fil (endast
skrivbordsapp, den använder VA SID Core). Välj undermelodi och längd i sekunder
och tryck på **Importera**: melodin körs ljudlöst, dess SID-register spelas in
bildruta för bildruta och omvandlas till en låt istället för den aktuella. En
förloppsindikator följer inspelningen och sedan *Konverterar…* konverteringen.
- **Anmärkningar:** en ton på är en grindkant (en retrigger inom 2 bildrutor
  räknas som en ton); en tonhöjdsförändring under en hållen grind som stannar i
  minst 5 bildrutor blir en ny, retriggerad (legato) ton. Tonhöjden är den
  vanligaste halvtonen i tonens huvudvågform; NTSC-melodier stämms om till
  PAL-tontabellen.
- **Rader:** Raderna börjar exakt på noterna. Baslängden är den längsta som
  passar nästan alla; rader av den längden eller en bildruta längre (funktempo,
  swing, tempoväxlingar) sätts med `F`-effekterna en rad framåt.
- **Instrument:** AD / SR, huvudvågformen, pulsbredd och PWM, filtret (routing,
  mode, resonans, cutoff-svep) och vågformen och tonhöjden för varje bildruta i
  noten, upp till nästa: våg-/arpeggio-tabellen (ett prefix plus en upprepande
  loop, upp till 32 steg). En trumattack med fast tonhöjd behåller absoluta
  toner och en arpeggio relativa, bestämda över alla toner av samma ljud; en
  regelbunden wobble på en halvton blir instrumentets vibrato. Gaten blir ett
  notavbrott, en gate-timer (med hård omstart när ADSR nollställs) eller en
  avklingning vid utlösningshastigheten. Identiska instrument delas, upp till
  128.
- Ett meddelande listar vad som approximerades, till exempel bilder som blir
  halvtonssteg eller tabeller längre än 32 steg. Multi-SID-låtar och RSID-låtar
  som börjar som ett BASIC-program stöds inte.

**Användning av spelarens ZP:** `$02`–`$1C` (mönsterpekare, mönsterförskjutning,
temp) och `$2F` (nuvarande hastighet), plus `$FB`–`$FD` (tickräknare, radindex,
position i orderlistan). Röst, modulering och filtertillstånd finns i
`sid_state` efter spelarkoden. ZP-bytena kolliderar om din huvudkod använder dem
— flytta via expertläge om det behövs.

**Kända gränser:**
- Spelaren och dess tillstånd sitter vid `$C000`. När melodidata inte får plats
  nedanför `$D000` bredvid dem, flyttas data till ett eget segment som slutar
  nedanför `$A000` (den exporterade asm har en andra `* =`-rad); håll den borta
  från ditt eget program.
- C64 `$D418` global volym delas mellan röster — volymreglaget per instrument är
  informativt; sustainnivån (`S` för ADSR) är den effektiva volymen per röst.
- Medan **Play: All** har den riktiga melodin laddad (även när den är pausad),
  återgår tonförhandsvisningar till den lilla synthesizern, som bara
  approximerar SID-chippet. Förhandsvisningar når WebSid cirka 0,1 s före
  ljudet.

---

**Exportera .sid (PSID)…** (Fil-menyn) sparar låten med den spelbara
`$C000`-spelaren som en standard PSID-fil — den spelas upp i SID-spelaren, i
VICE:s `vsid` och i vilken annan SID-spelare som helst.

### SID-spelare

Verktygsfältsknappen **SID Player** öppnar ett flytande fönster som spelar upp
`.sid`-musikfiler (PSID och RSID), till exempel låtar från HVSC-samlingen.

- **Spellista:** lägg till låtar med **Lägg till .sid-filer…** eller genom att
  släppa dem i fönstret och klicka på en låt för att spela den; **Ta bort** och
  **Rensa spellista** rensa listan. **Spara spellista…** / **Öppna spellista…**
  skriv och läs en `.sidpl`-fil med låtarna inbäddade. Listan, den aktuella
  låten och om fönstret är öppet sparas.
- **Transport:** Spela upp, Pausa, Stopp, **Föregående** / **Nästa** melodi,
  **Föregående / Nästa undermelodi** för filer med flera låtar och en
  tidsräknare.
- **Sök:** Positionsfältet och **Bakåt/Framåt 10 s** fungerar med VA SID
  Core-motorn. WebSID kan inte söka, så dessa kontroller är inaktiverade med
  den.
- **Volym:** Ratten delas med SID-redigerarens huvudvolym.
- **Buffert:** **Inställningar → Allmänt → SID-förhandsvisning → SID
  Player-buffert** (2048, 4096, 8192 eller 16384 samplingar). En större buffert
  stoppar knastrandet när appen är upptagen. WebSID använder den nya storleken
  efter en omstart; VA SID Core renderar 10 / 15 / 20 / 30 s framåt från nästa
  låt och framåt.
- **Motor:** Fönstret visar vilken motor som spelar (WebSID, eller VA SID Core
  med dess version och SID-chip); välj det i ** Inställningar →
  SID-förhandsgranskning**. VA SID Core kör melodin på en inbyggd Rust C64-kärna
  med en cykelexakt 6510, exakt avbrottstiming, CIA 6526A, VIC-II-timing med
  dåliga linjer, sprite DMA och rasteravbrott, och 6510 I/O-porten — så
  raster-IRQ, CIA-tidsinställda och digitala melodier spelas med timingen hos en
  riktig maskin.
- **Slumpvis:** slumpmässig ordningsknappen bredvid **Nästa** spelar upp
  spellistan i slumpmässig ordning — ingen låt upprepas förrän varje låt har
  spelats, och **Föregående** går tillbaka i den slumpmässiga ordningen.
  Inställningen sparas.
- **Favoriter:** ☆ / ★ i varje rad markerar en låt; den sparas i sparat
  tillstånd och i `.sidpl` spellistor.

#### HVSC (Högspännings-SID-samling)

Knappen **HVSC** i SID Player-verktygsfältet öppnar en sökpanel för [High
Voltage SID Collection](https://www.hvsc.c64.org/), cirka 61 000 C64-låtar.

- **Sök:** skriv en titel, kompositör eller mapp (`hubbard commando`,
  `games/s-z`); varje ord måste matcha. **Slumpmässiga låtar** listar 25
  slumpmässiga låtar.
- **Spela / lägg till / spara:** klicka på en låt för att spela den, **+**
  lägger till den i spellistan, nedladdningsknappen sparar `.sid`-filen. **Lägg
  till alla resultat** lägger till upp till 100 funna låtar.
- **Låtlängder:** HVSC känner till längden på varje undermelodi, så sökfältet
  visar den och spellistan går vidare när undermelodin slutar.
- **Varifrån låtarna kommer:** Katalogen och enskilda låtar laddas ner från en
  HVSC-spegel vid första användningen och sparas i appens cache, så en låt som
  spelas en gång spelas också offline. **Uppdatera katalogen** hämtar den
  senaste listan.
- **Hela samlingen:** **Ladda ner hela samlingen…** laddar ner det officiella
  HVSC-arkivet (cirka 85 MB) till en mapp du väljer och packar upp det där
  (cirka 380 MB); från och med då använder spelaren den kopian och fungerar
  offline. **Använd en lokal HVSC-mapp…** pekar den mot en samling du redan har.

#### Spektrumanalysator

Knappen med stapeln i SID Player-verktygsfältet öppnar fönstret **Spectrum**:
LED-liknande staplar från grönt via gult till orange, celler som tonas ut
långsamt och ett speglat golv i perspektiv. Det visar vad SID Player eller SID
Editor spelar, med endera motorn. **Bands** ställer in 8, 16, 24 eller 32 band.
Fönstret kan flyttas och ändras i storlek, det stängs och öppnas igen
tillsammans med SID Player, och det ritar bara när det är öppet.

---

### Kurvredigerare

Genererar färdiga `.byte`-uppslagstabeller från matematiska kurvor — sinus,
övergångar, triangel/sågtand/kvadrat och studs. Idealisk för sprite-rörelser,
rastereffekter, färgcykler eller vilken animation som helst som drivs av en
förberäknad tabell. Öppna via ikonen **Kurvredigerare** i det övre
verktygsfältet (bredvid SID-redigerarknappen).

**Kurvor:** Sinus, cosinus, linjär, justering in/ut/in ut (kvadrat och kubiskt),
justering in/ut (cirkulärt), triangel, sågtand, kvadrat och justering in/ut/in
ut studs.

**Kontroller: **
| Kontrollera                | Ändamål                                                                                                                                                                                                 |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Start-/slutvärde**       | Utgångsområde. 0..255 i 8-bitarsläge, 0..320 i 16-bitarsläge.                                                                                                                                           |
| **Antal värden**           | Tabelllängd, 4–512 poster.                                                                                                                                                                              |
| **Cykler**                 | Hur många svängningar över tabellen (sinus/cosinus/triangel/sågtand/kvadratisk). Accepterar bråk (t.ex. `3,625`).                                                                                       |
| **Fas**                    | Fasförskjutning i grader (endast sinus/cosinus).                                                                                                                                                        |
| **Kombinera andra kurvan** | Blanda en andra kurva med **Blanda / Lägga till / Multiplicera / Min / Max / Subtrahera **, dess egna cykler/fas och en blandningsmängd. Båda källkurvorna är ritade som streckade stödlinjer i grafen. |
| **Etikett**                | Tabelletikett (föreslagen automatiskt från kurvnamnet).                                                                                                                                                 |
| **Nummerformat**           | `$XX` hex eller decimal.                                                                                                                                                                                |
| **Värden per rad**         | 8 / 16 / 32 byte per `.byte`-rad.                                                                                                                                                                       |

**Utmatningslägen: **
| Läge          | Sänder ut                                                                                                                                                                                                                                                                                                                                                                                     |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **8-bitars**  | En enda `.byte`-tabell (värden 0..255). Läses med `LDX #index / LDA-tabell,X`. Genererar valfritt en **sprite-Y-läsarrutin** (`<etikett>_set_y`) — `LDA <etikett>,X` / `STA $D001+2N` — för ett valbart spritenummer 0-7.                                                                                                                                                                     |
| **16-bitars** | Två parallella byte-tabeller — `<label>_lo` (låga 8 bitar) och `<label>_hi` (9:e bit, 0/1) — indexerade av **samma** X (2 byte per post). Behövs för sprite X över helskärmen (0..320 > en byte). Valfritt genererar en **sprite-X-läsarrutin** (`<label>_set_x`) som skriver den låga byten till `$D000+2N` och ställer in/rensar spritens MSB i `$D010`, för ett valbart sprite-nummer 0-7. |

Varje kopierings-/infogningsutdata börjar med en rubrikkommentar som
dokumenterar kurvan, det faktiska min/max-intervallet, antalet poster och den
exakta användningen (vilket registrerar varje tabellmatning).

**Förhandsvisning:**
- **Graf** — kurvan ritad med värde 0 vid **toppen** och max vid **botten**,
  vilket matchar C64 sprite-Y / rasterkonventionen (så det du ser är vad
  tabellen driver på hårdvaran). En metalinje under grafen visar byteantalet,
  det faktiska Min/Max för de genererade värdena och kurvnamnet/namnen.
- **Studsande boll** — animerar en markör genom bordet i **Tempo** (5–240
  värden/sek). Vid tempo 50 motsvarar detta ett värde per bildruta på PAL (50
  Hz), dvs. ett `.wait_raster`-steg per index. Knappar för uppspelning/paus och
  omstart, ett uttonat spår av de senaste ~24 positionerna och en live-avläsning
  av `Index · Värde`.

**Kopiera / Infoga:** verktygsfältets två ikoner — **Kopiera** placerar tabellen
på urklipp; **Infoga i redigerare** lägger till tabellen (och läsaren, om
aktiverad) som block i det aktuella programmet. Om du infogar **ersätts** den
tidigare kurvredigerarinfogningen istället för att stapla dubbletter (fungerar i
block- och expertläge).

**Filmeny: **
| Handling                          | Vad den gör                                                                                                                                                                                                                                                                                                                                                                 |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Spara kurva (.bin)…**           | Sparar de råa tabellbytena exakt som C64 skulle läsa dem via `INCBIN`. 16-bitars: N låga byte följt av N höga byte.                                                                                                                                                                                                                                                         |
| **Lastkurva (.bin)…**             | Läser in råa tabellbyte tillbaka till editorn, tolkade enligt det aktuella bitdjupet (16-bitars: första halvan låg, andra halvan hög). Den inlästa tabellen visas som den är tills någon kurvkontroll genererar en ny kurva.                                                                                                                                                |
| **Exportera demo till block **    | Lägger till en komplett, körbar sprite-demo: sprite-init, rastersynkroniserad huvudloop, den inbäddade tabellen och boll-sprite-data. X sveper 0..320 i 8.8 fixpunkt med `$D010` MSB medan tabellen driver sprite Y — vilket exakt matchar editorns förhandsgranskning. Återexport ersätter den tidigare Curve Editor-insättningen.                                         |
| **Exportera till UltimateBasic**  | Skriver tabellen som en initialiserad Ultimate Basic-array — `var name = array(N)` (eller `array_word(N)` för 16-bitars) följt av `data name: …` rader — och infogar den vid UB-redigerarens markör (utanför UB-läge kopieras den till urklipp). Etiketten blir ett giltigt UB-namn med gemener; indexera tabellen som `name[i]`. Kräver Ultimate Basic 1.5.8+ (medföljer). |
| **Exportera UltimateBasic-demo ** | Producerar ett komplett, körklart UB-program: en bollsprite (`sprdef 0`), tabellen och en rastersynkroniserad loop som spelar upp en tabellpost per bildruta. 8-bitarstabeller driver spriten **Y** medan X sveper 0..320; 16-bitarstabeller (0..320) driver spriten **X** medan Y sveper 0..200. Tabeller längre än 256 poster spelar upp sina första 256.                 |

**Matcha förhandsgranskningen på C64:** förhandsgranskningen läser tabellen
**linjärt, loopande 0 → N-1 → 0, ett värde per bildruta**. För att reproducera
det exakt, kör tabellen på samma sätt (öka indexet en gång per bildruta, radbryt
vid tabellens längd). En pingis- eller partiell uppspelning kommer att röra sig
olika även om bytevärdena är identiska. Se `samples/curve-new-demo.asm` för ett
fungerande 16-bitars sprite-X-exempel.

---

### Tabellgenerator

Verktygsfältsknappen **Tabellgenerator** (rutnätsikon, bredvid kurvredigeraren)
bygger uppslagstabeller och hastighetskod. Välj en tabelltyp, ställ in dess
parametrar och titta på förhandsgranskningen; metalinjen visar antalet poster,
storlek och värdeintervall (för kod: byte och uppskattade cykler/rasterlinjer).

| Typ                                              | Värden                                                                                                                              |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| Skärmradadresser                                 | bas + 40 · rad (valfri bas och radlängd)                                                                                            |
| Bitmappsradadresser                              | pixel Y → byteadress i kolumn 0 (8 × 8 celllayout)                                                                                  |
| Bitmappskolumnförskjutningar                     | pixel X → byteförskjutning inom linjen (hyres eller flerfärgad)                                                                     |
| Pixelbitmask                                     | X → bitmask (anställer / flerfärgad, valfritt inverterad för `OCH`)                                                                 |
| Multiplicera / dividera / resten med en konstant | x · k, ⌊x / k⌋, x mod k                                                                                                             |
| Kvartkvadrater                                   | ⌊(x − offset)² / 4⌋, 512 poster — a · b = sqr(a + b) − sqr(a − b)                                                                   |
| Ömsesidig                                        | ⌊N / x⌋                                                                                                                             |
| Logaritm / exponential                           | rund(log2 x · s), rund(2^(x / s))                                                                                                   |
| Bit bakåt                                        | vänder en byte (eller bitpar i flerfärg) för att spegla sprites och tecken                                                          |
| Anpassat uttryck                                 | valfri formel för `i` (`k` = 0-baserat index, `n` = antal); `sin`, `cos`, `abs`, `min`, `max`, `rund`, `golv`, `PI`, `$hex`, `%bin` |
| Hastighetskod: fyll i / kopiera minne            | en subrutin; *lagrar per iteration* 0 = helt utrullad, N = en X loop med N lager per pass                                           |

Värden över 255 blir ett **lo / hi-tabellpar** (`label_lo`, `label_hi`) eller en
`.word`-tabell; negativa värden är tvåkomplement. Alternativ: label, hex /
decimal, värden per rad, **Align to page** (`.align 256`, undviker
sidöverlappningscykeln). **Copy** placerar sammansättningen på urklipp;
**Insert** lägger till den i programmet (om samma etikett infogas igen ersätts
den föregående kopian) — i Ultimate Basic-läge infogas en `array` med
`data`-rader. Filmenyn sparar också tabellen som `.bin` (lå byte, sedan höga
byte) och exporterar den till Ultimate Basic.

### Nummerkonverterare

En liten **icke-modal** DEC / HEX / BIN-konverterare, öppnad med
verktygsfältsknappen bredvid D64-redigeraren (klicka igen eller tryck på Esc för
att stänga). Knappen förblir markerad medan konverteraren visas. Den förblir
öppen medan du fortsätter att redigera programmet i valfritt läge.

- Skriv in i något av fälten **DEC**, **HEX** eller **BIN** så följer de andra
  två. Prefixen `$`, `0x`, `%`, `0b` och avgränsare (mellanslag, `_`)
  accepteras; ett negativt decimaltal blir tvåkomplement i den aktuella bredden;
  ogiltig inmatning markeras med rött.
- **8 / 16 bitars** bredd — ett värde över 255 växlar automatiskt till 16 bitar.
- **Bitsrad** — klicka på en bit för att växla mellan den.
- Inforaden visar värdet **signed** och, i 16-bitarsläge, bytevärdet **low** och
  **high**.
- **Kopiera**-knapparna kopierar värdet med dess prefix (`53280`, `$D020`,
  `%1101000000100000`).
- Dra den i rubriken; den kommer ihåg dess värde, bredd och position och öppnas
  igen efter en omstart om den var öppen när du avslutade.

---


*© 2026 Zsolt Tarczali — C64 Visual Assembler*
