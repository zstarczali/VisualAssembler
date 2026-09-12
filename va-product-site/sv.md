# C64 Visuell Assembler — Användarmanual

**Version 2.4.0**

En visuell, blockbaserad 6502-assembler för Commodore 64. Bygg program genom att dra och släppa instruktionsblock och se den genererade assemblern och maskinkoden i realtid.

---

## Innehållsförteckning

- [C64 Visual Assembler — Användarmanual](#c64-visual-assembler--user-manual)
    - [Höjdpunkter i version 2.4.0](#version-240-highlights)
    - [Höjdpunkter i version 2.3.9](#version-239-highlights)
    - [Höjdpunkter i version 2.3.8](#version-238-highlights)
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
  - [5. Inställningar \&amp; Verktygsfält](#5-settings--toolbar)
    - [Ladda .asm-fil (snabbreferens)](#load-asm-file-quick-reference)
      - [Importera parsningsanteckningar och bästa praxis](#import-parsing-notes-and-best-practices)
  - [UltimateBasic-läge](#ultimatebasic-mode)
    - [Öppnar UB-redigeraren](#opening-the-ub-editor)
    - [Redigeringsverktyg](#editor-tools)
    - [Projekt, flikar och startfiler](#projects-tabs-and-startup-files)
    - [Byggnad och diagnostik](#building-and-diagnostics)
    - [Löpning, D64 och Exomizer](#running-d64-and-exomizer)
    - [Felsökningssymboler och demontering](#debugger-symbols-and-disassembly)
    - [Ultimate Basic-manual och källa](#ultimate-basic-manual-and-source)
  - [6. Expertläge](#6-expert-mode)
    - [Växla lägen](#switching-modes)
    - [Redigerarens layout](#editor-layout)
    - [Verktygsfältsknappar](#toolbar-buttons)
    - [Fel vid markering](#error-highlighting)
    - [Syntaxmarkering](#syntax-highlight)
    - [Källformatering](#source-formatter)
    - [Projektpanel \&amp; flikar](#project-panel--tabs)
    - [Flikfält](#tab-bar)
  - [7. Adresseringslägen](#7-addressing-modes)
    - [Märk uttryck som operander](#label-expressions-as-operands)
    - [Programräknaren `*` i uttryck](#the--program-counter-in-expressions)
    - [Lokala (prickade) etiketter](#local-dotted-labels)
    - [Operandetiketter för självmodifierande kod](#self-modifying-code-operand-labels)
  - [8. Standard 6502-instruktioner](#8-standard-6502-instructions)
    - [Dataförflyttning](#data-movement)
    - [Aritmetik](#arithmetic)
    - [Logik](#logic)
    - [Hopp \&amp; grenar](#jumps--branches)
    - [LBNE / LBEQ / … (Långa grenar)](#lbne--lbeq---long-branches)
    - [Registrera operationer](#register-operations)
    - [Skift \&amp; Rotera](#shift--rotate)
    - [Stack](#stack)
    - [System / Flaggor](#system--flags)
    - [Olagliga/Odokumenterade instruktioner](#illegal--undocumented-instructions)
  - [9. Makroblock — Referens](#9-macro-blocks--reference)
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
    - [SLUT / RTS-alias](#end--rts-alias)
    - [MACRO / ENDM / INVOKE](#macro--endm--invoke)
      - [MAKRO (definitionsstart)](#macro-definition-start)
      - [ENDM (definitionsslut)](#endm-definition-end)
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
    - [Körtid IF / ELSE / ENDIF](#runtime-if--else--endif)
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
  - [10. Integrering av felsökare](#10-debugger-integration)
    - [RetroDebugger](#retrodebugger)
    - [Brytpunktsblock](#breakpoint-blocks)
    - [Felsökningsflaggor (fliken Alternativ)](#debugger-flags-options-tab)
  - [11. Länkar till kunskapsbasen](#11-knowledge-base-links)
  - [12. D64 Exportera \&amp; Kör](#12-d64-export--run)
    - [Knapp för delad körning](#split-run-button)
    - [Dialogruta för export till D64](#export-to-d64-dialog)
    - [D64-metadata i projekt](#d64-metadata-in-projects)
  - [12b. CRT-export (Magic Desk 64K-kassett)](#12b-crt-export-magic-desk-64k-cartridge)
  - [13. Maskinvaruinställningar](#13-hardware-settings)
    - [VICE-emulator](#vice-emulator)
    - [Exomizer](#exomizer)
    - [Retro-felsökare](#retro-debugger)
    - [C64 Ultimate / 1541 Ultimate](#c64-ultimate--1541-ultimate)
  - [14. Visuella redigerare (verktygslåda)](#14-visual-editors-toolkit)
    - [Högupplöst/Flerfärgsredigerare](#hi-res--multicolor-editor)
    - [Sprite-redigerare](#sprite-editor)
    - [C64 Tecken-ROM-läsare ("Teckenkarta")](#c64-character-rom-browser-char-map)
    - [Teckenredigerare (teckenuppsättning)](#character-editor-charset)
    - [Teckenuppsättning Canvas-redigerare](#charset-canvas-editor)
    - [Kartredigerare (Flerskiktade kakelkartor)](#map-editor-multilayer-tilemaps)
    - [SID-redigerare (3-röstsspårare)](#sid-editor-3-voice-tracker)
    - [Kurvredigerare](#curve-editor)

---

## Höjdpunkter i version 2.4.0

- **D64 Editor** — en komplett diskavbildningsläsare i verktygsfältet (efter kurvredigeraren). Öppna en befintlig `.d64`, skapa en ny tom disk eller starta den aktuella disken direkt i VICE, allt från en Filer ▾-meny som matchar de andra visuella redigerarna. Se [D64 Editor (bläddra bland och redigera en befintlig diskavbildning)](#d64-editor-browse--edit-an-existing-disk-image).
- **Lägg till / extrahera / byt namn på / ta bort i D64-editorn** — lägg till en lokal fil i diskkatalogen, extrahera en vald post tillbaka till en `.prg`, byt namn på en post inline i tabellen eller ta bort den — varje åtgärd tillämpas direkt på `.d64`-filen via `c1541`, utan separat sparningssteg.
- **Ladda adress, dekomprimera adress och Exomizer i D64-redigeraren** — genom att lägga till en headerlös råfil kan du ange en valfri laddningsadress, ett Exomizer-dekomprimeringsmål och komprimera den på vägen in, med samma `mem`/`sfx` komprimeringslägen som i dialogrutan Exportera till D64:s extrafiler. En `.prg` som redan har sin egen header hoppar över dessa fält helt.
- **Väljare för diskposttyp** — välj PRG / SEQ / USR / REL för en nyligen tillagd fil istället för att alltid skriva den som PRG.
- **Autentisk kataloglista** — D64-redigerarens fillista visas i det medföljande C64 Pro-typsnittet, med versaler, för det klassiska `LOAD"$",8`-utseendet.
- **Åtgärdat: ** Att byta namn på en post i D64-redigeraren ignorerar inte längre redigeringen när du klickar i textfältet.
- **Förbättrat:** Det ljusa temats lägesindikator i verktygsfältet (BLOCKLÄGE / EXPERTLÄGE / …) är mörkare och mer läsbart, och dess skimrande animation syns igen.

---

## Höjdpunkter i version 2.3.9

Fem assemblerfunktioner som förbättrar livskvaliteten, alla användbara i expertläge och (där det är lämpligt) som block. Var och en har sin egen referenssektion längre ner:

- **`*` i vilket uttryck som helst** — programräknarsymbolen fungerar nu inuti operanduttryck, inte bara på egen hand: `BNE *-5`, `JMP *+20`, `LDA #&lt;*`, `LDA #&gt;(*+63)`. Ett `*` som följer ett värde (`STRIDE*2`) är fortfarande multiplikation. Se [Adresseringslägen → Programräknaren `*` i uttryck](#the--program-counter-in-expressions).
- **Lokala (prickade) etiketter** — en etikett som `.loop` tillhör omfånget för den närmaste föregående *globala* (icke-prickade) etiketten, så `DrawSprite` och `ClearScreen` kan var och en definiera sina egna `.loop` utan kollision. Se [Lokala (prickade) etiketter](#local-dotted-labels).
- **Långgreniga pseudo-operationer** — `LBNE`, `LBEQ`, `LBCC`, `LBCS`, `LBMI`, `LBPL`, `LBVC`, `LBVS` monteras till en inverterad gren över en `JMP` (alltid 5 byte) så att målet kan vara valfritt avstånd bort. Ny palettkategori för **Långa grenar**. Se [LBNE / LBEQ / … (Långa grenar)](#lbne--lbeq---long-branches).
- **`.assert` direktiv** — `.assert slut - start &lt;= 256` eller `.assert * &lt; $A000, "meddelande"` utvärderas vid monteringstillfället och misslyckas med byggandet (visar det faktiska värdet) när uttrycket är falskt. Se [.ASSERT](#assert).
- **Operandetiketter för självmodifierande kod** — `LDA-värde:#$00` definierar etiketten `värde` som pekar på instruktionens operandbyte, så `STA-värde` korrigerar den direkt. Se [Operandetiketter för självmodifierande kod](#self-modifying-code-operand-labels).
- **Användligare fel vid grenar utanför intervallet** — en gren som landar utanför −128…+127 rapporterar nu exakt hur långt den överskrider intervallet och föreslår den matchande `LBxx` långa grenen.

---

## Höjdpunkter i version 2.3.8

- **Arbetsyta spara / öppna:** sparar den exakta uppsättningen öppna filbaserade flikar – inklusive den aktiva fliken och varje fliks redigeringsläge – till en `.vaws` arbetsytefil. Arbetsytor sparas automatiskt vid ändringar och appen återställer automatiskt din senaste arbetsyta vid start.
- **Global minnespanelväxling:** visa eller dölj hela C64-minnespanelen från en dedikerad UI-växling.
- **Lokaliserad Ultimate Basic-kommandoreferens: ** Kommandobeskrivningar i popup-fönstret för autokomplettering och kommandopanelen följer nu det aktuella gränssnittsspråket (ungerska, engelska, spanska, tyska, nederländska), med engelsk reserv.
- **Uppdaterade grafikdokument för Ultimate Basic:** `COLOR PEN` och hjälptexten för kommandona plot/line/rect/circle och multicolor drawing matchar nu det aktuella kompilatorbeteendet.
- **Åtgärdade KERNAL-referens:** korrigerade posterna `SETLFS` och `PLOT` (adresser och anropskonventioner) i disassemblerarens KERNAL-adresstabell.
- **Åtgärdade minnesanvändning med många öppna flikar:** Ångra-/omgörningshistoriken per flik är nu begränsad (med en liten debounce), vilket förhindrar den obegränsade minnesökning som en lång session med många öppna dokument brukade orsaka.
- **Rensning av redigeringsverktygsfältet:** tog bort de redundanta brytpunktsknapparna från verktygsfälten Expert och Ultimate Basic (brytpunkter anges fortfarande från radnummerrännan) och justerade Expertverktygsfältets höjd med Ultimate Basic-verktygsfältet.

---

## 1. Översikt över gränssnittet

Appen är uppdelad i tre huvudpaneler:

| Panel                | Beskrivning                                                                       |
| -------------------- | --------------------------------------------------------------------------------- |
| **Vänster — Palett** | Alla tillgängliga instruktions- och makroblock. Sök eller bläddra efter kategori. |
| **Center — Program** | Ditt program. Dra block hit, ändra ordningen på dem, redigera operander.          |
| **Höger — Utgång**   | Live ASM-vy och/eller minnesövervakningsutgång.                                   |

Lägesmärket längst till höger i rubriken identifierar den aktiva redigeraren **Block**, **Expert** eller **Ultimate Basic**. Den uppdateras omedelbart när redigeringsläget ändras.

---

## 2. Blockpalett

Paletten till vänster listar alla tillgängliga block grupperade efter kategori:

- **Dataförflyttning** — LDA, LDX, STA, STX, …
- **Aritmetik** — ADC, SBC, INC, DEC, CMP, …
- **Logik** — OCH, ORA, EOR, BIT
- **Hopp och grenar** — JMP, JSR, RTS, BNE, BEQ, …
- **Långa grenar** — LBNE, LBEQ, LBCC, LBCS, LBMI, LBPL, LBVC, LBVS (grena sig till valfritt avstånd; se §8)
- **Registrera operationer** — MOMS, BETALNING, INX, DEX, …
- **Skift och rotera** — ASL, LSR, ROL, ROR
- **Stack** — PHA, PHP, PLA, PLP
- **System** — CLC, SEC, NOP, BRK, …
- **Olagliga instruktioner** — LAX, SAX, DCP, …
- **Structure** — LABEL, COMMENT, REGION, ENDREGION
- **Macros** — LOOP, NEXT, FOR, ENDF, PUSH, PULL, END, TEXT, BYTE, WORD, FILL, ALIGN, ASSERT, STRING, DATA, RAWBYTES, RAWTEXT, PETSCII, CHARSET, INCBIN, SID, INCLUDE, TABLE, ORG, MACRO, ENDM, INVOKE, IF, ELSE, ENDIF, VAR, WHILE, ENDW, REPEAT, UNTIL, MEMCPY, MEMSET, PRINT, PRINT_CHAR, PRINT_HEX, CLEAR_SCREEN, WAIT_KEY, DELAY, SET_BORDER, SET_BG, IRQ_SETUP, RAND, SPRITE_INIT, SPRITE_POS, WAIT_RASTER, JOYSTICK, MOUSE, SPRITE_COL, LOADFILE, REU_CHECK, REU_STASH, REU_FETCH, REU_SWAP, TURBO_SET, SUPERCPU_DETECT, TURBO_ENABLE, MAP_COPY, MAP_COPY16X16, SPRITE_ANIM, SCORE_BCD

Använd sökrutan **** högst upp i paletten för att filtrera efter namn. Klicka på knappen **Lägg till valt block** eller dra ett block till programområdet.

---

## 3. Programområde

- **Dra och släpp** block från paletten, eller **ordna om** befintliga block genom att dra i deras handtag (≡).
- Varje block visar dess **mnemoniska**, **operandfält** och **adresseringslägesväljare** (där så är tillämpligt).
- Klicka på växlingsknappen **▸ / ▾** för att minimera eller expandera ett block.
- Använd knappen **× (radera)** på ett block för att ta bort det.
- Knappen **Vika alla** viker alla block samtidigt.

### Minikarta för blockpanelen

Programpanelen har en växlingsbar **minimap**-knapp i rubriken. När den är aktiverad visas en smal `56 px` arbetsytremsa i panelens högra kant, där alla block visas som färgkodade horisontella streck:

| Färg på stapeln | Blocktyp                     |
| --------------- | ---------------------------- |
| Cyan            | Etiketter                    |
| Blå/lila        | Makron och direktiv          |
| Gul             | Instruktioner                |
| Grön            | Kommentarer och tomma rader  |
| Röd             | Block med ett valideringsfel |

Komprimerade block renderas med reducerad opacitet. Klicka eller dra var som helst på minikartan för att rulla programlistan till den positionen. Viewport-indikatorn (accentfärgad rektangel) spårar den synliga delen av listan. Tillståndet behålls i användargränssnittsinställningarna (`blockMinimap`-tangenten).

### Operandinmatning

- För instruktioner för förgrening/hopp (`BNE`, `JMP`, `JSR`, etc.) visas en rullgardinsmeny för **etikettväljare** — klicka på en definierad etikett för att infoga den.
- Nummerformatet följer växlingsknappen **HEX / DEC** i verktygsfältet (se avsnitt 5).

---

## 4. ASM-vy

Den högra panelen visar den genererade utdata i realtid.

### Utgångslägen

| Läge                       | Beskrivning                                                                                                                                                                                                                                                                                                 |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ASM**                    | 6502 monteringskälla med adresser och etiketter                                                                                                                                                                                                                                                             |
| **Skärm**                  | Hex-/bytedump (C64-monitorstil)                                                                                                                                                                                                                                                                             |
| **Diasm**                  | Ren 6502-disassemblering: adress · hexadecimala byte · mnemonik med upplösta numeriska operander. Makron expanderas till individuella instruktioner (TEXT → LDA/STA-par, LOOP → LDX, etc.). BYTE/WORD/FILL-data visas som chunked hexadecimaldump. Inga makronamn, kommentarer eller anteckningar i utdata. |
| **Båda**                   | ASM ovanpå, monitor nedanför                                                                                                                                                                                                                                                                                |
| **Demonteringshjälpmedel** | Samma som Disasm — dedikerad flik för demonteringsvyn                                                                                                                                                                                                                                                       |
| **Verktygslåda**           | C64 referenspanel: 16-färgspalettruta + PETSCII-kontrollkod och fusklapp för utskrivbara tecken. Skrivskyddad — se underavsnittet "Verktygslåda" nedan för mer information.                                                                                                                                 |
| **Alternativ**             | Programinställningspanel — talformat, makrokälla, felsökningsparametrar                                                                                                                                                                                                                                     |

### Verktygslåda-fliken

Fliken **Verktygslåda** i ASM-vyn är en skrivskyddad snabbreferenspanel – den ändrar aldrig ditt program. Två avsnitt:

| Avsnitt                   | Innehåll                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **C64 färgpalett**        | Rutnät med 16 färgprover som visar varje C64-färg med dess index (0–15 / `$00`–`$0F`) och namn. Klicka på en färgprov för att kopiera dess hexagonala index till urklipp. Håll muspekaren över färgnamnet (ljusblå, brun, etc.).                                                                                                                                                                                                   |
| **PETSCII-kontrollkoder** | Vanliga kontrollkoder för `CHROUT` ($FFD2): färgändringskoder (`$05` vit, `$1C` röd, `$1E` grön, `$1F` blå, …), markörrörelse (`$11`/`$1D`/`$91`/`$9D`), omvänd på/av (`$12`/`$92`), `$93` genomskinlig skärm, `$8E`/`$0E` teckenuppsättningsväxlare. Även ett utskrivbart fusklappsblad med olika teckenintervall (32–64 interpunktion, 65–90 A–Ö, 91–95 parenteser, 96–127 grafik, 160–191 förskjuten grafik, 192–223 spegling). |

Verktygslådan är det snabbaste sättet att slå upp ett färgindex eller en PETSCII-kontrollbyte utan att lämna redigeraren.

### Fliken Alternativ

Fliken **Alternativ** innehåller inställningarna som påverkar kodgenerering och visning av utdata:

- **Makrokälla** — när den är PÅ visar makrodefinitionsblock (MAKRO…ENDM) sin källkod inbäddad i ASM-vyn.
- **Programstartadress** — ställs nu in via ett **ORG-block** i programområdet istället för ett separat inmatningsfält. Det första ORG-blocket definierar programmets laddningsadress; efterföljande ORG-block startar ytterligare avsnitt på olika adresser.
- **Felsökarparametrar** — tre inline-växlar som styr vilka flaggor som skickas till den externa felsökaren vid uppstart:
  - **`-jmp` PÅ/AV** — hoppar direkt till programmets startadress efter laddning.
  - **`-återuppta` PÅ/AV** — återuppta felsökaren omedelbart vid laddning.
  - **`-wait` ms PÅ/AV** — lägger till en `-wait <ms>` fördröjning innan återupptas; välj 500 ms eller 1000 ms från rullgardinsmenyn.
- **Kompileringsinfo** — visar en sammanfattning av det kompilerade programmet (kodens startadress, storlek, BASIC SYS-stubstatus).

### Klicka på en ASM-linje

Klicka på valfri rad i ASM-vyn för att **markera motsvarande block ** i programområdet.

### ASM-linjenummer

ASM-panelen visar **radnummer** (`001 |`, `002 |`, …) för att förenkla felsökningen när ett kompileringsfel pekar på en specifik rad.

- De visuella linjenumren är endast för diagnostik.
- **Kopiera ASM** kopierar fortfarande den rena källtexten **utan** radnummerprefix.

### Kompilera framstegsmodal

Under tyngre åtgärder visas en centrerad förloppsmodal med en förloppsindikator:

- **Kör i VICE** — kompilera/bygga PRG och starta emulatorn.
- **Felsök** — kompilering/byggande av PRG och start av felsökare.
- **Ladda .asm-fil** — öppna en `.asm`-fil i expertläge och materialisera block från källan.

Modalfönstret stängs automatiskt när åtgärden är slutförd eller misslyckas.

---

## 5. Inställningar och verktygsfält

| Kontrollera                                  | Beskrivning                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Talbas (HEX / DEC / BIN)**                 | Ställer in visnings-/inmatningsformatet för operander i hela användargränssnittet. BIN-läget visar värden binärt med prefixet `%` (t.ex. `%11111000`). ASM-vyn visar alltid varje block i sitt eget format.                                                                                                                                                                                                                                    |
| Språk                                        | Växla användargränssnittet mellan engelska, ungerska, spanska, tyska och nederländska (nederländska)                                                                                                                                                                                                                                                                                                                                           |
| **Tema**                                     | Ljus / Mörk / OLED / Commodore 77 — välj från temaväljaren i inställningsmenyn. OLED använder en helt svart bakgrund för AMOLED-skärmar. Commodore 77 är ett neongult på svart tema; när det är det aktiva temat använder startpanelen temats panelfärg (som matchar meddelandekortet), visar en mindre dedikerad Commodore 77-logotyp och en gul förloppsindikator. Det valda temat tillämpas före den första färgsättningen vid nästa start. |
| **CRT retroläge**                            | Växlar ett helskärms-CRT-filter: skanningslinjer, fosforvinjett, flimmer och tunnformad distorsion. Tillståndet sparas mellan sessioner.                                                                                                                                                                                                                                                                                                       |
| **Visa minnespanelen**                       | Global växlingsknapp som visar eller döljer hela C64-minnespanelen                                                                                                                                                                                                                                                                                                                                                                             |
| **GRUNDLÄGGANDE SYS-stub**                   | Lägger till en BASIC-rad som anropar SYS före programmets ursprung.                                                                                                                                                                                                                                                                                                                                                                            |
| **Exempel**                                  | Ladda ett inbyggt exempelprogram                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Zooma in/ut**                              | Skala blockgränssnittet (påverkar alla blockelement)                                                                                                                                                                                                                                                                                                                                                                                           |
| **Spara projekt**                            | Spara det aktuella programmet som en `.json`-projektfil                                                                                                                                                                                                                                                                                                                                                                                        |
| **Spara program som**                        | Spara det aktuella programmet som en `.json`-projektfil med hjälp av en ny fildialogruta varje gång                                                                                                                                                                                                                                                                                                                                            |
| **Ladda projekt**                            | Ladda ett tidigare sparat projekt                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Spara arbetsyta**                          | Spara den exakta uppsättningen av för närvarande öppna, filbaserade flikar – inklusive den aktiva fliken och varje fliks redigeringsläge (Block/Expert/Ultimate Basic) – till en `.vaws` arbetsytefil                                                                                                                                                                                                                                          |
| **Spara arbetsyta som**                      | Spara den aktuella arbetsytan med en ny fildialogruta varje gång                                                                                                                                                                                                                                                                                                                                                                               |
| **Öppen arbetsyta**                          | Stäng alla öppna flikar och öppna uppsättningen filer som lagrats i en `.vaws` arbetsytefil igen                                                                                                                                                                                                                                                                                                                                               |
| **Ange arbetsmapp**                          | Välj standardmappen som används av filväljare och dialogrutor för att spara. Sökvägen lagras i appkonfigurationen och menyförhandsgranskningar håller slutet på sökvägen synligt.                                                                                                                                                                                                                                                              |
| **Öppna projekt** (`Meny → Arkiv`)           | Öppna ett projekt med flera filer `.proj` och öppna alla källfiler som flikar                                                                                                                                                                                                                                                                                                                                                                  |
| **Spara projekt** (`Meny → Arkiv`)           | Spara det aktuella `.proj`-projektet (projektpanelen måste vara öppen)                                                                                                                                                                                                                                                                                                                                                                         |
| **Stäng projekt** (`Meny → Arkiv`)           | Stäng det för närvarande öppna projektet och alla dess filflikar. Uppmanas att spara osparade ändringar. Projektpanelen återställs till sitt tomma tillstånd.                                                                                                                                                                                                                                                                                  |
| **Ladda .asm-fil**                           | Öppnar en `.asm`-fil i expertläge och importerar textfilen 6502 ASM till den aktuella fliken.                                                                                                                                                                                                                                                                                                                                                  |
| **Spara PRG**                                | Exportera den kompilerade binärfilen som en `.prg`-fil                                                                                                                                                                                                                                                                                                                                                                                         |
| **Bygg CRT**                                 | Exportera programmet som en 64K Magic Desk-fil (`.crt`, patrontyp 19). Se [Avsnitt 12b](#12b-crt-export-magic-desk-64k-cartridge).                                                                                                                                                                                                                                                                                                             |
| **Kör (delknapp)**                           | Huvudknappen **▶ Kör** kör det aktuella läget; klicka på pilen **▾** för att växla mellan: **Kör som PRG** (kompilera och starta VICE direkt), **Kör via D64** (paketera till en .d64-diskavbildning och starta VICE), eller **Kör på hårdvara** (skicka PRG till en C64 Ultimate / 1541 Ultimate-enhet). Se [Avsnitt 12](#12-d64-export--run) och [Avsnitt 13](#13-hardware-settings).                                                        |
| **Felsök (RetroDebugger)**                   | Kompilera och starta i RetroDebugger med brytpunkter, symboler och autostartflaggor (se [Avsnitt 9](#9-debugger-integration))                                                                                                                                                                                                                                                                                                                  |
| **Kör med Exomizer**                         | Kryssruta i inställningsmenyn — när den är aktiverad, kör alla Kör- och Bygg-åtgärder PRG via `exomizer sfx sys` innan de startas eller sparas. Fungerar med Kör som PRG, Kör via D64, Kör på hårdvara, Bygg PRG och Bygg D64. Konfigurera Exomizer-körbar fil i **Maskinvaruinställningar** först.                                                                                                                                            |
| **Automatisk sparning av ögonblicksbilder ** | Kryssrutan i **Maskinvaruinställningar → Ögonblicksbild **. När den är aktiverad skapar appen automatiskt en ögonblicksbild cirka 2,5 sekunder efter att du slutat redigera en flik. Stäng av den om du bara vill att ögonblicksbilder ska sparas manuellt.                                                                                                                                                                                    |
| **Maskinvaruinställningar**                  | Öppna dialogrutan för hårdvarukonfiguration — konfigurera VICE, Exomizer, RetroDebugger och C64 Ultimate (värd, lösenord, anslutningstest). Se [Avsnitt 13](#13-hardware-settings).                                                                                                                                                                                                                                                            |
| **Nytt program…**                            | Öppnar en bekräftelsedialogruta och rensar sedan alla block från programområdet                                                                                                                                                                                                                                                                                                                                                                |
| **Komprimera alla**                          | Komprimera alla block                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Om**                                       | Versionsinformation                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Nyheter**                                  | Ändringslogg                                                                                                                                                                                                                                                                                                                                                                                                                                   |

### Projektbilder

Projektbilder lagras som sidofiler av JSON på disk, inte i localStorage. De är knutna till den aktuella projektfilen när en sådan finns, så historiken finns kvar efter omstart och följer projektet.

- **Meny → Bygg → Spara ögonblicksbild** öppnar dialogrutan för ögonblicksbild och sparar det aktuella blocktillståndet plus Expert ASM-text.
- **Meny → Bygg → Återställ tidigare version. ** återställer den senaste ögonblicksbilden direkt.
- **Meny → Skapa → Ögonblicksbildshistorik** öppnar dialogrutan där du kan lägga till anteckningar, återställa äldre poster eller ta bort dem.
- **Maskinvaruinställningar → Ögonblicksbild → Automatisk sparning av ögonblicksbilder ** styr om appen skapar ögonblicksbilder automatiskt efter redigeringar. Standardfördröjningen är cirka 2,5 sekunder och inställningen gäller per flik.
- Om ett projekt inte har sparats än lagras ögonblicksbilder i appens konfigurationskatalog tills projektet får en sökväg. | **Kunskapsbas** | Referenslänkar (6502 opkoder, C64 KERNAL, minneskarta, färger) | | **Sök efter uppdateringar** | Öppna itch.io-sidan för att söka efter en nyare version |

### Arbetsytor

En **arbetsyta** (`.vaws`-fil) kommer ihåg vilka riktiga filer på disken som var öppna på varje flik – inklusive varje fliks redigeringsläge och vilken flik som var aktiv – så att du kan öppna exakt den uppsättningen igen senare. Den är separat från ett `.proj`-projekt: en arbetsyta kan omfatta valfri blandning av Block/Expert `.json`-projektfiler, fristående `.asm`-filer och Ultimate Basic `.ub`/`.proj`-källor över flera flikar.

- Arbetsytor ** sparas automatiskt ** några hundra millisekunder efter att du har gjort en ändring när en har sparats eller öppnats.
- Appen ** återställer automatiskt din senaste arbetsyta ** vid start, så dina öppna flikar fortsätter där du slutade.
- Endast flikar som backas upp av en riktig fil på disk sparas i arbetsytan; en flik som innehåller ett osparat exempel eller ett program som endast finns i minnet har inget att spara och hoppas över (med ett meddelande om ingen av de öppna flikarna kvalificerar sig).
- Om du öppnar en arbetsyta stängs först alla öppna flikar – du ombeds att bekräfta innan det fortsätter.
- Om en arbetsyta refererar till en fil som sedan dess har flyttats eller tagits bort, hoppas den posten över och rapporteras med namn efter inläsning.

### Ladda .asm-fil (snabbreferens)

Expertlägesladdaren `.asm` accepterar vanliga 6502-källmönster och konverterar dem till block:

- `* = 1500 USD` → ORG-block
- `Etikett:` → ETIKETTblock
- `Etikett: .byte 0` → ETIKETT + BYTE-block
- `.byte ...` → BYTE-block
- `; kommentar` (eller inline `; ...`) → KOMMENTAR-block
- instruktioner (`lda`, `jsr`, `beq`, etc.) → instruktionsblock med detekterat adresseringsläge

#### Importera parsningsanteckningar och bästa praxis

- Lokala etiketter som `.wait` importeras som standardetiketter (punkten borttagen), och referenser normaliseras därefter.
- För adressering av typen `($zp),Y` / `($zp,X)` ska en konkret nollsidig byte (`$FB`, `$FC`, etc.) användas för bästa kompatibilitet.
- Undvik tvetydiga korta etiketter som ser ut som hexagoner (`cc1`, `dead`, `beef`) i grenkontexter; föredra namn som `loop_cc1`.
- Om ditt program startar med data (`.byte`) före körbar kod, lägg till ett explicit hopp (till exempel `JMP Start`) högst upp.

### ASM-import (Kick Assembler)

Knappen **ASM-import** på programmenyn importerar rå Kick Assembler-källa till en ny flik i blockläge. Den är separat från expertläget `Ladda .asm-fil` ovan — dess anpassade verktygstips markerar att **endast Kick Assembler-kod stöds** (andra assemblerar kan tolka delvis men garanteras inte att de går runt).

Stödda mönster:

- `.pc = $XXXX` ursprungsdirektiv → ORG-block
- `.konstant NAMN = värde`, `.etikett NAMN = värde` → KONSTANT equate
- `.makro NAMN(p1, p2, ...) { ... }` med `{`/`}` klammerparenteskropp eller `.endm` → användarmakrodefinition
- Makroanrop `NAME(args)`, Kick colon-prefix `:NAME(args)` och `.invoke NAME(args)` — helt tur och retur via Kick colon-formuläret
- Etiketter som `@local` (`@loop:`, `BEQ @loop`) bevarar prefixet `@` som det är
- Operand `etikett + N` / `etikett - N` (t.ex. `STA mod1+2`, `LDA xp+1`)
- Radkommentarer `// ...` och `;` — båda accepterade, `/* ... */`-block behandlas som en enda kommentarsrad
- BASIC autostart-genomströmning: när programmet startar vid `$0801` med standard `SYS 2061` byte-stub (`.byte $0B,$08,$0A,$00,$9E,$32,$30,$36,$31,$00,$00,$00`), genererar kompilatorn PRG ordagrant istället för att omsluta ett andra BASIC SYS-system.

Känd begränsning:

- Konstanter som löses upp till en nollsidig adress (till exempel `.const BYTEADDR = $FC` använd som `STA BYTEADDR`) kompilerar för närvarande till absolutlägesinstruktioner (3 byte) istället för nollsidig (2 byte). Den kompilerade koden skriver fortfarande till rätt minnesplats, bara med en liten storlek och cykeloverhead jämfört med samma källkod som byggdes av Kick Assembler.

## UltimateBasic-läge

Visual Assembler innehåller en komplett **Ultimate Basic IDE**. Ultimate Basic är ett modernt kompilerat BASIC-språk för att skapa C64-program, spel och demos utan att skriva varje operation i lågnivå 6502-assemblering. Kompilatorn körs lokalt och genererar inbyggd C64 PRG-utdata.

### Öppnar UB-redigeraren

Välj ikonen **UB** i huvudverktygsfältet för att växla till Ultimate Basic-läget. Det valda redigeringsläget sparas även efter omstart av programmet. En ny källa börjar med:

```basic
color bg 0
color border 0

print "HELLO FROM ULTIMATE BASIC"
```

UB-läget fungerar med källfilerna `.ub`. **Ny**, **Öppna**, **Spara** och **Spara som** används på den aktiva UB-fliken. Om du öppnar en `.ub`-fil aktiveras matchande redigeringsflik automatiskt.

Verktygsfältet visar den aktuella UB-arbetsmappen. Denna mapp lagras separat från Block/Expert-arbetsmappen. Medan UB-läget är aktivt väljer **Arkiv → Ange arbetsmapp** UB-mappen; dess verktygstips identifierar det aktiva omfånget. UB:s öppna/spara-dialogrutor börjar där, och osparade källor använder den som bas för relativa sökvägar `include` och `incbin`.

### Redigeringsverktyg

UB-verktygsfältet följer samma visuella språk och anpassade verktygstips som expertläget. Det erbjuder:

- syntaxmarkering baserad på den nuvarande Ultimate Basic-språkreferensen;
- radnummer som förblir synkroniserade med långa filer;
- en minikarta och zoomkontroller för redigeraren; klicka på minikartan för att hoppa eller dra dess visningsportval för kontinuerlig rullning;
- Sök (`Ctrl+F` / `Cmd+F`) med hjälp av expertsökfältet;
- källformatering med strukturmedveten indentering;
- autokomplettering för kommandon och inbyggda funktioner;
- en sökbar **Kommandon**-panel med syntax, beskrivning och användningsvägledning — beskrivningarna följer det aktuella gränssnittsspråket (ungerska, engelska, spanska, tyska, nederländska) och använder engelska för allt som ännu inte översatts;
- oberoende växlingsbara paneler för **Projekt** och **Kommandon**, som visas sida vid sida när båda är aktiverade;
- oberoende växlingsbara och storleksändrbara paneler **Bygg, utgång ** och **Demontering **.

Panelen Demontering innehåller en **Kopiera**-knapp som kopierar hela den visade källan till urklipp. Kommandohjälpen följer den medföljande kompilatorn: till exempel väljer `sprite_frame id, data_address [, frame]` en animeringsbild från på varandra följande 64-byte sprite-frames.

Kommandolistan är avsiktligt höjdbegränsad så att kommandodetaljkortet kan fylla den återstående panelhöjden. Detaljområdet rullar oberoende för längre syntaxbeskrivningar.

### Projekt, flikar och startfiler

Ultimate Basic-projekt använder `.proj`-filer och kan innehålla flera `.ub`-källor. Projektpanelen listar öppna filer, markerar osparade flikar och visar upptäckta etiketter, funktioner och subrutiner. Med projektåtgärder kan du skapa, öppna, spara och stänga ett projekt eller lägga till ytterligare en källfil.

Klicka på stjärnan bredvid en projektfil för att markera den som **startfilen**. Kommandona Build, Run, D64, C64 Ultimate och Debug kompilerar den startkällan även om en annan flik för närvarande är aktiv. Utan ett startval används den aktiva UB-fliken.

### Byggnad och diagnostik

Knappen **Bygg** öppnar samma centrerade förloppsupplevelse som används av de andra arbetsflödena i Visual Assembler. Lyckade byggen uppdaterar byggutdata, bygginformation och disassemblering. Aktivera **Verbose** för att inkludera detaljer om kompilatorns minnesmappning, interna nollsidesallokeringar och genererade koddata.

När kompileringen misslyckas:

- Byggresultatet visas automatiskt;
- kompilatorfel återges i rött;
- den centrerade kompileringsdialogrutan visar felet;
- fel som innehåller en källrad, välj den raden i den aktiva UB-redigeraren.

Bygginfo rapporterar inläsnings-/slutadresser, kod- och PRG-storlekar, Exomizer-status, variabler, arrayer, funktioner/subrutiner och etiketter.

### Löpning, D64 och Exomizer

Huvuddelningsknappen **Run** stöder Ultimate Basic i alla vanliga destinationer:

| Körläge                 | Ultimat grundläggande beteende                                                          |
| ----------------------- | --------------------------------------------------------------------------------------- |
| **Kör som PRG**         | Kompilera och starta PRG direkt i VICE.                                                 |
| **Kör via D64**         | Kompilera, öppna standarddialogrutan för D64-paketering och starta sedan disken i VICE. |
| **Kör på Ultimate**     | Ladda upp och kör PRG:en via den konfigurerade C64 Ultimate REST-anslutningen.          |
| **Kör D64 på hårdvara** | Paketera en D64 och skicka den till den konfigurerade C64 Ultimate.                     |

Det globala alternativet **Inställningar → Exomizer** gäller även för UB-byggen och normala körmål; ingen separat UB-verktygsfältsväxling behövs. Felsökarstarter använder avsiktligt den okomprimerade PRG så att kompilatoradresser och symboler fortsätter att matcha det körda programmet.

Aktivera **Inställningar → Programinställningar → Generera UltimateBasic ASM-källa (.asm)** för att spara den kompilatorgenererade assemblyn bredvid en PRG- eller D64-byggfil med samma basfilnamn. Detta är ett byggalternativ, så UB-verktygsfältet innehåller inte separata ASM-exportknappar. En `load "NAME", $address`-sats levererar också den matchande D64-extrafilens PRG-laddningsadress.

### Felsökarsymboler och demontering

Byggen begär felsökningsinformation för Ultimate Basic och producerar tre kompatibla sidovagnar:

- `.sym` för symboler i KickAssembler-stil;
- `.dbg` för C64Debugger/RetroDebugger-käll- och segmentinformation;
- `.vs` för VICE-skärmetiketter.

Den färgade UB-demonteringspanelen löser kända etiketter och presenterar adresser, byte, mnemonik och operander. Knappen **Debug** startar RetroDebugger med den råa UB PRG:n, felsökningsfunktioner och kompilatorns etiketter, funktioner, subrutiner, variabler och arrayer. Inställningar för att vänta och återuppta paus vid felsökning delas med den vanliga felsökningskonfigurationen för Visual Assembler.

### Ultimate Basic-manual och källa

Bokikonen i UB-verktygsfältet öppnar matchande Ultimate Basic `MANUAL.pdf` offline; knappen manual i välkomstdialogrutan för start öppnar samma manual. Visual Assembler hämtar både kompilatorn och PDF-filen från det fästa uppströms Git/Cargo-beroendet, så IDE:n underhåller inte en andra kopia av Ultimate Basic-implementeringen. Dialogrutan Om och välkomstskärmen visar den faktiska beroendeversionen.

Ultimate Basic finns även tillgängligt som ett fristående projekt med öppen källkod:

<https://github.com/zstarczali/UltimateBasic>

Kompilatorn är inbyggd i Visual Assembler, så ingen separat `ub` körbar fil krävs vid körning.

## 6. Expertläge

Expertläge är en fullfjädrad direkttext-assembleringseditor i 6502 som finns bredvid blockredigeraren. Varje flik kan vara i antingen blockläge eller expertläge – du kan växla mellan dem fritt när som helst med hjälp av reglaget **Block / Expert** i den översta fältet.

### Växlingslägen

- **Block → Expert:** det aktuella programmet serialiseras till text (en instruktion per rad, etiketter, makron som direktiv). Redigeringar i expertläge synkroniseras tillbaka till blockmatrisen när du växlar tillbaka eller utlöser en åtgärd.
- **Expert → Block:** texten tolkas med `parseAsmText()` och resultatet ersätter blockprogrammet. En dialogruta med kompileringsfel visas om tolkningen misslyckas.
- **Blanka linjer** bevaras genom tur och retur: tomma linjer i expertredigeraren visas som tunna streckade distanser i blockläge och återställs som tomma linjer när man växlar tillbaka till expertläge.

### Redigerarlayout

```
┌──────────────────────────────────────────────────────┐
│ [toolbar]  Block │ Expert < tab toggle               │
├────────────┬────────────────────────────┬────────────┤
│  Palette   │   ASM text editor          │  Disasm    │
│  (opt.)    │   (monospace, editable)    │  panel     │
│            │                            │  (opt.)    │
└────────────┴────────────────────────────┴────────────┘
```

| Panel              | Växla                | Beskrivning                                                                                                                 |
| ------------------ | -------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Palett**         | `#expert-palett-btn` | Vänster blockpalet — dra block till redigeraren eller klicka för att infoga vid markören                                    |
| **ASM-redigerare** | alltid synlig        | Fullständigt monospace-textområde med live syntaxmarkeringöverlägg                                                          |
| **Diasm-panel **   | `#expert-disasm-btn` | Ren 6502-demontering: varje instruktion visar adress, hexadecimala byte och numeriska operander; makron är helt expanderade |

### Verktygsfältsknappar

| Knapp                                  | ID                                                | Fungera                                                                                                                                                                                                                            |
| -------------------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Format**                             | `#expert-format-btn`                              | Autoformatera källa (etiketter till kolumn 0, 4-mellanslags indent, 1-mellanslags mnemonisk/operand)                                                                                                                               |
| **Ladda .asm**                         | `#expert-load-asm-btn`                            | Öppna en `.asm`-fil — innehållet laddas till en **ny flik** med filnamnet som fliketikett. Varje laddad fil blir en oberoende flik med sina egna programblock och redigeringsstatus.                                               |
| **Spara .asm**                         | `#expert-save-asm-btn`                            | Spara redigeringsinnehåll till en `.asm`-fil (fildialogruta vid första sparningen)                                                                                                                                                 |
| **Bygginformation**                    | `#expert-bygg-info-btn`                           | Öppna dialogrutan Bygginformation (ursprung, storlek, etiketter, fel)                                                                                                                                                              |
| **HL**                                 | `#expert-hl-btn`                                  | Aktivera syntaxmarkering (avaktivera för mycket stora filer)                                                                                                                                                                       |
| **Autokomplettera**                    | `#expert-autocomplete-btn`                        | Aktivera/avaktivera expertförslag för autoslutförande. När det är inaktiverat visas inga direktiv, mnemonik eller etikettfönster i expertredigeraren.                                                                              |
| **Regionsval**                         | `#expert-region-val-btn`                          | Aktivera automatisk markering av regioner i expertläge. Vikningsläget förblir lagrat, men när det är avstängt håller redigeraren hela källan synlig och väljer inte automatiskt den aktuella regionen.                             |
| **Komprimera/expandera alla regioner** | `#expert-region-vik-alla-btn`                     | Vik eller vik ut varje `.region`-block med ett enda klick. Om någon region är öppen komprimeras alla; om alla regioner redan är komprimerade expanderas alla med nästa klick. Knappen lyser upp när alla regioner är komprimerade. |
| ** Radnummer **                        | `#expert-linjenummer-btn`                         | Aktivera radnummermarginalen på vänster sida av redigeraren. Mellanmarginalen är synkroniserad med rullningspositionen och uppdateras live medan du skriver.                                                                       |
| **Hitta**                              | `#expert-hitta-btn`                               | Öppna den flytande sökfältet (`Ctrl+F`). Skriv för att söka; träffar markeras i överlägget. `Enter` / `Shift+Enter` navigerar mellan träffar. `Escape` stänger fältet.                                                             |
| **Zooma ut/in**                        | `#expert-zoom-ut-knapp` / `#expert-zoom-in-knapp` | Minska/öka redigerarens teckenstorlek (8–28 px). Inställningen sparas.                                                                                                                                                             |
| **Palett**                             | `#expert-palett-btn`                              | Visa/dölj den vänstra mnemoniska paletten                                                                                                                                                                                          |
| **Diasm**                              | `#expert-disasm-btn`                              | Visa/dölj demonteringspanelen (pure 6502, makron expanderade)                                                                                                                                                                      |
| **Skärm**                              | `#expert-monitor-btn`                             | Visa/dölj skärmens hex-dump-panel                                                                                                                                                                                                  |
| **Minikarta**                          | `#expert-minimap-btn`                             | Visa/dölj kodminimap-remsan på höger sida av redigeraren                                                                                                                                                                           |

Kortkommandon för redigeraren: `Ctrl+/` (`Cmd+/` på macOS) kommenterar den aktuella raden eller varje markerad rad; om du lägger till `Shift` tas den inledande kommentarsmarkören bort från dessa rader. Inbäddade kommentarer (till exempel `LDA $12 ; förklaring`) finns kvar på instruktionsraden när du växlar mellan expertläge och blockläge. Blockläge visar dem som en grön kursiv `; kommentar`-markör i blockrubriken; om du håller muspekaren över markören visas hela texten när den är avkortad.

### Expertredigerare minikarta

Expertredigerarens minikarta är en smal arbetsytremsa (`88 px`) längst till höger i redigeringsområdet. Den återger en nedskalad representation av varje källrad:

| Färg på stapeln | Tokentyp                                             |
| --------------- | ---------------------------------------------------- |
| Kommentarfärg   | Rader som börjar med `;`                             |
| Etikettfärg     | Rader med en `etikett:`-definition                   |
| Direktivfärg    | `.byte`, `.macro`, `.region` och alla andra direktiv |
| Mnemonisk färg  | Allt annat (instruktioner)                           |

En **halvtransparent visningsindikator** (accentfärgad rektangel) visar vilken del av källan som för närvarande är synlig. Klicka var som helst på minikartan för att hoppa till den positionen; dra för att rulla kontinuerligt. Minikartan rullar oberoende för att hålla visningsindikatorn centrerad. Tillståndet sparas i användargränssnittsinställningarna (`expertMinimap`-tangent).

### Fel vid markering

Rader som misslyckas med att kompilera markeras med **rött** (tonad bakgrund + vänster accentkant) i realtid, 350 ms efter varje tangenttryckning. Det första felmeddelandet visas också i statusfältet. Korrigera raden så försvinner markeringen automatiskt.

### Syntaxmarkering

Redigeraren använder ett transparent `<div>`-överlägg (`expert-hl`) som speglar textområdets innehåll med färgade `<span>`-element. Markering kan avaktiveras med knappen **HL** för prestanda i mycket stora program.

| Färg     | Tecken                                                                                                                                                   |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gulgrön  | Mnemonik (`LDA`, `STA`, `JMP`, …) och långgreniga pseudo-operationer (`LBNE`, `LBEQ`, …)                                                                 |
| Blå      | Direktiv (`.byte`, `.word`, `.fill`, `.assert`, `*=`, …)                                                                                                 |
| Orange   | Tal (`$FF`, `%1010`, `255`)                                                                                                                              |
| Cyan     | Etiketter — rader som slutar på `:`, inklusive lokala etiketter (`.loop:`) och operandetiketter för självmodifierande kod (`value:` in `LDA value:#$00`) |
| Kricka   | Strängliteraler                                                                                                                                          |
| Mörkgrön | Kommentarer (`; …`)                                                                                                                                      |

Direktiven `REGION` / `ENDREGION` markeras precis som de andra assemblerdirektiven. Komprimerade regioner behåller endast regionrubriken synlig i redigeraren tills du öppnar dem igen. Den nya verktygsfältsknappen **Regionsval** styr endast den automatiska markeringen av aktuell region i expertläge; om den stängs av förblir källan synlig utan att ändra vikningsläget.

### Källformaterare

Klicka på knappen **Formatera** (`#expert-format-btn`) för att formatera den aktuella källan automatiskt:

- Etikettdefinitionerna flyttas till kolumn 0.
- Instruktionerna är indragna med fyra mellanslag.
- Mnemonik är skrivna med versaler.
- Exakt ett mellanslag mellan mnemonik och operand (extra blanksteg normaliseras).
- Om källan redan är formaterad visas statusen `"Redan formaterad"`.

### Projektpanel och flikar

Expertläget stöder en **projektpanel** (`#expert-project-panel`) för projekt med flera filer `.proj`:

- En `.proj`-fil är ett JSON-manifest som listar källfiler och deras metadata.
- Öppna ett projekt med **Meny → Arkiv → Öppna projekt** eller dra en `.proj`-fil till fönstret.
- Varje fil i projektet öppnas som en separat **flik** i flikfältet högst upp i redigeraren.
- **Stäng projekt** (`Meny → Arkiv → Stäng projekt` / `#menu-close-project`) stänger det aktuella projektet och alla dess filmlikar samtidigt. Uppmanar dig att spara eventuella osparade ändringar innan stängning. Projektpanelen återställs till sitt tomma tillstånd och `_expertProjectData` rensas.
- Varje fil kan markeras som **startfilen** (★ stjärnikon). När en startfil är inställd, samlar och kör knappen **Kör** (PRG, D64, Ultimate) alltid filens kod – oavsett vilken flik som är aktiv för närvarande. Detta fungerar i både blockläge och expertläge.
- Avsnittet **symboler** längst ner i projektpanelen kan ändras i storlek vertikalt med avdelaren mellan filträdet och symbollistan, så långa symbollistor kan ta upp mer plats vid behov.

### Flikfält

Flikfältet visas ovanför redigeraren när det finns mer än en flik öppen.

| Särdrag             | Beskrivning                                                                                                                                                                                                                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Smutsig prick**   | En liten accentfärgad prick på fliknamnet indikerar osparade ändringar                                                                                                                                                                                                                      |
| **Scrollpilar**     | Vänster/höger rullningsknappar visas när det finns fler flikar än vad som får plats i fältet                                                                                                                                                                                                |
| **Stäng (×)**       | Stänger fliken; uppmanar att spara om fliken är smutsig                                                                                                                                                                                                                                     |
| **Filändelse**      | Det fullständiga filnamnet inklusive filändelsen (`.c64va`, `.json`) visas.                                                                                                                                                                                                                 |
| **Högerklicksmeny** | Högerklicka på en flik (eller ett tomt flikfält) för: **Ny flik**, **Stäng fliken**, **Stäng andra flikar**, **Stäng flikar till höger**, **Stäng alla flikar**. Batchstängningsåtgärder frågar efter felaktig flik och stoppar om du avbryter. **Stäng alla** behåller alltid en tom flik. |

> **Tips:** Palettsynkronisering (`#expert-palette-sync-btn`) håller palettvalet synkroniserat med mnemoniken vid markören. Inaktivera funktionen när du föredrar att paletten inte ska hoppa runt när du redigerar.

---

## 7. Adresseringslägen

Varje 6502-instruktion stöder ett eller flera adresseringslägen. Lägesväljaren visas på varje block.

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
| **indirektX**     | Indirekt,X      | `LDA ($FB,X)`   | Noll sidindexerad indirekt (operand = noll sidadress, 1 byte)           |
| **indirektY**     | Indirekt, Y     | `LDA ($FB),Y`   | Noll sid indirekt indexerad (operand = noll sidadress, 1 byte)          |
| **indirekt**      | Indirekt        | `JMP ($0100)`   | Indirekt; endast användbar med JMP                                      |

### Märk uttryck som operander

Alla operandfält som accepterar en adress eller ett omedelbart värde accepterar också en **konstant name** (från ett `CONST`-block eller ett `LABEL`) direkt. Dessutom kan du använda uttrycken **label+offset** eller **label−offset** för att referera till en adress relativt till en namngiven konstant:

| Syntax            | Exempel                      | Beskrivning                                                                                                       |
| ----------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `etikett`         | `STA screen_ram,X`           | Löser upp till etikett-/konstantvärdet                                                                            |
| `etikett+$hex`    | `STA skärmram + 100 USD, X ` | Etikettadress plus en hexagonal offset                                                                            |
| `etikett+decimal` | `STA skärmram+256,X`         | Etikettadress plus en decimalförskjutning                                                                         |
| `etikett-$hex`    | `LDA-bord - 10 dollar `      | Etikettadress minus hexagonal offset                                                                              |
| `#<etikett`       | `LDA #<screen_ram`           | Låg byte för etikettadressen                                                                                      |
| `#&gt;etikett`    | `LDA #&gt;screen_ram`        | Hög byte för etikettadressen                                                                                      |
| `*`               | `BNE *`                      | Aktuell programräknare (instruktionens egen adress); grenar med `*` genererar en oändlig självloop (offset `$FE`) |

**Exempel — rensa två skärmsidor med hjälp av en CONST:**
```
; .CONST screen_ram = $0400
    LDX #$00
clear:
    STA screen_ram,X
    STA screen_ram+$0100,X
    DEX
    BNE clear
```

### Programräknaren `*` i uttryck

*(Nytt i 2.3.9.)* `*` är inte längre begränsat till att vara hela operanden — den kan förekomma **var som helst i ett operanduttryck**, och står för adressen till instruktionen den är skriven på. Den löses upp vid monteringstillfället mot instruktionens verkliga adress, så ingen etikett behövs för korta relativa hopp eller PC-relativa dataläsningar.

| Syntax              | Exempel                                  | Menande                                                |
| ------------------- | ---------------------------------------- | ------------------------------------------------------ |
| `*`                 | `BNE *`                                  | Förgrening till sig själv (oändlig loop, offset `$FE`) |
| `*-n` / `*+n`       | `BNE *-5`, `BEQ *+4`                     | Gren relativt till den aktuella datorn med *n* byte    |
| `JMP *+n`           | `JMP *+20`                               | Absolut hopp beräknat från den aktuella datorn         |
| `#&lt;*` / `#&gt;*` | `LDA-nummer &lt;* `, `LDA-nummer &gt;* ` | Låg/hög byte för den aktuella datorn                   |
| `#&gt;(*+n)`        | `LDA-nummer&gt;(*+63)`                   | Låg/hög byte för en PC-relativ adress                  |

**PC vs. multiplikation.** `*` behandlas som programräknaren endast när den sitter i *värdepositionen* — i början av uttrycket, eller direkt efter en operator, `(`, `,`, `&lt;`, `&gt;` eller blanksteg. En `*` som följer ett tal, `)` eller en identifierare är vanlig multiplikation, så `LDA-tabellen*2` och `CONST_A*4` är oförändrade.

**Där det fungerar.** Alla operander som redan accepterar ett uttryck: branch targets, `JMP` / `JSR`, `LDA`/`STA`/… absoluta och indexerade, omedelbara operatorer för låg/hög byte och uttrycket `.assert`. `*` ändrar aldrig en instruktions storlek, så den är säker i alla adresseringslägen.

### Lokala (prickade) etiketter

*(Nytt i 2.3.9.)* En etikett vars namn börjar med en punkt — `.loop`, `.skip`, `.done` — är en **lokal etikett**. Den tillhör omfånget för den närmaste föregående **globala** (icke-prickade) etiketten och blir internt `<global>.<namn>`. Två lokala etiketter med samma korta namn under olika globala etiketter kolliderar **inte**.

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

- Inom ett omfång, referera till en lokal etikett som `.namn`.
- Från ett annat scope, referera det explicit som `Global.name` (t.ex. `JMP ClearScreen.loop`).
- Ett `.namn` som skrivs före en global etikett förblir ett vanligt `.namn` på toppnivå.
- Lokala etiketter går igenom Block ⇄ Expertläge oförändrade; prefixet `<global>.` är en detalj vid layouttid och lagras aldrig i blockprogrammet.

### Operandetiketter för självmodifierande kod

*(Nytt i 2.3.9.)* Sätt prefixet `label:` på en instruktions operand för att placera en etikett på **operandbyte** snarare än opkoden. Instruktionen samlas från det som följer efter kolon.

```
setup:
    LDA value:#$00     ; 'value' -> address of the #$00 operand byte
    ...
patch:
    LDA #new
    STA value          ; writes the operand byte directly — classic SMC
```

`värde` pekar på `<instruktionsadress> + 1` (den första operandbyten), för varje adresseringsläge. Detta ersätter det äldre `STA-instruktionsmönstret + 1` / `: LDA #$00`-mönstret. Det går igenom Block ⇄ Expertläge (operandfältet behåller prefixet `etikett:`).

---

## 8. Standard 6502 Instruktioner

### Dataförflyttning

| Mnemonisk | Beskrivning       | Lägen                                                                  |
| --------- | ----------------- | ---------------------------------------------------------------------- |
| `LDA`     | Lastackumulator   | omedelbar, nollSida, absolut, absolutX, absolutY, indirektX, indirektY |
| `LDX`     | Ladda X-register  | omedelbar, nollSida, nollSidaY, absolut, absolutY                      |
| `LDY`     | Ladda Y-register  | omedelbar, nollSida, absolut, absolutX                                 |
| `STA`     | Butiksackumulator | nollSida, absolut, absolutX, absolutY, indirektX, indirektY            |
| `STX`     | Lagra X-register  | nollSida, nollSidaY, absolut                                           |
| `STY`     | Lagra Y-register  | nollSida, absolut                                                      |

### Aritmetisk

| Mnemonisk | Beskrivning           | Anteckningar                                                      |
| --------- | --------------------- | ----------------------------------------------------------------- |
| `ADC`     | Lägg till med bär     | Ställ in bärfunktionen med `SEC` före användning i de flesta fall |
| `SBC`     | Subtrahera med bäring | Sätt carry med `SEC` före subtraktion                             |
| `INC`     | Öka minnet            | —                                                                 |
| `DEC`     | Minska minnet         | —                                                                 |
| `CMP`     | Jämför med A          | Sätter flaggor; ändrar inte A                                     |
| `CPX`     | Jämför med X          | —                                                                 |
| `CPY`     | Jämför med Y          | —                                                                 |

### Logik

| Mnemonisk | Beskrivning                                         |
| --------- | --------------------------------------------------- |
| `OCH`     | Logiskt OCH med ackumulator                         |
| `ORA`     | Logiskt ELLER med ackumulator                       |
| `EOR`     | Exklusiv ELLER med ackumulator                      |
| `BIT`     | Testbitar i minnet mot A (sätter N-, V-, Z-flaggor) |

### Hopp och grenar

| Mnemonisk | Beskrivning                                         |
| --------- | --------------------------------------------------- |
| `JMP`     | Ovillkorligt hopp (absolut eller indirekt)          |
| `JSR`     | Hoppa till subrutin (sparar returadress på stacken) |
| `RTS`     | Återgå från subrutin                                |
| `RTI`     | Återgång från avbrott                               |
| `BNE`     | Gren om inte lika (Z=0)                             |
| `BEQ`     | Gren om lika (Z=1)                                  |
| `BCC`     | Förgrena sig om överföringen är klar (C=0)          |
| `BCS`     | Förgrening om bäruppsättning (C=1)                  |
| `BMI`     | Gren om Minus (N=1)                                 |
| `BPL`     | Gren om Plus (N=0)                                  |
| `BVC`     | Gren vid överflöde Rensa (V=0)                      |
| `BVS`     | Gren om överflöde inställt (V=1)                    |

#### LBNE / LBEQ / … (Långa grenar)

*(Nytt i 2.3.9.)* Paletten **Långa grenar** innehåller åtta pseudo-operationer som beter sig som villkorliga grenar men når **valfri adress**, inte bara −128…+127. Var och en samlas till en inverterad gren som hoppar över en 3-byte `JMP` — alltid **5 byte**:

```
LBEQ done      ; assembles to:   BNE *+3   ($D0 $03)
               ;                 JMP done  ($4C lo hi)
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

- Operand: en etikett, ett `*`-uttryck eller en litteral adress — samma som ett normalt grenmål.
- Kostnad: 5 byte och 1 extra cykel på den tagna vägen jämfört med en kort gren. Det sker ingen automatisk befordran av en kort gren — du väljer `LBxx` explicit.
- När en vanlig gren (`BNE`, `BEQ`, …) är utanför intervallet, namnger kompileringsfelet nu den exakta överskridningen och föreslår matchande `LBxx`.

### Registrera operationer

| Mnemonisk | Beskrivning             |
| --------- | ----------------------- |
| `SKATT`   | Överför A → X           |
| `TAY`     | Överför A → Y           |
| `TXA`     | Överför X → A           |
| `TYA`     | Överför Y → A           |
| `TSX`     | Överför stackpekare → X |
| `TXS`     | Överför X → Stackpekare |
| `INX`     | Steg X                  |
| `DEX`     | Minska X                |
| `INY`     | Ökning Y                |
| `DEY`     | Minska Y                |

### Shift & Rotate

| Mnemonisk | Beskrivning                     |
| --------- | ------------------------------- |
| ` ASL `   | Aritmetisk förskjutning vänster |
| `LSR`     | Logisk skiftning åt höger       |
| `ROL`     | Rotera vänster genom bärning    |
| `ROR`     | Rotera höger genom bärning      |

### Stack

| Mnemonisk | Beskrivning                        |
| --------- | ---------------------------------- |
| `PHA`     | Tryck ackumulatorn på stapeln      |
| `PHP`     | Skjut processorstatus till stacken |
| `PLA`     | Dra ackumulatorn från stacken      |
| `PLP`     | Hämta processorstatus från stacken |

### System / Flaggor

| Mnemonisk | Beskrivning                          |
| --------- | ------------------------------------ |
| `CLC`     | Clear Carry-flaggan                  |
| `CLD`     | Rensa decimalläge                    |
| `CLI`     | Rensa avbrottsavaktivering           |
| `CLV`     | Rensa överfyllnadsflaggan            |
| `SEK`     | Ställ in bärflaggan                  |
| `SED`     | Ställ in decimalläge                 |
| `SEI`     | Ställ in avbrottsavstängning         |
| `NOP`     | Ingen operation                      |
| `BRK`     | Tvingat avbrott / programvaruavbrott |

### Olagliga/Odokumenterade instruktioner

Dessa stöds för avancerad användning. Använd med försiktighet – beteendet kan variera mellan kretsar.

`LAX`, `SAX`, `DCP`, `ISC`, `SLO`, `RLA`, `SRE`, `RRA`, `ANC`, `ALR`, `ARR`, `AXS`

---

## 9. Makroblock — Referens

Makroblock låter dig utföra vanliga uppgifter i ett steg – istället för att skriva 10–20 instruktioner för hand, släpper du ett block och assemblern genererar koden åt dig. Tänk på dem som inbyggda subrutiner.

---

### LABEL

Som ett **radnummer i BASIC** — men med ett namn istället för ett nummer. Hoppmål för `JMP`, `JSR`, `BNE`, etc.

| Fält        | Beskrivning                                          |
| ----------- | ---------------------------------------------------- |
| Etikettnamn | Identifierare som används i `JMP`, `JSR`, `BNE` etc. |

**Expertsyntax:**
```
loop:
```

**Genererad ASM:**
```
loop:  ; $0820
```

Den aktuella adressen visas som en kommentar. Etiketter har en storlek på **0 byte**.

---

### COMMENT

Liksom **REM i BASIC** — en anmärkning till dig själv som assemblern ignorerar helt.

**Expertsyntax:**
```
; Your comment text here
```

**Genererad ASM:**
```
; Your comment text here
```

---

### BYTE

Liksom **DATA i BASIC** — lagrar en lista med råa bytevärden inline i programmet.

| Fält    | Beskrivning                                                          |
| ------- | -------------------------------------------------------------------- |
| Operand | Kommaavgränsade bytevärden (t.ex. `$01, $02, $FF` eller `1, 2, 255`) |

**Expertsyntax:**
```
.byte $01, $02, $FF
```

**Genererad ASM:**
```
    .byte $01, $02, $FF
```

**Referenser för låg/hög byte-etiketter:** BYTE accepterar tokens av KickAssembler / ca65-stilen `<label` (låg byte) och `>label` (hög byte) tillsammans med numeriska värden. Assemblern löser etikettadressen vid kompileringstillfället och infogar lämplig byte. Exempel:

```
    .byte <frame_0, >frame_0, <frame_1, >frame_1
```

Detta lagrar den låga byten för `frame_0`s adress, sedan den höga byten, och sedan samma sak för `frame_1`. Användbart för att bygga hopptabeller och adresslistor.

**Storlek:** Antal byte i listan.

---

### WORD

Liksom **DATA i BASIC men för 16-bitars tal **. Varje värde lagras som två byte (låg byte först, sedan hög byte — 6502 little-endian-ordning).

| Fält    | Beskrivning                                            |
| ------- | ------------------------------------------------------ |
| Operand | Kommaavgränsade 16-bitarsvärden (t.ex. `$0400, $C000`) |

**Expertsyntax:**
```
.word $0400, $C000
```

**Genererad ASM:**
```
    .word $0400, $C000
```

**Storlek:** 2 byte per ord.

---

### FILL

Liksom `FOR I=1 TO N: POKE addr+I, val: NEXT` — fyller ett minnesblock med samma byte, men i ett enda block. Utmärkt för att rensa områden eller förfylla tabeller.

| Fält    | Beskrivning                                            |
| ------- | ------------------------------------------------------ |
| Operand | `antal,värde` — t.ex. `256,0` fyller 256 byte med noll |

**Expertsyntax:**
```
.fill 256, $00
```

**Genererad ASM:**
```
    .fill 256, $00
```

**Uttryckssyntax:** Både `count` och `value` accepterar aritmetiska uttryck. Du kan referera till CONST-namn, använda hexadecimala/binära litteraler och anropa inbyggda matematiska funktioner:

| Uttryck                       | Menande                                   |
| ----------------------------- | ----------------------------------------- |
| `TILE_COUNT, 00 kr `          | räkna från en KONSTANT, värde hex-literal |
| `40*25, 0`                    | inline-multiplikation                     |
| `runda(sin(PI/4)*255), 80 kr` | trigonometri                              |

**Inbyggda funktioner: ** `sin()`, `cos()`, `round()`, `max(a,b)`, `min(a,b)`, `abs()`, konstant `PI`

Operatorer: `+ - * /` Literaler: `$FF` (hex), `%10110000` (binär) Låg/hög byte: `lo(expr)`, `hi(expr)`

**Storlek:** Antalet värde i byte.

---

### ALIGN

Skjuter den aktuella adressen framåt till nästa rena gräns genom att infoga noll-utfyllnadsbyte. C64 kräver att sprite-data börjar på en 64-byte-gräns — `ALIGN 64` hanterar det automatiskt.

| Fält  | Beskrivning                                                                 |
| ----- | --------------------------------------------------------------------------- |
| Gräns | Justeringsvärde — t.ex. `64` (spritegräns), `256` (sida), `$2000` (bitmapp) |

**Expertsyntax:**
```
.align 64
.align $2000
```

**Genererad ASM:**
```
    ; ALIGN 64 → $0840 (12 bytes padding)
```

**Storlek:** Dynamisk — beror på den aktuella programräknarpositionen.

> **Tips:** Använd `ALIGN 64` före spritedata, `ALIGN 256` för att säkerställa sidjusterade tabeller.

---

### TEXT

Liksom **PRINT AT** — skriver text direkt till C64-skärmen vid en given kolumn och rad, utan att använda KERNAL. Den genererar ett LDA/STA-par per tecken, med skärm-RAM som mål på `$0400`.

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

- **Versala tecken (standard, kryssruta avmarkerad):** Skriv det du vill se med versaler. `"HEJ"` visas som `HEJ`. Gemener mappas till versaler på skärmkoder.
- **Gemener teckenuppsättning (kryssruta markerad):** Skriv exakt det gemener/versaler du vill se. `"hej"` → gemener, `"HEJ"` → versaler. Kräver en teckenuppsättningsväxel vid körning innan skärmen skrivs (använd makrot **CHARSET gemener**).

**Genererad ASM (versaler, `"HEJ"`):**
```
    LDA #$08      ; 'H' screen code $08
    STA $0400
    LDA #$05      ; 'E' screen code $05
    STA $0401
    ...
```

**Expertsyntax:**
```
.text 0, 2, "HELLO"           ; uppercase charset (default)
.text 0, 2, "hello", lower    ; lowercase charset
```

Tecken kodas som **skärmkoder** (inte PETSCII). **Storlek:** `text.length × 5` byte (LDA + STA per tecken).

---

### STRING

Som att **POKEa en sträng** till valfri minnesadress vid körning. Genererar LDA/STA-par som kopierar varje teckens skärmkod till efterföljande adresser.

| Fält                      | Beskrivning                                                                 |
| ------------------------- | --------------------------------------------------------------------------- |
| Text                      | Strängen att skriva                                                         |
| Adress                    | Målminnesadress — `$C000` hexagon eller ett **etikettnamn**                 |
| Etikett (valfritt)        | Tilldelar en etikett som pekar mot måladressen                              |
| Flytta                    | Hexvärde (00–FF) läggs till varje skärmkodbyte (t.ex. `$80` = omvänd video) |
| Gemener teckenuppsättning | Kryssruta — samma semantik som TEXT (se avsnittet TEXT)                     |

**Expertsyntax:**
```
.string $C000, "HELLO"                  ; uppercase charset (default)
.string $C000, "hello", lower           ; lowercase charset
.string $C000, "HELLO", 80             ; with shift (reverse video)
.string $C000, "hello", 80, lower      ; shift + lowercase
.string $C000, "HELLO" :my_string      ; with macroLabel
```

**Genererad ASM:**
```
    LDA #$08      ; 'H' screen code
    STA $C000
    LDA #$05      ; 'E' screen code
    STA $C001
    ...
```

Tecken kodas som **skärmkoder** (inte PETSCII). Det valfria värdet **Shift** läggs till varje byte, t.ex. `$80` för omvänd video. **Storlek:** `text.length × 5` byte (en LDA + en STA per tecken).

---

### DATA

Som en **POKE-loop** — skriver en lista med råa byte till en minnesadress vid körning, ett LDA/STA-par per byte.

| Fält               | Beskrivning                                                 |
| ------------------ | ----------------------------------------------------------- |
| Byte               | Kommaavgränsade bytevärden                                  |
| Adress             | Målminnesadress — `$C000` hexagon eller ett **etikettnamn** |
| Etikett (valfritt) | Tilldelar en etikett som pekar mot måladressen              |

**Expertsyntax:**
```
.data $C000, $01, $02, $03          ; hex address
.data my_buf, $01, $02, $03         ; label address
.data $C000, $01, $02, $03 :mydata  ; with macroLabel
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

Liksom **DATA som laddas direkt i minnet** — ingen runtime-kod alls. Bytena finns från det ögonblick då PRG laddas, innan din kod ens startar. Använd detta för sprite-data, nivåkartor, uppslagstabeller, allt som bara behöver vara på en specifik adress.

| Fält               | Beskrivning                                                 |
| ------------------ | ----------------------------------------------------------- |
| Byte               | Kommaavgränsade bytevärden                                  |
| Adress             | Målminnesadress — `$C000` hexagon eller ett **etikettnamn** |
| Etikett (valfritt) | Tilldelar en etikett som pekar mot måladressen              |

**Expertsyntax:**
```
.rawbytes $C000, $00, $00, $00      ; hex address
.rawbytes sprite_data, $00, $00     ; label address
.rawbytes $0C50, $00, $00 :nev      ; with macroLabel — other code can use LDA nev,X
```

**Storlek i kod:** 0 byte. Data placeras på den angivna adressen i utdata.

> **DATA vs RAWBYTES:** DATA genererar LDA/STA-kod som kopierar byte vid körning (långsammare, men fungerar om data behöver vara dynamiska). RAWBYTES placerar bara bytena direkt — ingen kod, omedelbart, ingen kostnad.

---

### RAWTEXT

Som RAWBYTES men för text — kodar strängen som skärmkoder och placerar bytena på en fast adress utan **körningskod**. Texten är klar i minnet så fort PRG laddas.

| Fält                      | Beskrivning                                                                 |
| ------------------------- | --------------------------------------------------------------------------- |
| Text                      | Sträng att koda                                                             |
| Adress                    | Målminnesadress — `$C000` hexagon eller ett **etikettnamn**                 |
| Etikett (valfritt)        | Tilldelar en etikett som pekar mot måladressen                              |
| Flytta                    | Hexvärde (00–FF) läggs till varje skärmkodbyte (t.ex. `$80` = omvänd video) |
| Gemener teckenuppsättning | Kryssruta — samma semantik som TEXT (se avsnittet TEXT)                     |

**Expertsyntax:**
```
.rawtext $C000, "HELLO"                 ; uppercase charset (default)
.rawtext $C000, "hello", lower          ; lowercase charset
.rawtext $C000, "HELLO", 80            ; with shift (reverse video)
.rawtext $C000, "hello", 80, lower     ; shift + lowercase
.rawtext $0400, "HELLO" :my_text       ; with macroLabel
```

**Genererad ASM:**
```
; .rawtext "HELLO" -> $C000
; $C000
    .byte $08, $05, $0C, $0C, $0F   ; H E L L O (uppercase screen codes)

; .rawtext "hello", lower -> $C000
; $C000
    .byte $48, $45, $4C, $4C, $4F   ; h e l l o (lowercase screen codes $41–$5A range)
```

**Storlek i kod:** 0 byte. Data placeras på den angivna adressen i utdata.

> **STRING vs RAWTEXT:** STRING genererar LDA/STA-kod som kopierar texten vid körning. RAWTEXT bakar in byten i PRG vid laddningstid — ingen kod, ingen väntetid.

---

### PETSCII

Liksom **RAWBYTES men för KERNAL-utdata** — kodar strängen som PETSCII-byte (kompatibel med CHROUT vid `$FFD2`) och placerar dem på en fast adress utan runtime-kod. Använd detta när du vill skriva ut tecken via `JSR $FFD2` i en loop, och observera att det nya `PRINT`-makrot använder samma kodare och beteende för kryssrutor med gemener.

> **PETSCII vs skärmkoder:** PETSCII och skärmkoder är två olika kodningar. Skärmkod `$01` = bokstav A; PETSCII `$41` = bokstav A (via CHROUT). Använd endast PETSCII vid utskrift via KERNAL; använd TEXT/STRING/RAWTEXT för att skriva direkt till skärm-RAM.

| Fält                | Beskrivning                                                 |
| ------------------- | ----------------------------------------------------------- |
| Text                | Sträng att koda som PETSCII-byte                            |
| Adress              | Målminnesadress — `$C000` hexagon eller ett **etikettnamn** |
| Etikett (valfritt)  | Tilldelar en etikett som pekar mot måladressen              |
| PETSCII med gemener | Kryssruta — se nedan                                        |

**Teckenuppsättningslägen: **

| Läge                                | Stora bokstäver (`A`–`Z`)                                                                                                | Gemener (`a`–`z`)            |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------- |
| **Versaler (standard, avmarkerad)** | `$41`–`$5A` (PETSCII versaler via CHROUT)                                                                                | även mappad till `$41`–`$5A` |
| **Gemener (markerad)**              | Alfabetiska bokstäver mappas om så att det synliga skiftläget förblir konsekvent på teckenuppsättningen gemener/versaler | Samma regel                  |

**Expertsyntax:**
```
.petscii $C000, "HELLO"              ; uppercase PETSCII (default)
.petscii $C000, "hello", lower       ; lowercase PETSCII ($61–$7A)
.petscii $C000, "HELLO", null        ; with null terminator
.petscii $C000, "hello", lower, null ; lowercase + null terminator
.petscii $C000, "HELLO" :my_msg      ; with macroLabel
```

**Genererade byte (versaler, `"HEJ"`):**
```
; $C000
    .byte $48, $45, $4C, $4C, $4F   ; H E L L O (PETSCII $41–$5A range)
```

**Storlek i kod:** 0 byte. Data placeras på måladressen som en uppskjuten datasektion (som RAWBYTES).

**Nullterminator:** Markera kryssrutan *"Lägg till `$00` (nullterminator)"* för att automatiskt lägga till en `$00` byte efter texten. Idealisk för loopar med nollterminering:

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

**Kodningsregler:**

| Input                                       | Versalläge                         | Gemenerläge             |
| ------------------------------------------- | ---------------------------------- | ----------------------- |
| `A`–`Z`                                     | `41 dollar`–`5 dollarA`            | `61 dollar`–`7 dollar`  |
| `a`–`z`                                     | `$41`–`$5A` (tvångsskriven versal) | `41 dollar`–`5 dollarA` |
| Mellanslag, siffror, interpunktion (32–126) | som det är                         | som det är              |
| Ny rad                                      | `$0D` (RETUR)                      | `$0D`                   |
| Andra                                       | `20 dollar ` (mellanslag)          | `20 dollar`             |

> **Tips:** Använd PETSCII för data som ska matas ut via CHROUT (`$FFD2`). För att skriva direkt till skärmens RAM, använd STRING eller RAWTEXT istället.

---

### CHARSET

Växlar VIC-II-tecken-ROM:et mellan versaler/grafikläge (C64-standard) och gemener/versaler-läge genom att modifiera bit 1 av `$D018` vid körning.

| Fält | Beskrivning                                                                                                                                  |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Läge | **Gemener** — aktiverar teckenuppsättningen för gemener/versaler; **Versaler** — återställer standardteckenuppsättningen för versaler/grafik |

**Expertsyntax:**
```
.charset lower    ; switch to lowercase charset
.charset upper    ; switch back to uppercase/graphics charset
```

**Genererad ASM:**

Gemenerläge:
```
    LDA $D018
    ORA #$02      ; set bit 1 → lowercase/uppercase ROM at $1800
    STA $D018
```

Versalläge:
```
    LDA $D018
    AND #$FD      ; clear bit 1 → uppercase/graphics ROM at $1000
    STA $D018
```

**Storlek:** 8 byte (LDA abs + ORA/AND imm + STA abs).

**Varför ORA/AND istället för direktskrivning?** `$D018` styr även skärmens RAM-plats (bitar 7–4). Om endast bit 1 aktiveras bevaras resten av registret.

**Typiskt arbetsflöde:**

```
    CHARSET lower             ; switch to lowercase charset
    TEXT 0, 0, "hello world"  ; [checkbox: Lowercase charset]
    ...
    CHARSET upper             ; restore default when done
```

Eller i expertläge:
```
.charset lower
.text 0, 0, "hello world", lower
.charset upper
```

I expertläge går nu blocket `.charset` även igenom rullgardinsmenyn för lägen, så att blockförhandsgranskningen och den exporterade källan förblir justerade.

> **Obs:** Makrot CHARSET ändrar bara VIC-tecken-ROM-pekaren. Det anropar inte `$E544` (KERNAL-teckenuppsättningsinit). I de flesta fall är detta tillräckligt; anropa först `JSR $E544` endast om du behöver att KERNAL:s egna utskriftsrutiner respekterar ändringen.

---

### CHARDEF

Definierar ett enda 8×8 anpassat tecken i en RAM-baserad teckenuppsättning. Genererar inline-körningskod som kopierar 8 byte till `base + index * 8` vid körningstillfället — inget behov av en föregående etikett eller `ORG`.

| Fält        | Beskrivning                                                                                                     |
| ----------- | --------------------------------------------------------------------------------------------------------------- |
| Teckenbas   | Basadressen för RAM-teckenuppsättningen (standard `$3800`). Måste justeras så att VIC-II kan se den (se nedan). |
| Teckenindex | Vilken teckenplats som ska omdefinieras, 0–255. `65` = 'A' i standardskärmkodlayouten.                          |
| 8 byte      | Kommaavgränsade bitmappader, uppifrån och ned. Varje bytes bit 7 = pixel längst till vänster.                   |

**Expertsyntax:**
```
.chardef $3800, 65, $18,$3C,$66,$7E,$66,$66,$66,$00
```

**Genererad ASM (8 × `LDA #b` / `STA-mål+n`, totalt 40 byte):**
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

**Måladress:** `$3800 + 65 * 8 = $3A08`. Beräknad vid kompileringstillfället och hårdkodad i STA-operanderna.

**Storlek:** 40 byte per tecken (8 × 5).

**Typiskt arbetsflöde:**
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

**När ska man använda CHARDEF jämfört med alternativ:**

| Närma sig                             | Använd när                                                                                         |
| ------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **CHARDEF**                           | Du behöver några anpassade tecken (säg 1–20). Körtidskostnaden är 40 byte per tecken.              |
| **RAWBYTES @ $3800**                  | Du har en komplett anpassad teckenuppsättning (256 tecken). Totalt 2 KB data, ingen runtime-kopia. |
| **INCBIN "charset.bin" @ 3800 USD**   | Extern teckenuppsättningsfil (byggd av teckenredigeraren). Renaste alternativet.                   |
| **Teckenuppsättning Canvas + INCBIN** | Fullständig bitmapp med 256 tecken målad som en 128×128-bild.                                      |

> **Påminnelse om justering:** VIC-II förväntar sig att teckenuppsättningsbasen är en multipel av `$0800`. Giltiga banker: `$0000`, `$0800`, `$1000`, ... , `$3800` (inom den nuvarande 16 KB VIC-banken). RAM-teckenuppsättningar ligger vanligtvis på `$2000`, `$2800`, `$3000` eller `$3800`.

---

### BOX_HIT

Axis-aligned bounding-box (AABB) kollisionstest mellan två rektanglar beskrivna av 4-byte nollsidiga strukturer. Returnerar resultatet i ackumulatorn: **A = 1** vid överlappning, **A = 0** annars. Ren inline-assembling, inget subrutinanrop.

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

**Genererad ASM (30 byte, helt PC-relativ — ingen subrutin, inga absoluta hopp):**
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

**Storlek:** 30 byte.

**Typiskt arbetsflöde:**

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

**Begränsningar:**
- Båda nollsidiga adresserna måste vara `≤ $FC` (varje ruta behöver 4 på varandra följande byte: `zp`, `zp+1`, `zp+2`, `zp+3`).
- Koordinater behandlas som **unsigned 8-bit** (0–255). För signerade sprite-koordinater utanför detta intervall, normalisera innan lagring.
- De två rutorna kan överlappa varandra i ZP-utrymmet om så önskas, men vanligtvis vill man ha 8 distinkta byte.

**Varför inte en subrutin?** Inline-generering undviker JSR/RTS-overhead (14+ cykler) och håller testet aktivt i cachen för snäva spelloopar. Om du behöver testa många par, placera din egen `JSR box_hit_sub` runt ett enda BOX_HIT-block manuellt.

**Jämförelse med UB:s `box_hit()`-funktion:** Ultimate Basic använder samma 6502-logik som en runtime-funktion som returnerar till en variabel. I VA placerar du BOX_HIT inline där du behöver testet; resultatet är i `A`.

---

### INCBIN

Liksom **BLOAD i BASIC** — hämtar en extern binärfil (`.bin`, `.prg`, `.sid`, `.raw`) och bäddar in den direkt i den sammansatta PRG:n på den adress du anger.

| Fält   | Beskrivning                                                      |
| ------ | ---------------------------------------------------------------- |
| Fil    | Bläddra för att välja en `.bin`, `.prg`, `.sid` eller `.raw`-fil |
| Adress | Målinläsningsadress (t.ex. `$C000`)                              |

**Expertsyntax:**
```
.incbin "music.bin", $C000
```

**Genererad ASM-kommentar:**
```
    ; INCBIN "music.bin" @ $C000 (2048 bytes)
    .byte $01, $02, ...
```

**Storlek i kod:** 0 byte (uppskjuten datasektion). Binärfilen är inbäddad på den angivna adressen.

---

### SID

Liksom **BLOAD för musik** — laddar en `.sid`-fil i din PRG och läser automatiskt dess Init- och Play-adresser från headern. Anropa Init en gång vid uppstart, anropa sedan Play från din IRQ-hanterare varje bildruta.

| Fält                       | Beskrivning                                                                                                             |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Fil                        | Bläddra för att välja en `.sid`-fil                                                                                     |
| Anpassad adress (valfritt) | Åsidosätt SID:s ursprungliga laddningsadress (t.ex. `$1000`). Lämna tomt om du vill använda adressen från SID-rubriken. |

Blocket visar:
- **Titel / Författare** från SID-rubriken
- **Ladda adress** — där data placeras i minnet (effektiv adress efter eventuell override)
- **Init-adress** — anropa detta med JSR för att initiera musiken (justerat för omlokalisering om en anpassad adress används)
- **Spela upp adress** — anropa detta med JSR på varje ram i en IRQ-hanterare (justerat för omlokalisering)
- Ett **(flyttat)**-märke visas när en anpassad adress flyttar data från sin ursprungliga position

**Expertsyntax:**
```
.sid "Ikari_Warriors.sid"
.sid "Ikari_Warriors.sid", $1000
```

**Genererad ASM-kommentar:**
```
    ; SID "Ikari_Warriors.sid" @ $1000  Init:$1000  Play:$1006  (4096 bytes)
```

**Storlek i kod:** 0 byte inline. SID-binärfilen placeras på den angivna adressen som en uppskjuten del i PRG.

> **Viktigt:** De flesta SID-filer innehåller hårdkodade interna absoluta adresser. De kan bara flyttas om hela binärfilen förskjuts med samma offset. Om ett SID har interna hopp till `$10xx` måste det stå kvar på `$1000` — att flytta det till en annan adress kommer att bryta dessa interna referenser.

> **Typisk användning:** Placera ett ORG-block före SID-blocket för att ange dess adress. Anropa Init en gång vid start, anropa sedan Spela upp varje bildruta från en raster-IRQ-hanterare.

---

### INCLUDE

Liksom **MERGE i BASIC** — hämtar en annan fil och expanderar dess block inline på denna position. Perfekt för återanvändbara subrutinbibliotek. De inkluderade blocken är skrivskyddade i det aktuella projektet.

Två filtyper stöds:
- **Visual Assembler-projekt** (`.json`) — projektets block infogas som de är.
- **Plain assembly source** (`.inc`, `.asm`, `.s`) — filen läses som text och tolkas på samma sätt som i expertläge. Varje gång du kompilerar läses filen om från disken (santhetskälla = filen), så du kan redigera den externt med valfri editor.

| Fält                    | Beskrivning                                                                                                                                                                                                                                                           |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fil                     | Bläddra för att välja ett `.json`-projekt eller en `.inc`/`.asm`/`.s`-assemblagekälla                                                                                                                                                                                 |
| Ladda adress (valfritt) | Om satt (hex, t.ex. `C000`), placeras de inkluderade blocken på den adressen — en syntetisk `ORG` injiceras före dem, vilket åsidosätter alla ORG-block inuti den inkluderade filen. Lämna tomt för att låta den inkluderade filens egna ORG-block styra placeringen. |

**Syntax för expertläge:**
```
.include "library.json"
.include "macros.inc", $1500
.include "sprites.asm"
```

- Filändelsen ** krävs i expertläge ** — ett rent namn som `.include "macros"` behandlas som `.include "macros.json"`.
- Sökvägsupplösning: försöker först bredvid projektfilen (relativ), återgår sedan till appens medföljande katalog `samples/`.

**Genererad ASM (ingen adressöverstyrning):**
```
    ; .include "library.json" — 12 block(s)
    ... (expanded blocks follow)
```

**Genererad ASM (med laddningsadress `C000`):**
```
    ; .include "library.json" @ $C000 — 12 block(s)
    *=$C000
    ... (expanded blocks follow)
```

> **Tips:** Använd INCLUDE för att bygga återanvändbara subrutinbibliotek som du kan dela mellan projekt. `.inc`/`.asm`/`.s`-filer är bäst när du vill redigera biblioteket i en vanlig textredigerare eller dela det med andra 6502-assemblerare; `.json` när biblioteket är skapat i själva Visual Assembler. Ange en laddningsadress när biblioteket inte har någon egen ORG, eller när du vill åsidosätta dess standardplacering.

---

### TABLE

Liksom **DIM vid en specifik adress** — namnger en uppslagstabell och anger var den finns i minnet. Placera BYTE-, WORD- eller FILL-block efter den för att definiera tabellens innehåll.

| Fält   | Beskrivning                                     |
| ------ | ----------------------------------------------- |
| Namn   | Etikett-ID för tabellen (t.ex. `color_table`)   |
| Adress | Fast adress där tabellen börjar (t.ex. `$C000`) |

**Expertsyntax:**
```
.table color_table, $C000
```

**Genererad ASM:**
```
color_table:
```

Programräknaren hoppar till den angivna adressen. Placera BYTE/WORD/FILL-block efter TABLE för att fylla innehållet.

**Storlek:** 0 byte.

---

### ORG

Anger var i minnet programmet (eller en del av det) placeras — som att välja en startadress innan man skriver in maskinkod. Varje program behöver minst en ORG. Standard C64 BASIC-laddningsbar start är `$0801`.

| Fält      | Beskrivning                                                        |
| --------- | ------------------------------------------------------------------ |
| Adress    | Den nya ursprungsadressen (t.ex. `0801` i HEX, eller `2049` i DEC) |
| HEX / DEC | Växla adressinmatningen mellan hexadecimal och decimal visning     |

**Expertsyntax:**
```
* = $C000
```

**Genererad ASM:**
```
* = $C000
```

**Storlek:** 0 byte. Själva ORG-blocket genererar ingen maskinkod.

Varje ORG-block startar en ny sektion. Block som följer sätts ihop med början på den adressen. När du exporterar PRG:n slås alla sektioner samman till en fil – mellanrummen mellan sektionerna fylls med nollor.

**Exempel — kod vid `$0801`, datatabell vid `$C000`:**
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

> **Tips:** Varje program måste börja med ett ORG-block. Den typiska startadressen för ett C64 BASIC-laddningsbart program är `$0801` (2049 decimaler). När **BASIC SYS stub** är aktiverat lägger assemblern till en kort BASIC-rad vid `$0801` och din kod börjar vid `$080D`.

---

### LOOP / NEXT

Liksom **`FOR X=N TO 1 STEP -1 : ... : NEXT X`** i BASIC — räknar ner från N till 1 med hjälp av X- eller Y-registret. Släpp ett LOOP-block, placera dina instruktioner mellan det och NEXT, och det loopar automatiskt rätt antal gånger.

#### LOOP

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

#### NEXT

| Fält     | Beskrivning                            |
| -------- | -------------------------------------- |
| Register | Automatiskt matchad med LOOP-registret |
| Märka    | Automatiskt länkad till LOOP-etiketten |

**Expertsyntax:**
```
.next loop0
```

**Genererad ASM:**
```
    DEX
    BNE loop0
```

**Storlek:** 3 byte (DEX + BNE + förgreningsförskjutning).

**Exempel — rensa 10 skärmceller:**
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

Liksom **`FOR X=0 TO N-1 : ... : NEXT X`** i BASIC — räknar *upp* från 0. Perfekt när du behöver ett framåtriktat index, t.ex. stega igenom en sträng eller en array.

#### FOR

| Fält     | Beskrivning                                                                       |
| -------- | --------------------------------------------------------------------------------- |
| Register | `X` eller `Y` — räknarregistret                                                   |
| Räkna    | Loopgräns (hex eller decimal, t.ex. `$12` = 18). X/Y går från 0 upp till gräns-1. |
| Märka    | Automatiskt genererad loopetikett (t.ex. `för0`)                                  |

**Expertsyntax:**
```
.for X, $12, for0
```

**Genererad ASM:**
```
    LDX #$00
for0:
```

**Storlek:** 2 byte (LD_ opcode + `#$00`).

#### ENDF

| Fält     | Beskrivning                              |
| -------- | ---------------------------------------- |
| Register | Automatiskt matchad med FOR-registret    |
| Märka    | Automatiskt länkad till FOR-etiketten    |
| Räkna    | Kopieras automatiskt från den parade FOR |

**Expertsyntax:**
```
.endf for0
```

**Genererad ASM:**
```
    INX
    CPX #$12
    BNE for0
```

**Storlek:** 5 byte (IN_ + CP_ #imm + BNE-offset).

**Exempel — skriv ut en null-avslutad sträng:**
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

> **LOOP vs FOR:** LOOP räknar ner (N→1) — bra för fördröjningar, fyllningar, pixelloopar. FOR räknar upp (0→N) — bra för sträng-/arrayåtkomst. Båda kan använda X eller Y.

---

### PUSH / PULL

Som att ** spara variabler före en GOSUB och återställa dem efter ** — men använder 6502-hårdvarustacken. Om en subrutin använder A, X eller Y, omslut den med PUSH och PULL så att den anropande kodens register bevaras.

#### PUSH

Skjuter ett eller flera register till stacken. Ordningen är alltid A → X → Y (innerst först).

| Fält     | Beskrivning                                                          |
| -------- | -------------------------------------------------------------------- |
| Register | Vilken kombination som helst: `A`, `X`, `Y`, `AX`, `AY`, `XY`, `AXY` |

**Expertsyntax:**
```
.push AXY
```

**Genererad ASM (exempel: `AX`):**
```
    PHA
    TXA
    PHA
```

**Storlek:** 1 byte för A (`PHA`), 2 byte för X eller Y (överföring + push).

#### PULL

Återställer register från stacken i **omvänd ordning** (Y → X → A).

| Fält     | Beskrivning                                          |
| -------- | ---------------------------------------------------- |
| Register | Samma som PUSH — måste matcha motsvarande PUSH-block |

**Expertsyntax:**
```
.pull AXY
```

**Genererad ASM (exempel: `AX`):**
```
    PLA
    TAX
    PLA
```

> **Regel:** PUSH och PULL måste alltid använda **samma registeruppsättning**. `PUSH AX` → `PULL AX` (återställer internt i omvänd ordning: X först, sedan A).

---

### END / RTS-alias

Liksom **RTS med ett vänligare makronamn ** — `.end` avger en enda `RTS` byte och beter sig som en kort subrutinterminator i expertläge.

**Expertsyntax:**
```
.end
```

**Genererad ASM:**
```
    RTS
```

**Storlek:** 1 byte.

Använd detta när du vill ha en markör för slutet av en subrutin som liknar ett makro mer än en rå instruktion.

---

### MACRO / ENDM / INVOKE

Liksom **en namngiven GOSUB med parametrarna ** — definiera en återanvändbar kodbit en gång (MACRO…ENDM), och anropa den sedan var som helst med INVOKE. Skicka olika argumentvärden varje gång istället för att kopiera och klistra in block.

#### MAKRO (definitionsstart)

| Fält       | Beskrivning                                                              |
| ---------- | ------------------------------------------------------------------------ |
| Namn       | Identifierare för makrot (t.ex. `setColor`)                              |
| Parametrar | Valfria kommaseparerade parameternamn (t.ex. `färg` eller `färg, antal`) |

Markerar början på en makrodefinition. Block mellan MACRO och ENDM är makrots brödtext — de **genererar ingen kod ** där definitionen finns. Använd `{paramName}` som platshållare för argument.

**Genererad ASM:**
```
; .MACRO setColor (color)
    ... (body blocks)
; .ENDM
```

**Syntax för expertläge:**
```
.macro setColor color
    LDA {color}
    STA $D020
.endm
```

#### ENDM (definitionsslut)

Stänger den aktuella makrodefinitionen. Inga fält.

#### INVOKE

Anropar ett definierat makro på denna position och ersätter de angivna argumentvärdena med platshållarna `{paramName}` i brödtexten.

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

Makrots innehåll expanderas inline med `{paramName}` ersatt av de faktiska argumenten. Den mellanslagsavgränsade formen (`.invoke setColor #$07`) accepteras också.

**Argumenttyper:**
- **Numerisk**: `#$07`, `$10`, `255` — hex- eller decimalvärden
- **Textsträngar**: `"Hej världen!"` — citerade strängar; kommatecken inom citattecken behandlas som en del av texten, inte som argumentavgränsare
- **Blandat**: `#$07, "hej", $20` — valfri kombination

> **Tips:** Definiera makron högst upp (eller längst ner) i ditt program och ANROPA dem sedan där det behövs. Makron kan anropas flera gånger med olika argument.

---

### REGION / ENDREGION

Rent visuell gruppering — **noll byte**, noll effekt på den sammansatta koden. Som att vika ihop en del av ett BASIC-program till ett namngivet block så att du kan komprimera det och fokusera på något annat.

| Fält           | Beskrivning                                                              |
| -------------- | ------------------------------------------------------------------------ |
| Regionens namn | Fritextetikett för sektionen (t.ex. `init`, `game_loop`, `sprite_setup`) |

**Expertsyntax:**
```
.region init
    ; blocks...
.endregion
```

**Kontroller på REGION-blockrubriken (alltid synliga):**
- **▸ / ▾ växla ** — komprimerar eller expanderar hela regionen. När den är komprimerad döljs alla block mellan REGION och ENDREGION.
- **↕ Expandera alla** — återställer varje individuellt hopfällt block inom regionen och expanderar själva regionen om det behövs.
- **⦵ Välj i ASM** — markerar hela regionens kodintervall i ASM-vyn (från `; ===[namn]===` till `; ===[/namn]===`) och bläddrar till det. Växlar automatiskt till ASM-fliken om den inte är synlig för närvarande.
- **⧉ Kopiera region** — kopierar REGION-blocket, alla underblock och matchande ENDREGION till ett urklipp. En ✓-blixt bekräftar kopieringen.
- **⎘ Klistra in region** — infogar den kopierade regionen som en ny region direkt efter den aktuella regionens SLUTREGION och bläddrar till den. Knappen är nedtonad tills en region har kopierats.

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
4. Klicka på ▸ på REGIONEN för att komprimera hela avsnittet till en rad medan du arbetar med andra delar av programmet.

> **Obs: ** Regioner kan **kapslas** inuti varandra. Varje ENDREGION stänger närmaste öppna REGION. Ingen effekt på den sammanställda utdata.

---

### DEFINE / IF / ELSE / ENDIF

Precis som med en **-brytare läser assemblern ** — `DEFINE DEBUG` aktiverar en symbol, varpå valfritt `IF DEBUG`-block inkluderas och dess `ELSE`-gren hoppas över. Ta bort DEFINE-blocket så försvinner IF-blocket från utdata. Du behöver inte ta bort kod för versioner.

#### DEFINE

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

Ett `DEFINE`-block kan aktivera flera symboler samtidigt (kommaseparerade). Placera DEFINE-block högst upp i ditt program. Om du tar bort blocket inaktiveras alla dess symboler direkt.

#### IF

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

Block mellan `IF` och `ENDIF` (eller `ELSE`) inkluderas eller hoppas över baserat på om villkorssymbolen har en matchande `DEFINE` i programmet. Överhoppade block visas som `; [IF skipped] …` kommentarer och genererar **noll byte**.

#### ELSE

Inga fält. Markerar den alternativa grenen — monteras när villkoret `OM` är *inte* aktivt.

**Expertsyntax:**
```
.else
```

**Genererad ASM:**
```
; .ELSE
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

**Storlek:** 0 byte för alla fyra blocken. Endast innehållet *mellan* dem räknas.

**Exempel — felsöka kantlinjeflash, versionsversion hoppar över det:**
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

**Exempel — flera symboler i ett DEFINE-block:**
```
; .DEFINE DEBUG, PAL

; .IF PAL
    LDA #$xx        ; PAL timing constant
; .ELSE
    LDA #$xx        ; NTSC timing constant
; .ENDIF
```

Kapslade `IF`-block stöds. Om ett yttre block hoppas över hoppas även inre block över.

> **Obs:** Detta är hantering av villkor vid kompilering. För jämförelse/förgreningssockrar vid körning, se **Runtime IF / ELSE / ENDIF** nedan.

### .ASSERT

*(Nytt i 2.3.9.)* En **kontroll av sanitet vid kompilering**. `.assert` utvärderar ett uttryck vid assemblering; om det är falskt (`0`) stoppas bygget med ett tydligt fel som inkluderar det faktiska värdet. Om det är sant (inte noll) genererar det ingenting.

| Fält       | Beskrivning                                                                                                                                    |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Uttryck    | Valfritt assembleruttryck: etiketter, `CONST`s, `*` (programräknare), aritmetik och jämförelser (`&lt;`, `&lt;=`, `&gt;`, `&gt;=`, `==`, `!=`) |
| Meddelande | Valfri text tillagd till felmeddelandet                                                                                                        |

**Expertsyntax:**
```
.assert spriteData < $C000
.assert * < $A000
.assert end - start <= 256, "sprite table overflowed one page"
```

**Beteende:**

- **Storlek:** 0 byte.
- En falsk påstående avbryter sammansättningen: `` `.assert end - start &lt;= 256` är falskt (värde: 0). sprite-tabellen översvämmades en sida``
- En påstående som inte kan utvärderas (odefinierad etikett, etc.) misslyckas också, med * "kan inte utvärderas vid monteringstillfället"*.
- Jämförelser ger `1` / `0`; placera `.assert` var som helst i programflödet — den kontrolleras vid adressen den finns på, så `.assert * &lt; $D000` testar den aktuella utgångspositionen.

**Exempel — skydda ett spriteblock mot sidövergångar:**
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

Liksom **en namngiven variabel som aldrig ändras** — `SCREEN = $0400`. Använd namnet istället för att skriva råa adresser överallt, vilket gör koden lättare att läsa och ändra senare.

| Fält      | Beskrivning                                                                                                     |
| --------- | --------------------------------------------------------------------------------------------------------------- |
| Namn      | Identifierare för konstanten (t.ex. `SCREEN`)                                                                   |
| Värde     | Numeriskt värde i den valda basen (t.ex. `0400` i HEX = adress $0400), eller ett PC-relativt uttryck (se nedan) |
| Formatera | HEX eller DEC — styr hur värdet anges och visas                                                                 |

**Expertsyntax:**
```
.const SCREEN = $0400
.const FRAMES_1S = 60
```

**Genererad ASM:**
```
; .CONST SCREEN = $0400
```

Konstantens namn visas i rullgardinsmenyn **etikettväljaren** på instruktionsblock — klicka bara på det för att infoga.

**PC-relativa uttryck (`*+N` / `*-N`):**

Värdefältet accepterar även `*+N` eller `*-N`, där `*` är kompileringsadressen för själva CONST-blocket. Detta används för att skapa ett namngivet alias för en byte inuti en närliggande instruktion — det klassiska självmodifierande kodmönstret:

```
CONST op = *+1      ; op → address of the immediate operand of the next LDA
LDA #$00            ; $00 will be patched at runtime
...
STA op              ; overwrites the #$00 byte → LDA reads the new value next time
```

CONST avger 0 byte; etiketten omvandlas vid kompilering till `current_address + 1`.

**Aritmetiska uttryck:**

Värdefältet accepterar allmän aritmetik, inklusive referenser till tidigare definierade CONST-namn, hexadecimala/binära litteraler och inbyggda matematiska funktioner:

```
.const SCREEN      = $0400
.const SCREEN_END  = SCREEN + 40*25   ; 1000 bytes later
.const COLOR_RAM   = $D800
.const MID_X       = 160
.const SIN_TABLE   = round(sin(PI/8) * 127)   ; pre-computed sine value
```

**Inbyggda funktioner: ** `sin()`, `cos()`, `round()`, `max(a,b)`, `min(a,b)`, `abs()`, konstant `PI`

Operatorer: `+ - * /` Literaler: `$FF` (hex), `%10110000` (binär) Låg/hög byte: `lo(expr)`, `hi(expr)`

**Storlek:** 0 byte.

---

### VAR

Liksom **CONST, men automatiskt allokerad** — `VAR` reserverar nollsidig lagring för en etikett utan att du behöver skriva in adressen. Använd den för räknare, pekare och kortlivade tillstånd som hör hemma i ZP.

| Fält               | Beskrivning                                              |
| ------------------ | -------------------------------------------------------- |
| Namn               | Variabelnamn / etikett                                   |
| Storlek (valfritt) | Antal byte att reservera. Utelämnas för en enskild byte. |

**Expertsyntax:**
```
.var counter
.var timer, 2
.var lives
```

**Praktiskt exempel: **
```
.region Vars
.var counter
.var timer, 2
.endregion

LDA #$00
STA counter
```

**Genererad ASM:**
```
; .var counter
```

**Storlek: ** 1 byte som standard, eller `N` byte när storlek anges.

Allokatorn går med en konfigurerbar nollsidig markör (`$02` till `$FE`) och tilldelar nästa lediga plats. Om den begärda regionen överlappar en redan använd etikett, avger kompilatorn en varning.

---

### Körtid IF / ELSE / ENDIF

Precis som **en riktig grenmall** — den här versionen fungerar vid körning, inte kompileringstid. Den jämför `A`, `X` eller `Y` mot ett omedelbart värde och genererar den korrekta `CMP` / `CPX` / `CPY` + grensekvensen åt dig.

| Fält     | Beskrivning                                  |
| -------- | -------------------------------------------- |
| Register | `A`, `X` eller `Y`                           |
| Operatör | `==`, `!=`, `&lt;`, `&lt;=`, `&gt;`, `&gt;=` |
| Värde    | Omedelbart värde i HEX- eller DEC-format     |

**Expertsyntax:**
```
.if A == #$10
    LDA #$07
.else
    LDA #$0F
.endif
```

**Storlek:** Beror på de valda grenarna och jämförelseformuläret.

Jämförelsen är som standard osignerad. För `&lt;=` och `&gt;` expanderas makrot till den kortaste ekvivalenta grenkedjan för det valda registret.

---

### WHILE / ENDW

Liksom **en runtime-loop med ett test högst upp** — kroppen körs medan villkoret förblir sant.

| Fält     | Beskrivning                                  |
| -------- | -------------------------------------------- |
| Register | `A`, `X` eller `Y`                           |
| Operatör | `==`, `!=`, `&lt;`, `&lt;=`, `&gt;`, `&gt;=` |
| Värde    | Omedelbart värde i HEX- eller DEC-format     |

**Expertsyntax:**
```
.while A != #$00
    JSR getchar
.endw
```

**Storlek:** Beror på loopens kropp och jämförelseform.

Använd `WHILE` när loopen kan sluta innan den första iterationen är klar. Det är motsvarigheten under körning till den räknarbaserade `LOOP / NEXT`-hjälpen.

---

### REPEAT / UNTIL

Liksom **en runtime-loop med ett test längst ner** — kroppen körs alltid minst en gång, sedan avgör villkoret om den ska stoppas.

| Fält     | Beskrivning                                  |
| -------- | -------------------------------------------- |
| Register | `A`, `X` eller `Y`                           |
| Operatör | `==`, `!=`, `&lt;`, `&lt;=`, `&gt;`, `&gt;=` |
| Värde    | Omedelbart värde i HEX- eller DEC-format     |

**Expertsyntax:**
```
.repeat
    JSR getchar
.until A == #$00
```

**Storlek:** Beror på loopens kropp och jämförelseform.

Använd `REPEAT / UNTIL` när du vill att kroppen ska utföras minst en gång före utgångskontrollen.

---

### MEMCPY / MEMSET

Precis som **små minnesrutiner du ständigt söker efter ** — `MEMCPY` kopierar ett sammanhängande block, `MEMSET` fyller ett område med en byte.

| Makro    | Fält                         |
| -------- | ---------------------------- |
| `MEMCPY` | `källa`, `dst`, `storlek`    |
| `MEMSET` | `adress`, `värde`, `storlek` |

**Expertsyntax:**
```
.memcpy src=$C000, dst=$D000, size=$0100
.memset addr=$0400, value=#$20, size=$03E8
```

**Genererad ASM:** inline kopiering/fyllningsloopar, vald för att matcha den begärda storleken.

Storlekar upp till 256 byte använder en kort 8-bitarsloop. Större storlekar växlar automatiskt till en 16-bitarsräknare.

---

### PRINT / PRINT_CHAR / PRINT_HEX / CLEAR_SCREEN / WAIT_KEY / DELAY / SET_BORDER / SET_BG

#### PRINT

Liksom **PETSCII-utdata utan standardtexten ** — skriver ut en sträng genom `CHROUT` med samma hantering av versaler/gemener som PETSCII-blocket. Kryssrutan för gemener delas med PETSCII-kodaren, så textsökvägen förblir konsekvent.

**Expertsyntax:**
```
.print "HELLO"
.print "hello", lower
```

#### PRINT_CHAR

Skriver ut en PETSCII-byte med numerisk kod och skickar den via `CHROUT`. Värdet kan också vara en namngiven konstant eller etikett som omvandlas till en byte vid monteringstillfället, både i blockläge och expertläge.

**Expertsyntax:**
```
.print_char 65
.print_char $41
.print_char color
```

#### PRINT_HEX

Skriver ut ett 8-bitarsvärde som hexadecimal text via den vanliga KERNAL-utdatavägen.

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

#### WAIT_KEY

Väntar tills en tangent trycks ned, så att du inte behöver rulla `GETIN`-slingan för hand varje gång.

**Expertsyntax:**
```
.wait_key
```

#### DELAY

Väntar det begärda antalet bildrutiner genom en delad hjälprutin. Använd detta för korta pauser och tidsintervall när en fullständig anpassad loop skulle vara överdriven. Bildruteantalet kan vara ett rått tal eller en namngiven konstant, och `.wait` är bara ett alias för `.delay`.

**Expertsyntax:**
```
.delay 29
.wait 29
.delay frames=FRAMES_1S
```

I blockläge använder fördröjningsfältet en kompakt konstantväljare när ett symboliskt värde är tillgängligt, så att du inte behöver skriva namnet manuellt varje gång.

#### SET_BORDER / SET_BG

Bekvämlighetsomslag för VIC-II-färgregistren. Färgvärdet kan vara ett rått tal eller en namngiven konstant som upplöses till 0–15. Både blockläge och expertläge accepterar symboliska konstantnamn här.

**Expertsyntax:**
```
.set_border 6
.set_bg 0
.set_border color
.set_bg color
```

**Storlek:** Varje hjälpare expanderar till en liten registerskrivningssekvens eller ett kort KERNAL-anrop.

I blockläge använder dessa fält även const pickern, så det symboliska värdet förblir synligt istället för att ersättas av ett rått tal.

---

### IRQ_SETUP

Ställer in en raster-IRQ-hanterare i ett steg. Makrot skriver IRQ-vektorn, aktiverar raster-IRQ:er, ställer in linjen, inaktiverar de vanliga CIA IRQ-källorna och återgår till normal körning med `CLI`.

| Fält      | Beskrivning                                           |
| --------- | ----------------------------------------------------- |
| Hanterare | IRQ-rutinens etikett (t.ex. `my_irq`)                 |
| Raster    | Rasterlinje i hexadecimal eller decimal (t.ex. `$FA`) |

**Expertsyntax:**
```
.irq_setup handler=my_irq, raster=$FA
```

**Storlek:** En liten installationssekvens; den exakta längden beror på den valda rasterlinjen.

Använd detta när du vill ha den vanliga standardbeskrivningen "SEI / install handler / enable IRQ / CLI" utan att sprida den i programmet.

---

### RAND

Liksom ** returnerar en liten inbyggd PRNG** ett 8-bitars pseudoslumpmässigt värde från ett kompakt nollsidigt seed-värde.

| Fält   | Beskrivning                                              |
| ------ | -------------------------------------------------------- |
| Utsäde | Valfri nollsidig seedbyte eller etikett (standard `$FB`) |

**Expertsyntax:**
```
.rand
```

**Storlek:** Ett antal byte, beroende på vald implementeringsväg.

Generatorn är avsedd för spelupplägg, effektvariationer och snabb testdata. Den är avsiktligt liten snarare än kryptografiskt avancerad.

---

<a id="sprite_init"></a>
### SPRITE_INIT

Ställer in en VIC-II-sprite i ett block — istället för att skriva ~6 POKE-satser i BASIC, fyll bara i fälten. Ställer in spritens datapekare, slår på den, aktiverar valfritt flerfärgsläge och ställer in dess färg.

| Fält       | Beskrivning                                                   |
| ---------- | ------------------------------------------------------------- |
| Sprite #   | Spritenummer 0–7                                              |
| Färg       | Färgindex 0–15 (C64-palett)                                   |
| Datasida   | Sprite-dataadress / 64 (t.ex. `$21` om data finns på `$0840`) |
| Flerfärgad | Växlar spritens flerfärgade bit (`$D01C`)                     |

**Expertsyntax:**
```
.sprite_init 0, 7, $21
.sprite_init 0, 7, $21, multicolor
.sprite_init 0, 7, $21, mono
```

**Genererad ASM:**
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

**Storlek:** 26 byte.

> **Sprite-datasida:** `dataadress ÷ 64`. Med standard BASIC SYS-stub placerar `ALIGN 64` efter `JMP main` sprite-data vid `$0840` → sida = `$21`.

---

<a id="sprite_pos"></a>
### SPRITE_POS

Liksom **`POKE 53248, x : POKE 53249, y`** i BASIC — anger en sprites startposition. Koordinaterna bakas in vid monteringstillfället, och fälten accepterar konstanter i blockläge; för animering, använd `INC`/`DEC` direkt på spritregistret.

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
    LDA #$98        ; X low byte
    STA $D000       ; sprite 0 X register
    LDA $D010
    AND #$FE        ; clear X MSB for sprite 0 (X ≤ 255)
    STA $D010
    LDA #$64        ; Y = 100
    STA $D001       ; sprite 0 Y register
```

För X > 255 sätter makrot motsvarande bit i `$D010` istället för att nollställa den.

**Storlek:** 18 byte.

> **Obs:** `SPRITE_POS` bakar in X/Y i koden (`LDA #$xx`). För att animera en sprite vid körning, använd `INC $D000` / `DEC $D000` — se exemplet `sprite-macro-demo`.

---

<a id="wait_raster"></a>
### WAIT_RASTER

Väntar på att VIC-II-elektronstrålen ska nå en specifik skanningslinje – som att synkronisera med en TV-bildruta. Placera detta högst upp i din spelloop för att förhindra sprite-tearing. Ingen JSR, ingen etikett behövs.

| Fält        | Beskrivning                                       |
| ----------- | ------------------------------------------------- |
| Rasterlinje | Målrasterlinje i hexagonal (t.ex. `FF` = rad 255) |

**Expertsyntax:**
```
.wait_raster $FF
```

**Genererad ASM:**
```
wait:
    LDA $D012       ; current raster line
    CMP #$FF        ; target line
    BNE wait        ; loop back (-7 bytes)
```

**Storlek:** 7 byte (`BNE`-offsetet `$F9` = −7 pekar alltid tillbaka till `LDA`).

> **Tips:** Placera `WAIT_RASTER` högst upp i din spelloop för att synkronisera med skärmen och förhindra sprite-tearing.

---

### JOYSTICK

Som att läsa **`PEEK($DC00)`** och sedan POKE:a spritens position — men i ett block. Läser en CIA-joystickport och justerar en sprites X/Y-register därefter. Helt inline, ingen JSR behövs.

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

**Joystickbitmapp (aktiv-LOW — bit = 0 betyder nedtryckt):**

| Bit | Riktning | CIA-register                    |
| --- | -------- | ------------------------------- |
| 0   | Upp      | $DC00 (port 2) / $DC01 (port 1) |
| 1   | Ner      |                                 |
| 2   | Vänster  |                                 |
| 3   | Rätt     |                                 |
| 4   | Brand    | (hanteras inte av detta makro)  |

**Storlek:** 27 byte. `BCS`-offsetet är alltid `+3` (hoppar över följande 3-byte `DEC`/`INC abs`-instruktion).

> **Typisk användning:** Placera inuti en `gameloop`-etikett med `WAIT_RASTER` först:
> ```
> gameloop:
>     WAIT_RASTER ($FF)
>     JOYSTICK (port=2, sprite=0)
>     JMP gameloop
> ```

---

<a id="mouse"></a>
### MOUSE

Läser en Commodore 1351 proportionell mus och flyttar en sprite. Helt **inline** — ingen JSR eller etikett behövs. Makrot väljer CIA-porten, väntar på att SID-paddelns ingångar ska stabiliseras, avkodar sedan deltarörelsen med hjälp av standard 1351-drivrutinsmönstret och tillämpar det på spriteregistren.

| Fält      | Beskrivning                                                               |
| --------- | ------------------------------------------------------------------------- |
| Hamn      | `1` = CIA `$DC00` bitar `7:6` = `%01`; `2` = `%10`                        |
| Sprite #  | Spritenummer 0–7                                                          |
| ZP-byte X | Nollsidig adress (hex) för att lagra föregående POTX-prov (t.ex. `FD`)    |
| ZP-byte Y | Nollsidig adress (hex) för att lagra föregående POTY-exempel (t.ex. `FE`) |

**Genererad ASM-form (port 1, sprite 0, ZP `$FD`/`$FE`):**

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

**Storlek:** 142 byte.

**Syntax för expertläge:**
```
.mouse port, spriteNum, zpX, zpY
; example:
.mouse 2, 0, FD, FE
```

> **Viktigt:** Innan det första anropet, initiera noll-sidesbyten med de aktuella POTX/POTY-värdena för att undvika ett hopp på den första ramen:
> ```
>     ; port 1: LDA $DC00 : AND #$3F : ORA #$40 : STA $DC00
>     ; port 2: LDA $DC00 : AND #$3F : ORA #$80 : STA $DC00
>     LDA $D419 : LSR A : AND #$3F : STA $FD
>     LDA $D41A : LSR A : AND #$3F : STA $FE
> ```

> **Tips:** Polla musen en gång per bildruta — placera `WAIT_RASTER` i spelloopen före `MOUSE`.

---

<a id="sprite_col"></a>
### SPRITE_COL

Liksom **`PEEK($D01E)`** i BASIC — kontrollerar VIC-II hårdvarukollisionsregister och talar om för dig om en sprite träffar en annan sprite eller bakgrunden. Helt inline, ingen JSR behövs.

| Fält          | Beskrivning                                                                                                        |
| ------------- | ------------------------------------------------------------------------------------------------------------------ |
| Sprite #      | Sprite nummer 0–7 (vilken spritebit ska kontrolleras)                                                              |
| Kollisionstyp | `Sprite-Sprite ($D01E)` — kollision med en annan sprite; `Sprite-Bakgrund ($D01F)` — kollision med bakgrundsgrafik |

**Expertsyntax:**
```
.sprite_col 0, sprite
.sprite_col 0, background
```

**Genererad ASM (sprite 0, sprite–sprite):**
```
    LDA $D01E       ; read sprite-sprite collision register (clears it!)
    AND #$01        ; isolate bit 0 (sprite 0)
                    ; A ≠ 0 → collision occurred
```

**Storlek:** 5 byte.

> **Viktigt:** Avläsning av `$D01E`/`$D01F` **rensar registret**. Läs det en gång per bildruta och agera omedelbart på resultatet med `BEQ`/`BNE`.

**Typisk användning:**
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

> **Se även:** `kollisionsdemo` exempel — grön boll (sprite #0) vs. rött kors (sprite #1).

---

### LOADFILE

Liksom **`LOAD "fil",8`** i BASIC — laddar en fil från en D64-disk vid körning med hjälp av KERNAL LOAD-rutinen. Använd detta för att ladda data, musik eller extra kod från disken medan ditt program körs.

| Fält                        | Beskrivning                                                                                                                                                                                         |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Filnamn                     | Filnamn på disken (max 16 tecken, automatisk versaler; tecknen `,`, `"`, `/`, `\`, `:`, `*`, `?`, `&lt;`, `&gt;`, `|` filtreras)                                                                    |
| Anordning                   | Enhetsnummer 8–30 (standard `8`)                                                                                                                                                                    |
| Åsidosätt adress (valfritt) | Hexadecimal laddningsadress (t.ex. `C000`). Om angiven laddas filen till denna adress (`sec=0`, utan att PRG-rubriken används). Lämna tomt för att använda filens egen 2-byte PRG-rubrik (`sec=1`). |
| Feletikett (valfritt)       | Om den är satt genereras en `BCS`-instruktion efter JSR LOAD. Om KERNAL returnerar med carry satt (fel), hoppar exekveringen till denna etikett.                                                    |

**Expertsyntax:**
```
.loadfile "DEMO-COLORS", 8
.loadfile "DEMO-COLORS", 8, $C000
.loadfile "DEMO-COLORS", 8, $C000, error_label
```

**Genererad kodstruktur:**
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

**Storlek:** `3 + filnamnslängd + 9 (SETNAM) + 9 (SETLFS) + (4 om åsidosättning) + 5 (LADDA) + (2 om feletikett)` byte. Minst 27 byte.

> **Viktigt:** Filnamnet lagras inbäddat i maskinkoden direkt efter en `JMP skip_filename`. Filnamnet på disken måste vara PETSCII i versaler — vilket matchar vanliga ASCII-versaler (`A`–`Z`). Makrot framtvingar detta automatiskt.

> **Använd alltid en feletikett** för produktionsprogram — om filen inte hittas sätter KERNAL flaggan "carry" och körningen går vidare till nästa steg.

> **Se även:** `loadfile-demo` exempel — demonstrerar laddning av `DEMO-COLORS.PRG` från en D64 med en BCS-felgren och en visuell felskärm.

---

### EXODECRUNCH

Inbyggd **Exomizer-dekomprimering**. Använd detta makro direkt efter en `LOADFILE` som laddade en komprimerad ström i Exomizer-läge `mem` — EXODECRUNCH packar upp den bakåt till adressen som är inbäddad i strömmen.

| Fält              | Beskrivning                                                                                     |
| ----------------- | ----------------------------------------------------------------------------------------------- |
| Avpackningsadress | Där depacker-koden finns i minnet (standard `B000`). Måste vara en 16-bitars hexadecimaladress. |

**Expertsyntax:**
```
.exodecrunch
.exodecrunch depacker=$B000
```

**Genererad kod (19 byte):**
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

**Hur det fungerar:**

1. KERNAL `LOAD` ($FFD5) uppdaterar ZP `$AE/$AF` för att peka ett efter den senast laddade byten. EXODECRUNCH kopierar detta till ZP `$04/$05`, vilket är den officiella Exomizer-konventionen för bakåtriktad source-end.
2. Avpackaren placeras vanligtvis vid `$B000` (inom den mappade regionen för BASIC ROM). Makrot växlar mellan `$01 och $36` så att processorn ser RAM-minnet där under JSR och sedan återställer `$01 och $37` efteråt.
3. Dekomprimeringsmåladressen **kodas in i själva den komprimerade strömmen** när du komprimerar med `exomizer mem -l <load> file,<target>` — depackern läser den från strömmens första byte.

**Depacker binärfil:** Den förbyggda bakåtriktade depackern är `samples/exo-decrunch.bin` (477 byte, ORG $B000). Det är en Kick Assembler-wrap av den officiella `exodecrunch.asm` med `INC $D020` tillagd till varje läsning för en synlig kantblixteffekt under dekomprimering. Placera den i ditt program med ett `INCBIN`-block vid depackeradressen.

**Säkerhetsoffsetkompensation:** Exomizers standardminnesläge tillämpar en 2-byte säkerhetsoffset — data landar 2 byte tidigare än det begärda målet. Dialogrutan Kör via D64 ** lägger automatiskt till 2 i Dst-fältet ** innan exomizer anropas, så att det synliga beteendet matchar den adress du skrev.

> **Se även:** `exo-multicolor-demo`-exemplet — ett fullständigt exempel från början till slut: LOADFILE en komprimerad flerfärgad bitmapp till $C000, EXODECRUNCH packar upp den till $2000, kopierar sedan skärm → $0400 och färg → $D800, och växlar VIC-II till flerfärgad bitmappsläge.

> **Integrationstest:** `cargo test --test exomizer_integration` (i `src-tauri/`) verifierar den fullständiga komprimerings- + dekomprimeringsreturen på en 6502-emulator med den riktiga depacker-binärfilen. Godkända kriterier: 10000 byte byte-lika med källkoden `multi-color.bin`.

---

### REU_CHECK

Detekterar om en Commodore RAM-expansionsenhet (REU) är inkopplad — som att kontrollera `PEEK($D010)` för att se om hårdvara finns. Testar genom att skriva och läsa tillbaka två mönster till REU-registret `$DF04`.

| Fält  | Beskrivning    |
| ----- | -------------- |
| Ingen | Inga operander |

**Genererad kod (34 byte):**
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
> Makrot normaliserar resultatet så att följande gren förblir enkel: `BNE` betyder att REU finns, `BEQ` betyder att REU saknas.

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
BEQ no_reu        ; skip if REU not present
; ... REU code here ...
no_reu:
```

---

### REU_STASH / REU_FETCH / REU_SWAP

DMA-blocköverföring mellan C64 RAM och REU-expansionsminne — som en mycket snabb POKE-slinga, men processorn utför inget arbete (REU-chippet kopierar data medan processorn är stoppad). En överföring på `$1000`-byte är i praktiken omedelbar.

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
.reu_stash $C000, $0000, 0, $1000
.reu_fetch $C000, $0000, 0, $1000
.reu_swap $C000, $0000, 0, $1000
```

**Genererad kod (40 byte):**
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

> **Obs:**-kommandon använder `$90/$91/$92` (bit 4 satt = omedelbart DMA-läge). Skrivning till `$DF01` startar överföringen; processorn återupptar när den är klar.

---

### TURBO_SET

Ställer in CPU-hastigheten **Ultimate-64 (U64)** via register `$D031`. Ingen effekt på en riktig C64 eller andra emulatorer.

**Fält:**

| Fält        | Beskrivning              | Räckvidd                                         |
| ----------- | ------------------------ | ------------------------------------------------ |
| Hastighet   | CPU-hastighetsindex      | 0 = 1 MHz … 7 ≈ 10 MHz … 15 ≈ 48 MHz             |
| Dålig linje | Emulering av dålig linje | Aktiverad (C64-kompatibel) / Inaktiverad (turbo) |

Hastighetsbyten beräknas som: `(speedIndex &amp; 0x0F) | (badline_disabled ? 0x80 : 0x00)`.

**Genererad kod (5 byte):**
```
A9 xx   LDA #speed_byte
8D 31 D0   STA $D031
```

**Syntax för expertläge:**
```
.turbo_set 7,0    ; speed=7 (~10 MHz), badline enabled
.turbo_set 15,1   ; speed=15 (~48 MHz), badline disabled
```

> **Obs:** Detta makro påverkar endast U64-hårdvara. På en riktig C64 eller andra emulatorer skriver detta till `$D031` vilket kan påverka CIA eller ignoreras.

---

### SUPERCPU_DETECT

Kontrollerar om en **CMD SuperCPU**-accelerator är installerad — som `PEEK($D0B8)` för att se om den returnerar något annat än `$FF`.

**Genererad kod (5 byte):**
```
AD B8 D0   LDA $D0B8
C9 FF      CMP #$FF
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
BEQ no_scpu       ; skip if SuperCPU not present
; ... SuperCPU turbo code here ...
no_scpu:
```

---

### TURBO_ENABLE

Slår på eller av **CMD SuperCPU turboläge**. Anropa `SUPERCPU_DETECT` först och hoppa över detta om SuperCPU inte finns.

| Läge       | Register | Effekt                                        |
| ---------- | -------- | --------------------------------------------- |
| Aktivera   | `$D07A`  | Aktivera turbo (upp till 20 MHz med SuperCPU) |
| Inaktivera | `$D07B`  | Återgå till 1 MHz-kompatibilitetsläge         |

**Genererad kod (5 byte):**
```
A9 00         LDA #$00
8D 7A D0      STA $D07A    ; (or $D07B for disable)
```

**Syntax för expertläge:**
```
.turbo_enable on
.turbo_enable off
```

> **Obs:** Anropa `SUPERCPU_DETECT` först och förgrena dig runt detta makro om SuperCPU:n inte finns.

---

<a id="map_copy"></a>
### MAP_COPY

Kopierar en tilemapp från en källadress till skärmens RAM (och eventuellt färg-RAM) med hjälp av en serie `LDA abs,X` / `STA abs,X`-loopar. En sida på 256 byte kopieras per loopiteration; en ofullständig sida i slutet använder `CPX #rem / BNE` för att stoppa. Ingen JSR behövs — all kod genereras inline.

| Fält                  | Beskrivning                                                                                                                                              |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Källadress (skärm)    | Hexadress där kartdata finns efter inläsning (t.ex. `C000`)                                                                                              |
| Skärm-RAM-destination | Vart skärmkoder ska kopieras (t.ex. `0400`)                                                                                                              |
| Storlek (byte)        | Totalt antal byte att kopiera — vanligtvis `$03E8` = 1000 (40×25 tecken)                                                                                 |
| Kombinerad .bin       | När markerad förväntas skärmkoder omedelbart följt av färgdata vid `källa + storlek`; kopierar färgdata till **Färg-RAM-destination** i en andra omgång. |
| Färg-RAM-destination  | Mål för färgdata — standard `D800` (C64 färg-RAM)                                                                                                        |

**Genererad ASM (1000-byte-karta, endast skärm):**
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

**Storlek:** `2 (LDX) + hela sidor×9 + (rest &gt; 0 ? 11 : 0)` byte per sektion. Kombinerat läge fördubblar det (skärmsektion + identisk färgsektion).

**Parning med kartredigeraren: **

Kartredigerarens **Filer → Spara karta + färg-RAM (.bin)** exporterar en enda binärfil där de första `storlek` bytena är skärmkoder och nästa `storlek` byte är färg-RAM-värden. Använd MAP_COPY med **Kombinerad .bin** markerad och peka **Källadress** där filen laddas (t.ex. via INCBIN vid `$C000`):

```
* = $C000
    INCBIN "map-color.bin" @ $C000   ; screen codes $C000–$C3E7, color $C3E8–$C7CF
* = $0801
    ; ...
    MAP_COPY src=$C000 dst=$0400 size=1000 combined color_dst=$D800
```

**Syntax för expertläge:**
```
.map_copy $C000, $0400, 1000               ; screen only
.map_copy $C000, $0400, 1000, auto, $D800  ; combined (color at src+size)
.map_copy $C000, $0400, 1000, $C3E8, $D800 ; explicit color source address
```

---

<a id="map_copy16x16"></a>
### MAP_COPY16X16

Kopierar ett 16×16 teckenområde från ett kompakt 256-byte skärmkodblock plus ett matchande 256-byte färg-RAM-block. Det är avsett för export av teckenuppsättning Canvas och små kakel-/bildblock, där det skulle vara bullrigt att skriva sexton separata MAP_COPY-rader.

**Standardlayout:**

| Data                  | Standardadress            |
| --------------------- | ------------------------- |
| 16×16 skärmkoder      | Källadress (`källa`)      |
| 16×16 färgvärden      | `källa + 256`             |
| Skärm-RAM-destination | `$0400 + rad×40 + kolumn` |
| Färg-RAM-destination  | `$D800 + rad×40 + kolumn` |

**Syntax för expertläge:**
```
.map_copy16x16 $3000, 12, 4
.map_copy16x16 $3000, 12, 4, $0400, $3100, $D800
```

Den korta formen kopierar skärmbyte från `$3000`, färgbyte från `$3100` och placerar 16×16-blocket i kolumn 12, rad 4. Giltiga positioner längst upp till vänster är `col = 0..24` och `row = 0..9`, så hela 16×16-området finns kvar på 40×25 C64-textskärmen.

**Genererat beteende:**

- Genererar sexton inline-radkopior.
- Varje rad kopierar 16 skärmbyte och 16 färgbyte.
- Ingen JSR behövs; koden genereras direkt vid makropositionen.
- Fungerar med normalt teckenläge och flerfärgsteckenläge; färg-RAM-bytena bär varje cells teckenfärgs-/flerfärgsaktiveringsbit.

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
loop:
    JMP loop

.incbin "16x16+ram+color.bin", $3000
.incbin "16x16+charset.bin", $2000
```

---

<a id="sprite_anim"></a>
### SPRITE_ANIM

Flyttar fram en sprites animationsbildruta vid varje anrop och uppdaterar VIC-II-spritedatapekaren. Lagra en byte per bildruta i en tabell (spritedatasidnumret = `data_address / 64`), peka SPRITE_ANIM mot den och anropa den en gång per spelbildruta — ingen JSR behövs.

| Fält                 | Beskrivning                                                                              |
| -------------------- | ---------------------------------------------------------------------------------------- |
| Sprite #             | Spritenummer 0–7                                                                         |
| Adress till ramlista | Hexadress för ramtabellen — en byte per ram, varje byte = sprite-sida (`data_addr / 64`) |
| Antal bildrutor      | Totalt antal bildrutor (1–255)                                                           |
| Ram ZP               | Noll-sidbyte som används som bildräknare (t.ex. `FB`)                                    |

**Genererad ASM (sprite 0, 4 bildrutor, ZP `$FB`, lista vid `$C100`):**
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

**Storlek:** 19 byte.

**Typisk användning:**
```
frameTable:
    .byte $21, $22, $23, $24   ; 4 frames at $0840, $0880, $08C0, $0900

gameloop:
    WAIT_RASTER ($FF)
    SPRITE_ANIM (sprite=0, list=$C100, count=4, zp=$FB)
    JMP gameloop
```

**Syntax för expertläge:**
```
.sprite_anim spriteNum, frameListAddr, frameCount, zpByte
; example:
.sprite_anim 0, C100, 4, FB
```

> **Tips:** Placera ramtabellen som ett RAWBYTES-block på en fast adress. Räknarens ZP-byte (`$FB`) måste initieras till `$00` före det första anropet. Om din kod använder `$FB` till något annat, välj en ledig ZP-plats.

---

<a id="score_bcd"></a>
### SCORE_BCD

Lägger till ett fast punktvärde till en BCD-poäng på flera byte som lagras i minnet och återger sedan varje siffra till skärmens RAM-minne som ett skärmkodstecken. Använder decimalläget 6502 (`SED`/`CLD`) för bärsäker BCD-aritmetik — ingen manuell bärjonglering behövs.

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

**Storlek:** `3 + siffror×8` byte (SED + CLC + CLD-overhead + 8 byte per BCD-byte för ADC + displayloop).

**Syntax för expertläge:**
```
.score_bcd $C200, 4, 100, $0400
```

> **Tips:** Initiera poängbyten till `$00` vid start. Poängadressen ska vara i noll-sid- eller absolut-RAM — inte ROM. Skärmadressen ska peka på siffercellen längst till vänster; siffror skrivs från vänster till höger (mest signifikanta byte först).

> **BCD-intervall: ** `siffror=4` byte → 8 decimalsiffror → maxpoäng 99 999 999. Varje byte kodar två BCD-siffror: `$00`–`$99`.

---

## 10. Felsökningsintegration

Appen stöder **RetroDebugger** som extern C64-felsökare. Den tar emot brytpunkter, symboler och autostartflaggor som genereras från det sammansatta programmet.

### RetroDebugger

[RetroDebugger](https://github.com/slajerek/RetroDebugger) är en plattformsoberoende Commodore 64-felsökare med stöd för brytpunkter, minnesinspektion och etikettmedveten demontering.

**Inställningar:** Öppna **Inställningar → Konfigurera den körbara filen RetroDebugger** och peka den till binärfilen `RetroDebugger`.

**Starta:** Klicka på **Felsök (RetroDebugger)** i verktygsfältet. Appen kommer att:

1. Assemblera programmet till en `.prg`-fil i en temporär katalog.
2. Skriv en **breakpoints-fil** (`breakpoints.txt`) — en `break $ADDR` per flaggat block.
3. Skriv en **symbols-fil** (`symbols.txt`) i Vice/RetroDebugger-etikettformat (`al C:addr .name`). Alla LABEL- och CONST-block ingår.
4. Skriv även sidovagnar i C64Debugger-stil bredvid den kompilerade PRG: `.dbg`, `.sym` och `.vs`.
5. Starta RetroDebugger med:
   ```
   RetroDebugger -prg <file.prg> -breakpoints <breakpoints.txt> -symbols <symbols.txt> [flags]
   ```

### Brytpunktsblock

Klicka på brytpunktsikonen (●) på valfritt instruktionsblock för att växla mellan att vara en brytpunkt. Brytpunktsblock markeras med rött. Deras adresser skrivs till brytpunktsfilen varje gång felsökaren startas.

### Felsökarflaggor (fliken Alternativ)

| Växla           | Flagga        | Effekt                                                                       |
| --------------- | ------------- | ---------------------------------------------------------------------------- |
| `-jmp` PÅ       | `-jmp $ADDR`  | Hoppa direkt till programmets startadress efter laddning                     |
| `-återuppta` PÅ | `-återuppta`  | Avbryt pausningen av felsökaren omedelbart vid laddning                      |
| `-vänta` PÅ     | `-vänta <ms>` | Vänta `<ms>` millisekunder innan du återupptar pausen — 500 ms eller 1000 ms |

> **Tips:** För de flesta program, aktivera `-jmp` och `-återuppta` för omedelbar autostart. Använd `-vänta 500` eller `-vänta 1000` när ditt program konfigurerar IRQ:er eller SID-musik som behöver tid att initieras innan den första rastret.

---

## 11. Länkar till kunskapsbasen

Snabblänkar finns i appen under **Kunskapsbas**:

| Resurs                | URL                                            |
| --------------------- | ---------------------------------------------- |
| 6502 Opkoder Referens | http://www.6502.org/tutorials/6502opcodes.html |
| C64 KERNAL-funktioner | https://sta.c64.org/cbm64krnfunc.html          |
| C64 Minneskarta       | https://sta.c64.org/cbm64mem.html              |
| C64 Färgkoder         | https://sta.c64.org/cbm64col.html              |
| VIC-II-artikel        | https://www.cebix.net/VIC-Article.txt          |
| C64-kodbas            | https://codebase.c64.org/                      |
| Turbomonteraren       | https://turbo.style64.org/                     |
| RetroDebugger         | https://github.com/slajerek/RetroDebugger/     |

---

## 12. D64 Exportera och kör

Version 1.5.1 lägger till möjligheten att paketera ditt program (och ytterligare datafiler) till en C64 D64-diskavbildning och starta den i VICE — eller exportera diskavbildningen för användning någon annanstans.

### Delad körning-knapp

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

Det valda läget sparas mellan sessionerna.

### Dialogrutan Exportera till D64

Öppna via rullgardinsmenyn **Spara PRG ▾** → **Exportera till D64**. Dialogrutan låter dig:

1. Ställ in **disknamn** (max 16 tecken) och **programnamn** — det här är namnen som visas i C64-diskkatalogen.
2. **Lägg till extra filer** — klicka på **+** för att välja valfri binärfil (`.prg`, `.bin`, `.sid`, etc.). För varje extra fil:
   - **Namn** — hur det visas i D64-katalogen (max 16 tecken, automatisk versaler).
   - **Addr** (ladda adress, valfritt) — om angivet, läggs en 2-byte PRG-rubrik till. Lämna tomt för att skriva råa byte utan rubrik.
   - **Dst** (dekomprimeringsmål, endast med EXO) — där depackaren ska landa data på C64. När EXO är aktiverat komprimeras extradata med `exomizer mem -l <Addr> file,<Dst>` innan det skrivs till D64. +2 säkerhetskompensation tillämpas automatiskt.
   - **EXO** — kryssruta som aktiverar bakåtriktad `mem`-bearbetning för den här posten. Storleken på disken är vanligtvis 5–20 % av originalet.
3. Klicka på **Exportera** för att generera `.d64`-filen med VICE:s `c1541`-verktyg.

**Parning med EXODECRUNCH:** när du skickar en fil med EXO=on, ska programmet som läser den LADDA den till **Addr**-adressen (sec=1, filens egen PRG-rubrik), och sedan anropa makrot **EXODECRUNCH** för att packa upp det bakåt till **Dst**. Se exemplet `exo-multicolor-demo` för det kompletta mönstret.

### D64-metadata i projekt

Disknamnet, programnamnet och listan över extra filer sparas i projektets JSON (under nyckeln `d64`). När du laddar om projektet eller ett exempel som innehåller D64-metadata återställs extrafilerna automatiskt – du behöver inte lägga till dem varje gång.

Exemplet **loadfile-demo** levereras förkonfigurerat med `DEMO-COLORS.PRG` som en extra fil. Markera den, öppna **Kör via D64** och klicka på **Kör** för att se hela laddningsflödet i aktion.

> **Krav:** Både D64-export och körning via D64 kräver att VICE (`c1541`) konfigureras i [Maskinvaruinställningar](#13-hardware-settings).

### D64 Editor (bläddra bland och redigera en befintlig diskavbildning)

Verktygsfältsikonen efter kurvredigeraren öppnar **D64-redigeraren** — ett fristående verktyg för att arbeta direkt med en befintlig `.d64`-bild, oberoende av det program som för närvarande är öppna. Till skillnad från dialogrutan Exportera till D64 ovan (som alltid skapar en *ny*-disk från den kompilerade PRG:n), redigerar D64-redigeraren en diskavbildning på plats via `c1541`, så den fungerar även som en lättviktig diskhanterare.

**Filer ▾ meny:**

| Punkt          | Handling                                                                                          |
| -------------- | ------------------------------------------------------------------------------------------------- |
| **Nya D64…**   | Välj en målsökväg och skapa en nyformaterad, tom diskavbildning där.                              |
| **Öppna D64…** | Välj en befintlig `.d64`-fil och ladda dess katalog.                                              |
| **Spara som…** | Kopiera den för närvarande öppna diskavbildningen till en ny sökväg och fortsätt redigera kopian. |
| **Kör i VICE** | Starta den öppna diskavbildningen direkt i VICE (`-drive8type 1541`).                             |

**Verktygsfält:**

| Ikon                     | Handling                                                                          |
| ------------------------ | --------------------------------------------------------------------------------- |
| **Lägg till program**    | Välj en lokal fil och skriv den till diskkatalogen.                               |
| **Utdrag valt**          | Spara den valda postens byte till en lokal `.prg`-fil.                            |
| **Byt namn på markerad** | Redigera postnamnet infogat i tabellen — Enter bekräftar, Escape avbryter.        |
| **Ta bort markerade **   | Ta bort den valda posten från disken.                                             |
| **Uppdatera**            | Läs om katalogen, t.ex. efter att du har redigerat disken från ett annat verktyg. |

**Lägga till ett program:** Om du väljer en fil som redan slutar på `.prg` frågar du bara efter ett **Namn** och en diskett **Typ** (PRG/SEQ/USR/REL) — en `.prg` har redan sin egen load-address-rubrik, så den skrivs oförändrad. Om du väljer en annan fil (t.ex. en rå `.bin`) visas dessutom:

- **Ladda adress** (hex, valfritt) — lägg till en 2-byte PRG-rubrik vid den här adressen; lämna tomt för att skriva bytena råa.
- **Dekomprimeringsadress** (hex, valfritt) — används endast tillsammans med Exomizer; måladressen som depackaren ska packa upp data till.
- Kryssrutan **Exomizer** — komprimera filen innan skrivning, med samma `mem`/`sfx` crunch-lägen som för extrafilerna i dialogrutan Exportera till D64 ovan.

Katalogens lista visar filnamn med samma teckensnitt och versaler som en riktig C64 `LOAD"$",8`-lista.

> **Krav:** Precis som Exportera till D64 kräver D64-redigeraren VICE (`c1541`) konfigurerad i [Maskinvaruinställningar](#13-hardware-settings). Varje åtgärd (lägg till/ta bort/byt namn/extrahera) tillämpas direkt på `.d64`-filen på disken — det finns inget separat "spara"-steg.

---

## 12b. CRT-export (Magic Desk 64K-kassett)

**Meny → Bygg → Bygg CRT** producerar en Commodore 64-patronavbildning (`.crt`, **patrontyp 19 — Magic Desk / Domark / HES Australia**) som körs på VICE, TheC64, riktig hårdvara via EasyFlash / Kung Fu Flash och 1541 Ultimate II+ patronplatser. Den är tillgänglig i både **blockläge** och **Expertläge**, och — från och med den nuvarande versionen — även i **UltimateBasic-läge**.

### Vad som skickas i varukorgen

- **8 × 8 KB banker** vid `$8000`, bankväxlad via `$DE00` (Magic Desk-konvention: låga 3 bitar = bank, bit 7 = inaktivera varukorg).
- **Bank 0** innehåller en 128-byte header + boot loader:
  - `$8000/$8002` kall + varm startvektorer pekar på `$8009`.
  - `$8004–$8008` = `CBM80`-signaturen som krävs av KERNAL-återställningskoden.
  - `$8009–$807F` = laddaren: SEI / stack init / `JSR $FDA3` (IOINIT) / `JSR $FD50` (RAMTAS) / `JSR $FD15` (RESTOR) / `JSR $FF5B` (CINT), sedan en byte-kopieringsslinga som strömmar nyttolasten från vagnens ROM till RAM och byter bank när `$FC` når `$A0`. I slutet kopierar den en liten **exit stub** till `$0100`, inaktiverar varukorgen med `LDA #$80 : STA $DE00` och `JMP` till startpunkten.
- **Nyttolast** börjar vid `$8080` i bank 0 och överförs till bankerna 1–7 efter behov. Maximal nyttolast = `8 * 8192 − 128 = 65 408 byte`.

### Ladda adress och startpunkt

Bygg CRT använder aldrig Exomizer (avpackaren kan inte köras från vagnens ROM). Den kompilerar den aktuella fliken med standard autostart-pipelinen och tar laddningsadressen från PRG-headern och startpunkten från SYS-målet:

- **Block-/expertläge med BASIC SYS-stub på:** load = `$0801`, entry = SYS-målet (vanligtvis `$080D` eller användarens ursprung).
- **Block-/Expertläge med BASIC SYS-stub av:** ladda = användarursprung (med den klassiska `$0801 → $C000` reservfunktionen), post = ladda adress.
- **UltimateBasic-läge: ** Både inläsning och inmatning kommer från UB-kompilatorkartan (`build.map.loadAddress`). UB-autostartstubben inuti nyttolasten körs sedan exakt som den skulle göra efter `LOAD "...",8,1 : RUN` från disk.

Ursprungsadressen som du ser i ASM-utdata bevaras; laddaren kopierar helt enkelt den platta minnesbilden från PRG till RAM och hoppar till startpunkten när vagnens ROM har avmappats.

### Storleksgräns

Eftersom nyttolasten lagras linjärt och `assembleProgramToPrg()` returnerar en platt `minAddr..maxAddr`-buffert med nollfyllda mellanrum, räknar ett program med brett utspridda ORG-segment (t.ex. `$0801` + `$C000` + `$E000`) varje byte däremellan mot budgeten på 65 408 byte. Om du överskrider gränsen avbryts bygget med ett `saveCrtTooLarge`-fel — antingen komprimera minneslayouten eller dela upp data.

> **⚠️ Viktig varning — läs innan du skickar en CRT**
> 
> Laddaren anropar KERNAL **`RESTOR` ($FD15)** som en del av standardåterställningssekvensen. Detta skriver avsiktligt om standard I/O-vektorerna vid `$0314/$0315`, `$0316/$0317`, `$0318/$0319`, `$0328/$0329` och vänner tillbaka till deras ROM-standardinställningar. Konsekvenser:
> 
> - **Alla IRQ / NMI / BRK-hooks som ställts in innan CRT-starten rensas.** Ditt program måste installera dem självt efter inmatning — precis som en ny `LOAD "",8,1 : RUN` från band/disk.
> - **UltimateBasic-program** som förlitar sig på att icke-standardiserade KERNAL-vektorer är aktiva vid start kan behöva ett explicit `SYS`- eller init-anrop i autostart-stubben. Standard UB-autostarten fungerar direkt; tilläggsbibliotek som kopplar vektorer *före* `RUN` gör det inte.
> - **CIA1 / CIA2** ominitialiseras av `IOINIT`. Anpassade timerinställningar (raster-IRQ:er, musikspelare CIA-A) måste omprogrammeras efter inmatning.
> - Kundvagnen är inaktiverad från en 8-byte stub i **RAM vid `$0100`** så att `STA $DE00` inte kan avbrytas av en felaktig ROM-hämtning. Lita inte på att `$0100–$0107` innehåller stack top-avbildningen vid inmatning — den första RAM-pushen skriver över stubben.
> 
> Om en CRT körs i VICE men misslyckas på riktig hårdvara, är det första man bör kontrollera om programmet antar ett specifikt KERNAL-vektor- eller CIA-timertillstånd vid start. Installera tillståndet explicit i din init-rutin så kommer den att bete sig likadant på båda.

### Kompatibilitet

| Plattform                       | Status                                           |
| ------------------------------- | ------------------------------------------------ |
| VICE (`x64sc`, `x64`)           | Fungerar via ** Arkiv → Bifoga patronbild **.    |
| C64 / C64 Mini                  | Fungerar via den inbyggda patronladdaren.        |
| Kung Fu Flash                   | Fungerar — inbyggt Magic Desk-läge.              |
| EasyFlash-patron                | Fungerar när den programmeras som Magic Desk.    |
| 1541 Ultimate II+ / Ultimate 64 | Fungerar via **Kassett → Ladda varukorg bild **. |
| Kameleont / Turbo-kameleont     | Fabrik.                                          |

---

## 13. Maskinvaruinställningar

Öppna via **Inställningar → Maskinvaruinställningar…** i verktygsfältsmenyn. Alla externa maskinvarusökvägar och nätverkskonfiguration finns här.

### VICE-emulator

| Miljö         | Beskrivning                                               |
| ------------- | --------------------------------------------------------- |
| **Välj VICE** | Bläddra till den körbara VICE-filen `x64sc` (eller `x64`) |
| **Status**    | Visar om den körbara sökvägen är giltig och tillgänglig   |

VICE krävs för **Kör som PRG**, **Kör via D64** och **Exportera till D64**.

### Exomizer

| Miljö                                            | Beskrivning                                                                                                                                                          |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Välj Exomizer**                                | Bläddra till den körbara filen `exomizer`                                                                                                                            |
| **Blinkning vid kantlinje under dekompression ** | När den är aktiverad använder SFX-komprimerade PRG:er exomizerns inbyggda `-x1` snabba kantblixteffekt; när den är inaktiverad skickas `-n` för tyst dekomprimering. |
| **Status**                                       | Visar om den körbara sökvägen är giltig och tillgänglig                                                                                                              |

**Arbetsflöde:**
1. Installera Exomizer-binärfilen:
   - **Windows:** ladda ner den förbyggda `win32/exomizer.exe` från https://bitbucket.org/magli143/exomizer/wiki/Home eller https://csdb.dk/release/?id=244342.
   - **macOS:** `brew install exomizer` (installerar Magnus Linds officiella 3.1.2-version).
2. Konfigurera sökvägen i **Hårdvaruinställningar → Exomizer-sektionen **.
3. Aktivera kryssrutan **Kör med Exomizer** i **Inställningsmenyn**.
4. Alla **Kör**-åtgärder (PRG, D64, hårdvara) och **Bygg**-åtgärder (Bygg PRG, Bygg D64) kommer nu att pressa det sammansatta programmet genom `exomizer sfx sys` innan det startas eller sparas.

Exomizer fungerar på samma sätt i Windows och macOS – CLI anropas från Tauri-backend; ingenting i integrationen är plattformsspecifikt.

**Två komprimeringslägen används internt:**

| Läge          | Används av                                        | Anropskonvention                                                                                                                                                                |
| ------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sfx-system`  | Bygg/Kör med Exomizer-växling (PRG:s huvudsökväg) | Självutdragande PRG med inbyggd avkrossare; inställningen för kantblixt kontrollerar `-x1` vs `-n`                                                                              |
| `mem` (bakåt) | Kör via D64 → kryssruta per fil **EXO**           | Komprimerar varje extra fil till en `mem`-lägesström; programmet dekomprimerar den vid körning via makrot **EXODECRUNCH** och en förbyggd depacker (`samples/exo-decrunch.bin`) |

> **Tips:** Om Exomizer-sökvägen inte är konfigurerad men kryssrutan är aktiverad visas ett tydligt felmeddelande istället för att starta. Avaktivera kryssrutan för att köra utan komprimering.

> **Integrationstest:** `cargo test --test exomizer_integration` (i `src-tauri/`) verifierar den fullständiga mem-mode-komprimeringen + dekomprimeringen tur och retur på en 6502-emulator.

### Retro-felsökare

| Miljö                  | Beskrivning                             |
| ---------------------- | --------------------------------------- |
| **Välj RetroDebugger** | Bläddra till binärfilen `RetroDebugger` |
| **Status**             | Visar om sökvägen är giltig             |

Se [Avsnitt 9](#9-debugger-integration) för fullständig dokumentation om felsökaren.

### C64 Ultimate / 1541 Ultimate

Kör sammansatta PRG:er direkt på riktig hårdvara över det lokala nätverket med hjälp av Ultimate REST API.

| Miljö              | Beskrivning                                                          |
| ------------------ | -------------------------------------------------------------------- |
| **Värd (IP)**      | Enhetens IP-adress (t.ex. `192.168.1.100`)                           |
| Lösenord           | Valfritt — om enheten kräver autentisering                           |
| **Testanslutning** | Skickar en testförfrågan till `/v3/runners/info`; visar OK eller fel |

**Arbetsflöde:**
1. Anslut 1541 Ultimate / Ultimate 64 till ditt lokala nätverk.
2. Ange dess IP-adress (och lösenord om det är inställt) i maskinvaruinställningar.
3. Välj **Kör på hårdvara** från menyn för delad körning.
4. Klicka på **▶ Kör** — PRG kompileras och skickas till enheten via HTTP POST till `/v3/runners/prg`. Enheten laddar och kör den omedelbart på C64.

> **Tips:** Ingen USB-kabel eller drivrutin behövs – REST API är inbyggt i Ultimate-firmwaren. Din dator och enheten måste vara på samma lokala nätverk.

---

## 14. Visuella redigerare (verktygslåda)

Verktygsfältsmenyn **Verktygslåda** grupperar de visuella dataredigerarna som alla delar en gemensam Fil-meny (`Filer ▾`) för Ladda BIN / Spara BIN / Exportera till block / Spara till D64. Varje redigerare producerar rå `.bin`-data som kan placeras i ett program med `INCBIN`, eller läggas direkt till en D64-disk via posten **Spara till D64**.

Dialogrutor i den visuella redigeraren kan dras med hjälp av rubrikerna över hela arbetsytan i Visual Assembler. En dialogruta utan sparad position öppnas centrerad; efter att den har flyttats lagras dess senaste position i användargränssnittsinställningarna och återställs nästa gång den öppnas.

### Högupplöst/flerfärgsredigerare

Pixelnivå-bitmappsredigerare med både 320×200 högupplösta och 160×200 flerfärgslägen. Öppna via Verktygskit → Högupplöst redigerare.

| Särdrag          | Beskrivning                                                                                                                  |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Lägesväxlare     | **Multicolor** Kryssrutan växlar mellan hög upplösning (mono per cell) och flerfärg (4 färger per cell).                     |
| Verktyg          | Penna, suddgummi, linje, rektangel, fylld rektangel, oval, fylld oval, fyllning.                                             |
| Sprutverktyg     | Airbrush-liknande målare som sprider pixlar runt markören medan du ritar.                                                    |
| Sprutintensitet  | Listrutan bredvid sprutverktyget styr hur tätt varje sprutslag är.                                                           |
| Färgpalett       | Förgrunds- (bläck) + pappers- (bakgrunds) väljare. Flerfärgsläget spårar automatiskt 3 extrafunktioner per cell.             |
| Ångra / Gör om   | Historik per penseldrag, ctrl-Z / ctrl-Y.                                                                                    |
| Rutnät + Raster  | Valfritt 8×8 rutnät och rasterradöverlägg för celljustering.                                                                 |
| Importera bild   | PNG/JPEG/GIF som släpps på arbetsytan kvantiseras automatiskt till C64-paletten med 16 färger.                               |
| Exportera block  | Lägger till BYTE/RAWBYTES-block i programmet med kodad bitmapp, skärm och färgdata.                                          |
| Exportera `.bin` | Sparar det ursprungliga flerfärgsformatet (10000 byte: 8000 bitmapp + 1000 skärm + 1000 färg) klart för LOADFILE till $2000. |

### Sprite-redigeraren

24×21 pixlars sprite-editor med flerbildsanimering. Öppna via Toolkit → Sprite Editor.

| Särdrag                      | Beskrivning                                                                                                                                                                                                                               |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ramar                        | Lägg till / ta bort / ändra ordning på ramar; ramremsan visas längst ner.                                                                                                                                                                 |
| Läge                         | Mono-/flerfärgsbrytare.                                                                                                                                                                                                                   |
| Verktyg                      | Penna, fyllning, linje, rektangel, cirkel — plus vändning horisontellt, vändning vertikalt, förskjutning vänster/höger/upp/ner (med valfri radbrytning). Formverktygen visar en live-förhandsvisning när du drar; släpp för att bekräfta. |
| Ångra / gör om               | Fullständig ångra/gör om-stapel per bildruta. Ctrl/Cmd+Z / Ctrl/Cmd+Y eller verktygsfältsknapparna.                                                                                                                                       |
| Bildimport                   | Importera en PNG- eller JPEG-fil via Filer → Importera bild. Importören mappar varje pixel till närmaste C64-palettfärg och skriver den i den aktuella bildrutan.                                                                         |
| Förhandsvisning av animering | Spela upp/stoppa med konfigurerbar hastighet.                                                                                                                                                                                             |
| Exportera block              | Infogar ett RAWBYTES-block vid en 64-byte-justerad adress för varje ram, plus en sprite-pekarinställning.                                                                                                                                 |
| Spara `.bin`                 | Skriver 64 byte per bildruta (rå sprite-data utan utfyllnad).                                                                                                                                                                             |

### C64 Tecken-ROM-läsare ("Teckenkarta")

Skrivskyddad läsare av C64-tecken-ROM (det inbyggda PETSCII-teckensnittet). Öppnas via posten **C64 chargen** i Toolkit-menyn. Användbart för att hitta skärmkoden för en tecken innan du skriver den med `RAWBYTES` eller `TEXT`.

| Särdrag                 | Beskrivning                                                                                                                                                                                                        |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Två teckenuppsättningar | Flik 1: **Set 1 — Övre/Grafik** (standardläge efter påslag). Flik 2: **Set 2 — Nedre/Övre** (efter `$0E`-brytaren).                                                                                                |
| Glyfrutnät              | 16×16 rutnät med alla 256 tecken. Klicka på en teckensymbol för att se dess detaljpanel: zoomad 8×8 pixlarvy, skärmkod (decimal + hex), PETSCII-koder (både standard och förskjutna) och den råa 8-byte bitmappen. |
| Detaljpanel             | Visar den valda glyfens skärmkod, PETSCII-koder och de åtta råa bytena – redo att klistra in i ett `RAWBYTES`- eller BYTE-block.                                                                                   |
| Skrivskyddad            | Ingen redigering här — använd teckenredigeraren (nedan) för att modifiera tecken.                                                                                                                                  |

### Teckenredigerare (teckenuppsättning)

Teckenuppsättningsredigerare med 256 tecken, 8×8. Öppna via Verktyg → Teckenredigerare.

| Särdrag                    | Beskrivning                                                                                                                                                                             |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ladda ROM                  | Importerar C64 ROM-teckenuppsättningen direkt från VICE:s `laddning` (ingen filväljare).                                                                                                |
| Ladda `.bin`               | Importerar en extern binärfil med 2048 byte teckenuppsättning.                                                                                                                          |
| Förhandsvisning per tecken | 16-brett rutnät med alla 256 tecken med den aktuella cellen markerad.                                                                                                                   |
| Pixelredigerare            | 8×8 editor för entecken med verktyg för att växla/invertera/rensa.                                                                                                                      |
| Färg per tecken            | Lagrar ett standardvärde för färg-RAM för varje tecken. I flerfärgsläge för tecken bevarar detta även aktiveringsbiten för flerfärg per cell och tecknets egen lägre 3-bitarsfärg.      |
| Metadata tur och retur     | När man läser in kompatibla data från arbetsflöden för teckenuppsättning Canvas/Map bevaras färgmetadata per tecken så att redigeringar kan fortsätta utan att förlora färgintentionen. |
| Exportera block            | Lägger till RAWBYTES vid $0800 (block 2) eller $3800 (block 7) med den kodade teckenuppsättningen.                                                                                      |

### Teckenuppsättning Canvas-redigeraren

Helskärmsverktyg för teckenuppsättningshanterare för att bygga skärmar från en komplett teckenuppsättning på 256 tecken. Öppna via Toolkit → Charset Canvas.

Arbetsytan är 16×16 tecken stor. I monoläge ger det en arbetsyta på 128×128 pixlar; i flerfärgsläge för tecken ger det en arbetsyta på 64×128 pixlar med breda pixlar enligt C64:s regler för flerfärgade tecken.

| Särdrag                             | Beskrivning                                                                                                                                                                                     |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mono / flerfärgad                   | Monoläget lagrar 1-bitars 8×8-glyfer. Flerfärgsläget lagrar tvåbitars horisontella pixelpar och markerar använda celler med Color RAM-bit 3.                                                    |
| C64 färgmodell                      | Bakgrunden använder `$D021`; delad flerfärg 1 använder `$D022`; delad flerfärg 2 använder `$D023`; varje karaktärs egen färg kommer från Color RAM-bitarna 0–2.                                 |
| Ritverktyg                          | Blyertspenna, suddgummi, linje, rektangel, oval och flödfyllning fungerar över teckengränser.                                                                                                   |
| Sprutverktyg                        | Airbrush-liknande teckning som sprider pixlar över angränsande celler/tecken.                                                                                                                   |
| Sprutintensitet                     | Listrutan bredvid sprutverktyget ställer in penseldragets täthet.                                                                                                                               |
| Rutnätsväxling                      | Kryssrutnätet visar eller döljer rutnätet med 16×16 tecken.                                                                                                                                     |
| Spara teckenuppsättning `.bin`      | Sparar bitmappsdata på 2048 tecken.                                                                                                                                                             |
| Spara 16×16-karta + Färg-RAM `.bin` | Sparar 256 skärmkoder följt av 256 färg-RAM-värden. Använd detta med `MAP_COPY16X16`.                                                                                                           |
| Belastning                          | Kan ladda sparade teckenuppsättningar för canvas, vanliga teckenuppsättningsdata och kompatibla teckenuppsättningsdata för teckenredigeraren, inklusive lagrade färger per tecken när de finns. |

**Viktig C64-begränsning:** i flerfärgsläge för tecken är de två delade färgerna globala för hela skärmen (`$D022` / `$D023`). Endast tecknets egen färg visas per cell, och den är begränsad till färgerna 0–7 eftersom Color RAM-bit 3 väljer flerfärgsläge.

### Kartredigerare (Flerskiktade kakelkartor)

Skiktad tilemap-redigerare för statiska landskap, sprite-spawnkartor, kollisionsdata och liknande. Öppna via Toolkit → Map Editor.

| Särdrag                            | Beskrivning                                                                                                                                                                                                                                               |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lager                              | Flera namngivna lager, vart och ett med sin egen uppsättning plattor och opacitet.                                                                                                                                                                        |
| Penslar                            | Lägen för enkel sida, fyllning, linje, rektangel och cirkel. Formverktygen visar en liveförhandsvisning när du drar; släpp för att bekräfta.                                                                                                              |
| Ångra / gör om                     | Fullständig ångra/gör om-stapel per lager. Ctrl/Cmd+Z / Ctrl/Cmd+Y eller verktygsfältsknapparna.                                                                                                                                                          |
| Rensa menyn                        | Rensning per lager eller hel karta med bekräftelse.                                                                                                                                                                                                       |
| Bildimport                         | Släpp en PNG av en kakelkarta; redigeraren delar automatiskt upp kakel i kakel.                                                                                                                                                                           |
| Kopiera / klistra in               | Kopiera ett markerat kakelområde och klistra sedan in normalt eller använd transparent klistra in för att hålla tomma kakel genomskinliga.                                                                                                                |
| Flerfärgsmedveten kakelfärgning    | Med kompatibla teckenuppsättningsmetadata använder målningen kakelns lagrade standardinställningar för färg-RAM (inklusive flerfärgsrelaterad kodning) istället för en generisk platt färg.                                                               |
| Anpassade teckenuppsättningsfärger | När en teckenuppsättning innehåller `charColors`-metadata använder kartredigeraren den valda plattans standardvärde för färg-RAM vid målning.                                                                                                             |
| Exportera block                    | Sätter ut RAWBYTES-block för tileset-grafik + kartdata.                                                                                                                                                                                                   |
| Spara skärm-RAM (.bin)…            | Sparar endast skärmkoderna för det aktuella kartlagret (40×25 = 1000 byte).                                                                                                                                                                               |
| Spara skärm-RAM + färg-RAM (.bin)… | Sparar skärmkoder sammanfogade med Color RAM-värden som en enda 2000-byte-fil (`screen[0..999]` följt av `color[0..999]`). Använd detta med makrot **MAP_COPY** (kombinerat .bin-läge) för att återställa både skärm och färg i en operation vid körning. |

### SID-redigerare (3-röstsspårare)

Tracker för flera instrument, 3 röster och en förhandsgranskningsmotor för webbljud. Öppna via Toolkit → SID Editor.

**Kontroller per instrument: **
- Kryssrutor för vågformer (TRI / SAW / PUL / NOI) — flera vågformer kan OR:as tillsammans.
- ADSR (attack / decay / sustain / release) visas som en draggraf ovanför de fyra reglagen.
- Pulsbreddsreglage (0-4095) med valfria ring-/synkroniseringsflaggor.
- Kryssruta för filterrouting per röst; global filteravstängning / resonans / volym / läge (LP/BP/HP).

**Spårningsrutnät:**
- 3 röster × upp till 7 mönster × 32 rader = 7 × 32 = max 224 rader (8-bitars radräknare begränsar det).
- Per rad: not + instrumentindex. Tomma rader innehåller föregående not.
- Markera en cell normalt, eller håll ner Shift** medan du klickar eller använder piltangenterna för att utöka en rektangulär markering över rader och någon av de tre rösterna. Om du högerklickar inuti det markerade området behålls området intakt.
- Kopiera, Klipp ut, Klistra in och Rensa är tillgängliga från ikonverktygsfältet och den ikonbaserade snabbmenyn. `Ctrl/Cmd+C` och `Ctrl/Cmd+V` fungerar på samma rektangulära markering.
- Harmonihjälp: välj en grundton, ackordtyp och oktav, förhandsgranska ackordet med det aktuella instrumentet och infoga sedan instämmandet direkt i spåraren. Tillgängliga typer inkluderar dur, moll, förminskad, förstärkt, sus2, sus4, dominant 7, dur 7, moll 7, 6, moll 6, 9, b9, #9, dim7 och 7sus4.
- Arpeggio-hjälp: förhandsgranska eller infoga 4-, 8- eller 16-stegsnoter som löper från det valda ackordet i uppåt-, nedåt- eller uppåt/nedåt-riktning.
- **Förhandsgranskningsrad** provspelar den valda raden över alla tre ljud utan att starta mönsteruppspelning.
- Inklistring av cellintervall börjar nu vid den valda intervallets startcell och stoppar tydligt vid röst- och radgränser istället för att radbrytas till nästa kolumn eller rad.
- Hastighetsreglaget anger IRQ-tick-divisorn (bildrutor mellan rader).

**Uppspelning och virtuellt tangentbord: **
- Knappen Spela upp i verktygsfältet ändras till Paus under uppspelning och till Återuppta under paus; Stopp avslutar uppspelningen och återställer läget.
- Knappen på tangentbordsverktygsfältet öppnar ett icke-modalt piano som fortfarande kan användas medan SID-redigeraren är aktiv. Dra dess rubrik för att placera det var som helst över huvudprogrammet.
- Aktivera **Insert into tracker** för att skriva varje spelad not vid den aktuella tracker-markören och gå vidare till nästa rad. Inaktivera den för att lyssna på noter utan att redigera.
- Förhandsvisningar av ackord och arpeggio lyser upp motsvarande pianotangenter när klaviaturen är öppet.

**Export av filer-menyn:**
| Exportera                       | Vad den gör                                                                                                                                                                              |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Spara .bin…`                   | Skriver redigerarens ursprungliga serialiserade format (instrument + mönster + sekvens).                                                                                                 |
| `Exportera block (endast data)` | Lägger till instrumenttabell + mönsterblock till programmet vid `* = $C000`.                                                                                                             |
| `Exportera block + minispelare` | Lägger till hela spelaren (sid_init / sid_irq / sid_play_row / sid_set_voice) plus PAL-frekvenstabeller. Efter exporten, placera en `JSR sid_init` i din huvudkod där musiken ska börja. |
| `Exportera asm (urklipp)`       | Kopierar hela assembly-källkoden till urklipp.                                                                                                                                           |

**Användning av spelarens ZP:** `$FB` (tickräknare), `$FC` (radindex), `$FD` (set_voice temp). Dessa står i konflikt om din huvudkod använder dem — flytta via expertläge om det behövs.

**Kända gränser:**
- Enkel linjär mönsterlista (ingen sekvenstabell per röst ännu).
- 8-bitars radräknare begränsas till 7 mönster × 32 rader.
- C64 `$D418` global volym delas mellan röster — volymreglaget per instrument är informativt; sustainnivån (`S` för ADSR) är den effektiva volymen per röst.
- Förhandsvisningen av webbljudet är ungefärlig: PWM-modulering, ring/synk och SID-filterkaraktären skiljer sig från det verkliga chipet.

---

### Kurvredigerare

Genererar färdiga `.byte`-uppslagstabeller från matematiska kurvor — sinus, övergångar, triangel/sågtand/kvadrat och studs. Idealisk för sprite-rörelser, rastereffekter, färgcykler eller vilken animation som helst som drivs av en förberäknad tabell. Öppna via ikonen **Kurvredigerare** i det övre verktygsfältet (bredvid SID-redigerarknappen).

**Kurvor:** Sinus, cosinus, linjär, justering in/ut/in ut (kvadrat och kubiskt), justering in/ut (cirkulärt), triangel, sågtand, kvadrat och justering in/ut/in ut studs.

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

Varje kopierings-/infogningsutdata börjar med en rubrikkommentar som dokumenterar kurvan, det faktiska min/max-intervallet, antalet poster och den exakta användningen (vilket registrerar varje tabellmatning).

**Förhandsvisning:**
- **Graf** — kurvan ritad med värde 0 vid **toppen** och max vid **botten**, vilket matchar C64 sprite-Y / rasterkonventionen (så det du ser är vad tabellen driver på hårdvaran). En metalinje under grafen visar byteantalet, det faktiska Min/Max för de genererade värdena och kurvnamnet/namnen.
- **Studsande boll** — animerar en markör genom bordet i **Tempo** (5–240 värden/sek). Vid tempo 50 motsvarar detta ett värde per bildruta på PAL (50 Hz), dvs. ett `.wait_raster`-steg per index. Knappar för uppspelning/paus och omstart, ett uttonat spår av de senaste ~24 positionerna och en live-avläsning av `Index · Värde`.

**Kopiera / Infoga:** verktygsfältets två ikoner — **Kopiera** placerar tabellen på urklipp; **Infoga i redigerare** lägger till tabellen (och läsaren, om aktiverad) som block i det aktuella programmet. Om du infogar **ersätts** den tidigare kurvredigerarinfogningen istället för att stapla dubbletter (fungerar i block- och expertläge).

**Filmeny: **
| Handling                       | Vad den gör                                                                                                                                                                                                                                                                                                                         |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Spara kurva (.bin)…**        | Sparar de råa tabellbytena exakt som C64 skulle läsa dem via `INCBIN`. 16-bitars: N låga byte följt av N höga byte.                                                                                                                                                                                                                 |
| **Lastkurva (.bin)…**          | Läser in råa tabellbyte tillbaka till editorn, tolkade enligt det aktuella bitdjupet (16-bitars: första halvan låg, andra halvan hög). Den inlästa tabellen visas som den är tills någon kurvkontroll genererar en ny kurva.                                                                                                        |
| **Exportera demo till block ** | Lägger till en komplett, körbar sprite-demo: sprite-init, rastersynkroniserad huvudloop, den inbäddade tabellen och boll-sprite-data. X sveper 0..320 i 8.8 fixpunkt med `$D010` MSB medan tabellen driver sprite Y — vilket exakt matchar editorns förhandsgranskning. Återexport ersätter den tidigare Curve Editor-insättningen. |

**Matcha förhandsgranskningen på C64:** förhandsgranskningen läser tabellen **linjärt, loopande 0 → N-1 → 0, ett värde per bildruta**. För att reproducera det exakt, kör tabellen på samma sätt (öka indexet en gång per bildruta, radbryt vid tabellens längd). En pingis- eller partiell uppspelning kommer att röra sig olika även om bytevärdena är identiska. Se `samples/curve-new-demo.asm` för ett fungerande 16-bitars sprite-X-exempel.

---


*© 2026 Zsolt Tarczali — C64 Visual Assembler*
