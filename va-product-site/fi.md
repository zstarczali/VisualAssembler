# C64 Visual Assembler — Käyttöopas

**Versio 2.4.0**

Visuaalinen, lohkopohjainen 6502-assembler Commodore 64:lle. Voit luoda ohjelmia vetämällä ja pudottamalla käskylohkoja ja nähdä luodun assemblerin ja konekoodin reaaliajassa.

---

## Sisällysluettelo

- [C64 Visual Assembler — Käyttöopas](#c64-visual-assembler--user-manual)
    - [Version 2.4.0 kohokohdat](#version-240-highlights)
    - [Version 2.3.9 kohokohdat](#version-239-highlights)
    - [Version 2.3.8 kohokohdat](#version-238-highlights)
  - [Sisällysluettelo](#table-of-contents)
  - [1. Käyttöliittymän yleiskatsaus](#1-interface-overview)
  - [2. Lohkopaletti](#2-block-palette)
  - [3. Ohjelma-alue](#3-program-area)
    - [Operandin syöttö](#operand-input)
  - [4. ASM-näkymä](#4-asm-view)
    - [Lähtötilat](#output-modes)
    - [Työkalupaketti-välilehti](#toolkit-tab)
    - [Asetukset-välilehti](#options-tab)
    - [ASM-rivin napsauttaminen](#clicking-an-asm-line)
    - [ASM-rivinumerot](#asm-line-numbers)
    - [Käännöksen edistymismodaali](#compile-progress-modal)
  - [5. Asetukset \&amp; Työkalupalkki](#5-settings--toolbar)
    - [Lataa .asm-tiedosto (pikaopas)](#load-asm-file-quick-reference)
      - [Tuonnin jäsentämisen huomautukset ja parhaat käytännöt](#import-parsing-notes-and-best-practices)
  - [UltimateBasic-tila](#ultimatebasic-mode)
    - [UB-editorin avaaminen](#opening-the-ub-editor)
    - [Editorityökalut](#editor-tools)
    - [Projektit, välilehdet ja käynnistystiedostot](#projects-tabs-and-startup-files)
    - [Rakennus ja diagnostiikka](#building-and-diagnostics)
    - [Juoksu, D64 ja Exomizer](#running-d64-and-exomizer)
    - [Virheenkorjaussymbolit ja niiden purkaminen](#debugger-symbols-and-disassembly)
    - [Ultimate Basicin käyttöohje ja lähdekoodi](#ultimate-basic-manual-and-source)
  - [6. Asiantuntijatila](#6-expert-mode)
    - [Tilan vaihtaminen](#switching-modes)
    - [Editorin asettelu](#editor-layout)
    - [Työkalupalkin painikkeet](#toolbar-buttons)
    - [Virhe korostamisessa](#error-highlighting)
    - [Syntaksin korostus](#syntax-highlight)
    - [Lähdekoodin muotoilija](#source-formatter)
    - [Projektipaneeli \&amp; välilehdet](#project-panel--tabs)
    - [Välilehtipalkki](#tab-bar)
  - [7. Osoitetilat](#7-addressing-modes)
    - [Merkitse lausekkeet operandeiksi](#label-expressions-as-operands)
    - [`*`-ohjelmalaskuri lausekkeissa](#the--program-counter-in-expressions)
    - [Paikalliset (pisteviivalla) merkityt otsikot](#local-dotted-labels)
    - [Itseään muokkaavan koodin operanditunnisteet](#self-modifying-code-operand-labels)
  - [8. Vakio-6502-ohjeet](#8-standard-6502-instructions)
    - [Tietojen siirto](#data-movement)
    - [Aritmeettinen](#arithmetic)
    - [Logiikka](#logic)
    - [Hyppyjä \&amp; Haarautumisia](#jumps--branches)
    - [LBNE / LBEQ / … (Pitkät oksat)](#lbne--lbeq---long-branches)
    - [Rekisteritoiminnot](#register-operations)
    - [Shift \&amp; Rotate](#shift--rotate)
    - [Pino](#stack)
    - [Järjestelmä / Liput](#system--flags)
    - [Laittomat / dokumentoimattomat ohjeet](#illegal--undocumented-instructions)
  - [9. Makrolohkot — Viite](#9-macro-blocks--reference)
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
    - [SPRITE\_ALUSTUS](#sprite_init)
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
  - [10. Virheenkorjausintegraatio](#10-debugger-integration)
    - [RetroDebugger](#retrodebugger)
    - [Keskeytyskohtalohkot](#breakpoint-blocks)
    - [Virheenkorjausliput (Asetukset-välilehti)](#debugger-flags-options-tab)
  - [11. Tietopankin linkit](#11-knowledge-base-links)
  - [12. D64 Vie \&amp; Suorita](#12-d64-export--run)
    - [Jaa suoritus -painike](#split-run-button)
    - [Vie D64-muotoon -valintaikkuna](#export-to-d64-dialog)
    - [D64-metatiedot projekteissa](#d64-metadata-in-projects)
  - [12b. CRT-vienti (Magic Desk 64K -kasetti)](#12b-crt-export-magic-desk-64k-cartridge)
  - [13. Laitteistoasetukset](#13-hardware-settings)
    - [VICE-emulaattori](#vice-emulator)
    - [Exomizer](#exomizer)
    - [Retro-virheenkorjaaja](#retro-debugger)
    - [C64 Ultimate / 1541 Ultimate](#c64-ultimate--1541-ultimate)
  - [14. Visuaaliset editorit (työkalupakki)](#14-visual-editors-toolkit)
    - [Korkearesoluutioinen / Monivärinen editori](#hi-res--multicolor-editor)
    - [Sprite-editori](#sprite-editor)
    - [C64 Merkki-ROM-selain ("Merkkikartta")](#c64-character-rom-browser-char-map)
    - [Merkkieditori (merkistö)](#character-editor-charset)
    - [Merkkijonojen muokkausohjelma](#charset-canvas-editor)
    - [Karttaeditori (monikerroksiset laattakartat)](#map-editor-multilayer-tilemaps)
    - [SID Editor (3-Voice Tracker)](#sid-editor-3-voice-tracker)
    - [Käyränmuokkausohjelma](#curve-editor)

---

## Version 2.4.0 kohokohdat

- **D64-editori** — täysimittainen levykuvaselain työkalupalkissa (käyräeditorin jälkeen). Avaa olemassa oleva `.d64`, luo uusi tyhjä levy tai käynnistä nykyinen levy suoraan VICE-ohjelmaan. Kaikki tämä Tiedostot ▾ -valikosta, joka vastaa muita visuaalisia editoreita. Katso [D64-editori (olemassa olevan levykuvan selaaminen ja muokkaaminen)](#d64-editor-browse--edit-an-existing-disk-image).
- **Lisää / pura / nimeä uudelleen / poista D64-editorissa** — lisää paikallinen tiedosto levyhakemistoon, pura valittu merkintä takaisin `.prg`-tiedostoon, nimeä merkintä uudelleen taulukon sisällä tai poista se — jokainen toiminto kohdistetaan suoraan `.d64`-tiedostoon `c1541`-komennon kautta ilman erillistä tallennusvaihetta.
- **Latausosoite, purkuosoite ja Exomizer D64-editorissa** — otsikottoman raakatiedoston lisääminen antaa sinulle mahdollisuuden asettaa valinnaisen latausosoitteen, Exomizer-purkukohteen ja pakata sen matkan varrella käyttämällä samoja `mem`/`sfx` -tiivistystiloja kuin Vie D64:ään -valintaikkunan lisätiedostot. Tiedostossa `.prg`, jolla on jo oma otsikko, nämä kentät ohitetaan kokonaan.
- **Levymerkintätyypin valitsin** — valitse PRG / SEQ / USR / REL juuri lisätylle tiedostolle sen sijaan, että se kirjoitettaisiin aina PRG-muodossa.
- **Aito hakemistoluettelo** — D64 Editorin tiedostoluettelo renderöidään mukana tulevalla C64 Pro -fontilla, isoilla kirjaimilla, klassisen `LOAD"$",8` -ulkoasun saavuttamiseksi.
- **Korjattu:** Merkinnän uudelleennimeäminen D64-editorissa ei enää hylkää muokkausta, kun napsautat tekstikenttää.
- **Parannettu:** vaalean teeman tilanilmaisintyökalurivin merkki (LOHKOTILA / ASIANTUNTIJATILA / …) on tummempi ja helpommin luettava, ja sen hohtava animaatio on jälleen näkyvissä.

---

## Version 2.3.9 kohokohdat

Viisi assembler-ominaisuutta, joita kaikkia voi käyttää asiantuntijatilan tekstinä ja (jos se on järkevää) lohkoina. Jokaisella on oma viiteosionsa alempana:

- **`*` missä tahansa lausekkeessa** — ohjelmalaskurisymboli toimii nyt operandilausekkeiden sisällä, ei vain yksinään: `BNE *-5`, `JMP *+20`, `LDA #&lt;*`, `LDA #&gt;(*+63)`. Arvoa seuraava `*` (`STRIDE*2`) on edelleen kertolasku. Katso [Osoitetilat → Ohjelmalaskuri `*` lausekkeissa](#the--program-counter-in-expressions).
- **Paikalliset (pisteviivalla varustetut) otsikot** — otsikko, kuten `.loop`, kuuluu lähimpänä olevan edeltävän *global* (ei-pisteviivalla varustetun) otsikon piiriin, joten `DrawSprite` ja `ClearScreen` voivat kumpikin määrittää oman `.loop`-otsikkonsa ilman törmäystä. Katso [Paikalliset (pisteviivalla varustetut) otsikot]{1].
- **Pitkän haaran pseudo-operaatiot** — `LBNE`, `LBEQ`, `LBCC`, `LBCS`, `LBMI`, `LBPL`, `LBVC`, `LBVS` kokoavat käänteiseksi haaraksi `JMP`-haaran yli (aina 5 tavua), joten kohde voi olla millä tahansa etäisyydellä. Uusi **Pitkät haarat** -palettiluokka. Katso [LBNE / LBEQ / … (Pitkät haarat)](#lbne--lbeq---long-branches).
- **`.assert` direktiivi** — `.assert loppu - alku &lt;= 256` tai `.assert * &lt; $A000, "viesti"` arvioidaan kokoonpanovaiheessa ja kääntäminen epäonnistuu (näyttäen todellisen arvon), kun lauseke on epätosi. Katso [.ASSERT](#assert).
- **Itsemuokkaavan koodin operandin nimikkeet** — `LDA-arvo:#$00` määrittää nimikkeen `arvo`, joka osoittaa käskyn operanditavuun, joten `STA-arvo` korjaa sen suoraan. Katso [Itsemuokkaavan koodin operandin nimikkeet](#self-modifying-code-operand-labels).
- **Ystävällisemmät kantaman ulkopuoliset haaravirheet** — haara, joka laskeutuu −128…+127:n ulkopuolelle, raportoi nyt tarkalleen, kuinka paljon se ylittää alueen ja ehdottaa vastaavaa `LBxx` pitkää haaraa.

---

## Version 2.3.8 kohokohdat

- **Työtilan tallennus / avaaminen:** tallentaa tarkan joukon avoimia tiedostovarmuuskopioituja välilehtiä – mukaan lukien aktiivisen välilehden ja kunkin välilehden editoritilan – `.vaws`-työtilatiedostoon. Työtilat tallentuvat automaattisesti muutoksen yhteydessä, ja sovellus palauttaa automaattisesti viimeisimmän työtilan käynnistyksen yhteydessä.
- **Yleisen muistipaneelin vaihto:** näytä tai piilota koko C64-muistipaneeli erilliseltä käyttöliittymäkytkimeltä.
- **Lokalisoitu Ultimate Basicin komentoviite:** Automaattisen täydennyksen ponnahdusikkunan ja komentopaneelin komentokuvaukset noudattavat nyt nykyistä käyttöliittymän kieltä (unkari, englanti, espanja, saksa, hollanti) ja vaihtoehtona on englanti.
- **Päivitetty Ultimate Basic -grafiikkadokumentaatio:** `VÄRIKYNÄ` ja plot/line/suorrakulma/ympyrä- ja moniväripiirtokomentojen ohjetekstit vastaavat nyt kääntäjän nykyistä toimintaa.
- **Korjattu KERNAL-viittaus:** korjasi `SETLFS`- ja `PLOT`-merkinnät (osoitteet ja kutsutavat käytännöt) purkajan KERNAL-osoitetaulukossa.
- **Korjattu muistin käyttö useiden avoinna olevien välilehtien aikana:** Välilehtikohtainen kumoamis-/uudelleentoimintohistoria on nyt rajattu (pienellä palautumiskertoimella), mikä estää rajattoman muistin kasvun, jonka pitkä istunto useiden avoinna olevien dokumenttien kanssa aiemmin aiheutti.
- **Editorin työkalupalkin siivous:** poisti tarpeettomat keskeytyskohtien vaihtopainikkeet Expert- ja Ultimate Basic -työkaluriveistä (keskeytyskohdat asetetaan edelleen rivinumerovälin perusteella) ja tasasi Expert-työkalupalkin korkeuden Ultimate Basic -työkalupalkin korkeuteen.

---

## 1. Käyttöliittymän yleiskatsaus

Sovellus on jaettu kolmeen pääpaneeliin:

| Paneeli              | Kuvaus                                                                      |
| -------------------- | --------------------------------------------------------------------------- |
| **Vasen — Paletti**  | Kaikki saatavilla olevat käsky- ja makrolohkot. Hae tai selaa luokittain.   |
| **Keskus — Ohjelma** | Ohjelmasi. Vedä lohkoja tänne, järjestele ne uudelleen, muokkaa operandeja. |
| **Oikea — Lähtö**    | Reaaliaikainen ASM-näkymä ja/tai muistinvalvonnan lähtö.                    |

Yläpalkin oikeassa reunassa oleva tilan merkki osoittaa aktiivisen **Block**-, **Expert**- tai **Ultimate Basic** -editorin. Se päivittyy välittömästi, kun muokkaustila vaihtuu.

---

## 2. Lohkopaletti

Vasemmalla olevassa paletissa luetellaan kaikki käytettävissä olevat lohkot luokittain ryhmiteltyinä:

- **Tietojen siirto** — LDA, LDX, STA, STX, …
- **Aritmeettinen** — ADC, SBC, INC, DEC, CMP, …
- **Logiikka** — JA, ORA, EOR, BITTI
- **Hyppyt ja haarat** – JMP, JSR, RTS, BNE, BEQ,…
- **Pitkät haarat** — LBNE, LBEQ, LBCC, LBCS, LBMI, LBPL, LBVC, LBVS (haara mihin tahansa etäisyyteen; katso §8)
- **Rekisteritoiminnot** — TAX, TAY, INX, DEX, …
- **Siirto ja kierto** — ASL, LSR, ROL, ROR
- **Pino** — PHA, PHP, PLA, PLP
- **Järjestelmä** — CLC, SEC, NOP, BRK, …
- **Luvattomat ohjeet** — LAX, SAX, DCP, …
- **Structure** — LABEL, COMMENT, REGION, ENDREGION
- **Macros** — LOOP, NEXT, FOR, ENDF, PUSH, PULL, END, TEXT, BYTE, WORD, FILL, ALIGN, ASSERT, STRING, DATA, RAWBYTES, RAWTEXT, PETSCII, CHARSET, INCBIN, SID, INCLUDE, TABLE, ORG, MACRO, ENDM, INVOKE, IF, ELSE, ENDIF, VAR, WHILE, ENDW, REPEAT, UNTIL, MEMCPY, MEMSET, PRINT, PRINT_CHAR, PRINT_HEX, CLEAR_SCREEN, WAIT_KEY, DELAY, SET_BORDER, SET_BG, IRQ_SETUP, RAND, SPRITE_INIT, SPRITE_POS, WAIT_RASTER, JOYSTICK, MOUSE, SPRITE_COL, LOADFILE, REU_CHECK, REU_STASH, REU_FETCH, REU_SWAP, TURBO_SET, SUPERCPU_DETECT, TURBO_ENABLE, MAP_COPY, MAP_COPY16X16, SPRITE_ANIM, SCORE_BCD

Käytä paletin yläosassa olevaa **hakukenttää** suodattaaksesi nimen mukaan. Napsauta **Lisää valittu lohko** -painiketta tai vedä lohko ohjelma-alueelle.

---

## 3. Ohjelma-alue

- **Vedä ja pudota** lohkoja paletista tai **järjestä uudelleen** olemassa olevia lohkoja vetämällä niiden kahvasta (≡).
- Jokainen lohko näyttää sen **mnemonisen **, **operandikentän ** ja **osoitustilan valitsimen ** (jos sovellettavissa).
- Napsauta **▸ / ▾** -painiketta lohkon kutistamiseksi tai laajentamiseksi.
- Poista lohko painamalla **× (poista)** -painiketta.
- **Keskeytä kaikki** -painike taittaa kaikki lohkot kerralla.

### Estä paneelin minikartta

Ohjelmapaneelin otsikossa on päälle-/pois kytkettävä **minimap**-painike. Kun tämä painike on käytössä, paneelin oikeaan reunaan ilmestyy kapea `56 px` -kangasnauha, joka näyttää kaikki lohkot värikoodattuina vaakasuorina palkkeina:

| Palkin väri      | Lohkon tyyppi                     |
| ---------------- | --------------------------------- |
| Syaani           | Tarrat                            |
| Sininen/violetti | Makrot ja direktiivit             |
| Keltainen        | Ohjeet                            |
| Vihreä           | Kommentit ja tyhjät rivit         |
| Punainen         | Lohkot, joissa on validointivirhe |

Kutistetut lohkot renderöidään pienemmällä läpinäkyvyydellä. Napsauta tai vedä mitä tahansa kohtaa minikartalla vierittääksesi ohjelmaluetteloa kyseiseen kohtaan. Näkymäikkunan osoitin (korostusvärinen suorakulmio) seuraa luettelon näkyvää osaa. Tila säilytetään käyttöliittymäasetuksissa (`blockMinimap`-näppäin).

### Operandisyöttö

- Haarautumis-/hyppyohjeille (`BNE`, `JMP`, `JSR` jne.) ilmestyy **otsikkovalitsin** -alasvetovalikko – napsauta määritettyä otsikkoa lisätäksesi sen.
- Numeromuotoilu seuraa työkalupalkin **HEX / DEC** -kytkintä (katso kohta 5).

---

## 4. ASM-näkymä

Oikea paneeli näyttää tuotetun tuotoksen reaaliajassa.

### Lähtötilat

| Tila               | Kuvaus                                                                                                                                                                                                                                                                                                                        |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ASM**            | 6502 kokoonpanolähde osoitteineen ja nimikkeineen                                                                                                                                                                                                                                                                             |
| **Näyttö**         | Heksa-/tavuvedos (C64-monitorityyli)                                                                                                                                                                                                                                                                                          |
| **Disasm**         | Pure 6502 -järjestelmän purkaminen: osoite · heksatavut · muistisäännöt ratkaistuilla numeerisilla operandeilla. Makrot on laajennettu yksittäisiksi käskyiksi (TEXT → LDA/STA-parit, LOOP → LDX jne.). BYTE/WORD/FILL-data näytetään lohkoina heksavedoksena. Tulosteessa ei ole makrojen nimiä, kommentteja tai merkintöjä. |
| Molemmat           | ASM ylhäällä, näyttö alhaalla                                                                                                                                                                                                                                                                                                 |
| **Purkaja**        | Sama kuin Disasm — oma välilehti purkamisnäkymälle                                                                                                                                                                                                                                                                            |
| **Työkalupaketti** | C64-viitepaneeli: 16-värinen palettimalli + PETSCII-ohjauskoodi ja tulostettava merkkiluettelo. Vain luku - lisätietoja alla olevasta "Työkalupaketti-välilehti"-osiosta.                                                                                                                                                     |
| **Asetukset**      | Ohjelma-asetusten paneeli — numeromuoto, makrolähteen vaihto, virheenkorjausparametrit                                                                                                                                                                                                                                        |

### Työkalupakki-välilehti

ASM-näkymän **Toolkit** -välilehti on vain luku -tilassa oleva pikaopaspaneeli – se ei koskaan muokkaa ohjelmaasi. Siinä on kaksi osiota:

| Osa                       | Sisältö                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **C64-väripaletti**       | 16 värimallin ruudukko, joka näyttää jokaisen C64-värin indekseineen (0–15 / `$00`–`$0F`) ja nimineen. Kopioi värimallin heksaindeksi leikepöydälle napsauttamalla sitä. Vie hiiri värin nimen päälle (vaaleansininen, ruskea jne.).                                                                                                                                                                                       |
| **PETSCII control codes** | Yleisiä ohjauskoodeja `CHROUT`:lle ($FFD2): värinvaihtokoodit (`$05` valkoinen, `$1C` punainen, `$1E` vihreä, `$1F` sininen, …), kohdistimen liike (`$11`/`$1D`/`$91`/`$9D`), peruutus päälle/pois (`$12`/`$92`), `$93` selkeä näyttö, `$8E`/`$0E` merkistökytkimet. Myös tulostettavan alueen muistilappu (32-64 välimerkit, 65-90 A-Ö, 91-95 sulkeet, 96-127 grafiikka, 160-191 siirretty grafiikka, 192-223 peilikuva). |

Toolkit on nopein tapa etsiä väri-indeksi tai PETSCII-ohjaustavu poistumatta editorista.

### Asetukset-välilehti

**Asetukset** -välilehti sisältää asetukset, jotka vaikuttavat koodin luomiseen ja tulosteen näyttämiseen:

- **Makron lähdekoodi** — kun asetus on PÄÄLLÄ, makromäärittelylohkojen (MACRO…ENDM) lähdekoodi näkyy ASM-näkymässä suoraan tekstissä.
- **Ohjelman aloitusosoite** – asetetaan nyt ohjelma-alueen **ORG-lohkon** kautta erillisen syöttökentän sijaan. Ensimmäinen ORG-lohko määrittää ohjelman latausosoitteen; seuraavat ORG-lohkot aloittavat lisäosiot eri osoitteista.
- **Virheenkorjausparametrit** — kolme rivikohtaista kytkintä, jotka ohjaavat ulkoiselle virheenkorjaajalle käynnistyksen yhteydessä välitettävät liput:
  - **`-jmp` ON/OFF** — hyppää suoraan ohjelman aloitusosoitteeseen latauksen jälkeen.
  - **`-unpause` PÄÄLLÄ/POIS** — käynnistää virheenkorjaajan tauon välittömästi latauksen yhteydessä.
  - **`-wait` ms PÄÄLLE/POIS** — lisää `-wait <ms>` viiveen ennen tauon jatkamista; valitse 500 ms tai 1000 ms pudotusvalikosta.
- **Käännöstiedot** — näyttää yhteenvedon käännetystä ohjelmasta (koodin aloitusosoite, koko, BASIC SYS -tynkätiedoston tila).

### ASM-rivin napsauttaminen

Napsauta mitä tahansa riviä ASM-näkymässä korostaaksesi ** vastaavan lohkon ** ohjelma-alueella.

### ASM-rivinumerot

ASM-paneeli näyttää **rivinumerot** (`001 |`, `002 |`, …) vianmäärityksen helpottamiseksi, kun käännösvirhe viittaa tiettyyn riviin.

- Visuaaliset rivinumerot ovat vain diagnostiikkaa varten.
- **Copy ASM** kopioi silti puhtaan lähdekoodin **ilman** rivinumeroiden etuliitteitä.

### Käännöksen edistymismodaali

Raskaampien toimintojen aikana näkyviin tulee keskitetty edistymisikkuna, jossa on edistymispalkki:

- **Suorita VICE-ohjelmassa** — PRG:n kääntäminen/rakentaminen ja emulaattorin käynnistäminen.
- **Debug** — PRG:n kääntäminen/muodostaminen ja debuggerin käynnistäminen.
- **Lataa .asm-tiedosto** — avaa `.asm`-tiedoston asiantuntijatilassa ja materialisoi lohkoja lähdekoodista.

Modaaliikkuna sulkeutuu automaattisesti, kun toiminto on suoritettu loppuun tai epäonnistuu.

---

## 5. Asetukset ja työkalupalkki

| Ohjaus                                       | Kuvaus                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Lukukanta (HEX / DEC / BIN)**              | Määrittää käyttöliittymän operandien näyttö-/syöttömuodon. BIN-tila näyttää arvot binäärimuotoisina, ja sen etuliite on `%` (esim. `%11111000`). ASM-näkymässä jokainen lohko näkyy aina omassa muodossaan.                                                                                                                                                                                                                                                                  |
| **Kieli**                                    | Vaihda käyttöliittymän kieleksi englanti, unkari, espanja, saksa ja hollanti (Nederlands)                                                                                                                                                                                                                                                                                                                                                                                    |
| **Teema**                                    | Vaalea / Tumma / OLED / Commodore 77 – valitse teeman valitsimesta Asetukset-valikosta. OLED käyttää puhtaan mustaa taustaa AMOLED-näytöissä. Commodore 77 on neonkeltainen mustalla pohjalla -teema; kun se on aktiivinen teema, käynnistyspaneeli käyttää teeman paneelin väriä (vastaa viestikorttia), näyttää pienemmän Commodore 77 -logon ja keltaisen edistymispalkin. Valittu teema otetaan käyttöön ennen ensimmäistä maalausta seuraavan käynnistyksen yhteydessä. |
| **CRT-retrotila**                            | Ottaa käyttöön koko näytön CRT-suodattimen: skannausviivat, fosforivinjetointi, välkkyminen ja tynnyrivääristymä. Tila tallennetaan istuntojen välillä.                                                                                                                                                                                                                                                                                                                      |
| **Näytä muistipaneeli**                      | Globaali kytkin, joka näyttää tai piilottaa koko C64-muistipaneelin                                                                                                                                                                                                                                                                                                                                                                                                          |
| **PERUSJÄRJESTELMÄN tynkä**                  | Lisää ohjelman alkuun BASIC-rivin, joka kutsuu SYS-komentoa.                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Näyte**                                    | Lataa sisäänrakennettu esimerkkiohjelma                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Lähennä/loitonna**                         | Skaalaa lohkon käyttöliittymää (vaikuttaa kaikkiin lohkoelementteihin)                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Tallenna projekti**                        | Tallenna nykyinen ohjelma `.json`-projektitiedostona                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Tallenna ohjelma nimellä**                 | Tallenna nykyinen ohjelma `.json`-projektitiedostona käyttämällä uuden tiedoston valintaikkunaa joka kerta                                                                                                                                                                                                                                                                                                                                                                   |
| **Lataa projekti**                           | Lataa aiemmin tallennettu projekti                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Tallenna työtila**                         | Tallenna tarkka joukko parhaillaan avoinna olevia, tiedostoihin tallennettuja välilehtiä — mukaan lukien aktiivinen välilehti ja kunkin välilehden editoritila (Lohko/Asiantuntija/Ultimate Basic) — `.vaws`-työtilatiedostoon.                                                                                                                                                                                                                                              |
| **Tallenna työtila nimellä**                 | Tallenna nykyinen työtila aina uuden tiedoston valintaikkunaan                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Avoin työtila**                            | Sulje kaikki avoimet välilehdet ja avaa uudelleen `.vaws`-työtilatiedostoon tallennettu tiedostojoukko.                                                                                                                                                                                                                                                                                                                                                                      |
| **Aseta työkansio**                          | Valitse tiedostovalitsimien ja tallennusikkunoiden käyttämä oletuskansio. Polku tallennetaan sovelluksen asetuksiin, ja valikoiden esikatselut pitävät polun lopun näkyvissä.                                                                                                                                                                                                                                                                                                |
| **Avaa projekti** (`Valikko → Tiedosto`)     | Avaa monitiedostoinen `.proj`-projekti ja avaa kaikki lähdekooditiedostot välilehdillä                                                                                                                                                                                                                                                                                                                                                                                       |
| **Tallenna projekti** (`Valikko → Tiedosto`) | Tallenna nykyinen `.proj` -projekti (projektipaneelin on oltava auki)                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Sulje projekti** (`Valikko → Tiedosto`)    | Sulje avoinna oleva projekti ja kaikki sen tiedostovälilehdet. Kehottaa tallentamaan tallentamattomat muutokset. Projektipaneeli palautuu tyhjään tilaansa.                                                                                                                                                                                                                                                                                                                  |
| **Lataa .asm-tiedosto**                      | Avaa `.asm`-tiedoston asiantuntijatilassa ja tuo tekstimuotoisen 6502 ASM:n nykyiseen välilehteen.                                                                                                                                                                                                                                                                                                                                                                           |
| **Tallenna PRG**                             | Vie käännetty binääritiedosto tiedostona `.prg`                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Rakenna CRT**                              | Vie ohjelma 64K Magic Desk (`.crt`, kasettityyppi 19) -tiedostona. Katso [Osa 12b](#12b-crt-export-magic-desk-64k-cartridge).                                                                                                                                                                                                                                                                                                                                                |
| **Suorita (jakopainike)**                    | Pääpainike **▶ Suorita** suorittaa nykyisen tilan; napsauta nuolta **▾** vaihtaaksesi seuraavien välillä: **Suorita PRG:nä** (käännä ja käynnistä VICE suoraan), **Suorita D64:n kautta** (pakkaa .d64-levykuvaan ja käynnistä VICE) tai **Suorita laitteistolla** (lähetä PRG C64 Ultimate / 1541 Ultimate -laitteeseen). Katso [Osa 12](#12-d64-export--run) ja [Osa 13]{2].                                                                                               |
| **Virheenkorjaus (RetroDebugger)**           | Käännä ja käynnistä RetroDebuggerissa käyttämällä keskeytyskohtia, symboleja ja automaattisen käynnistyksen lippuja (katso [Osio 9](#9-debugger-integration))                                                                                                                                                                                                                                                                                                                |
| **Suorita Exomizerilla**                     | Valintaruutu Asetukset-valikossa — kun tämä on käytössä, kaikki Suorita- ja Kokoonpanotoiminnot käsittelevät PRG:n `exomizer sfx sys` -komennon kautta ennen käynnistämistä tai tallentamista. Toimii seuraavien kanssa: Suorita PRG:nä, Suorita D64:n kautta, Suorita laitteistolla, Koonna PRG ja Koonna D64. Määritä Exomizer-suoritettava tiedosto ensin **Laitteistoasetukset** -komennossa.                                                                            |
| **Automaattinen tilannevedosten tallennus**  | Valintaruutu kohdassa **Laitteistoasetukset → Tilannekuva**. Kun tämä on käytössä, sovellus luo tilannekuvan automaattisesti noin 2,5 sekuntia sen jälkeen, kun lopetat välilehden muokkaamisen. Poista se käytöstä, jos haluat tallentaa tilannekuvia vain manuaalisesti.                                                                                                                                                                                                   |
| **Laitteistoasetukset**                      | Avaa laitteistokokoonpanon valintaikkuna — määritä VICE, Exomizer, RetroDebugger ja C64 Ultimate (isäntä, salasana, yhteystesti). Katso [Osa 13](#13-hardware-settings).                                                                                                                                                                                                                                                                                                     |
| **Uusi ohjelma…**                            | Avaa vahvistusikkunan ja tyhjentää sitten kaikki lohkot ohjelma-alueelta.                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Pitkännä kaikki**                          | Kutista kaikki lohkot                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Tietoja**                                  | Versiotiedot                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Uutta**                                    | Muutosloki                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |

### Projektin tilannevedokset

Projektin tilannevedokset tallennetaan levylle sidecar-JSON-tiedostoina, eivätkä localStorage-tallennustilaan. Ne on sidottu nykyiseen projektitiedostoon, jos sellainen on olemassa, joten historia säilyy uudelleenkäynnistyksen jälkeen ja seuraa projektia.

- **Valikko → Rakenna → Tallenna tilannekuva** avaa tilannekuvan valintaikkunan ja tallentaa lohkon nykyisen tilan sekä asiantuntijan ASM-tekstin.
- **Valikko → Rakenna → Palauta edellinen versio** palauttaa uusimman tilannevedoksen suoraan.
- **Valikko → Rakenna → Tilannevedoshistoria** avaa valintaikkunan, jossa voit lisätä muistiinpanoja, palauttaa vanhempia merkintöjä tai poistaa niitä.
- **Laitteistoasetukset → Tilannekuva → Automaattinen tilannevedosten tallennus** määrittää, luoko sovellus tilannevedoksia automaattisesti muokkausten jälkeen. Oletusviive on noin 2,5 sekuntia, ja asetus koskee välilehteä.
- Jos projektia ei ole vielä tallennettu, tilannevedokset tallennetaan sovelluksen asetushakemistoon, kunnes projekti saa tiedostopolun. | **Tietokanta** | Viitelinkit (6502 operaatiokoodit, C64 KERNAL, muistikartta, värit) | | **Tarkista päivitykset** | Avaa itch.io-sivu tarkistaaksesi uudemman julkaisun |

### Työtilat

**työtila** (`.vaws`-tiedosto) muistaa, mitkä oikeat, levyllä olevat tiedostot olivat auki kullakin välilehdellä – mukaan lukien kunkin välilehden editoritila ja mikä välilehti oli aktiivinen – joten voit avata saman tiedostojoukon uudelleen myöhemmin. Se on erillinen `.proj`-projektista: työtila voi kattaa minkä tahansa yhdistelmän Block/Expert `.json` -projektitiedostoja, itsenäisiä `.asm`-tiedostoja ja Ultimate Basic `.ub`/`.proj` -lähteitä useilla välilehdillä.

- Työtilat **tallennetaan automaattisesti** muutaman sadan millisekunnin kuluttua muutoksen tallentamisesta tai avaamisesta.
- Sovellus **palauttaa automaattisesti viimeisimmän työtilasi** käynnistyksen yhteydessä, joten avoimet välilehdet jatkuvat siitä, mihin jäit.
- Työtilaan tallennetaan vain levyllä olevaan oikeaan tiedostoon perustuvat välilehdet; tallentamatonta esimerkkiä tai vain muistissa olevaa ohjelmaa sisältävällä välilehdellä ei ole mitään säilytettävää, ja se ohitetaan (ja näytetään ilmoitus, jos mikään avoimista välilehdistä ei täytä vaatimuksia).
- Työtilan avaaminen sulkee ensin kaikki avoimet välilehdet – sinua pyydetään vahvistamaan se ennen kuin työtila avautuu.
- Jos työtila viittaa tiedostoon, joka on sittemmin siirretty tai poistettu, kyseinen merkintä ohitetaan ja ilmoitetaan nimellä latauksen jälkeen.

### Lataa .asm-tiedosto (pikaopas)

Expert-tilan `.asm`-lataaja hyväksyy yleiset 6502-lähdekoodimallit ja muuntaa ne lohkoiksi:

- `* = $1500` → ORG block
- `Merkki:` → LABEL-lohko
- `Label: .byte 0` → LABEL + BYTE blocks
- `.byte ...` → BYTE block
- `; comment` (or inline `; ...`) → COMMENT block
- käskyt (`lda`, `jsr`, `beq`, jne.) → käskylohkot, joilla on havaittu osoitetila

#### Tuonnin jäsennyshuomautukset ja parhaat käytännöt

- Paikalliset otsikot, kuten `.wait`, tuodaan vakiootsikoina (piste poistettu), ja viittaukset normalisoidaan vastaavasti.
- Käytä `($zp),Y` / `($zp,X)` -tyyppisissä osoitteissa konkreettista nollasivutavua (`$FB`, `$FC` jne.) parhaan yhteensopivuuden saavuttamiseksi.
- Vältä haarakonteksteissa monitulkintaisia lyhyitä nimiä, jotka näyttävät heksadecimaalilta (`cc1`, `dead`, `beef`); käytä mieluummin nimiä kuin `loop_cc1`.
- Jos ohjelmasi alkaa datamerkillä (`.byte`) ennen suoritettavaa koodia, lisää alkuun eksplisiittinen hyppymerkki (esimerkiksi `JMP Start`).

### ASM-tuonti (Kick Assembler)

Ohjelmavalikon **ASM-tuonti** -painike tuo raakana olevan Kick Assembler -lähdekoodin uudelle lohkotilavälilehdelle. Se on erillinen yllä olevasta Expert-tilan `Lataa .asm-tiedosto` -painikkeesta — sen mukautettu työkaluvihje ilmoittaa, että **vain Kick Assembler -koodia tuetaan** (muut assemblerit saattavat jäsentää osittain, mutta edestakaista käsittelyä ei taata).

Tuetut kuviot:

- `.pc = $XXXX` alkuperädirektiivi → ORG-lohko
- `.const NAME = value`, `.label NAME = value` → CONST equate
- `.makro NIMI(p1, p2, ...) { ... }` with `{`/`}` tuen runko tai `.endm` → käyttäjämakron määritys
- Makron kutsu `NAME(args)`, Kick-kaksoispisteen etuliite `:NAME(args)` ja `.invoke NAME(args)` — kaikki edestakaisin Kick-kaksoispisteen lomakkeen kautta
- `@local`-tunnisteet (`@loop:`, `BEQ @loop`) säilyttävät etuliitteen `@` sellaisenaan
- Operandi `merkintä + N` / `merkintä - N` (esim. `STA mod1+2`, `LDA xp+1`)
- Rivikommentit `// ...` ja `;` — molemmat hyväksytään, `/* ... */` lohkoja käsitellään yhtenä kommenttirivinä
- BASIC-automaattisen käynnistyksen läpikulku: kun ohjelma käynnistyy kohdasta `$0801` standardilla `SYS 2061` tavutynkällä (`.byte $0B,$08,$0A,$00,$9E,$32,$30,$36,$31,$00,$00,$00`), kääntäjä lähettää PRG:n sanatarkasti sen sijaan, että käärittäisi sen ympärille toisen BASIC SYS -järjestelmän.

Tunnettu rajoitus:

- Vakiot, jotka ratkeavat nollasivuosoitteeseen (esimerkiksi `.const BYTEADDR = $FC`, jota käytetään muodossa `STA BYTEADDR`), kääntyvät tällä hetkellä absoluuttisen tilan käskyiksi (3 tavua) nollasivun (2 tavua) sijaan. Käännetty koodi kirjoittaa edelleen oikeaan muistipaikkaan, vain pienemmällä koolla ja syklimäärällä verrattuna samaan Kick Assemblerin rakentamaan lähdekoodiin.

## UltimateBasic-tila

Visual Assembler sisältää täydellisen **Ultimate Basic IDE:n**. Ultimate Basic on moderni käännetty BASIC-kieli C64-ohjelmien, pelien ja demojen luomiseen ilman, että jokaista operaatiota tarvitsee kirjoittaa matalan tason 6502-assembleriin. Kääntäjä toimii paikallisesti ja luo natiivin C64 PRG -tulosteen.

### UB-editorin avaaminen

Valitse **UB** -kuvake päätyökaluriviltä vaihtaaksesi Ultimate Basic -tilaan. Valittu editoritila muistetaan sovelluksen uudelleenkäynnistyksen jälkeen. Uusi lähdekoodi alkaa:

```basic
color bg 0
color border 0

print "HELLO FROM ULTIMATE BASIC"
```

UB-tila toimii `.ub`-lähdetiedostojen kanssa. **Uusi**, **Avaa**, **Tallenna** ja **Tallenna nimellä** toimivat aktiivisella UB-välilehdellä. Tiedoston `.ub` avaaminen aktivoi vastaavan editorivälilehden automaattisesti.

Työkalurivi näyttää nykyisen UB-työkansion. Tämä kansio on tallennettu erilleen Lohko/Asiantuntija-työkansiosta. Kun UB-tila on aktiivinen, **Tiedosto → Aseta työkansio** valitsee UB-kansion; sen työkaluvihje osoittaa aktiivisen laajuusalueen. UB:n Avaa/Tallenna-valintaikkunat alkavat siitä, ja tallentamattomat lähteet käyttävät sitä pohjana suhteellisille `include`- ja `incbin`-poluille.

### Editorityökalut

UB-työkalurivi noudattaa samaa visuaalista kieltä ja mukautettuja työkaluvihjeitä kuin asiantuntijatila. Se tarjoaa:

- syntaksin korostus nykyisen Ultimate Basic -kielireferenssin perusteella;
- rivinumerot, jotka pysyvät synkronoituina pitkien tiedostojen kanssa;
- minikartta ja editorin zoomaussäätimet; napsauta minikarttaa hypätäksesi tai vedä sen näkymän valintaa jatkuvaa vierittämistä varten;
- Etsi (`Ctrl+F` / `Cmd+F`) asiantuntijatyylisen hakupalkin avulla;
- lähdekoodin muotoilu rakennetietoisella sisennyksellä;
- automaattinen täydennys komennoille ja sisäänrakennetuille funktioille;
- haettava **Komennot** -paneeli, jossa on syntaksi, kuvaus ja käyttöohjeet – kuvaukset noudattavat nykyistä käyttöliittymän kieltä (unkari, englanti, espanja, saksa, hollanti) ja palaavat englanniksi kaikissa vielä kääntämättömissä komennoissa;
- itsenäisesti kytkettävät **Projekti**- ja **Komennot**-paneelit, jotka näkyvät vierekkäin, kun molemmat ovat käytössä;
- itsenäisesti kytkettävät ja koon muutettavat **Build Output**- ja **Disassembly**-paneelit.

Purkamispaneeli sisältää **Kopioi**-painikkeen, joka kopioi koko näytetyn lähdekoodin leikepöydälle. Komento-ohjeet seuraavat mukana tulevaa kääntäjää: esimerkiksi `sprite_frame id, data_address [, frame]` valitsee animaatiokuvan peräkkäisistä 64-tavuisista sprite-kehyksistä.

Komentoluettelon korkeus on tarkoituksella rajoitettu, jotta komentotietokortti voi täyttää paneelin jäljellä olevan korkeuden. Tietoalue vierii itsenäisesti pidempiä syntaksikuvauksia varten.

### Projektit, välilehdet ja käynnistystiedostot

Ultimate Basic -projektit käyttävät `.proj`-tiedostoja ja voivat sisältää useita `.ub`-lähteitä. Projektipaneeli listaa avoimet tiedostot, merkitsee tallentamattomat välilehdet ja näyttää löydetyt otsikot, funktiot ja aliohjelmat. Projektitoimintojen avulla voit luoda, avata, tallentaa ja sulkea projektin tai lisätä toisen lähdetiedoston.

Merkitse projektitiedosto **käynnistystiedostoksi** napsauttamalla sen vieressä olevaa tähteä. Build-, Run-, D64-, C64 Ultimate- ja Debug-komennot kääntävät kyseisen käynnistyslähteen, vaikka aktiivinen välilehti olisi parhaillaan toinen. Ilman käynnistysvalintaa käytetään aktiivista UB-välilehteä.

### Rakennus ja diagnostiikka

**Build**-painike avaa saman keskitetyn edistymisnäkymän, jota käytetään muissa Visual Assembler -työnkuluissa. Onnistuneet koonnit päivittävät koontitulosteen, koontitiedot ja purkamisen. Ota **Verbose** käyttöön sisällyttääksesi kääntäjän muistikarttatiedot, sisäiset nollasivuvaraukset ja luodun koodin tiedot.

Kun kääntäminen epäonnistuu:

- Tuloste tulee näkyviin automaattisesti;
- kääntäjävirheet näkyvät punaisena;
- keskitetty käännösikkuna näyttää virheen;
- Lähderivillä varustetut virheet valitsevat kyseisen rivin aktiivisessa UB-editorissa.

Build Info raportoi lataus-/loppuosoitteet, koodin ja PRG-koot, Exomizer-tilan, muuttujat, taulukot, funktiot/aliohjelmat ja otsikot.

### Juoksu, D64 ja Exomizer

Pääjakopainike **Suorita** tukee Ultimate Basic -tilaa kaikissa normaaleissa kohteissa:

| Suoritustila                  | Perimmäinen peruskäyttäytyminen                                                       |
| ----------------------------- | ------------------------------------------------------------------------------------- |
| **Suorita PRG:nä**            | Käännä ja käynnistä PRG suoraan VICE:ssä.                                             |
| **Suorita D64:n kautta**      | Käännä, avaa D64:n tavallinen pakkausvalintaikkuna ja käynnistä sitten levy VICE:ssä. |
| **Aja Ultimatella**           | Lataa ja suorita PRG konfiguroidun C64 Ultimate REST -yhteyden kautta.                |
| **Suorita D64 laitteistolla** | Pakkaa D64 ja lähetä se konfiguroituun C64 Ultimateen.                                |

Globaali **Asetukset → Exomizer** -vaihtoehto koskee myös UB-koontiversioita ja normaalisti suoritettavia kohteita; erillistä UB-työkalupalkin vaihtokytkintä ei tarvita. Virheenkorjauskäynnistykset käyttävät tarkoituksella pakkaamatonta PRG:tä, jotta kääntäjän osoitteet ja symbolit vastaavat edelleen suoritettavaa ohjelmaa.

Ota käyttöön **Asetukset → Ohjelman asetukset → Luo UltimateBasic ASM -lähdekoodi (.asm)** tallentaaksesi kääntäjän luoman kokoonpanon PRG- tai D64-koontitiedoston viereen käyttäen samaa perustiedostonimeä. Tämä on koontivaihtoehto, joten UB-työkalurivi ei sisällä erillisiä ASM-vientipainikkeita. `load "NIMI", $osoite` -lauseke antaa myös vastaavan D64-lisätiedoston PRG-latausosoitteen.

### Virheenjäljityssymbolit ja purkaminen

Koontit pyytävät Ultimate Basic -virheenkorjaustietoja ja tuottavat kolme yhteensopivaa sivuvaunua:

- `.sym` KickAssembler-tyylisille symboleille;
- `.dbg` C64Debugger/RetroDebugger -lähdekoodin ja segmentin tiedoille;
- `.vs` VICE-näyttöjen nimille.

Väritetty UB Disassembler -paneeli selvittää tunnetut otsikot ja näyttää osoitteet, tavut, muistisäännöt ja operandit. **Debug** -painike käynnistää RetroDebuggerin, jossa on raaka UB PRG, debug-sivuvaunut sekä kääntäjän otsikot, funktiot, aliohjelmat, muuttujat ja taulukot. Debug-odotus- ja palautusasetukset ovat yhteiset normaalin Visual Assembler -debuggerin kokoonpanon kanssa.

### Ultimate Basic -käyttöohje ja lähdekoodi

UB-työkalupalkin kirjakuvake avaa vastaavan Ultimate Basic `MANUAL.pdf` -tiedoston offline-tilassa; aloitusikkunan käyttöohje-painike avaa saman käyttöohjeen. Visual Assembler ottaa sekä kääntäjän että PDF-tiedoston kiinnitetystä ylävirran Git/Cargo-riippuvuudesta, joten IDE ei ylläpidä toista kopiota Ultimate Basic -toteutuksesta. Tietoja-valintaikkuna ja aloitusnäyttö näyttävät riippuvuuden todellisen version.

Ultimate Basic on saatavilla myös itsenäisenä avoimen lähdekoodin projektina:

<https://github.com/zstarczali/UltimateBasic>

Kääntäjä on integroitu Visual Assembleriin, joten erillistä `ub`-suoritustiedostoa ei tarvita ajonaikana.

## 6. Asiantuntijatila

Expert Mode on täysin varusteltu suoratekstinen 6502-assemblyer-editori, joka toimii lohkoeditorin rinnalla. Jokainen välilehti voi olla joko lohkotilassa tai asiantuntijatilassa – voit vaihtaa niiden välillä vapaasti milloin tahansa yläpalkin **Lohko / Asiantuntija** -valitsimella.

### Vaihtotilat

- **Lohko → Asiantuntija:** Nykyinen ohjelma sarjoitetaan tekstiksi (yksi käsky riviä kohden, otsikot, makrot direktiiveinä). Asiantuntija-tilassa tehdyt muokkaukset synkronoidaan takaisin lohkotaulukkoon aina, kun vaihdat takaisin tai käynnistät toiminnon.
- **Asiantuntija → Lohko:** teksti jäsennetään funktiolla `parseAsmText()` ja tulos korvaa lohko-ohjelman. Jos jäsennys epäonnistuu, näkyviin tulee käännösvirheilmoitus.
- **Tyhjät rivit** säilyvät tekstinkerroissa: tyhjät rivit näkyvät Expert-editorissa ohuina katkoviivoina välilyönteinä lohkotilassa ja palautetaan tyhjinä riveinä, kun palataan Expert-tilaan.

### Editorin asettelu

```
┌──────────────────────────────────────────────────────┐
│ [toolbar]  Block │ Expert < tab toggle               │
├────────────┬────────────────────────────┬────────────┤
│  Palette   │   ASM text editor          │  Disasm    │
│  (opt.)    │   (monospace, editable)    │  panel     │
│            │                            │  (opt.)    │
└────────────┴────────────────────────────┴────────────┘
```

| Paneeli                | Vaihda                          | Kuvaus                                                                                                              |
| ---------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Paletti**            | `#asiantuntijapaletin-painike`  | Vasen lohkopaletti – vedä lohkot editoriin tai napsauta lisätäksesi kursorin kohdalle                               |
| **ASM-editori**        | aina näkyvissä                  | Täysi monospace-tekstialue reaaliaikaisella syntaksin korostuksella                                                 |
| **Poista asm-paneeli** | `#asiantuntijan-disasm-painike` | Pure 6502 -purku: jokainen käsky näyttää osoitteen, heksatavut ja numeeriset operandit; makrot täysin laajennettuna |

### Työkalurivin painikkeet

| Painike                               | Henkilöllisyystodistus                                                | Toiminto                                                                                                                                                                                                                                                     |
| ------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Muoto**                             | `#asiantuntijan-muotoilu-painike`                                     | Lähteen automaattinen muotoilu (otsikot sarakkeeseen 0, 4-välilyöntinen sisennys, 1-välilyöntinen muistikoodi/operandi)                                                                                                                                      |
| **Lataa .asm-tiedosto**               | `#expert-load-asm-btn`                                                | Avaa `.asm`-tiedosto — sisältö ladataan **uuteen välilehteen**, jonka välilehden otsikkona on tiedostonimi. Jokaisesta ladatusta tiedostosta tulee itsenäinen välilehti, jolla on omat ohjelmalohkonsa ja editorin tilansa.                                  |
| **Tallenna .asm-tiedosto**            | `#asiantuntijan-tallennus-asm-painike`                                | Tallenna editorin sisältö tiedostoon `.asm` (tiedostovalintaikkuna ensimmäisen tallennuksen yhteydessä)                                                                                                                                                      |
| **Rakennuksen tiedot**                | `#expert-build-info-btn`                                              | Avaa Rakennetiedot-valintaikkuna (alkuperä, koko, tunnisteet, virheet)                                                                                                                                                                                       |
| **HL**                                | `#asiantuntijan-painike`                                              | Ota syntaksin korostus käyttöön (poista käytöstä erittäin suurissa tiedostoissa)                                                                                                                                                                             |
| **Automaattinen täydennys**           | `#asiantuntijan-automaattisen-täydennyksen-painike`                   | Ota asiantuntijan automaattisen täydennyksen ehdotukset käyttöön/pois käytöstä. Kun tämä on poistettu käytöstä, asiantuntijaeditorissa ei näy ohjeita, muistisääntöjä tai otsikoita.                                                                         |
| **Alueen valinta**                    | `#asiantuntija-alueen-valintapainike`                                 | Ota automaattinen alueen korostus käyttöön asiantuntijatilassa. Taittotila pysyy tallennettuna, mutta kun tämä on pois päältä, editori pitää koko lähdekoodin näkyvissä eikä valitse nykyistä aluetta automaattisesti.                                       |
| **Suuntaa / laajentaa kaikki alueet** | `#expert-region-fold-all-btn`                                         | Taita tai avaa jokainen `.region`-lohko yhdellä napsautuksella. Jos jokin alue on parhaillaan auki, painike kutistaa ne kaikki; jos kaikki alueet on jo kutistettu, seuraava napsautus laajentaa ne kaikki. Painike syttyy, kun kaikki alueet on kutistettu. |
| **Rivinumerot**                       | `#asiantuntijan-rivinumerot-painike`                                  | Rivinumerovälin pitäminen päällä/pois editorin vasemmalla puolella. Väliviiva pysyy synkronoituna vierityskohdan kanssa ja päivittyy reaaliajassa kirjoittaessasi.                                                                                           |
| **Etsi**                              | `#asiantuntijan-etsintäpainike`                                       | Avaa kelluva hakupalkki (`Ctrl+F`). Kirjoita hakeaksesi; osumat näkyvät korostettuna hakukentässä. `Enter` / `Shift+Enter` selaa osumien välillä. `Esc` sulkee palkin.                                                                                       |
| **Loitonna / lähennä**                | `#asiantuntijan-loitonnuspainike` / `#asiantuntijan-loitonnuspainike` | Pienennä/suurenna editorin fonttikokoa (8–28 px). Asetus pysyy voimassa.                                                                                                                                                                                     |
| **Paletti**                           | `#asiantuntijapaletin-painike`                                        | Näytä/piilota vasen muistitoimintojen paletti                                                                                                                                                                                                                |
| **Disasm**                            | `#asiantuntijan-disasm-painike`                                       | Näytä/piilota purkupaneeli (puhdas 6502, makrot laajennettu)                                                                                                                                                                                                 |
| **Näyttö**                            | `#asiantuntijan-monitorin-painike`                                    | Näytä/piilota näytön heksadesimaalipaneeli                                                                                                                                                                                                                   |
| **Minikartta**                        | `#asiantuntijan-minikarttapainike`                                    | Näytä/piilota koodin minimap-nauha editorin oikealla puolella                                                                                                                                                                                                |

Editorin pikanäppäimet: `Ctrl+/` (`Cmd+/` macOS:ssä) kommentoi nykyistä riviä tai jokaista valittua riviä; `Shift` poistaa edellä olevan kommenttimerkin kyseisiltä riveiltä. Rivin sisäiset kommentit (esimerkiksi `LDA $12 ; selitys`) pysyvät käskyrivillä vaihdettaessa Expert- ja Lohkotilan välillä. Lohkotila näyttää ne vihreänä kursiivina `; kommentti`-merkkinä lohkon otsikossa; merkin pitäminen osoittimen päällä paljastaa koko tekstin, kun se on katkaistu.

### Asiantuntijaeditorin minikartta

Asiantuntijaeditorin minikartta on kapea, pieni kaistale (`88 px`) editorialueen oikeassa reunassa. Se näyttää jokaisen lähdekoodin rivin skaalattuna:

| Palkin väri      | Tunnuksen tyyppi                                        |
| ---------------- | ------------------------------------------------------- |
| Kommentin väri   | Viivat, jotka alkavat merkeillä `;`                     |
| Tarran väri      | Rivit, joiden määritelmä on `:`                         |
| Direktiivin väri | `.byte`, `.macro`, `.region` ja kaikki muut direktiivit |
| Muistiväri       | Kaikki muu (ohjeet)                                     |

Läpinäkyvä **näkymän ilmaisin ** (korostusvärillä varustettu suorakulmio) näyttää, mikä osa lähteestä on tällä hetkellä näkyvissä. Napsauta mitä tahansa kohtaa minikartalla siirtyäksesi kyseiseen kohtaan; vedä vierittääksesi jatkuvasti. Minikartta vierii itsenäisesti pitäen näkyvyyden ilmaisimen keskitettynä. Tila säilyy käyttöliittymäasetuksissa (`expertMinimap`-näppäin).

### Virhe korostuksessa

Kääntymättömät rivit korostetaan reaaliajassa punaisella **** (sävytetty tausta + vasen aksenttireunus) 350 ms jokaisen näppäinpainalluksen jälkeen. Ensimmäinen virheilmoitus näkyy myös tilarivillä. Korjaa rivi, niin korostus katoaa automaattisesti.

### Syntaksikorostus

Editori käyttää läpinäkyvää `<div>`-peittokuvaa (`expert-hl`), joka peilaa tekstialueen sisällön värillisillä `<span>`-elementeillä. Korostuksen voi poistaa käytöstä **HL**-painikkeella, mikä parantaa suorituskykyä erittäin suurissa ohjelmissa.

| Väri         | Tunnus                                                                                                                                                                 |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Keltavihreä  | Muistitekniikat (`LDA`, `STA`, `JMP`, …) ja pitkän haaran pseudo-operaatiot (`LBNE`, `LBEQ`, …)                                                                        |
| Sininen      | Direktiivit (`.byte`, `.word`, `.fill`, `.assert`, `*=`, …)                                                                                                            |
| Oranssi      | Numerot (`$FF`, `%1010`, `255`)                                                                                                                                        |
| Syaani       | Otsikot — rivit, jotka päättyvät `:`, mukaan lukien paikalliset otsikot (`.loop:`) ja itseään muokkaavan koodin operandin otsikot (`value:` kohdassa `LDA value:#$00`) |
| Sinivihreä   | Merkkijonoliteraalit                                                                                                                                                   |
| Tummanvihreä | Kommentit (`; …`)                                                                                                                                                      |

`ALUE` / `ENDREGION` -direktiivit on korostettu kuten muutkin assembler-direktiivit. Kutistetut alueet pitävät vain alueen otsikon näkyvissä editorissa, kunnes avaat ne uudelleen. Uusi **Alueen valinta** -työkalurivin kytkin ohjaa vain automaattista nykyisen alueen korostusta asiantuntijatilassa; sen poistaminen käytöstä pitää lähdekoodin näkyvissä muuttamatta taittotilaa.

### Lähdekoodin muotoilija

Napsauta **Format**-painiketta (`#expert-format-btn`) muotoillaksesi nykyisen lähteen automaattisesti:

- Tunnistemääritelmät siirretään sarakkeeseen 0.
- Ohjeet on sisennetty neljällä välilyönnillä.
- Muistisääntö kirjoitetaan isoilla kirjaimilla.
- Täsmälleen yksi välilyönti muistimerkinnän ja operandin välillä (ylimääräinen välilyönti normalisoidaan).
- Jos lähde on jo alustettu, näytetään tila `"Jo alustettu"`.

### Projektipaneeli ja välilehdet

Asiantuntijatila tukee **projektipaneelia** (`#expert-project-panel`) monitiedostoisille `.proj`-projekteille:

- `.proj`-tiedosto on JSON-manifesti, joka listaa lähdetiedostot ja niiden metatiedot.
- Avaa projekti valitsemalla **-valikko → Tiedosto → Avaa projekti** tai raahaamalla `.proj`-tiedosto ikkunaan.
- Jokainen projektin tiedosto avautuu erillisenä **-välilehtenä** editorin yläreunassa olevassa välilehtipalkissa.
- **Sulje projekti** (`Valikko → Tiedosto → Sulje projekti` / `#menu-close-project`) sulkee nykyisen projektin ja kaikki sen tiedostovälilehdet kerralla. Kehottaa tallentamaan tallentamattomat muutokset ennen sulkemista. Projektipaneeli palautuu tyhjään tilaansa ja `_expertProjectData` tyhjennetään.
- Jokainen tiedosto voidaan merkitä **käynnistystiedostoksi** (★ tähtikuvake). Kun käynnistystiedosto on asetettu, **Suorita** -painike (PRG, D64, Ultimate) kokoaa ja suorittaa aina kyseisen tiedoston koodin – riippumatta siitä, mikä välilehti on kulloinkin aktiivinen. Tämä toimii sekä lohkotilassa että asiantuntijatilassa.
- Projektipaneelin alareunassa olevan **symbols**-osion kokoa voidaan muuttaa pystysuunnassa tiedostopuun ja symboliluettelon välisellä jakajalla, joten pitkät symboliluettelot voivat viedä enemmän tilaa tarvittaessa.

### Välilehtipalkki

Välilehtipalkki näkyy editorin yläpuolella, kun avoinna on useampi kuin yksi välilehti.

| Ominaisuus                   | Kuvaus                                                                                                                                                                                                                                                                                                                                                                              |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Likainen piste**           | Pieni korostusvärinen piste välilehden nimessä osoittaa tallentamattomat muutokset                                                                                                                                                                                                                                                                                                  |
| **Vieroitusnäppäimet**       | Vasen/oikea vierityspainikkeet tulevat näkyviin, kun välilehtiä on enemmän kuin palkkiin mahtuu                                                                                                                                                                                                                                                                                     |
| **Sulje (×)**                | Sulkee välilehden; kehottaa tallentamaan, jos välilehti on likainen                                                                                                                                                                                                                                                                                                                 |
| **Tiedostopääte**            | Tiedoston koko nimi tiedostopäätteineen (`.c64va`, `.json`) näytetään.                                                                                                                                                                                                                                                                                                              |
| **Kakkospainikkeen valikko** | Napsauta välilehteä (tai tyhjää välilehtipalkin tilaa) hiiren kakkospainikkeella seuraaville: **Uusi välilehti**, **Sulje välilehti**, **Sulje muut välilehdet**, **Sulje oikeanpuoleiset välilehdet**, **Sulje kaikki välilehdet**. Eräsulkemistoiminnot kehottavat jokaista likaista välilehteä ja pysähtyvät, jos peruutat. **Sulje kaikki** pitää aina yhden tyhjän välilehden. |

> **Vinkki:** Paletin synkronointi (`#expert-palette-sync-btn`) pitää palettivalinnan synkronoituna kohdistimen kohdalla olevan muistimerkin kanssa. Poista se käytöstä, jos et halua paletin hyppivän muokkaamisen aikana.

---

## 7. Osoitustavat

Jokainen 6502-käsky tukee yhtä tai useampaa osoitustilaa. Tilavalitsin näkyy jokaisessa lohkossa.

| Tila               | Tarra               | Esimerkki             | Kuvaus                                                                    |
| ------------------ | ------------------- | --------------------- | ------------------------------------------------------------------------- |
| **implisiittinen** | Implisiittinen      | `EI `                 | Ei operandia; käsky on itsenäinen                                         |
| **välitön**        | Välitön             | `LDA #$FF`            | Rivinsisäinen vakio; assembler lisää `#` automaattisesti                  |
| **nollasivu**      | Nolla sivua         | `LDA $10`             | Yksitavuinen osoite sivulla nolla (0–255)                                 |
| **nollasivuaX**    | Nolla sivua, X      | `LDA $10,X`           | Sivun osoite nolla + X-rekisterin siirtymä (tulos rivittyy sivulle 0)     |
| **nollasivuaY**    | Nolla sivua, Y      | `LDX $FB,Y`           | Nollasivun osoite + Y-rekisterin siirtymä                                 |
| **absoluuttinen**  | Absoluuttinen       | `LDA 0400 $`          | Täysi 16-bittinen muistiosoite                                            |
| **absoluuttinenX** | Absoluuttinen, X    | `LDA $0400,X`         | 16-bittinen osoite + X-rekisterin offset                                  |
| **absoluuttinenY** | Absoluuttinen, Y    | `LDA $0400,Y`         | 16-bittinen osoite + Y-rekisterin offset                                  |
| **suhteellinen**   | Sukulainen/Tunniste | `BNE-silmukka`        | Haarakonttorin ohjeita varten anna tunnisteen nimi tai kohdeosoite        |
| **epäsuoraX**      | Epäsuora, X         | `LDA ($FB,X)`         | Nollasivun indeksointi epäsuorasti (operandi = nollasivun osoite, 1 tavu) |
| **epäsuoraY**      | Epäsuora, Y         | `LDA ($FB),Y`         | Nollasivu epäsuora indeksointi (operandi = nollasivun osoite, 1 tavu)     |
| **epäsuora**       | Epäsuora            | `JMP (0100 dollaria)` | Epäsuora; käytettävissä vain JMP:n kanssa                                 |

### Merkitse lausekkeet operandeiksi

Mikä tahansa operandikenttä, joka hyväksyy osoitteen tai välittömän arvon, hyväksyy myös suoraan **vakion nimen** (`CONST`-lohkosta tai `LABEL`-lohkosta). Lisäksi voit käyttää **label+offset**- tai **label−offset**-lausekkeita viitataksesi osoitteeseen suhteessa nimettyyn vakioon:

| Syntaksi          | Esimerkki                      | Kuvaus                                                                                                            |
| ----------------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `tarra`           | `STA näyttö_ram,X`             | Ratkaisee otsikon/vakion arvon                                                                                    |
| `tarra+$heksa`    | `STA näyttömuisti + $0100, X ` | Nimikkeen osoite ja heksadesimaalioffset                                                                          |
| `tarra+desimaali` | `STA näyttö_ram+256,X`         | Nimikkeen osoite ja desimaaliero                                                                                  |
| `tarra-$hex`      | `LDA-pöytä - 10 dollaria`      | Nimikkeen osoite ilman heksadesimaalioffsettia                                                                    |
| `#<tunniste`      | `LDA #<näyttö_ram`             | Otsikon osoitteen pienin tavu                                                                                     |
| `#&gt;tarra`      | `LDA #&gt;näyttö_RAM`          | Nimikkeen osoitteen korkeampi tavu                                                                                |
| `*`               | `BNE *`                        | Nykyinen ohjelmalaskuri (käskyn oma osoite); haarat, joissa on `*`, luovat äärettömän itsesilmukan (offset `$FE`) |

**Esimerkki — kahden näyttösivun tyhjentäminen CONST:**-muuttujalla
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

*(Uutta versiossa 2.3.9.)* `*` ei enää rajoitu olemaan koko operandi – se voi esiintyä **missä tahansa operandilausekkeen sisällä** ja edustaa sen käskyn osoitetta, johon se on kirjoitettu. Se ratkaistaan kokoonpanovaiheessa kyseisen käskyn todellista osoitetta vasten, joten lyhyille suhteellisille hyppyille tai PC:hen suhteellisille datan lukukerroille ei tarvita tunnistetta.

| Syntaksi            | Esimerkki                  | Merkitys                                             |
| ------------------- | -------------------------- | ---------------------------------------------------- |
| `*`                 | `BNE *`                    | Haara itseensä (ääretön silmukka, offset `$FE`)      |
| `*-n` / `*+n`       | `BNE *-5`, `BEQ *+4`       | Haarautuminen suhteessa nykyiseen PC:hen *n* tavulla |
| `JMP *+n`           | `JMP *+20`                 | Absoluuttinen hyppy laskettuna nykyisestä PC:stä     |
| `#&lt;*` / `#&gt;*` | `LDA #&lt;*`, `LDA #&gt;*` | Nykyisen tietokoneen pienin/korkein tavu             |
| `#&gt;(*+n)`        | `LDA #&gt;(*+63)`          | PC:hen liittyvän osoitteen alempi/ylempi tavu        |

**PC vs. kertolasku.** `*` käsitellään ohjelmalaskurina vain, kun se on *arvopaikalla* — lausekkeen alussa tai heti operaattorin `(`, `,`, `&lt;`, `&gt;` tai välilyönnin jälkeen. Numeron `)` tai tunnisteen perässä oleva `*` on tavallinen kertolasku, joten `LDA-taulukko*2` ja `CONST_A*4` pysyvät muuttumattomina.

**Missä se toimii.** Mikä tahansa operandi, joka jo hyväksyy lausekkeen: haarautumiskohteet, `JMP` / `JSR`, `LDA`/`STA`/… absoluuttiset ja indeksoidut, välittömät matalan/korkean tavun operaattorit ja `.assert`-lauseke. `*` ei koskaan muuta käskyn kokoa, joten se on turvallinen kaikissa osoitustiloissa.

### Paikalliset (pisteviivalla) tunnisteet

*(Uutta versiossa 2.3.9.)* Pisteellä alkava tunniste — `.loop`, `.skip`, `.done` — on **paikallinen tunniste**. Se kuuluu lähimmän edeltävän **global** (ei-pisteellinen) tunnisteen piiriin ja siitä tulee sisäisesti `<global>.<nimi>`. Kaksi paikallista tunnistetta, joilla on sama lyhyt nimi eri globaalien tunnisteiden alla, eivät törmää **ei**.

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
- Viittaa siihen toisesta laajuusalueesta eksplisiittisesti muodossa `Global.name` (esim. `JMP ClearScreen.loop`).
- Ennen globaaleja tunnisteita kirjoitettu `.name` pysyy tavallisena ylimmän tason tunnisteena `.name`.
- Paikalliset otsikot kulkevat edestakaisin lohko ⇄ asiantuntija -tilassa muuttumattomina; etuliite `<globaali>.` on asetteluaikainen yksityiskohta, eikä sitä koskaan tallenneta lohko-ohjelmaan.

### Itsemuokkaavan koodin operanditunnisteet

*(Uutta versiossa 2.3.9.)* Lisää käskyn operandin etuliitteeksi `tunniste:`, jos haluat asettaa tunnisteen **operandin tavulle** operaatiokoodin sijaan. Käsky kootaan kaksoispistettä seuraavasta kohdasta.

```
setup:
    LDA value:#$00     ; 'value' -> address of the #$00 operand byte
    ...
patch:
    LDA #new
    STA value          ; writes the operand byte directly — classic SMC
```

`arvo` osoittaa kohtaan `<käskyosoite> + 1` (ensimmäinen operanditavu) jokaista osoitustilaa varten. Tämä korvaa vanhemman `STA-käskyn+1` / `-käskyn: LDA #$00` kuvion. Se kiertää lohkon ⇄ asiantuntijatilan läpi (operandikenttä säilyttää etuliitteen `tunniste:`).

---

## 8. Vakio-ohjeet 6502

### Tiedonsiirto

| Muistijärjestelmä | Kuvaus                 | Tilat                                                                                   |
| ----------------- | ---------------------- | --------------------------------------------------------------------------------------- |
| `LDA`             | Kuorma-akku            | välitön, nollasivu, absoluuttinen, absoluuttinenX, absoluuttinenY, epäsuoraX, epäsuoraY |
| `LDX`             | Lataa X-rekisteri      | välitön, nollasivu, nollasivuY, absoluuttinen, absoluuttinenY                           |
| `LDY`             | Lataa Y-rekisteri      | välitön, nollasivu, absoluuttinen, absoluuttinenX                                       |
| `STA`             | Säilytä akkumulaattori | nollasivu, absoluuttinen, absoluuttinenX, absoluuttinenY, epäsuoraX, epäsuoraY          |
| `STX`             | Myymälä X kassa        | nollaSivu, nollaSivuY, absoluuttinen                                                    |
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

*(Uutta versiossa 2.3.9.)* Paletti **Pitkät haarat** sisältää kahdeksan pseudo-operaatiota, jotka käyttäytyvät ehdollisten haarautumisten tavoin, mutta saavuttavat **minkä tahansa osoitteen**, eivätkä vain −128…+127. Jokainen niistä muodostaa käänteisen haaran, joka ohittaa 3-tavuisen `JMP:n` — aina **5 tavua**:

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

- Operandi: otsikko, `*`-lauseke tai literaaliosoite — sama kuin normaalissa haaran kohdefunktiossa.
- Kustannukset: 5 tavua ja 1 ylimääräinen sykli valitulla polulla lyhyeen haaraan verrattuna. Lyhyen haaran automaattista ylennystä ei tapahdu — valitset `LBxx` eksplisiittisesti.
- Kun tavallinen haara (`BNE`, `BEQ`, …) on alueen ulkopuolella, kääntäjävirhe nimeää nyt tarkan ylityksen ja ehdottaa vastaavaa `LBxx`.

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

### Shift & Rotate

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

Näitä tuetaan edistyneessä käytössä. Käytä varoen — toiminta voi vaihdella eri sirujen välillä.

`LAX`, `SAX`, `DCP`, `ISC`, `SLO`, `RLA`, `SRE`, `RRA`, `ANC`, `ALR`, `ARR`, `AXS`

---

## 9. Makrolohkot — Viite

Makrolohkojen avulla voit tehdä yleisiä tehtäviä yhdessä vaiheessa – sen sijaan, että kirjoittaisit 10–20 käskyä käsin, pudotat yhden lohkon ja assembler luo koodin puolestasi. Ajattele niitä sisäänrakennettuina aliohjelmina.

---

### LABEL

Kuten **rivinumero BASICissa** — mutta nimellä numeron sijaan. Hyppykohteet `JMP`, `JSR`, `BNE` jne.

| Ala             | Kuvaus                                                                   |
| --------------- | ------------------------------------------------------------------------ |
| Levymerkin nimi | Tunniste, jota käytetään esimerkiksi `JMP`-, `JSR`-, `BNE`-tiedostoissa. |

**Asiantuntijan syntaksi:**
```
loop:
```

**Generoitu ASM:**
```
loop:  ; $0820
```

Nykyinen osoite näkyy kommenttina. Nimikkeiden koko on **0 tavua **.

---

### COMMENT

Kuten **REM BASIC**:ssä — huomautus itsellesi, jonka assembler jättää täysin huomiotta.

**Asiantuntijan syntaksi:**
```
; Your comment text here
```

**Generoitu ASM:**
```
; Your comment text here
```

---

### BYTE

Kuten **DATA BASIC**-ohjelmassa — tallentaa luettelon raakatavuarvoista ohjelmaan.

| Ala      | Kuvaus                                                              |
| -------- | ------------------------------------------------------------------- |
| Operandi | Pilkulla erotetut tavuarvot (esim. `$01, $02, $FF` tai `1, 2, 255`) |

**Asiantuntijan syntaksi:**
```
.byte $01, $02, $FF
```

**Generoitu ASM:**
```
    .byte $01, $02, $FF
```

**Lo/hi-tavun tunnisteviittaukset:** BYTE hyväksyy KickAssembler / ca65-tyyliset `<label` (matala tavu) ja `>label` (korkea tavu) -tokenit numeeristen arvojen rinnalla. Assembler selvittää tunnisteosoitteen käännösaikana ja lisää sopivan tavun. Esimerkki:

```
    .byte <frame_0, >frame_0, <frame_1, >frame_1
```

Tämä tallentaa `frame_0`-kehyksen osoitteen alimman tavun, sitten ylemmän tavun ja lopuksi saman tavun osoitteelle `frame_1`. Hyödyllinen hyppytaulukoiden ja osoitelistojen rakentamiseen.

**Koko:** Listan tavujen määrä.

---

### WORD

Kuten BASICin **DATA, mutta 16-bittisille luvuille **. Jokainen arvo tallennetaan kahtena tavuna (ensin pienin tavu, sitten suurin – 6502 little-endian -järjestys).

| Ala      | Kuvaus                                                     |
| -------- | ---------------------------------------------------------- |
| Operandi | Pilkulla erotetut 16-bittiset arvot (esim. `$0400, $C000`) |

**Asiantuntijan syntaksi:**
```
.word $0400, $C000
```

**Generoitu ASM:**
```
    .word $0400, $C000
```

**Koko:** 2 tavua sanaa kohden.

---

### FILL

Kuten `FOR I=1 TO N : POKE addr+I, val : NEXT` — täyttää muistilohkon samalla tavulla, mutta yhdessä lohkossa. Erinomainen alueiden tyhjentämiseen tai taulukoiden esitäyttöön.

| Ala      | Kuvaus                                                  |
| -------- | ------------------------------------------------------- |
| Operandi | `määrä,arvo` — esim. `256,0` täyttää 256 tavua nollalla |

**Asiantuntijan syntaksi:**
```
.fill 256, $00
```

**Generoitu ASM:**
```
    .fill 256, $00
```

**Lausekkeen syntaksi:** Sekä `count` että `value` hyväksyvät aritmeettisia lausekkeita. Voit viitata CONST-nimiin, käyttää heksadesimaali-/binääriliteraaleja ja kutsua sisäänrakennettuja matemaattisia funktioita:

| Ilme                        | Merkitys                              |
| --------------------------- | ------------------------------------- |
| `LAATTAMÄÄRÄ, 00 $`         | count from a CONST, value hex literal |
| `40*25, 0`                  | rivinsisäinen kertolasku              |
| `round(sin(PI/4)*255), $80` | trigonometria                         |

**Sisäänrakennetut funktiot:** `sin()`, `cos()`, `round()`, `max(a,b)`, `min(a,b)`, `abs()`, vakio `PI`

Operaattorit: `+ - * /` Literaalit: `$FF` (heksadesimaali), `%10110000` (binääri) Matala/korkea tavu: `lo(lauseke)`, `hi(lauseke)`

**Koko:** Määrän arvo tavuina.

---

### ALIGN

Liu'uttaa nykyisen osoitteen eteenpäin seuraavaan puhtaaseen reunaan lisäämällä nollilla täytettäviä tavuja. C64 vaatii sprite-datan alkavan 64-tavuiselta rajalta — `ALIGN 64` käsittelee tämän automaattisesti.

| Ala  | Kuvaus                                                                     |
| ---- | -------------------------------------------------------------------------- |
| Raja | Tasausarvo — esim. `64` (sprite-raja), `256` (sivu), `$2000` (bittikartta) |

**Asiantuntijan syntaksi:**
```
.align 64
.align $2000
```

**Generoitu ASM:**
```
    ; ALIGN 64 → $0840 (12 bytes padding)
```

**Koko:** Dynaaminen — riippuu nykyisen ohjelmalaskurin sijainnista.

> **Vinkki:** Käytä `ALIGN 64` ennen sprite-dataa ja `ALIGN 256` varmistaaksesi sivunmukaiset taulukot.

---

### TEXT

Kuten **PRINT AT** — kirjoittaa tekstiä suoraan C64-näytölle tiettyyn sarakkeeseen ja riville käyttämättä KERNAL-kutsua. Se luo yhden LDA/STA-parin merkkiä kohden ja kohdistaa näytön RAM-muistiin kohdassa `$0400`.

| Ala                         | Kuvaus                                                     |
| --------------------------- | ---------------------------------------------------------- |
| Teksti                      | Näytettävä merkkijono                                      |
| X                           | Sarake (0–39)                                              |
| Y                           | Rivi (0–24)                                                |
| Tarra (valinnainen)         | Määrittää laskettuun näyttöosoitteeseen osoittavan otsikon |
| Pienten kirjainten merkistö | Valintaruutu – katso alla                                  |

** Merkistötilat:**

C64:ssä on kaksi merkistöä, jotka voidaan valita ajonaikana:

| Tila                                                | $D018 bitti 1 | Isojen kirjainten syöttö         | Pienten kirjainten syöttö              |
| --------------------------------------------------- | ------------- | -------------------------------- | -------------------------------------- |
| **Isot kirjaimet/grafiikka** (oletus)               | 0             | `A`–`Z` → näyttökoodit $01–$1A ✓ | käsitellään myös isona kirjaimena      |
| **Pienet/isot kirjaimet** (CHARSET-lauseen jälkeen) | 1             | `A`–`Z` → $01–$1A (iso kirjain)  | `a`–`z` → $41–$5A (pienet kirjaimet) ✓ |

- **Isojen kirjainten merkistö (oletus, valintaruutua ei ole valittu):** Kirjoita haluamasi teksti isoilla kirjaimilla. `"HEI"` näkyy muodossa `HEI`. Pienillä kirjaimilla syötetty teksti on yhdistetty isoilla kirjaimilla syötettyihin näyttökoodeihin.
- **Pienet kirjaimet (valintaruutu valittuna):** Kirjoita tarkka kirjainkoko, jonka haluat nähdä. `"hello"` → pienten kirjainten näyttö, `"HELLO"` → isojen kirjainten näyttö. Vaatii ajonaikaisen merkistövalinnan ennen kuin näyttöön kirjoitetaan (käytä **CHARSET lower** -makroa).

**Generoitu ASM (isoilla kirjaimilla, `"HEI"`):**
```
    LDA #$08      ; 'H' screen code $08
    STA $0400
    LDA #$05      ; 'E' screen code $05
    STA $0401
    ...
```

**Asiantuntijan syntaksi:**
```
.text 0, 2, "HELLO"           ; uppercase charset (default)
.text 0, 2, "hello", lower    ; lowercase charset
```

Merkit koodataan **näyttökoodeina** (ei PETSCII). **Koko:** `tekstin pituus × 5` tavua (LDA + STA merkkiä kohden).

---

### STRING

Kuten **Työkkäämällä merkkijonon** mihin tahansa muistiosoitteeseen suorituksen aikana. Luo LDA/STA-pareja, jotka kopioivat kunkin merkin näyttökoodin peräkkäisiin osoitteisiin.

| Ala                         | Kuvaus                                                                                    |
| --------------------------- | ----------------------------------------------------------------------------------------- |
| Teksti                      | Kirjoitettava merkkijono                                                                  |
| Osoite                      | Kohdemuistin osoite — `$C000` heksadesimaali tai **otsikkonimi**                          |
| Tarra (valinnainen)         | Määrittää kohdeosoitteeseen osoittavan tunnisteen                                         |
| Siirtää                     | Heksadiarvo (00–FF) lisätään jokaiseen näyttökooditavuun (esim. `$80` = käänteinen video) |
| Pienten kirjainten merkistö | Valintaruutu — sama semantiikka kuin TEKSTI (katso TEKSTI-osio)                           |

**Asiantuntijan syntaksi:**
```
.string $C000, "HELLO"                  ; uppercase charset (default)
.string $C000, "hello", lower           ; lowercase charset
.string $C000, "HELLO", 80             ; with shift (reverse video)
.string $C000, "hello", 80, lower      ; shift + lowercase
.string $C000, "HELLO" :my_string      ; with macroLabel
```

**Generoitu ASM:**
```
    LDA #$08      ; 'H' screen code
    STA $C000
    LDA #$05      ; 'E' screen code
    STA $C001
    ...
```

Merkit koodataan **näyttökoodeina** (ei PETSCII). Valinnainen **Shift**-arvo lisätään jokaiseen tavuun, esim. `$80` käänteiselle videolle. **Koko:** `text.length × 5` tavua (yksi LDA + yksi STA merkkiä kohden).

---

### DATA

Kuten **POKE-silmukka** — kirjoittaa raakatavuluettelon muistiosoitteeseen ajonaikana, yhden LDA/STA-parin tavua kohden.

| Ala                 | Kuvaus                                                           |
| ------------------- | ---------------------------------------------------------------- |
| Tavut               | Pilkulla erotetut tavuarvot                                      |
| Osoite              | Kohdemuistin osoite — `$C000` heksadesimaali tai **otsikkonimi** |
| Tarra (valinnainen) | Määrittää kohdeosoitteeseen osoittavan tunnisteen                |

**Asiantuntijan syntaksi:**
```
.data $C000, $01, $02, $03          ; hex address
.data my_buf, $01, $02, $03         ; label address
.data $C000, $01, $02, $03 :mydata  ; with macroLabel
```

**Generoitu ASM:**
```
    LDA #$01
    STA $C000
    LDA #$02
    STA $C001
    ...
```

**Koko:** `tavujen_määrä × 5` tavua (yksi LDA + yksi STA tavua kohden).

---

### RAWBYTES

Kuten suoraan muistiin latautuva **DATA** — ei lainkaan ajonaikaista koodia. Tavut ovat läsnä PRG:n lataushetkestä lähtien, ennen kuin koodisi edes alkaa. Käytä tätä sprite-dataan, tasokarttoihin, hakutaulukoihin ja kaikkeen muuhun, minkä tarvitsee vain olla tietyssä osoitteessa.

| Ala                 | Kuvaus                                                           |
| ------------------- | ---------------------------------------------------------------- |
| Tavut               | Pilkulla erotetut tavuarvot                                      |
| Osoite              | Kohdemuistin osoite — `$C000` heksadesimaali tai **otsikkonimi** |
| Tarra (valinnainen) | Määrittää kohdeosoitteeseen osoittavan tunnisteen                |

**Asiantuntijan syntaksi:**
```
.rawbytes $C000, $00, $00, $00      ; hex address
.rawbytes sprite_data, $00, $00     ; label address
.rawbytes $0C50, $00, $00 :nev      ; with macroLabel — other code can use LDA nev,X
```

**Koko koodissa:** 0 tavua. Data sijoitetaan tulosteessa annettuun osoitteeseen.

> **DATA vs. RAWBYTES:** DATA luo LDA/STA-koodia, joka kopioi tavuja suorituksen aikana (hitaampaa, mutta toimii, jos datan on oltava dynaamista). RAWBYTES vain sijoittaa tavut suoraan – ei koodia, välittömästi, ilman kustannuksia.

---

### RAWTEXT

Kuten RAWBYTES, mutta tekstille — koodaa merkkijonon näyttökoodeiksi ja sijoittaa tavut kiinteään osoitteeseen ilman ajonaikaista koodia ****. Teksti on valmiina muistissa heti, kun PRG latautuu.

| Ala                         | Kuvaus                                                                                    |
| --------------------------- | ----------------------------------------------------------------------------------------- |
| Teksti                      | Koodattava merkkijono                                                                     |
| Osoite                      | Kohdemuistin osoite — `$C000` heksadesimaali tai **otsikkonimi**                          |
| Tarra (valinnainen)         | Määrittää kohdeosoitteeseen osoittavan tunnisteen                                         |
| Siirtää                     | Heksadiarvo (00–FF) lisätään jokaiseen näyttökooditavuun (esim. `$80` = käänteinen video) |
| Pienten kirjainten merkistö | Valintaruutu — sama semantiikka kuin TEKSTI (katso TEKSTI-osio)                           |

**Asiantuntijan syntaksi:**
```
.rawtext $C000, "HELLO"                 ; uppercase charset (default)
.rawtext $C000, "hello", lower          ; lowercase charset
.rawtext $C000, "HELLO", 80            ; with shift (reverse video)
.rawtext $C000, "hello", 80, lower     ; shift + lowercase
.rawtext $0400, "HELLO" :my_text       ; with macroLabel
```

**Generoitu ASM:**
```
; .rawtext "HELLO" -> $C000
; $C000
    .byte $08, $05, $0C, $0C, $0F   ; H E L L O (uppercase screen codes)

; .rawtext "hello", lower -> $C000
; $C000
    .byte $48, $45, $4C, $4C, $4F   ; h e l l o (lowercase screen codes $41–$5A range)
```

**Koko koodissa:** 0 tavua. Data sijoitetaan tulosteessa annettuun osoitteeseen.

> **STRING vs. RAWTEXT:** STRING luo LDA/STA-koodia, joka kopioi tekstin suorituksen aikana. RAWTEXT tallentaa tavut PRG:hen latausaikana – ei koodia, ei odottelua.

---

### PETSCII

Kuten **RAWBYTES, mutta KERNAL-tulosteelle ** — koodaa merkkijonon PETSCII-tavuina (yhteensopiva CHROUT:n kanssa kohdassa `$FFD2`) ja sijoittaa ne kiinteään osoitteeseen ilman ajonaikaista koodia. Käytä tätä, kun haluat tulostaa merkkejä `JSR $FFD2`:n kautta silmukassa, ja huomaa, että uusi `PRINT`-makro käyttää samaa kooderia ja pienten kirjainten valintaruututoimintoa.

> **PETSCII vs. näyttökoodit:** PETSCII ja näyttökoodit ovat kaksi eri koodausta. Näyttökoodi `$01` = kirjain A; PETSCII `$41` = kirjain A (CHROUTin kautta). Käytä PETSCII:tä vain tulostettaessa KERNALin kautta; käytä TEXT/STRING/RAWTEXT-koodausta suoraan näyttömuistiin kirjoittamiseen.

| Ala                      | Kuvaus                                                           |
| ------------------------ | ---------------------------------------------------------------- |
| Teksti                   | PETSCII-tavuina koodattava merkkijono                            |
| Osoite                   | Kohdemuistin osoite — `$C000` heksadesimaali tai **otsikkonimi** |
| Tarra (valinnainen)      | Määrittää kohdeosoitteeseen osoittavan tunnisteen                |
| Pienet PETSCII-kirjaimet | Valintaruutu – katso alla                                        |

** Merkistötilat:**

| Tila                                    | Isojen kirjainten syöttö (`A`–`Z`)                                                                                        | Pienten kirjainten syöttö (`a`–`z`) |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| **Isot kirjaimet (oletus, ei valittu)** | `$41`–`$5A` (PETSCII-isot kirjaimet CHROUTin kautta)                                                                      | myös yhdistetty `$41`–`$5A`         |
| **Pienet kirjaimet (valittu)**          | Aakkosten kirjaimet on uudelleenjärjestetty, jotta näkyvä kirjainkoko pysyy samana pienten/isojen kirjainten merkistössä. | Sama sääntö                         |

**Asiantuntijan syntaksi:**
```
.petscii $C000, "HELLO"              ; uppercase PETSCII (default)
.petscii $C000, "hello", lower       ; lowercase PETSCII ($61–$7A)
.petscii $C000, "HELLO", null        ; with null terminator
.petscii $C000, "hello", lower, null ; lowercase + null terminator
.petscii $C000, "HELLO" :my_msg      ; with macroLabel
```

**Generoidut tavut (isoilla kirjaimilla, `"HEI"`):**
```
; $C000
    .byte $48, $45, $4C, $4C, $4F   ; H E L L O (PETSCII $41–$5A range)
```

**Koko koodissa:** 0 tavua. Data sijoitetaan kohdeosoitteeseen lykättynä dataosana (kuten RAWBYTES).

**Nollapäätteinen merkki:** Valitse *"Lisää `$00` (nollapäätteinen merkki)"* -valintaruutu lisätäksesi automaattisesti `$00` tavun tekstin jälkeen. Ihanteellinen null-päätteisille silmukoille:

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

** Koodaussäännöt:**

| Syöttö                                   | Isojen kirjainten tila                      | Pienten kirjainten tila |
| ---------------------------------------- | ------------------------------------------- | ----------------------- |
| `A`–`Z`                                  | `41 $`–`5A $`                               | `$61`–`$7A`             |
| `a`–`z`                                  | `$41`–`$5A` (pakotettu isoilla kirjaimilla) | `41 $`–`5A $`           |
| Välilyönti, numerot, välimerkit (32–126) | sellaisenaan                                | sellaisenaan            |
| Rivinvaihto                              | `$0D` (PALUU)                               | `$0D`                   |
| Muut                                     | `$20` (välilyönti)                          | `20 dollaria`           |

> **Vinkki:** Käytä PETSCII:tä datalle, joka lähetetään CHROUTin kautta (`$FFD2`). Kirjoitettaessa suoraan näytön RAM-muistiin, käytä STRING- tai RAWTEXT-komentoa.

---

### CHARSET

Vaihtaa VIC-II-merkki-ROMin isojen kirjainten/grafiikkatilan (C64-oletus) ja pienten kirjainten/isojen kirjainten tilan välillä muokkaamalla `$D018`:n bittiä 1 ajonaikana.

| Ala  | Kuvaus                                                                                                                                                         |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tila | **Pienet kirjaimet** — ottaa käyttöön pienten/isojen kirjainten merkistöä; **Isot kirjaimet** — palauttaa oletusarvoisen isojen kirjainten/grafiikkamerkistöä. |

**Asiantuntijan syntaksi:**
```
.charset lower    ; switch to lowercase charset
.charset upper    ; switch back to uppercase/graphics charset
```

**Generoitu ASM:**

Pienten kirjainten tila:
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
```

**Koko:** 8 tavua (LDA abs + ORA/AND imm + STA abs).

**Miksi ORA/AND suoran kirjoituksen sijaan?** `$D018` ohjaa myös näytön RAM-muistin sijaintia (bitit 7–4). Vain bitin 1 kytkeminen päälle/pois säilyttää loput rekisteristä.

**Tyypillinen työnkulku:**

```
    CHARSET lower             ; switch to lowercase charset
    TEXT 0, 0, "hello world"  ; [checkbox: Lowercase charset]
    ...
    CHARSET upper             ; restore default when done
```

Tai asiantuntijatilassa:
```
.charset lower
.text 0, 0, "hello world", lower
.charset upper
```

Asiantuntijatilassa `.charset`-lohko käy nyt läpi myös tilan alasvetovalikon, joten lohkon esikatselu ja viety lähdekoodi pysyvät linjassa.

> **Huomautus:** CHARSET-makro muuttaa vain VIC-merkki-ROM-osoitinta. Se ei kutsu `$E544` (KERNAL-merkkijoukon alustus). Useimmissa tapauksissa tämä riittää; kutsu `JSR $E544` ensin vain, jos tarvitset KERNALin omien tulostusrutiinien huomioivan muutoksen.

---

### CHARDEF

Määrittää yhden 8×8 mukautetun merkin RAM-pohjaisessa merkistössä. Lähettää suorituksenaikaista koodia, joka kopioi 8 tavua `base + index * 8` -merkkijonoon — ei tarvita edeltävää otsikkoa tai `ORG`-merkkijonoa.

| Ala             | Kuvaus                                                                                                                          |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Merkistöpohja   | RAM-merkistölle määritetty perusosoite (oletusarvo `$3800`). Osoite on kohdistettava siten, että VIC-II näkee sen (katso alla). |
| Merkkihakemisto | Mikä merkkipaikka määritellään uudelleen, 0–255. `65` = 'A' oletusnäyttökoodin asettelussa.                                     |
| 8 tavua         | Pilkuilla erotetut bittikarttarivit ylhäältä alas. Kunkin tavun bitti 7 = vasemmanpuoleisin pikseli.                            |

**Asiantuntijan syntaksi:**
```
.chardef $3800, 65, $18,$3C,$66,$7E,$66,$66,$66,$00
```

**Generoitu ASM (8 × `LDA #b` / `STA kohde+n`, yhteensä 40 tavua):**
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

**Kohdeosoite:** `$3800 + 65 * 8 = $3A08`. Lasketaan käännösaikana ja koodataan kiinteästi STA-operandeihin.

**Koko:** 40 tavua merkkiä kohden (8 × 5).

**Tyypillinen työnkulku:**
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

**Milloin käyttää CHARDEFia vs. vaihtoehtoja:**

| Lähestyä                         | Käytä, kun                                                                                                |
| -------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **CHARDEF**                      | Tarvitset muutaman mukautetun merkin (esimerkiksi 1–20). Suoritusaikakustannukset ovat 40 tavua merkiltä. |
| **RAWBYTES @ $3800**             | Sinulla on täysi mukautettu merkistö (256 merkkiä). Yhteensä 2 kt dataa, ei ajonaikaista kopiota.         |
| **INCBIN "charset.bin" @ $3800** | Ulkoinen merkistötiedosto (character editor -ohjelman luoma). Siistein vaihtoehto.                        |
| ** Merkistöpohja + INCBIN**      | Täysi 256 merkin bittikarttakuva maalattu yhdeksi 128 × 128 -kuvaksi.                                     |

> **Tasonkorjausmuistutus:** VIC-II odottaa merkistöpohjan olevan `$0800` kerrannainen. Kelvolliset pankit: `$0000`, `$0800`, `$1000`, ... , `$3800` (nykyisen 16 kt:n VIC-pankin sisällä). RAM-merkistöjen tyypillisesti ovat `$2000`, `$2800`, `$3000` tai `$3800`.

---

### BOX_HIT

Akselikohtaisesti tasatun rajaavan laatikon (AABB) törmäystesti kahden nelitavuisen nollasivuisen rakenteen kuvaaman suorakulmion välillä. Palauttaa tuloksen akkumulaattoriin: **A = 1** päällekkäisyydessä, **A = 0** muuten. Puhdas inline-kokoonpano, ei aliohjelmakutsuja.

| Ala                    | Kuvaus                                                                       |
| ---------------------- | ---------------------------------------------------------------------------- |
| Box1:n postinumeroalue | Ensimmäisen laatikon 4-tavuisen rakenteen nollasivupohja (oletusarvo `$FB`). |
| Box2:n postinumeroalue | Toisen laatikon 4-tavuisen rakenteen nollasivupohja (oletusarvo `$F7`).      |

**Rakenteen asettelu** (4 tavua ruutua kohden, etumerkittömät 8-bittiset koordinaatit):

| Offset | Ala    |
| ------ | ------ |
| `+0`   | Vasen  |
| `+1`   | Yläosa |
| `+2`   | Oikea  |
| `+3`   | Pohja  |

**Asiantuntijan syntaksi:**
```
.box_hit $FB, $F7
```

**Generoitu ASM (30 tavua, täysin PC-relatiivinen — ei aliohjelmia, ei absoluuttisia hyppyjä):**
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

**Koko:** 30 tavua.

**Tyypillinen työnkulku:**

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

**Rajoitukset:**
- Molempien nollasivuosoitteiden on oltava muotoa `≤ $FC` (jokainen laatikko tarvitsee 4 peräkkäistä tavua: `zp`, `zp+1`, `zp+2`, `zp+3`).
- Koordinaatit käsitellään muodossa **merkitön 8-bittinen** (0–255). Tämän alueen ulkopuolella olevat etumerkilliset sprite-koordinaatit normalisoidaan ennen tallennusta.
- Kaksi laatikkoa voivat halutessaan olla päällekkäin ZP-tilassa, mutta yleensä tarvitaan 8 erillistä tavua.

**Miksi ei aliohjelmaa?** Rivinsisäinen generointi välttää JSR/RTS-yleiskuormituksen (yli 14 sykliä) ja pitää testin kuumana välimuistissa tiukkoja pelisilmukoita varten. Jos sinun täytyy testata useita pareja, aseta oma `JSR box_hit_sub` manuaalisesti yhden BOX_HIT-lohkon ympärille.

**Vertailu UB:n `box_hit()`-funktioon:** Ultimate Basic käyttää samaa 6502-logiikkaa kuin ajonaikainen funktio, joka palaa muuttujaan. VA:ssa BOX_HIT sijoitetaan riville siihen kohtaan, johon testiä tarvitaan; tulos on `A`-tiedostossa.

---

### INCBIN

Kuten **BLOAD BASIC**:ssä — poimii ulkoisen binääritiedoston (`.bin`, `.prg`, `.sid`, `.raw`) ja upottaa sen suoraan koottuun PRG:hen määrittämääsi osoitteeseen.

| Ala      | Kuvaus                                                                       |
| -------- | ---------------------------------------------------------------------------- |
| Tiedosto | Selaa ja valitse tiedosto, jonka tyyppi on `.bin`, `.prg`, `.sid` tai `.raw` |
| Osoite   | Kohdekuormitusosoite (esim. `$C000`)                                         |

**Asiantuntijan syntaksi:**
```
.incbin "music.bin", $C000
```

**Luotu ASM-kommentti:**
```
    ; INCBIN "music.bin" @ $C000 (2048 bytes)
    .byte $01, $02, ...
```

**Koko koodissa:** 0 tavua (lykätty dataosa). Binääritiedosto on upotettu annettuun osoitteeseen.

---

### SID

Kuten **BLOAD musiikille** — lataa `.sid` -tiedoston PRG:hen ja lukee automaattisesti sen Init- ja Play-osoitteet otsikosta. Kutsu Init-komentoa kerran käynnistyksen yhteydessä ja sitten Play-komentoa IRQ-käsittelijästäsi joka kehys.

| Ala                             | Kuvaus                                                                                               |
| ------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Tiedosto                        | Selaa ja valitse `.sid`-tiedosto                                                                     |
| Mukautettu osoite (valinnainen) | Korvaa SID:n natiivi latausosoite (esim. `$1000`). Jätä tyhjäksi käyttääksesi SID-otsikon osoitetta. |

Lohko näyttää:
- **Nimike / Tekijä** SID-otsikosta
- **Latausosoite** — mihin data sijoitetaan muistiin (tehokas osoite minkä tahansa ohituksen jälkeen)
- **Init-osoite** — kutsu tätä JSR:llä musiikin alustamiseksi (säädetty uudelleensijoituksen varalta, jos käytetään mukautettua osoitetta)
- **Toistoosoite** — kutsu tätä JSR:llä jokaisella IRQ-käsittelijän kehyksellä (säädetty uudelleensijoituksen varalta)
- **(siirretty)** -merkki tulee näkyviin, kun mukautettu osoite siirtää tietoja alkuperäisestä sijainnistaan.

**Asiantuntijan syntaksi:**
```
.sid "Ikari_Warriors.sid"
.sid "Ikari_Warriors.sid", $1000
```

**Luotu ASM-kommentti:**
```
    ; SID "Ikari_Warriors.sid" @ $1000  Init:$1000  Play:$1006  (4096 bytes)
```

**Koko koodissa:** 0 tavua rivillä. SID-binääritiedosto sijoitetaan PRG:n määritettyyn osoitteeseen lykättynä osana.

> **Tärkeää:** Useimmat SID-tiedostot sisältävät kovakoodattuja sisäisiä absoluuttisia osoitteita. Ne voidaan siirtää vain, jos koko binääritiedostoa siirretään samalla siirtymällä. Jos SID:ssä on sisäisiä hyppyjä osoitteeseen `$10xx`, sen on pysyttävä osoitteessa `$1000` – sen siirtäminen eri osoitteeseen rikkoo nämä sisäiset viittaukset.

> **Tyypillinen käyttö:** Aseta ORG-lohko SID-lohkon eteen sen osoitteen asettamiseksi. Kutsu Init-lohkoa kerran käynnistyksen yhteydessä ja sitten Play-lohkoa joka kehys rasteri-IRQ-käsittelijältä.

---

### INCLUDE

Kuten **MERGE BASIC**:ssä — hakee toisen tiedoston ja laajentaa sen lohkot rivillä tässä kohdassa. Täydellinen uudelleenkäytettäville aliohjelmakirjastoille. Sisällytetyt lohkot ovat vain luku -tilassa nykyisessä projektissa.

Kahta tiedostotyyppiä tuetaan:
- **Visual Assembler -projekti** (`.json`) — projektin lohkot lisätään sellaisenaan.
- **Plain assembly source** (`.inc`, `.asm`, `.s`) — tiedosto luetaan tekstinä ja jäsennetään samalla tavalla kuin expert-tilassa. Joka kerta käännöksen yhteydessä tiedosto luetaan uudelleen levyltä (source of truth = tiedosto), joten voit muokata sitä ulkoisesti millä tahansa editorilla.

| Ala                        | Kuvaus                                                                                                                                                                                                                                                                                                        |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tiedosto                   | Selaa valitaksesi `.json` -projektin tai `.inc`/`.asm`/`.s` -kokoonpanolähteen                                                                                                                                                                                                                                |
| Latausosoite (valinnainen) | Jos se on asetettu (heksadesimaali, esim. `C000`), sisällytetyt lohkot sijoitetaan kyseiseen osoitteeseen – niiden eteen ruiskutetaan synteettinen `ORG`, joka ohittaa kaikki sisällytetyn tiedoston ORG-lohkot. Jätä tyhjäksi, jos haluat, että sisällytetyn tiedoston omat ORG-lohkot ohjaavat sijoittelua. |

**Asiantuntijatilan syntaksi:**
```
.include "library.json"
.include "macros.inc", $1500
.include "sprites.asm"
```

- Tiedostopääte ** vaaditaan asiantuntijatilassa ** — pelkkää nimeä, kuten `.include "macros"`, käsitellään nimellä `.include "macros.json"`.
- Polun tarkkuus: yrittää ensin projektitiedoston vieressä olevaa polkua (suhteellinen) ja palaa sitten sovelluksen mukana toimitettuun `samples/`-hakemistoon.

**Generoitu ASM (ei osoitteen ohitusta):**
```
    ; .include "library.json" — 12 block(s)
    ... (expanded blocks follow)
```

**Generoitu ASM (kuormitusosoitteella `C000`):**
```
    ; .include "library.json" @ $C000 — 12 block(s)
    *=$C000
    ... (expanded blocks follow)
```

> **Vinkki:** Käytä INCLUDE-komentoa luodaksesi uudelleenkäytettäviä aliohjelmakirjastoja, joita voit jakaa projektien välillä. `.inc`/`.asm`/`.s`-tiedostot sopivat parhaiten, kun haluat muokata kirjastoa tekstieditorissa tai jakaa sen muiden 6502-assemblerien kanssa; `.json`-tiedostot, kun kirjasto on luotu itse Visual Assemblerissa. Aseta latausosoite, kun kirjastolla ei ole omaa ORG:ta tai kun haluat ohittaa sen oletussijainnin.

---

### TABLE

Kuten **DIM tietyssä osoitteessa** — nimeää hakutaulukon ja määrittää sen sijainnin muistissa. Lisää BYTE-, WORD- tai FILL-lohkot sen jälkeen määrittääksesi taulukon sisällön.

| Ala    | Kuvaus                                               |
| ------ | ---------------------------------------------------- |
| Nimi   | Taulukon tunniste (esim. `väritaulukko`)             |
| Osoite | Kiinteä osoite, josta taulukko alkaa (esim. `$C000`) |

**Asiantuntijan syntaksi:**
```
.table color_table, $C000
```

**Generoitu ASM:**
```
color_table:
```

Ohjelmalaskuri hyppää annettuun osoitteeseen. Täytä sisältö sijoittamalla BYTE/WORD/FILL-lohkot TABLE-taulukon jälkeen.

**Koko:** 0 tavua.

---

### ORG

Määrittää, mihin kohtaan muistia ohjelma (tai sen osa) sijoitetaan – aivan kuin aloitusosoite valittaisiin ennen konekielisen koodin kirjoittamista. Jokainen ohjelma tarvitsee vähintään yhden ORG:n. C64 BASICin vakiomuotoinen ladattava aloitusosoite on `$0801`.

| Ala       | Kuvaus                                                                             |
| --------- | ---------------------------------------------------------------------------------- |
| Osoite    | Uusi lähtöosoite (esim. `0801` heksadesimaalimuodossa tai `2049` detsembrimuotoon) |
| HEX / DEC | Vaihda osoitesyötön heksadesimaali- ja desimaalinäytön välillä                     |

**Asiantuntijan syntaksi:**
```
* = $C000
```

**Generoitu ASM:**
```
* = $C000
```

**Koko:** 0 tavua. ORG-lohko itsessään ei tuota konekielistä koodia.

Jokainen ORG-lohko aloittaa uuden osion. Seuraavat lohkot kootaan tästä osoitteesta alkaen. Kun viet PRG:n, kaikki osiot yhdistetään yhdeksi tiedostoksi – osioiden väliset aukot täytetään nollilla.

**Esimerkki — koodi kohdassa `$0801`, datataulukko kohdassa `$C000`:**
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

> **Vinkki:** Jokaisen ohjelman on alettava ORG-lohkolla. Tyypillinen C64 BASIC-ladattavan ohjelman aloitusosoite on `$0801` (2049 desimaalilukua). Kun **BASIC SYS -tynkä** on käytössä, assembler lisää lyhyen BASIC-rivin kohtaan `$0801` ja koodisi alkaa kohdasta `$080D`.

---

### LOOP / NEXT

Kuten **`FOR X=N TO 1 STEP -1 : ... : NEXT X`** BASICissa — laskee alaspäin N:stä 1:een käyttäen X- tai Y-rekisteriä. Pudota LOOP-lohko, aseta käskysi sen ja NEXT-rekisterin väliin, ja se toistuu automaattisesti oikean määrän kertoja.

#### LOOP

| Ala          | Kuvaus                                                              |
| ------------ | ------------------------------------------------------------------- |
| Rekisteröidy | `X` tai `Y` — laskurirekisteri                                      |
| Laskea       | Silmukan iteraatiomäärä (heksa- tai desimaaliluku, esim. `0A` = 10) |
| Tarra        | Automaattisesti luotu silmukan otsikko (esim. `loop0`)              |

**Asiantuntijan syntaksi:**
```
.loop X, 10, loop0
```

**Generoitu ASM:**
```
    LDX #$0A
loop0:
```

**Koko:** 2 tavua (LD_-operaatiokoodi + välitön operandi).

#### NEXT

| Ala          | Kuvaus                                     |
| ------------ | ------------------------------------------ |
| Rekisteröidy | Automaattisesti sovitettu LOOP-rekisteriin |
| Tarra        | Automaattisesti linkitetty LOOP-tarraan    |

**Asiantuntijan syntaksi:**
```
.next loop0
```

**Generoitu ASM:**
```
    DEX
    BNE loop0
```

**Koko:** 3 tavua (DEX + BNE + haaran offset).

**Esimerkki — 10 näytön solun tyhjentäminen:**
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

Kuten **`FOR X=0 TO N-1 : ... : NEXT X`** BASICissa — laskee *ylöspäin* nollasta. Ihanteellinen, kun tarvitset eteenpäin suuntautuvan indeksin, esimerkiksi merkkijonon tai taulukon läpi askellettaessa.

#### FOR

| Ala          | Kuvaus                                                                                             |
| ------------ | -------------------------------------------------------------------------------------------------- |
| Rekisteröidy | `X` tai `Y` — laskurirekisteri                                                                     |
| Laskea       | Silmukan raja (heksa- tai desimaaliluku, esim. `$12` = 18). X/Y alkaa 0:sta ja päättyy raja-1:een. |
| Tarra        | Automaattisesti luotu silmukan otsikko (esim. `for0`)                                              |

**Asiantuntijan syntaksi:**
```
.for X, $12, for0
```

**Generoitu ASM:**
```
    LDX #$00
for0:
```

**Koko:** 2 tavua (LD_-operaatiokoodi + `#$00`).

#### ENDF

| Ala          | Kuvaus                                            |
| ------------ | ------------------------------------------------- |
| Rekisteröidy | Automaattisesti FOR-rekisteriin täsmäävä          |
| Tarra        | Automaattisesti linkitetty FOR-tarraan            |
| Laskea       | Kopioidaan automaattisesti paritetun FOR:n kautta |

**Asiantuntijan syntaksi:**
```
.endf for0
```

**Generoitu ASM:**
```
    INX
    CPX #$12
    BNE for0
```

**Koko:** 5 tavua (IN_ + CP_ #imm + BNE-offset).

**Esimerkki — tulosta tyhjään päättyvä merkkijono:**
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

> **LOOP vs FOR:** LOOP counts down (N→1) — good for delays, fills, pixel loops. FOR counts up (0→N) — good for string/array access. Both can use X or Y.

---

### PUSH / PULL

Kuten **muuttujien tallentaminen ennen GOSUBia ja niiden palauttaminen **:n jälkeen — mutta käyttää 6502-laitteistopinoa. Jos aliohjelma käyttää A:ta, X:ää tai Y:tä, se kiedotaan PUSH- ja PULL-käskyihin, jotta kutsuvan koodin rekisterit säilyvät.

#### PUSH

Lisää yhden tai useamman rekisterin pinoon. Järjestys on aina A → X → Y (sisin ensin).

| Ala        | Kuvaus                                                           |
| ---------- | ---------------------------------------------------------------- |
| Rekisterit | Mikä tahansa yhdistelmä: `A`, `X`, `Y`, `AX`, `AY`, `XY`, `XY[X] |

**Asiantuntijan syntaksi:**
```
.push AXY
```

**Generoitu ASM (esimerkki: `AX`):**
```
    PHA
    TXA
    PHA
```

**Koko:** 1 tavu A:lle (`PHA`), 2 tavua X:lle tai Y:lle (siirto + push).

#### PULL

Palauttaa rekisterit pinosta käänteisessä **järjestyksessä ** (Y → X → A).

| Ala        | Kuvaus                                                |
| ---------- | ----------------------------------------------------- |
| Rekisterit | Sama kuin PUSH — täytyy vastata vastaavaa PUSH-lohkoa |

**Asiantuntijan syntaksi:**
```
.pull AXY
```

**Generoitu ASM (esimerkki: `AX`):**
```
    PLA
    TAX
    PLA
```

> **Sääntö:** PUSH- ja PULL-komentojen on aina käytettävä **samaa rekisterijoukkoa**. `PUSH AX` → `PULL AX` (palauttaa sisäisesti käänteisessä järjestyksessä: ensin X, sitten A).

---

### END / RTS alias

Kuten **RTS, mutta ystävällisemmällä makronimellä ** — `.end` lähettää yhden `RTS` tavun ja toimii lyhyenä aliohjelman päättäjänä asiantuntijatilassa.

**Asiantuntijan syntaksi:**
```
.end
```

**Generoitu ASM:**
```
    RTS
```

**Koko:** 1 tavu.

Käytä tätä, kun haluat aliohjelman loppumerkin, joka lukee hieman enemmän makron kuin raakakäskyn kaltaisesti.

---

### MACRO / ENDM / INVOKE

Kuten **niminen GOSUB parametreilla ** — määrittele uudelleenkäytettävä koodipätkä kerran (MACRO…ENDM) ja kutsu sitä sitten missä tahansa INVOKE-komennolla. Anna eri argumenttiarvot joka kerta kopioinnin ja liittämisen sijaan.

#### MACRO (definition start)

| Ala        | Kuvaus                                                                             |
| ---------- | ---------------------------------------------------------------------------------- |
| Nimi       | Makron tunniste (esim. `setColor`)                                                 |
| Parametrit | Valinnaiset pilkulla erotetut parametrien nimet (esim. `color` tai `color, count`) |

Merkitsee makromääritelmän alun. MACRO- ja ENDM-lohkojen väliset lohkot ovat makron runko – ne eivät luo koodia,** jossa määritelmä sijaitsee. Käytä `{paramName}` paikkamerkkinä argumenteille.

**Generoitu ASM:**
```
; .MACRO setColor (color)
    ... (body blocks)
; .ENDM
```

**Asiantuntijatilan syntaksi:**
```
.macro setColor color
    LDA {color}
    STA $D020
.endm
```

#### ENDM (definition end)

Sulkee nykyisen makromäärityksen. Ei kenttiä.

#### INVOKE

Kutsuu tässä kohdassa määriteltyä makroa ja korvaa annetuilla argumenttiarvoilla `{paramName}` -paikkamerkit rungossa.

| Ala         | Kuvaus                                                                                       |
| ----------- | -------------------------------------------------------------------------------------------- |
| Makron nimi | Valitse määriteltyjen makroiden alasvetovalikosta                                            |
| Argumentit  | Pilkuilla erotetut argumenttiarvot, jotka vastaavat makron parametriluetteloa (esim. `#$07`) |

**Generoitu ASM:**
```
; .invoke setColor(#$07)
    LDA #$07
    STA $D020
```

**Asiantuntijatilan syntaksi:**
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

Makron runko laajennetaan rivillä `{paramName}` korvattuna varsinaisilla argumenteilla. Myös välilyönneillä erotettu muoto (`.invoke setColor #$07`) on sallittu.

**Argumenttityypit:**
- **Numeerinen**: `#$07`, `$10`, `255` — heksa- tai desimaaliarvot
- **Tekstimerkkijonot**: `"Hei maailma!"` — lainausmerkeissä olevat merkkijonot; lainausmerkeissä olevia pilkkuja käsitellään osana tekstiä, ei argumenttien erottimina
- **Sekoitettu**: `#07$, "hello", 20$` — mikä tahansa yhdistelmä

> **Tip:** Define macros at the top (or bottom) of your program, then INVOKE them wherever needed. Macros can be invoked multiple times with different arguments.

---

### REGION / ENDREGION

Puhtaasti visuaalinen ryhmittely — **nolla tavua**, nolla vaikutusta koottuun koodiin. Kuten BASIC-ohjelman osan taittaminen nimetyksi lohkoksi, jotta voit kutistaa sen ja keskittyä johonkin muuhun.

| Ala         | Kuvaus                                                                           |
| ----------- | -------------------------------------------------------------------------------- |
| Alueen nimi | Vapaamuotoinen tekstiotsikko osiolle (esim. `init`, `game_loop`, `sprite_setup`) |

**Asiantuntijan syntaksi:**
```
.region init
    ; blocks...
.endregion
```

**Controls on the REGION block header (always visible):**
- **▸ / ▾ ** — kutistaa tai laajentaa koko alueen. Kun kutistetaan, kaikki lohkot REGIONin ja ENDREGIONin välillä piilotetaan.
- **↕ Laajenna kaikki** — poistaa alueen sisällä olevien yksittäisten lohkojen tiivistyksen ja laajentaa itse aluetta tarvittaessa.
- **⦵ Valitse ASM:ssä** — korostaa koko alueen koodialueen ASM-näkymässä (välillä `; ===[ nimi ]===` väliin `; ===[/ nimi]===`) ja vierittää siihen. Vaihtaa ASM-välilehdelle automaattisesti, jos se ei ole tällä hetkellä näkyvissä.
- **⧉ Kopioi alue** — kopioi REGION-lohkon, kaikki alilohkot ja vastaavan ENDREGION-lohkon leikepöydälle. Vilkkuva ✓-merkki vahvistaa kopioinnin.
- **⎘ Paste region** — inserts the copied region as a new region immediately after the current region's ENDREGION and scrolls to it. The button is dimmed until a region has been copied.

**Generoitu ASM:**
```
; region init
    SEI
    LDA #$00
    STA $D020
; endregion init
```

**Koko:** 0 tavua sekä REGION- että ENDREGION-kohteille.

**Esimerkki työnkulusta:**
1. Lisää `REGION`-lohko ja aseta alueen nimeksi `init`.
2. Lisää alustusohjeet sen alle.
3. Lisää `ENDREGION`-lohko sulkeaksesi osion.
4. Click ▸ on the REGION to collapse the whole section into one line while working on other parts of the program.

> **Note:** Regions can be **nested** inside each other. Each ENDREGION closes the nearest open REGION. No effect on the assembled output.

---

### DEFINE / IF / ELSE / ENDIF

Kuten **-kytkin, assembler lukee** — `DEFINE DEBUG` kytkee symbolin päälle, minkä jälkeen mikä tahansa `IF DEBUG`-lohko sisällytetään ja sen `ELSE`-haara ohitetaan. Poista DEFINE-lohko ja IF-lohko katoaa tulosteesta. Julkaisuversioita varten ei tarvitse poistaa koodia.

#### DEFINE

| Ala     | Kuvaus                                                                                      |
| ------- | ------------------------------------------------------------------------------------------- |
| Symboli | Yksi tai useampi pilkulla erotettu tunniste aktivoitavaksi (esim. `DEBUG` tai `DEBUG, PAL`) |

**Asiantuntijan syntaksi:**
```
.define DEBUG, PAL
```

**Generoitu ASM:**
```
; .DEFINE DEBUG
; .DEFINE DEBUG, PAL
```

`DEFINE`-lohko voi aktivoida useita symboleja kerralla (pilkulla erotettuna). Sijoita DEFINE-lohkot ohjelmasi alkuun. Lohkon poistaminen deaktivoi kaikki sen symbolit välittömästi.

#### IF

| Ala   | Kuvaus                                                                         |
| ----- | ------------------------------------------------------------------------------ |
| Kunto | Testattava tunniste (sen on vastattava `DEFINE`-symbolia ollakseen aktiivinen) |

**Asiantuntijan syntaksi:**
```
.if DEBUG
```

**Generoitu ASM:**
```
; .IF DEBUG
```

Lohkot `IF` ja `ENDIF` (tai `ELSE`) välillä sisällytetään tai ohitetaan sen perusteella, onko ehtosymbolilla vastaava `DEFINE` ohjelmassa. Ohitetut lohkot näkyvät kommentteina `; [IF skipped] …` ja generoivat ** nolla tavua**.

#### ELSE

Ei kenttiä. Merkitsee vaihtoehtoisen haaran — kootaan, kun `IF`-ehto on *not* aktiivinen.

**Asiantuntijan syntaksi:**
```
.else
```

**Generoitu ASM:**
```
; .ELSE
```

#### ENDIF

Ei kenttiä. Sulkee ehdollisen lohkon.

**Asiantuntijan syntaksi:**
```
.endif
```

**Generoitu ASM:**
```
; .ENDIF
```

**Koko:** 0 tavua kaikille neljälle lohkolle. Vain niiden välissä oleva sisältö * lasketaan.

**Esimerkki — debug border flash, release build ohittaa sen:**
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

**Esimerkki — useita symboleja yhdessä DEFINE-lohkossa:**
```
; .DEFINE DEBUG, PAL

; .IF PAL
    LDA #$xx        ; PAL timing constant
; .ELSE
    LDA #$xx        ; NTSC timing constant
; .ENDIF
```

Sisäkkäisiä `IF`-lohkoja tuetaan. Jos ulompi lohko ohitetaan, myös sisäiset lohkot ohitetaan.

> **Huomautus:** Tämä on käännösaikaista ehtojen käsittelyä. Katso ajonaikaisesta vertailusta/haarautumisesta **Ajonaikainen IF / ELSE / ENDIF** alla.

### .ASSERT

*(Uutta versiossa 2.3.9.)* Käännösaikainen **järjenpitotarkistus**. `.assert` arvioi lausekkeen kokoamisen aikana; jos se on epätosi (`0`), koonti pysähtyy selkeään virheeseen, joka sisältää todellisen arvon. Jos se on tosi (ei nolla), se ei tuota mitään.

| Ala    | Kuvaus                                                                                                                                            |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ilme   | Mikä tahansa assembler-lauseke: otsikot, `CONST`s, `*` (ohjelmalaskuri), aritmetiikka ja vertailut (`&lt;`, `&lt;=`, `&gt;`, `&gt;=`, `==`, `!=`) |
| Viesti | Valinnainen teksti, joka on liitetty virheilmoitukseen                                                                                            |

**Asiantuntijan syntaksi:**
```
.assert spriteData < $C000
.assert * < $A000
.assert end - start <= 256, "sprite table overflowed one page"
```

**Käyttäytyminen:**

- **Koko:** 0 tavua.
- Epätosi väittämä keskeyttää kokoamisen: `` `.assert end - start &lt;= 256` on epätosi (arvo: 0). sprite-taulukko ylitti yhden sivun.``
- Väite, jota ei voida evaluoida (määrittelemätön otsikko tms.), epäonnistuu myös merkinnällä *"ei voida evaluoida kokoonpanon aikana"*.
- Vertailut tuottavat `1` / `0`; sijoita `.assert` mihin tahansa ohjelmavirran kohtaan — se tarkistetaan siinä osoitteessa, jossa se sijaitsee, joten `.assert * &lt; $D000` testaa nykyisen tulosteen sijainnin.

**Esimerkki — sprite-lohkon suojaaminen sivun ylitykseltä:**
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

Kuten **nimetty muuttuja, joka ei koskaan muutu** — `SCREEN = $0400`. Käytä nimeä sen sijaan, että kirjoittaisit raakaosoitteita kaikkialle, mikä helpottaa koodin lukemista ja muuttamista myöhemmin.

| Ala   | Kuvaus                                                                                                                                  |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Nimi  | Vakion tunniste (esim. `SCREEN`)                                                                                                        |
| Arvo  | Numeerinen arvo valitussa kantaluvussa (esim. `0400` heksadesimaalimuodossa = osoite $0400) tai PC:hen suhteutettu lauseke (katso alla) |
| Muoto | HEX tai DE — määrittää, miten arvo syötetään ja näytetään                                                                               |

**Asiantuntijan syntaksi:**
```
.const SCREEN = $0400
.const FRAMES_1S = 60
```

**Generoitu ASM:**
```
; .CONST SCREEN = $0400
```

Vakion nimi näkyy käskylohkojen **otsikkovalitsimen** alasvetovalikossa – napsauta sitä lisätäksesi sen.

**PC-relatiiviset lausekkeet (`*+N` / `*-N`):**

Arvokenttään voidaan syöttää myös `*+N` tai `*-N`, jossa `*` on itse CONST-lohkon käännösosoite. Tätä käytetään nimetyn aliaksen luomiseen tavulle läheisen käskyn sisällä – klassinen itseään muokkaava koodimalli:

```
CONST op = *+1      ; op → address of the immediate operand of the next LDA
LDA #$00            ; $00 will be patched at runtime
...
STA op              ; overwrites the #$00 byte → LDA reads the new value next time
```

CONST-muuttuja tuottaa 0 tavua; käännöksen yhteydessä sen nimi palautuu muotoon `current_address + 1`.

**Aritmeettiset lausekkeet:**

Arvokenttä hyväksyy yleisiä aritmeettisia lausekkeita, mukaan lukien viittaukset aiemmin määriteltyihin CONST-nimiin, heksadesimaali-/binääriliteraaleihin ja sisäänrakennettuihin matemaattisiin funktioihin:

```
.const SCREEN      = $0400
.const SCREEN_END  = SCREEN + 40*25   ; 1000 bytes later
.const COLOR_RAM   = $D800
.const MID_X       = 160
.const SIN_TABLE   = round(sin(PI/8) * 127)   ; pre-computed sine value
```

**Sisäänrakennetut funktiot:** `sin()`, `cos()`, `round()`, `max(a,b)`, `min(a,b)`, `abs()`, vakio `PI`

Operaattorit: `+ - * /` Literaalit: `$FF` (heksadesimaali), `%10110000` (binääri) Matala/korkea tavu: `lo(lauseke)`, `hi(lauseke)`

**Koko:** 0 tavua.

---

### VAR

Kuten **CONST, mutta automaattisesti allokoitu** — `VAR` varaa nollasivuisen tallennustilan etiketille ilman, että sinun tarvitsee kirjoittaa osoitetta. Käytä sitä laskureille, osoittimille ja lyhytaikaisille tiloille, jotka kuuluvat ZP:hen.

| Ala                | Kuvaus                                                                 |
| ------------------ | ---------------------------------------------------------------------- |
| Nimi               | Muuttujan nimi / otsikko                                               |
| Koko (valinnainen) | Varattavien tavujen määrä. Jätä pois, jos varauksia on vain yksi tavu. |

**Asiantuntijan syntaksi:**
```
.var counter
.var timer, 2
.var lives
```

**Käytännön esimerkki:**
```
.region Vars
.var counter
.var timer, 2
.endregion

LDA #$00
STA counter
```

**Generoitu ASM:**
```
; .var counter
```

**Koko:** 1 tavu oletusarvoisesti tai `N` tavua, kun koko on määritetty.

Allokaattori kävelee konfiguroitavan nollasivun kursorin (`$02` - `$FE`) yli ja varaa seuraavan vapaan paikan. Jos pyydetty alue on päällekkäinen jo käytetyn tunnisteen kanssa, kääntäjä antaa varoituksen.

---

### Runtime IF / ELSE / ENDIF

Kuten **oikea haarautumismalli** — tämä versio toimii ajonaikana, ei käännösaikana. Se vertaa `A`, `X` tai `Y` välittömään arvoon ja tuottaa oikean `CMP` / `CPX` / `CPY` + haarautumissekvenssin puolestasi.

| Ala          | Kuvaus                                       |
| ------------ | -------------------------------------------- |
| Rekisteröidy | `A`, `X` tai `Y`                             |
| Operaattori  | `==`, `!=`, `&lt;`, `&lt;=`, `&gt;`, `&gt;=` |
| Arvo         | Välitön arvo heksa- tai desimaalimuodossa    |

**Asiantuntijan syntaksi:**
```
.if A == #$10
    LDA #$07
.else
    LDA #$0F
.endif
```

**Koko:** Riippuu valituista haaroista ja vertailumuodosta.

Vertailu on oletusarvoisesti etumerkitön. Rekistereille `&lt;=` ja `&gt;` makro laajenee valitun rekisterin lyhyimpään vastaavaan haaraketjuun.

---

### WHILE / ENDW

Kuten **suorituksenaikainen silmukka, jonka alussa on testi** — runko suoritetaan niin kauan kuin ehto pysyy tosi.

| Ala          | Kuvaus                                       |
| ------------ | -------------------------------------------- |
| Rekisteröidy | `A`, `X` tai `Y`                             |
| Operaattori  | `==`, `!=`, `&lt;`, `&lt;=`, `&gt;`, `&gt;=` |
| Arvo         | Välitön arvo heksa- tai desimaalimuodossa    |

**Asiantuntijan syntaksi:**
```
.while A != #$00
    JSR getchar
.endw
```

**Koko:** Riippuu silmukan rungosta ja vertailumuodosta.

Käytä `WHILE`-metodia, kun silmukka saattaa päättyä ennen ensimmäisen iteraation päättymistä. Se on laskemiseen perustuvan `LOOP / NEXT` -apufunktion ajonaikainen vastine.

---

### REPEAT / UNTIL

Kuten **suorituksenaikainen silmukka, jonka lopussa on testi** — runko suoritetaan aina ainakin kerran, minkä jälkeen ehto päättää, pysähtyykö se.

| Ala          | Kuvaus                                       |
| ------------ | -------------------------------------------- |
| Rekisteröidy | `A`, `X` tai `Y`                             |
| Operaattori  | `==`, `!=`, `&lt;`, `&lt;=`, `&gt;`, `&gt;=` |
| Arvo         | Välitön arvo heksa- tai desimaalimuodossa    |

**Asiantuntijan syntaksi:**
```
.repeat
    JSR getchar
.until A == #$00
```

**Koko:** Riippuu silmukan rungosta ja vertailumuodosta.

Käytä `REPEAT / UNTIL`, kun haluat rungon suoritettavan ainakin kerran ennen poistumistarkistusta.

---

### MEMCPY / MEMSET

Kuten **pienet muistirutiinit, joita tavoittelet jatkuvasti** — `MEMCPY` kopioi yhtenäisen lohkon, `MEMSET` täyttää alueen yhdellä tavulla.

| Makro    | Kentät                   |
| -------- | ------------------------ |
| `MEMCPY` | `lähde`, `dst`, `koko`   |
| `MEMSET` | `osoite`, `arvo`, `koko` |

**Asiantuntijan syntaksi:**
```
.memcpy src=$C000, dst=$D000, size=$0100
.memset addr=$0400, value=#$20, size=$03E8
```

**Luotu ASM:** riviin upotettuja kopiointi-/täyttösilmukoita, jotka on valittu vastaamaan pyydettyä kokoa.

Jopa 256 tavun koot käyttävät lyhyttä 8-bittistä silmukkaa. Suuremmat koot vaihtavat automaattisesti 16-bittiseen laskuriin.

---

### PRINT / PRINT_CHAR / PRINT_HEX / CLEAR_SCREEN / WAIT_KEY / DELAY / SET_BORDER / SET_BG

#### PRINT

Kuten **PETSCII-tuloste ilman vakiomuotoista **-lohkoa — tulostaa merkkijonon `CHROUT`-lohkon kautta samalla isojen/pienten kirjainten käsittelyllä kuin PETSCII-lohko. Pienten kirjainten valintaruutu jaetaan PETSCII-kooderin kanssa, joten tekstipolku pysyy yhtenäisenä.

**Asiantuntijan syntaksi:**
```
.print "HELLO"
.print "hello", lower
```

#### PRINT_CHAR

Tulostaa yhden PETSCII-tavun numeerisena koodina ja lähettää sen `CHROUT`-funktion kautta. Arvo voi olla myös nimetty vakio tai tunniste, joka muunnetaan tavuksi kokoamisvaiheessa sekä lohko- että asiantuntijatilassa.

**Asiantuntijan syntaksi:**
```
.print_char 65
.print_char $41
.print_char color
```

#### PRINT_HEX

Tulostaa 8-bittisen arvon heksadesimaalimuotoisena tekstinä normaalin KERNAL-tulostuspolun kautta.

**Asiantuntijan syntaksi:**
```
.print_hex A
```

#### CLEAR_SCREEN

Pikanäppäin C64:n vakiomuotoiseen selkeän näytön ohjauskoodiin.

**Asiantuntijan syntaksi:**
```
.clear_screen
```

#### WAIT_KEY

Odottaa, kunnes näppäintä painetaan, joten sinun ei tarvitse suorittaa `GETIN`-silmukkaa käsin joka kerta.

**Asiantuntijan syntaksi:**
```
.wait_key
```

#### DELAY

Odottaa pyydetyn määrän kehyksiä jaetun apurutiinin kautta. Käytä tätä lyhyisiin taukoihin ja ajoitusaukkoihin, kun täysin mukautettu silmukka olisi liiallinen. Kehysten määrä voi olla raakaluku tai nimetty vakio, ja `.wait` on vain `.delay`:n alias.

**Asiantuntijan syntaksi:**
```
.delay 29
.wait 29
.delay frames=FRAMES_1S
```

Lohkotilassa viivekenttä käyttää kompaktia vakiovalitsinta, kun symbolinen arvo on käytettävissä, joten sinun ei tarvitse kirjoittaa nimeä manuaalisesti joka kerta.

#### SET_BORDER / SET_BG

VIC-II-värirekisterien mukavuuskääreet. Väriarvo voi olla raakaluku tai nimetty vakio, joka ratkaisee välillä 0–15. Sekä lohkotila että asiantuntijatila hyväksyvät tässä symboliset vakioiden nimet.

**Asiantuntijan syntaksi:**
```
.set_border 6
.set_bg 0
.set_border color
.set_bg color
```

**Koko:** Jokainen apufunktio laajenee pieneksi rekisterin kirjoitussekvenssiksi tai lyhyeksi KERNAL-kutsuksi.

Lohkotilassa nämä kentät käyttävät myös vakiovalitsinta, joten symbolinen arvo pysyy näkyvissä sen sijaan, että se korvattaisiin raakaluvulla.

---

### IRQ_SETUP

Määrittää rasteri-IRQ-käsittelijän yhdellä vaiheella. Makro kirjoittaa IRQ-vektorin, ottaa käyttöön rasteri-IRQ:t, asettaa linjan, poistaa käytöstä yleiset CIA:n IRQ-lähteet ja palaa normaaliin suoritukseen komennolla `CLI`.

| Ala         | Kuvaus                                                  |
| ----------- | ------------------------------------------------------- |
| Käsittelijä | IRQ-rutiinin nimi (esim. `my_irq`)                      |
| Rasteri     | Rasteriviiva heksa- tai desimaalimuodossa (esim. `$FA`) |

**Asiantuntijan syntaksi:**
```
.irq_setup handler=my_irq, raster=$FA
```

**Koko:** Lyhyt asennussekvenssi; tarkka pituus riippuu valitusta rasteriviivasta.

Käytä tätä, kun haluat yleisen "SEI / asennuskäsittelijä / IRQ:n käyttöönotto / CLI" -mallin hajottamatta sitä koko ohjelmaan.

---

### RAND

Kuten pieni sisäänrakennettu PRNG** — palauttaa 8-bittisen pseudo-satunnaisen arvon kompaktista nollasivuisesta siemenestä.

| Ala    | Kuvaus                                                             |
| ------ | ------------------------------------------------------------------ |
| Siemen | Valinnainen nollasivun siementavu tai -tunniste (oletusarvo `$FB`) |

**Asiantuntijan syntaksi:**
```
.rand
```

**Koko:** Muutama tavu valitusta toteutustavasta riippuen.

Generaattori on tarkoitettu pelattavuuteen, tehosteiden muunteluun ja nopeaan testidataan. Se on tarkoituksella pieni eikä kryptografisesti hienostunut.

---

<a id="sprite_init"></a>
### SPRITE_INIT

Määrittää VIC-II-spritin yhdessä lohkossa — BASICissa kirjoitettavien noin kuuden POKE-lausekkeen sijaan riittää, että täytät kentät. Asettaa spritin dataosoittimen, ottaa sen käyttöön, valinnaisesti ottaa käyttöön moniväritilan ja asettaa sen värin.

| Ala         | Kuvaus                                                                  |
| ----------- | ----------------------------------------------------------------------- |
| Sprite #    | Sprite-numero 0–7                                                       |
| Väri        | Väri-indeksi 0–15 (C64-paletti)                                         |
| Tietosivu   | Sprite-datan osoite / 64 (esim. `$21`, jos data on osoitteessa `$0840`) |
| Monivärinen | Vaihtaa спрайtin monivärisbitin päälle/pois (`$D01C`)                   |

**Asiantuntijan syntaksi:**
```
.sprite_init 0, 7, $21
.sprite_init 0, 7, $21, multicolor
.sprite_init 0, 7, $21, mono
```

**Generoitu ASM:**
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

**Koko:** 26 tavua.

> **Sprite-tietosivu:** `tieto_osoite ÷ 64`. Oletusarvoisella BASIC SYS -tynkällä `ALIGN 64` sivun `JMP main` jälkeen sijoittaa sprite-tiedot kohtaan `$0840` → sivu = `$21`.

---

<a id="sprite_pos"></a>
### SPRITE_POS

Kuten **`POKE 53248, x : POKE 53249, y`** BASICissa — asettaa spritin aloituskohdan. Koordinaatit syötetään sisään kokoamisvaiheessa, ja kentät hyväksyvät vakioita lohkotilassa; animaatioon käytä `INC`/`DEC` suoraan spritin rekisterissä.

| Ala      | Kuvaus                  |
| -------- | ----------------------- |
| Sprite # | Sprite-numero 0–7       |
| X        | Vaakasuora asento 0–319 |
| Y        | Pystysuora asento 0–255 |

**Asiantuntijan syntaksi:**
```
.sprite_pos 0, 152, 100
```

**Generoitu ASM (esimerkki: sprite 0, X=152, Y=100):**
```
    LDA #$98        ; X low byte
    STA $D000       ; sprite 0 X register
    LDA $D010
    AND #$FE        ; clear X MSB for sprite 0 (X ≤ 255)
    STA $D010
    LDA #$64        ; Y = 100
    STA $D001       ; sprite 0 Y register
```

Jos X > 255, makro asettaa vastaavan bitin kohtaan `$D010` sen tyhjentämisen sijaan.

**Koko:** 18 tavua.

> **Huomautus:** `SPRITE_POS` lisää X/Y-matriisin koodiin (`LDA #$xx`). Sprite-objektin animoimiseksi suorituksen aikana käytä `INC $D000` / `DEC $D000` — katso `sprite-macro-demo` esimerkki.

---

<a id="wait_raster"></a>
### WAIT_RASTER

Odottaa, että VIC-II-elektronisuihku saavuttaa tietyn skannausviivan – ikään kuin synkronoituisi TV-ruudun kanssa. Aseta tämä pelisilmukan alkuun estääksesi spritejen repeytymisen. Ei JSR:ää, ei etikettiä tarvita.

| Ala          | Kuvaus                                                     |
| ------------ | ---------------------------------------------------------- |
| Rasteriviiva | Kohderasteriviiva heksadesimaalina (esim. `FF` = rivi 255) |

**Asiantuntijan syntaksi:**
```
.wait_raster $FF
```

**Generoitu ASM:**
```
wait:
    LDA $D012       ; current raster line
    CMP #$FF        ; target line
    BNE wait        ; loop back (-7 bytes)
```

**Koko:** 7 tavua (`BNE`-offset `$F9` = −7 osoittaa aina takaisin `LDA`-kohtaan).

> **Vinkki:** Aseta `WAIT_RASTER` pelisilmukan yläreunaan synkronoidaksesi sen näytön kanssa ja estääksesi spritejen repeytymisen.

---

### JOYSTICK

Kuten **`PEEK($DC00)`** lukeminen ja sitten справимая справита справита – mutta yhdessä lohkossa. Lukee yhden CIA-joystick-portin ja säätää справита X/Y-rekistereitä vastaavasti. Täysin inline-tilassa, ei JSR:ää tarvita.

| Ala      | Kuvaus                                                            |
| -------- | ----------------------------------------------------------------- |
| Portti   | `1` = portti 1 (`$DC01`) tai `2` = portti 2 (`$DC00`)             |
| Sprite # | Sprite-numero 0–7 (säätelee, mitä X/Y-rekisteriparia päivitetään) |

**Asiantuntijan syntaksi:**
```
.joystick 2, 0
```

**Generoitu ASM (portti 2, sprite 0):**
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

** Ohjaussauvan bittikartta (aktiivinen-LOW — bitti = 0 tarkoittaa painettuna):**

| Bitti | Suunta | CIA-rekisteri                       |
| ----- | ------ | ----------------------------------- |
| 0     | Ylös   | $DC00 (portti 2) / $DC01 (portti 1) |
| 1     | Alas   |                                     |
| 2     | Vasen  |                                     |
| 3     | Oikea  |                                     |
| 4     | Palo   | (tämä makro ei käsittele)           |

**Koko:** 27 tavua. `BCS`-offset on aina `+3` (ohittaa seuraavan 3-tavuisen `DEC`/`INC abs` -käskyn).

> **Tyypillinen käyttö:** Sijoita `gameloop`-otsikon sisään ensin `WAIT_RASTER`:
> ```
> gameloop:
>     WAIT_RASTER ($FF)
>     JOYSTICK (port=2, sprite=0)
>     JMP gameloop
> ```

---

<a id="mouse"></a>
### MOUSE

Lukee Commodore 1351 -suhteellisen hiiren ja liikuttaa спрайтиa. Täysin **inline** — ei JSR:ää tai label-koodausta tarvita. Makro valitsee CIA-portin, odottaa SID-mela-sisääntulojen tasaantumista, dekoodaa sitten delta-liikkeen käyttämällä 1351-vakioajurikuviota ja soveltaa sitä спрайтirekistereihin.

| Ala       | Kuvaus                                                                              |
| --------- | ----------------------------------------------------------------------------------- |
| Portti    | `1` = CIA `$DC00` bittiä `7:6` = `%01`; `2` = `%10`                                 |
| Sprite #  | Sprite-numero 0–7                                                                   |
| ZP-tavu X | Nollasivun osoite (heksa) edellisen POTX-näytteen säilyttämistä varten (esim. `FD`) |
| ZP-tavu Y | Nollasivun osoite (heksa) edellisen POTY-näytteen säilyttämistä varten (esim. `FE`) |

**Generoitu ASM-muoto (portti 1, sprite 0, ZP `$FD`/`$FE`):**

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

**Koko:** 142 tavua.

**Asiantuntijatilan syntaksi:**
```
.mouse port, spriteNum, zpX, zpY
; example:
.mouse 2, 0, FD, FE
```

> **Tärkeää:** Ennen ensimmäistä kutsua alusta nollasivutavut nykyisillä POTX/POTY-arvoilla välttääksesi hypyn ensimmäisessä kehyksessä:
> ```
>     ; port 1: LDA $DC00 : AND #$3F : ORA #$40 : STA $DC00
>     ; port 2: LDA $DC00 : AND #$3F : ORA #$80 : STA $DC00
>     LDA $D419 : LSR A : AND #$3F : STA $FD
>     LDA $D41A : LSR A : AND #$3F : STA $FE
> ```

> **Vinkki:** Kysele hiirtä kerran kehystä kohden — lisää `WAIT_RASTER` pelisilmukkaan ennen `MOUSE`.

---

<a id="sprite_col"></a>
### SPRITE_COL

Kuten BASICin **`PEEK($D01E)`** — tarkistaa VIC-II-laitteiston törmäysrekisterit ja kertoo, osuiko sprittiin toiseen spriteen vai taustaan. Täysin inline-tilassa, ei JSR:ää tarvita.

| Ala           | Kuvaus                                                                                                                |
| ------------- | --------------------------------------------------------------------------------------------------------------------- |
| Sprite #      | Spriten numero 0–7 (mitä spritin bittiä tarkistetaan)                                                                 |
| Törmäystyyppi | `Sprite-Sprite ($D01E)` — törmäys toisen spriten kanssa; `Sprite-Background ($D01F)` — törmäys taustagrafiikan kanssa |

**Asiantuntijan syntaksi:**
```
.sprite_col 0, sprite
.sprite_col 0, background
```

**Generoitu ASM (sprite 0, sprite–sprite):**
```
    LDA $D01E       ; read sprite-sprite collision register (clears it!)
    AND #$01        ; isolate bit 0 (sprite 0)
                    ; A ≠ 0 → collision occurred
```

**Koko:** 5 tavua.

> **Tärkeää:** Lukeminen `$D01E`/`$D01F` ** tyhjentää rekisterin**. Lue se kerran kehystä kohden ja toimi tuloksen perusteella välittömästi komennolla `BEQ`/`BNE`.

**Tyypillinen käyttö:**
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

> **Katso myös:** `törmäysdemo` esimerkki — vihreä pallo (sprite #0) vs. punainen risti (sprite #1).

---

### LOADFILE

Kuten BASICissa komennot **`LOAD "tiedosto",8`** — lataa tiedoston D64-levyltä suorituksen aikana käyttämällä KERNAL LOAD -rutiinia. Käytä tätä ladataksesi tietoja, musiikkia tai muuta koodia levyltä ohjelman ollessa käynnissä.

| Ala                           | Kuvaus                                                                                                                                                                                                                |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tiedostonimi                  | Tiedoston nimi levyllä (enintään 16 merkkiä, automaattisesti isot kirjaimet; merkit `,`, `"`, `/`, `\`, `:`, `*`, `?`, `&lt;`, `&gt;`, `|` suodatetaan)                                                               |
| Laite                         | Laitenumero 8–30 (oletus `8`)                                                                                                                                                                                         |
| Ohitusosoite (valinnainen)    | Heksamuotoinen latausosoite (esim. `C000`). Jos asetettu, tiedosto ladataan tähän osoitteeseen (`sec=0`, jättäen PRG-otsikon huomiotta). Jätä tyhjäksi käyttääksesi tiedoston omaa 2-tavuista PRG-otsikkoa (`sec=1`). |
| Virheen otsikko (valinnainen) | Jos asetettu, JSR LOAD -käskyn jälkeen luodaan `BCS`-käsky. Jos KERNAL palauttaa carry set -arvon (virhe), suoritus hyppää tähän tunnisteeseen.                                                                       |

**Asiantuntijan syntaksi:**
```
.loadfile "DEMO-COLORS", 8
.loadfile "DEMO-COLORS", 8, $C000
.loadfile "DEMO-COLORS", 8, $C000, error_label
```

**Generoidun koodin rakenne:**
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

**Koko:** `3 + tiedostonimen_pituus + 9 (SETNAM) + 9 (SETLFS) + (4 jos ohitus) + 5 (LOAD) + (2 jos virheen nimi)` tavua. Vähintään 27 tavua.

> **Tärkeää:** Tiedostonimi tallennetaan konekoodiin heti `JMP skip_filename` -makromerkinnän jälkeen. Levyllä olevan tiedostonimen on oltava isoja PETSCII-kirjaimia – mikä vastaa tavallisia ASCII-isoja kirjaimia (`A`–`Z`). Makro valvoo tätä automaattisesti.

> **Käytä aina virhetunnistetta** tuotanto-ohjelmissa — jos tiedostoa ei löydy, KERNAL asettaa siirtolipun ja suoritus siirtyy seuraavaan tehtävään.

> **Katso myös:** `loadfile-demo` esimerkki — esittelee `DEMO-COLORS.PRG` -tiedoston lataamista D64-tiedostosta BCS-virhehaaran ja visuaalisen virhenäytön avulla.

---

### EXODECRUNCH

Ohjelman sisäinen **Exomizer-pakkauksen purku**. Käytä tätä makroa heti `LOADFILE`-komennon jälkeen, joka latasi Exomizer `mem`-tilassa pakatun virran — EXODECRUNCH purkaa sen taaksepäin virtaan upotettuun osoitteeseen.

| Ala              | Kuvaus                                                                                                              |
| ---------------- | ------------------------------------------------------------------------------------------------------------------- |
| Pakkaajan osoite | Pakkauksenpurkukoodin sijainti muistissa (oletusarvo `B000`). Osoitteen on oltava 16-bittinen heksadesimaaliosoite. |

**Asiantuntijan syntaksi:**
```
.exodecrunch
.exodecrunch depacker=$B000
```

**Generoitu koodi (19 tavua):**
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

**Toimintaperiaate:**

1. KERNAL `LOAD` ($FFD5) päivittää ZP `$AE/$AF` -tiedoston osoittamaan yhden tavun viimeksi ladatun tavun ohi. EXODECRUNCH kopioi tämän ZP `$04/$05` -tiedostoon, mikä on Exomizerin virallinen taaksepäin lähteen ja pään välinen käytäntö.
2. Pakkauksenpurkuohjelma sijoitetaan tyypillisesti kohtaan `$B000` (BASIC ROM -muistin määrittämän alueen sisällä). Makro vaihtaa tilaan `$01 = $36`, joten suoritin näkee RAM-muistin siellä JSR:n aikana ja palauttaa sitten `$01 = $37` -muistin sen jälkeen.
3. Pakkauksen kohdeosoite **koodataan itse pakattuun tietovirtaan**, kun pakkaat sen komennolla `exomizer mem -l <load> file,<target>` — purkaja lukee sen virran ensimmäisistä tavuista.

**Pakkaajan binääritiedosto:** Valmiiksi rakennettu taaksepäin purkaja on `samples/exo-decrunch.bin` (477 tavua, ORG $B000). Se on virallisen `exodecrunch.asm`-tiedoston Kick Assembler-versio, johon on lisätty `INC $D020` jokaiseen lukukertaan näkyvän reunan välähdysefektin aikaansaamiseksi purkamisen aikana. Sijoita se ohjelmaasi `INCBIN`-lohkolla pakkaajan osoitteessa.

**Turvapoikkeaman kompensointi:** Exomizerin oletusmuistitila käyttää 2-tavuista turvapoikkeamaa – data saapuu 2 tavua aikaisemmin kuin pyydetty kohde. Suorita D64:n kautta -valintaikkuna **lisää automaattisesti luvun 2 Dst-kenttään** ennen exomizerin kutsumista, joten näkyvä käyttäytyminen vastaa kirjoittamaasi osoitetta.

> **See also:** the `exo-multicolor-demo` sample — full end-to-end example: LOADFILE a compressed multicolor bitmap to $C000, EXODECRUNCH unpacks it to $2000, then copy screen → $0400 and color → $D800, and switch VIC-II to multicolor bitmap mode.

> **Integraatiotesti:** `cargo test --test exomizer_integration` (tiedostossa `src-tauri/`) tarkistaa täyden pakkauksen ja purun edestakaisen matkan 6502-emulaattorilla oikealla pakkauksenpurkubinäärillä. Läpäisykriteerit: 10000 tavua, joka on tavujen verran yhtä suuri kuin lähteen `multi-color.bin`.

---

### REU_CHECK

Havaitsee, onko Commodore RAM -laajennusyksikkö (REU) kytketty – ikään kuin tarkistaisi `PEEK($D010)` laitteiston läsnäolon. Testaa kirjoittamalla ja lukemalla kaksi kuviota REU-rekisteriin `$DF04`.

| Ala       | Kuvaus        |
| --------- | ------------- |
| Ei mitään | Ei operandeja |

**Generoitu koodi (34 tavua):**
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
> Makro normalisoi tuloksen, joten seuraava haara pysyy yksinkertaisena: `BNE` tarkoittaa, että REU on läsnä, `BEQ` tarkoittaa, että REU puuttuu.

**Asiantuntijan syntaksi:**
```
.reu_check
```

**Tulos lipuissa:**
- **Z = 0** (tulos ≠ 0) → REU läsnä → käytä `BNE`
- **Z = 1** (tulos = 0) → ei REU:ta → käytä `BEQ`

**Ei konfiguroitavia kenttiä** — makro luo saman koodin joka kerta.

**Tyypillinen käyttö:**
```assembly
REU_CHECK
BEQ no_reu        ; skip if REU not present
; ... REU code here ...
no_reu:
```

---

### REU_STASH / REU_FETCH / REU_SWAP

DMA-lohkonsiirto C64 RAM -muistin ja REU-laajennusmuistin välillä – kuin erittäin nopea POKE-silmukka, mutta suoritin ei tee mitään (REU-siru kopioi tiedot suorittimen ollessa pysähdyksissä). 1000 tavun siirto on käytännössä välitön.

| Makro       | Suunta        | `$DF01`-komento |
| ----------- | ------------- | --------------- |
| `REU_STASH` | C64 RAM → REU | `90 dollaria`   |
| `REU_FETCH` | REU → C64 RAM | `91 dollaria`   |
| `REU_SWAP`  | C64 RAM ↔ REU | `92 dollaria`   |

**Kentät:**

| Ala        | Kuvaus                                           | Esimerkki |
| ---------- | ------------------------------------------------ | --------- |
| C64-osoite | Lähde/kohde C64 RAM -muistissa (heksadesimaali)  | `C000`    |
| REU-osoite | Lähde/kohde REU:ssa (heksa, 16-bittinen)         | `0000`    |
| REU-pankki | REU-muistipankki (0–7)                           | `0`       |
| Pituus     | Siirrettävien tavujen määrä (heksa, 16-bittinen) | `1000`    |

**Asiantuntijan syntaksi:**
```
.reu_stash $C000, $0000, 0, $1000
.reu_fetch $C000, $0000, 0, $1000
.reu_swap $C000, $0000, 0, $1000
```

**Generoitu koodi (40 tavua):**
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

> **Huomautus:** Komennot käyttävät `$90/$91/$92` (bitti 4 asetettu = välitön DMA-tila). Kirjoittaminen kansioon `$DF01` aloittaa siirron; suoritin jatkaa toimintaansa, kun se on valmis.

---

### TURBO_SET

Asettaa **Ultimate-64 (U64) -prosessorin nopeuden** rekisterin `$D031` kautta. Ei vaikutusta oikeaan C64:ään tai muihin emulaattoreihin.

**Kentät:**

| Ala         | Kuvaus                    | Alue                                                |
| ----------- | ------------------------- | --------------------------------------------------- |
| Nopeus      | Suorittimen nopeusindeksi | 0 = 1 MHz … 7 ≈ 10 MHz … 15 ≈ 48 MHz                |
| Huono linja | Badline-emulointi         | Käytössä (C64-yhteensopiva) / Pois käytöstä (turbo) |

Nopeustavu lasketaan seuraavasti: `(speedIndex &amp; 0x0F) | (badline_disabled ? 0x80 : 0x00)`.

**Generoitu koodi (5 tavua):**
```
A9 xx   LDA #speed_byte
8D 31 D0   STA $D031
```

**Asiantuntijatilan syntaksi:**
```
.turbo_set 7,0    ; speed=7 (~10 MHz), badline enabled
.turbo_set 15,1   ; speed=15 (~48 MHz), badline disabled
```

> **Huom:** Tämä makro vaikuttaa vain U64-laitteistoon. Oikealla C64:llä tai muilla emulaattoreilla tämä kirjoittaa tiedostoon `$D031`, mikä voi vaikuttaa CIA:han tai se voidaan jättää huomiotta.

---

### SUPERCPU_DETECT

Tarkistaa, onko **CMD SuperCPU** -kiihdytin asennettu — esimerkiksi `PEEK($D0B8)`, ja tarkistaa, palauttaako se jonkin muun funktion kuin `$FF`.

**Generoitu koodi (5 tavua):**
```
AD B8 D0   LDA $D0B8
C9 FF      CMP #$FF
```

**Tulos lipuissa:**
- **Z = 0** → SuperCPU läsnä → käytä `BNE`
- **Z = 1** → SuperCPU:ta ei löydy → käytä `BEQ`

**Ei konfiguroitavia kenttiä.**

**Asiantuntijan syntaksi:**
```
.supercpu_detect
```

**Tyypillinen käyttö:**
```assembly
SUPERCPU_DETECT
BEQ no_scpu       ; skip if SuperCPU not present
; ... SuperCPU turbo code here ...
no_scpu:
```

---

### TURBO_ENABLE

Kytkee **CMD SuperCPU turbo -tilan** päälle tai pois päältä. Kutsu ensin `SUPERCPU_DETECT` ja ohita tämä, jos SuperCPU:ta ei ole.

| Tila            | Rekisteröidy | Vaikutus                                                   |
| --------------- | ------------ | ---------------------------------------------------------- |
| Ota käyttöön    | `$D07A`      | Turbo-ominaisuuden käyttöönotto (jopa 20 MHz SuperCPU:lla) |
| Poista käytöstä | `$D07B`      | Palaa 1 MHz:n yhteensopivuustilaan                         |

**Generoitu koodi (5 tavua):**
```
A9 00         LDA #$00
8D 7A D0      STA $D07A    ; (or $D07B for disable)
```

**Asiantuntijatilan syntaksi:**
```
.turbo_enable on
.turbo_enable off
```

> **Huomautus:** Kutsu ensin `SUPERCPU_DETECT`-makroa ja haaraudu tämän makron ympärille, jos SuperCPU:ta ei ole.

---

<a id="map_copy"></a>
### MAP_COPY

Kopioi laattakartan lähdeosoitteesta näyttömuistiin (ja valinnaisesti värimuistiin) käyttämällä sarjaa `LDA abs,X` / `STA abs,X` silmukoita. Yksi 256-tavuinen sivu kopioidaan silmukkaiteraatiota kohden; osittainen sivu lopussa käyttää `CPX #rem / BNE` pysäyttämiseen. JSR-komentoa ei tarvita — kaikki koodi luodaan inline-tilassa.

| Ala                      | Kuvaus                                                                                                                                                                    |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lähdeosoite (näyttö)     | Heksa-osoite, jossa karttatiedot sijaitsevat latauksen jälkeen (esim. `C000`)                                                                                             |
| Näytön RAM-muistin kohde | Minne kopioida näyttökoodit (esim. `0400`)                                                                                                                                |
| Koko (tavua)             | Kopioitavien tavujen kokonaismäärä — tyypillisesti `$03E8` = 1000 (40 × 25 merkkiä)                                                                                       |
| Yhdistetty .bin-tiedosto | Kun tämä on valittuna, odottaa näyttökoodeja välittömästi väridatan perässä kohdassa `source + size`; kopioi väridatan **Color RAM -muistiin dest** toisella kierroksella |
| Väri-RAM-kohde           | Väritietojen kohde — oletusarvo `D800` (C64-väri-RAM)                                                                                                                     |

**Generoitu ASM (1000 tavun kartta, vain näyttö):**
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

**Koko:** `2 (LDX) + fullPages×9 + (rem &gt; 0 ? 11 : 0)` tavua osiota kohden. Yhdistetty tila kaksinkertaistaa sen (näyttöosio + identtisen värin osio).

**Yhdistäminen karttaeditorin kanssa:**

Karttaeditorin **Files → Save map + color RAM (.bin)** vie yhden binääritiedoston, jossa ensimmäiset `size` tavut ovat näyttökoodeja ja seuraavat `size` tavut ovat väri-RAM-arvoja. Käytä MAP_COPY-komentoa, jossa **Combined .bin** on valittuna ja osoita **Source addr** kohtaan, johon tämä tiedosto ladataan (esim. INCBIN:n kautta kohtaan `$C000`):

```
* = $C000
    INCBIN "map-color.bin" @ $C000   ; screen codes $C000–$C3E7, color $C3E8–$C7CF
* = $0801
    ; ...
    MAP_COPY src=$C000 dst=$0400 size=1000 combined color_dst=$D800
```

**Asiantuntijatilan syntaksi:**
```
.map_copy $C000, $0400, 1000               ; screen only
.map_copy $C000, $0400, 1000, auto, $D800  ; combined (color at src+size)
.map_copy $C000, $0400, 1000, $C3E8, $D800 ; explicit color source address
```

---

<a id="map_copy16x16"></a>
### MAP_COPY16X16

Kopioi 16×16 merkkialueen kompaktista 256-tavuisesta näyttökoodilohkosta sekä vastaavan 256-tavuisen Color RAM -lohkon. Se on tarkoitettu Charset Canvas -viennille ja pienille laatta-/kuvalohkoille, joissa kuudentoista erillisen MAP_COPY-rivin kirjoittaminen olisi kohinaa.

**Oletusasettelu:**

| Data                     | Oletusosoite                   |
| ------------------------ | ------------------------------ |
| 16×16 näyttökoodit       | Lähdeosoite (`src`)            |
| 16×16 väriarvot          | `lähde + 256`                  |
| Näytön RAM-muistin kohde | `0400 $ + rivi × 40 + sarake ` |
| Väri-RAM-kohde           | `$D800 + rivi×40 + sarake`     |

**Asiantuntijatilan syntaksi:**
```
.map_copy16x16 $3000, 12, 4
.map_copy16x16 $3000, 12, 4, $0400, $3100, $D800
```

Lyhyt muoto kopioi näyttötavut sarakkeesta `$3000`, väritavut sarakkeesta `$3100` ja sijoittaa 16×16-lohkon sarakkeeseen 12, riville 4. Kelvolliset vasemman yläkulman sijainnit ovat `col = 0..24` ja `row = 0..9`, joten koko 16×16-alue jää 40×25 C64 -tekstinäytölle.

**Generoitu käyttäytyminen:**

- Luo kuusitoista rivikohtaista kopiota.
- Jokainen rivi kopioi 16 näyttötavua ja 16 väritavua.
- JSR:ää ei tarvita; koodi lähetetään suoraan makron sijaintiin.
- Toimii normaalin merkkitilan ja monivärisen merkkitilan kanssa; Color RAM -tavut sisältävät kunkin solun merkkivärin/monivärin käyttöönottobitin.

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

Siirtää спрайtin animaatiokehystä eteenpäin jokaisella kutsulla ja päivittää VIC-II спрайtin dataosoittimen. Tallenna yksi tavu kehystä kohden taulukkoon (спрайtin datasivunumero = `data_address / 64`), osoita SPRITE_ANIM siihen ja kutsu sitä kerran pelikehystä kohden – JSR:ää ei tarvita.

| Ala                   | Kuvaus                                                                                               |
| --------------------- | ---------------------------------------------------------------------------------------------------- |
| Sprite #              | Sprite-numero 0–7                                                                                    |
| Kehysluettelon osoite | Kehystaulukon heksaosoite — yksi tavu kehystä kohden, jokainen tavu = sprite-sivu (`data_addr / 64`) |
| Kehysten määrä        | Kehysten kokonaismäärä (1–255)                                                                       |
| Runko ZP              | Kehyslaskurina käytetty nollasivutavu (esim. `FB`)                                                   |

**Generoitu ASM (sprite 0, 4 kehystä, ZP `$FB`, lista kohdassa `$C100`):**
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

**Koko:** 19 tavua.

**Tyypillinen käyttö:**
```
frameTable:
    .byte $21, $22, $23, $24   ; 4 frames at $0840, $0880, $08C0, $0900

gameloop:
    WAIT_RASTER ($FF)
    SPRITE_ANIM (sprite=0, list=$C100, count=4, zp=$FB)
    JMP gameloop
```

**Asiantuntijatilan syntaksi:**
```
.sprite_anim spriteNum, frameListAddr, frameCount, zpByte
; example:
.sprite_anim 0, C100, 4, FB
```

> **Vinkki:** Sijoita kehystaulukko RAWBYTES-lohkona kiinteään osoitteeseen. Laskurin ZP-tavu (`$FB`) on alustettava arvoon `$00` ennen ensimmäistä kutsua. Jos koodisi käyttää `$FB` johonkin muuhun, valitse vapaa ZP-sijainti.

---

<a id="score_bcd"></a>
### SCORE_BCD

Lisää kiinteän pisteen arvon muistiin tallennettuun monitavuiseen BCD-pistemäärään ja renderöi sitten jokaisen numeron näyttö-RAM-muistiin näyttökoodimerkkinä. Käyttää 6502-desimaalitilaa (`SED`/`CLD`) turvalliseen BCD-aritmetiikkaan – manuaalista kortin vaihtamista ei tarvita.

| Ala              | Kuvaus                                                                                                         |
| ---------------- | -------------------------------------------------------------------------------------------------------------- |
| Pisteiden osoite | BCD-pistetavujen heksaosoite (esim. `C200`). Alhaisin tavu ensin.                                              |
| Numerot          | BCD-tavujen määrä (jokainen tavu sisältää kaksi numeroa: `$99` = "99"). `4` tavua = enintään 99999999.         |
| Lisää pisteitä   | Kutsua kohden lisättävä desimaaliarvo (esim. `100`).                                                           |
| Näytön osoite    | Mihin numeronäyttökoodit kirjoitetaan (esim. `0400`). Yksi tavu numeroa kohden (korkeampi tavun numero ensin). |

**Asiantuntijan syntaksi:**
```
.score_bcd $C200, 4, 100, $0400
```

**Generoitu ASM (4 tavua, +100 pistettä, pisteet kohdassa `$C200`, näyttö kohdassa `$0400`):**
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

**Koko:** `3 + numerot × 8` tavua (SED + CLC + CLD-lisäkuorma + 8 tavua BCD-tavua kohden ADC:lle + näyttösilmukalle).

**Asiantuntijatilan syntaksi:**
```
.score_bcd $C200, 4, 100, $0400
```

> **Vinkki:** Alusta pistetavut arvoon `$00` käynnistyksen yhteydessä. Pisteosoitteen tulisi olla nollasivu- eli absoluuttisessa RAM-muistissa – ei ROM-muistissa. Näyttöosoitteen tulisi osoittaa vasemmanpuoleisimpaan numerosoluun; numerot kirjoitetaan vasemmalta oikealle (merkittävin tavu ensin).

> **BCD-alue:** `numerot = 4` tavua → 8 desimaalinumeroa → enimmäispistemäärä 99 999 999. Jokainen tavu koodaa kaksi BCD-numeroa: `$00`–`$99`.

---

## 10. Virheenkorjausintegraatio

Sovellus tukee **RetroDebuggeria** ulkoisena C64-virheenkorjaajana. Se vastaanottaa kootusta ohjelmasta luodut keskeytyspisteet, symbolit ja automaattisen käynnistyksen merkinnät.

### RetroDebugger

[RetroDebugger](https://github.com/slajerek/RetroDebugger) on eri alustoilla toimiva Commodore 64 -virheenkorjausohjelma, jossa on tuki keskeytyskohdille, muistin tarkastus ja tunnistetietoinen purkaminen.

**Asennus:** Avaa **Asetukset → Määritä RetroDebugger-suoritettava tiedosto** ja osoita sillä `RetroDebugger`-binääritiedosto.

**Käynnistä:** Napsauta työkalupalkissa **Debug (RetroDebugger)**. Sovellus:

1. Kokoa ohjelma tiedostoksi `.prg` väliaikaiseen hakemistoon.
2. Kirjoita **katkaisukohtatiedosto** (`katkaisukohdat.txt`) — yksi `katkaisu $ADDR` jokaista merkittyä lohkoa kohden.
3. Kirjoita **symbolitiedosto** (`symbols.txt`) Vice/RetroDebugger-otsikkomuodossa (`al C:addr .name`). Kaikki LABEL- ja CONST-lohkot sisältyvät tiedostoon.
4. Kirjoita myös C64Debugger-tyyliset sivuvaunut käännetyn PRG:n viereen: `.dbg`, `.sym` ja `.vs`.
5. Käynnistä RetroDebugger komennolla:
   ```
   RetroDebugger -prg <file.prg> -breakpoints <breakpoints.txt> -symbols <symbols.txt> [flags]
   ```

### Katkaisupistelohkot

Napsauta minkä tahansa käskylohkon keskeytyskohdan kuvaketta (●) vaihtaaksesi sen keskeytyskohdaksi. Keskeytyskohdat sisältävät lohkot on korostettu punaisella. Niiden osoitteet kirjoitetaan keskeytyskohtatiedostoon jokaisella virheenkorjaimen käynnistyskerralla.

### Virheenkorjausliput (Asetukset-välilehti)

| Vaihda                 | Lippu           | Vaikutus                                                               |
| ---------------------- | --------------- | ---------------------------------------------------------------------- |
| `-hyppy` PÄÄLLÄ        | `-jump $OSOITE` | Hyppää suoraan ohjelman aloitusosoitteeseen latauksen jälkeen          |
| `-jatka taukoa` PÄÄLLÄ | `-jatka taukoa` | Poista debuggerin keskeytys välittömästi latauksen yhteydessä          |
| `-odota` PÄÄLLÄ        | `-odota <ms>`   | Odota `<ms>` millisekuntia ennen tauon jatkamista — 500 ms tai 1000 ms |

> **Vinkki:** Useimmille ohjelmille kannattaa ottaa käyttöön `-jmp` ja `-unpause` välitöntä automaattista käynnistystä varten. Käytä `-wait 500` tai `-wait 1000`, kun ohjelmasi määrittää keskeytyksiä tai SID-musiikkia, jonka alustusaika on ennen ensimmäistä rasteria.

---

## 11. Tietopankin linkit

Pikalinkit löytyvät sovelluksesta kohdasta **Tietokannasta**:

| Resurssi               | URL-osoite                                     |
| ---------------------- | ---------------------------------------------- |
| 6502 Opcodes Reference | http://www.6502.org/tutorials/6502opcodes.html |
| C64 KERNAL-funktiot    | https://sta.c64.org/cbm64krnfunc.html          |
| C64-muistikartta       | https://sta.c64.org/cbm64mem.html              |
| C64-värikoodit         | https://sta.c64.org/cbm64col.html              |
| VIC-II-artikkeli       | https://www.cebix.net/VIC-Article.txt          |
| C64-koodikanta         | https://codebase.c64.org/                      |
| Turbo-kokoonpanija     | https://turbo.style64.org/                     |
| RetroDebugger          | https://github.com/slajerek/RetroDebugger/     |

---

## 12. D64 Vie ja suorita

Versio 1.5.1 lisää mahdollisuuden pakata ohjelmasi (ja muut datatiedostot) C64 D64 -levykuvaan ja käynnistää sen VICE:ssä — tai viedä levykuva muualle käytettäväksi.

### Jaettu juoksu -painike

Työkalupalkin **Suorita**-painike on korvattu **jakopainikkeella**:

| Osa                 | Toiminta                        |
| ------------------- | ------------------------------- |
| **▶ Suorita** (pää) | Suorittaa valitun suoritustilan |
| **▾** (nuoli)       | Avaa tilanvalitsimen            |

**Käytettävissä olevat ajotilat:**

| Tila                      | Kuvaus                                                                                                                                                                                                                        |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Suorita PRG:nä**        | Kokoa väliaikaiseksi `.prg`-tiedostoksi ja käynnistä VICE suoraan. Klassinen toimintatapa.                                                                                                                                    |
| **Suorita D64:n kautta**  | Kokoa, luo `.d64`-levykuva (käyttäen c1541-tiedostoa), lisää kaikki määritetyt tiedostot ja käynnistä sitten VICE levyltä. Käytä tätä aina, kun ohjelmasi lataa tiedostoja suorituksen aikana (esim. LOADFILE-makron avulla). |
| **Suorita laitteistolla** | Kokoa PRG:ksi ja lähetä se **1541 Ultimate / Ultimate 64** -laitteeseen lähiverkon kautta. Katso [Osa 13](#13-hardware-settings).                                                                                             |

Valittu tila tallennetaan istuntojen välillä.

### Vie D64-ikkunaan

Avaa pudotusvalikosta **Tallenna PRG ▾** → **Vie tiedostoon D64**. Valintaikkunassa voit:

1. Aseta **levyn nimi** (enintään 16 merkkiä) ja **ohjelman nimi** — nämä nimet näkyvät C64-levyhakemistossa.
2. **Lisää tiedostoja** — napsauta **+** valitaksesi minkä tahansa binääritiedoston (`.prg`, `.bin`, `.sid` jne.). Jokaista lisätiedostoa kohden:
   - **Nimi** — miten se näkyy D64-hakemistossa (enintään 16 merkkiä, automaattisesti isot kirjaimet).
   - **Addr** (latausosoite, valinnainen) — jos annettu, alkuun lisätään 2-tavuinen PRG-otsikko. Jätä tyhjäksi kirjoittaaksesi raakatavuja ilman otsikkoa.
   - **Dst** (purkukohde, vain EXO:n kanssa) — mihin pakkauksen purkajan tulisi sijoittaa tiedot C64:lle. Kun EXO on käytössä, lisätiedot pakataan komennolla `exomizer mem -l <Osoite> file,<Dst>` ennen niiden kirjoittamista D64:lle. +2 turva-offset-kompensaatiota käytetään automaattisesti.
   - **EXO** — valintaruutu, joka ottaa käyttöön taaksepäin tapahtuvan `mem`-tilan murskaamisen tälle merkinnälle. Levyllä olevan tiedon koko on tyypillisesti 5–20 % alkuperäisestä.
3. Luo **Vie** -tiedosto VICE:n `c1541`-työkalulla napsauttamalla **Vie**.

**Yhdistäminen EXODECRUNCH:**:n kanssa: Kun lähetät tiedoston, jonka EXO=on on asetettu, sitä lukevan ohjelman tulisi LADATA se **Addr**-osoitteeseen (sec=1, tiedoston oma PRG-otsikko) ja kutsua sitten **EXODECRUNCH**-makroa purkaakseen sen taaksepäin **Dst**-tiedostoon. Katso täydellinen malli `exo-multicolor-demo`-esimerkistä.

### D64-metatiedot projekteissa

Levyn nimi, ohjelman nimi ja lisätiedostoluettelo tallennetaan projektin JSON-tiedostoon (`d64`-avaimeen). Kun lataat projektin tai esimerkin, joka sisältää D64-metatiedot, uudelleen, lisätiedostot palautetaan automaattisesti – niitä ei tarvitse lisätä uudelleen joka kerta.

**loadfile-demo**-esimerkkitiedosto on esikonfiguroitu ja sisältää lisätiedoston `DEMO-COLORS.PRG`. Valitse se, avaa **Run via D64** ja napsauta **Run** nähdäksesi koko latausprosessin toiminnassa.

> **Vaatimus:** Sekä D64-vienti että suoritus D64:n kautta edellyttävät VICE:n (`c1541`) määrittämistä kohdassa [Laitteistoasetukset](#13-hardware-settings).

### D64 Editor (selaa ja muokkaa olemassa olevaa levykuvaa)

Käyräeditorin jälkeinen työkalupalkin kuvake avaa **D64-editorin** – itsenäisen työkalun olemassa olevan `.d64`-kuvan käsittelyyn suoraan, riippumatta avoimesta ohjelmasta. Toisin kuin yllä oleva Vie D64:ään -valintaikkuna (joka aina luo *uuden*-levyn käännetystä PRG:stä), D64-editori muokkaa levykuvaa paikallaan `c1541`-tiedoston kautta, joten se toimii myös kevyenä levynhallintaohjelmana.

**Tiedostot ▾ -valikko:**

| Tuote                    | Toiminta                                                                       |
| ------------------------ | ------------------------------------------------------------------------------ |
| **Uusi D64…**            | Valitse kohdepolku ja luo sinne juuri alustettu, tyhjä levykuva.               |
| **Avaa D64…**            | Valitse olemassa oleva `.d64`-tiedosto ja lataa sen hakemisto.                 |
| **Tallenna nimellä…**    | Kopioi avoinna oleva levykuva uuteen polkuun ja jatka kopion muokkaamista.     |
| **Suorita VICE-tilassa** | Käynnistä avoinna oleva levykuva suoraan VICE-ohjelmassa (`-drive8type 1541`). |

**Työkalurivi:**

| Kuvake                      | Toiminta                                                                                        |
| --------------------------- | ----------------------------------------------------------------------------------------------- |
| **Lisää ohjelma**           | Valitse paikallinen tiedosto ja kirjoita se levyhakemistoon.                                    |
| **Pura valittu**            | Tallenna valitun merkinnän tavut paikalliseen `.prg`-tiedostoon.                                |
| **Nimeä valittu uudelleen** | Muokkaa merkinnän nimeä taulukon rivillä — Enter vahvistaa, Esc peruu.                          |
| **Poista valitut**          | Poista valittu merkintä levyltä.                                                                |
| **Päivitä**                 | Lue hakemisto uudelleen, esimerkiksi sen jälkeen, kun olet muokannut levyä toisella työkalulla. |

**Ohjelman lisääminen:** Tiedoston valitseminen, joka päättyy jo `.prg`, pyytää vain **Nimen** ja levyn **Tyypin** (PRG/SEQ/USR/REL) – `.prg` sisältää jo oman latausosoiteotsikkonsa, joten se kirjoitetaan muuttumattomana. Minkä tahansa muun tiedoston (esim. raaka `.bin`) valitseminen näyttää lisäksi:

- **Lataa osoite** (heksadesimaali, valinnainen) — lisää tähän osoitteeseen 2-tavuisen PRG-otsikon; jätä tyhjäksi kirjoittaaksesi tavut raakana.
- **Pura osoite** (heksadesimaali, valinnainen) — käytetään vain yhdessä Exomizerin kanssa; kohdeosoite, johon purkajan tulisi purkaa tiedot.
- **Exomizer** -valintaruutu — pakkaa tiedoston ennen kirjoittamista käyttäen samoja `mem`/`sfx` -tiivistystiloja kuin yllä olevan Vie D64:ään -valintaikkunan lisätiedostoille.

Hakemistoluettelo näyttää tiedostonimet samalla fontilla ja isoilla kirjaimilla kuin oikea C64 `LOAD"$",8` -luettelo.

> **Vaatimus:** Kuten D64-tiedostoon vienti, D64-editori vaatii VICE (`c1541`) -komennon, joka on määritetty kohdassa [Laitteistoasetukset](#13-hardware-settings). Jokainen toiminto (lisääminen/poistaminen/uudelleennimeäminen/purkaminen) sovelletaan suoraan levyllä olevaan `.d64`-tiedostoon – erillistä tallennusvaihetta ei ole.

---

## 12b. CRT-vienti (Magic Desk 64K -kasetti)

**Valikko → Koonti → Koonti CRT** tuottaa Commodore 64 -kasetin levykuvan (`.crt`, **kasettityyppi 19 — Magic Desk / Domark / HES Australia**), joka toimii VICE:llä, TheC64:llä, oikealla laitteistolla EasyFlashin / Kung Fu Flashin kautta ja 1541 Ultimate II+ -kasettipaikalla. Se on saatavilla sekä **lohkotilassa** että **asiantuntijatilassa**, ja — nykyisestä koontiversiosta lähtien — myös **UltimateBasic-tilassa**.

### Mitä ostoskorissa lähetetään

- **8 × 8 kt pankkia** hintaan `$8000`, pankkien välinen vaihto `$DE00`:n kautta (Magic Desk -käytäntö: 3 alinta bittiä = pankki, bitti 7 = ostoskorin poistaminen käytöstä).
- **Bank 0** sisältää 128-tavuisen otsikon ja käynnistyslataimen:
  - `$8000/$8002` kylmä- ja lämminkäynnistysvektorit osoittavat pisteeseen `$8009`.
  - `$8004–$8008` = KERNAL-nollauskoodin vaatima `CBM80`-allekirjoitus.
  - `$8009–$807F` = lataaja: SEI / stack init / `JSR $FDA3` (IOINIT) / `JSR $FD50` (RAMTAS) / `JSR $FD15` (RESTOR) / `JSR $FF5B` (CINT), sitten tavukopiointisilmukka, joka suoratoistaa hyötykuorman cart ROM:sta RAM:iin ja vaihtaa pankkia, kun `$FC` saavuttaa `$A0`. Lopuksi se kopioi pienen **exit stub** kohteeseen `$0100`, poistaa ostoskorin käytöstä `LDA #$80 : STA $DE00` -komennolla ja `JMP` -komennolla sisääntulopisteeseen.
- **Hyötykuorma** alkaa pankissa 0 kohdasta `$8080` ja jakautuu tarvittaessa pankkeihin 1–7. Suurin hyötykuorma = `8 * 8192 − 128 = 65 408 tavua`.

### Kuormausosoite ja saapumispiste

Build CRT ei koskaan käytä Exomizeria (pakkauksenpurkuohjelmaa ei voi suorittaa cart ROMilta). Se kääntää nykyisen välilehden tavallisella automaattisen käynnistyksen putkella ja ottaa latausosoitteen PRG-otsikosta ja aloituspisteen SYS-kohteesta:

- **Lohko-/asiantuntijatila, jossa on BASIC SYS -tynkä:** load = `$0801`, merkintä = SYS-kohde (yleensä `$080D` tai käyttäjän alkuperä).
- **Lohko-/asiantuntijatila, jossa BASIC SYS -tynkä on pois päältä:** lataus = käyttäjän alkuperä (klassisella `$0801 → $C000` varamenetelmällä), merkintä = latausosoite.
- **UltimateBasic-tila:** sekä lataus että syöttö tulevat UB-kääntäjän kartasta (`build.map.loadAddress`). UB:n automaattisen käynnistyksen tynkä hyötykuorman sisällä suoritetaan sitten täsmälleen samalla tavalla kuin se suoritettaisiin levyltä komennon `LOAD "...",8,1 : RUN` jälkeen.

ASM-tulosteessa näkyvä lähtöosoite säilyy; lataaja yksinkertaisesti kopioi tasaisen muistikuvan PRG:stä RAM-muistiin ja hyppää aloituspisteeseen, kun korin ROM-muistin kartoitus on poistettu.

### Kokorajoitus

Koska hyötykuorma tallennetaan lineaarisesti ja `assembleProgramToPrg()` palauttaa tasaisen `minAddr..maxAddr` puskurin, jossa on nollatäytteisiä aukkoja, ohjelma, jossa on laajasti toisistaan etäisyydellä olevia ORG-segmenttejä (esim. `$0801` + `$C000` + `$E000`), laskee jokaisen tavun kohti 65 408 tavun budjettia. Jos raja ylitetään, koonti keskeytyy virheellä `saveCrtTooLarge` – joko pakkaa muistin asettelu tai jaa tiedot.

> **⚠️ Huomattava varoitus – lue tämä ennen kuvaputkinäytön lähettämistä.**
> 
> Lataaja kutsuu KERNAL **`RESTOR` ($FD15)** -komentoa osana vakionollaussekvenssiä. Tämä kirjoittaa tarkoituksella uudelleen vakio-I/O-vektorit kohdissa `$0314/$0315`, `$0316/$0317`, `$0318/$0319`, `$0328/$0329` ja sen osioissa takaisin ROM-oletusasetuksiin. Seuraukset:
> 
> - **Kaikki IRQ / NMI / BRK -koukut, jotka on asetettu ennen CRT-käynnistysten pyyhkimistä, on asennettu.** Ohjelmasi on asennettava ne itse sisäänkirjautumisen jälkeen — aivan kuten uusi `LOAD "",8,1 : RUN` nauhalta/levyltä.
> - **UltimateBasic-ohjelmat**, jotka ovat riippuvaisia siitä, että KERNAL-vektorit ovat aktiivisia käynnistyshetkellä, saattavat tarvita eksplisiittisen `SYS`- tai init-kutsun automaattisen käynnistyksen tyngässä. UB:n vakioautomaattinen käynnistys toimii suoraan pakkauksesta; laajennuskirjastot, jotka kytkevät vektorit *ennen* `RUN`:ää, eivät tarvitse.
> - **CIA1 / CIA2** alustetaan uudelleen komennolla `IOINIT`. Mukautetut ajastinasetukset (rasteri-IRQ:t, musiikkisoitin CIA-A) on ohjelmoitava uudelleen syötön jälkeen.
> - Kärry on poistettu käytöstä 8-tavuisen tynkän avulla **RAM-muistissa kohdassa `$0100`**, jotta `STA $DE00` -muistin toimintaa ei voida keskeyttää virheellisen ROM-muistin noudon vuoksi. Älä luota siihen, että `$0100–$0107` sisältää pinon päällimmäisen kuvan heti syötön yhteydessä – ensimmäinen RAM-muistin nouto ylikirjoittaa tynkän.
> 
> Jos CRT toimii VICE-ympäristössä, mutta epäonnistuu oikealla laitteistolla, on ensin tarkistettava, olettaako ohjelma tietyn KERNAL-vektorin vai CIA-ajastimen tilan käynnistyksen yhteydessä. Asenna tila eksplisiittisesti init-rutiiniisi, niin se toimii samalla tavalla molemmilla.

### Yhteensopivuus

| Alusta                          | Status                                                 |
| ------------------------------- | ------------------------------------------------------ |
| VARAPELI (`x64sc`, `x64`)       | Toimii valitsemalla **Tiedosto → Liitä kasetin kuva**. |
| TheC64 / TheC64 Mini            | Toimii sisäänrakennetun kasettilataajan kautta.        |
| Kung Fu Flash                   | Toimii — natiivi Magic Desk -tila.                     |
| EasyFlash-kasetti               | Toimii, kun se on ohjelmoitu Magic Desk -työpöydäksi.  |
| 1541 Ultimate II+ / Ultimate 64 | Toimii **Kasetti → Lataa kasettikuva ** kautta.        |
| Kameleontti / Turbo-kameleontti | Toimii.                                                |

---

## 13. Laitteistoasetukset

Avaa työkalupalkin valikosta **Asetukset → Laitteistoasetukset…**. Kaikki ulkoiset laitteistopolut ja verkkoasetukset sijaitsevat täällä.

### VICE-emulaattori

| Asetus               | Kuvaus                                                                |
| -------------------- | --------------------------------------------------------------------- |
| **Valitse VARAPELI** | Selaa `x64sc` (tai `x64`) VICE-suoritettavaan tiedostoon              |
| **Tila**             | Näyttää, onko suoritettava tiedostopolku kelvollinen ja käytettävissä |

VICE vaaditaan seuraaville: **Suorita PRG:nä**, **Suorita D64:n kautta** ja **Vie D64:ään**.

### Exomizer

| Asetus                              | Kuvaus                                                                                                                                                                        |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Valitse Exomizer**                | Selaa `exomizer` -suoritettavaan tiedostoon                                                                                                                                   |
| **Reunuksen välähdys purun aikana** | Kun käytössä, SFX-pakatut PRG:t käyttävät exomizerin sisäänrakennettua `-x1` nopeaa reunan välähdysefektiä; kun se on pois käytöstä, `-n` välitetään hiljaista purkua varten. |
| **Tila**                            | Näyttää, onko suoritettava tiedostopolku kelvollinen ja käytettävissä                                                                                                         |

**Työnkulku:**
1. Asenna Exomizer-binääritiedosto:
   - **Windows:** lataa valmiiksi koottu `win32/exomizer.exe` osoitteesta https://bitbucket.org/magli143/exomizer/wiki/Home tai https://csdb.dk/release/?id=244342.
   - **macOS:** `brew install exomizer` (asentaa Magnus Lindin virallisen 3.1.2-koontiversion).
2. Määritä polku kohdassa **Laitteistoasetukset → Exomizer-osio**.
3. Ota käyttöön **Suorita Exomizerilla** -valintaruutu **-asetuksissa**.
4. Kaikki **Run** -toiminnot (PRG, D64, hardware) ja **Build** -toiminnot (Build PRG, Build D64) käsittelevät nyt kootun ohjelman `exomizer sfx sys` -komennon avulla ennen käynnistämistä tai tallentamista.

Exomizer toimii samalla tavalla Windowsissa ja macOS:ssä — komentorivi (CLI) kutsutaan Tauri-taustajärjestelmästä; mikään integraatiossa ei ole alustakohtaista.

** Sisäisesti käytetään kahta pakkaustilaa:**

| Tila               | Käyttämä                                                       | Soittokäytäntö                                                                                                                                                                                                     |
| ------------------ | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `sfx-järjestelmä`  | Rakenna/Suorita Exomizerilla -vaihtokytkin (PRG:n pääpolku)    | Itsepurkautuva PRG sisäänrakennetulla purkajalla; Border-flash-asetus ohjaa `-x1` vs. `-n`                                                                                                                         |
| `mem` (taaksepäin) | Suorita D64:n kautta → tiedostokohtainen **EXO** -valintaruutu | Pakkaa jokaisen ylimääräisen tiedoston `mem`-muotoiseen virraan; ohjelma purkaa sen suorituksen aikana **EXODECRUNCH**-makron ja valmiiksi rakennetun pakkauksenpurkuohjelman (`samples/exo-decrunch.bin`) avulla. |

> **Vinkki:** Jos Exomizer-polkua ei ole määritetty, mutta valintaruutu on käytössä, käynnistyksen sijaan näytetään selkeä virheilmoitus. Poista valintaruutu käytöstä, jos haluat suorittaa ohjelman ilman pakkausta.

> **Integraatiotesti:** `cargo test --test exomizer_integration` (tiedostossa `src-tauri/`) tarkistaa täyden muistitilan pakkauksen ja purun edestakaisen matkan 6502-emulaattorilla.

### Retro-virheenkorjaaja

| Asetus                    | Kuvaus                                  |
| ------------------------- | --------------------------------------- |
| **Valitse RetroDebugger** | Selaa `RetroDebugger`-binääritiedostoon |
| **Tila**                  | Näyttää, onko polku kelvollinen         |

Katso täydellinen debuggerin dokumentaatio kohdasta [Osio 9](#9-debugger-integration).

### C64 Lopullinen / 1541 Lopullinen

Suorita koottuja PRG:itä suoraan oikealla laitteistolla paikallisverkon kautta Ultimate REST API:n avulla.

| Asetus                 | Kuvaus                                                                        |
| ---------------------- | ----------------------------------------------------------------------------- |
| **Isäntä (IP-osoite)** | Laitteen IP-osoite (esim. `192.168.1.100`)                                    |
| **Salasana**           | Valinnainen – jos laite vaatii todennuksen                                    |
| **Testiyhteys**        | Lähettää testipyynnön osoitteeseen `/v3/runners/info`; näyttää OK tai virheen |

**Työnkulku:**
1. Yhdistä 1541 Ultimate / Ultimate 64 lähiverkkoosi.
2. Syötä sen IP-osoite (ja salasana, jos se on asetettu) Laitteistoasetuksiin.
3. Valitse jaetun suorituksen valikosta **Suorita laitteistolla**.
4. Napsauta **▶ Suorita** — PRG käännetään ja lähetetään laitteelle HTTP POST -protokollan kautta osoitteeseen `/v3/runners/prg`. Laite latautuu ja suorittaa sen C64:llä välittömästi.

> **Vinkki:** USB-kaapelia tai ajuria ei tarvita – REST API on sisäänrakennettu Ultimate-laiteohjelmistoon. Tietokoneesi ja laitteen on oltava samassa lähiverkossa.

---

## 14. Visuaaliset editorit (työkalupakki)

Työkalurivin **Toolkit** -valikko ryhmittelee visuaalisten tietojen editorit, joilla kaikilla on yhteinen Tiedostot-valikko (`Tiedostot ▾`) Lataa BIN / Tallenna BIN / Vie lohkoihin / Tallenna D64:ään. Jokainen editori tuottaa raakadataa `.bin`, joka voidaan sijoittaa ohjelmaan `INCBIN`-komennolla tai lisätä suoraan D64-levylle **Tallenna D64:ään** -merkinnän kautta.

Visuaalisen editorin valintaikkunoita voidaan vetää otsikoistaan koko Visual Assembler -työtilan poikki. Valintaikkuna, jolle ei ole tallennettua sijaintia, avautuu keskitetysti; siirtämisen jälkeen sen viimeisin sijainti tallennetaan käyttöliittymän asetuksiin ja palautetaan seuraavan avauskerran yhteydessä.

### Korkean resoluution / monivärinen editori

Pikselitason bittikarttaeditori, jossa on sekä 320×200 korkearesoluutio- että 160×200 moniväritilat. Avaa Toolkit → Korkearesoluutioeditori -kohdassa.

| Ominaisuus             | Kuvaus                                                                                                                                      |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Tilan vaihto           | **Monivärinen** -valintaruutu vaihtaa korkearesoluutioisen (yksivärinen solua kohden) ja monivärisen (4 väriä solua kohden) välillä.        |
| Työkalut               | Lyijykynä, pyyhekumi, viiva, suorakulmio, täytetty suorakulmio, soikio, täytetty soikio, täyttöviiva.                                       |
| Ruiskutustyökalu       | Airbrush-tyylinen piirtäjä, joka sirottelee pikseleitä kohdistimen ympärille piirtäessään.                                                  |
| Suihkutusintensiteetti | Ruiskutustyökalun vieressä olevasta alasvetovalikosta säädetään kunkin ruiskutusjäljen tiheyttä.                                            |
| Väripaletti            | Etualan (muste) ja paperin (tausta) poimijat. Moniväritila seuraa automaattisesti kolmea solukohtaista lisäväriä.                           |
| Kumoa / Tee uudelleen  | Iskukohtainen historia, ctrl-Z / ctrl-Y.                                                                                                    |
| Ruudukko + Rasteri     | Valinnainen 8×8-ruudukko ja rasteririvien päällekkäisyys solujen tasaamista varten.                                                         |
| Tuo kuva               | Kankaalle pudotetut PNG/JPEG/GIF-kuvat kvantisoituvat automaattisesti 16-väriseen C64-palettiin.                                            |
| Vie lohkot             | Lisää ohjelmaan BYTE/RAWBYTES-lohkoja, jotka sisältävät koodatun bittikartta-, näyttö- ja väridatan.                                        |
| Vie `.bin`             | Tallentaa natiivin moniväritiedostomuodon (10000 tavua: 8000 bittikarttaa + 1000 näyttöä + 1000 väriä) valmiiksi LOADFILE-tiedostoon $2000. |

### Sprite-editori

24×21 pikselin sprite-editori moniruutuanimaatiolla. Avaa Toolkit → Sprite-editori -kohdassa.

| Ominaisuus            | Kuvaus                                                                                                                                                                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kehykset              | Lisää/poista/järjestä uudelleen kehyksiä; kehysnauha näkyy alhaalla.                                                                                                                                                                              |
| Tila                  | Yksivärinen/monivärinen vaihto.                                                                                                                                                                                                                   |
| Työkalut              | Kynä, täyttö, viiva, suorakulmio, ympyrä – sekä vaakasuora ja pystysuora kääntö, siirto vasemmalle/oikealle/ylös/alas (valinnainen rivitys). Muototyökalut näyttävät reaaliaikaisen esikatselun vetämisen aikana; vapauta painike vahvistaaksesi. |
| Kumoa / tee uudelleen | Täysi kumoa/tee uudelleen -pino kehystä kohden. Ctrl/Cmd+Z / Ctrl/Cmd+Y tai työkalupalkin painikkeet.                                                                                                                                             |
| Kuvan tuonti          | Tuo PNG- tai JPEG-kuva valitsemalla Tiedostot → Tuo kuva. Tuoja yhdistää jokaisen pikselin lähimpään C64-palettiväriin ja kirjoittaa sen nykyiseen kehykseen.                                                                                     |
| Animaation esikatselu | Toista / pysäytä konfiguroitavalla nopeudella.                                                                                                                                                                                                    |
| Vie lohkot            | Lisää RAWBYTES-lohkon 64-tavuiseen tasattuun osoitteeseen jokaista kehystä kohden sekä sprite-osoittimen asetuksen.                                                                                                                               |
| Tallenna `.bin`       | Kirjoittaa 64 tavua kehystä kohden (raakaa spritedataa ilman täytettä).                                                                                                                                                                           |

### C64-merkki-ROM-selain ("merkkikartta")

C64-merkki-ROMin (sisäänrakennetun PETSCII-fontin) vain luku -tilassa oleva katseluohjelma. Avautuu Toolkit-valikon **C64 chargen** -merkinnän kautta. Hyödyllinen symbolin näyttökoodin löytämiseen ennen sen kirjoittamista komennoilla `RAWBYTES` tai `TEXT`.

| Ominaisuus                | Kuvaus                                                                                                                                                                                                                                                               |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kaksi merkistöä           | Välilehti 1: **Sarja 1 — Ylä/Grafiikka** (oletustila käynnistyksen jälkeen). Välilehti 2: **Sarja 2 — Ala/Ylä** (`$0E`-kytkimen jälkeen).                                                                                                                            |
| Glyfiruudukko             | 16×16-ruudukko, jossa on kaikki 256 merkkiä. Napsauta symbolia nähdäksesi sen yksityiskohtapaneelin: suurennettu 8×8 pikselin näkymä, näyttökoodi (desimaali + heksadesimaali), PETSCII-koodit (sekä oletusarvoiset että siirretyt) ja raaka 8-tavuinen bittikartta. |
| Yksityiskohtainen paneeli | Näyttää valitun glyfin näyttökoodin, PETSCII-koodit ja kahdeksan raakatavua – valmiina liitettäväksi `RAWBYTES`- tai BYTE-lohkoon.                                                                                                                                   |
| Vain lukuoikeus           | Ei muokkausta tässä — käytä Merkkieditoria (alla) muokataksesi symboleja.                                                                                                                                                                                            |

### Merkkieditori (merkistö)

256-merkkinen 8×8 merkistöeditori. Avaa Toolkit → Merkkieditori -kohdassa.

| Ominaisuus                   | Kuvaus                                                                                                                                                                                                    |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lataa ROM                    | Tuo C64 ROM -merkistöä suoraan VICE:n `chargen` -tiedostosta (ei tiedostovalitsinta).                                                                                                                     |
| Lataa `.bin`                 | Tuo ulkoisen 2048-tavuisen merkistöbinääritiedoston.                                                                                                                                                      |
| Merkkikohtainen esikatselu   | 16-levyinen ruudukko, jossa on kaikki 256 symbolia ja nykyinen solu korostettuna.                                                                                                                         |
| Pikselieditori               | 8×8 yhden merkin editori, jossa on vaihto-/käänteis-/tyhjennystyökalut.                                                                                                                                   |
| Merkkikohtainen väri         | Tallentaa kullekin glyyfille oletusarvoisen Color RAM -arvon. Monivärisessä merkkitilassa tämä säilyttää myös solukohtaisen monivärisävytyksen käyttöönottobitin ja merkin oman alemman 3-bittisen värin. |
| Metadatan edestakainen kulku | Kun lataat yhteensopivia tietoja Charset Canvas-/Kartta-työnkuluista, merkkikohtaiset värimetatiedot säilyvät, joten muokkauksia voidaan jatkaa menettämättä väritarkoitusta.                             |
| Vie lohkot                   | Liittää RAWBYTES-arvon kohtaan $0800 (lohko 2) tai $3800 (lohko 7) koodatulla merkistöllä.                                                                                                                |

### Merkistöpohjan editori

Koko kankaan kattava merkistöpiirtäjä näyttöjen rakentamiseen täydellisestä 256 merkin merkistöstä. Avaa Toolkit → Charset Canvas -kohdasta.

Kangas on 16 × 16 merkkiä. Yksivärisessä tilassa se tarjoaa 128 × 128 pikselin työalueen; monivärisessä merkkitilassa se tarjoaa 64 × 128 pikselin laajan työalueen C64:n oikeiden merkkien monivärisääntöjen mukaisesti.

| Ominaisuus                              | Kuvaus                                                                                                                                                                                               |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Yksivärinen / monivärinen               | Mono-tilassa tallennetaan 1-bittiset 8×8-symbolit. Moniväritilassa tallennetaan kaksibittiset vaakasuuntaiset pikseliparit ja käytetään solujen merkintöjä Color RAM -bitillä 3.                     |
| C64-värimalli                           | Tausta käyttää `$D021`; jaettu monivärinen 1 käyttää `$D022`; jaettu monivärinen 2 käyttää `$D023`; jokaisen hahmon oma väri tulee Color RAM -biteistä 0–2.                                          |
| Piirustustyökalut                       | Lyijykynä, pyyhekumi, viiva, suorakulmio, soikio ja täyttö toimivat merkkien rajojen yli.                                                                                                            |
| Ruiskutustyökalu                        | Airbrush-tyylinen piirustus, joka sirottelee pikseleitä viereisten solujen/merkkien päälle.                                                                                                          |
| Suihkutusintensiteetti                  | Ruiskutustyökalun vieressä oleva alasvetovalikko asettaa viivan tiheyden.                                                                                                                            |
| Ruudukon vaihto/vaihto                  | Ruudukko-valintaruutu näyttää tai piilottaa 16×16 merkkiruudukon.                                                                                                                                    |
| Tallenna merkistö `.bin`                | Tallentaa 2048-tavuisen merkkibittikarttadatan.                                                                                                                                                      |
| Tallenna 16×16 kartta + väri-RAM `.bin` | Tallentaa 256 näyttökoodia ja sen jälkeen 256 väri-RAM-arvoa. Käytä tätä yhdessä `MAP_COPY16X16`:n kanssa.                                                                                           |
| Ladataan                                | Voi ladata charset-canvas-tallennuksia, tavallisia charset-tietoja ja yhteensopivia Character Editor -character-tietoja, mukaan lukien tallennetut merkkikohtaisesti määritetyt värit, jos niitä on. |

**Tärkeä C64-rajoitus:** monivärisessä merkkitilassa kaksi jaettua väriä ovat globaaleja koko näytölle (`$D022` / `$D023`). Vain merkin oma väri on solukohtainen, ja se on rajoitettu väreihin 0–7, koska Color RAM -bitti 3 valitsee monivärisen tilan.

### Karttaeditori (monikerroksiset laattakartat)

Kerrostettu karttaeditori staattisille maisemille, sprite-spawn-kartoille, törmäysdatalle ja vastaaville. Avaa Toolkit → Karttaeditori -kohdassa.

| Ominaisuus                                                 | Kuvaus                                                                                                                                                                                                                                                                             |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kerrokset                                                  | Useita nimettyjä kerroksia, joilla jokaisella on oma laattasarjansa ja läpinäkyvyytensä.                                                                                                                                                                                           |
| Siveltimet                                                 | Yksittäislaatta-, täyttö-, viiva-, suorakulmio- ja ympyrätilat. Muototyökalut näyttävät reaaliaikaisen esikatselun vetämisen aikana; vapauta painike vahvistaaksesi.                                                                                                               |
| Kumoa / tee uudelleen                                      | Täysi kumoa/tee uudelleen -pino tasoa kohden. Ctrl/Cmd+Z / Ctrl/Cmd+Y tai työkalupalkin painikkeet.                                                                                                                                                                                |
| Tyhjennä valikko                                           | Tasokohtainen tai koko kartan selkeä vahvistuksella.                                                                                                                                                                                                                               |
| Kuvan tuonti                                               | Pudota laattakartan PNG-kuva; editori leikkaa sen automaattisesti laatoiksi.                                                                                                                                                                                                       |
| Kopioi / liitä                                             | Kopioi valittu laatta-alue ja liitä se sitten normaalisti tai käytä läpinäkyvää liitintä pitääksesi tyhjät laatat läpinäkyvinä.                                                                                                                                                    |
| Monivärinen laattojen väritys                              | Yhteensopivien merkistömetatietojen avulla maalaus käyttää laatan tallennettuja Color RAM -oletusarvoja (mukaan lukien moniväriin liittyvä koodaus) yleisen tasaisen värin sijaan.                                                                                                 |
| Mukautetut merkistövärit                                   | Kun merkistö sisältää `charColors` metadatan, karttaeditori käyttää valitun laatan oletusarvoista Color RAM -muistin arvoa piirtäessään.                                                                                                                                           |
| Vie lohkot                                                 | Lähettää RAWBYTES-lohkoja laattasarjan grafiikoille ja karttatiedoille.                                                                                                                                                                                                            |
| Tallenna näytön RAM-muistia (.bin)…                        | Tallentaa vain nykyisen karttatason näyttökoodit (40 × 25 = 1000 tavua).                                                                                                                                                                                                           |
| Tallenna näytön RAM-muisti + värillinen RAM-muisti (.bin)… | Tallentaa näyttökoodit yhdistettynä väri-RAM-arvoihin yhdeksi 2000 tavun tiedostoksi (`screen[0..999]` ja sen jälkeen `color[0..999]`). Käytä tätä **MAP_COPY**-makron kanssa (yhdistetty .bin-tila) palauttaaksesi sekä näytön että värit yhdellä toiminnolla suorituksen aikana. |

### SID-editori (3-ääninen seuranta)

Moniinstrumenttinen kolmiääninen seurantaohjelma Web Audion esikatselumoottorilla. Avaa Toolkit → SID Editor -komennolla.

**Laitekohtaiset säätimet:**
- Aaltomuotojen valintaruudut (TRI / SAW / PUL / NOI) — useita aaltomuotoja voidaan TAI-operaatiolla yhdistää.
- ADSR (hyökkäys / rappeutuminen / ylläpito / vapautus) näkyy vetämällä kuvaajana neljän liukusäätimen yläpuolella.
- Pulssinleveyden liukusäädin (0–4095) ja valinnaiset soitto-/synkronointiliput.
- Äänikohtainen suodinreitityksen valintaruutu; globaali suodinkatkaisu / resonanssi / äänenvoimakkuus / tila (LP/BP/HP).

**Seurantaruudukko:**
- 3 ääntä × jopa 7 kuviota × 32 riviä = 7 × 32 = enintään 224 riviä (8-bittinen rivilaskuri rajoittaa sitä).
- Rivikohtainen: nuotti + instrumenttiindeksi. Tyhjät rivit sisältävät edellisen nuotin.
- Valitse yksi solu normaalisti tai pidä **Shift**-näppäintä pohjassa samalla, kun napsautat tai käytät nuolinäppäimiä suorakulmaisen valinnan laajentamiseksi rivien ja minkä tahansa kolmen äänen yli. Hiiren kakkospainikkeella napsauttaminen valitun alueen sisällä pitää alueen ennallaan.
- Kopioi, Leikkaa, Liitä ja Tyhjennä ovat käytettävissä kuvaketyökalurivillä ja kuvakepohjaisessa kontekstivalikosta. `Ctrl/Cmd+C` ja `Ctrl/Cmd+V` käyttävät samaa suorakaiteen muotoista valintaa.
- Harmonia-apu: valitse perussävel, sointutyyppi ja oktaavi, esikuuntele sointu nykyisellä instrumentilla ja lisää sitten sointu suoraan seurantaan. Saatavilla olevia tyyppejä ovat duuri, molli, dimensoitu, augmentoitu, Sus2, Sus4, dominantti 7, duuri 7, molli 7, 6, molli 6, 9, b9, #9, dim7 ja 7sus4.
- Arpeggio-apuohjelma: esikatsele tai lisää 4-, 8- tai 16-askelisia nuotteja valitusta soinnusta alkaen ylös, alas tai ylös/alas.
- **Esikatselurivi** kuuntelee valitun rivin kaikissa kolmessa äänessä aloittamatta kuvioiden toistoa.
- Solualueen liittäminen alkaa nyt valitusta alueen aloitussolusta ja pysähtyy siististi ääni- ja rivirajoihin sen sijaan, että rivitys jatkuisi seuraavaan sarakkeeseen tai riviin.
- Nopeus-liukusäädin asettaa IRQ-jakajan (rivien väliset kehykset).

**Toisto ja virtuaalinäppäimistö:**
- Toista-työkalurivin painike muuttuu Tauko-painikkeeksi toiston aikana ja Jatka-painikkeeksi tauon aikana; Pysäytä-painike lopettaa toiston ja palauttaa tilan.
- Näppäimistön työkalupalkin painike avaa ei-modaalisen pianon, jota voi käyttää SID-editorin ollessa aktiivinen. Vedä sen otsikkoa sijoittaaksesi sen mihin tahansa pääsovelluksen päälle.
- Ota käyttöön **Lisää seurantaan** kirjoittaaksesi jokaisen soitetun nuotin nykyiseen seurantakursoriin ja siirtyäksesi seuraavalle riville. Poista se käytöstä kuunnellaksesi nuotteja ilman muokkausta.
- Sointujen ja arpeggioiden esikatselut valaisevat vastaavat pianonäppäimet, kun koskettimet ovat auki.

**Tiedostovalikon viennit:**
| Viedä                      | Mitä se tekee                                                                                                                                                                                |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Tallenna .bin…`           | Kirjoittaa editorin natiivin sarjoitetun muodon (instrumentit + patternit + sekvenssi).                                                                                                      |
| `Vie lohkot (vain tiedot)` | Liittää instrumenttitaulukon + kuviolohkot ohjelmaan kohtaan `* = $C000`.                                                                                                                    |
| `Vie lohkot + minipelaaja` | Lisää koko soittimen (sid_init / sid_irq / sid_play_row / sid_set_voice) sekä PAL-taajuustaulukot. Viennin jälkeen sijoita `JSR sid_init` pääkoodiisi kohtaan, josta musiikin pitäisi alkaa. |
| `Vie asm (leikepöytä)`     | Kopioi koko kokoonpanon lähdekoodin leikepöydälle.                                                                                                                                           |

**Player ZP:n käyttö:** `$FB` (tikkilaskuri), `$FC` (rivi-indeksi), `$FD` (äänen lämpötilan asettaminen). Nämä ovat ristiriidassa, jos pääkoodisi käyttää niitä – siirrä tarvittaessa Expert-tilassa.

**Tunnetut rajat:**
- Yksittäinen lineaarinen kuvioluettelo (ei vielä äänikohtaista sekvenssitaulukkoa).
- 8-bittinen rivilaskuri rajoittaa 7 kuvioon × 32 riviin.
- C64 `$D418` globaali äänenvoimakkuus jaetaan eri äänien kesken — instrumenttikohtainen äänenvoimakkuuden liukusäädin on informatiivinen; sustain-taso (ADSR:n `S`) on efektiivinen äänenvoimakkuus äänittäin.
- Web Audion esikatselu on likimääräinen: PWM-modulaatio, soittoääni/synkronointi ja SID-suodattimen luonne eroavat todellisesta sirusta.

---

### Käyräeditori

Luo käyttövalmiita `.byte`-hakutaulukoita matemaattisista käyristä — sini, easings, kolmio/saha/neliö ja pomppu. Ihanteellinen sprite-liikkeelle, rasteritehosteille, värikierroksille tai mihin tahansa animaatioon, jota ohjaa ennalta laskettu taulukko. Avaa **Curve Editor** -kuvakkeella yläpalkissa (SID Editor -painikkeen vieressä).

**Käyrät:** Sini, kosini, lineaarinen, helpotus sisään/ulos/sisään/ulos (neliö- ja kuutiokäyrä), helpotus sisään/ulos (ympyräkäyrä), kolmio, sahakäyrä, neliö ja helpotus sisään/ulos/sisään/ulos pomppiva.

**Ohjaimet:**
| Ohjaus                   | Tarkoitus                                                                                                                                                                                            |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Alku-/loppuarvo**      | Lähtöalue. 0..255 8-bittisessä tilassa, 0..320 16-bittisessä tilassa.                                                                                                                                |
| **Arvojen lukumäärä**    | Taulukon pituus, 4–512 merkintää.                                                                                                                                                                    |
| **Syklit**               | Pöydän värähtelyjen määrä (vain sini/kosini/kolmio/saha/neliö). Hyväksyy murtoluvut (esim. `3,625`).                                                                                                 |
| **Vaihe**                | Vaihe-ero asteina (vain sini/kosini).                                                                                                                                                                |
| **Yhdistä toinen käyrä** | Sekoita toinen käyrä käyttämällä **Mix / Add / Multiply / Min / Max / Subtract ** -toimintoa, sen omia syklejä/vaihetta ja sekoitusmäärää. Molemmat lähdekäyrät on piirretty katkoviivalla kaavioon. |
| **Tarra**                | Taulukon otsikko (ehdotetaan automaattisesti käyrän nimen perusteella).                                                                                                                              |
| **Numeron muoto**        | `$XX` heksa- tai desimaaliluku.                                                                                                                                                                      |
| **Arvot riviä kohden**   | 8 / 16 / 32 tavua per `.byte` rivi.                                                                                                                                                                  |

**Lähtötilat:**
| Tila            | Emits                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **8-bittinen**  | Yksi `.byte`-taulukko (arvot 0..255). Luetaan `LDX #index / LDA table,X`. Valinnaisesti lähettää **sprite-Y-lukijarutiinin** (`<tunniste>_set_y`) — `LDA <tunniste>,X` / `STA $D001+2N` — valittavalle спрайtin numerolle 0-7.                                                                                                                                                                                                                                   |
| **16-bittinen** | Kaksi rinnakkaista tavutaulukkoa — `<merkintä>_lo` (8 alinta bittiä) ja `<merkintä>_hi` (9. bitti, 0/1) — indeksoitu **same** X:llä (2 tavua merkintää kohden). Tarvitaan sprite X:lle koko näytön laajuisesti (0..320 > yksi tavu). Valinnaisesti lähettää **sprite-X-lukijarutiinin** (`<merkintä>_set_x`), joka kirjoittaa alimman tavun `$D000+2N`-merkkiin ja asettaa/tyhjentää spriten suurimman tavun `$D010`-merkkiin valittavalla sprite-numerolla 0-7. |

Jokainen kopiointi-/lisäystuloste alkaa otsikkokommentilla, joka dokumentoi käyrän, todellisen min/max-alueen, merkintöjen määrän ja tarkan käytön (jotka rekisteröivät kunkin taulukon syötteet).

**Esikatselu:**
- **Graafinen** — käyrä, jonka arvo on 0 **ylhäällä** ja maksimiarvo **alhaalla**, C64 sprite-Y / rasteri -konventiota noudattaen (eli näet sen, mitä taulukko käyttää laitteistolla). Graafisen alla oleva metaviiva näyttää tavumäärän, luotujen arvojen todellisen minimi- ja maksimiarvon sekä käyrän/käyrien nimen/nimien.
- **Pomppuva pallo** — animoi merkin taulukon läpi **Tempo** -tilassa (5–240 arvoa/sek). Tempolla 50 tämä vastaa yhtä arvoa kehystä kohden PAL-tilassa (50 Hz), eli yhtä `.wait_raster` askelta indeksiä kohden. Toista/tauko- ja uudelleenkäynnistyspainikkeet, viimeisten ~24 sijainnin häivytysjälki ja reaaliaikainen `Indeksi · Value` -lukema.

**Kopioi / Lisää:** työkalupalkin kaksi kuvaketta — **Kopioi** lisää taulukon leikepöydälle; **Lisää editoriin** liittää taulukon (ja lukijan, jos käytössä) lohkoina nykyiseen ohjelmaan. Uudelleen lisääminen ** korvaa** edellisen käyräeditorin lisäyksen kaksoiskappaleiden pinoamisen sijaan (toimii lohko- ja asiantuntijatilassa).

**Tiedostot-valikko:**
| Toiminta                   | Mitä se tekee                                                                                                                                                                                                                                                                                                                    |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Tallenna käyrä (.bin)…** | Tallentaa raakataulukon tavut täsmälleen samalla tavalla kuin C64 lukisi ne `INCBIN`-komennon kautta. 16-bittinen: N lo-tavua ja sitten N hi-tavua.                                                                                                                                                                              |
| **Kuormituskäyrä (.bin)…** | Lataa raakataulukon tavut takaisin editoriin, tulkittuna nykyisen bittisyvyyden mukaan (16-bittinen: ensimmäinen puolisko lo, toinen puolisko hi). Ladattu taulukko näytetään sellaisenaan, kunnes jokin käyrän säätö luo uuden käyrän.                                                                                          |
| **Vie demo lohkoiksi**     | Liittää täydellisen, ajettavan sprite-demon: sprite-alustus, rasterisynkronoitu pääsilmukka, upotettu taulukko ja pallosprite-data. X pyyhkäisee 0..320 8.8-kiintopisteessä `$D010` MSB:llä, kun taulukko ajaa sprite-Y:tä – täsmälleen editorin esikatselun mukaisesti. Uudelleenvienti korvaa aiemman käyräeditorin lisäyksen. |

** Vastaa C64:n esikatselua:** esikatselu lukee taulukon **lineaarisesti, toistaen 0 → N-1 → 0, yksi arvo kehystä kohden**. Tarkan toiston aikaansaamiseksi taulukkoa on ajettava samalla tavalla (indeksiä lisätään kerran kehystä kohden, ja jaetaan taulukon pituus). Ping-pong- tai osittaisen alueen toisto liikkuu eri tavalla, vaikka tavuarvot ovat identtiset. Katso toimivan 16-bittisen sprite-X-esimerkin tiedostosta `samples/curve-new-demo.asm`.

---


*© 2026 Zsolt Tarczali – C64 Visual Assembler*
