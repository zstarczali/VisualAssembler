# C64 Visual Assembler — Käyttöopas

**Versio 2.7.4**

Visuaalinen, lohkopohjainen 6502-assembler Commodore 64:lle. Voit luoda ohjelmia
vetämällä ja pudottamalla käskylohkoja ja nähdä luodun assemblerin ja konekoodin
reaaliajassa.

---

## Sisällysluettelo

- [Version 2.7.4 kohokohdat](#version-274-highlights)
- [Version 2.7.3 kohokohdat](#version-273-highlights)
- [Version 2.7.2 kohokohdat](#version-272-highlights)
- [Version 2.7.1 kohokohdat](#version-271-highlights)
- [Version 2.7.0 kohokohdat](#version-270-highlights)
- [Version 2.6.9 kohokohdat](#version-269-highlights)
- [Version 2.6.8 kohokohdat](#version-268-highlights)
- [Version 2.6.7 kohokohdat](#version-267-highlights)
- [Version 2.6.6 kohokohdat](#version-266-highlights)
- [Version 2.6.5 kohokohdat](#version-265-highlights)
- [Version 2.6.4 kohokohdat](#version-264-highlights)
- [Version 2.6.3 kohokohdat](#version-263-highlights)
- [Version 2.6.2 kohokohdat](#version-262-highlights)
- [Version 2.6.1 kohokohdat](#version-261-highlights)
- [Version 2.6.0 kohokohdat](#version-260-highlights)
- [Version 2.5.9 kohokohdat](#version-259-highlights)
- [Version 2.5.8 kohokohdat](#version-258-highlights)
- [Version 2.5.7 kohokohdat](#version-257-highlights)
- [Version 2.5.6 kohokohdat](#version-256-highlights)
- [Version 2.5.5 kohokohdat](#version-255-highlights)
- [Version 2.5.4 kohokohdat](#version-254-highlights)
- [Version 2.5.3 kohokohdat](#version-253-highlights)
- [Version 2.5.2 kohokohdat](#version-252-highlights)
- [Version 2.5.1 kohokohdat](#version-251-highlights)
- [Version 2.5.0 kohokohdat](#version-250-highlights)
- [Version 2.4.9 kohokohdat](#version-249-highlights)
- [Version 2.4.8 kohokohdat](#version-248-highlights)
- [Version 2.4.7 kohokohdat](#version-247-highlights)
- [Version 2.4.6 kohokohdat](#version-246-highlights)
- [Version 2.4.5 kohokohdat](#version-245-highlights)
- [Version 2.4.3 kohokohdat](#version-243-highlights)
- [Version 2.4.2 kohokohdat](#version-242-highlights)
- [Version 2.4.1 kohokohdat](#version-241-highlights)
- [Version 2.4.0 kohokohdat](#version-240-highlights)
- [Version 2.3.9 kohokohdat](#version-239-highlights)
- [1. Käyttöliittymän yleiskatsaus](#1-interface-overview)
- [2. Lohkopaletti](#2-block-palette)
  - [Operandikentän parametrit](#parameters-in-the-operand-field)
- [3. Ohjelma-alue](#3-program-area)
  - [Estä paneelin minikartta](#block-panel-minimap)
  - [Operandin syöttö](#operand-input)
- [4. ASM-näkymä](#4-asm-view)
  - [Lähtötilat](#output-modes)
  - [Työkalupaketti-välilehti](#toolkit-tab)
  - [Käännä tiedot ja tulostusasetukset](#compile-info-and-output-settings)
  - [ASM-rivin napsauttaminen](#clicking-an-asm-line)
  - [ASM-rivinumerot](#asm-line-numbers)
  - [Käännöksen edistymismodaali](#compile-progress-modal)
- [5. Asetukset ja työkalupalkki](#5-settings--toolbar)
  - [Versiohallinta](#version-control)
    - [Projektitila](#project-mode)
    - [Git](#git)
  - [Sovelluksen sisäiset päivitykset](#in-app-updates)
  - [Ilmainen ja avoimen lähdekoodin](#free-and-open-source)
  - [Virheen ilmoittaminen](#reporting-a-bug)
  - [Tuki](#support)
  - [Työtilat](#workspaces)
  - [Muistiikkuna ja sivun käyttö tyhjänä](#memory-window-and-zero-page-usage)
  - [Projektimallit](#project-templates)
  - [Ohjeet ja oppituntien muokkaustyökalu](#tutorials-and-the-lesson-editor)
    - [Verkko-oppitunnit](#online-lessons)
  - [Rakenna projekti](#build-project)
  - [Esimerkkiohjelmia](#example-programs)
  - [Lataa .asm-tiedosto (pikaopas)](#load-asm-file-quick-reference)
    - [Tuonnin jäsentämisen huomautukset ja parhaat
      käytännöt](#import-parsing-notes-and-best-practices)
  - [Kick-tuonti (Kick Assembler)](#kick-import-kick-assembler)
    - [Kick-projektit (Tuo Kick-projekti…)](#kick-projects-import-kick-project)
- [UltimateBasic-tila](#ultimatebasic-mode)
  - [UB-editorin avaaminen](#opening-the-ub-editor)
  - [Editorityökalut](#editor-tools)
  - [Projektit, välilehdet ja
    käynnistystiedostot](#projects-tabs-and-startup-files)
  - [Rakennus ja diagnostiikka](#building-and-diagnostics)
  - [Koodin koko riviä kohden ja vihjeet](#code-size-per-line-and-hints)
  - [Juoksu, D64 ja Exomizer](#running-d64-and-exomizer)
  - [Virheenkorjaussymbolit ja niiden
    purkaminen](#debugger-symbols-and-disassembly)
  - [Ultimate Basicin käyttöohje ja
    lähdekoodi](#ultimate-basic-manual-and-source)
- [6. Asiantuntijatila](#6-expert-mode)
  - [Tilan vaihtaminen](#switching-modes)
  - [Editorin asettelu](#editor-layout)
  - [Työkalupalkin painikkeet](#toolbar-buttons)
  - [Asiantuntijaeditorin minikartta](#expert-editor-minimap)
  - [Syklien määrä](#cycle-counts)
  - [Optimointivinkkejä](#optimisation-hints)
  - [Virhe korostamisessa](#error-highlighting)
  - [Syntaksin korostus](#syntax-highlight)
  - [Lähdekoodin muotoilija](#source-formatter)
  - [Projektipaneeli ja välilehdet](#project-panel--tabs)
  - [Välilehtipalkki](#tab-bar)
  - [ACME-tila](#acme-mode)
- [7. Osoitetilat](#7-addressing-modes)
  - [Merkitse lausekkeet operandeiksi](#label-expressions-as-operands)
  - [`*`-ohjelmalaskuri lausekkeissa](#the--program-counter-in-expressions)
  - [Paikalliset (pisteviivalla) merkityt otsikot](#local-dotted-labels)
  - [Itseään muokkaavan koodin
    operanditunnisteet](#self-modifying-code-operand-labels)
- [8. Vakio-6502-ohjeet](#8-standard-6502-instructions)
  - [Tietojen siirto](#data-movement)
  - [Aritmeettinen](#arithmetic)
  - [Logiikka](#logic)
  - [Hyppyjä ja haarautumisia](#jumps--branches)
    - [LBNE / LBEQ / … (Pitkät oksat)](#lbne--lbeq---long-branches)
  - [Rekisteritoiminnot](#register-operations)
  - [Siirrä ja kierrä](#shift--rotate)
  - [Pino](#stack)
  - [Järjestelmä / Liput](#system--flags)
  - [Laittomat / dokumentoimattomat ohjeet](#illegal--undocumented-instructions)
- [9. Makrolohkot — Viite](#9-macro-blocks--reference)
  - [MERKKI](#label)
  - [KOMMENTTI](#comment)
  - [BYTE](#byte)
  - [SANA](#word)
  - [TÄYTÄ](#fill)
  - [TASOITA](#align)
  - [TEKSTI](#text)
  - [MERKO](#string)
  - [TIEDOT](#data)
  - [RAWBYTES](#rawbytes)
  - [RAAKATEKSTI](#rawtext)
  - [PETSCII](#petscii)
  - [MERKKIJÄRJESTELMÄ](#charset)
  - [CHARDEF](#chardef)
  - [LAATIKKO_OSUMA](#box_hit)
  - [INCBIN](#incbin)
  - [KOALA](#koala)
  - [TASO / TASO_RIVI](#level--level_row)
    - [TASO](#level)
    - [TASO_RIVI](#level_row)
  - [SID](#sid)
  - [SID_PLAYER](#sid_player)
  - [SISÄLLYTÄ](#include)
  - [TAULUKKO](#table)
  - [ORGAN](#org)
  - [SILMUKKA / SEURAAVA](#loop--next)
    - [SILMUKKA](#loop)
    - [SEURAAVA](#next)
  - [FOR / ENDF](#for--endf)
    - [FOR](#for)
    - [LOPPU](#endf)
  - [TYÖNNÄ / VEDÄ](#push--pull)
    - [TYÖNNÄ](#push)
    - [VEDÄ](#pull)
  - [END / RTS-alias](#end--rts-alias)
  - [MAKRO / LOPETA / KUTSU](#macro--endm--invoke)
    - [MAKRO (määritelmän alku)](#macro-definition-start)
    - [ENDM (määritelmän loppu)](#endm-definition-end)
    - [KÄYTÄ](#invoke)
  - [ALUE / LOPPUALUE](#region--endregion)
  - [MÄÄRITTELE / JOS / MUUTEN / ENDIF](#define--if--else--endif)
    - [MÄÄRITTELE](#define)
    - [JOS](#if)
    - [MUUTEN](#else)
    - [ENDIF](#endif)
  - [.VAHVISTUS](#assert)
  - [VAKIO](#const)
  - [VAR](#var)
  - [Suorituksenaikainen JOS / MUUTEN / ENDIF](#runtime-if--else--endif)
  - [SAIKANA / LOPPU](#while--endw)
  - [TOISTA / KUNNES](#repeat--until)
  - [MEMCPY / MEMSET](#memcpy--memset)
  - [TULOSTA / TULOSTAMALLA_KIRJOITUS / TULOSTAMALLA_HEX / TYHJENNÄ_NÄYTTÖ /
    ODOTUSKÄYNTIMEN / VIIVE / ASETA_REUNUS /
    ASETA_REUNUS](#print--print_char--print_hex--clear_screen--wait_key--delay--set_border--set_bg)
    - [TULOSTA](#print)
    - [TULOSTA_MERKKI](#print_char)
    - [TULOSTA_HEX](#print_hex)
    - [TYHJENNÄ_NÄYTTÖ](#clear_screen)
    - [ODOTUSAVAIN](#wait_key)
    - [VIIVE](#delay)
    - [ASETA_REUNUS / ASETA_TAUSTA](#set_border--set_bg)
  - [IRQ_SETUP](#irq_setup)
  - [SATUNNAINEN](#rand)
  - [SPRITE_INIT](#sprite_init)
  - [SPRITE_POS](#sprite_pos)
  - [ODOTA_RASTERI](#wait_raster)
  - [OHJAUSSAUVA](#joystick)
  - [HIIRI](#mouse)
  - [SPRITE_COL](#sprite_col)
  - [LATAA TIEDOSTO](#loadfile)
  - [EXODECRUNCH](#exodecrunch)
  - [REU_CHECK](#reu_check)
  - [REU_STASH / REU_FETCH / REU_SWAP](#reu_stash--reu_fetch--reu_swap)
  - [TURBO_ASETA](#turbo_set)
  - [SUPERCPU_TUNNISTETTU](#supercpu_detect)
  - [TURBO_KÄYTÖSSÄ](#turbo_enable)
  - [KARTAN_KOPIO](#map_copy)
  - [KARTAN_KOPIO16X16](#map_copy16x16)
  - [SPRITE_ANIM](#sprite_anim)
  - [PISTEET_BCD](#score_bcd)
- [10. Virheenkorjausintegraatio](#10-debugger-integration)
  - [RetroDebugger](#retrodebugger)
  - [Keskeytyskohtalohkot](#breakpoint-blocks)
  - [Virheenkorjausmerkinnät](#debugger-flags)
  - [VICE Monitor (pikalataus, reaaliaikainen katselu,
    profilointi)](#vice-monitor-hot-reload-live-watch-profiler)
  - [Sisäänrakennettu C64 ja virheenkorjaus](#built-in-c64-and-debugger)
- [11. Tietopankin linkit](#11-knowledge-base-links)
- [12. D64 Vie ja suorita](#12-d64-export--run)
  - [Jaa suoritus -painike](#split-run-button)
  - [Vie D64-muotoon -valintaikkuna](#export-to-d64-dialog)
  - [D64-metatiedot projekteissa](#d64-metadata-in-projects)
  - [D64 Editor (selaa ja muokkaa olemassa olevaa
    levykuvaa)](#d64-editor-browse--edit-an-existing-disk-image)
- [12b. CRT-vienti (Magic Desk 64K
  -kasetti)](#12b-crt-export-magic-desk-64k-cartridge)
  - [Mitä ostoskorissa lähetetään](#what-ships-in-the-cart)
  - [Lataa osoite ja aloituspiste](#load-address-and-entry-point)
  - [Kokorajoitus](#size-limit)
  - [Yhteensopivuus](#compatibility)
- [13. Asetukset](#13-settings)
  - [VMA-kääntäjä](#vma-compiler)
  - [VICE-emulaattori](#vice-emulator)
  - [Exomizer](#exomizer)
  - [Retro-virheenkorjaaja](#retro-debugger)
  - [C64 Ultimate / 1541 Ultimate](#c64-ultimate--1541-ultimate)
  - [Ultimate-emulaattorin asentaminen vaihe
    vaiheelta](#installing-the-ultimate-emulator-step-by-step)
  - [Kung Fu Flash 2](#kung-fu-flash-2)
  - [Versiohallinta (git)](#version-control-git)
- [14. Visuaaliset editorit (työkalupakki)](#14-visual-editors-toolkit)
  - [Korkearesoluutioinen / Monivärinen editori](#hi-res--multicolor-editor)
  - [Sprite-editori](#sprite-editor)
  - [C64 Merkki-ROM-selain
    ("Merkkikartta")](#c64-character-rom-browser-char-map)
  - [Merkkieditori (merkistö)](#character-editor-charset)
  - [Merkkijonojen muokkausohjelma](#charset-canvas-editor)
  - [Karttaeditori (monikerroksiset
    laattakartat)](#map-editor-multilayer-tilemaps)
  - [Kenttäeditori](#level-editor)
  - [SID-editori (3-ääninen seuranta)](#sid-editor-3-voice-tracker)
  - [SID-soitin](#sid-player)
    - [HVSC (korkeajännitteisten SID-laitteiden
      kokoelma)](#hvsc-high-voltage-sid-collection)
    - [Spektrianalysaattori](#spectrum-analyzer)
  - [Käyräeditori](#curve-editor)
  - [Taulukkogeneraattori](#table-generator)
  - [Numeronmuunnin](#number-converter)

---

## Version 2.7.4 kohokohdat

- **Valinta vaakasuuntaisessa seurantajärjestelmässä** — Valitse nuotit
  painamalla Shift-näppäintä ja vetämällä kehystä tai Ctrl-näppäintä ja
  napsauttamalla niitä. Leikkaa, kopioi, liitä (hiirellä tai kursorilla) tai
  poista ne uusilla otsikkopainikkeilla tai Ctrl+X / C / V ja Del
  -näppäinyhdistelmällä.
- **Kvantisoi** — **Q** tai uusi-painike siirtää valitut nuotit ruudukon
  lähimpään riviin (2, 4, 8 tai 16 riviä seurantapalkissa) säilyttäen niiden
  pituudet. Kun **Äänitettynä** on valittuna, äänitys kvantisoidaan, kun se
  pysähtyy.
- **Kumoa / Tee uudelleen vaakasuuntaisessa seurannassa** — seurannan
  työkalupalkin kaksi painiketta ovat myös sen otsikossa.
- **Siistimmät muokkaukset** — nuotin poistaminen pitää nuotin lopun ennen sitä,
  ja pidemmän nuotin päälle liittäminen ei jätä jälkeensä irtonaisia nuotteja.
- **Soittimien poistaminen** — **−** painikkeiden **+** vieressä poistaa
  nykyisen soittimen, ja Tiedostot → **Poista käyttämättömät soittimet** poistaa
  ne soittimet, joilla ei ole nuottia.
- **Kappaleen äänenvoimakkuus** — **Äänenvoimakkuus**, seurantapalkin nuppi,
  säätää sävelmän äänenvoimakkuutta (yksi sirua kohden kahdella SID:llä);
  soittimet eivät enää itse aseta sirun äänenvoimakkuutta.
- **PAL / NTSC** — sävelmän ajoitus: NTSC pyörii 60 kehystä sekunnissa
  NTSC-kellolla, omalla nuottitaulukolla ja `.sid`-otsikkomerkillä.

## Version 2.7.3 kohokohdat

- **Linux** — SID Player ja SID Editor pysyivät hiljaa siellä, missä
  GStreamer-lisäosat puuttuivat: AppImage sisältää ne nyt, ja `.deb`- ja
  `.rpm`-paketit ovat niistä riippuvaisia.
- **Kumoa / Tee uudelleen SID-editorissa** — kaksi uutta painiketta
  seurantatyökalupalkissa eli Ctrl+Z ja Ctrl+Y. Ne kattavat nuotit, soittimet,
  kappaleen, tempon ja sävelmän latauksen jopa 100 askeleeseen asti. Koko äänite
  on yksi askel.
- **Tempo** — seurantalaitteen tempo-kenttä on nimetty sen mukaan,
  **Kehyksiä/rivi**: suurempi luku on hitaampi. Sen vieressä oleva **BPM**
  näyttää tuloksena olevan tempon.
- **Nuottien siirtäminen vaakasuuntaisessa seurantajärjestelmässä** — nuotin
  runkoa vetämällä voit siirtää sitä ajassa ja sävelkorkeudessa. Se säilyttää
  nuotin pituuden, instrumentin ja efektin ja pysäyttää rivin ennen äänen
  seuraavaa nuottia.
- **Nuotin pituus vaakasuuntaisessa seurantajärjestelmässä** — nuotin oikea pää
  on nyt helppo havaita jopa yksirivisessä nuotissa: kursori muuttuu
  kaksoisnuoleksi ja kirkas palkki merkitsee lopun. Vedä sitä venyttääksesi tai
  lyhentääksesi nuottia. Se pysähtyy äänen seuraavan nuotin kohdalle sen
  poistamisen sijaan.
- **Yhdistä MIDI ilman kysymystä** — Windowsissa verkkonäkymä ei enää kysy lupaa
  omassa valintaikkunassaan.
- **Ladataan .bin-tiedostoa** — seuranta avautuu valitun ensimmäisen kappaleen
  vaiheessa: kappale, jonka kappale ei ala kuviolla 0, näytti sen sijaan kuvion
  0.
- **SID-soittimen tauko** — se pysähtyy nyt joka kerta: sillä hetkellä soitettu
  melodianpätkä tai SID-editorin nuotti voi kytkeä äänen takaisin päälle, kun
  soittimessa näkyy tauko. Tauko-painikkeen painaminen uudelleen jatkaa.
- **Pysäytä toistossa: Kaikki** — seurantalaite palaa ennen toistoa avoinna
  olleeseen kuvioon sen sijaan, että se pysyisi viimeksi toistetussa kuviossa
  ensimmäisen kappalevaiheen pysyessä valittuna.
- **Poly-äänitys MIDI:stä** — kun **Poly-äänitys** on päällä (MIDI-tulon
  vieressä), äänityksen aikana painetut näppäimet siirtyvät omiin ääniinsä
  valitusta äänestä alkaen. Kolmen sointu osuu kolmeen ääneen, ja näppäimen
  vapauttaminen kirjoittaa nuotinvaihdon.
- **Ei klikkausta reSID:ssä** — koskettimilta tai VA-VK:lta soitetut nuotit
  eivät enää klikkaa ennen alkuaan, eikä myöskään sellaisen sävelmän ensimmäinen
  nuotti, joka ei ala ensimmäiseltä riviltä, sekä 6581- että 8580-malleissa.

## Version 2.7.2 kohokohdat

- **reSID WebSID:n tilalla** — SID Player ja SID Editor toistavat taustalla,
  [resid-rs](https://github.com/binaryfields/resid-rs):ssä (reSID:n Rust-portti,
  oletusarvo) tai VA SID Coressa, molemmissa MOS 6581- tai 8580-piirillä.
  **Asetukset → Yleiset → SID-esikatselu** valitsee. Haku, stereo 2SID- ja
  3SID-viritykset ja C64-ydin toimivat molemmissa. WebSID on poissa.
- **SID Playerin puskuri** — **Asetukset → Yleiset → SID-esikatselu → SID
  Playerin puskuri** ilmaisee nyt, kuinka kauas eteenpäin sävelmä renderöidään:
  10, 15, 20 tai 30 sekuntia.

## Version 2.7.1 kohokohdat

- **VICE-virheenkorjaus** — **Asetukset → Yleiset → Virheenkorjaus** valitsee
  Virheenkorjaus-painikkeen virheenkorjauksen: **Visual Assembler** suorittaa
  virheenkorjauksen suoritustilassa olevalla koneella (VICE,
  Ultimate-emulaattori, sisäänrakennettu C64), **RetroDebugger** avaa ulkoisen
  ohjelman. VICE:ssä ikkuna toimii omalla VICE-ohjelmallasi: keskeytyspisteet,
  askel sisään / yli / ulos, rekisterit, purkaminen ja muisti, editorin
  seuratessa suoritinta. Katso [Sisäänrakennettu C64 ja
  virheenkorjaus](#built-in-c64-and-debugger).
- **Ultimate emulator** — kaksi uutta suoritustilaa, **Ultimate emulator** ja
  **D64 Ultimate emulator**:ssä, ajavat ohjelman
  [UE2-C64U-Emulator](https://github.com/Jondalar/UE2-C64U-Emulator):ssä, joka
  on muokkaamaton C64 Ultimate / Ultimate 64 -laiteohjelmisto tietokoneellasi,
  saman REST API:n kautta kuin oikea laite. VA käynnistää emulaattorin
  ensimmäisellä suorituskerralla, asentaa `.ue2`-laiteohjelmiston flash-kuvaan
  ja sulkee emulaattorin sovelluksella. **Debug** avaa näissä tiloissa
  virheenkorjaajan (katkaisupisteet, step in / over / out, rekisterit, purku,
  muisti), ja **VICE Monitor** -ikkuna muodostaa yhteyden emulaattoriin. Määritä
  se kohdassa **Asetukset → Integraatiot → Ultimate-emulaattori (UE2)**. Uusia
  esimerkkejä: **Ultimate turbo demo (64 spriteä)** ja **Ultimate turbo kuutio**
  (Esimerkkejä → IRQ ja laitteisto) muuttavat suorittimen nopeutta `$D031`:n
  kautta 3 sekunnin välein välillä 1–64 MHz, ja toimivat vain Ultimate-mallissa,
  jossa turbo-rekisterit ovat päällä. Katso [C64 Ultimate / 1541 Ultimate]{2].
- **SID-editori: kaksi SID:tä** — **SID: 1/2** seurantatyökalupalkissa antaa
  kuusiäänisen sävelmän, jossa on valittavissa oleva osoite toiselle SID:lle
  (`$D420`–`$D7E0`, `$DE00`–`$DFE0`). Esikatselu, `.bin` tallennus, `.sid` ja
  kokoonpanon vienti sekä `.sid` tuonti käsittelevät kaikki molemmat sirut.
  Katso [SID-editori]{1].
- **SID-soitin: 2SID- ja 3SID-kappaleet** — VA SID Core toistaa ne stereona: SID
  1 vasemmalla, SID 2 oikealla, kolmas SID keskellä. Katso
  [SID-soitin](#sid-player).
- **Kanavaspektri** — erillinen 16-kaistainen analysaattori jokaiselle äänelle
  seurantatoiston aikana SID-editorissa.
- **SID-editori** — **Tiedostot → Uusi sävelmä**, sävelmän nimi otsikossa, yksi
  painike seurannan irrottamiseen ja kiinnittämiseen sekä siistimpi
  soitinluettelo vaakasuuntaisessa seurannassa.
- **Korjattu** — **D64 laitteistossa** lähettää kuvatyypin liitospyynnön mukana,
  mitä C64 Ultimate -laiteohjelmisto 1.1.0 vaatii; editorin pysäyttäminen ei
  enää sulje SID-soitinta.

---

## Version 2.7.0 kohokohdat

- **Sisäänrakennettu C64** — VICE 3.10 (x64sc, käännetty WebAssemblyksi) toimii
  nyt sovelluksen sisällä, eikä mitään tarvitse asentaa. Valitse
  Suorita-valikosta **Sisäänrakennettu C64** tai avaa se työkalupalkin
  painikkeella. Katso [Sisäänrakennettu C64 ja
  virheenkorjaus](#built-in-c64-and-debugger).
- **Debugger** — pysähtyy ennen käskyä keskeytyskohdassa; **Continue**,
  **Break**, **Step into / over / out**; muokattavat rekisterit ja liput,
  purkaminen tietokoneen ympärille, muistinäkymä ja keskeytyskohtaluettelo.
  Keskeytyskohdat tulevat editorista, lohkotilasta ja purkamisesta, ja editori
  seuraa suoritinta. **Debug** -painike käyttää sitä tässä tilassa ja
  reaaliaikaisissa laitteistotiloissa, kun **Visual Assembler** on valittu
  debuggeri.
- **Koneen asetukset** — PAL tai NTSC, SID 6581 tai 8580, reSID tai FastSID, REU
  jopa 16 Mt:iin asti, joystick-portti, warp ja ääni.
- **Omat tiedostosi** — **Tiedostot** -valikko lataa PRG:n ja liittää D64:n tai
  kasetin (`.crt`). Tilarivillä näkyy aseman LED ja raita, ja vilkkuva LED
  osoittaa aseman virheen, esimerkiksi silloin, kun tiedostoa ei löydy.
- **Näyttö** — CRT-suodin, jossa on skannausviivat, koko näytön tila ja
  muokattavissa oleva ikkuna. Ikkuna ja sen asetukset palautuvat seuraavan
  käynnistyksen yhteydessä.
- **Korkearesoluutioeditori** — moniväristen solujen koko on rajoitettu paperiin
  ja kolmeen väriin, rajan ylittävät solut on merkitty punaisella, ja
  pikseliruudukon ollessa päällä olevan kuvan reunan yli piirtäminen ei enää
  aiheuta virheitä. Katso [Korkearesoluutio / Monivärinen editori]{1].
- **Editorin hiiren kakkospainikkeen valikko** — Expert- ja Ultimate Basic
  -editoreissa: Leikkaa, Kopioi, Liitä, Valitse kaikki ja ISOT/pienet kirjaimet
  valitulle tekstille.

## Version 2.6.9 kohokohdat

- **Git-haarat** — versionhallintaikkuna vaihtaa haaraa (haaraluetteloa), luo,
  nimeää uudelleen ja poistaa ne sekä yhdistää yhden nykyiseen haaraan.
  Yhdistämiskonflikti listaa tiedostot, merkitsee ne punaisella ja **Keskeytä
  yhdistäminen** palauttaa yhdistämistä edeltäneen tilan; avoimet välilehdet
  latautuvat uudelleen levyltä vaihdon, yhdistämisen tai jemmauksen jälkeen.
  Katso [Git]{1].
- **Tiedosto tiedostolta ja stash** — jokaisella muutetulla tiedostolla on omat
  **Stage / Unstage / Discard** -painikkeensa (seuraamattoman tiedoston voi
  poistaa), ja sen nimeä napsauttamalla avautuu sen vertailunäkymä. **Stash**
  siirtää muutokset sivuun; stash-luettelo ottaa ne käyttöön, poistaa ne tai
  poistaa ne. Ilman **Stash all changes** -toimintoa projektin commit ottaa vain
  stash-tiedostot.
- **Parempi vertailu** — tiedostokohtainen kortti, jossa on sen tila ja +/−
  -määrät, vanhat ja uudet rivinumerot, assembly / Ultimate Basic -syntaksin
  värit ja rivin muuttunut osa korostettuna; **Jako** näyttää vanhan ja uuden
  tekstin vierekkäin ja ⤢ antaa vertailulle enemmän tilaa.
- **Hylkää muutokset tarkoittaa oikeastaan hylkäämistä** — Git-tilassa se kysyy
  ensin, sitten palauttaa levyllä olevat tiedostot HEAD-tilaan (`git restore`)
  ja lataa välilehdet uudelleen, joten haarautumiskytkin toimii sen jälkeen.
  Valikosta käynnistettynä sen tulos näkyy viestinä.
- **Kick-projektit** — syklien määrät, virheet ja vihjeet toimivat myös
  tiedostossa, jota käynnistystiedosto ei tuo: ne tulevat tiedoston puusta
  (esimerkiksi `main.asm` käynnistystiedoston `boot.asm` vieressä). Eteenpäin
  suuntautuva haara `.pseudopc`-tiedoston sisällä (`bne !+`) on suhteellinen
  loogiseen osoitteeseen nähden, ja char-literaali vastaa yksimerkkistä
  merkkijonoa (`s.charAt(i) == '1'`), kuten KickAssemblerissa.
- **Korjaukset ja ulkoasut** — **Tallenna projekti** tallentaa avatun
  Expert-projektin paikoilleen tallentamattomien tiedostojen välilehtineen sen
  sijaan, että se kysyisi tiedostonimeä; versionhallintaikkuna pysyy näytöllä ja
  siinä on kuvaketyökalupainikkeet kuten editoreissa; lyhyemmät numerokentät
  taulukkogeneraattorissa.

## Version 2.6.8 kohokohdat

- **Toolkit Expert- ja UB-tilassa** — *Toolkit* -työkalurivin painike näyttää
  C64-paletin ja PETSCII-koodit editorin vieressä: Expert-tilassa sivupaneelina
  Disassembly / Monitor -kohdan vieressä, UB-tilassa oikeanpuoleisessa ruudussa
  (se vuorottelee Disassembly- ja Monitor-asetusten kanssa).
- **Paneelit tallentuvat** — Expert-tilan Näyttö- ja Työkalupakki-paneelien
  kokoa voidaan muuttaa kuten Purkamis-paneelin; auki jätetyt paneelit (Paletti,
  Purkaminen, Näyttö, Työkalupakki, Projekti) ja niiden leveydet palautuvat
  seuraavan käynnistyksen yhteydessä riippumatta siitä, missä tilassa sovellus
  käynnistyy – myös UB-tilassa.
- **VMA-kieli** — nollasivulla oleva `.const` tai `.var` tekee `lda zp`:stä
  nollasivukäskyn (`A5 FB`, kuten KickAssembler tekee; `lda.abs zp` pitää arvon
  absoluuttisena); `JMP (label)` / `JMP (table+2)`; lausekkeet, kuten `lda
  $1234+1` ja `sta $0400+40*2,x`; makro voi kutsua toista makroa; `.data` /
  `.rawbytes` -taulukoiden tavujen nimikkeet (osoitintaulukot); `:name` -nimike
  voi osoittaa nimikkeeseen.
- **Include** — sisällytetyn tiedoston omat `.include`-, `.incbin`- ja
  `.sid`-rivit ladataan (suhteessa sen kansioon) ja sen makrokutsuja
  laajennetaan; puuttuva include-rivi tai itsensä sisällyttävä rivi on virhe
  eikä tyhjä kirjasto.
- **Turvallisempia koontiversioita** — virheitä hiljaisen väärän koodin sijaan:
  ratkaisematon TURBO_SET / SPRITE_ANIM-arvo, myöhemmin määritellystä
  tunnisteesta otettu MEMCPY / MEMSET / JOYSTICK-koko; `.data` / `.rawbytes`
  -makroargumentin automaattinen puskuri ottaa omat tavut. Nollasivuvakioita
  käyttävät ohjelmat lyhenevät.
- **Korjauksia** — yli 8 kt:n kokoinen CRT (useampi kuin yksi pankki) ei
  käynnistynyt: latausohjelma toimii nyt RAM-muistista; projektin
  tallennusvalintaikkunassa annettu `.asm`-nimi tallentaa lähdetekstin, ei VA
  JSON -tiedostoa.

## Version 2.6.7 kohokohdat

- **Rust VMA -kääntäjä** — **Asetukset → Yleiset → Ohjelma → VMA-kääntäjä**
  valitsee moottorin: **JavaScript** (oletus), **Rust** tai **Rust +
  JavaScript-tarkistus**, joka kääntää molemmilla ja kirjaa mahdolliset erot.
  Rust-kääntäjä antaa samat tavut, muistinäkymän, segmentit ja käännetyt
  virheilmoitukset; Projektit käynnistyvät myös sen kautta, virheillä kohdassa
  `tiedosto:rivi`. Katso [VMA-kääntäjä](#vma-compiler).
- **VMA on avoimen lähdekoodin ohjelma** — Visual Macro Assembler -kääntäjä
  sijaitsee omassa GPLv3-arkistossaan osoitteessa
  [github.com/zstarczali/VMA](https://github.com/zstarczali/VMA) (versio 2.0.0),
  josta on saatavilla englannin- ja unkarinkielinen käyttöohje sekä
  komentorivikääntäjä. Tietoja-ruudussa näkyy VMA-versio ja Ultimate Basicin
  vieressä oleva banneri.
- **Projektisymbolit ja vakiot** — **Projektiasetukset** asettaa VMA-symbolit
  (`.define`, `.if` / `.ifdef`) ja vakiot (`.const`) koko projektille,
  tallennettuna `.proj` -tiedostoon; virherivit pysyvät oikein. Katso
  [Projektipaneeli ja välilehdet](#project-panel--tabs).
- **Kääntämisikkuna** — edistymispalkin alla oleva vaiherivi nimeää
  käännösmoduulin, tiedoston ja PRG:n koon.
- **Rakennuksen tiedot** — näyttää kuvaamansa tiedoston; ACME-lähdekoodi saa
  oman näkymänsä todellisesta ACME-koonnuksesta (alkuperä, loppu, koko,
  segmentit, otsikot). Se ei enää sulkeudu ulkoisella napsautuksella.
- **Nopeampi kirjoittaminen** — ACME-tilassa Disassembly- ja Monitor-paneelit
  rakennetaan uudelleen kerran koontiversiota kohden ja himmennetään, kun
  lähdekoodi on uudempi; suuret Kick-projektit käyttävät uudelleen viimeisintä
  esikäsittelyään ja renderöivät disassemblyn paloina.
- **Projektipuu** — **Siirrä ylös** / **Siirrä alas** tiedostojen ja kansioiden
  hiiren kakkospainikkeella avattavassa valikossa. Kick-yhteensopivuus kytketään
  päälle **Projektiasetukset**-kohdassa.
- **Korjauksia** — tiedoston `.asm` tallentaminen (Ctrl+S, Valikko → Tallenna,
  ennen git commit -toimintoa) kirjoittaa taas pelkkää tekstiä, ei VA JSON
  -muotoa; versionhallintavedokset säilyttävät lähdekooditiedostot tekstinä;
  käyttäjämakron sisällä olevat kirjastomakrot (SET_BORDER, SPRITE_*, JOYSTICK,
  TEXT …) saavat parametrinsa, ajonaikaiset IF / WHILE / REPEAT -otsikot ovat
  yksilöllisiä kutsua kohden ja `'A'` -argumentti pysyy merkkinä; vedettävät
  valintaikkunat avautuvat tallennuspaikastaan.
- **Katso** — Käännös-, koontitieto-, D64-vienti-, käännösvirhe- ja
  kysymysikkunoissa on Tietoja-ruutukehys.

---

## Version 2.6.6 kohokohdat

- **SID-soitinmakro** — `.sid_player [subtune][, raster]` (**SID_PLAYER**
  paletissa) toistaa `.sid`-makron sävelmän: se kutsuu init-rutiinia
  alivirityksellä, kytkee CIA1-ajastimen IRQ:n pois päältä, kytkee rasteri-IRQ:n
  ja kutsuu toistorutiinia joka kehys sen sisäänrakennetusta käsittelijästä.
  Musiikkia sisältävä ohjelma on nyt `.sid "musiikki.sid"` + `.sid_player`.
  Katso [SID_PLAYER]{1].
- **SID-tunnisteet** — `.sid`-makro määrittää `SID_LOAD`, `SID_INIT` ja
  `SID_PLAY`, jotka on siirretty yhdessä mukautetun latausosoitteen kanssa,
  jotta oma IRQ-käsittelijäsi voi kirjoittaa `JSR SID_PLAY`. Katso [SID]{1].
- **Vain asiantuntijatila** — **Projektiasetukset** sisältää kytkimen, joka
  sulkee lohkotilan projektin tiedostoille koosta riippumatta (tallennettuna
  `.proj`-tiedostoon). Katso [Projektipaneeli ja
  välilehdet](#project-panel--tabs).
- **SID Player -puskuri** — **Asetukset → Yleiset → SID-esikatselu → SID Player
  -puskuri** asettaa 2048–16384 näytettä; suurempi puskuri pysäyttää rätinän
  sovelluksen ollessa käynnissä. WebSID käyttää sitä uudelleenkäynnistyksen
  jälkeen, VA SID Core renderöi 10 / 15 / 20 / 30 sekuntia eteenpäin. Katso [SID
  Player]{1].
- **Mukautettu C64-paletti** — **Asetukset → Yleiset → Editorit → Muokkaa
  mukautettua palettia…** asettaa oman RGB-arvon jokaiselle 16 värille alkaen
  mistä tahansa sisäänrakennetusta paletista; tuo Photoshop `.act`, VICE `.vpl`,
  GIMP `.gpl` -paletti tai heksadesimaalivärien luettelo, vie `.act` / `.vpl`.
  Katso [14. Visuaaliset editorit (työkalupakki)](#14-visual-editors-toolkit).
- **Katso** — C64-muistipaneeli telakoituu takaisin kutistettuna; Uutta-,
  Päivitys-, Asetukset- ja Tietokanta-ikkunoissa on sama kehys kuin
  Tietoja-ruudussa; Projektiasetukset-valintaruudut ovat VA-kytkimiä.
- **Korjaukset** — virheraportti hyväksyy PNG- ja JPG-näyttökuvat
  julkaisuversiossa; vilkkuva kursori `READY.` -tekstin jälkeen aloitusnäytössä
  on yhtenäinen C64-solu ilman macOS:n siihen piirtämiä viivoja; macOS:n
  inline-ennustava tekstinsyöttö on pois päältä Expert- ja Ultimate Basic
  -editorissa.

---

## Version 2.6.5 kohokohdat

- **KickAssembler-projektit** — **Valikko → Ohjelma → Tuo Kick-projekti…** ottaa
  kokonaisen KickAssembler-lähdekoodipuun (päätiedoston `#import` moduuleineen
  ja `.import binary` resursseineen) ja kirjoittaa sen viereen `.proj`;
  lähdekoodit pysyvät siellä missä ne ovat. Visual Assembler rakentaa sen omalla
  assemblerillaan, tavu tavulta, kuten KickAssembler 5.25 — Suorita, Rakenna PRG
  / D64 / CRT, Exomizer, Debug, VICE Monitor ja Build-projekti toimivat kaikki,
  virheet nimeävät `file:line`, ja koko puu tarkistetaan kirjoittaessasi. Dark
  Chambers C64 -porttaus ja kaikki yksitoista KickAssembler-esimerkkiohjelmaa
  koodilla rakentuvat identtisesti. Katso [Kick-projektit (Tuo
  Kick-projekti…)](#kick-projects-import-kick-project).
- **Projektiasetukset** — Projektipaneelin hammasrataspainike (tai **Valikko →
  Tiedosto → Projektiasetukset…**) näyttää ja muokkaa projektin nimeä,
  käynnistystiedostoa, assembleria, KickAssembler-yhteensopivuutta, `#define`
  symboleja ja `cmdLineVars`. Katso [Projektipaneeli ja välilehdet]{1].
- **Kick-yhteensopiva kytkin** — kytkin (versiosta 2.6.7 lähtien
  **Projektiasetukset**-valikossa) tekee mistä tahansa VMA-projektista
  KickAssembler-yhteensopivan; VA-makrot ja -direktiivit toimivat edelleen
  KickAssembler-skriptin rinnalla.
- **KickAssembler-kieli** — `#import` / `#importonce` / `#importif`, `#define` /
  `#if`, `.const` / `.label` (nolla sivu tai absoluuttinen arvo), `.for`,
  `.while`, `.if … else`, `.var` / `.eval`, `.function`, `.macro { }`,
  `.pseudocommand`, monitunnisteet, laajuusalueet ja nimiavaruudet, `.pseudopc`,
  `.import binary`, `LoadBinary` (mallipohjilla, kuten `BF_KOALA`), `LoadSid`,
  `virtual` muistilohkot, `cmdLineVars`, `BasicUpstart2`, `List` / `Hashtable` /
  `.struct` / merkkijonot, `.enum`, matemaattinen kirjasto, väri- ja
  operaatiokoodivakiot, `*` ohjelmalaskurina, `;` lausekkeiden välillä, `.error`
  / `.errorif`.
- **Rakennuksen tiedot sarakkeissa** — leveämpi ikkuna: alkupiste, loppupiste,
  koko ja segmenttien lukumäärä ylhäällä, sitten segmentit, virheet ja
  `.print`-tuloste sekä otsikot, vakiot ja makrot sarakkeissa. Kick-projektissa
  se näyttää rakennetun puun ja sisäiset otsikot muodossa `scope.label`.
- **C64-väripaletti** — **Asetukset → Yleiset → Editorit → C64-väripaletti**
  asettaa 16 C64-värin RGB-arvot jokaisessa editorissa (sprite, merkki,
  merkistöpohja, korkearesoluutioinen, kartta, taso, työkalupakin värimallit):
  **Colodore** oletuksena (lähinnä aitoa C64:ää) tai Pepto, VICE, Deekay, C64
  Wiki / Godot. Vain näyttö muuttuu; korkearesoluutioisten kuvien tuonti käyttää
  sitä myös. Katso [14. Visuaaliset editorit
  (työkalupakki)](#14-visual-editors-toolkit).
- **Värinvalitsin** — Hi-Res-, Sprite-, Character (monivärinen)- ja Charset
  Canvas -editoreissa on valitsintyökalu; **Alt+napsautus** valitsee värin millä
  tahansa työkalulla. Katso [Hi-Res / Monivärinen editori]{1].
- **Ctrl + zoomaus rullalla** korkearesoluutio-, sprite-, kartta- ja
  tasoeditorissa kohdistimen ympärillä. Korkearesoluutioisen rasterin kytkin
  sijaitsee ruudukon vieressä.
- **ACME-tila** — muistikartta ja päällekkäisyysvaroitus seuraavat ACME-koontia;
  ACME-projekti rakentaa käynnistystiedostonsa; ACME-mallit näkyvät vain, kun
  toimiva ACME on asetettu, ja ACME-projektin luominen vaihtaa asetukset
  ACME-tilaan. Katso [ACME-tila](#acme-mode).
- **Uusi projekti** — **Uusi projekti mallista…** on valikossa kohdassa **Uusi
  projekti** (kolme erillistä merkintää ovat poissa); Visual Assembler
  -sprite-multiplekserimalli tulostaa otsikkonsa.
- **Korjaukset** — `.byte` / `.word`, joissa on otsikkolausekkeet
  (`<(otsikko+1)`, `.word otsikko` ennen otsikkoa), eivät enää muodosta nollaa;
  laittomat `NOP`-muodot, jotka lukevat operandin, muodostavat assemble-funktion
  (katso [Laittomat / dokumentoimattomat
  ohjeet](#illegal--undocumented-instructions)); Ultimate Basicin avauspainike
  lukee **Load .ub file** kaikilla kielillä.

---

## Version 2.6.4 kohokohdat

- **ACME-assembler-tila** — **Asetukset → Yleiset → Assembler-tila** vaihtaa
  *VMA-tilan* (sisäänrakennettu Visual Assembler -assembler) ja *ACME-tilan*
  välillä: Expert-lähdekoodi on rakennettu ACME 0.97:llä, ja Suorita, Rakenna,
  Purkaminen/Näytön paneelit, virheenkorjaussymbolit, syklien määrät,
  optimointivihjeet ja VICE-Näytön paneelit käyttävät kaikki todellista
  ACME-tulostetta. Katso [ACME-tila](#acme-mode).
- **Better Kick Assembler import** — Program-valikon kohta on nyt **Kick
  import**. Tavalliset `.text "…"`-rivit seuraavat `.encoding`-kohtaa, `.label
  NAME = * + N` sijoittaa nimiön käskyn sisään ja `.abs` / `.zp` -mnemoniset
  loppuliitteet pakottavat osoitustilan käyttöön. Restore64-purkaukset
  rakentavat tavu tavulta kuten KickAssembler. Katso [Kick import (Kick
  Assembler)](#kick-import-kick-assembler).
- **Run käynnistää ohjelmat BASIC-rivin alapuolella** — ohjelma, joka latautuu
  BASIC SYS -rivin alapuolella tai yli, saa pienen käynnistyslataajan;
  lähdekoodin myöhemmin alempaa ORG-osoitetta ei enää siirretä
  aloitusosoitteeseen ylöspäin. Katso **BASIC SYS -tynkä** -rivi kohdassa
  [Asetukset ja työkalupalkki]{1].
- **Exomizer** — sotkuinen ohjelma ei enää anna virhettä `?SYNTAX ERROR`
  toisella suorituskerralla: PRG, jossa on BASIC-rivi, pakataan `sfx basic`
  -rivillä, mikä tahansa muu `sfx $<latausosoite>` -rivillä.
- **SID-editori** — toisto-LCD-näyttö seurantapalkissa (kappaleen sijainti,
  kuvio, rivi, aika; vihreä tai punainen kohdassa **Asetukset → Yleiset →
  SID-esikatselu → LCD-väri**), instrumenttinuppi LCD-näytöllä VA-VK:ssa,
  edistymispalkki **Tuo .sid…-tiedostolle**. Katso [SID-editori]{1].
- **Asetukset kolmella välilehdellä** — **Yleiset**, **Tiedosto- ja polut** ja
  **Integraatiot**. Katso [Osa 13](#13-settings).
- **Pienempiä parannuksia** — **Ctrl+N** avaa uuden välilehden; valintaikkunan
  tekstiä ei voi enää valita vahingossa (tekstikenttiä ja kopioitavaa
  tulostetta, kuten käännösvirheitä, voi edelleen); suuret Expert-lähteet
  muokkaavat nopeammin; `LSR A` ja `JMP ($nnnn)` tuodaan oikein; tietokanta
  linkittää Restore64:ään (restore64.dev), joka muuttaa C64 PRG:n KickAssembler
  / ACME -lähteeksi **Kick-tuontia** tai ACME-tilaa varten. ACME-lähdekoodia,
  jonka segmentti on `$0801` alapuolella (muistivedos), ei enää siirretä BASIC
  SYS -rivin taakse: se rakentuu omiin osoitteisiinsa ja saa aloituslataajan.

---

## Version 2.6.3 kohokohdat

- **.sid-tiedoston tuonti SID-editorissa** — **Tiedostot → Tuo .sid…** muuntaa
  minkä tahansa PSID/RSID-sävelmän instrumenteiksi, patterneiksi ja kappaleeksi,
  jota voit muokata: nuotti-oneja ja legato-nuotien, tarkasti nuoteille
  sijoitettujen rivien (funktempo ja swing `F` nopeusmuutosten kautta),
  aalto-/arpeggio-taulukoiden kiinteän sävelkorkeuden rumpuiskujen, pulssi- ja
  suodatinliikkeen, portin ajoituksen ja vibraton. Katso [SID-editori]{1].
- **Pitkät sävelmät toistetaan oikein** — kun sävelmän data ei mahdu soittimen
  viereen kohtaan `$C000`, se siirtyy omaan segmenttiinsa `$A000` alapuolelle
  sen sijaan, että se suoritettaisiin I/O:ssa; `.sid` -vienti seuraa perässä.
- **VA SID Core -esikatselu käynnistää nuotit uudelleen** — pidätetyn portin
  alta uudelleenkäynnistetty nuotti saa uuden hyökkäyksen, kuten oikealla
  pelaajalla.
- **SID-editori** — otsikko näyttää aktiivisen SID-emuloinnin (WebSID tai VA SID
  Core sirumallin kanssa); Nopeus-kentässä on − / + -painikkeet ja se ottaa
  arvoja 1–255; kappaleessa voi käyttää jopa 256 patternia.
- **Päivityspalvelimen asetukset** — **Asetukset → Yleiset → Päivitykset**
  asettaa palvelimen, jolta sovelluksen sisäiset päivitykset lukevat julkaisut
  (oletusarvo `https://www.c64va.pro/`). Katso [Sovelluksen sisäiset
  päivitykset]{1].
- **Ultimate Basic 1.6.6** — `TULOSTA KÄYTTÄEN "muotoa"; arvoja`, merkkijonojen
  vertailu PETSCII-järjestyksessä, liukuluku `rnd` ja `mod`, liukuluku IRQ /
  NMI-käsittelijöissä, `optio basic print` C64 BASIC PRINT -välistystä varten,
  pienemmät ohjelmat (käytössä vain liukulukurutiinit) ja 16-bittiset
  osoitelausekkeet (1.6.5). Ultimate Basic -editori korostaa `tulostusta
  käyttäen` ja `optiota basic print`.

---

## Version 2.6.2 kohokohdat

- **HVSC SID-soittimessa** – hae High Voltage SID -kokoelmasta (noin 61 000
  kappaletta) nimen, säveltäjän tai kansion mukaan, toista, lisää soittolistalle
  tai tallenna mikä tahansa kappale; lataa koko kokoelma kerralla
  offline-käyttöä varten tai ohjaa soittimeen purkamatonta HVSC-kansiota. HVSC:n
  kappaleiden todellinen pituus näkyy hakupalkissa, ja soittolista siirtyy
  eteenpäin, kun alikappale päättyy. Katso [HVSC (High Voltage SID
  -kokoelma)]{1].
- **Spektrianalysaattori** — kelluva LED-palkki-visualisaattori SID-soittimelle,
  jossa on 8–32 kaistaa, häipyvät solut ja peilattu lattia. Katso
  [Spektrianalysaattori](#spectrum-analyzer).
- **Oppituntieditori** — muunna oma ohjelmasi vaiheittaiseksi ohjatuksi
  oppitunniksi, kuten sisäänrakennettu "Build: Your First Text Program"
  -toiminto: lisää selityksiä, valitse kansio, kokeile sitä, tallenna se,
  vie/tuo `.vatut`-tiedostoja. Katso [Oppitunnit ja oppituntieditori]{1].
- **Verkko-oppitunnit** — lataa www.c64va.pro-sivustolla julkaistut oppitunnit
  suoraan tutoriaaliluetteloon päivitettyine oppitunteineen ja lähetä omasi
  tarkistettavaksi oppituntien muokkausohjelmasta. Katso [Verkko-oppitunnit]{1].
- **Jokainen makro saa parametrinsa operandikentästä** — `SET_BG $06`, `REGION
  Main`, `ORG $C000`, `SPRITE_POS 1, 200, 50` …: teksti luetaan makron
  Expert-riviksi ja kenttä näyttää odotetun muodon. Katso [Operandikentän
  parametrit](#parameters-in-the-operand-field).
- **Pienempiä parannuksia** — aktiivinen kelluva ikkuna on korostettuna,
  tuki-ikkuna näyttää chatilta, hiiren rulla vierittää välilehtipalkkia
  sivusuunnassa ja Ultimate Basic -koodin koko -sarake ei enää peitä
  rivinumeroita.

---

## Version 2.6.1 kohokohdat

- **Syklien määrä asiantuntijatilassa** — sisämarginaali näyttää jokaisen käskyn
  syklit, valinnan kokonaismäärän ja tarvittavan rasteririvin määrän. Katso
  [Syklien määrä](#cycle-counts).
- **Optimointivihjeitä** — Asiantuntijaeditori merkitsee rivit, jotka voivat
  olla lyhyempiä tai nopeampia (häntäkutsu, redundantti `CMP #0`,
  uudelleenlataukset, `INC` / `DEC` idiomit…). Katso [Optimointivihjeitä]{1].
- **Taulukkogeneraattori** — näyttö-/bittikarttariviosoitteet, pikselimaskit,
  kerto-/jakotaulukot, neljännesneliöt, logaritmi/lauseke, bittien kääntäminen,
  mukautetut lausekkeet ja täyttö-/kopiointinopeuskoodi. Katso
  [Taulukkogeneraattori](#table-generator).
- **VICE Monitor** — käynnissä olevan VICE:n pikalataus, tunnisteiden ja
  osoitteiden reaaliaikainen seuranta sekä PC-näytteenottoprofilointi. Katso
  [VICE Monitor](#vice-monitor-hot-reload-live-watch-profiler).
- **Nollasivun käyttökartta** ja **irrotettava muisti-ikkuna**. Katso
  [Muisti-ikkuna ja nollasivun käyttö]{1].
- **Ultimate Basic** — koodin koko riviä kohden, vihjeet ja Sprite Editor →
  Ultimate Basic -vienti animaatiolla.
- **SID-editori → .sid (PSID) -vienti** ja **sprite-multiplekseri**
  -projektimalli (16 spriteä).
- Useita kelluvia ikkunoita voi olla auki samanaikaisesti; napsauttamasi ikkuna
  tulee eturiviin.

---

## Version 2.6.0 kohokohdat

- **Visual Assembler on nyt täysin ilmainen** — Freemium/Professional-lisenssi
  on poistettu. Jokainen editori, koonti- ja laitteistoajovaihtoehto, kaikki
  seitsemän käyttöliittymäkieltä ja jokainen teema toimivat kaikille ilman
  rekisteröitymistä tai sarjanumeroa. Syy on yksinkertainen: Unkarin
  verosääntöjen mukaan ohjelman myyminen jättäisi verojen ja paperityön jälkeen
  liian vähän rahaa, jotta se olisi kannattavaa. Jo olemassa olevia
  sarjanumeroita ei yksinkertaisesti enää tarvita. Katso [Ilmainen ja avoin
  lähdekoodi](#free-and-open-source).

---

## Version 2.5.9 kohokohdat

- **Commodore 64 -teema** — C64:n käynnistysnäyttö: vaaleansininen reunus
  sinisten paneelien ympärillä, vaaleansininen teksti, käänteisen videon
  painikkeet, C64-paletin syntaksivärit ja C64-fontti näyttönäkymässä.
- **Commodore Beige -teema** — klassinen leipälaatikko: beige kotelo,
  sinapinkeltaiset toimintonäppäimet, sateenkaarenväriset rintaraidat ja C64:n
  sininen näyttönäkymä. Valitse se teemanvalitsimesta tai selaa sitä
  teemapainikkeella. Katso [Asetukset ja työkalupalkki]{1].
- **Commodore Starlight -teema** — vaalea teema läpikuultavan C64-leipälaatikon
  mukaan: himmeä kirkas lasi, jonka läpi paistaa sateenkaaren RGB-hehku,
  magenta-aksentti, sateenkaaren syntaksin värit ja savuinen tumma näyttönäkymä.
- **Versiohallintaikkuna** — ikkunaa voi vetää otsikosta, ja se avautuu
  uudelleen siitä, mihin se jäi. Se pysyy näytöllä, kun loki tai vertailu tekee
  siitä korkeamman, eikä sen ulkopuolella tapahtuva napsauttaminen enää sulje
  sitä (Esc sulkee). Katso [Versiohallinta](#version-control).
- **Projektitason versionhallinta** — avoimen `.proj`-projektin välilehdelle
  **File / Project** -kytkin commit-tiedostoon tallentaa kaikki projektin
  lähdekooditiedostot (projektipuu + sisällytetyt tiedostot) yhdessä
  merkinnässä. Lokissa luetellaan kunkin commitin muuttuneet tiedostot, Diff
  toimii tiedosto kerrallaan, Checkout palauttaa kaikki tiedostot editorin
  välilehtiin ja automaattisen tallennuksen merkinnät tehdään myös
  projektikohtaisesti. Git-tilassa loki ja diff kattavat koko repositorion.
  Katso [Projektitila]{1].

---

## Version 2.5.8 kohokohdat

- **Versiointi** — projektin tilannevedoksista tehtiin gitin kaltainen
  versionhallinta: commit-tiedostot viestillä ja lyhyellä hajautusarvolla,
  lokitiedosto **HEAD**-komennolla, **Diff**-komento työkopiota vasten,
  **Checkout**-komento editoriin ja erilliset automaattisen tallennuksen
  merkinnät. Lohkotilassa (JSON) olevia ohjelmia verrataan kokoonpanolinjoina,
  joten vertailu näyttää todelliset muutokset. Toimii Lohko-, Expert- ja
  Ultimate Basic -välilehdillä. Katso [Versiointi]{1].
- **Git-integraatio** — valitse `git.exe` kohdassa **Asetukset →
  Versiohallinta** (tai anna sovelluksen löytää se). Kun projekti on
  git-repositoriossa, valintaikkunassa näkyvät haara, muuttuneet tiedostot,
  commit (tallennetaan ensin), loki, vertailutiedostot **RAW**-näkymässä,
  uloskirjaus, **Pull** / **Push** ja **git init**.
- **Ilmoita virheestä** — sisäänrakennettu ilmoituslomake, jossa on jopa neljä
  kuvakaappausta (tiedosto, Ctrl+V tai raahaa ja pudota), valinnainen
  sähköpostiosoite, järjestelmätiedot ja viimeaikaiset sovellusvirheet. Katso
  [Virheen ilmoittaminen]{1].
- **SID-soitin** — **Sekoita** ja **suosikit** (★) kappaletta kohden. Katso
  [SID-soitin](#sid-player).

---

## Version 2.5.7 kohokohdat

- **VA SID Core 1.2** — SID Player käyttää nyt natiivia Rust C64 -ydintä:
  syklintarkkaa 6510-prosessoria, jossa on tarkka keskeytysajoitus, CIA 6526A
  -prosessoria, jossa on VIC-II-ajoitus ja virheelliset viivat, sprite DMA- ja
  rasterikeskeytykset sekä 6510 I/O -portti. Katso [SID Player](#sid-player).
- **Korkearesoluutioeditori** — kaksi väriä jokaisessa 8×8-solussa: uusi
  **Solupaperi**-työkalu. Katso [Korkearesoluutio-/monivärieditori]{1].
- **Tarkka hahmon ROM** ROM-katseluohjelmassa, hahmoeditorin **Load ROM**
  -kohdassa ja kartta-/tasoeditorissa.
- **Sprite Editor** — korkearesoluutioinen päällekkäiskuva, täyttö,
  valinta/siirto, kierto, kaikkien peilikuva, sprite-arkin tuonti, osuma-alue,
  X/Y ×2 esikatselu. Katso [Sprite Editor]{1].
- **Kenttäeditori** — objektit, hahmon ominaisuudet, reunan tarkistus, värit
  näytöllä, muistimittari RLE:llä, suoritetaan VICE:ssä. Katso
  [Kenttäeditori]{1].
- **Hahmoeditori** — kumoa/tee uudelleen, piirtotyökalut, käännä 90°,
  kopioi/liitä ja vedä vaihtaaksesi kartalla, 2×2-laatat, pienten kirjainten
  ROM-sarja, tekstin esikatselu ja alueen vienti. Katso
  [Hahmoeditori](#character-editor-charset).
- **Merkkikartta** — zoomaa 2×–24× (liukusäädin tai Ctrl+rulla)
  pikseliruudukolla, taustavärillä korkearesoluutioisessa tilassa,
  korkearesoluutioisilla merkeillä moniväritilassa ja **ECM** (tausta merkkiä
  kohden). Katso [Merkkikarttaeditori]{1].

---

## Version 2.5.6 kohokohdat

- **SID Player** — uusi työkalupalkin painike avaa kelluvan soittimen `.sid`
  (PSID / RSID) -kappaleille: soittolista, jossa on vetäminen ja pudottaminen,
  edellinen/seuraava kappale, alikappaleet, haku ja ±10 s, äänenvoimakkuus sekä
  soittolistan tallennus/avaaminen (`.sidpl`); lista ja ikkunan tila muistetaan.
  Katso [SID Player]{1].
- **VA SID Core 1.1** — sisäänrakennettu SID-emulointi (MOS 6581/8580, MOS
  6581/8580 -pohjaisella 6581-suodattimella) ja syklilukittu PSID/RSID-soitin
  (6510 CPU, CIA/VIC-ajoitus). Valitse se kohdasta **Asetukset → Yleiset →
  SID-esikatselu**; SID-soitin näyttää, mikä moottori toistetaan.
- **SID-editori** — instrumenttiparametrien säätimet, leveämpi ADSR-grafiikka,
  **MIDI-tulo**, **äänitys** seurantalaitteeseen (uusi pattern lisätään, kun
  nykyinen on täynnä), **metronomi** rytmivaloilla, **patternin poisto**,
  VA-VK:n äänenvoimakkuuden säätö ja **GoatTracker .sng-tiedoston tuonti**.
  Katso [SID-editori](#sid-editor-3-voice-tracker).
- **Ultimate Basic 1.6.4** sisältyy pakettiin.

---

## Version 2.5.5 kohokohdat

- **Korkearesoluutioeditori: pikseliruudukko ja 16× zoom** — kun **Ruudukko** on
  käytössä, 4× zoomista alkaen jokainen pikseli saa oman ruudukkoviivansa, joka
  on vahvempi merkkisolujen reunoilla ja varjostettu pysymään näkyvissä kaikilla
  16 värillä. Zoomausliukusäädin nousee nyt jopa 16×:een. Katso
  [Korkearesoluutio / Monivärinen editori]{1].
- ** Napsauta hiiren kakkospainikkeella Kopioi/Liitä-valikkoa** —
  korkearesoluutio- ja karttaeditorien näytöllä (Kopioi, Liitä, Läpinäkyvä
  liitä) ja Sprite-editorissa (Kopioi kehys, Liitä kehys, myös kehysnauhalla).
  Liittäminen aloitettiin valikon esikatselusta napsautetusta kohdasta.
- **Lukumuunnin** — sen työkalupalkin painike pysyy korostettuna, kun muunnin on
  näkyvissä.
- **Korjattu** — Hi-Res Editorin monivärinen soluruudukko oli kaksi kertaa
  leveämpi kuin merkkisolu; Hi-Res-työkalurivin **Liitä** -painike liitettiin
  aina läpinäkyvästi; SID Editorin hiiren kakkospainikkeen valikko avautui pois
  kohdistimesta, kun valintaikkuna oli keskitetty.
- **Tässä käyttöoppaassa** kuvataan nyt Hi-Res Editorin valinta,
  kopiointi/liitäminen ja läpinäkyvä liittäminen.

---

## Version 2.5.4 kohokohdat

- **Korjattu: ikkuna ei näy uudelleenkäynnistyksen yhteydessä** — jos sovellus
  suljettiin ikkuna pienennettynä tai piilotettuna (pääasiassa macOS:ssä, myös
  Linuxissa / Waylandissa), seuraava käynnistyskerta saattoi tulla ilman
  ikkunaa. Näkyvää tilaa ei enää tallenneta (ikkunan koko tallentuu edelleen),
  ja ikkuna näkyy aina käynnistyksen yhteydessä.
- **Ultimate Basic 1.6.3 mukana** — QBasic-tyylinen syntaksi: `dim-nimi
  tyyppinä` muuttujille ja kaikentyyppisille taulukoille, `funktio` / `sub`
  tyypeillä `as`, `elseif`, `do … loop`, `while … wend`, `select case`, `exit
  do` / `exit sub`, yksirivinen `if`, `'` kommentit ja `tulosta a; b; c`;
  ajonaikaiset merkkijonot (`+`, `left$` / `right$` / `mid$`) ja etumerkillinen
  16-bittinen `integer`. Korostettu, viimeistelty ja muotoiltu UB-editorissa,
  uusilla **DIM**, **FUNCTION**, **ELSEIF**, **DO**, **WEND**, **SELECT CASE**,
  **END**, **EXIT SUB** ja **LEFT$** / **RIGHT$** / **MID$** -merkinnöillä
  komentopaneelissa. Katso [UltimateBasic Mode]{1].

---

## Version 2.5.2 kohokohdat

- **SID Editorin esikatselut oikealla SID:llä** — instrumentin esikatselu,
  virtuaalinen koskettimisto, nuotin syöttö, sointu/arpeggio, rivi- ja
  yksittäisten kuvioiden toisto toistetaan WebSidin kautta; syntetisaattori jää
  vain varalta. Katso [SID Editor]{1].

---

## Version 2.5.1 kohokohdat

- **SID Editor -instrumentit** — äänikohtainen filtterien reititys, **3 OFF** ja
  resonanssikatkaisu **pyyhkäisy ** (alku, loppu, nopeus, ping-pong);
  instrumentti **vibrato** (viive, nopeus, syvyys); **pulssinleveysmodulaatio
  **; **porttiajastin **, **kova uudelleenkäynnistys ** ja ensimmäisen kehyksen
  aaltomuoto; **aalto-/arpeggio-taulukko ** esiasetuksilla; **RING** ja
  **SYNC**. Katso [SID Editor]{1].
- **Uusi SID-soitin** — viety soitin suorittaa instrumentin modulaation joka
  ruudulla (`JSR sid_frame` omaa IRQ:tasi varten); esikatselu renderöi saman
  soittimen pienen SID-syntetisaattorin kautta. `.bin` tallentaa instrumenttien
  nimet ja nopeuden.
- **Virtuaalikosketinsoittimet** — 2, 3 tai 4 oktaavia Commodore 64
  -syntetisaattorin ulkoasussa.
- **Ultimate Basic 1.6.2 mukana** — `tune` lisää `imod`, `ifilt`, `igate` ja
  `itab`; **Export to UltimateBasiciin** kirjoittaa ne.
- **Kirjanmerkit ja Siirry riville** Expert- ja Ultimate Basic -editoreissa —
  Ctrl+F2 / F2 / Shift+F2, Ctrl+G.
- **Korjattu:** otsikkolausekkeet (`.assert`, `LEVEL_MULTICOLOR*16`, `*`)
  toimivat taas asennetussa sovelluksessa (ei `eval` julkaisun CSP:n alla).

---

## Version 2.5.0 kohokohdat

- **Kenttäeditori** — uusi työkalupalkkieditori järjestää karttaeditorin näytöt
  pystysuunnassa, vaakasuunnassa tai 2D-ruudukkoon ja esikatselee koko kentän
  tasaisella vierityksellä. Katso [Kenttäeditori]{1].
- **LEVEL / LEVEL_ROW-makrot** — `.level "level.bin"[, $addr]` sijoittaa vain
  Level Editor -projektin sijoitetut näytöt sekä osoitintaulukot ja määrittelee
  `LEVEL_*`-otsikot ja vakiot; `.level_row dst, col[, color]` kopioi yhden
  40-merkkisen tasorivin puskuriin. Katso [LEVEL / LEVEL_ROW]{1].
- **JOYSTICK-muuttujatila** — `.joystick-portti, vx, vy[, fire]` kirjoittaa
  suunnan muuttujiin (−1 / 0 / +1) спрайtin siirtämisen sijaan; portti `3` lukee
  molemmat joystick-portit. Katso [JOYSTICK]{1].
- **Level scroll demo** — `samples/level-demo.asm` vierittää 2×5-kokoista
  näyttöä pikseli pikseliltä joka suuntaan joystickin avulla, repeytymättä ja
  jättäen tilaa spriteille ja pelikoodille.
- **Lukumuunnin** — ei-modaalinen DEC / HEX / BIN -valintaikkuna
  työkalupalkissa. Katso [Lukumuunnin]{1}.
- **Esimerkki-valintaikkuna** — **Valikko → Esimerkkejä…** avaa haettavan,
  luokitellun luettelon sisäänrakennetuista esimerkkiohjelmista. Katso
  [Esimerkkiohjelmat]{1}.
- **Ultimate Basic 1.6.1 mukana** — `map load "level.bin"[, addr]` lukee Level
  Editor -projektin suoraan, ja uusi `map view px, py` vierittää karttaa
  sujuvasti ja repeytymättä pikselin kohdalla (esimerkki:
  `level_scroll_demo.ub`). 16-bittisen summan sisällä olevaa tavutuloa ei enää
  katkaista 8 bittiin. UB-komentoviitauksessa luetellaan `map view`, ja sen haku
  asettaa komennon nimen osumat etusijalle.

---

## Version 2.4.9 kohokohdat

- **Projektimallit** — **Valikko → Tiedosto → Uusi projekti mallista…**, tai
  uusi työkalupalkin painike **Valikko** ja **Ohjeet** -kohtien välissä, luo
  valmiin `.proj` -projektin omaan kansioonsa. Valintaikkunassa on **Assembler**
  -osio (tyhjä ohjelma, pelirunko, palkat ja monivärinen bittikartta) ja
  **UltimateBasic** -osio (tyhjä ohjelma, pelirunko, palkat-bittikartta,
  rasteri-IRQ), joissa on syntaksin mukaan korostettu esikatselu. Omat `.asm` /
  `.ub` -mallit noudetaan käyttäjämallien kansiosta. Katso
  [Projektimallit](#level-editor).
- **Kokoontiprojekti** — **Valikko → Koonti → Koontiprojekti** kääntää kaikki
  avoimen projektin (tai avointen välilehtien) koontikelpoiset tiedostot
  `.prg`-tiedostoon lähdekoodin viereen, kirjoittaa
  virheenkorjaussymbolitiedostot, jos saatavilla, ohittaa vain sisällytettävät
  moduulit ja näyttää tiedostokohtaisen raportin. Katso [Kokoontiprojekti]{1].
- **Ctrl + hiiren rulla zoomaus** Expert- ja Ultimate Basic -editorissa (`Cmd` +
  rulla macOS:ssä; kosketuslevyn nipistys toimii myös).
- **Työtilat muistavat projektit** — Expert- ja Ultimate Basic -projektipuut,
  käynnistystiedosto ja tallentamattomat projektimuutokset tallennetaan `.vaws`
  -työtilaan ja palautetaan sen mukana. Vanhemmat työtilat ovat edelleen
  avoinna.
- **Ultimate Basic** — Mukana tuleva kääntäjä luo nopeampaa ja pienempää
  6502-koodia; muistikartta erottaa nyt todellisen koodin ja datan täyttöjen ja
  pitkien `org`-aukkojen lisäksi.
- **Tiedostovalintaikkunat alkavat aktiivisesta työkansiosta** — Block/Expert-
  tai Ultimate Basic -kansiosta nykyisestä tilasta riippuen.
- **Ultimate Basic 1.6.1 mukana** — `map load "level.bin"[, addr]` lukee Level
  Editor -projektin suoraan, ja uusi `map view px, py` vierittää karttaa
  sujuvasti ja repeytymättä pikselin kohdalla (esimerkki:
  `level_scroll_demo.ub`). 16-bittisen summan sisällä olevaa tavutuloa ei enää
  katkaista 8 bittiin. UB-komentoviitauksessa luetellaan `map view`, ja sen haku
  asettaa komennon nimen osumat etusijalle.

---

## Version 2.4.8 kohokohdat

- **Projektimallit** — **Valikko → Uusi projekti → Uusi projekti mallista…**,
  tai uusi työkalupalkin painike **Valikko** ja **Ohjeet** -kohtien välissä, luo
  valmiin `.proj` -projektin omaan kansioonsa. Valintaikkunassa on
  **Assembler**-osio (tyhjä ohjelma, pelirunko, palkat ja monivärinen
  bittikartta) ja **UltimateBasic**-osio (tyhjä ohjelma, pelirunko,
  palkat-bittikartta, rasteri-IRQ), joissa on syntaksin mukaan korostettu
  esikatselu. Omat `.asm` / `.ub` -mallit noudetaan käyttäjämallien kansiosta.
  Katso [Projektimallit](#project-templates).
- **Koalan tuonti/vienti Hires-editorissa** — **Tiedostot → Tuo Koala (.koa)…**
  / **Vie Koala (.koa)…** (vakiokokoinen 10003 tavun tiedosto;
  korkearesoluutioiset kuvat pienennetään monivärisiksi viennin yhteydessä).
  `.koa` / `.kla` tunnistetaan myös **Tuo kuva / .bin** -komennolla.
- **Ultimate Basic 1.5.9 mukana** — uusi `chain "FILE" [, laite]` (lataa toinen
  ohjelma käynnissä olevan päälle ja SUORITA se); `load "FILE"` latautuu
  tiedoston omaan osoitteeseen, `load "FILE", addr` kohteeseen `addr`; D64
  korjaukset. `chain` on korostettu ja lueteltu komentoviitteessä.
- **Päivityksen tila asiantuntijan tilapalkissa** — sama *Ajan tasalla* /
  klikattava *Päivitys saatavilla* -ilmaisin kuin Ultimate Basic -tilassa.
- **Tallennusikkunat** tarjoavat tiedostolle oman tyypin (esim. *KOA*) tyypin
  *Binary (\*.bin)* sijaan.
- **Vankempi päivitysten tarkistus** — asennusohjelmien luettelo julkaistaan
  osoitteessa c64va.tech/downloads/VA/, joten tarkistus toimii uuden lataussivun
  kanssa; Linuxin päivitysavustaja ei enää peri AppImage-kirjastopolkuja.

---

## Version 2.4.7 kohokohdat

- **Sovelluksen sisäiset päivitykset** — **Valikko → Tarkista päivitykset**
  tarkistaa c64va.tech-sivustolta uudemman version ja lataa vahvistuksen jälkeen
  alustallesi sopivan asennusohjelman edistymispalkilla ja asentaa sen. Katso
  [Sovelluksen sisäiset päivitykset](#koala). Tarkistus suoritetaan myös
  hiljaisesti jokaisen käynnistyksen yhteydessä.
- **Päivityksen tila Ultimate Basicin tilarivillä** — näyttää **Päivitetty
  (vX)** tai korostetun **Päivitys saatavilla: vY**, joka avaa päivitysikkunan
  napsautettaessa.
- **Käyräeditori → UltimateBasic-vienti** — **Tiedostot → Vie
  UltimateBasic-muotoon** kirjoittaa taulukon alustettuna UB-taulukkona;
  **Tiedostot → Vie UltimateBasic-demo** tuottaa käyttövalmiin UB-sprite-demon.
  Katso [Käyräeditori]{1].
- **Ultimate Basic 1.5.8 mukana** — uusi **`data <taulukko>: v, …`** -lomake
  täyttää ilmoitetun `taulukko` / `taulukko_sana` -taulukon ohjelman
  käynnistyessä (jatkossa rivit jatkuvat edelliseen, sanataulukot ottavat
  16-bittisiä arvoja) koskematta `read` -virtaan.
- **Asettelu mukautuu ikkunaan** — editoripaneelit ottavat täsmälleen jäljellä
  olevan ikkunan korkeuden, joten sovellus ei enää näytä sivutason
  pystysuuntaista vierityspalkkia; ASM-tulostuspaneelin vähimmäisleveys on 440
  pikseliä; työkansion polku sijaitsee hienovaraisessa merkissä ASM-näkymän
  otsikon yläpuolella ja käyttää samaa merkkiä sekä Expert- että Ultimate Basic
  -työkaluriveillä. Valintaikkunoiden painikkeiden otsikot eivät enää rivity.
- **Vankempi päivitysten tarkistus** — asennusohjelmien luettelo julkaistaan
  osoitteessa c64va.pro/downloads/VA/, joten tarkistus toimii uuden lataussivun
  kanssa; Linuxin päivitysavustaja ei enää peri AppImage-kirjastopolkuja.

---

## Version 2.4.6 kohokohdat

- **Sovelluksen sisäiset päivitykset** — **Valikko → Tarkista päivitykset**
  tarkistaa c64va.pro:sta uudemman version ja lataa vahvistuksen jälkeen
  alustallesi sopivan asennusohjelman edistymispalkilla ja asentaa sen. Katso
  [Sovelluksen sisäiset päivitykset](#in-app-updates). Tarkistus suoritetaan
  myös hiljaisesti jokaisen käynnistyksen yhteydessä.
- **Ultimate Basic -kielipäivitys** — syntaksin korostus ja komentojen viite
  kattavat nyt **`sfx`** (ei-estävä SID-vaikutus: `sfx channel, freq, freqs [,
  wave]`), **`org`** (jatkaa sub/fn-koodia osoitteessa jättäen nollalla täytetyn
  aukon, johon mahtuu `incbin` data), **`charset on` / `charset off`** (vaihtaa
  VIC-II:n RAM-merkistölle ja takaisin) ja **`incbin` slicing** (`incbin
  "font.prg", $3C00, 2` ohittaa ensimmäiset tavut, valinnainen neljäs argumentti
  rajoittaa pituutta).
- **Usean lohkon korostus ASM-näkymässä** — useiden lohkojen valitseminen
  korostaa kaikki niiden ASM-rivit kerralla, vierityskohta pysyy vakaana
  valinnan aikana ja rivinumerot ovat pehmeämpiä hienovaraisen pystysuoran
  erotinviivan ansiosta.
- **Assembler-tila säilytetty Ultimate Basicin kytkimissä** — projektin tai
  sisäänrakennetun esimerkin avaaminen Ultimate Basicin ollessa aktiivinen
  jättää nyt UB:n etusijalle ja palauttaa viimeisimpään Block/Expert-tilaan,
  joten UB-puskuri ei voi enää korvata uuden välilehden tilaa tai otsikkoa.
  Uudet välilehdet luodaan oikeassa tilassa.
- **Kung Fu Flash 2 -asetukset** — Laitteistoasetuksissa oleva **Detect USB**
  -painike etsii uudelleen äänikasetin sarjaportin, ja KFF2-edellytykset
  ilmoittavat nyt vaaditun Kung Fu Flash -laiteohjelmiston (v2.07+).
- **Ultimate Basic -komentoviite** — `tune` ja `music` näyttävät täydelliset
  esimerkit kommentoituina (solumuoto, tehosteet, soittajan muistiinpanot,
  `musiikin toisto N`); `inst`, `order`, `pat` ja tune `speed` -komennoilla on
  omat merkintänsä; `data` näyttää uuden taulukkomuodon; `load sid` -syntaksi on
  korjattu (`load sid "tune.sid", $2000`).

---

## Version 2.4.5 kohokohdat

- **Kung Fu Flash 2 -tuki — suorita ohjelmiasi oikealla Commodore 64/128:lla.**
  Uusi **Kung Fu Flash 2** -merkintä jaetussa **Suorita** -valikossa kääntää
  ohjelman ja lataa sen USB:n kautta suoraan oikeaan, käynnissä olevaan C64:ään
  (tai C128:aan), jossa on Kung Fu Flash 2 -kasetti — ei levykuvaa, ei SD-kortin
  kopiointia, ei emulaattoria. Se toimii Block-, Expert- ja Ultimate Basic
  -tiloissa. Kasetin USB-sarjaportti tunnistetaan automaattisesti (ja se voidaan
  kirjoittaa käsin); katso asennusohjeet ja tarkka työnkulku kohdasta [Kung Fu
  Flash 2]{1}.
- **Muokattavat ohjelma-/ASM-paneelit** — Ohjelma-paneelin ja
  ASM/Output-paneelin välissä on ohut pystysuora jakaja, jonka avulla voit vetää
  rajaa vasemmalle tai oikealle (vähintään 260 pikseliä paneelia kohden).
  Nuolinäppäimillä voit siirtää sitä, kaksoisnapsauttamalla voit palauttaa sen
  50/50-jakoon, ja sijainti muistetaan istuntojen välillä. Jakaja on piilotettu
  Expert- ja Ultimate Basic -tiloissa sekä kapeassa pinotussa asettelussa.
- **Siiveämmät makrorivit ASM-näkymässä** — makrolohkot luetellaan nyt ilman
  edeltävää kommenttimerkkiä (`.print "HELLO"`, `.if A == 1`, `.sprite_init …` `
  sijaan; .print …`), ja ASM-syntaksin korostus värittää ne makroiksi.
  Tavalliset KOMMENTTIlohkot ja aluemerkit alkavat edelleen merkeillä `;`.
- **Mukautettu makrojen korostus asiantuntijaeditorissa** — makron nimellä
  `.macro`-, `.invoke`- ja `.call`-kutsujen (ja Kick-tyylisten
  `:name(...)`-kutsujen) jälkeen on oma värinsä, samoin kuin
  `{param}`-korvauksilla makron rungon sisällä ja parametrien nimillä
  `.macro`-otsikossa jokaisessa teemassa.
- **Päivitetty Tietoja-valintaikkuna** — leveämpi kaksisarakkeinen asettelu,
  jossa on ryhmitellyt projekti-, lisenssi- ja tekijälinkit, ja Ultimate Basic
  -bannerissa on nyt läpinäkyvä tausta, joten se sulautuu kaikkiin teemoihin.

---

## Version 2.4.3 kohokohdat

- **SID-editori: Kappale-/järjestyslista** — kuviot on nyt järjestetty
  varsinaisen kappale-/järjestyslistan avulla raakakuviopankin päälle, joten
  kuvio voi toistua ja kappale voi olla pidempi kuin tallennettujen kuvioiden
  lukumäärä. Lisää, poista ja järjestele vaiheita uudelleen suoraan
  SID-editorista; sekä toisto että viety soitin käyvät läpi tämän listan
  raakakuviojärjestyksen sijaan.
- **SID-editori: Efektisarake** — jokainen seurantasolu voi nyt sisältää efektin
  nuotin rinnalla: **V**ibrato, slide **U**p / **D**own, note-**C**ut ja
  nopeudenmuutos (**F**). Kirjoita se suoraan soluun, esim. `C-4 01 V24` (nuotti
  + instrumentti + vibrato) tai `F06` (vain nopeudenmuutos). Efektit toimivat
  kerran riviä kohden, vastaavat vietyä soitinta, ja toistuvat nyt oikein sekä
  sovelluksen sisäisessä Web Audio -esikatselussa että käännetyssä
  6502-viennissä — todellinen, pelattava efektimoottori, ei vain
  vientitelineitä.
- **Taaksepäin yhteensopiva SID-tallennusmuoto** — SID-tallennuksissa on nyt
  versiomerkintä, joten vanhemmissa `.bin`-tallennuksissa, jotka on tehty ennen
  tehostesarakkeen olemassaoloa, latautuvat täsmälleen kuten ennenkin, tehosteet
  puuttuvat kokonaan.
- **D64-editori: eksplisiittinen tallennustyönkulku** — jokainen muokkaus
  (lisääminen/poistaminen/uudelleennimeäminen/poistaminen ja nyt myös
  lohkoeditorin tavumuokkaukset) tehdään yksityiseen työkopioon; mikään ei koske
  varsinaiseen `.d64`-tiedostoosi, ennen kuin napsautat **Tallenna**
  -painiketta, joka myös kirjoittaa ensin automaattisen varmuuskopion. Editorin
  sulkeminen tai toisen levyn avaaminen, jolla on tallentamattomia muutoksia,
  pyytää nyt vahvistusta sen sijaan, että ne hylättäisiin hiljaisesti.
- **D64 Editori: Lohkoeditorin heksaruudukko** — valitun 256-tavuisen lohkon
  raakatavunäkymä on nyt oikeana tavukohtaisena heksaruudukkona pelkän
  tekstiruudun sijaan, eikä sen valintaikkuna enää himmenna muuta sovellusta sen
  takana ollessaan avoinna.
- **Web64 tuotesivustolla** — uusi Web64 IDE -osio osoitteessa
  [c64va.pro](https://www.c64va.pro).
- **Esimerkkipäivitys** — `makro-parametrilla` -esimerkki käyttää nyt sulkeissa
  olevaa `.macro setColor(color)` -muotoa.

---

## Version 2.4.2 kohokohdat

- **Raahaa ja pudota D64-editoriin** — pudota käännetty `.prg`/`.bin` -tiedosto
  (SID/sprite/char-editorien vienneistä tai mistä tahansa muualta) suoraan
  levykuvalle; Lisää-paneeli avautuu esitäytettynä. Useiden tiedostojen
  pudottaminen kerralla asettaa ne jonoon peräkkäin.
- **Luo sisällytystiedosto** — uusi työkalupalkin painike kirjoittaa
  `.inc`-tiedoston, jossa luetellaan `.const NIMI = $OSOITE` jokaista levyllä
  olevaa merkintää kohden, jotta pääohjelma voi viitata kunkin merkinnän
  sijaintiin kirjoittamatta osoitteita uudelleen käsin.
- **Lohkoeditori (uusi)** — työkalupalkin vaihtokytkin vaihtaa D64-editorin
  raa'alle raita-/sektorikäytölle hakemiston alapuolella: napsautettava
  lohkokartta (väritetty BAM:n vapaan/käytetyn bittikartan mukaan, jossa BAM ja
  hakemistoketju on merkitty erikseen), heksadesimaalinen näkymä/editori
  valitulle 256-tavuiselle lohkolle ja edellinen/seuraava sektorinavigointi.
  Lukee ja kirjoittaa levykuvan suoraan (`read_bin_file`/`write_bin_file`),
  riippumatta `c1541`:stä.
- **D64-editori: eksplisiittinen tallennustyönkulku** — jokainen muokkaus
  (lisääminen/poistaminen/uudelleennimeäminen/poistaminen ja nyt myös
  lohkoeditorin tavumuokkaukset) tehdään yksityiseen työkopioon; mikään ei koske
  varsinaiseen `.d64`-tiedostoosi, ennen kuin napsautat **Tallenna**
  -painiketta, joka myös kirjoittaa ensin automaattisen varmuuskopion. Editorin
  sulkeminen tai toisen levyn avaaminen, jolla on tallentamattomia muutoksia,
  pyytää nyt vahvistusta sen sijaan, että ne hylättäisiin hiljaisesti.
- **D64 Editori: Lohkoeditorin heksaruudukko** — valitun 256-tavuisen lohkon
  raakatavunäkymä on nyt oikeana tavukohtaisena heksaruudukkona pelkän
  tekstiruudun sijaan, eikä sen valintaikkuna enää himmenna muuta sovellusta sen
  takana ollessaan avoinna.

---

## Version 2.4.1 kohokohdat

- **Puolan ja italian käyttöliittymäkielet** — täydellinen käyttöliittymän
  käännös (valikot, valintaikkunat, muistisääntökuvaukset, Ultimate Basic
  -komentoluettelo) olemassa olevien unkarin, englannin, espanjan, saksan ja
  hollannin rinnalle.
- **Online-ohjeen työkalupalkin painike** — uusi kuvakepainike, joka avautuu
  Debugin jälkeen ja avaa monikielisen dokumentaatiosivuston
  ([c64va.tech/docs.html]{1}) suoraan sovelluksesta.
- **Keskitetyt muistisääntökuvaukset:** kielikohtaisia muistisääntökuvauksia
  siirrettiin jaettuun käännöstiedostoon muiden käyttöliittymämerkkijonojen
  rinnalle. Korjaa myös pitkäaikaisen virheen, jossa kielten `PRINT`,
  `PRINT_HEX`, `CLEAR_SCREEN`, `WAIT_KEY`, `SET_BORDER`, `SET_BG`, `IRQ_SETUP`
  ja `RAND` englanninkieliset kuvaukset korvattiin hiljaisesti jäljelle
  jääneellä espanjankielisellä tekstillä.

---

## Version 2.4.0 kohokohdat

- **D64-editori** — täysimittainen levykuvaselain työkalupalkissa (käyräeditorin
  jälkeen). Avaa olemassa oleva `.d64`, luo uusi tyhjä levy tai käynnistä
  nykyinen levy suoraan VICE-ohjelmaan. Kaikki tämä Tiedostot ▾ -valikosta, joka
  vastaa muita visuaalisia editoreita. Katso [D64-editori (olemassa olevan
  levykuvan selaaminen ja muokkaaminen)]{1}.
- **Online-ohjeen työkalupalkin painike** — uusi kuvakepainike, joka avautuu
  Debugin jälkeen ja avaa monikielisen dokumentaatiosivuston
  ([c64va.pro/docs.html](https://www.c64va.pro/docs.html)) suoraan
  sovelluksesta.
- **Latausosoite, purkuosoite ja Exomizer D64-editorissa** — otsikottoman
  raakatiedoston lisääminen antaa sinulle mahdollisuuden asettaa valinnaisen
  latausosoitteen, Exomizer-purkukohteen ja pakata sen matkan varrella
  käyttämällä samoja `mem`/`sfx` -tiivistystiloja kuin Vie D64:ään
  -valintaikkunan lisätiedostot. Tiedostossa `.prg`, jolla on jo oma otsikko,
  nämä kentät ohitetaan kokonaan.

---

## Version 2.3.9 kohokohdat

- **`*` missä tahansa lausekkeessa** — ohjelmalaskurisymboli toimii nyt
  operandilausekkeiden sisällä, ei vain yksinään: `BNE *-5`, `JMP *+20`, `LDA
  #<*`, `LDA #>(*+63)`. Arvoa seuraava `*` (`STRIDE*2`) on edelleen kertolasku.
  Katso [Osoitetilat → Ohjelmalaskuri `*`
  lausekkeissa](#d64-editor-browse--edit-an-existing-disk-image).
- **Paikalliset (pisteviivalla varustetut) otsikot** — otsikko, kuten `.loop`,
  kuuluu lähimpänä olevan edeltävän *global* (ei-pisteviivalla varustetun)
  otsikon piiriin, joten `DrawSprite` ja `ClearScreen` voivat kumpikin määrittää
  oman `.loop`-otsikkonsa ilman törmäystä. Katso [Paikalliset (pisteviivalla
  varustetut) otsikot]{1].
- **Pitkän haaran pseudo-operaatiot** — `LBNE`, `LBEQ`, `LBCC`, `LBCS`, `LBMI`,
  `LBPL`, `LBVC`, `LBVS` kokoavat käänteiseksi haaraksi `JMP`-haaran yli (aina 5
  tavua), joten kohde voi olla millä tahansa etäisyydellä. Uusi **Pitkät
  haarat** -palettiluokka. Katso [LBNE / LBEQ / … (Pitkät haarat)]{1}.
- **`.assert` direktiivi** — `.assert loppu - alku <= 256` tai `.assert * <
  $A000, "viesti"` arvioidaan kokoonpanovaiheessa ja kääntäminen epäonnistuu
  (näyttäen todellisen arvon), kun lauseke on epätosi. Katso [.ASSERT]{1}.
- **Itsemuokkaavan koodin operandin nimikkeet** — `LDA-arvo:#$00` määrittää
  nimikkeen `arvo`, joka osoittaa käskyn operanditavuun, joten `STA-arvo` korjaa
  sen suoraan. Katso [Itsemuokkaavan koodin operandin nimikkeet]{1}.
- **Ystävällisemmät kantaman ulkopuoliset haaravirheet** — haara, joka laskeutuu
  −128…+127:n ulkopuolelle, raportoi nyt tarkalleen, kuinka paljon se ylittää
  alueen ja ehdottaa vastaavaa `LBxx` pitkää haaraa.
- **Parannettu:** vaalean teeman tilanilmaisintyökalurivin merkki (LOHKOTILA /
  ASIANTUNTIJATILA / …) on tummempi ja helpommin luettava, ja sen hohtava
  animaatio on jälleen näkyvissä.

---

## 1. Käyttöliittymän yleiskatsaus

Sovellus on jaettu kolmeen pääpaneeliin:

- **`*` missä tahansa lausekkeessa** — ohjelmalaskurisymboli toimii nyt
  operandilausekkeiden sisällä, ei vain yksinään: `BNE *-5`, `JMP *+20`, `LDA
  #<*`, `LDA #>(*+63)`. Arvoa seuraava `*` (`STRIDE*2`) on edelleen kertolasku.
  Katso [Osoitetilat → Ohjelmalaskuri `*`
  lausekkeissa](#the--program-counter-in-expressions).
- **Paikalliset (pisteviivalla varustetut) otsikot** — otsikko, kuten `.loop`,
  kuuluu lähimpänä olevan edeltävän *global* (ei-pisteviivalla varustetun)
  otsikon piiriin, joten `DrawSprite` ja `ClearScreen` voivat kumpikin määrittää
  oman `.loop`-otsikkonsa ilman törmäystä. Katso [Paikalliset (pisteviivalla
  varustetut) otsikot]{1].
- **Pitkän haaran pseudo-operaatiot** — `LBNE`, `LBEQ`, `LBCC`, `LBCS`, `LBMI`,
  `LBPL`, `LBVC`, `LBVS` kokoavat käänteiseksi haaraksi `JMP`-haaran yli (aina 5
  tavua), joten kohde voi olla millä tahansa etäisyydellä. Uusi **Pitkät
  haarat** -palettiluokka. Katso [LBNE / LBEQ / … (Pitkät
  haarat)](#lbne--lbeq---long-branches).
- **`.assert` direktiivi** — `.assert loppu - alku <= 256` tai `.assert * <
  $A000, "viesti"` arvioidaan kokoonpanovaiheessa ja kääntäminen epäonnistuu
  (näyttäen todellisen arvon), kun lauseke on epätosi. Katso [.ASSERT](#assert).
- **Itsemuokkaavan koodin operandin nimikkeet** — `LDA-arvo:#$00` määrittää
  nimikkeen `arvo`, joka osoittaa käskyn operanditavuun, joten `STA-arvo` korjaa
  sen suoraan. Katso [Itsemuokkaavan koodin operandin
  nimikkeet](#self-modifying-code-operand-labels).
- **Ystävällisemmät kantaman ulkopuoliset haaravirheet** — haara, joka laskeutuu
  −128…+127:n ulkopuolelle, raportoi nyt tarkalleen, kuinka paljon se ylittää
  alueen ja ehdottaa vastaavaa `LBxx` pitkää haaraa.

---

## 2. Lohkopaletti

Vasemmalla olevassa paletissa luetellaan kaikki käytettävissä olevat lohkot
luokittain ryhmiteltyinä:

| Paneeli              | Kuvaus                                                                      |
| -------------------- | --------------------------------------------------------------------------- |
| **Vasen — Paletti**  | Kaikki saatavilla olevat käsky- ja makrolohkot. Hae tai selaa luokittain.   |
| **Keskus — Ohjelma** | Ohjelmasi. Vedä lohkoja tänne, järjestele ne uudelleen, muokkaa operandeja. |
| **Oikea — Lähtö**    | Reaaliaikainen ASM-näkymä ja/tai muistinvalvonnan lähtö.                    |

Käytä paletin yläosassa olevaa **hakukenttää** suodattaaksesi nimen mukaan.
Napsauta **Lisää valittu lohko** -painiketta tai vedä lohko ohjelma-alueelle.

Lohkotilassa Program (Ohjelma)- ja Output (Tulos) -paneelien välissä on ohut
**pystysuora jakaja**. Vedä sitä antaaksesi kummallekin paneelille lisää tilaa
(kummallekin vähintään 260 pikseliä), siirrä sitä 16 pikselin välein ← / →
-näppäimillä tai kaksoisnapsauta sitä palauttaaksesi jaon arvoon 50/50. Sijainti
tallennetaan käyttöliittymän asetuksiin. Jakaja on piilossa Expert- ja Ultimate
Basic -tiloissa sekä silloin, kun ikkuna on riittävän kapea paneelien
pinoamiseen.

---

## 3. Ohjelma-alue

Vasemmalla olevassa paletissa luetellaan kaikki käytettävissä olevat lohkot
luokittain ryhmiteltyinä:

- **Vedä ja pudota** lohkoja paletista tai **järjestä uudelleen** olemassa
  olevia lohkoja vetämällä niiden kahvasta (≡).
- Jokainen lohko näyttää sen **mnemonisen**, **operandikentän** ja
  **osoitustilan valitsimen** (jos sovellettavissa).
- Napsauta **▸ / ▾** -painiketta lohkon kutistamiseksi tai laajentamiseksi.
- Poista lohko painamalla **× (poista)** -painiketta.
- **Keskeytä kaikki** -painike taittaa kaikki lohkot kerralla.
- **Rekisteritoiminnot** — TAX, TAY, INX, DEX, …
- **Siirto ja kierto** — ASL, LSR, ROL, ROR
- **Pino** — PHA, PHP, PLA, PLP
- **Järjestelmä** — CLC, SEC, NOP, BRK, …
- **Luvattomat ohjeet** — LAX, SAX, DCP, …
- **Rakenne** — MERKKI, KOMMENTTI, ALUE, LOPPUALUE
- **Makrot** — SILMUKKA, NEXT, FOR, ENDF, PUSH, PULL, END, TEXT, BYTE, WORD,
  FILL, ALIGN, ASSERT, STRING, DATA, RAWBYTES, RAWTEXT, PETSCII, CHARSET,
  INCBIN, SID, INCLUDE, TABLE, ORG, MACRO, ENDM, INVOKE, IF, ELSE, ENDIF, VAR,
  WHILE, ENDW, REPEAT, UNTIL, MEMCPY, MEMSET, PRINT, PRINT_CHAR, PRINT_HEX,
  CLEAR_SCREEN, WAIT_KEY, DELAY, SET_BORDER, SET_BG, IRQ_SETUP, RAND,
  SPRITE_INIT, SPRITE_POS, WAIT_RASTER, JOYSTICK, MOUSE, SPRITE_COL, LOADFILE,
  REU_CHECK, REU_STASH, REU_FETCH, REU_SWAP, TURBO_SET, SUPERCPU_DETECT,
  TURBO_ENABLE, MAP_COPY, MAP_COPY16X16, SPRITE_ANIM, SCORE_BCD

Käytä paletin yläosassa olevaa **hakukenttää** suodattaaksesi nimen mukaan.
Napsauta **Lisää valittu lohko** -painiketta tai vedä lohko ohjelma-alueelle.

### Operandikentän parametrit

Jokainen parametrilohko ottaa ne **operandikenttään** ennen **Add**-komentoa.
Käskyn tapauksessa se on operandi (`06`, jos kyseessä on `LDA #$06`); TEXT-,
BYTE-, LABEL-, REGION- ja muiden teksti- tai listamakrojen tapauksessa se on
niiden teksti tai arvo; kaikkien muiden makrojen tapauksessa se on se, mikä
seuraa niiden avainsanaa Expert-tilassa:

| Lohko      | Operandikenttä   | Tulee                    |
| ---------- | ---------------- | ------------------------ |
| SET_BG     | `06 dollaria`    | `.set_bg $06`            |
| ALUE       | `Pääasiallinen`  | `.alue Pää`              |
| ORG        | `$C000`          | `* = $C000`              |
| SPRITE_POS | `1, 200, 50`     | `.sprite_pos 1, 200, 50` |
| SILMUKKA   | `Y, $05, myloop` | `.loop Y, $05, myloop`   |

Kenttä näyttää makron oletusparametrit vihjeenä. Lohkot, joilla ei ole
parametreja (ENDREGION, ELSE …), ja tiedostomakrot (INCBIN, KOALA, LEVEL, SID,
INCLUDE – ne valitsevat tiedostonsa lohkosta) pitävät kentän pois käytöstä.

---

## 4. ASM-näkymä

- **Vedä ja pudota** lohkoja paletista tai **järjestä uudelleen** olemassa
  olevia lohkoja vetämällä niiden kahvasta (≡).
- Jokainen lohko näyttää sen **mnemonisen **, **operandikentän ** ja
  **osoitustilan valitsimen ** (jos sovellettavissa).
- Napsauta **▸ / ▾** -painiketta lohkon kutistamiseksi tai laajentamiseksi.
- Poista lohko painamalla **× (poista)** -painiketta.
- **Keskeytä kaikki** -painike taittaa kaikki lohkot kerralla.

### Lähtötilat

Makrolohkot näkyvät ASM- ja molemmissa näkymissä tavallisina makroriveinä ilman
kommenttimerkkiä (`.print "HELLO"`, `.wait_raster $FF`, `.invoke
setColor(blue)`) ja ne on väritetty makrojen mukaisesti; vain todelliset
KOMMENTTIlohkot, aluemerkit ja varoitukset säilyttävät johtavan `;`.

| Palkin väri  | Kuvaus                                                                                                                                                                                                                                                                                                                        |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Syaani       | 6502 kokoonpanolähde osoitteineen ja nimikkeineen                                                                                                                                                                                                                                                                             |
| **Näyttö**   | Heksa-/tavuvedos (C64-monitorityyli)                                                                                                                                                                                                                                                                                          |
| **Disasm**   | Pure 6502 -järjestelmän purkaminen: osoite · heksatavut · muistisäännöt ratkaistuilla numeerisilla operandeilla. Makrot on laajennettu yksittäisiksi käskyiksi (TEXT → LDA/STA-parit, LOOP → LDX jne.). BYTE/WORD/FILL-data näytetään lohkoina heksavedoksena. Tulosteessa ei ole makrojen nimiä, kommentteja tai merkintöjä. |
| **Molemmat** | ASM ylhäällä, näyttö alhaalla                                                                                                                                                                                                                                                                                                 |
| **Purkaja**  | Sama kuin Disasm — oma välilehti purkamisnäkymälle                                                                                                                                                                                                                                                                            |

Kutistetut lohkot renderöidään pienemmällä läpinäkyvyydellä. Napsauta tai vedä
mitä tahansa kohtaa minikartalla vierittääksesi ohjelmaluetteloa kyseiseen
kohtaan. Näkymäikkunan osoitin (korostusvärinen suorakulmio) seuraa luettelon
näkyvää osaa. Tila säilytetään käyttöliittymäasetuksissa
(`blockMinimap`-näppäin).

### Työkalupakki-välilehti

- Haarautumis-/hyppyohjeille (`BNE`, `JMP`, `JSR` jne.) ilmestyy
  **otsikkovalitsin** -alasvetovalikko – napsauta määritettyä otsikkoa
  lisätäksesi sen.
- Numeromuotoilu seuraa työkalupalkin **HEX / DEC** -kytkintä (katso kohta 5).

---

## 5. Asetukset ja työkalupalkki

Oikea paneeli näyttää tuotetun tuotoksen reaaliajassa.

### Projektin tilannevedokset

| Tila               | Kuvaus                                                                                                                                                                                                                                                                                                                        |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ASM**            | 6502 kokoonpanolähde osoitteineen ja nimikkeineen                                                                                                                                                                                                                                                                             |
| **Näyttö**         | Heksa-/tavuvedos (C64-monitorityyli)                                                                                                                                                                                                                                                                                          |
| **Purkaja**        | Pure 6502 -järjestelmän purkaminen: osoite · heksatavut · muistisäännöt ratkaistuilla numeerisilla operandeilla. Makrot on laajennettu yksittäisiksi käskyiksi (TEXT → LDA/STA-parit, LOOP → LDX jne.). BYTE/WORD/FILL-data näytetään lohkoina heksavedoksena. Tulosteessa ei ole makrojen nimiä, kommentteja tai merkintöjä. |
| Molemmat           | ASM ylhäällä, näyttö alhaalla                                                                                                                                                                                                                                                                                                 |
| **Työkalupaketti** | C64-viitepaneeli: 16-värinen palettimalli + PETSCII-ohjauskoodi ja tulostettava merkkiluettelo. Vain luku - lisätietoja alla olevasta "Työkalupaketti-välilehti"-osiosta.                                                                                                                                                     |

Projektin tilannevedokset tallennetaan levylle sidecar-JSON-tiedostoina, eivätkä
localStorage-tallennustilaan. Ne on sidottu nykyiseen projektitiedostoon, jos
sellainen on olemassa, joten historia säilyy uudelleenkäynnistyksen jälkeen ja
seuraa projektia.

### Sovelluksen sisäiset päivitykset

**Valikko → Tarkista päivitykset** etsii uusimman version c64va.tech-sivustolta
(se lukee alustasi latauslinkit) ja vertaa sitä käynnissä olevaan versioon:

| Osa         | Mitä tapahtuu                                                                                                                                                                                               |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Windows** | Asennusohjelma toimii passiivisessa tilassa (vain edistyminen) ja käynnistää uuden version, kun se on valmis. Konekohtainen asennus pyytää järjestelmänvalvojan oikeuksia (UAC).                            |
| **macOS**   | DMG liitetään ja sovelluspaketti korvataan paikalleen, minkä jälkeen uusi versio käynnistyy. Jos sovelluskansioon ei voi kirjoittaa, DMG yksinkertaisesti avataan, jotta voit vetää sovelluksen sen päälle. |

Latauksen jälkeen sovellus asentaa päivityksen ja käynnistyy uudelleen:

**Expert-tilassa** ja **UltimateBasic-tilassa** sama Toolkit avautuu **Toolkit**
-työkalurivin painikkeesta: Expert-tilassa sivupaneelina Purkaminen /
Monitor-kohdan vieressä (vedä sen vasemmalla puolella olevaa jakajaa
muuttaaksesi sen kokoa), UB-tilassa oikeanpuoleisessa ruudussa, jossa se
vuorottelee Purkamisen ja Monitorin kanssa. Avoinnaolo ja sen leveys muistetaan.

### Käännä tiedot ja tulostusasetukset

- **Käännöstiedot** (tulosteen yläpuolella) näyttää yhteenvedon käännetystä
  ohjelmasta: koodin aloitusosoitteen, koon ja BASIC SYS -tynkän.
- Ohjelman aloitusosoite asetetaan **ORG**-lohkolla (`* = $C000`): ensimmäinen
  ORG on latausosoite, muut ORG:t aloittavat lisää osioita muista osoitteista.
- Tulosteasetukset löytyvät kohdasta **Asetukset → Yleiset → ASM-tuloste**:
  **Makron lähde** (makromääritelmät MACRO…ENDM näyttävät lähteensä
  ASM-näkymässä), **Näytä alueen kommentit**, **Näytä muistikerrokset** ja
  **Näytä muistipaneeli**.
- RetroDebugger-liput (`-jmp`, `-unpause`, `-wait`) löytyvät kohdasta
  **Asetukset → Yleiset → RetroDebugger** — katso [Debugger-liput]{1].

### Projektimallit

**Valikko → Tiedosto → Uusi projekti mallipohjasta…** — tai työkalupalkin
painike **Valikko** ja **Ohjeet** välissä — avaa mallipohjavalintaikkunan:

### Rakennusprojekti

**Valikko → Rakenna → Rakenna projekti** kääntää koko projektin yhdessä
vaiheessa. Avoimen `.proj`-projektin tiedostot rakennetaan — tai ilman
projektia, avoimen tiedoston välilehdet:

- Jokainen rakennettava lähdekoodi (`.asm`, lohko `.json`, `.ub`) käännetään
  `.prg` **-tiedostoon samannimisen lähdekoodinsa** viereen; kun **Run with
  Exomizer** on käytössä, tuloste analysoidaan;
- **Vie ASM** (Ohjelmavalikko) kopioi silti puhtaan lähdekoodin **ilman**
  rivinumeroiden etuliitteitä.

### Esimerkkiohjelmia

**Valikko → Esimerkkejä…** avaa esimerkkiselaimen: sisäänrakennetut
esimerkkiohjelmat ryhmiteltyinä aiheen mukaan (Perusteet, Makrot ja ohjaus,
Grafiikka, Spritet ja syöttö, Tiedostot ja lataus, Musiikki, IRQ ja laitteisto)
kahdessa sarakkeessa.

- **Suorita** (VICE, D64, C64 Ultimate, Ultimate emulator, Kung Fu Flash 2) —
  PRG:n rakentaminen ja käynnistäminen.
- **Debug** — PRG:n rakentaminen ja RetroDebuggerin käynnistäminen.
- **Rakenna projekti**, **Rakenna D64** ja **Exomizer** pakkaus.

Palkin alla oleva rivi nimeää käynnissä olevan vaiheen tiedostoineen —
esimerkiksi *Kick: main.asm:n esikäsittely (14 tiedostoa)…*, *VMA (Rust):
main.asm:n kääntäminen…*, *PRG valmis: 2061 tavua tiedostosta $0801*, *Exomizer:
pakkaaminen …*, *VICE: käynnistys …*. Modaaliikkuna sulkeutuu automaattisesti,
kun toiminto on valmis tai epäonnistuu.

---

## UltimateBasic-tila

| Ohjaus                                                                                                 | Kuvaus                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Lukukanta (HEX / DEC / BIN)**                                                                        | Määrittää käyttöliittymän operandien näyttö-/syöttömuodon. BIN-tila näyttää arvot binäärimuotoisina, ja sen etuliite on `%` (esim. `%11111000`). ASM-näkymässä jokainen lohko näkyy aina omassa muodossaan.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Kieli**                                                                                              | Vaihda käyttöliittymän kieleksi englanti, unkari, espanja, saksa, hollanti (Nederlands), puola ja italia (**Valikko → Asetukset**)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Teema**                                                                                              | Vaalea / Tumma / OLED / Musta / Commodore 77 / Commodore Starlight / Commodore Beige / Commodore 64 — valitse teemavalitsimesta kohdassa **Valikko → Näytä**. OLED käyttää puhtaan mustaa taustaa AMOLED-näytöissä. Commodore 77 on neonkeltainen mustalla pohjalla -teema; kun se on aktiivinen teema, käynnistyspaneeli käyttää teeman paneelin väriä (vastaa viestikorttia), näyttää pienemmän Commodore 77 -logon ja keltaisen edistymispalkin. Commodore Starlight on vaalea teema läpikuultavan C64-leipälaatikon mukaan: himmeät kirkkaat lasipaneelit, joissa on sateenkaaren RGB-hehku, magenta-aksentti, sateenkaaren syntaksin värit ja savunharmaa näyttönäkymä. Commodore Beige on klassinen leipälaatikko: beigenvärinen kotelo, sinapinkeltaiset toimintonäppäimet, sateenkaarenväriset rintaraidat ja C64:n sininen näyttö näyttönäkymässä. Joulukuussa valitsimessa on tarjolla myös joulu (yönsininen, männynvihreä ja valkoinen, jokainen aksentti koristeen värissä); Sen jälkeen sovellus palaa edelliseen teemaan. Valittu teema otetaan käyttöön ennen ensimmäistä maalausta seuraavalla käynnistyskerralla. |
| **CRT-retrotila**                                                                                      | Ottaa käyttöön koko näytön CRT-suodattimen: skannausviivat, fosforivinjetointi, välkkyminen ja tynnyrivääristymä. Tila tallennetaan istuntojen välillä.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Näytä muistipaneeli**                                                                                | Globaali kytkin (**Asetukset → Yleiset → ASM-lähtö**), joka näyttää tai piilottaa koko C64-muistipaneelin                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **PERUSJÄRJESTELMÄN tynkä**                                                                            | (**Asetukset → Yleiset → Ohjelma**) Lisää SYS-kutsua kutsuvan BASIC-rivin ohjelman alkuperän (ensimmäisen ORG:n) alkuun. Ensimmäistä ORG:ia alempana oleva segmentti pysyy omassa osoitteessaan. Kun ohjelma latautuu BASIC-rivin (`$0801`–`$080C`) ala- tai poikki, esimerkiksi tuotu vedos hakemistosta `$071C`), Suorita ja rakenna -komennot lisäävät pienen käynnistyslataajan: `SYS 2061` kopioi moverin nauhapuskuriin (`$033C`), joka asettaa ohjelman paikoilleen ja hyppää ensimmäiseen ORG:iin.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Esimerkkejä…**                                                                                       | Avaa esimerkkiselain ja lataa sisäänrakennettu esimerkkiohjelma — katso [Esimerkkiohjelmat](#example-programs)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Lähennä/loitonna**                                                                                   | Skaalaa lohkon käyttöliittymää (vaikuttaa kaikkiin lohkoelementteihin)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Tallenna ohjelma** (`Valikko → Tiedosto`)                                                            | Tallenna nykyinen välilehti: lohko-ohjelma tiedostona `.json`, lähdetiedosto (`.asm`, `.s`, `.inc` …) pelkkänä tekstinä (Ctrl+S tekee saman)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Tallenna ohjelma nimellä** (`Valikko → Tiedosto`)                                                    | Sama, mutta uusi tiedostovalintaikkuna joka kerta                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Lataa ohjelma** (`Valikko → Tiedosto`)                                                               | Lataa aiemmin tallennettu ohjelma                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Tallenna työtila**                                                                                   | Tallenna tarkka joukko parhaillaan avoinna olevia, tiedostoihin tallennettuja välilehtiä — mukaan lukien aktiivinen välilehti ja kunkin välilehden editoritila (Lohko/Asiantuntija/Ultimate Basic) — `.vaws`-työtilatiedostoon.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Tallenna työtila nimellä**                                                                           | Tallenna nykyinen työtila aina uuden tiedoston valintaikkunaan                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Avoin työtila**                                                                                      | Sulje kaikki avoimet välilehdet ja avaa uudelleen `.vaws`-työtilatiedostoon tallennettu tiedostojoukko.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Aseta työkansio**                                                                                    | Valitse tiedostovalitsimien ja tallennusikkunoiden käyttämä oletuskansio. Polku tallennetaan sovelluksen asetuksiin, ja valikoiden esikatselut pitävät polun lopun näkyvissä.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Uusi projekti mallista…** (`Valikko → Uusi projekti` tai työkalupalkin painike **Valikon** vieressä) | Luo uusi `.proj`-projekti Visual Assembler-, ACME- tai UltimateBasic-mallista omaan kansioonsa — katso [Projektimallit](#project-templates)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Avaa projekti** (`Valikko → Tiedosto`)                                                               | Avaa monitiedostoinen `.proj`-projekti ja avaa kaikki lähdekooditiedostot välilehdillä                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Tallenna projekti** (`Valikko → Tiedosto`)                                                           | Tallenna nykyinen `.proj` -projekti (projektipaneelin on oltava auki)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Sulje projekti** (`Valikko → Tiedosto`)                                                              | Sulje avoinna oleva projekti ja kaikki sen tiedostovälilehdet. Kehottaa tallentamaan tallentamattomat muutokset. Projektipaneeli palautuu tyhjään tilaansa.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Lataa .asm-tiedosto** (Asiantuntijatyökalurivi)                                                      | Avaa `.asm`-tiedoston asiantuntijatilassa uudessa välilehdessä                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Rakenna PRG** (`Valikko → Rakenna`)                                                                  | Vie käännetty binääritiedosto tiedostona `.prg`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Rakenna D64** (`Valikko → Rakenna`)                                                                  | Pakkaa ohjelma ja lisätiedostot `.d64`-levykuvaan — katso [Vie D64-tiedostoon -valintaikkuna](#export-to-d64-dialog)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Rakenna CRT**                                                                                        | Vie ohjelma 64K Magic Desk (`.crt`, kasettityyppi 19) -tiedostona. Katso [Osa 12b](#12b-crt-export-magic-desk-64k-cartridge).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Rakenna projekti** (`Valikko → Rakenna`)                                                             | Käännä jokainen projektin (tai avointen välilehtien) rakennettava tiedosto `.prg`-tiedostoksi lähdekoodin viereen — katso [Build project](#build-project)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Suorita (jakopainike)**                                                                              | Pääpainike **▶ Suorita** suorittaa nykyisen tilan; napsauta nuolta **▾** vaihtaaksesi seuraavien välillä: **Suorita PRG:nä** (käännä ja käynnistä VICE suoraan), **Suorita D64:n kautta** (pakkaa .d64-levykuvaan ja käynnistä VICE), **Suorita laitteistolla** (lähetä PRG C64 Ultimate / 1541 Ultimate -laitteeseen), **D64 laitteistolla** (lähetä D64 samaan laitteeseen) tai **Kung Fu Flash 2** (lataa PRG USB:n kautta oikeaan C64/C128:aan, jossa on Kung Fu Flash 2 -kasetti). Katso [Osa 12](#12-d64-export--run) ja [Osa 13]{2]. **Sisäänrakennettu C64** suorittaa ohjelman C64:llä sovelluksen sisällä, katso [Sisäänrakennettu C64 ja virheenkorjain](#built-in-c64-and-debugger).                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Virheenkorjaus (RetroDebugger)**                                                                     | Käännä ja käynnistä RetroDebuggerissa käyttämällä keskeytyskohtia, symboleja ja automaattisen käynnistyksen lippuja (katso [Osio 10](#10-debugger-integration))                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Suorita Exomizerilla**                                                                               | Valintaruutu kohdassa **Asetukset → Yleiset → Ohjelma** — kun se on käytössä, kaikki Suorita- ja Kokoonpanotoiminnot käsittelevät PRG:n `exomizer sfx` -komennon avulla ennen käynnistämistä tai tallentamista (`sfx basic` PRG:lle, joka alkaa BASIC-rivillä, joten RUN toimii uudelleen ohjelman paluun jälkeen; `sfx $<latausosoite>` muuten). Toimii seuraavien kanssa: Suorita PRG:nä, Suorita D64:n kautta, Suorita laitteistolla, Kokoa PRG ja Kokoa D64. Määritä Exomizer-suoritettava tiedosto ensin kohdassa **Asetukset → Tiedostot ja polut**.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Automaattiset automaattiset tallennusmerkinnät**                                                     | Valintaruutu kohdassa **Asetukset → Yleiset → Versiohallinta**. Kun tämä on käytössä, sovellus lisää automaattisen tallennuksen versiohistoriaan noin 2,5 sekuntia sen jälkeen, kun lopetat välilehden muokkaamisen (projektin välilehden osalta myös projektin historiaan). Poista se käytöstä, jos haluat vain omat commit-tiedostosi. Katso [Versiohallinta]{1].                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Asetukset** (aiemmin Laitteistoasetukset)                                                            | Avaa asetusvalintaikkuna, jossa on kolme välilehteä: **Yleiset** (assembler-tila, VMA-kääntäjä, BASIC SYS -tynkä, Exomizer, ASM-lähtö, SID-esikatselu, virheenkorjaajan valinta ja parametrit, versionhallinta), **Tiedosto- ja polut** (VICE, RetroDebugger, päivityspalvelin, ACME, Exomizer, git) ja **Integraatiot** (C64 Ultimate, Ultimate-emulaattori, Kung Fu Flash 2). Katso [Osio 13](#13-settings).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Uusi ohjelma…** (`Valikko → Ohjelma`)                                                                | Avaa vahvistusikkunan ja tyhjentää sitten kaikki lohkot ohjelma-alueelta.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Vie ASM** (`Valikko → Ohjelma`)                                                                      | Kopioi luodun kokoonpanon lähdekoodin                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Pitkännä kaikki**                                                                                    | Kutista kaikki lohkot                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Tietoja**                                                                                            | Versiotiedot                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Uutta**                                                                                              | Muutosloki                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Tietokanta**                                                                                         | Viitelinkit (6502 operaatiokoodit, C64 KERNAL, muistikartta, värit)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Tarkista päivitykset**                                                                               | Tarkista uudempi versio c64va.pro-sivustolta ja lataa/asenna se — katso [Sovelluksen sisäiset päivitykset](#in-app-updates)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

### Versiohallinta

Jokaisella välilehdellä on oma versiohistoriansa, kuten pienellä git-arkistolla;
avoimeen `.proj` -projektiin kuuluva välilehti voidaan myös versioida
kokonaisena projektina (katso [Projektitila](#project-mode)). **Valikko →
Versiointi → Versioiden hallinta…** (tai **Commit…**) avaa valintaikkunan;
**Hylkää muutokset (takaisin HEAD-osioon)** palauttaa viimeisimmän commitin
vahvistuksen jälkeen (Git-tilassa myös levyllä olevat tiedostot).

Tavallinen työnkulku: kirjoita **commit-viesti** ja paina **Commit** (tai
Ctrl+Enter) → jatka muokkaamista → paina **Diff[X113X nähdäksesi, mikä muuttui →
commit uudelleen.

- **Commit** — tallentaa välilehden nykyisen tilan viestisi kanssa. Jokainen
  commit saa lyhyen tiivisteen (esimerkiksi `1bd55ba`); uusin on **HEAD**.
  Commit ilman muutoksia, koska HEAD-tähdettä ei luoda.
- **Tilarivi** — *Ei mitään commitoitavaa, puun puhdistus käynnissä* tai
  *Muutoksia, joita ei ole commitoitu `<hash>`* jälkeen.
- **Diff** — muutokset HEAD-versiosta lähtien; lokimerkinnän **Diff**-painike
  vertaa kyseistä versiota editoriin. Lisätyt rivit ovat vihreitä, poistetut
  rivit punaisia ja otsikossa näkyy **+N / −M**. Lohkomuotoisia ohjelmia
  verrataan kokoonpanolinjoina (yksi rivi lohkoa kohden), Expert-lähteitä rivi
  riviltä ja Ultimate Basic -välilehtiä lähteen mukaan, joten JSON-muodossa
  tallennettu lohkomuotoinen projekti näyttää edelleen luettavat muutokset.
  Jokainen tiedosto on kokoontaitettava kortti, jossa on sen tila (**M** / **A**
  / **D** / **R**) ja lukumäärät, riveillä on vanhat ja uudet numerot sekä
  editorin syntaksin värit, ja muutetulla rivillä eroava osa on korostettu.
  **Split** näyttää vanhan ja uuden version rinnakkain (muistetaan), ⤢ antaa
  eroille enemmän tilaa. Lähdetiedosto (`.asm`, `.s`, `.inc` …) tallennetaan
  tekstinä, joten versio pysyy lähdetiedostona.
- **Checkout** — lataa kyseisen version editoriin. Levyllä oleva tiedosto
  muuttuu vain tallennettaessa; **Discard changes** palaa takaisin
  HEAD-tiedostoon.
- **Automaattisen automaattisen tallennuksen merkinnät** — valitsemalla
  **Asetukset → Yleiset → Versioiden hallinta → Automaattisen automaattisen
  tallennuksen merkinnät versionhallinnassa** sovellus lisää merkinnän noin 2,5
  sekuntia muokkaamisen lopettamisen jälkeen. Ne on merkitty *automaattinen
  tallennus*; viimeiset 20 säilytetään, ja lisäksi enintään 100
  commit-merkintää.
- Valintaikkunaa voi siirtää sen otsikon avulla; se avautuu uudelleen samasta
  kohdasta ja sulkeutuu painamalla **Esc** tai sulkemispainikkeella
  (ulkopuolinen napsautus ei sulje sitä).
- Historia tallennetaan projektitiedoston viereen nimellä
  `<projekti>.snapshots.json` (sovelluksen asetuskansioon, kunnes projekti
  tallennetaan), joten se säilyy uudelleenkäynnistyksen jälkeen. Aiemmilla
  versioilla tehdyt tilannevedokset näkyvät commit-tiedostoina.

#### Projektitila

Kun välilehti kuuluu avoimeen `.proj`-projektiin (Expert- tai Ultimate Basic
-projektipaneeli), valintaikkunan otsikossa näkyy **Tiedosto / Projekti**
-kytkin; **Projekti** on valittuna oletusarvoisesti. Projektin ulkopuoliset
välilehdet säilyttävät edellä kuvatun tiedostokohtaisen historian.

- **Commit** tallentaa projektin kaikki lähdekooditiedostot yhteen merkintään:
  projektipuun tiedostot sekä niiden sisältämät tekstitiedostot (`.include`,
  `include`, `#import`, `!source`, Block-mode INCLUDE -lohkot). Avoimet
  välilehdet lasketaan niiden nykyisen, myös tallentamattoman, sisällön mukaan;
  muut tiedostot luetaan levyltä. Projektipuun binaaritiedostot (fontit, `.koa`,
  `.bin`, `.sid` …, enintään 1 Mt kukin) tallennetaan myös; niiden erotiedot
  näyttävät koon muutoksen, ja **Checkout** kirjoittaa ne suoraan takaisin
  levylle.
- Lokissa näkyy commit-viesti, lyhyt tiiviste ja kunkin merkinnän **muuttuneet
  tiedostot** (**A** lisätty, **M** muokattu, **D** poistettu).
- **Diff** toimii tiedosto tiedostolta: jokainen muuttunut tiedosto saa oman
  otsikkonsa ja lohkonsa.
- **Hylkää muutokset** palaa viimeisimpään projektin commit-tiedostoon (HEAD)
  samalla tavalla.
- **Checkout** (vahvistuksen jälkeen) lataa kaikki kyseisen version tiedostot
  editoriin: avoimet välilehdet päivitetään, puuttuvat tiedostot avataan uusina
  välilehtinä. Mitään ei kirjoiteta levylle ennen tallennusta; kyseisen version
  jälkeen projektiin lisätyt tiedostot pysyvät ennallaan.
- Automaattisen tallennuksen merkinnät tehdään myös projektitasolla.
- Projektin historia tallennetaan projektitiedoston viereen nimellä
  `<projekti>.proj.history.json`.
- **Git**-tilassa loki näyttää koko repositorion ja kunkin commitin muuttuneet
  tiedostot (`git log --name-status`); **Diff** näyttää commit-tiedoston
  tiedosto kerrallaan, **Diff**-painike vertaa HEAD-tiedostoa editorin
  projektitiedostoihin (**RAW** on repositorion `git diff HEAD`). **Commit**
  tallentaa kaikki tallentamattomat projektivälilehdet ja valmistelee kaikki
  muutokset (`git add -A`); **Checkout** lataa kyseisen commitin
  projektitiedostot editoriin.

#### Git

Jos `git` on asennettu, sama valintaikkuna voi toimia oikean git-repositorion
kanssa.

- **Asetukset → Tiedostot ja polut → git** / **Asetukset → Yleiset → Versioiden
  hallinta:** **Valitse git.exe…** tai **Automaattinen tunnistus** (etsii
  polusta ja tavallisista asennuskansioista); alla oleva rivi näyttää
  git-version. **Käytä Gitiä, kun projekti on repositoriossa** (oletusarvoisesti
  päällä) vaihtaa valintaikkunan automaattisesti Git-tilaan repositorion sisällä
  oleville tiedostoille. Valintaikkunan otsikossa oleva **Built-in / Git**
  -kytkin vaihtaa tilan manuaalisesti.
- Ylätunnisteessa näkyy haara, jossa on **↑** (vahvistaa työntämisen) ja **↓**
  (vahvistaa vetämisen). Tilarivin alapuolella oleva työkalupalkki
  (kuvakepainikkeet, nimet näkyvät hiirellä viemällä) sisältää haaraluettelon
  ****, haaratyökalut, **Stash** ja **Pull / Push / Refresh**.
- **Haarat** — valitse listalta toinen haara vaihtaaksesi siihen (`git switch`);
  **Uusi haara** luo uuden haaran HEAD-taulukosta ja vaihtaa siihen, **Nimeä
  uudelleen** nimeää nykyisen haaran uudelleen, **Poista haara** poistaa toisen
  haaran (haara, jota ei ole vielä yhdistetty, poistetaan vasta toisen
  vahvistuksen jälkeen). Vaihtaminen vaatii tallennetut välilehdet: tallenna tai
  hylkää editorin muutokset ensin. Vaihdon jälkeen repositorion avoimet
  välilehdet latautuvat uudelleen levyltä.
- **Yhdistä…** yhdistää valitun haaran nykyiseen haaraan (`git merge
  --no-edit`). Ristiriitatilanteessa ristiriitaiset tiedostot luetellaan ja
  näytetään punaisina, ja tilarivillä lukee *Yhdistämisprosessi käynnissä*:
  ratkaise ne editorissa, tallenna, merkitse jokainen **Ratkaistu** ja commit —
  tai paina **Keskeytä yhdistäminen** (`git merge --keskeytä`) palataksesi
  takaisin.
- **Muutosluettelo** näyttää jokaisen arkiston muuttuneen tiedoston ja sen `git
  status` -koodin. Napsauta sen nimeä nähdäksesi sen vertailuarvon (HEAD levyllä
  olevan tiedoston kohdalta); sen vieressä olevat painikkeet **Stage** (`git
  add`), **Unstage** (`git restore --staged`) ja **Discard** (takaisin
  HEAD-tilaan levyllä vahvistuksen jälkeen) — seuraamaton tiedosto voidaan sen
  sijaan **poistaa**.
- **Stash** siirtää vahvistamattomat muutokset sivuun valinnaisella viestillä
  (`git stash push`); muutosten alapuolella oleva **stash-lista** joko
  **käyttää**, **lisää** tai **pudottaa** merkinnän.
- **Hylkää muutokset** kysyy ensin, sitten palauttaa muutetut tiedostot levylle
  HEAD-tilaan (`git restore --staged --worktree`) ja lataa niiden välilehdet
  uudelleen — projektille koko projektikansio, muuten välilehden tiedosto;
  seuraamattomat tiedostot säilytetään.
- **Commit** tallentaa tiedoston ensin, valmistelee vain tämän tiedoston (tai
  kaikki muutokset komennolla **Stage all changes (git add -A)**) ja suorittaa
  komennon `git commit`. Projektissa **Stage all changes** on oletuksena päällä;
  pois päältä kytkettynä commit ottaa vastaan vain muutosluettelossa
  valmistelemasi tiedostot.
- Lokissa luetellaan tiedoston commitit haaroineen ja tageineen. Merkinnän
  **Diff** vertaa committia sen päätiedostoon; **Diff**-painike vertaa
  HEAD-tiedostoa editoriin, tallentamattomat muutokset mukaan lukien.
  Projektitiedostoja verrataan samalla tavalla kuin sisäänrakennetussa tilassa;
  **RAW** näyttää pelkän `git diff`-tiedoston.
- **Checkout** lataa kyseisen commitin tiedoston editoriin (`git show`)
  koskematta levyyn.
- **Pull** (`--ff-only`), **Push** (ensimmäinen push-komento asettaa ylävirran
  komennolla `-u origin <branch>`) ja **Create repository (git init)**, kun
  kansio ei ole vielä repositorio.
- git toimii ilman konsoli-ikkunaa eikä koskaan kysy salasanaa: tunnistetietojen
  on tultava tunnistetietojen hallinnasta tai SSH-avaimesta, muuten
  virheilmoitus näkyy valintaikkunassa.

### Editorityökalut

**Valikko → Tarkista päivitykset** etsii uusimman version c64va.pro-sivustolta
(se lukee alustasi latauslinkit) ja vertaa sitä käynnissä olevaan versioon:

- syntaksin korostus nykyisen Ultimate Basic -kielireferenssin perusteella;
- rivinumerot, jotka pysyvät synkronoituina pitkien tiedostojen kanssa;

Purkamispaneeli sisältää **Kopioi**-painikkeen, joka kopioi koko näytetyn
lähdekoodin leikepöydälle. Komento-ohjeet seuraavat mukana tulevaa kääntäjää:
esimerkiksi `sprite_frame id, data_address [, frame]` valitsee animaatiokuvan
peräkkäisistä 64-tavuisista sprite-kehyksistä.

| Alusta      | Mitä tapahtuu                                                                                                                                                                                               |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Windows** | Asennusohjelma toimii passiivisessa tilassa (vain edistyminen) ja käynnistää uuden version, kun se on valmis. Konekohtainen asennus pyytää järjestelmänvalvojan oikeuksia (UAC).                            |
| **macOS**   | DMG liitetään ja sovelluspaketti korvataan paikalleen, minkä jälkeen uusi versio käynnistyy. Jos sovelluskansioon ei voi kirjoittaa, DMG yksinkertaisesti avataan, jotta voit vetää sovelluksen sen päälle. |
| Linux       | AppImage vaihdetaan uuteen. `.deb` / `.rpm` -asennus päivitetään tiedostolla `pkexec` (sinulta kysytään salasanaasi); ilman `pkexec` paketti avataan ohjelmiston asennusohjelmassa.                         |

Komentoluettelon korkeus on tarkoituksella rajoitettu, jotta komentotietokortti
voi täyttää paneelin jäljellä olevan korkeuden. Tietoalue vierii itsenäisesti
pidempiä syntaksikuvauksia varten.

**Päivityspalvelin:** **Asetukset → Tiedostot ja polut → Päivitykset →
Päivityspalvelin** määrittää, mistä julkaisuja haetaan (oletusarvo
`https://www.c64va.pro/`); asennusohjelmat luetaan osoitteesta
`<palvelin>lataukset/VA/`. Osoitteen on oltava `https://` (tavallinen `http://`
vain osoitteelle `localhost` testausta varten); **Oletus** palaa osoitteeseen
c64va.pro.

### Ilmainen ja avoimen lähdekoodin

Visual Assembler on ilmainen: jokainen ominaisuus – visuaaliset editorit (SID,
Sprite, Char, Charset, Hi-Res, Map, Level, D64, Curve), SID Player, **Build
PRG**, **Build D64**, **Build CRT**, **Build-projekti**, Exomizer-pakkaus,
toiminta C64 Ultimatessa ja Kung Fu Flash 2:ssa sekä kaikki käyttöliittymän
kielet ja teemat – toimivat ilman rekisteröitymistä tai sarjanumeroa. Lähdekoodi
on saatavilla GNU General Public License v3.0 -lisenssillä (katso **Valikko →
Tietoja**). Versioon 2.5.9 asti sovelluksessa oli Freemium / Professional -jako;
versiosta 2.6.0 lähtien sarjanumeroa ei yksinkertaisesti enää tarvita.

Jos pidät ohjelmasta, voit tukea sen kehitystä lahjoituksella: **Valikko →
Lahjoitus** (Näytä-kohdassa) avaa lahjoitussivun c64va.pro-sivustolla, jossa
voit lahjoittaa minkä tahansa summan PayPalin kautta.

**Käyttötilastot.** Sovellus lähettää käynnistyksen yhteydessä korkeintaan
kerran päivässä anonyymin ping-kutsun c64va.pro-sivustolle. Kutsu sisältää
sovellusversion, käyttöjärjestelmän, käyttöliittymän kielen, käynnistysten
määrän ja aktiivisten minuuttien määrän viimeisimmästä ping-kutsusta (minuutti
lasketaan, kun ikkuna on näkyvissä ja olet käyttänyt hiirtä tai näppäimistöä
viimeisten 5 minuutin aikana), onko sarjanumero versioista 2.5.6–2.5.9 edelleen
tallennettuna (vain kyllä / ei) ja satunnaisen asennustunnuksen (säilytetään
sovelluksen `config.json`-tiedostossa nimellä `launchPing`).
Sähköpostiosoitetta, sarjanumeroa, projektia tai lähdekoodia ei lähetetä;
offline-tilassa ei tapahdu mitään. Sovellus pyytää myös c64va.pro-sivustolta
satunnaisia lyhyitä viestejä (esimerkiksi uudesta versiosta, joskus vain
tukijoille); jokainen viesti näytetään kerran.

### Virheen ilmoittaminen

**Valikko → Ilmoita virheestä** avaa lomakkeen, joka lähettää raportin suoraan
kehittäjälle.

- **Yhteenveto** ja **Mitä tapahtui?** ovat pakollisia – kuvaile mitä teit, mitä
  odotit ja mitä sen sijaan tapahtui. **Sähköpostiosoite** on valinnainen; anna
  se, jos haluat vastauksen.
- **Kuvakaappaukset:** jopa 4 kuvaa toiminnolla **Lisää kuva…**, liittämällä ne
  näppäinyhdistelmällä **Ctrl+V** (esimerkiksi Win+Shift+S-näppäinyhdistelmän
  jälkeen) tai pudottamalla ne lomakkeelle. Suuret kuvat skaalataan 1920
  pikseliin.
- **Sisällytä järjestelmätiedot ja viimeisimmät virheet** (oletusarvoisesti
  käytössä) lisää sovellusversion, käyttöjärjestelmän, kielen, teeman, editorin
  ja suoritustilan, näytön koon, lohkojen määrän ja viimeisimmät
  sovellusvirheet. **Mitä lähetetään?** näyttää tiedot. Lähdekoodiasi ei
  lähetetä.
- **Lähetä raportti** vahvistaa raportin numerolla. **Lähetä sähköpostitse**
  avaa sähköpostiohjelmasi.

### Tukea

**Valikko → Tuki** avaa keskustelun kehittäjän kanssa: kirjoita kysymys, idea
tai ongelma ja paina **Lähetä** (tai **Ctrl+Enter**). Voit liittää enintään 3
tiedostoa (yhteensä 4 Mt): kuvia, lähdetiedostoja (`.asm`, `.ub`, `.txt` …),
C64-tiedostoja (`.prg`, `.d64`, `.sid`, `.crt` …) tai `.zip` -tiedoston — joko
valitsemalla **Liitä tiedosto…**, liittämällä (**Ctrl+V**) tai vetämällä ne
ikkunaan. Vastaus näkyy samassa ikkunassa, myös tiedostojen kanssa: kuvat
näkyvät esikatseluina, napsautus tallentaa tiedoston. Ikkuna ei ole modaalinen:
vedä sitä otsikosta, muuta sen kokoa oikeasta alakulmasta ja jatka työskentelyä
sen ollessa auki. Sovellus tarkistaa vastaukset käynnistyksen yhteydessä ja
minuutin välein; uusi vastaus toistaa lyhyen piippauksen (ikkunan otsikossa
oleva kaiutinpainike mykistää sen), väläyttää tehtäväpalkin kuvaketta, kun
sovellus on taustalla, näyttää punaisen pisteen **Menu**-painikkeessa ja avaa
ikkunan kerran. Kun keskustelu on käynnissä, **Menu**-painikkeen vieressä oleva
kirjekuorikuvake avaa sen; se muuttuu punaiseksi ja vilkkuu lukemattomien
vastausten määrän mukaan. Viestin vieressä oleva **×** poistaa kyseisen viestin,
ikkunan otsikossa oleva roskakoripainike poistaa koko keskustelun liitteineen
(myös kehittäjälle; molemmat kysyvät ensin). Sähköpostiosoite on valinnainen:
jos annat sellaisen, vastaus saapuu myös sähköpostitse. Keskustelu on sidottu
sovelluksen satunnaiseen asennustunnukseen, joten tiliä eikä salasanaa ei ole.

### Projektit, välilehdet ja käynnistystiedostot

Ultimate Basic -projektit käyttävät `.proj`-tiedostoja ja voivat sisältää useita
`.ub`-lähteitä. Projektipaneeli listaa avoimet tiedostot, merkitsee
tallentamattomat välilehdet ja näyttää löydetyt otsikot, funktiot ja
aliohjelmat. Projektitoimintojen avulla voit luoda, avata, tallentaa ja sulkea
projektin tai lisätä uuden lähdetiedoston. Uusi projekti voi myös alkaa
UltimateBasic-mallista – katso [Projektimallit]{1].

- **Lisää tiedosto** — valitse yksi tai useampi tiedosto kerralla (mikä tahansa
  tyyppi — `.ub`, `.bin`, `.prg`, kuvat, fontit jne.). Myös `.ub` -lähteet
  avataan editorivälilehtinä; kaikki muu lisätään vain viitteeksi, jotta
  `incbin`/`loadfile` -resurssit siirtyvät projektin mukana.
- **Lisää kansio** — viittaa koko kansioon (esim. `incbin`-resurssihakemistoon,
  kuten `fonts/`), jotta se pysyy liitettynä projektiin.
- Työtilaan tallennetaan vain levyllä olevaan oikeaan tiedostoon perustuvat
  välilehdet; tallentamatonta esimerkkiä tai vain muistissa olevaa ohjelmaa
  sisältävällä välilehdellä ei ole mitään säilytettävää, ja se ohitetaan (ja
  näytetään ilmoitus, jos mikään avoimista välilehdistä ei täytä vaatimuksia).
- Työtilan avaaminen sulkee ensin kaikki avoimet välilehdet – sinua pyydetään
  vahvistamaan se ennen kuin työtila avautuu.
- Jos työtila viittaa tiedostoon, joka on sittemmin siirretty tai poistettu,
  kyseinen merkintä ohitetaan ja ilmoitetaan nimellä latauksen jälkeen.
- Avoimet Expert- ja Ultimate Basic ** -projektit ** tallennetaan myös:
  projektipuu (mukaan lukien tallentamattomat lisäykset ja poistot),
  käynnistystiedosto ja `.proj` -tallennuskohde palautetaan työtilan mukana.
  Vanhempien versioiden tallentamat työtilat avautuvat ilman niitä.

### Muistiikkuna ja nolla sivun käyttö

**Full C64 memory** -paneeli voi kellua: sen otsikossa oleva **undock** -painike
siirtää sen erilliseen, ei-modaaliseen ikkunaan, jota voit vetää ja jonka kokoa
voit muuttaa samalla kun jatkat muokkaamista (päällekkäisyysmerkki tulee sen
mukana). **Dock** (tai × / Esc) palauttaa sen. Ikkuna muistaa, onko se irrotettu
ja minkä kokoinen se oli.

Kun ohjelma koskettaa nollasivua, muistikartan yläreunaan ilmestyy **Zero page
usage** -osio: 16 × 16 -ruudukko `$00–$FF`, väritettynä alueen mukaan —
CPU-portti (`$00–$01`), vapaa (`$02`, `$FB–$FE`), BASIC (`$03–$8F`, `$FF`) ja
KERNAL (`$90–$FA`). Käytetyt solut täytetään; Kehys merkitsee
**kirjoituskohtaa**, viivoituskohta **osoitinta** (`(zp),Y` / `(zp,X)`).
Napsauta käytettyä solua nähdäksesi, mitkä rivit käyttävät sitä (napsauta riviä
hypätäksesi siihen) ja varoituksen, kun kirjoitat BASIC- tai KERNAL-alueelle.

Jos ohjelma sisältää SID-editorin viedyn soittimen (`sid_`-tunnisteet),
soittimen nollasivu (`$02–$1C`, `$2F`, `$FB–$FD` ja `$50–$69`, kun SID-editorin
sävelmällä on kaksi SID:tä) merkitään myös, ja jokainen oma koodisi käyttämä
osoite raportoidaan **-ristiriitana** (punainen kehys, varoitus otsikossa).

### Rakennus ja diagnostiikka

**Valikko → Uusi projekti → Uusi projekti mallipohjasta…** — tai työkalupalkin
painike **Valikko** ja **Ohjeet** välissä — avaa mallipohjavalintaikkunan:

1. Valitse ylhäältä osio: **Visual Assembler**, **ACME** tai **UltimateBasic**
   (valintaikkuna avautuu osioon, joka vastaa nykyistä editoritilaa). **ACME**
   -osio näkyy vain, kun toimiva ACME on asetettu kohdassa **Asetukset →
   Tiedostot ja polut → ACME**.
2. kääntäjävirheet näkyvät punaisena;
3. keskitetty käännösikkuna näyttää virheen;
4. Lähderivillä varustetut virheet valitsevat kyseisen rivin aktiivisessa
   UB-editorissa.

| Osa                          | Sisäänrakennetut mallit                                                                                                                                                                                                                                |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Visuaalinen kokoonpanija** | Tyhjä ohjelma, Tyhjä peli (otsikko / pelaaminen / pelin päättyminen -tilat, joystick, pelaajan sprite), Hires-bittikartta, Monivärinen bittikartta, Sprite-multiplekseri (16 spriteä lajiteltuna Y:n mukaan joka ruutu, näytetään rasteri-IRQ-ketjuna) |
| **ACME**                     | Tyhjä ACME-projekti, rasteri-IRQ, Sprite-multiplekseri (16 sprittiä)                                                                                                                                                                                   |
| **UltimateBasic**            | Tyhjä ohjelma, tyhjä peli (sama tilakone UB:ssä), bittikartan palkkaaminen (`viiva` / `suora` / `ympyrä` ja `värikynä`), rasteri-IRQ (`sub` kutsutaan jokaista rasterikeskeytyksen framea varten)                                                      |

Projekti luodaan omaan kansioonsa: `<sijainti>/<nimi>/<nimi>.proj` sekä
`main.asm` (Visual Assembler tai ACME) tai `main.ub` (UltimateBasic, `.proj` on
merkitty Ultimate Basic -projektiksi). ACME-projektin `.proj` tallentaa
ACME-assemblerin, ja sen luominen vaihtaa **Asetukset → Yleiset →
Assembler-tila** ACME-tilaan (Visual Assembler -projekti vaihtaa sen takaisin
VMA-tilaan). Olemassa olevaa projektia ei koskaan ylikirjoiteta – valintaikkuna
ilmoittaa siitä. Avoimet välilehdet suljetaan ensin (sinulta kysytään
tallentamattomista muutoksista), minkä jälkeen uusi projekti avautuu
Expert-tilassa tai Ultimate Basic -tilassa projektipaneeli näkyvissä ja
päätiedosto on asetettu käynnistystiedostoksi.

**Omat mallipohjat:** **Omat mallipohjat-kansio** (valintaikkunan vasemmassa
alakulmassa) avaa käyttäjämallipohjakansion sovelluksen määrityshakemistossa.
Jokainen sinne pudotettu `.asm`- tai `.ub`-tiedosto näkyy vastaavassa osiossa
(`.asm`, jossa on `; @assembler acme` -otsikkorivi, menee **ACME** -kansioon)
(*Omat mallipohjat* -kansion alle, ellei siinä ole nimetty luokkaa). Mallipohja
on tavallinen lähdekooditiedosto, jonka yläosassa on valinnainen kommenttirivien
otsikko — `;` assemblerissa, `#` Ultimate Basicissa:

```asm
; @name Rasteripalkit
; @name.hu Rastericsíkok
; @category Tehosteet
; @desc Kaksi rasteripalkkia reunassa.
; @order 50
```

`@name`, `@category` ja `@desc` voivat olla kielikohtaisia variantteja
(`@name.hu`, `@desc.de`, …); `@order` lajittelee listan. Kaikesta otsikon
jälkeen tulee uusi päätiedosto, ja `{{PROJECT}}` korvataan projektin nimellä
(käytä sitä kommentissa, jotta itse malline kääntyy edelleen).

### Opastusohjelmat ja oppituntien muokkausohjelma

**Tutorials** -ikkuna listaa kierrokset ja oppitunnit kansioissa. Luettelon
alareunassa oleva **Lesson Editor…** -painike (ja omien oppituntiesi **Muokkaa
oppituntia**) avaa **Lesson Editor** -toiminnon, jolla voit luoda vaiheittaisen
oppitunnin, kuten "Build: Your First Text Program" omasta koodistasi:

1. Kirjoita ohjelma lohko- tai asiantuntijaeditorissa.
2. Paina oppituntieditorissa **Askeleet nykyisestä ohjelmasta**. Jokaisesta
   rivistä tulee oppilaan askeleet: valitse muistisääntö (väärä on esivalittu),
   kirjoita operandi ja paina **Lisää**. Jos paletti ei voi asettaa kaikkea
   (esimerkiksi TEKSTIN sijainti), **Aseta parametrit** -askel osoittaa uuteen
   lohkoon ja siirtyy eteenpäin, kun se täsmää.
3. Anna oppitunnille otsikko, kuvaus, vaikeusaste ja **kansio** (mikä tahansa
   Opastus-kategoria). Lisää selityksiä varten **tekstivaiheet**, jotka
   halutessasi osoittavat ikkunan osaan (paletti, ohjelmapaneeli, ASM-näkymä,
   Suorita-painike, muistikartta). Jätä vaiheen otsikko tai selitys tyhjäksi
   luotua tekstiä varten.
4. **Kokeile oppituntia** (se tyhjentää nykyisen ohjelman) ja sitten **Tallenna
   oppitunti** (Ctrl+S).

Tekstit tallennetaan käyttöliittymän nykyisellä kielellä; toista kieltä käyttävä
opiskelija näkee ne tai luodun tekstin, johon et kirjoittanut mitään. **Täytä
makroparametrit automaattisesti** ohittaa parametrivaiheet opiskelijan kohdalla.
**Tiedostot ▾** luo, poistaa, vie ja tuo oppitunteja `.vatut`-tiedostoina ja
avaa oppituntikansion.

#### Verkko-oppitunnit

Tutoriaalit-ikkunan **Verkko-oppitunnit…** listaa www.c64va.pro-sivustolla
julkaistut oppitunnit kansioineen, vaikeusasteineen ja vaiheiden lukumäärän
mukaan. **Lataa** lisää oppitunnin omaan kansioonsa Tutoriaalit-luettelossa;
**Päivitä** tulee näkyviin, kun sivustolla on uudempi versio (tuntieditori
nostaa oppitunnin muokkausta jokaisen tallennuksen yhteydessä). Voit jakaa oman
oppitunnin käyttämällä oppituntieditorissa **Tiedostot ▾ → Lataa
c64va.pro-sivustolle…**: anna nimesi (näkyy kirjoittajana) ja halutessasi
sähköpostiosoite ja viesti. Oppitunti tarkistetaan ensin; hyväksynnän jälkeen se
näkyy kaikkien verkko-oppituntiluettelossa. Sähköpostiosoitettasi ei koskaan
julkaista.

### Juoksu, D64 ja Exomizer

Pääjakopainike **Suorita** tukee Ultimate Basic -tilaa kaikissa normaaleissa
kohteissa:

- Jokainen rakennettava lähdekoodi (`.asm`, lohko `.json`, `.ub`) käännetään
  `.prg` ** -tiedostoon samannimisen lähdekoodinsa** viereen; kun **Run with
  Exomizer** on käytössä, tuloste analysoidaan;
- virheenjäljitysohjelman sivutiedostot (symbolit / lähdekoodikartta)
  kirjoitetaan PRG:n rinnalle, jos niitä on saatavilla;
- Moduulit, jotka toinen tiedosto hakee komennolla `.include` / `include` (ja
  `.inc` -tiedostot), ohitetaan, samoin kuin välilehdet, joita ei koskaan
  tallennettu;
- Raportissa luetellaan jokainen tiedosto koostuen sen koosta, *ohitetusta*
  syystä tai kääntäjävirheestä, ja tilarivillä näkyy *N / M rakennettua
  tiedostoa*.

### Virheenjäljityssymbolit ja purkaminen

Koontit pyytävät Ultimate Basic -virheenkorjaustietoja ja tuottavat kolme
yhteensopivaa sivuvaunua:

- `.sym` KickAssembler-tyylisille symboleille;
- `.dbg` C64Debugger/RetroDebugger -lähdekoodin ja segmentin tiedoille;
- `.vs` VICE-näyttöjen nimille.

### Ultimate Basic -käyttöohje ja lähdekoodi

UB-työkalupalkin kirjakuvake avaa vastaavan Ultimate Basic `MANUAL.pdf`
-tiedoston offline-tilassa; aloitusikkunan käyttöohje-painike avaa saman
käyttöohjeen. Visual Assembler ottaa sekä kääntäjän että PDF-tiedoston
kiinnitetystä ylävirran Git/Cargo-riippuvuudesta, joten IDE ei ylläpidä toista
kopiota Ultimate Basic -toteutuksesta. Tietoja-valintaikkuna ja aloitusnäyttö
näyttävät riippuvuuden todellisen version.

- `* = 1500 $` → ORG-lohko
- `Merkki:` → LABEL-lohko
- `Merkki: .tavu 0` → MERKKIKOHTA + TAVU lohkot
- `.tavu ...` → BYTE-lohko
- `; kommentti` (tai rivillä `; ...`) → KOMMENTTI-lohko
- käskyt (`lda`, `jsr`, `beq`, jne.) → käskylohkot, joilla on havaittu
  osoitetila

#### Tuonnin jäsennyshuomautukset ja parhaat käytännöt

- Paikalliset otsikot, kuten `.wait`, säilyttävät pisteensä: ne kuuluvat
  lähimpään niiden yläpuolella olevaan globaaliin otsikkoon (katso [Paikalliset
  (pisteviivalliset) otsikot](#local-dotted-labels)).
- Käytä `($zp),Y` / `($zp,X)` -tyyppisissä osoitteissa konkreettista
  nollasivutavua (`$FB`, `$FC` jne.) parhaan yhteensopivuuden saavuttamiseksi.
- Vältä haarakonteksteissa monitulkintaisia lyhyitä nimiä, jotka näyttävät
  heksadecimaalilta (`cc1`, `dead`, `beef`); käytä mieluummin nimiä kuin
  `loop_cc1`.
- Jos ohjelmasi alkaa datamerkillä (`.byte`) ennen suoritettavaa koodia, lisää
  alkuun eksplisiittinen hyppymerkki (esimerkiksi `JMP Start`).

### Kick-tuonti (Kick Assembler)

Ohjelmavalikon **Kick import** -painike tuo raakana olevan Kick Assembler
-lähdekoodin uudelle lohkotilavälilehdelle. Se on erillinen yllä olevasta
Expert-tilan `Load .asm file` -painikkeesta — sen mukautettu työkaluvihje
ilmoittaa, että **vain Kick Assembler -koodia tuetaan** (muut assemblerit
saattavat jäsentää osittain, mutta edestakaista käsittelyä ei taata).

Tuetut kuviot:

- `.pc = $XXXX` alkuperädirektiivi → ORG-lohko
- `.vakio NIMI = arvo`, `.label NIMI = arvo` → VAKION yhtälö
- `.makro NIMI(p1, p2, ...) { ... }` with `{`/`}` tuen runko tai `.endm` →
  käyttäjämakron määritys
- Makron kutsu `NAME(args)`, Kick-kaksoispisteen etuliite `:NAME(args)` ja
  `.invoke NAME(args)` — kaikki edestakaisin Kick-kaksoispisteen lomakkeen
  kautta
- `@local`-tunnisteet (`@loop:`, `BEQ @loop`) säilyttävät etuliitteen `@`
  sellaisenaan
- Operandi `merkintä + N` / `merkintä - N` (esim. `STA mod1+2`, `LDA xp+1`)
- Rivikommentit `// ...` ja `;` — molemmat hyväksytään, `/* ... */` lohkoja
  käsitellään yhtenä kommenttirivinä
- `.teksti "…"` ilman näyttökoordinaatteja → BYTE-lohko koodatuilla tavuilla
  (alkuperäinen rivi säilytetään lohkon kommenttina). Useita kohteita on
  sallittu: `"…"`, `@"…"` koodinvaihtomerkeillä `\n` `\r` `\t` `\$NN` ja `$NN` /
  desimaalitavut, yhdistettynä `, ` tai `+`
- `.encoding "nimi"` asettaa seuraavien `.text` rivien koodauksen:
  `screencode_mixed` (Kick-oletus), `screencode_upper`, `petscii_mixed`,
  `petscii_upper`, `ascii`. Merkki, jolle koodauksella ei ole koodia,
  raportoidaan lohkossa.
- `.label NIMI = *`, `.label NIMI = * + N`, `.label NIMI = * - N` →
  ohjelmalaskurin merkintä, siirrettynä N:llä (esimerkiksi hyppy `BIT`:n
  operandiin: `.label loc_c474 = * + 1`)
- Muistisuuttimien `.abs` / `.a` ja `.zp` / `.z` (`sta.abs $00fc,x`, `ldx.zp
  ptr,y`) käyttö pakottaa absoluuttisen tai nollasivuisen osoituksen.
- `*=$XXXX "nimi"` ja `.pc = $XXXX "nimi"` segmenttiä missä tahansa
  järjestyksessä: ensimmäistä alempi segmentti pysyy osoitteessaan
- BASIC-automaattisen käynnistyksen läpikulku: kun ohjelma käynnistyy kohdasta
  `$0801` standardilla `SYS 2061` tavutynkällä (`.byte
  $0B,$08,$0A,$00,$9E,$32,$30,$36,$31,$00,$00,$00`), kääntäjä lähettää PRG:n
  sanatarkasti sen sijaan, että käärittäisi sen ympärille toisen BASIC SYS
  -järjestelmän.

Restore64:n (KickAssembler-syntaksi) tekemät purut tuovat ja rakentavat tavu
tavulta kuten KickAssembler. Niiden otsikossa nimetty aloituskohta on
ensimmäinen `.pc`. Plus/4 / C16:lle tarkoitettu ohjelma (BASIC kohdassa `$1001`,
TED-rekisterit kohdassa `$FFxx`) rakentuu samalla tavalla, mutta se toimii vain
Plus/4-emulaattorissa, kuten VICE `xplus4`, ei Run-komennolla.

Tunnettu rajoitus:

- Vakiot, jotka ratkeavat nollasivuosoitteeseen (esimerkiksi `.const BYTEADDR =
  $FC`, jota käytetään muodossa `STA BYTEADDR`), kääntyvät tällä hetkellä
  absoluuttisen tilan käskyiksi (3 tavua) nollasivun (2 tavua) sijaan. Käännetty
  koodi kirjoittaa edelleen oikeaan muistipaikkaan, vain pienemmällä koolla ja
  syklimäärällä verrattuna samaan Kick Assemblerin rakentamaan lähdekoodiin.

#### Kick-projektit (Tuo Kick-projekti…)

**Tuo Kick-projekti…** (Ohjelmavalikko, kohdassa **Kick import**) ottaa koko
KickAssembler-lähdekoodipuun — päätiedoston, jossa on `#import` moduuleja ja
`.import binary` resursseja — ja tekee siitä VA-projektin. Valitse päätiedosto
(`main.asm`); VA seuraa jokaista `#import` / `.import source` / `.import binary`
-haaraa (myös käyttämättömien `.if` -haarojen sisällä) ja kirjoittaa sen viereen
`.proj` -tiedoston, joka on nimetty kansion mukaan (`src` / `source` / `asm`
-kansiot käyttävät pääkansion nimeä). Projekti listaa kaikki tiedostot
kansiopuussaan; lähdekoodit pysyvät paikoillaan, joten olemassa oleva
KickAssembler-koontikomentosarja jatkaa toimintaansa. Tiedostot, joita ei löydy,
luetellaan virheikkunassa.

**Kick-yhteensopiva kytkin:** Mikä tahansa VA (VMA) -projekti voidaan tehdä
Kick-yhteensopivaksi **KickAssembler-yhteensopiva** -kytkimellä
**Projektiasetukset** -valikossa (se on päällä tuoduille Kick-projekteille).
Asetus tallennetaan tiedostoon `.proj` (`"kick": true`); pois päältä, projekti
on tavallinen VMA-projekti ja se rakentuu täsmälleen kuten ennenkin.

Kick-yhteensopivassa projektissa VA-makrot ja -direktiivit toimivat edelleen
KickAssembler-skriptin vieressä: `.text x, y, "…"`, `.set_border`, LOOP / NEXT,
SPRITE_INIT, `.include`, `.incbin`, `.sid`, `.define` / `.if SYMBOL` / `.else` /
`.endif`, VA-makrot (`.macro name(p)` … `.endm` with `{p}`) ja loput menevät
VA-assembleriin sellaisenaan, Kick-vakiot numeroina. Molemmissa olevat
direktiivit erotetaan toisistaan muodon perusteella:

| VA (VMA)                                                     | KickAssembler                                                                                                 |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `.for X, $0A, for1` … `.endf for1`                           | `.for (muut i = 0; i < 10; i++) { … }`                                                                        |
| `.jos VIRHEENJÄRJESTELMÄ` … `.muuten` … `.endif`             | `.if (lauseke) { … } muuten { … }`                                                                            |
| `.makron nimi(p)` … `.endm`, kutsutaan `.invoke` -funktiolla | `.makro Nimi(p) { … }`, kutsutaan nimellä `Nimi(arg)`                                                         |
| `.muuttujan nimi = arvo` (ajonaikainen muuttuja)             | `.var nimi = arvo` (skriptimuuttuja) — Kick-yhteensopivassa projektissa `.var` on aina KickAssembler-muuttuja |

**Reaaliaikainen tarkistus:** Kirjoittamisen aikana virheet, syklin
sisämarginaali ja kurkistusreiän vihjeet tulevat puusta, johon avoin tiedosto
kuuluu — käynnistystiedoston puusta tai, jos tiedostoa ei tuoda (esimerkiksi
`main.asm` käynnistystiedoston `boot.asm` vieressä), sen projektilähteen puusta,
joka tuo sen. Suorita ja käännä -komennot kääntävät aina käynnistystiedoston.

Projekti kootaan VA-assemblerilla, ei KickAssemblerilla: jokainen koonti (Run,
Build PRG, D64, CRT, Exomizer, Debug, VICE Monitor, Build project,
Build-painike) suorittaa ensin käynnistystiedoston KickAssembler-esikäsittelijän
läpi, ja avoinna olevien välilehtien editoritekstit ovat tallennettuja tai ei.
Tulos on sama PRG kuin KickAssemblerin. Tuettu:

- `#import`, `.import source`, `#importonce`; `.import binary` / `c64` / `text`
  valinnaisella siirtymällä ja pituudella
- `.const` / `.label` missä tahansa järjestyksessä lausekkeilla; nollasivu tai
  absoluuttinen osoitus seuraa arvoa kuten KickAssemblerissa (`.abs` / `.zp`
  pakottaa sen edelleen)
- `.for (var i = 0; i < n; i++) { … }` ja yksirivinen muoto, `.var`, `.eval`
  (`=`, `+=`, `++` …), `.if (…) { … } else .if (…) { … } else { … }` ja
  yksirivinen muoto
- `.funktion nimi(params) { .return lauseke }` ja `.makro nimi(params) { … }`
  kutsutaan funktiolla `Nimi(args)` tai `:Nimi(args)`
- monitunnisteet `!:` / `!nimi:` ja `!+`, `!-`, `!++`, `!nimi+`, `!nimi-`
- `.pseudopc address { … }`: sisällä olevat tunnisteet saavat loogisen
  osoitteen, tavut pysyvät paikoillaan
- `BasicUpstart2(tarra)` / `BasicUpstart(tarra)`, `* = osoite "segmentti"`,
  `.fill n, lauseke` (ja `i`) ja `.fill n, [a, b]`, `.align`, `.byte`, `.word`,
  `.dword`, `.text`
- `.assert "kuvaus", lauseke, true`; `cmdLineVars.containsKey(…)` /
  `cmdLineVars.get(…)` ja `#define` symbolit tulevat **Project settings**
  -asetuksista (KickAssemblerin `:name=value` ja `-define NAME`)
- `LoadBinary("tiedosto"[, malline])` ja `get(i)` / `uget(i)` / `getSize()`,
  malline, kuten `"C64FILE, Bitmap=$0000, ScreenRam=$1f40"` (tai `BF_KOALA`,
  `BF_FLI`, `BF_DOODLE`, `BF_BITMAP_SINGLECOLOR`, `BF_C64FILE`), jolloin saadaan
  `getBitmap(i)` / `getBitmapSize()` lohkoa kohden; `LoadSid("file.sid")` ja
  `location`, `init`, `play`, `songs`, `startSong`, `size`, `name`, `author`,
  `copyright`, `getData(i)` …; `.fill` skriptiarvoilla laajennetaan heti
- `* = osoite "nimi" virtual`: virtuaalimuistilohko — sen tunnisteet saavat
  osoitteet, mutta tavuja ei kirjoiteta
- `.while (…) { … }`, `i++` / `--i` lausekkeissa, `.var name` ilman arvoa
- `*` ohjelmalaskurina (`jmp *`, `bne *-1`, myös `.pseudopc` sisällä)
- `;` lausekkeiden välissä (`lda #1; sta $d020`, `.var a = 1; .var b = 2`): a
  `;` heti koodin jälkeen ilman välilyöntiä, jota seuraa lauseke. Mikä tahansa
  muu `;` aloittaa kommentin, kuten VA:ssa, joten `lda #1 ; comment` jatkaa
  toimintaansa
- matemaattinen kirjasto (`sin`, `cos`, `radiaaneiksi`, `asteiksi`, `round`,
  `floor`, `sqrt`, `pow`, `atan2`, `log10`, `random` …), värivakiot (`BLACK` …
  `LIGHT_GREY`), operaatiokoodivakiot (`RTS`, `LDA_IMM`, `LDA_ZPX`, `JMP_IND`,
  `BNE_REL` …) ja `asmCommand26(X)`
- `BasicUpstart2(label)`, jossa label on missä tahansa kohdassa, johon koot
  ulottuvat `* =` (esimerkiksi `* = $4000` … `start:` antaa SYS 16384)
- laajuusalueet kuten KickAssemblerissa: `{ }` lohkot, `.if` haarat, `.for` /
  `.while` käännökset ja makrokutsuilla on omat tunnisteensa ja vakionsa
  (`-silmukka:` sisällä ei törmää ulkoiseen silmukkaan; `.pseudopc` ei ole
  laajuusalue). Ennen laajuusaluetta oleva otsikko tekee sisäotsikoista
  saavutettavia: `name: { … }` → `name.inner`, `lp: .for (…)` → `lp[2].inner`,
  `myIf: .if (…)` → `myIf.inner`, `c1: Macro()` → `c1.inner`, `.label base =
  $1000 { … }` → `base.inner`
- `.namespace name { … }` ja `.filenamespace name` (tiedoston loppuun): otsikot
  ovat saatavilla muodossa `name.label`; `@label:`, `.label @x = …`, `.function
  @f` / `.macro @m` sijoittaa symbolin juureen ja `@name` viittaa
  juurisymboliin. Funktiot ja makrot näkyvät kaikkialla, myös nimiavaruuden,
  jossa ei ole `@`-tunnistetta, makrot.
- `.pseudokomennon nimi a : b { … }`: kutsutaan muistikoodin tavoin (`mov #10 :
  $1000`, `mov src,x : ($30),y`); Argumentit säilyttävät osoitustilansa
  (`getType()` = `AT_IMMEDIATE`, `AT_ABSOLUTE`, `AT_ABSOLUTEX` / `Y`,
  `AT_INDIRECT`, `AT_IZEROPAGEX` / `Y`, `AT_NONE` puuttuvan osoitteen tilalle;
  `getValue()`), `CmdArgument(tyyppi, arvo)` luo uuden osoitteen). Muistisanan
  kaltainen pseudokomento tarvitsee kaksoispisteen (`:adc …`); ilman sitä
  muistisääntö kootaan.
- esikäsittelijä: `#define`, `#undef`, `#if` / `#elif` / `#else` / `#endif`
  (joissa on `!`, `&&`, `||`), `#importif`
- `List()` (`lisää`, `hae`, `aseta`, `koko`, `poista`, `lajittele`, `käännä`,
  `sekoita`, `lisääKaikki`), `Hashtable()` (`laita`, `hae`, `sisältääKeyn`,
  `poista`, `avaimet`), `.struct Name {a, b}` (`Nimi(1, 2)`, `p.a`, `.eval p.a =
  3`, `getFieldNames()` …), strings (`+`, `charAt`, `substring`, `size`,
  `toUpperCase`, `asNumber(radix)` …, `toIntString` / `toHexString` /
  `toBinaryString` (vähimmäiskoolla), `.enum {A, B, C = 5}`, `.define name, … {
  … }`, `.eval list.add(…)`, merkki tiedostossa `.byte` ja merkkijonolausekkeet
  tiedostossa `.text` (nykyisessä `.encoding`)
- `.error "viesti"`, `.errorif ehto, "viesti"`; `.print` / `.printnow` tuloste
  näkyy tilarivillä (ensimmäinen viesti ja laskuri) ja kokonaisuudessaan **Build
  Info** -kohdassa. `.if`, joka raportoi vain (`.error` …), ohitetaan, kun sen
  ehto tarvitsee tunnisteosoitteita.
- `LoadPicture("file"[, List().add($rrggbb, …)])` GIF-, PNG- ja JPG-kuville:
  `width`, `height`, `getPixel(x, y)`, `getSinglecolorByte(x, y)`,
  `getMulticolorByte(x, y)`; ilman väritaulukkoa värit otetaan siinä
  järjestyksessä kuin ne esiintyvät. Muuttujassa annettu kuvan nimi
  (`LoadPicture(filename)`) toimii myös
- segments: `.segmentdef Nimi [start, startAfter, align, min, max, fill,
  fillByte, segments, prgFiles, sidFiles, virtual, outPrg, outBin,
  modify="BasicUpstart", _start]`, `.segment Nimi [params] "lohko"`,
  `.segmentout [segments=…]`, `.file [nimi=…, segments=…, allowOverlap]`, `.disk
  [tiedostonimi=…, nimi=…] { [nimi=…, tyyppi=…, segments=…], … }`, `.memblock`.
  Segmentti, jolla ei ole `start`-memoria, alkaa hinnasta $2000 kuten
  KickAssemblerissa. **Run** käynnistää oletusarvoisen segmentin; kun se on
  tyhjä, ensimmäinen PRG-tuloste ($0801:ssä oleva ensin) syntyy. **Build
  project** kirjoittaa jokaisen `.file` / `outPrg` / `outBin` -tiedoston
  käynnistystiedoston viereen ja rakentaa `.disk` -kuvan c1541:llä.
- `.täyttösana n, lauseke`, `.lohitäyttö n, lauseke` (tunnisteella: `nimi.lo` /
  `nimi.hi`); muistisääntöliitteet `.im` / `.i`, `.z` / `.zp`, `.a` / `.abs`
- `.cpu _6502NoIllegals` / `_6502` (oletusarvo, laittomilla operaatiokoodeilla)
  / `dtv` (`bra`, `sac`, `sir`) / `_65c02` (`(zp)` tila, `bra`, `phx` / `phy` /
  `plx` / `ply`, `stz`, `trb`, `tsb`, `rmb0-7` / `smb0-7`, `bbr0-7` / `bbs0-7`,
  `stp`, `wai`, `inc` / `dec` A, `bit #`, `jmp (abs,x)`); jokainen laiton
  NMOS-operaatiokoodi kaikkine tiloineen ja muine nimineen (`sha` / `ahx`,
  `shx`, `shy`, `tas` / `shs`, `las` / `lae`, `xaa` / `ane`, `lxa`, `anc2`,
  `sbc2` …) — VA-assembler tuntee ne myös
- `.break ["condition"]` ja `.watch address[, end][, "store"]`: keskeytyskohdat
  ja tarkkailut VICE-symbolitiedostossa (`break` / `watch` -rivit, kuten
  KickAssembler ne kirjoittaa) ja RetroDebuggerissa `.dbg`; `.break` -rivit ovat
  myös **Debug** -tiedoston keskeytyskohtia
- `Vektori(x, y, z)` (`+`, `-`, `*` luku / pistetulo, `/`, `X()` ristitulo,
  `get(n)`, `getX()` …) ja 4×4 matriisit: `Matriisi()`, `Pyörimismatriisi(ax,
  ay, az)`, `Skaalausmatriisi`, `Siirtomatriisi`, `Perspektiivimatriisi(z)`,
  `hae(n, m)`, `set(n, m, v)`, matriisi × matriisi, matriisi × vektori
- `getNamespace()`; `.assertterror "nimi", lauseke` ja koodimuodot `.assert
  "nimi", { … }, { … }` / `.assertterror "nimi", { … }` (tulokset ovat `.print`
  viestejä, kuten KickAssemblerin assert-raportti); `* - label` vakiossa
  (`.label size = * - start`)
- `.modify` / `.filemodify` tarvitsevat KickAssembler Java -laajennuksen: lohko
  kootaan ilman muokkaajaa, ja siinä näkyy viesti

Kirjoittaessasi koko tiedostopuu tarkistetaan: avoimen tiedoston virheet
merkitään editorissa, tilarivillä näkyy ensimmäinen virhe ja
käännösvirhe-valintaikkunassa on nimi `file:line` – napsautus avaa tiedoston
riviltä. Muistikartta näyttää rakennetun ohjelman ja sykliväli näyttää avoimen
tiedoston syklit (rivi, jonka purkaa `.for` tai makro muodossa `4×8`: yksi
kierros, kahdeksan kertaa; valinta lasketaan yhteen joka kierros).
Kurkistusreikien vihjeet merkitsevät avoimen tiedoston rivit; Disassembly- ja
Monitor-paneelit näyttävät rakennetun ohjelman. Editori korostaa
KickAssembler-syntaksia (`#import`, `.segment`, skriptifunktiot, `!labels`, `;`
tiedostossa `.for (…)`), ja suoritus tarjoaa Kick-direktiivit (`.`),
esikäsittelijän (`#`) ja skriptifunktiot. Esikäsittelijän viestit näkyvät
sovelluksen kielellä. **Debug** (RetroDebugger) hakee lähdekoodikartan, joka
sisältää alkuperäiset tiedostot ja rivit, luettavat symbolien nimet
(`scope.label`) ja jokaisen avoimen projektitiedoston keskeytyskohdat.
Projektipuun binaaritiedostoja ei avata tekstinä. Dark Chambers C64 -porttaus
(19 lähdekooditiedostoa, 15 binääritiedostoa) ja kaikki yksitoista
KickAssembler-esimerkkiä koodinmuodostuksella tavu tavulta, kuten KickAssembler
5.25:ssä.

## 6. Asiantuntijatila

Expert Mode on täysin varusteltu suoratekstinen 6502-assemblyer-editori, joka
toimii lohkoeditorin rinnalla. Jokainen välilehti voi olla joko lohkotilassa tai
asiantuntijatilassa – voit vaihtaa niiden välillä vapaasti milloin tahansa
yläpalkin **Lohko / Asiantuntija** -valitsimella.

### Vaihtotilat

Valitse **UB** -kuvake päätyökaluriviltä vaihtaaksesi Ultimate Basic -tilaan.
Valittu editoritila muistetaan sovelluksen uudelleenkäynnistyksen jälkeen. Uusi
lähdekoodi alkaa:

```basic
väri tausta 0
väri reunus 0

tulosta "TERVEHDYS ULTIMATE BASICILTA"
```

UB-tila toimii `.ub`-lähdetiedostojen kanssa. **Uusi**, **Avaa**, **Tallenna**
ja **Tallenna nimellä** toimivat aktiivisella UB-välilehdellä. Tiedoston `.ub`
avaaminen aktivoi vastaavan editorivälilehden automaattisesti.

Työkalurivi näyttää nykyisen UB-työkansion. Tämä kansio on tallennettu erilleen
Lohko/Asiantuntija-työkansiosta. Kun UB-tila on aktiivinen, **Tiedosto → Aseta
työkansio** valitsee UB-kansion; sen työkaluvihje osoittaa aktiivisen
laajuusalueen. UB:n Avaa/Tallenna-valintaikkunat alkavat siitä, ja
tallentamattomat lähteet käyttävät sitä pohjana suhteellisille `include`- ja
`incbin`-poluille.

### Editorin asettelu

UB-työkalurivi noudattaa samaa visuaalista kieltä ja mukautettuja
työkaluvihjeitä kuin asiantuntijatila. Se tarjoaa:

- syntaksin korostus nykyisen Ultimate Basic -kielireferenssin perusteella;
- rivinumerot, jotka pysyvät synkronoituina pitkien tiedostojen kanssa;
- minikartta ja editorin zoomaussäätimet (`Ctrl` + hiiren rulla myös zoomaa);
  napsauta minikarttaa hypätäksesi tai vedä sen näkymää jatkuvaa vieritystä
  varten;
- Etsi (`Ctrl+F` / `Cmd+F`) asiantuntijatyylisen hakupalkin avulla;
- lähdekoodin muotoilu rakennetietoisella sisennyksellä;
- automaattinen täydennys komennoille ja sisäänrakennetuille funktioille;
- haettava **Komennot** -paneeli, jossa on syntaksi, kuvaus ja käyttöohjeet –
  kuvaukset noudattavat nykyistä käyttöliittymän kieltä (unkari, englanti,
  espanja, saksa, hollanti, puola, italia) ja palaavat englanniksi kaiken muun
  osalta, mitä ei ole vielä käännetty;
- itsenäisesti kytkettävät **Projekti**- ja **Komennot**-paneelit, jotka näkyvät
  vierekkäin, kun molemmat ovat käytössä;
- Itsenäisesti kytkettävät ja koon muutettavat **Build Output**- ja
  **Disassembly**-paneelit; **Disassembly**-, **Monitor**- ja
  **Toolkit**-paneelit jakavat oikeanpuoleisen paneelin (yksi kerrallaan).
  Avoinna olevan paneelin leveydet muistetaan.

Purkamispaneeli sisältää **Kopioi**-painikkeen, joka kopioi koko näytetyn
lähdekoodin leikepöydälle. Komento-ohjeet seuraavat mukana tulevaa kääntäjää:
esimerkiksi `sprite_frame id, data_address [, frame]` valitsee animaatiokuvan
peräkkäisistä 64-tavuisista sprite-kehyksistä.

Editori ymmärtää myös Ultimate Basic 1.6.3:n QBasic-tyylisen syntaksin: `dim
nimi tyyppinä`, `funktio … loppufunktio`, `sub … loppu sub`, `elseif`, `do …
silmukka [while | until]`, `while … wend`, `select case`, `exit do` / `exit for`
/ `exit while` / `exit sub` / `exit function`, merkkijonofunktiot `left$` /
`right$` / `mid$`, ja kommentit, jotka alkavat merkeillä `'` sekä `#` tai `rem`.
Sanat, joita kääntäjä käsittelee avainsanoina vain yhdessä kohdassa, väritetään
vain kyseisessä kohdassa ja pysyvät käyttökelpoisina niminä: `as`
BASIC-tyyppisillä nimillä (`byte`, `integer`, `single`, `double`), `case is`,
`map view`, `wait key` ja `scroll` -vaihtoehdoilla (`row`, `x`, `y`, `vasen`,
`oikea`, `kapea`, `leveä`). **Format** sisentää lohkot `function`, `do … loop`,
`while … wend` ja `elseif` ja jättää yksiriviset silmukat (`do while c : … :
loop`) sisentämättä, Projekti-paneeli listaa lohkot `function` funktioiden alla
ja Komento-paneelissa on **DIM**, **FUNCTION**, **ELSEIF**, **DO**, **WEND**,
**VALITSE TAPAUS**, **LOPPU**, **POISTU ALAKOHDASTA**, **VASEN$**, **OIKEA$** ja
**KESKISIVU$** merkinnät.

Komentoluettelon korkeus on tarkoituksella rajoitettu, jotta komentotietokortti
voi täyttää paneelin jäljellä olevan korkeuden. Tietoalue vierii itsenäisesti
pidempiä syntaksikuvauksia varten.

### Työkalurivin painikkeet

Ultimate Basic -projektit käyttävät `.proj`-tiedostoja ja voivat sisältää useita
`.ub`-lähteitä. Projektipaneeli listaa avoimet tiedostot, merkitsee
tallentamattomat välilehdet ja näyttää löydetyt otsikot, funktiot ja
aliohjelmat. Projektitoimintojen avulla voit luoda, avata, tallentaa ja sulkea
projektin tai lisätä toisen lähdetiedoston. Versioiden hallinta
-valintaikkunassa voit tehdä commitin, vertailla ja palauttaa kaikki projektin
tiedostot yhdessä – katso [Projektitila](#project-mode). Uusi projekti voi myös
alkaa UltimateBasic-mallista – katso [Projektimallit]{2].

Merkitse projektitiedosto **käynnistystiedostoksi** napsauttamalla sen vieressä
olevaa tähteä. Build-, Run-, D64-, C64 Ultimate- ja Debug-komennot kääntävät
kyseisen käynnistyslähteen, vaikka aktiivinen välilehti olisi parhaillaan
toinen. Ilman käynnistysvalintaa käytetään aktiivista UB-välilehteä.

Projektipaneelin työkalupalkissa on kaksi lisäyspainiketta, ja
tiedostovalintaikkunoissa on oletusarvoisesti **UB-työkansio** (Valikko →
Tiedosto → Aseta työkansio, UB-kohtainen):

- **Lisää tiedosto** — valitse yksi tai useampi tiedosto kerralla (mikä tahansa
  tyyppi — `.ub`, `.bin`, `.prg`, kuvat, fontit jne.). Myös `.ub` -lähteet
  avataan editorivälilehtinä; kaikki muu lisätään vain viitteeksi, jotta
  `incbin`/`loadfile` -resurssit siirtyvät projektin mukana.
- **Lisää kansio** — viittaa koko kansioon (esim. `incbin`-resurssihakemistoon,
  kuten `fonts/`), jotta se pysyy liitettynä projektiin.

Puun kansioilla on kutistus-/laajennusnuoli, ja **napsauta kansiota hiiren
kakkospainikkeella** lisätäksesi yhden tai useamman sen alle sisäkkäisen
tiedoston (näkyy sisennettynä). Jokaisella merkinnällä on poistopainike (✕);
muut kuin `.ub`-merkinnät ovat vain viitteellisiä, eikä niitä avata
napsauttamalla.

**Tallenna projekti** -painike poistuu käytöstä ja näyttää tilan "Tallennettu",
kun projektissa ei ole odottavia muutoksia, ja se palautuu automaattisesti
käyttöön heti, kun lisäät, poistat tai järjestelet tiedoston tai kansion.

### Asiantuntijaeditorin minikartta

Asiantuntijaeditorin minikartta on kapea, pieni kaistale (`88 px`) editorialueen
oikeassa reunassa. Se näyttää jokaisen lähdekoodin rivin skaalattuna:

Läpinäkyvä **näkymän ilmaisin** (korostusvärillä varustettu suorakulmio)
näyttää, mikä osa lähteestä on tällä hetkellä näkyvissä. Napsauta mitä tahansa
kohtaa minikartalla siirtyäksesi kyseiseen kohtaan; vedä vierittääksesi
jatkuvasti. Minikartta vierii itsenäisesti pitäen näkyvyyden ilmaisimen
keskitettynä. Tila säilyy käyttöliittymäasetuksissa (`expertMinimap`-näppäin).

- Tuloste tulee näkyviin automaattisesti;
- kääntäjävirheet näkyvät punaisena;
- keskitetty käännösikkuna näyttää virheen;
- Lähderivillä varustetut virheet valitsevat kyseisen rivin aktiivisessa
  UB-editorissa.

Build Info raportoi lataus-/loppuosoitteet, koodin ja PRG-koot, Exomizer-tilan,
muuttujat, taulukot, funktiot/aliohjelmat ja otsikot.

### Koodin koko riviä kohden ja vihjeet

Työkalurivin **koodin koko** -painike (liekkikuvake) näyttää koonnin jälkeen,
kuinka moneksi tavuksi kukin lähdekoodin rivi käännettiin – numero on
rivinumerovälillä ja oranssi palkki näyttää sen painoarvon kalleimpaan riviin
verrattuna. Tilarivi lisää kohdistimen alla olevan rivin tavut ja arvioidun
syklien määrän (suora, silmukoita ei lasketa).

Kirjoittaessasi tilariville ilmestyy **hints**-painike, kun jokin näyttää olevan
vialla. Napsauta sitä nähdäksesi luettelon ja napsauta vihjettä siirtyäksesi
riville:

- `sys $EA31` / `sys $EA81` — `sys` kääntyy `JSR`-tiedostoksi, joten KERNALin
  `RTI` palaa roskiin; IRQ:n jälkeen käytä `irq_exit` tai `asm { JMP $EA31 }`;
- `wait key` — ei dokumentoitu muoto, käytä `waitkey`;
- `muuttuja` / `dim` / `vakio`, jota ei koskaan käytetä;
- koonnin jälkeen: `asm`-lohkokäsky nollasivuosoitteessa, joka sisältää Ultimate
  Basic -muuttujan tai ajonaikaisen ympäristön oman nollasivun.

### Virhe korostuksessa

Kääntymättömät rivit korostetaan reaaliajassa punaisella **** (sävytetty tausta
+ vasen aksenttireunus) 350 ms jokaisen näppäinpainalluksen jälkeen. Ensimmäinen
virheilmoitus näkyy myös tilarivillä. Korjaa rivi, niin korostus katoaa
automaattisesti.

| Suoritustila                  | Perimmäinen peruskäyttäytyminen                                                                                                                               |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Suorita PRG:nä**            | Käännä ja käynnistä PRG suoraan VICE:ssä.                                                                                                                     |
| **Suorita D64:n kautta**      | Käännä, avaa D64:n tavallinen pakkausvalintaikkuna ja käynnistä sitten levy VICE:ssä.                                                                         |
| **Aja Ultimatella**           | Lataa ja suorita PRG konfiguroidun C64 Ultimate REST -yhteyden kautta.                                                                                        |
| **Suorita D64 laitteistolla** | Pakkaa D64 ja lähetä se konfiguroituun C64 Ultimateen.                                                                                                        |
| Kung Fu Flash 2               | Käännä UB:n käynnistyslähdekoodi ja lataa PRG USB:n kautta oikeaan C64/C128-tietokoneeseen, jossa on Kung Fu Flash 2 -äänikortti. Katso [Kung Fu Flash 2]{1]. |

Globaali **Suorita Exomizerilla** -vaihtoehto (**Asetukset → Yleiset →
Ohjelma**) koskee myös UB-koontiversioita ja normaalin ajon kohteita; erillistä
UB-työkalurivin vaihtokytkintä ei tarvita. Virheenkorjauskäynnistykset käyttävät
tarkoituksella pakkaamatonta PRG:tä, jotta kääntäjän osoitteet ja symbolit
vastaavat edelleen suoritettavaa ohjelmaa.

Ota käyttöön **Asetukset → Yleiset → Ohjelma → Luo UltimateBasic ASM -lähdekoodi
(.asm)** tallentaaksesi kääntäjän luoman kokoonpanon PRG- tai
D64-koontitiedoston viereen käyttäen samaa perustiedostonimeä. Tämä on
koontivaihtoehto, joten UB-työkalurivi ei sisällä erillisiä
ASM-vientipainikkeita. `load "NIMI", $osoite` -lauseke antaa myös vastaavan
D64-lisätiedoston PRG-latausosoitteen.

### Syntaksikorostus

Editori käyttää läpinäkyvää `<div>`-peittokuvaa (`expert-hl`), joka peilaa
tekstialueen sisällön värillisillä `<span>`-elementeillä. Korostuksen voi
poistaa käytöstä **HL**-painikkeella, mikä parantaa suorituskykyä erittäin
suurissa ohjelmissa.

- `.sym` KickAssembler-tyylisille symboleille;
- `.dbg` C64Debugger/RetroDebugger -lähdekoodin ja segmentin tiedoille;
- `.vs` VICE-näyttöjen nimille.

`ALUE` / `ENDREGION` -direktiivit on korostettu kuten muutkin
assembler-direktiivit. Kutistetut alueet pitävät vain alueen otsikon näkyvissä
editorissa, kunnes avaat ne uudelleen. Uusi **Alueen valinta** -työkalurivin
kytkin ohjaa vain automaattista nykyisen alueen korostusta asiantuntijatilassa;
sen poistaminen käytöstä pitää lähdekoodin näkyvissä muuttamatta taittotilaa.

### Lähdekoodin muotoilija

Napsauta **Format**-painiketta (`#expert-format-btn`) muotoillaksesi nykyisen
lähteen automaattisesti:

Ultimate Basic on saatavilla myös itsenäisenä avoimen lähdekoodin projektina:

<https://github.com/zstarczali/UltimateBasic>

Kääntäjä on integroitu Visual Assembleriin, joten erillistä
`ub`-suoritustiedostoa ei tarvita ajonaikana.

## 7. Osoitustavat

Jokainen 6502-käsky tukee yhtä tai useampaa osoitustilaa. Tilavalitsin näkyy
jokaisessa lohkossa.

### Merkitse lausekkeet operandeiksi

- **Lohko → Asiantuntija:** Nykyinen ohjelma sarjoitetaan tekstiksi (yksi käsky
  riviä kohden, otsikot, makrot direktiiveinä). Asiantuntija-tilassa tehdyt
  muokkaukset synkronoidaan takaisin lohkotaulukkoon aina, kun vaihdat takaisin
  tai käynnistät toiminnon.
- **Asiantuntija → Lohko:** teksti jäsennetään ja tulos korvaa lohko-ohjelman.
  Jos jäsennys epäonnistuu, näkyviin tulee käännösvirhe-ikkuna.
- **Tyhjät rivit** säilyvät tekstinkerroissa: tyhjät rivit näkyvät
  Expert-editorissa ohuina katkoviivoina välilyönteinä lohkotilassa ja
  palautetaan tyhjinä riveinä, kun palataan Expert-tilaan.

### Lausekkeissa oleva `*`-ohjelmalaskuri

```
┌───────────────────────────────────────────────────────
│ [työkalurivi] Lohko │ Asiantuntija < välilehti │
├────────────┬─────────────────────────────┬────────────┤
│ Paletti │ ASM-tekstieditori │ Disasm │
│ (valinnainen) │ (monospace, muokattava) │ paneeli │
│ │ │ (valinnainen) │
└────────────┴────────────────────────────┴────────────┘
```

| Paneeli       | Vaihda                          | Kuvaus                                               |
| ------------- | ------------------------------- | ---------------------------------------------------- |
| **Paletti**   | `#asiantuntijapaletin-painike`  | Haara itseensä (ääretön silmukka, offset `$FE`)      |
| `*-n` / `*+n` | `BNE *-5`, `BEQ *+4`            | Haarautuminen suhteessa nykyiseen PC:hen *n* tavulla |
| `JMP *+n`     | `#asiantuntijan-disasm-painike` | Absoluuttinen hyppy laskettuna nykyisestä PC:stä     |

### Paikalliset (pisteviivalla) tunnisteet

| Painike                               | Henkilöllisyystodistus                                                   | Toiminto                                                                                                                                                                                                                                                                                                             |
| ------------------------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Muoto**                             | `#asiantuntijan-muotoilu-painike`                                        | Lähteen automaattinen muotoilu (otsikot sarakkeeseen 0, 4-välilyöntinen sisennys, 1-välilyöntinen muistikoodi/operandi)                                                                                                                                                                                              |
| **Lataa .asm-tiedosto**               | `#expert-load-asm-btn`                                                   | Avaa `.asm`-tiedosto — sisältö ladataan **uuteen välilehteen**, jonka välilehden otsikkona on tiedostonimi. Jokaisesta ladatusta tiedostosta tulee itsenäinen välilehti, jolla on omat ohjelmalohkonsa ja editoritilansa.                                                                                            |
| **Tallenna .asm-tiedosto**            | `#asiantuntijan-tallennus-asm-painike`                                   | Tallenna editorin sisältö tiedostoon `.asm` (tiedostovalintaikkuna ensimmäisen tallennuksen yhteydessä). Lähdetiedosto saa aina tekstinsä: Ctrl+S, **Valikko → Tallenna**, ja tallennusvalintaikkunalle annetaan nimi `.asm`, `.s`, `.inc`, `.a`, `.a65` tai `.lib`. Älä koskaan kirjoita VA JSON -tiedostoa siihen. |
| **Rakennuksen tiedot**                | `#expert-build-info-btn`                                                 | Avaa Rakennetiedot-valintaikkuna: alkupiste, loppupiste, koko ja segmenttien määrä ylhäällä, sitten segmentit, virheet (`file:line` Kick-projektissa) ja `.print` -tuloste sekä otsikot, vakiot ja makrot sarakkeissa                                                                                                |
| **Automaattinen täydennys**           | `#asiantuntijan-automaattisen-täydennyksen-painike`                      | Ota asiantuntijan automaattisen täydennyksen ehdotukset käyttöön/pois käytöstä. Kun tämä on poistettu käytöstä, asiantuntijaeditorissa ei näy ohjeita, muistisääntöjä tai otsikoita.                                                                                                                                 |
| **Alueen valinta**                    | `#asiantuntija-alueen-valintapainike`                                    | Ota automaattinen alueen korostus käyttöön asiantuntijatilassa. Taittotila pysyy tallennettuna, mutta kun tämä on pois päältä, editori pitää koko lähdekoodin näkyvissä eikä valitse nykyistä aluetta automaattisesti.                                                                                               |
| **Suuntaa / laajentaa kaikki alueet** | `#expert-region-fold-all-btn`                                            | Taita tai avaa jokainen `.region`-lohko yhdellä napsautuksella. Jos jokin alue on parhaillaan auki, painike kutistaa ne kaikki; jos kaikki alueet on jo kutistettu, seuraava napsautus laajentaa ne kaikki. Painike syttyy, kun kaikki alueet on kutistettu.                                                         |
| **Rivinumerot**                       | `#asiantuntijan-rivinumerot-painike`                                     | Rivinumerovälin pitäminen päällä/pois editorin vasemmalla puolella. Väliviiva pysyy synkronoituna vierityskohdan kanssa ja päivittyy reaaliajassa kirjoittaessasi.                                                                                                                                                   |
| **Etsi**                              | `#asiantuntijan-etsintäpainike`                                          | Avaa kelluva hakupalkki (`Ctrl+F`). Kirjoita hakeaksesi; osumat näkyvät korostettuna hakukentässä. `Enter` / `Shift+Enter` selaa osumien välillä. `Esc` sulkee palkin.                                                                                                                                               |
| **Loitonna / lähennä**                | `#asiantuntijan-loitonnuspainike` / `#asiantuntijan-loitonnuspainike`    | Pienennä/suurenna editorin fonttikokoa (8–28 px). `Ctrl` + hiiren rulla (`Cmd` + rulla macOS:ssä tai nipistys kosketuslevyllä) editorin päällä tekee saman. Asetus pysyy voimassa.                                                                                                                                   |
| **Paletti**                           | `#asiantuntijapaletin-painike`                                           | Näytä/piilota vasen muistitoimintojen paletti                                                                                                                                                                                                                                                                        |
| **Disasm**                            | `#asiantuntijan-disasm-painike`                                          | Näytä/piilota purkupaneeli (puhdas 6502, makrot laajennettu)                                                                                                                                                                                                                                                         |
| **Näyttö**                            | `#asiantuntijan-monitorin-painike`                                       | Näytä/piilota näytön heksadecimaalinen vedospaneeli; muuta sen kokoa vetämällä sen vasemmalla puolella olevaa jakajaa                                                                                                                                                                                                |
| **Työkalupaketti**                    | `#asiantuntijatyökalupakki-painike`                                      | Näytä/piilota [Toolkit](#toolkit-tab) -sivupaneeli (C64-paletti, PETSCII-koodit); koon muuttaminen mahdollista kuten Monitorissa                                                                                                                                                                                     |
| **Minikartta**                        | `#asiantuntijan-minikarttapainike`                                       | Näytä/piilota koodin minimap-nauha editorin oikealla puolella                                                                                                                                                                                                                                                        |
| **Projektipaneeli**                   | `#asiantuntijaprojektin-painike`                                         | Näytä/piilota projektipaneeli (tiedostot, symbolit, projektiasetukset)                                                                                                                                                                                                                                               |
| **Syklien määrä**                     | `#asiantuntijasyklien-painike`                                           | Näytä/piilota syklin katuviiva — katso [Syklien määrät](#cycle-counts)                                                                                                                                                                                                                                               |
| **Siirry riville / Kirjanmerkit**     | `#asiantuntija-siirry-rivipainikkeeseen`, `#asiantuntija-kirjanmerkki-*` | Ctrl+G hyppää riville; Ctrl+F2 vaihtaa kirjanmerkin, F2 / Shift+F2 siirtyy seuraavaan / edelliseen                                                                                                                                                                                                                   |
| **Rakenna ACME**                      | `#expert-acme-build-btn`                                                 | ACME-tilassa: rakenna lähdekoodi ACME:llä — katso [ACME-tila](#acme-mode)                                                                                                                                                                                                                                            |

Avoimeksi jättämäsi paneelit (Palette, Disasm, Monitor, Toolkit, Project) ja
niiden leveydet palautetaan seuraavan käynnistyksen yhteydessä riippumatta
siitä, missä tilassa sovellus käynnistyy.

*(Uutta versiossa 2.3.9.)* Pisteellä alkava tunniste — `.loop`, `.skip`, `.done`
— on **paikallinen tunniste**. Se kuuluu lähimmän edeltävän **global**
(ei-pisteellinen) tunnisteen piiriin ja siitä tulee sisäisesti
`<global>.<nimi>`. Kaksi paikallista tunnistetta, joilla on sama lyhyt nimi eri
globaalien tunnisteiden alla, eivät törmää **ei**.

### Itsemuokkaavan koodin operanditunnisteet

*(Uutta versiossa 2.3.9.)* Lisää käskyn operandin etuliitteeksi `tunniste:`, jos
haluat asettaa tunnisteen **operandin tavulle** operaatiokoodin sijaan. Käsky
kootaan kaksoispistettä seuraavasta kohdasta.

| Palkin väri      | Tunnuksen tyyppi                                        |
| ---------------- | ------------------------------------------------------- |
| Kommentin väri   | Viivat, jotka alkavat merkeillä `;`                     |
| Tarran väri      | Rivit, joiden määritelmä on `:`                         |
| Direktiivin väri | `.byte`, `.macro`, `.region` ja kaikki muut direktiivit |
| Muistiväri       | Kaikki muu (ohjeet)                                     |

`arvo` osoittaa kohtaan `<käskyosoite> + 1` (ensimmäinen operanditavu) jokaista
osoitustilaa varten. Tämä korvaa vanhemman `STA-käskyn+1` / `-käskyn: LDA #$00`
kuvion. Se kiertää lohkon ⇄ asiantuntijatilan läpi (operandikenttä säilyttää
etuliitteen `tunniste:`).

### Syklien määrät

Työkalurivin **syklien lukumäärä** -painike (kellokuvake) lisää väliviivan, joka
näyttää jokaisen käskyrivin 6510 sykliä:

| Näytetään        | Merkitys                                                                                                                              |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `4`              | kiinteät kustannukset                                                                                                                 |
| `4+`             | indeksoitu luku (`abs,X`, `abs,Y`, `(zp),Y`): +1, kun indeksi ylittää sivun; sivulle tasattu kantaluku (`$xx00`) näyttää tarkan arvon |
| `2/3`            | haara: ei otettu / otettu                                                                                                             |
| `2/4` (punainen) | sivun ylittävä haara – hyvä tietää ajoitetussa koodissa                                                                               |

Valitse useita rivejä, niin tilarivi näyttää summan: käskyjen lukumäärän,
min–max-syklien määrän ja PAL-rasteririvien lukumäärän (63 sykliä). Makroja ja
datarivejä ei lasketa. Asetus muistetaan.

### Optimointivihjeitä

Asiantuntijaeditori tarkistaa kootusta koodista yleisiä kurkistusreikien
kuvioita. Vihjeellä varustetut rivit saavat keltaisen raidan ja tilariville
ilmestyy **N hints** -painike; napsauta sitä nähdäksesi luettelon ja napsauta
vihjettä siirtyäksesi riville. Vihjeet eivät koskaan muuta koodiasi:

- `JSR x`, jota seuraa `RTS` → `JMP x` (1 tavu lyhyempi, 9 sykliä nopeampi);
- `CMP #0` / `CPX #0` / `CPY #0` heti sellaisen käskyn jälkeen, joka on jo
  asettanut N/Z:n kyseiselle rekisterille (huom: vertailu asettaa myös C:n);
- sama kuorma kahdesti tai juuri tallennetun arvon kuorma (`STA x` / `LDA x`);
- `LDA m` / `CLC` / `ADC #1` / `STA m` → `INC m`, ja `SEC` / `SBC #1` -muoto →
  `DEC m`;
- `JMP` tai haara aivan seuraavaan käskyyn ja `PHA` välittömästi sen jälkeen
  `PLA`.

Kahden käskyn välinen tunniste (mahdollinen hyppykohde) estää vihjeet, jotka
yhdistäisivät ne.

### Virhe korostuksessa

Kääntymättömät rivit korostetaan reaaliajassa punaisella **** (sävytetty tausta
+ vasen aksenttireunus) 350 ms jokaisen näppäinpainalluksen jälkeen. Ensimmäinen
virheilmoitus näkyy myös tilarivillä. Korjaa rivi, niin korostus katoaa
automaattisesti.

### Syntaksikorostus

Editori käyttää läpinäkyvää `<div>`-peittokuvaa (`expert-hl`), joka peilaa
tekstialueen sisällön värillisillä `<span>`-elementeillä.

| Väri         | Tunnus                                                                                                                                                                 |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Keltavihreä  | Muistitekniikat (`LDA`, `STA`, `JMP`, …) ja pitkän haaran pseudo-operaatiot (`LBNE`, `LBEQ`, …)                                                                        |
| Sininen      | Direktiivit (`.byte`, `.word`, `.fill`, `.assert`, `*=`, …)                                                                                                            |
| Oranssi      | Numerot (`$FF`, `%1010`, `255`)                                                                                                                                        |
| Syaani       | Otsikot — rivit, jotka päättyvät `:`, mukaan lukien paikalliset otsikot (`.loop:`) ja itseään muokkaavan koodin operandin otsikot (`value:` kohdassa `LDA value:#$00`) |
| Sinivihreä   | Merkkijonoliteraalit                                                                                                                                                   |
| Violetti     | Mukautettujen makroiden nimet — nimi kutsujen `.macro`, `.invoke` ja `.call` sekä Kick-tyylisten `:name(...)` jälkeen                                                  |
| Vesi         | Makroparametrit — `.macro`-otsikko-osan parametrien nimet ja makron rungon `{param}`-korvaukset                                                                        |
| Tummanvihreä | Kommentit (`; …`)                                                                                                                                                      |

`ALUE` / `ENDREGION` -direktiivit on korostettu kuten muutkin
assembler-direktiivit. Kutistetut alueet pitävät vain alueen otsikon näkyvissä
editorissa, kunnes avaat ne uudelleen. Uusi **Alueen valinta** -työkalurivin
kytkin ohjaa vain automaattista nykyisen alueen korostusta asiantuntijatilassa;
sen poistaminen käytöstä pitää lähdekoodin näkyvissä muuttamatta taittotilaa.

### Lähdekoodin muotoilija

Napsauta **Format**-painiketta (`#expert-format-btn`) muotoillaksesi nykyisen
lähteen automaattisesti:

- Tunnistemääritelmät siirretään sarakkeeseen 0.
- Ohjeet on sisennetty neljällä välilyönnillä.
- Muistisääntö kirjoitetaan isoilla kirjaimilla.
- Täsmälleen yksi välilyönti muistimerkinnän ja operandin välillä (ylimääräinen
  välilyönti normalisoidaan).
- Jos lähde on jo alustettu, näytetään tila `"Jo alustettu"`.

### Projektipaneeli ja välilehdet

Asiantuntijatila tukee **projektipaneelia** (`#expert-project-panel`)
monitiedostoisille `.proj`-projekteille:

- `.proj`-tiedosto on JSON-manifesti, joka listaa lähdetiedostot ja niiden
  metatiedot.
- Avaa projekti valitsemalla **-valikko → Tiedosto → Avaa projekti** tai
  raahaamalla `.proj`-tiedosto ikkunaan.
- Jokainen projektin tiedosto avautuu erillisenä **-välilehtenä** editorin
  yläreunassa olevassa välilehtipalkissa.
- **Sulje projekti** (`Valikko → Tiedosto → Sulje projekti` /
  `#menu-close-project`) sulkee nykyisen projektin ja kaikki sen
  tiedostovälilehdet kerralla. Kehottaa tallentamaan tallentamattomat muutokset
  ennen sulkemista. Projektipaneeli palautuu tyhjään tilaansa.
- Jokainen tiedosto voidaan merkitä **käynnistystiedostoksi** (★ tähtikuvake).
  Kun käynnistystiedosto on asetettu, **Suorita** -painike (PRG, D64, Ultimate)
  kokoaa ja suorittaa aina kyseisen tiedoston koodin – riippumatta siitä, mikä
  välilehti on kulloinkin aktiivinen. Tämä toimii sekä lohkotilassa että
  asiantuntijatilassa.
- Työkalupalkin **Lisää**-painike valitsee kerralla yhden tai useamman tiedoston
  (minkä tahansa tyyppisen, ei vain `.json`/`.asm`) ja viittaa niihin
  projektissa avaamatta niitä – käytä sitä binääriresursseille, kuten
  `incbin`-datalle. Sen valintaikkuna on oletusarvoisesti VA-työkansio.
  Viereinen **Lisää kansio**-painike viittaa koko kansioon (esim.
  resurssihakemistoon) samalla tavalla. Vain viittauksiin tarkoitetuissa
  merkinnöissä näkyy poistopainike (✕), mutta niitä ei avata napsauttamalla
  niitä.
- **Projektin asetukset** (rataspainike paneelin otsikossa tai **Valikko →
  Tiedosto → Projektin asetukset…**) näyttää ja muokkaa projektia: nimi, `.proj`
  polku, käynnistystiedosto, assembler (VMA tai ACME),
  **KickAssembler-yhteensopiva** ja Kick-projektille esikäsittelijän symbolit
  (`#define`, kuten KickAssemblerin `-define`) ja komentorivimuuttujat
  (`cmdLineVars`, yksi `name=value` riviä kohden, kuten `:name=value`),
  VMA-projektille sen symbolit (`.define`) ja vakiot (`.const`, yksi
  `NAME=value` riviä kohden) — ne tulevat ennen lähdekoodia, josta projekti
  kootaan, joten `.if NAME` / `.if NAME == 3` vaihtaa koontia muokkaamatta
  lähdekoodia — sekä lähdekoodin ja muiden tiedostojen lukumäärän, ja **Vain
  asiantuntijatila**: lohkotila on suljettu projektin tiedostoille koosta
  riippumatta. Kaikki tallennetaan `.proj`-tiedostoon.
- Puun kansioilla on kutistus-/laajennusnuoli, ja **napsauta kansiota hiiren
  kakkospainikkeella ** lisätäksesi yhden tai useamman tiedoston sen alle (näkyy
  sisennettynä).
- **Tallenna projekti** -painike poistuu käytöstä ja näyttää tilan
  "Tallennettu", kun projektissa ei ole odottavia muutoksia, ja se palautuu
  automaattisesti käyttöön heti, kun lisäät, poistat tai järjestelet tiedoston
  tai kansion.
- Projektipaneelin alareunassa olevan **symbols**-osion kokoa voidaan muuttaa
  pystysuunnassa tiedostopuun ja symboliluettelon välisellä jakajalla, joten
  pitkät symboliluettelot voivat viedä enemmän tilaa tarvittaessa.
- **Versiohallinta** toimii koko projektille: Versiohallinta-valintaikkunan
  **Projekti**-kytkimellä yksi commit tallentaa jokaisen projektitiedoston ja
  Checkout palauttaa ne kaikki välilehdille. Katso [Projektitila]{1].

### Välilehtipalkki

Välilehtipalkki näkyy editorin yläpuolella, kun avoinna on useampi kuin yksi
välilehti.

| Ominaisuus                   | Kuvaus                                                                                                                                                                                                                                                                                                                                                                              |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Likainen piste**           | Pieni korostusvärinen piste välilehden nimessä osoittaa tallentamattomat muutokset                                                                                                                                                                                                                                                                                                  |
| **Vieroitusnäppäimet**       | Vasen/oikea vierityspainikkeet tulevat näkyviin, kun välilehtiä on enemmän kuin palkkiin mahtuu                                                                                                                                                                                                                                                                                     |
| **Sulje (×)**                | Sulkee välilehden; kehottaa tallentamaan, jos välilehti on likainen                                                                                                                                                                                                                                                                                                                 |
| **Tiedostopääte**            | Tiedoston koko nimi tiedostopäätteineen (`.json`, `.asm`, `.ub` …) näytetään.                                                                                                                                                                                                                                                                                                       |
| **Ctrl+N**                   | Avaa uuden, tyhjän välilehden (ei modaalisen valintaikkunan ollessa auki)                                                                                                                                                                                                                                                                                                           |
| **Kakkospainikkeen valikko** | Napsauta välilehteä (tai tyhjää välilehtipalkin tilaa) hiiren kakkospainikkeella seuraaville: **Uusi välilehti**, **Sulje välilehti**, **Sulje muut välilehdet**, **Sulje oikeanpuoleiset välilehdet**, **Sulje kaikki välilehdet**. Eräsulkemistoiminnot kehottavat jokaista likaista välilehteä ja pysähtyvät, jos peruutat. **Sulje kaikki** pitää aina yhden tyhjän välilehden. |

> **Vinkki:** Paletin synkronointi (`#expert-palette-sync-btn`) pitää
> palettivalinnan synkronoituna kohdistimen kohdalla olevan muistimerkin kanssa.
> Poista se käytöstä, jos et halua paletin hyppivän muokkaamisen aikana.

### ACME-tila

**Asetukset → Yleiset → Assembler-tila** valitsee Expert-editorin assemblerin:

- **VMA-tila** (oletus) — sisäänrakennettu Visual Assembler -assembler
  lohkoineen, makroineen ja `.`-direktiiveineen.
- **ACME-tila** — lähdekoodi on ACME 0.97 -tekstiä, ja sen on rakentanut
  ACME-suoritettava tiedosto, joka on asetettu kohdassa **Asetukset → Tiedostot
  ja polut → ACME** (**Valitse ACME**). `ACME-0.97-reference.pdf` kuvaa kielen.

Tila tallennetaan `.proj`-projektilla, joten jokainen projekti avautuu omalla
assemblerillaan. ACME-tila on vain tekstinmuokkaustila: Lohko /
Asiantuntija-kytkin on lukittu ja **Ohjeet**-painike on piilotettu (oppitunnit
rakentavat VMA-ohjelmia lohkoista).

Mitä seuraa ACME-koontiversiosta:

- **Build** (vasarapainike asiantuntijatyökalupalkissa, *Build ACME
  -lähdekoodi*), **Run** (PRG, D64, C64 Ultimate, Ultimate emulator, Kung Fu
  Flash 2), **Build PRG**, **Build D64**, **Build CRT**, **Build-projekti** ja
  **Debug (RetroDebugger)** kääntyvät ACME:n kautta; ACME-virheet ja
  -varoitukset avautuvat normaalissa käännösvirhe-valintaikkunassa
  lähdekoodirivillä.
- Kirjoitustauon jälkeen lähdekoodi rakennetaan uudelleen, joten
  **muistikartta** (muistiliuska, segmenttipaneeli, päällekkäisyysvaroitus),
  **Disassembly**- ja **Monitor**-paneelit sekä syklin jono näyttävät todellisen
  ACME-lähdön; paneelit käyttävät ACME-tunnisteita. Päällekkäisyys on osoite,
  jonka kaksi lähdekoodiriviä kirjoittaa (jälkimmäinen voittaa PRG:ssä).
- **Virheenkorjaustiedostot** (*Luo virheenkorjaustiedostot* Asetukset →
  Yleiset) luodaan ACME-otsikkotiedostosta: `.sym` (KickAssembler-tyyliin) ja
  `.vs` (VICE-otsikot) PRG:n vieressä; ACME-tilassa ei ole `.dbg`
  lähdekoodikarttaa. **Debug (RetroDebugger)** saa samat otsikot, ja
  ACME-raportti sijoittaa Expert-keskeytyspisteet (koodittomalla rivillä oleva
  keskeytyspiste pysähtyy seuraavalle koodiriville).
- **Syklien määrät** ja **optimointivihjeet** tulevat viimeisimmän koontiversion
  ACME-raportista (`-r`).
- **VICE Monitor** -latausohjelma kirjoittaa vain ACME:n todellisuudessa luomat
  osoitealueet; reaaliaikainen watch ja profiler käyttävät ACME:n tunnisteita ja
  lähdeviivoja.
- **Vie SID-, Hi-Res-, Level-, Curve- ja Table-editorien lohkoihin** lisää
  ACME-lähdekoodin tiedoston loppuun (`!byte`, `!word`, `!fill`, `NAME = value`;
  VA-makrot kirjoitetaan ohjeina).

Korostus ja automaattinen täydennys osaavat ACME-syntaksin: `!` pseudo-opkoodit,
`+nimi` makrokutsut, otsikot ilman kaksoispistettä, anonyymit `-` / `+` otsikot
ja `;` kommentit. VMA-direktiivi (`.byte`, `.macro` …) ACME-lähdekoodissa ja
ACME `!` direktiivi VMA-lähdekoodissa raportoidaan virheinä.

```asm
* = $c000
aloitus ldx #0
- lda teksti,x
beq +
sta $0400,x
inx
bne -
+ rts
teksti !scr "hello acme", 0
```

`samples/ACME/acme-crt-demo.asm` on pieni ACME-testausohjelma Run-, Build PRG /
D64- ja Build CRT -komennoille: viesti näytön keskellä ja rasteriväripalkit
reunassa, ilman KERNAL-kutsuja, joten se toimii myös kasetilta.

---

## 8. Vakio-ohjeet 6502

Jokainen 6502-käsky tukee yhtä tai useampaa osoitustilaa. Tilavalitsin näkyy
jokaisessa lohkossa.

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

### Vakiot nollasivulla

Vain vakioista (`.const`, `name = value`, a `.var`) koostuva operandi, joka
mahtuu tavuun, ottaa käskyn **zero-page** -tilan, täsmälleen samalla tavalla
kuin numero: `.const zp = $FB`:n jälkeen `lda zp` muodostaa `A5 FB`:n (2 tavua,
3 sykliä) ja `lda zp,x` muodostaa `B5 FB`. Tila, jolla käskyllä ei ole
nollasivuista muotoa, pysyy absoluuttisena (`lda zp,y` → `B9 FB 00`). Nimikettä
ei rajata – sen osoite tiedetään vasta asettelun jälkeen – ja `lda.abs zp`
pakottaa absoluuttisen tilan. Numero säilyttää kirjoitusleveyden: `$FB` on
nollasivu, `$00FB` on absoluuttinen. *(Uutta versiossa 2.1.)*

### Tiedonsiirto

Mikä tahansa operandikenttä, joka hyväksyy osoitteen tai välittömän arvon,
hyväksyy myös suoraan **vakion nimen** (`CONST`-lohkosta tai `LABEL`-lohkosta).
Lisäksi voit käyttää **label+offset**- tai **label−offset**-lausekkeita
viitataksesi osoitteeseen suhteessa nimettyyn vakioon:

| Syntaksi       | Esimerkki                           | Kuvaus                                                                                                            |
| -------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `LDA`          | Kuorma-akku                         | välitön, nollasivu, absoluuttinen, absoluuttinenX, absoluuttinenY, epäsuoraX, epäsuoraY                           |
| `LDX`          | Lataa X-rekisteri                   | välitön, nollasivu, nollasivuY, absoluuttinen, absoluuttinenY                                                     |
| `LDY`          | Lataa Y-rekisteri                   | välitön, nollasivu, absoluuttinen, absoluuttinenX                                                                 |
| `STA`          | Säilytä akkumulaattori              | nollasivu, absoluuttinen, absoluuttinenX, absoluuttinenY, epäsuoraX, epäsuoraY                                    |
| `$hex+lauseke` | `LDA $1234+1`, `STA $0400+40*2,X`   | Mikä tahansa numeroiden, tunnisteiden ja vakioiden lauseke *(2.1)*                                                |
| `(etiketti)`   | `JMP (vektori)`, `JMP (taulukko+2)` | Epäsuora hyppy otsikon tai lausekkeen kautta *(2.1)*                                                              |
| `STX`          | Myymälä X kassa                     | nollaSivu, nollaSivuY, absoluuttinen                                                                              |
| `STY`          | Myymälän Y-kassa                    | nollasivu, absoluuttinen                                                                                          |
| `*`            | `BNE *`                             | Nykyinen ohjelmalaskuri (käskyn oma osoite); haarat, joissa on `*`, luovat äärettömän itsesilmukan (offset `$FE`) |

**Esimerkki — kahden näyttösivun tyhjentäminen CONST:**-muuttujalla
```
; .CONST näyttömuisti = $0400
LDX #$00
tyhjennä:
STA näyttömuisti,X
STA näyttömuisti+$0100,X
DEX
BNE tyhjennä
```

### Aritmeettinen

*(Uutta versiossa 2.3.9.)* `*` ei enää rajoitu olemaan koko operandi – se voi
esiintyä **missä tahansa operandilausekkeen sisällä** ja edustaa sen käskyn
osoitetta, johon se on kirjoitettu. Se ratkaistaan kokoonpanovaiheessa kyseisen
käskyn todellista osoitetta vasten, joten lyhyille suhteellisille hyppyille tai
PC:hen suhteellisille datan lukukerroille ei tarvita tunnistetta.

| Syntaksi   | Esimerkki          | Merkitys                                                               |
| ---------- | ------------------ | ---------------------------------------------------------------------- |
| `*`        | `BNE *`            | Aseta kantoaika useimmissa tapauksissa `SEC`-asetuksilla ennen käyttöä |
| `SBC`      | Vähennä ja kanna   | Aseta siirto `SEC` ennen vähennyslaskua                                |
| `SISÄLTÄÄ` | Muistin lisääminen | —                                                                      |
| `DEC`      | Vähennä muistia    | —                                                                      |
| `CMP`      | Vertaa A:han       | Asettaa liput; ei muokkaa A:ta                                         |

**PC vs. kertolasku.** `*` käsitellään ohjelmalaskurina vain, kun se on
*arvopaikalla* — lausekkeen alussa tai heti operaattorin `(`, `,`, `<`, `>` tai
välilyönnin jälkeen. Numeron `)` tai tunnisteen perässä oleva `*` on tavallinen
kertolasku, joten `LDA-taulukko*2` ja `CONST_A*4` pysyvät muuttumattomina.

**Missä se toimii.** Mikä tahansa operandi, joka jo hyväksyy lausekkeen:
haarautumiskohteet, `JMP` / `JSR`, `LDA`/`STA`/… absoluuttiset ja indeksoidut,
välittömät matalan/korkean tavun operaattorit ja `.assert`-lauseke. `*` ei
koskaan muuta käskyn kokoa, joten se on turvallinen kaikissa osoitustiloissa.

### Logiikka

*(Uutta versiossa 2.3.9.)* Pisteellä alkava tunniste — `.loop`, `.skip`, `.done`
— on **paikallinen tunniste**. Se kuuluu lähimmän edeltävän **global**
(ei-pisteellinen) tunnisteen piiriin ja siitä tulee sisäisesti
`<global>.<nimi>`. Kaksi paikallista tunnistetta, joilla on sama lyhyt nimi eri
globaalien tunnisteiden alla, eivät törmää **ei**.

```
DrawSprite:
LDX #0
.loop: ; == DrawSprite.loop
LDA SpriteData,X
STA $2000,X
INX
CPX #63
BNE .loop ; ratkeaa DrawSpriten sisällä
RTS

ClearScreen:
LDX #0
.loop: ; == ClearScreen.loop — ei törmäystä
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
- Paikalliset otsikot kulkevat edestakaisin lohko ⇄ asiantuntija -tilassa
  muuttumattomina; etuliite `<globaali>.` on asetteluaikainen yksityiskohta,
  eikä sitä koskaan tallenneta lohko-ohjelmaan.

### Hypyt ja oksat

*(Uutta versiossa 2.3.9.)* Lisää käskyn operandin etuliitteeksi `tunniste:`, jos
haluat asettaa tunnisteen **operandin tavulle** operaatiokoodin sijaan. Käsky
kootaan kaksoispistettä seuraavasta kohdasta.

```
asennus:
LDA-arvo:#$00 ; 'arvo' -> operandin #$00 tavun osoite
...
korjaus:
LDA #new
STA-arvo ; kirjoittaa operandin tavun suoraan — klassinen SMC
```

`arvo` osoittaa kohtaan `<käskyosoite> + 1` (ensimmäinen operanditavu) jokaista
osoitustilaa varten. Tämä korvaa vanhemman `STA-käskyn+1` / `-käskyn: LDA #$00`
kuvion. Se kiertää lohkon ⇄ asiantuntijatilan läpi (operandikenttä säilyttää
etuliitteen `tunniste:`).

---

## 9. Makrolohkot — Viite

### LABEL

| Muistijärjestelmä | Kuvaus                                                                   | Tilat                                                                                   |
| ----------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| Levymerkin nimi   | Tunniste, jota käytetään esimerkiksi `JMP`-, `JSR`-, `BNE`-tiedostoissa. | välitön, nollasivu, absoluuttinen, absoluuttinenX, absoluuttinenY, epäsuoraX, epäsuoraY |
| `LDX`             | Lataa X-rekisteri                                                        | välitön, nollasivu, nollasivuY, absoluuttinen, absoluuttinenY                           |
| `LDY`             | Lataa Y-rekisteri                                                        | välitön, nollasivu, absoluuttinen, absoluuttinenX                                       |
| `STA`             | Säilytä akkumulaattori                                                   | nollasivu, absoluuttinen, absoluuttinenX, absoluuttinenY, epäsuoraX, epäsuoraY          |
| `STX`             | Myymälän X kassa                                                         | nollaSivu, nollaSivuY, absoluuttinen                                                    |
| `STY`             | Myymälän Y-kassa                                                         | nollasivu, absoluuttinen                                                                |

### COMMENT

| Muistijärjestelmä | Kuvaus               | Muistiinpanoja                                                         |
| ----------------- | -------------------- | ---------------------------------------------------------------------- |
| `ADC`             | Lisää kantovälineenä | Aseta kantoaika useimmissa tapauksissa `SEC`-asetuksilla ennen käyttöä |
| `SBC`             | Vähennä ja kanna     | Aseta siirto `SEC` ennen vähennyslaskua                                |
| `SISÄLTÄÄ`        | Muistin lisääminen   | —                                                                      |
| `DEC`             | Vähennä muistia      | —                                                                      |
| `CMP`             | Vertaa A:han         | Asettaa liput; ei muokkaa A:ta                                         |
| `CPX`             | Vertaa X:ään         | —                                                                      |
| `CPY`             | Vertaa Y:n kanssa    | —                                                                      |

### BYTE

| Muistijärjestelmä | Kuvaus                                                              |
| ----------------- | ------------------------------------------------------------------- |
| Operandi          | Pilkulla erotetut tavuarvot (esim. `$01, $02, $FF` tai `1, 2, 255`) |
| `ORA`             | Looginen TAI akkumulaattorilla                                      |
| `EOR`             | Yksinoikeudella TAI kertyvällä vedolla                              |
| `BITTI`           | Testaa muistibittejä A:ta vasten (asettaa N-, V- ja Z-liput)        |

### WORD

| Muistijärjestelmä | Kuvaus                                                     |
| ----------------- | ---------------------------------------------------------- |
| Operandi          | Pilkulla erotetut 16-bittiset arvot (esim. `$0400, $C000`) |
| `JSR`             | Hyppää aliohjelmaan (tallentaa paluuosoitteen pinoon)      |
| `RTS`             | Paluu aliohjelmasta                                        |
| `RTI`             | Paluu keskeytyksestä                                       |
| `BNE`             | Haara, jos ei ole yhtäsuuri (Z=0)                          |
| `BEQ`             | Haara, jos yhtä suuri (Z=1)                                |
| `Piilokopio`      | Haara, jos kantaa, selkeä (C=0)                            |
| `BCS`             | Haara, jos kantosarja (C=1)                                |
| `Painoindeksi`    | Haara, jos miinus (N=1)                                    |
| `BPL`             | Haara, jos plus (N=0)                                      |
| `BVC`             | Haara, jos ylivuoto on tyhjä (V=0)                         |
| `BVS`             | Haara, jos ylivuoto on asetettu (V=1)                      |

#### LBNE / LBEQ / … (Pitkät oksat)

*(Uutta versiossa 2.3.9.)* Paletti **Pitkät haarat** sisältää kahdeksan
pseudo-operaatiota, jotka käyttäytyvät ehdollisten haarautumisten tavoin, mutta
saavuttavat **minkä tahansa osoitteen**, eivätkä vain −128…+127. Jokainen niistä
muodostaa käänteisen haaran, joka ohittaa 3-tavuisen `JMP:n` — aina **5 tavua**:

```
LBEQ valmis; kokoaa muotoon: BNE *+3 ($D0 $03)
; JMP valmis ($4C lo hi)
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

### FILL

| Muistijärjestelmä | Kuvaus                                                  |
| ----------------- | ------------------------------------------------------- |
| Operandi          | `määrä,arvo` — esim. `256,0` täyttää 256 tavua nollalla |
| `TAY`             | Siirto A → Y                                            |
| `TXA`             | Siirto X → A                                            |
| `TYA`             | Siirto Y → A                                            |
| `TSX`             | Siirtopino-osoitin → X                                  |
| `TXS`             | Siirto X → Pino-osoitin                                 |
| `INX`             | Lisäys X:llä                                            |
| `DEX`             | Vähennä X                                               |
| `INY`             | Y-arvon lisäys                                          |
| `DEY`             | Vähennä Y-arvoa                                         |

### ALIGN

| Muistijärjestelmä | Kuvaus                                                                     |
| ----------------- | -------------------------------------------------------------------------- |
| Raja              | Tasausarvo — esim. `64` (sprite-raja), `256` (sivu), `$2000` (bittikartta) |
| `LSR`             | Looginen siirto oikealle                                                   |
| `ROL`             | Kierrä vasemmalle kuljetuksen kautta                                       |
| `ROR`             | Kierrä oikealle Carry-toiminnon kautta                                     |

### TEXT

| Muistijärjestelmä   | Kuvaus                                                     |
| ------------------- | ---------------------------------------------------------- |
| Teksti              | Näytettävä merkkijono                                      |
| X                   | Sarake (0–39)                                              |
| Y                   | Rivi (0–24)                                                |
| Tarra (valinnainen) | Määrittää laskettuun näyttöosoitteeseen osoittavan otsikon |

### STRING

| Muistijärjestelmä           | Kuvaus                                                                                    |
| --------------------------- | ----------------------------------------------------------------------------------------- |
| Teksti                      | Kirjoitettava merkkijono                                                                  |
| Osoite                      | Kohdemuistin osoite — `$C000` heksadesimaali tai **otsikkonimi**                          |
| Tarra (valinnainen)         | Määrittää kohdeosoitteeseen osoittavan tunnisteen                                         |
| Siirtää                     | Heksadiarvo (00–FF) lisätään jokaiseen näyttökooditavuun (esim. `$80` = käänteinen video) |
| Pienten kirjainten merkistö | Valintaruutu — sama semantiikka kuin TEKSTI (katso TEKSTI-osio)                           |
| `SED`                       | Aseta desimaalitila                                                                       |
| `SEI`                       | Aseta keskeytyksen esto                                                                   |
| `EI `                       | Ei toimintoa                                                                              |
| `BRK`                       | Pakota keskeytys / ohjelmistokeskeytys                                                    |

### DATA

Kuten **POKE-silmukka** — kirjoittaa raakatavuluettelon muistiosoitteeseen
ajonaikana, yhden LDA/STA-parin tavua kohden.

`LAX`, `SAX`, `DCP`, `ISC`, `SLO`, `RLA`, `SRE`, `RRA`, `ANC`, `ALR`, `ARR`,
`AXS` ja `NOP`-lomakkeet, jotka lukevat operandin: `NOP #$nn` ($80), `NOP $nn`
($04), `NOP $nn,X` (14 $), `NOP $nnnn` (0C $), `NOP $nnnn, X` (1 C $)

---

## 10. Virheenkorjausintegraatio

Sovellus tukee **RetroDebuggeria** ulkoisena C64-virheenkorjaajana. Se
vastaanottaa kootusta ohjelmasta luodut keskeytyspisteet, symbolit ja
automaattisen käynnistyksen merkinnät.

---

### RetroDebugger

[RetroDebugger]{1} on eri alustoilla toimiva Commodore 64
-virheenkorjausohjelma, jossa on tuki keskeytyskohdille, muistin tarkastus ja
tunnistetietoinen purkaminen.

| Ala              | Kuvaus                                                                   |
| ---------------- | ------------------------------------------------------------------------ |
| Levy-yhtiön nimi | Tunniste, jota käytetään esimerkiksi `JMP`-, `JSR`-, `BNE`-tiedostoissa. |

**Asiantuntijan syntaksi:**
```
silmukka:
```

**Generoitu ASM:**
```
silmukka: ; $0820
```

Nykyinen osoite näkyy kommenttina. Nimikkeiden koko on **0 tavua **.

---

### Katkaisupistelohkot

Napsauta minkä tahansa käskylohkon keskeytyskohdan kuvaketta (●) vaihtaaksesi
sen keskeytyskohdaksi. Keskeytyskohdat sisältävät lohkot on korostettu
punaisella. Niiden osoitteet kirjoitetaan keskeytyskohtatiedostoon jokaisella
virheenkorjaimen käynnistyskerralla.

**Asiantuntijan syntaksi:**
```
; Kommenttisi teksti tähän
```

**Generoitu ASM:**
```
; Kommenttisi teksti tähän
```

---

### Virheenkorjausliput (Asetukset-välilehti)

Kuten **DATA BASIC**-ohjelmassa — tallentaa luettelon raakatavuarvoista
ohjelmaan.

| Ala      | Kuvaus          |
| -------- | --------------- |
| Operandi | `-jump $OSOITE` |

**Asiantuntijan syntaksi:**
```
.tavu $01, $02, $FF
```

**Generoitu ASM:**
```
.tavu $01, $02, $FF
```

**Lo/hi-tavun tunnisteviittaukset:** BYTE hyväksyy KickAssembler / ca65-tyyliset
`<label` (matala tavu) ja `>label` (korkea tavu) -tokenit numeeristen arvojen
rinnalla. Assembler selvittää tunnisteosoitteen käännösaikana ja lisää sopivan
tavun. Esimerkki:

```
.byte <kehys_0, >kehys_0, <kehys_1, >kehys_1
```

Tämä tallentaa `frame_0`-kehyksen osoitteen alimman tavun, sitten ylemmän tavun
ja lopuksi saman tavun osoitteelle `frame_1`. Hyödyllinen hyppytaulukoiden ja
osoitelistojen rakentamiseen.

**Koko:** Listan tavujen määrä.

---

### SANA

Kuten BASICin **DATA, mutta 16-bittisille luvuille **. Jokainen arvo
tallennetaan kahtena tavuna (ensin pienin tavu, sitten suurin – 6502
little-endian -järjestys).

| Ala      | Kuvaus                                                     |
| -------- | ---------------------------------------------------------- |
| Operandi | Pilkulla erotetut 16-bittiset arvot (esim. `$0400, $C000`) |

**Asiantuntijan syntaksi:**
```
.sana $0400, $C000
```

**Generoitu ASM:**
```
.sana $0400, $C000
```

**Koko:** 2 tavua sanaa kohden.

---

### TÄYTTÄÄ

Kuten `FOR I=1 TO N : POKE addr+I, val : NEXT` — täyttää muistilohkon samalla
tavulla, mutta yhdessä lohkossa. Erinomainen alueiden tyhjentämiseen tai
taulukoiden esitäyttöön.

| Ala      | Kuvaus                                                  |
| -------- | ------------------------------------------------------- |
| Operandi | `määrä,arvo` — esim. `256,0` täyttää 256 tavua nollalla |

**Asiantuntijan syntaksi:**
```
.täytä 256, 00 dollaria
```

**Generoitu ASM:**
```
.täytä 256, 00 dollaria
```

**Lausekkeen syntaksi:** Sekä `count` että `value` hyväksyvät aritmeettisia
lausekkeita. Voit viitata CONST-nimiin, käyttää
heksadesimaali-/binääriliteraaleja ja kutsua sisäänrakennettuja matemaattisia
funktioita:

| Ilmaisu                     | Merkitys                                          |
| --------------------------- | ------------------------------------------------- |
| `LAATTAMÄÄRÄ, 00 $`         | määrä CONST-arvosta, arvo heksadesimaaliliteraali |
| `40*25, 0`                  | rivinsisäinen kertolasku                          |
| `round(sin(PI/4)*255), $80` | trigonometria                                     |

**Sisäänrakennetut funktiot:** `sin()`, `cos()`, `round()`, `max(a,b)`,
`min(a,b)`, `abs()`, vakio `PI`

Operaattorit: `+ - * /` Literaalit: `$FF` (heksadesimaali), `%10110000`
(binääri) Matala/korkea tavu: `lo(lauseke)`, `hi(lauseke)`

**Koko:** Määrän arvo tavuina.

---

### TASOITA

Liu'uttaa nykyisen osoitteen eteenpäin seuraavaan puhtaaseen reunaan lisäämällä
nollilla täytettäviä tavuja. C64 vaatii sprite-datan alkavan 64-tavuiselta
rajalta — `ALIGN 64` käsittelee tämän automaattisesti.

| Ala  | Kuvaus                                                                     |
| ---- | -------------------------------------------------------------------------- |
| Raja | Tasausarvo — esim. `64` (sprite-raja), `256` (sivu), `$2000` (bittikartta) |

**Asiantuntijan syntaksi:**
```
.align 64
.align 2000 dollaria
```

**Generoitu ASM:**
```
; ALIGN 64 → $0840 (12 tavun täyttö)
```

**Koko:** Dynaaminen — riippuu nykyisen ohjelmalaskurin sijainnista.

> **Vinkki:** Käytä `ALIGN 64` ennen sprite-dataa ja `ALIGN 256` varmistaaksesi
> sivunmukaiset taulukot.

---

### TEKSTI

Kuten **PRINT AT** — kirjoittaa tekstiä suoraan C64-näytölle tiettyyn
sarakkeeseen ja riville käyttämättä KERNAL-kutsua. Se luo yhden LDA/STA-parin
merkkiä kohden ja kohdistaa näytön RAM-muistiin kohdassa `$0400`.

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

- **Isojen kirjainten merkistö (oletus, valintaruutua ei ole valittu):**
  Kirjoita haluamasi teksti isoilla kirjaimilla. `"HEI"` näkyy muodossa `HEI`.
  Pienillä kirjaimilla syötetty teksti on yhdistetty isoilla kirjaimilla
  syötettyihin näyttökoodeihin.
- **Pienet kirjaimet (valintaruutu valittuna):** Kirjoita tarkka kirjainkoko,
  jonka haluat nähdä. `"hello"` → pienten kirjainten näyttö, `"HELLO"` → isojen
  kirjainten näyttö. Vaatii ajonaikaisen merkistövalinnan ennen kuin näyttöön
  kirjoitetaan (käytä **CHARSET lower** -makroa).

**Generoitu ASM (isoilla kirjaimilla, `"HEI"`):**
```
LDA #$08; 'H'-näyttökoodi $08
STA $0400
LDA #$05; 'E'-näyttökoodi $05
STA $0401
...
```

**Asiantuntijan syntaksi:**
```
.text 0, 2, "HEI"; isot kirjaimet (oletus)
.text 0, 2, "hei", pienet kirjaimet; pienet kirjaimet
```

Merkit koodataan **näyttökoodeina** (ei PETSCII). **Koko:** `tekstin pituus × 5`
tavua (LDA + STA merkkiä kohden).

---

### STRING

Kuten **Työkkäämällä merkkijonon** mihin tahansa muistiosoitteeseen suorituksen
aikana. Luo LDA/STA-pareja, jotka kopioivat kunkin merkin näyttökoodin
peräkkäisiin osoitteisiin.

| Ala                         | Kuvaus                                                                                    |
| --------------------------- | ----------------------------------------------------------------------------------------- |
| Teksti                      | Kirjoitettava merkkijono                                                                  |
| Osoite                      | Kohdemuistin osoite — `$C000` heksadesimaali tai **otsikkonimi**                          |
| Tarra (valinnainen)         | Määrittää kohdeosoitteeseen osoittavan tunnisteen                                         |
| Siirtää                     | Heksadiarvo (00–FF) lisätään jokaiseen näyttökooditavuun (esim. `$80` = käänteinen video) |
| Pienten kirjainten merkistö | Valintaruutu — sama semantiikka kuin TEKSTI (katso TEKSTI-osio)                           |

**Asiantuntijan syntaksi:**
```
.string $C000, "HEI" ; isot kirjaimet (oletus)
.string $C000, "hei", pienet kirjaimet ; pienet kirjaimet
.string $C000, "HEI", 80 ; shift-näppäimellä (käänteinen video)
.string $C000, "hei", 80, pienet kirjaimet ; shift + pienet kirjaimet
.string $C000, "HEI" :my_string ; makrotunnisteella
```

**Generoitu ASM:**
```
LDA #$08; näyttökoodi 'H' STA $C000
LDA #$05; näyttökoodi 'E' STA $C001
...
```

Merkit koodataan **näyttökoodeina** (ei PETSCII). Valinnainen **Shift**-arvo
lisätään jokaiseen tavuun, esim. `$80` käänteiselle videolle. **Koko:**
`text.length × 5` tavua (yksi LDA + yksi STA merkkiä kohden).

---

### DATA

Kuten **POKE-silmukka** — kirjoittaa raakatavuluettelon muistiosoitteeseen
ajonaikana, yhden LDA/STA-parin tavua kohden.

| Ala                 | Kuvaus                                                           |
| ------------------- | ---------------------------------------------------------------- |
| Tavut               | Pilkulla erotetut tavuarvot                                      |
| Osoite              | Kohdemuistin osoite — `$C000` heksadesimaali tai **otsikkonimi** |
| Tarra (valinnainen) | Määrittää kohdeosoitteeseen osoittavan tunnisteen                |

**Asiantuntijan syntaksi:**
```
.data $C000, $01, $02, $03; heksadesimaaliosoite
.data my_buf, $01, $02, $03; otsikon osoite
.data $C000, $01, $02, $03:mydata; makrotunnisteella
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

> **2.1:** tavut voivat nimetä tunnisteita: `.data $2010, <target, >target`
> kirjoittaa kohteen `kohteen` osoitteen, joka myös myöhemmin määritellyn
> tunnisteen mukainen. Makron `:nimi`-tunniste voi osoittaa kohdeosoitteeseen,
> joka itse on tunniste.

---

### RAWBYTES

Kuten suoraan muistiin latautuva **DATA** — ei lainkaan ajonaikaista koodia.
Tavut ovat läsnä PRG:n lataushetkestä lähtien, ennen kuin koodisi edes alkaa.
Käytä tätä sprite-dataan, tasokarttoihin, hakutaulukoihin ja kaikkeen muuhun,
minkä tarvitsee vain olla tietyssä osoitteessa.

| Ala                 | Kuvaus                                                           |
| ------------------- | ---------------------------------------------------------------- |
| Tavut               | Pilkulla erotetut tavuarvot                                      |
| Osoite              | Kohdemuistin osoite — `$C000` heksadesimaali tai **otsikkonimi** |
| Tarra (valinnainen) | Määrittää kohdeosoitteeseen osoittavan tunnisteen                |

**Asiantuntijan syntaksi:**
```
.rawbytes $C000, $00, $00, $00; heksadesimaaliosoite
.rawbytes sprite_data, $00, $00; otsikkoosoite
.rawbytes $0C50, $00, $00 :nev; macroLabel-tunnisteen kanssa — muu koodi voi käyttää LDA:ta nev,X
```

**Koko koodissa:** 0 tavua. Data sijoitetaan tulosteessa annettuun osoitteeseen.

> **DATA vs. RAWBYTES:** DATA luo LDA/STA-koodia, joka kopioi tavuja suorituksen
> aikana (hitaampaa, mutta toimii, jos datan on oltava dynaamista). RAWBYTES
> vain sijoittaa tavut suoraan – ei koodia, välittömästi, ilman kustannuksia.

> **2.1:** tavut voivat nimetä tunnisteita (`.rawbytes $2000, <target, >target`
> — osoitintaulukko); `:name` tunniste voi osoittaa tunnisteeseen
> kohdeosoitteena, joka myös määritellään myöhemmin. Makron puskuriargumenttina
> tavut vievät oman tilansa puskureissa ohjelman jälkeen.

---

### RAAKATEKSTI

Kuten RAWBYTES, mutta tekstille — koodaa merkkijonon näyttökoodeiksi ja
sijoittaa tavut kiinteään osoitteeseen ilman ajonaikaista koodia ****. Teksti on
valmiina muistissa heti, kun PRG latautuu.

| Ala                         | Kuvaus                                                                                    |
| --------------------------- | ----------------------------------------------------------------------------------------- |
| Teksti                      | Koodattava merkkijono                                                                     |
| Osoite                      | Kohdemuistin osoite — `$C000` heksadesimaali tai **otsikkonimi**                          |
| Tarra (valinnainen)         | Määrittää kohdeosoitteeseen osoittavan tunnisteen                                         |
| Siirtää                     | Heksadiarvo (00–FF) lisätään jokaiseen näyttökooditavuun (esim. `$80` = käänteinen video) |
| Pienten kirjainten merkistö | Valintaruutu — sama semantiikka kuin TEKSTI (katso TEKSTI-osio)                           |

**Asiantuntijan syntaksi:**
```
.rawtext $C000, "HEI" ; isot kirjaimet (oletus)
.rawtext $C000, "hei", pienet kirjaimet ; pienet kirjaimet
.rawtext $C000, "HEI", 80 ; shift-näppäimellä (käänteinen video)
.rawtext $C000, "hei", 80, pienet kirjaimet ; shift + pienet kirjaimet
.rawtext $0400, "HEI" :oma_teksti ; makrotunnisteella
```

**Generoitu ASM:**
```
; .rawtext "HEI" -> $C000
; $C000
.byte $08, $05, $0C, $0C, $0F ; HEI (näyttökoodit isoilla kirjaimilla)

; .rawtext "hei", pienet kirjaimet -> $C000
; $C000
.byte $48, $45, $4C, $4C, $4F ; HEI (näyttökoodit pienellä kirjaimella $41–$5A välillä)
```

**Koko koodissa:** 0 tavua. Data sijoitetaan tulosteessa annettuun osoitteeseen.

> **STRING vs. RAWTEXT:** STRING luo LDA/STA-koodia, joka kopioi tekstin
> suorituksen aikana. RAWTEXT tallentaa tavut PRG:hen latausaikana – ei koodia,
> ei odottelua.

---

### PETSCII

Kuten **RAWBYTES, mutta KERNAL-tulosteelle ** — koodaa merkkijonon
PETSCII-tavuina (yhteensopiva CHROUT:n kanssa kohdassa `$FFD2`) ja sijoittaa ne
kiinteään osoitteeseen ilman ajonaikaista koodia. Käytä tätä, kun haluat
tulostaa merkkejä `JSR $FFD2`:n kautta silmukassa, ja huomaa, että uusi
`PRINT`-makro käyttää samaa kooderia ja pienten kirjainten
valintaruututoimintoa.

> **PETSCII vs. näyttökoodit:** PETSCII ja näyttökoodit ovat kaksi eri
> koodausta. Näyttökoodi `$01` = kirjain A; PETSCII `$41` = kirjain A (CHROUTin
> kautta). Käytä PETSCII:tä vain tulostettaessa KERNALin kautta; käytä
> TEXT/STRING/RAWTEXT-koodausta suoraan näyttömuistiin kirjoittamiseen.

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
.petscii $C000, "HEI" ; isot PETSCII-kirjaimet (oletus)
.petscii $C000, "hei", pieni kirjain ; pienet PETSCII-kirjaimet ($61–$7A)
.petscii $C000, "HEI", null ; null-terminaattorilla
.petscii $C000, "hei", pieni kirjain, null ; pienet kirjaimet + null-terminaattori
.petscii $C000, "HEI" :oma_viesti ; makrotunnisteella
```

**Generoidut tavut (isoilla kirjaimilla, `"HEI"`):**
```
; $C000
.tavu $48, $45, $4C, $4C, $4F ; HEI (PETSCII $41–$5A väli)
```

**Koko koodissa:** 0 tavua. Data sijoitetaan kohdeosoitteeseen lykättynä
dataosana (kuten RAWBYTES).

**Nollapäätteinen merkki:** Valitse *"Lisää `$00` (nollapäätteinen merkki)"*
-valintaruutu lisätäksesi automaattisesti `$00` tavun tekstin jälkeen.
Ihanteellinen null-päätteisille silmukoille:

```
LDX #$00
silmukka:
LDA-viesti,X
BEQ valmis; $00 pysäyttää silmukan
JSR $FFD2
INX
BNE-silmukka
valmis:
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

> **Vinkki:** Käytä PETSCII:tä datalle, joka lähetetään CHROUTin kautta
> (`$FFD2`). Kirjoitettaessa suoraan näytön RAM-muistiin, käytä STRING- tai
> RAWTEXT-komentoa.

---

### MERKKIJÄRJESTELMÄ

Vaihtaa VIC-II-merkki-ROMin isojen kirjainten/grafiikkatilan (C64-oletus) ja
pienten kirjainten/isojen kirjainten tilan välillä muokkaamalla `$D018`:n bittiä
1 ajonaikana.

| Ala  | Kuvaus                                                                                                                                                         |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tila | **Pienet kirjaimet** — ottaa käyttöön pienten/isojen kirjainten merkistöä; **Isot kirjaimet** — palauttaa oletusarvoisen isojen kirjainten/grafiikkamerkistöä. |

**Asiantuntijan syntaksi:**
```
.charset lower; vaihda pieniin kirjaimiin perustuvaan merkistöön
.charset upper; vaihda takaisin isoihin kirjaimiin/grafiikkamerkistöön
```

**Generoitu ASM:**

Pienten kirjainten tila:
```
LDA $D018
ORA #$02 ; aseta bitti 1 → pienten/isojen kirjainten ROM arvoon $1800
STA $D018
```

Isojen kirjainten tila:
```
LDA $D018
JA #$FD ; tyhjennä bitti 1 → isojen kirjainten/grafiikka-ROM kohdassa $1000
STA $D018
```

**Koko:** 8 tavua (LDA abs + ORA/AND imm + STA abs).

**Miksi ORA/AND suoran kirjoituksen sijaan?** `$D018` ohjaa myös näytön
RAM-muistin sijaintia (bitit 7–4). Vain bitin 1 kytkeminen päälle/pois säilyttää
loput rekisteristä.

**Tyypillinen työnkulku:**

```
CHARSET alempi; vaihda pieniin kirjaimiin
TEXT 0, 0, "hello world"; [valintaruutu: Pienet kirjaimet]
...
CHARSET yläosa; palauta oletusarvo, kun valmis
```

Tai asiantuntijatilassa:
```
.charset lower
.text 0, 0, "hello world", lower
.charset upper
```

Asiantuntijatilassa `.charset`-lohko käy nyt läpi myös tilan alasvetovalikon,
joten lohkon esikatselu ja viety lähdekoodi pysyvät linjassa.

> **Huomautus:** CHARSET-makro muuttaa vain VIC-merkki-ROM-osoitinta. Se ei
> kutsu `$E544` (KERNAL-merkkijoukon alustus). Useimmissa tapauksissa tämä
> riittää; kutsu `JSR $E544` ensin vain, jos tarvitset KERNALin omien
> tulostusrutiinien huomioivan muutoksen.

---

### CHARDEF

Määrittää yhden 8×8 mukautetun merkin RAM-pohjaisessa merkistössä. Lähettää
suorituksenaikaista koodia, joka kopioi 8 tavua `base + index * 8` -merkkijonoon
— ei tarvita edeltävää otsikkoa tai `ORG`-merkkijonoa.

| Ala             | Kuvaus                                                                                                                          |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Merkistöpohja   | RAM-merkistölle määritetty perusosoite (oletusarvo `$3800`). Osoite on kohdistettava siten, että VIC-II näkee sen (katso alla). |
| Merkkihakemisto | Mikä merkkipaikka määritellään uudelleen, 0–255. `65` = 'A' oletusnäyttökoodin asettelussa.                                     |
| 8 tavua         | Pilkuilla erotetut bittikarttarivit ylhäältä alas. Kunkin tavun bitti 7 = vasemmanpuoleisin pikseli.                            |

**Asiantuntijan syntaksi:**
```
.chardef 3800 dollaria, 65 dollaria, 18 dollaria, 3C dollaria, 66 dollaria, 7E dollaria, 66 dollaria, 66 dollaria, 66 dollaria, 00 dollaria
```

**Generoitu ASM (8 × `LDA #b` / `STA kohde+n`, yhteensä 40 tavua):**
```
LDA #$18
    STA $3A08
    LDA #$3C
    STA $3A09
    LDA #66 dollaria
    STA $3A0A
    LDA #$7E
    STA $3A0B
    LDA #66 dollaria
    STA $3A0C
    LDA #66 dollaria
    STA $3A0D
    LDA #66 dollaria
    STA $3A0E
    LDA #$00
    STA $3A0F
```

**Kohdeosoite:** `$3800 + 65 * 8 = $3A08`. Lasketaan käännösaikana ja koodataan
kiinteästi STA-operandeihin.

**Koko:** 40 tavua merkkiä kohden (8 × 5).

**Tyypillinen työnkulku:**
```
; Piste VIC-II RAM-merkistössä kohdassa $3800
LDA $D018
JA #$F1
ORA #$0E ; bitit 3-1 = %111 → merkistö pankissa + $3800
STA $D018

CHARDEF $3800, 65, $18, $3C, $66, $7E, $66, $66, $66, $00 ; määrittele 'A' uudelleen
CHARDEF $3800, 66, $7C, $66, $66, $7C, $66, $66, $7C, $00 ; määrittele 'B' uudelleen
; ... lisää CHARDEF-kutsuja jokaiselle mukautetulle merkille
```

**Milloin käyttää CHARDEFia vs. vaihtoehtoja:**

| Lähestyä                          | Käytä, kun                                                                                                       |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **CHARDEF**                       | Tarvitset muutaman mukautetun merkin (esimerkiksi 1–20). Suoritusaikakustannukset ovat 40 tavua merkkejä kohden. |
| **RAWBYTES @ 3800 dollaria**      | Sinulla on täysi mukautettu merkistö (256 merkkiä). Yhteensä 2 kt dataa, ei ajonaikaista kopiota.                |
| **INCBIN "charset.bin" @ 3800 $** | Ulkoinen merkistötiedosto (character editor -ohjelman luoma). Siistein vaihtoehto.                               |
| ** Merkistöpohja + INCBIN**       | Täysi 256 merkin bittikarttakuva maalattu yhdeksi 128 × 128 -kuvaksi.                                            |

> **Tasonkorjausmuistutus:** VIC-II odottaa merkistöpohjan olevan `$0800`
> kerrannainen. Kelvolliset pankit: `$0000`, `$0800`, `$1000`, ... , `$3800`
> (nykyisen 16 kt:n VIC-pankin sisällä). RAM-merkistöjen tyypillisesti ovat
> `$2000`, `$2800`, `$3000` tai `$3800`.

---

### BOX_HIT

Akselikohtaisesti tasatun rajaavan laatikon (AABB) törmäystesti kahden
nelitavuisen nollasivuisen rakenteen kuvaaman suorakulmion välillä. Palauttaa
tuloksen akkumulaattoriin: **A = 1** päällekkäisyydessä, **A = 0** muuten.
Puhdas inline-kokoonpano, ei aliohjelmakutsuja.

| Ala                    | Kuvaus                                                                       |
| ---------------------- | ---------------------------------------------------------------------------- |
| Box1:n postinumeroalue | Ensimmäisen laatikon 4-tavuisen rakenteen nollasivupohja (oletusarvo `$FB`). |
| Box2:n postinumeroalue | Toisen laatikon 4-tavuisen rakenteen nollasivupohja (oletusarvo `$F7`).      |

**Rakenteen asettelu** (4 tavua ruutua kohden, etumerkittömät 8-bittiset
koordinaatit):

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

**Generoitu ASM (30 tavua, täysin PC-relatiivinen — ei aliohjelmia, ei
absoluuttisia hyppyjä):**
```
LDA $FD; b1 oikealle CMP $F7; b2 vasemmalle BCC ei; R1 < L2 → ohi LDA $F9; b2 oikealle CMP $FB; b1 vasemmalle BCC ei LDA $FE; b1 alhaalla CMP $F8; b2 ylhäällä BCC ei LDA $FA; b2 alhaalla CMP $FC; b1 ylhäällä BCC ei LDA #$01; osuma BNE valmis; ehdoton (A ≠ 0)
ei: LDA #$00
valmis:
```

**Koko:** 30 tavua.

**Tyypillinen työnkulku:**

```
; Pelaajan sprite-laatikko kohdassa $FB..$FE
LDA sprite_x ; L
STA $FB
LDA sprite_y ; T
STA $FC
CLC ADC #23 ; +23 → B (24 pikseliä korkea sprite)
STA $FE
LDA $FB
CLC ADC #23 ; R
STA $FD

; Vihollisen laatikko kohdassa $F7..$FA (täytetty samalla tavalla)
; ...

BOX_HIT $FB, $F7 ; testipelaaja vs. vihollinen → A = 0 tai 1

CMP #$01
BNE no_collision
JSR handle_hit
no_collision:
```

**Rajoitukset:**
- Molempien nollasivuosoitteiden on oltava muotoa `≤ $FC` (jokainen laatikko
  tarvitsee 4 peräkkäistä tavua: `zp`, `zp+1`, `zp+2`, `zp+3`).
- Koordinaatit käsitellään muodossa **merkitön 8-bittinen** (0–255). Tämän
  alueen ulkopuolella olevat etumerkilliset sprite-koordinaatit normalisoidaan
  ennen tallennusta.
- Kaksi laatikkoa voivat halutessaan olla päällekkäin ZP-tilassa, mutta yleensä
  tarvitaan 8 erillistä tavua.

**Miksi ei aliohjelmaa?** Rivinsisäinen generointi välttää
JSR/RTS-yleiskuormituksen (yli 14 sykliä) ja pitää testin kuumana välimuistissa
tiukkoja pelisilmukoita varten. Jos sinun täytyy testata useita pareja, aseta
oma `JSR box_hit_sub` manuaalisesti yhden BOX_HIT-lohkon ympärille.

**Vertailu UB:n `box_hit()`-funktioon:** Ultimate Basic käyttää samaa
6502-logiikkaa kuin ajonaikainen funktio, joka palaa muuttujaan. VA:ssa BOX_HIT
sijoitetaan riville siihen kohtaan, johon testiä tarvitaan; tulos on
`A`-tiedostossa.

---

### INCBIN

Kuten **BLOAD BASIC**:ssä — poimii ulkoisen binääritiedoston (`.bin`, `.prg`,
`.sid`, `.raw`) ja upottaa sen suoraan koottuun PRG:hen määrittämääsi
osoitteeseen.

| Ala      | Kuvaus                                                                       |
| -------- | ---------------------------------------------------------------------------- |
| Tiedosto | Selaa ja valitse tiedosto, jonka tyyppi on `.bin`, `.prg`, `.sid` tai `.raw` |
| Osoite   | Kohdekuormitusosoite (esim. `$C000`)                                         |

**Asiantuntijan syntaksi:**
```
.incbin "musiikki.bin", $C000
```

**Luotu ASM-kommentti:**
```
; INCBIN "musiikki.bin" @ $C000 (2048 tavua)
.tavu $01, $02, ...
```

**Koko koodissa:** 0 tavua (lykätty dataosa). Binääritiedosto on upotettu
annettuun osoitteeseen.

---

### KOALA

Lataa **Koala Painter** -kuvan (`.koa` / `.kla`, 160×200 monivärinen) ja näyttää
sen. Kuvadata upotetaan kiinteään osoitteeseen, kuten `INCBIN` (tiedoston
2-tavuinen `$6000` latausosoite poistetaan), ja itse lohko kääntyy 86-tavuiseksi
näyttörutiiniksi, joka suoritetaan lohkon sijainnissa.

| Ala      | Kuvaus                                                                                                                                                  |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tiedosto | Selaa ja valitse tiedosto `.koa` / `.kla` (10003 tavua tai 10001 ilman latausosoitetta)                                                                 |
| Osoite   | Bittikarttaosoite: `$6000` (oletus, Koalan alkuperäinen, VIC-pankki 1, näytön RAM-muisti `$4400`) tai `$2000` (VIC-pankki 0, näytön RAM-muisti `$0400`) |

Näyttörutiini kopioi näyttömuistin RAM-osan näytölle ja värimuistin osan
osoitteeseen `$D800`, kirjoittaa taustatavun osoitteeseen `$D021`, valitsee
VIC-pankin osoitteesta `$DD00` (säilyttäen muut porttibitit) ja vaihtaa
monivärisen bittikarttatilan päälle (`$D011 = $3B`, `$D016 = $18`, `$D018 =
$18`). Muut osoitteet hylätään: loput 8K-paikkaa ovat BASIC/KERNAL ROM -muistin
alla (kopiointisilmukka lukisi ROMia) tai menevät päällekkäin merkki-ROM-varjon
kanssa.

**Asiantuntijan syntaksi:**
```
.koala "kuva.koa"
.koala "kuva.koa", 2000 dollaria
```

**Esimerkki — näytä kuva ja odota:**
```
* = $0801
.koala "kuva.koa"
odota:
JMP odota
```

**Koko koodissa:** 86 tavua (näyttörutiini); 10001 tavua kuvadataa menee
annettuun osoitteeseen. Hires-editorin **Tiedostot → Vie Koala (.koa)…** tuottaa
yhteensopivan tiedoston.

---

### TASO / TASO_RIVI

Lisää **Level Editor** -projektin ohjelmaasi ja kopioi tason rivit
näyttöpuskuriin – vierityspelin rakennuspalikoita. Katso täydellinen
joystick-vieritystason esitys tiedostosta `samples/level-demo.asm`.

#### TASO

INCBIN-tyylinen lohko, joka tuottaa **0 tavua koodia**. Vain **sijoitetut**
ruudut tasoeditoriprojektista (`.bin`, jotka on tallennettu komennolla **Files →
Save level**) menevät muistiin annetusta osoitteesta (oletusarvo `$2000`),
korttipaikassa, 2000 tavua ruutua kohden (1000 näyttökoodia + 1000 väriä).
Identtiset ruudut tallennetaan kerran, ja kaikki tyhjät paikat jakavat yhden
tyhjän näytön. Osoitintaulukot seuraavat näyttöjä. Taso voi olla jopa 7 × 10
näyttöä.

**Asiantuntijan syntaksi:**
```
.level "taso.bin"
.level "taso.bin", 4000 dollaria
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

#### TASO_RIVI

Kopioi yhden 40-merkkisen rivin tasosta puskuriin: tasorivin muuttujassa **X**
alkaen `col`-muuttujassa olevasta tasosarakkeesta, `dst`-osoittimessa olevaan
osoitteeseen (`dst` / `dst+1`, lo/hi). Kolmannella argumentilla `color`
kopioidaan värit näyttökoodien sijaan (väri-RAMia varten). Kahden näytön yli
ulottuvaa 40-merkkistä ikkunaa käsitellään itseään muokkaavalla
kopiointisilmukalla (~14 sykliä tavua kohden). X säilytetään, A ja Y tuhotaan.
Ohjelmassa tarvitaan `.level`-lohko.

**Asiantuntijan syntaksi:**
```
.level_row dst_lo, näkymä_x
.level_row dst_lo, näkymä_x, väri
```

**Koko koodissa:** 132 tavua — käytä `LBEQ` / `LBNE`, kun haaran on hypättävä
sen yli.

---

### SID

Kuten **BLOAD musiikille** — lataa `.sid` -tiedoston PRG:hen ja lukee
automaattisesti sen Init- ja Play-osoitteet otsikosta. Kutsu Init-komentoa
kerran käynnistyksen yhteydessä ja sitten Play-komentoa IRQ-käsittelijästäsi
joka kehys.

| Ala                             | Kuvaus                                                                                               |
| ------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Tiedosto                        | Selaa ja valitse `.sid`-tiedosto                                                                     |
| Mukautettu osoite (valinnainen) | Korvaa SID:n natiivi latausosoite (esim. `$1000`). Jätä tyhjäksi käyttääksesi SID-otsikon osoitetta. |

Lohko näyttää:
- **Nimike / Tekijä** SID-otsikosta
- **Latausosoite** — mihin data sijoitetaan muistiin (tehokas osoite minkä
  tahansa ohituksen jälkeen)
- **Init-osoite** — kutsu tätä JSR:llä musiikin alustamiseksi (säädetty
  uudelleensijoituksen varalta, jos käytetään mukautettua osoitetta)
- **Toistoosoite** — kutsu tätä JSR:llä jokaisella IRQ-käsittelijän kehyksellä
  (säädetty uudelleensijoituksen varalta)
- **(siirretty)** -merkki tulee näkyviin, kun mukautettu osoite siirtää tietoja
  alkuperäisestä sijainnistaan.

**Asiantuntijan syntaksi:**
```
.sid "Ikari_Warriors.sid"
.sid "Ikari_Warriors.sid", 1000 dollaria
```

**Luotu ASM-kommentti:**
```
; SID "Ikari_Warriors.sid" @ $ 1000 Alku: $ 1000 Toisto: $ 1006 (4096 tavua)
```

**Koko koodissa:** 0 tavua rivillä. SID-binääritiedosto sijoitetaan PRG:n
määritettyyn osoitteeseen lykättynä osana.

> **Tärkeää:** Useimmat SID-tiedostot sisältävät kovakoodattuja sisäisiä
> absoluuttisia osoitteita. Ne voidaan siirtää vain, jos koko binääritiedostoa
> siirretään samalla siirtymällä. Jos SID:ssä on sisäisiä hyppyjä osoitteeseen
> `$10xx`, sen on pysyttävä osoitteessa `$1000` – sen siirtäminen eri
> osoitteeseen rikkoo nämä sisäiset viittaukset.

> **Tyypillinen käyttö:** Aseta ORG-lohko SID-lohkon eteen sen osoitteen
> asettamiseksi. Kutsu Init-lohkoa kerran käynnistyksen yhteydessä ja sitten
> Play-lohkoa jokaista rasteri-IRQ-käsittelijän kuvaa varten — tai anna
> [SID_PLAYER](#sid_player):n tehdä molemmat.

**Tunnisteet:** SID-lohko määrittelee `SID_LOAD` (mihin data sijoitetaan),
`SID_INIT` ja `SID_PLAY` (init- ja toisto-osoitteet, siirretty yhdessä
mukautetun osoitteen kanssa). `SID_PLAY` puuttuu, kun kappaleella ei ole
toisto-osoitetta (RSID, joka asentaa oman IRQ:n). Käytä niitä omassa koodissasi,
esim. `JSR SID_PLAY` IRQ-käsittelijässä.

---

### SID_PLAYER

Toistaa **SID**-makron sävelmän yhdellä lohkolla: se alustaa sävelmän ja kutsuu
toistorutiiniaan jatkuvasti rasterikeskeytyksestä, jotta ohjelmasi voi jatkaa
omaa työtään.

| Ala     | Kuvaus                                                                |
| ------- | --------------------------------------------------------------------- |
| Laulu   | A-muistin init-rutiinille välitetty aliviritysnumero (oletusarvo `0`) |
| Rasteri | Keskeytyksen rasteririvi, `$00`–`$FF` (oletusarvo `$FA`)              |

Mitä se tekee: `SEI`, `LDA #song` / `JSR SID_INIT`, kytkee CIA1-ajastimen IRQ:n
pois päältä (`$DC0D`), asettaa IRQ-vektorin (`$0314/$0315`) sisäänrakennetulle
käsittelijälleen, rasteririville (`$D012`, bitti 8 kohdassa `$D011` tyhjennetty)
ja rasteri-IRQ:lle (`$D01A`), `CLI`, sitten hyppää käsittelijän yli. Käsittelijä
kuittaa keskeytyksen (`ASL $D019`), kutsuu `JSR SID_PLAY` ja siirtyy
KERNAL-käsittelijään (`JMP $EA31`), joka myös skannaa näppäimistön.

**Asiantuntijan syntaksi:**
```
.sid "Ikari_Warriors.sid"
.sid_player
.sid_player 1, 80 dollaria
```

**Koko koodissa:** 58 tavua.

> **Huom:** ohjelmassa on oltava SID-lohko (`SID_INIT` ja `SID_PLAY`); muuten
> koonti pysähtyy virheeseen. Kun CIA1-ajastimen IRQ on pois päältä, KERNAL
> suoritetaan kerran rasteri-IRQ:n kehyksessä — näppäimistö ja `GETIN` jatkavat
> toimintaansa.

---

### SISÄLLYTÄ

Kuten **MERGE BASIC**:ssä — hakee toisen tiedoston ja laajentaa sen lohkot
rivillä tässä kohdassa. Täydellinen uudelleenkäytettäville
aliohjelmakirjastoille. Sisällytetyt lohkot ovat vain luku -tilassa nykyisessä
projektissa.

Kahta tiedostotyyppiä tuetaan:
- **Visual Assembler -projekti** (`.json`) — projektin lohkot lisätään
  sellaisenaan.
- **Plain assembly source** (`.inc`, `.asm`, `.s`) — tiedosto luetaan tekstinä
  ja jäsennetään samalla tavalla kuin expert-tilassa. Joka kerta käännöksen
  yhteydessä tiedosto luetaan uudelleen levyltä (source of truth = tiedosto),
  joten voit muokata sitä ulkoisesti millä tahansa editorilla.

| Ala                        | Kuvaus                                                                                                                                                                                                                                                                                                        |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tiedosto                   | Selaa valitaksesi `.json` -projektin tai `.inc`/`.asm`/`.s` -kokoonpanolähteen                                                                                                                                                                                                                                |
| Latausosoite (valinnainen) | Jos se on asetettu (heksadesimaali, esim. `C000`), sisällytetyt lohkot sijoitetaan kyseiseen osoitteeseen – niiden eteen ruiskutetaan synteettinen `ORG`, joka ohittaa kaikki sisällytetyn tiedoston ORG-lohkot. Jätä tyhjäksi, jos haluat, että sisällytetyn tiedoston omat ORG-lohkot ohjaavat sijoittelua. |

**Asiantuntijatilan syntaksi:**
```
.include "library.json"
.include "macros.inc", 1500 dollaria
.include "sprites.asm"
```

- Tiedostopääte ** vaaditaan asiantuntijatilassa ** — pelkkää nimeä, kuten
  `.include "macros"`, käsitellään nimellä `.include "macros.json"`.
- Polun tarkkuus: yrittää ensin projektitiedoston vieressä olevaa polkua
  (suhteellinen) ja palaa sitten sovelluksen mukana toimitettuun
  `samples/`-hakemistoon.

**Generoitu ASM (ei osoitteen ohitusta):**
```
; .include "library.json" — 12 lohkoa
... (laajennetut lohkot seuraavat)
```

**Generoitu ASM (kuormitusosoitteella `C000`):**
```
; .include "library.json" @ $C000 — 12 lohkoa
*=$C000
... (laajennetut lohkot seuraavat)
```

> **Vinkki:** Käytä INCLUDE-komentoa luodaksesi uudelleenkäytettäviä
> aliohjelmakirjastoja, joita voit jakaa projektien välillä.
> `.inc`/`.asm`/`.s`-tiedostot sopivat parhaiten, kun haluat muokata kirjastoa
> tekstieditorissa tai jakaa sen muiden 6502-assemblerien kanssa;
> `.json`-tiedostot, kun kirjasto on luotu itse Visual Assemblerissa. Aseta
> latausosoite, kun kirjastolla ei ole omaa ORG:ta tai kun haluat ohittaa sen
> oletussijainnin.

> **2.1:** Sisällytetty tiedosto, jota ei löydy, on virhe, samoin kuin tiedosto,
> joka sisällyttää itsensä (suoraan tai alempana). Sisällytetyn tiedoston omat
> rivit `.include`, `.incbin` ja `.sid` ladataan myös suhteessa sen omaan
> kansioon, ja sen makrokutsuja laajennetaan – jopa 16 tasoa syvälle.

---

### TAULUKKO

Kuten **DIM tietyssä osoitteessa** — nimeää hakutaulukon ja määrittää sen
sijainnin muistissa. Lisää BYTE-, WORD- tai FILL-lohkot sen jälkeen
määrittääksesi taulukon sisällön.

| Ala    | Kuvaus                                               |
| ------ | ---------------------------------------------------- |
| Nimi   | Taulukon tunniste (esim. `väritaulukko`)             |
| Osoite | Kiinteä osoite, josta taulukko alkaa (esim. `$C000`) |

**Asiantuntijan syntaksi:**
```
.table väritaulukko $C000
```

**Generoitu ASM:**
```
väritaulukko:
```

Ohjelmalaskuri hyppää annettuun osoitteeseen. Täytä sisältö sijoittamalla
BYTE/WORD/FILL-lohkot TABLE-taulukon jälkeen.

**Koko:** 0 tavua.

---

### ORG

Määrittää, mihin kohtaan muistia ohjelma (tai sen osa) sijoitetaan – aivan kuin
aloitusosoite valittaisiin ennen konekielisen koodin kirjoittamista. Jokainen
ohjelma tarvitsee vähintään yhden ORG:n. C64 BASICin vakiomuotoinen ladattava
aloitusosoite on `$0801`.

| Ala       | Kuvaus                                                                             |
| --------- | ---------------------------------------------------------------------------------- |
| Osoite    | Uusi lähtöosoite (esim. `0801` heksadesimaalimuodossa tai `2049` detsembrimuotoon) |
| HEX / DEC | Vaihda osoitesyötön heksadesimaali- ja desimaalinäytön välillä                     |

**Asiantuntijan syntaksi:**
```
* = 000 dollaria
```

**Generoitu ASM:**
```
* = 000 dollaria
```

**Koko:** 0 tavua. ORG-lohko itsessään ei tuota konekielistä koodia.

Jokainen ORG-lohko aloittaa uuden osion. Seuraavat lohkot kootaan tästä
osoitteesta alkaen. Kun viet PRG:n, kaikki osiot yhdistetään yhdeksi tiedostoksi
– osioiden väliset aukot täytetään nollilla.

**Esimerkki — koodi kohdassa `$0801`, datataulukko kohdassa `$C000`:**
```
* = $0801
LDX #$00
silmukka:
LDA $C000,X
STA $D800,X
INX BNE-silmukka
RTS

* = $C000
.tavu $01, $02, $03, ...
```

> **Vinkki:** Jokaisen ohjelman on alettava ORG-lohkolla. Tyypillinen C64
> BASIC-ladattavan ohjelman aloitusosoite on `$0801` (2049 desimaalilukua). Kun
> **BASIC SYS -tynkä** on käytössä, assembler lisää lyhyen BASIC-rivin kohtaan
> `$0801` ja koodisi alkaa kohdasta `$080D`.

---

### SILMUKKA / SEURAAVA

Kuten **`FOR X=N TO 1 STEP -1 : ... : NEXT X`** BASICissa — laskee alaspäin
N:stä 1:een käyttäen X- tai Y-rekisteriä. Pudota LOOP-lohko, aseta käskysi sen
ja NEXT-rekisterin väliin, ja se toistuu automaattisesti oikean määrän kertoja.

#### SILMUKKA

| Ala          | Kuvaus                                                              |
| ------------ | ------------------------------------------------------------------- |
| Rekisteröidy | `X` tai `Y` — laskurirekisteri                                      |
| Laskea       | Silmukan iteraatiomäärä (heksa- tai desimaaliluku, esim. `0A` = 10) |
| Tarra        | Automaattisesti luotu silmukan otsikko (esim. `loop0`)              |

**Asiantuntijan syntaksi:**
```
.silmukka X, 10, silmukka0
```

**Generoitu ASM:**
```
LDX #$0A}silmukka0:
```

**Koko:** 2 tavua (LD_-operaatiokoodi + välitön operandi).

#### SEURAAVA

| Ala          | Kuvaus                                     |
| ------------ | ------------------------------------------ |
| Rekisteröidy | Automaattisesti sovitettu LOOP-rekisteriin |
| Tarra        | Automaattisesti linkitetty LOOP-tarraan    |

**Asiantuntijan syntaksi:**
```
.seuraava silmukka0
```

**Generoitu ASM:**
```
DEX BNE-silmukka0
```

**Koko:** 3 tavua (DEX + BNE + haaran offset).

**Esimerkki — 10 näytön solun tyhjentäminen:**
```
LDX #$0A
silmukka0:
LDA #$20 ; välilyönti
STA $0400,X
DEX
BNE silmukka0
```

---

### FOR / ENDF

Kuten **`FOR X=0 TO N-1 : ... : NEXT X`** BASICissa — laskee *ylöspäin*
nollasta. Ihanteellinen, kun tarvitset eteenpäin suuntautuvan indeksin,
esimerkiksi merkkijonon tai taulukon läpi askellettaessa.

#### FOR

| Ala          | Kuvaus                                                                                             |
| ------------ | -------------------------------------------------------------------------------------------------- |
| Rekisteröidy | `X` tai `Y` — laskurirekisteri                                                                     |
| Laskea       | Silmukan raja (heksa- tai desimaaliluku, esim. `$12` = 18). X/Y alkaa 0:sta ja päättyy raja-1:een. |
| Tarra        | Automaattisesti luotu silmukan otsikko (esim. `for0`)                                              |

**Asiantuntijan syntaksi:**
```
.X:lle, 12 dollaria, 0:lle
```

**Generoitu ASM:**
```
LDX #00$0:lle:
```

**Koko:** 2 tavua (LD_-operaatiokoodi + `#$00`).

#### ENDF

| Ala          | Kuvaus                                            |
| ------------ | ------------------------------------------------- |
| Rekisteröidy | Automaattisesti FOR-rekisteriin täsmäävä          |
| Tarra        | Automaattisesti linkitetty FOR-tarraan            |
| Laskea       | Kopioidaan automaattisesti pariliitetystä FOR:sta |

**Asiantuntijan syntaksi:**
```
.endf for0
```

**Generoitu ASM:**
```
INX CPX #12 $ BNE hintaan 0
```

**Koko:** 5 tavua (IN_ + CP_ #imm + BNE-offset).

**Esimerkki — tulosta tyhjään päättyvä merkkijono:**
```
LDX #$00
for0:
LDA msg,X ; msg = PETSCII-merkkijono kiinteässä osoitteessa
BEQ valmis ; null-terminaattori → poistuminen
JSR $FFD2 ; CHROUT
INX
CPX #$12 ; enintään 18 merkkiä
BNE for0
done:
RTS
```

> **SILMUKKA vs. FOR:** SILMUKKA laskee alaspäin (N→1) — hyvä viiveille,
> täyttöille ja pikselisilmukoille. FOR laskee ylöspäin (0→N) — hyvä
> merkkijono-/taulukkosyötteelle. Molemmat voivat käyttää X:ää tai Y:tä.

---

### TYÖNNÄ / VEDÄ

Kuten **muuttujien tallentaminen ennen GOSUBia ja niiden palauttaminen **:n
jälkeen — mutta käyttää 6502-laitteistopinoa. Jos aliohjelma käyttää A:ta, X:ää
tai Y:tä, se kiedotaan PUSH- ja PULL-käskyihin, jotta kutsuvan koodin rekisterit
säilyvät.

#### TYÖNNÄ

Lisää yhden tai useamman rekisterin pinoon. Järjestys on aina A → X → Y (sisin
ensin).

| Ala        | Kuvaus                                                           |
| ---------- | ---------------------------------------------------------------- |
| Rekisterit | Mikä tahansa yhdistelmä: `A`, `X`, `Y`, `AX`, `AY`, `XY`, `XY[X] |

**Asiantuntijan syntaksi:**
```
.push AXY
```

**Generoitu ASM (esimerkki: `AX`):**
```
PHA Lähetys PHA
```

**Koko:** 1 tavu A:lle (`PHA`), 2 tavua X:lle tai Y:lle (siirto + push).

#### VEDÄ

Palauttaa rekisterit pinosta käänteisessä **järjestyksessä ** (Y → X → A).

| Ala        | Kuvaus                                                |
| ---------- | ----------------------------------------------------- |
| Rekisterit | Sama kuin PUSH — täytyy vastata vastaavaa PUSH-lohkoa |

**Asiantuntijan syntaksi:**
```
.vedä AXY-suuntaan
```

**Generoitu ASM (esimerkki: `AX`):**
```
PLA VERO PLA
```

> **Sääntö:** PUSH- ja PULL-komentojen on aina käytettävä **samaa
> rekisterijoukkoa**. `PUSH AX` → `PULL AX` (palauttaa sisäisesti käänteisessä
> järjestyksessä: ensin X, sitten A).

---

### LOPPU / RTS-alias

Kuten **RTS, mutta ystävällisemmällä makronimellä ** — `.end` lähettää yhden
`RTS` tavun ja toimii lyhyenä aliohjelman päättäjänä asiantuntijatilassa.

**Asiantuntijan syntaksi:**
```
.end
```

**Generoitu ASM:**
```
RTS
```

**Koko:** 1 tavu.

Käytä tätä, kun haluat aliohjelman loppumerkin, joka lukee hieman enemmän makron
kuin raakakäskyn kaltaisesti.

---

### MAKRO / LOPPU / KUTSU

Kuten **niminen GOSUB parametreilla ** — määrittele uudelleenkäytettävä
koodipätkä kerran (MACRO…ENDM) ja kutsu sitä sitten missä tahansa
INVOKE-komennolla. Anna eri argumenttiarvot joka kerta kopioinnin ja liittämisen
sijaan.

#### MAKRO (määritelmän alku)

| Ala        | Kuvaus                                                                             |
| ---------- | ---------------------------------------------------------------------------------- |
| Nimi       | Makron tunniste (esim. `setColor`)                                                 |
| Parametrit | Valinnaiset pilkulla erotetut parametrien nimet (esim. `color` tai `color, count`) |

Merkitsee makromääritelmän alun. MACRO- ja ENDM-lohkot ovat makron runko.
Parametreilla varustettu makro **ei luo koodia**, jossa määritelmä sijaitsee.
Myös parametriton makro tallennetaan sinne aliohjelmana, joten `JSR-nimi` kutsuu
sitä: ohjelmakulku hyppää sen yli (`JMP`), ja sen loppuun lisätään `RTS`. Sama
pätee tällaiseen makroon, joka on kiinteässä osoitteessa olevassa kirjastossa
(ilman `JMP`-osoitetta kirjasto on ohjelmakulun ulkopuolella). Käytä
`{paramName}`-parametria argumenttien paikkamerkkinä.

**Generoitu ASM:**
```
; .MACRO setColor (väri)
... (rungon lohkot)
; .ENDM
```

**Asiantuntijatilan syntaksi:**
```
.macro setColor väri
LDA {väri}
STA $D020
.endm
```

#### ENDM (määritelmän loppu)

Sulkee nykyisen makromäärityksen. Ei kenttiä.

#### VEDOTA

Kutsuu tässä kohdassa määriteltyä makroa ja korvaa annetuilla argumenttiarvoilla
`{paramName}` -paikkamerkit rungossa.

| Ala         | Kuvaus                                                                                       |
| ----------- | -------------------------------------------------------------------------------------------- |
| Makron nimi | Valitse määriteltyjen makroiden alasvetovalikosta                                            |
| Argumentit  | Pilkuilla erotetut argumenttiarvot, jotka vastaavat makron parametriluetteloa (esim. `#$07`) |

**Generoitu ASM:**
```
; .invoke setColor(#$07)
    LDA #$07
    STA $ D020
```

**Asiantuntijatilan syntaksi:**
```
; yksi argumentti:
.invoke setColor(#$07)

; useita argumentteja:
.invoke drawPixel($10, $20)

; ei argumentteja:
.invoke clearScreen

; teksti- / merkkijonoargumentit (lainausmerkeissä):
.invoke printText("Hei maailma!")

; .call-alias (synonyymi .invoke-metodille):
.call setColor(#$07)
```

Makron runko laajennetaan rivillä `{paramName}` korvattuna varsinaisilla
argumenteilla. Myös välilyönneillä erotettu muoto (`.invoke setColor #$07`) on
sallittu.

**Argumenttityypit:**
- **Numeerinen**: `#$07`, `$10`, `255` — heksa- tai desimaaliarvot
- **Tekstimerkkijonot**: `"Hei maailma!"` — lainausmerkeissä olevat merkkijonot;
  lainausmerkeissä olevia pilkkuja käsitellään osana tekstiä, ei argumenttien
  erottimina
- **Sekoitettu**: `#07$, "hello", 20$` — mikä tahansa yhdistelmä

> **Vinkki:** Määrittele makrot ohjelmasi ylä- (tai alareunassa) ja KUTSU niitä
> sitten tarvittaessa. Makroja voidaan kutsua useita kertoja eri argumenteilla.

> **2.1:** makro voi kutsua toista makroa (`both(a, b)` kutsumalla `setc(a)`);
> sisempi kutsu saa ulomman kutsun argumentit ja omat yksilölliset paikalliset
> tunnisteensa. Itseään kutsuva makro pysähtyy virheeseen 16 tason jälkeen
> jumiutumisen sijaan.

---

### ALUE / LOPPUALUE

Puhtaasti visuaalinen ryhmittely — **nolla tavua**, nolla vaikutusta koottuun
koodiin. Kuten BASIC-ohjelman osan taittaminen nimetyksi lohkoksi, jotta voit
kutistaa sen ja keskittyä johonkin muuhun.

| Ala         | Kuvaus                                                                           |
| ----------- | -------------------------------------------------------------------------------- |
| Alueen nimi | Vapaamuotoinen tekstiotsikko osiolle (esim. `init`, `game_loop`, `sprite_setup`) |

**Asiantuntijan syntaksi:**
```
.region init
; lohkot...
.endregion
```

**ALUE-lohkon otsikon ohjausobjektit (aina näkyvissä):**
- **▸ / ▾ ** — kutistaa tai laajentaa koko alueen. Kun kutistetaan, kaikki
  lohkot REGIONin ja ENDREGIONin välillä piilotetaan.
- **↕ Laajenna kaikki** — poistaa alueen sisällä olevien yksittäisten lohkojen
  tiivistyksen ja laajentaa itse aluetta tarvittaessa.
- **⦵ Valitse ASM:ssä** — korostaa koko alueen koodialueen ASM-näkymässä
  (välillä `; ===[ nimi ]===` väliin `; ===[/ nimi]===`) ja vierittää siihen.
  Vaihtaa ASM-välilehdelle automaattisesti, jos se ei ole tällä hetkellä
  näkyvissä.
- **⧉ Kopioi alue** — kopioi REGION-lohkon, kaikki alilohkot ja vastaavan
  ENDREGION-lohkon leikepöydälle. Vilkkuva ✓-merkki vahvistaa kopioinnin.
- **⎘ Liitä alue** — lisää kopioidun alueen uutena alueena välittömästi nykyisen
  alueen END-ALUE-kohdan jälkeen ja vierittää siihen. Painike on himmennetty,
  kunnes alue on kopioitu.

**Generoitu ASM:**
```
; alueen init
    SEI
    LDA #$00
    STA $ D020
; endregion init
```

**Koko:** 0 tavua sekä REGION- että ENDREGION-kohteille.

**Esimerkki työnkulusta:**
1. Lisää `REGION`-lohko ja aseta alueen nimeksi `init`.
2. Lisää alustusohjeet sen alle.
3. Lisää `ENDREGION`-lohko sulkeaksesi osion.
4. Napsauta ▸ ALUE-kohdassa kutistaaksesi koko osion yhdelle riville samalla,
   kun työskentelet ohjelman muiden osien parissa.

> **Huom:** Alueet voivat olla **sisäkkäisiä** toistensa sisällä. Jokainen
> PÄÄALUE sulkee lähimmän avoimen ALUEEN. Ei vaikutusta koottuun tulosteeseen.

---

### MÄÄRITTELE / JOS / MUUTEN / ENDIF

Kuten **-kytkin, assembler lukee** — `DEFINE DEBUG` kytkee symbolin päälle,
minkä jälkeen mikä tahansa `IF DEBUG`-lohko sisällytetään ja sen `ELSE`-haara
ohitetaan. Poista DEFINE-lohko ja IF-lohko katoaa tulosteesta. Julkaisuversioita
varten ei tarvitse poistaa koodia.

#### MÄÄRITELLÄ

| Ala     | Kuvaus                                                                                      |
| ------- | ------------------------------------------------------------------------------------------- |
| Symboli | Yksi tai useampi pilkulla erotettu tunniste aktivoitavaksi (esim. `DEBUG` tai `DEBUG, PAL`) |

**Asiantuntijan syntaksi:**
```
.define VIRHEENJÄRJESTELMÄ, PAL
```

**Generoitu ASM:**
```
; .DEFINE DEBUG
; .DEFINE DEBUG, PAL
```

`DEFINE`-lohko voi aktivoida useita symboleja kerralla (pilkulla erotettuna).
Sijoita DEFINE-lohkot ohjelmasi alkuun. Lohkon poistaminen deaktivoi kaikki sen
symbolit välittömästi.

#### JOS

| Ala   | Kuvaus                                                                                                                                                           |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kunto | Symboli `.define`d (aktiivinen), nimi `.const` (aktiivinen, kun se ei ole nolla) tai vakiolauseke (`LEVEL == 2`); jos sellaista ei voida evaluoida, se on virhe. |

**Asiantuntijan syntaksi:**
```
.if VIRHEENJÄRJESTELMÄ
```

**Generoitu ASM:**
```
; .JOS VIRHEENJÄRJESTELMÄ
```

Lohkot `IF` ja `ENDIF` (tai `ELSE`) välillä sisällytetään tai ohitetaan sen
perusteella, onko ehtosymbolilla vastaava `DEFINE` ohjelmassa. Ohitetut lohkot
näkyvät kommentteina `; [IF skipped] …` ja generoivat ** nolla tavua**.

#### MUU

Ei kenttiä. Merkitsee vaihtoehtoisen haaran — kootaan, kun `IF`-ehto on *not*
aktiivinen.

**Asiantuntijan syntaksi:**
```
.muu
```

**Generoitu ASM:**
```
; .ELSE
```

#### ENDIF

Ei kenttiä. Sulkee ehdollisen lohkon.

**Asiantuntijan syntaksi:**
```
.endif-tiedosto
```

**Generoitu ASM:**
```
; .ENDIF
```

**Koko:** 0 tavua kaikille neljälle lohkolle. Vain niiden välissä oleva sisältö
* lasketaan.

**Esimerkki — debug border flash, release build ohittaa sen:**
```
; .DEFINE DEBUG

; .IF DEBUG
LDA #$02 ; punainen reunus
STA $D020
; .ELSE
LDA #$00 ; musta (julkaisu)
STA $D020
; .ENDIF
```

**Esimerkki — useita symboleja yhdessä DEFINE-lohkossa:**
```
; .DEFINE DEBUG, PAL

; .IF PAL
LDA #$xx ; PAL-ajoitusvakio
; .ELSE
LDA #$xx ; NTSC-ajoitusvakio
; .ENDIF
```

Sisäkkäisiä `IF`-lohkoja tuetaan. Jos ulompi lohko ohitetaan, myös sisäiset
lohkot ohitetaan.

> **Huomautus:** Tämä on käännösaikaista ehtojen käsittelyä. Katso
> ajonaikaisesta vertailusta/haarautumisesta **Ajonaikainen IF / ELSE / ENDIF**
> alla.

### .ASSERT

*(Uutta versiossa 2.3.9.)* Käännösaikainen **järjenpitotarkistus**. `.assert`
arvioi lausekkeen kokoamisen aikana; jos se on epätosi (`0`), koonti pysähtyy
selkeään virheeseen, joka sisältää todellisen arvon. Jos se on tosi (ei nolla),
se ei tuota mitään.

| Ala     | Kuvaus                                                                                                                                |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Ilmaisu | Mikä tahansa assembler-lauseke: otsikot, `CONST`s, `*` (ohjelmalaskuri), aritmetiikka ja vertailut (`<`, `<=`, `>`, `>=`, `==`, `!=`) |
| Viesti  | Valinnainen teksti, joka on liitetty virheilmoitukseen                                                                                |

**Asiantuntijan syntaksi:**
```
.assert spriteData < $C000
.assert * < $A000
.assert end - start <= 256, "sprite-taulukko ylitti yhden sivun"
```

**Käyttäytyminen:**

- **Koko:** 0 tavua.
- Epätosi väittämä keskeyttää kokoamisen: `` `.assert end - start <= 256` on
  epätosi (arvo: 0). sprite-taulukko ylitti yhden sivun.``
- Väite, jota ei voida evaluoida (määrittelemätön otsikko tms.), epäonnistuu
  myös merkinnällä *"ei voida evaluoida kokoonpanon aikana"*.
- Vertailut tuottavat `1` / `0`; sijoita `.assert` mihin tahansa ohjelmavirran
  kohtaan — se tarkistetaan siinä osoitteessa, jossa se sijaitsee, joten
  `.assert * < $D000` testaa nykyisen tulosteen sijainnin.

**Esimerkki — sprite-lohkon suojaaminen sivun ylitykseltä:**
```
* = 3000 $
sprite_data:
.byte $00, $00, $00 ; … 63 tavua …
sprite_data_end:
.assert sprite_data_end - sprite_data == 63, "spriten on oltava täsmälleen 63 tavua"
.assert (sprite_data % 64) == 0, "spriten on oltava 64-tavuisesti tasattu"
```

---

### VAKION

Kuten **nimetty muuttuja, joka ei koskaan muutu** — `SCREEN = $0400`. Käytä
nimeä sen sijaan, että kirjoittaisit raakaosoitteita kaikkialle, mikä helpottaa
koodin lukemista ja muuttamista myöhemmin.

| Ala   | Kuvaus                                                                                                                               |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Nimi  | Vakion tunniste (esim. `SCREEN`)                                                                                                     |
| Arvo  | Numeerinen arvo valitussa kantaluvussa (esim. `0400` heksadesimaalimuodossa = osoite $0400) tai PC-relatiivinen lauseke (katso alla) |
| Muoto | HEX tai DE — määrittää, miten arvo syötetään ja näytetään                                                                            |

**Asiantuntijan syntaksi:**
```
.const NÄYTTÖ = $0400
.const KEHYKSET_1S = 60
```

**Generoitu ASM:**
```
; .VAKIONÄYTTÖ = 0400 $
```

Vakion nimi näkyy käskylohkojen **otsikkovalitsimen** alasvetovalikossa –
napsauta sitä lisätäksesi sen.

**PC-relatiiviset lausekkeet (`*+N` / `*-N`):**

Arvokenttään voidaan syöttää myös `*+N` tai `*-N`, jossa `*` on itse
CONST-lohkon käännösosoite. Tätä käytetään nimetyn aliaksen luomiseen tavulle
läheisen käskyn sisällä – klassinen itseään muokkaava koodimalli:

```
CONST op = *+1; op → seuraavan LDA:n välittömän operandin osoite
LDA #$00; $00 päivitetään ajonaikana
...
STA op; ylikirjoittaa #$00-tavun → LDA lukee uuden arvon seuraavalla kerralla
```

CONST-muuttuja tuottaa 0 tavua; käännöksen yhteydessä sen nimi palautuu muotoon
`current_address + 1`.

**Aritmeettiset lausekkeet:**

Arvokenttä hyväksyy yleisiä aritmeettisia lausekkeita, mukaan lukien viittaukset
aiemmin määriteltyihin CONST-nimiin, heksadesimaali-/binääriliteraaleihin ja
sisäänrakennettuihin matemaattisiin funktioihin:

```
.const SCREEN = $0400
.const SCREEN_END = SCREEN + 40*25 ; 1000 tavua myöhemmin
.const COLOR_RAM = $D800
.const MID_X = 160
.const SIN_TABLE = round(sin(PI/8) * 127) ; esilaskettu siniarvo
```

**Sisäänrakennetut funktiot:** `sin()`, `cos()`, `round()`, `max(a,b)`,
`min(a,b)`, `abs()`, vakio `PI`

Operaattorit: `+ - * /` Literaalit: `$FF` (heksadesimaali), `%10110000`
(binääri) Matala/korkea tavu: `lo(lauseke)`, `hi(lauseke)`

**Koko:** 0 tavua.

---

### VAR

Kuten **CONST, mutta automaattisesti allokoitu** — `VAR` varaa nollasivuisen
tallennustilan etiketille ilman, että sinun tarvitsee kirjoittaa osoitetta.
Käytä sitä laskureille, osoittimille ja lyhytaikaisille tiloille, jotka kuuluvat
ZP:hen.

| Ala                | Kuvaus                                                                 |
| ------------------ | ---------------------------------------------------------------------- |
| Nimi               | Muuttujan nimi / otsikko                                               |
| Koko (valinnainen) | Varattavien tavujen määrä. Jätä pois, jos varauksia on vain yksi tavu. |

**Asiantuntijan syntaksi:**
```
.var-laskuri
.var ajastin, 2
.var elää
```

**Käytännön esimerkki:**
```
.region Vars
.var-laskuri
.var ajastin, 2
.endregion

LDA #$00
STA laskuri
```

**Generoitu ASM:**
```
; .var-laskuri
```

**Koko:** 1 tavu oletusarvoisesti tai `N` tavua, kun koko on määritetty.

Allokaattori kävelee konfiguroitavan nollasivun kursorin (`$02` - `$FE`) yli ja
varaa seuraavan vapaan paikan. Jos pyydetty alue on päällekkäinen jo käytetyn
tunnisteen kanssa, kääntäjä antaa varoituksen.

---

### Suorituksenaikainen JOS / MUUTEN / ENDIF

Kuten **oikea haarautumismalli** — tämä versio toimii ajonaikana, ei
käännösaikana. Se vertaa `A`, `X` tai `Y` välittömään arvoon ja tuottaa oikean
`CMP` / `CPX` / `CPY` + haarautumissekvenssin puolestasi.

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

Vertailu on oletusarvoisesti etumerkitön. Rekistereille `<=` ja `>` makro
laajenee valitun rekisterin lyhyimpään vastaavaan haaraketjuun.

Esimerkki: **Suorituksenaikainen IF / ELSE demo**
(`samples/runtime-if-demo.asm`).

---

### SAMALLA / LOPPU

Kuten **suorituksenaikainen silmukka, jonka alussa on testi** — runko
suoritetaan niin kauan kuin ehto pysyy tosi.

| Ala          | Kuvaus                                       |
| ------------ | -------------------------------------------- |
| Rekisteröidy | `A`, `X` tai `Y`                             |
| Operaattori  | `==`, `!=`, `&lt;`, `&lt;=`, `&gt;`, `&gt;=` |
| Arvo         | Välitön arvo heksa- tai desimaalimuodossa    |

**Asiantuntijan syntaksi:**
```
.kun A != #$00
JSR-hakumerkki
.endw
```

**Koko:** Riippuu silmukan rungosta ja vertailumuodosta.

Käytä `WHILE`-metodia, kun silmukka saattaa päättyä ennen ensimmäisen iteraation
päättymistä. Se on laskemiseen perustuvan `LOOP / NEXT` -apufunktion
ajonaikainen vastine.

---

### TOISTA / KUNNES

Kuten **suorituksenaikainen silmukka, jonka lopussa on testi** — runko
suoritetaan aina ainakin kerran, minkä jälkeen ehto päättää, pysähtyykö se.

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

Käytä `REPEAT / UNTIL`, kun haluat rungon suoritettavan ainakin kerran ennen
poistumistarkistusta.

---

### MEMCPY / MEMSET

Kuten **pienet muistirutiinit, joita tavoittelet jatkuvasti** — `MEMCPY` kopioi
yhtenäisen lohkon, `MEMSET` täyttää alueen yhdellä tavulla.

| Makro          | Kentät                   |
| -------------- | ------------------------ |
| `MEMCPY`       | `lähde`, `dst`, `koko`   |
| `MUISTIASETUS` | `osoite`, `arvo`, `koko` |

**Asiantuntijan syntaksi:**
```
.memcpy src=$C000, dst=$D000, koko=$0100
.memset addr=$0400, arvo=#$20, koko=$03E8
```

**Luotu ASM:** riviin upotettuja kopiointi-/täyttösilmukoita, jotka on valittu
vastaamaan pyydettyä kokoa.

Jopa 256 tavun koot käyttävät lyhyttä 8-bittistä silmukkaa. Suuremmat koot
vaihtavat automaattisesti 16-bittiseen laskuriin.

> **2.1:** Koodin koko on tiedettävä jo koodia piirrettäessä — luku tai vakio.
> Myöhemmin määritelty merkintä (jonka arvoa asettelu ei vielä tiedä) on virhe
> eikä paikkaansa sopimaton koodi.

---

### TULOSTA / TULOSTA_MERKKI / TULOSTA_HEX / TYHJENNÄ_NÄYTTÖ / ODOTA_NÄPPÄIN / VIIVE / ASETA_REUNUS / ASETA_REUNUS

#### PAINAA

Kuten **PETSCII-tuloste ilman vakiomuotoista **-lohkoa — tulostaa merkkijonon
`CHROUT`-lohkon kautta samalla isojen/pienten kirjainten käsittelyllä kuin
PETSCII-lohko. Pienten kirjainten valintaruutu jaetaan PETSCII-kooderin kanssa,
joten tekstipolku pysyy yhtenäisenä.

**Asiantuntijan syntaksi:**
```
.print "HEI"
.print "hei", alempi
```

#### TULOSTA_MERKKI

Tulostaa yhden PETSCII-tavun numeerisena koodina ja lähettää sen
`CHROUT`-funktion kautta. Arvo voi olla myös nimetty vakio tai tunniste, joka
muunnetaan tavuksi kokoamisvaiheessa sekä lohko- että asiantuntijatilassa.

**Asiantuntijan syntaksi:**
```
.print_char 65
.print_char $41
.print_char väri
```

#### TULOSTA_HEX

Tulostaa 8-bittisen arvon heksadesimaalimuotoisena tekstinä normaalin
KERNAL-tulostuspolun kautta.

**Asiantuntijan syntaksi:**
```
.print_hex A
```

#### TYHJENNÄ_NÄYTTÖ

Pikanäppäin C64:n vakiomuotoiseen selkeän näytön ohjauskoodiin.

**Asiantuntijan syntaksi:**
```
.selkeä_näyttö
```

#### WAIT_KEY

Odottaa, kunnes näppäintä painetaan, joten sinun ei tarvitse suorittaa
`GETIN`-silmukkaa käsin joka kerta.

**Asiantuntijan syntaksi:**
```
.wait_key
```

#### VIIV.

Odottaa pyydetyn määrän kehyksiä jaetun apurutiinin kautta. Käytä tätä lyhyisiin
taukoihin ja ajoitusaukkoihin, kun täysin mukautettu silmukka olisi liiallinen.
Kehysten määrä voi olla raakaluku tai nimetty vakio, ja `.wait` on vain
`.delay`:n alias.

**Asiantuntijan syntaksi:**
```
.delay 29
.wait 29
.delay frames=FRAMES_1S
```

Lohkotilassa viivekenttä käyttää kompaktia vakiovalitsinta, kun symbolinen arvo
on käytettävissä, joten sinun ei tarvitse kirjoittaa nimeä manuaalisesti joka
kerta.

#### ASETA_REUNUS / ASETA_REUNUS

VIC-II-värirekisterien mukavuuskääreet. Väriarvo voi olla raakaluku tai nimetty
vakio, joka ratkaisee välillä 0–15. Sekä lohkotila että asiantuntijatila
hyväksyvät tässä symboliset vakioiden nimet.

**Asiantuntijan syntaksi:**
```
.set_border 6
.set_bg 0
.set_borderin väri
.set_bg väri
```

**Koko:** Jokainen apufunktio laajenee pieneksi rekisterin kirjoitussekvenssiksi
tai lyhyeksi KERNAL-kutsuksi.

Lohkotilassa nämä kentät käyttävät myös vakiovalitsinta, joten symbolinen arvo
pysyy näkyvissä sen sijaan, että se korvattaisiin raakaluvulla.

---

### IRQ_SETUP

Määrittää rasteri-IRQ-käsittelijän yhdellä vaiheella. Makro kirjoittaa
IRQ-vektorin, ottaa käyttöön rasteri-IRQ:t, asettaa linjan, poistaa käytöstä
yleiset CIA:n IRQ-lähteet ja palaa normaaliin suoritukseen komennolla `CLI`.

| Ala         | Kuvaus                                                  |
| ----------- | ------------------------------------------------------- |
| Käsittelijä | IRQ-rutiinin nimi (esim. `my_irq`)                      |
| Rasteri     | Rasteriviiva heksa- tai desimaalimuodossa (esim. `$FA`) |

**Asiantuntijan syntaksi:**
```
.irq_setup-käsittelijä=my_irq, rasteri=$FA
```

**Koko:** Lyhyt asennussekvenssi; tarkka pituus riippuu valitusta
rasteriviivasta.

Käytä tätä, kun haluat yleisen "SEI / asennuskäsittelijä / IRQ:n käyttöönotto /
CLI" -mallin hajottamatta sitä koko ohjelmaan.

---

### SATUNNAINEN

Kuten pieni sisäänrakennettu PRNG** — palauttaa 8-bittisen pseudo-satunnaisen
arvon kompaktista nollasivuisesta siemenestä.

| Ala    | Kuvaus                                                             |
| ------ | ------------------------------------------------------------------ |
| Siemen | Valinnainen nollasivun siementavu tai -tunniste (oletusarvo `$FB`) |

**Asiantuntijan syntaksi:**
```
.rand
```

**Koko:** Muutama tavu valitusta toteutustavasta riippuen.

Generaattori on tarkoitettu pelattavuuteen, tehosteiden muunteluun ja nopeaan
testidataan. Se on tarkoituksella pieni eikä kryptografisesti hienostunut.

---

<a id="sprite_init"></a>
### SPRITE_INIT

Määrittää VIC-II-spritin yhdessä lohkossa — BASICissa kirjoitettavien noin
kuuden POKE-lausekkeen sijaan riittää, että täytät kentät. Asettaa spritin
dataosoittimen, ottaa sen käyttöön, valinnaisesti ottaa käyttöön moniväritilan
ja asettaa sen värin.

| Ala         | Kuvaus                                                                  |
| ----------- | ----------------------------------------------------------------------- |
| Sprite #    | Sprite-numero 0–7                                                       |
| Väri        | Väri-indeksi 0–15 (C64-paletti)                                         |
| Tietosivu   | Sprite-datan osoite / 64 (esim. `$21`, jos data on osoitteessa `$0840`) |
| Monivärinen | Vaihtaa спрайtin monivärisbitin päälle/pois (`$D01C`)                   |

**Asiantuntijan syntaksi:**
```
.sprite_init 0, 7, $21
.sprite_init 0, 7, $21, monivärinen
.sprite_init 0, 7, $21, mono
```

**Generoitu ASM:**
```
LDA #$21
STA $07F8 ; sprite-osoitinrekisteri ($07F8 + N)
LDA $D015
ORA #$01 ; aseta spritin 0 aktivointibitti
STA $D015
LDA $D01C
JA #$FE ; tyhjennä spriten 0 moniväribitti
STA $D01C
LDA #$07
STA $D027 ; spriten 0 värirekisteri
```

**Koko:** 26 tavua.

> **Sprite-tietosivu:** `tieto_osoite ÷ 64`. Oletusarvoisella BASIC SYS
> -tynkällä `ALIGN 64` sivun `JMP main` jälkeen sijoittaa sprite-tiedot kohtaan
> `$0840` → sivu = `$21`.

---

<a id="sprite_pos"></a>
### SPRITE_POS

Kuten **`POKE 53248, x : POKE 53249, y`** BASICissa — asettaa spritin
aloituskohdan. Koordinaatit syötetään sisään kokoamisvaiheessa, ja kentät
hyväksyvät vakioita lohkotilassa; animaatioon käytä `INC`/`DEC` suoraan spritin
rekisterissä.

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
LDA #$98; X matala tavu
STA $D000; спрайт 0 X-rekisteri
LDA $D010
JA #$FE; tyhjennä X MSB спрайтille 0 (X ≤ 255)
STA $D010
LDA #$64; Y = 100
STA $D001; спрайт 0 Y-rekisteri
```

Jos X > 255, makro asettaa vastaavan bitin kohtaan `$D010` sen tyhjentämisen
sijaan.

**Koko:** 18 tavua.

> **Huomautus:** `SPRITE_POS` lisää X/Y-matriisin koodiin (`LDA #$xx`).
> Sprite-objektin animoimiseksi suorituksen aikana käytä `INC $D000` / `DEC
> $D000` — katso `sprite-macro-demo` esimerkki.

---

<a id="wait_raster"></a>
### WAIT_RASTER

Odottaa, että VIC-II-elektronisuihku saavuttaa tietyn skannausviivan – ikään
kuin synkronoituisi TV-ruudun kanssa. Aseta tämä pelisilmukan alkuun estääksesi
spritejen repeytymisen. Ei JSR:ää, ei etikettiä tarvita.

| Ala          | Kuvaus                                                     |
| ------------ | ---------------------------------------------------------- |
| Rasteriviiva | Kohderasteriviiva heksadesimaalina (esim. `FF` = rivi 255) |

**Asiantuntijan syntaksi:**
```
.wait_raster $FF
```

**Generoitu ASM:**
```
odota:
LDA $D012 ; nykyinen rasteririvi
CMP #$FF ; kohderivi
BNE odota ; silmukka takaisin (-7 tavua)
```

**Koko:** 7 tavua (`BNE`-offset `$F9` = −7 osoittaa aina takaisin
`LDA`-kohtaan).

> **Vinkki:** Aseta `WAIT_RASTER` pelisilmukan yläreunaan synkronoidaksesi sen
> näytön kanssa ja estääksesi spritejen repeytymisen.

---

### OHJAUSSAUVA

Kuten **`PEEK($DC00)`** lukeminen ja sitten справимая справита справита – mutta
yhdessä lohkossa. Lukee yhden CIA-joystick-portin ja säätää справита
X/Y-rekistereitä vastaavasti. Täysin inline-tilassa, ei JSR:ää tarvita.

| Ala      | Kuvaus                                                            |
| -------- | ----------------------------------------------------------------- |
| Portti   | `1` = portti 1 (`$DC01`) tai `2` = portti 2 (`$DC00`)             |
| Sprite # | Sprite-numero 0–7 (säätelee, mitä X/Y-rekisteriparia päivitetään) |

**Asiantuntijan syntaksi:**
```
.ohjaussauva 2, 0
```

**Generoitu ASM (portti 2, sprite 0):**
```
LDA $DC00; lue CIA-portti 2
LSR; bitti 0 → siirto (ylös)
BCS skip_up; siirto asetettu = EI painettu
DEC $D001; Y−1 (siirrä ylös)
skip_up:
LSR; bitti 1 → siirto (alas)
BCS skip_down
INC $D001; Y+1 (siirrä alas)
skip_down:
LSR; bitti 2 → siirto (vasemmalle)
BCS skip_left
DEC $D000; X−1 (siirrä vasemmalle)
skip_left:
LSR; bitti 3 → siirto (oikealle)
BCS skip_right
INC $D000; X+1 (siirrä oikealle)
skip_right:
```

** Ohjaussauvan bittikartta (aktiivinen-LOW — bitti = 0 tarkoittaa
painettuna):**

| Bitti | Suunta | CIA-rekisteri                       |
| ----- | ------ | ----------------------------------- |
| 0     | Ylös   | $DC00 (portti 2) / $DC01 (portti 1) |
| 1     | Alas   |                                     |
| 2     | Vasen  |                                     |
| 3     | Oikea  |                                     |
| 4     | Palo   | (tämä makro ei käsittele)           |

**Koko:** 27 tavua. `BCS`-offset on aina `+3` (ohittaa seuraavan 3-tavuisen
`DEC`/`INC abs` -käskyn).

**Muuttujatila — `.joystick port, vx, vy[, fire]`:** Spriten siirtämisen sijaan
suunta kirjoitetaan muuttujiin: `vx` / `vy` = `-1` / `0` / `+1` (`$FF` / `$00` /
`$01`), ja valinnainen `fire` = `1`, kun painiketta painetaan, `0` muuten. Käytä
sitä vieritettävään kameraan, pelaajaan, jolla on oma fysiikka, tai valikoihin.
Portti `3` lukee molemmat joystick-portit samanaikaisesti (`LDA $DC00` / `AND
$DC01`), joten kumpi tahansa portti toimii.

```
.joystick 2, vx, vy; 35 tavua
.joystick 3, vx, vy, fire; molemmat portit + fire: 45 tavua
```

> **Tyypillinen käyttö:** Sijoita `gameloop`-otsikon sisään ensin `WAIT_RASTER`:
> ```
> pelinkehitys:
> WAIT_RASTER ($FF) JOYSTICK (portti=2, sprite=0)
> JMP-pelinkehitys
> ```

---

<a id="mouse"></a>

> **2.1:** portti on tiedettävä koodia kirjoitettaessa (numero tai vakio), koska
> portti 3 pidentää koodia 3 tavua; myöhemmin määritelty tunniste on virhe.
### HIIRI

Lukee Commodore 1351 -suhteellisen hiiren ja liikuttaa спрайтиa. Täysin
**inline** — ei JSR:ää tai label-koodausta tarvita. Makro valitsee CIA-portin,
odottaa SID-mela-sisääntulojen tasaantumista, dekoodaa sitten delta-liikkeen
käyttämällä 1351-vakioajurikuviota ja soveltaa sitä спрайтirekistereihin.

| Ala       | Kuvaus                                                                              |
| --------- | ----------------------------------------------------------------------------------- |
| Portti    | `1` = CIA `$DC00` bittiä `7:6` = `%01`; `2` = `%10`                                 |
| Sprite #  | Sprite-numero 0–7                                                                   |
| ZP-tavu X | Nollasivun osoite (heksa) edellisen POTX-näytteen säilyttämistä varten (esim. `FD`) |
| ZP-tavu Y | Nollasivun osoite (heksa) edellisen POTY-näytteen säilyttämistä varten (esim. `FE`) |

**Generoitu ASM-muoto (portti 1, sprite 0, ZP `$FD`/`$FE`):**

```
; CIA-portin valinta + selvitys
LDA $DC00
JA #$3F
ORA #$40
STA $DC00
LDX #$67
odota:
DEX BNE odota

; X-akseli — standardi 1351-tyylinen 7-bittinen delta-dekoodaus
LDA $D419
TAY SEC SBC $FD JA #$7F LDX #$00 CMP #$40 BCS xneg LSR A BEQ xdone STY $FD CLC ADC $D000 STA $D000 TXA ADC #$00 JA #$01 BEQ xdone LDA $D010 EOR #$01 STA $D010 JMP xdone
xneg: ORA #$C0 CMP #$FF BEQ xdone SEC ROR DEX STY $FD CLC ADC $D000 STA $D000 TXA ADC #$00 JA #$01 BEQ xdone LDA $D010 EOR #$01 STA $D010
xdone:

; Y-akseli — sama dekoodaus, sitten käännetty päinvastaiseksi ennen käyttöönottoa
LDA $D41A
VERO SEC SBC $FE
JA #$7F CMP #$40 BCS yneg LSR A BEQ ydone STX $FE EOR #$FF SEC ADC $D001 STA $D001 JMP ydone
yneg:
ORA #$C0 CMP #$FF BEQ ydone SEC ROR STX $FE EOR #$FF SEC ADC $D001 STA $D001
ydone:
```

**Koko:** 142 tavua.

**Asiantuntijatilan syntaksi:**
```
.mouse-portti, spriteNum, zpX, zpY
; esimerkki:
.mouse 2, 0, FD, FE
```

> **Tärkeää:** Ennen ensimmäistä kutsua alusta nollasivutavut nykyisillä
> POTX/POTY-arvoilla välttääksesi hypyn ensimmäisessä kehyksessä:
> ```
> ; portti 1: LDA $DC00 : JA #$3F : ORA #$40 : STA $DC00
> ; portti 2: LDA $DC00 : JA #$3F : ORA #$80 : STA $DC00
> LDA $D419 : LSR A : JA #$3F : STA $FD
> LDA $D41A : LSR A : JA #$3F : STA $FE
> ```

> **Vinkki:** Kysele hiirtä kerran kehystä kohden — lisää `WAIT_RASTER`
> pelisilmukkaan ennen `MOUSE`.

---

<a id="sprite_col"></a>
### SPRITE_COL

Kuten BASICin **`PEEK($D01E)`** — tarkistaa VIC-II-laitteiston törmäysrekisterit
ja kertoo, osuiko sprittiin toiseen spriteen vai taustaan. Täysin
inline-tilassa, ei JSR:ää tarvita.

| Ala           | Kuvaus                                                                                                                |
| ------------- | --------------------------------------------------------------------------------------------------------------------- |
| Sprite #      | Spriten numero 0–7 (mitä spritin bittiä tarkistetaan)                                                                 |
| Törmäystyyppi | `Sprite-Sprite ($D01E)` — törmäys toisen spriten kanssa; `Sprite-Background ($D01F)` — törmäys taustagrafiikan kanssa |

**Asiantuntijan syntaksi:**
```
.sprite_col 0, sprite
.sprite_col 0, tausta
```

**Generoitu ASM (sprite 0, sprite–sprite):**
```
LDA $D01E ; lue sprite-sprite-törmäysrekisteri (tyhjentää sen!)
JA #$01 ; eristä bitti 0 (sprite 0)
; A ≠ 0 → törmäys tapahtui
```

**Koko:** 5 tavua.

> **Tärkeää:** Lukeminen `$D01E`/`$D01F` ** tyhjentää rekisterin**. Lue se
> kerran kehystä kohden ja toimi tuloksen perusteella välittömästi komennolla
> `BEQ`/`BNE`.

**Tyypillinen käyttö:**
```
pelinkehitys:
WAIT_RASTER ($FF)
JOYSTICK (portti=2, sprite=0)
SPRITE_COL (sprite=0, tyyppi=sprite-sprite)
BEQ no_hit ; A = 0 → ei törmäystä
LDA #$02
STA $D020 ; punainen reunus = osuma!
JMP pelinkehitys
no_hit:
LDA #$0E
STA $D020 ; vaaleansininen reunus = tyhjä
JMP pelinkehitys
```

> **Katso myös:** `törmäysdemo` esimerkki — vihreä pallo (sprite #0) vs.
> punainen risti (sprite #1).

---

### LATAA TIEDOSTO

Kuten BASICissa komennot **`LOAD "tiedosto",8`** — lataa tiedoston D64-levyltä
suorituksen aikana käyttämällä KERNAL LOAD -rutiinia. Käytä tätä ladataksesi
tietoja, musiikkia tai muuta koodia levyltä ohjelman ollessa käynnissä.

| Ala                           | Kuvaus                                                                                                                                                                                                                |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tiedostonimi                  | Tiedoston nimi levyllä (enintään 16 merkkiä, automaattisesti isot kirjaimet; merkit `,`, `"`, `/`, `\`, `:`, `*`, `?`, `<`, `>`, `|` suodatetaan)                                                                     |
| Laite                         | Laitenumero 8–30 (oletus `8`)                                                                                                                                                                                         |
| Ohitusosoite (valinnainen)    | Heksamuotoinen latausosoite (esim. `C000`). Jos asetettu, tiedosto ladataan tähän osoitteeseen (`sec=0`, jättäen PRG-otsikon huomiotta). Jätä tyhjäksi käyttääksesi tiedoston omaa 2-tavuista PRG-otsikkoa (`sec=1`). |
| Virheen otsikko (valinnainen) | Jos asetettu, JSR LOAD -käskyn jälkeen luodaan `BCS`-käsky. Jos KERNAL palauttaa carry set -arvon (virhe), suoritus hyppää tähän tunnisteeseen.                                                                       |

**Asiantuntijan syntaksi:**
```
.loadfile "DEMO-VÄRIT", 8
.loadfile "DEMO-VÄRIT", 8, $C000
.loadfile "DEMO-VÄRIT", 8, $C000, virheen_tunniste
```

**Generoidun koodin rakenne:**
```
JMP skip_filename; hyppää rivinsisäisen tiedostonimen yli
.byte "DEMO-COLORS"; tiedostonimen tavuja (PETSCII, 11 merkkiä)
skip_filename:
LDA #11; tiedostonimen pituus
LDX #<fname; osoitin lo
LDY #>fname; osoitin hi
JSR $FFBD; SETNAM LDA #1; looginen tiedosto #1
LDX #8; laite 8
LDY #0; sec=0 (ohitusosoite) tai #1 (tiedoston oma osoite)
JSR $FFBA; SETLFS
LDA #0; LOAD-komento (ei VERIFY)
JSR $FFD5; LOAD BCS epäonnistui; (vain jos virheen nimi on asetettu)
```

**Koko:** `3 + tiedostonimen_pituus + 9 (SETNAM) + 9 (SETLFS) + (4 jos ohitus) +
5 (LOAD) + (2 jos virheen nimi)` tavua. Vähintään 27 tavua.

> **Tärkeää:** Tiedostonimi tallennetaan konekoodiin heti `JMP skip_filename`
> -makromerkinnän jälkeen. Levyllä olevan tiedostonimen on oltava isoja
> PETSCII-kirjaimia – mikä vastaa tavallisia ASCII-isoja kirjaimia (`A`–`Z`).
> Makro valvoo tätä automaattisesti.

> **Käytä aina virhetunnistetta** tuotanto-ohjelmissa — jos tiedostoa ei löydy,
> KERNAL asettaa siirtolipun ja suoritus siirtyy seuraavaan tehtävään.

> **Katso myös:** `loadfile-demo` esimerkki — esittelee `DEMO-COLORS.PRG`
> -tiedoston lataamista D64-tiedostosta BCS-virhehaaran ja visuaalisen
> virhenäytön avulla.

---

### EXODECRUNCH

Ohjelman sisäinen **Exomizer-pakkauksen purku**. Käytä tätä makroa heti
`LOADFILE`-komennon jälkeen, joka latasi Exomizer `mem`-tilassa pakatun virran —
EXODECRUNCH purkaa sen taaksepäin virtaan upotettuun osoitteeseen.

| Ala              | Kuvaus                                                                                                              |
| ---------------- | ------------------------------------------------------------------------------------------------------------------- |
| Pakkaajan osoite | Pakkauksenpurkukoodin sijainti muistissa (oletusarvo `B000`). Osoitteen on oltava 16-bittinen heksadesimaaliosoite. |

**Asiantuntijan syntaksi:**
```
.exodecrunch
.exodecrunch pakkauksenpurkuohjelma=B000 dollaria
```

**Generoitu koodi (19 tavua):**
```
LDA $AE; KERNAL latauksen loppu lo (asetettu edellisen LOAD-komennon mukaan)
STA $04; pakkauksen purkajan lähde-end-osoitin lo
LDA $AF; KERNAL latauksen loppu hi
STA $05; pakkauksen purkajan lähde-end-osoitin hi
LDA #$36; BASIC ROM pois päältä ($A000-$BFFF muuttuu RAMiksi)
STA $01
JSR pakkauksen purkaja; pakkauksen purkaja lukee takaa eteenpäin $04/$05:n kautta
LDA #$37; oletuskartoituksen palautus (BASIC + KERNAL + I/O)
STA $01
```

**Toimintaperiaate:**

1. KERNAL `LOAD` ($FFD5) päivittää ZP `$AE/$AF` -tiedoston osoittamaan yhden
   tavun viimeksi ladatun tavun ohi. EXODECRUNCH kopioi tämän ZP `$04/$05`
   -tiedostoon, mikä on Exomizerin virallinen taaksepäin lähteen ja pään välinen
   käytäntö.
2. Pakkauksenpurkuohjelma sijoitetaan tyypillisesti kohtaan `$B000` (BASIC ROM
   -muistin määrittämän alueen sisällä). Makro vaihtaa tilaan `$01 = $36`, joten
   suoritin näkee RAM-muistin siellä JSR:n aikana ja palauttaa sitten `$01 =
   $37` -muistin sen jälkeen.
3. Pakkauksen kohdeosoite **koodataan itse pakattuun tietovirtaan**, kun pakkaat
   sen komennolla `exomizer mem -l <load> file,<target>` — purkaja lukee sen
   virran ensimmäisistä tavuista.

**Pakkaajan binääritiedosto:** Valmiiksi rakennettu taaksepäin purkaja on
`samples/exo-decrunch.bin` (477 tavua, ORG $B000). Se on virallisen
`exodecrunch.asm`-tiedoston Kick Assembler-versio, johon on lisätty `INC $D020`
jokaiseen lukukertaan näkyvän reunan välähdysefektin aikaansaamiseksi purkamisen
aikana. Sijoita se ohjelmaasi `INCBIN`-lohkolla pakkaajan osoitteessa.

**Raakalasyöte:** ylimääräinen syöte välitetään Exomizerille raakana tiedostona,
joka ladataan Dst-osoitteeseen (`file@<Dst>`), joten pakkauksen purkaja
kirjoittaa jokaisen tavun ensimmäisestä alkaen täsmälleen kirjoittamaasi
osoitteeseen.

> **Katso myös:** `exo-multicolor-demo` esimerkki — täydellinen esimerkki päästä
> päähän: LATAA pakattu monivärinen bittikartta tiedostomuotoon $C000,
> EXODECRUNCH purkaa sen tiedostomuotoon $2000, kopioi sitten näyttö → $0400 ja
> väri → $D800, ja vaihda VIC-II moniväriseen bittikarttatilaan.

> **Integraatiotesti:** `cargo test --test exomizer_integration` (tiedostossa
> `src-tauri/`) tarkistaa täyden pakkauksen ja purun edestakaisen matkan
> 6502-emulaattorilla oikealla pakkauksenpurkubinäärillä. Läpäisykriteerit:
> 10000 tavua, joka on tavujen verran yhtä suuri kuin lähteen `multi-color.bin`.

---

### REU_CHECK

Havaitsee, onko Commodore RAM -laajennusyksikkö (REU) kytketty – ikään kuin
tarkistaisi `PEEK($D010)` laitteiston läsnäolon. Testaa kirjoittamalla ja
lukemalla kaksi kuviota REU-rekisteriin `$DF04`.

| Ala       | Kuvaus        |
| --------- | ------------- |
| Ei mitään | Ei operandeja |

**Generoitu koodi (34 tavua):**
```
LDA #55 dollaria
STA DF04 dollaria
LDA DF04 dollaria
CMP # 55 dollaria
BNE epäonnistuu
LDA #$AA
STA DF04 dollaria
LDA DF04 dollaria
CMP #$AA
BNE epäonnistuu
LDA #$00
CMP #$FF ; Z=0 => REU läsnä
BNE tehty
epäonnistua:
LDA #$FF
CMP #$FF ; Z=1 => ei REU:ta
tehty:
```
> Makro normalisoi tuloksen, joten seuraava haara pysyy yksinkertaisena: `BNE`
> tarkoittaa, että REU on läsnä, `BEQ` tarkoittaa, että REU puuttuu.

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
BEQ no_reu ; ohita, jos REU:ta ei ole
; ... REU koodi täällä ...
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
LDA #c64lo STA $DF02; C64 osoite LO
LDA #c64hi STA $DF03; C64 osoite HI
LDA #reuLo STA $DF04; REU osoite LO
LDA #reuHi STA $DF05; REU osoite HI
LDA #bank STA $DF06; REU pankki
LDA #lenLo STA $DF07; pituus LO
LDA #lenHi STA $DF08; pituus HI
LDA #$00 STA $DF09; osoitteen hallinta (kiinteä)
LDA #$00 STA $DF0A; keskeytysmaski (kiinteä)
LDA #cmd STA $DF01; suorita DMA ($90/$91/$92 = jemma/nouto/vaihto, välitön)
```

> **Huomautus:** Komennot käyttävät `$90/$91/$92` (bitti 4 asetettu = välitön
> DMA-tila). Kirjoittaminen kansioon `$DF01` aloittaa siirron; suoritin jatkaa
> toimintaansa, kun se on valmis.

---

### TURBO_SET

Asettaa **Ultimate-64 (U64) -prosessorin nopeuden** rekisterin `$D031` kautta.
Ei vaikutusta oikeaan C64:ään tai muihin emulaattoreihin.

**Kentät:**

| Ala         | Kuvaus                    | Alue                                                |
| ----------- | ------------------------- | --------------------------------------------------- |
| Nopeus      | Suorittimen nopeusindeksi | 0 = 1 MHz … 7 ≈ 10 MHz … 15 ≈ 48 MHz                |
| Huono linja | Badline-emulointi         | Käytössä (C64-yhteensopiva) / Pois käytöstä (turbo) |

Nopeustavu lasketaan seuraavasti: `(speedIndex & 0x0F) | (badline_disabled ?
0x80 : 0x00)`.

**Generoitu koodi (5 tavua):**
```
A9 xx LDA #speed_byte
8D 31 D0 STA D031 $
```

**Asiantuntijatilan syntaksi:**
```
.turbo_set 7,0 ; nopeus=7 (~10 MHz), huono linja käytössä
.turbo_set 15,1 ; nopeus=15 (~48 MHz), huono linja poistettu käytöstä
```

> **Huom:** Tämä makro vaikuttaa vain U64-laitteistoon. Oikealla C64:llä tai
> muilla emulaattoreilla tämä kirjoittaa tiedostoon `$D031`, mikä voi vaikuttaa
> CIA:han tai se voidaan jättää huomiotta.

---

### SUPERCPU_DETECT

Tarkistaa, onko **CMD SuperCPU** -kiihdytin asennettu — esimerkiksi
`PEEK($D0B8)`, ja tarkistaa, palauttaako se jonkin muun funktion kuin `$FF`.

**Generoitu koodi (5 tavua):**
```
AD B8 D0 LDA $D0B8
C9 FF CMP #$FF
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
BEQ no_scpu ; ohita, jos SuperCPU:ta ei ole
; ... SuperCPU:n turbo-koodi tähän ...
no_scpu:
```

---

### TURBO_KÄYTÖSSÄ

Kytkee **CMD SuperCPU turbo -tilan** päälle tai pois päältä. Kutsu ensin
`SUPERCPU_DETECT` ja ohita tämä, jos SuperCPU:ta ei ole.

| Tila            | Rekisteröidy | Vaikutus                                                   |
| --------------- | ------------ | ---------------------------------------------------------- |
| Ota käyttöön    | `$D07A`      | Turbo-ominaisuuden käyttöönotto (jopa 20 MHz SuperCPU:lla) |
| Poista käytöstä | `$D07B`      | Palaa 1 MHz:n yhteensopivuustilaan                         |

**Generoitu koodi (5 tavua):**
```
A9 00 LDA #$00
8D 7A D0 STA $D07A ; (tai D07B dollaria käytöstä poistamiseksi)
```

**Asiantuntijatilan syntaksi:**
```
.turbo_enable päällä
.turbo_enable pois päältä
```

> **Huomautus:** Kutsu ensin `SUPERCPU_DETECT`-makroa ja haaraudu tämän makron
> ympärille, jos SuperCPU:ta ei ole.

---

<a id="map_copy"></a>
### KARTTAKOPIO

Kopioi laattakartan lähdeosoitteesta näyttömuistiin (ja valinnaisesti
värimuistiin) käyttämällä sarjaa `LDA abs,X` / `STA abs,X` silmukoita. Yksi
256-tavuinen sivu kopioidaan silmukkaiteraatiota kohden; osittainen sivu lopussa
käyttää `CPX #rem / BNE` pysäyttämiseen. JSR-komentoa ei tarvita — kaikki koodi
luodaan inline-tilassa.

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
LDA $C000,X ; sivu 0
STA $0400,X
INX BNE *-9 ; toistuu, kunnes X päättyy nollaan (256 iteraatiota)
LDA $C100,X ; sivu 1
STA $0500,X
INX BNE *-9
LDA $C200,X ; sivu 2
STA $0600,X
INX BNE *-9
LDA $C300,X ; loppuosa — 232 tavua
STA $0700,X
INX CPX #$E8 BNE *-11
```

**Koko:** `2 (LDX) + fullPages×9 + (rem > 0 ? 11 : 0)` tavua osiota kohden.
Yhdistetty tila kaksinkertaistaa sen (näyttöosio + identtisen värin osio).

**Yhdistäminen karttaeditorin kanssa:**

Karttaeditorin **Files → Save map + color RAM (.bin)** vie yhden
binääritiedoston, jossa ensimmäiset `size` tavut ovat näyttökoodeja ja seuraavat
`size` tavut ovat väri-RAM-arvoja. Käytä MAP_COPY-komentoa, jossa **Combined
.bin** on valittuna ja osoita **Source addr** kohtaan, johon tämä tiedosto
ladataan (esim. INCBIN:n kautta kohtaan `$C000`):

```
* = $C000
INCBIN "map-color.bin" @ $C000 ; näyttökoodit $C000–$C3E7, väri $C3E8–$C7CF
* = $0801
; ...
MAP_COPY src=$C000 dst=$0400 size=1000 combined color_dst=$D800
```

**Asiantuntijatilan syntaksi:**
```
.map_copy $C000, $0400, 1000; vain näyttö
.map_copy $C000, $0400, 1000, automaattinen, $D800; yhdistetty (väri lähdearvolla + koko)
.map_copy $C000, $0400, 1000, $C3E8, $D800; eksplisiittinen värilähteen osoite
```

---

<a id="map_copy16x16"></a>
### KARTTA_KOPIO 16X16

Kopioi 16×16 merkkialueen kompaktista 256-tavuisesta näyttökoodilohkosta sekä
vastaavan 256-tavuisen Color RAM -lohkon. Se on tarkoitettu Charset Canvas
-viennille ja pienille laatta-/kuvalohkoille, joissa kuudentoista erillisen
MAP_COPY-rivin kirjoittaminen olisi kohinaa.

**Oletusasettelu:**

| Data                     | Oletusosoite                   |
| ------------------------ | ------------------------------ |
| 16×16 näyttökoodit       | Lähdeosoite (`src`)            |
| 16×16 väriarvot          | `lähde + 256`                  |
| Näytön RAM-muistin kohde | `0400 $ + rivi × 40 + sarake ` |
| Väri-RAM-kohde           | `$D800 + rivi×40 + sarake`     |

**Asiantuntijatilan syntaksi:**
```
.map_copy16x16 3000 dollaria, 12, 4
.map_copy16x16 3000 dollaria, 12, 4, 0400 dollaria, 3100 dollaria, 800 dollaria
```

Lyhyt muoto kopioi näyttötavut sarakkeesta `$3000`, väritavut sarakkeesta
`$3100` ja sijoittaa 16×16-lohkon sarakkeeseen 12, riville 4. Kelvolliset
vasemman yläkulman sijainnit ovat `col = 0..24` ja `row = 0..9`, joten koko
16×16-alue jää 40×25 C64 -tekstinäytölle.

**Generoitu käyttäytyminen:**

- Luo kuusitoista rivikohtaista kopiota.
- Jokainen rivi kopioi 16 näyttötavua ja 16 väritavua.
- JSR:ää ei tarvita; koodi lähetetään suoraan makron sijaintiin.
- Toimii normaalin merkkitilan ja monivärisen merkkitilan kanssa; Color RAM
  -tavut sisältävät kunkin solun merkkivärin/monivärin käyttöönottobitin.

Tyypillinen pariliitos Charset Canvasin kanssa:

```
* = 0801 dollaria
    SEI
    LDA #$00
    STA $ D021
    LDA #$05
    STA $ D022
    LDA #$0D
    STA $ D023
    .map_copy16x16 3000 $, 12, 4
silmukka:
    JMP-silmukka

.incbin "16x16+ram+color.bin", 3000 $
.incbin "16x16+charset.bin", 2000 dollaria
```

---

<a id="sprite_anim"></a>
### SPRITE_ANIM

Siirtää спрайtin animaatiokehystä eteenpäin jokaisella kutsulla ja päivittää
VIC-II спрайtin dataosoittimen. Tallenna yksi tavu kehystä kohden taulukkoon
(спрайtin datasivunumero = `data_address / 64`), osoita SPRITE_ANIM siihen ja
kutsu sitä kerran pelikehystä kohden – JSR:ää ei tarvita.

| Ala                   | Kuvaus                                                                                               |
| --------------------- | ---------------------------------------------------------------------------------------------------- |
| Sprite #              | Sprite-numero 0–7                                                                                    |
| Kehysluettelon osoite | Kehystaulukon heksaosoite — yksi tavu kehystä kohden, jokainen tavu = sprite-sivu (`data_addr / 64`) |
| Kehysten määrä        | Kehysten kokonaismäärä (1–255)                                                                       |
| Runko ZP              | Kehyslaskurina käytetty nollasivutavu (esim. `FB`)                                                   |

**Generoitu ASM (sprite 0, 4 kehystä, ZP `$FB`, lista kohdassa `$C100`):**
```
INC $FB; kehyslaskurin esikatselu LDA $FB CMP #$04; kehysten määrä BCC *+6; jos laskuri < määrä, ohita nollaus LDA #$00 STA $FB TAX; X = nykyisen kehyksen indeksi LDA $C100,X; lataa sprite-tietosivu tälle kehykselle STA $07F8; päivitä sprite 0 -osoitin ($07F8 + sprite#)
```

**Koko:** 19 tavua.

**Tyypillinen käyttö:**
```
frameTable:
.byte $21, $22, $23, $24 ; 4 kehystä kohdissa $0840, $0880, $08C0, $0900

gameloop:
WAIT_RASTER ($FF)
SPRITE_ANIM (sprite=0, list=$C100, count=4, zp=$FB)
JMP-gameloop
```

**Asiantuntijatilan syntaksi:**
```
.sprite_anim spriteNum, frameListAddr, frameCount, zpByte
; esimerkki:
.sprite_anim 0, C100, 4, FB
```

> **Vinkki:** Sijoita kehystaulukko RAWBYTES-lohkona kiinteään osoitteeseen.
> Laskurin ZP-tavu (`$FB`) on alustettava arvoon `$00` ennen ensimmäistä kutsua.
> Jos koodisi käyttää `$FB` johonkin muuhun, valitse vapaa ZP-sijainti.

---

<a id="score_bcd"></a>
### PISTEET_BCD

Lisää kiinteän pisteen arvon muistiin tallennettuun monitavuiseen
BCD-pistemäärään ja renderöi sitten jokaisen numeron näyttö-RAM-muistiin
näyttökoodimerkkinä. Käyttää 6502-desimaalitilaa (`SED`/`CLD`) turvalliseen
BCD-aritmetiikkaan – manuaalista kortin vaihtamista ei tarvita.

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

**Generoitu ASM (4 tavua, +100 pistettä, pisteet kohdassa `$C200`, näyttö
kohdassa `$0400`):**
```
SED; ota BCD/desimaalitila käyttöön
CLC
LDA $C200; tavu 0 (numerot 1–2)
ADC #$00; BCD:n 100:n alempi tavu = $00
STA $C200
LDA $C201; tavu 1 (numerot 3–4)
ADC #$01; BCD:n 100:n keskimmäinen tavu = $01 (siirto etenee)
STA $C201
LDA $C202
ADC #$00 STA $C202
LDA $C203
ADC #$00 STA $C203
CLD; takaisin binääritilaan

; renderöi numerot
LDX #$00
digit_loop:
LDA $C200,X
PHA
LSR : LSR : LSR : LSR ; korkea napostelu → matala napostelu
ORA #$30 ; + '0' näyttökoodi
STA $0406,X ; oikealle tasattu: näytön_osoite + (numerot*2 - 2) - X*2
PLA
JA #$0F ; matala napostelu
ORA #$30
STA $0407,X
INX
CPX #$04
BNE numerosilmukka
```

**Koko:** `3 + numerot × 8` tavua (SED + CLC + CLD-lisäkuorma + 8 tavua
BCD-tavua kohden ADC:lle + näyttösilmukalle).

**Asiantuntijatilan syntaksi:**
```
.score_bcd $C200, 4, 100, $0400
```

> **Vinkki:** Alusta pistetavut muotoon `$00` käynnistyksen yhteydessä.
> Pisteiden osoitteen tulisi olla nollasivu- tai absoluuttisessa RAM-muistissa –
> ei ROM-muistissa. Näyttöosoitteen tulisi osoittaa vasemmanpuoleisimpaan
> numerosoluun; numerot kirjoitetaan vasemmalta oikealle (merkittävin tavu
> ensin).

> **BCD-alue:** `numerot = 4` tavua → 8 desimaalinumeroa → enimmäispistemäärä 99
> 999 999. Jokainen tavu koodaa kaksi BCD-numeroa: `$00`–`$99`.

---

## 11. Tietopankin linkit

Pikalinkit löytyvät sovelluksesta kohdasta **Tietokannasta**:

### RetroDebugger

[RetroDebugger](https://github.com/slajerek/RetroDebugger) on eri alustoilla
toimiva Commodore 64 -virheenkorjausohjelma, jossa on tuki keskeytyskohdille,
muistin tarkastus ja tunnistetietoinen purkaminen.

**Asetukset:** osoita **Asetukset → Tiedostot ja polut → Retro Debugger**
-kohdassa `RetroDebugger` -binääritiedostoon.

**Käynnistä:** Napsauta työkalupalkissa **Debug (RetroDebugger)**. Sovellus:

1. Kokoa ohjelma tiedostoksi `.prg` väliaikaiseen hakemistoon.
2. Kirjoita **katkaisukohtatiedosto** — jokaisen katkaisukohtalohkon ja
   Expert-katkaisukohtarivin osoite.
3. Kirjoita **symbolit** VICE / RetroDebugger -otsikkomuodossa (`al C:addr
   .name`): otsikot, vakiot ja muuttujat.
4. Kirjoita C64Debugger-tyyliset sivuvaunut PRG:n viereen: `.dbg` (lähdekoodin
   määrittäminen), `.sym` ja `.vs`.
5. Käynnistä RetroDebugger alla olevilla PRG:llä, keskeytyskohdilla, symboleilla
   ja lipuilla.

### Katkaisupistelohkot

Napsauta minkä tahansa käskylohkon keskeytyskohdan kuvaketta (●) vaihtaaksesi
sen keskeytyskohdaksi. Keskeytyskohdat sisältävät lohkot on korostettu
punaisella. Niiden osoitteet kirjoitetaan keskeytyskohtatiedostoon jokaisella
virheenkorjaimen käynnistyskerralla.

### Virheenkorjausliput

Nämä löytyvät kohdasta **Asetukset → Yleiset → RetroDebugger**.

| Vaihda                 | Lippu           | Vaikutus                                                               |
| ---------------------- | --------------- | ---------------------------------------------------------------------- |
| `-hyppy` PÄÄLLÄ        | `-jump $OSOITE` | Hyppää suoraan ohjelman aloitusosoitteeseen latauksen jälkeen          |
| `-jatka taukoa` PÄÄLLÄ | `-jatka taukoa` | Poista debuggerin keskeytys välittömästi latauksen yhteydessä          |
| `-odota` PÄÄLLÄ        | `-odota <ms>`   | Odota `<ms>` millisekuntia ennen tauon jatkamista — 500 ms tai 1000 ms |

> **Vinkki:** Useimmille ohjelmille kannattaa ottaa käyttöön `-jmp` ja
> `-unpause` välitöntä automaattista käynnistystä varten. Käytä `-wait 500` tai
> `-wait 1000`, kun ohjelmasi määrittää keskeytyksiä tai SID-musiikkia, jonka
> alustusaika on ennen ensimmäistä rasteria.

### VICE Monitor (pikalataus, reaaliaikainen katselu, profilointi)

Työkalurivin **VICE Monitor** -painike avaa ei-modaalisen ikkunan, joka
kommunikoi käynnissä olevan VICE:n kanssa sen binäärimonitorin kautta. **Suorita
(VICE)** käynnistää VICE:n monitorilla portissa 6502 (**Asetukset → Tiedostot ja
polut → VICE-emulaattori → VICE-etämonitori**, oletuksena päällä). Sulje ja
käynnistä uudelleen VICE, joka käynnistettiin toisella tavalla. Otsikko näyttää
yhteyden tilan; *Saatavilla vain työpöytäsovelluksessa* näkyy selaimen
esikatselussa.

| Painike                                                         | Mitä se tekee                                                                                                                                                    |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Kuuma uudelleenlataus**                                       | Kirjoittaa kootun ohjelman käynnissä olevan VICE:n RAM-muistiin (vain varatut alueet — aukot jätetään ennalleen). Käytä sitä datalle: spritit, taulukot, teksti. |
| **Käynnistä uudelleen latauksen jälkeen + uudelleenkäynnistys** | Sama, sitten käynnistyy uudelleen SYS-osoitteesta (pinon nollaus; lopullinen `RTS` palaa arvoon `READY.`).                                                       |
| **Automaattinen uudelleenlataus muokkausten jälkeen**           | Lataa ja käynnistyy uudelleen noin sekunnin kuluttua jokaisen muokkauksen jälkeen, jos ohjelma kootaan.                                                          |
| **Live-katselu**                                                | Päivittää tarkkailulistan 0,4 sekunnin välein; muuttunut arvo vilkkuu.                                                                                           |
| **Profiili**                                                    | Näyttää ohjelmalaskuria noin 5 sekunnin ajan (napsauta uudelleen pysäyttääksesi laskurin aikaisemmin).                                                           |

**Seuraamuslista:** kirjoita otsikko tai osoite — `pistemäärä`, `$D020`, `53280`
tai tavumäärällä `taulukko, 8` — ja paina **+** tai Enter. Jokaisella rivillä
näkyy osoite, tavut heksadesimaalilukuna ja 1 tai 2 tavun tapauksessa
desimaaliarvo. Ultimate Basic -tilassa nimet tulevat viimeisimmästä
UB-koonnuksesta (muuttujat, otsikot, aliosat, taulukot).

**Profiilin tulos:** kaksi taulukkoa. *Routine* ryhmittelee näytteet lähimmän
tunnisteen mukaan (Ultimate Basicissa: `sub`), osuuden prosentteina ja
rasteririvien mukaan, joilla se suoritettiin — KERNAL- tai BASIC-ROM-muistissa
vietetty aika luetellaan erikseen. *Live* listaa kalleimmat lähderivit; napsauta
yhtä siirtyäksesi siihen. Jokainen näyte pysäyttää emulaattorin hetkeksi, joten
profiili on tilastollinen kuva, ei tarkka syklien määrä.

---

## 12. D64 Vie ja suorita

Versio 1.5.1 lisää mahdollisuuden pakata ohjelmasi (ja muut datatiedostot) C64
D64 -levykuvaan ja käynnistää sen VICE:ssä — tai viedä levykuva muualle
käytettäväksi.

| Resurssi                                                      | URL-osoite                                                     |
| ------------------------------------------------------------- | -------------------------------------------------------------- |
| 6502 Opcodes Reference                                        | http://www.6502.org/tutorials/6502opcodes.html                 |
| C64 KERNAL-funktiot                                           | https://sta.c64.org/cbm64krnfunc.html                          |
| C64-muistikartta                                              | https://sta.c64.org/cbm64mem.html                              |
| C64-värikoodit                                                | https://sta.c64.org/cbm64col.html                              |
| VIC-II-artikkeli                                              | https://www.cebix.net/VIC-Article.txt                          |
| C64-koodikanta                                                | https://codebase.c64.org/                                      |
| Turbo-kokoonpanija                                            | https://turbo.style64.org/                                     |
| RetroDebugger                                                 | https://github.com/slajerek/RetroDebugger/                     |
| C64-käyttöjärjestelmän kehitysympäristö                       | https://www.c64os.com/c64os/programmersguide/?s=devenvironment |
| png2c64-kuvamuunnin                                           | https://png2c64.app/                                           |
| Restore64-purkaja (C64 PRG → KickAssembler / ACME-lähdekoodi) | https://restore64.dev/                                         |

---

### Sisäänrakennettu C64 ja debuggeri

Sovellus sisältää täydellisen C64: VICE 3.10 (x64sc) -käyttöjärjestelmän, joka
on käännetty WebAssembly-kielelle. Se ei vaadi asennusta tai asetuksia, ja se
toimii ilman ulkoista VICE-käyttöjärjestelmää.

**Ohjelman käynnistäminen:** valitse **Built-in C64** jaetusta
**Suorita**-valikosta ja paina sitten **Suorita**. Ohjelma on koottu, kone tekee
hard resetin ja ohjelma käynnistyy: `RUN` ohjelmalle, jonka BASIC-rivi on
kohdassa `$0801`, muuten `SYS` sen latausosoitteella. Työkalurivin painike avaa
ikkunan suorittamatta mitään; sen työkalurivin ensimmäinen painike kootaan ja
suoritetaan uudelleen.

**Näppäimistö** siirtyy C64:ään, kun näyttö on fokusoituna (napsauta sitä).
**Tab** on CTRL, **Alt** on Commodore-näppäin, ja voit liittää tekstiä
Ctrl+V:llä. **Joystickin** portin ollessa valittuna nuolinäppäimet ja välilyönti
tai oikea Ctrl toimivat joystickina.

**Tiedostot-valikko**

| Tuote                            | Mitä se tekee                                                              |
| -------------------------------- | -------------------------------------------------------------------------- |
| **Lataa PRG…**                   | Käynnistää `.prg`-tiedoston automaattisesti käynnistyvällä käynnistyksellä |
| **Liitä D64…**                   | Liittää kuvan asemaan 8, nollaa asetukset, sitten `LOAD"*",8,1` ja `RUN`   |
| **Kiinnitä kasetti…**            | Liittää `.crt`-tiedoston ja nollaa asetukset                               |
| **Irrota levy / Irrota kasetti** | Poistaa kuvan; kasetin irrottaminen nollaa myös asetukset                  |

Tilarivi näyttää, mitä on liitettynä, ja aseman 8 LED-valo sekä lukupään uran.
LED-valo palaa latauksen aikana. Vilkkuva LED-valo tarkoittaa, että asema
ilmoittaa virheestä, kuten tiedostosta, jota se ei löydä tai lue: LED-valo
muuttuu punaiseksi ja tilarivillä lukee **Asemavirhe**, kunnes asema tyhjentää
sen. Liitettyjä tiedostoja ei muisteta. Oman ohjelman suorittaminen editorista
poistaa ensin liitetyn kasetin, muuten kasetti käynnistyisi sen sijaan.

**Koneen asetukset** työkalupalkissa:

| Asetus           | Arvot                       | Huomautus                                                                                      |
| ---------------- | --------------------------- | ---------------------------------------------------------------------------------------------- |
| **Video**        | PAL, NTSC                   | Pakkolunastus                                                                                  |
| **SID-siru**     | 6581, 8580                  | Voimassa heti                                                                                  |
| **SID-moottori** | reSID, FastSID              | Voimassa heti. VA SID Core ei ole saatavilla täällä: tämä kone käyttää VICE:n SID-moottoreita. |
| **REU**          | Pois päältä, 128 kt – 16 Mt | Pakkolunastus                                                                                  |
| **Ohjainsauva**  | —, Portti 1, Portti 2       |                                                                                                |

Työkalurivillä on myös **Nollaus**, **Tauko**, **Vääristys**, **Ääni**,
**CRT-suodatin** ja **Koko näyttö**. CRT-suodatin käyttää VICE:n CRT-emulointia,
pehmeää skaalausta ja skannausviivoja; skannausviivat ilmestyvät, kun C64-viiva
on vähintään 3 pikseliä korkea. Koko näyttö -tila käynnistyy myös
kaksoisnapsauttamalla näyttöä, ja Esc tai toinen kaksoisnapsautus poistuu siitä.
Ikkunaa voidaan siirtää sen otsikosta ja muuttaa sen kokoa oikeassa alakulmassa.
Sen sijainti, koko, avaustila ja asetukset palautuvat seuraavan käynnistyksen
yhteydessä.

**Virheenkorjaus:** paina **Debug** suoritustilassa **Built-in C64**.
Debug-painike käyttää tätä virheenkorjaajaa myös oikeissa laitteistotiloissa,
kun **Visual Assembler** on valittu virheenkorjaaja. Se toimii sekä VMA:n,
Kick-projektien, ACME:n että Ultimate Basicin kanssa. Ohjelma pysähtyy
ensimmäiseen saavuttamaansa keskeytyspisteeseen tai ensimmäiseen käskyyn, jos
keskeytyspisteitä ei ole. Ikkunan sulkeminen tai virheenkorjauspaneelin
piilottaminen lopettaa istunnon: keskeytyspisteet poistuvat ja pysäytetty
ohjelma jatkaa suoritusta (suljetussa ikkunassa, kun se avataan uudelleen).
Ultimate-emulaattori ja VICE-virheenkorjausikkunat tekevät saman suljettaessa.

**Virheenkorjaajan valitseminen:** **Asetukset → Yleiset → Virheenkorjaaja →
Virheenkorjauspainike** on **Visual Assembler** tai **RetroDebugger**.
**RetroDebugger** voidaan valita vasta, kun sen polku on asetettu kohdassa
**Asetukset → Tiedostot ja polut**; sitä ei koskaan valita, se on RetroDebugger,
kun sellainen on konfiguroitu, muuten Visual Assembler. **Visual Assembler**
suorittaa debuggausohjelman suoritustilan koneella: omassa VICE-ympäristössäsi
(*Suorita PRG:nä*, *Suorita D64:n kautta*), Ultimate-emulaattorissa tai
sisäänrakennetussa C64:ssä (myös oikeissa laitteistotiloissa, C64 Ultimate ja
Kung Fu Flash 2). **RetroDebugger** avaa ulkoisen ohjelman VICE- ja
laitteistotiloille. *Sisäänrakennettu C64* ja *Ultimate-emulaattori* -ajotilat
käyttävät aina omaa debuggeriaan.

**Virheenkorjaus VICE:ssä:** valittuna **Visual Assembler**, **Debug** *Run as
PRG* ja *Run via D64* -tiloissa avaa saman virheenkorjausikkunan omalle
VICE-asennuksellesi: VA käynnistää VICE:n binäärimonitorillaan
(**VICE-monitoriportti**, oletusarvo 6502) tai käyttää siellä jo käynnissä
olevaa monitoria, aktivoi keskeytyspisteet ja käynnistää ohjelman
automaattisesti, joka pysähtyy ensimmäiseen käskyynsä, jos keskeytyspisteitä ei
ole. Keskeytyspisteet, step into / over / out, rekisterit, disassemblation ja
muisti toimivat kuten sisäänrakennetussa C64:ssä, ja editori seuraa suoritinta.
Ikkunan sulkeminen antaa ohjelman jatkaa suorittamista VICE:ssä. Kun
**RetroDebugger** on valittu, VICE-tilat avaavat RetroDebuggerin kuten ennenkin.

CPU pysäyttää käskyn **ennen** keskeytyskohdassa, joten rekisterit ja muisti
näyttävät tilan juuri ennen sen suorittamista.

| Painike         | Avain             | Mitä se tekee                                        |
| --------------- | ----------------- | ---------------------------------------------------- |
| **Jatka**       | F5                | Suoritetaan seuraavaan keskeytyskohtaan              |
| **Tauko**       | F5 juoksun aikana | Pysäyttää käynnissä olevan ohjelman                  |
| **Astu sisään** | F11               | Suorittaa yhden käskyn                               |
| **Astu yli**    | F10               | Suorittaa JSR:n paluukohtaan                         |
| **Astu ulos**   | Vaihto+F11        | Suorittaa rutiinin RTS/RTI-käskyn jälkeiseen käskyyn |

Näppäimet toimivat, kun kohdistus on ikkunassa, mutta eivät C64-näytössä, koska
F5 on myös C64-näppäin siellä.

**Debugger-paneelissa** näkyy:

- **Rekisterit:** PC, A, X, Y ja SP ovat muokattavia heksadesimaalikenttiä ja
  liput ovat painikkeita. Muutokset astuvat voimaan, kun suoritin käynnistyy.
- **Purkaminen** PC:n ympäriltä ohjelmasi nimien avulla. Napsauta rivin alussa
  olevaa pistettä asettaaksesi tai poistaaksesi keskeytyskohdan.
- **Muisti:** kirjoita osoite muodossa `$hex`, desimaaliluku tai tunniste.
  Lukemisella ei ole sivuvaikutuksia, joten `$DC0D`:n katsominen ei kuittaa
  keskeytystä.
- **Keskeytyskohdat:** kunkin pisteen osoite ja `tiedosto:rivi`.

Keskeytyspisteet tulevat editorin rivivälilehdestä (jokaisesta koonnin avoimesta
välilehdestä), lohkotilan keskeytyspisteistä ja purkamisesta. Editorissa tehty
muutos lasketaan seuraavassa Jatka- tai Jatka-vaiheessa. Kun suoritin pysähtyy,
editori avaa tiedoston ja merkitsee rivin; lohkotilassa lohko valitaan.

**VICE Monitor** -ikkuna toimii edelleen vain ulkoisen VICE-laitteen kanssa; se
ei muodosta yhteyttä tähän koneeseen.

## 12b. CRT-vienti (Magic Desk 64K -kasetti)

Voit pakata ohjelmasi (ja muut datatiedostot) C64 D64 -levykuvaan ja käynnistää
sen VICE:ssä — tai viedä levykuvan käytettäväksi muualla.

### Mitä ostoskorissa lähetetään

Työkalurivin **Suorita**-painike on **jaettu painike**:

| Osa                        | Toiminta                        |
| -------------------------- | ------------------------------- |
| **▶ Suorita** (pääohjelma) | Suorittaa valitun suoritustilan |
| **▾** (nuoli)              | Avaa tilanvalitsimen            |

**Käytettävissä olevat ajotilat:**

| Tila                      | Kuvaus                                                                                                                                                                                                                        |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Suorita PRG:nä**        | Kokoa väliaikaiseksi `.prg`-tiedostoksi ja käynnistä VICE suoraan. Klassinen toimintatapa.                                                                                                                                    |
| **Suorita D64:n kautta**  | Kokoa, luo `.d64`-levykuva (käyttäen c1541-tiedostoa), lisää kaikki määritetyt tiedostot ja käynnistä sitten VICE levyltä. Käytä tätä aina, kun ohjelmasi lataa tiedostoja suorituksen aikana (esim. LOADFILE-makron avulla). |
| **Suorita laitteistolla** | Kokoa PRG:ksi ja lähetä se **1541 Ultimate / Ultimate 64** -laitteeseen lähiverkon kautta. Katso [Osa 13](#13-settings).                                                                                                      |
| **D64 laitteistossa**     | Rakenna `.d64` (kuten Run via D64) ja lähetä se **1541 Ultimate / Ultimate 64** -palvelimelle, joka asentaa ja suorittaa sen.                                                                                                 |
| Kung Fu Flash 2           | Kokoa se PRG:ksi ja lataa se USB-sarjaliitännän kautta oikeaan C64/C128-tietokoneeseen, jossa on **Kung Fu Flash 2** -äänikortti. Katso [Kung Fu Flash 2](#kung-fu-flash-2).                                                  |

Valikossa luetellaan vain ne tilat, joiden työkalu on asetettu: VICE kahdelle
ensimmäiselle, laiteosoite kohdassa **Asetukset → Integraatiot** C64
Ultimatelle, portti (käynnistyksen yhteydessä havaittu tai siellä asetettu) Kung
Fu Flash 2:lle, ohjelma, laiteohjelmisto ja ROM-kansio Ultimate-emulaattorille.
Sisäänrakennettu **C64** on aina paikalla.

Valittu tila tallennetaan istuntojen välillä. Jos sen työkalu puuttuu, Run
käyttää VICE:tä tai sisäänrakennettua C64:ää, ja tallennettu tila palautuu, kun
työkalu on asetettu.

### Kuormausosoite ja saapumispiste

Avaa se valitsemalla **Valikko → Rakenna → Rakenna D64** (Suorita D64:n kautta
ja avaa sen myös). Valintaikkuna antaa sinun:

1. **Lohko-/asiantuntijatila, jossa on BASIC SYS -tynkä:** load = `$0801`,
   merkintä = SYS-kohde (yleensä `$080D` tai käyttäjän alkuperä).
2. **Lohko-/asiantuntijatila, jossa BASIC SYS -tynkä on pois päältä:** lataus =
   käyttäjän alkuperä (klassisella `$0801 → $C000` varamenetelmällä), merkintä =
   latausosoite.
   - **Nimi** — miten se näkyy D64-hakemistossa (enintään 16 merkkiä,
     automaattisesti isot kirjaimet).
   - **Addr** (latausosoite, valinnainen) — jos annettu, alkuun lisätään
     2-tavuinen PRG-otsikko. Jätä tyhjäksi kirjoittaaksesi raakatavuja ilman
     otsikkoa.
   - **Dst** (purkukohde, vain EXO:n kanssa) — mihin purkuohjelman tulisi
     siirtää data C64:lle. Kun EXO on käytössä, lisätiedosto pakataan komennolla
     `exomizer mem -l <Osoite> file@<Dst>` (raakatiedosto Dst-osoitteessa) ennen
     sen kirjoittamista D64:lle.
   - **EXO** — valintaruutu, joka ottaa käyttöön taaksepäin tapahtuvan
     `mem`-tilan murskaamisen tälle merkinnälle. Levyllä olevan tiedon koko on
     tyypillisesti 5–20 % alkuperäisestä.
3. **UltimateBasic-tila:** sekä lataus että syöttö tulevat UB-kääntäjän kartasta
   (`build.map.loadAddress`). UB:n automaattisen käynnistyksen tynkä
   hyötykuorman sisällä suoritetaan sitten täsmälleen samalla tavalla kuin se
   suoritettaisiin levyltä komennon `LOAD "...",8,1 : RUN` jälkeen.

ASM-tulosteessa näkyvä lähtöosoite säilyy; lataaja yksinkertaisesti kopioi
tasaisen muistikuvan PRG:stä RAM-muistiin ja hyppää aloituspisteeseen, kun korin
ROM-muistin kartoitus on poistettu.

### Kokorajoitus

Koska hyötykuorma tallennetaan lineaarisesti ja `assembleProgramToPrg()`
palauttaa tasaisen `minAddr..maxAddr` puskurin, jossa on nollatäytteisiä
aukkoja, ohjelma, jossa on laajasti toisistaan etäisyydellä olevia
ORG-segmenttejä (esim. `$0801` + `$C000` + `$E000`), laskee jokaisen tavun kohti
65 408 tavun budjettia. Jos raja ylitetään, koonti keskeytyy virheellä
`saveCrtTooLarge` – joko pakkaa muistin asettelu tai jaa tiedot.

**loadfile-demo**-esimerkkitiedosto on esikonfiguroitu ja sisältää lisätiedoston
`DEMO-COLORS.PRG`. Valitse se, avaa **Run via D64** ja napsauta **Run**
nähdäksesi koko latausprosessin toiminnassa.

> **Vaatimus:** Sekä D64-vienti että suoritus D64:n kautta edellyttävät VICE:n
> (`c1541`) määrittämistä kohdassa [Asetukset → Tiedostot ja
> polut](#13-settings).

### Yhteensopivuus

Taulukkogeneraattorin jälkeinen työkalupalkin kuvake avaa **D64-editorin** –
itsenäisen työkalun olemassa olevan `.d64`-kuvan käsittelyyn suoraan,
riippumatta avoimesta ohjelmasta. Toisin kuin yllä oleva Vie D64:ään
-valintaikkuna (joka aina luo *uuden*-levyn käännetystä PRG:stä), D64-editori
muokkaa levykuvaa paikallaan `c1541`-tiedoston kautta, joten se toimii myös
kevyenä levynhallintaohjelmana.

**Tiedostot ▾ -valikko:**

| Tuote                     | Toiminta                                               |
| ------------------------- | ------------------------------------------------------ |
| VARAPELI (`x64sc`, `x64`) | Toimii valitsemalla **Tiedosto → Liitä kasetin kuva**. |
| TheC64 / TheC64 Mini      | Toimii sisäänrakennetun kasettilataajan kautta.        |
| Kung Fu Flash             | Toimii — natiivi Magic Desk -tila.                     |
| EasyFlash-kasetti         | Toimii, kun se on ohjelmoitu Magic Desk -työpöydäksi.  |

**Työkalurivi:**

| Kuvake                      | Toiminta                                                                                                                                                        |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Lisää ohjelma**           | Valitse paikallinen tiedosto ja kirjoita se levyhakemistoon.                                                                                                    |
| **Pura valittu**            | Tallenna valitun merkinnän tavut paikalliseen `.prg`-tiedostoon.                                                                                                |
| **Nimeä valittu uudelleen** | Muokkaa merkinnän nimeä taulukon rivillä — Enter vahvistaa, Esc peruu.                                                                                          |
| **Poista valitut**          | Poista valittu merkintä levyltä.                                                                                                                                |
| **Päivitä**                 | Lue hakemisto uudelleen, esimerkiksi sen jälkeen, kun olet muokannut levyä toisella työkalulla.                                                                 |
| **Tallenna**                | Kirjoita työkopion muutokset takaisin varsinaiseen `.d64`-tiedostoon ja tee ensin automaattinen varmuuskopio. Käytössä vain, jos on tallentamattomia muutoksia. |

**Ohjelman lisääminen:** Tiedoston valitseminen, joka päättyy jo `.prg`, pyytää
vain **Nimen** ja levyn **Tyypin** (PRG/SEQ/USR/REL) – `.prg` sisältää jo oman
latausosoiteotsikkonsa, joten se kirjoitetaan muuttumattomana. Minkä tahansa
muun tiedoston (esim. raaka `.bin`) valitseminen näyttää lisäksi:

- **Lataa osoite** (heksadesimaali, valinnainen) — lisää tähän osoitteeseen
  2-tavuisen PRG-otsikon; jätä tyhjäksi kirjoittaaksesi tavut raakana.
- **Pura osoite** (heksadesimaali, valinnainen) — käytetään vain yhdessä
  Exomizerin kanssa; kohdeosoite, johon purkajan tulisi purkaa tiedot.
- **Exomizer** -valintaruutu — pakkaa tiedoston ennen kirjoittamista käyttäen
  samoja `mem`/`sfx` -tiivistystiloja kuin yllä olevan Vie D64:ään
  -valintaikkunan lisätiedostoille.

Hakemistoluettelo näyttää tiedostonimet samalla fontilla ja isoilla kirjaimilla
kuin oikea C64 `LOAD"$",8` -luettelo.

**Tallennustyönkulku:** jokainen muokkaus – lisäys, purkaminen, nimeäminen
uudelleen, poistaminen ja lohkoeditorin tavumuokkaukset – kohdistuu levykuvan
yksityiseen työkopioon, ei varsinaiseen tiedostoosi. Työkalurivin
**Tallenna**-painike (käytössä, kun tallentamattomia muutoksia on) kirjoittaa
työkopion takaisin varsinaisen `.d64`-tiedoston päälle ja tekee ensin
automaattisen varmuuskopion. Ylätunnisteessa näkyy **•**-merkki, kun muutoksia
ei ole tallennettu, ja editorin sulkeminen tai toisen levyn avaaminen
tallentamattomilla muutoksilla pyytää vahvistusta muutosten hylkäämisen sijaan.
**Tallenna nimellä…** (Tiedostot ▾ -valikko) kirjoittaa työkopion uuteen polkuun
ja jatkaa muokkaamista siellä.

**Lohkoeditori:** työkalupalkin ruudukkokuvake vaihtaa hakemiston alapuolella
olevaan raakaraita-/sektorinäkymään — napsautettava lohkokartta, joka on
väritetty BAM:n vapaalla/käytetyllä bittikartalla (BAM ja hakemistoketju
merkitty erikseen), tavukohtainen heksadekooderiruudukko valitulle
256-tavuiselle lohkolle ja Edellinen/Seuraava sektorinavigointi. Lohkojen
muokkaaminen tapahtuu saman työkopiointi-/tallennustyönkulun kautta kuin yllä
olevat hakemistotoiminnot.

> **Vaatimus:** Kuten Vienti D64:ään -komennossa, D64-editori vaatii
> VICE-komennon (`c1541`), joka on määritetty kohdassa [Asetukset → Tiedostot ja
> polut](#13-settings).

---

## 13. Laitteistoasetukset

**Valikko → Rakenna → Rakenna CRT** tuottaa Commodore 64 -kasetin kuvan (`.crt`,
**kasettityyppi 19 — Magic Desk / Domark / HES Australia**), joka toimii VICE-,
TheC64- ja oikealla laitteistolla EasyFlash / Kung Fu Flashin kautta sekä 1541
Ultimate II+ -kasettipaikalla. Se on saatavilla **lohkotilassa**,
**asiantuntijatilassa** ja **ultimateBasic-tilassa**.

### VICE-emulaattori

- **8 × 8 kt pankkia** hintaan `$8000`, pankkien välinen vaihto `$DE00`:n kautta
  (Magic Desk -käytäntö: 3 alinta bittiä = pankki, bitti 7 = ostoskorin
  poistaminen käytöstä).
- **Bank 0** sisältää 128-tavuisen otsikon ja käynnistyslataimen:
  - `$8000/$8002` kylmä- ja lämminkäynnistysvektorit osoittavat pisteeseen
    `$8009`.
  - `$8004–$8008` = KERNAL-nollauskoodin vaatima `CBM80`-allekirjoitus.
  - `$8009–$807F` = lataaja: SEI / stack init / `JSR $FDA3` (IOINIT) / `JSR
    $FD50` (RAMTAS) / `JSR $FD15` (RESTOR) / `JSR $FF5B` (CINT), sitten se
    kopioi 60-tavuisen **kopiointirutiinin** (`$8044–$807F`) kansioon `$0100` ja
    hyppää sinne. RAM-muistista suoritettava rutiini lähettää hyötykuorman
    kärryn ROM-muistista latausosoitteeseensa, vaihtaa pankkeja
    `$DE00`-osoitteen kautta, kun `$FC` saavuttaa `$A0`-osoitteen, poistaa
    kärryn käytöstä `LDA #$80 : STA $DE00`-komennolla ja `JMP`-komennolla
    aloituspisteeseen. (Sen on suoritettava RAM-muistista: pankin vaihto korvaa
    ROM-muistin kohdassa `$8000`, lataajan oma koodi mukaan lukien.)
- **Hyötykuorma** alkaa pankissa 0 kohdasta `$8080` ja jakautuu tarvittaessa
  pankkeihin 1–7. Suurin hyötykuorma = `8 * 8192 − 128 = 65 408 tavua`.

### Exomizer

**Työnkulku:**

- Asenna Exomizer-binääritiedosto:
- Määritä polku kohdassa **Laitteistoasetukset → Exomizer-osio**.
- Ota käyttöön **Suorita Exomizerilla** -valintaruutu **-asetuksissa**.

Exomizer toimii samalla tavalla Windowsissa ja macOS:ssä — komentorivi (CLI)
kutsutaan Tauri-taustajärjestelmästä; mikään integraatiossa ei ole
alustakohtaista.

### Retro-virheenkorjaaja

Koska hyötykuorma tallennetaan lineaarisesti – yksi tasainen kuva pienimmästä
suurimpaan osoitteeseen, jossa on nollat täytettyjä aukkoja – ohjelma, jossa on
laaja-alaisesti toisistaan etäisyydellä olevia ORG-segmenttejä (esim. `$0801` +
`$C000` + `$E000`), laskee jokaisen tavun niiden välillä kohti 65 408 tavun
budjettia. Jos raja ylitetään, koonti keskeytyy virheeseen – joko pakkaa
muistiasettelu tai jaa tiedot.

> **⚠️ Huomattava varoitus – lue tämä ennen kuvaputkinäytön lähettämistä.**
> 
> Lataaja kutsuu KERNAL **`RESTOR` ($FD15)** -komentoa osana
> vakionollaussekvenssiä. Tämä kirjoittaa tarkoituksella uudelleen
> vakio-I/O-vektorit kohdissa `$0314/$0315`, `$0316/$0317`, `$0318/$0319`,
> `$0328/$0329` ja sen osioissa takaisin ROM-oletusasetuksiin. Seuraukset:
> 
> - **Kaikki IRQ / NMI / BRK -koukut, jotka on asetettu ennen CRT-käynnistysten
>   pyyhkimistä, on asennettu.** Ohjelmasi on asennettava ne itse
>   sisäänkirjautumisen jälkeen — aivan kuten uusi `LOAD "",8,1 : RUN`
>   nauhalta/levyltä.
> - **UltimateBasic-ohjelmat**, jotka ovat riippuvaisia siitä, että
>   KERNAL-vektorit ovat aktiivisia käynnistyshetkellä, saattavat tarvita
>   eksplisiittisen `SYS`- tai init-kutsun automaattisen käynnistyksen tyngässä.
>   UB:n vakioautomaattinen käynnistys toimii suoraan pakkauksesta;
>   laajennuskirjastot, jotka kytkevät vektorit *ennen* `RUN`:ää, eivät
>   tarvitse.
> - **CIA1 / CIA2** alustetaan uudelleen komennolla `IOINIT`. Mukautetut
>   ajastinasetukset (rasteri-IRQ:t, musiikkisoitin CIA-A) on ohjelmoitava
>   uudelleen syötön jälkeen.
> - Kopiointirutiini suoritetaan **RAM-muistista kohdissa `$0100–$013B`**, joten
>   pankin kytkimet ja lopullinen `STA $DE00` eivät koskaan vedä koodia
>   suorittimen alta. Älä luota `$0100–$013B` -alkuisiin alkuihin ja pidä
>   hyötykuorma poissa tästä alueesta ja lataajan käyttämien nollasivutavujen
>   `$02–$04` / `$FB–$FE` ulkopuolella.
> 
> Jos CRT toimii VICE-ympäristössä, mutta epäonnistuu oikealla laitteistolla, on
> ensin tarkistettava, olettaako ohjelma tietyn KERNAL-vektorin vai
> CIA-ajastimen tilan käynnistyksen yhteydessä. Asenna tila eksplisiittisesti
> init-rutiiniisi, niin se toimii samalla tavalla molemmilla.

### C64 Lopullinen / 1541 Lopullinen

| Alusta                          | Kuvaus                                                                        |
| ------------------------------- | ----------------------------------------------------------------------------- |
| **Isäntä (IP-osoite)**          | Laitteen IP-osoite (esim. `192.168.1.100`)                                    |
| **Salasana**                    | Valinnainen – jos laite vaatii todennuksen                                    |
| **Testiyhteys**                 | Lähettää testipyynnön osoitteeseen `/v3/runners/info`; näyttää OK tai virheen |
| EasyFlash-kasetti               | Toimii, kun se on ohjelmoitu Magic Desk -työpöydäksi.                         |
| 1541 Ultimate II+ / Ultimate 64 | Toimii **Cartridge → Lataa kasettikuva** kautta.                              |
| Kameleontti / Turbo-kameleontti | Toimii.                                                                       |

---

## 13. Asetukset

Avaa valitsemalla **Valikko → Asetukset…** (aiemmin *Laitteistoasetukset*).
Valintaikkunassa on kolme välilehteä: **Yleiset** (assembler-tila, VMA-kääntäjä,
BASIC SYS -tynkä, Suorita Exomizerilla, ASM-lähtö, SID-esikatselu,
virheenkorjausohjelman valinta ja C64-virheenkorjausohjelman parametrit,
tilannevedokset / versionhallinta), **Tiedosto- ja polut** (VICE, RetroDebugger,
päivityspalvelin, ACME, Exomizer, git) ja **Integraatiot** (C64 Ultimate,
Ultimate-emulaattori, Kung Fu Flash 2). Alla olevat osiot kuvaavat ulkoisia
työkaluja ja laitteita.

### VMA-kääntäjä

**Asetukset → Yleiset → Ohjelma → VMA-kääntäjä** valitsee moottorin, joka
kääntää VMA- (ja Kick-projektin) lähdekoodit:

- **JavaScript** — sisäänrakennettu kääntäjä, oletusarvoinen.
- **Rust** — avoimen lähdekoodin
  [VMA-kääntäjä](https://github.com/zstarczali/VMA) sovelluksen sisällä. Se
  tarjoaa samat tavut, muistinäkymän, segmentit ja virheilmoitukset kuin
  JavaScript-kääntäjä.
- **Rust + JavaScript-tarkistus** — muodostaa JavaScriptin ja Rustin avulla,
  käyttää JavaScript-tulosta ja kirjaa mahdolliset erot (tavut, muistinäkymä,
  virheet) virhelokiin, jonka vikailmoitus lähettää mukana.

Kääntämisikkuna nimeää käytössä olevan moottorin. VMA-versio näkyy
Tietoja-ruudussa.

Sama kääntäjä toimii komentorivillä (VMA 2.1.0): `vma build game.asm` kirjoittaa
`game.prg`, `--crt game.crt` Magic Desk -kasetin (samat tavut kuin **Build
CRT**), ja `--d64` 1541-levykuvan ohjelmalla (`--add` lisää siihen lisää
tiedostoja) — c1541-tiedostoa ei tarvita. Katso käyttöohje
[VMA-repositoriossa](https://github.com/zstarczali/VMA).

### Korkean resoluution / monivärinen editori

| Asetus               | Kuvaus                                                                                                                               |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Tilan vaihto         | **Monivärinen** -valintaruutu vaihtaa korkearesoluutioisen (yksivärinen solua kohden) ja monivärisen (4 väriä solua kohden) välillä. |
| **Tila**             | Näyttää, onko suoritettava tiedostopolku kelvollinen ja käytettävissä                                                                |
| **VICE-etämonitori** | Käynnistää VICE:n binäärimonitorilla portissa 6502, jota [VICE Monitor](#vice-monitor-hot-reload-live-watch-profiler) tarvitsee.     |

Pikselitason bittikarttaeditori, jossa on sekä 320×200 korkearesoluutio- että
160×200 moniväritilat. Avaa Toolkit → Korkearesoluutioeditori -kohdassa.

### Sprite-editori

| Asetus   | Kuvaus                                                                |
| -------- | --------------------------------------------------------------------- |
| Kehykset | Lisää/poista/järjestä uudelleen kehyksiä; kehysnauha näkyy alhaalla.  |
| Tila     | Yksivärinen/monivärinen vaihto.                                       |
| **Tila** | Näyttää, onko suoritettava tiedostopolku kelvollinen ja käytettävissä |

**Työnkulku:**
1. Asenna Exomizer-binääritiedosto:
   - **Windows:** lataa valmiiksi koottu `win32/exomizer.exe` osoitteesta
     https://bitbucket.org/magli143/exomizer/wiki/Home tai
     https://csdb.dk/release/?id=244342.
   - **macOS:** `brew install exomizer` (asentaa Magnus Lindin virallisen
     3.1.2-koontiversion).
2. Määritä polku kohdassa **Asetukset → Tiedostot ja polut → Exomizer**.
3. Ota käyttöön **Suorita Exomizerilla** -valintaruutu kohdassa **Asetukset →
   Yleiset → Ohjelma**.
4. Kaikki **Run**-toiminnot (PRG, D64, hardware) ja **Build**-toiminnot (Build
   PRG, Build D64) käsittelevät nyt kootun ohjelman `exomizer sfx` -komennon
   avulla ennen käynnistämistä tai tallentamista: `sfx basic`, kun PRG alkaa
   BASIC-rivillä (purun jälkeen RUN käynnistää alkuperäisen `SYS`-rivin, joten
   toinenkin RUN toimii), muussa tapauksessa `sfx $<latausosoite>`.

Exomizer toimii samalla tavalla Windowsissa ja macOS:ssä — komentorivi (CLI)
kutsutaan Tauri-taustajärjestelmästä; mikään integraatiossa ei ole
alustakohtaista.

** Sisäisesti käytetään kahta pakkaustilaa:**

| Tila                          | Käyttämä                                                       | Soittokäytäntö                                                                                                                                                                                                     |
| ----------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `sfx perus` / `sfx $<osoite>` | Rakenna/Suorita Exomizerilla -vaihtokytkin (PRG:n pääpolku)    | Itsepurkautuva PRG sisäänrakennetulla purkajalla; Border-flash-asetus ohjaa `-x1` vs. `-n`                                                                                                                         |
| `mem` (taaksepäin)            | Suorita D64:n kautta → tiedostokohtainen **EXO** -valintaruutu | Pakkaa jokaisen ylimääräisen tiedoston `mem`-muotoiseen virraan; ohjelma purkaa sen suorituksen aikana **EXODECRUNCH**-makron ja valmiiksi rakennetun pakkauksenpurkuohjelman (`samples/exo-decrunch.bin`) avulla. |

> **Vinkki:** Jos Exomizer-polkua ei ole määritetty, mutta valintaruutu on
> käytössä, käynnistyksen sijaan näytetään selkeä virheilmoitus. Poista
> valintaruutu käytöstä, jos haluat suorittaa ohjelman ilman pakkausta.


### C64-merkki-ROM-selain ("merkkikartta")

| Asetus          | Kuvaus                                                                                                                                                                                                                                                               |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kaksi merkistöä | Välilehti 1: **Sarja 1 — Ylä/Grafiikka** (oletustila käynnistyksen jälkeen). Välilehti 2: **Sarja 2 — Ala/Ylä** (`$0E`-kytkimen jälkeen).                                                                                                                            |
| **Tila**        | 16×16-ruudukko, jossa on kaikki 256 merkkiä. Napsauta symbolia nähdäksesi sen yksityiskohtapaneelin: suurennettu 8×8 pikselin näkymä, näyttökoodi (desimaali + heksadesimaali), PETSCII-koodit (sekä oletusarvoiset että siirretyt) ja raaka 8-tavuinen bittikartta. |

Katso täydellinen debuggerin dokumentaatio kohdasta [Osio
10](#10-debugger-integration).

### Merkkieditori (merkistö)

256-merkkinen 8×8 merkistöeditori. Avaa Toolkit → Merkkieditori -kohdassa.

| Asetus       | Kuvaus                                                                                |
| ------------ | ------------------------------------------------------------------------------------- |
| Lataa ROM    | Tuo C64 ROM -merkistöä suoraan VICE:n `chargen` -tiedostosta (ei tiedostovalitsinta). |
| Lataa `.bin` | Tuo ulkoisen 2048-tavuisen merkistöbinääritiedoston.                                  |

**Työnkulku:**
1. Yhdistä 1541 Ultimate / Ultimate 64 lähiverkkoosi.
2. Syötä sen IP-osoite (ja salasana, jos asetettu) kohdassa **Asetukset →
   Integraatiot → C64 Ultimate**.
3. Valitse jaetun suorituksen valikosta **Suorita laitteistolla**.
4. Napsauta **▶ Suorita** — PRG käännetään ja lähetetään laitteelle HTTP POST
   -komennon kautta osoitteeseen `/v1/runners:run_prg`. Laite latautuu ja
   suorittaa sen C64:llä välittömästi.

**Ilman laitteistoa:** valitse jaetun suorituksen valikosta **Ultimate
emulator** suorittaaksesi sen
[UE2-C64U-Emulator](https://github.com/Jondalar/UE2-C64U-Emulator):llä, joka
suorittaa muokkaamattoman Ultimate-laiteohjelmiston tietokoneellasi. Asenna se
erikseen (katso [Ultimate-emulaattorin asentaminen,
vaiheittainen](#installing-the-ultimate-emulator-step-by-step)) ja aseta sitten
kolme asiaa kohdassa **Asetukset → Integraatiot → Ultimate emulator (UE2)**:
`ue2emu`-ohjelma, laiteohjelmisto (`.ue2`, `.elf` tai `.app`, ei sisälly
toimitukseen) ja ROM-kansio (`roms/`
[1541ultimate](https://github.com/GideonZ/1541ultimate) -kassalla). Kyseisestä
kansiosta tarvitaan vain `chars.bin` (2048 tavua, valikon fontti); Commodoren
laiteohjelmisto käynnistyy omilta C64 ROM -muisteiltaan. Ensimmäisellä
käynnistyskerralla asennetaan `.ue2` flash-kuvaan, jota laiteohjelmisto
säilyttää sovelluksen asetuskansiossa, ja jokainen käynnistys käynnistää
laiteohjelmiston web-palvelun, joka Commodoren laiteohjelmistossa on poistettu
käytöstä. Emulaattori käynnistyy ensimmäisellä käynnistyskerralla ja pysyy auki
seuraavia käynnistyksiä varten; sen REST API kuuntelee `127.0.0.1` -porttia
**REST-portissa** (oletusarvo 8064). Se sulkeutuu sovelluksen käynnistyessä tai
komennolla **Stop emulator**. **D64 Ultimate emulatorissa** samassa valikossa
pakkaa D64:n (tämä tarvitsee VICE:n `c1541`), asentaa sen asemalle A ja
suorittaa ensimmäisen ohjelman. Kun toinen näistä kahdesta suoritustilasta on
valittuna, **VICE Monitor** -ikkuna (hot reload, live watch, profiler) muodostaa
yhteyden emulaattoriin VICE:n sijaan. **Debug** avaa näissä suoritustiloissa
emulaattorin debuggerin: rekisterit, purku, muisti ja keskeytyspisteet omassa
ikkunassaan, kuva emulaattorin ikkunassa. Ohjelma pysähtyy ensimmäiseen
saavuttamaansa keskeytyspisteeseen tai ensimmäiseen käskyynsä, jos sellaista ei
ole; editoririvi seuraa CPU:ta, ja F5, F10, F11 ja Shift+F11 toimivat myös
editorin kohdistuksen ollessa aktiivinen. Ajastimen IRQ voi ottaa askeleen
KERNAL-piiriin, kuten VICE:n monitorissa, kun keskeytykset ovat päällä. VA
asettaa myös **Turbo Control** -asetuksen emulaattorin flash-muistin
turborekistereihin, joten ohjelma voi muuttaa suorittimen nopeutta `$D031`
-asetuksen kautta (se lukee `$00`, 1 MHz, nollauksen jälkeen).

Näyte: **Ultimate turbo demo (64 sprittiä)** (`samples/ultimate-turbo-demo.asm`)
— nopeus muuttuu 3 sekunnin välein 1:stä 64 MHz:iin; 1 MHz:n taajuudella palloja
katoaa ja ruudunpäivitysnopeus laskee, 4 MHz:stä alkaen kaikki 64 sprittiä
toimivat 50 fps:n nopeudella. Se toimii vain Ultimatella, jossa turbo on päällä;
muualla se ilmoittaa niin. **Ultimate turbo cube**
(`samples/ultimate-box-demo.asm`) tekee saman laatikkonäytteen kuutiolle: mitä
nopeampi CPU, sitä nopeammin kuutio pyörii (5 kuvaa sekunnissa 1 MHz:llä, 50
alkaen 16 MHz:llä).

> **Vinkki:** USB-kaapelia tai ajuria ei tarvita – REST API on sisäänrakennettu
> Ultimate-laiteohjelmistoon. Tietokoneesi ja laitteen on oltava samassa
> lähiverkossa.

### Ultimate-emulaattorin asentaminen vaihe vaiheelta

**Ultimate-emulaattorin** ja **D64:n käyttö Ultimate-emulaattorissa**
tarvitsevat kolme asiaa, joita ei tule Visual Assemblerin mukana: itse
emulaattorin, Ultimate-laiteohjelmiston ja ROM-kansion. Asenna ne kerran
seuraavasti.

**1. Asenna emulaattori**
([UE2-C64U-Emulator](https://github.com/Jondalar/UE2-C64U-Emulator)):

- **Windows:** lataa `ue2emu-<versio>-windows-x86_64.zip` emulaattorin
  [Julkaisut-sivulta](https://github.com/Jondalar/UE2-C64U-Emulator/releases) ja
  pura se omaan kansioon, esimerkiksi `C:\Tools\ue2emu`. Pidä tiedostot yhdessä:
  `ue2emu.exe` tarvitsee viereensä DLL-tiedostot.
- **macOS:** asenna se Homebrew'lla. Visual Assembler löytää sen sieltä
  itsekseen:

  ```
  brew asentaa jondalar/ue2emu/ue2emu
  ```

- **Linux:** valmista pakettia ei ole vielä olemassa; käännä se lähdekoodista
  emulaattorin dokumentaation ohjeiden mukaisesti (tarvitaan Rust ja libslirp).

**2. Hanki laiteohjelmisto.** Emulaattori käyttää muokkaamatonta **C64
Ultimate**- tai **Ultimate 64 Elite II** -laitteen laiteohjelmistoa: laitteeseen
asentamasi päivitystiedosto (`.ue2`) tai itse rakentamasi ` ultimate.elf`
-tiedosto. Visual Assembler tai emulaattori eivät sisällä sellaista. C64
Ultimate -laiteohjelmiston version 1.1.0 tiedetään toimivan.

**3. Hae ROM-kansio.** Lataa
[1541ultimate](https://github.com/GideonZ/1541ultimate)-arkisto GitHubista
(**Code → Download ZIP** tai `git clone`) ja pura se. Tarvitset sen
`roms`-kansion. Visual Assembler tarkistaa vain `chars.bin`-tiedoston siitä
(2048 tavua, valikon fontti).

**4. Täytä asetukset.** Avaa **Asetukset → Integraatiot → Ultimate emulator
(UE2)**:

| Painike                     | Valita                                                                                                                                            |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Valitse ue2emu**          | `ue2emu.exe` vaiheesta 1. Kun emulaattori on `PATH`-polulla tai asennettu Homebrew-ohjelmalla, kenttä on jo täytetty.                             |
| **Valitse laiteohjelmisto** | Vaiheen 2 `.ue2` (tai `.elf`).                                                                                                                    |
| **Valitse ROM-kansio**      | Itse `roms`-kansio, ei sen yläpuolella oleva arkistokansio.                                                                                       |
| **REST-portti**             | Jätä se portiksi **8064**, ellei kyseinen portti ole jo varattu. Emulaattori käyttää myös kahta seuraavaa porttia (ohjaus- ja VICE-näyttöportti). |

**5. Suorita.** Valitse jaetun suorituksen valikosta **Ultimate emulator** (se
tulee näkyviin, kun asetukset ovat valmiit) ja paina **▶ Suorita**. Ensimmäinen
suoritus tiedostolla `.ue2` asentaa laiteohjelmiston omaan flash-levykuvaan,
mikä kestää hieman kauemmin; sitten emulaattorin ikkuna avautuu ja ohjelma
käynnistyy. Asetusten alla olevalla tilarivillä näkyy **Running, REST:
127.0.0.1:8064**.

**6. Jatka työskentelyä.** Myöhemmät suoritukset käyttävät avoinna olevaa
emulaattoria uudelleen. Asetuksissa komennon **Stop emulator** sulkeminen sulkee
sen, samoin kuin Visual Assemblerin sulkeminen; flash-kuva tallennetaan matkan
varrella, joten laiteohjelmiston omat asetukset säilyvät.

**Jos jokin menee pieleen:**

| Viesti                                                        | Mitä tehdä                                                                                                                                                        |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| *Ultimate-emulaattori: ei asetettu asetuksissa: …*            | Vaihe 4: viestissä nimetty kohde on tyhjä tai tiedostoa ei enää ole.                                                                                              |
| * Ultimate-emulaattori: puuttuu ROM-kansiosta: chars.bin*     | Valitsit arkistokansion tai sen yläpuolella olevan pakkaamattoman zip-kansion: valitse itse `roms`-kansio.                                                        |
| * Ultimate-emulaattorin REST-rajapinta ei vastannut ajoissa.* | Toinen ohjelma käyttää porttia: aseta eri **REST-portti **.                                                                                                       |
| **D64 Ultimate-emulaattorissa** ei voi rakentaa levykuvaa     | Tuossa tilassa D64:ssä on VICE:n `c1541`: aseta VICE-polku kohdassa **Asetukset → Tiedostot ja polut**. **Ultimate emulator** -tila itsessään ei tarvitse VICE:a. |

### Merkistöpohjan editori

Koko kankaan kattava merkistöpiirtäjä näyttöjen rakentamiseen täydellisestä 256
merkin merkistöstä. Avaa Toolkit → Charset Canvas -kohdasta.

Kangas on 16 × 16 merkkiä. Yksivärisessä tilassa se tarjoaa 128 × 128 pikselin
työalueen; monivärisessä merkkitilassa se tarjoaa 64 × 128 pikselin laajan
työalueen C64:n oikeiden merkkien monivärisääntöjen mukaisesti.
- Commodore 64 / C128, johon on asennettu ja kytketty **Kung Fu Flash 2**
  -patruuna;
- **Kung Fu Flash -laiteohjelmisto v2.07 tai uudempi** kasetissa — aiemmat
  laiteohjelmistoversiot eivät tue Visual Assemblerin käyttämää
  lähetysprotokollaa. Laiteohjelmistojulkaisut:
  <https://codeberg.org/KimJorgensen/KungFuFlash2/releases/>;
- **USB-kaapeli**, joka yhdistää äänikasetin Visual Assembleria suorittavaan
  tietokoneeseen (se näkyy virtuaalisena sarjaporttina).

| Asetus                    | Kuvaus                                                                                                                                                                           |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Yksivärinen / monivärinen | Mono-tilassa tallennetaan 1-bittiset 8×8-symbolit. Moniväritilassa tallennetaan kaksibittiset vaakasuuntaiset pikseliparit ja käytetään solujen merkintöjä Color RAM -bitillä 3. |

**Työnkulku:**
1. Aseta Kung Fu Flash 2 C64:n kasettiporttiin, käynnistä tietokone ja kytke
   USB-kaapeli tietokoneeseen/Maciin.
2. Avaa **Asetukset → Integraatiot** ja tarkista **Kung Fu Flash 2** -osio —
   portin pitäisi olla jo täytetty.
3. Valitse jaetun suorituksen valikosta **Kung Fu Flash 2** (valinta muistetaan
   ja tallennetaan myös projektitiedostoihin).
4. Napsauta **▶ Suorita**. Ohjelma käännetään, kasetti käynnistetään uudelleen
   MENU-lataajaan (lyhyt 1200 baudin "kosketus" sarjaporttiin), lyhyt kättely
   seuraa ja PRG ladataan. Kun siirto on valmis, ohjelma toimii oikealla
   koneella.

Toimii sekä **Block**-, **Expert**- että **Ultimate Basic** -tiloissa; Ultimate
Basic -ohjelmat kääntyvät projektin käynnistystiedostosta.

> **Rajoitukset ja tarkistukset:** PRG:n on sisällettävä kaksitavuinen
> latausosoite sekä vähintään yksi datatavu, sen on sovittava C64:n 64 KiB:n
> osoiteavaruuteen eikä se saa ylittää kasetin latauslaitteen hyväksymää kokoa.
> Virheet – porttia ei ole konfiguroitu, porttia ei voida avata, kasetti ei
> palaa MENU-tilasta tai hylätty lataus – raportoidaan toast-viestissä tarkan
> syyn kera.

> **Vinkki:** Jos haluat mieluummin kasettikuvan kuin live-latauksen, **Build
> CRT** (Magic Desk 64K) toimii myös Kung Fu Flashilla — katso [Osa 12b]{1].

### Versiohallinta (git)

**Asetukset → Yleiset → Versiohallinta** ja **Asetukset → Tiedostot ja polut →
git**:

| Asetus                                                                | Kuvaus                                                                                                                                               |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Automaattiset automaattiset tallennusmerkinnät versionhallinnassa** | Lisää automaattisen tallennuksen versiohistoriaan noin 2,5 sekuntia muokkaamisen lopettamisen jälkeen (myös projektivälilehdille projektihistoriaan) |
| **Valitse git.exe…**                                                  | Selaa `git` -suoritettavaan tiedostoon (`git.exe` Windowsissa)                                                                                       |
| **Automaattinen tunnistus**                                           | Tyhjentää valitun polun ja etsii PATH-polusta ja tavallisista asennuskansioista                                                                      |
| **Käytä Gitiä, kun projekti on repositoriossa.**                      | Avaa versionhallintaikkunan Git-tilassa git-arkiston tiedostoille                                                                                    |
| **Tila**                                                              | Näyttää git-version tai tiedon, että git-versiota ei löytynyt (sisäänrakennettu versionhallinta toimii edelleen)                                     |

## 14. Visuaaliset editorit (työkalupakki)

Visuaaliset editorit avautuvat omilla työkalupalkin painikkeillaan. Jokaisella
on **Tiedostot ▾** -valikko datan (pääasiassa raakadatan `.bin`) lataamiseen ja
tallentamiseen sekä ohjelmaan viemiseen (**Vie lohkoihin**); `.bin` siirtyy
ohjelmaan `INCBIN` -komennolla. Korkean resoluution editori voi myös tallentaa
suoraan D64-levylle (**Tallenna D64:ään…**).

**Väripaletti:** **Asetukset → Yleiset → Editorit → C64-väripaletti** valitsee
RGB-arvot, joilla jokainen editori piirtää 16 C64-väriä (sprite, hahmo,
merkistöpohja, korkearesoluutio, kartta- ja tasoeditori, työkalupakin
värimallit). Oletusarvo on **Colodore**, joka on lähimpänä todellista C64-väriä
komposiitti-/S-videonäytössä; **Pepto** (vanhempien versioiden tummempi,
vähemmän kylläinen paletti), **VICE**, **Deekay** ja **C64 Wiki / Godot** ovat
myös käytettävissä. Vain näyttö muuttuu — datasi väri-indeksit pysyvät samoina.
Korkean resoluution kuvien tuonti käyttää myös editoripalettia, ellet valitse
sieltä toista.

**Mukautettu paletti:** Jos mikään niistä ei vastaa näyttöäsi tai oikeaa
C64-näyttöäsi, valitse **Mukautettu** ja napsauta **Muokkaa mukautettua
palettia…**. Jokaisella 16 värillä on värivalitsin ja heksadesimaalikenttä
(`#RRGGBB`); **Aloita kohdasta** + **Kopioi** täyttää kaikki 16
sisäänrakennetusta paletista. **Tuo…** lukee Photoshop `.act`-, VICE `.vpl`-,
GIMP `.gpl`-tiedoston tai minkä tahansa tekstin, jossa on 16 `#RRGGBB` /
`$RRGGBB` arvoa (käytetään 16 ensimmäistä väriä); **Vie .act** ja **Vie .vpl**
kirjoittavat paletin Photoshopille tai VICElle (*Asetukset → Video → Paletti*
VICEssä), jotta voit verrata samoja värejä emulaattorissa. **Tallenna**
tallentaa sen ja vaihtaa tilaan **Mukautettu**.

Visuaalisen editorin valintaikkunoita voidaan vetää otsikoistaan koko Visual
Assembler -työtilan poikki. Valintaikkuna, jolle ei ole tallennettua sijaintia,
avautuu keskitetysti; siirtämisen jälkeen sen viimeisin sijainti tallennetaan
käyttöliittymän asetuksiin ja palautetaan seuraavan avauskerran yhteydessä.

### Korkean resoluution / monivärinen editori

Pikselitason bittikarttaeditori, jossa on sekä 320×200 korkearesoluutio- että
160×200 moniväritilat. Avaa se korkearesoluutioeditorin työkalupalkin
painikkeella.

| Ominaisuus                    | Kuvaus                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tilan vaihto                  | **Monivärinen** -valintaruutu vaihtaa korkearesoluutioisen (yksivärinen solua kohden) ja monivärisen (4 väriä solua kohden) välillä.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Työkalut                      | Lyijykynä, pyyhekumi, viiva, suorakulmio, täytetty suorakulmio, soikio, täytetty soikio, täyttö, värivalitsin, solupaperi, valinta.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Värivalitsin                  | Napsauta pikseliä, jos haluat sen näkyvän värin olevan muste (korkealla resoluutiolla solun muste tai paperi, kumpi tahansa pikseli näkyy); editori palaa sitten edelliseen työkaluun. **Alt+napsautus** valitsee värin millä tahansa työkalulla.                                                                                                                                                                                                                                                                                                                                                                                                           |
| Solupaperi (korkearesoluutio) | Korkearesoluutioinen kuva sallii kaksi väriä jokaisessa 8×8-solussa: musteen (asetetut pikselit, solun näytön RAM-tavun suuri näpyttely) ja paperin (tyhjennä pikselit, pieni näpyttely). **Solun paperi** -työkalu asettaa jokaisen napsauttamalla tai vetämällä hiirellä valitun värisen solun paperin; **PAPERI** asettaa silti jokaisen solun kerralla. Pyyhekumi tyhjentää pikselit, joten solun oma paperi näkyy. Pois käytöstä monivärisessä tilassa, jossa tausta ($D021) on jaettu.                                                                                                                                                                |
| Ruiskutustyökalu              | Airbrush-tyylinen piirtäjä, joka sirottelee pikseleitä kohdistimen ympärille piirtäessään.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Suihkutusintensiteetti        | Ruiskutustyökalun vieressä olevasta alasvetovalikosta säädetään kunkin ruiskutusjäljen tiheyttä.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Väripaletti                   | Etualan (muste) ja paperin (tausta) valitsimet. Monivärisessä tilassa jokaisessa 4×8-solussa on paperi ja 3 muuta väriä: neljäsosa hylätään ja tilarivillä näkyy viesti. Paperin vaihtaminen värittää kaikki taustapikselit uudelleen, kuten `$D021` tekee. Rajan ylittävät solut (esimerkiksi 32 000 tavun raakatiedostosta) saavat punaisen kehyksen, ja vienti varoittaa niistä, koska niiden ylimääräiset värit muuttuisivat taustaksi.                                                                                                                                                                                                                 |
| Kumoa / Tee uudelleen         | Iskukohtainen historia, ctrl-Z / ctrl-Y.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Valitse                       | Katkoneliön työkalu: vedä osoitinta kankaalla merkitäksesi suorakulmaisen alueen. **Esc** tyhjentää valinnan.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Kopioi / Liitä                | **Kopioi** (`Ctrl/Cmd+C`) kopioi valitun alueen. **Liitä** (`Ctrl/Cmd+V`) näyttää esikatselun, joka seuraa kohdistinta: napsauta piirtoaluetta sijoittaaksesi sen, **Esc** peruuttaa. Kopio säilytetään, joten `Ctrl/Cmd+V` painaminen ja uudelleen napsauttaminen sijoittaa sen niin monta kertaa kuin on tarpeen. Korkean resoluution tilassa liitetyt pikselit noudattavat edelleen kahden värin solukohtaista rajoitusta, joten kohdista alue soluruudukkoon säilyttääksesi sen värit. Kopioi, Liitä ja Läpinäkyvä liitä ovat myös piirtoalueen hiiren kakkospainikkeen valikossa; liittäminen aloitettiin siellä esikatselussa napsautetusta kohdasta. |
| Läpinäkyvä tahna              | `Ctrl/Cmd+Shift+V` (tai sen työkalupalkin painike) ohittaa kopion paperinväriset pikselit, joten alla oleva kuva näkyy läpi.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Ruudukko + Rasteri            | **Grid** näyttää merkkisoluruudukon: 8×8 pikseliä korkearesoluutioisena, 4×8 kaksinkertaisen leveyden pikseliä monivärisenä. 4× zoomista alkaen se piirtää myös himmeämmän viivan jokaisen pikselin ympärille, jotta jokainen pikseli voidaan sijoittaa tarkasti. **Raster** lisää rasteririvin päällekkäiskerroksen.                                                                                                                                                                                                                                                                                                                                       |
| Zoomaus                       | Liukusäädintä suurennetaan 1× - 16× tai Ctrl+rullaa kankaan päällä (kohdistimen alla oleva piste pysyy paikallaan).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Tuo kuva                      | Kankaalle pudotetut PNG/JPEG/GIF-kuvat kvantisoituvat automaattisesti 16-väriseen C64-palettiin.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Vie lohkot                    | Lisää ohjelmaan latausohjelman: se lataa tiedoston `HIRES` levyltä kansioon `$2000`, kopioi näytön RAM-muistin kansioon `$0400` (ja monivärisessä RAM-muistissa kansioon `$D800`) ja kytkee sitten bittikarttatilan päälle. Kuva ei ole lohkoissa: lisää se levylle komennolla **Tallenna D64:ään**.                                                                                                                                                                                                                                                                                                                                                        |
| Vie `.bin`                    | Tallentaa natiivin moniväritiedostomuodon (10000 tavua: 8000 bittikarttaa + 1000 näyttöä + 1000 väriä) valmiiksi LOADFILE-tiedostoon $2000.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |

### Sprite-editori

24×21 pikselin sprite-editori moniruutuanimaatiolla. Avaa se Sprite-editorin
työkalupalkin painikkeella.

| Ominaisuus                     | Kuvaus                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kehykset                       | Lisää/poista/järjestä uudelleen kehyksiä; kehysnauha näkyy alhaalla. **Kopioi** / **Liitä** kehysrivillä kopioi koko nykyisen kehyksen; samat kaksi merkintää ovat sekä kankaan että kehysnauhan hiiren kakkospainikkeen valikoissa.                                                                                                                                                                                                                                 |
| Tila                           | Yksivärinen/monivärinen vaihto.                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Työkalut                       | Kynä, täyttö, värivalitsin, viiva, suorakulmio, ympyrä – sekä vaakasuora ja pystysuora käännös, siirto vasemmalle/oikealle/ylös/alas (valinnainen rivitys). Muototyökalut näyttävät reaaliaikaisen esikatselun vetämisen aikana; vapauta painike vahvistaaksesi.                                                                                                                                                                                                     |
| Värivalitsin                   | Napsauta pikseliä valitaksesi sen väripaikan (sprite-väri, MC1, MC2, taustan tai peittokuvan väri muokatulla tasolla); editori palaa sitten edelliseen työkaluun. **Alt+napsautus** valitsee millä tahansa työkalulla.                                                                                                                                                                                                                                               |
| Zoomaus                        | Liukusäädintä 3× - 40× tai Ctrl+rullaa kankaan päällä.                                                                                                                                                                                                                                                                                                                                                                                                               |
| Kumoa / tee uudelleen          | Täysi kumoa/tee uudelleen -pino kehystä kohden. Ctrl/Cmd+Z / Ctrl/Cmd+Y tai työkalupalkin painikkeet.                                                                                                                                                                                                                                                                                                                                                                |
| Kuvan tuonti                   | Tuo PNG- tai JPEG-kuva valitsemalla Tiedostot → Tuo kuva. Tuoja yhdistää jokaisen pikselin lähimpään C64-palettiväriin ja kirjoittaa sen nykyiseen kehykseen.                                                                                                                                                                                                                                                                                                        |
| Animaation esikatselu          | Toista / pysäytä konfiguroitavalla nopeudella.                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Vie lohkot                     | Lisää RAWBYTES-lohkon 64-tavuiseen tasattuun osoitteeseen jokaista kehystä kohden sekä sprite-osoittimen asetuksen.                                                                                                                                                                                                                                                                                                                                                  |
| Tallenna `.bin`                | Kirjoittaa 64 tavua kehystä kohden (raakaa spritedataa ilman täytettä).                                                                                                                                                                                                                                                                                                                                                                                              |
| Valinta                        | **Valitse / siirrä**: vedä suorakulmiota ja vedä sitten sen sisällä siirtääksesi pikseleitä (tyhjät pikselit ovat läpinäkyviä); nuolinäppäimet siirtävät sitä yhden pikselin verran (kahden monivärisessä), Delete tyhjentää sen, Esc pudottaa sen. **Kierrä 90°** (molempiin suuntiin) kääntää valinnan tai koko kehyksen. Valinta, kääntäminen, siirtäminen ja kiertäminen vaikuttavat yhdessä runkoon ja päällekkäiskuvaan.                                       |
| Korkean resoluution peittokuva | **Korkean resoluution päällekkäiskuva** lisää toisen, yksivärisen korkean resoluution spriten jokaisen kehyksen päälle – klassisen ääriviivan monivärisen rungon päälle. **Kerros**-luettelo valitsee muokatun kerroksen; päällekkäiskuva himmenee rungon muokkauksen aikana. C64:ssä se on erillinen spritti: anna sille pienempi spritin numero kuin rungolle. `.bin` ja **Kopioi bytes** kirjoittavat päällekkäiskuvan spritit rungon (`sprite_f1_ov_1`) jälkeen. |
| Peilaa kaikki                  | Lisää jokaisesta kehyksestä (ja sen osuma-alueesta) vaakasuunnassa peilikuvan – voit kävellä kierrosta toiseen suuntaan yhdellä napsautuksella.                                                                                                                                                                                                                                                                                                                      |
| Sprite-arkin tuonti            | Tiedostot → **Tuo sprite-arkki…**: solun leveys/korkeus, siirtymä, väli ja kehysten määrä leikkaavat kuvan nykyisen kokoisiksi kehyksiksi (moniväriset solut skaalataan 12 pikseliin spriteä kohden). Värit tulevat kuvasta tai pysyvät spriten omina; OKLab-täsmäytys ilman rasterointia, järjestetty (Bayer) tai Floyd–Steinberg-rasterointi. Korvaa kehykset tai lisää niihin.                                                                                    |
| Hitbox                         | **Hitbox** -työkalu vetää suorakulmion kehystä kohden (katkoviiva syaanilla); **Fit**, **Fit every frame**, **Copy to every frame** ja **Remove** sivupaneelissa. Tiedostot → **Copy hitbox table** antaa `sprite_hit_x / _y / _w / _h` (yksi tavu kehystä kohden, näytön pikselit vasemmasta yläkulmasta); kehys ilman hitboxia käyttää pikselirajojaan.                                                                                                            |
| X / Y ×2                       | Näyttää esikatselun kuten sprite-laajennuksessa `$D01D` / `$D017`.                                                                                                                                                                                                                                                                                                                                                                                                   |

**Vie UltimateBasiciin** (Tiedosto-valikko) kirjoittaa jokaisen ruudun (enintään
8) `sprdef`-tiedostona, asettaa sprite 0:n (väri, monivärinen, laajennus) ja
lisää animaatiolle rasterisynkronoidun silmukan, joka askeltaa ruutuja editorin
kuvataajuudella. Ultimate Basic -tilassa se lisätään kohdistimen kohdalle,
muuten kopioidaan leikepöydälle.

### C64-merkki-ROM-selain ("merkkikartta")

C64-merkki-ROMin (sisäänrakennetun PETSCII-fontin) vain luku -tilassa oleva
katseluohjelma. Avaa se työkalupalkin **C64 chargen** -painikkeella. Hyödyllinen
symbolin näyttökoodin löytämiseen ennen sen kirjoittamista komennolla `RAWBYTES`
tai `TEXT`.

| Ominaisuus                | Kuvaus                                                                                                                                                                                                                                                               |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kaksi merkistöä           | Välilehti 1: **Sarja 1 — Ylä/Grafiikka** (oletustila käynnistyksen jälkeen). Välilehti 2: **Sarja 2 — Ala/Ylä** (`$0E`-kytkimen jälkeen).                                                                                                                            |
| Glyfiruudukko             | 16×16-ruudukko, jossa on kaikki 256 merkkiä. Napsauta symbolia nähdäksesi sen yksityiskohtapaneelin: suurennettu 8×8 pikselin näkymä, näyttökoodi (desimaali + heksadesimaali), PETSCII-koodit (sekä oletusarvoiset että siirretyt) ja raaka 8-tavuinen bittikartta. |
| Yksityiskohtainen paneeli | Näyttää valitun glyfin näyttökoodin, PETSCII-koodit ja kahdeksan raakatavua – valmiina liitettäväksi `RAWBYTES`- tai BYTE-lohkoon.                                                                                                                                   |
| Vain lukuoikeus           | Ei muokkausta tässä — käytä Merkkieditoria (alla) muokataksesi symboleja.                                                                                                                                                                                            |

### Merkkieditori (merkistö)

256-merkkinen 8×8-merkistöeditori. Avaa se Merkkieditori-työkalurivin
painikkeella.

| Ominaisuus                   | Kuvaus                                                                                                                                                                                                                                                                                    |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lataa ROM                    | Lataa C64-merkki-ROMin — tarkat 901225-01-symbolit, ei tiedostovalitsinta. Ensimmäinen painike (ja **Tiedostot → ROM: isot kirjaimet / grafiikka**) lataa sarjan 1, toinen painike (tai Shift+napsautus tai **Tiedostot → ROM: pienet kirjaimet / isot kirjaimet**) lataa sarjan 2.       |
| Lataa `.bin`                 | Tuo ulkoisen 2048-tavuisen merkistöbinääritiedoston.                                                                                                                                                                                                                                      |
| Merkkikohtainen esikatselu   | 16-levyinen ruudukko, jossa on kaikki 256 symbolia ja nykyinen solu korostettuna.                                                                                                                                                                                                         |
| Pikselieditori               | Muokkaa valittua merkkiä tai **laattaa**, jossa on 2×1, 1×2 tai 2×2 vierekkäistä merkkiä yhdeksi kuvana (laatanvalitsin).                                                                                                                                                                 |
| Piirustustyökalut            | Lyijykynä, viiva, suorakulmio, täytetty suorakulmio, täyttö ja värinvalitsin. Pikselin napsauttaminen, jossa on jo muste, poistaa sen. Värinvalitsin (vain monivärisissä; **Alt+napsautus** millä tahansa työkalulla) tekee napsautetun pikselin väristä – FG, BG, MC1 tai MC2 – musteen. |
| Muunnokset                   | Tyhjennä, käännä, käännä vaaka-/pystysuunnassa, siirrä kiertämällä, käännä 90° myötäpäivään / vastapäivään (vain neliönmuotoiset laatat) — koko laatassa.                                                                                                                                 |
| Kumoa / Tee uudelleen        | Työkalupalkin painikkeet, Ctrl+Z ja Ctrl+Y (Ctrl+Shift+Z).                                                                                                                                                                                                                                |
| Kopioi / Liitä               | Työkalurivin painikkeet, Ctrl+C / Ctrl+V tai hiiren kakkospainikkeella napsauttaminen kartalla; kopioi koko laatan väreineen.                                                                                                                                                             |
| Kartan vetäminen             | Vedä hahmo toisen hahmon päälle kartalla vaihtaaksesi niitä; pidä Shift-näppäintä painettuna ja vedä kopioita.                                                                                                                                                                            |
| Tekstin esikatselu           | Kirjoita teksti nähdäksesi sen nykyisessä merkistössä. Valitse isojen tai pienten kirjainten yhdistäminen; `{65}` tai `{$41}` lisää näyttökoodin.                                                                                                                                         |
| Alueen vienti                | Aseta Lähettäjä- ja Vastaanottaja-merkit ja sitten **Tiedostot → Tallenna alue (.bin)** (raa'at tavut) tai **Kopioi alue ASM** (`.tavut` riviä).                                                                                                                                          |
| Merkkikohtainen väri         | Tallentaa kullekin glyyfille oletusarvoisen Color RAM -arvon. Monivärisessä merkkitilassa tämä säilyttää myös solukohtaisen monivärisävytyksen käyttöönottobitin ja merkin oman alemman 3-bittisen värin.                                                                                 |
| Metadatan edestakainen kulku | Kun lataat yhteensopivia tietoja Charset Canvas-/Kartta-työnkuluista, merkkikohtaiset värimetatiedot säilyvät, joten muokkauksia voidaan jatkaa menettämättä väritarkoitusta.                                                                                                             |
| Vie lohkot                   | Liittää RAWBYTES-arvon kohtaan $0800 (lohko 2) tai $3800 (lohko 7) koodatulla merkistöllä.                                                                                                                                                                                                |

### Merkistöpohjan editori

Koko kankaan kattava merkistöpiirtäjä näyttöjen rakentamiseen täydellisestä 256
merkin merkistöstä. Avaa se Charset Canvas -työkalurivin painikkeella.

Kangas on 16 × 16 merkkiä, 128 × 128 pikseliä. Monivärisessä merkkitilassa
jokainen merkki on joko monivärinen (leveät pikselit, 4 väriä) tai
korkearesoluutioinen (8 kapeaa pikseliä, 2 väriä), aivan kuten C64:ssä.

| Ominaisuus                              | Kuvaus                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |                                                           |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| Yksivärinen / monivärinen               | Mono-tilassa tallennetaan 1-bittiset 8×8-symbolit. Moniväritilassa tallennetaan kaksibittiset vaakasuuntaiset pikseliparit ja moniväriset solut merkitään Color RAM -bitillä 3.                                                                                                                                                                                                                                                                                                                                                              |                                                           |
| Merkkitilatyökalu                       | Moniväritilassa napsauta tai vedä hahmojen yli vaihtaaksesi niiden monivärisen ja korkean resoluution välillä (Color RAM -bitti 3). Muoto säilyy: asetetusta pikseliparista tulee hahmon oma väri. Korkean resoluution hahmolla on tausta ja oma väri (0–7); MC1/MC2 eivät maalaa siihen.                                                                                                                                                                                                                                                    |                                                           |
| Tausta                                  | Taustavalikon näet myös yksiväritilassa; MC1/MC2 vain moniväritilassa.                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |                                                           |
| ECM-koodi                               | **ECM**-valintaruutu (laajennettu väritila, ei yhdessä monivärisen kanssa): jokainen merkki on korkearesoluutioinen omalla värillään (0–15) ja yhdellä neljästä taustasta BG0–BG3 (`$D021`–`$D024`; BG1 / BG2 ovat MC1 / MC2 -rekisterit). Valitse paletista taustaväri (merkitty B0–B3) ja napsauta tai vedä sitten merkkien yli **Character background** -työkalulla. Vain 64 eri merkkiä mahtuu: tilarivi laskee ne, ja tallennettaessa yhtä suuret merkit yhdistetään – merkistö on 64 merkkiä (512 tavua) ja näyttökoodit ovat `glyph`. | tausta << 6`. Käynnistä ECM käyttämällä `$D011` bittiä 6. |
| C64-värimalli                           | Tausta käyttää `$D021`; jaettu monivärinen 1 käyttää `$D022`; jaettu monivärinen 2 käyttää `$D023`; jokaisen hahmon oma väri tulee Color RAM -biteistä 0–2.                                                                                                                                                                                                                                                                                                                                                                                  |                                                           |
| Piirustustyökalut                       | Lyijykynä, pyyhekumi, viiva, suorakulmio, soikio ja täyttö toimivat merkkien rajojen yli.                                                                                                                                                                                                                                                                                                                                                                                                                                                    |                                                           |
| Värivalitsin                            | Napsauta pikseliä valitaksesi sen näkyvän värin (monivärisessä merkissä myös sen BG / MC1 / MC2 / omavärisen musteen); editori palaa sitten edelliseen työkaluun. **Alt+napsautus** valitsee millä tahansa työkalulla.                                                                                                                                                                                                                                                                                                                       |                                                           |
| Ruiskutustyökalu                        | Airbrush-tyylinen piirustus, joka sirottelee pikseleitä viereisten solujen/merkkien päälle.                                                                                                                                                                                                                                                                                                                                                                                                                                                  |                                                           |
| Suihkutusintensiteetti                  | Ruiskutustyökalun vieressä oleva alasvetovalikko asettaa viivan tiheyden.                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |                                                           |
| Ruudukon vaihto/vaihto                  | Ruudukko-valintaruutu näyttää tai piilottaa 16×16 merkkiruudukon.                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |                                                           |
| Zoomaus                                 | Zoomausliukusäädin (2×–24×, koko laitteen pikselit C64-pikseliä kohden) tai Ctrl+rulla kankaan päällä; zoomaus muistetaan. 8×:stä alkaen ruudukko piirtää myös ohuen viivan jokaisen pikselin reunaan.                                                                                                                                                                                                                                                                                                                                       |                                                           |
| Tallenna merkistö `.bin`                | Tallentaa 2048-tavuisen merkkibittikarttadatan.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |                                                           |
| Tallenna 16×16 kartta + väri-RAM `.bin` | Tallentaa 256 näyttökoodia ja sen jälkeen 256 väri-RAM-arvoa. Käytä tätä yhdessä `MAP_COPY16X16`:n kanssa.                                                                                                                                                                                                                                                                                                                                                                                                                                   |                                                           |
| Ladataan                                | Voi ladata charset-canvas-tallennuksia, tavallisia charset-tietoja ja yhteensopivia Character Editor -character-tietoja, mukaan lukien tallennetut merkkikohtaisesti määritetyt värit, jos niitä on.                                                                                                                                                                                                                                                                                                                                         |                                                           |

**Tärkeä C64-rajoitus:** monivärisessä merkkitilassa kaksi jaettua väriä ovat
globaaleja koko näytölle (`$D022` / `$D023`). Vain hahmon oma väri on
solukohtainen, ja se on rajoitettu väreihin 0–7, koska Color RAM -bitti 3
valitsee monivärisen tilan. Joten yksi merkki näyttää enintään **4 väriä**
(tausta, MC1, MC2 ja oma väri) ja koko näyttö enintään 3 + 8. Paletissa jaetut
värit on merkitty tunnisteilla BG / 1 / 2, ja värit 8–15, joita ei jaeta, on
himmennetty. Tällaisen värin valitseminen sijoittaa sen vain MC2:een tai
MC1:een, kun taas mikään pikseli ei käytä kyseistä rekisteriä; muussa
tapauksessa muuta sitä sen alasvetovalikosta (joka värittää koko näytön
uudelleen). Korkean resoluution (mono) tilassa hahmolla on kaksi väriä: tausta
ja oma väri (0–15).

### Karttaeditori (monikerroksiset laattakartat)

Kerrostettu laattakarttaeditori staattisille maisemille, sprite-spawn-kartoille,
törmäystiedoille ja vastaaville. Avaa se karttaeditorin työkalupalkin
painikkeella.

| Ominaisuus                                                 | Kuvaus                                                                                                                                                                                                                                                                            |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kerrokset                                                  | Useita nimettyjä kerroksia, joilla jokaisella on oma laattasarjansa ja läpinäkyvyytensä.                                                                                                                                                                                          |
| Siveltimet                                                 | Yksittäislaatta-, täyttö-, viiva-, suorakulmio- ja ympyrätilat. Muototyökalut näyttävät reaaliaikaisen esikatselun vetämisen aikana; vapauta painike vahvistaaksesi.                                                                                                              |
| Zoomaus                                                    | Liukusäädin tai Ctrl+rulla kartan päällä.                                                                                                                                                                                                                                         |
| Kumoa / tee uudelleen                                      | Täysi kumoa/tee uudelleen -pino tasoa kohden. Ctrl/Cmd+Z / Ctrl/Cmd+Y tai työkalupalkin painikkeet.                                                                                                                                                                               |
| Tyhjennä valikko                                           | Tasokohtainen tai koko kartan selkeä vahvistuksella.                                                                                                                                                                                                                              |
| Kuvan tuonti                                               | Pudota laattakartan PNG-kuva; editori leikkaa sen automaattisesti laatoiksi.                                                                                                                                                                                                      |
| Kopioi / liitä                                             | Kopioi valittu laatta-alue ja liitä se normaalisti tai käytä läpinäkyvää liittämistä pitääksesi tyhjät laatat läpinäkyvinä. Samat merkinnät löytyvät piirtoalueen hiiren kakkospainikkeen valikosta.                                                                              |
| Monivärinen laattojen väritys                              | Yhteensopivien merkistömetatietojen avulla maalaus käyttää laatan tallennettuja Color RAM -oletusarvoja (mukaan lukien moniväriin liittyvä koodaus) yleisen tasaisen värin sijaan.                                                                                                |
| Mukautetut merkistövärit                                   | Kun merkistö sisältää `charColors` metadatan, karttaeditori käyttää valitun laatan oletusarvoista Color RAM -muistin arvoa piirtäessään.                                                                                                                                          |
| Vie lohkot                                                 | Lähettää RAWBYTES-lohkoja laattasarjan grafiikoille ja karttatiedoille.                                                                                                                                                                                                           |
| Tallenna näytön RAM-muistia (.bin)…                        | Tallentaa vain nykyisen karttatason näyttökoodit (40 × 25 = 1000 tavua).                                                                                                                                                                                                          |
| Tallenna näytön RAM-muisti + värillinen RAM-muisti (.bin)… | Tallentaa näyttökoodit yhdistettynä väri-RAM-arvoihin yhdeksi 2000 tavun tiedostoksi (`screen[0..999]` ja sen jälkeen `color[0..999]`). Käytä tätä **MAP_COPY**-makron kanssa (`auto` värilähteenä) palauttaaksesi sekä näytön että värit yhdellä toiminnolla suorituksen aikana. |

### Tasoeditori

Järjestää **Karttaeditorin näytöt** yhdeksi tasoksi — pystysuuntainen
ammuntapeli, alaspäin vierittävä autopeli, sivuttaisvieritys tai 2D-kartta — ja
esikatselee koko tasoa tasaisesti vierittämällä. Avaa se karttaeditorin vieressä
olevalla **Kenttäeditori**-työkalurivin painikkeella.

| Ominaisuus          | Kuvaus                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Layout              | **Pystysuora**, **Vaakasuora** tai **Ruudukko** (rivit × sarakkeet, rivin ja sarakkeen lisäys-/poistopainikkeilla).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Näytöt              | **Uusi tyhjä näyttö**, **Lisää karttaeditorista** (auki oleva kartta) tai **Lataa kartta(t) (.bin)…** (useita karttaeditorin vientitiedostoja kerralla). Vedä näyttö luettelosta paikkaan; vedä paikat päällekkäin vaihtaaksesi niitä.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Muokkaus            | **Muokkaa karttaeditorissa** avaa valitun näytön karttaeditorissa ja palauttaa muutokset; kopioi, siirrä ylös/vasemmalle tai alas/oikealle, poista; kumoa/tee uudelleen.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Esikatselu          | Vedä esikatselua tai käytä nuolinäppäimiä vierittääksesi pikseli pikseliltä; **Toista** vierittää automaattisesti (suunta, nopeus 1–8, silmukka), Välilyönti = toisto/pysäytys. *Reunat* merkitsevät näytön rajat.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Zoomaus             | Yleiskuvan zoomausliukusäädin (25–400 %) tai Ctrl+rulla yleiskuvan päällä.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Tarkastukset        | Merkistötiedot ja varoitus, kun näytöt käyttävät eri merkistöä tai värejä (taso käyttää ensimmäisen näytön asetuksia).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Hahmon ominaisuudet | **Hahmon ominaisuudet** -painike vaihtaa yleiskatsauksen ominaisuuksien piirtämiseen: valitse **Solid**, **Ladder**, **Hazard** tai **Collectible**, napsauta merkkiä ja jokainen solu, jossa on kyseinen näyttökoodi, saa (tai menettää) sen; vedä saadaksesi lisää koodeja. Määritteet näkyvät värillisenä kerroksena ja niistä tulee 256-tavuinen `LEVEL_ATTR`-taulukko (`LEVEL_ATTR_SOLID` = 1, `_LADDER` = 2, `_HAZARD` = 4, `_COLLECT` = 8).                                                                                                                                                                                                                                                                                                                          |
| Reunan tarkistus    | Punaiset merkit paikoista, joissa vierekkäiset näytöt eivät jatku: reunuksen toinen puoli on tyhjä (välilyönti) ja toinen ei, tai vain toinen puoli on yhtenäinen. Sivupaneeli laskee reunat ja solut.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Värit               | **Tasoreuna** ja **Omat värit tälle näytölle** (tausta, reunus, monivärinen 1/2) valitulle näytölle; esikatselukehys näyttää reunuksen. Vienti tapahtuu paikkaan mukaan muodossa `LEVEL_SCR_BG / _BORDER / _MC1 / _MC2` (jossa `LEVEL_SCR_COLORS` = 1), kun sijoitetulla näytöllä on omat värinsä.                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Muisti              | `.level`-datan koko valitussa osoitteessa (lasketaan täsmälleen niin kuin makro sen rakentaa), varoituksilla BASIC / KERNAL ROMille, I/O-alueelle ja muistille sen alapuolella `$0800` sekä tason RLE-koosta. **Export RLE to blocks / Copy RLE asm** antaa `level_unrle`-purkajalla (`($FB)` → `($FD)`) pakatun tason RLE:n.                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Juokse VICE-tilassa | Rakentaa joystick-scroll-testiohjelman tasolta (`level-demo`-vieritysohjelma, koodi kohdassa `$C000`, tasodataa tasolta `$2000`, mukautettu merkistö kohdassa `$2000`) ja käynnistää sen VICE:ssä — näytön värit vaihtuvat näytön ollessa näkymän vasemmassa yläkulmassa, kamera käynnistyy ensimmäisestä Start-objektista.                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Esineet             | **Objektit-taso** -painike vaihtaa yleiskatsauksen objektien muokkaamiseen: valitse tyyppi (Aloitus, Vihollinen, Esine, Ovi, Uloskäynti, Liipaisin) ja **Param** tavu (vihollisen laji, esineen tunnus, oven kohde …), napsauta sijoittaaksesi, vedä siirtääksesi (kiinnitetty 8 px:ään, Shift = vapaa), napsauta objektia valitaksesi sen ja muuttaaksesi sen tyyppiä/parametria, nuolinäppäimet siirtävät sitä, Delete poistaa sen. Objektit kuuluvat tason sijaintiin, eivät näyttöön. Ne luetellaan sivupalkissa, näytetään esikatselussa, tallennetaan tason mukana ja viedään vieritysjärjestyksessä (pystysuoraan Y:n mukaan, vaakasuoraan X:n mukaan, ruudukko rivi riviltä) `LEVEL_OBJ_*` -taulukoina — **Kopioi asm / Vie lohkoihin** ja `.level` -makron avulla. |

**Tiedostot-valikko:**
| Toiminta                                                          | Mitä se tekee                                                                                                          |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Uusi taso** / **Avaa taso (.bin)…** / **Tallenna taso (.bin)…** | Tasoprojekti: kaikki näytöt ja asettelu. Tämä on tiedosto, jonka `.level`-makro ja Ultimate Basicin `map load` luivat. |
| **Näytön RAM-muistin tallennustaso (.bin)…**                      | Koko taso yhtenä hahmokarttana (vain ruutukoodit).                                                                     |
| **Tallennetun näytön taso + väri RAM (.bin)…**                    | Koko tason näyttökoodit ja niiden värit.                                                                               |
| **Vie lohkoiksi** / **Kopioi asm**                                | Tasotiedot lohkoina tai asm-tekstinä (leikepöytä).                                                                     |

**Käytetään assemblerissa tasoa **, `.level "level.bin"` + `.level_row` (katso
[LEVEL / LEVEL_ROW](#level--level_row) ja `samples/level-demo.asm`); Ultimate
Basic 1.6.1+:ssa, `map load "level.bin", $4000` ja `map view px, py` (esimerkki
`level_scroll_demo.ub`).

### SID-editori (3-ääninen seuranta)

Moni-instrumenttinen 3-ääninen seuranta. Avaa se SID Editor -työkalupalkin
painikkeella. Toisto ja jokainen esikatselu (**Soita: Kaikki**, instrumentin
esikatselu, virtuaalinäppäimistö, nuotin syöttö, sointu/arpeggio, rivi- ja
yksittäisten kuvioiden toisto) toistetaan emuloidulla SID:llä: viedyn
6502-soittimen JS-malli (kehys kehykseltä) lähettää SID-rekisterinsä
taustajärjestelmään, joka renderöi äänen. Työpöytäsovelluksen ulkopuolella pieni
SID-syntetisaattori soittaa sen sijaan.

**Esikatselumoottori:** **Asetukset → Yleiset → SID-esikatselu** valitsee
oletusarvoisen **reSID (resid-rs)** tai sovelluksen oman SID-emuloinnin **VA SID
Core (Rust)** ja sirun (MOS 6581 / 8580). Editorin otsikko näyttää käytössä
olevan moottorin (esim. *· reSID (MOS 8580)*). Instrumentin parametrit asetetaan
säätimillä.

**Kaksi SID:tä:** **SID: 1 / 2** seurantatyökalupalkissa vaihtaa sävelmän 3 ja 6
äänen välillä. Kahdella SID:llä sen vieressä oleva lista asettaa toisen SID:n
osoitteen: `$D420`–`$D7E0` tai `$DE00`–`$DFE0`, `$20` välein. Sarakkeet ovat
otsikoilla **S1 V1** … **S2 V3**. Jokaisella SID:llä on oma suodattimensa ja
äänenvoimakkuutensa, ja ääni ohjaa vain omaa siruaan. Kaksi SID:tä (SID 1 vasen,
SID 2 oikea) soittavat stereona. Nuottien esikatselut soivat ensimmäisellä
SID:llä. Vaihtaminen takaisin yhteen SID:hen poistaa toisen SID:n äänet ja kysyy
ensin, onko niissä mitään.

**Laitekohtaiset säätimet:**
- Aaltomuodon valintaruudut (TRI / SAW / PUL / NOI) — useat aaltomuodot
  yhdistetään JA-operaattorilla kuten SID:ssä — sekä **RING** (kolmion
  rengasmodulaatio edellisellä äänellä: 1 ← 3, 2 ← 1, 3 ← 2) ja **SYNC**
  (kiinteä synkronointi edelliseen ääneen).
- ADSR (hyökkäys / rappeutuminen / ylläpito / vapautus) näkyy vetämällä
  kuvaajana neljän liukusäätimen yläpuolella.
- Pulssinleveyden liukusäädin (0–4095).
- **Suodatin:** *Reititä tämä ääni suodattimen läpi*, LP / BP / HP ja **3 OFF**
  (mykistä ääni 3, kun sitä ei reititetä), katkaisu, resonanssi,
  äänenvoimakkuus. **End** + **Sweep** siirtävät katkaisua Cutista Endiin
  pyyhkäisyllä kehystä kohden; **Ping-pong** pomppii näiden kahden välillä –
  tämä luo resonanssipyyhkäisyjä suodattimessa. Ääni, joka käynnistää
  suodattimella reititetyn soittimen, omistaa suodattimen (katkaisu, resonanssi,
  tila); jokainen ääni, jonka soittimeen on reititetty, kulkee sen läpi.
- **Vibrato:**-efektin **Delay** jälkeen muodostaa kolmio-LFO:n, joka kääntyy
  **Speed** kehyksen välein, **Depth** 0-15 skaalattuna nuotin
  puolisävelaskeleen mukaan (riippumatta `V`-efektistä).
- **Pulssinleveysmodulaatio:** **Nopeus** lisätään pulssinleveyteen joka
  ruudussa, vaihdellen **Min** ja **Max** välillä.
- **Portti:** **Porttiajastin** vapauttaa portin niin monta kehystä ennen äänen
  seuraavaa nuottia (pidä se nopeuden alapuolella); **Kova uudelleenkäynnistys**
  nollaa myös ADSR:n puhtaan hyökkäyksen aikaansaamiseksi; **Ensimmäinen kehys**
  kirjoittaa aaltomuodon nuotin ensimmäiseen kehykseen (esim. `$09` testi +
  portti).
- **Aaltomuoto-/arpeggiotaulukko:** jopa 32 aaltomuodon askelta (— = säilytä) ja
  nuottia (puolisävelaskeleen siirtymä tai **abs** = absoluuttinen nuotti), yksi
  askel joka **Nopeus** ruudulla, **Silmukka** takaisin askeleeseen tai pysäytys
  edellisessä. **Presetit** (25, ryhmissä; lista säilyttää valitun presetin,
  kunnes taulukkoa muokataan käsin): arpeggiot (duuri, molli, septimisoinnut,
  sus4, dimensoitu, augmentoitu, power-sointu, oktaavi, trilli), rummut (basso,
  virveli, tom, taputus, suljettu/avoin hi-hat), soolo- ja bassoiskut sekä
  äänitehosteet (laser, mikrofoni, explosion).

**Seurantaruudukko:**
- 3 ääntä (6 toisella SID:llä) × jopa 256 patternia × 32 riviä;
  kappale-/järjestysluettelossa on jopa 255 askelta.
- Rivikohtainen: nuotti + instrumenttiindeksi sekä valinnainen efekti (katso
  **Efektisarake** alla). Tyhjät rivit sisältävät edellisen nuotin: kuten
  muissakin seurantalaitteissa (GoatTracker, SID-Wizard), nuotti pitää porttinsa
  päällä (pitotasolla), kunnes äänen seuraava nuotti on tai **nuotti pois
  päältä**.
- **Enter** (tai kaksoisnapsautus) muokkaa valitun solun tekstiksi (`C-4 01
  V24`); **Enter** tallentaa ja siirtyy seuraavalle riville, **Esc** peruu
  toiminnon.
- **Note-off** (`===`): näppäile **1** (tai `` ` `` / `=`), tai kirjoita `===` /
  `OFF` soluun. Se vapauttaa portin, joten instrumentin vapautus tapahtuu
  samalla tavalla kuin `C` -efekti ilman nuottia (tallennettu ja viety nimellä
  `C00`).
- Valitse yksi solu normaalisti tai pidä **Shift**-näppäintä pohjassa samalla,
  kun napsautat tai käytät nuolinäppäimiä laajentaaksesi suorakulmaista valintaa
  rivien ja minkä tahansa äänen yli. Hiiren kakkospainikkeella napsauttaminen
  valitun alueen sisällä pitää alueen ennallaan.
- Kopioi, Leikkaa, Liitä ja Tyhjennä ovat käytettävissä kuvaketyökalurivillä ja
  kuvakepohjaisessa kontekstivalikosta. `Ctrl/Cmd+C` ja `Ctrl/Cmd+V` käyttävät
  samaa suorakaiteen muotoista valintaa.
- Harmonia-apu: valitse perussävel, sointutyyppi ja oktaavi, esikuuntele sointu
  nykyisellä instrumentilla ja lisää sitten sointu suoraan seurantaan.
  Saatavilla olevia tyyppejä ovat duuri, molli, dimensoitu, augmentoitu, Sus2,
  Sus4, dominantti 7, duuri 7, molli 7, 6, molli 6, 9, b9, #9, dim7 ja 7sus4.
- Arpeggio-apuohjelma: esikatsele tai lisää 4-, 8- tai 16-askelisia nuotteja
  valitusta soinnusta alkaen ylös, alas tai ylös/alas.
- **Esikatselu rivi** kuuntelee valitun rivin kaikkien äänien osalta
  aloittamatta kuvioiden toistoa.
- Solualueen liittäminen alkaa nyt valitusta alueen aloitussolusta ja pysähtyy
  siististi ääni- ja rivirajoihin sen sijaan, että rivitys jatkuisi seuraavaan
  sarakkeeseen tai riviin.
- Soittimien poistaminen: **−** **+** vieressä poistaa nykyisen soittimen (sitä
  soittavat nuotit vaihtuvat sitä edeltävään kysymyksen jälkeen), ja Tiedostot →
  **Poista käyttämättömät soittimet** poistaa kaikki soittimet, joilla ei ole
  soitettuja nuotteja. Seurantaohjelman numerot seuraavat perässä;
  Kumoa-toiminto palauttaa ne.
- Kappaleen äänenvoimakkuus: **Vol**, seurantapalkin nuppi (0–15), on sävelmän
  äänenvoimakkuus: SID:n päääänenvoimakkuus kaikille kolmelle äänelle. Kahden
  SID:n sävelmässä on nuppi jokaiselle sirulle (**SID 1**, **SID 2**).
  Instrumentilla ei ole omaa äänenvoimakkuutta (käytä sustain-säädintä yhden
  äänen tasolle), ja aiemmin tallennettu sävelmä ottaa ensimmäisen
  instrumenttinsa äänenvoimakkuuden.
- PAL / NTSC: BPM-kohdan vieressä oleva kytkin asettaa laitteen, jolle sävelmä
  on tarkoitettu. NTSC toistaa 60 kuvaa sekunnissa NTSC-kellolla: esikatselu,
  BPM, viety soittajan nuottitaulukko ja `.sid` -otsikkotiedot seuraavat sitä.
- **Kvantisoi** (seurantapalkissa): ruudukko on 2, 4, 8 tai 16 riviä.
  Vaakasuuntaisessa seurannassa **Q** tai sen painike siirtää valitut nuotit
  lähimpään ruudukon riviin ja säilyttää niiden pituudet; kun **Äänitettynä** on
  valittuna, äänitteen nuotit kvantisoidaan samalla tavalla, kun se pysäytetään.
- **Valinta vaakasuuntaisessa seurantapalkissa:** Shift+vedä kehystä
  (Ctrl+Shift+vedä lisää valintaa), Ctrl+napsauta muistiinpanoa, Ctrl+A
  kaikille, Esc tyhjentääksesi. Ctrl+X / C / V ja Del tai sen otsikon painikkeet
  leikkaavat, kopioivat, liittävät ja poistavat. Liitä siirtyy hiiren alla
  olevalle riville tai seurantakursoriin ja kirjoittaa sen päälle. Muistiinpanon
  poistaminen säilyttää muistiinpanon lopun sitä edeltävänä. Ylätunnisteessa on
  myös **Kumoa** ja **Tee uudelleen**.
- **Kumoa / Tee uudelleen** (äänikopion edessä olevat painikkeet tai Ctrl+Z ja
  Ctrl+Y) selaavat nuotteja, instrumentteja, kappaletta ja tempoa sekä sävelmän
  latausta askel kerrallaan jopa 100 askeleen verran. Nupin vetäminen tai koko
  äänite on yksi askel, ja näkymä hyppää muuttuneeseen instrumenttiin ja
  kuvioon. Tekstikentissä on edelleen omat Ctrl+Z-näppäinyhdistelmänsä.
- **Frames/row** (1–255, joten suurempi luku on hitaampi) kirjoitetaan tai sitä
  askelletaan sen vieressä olevilla − / + -painikkeilla; `F` -tehoste muuttaa
  sitä toiston aikana. Sen vieressä oleva **BPM** näyttää tuloksena olevan
  tempon: 4 riviä iskua kohden PAL-äänessä, 6 kuvaa/rivi = 125 BPM.

**Kappale-/tilauslista:**
- Patternit on järjestetty kappale-/järjestysluettelon avulla, joka on
  kerrostettu raakapattern-pankin päälle – sama pattern voi toistua, ja kappale
  voi olla pidempi kuin tallennettujen patternien määrä.
- Lisää, poista ja järjestele kappaleluettelopaneelin vaiheita uudelleen;
  nykyinen vaihe korostuu toiston aikana.
- Sekä sovelluksen sisäinen toisto että jokainen vienti noudattavat tätä listaa,
  eivätkä raakakuviojärjestystä – ennen järjestyslistan luomista tehdyt viennit
  latautuvat edelleen oikein tavallisena 0..N-1-kappaleena.

**Efektisarake:** Jokainen solu voi sisältää yhden efektin nuotin ja
instrumentin rinnalla. Se syötetään lyhyenä koodina heti nuotin jälkeen (esim.
`C-4 01 V24`) tai omana koodinaan nuottittomalle efektiriville (esim. `F06`):

| Koodi | Vaikutus                  | Arvo                                                       |
| ----- | ------------------------- | ---------------------------------------------------------- |
| `V`   | Vibrato                   | pieni napostelu = syvyys, suuri napostelu = pitopituus     |
| `U`   | Liu'uta ylös (portamento) | taajuuteen lisättävä määrä joka rivillä                    |
| `D`   | Liu'uta alas (portamento) | kunkin rivin taajuudesta vähennettävä määrä                |
| `C`   | Nuotin leikkaus           | vaimentaa äänen ilman uudelleenlaukaisua; arvoa ei käytetä |
| `F`   | Nopeuden muutos           | uusi frames-per-row-arvo tulee voimaan välittömästi        |

Tehosteet päivittyvät kerran riviä kohden (vastaamaan viedyn soittimen
ajoitusta), toimivat identtisesti Web Audio -esikatselussa ja käännetyssä
6502-viennissä ja tallennetaan/ladataan häviöttömästi versioidussa
`.bin`-muodossa.

**Toisto ja virtuaalinäppäimistö:**
- Toista-työkalurivin painike muuttuu Tauko-painikkeeksi toiston aikana ja
  Jatka-painikkeeksi tauon aikana; Pysäytä-painike lopettaa toiston ja palauttaa
  tilan.
- Seurantapalkin päässä oleva **LCD-näyttö** näyttää kappaleen sijainnin (POS),
  kuvion (PAT), rivin (ROW) ja toistoajan (TIME) toiston aikana sekä
  muokkauskohdan pysäytystilassa. **Asetukset → Yleiset → SID-esikatselu →
  LCD-väri** tekee siitä vihreän tai punaisen.
- Seurantatyökalupalkin **Kanavaspektri** -painike avaa ikkunan, jossa on
  16-kaistainen analysaattori ääntä kohden (6 kahdella SID:llä). Se lasketaan
  toistettavien SID-rekistereiden – taajuuden, aaltomuodon, pulssinleveyden,
  arvioidun ADSR:n, suodattimen ja äänenvoimakkuuden – perusteella, ei äänestä,
  koska lähtö on yksi miksaus. Rengasmodulaatio, synkronointi ja suodattimen
  resonanssi eivät näy, ja se liikkuu vain seurantatoiston aikana, ei nuottien
  esikatselussa.
- Näppäimistön työkalupalkin painike avaa **VA-VK**, ei-modaalisen pianon (2, 3
  tai 4 oktaavia; asento, avoin tila, oktaavi ja *Lisää seurantaan* muistetaan)
  omilla **Toista / Pysäytä** -painikkeillaan, jotka pysyvät käytettävissä
  SID-editorin ollessa aktiivinen. Vedä sen otsikkoa sijoittaaksesi sen mihin
  tahansa pääsovelluksen päälle.
- VA-VK:n **Instrument** -nuppi (vetämällä, hiiren rullalla tai
  nuolinäppäimillä) valitsee instrumentin, jonka numero ja nimi näkyvät sen
  vieressä olevassa LCD-näytössä. Se seuraa editorin instrumenttiluetteloa.
  VA-VK:n otsikon vieressä oleva merkki näyttää käytössä olevan SID-emuloinnin
  (reSID tai VA SID Core, sirumallin kera).
- Ota käyttöön **Lisää seurantaan** kirjoittaaksesi jokaisen soitetun nuotin
  nykyiseen seurantakursoriin ja siirtyäksesi seuraavalle riville. Poista se
  käytöstä kuunnellaksesi nuotteja ilman muokkausta.
- Sointujen ja arpeggioiden esikatselut valaisevat vastaavat pianonäppäimet, kun
  koskettimet ovat auki.

**Äänitys, metronomi ja MIDI:**
- **Äänitä** (punainen piste seurantapalkissa ja VA-VK:ssa) kirjoittaa
  soittamasi nuotit – VA-VK:lla, tietokoneen näppäimistöllä tai
  MIDI-näppäimistöllä – tahtiin valittuun ääneen valitulta riviltä alkaen
  nykyisessä tempossa. Kun kuvio on täynnä, uusi tyhjä kuvio lisätään nykyisen
  kappaleen vaiheen jälkeen ja tallennus jatkuu siitä. Pysäytä painamalla Äänitä
  uudelleen.
- **Metronomi** (seurantatyökalurivi ja VA-VK) napsahtaa joka neljäs rivi,
  painottuen jokaisen neljän iskun tahdin ensimmäiseen iskuun. Sen vieressä
  olevat iskuvalot vilkkuvat jokaisella iskulla toiston ja tallennuksen aikana,
  vaikka napsahdus olisi pois päältä.
- **MIDI:** valitse tulo **MIDI**-luettelosta instrumentin nimen vierestä ja
  paina **Connect MIDI**; nuotit soittavat nykyistä instrumenttia (ja ne
  kirjoitetaan seurantaan äänityksen aikana tai *Insert into tracker*
  -toiminnolla). Painikkeen vieressä oleva merkkivalo vilkkuu jokaisen saapuvan
  MIDI-viestin yhteydessä. Kun **Poly record** on käytössä, äänityksen aikana
  painetut koskettimet siirtyvät omiin ääniinsä valitusta äänestä alkaen, ja
  vapautus kirjoittaa nuotinvaihdon; kun jokainen ääni pidetään painettuna,
  vanhin kosketin luovuttaa äänensä.
- **Kuviota poistamalla:** **−**-painike **Pat +** -kohdan vieressä poistaa
  nykyisen kuvion (se kysyy ensin, onko kuviossa nuotteja). Sitä käyttäneet
  kappaleen vaiheet poistetaan ja muut numeroidaan uudelleen; vähintään yksi
  kuvio jää aina jäljelle.
- **äänenvoimakkuuden pääsäädin** on VA-VK:ssa.

**Tiedostovalikon viennit:**
| Viedä                            | Mitä se tekee                                                                                                                                                                                                                                                                                                                                                                                                        |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Tallenna .bin…`                 | Kirjoittaa editorin natiivin serialisoidun formaatin (instrumentit kaikilla modulaatioasetuksilla ja nimillä, nopeudella, patterneilla, kappaleella). Vanhemmat tallennukset latautuvat edelleen.                                                                                                                                                                                                                    |
| `Uusi sävelmä`                   | Aloittaa tyhjän sävelmän nykyisen tilalle kysyttyään ensin.                                                                                                                                                                                                                                                                                                                                                          |
| `Vie lohkot (vain tiedot)`       | Liittää instrumenttitaulukon + kuviolohkot ohjelmaan kohtaan `* = $C000`.                                                                                                                                                                                                                                                                                                                                            |
| `Vie lohkot + minipelaaja`       | Lisää koko soittimen (sid_init / sid_irq / sid_frame / sid_play_row / sid_set_voice) sekä PAL-taajuustaulukot. Viennin jälkeen sijoita `JSR sid_init` pääkoodiisi kohtaan, josta musiikin tulisi alkaa; käytä omaa IRQ-kutsua `JSR sid_frame` kerran kehystä kohden.                                                                                                                                                 |
| `Vie asm (leikepöytä)`           | Kopioi koko kokoonpanon lähdekoodin leikepöydälle.                                                                                                                                                                                                                                                                                                                                                                   |
| `Tuo GoatTracker .sng-tiedosto…` | Lataa GoatTracker 2 -kappaleen nykyisen kappaleen tilalle — katso **GoatTracker-tuonti** alla.                                                                                                                                                                                                                                                                                                                       |
| `Tuo .sid…`                      | Muuntaa PSID/RSID-sävelmän muokattavaks kappaleeksi nykyisen kappaleen tilalle — katso **.sid import** alla.                                                                                                                                                                                                                                                                                                         |
| `Vie UltimateBasiciin`           | Kirjoittaa `tune ... end` -lohkon (instrumentit, järjestysluettelo, pattern-rivit tekstinä) sekä `music play` ja lisää sen Ultimate Basic -editorin kursoriin; UB-tilan ulkopuolella se kopioi tekstin leikepöydälle. UltimateBasic-kääntäjä rakentaa soittimen, joten `music play` / `music stop` ohjaa sitä. Instrumenttien modulointi menee `imod` / `ifilt` / `igate` / `itab` -riville (Ultimate Basic 1.6.2+). |

**GoatTracker-tuonti:** **Tiedostot → Tuo GoatTracker .sng…** lataa GoatTracker
2 -kappaleen (`.sng`, GTS3–GTS5) nykyisen kappaleen tilalle. Muunnos on
likimääräinen, koska nämä kaksi seurantaa toimivat eri tavalla:
- Äänikohtaiset järjestyslistat (transponoinneineen ja toistoineen) on
  litistetty yhdeksi kolmiääniseksi kappaleeksi ja leikattu 32-rivisiksi
  kuvioiksi; identtiset kuviot jaetaan.
- Instrumentit: AD/SR, ensimmäinen aalto, porttiajastin ja kova
  uudelleenkäynnistys otetaan käyttöön; aaltotaulukosta tulee
  aalto-/arpeggio-taulukko, pulssitaulukosta PWM, suodatintaulukosta
  suodatintila, resonanssi ja katkaisupyyhkäisy ja nopeustaulukosta
  instrumenttivibrato.
- Kuviokomennot: sävellaji pois → nuotin pois, portamento → `U` / `D` (enintään
  255 riviä kohden), tempo → `F`; toneportasta tulee tavallinen nuotti. Muut
  komennot jätetään pois ja viestissä luetellaan, mikä on arvioitu tai ohitettu.
- Aaltotaulukon vapauttamasta portista tulee nuotinvaihto seuraavalla vapaalla
  rivillä. Vain ensimmäinen aliviritys tuodaan.

**.sid import:** **Tiedostot → Tuo .sid…** avaa PSID / RSID-tiedoston (vain
työpöytäsovelluksessa, se käyttää VA SID Corea). Valitse alimelodia ja sen
pituus sekunteina ja paina **Tuo**: melodia soi äänettömästi, sen SID-rekisterit
tallennetaan kehys kehykseltä ja muutetaan kappaleeksi nykyisen kappaleen
tilalle. Edistymispalkki seuraa tallennusta ja sitten *Muunnetaan…* muunnosta.
- **Huomautuksia:** nuotti on portin reuna (uudelleenviritys kahden kehyksen
  sisällä lasketaan yhdeksi nuotiksi); sävelkorkeuden muutos pidossa olevan
  portin alla, joka pysyy vähintään 5 kehystä, muuttuu uudeksi,
  uudelleenviritetyksi (legato) nuotiksi. Sävelkorkeus on nuotin pääaaltomuodon
  yleisin puolisävelaskel; NTSC-sävelmät viritetään uudelleen PAL-nuottitaulukon
  mukaisesti.
- **Rivit:** riviä alkaa täsmälleen nuottien kohdalta. Peruspituus on pisin,
  joka sopii lähes kaikille; kyseisen pituiset tai yhden kehyksen pidemmät rivit
  (funktempo, swing, tempon muutokset) asetetaan `F`-efekteillä yhden rivin
  eteenpäin.
- **Instrumentit:** AD / SR, pääaaltomuoto, pulssinleveys ja PWM, suodin
  (reititys, moodi, resonanssi, katkaisupyyhkäisy) ja nuotin jokaisen kehyksen
  aaltomuoto ja sävelkorkeus seuraavaan kehykseen asti: aalto-/arpeggio-taulukko
  (etuliite ja toistuva silmukka, jopa 32 askelta). Kiinteäsävelkorkeuksinen
  rumpuatakti pitää absoluuttiset nuotit ja arpeggio suhteelliset nuotit, jotka
  on määrätty saman äänen kaikkien nuottien perusteella; tavallisesta alle
  puolisävelaskeleen huojunnasta tulee instrumentin vibrato. Gatesta tulee
  nuotin leikkaus, gate-ajastin (kova uudelleenkäynnistys, kun ADSR nollataan)
  tai decay vapautusnopeudella. Identtiset instrumentit jaetaan, jopa 128
  kappaleeseen asti.
- Viestissä luetellaan, mitä on arvioitu, esimerkiksi diat, joista tulee
  puolisävelaskeleita, tai taulukot, jotka ovat pidempiä kuin 32 askelta.
  RSID-sävelmiä, jotka alkavat BASIC-ohjelmana, ei tueta.
- **Suodattimen ja pulssin liike:** Suodattimen pyyhkäisy laskee koko nuotin
  yli, myös aaltomuodon hiljentymisen jälkeen, ja se päättyy, kun toinen nuotti
  käynnistää suodattimen uudelleen. Nopeasti laskeva suodintaulukko laskee, kun
  se saavuttaa tavoitteen, soittajan 127 sekunnin puitteissa kehystä kohden.
  Suodattimen LFO pomppii ääripäidensä välillä. Instrumentti säilyttää kaikkien
  nuottiensa pulssialueen. Pulssi ja suodatin käynnistyvät edelleen uudelleen
  jokaisella reititetyllä nuotilla, joten pyyhkäisy, joka kulkee vapaasti
  useiden nuottien yli, on vain likimääräinen, ja puolisävelaskelmien välillä
  olevat sävelkorkeudet pyöristetään lähimpään.
- **Useita SID-tunnuksia:** 2SID-sävelmästä tulee kuusiääninen ja se tuo
  mukanaan toisen SID-osoitteensa. 3SID-sävelmä tuo kaksi ensimmäistä
  SID-tunnustaan, ja viesti ilmoittaa tästä.

**Soittimen ZP-käyttö:** `$02`–`$1C` (kuvio-osoittimet, kuvion offset,
lämpötila) ja `$2F` (nykyinen nopeus), sekä `$FB`–`$FD` (tick-laskuri,
rivi-indeksi, järjestyslistan sijainti). Ääni, modulaatio ja suodattimen tila
sijaitsevat `sid_state` -tiedostossa pelaajakoodin jälkeen. ZP-tavut ovat
ristiriidassa, jos pääkoodisi käyttää niitä – siirrä tarvittaessa Expert-tilan
kautta. Kahdella SID:llä pelaaja käyttää myös `$50`–`$67` (äänten 4–6
osoittimet) ja `$68`/`$69` (nykyisen äänen SID-rekisterit).

**Tunnetut rajat:**
- Soitin ja sen tila sijaitsevat kohdassa `$C000`. Kun sävelmädata ei mahdu
  niiden viereen olevan `$D000` alapuolelle, data siirtyy omaan segmenttiinsä,
  joka päättyy `$A000` alapuolelle (viedyssä asm-tiedostossa on toinen rivi `*
  =`); pidä se erillään omasta ohjelmastasi.
- Kahdella SID:llä varustettu sävelmä tarvitsee kaksinkertaisen määrän
  pattern-dataa: sen `.sid`- ja assembly-viennit sisältävät enintään 46
  patternia, ja loput jätetään pois assembly-lähdekoodissa nuotin kera. Sävelmä
  pysyy kokonaisena editorissa. **Export to UltimateBasicin** -komennossa
  kirjoitetaan vain kolme ensimmäistä ääntä nuotin kera.
- C64 `$D418` globaali äänenvoimakkuus jaetaan eri äänien kesken —
  instrumenttikohtainen äänenvoimakkuuden liukusäädin on informatiivinen;
  sustain-taso (ADSR:n `S`) on efektiivinen äänenvoimakkuus äänittäin.
- Nuotin esikatselu renderöidään taustajärjestelmässä ennen sen soimista, joten
  se alkaa hetken näppäimen painalluksen jälkeen. Jokaisella esikatselunuotilla
  on oma sirunsa, joten nuotit eivät ota ääniä toisistaan.

---

**Vie .sid (PSID)…** (Tiedostot-valikko) tallentaa sävelmän toistettavalla
`$C000`-soittimella tavallisena PSID-tiedostona — se toistetaan SID-soittimessa,
VICE:n `vsid`-ohjelmassa ja missä tahansa muussa SID-soittimessa. Kahdella
SID:llä varustettu sävelmä tallennetaan PSID v3 -muodossa toisen SID:n
osoitteella.

### SID-soitin

**SID Player** -työkalurivin painike avaa kelluvan ikkunan, joka toistaa
`.sid`-musiikkitiedostoja (PSID ja RSID), esimerkiksi HVSC-kokoelman kappaleita.

- **Soittolista:** lisää kappaleita **Lisää .sid-tiedostoilla…** tai
  pudottamalla ne ikkunaan ja napsauttamalla kappaletta toistaaksesi sen;
  **Poista** ja **Tyhjennä soittolista** siistivät listan. **Tallenna
  soittolista…** / **Avaa soittolista…** kirjoittavat ja lukevat `.sidpl`
  -tiedoston, johon kappaleet on upotettu. Lista, nykyinen kappale ja tieto
  siitä, onko ikkuna auki, muistetaan.
- **Siirto:** Toista, Tauko, Pysäytä, **Edellinen** / **Seuraava** kappale,
  **Edellinen / Seuraava osakappale** useita kappaleita sisältäville
  tiedostoille ja aikalaskuri.
- **Haku:** sijaintipalkki ja **taaksepäin/eteenpäin 10 s**; ohitettu osa
  toistuu äänettömästi.
- **Äänenvoimakkuus:** tätä nuppia käytetään yhdessä SID Editorin
  äänenvoimakkuuden pääsäätimen kanssa.
- **Puskuri:** **Asetukset → Yleiset → SID-esikatselu → SID-soittimen puskuri**
  (10, 15, 20 tai 30 s). Suurempi puskuri pysäyttää rätinän sovelluksen ollessa
  käynnissä: sävelmä renderöidään kyseisen ajan eteenpäin seuraavasta sävelmästä
  alkaen.
- **Soitin:** ikkunassa näkyy, kumpi äänitysmoottori on käynnissä (reSID tai VA
  SID Core, jossa on SID-siru); valitse se kohdasta **Asetukset → Yleiset →
  SID-esikatselu**. Molemmat suorittavat sävelmän natiivilla Rust C64 -ytimellä,
  jossa on syklintarkka 6510-prosessori, tarkka keskeytysajoitus, CIA 6526A,
  VIC-II-ajoitus huonoilla linjoilla, sprite DMA ja rasterikeskeytykset sekä
  6510 I/O -portti – joten rasteri-IRQ-, CIA-ajoitetut ja digitaaliset sävelmät
  toistetaan oikean koneen ajoituksella. 2SID- ja 3SID-sävelmät toistetaan (PSID
  v3 / v4) stereona: SID 1 vasemmalla, SID 2 oikealla, kolmas SID keskellä.
- **Satunnaistoisto:** Satunnaistoistopainike **Seuraava**-painikkeen vieressä
  toistaa soittolistan satunnaisessa järjestyksessä – mikään kappale ei toistu
  ennen kuin kaikki kappaleet on soitettu, ja **Edellinen** siirtyy taaksepäin
  satunnaisessa järjestyksessä. Asetus muistetaan.
- **Äänenvoimakkuuden normalisointi:** Spektrianalysaattorin vieressä oleva
  painike toistaa jokaisen sävelmän suunnilleen samalla äänenvoimakkuudella:
  korkeintaan 12 dB yhtä tasoa kohti nostettuna tai laskettuna ilman katkaisua.
  Sävelmän äänenvoimakkuus mitataan sen kahden ensimmäisen sekunnin aikana,
  minkä jälkeen taso seuraa sitä hitaasti. Asetus muistetaan.
- **Suosikit:** Jokaisella rivillä oleva ☆ / ★ merkitsee kappaletta; se
  säilytetään tallennettuna ja `.sidpl`-soittolistoissa.

#### HVSC (korkeajännitteinen SID-keräys)

SID Playerin työkalupalkin **HVSC**-painike avaa hakupaneelin [High Voltage SID
Collectionille](https://www.hvsc.c64.org/), joka sisältää noin 61 000
C64-sävelmää.

- **Haku:** kirjoita otsikko, säveltäjä tai kansio (`hubbard commando`,
  `games/s-z`); jokaisen sanan on täsmäävä. **Satunnaiset sävelmät** listaa 25
  satunnaista kappaletta.
- **Säveltäjä:** hakukentän vieressä oleva luettelo vaihtuu luettelosta
  **Kaikki** luetteloon **Säveltäjä**, joka hakee vain säveltäjien nimien
  perusteella (`hubbard`, `rob hubbard`, `galway`) ja listaa sävelmät säveltäjän
  mukaan. Nimi tulee sävelmän kansiosta `MUUSIKOT` -kansiossa, joten säveltäjä
  löytyy kansion nimen perusteella, joka voi olla kahva (`laxity`). Noin 4 600
  kappaleella `GAMES`- ja `DEMOS`-tiedostoissa ei ole sävellyskansiota: **All**
  löytää ne nimen tai kansion perusteella.
- **Toista / lisää / tallenna:** toistaaksesi kappaleen napsauttamalla sitä,
  **+** lisää sen soittolistaan, latauspainike tallentaa `.sid`-tiedoston.
  **Lisää kaikki tulokset** lisää jopa 100 löydettyä kappaletta.
- **Sävelmien pituudet:** HVSC tietää jokaisen alisävelmän pituuden, joten
  hakupalkki näyttää sen ja soittolista siirtyy eteenpäin, kun alisävelmä
  päättyy.
- **Mistä kappaleet tulevat:** Luettelo ja yksittäiset kappaleet ladataan
  HVSC-peilistä ensimmäisellä käyttökerralla ja säilytetään sovelluksen
  välimuistissa, joten kerran soitettu kappale toistetaan myös offline-tilassa.
  **Päivitä luettelo** hakee uusimman listan.
- **Koko kokoelma:** **Lataa koko kokoelma…** lataa virallisen HVSC-arkiston
  (noin 85 Mt) valitsemaasi kansioon ja purkaa sen siellä (noin 380 Mt); tästä
  eteenpäin pelaaja käyttää kyseistä kopiota ja toimii offline-tilassa. **Käytä
  paikallista HVSC-kansiota…** osoittaa jo olemassa olevaan kokoelmaan.

#### Spektrianalysaattori

SID Player -työkalurivin palkkipainike avaa **Spectrum**-ikkunan: LED-tyyliset
palkit vihreästä keltaiseen ja oranssiin, hitaasti häipyvät solut ja peilattu
lattia perspektiivissä. Se näyttää kaiken, mitä SID Player tai SID Editor
toistaa, kummallakin moottorilla. **Bands** asettaa 8, 16, 24 tai 32 kaistaa.
Ikkunaa voi siirtää ja sen kokoa voi muuttaa, se sulkeutuu ja avautuu uudelleen
yhdessä SID Playerin kanssa, ja se piirtää vain ollessaan auki.

SID-editorilla on oma äänikohtainen **kanavaspektri**-ikkunansa: katso
[SID-editori](#sid-editor-3-voice-tracker).

---

### Käyräeditori

Luo käyttövalmiita `.byte`-hakutaulukoita matemaattisista käyristä — sini,
easings, kolmio/saha/neliö ja pomppu. Ihanteellinen sprite-liikkeelle,
rasteritehosteille, värikierroksille tai mihin tahansa animaatioon, jota ohjaa
ennalta laskettu taulukko. Avaa **Curve Editor** -kuvakkeella yläpalkissa (SID
Editor -painikkeen vieressä).

**Käyrät:** Sini, kosini, lineaarinen, helpotus sisään/ulos/sisään/ulos (neliö-
ja kuutiokäyrä), helpotus sisään/ulos (ympyräkäyrä), kolmio, sahakäyrä, neliö ja
helpotus sisään/ulos/sisään/ulos pomppiva.

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

Jokainen kopiointi-/lisäystuloste alkaa otsikkokommentilla, joka dokumentoi
käyrän, todellisen min/max-alueen, merkintöjen määrän ja tarkan käytön (jotka
rekisteröivät kunkin taulukon syötteet).

**Esikatselu:**
- **Graafinen** — käyrä, jonka arvo on 0 **ylhäällä** ja maksimiarvo
  **alhaalla**, C64 sprite-Y / rasteri -konventiota noudattaen (eli näet sen,
  mitä taulukko käyttää laitteistolla). Graafisen alla oleva metaviiva näyttää
  tavumäärän, luotujen arvojen todellisen minimi- ja maksimiarvon sekä
  käyrän/käyrien nimen/nimien.
- **Pomppuva pallo** — animoi merkin taulukon läpi **Tempo** -tilassa (5–240
  arvoa/sek). Tempolla 50 tämä vastaa yhtä arvoa kehystä kohden PAL-tilassa (50
  Hz), eli yhtä `.wait_raster` askelta indeksiä kohden. Toista/tauko- ja
  uudelleenkäynnistyspainikkeet, viimeisten ~24 sijainnin häivytysjälki ja
  reaaliaikainen `Indeksi · Value` -lukema.

**Kopioi / Lisää:** työkalupalkin kaksi kuvaketta — **Kopioi** lisää taulukon
leikepöydälle; **Lisää editoriin** liittää taulukon (ja lukijan, jos käytössä)
lohkoina nykyiseen ohjelmaan. Uudelleen lisääminen ** korvaa** edellisen
käyräeditorin lisäyksen kaksoiskappaleiden pinoamisen sijaan (toimii lohko- ja
asiantuntijatilassa).

**Tiedostot-valikko:**
| Toiminta                   | Mitä se tekee                                                                                                                                                                                                                                                                                                                                                                                                                              |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Tallenna käyrä (.bin)…** | Tallentaa raakataulukon tavut täsmälleen samalla tavalla kuin C64 lukisi ne `INCBIN`-komennon kautta. 16-bittinen: N lo-tavua ja sitten N hi-tavua.                                                                                                                                                                                                                                                                                        |
| **Kuormituskäyrä (.bin)…** | Lataa raakataulukon tavut takaisin editoriin, tulkittuna nykyisen bittisyvyyden mukaan (16-bittinen: ensimmäinen puolisko lo, toinen puolisko hi). Ladattu taulukko näytetään sellaisenaan, kunnes jokin käyrän säätö luo uuden käyrän.                                                                                                                                                                                                    |
| **Vie demo lohkoiksi**     | Liittää täydellisen, ajettavan sprite-demon: sprite-alustus, rasterisynkronoitu pääsilmukka, upotettu taulukko ja pallosprite-data. X pyyhkäisee 0..320 8.8-kiintopisteessä `$D010` MSB:llä, kun taulukko ajaa sprite-Y:tä – täsmälleen editorin esikatselun mukaisesti. Uudelleenvienti korvaa aiemman käyräeditorin lisäyksen.                                                                                                           |
| **Vie UltimateBasiciin**   | Kirjoittaa taulukon alustettuna Ultimate Basic -taulukkona — `muuttujanimi = array(N)` (tai `array_word(N)` 16-bittiselle järjestelmälle), jota seuraa `datanimi: …` riviä — ja lisää sen UB-editorin kursoriin (UB-tilan ulkopuolella se kopioidaan leikepöydälle). Otsikosta tulee kelvollinen, pienillä kirjaimilla kirjoitettu UB-nimi; taulukko indeksoidaan muodossa `nimi[i]`. Vaatii Ultimate Basic 1.5.8+ (sisältyy pakkaukseen). |
| **Vie UltimateBasic-demo** | Tuottaa täydellisen, käyttövalmiin UB-ohjelman: pallospriten (`sprdef 0`), taulukon ja rasterisynkronoidun silmukan, joka toistaa yhden taulukkomerkinnän kehystä kohden. 8-bittiset taulukot ohjaavat spriteä **Y**, kun X pyyhkäisee väliä 0..320; 16-bittiset (0..320) taulukot ohjaavat spriteä **X**, kun Y pyyhkäisee väliä 0..200. Yli 256 merkintää sisältävät taulukot toistavat ensimmäiset 256 merkintää.                       |

** Vastaa C64:n esikatselua:** esikatselu lukee taulukon **lineaarisesti,
toistaen 0 → N-1 → 0, yksi arvo kehystä kohden**. Tarkan toiston
aikaansaamiseksi taulukkoa on ajettava samalla tavalla (indeksiä lisätään kerran
kehystä kohden, ja jaetaan taulukon pituus). Ping-pong- tai osittaisen alueen
toisto liikkuu eri tavalla, vaikka tavuarvot ovat identtiset. Katso toimivan
16-bittisen sprite-X-esimerkin tiedostosta `samples/curve-new-demo.asm`.

---

### Taulukkogeneraattori

**Taulukkogeneraattori** -työkalurivin painike (ruudukkokuvake käyräeditorin
vieressä) luo hakutaulukoita ja nopeuskoodeja. Valitse taulukkotyyppi, aseta sen
parametrit ja katso esikatselua; meta-rivi näyttää merkintöjen määrän, koon ja
arvoalueen (koodille: tavut ja arvioidut syklit / rasteriviivat).

| Tyyppi                              | Arvot                                                                                                                                      |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Näytön riviosoitteet                | kanta + 40 · rivi (mikä tahansa kanta ja rivin pituus)                                                                                     |
| Bittikarttarivin osoitteet          | pikseli Y → tavuosoite sarakkeessa 0 (8 × 8 soluasettelu)                                                                                  |
| Bittikarttapalstan siirtymät        | pikseli X → tavujen siirtymä rivin sisällä (vuokraus tai monivärinen)                                                                      |
| Pikselibittimaski                   | X → bittimaski (vuokraa / monivärinen, valinnaisesti käänteinen `JA`)                                                                      |
| Kertoo / jaa / jakojäännös vakiolla | x · k, ⌊x / k⌋, x mod k                                                                                                                    |
| Neljännesneliöt                     | ⌊(x − offset)² / 4⌋, 512 merkintää — a · b = sqr(a + b) − sqr(a − b)                                                                       |
| Vastavuoroinen                      | ⌊N / x⌋                                                                                                                                    |
| Logaritmi / eksponentiaalinen       | round(log2 x · s), round(2^(x / s))                                                                                                        |
| Bitti taaksepäin                    | kääntää tavun (tai bittiparit monivärisessä) peilatakseen spritejä ja merkkejä                                                             |
| Mukautettu lauseke                  | mikä tahansa kaava `i` (`k` = 0-pohjainen indeksi, `n` = count); `sin`, `cos`, `abs`, `min`, `max`, `round`, `floor`, `PI`, `$hex`, `%bin` |
| Nopeuskoodi: täytä / kopioi muisti  | aliohjelma; *tallennusta iteraatiota kohden* 0 = täysin auki rullattu, N = X silmukka, jossa on N tallennusta kierroksella                 |

Yli 255:n arvoista tulee **lo / hi -taulukkopari** (`label_lo`, `label_hi`) tai
`.word` -taulukko; negatiiviset arvot ovat kahden komplementti. Vaihtoehdot:
label, hex / desimaali, values per line, **Align to page** (`.align 256`,
välttää sivunvaihdon). **Copy** siirtää kokoonpanon leikepöydälle; **Insert**
lisää sen ohjelmaan (saman labelin lisääminen uudelleen korvaa edellisen kopion)
— Ultimate Basic -tilassa se lisää `array` -taulukon, jossa on `data` rivejä.
Tiedostot-valikko tallentaa taulukon myös nimellä `.bin` (alhainen tavumäärä,
sitten korkea tavumäärä) ja vie sen Ultimate Basiciin.

### Numeromuunnin

Pieni **ei-modaalinen** DEC / HEX / BIN-muunnin, joka avataan SID-soittimen
vieressä olevalla työkalupalkin painikkeella (napsauta uudelleen tai paina Esc
sulkeaksesi). Painike pysyy korostettuna, kun muunnin on näkyvissä. Se pysyy
auki, kun jatkat ohjelman muokkaamista missä tahansa tilassa.

- Kirjoita mihin tahansa kentistä **DEC**, **HEX** tai **BIN** ja kaksi muuta
  perässä. Etuliitteet `$`, `0x`, `%`, `0b` ja erotinmerkit (välilyönti, `_`)
  hyväksytään; negatiivisesta desimaaliluvusta tulee kahden komplementti
  nykyisessä leveydessä; virheellinen syöte on merkitty punaisella.
- **8 / 16 bittiä** leveys — arvo yli 255 vaihtaa automaattisesti 16-bittiseksi.
- **Bittien rivi** — napsauta bittiä sen näyttämiseksi.
- Inforivi näyttää **merkityn** arvon ja 16-bittisessä tilassa **low** ja
  **high** tavut.
- **Kopioi**-painikkeet kopioivat arvon etuliitteineen (`53280`, `$D020`,
  `%1101000000100000`).
- Vedä sitä otsikosta; se muistaa arvon, leveyden ja sijainnin ja avautuu
  uudelleen uudelleenkäynnistyksen jälkeen, jos se oli auki sulkeessasi.

---


*© 2026 Zsolt Tarczali – C64 Visual Assembler*
