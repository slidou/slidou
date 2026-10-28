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

var VERSION = 'v22';  // v22 : covers entières sur fond d'elles-mêmes flouté (continuité cover) + contours gem / coup de cœur rétablis
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
  'script.js',
  'season.js',
  'season.css',
  /* URLs versionnées réellement demandées par index.html (hors-ligne) */
  'season.js?v=18',
  'season.css?v=18',
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
