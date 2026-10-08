# Ultimate Basic v1.6.3 — Manuel de langue

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
var x = 10 # Entier 8 bits (par défaut)
var ptr: word = $0400 # 16 bits — deux octets de page zéro, utilisables comme adresse 16 bits
var f: float = 3.5 # Nombre à virgule fixe Q8.8 — octet de poids fort = entier, octet de poids faible = fraction
var msg = "HELLO" # Variable chaîne (pointeur vers des données PETSCII intégrées)
var s: string = "TEXT" # Chaîne de caractères avec type explicite
var scores = array(10) # Tableau d'octets, 10 éléments stockés à $C000+
var moments = array_word(8) # Tableau de mots, 8 éléments stockés à $C000+
const BORDER_ADDR = $D020 # Constante de compilation (substituée en ligne, sans emplacement ZP)
```

Les mots clés et les identifiants sont **insensibles à la casse** : `PRINT`,
`Print` et `print` sont tous valides.

| Taper                 | Largeur        | Notes                                                                                      |
| --------------------- | -------------- | ------------------------------------------------------------------------------------------ |
| `int`                 | 8 bits         | valeur par défaut pour les littéraux numériques                                            |
| `mot`                 | 16 bits        | deux octets ZP ; peuvent être utilisés comme adresse dans `poke`/`peek`                    |
| `float`               | Q8.8 16 bits   | octet de poids fort = partie entière (0–255), octet de poids faible = partie fractionnaire |
| `chaîne`              | aiguille       | Paire ZP → PETSCII terminé par un caractère nul dans le segment de code                    |
| `tableau(N)`          | N octets       | Éléments octets ; réside à `$C000+`, pas dans ZP                                           |
| `tableau_mot(N)`      | N×2 octets     | Éléments de mot (16 bits) ; réside à `$C000+`, et non dans ZP                              |
| `tableau(R, C, …)`    | ∏dims octets   | multidimensionnel (ordre des lignes) ; index `arr[r, c]`                                   |
| `array_word(R, C, …)` | ∏dims×2 octets | tableau de mots multidimensionnel (ordre par lignes)                                       |

#### Déclarations de style BASIC : `dim … as …`

`dim name as type` est une autre orthographe de `var name: type` — même
stockage, même code :

```basic
DIM kor AS INTEGER # entier signé 16 bits, commence à 0

DIM nev AS STRING # chaîne de caractères, commence par ""

DIM fizetes AS DOUBLE # nombre à virgule fixe Q8.8, commence à 0.00

DIM x, y AS BYTE # plusieurs noms, tous reçoivent le type

DIM pont AS INTEGER = 1000, cim AS STRING = "C64" # initialiseurs, types mixtes
```

| `comme …`                      | Type de base ultime                                      |
| ------------------------------ | -------------------------------------------------------- |
| `octet`, `entier`              | `int` (8 bits, 0–255)                                    |
| `entier`                       | Entier signé 16 bits (−32768 … 32767) — QBasic           |
| `mot`                          | `mot` (non signé 16 bits, 0–65535)                       |
| `simple`, `double`, `flottant` | `float` (Q8.8 — 0–255.99, **not** IEEE floating virgule) |
| `chaîne`                       | `chaîne`                                                 |

- Sans `= valeur`, les nombres commencent à 0 et les chaînes à `""`.
- `dim a, b as integer` donne **les deux** nomme le type (style VB.NET, pas
  QBasic). Un seul nom peut avoir un initialiseur.
- `as` et les noms de types BASIC sont des mots de contexte, non réservés — ils
  restent utilisables comme noms.
- Non pris en charge : `as long`, types struct (utilisez `var name : TName =
  array(N)`) — erreurs de compilation.
- Avec `--explicite`, un `dim` sans `as` est une erreur.
- L'affectation de chaînes de caractères a une sémantique de valeur : `s =
  "TEXT"` pointe vers la valeur littérale, `t = s` et les valeurs calculées sont
  copiées dans le tampon de `t` (voir « Chaînes de caractères à l'exécution »).
  Avant la version 1.6.3, `s = "TEXT"` stockait un octet indéfini dans le
  pointeur après la déclaration.

#### Tableaux avec `dim`: `dim name(u1, u2, …) as type`

```basic
DIM tabla(2, 3) AS INTEGER ' 3 × 4 éléments : tabla(0..2, 0..3)

DIM kocka(1, 2, 3) AS BYTE ' nombre quelconque de dimensions

DIM ar(9) AS DOUBLE ' 10 valeurs Q8.8

DIM nevek(4) AS STRING ' 5 chaînes de caractères, commençant toutes par ""

DIM v(9) ' pas de AS → tableau d'octets

tabla(2, 3) = 999 ' Index de style QBasic avec ( )

tabla[2, 3] = 999 ' … ou l'index habituel [ ]

nevek(0) = "ZSOLT"
PRINT tabla(2, 3); " "; nevek(0); " "; ar(1)
```

- Chaque borne correspond à l'indice le plus élevé (règle de base) : dim t(2, 3)
  possède 3 × 4 éléments. (var t = array(3, 4) prend le nombre d'éléments ; il
  s'agit du même tableau.)
- Types d'éléments : octet `/entier ` → 1 octet, entier ` (signé) / mot ` → 2
  octets, nombre à virgule flottante `/double `/float `/float ` → 2 octets Q8.8,
  chaîne de caractères ` → pointeur de 2 octets. Les limites doivent être des
  constantes de compilation ; les tableaux résident dans `$C000-$CFFF ` (4096
  octets, vérifiés).
- Les éléments du tableau de chaînes commencent par `""`; `nevek(i) = "TEXT"` /
  `= s` / `= a + b`, `n = nevek(i)`, l'impression, `+`, le passage à un `string`
  paramètre et `input nevek(i)` fonctionnent tous (les valeurs non littérales
  sont copiées dans un emplacement de 31 caractères par élément).
- `name(i)` l'indexation fonctionne également pour les tableaux déclarés avec
  `var a = array(…)`.
- Un tableau par groupe `dim` : `dim a(3) as byte, n as integer` est correct,
  `dim n, a(3) as integer` est une erreur. Pas d'initialiseur — utilisez `nom de
  données : …`.

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

**Musique** `tune` (mot-clé de bloc ; les lignes à l'intérieur - `speed`,
`inst`, `order`, `pat` - ne sont pas réservées)

**Types et éléments liés aux types** `int`, `word`, `float`, `string`, `array`,
`array_word`

**Impression et E/S** `print`, `spc`, `tab`, `at`, `input`, `chr$`, `str$`,
`hex`, `bin`, `open`, `close`, `load`, `save`, `chain`, `data`, `read`,
`include`, `incbin` (également `dec` — listé ci-dessus comme l'instruction de
décrémentation ; le même jeton est utilisé pour le format d'impression `dec(n,
largeur)`)

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
`sprhit`, `sprbghit`, `box_hit`, `chardef`, `charset`, `org`, `expand`,
`priority`

**Son et musique** `sid`, `sound`, `sfx`, `volume`, `music`, `play`, `pause`,
`resume`, `stop`

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

| Réservé                                          | renommage suggéré                       |
| ------------------------------------------------ | --------------------------------------- |
| `fin`                                            | `stop_at`, `finish`, `last`             |
| `stop`                                           | `stop_at`, `halt`                       |
| `fois`                                           | `compte`, `n`, `iters`                  |
| `écran`                                          | `scraddr`, `screen_addr`                |
| `bordure`, `arrière-plan`, `texte`               | `border_addr`, `bg_col`, `text_col`     |
| `pince`                                          | `cap`, `lié`                            |
| `ligne`, `cercle`, `rect`                        | `ln`, `circ`, `box_r`                   |
| `données`, `lecture`                             | `octets`, `octet_suivant`               |
| `charger`, `enregistrer`, `ouvrir`, `fermer`     | `load_file`, ...                        |
| `carte`, `afficher`, `masquer`                   | `carte de tuiles`, `révéler`, `masquer` |
| `lecture`, `pause`, `reprise`, `arrêt`, `volume` | `play_song`, `vol`                      |
| `int`, `float`, `word`, `string`                 | `n_int`, `speed_f`, `addr`, `msg`       |

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

z = x et 15 # ET bit à bit

w = a ou b # OU bit à bit

v = a ou b # OU exclusif bit à bit

m = x décalage à gauche 3 # décalage à droite

n = x décalage à droite 2 # décalage à droite

r = x mod 40 # modulo 8 bits (reste) ; x mod 0 = x, x / 0 = 255

b = bnot x # NON bit à bit : x OU exclusif 255 (complément sur les 8 bits)
```

Comparaisons : `==` `!=` `<` `>` `<=` `>=` (retourne 1/0)

Code arithmétique (1.6.0) : `*` multiplié par une constante se compile en
décalages / addition avec décalage (`x * 8` → 3× `ASL`), sinon en une boucle
d'addition avec décalage d'au maximum 8 tours. `/` et `mod` multiplié par une
puissance de deux se compilent en `LSR` / `AND #(n-1)`, sinon en une boucle de
soustraction avec décalage de 8 tours dont le temps d'exécution ne dépend plus
du quotient. La division par zéro est définie comme suit : x / 0 = 255, x mod 0
= x (avant la version 1.6.0, le programme se bloquait). x = x + 1 / x = x - 1
(et ±2) sont compilés en INC / DEC.

### Incrémenter / Décrémenter

```basic
inc x # x = x + 1 (INC zp — instruction unique)
dec x # x = x - 1 (DEC zp — instruction unique)
```

Pour les variables `word`, la retenue est gérée : `inc` utilise `INC lo ; BNE
skip ; INC hi` ; `dec` utilise `LDA lo ; BNE skip ; DEC hi ; DEC lo`.

### Affectations composées

```basic
x += 5 # x = x + 5

x -= 3 # x = x - 3

x *= 2 # x = x * 2

x /= 4 # x = x / 4

x and= 15 # x = x et 15 (ET bit à bit)
x or= 64 # x = x ou 64 (OU bit à bit)
x xor= 255 # x = x ou 255 (OU exclusif bit à bit)
x shl= 2 # x = x shl 2
x shr= 1 # x = x shr 1
```

### Imprimer

```basic
print "HELLO"
print x
print x, y, "texte"
print # ligne vide

print spc(5) # afficher 5 espaces
print tab(20), "VALEUR" # déplacer le curseur à la colonne 20, puis afficher
print "A", spc(3), "B" # mélanger librement

print "A=" + a # chaîne de caractères + variable numérique
print s1 + s2 # deux variables de type chaîne de caractères → affichage séquentiel
print "Hello " + "World" # deux littéraux → pliage à la compilation
print chr$(13) # affichage en PETSCII
```

### chr$

```basic
print chr$(65) # affiche le caractère PETSCII 65 (« A »)
var c = chr$(n) # stocke la valeur de l'octet n dans la variable c
print "&gt;" + chr$(42) # utilisable dans la concaténation de chaînes
```

### Ramification

```basic
si x == 1 alors

afficher "OUI"

sinon

afficher "NON"

fin
```

### Sélectionner / Cas

```basic
sélectionner x

cas 1 :

afficher « UN »

cas 2 :

afficher « DEUX »

sinon :

afficher « AUTRE »
```

La fonction `select expr` évalue l'expression une seule fois et la compare à
chaque valeur `case` dans l'ordre. Le premier bloc correspondant est exécuté,
puis le contrôle passe à l'instruction `end`. Le bloc optionnel `else:` est
exécuté si aucune correspondance n'est trouvée. Toutes les valeurs doivent être
codées sur 8 bits (0 à 255).

### Boucles

```basic
boucle 5 # boucle comptée (5 itérations)

afficher "Salut"
fin

fois 5 # alias pour boucle N ... fin

afficher "Salut"
fin

boucle # boucle infinie

x = x + 1

si x == 5 alors continuer fin # passer à l'itération suivante

si x == 100 alors sortir fin
fin

var i = 0
pour i = 1 à 10 # pour..suivant (préféré)

si i == 5 alors continuer fin # passer à l'incrémentation
afficher i
suivant

pour i = 0 à 20 pas 2

afficher i
suivant i # le nom de la variable après 'suivant' est facultatif

pour i = 10 à 1 pas -1 # décompte — un pas constant négatif est pris en charge

afficher i
suivant

pour i = 20 à 0 pas -2 # se termine correctement à i = 0 (11 itérations)

afficher i
suivant i

var i = 0
boucle i = 1 à 10 # Syntaxe de boucle héritée… fin — code identique

print i
fin

while x &lt; 100

x = x + 1
fin

repeat # boucle do-while : le corps s’exécute au moins une fois

x = x + 1

until x == 100 # sort lorsque la condition est vraie
```

**Règles de direction pour `for`/`loop` :**

| Cas                                                    | Comportement                                                                                                                   |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `for i = 1 to 10` (par défaut `step +1`, `from ≤ to`)  | compte à rebours, standard                                                                                                     |
| `for i = 0 to 20 step 2` (étape positive, `from ≤ to`) | compte de 2                                                                                                                    |
| `for i = 10 to 1 step -1` (pas constant négatif)       | compte à rebours ; le corps s'exécute pour i = 10, 9, ..., 1                                                                   |
| `for i = 20 to 0 step -2` (jusqu'à zéro)               | L'exécution s'arrête à i = 0 en détectant le passage en dessous de 0 après la décrémentation ; il n'y a pas de boucle infinie. |
| `for i = 10 to 1` (pas d'étape, `from > to`)           | **Erreur de compilation** : `for-loop: from (10) > to (1) with default step +1 loops 0 times — use 'step -1' to count down`    |

Forme du code (1.6.0) : la boucle est *rotée* — `JMP test` (omis lorsque les
limites constantes garantissent un premier passage), le corps, `var += étape`,
puis le test en bas se ramifiant vers le corps, il n'y a donc pas de `JMP`
supplémentaire par itération. Le pas détecte le dépassement de capacité de 8
bits dans les deux sens (`INC`/`BEQ` ou `ADC`/`BCS` en incrémentant, `BEQ`/`DEC`
ou `SBC`/`BCC` en décrémentant), de sorte que `pour i = 0 à 255` s'exécute 256
fois et s'arrête, et `pour i = N à 0, le pas -k` est toujours fini. Les limites
et les pas constants sont utilisés comme immédiats (pas de page de zéros) ; Une
limite ou un pas non constant est évalué une seule fois et conservé dans une
page zéro permanente.

Les valeurs non constantes `step` (par exemple, provenant d'une variable ou
d'une expression) sont traitées comme positives au moment de la compilation ; si
vous avez besoin d'un compte à rebours avec une valeur d'étape d'exécution,
divisez la boucle ou utilisez une construction `while`.

### Étiquettes et aller à

```basic
étiquette boucle_principale

x = x + 1

si x &lt; 10 alors aller à boucle_principale fin
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

... label draw_border

# ... dessiner quelque chose ...

return # RTS — retourne à l'instruction après gosub
```

### Sous-programmes

```basic
sub greet()

print "HELLO!"

end

sub set_color(col)

color border col

color text col
end

greet() # appel avec parenthèses
call greet # appel par mot-clé (sans parenthèses)
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

if val &lt; lo then return lo end

if val &gt; hi then return hi end

return val
end
var s = square(9) # s = 81 — appel de fonction comme expression
var c = clamp(joy, 0, 39) # c = valeur bridée
print add(10, 20) # 30 — utilisable directement dans print
```

Les fonctions prennent en charge un type de retour optionnel `: word` pour les
valeurs 16 bits :

```basic
fn get_addr(): mot

retourne $C000
fin

var ptr: mot = get_addr() # ptr = $C000
poke ptr, 42 # STA (ptr),Y — adressage indirect valide
var v = peek(ptr) # LDA (ptr),Y
```

`fn` est émis lors de la passe 2 (comme `sub`), les corps de fonction ne sont
donc jamais exécutés au démarrage. Les références anticipées sont entièrement
prises en charge.


#### Style QBasic `FONCTION` / `SOUS`

```basic
FONCTION Negyzet (szam COMME ENTIER) COMME ENTIER
    Negyzet = szam * szam ' valeur de retour = attribuer au nom de la fonction
FONCTION DE FIN

FONCTION Nagyobb (a COMME OCTET, b COMME OCTET) COMME OCTET
    Nagyobb = un
    SI b &gt; a ALORS
        Nagyobb = b
        EXIT FUNCTION ' revient maintenant, avec la valeur attribuée jusqu'à présent
    FIN SI
FONCTION DE FIN

SUB Koszont (nouveau AS STRING)
    IMPRIMER "Üdvözöllek, " ; jamais; "!"
FIN SOUS

n = Négyzet(30)
Koszont "Zsolt" 'appel sans parenthèses
Koszont("Zsolt") ' ... ou avec eux
APPELER Koszont("Zsolt")
```

- `function` est un synonyme de `fn` ; `p AS type` fonctionne dans les listes de
  paramètres et `AS type` après `)` donne le type de retour (mêmes noms de types
  que `dim`). ` : type` fonctionne toujours.
- L'affectation au nom de la fonction stocke dans une variable cachée
  `<name>__result` qui est renvoyée à `END FUNCTION` / `EXIT FUNCTION`; `return
  expr` fonctionne toujours aussi.
- `END SUB`, `END FUNCTION`, `END IF`, `END SELECT` sont acceptés (le deuxième
  mot est facultatif) ; `EXIT SUB` / `EXIT FUNCTION` retourne (un simple `exit`
  est toujours `bye`).
- Un sub/fn peut être appelé sans parenthèses : `Koszont "Zsolt"`, `Rajzol x,
  y`.
- `PRINT a; b; c` — `;` concatène les éléments sans espaces ; un `;` final
  supprime le saut de ligne. Un `;` suivi d'une instruction (`print x; y = 1`)
  sépare toujours les instructions.
- Les lettres accentuées dans les chaînes littérales s'impriment comme leur
  lettre de base (`ü` → `u`, `ő` → `o`); le jeu de caractères C64 n'a pas
  d'accents.
- Les paramètres Word/float reçoivent désormais les deux octets, et une chaîne
  littérale passée à un paramètre `string` fonctionne (auparavant, seul l'octet
  lo / une variable de chaîne fonctionnait).
- Pas de récursivité (les paramètres résident dans des emplacements statiques de
  page zéro) ; depuis la version 1.6.3, un appel récursif provoque une erreur de
  compilation au lieu de résultats incorrects silencieux.

#### Syntaxe QBasic supplémentaire (1.6.3)

Les formulaires QBasic ci-dessous se compilent à côté de la syntaxe originale
(les commentaires `==`, `end`, `loop`, `#` continuent tous de fonctionner).

```basic
Commentaire (style QBasic, comme #)

SI x = 3 ALORS AFFICHER "trois" ' une seule ligne SI : pas de FIN SI nécessaire

SI x &lt;&gt; 3 ALORS AFFICHER "non" SINON AFFICHER "oui"

SI n &lt; 0 ALORS

AFFICHER "négatif"
SINON SI n = 0 ALORS

AFFICHER "zéro"
SINON

AFFICHER "positif"
FIN SI

FAIRE TANT QUE i &lt; 10 : i = i + 1 : BOUCLE ' aussi FAIRE JUSQU'À c … BOUCLE,

FAIRE : i = i - 1 : BOUCLE JUSQU'À i = 0 ' FAIRE … BOUCLE TANT QUE c, FAIRE … BOUCLE (infini)

TANT QUE k &lt;&gt; 5 : k = k + 1 : FIN

POUR i = 1 À 100

SI i = 12 ALORS SORTIR DE LA BOUCLE ' SORTIR DE LA BOUCLE / SORTIR DE LA BOUCLE / SORTIR DE LA BOUCLE TANT QUE

SUIVANT

SÉLECTIONNER CAS n

CAS 1, 2, 3 : AFFICHER "petit"

CAS 10 À 20 : AFFICHER "adolescent"

CAS &gt; 1000 : AFFICHER "grand"

CAS SINON : AFFICHER "autre"

FIN DE LA SÉLECTION

FIN ' termine le programme (l'écran est conservé)
```

- **Conditions : ** à l’intérieur de `IF` / `ELSEIF` / `WHILE` / `UNTIL` / `LOOP
  WHILE|UNTIL`, une seule comparaison `=` est effectuée. `&lt;&gt;` signifie
  différent partout (équivalent à `!=`).
- **IF sur une seule ligne : ** Une instruction suivant immédiatement `THEN`
  crée une instruction IF sur une seule ligne qui se termine par la ligne, ou
  par un `end` sur la même ligne (`if c then x = 1 end`, comme précédemment).
  Une instruction IF sur plusieurs lignes nécessite un saut de ligne après
  `THEN`. Comme en QBasic, tout ce qui suit `THEN` sur cette ligne appartient à
  l'instruction IF (`… THEN EXIT FOR : NEXT` engloberait le `NEXT`).
- **`END` seul : ** un `END` qui ne ferme pas un bloc termine le programme,
  comme en QBasic. Un `end` en trop n'est donc plus considéré comme une erreur.
- **`DO` blocs : ** à l'intérieur d'un `DO`, un `LOOP` à la fin d'une ligne la
  ferme (les boucles originales `loop N … end` / `loop i = … end` fonctionnent
  toujours à l'intérieur).
- **`SELECT CASE`:** L'ancienne forme `select x` / `case n:` reste inchangée.
  `SELECT CASE` est simplifiée en une chaîne IF sur une variable `select__N`
  masquée.

#### Chaînes de caractères à l'exécution (1.6.3)

```basic
DIM s AS STRING, t AS STRING

s = "Pont : " + pont + "!" ' Les nombres deviennent du texte (entier signé 16 bits)

t = s ' Une copie : modifier s ultérieurement ne modifie pas t

s = s + "?"

PRINT LEFT$(s, 4); RIGHT$(s, 2); MID$(s, 7, 3); MID$(s, 7)

PRINT LEN(s + t), VAL("1234") + 1, STR$(pont)

IF s = "ABC" OR t &lt;&gt; "" THEN PRINT "comparer avec = / &lt;&gt;"
```

- **Buffers:** une variable de chaîne qui reçoit une valeur calculée (`+`,
  `gauche$`, `droite$`, `milieu$`, nombres, une autre variable) possède un
  tampon de 80 caractères ; les résultats plus longs sont coupés à 80.
  L'affectation d'une valeur littérale ne fait que pointer vers elle.
- **Tableaux de chaînes :** éléments qui reçoivent une valeur non littérale (ou
  `entrée`) obtiennent leur propre emplacement de 32 octets (31 caractères),
  donc `entrée nevek(i)` dans une boucle conserve chaque nom.
- **`STR$` / `VAL`:** `STR$` d'une valeur 16 bits ou signée ne comporte pas de
  zéros non significatifs (`"-42"`). Par souci de compatibilité, `STR$` d'un
  octet conserve sa forme à 3 chiffres (`"007"`). `VAL` lit les nombres signés
  16 bits (`VAL("1234") + 1` = 1235).
- **Comparaison : ** seulement `=` / `&lt;&gt;` (et `==` / `!=`) ; il n'y a pas
  d'ordre `&lt;` / `&gt;` des chaînes.

#### ENTIER signé, ENTRÉE, DOUBLE (1.6.3)

- **INTEGER est signé : ** `DIM x AS INTEGER ` est signé 16 bits (−32768 …
  32767, comme QBasic) : impression, `&lt;` `&gt;` comparaisons, `/` (tronque
  vers zéro), `ABS `, conversion de texte, `INPUT ` et `FOR ` boucles à travers
  zéro (`FOR i = 3 TO -3 STEP -2 `) suivent tous le signe. `WORD` reste non
  signé 0 … 65535. Le moins unaire fonctionne partout (`a &lt; -10`, `x * -2`).
- La boucle **`FOR` avec un compteur 16 bits** (`INTEGER` / `WORD`) est une
  véritable boucle 16 bits. Elle s'arrêtait à 256, donc `FOR k = 0 TO 300`
  s'exécutait 45 fois.
- **`INPUT`:** lit jusqu'à 6 caractères dans un entier/mot (avec `-` pour les
  entiers), et accepte `12.5` (deux décimales) dans un nombre à virgule
  flottante double précision. `INPUT t(i)` lit dans un élément de tableau, et
  `INPUT "prompt"; x` fonctionne également.
- Le calcul DOUBLE ÷ DOUBLE est désormais exact (7,5 / 2,5 = 3,00) ; auparavant,
  seule la partie entière du diviseur était prise en compte. Le calcul DOUBLE ×
  DOUBLE était déjà pris en charge.
- **Les tableaux de plus de 256 octets** (`DIM t(200) AS INTEGER`, `DIM g(19,
  19)`) fonctionnent avec des indices variables ; l'indice utilisé pour le
  retour à 256 et l'écriture dans le mauvais élément.
- **La récursivité** (une sous-fonction/fonction s'appelant elle-même,
  directement ou par l'intermédiaire d'autres fonctions) est une erreur de
  compilation. Auparavant, la compilation entraînait des résultats incorrects,
  car les paramètres étaient stockés dans des emplacements fixes de page zéro.

### Tableaux

```basic
var scores = array(8) # 8 octets à $C000

# (Tous les tableaux sont initialisés à zéro au démarrage du programme — nouveauté de la version 1.5.7)

scores[0] = 100 # index constant → STA $C000
scores[i] = 99 # index variable → STA (ptr),Y
var v = scores[i] # LDA (ptr),Y
print scores[2] # utilisable directement dans print

var moments = array_word(8) # 16 octets (8×2) à $C000+

moments[0] = $1234 # index constant → STA $C000 (lo), STA $C001 (hi)
moments[i] = $5678 # index variable → ASL A pour le pas ; (ptr),Y × 2
var t: mot = moments[1] # LDA $C002, LDA $C003
```

**Tableaux multidimensionnels** (nouveauté de la version 1.5.3)

**Les tableaux peuvent être déclarés avec plusieurs dimensions. Ils sont stockés
par lignes et indexés par une liste d'indices séparés par des virgules. Leur
taille totale est le produit de leurs dimensions.**

```basic
var grid = array(8, 8) # 8×8 = 64 octets à $C000

grid[1, 0] = 11 # ligne 1, colonne 0 → index plat 1*8+0 = 8 → STA $C008

grid[0, 1] = 22 # ligne 0, colonne 1 → index plat 1 → STA $C001

grid[r, c] = 33 # variable → calcule r*8 + c, puis STA (ptr),Y

var v = grid[r, c] # LDA (ptr),Y

var wm = array_word(4, 4) # tableau de mots 4×4 = 32 octets

wm[1, 2] = $ABCD # élément 1*4+2 = 6 → octets $C00C/$C00D

const ROWS = 3
const COLS = 5
var m = array(ROWS, COLS) # Les dimensions peuvent être des constantes de compilation
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

var x: int # 1 octet

var y: int # 1 octet

var hp: word # 2 octets → taille de l'élément = 4
endtype

const N = 8

var enemies: TEntity = array(N) # alloue N × 4 = 32 octets à $C000

enemies[0].x = 5

enemies[0].y = 10

enemies[0].hp = $0100
var v = enemies[0].hp # lecture — LDA $C002 / LDA $C003

var i: int = 2

enemies[i].x = 42 # index de la variable → idx * taille_élément + décalage

# Champ flottant (Q8.8 à virgule fixe)
type TBall

var bx: int # 1 octet

var by: int # 1 octet

var vel : float # 2 octets Q8.8 → taille de l'élément = 4
endtype

var balls : TBall = array(3)
balls[0].vel = 1.5 # stocke Q8.8 : hi=1, lo=128
var f : float = balls[0].vel # lit le champ float dans une variable float
print balls[0].vel # affiche « 1.50 »
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
var ptr : mot = 0400 $ # deux octets ZP : lo=00$ hi=04$
poke ptr, 6 # STA (ptr),Y
var v = coup d'oeil(ptr) # LDA (ptr),Y
```

**Produits 16 bits (corrigé dans la version 1.5.7).** Un produit affecté à un
`word` conserve ses 16 bits, même si aucun des facteurs n'est un `word` :

```basic
var score: word = 0
var level = 3
score += 300 * level # 900 (avant la version 1.5.7, cette valeur était tronquée à 8 bits : 44)
score = score + 100 * level
var big: word = 100 * level + 900
```

Depuis la version 1.6.1, cela s'applique également aux sommes internes et aux
expressions `shl`, ainsi qu'aux multiplicateurs constants supérieurs à 255 : `py
= cy * 8 + fy`, `py = (cy shl 3) + fy` et `w = cy * 300` conservent les 16 bits
(auparavant, les sommes étaient tronquées à 8 bits). Les cibles d'octets
conservent les résultats sur 8 bits.

### Graphiques bitmap

```basic
Graphismes activés # Mode bitmap haute résolution VIC-II (320×200, 1 bpp) ; bitmap à $2000

Graphismes activés # Mode bitmap multicolore VIC-II (160×200, 2 bpp, 4 couleurs/cellule)
Graphismes désactivés # Retour au mode texte

gcls # Effacer le bitmap (remplit $2000-$3FFF) + définir les couleurs de la matrice vidéo

plot x, y # Définir le pixel à (x, y) ; x : 0-319, y : 0-199
plot erase x, y # Effacer le pixel (ET ~masque)
plot xor x, y # Basculer le pixel (masque EOR) — animation sans scintillement
circle x, y, r # Cercle du point médian centré en (x, y) avec un rayon r ; écrête les points hors écran
line x1, y1, x2, y2 # Ligne de Bresenham de (x1,y1) à (x2,y2) ; x : 0-319, y : 0-199

Line Eraser x1, y1, x2, y2 # Efface les pixels le long de la ligne (masque ET ~)

Line XOR x1, y1, x2, y2 # Inverse les pixels le long de la ligne (masque OU-E)

Rect x1, y1, x2, y2 # Dessine le contour d'un rectangle (4 côtés) ; x : 0-319, y : 0-199

Rect Eraser x1, y1, x2, y2 # Efface le contour d'un rectangle (masque ET ~)

Rect XOR x1, y1, x2, y2 # Contour d'un rectangle (masque OU-X)

Paint x, y # Remplissage par propagation de 4 pixels à partir de (x, y) ; remplit les pixels effacés délimités par les 1 définis

Color Pen c # Définit la couleur de dessin haute résolution (0-15) ; Voir ci-dessous

# ── Bitmap multicolore (graphique sur fond multicolore, 160×200) ──
mplot x, y, couleur # Définir un pixel multicolore (x : 0-159, y : 0-199, couleur : 0-3)
mline x1, y1, x2, y2, couleur # Ligne multicolore
mrect x1, y1, x2, y2, couleur # Contour d'un rectangle multicolore
mcircle x, y, r, couleur # Cercle multicolore
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
Graphiques sur
gcls
Stylo couleur 2 # rouge
Ligne 0, 0, 100, 100
Stylo couleur 6 # bleu
Cercle 160, 100, 40
Affichage sur
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
Graphiques sur plusieurs
gcls
mcircle 80, 100, 40, 1
mrect 10, 10, 150, 190, 2
mline 0, 0, 159, 199, 3
Affichage sur
```

`mline`/`mrect`/`mcircle` réutilisent les mêmes routines Bresenham / point
médian que leurs homologues haute résolution, traçant chaque pixel à travers
`mplot`; les points hors écran (x ≥ 160 ou y ≥ 200) sont ignorés.

### Bitmap à double tampon (sans scintillement)

```basic
graphismes sur double # bitmap haute résolution à double tampon (320×200)
gcls # efface le tampon arrière CACHÉ
ligne 0, 0, 319, 199 # tout le dessin (tracé/ligne/cercle/rectangle/peinture/gcls) est placé dans le tampon arrière
flip # affiche le tampon dessiné ; redirige le dessin vers l'autre tampon
graphics off # retour au mode texte (restaure la banque VIC 0)
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
Affichage des graphismes en mode bloc 80×50 (mode texte + jeu de caractères personnalisé 4 pixels à $2800)

Désactivation des graphismes # Retour au mode texte

Effacement de la zone de jeu : RAM écran $0400-$07FF + RAM couleur $D800-$DBFF

Plot4 x, y # Positionner le pixel du bloc à (x, y) ; x : 0-79, y : 0-49

Plot4 erase x, y # Effacer le pixel du bloc à (x, y)

Circle4 x, y, r # Tracer un cercle médian en pixels de bloc ; écrêtage à 80×50
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
cls # Effacer l'écran (KERNAL $E544)

cls fast # Remplissage rapide : RAM écran + RAM couleur + HOME

color text 14 # Couleur du texte (registre $0286)

color border 6 # $D020
color bg 0 # $D021

color pen 2 # Couleur de dessin haute résolution (0-15) pour les tracés, lignes, rectangles, cercles et peintures

screen 0, 0, 65 # Écrire le caractère 65 (« A ») dans la RAM écran, colonne 0, ligne 0 ($0400)

screen 10, 5, ch # Colonne 10, ligne 5 — col et ligne peuvent être des variables

screen 5, 3, 42, 7 # Caractère 42, colonne 5, ligne 3, couleur 7 (écrit également dans la RAM couleur $D800)

screen x, y, ch, col # Les quatre arguments sont des variables

display on # Réactiver l'affichage VIC (bit DEN $D011)
display Off # Affichage vide

Minuscules # CHR$(14) → Basculer VIC-II en mode minuscules/majuscules

Majuscules # CHR$(142) → Repasser VIC-II en mode majuscules/graphiques

Curseur 20, 10 # Déplacer le curseur à la colonne 20, ligne 10 (KERNAL PLOT $FFF0)

Curseur x, y # Colonne de la variable x (0–39), ligne de la variable y (0–24)

Print at 20, 10, "HELLO" # Curseur(20,10) + print en une seule instruction (sans saut de ligne)

Print at x, y, "Score:", score # Combinaison d'expressions possibles
Print at 0, 0 # Position uniquement (sans texte, sans saut de ligne)

Scroll x 3 # Défilement horizontal fin : $D016 bits 0-2 = 3 (0-7)

Scroll y 2 # Défilement vertical fin défilement : $D011 bits 0-2 = 2 (0-7)

défilement x n # la valeur peut être une variable ou une expression (masquée sur les bits 0-2)

défilement x 7 étroit # activer le défilement fin et forcer le mode 38 colonnes (masquer la colonne de bord)

défilement x 0 large # activer le défilement fin et rétablir le mode 40 colonnes

défilement ligne 12 gauche # décaler la ligne 12 de la RAM écran vers la gauche d'un caractère
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
speed 4 # Régle le processeur à 4 MHz (lit $D031, met à jour les bits 0 à 3, puis réécrit la valeur)
speed 48 # 48 MHz (vitesse maximale sur U64)
speed max # Identique à speed 48 (alias)
speed off # Retour à 1 MHz (alias pour speed 1)

badlines on # Active la gestion des lignes défectueuses (bit 7 de $D031 = 0, comportement par défaut du C64)

badlines off # Désactive la gestion des lignes défectueuses (bit 7 de $D031 = 1, augmente le nombre de cycles processeur)

var t = turbo() # 1 si le mode turbo est actif (bits 0 à 3 de $D031 != 0), 0 si la fréquence est de 1 MHz
```

Valeurs MHz disponibles : `1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 20, 24, 32, 40,
48`. Les valeurs constantes sont arrondies à la vitesse inférieure disponible la
plus proche lors de la compilation. Les valeurs variables sont traitées comme un
indice de vitesse brut (0–15) et combinées par un OU logique avec les bits 0 à 3
de `$D031`.

| Index $D031 | MHz (U64) | MHz (U64 Elite-II) |
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
var key = getch() # Attente active sur $FFE4 jusqu'à l'appui sur une touche ; retourne le code PETSCII

var k = inkey() # Non bloquant : retourne le code PETSCII, ou 0 si aucune touche n'est enfoncée

waitkey # Attente jusqu'à l'appui sur une touche (analyse de la matrice CIA1 ; fonctionne pendant une interruption)

var k = waitkey() # Identique, mais retourne les bits bruts de la colonne $DC01 (bit 0 = touche enfoncée)

var j = joy(2) # Lecture du port 2 du joystick ; Renvoie les bits 0 à 4 inversés.

var j = joy(1) # Lecture du port 1 du joystick

# bit0=haut(1) bit1=bas(2) bit2=gauche(4) bit3=droite(8) bit4=tir(16)

var mx = mouse_x() # Souris 1351 : position X cumulée (avec : charge + délai + delta)

var my = mouse_y() # Souris 1351 : position Y cumulée (EOR #$FF inversé)

var mb = mouse_btn() # Boutons de la souris : lecture de $DC01 — bit0=gauche (tirer), bit1=droite (broche haut)
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
bye # JSR $E544 (effacement de l'écran), suppression du drapeau STOP, retour à BASIC
exit # alias pour bye
```

### Timing

```basic
wait 50 # Attendre 50 transitions de lignes raster (~3,2 ms)
wait raster 100 # Boucle jusqu'à ce que $D012 == 100 (effets de séparation raster)
delay 1 # Attendre 1 image PAL (1/50 s ≈ 20 ms)
delay 20 # Attendre 20 images ≈ 0,4 s ; n peut être une variable (0–255)
```

`delay N` compte N trames PAL complètes en utilisant la ligne raster 200 comme
limite de trame.

### SID Sound

```basic
son 0, $1CAD, 25 # voix 0, fréquence $1CAD (≈ Do central PAL), durée 25 trames

son 1, freq_mot, 50 # voix 1, fréquence de la variable mot, 50 trames (1 s à 50 Hz)

son 2, 0, 0 # voix 2, silence

sid volume 15 # volume principal au maximum ($D418 = $0F) ; plage 0-15

sid volume 0 # silence (volume principal = 0)
sid stop # mise à zéro des 25 registres SID ($D400–$D418) — silence complet
```

`sound <channel>, <freq>, <duration>` — durée en images PAL (1/50 s chacune).
`sound` **blocks** : le programme attend la fin de la note (utiliser `sfx`
ci-dessous dans une boucle de jeu). ADSR fixe : attaque/relâchement `$09`,
maintien/relâchement `$F0`, forme d'onde en dents de scie. Le volume principal
`$D418` est toujours réglé sur `$0F`.

*Corrigé dans la version 1.5.7 : * la boucle d'attente surveillait la ligne
raster 0, qui `$D012` (8 bits de poids faible uniquement) s'affiche deux fois
par image (lignes 0 et 256), de sorte que chaque note durait **la moitié** du
temps demandé — et deux branches étaient modifiées au niveau de leur opcode, ce
qui entraînait le plantage du programme pour toute durée autre que 0. `sound`
attend désormais sur la ligne raster 200 exactement comme `delay`.

`sid volume N` écrit N dans `$D418`. Bits 0-3 = volume (0-15), bits 4-7 = mode
de filtrage. `sid stop` émet une boucle de remplissage à zéro de 10 octets —
plus rapide que 25 insertions individuelles.

### Effets sonores non bloquants (`sfx`) — nouveauté de la version 1.5.7

```basic
son 0, $2000, 25 # BLOCS : le programme attend 25 images ici
sfx 0, $2000, 25 # Retour immédiat ; la note s’estompe d’elle-même
sfx 1, $0500, 8, 128 # Onde optionnelle : 16 triangle, 32 dents de scie (par défaut), 64 impulsion, 128 bruit
sfx 0, freq_word, 4, 16 # freq peut être une constante, une variable de type mot ou une expression 8 bits
```

La fonction `sfx <channel>, <freq>, <frames> [, <wave>]` programme une voix SID
et retourne immédiatement, ce qui la rend compatible avec les boucles de jeu. Il
n'y a pas de temporisateur de fin de signal : l'enveloppe est configurée avec
une attaque à 0, un maintien à 0 et un relâchement à 0, et la durée de
décroissance **** est choisie à la compilation parmi les durées de décroissance
`` (1 image = 20 ms, durée de décroissance SID la plus proche : 6, 24, 48, 72,
114, 168, 204, 240, 300, 750, 1500, 2400 ms…), de sorte que la note s'éteint
progressivement sur cette durée. La voix est réactivée à chaque appel (fin de
signal, puis réactivation) et le volume principal est réglé `$0F`. `channel`
(0-2), `frames` (1-255) et `wave` doivent être des constantes de compilation.


### Musique SID

```basic
charger sid "tune.sid" # intégrer la musique SID à son adresse de chargement native

charger sid "tune.sid", $2000 # priorité : intégrer à $2000 indépendamment de l'en-tête SID
```

`load sid` lit un fichier PSID ou RSID à la **compilation**, supprime l'en-tête
et ajoute les octets musicaux bruts à la sortie `.prg`. Après `load sid`, deux
constantes de compilation deviennent disponibles :

| Constante  | Description                                                                                                 |
| ---------- | ----------------------------------------------------------------------------------------------------------- |
| `sid_init` | Adresse de la routine d'initialisation — appel unique avec A = numéro de chanson (à partir de 0)            |
| `sid_play` | Adresse de la routine de lecture — appel de chaque trame (PAL 50 Hz) depuis un gestionnaire d’interruption. |

Les deux constantes fonctionnent partout où une adresse constante est acceptée :
`sys`, `irq`, `poke`, expressions.

**Utilisation typique :**

```basic
Charger le SID « music.sid »

Sub music_irq()

Poke $D019, $FF # Accusé de réception de l'interruption raster VIC

Système sid_play # Avancer d'une trame musicale

Irq_exit # Saut $EA81 : restauration des signaux A/X/Y et RTI (sortie d'interruption correcte)

Fin

Système sid_init, 0 # Initialisation de la puce SID : A=0 → première sous-échelle
Irq music_irq, $C0 # Interruption raster à la ligne $C0 → 50 Hz en PAL

SID volume 15 # Volume principal activé
```

**Remarques :**
- Les données SID sont placées **après** tout le code généré, complétées par des
  zéros jusqu'à l'adresse de chargement. Le compilateur signale tout risque de
  chevauchement entre l'adresse de chargement SID et du code généré.
- Les versions 1 et 2 de PSID sont prises en charge. Si l'adresse de chargement
  de l'en-tête SID est 0, les deux premiers octets de données sont utilisés
  comme adresse (format PRG, petit-boutiste).
- Un seul `load sid` par programme est significatif (le dernier l'emporte).

### Track mèmes (`tune`)

```basic
accordage # optionnel : accordage à $C800 (par défaut $8000)

vitesse 6 # images par ligne (50 Hz PAL)

inst 0, $41, $09, $F0, $0800, $0064, $27, $1F

inst 1, $10, $08, $A8, $0400, $0000, $00, $0F

imod 0, 6, 3, 9, 40, $0200, $0E00 # vibrato + modulation de largeur d'impulsion (1.6.2)

ifilt 0, $0500, 20, 1 # balayage de la fréquence de coupure jusqu'à $500, aller-retour (1.6.2)

igate 1, 2, 1, $09 # temporisateur de porte, redémarrage forcé, première image $09 (1.6.2)

itab 1, 2, 0, ".. +0", ".. +4", ".. +7" # Table d'arpèges (1.6.2)

Ordre 0, 1, 0 # Ordre des motifs (les motifs peuvent se répéter)

Motif 0, 0, "C-4 00", "...", "E-4 00 V24", "...", "G-4 00", "... .. C00"

Motif 0, 1, "C-2 01", "...", "...", "...", "G-2 01 F03"

Motif 1, 0, "G-4 00", "...", "E-4 00", "...", "C-4 00"
Fin de la lecture musicale # ou : sys sid_init / gestionnaire d'interruption appelant sys sid_play
```

`tune ... end` décrit une mélodie de suivi à 3 voix en texte brut (la même
notation de cellule que celle affichée par l'éditeur SID de l'assembleur visuel)
et construit le lecteur **à la compilation**. Il définit `sid_init` / `sid_play`
exactement comme `load sid`, de sorte que `music play`, `music stop`, `music
pause` et `music resume` (et un gestionnaire d'interruption `irq` appelant `sys
sid_play`) fonctionnent sans modification.

| Doubler                                                                       | Signification                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `vitesse N`                                                                   | Images par rangée de suivi (1-255).                                                                                                                                                                                                                                                                                                                                                                                                               |
| `inst id, ctrl, ad, sr, pw, cutoff, resfilt, modevol`                         | Un instrument : registre de contrôle (bits de forme d'onde plus modulation en anneau `$04` / sync `$02` ; le bit de porte est ajouté par le joueur), attaque/décroissance, maintien/relâchement, largeur d'impulsion 12 bits, coupure de filtre 11 bits, octet de résonance/routage de filtre (style `$D417` : n'importe quel bit de routage = acheminer la voix qui joue cet instrument) et octet de mode/volume (style `$D418`, bit 7 = 3 OFF). |
| `identifiant imod, vibdelay, vibspeed, vibdegree, pwmspeed, pwmmin, pwmmax`   | (1.6.2) Vibrato de l'instrument : après `vibdelay` images, un LFO triangulaire tourne toutes les `vibspeed` images (1-15, 0 = désactivé), profondeur 0-15 (proportionnelle au demi-ton de la note). Modulation de largeur d'impulsion : `pwmspeed` est ajouté par image (0 = désactivé), oscillant entre `pwmmin` et `pwmmax`.                                                                                                                    |
| `ifilt id, cutend, sweep, pingpong`                                           | (1.6.2) Balayage de la coupure du filtre : de la coupure `inst` vers la coupure `cutend` par `sweep` (0-127) par image ; `pingpong` 1 = aller-retour.                                                                                                                                                                                                                                                                                             |
| `Identifiant de porte, minuterie de porte, redémarrage forcé, première vague` | (1.6.2) La porte est relâchée `gatetimer` images avant la note suivante de la voix (maintenez-la en dessous de `speed`) ; `hardrestart` 1 réinitialise également l'ADSR à 0. `firstwave` (par exemple, `$09` = test + porte) est écrit sur la première image de la note.                                                                                                                                                                          |
| `itab id, vitesse, boucle, "pas", ...`                                        | (1.6.2) Table d'ondes/arpèges, jusqu'à 32 pas : `"WW +n"`, `".. -n"` ou `"WW =n"` - forme d'onde en hexadécimal (`..` la conserve) et décalage de note en demi-tons ou note absolue (`=60`). Un pas toutes les `vitesse` images, puis retour au pas `boucle` (255 = rester sur le dernier pas).                                                                                                                                                   |
| `ordre p, p, ...`                                                             | Ordre du motif. Les lignes s'accumulent, jusqu'à 255 étapes.                                                                                                                                                                                                                                                                                                                                                                                      |
| `pat p, v, "cellule", ...`                                                    | Jusqu'à 32 lignes pour la voix `v` (0-2) du motif `p` (0-7). Les lignes manquantes sont vides.                                                                                                                                                                                                                                                                                                                                                    |

Une cellule **** est `NOTE INST FX` : `C-4`, `D#3`, `Eb2` ou `...` pour aucune
note, un instrument hexadécimal à deux chiffres (`..` pour le quitter), et un
effet optionnel - `Vxy` vibrato (x = maintenir les rangées, y = profondeur),
`Uxx` / `Dxx` glisser vers le haut / vers le bas, `C` couper la note, `Fxx`
régler la vitesse. Une cellule d'effet uniquement peut être écrite comme `"...
.. F06"` ou simplement `"F06"`.

Remarques sur le joueur :

- Tout l'état du joueur vit ** à l'intérieur du blob ** (adressage absolu) - il
  n'utilise pas de page zéro, il ne peut donc pas entrer en collision avec les
  variables ou les temporaires UltimateBasic, et il continue de fonctionner
  lorsque le programme revient à BASIC.
- À chaque image (1.6.2), le lecteur exécute la table d'ondes/arpèges, le
  vibrato, la modulation de largeur d'impulsion et le temporisateur de
  porte/redémarrage forcé de chaque voix, ainsi que le balayage de la fréquence
  de coupure de la voix ayant activé en dernier un instrument routé par filtre
  (elle contrôle la fréquence de coupure, la résonance et le mode du filtre ;
  `$D417` route chaque voix dont l'instrument actuel est routé par filtre). Il
  s'agit du même algorithme que celui utilisé pour le lecteur et l'aperçu
  exportés de l'éditeur SID de Visual Assembler, image par image.
- Le blob est placé à une adresse fixe (par défaut `$8000`, ou `tune à $addr`)
  et le fichier `.prg` est complété jusqu'à cette adresse, comme avec `load
  sid`. Veillez à ce qu'il ne se trouve pas au même niveau que votre code, les
  tableaux (`$C000+`) et toute zone mémoire contenant des bitmaps ou des
  caractères. Un réglage nécessite environ 2,5 Ko plus 12 octets par ligne et
  colonne de données.
- Au maximum 8 motifs (32 lignes chacun) ; la liste d'ordre peut les répéter
  librement.
- `music play` utilise la minuterie CIA1 à 50 Hz ; ne le combinez pas avec un
  autre `load sid`/`tune` (le dernier l'emporte).

### Lecture de musique

`music play/stop/pause/resume` est une alternative de haut niveau à la
configuration manuelle `sys sid_init` / `cia_timer`. Nécessite une instruction
`load sid` ou un bloc `tune ... end` (les deux définissent `sid_init` /
`sid_play`).

```basic
Charger le fichier SID « tune.sid » # Intégrer le fichier SID (définit sid_init / sid_play)

Lecture musicale # Initialiser le sous-morceau 0 + démarrer l'interruption CIA1 50 Hz

Lecture musicale 1 # Démarrer à partir du sous-morceau 1 (numéro de morceau à partir de 0)

Arrêt musical # Arrêter la lecture + mettre à zéro les 25 registres SID ($D400-$D418)

Pause musicale # Désactiver l'interruption A du minuteur CIA1 (la musique se fige, le SID reste inchangé)

Reprise musicale # Réactiver l'interruption A du minuteur CIA1 (reprise de la lecture au point de pause)
```

| Déclaration              | Effet                                                                                                               |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| `lecture de musique [n]` | Appelez `sid_init(n)`, configurez le temporisateur A de CIA1 à 19 656 cycles (~50 Hz PAL), installez le wrapper IRQ |
| `musique arrêt`          | Désactiver l'IRQ CIA1 + mettre à zéro les 25 registres SID                                                          |
| `Pause musique`          | désactiver l'IRQ CIA1 (la sortie SID reste figée)                                                                   |
| `Reprise musicale`       | Réactivation de l'IRQ CIA1 (suite du point d'arrêt)                                                                 |

Le wrapper IRQ (émis une fois à la fin du programme) fait : ACK CIA1 timer A →
`JSR sid_play` → `JMP $EA81`.

### Sprites

```basic
sprite 0, x, y, $2000 # sprite 0 : définit la position X, Y et le pointeur de données
sprite 0, x, y # sans pointeur de données (conserve l'existence)
sprite on 0 # active le sprite 0 ($D015 |= bit0)
sprite off 0 # désactive le sprite 0 ($D015 &amp;= ~bit0)
sprite color 0, 7 # couleur du sprite 0 = jaune ($D027)
sprite multicolor 0, on # active le mode multicolore pour le sprite 0 ($D01C |= bit0)
sprite multicolor 0, off # désactive le mode multicolore ($D01C &amp;= ~bit0)
sprite expand x 0, on # double la largeur ($D01D |= bit0)
sprite expand x 0, off # largeur normale ($D01D &amp;= ~bit0)
sprite expand y 0, on # double la hauteur ($D017 |= bit0)
sprite expand y 0, off # hauteur normale ($D017 &amp;= ~bit0)
sprite priority 0, on # derrière l'arrière-plan ($D01B |= bit0)
sprite priority 0, off # devant l'arrière-plan ($D01B &amp;= ~bit0)
var h = sprite_hit() # collision sprite-sprite ($D01E, effacé à la lecture)
var b = sprite_bg_hit() # collision sprite-arrière-plan ($D01F, effacé à la lecture)
var x = sprite_x(0) # lire la position X du sprite 0 (octet de poids faible, $D000)
var y = sprite_y(0) # lire la position Y du sprite 0 ($D001)
sprite_frame 0, $2000 # sélectionner une image sprite statique
sprite_frame 0, $2000, frame # sélectionner une image d'animation dans une séquence d'images
```

X prend en charge la plage complète de 9 bits (0–319) : utilisez une variable
`word` pour les valeurs d’exécution > 255. Pointeur de données Sprite :
`data_addr` doit être aligné sur 64 octets ; stocké comme `addr >> 6` à
`$07F8+id`.

#### Animation de sprite avec `sprite_frame`

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
boucle

sprite_frame 0, $2000, frame

frame = frame + 1

si frame == 4 alors frame = 0 fin

délai 5
fin
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

### Définition de sprite

```basic
sprdef 0
  00$,3C$,00$, 00$,$FF,00$, 03$,$FF,$C0, 07$,$FF,$E0,
  $0F,$FF,$F0, $0F,$FF,$F0, $1F,$FF,$F8, $1F,$FF,$F8,
  $1F,$FF,$F8, $0F,$FF,$F0, $0F,$FF,$F0, $07,$FF,$E0,
  03 $, $FF, $C0, $00, $FF, $00, $00, $3C, $00, $00, $00, $00,
  00$, 00$, 00$, 00$, 00$, 00$, 00$, 00$, 00$, 00$, 00$, 00$,
00 $, 00 $, 00 $
Fin
```

`sprdef id ... end` intègre 63 octets de sprite à l'adresse suivante alignée sur
64 octets dans le segment de code, émet un `JMP` par-dessus et définit
automatiquement `$07F8+id = data_addr >> 6`. Pour utiliser la même forme pour
plusieurs sprites, relisez le pointeur :

```basic
var pg = peek($07F8) # pointeur défini par sprdef 0
poke $07F9, pg # copie dans les sprites 1 à 7
```

### Cartes des tuiles de personnages (`.ubmap`)

```basic
map load "levels/world.ubmap"
map load "level.bin", $4000 # Projet Level Editor, données à l'adresse $4000 (1.6.1)
map draw map_x, map_y # Dessine une zone de 40x25 pixels sur l'écran/la mémoire RAM couleur
map view px, py # Vue double tamponnée lissée à l'adresse pixel px, py (1.6.1)

var tile = map_tile(x, y) # Lit le code des caractères depuis la carte

map set x, y, 42 # Modifie le code des caractères dans les données de carte modifiables

var shade = map_color(x, y) # Lit la couleur des cellules (0 si la carte ne contient pas de données de couleur)
map color x, y, 7 # Modifie la couleur des cellules lorsque des données de couleur sont présentes
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

**Projets de l'éditeur de niveaux (nouveauté de la version 1.6.1).** `Chargement
de la carte` lit également un projet de l'éditeur de niveaux VisualAssembler
(`Sauvegarde du niveau (.bin)`) et compose ses écrans en une seule carte : un
niveau de L × H écrans devient une carte de (L × 40) × (H × 25) avec des
couleurs, les emplacements vides étant des espaces. Les cartes sont limitées à
255 × 255 cellules, un niveau ne peut donc pas dépasser 6 écrans de large et 10
écrans de haut.

```basic
charger la carte « level.bin » # 2x5 écrans -&gt; une carte 80x125
```

**Placement des données de la carte (nouveauté de la version 1.6.1).** `map load
"file", addr` stocke la carte à une adresse fixe au lieu de l'intégrer
directement dans le code, comme `incbin "file", addr` (l'adresse doit se trouver
au-dessus du code généré ou à l'intérieur d'un intervalle `org`). Les caractères
précèdent les couleurs.

```basic
chargement de la carte « level.bin », $4000 # Carte 80x125 : caractères $4000-$6713, couleurs $6714-$8E1F
```

#### Défilement fluide — `vue de carte` (nouveauté de la version 1.6.1)

```basic
Chargement de la carte « level.bin », $4000
var px: word = 0
var py: word = 0
boucle

vue de la carte px, py # une fois par image, au lieu de `wait raster`

# lecture du joystick, modification de px / py, logique du jeu ...
end
```

`map view x, y` affiche la carte à la position de pixel `x, y` (expressions
verbales ; `0..(largeur-40)*8` et `0..(hauteur-25)*8`, les valeurs hors plage
sont écrêtées). Appelez cette fonction une fois par image : elle attend la
limite de l’image (ligne raster 250), affiche la position donnée par l’appel
précédent, puis prend la nouvelle position, de sorte qu’une nouvelle position
apparaît une image plus tard.

Fonctionnement : la partie fine utilise XSCROLL / YSCROLL dans `$D016` / `$D011`
avec 38 colonnes et 24 lignes (le bord défilé reste masqué) ; les changements de
caractère permutent deux tampons d’écran, `$0400` et `$3C00`. La position est
prédite deux images à l’avance et le tampon caché est construit pour la cellule
de caractère suivante en deux moitiés avant que la vue n’atteigne cette
position, de sorte que la permutation ne soit jamais interrompue. La mémoire RAM
couleur ne peut pas être doublement tamponnée : sa moitié supérieure est copiée
dans la dernière image précédente, juste avant le balayage, et sa moitié
inférieure juste après la permutation (les deux avec des interruptions masquées
pendant quelques lignes de balayage), ce qui évite les déchirures d’image. Un
changement de direction juste au moment d’un changement de caractère peut
bloquer la vue pendant une ou deux images, le temps que le tampon soit
reconstruit.

Règles:

- Le code du programme et les données en ligne doivent rester en dehors de
  `$3C00-$3FFF` (deuxième tampon) ; chargez les grandes cartes avec une adresse
  (`map load "file", $4000`), sinon la compilation s'arrête avec une erreur.
- La première commande `map view` dessine la vue complète dans `$0400`. Ensuite,
  l'écran appartient à `map view` : `print` / `screen` / `cls` n'écrivent que
  dans `$0400` et les données sont écrasées.
- Les sprites fonctionnent comme d'habitude : la vue de la carte copie les
  pointeurs de sprite `$07F8-$07FF` vers `$3FF8-$3FFF` à chaque image, de sorte
  que `sprdef` / `sprite_frame` s'affichent dans les deux tampons. Conservez les
  données de sprite dans la banque VIC 0 (`$0000-$3FFF`, et non `$1000-$1FFF`),
  par exemple en plaçant `sprdef` avant un gros chargement de carte en ligne ``.
- Les bits de jeu de caractères de `$D018` sont conservés (`charset on`
  fonctionne) ; le bit multicolore de `$D016` est conservé car `map load` l'a
  défini.
- Laissez environ 6000 cycles (~95 lignes raster) de logique de jeu par image ;
  une image plus longue permet à la vue de tenir pendant une image sans jamais
  se déchirer.
- Exemple : `examples/level_scroll_demo.ub` (piloté par joystick, avec un sprite
  de joueur).

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
|         5 |               1 | Indicateurs : bit 0 = présence d’une matrice de couleurs, bit 1 = mode texte multicolore     |
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
koala load "pictures/title.kla" # Valider et intégrer à la compilation

koala show # Passer en mode bitmap multicolore

koala hide # Retour à l'affichage texte par défaut
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

### Agencement du code : `org` — nouveauté de la version 1.5.7

```basic
sub a() ... end # Les sous-routines/fonctions sont placées les unes après les autres à partir de la fin du corps principal
org $4000 # Les sous-routines/fonctions suivantes continuent à $4000 ; $xxxx-$3FFF reste rempli de zéros
sub b() ... end
incbin "font.bin", $3800 # Les données peuvent être stockées dans l'espace ($3800-$3FFF correspond à un emplacement complet du jeu de caractères VIC)
```

L'adresse `org addr` se trouve **entre les définitions de
sous-programmes/fonctions ** (elle est ignorée dans le corps principal et
n'intervient que lors de la seconde passe). Les sous-programmes ne s'enchaînent
jamais, les octets ignorés sont donc simplement remplis de zéros et réservés :
un `incbin "f", addr` entièrement contenu dans l'espace est écrit dedans, et
`charset on` ne considère pas l'espace comme du code. Les octets nuls font
partie du `.prg`. `org` situé en dessous de la fin du code courant provoque une
erreur de compilation. Tout ce qui est généré après le dernier sous-programme
(fonctions auxiliaires, `data`) suit ce dernier, c'est-à-dire qu'il se situe
au-dessus de l'espace.

### Jeu de caractères personnalisé (`charset on` / `charset off` nouveauté de la version 1.5.7)

```basic
charset $3800 # définir l'adresse de base pour chardef (par défaut $3800)

chardef 65 # redéfinir le caractère 65 (« A »)

$18,$3C,$66,$7E,$66,$66,$66,$00
end

chardef 66 # moins de 8 octets sont complétés par des zéros

$7C,$66,$7C,$66,$7C
end
```

`charset base` définit l'adresse de destination utilisée par toutes les
instructions `chardef` suivantes. `chardef id ... end` intègre 8 octets
directement dans le segment de code (précédés d'un `JMP` pour les ignorer), puis
les copie dans `charset_base + id*8` à l'exécution. Les valeurs doivent être des
constantes de compilation écrites sous la forme `$xx` ou en décimal. Les
littéraux binaires **`%` ne sont pas pris en charge** par l'analyseur lexical
(le manuel l'indiquait avant la version 1.5.7, ce qui était erroné).

`charset addr` définit uniquement la destination `chardef` ; il n'émet aucun
code. Pour que le VIC-II utilise cette configuration, activez-la (puis
désactivez-la une fois terminé).
```basic
charset $3800
chardef 1 $FF,$81,$81,$81,$81,$81,$81,$FF end # bordure de la boîte
charset on # VIC-II lit les caractères à partir de $3800 (matrice d'écran non modifiée)
... charset off # retour au jeu de caractères ROM ($1800 si `lowercase` est actif, sinon $1000)
```

`charset on` read-modify-writes `$D018` bits 1-3 from the last `charset addr`
(default `$3800`); the screen-matrix bits are preserve. The address must be a
multiple of `$800` in the VIC bank 0 (`$0000-$3FFF`), not it is a compile-time
error. Both instructions use the `charset addr` that was compiled in the last
compiled, so keep the directive in the main program body (the sub-routine bodys
are compiled after). L'écriture brute équivalente est `poke $D018, $1A` pour
`$2800` ou `poke $D018, $1E` pour `$3800`.

**Vérification de chevauchement. ** `charset on` revendique l'ensemble de 2 Ko
et chaque `chardef` ses 8 octets. Si le code généré atteint cette zone, la
compilation s'arrête avec `the program code ($080D-$xxxx) overlaps the charset
area $2800-$2FFF; move the charset ...`. Les programmes volumineux nécessitent
donc le jeu de caractères au-dessus du code (`charset $3800`) — ou utilisez
`org` (ci-dessus) pour permettre au code de continuer au-dessus du jeu de
caractères. Les données placées dans un espace `org` (`incbin ..., addr`) ne
sont pas comptabilisées comme du code.

### Mémoire

```basic
poke $D020, 2 # STA $D020

poke addr_var, 6 # STA (addr_var),Y — si addr_var est de type mot

var v = peek($D012) # LDA $D012

var v = peek(addr_var) # LDA (addr_var),Y — si addr_var est de type mot

var w: word = peek16($C000) # lecture 16 bits little-endian : lo=$C000, hi=$C001

poke16 $0314, $EA81 # écriture 16 bits little-endian : lo→$0314, hi→$0315

poke16 ptr, w # variable mot comme adresse ; variable mot comme valeur
```

`peek16(addr)` lit deux octets consécutifs (lo, hi) comme un `word`. `poke16`
écrit lo puis hi.

### E/S disque

```basic
charger "PROGRAM" # CHARGEMENT DU NOYAU : charge le fichier depuis le périphérique 8 à son adresse native

charger "DATA", $C000 # charge le fichier à une adresse spécifique

chaîner "GAME" # charge un autre programme par-dessus celui-ci et l'exécute (voir ci-dessous)

charger "DATA", ptr # adresse depuis la variable mot

sauvegarder "DATA", $C000, 4096 # SAUVEGARDE DU NOYAU depuis $C000, 4096 octets → périphérique 8

sauvegarder "PROG", start, len # adresse et longueur depuis les variables mot/entier
```

La fonction `load` appelle les fonctions KERNAL `SETNAM`+`SETLFS`+`LOAD`
(`$FFBD`/`$FFBA`/`$FFD5`). Sans adresse : l’adresse secondaire est 1 (l’en-tête
de 2 octets du fichier est l’adresse de chargement). Avec adresse : l’adresse
secondaire est 0 (le fichier est chargé à l’adresse indiquée, son en-tête est
ignoré). (Corrigé dans la version 1.5.9 — auparavant, les deux étaient inversés
: `load "F"` chargé dans `$0000`.) `save` appelle `SETNAM`+`SETLFS`+`SAVE`
(`$FFBD`/`$FFBA`/`$FFD8`). Nécessite à la fois `addr` et `len`.

#### Enchaînement avec un autre programme — `chaîne` (nouveauté de la version 1.5.9)

```basic
chaîne "GAME" # charge le jeu depuis le lecteur où il a été lancé et l'exécute

chaîne "GAME", 9 # depuis le lecteur 9 (expression quelconque)

print "LOAD ERROR" # uniquement si le fichier n'a pas pu être chargé
```

La commande `chain` charge un autre programme à sa propre adresse de chargement
— généralement `$0801`, juste au-dessus du programme en cours d'exécution — et
le lance exactement comme si les commandes `LOAD"GAME",8,1` et `RUN` avaient été
saisies. C'est ce dont un programme de démarrage/titre a besoin. Une simple
commande `load` ne peut pas le faire : le fichier chargé écraserait le code qui
exécute la commande `load`.

Comment ça marche :

- Un chargeur de 46 octets, indépendant de la position, plus le nom du fichier,
  est copié dans le tampon de cassette (`$033C`), sur lequel ni un programme
  Ultimate Basic ni un fichier compressé Exomizer ne se charge.
- Avant cela, la machine est remise dans un état initial : les interruptions VIC
  sont désactivées, le volume SID est à 0, `IOINIT` (`$FDA3` : temporisateurs
  CIA, interruption clavier, bus série), `RESTOR` (`$FF8A` : vecteurs
  d’interruption/de rupture/d’interruption non masquable par défaut et d’E/S),
  `$01 = $37`. Les interruptions raster personnalisées, `lecture musicale` et
  `nmi` sont arrêtées. L'écran, les couleurs et les registres de banque VIC
  autres que `$DD00` sont laissés tels quels, de sorte qu'une image peut rester
  à l'écran pendant que le programme suivant se charge (`IOINIT` sélectionne la
  banque VIC 0).
- Le chargeur appelle `SETNAM` / `SETLFS` (secondaire 1) / `LOAD`. Sans argument
  de périphérique, il utilise le lecteur à partir duquel le programme a été
  chargé (`$BA`), ou le lecteur 8.
- Après un chargement réussi, il positionne le pointeur de fin de programme
  (`$2D/$2E`), réinitialise BASIC (`$E453`, `$E3BF` — un programme
  auto-extractible comme Exomizer `sfx` a pu utiliser la page zéro de BASIC) et
  exécute le programme (`$A659`, `$A7AE`). Il fonctionne aussi bien avec les
  programmes Ultimate Basic, les fichiers compressés (`exomizer sfx sys`)
  qu'avec les programmes BASIC ordinaires.
- Si le fichier ne peut pas être chargé (introuvable, aucun lecteur), `chain`
  retourne et le programme continue avec l'instruction suivante.

Le nom du fichier doit être une chaîne de caractères littérale de 1 à 16
caractères.

### Entrées/sorties de fichiers sur canal série

```basic
Ouvrir 1, 8, 2, "MYFILE" # Ouvrir le fichier logique 1, périphérique 8, secondaire 2, nom "MYFILE"

Ouvrir 2, 4, 7 # Ouvrir l'imprimante (périphérique 4), sans nom de fichier

Ouvrir ch, dev, sec # Canal, périphérique, secondaire à partir des variables

Imprimer # 1, "HELLO" # Envoyer "HELLO" + CR au fichier logique 1

Imprimer # ch, x, "texte" # Combinaison de variables et de chaînes de caractères — identique à print mais dans un fichier

Fermer 1 # Fermer le fichier logique 1

Fermer ch # Canal à partir de la variable
```

`open` appelle `SETNAM` ($FFBD) + `SETLFS` ($FFBA) + `OPEN` ($FFC0). Sans nom de
fichier, SETNAM est appelé avec une longueur de 0. `print#` achemine la sortie
via `CHKOUT` ($FFC9), CHROUT caractère par caractère (+ retour chariot final),
puis `CLRCHN` ($FFCC). `close` place le numéro de canal dans A et appelle
`CLOSE` ($FFC3).

### Saisir

```basic
Saisie du score # Lecture de jusqu'à 3 chiffres au clavier → Variable entière 8 bits

Saisie de "Nom : ", nom # Chaîne d'invite facultative, puis lecture de la ligne → Variable chaîne

Saisie de "Score : ", score # Invite + saisie entière
```

`input` utilise KERNAL BASIN (`$FFCF`) pour bloquer, écho l'entrée de ligne avec
prise en charge DEL.
- **Variable entière** : accepte uniquement `0`–`9`, max 3 caractères ;
  convertit en valeur 8 bits sur CR.
- **Variable de type chaîne** : accepte jusqu’à 30 caractères ; stocke sous
  forme de chaîne terminée par un caractère nul ; paire ZP mise à jour.
- **DOUBLE var** (1.6.3): chiffres et `.`, par exemple `12.5` → 12.50 (deux
  décimales).
- **Élément de tableau** (1.6.3) : `entrée t(i)` / `entrée nevek(i)` ; `entrée
  "prompt" ; x` fonctionne également.
- **String var** : accepte jusqu'à 30 caractères ; stocke sous forme de chaîne
  terminée par un caractère nul ; paire ZP mise à jour.

### Flottant / Virgule fixe

Les variables `float` utilisent le format à virgule fixe Q8.8 : l'octet de poids
fort est la partie entière (0–255) et l'octet de poids faible est la partie
fractionnaire (0/256 … 255/256).

```basic
var f: float = 3.5 # 3.5 → hi=3, lo=128 (= 0x0380)
var g: float = 0 # L'entier 0 est automatiquement converti en 0.0

f = 1.5 # Affectation littérale Q8.8

f = f + 1.5 # Arithmétique Q8.8 16 bits (résultat : 3.0)

f = f + g # Combinaison de nombres flottants

var n = int(f) # Extraction de la partie entière (octet de poids fort) → entier 8 bits

print f # Affiche « N.DD » (ex. : 3.5 → « 3.50 », 1.25 → « 1.25 »)
```

| Opération           | Exemple              | Notes                                                    |
| ------------------- | -------------------- | -------------------------------------------------------- |
| Littéral            | `3,5`, `0,25`, `1,0` | analysé comme Q8.8 lors de la compilation                |
| Promotion entière   | `f = 5`              | magasins 5.0 (hi=5, lo=0)                                |
| Ajouter/sous-titrer | `f + 1,5`, `f - g`   | Arithmétique Q8.8 sur 16 bits                            |
| Extraire int        | `int(f)`             | Renvoie l'octet de poids fort sous forme d'entier 8 bits |
| Imprimer            | `print f`            | format « N.DD », toujours 2 chiffres après la virgule    |

**Attention :** Le dépassement de capacité arithmétique est limité à 255,255
(pas de saturation). La multiplication et la division de deux variables
flottantes ne sont pas encore prises en charge ; utilisez `int()` +
l’arithmétique entière dans ces cas.

**Affichage des expressions à virgule flottante (corrigé dans la version 1.5.7).
** `print` d'une expression arithmétique impliquant un `float` (par exemple,
`print a / 10` avec `a: float = 1`) affiche désormais le résultat Q8.8 sous la
forme `N.DD`. Avant la version 1.5.7, la valeur brute sur 16 bits était affichée
comme un entier (`25` au lieu de `0.09`). La fraction est tronquée, et non
arrondie : 1/10 = 25/256 s'affiche comme `0.09`.

### fonctions mathématiques

```basic
var a = abs(x - 20) # Valeur absolue en complément à deux
var b = min(x, 39) # Minimum sur 8 bits
var c = max(x, 0) # Maximum sur 8 bits
var s = sgn(score) # 0 = zéro, 1 = positif (1–127), FF = négatif (128–255)
var r = rnd() # Pseudo-aléatoire LCG 0-255 Initialisation de la ligne raster

var r = rnd(10) # Pseudo-aléatoire LCG 0-9 (rnd() mod n ; résultat 0..n-1)

var s = sin(angle) # Sinus : angle 0-255 (cercle complet), renvoie 0-255 (centre = 128)

var c = cos(angle) # Cosinus = sin(angle + 64)

var v = clamp(x, 0, 39) # Clamp non signé 8 bits : résultat = max(lo, min(hi, val))

print hex(n) # Affichage en hexadécimal majuscules (2 chiffres)

print bin(n) # Affichage en binaire (8 bits)
```

### Fonctions de chaînes de caractères

```basic
var n = len(msg) # longueur de la chaîne terminée par un caractère nul (0–255)
var c = asc(msg) # code PETSCII du premier caractère (0 si vide)
var c = asc("A") # à la compilation : code PETSCII constant
var n = val(s) # à l'exécution : analyse de la chaîne PETSCII décimale → entier 8 bits (ex. : "042" → 42)
var c = msg[i] # caractère de la chaîne à l'index i : code PETSCII de msg[i]
msg[i] = c # écriture de l'octet PETSCII c dans la chaîne à l'index i — STA (ptr),Y
msg[0] = 72 # index constant → LDY #0 ; STA (ptr),Y
```

### formatage des nombres

```basic
print hex(n) # affiche en hexadécimal majuscules sur 2 chiffres

print bin(n) # affiche en binaire sur 8 bits

print dec(n, 4) # décimal aligné à droite sur 4 caractères (ex. : 42 → " 42")

print dec(n, width) # width peut aussi être une variable
```

`dec(n, width)` ajoute des espaces à gauche du nombre pour atteindre `width`
caractères. Si le nombre comporte plus de chiffres que `width`, il est affiché
sans ajout d'espaces (pas de troncature). Dans un contexte autre que
l'affichage, `dec(n, w)` est évalué à `n` sans modification (comme `hex`/`bin`).

### REU (unité d'extension RAM)

```basic
var ok = reu_present() # 1 si REU détecté, 0 sinon (test de lecture/écriture sur $DF04)
var ok = reudet() # alias de reu_present()

reu stash c64addr, bank, reu_addr, len # Copie C64 → REU

reu fetch c64addr, bank, reu_addr, len # Copie REU → C64

reu swap c64addr, bank, reu_addr, len # Échange entre C64 et REU
```

`reu_present()` effectue un test d'écriture/lecture sur le registre REU `$DF04`.
Sans REU, l'écriture est impossible (bus ouvert), la lecture est donc différente
; cela permet de détecter la présence de manière fiable sans modifier aucun
registre de commande susceptible d'avoir un effet de bord.

| Paramètre  | Largeur | Notes                                                                   |
| ---------- | ------- | ----------------------------------------------------------------------- |
| `c64addr`  | 16 bits | Démarrage de la RAM du C64 — constante, `word` var ou expression 8 bits |
| `banque`   | 8 bits  | Numéro de banque REU (0–7 pour une unité de 512 Ko)                     |
| `reu_addr` | 16 bits | Compensation au sein de la banque REU                                   |
| `len`      | 16 bits | Octets à transférer (`0` = 65 536 en matériel REU)                      |

Registres REU : commande `$DF01` (mise en cache `$B0` / récupération `$B1` /
échange `$B2`), adresse C64 `$DF02–$DF03`, décalage REU `$DF04–$DF05`, banque
`$DF06`, longueur `$DF07–$DF08`. Le transfert est synchrone (processeur arrêté
pendant le DMA). Nécessite un REU ou un VICE physique : **Paramètres → Matériel
→ Module d’extension RAM**.

### Utilitaires de mémoire

```basic
`fill screen 32` # Remplir la RAM écran de $0400 à $07FF avec la valeur 32 (espace)

`fill color 1` # Remplir la RAM couleur de $D800 à $DBFF avec la valeur 1 (blanc)

`fill $0400, 1000, 32` # Remplir 1000 octets à partir de $0400 avec la valeur 32

`fill addr, 256, 0` # `addr` peut être une variable de type mot

`fill ptr, len_word, val` # Tous les opérandes peuvent être des expressions ou des variables de type mot

`memcopy $C000, $0400, 256` # Copier 256 octets de $C000 vers $0400

`memcopy src_ptr, dst_ptr, 40` # Variables de type mot pour la source et la destination

`drawmem $C000, $0400, 8, 10, 40` # Copier 8×10 rect from $C000 → screen at $0400, stride 40

drawmem src_ptr, dst_ptr, w, h, 40 # variables de mots pour src/dst
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
irq my_handler # Interruption raster à la ligne 0, gestionnaire = nom ou adresse du sous-réseau
irq my_handler, 100 # Interruption raster à la ligne 100 du raster
irq $C800, 200 # Gestionnaire à une adresse fixe
irq addr_word # Adresse du gestionnaire à partir d'une variable de type mot
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

poke $D019, $FF # ACK VIC IRQ

# ... travaillez ici ...

sys $EA81 # JMP vers la fin de l'IRQ du noyau
end
```

Les références anticipées sont prises en charge (`irq my_handler` avant la
définition du sous-programme).

### Gestionnaire NMI

```basic
nmi my_nmi # Définir le vecteur NMI $0318/$0319 sur la sous-routine ou l'adresse du gestionnaire

sub my_nmi()

# ... Traitement NMI ici ...

nmi_exit # JMP $FE47 — sortie NMI correcte (restaure A/X/Y + RTI)
end
```

`nmi handler` écrit l'adresse du gestionnaire dans le vecteur NMI logiciel
(`$0318`/`$0319`). Le vecteur NMI matériel à `$FFFA` pointe vers la routine NMI
du noyau, qui effectue un branchement via `$0318`. Le gestionnaire **doit** se
terminer par `nmi_exit` (émet `JMP $FE47`) ; l'utilisation de `RTI` seul
corrompra la pile. Les références anticipées sont prises en charge.

### IRQ du minuteur CIA1

```basic
cia_timer 19656, my_handler # Minuteur CIA1 A : se déclenche toutes les 19 656 cycles (environ 50 Hz PAL)
cia_timer period, handler # period peut être une variable ou une expression
```

Configure le minuteur CIA1 A comme source d'IRQ périodique via le vecteur
logiciel BASIC (`$0314`/`$0315`) :
1. SEI — désactiver les interruptions
2. `$DC0D = $7F` — désactiver toutes les IRQ CIA1
3. Charger la période 16 bits lo→`$DC04`, hi→`$DC05`
4. Écrire l'adresse du gestionnaire à `$0314`/`$0315`
5. `$DC0D = $81` — activer l'interruption A du minuteur CIA1
6. `$DC0E = $01` — Démarrer le minuteur A en mode continu
7. CLI — réactiver les interruptions

Le gestionnaire doit se terminer par `irq_exit` (ou `sys $EA81`) et doit accuser
réception de l'IRQ CIA1 :

```basic
sub my_handler()

poke $DC0D, $01 # ACK CIA1 timer A IRQ (lecture et efface l'interruption)

# ... traitement ici ...

irq_exit # JMP $EA81 : restauration A/X/Y + RTI
end
```

Synchronisation PAL : horloge = 985 248 Hz. Période pour 50 Hz = 985 248 / 50 =
19 705 cycles ≈ `$4CC9`. Références anticipées prises en charge.

### Gestion des erreurs

```basic
onerr goto err_handler # Définir le vecteur d'erreur d'E/S du noyau ($0300/$0301) sur une étiquette

...

label err_handler

print "ERREUR D'E/S"

bye
```

L'instruction `onerr goto label` écrit l'adresse de l'étiquette (lo, hi) aux
emplacements KERNAL `$0300` et `$0301`. En cas d'erreur d'E/S KERNAL (par
exemple, un échec de `load` ou `open`), le KERNAL exécute `JMP ($0300)`, qui
effectue un branchement vers l'étiquette. Les références anticipées (étiquette
définie après `onerr goto`) sont prises en charge.

### Intégration de fichiers au moment de la compilation (`incbin` skip / longueur nouveau dans la version 1.5.7)

```basic
incbin "sprites.bin" # Incorporer des octets binaires bruts à la position de code actuelle
incbin "charset.bin", $2000 # Incorporer à une adresse absolue, avec remplissage si nécessaire
incbin "font.prg", $3C00, 2 # ...en ignorant les 2 premiers octets (par exemple, l'adresse de chargement d'un fichier .prg)
incbin "big.bin", $4000, 16, 256 # ...en ignorant 16 octets, puis en prenant au maximum 256 octets
include "defs.ub" # Intégrer un autre fichier source .ub (lexicalisé et analysé sur place)
```

`incbin "file", addr, skip [, length]` ignore les `skip` premiers octets du
fichier (généralement l'adresse de chargement de 2 octets d'un `.prg`) et peut
éventuellement prendre au maximum `length` octets ; `skip` et `length` sont des
constantes, et un `skip` au-delà de la fin du fichier constitue une erreur. Le
format d'adresse exige que la cible se situe au-dessus du code généré, ou à
l'intérieur d'un intervalle `org`.

### Données / Lecture

```basic
data 1, 2, 3, 255 # table d'octets constants
read varname # charger l'octet suivant dans varname (déclaration automatique si nécessaire)
```

Toutes les valeurs `data` sont collectées à la compilation. Un pointeur ZP de 2
octets est automatiquement alloué et initialisé au démarrage du programme.
Chaque `read` incrémente le pointeur.

**Tableaux initialisés — `données <tableau> : …` (nouveauté de la version
1.5.8)**

```basic
var sinus = array(8)

data sinus: 128, 218, 255, 218

data sinus: 128, 37, 0, 37 # Les lignes suivantes reprennent là où la précédente s'arrête
print sinus[i] # Accès aléatoire, comme pour n'importe quel tableau

var xpos = array_word(2)

data xpos: 24, 300 # Les tableaux de mots utilisent des valeurs de 16 bits (stockées à lo, hi)
```

Une ligne `data` dont le premier élément est `name:` remplit un tableau `array`
/ `array_word` déclaré, au lieu du flux `read`. Les valeurs sont stockées après
le code et copiées dans le tableau une seule fois, au démarrage du programme
(juste après l'initialisation des tableaux à zéro). Le tableau est donc
entièrement accessible en écriture et indexé comme n'importe quel autre tableau.
Un nombre de valeurs supérieur à la capacité du tableau, ou un nom non déclaré,
provoque une erreur de compilation. Ces lignes n'affectent pas `read`.

### Assemblage en ligne

```basic
sys $FFD2 # JSR $FFD2
sys $FFD2, 7 # LDA #7 ; JSR $FFD2 (transmission de la valeur d'un octet dans le registre A)
irq_exit # JMP $EA81 — sortie correcte du gestionnaire d'interruption (restauration de A/X/Y + RTI)
asm $EA, $EA # octets bruts en ligne (NOP NOP) — format hérité
asm {

; Mnémoniques et modes d'adressage complets du 6502

LDA #$07 ; immédiat

STA $0286 ; absolu

LDA $50 ; page zéro ($50 ≤ $FF → ZP sélectionné automatiquement)

STA $0400,X ; absolu, indexé X

LDA ($50),Y ; (indirect),Y

LDA ($50,X) ; (indirect,X)

JSR $FFD2 ; appel de sous-programme

JMP $C000 ; Saut absolu

JMP ($FFFC) ; saut indirect

CLC
ADC n° 1

SEC

SBC n° 1

TAX ; implicite / transfert

ASL A ; accumulateur (ou simplement : ASL)

LSR A

ROL
ROR

; Branchements — l'opérande est une adresse absolue ; le décalage est calculé automatiquement

BNE boucle ; branchement avant ou arrière vers l'étiquette locale

BEQ terminé

boucle :

NOP
terminé :

RTS

; #<étiquette / #>étiquette — octet de poids faible / octet de poids fort d'une adresse d'étiquette

LDA #<gestionnaire

STA $0314

LDA #>gestionnaire

STA $0315

; * — emplacement assembleur actuel

JMP *

; Octets hexadécimaux bruts (rétrocompatible avec l'ancienne syntaxe asm { $xx ... })

$EA $EA ; deux octets NOP
}
```

**Modes d'adressage :**

| Syntaxe         | Mode         | Octets | Exemple                             |
| --------------- | ------------ | ------ | ----------------------------------- |
| (sans opérande) | Implicite    | 1      | `NOP`, `RTS`                        |
| `A`             | Accumulateur | 1      | `ASL A`, `LSR`                      |
| `#valeur`       | Immédiat     | 2      | `LDA #$07`                          |
| `$zz` (0–255)   | Page zéro    | 2      | `LDA $50`                           |
| `$zz,X`         | ZP,X         | 2      | `LDA $50,X`                         |
| `$zz,Y`         | ZP,Y         | 2      | `LDX 50 $,Y`                        |
| `$xxxx`         | Absolu       | 3      | `LDA $0400`                         |
| `$xxxx,X`       | Absolu,X     | 3      | `LDA $0400,X`                       |
| `$xxxx,Y`       | Absolu,Y     | 3      | `LDA $0400,Y`                       |
| `($xxxx)`       | Indirect     | 3      | `JMP ($FFFC)`                       |
| `($zz,X)`       | (Indirect,X) | 2      | `LDA ($50,X)`                       |
| `($zz),Y`       | (Indirect),Y | 2      | `LDA ($50),Y`                       |
| `étiquette`     | Relatif      | 2      | `BNE label` (succursales seulement) |

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

poke $D020, border_col # UltimateBasic résout l'adresse ZP

poke $D021, bg_col

asm {

; les valeurs sont déjà dans $D020 / $D021

LDA $D020

} end
```

Pour les routines entièrement écrites en assembleur — notamment les
gestionnaires d'interruptions qui doivent s'interférer entre eux — placez tous
les gestionnaires dans un **unique bloc `asm { }` de niveau supérieur** dans le
programme principal. Les étiquettes d'un même bloc partagent la même portée ;
ainsi, `irq1` et `irq2` peuvent se référencer librement. Voir
`examples/raster_irq_demo.ub`.

### Chaîne ↔ entier

```basic
numstr score, $0340 # écrit "042\0" à l'adresse $0340 (toujours 3 chiffres, complétés par des zéros)
var n = str_to_int("42") # à la compilation : Expr::Number(42)

print str$(score) # affiche un entier 8 bits sous forme de chaîne décimale à 3 chiffres ("000"–"255")
print "Score : " + str$(score) # utilisable dans un contexte d'affichage par concaténation de chaînes
var s: string = str$(n) # assigne le résultat de str$() à une variable de type chaîne (tampon statique partagé)
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

| Déposer                                 | Description                                                                                         |
| --------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `exemples/fonctionnalités.ub`           | const, label/goto, poke/peek, rnd, fonctions mathématiques                                          |
| `exemples/nouvelles_fonctionnalités.ub` | sous-paramètres, tableaux, variables de mots, variables de chaînes de caractères                    |
| `exemples/bitmap_demo.ub`               | Image bitmap 320×200, tracé, affichage graphique activé/désactivé                                   |
| `exemples/block_demo.ub`                | Graphiques de blocs 80×50, plot4, circle4, graphiques sur bloc                                      |
| `exemples/joystick_demo.ub`             | lecture du joystick, mouvement des sprites                                                          |
| `exemples/mux_demo.ub`                  | Multiplexeur de sprites raster (3 fenêtres × 8 sprites = 24)                                        |
| `exemples/orbit_demo.ub`                | Orbite de 24 sprites avec rayon pulsant et couleurs aléatoires                                      |
| `exemples/plasma_demo.ub`               | Image bitmap à effet plasma avec animation de bordure à barres raster                               |
| `exemples/sprite_data.ub`               | Données de forme sprdef (incluses par d'autres démos)                                               |
| `exemples/sprite_mux_orbit.ub`          | Démonstration d'orbite à 24 sprites avec sprdef + positions précalculées                            |
| `exemples/sprite_orbit_demo.ub`         | 8 sprites matériels en orbite circulaire via une table sin/cos                                      |
| `exemples/reu_bitmap_demo.ub`           | REU stockage/récupération avec graphismes bitmap                                                    |
| `exemples/sid_music_demo.ub`            | Lecteur de musique SID avec IRQ raster et sortie clavier                                            |
| `exemples/tenprint.ub`                  | 5 implémentations de labyrinthe TENPRINT avec menu ; démos `lowercase` mode de jeu de caractères    |
| `exemples/démo_compte_à_rebours.ub`     | Compte à rebours `for..next` avec pas négatif, incl. `for i = 20 to 0 step -2`                      |
| `exemples/countdown_errors_demo.ub`     | Erreur de compilation pour l'étape par défaut `from > to`                                           |
| `exemples/explicit_demo.ub`             | Démonstration de l'option CLI `--explicit` avec les options `var`, `sub` et `fn` entièrement typées |
| `exemples/explicit_errors_demo.ub`      | Code mal structuré qui se compile sans `--explicit`, erreurs avec                                   |

## Référence CLI

```
ub build <input.ub> [OPTIONS]

-o, --output <fichier> Générer un fichier .prg ou .crt (par défaut : <input>.prg)

-v, --verbose Afficher la mise en page initiale et le dump hexadécimal du code

--no-stub Ignorer le stub BASIC SYS (le code se charge à l'adresse $0801)

--debug Générer également les fichiers de débogage .sym, .dbg et .vs

--asm Générer également une liste .asm lisible (génération de code 6502)

--d64 [fichier] Générer également une image disque .d64 ;

sans nom de fichier, le fichier par défaut est <output>.d64

--add <fichier> Ajouter un fichier supplémentaire à l'image disque .d64 ;

cette option peut être répétée pour plusieurs fichiers

--explicit Exiger le type pour chaque variable, sous-paramètre et paramètre de fonction

-h, --help Afficher l'aide
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

| Formulaire de déclaration                                     | Sans `--explicit` | Avec `--explicit`       |
| ------------------------------------------------------------- | ----------------- | ----------------------- |
| `var name = expr` (pas de `:type`)                            | ok — type déduit  | erreur                  |
| `var name: int = expr` (ou mot/flottant/chaîne de caractères) | d'accord          | d'accord                |
| `var arr = array(N)`                                          | ok — type déduit  | erreur                  |
| `var arr = array_word(N)`                                     | d'accord          | d'accord                |
| `const NAME = value`                                          | d'accord          | OK — inchangé           |
| `sub foo(a, b)` (paramètres non typés)                        | d'accord          | OK — inchangé           |
| `sub foo(a: int, b: int)`                                     | d'accord          | OK — inchangé           |
| `fn foo(a): int` (paramètre non typé)                         | d'accord          | erreur sur le paramètre |
| `fn foo(a: int): int`                                         | d'accord          | d'accord                |
| `fn foo(a): int` (paramètre non typé)                         | d'accord          | erreur sur le paramètre |
| `fn foo(a: int): int`                                         | d'accord          | d'accord                |

Les déclarations de constantes et de tableaux sont toujours acceptées — leur
type est fixé par la forme de déclaration, donc `:type` serait redondant.

**Exemple de sortie d'erreur :**

```
$ ub build myprog.ub --explicit

Erreurs de compilation :

ligne 14 : mode « explicite » : « var loose » n’a pas de type — utilisez « var loose : int|word|float|string »

ligne 16 : mode « explicite » : le paramètre « a » n’a pas de type — utilisez « a : int|word|float|string »
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
| `démo.vs`  | Fichier de commandes du moniteur VICE contenant les commandes `al` pour les étiquettes d'adresse                   |

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

Pour un fichier de sortie nommé `demo.prg`, cela crée `demo.asm`. Le listing est
généré à partir des métadonnées collectées lors de la génération du code machine
par Ultimate Basic ; il ne s’agit pas d’un simple désassemblage du PRG final. Il
contient :

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
.label x = $02 ; int

* = $080D

ub_start:

cld ; $080D: D8

; UB: var x

lda #$01 ; $080E: A9 01

sta x ; $0810: 85 02
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
demo.ub → demo.prg (386 octets)

Chargement : $080D – $0989

Variables (page zéro) :

score ZP : $08 octet

lives ZP : $0A octet

msg ZP : $0C chaîne de caractères

ptr ZP : $0E mot

Sous-programmes :

greet $0900

show $0912

Tableaux (à partir de $C000) :

sprites $C000 8 octets
```

Avec `-v`, la sortie affiche en plus les allocations ZP internes et un dump
hexadécimal complet.

### Code généré (optimisé en version 1.6.0)

Le générateur de code produit un code 6502 plus concis pour les cas courants ;
les programmes ne nécessitent aucune modification :

- Les conditions dans `if` / `while` / `until` / `select` sont un `CMP` suivi
  d'une branche (aucune valeur 0/1 n'est construite ni testée à nouveau). `x
  &gt; n` est compilé comme `x &gt;= n+1` ; les comparaisons `and` / `or` sont
  court-circuitées lorsque le membre de droite n'a pas d'effets de bord ;
  `while` effectue des tests à la fin de la boucle.
- Les constantes et les variables d'octet sont des opérandes directs (`ADC #n`,
  `CMP zp`); `poke` à une constante ou `word` stockent directement l'adresse.
- Les tableaux avec un index variable utilisent l'adressage `base,Y` au lieu
  d'un pointeur de page zéro.
- Lorsqu'une instruction commence par charger la variable que l'instruction
  précédente vient de stocker, le `LDA` redondant est ignoré.

Utilisez `--asm` pour voir le code généré pour votre propre programme.

## Limitations connues

| Fonctionnalité                           | Limitation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Arithmétique des entiers                 | 8 bits non signés (0–255) ; les variables `word` contiennent des valeurs de 16 bits                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Budget de page zéro                      | La page d'initialisation permanente est `$02–$4F` (78 octets) : chaque variable et paramètre de sous-routine/fonction occupe 2 octets, et chaque boucle `for` en cours d'exécution occupe 2 octets supplémentaires (libérés à la fin de la boucle si son corps ne déclare aucune variable). Un dépassement de cette page provoque une erreur de compilation (`out of zero page`, nouveauté de la version 1.5.7) ; auparavant, la zone de travail était écrasée silencieusement. Réutilisez les variables dans les grands programmes. |
| Littéraux binaires                       | Seuls les littéraux binaires `$hex` et décimaux ne sont pas pris en charge ; `%` ne sont pas pris en charge                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Sous-programmes                          | Pas de récursion — les emplacements des paramètres ZP sont alloués statiquement                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Variables de type chaîne                 | Read-only after init; assignment replaces the pointer, not the data                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Exécution de la concaténation de chaînes | `s1 + s2` s'affiche séquentiellement — sans allocation de mémoire ni suivi de longueur                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `rnd()` / `rnd(n)`                       | LCG simple, non cryptographique ; période = 256                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `abs()` / `sgn()` / `min()` / `max()`    | Valeurs 8 bits uniquement ; `abs`/`sgn` traitent les valeurs comme signées (bit 7 = négatif → `abs` complément à deux, `sgn` renvoie `$FF`) ; `min`/`max` sont non signées (0–255).                                                                                                                                                                                                                                                                                                                                                  |
| `plan`                                   | Les pixels hors plage sont écrêtés silencieusement (Y ≥ 200 ou X ≥ 320 → aucune opération).                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `mplot`                                  | Aucune vérification des limites — x doit être compris entre 0 et 159, y doit être compris entre 0 et 199                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `mline` / `mrect`                        | Multicolore ; x : 0–159, y : 0–199. Les pixels hors écran sont répétitifs (pas de découpage) — les coordonnées restent dans la plage.                                                                                                                                                                                                                                                                                                                                                                                                |
| `mcircle`                                | Multicolore ; les points hors écran (x ≥ 160 ou y ≥ 200 sont ignorés)                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `stylo de couleur`                       | Résolution uniquement ; définit la valeur de premier plan des cellules sélectionnées (l'arrière-plan est préservé). Sans effet en mode bloc (`plot4`/`circle4`).                                                                                                                                                                                                                                                                                                                                                                     |
| `rect`                                   | Aucune vérification des limites — x : 0–319, y : 0–199 ; x1≤x2 et y1≤y2 ne sont pas appliqués (les rectangles dégénérés/inversés produisent une sortie indéfinie)                                                                                                                                                                                                                                                                                                                                                                    |
| `plot4`                                  | Aucune vérification des limites — x doit être compris entre 0 et 79, y doit être compris entre 0 et 49 (mode bloc)                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `cercle4`                                | Découpe les pixels hors écran ; le rayon utile est d'environ 0 à 49 en mode bloc 80×50.                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `chr$`                                   | Aucune correspondance PETSCII↔ASCII — n est transmis tel quel à CHROUT                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `musique jouer`                          | Nécessite `load sid` ou un bloc `tune` ; un seul wrapper CIA1 est émis (le dernier `music play` l'emporte)                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `graphiques sur double`                  | Résolution uniquement ; utilise `$4000–$7FFF` pour le tampon arrière, le code du programme doit donc rester en dessous de `$4400` ; non compatible avec les sprites ou les couleurs multiples                                                                                                                                                                                                                                                                                                                                        |
| Signalement des erreurs                  | Uniquement à la compilation ; `onerr goto` gère les erreurs d'E/S du noyau à l'exécution                                                                                                                                                                                                                                                                                                                                                                                                                                             |
