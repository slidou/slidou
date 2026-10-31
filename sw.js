/* ═══════════════════════════════════════════════════════════════
   slidou.me — Service Worker (PWA)
   ─────────────────────────────────────────────────────────────
   Stratégies par type de ressource :
   • Page HTML            : RÉSEAU D'ABORD (le site reste à jour,
                            le cache ne sert qu'en hors-ligne)
   • CSS / JS / données   : CACHE PUIS REVALIDATION (affichage
                            instantané, mise à jour en arrière-plan)
   • Images locales       : CACHE D'ABORD (covers immuables incluses)
   • Images distantes     : CACHE D'ABORD (plafonné, FIFO)
   • Audio (player)       : CACHE D'ABORD (plafonné, FIFO)
   • Polices Google       : CACHE D'ABORD
   Mises à jour : rien à faire côté contenu — pusher sur GitHub
   suffit, ce worker se revalide tout seul à chaque visite.
   ═══════════════════════════════════════════════════════════════ */

var VERSION = 'v37';  // v37 : dernier réglage — boutons « tous » inertes quand aucun filtre actif sur les 7 pages (bibliographie, films, séries, jeux, musique, anime, manga — anti-spam, même motif que les tris en v36), pancarte « Joyeux Halloween ! » (orthographe corrigée) ; v36 : peaufinage post-T10 — bilan : familles réordonnées comme les onglets du site (galeries, précisions et carte wrapped alignées), « musics » → « musiques », ligne d'intégrité du pied retirée, catégories repliables une à une (recap-cat-toggle, motif creator-toggle, coups de cœur toujours dépliés, aucune mémorisation), zoom de survol conservé mais curseur normal ; wrapped : les 3 coups de cœur tirés au hasard à chaque génération (Fisher-Yates + variété d'étagère), compteurs de progression (épisodes/chapitres) retirés de la signature, bouton « carte à partager » recentré sous le sélecteur d'année, perruche signature redessinée d'après la géométrie des cages (couleurs Pistachio + branche) ; stats : sections réordonnées (jeux avant animes, animes avant-derniers devant mangas), flou hentai rétabli sur le panthéon (survol PC), cases du panthéon en format uniforme 74×110 (recadrage cover), sévérité comparée reformulée pour les visiteurs (plus de « tu », ligne de lecture ajoutée) ; anime/manga : chip « favorite » exclusif (sémantique top 10 — cliquer favorite vide les autres chips, cliquer un autre chip fait partir favorite) ; navigation : clic inerte sur l'onglet actif, le sous-onglet films/séries actif et les tris sans inversion (auteur/réalisateur/artiste) — plus aucun re-rendu ni flash ; identité : titre d'onglet et h1 en minuscules, favicon citrouille des jours spéciaux supprimé (logo pfp.jpg en dur, emoji de saison conservé sur l'onglet) ; à propos : « en ce moment » redessiné (étiquette capitales + titre italique, contenu inchangé) ; perruches : « Zzz » de la cage décalé (dernier z rogné par le viewBox) ; gabarit : halos gem/coup de cœur renforcés et uniformisés + particules blanches scintillantes (reduced-motion respecté) ; v35 : audit tranche 10 wrapped/bilan — favoris du bilan : animes et mangas nourris dans la recherche des notes 5/5 (deux coups de cœur manquants : Ping Pong the Animation + Tekkon Kinkreet, animeList = tableau plat comme games, mangaData = objet de listes comme books, favoris 10 → 12, picks wrapped inchangés, même correctif dans wrappedCollect), gabarit carte bilan unique buildRecapCard (favoris + galeries, motif v28-v32) + titres/images échappés dans les 4 gabarits alimentés par le journal (favoris, galeries, popup calendrier, dernières activités), modale wrapped : aria-modal + labels en minuscules + aria-label sur le bouton d'ambiance (motif calendar-popup/review-popup v27/v29), aria-expanded sur le bouton « bilan » (motif v30), pochette musique du popup calendrier en carré pur (classe popup-music-square reprise par le cover-stack v22 → slot ratio-square, motif dash-card-square/recap-music-card) ; v34 : audit tranche 9 statistiques — cellules du panthéon avec lien en vrais <a target=_blank rel=noopener> + aria-label « titre — 5/5 » (window.open supprimé, dernier trou reverse tabnabbing, cellules enfin accessibles au clavier, cellules sans lien restent des div), titres top-3 créateurs échappés (escapeHtml, blindage gratuit), var→const/let zone stats (79 : outils partagés + panthéon + sévérité + generateStats), gardes typeof sur toutes les familles (sévérité + sections + cartes, motif buildPantheon/animeList), titres de sections « anime/manga » → « animes/mangas » (homogène avec cartes/panthéon/sévérité) ; v33 : audit tranche 8 jeux vidéo — fix fuite recherche au clic tri (l'input gardait le texte, la liste se réaffichait complète, prouvé captures), gabarit carte unique buildGameCard (motif buildBookCard/buildMusicCard), title échappé (alt + book-title, blindage gratuit), rangée « tous » → classe .biblio-top-row (inline identique au pixel près, aucune règle CSS), var→const/let zone jeux (21), aria-pressed chips+tri, flèches de tri (les 2 modes basculent le sens, motif v31 manga), purge tags fantômes (motif v30/v31) ; report homogénéité musique : flèches de tri (note ▼/▲, titre ▲/▼, artiste sans flèche) + purge filtres fantômes (formats + collection, calculés en tête pour purger avant rendu) ; v32 : audit tranche 7 musique — fix fuite recherche au clic tri (l'input gardait le texte, la liste se réaffichait complète), gabarit carte unique buildMusicCard (motif buildBookCard/buildMangaCard), title échappé (alt + book-title), rangée « tous » → classe .biblio-top-row (+ override #musique-filters, rendu identique), chips format/collection via fabrique locale (motif buildMangaSection), var→const/let zone musique (53 : generateMusique + getMusicFormatBadge + player), aria-pressed chips+tri ; v31 : audit tranche 6 manga — titres échappés (cartes), badges via getCollectionBadges, écriture compteur morte retirée, compteur « 1 manga trouvé » singularisé, vue auteur sur le socle de tri commun (sortDataKeys + sortEntriesByNote), gabarit carte unique buildMangaCard, chips via fabrique unique buildMangaSection, var→const zone manga, aria-pressed chips+tri, flèches de tri (note ▼/▲, titre ▲/▼, auteur sans flèche), purge tags fantômes, règle mobile.css morte .manga-placeholder retirée ; v30 : audit tranche 5 anime — escape title cartes+top-list, badges via getCollectionBadges, écriture compteur morte retirée, inline img mort (battu par cover-stack v22) retiré, topRow tous/reviews → classe biblio-top-row, var→const zone anime, hover hentai borné @media(hover:hover) (motif v27, transverse manga), aria-pressed chips+tri, flèches de tri, purge tags fantômes, aria-expanded toggle-tags, min-height 44px chips/tri mobile, resynchronisation CRITICAL_ASSETS (oubliée en v29) ; v29 : audit tranche 4 écrans — fix fuite tri titre→séries, régénération de la sous-page active au retour sur écrans, compteur à facteur unique (updateEcransCounter supprimée), gabarits cartes films/séries uniques + title/cover échappés, var→const zone écrans, classe biblio-top-row, CSS badges format dédoublonné, review-popup role=dialog, placeholder recherche films+séries, aria-pressed/aria-current, flèches de tri, fallback covers, titres saisons composés en vue plate ; v28 : audit cohérence tranche 3 bibliographie — fix restauration filtre reviews, buildBookCard unique, escape title/cover, rel=noopener, aria-pressed + flèche de tri, pliage créateurs au clavier, fallback covers livres ; v27 : audit tranche 2 accueil — a11y popup/calendrier, semaine lundi, flou/survol unifiés ; v26 : audit tranche 1 — casse minuscule, a11y, theme-color dynamique, purge @media pré-v24, cache-busting unifié ; v25 : entrée « Recherche globale » ; v24 : refonte mobile
var SHELL_CACHE = 'slidou-shell-' + VERSION;
var IMG_CACHE = 'slidou-img-' + VERSION;
var MEDIA_CACHE = 'slidou-media-' + VERSION;
var FONT_CACHE = 'slidou-fonts-' + VERSION;

var IMG_LIMIT = 2500;  // max d'images gardées en cache (FIFO) — covers locales ~10 Ko, hors-ligne au fil des visites
var MEDIA_LIMIT = 40;  // max de fichiers audio gardés en cache (FIFO)

/* Fichiers indispensables au démarrage hors-ligne (install bloquante si l'un manque) */
var CRITICAL_ASSETS = [
  './',
  'index.html',
  'style.css',
  'mobile.css',
  'script.js',
  'season.js',
  'season.css',
  /* URLs versionnées réellement demandées par index.html (hors-ligne) */
  'style.css?v=37',
  'mobile.css?v=37',
  'script.js?v=37',
  'season.js?v=37',
  'season.css?v=37',
  'player-data.js',
  'anime-data.js',
  'manga-data.js',
  'journal-data.js',
  'books-data.js',
  'films-data.js',
  'series-data.js',
  'games-data.js',
  'music-data.js'
];

/* Fichiers secondaires : cachés en douceur, ne bloquent pas l'install */
var OPTIONAL_ASSETS = [
  'manifest.json',
  'pfp.jpg',
  'image.jpg',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-192.png',
  'icons/icon-maskable-512.png',
  'icons/apple-touch-icon.png'
];

/* ── Installation : précache du shell ─────────────────────────── */
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(SHELL_CACHE).then(function(cache) {
      var critical = cache.addAll(CRITICAL_ASSETS);
      var optional = Promise.all(
        OPTIONAL_ASSETS.map(function(url) {
          return cache.add(url).catch(function() { /* absent → on ignore */ });
        })
      );
      return Promise.all([critical, optional]);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

/* ── Activation : purge des vieux caches + prise de main ──────── */
self.addEventListener('activate', function(event) {
  var keep = [SHELL_CACHE, IMG_CACHE, MEDIA_CACHE, FONT_CACHE];
  event.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.map(function(name) {
          if (name.indexOf('slidou-') === 0 && keep.indexOf(name) === -1) {
            return caches.delete(name);
          }
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

/* ── Limitation FIFO d'un cache (anti-gonflement du quota) ────── */
function trimCache(cacheName, maxEntries) {
  caches.open(cacheName).then(function(cache) {
    cache.keys().then(function(keys) {
      if (keys.length <= maxEntries) return;
      var excess = keys.length - maxEntries;
      for (var i = 0; i < excess; i++) cache.delete(keys[i]);
    });
  });
}

/* ── Stratégies ───────────────────────────────────────────────── */

/* RÉSEAU D'ABORD : fraîcheur garantie, cache = filet de secours */
function networkFirst(request) {
  return caches.open(SHELL_CACHE).then(function(cache) {
    return fetch(request).then(function(response) {
      if (response && response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    }).catch(function() {
      return cache.match(request).then(function(cached) {
        return cached || cache.match('index.html') || Response.error();
      });
    });
  });
}

/* CACHE PUIS REVALIDATION : instantané + à jour au prochain passage */
function staleWhileRevalidate(request, cacheName) {
  return caches.open(cacheName).then(function(cache) {
    return cache.match(request).then(function(cached) {
      var network = fetch(request).then(function(response) {
        if (response && response.ok) {
          cache.put(request, response.clone());
        }
        return response;
      }).catch(function() {
        return null;
      });
      return cached || network.then(function(response) {
        return response || Response.error();
      });
    });
  });
}

/* AUDIO : cache d'abord + gestion des requêtes Range (206).
   L'API Cache refuse les réponses partielles : on met en cache le
   fichier COMPLET au premier passage, puis on découpe nous-mêmes
   les 206 à la volée → le player fonctionne hors-ligne. */
function audioHandler(request) {
  return caches.open(MEDIA_CACHE).then(function(cache) {
    return cache.match(request.url).then(function(cached) {
      if (cached) return serveRange(cached, request);
      /* Pas encore en cache : on télécharge le fichier complet */
      return fetch(request.url).then(function(response) {
        if (response && response.ok) {
          cache.put(request.url, response.clone());
          trimCache(MEDIA_CACHE, MEDIA_LIMIT);
        }
        return response;
      });
    });
  });
}

function serveRange(fullResponse, request) {
  var rangeHeader = request.headers.get('range');
  if (!rangeHeader) return fullResponse;
  var match = /bytes=(\d+)-(\d+)?/.exec(rangeHeader);
  if (!match) return fullResponse;
  var start = Number(match[1]);
  return fullResponse.arrayBuffer().then(function(buffer) {
    var total = buffer.byteLength;
    var end = match[2] ? Number(match[2]) : total - 1;
    var slice = buffer.slice(start, end + 1);
    return new Response(slice, {
      status: 206,
      statusText: 'Partial Content',
      headers: {
        'Content-Type': fullResponse.headers.get('Content-Type') || 'audio/mpeg',
        'Content-Range': 'bytes ' + start + '-' + (start + slice.byteLength - 1) + '/' + total,
        'Content-Length': String(slice.byteLength)
      }
    });
  });
}

/* CACHE D'ABORD : idéal pour l'immuable (images, polices) */
function cacheFirst(request, cacheName, limit) {
  return caches.open(cacheName).then(function(cache) {
    return cache.match(request).then(function(cached) {
      if (cached) return cached;
      return fetch(request).then(function(response) {
        var cacheable = response && (response.ok || response.type === 'opaque');
        if (cacheable) {
          cache.put(request, response.clone());
          if (limit) trimCache(cacheName, limit);
        }
        return response;
      });
    });
  });
}

/* ── Routage des requêtes ─────────────────────────────────────── */
self.addEventListener('fetch', function(event) {
  var request = event.request;
  if (request.method !== 'GET') return;

  var url = new URL(request.url);

  /* Page HTML → toujours à jour */
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }

  if (url.origin === self.location.origin) {
    /* Audio du player → cache d'abord + gestion Range (206) */
    if (request.destination === 'audio') {
      event.respondWith(audioHandler(request));
      return;
    }
    /* Images locales → cache d'abord */
    if (request.destination === 'image') {
      event.respondWith(cacheFirst(request, IMG_CACHE, IMG_LIMIT));
      return;
    }
    /* CSS / JS / données → instantané + revalidation */
    event.respondWith(staleWhileRevalidate(request, SHELL_CACHE));
    return;
  }

  /* Ressources distantes */
  if (request.destination === 'image') {
    event.respondWith(cacheFirst(request, IMG_CACHE, IMG_LIMIT));
    return;
  }
  if (request.destination === 'font' || request.destination === 'style') {
    event.respondWith(cacheFirst(request, FONT_CACHE, 0));
    return;
  }
  /* Tout le reste (scripts tiers…) : réseau, sans interception */
});
