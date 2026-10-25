/* ═══════════════════════════════════════════════════════════════
   slidou.me — Thèmes saisonniers (v18)
   ─────────────────────────────────────────────────────────────
   • Halloween     : 24 oct → 2 nov   (spécial le 31 oct)
   • Noël          : 1er déc → 31 déc (spécial les 24-25 déc)
   • Saint-Valentin: 10 → 15 fév      (spécial le 14 fév)
   100 % cosmétique : une classe sur <body>, des particules à
   chute régulière, le bouton jour/nuit remplacé par l'emblème de
   la saison, des costumes SVG pour les perruches (perchoir ET
   cage), une ambiance dédiée (toile + araignée + chauve-souris à
   Halloween) et des eggs cachés. Rien d'autre n'est touché.
   Prévisualisation manuelle : ?season=halloween|noel|valentin|off
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var SEASONS = {
    halloween: {
      icon: '🎃', label: 'Joyeuse Halloween !',
      words: ['halloween'],
      burst: ['🍬', '🦇', '👻', '🎃']
    },
    noel: {
      icon: '🎄', label: 'Joyeux Noël !',
      words: ['noel', 'noël'],
      burst: ['🎁', '❄️', '🔔', '⭐']
    },
    valentin: {
      icon: '💝', label: 'Bonne Saint-Valentin !',
      words: ['valentin', 'amour', 'saint-valentin'],
      burst: ['❤️', '💖', '💘', '🌹']
    }
  };

  /* Fenêtres d'activation [mois, jour] — inclusives */
  var WINDOWS = {
    halloween: { from: [10, 24], to: [11, 2] },
    noel:      { from: [12, 1],  to: [12, 31] },
    valentin:  { from: [2, 10],   to: [2, 15] }
  };
  /* Jours "speciaux" : favicon + titre + pancarte */
  var SPECIAL_DAYS = {
    halloween: [[10, 31]],
    noel: [[12, 24], [12, 25]],
    valentin: [[2, 14]]
  };

  /* Chute régulière : spawn à intervalle FIXE (immersion), avec de
     la variance sur taille/vitesse/position pour l'aspect naturel */
  var PARTICLE_CONF = {
    halloween: { every: 640, dur: [9500, 13000], cap: 16 },
    noel:      { every: 480, dur: [11500, 15500], cap: 24 },
    valentin:  { every: 800, dur: [9500, 12500], cap: 13 }
  };

  var reducedMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ── Détection de la saison ─────────────────────────────────── */
  function d2(m, d) { return m * 100 + d; }

  function detectSeason() {
    var now = new Date();
    var n = d2(now.getMonth() + 1, now.getDate());
    for (var key in WINDOWS) {
      var w = WINDOWS[key];
      if (n >= d2(w.from[0], w.from[1]) && n <= d2(w.to[0], w.to[1])) return key;
    }
    return null;
  }

  function isSpecialDay(key) {
    var now = new Date();
    var list = SPECIAL_DAYS[key] || [];
    for (var i = 0; i < list.length; i++) {
      if (list[i][0] === now.getMonth() + 1 && list[i][1] === now.getDate()) return true;
    }
    return false;
  }

  /* Override manuel : ?season=halloween|noel|valentin|off */
  var forced = null;
  try {
    var qs = new URLSearchParams(location.search).get('season');
    if (qs && SEASONS[qs]) forced = qs;
    else if (qs === 'off' || qs === 'none') forced = 'off';
  } catch (e) { /* vieux navigateurs : tant pis */ }

  var seasonKey = (forced === 'off') ? null : (forced || detectSeason());
  if (!seasonKey) return;

  var def = SEASONS[seasonKey];
  var specialDay = !forced && isSpecialDay(seasonKey);

  document.body.classList.add('season-' + seasonKey);
  if (specialDay) document.body.classList.add('season-special');

  /* Exposé pour débogage console : slidouSeason.surprise() */
  window.slidouSeason = { key: seasonKey, special: specialDay, surprise: function () { seasonSurprise(); } };

  /* ── Jour spécial : favicon + titre de l'onglet ─────────────── */
  if (specialDay) {
    document.title = def.icon + ' ' + document.title;
    var fav = document.querySelector('link[rel="icon"]');
    if (fav) {
      fav.href = 'data:image/svg+xml,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">' + def.icon + '</text></svg>'
      );
    }
  }

  /* ── Particules : chute continue et régulière ───────────────── */
  function initParticles() {
    if (reducedMotion) return;
    var conf = PARTICLE_CONF[seasonKey];
    var layer = document.createElement('div');
    layer.id = 'season-particles';
    layer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(layer);

    var alive = 0;
    function spawn() {
      if (document.hidden || alive >= conf.cap) return;
      alive++;
      var p = document.createElement('div');
      p.className = 'sp sp-' + seasonKey;
      p.style.setProperty('--sp-dur', Math.round(conf.dur[0] + Math.random() * (conf.dur[1] - conf.dur[0])) + 'ms');
      p.style.setProperty('--sp-x', (Math.random() * 98).toFixed(2) + 'vw');
      p.style.setProperty('--sp-scale', (0.65 + Math.random() * 0.7).toFixed(2));
      p.style.setProperty('--sp-op', (0.45 + Math.random() * 0.45).toFixed(2));
      var sway = document.createElement('div');
      sway.className = 'sp-sway';
      sway.style.setProperty('--sw-dur', Math.round(2100 + Math.random() * 2100) + 'ms');
      sway.style.setProperty('--sw-x', Math.round(10 + Math.random() * 26) + 'px');
      if (seasonKey === 'halloween') sway.textContent = Math.random() < 0.75 ? '🍂' : '🍁';
      else if (seasonKey === 'valentin') sway.textContent = '♥';
      /* noel : flocon dessiné en CSS (rendu identique partout) */
      p.appendChild(sway);
      p.addEventListener('animationend', function () { alive--; p.remove(); });
      layer.appendChild(p);
    }

    /* pré-remplissage décalé : le ciel est déjà vivant à l'arrivée */
    var prefill = 10;
    for (var i = 0; i < prefill; i++) setTimeout(spawn, 150 + i * conf.every * 0.8);
    setInterval(spawn, conf.every);
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) spawn(); /* la machine repart en revenant */
    });
  }

  /* ── Pluie de burst (eggs) ──────────────────────────────────── */
  function burstEmojis(list, total) {
    total = reducedMotion ? Math.min(total || 18, 6) : (total || 18);
    for (var i = 0; i < total; i++) {
      (function (i) {
        setTimeout(function () {
          var el = document.createElement('div');
          el.className = 'season-burst';
          el.textContent = list[Math.floor(Math.random() * list.length)];
          el.style.left = (3 + Math.random() * 93).toFixed(1) + 'vw';
          el.style.fontSize = Math.round(16 + Math.random() * 16) + 'px';
          el.style.setProperty('--sp-dur', Math.round(2400 + Math.random() * 1600) + 'ms');
          document.body.appendChild(el);
          el.addEventListener('animationend', function () { el.remove(); });
        }, i * 85);
      })(i);
    }
  }

  /* ── Surprise (bouton saisonnier 3 clics, mots-clés, Konami) ── */
  var lastSurprise = 0;
  function budgieParade(flights, gap) {
    if (reducedMotion || typeof budgieWander !== 'function') return;
    for (var i = 0; i < flights; i++) {
      (function (i) {
        setTimeout(function () { try { budgieWander(); } catch (e) { /* rien */ } }, 300 + i * gap);
      })(i);
    }
  }

  function seasonSurprise() {
    var now = Date.now();
    if (now - lastSurprise < 4000) return;
    lastSurprise = now;
    burstEmojis(def.burst, 20);
    budgieParade(3, 1400);
  }

  /* ── Le bouton jour/nuit devient l'emblème de la saison ───────
     Pendant la saison, le mode est forcé par le thème : le bouton
     ne change plus rien, il fête la saison (et cache un egg).
     v17 : plus d'emoji « pop » à chaque clic — il était confondu
     avec un bug de dédoublement. Reste le wiggle + l'egg 3 clics. */
  function initSeasonToggle() {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    /* clone = détaché des listeners du site (plus de toggle) */
    var clone = btn.cloneNode(true);
    btn.parentNode.replaceChild(clone, btn);
    clone.textContent = def.icon;
    clone.title = 'Le thème de saison décide pour toi ' + def.icon;
    clone.setAttribute('aria-label', 'Thème de saison (mode jour/nuit désactivé)');
    var clicks = 0, timer = null;
    clone.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation(); /* aucun autre handler (même délégué) ne réagit */
      clone.classList.remove('season-wiggle');
      void clone.offsetWidth;
      clone.classList.add('season-wiggle');
      clicks++;
      clearTimeout(timer);
      timer = setTimeout(function () { clicks = 0; }, 1500);
      if (clicks >= 3) { clicks = 0; lastSurprise = 0; seasonSurprise(); }
    });
  }

  /* ── Costumes SVG : la tête est à (50,35) r=18 dans les deux
     rendus (perchoir ambiant et cage) → on dessine le costume
     DANS le SVG : il suit les animations de tête, s'adapte aux
     tailles, et marche aussi pour les perruches en cage. ──────── */
  var CST = {
    halloween: /* chapeau de sorcière */
      '<g transform="rotate(-12 50 16)"><g class="season-cst-anim">' +
      '<ellipse cx="50" cy="17.5" rx="15" ry="4" fill="#38235f"/>' +
      '<path d="M43,16 L57,16 L52.5,1.5 Z" fill="#4a2f7a"/>' +
      '<rect x="43.6" y="11.6" width="12.8" height="3" rx="1.2" fill="#ff9a3d"/>' +
      '</g></g>',
    noel: /* écharpe tricotée */
      '<g class="season-cst-anim">' +
      '<ellipse cx="50" cy="51" rx="14.5" ry="4.6" fill="#c0392b"/>' +
      '<rect x="41.5" y="50" width="7" height="14" rx="2.5" fill="#c0392b"/>' +
      '<rect x="41.5" y="55.5" width="7" height="2.1" fill="#f5f0e6" opacity=".92"/>' +
      '<rect x="41.5" y="60" width="7" height="2.1" fill="#f5f0e6" opacity=".92"/>' +
      '</g>',
    valentin: /* petit cœur qui flotte au-dessus de la tête */
      '<g class="season-cst-anim season-cst-float">' +
      '<path d="M50 5.6 C47.6 1.8 42 2.8 42 7.4 C42 11 46.2 13.4 50 15.8 C53.8 13.4 58 11 58 7.4 C58 2.8 52.4 1.8 50 5.6 Z" fill="#ff5b8d"/>' +
      '</g>'
  };

  function dressSVG(svg) {
    if (!svg || svg.classList.contains('season-dressed')) return;
    /* garde-fou : seuls les SVG d'oiseau (viewBox 100×100) sont
       habillés — le perchoir (90×16) et autres décorations passent */
    if (svg.getAttribute('viewBox') !== '0 0 100 100') return;
    svg.classList.add('season-dressed');
    if (seasonKey === 'halloween') {
      /* dans le groupe tête : le chapeau suit quand elle regarde autour */
      var head = svg.querySelector('.ab-head');
      if (head) { head.insertAdjacentHTML('beforeend', CST[seasonKey]); return; }
    }
    if (seasonKey === 'noel') {
      var all = svg.querySelector('.ab-all') || svg; /* suit la respiration */
      all.insertAdjacentHTML('beforeend', CST[seasonKey]); return;
    }
    svg.insertAdjacentHTML('beforeend', CST[seasonKey]);
  }

  function initCostumes() {
    function dress() {
      /* v18 : ONLY the bird SVGs — #budgie-ambient svg also matched
         .ba-perch (viewBox 0 0 90 16): the hat fell back to the svg
         root and was drawn ON the perch, at the bird's feet. */
      var svgs = document.querySelectorAll(
        '#budgie-ambient .ba-bird-holder svg, #wrapper-pistachio > svg, #wrapper-cielazur > svg'
      );
      for (var i = 0; i < svgs.length; i++) dressSVG(svgs[i]);
    }
    dress();
    var pending = false;
    var mo = new MutationObserver(function () {
      if (pending) return;
      pending = true;
      requestAnimationFrame(function () { pending = false; dress(); });
    });
    try { mo.observe(document.body, { childList: true, subtree: true }); } catch (e) { /* rien */ }
  }

  /* ── Ambiance Halloween : toile, araignée, chauve-souris ────── */
  function initAmbience() {
    if (seasonKey !== 'halloween') return;
    /* toile d'araignée dans le coin haut-droit */
    var web = document.createElement('div');
    web.className = 'season-web';
    web.setAttribute('aria-hidden', 'true');
    document.body.appendChild(web);
    if (reducedMotion) return;
    /* une araignée qui monte et descend de sa toile */
    var sp = document.createElement('div');
    sp.className = 'season-spider';
    sp.setAttribute('aria-hidden', 'true');
    sp.innerHTML = '<div class="spt"></div><div class="spb">🕷️</div>';
    document.body.appendChild(sp);
    /* une chauve-souris de passage, de temps en temps */
    function bat() {
      if (!document.hidden) {
        var b = document.createElement('div');
        b.className = 'season-bat';
        b.textContent = '🦇';
        b.setAttribute('aria-hidden', 'true');
        document.body.appendChild(b);
        b.addEventListener('animationend', function () { b.remove(); });
        setTimeout(function () { if (b.parentNode) b.remove(); }, 13000);
      }
      setTimeout(bat, 24000 + Math.random() * 26000);
    }
    setTimeout(bat, 8000 + Math.random() * 9000);
  }

  /* ── Pancarte des jours spéciaux ────────────────────────────── */
  function initChip() {
    if (!specialDay) return;
    var chip = document.createElement('div');
    chip.className = 'season-chip';
    chip.setAttribute('aria-hidden', 'true');
    chip.innerHTML = '<span class="sc-emoji">' + def.icon + '</span><span>' + def.label + '</span>';
    document.body.appendChild(chip);
  }

  /* ── Guirlande lumineuse (Noël) ─────────────────────────────── */
  function initGarland() {
    if (seasonKey !== 'noel') return;
    var g = document.createElement('div');
    g.className = 'season-garland';
    g.setAttribute('aria-hidden', 'true');
    var colors = ['#e05555', '#f0c75e', '#5fae6f', '#6b9bd1', '#c77bb8'];
    var html = '';
    for (var i = 0; i < 28; i++) {
      html += '<span style="background:' + colors[i % colors.length] + ';animation-delay:' + (i * 0.23).toFixed(2) + 's"></span>';
    }
    g.innerHTML = html;
    document.body.appendChild(g);
  }

  /* ── Egg recherche globale : taper le mot de la saison ──────── */
  function stripAccents(s) { return s.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }

  function initSearchEgg() {
    var input = document.getElementById('palette-input');
    if (!input) return;
    var words = def.words.map(stripAccents);
    var done = {};
    input.addEventListener('input', function () {
      var v = stripAccents((input.value || '').trim().toLowerCase());
      if (words.indexOf(v) === -1) return;
      var now = Date.now();
      if (now - (done[v] || 0) < 30000) return;
      done[v] = now;
      lastSurprise = 0;
      seasonSurprise();
    });
  }

  /* ── Egg Konami : la perruche fait sa parade ────────────────── */
  var KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
  var kIdx = 0;
  document.addEventListener('keydown', function (e) {
    var k = (e.key || '').toLowerCase();
    kIdx = (k === KONAMI[kIdx]) ? kIdx + 1 : (k === KONAMI[0] ? 1 : 0);
    if (kIdx !== KONAMI.length) return;
    kIdx = 0;
    lastSurprise = 0;
    seasonSurprise();
    budgieParade(2, 1500); /* elle enchaîne avec deux vols bonus */
  });

  /* ── Lancement ──────────────────────────────────────────────── */
  function init() {
    initParticles();
    initCostumes();
    initSeasonToggle();
    initAmbience();
    initChip();
    initGarland();
    initSearchEgg();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
