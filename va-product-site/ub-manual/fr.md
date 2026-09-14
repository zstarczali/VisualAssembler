# Ultimate Basic v1.5.6 — Manuel de langue

Référence complète du langage et de l'interface de ligne de commande pour
Ultimate Basic, un langage de type BASIC qui se compile directement en code
machine 6502 pour le Commodore 64. Sortie : fichiers `.prg` (VICE ou matériel
réel), images de cartouches `.crt` et images de disque `.d64`.

Pour un bref aperçu du projet et les instructions de montage, consultez le
fichier README.md.

© 2026 Zsolt Tarczali

> La construction du compilateur `ub` et les options de ligne de commande sont
> décrites dans [README.md](README.md). Ce manuel documente le langage Ultimate
> Basic lui-même.

## Référence linguistique

### Variables et constantes

**Toutes les variables doivent être déclarées avec `var` avant utilisation.**
L'utilisation d'une variable non déclarée dans une expression, une affectation,
un compteur `for`/`loop`, un compteur `inc`/`dec`, `input` ou une instruction
`read` produit une erreur de compilation.

```basic
var x = 10               # 8-bit integer (default)
var ptr: word = $0400    # 16-bit — two zero-page bytes, usable as 16-bit address
var f: float = 3.5       # Q8.8 fixed-point — hi byte = integer, lo byte = fraction
var msg = "HELLO"        # string variable (pointer to inline PETSCII data)
var s: string = "TEXT"   # string with explicit type
var scores = array(10)   # byte array, 10 elements stored at $C000+
var moments  = array_word(8) # word array, 8 word elements stored at $C000+
const BORDER_ADDR = $D020 # compile-time constant (substituted inline, no ZP slot)
```

Les mots clés et les identifiants sont **insensibles à la casse** : `PRINT`,
`Print` et `print` sont tous valides.

| Taper                 | Largeur        | Notes                                                                                      |
| --------------------- | -------------- | ------------------------------------------------------------------------------------------ |
| `int`                 | 8 bits         | valeur par défaut pour les littéraux numériques                                            |
| `word`                | 16 bits        | deux octets ZP ; peuvent être utilisés comme adresse dans `poke`/`peek`                    |
| `float`               | Q8.8 16 bits   | octet de poids fort = partie entière (0–255), octet de poids faible = partie fractionnaire |
| `string`              | aiguille       | Paire ZP → PETSCII terminé par un caractère nul dans le segment de code                    |
| `array(N)`            | N octets       | Éléments octets ; réside à `$C000+`, pas dans ZP                                           |
| `array_word(N)`       | N×2 octets     | Éléments de mot (16 bits) ; réside à `$C000+`, et non dans ZP                              |
| `array(R, C, …)`      | ∏dims octets   | multidimensionnel (ordre des lignes) ; index `arr[r, c]`                                   |
| `array_word(R, C, …)` | ∏dims×2 octets | tableau de mots multidimensionnel (ordre par lignes)                                       |

### Mots réservés

Les identificateurs suivants sont des **mots-clés** — ils ne peuvent pas être
utilisés comme noms de variables, de constantes, de sous-programmes, de
fonctions, de paramètres ou d'étiquettes. La correspondance est insensible à la
casse (`END`, `end`, `End` sont tous confondus). L'utilisation d'un mot réservé
comme nom produit généralement une erreur déroutante (une ligne `var` ne sera
pas déclarée sans message d'erreur, ou une expression comme `for i = 1 to times`
se transforme en `Number(0)`) — choisissez donc un autre nom.

**Déclaration et flux de contrôle** `var`, `const`, `sub`, `fn`, `type`,
`endtype`, `return`, `call`, `label`, `goto`, `gosub`, `if`, `then`, `else`,
`end`, `select`, `case`, `for`, `next`, `loop`, `times`, `to`, `step`, `while`,
`repeat`, `until`, `break`, `continue`, `inc`, `dec`, `bye`, `exit`, `rem`

**Types et éléments liés aux types** `int`, `word`, `float`, `string`, `array`,
`array_word`

**Impression et E/S** `print`, `spc`, `tab`, `at`, `input`, `chr$`, `str$`,
`hex`, `bin`, `open`, `close`, `load`, `save`, `data`, `read`, `include`,
`incbin` (également `dec` — indiqué ci-dessus comme l'instruction de
décrémentation ; le même jeton est utilisé pour le format d'impression `dec(n,
width)`)

**Fonctions mathématiques et de chaînes de caractères intégrées** `abs`, `min`,
`max`, `clamp`, `sgn`, `mod`, `rnd`, `sin`, `cos`, `and`, `or`, `xor`, `not`,
`bnot`, `shl`, `shr`, `len`, `asc`, `val`, `str_to_int`, `numstr`

**Mémoire et synchronisation** `poke`, `peek`, `poke16`, `peek16`, `fill`,
`memcopy`, `drawmem`, `wait`, `raster`, `delay`, `sys`, `asm`

**Écran et texte** `cls`, `fast`, `color`, `text`, `border`, `bg`, `screen`,
`cursor`, `lowercase`, `uppercase`, `display`, `on`, `off`, `scroll`, `speed`,
`badlines`, `turbo`

**Graphismes bitmap et blocs** `graphics`, `gcls`, `flip`, `plot`, `plot4`,
`mplot`, `mline`, `mrect`, `mcircle`, `line`, `circle`, `circle4`, `rect`,
`paint`, `erase`, `pen`, `multi`, `block`

**Sprites** `sprite`, `sprdef`, `sprite_frame`, `sprite_x`, `sprite_y`,
`sprhit`, `sprbghit`, `box_hit`, `chardef`, `charset`, `expand`, `priority`

**Son et musique** `sid`, `sound`, `volume`, `music`, `play`, `pause`, `resume`,
`stop`

**Périphériques d'entrée** `getch`, `inkey`, `waitkey`, `joy`, `mouse_x`,
`mouse_x_hi`, `mouse_y`, `mouse_btn`

**Interruptions et vecteurs** `irq`, `irq_exit`, `nmi`, `nmi_exit`, `cia_timer`,
`onerr`

**Cartes et images des personnages** `map`, `map_tile`, `map_color`, `koala`,
`show`, `hide`

**REU (extension RAM)** `reu`, `reudet`, `stash`, `fetch`

**Pièges stylistiques : des noms qui *semblent* libres mais sont réservés**

Ces mots anglais courants semblent être de simples identifiants, mais sont déjà
pris en compte par l'analyseur lexical. Renommez-les pour éviter les ruptures
silencieuses :

| Réservé                                     | renommage suggéré                   |
| ------------------------------------------- | ----------------------------------- |
| `end`                                       | `stop_at`, `finish`, `last`         |
| `stop`                                      | `stop_at`, `halt`                   |
| `times`                                     | `count`, `n`, `iters`               |
| `screen`                                    | `scraddr`, `screen_addr`            |
| `border`, `bg`, `text`                      | `border_addr`, `bg_col`, `text_col` |
| `clamp`                                     | `cap`, `bound`                      |
| `line`, `circle`, `rect`                    | `ln`, `circ`, `box_r`               |
| `data`, `read`                              | `bytes`, `next_byte`                |
| `load`, `save`, `open`, `close`             | `load_file`, ...                    |
| `map`, `show`, `hide`                       | `tilemap`, `reveal`, `conceal`      |
| `play`, `pause`, `resume`, `stop`, `volume` | `play_song`, `vol`                  |
| `int`, `float`, `word`, `string`            | `n_int`, `speed_f`, `addr`, `msg`   |

Les jetons symboliques (`+ - * / = == != < > <= >= : , ; ( ) [ ] # $ % @`) ne
sont naturellement pas utilisables dans les identifiants.

### Commentaires

```basic
# hash comment
rem this is also a comment
var x = 5  # inline comment
var x = 5 : var y = 6  # colon separates statements on one line
```

### Opérateurs

```basic
x = x + 1
y = a * b - c / 2
z = x and 15             # bitwise AND
w = a or b               # bitwise OR
v = a xor b              # bitwise XOR
m = x shl 3              # shift left
n = x shr 2              # shift right
r = x mod 40             # 8-bit modulo (remainder); SEC/SBC/BCS loop
b = bnot x               # bitwise NOT: x XOR 255 (complement all 8 bits)
```

Comparaisons : `==` `!=` `<` `>` `<=` `>=` (retourne 1/0)

### Incrémenter / Décrémenter

```basic
inc x                    # x = x + 1  (INC zp — single instruction)
dec x                    # x = x - 1  (DEC zp — single instruction)
```

For `word` variables carry is handled: `inc` uses `INC lo; BNE skip; INC hi`;
`dec` uses `LDA lo; BNE skip; DEC hi; DEC lo`.

### Affectations composées

```basic
x += 5                   # x = x + 5
x -= 3                   # x = x - 3
x *= 2                   # x = x * 2
x /= 4                   # x = x / 4
x and= 15                # x = x and 15   (bitwise AND)
x or= 64                 # x = x or 64    (bitwise OR)
x xor= 255               # x = x xor 255  (bitwise XOR)
x shl= 2                 # x = x shl 2
x shr= 1                 # x = x shr 1
```

### Imprimer

```basic
print "HELLO"
print x
print x, y, "text"
print                     # blank line

print spc(5)             # print 5 space characters
print tab(20), "VALUE"  # move cursor to column 20, then print
print "A", spc(3), "B" # mix freely

print "A=" + a           # string + numeric var
print s1 + s2            # two string vars → sequential print
print "Hello " + "World" # two literals → compile-time fold
print chr$(13)           # print by PETSCII code
```

### chr$

```basic
print chr$(65)           # output character with PETSCII code 65 ('A')
var c = chr$(n)          # store byte value n in variable c
print ">" + chr$(42)     # usable in string concat
```

### Ramification

```basic
if x == 1 then
  print "YES"
else
  print "NO"
end
```

### Select / Case

```basic
select x
  case 1:
    print "ONE"
  case 2:
    print "TWO"
  else:
    print "OTHER"
end
```

La fonction `select expr` évalue l'expression une seule fois et la compare à
chaque valeur `case` dans l'ordre. Le premier bloc correspondant est exécuté,
puis le contrôle passe à l'instruction `end`. Le bloc optionnel `else:` est
exécuté si aucune correspondance n'est trouvée. Toutes les valeurs doivent être
codées sur 8 bits (0 à 255).

### Boucles

```basic
loop 5               # counted loop (5 iterations)
  print "HI"
end

times 5              # alias for loop N ... end
  print "HI"
end

loop                 # infinite loop
  x = x + 1
  if x == 5 then continue end  # skip to next iteration
  if x == 100 then break end
end

var i = 0
for i = 1 to 10      # for..next (preferred)
  if i == 5 then continue end  # skip to increment step
  print i
next

for i = 0 to 20 step 2
  print i
next i               # variable name after 'next' is optional

for i = 10 to 1 step -1     # counting down — negative constant step is supported
  print i
next

for i = 20 to 0 step -2     # terminates correctly at i = 0 (11 iterations)
  print i
next i

var i = 0
loop i = 1 to 10     # legacy loop..end syntax — identical code
  print i
end

while x < 100
  x = x + 1
end

repeat               # do-while: body runs at least once
  x = x + 1
until x == 100       # exits when condition is true
```

**Règles de direction pour `for`/`loop` :**

| Case                                                   | Comportement                                                                                                                                      |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `for i = 1 to 10` (par défaut `step +1`, `from ≤ to`)  | compte à rebours, standard                                                                                                                        |
| `for i = 0 to 20 step 2` (étape positive, `from ≤ to`) | compte de 2                                                                                                                                       |
| `for i = 10 to 1 step -1` (pas constant négatif)       | compte à rebours ; le corps s'exécute pour i = 10, 9, ..., 1                                                                                      |
| `for i = 20 to 0 step -2` (jusqu'à zéro)               | L'algorithme s'arrête à i = 0 en détectant le sous-dépassement de capacité du CAN (C=0) après la décrémentation ; il n'y a pas de boucle infinie. |
| `for i = 10 to 1` (pas d'étape, `from > to`)           | **Erreur de compilation** : `for-loop: from (10) > to (1) with default step +1 loops 0 times — use 'step -1' to count down`                       |

Le compilateur choisit l'encodage de la branche de sortie au moment de la
compilation en fonction du signe d'une constante `step` :

- Étape positive (ou valeur par défaut `+1`) → sortie lorsque `var > to` (non
  signé `CMP` + `BCC`/`BEQ` bascule vers `JMP exit`).
- Pas constant négatif → sortie lorsque `var < to` (unsigned `CMP` + `BCS` au
  corps), **plus** un post-incrément `BCS loop_top ; JMP exit` qui intercepte le
  dépassement lorsque `var` passe en dessous de 0. Cette paire d'instructions
  supplémentaires est ce qui permet à `for i = N to 0 step -k` d'être fini.

Les valeurs non constantes `step` (par exemple, provenant d'une variable ou
d'une expression) sont traitées comme positives au moment de la compilation ; si
vous avez besoin d'un compte à rebours avec une valeur d'étape d'exécution,
divisez la boucle ou utilisez une construction `while`.

### Étiquettes et aller à

```basic
label main_loop
  x = x + 1
  if x < 10 then goto main_loop end
```

Le protocole Forward `goto` (étiquette définie ultérieurement) est entièrement
pris en charge.

`gosub label` / `return` effectue un saut vers une étiquette puis un retour (JSR
/ RTS au niveau du code machine). L'étiquette doit être une instruction `label
name`, et non une instruction `sub` — elle ne comporte aucun paramètre et
partage la même portée de page zéro. `gosub` prend en charge les références
anticipées (étiquette définie après `gosub`).

```basic
gosub draw_border
...
label draw_border
  # ... draw something ...
  return               # RTS — returns to the instruction after gosub
```

### Sous-programmes

```basic
sub greet()
  print "HELLO!"
end

sub set_color(col)
  color border col
  color text   col
end

greet()              # call with parens
call greet           # call keyword (no parens)
set_color(6)
```

Les paramètres sont transmis via des emplacements dédiés de page zéro. Aucune
récursivité (emplacements statiques). Les paramètres typés sont pris en charge :
`sub draw(x, y:int)` ou `sub copy(src:string)` — les paramètres de type chaîne
reçoivent un pointeur de 2 octets permettant à l’appelé d’indexer la chaîne
source via `src[i]`.

### Fonctions (valeurs de retour)

```basic
fn square(x)
  return x * x
end

fn add(a, b)
  return a + b
end

fn clamp(val, lo, hi)
  if val < lo then return lo end
  if val > hi then return hi end
  return val
end

var s = square(9)         # s = 81  — fn call as expression
var c = clamp(joy, 0, 39) # c = clamped value
print add(10, 20)         # 30  — usable inline in print
```

Les fonctions prennent en charge un type de retour optionnel `: word` pour les
valeurs 16 bits :

```basic
fn get_addr(): word
  return $C000
end

var ptr: word = get_addr()  # ptr = $C000
poke ptr, 42                 # STA (ptr),Y — valid indirect addressing
var v = peek(ptr)            # LDA (ptr),Y
```

`fn` est émis lors de la passe 2 (comme `sub`), les corps de fonction ne sont
donc jamais exécutés au démarrage. Les références anticipées sont entièrement
prises en charge.

### Tableaux

```basic
var scores = array(8)    # 8 bytes at $C000

scores[0] = 100          # constant index → STA $C000
scores[i] = 99           # variable index → STA (ptr),Y
var v = scores[i]        # LDA (ptr),Y
print scores[2]          # usable inline in print

var moments = array_word(8)  # 16 bytes (8×2) at $C000+

moments[0] = $1234         # constant index → STA $C000 (lo), STA $C001 (hi)
moments[i] = $5678         # variable index → ASL A for stride; (ptr),Y × 2
var t: word = moments[1]   # LDA $C002, LDA $C003
```

**Tableaux multidimensionnels** (nouveauté de la version 1.5.3)

**Les tableaux peuvent être déclarés avec plusieurs dimensions. Ils sont stockés
par lignes et indexés par une liste d'indices séparés par des virgules. Leur
taille totale est le produit de leurs dimensions.**

```basic
var grid = array(8, 8)     # 8×8 = 64 bytes at $C000
grid[1, 0] = 11            # row 1, col 0 → flat index 1*8+0 = 8 → STA $C008
grid[0, 1] = 22            # row 0, col 1 → flat index 1       → STA $C001
grid[r, c] = 33            # variable → computes r*8 + c, then STA (ptr),Y
var v = grid[r, c]         # LDA (ptr),Y

var wm = array_word(4, 4)  # 4×4 word array = 32 bytes
wm[1, 2] = $ABCD           # element 1*4+2 = 6 → bytes $C00C/$C00D

const ROWS = 3
const COLS = 5
var m = array(ROWS, COLS)  # dimensions may be compile-time constants
```

L'organisation par lignes signifie que le dernier indice est contigu : `grid[r,
c]` correspond à `base + r*COLS + c`. Un nombre quelconque de dimensions est
pris en charge (`array(a, b, c)`). Lorsque tous les indices sont constants,
l'adresse est réduite à la compilation à une seule opération absolue de
lecture/écriture ; un indice variable génère le calcul `row*stride + col` et un
accès indexé `(ptr),Y`. Un seul indice dans un tableau multidimensionnel est
toujours autorisé et traité comme un index linéaire (`grid[10]`). Les dimensions
doivent être des constantes de compilation (littéraux ou `const`s), et le
tableau doit être déclaré avant d'être indexé.

**Types de structures (`type ... endtype`, nouveauté de la version 1.5.4)**

Définissez une structure fixe de champs nommés avec `type`, puis allouez un
tableau d'instances comme pour un tableau classique. L'accès aux champs utilise
`arr[idx].field` et fonctionne aussi bien pour les indices constants que
variables.

```basic
type TEntity
  var x:  int      # 1 byte
  var y:  int      # 1 byte
  var hp: word     # 2 bytes  → element size = 4
endtype

const N = 8
var enemies: TEntity = array(N)   # allocates N × 4 = 32 bytes at $C000

enemies[0].x  = 5
enemies[0].y  = 10
enemies[0].hp = $0100
var v = enemies[0].hp             # read back — LDA $C002 / LDA $C003

var i: int = 2
enemies[i].x = 42                 # variable index → idx * elem_size + offset

# Float field (Q8.8 fixed-point)
type TBall
  var bx:  int     # 1 byte
  var by:  int     # 1 byte
  var vel: float   # 2 bytes Q8.8  → element size = 4
endtype

var balls: TBall = array(3)
balls[0].vel = 1.5                # stores Q8.8: hi=1, lo=128
var f: float = balls[0].vel       # read float field into float variable
print balls[0].vel                # prints "1.50"
```

Règles et contraintes :

- Types de champs : `int` (1 octet), `word` (2 octets LE), `float` (2 octets
  Q8.8). Les champs `string` et les champs imbriqués `type` ne sont pas encore
  pris en charge.
- Taille de l'élément = somme des largeurs des champs (ordre de déclaration,
  sans remplissage).
- Le stockage se trouve à `$C000+` aux côtés des tableaux réguliers et apparaît
  dans la carte mémoire comme un tableau ordinaire de la taille totale en
  octets.
- Index constant → `LDA/STA absolute` au moment de la compilation.
- Index variable → multiplication par décalage et addition pour `idx *
  elem_size`, puis accès indexé `(ptr),Y`. Les tailles d'éléments qui sont des
  puissances de deux (1, 2, 4, 8, 16) utilisent des chaînes `ASL A` nues ; les
  autres tailles émettent une courte séquence de décalage et d'addition via deux
  octets de page zéro temporaires.
- Les paramètres sub / fn d'un type struct ne sont pas encore pris en charge —
  transmettez plutôt le tableau et un index, par exemple `sub move(idx: int) ...
  enemies[idx].x = ...`.
- Les valeurs de champ par défaut (`var fire: int = 2` à l'intérieur du type)
  sont analysées pour la compatibilité avec la proposition mais ne sont pas
  encore initialisées au moment de l'allocation.
- Un seul indice est autorisé sur un tableau de type structure ; les tableaux de
  structures multidimensionnels ne sont pas pris en charge (utilisez un index
  plat calculé).

Voir `examples/type_demo.ub`.

### Variables 16 bits (mot)

```basic
var ptr: word = $0400    # two ZP bytes: lo=$00 hi=$04
poke ptr, 6              # STA (ptr),Y
var v = peek(ptr)        # LDA (ptr),Y
```

### Graphiques bitmap

```basic
graphics on              # VIC-II hires bitmap mode (320×200, 1bpp); bitmap at $2000
graphics on multi        # VIC-II multicolor bitmap mode (160×200, 2bpp, 4 colours/cell)
graphics off             # return to text mode

gcls                     # clear bitmap (fills $2000-$3FFF) + set video matrix colors

plot x, y                # set pixel at (x, y);  x: 0-319,  y: 0-199
plot erase x, y          # clear pixel (AND ~mask)
plot xor x, y            # toggle pixel (EOR mask) — flicker-free animation
circle x, y, r           # midpoint circle centered at (x, y) with radius r; clips off-screen points
line x1, y1, x2, y2      # Bresenham line from (x1,y1) to (x2,y2); x: 0-319, y: 0-199
line erase x1, y1, x2, y2  # clear pixels along the line (AND ~mask)
line xor x1, y1, x2, y2    # toggle pixels along the line (EOR mask)
rect x1, y1, x2, y2      # draw rectangle outline (4 edges); x: 0-319, y: 0-199
rect erase x1, y1, x2, y2  # clear rectangle outline (AND ~mask)
rect xor x1, y1, x2, y2    # XOR rectangle outline (EOR mask)
paint x, y               # 4-connected flood fill from (x, y); fills clear pixels bounded by set ones

color pen c              # set the hires drawing color (0-15); see below

# ── Multicolor bitmap (graphics on multi, 160×200) ──
mplot x, y, color        # set multicolor pixel (x: 0-159, y: 0-199, color: 0-3)
mline x1, y1, x2, y2, color   # multicolor line
mrect x1, y1, x2, y2, color   # multicolor rectangle outline
mcircle x, y, r, color        # multicolor circle
```

Les deux variantes `graphics on` effacent l'affichage (`LDA $D011 / AND #$EF /
STA $D011`) lors de la commutation des registres VIC, puis le réactivent dans le
mode cible — évitent les problèmes de changement de mode.

`x` peut représenter la plage complète `0–319`. Les coordonnées supérieures à
255 sont gérées automatiquement (le 9e bit X est ajouté), de sorte que `plot`,
`line`, `circle` et `rect` atteignent toutes le bord droit de l'écran. Utilisez
une variable `word` lorsqu'une coordonnée X peut dépasser 255.

#### Couleur du dessin haute résolution — `color pen`

En mode haute résolution (320×200), la couleur est définie **par cellule 8×8**,
stockée dans la matrice vidéo (octet de poids fort = premier plan, octet de
poids faible = arrière-plan), et non par pixel. `color pen c` définit une
couleur de premier plan persistante (0-15) que `plot`, `line`, `rect`, `circle`
et `paint` appliquent à la cellule de chaque pixel qu'elles dessinent ; l'octet
d'arrière-plan de la cellule est conservé. Cette couleur reste active jusqu'à
l'appel suivant à `color pen`. La valeur par défaut est le blanc (1), de sorte
que les programmes qui n'appellent jamais `color pen` s'affichent exactement
comme avant.

```basic
graphics on
gcls
color pen 2              # red
line 0, 0, 100, 100
color pen 6              # blue
circle 160, 100, 40
display on
```

#### Formes multicolores — `mline` / `mrect` / `mcircle`

En mode multicolore (`graphics on multi`, 160×200), chaque pixel sélectionne
l'une des quatre sources de couleur via une valeur de 2 bits (`%00`
arrière-plan, `$D021`, `%01` bit de poids fort de l'écran, `%10` bit de poids
faible de l'écran, `%11` mémoire RAM couleur). `mplot` définit un pixel unique ;
`mline`, `mrect` et `mcircle` dessinent des formes de la même manière :
l'argument final `color` correspond à la source de 2 bits (0-3), et les couleurs
proprement dites proviennent de la palette de cellules (écran/RAM couleur),
exactement comme pour `mplot`.

```basic
graphics on multi
gcls
mcircle 80, 100, 40, 1
mrect 10, 10, 150, 190, 2
mline 0, 0, 159, 199, 3
display on
```

`mline`/`mrect`/`mcircle` réutilisent les mêmes routines Bresenham / point
médian que leurs homologues haute résolution, traçant chaque pixel à travers
`mplot`; les points hors écran (x ≥ 160 ou y ≥ 200) sont ignorés.

### Bitmap à double tampon (sans scintillement)

```basic
graphics on double       # double-buffered hires bitmap (320×200)
gcls                     # clears the HIDDEN back buffer
line 0, 0, 319, 199      # all drawing (plot/line/circle/rect/paint/gcls) goes to the back buffer
flip                     # show the drawn buffer; redirect drawing to the other one
graphics off             # back to text mode (restores VIC bank 0)
```

`graphics on double` conserve **deux** bitmaps haute résolution complets et
n'affiche que les images terminées, éliminant le scintillement sans aucune
astuce XOR — chaque image que vous `gcls`, dessinez, puis `flip`.

| Tampon                             | Bitmap  | Matrice vidéo | Banque VIC | `$DD00` bits de bas |
| ---------------------------------- | ------- | ------------- | ---------- | ------------------- |
| A (face avant, montrée en premier) | `$2000` | `$0400`       | banque 0   | `%11`               |
| B (arrière, tiré en premier)       | `$6000` | `$4400`       | banque 1   | `%10`               |

* Toutes les commandes de pixels écrivent via une **base de dessin** d'exécution
  (un octet de page zéro), elles ciblent donc automatiquement le tampon
  actuellement masqué.
* `flip` attend la bordure inférieure (raster ≥ 251) avant de changer la banque
  VIC, de sorte que l'échange est **sans déchirure**, puis pointe la base de
  dessin vers le tampon maintenant caché.
* Boucle typique : `gcls` → dessiner le cadre → `flip`. Appeler `display on` une
  fois après le premier `flip` afin que le premier tampon affiché soit déjà
  complet.

**Exigences / limites :**
* Résolutions uniquement (pas `multi`). Les sprites ne sont pas récupérés depuis
  la banque VIC du tampon arrière.
* Le tampon arrière utilise `$4000–$7FFF` (matrice `$4400`, bitmap
  `$6000–$7FFF`), le code machine du programme doit donc rester en dessous de
  `$4400`. La plupart des exemples ne font que quelques kilo-octets, ce qui rend
  cette opération automatique ; les programmes très volumineux ne peuvent pas
  utiliser le double tampon.
* Sur un C64 standard de 1 MHz, la valeur maximale de `gcls` (8 KB) par image
  limite la fréquence d'images ; sur le Commodore 64 Ultimate, augmentez `speed`
  pour une animation fluide à haute fréquence.

Voir `examples/cube_demo.ub` — un cube filaire 3D en rotation, rendu sans
scintillement.

### Graphiques en blocs (80×50)

```basic
graphics on block        # 80×50 block-pixel mode (text mode + custom 4-pixel charset @ $2800)
graphics off             # return to text mode
gcls                     # clear block playfield: screen RAM $0400-$07FF + color RAM $D800-$DBFF

plot4 x, y               # set block pixel at (x, y);  x: 0-79, y: 0-49
plot4 erase x, y         # clear block pixel at (x, y)
circle4 x, y, r          # draw midpoint circle in block pixels; clips to 80×50
```

Un mode basse résolution épais superposé à un texte standard 40×25. Un jeu de
caractères personnalisé de 16 caractères, copié dans `$2800`, encode une grille
de quadrants 2×2 par caractère (bit3=TL, bit2=TR, bit1=BL, bit0=BR), de sorte
que chaque cellule de texte contient 2×2 pixels de bloc → une grille effective
de 80×50. Aucune mémoire RAM bitmap n'est utilisée (`$2000-$3FFF` reste libre),
ce qui rend le rendu plus rapide qu'une image bitmap haute résolution. `plot4`
effectue un OU logique sur le bit de quadrant pour accumuler les pixels
superposés ; `plot4 erase` efface ce bit. `circle4` utilise la même fonction
auxiliaire de pixels de bloc pour dessiner un cercle de contour dans l'espace de
coordonnées 80×50. `gcls` efface la mémoire RAM écran et la mémoire RAM couleur.
Voir `examples/block_demo.ub`.

### Écran et couleur

```basic
cls                      # clear screen (KERNAL $E544)
cls fast                 # fast fill: screen RAM + color RAM + HOME

color text 14            # text color register $0286
color border 6           # $D020
color bg 0               # $D021
color pen 2              # hires drawing color (0-15) for plot/line/rect/circle/paint

screen 0, 0, 65          # write char 65 ('A') to screen RAM at col 0, row 0 ($0400)
screen 10, 5, ch         # col 10, row 5 — col/row can be variables
screen 5, 3, 42, 7       # char 42 at col 5, row 3, color 7 (writes color RAM $D800 too)
screen x, y, ch, col     # all four arguments as variables

display on               # re-enable VIC display ($D011 DEN bit)
display off              # blank display

lowercase                # CHR$(14) → switch VIC-II to lowercase/uppercase charset
uppercase                # CHR$(142) → switch VIC-II back to uppercase/graphics charset

cursor 20, 10            # move cursor to col 20, row 10 (KERNAL PLOT $FFF0)
cursor x, y              # column from variable x (0–39), row from y (0–24)

print at 20, 10, "HELLO" # cursor(20,10) + print in one statement (no trailing newline)
print at x, y, "Score:", score  # any mix of exprs
print at 0, 0            # position only (no text, no newline)

scroll x 3               # set horizontal fine scroll: $D016 bits 0-2 = 3 (0-7)
scroll y 2               # set vertical fine scroll:   $D011 bits 0-2 = 2 (0-7)
scroll x n               # value can be a variable or expression (masked to bits 0-2)
scroll x 7 narrow        # set fine scroll and force 38-column mode (hide edge column)
scroll x 0 wide          # set fine scroll and restore 40-column mode
scroll row 12 left       # shift screen RAM row 12 left by one character
```

`lowercase` émet `LDA #$0E; JSR $FFD2` à l'exécution. Les chaînes de caractères
compilées après `lowercase` voient leur casse automatiquement inversée : les
caractères sources en majuscules sont stockés dans l'emplacement PETSCII des
minuscules (`$61+`) et les caractères sources en minuscules dans l'emplacement
des majuscules (`$41+`). Ainsi, la chaîne source `"Hello World"` s'affiche comme
**Hello World** à l'écran. `uppercase`@ émet `LDA #$8E; JSR $FFD2`@ et rétablit
le mappage direct. `cls`@ ne réinitialise **pas** le mode d'encodage.

`scroll x n` écrit `(n AND 7)` dans les bits 0 à 2 de `$D016` (en préservant les
bits 3 à 7). `scroll x n narrow` écrit les bits de défilement fin et efface le
bit 3 de `$D016` (mode 38 colonnes). `scroll x n wide` écrit les bits de
défilement fin et active le bit 3 de `$D016` (mode 40 colonnes). `scroll y n`
écrit `(n AND 7)` dans les bits 0 à 2 de `$D011` (en préservant les bits 3 à 7).
`scroll row R left` décale la ligne d'écran d'une ligne vers la gauche ; le
nouveau caractère le plus à droite est écrit avec `screen 39, R, ch`. Utile pour
un défilement matériel fluide : décrémenter chaque image de 7 à 0, décaler la
RAM de l'écran, puis réinitialiser à 7.

`screen col, row, char [, color]` écrit directement dans la RAM écran (`$0400 +
row*40 + col`) et, en option, dans la RAM couleur (`$D800 + row*40 + col`).
Colonne/ligne constantes : adresse calculée à la compilation.

### Ultimate 64 — Vitesse du processeur

```basic
speed 4              # set CPU to 4 MHz  (reads $D031, updates bits 0-3, writes back)
speed 48             # 48 MHz  (maximum speed on U64)
speed max            # same as speed 48  (alias)
speed off            # back to 1 MHz  (alias for speed 1)

badlines on          # enable badline timing  ($D031 bit 7 = 0, default C64 behaviour)
badlines off         # disable badline timing ($D031 bit 7 = 1, more CPU cycles)

var t = turbo()      # 1 if turbo is active (bits 0-3 of $D031 != 0), 0 if at 1 MHz
```

Valeurs MHz disponibles : `1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 20, 24, 32, 40,
48`. Les valeurs constantes sont arrondies à la vitesse inférieure disponible la
plus proche lors de la compilation. Les valeurs variables sont traitées comme un
indice de vitesse brut (0–15) et combinées par un OU logique avec les bits 0 à 3
de `$D031`.

| $D031 index | MHz (U64) | MHz (U64 Elite-II) |
| ----------- | --------- | ------------------ |
| 0           | 1         | 1                  |
| 3           | 4         | 4                  |
| 6           | 8         | 10                 |
| 11          | 20        | 24                 |
| 15          | 48        | 64                 |

Nécessite que **U64 Turbo Control** soit réglé sur `U64 Turbo Registers` ou
`Turbo Enable Bit` dans le menu de configuration U64. Sur un C64 standard ou un
émulateur sans ce registre, les valeurs `poke` à `$D031` sont ignorées.

### Clavier

```basic
var key = getch()        # busy-wait on $FFE4 until key; returns PETSCII code
var k   = inkey()        # non-blocking: returns PETSCII code, or 0 if no key pressed
waitkey                  # wait until any key is pressed (CIA1 matrix scan; works during IRQ)
var k   = waitkey()      # same but returns raw $DC01 column bits (0 bit = key pressed)
var j = joy(2)           # read joystick port 2; returns inverted bits 0-4
var j = joy(1)           # read joystick port 1
                         # bit0=up(1) bit1=down(2) bit2=left(4) bit3=right(8) bit4=fire(16)
var mx = mouse_x()       # 1351 mouse: accumulated X position (helper: charge+delay+delta)
var my = mouse_y()       # 1351 mouse: accumulated Y position (EOR #$FF inverted)
var mb = mouse_btn()     # mouse buttons: reads $DC01 — bit0=left (fire), bit1=right (up pin)
```

**Les programmes `mouse_x()` et `mouse_y()` exécutent en interne une
sous-routine auxiliaire qui gère : la charge du condensateur CIA1 (`$DC00`), un
délai d'environ 516 cycles, la lecture des registres X/Y du potentiomètre SID
(`$D419`/`$D41A`), le calcul du delta signé sur 7 bits, l'inversion de l'axe Y
(`EOR #$FF`) et le suivi de position cumulée (état ZP permanent, 8 octets).
Cette sous-routine auxiliaire échantillonne le potentiomètre deux fois par
image. Le programme `mouse_y()` n'appelle pas cette sous-routine auxiliaire
(seul le programme `mouse_x()` le fait) ; il se contente de lire la valeur mise
en cache (`accum_y`) afin d'éviter une double mise à jour.**

L'utilitaire maintient un accumulateur X de 9 bits (`accum_x` + `accum_x_hi`
avec retenue). Utilisez `var sx: word = mouse_x()` : le compilateur stocke les
octets de poids faible et de poids fort, de sorte que la commande `sprite` gère
correctement `$D010` pour les positions X supérieures à 255.

La fonction auxiliaire stocke son état dans ZP (`$02`–`$09`). L'indicateur
d'initialisation doit être à zéro avant le premier appel ; initialisez la zone
avec `fill $02, 7, 0` dès le début de votre programme. Désactivez également les
interruptions CIA1 (`poke $DC0D, $7F`) pour éviter que l'IRQ du noyau n'affecte
`$DC00` pendant la lecture du clavier, ce qui perturbe la lecture du
potentiomètre.

Voir `examples/mouse_demo.ub` pour une démo fonctionnelle de la souris 1351 avec
suivi de sprites et retour de bouton.

### Sortie

```basic
bye                      # JSR $E544 (clear screen), clear STOP flag, RTS to BASIC
exit                     # alias for bye
```

### Timing

```basic
wait 50                  # wait 50 raster-line transitions (~3.2 ms)
wait raster 100          # spin until $D012 == 100 (raster-split effects)
delay 1                  # wait 1 PAL frame (1/50 s ≈ 20 ms)
delay 20                 # wait 20 frames ≈ 0.4 s; n can be a variable (0–255)
```

`delay N` compte N trames PAL complètes en utilisant la ligne raster 200 comme
limite de trame.

### SID Sound

```basic
sound 0, $1CAD, 25       # voice 0, freq $1CAD (≈ middle C PAL), 25 frames duration
sound 1, freq_word, 50   # voice 1, freq from word var, 50 frames (1 s at 50 Hz)
sound 2, 0, 0            # voice 2, silence

sid volume 15            # master volume full ($D418 = $0F); range 0-15
sid volume 0             # silence (master volume = 0)
sid stop                 # zero all 25 SID registers ($D400–$D418) — complete silence
```

`sound <channel>, <freq>, <duration>` — Durée en images PAL (1/50 s chacune).
ADSR fixe : attaque/décroissance `$09`, maintien/relâchement `$F0`, forme d’onde
en dents de scie. Volume principal `$D418` toujours réglé sur `$0F`.

`sid volume N` écrit N dans `$D418`. Bits 0-3 = volume (0-15), bits 4-7 = mode
de filtrage. `sid stop` émet une boucle de remplissage à zéro de 10 octets —
plus rapide que 25 insertions individuelles.

### Lecture de musique

`music play/stop/pause/resume` est une alternative de haut niveau à la
configuration manuelle `sys sid_init` / `cia_timer`. Nécessite une instruction
`load sid` préalable (définit `sid_init` / `sid_play`).

```basic
load sid "tune.sid"         # embed SID file (defines sid_init / sid_play)

music play                  # initialise sub-tune 0 + start CIA1 50 Hz IRQ
music play 1                # start from sub-tune 1 (song number 0-based)
music stop                  # stop playback + zero all 25 SID registers ($D400-$D418)
music pause                 # disable CIA1 timer A IRQ (music freezes, SID unchanged)
music resume                # re-enable CIA1 timer A IRQ (continues from pause point)
```

| Déclaration      | Effet                                                                                                               |
| ---------------- | ------------------------------------------------------------------------------------------------------------------- |
| `music play [n]` | Appelez `sid_init(n)`, configurez le temporisateur A de CIA1 à 19 656 cycles (~50 Hz PAL), installez le wrapper IRQ |
| `music stop`     | Désactiver l'IRQ CIA1 + mettre à zéro les 25 registres SID                                                          |
| `music pause`    | désactiver l'IRQ CIA1 (la sortie SID reste figée)                                                                   |
| `music resume`   | Réactivation de l'IRQ CIA1 (suite du point d'arrêt)                                                                 |

Le wrapper IRQ (émis une fois à la fin du programme) fait : ACK CIA1 timer A →
`JSR sid_play` → `JMP $EA81`.

### Sprites

```basic
sprite 0, x, y, $2000    # sprite 0: set X, Y position and data pointer
sprite 0, x, y           # without data pointer (keeps existing)
sprite on  0             # enable sprite 0 ($D015 |= bit0)
sprite off 0             # disable sprite 0 ($D015 &= ~bit0)
sprite color 0, 7        # sprite 0 color = yellow ($D027)
sprite multicolor 0, on  # enable multicolor mode for sprite 0 ($D01C |= bit0)
sprite multicolor 0, off # disable multicolor mode ($D01C &= ~bit0)
sprite expand x 0, on    # double width ($D01D |= bit0)
sprite expand x 0, off   # normal width ($D01D &= ~bit0)
sprite expand y 0, on    # double height ($D017 |= bit0)
sprite expand y 0, off   # normal height ($D017 &= ~bit0)
sprite priority 0, on    # behind background ($D01B |= bit0)
sprite priority 0, off   # in front of background ($D01B &= ~bit0)
var h = sprite_hit()     # sprite–sprite collision ($D01E, cleared on read)
var b = sprite_bg_hit()  # sprite–background collision ($D01F, cleared on read)
var x = sprite_x(0)      # read sprite 0 X position (lo byte, $D000)
var y = sprite_y(0)      # read sprite 0 Y position ($D001)
sprite_frame 0, $2000          # select one static sprite image
sprite_frame 0, $2000, frame   # select an animation frame from a frame sequence
```

X prend en charge la plage complète de 9 bits (0–319) : utilisez une variable
`word` pour les valeurs d’exécution > 255. Pointeur de données Sprite :
`data_addr` doit être aligné sur 64 octets ; stocké comme `addr >> 6` à
`$07F8+id`.

#### Sprite animation with `sprite_frame`

**La commande `sprite_frame` permet de modifier l'image affichée d'un sprite
pendant une animation. Elle modifie uniquement le pointeur de données du sprite
; elle ne déplace pas le sprite, ne l'active pas et ne fait pas défiler les
images automatiquement.**

Stockez les images d'animation consécutivement, chaque image sprite de 63 octets
occupant un emplacement aligné sur 64 octets. Transmettez l'image d'animation
indexée à partir de zéro comme troisième argument :

```basic
sprite_frame sprite_id, adresse_première_image, numéro_image
```

Par exemple, avec une adresse de base `$2000`, l'image 0 utilise `$2000`,
l'image 1 utilise `$2040`, l'image 2 utilise `$2080`, et ainsi de suite. Le
programme contrôle le rythme et le retour à la ligne de l'animation.

```basic
var frame = 0
loop
  sprite_frame 0, $2000, frame
  frame = frame + 1
  if frame == 4 then frame = 0 end
  delay 5
end
```

La forme à deux arguments, `sprite_frame id, address`, sélectionne simplement
une image sprite statique et reste compatible avec les versions précédentes. La
position du sprite est toujours contrôlée par `sprite id,x,y`.

### Collision de boîtes englobantes logicielles

```basic
var touching = box_hit(left1, top1, right1, bottom1,
                       left2, top2, right2, bottom2)
```

La fonction `box_hit()` effectue un test de boîte englobante alignée sur les
axes (AABB) et renvoie `1` si les deux rectangles se chevauchent ou se touchent,
sinon `0`. Contrairement à `sprite_hit()` et `sprite_bg_hit()`, elle ne lit ni
n'efface les registres de collision VIC-II. Les huit arguments sont des
expressions arbitraires de 8 bits ; les boîtes peuvent donc être plus petites
que les sprites visibles ou décrire des objets du jeu autres que des sprites.
Les coordonnées sont inclusives ; conservez `left <= right` et `top <= bottom`.

### Sprite definition

```basic
sprdef 0
  $00,$3C,$00,  $00,$FF,$00,  $03,$FF,$C0,  $07,$FF,$E0,
  $0F,$FF,$F0,  $0F,$FF,$F0,  $1F,$FF,$F8,  $1F,$FF,$F8,
  $1F,$FF,$F8,  $0F,$FF,$F0,  $0F,$FF,$F0,  $07,$FF,$E0,
  $03,$FF,$C0,  $00,$FF,$00,  $00,$3C,$00,  $00,$00,$00,
  $00,$00,$00,  $00,$00,$00,  $00,$00,$00,  $00,$00,$00,
  $00,$00,$00
end
```

`sprdef id ... end` intègre 63 octets de sprite à l'adresse suivante alignée sur
64 octets dans le segment de code, émet un `JMP` par-dessus et définit
automatiquement `$07F8+id = data_addr >> 6`. Pour utiliser la même forme pour
plusieurs sprites, relisez le pointeur :

```basic
var pg = peek($07F8)   # pointer set by sprdef 0
poke $07F9, pg         # copy to sprites 1–7
```

### Cartes des tuiles de personnages (`.ubmap`)

```basic
map load "levels/world.ubmap"
map draw map_x, map_y       # draw a 40x25 viewport to screen/color RAM

var tile = map_tile(x, y)   # read character code from the map
map set x, y, 42            # change character code in writable map data

var shade = map_color(x, y) # read cell color (0 when map has no color data)
map color x, y, 7           # change cell color when color data is present
```

`map load` résout le nom de fichier par rapport au fichier source `.ub`, le
valide à la compilation et intègre ses tableaux de caractères et de couleurs
(optionnels) dans la mémoire RAM du programme. Une commande `map load`
ultérieure remplace la carte active pour les commandes de carte suivantes.

`map load` accepte également une exportation VisualAssembler `me-map` `.bin`
directement :

```basic
charger la carte "map-multicolor.bin"
```

Les 1 000 premiers octets constituent la table de caractères 40×25 et les 1 000
suivants, les couleurs des cellules. Le mode multicolore et `$D021-$D023` sont
lus à partir de la balise de métadonnées VisualAssembler ; aucune conversion de
`.ubmap` n’est donc nécessaire.

La commande `map draw map_x, map_y` copie une zone d'affichage de 40×25 pixels,
commençant à la cellule de carte spécifiée, dans la mémoire RAM écran `$0400`
et, le cas échéant, dans la mémoire RAM couleur `$D800`. La carte doit contenir
l'intégralité de la zone d'affichage demandée : conservez `map_x <= width-40` et
`map_y <= height-25`. Les coordonnées et les dimensions sont actuellement codées
sur 8 bits (0–255).

Les cartes normales désactivent le bit multicolore du texte dans `$D016`. Les
cartes multicolores l'activent et chargent leurs trois couleurs globales dans
`$D021`, `$D022` et `$D023`. Les cartes de caractères contiennent des codes de
caractères, et non des pixels de jeu de caractères ; combinez-les avec
`charset`/`chardef` ou une autre méthode de chargement de jeu de caractères. En
mode texte multicolore, les couleurs des cellules 8 à 15 sélectionnent les
caractères multicolores selon les règles VIC-II.

#### Format binaire UBMP version 1

Tous les entiers multioctets sont en format petit-boutiste :

| Compenser |          Taille | Signification                                                                                |
| --------: | --------------: | -------------------------------------------------------------------------------------------- |
|         0 |               4 | Magie ASCII `UBMP`                                                                           |
|         4 |               1 | Version, actuellement `1`                                                                    |
|         5 |               1 | Indicateurs : bit 0 = présence d’une matrice de couleurs, bit 1 = mode texte multicolore     |
|         6 |               2 | Largeur de la carte, 1 à 255 cellules                                                        |
|         8 |               2 | Hauteur de la carte, 1 à 255 cellules                                                        |
|        10 |               1 | Arrière-plan 0 (`$D021`), faible grignotage utilisé                                          |
|        11 |               1 | Multicolore 1 (`$D022`), faible grignotage utilisé                                           |
|        12 |               1 | Multicolore 2 (`$D023`), faible grignotage utilisé                                           |
|        13 | largeur×hauteur | codes de caractères en ligne                                                                 |
|   suivant | largeur×hauteur | Nibbles de couleur optionnels en format ligne-major lorsque le bit d'indicateur 0 est activé |

Un fichier UBMP doit avoir la longueur exacte indiquée dans son en-tête. Toute
valeur incorrecte (magic, version, dimensions ou longueur) provoque une erreur
de compilation.

### Importation d'images Koala Painter

```basic
koala load "pictures/title.kla"  # validate and embed at compile time
koala show                       # enter bitmap multicolor mode
koala hide                       # return to the default text display
```

`koala load` accepte un fichier Koala standard de 10 003 octets (adresse de
chargement `$6000` plus 10 001 octets de données) ou une charge utile brute de
10 001 octets. Les chemins sont relatifs au fichier `.ub`. La charge utile
contient 8 000 octets bitmap, 1 000 octets d'écran, 1 000 nibbles de couleur et
un octet de couleur d'arrière-plan.

Le compilateur l'enregistre à l'adresse `$6000-$8710`. `koala show` copie
l'image bitmap à l'adresse `$2000`, la matrice d'écran à l'adresse `$0400`, les
couleurs à l'adresse `$D800` et active le mode multicolore pour l'image bitmap.
`koala hide` désactive le mode bitmap/multicolore et rétablit la disposition de
texte par défaut.

Le code généré et les fonctions auxiliaires doivent se terminer après `$2000`,
car l'image bitmap affichée écrase `$2000-$3F3F` ; sinon, le compilateur signale
une erreur. L'importation Koala ne peut actuellement pas être combinée avec
`load sid` dans le même programme.

### jeu de caractères personnalisé

```basic
charset $3800            # set base address for chardef (default $3800)

chardef 65               # redefine character 65 ('A')
  $18,$3C,$66,$7E,$66,$66,$66,$00
end

chardef 66               # fewer than 8 bytes are zero-padded
  $7C,$66,$7C,$66,$7C
end
```

`charset base` définit l'adresse de destination utilisée par toutes les
instructions `chardef` suivantes. `chardef id ... end` insère 8 octets
directement dans le segment de code (précédés d'un `JMP` pour les ignorer), puis
les copie dans `charset_base + id*8` à l'exécution. Les valeurs doivent être des
constantes de compilation ; utilisez `%` pour les littéraux binaires
(`%00011000`).

Pour activer un jeu de caractères personnalisé dans VIC-II, définissez l'adresse
du générateur de caractères via `$D018` :
```basic
charset $3800
chardef 1  $FF,$81,$81,$81,$81,$81,$81,$FF  end  # box border
poke $D018, $1A     # screen at $0400, charset at $3800 (bank 0)
```

### Mémoire

```basic
poke $D020, 2            # STA $D020
poke addr_var, 6         # STA (addr_var),Y  — if addr_var is word type
var v = peek($D012)      # LDA $D012
var v = peek(addr_var)   # LDA (addr_var),Y  — if addr_var is word type

var w: word = peek16($C000)   # read 16-bit little-endian: lo=$C000, hi=$C001
poke16 $0314, $EA81           # write 16-bit little-endian: lo→$0314, hi→$0315
poke16 ptr, w                 # word var as address; word var as value
```

`peek16(addr)` lit deux octets consécutifs (lo, hi) comme un `word`. `poke16`
écrit lo puis hi.

### E/S disque

```basic
load "PROGRAM"           # KERNAL LOAD: loads file from device 8 to its native address
load "DATA", $C000       # loads file to a specific address
load "DATA", ptr         # addr from word variable

save "DATA", $C000, 4096 # KERNAL SAVE from $C000, 4096 bytes → device 8
save "PROG", start, len  # addr and len from word/int variables
```

`load` appelle KERNAL `SETNAM`+`SETLFS`+`LOAD` (`$FFBD`/`$FFBA`/`$FFD5`). Sans
adresse : adresse secondaire 0 (l’en-tête de 2 octets du fichier est utilisé
comme adresse de chargement). Avec adresse : adresse secondaire 1 (fichier
chargé à l’emplacement spécifié). `save` appelle `SETNAM`+`SETLFS`+`SAVE`
(`$FFBD`/`$FFBA`/`$FFD8`). Nécessite `addr` et `len`.

### Musique SID

```basic
load sid "tune.sid"            # embed SID music at its native load address
load sid "tune.sid", $2000     # override: embed at $2000 regardless of SID header
```

`load sid` lit un fichier PSID ou RSID à la **compilation**, supprime l'en-tête
et ajoute les octets musicaux bruts à la sortie `.prg`. Après `load sid`, deux
constantes de compilation deviennent disponibles :

| Constante  | Description                                                                                                 |
| ---------- | ----------------------------------------------------------------------------------------------------------- |
| `sid_init` | Adresse de la routine d'initialisation — appel unique avec A = numéro de chanson (à partir de 0)            |
| `sid_play` | Adresse de la routine de lecture — appel de chaque trame (PAL 50 Hz) depuis un gestionnaire d’interruption. |

Les deux constantes fonctionnent partout où une adresse constante est acceptée :
`sys`, `irq`, `poke`, expressions.

**Utilisation typique :**

```basic
load sid "music.sid"

sub music_irq()
  poke $D019, $FF       # ACK VIC raster IRQ
  sys sid_play          # advance one frame of music
  irq_exit              # JMP $EA81: restore A/X/Y + RTI (proper IRQ exit)
end

sys sid_init, 0         # initialise SID chip: A=0 → first sub-tune
irq music_irq, $C0      # raster IRQ at line $C0 → 50 Hz on PAL

sid volume 15           # master volume on
```

**Remarques :**
- Les données SID sont placées **après** tout le code généré, complétées par des
  zéros jusqu'à l'adresse de chargement. Le compilateur signale tout risque de
  chevauchement entre l'adresse de chargement SID et du code généré.
- Les versions 1 et 2 de PSID sont prises en charge. Si l'adresse de chargement
  de l'en-tête SID est 0, les deux premiers octets de données sont utilisés
  comme adresse (format PRG, petit-boutiste).
- Un seul `load sid` par programme est significatif (le dernier l'emporte).

### Entrées/sorties de fichiers sur canal série

```basic
open 1, 8, 2, "MYFILE"  # open logical file 1, device 8, secondary 2, name "MYFILE"
open 2, 4, 7             # open printer (device 4), no filename
open ch, dev, sec        # channel, device, secondary from variables

print# 1, "HELLO"        # send "HELLO"+CR to logical file 1
print# ch, x, "text"     # any mix of vars, strings — same as print but to file

close 1                  # close logical file 1
close ch                 # channel from variable
```

`open` appelle `SETNAM` ($FFBD) + `SETLFS` ($FFBA) + `OPEN` ($FFC0). Sans nom de
fichier, SETNAM est appelé avec une longueur de 0. `print#` achemine la sortie
via `CHKOUT` ($FFC9), CHROUT caractère par caractère (+ retour chariot final),
puis `CLRCHN` ($FFCC). `close` place le numéro de canal dans A et appelle
`CLOSE` ($FFC3).

### Input

```basic
input score              # read up to 3 digits from keyboard → 8-bit int var
input "Name: ", name     # optional prompt string, then read line → string var
input "Score: ", score   # prompt + int input
```

`input` utilise KERNAL BASIN (`$FFCF`) pour bloquer, écho l'entrée de ligne avec
prise en charge DEL.
- **Variable entière** : accepte uniquement `0`–`9`, max 3 caractères ;
  convertit en valeur 8 bits sur CR.
- **Variable de type chaîne** : accepte jusqu’à 30 caractères ; stocke sous
  forme de chaîne terminée par un caractère nul ; paire ZP mise à jour.

### Flottant / Virgule fixe

Les variables `float` utilisent le format à virgule fixe Q8.8 : l'octet de poids
fort est la partie entière (0–255) et l'octet de poids faible est la partie
fractionnaire (0/256 … 255/256).

```basic
var f: float = 3.5       # 3.5 → hi=3, lo=128 (= 0x0380)
var g: float = 0         # integer 0 is promoted to 0.0 automatically

f = 1.5                  # Q8.8 literal assignment
f = f + 1.5              # 16-bit Q8.8 arithmetic (result: 3.0)
f = f + g                # float + float

var n = int(f)           # extract integer part (hi byte) → 8-bit int
print f                  # prints as "N.DD" (e.g. 3.5 → "3.50", 1.25 → "1.25")
```

| Opération           | Exemple              | Notes                                                    |
| ------------------- | -------------------- | -------------------------------------------------------- |
| Littéral            | `3.5`, `0.25`, `1.0` | analysé comme Q8.8 lors de la compilation                |
| Promotion entière   | `f = 5`              | magasins 5.0 (hi=5, lo=0)                                |
| Ajouter/sous-titrer | `f + 1.5`, `f - g`   | Arithmétique Q8.8 sur 16 bits                            |
| Extraire int        | `int(f)`             | Renvoie l'octet de poids fort sous forme d'entier 8 bits |
| Imprimer            | `print f`            | format « N.DD », toujours 2 chiffres après la virgule    |

**Attention :** Le dépassement de capacité arithmétique est limité à 255,255
(pas de saturation). La multiplication et la division de deux variables
flottantes ne sont pas encore prises en charge ; utilisez `int()` +
l’arithmétique entière dans ces cas.

### fonctions mathématiques

```basic
var a = abs(x - 20)      # two's-complement absolute value
var b = min(x, 39)       # 8-bit minimum
var c = max(x, 0)        # 8-bit maximum
var s = sgn(score)       # 0 = zero, 1 = positive (1–127), $FF = negative (128–255)
var r = rnd()            # LCG pseudo-random 0-255; seed from raster line
var r = rnd(10)          # LCG pseudo-random 0-9 (rnd() mod n; result 0..n-1)
var s = sin(angle)       # sine: angle 0-255 (full circle), returns 0-255 (center=128)
var c = cos(angle)       # cosine = sin(angle+64)
var v = clamp(x, 0, 39)  # 8-bit unsigned clamp: result = max(lo, min(hi, val))

print hex(n)             # print as 2-digit uppercase hex
print bin(n)             # print as 8-bit binary string
```

### Fonctions de chaînes de caractères

```basic
var n = len(msg)         # length of null-terminated string var (0–255)
var c = asc(msg)         # PETSCII code of first character (0 if empty)
var c = asc("A")         # compile-time: constant PETSCII code
var n = val(s)           # runtime: parse decimal PETSCII string → 8-bit int (e.g. "042" → 42)
var c = msg[i]           # string character at index i: PETSCII code of msg[i]
msg[i] = c               # write PETSCII byte c to string at index i — STA (ptr),Y
msg[0] = 72              # constant index → LDY #0; STA (ptr),Y
```

### formatage des nombres

```basic
print hex(n)             # print as 2-digit uppercase hex
print bin(n)             # print as 8-bit binary string
print dec(n, 4)          # right-justified decimal in a field of 4 chars (e.g. 42 → "  42")
print dec(n, width)      # width can also be a variable
```

`dec(n, width)` ajoute des espaces à gauche du nombre pour atteindre `width`
caractères. Si le nombre comporte plus de chiffres que `width`, il est affiché
sans ajout d'espaces (pas de troncature). Dans un contexte autre que
l'affichage, `dec(n, w)` est évalué à `n` sans modification (comme `hex`/`bin`).

### REU (unité d'extension RAM)

```basic
var ok = reu_present()   # 1 if REU detected, 0 if not (write/read test on $DF04)
var ok = reudet()        # alias for reu_present()

reu stash c64addr, bank, reu_addr, len  # copy C64 → REU
reu fetch c64addr, bank, reu_addr, len  # copy REU → C64
reu swap  c64addr, bank, reu_addr, len  # swap between C64 and REU
```

`reu_present()` effectue un test d'écriture/lecture sur le registre REU `$DF04`.
Sans REU, l'écriture est impossible (bus ouvert), la lecture est donc différente
; cela permet de détecter la présence de manière fiable sans modifier aucun
registre de commande susceptible d'avoir un effet de bord.

| Paramètre  | Largeur | Notes                                                                   |
| ---------- | ------- | ----------------------------------------------------------------------- |
| `c64addr`  | 16 bits | Démarrage de la RAM du C64 — constante, `word` var ou expression 8 bits |
| `bank`     | 8 bits  | Numéro de banque REU (0–7 pour une unité de 512 Ko)                     |
| `reu_addr` | 16 bits | Compensation au sein de la banque REU                                   |
| `len`      | 16 bits | Octets à transférer (`0` = 65 536 en matériel REU)                      |

Registres REU : commande `$DF01` (mise en cache `$B0` / récupération `$B1` /
échange `$B2`), adresse C64 `$DF02–$DF03`, décalage REU `$DF04–$DF05`, banque
`$DF06`, longueur `$DF07–$DF08`. Le transfert est synchrone (processeur arrêté
pendant le DMA). Nécessite un REU ou un VICE physique : **Paramètres → Matériel
→ Module d’extension RAM**.

### Utilitaires de mémoire

```basic
fill screen 32           # fill screen RAM $0400–$07FF with value 32 (space char)
fill color 1             # fill color RAM $D800–$DBFF with value 1 (white)

fill $0400, 1000, 32     # fill 1000 bytes starting at $0400 with value 32
fill addr, 256, 0        # addr can be word var
fill ptr, len_word, val  # all operands can be expressions / word vars

memcopy $C000, $0400, 256   # copy 256 bytes from $C000 → $0400
memcopy src_ptr, dst_ptr, 40 # word vars for source and destination

drawmem $C000, $0400, 8, 10, 40 # blit 8×10 rect from $C000 → screen at $0400, stride 40
drawmem src_ptr, dst_ptr, w, h, 40 # word vars for src/dst
```

Les variables `fill` et `memcopy` prennent toutes deux en charge les longueurs
de 16 bits (0 à 65 535). Utilisez les variables `word` pour les longueurs
supérieures à 255.

`drawmem src, dst, width, height, stride` copie un bloc rectangulaire 2D. `src`
est lu linéairement (lignes empilées) ; `dst` avance de `stride` octets entre
les lignes — utilisez `40` ($28) pour l’écran du C64 ou la mémoire RAM couleur
(40 colonnes). La largeur, la hauteur et le pas sont des valeurs 8 bits. `src`
et `dst` peuvent être des constantes, des `word` des variables ou des
expressions 8 bits.

### IRQ raster

```basic
irq my_handler           # raster IRQ at line 0, handler = sub name or address
irq my_handler, 100      # raster IRQ at raster line 100
irq $C800, 200           # handler at fixed address
irq addr_word            # handler address from a word variable
```

Configure une IRQ raster via le vecteur logiciel BASIC (`$0314`/`$0315`) :
désactive l’IRQ du minuteur CIA1, ACK l’IRQ VIC en attente, écrit la ligne
raster à `$D012`, active l’IRQ raster VIC (`$D01A=$01`), écrit l’adresse du
gestionnaire et réactive les interruptions.

Le gestionnaire **doit** se terminer par `sys $EA81` (fin d'interruption noyau)
— `RTS` ou `RTI` seuls corrompront la pile. Accusez réception de l'interruption
VIC au préalable :

```basic
sub my_handler()
  poke $D019, $FF      # ACK VIC IRQ
  # ... work here ...
  sys $EA81            # JMP to KERNAL end-of-IRQ
end
```

Les références anticipées sont prises en charge (`irq my_handler` avant la
définition du sous-programme).

### Gestionnaire NMI

```basic
nmi my_nmi               # set NMI vector $0318/$0319 to handler sub or address

sub my_nmi()
  # ... NMI work here ...
  nmi_exit               # JMP $FE47 — proper NMI exit (restores A/X/Y + RTI)
end
```

`nmi handler` écrit l'adresse du gestionnaire dans le vecteur NMI logiciel
(`$0318`/`$0319`). Le vecteur NMI matériel à `$FFFA` pointe vers la routine NMI
du noyau, qui effectue un branchement via `$0318`. Le gestionnaire **doit** se
terminer par `nmi_exit` (émet `JMP $FE47`) ; l'utilisation de `RTI` seul
corrompra la pile. Les références anticipées sont prises en charge.

### IRQ du minuteur CIA1

```basic
cia_timer 19656, my_handler   # CIA1 timer A: fires every 19656 cycles (~50 Hz PAL)
cia_timer period, handler      # period can be a variable or expression
```

Configure le minuteur CIA1 A comme source d'IRQ périodique via le vecteur
logiciel BASIC (`$0314`/`$0315`) :
1. SEI — désactiver les interruptions
2. `$DC0D = $7F` — désactiver toutes les IRQ CIA1
3. Load 16-bit period lo→`$DC04`, hi→`$DC05`
4. Écrire l'adresse du gestionnaire à `$0314`/`$0315`
5. `$DC0D = $81` — activer l'interruption A du minuteur CIA1
6. `$DC0E = $01` — Démarrer le minuteur A en mode continu
7. CLI — réactiver les interruptions

Le gestionnaire doit se terminer par `irq_exit` (ou `sys $EA81`) et doit accuser
réception de l'IRQ CIA1 :

```basic
sub my_handler()
  poke $DC0D, $01      # ACK CIA1 timer A IRQ (read also clears it)
  # ... work here ...
  irq_exit             # JMP $EA81: restore A/X/Y + RTI
end
```

Synchronisation PAL : horloge = 985 248 Hz. Période pour 50 Hz = 985 248 / 50 =
19 705 cycles ≈ `$4CC9`. Références anticipées prises en charge.

### Gestion des erreurs

```basic
onerr goto err_handler   # set KERNAL I/O error vector ($0300/$0301) to a label

...

label err_handler
  print "I/O ERROR"
  bye
```

L'instruction `onerr goto label` écrit l'adresse de l'étiquette (lo, hi) aux
emplacements KERNAL `$0300` et `$0301`. En cas d'erreur d'E/S KERNAL (par
exemple, un échec de `load` ou `open`), le KERNAL exécute `JMP ($0300)`, qui
effectue un branchement vers l'étiquette. Les références anticipées (étiquette
définie après `onerr goto`) sont prises en charge.

### Intégration de fichiers à la compilation

```basic
incbin "sprites.bin"            # embed raw binary bytes at current code position
incbin "charset.bin", $2000     # embed at an absolute address, padding as needed
include "defs.ub"        # inline another .ub source file (lexed+parsed in place)
```

### Data / Read

```basic
data 1, 2, 3, 255        # constant byte table
read varname             # load next byte into varname (auto-declares if needed)
```

Toutes les valeurs `data` sont collectées à la compilation. Un pointeur ZP de 2
octets est automatiquement alloué et initialisé au démarrage du programme.
Chaque `read` incrémente le pointeur.

### Assemblage en ligne

```basic
sys $FFD2                # JSR $FFD2
sys $FFD2, 7             # LDA #7 ; JSR $FFD2  (pass byte value in A register)
irq_exit                 # JMP $EA81 — proper IRQ handler exit (restore A/X/Y + RTI)
asm $EA, $EA             # inline raw bytes (NOP NOP) — legacy form
asm {
  ; Full 6502 mnemonics and addressing modes
  LDA #$07               ; immediate
  STA $0286              ; absolute
  LDA $50                ; zero-page  ($50 ≤ $FF → ZP auto-selected)
  STA $0400,X            ; absolute,X indexed
  LDA ($50),Y            ; (indirect),Y
  LDA ($50,X)            ; (indirect,X)
  JSR $FFD2              ; subroutine call
  JMP $C000              ; absolute jump
  JMP ($FFFC)            ; indirect jump

  CLC
  ADC #1
  SEC
  SBC #1

  TAX                    ; implied / transfer
  ASL A                  ; accumulator (also just: ASL)
  LSR A
  ROL
  ROR

  ; Branches — operand is an absolute address; offset is computed automatically
  BNE loop               ; forward or backward branch to local label
  BEQ done

loop:
  NOP
done:
  RTS

  ; #<label / #>label — lo / hi byte of a label address
  LDA #<handler
  STA $0314
  LDA #>handler
  STA $0315

  ; * — current assembly location
  JMP *

  ; Raw hex bytes (backward-compatible with old asm { $xx ... } syntax)
  $EA $EA                ; two NOP bytes
}
```

**Modes d'adressage :**

| Syntaxe         | Mode         | Octets | Exemple                             |
| --------------- | ------------ | ------ | ----------------------------------- |
| (sans opérande) | Implicite    | 1      | `NOP`, `RTS`                        |
| `A`             | Accumulateur | 1      | `ASL A`, `LSR`                      |
| `#value`        | Immédiat     | 2      | `LDA #$07`                          |
| `$zz` (0–255)   | Page zéro    | 2      | `LDA $50`                           |
| `$zz,X`         | ZP,X         | 2      | `LDA $50,X`                         |
| `$zz,Y`         | ZP,Y         | 2      | `LDX $50,Y`                         |
| `$xxxx`         | Absolu       | 3      | `LDA $0400`                         |
| `$xxxx,X`       | Absolu,X     | 3      | `LDA $0400,X`                       |
| `$xxxx,Y`       | Absolu,Y     | 3      | `LDA $0400,Y`                       |
| `($xxxx)`       | Indirect     | 3      | `JMP ($FFFC)`                       |
| `($zz,X)`       | (Indirect,X) | 2      | `LDA ($50,X)`                       |
| `($zz),Y`       | (Indirect),Y | 2      | `LDA ($50),Y`                       |
| `label`         | Relatif      | 2      | `BNE label` (succursales seulement) |

- `$zz` (1 à 2 chiffres hexadécimaux, valeur ≤ 255) sélectionne la page zéro si
  l'instruction le prend en charge ; sinon, le mode absolu est automatiquement
  appliqué. Utilisez `$00xx` (4 chiffres) pour forcer le mode absolu.
- Les opérandes de branchement sont des adresses absolues ; le décalage relatif
  en octets est calculé automatiquement.
- Les étiquettes locales (`name:`) sont limitées au bloc `asm { }`. Les branches
  futures sont résolues lors de la deuxième passe.
- `#<label` / `#>label` renvoient l'octet de poids faible / élevé de l'adresse
  d'une étiquette.
- `*` donne l'adresse de l'instruction actuelle, donc `JMP *` s'assemble comme
  une boucle sur elle-même.
- Les lignes commençant par `$`, `%` ou un chiffre sont émises sous forme
  d'octets bruts (rétrocompatibles).
- À l'intérieur de `asm { }`, les commentaires sont `;` ou `//` jusqu'à la fin
  de la ligne. (`#` est le préfixe immédiat, et non un commentaire.)

**Mélange de `asm { }` avec des paramètres de sous-routine**

Les noms des paramètres ne sont **pas accessibles** à l'intérieur des blocs `asm
{ }`. Utilisez les instructions UltimateBasic pour déplacer les valeurs vers des
emplacements connus avant le bloc `asm { }` :

```basic
sub set_colors(border_col, bg_col)
  poke $D020, border_col   # UltimateBasic resolves the ZP address
  poke $D021, bg_col
  asm {
    ; values are already in $D020 / $D021
    LDA $D020
  }
end
```

Pour les routines entièrement écrites en assembleur — notamment les
gestionnaires d'interruptions qui doivent s'interférer entre eux — placez tous
les gestionnaires dans un **unique bloc `asm { }` de niveau supérieur** dans le
programme principal. Les étiquettes d'un même bloc partagent la même portée ;
ainsi, `irq1` et `irq2` peuvent se référencer librement. Voir
`examples/raster_irq_demo.ub`.

### Chaîne ↔ entier

```basic
numstr score, $0340      # writes "042\0" at $0340 (always 3 digits, zero-padded)
var n = str_to_int("42") # compile-time: Expr::Number(42)

print str$(score)                # print 8-bit int as 3-digit decimal string ("000"–"255")
print "Score: " + str$(score)   # usable in string concat print context
var s: string = str$(n)          # assign str$() result to a string var (shared static buffer)
```

La fonction `str$(n)` convertit une valeur 8 bits en une chaîne décimale de 3
caractères (toujours 3 chiffres avec des zéros non significatifs, par exemple :
`5` → `"005"`, `42` → `"042"`, `255` → `"255"`), suivie d’un caractère nul. Le
pointeur vers le résultat est stocké dans une paire ZP permanente allouée à la
compilation.

> **Remarque :** `str$(n)` utilise une seule mémoire tampon statique partagée de
> 4 octets. Un nouvel appel à `str$(n)` écrase le résultat précédent. Pour
> afficher simultanément plusieurs valeurs, utilisez `numstr` afin d’écrire à
> des adresses absolues distinctes.

## Exemples

| Déposer                             | Description                                                                                         |
| ----------------------------------- | --------------------------------------------------------------------------------------------------- |
| `examples/features.ub`              | const, label/goto, poke/peek, rnd, fonctions mathématiques                                          |
| `examples/new_features.ub`          | sous-paramètres, tableaux, variables de mots, variables de chaînes de caractères                    |
| `examples/bitmap_demo.ub`           | Image bitmap 320×200, tracé, affichage graphique activé/désactivé                                   |
| `examples/block_demo.ub`            | Graphiques de blocs 80×50, plot4, circle4, graphiques sur bloc                                      |
| `examples/joystick_demo.ub`         | lecture du joystick, mouvement des sprites                                                          |
| `examples/mux_demo.ub`              | Multiplexeur de sprites raster (3 fenêtres × 8 sprites = 24)                                        |
| `examples/orbit_demo.ub`            | Orbite de 24 sprites avec rayon pulsant et couleurs aléatoires                                      |
| `examples/plasma_demo.ub`           | Image bitmap à effet plasma avec animation de bordure à barres raster                               |
| `examples/sprite_data.ub`           | Données de forme sprdef (incluses par d'autres démos)                                               |
| `examples/sprite_mux_orbit.ub`      | Démonstration d'orbite à 24 sprites avec sprdef + positions précalculées                            |
| `examples/sprite_orbit_demo.ub`     | 8 sprites matériels en orbite circulaire via une table sin/cos                                      |
| `examples/reu_bitmap_demo.ub`       | REU stockage/récupération avec graphismes bitmap                                                    |
| `examples/sid_music_demo.ub`        | Lecteur de musique SID avec IRQ raster et sortie clavier                                            |
| `examples/tenprint.ub`              | 5 implémentations de labyrinthe TENPRINT avec menu ; démos `lowercase` mode de jeu de caractères    |
| `examples/countdown_demo.ub`        | Compte à rebours `for..next` avec pas négatif, incl. `for i = 20 to 0 step -2`                      |
| `examples/countdown_errors_demo.ub` | Erreur de compilation pour l'étape par défaut `from > to`                                           |
| `examples/explicit_demo.ub`         | Démonstration de l'option CLI `--explicit` avec les options `var`, `sub` et `fn` entièrement typées |
| `examples/explicit_errors_demo.ub`  | Code mal structuré qui se compile sans `--explicit`, erreurs avec                                   |

## Référence CLI

```
ub build <input.ub> [OPTIONS]

  -o, --output <file>   Output .prg or .crt file (default: <input>.prg)
  -v, --verbose         Show zero-page layout and code hex dump
  --no-stub             Skip the BASIC SYS stub (code loads at $0801)
  --debug               Also produce .sym, .dbg and .vs debugger files
  --asm                 Also produce a readable 6502 codegen .asm listing
  --d64 [file]          Also produce a .d64 disk image;
                          without a filename defaults to <output>.d64
  --add <file>          Add an extra file to the .d64 disk image;
                          may be repeated for multiple files
  --explicit            Require :type on every var / sub-param / fn-param
  -h, --help            Show help
```

### Exportation CRT

Ultimate Basic peut également écrire une image de cartouche Magic Desk type-19
lorsque le nom du fichier de sortie se termine par `.crt` :

```bash
ub build demo.ub -o demo.crt
```

Le compilateur encapsule le PRG généré dans un conteneur CRT à banques,
utilisant la même structure que l'exportation CRT de VisualAssembler : un
en-tête de cartouche de 64 octets, une image Magic Desk de 8×8 Ko et un chargeur
d'amorçage dans la banque 0 qui copie la charge utile du PRG dans la RAM du C64
avant de sauter au point d'entrée du programme. Les chemins `.prg` et `.d64`
restent fonctionnels.

### Mode explicite

Passez `--explicit` pour forcer chaque site de déclaration à porter une
annotation `:type` :

```bash
ub build game.ub --explicit
```

Sans l'indicateur, Ultimate Basic accepte à la fois `var x = 5` (type déduit de
l'initialiseur ou par défaut `int`) et `var x: int = 5`. Avec l'indicateur,
seule la forme annotée est compilée ; la forme non annotée génère une erreur de
compilation.

**Ce que cela impose :**

| Formulaire de déclaration                                     | Sans `--explicit`               | Avec `--explicit`             |
| ------------------------------------------------------------- | ------------------------------- | ----------------------------- |
| `var name = expr` (pas de `:type`)                            | ok — type déduit                | erreur                        |
| `var name: int = expr` (ou mot/flottant/chaîne de caractères) | d'accord                        | d'accord                      |
| `var arr = array(N)`                                          | ok — implicitement `array`      | OK — inchangé                 |
| `var arr = array_word(N)`                                     | ok — implicitement `array_word` | OK — inchangé                 |
| `const NAME = value`                                          | d'accord                        | OK — inchangé                 |
| `sub foo(a, b)` (paramètres non typés)                        | d'accord                        | erreur par paramètre non typé |
| `sub foo(a: int, b: int)`                                     | d'accord                        | d'accord                      |
| `fn foo(a): int` (paramètre non typé)                         | d'accord                        | erreur sur le paramètre       |
| `fn foo(a: int): int`                                         | d'accord                        | d'accord                      |

Les déclarations de constantes et de tableaux sont toujours acceptées — leur
type est fixé par la forme de déclaration, donc `:type` serait redondant.

**Exemple de sortie d'erreur :**

```
$ ub build myprog.ub --explicit
Compilation errors:
  line 14: 'explicit' mode: 'var loose' has no type — use 'var loose: int|word|float|string'
  line 16: 'explicit' mode: parameter 'a' has no type — use 'a: int|word|float|string'
```

Ce paramètre est une option à activer ou désactiver lors de la compilation ;
aucune modification du code source n'est nécessaire. Ajoutez-le à votre Makefile
ou script de compilation pour imposer un style typé à l'ensemble du projet, ou
supprimez-le pour les scripts d'exploration. Voir `examples/explicit_demo.ub` et
`examples/explicit_errors_demo.ub`.

### Fichiers de débogage

Utilisez `--debug` pour générer les symboles de débogage avec le programme :

```bash
ub build demo.ub --debug
```

Le compilateur écrit les fichiers à côté de `.prg`, en utilisant la racine du
fichier de sortie :

| Déposer    | Format et finalité                                                                                                 |
| ---------- | ------------------------------------------------------------------------------------------------------------------ |
| `demo.sym` | Code source de symboles compatible avec KickAssembler, adapté à l'importation dans le code source assembleur.      |
| `demo.dbg` | Fichier de débogage KickAssembler de C64Debugger/RetroDebugger contenant le segment de programme et les étiquettes |
| `demo.vs`  | Fichier de commandes du moniteur VICE contenant les commandes `al` pour les étiquettes d'adresse                   |

Les trois exportations incluent `program_start`, `program_end`, les variables,
les tableaux, les sous-programmes et les étiquettes BASIC connues après la
génération du code. Par exemple, chargez les symboles VICE avec son option de
ligne de commande `-moncommands demo.vs` ou la commande `ll "demo.vs"` du
moniteur.

L'exportation actuelle `.dbg` fournit des informations sur les segments et les
symboles d'adresse. Elle n'inclut pas encore les correspondances entre les
instructions et les lignes de code source pour l'exécution pas à pas au niveau
du code source.

### Liste des générateurs de code assembleur (nouveauté de la version 1.5.2)

Utilisez `--asm` pour écrire une liste source 6502 lisible à côté du PRG :

```bash
ub build demo.ub --asm
```

For an output named `demo.prg`, this creates `demo.asm`. The listing is produced
from metadata collected while Ultimate Basic generates the machine code; it is
not merely a disassembly of the completed PRG. It contains:

- `; UB:` commentaires marquant la plage d'octets générée de chaque instruction
  UB émettrice ;
- constantes nommées pour les variables de page zéro et les tableaux `$C000+`, y
  compris leurs types/tailles ;
- noms et adresses définitifs des sous-programmes et des étiquettes BASIC ;
- étiquettes générées `loc_xxxx` pour les branches relatives et les cibles
  `JMP`/`JSR` dans le programme ;
- mnémoniques et opérandes 6502 normaux, avec les symboles du compilateur
  substitués lorsqu'ils sont connus ;
- l'adresse C64 exacte et les octets émis à côté de chaque instruction ;
- fonctions auxiliaires générées par le compilateur et code intégré dans leur
  ordre de mémoire final ;
- `.byte` Sortie pour les octets qui ne sont pas décodés comme des instructions
  6502 prises en charge.

Les fonctions d'assistance du compilateur reçoivent des noms descriptifs tels
que `ub_helper_plot`, `ub_helper_line_erase`, `ub_helper_print_hex` et
`ub_helper_music_irq`. Les données intégrées connues (y compris les instructions
`data`, les tableaux de caractères/couleurs, les définitions de sprites et de
caractères, la table des sinus, les noms de fichiers de chargement, les fichiers
`incbin`, la musique SID et les charges utiles Koala) sont émises sous forme de
régions nommées `.byte`. Les longs intervalles d'adresses remplis de zéros
utilisent la directive `.fill` de KickAssembler.

Exemple d'extrait :

```asm
.label x                 = $02 ; int

* = $080D

ub_start:
    cld                         ; $080D: D8
    ; UB: var x
    lda  #$01                   ; $080E: A9 01
    sta  x                      ; $0810: 85 02
```

Les commentaires d'adresse/d'octet facilitent la comparaison avec `.prg`. La
sortie utilise la syntaxe KickAssembler (`.label`, `.byte`, `.fill` et `* =
origin`) et peut donc être réassemblée ; les commentaires en code machine sont
sans incidence sur le résultat.

Le programme `--add` requiert `--d64`. Le programme compilé `.ub` est toujours
le premier fichier sur le disque ; chaque fichier `--add` est ajouté après
celui-ci. Les noms de fichiers sur le disque sont dérivés du nom du fichier
source, en majuscules (par exemple, `music.prg` → `MUSIC`).

Après une compilation réussie, le compilateur affiche toujours une carte mémoire
:

```
demo.ub → demo.prg  (386 bytes)

  Load:    $080D – $0989

  Variables (zero page):
    score    ZP:$08   byte
    lives    ZP:$0A   byte
    msg      ZP:$0C   string
    ptr      ZP:$0E   word

  Subroutines:
    greet    $0900
    show     $0912

  Arrays ($C000+):
    sprites  $C000   8 bytes
```

Avec `-v`, la sortie affiche en plus les allocations ZP internes et un dump
hexadécimal complet.

## Limitations connues

| Fonctionnalité                           | Limitation                                                                                                                                                                                    |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Arithmétique des entiers                 | 8 bits non signés (0–255) ; les variables `word` contiennent des valeurs de 16 bits                                                                                                           |
| Sous-programmes                          | Pas de récursion — les emplacements des paramètres ZP sont alloués statiquement                                                                                                               |
| Variables de type chaîne                 | Read-only after init; assignment replaces the pointer, not the data                                                                                                                           |
| Exécution de la concaténation de chaînes | `s1 + s2` s'affiche séquentiellement — sans allocation de mémoire ni suivi de longueur                                                                                                        |
| `rnd()` / `rnd(n)`                       | LCG simple, non cryptographique ; période = 256                                                                                                                                               |
| `abs()` / `sgn()` / `min()` / `max()`    | Valeurs 8 bits uniquement ; `abs`/`sgn` traitent les valeurs comme signées (bit 7 = négatif → `abs` complément à deux, `sgn` renvoie `$FF`) ; `min`/`max` sont non signées (0–255).           |
| `plot`                                   | Les pixels hors plage sont écrêtés silencieusement (Y ≥ 200 ou X ≥ 320 → aucune opération).                                                                                                   |
| `mplot`                                  | Aucune vérification des limites — x doit être compris entre 0 et 159, y doit être compris entre 0 et 199                                                                                      |
| `mline` / `mrect`                        | Multicolore ; x : 0–159, y : 0–199. Les pixels hors écran sont répétitifs (pas de découpage) — les coordonnées restent dans la plage.                                                         |
| `mcircle`                                | Multicolore ; les points hors écran (x ≥ 160 ou y ≥ 200 sont ignorés)                                                                                                                         |
| `color pen`                              | Résolution uniquement ; définit la valeur de premier plan des cellules sélectionnées (l'arrière-plan est préservé). Sans effet en mode bloc (`plot4`/`circle4`).                              |
| `rect`                                   | Aucune vérification des limites — x : 0–319, y : 0–199 ; x1≤x2 et y1≤y2 ne sont pas appliqués (les rectangles dégénérés/inversés produisent une sortie indéfinie)                             |
| `plot4`                                  | Aucune vérification des limites — x doit être compris entre 0 et 79, y doit être compris entre 0 et 49 (mode bloc)                                                                            |
| `circle4`                                | Découpe les pixels hors écran ; le rayon utile est d'environ 0 à 49 en mode bloc 80×50.                                                                                                       |
| `chr$`                                   | Aucune correspondance PETSCII↔ASCII — n est transmis tel quel à CHROUT                                                                                                                        |
| `music play`                             | Nécessite `load sid` ; un seul wrapper CIA1 est émis (le dernier `music play` l'emporte)                                                                                                      |
| `graphics on double`                     | Résolution uniquement ; utilise `$4000–$7FFF` pour le tampon arrière, le code du programme doit donc rester en dessous de `$4400` ; non compatible avec les sprites ou les couleurs multiples |
| Signalement des erreurs                  | Uniquement à la compilation ; `onerr goto` gère les erreurs d'E/S du noyau à l'exécution                                                                                                      |
