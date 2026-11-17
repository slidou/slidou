# Audit technique de Slidou — 17 novembre 2026

## 1. Présentation du projet et périmètre

Slidou est un journal culturel personnel public, organisé autour des œuvres consommées, de leurs notes, des collections et de l'activité quotidienne. Son identité repose sur les deux polices IM Fell English et Space Grotesk, une présentation beige/bleue, un mode sombre, des couvertures, des étoiles et des perruches animées. Ces éléments ont été conservés.

Référence : commit `1cbd7be425601a9ac0d6e8404553d2f15347472a`, augmenté de la modification locale préexistante de `journal-data.js`. Cette modification n'a pas été touchée. Aucun commit, push, déploiement, changement d'hébergement ou suppression de fichier n'a été effectué.

Inventaire : **8 960 fichiers initiaux, environ 209 Mo décimaux**. `files.tsv` contient tous leurs chemins et tailles, hors métadonnées Git et nouveaux outils d'audit. `inventory.json` documente les volumes, références, fichiers les plus lourds et candidats à une vérification d'usage.

| Élément | Responsabilité |
| --- | --- |
| `index.html` | Document unique avec neuf sections : accueil, bibliographie, écrans, jeux, musique, anime, manga, statistiques, à propos ; sous-sections films et séries |
| `script.js` | Navigation, génération DOM, tris/filtres, recherches, calendrier, bilan, statistiques, lecteur, perruches, export PNG, adaptation des couvertures |
| `style.css`, `mobile.css`, `season.css` | Présentation commune, adaptations mobiles, thèmes saisonniers |
| `season.js` | Halloween, Noël, Saint-Valentin, costumes, particules et interactions cachées |
| Neuf fichiers `*-data.js` | Données éditoriales locales chargées comme scripts classiques |
| `sw.js`, `manifest.json`, `icons/` | Cache hors ligne, manifeste et ressources d'installation PWA |
| `covers/`, `anime/`, `manga/`, `books/`, `films/`, `series/`, `games/`, `music/` | Couvertures, images du journal et trois MP3 |
| `CNAME` | Domaine personnalisé ; son existence ne suffit pas à certifier la configuration réelle d'hébergement |

Les données contiennent 87 livres, 180 films, 10 entrées de saisons, 55 jeux, 152 projets musicaux, 8 002 animes, 399 mangas et 1 148 entrées de journal. Ces nombres décrivent les lignes des catalogues, pas nécessairement des œuvres uniques selon toutes les règles métier.

Pas de framework, paquet npm applicatif, compilation, API métier distante, compte utilisateur, authentification ou base de données serveur identifié. Google Fonts constitue la dépendance distante de rendu. Les liens vers les plateformes culturelles sont des liens sortants, pas des API. Pas de pipeline CI ni script de maintenance suivi dans les fichiers initiaux.

Les couvertures anime/manga sont résolues par image explicite, correspondance non ambiguë avec le journal, puis identifiant local. Une recherche naïve des seules couvertures par identifiant aurait signalé plusieurs centaines de faux positifs ; l'inventaire exécute cette résolution avant de conclure.

Les fichiers apparemment non référencés ne sont **pas déclarés inutiles** : la liste inclut notamment des ressources historiques possibles et des fichiers conventionnels tels que `CNAME`. Rien n'a été supprimé.

## 2. Diagnostic global

Le socle statique est adapté à un catalogue personnel de cette nature. Il évite les risques et la maintenance d'un serveur applicatif. Les parcours normaux fonctionnent et de nombreuses précautions existent déjà : échappement des reviews, images locales, chargement différé, pagination anime, préférences persistantes, secours hors ligne et prise en compte partielle du mouvement réduit.

La fragilité principale était la gestion des situations dégradées : stockage refusé, préférences invalides, changements de piste et cache. Ces défauts ont été corrigés localement. Le second enjeu est la maintenabilité d'un fichier de plus de 5 000 lignes mêlant presque toutes les responsabilités.

Cet audit associe inventaire exhaustif des chemins, lecture des mécanismes applicatifs, validation des données/références, tests navigateur et tests du service worker. Il ne constitue pas une certification exhaustive de tous les contenus, de tous les états possibles ou de la production.

## 3. Problèmes importants et causes

| Gravité | Problème confirmé | Cause et impact | Résultat |
| --- | --- | --- | --- |
| Élevée | Démarrage interrompu si le stockage est refusé | Lecture directe de `localStorage` au niveau supérieur ; une `SecurityError` interrompt le script | Corrigé ; scénario refus du stockage passant |
| Élevée | Préférences malformées interrompant l'initialisation | `.slice()` appelé sur un champ `tags` non tableau ; modes et sens non validés | Corrigé ; anciennes données valides conservées |
| Moyenne | Précédent/suivant arrête la musique | `loadTrack()` met `isPlaying` à faux avant que le gestionnaire vérifie s'il doit reprendre | Corrigé ; lecture et pause préservées |
| Moyenne | Tri films/séries perdant la recherche | Les boutons de tri rappelaient les générateurs sans les données filtrées | Corrigé et testé sur les deux sous-pages |
| Moyenne | Réponses audio Range incorrectes | Suffixes non reconnus, plages hors limites renvoyées en 206, première réponse complète malgré une plage demandée | Corrigé ; plages normales, ouvertes, suffixes et 416 testés |
| Moyenne | Revalidation du cache non garantie | Promesse réseau/écriture non rattachée à la durée de vie de l'événement | Corrigé avec `waitUntil` et écritures attendues |
| Moyenne | Échecs de cache non maîtrisés | `cache.put()` ignoré ; secours HTML testant une promesse comme si c'était une réponse | Corrigé ; quotas/refus et cache absent testés |
| Moyenne | États des perruches non numériques | Structure partiellement invalide ou horodatage non numérique propagé dans les calculs | Validation et bornage ajoutés, sans nouveau format |
| Moyenne | Focus des modales non contenu/restauré | `aria-modal` ne réalise pas seul la gestion clavier | Gestion de focus ajoutée ; calendrier et menu mobile testés explicitement |
| Faible | Couverture Chambre 666 absente | Chemin `.png` alors que la ressource existante est `.jpg` | Corrigé après autorisation explicite |

Aucune vulnérabilité critique exploitable par un visiteur distant n'a été démontrée. Cette conclusion est bornée aux surfaces examinées, sans audit intrusif de l'hébergement.

## 4. Corrections effectuées

- **`script.js`** : accès au stockage protégés, secours mémoire pour la session lorsque l'écriture échoue ; validation des préférences ; validation des valeurs des perruches ; conservation de l'état audio et protection contre les rejets tardifs d'une ancienne demande de lecture ; maintien du filtre lors du tri écrans ; échappement supplémentaire des titres, créateurs, notes et attributs d'images ; focus des modales.
- **`sw.js`** : attente des écritures et suppressions du cache, erreurs de stockage absorbées sans masquer une réponse réseau valide, durée de vie de la revalidation, réponse d'erreur explicite sans cache HTML, plages audio et secours réseau lorsque Cache Storage est indisponible.
- **`index.html`** : noms accessibles des six recherches locales et sémantique de dialogue de la feuille mobile.
- **`films-data.js`** : seule correction du chemin de Chambre 666, autorisée par l'utilisateur.
- **`tests/`** : scripts de validation locale, inventaire, tests navigateur, tests unitaires du service worker et comparaison des captures.
- **`audit/`** : rapport, données de vérification, captures et exports de test.

Aucune feuille CSS, police, icône, image source, animation, URL publique ou structure de sauvegarde n'a été modifiée. La version de cache existante n'a pas été incrémentée afin de ne pas provoquer de purge générale des médias déjà conservés. Le déploiement et sa politique de renouvellement restent à préparer séparément, avec votre accord.

## 5. Sécurité

**Surface actuelle.** Les entrées d'un visiteur sont surtout les recherches, les actions locales et le paramètre saison, lequel est limité à une liste connue. Les données culturelles sont des fichiers JavaScript contrôlés par l'auteur. Leur modification nécessite déjà l'accès au code publié.

**Durcissement réalisé.** Plusieurs gabarits utilisaient encore des valeurs non échappées dans des attributs ou du HTML : couverture jeux/musique, calendrier, créateurs, notes du calendrier, sources anime/manga et recherche. Les champs concernés sont maintenant échappés. Le test de recherche contenant une charge HTML ne crée aucun élément injecté.

**Classification correcte.** Ces gabarits sont un risque conditionnel en cas de future source de données non fiable ; ils ne prouvent pas une XSS distante exploitable aujourd'hui. Aucune chaîne visiteur → code exécuté n'a été identifiée. Les liens des données vérifiés ne présentent pas de schéma dangereux ; une validation systématique des URL deviendrait nécessaire avant un futur import ou une API externe.

Pas de secret évident découvert par inspection ciblée des sources applicatives ; cela ne couvre pas tout l'historique Git ni les réglages d'un compte d'hébergement. Pas de bibliothèque JavaScript tierce applicative à soumettre à un audit npm. Les outils Playwright/pngjs/sharp installés dans l'environnement servent uniquement à l'audit et ne sont pas ajoutés au site.

Les en-têtes HTTP réels, TLS, CSP, HSTS et protections du compte de publication **n'ont pas été vérifiés en production**. L'absence de CSP dans le document ne prouve pas son absence dans les réponses du serveur. Une CSP stricte demanderait de traiter les gestionnaires `onerror` inline et les styles dynamiques : ne pas en activer une arbitrairement.

Le comportement corrigé du cache s'appuie sur la durée de vie des événements documentée par [MDN — waitUntil](https://developer.mozilla.org/en-US/docs/Web/API/ExtendableEvent/waitUntil), et les plages audio sur [MDN — Range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Range).

## 6. Performances

Mesures de référence : Chrome local, serveur HTTP local sans compression, machine non bridée, état du navigateur jetable. Elles ne représentent ni une connexion mobile ni les métriques terrain de la production.

| Mesure de la première comparaison | Avant | Après premier groupe de corrections |
| --- | ---: | ---: |
| First Contentful Paint | 188 ms | 176 ms |
| Fin de l'événement load | 274 ms | 259 ms |
| Ressources transférées enregistrées au relevé | 4 269 922 octets | 4 273 439 octets |
| DOM après visite successive des sections | Environ 9 000 éléments | Ordre de grandeur similaire |

**Ces différences de temps sont trop petites et trop peu répétées pour conclure à une accélération.** Le poids supplémentaire correspond au code de fiabilisation. Aucun gain de score Lighthouse n'est revendiqué. Les JSON conservent les valeurs de chaque exécution ; le relevé final peut varier naturellement.

Les enjeux mesurables sont ailleurs :

- `anime-data.js` représente environ 648 ko avant compression, chargé dès l'accueil même si la rubrique anime n'est pas ouverte.
- Le code principal représente environ 250 ko, en plus de tous les catalogues et du journal.
- Des images réellement référencées dépassent 2 à 4 Mo ; `films/reservoirdogs.png` atteint environ 4,2 Mo. L'image Isaac chargée sur l'accueil approche 989 ko.
- Les MP3 pèsent environ 5,4, 7,4 et 12,1 Mo. Le service worker stocke le fichier complet ; fabriquer une plage depuis son `ArrayBuffer` mobilise cette mémoire complète.
- Les pages déjà générées restent dans le DOM. Les observateurs globaux de couvertures et costumes réagissent à de nombreuses mutations, même lorsque la mutation est sans rapport avec une couverture.
- La recherche globale renormalise des milliers de titres à chaque requête. Le volume actuel reste praticable sur la machine de test, mais mérite un profil sur appareil modeste avant optimisation.

Pas de recompression ni de remplacement automatique : toute transformation perceptible d'image exige votre accord. Les optimisations proposées sont détaillées plus bas. Pas de mesure fiable d'INP terrain, de fuite mémoire prolongée ni de batterie mobile dans cet audit.

## 7. Fiabilité, états et données

Les préférences conservent leurs clés et formats : `theme`, `activePage`, `slidou-prefs`, `slidou_budgie_state`. Le secours mémoire permet de continuer la session si le navigateur interdit la persistance. Il ne garantit évidemment pas la conservation après fermeture dans ce cas. Ce refus de stockage est un comportement prévu par les navigateurs, décrit dans [MDN — localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

Les catalogues restent des fichiers source ; ils ne sont pas éditables depuis l'interface. L'export existant est une image PNG du bilan, pas une sauvegarde complète des données. Aucun import JSON/CSV ou migration de base n'a été identifié.

Les tests utilisent exclusivement des contextes neufs, des préférences synthétiques et une origine locale. Aucune donnée du profil de navigation de l'utilisateur n'a été lue, effacée ou réinitialisée.

Réserves : les écritures concurrentes de deux onglets n'ont pas de résolution transactionnelle ; le dernier état écrit peut gagner. Le cache reste opportuniste et plafonné, pas une sauvegarde. Le premier affichage peut utiliser les anciennes données pendant la revalidation. Une mise à jour de plusieurs fichiers n'est pas atomique avec cette stratégie. Ces points sont importants avant de transformer le site en véritable outil de saisie personnelle.

## 8. Responsive et compatibilité

Chrome **157.0.8103.51** : neuf sections testées à **320×640, 390×844, 844×390, 768×1024, 1024×768, 1440×900 et 1920×1080**, soit 63 contrôles par passage. Aucun débordement horizontal global de la racine détecté. Des captures des neuf sections existent à 390 et 1440 pixels, avec inspection visuelle des montages.

Cela ne prouve pas l'absence de toute découpe dans un conteneur interne : certains contenus défilent horizontalement volontairement, et `overflow-x:hidden` peut masquer un débordement local. La mise en page mobile de la zone « en ce moment » est particulièrement étroite et produit beaucoup de retours à la ligne ; elle a été conservée.

Edge **157.0.4341.60** : chargement et ouverture de la page anime vérifiés. Ce contrôle est plus limité que la campagne Chrome.

**Firefox, Safari/WebKit, iPhone et Android réels non testés.** Les exécutables Firefox et WebKit attendus par Playwright ne sont pas présents. Les dimensions mobiles ne simulent pas fidèlement le clavier logiciel, VoiceOver, les barres dynamiques de Safari ou la mémoire d'un téléphone. Aucun test de gestes tactiles natifs n'est revendiqué ; les activations mobiles automatisées ont été réalisées par clic.

## 9. Accessibilité

Corrections : noms accessibles des recherches, rôle de dialogue de la feuille mobile, entrée du focus dans les modales, boucle Tab/Shift+Tab et restitution du focus. Le calendrier et le menu mobile ont des tests dédiés. Le modèle de référence est [W3C — dialogue modal](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).

Éléments déjà présents : langue française, `main`, navigation, labels de nombreux boutons, attributs `aria-pressed`/`aria-expanded`, raccourci de recherche, fermeture Échap et activation clavier des jours et titres repliables.

Réserves non assimilées à une conformité WCAG :

- La palette de recherche mobile plein écran ne comporte pas de bouton visible de fermeture ; Échap et la sélection d'un résultat ne suffisent pas pour tous les usages tactiles.
- La barre de progression audio est une `div` cliquable, sans sémantique ni clavier de curseur.
- Les cages cliquables ne proposent pas une activation clavier équivalente à la caresse.
- Les boutons de review sont imbriqués dans des liens de carte, ce qui mérite une correction structurelle et des tests d'interaction spécifiques.
- Certains titres `h2` reçoivent `role=button`, au détriment possible de leur rôle de titre dans l'arbre accessible.
- La recherche ne fournit pas une structure complète de liste de résultats annoncée au lecteur d'écran.
- Les contrastes des textes atténués, les cibles et le mouvement réduit nécessitent une campagne dédiée sur tous les thèmes. Aucun changement de couleur ou d'animation n'a été appliqué.

Pas de lecteur d'écran ni d'audit automatique axe complet exécuté. `aria-modal` et la boucle clavier ne suffisent pas à déclarer toute l'application accessible.

## 10. Qualité du code, architecture et SEO

Le choix sans framework reste pertinent. Les données séparées, générateurs de cartes partagés et fonctions d'échappement facilitent les corrections. Aucune dépendance circulaire de modules n'existe puisqu'il n'y a pas de système de modules ; en revanche, l'ordre des scripts et les variables globales créent un couplage important.

Points à surveiller : logique de bilan dupliquée entre DOM et canvas, commentaires de versions volumineux dans le code, rendus reconstruits intégralement, mélange de `var`/`let`/`const`, champs temporaires ajoutés aux objets métier, fonctions saisonnières et décoratives observant le document entier. Une extraction progressive serait préférable à une refonte globale, mais reste une proposition architecturale.

SEO : titre, description, langue, viewport, Open Graph et Twitter présents. Pas de canonical, sitemap ou robots.txt identifié dans le dépôt ; leur absence n'est pas en soi un blocage d'indexation. Les rubriques ont toutes des liens `href="#"` et une navigation pilotée par JavaScript/localStorage : elles ne disposent pas d'URL distincte partageable ou indexable. L'historique Précédent/Suivant ne représente donc pas naturellement les changements de rubrique. Aucun texte, métadonnée éditoriale ou schéma d'URL n'a été modifié.

Les références locales ont été contrôlées ; les centaines de liens externes n'ont pas été visités un par un. Leur statut HTTP réel et les redirections restent inconnus.

## 11. Tests exécutés et preuves

| Vérification | Résultat et limites |
| --- | --- |
| Syntaxe des 12 fichiers JavaScript applicatifs | `node --check` exécuté, sans erreur |
| Diff local | `git diff --check` sans erreur de whitespace ; avertissements Git de conversion LF/CRLF seulement |
| Inventaire/catalogues | Comptages, références locales, résolution des couvertures et notes numériques hors plage ; aucune note numérique hors 0–5 détectée |
| Références locales après correction autorisée | Aucun fichier manquant parmi les références vérifiées |
| Navigation et dimensions | 63 combinaisons Chrome, pas d'erreur JavaScript observée sur ce passage |
| Recherches locales | Six recherches sans résultat et remise à zéro |
| Recherche globale | Chaîne HTML rendue sans création d'image injectée |
| Tris écrans | Recherche vide conservée au tri films et séries |
| Anime | Filtre favorite, restauration après rechargement, chargement de 50 à 100 cartes |
| Perruches | Nourrir/jouer/dormir, valeurs bornées, état synthétique invalide |
| Lecteur | Lecture, suivant/précédent en lecture, changement de piste en pause |
| Modales | Export PNG, ouverture clavier calendrier, confinement/restauration du focus, menu mobile |
| Saisons | Activation des trois thèmes par paramètre ; pas de certification de toutes les dates spéciales/animations |
| Stockage dégradé | Refus de stockage et préférences malformées, sans exception après correction |
| Hors ligne | Installation du SW, rechargement contrôlé, puis rechargement hors ligne réussi |
| Service worker unitaire | 12 cas passants : plages, erreurs, stockage et revalidation |

`before.json` conserve les échecs initiaux ; `sw-before.json` reproduit plusieurs défauts du worker sur le code Git de référence. `after.json` contient le passage global et `targeted.json` les 27 scénarios ciblés finaux. `sw-after.json` contient les 12 cas unitaires. Les premières tentatives de test du focus comportaient un faux échec parce que le bilan masquait encore le calendrier ; le scénario a été corrigé pour tester un jour réellement visible.

L'écoute audio humaine, les interactions physiques tactiles, une panne complète de Google Fonts, une longue navigation de plusieurs heures, un remplacement réel du worker en production et l'ensemble des combinaisons de filtres ne sont pas certifiés.

Pour rejouer : exécuter les scripts `tests/inventory.cjs`, `tests/service-worker.cjs`, `tests/audit.cjs before|after|targeted`, puis `tests/compare.cjs` avec un Node récent. La suite navigateur utilise le Playwright déjà installé dans l'environnement ; `PLAYWRIGHT_MODULE` permet d'en préciser l'emplacement. Les serveurs locaux et navigateurs créés pour les passages réussis sont fermés à la fin. Ne pas lancer `before` pour écraser les preuves conservées sans les sauvegarder.

## 12. Régressions visuelles

Les trois feuilles CSS, les ressources graphiques, les polices et `season.js` sont inchangés. La première comparaison montre **16 captures sur 18 strictement identiques pixel par pixel**.

Les deux vues statistiques présentent des différences de pixels dans les zones d'images ; une seconde capture après attente réduit les différences mais ne les annule pas. Sur mobile, le diff de cette seconde passe se limite à deux couvertures, sans déplacement du texte ou des éléments de mise en page. Les captures et les images de différence sont conservées : `visual-comparison.json`, `screenshots/diff-stats-*.png` et `stable-*.png`. L'origine exacte des variations de rasterisation/chargement n'est pas établie ; **une égalité pixel parfaite de toutes les vues n'est donc pas revendiquée**.

L'inspection des montages ne révèle pas de refonte ou déplacement général introduit par les changements. La seule modification d'image attendue est la réparation de Chambre 666, explicitement autorisée, en dehors de la première portion de la rubrique capturée. Les animations n'ont pas été modifiées ; les captures utilisent leur neutralisation temporaire par le navigateur de test, sans changement du site.

## 13. Problèmes non résolus et risques résiduels

| Priorité | Constat ou risque | Statut et raison |
| --- | --- | --- |
| Élevée pour l'UX mobile | Sortie de recherche plein écran sans résultat difficile au tactile | Confirmé par structure/CSS ; bouton visible soumis à votre accord |
| Moyenne | Images lourdes, données anime chargées dès l'accueil | Mesuré ; transformations d'assets et chargement différé à valider |
| Moyenne | Cache non atomique et ancien contenu au premier passage | Limite de la stratégie actuelle ; modification fonctionnelle à discuter |
| Moyenne | Accessibilité incomplète du lecteur, cages et résultats | Constat de code ; traitement global exige choix d'interaction/focus à examiner |
| Moyenne | Export Wrapped : deux ouvertures rapides peuvent partager un état asynchrone | Risque de code : `lastData/currentImgs` globaux à la modale sans numéro de génération ; course non reproduite dans cette campagne |
| Faible | Surlignage après accents potentiellement décalé | `normMap` calcule ses indices dans NFD puis découpe l'original ; correction visible à valider sur exemples |
| Faible | Infobulle heatmap utilisant le rang annuel au lieu du jour du mois | `dayIndex + 1` utilisé avec un nom de mois ; correction du texte de l'infobulle à valider |
| Faible à moyenne | Compteurs/règles du bilan parfois approximatifs | Extraction de progression depuis du texte libre, titres utilisés comme identité ; règles métier à préciser avant modification |
| À vérifier | Compatibilité Safari/Firefox, en-têtes de production, lecteurs d'écran | Environnements/périmètres non vérifiés, pas de résultat inventé |

## 14. Modifications soumises à votre accord

La correction de Chambre 666 a été autorisée puis appliquée. Les propositions suivantes n'ont pas été mises en œuvre.

| Proposition | Avantage | Coût, risque ou inconvénient | Impact visible |
| --- | --- | --- | --- |
| Ajouter « fermer » à la recherche mobile | Sortie immédiate, même sans résultat ou clavier matériel | Peu de code, mais place à réserver dans le panneau | Oui, petit contrôle supplémentaire |
| Préparer des variantes optimisées des grosses couvertures | Réduit les transferts et la mémoire de décodage | Vérification image par image ; qualité et rendu à comparer | Potentiel, donc validation avant remplacement |
| Compléter clavier/ARIA du lecteur et des cages, revoir le bouton review imbriqué | Usage équivalent sans souris | Vérifier focus, styles et comportement des liens | Potentiel sur les états de focus |
| Corriger surlignage accentué et dates des infobulles | Texte sélectionné/date cohérents | Faible coût ; vérifier chaînes décomposées et années bissextiles | Oui, limité aux états concernés |
| Ajouter URL de rubrique et historique | Partage direct et bouton Retour utile | Changement de navigation ; compatibilité des liens à définir | Fonctionnel |
| Préparer une politique de mise à jour/cache et les en-têtes | Meilleure maîtrise de fraîcheur et sécurité | Risque de cache perdu ou ressources bloquées ; staging indispensable | Généralement invisible, mais impact fonctionnel possible |

## 15. Améliorations recommandées, priorisées

| Priorité | Besoin → solution | Bénéfice | Difficulté | Risques / interface |
| --- | --- | --- | --- | --- |
| P1 | Contrôle avant publication → valider schémas, images, dates, IDs et liens internes dans une commande locale | Détecte erreurs de données avant mise en ligne | Faible à moyenne | Invisible ; règles trop strictes à éviter |
| P1 | Régression → conserver les scénarios de cet audit et ajouter Safari/Firefox sur environnement disponible | Évite le retour des bugs de tri, cache et audio | Moyenne | Invisible ; maintenance des tests et exécutables |
| P1 | Recherche mobile → fermeture explicite | Débloque un parcours quotidien | Faible | Petit ajout visuel soumis à accord |
| P2 | Ressources trop lourdes → variantes de taille adaptée, comparaison visuelle, puis validation | Gain réel sur mobile | Moyenne | Qualité potentiellement perceptible, stockage supplémentaire |
| P2 | 8 002 animes au démarrage → chargement à la première ouverture avec préchargement maîtrisé | Allège l'accueil | Moyenne | État de chargement et disponibilité hors ligne à concevoir |
| P2 | Monolithe → extraction progressive stockage, player, recherche, rendu de cartes | Changements plus faciles à tester | Moyenne | Risque lié à l'ordre des scripts ; pas de framework nécessaire |
| P2 | Progressions en notes libres → contrôles de cohérence sans changer les données | Signale doublons, dates et progressions douteuses | Moyenne | Rapport privé de maintenance ; aucune correction éditoriale automatique |
| P3 | Requêtes récurrentes → normaliser les candidats une fois et indexer le journal par date | Réduit les calculs répétés si profilage le justifie | Faible à moyenne | Invisible ; éviter caches dérivés obsolètes |
| P3 | SEO mono-document → définir une stratégie d'URL, canonical et sitemap adaptée | Meilleure découverte/partage des rubriques | Moyenne | Changement des URL et navigation soumis à accord |

## 16. Nouvelles fonctionnalités adaptées au site

Toutes les idées suivantes restent des propositions.

| Priorité | Besoin | Proposition et bénéfice | Difficulté | Risques et impact interface |
| --- | --- | --- | --- | --- |
| P2 | Parcourir une collection immense sans savoir quoi ouvrir | « Une œuvre de mes favoris » avec choix de catégorie et exclusion des contenus floutés | Moyenne | Éditorialisation/aléatoire à définir ; nouveau bouton ou carte |
| P2 | Relier le journal aux notes du catalogue | Fiche locale d'œuvre regroupant chronologie, review, note et revisites | Élevée | Identifiants stables/homonymes à résoudre ; nouvelle vue importante |
| P2 | Comprendre ses habitudes au fil du temps | Comparaison de deux années par famille et reconsommation, avec définitions explicites | Moyenne | Attention aux catégories et données incomplètes ; nouvel espace statistiques |
| P2 | Ne pas perdre les préférences et les perruches en changeant d'appareil | Export/import volontaire des seules données personnelles locales | Moyenne | Nouveau format de sauvegarde, validation et protection contre écrasement indispensables |
| P3 | Faire découvrir les découvertes récentes | Partage d'une sélection mensuelle dérivée du journal, sur le modèle Wrapped existant | Moyenne | Confidentialité éditoriale/floutage et règles de sélection ; nouvelle carte à valider |
| P3 | Savoir ce qui fonctionne sans réseau | Indication discrète de disponibilité hors ligne et état de mise à jour | Moyenne | Nouveau retour utilisateur ; ne pas promettre que toutes les images sont sauvegardées |
| P3 | Maintenir le catalogue sans erreurs de chemins | Outil local de contrôle proposant les fichiers proches et les œuvres orphelines | Moyenne | Aucune correction/suppression automatique ; interface réservée à la maintenance |

## Verdict

**PRÊT AVEC RÉSERVES.**

La version locale est sensiblement plus robuste : les pannes de stockage, préférences, lecteur, tri et service worker identifiées sont corrigées et vérifiées. Le design source est préservé et aucune action de publication n'a été effectuée.

Les réserves portent sur la sortie de recherche mobile, l'accessibilité restante, le poids des ressources, la politique de cache, les variations résiduelles des captures statistiques et les environnements non testés. Le site est utilisable dans les environnements vérifiés ; il serait inexact de le déclarer entièrement certifié, universellement compatible ou prêt à une publication sans examen de ces réserves.
