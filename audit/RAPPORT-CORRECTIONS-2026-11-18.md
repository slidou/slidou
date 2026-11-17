# Slidou — corrections ciblées, finalisation du 18 novembre 2026

Intervention commencée après l'audit du 17 novembre, reprise sans nouvel audit général. Aucun commit, push, déploiement, changement d'hébergement, migration de données ou ajout de dépendance applicative.

## 1. État final et périmètre

Les quatre corrections prioritaires sont terminées. Les trois corrections initialement soumises à validation ont été appliquées après l'accord explicite donné dans cette conversation : surlignage, dates des infobulles, fermeture mobile.

La politique du service worker **n'a pas été modifiée pendant cette intervention**. La proposition ci-dessous reste en attente d'autorisation.

Le dépôt contenait déjà des modifications issues de l'audit et des modifications éditoriales. Elles sont conservées. Des ajouts extérieurs à cette intervention ont ensuite été constatés dans `anime-data.js`, `journal-data.js` et les ressources anime. Aucun fichier `*-data.js` n'a été écrit par les corrections ou les tests. Les empreintes des neuf fichiers protégés sont également identiques au début et à la fin de la vérification de reprise, dans `corrections/final-checks.json`.

## 2. Problèmes confirmés et corrections appliquées

| Sujet | Constat confirmé | Correction terminée |
| --- | --- | --- |
| Wrapped | Deux générations partagent `lastData`, `lastMode` et `currentImgs`. Les promesses des polices et des images peuvent reprendre après une autre ouverture. Un ancien `toBlob()` pouvait aussi emprunter l'année courante. | Numéro de génération vérifié aux reprises asynchrones ; fermeture invalidante ; images réinitialisées ; canvas vidé à l'ouverture ; téléchargement indisponible pendant le chargement ; année capturée et résultat `toBlob()` périmé ignoré. |
| Lecteur | Progression exclusivement cliquable, sans sémantique de curseur ni commandes clavier ; intitulé lecture/pause statique ; changements de piste peu explicités aux aides techniques. | Curseur ARIA focalisable, valeur et durée synchronisées, flèches ±5 s, Page précédente/suivante ±10 s, Début/Fin ; bornage des clics ; intitulé et état lecture/pause synchronisés, y compris pause externe et erreur ; titre/artiste dans une région d'annonce polie. |
| Perruches | Les cages acceptent le clic sans équivalent clavier. | Rôle bouton, noms « caresser Pistachio/Ciel Azur », focus clavier, Entrée/Espace réutilisant exactement le clic existant ; répétition de touche ignorée. Les boutons nourrir/jouer/dormir restent natifs. |
| Cartes/reviews | Sept gabarits imbriquent un bouton dans un lien. | Pour les cartes ayant une review : conteneur identique en dimensions, lien natif couvrant la carte et bouton review frères, nom accessible spécifique ; lien puis review dans l'ordre du focus. Les cartes sans review gardent leur lien d'origine. |
| Surlignage — autorisé | Les indices NFD découpent le texte original : `indien` dans « Été indien » ne marquait que « dien » ; `cole` dans « école » ne marquait que « ole ». | Correspondance de chaque fragment normalisé vers son intervalle UTF-16 original, accents précomposés/décomposés compris. Le moteur de recherche et le style des `<mark>` sont conservés. |
| Dates — autorisé | `dayIndex + 1` est un rang annuel : « 32 fév », « 61 mar » en 2024. | Remplacement limité à `dt.getUTCDate()` dans l'infobulle de `buildRecapHeatmap`. Aucune date éditoriale modifiée. |
| Recherche mobile — autorisé | Absence de commande de fermeture visible dans la palette plein écran. | Bouton × issu du composant de fermeture existant, en haut à droite, cible 44 × 44 px, champ raccourci sur cette ligne ; clavier et toucher, fermeture commune à Échap et retour du focus. Le bouton est masqué sur ordinateur. |

Le contrôle du bouton de recherche tolère également un ancien HTML dépourvu du nouveau bouton, afin d'éviter une erreur JavaScript lors d'un mélange temporaire de ressources en cache.

## 3. Reproduction et problèmes non reproduits

La concurrence Wrapped a été reproduite avec un ordonnancement volontairement inversé des chargements, dans un navigateur isolé : les images de A arrivent après celles de B. La référence dessine alors les images A avec les données B ; le code corrigé conserve B. Ce test instrumente les fonctions privées uniquement dans la réponse HTTP du serveur de test. Une fermeture pendant un chargement et un ancien `toBlob()` sont aussi vérifiés.

La fréquence de cette course lors de doubles ouvertures humaines sur des appareils réels n'a pas été mesurée. Aucun des défauts ciblés confirmés n'est classé « non reproduit ». Les limites de navigateur, de lecteur d'écran et de réseau décrites plus bas restent des vérifications non réalisées, et non des succès supposés.

## 4. Fichiers concernés

Fichiers applicatifs modifiés par cette intervention uniquement :

- `script.js` : Wrapped, lecteur, cages, cartes/reviews, surlignage, infobulles, fermeture de recherche.
- `index.html` : sémantique du lecteur, annonces de piste, bouton de fermeture approuvé.
- `style.css` : superposition technique du lien et du bouton review ; masquage du nouveau bouton hors mobile.
- `mobile.css` : position et zone tactile du bouton approuvé, place réservée dans le champ.

Outils locaux ajoutés : `tests/corrections.cjs`, `tests/corrections-extra.cjs`, `tests/corrections-final.cjs`. Les résultats, PNG et références se trouvent dans `audit/corrections/` et `audit/corrections-reference/`.

`sw.js`, les données éditoriales et les ressources graphiques/audio n'ont pas été modifiés par cette intervention. Leur présence éventuelle dans `git status` ne doit pas être confondue avec ces corrections : plusieurs changements étaient préexistants ou ont été effectués extérieurement pendant la session.

## 5. Tests exécutés et résultats

Tests locaux avec Chrome headless 157.0.8103.51, profils/contextes jetables, sans profil personnel. Les modifications d'état, préférences, données synthétiques, caches et simulations hors ligne sont confinées à ces contextes. Aucun test ne modifie le stockage du navigateur personnel.

| Vérification | Résultat enregistré |
| --- | --- |
| `tests/corrections.cjs --functional` | 68 assertions réussies, aucune erreur JavaScript. |
| Wrapped | Course reproduite sur la référence et bloquée après correction ; fermeture invalidante ; PNG téléchargé et décodé ; retour du focus. |
| Cartes/reviews | Structure des sept gabarits ; ouvertures de reviews ; liens externes au clavier et à la souris sur six fabriques ; ordre lien/review et restitution du focus ; review anime activée à la souris. |
| Lecteur | Lecture/pause ARIA, déplacement clavier, Début/Fin, changement de piste en lecture et en pause, maintien du focus ; pause externe dans la suite complémentaire. |
| Perruches | Entrée/Espace sur les deux cages, focus conservé, boutons de soin ; costumes, caresse et interaction Konami pour Halloween, Noël et Saint-Valentin dans la suite complémentaire. |
| Recherche/calendrier | Exemples accentués, accent décomposé, emoji, chevauchement des marques ; limites mensuelles et annuelles 2023–2026, 29 février 2024 ; journal courant vérifié à la reprise : 1 150 entrées en 2026. |
| Fermeture mobile | Toucher émulé et clavier à 390 × 844 ; restitution du focus ; capture inspectée. |
| `tests/corrections-extra.cjs` | Dernière campagne complète enregistrée : 17 assertions réussies et diagnostic de rasterisation. L'assertion ajoutée ensuite sur ancien HTML/nouveau script a été exécutée séparément dans la reprise. |
| Service worker actuel | Réinstallation simulée dans deux onglets : tous deux repris par le nouveau worker ; sentinelles image/audio conservées avec la même version de cache ; lecture audio hors ligne après mise en cache. |
| `tests/service-worker.cjs` | 12 tests réussis : plages audio, stockage du fichier complet, erreurs/refus de cache, navigation hors ligne sans entrée et durée de revalidation. Aucun changement de politique pour ces tests. |
| `tests/corrections-final.cjs` | 4 assertions réussies : ancien HTML/nouveau script, journal courant, absence d'erreur JavaScript, empreintes éditoriales inchangées pendant la reprise. |
| Vérification statique | Syntaxe JavaScript et `git diff --check` réussis. Les messages Git sur LF/CRLF sont des avertissements, pas des erreurs de vérification. |

Les résultats complets sont dans `corrections/functional.json`, `corrections/extra.json`, `corrections/final-checks.json` et `sw-after.json`. `corrections/results.json` conserve la campagne initiale, notamment les exemples de défauts avant leur correction autorisée : ce n'est pas le résultat final des dates et du surlignage.

## 6. Comparaisons visuelles et limites

La référence est le contenu du dossier au début de cette intervention, incluant les correctifs précédents de l'audit, et non uniquement le commit Git.

- 28 paires de captures : sept rubriques, 390 et 1 440 px, modes clair/sombre. 27 paires initiales sont identiques pixel par pixel. Une différence sur les couvertures de la page écrans a aussi été reproduite entre deux captures de la référence seule ; les recaptures finales enregistrées de cette page ont zéro pixel différent et une géométrie identique.
- Wrapped jour/nuit : comparaison du canvas avec tirage fixé. Écarts de 5 et 3 pixels, chacun d'un niveau de couleur lors de l'analyse détaillée ; aucun déplacement ou changement de composition. Une tolérance explicite de 10 pixels est utilisée par ce test complémentaire.
- La palette mobile présente la différence expressément autorisée : bouton de fermeture et largeur utile du champ réduite. Les marques de recherche et les textes des infobulles ont les corrections autorisées.
- Les nouvelles cibles clavier utilisent le focus natif du navigateur ; aucun nouveau style de focus, couleur, icône, police ou animation n'a été imposé. Pendant le chargement Wrapped, le canvas précédent est effacé et le téléchargement est suspendu pour éviter un export périmé.

Google Fonts a bloqué le chargement initial dans l'environnement de test. Les comparaisons automatiques ont donc exclu ces requêtes et utilisé les mêmes polices de secours des deux côtés. Les déclarations IM Fell English et Space Grotesk sont inchangées, mais leur rendu chargé depuis Google n'est pas certifié par cette campagne.

Pas de certification Firefox, Safari/WebKit, appareil mobile physique, lecteur d'écran réel, écoute audio humaine, ni de toutes les animations et interactions cachées possibles. Le toucher mentionné est une émulation Chromium. Aucun remplacement du service worker de production n'a eu lieu.

## 7. Service worker : constat actuel

Le code reste en `v37`. HTML : réseau d'abord ; JS/CSS/données : cache puis revalidation ; images et audio : cache d'abord. Le worker précache les ressources critiques, utilise `skipWaiting()` puis `clients.claim()`, et supprime les caches Slidou ne figurant pas dans sa liste de conservation.

Une modification du contenu de `sw.js` suffit à déclencher un nouveau cycle d'installation ; l'absence d'incrément de `VERSION` ne signifie donc pas une absence totale de mise à jour. En revanche, le nouveau worker réutilise les mêmes caches et peut les remplir alors que l'ancien les utilise encore. La revalidation indépendante des JS/CSS/données et le HTML réseau peuvent également produire un ensemble de ressources de générations différentes. La reprise immédiate des onglets a été confirmée localement.

À l'inverse, incrémenter seulement la version commune changerait aussi les noms des caches image/audio/polices, puis leur purge ferait perdre ces ressources hors ligne. **Un simple passage de v37 à v38 ne constitue donc pas la stratégie recommandée.**

Ces comportements de cycle de vie sont documentés par [web.dev](https://web.dev/articles/service-worker-lifecycle) et [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers). L'analyse du mélange de ressources ci-dessus est déduite du code local de Slidou.

## 8. Proposition concrète — autorisation nécessaire, non appliquée

Je recommande un **ensemble HTML/JS/CSS/données cohérent par publication**, avec des médias conservés séparément :

1. Versionner uniquement le cache de l'application, par exemple `slidou-shell-v38`. Incrémenter cette version à chaque publication qui change HTML, scripts, styles ou données.
2. Conserver exactement les caches de médias déjà présents : `slidou-img-v37`, `slidou-media-v37` et `slidou-fonts-v37`, indépendamment de la future version de l'application. Aucun transfert de données, changement de format ou vidage n'est nécessaire. Garder les limites actuelles de 2 500 images et 40 fichiers audio.
3. À l'installation, télécharger toutes les ressources critiques dans le nouveau cache de l'application en évitant le cache HTTP pour cette acquisition. Si une ressource indispensable échoue, laisser l'ancien worker actif. Garder les fichiers facultatifs non bloquants.
4. Servir les ressources critiques connues, HTML compris, depuis le cache de la version active ; arrêter leur remplacement individuel en arrière-plan. Les données éditoriales restent lues telles quelles : leur fichier n'est jamais réécrit par le worker. Leur actualisation devient liée à une nouvelle publication/version.
5. Retirer l'activation forcée et la prise de contrôle forcée pour les mises à jour. Le nouveau worker attend que les anciens onglets contrôlés soient fermés. Il n'impose ni rechargement ni bannière. Pour obtenir une nouvelle version en attente, fermer tous les onglets Slidou puis rouvrir le site ; un simple rafraîchissement d'un seul onglet ne garantit pas cette activation.
6. À l'activation sûre, supprimer uniquement les anciens caches de l'application. Ne pas purger les caches image/audio/polices conservés. Maintenir le traitement audio des requêtes Range.
7. Garder `sw.js` à son URL actuelle et sa détection lors des visites/navigations. Ne modifier ni les URL publiques, ni l'hébergement, ni les préférences locales. Cette approche repose sur les API déjà utilisées et convient à un site statique ; les en-têtes et le déploiement de production n'ont pas été vérifiés ici.

Conséquences à accepter : une mise à jour pourra attendre la fermeture de tous les onglets ; les nouvelles entrées éditoriales nécessiteront une version d'application ; les images/audio non encore visités ne seront pas tous disponibles hors ligne. Le navigateur peut toujours évincer des caches pour quota ou stockage. La première transition depuis le worker actuel mérite un test dédié, car l'ancienne version conserve sa revalidation jusqu'à son remplacement.

Après autorisation, il faudra tester cette politique proposée elle-même : installation initiale, passage réel v37→nouvelle version avec deux onglets, installation incomplète, fermeture/réouverture, conservation des médias, démarrage et audio hors ligne. Les succès enregistrés aujourd'hui concernent la politique actuelle, pas une implémentation future.

## 9. Risques résiduels avant publication

Le principal point ouvert est la cohérence de cache et de mise à jour décrite ci-dessus. La protection contre un ancien HTML évite l'erreur de recherche identifiée, mais ne garantit pas à elle seule la cohérence de toute combinaison future de ressources.

Restent également les limites de validation sur polices distantes, lecteurs d'écran et navigateurs/appareils non testés. Aucune nouvelle erreur éditoriale n'a fait l'objet d'une correction automatique. Aucune modification du design hors les trois corrections validées n'a été demandée ou appliquée.

**Décision encore attendue : autoriser ou non la stratégie de cache détaillée en section 8. Tout le reste du périmètre de corrections est terminé.**
