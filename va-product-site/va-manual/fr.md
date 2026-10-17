# Manuel d'utilisation de l'assembleur visuel C64

**Version 2.6.1**

Un assembleur 6502 visuel et basé sur des blocs pour le Commodore 64. Créez des
programmes en faisant glisser et en déposant des blocs d'instructions, et
visualisez en temps réel le code assembleur et le code machine générés.

---

## Table des matières

- [C64 Visual Assembler — Manuel de
  l'utilisateur](#c64-visual-assembler--user-manual)
    - [Points saillants de la version 2.6.1](#version-261-highlights)
    - [Points saillants de la version 2.6.0](#version-260-highlights)
    - [Points saillants de la version 2.5.9](#version-259-highlights)
    - [Points saillants de la version 2.5.8](#version-258-highlights)
    - [Points saillants de la version 2.5.7](#version-257-highlights)
    - [Points saillants de la version 2.5.6](#version-256-highlights)
    - [Points saillants de la version 2.5.5](#version-255-highlights)
    - [Points saillants de la version 2.5.4](#version-254-highlights)
    - [Points saillants de la version 2.5.3](#version-253-highlights)
    - [Points saillants de la version 2.5.2](#version-252-highlights)
    - [Points saillants de la version 2.5.1](#version-251-highlights)
    - [Points saillants de la version 2.5.0](#version-250-highlights)
    - [Points saillants de la version 2.4.9](#version-249-highlights)
    - [Points saillants de la version 2.4.8](#version-248-highlights)
    - [Points saillants de la version 2.4.7](#version-247-highlights)
    - [Points saillants de la version 2.4.6](#version-246-highlights)
    - [Points saillants de la version 2.4.5](#version-245-highlights)
    - [Points saillants de la version 2.4.3](#version-243-highlights)
    - [Points saillants de la version 2.4.2](#version-242-highlights)
    - [Points saillants de la version 2.4.1](#version-241-highlights)
    - [Points saillants de la version 2.4.0](#version-240-highlights)
    - [Points saillants de la version 2.3.9](#version-239-highlights)
  - [Table des matières](#table-of-contents)
  - [1. Aperçu de l'interface](#1-interface-overview)
  - [2. Palette de blocs](#2-block-palette)
  - [3. Domaine du programme](#3-program-area)
    - [Entrée de l'opérande](#operand-input)
  - [4. Vue ASM](#4-asm-view)
    - [Modes de sortie](#output-modes)
    - [Onglet Outils](#toolkit-tab)
    - [Onglet Options](#options-tab)
    - [Clic sur une ligne ASM](#clicking-an-asm-line)
    - [Numéros de ligne ASM](#asm-line-numbers)
    - [Module de progression de la compilation](#compile-progress-modal)
  - [5. Paramètres et barre d'outils](#5-settings--toolbar)
    - [Contrôle de version](#version-control)
    - [Libre et open source](#free-and-open-source)
    - [Signaler un bug](#reporting-a-bug)
    - [Fenêtre mémoire et utilisation de page
      nulle](#memory-window-and-zero-page-usage)
    - [Modèles de projet](#project-templates)
    - [Construire le projet](#build-project)
    - [Exemples de programmes](#example-programs)
    - [Charger le fichier .asm (référence
      rapide)](#load-asm-file-quick-reference)
      - [Notes d'analyse et bonnes pratiques
        d'importation](#import-parsing-notes-and-best-practices)
  - [Mode UltimateBasic](#ultimatebasic-mode)
    - [Ouverture de l'éditeur UB](#opening-the-ub-editor)
    - [Outils de l'éditeur](#editor-tools)
    - [Projets, onglets et fichiers de
      démarrage](#projects-tabs-and-startup-files)
    - [ Construction et diagnostic](#building-and-diagnostics)
    - [Taille du code par ligne et indications](#code-size-per-line-and-hints)
    - [Running, D64 et Exomizer](#running-d64-and-exomizer)
    - [Symboles du débogueur et
      désassemblage](#debugger-symbols-and-disassembly)
    - [Manuel et source d'Ultimate Basic](#ultimate-basic-manual-and-source)
  - [6. Mode expert](#6-expert-mode)
    - [Changement de mode](#switching-modes)
    - [Mise en page de l'éditeur](#editor-layout)
    - [Boutons de la barre d'outils](#toolbar-buttons)
    - [Nombre de cycles](#cycle-counts)
    - [Conseils d'optimisation](#optimisation-hints)
    - [Surlignage des erreurs](#error-highlighting)
    - [Surlignage syntaxique](#syntax-highlight)
    - [Formateur de source](#source-formatter)
    - [Panneau Projet & onglets](#project-panel--tabs)
    - [Barre d'onglets](#tab-bar)
  - [7. Modes d'adressage](#7-addressing-modes)
    - [Étiqueter les expressions comme
      opérandes](#label-expressions-as-operands)
    - [Le compteur de programme `*` dans les
      expressions](#the--program-counter-in-expressions)
    - [Étiquettes locales (pointillées)](#local-dotted-labels)
    - [Étiquettes d'opérandes à code
      auto-modifiable](#self-modifying-code-operand-labels)
  - [8. Instructions standard 6502](#8-standard-6502-instructions)
    - [Mouvement de données](#data-movement)
    - [Arithmétique](#arithmetic)
    - [Logique](#logic)
    - [Sauts et Branches](#jumps--branches)
    - [LBNE / LBEQ / … (Branches longues)](#lbne--lbeq---long-branches)
    - [Opérations d'enregistrement](#register-operations)
    - [Maj & Rotation](#shift--rotate)
    - [Pile](#stack)
    - [Système / Drapeaux](#system--flags)
    - [Instructions illégales / non
      documentées](#illegal--undocumented-instructions)
  - [9. Blocs macro — Référence](#9-macro-blocks--reference)
    - [LABEL](#label)
    - [COMMENTAIRE](#comment)
    - [OCTE](#byte)
    - [MOT](#word)
    - [REMPLACER](#fill)
    - [ALIGN](#align)
    - [TEXTE 1}
    - [CHAÎNE](#string)
    - [DONNÉES](#data)
    - [RAWBYTES](#rawbytes)
    - [RAWTEXT](#rawtext)
    - [PETSCII](#petscii)
    - [CHARSET](#charset)
    - [CHARDEF](#chardef)
    - [BOX_HIT](#box_hit)
    - [INCBIN](#incbin)
    - [KOALA](#koala)
    - [NIVEAU / NIVEAU\_LIGNE](#level--level_row)
      - [NIVEAU](#level)
      - [NIVEAU\_LIGNE](#level_row)
    - [SID](#sid)
    - [INCLURE](#include)
    - [TABLEAU](#table)
    - [ORG](#org)
    - [BOUCLE / SUIVANT](#loop--next)
      - [LOOP](#loop)
      - [SUIVANT](#next)
    - [POUR / FIN](#for--endf)
      - [POUR](#for)
      - [ENDF](#endf)
    - [POUSSER / TIRER](#push--pull)
      - [POUSSER](#push)
      - [TIRER](#pull)
    - [END / alias RTS](#end--rts-alias)
    - [MACRO / ENDM / INVOKE](#macro--endm--invoke)
      - [MACRO (début de la définition)](#macro-definition-start)
      - [ENDM (fin de définition)](#endm-definition-end)
      - [INVOQUER](#invoke)
    - [RÉGION / ENDRÉGION](#region--endregion)
    - [DEFINE / IF / ELSE / ENDIF](#define--if--else--endif)
    - [.ASSERT](#assert)
      - [DÉFINIR](#define)
      - [SI](#if)
      - [SINON](#else)
    - [ENDIF](#endif)
    - [CONST](#const)
    - [VAR](#var)
    - [Exécution IF / ELSE / ENDIF](#runtime-if--else--endif)
    - [TANT QUE / FIN](#while--endw)
    - [RÉPÉTER / JUSQU'À](#repeat--until)
    - [MEMCPY / MEMSET](#memcpy--memset)
    - [IMPRIMER / IMPRIMER_CARACTÈRE / IMPRIMER_HEX / EFFACER_ÉCRAN /
      ATTENDRE_TOUTE / RETARDER / DÉFINIR_BORDURE /
      DÉFINIR_FOND_ARRIÈRE](#print--print_char--print_hex--clear_screen--wait_key--delay--set_border--set_bg)
    - [IRQ_SETUP](#irq_setup)
    - [RAND](#rand)
    - [SPRITE\_INIT](#sprite_init)
    - [SPRITE_POS](#sprite_pos)
    - [ATTENDRE_RASTER](#wait_raster)
    - [JOYSICK](#joystick)
    - [SOURIS](#mouse)
    - [SPRITE_COL](#sprite_col)
    - [CHARGEMENT DE FICHIER](#loadfile)
    - [EXODECRUNCH](#exodecrunch)
    - [REU\_CHECK](#reu_check)
    - [REU_STASH / REU_FETCH / REU_SWAP](#reu_stash--reu_fetch--reu_swap)
    - [TURBO_SET](#turbo_set)
    - [SUPERCPU_DÉTECT](#supercpu_detect)
    - [TURBO\_ENABLE](#turbo_enable)
    - [MAP_COPY](#map_copy)
    - [MAP_COPY16X16](#map_copy16x16)
    - [SPRITE_ANIM](#sprite_anim)
    - [SCORE_BCD](#score_bcd)
  - [10. Intégration du débogueur](#10-debugger-integration)
    - [RetroDebugger](#retrodebugger)
    - [Blocs de points de rupture](#breakpoint-blocks)
    - [Indicateurs du débogueur (onglet Options)](#debugger-flags-options-tab)
    - [VICE Monitor (rechargement rapide, visionnage en direct,
      profileur)](#vice-monitor-hot-reload-live-watch-profiler)
  - [11. Liens vers la base de connaissances](#11-knowledge-base-links)
  - [12. Exportation et exécution D64](#12-d64-export--run)
    - [Bouton Course fractionnée](#split-run-button)
    - [Exporter vers la boîte de dialogue D64](#export-to-d64-dialog)
    - [Métadonnées D64 dans les projets](#d64-metadata-in-projects)
  - [12b. Exportation CRT (cartouche Magic Desk
    64K)](#12b-crt-export-magic-desk-64k-cartridge)
  - [13. Paramètres matériels](#13-hardware-settings)
    - [Émulateur VICE](#vice-emulator)
    - [Exomizer](#exomizer)
    - [Débogueur rétro](#retro-debugger)
    - [C64 Ultimate / 1541 Ultimate](#c64-ultimate--1541-ultimate)
    - [Kung Fu Flash 2](#kung-fu-flash-2)
  - [14. Éditeurs visuels (boîte à outils)](#14-visual-editors-toolkit)
    - [Éditeur haute résolution / multicolore](#hi-res--multicolor-editor)
    - [Éditeur de sprites](#sprite-editor)
    - [Navigateur ROM de caractères C64 ("Carte des
      caractères")](#c64-character-rom-browser-char-map)
    - [Éditeur de caractères (Charset)](#character-editor-charset)
    - [Éditeur de canevas de jeu de caractères](#charset-canvas-editor)
    - [Éditeur de cartes (Cartes de tuiles
      multicouches)](#map-editor-multilayer-tilemaps)
    - [Éditeur de niveau](#level-editor)
    - [Éditeur SID (Suivi à 3 voix)](#sid-editor-3-voice-tracker)
    - [SID Player](#sid-player)
    - [Éditeur de courbes](#curve-editor)
    - [Générateur de tableau](#table-generator)
    - [Convertisseur de nombres](#number-converter)

---

## Points saillants de la version 2.6.1

- **Nombre de cycles en mode Expert** — une marge indique le nombre de cycles de
  chaque instruction, le total de la sélection et le nombre de lignes raster
  nécessaires. Voir [Nombre de cycles](#cycle-counts).
- **Conseils d'optimisation** — l'éditeur Expert signale les lignes qui peuvent
  être raccourcies ou accélérées (appel terminal, `CMP #0` redondants,
  rechargements, `INC` / `DEC`…). Voir [Conseils
  d'optimisation](#optimisation-hints).
- **Générateur de tables** — adresses de lignes d'écran/bitmap, masques de
  pixels, tables de multiplication/division, quarts de carrés,
  logarithmes/exponentielles, inversion de bits, expressions personnalisées et
  code de vitesse de remplissage/copie déroulé. Voir [Générateur de
  tables](#table-generator).
- **VICE Monitor** — rechargement à chaud dans VICE en cours d'exécution,
  surveillance en direct des étiquettes et des adresses, et profileur
  d'échantillonnage PC. Voir [VICE
  Monitor](#vice-monitor-hot-reload-live-watch-profiler).
- **Carte d'utilisation de la page zéro** et une **fenêtre de mémoire
  détachable**. Voir [Fenêtre de mémoire et utilisation de la page
  zéro](#memory-window-and-zero-page-usage).
- **Ultimate Basic** — taille du code par ligne, astuces et éditeur de sprites →
  Exportation Ultimate Basic avec animation.
- **Éditeur SID → exportation .sid (PSID)** et un **modèle de projet de
  multiplexeur de sprites** (16 sprites).
- Plusieurs fenêtres flottantes peuvent être ouvertes simultanément ; celle sur
  laquelle vous cliquez passe au premier plan.

---

## Points forts de la version 2.6.0

- Visual Assembler est désormais entièrement gratuit — la licence
  Freemium/Professionnelle a été supprimée. Tous les éditeurs, options de
  compilation et d'exécution matérielle, les 7 langues d'interface utilisateur
  et tous les thèmes fonctionnent pour tous, sans inscription ni numéro de
  série. La raison est simple : selon la législation fiscale hongroise, la vente
  du logiciel ne permettrait pas de dégager un revenu suffisant après impôts et
  formalités administratives. Les numéros de série que vous possédez déjà ne
  sont plus nécessaires. Voir [Logiciel libre et
  gratuit](#free-and-open-source).

---

## Points forts de la version 2.5.9

- **Thème Commodore 64** — l'écran de mise sous tension du C64 : une bordure
  bleu clair autour des panneaux bleus, du texte bleu clair, des boutons de
  vidéo inversée, des couleurs de syntaxe de la palette C64 et la police C64
  dans la vue moniteur.
- Thème Commodore Beige ** — le classique : boîtier beige, touches de fonction
  moutarde, rayures arc-en-ciel et affichage bleu C64. Choisissez-le dans le
  sélecteur de thèmes ou basculez entre eux avec le bouton de thème. Voir
  [Paramètres et barre d'outils](#5-settings--toolbar).
- **Thème Commodore Starlight** — un thème clair inspiré du C64 Breadbin
  translucide : verre clair dépoli avec la lueur RGB arc-en-ciel qui brille à
  travers, un accent magenta, des couleurs de syntaxe arc-en-ciel et une vue de
  moniteur sombre et fumée.
- **Boîte de dialogue de contrôle de version** — La boîte de dialogue peut être
  déplacée par son en-tête et se rouvre à l'endroit où vous l'avez laissée ;
  elle reste affichée à l'écran même si le journal ou une comparaison
  l'agrandit, et un clic en dehors de celle-ci ne la ferme plus (la touche Échap
  le fait). Voir [Contrôle de version](#version-control).
- **Contrôle de version au niveau du projet** — Pour un onglet d'un projet
  `.proj` ouvert, un changement de menu **Fichier / Projet** enregistre tous les
  fichiers sources du projet (arborescence du projet + fichiers inclus) dans une
  seule entrée. Le journal liste les fichiers modifiés à chaque commit, l'outil
  Diff traite les modifications fichier par fichier, l'outil Checkout restaure
  tous les fichiers dans les onglets de l'éditeur et des entrées de sauvegarde
  automatique sont également créées pour chaque projet. En mode Git, le journal
  et l'outil Diff couvrent l'ensemble du dépôt. Voir [Mode
  Projet](#project-mode).

---

## Points forts de la version 2.5.8

- **Contrôle de version** — Les instantanés du projet sont désormais gérés par
  un système de contrôle de version similaire à Git : chaque commit contient un
  message et un hachage court ; un journal inclut **HEAD** ; une comparaison
  **Diff** avec la copie de travail ; une extraction ** dans l’éditeur ; et des
  entrées de sauvegarde automatique distinctes. Les programmes en mode bloc
  (JSON) sont comparés comme des lignes d’assemblage, ce qui permet d’afficher
  les modifications réelles dans la comparaison. Fonctionne avec les onglets
  Bloc, Expert et Basique Ultime. Voir [Contrôle de version](#version-control).
- **Intégration Git** — choisissez `git.exe` dans **Paramètres → Contrôle de
  version** (ou laissez l'application le trouver). Lorsque le projet se trouve
  dans un dépôt Git, la boîte de dialogue affiche la branche, les fichiers
  modifiés, le commit (enregistre d'abord), le journal, le diff avec une vue
  **RAW**, l'extraction, **Pull** / **Push** et **git init**.
- **Signaler un bug** — un formulaire de signalement intégré permettant
  d'ajouter jusqu'à 4 captures d'écran (fichier, Ctrl+V ou glisser-déposer), une
  adresse e-mail facultative, des informations système et les erreurs récentes
  de l'application. Voir [Signaler un bug](#reporting-a-bug).
- **SID Player** — **Lecture aléatoire** et **Favoris** (★) par morceau. Voir
  [SID Player](#sid-player).

---

## Points forts de la version 2.5.7

- **VA SID Core 1.2** — Le lecteur SID utilise désormais un cœur Rust C64 natif
  : un processeur 6510 à cycle précis avec gestion précise des interruptions, le
  CIA 6526A, la gestion des interruptions VIC-II avec gestion des lignes
  défectueuses, le DMA des sprites et les interruptions raster, ainsi que le
  port d’E/S du 6510. Voir [SID Player](#sid-player).
- **Éditeur haute résolution** — deux couleurs dans chaque cellule 8×8 : le
  nouvel outil **Papier cellulaire**. Voir [Éditeur haute résolution /
  multicolore](#hi-res--multicolor-editor).
- **ROM de personnage exacte** dans le visualiseur de ROM, l'éditeur de
  personnages **Charger ROM** et les éditeurs de carte / niveau.
- **Éditeur de sprites** — superposition haute résolution, remplissage,
  sélection/déplacement, rotation, symétrie, importation de feuilles de sprites,
  hitbox, aperçu X/Y ×2. Voir [Éditeur de sprites](#sprite-editor).
- **Éditeur de niveaux** — objets, attributs de personnages, vérification des
  bords, couleurs par écran, jauge de mémoire avec RLE, Exécuter dans VICE. Voir
  [Éditeur de niveaux](#level-editor).
- Éditeur de personnages ** : annulation/rétablissement, outils de dessin,
  rotation à 90°, copier/coller et glisser-déposer sur la carte, tuiles 2×2,
  ensemble ROM en minuscules, aperçu du texte et exportation de plage. Voir
  [Éditeur de personnages](#character-editor-charset).
- **Caractère Canvas** — zoom 2×–24× (curseur ou Ctrl+molette) avec une grille
  de pixels, couleur d'arrière-plan en mode haute résolution, caractères haute
  résolution en mode multicolore et **ECM** (un arrière-plan par caractère).
  Voir [Éditeur de caractère Canvas](#charset-canvas-editor).

---

## Points forts de la version 2.5.6

- **SID Player** — un nouveau bouton de barre d'outils ouvre un lecteur flottant
  pour les morceaux `.sid` (PSID / RSID) : une liste de lecture avec
  glisser-déposer, morceau précédent/suivant, sous-morceaux, avance/déplacement
  (±10 s), volume et sauvegarde/ouverture de la liste de lecture (`.sidpl`) ; la
  liste et l'état de la fenêtre sont mémorisés. Voir [SID Player](#sid-player).
- **VA SID Core 1.1** — émulation SID intégrée (MOS 6581/8580, avec filtre 6581
  basé sur MOS 6581/8580) et lecteur PSID/RSID à cycle verrouillé (processeur
  6510, synchronisation CIA/VIC). Sélectionnez-le dans **Paramètres → Aperçu
  SID** ; le lecteur SID indique le moteur en cours de lecture.
- **Éditeur SID** — potentiomètres pour les paramètres de l'instrument,
  graphique ADSR plus large, **entrée MIDI**, **enregistrement** dans le tracker
  (un nouveau motif est ajouté lorsque le motif actuel est plein), un
  **métronome** avec témoins lumineux de rythme, **suppression de motif**, le
  volume principal sur VA-VK et **Importer GoatTracker .sng**. Voir [Éditeur
  SID](#sid-editor-3-voice-tracker).
- **Ultimate Basic 1.6.4** inclus.

---

## Points forts de la version 2.5.5

- **Éditeur haute résolution : grille de pixels et zoom 16×** — avec **Grille**
  activée, à partir d’un zoom 4×, chaque pixel possède sa propre ligne de
  grille, plus épaisse sur les bords des cellules de caractères et ombrée pour
  rester visible sur les 16 couleurs. Le curseur de zoom va maintenant jusqu’à
  16×. Voir [Éditeur haute résolution /
  multicolore](#hi-res--multicolor-editor).
- **Clic droit > Menu Copier/Coller** — sur la zone de travail des éditeurs
  Haute résolution et Carte (Copier, Coller, Collage transparent) et dans
  l'éditeur Sprite (Copier l'image, Coller l'image, également sur la bande
  d'images). Le collage démarre à partir de l'aperçu du menu contextuel où vous
  avez cliqué.
- **Convertisseur de nombres** — son bouton de barre d'outils reste mis en
  surbrillance pendant que le convertisseur est affiché.
- **Corrigé** — la grille de cellules multicolores de l'éditeur haute résolution
  était deux fois plus large qu'une cellule de caractère ; le bouton Coller de
  la barre d'outils haute résolution **Coller** collait toujours de manière
  transparente ; le menu contextuel de l'éditeur SID s'ouvrait loin du curseur
  lorsque la boîte de dialogue était centrée.
- **Ce manuel** décrit maintenant la sélection, le copier/coller et le collage
  transparent de l'éditeur haute résolution.

---

## Points forts de la version 2.5.4

- **Corrigé : fenêtre non affichée au redémarrage** — Si l’application était
  fermée avec sa fenêtre réduite ou masquée (principalement sous macOS, mais
  aussi sous Linux/Wayland), le prochain lancement pouvait se faire sans
  fenêtre. L’état d’affichage n’est plus enregistré (sa taille l’est toujours),
  et la fenêtre est toujours affichée au démarrage.
- **Ultimate Basic 1.6.3 intégré** — Syntaxe de style QBasic : `dim nom as type`
  pour les variables et les tableaux de tous types, `function` / `sub` avec `as`
  types, `elseif`, `do … loop`, `while … wend`, `select case`, `exit do` / `exit
  sub`, `if` sur une seule ligne, `'` commentaires et `print a; b; c`; chaînes
  d'exécution (`+`, `left$` / `right$` / `mid$`) et entier signé 16 bits ``.
  Sélectionné, complété et formaté dans l'éditeur UB, avec de nouvelles entrées
  **DIM**, **FUNCTION**, **ELSEIF**, **DO**, **WEND**, **SELECT CASE**, **END**,
  **EXIT SUB** et **LEFT$** / **RIGHT$** / **MID$** dans le panneau Commandes.
  Voir [UltimateBasic Mode](#ultimatebasic-mode).

---

## Points saillants de la version 2.5.2

- **L'éditeur SID permet de prévisualiser l'instrument sur le SID réel** :
  prévisualisation, clavier virtuel, saisie de notes, accords/arpèges, lecture
  de séquences et de motifs individuels via WebSid ; le synthétiseur n'est
  utilisé qu'en dernier recours. Voir [Éditeur SID]{1}.

---

## Points saillants de la version 2.5.1

- **Éditeur SID Instruments** — routage des filtres par voix, **3 OFF** et une
  coupure résonante **balayage** (début, fin, vitesse, ping-pong) ; instrument
  **vibrato** (délai, vitesse, profondeur) ; **modulation de largeur
  d'impulsion** ; **minuterie de porte**, **redémarrage forcé** et forme d'onde
  de la première trame ; une **table d'ondes/arpèges** avec préréglages ;
  **RING** et **SYNC**. Voir [Éditeur SID](#sid-editor-3-voice-tracker).
- **Nouveau lecteur SID** — le lecteur exporté exécute la modulation de
  l'instrument à chaque image (`JSR sid_frame` pour votre propre IRQ) ; l'aperçu
  affiche le même lecteur via un petit synthétiseur SID. `.bin` conserve les
  noms et la vitesse des instruments.
- **Clavier virtuel** — 2, 3 ou 4 octaves dans un style synthétiseur Commodore
  64.
- **Ultimate Basic 1.6.2 inclus** — `tune` gagne `imod`, `ifilt`, `igate` et
  `itab`; **Exporter vers UltimateBasic** les écrit.
- **Signets et Aller à la ligne** dans les éditeurs Expert et Ultimate Basic —
  Ctrl+F2 / F2 / Shift+F2, Ctrl+G.
- **Corrigé : ** les expressions d'étiquette (`.assert`, `LEVEL_MULTICOLOR*16`,
  `*`) fonctionnent à nouveau dans l'application installée (pas de `eval` sous
  la CSP de publication).

---

## Points forts de la version 2.5.0

- **Éditeur de niveaux** — un nouvel éditeur de barre d'outils permet
  d'organiser les écrans de l'éditeur de cartes verticalement, horizontalement
  ou dans une grille 2D et d'afficher un aperçu complet du niveau avec un
  défilement fluide. Voir [Éditeur de niveaux](#sid-editor-3-voice-tracker).
- Les macros **LEVEL / LEVEL_ROW** — `.level "level.bin"[, $addr]` place
  uniquement les écrans placés d'un projet Level Editor, ainsi que les tables de
  pointeurs, et définit les étiquettes et constantes `LEVEL_*` ; `.level_row
  dst, col[, color]` copie une ligne de niveau de 40 caractères dans un tampon.
  Voir [LEVEL / LEVEL_ROW]{1}.
- **Mode variable JOYSTICK** — `.joystick port, vx, vy[, fire]` écrit la
  direction dans des variables (−1 / 0 / +1) au lieu de déplacer un sprite ;
  port `3` lit les deux ports joystick. Voir [JOYSTICK]{1}.
- **Démo de défilement de niveau** — `samples/level-demo.asm` fait défiler un
  niveau d'écran 2×5 pixel par pixel dans toutes les directions avec le
  joystick, sans déchirure, avec de la place laissée pour les sprites et le code
  du jeu.
- **Convertisseur de nombres** — une boîte de dialogue non modale DEC / HEX /
  BIN sur la barre d'outils. Voir [Convertisseur de nombres]{1}.
- **Boîte de dialogue Exemples** — **Menu → Exemples…** ouvre une liste
  consultable et catégorisée des programmes d'exemple intégrés. Voir [Programmes
  d'exemple]{1}.
- **Ultimate Basic 1.6.1 intégré** — `map load "level.bin"[, addr]` lit
  directement un projet de l'éditeur de niveaux, et la nouvelle `map view px,
  py` permet un défilement fluide et sans déchirure de la carte à la position
  d'un pixel (exemple : `level_scroll_demo.ub`). Un produit d'octets dans une
  somme de 16 bits n'est plus tronqué à 8 bits. La référence des commandes UB
  mentionne `map view`, et sa recherche place les correspondances par nom de
  commande en premier.

---

## Points forts de la version 2.4.9

- **Modèles de projet** — **Menu → Fichier → Nouveau projet à partir d'un
  modèle…**, ou le nouveau bouton de la barre d'outils situé entre **Menu** et
  **Tutoriels**, crée un projet `.proj` prêt à compiler dans son propre dossier.
  La boîte de dialogue comporte une section **Assembleur** (programme vide,
  squelette de jeu, bitmap haute résolution et multicolore) et une section
  **UltimateBasic** (programme vide, squelette de jeu, bitmap haute résolution,
  IRQ raster), avec un aperçu de la syntaxe. Vos propres modèles `.asm` / `.ub`
  sont récupérés depuis le dossier des modèles utilisateur. Voir [Modèles de
  projet](#level-editor).
- **Générer le projet** — **Menu → Générer → Générer le projet** compile chaque
  fichier compilable du projet ouvert (ou des onglets ouverts) en un fichier
  `.prg` à côté de sa source, écrit les fichiers de symboles du débogueur
  lorsqu'ils sont disponibles, ignore les modules d'inclusion uniquement et
  affiche un rapport par fichier. Voir [Générer le projet](#level--level_row).
- **Ctrl + zoom de la molette de la souris** dans les éditeurs Expert et
  Ultimate Basic (`Cmd` + molette sur macOS ; le pincement du pavé tactile
  fonctionne également).
- Les espaces de travail conservent en mémoire les projets : les arborescences
  de projets Expert et Ultimate Basic, le fichier de démarrage et les
  modifications non enregistrées sont sauvegardés dans l’espace de travail
  `.vaws` et restaurés avec celui-ci. Les anciens espaces de travail restent
  ouverts.
- **Ultimate Basic** — le compilateur intégré génère un code 6502 plus rapide et
  plus petit ; la carte mémoire fait désormais la distinction entre le code réel
  et les données, le remplissage et les longs `org` espaces.
- **Les boîtes de dialogue de fichiers démarrent dans le dossier de travail
  actif** — le Block/Expert ou le Ultimate Basic, selon le mode actuel.
- **Ultimate Basic 1.6.1 intégré** — `map load "level.bin"[, addr]` lit
  directement un projet de l'éditeur de niveaux, et la nouvelle `map view px,
  py` permet un défilement fluide et sans déchirure de la carte à la position
  d'un pixel (exemple : `level_scroll_demo.ub`). Un produit d'octets dans une
  somme de 16 bits n'est plus tronqué à 8 bits. La référence des commandes UB
  mentionne `map view`, et sa recherche place les correspondances par nom de
  commande en premier.

---

## Points forts de la version 2.4.8

- **Nouvelle macro KOALA** — `.koala "picture.koa"` (optionnellement `, $2000`)
  charge une image Koala Painter et l'affiche avec une routine d'affichage de 86
  octets. Voir [KOALA](#project-templates).
- **Importation/exportation Koala dans l'éditeur haute résolution** — **Fichiers
  → Importer Koala (.koa)…** / **Exporter Koala (.koa)…** (fichier standard de
  10 003 octets ; les images haute résolution sont converties en multicolore à
  l'exportation). `.koa` / `.kla` sont également reconnus par **Importer une
  image / .bin**.
- **Ultimate Basic 1.5.9 intégré** — nouvelle `chaîne « FICHIER » [,
  périphérique]` (charge un autre programme par-dessus celui en cours
  d'exécution et l'exécute) ; `charger « FICHIER »` charge à l'adresse du
  fichier, `charger « FICHIER », addr` vers `addr` ; corrections D64. `chaîne`
  est mise en évidence et répertoriée dans le guide de référence des commandes.
- **État de la mise à jour dans la barre d'état Expert** — le même *À jour* /
  indicateur cliquable *Mise à jour disponible* qu'en mode Ultimate Basic.
- **Les boîtes de dialogue d'enregistrement** proposent le type propre du
  fichier (par exemple *KOA*) au lieu de *Binaire (\*.bin)*.
- **Vérification de mise à jour plus robuste** — la liste des installateurs est
  publiée sur c64va.tech/downloads/VA/, la vérification fonctionne donc avec la
  nouvelle page de téléchargement ; l’assistant de mise à jour Linux n’hérite
  plus des chemins de la bibliothèque AppImage.

---

## Points forts de la version 2.4.7

- **Mises à jour intégrées** — **Menu → Rechercher les mises à jour** vérifie la
  disponibilité d'une version plus récente sur c64va.tech et, après
  confirmation, télécharge le programme d'installation pour votre plateforme
  (avec une barre de progression) et l'installe. Voir [Mises à jour
  intégrées](#koala). La vérification s'effectue également automatiquement à
  chaque démarrage.
- **État de la mise à jour dans la barre d'état Ultimate Basic** — affiche **À
  jour (vX)**, ou une mise en évidence **Mise à jour disponible : vY** qui ouvre
  la boîte de dialogue de mise à jour lorsqu'on clique dessus.
- **Éditeur de courbes → Exportation UltimateBasic** — **Fichiers → Exporter
  vers UltimateBasic** enregistre le tableau sous forme de tableau UB initialisé
  ; **Fichiers → Exporter la démo UltimateBasic** génère une démo de sprites UB
  prête à l’emploi. Voir [Éditeur de courbes]{1}.
- **Ultimate Basic 1.5.8 intégré** — la nouvelle forme **`data <array>: v, …`**
  remplit un `array` / `array_word` déclaré au démarrage du programme (les
  lignes suivantes continuent là où la précédente s'est arrêtée, les tableaux de
  mots prennent des valeurs de 16 bits) sans toucher au flux `read`.
- **La mise en page s'adapte à la fenêtre** : les panneaux de l'éditeur occupent
  exactement la hauteur restante de la fenêtre, l'application n'affiche donc
  plus de barre de défilement verticale au niveau de la page ; le panneau de
  sortie ASM conserve une largeur minimale de 440 px ; le chemin du dossier de
  travail est discrètement affiché au-dessus du titre de la vue ASM et utilise
  le même badge dans les barres d'outils Expert et Ultimate Basic. Les
  étiquettes des boutons de boîte de dialogue ne sont plus renvoyées à la ligne.
- **Vérification de mise à jour plus robuste** — la liste des installateurs est
  publiée sur c64va.pro/downloads/VA/, la vérification fonctionne donc avec la
  nouvelle page de téléchargement ; l’assistant de mise à jour Linux n’hérite
  plus des chemins de bibliothèque AppImage.

---

## Points forts de la version 2.4.6

- **Mises à jour intégrées** — **Menu → Rechercher les mises à jour** vérifie la
  disponibilité d'une version plus récente de c64va.pro et, après confirmation,
  télécharge le programme d'installation pour votre plateforme (avec une barre
  de progression) et l'installe. Voir [Mises à jour intégrées](#in-app-updates).
  La vérification s'effectue également automatiquement à chaque démarrage.
- **Mise à jour du langage Ultimate Basic** — La coloration syntaxique et la
  référence des commandes couvrent désormais **`sfx`** (effet SID non bloquant :
  `sfx canal, fréquence, trames [, onde]`), **`org`** (continuer le code sub/fn
  à une adresse, en laissant un espace rempli de zéros pouvant contenir des
  données `incbin`), **`charset on` / `charset off`** (basculer le VIC-II vers
  le jeu de caractères RAM et inversement) et **`incbin` slicing** (`incbin
  "font.prg", $3C00, 2` ignore les premiers octets, un quatrième argument
  optionnel limite la longueur).
- **Surlignage de plusieurs blocs dans la vue ASM** — la sélection de plusieurs
  blocs met en surbrillance toutes leurs lignes ASM à la fois, la position de
  défilement reste stable pendant la sélection et les numéros de ligne sont plus
  doux avec une subtile ligne de séparation verticale.
- **Le mode assembleur est conservé lors des changements de mode dans Ultimate
  Basic.** L'ouverture d'un projet ou d'un exemple intégré lorsque Ultimate
  Basic est actif quitte d'abord UB et revient à votre dernier mode Bloc/Expert.
  Ainsi, le tampon UB ne peut plus écraser le mode ou le titre du nouvel onglet.
  Les nouveaux onglets sont créés dans le mode approprié.
- **Paramètres Kung Fu Flash 2** — un bouton **Détecter USB** dans les
  paramètres matériels effectue une nouvelle recherche du port série de la
  cartouche, et les prérequis de KFF2 indiquent désormais le firmware Kung Fu
  Flash requis (v2.07+).
- **Référence des commandes Ultimate Basic** — `tune` et `music` affichent des
  exemples complets et commentés (format de cellule, effets, notes du joueur,
  `music play N`) ; `inst`, `order`, `pat` et la commande `speed` ont leurs
  propres entrées ; `data` affiche le nouveau format de tableau ; la syntaxe de
  `load sid` est corrigée (`load sid "tune.sid", $2000`).

---

## Points forts de la version 2.4.5

- **Prise en charge de Kung Fu Flash 2 — exécutez vos programmes sur un
  véritable Commodore 64/128.** Une nouvelle entrée **Kung Fu Flash 2** dans le
  menu **Exécuter** permet de compiler le programme et de le transférer via USB
  directement sur un véritable C64 (ou C128) allumé, équipé d'une cartouche Kung
  Fu Flash 2 — sans image disque, sans copie sur carte SD, sans émulateur.
  Fonctionne en modes Block, Expert et Ultimate Basic. Le port série USB de la
  cartouche est détecté automatiquement (et peut être saisi manuellement) ;
  consultez [Kung Fu Flash 2]{1} pour la configuration et le déroulement précis.
- **Panneaux Programme/ASM redimensionnables** — Une fine barre verticale de
  séparation entre le panneau Programme et le panneau ASM/Sortie permet de
  déplacer la bordure vers la gauche ou la droite (minimum 260 px par panneau).
  Les touches fléchées permettent de la déplacer, un double-clic rétablit une
  répartition 50/50, et la position est mémorisée d'une session à l'autre. La
  barre de séparation est masquée en mode Expert et Ultimate Basic, ainsi que
  dans la disposition empilée étroite.
- **Lignes de macro plus claires dans la vue ASM** — Les blocs de macro sont
  désormais listés sans le marqueur de commentaire initial (`.print "HELLO" `,
  `.if A == 1 `, `.sprite_init … ` au lieu de `; .print … `), et le surligneur
  de syntaxe ASM les colore comme des macros. Les blocs COMMENT et les marqueurs
  de région ordinaires commencent toujours par `;`.
- **Mise en évidence personnalisée des macros dans l'éditeur Expert** — le nom
  de la macro après `.macro`, `.invoke` et `.call` (et les appels de style Kick
  `:name(...)`) a sa propre couleur, de même que les substitutions `{param}` à
  l'intérieur du corps de la macro et les noms des paramètres dans l'en-tête
  `.macro`, dans chaque thème.
- **Boîte de dialogue À propos rafraîchie** — une mise en page plus large sur
  deux colonnes avec des liens groupés vers le projet, la licence et les
  crédits, et la bannière Ultimate Basic a désormais un fond transparent pour
  qu'elle s'intègre à tous les thèmes.

---

## Points forts de la version 2.4.3

- **Éditeur SID : Liste de morceaux/ordre** — Les motifs sont désormais
  organisés selon une liste de morceaux/ordre superposée à la banque de motifs
  brute. Un motif peut ainsi se répéter et le morceau peut être plus long que le
  nombre de motifs stockés. Ajoutez, supprimez et réorganisez les pas
  directement depuis l’éditeur SID ; la lecture et le lecteur exporté parcourent
  cette liste au lieu de l’ordre brut des motifs.
- Éditeur SID : Colonne Effets — chaque cellule de suivi peut désormais contenir
  un effet en plus de sa note : vibrato (V), glissando (U), piano (P) / piano
  (D), modification de la vitesse (C) et changement de vitesse (F). Saisissez-le
  directement dans une cellule, par exemple : C-4 01 V24 (note + instrument +
  vibrato) ou F06 (modification de vitesse uniquement). Les effets s’exécutent
  une fois par ligne, conformément au lecteur exporté, et sont désormais lus
  correctement aussi bien dans l’aperçu audio Web intégré que dans l’export 6502
  compilé — un véritable moteur d’effets fonctionnel, et non une simple
  structure d’exportation.
- **Format de sauvegarde SID rétrocompatible** — Les sauvegardes SID comportent
  désormais un marqueur de version, de sorte que les anciennes sauvegardes
  `.bin` effectuées avant l'existence de la colonne d'effet continuent de se
  charger exactement comme avant, les effets étant simplement absents.
- Éditeur D64 : flux de travail d'enregistrement explicite — chaque modification
  (ajout, extraction, renommage, suppression et désormais modifications d'octets
  dans l'éditeur de blocs) est effectuée sur une copie de travail privée ; votre
  fichier D64 d'origine reste inchangé jusqu'à ce que vous cliquiez sur
  Enregistrer, ce qui crée également une sauvegarde automatique au préalable. La
  fermeture de l'éditeur ou l'ouverture d'un autre disque contenant des
  modifications non enregistrées requiert désormais une confirmation au lieu
  d'être ignorées silencieusement.
- **Éditeur D64 : Grille hexadécimale de l’éditeur de blocs** — la vue brute des
  octets pour le bloc de 256 octets sélectionné est désormais une véritable
  grille hexadécimale par octet au lieu d’une simple zone de texte, et sa boîte
  de dialogue n’assombrit plus le reste de l’application derrière elle
  lorsqu’elle est ouverte.
- **Web64 sur le site du produit** — une nouvelle section IDE Web64 sur
  [c64va.pro](https://www.c64va.pro).
- **Mise à jour de l'exemple** — l'exemple `macro-avec-paramètre` utilise
  désormais la forme entre parenthèses `.macro setColor(color)`.

---

## Points saillants de la version 2.4.2

- **Glissez-déposez sur l'éditeur D64** — déposez un fichier compilé
  `.prg`/`.bin` (provenant des exportations des éditeurs SID/sprite/char, ou de
  toute autre source) directement sur l'image disque ; le panneau Ajouter
  s'ouvre prérempli. Déposer plusieurs fichiers à la fois les met en file
  d'attente les uns après les autres.
- **Générer un fichier d'inclusion** — un nouveau bouton de barre d'outils écrit
  un fichier `.inc` listant `.const NAME = $ADDR` pour chaque entrée sur le
  disque, afin que le programme principal puisse référencer où chacune a atterri
  sans retaper les adresses à la main.
- **Éditeur de blocs (nouveau)** — Un bouton de la barre d'outils permet
  d'accéder directement aux pistes/secteurs sous le répertoire dans l'éditeur
  D64 : une carte des blocs cliquable (colorée selon la bitmap libre/utilisée du
  BAM, avec le BAM et la chaîne de répertoires marqués séparément), un éditeur
  hexadécimal pour le bloc de 256 octets sélectionné et une navigation secteur
  précédent/suivant. Lecture et écriture directes de l'image disque
  (`read_bin_file`/`write_bin_file`), indépendamment de `c1541`.
- Éditeur D64 : flux de travail d'enregistrement explicite — chaque modification
  (ajout, extraction, renommage, suppression et désormais modifications d'octets
  dans l'éditeur de blocs) est effectuée sur une copie de travail privée ; votre
  fichier D64 d'origine reste inchangé jusqu'à ce que vous cliquiez sur
  Enregistrer, ce qui crée également une sauvegarde automatique au préalable. La
  fermeture de l'éditeur ou l'ouverture d'un autre disque contenant des
  modifications non enregistrées requiert désormais une confirmation au lieu
  d'être ignorées silencieusement.
- **Éditeur D64 : Grille hexadécimale de l’éditeur de blocs** — la vue brute des
  octets pour le bloc de 256 octets sélectionné est désormais une véritable
  grille hexadécimale par octet au lieu d’une simple zone de texte, et sa boîte
  de dialogue n’assombrit plus le reste de l’application derrière elle
  lorsqu’elle est ouverte.

---

## Points saillants de la version 2.4.1

- **Langues d'interface utilisateur polonaises et italiennes** — traduction
  complète de l'interface (menus, boîtes de dialogue, descriptions
  mnémotechniques, référence de commande Ultimate Basic) en plus des langues
  hongroises, anglaises, espagnoles, allemandes et néerlandaises existantes.
- **Bouton de la barre d'outils d'aide en ligne** — un nouveau bouton d'icône
  après le débogage ouvre le site de documentation multilingue
  ([c64va.tech/docs.html]{1}) directement depuis l'application.
- **Descriptions mnémoniques centralisées :** les descriptions mnémoniques par
  langue ont été déplacées dans le fichier de traduction partagé avec le reste
  des chaînes d'interface utilisateur. Ce correctif résout également un bug
  persistant où les descriptions anglaises des commandes `PRINT`, `PRINT_HEX`,
  `CLEAR_SCREEN`, `WAIT_KEY`, `SET_BORDER`, `SET_BG`, `IRQ_SETUP` et `RAND`
  étaient silencieusement écrasées par du texte espagnol résiduel.

---

## Points forts de la version 2.4.0

- **Éditeur D64** — un explorateur d'images disque complet situé dans la barre
  d'outils (après l'Éditeur de courbes). Ouvrez un fichier `.d64` existant,
  créez-en un nouveau vierge ou lancez le disque actuel directement dans VICE,
  le tout depuis un menu Fichier ▾ identique à celui des autres éditeurs
  visuels. Voir [Éditeur D64 (explorer et modifier une image disque
  existante)]{1}.
- **Bouton de la barre d'outils d'aide en ligne** — un nouveau bouton d'icône
  après le débogage ouvre le site de documentation multilingue
  ([c64va.pro/docs.html](https://www.c64va.pro/docs.html)) directement depuis
  l'application.
- **Adresse de chargement, adresse de décompression et Exomizer dans l'éditeur
  D64** — L'ajout d'un fichier brut sans en-tête permet de définir une adresse
  de chargement optionnelle, une cible de décompression Exomizer et de le
  compresser à l'importation, en utilisant les mêmes modes de compression
  `mem`/`sfx` que les fichiers supplémentaires de la boîte de dialogue Exporter
  vers D64. Un fichier `.prg` possédant déjà son propre en-tête ignore
  complètement ces champs.

---

## Points forts de la version 2.3.9

- **`*` dans toute expression** — le symbole de compteur de programme fonctionne
  désormais à l'intérieur des expressions d'opérandes, et non plus seulement
  seul : `BNE *-5`, `JMP *+20`, `LDA #&lt;*`, `LDA #&gt;(*+63)`. Un `*` qui suit
  une valeur (`STRIDE*2`) correspond toujours à une multiplication. Voir [Modes
  d'adressage → Le compteur de programme `*` dans les
  expressions](#d64-editor-browse--edit-an-existing-disk-image).
- **Étiquettes locales (avec pointillés)** — une étiquette telle que `.loop`
  appartient à la portée de l'étiquette *globale* (sans pointillés) précédente
  la plus proche ; ainsi, `DrawSprite` et `ClearScreen` peuvent chacune définir
  leur propre `.loop` sans conflit. Voir [Étiquettes locales (avec
  pointillés)]{1}.
- **Pseudo-opérations de branchement long** — `LBNE`, `LBEQ`, `LBCC`, `LBCS`,
  `LBMI`, `LBPL`, `LBVC`, `LBVS` s'assemblent en un branchement inversé via un
  `JMP` (toujours 5 octets), permettant ainsi à la cible de se situer à
  n'importe quelle distance. Nouvelle catégorie de palette **Branches longues**.
  Voir [LBNE / LBEQ / … (Branches longues)]{1}.
- **`.assert` directive** — `.assert end - start &lt;= 256` or `.assert * &lt;
  $A000, "message"` est évalué lors de l'assemblage et provoque un échec de la
  compilation (affichant la valeur réelle) lorsque l'expression est fausse. Voir
  [.ASSERT]{1}.
- **Étiquettes d'opérandes à code auto-modifiable** — `Valeur LDA :#$00` définit
  l'étiquette `valeur` pointant vers l'octet d'opérande de l'instruction, de
  sorte que `Valeur STA` la modifie directement. Voir [Étiquettes d'opérandes à
  code auto-modifiable]{1}.
- **Erreurs de branche hors plage plus conviviales** — une branche qui atterrit
  en dehors de −128…+127 indique maintenant exactement de combien elle dépasse
  et suggère la branche longue correspondante `LBxx`.
- **Amélioré : ** le badge de la barre d'outils de l'indicateur de mode du thème
  clair (MODE BLOC / MODE EXPERT / …) est plus foncé et plus lisible, et son
  animation scintillante est à nouveau visible.

---

## 1. Aperçu de l'interface

L'application est divisée en trois panneaux principaux :

- **`*` dans toute expression** — le symbole de compteur de programme fonctionne
  désormais à l'intérieur des expressions d'opérandes, et non plus seulement
  seul : `BNE *-5`, `JMP *+20`, `LDA #&lt;*`, `LDA #&gt;(*+63)`. Un `*` qui suit
  une valeur (`STRIDE*2`) correspond toujours à une multiplication. Voir [Modes
  d'adressage → Le compteur de programme `*` dans les
  expressions](#the--program-counter-in-expressions).
- Étiquettes locales (pointillées) : une étiquette telle que `.loop appartient à
  la portée de l’étiquette globale (non pointillée) précédente la plus proche.
  Ainsi, `DrawSprite et `ClearScreen peuvent chacune définir leur propre `.loop
  sans conflit. Voir Étiquettes locales (pointillées)(#local-dotted-labels).
- Les pseudo-opérations de branchement long (LBNE, LBEQ, LBCC, LBCS, LBMI, LBPL,
  LBCVC, LBCVS) s'assemblent en un branchement inversé via un JMP (toujours de 5
  octets), permettant ainsi à la cible de se situer à n'importe quelle distance.
  Nouvelle catégorie de palette : Branches longues. Voir LBNE / LBEQ / …
  (Branches longues) (#lbne--lbeq---long-branches).
- **`.assert` directive** — `.assert end - start &lt;= 256` or `.assert * &lt;
  $A000, "message"` est évalué lors de l'assemblage et provoque un échec de la
  compilation (affichant la valeur réelle) lorsque l'expression est fausse. Voir
  [.ASSERT](#assert).
- **Étiquettes d'opérandes à code auto-modifiable** — `Valeur LDA :#$00` définit
  l'étiquette `valeur` pointant vers l'octet d'opérande de l'instruction, de
  sorte que `Valeur STA` la modifie directement. Voir [Étiquettes d'opérandes à
  code auto-modifiable](#self-modifying-code-operand-labels).
- **Erreurs de branche hors plage plus conviviales** — une branche qui atterrit
  en dehors de −128…+127 indique maintenant exactement de combien elle dépasse
  et suggère la branche longue correspondante `LBxx`.

---

## 2. Palette de blocs

La palette de gauche répertorie tous les blocs disponibles, regroupés par
catégorie :

| Panneau                | Description                                                                           |
| ---------------------- | ------------------------------------------------------------------------------------- |
| **Gauche — Palette**   | Toutes les instructions et macros disponibles. Recherchez ou parcourez par catégorie. |
| **Centre — Programme** | Votre programme. Glissez les blocs ici, réorganisez-les, modifiez les opérandes.      |
| **Droite — Sortie**    | Affichage ASM en direct et/ou sortie du moniteur de mémoire.                          |

Utilisez le champ de recherche **** en haut de la palette pour filtrer par nom.
Cliquez sur le bouton **Ajouter le bloc sélectionné** ou faites glisser un bloc
dans la zone de programme.

En mode Bloc, une fine barre de séparation verticale **** se trouve entre les
panneaux Programme et Sortie. Faites-la glisser pour agrandir l'un ou l'autre
panneau (chacun conserve au moins 260 px), utilisez les flèches ← / → pour la
déplacer par incréments de 16 px, ou double-cliquez dessus pour rétablir la
répartition 50/50. La position est enregistrée dans les paramètres d'interface.
La barre de séparation est masquée en modes Expert et Basique Ultime, ainsi que
lorsque la fenêtre est suffisamment étroite pour que les panneaux s'empilent.

---

## 3. Domaine du programme

La palette de gauche répertorie tous les blocs disponibles, regroupés par
catégorie :

- **Faites glisser et déposez** des blocs depuis la palette, ou **réorganisez**
  les blocs existants en faisant glisser leur poignée (≡).
- Chaque bloc affiche son **mnémonique**, son **champ d'opérande** et son
  **sélecteur de mode d'adressage** (le cas échéant).
- Cliquez sur le bouton **▸ / ▾** pour réduire ou développer un bloc.
- Utilisez le bouton **× (supprimer)** sur un bloc pour le supprimer.
- **Tout réduire** Le bouton replie tous les blocs en même temps.
- **Opérations sur les registres** — TAXE, TAY, INX, DEX, …
- **Maj et rotation** — ASL, LSR, ROL, ROR
- Pile **** — PHA, PHP, PLA, PLP
- **Système** — CLC, SEC, NOP, BRK, …
- **Instructions illégales** — LAX, SAX, DCP, …
- **Structure** — LABEL, COMMENTAIRE, RÉGION, ENDREGION
- **Macros** — BOUCLE, SUIVANT, POUR, FIN, POUSSER, TIRER, FIN, TEXTE, OCTET,
  MOT, REMPLIR, ALIGNER, ASSERT, CHAÎNE, DONNÉES, OCTETS BRUT, TEXTE BRUT,
  PETSCII, JEU DE CARACTÈRES, INCBIN, SID, INCLURE, TABLEAU, ORG, MACRO, FIN,
  INVOQUER, SI, SINON, FIN SI, VAR, TANT QUE, FIN, RÉPÉTER, JUSQU'À, MEMCPY,
  MEMSET, IMPRIMER, IMPRIMER_CARACTÈRE, IMPRIMER_HEX, EFFACER_ÉCRAN,
  ATTENDRE_CLÉ, RETARDER, DÉFINIR_BORDURE, DÉFINIR_ARRIÈRE-PLAN,
  CONFIGURATION_IRQ, RAND, INITIALISATION_SPRITE, POSITION_SPRITE,
  ATTENDRE_RASTER, JOYSTICK, SOURIS, COULEUR_SPRITE, CHARGER_FICHIERS,
  VÉRIFICATION_REU, STOCKAGE_REU, RÉCUPÉRER_REU REU_SWAP, TURBO_SET,
  SUPERCPU_DETECT, TURBO_ENABLE, MAP_COPY, MAP_COPY16X16, SPRITE_ANIM, SCORE_BCD

Utilisez le champ de recherche en haut de la palette pour filtrer par nom.
Cliquez sur le bouton Ajouter le bloc sélectionné ou faites glisser un bloc dans
la zone de programme.

---

## 4. Vue ASM

- **Faites glisser et déposez** des blocs depuis la palette, ou **réorganisez**
  les blocs existants en faisant glisser leur poignée (≡).
- Chaque bloc affiche son **mnémonique**, son **champ d'opérande** et son
  **sélecteur de mode d'adressage** (le cas échéant).
- Cliquez sur le bouton **▸ / ▾** pour réduire ou développer un bloc.
- Utilisez le bouton **× (supprimer)** sur un bloc pour le supprimer.
- **Tout réduire** Le bouton replie tous les blocs en même temps.

### Modes de sortie

Les blocs de macro apparaissent dans les vues ASM et Both sous forme de simples
lignes de macro sans marqueur de commentaire (`.print "HELLO"`, `.wait_raster
$FF`, `.invoke setColor(blue)`) et sont colorés comme des macros ; seuls les
vrais blocs COMMENT, les marqueurs de région et les avertissements conservent
leur `;` initial.

| Couleur de la barre | Description                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cyan                | Code source d'assemblage 6502 avec adresses et étiquettes                                                                                                                                                                                                                                                                                                                       |
| **Moniteur**        | Vidage hexadécimal/octet (style moniteur C64)                                                                                                                                                                                                                                                                                                                                   |
| **Désastre**        | Désassemblage pur du 6502 : adresse, octets hexadécimaux et mnémoniques avec opérandes numériques résolus. Les macros sont développées en instructions individuelles (paires TEXT → LDA/STA, LOOP → LDX, etc.). Les données BYTE/WORD/FILL sont affichées sous forme de dump hexadécimal par blocs. Aucun nom de macro, commentaire ou annotation n'est présent dans la sortie. |
| **Les deux**        | ASM en haut, moniteur en dessous                                                                                                                                                                                                                                                                                                                                                |
| **Désassembleur**   | Identique à Disasm — onglet dédié à la vue de démontage                                                                                                                                                                                                                                                                                                                         |

Les blocs réduits sont affichés avec une opacité réduite. Cliquez ou faites
glisser n'importe où sur la mini-carte pour faire défiler la liste des
programmes jusqu'à cette position. L'indicateur de zone d'affichage (rectangle
de couleur accentuée) suit la partie visible de la liste. L'état est conservé
dans les paramètres de l'interface utilisateur (touche `blockMinimap`).

### Onglet Boîte à outils

- Pour les instructions de branchement/saut (`BNE`, `JMP`, `JSR`, etc.), une
  liste déroulante **sélecteur d'étiquettes** apparaît — cliquez sur une
  étiquette définie pour l'insérer.
- Le format numérique suit le basculement **HEX / DEC** dans la barre d'outils
  (voir section 5).

---

## 5. Paramètres et barre d'outils

Le panneau de droite affiche le résultat généré en temps réel.

### Aperçus du projet

| Mode               | Description                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ASM**            | Code source d'assemblage 6502 avec adresses et étiquettes                                                                                                                                                                                                                                                                                                                       |
| **Moniteur**       | Vidage hexadécimal/octet (style moniteur C64)                                                                                                                                                                                                                                                                                                                                   |
| **Désastre**       | Désassemblage pur du 6502 : adresse, octets hexadécimaux et mnémoniques avec opérandes numériques résolus. Les macros sont développées en instructions individuelles (paires TEXT → LDA/STA, LOOP → LDX, etc.). Les données BYTE/WORD/FILL sont affichées sous forme de dump hexadécimal par blocs. Aucun nom de macro, commentaire ou annotation n'est présent dans la sortie. |
| **Les deux**       | ASM en haut, moniteur en dessous                                                                                                                                                                                                                                                                                                                                                |
| **Désassembleur**  | Identique à Disasm — onglet dédié à la vue de démontage                                                                                                                                                                                                                                                                                                                         |
| **Boîte à outils** | Panneau de référence C64 : nuancier de 16 couleurs + aide-mémoire des codes de contrôle PETSCII et des caractères imprimables. Lecture seule — voir la sous-section « Boîte à outils » ci-dessous pour plus de détails.                                                                                                                                                         |
| **Options**        | Panneau des paramètres du programme — format numérique, activation/désactivation de la source des macros, paramètres du débogueur                                                                                                                                                                                                                                               |

Les instantanés de projet sont stockés sur disque dans des fichiers JSON
externes, et non dans le stockage local. Ils sont liés au fichier de projet
courant lorsqu'il existe, ce qui garantit la conservation de l'historique même
après un redémarrage et son suivi du projet.

### Mises à jour intégrées à l'application

**Menu → Rechercher les mises à jour** recherche la dernière version sur
c64va.tech (il lit les liens de téléchargement pour votre plateforme) et la
compare avec la version en cours d'exécution :

| Section     | Ce qui se produit                                                                                                                                                                                                                                  |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Windows** | L'installation s'exécute en mode passif (suivi de la progression uniquement) et lance la nouvelle version une fois terminée. L'installation par machine requiert des droits d'administrateur (UAC).                                                |
| **macOS**   | L'image disque (DMG) est montée et le paquet d'application est remplacé, puis la nouvelle version démarre. Si le dossier de l'application n'est pas accessible en écriture, ouvrez simplement l'image disque pour y glisser-déposer l'application. |

Après le téléchargement, l'application installe la mise à jour et redémarre :

### Espaces de travail

Un espace de travail (fichier .vaws) conserve en mémoire les fichiers physiques
ouverts sur le disque dans chaque onglet, y compris le mode d'édition et
l'onglet actif, ce qui permet de rouvrir exactement le même ensemble de fichiers
ultérieurement. Il est distinct d'un projet : un espace de travail peut contenir
une combinaison de fichiers de projet Block/Expert (fichier .json), de fichiers
.asm autonomes et de sources Ultimate Basic (fichier .ub/.proj) répartis sur
plusieurs onglets.

- Espaces de travail **enregistrement automatique** quelques centaines de
  millisecondes après que vous ayez effectué une modification une fois qu'un
  espace a été enregistré ou ouvert.
- L'application **restaure automatiquement votre dernier espace de travail** au
  lancement, de sorte que vos onglets ouverts reprennent là où vous vous étiez
  arrêté.
- Seuls les onglets associés à un fichier réel sur le disque sont enregistrés
  dans l'espace de travail ; un onglet contenant un échantillon non enregistré
  ou un programme uniquement en mémoire n'a rien à conserver et est ignoré (avec
  un avertissement si aucun des onglets ouverts ne remplit les conditions
  requises).
  - **`-jmp` ON/OFF** — saute directement à l'adresse de début du programme
    après le chargement.
  - **`-reprise` ON/OFF** — relancer le débogueur immédiatement au chargement.
  - **`-wait` ms ON/OFF** — ajoute un délai `-wait <ms>` avant de reprendre la
    lecture ; sélectionnez 500 ms ou 1000 ms dans la liste déroulante.
- L'ouverture d'un espace de travail ferme d'abord tous les onglets actuellement
  ouverts ; une confirmation vous sera demandée avant de poursuivre.

### Modèles de projet

**Menu → Fichier → Nouveau projet à partir d'un modèle…** — ou le bouton de la
barre d'outils entre **Menu** et **Tutoriels** — ouvre la boîte de dialogue du
modèle :

### Projet de construction

**Menu → Compiler → Compiler le projet** compile un projet entier en une seule
étape. Les fichiers du projet `.proj` ouvert sont compilés — ou, sans projet,
les onglets des fichiers ouverts :

- chaque source compilable (`.asm`, bloc `.json`, `.ub`) est compilée en un
  `.prg` **à côté de sa source** avec le même nom ; avec **Exécuter avec
  Exomizer** activé, la sortie est compressée ;
- Les fichiers annexes du débogueur (symboles / carte source) sont écrits en
  même temps que le PRG lorsqu'ils sont disponibles ;

### Exemples de programmes

**Menu → Exemples…** ouvre le navigateur d'exemples : les programmes d'exemples
intégrés sont regroupés par sujet (Bases, Macros et flux de contrôle,
Graphiques, Sprites et entrée, Fichiers et chargement, Musique, IRQ et matériel)
en deux colonnes.

- Saisissez votre requête dans le champ de recherche pour filtrer par nom ou par
  catégorie ; le pied de page indique le nombre d’exemples correspondants.
- Cliquez sur un exemple pour le sélectionner, **↑ / ↓** déplacez la sélection ;
  **double-cliquez**, **Entrée** ou **Charger** le charge.
- La boîte de dialogue s'ouvre sur le dernier exemple chargé.

La fenêtre modale se ferme automatiquement lorsque l'action est terminée ou a
échoué.

---

## Mode UltimateBasic

| Contrôle                                                                                                          | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ** Base numérique (HEX / DEC / BIN)**                                                                             | Définit le format d'affichage/de saisie des opérandes dans l'interface utilisateur. Le mode BIN affiche les valeurs en binaire avec le préfixe `%` (par exemple, `%11111000`). La vue ASM affiche toujours chaque bloc dans son propre format.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Langue**                                                                                                        | Basculez l'interface utilisateur entre l'anglais, le hongrois, l'espagnol, l'allemand et le néerlandais (Nederlands).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Thème**                                                                                                         | Clair / Sombre / OLED / Commodore 77 / Commodore Starlight / Commodore Beige / Commodore 64 — choisissez votre thème dans le menu Paramètres. Le thème OLED utilise un fond noir pur pour les écrans AMOLED. Commodore 77 est un thème jaune fluo sur fond noir ; lorsqu'il est actif, l'écran de démarrage reprend la couleur du thème (assortie à la carte de message), affiche un logo Commodore 77 dédié plus petit et une barre de progression jaune. Commodore Starlight est un thème clair inspiré du boîtier C64 translucide : panneaux en verre dépoli laissant transparaître la lueur arc-en-ciel RVB, accent magenta, couleurs de syntaxe arc-en-ciel et un affichage sombre et fumé. Commodore Beige est le boîtier classique : boîtier beige, touches de fonction moutarde, rayures arc-en-ciel et écran bleu C64. Le thème choisi est appliqué avant le premier affichage au prochain lancement. |
| **Mode rétro CRT**                                                                                                | Active ou désactive un filtre CRT plein écran : lignes de balayage, vignettage phosphorescent, scintillement et distorsion en barillet. L’état est conservé entre les sessions.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Afficher le panneau de mémoire**                                                                                | Bouton global permettant d'afficher ou de masquer le panneau de mémoire complet du C64                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Système de base stub**                                                                                          | Ajoute une ligne BASIC appelant SYS au début de votre programme.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Exemples…**                                                                                                     | Ouvrez le navigateur d'exemples et chargez un programme d'exemple intégré — voir [Exemples de programmes](#example-programs)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Zoom avant / arrière**                                                                                          | Redimensionner l'interface utilisateur du bloc (affecte tous les éléments du bloc)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Sauvegarder le projet**                                                                                         | Enregistrez le programme actuel en tant que fichier de projet `.json`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Enregistrer le programme sous **                                                                                | Enregistrez le programme actuel en tant que fichier de projet `.json` en utilisant une nouvelle boîte de dialogue de fichier à chaque fois.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Charger le projet**                                                                                             | Charger un projet précédemment enregistré                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Sauvegarder l'espace de travail**                                                                               | Enregistrez l'ensemble exact des onglets actuellement ouverts et associés à un fichier (y compris l'onglet actif et le mode d'édition de chaque onglet : Bloc/Expert/Basique ultime) dans un fichier d'espace de travail `.vaws`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Enregistrer l'espace de travail sous **                                                                         | Enregistrez l'espace de travail actuel à chaque fois en utilisant une nouvelle boîte de dialogue de fichier.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Ouvrir l'espace de travail**                                                                                    | Fermez tous les onglets ouverts et rouvrez l'ensemble des fichiers stockés dans un fichier d'espace de travail `.vaws`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Définir le dossier de travail**                                                                                 | Choisissez le dossier par défaut utilisé par les boîtes de dialogue de sélection et d'enregistrement de fichiers. Le chemin est enregistré dans la configuration de l'application et les aperçus des menus affichent la fin du chemin.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Nouveau projet à partir d'un modèle…** (`Menu → Fichier`, ou le bouton de la barre d'outils à côté de **Menu**) | Créez un nouveau projet `.proj` à partir d'un modèle Assembler ou UltimateBasic dans son propre dossier — voir [Modèles de projet](#project-templates)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Ouvrir le projet** (`Menu → Fichier`)                                                                           | Ouvrez un projet multi-fichiers `.proj` et ouvrez tous les fichiers sources sous forme d'onglets.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Enregistrer le projet** (`Menu → Fichier`)                                                                      | Enregistrez le projet actuel `.proj` (le panneau des projets doit être ouvert).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Fermer le projet** (`Menu → Fichier`)                                                                           | Ferme le projet actuellement ouvert ainsi que tous ses onglets. Un message vous invite à enregistrer les modifications non enregistrées. Le panneau du projet retrouve son état initial.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Charger le fichier .asm**                                                                                       | Ouvre un fichier `.asm` en mode Expert et importe le code assembleur 6502 textuel dans l'onglet actuel.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Sauvegarder PRG**                                                                                               | Exportez le binaire compilé sous forme de fichier `.prg`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Build CRT**                                                                                                     | Exportez le programme sous forme de fichier Magic Desk 64K (`.crt`, type de cartouche 19). Voir [Section 12b](#12b-crt-export-magic-desk-64k-cartridge).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Créer un projet** (`Menu → Créer`)                                                                              | Compilez chaque fichier compilable du projet (ou des onglets ouverts) en un fichier `.prg` à côté de sa source — voir [Compiler le projet](#build-project)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Exécuter (bouton fractionné)**                                                                                  | Le bouton principal **▶ Exécuter** lance le mode actuel ; cliquez sur la flèche **▾** pour basculer entre : **Exécuter en tant que PRG** (compiler et lancer VICE directement), **Exécuter via D64** (créer une image disque .d64 et lancer VICE), **Exécuter sur le matériel** (envoyer le PRG à un périphérique C64 Ultimate / 1541 Ultimate), ou **Kung Fu Flash 2** (téléverser le PRG via USB sur un véritable C64/C128 avec une cartouche Kung Fu Flash 2). Voir [Section 12](#12-d64-export--run) et [Section 13](#13-hardware-settings).                                                                                                                                                                                                                                                                                                                                                               |
| **Débogage (RetroDebugger)**                                                                                      | Compilez et lancez dans RetroDebugger avec des points d'arrêt, des symboles et des indicateurs de démarrage automatique (voir [Section 9](#9-debugger-integration))                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Exécuter avec Exomizer**                                                                                        | Case à cocher dans le menu Paramètres : lorsqu'elle est activée, toutes les opérations d'exécution et de compilation traitent le fichier PRG via `exomizer sfx sys` avant le lancement ou l'enregistrement. Fonctionne avec les options « Exécuter en tant que PRG », « Exécuter via D64 », « Exécuter sur le matériel », « Compiler le PRG » et « Compiler D64 ». Configurez d'abord l'exécutable Exomizer dans **Paramètres matériels**.                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Saisie automatique des entrées**                                                                                | Case à cocher dans **Paramètres matériels → Contrôle de version**. Lorsqu'elle est activée, l'application ajoute automatiquement une entrée à l'historique des versions environ 2,5 secondes après la fin de la modification d'un onglet (et à l'historique du projet pour un onglet donné). Désactivez cette option si vous souhaitez uniquement conserver vos propres modifications. Voir [Contrôle de version](#version-control).                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Paramètres matériels**                                                                                          | Ouvrez la boîte de dialogue de configuration matérielle — configurez VICE, Exomizer, RetroDebugger, C64 Ultimate (hôte, mot de passe, test de connexion) et le port série Kung Fu Flash 2. Voir [Section 13](#13-hardware-settings).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Nouveau programme…**                                                                                            | Ouvre une boîte de dialogue de confirmation, puis efface tous les blocages de la zone du programme.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Tout réduire**                                                                                                  | Réduire tous les blocs                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **À propos de **                                                                                                  | Informations sur la version                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Nouveautés**                                                                                                    | Journal des modifications                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |

### Contrôle de version

Chaque onglet possède son propre historique de versions, à l'instar d'un petit
dépôt Git ; un onglet appartenant à un projet ouvert peut également être
versionné comme un projet entier (voir [Mode Projet](#project-mode)). **Menu →
Générer → Contrôle de version…** (ou **Valider…**) ouvre la boîte de dialogue ;
**Annuler les modifications (retour à HEAD)** restaure directement le dernier
commit.

Le flux de travail habituel : écrire un message de commit et appuyer sur Commit
(ou Ctrl+Entrée) → continuer à modifier → appuyer sur Diff pour voir ce qui a
changé → commit à nouveau.

- **Commit** — enregistre l'état actuel de l'onglet avec votre message. Chaque
  commit reçoit un hachage court (par exemple `1bd55ba`) ; le plus récent est
  **HEAD**. Un commit sans modification depuis HEAD n'est pas créé.
- **Ligne d'état** — *Rien à valider, arbre de travail propre* ou *Modifications
  non validées depuis `<hash>`*.
- **Diff** — les modifications depuis la version HEAD ; le bouton **Diff** d’une
  entrée de journal compare cette version avec l’éditeur. Les lignes ajoutées
  sont vertes, les lignes supprimées rouges, et l’en-tête affiche **+N / −M**.
  Les programmes en mode bloc sont comparés ligne par ligne (une ligne par
  bloc), les sources Expert ligne par ligne, les onglets Ultimate Basic par leur
  source ; ainsi, un projet en mode bloc enregistré au format JSON affiche
  toujours des modifications lisibles.
- **Extraire** — charge cette version dans l'éditeur. Le fichier sur le disque
  ne change que lorsque vous enregistrez ; **Ignorer les modifications** revient
  à la version HEAD.
- **Enregistrements automatiques** — avec **Paramètres → Gestion de versions →
  Enregistrements automatiques dans la gestion de versions**, l'application
  ajoute un enregistrement environ 2,5 secondes après la fin de la modification.
  Ces enregistrements sont marqués *enregistrement automatique* ; les 20
  derniers sont conservés, ainsi que jusqu'à 100 commits.
- La boîte de dialogue peut être déplacée par son en-tête ; elle se rouvre au
  même endroit et se ferme avec **Esc** ou son bouton de fermeture (un clic en
  dehors de celle-ci ne la ferme pas).
- L'historique est stocké à côté du fichier projet sous le nom
  `<project>.snapshots.json` (dans le dossier de configuration de l'application
  jusqu'à l'enregistrement du projet), ce qui garantit sa conservation après un
  redémarrage. Les instantanés créés par les versions précédentes apparaissent
  comme des commits.

#### Mode projet

Lorsque l'onglet appartient à un projet `.proj` ouvert (panneau Projet Expert ou
Ultimate Basic), l'en-tête de la boîte de dialogue affiche un bouton **Fichier /
Projet** ; **Projet** est sélectionné par défaut. Les onglets situés en dehors
d'un projet conservent l'historique par fichier décrit ci-dessus.

- La commande **Commit** enregistre tous les fichiers sources du projet dans une
  seule entrée : les fichiers de l’arborescence du projet ainsi que les fichiers
  texte qu’ils incluent (`.include`, `include`, `#import`, `!source`, blocs
  INCLUDE en mode bloc). Les onglets ouverts sont comptabilisés avec leur
  contenu actuel, même non enregistré ; les autres fichiers sont lus depuis le
  disque. Les fichiers binaires de l’arborescence du projet (polices, `.koa`,
  `.bin`, `.sid`, …, jusqu’à 1 Mo chacun) sont également enregistrés ; leur
  différence indique la modification de taille, et **Checkout** les réécrit
  directement sur le disque.
- Le journal affiche le message de commit, le hachage court et les fichiers
  modifiés de chaque entrée (A ajoutés, M modifiés, D supprimés).
- **Diff** fonctionne fichier par fichier : chaque fichier modifié reçoit son
  propre en-tête et ses propres morceaux.
- **Rejeter les modifications** revient au dernier commit du projet (HEAD) de la
  même manière.
- **Checkout** (après confirmation) charge tous les fichiers de cette version
  dans l'éditeur : les onglets ouverts sont mis à jour, les fichiers manquants
  sont ouverts dans de nouveaux onglets. Rien n'est écrit sur le disque tant que
  vous n'avez pas enregistré ; les fichiers ajoutés au projet depuis cette
  version restent inchangés.
- Les entrées de sauvegarde automatique sont également créées au niveau du
  projet.
- L'historique du projet est stocké à côté du fichier de projet sous la forme
  `<project>.proj.history.json`.
- En mode Git, le journal affiche l'intégralité du dépôt avec les fichiers
  modifiés de chaque commit (git log --name-status) ; la commande Diff sur une
  entrée affiche les fichiers modifiés du commit, le bouton Diff compare HEAD
  avec les fichiers du projet dans l'éditeur (RAW correspond à git diff HEAD du
  dépôt). La commande Commit enregistre tous les onglets de projet non
  enregistrés et ajoute toutes les modifications à l'index (git add -A) ; la
  commande Checkout charge les fichiers du projet correspondant à ce commit dans
  l'éditeur.

#### Git

Si `git` est installé, la même boîte de dialogue peut fonctionner avec un
véritable dépôt git.

- **Paramètres → Contrôle de version : ** **Choisissez git.exe… ** ou
  **Détection automatique ** (recherche dans le PATH et les répertoires
  d'installation habituels) ; la ligne en dessous indique la version de git.
  **Utiliser Git lorsque le projet est dans un dépôt ** (activé par défaut)
  bascule automatiquement la boîte de dialogue en mode Git pour les fichiers
  situés dans un dépôt. Le bouton **Intégré / Git ** dans l'en-tête de la boîte
  de dialogue permet de changer de mode manuellement.
- L'en-tête montre la branche avec **↑** (commits à pousser) et **↓** (commits à
  tirer), suivi des fichiers modifiés du dépôt.
- **Commit** enregistre d'abord le fichier, met en scène uniquement ce fichier
  (ou chaque modification avec **Mettre en scène toutes les modifications (git
  add -A)**) et exécute `git commit`.
- Le journal liste les commits de ce fichier avec leurs branches et leurs
  étiquettes. **Diff** sur une entrée compare le commit avec son parent ; le
  bouton **Diff** compare HEAD avec l'éditeur, modifications non enregistrées
  incluses. Les fichiers du projet sont comparés de la même manière qu'en mode
  intégré ; **RAW** affiche le résultat brut de `git diff`.
- **Checkout** charge le fichier de ce commit dans l'éditeur (`git show`) sans
  toucher au disque.
- **Pull** (`--ff-only`), **Push** (le premier push définit l'amont avec `-u
  origin <branche>`) et **Créer un dépôt (git init)** lorsque le dossier n'est
  pas encore un dépôt.
- git s'exécute sans fenêtre de console et ne demande jamais de mot de passe :
  les identifiants doivent provenir d'un gestionnaire d'identifiants ou d'une
  clé SSH, sinon un message d'erreur s'affiche dans la boîte de dialogue. |
  **Base de connaissances** | Liens de référence (6502 opcodes, noyau C64, carte
  mémoire, couleurs) | | **Rechercher une mise à jour** | Consultez c64va.pro
  pour une version plus récente et téléchargez-la/installez-la — voir [Mises à
  jour intégrées](#in-app-updates) |

### Outils de l'éditeur

**Menu → Rechercher les mises à jour** recherche la dernière version sur
c64va.pro (il lit les liens de téléchargement pour votre plateforme) et la
compare avec la version en cours d'exécution :

- coloration syntaxique basée sur la référence actuelle du langage Ultimate
  Basic ;
- numéros de ligne qui restent synchronisés avec les fichiers longs ;

Le panneau Désassemblage comprend un bouton **Copier** qui copie l'intégralité
du code source affiché dans le presse-papiers. L'aide des commandes suit le
compilateur intégré : par exemple, `sprite_frame id, data_address [, frame]`
sélectionne une image d'animation parmi des images de sprite consécutives de 64
octets.

| Plate-forme | Ce qui se produit                                                                                                                                                                                                                                  |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Windows** | L'installation s'exécute en mode passif (suivi de la progression uniquement) et lance la nouvelle version une fois terminée. L'installation par machine requiert des droits d'administrateur (UAC).                                                |
| **macOS**   | L'image disque (DMG) est montée et le paquet d'application est remplacé, puis la nouvelle version démarre. Si le dossier de l'application n'est pas accessible en écriture, ouvrez simplement l'image disque pour y glisser-déposer l'application. |
| **Linux**   | Une AppImage est remplacée par la nouvelle. Une installation `.deb` / `.rpm` est mise à jour avec `pkexec` (votre mot de passe vous est demandé) ; sans `pkexec`, le paquet est ouvert dans votre gestionnaire de logiciels.                       |

La hauteur de la liste des commandes est volontairement limitée afin que la
fiche de détail de la commande puisse occuper toute la hauteur restante du
panneau. La zone de détail défile indépendamment pour les descriptions de
syntaxe plus longues.

### Source libre et ouverte

Visual Assembler est gratuit : toutes ses fonctionnalités — les éditeurs visuels
(SID, Sprite, Char, Charset, Hi-Res, Map, Level, D64, Curve), le lecteur SID, la
création de projets (PNG, D64, CRT), l’empaquetage Exomizer, l’exécution sur C64
Ultimate et Kung Fu Flash 2, ainsi que tous les thèmes et langues d’interface —
fonctionnent sans inscription ni numéro de série. Le code source est disponible
sous licence GNU GPL v3.0 (voir Menu → À propos). Jusqu’à la version 2.5.9,
l’application proposait une version Freemium et une version Professionnelle ;
depuis la version 2.6.0, aucun numéro de série n’est requis.

Si vous aimez le programme, vous pouvez soutenir son développement avec un don :
**Menu → Donation** (sous Afficher) ouvre la page de don sur c64va.pro, où vous
pouvez donner n'importe quel montant via PayPal.

**Statistiques d'utilisation.** Au maximum une fois par jour, au démarrage,
l'application envoie une requête anonyme à c64va.pro contenant la version de
l'application, le système d'exploitation, la langue de l'interface utilisateur,
le nombre de lancements et le temps d'activité écoulé depuis la dernière requête
(une minute correspond à la période pendant laquelle la fenêtre est visible et
où vous avez utilisé la souris ou le clavier au cours des 5 dernières minutes).
L'application indique également si un numéro de série (de la version 2.5.6 à la
version 2.5.9) est toujours enregistré (oui/non uniquement) et génère un
identifiant d'installation aléatoire (conservé dans le fichier `config.json` de
l'application sous le nom `launchPing`). Aucune adresse e-mail, numéro de série,
projet ou code source n'est transmis ; aucune action n'est effectuée hors ligne.
L'application demande également occasionnellement à c64va.pro un court message
(par exemple, concernant une nouvelle version, parfois réservé aux
contributeurs) ; chaque message est affiché une seule fois.

### Signaler un bug

**Menu → Signaler un bug** ouvre un formulaire qui envoie le rapport directement
au développeur.

- **Résumé** et **Que s'est-il passé ?** sont obligatoires : décrivez ce que
  vous avez fait, ce à quoi vous vous attendiez et ce qui s'est produit.
  **Adresse e-mail** est facultative ; indiquez-la si vous souhaitez une
  réponse.
- Captures d'écran : jusqu'à 4 images avec Ajouter une image…, en les collant
  avec Ctrl+V (par exemple après Win+Shift+S) ou en les déposant sur le
  formulaire. Les images volumineuses sont redimensionnées à 1920 pixels.
- ** Inclure les informations système et les erreurs récentes ** (activé par
  défaut) : ajoute la version de l’application, le système d’exploitation, la
  langue, le thème, l’éditeur et le mode d’exécution, la taille de l’écran, le
  nombre de blocs et les dernières erreurs de l’application. ** Que sont envoyés
  ? ** Affiche les données. Votre code source n’est pas envoyé.
- **Envoyer le rapport** confirme avec le numéro de rapport. **Envoyer par
  courriel** ouvre votre programme de messagerie.

### Soutien

**Menu → Support** ouvre une conversation avec le développeur : écrivez une
question, une idée ou un problème et appuyez sur **Envoyer** (ou
**Ctrl+Entrée**). Vous pouvez joindre jusqu'à 3 fichiers (4 Mo au total) :
images, fichiers sources (`.asm`, `.ub`, `.txt`…), fichiers C64 (`.prg`, `.d64`,
`.sid`, `.crt`…) ou un fichier `.zip` — en utilisant **Joindre un fichier…**, en
collant (**Ctrl+V**) ou en les faisant glisser dans la fenêtre. La réponse
apparaît dans la même fenêtre, y compris pour les fichiers : les images
s'affichent en aperçu, un clic permet d'enregistrer le fichier. La fenêtre n'est
pas modale : faites-la glisser par son en-tête, redimensionnez-la depuis son
coin inférieur droit et continuez à travailler même lorsqu'elle est ouverte.
L'application vérifie les réponses au démarrage et toutes les minutes ; une
nouvelle réponse émet un bref bip (le bouton haut-parleur dans l'en-tête de la
fenêtre permet de le désactiver), l'icône de la barre des tâches clignote
lorsque l'application est en arrière-plan, un point rouge apparaît sur le bouton
Menu et la fenêtre s'ouvre une fois. Une fois la conversation engagée, une icône
d'enveloppe à côté du bouton Menu l'ouvre ; elle devient rouge et clignote en
fonction du nombre de réponses non lues. Le bouton × à côté d'un message permet
de le supprimer, tandis que le bouton Corbeille dans l'en-tête de la fenêtre
supprime toute la conversation et ses pièces jointes (également pour le
développeur ; une demande de confirmation est requise dans les deux cas). Une
adresse e-mail est facultative : si vous en indiquez une, la réponse vous sera
également envoyée par e-mail. La conversation est liée à l'identifiant
d'installation aléatoire de l'application ; il n'y a donc ni compte ni mot de
passe.

### Projets, onglets et fichiers de démarrage

Les projets Ultimate Basic utilisent des fichiers `.proj` et peuvent contenir
plusieurs sources `.ub`. Le panneau Projet liste les fichiers ouverts, signale
les onglets non enregistrés et affiche les étiquettes, fonctions et
sous-programmes détectés. Les actions du projet permettent de créer, d'ouvrir,
d'enregistrer et de fermer un projet, ou d'ajouter un autre fichier source. Un
nouveau projet peut également être créé à partir d'un modèle Ultimate Basic —
voir [Modèles de projet]{1}.

- **Ajouter un fichier** — sélectionnez un ou plusieurs fichiers à la fois (tout
  type : `.ub`, `.bin`, `.prg`, images, polices, etc.). `.ub` Les sources sont
  également ouvertes sous forme d’onglets d’éditeur ; tout autre fichier est
  ajouté uniquement à titre de référence, pour que les ressources
  `incbin`/`loadfile` soient incluses dans le projet.
- **Ajouter un dossier** — référencer un dossier entier (par exemple un
  répertoire de ressources `incbin` comme `fonts/`) afin qu'il reste associé au
  projet.
- Seuls les onglets associés à un fichier réel sur disque sont enregistrés dans
  l'espace de travail ; un onglet contenant un échantillon non enregistré ou un
  programme uniquement en mémoire n'a rien à conserver et est ignoré (avec un
  avertissement si aucun des onglets ouverts ne remplit les conditions
  requises).
- L'ouverture d'un espace de travail ferme d'abord tous les onglets actuellement
  ouverts ; une confirmation vous sera demandée avant de poursuivre.
- Si un espace de travail fait référence à un fichier qui a depuis été déplacé
  ou supprimé, cette entrée est ignorée et signalée par son nom après le
  chargement.
- Les projets Expert et Ultimate Basic ouverts sont également conservés :
  l’arborescence du projet (y compris les ajouts et suppressions non
  enregistrés), le fichier de démarrage et le répertoire cible d’enregistrement
  `.proj sont restitués avec l’espace de travail. Les espaces de travail
  enregistrés par des versions antérieures s’ouvrent sans ces éléments.

### Utilisation de la fenêtre mémoire et de la page zéro

Le panneau **Full C64 memory** peut être détaché : le bouton **unock** dans son
en-tête le déplace dans une fenêtre séparée, non modale, que vous pouvez
déplacer et redimensionner tout en continuant à éditer (le badge de
superposition est conservé). **Dock** (ou × / Échap) le remet en place. La
fenêtre conserve en mémoire si elle était détachée et sa taille.

Lorsque le programme accède à la page zéro, une section **Utilisation de la page
zéro** apparaît en haut de la carte mémoire : une grille 16 × 16 de `$00–$FF`,
colorée par zone — port CPU (`$00–$01`), libre (`$02`, `$FB–$FE`), BASIC
(`$03–$8F`, `$FF`) et KERNAL (`$90–$FA`). Les cellules utilisées sont remplies ;
Un cadre indique une opération d'écriture (**write**), un hachurage une
opération de pointage (**(zp),Y` / `(zp,X)`). Cliquez sur une cellule utilisée
pour voir les lignes qui y accèdent (cliquez sur une ligne pour y accéder
directement) et un avertissement s'affiche lorsque vous écrivez dans la zone
BASIC ou KERNAL.

Si le programme contient le lecteur exporté de l'éditeur SID (étiquettes
`sid_`), la page zéro du lecteur (`$02–$1C`, `$2F`, `$FB–$FD`) est également
marquée, et chaque adresse que votre propre code utilise également est signalée
comme un **conflit** (cadre rouge, avertissement dans l'en-tête).

### Bâtiment et diagnostic

Le bouton **Build** ouvre la même interface de progression centrée que celle
utilisée par les autres flux de travail d'exécution de Visual Assembler. Les
compilations réussies mettent à jour les sections Sortie de compilation,
Informations de compilation et Désassemblage. Activez l'option **Verbose** pour
inclure les détails de la carte mémoire du compilateur, les allocations internes
de pages zéro et les données du code généré.

1. Le résultat de la compilation est automatiquement affiché ;
2. Les erreurs du compilateur sont affichées en rouge ;
3. La boîte de dialogue de compilation centrée affiche l'échec ;
4. En cas d'erreur contenant une ligne source, sélectionnez cette ligne dans
   l'éditeur UB actif.

| Section           | Modèles intégrés                                                                                                                                                                                                                                |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Assembleur**    | Programme vide, jeu vide (titre / états de jeu / fin de partie, joystick, sprite du joueur), bitmap haute résolution, bitmap multicolore, multiplexeur de sprites (16 sprites triés par Y à chaque image, affichés par une chaîne d'IRQ raster) |
| **UltimateBasic** | Programme vide, jeu vide (même machine à états dans UB), bitmap haute résolution (`ligne` / `rect` / `cercle` avec `stylo de couleur`), IRQ raster (une `sub` appelée à chaque image à partir de l'interruption raster)                         |

En cas d'échec de la compilation :

Les rapports d'informations de compilation contiennent les adresses de
chargement/de fin, les tailles de code et de PRG, l'état de l'Exomizer, les
variables, les tableaux, les fonctions/sous-programmes et les étiquettes.

```asm
; @name Barres raster

; @name.hu Barres raster

; @category Effets

; @desc Deux barres raster dans la bordure.

; @order 50
```

Les blocs `@name`, `@category` et `@desc` peuvent avoir des variantes selon la
langue (`@name.hu`, `@desc.de`, …). Le bloc `@order` trie la liste. Tout ce qui
suit l'en-tête devient le nouveau fichier principal, et `{{PROJECT}}` est
remplacé par le nom du projet (utilisez-le dans un commentaire pour que le
modèle puisse toujours être compilé).

### En cours d'exécution, D64 et Exomizer

Le bouton principal **Run** prend en charge Ultimate Basic dans toutes les
destinations normales :

- chaque source compilable (`.asm`, bloc `.json`, `.ub`) est compilée en un
  `.prg` ** à côté de sa source** avec le même nom ; avec **Exécuter avec
  Exomizer** activé, la sortie est compressée ;
- Les fichiers annexes du débogueur (symboles / carte source) sont écrits en
  même temps que le PRG lorsqu'ils sont disponibles ;
- Les modules qu'un autre fichier importe avec `.include` / `include` (et les
  fichiers `.inc`) sont ignorés, de même que les onglets qui n'ont jamais été
  enregistrés ;
- un rapport répertorie chaque fichier avec sa taille, *skipped* raison ou
  erreur du compilateur, et la barre d'état affiche *N / M fichiers construits*.

### Symboles du débogueur et désassemblage

Les builds demandent des informations de débogage Ultimate Basic et produisent
trois sidecars compatibles :

- `.sym` pour les symboles de style KickAssembler ;
- `.dbg` pour les informations source et de segment du débogueur
  C64/RetroDebugger ;
- `.vs` pour les étiquettes du moniteur VICE.

### Manuel et source Ultimate Basic

L'icône de livre dans la barre d'outils UB ouvre le manuel Ultimate Basic
`MANUAL.pdf ` correspondant hors ligne ; le bouton « Manuel » de la boîte de
dialogue de bienvenue au démarrage ouvre le même manuel. Visual Assembler
utilise le compilateur et le PDF à partir de la dépendance Git/Cargo amont, ce
qui évite à l'IDE de conserver une seconde copie de l'implémentation d'Ultimate
Basic. La boîte de dialogue « À propos » et l'écran de démarrage affichent la
version actuelle de la dépendance.

- `* = 1500 $` → Bloc ORG
- `Étiquette : ` → Bloc ÉTIQUETTE
- `Étiquette : .byte 0` → ÉTIQUETTE + blocs BYTE
- `.octet ...` → Bloc d'octets
- `; commentaire` (ou en ligne `; ...`) → Bloc COMMENTAIRE
- instructions (`lda`, `jsr`, `beq`, etc.) → blocs d'instructions avec mode
  d'adressage détecté

#### Notes d'analyse et bonnes pratiques d'importation

- Les étiquettes locales comme `.wait` sont importées comme étiquettes standard
  (point supprimé) et les références sont normalisées en conséquence.
- Pour l'adressage de style `($zp),Y` / `($zp,X)`, utilisez un octet de page
  zéro concret (`$FB`, `$FC`, etc.) pour une meilleure compatibilité.
- Évitez les étiquettes courtes ambiguës qui ressemblent à hex (`cc1`, `dead`,
  `beef`) dans les contextes de branche ; préférez les noms comme `loop_cc1`.
- Si votre programme commence par des données (`.byte`) avant le code
  exécutable, ajoutez un saut d'entrée explicite (par exemple `JMP Start`) en
  haut.

### Importation ASM (Kick Assembler)

Le bouton **ASM ** du menu Programme importe le code source brut de Kick
Assembler dans un nouvel onglet en mode bloc. Il est distinct du bouton `Charger
un fichier .asm ` du mode Expert mentionné ci-dessus ; son infobulle
personnalisée indique que **seul le code Kick Assembler est pris en charge **
(d'autres assembleurs peuvent analyser partiellement le code, mais l'analyse
complète n'est pas garantie).

Modèles pris en charge :

- `.pc = $XXXX` directive d'origine → Bloc ORG
- `.const NAME = valeur`, `.label NAME = valeur` → CONST equate
- `.macro NOM(p1, p2, ...) { ... }` avec `{`/`}` corps d'accolade ou `.endm` →
  définition de macro utilisateur
- L'appel de macro `NAME(args)`, le préfixe Kick à deux-points `:NAME(args)` et
  `.invoke NAME(args)` — tous ces allers-retours se font via la forme Kick à
  deux-points
- Les étiquettes `@local` (`@loop:`, `BEQ @loop`) conservent le préfixe `@` tel
  quel.
- Opérande `label + N` / `label - N` (par exemple `STA mod1+2`, `LDA xp+1`)
- Les commentaires de ligne `// ...` et `;` sont tous deux acceptés ; les blocs
  `/* ... */` sont traités comme une seule ligne de commentaire.
- Gestion automatique du démarrage BASIC : lorsque le programme démarre à
  `$0801` avec le stub d'octets standard `SYS 2061` (`.byte
  $0B,$08,$0A,$00,$9E,$32,$30,$36,$31,$00,$00,$00`), le compilateur génère le
  PRG tel quel au lieu d'ajouter un second SYS BASIC.

Limitation connue :

- Les constantes qui correspondent à une adresse de page zéro (par exemple,
  `.const BYTEADDR = $FC` utilisée comme `STA BYTEADDR`) sont actuellement
  compilées en instructions en mode absolu (3 octets) au lieu d'instructions de
  page zéro (2 octets). Le code compilé écrit toujours à l'emplacement mémoire
  correct, mais avec une légère surcharge de taille et de cycles par rapport au
  même code source compilé avec Kick Assembler.

## 6. Mode expert

Le mode Expert est un éditeur assembleur 6502 complet en mode texte direct,
intégré à l'éditeur de blocs. Chaque onglet peut être en mode Bloc ou en mode
Expert ; vous pouvez basculer librement entre les deux à tout moment grâce au
bouton **Bloc / Expert** situé dans la barre supérieure.

### Changement de mode

Sélectionnez l'icône **UB** dans la barre d'outils principale pour passer en
mode Ultimate Basic. Le mode d'édition sélectionné est conservé après le
redémarrage de l'application. Un nouveau code source commence par :

```basic
Couleur de fond : 0

Couleur de bordure : 0

Imprimer « BONJOUR DE LA PART D'ULTIMATE BASIC »
```

Le mode UB fonctionne avec les fichiers sources `.ub`. Les commandes
**Nouveau**, **Ouvrir**, **Enregistrer** et **Enregistrer sous** s'appliquent à
l'onglet UB actif. L'ouverture d'un fichier `.ub` active automatiquement
l'onglet d'éditeur correspondant.

La barre d'outils affiche le dossier de travail UB actuel. Ce dossier est
distinct du dossier de travail Bloc/Expert. Lorsque le mode UB est actif, le
menu Fichier → Définir le dossier de travail permet de sélectionner le dossier
UB ; son infobulle indique la portée active. Les boîtes de dialogue
Ouvrir/Enregistrer UB s'ouvrent à partir de ce dossier, et les sources non
enregistrées l'utilisent comme base pour les chemins relatifs include et incbin.

### Mise en page de l'éditeur

La barre d'outils UB reprend le même langage visuel et les mêmes infobulles
personnalisées que le mode Expert. Elle offre :

- coloration syntaxique basée sur la référence actuelle du langage Ultimate
  Basic ;
- numéros de ligne qui restent synchronisés avec les fichiers longs ;
- une mini-carte et des commandes de zoom de l'éditeur (`Ctrl` + molette de la
  souris permet également de zoomer) ; cliquez sur la mini-carte pour sauter ou
  faites glisser sa sélection de fenêtre d'affichage pour un défilement continu
  ;
- Rechercher (`Ctrl+F` / `Cmd+F`) à l'aide de la barre de recherche de style
  expert ;
- mise en forme du code source avec indentation tenant compte de la structure ;
- Saisie semi-automatique des commandes et des fonctions intégrées ;
- un panneau de commandes ** consultable avec syntaxe, description et conseils
  d'utilisation — les descriptions suivent la langue de l'interface utilisateur
  actuelle (hongrois, anglais, espagnol, allemand, néerlandais), en revenant à
  l'anglais pour tout ce qui n'est pas encore traduit ;
- Panneaux **Projet** et **Commandes** activables indépendamment, affichés côte
  à côte lorsque les deux sont activés ;
- Panneaux **Build Output** et **Disassembly** activables et redimensionnables
  indépendamment.

Le panneau Désassemblage comprend un bouton **Copier** qui copie l'intégralité
du code source affiché dans le presse-papiers. L'aide des commandes suit le
compilateur intégré : par exemple, `sprite_frame id, data_address [, frame]`
sélectionne une image d'animation parmi des images de sprite consécutives de 64
octets.

L'éditeur comprend également la syntaxe de style QBasic d'Ultimate Basic 1.6.3 :
`dim nom as type`, `fonction … end fonction`, `sub … end sub`, `elseif`, `do …
loop [while | jusqu'à `, `tant que … se termine `, `sélectionner cas `, `sortir
faire ` / `sortir pour ` / `sortir tant que ` / `sortir sous-` / `sortir
fonction `, les fonctions de chaîne `gauche$` / `droite$` / `milieu$`, et les
commentaires commençant par `'` ainsi que `#` ou `rem`. Les mots que le
compilateur traite comme des mots clés à une seule position sont colorés
uniquement à cet endroit et restent utilisables comme noms : `as` avec les noms
de types BASIC (`byte`, `integer`, `single`, `double`), `case is`, `map view`,
`wait key` et les options de défilement `scroll` (`row`, `x`, `y`, `gauche`,
`droite`, `étroit`, `large`). La fonction **Format** indente les blocs
`function`, `do … loop`, `while … wend` et `elseif` et laisse les boucles sur
une seule ligne (`do while c : … : loop`) non indentées, le panneau Projet liste
les blocs `function` sous Fonctions, et le panneau Commandes contient **DIM**,
**FUNCTION**, **ELSEIF**, **DO**, **WEND**, **SELECT CASE**, **END**, **EXIT
SUB**, **LEFT$**, **RIGHT$** et **MID$** entrées.

La hauteur de la liste des commandes est volontairement limitée afin que la
fiche de détail de la commande puisse occuper toute la hauteur restante du
panneau. La zone de détail défile indépendamment pour les descriptions de
syntaxe plus longues.

### Boutons de la barre d'outils

Les projets Ultimate Basic utilisent des fichiers `.proj` et peuvent contenir
plusieurs sources `.ub`. Le panneau Projet liste les fichiers ouverts, signale
les onglets non enregistrés et affiche les étiquettes, fonctions et
sous-programmes détectés. Les actions du projet permettent de créer, d'ouvrir,
d'enregistrer et de fermer un projet, ou d'ajouter un fichier source. La boîte
de dialogue de contrôle de version permet de valider, de comparer et de
restaurer tous les fichiers du projet simultanément — voir [Mode
Projet](#project-mode). Un nouveau projet peut également être créé à partir d'un
modèle Ultimate Basic — voir [Modèles de projet](#project-templates).

Cliquez sur l'étoile à côté d'un fichier de projet pour le désigner comme
fichier de démarrage. Les commandes Build, Run, D64, C64 Ultimate et Debug
compilent ce code source de démarrage même si un autre onglet est actif. En
l'absence de sélection de fichier de démarrage, l'onglet UB actif est utilisé.

La barre d'outils du panneau de projet comporte deux boutons d'ajout, et les
boîtes de dialogue de fichiers sont par défaut configurées sur le dossier de
travail **UB** (Menu → Fichier → Définir le dossier de travail, spécifique à UB)
:

- **Ajouter un fichier** — sélectionnez un ou plusieurs fichiers à la fois (tout
  type : `.ub`, `.bin`, `.prg`, images, polices, etc.). `.ub` Les sources sont
  également ouvertes sous forme d’onglets d’éditeur ; tout autre fichier est
  ajouté uniquement à titre de référence, pour que les ressources
  `incbin`/`loadfile` soient incluses dans le projet.
- **Ajouter un dossier** — référencer un dossier entier (par exemple un
  répertoire de ressources `incbin` comme `fonts/`) afin qu'il reste associé au
  projet.

Les dossiers de l'arborescence comportent une flèche de réduction/développement.
Un clic droit sur un dossier permet d'ajouter un ou plusieurs fichiers imbriqués
(affichés en retrait). Chaque entrée possède un bouton de suppression (✕). Les
entrées autres que `ub` sont uniquement consultables et ne s'ouvrent pas en
cliquant dessus.

Le bouton **Enregistrer le projet** se désactive et affiche un état « Enregistré
» une fois que le projet ne comporte plus de modifications en attente, et se
réactive automatiquement dès que vous ajoutez, supprimez ou réorganisez un
fichier ou un dossier.

### Mini-carte de l'éditeur expert

La mini-carte de l'éditeur expert est une bande étroite (`88 px`) située à
l'extrême droite de la zone d'édition. Elle affiche une représentation réduite
de chaque ligne du code source :

Un indicateur de zone d'affichage semi-transparent (rectangle de couleur
accentuée) indique la partie de la source actuellement visible. Cliquez
n'importe où sur la mini-carte pour vous y rendre ; faites glisser pour un
défilement continu. La mini-carte défile indépendamment afin de maintenir
l'indicateur de zone d'affichage centré. L'état est conservé dans les paramètres
d'interface utilisateur (touche expertMinimap).

- Le résultat de la compilation est automatiquement affiché ;
- Les erreurs du compilateur sont affichées en rouge ;
- La boîte de dialogue de compilation centrée affiche l'échec ;
- En cas d'erreur contenant une ligne source, sélectionnez cette ligne dans
  l'éditeur UB actif.

Les rapports d'informations de compilation contiennent les adresses de
chargement/de fin, les tailles de code et de PRG, l'état de l'Exomizer, les
variables, les tableaux, les fonctions/sous-programmes et les étiquettes.

### Taille du code par ligne et indications

Le bouton **taille du code** de la barre d'outils (icône de flamme) indique,
après la compilation, le nombre d'octets générés par chaque ligne du code source
: ce nombre s'affiche dans la marge du numéro de ligne et une barre orange
représente son poids par rapport à la ligne la plus gourmande en ressources. La
barre d'état additionne le nombre d'octets et le nombre estimé de cycles (lignes
droites, boucles non comptabilisées) de la ligne sous le curseur.

Pendant que vous tapez, un bouton **indices** apparaît dans la barre d'état
lorsqu'une erreur semble se produire ; cliquez dessus pour afficher la liste et
cliquez sur un indice pour accéder à la ligne :

- `sys $EA31` / `sys $EA81` — `sys` est compilé en `JSR`, donc le `RTI` du
  KERNAL retourne à des données inutiles ; depuis une IRQ, utilisez `irq_exit`
  ou `asm { JMP $EA31 }` ;
- `wait key` — forme non documentée, utilisez `waitkey` ;
- une `var` / `dim` / `const` qui n'est jamais utilisée ;
- après une compilation : une instruction de bloc `asm` sur une adresse de page
  zéro qui contient une variable Ultimate Basic ou la propre page zéro du
  runtime.

### Mise en évidence des erreurs

Les lignes qui ne compilent pas sont surlignées en rouge (fond teinté + bordure
accentuée à gauche) en temps réel, 350 ms après chaque frappe. Le premier
message d'erreur s'affiche également dans la barre d'état. Corrigez la ligne et
la surbrillance disparaîtra automatiquement.

| Mode d'exécution                 | Comportement fondamental ultime                                                                                                                                                   |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Exécuter en tant que PRG**     | Compilez et lancez le PRG directement dans VICE.                                                                                                                                  |
| **Exécuter via D64**             | Compilez, ouvrez la boîte de dialogue d'empaquetage D64 standard, puis lancez le disque dans VICE.                                                                                |
| **Exécuter sur Ultimate**        | Téléchargez et exécutez le PRG via la connexion REST C64 Ultimate configurée.                                                                                                     |
| **Exécuter D64 sur le matériel** | Emballez un D64 et envoyez-le au C64 Ultimate configuré.                                                                                                                          |
| **Kung Fu Flash 2**              | Compilez le code source de démarrage UB et téléchargez le PRG via USB sur un véritable C64/C128 équipé d'une cartouche Kung Fu Flash 2. Voir [Kung Fu Flash 2](#kung-fu-flash-2). |

L'option globale **Paramètres → Exomizer ** s'applique également aux versions UB
et aux cibles d'exécution normales ; aucun commutateur UB supplémentaire n'est
nécessaire. Le débogueur utilise délibérément le PRG non compressé afin que les
adresses et les symboles du compilateur correspondent toujours au programme
exécuté.

Activez **Paramètres → Paramètres du programme → Générer le code source
UltimateBasic ASM (.asm)** pour enregistrer le code assembleur généré par le
compilateur à côté d'une version PRG ou D64 utilisant le même nom de fichier de
base. Il s'agit d'une option de compilation ; la barre d'outils UB ne contient
donc pas de boutons d'exportation ASM distincts. Une instruction `load "NOM",
$adresse` fournit également l'adresse de chargement PRG du fichier
supplémentaire D64 correspondant.

### Mise en évidence de la syntaxe

L'éditeur utilise une superposition transparente (`<div>` ou `expert-hl`) qui
reflète le contenu de la zone de texte avec des éléments colorés (`<span>`). La
mise en surbrillance peut être désactivée à l'aide du bouton **HL** pour
optimiser les performances des programmes très volumineux.

- `.sym` pour les symboles de style KickAssembler ;
- `.dbg` pour les informations source et de segment du débogueur
  C64/RetroDebugger ;
- `.vs` pour les étiquettes du moniteur VICE.

Les directives `REGION` / `ENDREGION` sont mises en évidence comme les autres
directives assembleur. Les régions réduites ne conservent que leur en-tête
visible dans l'éditeur jusqu'à leur réouverture. Le nouveau bouton **Sélection
de région** de la barre d'outils contrôle uniquement la mise en évidence
automatique de la région courante en mode Expert ; le désactiver permet de
conserver le code source visible sans modifier l'état de réduction.

### Formateur de source

Cliquez sur le bouton **Format** (`#expert-format-btn`) pour formater
automatiquement la source actuelle :

Ultimate Basic est également disponible en tant que projet open source autonome
:

<https://github.com/zstarczali/UltimateBasic>

Le compilateur est intégré à Visual Assembler, donc aucun exécutable `ub` séparé
n'est requis lors de l'exécution.

## 7. Modes d'adressage

Chaque instruction 6502 prend en charge un ou plusieurs modes d'adressage. Le
sélecteur de mode figure sur chaque bloc.

### Les expressions étiquetées comme opérandes

- **Bloc → Expert : ** Le programme actuel est sérialisé en texte (une
  instruction par ligne, étiquettes et macros sous forme de directives). Les
  modifications effectuées en mode Expert sont synchronisées avec le tableau de
  blocs dès que vous revenez au mode Bloc ou que vous déclenchez une action.
- **Expert → Bloc : ** le texte est analysé avec `parseAsmText() ` et le
  résultat remplace le programme du bloc. Une boîte de dialogue d'erreur de
  compilation s'affiche en cas d'échec de l'analyse.
- **Les lignes vides** sont préservées lors des allers-retours : les lignes
  vides dans l’éditeur Expert apparaissent comme de fins espaces en pointillés
  en mode Bloc et sont restaurées comme lignes vides lors du retour au mode
  Expert.

### Le compteur de programme `*` dans les expressions

```
┌───────────────────────────────────────────────────────────────┐
│ [barre d'outils] Bloc │ Expert &lt; bascule d'onglet │

├────────────┬────────────────────────────┬────────────┤

│ Palette │ Éditeur de texte ASM │ Disasm │

│ (opt.) │ (monospace, modifiable) │ panneau │

│ │ │ (opt.) │
└───────────┴────────────────────────────┴────────────┘
```

| Panneau       | Basculer              | Description                                             |
| ------------- | --------------------- | ------------------------------------------------------- |
| **Palette**   | `#expert-palette-btn` | Branchement à soi-même (boucle infinie, décalage `$FE`) |
| `*-n` / `*+n` | `BNE *-5`, `BEQ *+4`  | Branchement relatif au PC actuel de *n* octets          |
| `JMP *+n`     | `#expert-disasm-btn`  | Saut absolu calculé à partir du PC actuel               |

### Étiquettes locales (en pointillés)

| Bouton                                    | IDENTIFIANT                                    | Fonction                                                                                                                                                                                                                                                              |
| ----------------------------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Format**                                | `#bouton-format-expert`                        | Formatage automatique du code source (étiquettes en colonne 0, retrait de 4 espaces, mnémonique/opérande de 1 espace)                                                                                                                                                 |
| **Charger .asm**                          | `#expert-load-asm-btn`                         | Ouvrez un fichier `.asm` : son contenu est chargé dans un nouvel onglet **** dont le nom correspond à celui du fichier. Chaque fichier chargé devient un onglet indépendant, avec ses propres blocs de programme et son propre état d'éditeur.                        |
| **Enregistrer .asm**                      | `#expert-save-asm-btn`                         | Enregistrez le contenu de l'éditeur dans un fichier `.asm` (boîte de dialogue de fichier lors du premier enregistrement).                                                                                                                                             |
| **Informations sur la version**           | `#expert-build-info-btn`                       | Ouvrir la boîte de dialogue Informations de compilation (origine, taille, étiquettes, erreurs)                                                                                                                                                                        |
| **HL**                                    | `#expert-hl-btn`                               | Activer/désactiver la coloration syntaxique (désactiver pour les fichiers très volumineux)                                                                                                                                                                            |
| **Saisie automatique**                    | `#expert-autocomplete-btn`                     | Activer/désactiver les suggestions de saisie semi-automatique pour les experts. Lorsqu'elles sont désactivées, aucune directive, aucun mnémonique ni aucune étiquette ne s'affiche dans l'éditeur expert.                                                             |
| **Sélection de région**                   | `#bouton-sélection-région-expert`              | Activez ou désactivez la mise en surbrillance automatique des régions en mode Expert. L'état de pliage est conservé, mais lorsque cette option est désactivée, l'éditeur affiche l'intégralité du code source et ne sélectionne pas automatiquement la région active. |
| **Réduire/développer toutes les régions** | `#expert-region-fold-all-btn`                  | Dépliez ou repliez chaque bloc `.region` en un clic. Si une région est ouverte, le bouton les replie toutes ; si toutes les régions sont déjà repliées, un clic supplémentaire les déplie. Le bouton s'illumine lorsque toutes les régions sont repliées.             |
| **Numéros de ligne**                      | `#expert-line-numbers-btn`                     | Activez ou désactivez l'affichage de la marge de numérotation des lignes à gauche de l'éditeur. Cette marge reste synchronisée avec la position de défilement et se met à jour en temps réel pendant que vous tapez.                                                  |
| **Trouver**                               | `#expert-find-btn`                             | Ouvrez la barre de recherche flottante (Ctrl+F). Saisissez votre recherche ; les résultats s’affichent en surbrillance. Appuyez sur Entrée ou Maj+Entrée pour naviguer entre les résultats. Appuyez sur Échap pour fermer la barre.                                   |
| **Zoom arrière / zoom avant**             | `#expert-zoom-out-btn` / `#expert-zoom-in-btn` | Augmenter/diminuer la taille de la police de l'éditeur (8 à 28 px). Ctrl + molette de la souris (Cmd + molette sur macOS, ou pincer l'écran avec le pavé tactile) sur l'éditeur produit le même résultat. Le réglage est conservé.                                    |
| **Palette**                               | `#expert-palette-btn`                          | Afficher/masquer la palette mnémotechnique de gauche                                                                                                                                                                                                                  |
| **Désastre**                              | `#expert-disasm-btn`                           | Afficher/masquer le panneau de démontage (6502 pur, macros étendues)                                                                                                                                                                                                  |
| **Moniteur**                              | `#expert-monitor-btn`                          | Afficher/masquer le panneau d'affichage hexadécimal du moniteur                                                                                                                                                                                                       |
| **Mini-carte**                            | `#expert-minimap-btn`                          | Afficher/masquer la mini-carte du code sur le côté droit de l'éditeur                                                                                                                                                                                                 |

*(Nouveau dans la version 2.3.9.)* Une étiquette dont le nom commence par un
point — `.loop`, `.skip`, `.done` — est une étiquette locale.**Elle appartient à
la portée de l'étiquette globale (sans point) précédente la plus proche et
devient en interne {1}.{2}.` Deux étiquettes locales portant le même nom court
et appartenant à des étiquettes globales différentes ne sont pas en conflit.

### Étiquettes d'opérandes à code auto-modifiable

*(Nouveau dans la version 2.3.9.)* Préfixez l'opérande d'une instruction avec
`label:` pour placer une étiquette sur l'**octet d'opérande** plutôt que sur le
code opération. L'instruction est assemblée à partir de ce qui suit les
deux-points.

| Couleur de la barre    | Type de jeton                                                 |
| ---------------------- | ------------------------------------------------------------- |
| Commentaire couleur    | Lignes commençant par `;`                                     |
| couleur de l'étiquette | Lignes avec une étiquette `:` définition                      |
| Couleur directive      | `.byte`, `.macro`, `.region`, et toutes les autres directives |
| Couleur mnémotechnique | Tout le reste (instructions)                                  |

La valeur `` pointe vers `<adresse d'instruction> + 1` (le premier octet
d'opérande), quel que soit le mode d'adressage. Ceci remplace l'ancien modèle
`STA instruction+1` / `instruction : LDA #$00`. Il fonctionne en mode Bloc ⇄
Expert (le champ d'opérande conserve le préfixe `label:`).

### Comptages cycliques

Le bouton de la barre d'outils **compte les cycles** (icône d'horloge) ajoute
une marge qui affiche les 6510 cycles de chaque ligne d'instruction :

| Affiché       | Signification                                                                                                                                         |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `4`           | coût fixe                                                                                                                                             |
| `4+`          | lecture indexée (`abs,X`, `abs,Y`, `(zp),Y`) : +1 lorsque l’index traverse une page ; une base alignée sur la page (`$xx00`) indique la valeur exacte |
| `2/3`         | branche : non prise / prise                                                                                                                           |
| `2/4` (rouge) | Branche empruntée qui traverse une page — code temporel utile à connaître                                                                             |

Sélectionnez plusieurs lignes : la barre d’état affiche le total : nombre
d’instructions, cycles min-max et nombre de lignes raster PAL (63 cycles). Les
macros et les lignes de données ne sont pas comptabilisées. Le paramètre est
mémorisé.

### Conseils d'optimisation

L'éditeur Expert vérifie le code assemblé à la recherche de schémas courants.
Les lignes contenant une indication sont surlignées d'une bande orange et un
bouton « Indications » apparaît dans la barre d'état ; cliquez dessus pour
afficher la liste et cliquez sur une indication pour accéder à la ligne
correspondante. Les indications ne modifient jamais votre code.

- `JSR x` suivi de `RTS` → `JMP x` (1 octet plus court, 9 cycles plus rapide) ;
- `CMP #0` / `CPX #0` / `CPY #0` juste après une instruction qui a déjà défini
  N/Z pour ce registre (remarque : la comparaison définit également C) ;
- la même charge deux fois, ou une charge de la valeur qui vient d'être stockée
  (`STA x` / `LDA x`);
- `LDA m` / `CLC` / `ADC #1` / `STA m` → `INC m`, et la forme `SEC` / `SBC #1` →
  `DEC m`;
- un `JMP` ou branchement à l'instruction suivante, et `PHA` immédiatement suivi
  de `PLA`.

Une étiquette entre deux instructions (une cible de saut possible) supprime les
indications qui permettraient de les fusionner.

### Mise en évidence des erreurs

Les lignes qui ne compilent pas sont surlignées en rouge (fond teinté + bordure
accentuée à gauche) en temps réel, 350 ms après chaque frappe. Le premier
message d'erreur s'affiche également dans la barre d'état. Corrigez la ligne et
la surbrillance disparaîtra automatiquement.

### Mise en évidence de la syntaxe

L'éditeur utilise une superposition transparente (expert-hl) qui reflète le
contenu de la zone de texte avec des éléments colorés. La mise en surbrillance
peut être désactivée avec le bouton HL pour optimiser les performances des
programmes très volumineux.

| Couleur    | Jeton                                                                                                                                                                        |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| jaune-vert | Mnémoniques (`LDA`, `STA`, `JMP`, …) et pseudo-opérations à branche longue (`LBNE`, `LBEQ`, …)                                                                               |
| Bleu       | Directives (`.byte`, `.word`, `.fill`, `.assert`, `*=`, …)                                                                                                                   |
| Orange     | Nombres (`$FF`, `%1010`, `255`)                                                                                                                                              |
| Cyan       | Étiquettes — lignes se terminant par `:`, y compris les étiquettes locales (`.loop:`) et les étiquettes d'opérandes de code auto-modifiable (`value:` dans `LDA value:#$00`) |
| Sarcelle   | chaînes littérales                                                                                                                                                           |
| Violet     | Noms de macros personnalisés — le nom après `.macro`, `.invoke` et `.call`, et les appels `:name(...)` de type Kick                                                          |
| Aqua       | Paramètres de macro — les noms des paramètres dans l’en-tête `.macro` et les substitutions `{param}` dans le corps de la macro                                               |
| vert foncé | Commentaires (` ; …`)                                                                                                                                                        |

Les directives `REGION` / `ENDREGION` sont mises en évidence comme les autres
directives assembleur. Les régions réduites ne conservent que leur en-tête
visible dans l'éditeur jusqu'à leur réouverture. Le nouveau bouton **Sélection
de région** de la barre d'outils contrôle uniquement la mise en évidence
automatique de la région courante en mode Expert ; le désactiver permet de
conserver le code source visible sans modifier l'état de réduction.

### Formateur de source

Cliquez sur le bouton **Format** (`#expert-format-btn`) pour formater
automatiquement la source actuelle :

- Les définitions des étiquettes sont déplacées vers la colonne 0.
- Les instructions sont indentées de 4 espaces.
- Les mnémoniques sont en majuscules.
- Exactement un espace entre le mnémonique et l'opérande (les espaces
  supplémentaires sont normalisés).
- Si la source est déjà formatée, un statut `"Déjà formaté"` est affiché.

### Panneau et onglets du projet

Le mode expert prend en charge un panneau de projet ****
(`#expert-project-panel`) pour les projets multi-fichiers `.proj` :

- Un fichier `.proj` est un manifeste JSON qui répertorie les fichiers sources
  et leurs métadonnées.
- Ouvrez un projet avec **Menu → Fichier → Ouvrir un projet** ou faites glisser
  un fichier `.proj` sur la fenêtre.
- Chaque fichier du projet s'ouvre comme un onglet séparé dans la barre
  d'onglets en haut de l'éditeur.
- **Fermer le projet** (`Menu → Fichier → Fermer le projet` /
  `#menu-close-project`) ferme le projet en cours et tous ses onglets de
  fichiers simultanément. Un message vous invite à enregistrer les modifications
  non enregistrées avant la fermeture. Le panneau du projet est réinitialisé et
  `_expertProjectData` est effacé.
- Chaque fichier peut être désigné comme fichier de démarrage (icône étoile ★).
  Lorsqu'un fichier de démarrage est défini, le bouton Exécuter (PRG, D64,
  Ultimate) compile et exécute systématiquement le code de ce fichier, quel que
  soit l'onglet actif. Ceci est compatible avec les modes Bloc et Expert.
- Le bouton **Ajouter** de la barre d'outils permet de sélectionner un ou
  plusieurs fichiers simultanément (de tout type, et pas seulement
  `.json`/`.asm`) et de les référencer dans le projet sans les ouvrir.
  Utilisez-le pour les ressources binaires telles que les données `incbin`. La
  boîte de dialogue s'ouvre par défaut sur le dossier de travail VA. Le bouton
  **Ajouter un dossier** adjacent permet de référencer un dossier entier (par
  exemple, un répertoire de ressources) de la même manière. Les entrées de type
  référence uniquement affichent un bouton Supprimer (✕) mais ne s'ouvrent pas
  lorsqu'on clique dessus.
- Les dossiers dans l'arborescence ont une flèche de réduction/développement, et
  **cliquez avec le bouton droit sur un dossier** pour ajouter un ou plusieurs
  fichiers imbriqués en dessous (affichés en retrait).
- Le bouton **Enregistrer le projet** se désactive et affiche un état «
  Enregistré » une fois que le projet ne comporte plus de modifications en
  attente, et se réactive automatiquement dès que vous ajoutez, supprimez ou
  réorganisez un fichier ou un dossier.
- La section **symboles** en bas du panneau du projet peut être redimensionnée
  verticalement avec le séparateur entre l'arborescence des fichiers et la liste
  des symboles, de sorte que les longues listes de symboles peuvent prendre plus
  d'espace si nécessaire.
- Le contrôle de version fonctionne pour l'ensemble du projet : avec l'option «
  Projet » de la boîte de dialogue Contrôle de version, une seule validation
  enregistre tous les fichiers du projet, et l'extraction les restaure tous dans
  les onglets. Voir « Mode projet »(#project-mode).

### Barre d'onglets

La barre d'onglets apparaît au-dessus de l'éditeur lorsqu'il y a plus d'un
onglet ouvert.

| Fonctionnalité            | Description                                                                                                                                                                                                                                                                                                                                                                                      |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Point sale**            | Un petit point de couleur contrastante sur le nom de l'onglet indique les modifications non enregistrées.                                                                                                                                                                                                                                                                                        |
| **Flèches de défilement** | Les boutons de défilement gauche/droite apparaissent lorsqu'il y a plus d'onglets que la barre ne peut en contenir.                                                                                                                                                                                                                                                                              |
| **Fermer (×)**            | Ferme l'onglet ; invite à enregistrer si l'onglet est modifié.                                                                                                                                                                                                                                                                                                                                   |
| **Extension de fichier**  | Le nom de fichier complet, extension comprise (`.c64va`, `.json`), est affiché.                                                                                                                                                                                                                                                                                                                  |
| **Menu clic droit**       | Faites un clic droit sur un onglet (ou un espace vide dans la barre d'onglets) pour : **Nouvel onglet**, **Fermer l'onglet**, **Fermer les autres onglets**, **Fermer les onglets à droite**, **Fermer tous les onglets**. Les opérations de fermeture par lots affichent une invite pour chaque onglet modifié et s'arrêtent si vous annulez. **Tout fermer** conserve toujours un onglet vide. |

> **Astuce :** La synchronisation de la palette (`#expert-palette-sync-btn`)
> maintient la sélection de la palette synchronisée avec le repère au niveau du
> curseur. Désactivez-la si vous préférez que la palette ne se déplace pas de
> manière aléatoire pendant l’édition.

---

## 8. Instructions standard 6502

Chaque instruction 6502 prend en charge un ou plusieurs modes d'adressage. Le
sélecteur de mode figure sur chaque bloc.

| Mode          | Étiquette         | Exemple       | Description                                                                                   |
| ------------- | ----------------- | ------------- | --------------------------------------------------------------------------------------------- |
| **implicite** | Implicite         | `NOP`         | Aucun opérande ; l’instruction est autonome.                                                  |
| **immédiat**  | Immédiat          | `LDA #$FF`    | Constante en ligne ; l’assembleur ajoute automatiquement `#`.                                 |
| **zéroPage**  | Page zéro         | `LDA $10`     | Adresse mono-octet en page zéro (0–255)                                                       |
| **zéroPageX** | Page zéro,X       | `LDA $10,X`   | Adresse de page zéro + décalage du registre X (le résultat est renvoyé à la page 0)           |
| **zéroPageY** | Page zéro,Y       | `LDX $FB,Y`   | Adresse de page zéro + décalage du registre Y                                                 |
| **absolu**    | Absolu            | `LDA $0400`   | Adresse mémoire complète sur 16 bits                                                          |
| **absoluteX** | Absolu,X          | `LDA $0400,X` | Adresse 16 bits + décalage du registre X                                                      |
| **absoluteY** | Absolu,Y          | `LDA $0400,Y` | Adresse 16 bits + décalage du registre Y                                                      |
| **relatif**   | Relatif/Étiquette | `Boucle BNE`  | Pour les instructions de succursale, veuillez saisir un nom d'étiquette ou une adresse cible. |
| **indirectX** | Indirect,X        | `LDA ($FB,X)` | Indexation indirecte de la page zéro (opérande = adresse de la page zéro, 1 octet)            |
| **indirectY** | Indirect,Y        | `LDA ($FB),Y` | Indexation indirecte de la page zéro (opérande = adresse de la page zéro, 1 octet)            |
| **indirect**  | Indirect          | `JMP ($0100)` | Indirect ; utilisable uniquement avec JMP                                                     |

### Mouvement de données

Tout champ d'opérande acceptant une adresse ou une valeur immédiate accepte
également directement un nom de constante (provenant d'un bloc CONST ou d'un
bloc LABEL). De plus, vous pouvez utiliser les expressions label+offset ou
label−offset pour référencer une adresse relative à une constante nommée.

| Syntaxe | Exemple                  | Description                                                                                                                                            |
| ------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `LDA`   | Accumulateur de charge   | immédiat, page zéro, absolu, absoluX, absoluY, indirectX, indirectY                                                                                    |
| `LDX`   | Registre Charger X       | immédiat, page zéro, page zéroY, absolu, absoluY                                                                                                       |
| `LDY`   | Registre de chargement Y | immédiat, page zéro, absolu, absoluX                                                                                                                   |
| `STA`   | Accumulateur de stockage | page zéro, absolu, absoluX, absoluY, indirectX, indirectY                                                                                              |
| `STX`   | Caisse du magasin X      | page zéro, page zéroY, absolu                                                                                                                          |
| `STY`   | Caisse du magasin Y      | page zéro, absolu                                                                                                                                      |
| `*`     | `BNE *`                  | Compteur de programme actuel (l'adresse propre à l'instruction) ; les branchements avec `*` génèrent une boucle infinie sur elle-même (décalage `$FE`) |

**Exemple — effacer deux pages d'écran à l'aide d'une CONST : **
```
; .CONST screen_ram = $0400

LDX #$00
clear:

STA screen_ram,X

STA screen_ram+$0100,X

DEX

BNE clear
```

### Arithmétique

*(Nouveauté de la version 2.3.9.)* `*` ne se limite plus à l'opérande entier ;
il peut apparaître **n'importe où dans une expression d'opérande** et représente
l'adresse de l'instruction sur laquelle il est écrit. Il est résolu lors de
l'assemblage par rapport à l'adresse réelle de cette instruction ; aucune
étiquette n'est donc nécessaire pour les sauts relatifs courts ou les lectures
de données relatives au compteur ordinal.

| Syntaxe | Exemple                 | Signification                                                            |
| ------- | ----------------------- | ------------------------------------------------------------------------ |
| `*`     | `BNE *`                 | Réglez le transport avec `SEC` avant utilisation dans la plupart des cas |
| `SBC`   | Soustraire avec retenue | Retenue à `SEC` avant soustraction                                       |
| `INC`   | Incrémenter la mémoire  | —                                                                        |
| `DÉC`   | Décrémenter la mémoire  | —                                                                        |
| `CMP`   | Comparer avec A         | Définit les indicateurs ; ne modifie pas A                               |

**PC vs. multiplication.** `*` est traité comme le compteur de programme
uniquement lorsqu'il se trouve en position de valeur ** — au début de
l'expression, ou juste après un opérateur, `(`, `,`, `&lt;`, `&gt;` ou un
espace. Un `*` qui suit un nombre, `)` ou un identificateur est une
multiplication ordinaire, donc `LDA table*2` et `CONST_A*4` restent inchangés.

**Où cela fonctionne.** Tout opérande acceptant déjà une expression : cibles de
branchement, `JMP` / `JSR`, `LDA`/`STA`/… opérateurs absolus et indexés,
immédiats (octets de poids faible/fort) et l’expression `.assert`. `*` ne
modifie jamais la taille d’une instruction ; son utilisation est donc sûre dans
tous les modes d’adressage.

### Logique

*(Nouveau dans la version 2.3.9.)* Une étiquette dont le nom commence par un
point — `.loop`, `.skip`, `.done` — est une étiquette locale.** Elle appartient
à la portée de l'étiquette globale (sans point) précédente la plus proche et
devient en interne <global>.<nom>.` Deux étiquettes locales portant le même nom
court et appartenant à des étiquettes globales différentes ne sont pas en
conflit.

```
DessinerSprite :

LDX #0
.loop : ; == DrawSprite.loop

LDA SpriteData,X

STA $2000,X

INX

CPX #63

BNE .loop ; se résout dans DrawSprite

RTS

EffacerÉcran :

LDX #0
.loop : ; == ClearScreen.loop — pas de conflit

STA $0400,X

INX

BNE .loop

RTS
```

- Dans une portée, référencez une étiquette locale comme `.name`.
- Depuis une autre portée, référencez-le explicitement comme `Global.name` (par
  exemple `JMP ClearScreen.loop`).
- Un `.name` écrit avant toute étiquette globale reste un simple `.name` de
  niveau supérieur.
- Les étiquettes locales font un aller-retour à travers le mode Block ⇄ Expert
  sans modification ; le préfixe `<global>.` est un détail de mise en page et
  n'est jamais stocké dans le programme de bloc.

### Sauts et branches

*(Nouveau dans la version 2.3.9.)* Préfixez l'opérande d'une instruction avec
`label:` pour placer une étiquette sur l'**octet d'opérande** plutôt que sur le
code opération. L'instruction est assemblée à partir de ce qui suit les
deux-points.

```
Configuration :

LDA valeur : #$00 ; « valeur » -&gt; adresse de l’octet d’opérande #$00

… Correctif :

LDA #nouveau

STA valeur ; écrit directement l’octet d’opérande — SMC classique
```

La valeur `` pointe vers `<adresse d'instruction> + 1` (le premier octet
d'opérande), quel que soit le mode d'adressage. Ceci remplace l'ancien modèle
`STA instruction+1` / `instruction : LDA #$00`. Il fonctionne en mode Bloc ⇄
Expert (le champ d'opérande conserve le préfixe `label:`).

---

## 9. Blocs macro — Référence

### LABEL

| Mnémonique         | Description                                        | Modes                                                               |
| ------------------ | -------------------------------------------------- | ------------------------------------------------------------------- |
| Nom de l'étiquette | Identifiant utilisé dans `JMP`, `JSR`, `BNE`, etc. | immédiat, page zéro, absolu, absoluX, absoluY, indirectX, indirectY |
| `LDX`              | Registre Charger X                                 | immédiat, page zéro, page zéroY, absolu, absoluY                    |
| `LDY`              | Registre de chargement Y                           | immédiat, page zéro, absolu, absoluX                                |
| `STA`              | Accumulateur de stockage                           | page zéro, absolu, absoluX, absoluY, indirectX, indirectY           |
| `STX`              | Caisse du magasin X                                | page zéro, page zéroY, absolu                                       |
| `STY`              | Caisse du magasin Y                                | page zéro, absolu                                                   |

### COMMENT

| Mnémonique | Description             | Notes                                                                    |
| ---------- | ----------------------- | ------------------------------------------------------------------------ |
| `ADC`      | Ajouter avec transport  | Réglez le transport avec `SEC` avant utilisation dans la plupart des cas |
| `SBC`      | Soustraire avec retenue | Retenue à `SEC` avant soustraction                                       |
| `INC`      | Incrémenter la mémoire  | —                                                                        |
| `DÉC`      | Décrémenter la mémoire  | —                                                                        |
| `CMP`      | Comparer avec A         | Définit les indicateurs ; ne modifie pas A                               |
| `CPX`      | Comparer avec X         | —                                                                        |
| `CPY`      | Comparer avec Y         | —                                                                        |

### BYTE

| Mnémonique | Description                                                                             |
| ---------- | --------------------------------------------------------------------------------------- |
| Opérande   | Valeurs d'octets séparées par des virgules (par exemple `$01, $02, $FF` ou `1, 2, 255`) |
| `ORA`      | OU logique avec accumulateur                                                            |
| `EOR`      | OU exclusif avec accumulateur                                                           |
| `BIT`      | Tester les bits en mémoire par rapport à A (définit les indicateurs N, V, Z)            |

### WORD

| Mnémonique | Description                                                                |
| ---------- | -------------------------------------------------------------------------- |
| Opérande   | Valeurs de 16 bits séparées par des virgules (par exemple, `$0400, $C000`) |
| `JSR`      | Passer à la sous-routine (l'adresse de retour est sauvegardée sur la pile) |
| `RTS`      | Retour de la sous-routine                                                  |
| `RTI`      | Retour de l'interruption                                                   |
| `BNE`      | Brancher si différent (Z=0)                                                |
| `BEQ`      | Brancher si égal (Z=1)                                                     |
| `BCC`      | Branchement si retenue nulle (C=0)                                         |
| `BCS`      | Branchement si ensemble de retenue (C=1)                                   |
| `IMC`      | Branchement si moins (N=1)                                                 |
| `BPL`      | Brancher si Plus (N=0)                                                     |
| `BVC`      | Branchement si Overflow Clear (V=0)                                        |
| `BVS`      | Branchement si l'ensemble de débordement (V=1)                             |

#### LBNE / LBEQ / … (Longues branches)

*(Nouveau dans la version 2.3.9.)* La catégorie de palette **Branches longues**
contient huit pseudo-opérations qui se comportent comme des branchements
conditionnels mais atteignent **n'importe quelle adresse**, et pas seulement
−128…+127. Chacune d'elles est assemblée en un branchement inversé qui saute un
`JMP` de 3 octets — toujours **5 octets** :

```
LBEQ terminé ; assemblage en : BNE *+3 ($D0 $03)

; JMP terminé ($4C lo hi)
```

| Long op | Condition                     | Émis sous forme de    |
| ------- | ----------------------------- | --------------------- |
| `LBNE`  | non égal (Z=0)                | `BEQ *+3 / Cible JMP` |
| `LBEQ`  | égal (Z=1)                    | `BNE *+3 / JMP cible` |
| `LBCC`  | consigne claire (C=0)         | `BCS *+3 / Cible JMP` |
| `LBCS`  | ensemble de retenue (C=1)     | `BCC *+3 / Cible JMP` |
| `LBMI`  | moins (N=1)                   | `BPL *+3 / Cible JMP` |
| `LBPL`  | plus (N=0)                    | `IMC *+3 / Cible JMP` |
| `LBVC`  | débordement clair (V=0)       | `BVS *+3 / Cible JMP` |
| `LBVS`  | ensemble de débordement (V=1) | `BVC *+3 / Cible JMP` |

- Opérande : une étiquette, une expression `*` ou une adresse littérale —
  identique à une cible de branchement normale.
- Coût : 5 octets et 1 cycle supplémentaire sur le chemin emprunté par rapport à
  une branche courte. Il n’y a pas de promotion automatique d’une branche courte
  ; vous devez choisir explicitement `LBxx`.
- Lorsqu'une branche simple (`BNE`, `BEQ`, …) est hors de portée, l'erreur du
  compilateur nomme désormais le dépassement exact et suggère le `LBxx`
  correspondant.

### FILL

| Mnémonique | Description                                                            |
| ---------- | ---------------------------------------------------------------------- |
| Opérande   | `count,value` — par exemple, `256,0` remplit 256 octets avec des zéros |
| `TAY`      | Transfert A → Y                                                        |
| `TXA`      | Transfert X → A                                                        |
| `TYA`      | Transfert Y → A                                                        |
| `TSX`      | Pointeur de pile de transfert → X                                      |
| `TXS`      | Transfert X → Pointeur de pile                                         |
| `INX`      | Incrément X                                                            |
| `DEX`      | Décrémenter X                                                          |
| `INY`      | Incrément Y                                                            |
| `DEY`      | Décrémenter Y                                                          |

### ALIGN

| Mnémonique | Description                                                                               |
| ---------- | ----------------------------------------------------------------------------------------- |
| Limite     | Valeur d'alignement — par exemple `64` (limite du sprite), `256` (page), `$2000` (bitmap) |
| `LSR`      | Décalage logique vers la droite                                                           |
| `ROL`      | Rotation à gauche à travers le transport                                                  |
| `ROR`      | Rotation à droite à travers Carry                                                         |

### TEXT

| Mnémonique             | Description                                                     |
| ---------------------- | --------------------------------------------------------------- |
| Texte                  | La chaîne à afficher                                            |
| X                      | Colonne (0–39)                                                  |
| Y                      | Ligne (0–24)                                                    |
| Étiquette (facultatif) | Attribue une étiquette pointant vers l'adresse d'écran calculée |

### STRING

| Mnémonique                   | Description                                                                                             |
| ---------------------------- | ------------------------------------------------------------------------------------------------------- |
| Texte                        | La chaîne à écrire                                                                                      |
| Adresse                      | Adresse mémoire cible — `$C000` hexadécimal ou un **nom d'étiquette**                                   |
| Étiquette (facultatif)       | Attribue une étiquette pointant vers l'adresse cible                                                    |
| Changement                   | Valeur hexadécimale (00–FF) ajoutée à chaque octet de code d'écran (par exemple `$80` = vidéo inversée) |
| jeu de caractères minuscules | Case à cocher — même sémantique que TEXTE (voir la section TEXTE)                                       |
| `SED`                        | Activer le mode décimal                                                                                 |
| `SEI`                        | Désactiver l'interruption                                                                               |
| `NOP`                        | Aucune opération                                                                                        |
| `BRK`                        | Interruption forcée / interruption logicielle                                                           |

### DATA

Comme une boucle **POKE** — écrit une liste d'octets bruts à une adresse mémoire
au moment de l'exécution, une paire LDA/STA par octet.

**Syntaxe experte : **

---

## 10. Intégration du débogueur

L'application prend en charge RetroDebugger**** comme débogueur C64 externe.
Elle reçoit les points d'arrêt, les symboles et les indicateurs de démarrage
automatique générés par le programme assemblé.

---

### RetroDebugger

[RetroDebugger]{1} est un débogueur Commodore 64 multiplateforme avec prise en
charge des points d'arrêt, inspection de la mémoire et désassemblage prenant en
compte les étiquettes.

| Champ              | Description                                        |
| ------------------ | -------------------------------------------------- |
| Nom de l'étiquette | Identifiant utilisé dans `JMP`, `JSR`, `BNE`, etc. |

**Syntaxe experte : **
```
boucle:
```

**ASM généré : **
```
boucle : ; $0820
```

L'adresse actuelle est affichée en commentaire. Les étiquettes ont une taille de
**0 octets**.

---

### Blocs de points d'arrêt

Cliquez sur l'icône de point d'arrêt (●) sur un bloc d'instructions pour le
définir comme point d'arrêt. Les blocs avec point d'arrêt sont surlignés en
rouge. Leurs adresses sont enregistrées dans le fichier des points d'arrêt à
chaque lancement du débogueur.

**Syntaxe experte : **
```
Votre commentaire ici
```

**ASM généré : **
```
Votre commentaire ici
```

---

### Indicateurs du débogueur (onglet Options)

Comme **DATA en BASIC** — stocke une liste de valeurs d'octets bruts directement
dans le programme.

| Champ    | Description   |
| -------- | ------------- |
| Opérande | `-saut $ADDR` |

**Syntaxe experte : **
```
.octet $01, $02, $FF
```

**ASM généré : **
```
.octet $01, $02, $FF
```

** Références d'étiquettes d'octets de poids faible/haut : ** BYTE accepte les
jetons `<étiquette` (octet de poids faible) et `>étiquette` (octet de poids
fort) de style KickAssembler/ca65, ainsi que des valeurs numériques.
L'assembleur résout l'adresse de l'étiquette lors de la compilation et insère
l'octet approprié. Exemple :

```
.octet <frame_0, >frame_0, <frame_1, >frame_1
```

Ce bloc stocke l'octet de poids faible de l'adresse de la trame 0 ` `, puis
l'octet de poids fort, et ainsi de suite pour la trame 1 ` `. Utile pour la
construction de tables de branchement et de listes d'adresses.

**Taille :** Nombre d’octets dans la liste.

---

### MOT

Comme **DATA en BASIC mais pour les nombres de 16 bits **. Chaque valeur est
stockée sur deux octets (octet de poids faible en premier, puis octet de poids
fort — ordre little-endian 6502).

| Champ    | Description                                                                |
| -------- | -------------------------------------------------------------------------- |
| Opérande | Valeurs de 16 bits séparées par des virgules (par exemple, `$0400, $C000`) |

**Syntaxe experte : **
```
.mot $0400, $C000
```

**ASM généré : **
```
.mot $0400, $C000
```

**Taille : ** 2 octets par mot.

---

### REMPLIR

Comme `FOR I=1 TO N : POKE addr+I, val : NEXT` — remplit un bloc de mémoire avec
le même octet, mais en un seul bloc. Idéal pour effacer des zones ou pré-remplir
des tables.

| Champ    | Description                                                            |
| -------- | ---------------------------------------------------------------------- |
| Opérande | `count,value` — par exemple, `256,0` remplit 256 octets avec des zéros |

**Syntaxe experte : **
```
.remplir 256, 00 $
```

**ASM généré : **
```
.remplir 256, 00 $
```

Syntaxe des expressions : Les fonctions `count` et `value` acceptent toutes deux
des expressions arithmétiques. Vous pouvez référencer des noms de constantes,
utiliser des littéraux hexadécimaux/binaires et appeler des fonctions
mathématiques intégrées.

| Expression                    | Signification                                               |
| ----------------------------- | ----------------------------------------------------------- |
| `TILE_COUNT, $00`             | compter à partir d'une CONST, valeur littérale hexadécimale |
| `40*25, 0`                    | multiplication en ligne                                     |
| `arrondi(sin(PI/4)*255), $80` | trigonométrie                                               |

**Fonctions intégrées : ** `sin() `, `cos() `, `round() `, `max(a,b) `,
`min(a,b) `, `abs() `, constante `PI `

Opérateurs : `+ - * /` Littéraux : `$FF` (hexadécimal), `%10110000` (binaire)
Octet de poids faible/de poids fort : `lo(expr)`, `hi(expr)`

**Taille : ** La valeur du nombre en octets.

---

### ALIGNER

Décale l'adresse actuelle jusqu'à la prochaine limite libre en insérant des
octets de remplissage nuls. Le C64 exige que les données de sprite commencent
sur une limite de 64 octets ; `ALIGN 64` gère cela automatiquement.

| Champ  | Description                                                                               |
| ------ | ----------------------------------------------------------------------------------------- |
| Limite | Valeur d'alignement — par exemple `64` (limite du sprite), `256` (page), `$2000` (bitmap) |

**Syntaxe experte : **
```
.align 64
.align 2000 $
```

**ASM généré : **
```
; ALIGN 64 → $0840 (remplissage de 12 octets)
```

**Taille : ** Dynamique — dépend de la position actuelle du compteur de
programme.

> **Conseil :** Utilisez `ALIGN 64` avant les données de sprite, `ALIGN 256`
> pour garantir des tableaux alignés sur la page.

---

### TEXTE

Comme **PRINT AT** — écrit du texte directement sur l'écran du C64 à une colonne
et une ligne données, sans utiliser le KERNAL. Il génère une paire LDA/STA par
caractère, ciblant la RAM d'écran à `$0400`.

| Champ                        | Description                                                     |
| ---------------------------- | --------------------------------------------------------------- |
| Texte                        | La chaîne à afficher                                            |
| X                            | Colonne (0–39)                                                  |
| Y                            | Ligne (0–24)                                                    |
| Étiquette (facultatif)       | Attribue une étiquette pointant vers l'adresse d'écran calculée |
| jeu de caractères minuscules | Case à cocher — voir ci-dessous                                 |

**Modes de jeu de caractères : **

Le C64 possède deux jeux de caractères sélectionnables lors de l'exécution :

| Mode                                              | $D018 bit 1 | Entrée en majuscules              | Entrée en minuscules                 |
| ------------------------------------------------- | ----------- | --------------------------------- | ------------------------------------ |
| **Majuscules/graphismes** (par défaut)            | 0           | `A`–`Z` → codes d'écran $01–$1A ✓ | traité également comme une majuscule |
| ** Minuscules/majuscules ** (après CHARSET lower) | 1           | `A`–`Z` → $01–$1A (majuscules)    | `a`–`z` → $41–$5A (minuscules) ✓     |

- ** Jeu de caractères majuscules (par défaut, case décochée) : ** Saisissez ce
  que vous souhaitez voir en majuscules. `« HELLO »` s’affiche comme `HELLO`.
  Les caractères minuscules sont convertis en majuscules à l’écran.
- ** Jeu de caractères minuscules (case cochée) : ** Saisissez la casse exacte
  souhaitée. `"hello" ` → affichage en minuscules, `"HELLO" ` → affichage en
  majuscules. Nécessite une modification du jeu de caractères à l'exécution
  avant l'écriture à l'écran (utilisez la macro **CHARSET lower**).

**ASM généré (mode majuscules, `"HELLO"`):**
```
LDA n° $08 ; code écran « H » $08

STA $0400

LDA n° $05 ; code écran « E » $05

STA $0401

...
```

**Syntaxe experte : **
```
.text 0, 2, "HELLO" ; caractères majuscules (par défaut)

.text 0, 2, "hello", lower ; caractères minuscules
```

Les caractères sont encodés en codes d'écran (et non en PETSCII). Taille :
longueur du texte × 5 octets (LDA + STA par caractère).

---

### CHAÎNE

Comme **POKEing une chaîne ** dans n'importe quelle adresse mémoire à
l'exécution. Génère des paires LDA/STA qui copient le code d'écran de chaque
caractère dans des adresses consécutives.

| Champ                        | Description                                                                                             |
| ---------------------------- | ------------------------------------------------------------------------------------------------------- |
| Texte                        | La chaîne à écrire                                                                                      |
| Adresse                      | Adresse mémoire cible — `$C000` hexadécimal ou un **nom d'étiquette**                                   |
| Étiquette (facultatif)       | Attribue une étiquette pointant vers l'adresse cible                                                    |
| Changement                   | Valeur hexadécimale (00–FF) ajoutée à chaque octet de code d'écran (par exemple `$80` = vidéo inversée) |
| jeu de caractères minuscules | Case à cocher — même sémantique que TEXTE (voir la section TEXTE)                                       |

**Syntaxe experte : **
```
.string $C000, "HELLO" ; en majuscules (par défaut)

.string $C000, "hello", lower ; en minuscules

.string $C000, "HELLO", 80 ; avec Maj (inversion vidéo)

.string $C000, "hello", 80, lower ; Maj + minuscules

.string $C000, "HELLO" :my_string ; avec macroLabel
```

**ASM généré : **
```
LDA n° $08 ; code écran « H »

STA $C000

LDA n° $05 ; code écran « E »

STA $C001

…
```

Les caractères sont encodés en codes d'écran (et non en PETSCII). La valeur
optionnelle Shift est ajoutée à chaque octet, par exemple $80 pour la vidéo
inversée. Taille : longueur du texte × 5 octets (un LDA + un STA par caractère).

---

### DONNÉES

Comme une boucle **POKE** — écrit une liste d'octets bruts à une adresse mémoire
au moment de l'exécution, une paire LDA/STA par octet.

| Champ                  | Description                                                           |
| ---------------------- | --------------------------------------------------------------------- |
| Octets                 | valeurs d'octets séparées par des virgules                            |
| Adresse                | Adresse mémoire cible — `$C000` hexadécimal ou un **nom d'étiquette** |
| Étiquette (facultatif) | Attribue une étiquette pointant vers l'adresse cible                  |

**Syntaxe experte : **
```
.data $C000, $01, $02, $03 ; adresse hexadécimale

.data my_buf, $01, $02, $03 ; adresse de l'étiquette

.data $C000, $01, $02, $03 :mydata ; avec macroLabel
```

**ASM généré : **
```
LDA #$01
    STA $C000
    LDA #$02
    STA $C001
    ...
```

**Taille : ** `byte_count × 5 ` octets (un LDA + un STA par octet).

---

### BAWBYTES

Comme les données ** qui se chargent directement en mémoire ** — aucun code
d'exécution n'est nécessaire. Les octets sont présents dès le chargement du PRG,
avant même le début de votre code. Utilisez cette méthode pour les données de
sprites, les cartes de niveaux, les tables de correspondance, bref, tout ce qui
doit se trouver à une adresse spécifique.

| Champ                  | Description                                                           |
| ---------------------- | --------------------------------------------------------------------- |
| Octets                 | valeurs d'octets séparées par des virgules                            |
| Adresse                | Adresse mémoire cible — `$C000` hexadécimal ou un **nom d'étiquette** |
| Étiquette (facultatif) | Attribue une étiquette pointant vers l'adresse cible                  |

**Syntaxe experte : **
```
.rawbytes $C000, $00, $00, $00 ; adresse hexadécimale

.rawbytes sprite_data, $00, $00 ; adresse de l'étiquette

.rawbytes $0C50, $00, $00 :nev ; avec macroLabel — le reste du code peut utiliser LDA nev,X
```

**Taille en code : ** 0 octets. Les données sont placées à l’adresse indiquée
dans la sortie.

> **DATA vs RAWBYTES : ** DATA génère du code LDA/STA qui copie les octets à
> l’exécution (plus lent, mais fonctionne si les données doivent être
> dynamiques). RAWBYTES place directement les octets : sans code, instantané et
> sans coût.

---

### TEXTE BRUT

Comme RAWBYTES, mais pour le texte : encode la chaîne en caractères d’écran et
place les octets à une adresse fixe sans code d’exécution. Le texte est
disponible en mémoire dès le chargement du PRG.

| Champ                        | Description                                                                                             |
| ---------------------------- | ------------------------------------------------------------------------------------------------------- |
| Texte                        | Chaîne à encoder                                                                                        |
| Adresse                      | Adresse mémoire cible — `$C000` hexadécimal ou un **nom d'étiquette**                                   |
| Étiquette (facultatif)       | Attribue une étiquette pointant vers l'adresse cible                                                    |
| Changement                   | Valeur hexadécimale (00–FF) ajoutée à chaque octet de code d'écran (par exemple `$80` = vidéo inversée) |
| jeu de caractères minuscules | Case à cocher — même sémantique que TEXTE (voir la section TEXTE)                                       |

**Syntaxe experte : **
```
.rawtext $C000, "HELLO" ; en majuscules (par défaut)

.rawtext $C000, "hello", lower ; en minuscules

.rawtext $C000, "HELLO", 80 ; avec Maj (inversion vidéo)

.rawtext $C000, "hello", 80, lower ; Maj + minuscules

.rawtext $0400, "HELLO" :my_text ; avec macroLabel
```

**ASM généré : **
```
; .rawtext "HELLO" -&gt; $C000

; $C000

.byte $08, $05, $0C, $0C, $0F ; H E L L O (codes d'écran majuscules)

; .rawtext "hello", lower -&gt; $C000

; $C000

.byte $48, $45, $4C, $4C, $4F ; h e l l o (codes d'écran minuscules, plage $41–$5A)
```

**Taille en code : ** 0 octets. Les données sont placées à l’adresse indiquée
dans la sortie.

> **STRING vs RAWTEXT : ** STRING génère du code LDA/STA qui copie le texte à
> l’exécution. RAWTEXT intègre les octets dans le PRG au moment du chargement —
> sans code, sans attente.

---

### PETSCII

Comme **RAWBYTES mais pour la sortie KERNAL** — encode la chaîne en octets
PETSCII (compatible avec CHROUT à `$FFD2`) et les place à une adresse fixe sans
code d'exécution. Utilisez cette fonction pour afficher des caractères via `JSR
$FFD2` en boucle. Notez que la nouvelle macro `PRINT` utilise le même encodeur
et le même comportement pour la case à cocher « minuscules ».

> **PETSCII vs codes écran : ** Les codes PETSCII et les codes écran sont deux
> encodages différents. Code écran `$01` = lettre A ; PETSCII `$41` = lettre A
> (via CHROUT). Utilisez PETSCII uniquement pour l’impression via le KERNAL ;
> utilisez TEXT/STRING/RAWTEXT pour écrire directement dans la RAM d’écran.

| Champ                  | Description                                                           |
| ---------------------- | --------------------------------------------------------------------- |
| Texte                  | Chaîne à encoder en octets PETSCII                                    |
| Adresse                | Adresse mémoire cible — `$C000` hexadécimal ou un **nom d'étiquette** |
| Étiquette (facultatif) | Attribue une étiquette pointant vers l'adresse cible                  |
| PETSCII minuscule      | Case à cocher — voir ci-dessous                                       |

**Modes de jeu de caractères : **

| Mode                                   | Entrée en majuscules (`A`–`Z`)                                                                                                            | Entrée en minuscules (`a`–`z`) |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| **Majuscules (par défaut, non coché)** | `$41`–`$5A` (PETSCII majuscules via CHROUT)                                                                                               | également mappé à `$41`–`$5A`  |
| **Minuscules (coché)**                 | Les lettres alphabétiques sont réattribuées afin que la casse visible reste cohérente sur l'ensemble de caractères minuscules/majuscules. | Même règle                     |

**Syntaxe experte : **
```
.petscii $C000, "HELLO" ; PETSCII majuscule (par défaut)

.petscii $C000, "hello", lower ; PETSCII minuscule ($61–$7A)

.petscii $C000, "HELLO", null ; avec caractère nul de fin

.petscii $C000, "hello", lower, null ; minuscule + caractère nul de fin

.petscii $C000, "HELLO" :my_msg ; avec macroLabel
```

**Octets générés (majuscules, `"HELLO"`):**
```
; $C000

.byte $48, $45, $4C, $4C, $4F ; H E L L O (Plage PETSCII $41–$5A)
```

**Taille en code : ** 0 octets. Les données sont placées à l’adresse cible sous
forme de section de données différées (comme RAWBYTES).

**Terminateur nul :** Cochez la case *« Ajouter `$00` (terminateur nul) »* pour
ajouter automatiquement un octet `$00` après le texte. Idéal pour les boucles
terminées par un caractère nul :

```
LDX #$00
boucle :

LDA msg,X

BEQ terminé ; $00 arrête la boucle

JSR $FFD2

INX

Boucle BNE
terminée :

RTS
```

**Règles d'encodage : **

| Saisir                                 | Mode majuscules                  | Mode minuscule |
| -------------------------------------- | -------------------------------- | -------------- |
| `A`–`Z`                                | `$41`–`$5A`                      | `$61`–`$7A`    |
| `a`–`z`                                | `$41`–`$5A` (majuscules forcées) | `$41`–`$5A`    |
| Espace, chiffres, ponctuation (32–126) | tel quel                         | tel quel       |
| Nouvelle ligne                         | `$0D` (RETOUR)                   | `$0D`          |
| Autre                                  | `$20` (espace)                   | `$20`          |

> **Conseil :** Utilisez PETSCII pour les données qui seront affichées via
> CHROUT (`$FFD2`). Pour écrire directement dans la mémoire RAM de l'écran,
> utilisez plutôt STRING ou RAWTEXT.

---

### CHARSET

Bascule la ROM de caractères VIC-II entre le mode majuscules/graphiques (par
défaut C64) et le mode minuscules/majuscules, en modifiant le bit 1 de `$D018`
au moment de l'exécution.

| Champ | Description                                                                                                                                            |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Mode  | ** Minuscules** — active le jeu de caractères minuscules/majuscules ; ** Majuscules** — rétablit le jeu de caractères majuscules/graphiques par défaut |

**Syntaxe experte : **
```
.charset lower ; passer à l'encodage de caractères en minuscules

.charset upper ; revenir à l'encodage de caractères en majuscules/graphiques
```

**ASM généré : **

Mode minuscules :
```
LDA $D018

ORA #$02 ; activer le bit 1 → ROM minuscules/majuscules à $1800

STA $D018
```

Mode majuscules :
```
LDA $D018

ET #$FD ; effacement du bit 1 → ROM majuscules/graphiques à $1000

STA $D018
```

**Taille : ** 8 octets (LDA abs + ORA/AND imm + STA abs).

**Pourquoi utiliser ORA/AND plutôt qu'une écriture directe ?** `$D018` contrôle
également l'emplacement de la RAM écran (bits 7 à 4). Basculer uniquement le bit
1 préserve le reste du registre.

**Flux de travail typique :**

```
CHARSET lower ; passer en minuscules

TEXT 0, 0, "hello world" ; [case à cocher : Minuscules]

...
CHARSET upper ; rétablir la valeur par défaut
```

Ou en mode expert :
```
.charset lower

.text 0, 0, "hello world", lower

.charset upper
```

En mode Expert, le bloc `.charset` fait désormais également des allers-retours
dans le menu déroulant du mode, de sorte que l'aperçu du bloc et la source
exportée restent alignés.

> **Remarque : ** La macro CHARSET modifie uniquement le pointeur ROM de
> caractères VIC. Elle n'appelle pas `$E544` (initialisation du jeu de
> caractères du noyau). Dans la plupart des cas, cela suffit ; appelez `JSR
> $E544` en premier uniquement si vous avez besoin que les routines d'impression
> du noyau prennent en compte la modification.

---

### CHARDEF

Définit un seul caractère personnalisé 8×8 dans un jeu de caractères basé sur la
RAM. Émet du code d'exécution en ligne qui copie 8 octets dans `base + index *
8` au moment de l'exécution — pas besoin d'étiquette précédente ni de `ORG`.

| Champ                | Description                                                                                                                           |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Base de caractères   | Adresse de base du jeu de caractères RAM (par défaut `$3800`). Doit être alignée pour que le VIC-II puisse la voir (voir ci-dessous). |
| Index des caractères | Quel emplacement de caractère redéfinir, 0–255. `65` = 'A' dans la disposition de code d'écran par défaut.                            |
| 8 octets             | Lignes d'image bitmap séparées par des virgules, de haut en bas. Le bit 7 de chaque octet correspond au pixel le plus à gauche.       |

**Syntaxe experte : **
```
.chardef 3800 $, 65, 18 $, 3C $, 66 $, 7E $, 66 $, 66 $, 66 $, 00 $
```

**ASM généré (8 × `LDA #b` / `STA cible+n`, 40 octets au total) :**
```
LDA #$18
    STA $3A08
    LDA #$3C
    STA $3A09
    LDA #66$
    STA $3A0A
    LDA #$7E
    STA 3A0 milliards de dollars
    LDA #66$
    STA $3A0C
    LDA #66$
    STA $3A0D
    LDA #66$
    STA $3A0E
    MDL #00$
    STA $3A0F
```

**Adresse cible : ** `$3800 + 65 * 8 = $3A08`. Calculé à la compilation et
intégré en dur dans les opérandes STA.

**Taille : ** 40 octets par caractère (8 × 5).

**Flux de travail typique :**
```
; Point VIC-II sur le jeu de caractères RAM à $3800

LDA $D018

AND #$F1

ORA #$0E ; bits 3-1 = %111 → jeu de caractères à la banque + $3800

STA $D018

CHARDEF $3800, 65, $18, $3C, $66, $7E, $66, $66, $66, $00 ; redéfinir 'A'

CHARDEF $3800, 66, $7C, $66, $66, $7C, $66, $66, $7C, $00 ; redéfinir 'B'

; ... appels CHARDEF supplémentaires pour chaque caractère personnalisé
```

**Quand utiliser CHARDEF plutôt que des alternatives : **

| Approche                         | À utiliser lorsque                                                                                                                    |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **CHARDEF**                      | Vous avez besoin de quelques caractères personnalisés (par exemple, de 1 à 20). Le coût d'exécution est de 40 octets par caractère.   |
| **RAWBYTES à 3800 $**            | Vous disposez d'un jeu de caractères entièrement personnalisé (256 caractères). Total de 2 Ko de données, aucune copie à l'exécution. |
| **INCBIN "charset.bin" @ $3800** | Fichier de jeu de caractères externe (généré par l'éditeur de caractères). Option la plus propre.                                     |
| **Caractères Canvas + INCBIN**   | Image bitmap complète de 256 caractères, peinte en une seule image de 128×128 pixels.                                                 |

> Rappel d'alignement : VIC-II attend que la base du jeu de caractères soit un
> multiple de 0800. Banques valides : 0000, 0800, 1000, 1000, ..., 3800 (dans la
> banque VIC actuelle de 16 Ko). Les jeux de caractères de la RAM se trouvent
> généralement à 2000, 2800, 3000 ou 3800.

---

### BOX_HIT

Test de collision de boîtes englobantes alignées sur les axes (AABB) entre deux
rectangles décrits par des structures de page zéro de 4 octets. Renvoie le
résultat dans l'accumulateur : **A = 1** en cas de chevauchement, **A = 0**
sinon. Code assembleur en ligne pur, sans appel de sous-programme.

| Champ                | Description                                                                            |
| -------------------- | -------------------------------------------------------------------------------------- |
| Adresse postale Box1 | Base de page zéro de la structure de 4 octets de la première boîte (par défaut `$FB`). |
| Adresse postale Box2 | Base de page zéro de la structure de 4 octets de la deuxième boîte (par défaut `$F7`). |

**Disposition de la structure** (4 octets par case, coordonnées non signées sur
8 bits) :

| Compenser | Champ  |
| --------- | ------ |
| `+0`      | Gauche |
| `+1`      | Haut   |
| `+2`      | Droite |
| `+3`      | Bas    |

**Syntaxe experte : **
```
.box_hit $FB, $F7
```

**ASM généré (30 octets, entièrement relatif au PC — pas de sous-routine, pas de
sauts absolus) :**
```
LDA $FD ; b1 droite

CMP $F7 ; b2 gauche

BCC non ; R1 &lt; L2 → raté

LDA $F9 ; b2 droite

CMP $FB ; b1 gauche

BCC non

LDA $FE ; b1 bas

CMP $F8 ; b2 haut

BCC non

LDA $FA ; b2 bas

CMP $FC ; b1 haut

BCC non

LDA #$01 ; touché

BNE terminé ; inconditionnel (A ≠ 0)
non : LDA #$00
terminé :
```

**Taille : ** 30 octets.

**Flux de travail typique :**

```
; Boîte du sprite du joueur à $FB..$FE

LDA sprite_x ; L

STA $FB

LDA sprite_y ; T

STA $FC

CLC

ADC #23 ; +23 → B (sprite de 24 pixels de haut)

STA $FE

LDA $FB

CLC

ADC #23 ; R

STA $FD

; Boîte de l'ennemi à $F7..$FA (remplie de la même manière)

; ...

BOX_HIT $FB, $F7 ; test joueur contre ennemi → A = 0 ou 1

CMP #$01

BNE no_collision

JSR handle_hit
no_collision:
```

**Contraintes:**
- Les deux adresses de page zéro doivent être `≤ $FC` (chaque boîte a besoin de
  4 octets consécutifs : `zp`, `zp+1`, `zp+2`, `zp+3`).
- Les coordonnées sont traitées comme des entiers non signés 8 bits (0–255).
  Pour les coordonnées de sprites signées en dehors de cette plage,
  normalisez-les avant de les stocker.
- Les deux cases peuvent se chevaucher dans l'espace ZP si nécessaire, mais
  généralement, on souhaite 8 octets distincts.

Pourquoi ne pas utiliser une sous-routine ? La génération en ligne évite la
surcharge JSR/RTS (plus de 14 cycles) et maintient le test actif en cache pour
des boucles de jeu rapides. Si vous devez tester de nombreuses paires, placez
manuellement votre propre sous-routine JSR box_hit_sub autour d'un bloc BOX_HIT.

Comparaison avec la fonction `box_hit()` d'UB : Ultimate Basic encapsule la même
logique 6502 dans une fonction d'exécution qui renvoie une valeur à une
variable. En VA, vous placez `BOX_HIT` directement à l'endroit où vous avez
besoin du test ; le résultat se trouve dans `A`.

---

### INCBIN

Comme **BLOAD en BASIC** — récupère un fichier binaire externe (`.bin`, `.prg`,
`.sid`, `.raw`) et l'intègre directement dans le PRG assemblé à l'adresse que
vous spécifiez.

| Champ   | Description                                               |
| ------- | --------------------------------------------------------- |
| Déposer | Sélectionnez un fichier `.bin`, `.prg`, `.sid` ou `.raw`. |
| Adresse | Adresse de chargement cible (par exemple `$C000`)         |

**Syntaxe experte : **
```
.incbin "music.bin", $C000
```

**Commentaire ASM généré : **
```
; INCBIN "music.bin" @ $C000 (2048 octets)

.byte $01, $02, ...
```

**Taille en code : ** 0 octets (section de données différées). Le binaire est
intégré à l’adresse indiquée.

---

### KOALA

Charge une image Koala Painter (160×200 multicolore) et l'affiche. Les données
de l'image sont intégrées à une adresse fixe, par exemple INCBIN (l'adresse de
chargement de 2 octets du fichier est supprimée), et le bloc est compilé en une
routine d'affichage de 86 octets qui s'exécute à l'emplacement du bloc.

| Champ   | Description                                                                                                                      |
| ------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Déposer | Parcourez les fichiers pour sélectionner un fichier `.koa` / `.kla` (10003 octets, ou 10001 sans adresse de chargement)          |
| Adresse | Adresse bitmap : `$6000` (par défaut, natif Koala, banque VIC 1, RAM écran `$4400`) ou `$2000` (banque VIC 0, RAM écran `$0400`) |

La routine d'affichage copie la partie RAM écran sur l'écran et la partie RAM
couleur dans `$D800`, écrit l'octet d'arrière-plan dans `$D021`, sélectionne la
banque VIC dans `$DD00` (en conservant les autres bits de port) et active le
mode bitmap multicolore (`$D011 = $3B`, `$D016 = $18`, `$D018 = $18`). Les
autres adresses sont rejetées : les 8 Ko restants se trouvent sous la ROM
BASIC/KERNAL (la boucle de copie lirait la ROM) ou chevauchent l'ombre de la ROM
de caractères.

**Syntaxe experte : **
```
.koala "image.koa"
.koala "image.koa", 2 000 $
```

**Exemple — afficher une image et attendre :**
```
* = $0801
.koala "picture.koa"
Attendre :

JMP attendre
```

**Taille en code : ** 86 octets (routine d'affichage) ; les 10 001 octets de
données d'image sont envoyés à l'adresse indiquée. L'éditeur haute résolution
(Fichiers → Exporter au format Koala (.koa)…) produit un fichier compatible.

---

### NIVEAU / LIGNE_NIVEAU

Intègre un projet **Level Editor** dans votre programme et copie les lignes du
niveau dans une mémoire tampon d'écran — les éléments de base d'un jeu à
défilement. Consultez `samples/level-demo.asm` pour un niveau complet à
défilement au joystick.

#### NIVEAU

Un bloc de type INCBIN qui émet 0 octet de code. Seuls les écrans placés du
projet Level Editor (les fichiers .bin enregistrés via Fichiers → Enregistrer le
niveau) sont chargés en mémoire à partir de l'adresse spécifiée (par défaut
2000), dans l'ordre des emplacements, à raison de 2000 octets par écran (1000
codes d'écran + 1000 couleurs). Les écrans identiques sont stockés une seule
fois, et tous les emplacements vides partagent un écran vierge. Les tables de
pointeurs suivent les écrans. Un niveau peut comporter jusqu'à 7 × 10 écrans.

**Syntaxe experte : **
```
.level "level.bin"
.level "level.bin", 4000 $
```

| Défini                                                                        | Signification                                                                                                                                                                             |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `LEVEL_SLOT_LO` / `LEVEL_SLOT_HI`                                             | Adresse de l'écran dans chaque emplacement (ligne-major, `LEVEL_W` emplacements par ligne)                                                                                                |
| `LEVEL_ROW_SLOT`                                                              | Ligne du personnage de niveau → premier emplacement de sa ligne d'écran                                                                                                                   |
| `LEVEL_ROW_LO/HI`, `LEVEL_CROW_LO/HI`                                         | Ligne de caractère de niveau → décalage de sa ligne de code d'écran / ligne de couleur à l'intérieur d'un écran                                                                           |
| `LEVEL_COL_SLOT`, `LEVEL_COL_OFS`                                             | Afficher la colonne de début → colonne de l'écran et colonne à l'intérieur de l'écran                                                                                                     |
| `NIVEAU_O`, `NIVEAU_H`                                                        | Taille du niveau dans les écrans                                                                                                                                                          |
| `LEVEL_COLS`, `LEVEL_ROWS`                                                    | Taille du niveau en caractères                                                                                                                                                            |
| `NIVEAU_MAX_X`, `NIVEAU_MAX_Y`                                                | Position de défilement en pixels la plus élevée d'une vue 40×25                                                                                                                           |
| `NIVEAU_BG`, `NIVEAU_MC1`, `NIVEAU_MC2`, `NIVEAU_MULTICOLOR`                  | Couleurs de fond/multicolores et mode du niveau                                                                                                                                           |
| `NIVEL_DATA`, `NIVEL_SIZE`, `NIVEL_END`                                       | Début, taille et première adresse libre après le niveau de données                                                                                                                        |
| `LEVEL_OBJ_X_LO/HI`, `LEVEL_OBJ_Y_LO/HI`, `LEVEL_OBJ_TYPE`, `LEVEL_OBJ_PARAM` | Tableau des objets (calque d'objets de l'éditeur de niveaux) : position en pixels du niveau, type et octet de paramètre, dans l'ordre de défilement — `LEVEL_OBJ_COUNT` entrées (max 255) |
| `LEVEL_OBJ_T_START` … `LEVEL_OBJ_T_TRIGGER`                                   | Numéros des types d'objets : DÉPART 0, ENNEMI 1, OBJET 2, PORTE 3, SORTIE 4, DÉCLENCHEUR 5                                                                                                |
| `LEVEL_START_X`, `LEVEL_START_Y`                                              | Position du premier objet de départ (définie uniquement si le niveau en possède un)                                                                                                       |
| `LEVEL_ATTR`, `LEVEL_ATTR_SOLID` … `LEVEL_ATTR_COLLECT`                       | Tableau des attributs de caractère (un octet indicateur par code d'écran ; uniquement lorsque le niveau possède des attributs) et ses bits : 1, 2, 4, 8                                   |
| `LEVEL_BORDER`, `LEVEL_SCR_COLORS`, `LEVEL_SCR_BG/BORDER/MC1/MC2`             | Bordure de niveau ; tables de couleurs par emplacement (ordre ligne comme `LEVEL_SLOT_*`) lorsqu'un écran possède ses propres couleurs (`LEVEL_SCR_COLORS` = 1)                           |

garde typique : `.assert LEVEL_END &lt;= $9200, "les données de niveau entrent
dans le code"`.

#### LIGNE_NIVEAU

Copie une ligne de 40 caractères du niveau dans un tampon : la ligne de niveau
dans **X**, commençant à la colonne de niveau stockée dans la variable `col`,
jusqu'à l'adresse contenue dans le pointeur `dst` (`dst` / `dst+1`, lo/hi). Avec
le troisième argument `color`, copie les couleurs au lieu des codes d'écran
(pour la RAM couleur). Une fenêtre de 40 caractères s'étendant sur deux écrans
est gérée par une boucle de copie auto-modificatrice (environ 14 cycles par
octet). X est conservé, A et Y sont détruits. Nécessite un bloc `.level` dans le
programme.

**Syntaxe experte : **
```
.level_row dst_lo, view_x
.level_row dst_lo, view_x, couleur
```

**Taille en code :** 132 octets — utilisez `LBEQ` / `LBNE` lorsqu’une branche
doit sauter par-dessus.

---

### SID

Comme **BLOAD pour la musique** — charge un fichier `.sid` dans votre PRG et lit
automatiquement ses adresses Init et Play dans l'en-tête. Appelez Init une fois
au démarrage, puis appelez Play depuis votre gestionnaire d'interruption à
chaque image.

| Champ                              | Description                                                                                                                                |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Déposer                            | Sélectionnez un fichier `.sid`.                                                                                                            |
| Adresse personnalisée (facultatif) | Remplacez l'adresse de chargement native du SID (par exemple, `$1000`). Laissez ce champ vide pour utiliser l'adresse de l'en-tête du SID. |

Le bloc affiche :
- **Titre / Auteur** de l'en-tête SID
- **Adresse de chargement** — où les données sont placées en mémoire (adresse
  effective après toute modification)
- **Adresse d'initialisation** — appelez ceci avec JSR pour initialiser la
  musique (ajustée en cas de relocalisation si une adresse personnalisée est
  utilisée)
- **Adresse de lecture ** — appelez ceci avec JSR sur chaque trame dans un
  gestionnaire d'IRQ (ajusté pour la relocalisation)
- Un badge **(relocalisé)** apparaît lorsqu'une adresse personnalisée déplace
  les données de leur position d'origine.

**Syntaxe experte : **
```
.sid "Ikari_Warriors.sid"
.sid "Ikari_Warriors.sid", 1 000 $
```

**Commentaire ASM généré : **
```
; SID "Ikari_Warriors.sid" à 1 000 $ Init : 1 000 $ Lecture : 1 006 $ (4 096 octets)
```

**Taille en code : ** 0 octets en ligne. Le binaire SID est placé à l’adresse
spécifiée en tant que bloc différé dans le PRG.

> Important : La plupart des fichiers SID contiennent des adresses absolues
> internes codées en dur. Elles ne peuvent être déplacées que si l’ensemble du
> binaire est décalé du même indice. Si un SID comporte des sauts internes vers
> `$10xx`, il doit rester à `$1000` ; le déplacer vers une autre adresse rompra
> ces références internes.

> **Utilisation typique :** Placez un bloc ORG avant le bloc SID pour définir
> son adresse. Appelez Init une fois au démarrage, puis appelez Play à chaque
> image à partir d'un gestionnaire d'interruption raster.

---

### INCLURE

Comme la fonction MERGE en BASIC, elle importe un autre fichier et développe ses
blocs directement à cet emplacement. Idéal pour les bibliothèques de
sous-programmes réutilisables. Les blocs inclus sont en lecture seule dans le
projet actuel.

Deux types de fichiers sont pris en charge :
- **Visual Assembler project** (`.json`) — les blocs du projet sont insérés tels
  quels.
- **Code source assembleur brut** (`.inc`, `.asm`, `.s`) — le fichier est lu
  comme du texte et analysé de la même manière qu'en mode expert. À chaque
  compilation, le fichier est relu depuis le disque (source de référence : le
  fichier lui-même), ce qui vous permet de le modifier avec n'importe quel
  éditeur externe.

| Champ                              | Description                                                                                                                                                                                                                                                                                                                           |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Déposer                            | Sélectionnez un projet `.json` ou un code source d'assemblage `.inc`/`.asm`/`.s`.                                                                                                                                                                                                                                                     |
| Adresse de chargement (facultatif) | Si cette option est activée (en hexadécimal, par exemple `C000`), les blocs inclus sont placés à cette adresse ; un bloc ORG`` synthétique est injecté avant eux, remplaçant tout bloc ORG présent dans le fichier inclus. Laissez cette option vide pour que le placement soit contrôlé par les blocs ORG propres au fichier inclus. |

**Syntaxe du mode expert :**
```
.include "library.json"

.include "macros.inc", $1500

.include "sprites.asm"
```

- L'extension de fichier ** est requise en mode expert** — un nom nu comme
  `.include "macros"` est traité comme `.include "macros.json"`.
- Résolution du chemin : essaie d'abord à côté du fichier de projet (relatif),
  puis revient au répertoire `samples/` intégré à l'application.

**ASM généré (pas de remplacement d'adresse) :**
```
; .include "library.json" — 12 bloc(s)

... (les blocs développés suivent)
```

**ASM généré (avec adresse de chargement `C000`):**
```
; .include "library.json" @ $C000 — 12 bloc(s)

*=$C000

... (les blocs développés suivent)
```

> Conseil : Utilisez INCLUDE pour créer des bibliothèques de sous-programmes
> réutilisables et partageables entre projets. Les fichiers .inc, .asm et .s
> sont recommandés pour modifier la bibliothèque dans un éditeur de texte brut
> ou la partager avec d'autres assembleurs 6502 ; le fichier .json est
> préférable lorsque la bibliothèque est créée directement dans Visual
> Assembler. Spécifiez une adresse de chargement si la bibliothèque ne possède
> pas de répertoire ORG ou si vous souhaitez modifier son emplacement par
> défaut.

---

### TABLEAU

Comme **DIM à une adresse spécifique** — nomme une table de consultation et
indique son emplacement en mémoire. Placez des blocs BYTE, WORD ou FILL après
pour définir le contenu de la table.

| Champ   | Description                                                        |
| ------- | ------------------------------------------------------------------ |
| Nom     | Identifiant de l'étiquette du tableau (par exemple, `color_table`) |
| Adresse | Adresse fixe où commence le tableau (par exemple `$C000`)          |

**Syntaxe experte : **
```
.table color_table, $C000
```

**ASM généré : **
```
tableau des couleurs :
```

Le compteur de programme saute à l'adresse spécifiée. Placez des blocs
BYTE/WORD/FILL après TABLE pour remplir le contenu.

**Taille : ** 0 octets.

---

### ORG

Définit l'emplacement en mémoire du programme (ou d'une partie de celui-ci), un
peu comme choisir une adresse de départ avant de saisir du code machine. Chaque
programme nécessite au moins une instruction ORG. L'adresse de départ standard
pour le BASIC C64 est `$0801`.

| Champ     | Description                                                                   |
| --------- | ----------------------------------------------------------------------------- |
| Adresse   | La nouvelle adresse d'origine (par exemple `0801` en HEX, ou `2049` en DEC)   |
| HEX / DEC | Basculer l'affichage de la saisie d'adresse entre l'hexadécimal et le décimal |

**Syntaxe experte : **
```
* = $C000
```

**ASM généré : **
```
* = $C000
```

**Taille : ** 0 octets. Le bloc ORG lui-même ne génère aucun code machine.

Chaque bloc ORG marque le début d'une nouvelle section. Les blocs suivants sont
assemblés à partir de cette adresse. Lors de l'exportation du PRG, toutes les
sections sont fusionnées en un seul fichier ; les espaces entre les sections
sont remplis de zéros.

**Exemple — code à `$0801`, table de données à `$C000`:**
```
* = $0801

LDX #$00
boucle :

LDA $C000,X

STA $D800,X

INX

Boucle BNE

RTS

* = $C000

.octet $01, $02, $03, ...
```

> Conseil : Chaque programme doit commencer par un bloc ORG. L’adresse de départ
> typique d’un programme C64 BASIC chargeable est $0801 (2049 en décimal).
> Lorsque le stub système BASIC est activé, l’assembleur ajoute une courte ligne
> BASIC à $0801 et votre code commence à $080D.

---

### BOUCLE / SUIVANT

Comme **`FOR X=N TO 1 STEP -1 : ... : NEXT X`** en BASIC — effectue un décompte
de N à 1 en utilisant le registre X ou Y. Ajoutez un bloc LOOP, insérez vos
instructions entre celui-ci et NEXT, et la boucle s'exécutera automatiquement le
nombre de fois nécessaire.

#### BOUCLE

| Champ     | Description                                                                      |
| --------- | -------------------------------------------------------------------------------- |
| Registre  | `X` ou `Y` — le registre compteur                                                |
| Compter   | Nombre d'itérations de la boucle (hexadécimal ou décimal, par exemple `0A` = 10) |
| Étiquette | Étiquette de boucle générée automatiquement (par exemple, `boucle0`)             |

**Syntaxe experte : **
```
.boucle X, 10, boucle 0
```

**ASM généré : **
```
LDX #$0A
boucle0 :
```

**Taille : ** 2 octets (code d’opération LD + opérande immédiat).

#### SUIVANT

| Champ     | Description                                      |
| --------- | ------------------------------------------------ |
| Registre  | Correspondance automatique avec le registre LOOP |
| Étiquette | Lié automatiquement à l'étiquette LOOP           |

**Syntaxe experte : **
```
.next boucle0
```

**ASM généré : **
```
DEX

Boucle BNE0
```

**Taille : ** 3 octets (DEX + BNE + décalage de branche).

**Exemple — effacer 10 cellules d'écran : **
```
LDX #$0A
boucle0 :

LDA #$20 ; caractère espace

STA $0400,X

DEX

BNE boucle0
```

---

### POUR / FIN

Comme **`FOR X=0 TO N-1 : ... : NEXT X`** en BASIC — compte *up* à partir de 0.
Idéal lorsque vous avez besoin d'un index avant, par exemple pour parcourir une
chaîne ou un tableau.

#### POUR

| Champ     | Description                                                                                      |
| --------- | ------------------------------------------------------------------------------------------------ |
| Registre  | `X` ou `Y` — le registre compteur                                                                |
| Compter   | Limite de boucle (hexadécimal ou décimal, par exemple `$12` = 18). X/Y varie de 0 à la limite-1. |
| Étiquette | Étiquette de boucle générée automatiquement (par exemple, `pour0`)                               |

**Syntaxe experte : **
```
.pour X, 12 $, pour 0
```

**ASM généré : **
```
LDX #$00
pour0:
```

**Taille : ** 2 octets (code d’opération LD_ + `#$00`).

#### FINDF

| Champ     | Description                                     |
| --------- | ----------------------------------------------- |
| Registre  | Correspondance automatique avec le registre FOR |
| Étiquette | Lié automatiquement à l'étiquette POUR          |
| Compter   | Copie automatique à partir du FOR apparié       |

**Syntaxe experte : **
```
.endf pour0
```

**ASM généré : **
```
INX

CPX #12 $

BNE pour 0
```

**Taille : ** 5 octets (IN_ + CP_ #imm + décalage BNE).

**Exemple — imprimer une chaîne terminée par un caractère nul : **
```
LDX #$00
for0:

LDA msg,X ; msg = chaîne PETSCII à adresse fixe

BEQ done ; terminateur nul → sortie

JSR $FFD2 ; CHROUT

INX

CPX #$12 ; 18 caractères max

BNE for0
done:

RTS
```

> Boucle ** vs FOR : ** : La boucle décrémente (N→1) et est idéale pour les
> délais, les remplissages et les boucles de pixels. La boucle FOR incrémente
> (0→N) et est idéale pour accéder aux chaînes de caractères et aux tableaux.
> Les deux peuvent utiliser X ou Y.

---

### POUSSER / TIRER

Comme ** la sauvegarde des variables avant un GOSUB et leur restauration après
** — mais utilise la pile matérielle du 6502. Si une sous-routine utilise A, X
ou Y, encapsulez-la dans des instructions PUSH et PULL afin de préserver les
registres du code appelant.

#### POUSSER

Empile un ou plusieurs registres. L'ordre est toujours A → X → Y (du plus
interne au plus externe).

| Champ     | Description                                                |
| --------- | ---------------------------------------------------------- |
| Registres | Toute combinaison : `A`, `X`, `Y`, `AX`, `AY`, `XY`, `AXY` |

**Syntaxe experte : **
```
.push AXY
```

**ASM généré (exemple : `AX`):**
```
PHA

TXA

PHA
```

**Taille : ** 1 octet pour A (`PHA`), 2 octets pour X ou Y (transfert + push).

#### TIRER

Restaure les registres de la pile dans l'ordre inverse **** (Y → X → A).

| Champ     | Description                                                     |
| --------- | --------------------------------------------------------------- |
| Registres | Identique à PUSH — doit correspondre au bloc PUSH correspondant |

**Syntaxe experte : **
```
.tirer AXY
```

**ASM généré (exemple : `AX`):**
```
PLA

TAXE
PLA
```

> **Règle : ** Les commandes PUSH et PULL doivent toujours utiliser le **même
> jeu de registres**. `PUSH AX` → `PULL AX` (restaure en interne dans l’ordre
> inverse : X d’abord, puis A).

---

### END / Alias RTS

Comme **RTS avec un nom de macro plus convivial** — `.end` émet un seul octet
`RTS` et se comporte comme un terminateur de sous-routine court en mode expert.

**Syntaxe experte : **
```
.fin
```

**ASM généré : **
```
RTS
```

**Taille : ** 1 octet.

Utilisez ceci lorsque vous souhaitez un marqueur de fin de sous-routine qui
ressemble davantage à une macro qu'à une instruction brute.

---

### MACRO / ENDM / INVOQUER

Comme **une GOSUB nommée avec des paramètres** — définissez un bloc de code
réutilisable une seule fois (MACRO…ENDM), puis appelez-le n'importe où avec
INVOKE. Transmettez des valeurs d'arguments différentes à chaque fois au lieu de
copier-coller des blocs.

#### MACRO (début de la définition)

| Champ      | Description                                                                                         |
| ---------- | --------------------------------------------------------------------------------------------------- |
| Nom        | Identifiant de la macro (par exemple, `setColor`)                                                   |
| Paramètres | Noms de paramètres optionnels séparés par des virgules (par exemple `couleur` ou `couleur, nombre`) |

Marque le début de la définition d'une macro. Les blocs entre MACRO et ENDM
constituent le corps de la macro ; ils ne génèrent aucun code à l'endroit où se
trouve la définition. Utilisez {paramName} comme espace réservé pour les
arguments.

**ASM généré : **
```
; .MACRO setColor (couleur)

... (blocs du corps)
; .ENDM
```

**Syntaxe du mode expert : **
```
.macro setColor couleur

LDA {couleur}

STA $D020
.endm
```

#### FIN (fin de définition)

Ferme la définition de macro actuelle. Aucun champ.

#### INVOQUER

Appelle une macro définie à cette position et remplace les valeurs d'argument
fournies par les espaces réservés `{paramName}` dans le corps.

| Champ           | Description                                                                                                               |
| --------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Nom de la macro | Sélectionnez une macro définie dans la liste déroulante.                                                                  |
| Arguments       | Valeurs des arguments séparées par des virgules correspondant à la liste des paramètres de la macro (par exemple, `#$07`) |

**ASM généré : **
```
; .invoke setColor(#$07)
    LDA #$07
    STA $D020
```

**Syntaxe du mode expert : **
```
; un seul argument :

.invoke setColor(#$07)

; plusieurs arguments :

.invoke drawPixel($10, $20)

; aucun argument :

.invoke clearScreen

; arguments de type texte (entre guillemets) :

.invoke printText("Hello, World!")

; alias de .call (synonyme de .invoke) :

.call setColor(#$07)
```

Le corps de la macro est développé en ligne, `{paramName}` étant remplacé par
les arguments réels. La forme séparée par des espaces (`.invoke setColor #$07`)
est également acceptée.

**Types d'arguments :**
- **Numérique** : `#$07`, `$10`, `255` — valeurs hexadécimales ou décimales
- **Chaînes de texte** : `« Bonjour, monde ! »` — chaînes entre guillemets ; les
  virgules à l’intérieur des guillemets sont traitées comme faisant partie du
  texte, et non comme des séparateurs d’arguments
- **Mixte** : `#$07, "bonjour", $20` — toute combinaison

> **Conseil :** Définissez les macros en haut (ou en bas) de votre programme,
> puis invoquez-les là où c’est nécessaire. Les macros peuvent être invoquées
> plusieurs fois avec différents arguments.

---

### RÉGION / ENDRÉGION

Regroupement purement visuel — zéro octet, aucun effet sur le code assemblé.
Comme replier une section d'un programme BASIC dans un bloc nommé pour pouvoir
la réduire et se concentrer sur autre chose.

| Champ            | Description                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------- |
| Nom de la région | Étiquette en texte libre pour la section (par exemple, `init`, `game_loop`, `sprite_setup`) |

**Syntaxe experte : **
```
.region init

; blocs...
.endregion
```

**Contrôles sur l'en-tête du bloc REGION (toujours visibles) :**
- **▸ / ▾ bascule** — réduit ou agrandit toute la région. Lorsqu'elle est
  réduite, tous les blocs entre REGION et ENDREGION sont cachés.
- **↕ Développer tout** — décompresse chaque bloc individuellement replié à
  l'intérieur de la région et développe la région elle-même si nécessaire.
- **⦵ Sélectionner dans ASM** — met en surbrillance toute la plage de codes de
  la région dans la vue ASM (de ` ; ===[ nom ]===` à ` ; ===[/ nom]===`) et
  permet de faire défiler jusqu'à cette plage. Bascule automatiquement vers
  l'onglet ASM s'il n'est pas déjà visible.
- **⧉ Copier la région** — copie le bloc REGION, tous ses blocs enfants et
  l'ENDREGION correspondant dans le presse-papiers. Un clignotement ✓ confirme
  la copie.
- **⎘ Coller la région** — Insère la région copiée comme nouvelle région
  immédiatement après la région de fin de la région actuelle et fait défiler
  jusqu'à celle-ci. Le bouton est grisé tant qu'aucune région n'a été copiée.

**ASM généré : **
```
; initialisation de la région
    SEI
    MDL #00$
    STA $D020
; initialisation de la région finale
```

**Taille : ** 0 octets pour REGION et ENDREGION.

**Exemple de flux de travail :**
1. Ajoutez un bloc `REGION`, définissez le nom de la région sur `init`.
2. Ajoutez vos instructions d'initialisation ci-dessous.
3. Ajoutez un bloc `ENDREGION` pour fermer la section.
4. Cliquez sur ▸ sur la RÉGION pour réduire toute la section à une seule ligne
   pendant que vous travaillez sur d'autres parties du programme.

> **Remarque : **Les régions peuvent être **imbriquées** les unes dans les
> autres. Chaque région fermée bloque la région ouverte la plus proche. Aucun
> effet sur le résultat assemblé.

---

### DÉFINIR / SI / SINON / FIN SI

Comme un interrupteur, l'assembleur lit : `DEFINE DEBUG` active un symbole, puis
tout bloc `IF DEBUG` est inclus et sa branche `ELSE` est ignorée. Supprimez le
bloc `DEFINE` et le bloc `IF` disparaît du résultat. Il n'est pas nécessaire de
supprimer le code pour les versions de production.

#### DÉFINIR

| Champ   | Description                                                                                           |
| ------- | ----------------------------------------------------------------------------------------------------- |
| Symbole | Un ou plusieurs identifiants séparés par des virgules à activer (par exemple `DEBUG` ou `DEBUG, PAL`) |

**Syntaxe experte : **
```
.define DEBUG, PAL
```

**ASM généré : **
```
; .DEFINE DEBUG
; .DEFINE DEBUG, PAL
```

Un bloc `DEFINE` permet d'activer plusieurs symboles simultanément (séparés par
des virgules). Placez les blocs DEFINE en haut de votre programme. La
suppression du bloc désactive instantanément tous les symboles qu'il contient.

#### SI

| Champ     | Description                                                                    |
| --------- | ------------------------------------------------------------------------------ |
| Condition | Identifiant à tester (doit correspondre à un symbole `DEFINE` pour être actif) |

**Syntaxe experte : **
```
.si DEBUG
```

**ASM généré : **
```
; .SI DÉBOGAGE
```

Les blocs compris entre `IF` et `ENDIF` (ou `ELSE`) sont inclus ou ignorés selon
que le symbole de condition possède ou non une directive `DEFINE` correspondante
dans le programme. Les blocs ignorés apparaissent sous forme de commentaires `;
[IF skipped] …` et génèrent **zéro octet**.

#### AUTRE

Aucun champ. Marque la branche alternative — assemblée lorsque la condition `IF`
n'est *pas* active.

**Syntaxe experte : **
```
.autre
```

**ASM généré : **
```
; .AUTRE
```

#### FINSI

Aucun champ. Ferme le bloc conditionnel.

**Syntaxe experte : **
```
.endif
```

**ASM généré : **
```
; .ENDIF
```

**Taille : ** 0 octet pour les quatre blocs. Seul le contenu *entre* eux est
pris en compte.

**Exemple — flash de bordure de débogage, la version finale l'ignore : **
```
; .DEFINE DEBUG

; .IF DEBUG

LDA #$02 ; bordure rouge

STA $D020

; .ELSE

LDA #$00 ; bordure noire (libération)

STA $D020

; .ENDIF
```

**Exemple — plusieurs symboles dans un seul bloc DEFINE : **
```
; .DEFINE DEBUG, PAL

; .IF PAL

LDA #$xx ; Constante de temporisation PAL

; .ELSE

LDA #$xx ; Constante de temporisation NTSC

; .ENDIF
```

Les blocs `IF` imbriqués sont pris en charge. Si un bloc externe est ignoré, les
blocs internes le sont également.

> **Remarque :** Il s’agit d’une gestion des conditions à la compilation. Pour
> une syntaxe simplifiée de comparaison/branchement à l’exécution, voir **IF /
> ELSE / ENDIF à l’exécution** ci-dessous.

### .AFFIRMER

*(Nouveau dans la version 2.3.9.)* Un **contrôle de cohérence à la
compilation**. `.assert` évalue une expression lors de l'assemblage ; si elle
est fausse (`0`), la compilation s'arrête et une erreur claire incluant la
valeur est affichée. Si elle est vraie (non nulle), aucun message n'est émis.

| Champ      | Description                                                                                                                                                 |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Expression | Toute expression assembleur : étiquettes, `CONST`, `*` (compteur de programme), arithmétique et comparaisons (`&lt;`, `&lt;=`, `&gt;`, `&gt;=`, `==`, `!=`) |
| Message    | Texte facultatif ajouté à l'erreur d'échec                                                                                                                  |

**Syntaxe experte : **
```
.assert spriteData &lt; $C000

.assert * &lt; $A000

.assert end - start &lt;= 256, "Le tableau des sprites a débordé d'une page"
```

**Comportement : **

- **Taille : ** 0 octets.
- Une assertion fausse interrompt l'assemblage : `` `.assert end - start &lt;=
  256` est faux (valeur : 0). La table des sprites a dépassé d'une page ``.
- Une assertion qui ne peut pas être évaluée (étiquette non définie, etc.)
  échoue également, avec *"ne peut pas être évaluée au moment de l'assemblage"*.
- Les comparaisons donnent `1` / `0`; placez `.assert` n'importe où dans le flux
  du programme — il est vérifié à l'adresse sur laquelle il se trouve, donc
  `.assert * &lt; $D000` teste la position de sortie actuelle.

**Exemple — protéger un bloc sprite contre un changement de page : **
```
* = 3000 $
sprite_data :

.byte $00, $00, $00 ; … 63 octets …
sprite_data_end :

.assert sprite_data_end - sprite_data == 63, « Le sprite doit faire exactement 63 octets »

.assert (sprite_data % 64) == 0, « Le sprite doit être aligné sur 64 octets »
```

---

### CONST

Comme une variable nommée qui ne change jamais — SCREEN = $0400. Utilisez le nom
plutôt que de saisir des adresses brutes partout ; le code sera ainsi plus
facile à lire et à modifier ultérieurement.

| Champ  | Description                                                                                                                                |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Nom    | Identifiant de la constante (par exemple, `SCREEN`)                                                                                        |
| Valeur | Valeur numérique dans la base sélectionnée (par exemple `0400` en HEX = adresse $0400), ou une expression relative au PC (voir ci-dessous) |
| Format | HEX ou DEC — détermine la façon dont la valeur est saisie et affichée                                                                      |

**Syntaxe experte : **
```
.const SCREEN = $0400

.const FRAMES_1S = 60
```

**ASM généré : **
```
; .CONST SCREEN = $0400
```

Le nom de la constante apparaît dans la liste déroulante du sélecteur
d'étiquettes **** sur les blocs d'instructions — il suffit de cliquer dessus
pour l'insérer.

**Expressions relatives au PC (`*+N` / `*-N`):**

Le champ de valeur accepte également `*+N` ou `*-N`, où `*` correspond à
l'adresse de compilation du bloc CONST. Ceci permet de créer un alias nommé pour
un octet au sein d'une instruction voisine — le modèle classique de code
auto-modificateur.

```
CONST op = *+1 ; op → adresse de l'opérande immédiat du prochain LDA

LDA #$00 ; $00 sera modifié à l'exécution

... STA op ; écrase l'octet #$00 → LDA lira la nouvelle valeur lors de la prochaine exécution
```

La CONST émet 0 octets ; l'étiquette se résout au moment de la compilation à
`adresse_actuelle + 1`.

**Expressions arithmétiques :**

Le champ de valeur accepte les opérations arithmétiques générales, y compris les
références à des noms CONST précédemment définis, des littéraux
hexadécimaux/binaires et des fonctions mathématiques intégrées :

```
.const SCREEN = $0400
.const SCREEN_END = SCREEN + 40*25 ; 1000 octets plus tard
.const COLOR_RAM = $D800
.const MID_X = 160
.const SIN_TABLE = round(sin(PI/8) * 127) ; valeur du sinus précalculée
```

**Fonctions intégrées : ** `sin() `, `cos() `, `round() `, `max(a,b) `,
`min(a,b) `, `abs() `, constante `PI `

Opérateurs : `+ - * /` Littéraux : `$FF` (hexadécimal), `%10110000` (binaire)
Octet de poids faible/de poids fort : `lo(expr)`, `hi(expr)`

**Taille : ** 0 octets.

---

### VAR

Comme **CONST, mais à allocation automatique** — `VAR` réserve de l'espace
mémoire de page zéro pour une étiquette sans que vous ayez à saisir l'adresse.
Utilisez-le pour les compteurs, les pointeurs et les états éphémères qui doivent
être stockés dans la page zéro.

| Champ               | Description                                             |
| ------------------- | ------------------------------------------------------- |
| Nom                 | Nom/étiquette de la variable                            |
| Taille (facultatif) | Nombre d'octets à réserver. Omettre pour un seul octet. |

**Syntaxe experte : **
```
Compteur .var
minuterie .var, 2
.var vit
```

**Exemple pratique :**
```
.region Vars
Compteur .var
minuterie .var, 2
.endregion

MDL #00$
Compteur STA
```

**ASM généré : **
```
; .var compteur
```

**Taille : ** 1 octet par défaut, ou `N` octets lorsque la taille est spécifiée.

L'allocateur parcourt un curseur de page zéro configurable (de `$02` à `$FE`) et
attribue le prochain emplacement libre. Si la région demandée chevauche une
étiquette déjà utilisée, le compilateur émet un avertissement.

---

### Exécution IF / ELSE / ENDIF

Comme un véritable modèle de branchement, cette version fonctionne à
l'exécution, et non à la compilation. Elle compare A, X ou Y à une valeur
immédiate et génère la séquence de branchement CMP / CPX / CPY appropriée.

| Champ     | Description                                  |
| --------- | -------------------------------------------- |
| Registre  | `A`, `X` ou `Y`                              |
| Opérateur | `==`, `!=`, `&lt;`, `&lt;=`, `&gt;`, `&gt;=` |
| Valeur    | Valeur immédiate au format HEX ou DEC        |

**Syntaxe experte : **
```
Si A == #$10

LDA #$07
.sinon

LDA #$0F
.fin si
```

**Taille : ** Dépend des branches choisies et du formulaire de comparaison.

La comparaison est non signée par défaut. Pour `&lt;=` et `&gt;`, la macro
s'étend à la chaîne de branchement équivalente la plus courte pour le registre
sélectionné.

---

### TANT QUE / FIN

Comme **une boucle d'exécution avec un test au sommet** — le corps s'exécute
tant que la condition reste vraie.

| Champ     | Description                                  |
| --------- | -------------------------------------------- |
| Registre  | `A`, `X` ou `Y`                              |
| Opérateur | `==`, `!=`, `&lt;`, `&lt;=`, `&gt;`, `&gt;=` |
| Valeur    | Valeur immédiate au format HEX ou DEC        |

**Syntaxe experte : **
```
.while A != #$00

JSR getchar
.endw
```

**Taille : ** Dépend du corps de la boucle et de la forme de comparaison.

Utilisez `WHILE` lorsque la boucle risque de se terminer avant la fin de la
première itération. Il s'agit de l'équivalent, en termes d'exécution, de
l'utilitaire `LOOP / NEXT` basé sur le comptage.

---

### RÉPÉTER / JUSQU'À

Comme **une boucle d'exécution avec un test à la fin** — le corps s'exécute
toujours au moins une fois, puis la condition décide s'il faut s'arrêter.

| Champ     | Description                                  |
| --------- | -------------------------------------------- |
| Registre  | `A`, `X` ou `Y`                              |
| Opérateur | `==`, `!=`, `&lt;`, `&lt;=`, `&gt;`, `&gt;=` |
| Valeur    | Valeur immédiate au format HEX ou DEC        |

**Syntaxe experte : **
```
.repeat

JSR getchar
.until A == #$00
```

**Taille : ** Dépend du corps de la boucle et de la forme de comparaison.

Utilisez `REPEAT / UNTIL` lorsque vous souhaitez que le corps s'exécute au moins
une fois avant la vérification de sortie.

---

### MEMCPY / MEMSET

Comme les petites routines de mémoire que vous utilisez constamment, ** —
`MEMCPY` copie un bloc contigu, `MEMSET` remplit une plage avec un octet.

| Macro    | Champs                  |
| -------- | ----------------------- |
| `MEMCPY` | `src`, `dst`, `size`    |
| `MEMSET` | `addr`, `value`, `size` |

**Syntaxe experte : **
```
.memcpy src=$C000, dst=$D000, size=$0100

.memset addr=$0400, value=#$20, size=$03E8
```

**ASM généré : ** boucles de copie/remplissage en ligne, choisies pour
correspondre à la taille demandée.

Les données jusqu'à 256 octets utilisent une boucle courte de 8 bits. Au-delà,
un compteur 16 bits est automatiquement utilisé.

---

### IMPRIMER / IMPRIMER_CARACTÈRES / IMPRIMER_HEXAGONAL / EFFACER_ÉCRAN / ATTENDRE_TOUTE / DÉLAI / DÉFINIR_BORDURE / DÉFINIR_ARRIÈRE_PLAN

#### IMPRIMER

Comme la sortie PETSCII **sans le code répétitif ** — affiche une chaîne de
caractères via `CHROUT ` avec la même gestion des majuscules et minuscules que
le bloc PETSCII. La case à cocher « minuscules » est partagée avec l’encodeur
PETSCII, le chemin du texte reste donc cohérent.

**Syntaxe experte : **
```
.print "BONJOUR"
.print "bonjour", lower
```

#### IMPRIMER_CARACTÈRE

Imprime un octet PETSCII sous forme de code numérique et l'envoie via `CHROUT`.
La valeur peut également être une constante nommée ou une étiquette qui sera
résolue en un octet lors de l'assemblage, aussi bien en mode Bloc qu'en mode
Expert.

**Syntaxe experte : **
```
.print_char 65

.print_char $41

.print_char couleur
```

#### IMPRIMER_HEX

Imprime une valeur 8 bits sous forme de texte hexadécimal via le chemin de
sortie normal du KERNAL.

**Syntaxe experte : **
```
.print_hex A
```

#### EFFACER_ÉCRAN

Raccourci pour le code de contrôle standard de l'écran transparent du C64.

**Syntaxe experte : **
```
.clear_screen
```

#### ATTENDRE_CLÉ

Attend qu'une touche soit pressée, vous n'avez donc pas à parcourir manuellement
la boucle `GETIN` à chaque fois.

**Syntaxe experte : **
```
.wait_key
```

#### RETARD

Attend le nombre d'images demandé via une routine auxiliaire partagée. Utilisez
cette fonction pour les pauses courtes et les intervalles de temps lorsqu'une
boucle personnalisée complète serait excessive. Le nombre d'images peut être un
nombre brut ou une constante nommée, et `.wait` est simplement un alias de
`.delay`.

**Syntaxe experte : **
```
.delay 29

.wait 29

.delay frames=FRAMES_1S
```

En mode Bloc, le champ de délai utilise un sélecteur de constante compact
lorsqu'une valeur symbolique est disponible, vous n'avez donc pas besoin de
saisir le nom manuellement à chaque fois.

#### DÉFINIR_BORDURE / DÉFINIR_ARRIÈRE-PLAN

Fonctions d'encapsulation simplifiées pour les registres de couleur VIC-II. La
valeur de couleur peut être un nombre brut ou une constante nommée comprise
entre 0 et 15. Les modes Bloc et Expert acceptent tous deux les noms de
constantes symboliques.

**Syntaxe experte : **
```
.set_border 6
.set_bg 0
.set_border color
.set_bg color
```

**Taille :** Chaque auxiliaire se développe en une minuscule séquence d’écriture
de registre ou en un court appel KERNAL.

En mode Bloc, ces champs utilisent également le sélecteur de constantes, de
sorte que la valeur symbolique reste visible au lieu d'être remplacée par un
nombre brut.

---

### IRQ_SETUP

Configure un gestionnaire d'IRQ raster en une seule étape. La macro écrit le
vecteur d'IRQ, active les IRQ raster, définit la ligne, désactive les sources
d'IRQ CIA communes et revient à l'exécution normale avec `CLI`.

| Champ        | Description                                                   |
| ------------ | ------------------------------------------------------------- |
| Gestionnaire | Étiquette de routine IRQ (par exemple `my_irq`)               |
| Raster       | Ligne raster en hexadécimal ou en décimal (par exemple `$FA`) |

**Syntaxe experte : **
```
.irq_setup handler=my_irq, raster=$FA
```

**Taille : ** Une petite séquence de configuration ; la longueur exacte dépend
de la ligne raster sélectionnée.

Utilisez ceci lorsque vous souhaitez le code standard commun « SEI / installer
le gestionnaire / activer l'IRQ / CLI » sans le disperser dans tout le
programme.

---

### RAND

Comme **un minuscule PRNG intégré** — renvoie une valeur pseudo-aléatoire de 8
bits à partir d'une graine de page zéro compacte.

| Champ  | Description                                                                   |
| ------ | ----------------------------------------------------------------------------- |
| Graine | Octet ou étiquette d'initialisation de page zéro optionnel (par défaut `$FB`) |

**Syntaxe experte : **
```
.rand
```

**Taille : ** Quelques octets, en fonction du chemin d’implémentation choisi.

Ce générateur est conçu pour le gameplay, la variation des effets et la
production rapide de données de test. Il est volontairement simple plutôt que
sophistiqué sur le plan cryptographique.

---

<a id="sprite_init"></a>
### SPRITE_INIT

Configure un sprite VIC-II en un seul bloc : au lieu d’écrire environ six
instructions POKE en BASIC, il suffit de remplir les champs. Définit le pointeur
de données du sprite, l’active, active éventuellement le mode multicolore et
définit sa couleur.

| Champ           | Description                                                                              |
| --------------- | ---------------------------------------------------------------------------------------- |
| Sprite #        | Sprite numéro 0 à 7                                                                      |
| Couleur         | Indice de couleur 0–15 (palette C64)                                                     |
| page de données | Adresse des données Sprite / 64 (par exemple `$21` si les données se trouvent à `$0840`) |
| Multicolore     | Active ou désactive le bit multicolore du sprite (`$D01C`)                               |

**Syntaxe experte : **
```
.sprite_init 0, 7, $21

.sprite_init 0, 7, $21, multicolore

.sprite_init 0, 7, $21, monochrome
```

**ASM généré : **
```
LDA #$21

STA $07F8 ; registre pointeur de sprite ($07F8 + N)

LDA $D015

ORA #$01 ; activer le bit multicolore du sprite 0

STA $D015

LDA $D01C

AND #$FE ; désactiver le bit multicolore du sprite 0

STA $D01C

LDA #$07

STA $D027 ; registre de couleur du sprite 0
```

**Taille : ** 26 octets.

> **Page de données du sprite : ** `adresse_données ÷ 64 `. Avec le stub BASIC
> SYS par défaut, `ALIGN 64 ` après `JMP main ` place les données du sprite à
> `$0840 ` → page = `$21 `.

---

<a id="sprite_pos"></a>
### SPRITE_POS

Comme **`POKE 53248, x : POKE 53249, y`** en BASIC — définit la position de
départ d'un sprite. Les coordonnées sont intégrées lors de l'assemblage, et les
champs acceptent des constantes en mode Bloc ; pour l'animation, utilisez
`INC`/`DEC` directement sur le registre du sprite.

| Champ    | Description                |
| -------- | -------------------------- |
| Sprite # | Sprite numéro 0 à 7        |
| X        | Position horizontale 0–319 |
| Y        | Position verticale 0–255   |

**Syntaxe experte : **
```
.sprite_pos 0, 152, 100
```

**ASM généré (exemple : sprite 0, X=152, Y=100) :**
```
LDA #$98 ; Octet de poids faible X

STA $D000 ; Registre X du sprite 0

LDA $D010

AND #$FE ; Effacement du bit de poids fort X pour le sprite 0 (X ≤ 255)

STA $D010

LDA #$64 ; Y = 100

STA $D001 ; Registre Y du sprite 0
```

Pour X > 255, la macro définit le bit correspondant dans `$D010` au lieu de
l'effacer.

**Taille : ** 18 octets.

> **Remarque : ** `SPRITE_POS` intègre les coordonnées X/Y dans le code (`LDA
> #$xx`). Pour animer un sprite à l’exécution, utilisez `INC $D000` / `DEC
> $D000` — voir l’exemple `sprite-macro-demo`.

---

<a id="wait_raster"></a>
### ATTENDRE_RASTER

Attend que le faisceau d'électrons du VIC-II atteigne une ligne de balayage
spécifique, comme pour la synchronisation avec une image TV. Placez ce programme
en début de boucle de jeu pour éviter les déchirures d'image. Aucun JSR ni
étiquette requis.

| Champ        | Description                                                      |
| ------------ | ---------------------------------------------------------------- |
| Ligne raster | Ligne raster cible en hexadécimal (par exemple `FF` = ligne 255) |

**Syntaxe experte : **
```
.wait_raster $FF
```

**ASM généré : **
```
Attente :

LDA $D012 ; ligne raster actuelle

CMP #$FF ; ligne cible

BNE attente ; boucle de retour (-7 octets)
```

**Taille : ** 7 octets (le décalage `BNE` `$F9` = −7 pointe toujours vers le
`LDA`).

> **Conseil :** Placez `WAIT_RASTER` en haut de votre boucle de jeu pour
> synchroniser avec l’affichage et éviter le déchirement des sprites.

---

### JOYSTICK

Comme lire **`PEEK($DC00)`** puis modifier la position du sprite — mais en une
seule opération. Lit un port joystick CIA et ajuste les registres X/Y d'un
sprite en conséquence. Entièrement intégré, sans JSR.

| Champ    | Description                                                                |
| -------- | -------------------------------------------------------------------------- |
| Port     | `1` = port 1 (`$DC01`) ou `2` = port 2 (`$DC00`)                           |
| Sprite # | Sprite numéro 0–7 (contrôle quelle paire de registres X/Y est mise à jour) |

**Syntaxe experte : **
```
.joystick 2, 0
```

**ASM généré (port 2, sprite 0) :**
```
LDA $DC00 ; lecture du port CIA 2

LSR ; bit 0 → retenue (Montée)

BCS skip_up ; retenue définie = NON enfoncée

DEC $D001 ; Y−1 (déplacement vers le haut)
skip_up :

LSR ; bit 1 → retenue (Descendance)

BCS skip_down

INC $D001 ; Y+1 (déplacement vers le bas)

skip_down :

LSR ; bit 2 → retenue (Gauche)

BCS skip_left

DEC $D000 ; X−1 (déplacement vers la gauche)

skip_left :

LSR ; bit 3 → retenue (Droite)

BCS skip_right

INC $D000 ; X+1 (déplacement vers la droite)

skip_right :
```

**Tableau des bits du joystick (actif-BAS — bit = 0 signifie enfoncé) :**

| Peu | Direction   | registre de la CIA              |
| --- | ----------- | ------------------------------- |
| 0   | En haut     | $DC00 (port 2) / $DC01 (port 1) |
| 1   | Vers le bas |                                 |
| 2   | Gauche      |                                 |
| 3   | Droite      |                                 |
| 4   | Feu         | (non géré par cette macro)      |

**Taille : ** 27 octets. Le décalage `BCS` est toujours `+3` (ignore
l’instruction `DEC`/`INC abs` de 3 octets suivante).

**Mode variable — `.joystick port, vx, vy[, fire]`:** Au lieu de déplacer un
sprite, la direction est écrite dans des variables : `vx` / `vy` = `-1` / `0` /
`+1` (`$FF` / `$00` / `$01`), et le `fire` = `1` optionnel lorsque le bouton est
enfoncé, `0` sinon. Utilisez-le pour une caméra à défilement, un joueur avec sa
propre physique ou des menus. Le port `3` lit les deux ports joystick
simultanément (`LDA $DC00` / `AND $DC01`), donc les deux ports fonctionnent.

```
.joystick 2, vx, vy ; 35 octets

.joystick 3, vx, vy, tir ; les deux ports + tir : 45 octets
```

> **Utilisation typique :** Placer à l’intérieur d’une étiquette `gameloop` avec
> `WAIT_RASTER` en premier :
> ```
> boucle de jeu :
> 
> ATTENDRE_RASTER ($FF)
> 
> JOYSTICK (port=2, sprite=0)
> 
> JMP boucle de jeu
> ```

---

<a id="mouse"></a>
### SOURIS

Interprète un signal de souris proportionnelle Commodore 1351 et déplace un
sprite. Entièrement intégré (X71X) — aucun JSR ni étiquette requis. La macro
sélectionne le port CIA, attend la stabilisation des entrées de la palette SID,
puis décode le déplacement delta à l'aide du modèle de pilote standard du 1351
et l'applique aux registres du sprite.

| Champ      | Description                                                                                        |
| ---------- | -------------------------------------------------------------------------------------------------- |
| Port       | `1` = CIA `$DC00` bits `7:6` = `%01`; `2` = `%10`                                                  |
| Sprite #   | Sprite numéro 0 à 7                                                                                |
| Octet ZP X | Adresse de la page zéro (hexadécimal) pour stocker l'échantillon POTX précédent (par exemple `FD`) |
| Octet ZP Y | Adresse de la page zéro (hexadécimal) pour stocker l'échantillon POTY précédent (par exemple `FE`) |

**Forme ASM générée (port 1, sprite 0, ZP `$FD`/`$FE`):**

```
; Sélection du port CIA + règlement

LDA $DC00

ET #$3F

ORA #$40

STA $DC00

LDX #$67
Attente :

DEX

Attente BNE

; Axe X — Décodage delta 7 bits standard de type 1351

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
xdone :

; Axe Y — même décodage, puis inversion avant application

LDA $D41A

TAXE

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
yneg :

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
ydone :
```

**Taille : ** 142 octets.

**Syntaxe du mode expert : **
```
.mouse port, spriteNum, zpX, zpY

; exemple :

.mouse 2, 0, FD, FE
```

> **Important :** Avant le premier appel, initialisez les octets de la page zéro
> avec les valeurs POTX/POTY actuelles pour éviter un saut sur la première trame
> :
> ```
> ; port 1 : LDA $DC00 : ET #$3F : ORA #$40 : STA $DC00
> 
> ; port 2 : LDA $DC00 : ET #$3F : ORA #$80 : STA $DC00
> 
> LDA $D419 : LSR A : ET #$3F : STA $FD
> 
> LDA $D41A : LSR A : ET #$3F : STA $FE
> ```

> **Conseil :** Interrogez la souris une fois par image — placez `WAIT_RASTER`
> dans la boucle de jeu avant `MOUSE`.

---

<a id="sprite_col"></a>
### SPRITE_COL

Comme **`PEEK($D01E)`** en BASIC — vérifie les registres de collision matériels
du VIC-II et indique si un sprite a heurté un autre sprite ou le fond. Fonction
entièrement intégrée, sans JSR.

| Champ             | Description                                                                                                                                   |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Sprite #          | Sprite numéro 0–7 (quel sprite vérifier)                                                                                                      |
| Type de collision | `Sprite-Sprite ($D01E)` — collision avec un autre sprite ; `Sprite-Arrière-plan ($D01F)` — collision avec un élément graphique d'arrière-plan |

**Syntaxe experte : **
```
.sprite_col 0, sprite
.sprite_col 0, arrière-plan
```

**ASM généré (sprite 0, sprite–sprite):**
```
LDA $D01E ; lit le registre de collision sprite-sprite (le vide !)

ET #$01 ; isole le bit 0 (sprite 0)

; A ≠ 0 → collision survenue
```

**Taille : ** 5 octets.

> **Important : ** La lecture de `$D01E`/`$D01F` ** efface le registre **.
> Lisez-le une fois par image et agissez immédiatement sur le résultat avec
> `BEQ`/`BNE`.

**Utilisation typique :**
```
boucle de jeu :

ATTENDRE_RASTER ($FF)

JOYSTICK (port=2, sprite=0)

SPRITE_COL (sprite=0, type=sprite-sprite)

BEQ no_hit ; A = 0 → pas de collision

LDA #$02

STA $D020 ; bordure rouge = touché !

JMP boucle de jeu
no_hit :

LDA #$0E

STA $D020 ; bordure bleu clair = dégagé

JMP boucle de jeu
```

> **Voir aussi :** `collision-demo` exemple — boule verte (sprite n° 0) contre
> croix rouge (sprite n° 1).

---

### CHARGEMENT DE FICHIER

Comme **`LOAD "fichier",8`** en BASIC, cette commande charge un fichier depuis
une disquette D64 à l'exécution, en utilisant la routine KERNAL LOAD.
Utilisez-la pour charger des données, de la musique ou du code supplémentaire
depuis le disque pendant l'exécution de votre programme.

| Champ                                | Description                                                                                                                                                                                                                                                    |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nom de fichier                       | Nom du fichier sur le disque (16 caractères maximum, majuscules automatiques ; les caractères `,`, `"`, `/`, `\`, `:`, `*`, `?`, `&lt;`, `&gt;`, `|` sont filtrés)                                                                                             |
| Appareil                             | Numéro de périphérique 8–30 (par défaut `8`)                                                                                                                                                                                                                   |
| Adresse de remplacement (facultatif) | Adresse de chargement hexadécimale (par exemple, `C000`). Si cette option est définie, le fichier est chargé à cette adresse (`sec=0`, l'en-tête PRG étant ignoré). Laissez ce champ vide pour utiliser l'en-tête PRG de 2 octets propre au fichier (`sec=1`). |
| Étiquette d'erreur (facultatif)      | Si cette option est activée, une instruction `BCS` est générée après JSR LOAD. Si le KERNAL renvoie une retenue (erreur), l'exécution saute à cette étiquette.                                                                                                 |

**Syntaxe experte : **
```
.loadfile "DEMO-COLORS", 8

.loadfile "DEMO-COLORS", 8, $C000

.loadfile "DEMO-COLORS", 8, $C000, error_label
```

**Structure du code généré : **
```
JMP skip_filename ; ignorer le nom de fichier en ligne

.byte "DEMO-COLORS" ; octets du nom de fichier (PETSCII, 11 caractères)
skip_filename :

LDA #11 ; longueur du nom de fichier

LDX #<fname ; pointeur lo

LDY #>fname ; pointeur hi

JSR $FFBD ; SETNAM

LDA #1 ; fichier logique #1

LDX #8 ; périphérique 8

LDY #0 ; sec=0 (remplacer l'adresse) ou #1 (adresse propre au fichier)

JSR $FFBA ; SETLFS

LDA #0 ; commande LOAD (et non VERIFY)

JSR $FFD5 ; LOAD

Échec BCS ; (uniquement si l'étiquette d'erreur est définie)
```

**Taille : ** `3 + longueur_nom_de_fichier + 9 (SETNAM) + 9 (SETLFS) + (4 si
remplacement) + 5 (LOAD) + (2 si étiquette d'erreur) ` octets. Minimum 27
octets.

> Important : Le nom de fichier est stocké directement dans le code machine
> juste après un JMP skip_filename. Le nom de fichier sur le disque doit être en
> PETSCII majuscules, ce qui correspond aux lettres majuscules ASCII (A à Z). La
> macro applique cette contrainte automatiquement.

> **Utilisez toujours une étiquette d'erreur** pour les programmes de production
> — si le fichier n'est pas trouvé, KERNAL définit l'indicateur de retenue et
> l'exécution passe à la suite.

> **Voir aussi :** `loadfile-demo` exemple — démontre le chargement de
> `DEMO-COLORS.PRG` à partir d'un D64 avec une branche d'erreur BCS et un écran
> d'erreur visuel.

---

### EXODECRUNCH

Décompression Exomizer en cours de programme ****. Utilisez cette macro juste
après un `LOADFILE` qui a chargé un flux compressé en mode mémoire Exomizer `` —
EXODECRUNCH le décompresse à l'adresse intégrée dans le flux.

| Champ                | Description                                                                                                           |
| -------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Adresse du déballeur | Emplacement en mémoire du code de décompression (par défaut : `B000`). Doit être une adresse hexadécimale de 16 bits. |

**Syntaxe experte : **
```
.exodecrunch

.exodecrunch depacker=$B000
```

**Code généré (19 octets) : **
```
LDA $AE ; Fin de chargement du noyau (définie par le chargement précédent)

STA $04 ; Pointeur de fin de chargement du décompresseur (niveau bas)

LDA $AF ; Fin de chargement du noyau (niveau haut)

STA $05 ; Pointeur de fin de chargement du décompresseur (niveau haut)

LDA #$36 ; ROM BASIC désactivée ($A000-$BFFF devient RAM)

STA $01

Décompresseur JSR ; le décompresseur lit de l'arrière vers l'avant via $04/$05

LDA #$37 ; Restauration du mappage par défaut (BASIC + KERNAL + E/S)

STA $01
```

**Comment ça marche :**

1. KERNAL `LOAD` ($FFD5) met à jour ZP `$AE/$AF` pour pointer un octet après le
   dernier octet chargé. EXODECRUNCH copie cette valeur dans ZP `$04/$05`,
   conformément à la convention officielle Exomizer pour l'écriture en amont.
2. Le décompresseur est généralement placé à `$B000` (dans la région mappée de
   la ROM BASIC). La macro inverse `$01 = $36` afin que le processeur voie la
   RAM à cet emplacement pendant l'exécution du JSR, puis rétablit `$01 = $37`
   par la suite.
3. L'adresse cible de décompression est **encodée dans le flux compressé
   lui-même** lorsque vous compressez avec `exomizer mem -l <load>
   fichier,<cible>` — le décompresseur la lit à partir des premiers octets du
   flux.

**Décompresseur binaire : ** le décompresseur rétro-compilé est
`samples/exo-decrunch.bin` (477 octets, ORG $B000). Il s'agit d'une interface
Kick Assembler pour le fichier officiel `exodecrunch.asm` avec `INC $D020`
ajouté à chaque lecture pour un effet de flash visible pendant la décompression.
Placez-le dans votre programme avec un bloc `INCBIN` à l'adresse du
décompresseur.

**Compensation de sécurité : ** Le mode mémoire par défaut d'Exomizer applique
un décalage de sécurité de 2 octets ; les données sont donc placées 2 octets
avant la cible demandée. La boîte de dialogue « Exécuter via D64 » ** ajoute
automatiquement 2 au champ Dst ** avant d'appeler Exomizer, afin que le
comportement affiché corresponde à l'adresse saisie.

> **Voir aussi :** l’exemple `exo-multicolor-demo` — exemple complet de bout en
> bout : LOADFILE un bitmap multicolore compressé dans $C000, EXODECRUNCH le
> décompresse dans $2000, puis copie l’écran → $0400 et la couleur → $D800, et
> bascule VIC-II en mode bitmap multicolore.

> Test d'intégration : ** ** `test cargo --test exomizer_integration` (dans
> `src-tauri/`) vérifie le cycle complet de compression et de décompression sur
> un émulateur 6502 avec le binaire de décompression réel. Critère de réussite :
> 10 000 octets identiques à la source `multi-color.bin`.

---

### VÉRIFICATION REU

Détecte si une unité d'extension de RAM Commodore (REU) est branchée — comme
vérifier `PEEK($D010)` pour voir si le matériel est présent. Teste en écrivant
et en relisant deux motifs dans le registre REU `$DF04`.

| Champ | Description    |
| ----- | -------------- |
| Aucun | Aucun opérande |

**Code généré (34 octets) :**
```
LDA #55$
STA $DF04
LDA $DF04
CMP #55$
Échec du BNE
LDA #$AA
STA $DF04
LDA $DF04
CMP #$AA
Échec du BNE
MDL #00$
CMP #$FF ; Z=0 =&gt; REU présent
BNE terminé
échouer:
MDL #$FF
CMP #$FF ; Z=1 =&gt; pas de REU
fait:
```
> La macro normalise le résultat afin que la branche suivante reste simple :
> `BNE` signifie REU présent, `BEQ` signifie REU manquant.

**Syntaxe experte : **
```
.reu_check
```

**Résultat dans les drapeaux : **
- **Z = 0** (résultat ≠ 0) → REU présent → utiliser `BNE`
- **Z = 1** (résultat = 0) → pas de REU → utiliser `BEQ`

**Aucun champ configurable** — la macro génère le même code à chaque fois.

**Utilisation typique :**
```assembly
REU_CHECK
BEQ no_reu ; sauter si REU n'est pas présent
; ... Code REU ici ...
non_reu :
```

---

### REU_STASH / REU_FETCH / REU_SWAP

Transfert de blocs DMA entre la RAM du C64 et la mémoire d'extension REU :
similaire à une boucle POKE très rapide, mais sans intervention du processeur
(la puce REU copie les données pendant que le processeur est inactif). Un
transfert de 1 000 octets est quasi instantané.

| Macro       | Direction     | `$DF01` commande |
| ----------- | ------------- | ---------------- |
| `REU_STASH` | RAM C64 → REU | `$90`            |
| `REU_FETCH` | REU → RAM C64 | `$91`            |
| `REU_SWAP`  | RAM C64 ↔ REU | `$92`            |

**Champs : **

| Champ       | Description                                         | Exemple |
| ----------- | --------------------------------------------------- | ------- |
| Adresse C64 | Source/destination dans la RAM du C64 (hexadécimal) | `C000`  |
| Adresse REU | Source/destination en REU (hexadécimal, 16 bits)    | `0000`  |
| Banque REU  | banque de mémoire REU (0–7)                         | `0`     |
| Longueur    | Nombre d'octets à transférer (hexadécimal, 16 bits) | `1000`  |

**Syntaxe experte : **
```
.reu_stash $C000, $0000, 0, $1000

.reu_fetch $C000, $0000, 0, $1000

.reu_swap $C000, $0000, 0, $1000
```

**Code généré (40 octets) : **
```
LDA #c64lo STA $DF02 ; Adresse C64 LO
LDA #c64hi STA $DF03 ; Adresse C64 HI
LDA #reuLo STA $DF04 ; Adresse REU LO
LDA #reuHi STA $DF05 ; Adresse REU HI
LDA #bank STA $DF06 ; Banque REU
LDA #lenLo STA $DF07 ; Longueur LO
LDA #lenHi STA $DF08 ; Longueur HI
LDA #$00 STA $DF09 ; Contrôle d'adresse (fixe)
LDA #$00 STA $DF0A ; Masque d'interruption (fixe)
LDA #cmd STA $DF01 ; Exécution DMA ($90/$91/$92 = stockage/récupération/échange, immédiat)
```

> **Remarque : ** Les commandes utilisent `$90/$91/$92` (bit 4 activé = mode DMA
> immédiat). L’écriture dans `$DF01` lance le transfert ; le processeur reprend
> son exécution une fois celui-ci terminé.

---

### TURBO_SET

Configure la vitesse du processeur **Ultimate-64 (U64)** via le registre
`$D031`. Sans effet sur un véritable C64 ou d'autres émulateurs.

**Champs : **

| Champ   | Description                     | Gamme                                       |
| ------- | ------------------------------- | ------------------------------------------- |
| Vitesse | Indice de vitesse du processeur | 0 = 1 MHz … 7 ≈ 10 MHz … 15 ≈ 48 MHz        |
| Badline | Émulation de Badline            | Activé (compatible C64) / Désactivé (turbo) |

L'octet de vitesse est calculé comme suit : `(speedIndex &amp; 0x0F) |
(badline_disabled ? 0x80 : 0x00)`.

**Code généré (5 octets) : **
```
A9 xx LDA #speed_byte
8D 31 D0 STA $D031
```

**Syntaxe du mode expert : **
```
.turbo_set 7,0 ; vitesse=7 (~10 MHz), badline activé

.turbo_set 15,1 ; vitesse=15 (~48 MHz), badline désactivé
```

> **Remarque : ** Cette macro affecte uniquement le matériel U64. Sur un
> véritable C64 ou d’autres émulateurs, elle écrit dans `$D031`, ce qui peut
> affecter le CIA ou être ignoré.

---

### DÉTECTION DU SUPERCPU

Vérifie si un accélérateur **CMD SuperCPU** est installé — comme `PEEK($D0B8)`
pour voir s'il renvoie quelque chose d'autre que `$FF`.

**Code généré (5 octets) : **
```
AD B8 D0 LDA $D0B8
C9 FF CMP #$FF
```

**Résultat dans les drapeaux : **
- **Z = 0** → SuperCPU présent → utiliser `BNE`
- **Z = 1** → SuperCPU introuvable → utiliser `BEQ`

**Aucun champ configurable.**

**Syntaxe experte : **
```
.supercpu_detect
```

**Utilisation typique :**
```assembly
DÉTECTION DU SUPERCPU

BEQ no_scpu ; ignorer si le SuperCPU est absent
; ... Code turbo du SuperCPU ici ...
no_scpu :
```

---

### ACTIVATION TURBO

Active ou désactive le mode turbo SuperCPU **CMD **. Appelez d'abord
`SUPERCPU_DETECT ` et ignorez cette étape si le SuperCPU n'est pas présent.

| Mode       | Registre | Effet                                                |
| ---------- | -------- | ---------------------------------------------------- |
| Activer    | `$D07A`  | Activer le mode turbo (jusqu'à 20 MHz avec SuperCPU) |
| Désactiver | `$D07B`  | Retour au mode de compatibilité 1 MHz                |

**Code généré (5 octets) : **
```
A9 00 LDA #$00
8D 7A D0 STA $D07A ; (ou 07 milliards de dollars pour désactiver)
```

**Syntaxe du mode expert : **
```
.turbo_enable activé
.turbo_enable désactivé
```

> **Remarque : ** Appelez d’abord `SUPERCPU_DETECT` et contournez cette macro si
> le SuperCPU n’est pas présent.

---

<a id="map_copy"></a>
### COPIE_CARTE

Copie une carte de tuiles depuis une adresse source vers la RAM écran (et
éventuellement la RAM couleur) à l'aide d'une série de boucles `LDA abs,X` /
`STA abs,X`. Une page de 256 octets est copiée à chaque itération ; une page
partielle à la fin est copiée via `CPX #rem / BNE` pour interrompre la copie.
Aucun JSR n'est nécessaire : tout le code est généré directement dans le code.

| Champ                         | Description                                                                                                                                                                                       |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Adresse source (écran)        | Adresse hexadécimale où se trouvent les données de la carte après le chargement (par exemple, `C000`)                                                                                             |
| Écran RAM dest                | Où copier les codes d'écran (par exemple `0400`)                                                                                                                                                  |
| Taille (octets)               | Nombre total d'octets à copier — généralement `$03E8` = 1000 (40×25 caractères)                                                                                                                   |
| Fichier .bin combiné          | Lors de la vérification, attend des codes d'écran immédiatement suivis de données de couleur à `source + taille` ; copie les données de couleur vers **Color RAM dest** lors d'une seconde passe. |
| destination de la RAM couleur | Destination des données de couleur — par défaut `D800` (RAM couleur C64)                                                                                                                          |

**ASM généré (carte de 1000 octets, écran uniquement) :**
```
LDX #$00

LDA $C000,X ; page 0

STA $0400,X

INX

BNE *-9 ; boucle jusqu'à ce que X soit égal à 0 (256 itérations)

LDA $C100,X ; page 1

STA $0500,X

INX

BNE *-9

LDA $C200,X ; page 2

STA $0600,X

INX

BNE *-9

LDA $C300,X ; reste — 232 octets

STA $0700,X

INX

CPX #$E8

BNE *-11
```

**Taille : ** `2 (LDX) + pages complètes×9 + (rem &gt; 0 ? 11 : 0)` octets par
section. Le mode combiné double cette valeur (section écran + section couleur
identique).

**Appairage avec l'éditeur de cartes : **

L'éditeur de cartes, via **Fichiers → Enregistrer la carte + RAM couleur
(.bin)**, exporte un seul fichier binaire dont les `premiers octets`
correspondent aux codes d'écran et les `octets suivants` aux valeurs de la RAM
couleur. Utilisez MAP_COPY avec l'option **Combined .bin** cochée et indiquez
**Source addr** l'emplacement de chargement de ce fichier (par exemple, via
INCBIN à `$C000`).

```
* = $C000

INCBIN "map-color.bin" @ $C000 ; codes d'écran $C000–$C3E7, couleur $C3E8–$C7CF

* = $0801

; ...

MAP_COPY src=$C000 dst=$0400 size=1000 combined color_dst=$D800
```

**Syntaxe du mode expert : **
```
.map_copy $C000, $0400, 1000 ; écran uniquement

.map_copy $C000, $0400, 1000, auto, $D800 ; combiné (couleur à la source + taille)

.map_copy $C000, $0400, 1000, $C3E8, $D800 ; adresse source de couleur explicite
```

---

<a id="map_copy16x16"></a>
### COPIE_MAP16X16

Copie une zone de caractères de 16×16 à partir d'un bloc de code écran compact
de 256 octets et d'un bloc de mémoire RAM couleur correspondant de 256 octets.
Cette fonction est conçue pour les exportations de canevas de jeu de caractères
et les petits fragments de tuiles/images, où l'écriture de seize lignes MAP_COPY
distinctes serait fastidieuse.

**Disposition par défaut : **

| Données                          | Adresse par défaut       |
| -------------------------------- | ------------------------ |
| Codes d'écran 16×16              | Adresse source (`src`)   |
| Valeurs de couleur 16×16         | `src + 256`              |
| destination de la RAM de l'écran | `$0400 + ligne×40 + col` |
| destination de la RAM couleur    | `$D800 + ligne×40 + col` |

**Syntaxe du mode expert : **
```
.map_copy16x16 $3000, 12, 4

.map_copy16x16 $3000, 12, 4, $0400, $3100, $D800
```

La forme abrégée copie les octets d'écran de `$3000`, les octets de couleur de
`$3100` et place le bloc 16×16 à la colonne 12, ligne 4. Les positions valides
en haut à gauche sont `col = 0..24` et `row = 0..9`, de sorte que la zone
complète de 16×16 reste sur l'écran de texte 40×25 du C64.

**Comportement généré : **

- Génère seize copies de lignes en ligne.
- Chaque ligne copie 16 octets d'écran et 16 octets de couleur.
- Aucune JSR n'est nécessaire ; le code est émis directement à l'emplacement de
  la macro.
- Fonctionne en mode caractère normal et en mode caractère multicolore ; les
  octets de la mémoire RAM couleur contiennent le bit d'activation de la
  couleur/multicolore du caractère de chaque cellule.

Association typique avec Charset Canvas :

```
* = 0801 $
    SEI
    MDL #00$
    STA $D021
    LDA #$05
    STA $D022
    LDA #$0D
    STA $D023
    .map_copy16x16 3 000 $, 12, 4
boucle:
    Boucle JMP

.incbin "16x16+ram+color.bin", 3 000 $
.incbin "16x16+charset.bin", 2 000 $
```

---

<a id="sprite_anim"></a>
### SPRITE_ANIM

Cette fonction fait progresser l'image d'animation d'un sprite à chaque appel et
met à jour le pointeur de données du sprite VIC-II. Elle stocke un octet par
image dans une table (le numéro de page des données du sprite = `adresse_données
/ 64`), fait pointer SPRITE_ANIM vers cette table et appelle la fonction une
fois par image de jeu ; aucun JSR n'est nécessaire.

| Champ                          | Description                                                                                                        |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| Sprite #                       | Sprite numéro 0 à 7                                                                                                |
| Adresse de la liste des cadres | Adresse hexadécimale de la table des trames — un octet par trame, chaque octet = page de sprite (`data_addr / 64`) |
| Nombre d'images                | Nombre total d'images (1–255)                                                                                      |
| Cadre ZP                       | Octet de page zéro utilisé comme compteur de trame (par exemple `FB`)                                              |

**ASM généré (sprite 0, 4 images, ZP `$FB`, liste à `$C100`):**
```
INC $FB ; avance du compteur d'images

LDA $FB

CMP #$04 ; nombre d'images

BCC *+6 ; si compteur &lt; nombre, ignorer la réinitialisation

LDA #$00

STA $FB

TAX ; X = index de l'image actuelle

LDA $C100,X ; charger la page de données du sprite pour cette image

STA $07F8 ; mettre à jour le pointeur du sprite 0 ($07F8 + numéro du sprite)
```

**Taille : ** 19 octets.

**Utilisation typique :**
```
Table des images :

.byte $21, $22, $23, $24 ; 4 images à $0840, $0880, $08C0, $0900

Boucle de jeu :

ATTENDRE_RASTER ($FF)

ANIMATION_SPRITALE (sprite=0, liste=$C100, nombre=4, zp=$FB)

SAUTER dans la boucle de jeu
```

**Syntaxe du mode expert : **
```
.sprite_anim spriteNum, frameListAddr, frameCount, zpByte

; exemple :

.sprite_anim 0, C100, 4, FB
```

> Conseil : Placez la table des trames sous forme de bloc RAWBYTES à une adresse
> fixe. L’octet de compteur ZP ($FB) doit être initialisé à 00 avant le premier
> appel. Si votre code utilise $FB à d’autres fins, choisissez un emplacement ZP
> libre.

---

<a id="score_bcd"></a>
### SCORE_BCD

Ajoute une valeur à virgule fixe à un score BCD multi-octets stocké en mémoire,
puis affiche chaque chiffre dans la mémoire RAM de l'écran sous forme de
caractère de code écran. Utilise le mode décimal 6502 (`SED`/`CLD`) pour des
calculs BCD sans retenue ; aucun ajustement manuel de la retenue n'est
nécessaire.

| Champ              | Description                                                                                                            |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| Adresse du score   | Adresse hexadécimale des octets de score BCD (par exemple `C200`). Octet de poids faible en premier.                   |
| Chiffres           | Nombre d'octets BCD (chaque octet contient deux chiffres : `$99` = "99"). `4` octets = jusqu'à 99999999.               |
| Ajouter des points | Valeur décimale à ajouter par appel (par exemple `100`).                                                               |
| Adresse de l'écran | Où écrire les codes numériques de l'écran (par exemple `0400`). Un octet par chiffre (octet de poids fort en premier). |

**Syntaxe experte : **
```
.score_bcd $C200, 4, 100, $0400
```

**ASM généré (4 octets, +100 pts, score à `$C200`, écran à `$0400`):**
```
SED ; activer le mode BCD/décimal

CLC

LDA $C200 ; octet 0 (chiffres 1-2)

ADC #$00 ; octet de poids faible de 100 en BCD = $00

STA $C200

LDA $C201 ; octet 1 (chiffres 3-4)

ADC #$01 ; octet médian de 100 en BCD = $01 (la retenue se propage)

STA $C201

LDA $C202

ADC #$00

STA $C202

LDA $C203

ADC #$00

STA $C203

CLD ; retour au mode binaire

; afficher les chiffres

LDX #$00
boucle_chiffres :

LDA $C200,X

PHA

LSR : LSR : LSR : LSR ; nibble de poids fort → nibble de poids faible

ORA #$30 ; + code écran '0'

STA $0406,X ; justifié à droite : adresse_écran + (chiffres*2 - 2) - X*2

PLA

AND #$0F ; nibble de poids faible

ORA #$30

STA $0407,X

INX

CPX #$04

BNE boucle_chiffres
```

**Taille : ** `3 + chiffres×8` octets (SED + CLC + surcharge CLD + 8 octets par
octet BCD pour ADC + boucle d’affichage).

**Syntaxe du mode expert : **
```
.score_bcd $C200, 4, 100, $0400
```

> Conseil : Initialisez les octets du score à $00 au démarrage. L’adresse du
> score doit se trouver dans la page zéro ou dans la RAM absolue, et non dans la
> ROM. L’adresse de l’écran doit pointer vers la cellule numérique la plus à
> gauche ; les chiffres sont écrits de gauche à droite (octet de poids fort en
> premier).

> **Plage BCD : ** `chiffres=4` octets → 8 chiffres décimaux → score maximum 99
> 999 999. Chaque octet encode deux chiffres BCD : `$00`–`$99`.

---

## 11. Liens vers la base de connaissances

Liens de référence rapide disponibles dans l'application sous **Base de
connaissances** :

### RetroDebugger

[RetroDebugger](https://github.com/slajerek/RetroDebugger) est un débogueur
Commodore 64 multiplateforme avec prise en charge des points d'arrêt, inspection
de la mémoire et désassemblage prenant en compte les étiquettes.

**Configuration :** Ouvrez **Paramètres → Configurer l’exécutable
RetroDebugger** et pointez-le vers le binaire `RetroDebugger`.

**Lancement :** Cliquez sur **Déboguer (RetroDebugger)** dans la barre d’outils.
L’application va :

1. Assemblez le programme dans un fichier `.prg` dans un répertoire temporaire.
2. Écrivez un fichier de points d'arrêt **** (`breakpoints.txt`) — un `break
   $ADDR` par bloc marqué.
3. Créez un fichier de symboles (symbols.txt) au format d'étiquettes
   Vice/RetroDebugger (al C:\addr.name). Tous les blocs LABEL et CONST sont
   inclus.
4. Écrivez également des sidecars de style C64Debugger à côté du PRG compilé :
   `.dbg`, `.sym` et `.vs`.
5. Lancez RetroDebugger avec :
   ```
   RetroDebugger -prg <fichier.prg> -points d'arrêt <points d'arrêt.txt> -symboles <symboles.txt> [options]
   ```

### Blocs de points d'arrêt

Cliquez sur l'icône de point d'arrêt (●) sur un bloc d'instructions pour le
définir comme point d'arrêt. Les blocs avec point d'arrêt sont surlignés en
rouge. Leurs adresses sont enregistrées dans le fichier des points d'arrêt à
chaque lancement du débogueur.

### Indicateurs du débogueur (onglet Options)

| Basculer          | Drapeau          | Effet                                                                           |
| ----------------- | ---------------- | ------------------------------------------------------------------------------- |
| `-jmp` activé     | `-saut $ADDR`    | Accédez directement à l'adresse de démarrage du programme après le chargement.  |
| `-reprise` ACTIVÉ | `-reprise`       | Reprenez immédiatement le débogueur au chargement.                              |
| `-attendre` ON    | `-attendre <ms>` | Attendez `<ms>` millisecondes avant de reprendre la lecture — 500 ms ou 1000 ms |

> **Conseil : ** Pour la plupart des programmes, activez `-jmp ` et `-unpause `
> pour un démarrage automatique instantané. Utilisez `-wait 500 ` ou `-wait 1000
> ` lorsque votre programme configure des IRQ ou de la musique SID qui nécessite
> un temps d'initialisation avant le premier balayage.

### VICE Monitor (rechargement rapide, surveillance en direct, profileur)

Le bouton **VICE Monitor** de la barre d'outils ouvre une fenêtre non modale qui
communique avec VICE en cours d'exécution via son moniteur binaire. **Lancer
(VICE)** démarre VICE avec le moniteur sur le port 6502 (**Paramètres → Moniteur
distant VICE**, activé par défaut). Fermez et redémarrez une instance de VICE
lancée autrement. L'en-tête affiche l'état de la connexion ; *Disponible
uniquement dans l'application de bureau* apparaît dans l'aperçu du navigateur.

| Bouton                                                   | Ce que cela fait                                                                                                                                                                                                   |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Rechargement à chaud**                                 | Écrit le programme assemblé dans la RAM du VICE en cours d'exécution (seules les plages occupées sont utilisées ; les espaces vides sont laissés intacts). Utilisable pour les données : sprites, tableaux, texte. |
| **Rechargement à chaud + redémarrage**                   | Idem, puis redémarre à l'adresse SYS (réinitialisation de la pile ; le `RTS` final retourne à `READY.`).                                                                                                           |
| **Rechargement automatique à chaud après modifications** | Le programme se recharge et redémarre environ une seconde après chaque modification, s'il est assemblé.                                                                                                            |
| **Regarder en direct**                                   | Actualise la liste de surveillance toutes les 0,4 s ; une valeur modifiée clignote.                                                                                                                                |
| **Profil**                                               | Échantillonne le compteur de programme pendant environ 5 secondes (cliquez à nouveau pour arrêter prématurément).                                                                                                  |

**Liste de surveillance : ** saisissez une étiquette ou une adresse — `score`,
`$D020`, `53280`, ou avec un nombre d’octets `table, 8` — et appuyez sur **+**
ou Entrée. Chaque ligne affiche l’adresse, les octets en hexadécimal et, pour 1
ou 2 octets, la valeur décimale. En mode Ultimate Basic, les noms proviennent de
la dernière version d’UB (variables, étiquettes, sous-routines, tableaux).

**Résultat du profilage : ** deux tableaux. *Routine* regroupe les échantillons
par étiquette la plus proche (dans Ultimate Basic : par `sub`), avec la part en
% et les lignes raster sur lesquelles ils ont été exécutés ; le temps passé dans
la ROM KERNAL ou BASIC est indiqué séparément. *Ligne* liste les lignes sources
les plus gourmandes en ressources ; cliquez sur une ligne pour y accéder. Chaque
échantillon interrompt brièvement l’émulateur ; le profil est donc une
représentation statistique et non un décompte précis des cycles.

---

## 12. Exportation et exécution D64

La version 1.5.1 ajoute la possibilité d'empaqueter votre programme (et des
fichiers de données supplémentaires) dans une image disque C64 D64 et de la
lancer dans VICE, ou d'exporter l'image disque pour une utilisation ailleurs.

| Ressource                                                    | URL                                                            |
| ------------------------------------------------------------ | -------------------------------------------------------------- |
| Référence des codes d'opération 6502                         | http://www.6502.org/tutorials/6502opcodes.html                 |
| Fonctions du noyau C64                                       | https://sta.c64.org/cbm64krnfunc.html                          |
| Carte mémoire du C64                                         | https://sta.c64.org/cbm64mem.html                              |
| Codes couleur C64                                            | https://sta.c64.org/cbm64col.html                              |
| Article VIC-II                                               | https://www.cebix.net/VIC-Article.txt                          |
| Base de code C64                                             | https://codebase.c64.org/                                      |
| Le Turbo Assembleur                                          | https://turbo.style64.org/                                     |
| RetroDebugger                                                | https://github.com/slajerek/RetroDebugger/                     |
| Environnement de développement du système d'exploitation C64 | https://www.c64os.com/c64os/programmersguide/?s=devenvironment |
| Convertisseur d'images png2c64                               | https://png2c64.app/                                           |

---

## 12b. Exportation CRT (cartouche Magic Desk 64K)

Menu → Compiler → Compiler CRT génère une image de cartouche Commodore 64 (type
19 – Magic Desk / Domark / HES Australia) compatible avec VICE, TheC64, le
matériel physique via EasyFlash / Kung Fu Flash et les emplacements cartouches
1541 Ultimate II+. Elle est disponible en mode bloc, en mode expert et, depuis
la version actuelle, également en mode UltimateBasic.

### Qu'est-ce qui est expédié dans le panier ?

Le bouton **Exécuter** de la barre d'outils a été remplacé par un bouton
**fractionné** :

| Partie                     | Action                                               |
| -------------------------- | ---------------------------------------------------- |
| **▶ Exécuter** (principal) | Exécute le mode d'exécution actuellement sélectionné |
| **▾** (flèche)             | Ouvre le sélecteur de mode                           |

**Modes d'exécution disponibles : **

| Mode                         | Description                                                                                                                                                                                                                                                                       |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Exécuter en tant que PRG** | Assemblez le tout dans un fichier temporaire `.prg` et lancez VICE directement. Comportement classique.                                                                                                                                                                           |
| **Exécuter via D64**         | Assemblez et créez une image disque `.d64` (en utilisant c1541), ajoutez les fichiers supplémentaires configurés, puis lancez VICE depuis le disque. Utilisez cette image chaque fois que votre programme charge des fichiers à l'exécution (par exemple avec la macro LOADFILE). |
| **Exécuter sur le matériel** | Assemblez le fichier PRG et envoyez-le à un périphérique **1541 Ultimate / Ultimate 64** via le réseau local. Voir [Section 13](#13-hardware-settings).                                                                                                                           |
| **Kung Fu Flash 2**          | Assemblez le fichier PRG et téléchargez-le via le port série USB sur un véritable C64/C128 équipé d'une cartouche **Kung Fu Flash 2**. Voir [Kung Fu Flash 2](#kung-fu-flash-2).                                                                                                  |

Le mode sélectionné est enregistré entre les sessions.

### Adresse de chargement et point d'entrée

La compilation CRT n'utilise jamais Exomizer (le décompresseur ne peut pas
s'exécuter à partir de la ROM de la cartouche). Elle compile l'onglet actuel
avec le pipeline de démarrage automatique standard et récupère l'adresse de
chargement à partir de l'en-tête PRG et le point d'entrée à partir de la cible
SYS :

1. **Mode Bloc / Expert avec stub BASIC SYS activé :** chargement = `$0801`,
   entrée = la cible SYS (généralement `$080D` ou l'origine de l'utilisateur).
2. **Mode Bloc / Expert avec stub BASIC SYS désactivé :** chargement = origine
   utilisateur (avec le repli classique `$0801 → $C000 `), entrée = adresse de
   chargement.
   - **Nom** — tel qu'il apparaît dans le répertoire D64 (16 caractères max,
     majuscules automatiques).
   - **Addr** (adresse de chargement, optionnelle) : si cette adresse est
     fournie, un en-tête PRG de 2 octets est ajouté. Laissez ce champ vide pour
     écrire des octets bruts sans en-tête.
   - **Dst** (cible de décompression, uniquement avec EXO) — emplacement où le
     décompresseur doit déposer les données sur le C64. Lorsque EXO est activé,
     le fichier supplémentaire est compressé avec `exomizer mem -l <Addr>
     fichier,<Dst>` avant d'être écrit sur le D64. La compensation de sécurité
     de +2 est appliquée automatiquement.
   - **EXO** — case à cocher qui active le traitement en mode `mem` inversé pour
     cette entrée. La taille sur disque représente généralement 5 à 20 % de la
     taille d'origine.
3. **Mode UltimateBasic :** le chargement et l’entrée proviennent tous deux de
   la table de correspondance du compilateur UB (`build.map.loadAddress`). Le
   stub de démarrage automatique UB à l’intérieur de la charge utile est ensuite
   exécuté exactement comme il le serait après `LOAD "...",8,1 : RUN` depuis le
   disque.

L'adresse d'origine que vous voyez dans la sortie ASM est préservée ; le
chargeur copie simplement l'image mémoire plate du PRG dans la RAM et saute au
point d'entrée une fois que la ROM de la cartouche est démappée.

### Limite de taille

Étant donné que la charge utile est stockée linéairement et que la fonction
`assembleProgramToPrg()` renvoie un tampon `minAddr..maxAddr` plat avec des
espaces vides remplis de zéros, un programme avec des segments ORG largement
espacés (par exemple, `$0801` + `$C000` + `$E000`) compte chaque octet
intermédiaire dans le budget de 65 408 octets. Si cette limite est dépassée, la
compilation s'interrompt avec une erreur `saveCrtTooLarge` : il faut alors
compresser la mémoire ou fractionner les données.

L'exemple **loadfile-demo** est préconfiguré avec le fichier supplémentaire
`DEMO-COLORS.PRG`. Sélectionnez-le, ouvrez **Exécuter via D64** et cliquez sur
**Exécuter** pour observer le flux de chargement complet.

> **⚠️ Avertissement important — à lire avant l'expédition d'un CRT**

### Compatibilité

L'icône de la barre d'outils située après l'Éditeur de courbes ouvre l'Éditeur
D64, un outil autonome permettant de travailler directement avec une image D64
existante, indépendamment du programme actuellement ouvert. Contrairement à la
boîte de dialogue Exporter vers D64 ci-dessus (qui crée systématiquement un
nouveau disque à partir du fichier PRG compilé), l'Éditeur D64 modifie une image
disque directement via c1541, faisant ainsi office de gestionnaire de disques
léger.

**Fichiers ▾ menu : **

| Plate-forme           | Action                                                         |
| --------------------- | -------------------------------------------------------------- |
| VICE (`x64sc`, `x64`) | Fonctionne via **Fichier → Attacher l'image de la cartouche**. |
| Le C64 / Le C64 Mini  | Fonctionne grâce au chargeur de cartouches intégré.            |
| Éclair de Kung Fu     | Fonctionne — mode natif Magic Desk.                            |
| Cartouche EasyFlash   | Fonctionne lorsqu'il est programmé comme Magic Desk.           |

**Barre d'outils :**

| Icône                      | Action                                                                                                                                                                                               |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Ajouter un programme**   | Sélectionnez un fichier local et écrivez-le dans le répertoire du disque.                                                                                                                            |
| **Extraire la sélection**  | Enregistrez les octets de l'entrée sélectionnée dans un fichier local `.prg`.                                                                                                                        |
| **Renommer la sélection**  | Modifiez le nom de l'entrée directement dans le tableau — Entrée confirme, Échap annule.                                                                                                             |
| **Supprimer la sélection** | Supprimez l'entrée sélectionnée du disque.                                                                                                                                                           |
| **Actualiser**             | Relisez le répertoire, par exemple après avoir modifié le disque à l'aide d'un autre outil.                                                                                                          |
| **Sauvegarder**            | Réécrit les modifications de la copie de travail dans le fichier `.d64` d'origine, après avoir effectué une sauvegarde automatique. Activé uniquement en présence de modifications non enregistrées. |

**Ajout d'un programme :** la sélection d'un fichier se terminant déjà par
`.prg` ne demande qu'un **Nom** et un **Type** de disque (PRG/SEQ/USR/REL) — un
fichier `.prg` contient déjà son propre en-tête d'adresse de chargement, il est
donc écrit sans modification. La sélection de tout autre fichier (par exemple,
un fichier brut `.bin`) affiche en outre :

- **Adresse de chargement** (hex, optionnel) — ajouter un en-tête PRG de 2
  octets à cette adresse ; laisser vide pour écrire les octets bruts.
- **Adresse de décompression** (hex, optionnel) — utilisé uniquement avec
  Exomizer ; l'adresse cible vers laquelle le décompresseur doit décompresser
  les données.
- **Exomizer** case à cocher — compressez le fichier avant l'écriture, en
  utilisant les mêmes modes de compression `mem`/`sfx` que les fichiers
  supplémentaires dans la boîte de dialogue Exporter vers D64 ci-dessus.

La liste des répertoires affiche les noms de fichiers dans la même police et le
même style de majuscules qu'une véritable liste C64 `LOAD"$",8`.

Flux de travail **Enregistrement : ** chaque modification (ajout, extraction,
renommage, suppression et modifications d'octets dans l'éditeur de blocs) est
appliquée à une copie de travail privée de l'image disque, et non à votre
fichier principal. Le bouton **Enregistrer** de la barre d'outils (activé en
présence de modifications non enregistrées) réécrit la copie de travail
par-dessus le fichier `.d64` principal, après avoir effectué une sauvegarde
automatique. L'en-tête affiche un marqueur **•** tant que les modifications ne
sont pas enregistrées. La fermeture de l'éditeur ou l'ouverture d'un autre
disque contenant des modifications non enregistrées demande une confirmation au
lieu de les supprimer. **Enregistrer sous…** (menu Fichiers ▾) enregistre la
copie de travail dans un nouveau répertoire et permet de poursuivre la
modification à cet emplacement.

**Éditeur de blocs : ** L’icône de grille de la barre d’outils permet d’afficher
une vue brute des pistes/secteurs sous le répertoire : une carte des blocs
cliquable, colorée selon l’espace libre/utilisé du fichier BAM (le fichier BAM
et la chaîne de répertoires étant marqués séparément), une grille hexadécimale
par octet pour le bloc de 256 octets sélectionné et une navigation entre les
secteurs (Précédent/Suivant). Les modifications de blocs suivent le même
processus de copie de travail/enregistrement que les actions sur les répertoires
décrites ci-dessus.

> **Exigence : ** comme l’exportation vers D64, l’éditeur D64 nécessite VICE
> (`c1541`) configuré dans [Paramètres matériels](#13-hardware-settings).

---

## 13. Paramètres matériels

Ouvrez ce menu via **Paramètres → Paramètres matériels…** dans la barre
d'outils. Vous y trouverez tous les chemins d'accès aux périphériques externes
et la configuration réseau.

### Émulateur VICE

- **8 × 8 KB banques** à `$8000`, banque commutée via `$DE00` (Convention Magic
  Desk : les 3 bits de poids faible = banque, bit 7 = désactiver le chariot).
- ** La banque 0 ** contient un en-tête de 128 octets + un chargeur de démarrage
  :
  - `$8000/$8002` vecteurs de démarrage à froid + à chaud pointent vers `$8009`.
  - `$8004–$8008` = la signature `CBM80` requise par le code de réinitialisation
    du KERNAL.
  - `$8009–$807F` = le chargeur : SEI / initialisation de la pile / `JSR $FDA3`
    (IOINIT) / `JSR $FD50` (RAMTAS) / `JSR $FD15` (RESTOR) / `JSR $FF5B` (CINT),
    puis une boucle de copie d'octets qui transfère la charge utile de la ROM de
    la cartouche vers la RAM et change de banque lorsque `$FC` atteint `$A0`. À
    la fin, il copie un minuscule **exit stub** vers `$0100`, désactive la
    cartouche avec `LDA #$80 : STA $DE00`, et `JMP`s vers le point d'entrée.
- **La charge utile** commence à `$8080` dans la banque 0 et se répartit dans
  les banques 1 à 7 selon les besoins. Charge utile maximale = `8 * 8192 − 128 =
  65 408 octets`.

### Exomizer

**Flux de travail : **

- Installez le fichier binaire Exomizer :
- Configurez le chemin dans **Paramètres matériels → section Exomizer**.
- Activez la case à cocher **Exécuter avec Exomizer** dans le menu
  **Paramètres**.

Exomizer fonctionne de la même manière sous Windows et macOS : l’interface de
ligne de commande est invoquée depuis le serveur Tauri ; l’intégration n’a rien
de spécifique à une plateforme.

### Débogueur rétro

Voir [Section 9]{1} pour la documentation complète du débogueur.

> **⚠️ Avertissement important — à lire avant l'expédition d'un CRT**
> 
> Le chargeur appelle la fonction KERNAL **`RESTOR` ($FD15)** dans le cadre de
> la séquence de réinitialisation standard. Ceci réécrit intentionnellement les
> vecteurs d'E/S standard aux adresses `$0314/$0315`, `$0316/$0317`,
> `$0318/$0319`, `$0328/$0329` et associées, en rétablissant leurs valeurs par
> défaut dans la ROM. Conséquences :
> 
> - **Toutes les interruptions IRQ / NMI / BRK définies avant le démarrage du
>   CRT sont effacées.** Votre programme doit les installer lui-même après
>   l'entrée — exactement comme un nouveau `LOAD "",8,1 : RUN` à partir d'une
>   bande/disque.
> - Les programmes Ultimate Basic qui dépendent de vecteurs KERNAL non standard
>   actifs à l'entrée peuvent nécessiter un appel explicite à SYS ou à init dans
>   le stub de démarrage automatique. Le démarrage automatique standard d'UB
>   fonctionne immédiatement ; ce n'est pas le cas des bibliothèques d'extension
>   qui interceptent les vecteurs avant RUN.
> - Les interfaces **CIA1 et **CIA2 sont réinitialisées par `IOINIT`. Les
>   configurations de minuterie personnalisées (IRQ raster, interface CIA-A du
>   lecteur de musique) doivent être reprogrammées après la saisie.
> - La cartouche est désactivée par un stub de 8 octets dans la RAM ** à
>   l'adresse `$0100`** afin que l'opération `STA $DE00` ne puisse pas être
>   interrompue par une erreur de lecture de la ROM. Ne vous fiez pas à l'image
>   de la pile dans `$0100–$0107` lors de l'entrée : la première écriture en RAM
>   écrase le stub.
> 
> Si un programme CRT fonctionne sous VICE mais échoue sur du matériel physique,
> il faut d'abord vérifier s'il suppose un état spécifique du vecteur KERNAL ou
> du minuteur CIA à son entrée. Définissez explicitement cet état dans votre
> routine d'initialisation ; le programme se comportera alors de la même manière
> sur les deux supports.

### C64 Ultimate / 1541 Ultimate

| Plate-forme                     | Description                                                                     |
| ------------------------------- | ------------------------------------------------------------------------------- |
| **Hôte (IP)**                   | Adresse IP du périphérique (par exemple `192.168.1.100`)                        |
| **Mot de passe**                | Facultatif — si l'appareil nécessite une authentification                       |
| **Test de connexion**           | Envoie une requête de test à `/v3/runners/info` ; affiche « OK » ou « erreur ». |
| Cartouche EasyFlash             | Fonctionne lorsqu'il est programmé comme Magic Desk.                            |
| 1541 Ultimate II+ / Ultimate 64 | Fonctionne via **Cartouche → Charger l'image de la cartouche**.                 |
| Caméléon / Turbo Caméléon       | Travaux.                                                                        |

---

## 14. Éditeurs visuels (boîte à outils)

Le menu de la barre d'outils **Toolkit** regroupe les éditeurs de données
visuelles qui partagent tous un menu Fichiers commun (`Fichiers ▾`) pour Charger
BIN / Enregistrer BIN / Exporter vers des blocs / Enregistrer sur D64. Chaque
éditeur produit des données brutes `.bin` qui peuvent être placées dans un
programme avec `INCBIN`, ou ajoutées directement à un disque D64 via l'entrée
**Enregistrer sur D64**.

### Éditeur haute résolution/multicolore

| Paramètre                    | Description                                                                                                                            |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Basculement du mode          | **Multicolore** La case à cocher permet de basculer entre haute résolution (mono par cellule) et multicolore (4 couleurs par cellule). |
| **Statut**                   | Indique si le chemin d'accès à l'exécutable est valide et accessible.                                                                  |
| **VICE moniteur à distance** | Démarre VICE avec le moniteur binaire sur le port 6502, nécessaire au [Moniteur VICE](#vice-monitor-hot-reload-live-watch-profiler)    |

Éditeur d'images bitmap au niveau du pixel, avec modes haute résolution 320×200
et multicolore 160×200. Ouvrir via Outils → Éditeur haute résolution.

### Éditeur de sprites

| Paramètre  | Description                                                                           |
| ---------- | ------------------------------------------------------------------------------------- |
| Cadres     | Ajouter / supprimer / réorganiser les cadres ; la bande de cadres est visible en bas. |
| Mode       | Basculement monochrome/multicolore.                                                   |
| **Statut** | Indique si le chemin d'accès à l'exécutable est valide et accessible.                 |

**Flux de travail : **
1. Installez le fichier binaire Exomizer :
   - **Windows:** Téléchargez le fichier précompilé `win32/exomizer.exe` depuis
     https://bitbucket.org/magli143/exomizer/wiki/Home ou
     https://csdb.dk/release/?id=244342.
   - **macOS:** `brew install exomizer` (installe la version officielle 3.1.2 de
     Magnus Lind).
2. Configurez le chemin dans **Paramètres matériels → section Exomizer**.
3. Activez la case à cocher **Exécuter avec Exomizer** dans le menu
   **Paramètres**.
4. Toutes les actions **Run** (PRG, D64, matériel) et **Build** (Build PRG,
   Build D64) vont désormais traiter le programme assemblé via `exomizer sfx
   sys` avant de le lancer ou de l'enregistrer.

Exomizer fonctionne de la même manière sous Windows et macOS : l’interface de
ligne de commande est invoquée depuis le serveur Tauri ; l’intégration n’a rien
de spécifique à une plateforme.

**Deux modes de compression sont utilisés en interne :**

| Mode               | Utilisé par                                                    | Convention d'appel                                                                                                                                                                                     |
| ------------------ | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `sfx sys`          | Compiler/Exécuter avec bascule Exomizer (chemin PRG principal) | PRG auto-extractible avec décruncher intégré ; le réglage Border-flash contrôle `-x1` vs `-n`                                                                                                          |
| `mem` (à l'envers) | Exécuter via D64 → case à cocher par fichier **EXO**           | Compresse chaque fichier supplémentaire en un flux en mode `mem` ; le programme le décompresse à l'exécution via la macro **EXODECRUNCH** et un décompresseur pré-compilé (`samples/exo-decrunch.bin`) |

> **Conseil : ** Si le chemin d’accès à Exomizer n’est pas configuré mais que la
> case est cochée, un message d’erreur s’affiche au lieu de lancer
> l’application. Décochez la case pour exécuter l’application sans compression.

> **Test d'intégration : ** `Test de cargaison --test exomizer_integration`
> (dans `src-tauri/`) vérifie l'aller-retour complet de compression +
> décompression en mode mémoire sur un émulateur 6502.

### Navigateur de ROM de caractères C64 (« Carte des caractères »)

| Paramètre                    | Description                                                                                                                                                                                                             |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Deux ensembles de caractères | Onglet 1 : **Set 1 — Supérieur/Graphique** (mode par défaut après la mise sous tension). Onglet 2 : **Set 2 — Inférieur/Supérieur** (après le commutateur `$0E`).                                                       |
| **Statut**                   | Grille 16×16 des 256 caractères. Cliquez sur un glyphe pour afficher son panneau de détails : vue zoomée 8×8 pixels, code écran (décimal + hexadécimal), codes PETSCII (par défaut et décalés) et bitmap brut 8 octets. |

Visionneuse en lecture seule de la ROM de caractères du C64 (police PETSCII
intégrée). S'ouvre via l'entrée **C64 chargen** du menu Toolkit. Utile pour
trouver le code écran d'un glyphe avant de l'écrire avec `RAWBYTES` ou `TEXT`.

### Éditeur de caractères (Charset)

Éditeur de caractères 8×8 de 256 caractères. Ouvrir via Outils → Éditeur de
caractères.

| Paramètre            | Description                                                                                                       |
| -------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Charger la ROM       | Importe le jeu de caractères ROM C64 directement depuis `chargen` de VICE (pas de sélecteur de fichiers).         |
| Charger `.bin`       | Importe un binaire externe avec un jeu de caractères de 2048 octets.                                              |
| Aperçu par caractère | Grille de 16 cases de large contenant l'ensemble des 256 glyphes, la cellule actuelle étant mise en surbrillance. |

**Flux de travail : **
1. Connectez le 1541 Ultimate / Ultimate 64 à votre réseau local.
2. Saisissez son adresse IP (et le mot de passe s'il en a un) dans les
   paramètres matériels.
3. Sélectionnez **Exécuter sur le matériel** dans le menu d'exécution
   fractionnée.
4. Cliquez sur **▶ Exécuter** — le fichier PRG est compilé et envoyé à
   l'appareil via une requête HTTP POST à `/v3/runners/prg`. L'appareil le
   charge et l'exécute immédiatement sur le C64.

> **Conseil : ** Aucun câble USB ni pilote n’est nécessaire — l’API REST est
> intégrée au firmware Ultimate. Votre ordinateur et l’appareil doivent être
> connectés au même réseau local.

### Éditeur de canevas de caractères

Outil de création d'écrans à partir d'un jeu de caractères complet de 256
caractères. Accès via Outils → Canevas de jeu de caractères.

La zone de travail est de 16×16 caractères. En mode monochrome, cela donne une
zone de travail de 128×128 pixels ; en mode caractères multicolores, cela donne
une zone de travail de 64×128 pixels larges en utilisant les règles de couleurs
multicolores réelles du C64.
- un Commodore 64 / C128 avec une cartouche **Kung Fu Flash 2** installée,
  allumé ;
- **Firmware Kung Fu Flash v2.07 ou plus récent** sur la cartouche — les
  versions de firmware antérieures ne prennent pas en charge le protocole de
  téléchargement utilisé par Visual Assembler. Versions du firmware :
  <https://codeberg.org/KimJorgensen/KungFuFlash2/releases/> ;
- un câble USB **** reliant la cartouche à l'ordinateur exécutant Visual
  Assembler (il apparaît comme un port série virtuel).

| Paramètre          | Description                                                                                                                                                                                           |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mono / multicolore | Le mode monochrome stocke des glyphes 8×8 sur 1 bit. Le mode multicolore stocke des paires de pixels horizontaux sur 2 bits et marque les cellules utilisées avec le bit 3 de la mémoire RAM couleur. |

**Flux de travail : **
1. Insérez la carte Kung Fu Flash 2 dans le port cartouche du C64, allumez
   l'ordinateur et branchez le câble USB à votre PC/Mac.
2. Ouvrez **Paramètres matériels** et vérifiez la section **Kung Fu Flash 2** —
   le port devrait déjà être renseigné.
3. Sélectionnez **Kung Fu Flash 2** dans le menu d'exécution fractionnée (le
   choix est mémorisé et est également stocké dans les fichiers de projet).
4. Cliquez sur **▶ Exécuter **. Le programme est compilé, la cartouche redémarre
   sur son chargeur de menu (une brève connexion à 1200 bauds via le port
   série), une brève synchronisation a lieu et le fichier PRG est transféré. Une
   fois le transfert terminé, le programme s'exécute sur la machine.

Fonctionne de la même manière en mode **Block**, **Expert** et **Ultimate
Basic** ; les programmes Ultimate Basic sont compilés à partir du fichier de
démarrage du projet.

> **Limites et vérifications : ** Le PRG doit contenir l’adresse de chargement
> de deux octets plus au moins un octet de données, doit tenir dans l’espace
> d’adressage de 64 Kio du C64 et ne doit pas dépasser la taille acceptée par le
> chargeur de la cartouche. Les échecs (port non configuré, port impossible à
> ouvrir, cartouche ne revenant pas du MENU ou chargement refusé) sont signalés
> par une notification indiquant la raison exacte.

> **Conseil :** si vous préférez une image de cartouche plutôt qu’un
> téléchargement en direct, **Build CRT** (Magic Desk 64K) fonctionne également
> sur Kung Fu Flash — voir [Section
> 12b](#12b-crt-export-magic-desk-64k-cartridge).

---

---

### Contrôle de version (git)

| Paramètre                                                         | Description                                                                                                                                                                                |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Entrées de sauvegarde automatique dans le contrôle de version** | Ajoute une entrée de sauvegarde automatique à l'historique des versions environ 2,5 s après l'arrêt de la modification (également pour les onglets de projet dans l'historique du projet). |
| **Choisissez git.exe…**                                           | Accédez au fichier exécutable `git` (`git.exe` sous Windows)                                                                                                                               |
| **Détection automatique**                                         | Efface le chemin sélectionné et effectue une recherche dans le PATH et les dossiers d'installation habituels.                                                                              |
| **Utilisez Git lorsque le projet se trouve dans un dépôt**        | Ouvre la boîte de dialogue de contrôle de version en mode Git pour les fichiers d'un dépôt Git                                                                                             |
| **Statut**                                                        | Affiche la version de git, ou indique que git est introuvable (le système de contrôle de version intégré fonctionne toujours).                                                             |

## 14. Éditeurs visuels (boîte à outils)

Le menu de la barre d'outils **Toolkit** regroupe les éditeurs de données
visuelles qui partagent tous un menu Fichiers commun (`Fichiers ▾`) pour Charger
BIN / Enregistrer BIN / Exporter vers des blocs / Enregistrer sur D64. Chaque
éditeur produit des données brutes `.bin` qui peuvent être placées dans un
programme avec `INCBIN`, ou ajoutées directement à un disque D64 via l'entrée
**Enregistrer sur D64**.

Les boîtes de dialogue de l'éditeur visuel peuvent être déplacées par leur
en-tête dans tout l'espace de travail de Visual Assembler. Une boîte de dialogue
sans position enregistrée s'ouvre centrée ; après déplacement, sa dernière
position est enregistrée dans les paramètres d'interface utilisateur et
restaurée lors de sa prochaine ouverture.

### Éditeur haute résolution/multicolore

Éditeur d'images bitmap au niveau du pixel, avec modes haute résolution 320×200
et multicolore 160×200. Ouvrir via Outils → Éditeur haute résolution.

| Fonctionnalité                       | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Basculement du mode                  | **Multicolore** La case à cocher permet de basculer entre haute résolution (mono par cellule) et multicolore (4 couleurs par cellule).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Outils                               | Crayon, gomme, ligne, rectangle, rectangle rempli, ovale, ovale rempli, remplissage, papier à cellules, sélectionner.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Papier cellulaire (haute résolution) | En haute résolution, deux couleurs sont autorisées dans chaque cellule 8×8 : l’encre (pixels définis, octet de poids fort de la mémoire RAM de la cellule) et le papier (pixels effacés, octet de poids faible). L’outil **Papier de cellule** applique la couleur du papier à chaque cellule survolée ; **PAPER** applique la couleur à toutes les cellules simultanément. La gomme efface les pixels pour afficher le papier de la cellule. Cette fonction est désactivée en mode multicolore, lorsque l’arrière-plan ($D021) est partagé.                                                                                                                                                               |
| Outil de pulvérisation               | Outil de peinture de type aérographe qui disperse des pixels autour du curseur pendant le dessin.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| intensité de pulvérisation           | Le menu déroulant situé à côté de l'outil de pulvérisation permet de contrôler la densité de chaque coup de pulvérisation.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| palette de couleurs                  | Sélecteurs de premier plan (encre) + papier (arrière-plan). Le mode multicolore suit automatiquement 3 éléments supplémentaires par cellule.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Annuler / Rétablir                   | Historique par AVC, ctrl-Z / ctrl-Y.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Sélectionner                         | L'outil carré pointillé : faites glisser le curseur sur la zone de travail pour marquer une zone rectangulaire. **Échap** efface la sélection.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Copier/Coller                        | Copier (Ctrl/Cmd+C) copie la zone sélectionnée. Coller (Ctrl/Cmd+V) affiche un aperçu suivant le curseur : cliquez sur la zone de travail pour placer l’élément, Échap annule. La copie est conservée ; vous pouvez donc la coller autant de fois que nécessaire en appuyant sur Ctrl/Cmd+V puis en cliquant à nouveau. En mode haute résolution, les pixels collés restent limités à deux couleurs par cellule ; alignez donc la zone avec la grille pour conserver ses couleurs. Les options Copier, Coller et Collage transparent sont également disponibles dans le menu contextuel (clic droit) de la zone de travail ; un collage effectué à partir de ce menu affiche un aperçu à l’endroit cliqué. |
| Pâte transparente                    | `Ctrl/Cmd+Shift+V` (ou son bouton de barre d'outils) ignore les pixels de couleur papier de la copie, de sorte que l'image en dessous apparaît.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Grille + Raster                      | **Grille** affiche la grille de cellules de caractères : 8×8 pixels en haute résolution, 4×8 pixels double largeur en multicolore. À partir d’un zoom 4×, un contour plus fin est tracé autour de chaque pixel, permettant un positionnement précis. **Raster** ajoute une superposition de lignes raster.                                                                                                                                                                                                                                                                                                                                                                                                 |
| Zoom                                 | Curseur de 1× à 16×.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Importer une image                   | Les fichiers PNG/JPEG/GIF déposés sur le canevas sont automatiquement convertis en une palette de 16 couleurs C64.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Blocs d'exportation                  | Ajoute des blocs BYTE/RAWBYTES au programme avec les données bitmap, d'écran et de couleur encodées.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Exporter `.bin`                      | Enregistre le format multicolore natif (10000 octets : 8000 bitmap + 1000 écran + 1000 couleur) prêt pour LOADFILE à $2000.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |

### Éditeur de sprites

Éditeur de sprites 24×21 pixels avec animation multi-images. Ouvrir via Outils →
Éditeur de sprites.

| Fonctionnalité                     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cadres                             | Ajouter / supprimer / réorganiser les cadres ; la barre de cadres est affichée en bas. **Copier** / **Coller** dans la rangée de cadres copie l'image courante entière ; ces deux mêmes options sont disponibles dans le menu contextuel (clic droit) du canevas et de la barre de cadres.                                                                                                                                                                                                                                                        |
| Mode                               | Basculement monochrome/multicolore.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Outils                             | Crayon, remplissage, ligne, rectangle, cercle — plus symétrie horizontale, symétrie verticale, décalage gauche/droite/haut/bas (avec option de retour à la ligne). Les outils de forme affichent un aperçu en direct pendant le déplacement ; relâchez pour valider.                                                                                                                                                                                                                                                                              |
| Annuler / Rétablir                 | Historique complet des actions d'annulation/rétablissement par image. Ctrl/Cmd+Z / Ctrl/Cmd+Y ou les boutons de la barre d'outils.                                                                                                                                                                                                                                                                                                                                                                                                                |
| Importation d'images               | Importez une image PNG ou JPEG via Fichiers → Importer une image. L'outil d'importation associe chaque pixel à la couleur de la palette C64 la plus proche et l'inscrit dans l'image courante.                                                                                                                                                                                                                                                                                                                                                    |
| Aperçu de l'animation              | Lecture/Arrêt à vitesse configurable.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Blocs d'exportation                | Insère un bloc RAWBYTES à une adresse alignée sur 64 octets pour chaque image, ainsi qu'une configuration de pointeur de sprite.                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Enregistrer `.bin`                 | Écrit 64 octets par image (données brutes du sprite sans remplissage).                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Sélection                          | **Sélectionner / Déplacer** : tracez un rectangle, puis faites glisser le curseur à l’intérieur pour déplacer les pixels (les pixels vides sont transparents) ; les flèches directionnelles permettent de déplacer la sélection d’un pixel (deux en multicolore), Suppr efface la sélection et Échap la supprime. **Rotation de 90°** (dans les deux sens) : fait pivoter la sélection ou l’ensemble du cadre. Les fonctions de sélection, de retournement, de décalage et de rotation s’appliquent simultanément au corps et à la superposition. |
| Superposition haute résolution     | **Superposition haute résolution** ajoute un second sprite haute résolution monochrome sur chaque image — le contour classique sur un corps multicolore. La liste **Calque** sélectionne le calque modifié ; la superposition est atténuée pendant la modification du corps. Sur C64, il s'agit d'un sprite distinct : attribuez-lui un numéro de sprite inférieur à celui du corps. `.bin` et **Copier les octets** écrivent les sprites de superposition après celui du corps (`sprite_f1_ov_1`).                                               |
| Miroir tout                        | Ajoute une copie symétrique horizontalement de chaque image (et de sa hitbox) — un cycle de marche dans l'autre sens en un seul clic.                                                                                                                                                                                                                                                                                                                                                                                                             |
| Importation de feuilles de sprites | Fichiers → **Importer une feuille de sprites…** : la largeur/hauteur des cellules, le décalage, l’espacement et le nombre d’images découpent l’image en images de la taille actuelle (les cellules multicolores sont mises à l’échelle à 12 pixels par sprite). Les couleurs proviennent de l’image ou restent celles du sprite ; correspondance OKLab sans tramage, tramage ordonné (Bayer) ou tramage Floyd-Steinberg. Remplace les images ou les complète.                                                                                     |
| Hitbox                             | L'outil **Hitbox** trace un rectangle par image (en pointillés cyan) ; les options **Fit**, **Fit every frame**, **Copy to every frame** et **Remove** sont disponibles dans le panneau latéral. Fichiers → **Copy hitbox table** renvoie `sprite_hit_x / _y / _w / _h` (un octet par image, en pixels depuis le coin supérieur gauche) ; une image sans hitbox utilise ses limites en pixels.                                                                                                                                                    |
| X / Y ×2                           | Affiche l'aperçu comme avec l'expansion de sprite `$D01D` / `$D017`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |

L'option **Exporter vers UltimateBasic** (menu Fichiers) enregistre chaque image
(jusqu'à 8) sous forme de `sprdef`, configure le sprite 0 (couleur, multicolore,
agrandissement) et, pour une animation, ajoute une boucle synchronisée au raster
qui fait défiler les images à la fréquence d'images de l'éditeur. En mode
Ultimate Basic, le fichier est inséré à l'emplacement du curseur ; sinon, il est
copié dans le presse-papiers.

### Navigateur de ROM de caractères C64 (« Carte des caractères »)

Visionneuse en lecture seule de la ROM de caractères du C64 (police PETSCII
intégrée). S'ouvre via l'entrée **C64 chargen** du menu Toolkit. Utile pour
trouver le code écran d'un glyphe avant de l'écrire avec `RAWBYTES` ou `TEXT`.

| Fonctionnalité               | Description                                                                                                                                                                                                             |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Deux ensembles de caractères | Onglet 1 : **Set 1 — Supérieur/Graphique** (mode par défaut après la mise sous tension). Onglet 2 : **Set 2 — Inférieur/Supérieur** (après le commutateur `$0E`).                                                       |
| Grille de glyphes            | Grille 16×16 des 256 caractères. Cliquez sur un glyphe pour afficher son panneau de détails : vue zoomée 8×8 pixels, code écran (décimal + hexadécimal), codes PETSCII (par défaut et décalés) et bitmap brut 8 octets. |
| Panneau de détail            | Affiche le code écran du glyphe sélectionné, les codes PETSCII et les huit octets bruts — prêts à être collés dans un bloc `RAWBYTES` ou BYTE.                                                                          |
| Lecture seule                | Aucune modification ici — utilisez l'éditeur de caractères (ci-dessous) pour modifier les glyphes.                                                                                                                      |

### Éditeur de caractères (Charset)

Éditeur de caractères 8×8 de 256 caractères. Ouvrir via Outils → Éditeur de
caractères.

| Fonctionnalité           | Description                                                                                                                                                                                                                                                                         |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Charger la ROM           | Charge la ROM de caractères C64 — les glyphes exacts 901225-01, sans sélecteur de fichiers. Le premier bouton (et **Fichiers → ROM : majuscules / graphismes**) charge le jeu 1, le deuxième bouton (ou Maj+clic, ou **Fichiers → ROM : minuscules / majuscules**) charge le jeu 2. |
| Charger `.bin`           | Importe un binaire externe avec un jeu de caractères de 2048 octets.                                                                                                                                                                                                                |
| Aperçu par caractère     | Grille de 16 cases de large contenant l'ensemble des 256 glyphes, la cellule actuelle étant mise en surbrillance.                                                                                                                                                                   |
| Éditeur de pixels        | Modifie le caractère sélectionné, ou une **tuile** de 2×1, 1×2 ou 2×2 caractères voisins comme une seule image (sélecteur de tuiles).                                                                                                                                               |
| Outils de dessin         | Crayon, ligne, rectangle, rectangle plein et remplissage. Un clic sur un pixel déjà encré l'efface.                                                                                                                                                                                 |
| Transforme               | Effacer, inverser, retourner horizontalement/verticalement, décaler avec retour en arrière, faire pivoter de 90° dans le sens horaire/antihoraire (carreaux carrés uniquement) — sur la tuile entière.                                                                              |
| Annuler / Rétablir       | Boutons de la barre d'outils, Ctrl+Z et Ctrl+Y (Ctrl+Maj+Z).                                                                                                                                                                                                                        |
| Copier/Coller            | Boutons de la barre d'outils, Ctrl+C / Ctrl+V ou clic droit sur la carte ; copie la tuile entière avec ses couleurs.                                                                                                                                                                |
| glisser la carte         | Faites glisser un personnage sur un autre sur la carte pour les échanger ; Maj + glisser pour copier.                                                                                                                                                                               |
| Aperçu du texte          | Saisissez du texte pour l'afficher dans l'encodage de caractères actuel. Choisissez la correspondance entre majuscules et minuscules ; `{65}` ou `{$41}` insère un code d'écran.                                                                                                    |
| Exportation de gamme     | Définissez les caractères De / À, puis **Fichiers → Enregistrer la plage (.bin)** (octets bruts) ou **Copier la plage ASM** (`.byte` lignes).                                                                                                                                       |
| Couleur par personnage   | Stocke une valeur de mémoire RAM couleur par défaut pour chaque glyphe. En mode caractères multicolores, cela préserve également le bit d'activation multicolore par cellule et la couleur des 3 bits de poids faible du caractère.                                                 |
| Métadonnées aller-retour | Lors du chargement de données compatibles à partir de flux de travail Charset Canvas / Map, les métadonnées de couleur par caractère sont préservées afin que les modifications puissent se poursuivre sans perte d'intention de couleur.                                           |
| Blocs d'exportation      | Ajoute RAWBYTES à $0800 (bloc 2) ou $3800 (bloc 7) avec le jeu de caractères encodé.                                                                                                                                                                                                |

### Éditeur de canevas de caractères

Outil de création d'écrans à partir d'un jeu de caractères complet de 256
caractères. Accès via Outils → Canevas de jeu de caractères.

La zone de texte mesure 16×16 caractères, soit 128×128 pixels. En mode
caractères multicolores, chaque caractère est soit multicolore (pixels larges, 4
couleurs), soit haute résolution (8 pixels étroits, 2 couleurs), exactement
comme sur le C64.

| Fonctionnalité                                  | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |                                                             |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Mono / multicolore                              | Le mode monochrome stocke des glyphes 8×8 sur 1 bit. Le mode multicolore stocke des paires de pixels horizontaux sur 2 bits et marque les cellules multicolores avec le bit 3 de la mémoire RAM couleur.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |                                                             |
| Outil du mode personnage                        | En mode multicolore, cliquez ou faites glisser le curseur sur les caractères pour basculer entre le mode multicolore et le mode haute résolution (bit 3 de la mémoire RAM couleur). La forme est conservée : une paire de pixels définie prend la couleur propre au caractère. Un caractère haute résolution possède un fond et sa propre couleur (0 à 7) ; les touches MC1 et MC2 ne sont pas utilisées pour le rendu à cet endroit.                                                                                                                                                                                                                                                                           |                                                             |
| Arrière-plan                                    | Le menu déroulant BG est également affiché en mode monochrome ; MC1 / MC2 uniquement en mode multicolore.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |                                                             |
| ECM                                             | La case à cocher **ECM** (mode couleur étendu, non combiné avec le mode multicolore) : chaque caractère est en haute résolution avec sa propre couleur (0 à 15) et l’un des quatre arrière-plans BG0 à BG3 (`$D021` à `$D024` ; BG1 et BG2 correspondent aux registres MC1 et MC2). Choisissez une couleur d’arrière-plan dans la palette (étiquetées B0 à B3), puis cliquez ou faites glisser le curseur sur les caractères avec l’outil **Arrière-plan des caractères**. Seuls 64 caractères différents peuvent être affichés : la barre d’état les compte et la sauvegarde fusionne les caractères identiques. Le jeu de caractères est de 64 caractères (512 octets) et les codes d’écran sont des glyphes. | arrière-plan << 6`. Activez l'ECM avec le bit 6 de `$D011`. |
| Modèle couleur C64                              | L'arrière-plan utilise `$D021` ; la couleur multicolore partagée 1 utilise `$D022` ; la couleur multicolore partagée 2 utilise `$D023` ; la couleur propre de chaque caractère provient des bits 0 à 2 de la mémoire RAM couleur.                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |                                                             |
| Outils de dessin                                | Le crayon, la gomme, la ligne, le rectangle, l'ovale et le remplissage fonctionnent au-delà des limites des caractères.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |                                                             |
| Outil de pulvérisation                          | Dessin de style aérographe qui disperse les pixels sur les cellules/caractères voisins.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |                                                             |
| intensité de pulvérisation                      | Le menu déroulant situé à côté de l'outil de pulvérisation permet de régler la densité du trait.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |                                                             |
| Basculer la grille                              | La case à cocher Grille affiche ou masque la grille de caractères 16×16.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |                                                             |
| Zoom                                            | Utilisez le curseur de zoom (2× à 24×, nombre de pixels de l'appareil par pixel C64) ou Ctrl + molette sur la zone de travail ; le niveau de zoom est mémorisé. À partir de 8×, la grille trace également un trait fin sur chaque bord de pixel.                                                                                                                                                                                                                                                                                                                                                                                                                                                                |                                                             |
| Enregistrer le jeu de caractères `.bin`         | Enregistre les données bitmap de caractères de 2048 octets.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |                                                             |
| Sauvegarder la carte 16×16 + RAM couleur `.bin` | Enregistre 256 codes d'écran suivis de 256 valeurs de RAM couleur. À utiliser avec `MAP_COPY16X16`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |                                                             |
| Chargement                                      | Peut charger les sauvegardes charset-canvas, les données charset simples et les données charset compatibles de l'éditeur de caractères, y compris les couleurs enregistrées par caractère lorsqu'elles sont présentes.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |                                                             |

Limitation importante du C64 : en mode caractères multicolores, les deux
couleurs partagées sont globales pour tout l’écran ($D022 / $D023). Seule la
couleur propre au caractère est définie par cellule, et elle est limitée aux
couleurs 0 à 7 car le bit 3 de la mémoire RAM couleur sélectionne le mode
multicolore. Ainsi, un caractère affiche au maximum 4 couleurs (arrière-plan,
MC1, MC2 et sa propre couleur), et l’écran entier au maximum 3 + 8. Dans la
palette, les couleurs partagées sont étiquetées BG / 1 / 2, et les couleurs 8 à
15 qui ne sont pas partagées sont atténuées. Sélectionner une telle couleur la
place dans MC2 ou MC1 uniquement tant qu’aucun pixel n’utilise ce registre ;
sinon, la modifier dans son menu déroulant (ce qui recolore tout l’écran). En
mode haute résolution (mono), un caractère a 2 couleurs : l'arrière-plan et sa
propre couleur (0–15).

### Éditeur de cartes (cartes de tuiles multicouches)

Éditeur de cartes de tuiles multicouches pour les décors statiques, les cartes
d'apparition de sprites, les données de collision, etc. Ouvrir via Outils →
Éditeur de cartes.

| Fonctionnalité                                         | Description                                                                                                                                                                                                                                                                                                               |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Couches                                                | Plusieurs calques nommés, chacun avec son propre ensemble de tuiles et son opacité.                                                                                                                                                                                                                                       |
| pinceaux                                               | Modes d'utilisation : tuile unique, remplissage, ligne, rectangle et cercle. Les outils de forme affichent un aperçu en direct pendant le déplacement ; relâchez pour valider.                                                                                                                                            |
| Annuler / Rétablir                                     | Historique complet des actions Annuler/Rétablir par calque. Ctrl/Cmd+Z / Ctrl/Cmd+Y ou les boutons de la barre d'outils.                                                                                                                                                                                                  |
| Effacer le menu                                        | Effacement par couche ou de la carte entière avec confirmation.                                                                                                                                                                                                                                                           |
| Importation d'images                                   | Déposez une image PNG d'une carte de tuiles ; l'éditeur la découpe automatiquement en tuiles.                                                                                                                                                                                                                             |
| Copier/coller                                          | Copiez une zone de tuiles sélectionnée, puis collez-la normalement ou utilisez le collage transparent pour conserver la transparence des tuiles vides. Ces mêmes options sont disponibles dans le menu contextuel (clic droit) de la zone de dessin.                                                                      |
| Coloration des carreaux prenant en compte les couleurs | Avec des métadonnées de jeu de caractères compatibles, le rendu utilise les valeurs par défaut de la mémoire RAM couleur stockée de la tuile (y compris l'encodage lié aux couleurs multiples) au lieu d'une couleur unie générique.                                                                                      |
| Couleurs de caractères personnalisées                  | Lorsqu'un jeu de caractères contient des métadonnées `charColors`, l'éditeur de carte utilise la valeur de couleur RAM par défaut de la tuile sélectionnée lors du rendu.                                                                                                                                                 |
| Blocs d'exportation                                    | Émet des blocs RAWBYTES pour les graphismes de tuiles et les données de carte.                                                                                                                                                                                                                                            |
| Sauvegarder la RAM de l'écran (.bin)…                  | Enregistre uniquement les codes d'écran pour la couche de carte actuelle (40×25 = 1000 octets).                                                                                                                                                                                                                           |
| Sauvegarder la RAM écran + la RAM couleur (.bin)…      | Enregistre les codes d'écran concaténés aux valeurs de la mémoire RAM couleur dans un seul fichier de 2 000 octets (`screen[0..999]` suivi de `color[0..999]`). Utilisez-le avec la macro **MAP_COPY** (mode .bin combiné) pour restaurer simultanément l'écran et la couleur en une seule opération lors de l'exécution. |

### Éditeur de niveaux

Organise les écrans de l'éditeur de cartes en un seul niveau (jeu de tir
vertical, jeu de voiture à défilement vertical, jeu de plateforme ou carte 2D)
et affiche un aperçu complet du niveau avec un défilement fluide. Ouvrez-le avec
le bouton de la barre d'outils Éditeur de niveaux situé à côté de l'éditeur de
cartes.

| Fonctionnalité          | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mise en page            | **Vertical**, **Horizontal** ou **Grille** (lignes × colonnes, avec boutons d'ajout/suppression de lignes et de colonnes).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Écrans                  | **Nouvel écran vide**, **Ajouter depuis l'éditeur de cartes** (la carte actuellement ouverte) ou **Charger une ou plusieurs cartes (.bin)…** (plusieurs exportations de l'éditeur de cartes simultanément). Faites glisser un écran de la liste vers un emplacement ; faites glisser les emplacements les uns sur les autres pour les permuter.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Édition                 | **Modifier dans l'éditeur de carte** ouvre l'écran sélectionné dans l'éditeur de carte et ramène les modifications ; dupliquer, déplacer vers le haut/la gauche ou vers le bas/la droite, supprimer ; annuler / rétablir.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Aperçu                  | Faites glisser l'aperçu ou utilisez les touches fléchées pour faire défiler pixel par pixel ; **Lecture** défile automatiquement (direction, vitesse 1 à 8, boucle), Espace = lecture/arrêt. *Bordures* marque les limites de l'écran.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Vérifications           | Informations sur l'encodage des caractères et un avertissement lorsque les écrans utilisent un encodage ou des couleurs différents (le niveau utilise les paramètres du premier écran).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Attributs de personnage | Le bouton **Attributs de personnage** permet de basculer l'aperçu vers la peinture d'attributs : sélectionnez **Solide**, **Échelle**, **Danger** ou **Objet à collectionner**, cliquez sur un personnage et chaque cellule ayant ce code d'écran l'obtient (ou le perd) ; faites glisser pour ajouter d'autres codes. Les attributs s'affichent sous forme de calque coloré et deviennent la table `LEVEL_ATTR` de 256 octets (`LEVEL_ATTR_SOLID` = 1, `_LADDER` = 2, `_HAZARD` = 4, `_COLLECT` = 8).                                                                                                                                                                                                                                                                                                                                                                 |
| Vérification des bords  | Les marques rouges indiquent les discontinuités entre les écrans voisins : un côté de la bordure est vide (espace) et l’autre non, ou un seul côté est plein. Le panneau latéral compte les bords et les cellules.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Couleurs                | ** Bordure de niveau** et ** Couleurs propres à cet écran** (arrière-plan, bordure, multicolore 1/2) pour l'écran sélectionné ; la fenêtre d'aperçu affiche la bordure. Exporté par emplacement sous la forme `LEVEL_SCR_BG / _BORDER / _MC1 / _MC2` (avec `LEVEL_SCR_COLORS` = 1) lorsqu'un écran placé possède ses propres couleurs.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Mémoire                 | La taille des données `.level` à une adresse choisie (calculée exactement comme la macro la construit), avec des avertissements pour la ROM BASIC / KERNAL, la zone d'E/S et la mémoire sous `$0800`, et la taille RLE du niveau. **Exporter RLE vers des blocs / Copier l'assembleur RLE** donne le RLE du niveau compressé avec le décompresseur `level_unrle` (`($FB)` → `($FD)`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Courir dans VICE        | Construit un programme de test à défilement par joystick à partir du niveau (le défileur `level-demo`, code à `$C000`, données de niveau à partir de `$2000`, jeu de caractères personnalisé à `$2000`) et le lance dans VICE — les couleurs de l'écran changent avec l'écran en haut à gauche de la vue, la caméra démarre au premier objet Start.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Objets                  | Le bouton **Calque d'objets** permet de basculer l'aperçu vers l'édition d'objets : choisissez un type (Départ, Ennemi, Objet, Porte, Sortie, Déclencheur) et un octet **Param** (type d'ennemi, ID d'objet, cible de porte…), cliquez pour placer, faites glisser pour déplacer (alignement sur 8 px, Maj = libre), cliquez sur un objet pour le sélectionner et modifier son type/paramètre, les flèches directionnelles permettent de le déplacer, Suppr permet de le supprimer. Les objets sont liés à la position du niveau, et non à l'écran. Ils sont listés dans la barre latérale, affichés dans l'aperçu, enregistrés avec le niveau et exportés dans l'ordre de défilement (verticalement par Y, horizontalement par X, ligne par ligne de la grille) sous forme de tables `LEVEL_OBJ_*` — via **Copier asm / Exporter en blocs** et via la macro `.level`. |

**Menu Fichiers : **
| Action                                                                                | Ce que cela fait                                                                                                                                           |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Nouveau niveau** / **Ouvrir le niveau (.bin)…** / **Sauvegarder le niveau (.bin)…** | Le projet de niveau : tous les écrans ainsi que la mise en page. Il s'agit du fichier lu par la macro `.level` et la fonction `map load` d'Ultimate Basic. |
| **Sauvegarde du niveau RAM écran (.bin)…**                                            | Le niveau entier sous forme d'une seule carte de personnages (codes d'écran uniquement).                                                                   |
| **Sauvegarde du niveau Écran + RAM couleur (.bin)…**                                  | Les codes d'affichage de l'ensemble du niveau, suivis de ses couleurs.                                                                                     |
| **Exporter vers des blocs** / **Copier l'assembleur**                                 | Les données de niveau sous forme de blocs ou de texte asm (presse-papiers).                                                                                |

**Utilisation du niveau :** dans l'assembleur, `.level "level.bin"` +
`.level_row` (voir [LEVEL / LEVEL_ROW](#level--level_row) et
`samples/level-demo.asm`) ; dans Ultimate Basic 1.6.1+, `map load "level.bin",
$4000` et `map view px, py` (exemple `level_scroll_demo.ub`).

### Éditeur SID (Traqueur à 3 voix)

Tracker multi-instrumental à 3 voix. Ouverture via Toolkit → Éditeur SID.
**Lecture : Tout** exécute le lecteur 6502 exporté dans l’émulateur WebSID ;
toutes les autres prévisualisations (prévisualisation d’instrument, clavier
virtuel, saisie de notes, accords/arpèges, lecture de lignes et de motifs
uniques) sont également jouées sur le SID émulé : un modèle JS du même lecteur
(image par image) transmet ses registres SID à WebSID à chaque image, et jusqu’à
trois notes de prévisualisation partagent les trois voix. Le lecteur de flux est
chargé à l’ouverture de l’éditeur et à nouveau après l’arrêt, de sorte que les
notes sonnent simultanément ; sans WebSID, un petit synthétiseur SID est
utilisé.

**Moteur de prévisualisation : ** **Paramètres → Prévisualisation SID ** permet
de sélectionner **WebSID ** ou **VA SID Core (Rust) **, l’émulation SID intégrée
à l’application ; avec VA SID Core, vous pouvez également choisir la puce (MOS
6581 / 8580). Les paramètres de l’instrument sont réglés à l’aide de
potentiomètres.

**Commandes par instrument :**
- Cases à cocher de forme d'onde (TRI / SAW / PUL / NOI) — plusieurs formes
  d'onde sont combinées par ET comme sur le SID — plus **RING** (modulation en
  anneau du triangle par la voix précédente : 1 ← 3, 2 ← 1, 3 ← 2) et **SYNC**
  (synchronisation dure avec la voix précédente).
- ADSR (attaque / déclin / maintien / relâchement) représenté sous forme de
  graphique glissant au-dessus des quatre curseurs.
- Curseur de largeur d'impulsion (0-4095).
- **Filtre : ** *Acheminer cette voix à travers le filtre *,
  passe-bas/passe-haut et **3 OFF ** (couper le son de la voix 3 lorsqu'elle
  n'est pas routée), fréquence de coupure, résonance, volume. **Fin ** +
  **Balayage ** : déplacer la fréquence de coupure de Cut vers End par balayage
  à chaque image ; **Ping-pong ** : rebondir entre les deux — c'est ce qui crée
  les balayages de filtre résonants. La voix qui lance un instrument routé vers
  le filtre contrôle ce dernier (fréquence de coupure, résonance, mode) ; chaque
  voix dont l'instrument est routé le traverse.
- **Vibrato:** après **Délai** images un LFO triangulaire qui tourne toutes les
  **Vitesse** images, **Profondeur** 0-15 mis à l'échelle au demi-ton de la note
  (indépendamment de l'effet `V`).
- **Modulation de largeur d'impulsion : ** **Vitesse ** ajoutée à la largeur
  d'impulsion à chaque image, oscillant entre **Min ** et **Max **.
- **Gate:** **Gate timer** libère la porte ce nombre d'images avant la prochaine
  note sur la voix (gardez-le en dessous de la vitesse); **Hard restart** met
  également l'ADSR à zéro, pour une attaque propre; **First frame** écrit une
  forme d'onde sur la première image de la note (par exemple `$09` test +
  porte).
- **Tableau d'ondes/arpèges : ** jusqu'à 32 pas de forme d'onde (— = conserver)
  et de note (décalage en demi-tons, ou **abs** = note absolue), un pas toutes
  les **Vitesse** images, **Boucle** retour au pas précédent ou arrêt sur le
  dernier. **Préréglages** (25, en groupes ; la liste conserve le préréglage
  choisi jusqu'à ce que le tableau soit modifié manuellement) : arpèges (majeur,
  mineur, accords de septième, sus4, diminué, augmenté, power chord, octave,
  trille), batterie (grosse caisse, caisse claire, tom, clap, charleston
  fermé/ouvert), attaques de lead et de basse, et effets sonores (laser, micro,
  explosion).

**Grille de suivi : **
- 3 voix × jusqu'à 7 motifs × 32 lignes = 7 × 32 = 224 lignes max (le compteur
  de lignes 8 bits le limite).
- Par ligne : note + index de l’instrument, plus un effet optionnel (voir la
  colonne Effet ci-dessous). Les lignes vides contiennent la note précédente :
  comme dans d’autres trackers (GoatTracker, SID-Wizard), une note conserve son
  niveau de sustain jusqu’à la note suivante de cette voix ou jusqu’à l’arrêt de
  la note.
- **Entrée** (ou un double-clic) modifie la cellule sélectionnée en tant que
  texte (`C-4 01 V24`); **Entrée** enregistre et passe à la ligne suivante,
  **Échap** annule.
- **Note-off** (`===`) : appuyez sur **1** (ou `` ` `` / `=`), ou saisissez
  `===` / `OFF` dans une cellule. Cela libère le gate, et le relâchement de
  l'instrument s'exécute — de la même manière que l'effet `C` sans note
  (enregistré et exporté sous le nom `C00`).
- Sélectionnez une cellule normalement, ou maintenez les touches **Maj**
  enfoncées tout en cliquant ou en utilisant les flèches directionnelles pour
  étendre une sélection rectangulaire sur plusieurs lignes et l'une des trois
  voix. Un clic droit à l'intérieur de la zone sélectionnée permet de conserver
  la plage intacte.
- Les fonctions Copier, Couper, Coller et Effacer sont accessibles depuis la
  barre d'outils à icônes et le menu contextuel à icônes. Ctrl/Cmd+C et
  Ctrl/Cmd+V s'appliquent à la même sélection rectangulaire.
- Assistant d'harmonie : choisissez une note fondamentale, un type d'accord et
  une octave, prévisualisez l'accord avec l'instrument actuel, puis insérez
  l'harmonisation directement dans le tracker. Les types disponibles incluent :
  Majeur, Mineur, Diminué, Augmenté, Sus2, Sus4, Dominant 7, Majeur 7, Mineur 7,
  6, Mineur 6, 9, b9, #9, Dim7 et 7sus4.
- Assistant d'arpèges : prévisualisez ou insérez des séquences de notes de 4, 8
  ou 16 pas à partir de l'accord sélectionné, en montant, en descendant ou en
  montant/descendant.
- **Aperçu de la ligne** permet d'écouter la ligne sélectionnée sur les trois
  voix sans démarrer la lecture du motif.
- Le collage par plage de cellules commence désormais à la cellule de début de
  la plage sélectionnée et s'arrête proprement aux limites de la ligne et de la
  colonne au lieu de passer à la ligne ou à la colonne suivante.
- Le curseur de vitesse définit le diviseur de tick IRQ (images entre les
  lignes).

**Liste des chansons / ordre : **
- Les motifs sont organisés via une liste de chansons/ordres superposée à la
  banque de motifs bruts — le même motif peut se répéter et la chanson peut être
  plus longue que le nombre de motifs stockés.
- Ajoutez, supprimez et réorganisez les étapes depuis le panneau de la liste des
  chansons ; l’étape en cours est mise en surbrillance pendant la lecture.
- La lecture dans l'application et chaque exportation parcourent cette liste, et
  non l'ordre brut du motif ; les exportations effectuées avant l'existence de
  la liste d'ordre se chargent toujours correctement comme une simple chanson
  0..N-1.

**Colonne Effet :** Chaque cellule peut contenir un effet avec sa note et son
instrument, saisi sous forme de code court juste après la note (par exemple `C-4
01 V24`) ou seul pour une ligne d’effet sans note (par exemple `F06`) :

| Code | Effet                             | Valeur                                                            |
| ---- | --------------------------------- | ----------------------------------------------------------------- |
| `V`  | Vibrato                           | faible morsure = profondeur, forte morsure = longueur de maintien |
| `U`  | Glisser vers le haut (portamento) | montant ajouté à la fréquence de chaque ligne                     |
| `D`  | Glisser vers le bas (portamento)  | montant soustrait de la fréquence de chaque ligne                 |
| `C`  | Note coupée                       | coupe la voix sans la réactiver ; valeur inutilisée               |
| `F`  | Changement de vitesse             | nouvelle valeur d'images par ligne, prend effet immédiatement     |

Les effets sont mis à jour une fois par ligne (correspondant au timing du
lecteur exporté), fonctionnent de manière identique dans l'aperçu Web Audio et
l'exportation 6502 compilée, et sont enregistrés/chargés sans perte au format
versionné `.bin`.

**Lecture et clavier virtuel : **
- Le bouton Lecture de la barre d'outils se transforme en Pause pendant la
  lecture et en Reprendre lorsqu'il est en pause ; le bouton Arrêter met fin à
  la lecture et réinitialise l'état.
- Le bouton de la barre d'outils du clavier ouvre VA-VK, un piano non modal (2,
  3 ou 4 octaves ; la position, l'état ouvert, l'octave et l'insertion dans le
  tracker sont mémorisés) doté de ses propres boutons Lecture/Arrêt qui restent
  utilisables pendant l'utilisation de l'éditeur SID. Faites glisser son en-tête
  pour le placer où vous le souhaitez au-dessus de l'application principale.
- Activez l'option **Insérer dans le tracker** pour inscrire chaque note jouée à
  l'emplacement actuel du curseur du tracker et passer à la ligne suivante.
  Désactivez-la pour écouter les notes sans les modifier.
- Les aperçus d'accords et d'arpèges illuminent les touches correspondantes du
  piano lorsque le clavier est ouvert.

**Enregistrement, métronome et MIDI :**
- **Enregistrer** (le point rouge dans la barre d'outils du tracker et sur
  VA-VK) enregistre les notes que vous jouez (sur VA-VK, le clavier de
  l'ordinateur ou un clavier MIDI) dans la voix sélectionnée, à partir de la
  ligne sélectionnée et à la vitesse actuelle. Lorsque le motif est plein, un
  nouveau motif vide est ajouté après l'étape de morceau en cours et
  l'enregistrement se poursuit à partir de là. Appuyez de nouveau sur
  Enregistrer pour arrêter.
- **Metronome** (barre d'outils de suivi et VA-VK) : clics toutes les 4 lignes,
  accentués sur le premier temps de chaque mesure de 4 temps. Les voyants de
  temps à côté clignotent à chaque temps pendant la lecture et l'enregistrement,
  même lorsque le clic est désactivé.
- **MIDI : ** Choisissez l’entrée dans la liste **MIDI ** située à côté du nom
  de l’instrument et appuyez sur **Connecter MIDI ** ; les notes sont jouées par
  l’instrument actuel (et sont enregistrées dans le tracker pendant
  l’enregistrement ou avec *Insérer dans le tracker *). Le voyant situé à côté
  du bouton clignote à chaque message MIDI entrant.
- **Suppression de motif : ** Le bouton **−** situé à côté de **Pat +** supprime
  le motif actuel (il demande d’abord si le motif contient des notes). Les
  étapes de la chanson qui l’utilisaient sont supprimées et les autres
  renumérotées ; au moins un motif est toujours conservé.
- Le bouton de volume principal **** se trouve sur VA-VK.

**Exportations du menu Fichiers : **
| Exporter                                  | Ce que cela fait                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Enregistrer .bin…`                       | Enregistre les données au format sérialisé natif de l'éditeur (instruments avec tous leurs réglages et noms de modulation, vitesse, motifs, morceau). Les anciennes sauvegardes restent compatibles.                                                                                                                                                                                                                                                                                             |
| `Exporter les blocs (données uniquement)` | Ajoute la table d'instruments + les blocs de motifs au programme à `* = $C000`.                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `Exporter les blocs + mini-joueur`        | Ajoute le lecteur complet (sid_init / sid_irq / sid_frame / sid_play_row / sid_set_voice) ainsi que les tables de fréquences PAL. Après l'exportation, insérez une instruction `JSR sid_init` dans votre code principal, à l'endroit où la musique doit démarrer, en remplaçant l'appel d'interruption `JSR sid_frame` par votre propre appel d'interruption `JSR sid_frame`.                                                                                                                    |
| `Exporter asm (presse-papiers)`           | Copie l'intégralité du code source de l'assembly dans le presse-papiers.                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `Importer GoatTracker .sng…`              | Charge une chanson GoatTracker 2 à la place de la chanson actuelle — voir **GoatTracker import** ci-dessous.                                                                                                                                                                                                                                                                                                                                                                                     |
| `Exporter vers UltimateBasic`             | Écrit un bloc `tune ... end` (instruments, liste d'ordre, lignes de motif sous forme de texte) plus `music play` et l'insère au niveau du curseur de l'éditeur Ultimate Basic ; hors du mode UB, il copie le texte dans le presse-papiers. Le compilateur Ultimate Basic génère le lecteur, que les commandes `music play` / `music stop` contrôlent. La modulation des instruments est gérée par les lignes `imod` / `ifilt` / `igate` / `itab` (Ultimate Basic 1.6.2 et versions ultérieures). |

**Importation GoatTracker : ** **Fichiers → Importer GoatTracker .sng… ** charge
un morceau GoatTracker 2 (`.sng`, GTS3–GTS5) à la place du morceau actuel. La
conversion est approximative, car les deux trackers fonctionnent différemment :
- Les listes d'ordre par voix (avec transposition et répétition) sont aplaties
  en une seule chanson à 3 voix et découpées en motifs de 32 lignes ; les motifs
  identiques sont partagés.
- Instruments : AD/SR, première onde, temporisateur de porte et redémarrage
  matériel sont pris en charge ; la table d’ondes devient la table
  d’ondes/arpèges, la table d’impulsions PWM, la table de filtres le mode de
  filtre, le balayage de résonance et de coupure, et la table de vitesse
  l’entrée du vibrato de l’instrument.
- Commandes de motif : touche relâchée → note relâchée, portamento → `U` / `D`
  (255 maximum par ligne), tempo → `F` ; toneporta devient une simple note. Les
  autres commandes sont ignorées et un message indique ce qui a été approximé ou
  ignoré.
- Une porte déclenchée par la table d'ondes devient une coupure sur la prochaine
  rangée libre. Seule la première sous-mélodie est importée, et la limite
  d'exportation de 7 motifs reste applicable.

Utilisation du ZP du lecteur : ** `$02`–`$1C` (pointeurs de motif, décalage de
motif, temp) et `$2F` (vitesse actuelle), plus `$FB`–`$FD` (compteur de ticks,
index de ligne, position dans la liste de commandes). L’état de la voix, de la
modulation et du filtre se trouve dans `sid_state` après les données. Les octets
ZP peuvent entrer en conflit si votre code principal les utilise ; déplacez-les
via le mode Expert si nécessaire.

**Limites connues : **
- Le compteur de lignes 8 bits limite chaque motif à 7 motifs × 32 lignes dans
  la banque brute (la liste des chansons/ordres peut toujours être
  arbitrairement longue en répétant les motifs).
- Le volume global C64 `$D418` est partagé entre les voix — le curseur de volume
  par instrument est informatif ; le niveau de sustain (`S` d'ADSR) est le
  volume effectif par voix.
- Lorsque **Play: All** charge la mélodie réelle (même en pause), les
  prévisualisations des notes utilisent le petit synthétiseur, qui ne fait
  qu'approximer la puce SID. Les prévisualisations atteignent WebSid environ 0,1
  s avant le son.

---

**Exporter .sid (PSID)…** (menu Fichiers) enregistre le morceau avec le lecteur
jouable `$C000` comme un fichier PSID standard — il se lit dans le lecteur SID,
dans `vsid` de VICE et dans tout autre lecteur SID.

### Lecteur SID

Le bouton de la barre d'outils **SID Player** ouvre une fenêtre flottante qui
lit les fichiers musicaux `.sid` (PSID et RSID), par exemple des morceaux de la
collection HVSC.

- **Playlist : ** ajoutez des morceaux avec **Ajouter des fichiers .sid…** ou en
  les déposant sur la fenêtre, puis cliquez sur un morceau pour le lire ;
  **Supprimer** et **Effacer la playlist** nettoyez la liste. **Enregistrer la
  playlist…** / **Ouvrir la playlist…** écrivez et lisez un fichier `.sidpl`
  contenant les morceaux. La liste, le morceau en cours et l’état de la fenêtre
  (ouverte ou fermée) sont mémorisés.
- **Transport : ** Lecture, Pause, Arrêt, **Précédent** / **Suivant** morceau,
  **Sous-morceau précédent / suivant** pour les fichiers contenant plusieurs
  chansons, et un compteur de temps.
- **Recherche : ** la barre de position et **Retour/Avance rapide (10 s) **
  fonctionnent avec le moteur VA SID Core. WebSID ne prend pas en charge la
  recherche ; ces commandes sont donc désactivées.
- **Volume:** le bouton est partagé avec le volume principal de l'éditeur SID.
- Moteur : la fenêtre affiche le moteur en cours de lecture (WebSID ou VA SID
  Core, avec sa version et sa puce SID) ; sélectionnez-le dans Paramètres →
  Aperçu SID. VA SID Core exécute le réglage sur un cœur Rust C64 natif avec un
  processeur 6510 à cycle précis, une gestion précise des interruptions, un CIA
  6526A, une gestion des interruptions VIC-II avec lignes défectueuses, un DMA
  de sprites et des interruptions raster, ainsi que le port d'E/S du 6510.
  Ainsi, les réglages raster-IRQ, CIA et numériques exploitent la
  synchronisation d'une véritable machine.
- **Lecture aléatoire : ** Le bouton de lecture aléatoire situé à côté de
  **Suivant** lit la liste de lecture dans un ordre aléatoire ; aucun morceau ne
  se répète tant que tous n’ont pas été joués. **Précédent** permet de revenir
  en arrière dans l’ordre aléatoire. Le réglage est mémorisé.
- **Favoris : ** les ☆ / ★ dans chaque ligne marquent un morceau ; il est
  conservé dans l’état enregistré et dans les listes de lecture `.sidpl`.

---

### Éditeur de courbes

Génère des tables de correspondance `.byte` prêtes à l'emploi à partir de
courbes mathématiques : sinus, lissage, triangle/dent de scie/carré et rebond.
Idéal pour le mouvement de sprites, les effets raster, le cycle de couleurs ou
toute animation pilotée par une table précalculée. S'ouvre via l'icône **Éditeur
de courbes** dans la barre d'outils supérieure (à côté du bouton Éditeur SID).

**Courbes : ** Sinus, Cosinus, Linéaire, Ease In/Out/InOut (Quad et Cubique),
Ease In/Out (Circ), Triangle, Dent de scie, Carré et Ease In/Out/InOut Bounce.

**Commandes : **
| Contrôle                        | But                                                                                                                                                                                                                           |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Valeur de début / fin**       | Plage de sortie : 0 à 255 en mode 8 bits, 0 à 320 en mode 16 bits.                                                                                                                                                            |
| **Nombre de valeurs**           | Longueur du tableau : 4 à 512 entrées.                                                                                                                                                                                        |
| **Cycles**                      | Nombre d'oscillations sur le tableau (sinus/cosinus/triangle/dent de scie/carré uniquement). Accepte les fractions (ex. : `3,625`).                                                                                           |
| **Phase**                       | Décalage de phase en degrés (sinus/cosinus uniquement).                                                                                                                                                                       |
| **Combiner la deuxième courbe** | Fusionnez une seconde courbe avec **Mixer / Ajouter / Multiplier / Min / Max / Soustraire**, ses propres cycles/phases et une quantité de mélange. Les deux courbes sources sont représentées en pointillés sur le graphique. |
| **Étiquette**                   | Étiquette du tableau (suggestion automatique à partir du nom de la courbe).                                                                                                                                                   |
| **Format de nombre**            | `$XX` hexadécimal ou décimal.                                                                                                                                                                                                 |
| **Valeurs par ligne**           | 8 / 16 / 32 octets par ligne `.byte`.                                                                                                                                                                                         |

**Modes de sortie : **
| Mode        | Émet                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **8 bits**  | Une seule table `.byte` (valeurs 0..255). Lecture avec `LDX #index / LDA table,X`. Émet éventuellement une routine de lecture sprite-Y **** (`<label>_set_y`) — `LDA <label>,X` / `STA $D001+2N` — pour un numéro de sprite sélectionnable de 0 à 7.                                                                                                                                                                                                                                    |
| **16 bits** | Deux tables d'octets parallèles — `<label>_lo` (8 bits de poids faible) et `<label>_hi` (9e bit, 0/1) — indexées par le même X **** (2 octets par entrée). Nécessaires pour le X du sprite sur tout l'écran (0..320 > un octet). Émet éventuellement une routine de lecture du X du sprite **** (`<label>_set_x`) qui écrit l'octet de poids faible dans `$D000+2N` et positionne/efface le bit de poids fort du sprite dans `$D010`, pour un numéro de sprite sélectionnable de 0 à 7. |

Chaque sortie Copie / Insertion commence par un commentaire d'en-tête
documentant la courbe, la plage min/max réelle, le nombre d'entrées et
l'utilisation exacte (qui enregistrent chaque flux de table).

**Aperçu : **
- Graphique **** — la courbe tracée avec la valeur 0 en haut **** et la valeur
  maximale en bas ****, conformément à la convention sprite-Y/raster du C64 (ce
  que vous voyez correspond donc à ce que le tableau génère sur le matériel).
  Une ligne méta sous le graphique indique le nombre d'octets, les valeurs
  minimales et maximales réelles générées, ainsi que le ou les noms de la
  courbe.
- **Balle rebondissante** — anime un marqueur sur la table au **Tempo** (5 à 240
  valeurs/s). À un tempo de 50, cela correspond à une valeur par image sur PAL
  (50 Hz), soit une étape `.wait_raster` par index. Boutons Lecture/Pause et
  Redémarrer, un fondu enchaîné des ~24 dernières positions et un affichage en
  temps réel de l'`Index · Valeur`.

**Copier / Insérer : ** les deux icônes de la barre d’outils — **Copier ** place
le tableau dans le presse-papiers ; **Insérer dans l’éditeur ** ajoute le
tableau (et le lecteur, s’il est activé) sous forme de blocs au programme
actuel. La réinsertion ** remplace ** l’insertion précédente dans l’éditeur de
courbes au lieu d’empiler les doublons (fonctionne en mode Bloc et Expert).

**Menu Fichiers : **
| Action                             | Ce que cela fait                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Enregistrer la courbe (.bin)…**  | Enregistre les octets bruts de la table exactement comme le C64 les lirait via `INCBIN`. 16 bits : N octets de poids faible suivis de N octets de poids fort.                                                                                                                                                                                                                                                                                     |
| **Courbe de charge (.bin)…**       | Charge les octets bruts de la table dans l'éditeur, interprétés selon la profondeur de bits actuelle (16 bits : première moitié à niveau bas, seconde moitié à niveau haut). La table chargée est affichée telle quelle jusqu'à ce qu'une nouvelle courbe soit régénérée par une commande de courbe.                                                                                                                                              |
| **Exporter la démo en blocs**      | Ajoute une démo complète et fonctionnelle de sprite : initialisation du sprite, boucle principale synchronisée au raster, table intégrée et données du sprite de la balle. L’axe X balaie la plage de 0 à 320 en virgule fixe 8,8 avec le bit de poids fort `$D010`, tandis que la table pilote l’axe Y du sprite, correspondant exactement à l’aperçu de l’éditeur. La réexportation remplace l’insertion précédente de l’éditeur de courbes.    |
| **Exporter vers UltimateBasic**    | Crée le tableau sous forme de tableau initialisé Ultimate Basic — `var nom = tableau(N)` (ou `tableau_mot(N)` pour 16 bits) suivi de `nom_données : …` lignes — et l’insère à l’emplacement du curseur de l’éditeur UB (hors mode UB, il est copié dans le presse-papiers). L’étiquette devient un nom UB valide en minuscules ; indexez le tableau comme `nom[i]`. Nécessite Ultimate Basic 1.5.8 ou une version ultérieure (fourni).            |
| **Exporter la démo UltimateBasic** | Génère un programme UB complet et prêt à l'emploi : un sprite de balle (`sprdef 0`), la table et une boucle synchronisée au raster qui joue une entrée de la table par image. Les tables 8 bits pilotent le sprite **Y** tandis que X parcourt les valeurs de 0 à 320 ; les tables 16 bits (0 à 320) pilotent le sprite **X** tandis que Y parcourt les valeurs de 0 à 200. Les tables de plus de 256 entrées jouent leurs 256 premières entrées. |

**Reproduire l'aperçu sur C64 : ** l'aperçu lit la table **linéairement, en
bouclant 0 → N-1 → 0, une valeur par image**. Pour le reproduire exactement,
parcourez la table de la même manière (incrémentez l'index une fois par image,
puis revenez à la longueur de la table). Une lecture en ping-pong ou partielle
se déplacera différemment même si les valeurs des octets sont identiques. Voir
`samples/curve-new-demo.asm` pour un exemple fonctionnel de sprite-X 16 bits.

---

### Générateur de table

Le bouton de la barre d'outils **Générateur de tables** (icône de grille, à côté
de l'éditeur de courbes) crée des tables de correspondance et du speedcode.
Choisissez un type de table, définissez ses paramètres et visualisez l'aperçu ;
la ligne de métadonnées affiche le nombre d'entrées, la taille et la plage de
valeurs (pour le code : octets et nombre estimé de cycles/lignes raster).

| Taper                                          | Valeurs                                                                                                                                    |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Adresses des lignes d'écran                    | base + 40 · rang (longueur de base et de rang quelconque)                                                                                  |
| adresses de lignes bitmap                      | pixel Y → adresse d'octet dans la colonne 0 (disposition de cellule 8 × 8)                                                                 |
| Décalages de colonnes bitmap                   | pixel X → décalage d'octet dans la ligne (haute résolution ou multicolore)                                                                 |
| Masque de bits de pixel                        | X → masque de bits (haute résolution / multicolore, éventuellement inversé pour ` ET `)                                                    |
| Multiplier / diviser / reste par une constante | x · k, ⌊x / k⌋, x mod k                                                                                                                    |
| Quarts de carrés                               | ⌊(x − décalage)² / 4⌋, 512 entrées — a · b = √(a + b) − √(a − b)                                                                           |
| Réciproque                                     | ⌊N / x⌋                                                                                                                                    |
| Logarithme / exponentielle                     | arrondir(log2 x · s), arrondir(2^(x / s))                                                                                                  |
| Inversion de bit                               | inverse un octet (ou des paires de bits en multicolore) pour refléter les sprites et les caractères                                        |
| Expression personnalisée                       | toute formule de `i` (`k` = index à partir de 0, `n` = nombre) ; `sin`, `cos`, `abs`, `min`, `max`, `round`, `floor`, `PI`, `$hex`, `%bin` |
| Speedcode : remplir / copier la mémoire        | une sous-routine ; * stockages par itération * 0 = entièrement déroulé, N = une boucle X avec N stockages par passage                      |

Les valeurs supérieures à 255 deviennent une paire de tableaux **lo / hi**
(`label_lo`, `label_hi`) ou un tableau `.word` ; les valeurs négatives sont en
complément à deux. Options : étiquette, hexadécimal/décimal, valeurs par ligne,
**Aligner sur la page** (`.align 256`, évite le cycle de changement de page).
**Copier** place l’assemblage dans le presse-papiers ; La commande **Insérer**
ajoute l'élément au programme (réinsérer la même étiquette remplace la copie
précédente). En mode Ultimate Basic, elle insère un tableau `avec ` lignes de
données `. Le menu Fichiers enregistre également le tableau au format `.bin`
(octets faibles, puis octets élevés) et l'exporte vers Ultimate Basic.

### Convertisseur de nombres

Un petit convertisseur **non modal ** DEC / HEX / BIN, qui s'ouvre avec le
bouton de la barre d'outils à côté de l'éditeur D64 (cliquez à nouveau ou
appuyez sur Échap pour fermer). Le bouton reste sélectionné tant que le
convertisseur est affiché. Il reste ouvert pendant que vous continuez à éditer
le programme, quel que soit le mode.

- Saisissez du texte dans l'un des champs **DEC**, **HEX** ou **BIN** ; les deux
  autres champs s'afficheront ensuite. Les préfixes `$`, `0x`, `%`, `0b` et les
  séparateurs (espace, `_`) sont acceptés ; un nombre décimal négatif est
  converti en complément à deux dans la largeur actuelle ; une saisie invalide
  est marquée en rouge.
- **8 / 16 bits** largeur — une valeur supérieure à 255 passe automatiquement à
  16 bits.
- **Ligne de bits** — cliquez sur un bit pour le basculer.
- La ligne d'information affiche la valeur **signée** et, en mode 16 bits,
  l'octet **bas** et **haut**.
- Les boutons **Copier** copient la valeur avec son préfixe (`53280`, `$D020`,
  `%1101000000100000`).
- Faites-le glisser par l'en-tête ; il conserve sa valeur, sa largeur et sa
  position, et se rouvre après un redémarrage s'il était ouvert lorsque vous
  l'avez quitté.

---


*© 2026 Zsolt Tarczali — Assembleur visuel C64*
