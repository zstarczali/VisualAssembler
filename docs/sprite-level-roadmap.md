# Sprite Editor és Level Editor — fejlesztési lista

Állapot: `[ ]` tervezett · `[~]` folyamatban · `[x]` kész

## Sprite Editor

Jelenleg: ceruza, vonal, kör, téglalap, tükrözés, eltolás, frame-ek és animáció
(FPS, ping-pong, onion skin), multicolor, PNG import, `.bin` mentés / betöltés.

1. [x] **Metasprite** — 2×1, 1×2 vagy 2×2 sprite egy képként szerkesztve, átjárható
   határokkal; exportkor külön sprite-okra bontva, a relatív pozíciókkal.
   *Kész:* „Sprites” választó a toolbaron; a frame egy kép (pl. 48×42), sárga
   sprite-határokkal; `.bin` mentés / betöltés frame-enként a sprite-ok sorban (64 bájt
   mindegyik); „Copy bytes” címkézett részeket ad X / Y eltolással; visszavonható méretváltás.
   Teszt: `tests/sprite-metasprite.test.js`.
2. [x] **Hires réteg multicolor sprite fölé** — két egymás fölötti sprite (multicolor test +
   hires körvonal) átfedésként szerkesztve, exportkor két külön sprite.
   *Kész:* „Hires réteg” kapcsoló + Réteg választó (`_spOverlay`, `_spOv`, `_spLayer`); a
   `.bin` / Copy bytes a test után írja a réteg sprite-jait (`sprite_f1_ov_1`).
3. [x] **Hiányzó eszközök** — kitöltés (flood fill), kijelölés + mozgatás, 90°-os forgatás.
   *Kész:* `_spFloodFill`, kijelölés (`_spSel`, `_spLift` / `_spStamp`, nyilak, Delete, Esc),
   `_spRotate` (kijelölés vagy frame, mindkét irány). Teszt: `tests/sprite-tools.test.js`.
4. [x] **Tükrözött animáció egy kattintással** — a frame-ekből tükrözött változat új frame-ként.
5. [x] **PNG sprite-sheet import** — rácsra osztott képből több frame, az OKLab / dithering
   konverterrel (Hi-Res import), a sprite színkorlátaival.
   *Kész:* `#se-sheet-dialog` (`_spSheetConvert`: cella / eltolás / rés / darabszám, OKLab,
   Bayer vagy Floyd–Steinberg, színek a képből vagy a sprite-ból, csere vagy hozzáfűzés).
6. [x] **Ütközési doboz frame-enként** — téglalap a „valódi” testre; exportkor
   `x, y, szélesség, magasság` tábla.
   *Kész:* Hitbox eszköz + panel (`_spHit`, `_spBounds`), Files → Hitbox tábla másolása
   (`sprite_hit_x/_y/_w/_h`, `SPRITE_FRAMES`).
7. [x] **X / Y nagyítás előnézet** — `$D017` / `$D01D` dupla méret megjelenítése.

## Level Editor

Jelenleg: képernyők a Map Editorból, függőleges / vízszintes / rács elrendezés, sima
görgetésű előnézet, `.bin` mentés, `LEVEL` / `LEVEL_ROW` makrók.

1. [x] **Objektumréteg** — ellenfelek, tárgyak, kezdőpozíció, ajtók, kijárat elhelyezése
   ikonokkal és típusokkal; exportkor `x, y, típus` tábla `LEVEL_OBJ_*` címkékkel.
   *Kész:* „Objektumréteg” kapcsoló a toolbaron; 6 típus (Start, Enemy, Item, Door, Exit,
   Trigger) + 1 bájtos paraméter; lerakás, húzás (8 px rács, Shift = szabad), kijelölés,
   nyilak, Delete; lista az oldalsávban, markerek az áttekintőn és az előnézetben; mentés a
   `.bin` meta-ba (`objects`), undo. Export görgetési sorrendben, pálya-pixelben (16 bit):
   `LEVEL_OBJ_X_LO/HI`, `Y_LO/HI`, `TYPE`, `PARAM`, `LEVEL_OBJ_COUNT`, `LEVEL_OBJ_T_*`,
   `LEVEL_START_X/Y` — az asm exportban és a `.level` makróban is.
   Teszt: `tests/level-editor.test.js`, `tests/level-macro.test.js`.
2. [x] **Karakter-attribútumok** — karakterenként szilárd / létra / veszélyes / gyűjthető,
   színes rétegként; exportkor 256 bájtos attribútumtábla.
   *Kész:* `_lvAttr`, attribútum mód; `LEVEL_ATTR` + `LEVEL_ATTR_*` (asm export és `.level`).
3. [x] **Szomszédos képernyők illeszkedése** — figyelmeztetés, ha két szomszédos képernyő
   széle nem folytatódik, a hibás sorok kiemelésével.
   *Kész:* „Él-ellenőrzés” (`_lvEdgeIssues`: üres / nem üres vagy szilárd / nem szilárd cellák).
4. [x] **Memóriamérleg és tömörítés** — a pálya mérete, elfér-e egy címtől; opcionális
   RLE-tömörített export kicsomagoló rutinnal.
   *Kész:* Memória panel (`_lvMemInfo`, a makró `_levelBuild`-jével), `_lvRle` +
   `level_unrle` (6502, teszt a mini6502-vel).
5. [x] **Képernyőnkénti színek** — háttér / keret / multicolor színek képernyőnként,
   görgetéskor a lejátszó váltja őket.
   *Kész:* `scr.colors`, pálya kerete (`_lvBorder`); `LEVEL_SCR_BG/BORDER/MC1/MC2`,
   `LEVEL_BORDER`, `LEVEL_SCR_COLORS`; a VICE-tesztprogram csere után beállítja.
6. [x] **„Futtatás VICE-ban”** — kész, joystickkal görgethető tesztprogram a pályából
   (a `level-demo` mintájára), azonnali indítással.
   *Kész:* `_lvRunInVice` (`_lvTestProgramAsm`, a `.level` / `.incbin` blokkba közvetlenül
   kerülnek a bájtok), kamera a Start objektumnál.

## Sorrend

1. ~~Sprite Editor — metasprite~~ (kész)
2. ~~Level Editor — objektumréteg~~ (kész)
3. ~~a többi pont~~ (kész)
